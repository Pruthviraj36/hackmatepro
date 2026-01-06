import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validation';
import { handlePrismaError } from '@/lib/errors';
import { generateSecureToken, sendEmail } from '@/lib/auth';
import { authRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await authRateLimit.limit(identifier);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateSecureToken();
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset email
    try {
      await sendEmail(
        email,
        'Reset your HackMate password',
        `<p>Hi ${user.name || user.username},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${process.env.NEXT_PUBLIC_API_URL || 'https://hackmatepro.vercel.app'}/reset-password?token=${resetToken}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>`
      );
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('Prisma')) {
      return handlePrismaError(error);
    }
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
