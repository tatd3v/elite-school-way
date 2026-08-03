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

  return (
    <section className="mb-12">
      {/* Date Selector */}
      <div className="mb-8">
        <label className="block font-label-sm text-on-surface-variant mb-2 ml-1 uppercase tracking-wider">EVENTO PROGRAMADO</label>
        <div className="glass-card rounded-xl p-4 flex items-center justify-between gold-border-glow">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">calendar_today</span>
            <span className="font-body-md font-medium text-on-surface">Sábado, 12 de Octubre, 2024</span>
          </div>
          <span className="material-symbols-outlined text-outline">expand_more</span>
        </div>
      </div>

      {/* Faculty Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-on-surface">Facultad Asignada</h2>
          <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
        </div>

        {/* Faculty Cards */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
              <p className="text-on-surface-variant text-label-sm">Cargando...</p>
            </div>
          ) : (
            staff.map((member, index) => (
              <div key={index} className="glass-card rounded-xl p-4 flex items-center gap-4 relative group overflow-hidden">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-outline/20">
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
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-label-sm px-2 py-0.5 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                      {member.role}
                    </span>
                  </div>
                  <h3 className="font-body-lg font-bold text-on-surface">{member.name}</h3>
                  <p className="text-on-surface-variant text-label-md">{member.bio}</p>
                </div>
                <button className="text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <div className="absolute right-0 top-0 h-full w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))
          )}
        </div>

        {/* Primary Action */}
        <div className="mt-8">
          <button
            onClick={onUpdate}
            className="academic-red-btn w-full py-4 rounded-xl font-bold tracking-wider flex items-center justify-center gap-2 shadow-xl"
          >
            <span className="material-symbols-outlined">save</span>
            GUARDAR CAMBIOS
          </button>
          <p className="text-center text-label-sm text-outline mt-4 opacity-70">Última modificación hace 2 horas</p>
        </div>
      </div>
    </section>
  );
}

StaffManagementSection.propTypes = {
  onUpdate: PropTypes.func,
};

export default StaffManagementSection;
