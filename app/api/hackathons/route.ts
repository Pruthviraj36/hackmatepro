import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createHackathonSchema } from '@/lib/validation';
import { generalRateLimit } from '@/lib/rate-limit';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance for server-side
const window = new JSDOM('').window;
const DOMPurifyServer = DOMPurify(window);

export async function GET(request: NextRequest) {
  try {
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await generalRateLimit.limit(identifier);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');

    const hackathons = await prisma.hackathon.findMany({
      take: limit,
      skip,
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json(hackathons, { status: 200 });
  } catch (error) {
    console.error('Get hackathons error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await generalRateLimit.limit(identifier);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    
    // Validate input
    const validationResult = createHackathonSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    let { name, description, startDate, endDate, location, website, logo } = validationResult.data;

    // Sanitize inputs
    name = DOMPurifyServer.sanitize(name);
    if (description) description = DOMPurifyServer.sanitize(description);
    if (location) location = DOMPurifyServer.sanitize(location);
    if (website) website = DOMPurifyServer.sanitize(website);
    if (logo) logo = DOMPurifyServer.sanitize(logo);

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const hackathon = await prisma.hackathon.create({
      data: {
        name,
        description: description || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location: location || null,
        website: website || null,
        logo: logo || null,
      },
    });

    return NextResponse.json(hackathon, { status: 201 });
  } catch (error) {
    console.error('Create hackathon error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
