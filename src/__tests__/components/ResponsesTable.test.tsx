import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ResponsesTable from '@/components/organisms/ResponsesTable';
import resultsReducer from '@/store/slices/resultsSlice';
import { ResultsState, Submission } from '@/types';

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

const mockSubmissions: Submission[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    language: 'javascript',
    reason: 'Great for web development and has a huge ecosystem',
    timeSubmitted: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    language: 'python',
    reason: 'Excellent for data science and machine learning',
    timeSubmitted: '2024-01-01T11:00:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    language: 'javascript',
    reason: 'Versatile and popular choice for modern development',
    timeSubmitted: '2024-01-01T09:00:00Z',
  },
];

describe('ResponsesTable', () => {
  it('should show loading state', () => {
    const store = createMockStore({ isLoading: true });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    // Should show skeleton loader with aria-label
    expect(screen.getByLabelText('Loading submissions')).toBeInTheDocument();
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0); // Skeleton components have status role
  });

  it('should show error state', () => {
    const store = createMockStore({ 
      isLoading: false, 
      error: 'Failed to load submissions' 
    });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    expect(screen.getByText('All Submissions')).toBeInTheDocument();
    expect(screen.getByText('Error loading submissions: Failed to load submissions')).toBeInTheDocument();
  });

  it('should show empty state when no submissions', () => {
    const store = createMockStore({ 
      isLoading: false, 
      totalVotes: 0,
      groupedSubmissions: {}
    });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    expect(screen.getByText('All Submissions')).toBeInTheDocument();
    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
  });

  it('should display grouped submissions correctly', () => {
    const groupedSubmissions = {
      javascript: [mockSubmissions[2], mockSubmissions[0]], // Sorted by time
      python: [mockSubmissions[1]],
    };

    const store = createMockStore({
      isLoading: false,
      totalVotes: 3,
      groupedSubmissions,
    });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    // Check header with total count using flexible text matcher
    expect(screen.getByText((content, element) => 
      element?.tagName.toLowerCase() === 'h2' && content.includes('All Submissions')
    )).toBeInTheDocument();

    // Check language group headers
    expect(screen.getByText('Javascript (2 votes)')).toBeInTheDocument();
    expect(screen.getByText('Python (1 votes)')).toBeInTheDocument();

    // Check table headers
    expect(screen.getAllByText('Name')).toHaveLength(2); // One for each group
    expect(screen.getAllByText('Email')).toHaveLength(2);
    expect(screen.getAllByText('Reason')).toHaveLength(2);
    expect(screen.getAllByText('Time Submitted')).toHaveLength(2);

    // Check submission data (names may appear multiple times due to responsive layout)
    expect(screen.getAllByText('John Doe')).toHaveLength(2); // Mobile and desktop
    expect(screen.getAllByText('jane@example.com')).toHaveLength(2); // Mobile and desktop
    expect(screen.getAllByText('Bob Johnson')).toHaveLength(2); // Mobile and desktop

    // Check reasons are displayed
    expect(screen.getByText('Great for web development and has a huge ecosystem')).toBeInTheDocument();
    expect(screen.getByText('Excellent for data science and machine learning')).toBeInTheDocument();
  });

  it('should format dates correctly', () => {
    const groupedSubmissions = {
      javascript: [mockSubmissions[0]],
    };

    const store = createMockStore({
      isLoading: false,
      totalVotes: 1,
      groupedSubmissions,
    });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    // Check that date is formatted (exact format may vary by locale)
    const dateElements = screen.getAllByText(/Jan|2024|10:00|AM|PM/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('should handle invalid date gracefully', () => {
    const invalidSubmission: Submission = {
      ...mockSubmissions[0],
      timeSubmitted: 'invalid-date',
    };

    const groupedSubmissions = {
      javascript: [invalidSubmission],
    };

    const store = createMockStore({
      isLoading: false,
      totalVotes: 1,
      groupedSubmissions,
    });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    // Look for the invalid date text - there are 2 instances (mobile + desktop)
    expect(screen.getAllByText('Invalid date')).toHaveLength(2);
  });

  it('should sort languages alphabetically', () => {
    const groupedSubmissions = {
      zz_test: [mockSubmissions[0]],
      aa_test: [mockSubmissions[1]],
      mm_test: [mockSubmissions[2]],
    };

    const store = createMockStore({
      isLoading: false,
      totalVotes: 3,
      groupedSubmissions,
    });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    const languageHeaders = screen.getAllByText(/votes\)/);
    // Should be sorted alphabetically: aa_test, mm_test, zz_test
    expect(languageHeaders[0]).toHaveTextContent('Aa_test');
    expect(languageHeaders[1]).toHaveTextContent('Mm_test');
    expect(languageHeaders[2]).toHaveTextContent('Zz_test');
  });

  it('should capitalize language names', () => {
    const groupedSubmissions = {
      javascript: [mockSubmissions[0]],
      python: [mockSubmissions[1]],
      'c++': [mockSubmissions[2]],
    };

    const store = createMockStore({
      isLoading: false,
      totalVotes: 3,
      groupedSubmissions,
    });
    
    render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    expect(screen.getByText('C++ (1 votes)')).toBeInTheDocument();
    expect(screen.getByText('Javascript (1 votes)')).toBeInTheDocument();
    expect(screen.getByText('Python (1 votes)')).toBeInTheDocument();
  });

  it('should make table rows hoverable', () => {
    const groupedSubmissions = {
      javascript: [mockSubmissions[0]],
    };

    const store = createMockStore({
      isLoading: false,
      totalVotes: 1,
      groupedSubmissions,
    });
    
    const { container } = render(
      <Provider store={store}>
        <ResponsesTable />
      </Provider>
    );

    // Check that table rows have hover class
    const tableRows = container.querySelectorAll('tbody tr');
    expect(tableRows[0]).toHaveClass('hover:bg-gray-50');
  });
});