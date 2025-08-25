import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/services/api';
import { ResultsResponse } from '@/types';

export const fetchResults = createAsyncThunk(
  'results/fetchResults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getResults();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch results');
    }
  }
);

export const fetchResultsAfterSubmission = createAsyncThunk(
  'results/fetchResultsAfterSubmission',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Small delay to ensure backend has processed the submission
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await api.getResults();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch updated results');
    }
  }
);