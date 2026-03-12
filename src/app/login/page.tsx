'use client';

import { motion } from 'framer-motion';
import { Mail, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
    return (
        <main className="mobile-container">
            <div style={{ padding: '20px 0' }}>
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                    <ChevronLeft /> Назад
                </button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>З поверненням!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Увійдіть, щоб керувати своїми авто</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                            <input
                                type="email"
                                placeholder="Email"
                                className="input-field"
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                            <input
                                type="password"
                                placeholder="Пароль"
                                className="input-field"
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <button
                            className="btn-primary w-full"
                            onClick={() => {
                                localStorage.setItem('clientAuth', 'true');
                                window.location.href = '/';
                            }}
                        >
                            Увійти <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Ще не маєте аккаунту? <Link href="/register" style={{ color: 'var(--accent)' }}>Зареєструватися</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
