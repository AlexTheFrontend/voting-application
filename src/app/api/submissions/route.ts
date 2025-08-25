import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';
import { Submission } from '@/types';

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

    // Check if user already voted (for response message)
    const existingSubmission = dataStore.findByEmail(email);
    const isUpdate = !!existingSubmission;
    
    // Add/update submission (dataStore handles upsert logic)
    const newSubmission = dataStore.addSubmission({
      name: name.trim(),
      email: email.trim(),
      language,
      reason: reason.trim(),
    });

    return NextResponse.json({
      success: true,
      message: isUpdate 
        ? 'Your vote has been updated successfully!' 
        : 'Your vote has been submitted successfully!',
      submissionId: newSubmission.id,
    });
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