import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formSlice';
import resultsReducer from './slices/resultsSlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    results: resultsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;