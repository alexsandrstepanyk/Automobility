'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, Disc, ShieldAlert, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BrakeChangeFlow({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
    const { t } = useLanguage();

    // Step management
    const [step, setStep] = useState(1);

    // Car details
    const [savedCar, setSavedCar] = useState<{ brand: string, model: string, vin: string } | null>(null);
    const [useSavedCar, setUseSavedCar] = useState<boolean | null>(null);
    const [carDetails, setCarDetails] = useState({ brand: '', model: '', vin: '' });

    // Brake preferences
    const [partType, setPartType] = useState<'pads' | 'discs' | 'both' | null>(null);
    const [axle, setAxle] = useState<'front' | 'rear' | 'both' | null>(null);

    // Selected option
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        // Try to load saved car from localStorage. If none, we can use a mock for demonstration.
        try {
            const saved = localStorage.getItem('userCar');
            if (saved) {
                setSavedCar(JSON.parse(saved));
            } else {
                // Mock saved car to demonstrate the feature if user hasn't saved one yet
                setSavedCar({ brand: 'Audi', model: 'Q7', vin: 'WBA12345678901234' });
            }
        } catch (e) {
            setSavedCar(null);
        }
    }, []);

    const handleCarConfirmation = (isMyCar: boolean) => {
        setUseSavedCar(isMyCar);
        if (isMyCar && savedCar) {
            setCarDetails({ brand: savedCar.brand, model: savedCar.model, vin: savedCar.vin });
            setStep(2); // Go to service config
        } else {
            setStep(1.5); // Go to manual car entry
        }
    };

    const handleManualCarSubmit = () => {
        setStep(2);
    };

    const handleConfigSubmit = () => {
        setStep(3); // Options
    };

    const renderStep1_ConfirmCar = () => {
        if (!savedCar) {
            // If completely no saved car, skip to manual entry
            setTimeout(() => setStep(1.5), 0);
            return null;
        }
        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', display: 'flex' }}>
                        <ChevronLeft /> Назад
                    </button>
                    <h2 style={{ fontSize: '20px' }}>Вибір авто</h2>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>У вашому профілі знайдено збережене авто. Ви шукаєте деталі на нього?</p>

                <div className="premium-card" style={{ marginBottom: '24px', background: 'var(--accent-glow)', borderColor: 'var(--accent)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>{savedCar.brand} {savedCar.model}</div>
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>VIN: {savedCar.vin}</div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="glass" style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', color: 'white' }} onClick={() => handleCarConfirmation(false)}>
                        Ні, інше авто
                    </button>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleCarConfirmation(true)}>
                        Так, це моє авто
                    </button>
                </div>
            </motion.div>
        );
    };

    const renderStep1_5_ManualCar = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => savedCar ? setStep(1) : onCancel()} style={{ background: 'none', border: 'none', color: 'white', display: 'flex' }}>
                    <ChevronLeft /> Назад
                </button>
                <h2 style={{ fontSize: '20px' }}>Дані автомобіля</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Введіть дані автомобіля, щоб ми підібрали сумісні гальмівні системи.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input type="text" placeholder="Марка авто (напр. BMW)" className="input-field" value={carDetails.brand} onChange={e => setCarDetails({ ...carDetails, brand: e.target.value })} />
                <input type="text" placeholder="Модель (напр. X5)" className="input-field" value={carDetails.model} onChange={e => setCarDetails({ ...carDetails, model: e.target.value })} />
                <input type="text" placeholder="VIN-код (17 символів)" className="input-field" value={carDetails.vin} onChange={e => setCarDetails({ ...carDetails, vin: e.target.value })} />
            </div>

            <button
                className="btn-primary w-full"
                style={{ marginTop: '32px' }}
                onClick={handleManualCarSubmit}
                disabled={!carDetails.brand || !carDetails.model || !carDetails.vin}
            >
                Далі <ChevronRight className="w-5 h-5" />
            </button>
        </motion.div>
    );

    const renderStep2_Config = () => (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={() => savedCar && useSavedCar ? setStep(1) : setStep(1.5)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex' }}>
                    <ChevronLeft /> Назад
                </button>
                <h2 style={{ fontSize: '20px' }}>Що міняємо?</h2>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'white' }}>Тип робіт:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '24px' }}>
                <div onClick={() => setPartType('pads')} className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderColor: partType === 'pads' ? 'var(--accent)' : 'var(--border)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: partType === 'pads' ? 'var(--accent)' : 'transparent' }}>
                        {partType === 'pads' && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span>Тільки гальмівні колодки</span>
                </div>
                <div onClick={() => setPartType('discs')} className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderColor: partType === 'discs' ? 'var(--accent)' : 'var(--border)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: partType === 'discs' ? 'var(--accent)' : 'transparent' }}>
                        {partType === 'discs' && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span>Тільки гальмівні диски</span>
                </div>
                <div onClick={() => setPartType('both')} className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderColor: partType === 'both' ? 'var(--accent)' : 'var(--border)' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: partType === 'both' ? 'var(--accent)' : 'transparent' }}>
                        {partType === 'both' && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span style={{ fontWeight: 'bold' }}>Диски + Колодки (Комплекс)</span>
                </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px', color: 'white' }}>Вісь:</h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                <button onClick={() => setAxle('front')} className="glass" style={{ flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer', border: axle === 'front' ? '1px solid var(--accent)' : '1px solid var(--border)', background: axle === 'front' ? 'var(--accent-glow)' : 'var(--surface)' }}>
                    Передні
                </button>
                <button onClick={() => setAxle('rear')} className="glass" style={{ flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer', border: axle === 'rear' ? '1px solid var(--accent)' : '1px solid var(--border)', background: axle === 'rear' ? 'var(--accent-glow)' : 'var(--surface)' }}>
                    Задні
                </button>
                <button onClick={() => setAxle('both')} className="glass" style={{ flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer', border: axle === 'both' ? '1px solid var(--accent)' : '1px solid var(--border)', background: axle === 'both' ? 'var(--accent-glow)' : 'var(--surface)' }}>
                    Обидві
                </button>
            </div>

            <button
                className="btn-primary w-full"
                onClick={handleConfigSubmit}
                disabled={!partType || !axle}
            >
                Знайти деталі за VIN <ChevronRight className="w-5 h-5" />
            </button>
        </motion.div>
    );

    const renderStep3_Options = () => {
        const options = [
            { id: 'brembo', name: 'Brembo (Оригінал)', price: '4 500 ₴', desc: 'Висока продуктивність, без пилу', icon: <ShieldAlert className="w-5 h-5 text-red-500" /> },
            { id: 'trw', name: 'TRW (Преміум)', price: '3 200 ₴', desc: 'Довговічність та комфорт', icon: <Disc className="w-5 h-5 text-blue-500" /> },
            { id: 'bosch', name: 'Bosch (Стандарт)', price: '2 400 ₴', desc: 'Оптимальне співвідношення ціна/якість', icon: <Settings className="w-5 h-5 text-gray-400" /> }
        ];

        let titleStr = '';
        if (partType === 'pads') titleStr += 'Колодки ';
        if (partType === 'discs') titleStr += 'Диски ';
        if (partType === 'both') titleStr += 'Диски+Колодки ';

        if (axle === 'front') titleStr += '(Передні)';
        if (axle === 'rear') titleStr += '(Задні)';
        if (axle === 'both') titleStr += '(Передні і Задні)';

        return (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex' }}>
                        <ChevronLeft /> Назад
                    </button>
                    <h2 style={{ fontSize: '20px' }}>Підібрані деталі</h2>
                </div>

                <div className="premium-card" style={{ marginBottom: '24px', background: 'var(--surface-hover)', borderColor: 'var(--border)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>Автомобіль: {carDetails.brand} {carDetails.model} ({carDetails.vin})</p>
                    <p style={{ color: 'white', fontWeight: 'bold' }}>{titleStr}</p>
                </div>

                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Оберіть виробника запчастин:</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {options.map(opt => (
                        <div
                            key={opt.id}
                            className="premium-card"
                            onClick={() => setSelectedOption(opt.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', borderColor: selectedOption === opt.id ? 'var(--accent)' : 'var(--border)', background: selectedOption === opt.id ? 'var(--accent-glow)' : 'var(--surface)' }}
                        >
                            <div style={{ background: 'var(--surface-hover)', padding: '10px', borderRadius: '12px' }}>
                                {opt.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>{opt.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{opt.desc}</div>
                            </div>
                            <div style={{ fontWeight: 'bold', color: selectedOption === opt.id ? 'var(--accent)' : 'white' }}>{opt.price}</div>
                        </div>
                    ))}
                </div>

                <button
                    className="btn-primary w-full"
                    style={{ marginTop: '40px' }}
                    onClick={onComplete}
                    disabled={!selectedOption}
                >
                    Затвердити та повернутись <CheckCircle className="w-5 h-5 ml-2" />
                </button>
            </motion.div>
        );
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--background)', zIndex: 2000, padding: '20px', overflowY: 'auto' }}>
            {step === 1 && renderStep1_ConfirmCar()}
            {step === 1.5 && renderStep1_5_ManualCar()}
            {step === 2 && renderStep2_Config()}
            {step === 3 && renderStep3_Options()}
        </div>
    );
}
