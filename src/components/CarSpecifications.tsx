
import { format } from "date-fns";

interface CarSpecificationsProps {
  specifications: any;
}

const CarSpecifications = ({ specifications }: CarSpecificationsProps) => {
  if (!specifications) return null;

  // Function to format dates nicely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  // Function to check if a value is a date string
  const isDateField = (key: string) => {
    return key.includes('_at') || key.includes('date');
  };

  // Function to format specification values appropriately
  const formatValue = (key: string, value: any) => {
    if (isDateField(key)) {
      return formatDate(value);
    }
    return String(value);
  };

  return (
    <div className="elevated-card p-6 dark:bg-gray-800/70 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Car Specifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(specifications).map(([key, value]) => (
          key !== 'id' && key !== 'post_id' && (
            <div key={key} className="flex justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded">
              <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">{key.replace(/_/g, ' ')}:</span>
              <span className={`${isDateField(key) ? 'text-gray-500 dark:text-gray-400 text-sm italic' : 'text-gray-600 dark:text-gray-300'}`}>
                {formatValue(key, value)}
              </span>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default CarSpecifications;
