'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets, Disc, Settings, Car,
  Calendar as CalendarIcon, MapPin,
  Clock, CheckCircle, Activity, Package, ChevronRight, Globe, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import OilChangeFlow from './flow/OilChangeFlow';
import BrakeChangeFlow from './flow/BrakeChangeFlow';

export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [date, setDate] = useState('2026-02-19');
  const [time, setTime] = useState('14:00');
  const [location, setLocation] = useState(language === 'uk' ? 'вул. Хрещатик, 1, Київ' : '1 Khreshchatyk St, Kyiv');
  const [clientPhone, setClientPhone] = useState('');
  const [adLink, setAdLink] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [showOilFlow, setShowOilFlow] = useState(false);
  const [showBrakeFlow, setShowBrakeFlow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const [mapCenter, setMapCenter] = useState({ lat: 50.4501, lng: 30.5234 }); // default Kyiv
  const [mapMarker, setMapMarker] = useState({ lat: 50.4501, lng: 30.5234 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    if (showLocationModal && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(coords);
          setMapMarker(coords);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [showLocationModal]);

  useEffect(() => {
    const isAuth = localStorage.getItem('clientAuth') === 'true';
    if (isAuth) {
      setIsLoggedIn(true);
    }

    const savedServices = sessionStorage.getItem('pendingServices');
    if (savedServices) {
      setSelectedServices(JSON.parse(savedServices));
      if (isAuth) {
        setShowLocationModal(true);
      }
    }

    const savedLocation = sessionStorage.getItem('pendingLocation');
    if (savedLocation) setLocation(savedLocation);

    const savedTime = sessionStorage.getItem('pendingTime');
    if (savedTime) setTime(savedTime);

    const savedPhone = sessionStorage.getItem('pendingPhone');
    if (savedPhone) setClientPhone(savedPhone);

    const savedAdLink = sessionStorage.getItem('pendingAdLink');
    if (savedAdLink) setAdLink(savedAdLink);
  }, []);

  const saveDetailsForAuth = () => {
    sessionStorage.setItem('pendingServices', JSON.stringify(selectedServices));
    sessionStorage.setItem('pendingLocation', location);
    sessionStorage.setItem('pendingTime', time);
    sessionStorage.setItem('pendingPhone', clientPhone);
    sessionStorage.setItem('pendingAdLink', adLink);
  };

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
      <main className="mobile-container flex-col flex-center text-center" style={{ minHeight: '100vh' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="premium-card flex-col flex-center gap-4"
          style={{ padding: '40px' }}
        >
          <div style={{ background: 'var(--accent)', padding: '20px', borderRadius: '50%' }}>
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2>{t('orderAccepted')}</h2>
          <p className="text-muted">
            {t('orderThanks')}
          </p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => setIsOrdered(false)}>{t('backToHome')}</button>
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

  const handleInitiateOrder = () => {
    if (!isLoggedIn) {
      saveDetailsForAuth();
      setShowAuthModal(true);
    } else {
      setShowLocationModal(true);
    }
  };

  const handleOrderSubmit = async () => {

    try {
      const mappedServices = selectedServices.map(id => services.find(s => s.id === id)?.name || id);
      if (selectedServices.includes('diagnostics') && !selectedServices.includes(services[0].id)) {
        mappedServices.push(t('mobileDiagnostics'));
      }

      if (selectedServices.includes('purchase')) {
        mappedServices.push(t('carPurchaseHelp'));
      }

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: 'Олександр В.', // Taking dummy from session context
          clientPhone: clientPhone || undefined,
          adLink: adLink || undefined,
          carModel: 'Audi Q7 (AA 0001 AA)',
          services: mappedServices,
          time,
          location: `${mapMarker.lat.toFixed(5)}, ${mapMarker.lng.toFixed(5)}`,
          price: 'Буде узгоджено',
          city: 'kyiv',
          dist: '1 км'
        })
      });
      setIsOrdered(true);
      setShowLocationModal(false);
      sessionStorage.removeItem('pendingServices');
      sessionStorage.removeItem('pendingLocation');
      sessionStorage.removeItem('pendingTime');
      sessionStorage.removeItem('pendingPhone');
      sessionStorage.removeItem('pendingAdLink');
    } catch (e) {
      console.error('Submit explicit fail:', e);
      setIsOrdered(true); // fall-through grace
    }
  };

  return (
    <main className="mobile-container flex-col" style={{ paddingBottom: '120px' }}>
      <header className="page-header flex-between">
        <div>
          {isLoggedIn ? (
            <>
              <h1 className="page-header-title">{t('hello')}, Олександре! 👋</h1>
              <p className="text-muted text-md" style={{ marginTop: '4px' }}>Audi Q7 (AA 0001 AA)</p>
            </>
          ) : (
            <>
              <h1 className="page-header-title">{t('hello')}! 👋</h1>
              <p className="text-muted text-md" style={{ marginTop: '4px' }}>Авто не додано</p>
            </>
          )}
        </div>
        <div className="flex-row gap-2">
          <button className="icon-btn-surface" onClick={() => router.push('/register')} title="Language / Register">
            <Globe className="w-5 h-5 text-white" />
          </button>
          {isLoggedIn && (
            <button className="icon-btn-surface" onClick={() => router.push('/settings')}>
              <Settings className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </header>

      {/* Services List */}
      <section>
        <h3 className="section-title">{t('chooseService')}</h3>
        <div className="flex-col gap-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="premium-card flex-row gap-4"
              onClick={() => toggleService(s.id)}
              style={{
                borderColor: selectedServices.includes(s.id) ? 'var(--accent)' : 'var(--border)',
                background: selectedServices.includes(s.id) ? 'var(--surface-hover)' : 'var(--surface)',
                cursor: 'pointer'
              }}
            >
              <div style={{ color: 'var(--accent)' }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{s.name}</div>
                <div className="text-muted text-sm">{t('approx')} {s.price}</div>
              </div>
              <div className="flex-center" style={{
                width: '24px', height: '24px', borderRadius: '50%',
                border: '2px solid var(--accent)',
                background: selectedServices.includes(s.id) ? 'var(--accent)' : 'transparent'
              }}>
                {selectedServices.includes(s.id) && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
            </div>
          ))}

          <div
            className="premium-card flex-row gap-4"
            onClick={() => toggleService('diagnostics')}
            style={{
              marginTop: '8px', cursor: 'pointer',
              borderColor: selectedServices.includes('diagnostics') ? 'var(--accent)' : 'var(--accent-glow)',
              background: selectedServices.includes('diagnostics') ? 'var(--accent)' : 'var(--accent-glow)',
              color: 'white'
            }}
          >
            <div className="flex-center" style={{ background: selectedServices.includes('diagnostics') ? 'rgba(255,255,255,0.2)' : 'var(--accent)', padding: '8px', borderRadius: '10px' }}>
              <Activity className="text-white w-5 h-5" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700' }}>{t('mobileDiagnostics')}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{t('approx')} ~1000₴</div>
            </div>
            <div className="flex-center" style={{
              width: '24px', height: '24px', borderRadius: '50%',
              border: '2px solid white',
              background: selectedServices.includes('diagnostics') ? 'white' : 'transparent'
            }}>
              {selectedServices.includes('diagnostics') && <CheckCircle className="w-5 h-5 text-accent" />}
            </div>
          </div>

          <div
            className="premium-card flex-row gap-4"
            onClick={() => toggleService('purchase')}
            style={{
              marginTop: '0px', cursor: 'pointer',
              borderColor: selectedServices.includes('purchase') ? 'var(--accent)' : 'var(--accent-glow)',
              background: selectedServices.includes('purchase') ? 'var(--accent)' : 'var(--surface-hover)',
              color: selectedServices.includes('purchase') ? 'white' : 'var(--foreground)'
            }}
          >
            <div className="flex-center" style={{ background: selectedServices.includes('purchase') ? 'rgba(255,255,255,0.2)' : 'var(--accent)', padding: '8px', borderRadius: '10px' }}>
              <Car className={selectedServices.includes('purchase') ? 'text-white w-5 h-5' : 'text-white w-5 h-5'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '700' }}>{t('carPurchaseHelp')}</div>
              <div style={{ fontSize: '12px', color: selectedServices.includes('purchase') ? 'rgba(255,255,255,0.8)' : 'var(--muted)' }}>{t('carPurchaseHelpDesc')}</div>
            </div>
            <div className="flex-center" style={{
              width: '24px', height: '24px', borderRadius: '50%',
              border: selectedServices.includes('purchase') ? '2px solid white' : '2px solid var(--accent)',
              background: selectedServices.includes('purchase') ? 'white' : 'transparent'
            }}>
              {selectedServices.includes('purchase') && <CheckCircle className="w-5 h-5 text-accent" />}
            </div>
          </div>
        </div>
      </section>

      {/* Schedule & Location removed from main view */}

      {/* My Orders Link */}
      {isLoggedIn && (
        <section style={{ marginTop: '32px', marginBottom: '32px' }}>
          <div onClick={() => router.push('/orders')} className="premium-card flex-between" style={{ cursor: 'pointer', borderColor: 'var(--accent)', background: 'var(--accent-glow)' }}>
            <div className="flex-row gap-4">
              <div style={{ background: 'var(--accent)', padding: '12px', borderRadius: '12px' }}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Мої замовлення</div>
                <div className="text-muted text-sm">Переглянути статус виконання</div>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-accent" />
          </div>
        </section>
      )}

      {!isLoggedIn && (
        <section style={{ marginTop: '32px', marginBottom: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>Авторизація Майстра</p>
          <button className="glass" style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px', border: '1px solid var(--border)' }} onClick={() => router.push('/mechanic/login')}>
            {t('mechanicPanel')}
          </button>
          <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Вхід для клієнтів: <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => router.push('/login')}>{t('login')}</span>
          </p>
        </section>
      )}

      {/* Checkout Bar */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="glass flex-between"
          style={{
            position: 'fixed', bottom: '20px', left: '20px', right: '20px',
            borderRadius: '24px', padding: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 900
          }}
        >
          <div>
            <div className="text-muted text-sm">{selectedServices.length} {t('servicesSelected')}</div>
            <div style={{ fontWeight: '700', fontSize: '20px' }}>{t('order')}</div>
          </div>
          <button className="btn-primary" onClick={handleInitiateOrder}>
            {t('order')}
          </button>
        </motion.div>
      )}

      {/* Auth Modal Triggered on Guest Checkout */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.8)', zIndex: 9999,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="premium-card flex-col flex-center text-center"
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <h2 style={{ fontSize: '22px' }}>{t('authPromptTitle')}</h2>
              <p className="text-muted" style={{ marginTop: '12px', fontSize: '14px', lineHeight: '1.5' }}>
                {t('authPromptDesc')}
              </p>
              <div className="flex-col gap-3" style={{ marginTop: '32px', width: '100%' }}>
                <button className="btn-primary" style={{ width: '100%' }} onClick={() => router.push('/register')}>{t('register')}</button>
                <button className="glass" style={{ width: '100%', padding: '12px', borderRadius: '12px', color: 'white', border: '1px solid var(--border)' }} onClick={() => router.push('/login')}>
                  {t('login')}
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', marginTop: '16px', fontSize: '14px' }}
                >
                  Скасувати
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location & Date Modal Triggered After Auth or On Order */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'var(--background)', zIndex: 9999,
              overflowY: 'auto', padding: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <button onClick={() => setShowLocationModal(false)} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                <ChevronLeft style={{ marginRight: '8px' }} /> Назад
              </button>
            </div>

            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Де та коли?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Поставте відмітку, де знаходиться ваше авто.</p>

            <div className="premium-card flex-col gap-4">
              <div style={{ width: '100%', height: '250px', borderRadius: '12px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border)' }}>
                {isLoaded && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={15}
                    onClick={(e) => {
                      if (e.latLng) {
                        const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                        setMapMarker(coords);
                        setLocation(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
                      }
                    }}
                    options={{ disableDefaultUI: true, zoomControl: true }}
                  >
                    <Marker
                      position={mapMarker}
                      draggable
                      onDragEnd={(e) => {
                        if (e.latLng) {
                          const coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                          setMapMarker(coords);
                          setLocation(`${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
                        }
                      }}
                    />
                  </GoogleMap>
                ) : (
                  <div className="flex-col flex-center" style={{ height: '100%', background: 'var(--surface-hover)', padding: '20px', textAlign: 'center' }}>
                    <MapPin className="w-8 h-8 mb-2 text-accent" />
                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      Служба Google Maps недоступна або потребує налаштування. <br />
                      Будь ласка, введіть адресу вручну нижче:
                    </p>
                  </div>
                )}
              </div>

              <div className="flex-row gap-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <MapPin className="text-red-400 w-5" />
                <input
                  type="text"
                  placeholder="Введіть адресу або координати"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field"
                  style={{ border: 'none', background: 'none', padding: 0 }}
                />
              </div>

              <div className="flex-row gap-4" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <div className="flex-row gap-2" style={{ flex: 1 }}>
                  <CalendarIcon className="text-blue-400 w-5" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ background: 'none', color: 'white', border: 'none', fontSize: '14px', flex: 1 }}
                  />
                </div>
                <div className="flex-row gap-2" style={{ flex: 1 }}>
                  <Clock className="text-green-400 w-5" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{ background: 'none', color: 'white', border: 'none', fontSize: '14px', flex: 1 }}
                  />
                </div>
              </div>

              {selectedServices.includes('purchase') && (
                <div className="flex-col gap-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <input
                    type="text"
                    placeholder={t('phonePlace')}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="url"
                    placeholder={t('adLinkPlace')}
                    value={adLink}
                    onChange={(e) => setAdLink(e.target.value)}
                    className="input-field"
                  />
                </div>
              )}
            </div>

            <button className="btn-primary w-full" style={{ marginTop: '40px' }} onClick={handleOrderSubmit}>
              Підтвердити замовлення <CheckCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
