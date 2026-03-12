import { Clock, MapPin, CheckCircle2, Camera, Play } from 'lucide-react';

export default function TaskCard({ task, t, handlePhotoUpload, updateTaskStatus }: any) {
    return (
        <div className="premium-card task-card">
            <div className="task-header">
                <div>
                    <div className="client-name">{task.client}</div>
                    <div className="client-car">{task.car}</div>
                </div>
                <div className="task-price">{task.price}</div>
            </div>

            <div className="services-list">
                {task.services.map((s: string) => (
                    <span key={s} className="service-badge">{s}</span>
                ))}
            </div>

            <div className="task-details">
                {task.clientPhone && (
                    <div className="detail-row" style={{ color: 'var(--accent)' }}>
                        <span style={{ fontSize: '13px' }}>📞 {task.clientPhone}</span>
                    </div>
                )}
                {task.adLink && (
                    <div className="detail-row">
                        <a href={task.adLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline', fontSize: '13px' }}>
                            Переглянути оголошення ↗
                        </a>
                    </div>
                )}
                <div className="detail-row">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span>{task.loc} ({task.dist})</span>
                </div>
                <div className="detail-row">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{task.time}</span>
                </div>
            </div>

            {task.status === 'working' && (
                <div className="photo-upload-container">
                    <button
                        onClick={() => handlePhotoUpload(task.id, 'before')}
                        className={`upload-btn ${task.beforePhoto ? 'uploaded' : ''}`}
                    >
                        {task.beforePhoto ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <Camera className="w-5 h-5 text-white" />}
                        <span className="upload-label">{t('beforePhoto')}</span>
                    </button>
                    <button
                        onClick={() => handlePhotoUpload(task.id, 'after')}
                        className={`upload-btn ${task.afterPhoto ? 'uploaded' : ''}`}
                    >
                        {task.afterPhoto ? <CheckCircle2 className="w-5 h-5 text-accent" /> : <Camera className="w-5 h-5 text-white" />}
                        <span className="upload-label">{t('afterPhoto')}</span>
                    </button>
                </div>
            )}

            <div className="task-actions">
                {task.status === 'assigned' ? (
                    <button onClick={() => updateTaskStatus(task.id, 'working')} className="btn-primary btn-start">
                        <Play className="w-4 h-4" /> {t('startWork')}
                    </button>
                ) : task.status === 'working' ? (
                    <button
                        onClick={() => updateTaskStatus(task.id, 'finished')}
                        className="btn-primary btn-complete"
                        disabled={!task.beforePhoto || !task.afterPhoto}
                    >
                        <CheckCircle2 className="w-4 h-4" /> {t('completeWork')}
                    </button>
                ) : (
                    <div className="status-finished">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{t('finished')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
