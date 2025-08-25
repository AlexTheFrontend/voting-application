'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setFormValue,
  submitVoteRequest,
  submitVoteSuccess,
  submitVoteFailure,
  clearMessages,
} from '@/store/slices/formSlice';
import { fetchResultsAfterSubmission } from '@/store/thunks/resultsThunks';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import Toast from '@/components/molecules/Toast';
import { validateFormData, getFieldError, ValidationError } from '@/utils/validation';
import { PROGRAMMING_LANGUAGES } from '@/utils/constants';
import { api } from '@/services/api';
import { localStorage as localStorageUtil } from '@/utils/localStorage';

export default function VotingForm() {
  const dispatch = useAppDispatch();
  const { name, email, language, reason, isLoading, error, successMessage } =
    useAppSelector((state) => state.form);
  
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isReturningUser, setIsReturningUser] = useState(false);

  // Check for returning user and populate form
  useEffect(() => {
    const userSubmission = localStorageUtil.getUserSubmission();
    if (userSubmission) {
      setIsReturningUser(true);
      dispatch(setFormValue({ field: 'name', value: userSubmission.name }));
      dispatch(setFormValue({ field: 'email', value: userSubmission.email }));
      dispatch(setFormValue({ field: 'language', value: userSubmission.language }));
      dispatch(setFormValue({ field: 'reason', value: userSubmission.reason }));
    }
  }, [dispatch]);

  const handleFieldChange = (field: string, value: string) => {
    dispatch(setFormValue({ 
      field: field as 'name' | 'email' | 'language' | 'reason', 
      value 
    }));
    
    // Clear validation error for this field when user starts typing
    setValidationErrors(prev => prev.filter(err => err.field !== field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = { name, email, language, reason };
    const errors = validateFormData(formData);

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    dispatch(submitVoteRequest());

    try {
      const response = await api.submitVote(formData);
      
      dispatch(submitVoteSuccess(response.message));
      
      // Store user's complete submission in localStorage
      localStorageUtil.setUserSubmission({ name, email, language, reason });
      
      // Fetch updated results immediately
      dispatch(fetchResultsAfterSubmission());
      
    } catch (error: any) {
      dispatch(submitVoteFailure(error.message || 'Failed to submit vote'));
    }
  };

  const handleClearMessages = () => {
    dispatch(clearMessages());
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          {isReturningUser ? 'Update Your Vote' : 'Vote for Your Favorite Programming Language'}
        </h2>
        {isReturningUser && (
          <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
            Welcome back! We've loaded your previous submission. You can update your vote below.
          </p>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4">
          <Toast
            message={successMessage}
            type="success"
            onClose={handleClearMessages}
          />
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Toast
            message={error}
            type="error"
            onClose={handleClearMessages}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
        <FormField
          id="name"
          name="name"
          label="Your Name"
          value={name}
          onChange={(value) => handleFieldChange('name', value)}
          placeholder="Enter your full name"
          required
          disabled={isLoading}
          error={getFieldError(validationErrors, 'name')}
        />

        <FormField
          id="email"
          name="email"
          label="Email Address"
          inputType="email"
          value={email}
          onChange={(value) => handleFieldChange('email', value)}
          placeholder="Enter your email address"
          required
          disabled={isLoading}
          error={getFieldError(validationErrors, 'email')}
        />

        <FormField
          id="language"
          name="language"
          label="Programming Language"
          type="select"
          value={language}
          onChange={(value) => handleFieldChange('language', value)}
          options={PROGRAMMING_LANGUAGES}
          placeholder="Select your favorite programming language"
          required
          disabled={isLoading}
          error={getFieldError(validationErrors, 'language')}
        />

        <FormField
          id="reason"
          name="reason"
          label="Reason for Your Choice"
          type="textarea"
          value={reason}
          onChange={(value) => handleFieldChange('reason', value)}
          placeholder="Tell us why this is your favorite programming language..."
          required
          disabled={isLoading}
          rows={4}
          error={getFieldError(validationErrors, 'reason')}
        />

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto sm:min-w-[120px]"
            aria-describedby={error ? "form-error" : undefined}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Submitting...</span>
              </div>
            ) : (
              isReturningUser ? 'Update Vote' : 'Submit Vote'
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}