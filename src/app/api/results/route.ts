import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  try {
    const allSubmissions = dataStore.getAllSubmissions();
    const languageCounts = dataStore.getLanguageCounts();
    const totalVotes = dataStore.getTotalVotes();

    return NextResponse.json({
      languageCounts,
      totalVotes,
      allSubmissions,
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