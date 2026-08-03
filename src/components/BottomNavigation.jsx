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
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant/10 rounded-t-xl h-20 shadow-lg flex justify-around items-center px-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconFill = isActive && tab.filled ? 1 : 0;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all ${
              isActive
                ? 'text-primary font-bold active:bg-surface-variant/30 scale-110'
                : 'text-on-tertiary-fixed-variant active:bg-surface-variant/30'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: `'FILL' ${iconFill}` }}
            >
              {tab.icon}
            </span>
            <span className="font-label-sm text-label-sm mt-1">{tab.label}</span>
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
