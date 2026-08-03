import PropTypes from 'prop-types';

function StatsSummary({ students = 0, houses = 0 }) {
  return (
    <section className="mb-section-gap-mobile">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Students */}
        <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300">
          <span className="material-symbols-outlined text-primary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
            groups
          </span>
          <h3 className="font-headline-lg text-4xl text-on-surface mb-2">
            {students}
          </h3>
          <p className="font-label-md text-on-surface-variant uppercase tracking-widest">
            Estudiantes
          </p>
        </div>

        {/* Houses */}
        <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300">
          <span className="material-symbols-outlined text-secondary text-5xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
            school
          </span>
          <h3 className="font-headline-lg text-4xl text-on-surface mb-2">
            {houses}
          </h3>
          <p className="font-label-md text-on-surface-variant uppercase tracking-widest">
            Casas Reales
          </p>
        </div>
      </div>
    </section>
  );
}

StatsSummary.propTypes = {
  students: PropTypes.number,
  houses: PropTypes.number,
};

export default StatsSummary;
