import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['ACCEPTED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status (ACCEPTED or REJECTED) is required' },
        { status: 400 }
      );
    }

    // Get invitation
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    if (invitation.receiverId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this invitation' },
        { status: 403 }
      );
    }

    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Invitation already processed' },
        { status: 400 }
      );
    }

    // Update invitation
    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: { status },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // If accepted, create a match
    if (status === 'ACCEPTED') {
      const user1Id = invitation.senderId < invitation.receiverId
        ? invitation.senderId
        : invitation.receiverId;
      const user2Id = invitation.senderId < invitation.receiverId
        ? invitation.receiverId
        : invitation.senderId;

      await prisma.match.upsert({
        where: {
          user1Id_user2Id: {
            user1Id,
            user2Id,
          },
        },
        create: {
          user1Id,
          user2Id,
        },
        update: {},
      });
    }

    return NextResponse.json(updatedInvitation, { status: 200 });
  } catch (error) {
    console.error('Update invitation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
