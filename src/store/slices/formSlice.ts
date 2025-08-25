import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormState } from '@/types';

const initialState: FormState = {
  name: '',
  email: '',
  language: '',
  reason: '',
  isLoading: false,
  error: null,
  successMessage: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormValue: (
      state,
      action: PayloadAction<{
        field: keyof Omit<FormState, 'isLoading' | 'error' | 'successMessage'>;
        value: string;
      }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
      // Clear error when user starts typing
      if (state.error) {
        state.error = null;
      }
    },

    submitVoteRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.successMessage = null;
    },

    submitVoteSuccess: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.successMessage = action.payload;
      state.error = null;
    },

    submitVoteFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.successMessage = null;
    },

    clearForm: (state) => {
      state.name = '';
      state.email = '';
      state.language = '';
      state.reason = '';
      state.error = null;
      state.successMessage = null;
    },

    setFormError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.successMessage = null;
    },

    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setFormValue,
  submitVoteRequest,
  submitVoteSuccess,
  submitVoteFailure,
  clearForm,
  setFormError,
  clearMessages,
} = formSlice.actions;

export default formSlice.reducer;