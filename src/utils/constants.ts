export const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'dart', label: 'Dart' },
  { value: 'scala', label: 'Scala' },
  { value: 'other', label: 'Other' },
];

export const FORM_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MIN_REASON_LENGTH: 10,
  MAX_REASON_LENGTH: 500,
};

export const API_ENDPOINTS = {
  SUBMISSIONS: '/api/submissions',
  RESULTS: '/api/results',
} as const;