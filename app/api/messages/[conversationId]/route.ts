import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// GET /api/messages/[conversationId] - Fetch all messages in a conversation
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const userId = await verifyToken(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { conversationId } = await params;

        // Verify user is part of this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized to access this conversation' },
                { status: 403 }
            );
        }

        // Fetch messages
        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error('Get messages error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/messages/[conversationId] - Send a message
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const userId = await verifyToken(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { conversationId } = await params;
        const body = await request.json();
        const { content, recipientId } = body;

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Message content is required' },
                { status: 400 }
            );
        }

        // Check if users are matched
        const match = await prisma.match.findFirst({
            where: {
                OR: [
                    { user1Id: userId, user2Id: recipientId },
                    { user1Id: recipientId, user2Id: userId },
                ],
            },
        });

        if (!match) {
            return NextResponse.json(
                { error: 'Can only message matched users' },
                { status: 403 }
            );
        }

        // Find or create conversation
        const user1Id = userId < recipientId ? userId : recipientId;
        const user2Id = userId < recipientId ? recipientId : userId;

        let conversation = await prisma.conversation.findFirst({
            where: {
                user1Id,
                user2Id,
            },
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    user1Id,
                    user2Id,
                },
            });
        }

        // Verify conversationId matches if provided
        if (conversationId !== 'new' && conversation.id !== conversationId) {
            return NextResponse.json(
                { error: 'Conversation ID mismatch' },
                { status: 400 }
            );
        }

        // Create message
        const message = await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: userId,
                content: content.trim(),
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
            },
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json({ message, conversationId: conversation.id }, { status: 201 });
    } catch (error) {
        console.error('Send message error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/messages/[conversationId] - Mark messages as read
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ conversationId: string }> }
) {
    try {
        const userId = await verifyToken(request);

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { conversationId } = await params;

        // Verify user is part of this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized to access this conversation' },
                { status: 403 }
            );
        }

        // Mark all unread messages from the other user as read
        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                read: false,
            },
            data: {
                read: true,
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Mark messages as read error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
