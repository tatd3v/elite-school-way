import PropTypes from 'prop-types';

function StatCard({ label, value, icon, borderColor = 'border-outline-variant/20', iconColor = 'text-outline' }) {
  return (
    <div className={`bg-surface-container border ${borderColor} p-6 rounded-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-on-surface-variant text-label-sm uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className={`font-headline-lg text-headline-lg ${iconColor}`}>
            {value}
          </p>
        </div>
        <span className={`material-symbols-outlined ${iconColor} text-5xl`}>
          {icon}
        </span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  iconColor: PropTypes.string,
};

export default StatCard;
