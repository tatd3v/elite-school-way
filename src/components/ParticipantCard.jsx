import PropTypes from 'prop-types';

function ParticipantCard({ participant }) {
  const { name, house, categories, status } = participant;
  
  const statusStyles = {
    confirmed: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusLabels = {
    confirmed: 'CONFIRMADO',
    pending: 'PENDIENTE',
    cancelled: 'CANCELADO',
  };

  const borderColor = status === 'confirmed' ? 'border-t-secondary' : 'border-t-primary/40';

  return (
    <div className={`glass-card rounded-xl p-5 border-t-4 ${borderColor} relative overflow-hidden transition-all duration-300`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-headline-md text-lg text-on-surface font-bold">{name}</h3>
          <p className="text-label-sm text-on-surface-variant font-label-sm tracking-wide uppercase">
            {house || 'Sin Casa'}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusStyles[status] || statusStyles.pending}`}>
          {statusLabels[status] || statusLabels.pending}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {categories && categories.split(',').map((category, index) => {
          const isEven = index % 2 === 0;
          const badgeColor = isEven 
            ? 'bg-primary/5 text-primary border-primary/20' 
            : 'bg-secondary/5 text-secondary border-secondary/20';
          
          return (
            <span 
              key={index} 
              className={`${badgeColor} text-[11px] font-bold px-3 py-1 rounded-full border uppercase`}
            >
              {category.trim()}
            </span>
          );
        })}
      </div>

      <div className="absolute bottom-0 right-0 p-2 opacity-5 pointer-events-none">
        <span className="material-symbols-outlined text-6xl">school</span>
      </div>
    </div>
  );
}

ParticipantCard.propTypes = {
  participant: PropTypes.shape({
    name: PropTypes.string.isRequired,
    house: PropTypes.string,
    categories: PropTypes.string,
    status: PropTypes.oneOf(['confirmed', 'pending', 'cancelled']),
  }).isRequired,
};

export default ParticipantCard;
