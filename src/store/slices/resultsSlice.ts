import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResultsState, Submission } from '@/types';
import { fetchResults, fetchResultsAfterSubmission } from '@/store/thunks/resultsThunks';

const initialState: ResultsState = {
  totalVotes: 0,
  languageCounts: {},
  languagePercentages: {},
  allSubmissions: [],
  groupedSubmissions: {},
  isLoading: false,
  error: null,
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    fetchResultsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    fetchResultsSuccess: (
      state,
      action: PayloadAction<{
        totalVotes: number;
        languageCounts: { [key: string]: number };
        allSubmissions: Submission[];
      }>
    ) => {
      const { totalVotes, languageCounts, allSubmissions } = action.payload;

      state.isLoading = false;
      state.totalVotes = totalVotes;
      state.languageCounts = languageCounts;
      state.allSubmissions = allSubmissions;
      state.error = null;

      // Calculate percentages
      state.languagePercentages = {};
      Object.keys(languageCounts).forEach((language) => {
        state.languagePercentages[language] =
          totalVotes > 0
            ? Math.round((languageCounts[language] / totalVotes) * 100 * 100) /
              100
            : 0;
      });

      // Group submissions by language and sort by time within each group
      state.groupedSubmissions = {};
      allSubmissions.forEach((submission) => {
        const { language } = submission;
        if (!state.groupedSubmissions[language]) {
          state.groupedSubmissions[language] = [];
        }
        state.groupedSubmissions[language].push(submission);
      });

      // Sort submissions within each group by timeSubmitted (ascending)
      Object.keys(state.groupedSubmissions).forEach((language) => {
        state.groupedSubmissions[language].sort(
          (a, b) =>
            new Date(a.timeSubmitted).getTime() -
            new Date(b.timeSubmitted).getTime()
        );
      });
    },

    fetchResultsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearResultsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchResults async thunk
    builder
      .addCase(fetchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResults.fulfilled, (state, action) => {
        const { totalVotes, languageCounts, allSubmissions } = action.payload;

        state.isLoading = false;
        state.totalVotes = totalVotes;
        state.languageCounts = languageCounts;
        state.allSubmissions = allSubmissions;
        state.error = null;

        // Calculate percentages
        state.languagePercentages = {};
        Object.keys(languageCounts).forEach((language) => {
          state.languagePercentages[language] =
            totalVotes > 0
              ? Math.round((languageCounts[language] / totalVotes) * 100 * 100) /
                100
              : 0;
        });

        // Group submissions by language and sort by time within each group
        state.groupedSubmissions = {};
        allSubmissions.forEach((submission) => {
          const { language } = submission;
          if (!state.groupedSubmissions[language]) {
            state.groupedSubmissions[language] = [];
          }
          state.groupedSubmissions[language].push(submission);
        });

        // Sort submissions within each group by timeSubmitted (ascending)
        Object.keys(state.groupedSubmissions).forEach((language) => {
          state.groupedSubmissions[language].sort(
            (a, b) =>
              new Date(a.timeSubmitted).getTime() -
              new Date(b.timeSubmitted).getTime()
          );
        });
      })
      .addCase(fetchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Handle fetchResultsAfterSubmission async thunk
      .addCase(fetchResultsAfterSubmission.pending, (state) => {
        // Don't show loading for background refresh
        state.error = null;
      })
      .addCase(fetchResultsAfterSubmission.fulfilled, (state, action) => {
        const { totalVotes, languageCounts, allSubmissions } = action.payload;

        state.totalVotes = totalVotes;
        state.languageCounts = languageCounts;
        state.allSubmissions = allSubmissions;
        state.error = null;

        // Calculate percentages
        state.languagePercentages = {};
        Object.keys(languageCounts).forEach((language) => {
          state.languagePercentages[language] =
            totalVotes > 0
              ? Math.round((languageCounts[language] / totalVotes) * 100 * 100) /
                100
              : 0;
        });

        // Group submissions by language and sort by time within each group
        state.groupedSubmissions = {};
        allSubmissions.forEach((submission) => {
          const { language } = submission;
          if (!state.groupedSubmissions[language]) {
            state.groupedSubmissions[language] = [];
          }
          state.groupedSubmissions[language].push(submission);
        });

        // Sort submissions within each group by timeSubmitted (ascending)
        Object.keys(state.groupedSubmissions).forEach((language) => {
          state.groupedSubmissions[language].sort(
            (a, b) =>
              new Date(a.timeSubmitted).getTime() -
              new Date(b.timeSubmitted).getTime()
          );
        });
      })
      .addCase(fetchResultsAfterSubmission.rejected, (state, action) => {
        // Silent fail for background refresh
        console.warn('Background results refresh failed:', action.payload);
      });
  },
});

export const {
  fetchResultsRequest,
  fetchResultsSuccess,
  fetchResultsFailure,
  clearResultsError,
} = resultsSlice.actions;

export default resultsSlice.reducer;