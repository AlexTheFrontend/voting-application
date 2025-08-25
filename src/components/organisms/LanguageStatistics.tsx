'use client';

import { useAppSelector } from '@/store/hooks';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

export default function LanguageStatistics() {
  const { totalVotes, languageCounts, languagePercentages, isLoading, error } =
    useAppSelector((state) => state.results);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Voting Statistics
        </h2>
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Voting Statistics
        </h2>
        <div className="text-center py-8">
          <p className="text-red-600">Error loading statistics: {error}</p>
        </div>
      </div>
    );
  }

  if (totalVotes === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Voting Statistics
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No votes yet. Be the first to vote!</p>
        </div>
      </div>
    );
  }

  const sortedLanguages = Object.entries(languageCounts).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Voting Statistics
      </h2>
      
      <div className="mb-4">
        <p className="text-lg text-gray-700">
          Total Votes: <span className="font-semibold">{totalVotes}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedLanguages.map(([language, count]) => {
          const percentage = languagePercentages[language] || 0;
          const languageLabel = language.charAt(0).toUpperCase() + language.slice(1);
          
          return (
            <div
              key={language}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-900">{languageLabel}</h3>
                <span className="text-sm font-semibold text-blue-600">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>{count} votes</span>
                <span>{percentage.toFixed(1)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}