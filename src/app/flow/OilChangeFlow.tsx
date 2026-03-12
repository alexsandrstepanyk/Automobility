'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Filter, ChevronLeft, Calendar as CalendarIcon, MapPin, Clock, Droplets, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function OilChangeFlow({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1);
    const [carDetails, setCarDetails] = useState({ brand: '', model: '', vin: '', mileage: '' });
    const [selectedOil, setSelectedOil] = useState<string | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['oil']); // Oil filter is mandatory

    const handleCarSubmit = () => {
        // Here we simulate the VIN check logic and oil calculation
        setStep(2);
    };

    const handleOilSelect = (id: string) => {
        setSelectedOil(id);
        setStep(3);
    };

    const toggleFilter = (id: string, isMandatory: boolean) => {
        if (isMandatory) return; // Cannot toggle oil filter
        setSelectedFilters(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const renderStep1 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', display: 'flex' }}>
                    <ChevronLeft /> Назад
                </button>
                <h2 style={{ fontSize: '20px' }}>Дані автомобіля</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Введіть дані вашого авто, щоб ми точно розрахували необхідний об'єм масла та підібрали найкращі варіанти.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Марка авто (напр. BMW)" className="input-field" value={carDetails.brand} onChange={e => setCarDetails({ ...carDetails, brand: e.target.value })} />
                <input type="text" placeholder="Модель (напр. X5)" className="input-field" value={carDetails.model} onChange={e => setCarDetails({ ...carDetails, model: e.target.value })} />
                <input type="text" placeholder="VIN-код (17 символів)" className="input-field" value={carDetails.vin} onChange={e => setCarDetails({ ...carDetails, vin: e.target.value })} />
                <input type="number" placeholder="Поточний пробіг (км)" className="input-field" value={carDetails.mileage} onChange={e => setCarDetails({ ...carDetails, mileage: e.target.value })} />
            </div>

            <button
                className="btn-primary w-full"
                style={{ marginTop: '32px' }}
                onClick={handleCarSubmit}
                disabled={!carDetails.brand || !carDetails.model || !carDetails.vin || !carDetails.mileage}
            >
                Розрахувати <ChevronRight className="w-5 h-5" />
            </button>
        </motion.div>
    );

    const renderStep2 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex' }}>
                    <ChevronLeft /> Назад
                </button>
                <h2 style={{ fontSize: '20px' }}>Вибір масла</h2>
            </div>

            <div className="premium-card" style={{ marginBottom: '24px', background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
                <p style={{ color: 'var(--accent)', fontWeight: 'bold', marginBottom: '8px' }}>Результат аналізу VIN:</p>
                <p style={{ fontSize: '14px' }}>Для <b>{carDetails.brand} {carDetails.model}</b> потрібно <b>5.5 літрів</b> масла в'язкістю <b>5W-30</b>.</p>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Рекомендовані варіанти:</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                    { id: 'motul', name: 'Motul 8100 X-clean', price: '2 850 ₴', desc: 'Преміум захист двигуна' },
                    { id: 'castrol', name: 'Castrol EDGE', price: '2 300 ₴', desc: 'Оптимальний вибір' },
                    { id: 'shell', name: 'Shell Helix Ultra', price: '1 950 ₴', desc: 'Економічний варіант' }
                ].map(oil => (
                    <div
                        key={oil.id}
                        className="premium-card"
                        onClick={() => handleOilSelect(oil.id)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderColor: selectedOil === oil.id ? 'var(--accent)' : 'var(--border)' }}
                    >
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{oil.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{oil.desc}</div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{oil.price}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    );

    const renderStep3 = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex' }}>
                    <ChevronLeft /> Назад
                </button>
                <h2 style={{ fontSize: '20px' }}>Зручні доповнення</h2>
            </div>

            <div className="premium-card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Filter className="text-green-400" />
                    <span style={{ fontWeight: 'bold' }}>Масляний фільтр (Обов'язково)</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Аналіз VIN-коду: Підібрано оригінальний фільтр MAHLE OX 404. Ціна: 350 ₴.</p>
                <div style={{ marginTop: '12px', padding: '8px', background: 'var(--accent-glow)', borderRadius: '8px', textAlign: 'center', fontSize: '14px', color: 'var(--accent)' }}>Вже включено в замовлення</div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Рекомендуємо також замінити:</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Ваш пробіг <b>{carDetails.mileage} км</b>. Для кращого дихання авто та вашого комфорту, майстер може замінити ці фільтри на місці.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                    { id: 'cabin', name: 'Фільтр салону (вугільний)', price: '+ 450 ₴' },
                    { id: 'engine', name: 'Фільтр повітряний (двигун)', price: '+ 520 ₴' }
                ].map(filter => (
                    <div
                        key={filter.id}
                        className="premium-card"
                        onClick={() => toggleFilter(filter.id, false)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderColor: selectedFilters.includes(filter.id) ? 'var(--accent)' : 'var(--border)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: selectedFilters.includes(filter.id) ? 'var(--accent)' : 'transparent'
                            }}>
                                {selectedFilters.includes(filter.id) && <CheckCircle className="w-4 h-4 text-white" />}
                            </div>
                            <div style={{ fontWeight: '600' }}>{filter.name}</div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{filter.price}</div>
                    </div>
                ))}
            </div>

            <button
                className="btn-primary w-full"
                style={{ marginTop: '40px' }}
                onClick={onComplete}
            >
                Додати до замовлення <CheckCircle className="w-5 h-5" />
            </button>
        </motion.div>
    );

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--background)', zIndex: 2000, padding: '20px', overflowY: 'auto' }}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
        </div>
    );
}
