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
              staff.map((member, index) => (
              <div key={index} className="border-b border-outline-variant/10 last:border-0 py-4">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-secondary/30 bg-surface-container-high flex-shrink-0">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64/191d3d/dfe0ff?text=' + member.name.charAt(0);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-headline-md text-base font-bold text-on-surface">{member.name}</p>
                        <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-0.5">
                          {member.role}
                        </p>
                      </div>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2 italic">{member.bio}</p>
                    {member.socialLinks && (
                      <a
                        href={`https://${member.socialLinks}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[10px] text-primary hover:text-secondary transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">link</span>
                        {member.socialLinks}
                      </a>
                    )}
                  </div>
                </div>
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
