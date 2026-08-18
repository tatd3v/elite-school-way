import { useState, useEffect } from 'preact/hooks';
import PropTypes from 'prop-types';
import { logoutAdmin } from '../utils/auth';
import { dashboardService } from '../services/dashboardService';
import DashboardHeader from './DashboardHeader';
import SearchBar from './SearchBar';
import StaffManagementSection from './StaffManagementSection';
import BottomNavigation from './BottomNavigation';
import DesktopNavigation from './DesktopNavigation';

function AdminDashboard({ user: _user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [sidebarWidth, setSidebarWidth] = useState(288);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const registrationsData = await dashboardService.fetchRegistrations();
      setParticipants(registrationsData);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStaffUpdate = () => {
    console.log('Updating staff...');
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.house || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleParticipants = filteredParticipants.slice(0, visibleCount);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const getCategory = (categories) => {
    if (!categories) return '—';
    return categories.split(',')[0].trim();
  };

  const getCleanHouse = (house) => {
    if (!house) return '—';
    return String(house).replace(/^'/, '');
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <DashboardHeader onProfileClick={handleLogout} />
      <DesktopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onWidthChange={setSidebarWidth}
      />

      <main
        className="pt-20 pb-24 px-margin-mobile min-h-screen linen-texture md:ml-[var(--sidebar-width)]"
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Error Message */}
          {error && (
            <div className="mb-6 luxury-card rounded-xl p-6 text-center border-l-4 border-l-error">
              <p className="text-on-surface font-body-md mb-2">{error}</p>
              <button
                onClick={loadDashboardData}
                className="academic-red-btn px-6 py-3 rounded-xl font-label-md uppercase tracking-wider"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-on-surface-variant font-label-md">Cargando datos...</p>
            </div>
          ) : (
            <>
              {/* Participantes — search + data table */}
              {activeTab === 'participants' && (
                <>
                  {/* Header Section */}
                  <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                      <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full font-label-sm text-label-sm uppercase tracking-tighter">
                        Panel de Control
                      </span>
                      <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                        Participantes Registrados
                      </h2>
                      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                        Gestione la nómina académica de la gala. Verifique los estados de confirmación y pertenencia a las casas reales.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button className="px-6 py-3 border border-outline-variant/30 rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined">download</span>
                        Exportar CSV
                      </button>
                      <button className="px-6 py-3 bg-secondary text-on-secondary rounded-lg font-label-md text-label-md font-bold flex items-center gap-2 transition-transform active:scale-95">
                        <span className="material-symbols-outlined">filter_list</span>
                        Filtros Avanzados
                      </button>
                    </div>
                  </section>

                  <div className="max-w-xl">
                    <SearchBar onSearch={handleSearch} placeholder="Buscar expediente..." />
                  </div>

                  {/* Participantes Data Table */}
                  <section className="glass-panel rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-surface-container-highest/50 border-b border-outline-variant/20">
                            <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">Nombre Artístico</th>
                            <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">Email Académico</th>
                            <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">Categoría Elite</th>
                            <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">House / Linaje</th>
                            <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest text-center">Status</th>
                            <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/10">
                          {visibleParticipants.length > 0 ? (
                            visibleParticipants.map((participant) => {
                              const isConfirmed = participant.status === 'confirmed';
                              const statusLabel = isConfirmed ? 'Confirmado' : 'Pendiente';
                              const statusDot = isConfirmed ? 'bg-green-400 animate-pulse' : 'bg-secondary';
                              const statusClass = isConfirmed
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-secondary/10 text-secondary border-secondary/20';

                              return (
                                <tr key={participant.id} className="hover:bg-surface-container-high/30 transition-colors group">
                                  <td className="px-6 py-5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full border border-secondary/30 overflow-hidden bg-surface-container-high flex items-center justify-center">
                                        <span className="font-body-md text-on-surface font-semibold">{getInitials(participant.name)}</span>
                                      </div>
                                      <span className="font-body-md text-on-surface font-semibold">{participant.name}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5 font-body-md text-on-surface-variant">{participant.email || '—'}</td>
                                  <td className="px-6 py-5">
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
                                      {getCategory(participant.categories)}
                                    </span>
                                  </td>
                                  <td className="px-6 py-5 font-body-md text-on-surface">{getCleanHouse(participant.house)}</td>
                                  <td className="px-6 py-5 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                                      {statusLabel}
                                    </span>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <button className="material-symbols-outlined text-on-surface-variant hover:text-primary">
                                      more_vert
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center font-body-md text-on-surface-variant">
                                No se encontraron participantes
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-highest/20">
                      <span className="text-label-sm text-on-surface-variant">
                        Mostrando 1-{visibleParticipants.length} de {filteredParticipants.length} participantes
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled
                          className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-bold text-xs">1</button>
                        <button
                          disabled
                          className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed"
                        >
                          2
                        </button>
                        <button
                          disabled
                          className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 text-on-surface-variant/50 cursor-not-allowed"
                        >
                          3
                        </button>
                        <button
                          onClick={handleLoadMore}
                          disabled={visibleCount >= filteredParticipants.length}
                          className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {/* Gestión de Claustro */}
              {activeTab === 'faculty' && (
                <StaffManagementSection onUpdate={handleStaffUpdate} />
              )}
            </>
          )}
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

AdminDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;
