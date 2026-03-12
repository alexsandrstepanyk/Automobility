'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Map, Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './admin.css';

import OrdersTable from './components/OrdersTable';
import VerificationPanel from './components/VerificationPanel';
import FleetSidebar from './components/FleetSidebar';

export default function AdminDashboard() {
    const { t } = useLanguage();

    const [activeTab, setActiveTab] = useState<'orders' | 'verification'>('orders');
    const [verifSubTab, setVerifSubTab] = useState<'mechanics' | 'users'>('mechanics');

    const [orders, setOrders] = useState<any[]>([]);

    const [pendingMechanics, setPendingMechanics] = useState([
        { id: 'pm1', name: 'Сергій П.', phone: '+380 93 111 22 33', spec: 'Ходова, Двигуни', exp: '8 ' + t('years') },
        { id: 'pm2', name: 'Олег М.', phone: '+380 66 444 55 66', spec: 'Електрика', exp: '4 ' + t('years') },
    ]);

    useEffect(() => {
        const stored = localStorage.getItem('pendingMechanics');
        if (stored) {
            const externalPending = JSON.parse(stored);
            if (externalPending.length > 0) {
                setPendingMechanics(prev => {
                    const combined = [...prev];
                    externalPending.forEach((newPm: any) => {
                        if (!combined.some((p: any) => p.id === newPm.id)) {
                            combined.push(newPm);
                        }
                    });
                    return combined;
                });
            }
        }
    }, []);

    const [pendingUsers, setPendingUsers] = useState([
        { id: 'pu1', name: 'Віктор Р.', phone: '+380 50 777 88 99', car: 'Toyota Camry' },
    ]);

    const [mechanics, setMechanics] = useState<any[]>([]);

    useEffect(() => {
        const loadAPI = async () => {
            try {
                const [resOrders, resMechs] = await Promise.all([
                    fetch('/api/orders'),
                    fetch('/api/mechanics')
                ]);

                const rawOrders = await resOrders.json();
                const mappedOrders = rawOrders.map((o: any) => ({
                    id: o.id,
                    user: o.clientName,
                    car: o.carModel || '',
                    services: JSON.parse(o.services || '[]'),
                    status: o.status,
                    mechanic: o.mechanic ? o.mechanic.name : null,
                    time: o.time,
                    loc: o.location,
                    price: o.price,
                    clientPhone: o.clientPhone,
                    adLink: o.adLink
                }));
                setOrders(mappedOrders);

                const rawMechs = await resMechs.json();
                setMechanics(rawMechs.map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    status: m.status
                })));
            } catch (e) {
                console.error(e);
            }
        };
        loadAPI();
    }, []);

    const syncToStorage = (updatedPending: any[]) => {
        const toStore = updatedPending.filter((m: any) => !m.id.startsWith('pm1') && !m.id.startsWith('pm2'));
        localStorage.setItem('pendingMechanics', JSON.stringify(toStore));
    };

    const approveMechanic = (pm: any) => {
        setMechanics([...mechanics, { id: pm.id, name: pm.name, status: 'available' }]);
        const updated = pendingMechanics.filter((m: any) => m.id !== pm.id);
        setPendingMechanics(updated);
        syncToStorage(updated);
    };

    const rejectMechanic = (id: string) => {
        const updated = pendingMechanics.filter((m: any) => m.id !== id);
        setPendingMechanics(updated);
        syncToStorage(updated);
    };

    const approveUser = (id: string) => {
        setPendingUsers(pendingUsers.filter(u => u.id !== id));
    };

    const assignMechanic = async (orderId: string, mechName: string) => {
        const mech = mechanics.find(m => m.name === mechName);
        if (!mech) return;

        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'approved', mechanic: mechName } : o));

        try {
            await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved', mechanicId: mech.id })
            });
        } catch (e) {
            console.error('Failed to assign mechanic to order:', e);
        }
    };

    const stats = [
        { label: t('statsToday'), value: '48', icon: <Package className="text-blue-400" />, trend: '+120%' },
        { label: t('statsActive'), value: '14', icon: <Users className="text-green-400" />, trend: '+20%' },
        { label: t('statsIncome'), value: '143,200₴', icon: <DollarSign className="text-yellow-400" />, trend: '+215%' },
    ];

    return (
        <main className="admin-container">
            <header className="admin-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div className="admin-header-title">
                        <h1>{t('adminTitle')}</h1>
                        <p>{t('adminDesc')}</p>
                    </div>

                    <div className="admin-tabs">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                        >
                            {t('orderQueue')}
                        </button>
                        <button
                            onClick={() => setActiveTab('verification')}
                            className={`admin-tab ${activeTab === 'verification' ? 'active' : ''}`}
                        >
                            {t('verification')}
                        </button>
                    </div>
                </div>
                <div className="admin-header-actions">
                    <div className="premium-card live-badge">
                        <Activity className="text-green-500 w-4 h-4 animate-pulse" />
                        <span>Live: 48 {t('ordersCount')}</span>
                    </div>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                        <Map className="w-4 h-4" /> {t('fleetMap')}
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div className="stat-icon-wrapper">{stat.icon}</div>
                            <button className="stat-trend">
                                {stat.trend} <TrendingUp className="w-3 h-3 inline" />
                            </button>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="admin-main-grid">
                <AnimatePresence mode="wait">
                    {activeTab === 'orders' ? (
                        <OrdersTable
                            orders={orders}
                            mechanics={mechanics}
                            t={t}
                            assignMechanic={assignMechanic}
                        />
                    ) : (
                        <VerificationPanel
                            verifSubTab={verifSubTab}
                            setVerifSubTab={setVerifSubTab}
                            pendingMechanics={pendingMechanics}
                            pendingUsers={pendingUsers}
                            approveMechanic={approveMechanic}
                            rejectMechanic={rejectMechanic}
                            approveUser={approveUser}
                            setPendingUsers={setPendingUsers}
                            t={t}
                        />
                    )}
                </AnimatePresence>

                <FleetSidebar mechanics={mechanics} t={t} />
            </div>
        </main>
    );
}
