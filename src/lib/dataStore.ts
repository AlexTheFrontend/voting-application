import { Submission } from '@/types';

// In-memory data store for development
// In production, this would be replaced with a proper database
class DataStore {
  private submissions: Submission[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      language: 'javascript',
      reason: 'JavaScript is versatile and has a huge ecosystem with excellent community support.',
      timeSubmitted: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      language: 'python',
      reason: 'Python has clean syntax and is great for data science and machine learning.',
      timeSubmitted: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      language: 'typescript',
      reason: 'TypeScript adds type safety to JavaScript and helps catch errors early.',
      timeSubmitted: new Date(Date.now() - 21600000).toISOString(),
    },
  ];

  getAllSubmissions(): Submission[] {
    return [...this.submissions];
  }

  addSubmission(submission: Omit<Submission, 'id' | 'timeSubmitted'>): Submission {
    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString(),
      timeSubmitted: new Date().toISOString(),
    };

    // Check for existing submission with same email (upsert logic)
    const existingIndex = this.submissions.findIndex(
      (s) => s.email.toLowerCase() === submission.email.toLowerCase()
    );

    if (existingIndex >= 0) {
      // Update existing submission
      this.submissions[existingIndex] = newSubmission;
    } else {
      // Add new submission
      this.submissions.push(newSubmission);
    }

    return newSubmission;
  }

  getLanguageCounts(): { [key: string]: number } {
    const counts: { [key: string]: number } = {};
    this.submissions.forEach((submission) => {
      counts[submission.language] = (counts[submission.language] || 0) + 1;
    });
    return counts;
  }

  getTotalVotes(): number {
    return this.submissions.length;
  }

  findByEmail(email: string): Submission | undefined {
    return this.submissions.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
  }
}

// Singleton instance
export const dataStore = new DataStore();