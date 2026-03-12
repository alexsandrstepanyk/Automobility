import { Star, MapPin, Settings } from 'lucide-react';
import Link from 'next/link';

export default function MechanicHeader({ mechanicData, t }: any) {
    return (
        <header className="mechanic-header">
            <div className="mechanic-header-inner">
                <div>
                    <h1 className="mechanic-title">{t('mechanicPanel')}</h1>
                    <div className="mechanic-subtitle">
                        <span className="mechanic-name">{mechanicData?.name}</span>
                        <div className="rating-badge">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{mechanicData?.rating}</span>
                        </div>
                    </div>
                    <div className="location-info">
                        <MapPin className="w-3 h-3" />
                        <span>{t(mechanicData?.city || '')}</span>
                    </div>
                </div>
                <Link href="/settings">
                    <button className="settings-btn">
                        <Settings className="w-5 h-5" />
                    </button>
                </Link>
            </div>
        </header>
    );
}
