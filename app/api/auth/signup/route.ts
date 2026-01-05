import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signupSchema } from '@/lib/validation';
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
    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, username, password, name } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = generateSecureToken();
    const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: name || null,
        verificationToken,
        verificationTokenExpiry,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        createdAt: true,
      },
    });

    // Send verification email
    try {
      await sendEmail(
        email,
        'Verify your HackMate account',
        `<p>Hi ${name || username},</p>
        <p>Please verify your email by clicking the link below:</p>
        <p><a href="${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}">Verify Email</a></p>
        <p>This link will expire in 1 hour.</p>`
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the signup if email fails
    }

    return NextResponse.json(
      { user, message: 'User created successfully. Please check your email to verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('Prisma')) {
      return handlePrismaError(error);
    }
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
