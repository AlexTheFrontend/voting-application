export interface ValidationError {
  field: string;
  message: string;
}

export interface FormData {
  name: string;
  email: string;
  language: string;
  reason: string;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateFormData(data: FormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  // Email validation
  if (!data.email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Language validation
  if (!data.language) {
    errors.push({ field: 'language', message: 'Please select a programming language' });
  }

  // Reason validation
  if (!data.reason.trim()) {
    errors.push({ field: 'reason', message: 'Please provide a reason for your choice' });
  } else if (data.reason.trim().length < 10) {
    errors.push({ field: 'reason', message: 'Reason must be at least 10 characters' });
  }

  return errors;
}

export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  const error = errors.find(e => e.field === field);
  return error?.message;
}