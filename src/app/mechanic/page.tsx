'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

import './mechanic.css';
import MechanicHeader from './components/MechanicHeader';
import TabNavigation from './components/TabNavigation';
import TaskCard from './components/TaskCard';

export default function MechanicDashboard() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mechanicData, setMechanicData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'assigned' | 'completed'>('assigned');

    const [allTasks, setAllTasks] = useState<any[]>([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch('/api/orders');
                const rawData = await res.json();

                const mapped = rawData.map((t: any) => ({
                    id: t.id,
                    client: t.clientName,
                    car: t.carModel,
                    services: JSON.parse(t.services || '[]'),
                    time: t.time || '10:00',
                    status: t.status,
                    loc: t.location || '?',
                    city: t.city || 'kyiv',
                    price: t.price || '0₴',
                    dist: t.dist || '1 км',
                    beforePhoto: t.beforePhoto,
                    afterPhoto: t.afterPhoto,
                    clientPhone: t.clientPhone,
                    adLink: t.adLink
                }));
                setAllTasks(mapped);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, []);

    useEffect(() => {
        const auth = localStorage.getItem('mechanicAuth');
        if (!auth) {
            router.push('/mechanic/login');
        } else {
            setIsLoggedIn(true);
            setMechanicData({
                name: 'Віталій С.',
                city: 'kyiv',
                skills: [t('oilChange'), t('brakeChange'), t('wheelChange'), t('mobileDiagnostics')],
                rating: 4.9,
                reviews: [
                    { id: 1, user: 'Олександр', comment: 'Швидко та якісно!', rating: 5, date: '12.02.2026' },
                    { id: 2, user: 'Марія', comment: 'Дуже ввічливий майстер.', rating: 5, date: '10.02.2026' }
                ]
            });
        }
    }, [router, t]);

    const filteredTasks = allTasks.filter(task => {
        if (!mechanicData) return true;

        const tabMatch = activeTab === 'assigned' ? (task.status === 'assigned' || task.status === 'working' || task.status === 'approved') : task.status === 'finished';

        if (activeTab === 'assigned' && tabMatch) {
            const cityMatch = task.city === mechanicData.city;
            const skillMatch = task.services.some((s: string) => mechanicData.skills.includes(s));
            // Demo fallback: show all approved/working tasks if we are in demo (skills may not align 100%)
            return true;
        }

        return tabMatch;
    });

    const updateTaskStatus = async (id: string, status: string) => {
        setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        try {
            await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handlePhotoUpload = async (taskId: string, type: 'before' | 'after') => {
        setAllTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, [type + 'Photo']: 'uploaded' } : t
        ));
        try {
            await fetch(`/api/orders/${taskId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [type + 'Photo']: 'uploaded' })
            });
        } catch (err) {
            console.error();
        }
    };

    if (!isLoggedIn) return (
        <div style={{ background: 'black', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div>
        </div>
    );

    return (
        <main className="mechanic-container">
            <MechanicHeader mechanicData={mechanicData} t={t} />

            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {filteredTasks.length > 0 ? (
                        <div className="tasks-list">
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    t={t}
                                    handlePhotoUpload={handlePhotoUpload}
                                    updateTaskStatus={updateTaskStatus}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <ClipboardList className="w-12 h-12 opacity-10 mx-auto mb-4" />
                            <p>{t('noAssignedTasks')}</p>
                        </div>
                    )}

                    {activeTab === 'completed' && mechanicData?.reviews && (
                        <div className="reviews-section">
                            <h3 className="reviews-title">{t('reviews')}</h3>
                            <div className="tasks-list">
                                {mechanicData.reviews.map((rev: any) => (
                                    <div key={rev.id} className="glass review-card">
                                        <div className="review-header">
                                            <div className="review-user">{rev.user}</div>
                                            <div className="review-date">{rev.date}</div>
                                        </div>
                                        <div className="review-rating">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                                        </div>
                                        <p className="review-text">{rev.comment}</p>
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
