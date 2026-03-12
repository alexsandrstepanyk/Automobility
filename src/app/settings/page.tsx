'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Car, User, Globe, Shield, LogOut, Check, Save, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function SettingsPage() {
    const { t, language, setLanguage } = useLanguage();
    const router = useRouter();

    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Mock states for form entries
    const [profile, setProfile] = useState({ firstName: 'Олександр', lastName: 'В.', dob: '1990-05-15', phone: '+380990000000', email: 'alex@example.com' });
    const [car, setCar] = useState({ brand: 'Audi', model: 'Q7', vin: 'WBA12345678901234', mileage: '125000', plate: 'AA 0001 AA' });

    const [isMechanic, setIsMechanic] = useState(false);

    useEffect(() => {
        setIsMechanic(!!localStorage.getItem('mechanicAuth'));
    }, []);

    const languages = [
        { code: 'uk', label: 'Українська' },
        { code: 'en', label: 'English' },
        { code: 'de', label: 'Deutsch' },
        { code: 'ru', label: 'Русский' },
        { code: 'fr', label: 'Français' },
        { code: 'pl', label: 'Polski' }
    ];

    const handleLogout = () => {
        localStorage.removeItem('mechanicAuth');
        router.push('/');
    };

    const handleSave = (section: string) => {
        setActiveSection(null);
    };

    return (
        <main className="mobile-container flex-col" style={{ minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Header */}
            <header className="page-header">
                <button onClick={() => router.back()} className="icon-btn">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="page-header-title">Налаштування</h1>
            </header>

            <div className="flex-col gap-4">

                {/* My Orders Section */}
                <Link href="/orders" style={{ textDecoration: 'none' }}>
                    <div className="premium-card flex-between" style={{ cursor: 'pointer' }}>
                        <div className="flex-row gap-3">
                            <div style={{ background: 'var(--accent)', padding: '10px', borderRadius: '12px' }}><Package className="text-white w-5 h-5" /></div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>Мої замовлення</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                </Link>

                {/* Profile Section */}
                <div className="premium-card">
                    <div className="flex-between" style={{ cursor: 'pointer' }} onClick={() => setActiveSection(activeSection === 'profile' ? null : 'profile')}>
                        <div className="flex-row gap-3">
                            <div className="icon-btn-surface" style={{ padding: '10px', borderRadius: '12px' }}><User className="text-white w-5 h-5" /></div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Профіль</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'profile' ? 'rotate-90' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {activeSection === 'profile' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                <div className="flex-col gap-3" style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>
                                    <input type="text" className="input-field" value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} placeholder="Ім'я" />
                                    <input type="text" className="input-field" value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} placeholder="Прізвище" />
                                    <input type="date" className="input-field" value={profile.dob} onChange={e => setProfile({ ...profile, dob: e.target.value })} style={{ color: 'white' }} />
                                    <input type="tel" className="input-field" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="Номер телефону" />
                                    <input type="email" className="input-field" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="Email" />
                                    <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={() => handleSave('profile')}>
                                        <Save className="w-5 h-5" /> Зберегти
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* My Car Section */}
                <div className="premium-card">
                    <div className="flex-between" style={{ cursor: 'pointer' }} onClick={() => setActiveSection(activeSection === 'car' ? null : 'car')}>
                        <div className="flex-row gap-3">
                            <div className="icon-btn-surface" style={{ padding: '10px', borderRadius: '12px' }}><Car className="text-white w-5 h-5" /></div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Моє авто</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'car' ? 'rotate-90' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {activeSection === 'car' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                <div className="flex-col gap-3" style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>
                                    <p className="text-muted text-sm" style={{ marginBottom: '4px' }}>Ця інформація допомагає нам автоматично підбирати деталі для вас.</p>
                                    <input type="text" className="input-field" value={car.brand} onChange={e => setCar({ ...car, brand: e.target.value })} placeholder="Марка авто" />
                                    <input type="text" className="input-field" value={car.model} onChange={e => setCar({ ...car, model: e.target.value })} placeholder="Модель" />
                                    <input type="text" className="input-field" value={car.vin} onChange={e => setCar({ ...car, vin: e.target.value })} placeholder="VIN-код" />
                                    <input type="text" className="input-field" value={car.plate} onChange={e => setCar({ ...car, plate: e.target.value })} placeholder="Номерний знак" />
                                    <input type="number" className="input-field" value={car.mileage} onChange={e => setCar({ ...car, mileage: e.target.value })} placeholder="Пробіг (км)" />
                                    <button className="btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={() => handleSave('car')}>
                                        <Save className="w-5 h-5" /> Зберегти
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Language Section */}
                <div className="premium-card">
                    <div className="flex-between" style={{ cursor: 'pointer' }} onClick={() => setActiveSection(activeSection === 'language' ? null : 'language')}>
                        <div className="flex-row gap-3">
                            <div className="icon-btn-surface" style={{ padding: '10px', borderRadius: '12px' }}><Globe className="text-white w-5 h-5" /></div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Мова (Language)</span>
                        </div>
                        <div className="flex-row gap-2">
                            <span className="text-muted">{language.toUpperCase()}</span>
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'language' ? 'rotate-90' : ''}`} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {activeSection === 'language' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                <div className="flex-col gap-2" style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px' }}>
                                    {languages.map(lang => (
                                        <div
                                            key={lang.code}
                                            onClick={() => {
                                                setLanguage(lang.code as any);
                                                setActiveSection(null);
                                            }}
                                            className="flex-between"
                                            style={{
                                                padding: '12px 16px',
                                                borderRadius: '12px',
                                                background: language === lang.code ? 'var(--accent)' : 'var(--surface)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span style={{ fontWeight: language === lang.code ? 'bold' : 'normal', color: language === lang.code ? 'white' : 'inherit' }}>
                                                {lang.label}
                                            </span>
                                            {language === lang.code && <Check className="w-5 h-5 text-white" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Privacy Policy */}
                <div className="premium-card">
                    <div className="flex-between" style={{ cursor: 'pointer' }} onClick={() => setActiveSection(activeSection === 'privacy' ? null : 'privacy')}>
                        <div className="flex-row gap-3">
                            <div className="icon-btn-surface" style={{ padding: '10px', borderRadius: '12px' }}><Shield className="text-white w-5 h-5" /></div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Політика конфіденційності</span>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSection === 'privacy' ? 'rotate-90' : ''}`} />
                    </div>

                    <AnimatePresence>
                        {activeSection === 'privacy' && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                <div style={{ borderTop: '1px solid var(--border)', marginTop: '16px', paddingTop: '16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                    <p>Ваші дані надійно захищені згідно з міжнародними стандартами безпеки. Ми не передаємо особисту інформацію третім особам без вашої згоди.</p>
                                    <p style={{ marginTop: '8px' }}>Вся інформація про ваш автомобіль використовується виключно для покращення сервісу підбору автозапчастин та надання максимально якісних послуг сертифікованими майстрами.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Logout */}
                <div className="premium-card" style={{ marginTop: '8px', borderColor: 'rgba(239, 68, 68, 0.3)', cursor: 'pointer' }} onClick={handleLogout}>
                    <div className="flex-row gap-3" style={{ color: '#ef4444' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '12px' }}><LogOut className="w-5 h-5" /></div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Вихід з акаунту</span>
                    </div>
                </div>

            </div>
        </main>
    );
}
