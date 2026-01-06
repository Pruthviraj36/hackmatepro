import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

import { env } from './env';

const transOptions = {
  host: env.SMTP_HOST || 'smtp.gmail.com',
  port: env.SMTP_PORT || 587,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER && env.SMTP_PASS ? {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  } : undefined,
};

const transporter = nodemailer.createTransport(transOptions);

export async function verifyToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = verify(token, env.JWT_SECRET) as { userId: string };

    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: env.FROM_EMAIL || 'noreply@hackmate.com',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw error;
  }
}
