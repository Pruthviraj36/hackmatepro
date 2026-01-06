import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signupSchema } from '@/lib/validation';
import { handlePrismaError } from '@/lib/errors';
import { generateSecureToken, sendEmail } from '@/lib/auth';
import { authRateLimit } from '@/lib/rate-limit';
import { env } from '@/lib/env';

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

    const { email, username, password, name, bio } = validationResult.data;

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

    // Generate 6-digit verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: name || null,
        bio: bio || null,
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
      console.log(`Attempting to send verification email to ${email}...`);
      await sendEmail(
        email,
        'Verify your HackMate account',
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Welcome to HackMate, @${username}! 🚀</h2>
          <p>Your verification code is:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #10b981; font-size: 48px; letter-spacing: 8px; margin: 0;">${verificationToken}</h1>
          </div>
          <p>Enter this code on the verification page to activate your account.</p>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 1 hour.</p>
        </div>`
      );
      console.log(`Verification email sent successfully to ${email}`);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return NextResponse.json(
      {
        user,
        message: 'Account created! Please check your email for a 6-digit verification code.',
        redirectTo: `/verify-email?email=${encodeURIComponent(email)}`
      },
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
