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
        <main className="mobile-container flex-col" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Header */}
            <header className="page-header">
                <button onClick={() => router.back()} className="icon-btn">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="page-header-title">Мої замовлення</h1>
            </header>

            {/* Tabs */}
            <div className="tabs-wrapper">
                <button
                    onClick={() => setActiveTab('new')}
                    className={`glass tab-item ${activeTab === 'new' ? 'active' : 'inactive'}`}
                >
                    Нові
                </button>
                <button
                    onClick={() => setActiveTab('progress')}
                    className={`glass tab-item ${activeTab === 'progress' ? 'active' : 'inactive'}`}
                >
                    В процесі
                </button>
                <button
                    onClick={() => setActiveTab('completed')}
                    className={`glass tab-item ${activeTab === 'completed' ? 'active' : 'inactive'}`}
                >
                    Виконані
                </button>
            </div>

            {/* Content */}
            <div className="flex-col gap-3">
                <AnimatePresence mode="popLayout">
                    {filteredOrders.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-col flex-center text-muted" style={{ padding: '40px 20px' }}>
                            <Package className="w-12 h-12 mb-4 opacity-50" />
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
                                <div className="flex-between" style={{ marginBottom: '12px' }}>
                                    <span className="text-muted text-sm">Замовлення #{order.id}</span>
                                    <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>{order.date}</span>
                                </div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>{order.title}</div>
                                <div className="flex-between">
                                    <span className="text-muted text-md">{order.loc}</span>
                                    <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{order.price}</span>
                                </div>
                                <div className="flex-row gap-2" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
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
