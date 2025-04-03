import { useState, useEffect } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import AdminLogin from "@/components/AdminLogin";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  Calendar, LineChart as LineChartIcon, TrendingUp, Target, Clock, 
  FileText, BarChart2, PenTool, Plus, Edit, Trash2, Settings,
  LayoutDashboard, BookOpen, MessageSquare, Users, Eye, Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface CarSpecifications {
  make: string;
  model: string;
  year: number;
  engine_type?: string;
  horsepower?: number;
  torque?: string;
  transmission?: string;
  acceleration_0_60?: number;
  top_speed?: number;
  fuel_economy?: string;
  price_range?: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  author: string;
  categories: string[];
  meta_description: string | null;
  views: number;
  reading_time_minutes: number;
  published_at: string | null;
  post_type: 'review' | 'news' | 'guide';
  car_specifications?: CarSpecifications;
  featured: boolean;
}

interface NewPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  categories: string;
  meta_description: string;
  post_type: 'review' | 'news' | 'guide';
  car_specifications?: CarSpecifications;
  featured: boolean;
}

interface PostSchedule {
  date: string;
  count: number;
}

interface PostTrend {
  date: string;
  views: number;
  engagement: number;
}

interface DashboardStats {
  totalPosts: number;
  totalViews: number;
  averageReadingTime: number;
  postsByType: { name: string; count: number }[];
  viewsByType: { name: string; views: number }[];
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const COLORS = ['#8B5CF6', '#00C49F', '#FFBB28'];

const renderCarSpecificationsForm = (
  isEditing: boolean,
  post: NewPost | Post,
  onUpdate: (specs: CarSpecifications) => void
) => {
  if (post.post_type !== 'review') return null;

  const specs = post.car_specifications || {} as CarSpecifications;

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Car Specifications
        </CardTitle>
        <CardDescription>Required for review posts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Make"
            value={specs.make || ''}
            onChange={(e) => onUpdate({ ...specs, make: e.target.value })}
            required
          />
          <Input
            placeholder="Model"
            value={specs.model || ''}
            onChange={(e) => onUpdate({ ...specs, model: e.target.value })}
            required
          />
          <Input
            placeholder="Year"
            type="number"
            value={specs.year || ''}
            onChange={(e) => onUpdate({ ...specs, year: parseInt(e.target.value) })}
            required
          />
          <Input
            placeholder="Engine Type"
            value={specs.engine_type || ''}
            onChange={(e) => onUpdate({ ...specs, engine_type: e.target.value })}
          />
          <Input
            placeholder="Horsepower"
            type="number"
            value={specs.horsepower || ''}
            onChange={(e) => onUpdate({ ...specs, horsepower: parseInt(e.target.value) })}
          />
          <Input
            placeholder="Torque"
            value={specs.torque || ''}
            onChange={(e) => onUpdate({ ...specs, torque: e.target.value })}
          />
          <Input
            placeholder="Transmission"
            value={specs.transmission || ''}
            onChange={(e) => onUpdate({ ...specs, transmission: e.target.value })}
          />
          <Input
            placeholder="0-60 mph (seconds)"
            type="number"
            step="0.1"
            value={specs.acceleration_0_60 || ''}
            onChange={(e) => onUpdate({ ...specs, acceleration_0_60: parseFloat(e.target.value) })}
          />
          <Input
            placeholder="Top Speed (mph)"
            type="number"
            value={specs.top_speed || ''}
            onChange={(e) => onUpdate({ ...specs, top_speed: parseInt(e.target.value) })}
          />
          <Input
            placeholder="Fuel Economy"
            value={specs.fuel_economy || ''}
            onChange={(e) => onUpdate({ ...specs, fuel_economy: e.target.value })}
          />
          <Input
            placeholder="Price Range"
            value={specs.price_range || ''}
            onChange={(e) => onUpdate({ ...specs, price_range: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    author: "",
    categories: "",
    meta_description: "",
    post_type: "news",
    car_specifications: undefined,
    featured: false,
  });
  
  const [stats, setStats] = useState<DashboardStats>({
    postsByType: [],
    viewsByType: [],
    totalViews: 0,
    totalPosts: 0,
    averageReadingTime: 0
  });

  const [postSchedule, setPostSchedule] = useState<PostSchedule[]>([]);
  const [postTrends, setPostTrends] = useState<PostTrend[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [bestPostingTime, setBestPostingTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (posts.length > 0) {
      calculateStats();
      calculatePostSchedule();
      analyzePostTrends();
      generateAiSuggestions();
      setIsLoading(false);
    }
  }, [posts]);

  const calculateStats = () => {
    const postTypes = ['review', 'news', 'guide'] as const;
    const postsByType = postTypes.map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: posts.filter(post => post.post_type === type).length
    }));

