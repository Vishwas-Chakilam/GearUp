
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface Comment {
  id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  post_id: string;
}

interface PostCommentsProps {
  postId: string;
}

const PostComments = ({ postId }: PostCommentsProps) => {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Comment[];
    },
  });

  if (isLoading) {
    return <div className="space-y-4 mt-8">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <Card key={comment.id} className="p-4 mb-4">
            <p className="font-medium">{comment.author_name}</p>
            <p className="text-gray-600">{comment.content}</p>
            <p className="text-sm text-gray-400 mt-2">
              {format(new Date(comment.created_at), 'PPP')}
            </p>
          </Card>
        ))
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default PostComments;
