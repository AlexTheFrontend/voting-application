const USER_EMAIL_KEY = 'userEmailSubmitted';

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
};