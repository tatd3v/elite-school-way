import PropTypes from 'prop-types';

function BottomNavigation({ activeTab = 'participants', onTabChange }) {
  const tabs = [
    { id: 'participants', icon: 'groups', label: 'Participantes' },
    { id: 'faculty', icon: 'school', label: 'Staff' },
  ];

  const handleTabClick = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 z-50 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant/10 rounded-t-xl shadow-lg flex justify-around items-center px-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all active:bg-surface-variant/30 ${
              isActive
                ? 'text-primary font-bold scale-110'
                : 'text-on-tertiary-fixed-variant'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
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
