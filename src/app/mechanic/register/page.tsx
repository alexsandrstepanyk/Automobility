'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, ChevronRight, ChevronLeft, CheckCircle2, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function MechanicRegister() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: '',
        specialization: [] as string[],
        experience: ''
    });

    const nextStep = () => {
        if (step === 2) {
            const newMechanic = {
                id: 'pm_' + Date.now(),
                name: formData.name,
                phone: formData.phone,
                city: formData.city,
                spec: formData.specialization.join(', '),
                skills: formData.specialization,
                exp: formData.experience + ' ' + t('years'),
                rating: 5.0,
                reviewsCount: 0
            };
            const existing = JSON.parse(localStorage.getItem('pendingMechanics') || '[]');
            localStorage.setItem('pendingMechanics', JSON.stringify([...existing, newMechanic]));
        }
        setStep(step + 1);
    };
    const prevStep = () => setStep(step - 1);

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            specialization: prev.specialization.includes(skill)
                ? prev.specialization.filter(s => s !== skill)
                : [...prev.specialization, skill]
        }));
    };

    const availableSkills = [
        { id: 'oilChange', label: t('oilChange') },
        { id: 'brakeChange', label: t('brakeChange') },
        { id: 'wheelChange', label: t('wheelChange') },
        { id: 'detailing', label: t('detailing') },
        { id: 'electronics', label: t('electronics') },
        { id: 'engineRepair', label: t('engineRepair') },
        { id: 'mobileDiagnostics', label: t('mobileDiagnostics') },
    ];

    return (
        <main className="mobile-container">
            <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                    <button onClick={() => step > 1 ? prevStep() : window.history.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <ChevronLeft />
                    </button>
                    <span style={{ fontWeight: '600' }}>{t('registerAsMechanic')}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= i ? 'var(--accent)' : 'var(--surface)' }}></div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Контактні дані</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Як нам до вас звертатися?</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ position: 'relative' }}>
                                    <User style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                                    <input
                                        type="text"
                                        placeholder={t('namePlace')}
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Phone style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                                    <input
                                        type="tel"
                                        placeholder={t('phonePlace')}
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <MapPin style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                                    <select
                                        className="input-field"
                                        style={{ paddingLeft: '48px', appearance: 'none' }}
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option value="">{t('selectCity')}</option>
                                        {['kyiv', 'lviv', 'odessa', 'dnipro', 'kharkiv', 'vinnytsia'].map(city => (
                                            <option key={city} value={city}>{t(city)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <button className="btn-primary w-full" onClick={nextStep} disabled={!formData.name || !formData.phone || !formData.city}>
                                    {t('next')} <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{t('skills')}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Які послуги ви можете надавати?</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                {availableSkills.map(skill => (
                                    <button
                                        key={skill.id}
                                        onClick={() => toggleSkill(skill.label)}
                                        className="glass"
                                        style={{
                                            padding: '12px',
                                            borderRadius: '12px',
                                            fontSize: '13px',
                                            textAlign: 'left',
                                            border: formData.specialization.includes(skill.label) ? '1px solid var(--accent)' : '1px solid var(--border)',
                                            background: formData.specialization.includes(skill.label) ? 'var(--accent-glow)' : 'rgba(255,255,255,0.02)',
                                            color: formData.specialization.includes(skill.label) ? 'white' : 'var(--text-secondary)'
                                        }}
                                    >
                                        {skill.label}
                                    </button>
                                ))}
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Clock style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                                <input
                                    type="number"
                                    placeholder={t('mechanicExp') + " (" + t('years') + ")"}
                                    className="input-field"
                                    style={{ paddingLeft: '48px' }}
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                />
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <button className="btn-primary w-full" onClick={nextStep} disabled={formData.specialization.length === 0 || !formData.experience}>
                                    {t('next')} <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '40px 0' }}
                        >
                            <div style={{ background: 'var(--accent-glow)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <CheckCircle2 className="w-12 h-12 text-white" />
                            </div>
                            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Заявка прийнята!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                                Ми перевіримо ваші дані та зв&apos;яжемося з вами найближчим часом для активації аккаунту.
                            </p>
                            <Link href="/">
                                <button className="btn-primary w-full">
                                    {t('backToHome')}
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
