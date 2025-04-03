import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import PostSkeleton from "@/components/PostSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GuidePost {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  author: string;
  published_at: string;
  categories: string[];
  slug: string;
  post_type: string;
  featured: boolean;
}

const Guides = () => {
  const [guides, setGuides] = useState<GuidePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("post_type", "guide")
        .order("published_at", { ascending: false });

      if (error) {
        toast.error("Error fetching guides: " + error.message);
        return;
      }

      // Format the data to match what we need
      const formattedGuides = data.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || "",
        image_url: post.image_url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341",
        author: post.author,
        published_at: post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) : "No date",
        categories: post.categories || [],
        slug: post.slug,
        post_type: post.post_type,
        featured: post.featured || false
      }));

      setGuides(formattedGuides);
    } catch (err) {
      console.error("Error fetching guides:", err);
      toast.error("Failed to load guides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 dark:text-white">Automotive Guides</h1>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {[1, 2, 3].map((item) => (
                <PostSkeleton key={item} />
              ))}
            </div>
          ) : guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {guides.map((item) => (
                <BlogCard 
                  key={item.id} 
                  title={item.title}
                  excerpt={item.excerpt}
                  image={item.image_url}
                  author={item.author}
                  date={item.published_at}
                  categories={item.categories}
                  slug={item.slug}
                  postType={item.post_type}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-300">No guides found. Check back later for updates.</p>
            </div>
          )}

          <div className="bg-primary rounded-xl p-8 mb-16">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Get Expert Tips</h2>
              <p className="text-white/90">Subscribe to receive our latest automotive guides</p>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Guides;
