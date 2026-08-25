import { useState, useEffect, useRef } from 'preact/hooks';
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
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [deletingParticipant, setDeletingParticipant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pendingAddStaff, setPendingAddStaff] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const loadMoreBtnRef = useRef(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

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
    setVisibleCount((prev) => Math.min(prev + 3, pageSize));
  };

  const handleConfirmPayment = async (participantId) => {
    if (!isAdmin) return;

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

  const handleEditClick = (participant) => {
    if (!isAdmin) return;
    setEditingParticipant(participant);
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

  const visibleParticipants = filteredParticipants.slice(0, Math.min(visibleCount, pageSize));

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
  };

  const getCleanHouse = (house) => {
    if (!house) return '—';
    return String(house).replace(/^'/, '');
  };

  return (
    <div className="h-screen bg-background text-on-background flex flex-col overflow-hidden">
      {(activeTab !== 'participants' && activeTab !== 'faculty') && <DashboardHeader />}
      <DesktopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onWidthChange={setSidebarWidth}
        onNewStaff={() => {
          setActiveTab('faculty')
          setPendingAddStaff(true)
        }}
      />

      <main
        className="flex-1 overflow-y-auto md:overflow-hidden px-margin-mobile pt-4 linen-texture md:ml-[var(--sidebar-width)] md:pt-0"
        style={{ '--sidebar-width': `${sidebarWidth}px` }}
      >
        <div className="w-full h-full flex flex-col space-y-3 py-3 md:space-y-2 md:py-2 gap-3">
          {/* Error Message */}
          {error && (
            <div className="luxury-card rounded-xl p-6 text-center border-l-4 border-l-error flex-shrink-0">
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
            <div className="flex flex-col items-center justify-center py-20 flex-shrink-0">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-on-surface-variant font-label-md">Cargando datos...</p>
            </div>
          ) : (
            <>
              {/* Participantes Section */}
              {activeTab === 'participants' && (
              <section className="flex flex-col md:flex-1 md:min-h-0 md:overflow-hidden w-full">
                {/* Header Section (mobile only) */}
                <div className="md:hidden flex items-center justify-between mb-6 flex-shrink-0">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Participantes</h2>
                  <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
                </div>

                <div className="flex items-center gap-3 mb-4 flex-shrink-0 md:mb-3 md:hidden">
                  <div className="flex-1">
                    <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre o casa..." />
                  </div>

                  {/* Refresh Button */}
                  <button
                    type="button"
                    onClick={loadDashboardData}
                    className="flex items-center justify-center bg-surface-container-low rounded-lg p-2 border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors duration-300 cursor-pointer active:opacity-70 gold-border-focus"
                    aria-label="Actualizar datos"
                  >
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                  </button>

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
                <div className="md:hidden flex flex-col gap-4 pb-20">
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
                          className="glass-panel rounded-xl p-5 flex flex-col gap-4 relative overflow-visible border border-outline-variant/20"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container/5 rounded-bl-full blur-xl pointer-events-none"></div>

                          <div className="flex items-center justify-between relative z-10 gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-headline-md text-[18px] leading-tight text-on-surface truncate">
                                  {participant.name}
                                </h3>
                                <p className="font-body-md text-[14px] text-on-surface-variant truncate">
                                  {getCleanHouse(participant.house)}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              <div className="flex items-center gap-2 relative">
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full border flex-shrink-0 ${statusClass}`}>
                                  <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`}></div>
                                  <span className="font-label-sm text-label-sm">{statusLabel}</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    if (openMenuId === participant.id) {
                                      setOpenMenuId(null);
                                      setMenuPosition(null);
                                    } else {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setMenuPosition({
                                        top: rect.bottom + window.scrollY + 4,
                                        right: window.innerWidth - rect.right - window.scrollX,
                                      });
                                      setOpenMenuId(participant.id);
                                    }
                                  }}
                                  className="text-on-surface-variant hover:text-secondary transition-colors"
                                  aria-label="Menú de opciones"
                                >
                                  <span className="material-symbols-outlined">more_vert</span>
                                </button>

                                {openMenuId === participant.id && menuPosition && createPortal(
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setMenuPosition(null);
                                      }}
                                    ></div>
                                    <div
                                      className="absolute bg-surface-container-high border border-outline-variant/30 rounded-lg shadow-2xl z-[60] min-w-max"
                                      style={{ top: `${menuPosition.top}px`, right: `${menuPosition.right}px` }}
                                    >
                                      {!isPaid && (
                                        <button
                                          onClick={() => {
                                            handleConfirmPayment(participant.id);
                                            setOpenMenuId(null);
                                            setMenuPosition(null);
                                          }}
                                          className="w-full text-left px-4 py-2 text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2 text-sm"
                                        >
                                          <span className="material-symbols-outlined text-sm">paid</span>
                                          Confirmar Pago
                                        </button>
                                      )}
                                      <button
                                        onClick={() => {
                                          handleEditClick(participant);
                                          setOpenMenuId(null);
                                          setMenuPosition(null);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2 text-sm ${!isPaid ? 'border-t border-outline-variant/20' : ''}`}
                                      >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleDeleteClick(participant);
                                          setOpenMenuId(null);
                                          setMenuPosition(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-error hover:bg-surface-container-highest transition-colors flex items-center gap-2 text-sm border-t border-outline-variant/20"
                                      >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        Eliminar
                                      </button>
                                    </div>
                                  </>,
                                  document.body
                                )}
                              </div>
                              {participant.screenshot && (
                                <a
                                  href={participant.screenshot}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-secondary font-label-md hover:opacity-80 transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-sm">qr_code_2</span>
                                  QR
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="glass-panel rounded-xl p-8 text-center font-body-md text-on-surface-variant">
                      No se encontraron participantes
                    </div>
                  )}

                  {visibleCount < Math.min(pageSize, filteredParticipants.length) && (
                    <button
                      ref={loadMoreBtnRef}
                      onClick={() => {
                        handleLoadMore();
                        // Ensure the button stays visible above the fixed mobile
                        // bottom nav (h-20 = 80px) once new cards render below it.
                        // scroll-mb-24 (96px) keeps a safe clearance margin.
                        requestAnimationFrame(() => {
                          loadMoreBtnRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
                        });
                      }}
                      className="w-full py-4 mt-2 border border-outline-variant/30 rounded-xl text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors scroll-mb-24"
                    >
                      Cargar más ({visibleCount} de {filteredParticipants.length})
                    </button>
                  )}
                </div>

                {/* Participantes Data Table (desktop) */}
                <section className="hidden md:flex flex-col flex-1 min-h-0 w-full gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 bg-surface-container-low rounded-xl card-outline">
                    <div className="flex-1">
                      <SearchBar onSearch={handleSearch} placeholder="Buscar por nombre o casa..." />
                    </div>

                    {/* Refresh Button */}
                    <button
                      type="button"
                      onClick={loadDashboardData}
                      className="flex items-center justify-center bg-surface-container-low rounded-lg p-2 border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors duration-300 cursor-pointer active:opacity-70 gold-border-focus"
                      aria-label="Actualizar datos"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen((prev) => !prev)}
                        className={`flex items-center justify-center p-2 rounded-lg border transition-colors active:bg-surface-container ${
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

                  <div className="bg-surface-container-low rounded-xl card-outline overflow-hidden flex-col flex-1 min-h-0 w-full flex">
                    <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 w-full">
                      <table className="w-full min-w-full text-left border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-surface-container-high border-b border-outline-variant/20">
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Fecha de registro</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Nombre o AKA</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Email</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Teléfono</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">House</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Edad</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Screenshot</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs text-center">Status</th>
                          {isAdmin && (
                            <th className="p-2 font-label-sm text-on-background font-medium text-xs text-center">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {visibleParticipants.length > 0 ? (
                          visibleParticipants.map((participant, idx) => {
                            const isPaid = participant.status === REGISTRATION_STATUS.PAID;
                            const statusLabel = isPaid ? REGISTRATION_STATUS.PAID : REGISTRATION_STATUS.REGISTERED;
                            const statusDot = isPaid ? 'bg-green-400 animate-pulse' : 'bg-secondary';
                            const statusClass = isPaid
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-secondary/10 text-secondary border-secondary/20';
                            const rowBg = idx % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface-container-lowest/50';

                            return (
                              <tr key={participant.id} className={`${rowBg}`}>
                                <td className="p-2 font-label-sm text-on-surface-variant text-xs">
                                  {participant.timestamp ? new Date(participant.timestamp).toLocaleDateString() : '—'}
                                </td>
                                <td className="p-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-label-sm text-on-background text-sm">{participant.name}</span>
                                  </div>
                                </td>
                                <td className="p-2 font-label-sm text-on-surface-variant text-xs">{participant.email || '—'}</td>
                                <td className="p-2 font-label-sm text-on-surface-variant text-xs">{participant.phone || '—'}</td>
                                <td className="p-2 font-label-sm text-on-surface-variant text-xs">{getCleanHouse(participant.house)}</td>
                                <td className="p-2 font-label-sm text-on-surface-variant text-xs text-center">{participant.age || '—'}</td>
                                <td className="p-2 text-center">
                                  {participant.screenshot ? (
                                    <a href={participant.screenshot} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary text-xs underline">
                                      Ver
                                    </a>
                                  ) : (
                                    '—'
                                  )}
                                </td>
                                <td className="p-2 text-center">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-label-sm border ${statusClass}`}>
                                    <span className={`w-1 h-1 rounded-full ${statusDot}`}></span>
                                    {statusLabel}
                                  </span>
                                </td>
                                {isAdmin && (
                                  <td className="p-2 text-center">
                                    <div className="flex justify-center gap-1">
                                      {!isPaid && (
                                        <button
                                          type="button"
                                          onClick={() => handleConfirmPayment(participant.id)}
                                          className="text-on-surface-variant hover:text-primary transition-colors"
                                          aria-label="Confirmar pago"
                                        >
                                          <span className="material-symbols-outlined text-2xl">paid</span>
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        onClick={() => handleEditClick(participant)}
                                        className="text-on-surface-variant hover:text-primary transition-colors"
                                        aria-label="Editar participante"
                                      >
                                        <span className="material-symbols-outlined text-2xl">edit</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteClick(participant)}
                                        className="text-on-surface-variant hover:text-error transition-colors"
                                        aria-label="Eliminar participante"
                                      >
                                        <span className="material-symbols-outlined text-2xl">delete</span>
                                      </button>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={isAdmin ? 10 : 9} className="px-6 py-12 text-center font-body-md text-on-surface-variant">
                              No se encontraron participantes
                            </td>
                          </tr>
                        )}
                      </tbody>
                      </table>
                    </div>

                  {/* Pagination */}
                  <div className="flex flex-col md:flex-row justify-between items-center p-2 border-t border-outline-variant/20 gap-4 flex-shrink-0">
                    <div className="text-label-sm text-on-surface-variant text-xs">
                      Mostrando 1-{visibleParticipants.length} de {filteredParticipants.length}
                    </div>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-2 py-1 border border-outline-variant/50 gold-border-focus gap-2">
                      <span className="text-label-sm text-on-surface-variant">Filas:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          const next = Number(e.target.value);
                          setPageSize(next);
                          setVisibleCount(next);
                        }}
                        className="bg-transparent border-none outline-none text-label-sm text-on-background focus:ring-0 cursor-pointer"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        disabled
                        className="p-1 rounded hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                      </button>
                      <div className="flex gap-0.5">
                        <button className="w-6 h-6 flex items-center justify-center rounded bg-primary text-on-primary font-label-sm text-xs">1</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-xs transition-colors">2</button>
                        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-highest text-on-surface-variant font-label-sm text-xs transition-colors">3</button>
                      </div>
                      <button
                        onClick={handleLoadMore}
                        disabled={visibleCount >= filteredParticipants.length}
                        className="p-1 rounded hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              </section>
              )}

              {/* Staff Section */}
              {activeTab === 'faculty' && (
                <StaffManagementSection
                  onUpdate={handleStaffUpdate}
                  staff={staff}
                  canEdit={isAdmin}
                  autoOpenAdd={pendingAddStaff}
                  onAutoOpenAdd={() => setPendingAddStaff(false)}
                />
              )}
            </>
          )}
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

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
