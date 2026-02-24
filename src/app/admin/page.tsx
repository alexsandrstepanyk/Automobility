'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Package, Clock,
    Search, MoreVertical,
    Activity, TrendingUp, DollarSign, Map,
    ShieldCheck, UserCheck, Wrench
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function AdminDashboard() {
    const { t, language } = useLanguage();

    const [activeTab, setActiveTab] = useState<'orders' | 'verification'>('orders');
    const [verifSubTab, setVerifSubTab] = useState<'mechanics' | 'users'>('mechanics');

    const [orders, setOrders] = useState([
        { id: '1', user: 'Олександр В.', car: 'Audi Q7', services: [t('oilChange')], status: 'pending', mechanic: null, time: '14:00', loc: 'Хрещатик, 1' },
        { id: '2', user: 'Марія К.', car: 'BMW X5', services: [t('wheelChange'), t('detailing')], status: 'approved', mechanic: 'Віталій С.', time: '16:30', loc: 'пр. Перемоги, 45' },
        { id: '3', user: 'Ігор П.', car: 'Tesla Model 3', services: [t('brakeChange')], status: 'pending', mechanic: null, time: '10:00', loc: 'вул. Соборна, 12' },
    ]);

    const [pendingMechanics, setPendingMechanics] = useState([
        { id: 'pm1', name: 'Сергій П.', phone: '+380 93 111 22 33', spec: 'Ходова, Двигуни', exp: '8 ' + t('years') },
        { id: 'pm2', name: 'Олег М.', phone: '+380 66 444 55 66', spec: 'Електрика', exp: '4 ' + t('years') },
    ]);

    useEffect(() => {
        const stored = localStorage.getItem('pendingMechanics');
        if (stored) {
            const externalPending = JSON.parse(stored);
            // Instead of setPendingMechanics directly, just handle it once
            if (externalPending.length > 0) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setPendingMechanics(prev => {
                    const combined = [...prev];
                    externalPending.forEach((newPm: { id: string, name: string, phone: string, spec: string, exp: string }) => {
                        if (!combined.some(p => p.id === newPm.id)) {
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

    const [mechanics, setMechanics] = useState([
        { id: 'm1', name: 'Віталій С.', status: 'busy' },
        { id: 'm2', name: 'Денис Р.', status: 'available' },
        { id: 'm3', name: 'Артем О.', status: 'available' },
    ]);

    const syncToStorage = (updatedPending: { id: string, name: string, phone: string, spec: string, exp: string }[]) => {
        // Only sync those that are NOT the hardcoded mock ones (pm1, pm2)
        const toStore = updatedPending.filter(m => !m.id.startsWith('pm1') && !m.id.startsWith('pm2'));
        localStorage.setItem('pendingMechanics', JSON.stringify(toStore));
    };

    const approveMechanic = (pm: { id: string, name: string, phone: string, spec: string, exp: string }) => {
        setMechanics([...mechanics, { id: pm.id, name: pm.name, status: 'available' }]);
        const updated = pendingMechanics.filter(m => m.id !== pm.id);
        setPendingMechanics(updated);
        syncToStorage(updated);
    };

    const rejectMechanic = (id: string) => {
        const updated = pendingMechanics.filter(m => m.id !== id);
        setPendingMechanics(updated);
        syncToStorage(updated);
    };

    const approveUser = (id: string) => {
        setPendingUsers(pendingUsers.filter(u => u.id !== id));
    };

    const assignMechanic = (orderId: string, mechName: string) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'approved', mechanic: mechName } : o));
    };

    const stats = [
        { label: t('statsToday'), value: '12', icon: <Package className="text-blue-400" />, trend: '+20%' },
        { label: t('statsActive'), value: '5', icon: <Users className="text-green-400" />, trend: '0%' },
        { label: t('statsIncome'), value: '18,500₴', icon: <DollarSign className="text-yellow-400" />, trend: '+15%' },
    ];

    return (
        <main className="min-h-screen bg-black" style={{ padding: '24px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px' }}>{t('adminTitle')}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>{t('adminDesc')}</p>
                    </div>

                    <div style={{ display: 'flex', background: 'var(--surface)', padding: '4px', borderRadius: '12px', marginLeft: '20px' }}>
                        <button
                            onClick={() => setActiveTab('orders')}
                            style={{
                                padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer',
                                background: activeTab === 'orders' ? 'var(--accent)' : 'transparent',
                                color: 'white'
                            }}
                        >
                            {t('orderQueue')}
                        </button>
                        <button
                            onClick={() => setActiveTab('verification')}
                            style={{
                                padding: '8px 16px', borderRadius: '8px', border: 'none', fontSize: '14px', cursor: 'pointer',
                                background: activeTab === 'verification' ? 'var(--accent)' : 'transparent',
                                color: 'white'
                            }}
                        >
                            {t('verification')}
                        </button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="premium-card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity className="text-green-500 w-4 h-4" />
                        <span style={{ fontSize: '14px' }}>Live: 24 {language === 'uk' ? 'замовлення' : 'orders'}</span>
                    </div>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
                        <Map className="w-4 h-4" /> {language === 'uk' ? 'Карта FLEET' : 'FLEET Map'}
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="premium-card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>{stat.icon}</div>
                            <button style={{ color: 'var(--accent)', fontSize: '12px', marginLeft: 'auto', background: 'none', border: 'none', fontWeight: '700' }}>
                                {stat.trend} <TrendingUp className="w-3 h-3 inline" />
                            </button>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{stat.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '4px' }}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'orders' ? (
                        <motion.section
                            key="orders"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="premium-card"
                            style={{ padding: '0' }}
                        >
                            <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{t('orderQueue')}</h3>
                                <div style={{ position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', color: 'var(--text-secondary)' }} />
                                    <input type="text" placeholder={t('search')} className="input-field" style={{ paddingLeft: '32px', fontSize: '14px', width: '200px' }} />
                                </div>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.02)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                            <th style={{ padding: '16px 20px', textAlign: 'left' }}>{t('clientCar')}</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left' }}>{t('services')}</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left' }}>{t('timePlace')}</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left' }}>{t('status')}</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'left' }}>{t('mechanic')}</th>
                                            <th style={{ padding: '16px 20px', textAlign: 'right' }}>{t('action')}</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '14px' }}>
                                        {orders.map((o) => (
                                            <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ fontWeight: '600', color: 'white' }}>{o.user}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{o.car}</div>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', gap: '4px' }}>{o.services.map(s => <span key={s} style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: 'white' }}>{s}</span>)}</div>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white' }}><Clock className="w-3 h-3 text-blue-400" /> {o.time}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{o.loc}</div>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '11px',
                                                        background: o.status === 'pending' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                        color: o.status === 'pending' ? '#eab308' : '#22c55e'
                                                    }}>
                                                        {t(o.status)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    {o.mechanic ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
                                                            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                                                            {o.mechanic}
                                                        </div>
                                                    ) : (
                                                        <select
                                                            onChange={(e) => assignMechanic(o.id, e.target.value)}
                                                            className="glass"
                                                            style={{ color: 'white', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 8px', fontSize: '12px' }}
                                                        >
                                                            <option value="">{t('assignMechanic')}</option>
                                                            {mechanics.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                                        </select>
                                                    )}
                                                </td>
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}><MoreVertical className="w-5 h-5" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section
                            key="verification"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            <div className="premium-card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                                    <button
                                        onClick={() => setVerifSubTab('mechanics')}
                                        style={{
                                            background: 'none', border: 'none', color: verifSubTab === 'mechanics' ? 'var(--accent)' : 'var(--text-secondary)',
                                            fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        <Wrench className="w-4 h-4" /> {t('pendingMechanics')} ({pendingMechanics.length})
                                    </button>
                                    <button
                                        onClick={() => setVerifSubTab('users')}
                                        style={{
                                            background: 'none', border: 'none', color: verifSubTab === 'users' ? 'var(--accent)' : 'var(--text-secondary)',
                                            fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                    >
                                        <UserCheck className="w-4 h-4" /> {t('pendingUsers')} ({pendingUsers.length})
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {verifSubTab === 'mechanics' ? (
                                        pendingMechanics.map(m => (
                                            <div key={m.id} className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: '700' }}>{m.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.spec} • {m.exp}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{m.phone}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => rejectMechanic(m.id)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                                                        {t('reject')}
                                                    </button>
                                                    <button onClick={() => approveMechanic(m)} style={{ border: 'none', background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                                                        {t('approve')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        pendingUsers.map(u => (
                                            <div key={u.id} className="glass" style={{ padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontWeight: '700' }}>{u.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Авто: {u.car}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{u.phone}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => setPendingUsers(pendingUsers.filter(user => user.id !== u.id))} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                                                        {t('reject')}
                                                    </button>
                                                    <button onClick={() => approveUser(u.id)} style={{ border: 'none', background: 'var(--accent)', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600' }}>
                                                        {t('approve')}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {(verifSubTab === 'mechanics' ? pendingMechanics : pendingUsers).length === 0 && (
                                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                                            <ShieldCheck className="w-12 h-12 opacity-20 mx-auto mb-4" />
                                            <p>{language === 'uk' ? 'Всі заявки оброблені' : 'All applications processed'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Fleet Sidebar */}
                <section className="premium-card" style={{ height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>{language === 'uk' ? 'Доступні майстри' : 'Available Fleet'}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {mechanics.map(m => (
                            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{m.name}</div>
                                    <div style={{ fontSize: '11px', color: m.status === 'busy' ? '#eab308' : '#22c55e' }}>
                                        {m.status === 'busy' ? (language === 'uk' ? 'Зайнятий' : 'Busy') : (language === 'uk' ? 'Вільний' : 'Available')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}
