import { ShieldCheck, Wrench, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VerificationPanel({
    verifSubTab, setVerifSubTab,
    pendingMechanics, pendingUsers,
    approveMechanic, rejectMechanic,
    approveUser, setPendingUsers, t
}: any) {
    return (
        <motion.section
            key="verification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
            <div className="premium-card" style={{ padding: '20px' }}>
                <div className="verification-tabs">
                    <button
                        onClick={() => setVerifSubTab('mechanics')}
                        className={`verif-tab ${verifSubTab === 'mechanics' ? 'active' : ''}`}
                    >
                        <Wrench className="w-4 h-4" /> {t('pendingMechanics')} ({pendingMechanics.length})
                    </button>
                    <button
                        onClick={() => setVerifSubTab('users')}
                        className={`verif-tab ${verifSubTab === 'users' ? 'active' : ''}`}
                    >
                        <UserCheck className="w-4 h-4" /> {t('pendingUsers')} ({pendingUsers.length})
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {verifSubTab === 'mechanics' ? (
                        pendingMechanics.map((m: any) => (
                            <div key={m.id} className="glass verif-card">
                                <div>
                                    <div style={{ fontWeight: '700' }}>{m.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{m.spec} • {m.exp}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{m.phone}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => rejectMechanic(m.id)} className="btn-reject">
                                        {t('reject')}
                                    </button>
                                    <button onClick={() => approveMechanic(m)} className="btn-approve">
                                        {t('approve')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        pendingUsers.map((u: any) => (
                            <div key={u.id} className="glass verif-card">
                                <div>
                                    <div style={{ fontWeight: '700' }}>{u.name}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Авто: {u.car}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{u.phone}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => setPendingUsers(pendingUsers.filter((user: any) => user.id !== u.id))}
                                        className="btn-reject"
                                    >
                                        {t('reject')}
                                    </button>
                                    <button onClick={() => approveUser(u.id)} className="btn-approve">
                                        {t('approve')}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    {(verifSubTab === 'mechanics' ? pendingMechanics : pendingUsers).length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <ShieldCheck className="w-12 h-12 opacity-20 mx-auto mb-4" />
                            <p>{t('allProcessed')}</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.section>
    );
}
