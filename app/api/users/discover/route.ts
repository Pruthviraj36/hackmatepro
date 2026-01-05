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

    const where: any = {
      id: { not: userId || undefined },
    };

    if (skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    if (interests.length > 0) {
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
