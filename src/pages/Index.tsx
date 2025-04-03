
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import NewsletterSignup from "@/components/NewsletterSignup";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  author: string;
  created_at: string;
  categories: string[];
  slug: string;
  post_type: string;
  featured: boolean;
}

const Index = () => {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      // First, try to fetch a featured post
      const { data: featuredData, error: featuredError } = await supabase
        .from("posts")
        .select("*")
        .eq("featured", true)
        .limit(1)
        .single();

      if (featuredError && featuredError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        toast.error("Error fetching featured post");
        console.error("Error fetching featured post:", featuredError);
      }

      // Fetch regular posts (not featured)
      const { data: regularData, error: regularError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (regularError) {
        toast.error("Error fetching posts");
        console.error("Error fetching posts:", regularError);
        return;
      }

      // If we found a featured post, set it
      if (featuredData) {
        setFeaturedPost(featuredData as Post);
        
        // Filter out the featured post from regular posts if it's included
        if (regularData) {
          const filteredPosts = regularData.filter(post => post.id !== featuredData.id);
          setPosts(filteredPosts as Post[]);
        }
      } else if (regularData && regularData.length > 0) {
        // If no featured post, use the first post as featured and the rest as regular
        setFeaturedPost(regularData[0] as Post);
        setPosts(regularData.slice(1) as Post[]);
      }
    } catch (error) {
      toast.error("Error fetching posts");
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime changes
    const channel = supabase.channel('schema-db-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'posts'
    }, () => {
      // Refetch posts when any change occurs
      fetchPosts();
    }).subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] to-[#403E43] opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative px-4 py-32 sm:py-40 md:py-48">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Your Ultimate Guide to the Automotive World
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Join GearUp, your premier destination for automotive news, reviews, and insights. 
              From classic cars to cutting-edge EVs, we've got you covered.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/reviews">
                <Button className="rounded-full bg-white hover:bg-white/90 text-primary px-8 py-6 text-lg">
                  Explore Reviews
                </Button>
              </Link>
              <Link to="/news">
                <Button variant="outline" className="rounded-full bg-white hover:bg-white/90 text-primary px-8 py-6 text-lg">
                  Latest News
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Featured Post */}
        {featuredPost && <div className="mb-24">
            <h2 className="section-title">Featured Story</h2>
            <div className="glass-card rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-w-16 aspect-h-9 md:aspect-h-full">
                  <img src={featuredPost.image_url || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7"} alt={featuredPost.title} className="object-cover w-full h-full" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex gap-2 mb-4">
                    {featuredPost.categories?.map(category => <span key={category} className="text-xs font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full">
                        {category}
                      </span>)}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 dark:text-white">{featuredPost.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
                    <span className="font-medium">{featuredPost.author}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(featuredPost.created_at).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}</span>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <Button size="lg" className="rounded-full px-8 py-6">Read More</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>}

        {/* Latest Posts */}
        <div>
          <div className="flex justify-between items-center mb-12">
            <h2 className="section-title">Latest Stories</h2>
            <div className="flex gap-2">
              <Link to="/reviews">
                <Button variant="outline" className="rounded-full dark:border-gray-700 dark:text-gray-300">Reviews</Button>
              </Link>
              <Link to="/guides">
                <Button variant="outline" className="rounded-full dark:border-gray-700 dark:text-gray-300">Guides</Button>
              </Link>
              <Link to="/news">
                <Button variant="outline" className="rounded-full dark:border-gray-700 dark:text-gray-300">News</Button>
              </Link>
            </div>
          </div>
          {loading ? <div className="text-center py-12 dark:text-white">Loading posts...</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => <BlogCard key={post.id} title={post.title} excerpt={post.excerpt || ""} image={post.image_url || "https://images.unsplash.com/photo-1555215695-3004980ad54e"} author={post.author} date={new Date(post.created_at).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })} categories={post.categories || []} slug={post.slug} postType={post.post_type} />)}
            </div>}
        </div>
        
        {/* Newsletter Section */}
        <div className="mt-32 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">Stay in the Loop</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter for the latest automotive news, reviews, and exclusive content delivered directly to your inbox.
          </p>
          <NewsletterSignup />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
