import { useState, useEffect } from 'preact/hooks';
import PropTypes from 'prop-types';
import { dashboardService } from '../services/dashboardService';

const defaultStaff = [
    {
      name: 'DJ Fierce',
      role: 'Official DJ',
      bio: 'Spinning ballroom culture beats since 2015',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtIgOIiZRxVtCbD81LtdX53nJZtkD6S05KtTyulzJ9nxdqb6Wcew5on-4tcCqfeanwjKF045jePxaI-uO7K_5N3NR2s-OTIT8GnPl84EigaiEsVoEHrV2YO3MXvQKE2h4iSZAybLv7xjDxukhUvMytF2Fc6V5DYYRUAQYal1iD50WXGdqxpKfycVepBsOx07vTNg8U1ibY9JGA0bP61xjR6tCOyVHpSJGjNTaStiTFALfOi8_kSOXQ',
      socialLinks: 'instagram.com/djfierce',
      displayOrder: 1,
    },
    {
      name: 'Prof. Enrique Madrigal',
      role: 'Director de Gala',
      bio: 'Leading Elite Way School ballroom events with elegance and precision',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWU46qmVq2SfRzbea-dALxTLfoMkNgmRegWMbf1oaVPMBIyob3RCWE-woPgneMTgPAN2n4CQjMf79lc-5aUlZfHkJLKW6YvwZaY7w9bTFRcb7mBjMag7EhS7P8-cygo6VGf_eb95Dgm4mXxm2yUYkk2KJhuVuvF1KKlEymRWnr8eKVCP-Z2xERa42u9qCY8ghVrePJMy1ffwozuuyspSbqEzvEzrkFde0VRhpKs6m62VuJOeN_sM11',
      socialLinks: 'instagram.com/prof.madrigal',
      displayOrder: 2,
    },
    {
      name: 'Sebastian de la Fuente',
      role: 'Maestro de Ceremonia',
      bio: 'Your charismatic host bringing energy to every ballroom moment',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoU21leSPDgDVRJ4FiTRFmmuLPg0pwlm4bxsQAH3LlkzkrFqqjb1pEY7inOEV617_m0CwxV1vjFDXKEqqbkb0SaoOtlArSlkjAieiAiV79QSBRz799AXM2iHdgl61vwKZtw8UtZJLx2raMm9JCF3N1Fr6DoNTB-NvEbex8Iv4b8eGrO9dJW93EN17DHlt6w0retsHc6VOxBB_t-he4-s_sZRoDyj4hmYyLcOpO5P_LSIOFGG9tsWV7',
      socialLinks: 'instagram.com/sebastianmc',
      displayOrder: 3,
    },
  ];

function StaffManagementSection({ onUpdate }) {
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

    loadStaff();
  }, []);

  const getRoleIcon = (role) => {
    if (role.toLowerCase().includes('dj') || role.toLowerCase().includes('musica')) return 'library_music';
    if (role.toLowerCase().includes('maestro') || role.toLowerCase().includes('ceremonia')) return 'campaign';
    if (role.toLowerCase().includes('director')) return 'star_rate';
    return 'star_rate';
  };

  const getRoleColor = (role) => {
    if (role.toLowerCase().includes('dj') || role.toLowerCase().includes('musica')) return 'primary';
    return 'secondary';
  };

  return (
    <section className="mb-section-gap-mobile">
      <div className="luxury-card rounded-xl overflow-hidden">
        <div className="bg-primary p-4 flex justify-between items-center">
          <h2 className="font-headline-md text-white text-md">Gestión de Claustro</h2>
          <span className="material-symbols-outlined text-white/70">event</span>
        </div>

        <div className="p-5">
          <div className="mb-6">
            <label className="block font-label-sm text-label-sm text-outline mb-2 uppercase tracking-tighter">
              Seleccionar Fecha de Gala
            </label>
            <div className="relative">
              <select className="w-full p-3 rounded border border-outline-variant bg-surface appearance-none focus:ring-1 focus:ring-primary outline-none font-body-md">
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
            <h4 className="font-label-lg text-label-lg text-primary uppercase border-b border-outline-variant/30 pb-2">
              Facultad Asignada
            </h4>

            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                <p className="text-on-surface-variant text-label-sm">Cargando...</p>
              </div>
            ) : (
              staff.map((member, index) => {
                const color = getRoleColor(member.role);
                return (
                  <div key={index} className="flex items-center gap-4 py-2">
                    <div className={`h-10 w-10 rounded-full bg-${color}/10 flex items-center justify-center border border-${color}/20`}>
                      <span className={`material-symbols-outlined text-${color}`}>{getRoleIcon(member.role)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-bold text-${color} uppercase tracking-widest`}>{member.role}</p>
                      <p className="font-body-md text-sm font-semibold text-on-surface truncate">{member.name}</p>
                    </div>
                    <button className="text-outline hover:text-primary transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={onUpdate}
            className="w-full mt-6 bg-secondary text-white py-4 font-label-lg text-label-lg rounded active:scale-[0.98] transition-transform uppercase tracking-widest"
          >
            Actualizar Claustro
          </button>
        </div>
      </div>
    </section>
  );
}

StaffManagementSection.propTypes = {
  onUpdate: PropTypes.func,
};

export default StaffManagementSection;
