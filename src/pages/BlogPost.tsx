
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ArrowLeft, Share2, Clock, Check, Copy } from "lucide-react";
import { toast } from "sonner";

import PostSkeleton from "@/components/PostSkeleton";
import PostAuthorCard from "@/components/PostAuthorCard";
import PostReactions from "@/components/PostReactions";
import PostContent from "@/components/PostContent";
import CarSpecifications from "@/components/CarSpecifications";
import { useState } from "react";
import Footer from "@/components/Footer";

const BlogPost = () => {
  const { slug } = useParams();
  const [isCopied, setIsCopied] = useState(false);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      console.log("Fetching post with slug:", slug);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          car_specifications (*)
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Post data received:", data);
      return data;
    },
  });

  // Function to handle sharing
  const handleShare = async () => {
    // Check if navigator.share is available (mainly mobile browsers)
    if (navigator?.share) {
      try {
        await navigator.share({
          title: post?.title || 'Car Blog Post',
          text: post?.excerpt || 'Check out this car blog post',
          url: window.location.href,
        });
        toast.success("Successfully shared!");
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        copyToClipboard();
      }
    } else {
      // Fallback for desktop browsers
      copyToClipboard();
    }
  };

  // Helper function to copy URL to clipboard
  const copyToClipboard = () => {
    // Check if clipboard API is available
    if (!navigator?.clipboard) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";  // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          showCopiedSuccess();
        } else {
          toast.error("Unable to copy link");
        }
      } catch (err) {
        console.error("Fallback copy failed:", err);
        toast.error("Failed to copy link");
      }
      return;
    }

    // Modern browsers - use clipboard API
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        showCopiedSuccess();
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy link");
      });
  };

  const showCopiedSuccess = () => {
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-8 md:py-16">
          <PostSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    console.error("Error or no post found:", error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center animate-enter">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">Post not found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle Supabase's nested array format for car specifications
  const carSpecs = Array.isArray(post.car_specifications) 
    ? post.car_specifications[0] 
    : post.car_specifications;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Helmet>
        <title>{post.title} | Car Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt} />
        <meta property="og:image" content={post.image_url} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Navbar />
      
      <article className="relative animate-enter">
        {/* Hero section with full-width image */}
        <div className="w-full h-[40vh] md:h-[60vh] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-10"></div>
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
            <div className="container mx-auto">
              <div className="flex gap-2 mb-4">
                {post.categories && post.categories.map((category: string) => (
                  <span
                    key={category}
                    className="text-xs font-medium px-3 py-1 bg-primary/90 text-white rounded-full backdrop-blur-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl text-balance">
                {post.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4 -mt-10 relative z-20">
          <div className="bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-sm dark:shadow-gray-900/30 p-6 md:p-10 mb-8 transition-colors duration-300 animate-enter">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                {/* Back button and metadata */}
                <div className="flex justify-between items-center mb-8">
                  <Link to="/" className="flex items-center text-primary hover:text-primary/80 transition-colors">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="font-medium">Back to all posts</span>
                  </Link>
                  
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock size={16} className="mr-1" />
                    <span className="text-sm">
                      {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="ml-4 gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Share this post" 
                      onClick={handleShare}
                    >
                      {isCopied ? <Check size={16} /> : <Share2 size={16} />}
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                  </div>
                </div>

                {/* Post content */}
                <div className="prose prose-lg lg:prose-xl max-w-none dark:prose-invert prose-a:text-primary dark:prose-a:text-blue-400 prose-img:rounded-lg transition-colors duration-300">
                  <PostContent content={post.content} />
                </div>

                {/* Car specifications for review posts */}
                {post.post_type === 'review' && carSpecs && (
                  <div className="mt-12 animate-enter" style={{animationDelay: "200ms"}}>
                    <CarSpecifications specifications={carSpecs} />
                  </div>
                )}

                {/* Reactions section (replacing comments) */}
                <div className="mt-16 animate-enter" style={{animationDelay: "300ms"}}>
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">What do you think?</h2>
                  <PostReactions postId={post.id} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-80 mt-8 lg:mt-0">
                <div className="sticky top-24 animate-enter" style={{animationDelay: "150ms"}}>
                  <PostAuthorCard 
                    author={post.author} 
                    date={post.published_at ? format(new Date(post.published_at), 'PPP') : ''} 
                  />
                  
                  {/* Additional sidebar content can be added here */}
                  <div className="mt-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
                    <h3 className="font-bold text-lg mb-4 dark:text-white">More from {post.author}</h3>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Follow for more car insights and reviews.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
