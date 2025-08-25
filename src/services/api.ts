import { SubmissionResponse, ResultsResponse, Submission } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let details: string | undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      details = errorData.details;
    } catch {
      // If we can't parse the error response, use the default message
    }

    throw new APIError(errorMessage, response.status, details);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new APIError('Failed to parse response JSON', response.status);
  }
}

export const api = {
  async submitVote(submission: {
    name: string;
    email: string;
    language: string;
    reason: string;
  }): Promise<SubmissionResponse> {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    return handleResponse<SubmissionResponse>(response);
  },

  async getResults(): Promise<ResultsResponse> {
    const response = await fetch(`${API_BASE_URL}/results`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<ResultsResponse>(response);
  },
};

export { APIError };