'use client';

import { useEffect, lazy, Suspense } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchResults } from '@/store/thunks/resultsThunks';
import Layout from '@/components/templates/Layout';
import VotingForm from '@/components/organisms/VotingForm';
import StatisticsSkeleton from '@/components/molecules/StatisticsSkeleton';
import TableSkeleton from '@/components/molecules/TableSkeleton';

// Lazy load results components for better performance
const LanguageStatistics = lazy(() => import('@/components/organisms/LanguageStatistics'));
const ResponsesTable = lazy(() => import('@/components/organisms/ResponsesTable'));

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch initial results when page loads
    dispatch(fetchResults());
  }, [dispatch]);

  return (
    <Layout>
      <div className="space-y-6 sm:space-y-8">
        {/* Voting Form */}
        <VotingForm />

        {/* Language Statistics */}
        <Suspense fallback={<StatisticsSkeleton />}>
          <LanguageStatistics />
        </Suspense>

        {/* All Submissions Table */}
        <Suspense fallback={<TableSkeleton />}>
          <ResponsesTable />
        </Suspense>
      </div>
    </Layout>
  );
}
