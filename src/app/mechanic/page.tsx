'use client';

import { useState, useEffect } from 'react';
import {
    Clock, CheckCircle2,
    MapPin,
    LogOut, Star,
    Camera,
    Play, ClipboardList
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function MechanicDashboard() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mechanicData, setMechanicData] = useState<{
        name: string; city: string; skills: string[]; rating: number; reviews: { id: number, user: string, comment: string, rating: number, date: string }[]
    } | null>(null);
    const [activeTab, setActiveTab] = useState<'assigned' | 'completed'>('assigned');

    const [allTasks, setAllTasks] = useState([
        {
            id: '1',
            client: 'Олександр В.',
            car: 'Audi Q7 (AA 0001 AA)',
            services: [t('oilChange')],
            time: '14:00',
            status: 'assigned',
            loc: 'Хрещатик, 1',
            city: 'kyiv',
            price: '1,200₴',
            dist: '2.4 км',
            beforePhoto: null,
            afterPhoto: null
        },
        {
            id: '2',
            client: 'Дмитро К.',
            car: 'BMW X5 (BC 7777 BB)',
            services: [t('wheelChange'), t('brakeChange')],
            time: '16:30',
            status: 'assigned',
            loc: 'пр. Перемоги, 45',
            city: 'kyiv',
            price: '2,500₴',
            dist: '5.8 км',
            beforePhoto: null,
            afterPhoto: null
        },
        {
            id: '3',
            client: 'Віктор К.',
            car: 'Tesla Model 3',
            services: [t('electronics')],
            time: '10:00',
            status: 'assigned',
            loc: 'Львів, пл. Ринок 1',
            city: 'lviv',
            price: '3,500₴',
            dist: '540 км',
            beforePhoto: null,
            afterPhoto: null
        }
    ]);

    useEffect(() => {
        // Run once on mount
        const auth = localStorage.getItem('mechanicAuth');
        if (!auth) {
            router.push('/mechanic/login');
        } else {
            setIsLoggedIn(true);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMechanicData({
                name: 'Віталій С.',
                city: 'kyiv',
                skills: [t('oilChange'), t('brakeChange'), t('wheelChange')],
                rating: 4.9,
                reviews: [
                    { id: 1, user: 'Олександр', comment: 'Швидко та якісно!', rating: 5, date: '12.02.2026' },
                    { id: 2, user: 'Марія', comment: 'Дуже ввічливий майстер.', rating: 5, date: '10.02.2026' }
                ]
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredTasks = allTasks.filter(task => {
        if (!mechanicData) return true;

        const tabMatch = activeTab === 'assigned' ? (task.status === 'assigned' || task.status === 'working') : task.status === 'finished';

        if (activeTab === 'assigned' && task.status === 'assigned') {
            const cityMatch = task.city === mechanicData.city;
            const skillMatch = task.services.some(s => mechanicData.skills.includes(s));
            return tabMatch && cityMatch && skillMatch;
        }

        return tabMatch;
    });

    const updateTaskStatus = (id: string, status: string) => {
        setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    };

    const handlePhotoUpload = (taskId: string, type: 'before' | 'after') => {
        setAllTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, [type + 'Photo']: 'uploaded' } : t
        ));
    };

    if (!isLoggedIn) return (
        <div style={{ background: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <main className="mobile-container" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            <header style={{ padding: '20px 0', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                        <h1 style={{ fontSize: '22px' }}>{t('mechanicPanel')}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{mechanicData?.name}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--accent-glow)', padding: '2px 8px', borderRadius: '8px', fontSize: '12px' }}>
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span>{mechanicData?.rating}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px', marginTop: '2px' }}>
                            <MapPin className="w-3 h-3" />
                            <span>{t(mechanicData?.city || '')}</span>
                        </div>
                    </div>
                    <button onClick={() => { localStorage.removeItem('mechanicAuth'); router.push('/mechanic/login'); }} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    onClick={() => setActiveTab('assigned')}
                    className="glass"
                    style={{
                        flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', border: 'none',
                        background: activeTab === 'assigned' ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
                        color: activeTab === 'assigned' ? 'white' : 'var(--text-secondary)'
                    }}
                >
                    {t('activeOrders')}
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className="glass"
                    style={{
                        flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', border: 'none',
                        background: activeTab === 'completed' ? 'var(--accent)' : 'rgba(255,255,255,0.02)',
                        color: activeTab === 'completed' ? 'white' : 'var(--text-secondary)'
                    }}
                >
                    {t('finished')}
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {filteredTasks.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="premium-card" style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '18px', color: 'white' }}>{task.client}</div>
                                            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{task.car}</div>
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>{task.price}</div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                        {task.services.map(s => (
                                            <span key={s} style={{ background: 'var(--accent-glow)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', color: 'white' }}>{s}</span>
                                        ))}
                                    </div>

                                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                            <MapPin className="w-4 h-4 text-red-500" />
                                            <span>{task.loc} ({task.dist})</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                                            <Clock className="w-4 h-4 text-blue-400" />
                                            <span>{task.time}</span>
                                        </div>
                                    </div>

                                    {task.status === 'working' && (
                                        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                                <button
                                                    onClick={() => handlePhotoUpload(task.id, 'before')}
                                                    style={{
                                                        border: '1px dashed var(--border)', background: 'none', padding: '12px', borderRadius: '10px',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer',
                                                        borderColor: task.beforePhoto ? 'var(--accent)' : 'var(--border)'
                                                    }}
                                                >
                                                    {task.beforePhoto ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <Camera className="w-5 h-5 text-white" />}
                                                    <span style={{ fontSize: '10px', color: 'white' }}>{t('beforePhoto')}</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePhotoUpload(task.id, 'after')}
                                                    style={{
                                                        border: '1px dashed var(--border)', background: 'none', padding: '12px', borderRadius: '10px',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer',
                                                        borderColor: task.afterPhoto ? 'var(--accent)' : 'var(--border)'
                                                    }}
                                                >
                                                    {task.afterPhoto ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <Camera className="w-5 h-5 text-white" />}
                                                    <span style={{ fontSize: '10px', color: 'white' }}>{t('afterPhoto')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                                        {task.status === 'assigned' ? (
                                            <button onClick={() => updateTaskStatus(task.id, 'working')} className="btn-primary" style={{ flex: 1 }}>
                                                <Play className="w-4 h-4" /> {t('startWork')}
                                            </button>
                                        ) : task.status === 'working' ? (
                                            <button
                                                onClick={() => updateTaskStatus(task.id, 'finished')}
                                                className="btn-primary"
                                                style={{ flex: 1, background: '#22c55e' }}
                                                disabled={!task.beforePhoto || !task.afterPhoto}
                                            >
                                                <CheckCircle2 className="w-4 h-4" /> {t('completeWork')}
                                            </button>
                                        ) : (
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: '700' }}>
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span>{t('finished')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                            <ClipboardList className="w-12 h-12 opacity-10 mx-auto mb-4" />
                            <p>{t('noAssignedTasks')}</p>
                        </div>
                    )}

                    {activeTab === 'completed' && mechanicData?.reviews && (
                        <div style={{ marginTop: '40px' }}>
                            <h3 style={{ marginBottom: '20px', fontSize: '18px', color: 'white' }}>{t('reviews')}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {mechanicData.reviews.map((rev: { id: number, user: string, comment: string, rating: number, date: string }) => (
                                    <div key={rev.id} className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div style={{ fontWeight: '600', color: 'white' }}>{rev.user}</div>
                                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rev.date}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                                        </div>
                                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </main>
    );
}
