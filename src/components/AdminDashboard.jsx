import { useState, useEffect } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import PropTypes from 'prop-types';
import { dashboardService } from '../services/dashboardService';
import { REGISTRATION_STATUS } from '../config/constants';
import DashboardHeader from './DashboardHeader';
import SearchBar from './SearchBar';
import StaffManagementSection from './StaffManagementSection';
import BottomNavigation from './BottomNavigation';
import DesktopNavigation from './DesktopNavigation';
import ParticipantEditModal from './ParticipantEditModal';

const ADMIN_ROLE = 'admin';

function AdminDashboard({ user }) {
  const isAdmin = user?.role === ADMIN_ROLE;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('participants');
  const [participants, setParticipants] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [deletingParticipant, setDeletingParticipant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (openMenuId === null) return;

    const closeMenu = () => setOpenMenuId(null);
    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);

    return () => {
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, [openMenuId]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [registrationsData, staffData] = await Promise.all([
        dashboardService.fetchRegistrations(),
        dashboardService.fetchStaff(), // includes hidden staff so admins can re-enable them
      ]);
      setParticipants(registrationsData);
      setStaff(staffData);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleStaffUpdate = async () => {
    // Refetch staff from the sheet so rowIndex values stay accurate after
    // any add/edit/delete/toggle — deleting a row shifts every row below it
    // up by one, so cached rowIndex values would otherwise go stale and
    // cause later actions to hit the wrong sheet row (e.g. toggling
    // visibility on the wrong member).
    try {
      const staffData = await dashboardService.fetchStaff();
      setStaff(staffData);
    } catch (err) {
      console.error('Error refreshing staff:', err);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleConfirmPayment = async (participantId) => {
    if (!isAdmin) return;
    setOpenMenuId(null);

    const participant = participants.find((p) => p.id === participantId);
    if (!participant) return;

    // Optimistic update for instant feedback
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, status: REGISTRATION_STATUS.PAID } : p
      )
    );

    try {
      const result = await dashboardService.updateRegistrationStatus(
        participant.rowIndex,
        REGISTRATION_STATUS.PAID
      );
      if (!result.success) {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error('Error confirming payment:', err);
      // Revert on failure
      setParticipants((prev) =>
        prev.map((p) => (p.id === participantId ? participant : p))
      );
    }
  };

  const toggleMenu = (participantId, event) => {
    if (!isAdmin) return;
    if (openMenuId === participantId) {
      setOpenMenuId(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 4,
      left: rect.right - 192, // align right edge (menu width: 12rem / 192px)
    });
    setOpenMenuId(participantId);
  };

  const handleEditClick = (participant) => {
    if (!isAdmin) return;
    setEditingParticipant(participant);
    setOpenMenuId(null);
  };

  const handleSaveParticipant = async (updatedParticipant) => {
    if (!isAdmin) return;
    setIsSubmitting(true);

    try {
      const result = await dashboardService.updateRegistration(updatedParticipant);
      if (result.success) {
        await loadDashboardData();
        setEditingParticipant(null);
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error('Error updating participant:', err);
      setError('Error al actualizar el participante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (participant) => {
    if (!isAdmin) return;
    setDeletingParticipant(participant);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin || !deletingParticipant) return;

    setIsSubmitting(true);
    try {
      const result = await dashboardService.deleteRegistration(deletingParticipant.rowIndex);
      if (result.success) {
        await loadDashboardData();
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error('Error deleting participant:', err);
      setError('Error al eliminar el participante');
    } finally {
      setIsSubmitting(false);
      setDeletingParticipant(null);
    }
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.house || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paid' && p.status === REGISTRATION_STATUS.PAID) ||
      (statusFilter === 'registered' && p.status !== REGISTRATION_STATUS.PAID);

    return matchesSearch && matchesStatus;
  });

  const visibleParticipants = filteredParticipants.slice(0, visibleCount);

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const getCategories = (categories) => {
    if (!categories) return '—';
    return categories;
  };

  const getCleanHouse = (house) => {
    if (!house) return '—';
    return String(house).replace(/^'/, '');
  };

  return (
    <div className="min-h-screen bg-background text-on-background">
      <DashboardHeader />
      <DesktopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onWidthChange={setSidebarWidth}
      />

      <main
        className="pt-16 pb-28 md:pb-6 px-margin-mobile min-h-[calc(100vh-4rem)] overflow-y-auto md:h-[calc(100vh-4rem)] md:overflow-hidden linen-texture md:ml-[var(--sidebar-width)]"
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <div className="max-w-7xl mx-auto md:h-full flex flex-col space-y-6 py-6">
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
              {/* Participantes Section */}
              {activeTab === 'participants' && (
              <section className="flex flex-col md:flex-1 md:min-h-0">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Participantes</h2>
                  <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
                </div>

                <div className="flex items-center gap-3 mb-6 flex-shrink-0">
                  <div className="flex-1">
                    <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre o casa..." />
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen((prev) => !prev)}
                      className={`flex items-center justify-center p-3 rounded-lg border transition-colors active:bg-surface-container ${
                        statusFilter !== 'all'
                          ? 'border-primary bg-primary/10'
                          : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container'
                      }`}
                      aria-label="Filtrar por estado"
                      aria-haspopup="true"
                      aria-expanded={isFilterOpen}
                    >
                      <span className="material-symbols-outlined text-primary">filter_list</span>
                    </button>

                    {isFilterOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsFilterOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-outline-variant/30 rounded-lg shadow-lg z-20 overflow-hidden">
                          {[
                            { id: 'all', label: 'Todos' },
                            { id: 'registered', label: REGISTRATION_STATUS.REGISTERED },
                            { id: 'paid', label: REGISTRATION_STATUS.PAID },
                          ].map((option) => (
                            <button
                              key={option.id}
                              onClick={() => {
                                setStatusFilter(option.id);
                                setIsFilterOpen(false);
                              }}
                              className={`w-full px-4 py-3 text-left font-label-md text-label-md transition-colors flex items-center justify-between ${
                                statusFilter === option.id
                                  ? 'text-primary bg-primary/10'
                                  : 'text-on-surface hover:bg-surface-container-highest'
                              }`}
                            >
                              {option.label}
                              {statusFilter === option.id && (
                                <span className="material-symbols-outlined text-sm">check</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Participantes Card List (mobile) */}
                <div className="md:hidden flex flex-col gap-4 pb-2">
                  {visibleParticipants.length > 0 ? (
                    visibleParticipants.map((participant) => {
                      const isPaid = participant.status === REGISTRATION_STATUS.PAID;
                      const statusLabel = isPaid ? REGISTRATION_STATUS.PAID : REGISTRATION_STATUS.REGISTERED;
                      const statusDot = isPaid ? 'bg-green-400 animate-pulse' : 'bg-secondary';
                      const statusClass = isPaid
                        ? 'bg-green-900/30 border-green-500/20 text-green-300'
                        : 'bg-secondary/20 border-secondary/20 text-secondary';

                      return (
                        <div
                          key={participant.id}
                          className="glass-panel rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-bl-full blur-xl pointer-events-none"></div>

                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-12 w-12 rounded-full overflow-hidden border border-outline-variant/30 shrink-0 bg-surface-container-high flex items-center justify-center">
                                <span className="font-body-md text-on-surface font-semibold">
                                  {getInitials(participant.name)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-headline-md text-[18px] leading-tight text-on-surface truncate">
                                  {participant.name}
                                </h3>
                                <p className="font-body-md text-[14px] text-on-surface-variant truncate">
                                  {getCleanHouse(participant.house)}
                                </p>
                              </div>
                            </div>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full border flex-shrink-0 ${statusClass}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></div>
                              <span className="font-label-sm text-label-sm">{statusLabel}</span>
                            </div>
                          </div>

                          <div className="h-[1px] w-full bg-tertiary/10"></div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="material-symbols-outlined text-secondary/70 text-sm">category</span>
                              <span className="font-label-md text-label-md text-on-surface-variant truncate">
                                {getCategories(participant.categories)}
                              </span>
                            </div>
                            {isAdmin && (
                              <button
                                onClick={(e) => toggleMenu(participant.id, e)}
                                className="material-symbols-outlined text-on-surface-variant hover:text-primary flex-shrink-0"
                              >
                                more_vert
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="glass-panel rounded-xl p-8 text-center font-body-md text-on-surface-variant">
                      No se encontraron participantes
                    </div>
                  )}

                  {visibleCount < filteredParticipants.length && (
                    <button
                      onClick={handleLoadMore}
                      className="w-full py-4 mt-2 border border-outline-variant/30 rounded-xl text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors"
                    >
                      Cargar Más
                    </button>
                  )}
                </div>

                {/* Participantes Data Table (desktop) */}
                <section className="hidden md:flex glass-panel rounded-xl overflow-hidden shadow-2xl border border-outline-variant/10 flex-col flex-1 min-h-0">
                  <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-highest/50 border-b border-outline-variant/20">
                          <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">Nombre Artístico</th>
                          <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">Email Académico</th>
                          <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">Categorías</th>
                          <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest">House / Linaje</th>
                          <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest text-center">Status</th>
                          {isAdmin && (
                            <th className="px-6 py-4 font-label-md text-label-md text-secondary uppercase tracking-widest text-right">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {visibleParticipants.length > 0 ? (
                          visibleParticipants.map((participant) => {
                            const isPaid = participant.status === REGISTRATION_STATUS.PAID;
                            const statusLabel = isPaid ? REGISTRATION_STATUS.PAID : REGISTRATION_STATUS.REGISTERED;
                            const statusDot = isPaid ? 'bg-green-400 animate-pulse' : 'bg-secondary';
                            const statusClass = isPaid
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
                                <td className="px-6 py-5 font-body-md text-on-surface-variant">
                                  {getCategories(participant.categories)}
                                </td>
                                <td className="px-6 py-5 font-body-md text-on-surface">{getCleanHouse(participant.house)}</td>
                                <td className="px-6 py-5 text-center">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></span>
                                    {statusLabel}
                                  </span>
                                </td>
                                {isAdmin && (
                                  <td className="px-6 py-5 text-right">
                                    <button
                                      onClick={(e) => toggleMenu(participant.id, e)}
                                      className="material-symbols-outlined text-on-surface-variant hover:text-primary"
                                    >
                                      more_vert
                                    </button>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center font-body-md text-on-surface-variant">
                              No se encontraron participantes
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant/20 bg-surface-container-highest/20 flex-shrink-0">
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
              </section>
              )}

              {/* Staff Section */}
              {activeTab === 'faculty' && (
                <StaffManagementSection onUpdate={handleStaffUpdate} staff={staff} canEdit={isAdmin} />
              )}
            </>
          )}
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Actions dropdown menu — portal so it isn't clipped by table scroll */}
      {isAdmin && openMenuId !== null && createPortal(
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenMenuId(null)}
          />
          <div
            className="fixed w-48 bg-surface-container-high border border-outline-variant/30 rounded-lg shadow-lg z-50 overflow-hidden"
            style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
          >
            {(() => {
              const activeParticipant = participants.find((p) => p.id === openMenuId);
              const isPaid = activeParticipant?.status === REGISTRATION_STATUS.PAID;

              return (
                <>
                  {!isPaid && (
                    <button
                      onClick={() => handleConfirmPayment(openMenuId)}
                      className="w-full px-4 py-3 text-left font-label-md text-label-md text-secondary hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Confirmar Pago
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(activeParticipant)}
                    className="w-full px-4 py-3 text-left font-label-md text-label-md text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(activeParticipant)}
                    className="w-full px-4 py-3 text-left font-label-md text-label-md text-error hover:bg-surface-container-highest transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Eliminar
                  </button>
                </>
              );
            })()}
          </div>
        </>,
        document.body
      )}

      {/* Edit Participant Modal */}
      {isAdmin && editingParticipant && (
        <ParticipantEditModal
          participant={editingParticipant}
          onSave={handleSaveParticipant}
          onCancel={() => setEditingParticipant(null)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {isAdmin && deletingParticipant && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingParticipant(null);
          }}
        >
          <div
            className="luxury-card rounded-xl w-full max-w-md p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <h3 id="delete-confirm-title" className="font-headline-md text-headline-md text-on-surface mb-2">
              Eliminar Participante
            </h3>
            <p className="font-body-md text-on-surface-variant mb-6">
              ¿Está seguro de que desea eliminar a <strong className="text-on-surface">{deletingParticipant.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingParticipant(null)}
                className="flex-1 py-3 px-4 rounded border border-outline-variant text-on-surface font-label-md uppercase tracking-wider hover:bg-surface-container transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded bg-error text-on-error font-label-md uppercase tracking-wider hover:bg-error/90 active:scale-[0.98] transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
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
};

export default AdminDashboard;
