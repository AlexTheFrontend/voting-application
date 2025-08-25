const USER_EMAIL_KEY = 'userEmailSubmitted';
const USER_SUBMISSION_KEY = 'userLastSubmission';

interface UserSubmission {
  name: string;
  email: string;
  language: string;
  reason: string;
  submittedAt: string;
}

export const localStorage = {
  setUserEmail: (email: string): void => {
    try {
      window.localStorage.setItem(USER_EMAIL_KEY, email);
    } catch (error) {
      console.warn('Failed to save user email to localStorage:', error);
    }
  },

  getUserEmail: (): string | null => {
    try {
      return window.localStorage.getItem(USER_EMAIL_KEY);
    } catch (error) {
      console.warn('Failed to retrieve user email from localStorage:', error);
      return null;
    }
  },

  clearUserEmail: (): void => {
    try {
      window.localStorage.removeItem(USER_EMAIL_KEY);
    } catch (error) {
      console.warn('Failed to clear user email from localStorage:', error);
    }
  },

  hasSubmitted: (): boolean => {
    return Boolean(localStorage.getUserEmail());
  },

  setUserSubmission: (submission: Omit<UserSubmission, 'submittedAt'>): void => {
    try {
      const submissionWithTimestamp: UserSubmission = {
        ...submission,
        submittedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(USER_SUBMISSION_KEY, JSON.stringify(submissionWithTimestamp));
      localStorage.setUserEmail(submission.email);
    } catch (error) {
      console.warn('Failed to save user submission to localStorage:', error);
    }
  },

  getUserSubmission: (): UserSubmission | null => {
    try {
      const stored = window.localStorage.getItem(USER_SUBMISSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to retrieve user submission from localStorage:', error);
      return null;
    }
  },

  clearUserSubmission: (): void => {
    try {
      window.localStorage.removeItem(USER_SUBMISSION_KEY);
      localStorage.clearUserEmail();
    } catch (error) {
      console.warn('Failed to clear user submission from localStorage:', error);
    }
  },

  isReturningUser: (): boolean => {
    return Boolean(localStorage.getUserSubmission());
  },
};