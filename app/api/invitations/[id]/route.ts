import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, sendEmail } from '@/lib/auth';

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
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
            email: true,
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

      // Send email notification to sender about acceptance
      try {
        await sendEmail(
          updatedInvitation.sender.email,
          `@${updatedInvitation.receiver.username} accepted your invitation! 🎉`,
          `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">Great news! You've got a match! 🎉</h2>
            <p><strong>@${updatedInvitation.receiver.username}</strong> accepted your collaboration invite!</p>
            <p>You're now connected and can start working together on your next hackathon project.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hackmatepro.vercel.app'}/connections" 
               style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
              View Your Connections
            </a>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Time to build something amazing together!</p>
          </div>`
        );
        console.log(`Acceptance email sent to ${updatedInvitation.sender.email}`);
      } catch (emailError) {
        console.error('Failed to send acceptance email:', emailError);
        // Don't fail the acceptance if email fails
      }
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
