import SkeletonLoader from '@/components/atoms/SkeletonLoader';

export default function StatisticsSkeleton() {
  return (
    <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8" aria-label="Loading statistics">
      <div className="mb-4 sm:mb-6">
        <SkeletonLoader width="200px" height="24px" className="mb-4" />
        <SkeletonLoader width="120px" height="20px" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 space-y-3">
            <div className="flex justify-between items-center">
              <SkeletonLoader width="80px" height="16px" />
              <SkeletonLoader width="40px" height="16px" />
            </div>
            <SkeletonLoader height="8px" className="rounded-full" />
            <div className="flex justify-between items-center">
              <SkeletonLoader width="60px" height="14px" />
              <SkeletonLoader width="40px" height="14px" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}