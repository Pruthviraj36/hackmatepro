"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Send, Loader2, X } from 'lucide-react';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender: {
        id: string;
        username: string;
        name: string | null;
        avatar: string | null;
    };
}

interface ChatWindowProps {
    recipientId: string;
    recipientUsername: string;
    recipientAvatar: string | null;
    conversationId: string | null;
    onClose: () => void;
}

export function ChatWindow({ recipientId, recipientUsername, recipientAvatar, conversationId: initialConversationId, onClose }: ChatWindowProps) {
    const { token, user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [conversationId, setConversationId] = useState(initialConversationId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!token || !user) {
                setIsLoading(false);
                return;
            }

            let currentConvId = conversationId;

            // If conversationId is 'new' or null, try to find existing conversation
            if (!currentConvId || currentConvId === 'new') {
                try {
                    const convResponse = await fetch('/api/messages', {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (convResponse.ok) {
                        const conversationsList = await convResponse.json();
                        const existingConv = conversationsList.find((conv: any) =>
                            (conv.user1Id === user.id && conv.user2Id === recipientId) ||
                            (conv.user2Id === user.id && conv.user1Id === recipientId)
                        );

                        if (existingConv) {
                            currentConvId = existingConv.id;
                            setConversationId(existingConv.id);
                        } else {
                            // If no conversation exists yet, stop loading but keep currentConvId as is
                            setIsLoading(false);
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Fetch conversation error:', error);
                    setIsLoading(false);
                    return;
                }
            }

            // Fetch messages for the (now found or already known) conversationId
            try {
                const response = await fetch(`/api/messages/${currentConvId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessages(data);

                    // Mark messages as read
                    await fetch(`/api/messages/${currentConvId}`, {
                        method: 'PATCH',
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            } catch (error) {
                console.error('Fetch messages error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();

        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [token, conversationId, recipientId, user?.id]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !newMessage.trim()) return;

        setIsSending(true);

        try {
            const response = await fetch(`/api/messages/${conversationId || 'new'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: newMessage,
                    recipientId,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, data.message]);
                setNewMessage('');

                // Update conversation ID if it was created
                if (!conversationId && data.conversationId) {
                    setConversationId(data.conversationId);
                }
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to send message',
                variant: 'destructive',
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-card border border-border rounded-xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center overflow-hidden">
                            {recipientAvatar ? (
                                <img src={recipientAvatar} alt={recipientUsername} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-primary font-semibold">{recipientUsername[0].toUpperCase()}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground">@{recipientUsername}</h3>
                            <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                            <div>
                                <p className="text-muted-foreground mb-2">No messages yet</p>
                                <p className="text-sm text-muted-foreground">Say hi to @{recipientUsername}!</p>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((message) => {
                                const isOwn = message.senderId === user?.id;
                                return (
                                    <motion.div
                                        key={message.id}
                                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    >
                                        <div className={`max-w-[70%] ${isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'} rounded-2xl px-4 py-2`}>
                                            <p className="text-sm break-words">{message.content}</p>
                                            <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-border">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            className="flex-1 input-base"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isSending}
                        />
                        <button
                            type="submit"
                            className="btn-primary px-4 disabled:opacity-50"
                            disabled={isSending || !newMessage.trim()}
                        >
                            {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
