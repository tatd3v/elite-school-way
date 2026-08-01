import PropTypes from 'prop-types';

function InstructionItem({ icon = 'check_circle', title, description }) {
  return (
    <p className="flex items-start gap-3">
      <span className="material-symbols-outlined text-primary mt-1">{icon}</span>
      <span>
        <strong className="text-on-surface">{title}:</strong> {description}
      </span>
    </p>
  );
}

InstructionItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default InstructionItem;
