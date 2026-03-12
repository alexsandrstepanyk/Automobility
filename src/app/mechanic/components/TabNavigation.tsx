export default function TabNavigation({ activeTab, setActiveTab, t }: any) {
    return (
        <div className="tabs-container">
            <button
                onClick={() => setActiveTab('assigned')}
                className={`glass tab-btn ${activeTab === 'assigned' ? 'active' : 'inactive'}`}
            >
                {t('activeOrders')}
            </button>
            <button
                onClick={() => setActiveTab('completed')}
                className={`glass tab-btn ${activeTab === 'completed' ? 'active' : 'inactive'}`}
            >
                {t('finished')}
            </button>
        </div>
    );
}
