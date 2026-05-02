import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Strategy from '@/models/Strategy';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    const history = await Strategy.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Strategy History Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { strategyId } = await req.json();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // Deactivate all
    await Strategy.updateMany({ userId: session.user.id }, { isActive: false });
    
    // Activate specific one
    const updated = await Strategy.findByIdAndUpdate(strategyId, { isActive: true }, { new: true });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Strategy Activation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
