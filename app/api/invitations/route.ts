import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, sendEmail } from '@/lib/auth';
import { createInvitationSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId },
        ],
      },
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(invitations, { status: 200 });
  } catch (error) {
    console.error('Get invitations error:', error);
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
    const validationResult = createInvitationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { receiverId, message } = validationResult.data;

    if (userId === receiverId) {
      return NextResponse.json(
        { error: 'Cannot send invitation to yourself' },
        { status: 400 }
      );
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        senderId_receiverId: {
          senderId: userId,
          receiverId,
        },
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent' },
        { status: 409 }
      );
    }

    const invitation = await prisma.invitation.create({
      data: {
        senderId: userId,
        receiverId,
        message: message || null,
      },
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

    // Send email notification to receiver
    try {
      const messageHTML = invitation.message
        ? `<div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
            <p style="margin: 0; font-style: italic;">"${invitation.message}"</p>
          </div>`
        : '';

      await sendEmail(
        invitation.receiver.email,
        `New invitation from @${invitation.sender.username} on HackMate`,
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">You have a new collaboration invite! 🤝</h2>
          <p><strong>@${invitation.sender.username}</strong> wants to team up with you on HackMate!</p>
          ${messageHTML}
          <p>Check out their profile and respond to the invitation:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invitations" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0;">
            View Invitations
          </a>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Don't keep them waiting - respond now!</p>
        </div>`
      );
      console.log(`Invitation email sent to ${invitation.receiver.email}`);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Don't fail the invitation if email fails
    }

    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error('Create invitation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
