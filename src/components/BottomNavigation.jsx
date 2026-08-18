import PropTypes from 'prop-types';

function BottomNavigation({ activeTab = 'participants', onTabChange }) {
  const tabs = [
    { id: 'participants', icon: 'groups', label: 'Participantes', filled: true },
    { id: 'faculty', icon: 'school', label: 'Staff', filled: false },
  ];

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-high/95 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center py-2 pb-safe px-4 z-50 shadow-lg rounded-t-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconFill = isActive && tab.filled ? 1 : 0;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-1 rounded-full active:scale-90 transition-transform duration-200 ${
              isActive
                ? 'bg-primary-container text-on-primary-container'
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
