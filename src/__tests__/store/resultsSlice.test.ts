import resultsReducer, {
  fetchResultsRequest,
  fetchResultsSuccess,
  fetchResultsFailure,
  clearResultsError,
} from '@/store/slices/resultsSlice';
import { fetchResults, fetchResultsAfterSubmission } from '@/store/thunks/resultsThunks';
import { ResultsState, Submission } from '@/types';

describe('resultsSlice', () => {
  const initialState: ResultsState = {
    totalVotes: 0,
    languageCounts: {},
    languagePercentages: {},
    allSubmissions: [],
    groupedSubmissions: {},
    isLoading: false,
    error: null,
  };

  const mockSubmissions: Submission[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      language: 'javascript',
      reason: 'Great for web development',
      timeSubmitted: '2024-01-01T10:00:00Z',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      language: 'python',
      reason: 'Excellent for data science',
      timeSubmitted: '2024-01-01T11:00:00Z',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      language: 'javascript',
      reason: 'Versatile and popular',
      timeSubmitted: '2024-01-01T09:00:00Z',
    },
  ];

  const mockApiResponse = {
    totalVotes: 3,
    languageCounts: { javascript: 2, python: 1 },
    allSubmissions: mockSubmissions,
  };

  it('should return the initial state', () => {
    expect(resultsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('synchronous actions', () => {
    it('should handle fetchResultsRequest', () => {
      const action = fetchResultsRequest();
      const state = resultsReducer(initialState, action);
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchResultsSuccess', () => {
      const action = fetchResultsSuccess(mockApiResponse);
      const state = resultsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.totalVotes).toBe(3);
      expect(state.languageCounts).toEqual({ javascript: 2, python: 1 });
      expect(state.allSubmissions).toEqual(mockSubmissions);
      
      // Check percentage calculations
      expect(state.languagePercentages).toEqual({
        javascript: 66.67,
        python: 33.33,
      });

      // Check grouping and sorting
      expect(state.groupedSubmissions.javascript).toHaveLength(2);
      expect(state.groupedSubmissions.python).toHaveLength(1);
      
      // Check sorting within groups (chronological order)
      expect(state.groupedSubmissions.javascript[0].timeSubmitted).toBe('2024-01-01T09:00:00Z');
      expect(state.groupedSubmissions.javascript[1].timeSubmitted).toBe('2024-01-01T10:00:00Z');
    });

    it('should handle fetchResultsFailure', () => {
      const errorMessage = 'Failed to fetch results';
      const action = fetchResultsFailure(errorMessage);
      const state = resultsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle clearResultsError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = clearResultsError();
      const state = resultsReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });

  describe('async thunk actions', () => {
    it('should handle fetchResults.pending', () => {
      const action = { type: fetchResults.pending.type };
      const state = resultsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fetchResults.fulfilled', () => {
      const action = { 
        type: fetchResults.fulfilled.type, 
        payload: mockApiResponse 
      };
      const state = resultsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.totalVotes).toBe(3);
      expect(state.languageCounts).toEqual({ javascript: 2, python: 1 });
      expect(state.allSubmissions).toEqual(mockSubmissions);
    });

    it('should handle fetchResults.rejected', () => {
      const action = { 
        type: fetchResults.rejected.type, 
        payload: 'Network error' 
      };
      const state = resultsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('should handle fetchResultsAfterSubmission.pending', () => {
      const action = { type: fetchResultsAfterSubmission.pending.type };
      const state = resultsReducer(initialState, action);

      // Should not show loading for background refresh
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle fetchResultsAfterSubmission.fulfilled', () => {
      const action = { 
        type: fetchResultsAfterSubmission.fulfilled.type, 
        payload: mockApiResponse 
      };
      const state = resultsReducer(initialState, action);

      expect(state.totalVotes).toBe(3);
      expect(state.languageCounts).toEqual({ javascript: 2, python: 1 });
      expect(state.allSubmissions).toEqual(mockSubmissions);
      expect(state.error).toBeNull();
    });

    it('should handle fetchResultsAfterSubmission.rejected silently', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const action = { 
        type: fetchResultsAfterSubmission.rejected.type, 
        payload: 'Background error' 
      };
      const state = resultsReducer(initialState, action);

      // Should not update error state for background refresh failures
      expect(state.error).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('edge cases', () => {
    it('should handle empty submissions array', () => {
      const emptyResponse = {
        totalVotes: 0,
        languageCounts: {},
        allSubmissions: [],
      };
      const action = fetchResultsSuccess(emptyResponse);
      const state = resultsReducer(initialState, action);

      expect(state.totalVotes).toBe(0);
      expect(state.languageCounts).toEqual({});
      expect(state.languagePercentages).toEqual({});
      expect(state.groupedSubmissions).toEqual({});
      expect(state.allSubmissions).toEqual([]);
    });

    it('should handle single submission', () => {
      const singleSubmission = [mockSubmissions[0]];
      const singleResponse = {
        totalVotes: 1,
        languageCounts: { javascript: 1 },
        allSubmissions: singleSubmission,
      };
      const action = fetchResultsSuccess(singleResponse);
      const state = resultsReducer(initialState, action);

      expect(state.totalVotes).toBe(1);
      expect(state.languagePercentages.javascript).toBe(100);
      expect(state.groupedSubmissions.javascript).toHaveLength(1);
    });
  });
});