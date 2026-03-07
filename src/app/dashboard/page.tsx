'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Droplets, Disc, Settings, Car,
    Calendar as CalendarIcon, MapPin,
    Clock, CheckCircle, Activity, Info, Package, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import OilChangeFlow from './flow/OilChangeFlow';
import BrakeChangeFlow from './flow/BrakeChangeFlow';

export default function Dashboard() {
    const { t, language } = useLanguage();
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [date, setDate] = useState('2026-02-19');
    const [time, setTime] = useState('14:00');
    const [location, setLocation] = useState(language === 'uk' ? 'вул. Хрещатик, 1, Київ' : '1 Khreshchatyk St, Kyiv');
    const [isOrdered, setIsOrdered] = useState(false);
    const [showOilFlow, setShowOilFlow] = useState(false);
    const [showBrakeFlow, setShowBrakeFlow] = useState(false);

    const services = [
        { id: 'oil', name: t('oilChange'), icon: <Droplets />, price: '~1500₴' },
        { id: 'brakes', name: t('brakeChange'), icon: <Settings />, price: '~1200₴' },
        { id: 'wheels', name: t('wheelChange'), icon: <Disc />, price: '~800₴' },
        { id: 'detailing', name: t('detailing'), icon: <Car />, price: '~2500₴' },
    ];

    const toggleService = (id: string) => {
        if (id === 'oil' && !selectedServices.includes('oil')) {
            setShowOilFlow(true);
            return;
        }
        if (id === 'brakes' && !selectedServices.includes('brakes')) {
            setShowBrakeFlow(true);
            return;
        }
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    if (isOrdered) {
        return (
            <main className="mobile-container flex flex-col items-center justify-center min-vh-100 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="premium-card"
                    style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}
                >
                    <div style={{ background: 'var(--accent)', padding: '20px', borderRadius: '50%' }}>
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2>{t('orderAccepted')}</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {t('orderThanks')}
                    </p>
                    <button className="btn-primary w-full" onClick={() => setIsOrdered(false)}>{t('backToHome')}</button>
                </motion.div>
            </main>
        );
    }

    if (showOilFlow) {
        return (
            <OilChangeFlow
                onComplete={() => {
                    setSelectedServices(prev => [...prev, 'oil']);
                    setShowOilFlow(false);
                }}
                onCancel={() => setShowOilFlow(false)}
            />
        );
    }

    if (showBrakeFlow) {
        return (
            <BrakeChangeFlow
                onComplete={() => {
                    setSelectedServices(prev => [...prev, 'brakes']);
                    setShowBrakeFlow(false);
                }}
                onCancel={() => setShowBrakeFlow(false)}
            />
        );
    }

    return (
        <main className="mobile-container" style={{ paddingBottom: '120px' }}>
            <header style={{ padding: '20px 0', borderBottom: '1px solid var(--border)', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px' }}>{t('hello')}, Олександре! 👋</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Audi Q7 (AA 0001 AA)</p>
                </div>
                <Link href="/settings">
                    <div style={{ background: 'var(--surface-hover)', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                        <Settings className="w-5 h-5 text-white" />
                    </div>
                </Link>
            </header>

            {/* Services List */}
            <section>
                <h3 style={{ marginBottom: '16px' }}>{t('chooseService')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {services.map((s) => (
                        <div
                            key={s.id}
                            className="premium-card"
                            onClick={() => toggleService(s.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                borderColor: selectedServices.includes(s.id) ? 'var(--accent)' : 'var(--border)',
                                background: selectedServices.includes(s.id) ? 'var(--surface-hover)' : 'var(--surface)'
                            }}
                        >
                            <div style={{ color: 'var(--accent)' }}>{s.icon}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600' }}>{s.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('approx')} {s.price}</div>
                            </div>
                            <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                border: '2px solid var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: selectedServices.includes(s.id) ? 'var(--accent)' : 'transparent'
                            }}>
                                {selectedServices.includes(s.id) && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                        </div>
                    ))}

                    <div
                        className="premium-card"
                        onClick={() => toggleService('diagnostics')}
                        style={{
                            marginTop: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            borderColor: selectedServices.includes('diagnostics') ? 'var(--accent)' : 'var(--accent-glow)',
                            background: selectedServices.includes('diagnostics') ? 'var(--accent)' : 'var(--accent-glow)',
                            color: 'white'
                        }}
                    >
                        <div style={{ background: selectedServices.includes('diagnostics') ? 'rgba(255,255,255,0.2)' : 'var(--accent)', padding: '8px', borderRadius: '10px' }}>
                            <Activity className="text-white w-5 h-5" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '700' }}>{t('mobileDiagnostics')}</div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{t('approx')} ~1000₴</div>
                        </div>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: selectedServices.includes('diagnostics') ? 'white' : 'transparent'
                        }}>
                            {selectedServices.includes('diagnostics') && <CheckCircle className="w-5 h-5 text-accent" />}
                        </div>
                    </div>
                </div>
            </section>

            {/* Schedule & Location */}
            <section style={{ marginTop: '32px' }}>
                <h3 style={{ marginBottom: '16px' }}>{t('whereWhen')}</h3>
                <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MapPin className="text-red-400" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="input-field"
                            style={{ border: 'none', background: 'none', padding: 0 }}
                        />
                    </div>
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <CalendarIcon className="text-blue-400 w-5" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{ background: 'none', color: 'white', border: 'none', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            <Clock className="text-green-400 w-5" />
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{ background: 'none', color: 'white', border: 'none', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* My Orders Link */}
            <section style={{ marginTop: '32px', marginBottom: '32px' }}>
                <Link href="/orders" style={{ textDecoration: 'none' }}>
                    <div className="premium-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderColor: 'var(--accent)', background: 'var(--accent-glow)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ background: 'var(--accent)', padding: '12px', borderRadius: '12px' }}>
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Мої замовлення</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Переглянути статус виконання</div>
                            </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-accent" />
                    </div>
                </Link>
            </section>

            {/* Checkout Bar */}
            {selectedServices.length > 0 && (
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="glass"
                    style={{
                        position: 'fixed', bottom: '20px', left: '20px', right: '20px',
                        borderRadius: '24px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 1000
                    }}
                >
                    <div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{selectedServices.length} {t('servicesSelected')}</div>
                        <div style={{ fontWeight: '700', fontSize: '20px' }}>{t('order')}</div>
                    </div>
                    <button className="btn-primary" onClick={() => setIsOrdered(true)}>
                        {t('order')}
                    </button>
                </motion.div>
            )}
        </main>
    );
}
