'use client';

import { motion } from 'framer-motion';
import { Lock, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function MechanicLogin() {
    const { t } = useLanguage();

    return (
        <main className="mobile-container">
            <div style={{ padding: '20px 0' }}>
                <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                    <ChevronLeft /> {t('backToHome')}
                </button>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--accent)', padding: '10px', borderRadius: '12px' }}>
                            <Briefcase className="text-white w-6 h-6" />
                        </div>
                        <h2 style={{ fontSize: '24px' }}>{t('mechanicAuthTitle')}</h2>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                        Вхід для сертифікованих майстрів Automobility
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                            <input
                                type="text"
                                placeholder="ID Майстра"
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
                                localStorage.setItem('mechanicAuth', 'true');
                                window.location.href = '/mechanic';
                            }}
                        >
                            {t('login')} <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                        Ще не працюєте з нами? <Link href="/mechanic/register" style={{ color: 'var(--accent)' }}>Зареєструватися</Link>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
