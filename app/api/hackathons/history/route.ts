import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { createHackathonHistorySchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const history = await prisma.hackathonHistory.findMany({
      where: { userId },
      include: {
        hackathon: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error('Get hackathon history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = createHackathonHistorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { hackathonId, role, result, projectUrl, notes } = validationResult.data;
    
    // Verify hackathon exists
    const hackathon = await prisma.hackathon.findUnique({
      where: { id: hackathonId },
    });

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    const history = await prisma.hackathonHistory.create({
      data: {
        userId,
        hackathonId,
        role: role || null,
        result: result || null,
        projectUrl: projectUrl || null,
        notes: notes || null,
      },
      include: {
        hackathon: true,
      },
    });

    return NextResponse.json(history, { status: 201 });
  } catch (error) {
    console.error('Create hackathon history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
