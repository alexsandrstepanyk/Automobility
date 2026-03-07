'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Package, Clock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function OrdersPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'new' | 'progress' | 'completed'>('new');

    const orders = [
        { id: '1004', status: 'new', date: 'Сьогодні, 14:00', title: 'Заміна гальм (Диски + Колодки)', price: '4500₴', loc: 'Хрещатик, 1' },
        { id: '1003', status: 'progress', date: 'Сьогодні, 10:00', title: 'Заміна масла', price: '1500₴', loc: 'Хрещатик, 1' },
        { id: '1002', status: 'completed', date: '10.02.2026', title: 'Шиномонтаж', price: '800₴', loc: 'пр. Перемоги, 45' },
        { id: '1001', status: 'completed', date: '15.01.2026', title: 'Діагностика на виїзді', price: '1000₴', loc: 'пр. Перемоги, 45' },
    ];

    const filteredOrders = orders.filter(o => o.status === activeTab);

    return (
        <main className="mobile-container" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Header */}
            <header style={{ padding: '20px 0', borderBottom: '1px solid var(--border)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 style={{ fontSize: '20px' }}>Мої замовлення</h1>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    onClick={() => setActiveTab('new')}
                    className="glass"
                    style={{
                        flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', border: 'none',
                        background: activeTab === 'new' ? 'var(--accent)' : 'var(--surface)',
                        color: activeTab === 'new' ? 'white' : 'var(--text-secondary)'
                    }}
                >
                    Нові
                </button>
                <button
                    onClick={() => setActiveTab('progress')}
                    className="glass"
                    style={{
                        flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', border: 'none',
                        background: activeTab === 'progress' ? 'var(--accent)' : 'var(--surface)',
                        color: activeTab === 'progress' ? 'white' : 'var(--text-secondary)'
                    }}
                >
                    В процесі
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className="glass"
                    style={{
                        flex: 1, padding: '12px', borderRadius: '12px', fontSize: '13px', border: 'none',
                        background: activeTab === 'completed' ? 'var(--accent)' : 'var(--surface)',
                        color: activeTab === 'completed' ? 'white' : 'var(--text-secondary)'
                    }}
                >
                    Виконані
                </button>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence mode="popLayout">
                    {filteredOrders.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>У цій категорії немає замовлень.</p>
                        </motion.div>
                    ) : (
                        filteredOrders.map(order => (
                            <motion.div
                                key={order.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="premium-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>Замовлення #{order.id}</span>
                                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>{order.date}</span>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{order.title}</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{order.loc}</span>
                                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{order.price}</span>
                                </div>
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {order.status === 'new' && <Package className="w-4 h-4 text-blue-400" />}
                                    {order.status === 'progress' && <Clock className="w-4 h-4 text-yellow-400" />}
                                    {order.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}

                                    <span style={{
                                        fontSize: '13px', color:
                                            order.status === 'new' ? '#60a5fa' :
                                                order.status === 'progress' ? '#facc15' : '#4ade80'
                                    }}>
                                        {order.status === 'new' ? 'Очікує призначення' :
                                            order.status === 'progress' ? 'Майстер працює' : 'Успішно завершено'}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
