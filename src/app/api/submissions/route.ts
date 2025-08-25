import { NextRequest, NextResponse } from 'next/server';
import { Submission } from '@/types';

// In-memory storage for demo (replace with actual database)
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, language, reason } = body;

    // Validate required fields
    if (!name || !email || !language || !reason) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check for existing submission with same email (upsert logic)
    const existingIndex = submissions.findIndex(sub => sub.email === email);
    
    const newSubmission: Submission = {
      id: existingIndex >= 0 ? submissions[existingIndex].id : Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      language,
      reason: reason.trim(),
      timeSubmitted: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing submission
      submissions[existingIndex] = newSubmission;
      return NextResponse.json({
        success: true,
        message: 'Your vote has been updated successfully!',
        submissionId: newSubmission.id,
      });
    } else {
      // Add new submission
      submissions.push(newSubmission);
      return NextResponse.json({
        success: true,
        message: 'Your vote has been submitted successfully!',
        submissionId: newSubmission.id,
      });
    }
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}