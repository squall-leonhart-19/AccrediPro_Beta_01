'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// STYLE 3: Chat/Messenger Interface
// WhatsApp-style conversation with Sarah, typing indicators, quick replies

interface Message {
    id: number;
    type: 'sarah' | 'system' | 'user';
    text: string;
    delay: number;
}

export default function Style3Page() {
    const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedReplies, setSelectedReplies] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messages: Message[] = [
        { id: 1, type: 'sarah', text: "Hey there! 👋 I'm Sarah, your gut health coach.", delay: 0 },
        { id: 2, type: 'sarah', text: "I'm SO excited you're here! Ready to start your gut health journey?", delay: 1500 },
        { id: 3, type: 'system', text: '🎓 You've joined the Gut Health Mini- Diploma', delay: 3000 },
    { id: 4, type: 'sarah', text: "Let me share something that might surprise you...", delay: 4500 },
        { id: 5, type: 'sarah', text: "70 MILLION Americans suffer from digestive issues. That's more than the population of California AND Texas combined! 🤯", delay: 6000 },
        { id: 6, type: 'sarah', text: "And here's the thing - most of them have been told it's 'normal' or 'all in their head'", delay: 8000 },
        { id: 7, type: 'sarah', text: "But YOU are going to learn how to actually help them 💪", delay: 10000 },
        { id: 8, type: 'system', text: '📊 Key Stat: 80% of your immune system is in your gut', delay: 12000 },
        { id: 9, type: 'sarah', text: "Want to know what really blew my mind when I first learned about gut health?", delay: 14000 },
        { id: 10, type: 'sarah', text: "Your gut produces 95% of your body's serotonin - the 'happiness hormone'! 🧠", delay: 16000 },
        { id: 11, type: 'sarah', text: "This means when you heal someone's gut, you're also helping their mood, energy, and mental clarity", delay: 18000 },
        { id: 12, type: 'sarah', text: "Our certified practitioners earn $5K-$15K/month doing this work from home 💰", delay: 20000 },
        { id: 13, type: 'sarah', text: "Ready to continue to the next lesson?", delay: 22000 },
    ];

    useEffect(() => {
        messages.forEach((msg) => {
            setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => {
                    setVisibleMessages(prev => [...prev, msg.id]);
                    setIsTyping(false);
                }, 800);
            }, msg.delay);
        });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [visibleMessages, isTyping]);

    const quickReplies = [
        { text: "That's amazing! 🤩", selected: false },
        { text: "Tell me more", selected: false },
        { text: "How do I get started?", selected: false },
    ];

    const handleQuickReply = (reply: string) => {
        if (!selectedReplies.includes(reply)) {
            setSelectedReplies([...selectedReplies, reply]);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0b141a',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Chat Header */}
            <header style={{
                background: '#1f2c34',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                borderBottom: '1px solid #2a3942',
            }}>
                <Link href="/gut-health-mini-diploma/style-2" style={{
                    color: '#00a884',
                    textDecoration: 'none',
                    fontSize: 24,
                }}>
                    ←
                </Link>
                <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #722F37, #D4AF37)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                }}>S</div>
                <div style={{ flex: 1 }}>
                    <div style={{ color: 'white', fontWeight: 'bold' }}>Sarah - Your Coach</div>
                    <div style={{ color: '#8696a0', fontSize: 13 }}>
                        {isTyping ? 'typing...' : 'online'}
                    </div>
                </div>
                <img src="/newlogo.webp" alt="AccrediPro" style={{ height: 28, opacity: 0.8 }} />
            </header>

            {/* Messages Container */}
            <main style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    {/* Date Separator */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: 16,
                    }}>
                        <span style={{
                            background: '#1d282f',
                            color: '#8696a0',
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                        }}>
                            TODAY
                        </span>
                    </div>

                    {/* Messages */}
                    {messages.filter(m => visibleMessages.includes(m.id)).map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                justifyContent: msg.type === 'user' ? 'flex-end' : msg.type === 'system' ? 'center' : 'flex-start',
                                marginBottom: 8,
                                animation: 'slideUp 0.3s ease-out',
                            }}
                        >
                            {msg.type === 'system' ? (
                                <div style={{
                                    background: '#1d282f',
                                    color: '#8696a0',
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    fontSize: 13,
                                }}>
                                    {msg.text}
                                </div>
                            ) : (
                                <div style={{
                                    maxWidth: '80%',
                                    background: msg.type === 'sarah' ? '#1f2c34' : '#005c4b',
                                    color: 'white',
                                    padding: '10px 14px',
                                    borderRadius: msg.type === 'sarah' ? '0 12px 12px 12px' : '12px 0 12px 12px',
                                    fontSize: 15,
                                    lineHeight: 1.5,
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                }}>
                                    {msg.text}
                                    <div style={{
                                        fontSize: 11,
                                        color: '#8696a0',
                                        marginTop: 4,
                                        textAlign: 'right',
                                    }}>
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* User Replies */}
                    {selectedReplies.map((reply, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            marginBottom: 8,
                        }}>
                            <div style={{
                                background: '#005c4b',
                                color: 'white',
                                padding: '10px 14px',
                                borderRadius: '12px 0 12px 12px',
                                fontSize: 15,
                            }}>
                                {reply}
                            </div>
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div style={{
                            display: 'flex',
                            gap: 4,
                            padding: '12px 16px',
                            background: '#1f2c34',
                            borderRadius: '0 12px 12px 12px',
                            width: 'fit-content',
                        }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8696a0', animation: 'pulse 1s infinite' }} />
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8696a0', animation: 'pulse 1s infinite 0.2s' }} />
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8696a0', animation: 'pulse 1s infinite 0.4s' }} />
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Quick Replies */}
            {visibleMessages.length >= 5 && (
                <div style={{
                    padding: '12px 16px',
                    background: '#1f2c34',
                    borderTop: '1px solid #2a3942',
                }}>
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        overflowX: 'auto',
                        paddingBottom: 4,
                    }}>
                        {quickReplies.map((reply) => (
                            <button
                                key={reply.text}
                                onClick={() => handleQuickReply(reply.text)}
                                disabled={selectedReplies.includes(reply.text)}
                                style={{
                                    padding: '10px 16px',
                                    border: '1px solid #00a884',
                                    borderRadius: 20,
                                    background: selectedReplies.includes(reply.text) ? '#005c4b' : 'transparent',
                                    color: '#00a884',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    fontSize: 14,
                                }}
                            >
                                {reply.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom Action */}
            {visibleMessages.length >= 10 && (
                <div style={{
                    padding: '16px',
                    background: '#0b141a',
                    borderTop: '1px solid #2a3942',
                    textAlign: 'center',
                }}>
                    <Link href="/gut-health-mini-diploma/style-4" style={{
                        display: 'inline-block',
                        padding: '14px 32px',
                        background: '#00a884',
                        color: 'white',
                        borderRadius: 8,
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}>
                        Continue to Style 4 →
                    </Link>
                </div>
            )}

            <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}
