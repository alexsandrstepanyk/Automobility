import { Users } from 'lucide-react';

export default function FleetSidebar({ mechanics, t }: any) {
    return (
        <section className="premium-card" style={{ height: 'fit-content' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>{t('availableFleet')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {mechanics.map((m: any) => (
                    <div key={m.id} className="fleet-item">
                        <div className="fleet-icon">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>{m.name}</div>
                            <div style={{ fontSize: '11px', color: m.status === 'busy' ? '#eab308' : '#22c55e' }}>
                                {m.status === 'busy' ? t('mechanicBusy') : t('mechanicAvailable')}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
