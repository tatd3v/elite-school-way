import { useState, useEffect } from 'preact/hooks';
import PropTypes from 'prop-types';
import { dashboardService } from '../services/dashboardService';

function StaffManagementSection({ onUpdate }) {
  const [selectedDate, setSelectedDate] = useState('Sábado, 12 de Octubre, 2024');
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const staffData = await dashboardService.fetchStaff();
      setStaff(staffData.length > 0 ? staffData : defaultStaff);
    } catch (error) {
      console.error('Error loading staff:', error);
      setStaff(defaultStaff);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultStaff = [
    {
      id: 1,
      role: 'Director de Gala',
      name: 'Prof. Enrique Madrigal',
      icon: 'star_rate',
      color: 'secondary',
    },
    {
      id: 2,
      role: 'Maestro de Ceremonia',
      name: 'Sebastian de la Fuente',
      icon: 'campaign',
      color: 'primary',
    },
    {
      id: 3,
      role: 'Curador Musical',
      name: 'DJ Alpha Prestige',
      icon: 'library_music',
      color: 'primary',
    },
  ];

  return (
    <section className="mb-section-gap-mobile">
      <div className="bg-surface-container-lowest border border-outline-variant/10 shadow-md rounded-xl overflow-hidden transition-colors duration-300">
        <div className="bg-primary-container p-4 flex justify-between items-center">
          <h2 className="font-headline-md text-on-primary-container text-md">Gestión de Claustro</h2>
          <span className="material-symbols-outlined text-on-primary-container/70">event</span>
        </div>

        <div className="p-5">
          <div className="mb-6">
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-tighter">
              Seleccionar Fecha de Gala
            </label>
            <div className="relative">
              <select className="w-full p-3 rounded border border-outline-variant bg-surface-container-low text-on-surface appearance-none focus:ring-1 focus:ring-primary outline-none font-body-md transition-colors">
                <option>Sábado, 12 de Octubre, 2024</option>
                <option>Sábado, 19 de Octubre, 2024</option>
                <option>Sábado, 26 de Octubre, 2024</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-label-lg text-label-lg text-secondary uppercase border-b border-outline-variant/20 pb-2">
              Facultad Asignada
            </h4>

            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                <p className="text-on-surface-variant text-label-sm">Cargando...</p>
              </div>
            ) : (
              staff.map((member) => (
              <div key={member.id} className="flex items-center gap-4 py-2">
                <div className={`h-10 w-10 rounded-full bg-${member.color}/10 flex items-center justify-center border border-${member.color}/20`}>
                  <span className={`material-symbols-outlined text-${member.color}`}>
                    {member.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <p className={`text-[10px] font-bold text-${member.color} uppercase tracking-widest`}>
                    {member.role}
                  </p>
                  <p className="font-body-md text-sm font-semibold text-on-surface">{member.name}</p>
                </div>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            ))
            )}
          </div>

          <button
            onClick={onUpdate}
            className="w-full mt-6 bg-secondary text-on-secondary py-4 font-label-lg text-label-lg rounded active:scale-[0.98] transition-all uppercase tracking-widest hover:shadow-lg"
          >
            Actualizar Claustro
          </button>
        </div>
      </div>
    </section>
  );
}

StaffManagementSection.propTypes = {
  staff: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      role: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  onUpdate: PropTypes.func,
};

export default StaffManagementSection;
