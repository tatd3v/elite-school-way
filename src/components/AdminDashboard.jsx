import { useState, useEffect } from 'preact/hooks';
import PropTypes from 'prop-types';
import { logoutAdmin } from '../utils/auth';
import { dashboardService } from '../services/dashboardService';
import DashboardHeader from './DashboardHeader';
import SearchBar from './SearchBar';
import ParticipantCard from './ParticipantCard';
import StaffManagementSection from './StaffManagementSection';
import StatsSummary from './StatsSummary';
import BottomNavigation from './BottomNavigation';
import DesktopNavigation from './DesktopNavigation';

function AdminDashboard({ user: _user, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [participants, setParticipants] = useState([]);
  const [stats, setStats] = useState({ students: 0, houses: 0 });
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(288);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [registrationsData, statsData] = await Promise.all([
        dashboardService.fetchRegistrations(),
        dashboardService.fetchStats(),
      ]);
      
      setParticipants(registrationsData);
      setStats(statsData);
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
    p.house.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleParticipants = filteredParticipants.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <DashboardHeader onProfileClick={handleLogout} />
      <DesktopNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onWidthChange={setSidebarWidth}
      />

      <main 
        className="pt-20 pb-24 px-margin-mobile min-h-screen linen-texture"
        style={{ marginLeft: window.innerWidth >= 768 ? `${sidebarWidth}px` : '0' }}
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
              {/* Header Section */}
              <section className="mb-8">
                <div className="flex flex-col gap-4">
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary flex items-center gap-2">
                    Participantes Registrados
                  </h2>
                  <SearchBar onSearch={handleSearch} />
                </div>
              </section>

              {/* Participants Cards */}
              <section className="mb-section-gap-mobile">
                <div className="space-y-4">
                  {visibleParticipants.length > 0 ? (
                    visibleParticipants.map((participant) => (
                      <ParticipantCard key={participant.id} participant={participant} />
                    ))
                  ) : (
                    <div className="luxury-card rounded-xl p-8 text-center">
                      <p className="text-on-surface-variant font-body-md">No se encontraron participantes</p>
                    </div>
                  )}
                </div>

                {/* Load More Button */}
                {visibleCount < filteredParticipants.length && (
                  <button
                    onClick={handleLoadMore}
                    className="w-full mt-6 py-4 font-label-lg text-label-lg text-secondary border border-secondary hover:bg-secondary/5 active:scale-95 transition-all rounded-lg uppercase tracking-widest"
                  >
                    Cargar Más Participantes
                  </button>
                )}
              </section>

              {/* Staff Management Section */}
              <StaffManagementSection onUpdate={handleStaffUpdate} />

              {/* Stats Grid */}
              <StatsSummary students={stats.students} houses={stats.houses} />
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
