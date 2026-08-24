import { Fragment } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { dashboardService } from '../services/dashboardService';
import StaffMemberCard from './StaffMemberCard';

function StaffSection() {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await dashboardService.fetchVisibleStaff();
        setStaff(data || []);
      } catch (error) {
        console.error('Error loading staff section:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  return (
    <section
      className="py-12 md:py-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto bg-surface-container-low dark:bg-surface-container"
      id="staff"
      aria-labelledby="staff-heading"
    >
      <div className="text-center mb-6">
        <span className="text-secondary font-label-lg text-label-lg tracking-[0.4em] uppercase mb-2 block">
          Facultad de Excelencia
        </span>
        <h2
          id="staff-heading"
          className="font-display-lg text-3xl md:text-display-lg-mobile lg:text-display-lg text-primary uppercase leading-tight"
        >
          STAFF ESCOLAR
        </h2>
        <div className="w-24 h-1 bg-secondary mx-auto mt-4"></div>
        <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto font-body-lg">
          Seleccionadxs por su excelencia y trayectoria académica en la escena Ballroom Colombia.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-label-md">Cargando staff...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {staff.map((member, index) => (
            <Fragment key={member.id}>
              <StaffMemberCard member={member} />
              {index < staff.length - 1 && (
                <div className="md:hidden border-t border-outline-variant/30 pt-0"></div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </section>
  );
}

export default StaffSection;
