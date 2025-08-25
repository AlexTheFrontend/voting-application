import { validateFormData, isValidEmail, getFieldError } from '@/utils/validation';

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('test+label@example.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('test.example.com')).toBe(false);
    });
  });

  describe('validateFormData', () => {
    const validFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      language: 'javascript',
      reason: 'JavaScript is a great language for web development',
    };

    it('should return no errors for valid data', () => {
      const errors = validateFormData(validFormData);
      expect(errors).toHaveLength(0);
    });

    it('should validate required name field', () => {
      const errors = validateFormData({ ...validFormData, name: '' });
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name is required',
      });
    });

    it('should validate name minimum length', () => {
      const errors = validateFormData({ ...validFormData, name: 'A' });
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name must be at least 2 characters',
      });
    });

    it('should validate required email field', () => {
      const errors = validateFormData({ ...validFormData, email: '' });
      expect(errors).toContainEqual({
        field: 'email',
        message: 'Email is required',
      });
    });

    it('should validate email format', () => {
      const errors = validateFormData({ ...validFormData, email: 'invalid' });
      expect(errors).toContainEqual({
        field: 'email',
        message: 'Please enter a valid email address',
      });
    });

    it('should validate required language field', () => {
      const errors = validateFormData({ ...validFormData, language: '' });
      expect(errors).toContainEqual({
        field: 'language',
        message: 'Please select a programming language',
      });
    });

    it('should validate required reason field', () => {
      const errors = validateFormData({ ...validFormData, reason: '' });
      expect(errors).toContainEqual({
        field: 'reason',
        message: 'Please provide a reason for your choice',
      });
    });

    it('should validate reason minimum length', () => {
      const errors = validateFormData({ ...validFormData, reason: 'Short' });
      expect(errors).toContainEqual({
        field: 'reason',
        message: 'Reason must be at least 10 characters',
      });
    });

    it('should handle whitespace in fields', () => {
      const formDataWithWhitespace = {
        name: '  ',
        email: '  ',
        language: 'javascript',
        reason: '   ',
      };
      
      const errors = validateFormData(formDataWithWhitespace);
      
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Name is required',
      });
      expect(errors).toContainEqual({
        field: 'email',
        message: 'Email is required',
      });
      expect(errors).toContainEqual({
        field: 'reason',
        message: 'Please provide a reason for your choice',
      });
    });
  });

  describe('getFieldError', () => {
    const errors = [
      { field: 'name', message: 'Name is required' },
      { field: 'email', message: 'Invalid email' },
    ];

    it('should return error message for existing field', () => {
      expect(getFieldError(errors, 'name')).toBe('Name is required');
      expect(getFieldError(errors, 'email')).toBe('Invalid email');
    });

    it('should return undefined for non-existing field', () => {
      expect(getFieldError(errors, 'language')).toBeUndefined();
      expect(getFieldError(errors, 'reason')).toBeUndefined();
    });

    it('should handle empty errors array', () => {
      expect(getFieldError([], 'name')).toBeUndefined();
    });
  });
});