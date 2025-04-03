
import { Avatar } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

interface PostAuthorCardProps {
  author: string;
  date: string;
}

const PostAuthorCard = ({ author, date }: PostAuthorCardProps) => {
  return (
    <div className="elevated-card p-6 bg-white dark:bg-black transition-colors duration-300">
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <div className="w-12 h-12 rounded-full bg-primary text-white grid place-items-center font-semibold text-lg shadow-sm">
            {author[0]}
          </div>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{author}</p>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        Automotive expert with a passion for sharing insights about the latest car models and industry trends.
      </p>
    </div>
  );
};

export default PostAuthorCard;
