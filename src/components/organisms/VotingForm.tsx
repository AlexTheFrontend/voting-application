'use client';

import { useState } from 'react';
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

  const handleFieldChange = (field: string, value: string) => {
    dispatch(setFormValue({ 
      field: field as keyof typeof name, 
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
      
      // Store user's email in localStorage
      localStorageUtil.setUserEmail(email);
      
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Vote for Your Favorite Programming Language
      </h2>

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

      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </div>
            ) : (
              'Submit Vote'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}