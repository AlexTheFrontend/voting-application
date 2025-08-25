import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LanguageStatistics from '@/components/organisms/LanguageStatistics';
import resultsReducer from '@/store/slices/resultsSlice';
import { ResultsState } from '@/types';

// Mock store setup helper
function createMockStore(resultsState: Partial<ResultsState> = {}) {
  const defaultResultsState: ResultsState = {
    totalVotes: 0,
    languageCounts: {},
    languagePercentages: {},
    allSubmissions: [],
    groupedSubmissions: {},
    isLoading: false,
    error: null,
    ...resultsState,
  };

  return configureStore({
    reducer: {
      results: () => defaultResultsState,
    },
  });
}

describe('LanguageStatistics', () => {
  it('should show loading state', () => {
    const store = createMockStore({ isLoading: true });
    
    render(
      <Provider store={store}>
        <LanguageStatistics />
      </Provider>
    );

    // Should show skeleton loader with aria-label
    expect(screen.getByLabelText('Loading statistics')).toBeInTheDocument();
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0); // Skeleton components have status role
  });

  it('should show error state', () => {
    const store = createMockStore({ 
      isLoading: false, 
      error: 'Failed to load data' 
    });
    
    render(
      <Provider store={store}>
        <LanguageStatistics />
      </Provider>
    );

    expect(screen.getByText('Voting Statistics')).toBeInTheDocument();
    expect(screen.getByText('Error loading statistics: Failed to load data')).toBeInTheDocument();
  });

  it('should show empty state when no votes', () => {
    const store = createMockStore({ 
      isLoading: false, 
      totalVotes: 0 
    });
    
    render(
      <Provider store={store}>
        <LanguageStatistics />
      </Provider>
    );

    expect(screen.getByText('Voting Statistics')).toBeInTheDocument();
    expect(screen.getByText('No votes yet. Be the first to vote!')).toBeInTheDocument();
  });

  it('should display statistics correctly', () => {
    const store = createMockStore({
      isLoading: false,
      totalVotes: 10,
      languageCounts: {
        javascript: 5,
        python: 3,
        typescript: 2,
      },
      languagePercentages: {
        javascript: 50.0,
        python: 30.0,
        typescript: 20.0,
      },
    });
    
    render(
      <Provider store={store}>
        <LanguageStatistics />
      </Provider>
    );

    // Check header and total votes
    expect(screen.getByText('Voting Statistics')).toBeInTheDocument();
    expect(screen.getByText('Total Votes:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    // Check language statistics
    expect(screen.getByText('Javascript')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Typescript')).toBeInTheDocument();

    // Check vote counts
    expect(screen.getByText('5 votes')).toBeInTheDocument();
    expect(screen.getByText('3 votes')).toBeInTheDocument();
    expect(screen.getByText('2 votes')).toBeInTheDocument();

    // Check percentages (appears twice - in badge and bottom)
    expect(screen.getAllByText('50.0%')).toHaveLength(2);
    expect(screen.getAllByText('30.0%')).toHaveLength(2);
    expect(screen.getAllByText('20.0%')).toHaveLength(2);
  });

  it('should sort languages by vote count descending', () => {
    const store = createMockStore({
      isLoading: false,
      totalVotes: 8,
      languageCounts: {
        python: 1,
        javascript: 5,
        typescript: 2,
      },
      languagePercentages: {
        python: 12.5,
        javascript: 62.5,
        typescript: 25.0,
      },
    });
    
    render(
      <Provider store={store}>
        <LanguageStatistics />
      </Provider>
    );

    const languageElements = screen.getAllByText(/Javascript|Python|Typescript/);
    // Should be sorted by count: Javascript (5), Typescript (2), Python (1)
    expect(languageElements[0]).toHaveTextContent('Javascript');
    expect(languageElements[1]).toHaveTextContent('Typescript');
    expect(languageElements[2]).toHaveTextContent('Python');
  });

  it('should handle decimal percentages correctly', () => {
    const store = createMockStore({
      isLoading: false,
      totalVotes: 3,
      languageCounts: {
        javascript: 2,
        python: 1,
      },
      languagePercentages: {
        javascript: 66.67,
        python: 33.33,
      },
    });
    
    render(
      <Provider store={store}>
        <LanguageStatistics />
      </Provider>
    );

    // Check that decimal percentages are displayed correctly
    expect(screen.getAllByText('66.7%')).toHaveLength(2);
    expect(screen.getAllByText('33.3%')).toHaveLength(2);
  });

  it('should handle single language correctly', () => {
    const store = createMockStore({
      isLoading: false,
      totalVotes: 1,
      languageCounts: {
        javascript: 1,
      },
      languagePercentages: {
        javascript: 100.0,
      },
    });
    
    render(
      <Provider store={store}>
        <LanguageStatistics />
      </Provider>
    );

    expect(screen.getByText('Javascript')).toBeInTheDocument();
    expect(screen.getByText('1 votes')).toBeInTheDocument();
    expect(screen.getAllByText('100.0%')).toHaveLength(2);
  });
});