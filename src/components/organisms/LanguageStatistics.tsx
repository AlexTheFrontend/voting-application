'use client';

import { useAppSelector } from '@/store/hooks';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import StatisticsSkeleton from '@/components/molecules/StatisticsSkeleton';

export default function LanguageStatistics() {
  const { totalVotes, languageCounts, languagePercentages, isLoading, error } =
    useAppSelector((state) => state.results);

  if (isLoading) {
    return <StatisticsSkeleton />;
  }

  if (error) {
    return (
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8" role="alert" aria-live="assertive">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Voting Statistics
        </h2>
        <div className="text-center py-6 sm:py-8">
          <p className="text-red-600">Error loading statistics: {error}</p>
        </div>
      </section>
    );
  }

  if (totalVotes === 0) {
    return (
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8" aria-live="polite">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          Voting Statistics
        </h2>
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-500">No votes yet. Be the first to vote!</p>
        </div>
      </section>
    );
  }

  const sortedLanguages = Object.entries(languageCounts).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8" aria-live="polite">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        Voting Statistics
      </h2>
      
      <div className="mb-4 sm:mb-6">
        <p className="text-base sm:text-lg text-gray-700">
          Total Votes: <span className="font-semibold" aria-live="polite">{totalVotes}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {sortedLanguages.map(([language, count]) => {
          const percentage = languagePercentages[language] || 0;
          const languageLabel = language.charAt(0).toUpperCase() + language.slice(1);
          
          return (
            <div
              key={language}
              className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
              role="group"
              aria-labelledby={`language-${language}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 id={`language-${language}`} className="font-medium text-gray-900 text-sm sm:text-base">
                  {languageLabel}
                </h3>
                <span 
                  className="text-xs sm:text-sm font-semibold text-blue-600"
                  aria-label={`${percentage.toFixed(1)} percent`}
                >
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${languageLabel} progress: ${percentage.toFixed(1)}%`}>
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600">
                <span aria-label={`${count} votes`}>{count} votes</span>
                <span aria-hidden="true">{percentage.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}