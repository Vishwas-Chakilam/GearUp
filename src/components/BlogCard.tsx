
import { Link } from "react-router-dom";
import { Clock, User, Tag } from "lucide-react";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  categories: string[];
  slug: string;
  postType?: string;
}

const BlogCard = ({ 
  title, 
  excerpt, 
  image, 
  author, 
  date, 
  categories, 
  slug, 
  postType = "news" 
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${slug}`} className="group animate-enter h-full">
      <article className="elevated-card h-full flex flex-col">
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 overflow-hidden h-48">
            <img
              src={image}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {postType && (
            <div className="absolute top-3 right-3">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full uppercase ${
                postType === 'review' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-300' 
                  : postType === 'guide' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/70 dark:text-green-300' 
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/70 dark:text-orange-300'
              } backdrop-blur-sm transition-colors duration-300`}>
                {postType}
              </span>
            </div>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex gap-2 mb-3 flex-wrap">
            {categories.map((category) => (
              <span
                key={category}
                className="text-xs font-medium px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full flex items-center gap-1 transition-colors duration-300"
              >
                <Tag size={10} />
                {category}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 dark:text-white tracking-tight">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm flex-grow transition-colors duration-300">{excerpt}</p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-4 mt-auto transition-colors duration-300">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {date}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
