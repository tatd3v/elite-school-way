import PropTypes from 'prop-types';

function BottomNavigation({ activeTab = 'dashboard', onTabChange }) {
  const tabs = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', filled: true },
    { id: 'faculty', icon: 'school', label: 'Faculty', filled: false },
    { id: 'students', icon: 'group', label: 'Students', filled: false },
    { id: 'settings', icon: 'settings', label: 'Settings', filled: false },
  ];

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-surface-container-high/95 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-2 px-4 z-50 shadow-lg rounded-t-xl transition-colors duration-300">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconFill = isActive && tab.filled ? 1 : 0;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-1 active:scale-90 transition-all duration-200 ${
              isActive
                ? 'bg-primary-container text-on-primary-container rounded-full'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: `'FILL' ${iconFill}` }}
            >
              {tab.icon}
            </span>
            <span className="font-label-sm text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

BottomNavigation.propTypes = {
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

export default BottomNavigation;
