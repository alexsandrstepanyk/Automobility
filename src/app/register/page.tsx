'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, User, Phone, Mail, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/constants/translations';

export default function Register() {
    const { language, setLanguage, t } = useLanguage();
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        carMake: '',
        carModel: '',
        plate: ''
    });

    const [brands, setBrands] = useState<string[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
    const [showModelSuggestions, setShowModelSuggestions] = useState(false);

    // Fetch brands on mount
    useEffect(() => {
        fetch('/api/cars/catalog')
            .then(res => res.json())
            .then(data => setBrands(Array.isArray(data) ? data : []))
            .catch(err => console.error('Failed to fetch brands', err));
    }, []);

    // Fetch models when brand changes
    const handleBrandSelect = (brand: string) => {
        setFormData({ ...formData, carMake: brand, carModel: '' });
        setShowBrandSuggestions(false);
        fetch(`/api/cars/catalog?brand=${encodeURIComponent(brand)}`)
            .then(res => res.json())
            .then(data => setModels(Array.isArray(data) ? data : []))
            .catch(err => console.error('Failed to fetch models', err));
    };

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: 'uk', name: 'Українська', flag: '🇺🇦' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    ];

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <main className="mobile-container">
            <div style={{ padding: '20px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
                    <button onClick={() => step > 0 ? prevStep() : window.history.back()} style={{ background: 'none', border: 'none', color: 'white' }}>
                        <ChevronLeft />
                    </button>
                    <span style={{ fontWeight: '600' }}>{t('register')}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                        <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= 0 ? 'var(--accent)' : 'var(--surface)' }}></div>
                        <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= 1 ? 'var(--accent)' : 'var(--surface)' }}></div>
                        <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= 2 ? 'var(--accent)' : 'var(--surface)' }}></div>
                        <div style={{ width: '12px', height: '4px', borderRadius: '2px', background: step >= 3 ? 'var(--accent)' : 'var(--surface)' }}></div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Language / Мова</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Choose your interface language</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setLanguage(lang.code); nextStep(); }}
                                        className="premium-card"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px',
                                            border: language === lang.code ? '2px solid var(--accent)' : '1px solid var(--border)',
                                            background: language === lang.code ? 'var(--surface-hover)' : 'var(--surface)'
                                        }}
                                    >
                                        <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{t('whoAreYou')}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('dealWithWho')}</p>

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
                                    <Mail style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                                    <input
                                        type="email"
                                        placeholder={t('emailPlace')}
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <button className="btn-primary w-full" onClick={nextStep}>
                                    {t('next')} <ChevronRight className="w-5 h-5" />
                                </button>
                                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                    <button style={{ background: 'var(--surface)', border: 'none', color: 'white', padding: '12px', borderRadius: '12px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <Image src="/google-favicon.ico" alt="Google" width={18} height={18} /> {t('googleCont')}
                                    </button>
                                </div>
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
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{t('city')}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('selectCity')}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                {['kyiv', 'lviv', 'odessa', 'dnipro', 'kharkiv', 'vinnytsia'].map((cityKey) => (
                                    <button
                                        key={cityKey}
                                        onClick={() => { setFormData({ ...formData, city: cityKey }); nextStep(); }}
                                        className="premium-card"
                                        style={{
                                            border: formData.city === cityKey ? '2px solid var(--accent)' : '1px solid var(--border)',
                                            background: formData.city === cityKey ? 'var(--surface-hover)' : 'var(--surface)',
                                            padding: '16px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{t(cityKey)}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>{t('carDetails')}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>{t('dataForParts')}</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ position: 'relative' }}>
                                    <Car style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-secondary)', width: '20px' }} />
                                    <input
                                        type="text"
                                        placeholder={t('carMake')}
                                        className="input-field"
                                        style={{ paddingLeft: '48px' }}
                                        value={formData.carMake}
                                        onChange={(e) => {
                                            setFormData({ ...formData, carMake: e.target.value });
                                            setShowBrandSuggestions(true);
                                        }}
                                        onFocus={() => setShowBrandSuggestions(true)}
                                    />
                                    {showBrandSuggestions && formData.carMake && (
                                        <div className="premium-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, maxHeight: '200px', overflowY: 'auto', marginTop: '4px', padding: '8px' }}>
                                            {brands.filter(b => b.toLowerCase().includes(formData.carMake.toLowerCase())).map(brand => (
                                                <div
                                                    key={brand}
                                                    onClick={() => handleBrandSelect(brand)}
                                                    style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    {brand}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder={t('carModel')}
                                        className="input-field"
                                        value={formData.carModel}
                                        onChange={(e) => {
                                            setFormData({ ...formData, carModel: e.target.value });
                                            setShowModelSuggestions(true);
                                        }}
                                        disabled={!formData.carMake}
                                        onFocus={() => setShowModelSuggestions(true)}
                                    />
                                    {showModelSuggestions && formData.carModel && models.length > 0 && (
                                        <div className="premium-card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, maxHeight: '200px', overflowY: 'auto', marginTop: '4px', padding: '8px' }}>
                                            {models.filter(m => m.toLowerCase().includes(formData.carModel.toLowerCase())).map(model => (
                                                <div
                                                    key={model}
                                                    onClick={() => {
                                                        setFormData({ ...formData, carModel: model });
                                                        setShowModelSuggestions(false);
                                                    }}
                                                    style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-hover)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    {model}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    placeholder={t('platePlace')}
                                    className="input-field"
                                    value={formData.plate}
                                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                                />
                            </div>

                            <div style={{ marginTop: '40px' }}>
                                <button
                                    className="btn-primary w-full"
                                    onClick={() => {
                                        localStorage.setItem('clientAuth', 'true');
                                        window.location.href = '/';
                                    }}
                                >
                                    {t('finish')} <CheckCircle2 className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
