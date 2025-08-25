interface SkeletonLoaderProps {
  variant?: 'text' | 'rect' | 'circle';
  width?: string;
  height?: string;
  className?: string;
}

export default function SkeletonLoader({
  variant = 'text',
  width = '100%',
  height,
  className = '',
}: SkeletonLoaderProps) {
  const getHeightClass = () => {
    if (height) return '';
    
    switch (variant) {
      case 'circle':
        return 'h-12 w-12';
      case 'rect':
        return 'h-24';
      case 'text':
      default:
        return 'h-4';
    }
  };

  const getShapeClass = () => {
    switch (variant) {
      case 'circle':
        return 'rounded-full';
      case 'rect':
        return 'rounded-md';
      case 'text':
      default:
        return 'rounded';
    }
  };

  return (
    <div
      className={`animate-pulse bg-gray-200 ${getHeightClass()} ${getShapeClass()} ${className}`}
      style={{ 
        width, 
        height: height || undefined 
      }}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}