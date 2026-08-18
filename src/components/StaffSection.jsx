import { useState, useEffect } from 'preact/hooks';
import { dashboardService } from '../services/dashboardService';
import StaffMemberCard from './StaffMemberCard';

const fallbackStaff = [
  { id: 'director', name: 'PRÓXIMAMENTE', role: 'Director de Academia', bio: '', photo: '', socialLinks: '', icon: 'school' },
  { id: 'mc', name: 'PRÓXIMAMENTE', role: 'Maestro de Ceremonia', bio: '', photo: '', socialLinks: '', icon: 'mic_external_on' },
  { id: 'dj', name: 'PRÓXIMAMENTE', role: 'Curador Musical', bio: '', photo: '', socialLinks: '', icon: 'album' },
];

function StaffSection() {
  const [staff, setStaff] = useState(fallbackStaff);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        const data = await dashboardService.fetchVisibleStaff();
        setStaff(data.length > 0 ? data : fallbackStaff);
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
      className="py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto"
      id="staff"
      aria-labelledby="staff-heading"
    >
      <div className="text-center mb-20">
        <h2
          id="staff-heading"
          className="font-headline-lg text-headline-lg text-primary uppercase inline-block relative pb-4"
        >
          STAFF ESCOLAR
          <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-secondary"></span>
        </h2>
        <p className="text-on-surface-variant mt-6 max-w-xl mx-auto">
          Seleccionados por su excelencia y trayectoria académica en la escena Ballroom.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-label-md">Cargando staff...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {staff.map((member) => (
            <StaffMemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </section>
  );
}

export default StaffSection;

