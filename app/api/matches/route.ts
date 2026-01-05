import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      include: {
        user1: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
            skills: true,
          },
        },
        user2: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            bio: true,
            skills: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Map matches to show the other user
    const mappedMatches = matches.map((match) => ({
      id: match.id,
      user: match.user1Id === userId ? match.user2 : match.user1,
      createdAt: match.createdAt,
    }));

    return NextResponse.json(mappedMatches, { status: 200 });
  } catch (error) {
    console.error('Get matches error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
