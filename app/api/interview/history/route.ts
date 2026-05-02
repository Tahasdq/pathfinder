import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Interview from '@/models/Interview';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const history = await Interview.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Interview History Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
