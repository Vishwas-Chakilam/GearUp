
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  // Function to process content and handle different elements
  const renderContent = () => {
    // Split content by paragraphs
    return content.split('\n\n').map((paragraph: string, index: number) => {
      // Check if paragraph contains an image (basic detection)
      if (paragraph.startsWith('![') && paragraph.includes('](') && paragraph.includes(')')) {
        // Extract image URL and alt text from markdown-like syntax
        const altTextMatch = paragraph.match(/!\[(.*?)\]/);
        const urlMatch = paragraph.match(/\((.*?)\)/);
        
        if (urlMatch && urlMatch[1]) {
          const imageUrl = urlMatch[1];
          const altText = altTextMatch ? altTextMatch[1] : 'Article image';
          
          return (
            <div key={index} className="my-8">
              <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <img
                  src={imageUrl}
                  alt={altText}
                  className="h-full w-full object-cover transition-all hover:scale-105 duration-700"
                />
              </AspectRatio>
              {altText && altText !== 'Article image' && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center italic">
                  {altText}
                </p>
              )}
            </div>
          );
        }
      }
      
      // Handle regular paragraphs
      return (
        <p 
          key={index} 
          className={cn(
            "text-gray-700 dark:text-gray-300 leading-relaxed mb-6",
            "font-light tracking-tight"
          )}
        >
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="prose prose-lg lg:prose-xl max-w-none">
      {renderContent()}
    </div>
  );
};

export default PostContent;
