import { Search, Clock, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrdersTable({ orders, mechanics, t, assignMechanic }: any) {
    return (
        <motion.section
            key="orders"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="premium-card"
            style={{ padding: '0' }}
        >
            <div className="panel-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{t('orderQueue')}</h3>
                <div className="search-wrapper">
                    <Search className="search-icon" />
                    <input type="text" placeholder={t('search')} className="input-field search-input" />
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('clientCar')}</th>
                            <th>{t('services')}</th>
                            <th>{t('timePlace')}</th>
                            <th>{t('status')}</th>
                            <th>{t('mechanic')}</th>
                            <th style={{ textAlign: 'right' }}>{t('action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o: any) => (
                            <tr key={o.id}>
                                <td>
                                    <div style={{ fontWeight: '600', color: 'white' }}>{o.user} {o.clientPhone && <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>- {o.clientPhone}</span>}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{o.car}</div>
                                    {o.adLink && (
                                        <div style={{ fontSize: '11px', marginTop: '2px' }}>
                                            <a href={o.adLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Оголошення ↗</a>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {o.services.map((s: string) => (
                                            <span key={s} style={{ background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', color: 'white' }}>{s}</span>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'white' }}>
                                        <Clock className="w-3 h-3 text-blue-400" /> {o.time}
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{o.loc}</div>
                                </td>
                                <td>
                                    <span className={o.status === 'pending' ? 'badge-pending' : 'badge-approved'}>
                                        {t(o.status)}
                                    </span>
                                </td>
                                <td>
                                    {o.mechanic ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'white' }}>
                                            <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                                            {o.mechanic}
                                        </div>
                                    ) : (
                                        <select
                                            onChange={(e) => assignMechanic(o.id, e.target.value)}
                                            className="glass mechanic-select"
                                        >
                                            <option value="">{t('assignMechanic')}</option>
                                            {mechanics.map((m: any) => <option key={m.id} value={m.name}>{m.name}</option>)}
                                        </select>
                                    )}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)' }}>
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.section>
    );
}
