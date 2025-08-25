import formReducer, {
  setFormValue,
  submitVoteRequest,
  submitVoteSuccess,
  submitVoteFailure,
  clearForm,
  setFormError,
  clearMessages,
} from '@/store/slices/formSlice';
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

describe('formSlice', () => {
  it('should return initial state', () => {
    expect(formReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setFormValue', () => {
    const actual = formReducer(
      initialState,
      setFormValue({ field: 'name', value: 'John Doe' })
    );
    
    expect(actual.name).toEqual('John Doe');
    expect(actual.error).toBeNull();
  });

  it('should clear error when setting form value', () => {
    const stateWithError: FormState = {
      ...initialState,
      error: 'Some error',
    };
    
    const actual = formReducer(
      stateWithError,
      setFormValue({ field: 'email', value: 'john@example.com' })
    );
    
    expect(actual.email).toEqual('john@example.com');
    expect(actual.error).toBeNull();
  });

  it('should handle submitVoteRequest', () => {
    const actual = formReducer(initialState, submitVoteRequest());
    
    expect(actual.isLoading).toBe(true);
    expect(actual.error).toBeNull();
    expect(actual.successMessage).toBeNull();
  });

  it('should handle submitVoteSuccess', () => {
    const loadingState: FormState = {
      ...initialState,
      isLoading: true,
    };
    
    const actual = formReducer(
      loadingState,
      submitVoteSuccess('Vote submitted successfully!')
    );
    
    expect(actual.isLoading).toBe(false);
    expect(actual.successMessage).toEqual('Vote submitted successfully!');
    expect(actual.error).toBeNull();
  });

  it('should handle submitVoteFailure', () => {
    const loadingState: FormState = {
      ...initialState,
      isLoading: true,
    };
    
    const actual = formReducer(
      loadingState,
      submitVoteFailure('Submission failed')
    );
    
    expect(actual.isLoading).toBe(false);
    expect(actual.error).toEqual('Submission failed');
    expect(actual.successMessage).toBeNull();
  });

  it('should handle clearForm', () => {
    const filledState: FormState = {
      name: 'John Doe',
      email: 'john@example.com',
      language: 'javascript',
      reason: 'Great language',
      isLoading: false,
      error: 'Some error',
      successMessage: 'Some success',
    };
    
    const actual = formReducer(filledState, clearForm());
    
    expect(actual).toEqual(initialState);
  });

  it('should handle setFormError', () => {
    const actual = formReducer(
      initialState,
      setFormError('Validation error')
    );
    
    expect(actual.error).toEqual('Validation error');
    expect(actual.successMessage).toBeNull();
  });

  it('should handle clearMessages', () => {
    const stateWithMessages: FormState = {
      ...initialState,
      error: 'Some error',
      successMessage: 'Some success',
    };
    
    const actual = formReducer(stateWithMessages, clearMessages());
    
    expect(actual.error).toBeNull();
    expect(actual.successMessage).toBeNull();
  });
});