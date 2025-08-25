import { configureStore } from '@reduxjs/toolkit';
import { fetchResults, fetchResultsAfterSubmission } from '@/store/thunks/resultsThunks';
import resultsReducer from '@/store/slices/resultsSlice';
import { api } from '@/services/api';

// Mock the API service
jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

// Create a test store
function createTestStore() {
  return configureStore({
    reducer: {
      results: resultsReducer,
    },
  });
}

describe('resultsThunks', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    jest.clearAllMocks();
  });

  describe('fetchResults', () => {
    const mockApiResponse = {
      totalVotes: 3,
      languageCounts: { javascript: 2, python: 1 },
      allSubmissions: [
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
      ],
    };

    it('should handle successful fetchResults', async () => {
      mockedApi.getResults.mockResolvedValue(mockApiResponse);

      const result = await store.dispatch(fetchResults());

      expect(result.type).toBe('results/fetchResults/fulfilled');
      expect(result.payload).toEqual(mockApiResponse);
      expect(mockedApi.getResults).toHaveBeenCalledTimes(1);

      // Check that the store state is updated correctly
      const state = store.getState().results;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.totalVotes).toBe(3);
      expect(state.languageCounts).toEqual({ javascript: 2, python: 1 });
      expect(state.allSubmissions).toEqual(mockApiResponse.allSubmissions);
    });

    it('should handle fetchResults failure', async () => {
      const errorMessage = 'Network error';
      mockedApi.getResults.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(fetchResults());

      expect(result.type).toBe('results/fetchResults/rejected');
      expect(result.payload).toBe(errorMessage);
      expect(mockedApi.getResults).toHaveBeenCalledTimes(1);

      // Check that the store state reflects the error
      const state = store.getState().results;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle fetchResults with unknown error', async () => {
      mockedApi.getResults.mockRejectedValue('String error');

      const result = await store.dispatch(fetchResults());

      expect(result.type).toBe('results/fetchResults/rejected');
      expect(result.payload).toBe('Failed to fetch results');
    });

    it('should set loading state during fetchResults', async () => {
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const controlledPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockedApi.getResults.mockReturnValue(controlledPromise as any);

      // Dispatch the action
      const promise = store.dispatch(fetchResults());

      // Check that loading state is set
      let state = store.getState().results;
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      // Resolve the promise
      resolvePromise!(mockApiResponse);
      await promise;

      // Check final state
      state = store.getState().results;
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchResultsAfterSubmission', () => {
    const mockApiResponse = {
      totalVotes: 4,
      languageCounts: { javascript: 3, python: 1 },
      allSubmissions: [],
    };

    it('should handle successful fetchResultsAfterSubmission', async () => {
      mockedApi.getResults.mockResolvedValue(mockApiResponse);

      const result = await store.dispatch(fetchResultsAfterSubmission());

      expect(result.type).toBe('results/fetchResultsAfterSubmission/fulfilled');
      expect(result.payload).toEqual(mockApiResponse);
      expect(mockedApi.getResults).toHaveBeenCalledTimes(1);

      // Check that the store state is updated correctly
      const state = store.getState().results;
      expect(state.totalVotes).toBe(4);
      expect(state.languageCounts).toEqual({ javascript: 3, python: 1 });
      expect(state.error).toBeNull();
    });

    it('should handle fetchResultsAfterSubmission failure', async () => {
      const errorMessage = 'Background fetch failed';
      mockedApi.getResults.mockRejectedValue(new Error(errorMessage));

      const result = await store.dispatch(fetchResultsAfterSubmission());

      expect(result.type).toBe('results/fetchResultsAfterSubmission/rejected');
      expect(result.payload).toBe(errorMessage);
      expect(mockedApi.getResults).toHaveBeenCalledTimes(1);

      // For background refresh, error should not be set in state
      const state = store.getState().results;
      expect(state.error).toBeNull();
    });

    it('should not show loading during fetchResultsAfterSubmission', async () => {
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const controlledPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockedApi.getResults.mockReturnValue(controlledPromise as any);

      // Dispatch the action
      const promise = store.dispatch(fetchResultsAfterSubmission());

      // Check that loading state is NOT set (background refresh)
      let state = store.getState().results;
      expect(state.isLoading).toBe(false);

      // Resolve the promise
      resolvePromise!(mockApiResponse);
      await promise;

      // Check final state
      state = store.getState().results;
      expect(state.isLoading).toBe(false);
    });
  });

  describe('integration between both thunks', () => {
    it('should handle consecutive calls correctly', async () => {
      const firstResponse = {
        totalVotes: 2,
        languageCounts: { javascript: 1, python: 1 },
        allSubmissions: [],
      };

      const secondResponse = {
        totalVotes: 3,
        languageCounts: { javascript: 2, python: 1 },
        allSubmissions: [],
      };

      // First call
      mockedApi.getResults.mockResolvedValueOnce(firstResponse);
      await store.dispatch(fetchResults());
      
      let state = store.getState().results;
      expect(state.totalVotes).toBe(2);

      // Second call (background refresh)
      mockedApi.getResults.mockResolvedValueOnce(secondResponse);
      await store.dispatch(fetchResultsAfterSubmission());
      
      state = store.getState().results;
      expect(state.totalVotes).toBe(3);
      expect(state.languageCounts).toEqual({ javascript: 2, python: 1 });
    });

    it('should handle failure after success gracefully', async () => {
      const successResponse = {
        totalVotes: 2,
        languageCounts: { javascript: 1, python: 1 },
        allSubmissions: [],
      };

      // First successful call
      mockedApi.getResults.mockResolvedValueOnce(successResponse);
      await store.dispatch(fetchResults());
      
      let state = store.getState().results;
      expect(state.totalVotes).toBe(2);
      expect(state.error).toBeNull();

      // Second call fails
      mockedApi.getResults.mockRejectedValueOnce(new Error('Network down'));
      await store.dispatch(fetchResults());
      
      state = store.getState().results;
      expect(state.totalVotes).toBe(2); // Should preserve previous data
      expect(state.error).toBe('Network down');
    });
  });
});