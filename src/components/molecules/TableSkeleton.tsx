import SkeletonLoader from '@/components/atoms/SkeletonLoader';

export default function TableSkeleton() {
  return (
    <section className="bg-white rounded-lg shadow-md p-4 sm:p-6" aria-label="Loading submissions">
      <div className="mb-4 sm:mb-6">
        <SkeletonLoader width="250px" height="24px" />
      </div>

      <div className="space-y-6 sm:space-y-8">
        {Array.from({ length: 3 }).map((_, groupIndex) => (
          <div key={groupIndex} className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-3 sm:px-4 py-3 border-b border-gray-200">
              <SkeletonLoader width="150px" height="18px" />
            </div>

            {/* Mobile card layout */}
            <div className="block sm:hidden">
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 2 }).map((_, cardIndex) => (
                  <div key={cardIndex} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <SkeletonLoader width="120px" height="16px" />
                        <SkeletonLoader width="160px" height="14px" />
                      </div>
                      <SkeletonLoader width="80px" height="12px" />
                    </div>
                    <div className="space-y-2">
                      <SkeletonLoader width="60px" height="14px" />
                      <SkeletonLoader width="100%" height="14px" />
                      <SkeletonLoader width="80%" height="14px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop table layout */}
            <div className="hidden sm:block">
              <div className="px-4 md:px-6 py-3 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-4 gap-4">
                  <SkeletonLoader width="60px" height="12px" />
                  <SkeletonLoader width="60px" height="12px" />
                  <SkeletonLoader width="60px" height="12px" />
                  <SkeletonLoader width="100px" height="12px" />
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {Array.from({ length: 2 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="px-4 md:px-6 py-4">
                    <div className="grid grid-cols-4 gap-4">
                      <SkeletonLoader width="90%" height="14px" />
                      <SkeletonLoader width="90%" height="14px" />
                      <SkeletonLoader width="90%" height="14px" />
                      <SkeletonLoader width="90%" height="14px" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}