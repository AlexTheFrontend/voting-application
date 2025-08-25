'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchResults } from '@/store/thunks/resultsThunks';
import Layout from '@/components/templates/Layout';
import VotingForm from '@/components/organisms/VotingForm';
import LanguageStatistics from '@/components/organisms/LanguageStatistics';
import ResponsesTable from '@/components/organisms/ResponsesTable';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch initial results when page loads
    dispatch(fetchResults());
  }, [dispatch]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Voting Form */}
        <VotingForm />

        {/* Language Statistics */}
        <LanguageStatistics />

        {/* All Submissions Table */}
        <ResponsesTable />
      </div>
    </Layout>
  );
}
