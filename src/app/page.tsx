'use client';

import { motion } from 'framer-motion';
import { Car, Droplets, Disc, Settings, ChevronRight, MapPin, Calendar, Globe } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t, language } = useLanguage();

  const services = [
    { name: t('oilChange'), icon: <Droplets className="w-6 h-6" />, desc: language === 'uk' ? 'Швидко та чисто' : 'Fast and clean' },
    { name: t('wheelChange'), icon: <Disc className="w-6 h-6" />, desc: language === 'uk' ? 'Сезон чи ремонт' : 'Season or repair' },
    { name: t('brakeChange'), icon: <Settings className="w-6 h-6" />, desc: language === 'uk' ? 'Твоя безпека' : 'Your safety' },
    { name: t('detailing'), icon: <Car className="w-6 h-6" />, desc: language === 'uk' ? 'Як з салону' : 'Like new' },
  ];

  return (
    <main className="mobile-container min-height-screen flex flex-col">
      <div className="flex-1">
        {/* Header with Lang Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
          <Link href="/register">
            <div className="glass" style={{ padding: '8px', borderRadius: '50%', cursor: 'pointer' }}>
              <Globe className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ paddingTop: '20px', paddingBottom: '40px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--accent)', padding: '10px', borderRadius: '12px' }}>
              <Car className="text-white w-8 h-8" />
            </div>
            <h1 style={{ fontSize: '28px' }}>{t('heroTitle')}</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: '1.5' }}>
            {t('heroDesc')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="premium-card"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ color: 'var(--accent)' }}>{service.icon}</div>
              <div>
                <div style={{ fontWeight: '600' }}>{service.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{service.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: '40px', background: 'var(--surface)', padding: '20px', borderRadius: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <MapPin className="text-blue-400" />
            <span>{language === 'uk' ? 'Вкажіть геолокацію авто' : 'Specify car location'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Calendar className="text-green-400" />
            <span>{language === 'uk' ? 'Оберіть зручний час' : 'Choose a convenient time'}</span>
          </div>
        </motion.div>
      </div>

      {/* Action Area */}
      <div style={{ padding: '20px 0', marginTop: 'auto' }}>
        <Link href="/register">
          <button className="btn-primary w-full">
            {t('orderService')} <ChevronRight className="w-5 h-5" />
          </button>
        </Link>
        <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
          {t('alreadyRegistered')} <Link href="/login" style={{ color: 'var(--accent)' }}>{t('login')}</Link>
        </p>

        <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            {language === 'uk' ? 'Працюєте з нами?' : 'Working with us?'}
          </p>
          <Link href="/mechanic/login">
            <button className="glass" style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px', border: '1px solid var(--border)' }}>
              {t('mechanicPanel')}
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
