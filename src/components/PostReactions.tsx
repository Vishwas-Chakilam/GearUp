
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PostReactionsProps {
  postId: string;
}

const PostReactions = ({ postId }: PostReactionsProps) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user's IP to track reactions
  const getUserIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error getting IP:', error);
      // Fallback to a session-based ID if IP can't be retrieved
      return `session-${Math.random().toString(36).substring(2, 15)}`;
    }
  };

  // Fetch reactions count
  const fetchReactions = async () => {
    try {
      setLoading(true);
      
      // Get likes count
      const { count: likesCount, error: likesError } = await supabase
        .from('post_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('reaction_type', 'like');
      
      if (likesError) throw likesError;
      
      // Get dislikes count
      const { count: dislikesCount, error: dislikesError } = await supabase
        .from('post_reactions')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .eq('reaction_type', 'dislike');
      
      if (dislikesError) throw dislikesError;
      
      // Check if user has already reacted
      const userIp = await getUserIp();
      const { data: userReactionData, error: userReactionError } = await supabase
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId)
        .eq('user_ip', userIp);
      
      if (userReactionError) throw userReactionError;
      
      setLikes(likesCount || 0);
      setDislikes(dislikesCount || 0);
      setUserReaction(userReactionData && userReactionData.length > 0 ? userReactionData[0].reaction_type : null);
    } catch (error) {
      console.error('Error fetching reactions:', error);
      toast.error('Failed to load reactions');
    } finally {
      setLoading(false);
    }
  };

  // Handle reaction
  const handleReaction = async (type: 'like' | 'dislike') => {
    try {
      const userIp = await getUserIp();
      
      if (userReaction === type) {
        // User is toggling off their reaction
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_ip', userIp)
          .eq('reaction_type', type);
        
        if (error) throw error;
        
        setUserReaction(null);
        if (type === 'like') {
          setLikes(prev => prev - 1);
        } else {
          setDislikes(prev => prev - 1);
        }
        
        toast.success('Reaction removed');
      } else if (userReaction) {
        // User is changing their reaction
        const { error: deleteError } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_ip', userIp);
        
        if (deleteError) throw deleteError;
        
        const { error: insertError } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_ip: userIp,
            reaction_type: type
          });
        
        if (insertError) throw insertError;
        
        setUserReaction(type);
        if (type === 'like') {
          setLikes(prev => prev + 1);
          setDislikes(prev => prev - 1);
        } else {
          setDislikes(prev => prev + 1);
          setLikes(prev => prev - 1);
        }
        
        toast.success(`You ${type}d this post`);
      } else {
        // User is adding a new reaction
        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_ip: userIp,
            reaction_type: type
          });
        
        if (error) throw error;
        
        setUserReaction(type);
        if (type === 'like') {
          setLikes(prev => prev + 1);
        } else {
          setDislikes(prev => prev + 1);
        }
        
        toast.success(`You ${type}d this post`);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to save your reaction');
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [postId]);

  return (
    <div className="flex items-center space-x-8 border-t border-gray-100 pt-6 mt-6">
      <button 
        onClick={() => handleReaction('like')}
        disabled={loading}
        className={`flex items-center space-x-2 transition-colors ${
          userReaction === 'like' 
            ? 'text-green-600' 
            : 'text-gray-500 hover:text-green-600'
        }`}
        aria-label="Like post"
      >
        <ThumbsUp size={20} />
        <span className="font-medium">{likes}</span>
      </button>
      
      <button
        onClick={() => handleReaction('dislike')}
        disabled={loading}
        className={`flex items-center space-x-2 transition-colors ${
          userReaction === 'dislike' 
            ? 'text-red-600' 
            : 'text-gray-500 hover:text-red-600'
        }`}
        aria-label="Dislike post"
      >
        <ThumbsDown size={20} />
        <span className="font-medium">{dislikes}</span>
      </button>
    </div>
  );
};

export default PostReactions;
