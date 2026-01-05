import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    const { searchParams } = new URL(request.url);
    const skills = searchParams.get('skills')?.split(',') || [];
    const interests = searchParams.get('interests')?.split(',') || [];
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch matched user IDs to exclude them
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
      }
    });

    const matchedIds = matches.map(m => m.user1Id === userId ? m.user2Id : m.user1Id);

    const where: any = {
      id: { notIn: [userId, ...matchedIds] },
    };

    if (skills.length > 0 && skills[0] !== '') {
      where.skills = { hasSome: skills };
    }

    if (interests.length > 0 && interests[0] !== '') {
      where.interests = { hasSome: interests };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        skills: true,
        interests: true,
        hackathonHistory: {
          take: 5,
          include: {
            hackathon: true,
          },
        },
        _count: {
          select: {
            hackathonHistory: true,
          },
        },
      },
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Discover users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
