import { NextResponse } from 'next/server';
import { Submission } from '@/types';

// This should match the submissions from the submissions route
// In a real app, this would come from a shared database
let submissions: Submission[] = [
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

// Sync function to keep data consistent (in real app, this would be database queries)
function getLatestSubmissions(): Submission[] {
  // In a real application, fetch from database
  // For demo, we'll simulate some additional submissions over time
  const now = Date.now();
  
  // Check if we have the initial demo data and maybe add some dynamic ones
  return submissions;
}

export async function GET() {
  try {
    const currentSubmissions = getLatestSubmissions();
    
    // Calculate language counts
    const languageCounts: { [key: string]: number } = {};
    currentSubmissions.forEach(submission => {
      languageCounts[submission.language] = (languageCounts[submission.language] || 0) + 1;
    });

    const totalVotes = currentSubmissions.length;

    return NextResponse.json({
      languageCounts,
      totalVotes,
      allSubmissions: currentSubmissions,
    });
  } catch (error) {
    console.error('Results fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

// Export a function to update submissions (for demo purposes)
export function updateSubmissions(newSubmissions: Submission[]) {
  submissions = newSubmissions;
}