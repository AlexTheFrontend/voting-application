'use client';

import { useAppSelector } from '@/store/hooks';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import TableSkeleton from '@/components/molecules/TableSkeleton';

export default function ResponsesTable() {
  const { groupedSubmissions, totalVotes, isLoading, error } = useAppSelector(
    (state) => state.results
  );

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6" role="alert" aria-live="assertive">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          All Submissions
        </h2>
        <div className="text-center py-6 sm:py-8">
          <p className="text-red-600">Error loading submissions: {error}</p>
        </div>
      </section>
    );
  }

  if (totalVotes === 0) {
    return (
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6" aria-live="polite">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
          All Submissions
        </h2>
        <div className="text-center py-6 sm:py-8">
          <p className="text-gray-500">No submissions yet.</p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Invalid date';
    }
  };

  const languageKeys = Object.keys(groupedSubmissions).sort();

  return (
    <section className="bg-white rounded-lg shadow-md p-4 sm:p-6" aria-live="polite">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        All Submissions (<span aria-live="polite">{totalVotes} total</span>)
      </h2>

      <div className="space-y-6 sm:space-y-8">
        {languageKeys.map((language) => {
          const submissions = groupedSubmissions[language];
          const languageLabel = language.charAt(0).toUpperCase() + language.slice(1);

          return (
            <div key={language} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-3 sm:px-4 py-3 border-b border-gray-200">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">
                  {languageLabel} ({submissions.length} votes)
                </h3>
              </div>

              {/* Mobile card layout */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{submission.name}</h4>
                          <p className="text-sm text-gray-600">{submission.email}</p>
                        </div>
                        <time className="text-xs text-gray-500 ml-2">
                          {formatDate(submission.timeSubmitted)}
                        </time>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium text-gray-600 mb-1">Reason:</p>
                        <p>{submission.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop table layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200" role="table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Email
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Reason
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" scope="col">
                        Time Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {submission.name}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {submission.email}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-sm text-gray-600 max-w-xs">
                          <div className="line-clamp-3" title={submission.reason}>
                            {submission.reason}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <time dateTime={submission.timeSubmitted}>
                            {formatDate(submission.timeSubmitted)}
                          </time>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}