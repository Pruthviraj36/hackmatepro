import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
export function handlePrismaError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'A record with this value already exists' },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      case 'P2003':
        return NextResponse.json(
          { error: 'Invalid reference to related record' },
          { status: 400 }
        );
      default:
        console.error('Prisma error:', error);
        return NextResponse.json(
          { error: 'Database error occurred' },
          { status: 500 }
        );
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return NextResponse.json(
      { error: 'Invalid data provided' },
      { status: 400 }
    );
  }

  console.error('Unknown error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