    const viewsByType = postTypes.map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      views: posts
        .filter(post => post.post_type === type)
        .reduce((sum, post) => sum + (post.views || 0), 0)
    }));

    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalPosts = posts.length;
    const totalReadingTime = posts.reduce((sum, post) => sum + (post.reading_time_minutes || 0), 0);
    const averageReadingTime = totalPosts > 0 ? Math.round(totalReadingTime / totalPosts) : 0;

    setStats({
      postsByType,
      viewsByType,
      totalViews,
      totalPosts,
      averageReadingTime
    });
  };

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          car_specifications (*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Error fetching posts: " + error.message);
        return;
      }

      const validatedPosts = (data || []).map(post => ({
        ...post,
        post_type: validatePostType(post.post_type),
        car_specifications: post.car_specifications?.[0] || null,
        featured: post.featured || false
      })) as Post[];

      setPosts(validatedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const validatePostType = (type: string): 'review' | 'news' | 'guide' => {
    if (type === 'review' || type === 'news' || type === 'guide') {
      return type;
    }
    return 'news'; // Default fallback
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const readingTime = calculateReadingTime(newPost.content);
    
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert([{
        title: newPost.title,
        slug: newPost.slug,
        content: newPost.content,
        excerpt: newPost.excerpt,
        image_url: newPost.image_url,
        author: newPost.author,
        categories: newPost.categories.split(",").map((cat) => cat.trim()),
        meta_description: newPost.meta_description,
        post_type: newPost.post_type,
        reading_time_minutes: readingTime,
        views: 0,
        published_at: new Date().toISOString(),
        featured: newPost.featured,
      }])
      .select()
      .single();

    if (postError || !postData) {
      toast.error("Error creating post: " + postError?.message);
      return;
    }

    if (newPost.post_type === 'review' && newPost.car_specifications) {
      const { make, model, year } = newPost.car_specifications;
      
      if (!make || !model || !year) {
        toast.error("Make, model, and year are required for car specifications");
        return;
      }
      
      const { error: specError } = await supabase
        .from("car_specifications")
        .insert([{
          ...newPost.car_specifications,
          post_id: postData.id,
        }]);

      if (specError) {
        toast.error("Error creating car specifications: " + specError.message);
        return;
      }
    }

    toast.success("Post created successfully");
    setNewPost({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image_url: "",
      author: "",
      categories: "",
      meta_description: "",
      post_type: "news",
      car_specifications: undefined,
      featured: false,
    });
    fetchPosts();
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    const readingTime = calculateReadingTime(editingPost.content);
    
    let categories: string[];
    if (typeof editingPost.categories === 'string') {
      categories = (editingPost.categories as string).split(',').map(cat => cat.trim());
    } else if (Array.isArray(editingPost.categories)) {
      categories = editingPost.categories;
    } else {
      categories = [];
    }

    const { error: postError } = await supabase
      .from("posts")
      .update({
        title: editingPost.title,
        slug: editingPost.slug,
        content: editingPost.content,
        excerpt: editingPost.excerpt,
        image_url: editingPost.image_url,
        author: editingPost.author,
        categories: categories,
        meta_description: editingPost.meta_description,
        post_type: editingPost.post_type,
        reading_time_minutes: readingTime,
        featured: editingPost.featured,
      })
      .eq("id", editingPost.id);

    if (postError) {
      toast.error("Error updating post: " + postError.message);
      return;
    }

    if (editingPost.post_type === 'review' && editingPost.car_specifications) {
      const { make, model, year } = editingPost.car_specifications;
      
      if (!make || !model || !year) {
        toast.error("Make, model, and year are required for car specifications");
        return;
      }
      
      const { error: specError } = await supabase
        .from("car_specifications")
        .upsert({
          ...editingPost.car_specifications,
          post_id: editingPost.id,
        });

      if (specError) {
        toast.error("Error updating car specifications: " + specError.message);
        return;
      }
    }

    toast.success("Post updated successfully");
    setEditingPost(null);
    fetchPosts();
  };

  const handleDeletePost = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      toast.error("Error deleting post: " + error.message);
      return;
    }

    toast.success("Post deleted successfully");
    fetchPosts();
  };

  const calculatePostSchedule = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const schedule = last30Days.map(date => ({
      date,
      count: posts.filter(post => 
        post.published_at?.split('T')[0] === date
      ).length
    }));

    setPostSchedule(schedule);
  };

  const analyzePostTrends = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const trends = last7Days.map(date => {
      const postsOnDate = posts.filter(post => 
        post.published_at?.split('T')[0] === date
      );
      
      const views = postsOnDate.reduce((sum, post) => sum + (post.views || 0), 0);
      
      const engagement = postsOnDate.reduce((sum, post) => {
        const postViews = post.views || 0;
        const readingTime = post.reading_time_minutes || 1;
        return sum + (postViews * Math.log(readingTime + 1) * 2);
      }, 0);

      return {
        date,
        views,
        engagement: Math.round(engagement)
      };
    });

    setPostTrends(trends);
  };

  const generateAiSuggestions = () => {
    const postTypeCount = {
      review: posts.filter(post => post.post_type === 'review').length,
      news: posts.filter(post => post.post_type === 'news').length,
      guide: posts.filter(post => post.post_type === 'guide').length
    };

    const mostPopularType = Object.entries(postTypeCount)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    const leastPopularType = Object.entries(postTypeCount)
      .sort((a, b) => a[1] - b[1])[0][0];

    const categoriesCount: Record<string, number> = {};
    posts.forEach(post => {
      if (Array.isArray(post.categories)) {
        post.categories.forEach(category => {
          categoriesCount[category] = (categoriesCount[category] || 0) + 1;
        });
      }
    });
    
    const popularCategories = Object.entries(categoriesCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    const suggestions = [
      `Consider writing more ${leastPopularType} content to balance your content types`,
      `${mostPopularType.charAt(0).toUpperCase() + mostPopularType.slice(1)} posts are performing well, continue this trend`,
      popularCategories.length > 0 ? 
        `Popular categories: ${popularCategories.join(', ')}. Consider more content in these areas` : 
        "Try adding categories to your posts to track topic performance",
      "Analyze post length vs. engagement to find the optimal content length for your audience"
    ];

    setAiSuggestions(suggestions);

    const postsWithViews = posts.filter(post => post.views && post.views > 0);
    const publishTimes = postsWithViews.map(post => {
      const time = post.published_at ? new Date(post.published_at).getHours() : 0;
      return { time, views: post.views || 0 };
    });

    const viewsByHour: Record<number, {total: number, count: number}> = {};
    publishTimes.forEach(({ time, views }) => {
      if (!viewsByHour[time]) {
        viewsByHour[time] = { total: 0, count: 0 };
      }
      viewsByHour[time].total += views;
      viewsByHour[time].count += 1;
    });

    let bestHour = 12;
    let maxAvgViews = 0;
    Object.entries(viewsByHour).forEach(([hour, data]) => {
      const avgViews = data.total / data.count;
      if (avgViews > maxAvgViews) {
        maxAvgViews = avgViews;
        bestHour = parseInt(hour);
      }
    });

    setBestPostingTime(`${bestHour}:00`);
  };

  const toggleFeaturePost = async (post: Post) => {
    try {
      if (!post.featured) {
        await supabase
          .from("posts")
          .update({ featured: false })
          .eq("featured", true);
      }
      
      const { error } = await supabase
        .from("posts")
        .update({ featured: !post.featured })
        .eq("id", post.id);
      
      if (error) {
        toast.error("Error updating featured status: " + error.message);
        return;
      }
      
      toast.success(post.featured ? "Post unfeatured" : "Post set as featured");
      fetchPosts();
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const getPostTypeColor = (type: string) => {
    switch(type) {
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'news': return 'bg-blue-100 text-blue-800';
      case 'guide': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Loading analytics data...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalPosts}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalViews}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Reading Time</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.averageReadingTime} min</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                  <MessageSquare className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Post Types</p>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.postsByType.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardHeader>
              <CardTitle className="text-lg">Posts by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.postsByType}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.postsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '4px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardHeader>
              <CardTitle className="text-lg">Views by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.viewsByType}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="currentColor" />
                    <YAxis stroke="currentColor" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '4px', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="views" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="md:col-span-4 bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Content Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                    <span className="text-purple-600 dark:text-purple-400 shrink-0">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Based on your content performance and publishing patterns
              </p>
            </CardFooter>
          </Card>

          <Card className="md:col-span-8 bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Engagement Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={postTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="currentColor" />
                    <YAxis stroke="currentColor" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', border: 'none', borderRadius: '4px', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#8B5CF6" />
                    <Line type="monotone" dataKey="engagement" stroke="#10B981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex justify-between w-full text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Best posting time: <strong>{bestPostingTime}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Most active day: <strong>{postTrends.length > 0 && 
                    new Date(postTrends.sort((a, b) => b.views - a.views)[0].date).toLocaleDateString('en-US', {weekday: 'long'})}</strong></span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/40 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <Button variant="destructive" onClick={logout} className="flex items-center gap-2">
            Logout
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white dark:bg-gray-800/50 dark:text-gray-200">
            <TabsTrigger value="dashboard" className="text-sm flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:dark:bg-gray-700/60">
              <BarChart2 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="create" className="text-sm flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:dark:bg-gray-700/60">
              <PenTool className="w-4 h-4" />
              Create Post
            </TabsTrigger>
            <TabsTrigger value="manage" className="text-sm flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:dark:bg-gray-700/60">
              <FileText className="w-4 h-4" />
              Manage Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {renderDashboardContent()}
          </TabsContent>

          <TabsContent value="create">
            <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Post
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Fill in the details to create a new blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      required
                      className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    />
                    <Input
                      placeholder="Slug"
                      value={newPost.slug}
                      onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                      required
                      className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="w-full">
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700"
                        value={newPost.post_type}
                        onChange={(e) => setNewPost({ 
                          ...newPost, 
                          post_type: e.target.value as 'review' | 'news' | 'guide',
                          car_specifications: e.target.value === 'review' ? {} as CarSpecifications : undefined
                        })}
                      >
                        <option value="news">News</option>
                        <option value="review">Car Review</option>
                        <option value="guide">Guide</option>
                      </select>
                    </div>
                    <Input
                      placeholder="Author"
                      value={newPost.author}
                      onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                      required
                      className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    />
                    <Input
                      placeholder="Categories (comma-separated)"
                      value={newPost.categories}
                      onChange={(e) => setNewPost({ ...newPost, categories: e.target.value })}
                      className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    />
                  </div>
                  
                  <Input
                    placeholder="Image URL"
                    value={newPost.image_url}
                    onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                    className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                  />
                  
                  <Textarea
                    placeholder="Excerpt (brief summary)"
                    value={newPost.excerpt}
                    onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                    className="h-20 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                  />
                  
                  <Textarea
                    placeholder="Content (main body of post)"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    className="h-40 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    required
                  />
                  
                  <Textarea
                    placeholder="Meta Description (for SEO)"
                    value={newPost.meta_description}
                    onChange={(e) => setNewPost({ ...newPost, meta_description: e.target.value })}
                    className="h-20 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                  />
                  
                  {renderCarSpecificationsForm(false, newPost, (specs) => 
                    setNewPost({ ...newPost, car_specifications: specs })
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured-toggle-new"
                      checked={newPost.featured}
                      onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    />
                    <label htmlFor="featured-toggle-new" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300">
                      Feature this post on the homepage
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto hover:bg-primary/90 transition-colors">Create Post</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            {editingPost && (
              <Card className="mb-8 bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Edit Post
                  </CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Update the details of your post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdatePost} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Title"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        required
                        className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                      />
                      <Input
                        placeholder="Slug"
                        value={editingPost.slug}
                        onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                        required
                        className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="w-full">
                        <select
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700"
                          value={editingPost.post_type}
                          onChange={(e) => setEditingPost({ 
                            ...editingPost, 
                            post_type: e.target.value as 'review' | 'news' | 'guide',
                            car_specifications: e.target.value === 'review' ? {} as CarSpecifications : undefined
                          })}
                        >
                          <option value="news">News</option>
                          <option value="review">Car Review</option>
                          <option value="guide">Guide</option>
                        </select>
                      </div>
                      <Input
                        placeholder="Author"
                        value={editingPost.author}
                        onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                        required
                        className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                      />
                      <Input
                        placeholder="Categories (comma-separated)"
                        value={typeof editingPost.categories === 'string' ? 
                          editingPost.categories : 
                          editingPost.categories?.join(", ") || ""}
                        onChange={(e) => setEditingPost({
                          ...editingPost,
                          categories: e.target.value.split(",").map((cat) => cat.trim()),
                        })}
                        className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                      />
                    </div>
                    
                    <Input
                      placeholder="Image URL"
                      value={editingPost.image_url || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                      className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    />
                    
                    <Textarea
                      placeholder="Excerpt (brief summary)"
                      value={editingPost.excerpt || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                      className="h-20 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    />
                    
                    <Textarea
                      placeholder="Content (main body of post)"
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      className="h-40 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                      required
                    />
                    
                    <Textarea
                      placeholder="Meta Description (for SEO)"
                      value={editingPost.meta_description || ""}
                      onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })}
                      className="h-20 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:placeholder:text-gray-500"
                    />
                    
                    {renderCarSpecificationsForm(true, editingPost, (specs) => 
                      setEditingPost({ ...editingPost, car_specifications: specs })
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured-toggle-edit"
                        checked={editingPost.featured || false}
                        onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                      />
                      <label htmlFor="featured-toggle-edit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300">
                        Feature this post on the homepage
                      </label>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" className="hover:bg-primary/90 transition-colors">Update Post</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditingPost(null)}
                        className="dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700/50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white dark:bg-gray-900/40 dark:text-gray-100 dark:border-gray-800/50 elevated-card">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Manage Posts
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                  View, edit or delete your posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">No posts found</p>
                  ) : (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className="border dark:border-gray-800/50 p-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white dark:bg-gray-900/40 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{post.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPostTypeColor(post.post_type)}`}>
                              {post.post_type}
                            </span>
                            {post.featured && (
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            By {post.author} | {Array.isArray(post.categories) ? post.categories.join(", ") : post.categories} | 
                            {post.views} views | {post.reading_time_minutes} min read
                          </p>
                          {post.post_type === 'review' && post.car_specifications && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {post.car_specifications.make} {post.car_specifications.model} {post.car_specifications.year}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 md:shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700/50"
                            onClick={() => setEditingPost(post)}
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant={post.featured ? "default" : "outline"}
                            size="sm"
                            className={`flex items-center gap-1 ${post.featured ? 'bg-amber-600 hover:bg-amber-700' : 'dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700/50'}`}
                            onClick={() => toggleFeaturePost(post)}
                          >
                            <Star className="w-3.5 h-3.5" />
                            {post.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
