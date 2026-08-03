import PropTypes from 'prop-types';

function StatsSummary({ students = 0, houses = 0 }) {
  return (
    <section className="grid grid-cols-2 gap-4 mb-10">
      <div className="luxury-card rounded-xl p-4 flex flex-col items-center text-center">
        <span className="text-3xl font-display-lg text-primary">{students}</span>
        <span className="text-[10px] font-label-lg text-outline uppercase mt-1">Estudiantes</span>
      </div>
      <div className="luxury-card rounded-xl p-4 flex flex-col items-center text-center">
        <span className="text-3xl font-display-lg text-secondary">{houses}</span>
        <span className="text-[10px] font-label-lg text-outline uppercase mt-1">Casas</span>
      </div>
    </section>
  );
}

StatsSummary.propTypes = {
  students: PropTypes.number,
  houses: PropTypes.number,
};

export default StatsSummary;
