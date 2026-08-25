import { useState, useEffect, useCallback } from 'preact/hooks';
import PropTypes from 'prop-types';
import { dashboardService } from '../services/dashboardService';
import { toDirectImageUrl } from '../utils/driveImage';
import StaffEditModal from './StaffEditModal';
import SearchBar from './SearchBar';

const MAX_BIO_PREVIEW = 80;

function getSocialUrl(socialLinks) {
  if (!socialLinks) return null;
  let s = String(socialLinks).trim();
  if (s.startsWith('@')) s = `instagram.com/${s.slice(1)}`;
  if (!s.startsWith('http')) s = `https://${s}`;
  return s;
}

function getSocialHandle(socialLinks) {
  if (!socialLinks) return '';
  const cleaned = String(socialLinks)
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/^instagram\.com\//, '')
    .split('?')[0]
    .split('/')
    .filter(Boolean)
    .pop();
  if (!cleaned) return socialLinks;
  return cleaned.startsWith('@') ? cleaned : `@${cleaned}`;
}

function BioWithToggle({ bio, isExpanded, onToggle, className }) {
  const shouldTruncate = bio.length > MAX_BIO_PREVIEW;
  const display = isExpanded ? bio : shouldTruncate ? `${bio.slice(0, MAX_BIO_PREVIEW)}...` : bio;
  return (
    <div>
      <p className={`${className} ${isExpanded ? '' : 'truncate'}`}>
        {display}
      </p>
      {shouldTruncate && (
        <button
          type="button"
          onClick={onToggle}
          className="text-primary text-xs mt-1 underline hover:text-secondary"
        >
          {isExpanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </div>
  );
}

BioWithToggle.propTypes = {
  bio: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const enrichStaff = (list) =>
  list.map((member, index) => ({
    ...member,
    id: member.id || `local-${index}`,
    isVisible: member.isVisible ?? true,
    displayOrder: Number(member.displayOrder) || 0,
  }));

const defaultStaff = [
    {
      name: 'DJ Fierce',
      role: 'Official DJ',
      bio: 'Spinning ballroom culture beats since 2015',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtIgOIiZRxVtCbD81LtdX53nJZtkD6S05KtTyulzJ9nxdqb6Wcew5on-4tcCqfeanwjKF045jePxaI-uO7K_5N3NR2s-OTIT8GnPl84EigaiEsVoEHrV2YO3MXvQKE2h4iSZAybLv7xjDxukhUvMytF2Fc6V5DYYRUAQYal1iD50WXGdqxpKfycVepBsOx07vTNg8U1ibY9JGA0bP61xjR6tCOyVHpSJGjNTaStiTFALfOi8_kSOXQ',
      socialLinks: 'instagram.com/djfierce',
      displayOrder: 1,
      isVisible: true,
    },
    {
      name: 'Prof. Enrique Madrigal',
      role: 'Director de Gala',
      bio: 'Leading Elite Way School ballroom events with elegance and precision',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWU46qmVq2SfRzbea-dALxTLfoMkNgmRegWMbf1oaVPMBIyob3RCWE-woPgneMTgPAN2n4CQjMf79lc-5aUlZfHkJLKW6YvwZaY7w9bTFRcb7mBjMag7EhS7P8-cygo6VGf_eb95Dgm4mXxm2yUYkk2KJhuVuvF1KKlEymRWnr8eKVCP-Z2xERa42u9qCY8ghVrePJMy1ffwozuuyspSbqEzvEzrkFde0VRhpKs6m62VuJOeN_sM11',
      socialLinks: 'instagram.com/prof.madrigal',
      displayOrder: 2,
      isVisible: true,
    },
    {
      name: 'Sebastian de la Fuente',
      role: 'Maestro de Ceremonia',
      bio: 'Your charismatic host bringing energy to every ballroom moment',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoU21leSPDgDVRJ4FiTRFmmuLPg0pwlm4bxsQAH3LlkzkrFqqjb1pEY7inOEV617_m0CwxV1vjFDXKEqqbkb0SaoOtlArSlkjAieiAiV79QSBRz799AXM2iHdgl61vwKZtw8UtZJLx2raMm9JCF3N1Fr6DoNTB-NvEbex8Iv4b8eGrO9dJW93EN17DHlt6w0retsHc6VOxBB_t-he4-s_sZRoDyj4hmYyLcOpO5P_LSIOFGG9tsWV7',
      socialLinks: 'instagram.com/sebastianmc',
      displayOrder: 3,
      isVisible: true,
    },
  ];

function StaffManagementSection({ onUpdate, staff: initialStaff = [], canEdit = false, autoOpenAdd = false, onAutoOpenAdd }) {
  const [staff, setStaff] = useState(initialStaff);
  const [isLoading, setIsLoading] = useState(!initialStaff || initialStaff.length === 0);
  const [editingMember, setEditingMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [photoErrors, setPhotoErrors] = useState({});
  const [expandedBios, setExpandedBios] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleBio = (id) =>
    setExpandedBios((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  const loadStaff = useCallback(async () => {
    if (initialStaff && initialStaff.length > 0) {
      setStaff(enrichStaff(initialStaff));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const staffData = await dashboardService.fetchStaff();
      setStaff(enrichStaff(staffData.length > 0 ? staffData : defaultStaff));
    } catch (error) {
      console.error('Error loading staff:', error);
      setStaff(enrichStaff(defaultStaff));
    } finally {
      setIsLoading(false);
    }
  }, [initialStaff]);

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const showError = (message) => {
    setActionError(message);
    setTimeout(() => setActionError(null), 5000);
  };

  const showSuccess = (message) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleEdit = (member) => {
    if (!canEdit) return;
    setEditingMember({ ...member });
  };

  const handleCloseEdit = () => {
    setEditingMember(null);
  };

  const handleAddClick = useCallback(() => {
    // Get the highest displayOrder from ALL staff (not just visible)
    const allOrders = staff.map((m) => Number(m.displayOrder) || 0);
    const nextOrder = allOrders.length > 0 ? Math.max(...allOrders) + 1 : 1;

    setEditingMember({
      isNew: true,
      name: '',
      role: '',
      bio: '',
      photo: '',
      socialLinks: '',
      displayOrder: nextOrder,
      isVisible: false,
    });
  }, [staff]);

  useEffect(() => {
    if (autoOpenAdd && canEdit) {
      handleAddClick()
      if (onAutoOpenAdd) onAutoOpenAdd()
    }
  }, [autoOpenAdd, canEdit, handleAddClick, onAutoOpenAdd])

  const handleSaveEdit = async (updated) => {
    setIsSubmitting(true);
    setActionError(null);

    try {
      // Check if the desired displayOrder is already taken by a different member
      const desiredOrder = Number(updated.displayOrder) || 0;
      const currentMemberOldOrder = Number(editingMember?.displayOrder) || 0;
      const existingMember = staff.find(
        (m) => Number(m.displayOrder) === desiredOrder && m.id !== updated.id
      );

      if (existingMember) {
        // Simple swap: give the existing member the current member's old order
        const updateResult = await dashboardService.updateStaff({
          ...existingMember,
          displayOrder: currentMemberOldOrder,
        });

        if (!updateResult.success) {
          showError('No se pudo reorganizar los órdenes');
          return;
        }
      }

      // Now update the current member with the desired order
      const result = await dashboardService.updateStaff(updated);

      if (result.success) {
        await loadStaff();
        showSuccess('Miembro actualizado correctamente');
        handleCloseEdit();
        onUpdate?.();
      } else {
        showError('No se pudo actualizar el miembro');
      }
    } catch (error) {
      console.error('Error updating staff member:', error);
      showError('Error al actualizar el miembro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = async (data) => {
    setIsSubmitting(true);
    setActionError(null);

    try {
      // Check if the desired displayOrder is already taken
      const desiredOrder = Number(data.displayOrder) || 0;
      const existingMember = staff.find((m) => Number(m.displayOrder) === desiredOrder);

      if (existingMember) {
        // Find the next available order
        const allOrders = staff.map((m) => Number(m.displayOrder) || 0);
        const nextAvailable = allOrders.length > 0 ? Math.max(...allOrders) + 1 : 1;

        // Update the existing member with the next available order
        const updateResult = await dashboardService.updateStaff({
          ...existingMember,
          displayOrder: nextAvailable,
        });

        if (!updateResult.success) {
          showError('No se pudo reorganizar los órdenes');
          return;
        }
      }

      // Now add the new staff member with the desired order
      const result = await dashboardService.addStaff(data);

      if (result.success) {
        await loadStaff();
        showSuccess('Miembro agregado correctamente');
        handleCloseEdit();
        onUpdate?.();
      } else {
        showError('No se pudo agregar el miembro');
      }
    } catch (error) {
      console.error('Error adding staff member:', error);
      showError('Error al agregar el miembro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = (data) => {
    if (editingMember?.isNew) {
      handleAdd(data);
    } else {
      handleSaveEdit(data);
    }
  };

  const handleDelete = async (member) => {
    if (!canEdit) return;
    const confirmed = window.confirm(`¿Eliminar a ${member.name} del Staff?`);
    if (!confirmed) return;

    setDeletingId(member.id);
    setActionError(null);

    try {
      const result = await dashboardService.deleteStaff(member.rowIndex);

      if (result.success) {
        // Optimistic local removal for instant feedback. Note: deleting a
        // row shifts every row below it up by one in the sheet, so the
        // rowIndex cached for the remaining members is now stale until
        // onUpdate() triggers the parent to refetch fresh data with
        // corrected rowIndex values (see AdminDashboard's handleStaffUpdate).
        setStaff((prev) => prev.filter((m) => m.id !== member.id));
        showSuccess('Miembro eliminado correctamente');
        onUpdate?.();
      } else {
        showError('No se pudo eliminar el miembro');
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      showError('Error al eliminar el miembro');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (member) => {
    if (!canEdit) return;
    const nextVisible = !member.isVisible;
    const updated = { ...member, isVisible: nextVisible };

    setTogglingId(member.id);
    setStaff((prev) => prev.map((m) => (m.id === member.id ? updated : m)));

    try {
      const result = await dashboardService.toggleStaffVisibility(member.rowIndex, nextVisible);

      if (result.success) {
        showSuccess(nextVisible ? 'Miembro ahora es visible' : 'Miembro ocultado');
        onUpdate?.();
      } else {
        throw new Error('Toggle failed');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      showError('Error al cambiar la visibilidad');
      setStaff((prev) => prev.map((m) => (m.id === member.id ? member : m)));
    } finally {
      setTogglingId(null);
    }
  };

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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredStaff = normalizedQuery
    ? staff.filter((m) =>
        [m.name, m.role, m.bio, m.socialLinks].some((field) =>
          String(field || '').toLowerCase().includes(normalizedQuery)
        )
      )
    : staff;
  const sortedStaff = [...filteredStaff].sort((a, b) => a.displayOrder - b.displayOrder);
  const totalPages = Math.ceil(sortedStaff.length / pageSize) || 1;
  const visibleStaff = sortedStaff.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section className="flex flex-col md:flex-1 md:min-h-0 md:overflow-hidden w-full">
      {actionError && (
        <div className="p-3 rounded bg-error-container text-error text-sm font-body-md flex-shrink-0" role="alert">
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="p-3 rounded bg-primary-fixed text-on-primary-fixed text-sm font-body-md flex-shrink-0" role="status">
          {actionSuccess}
        </div>
      )}

      <div className="md:hidden flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="font-headline-md text-headline-md text-on-surface">Staff</h2>
        <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-shrink-0 md:mb-3 md:hidden">
        <div className="flex-1">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Buscar miembro..."
          />
        </div>
        <button
          type="button"
          onClick={loadStaff}
          className="flex items-center justify-center order-last p-3 md:p-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container active:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Actualizar datos"
        >
          <span className="material-symbols-outlined text-primary">refresh</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-1 md:min-h-0 space-y-3 md:space-y-0">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                <p className="text-on-surface-variant text-label-sm">Cargando...</p>
              </div>
            ) : (
              <>
                {/* Mobile card list */}
                <div className="md:hidden space-y-3 flex-1 overflow-y-auto">
                  {visibleStaff.map((member) => {
                    const color = getRoleColor(member.role);
                    const isBusy = togglingId === member.id || deletingId === member.id;
                    const hasPhoto =
                      typeof member.photo === 'string' &&
                      member.photo.trim() !== '' &&
                      !photoErrors[member.id];

                    return (
                      <div
                        key={member.id}
                        className={`glass-card gold-border-glow rounded-xl p-4 flex items-center gap-4 relative group overflow-hidden ${
                          member.isVisible ? '' : 'opacity-60'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-outline/20 bg-surface-container-high flex items-center justify-center">
                          {hasPhoto ? (
                            <img
                              src={toDirectImageUrl(member.photo)}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={() =>
                                setPhotoErrors((prev) => ({ ...prev, [member.id]: true }))
                              }
                            />
                          ) : (
                            <span className={`material-symbols-outlined text-${color}`}>
                              {getRoleIcon(member.role)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="inline-block font-label-sm text-label-sm px-2 py-0.5 bg-secondary/10 text-secondary rounded-full border border-secondary/20">
                              {member.role}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full border ${
                                member.isVisible
                                  ? 'bg-primary/10 text-primary border-primary/20'
                                  : 'bg-outline/10 text-outline border-outline/20'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[14px]">
                                {member.isVisible ? 'visibility' : 'visibility_off'}
                              </span>
                              {member.isVisible ? 'Visible' : 'Oculto'}
                            </span>
                          </div>
                          <h3 className="font-body-lg text-body-lg font-bold text-on-surface truncate">
                            {member.name}
                          </h3>
                          {member.bio && (
                            <BioWithToggle
                              bio={member.bio}
                              isExpanded={!!expandedBios[member.id]}
                              onToggle={() => toggleBio(member.id)}
                              className="text-on-surface-variant text-label-md"
                            />
                          )}
                          <div className="flex items-center gap-3 mt-1 text-outline text-label-sm">
                            <span>Orden: {member.displayOrder ?? '—'}</span>
                            {member.socialLinks && (
                              <a
                                href={getSocialUrl(member.socialLinks)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate max-w-[140px] text-primary hover:text-secondary transition-colors"
                              >
                                {getSocialHandle(member.socialLinks)}
                              </a>
                            )}
                          </div>
                        </div>

                        {canEdit && (
                          <div className="flex flex-col items-center gap-3 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleVisibility(member)}
                              disabled={isBusy}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex-shrink-0 ${
                                member.isVisible ? 'bg-secondary' : 'bg-outline-variant'
                              }`}
                              role="switch"
                              aria-checked={member.isVisible}
                              aria-label={`${member.isVisible ? 'Ocultar' : 'Mostrar'} a ${member.name}`}
                            >
                              <span
                                className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                  member.isVisible ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleEdit(member)}
                              disabled={isBusy}
                              className="text-outline hover:text-primary transition-colors disabled:opacity-50"
                              aria-label={`Editar a ${member.name}`}
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(member)}
                              disabled={isBusy}
                              className="text-outline hover:text-error transition-colors disabled:opacity-50"
                              aria-label={`Eliminar a ${member.name}`}
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        )}

                        <div className="absolute right-0 top-0 h-full w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop table */}
                <div className="hidden md:flex flex-col flex-1 min-h-0 w-full gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 bg-surface-container-low rounded-xl card-outline">
                    <div className="flex-1">
                      <SearchBar
                        onSearch={handleSearch}
                        placeholder="Buscar miembro..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={loadStaff}
                      className="flex items-center justify-center order-last p-3 md:p-2 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container active:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                      aria-label="Actualizar datos"
                    >
                      <span className="material-symbols-outlined text-primary">refresh</span>
                    </button>
                  </div>

                  <div className="bg-surface-container-low rounded-xl card-outline overflow-hidden flex-col flex-1 min-h-0 w-full flex">
                    <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full min-w-full text-left border-collapse">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-surface-container-high border-b border-outline-variant/20">
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Foto</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Nombre o AKA</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Cargo</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Bio</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Redes Sociales</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Orden</th>
                          <th className="p-2 font-label-sm text-on-background font-medium text-xs">Visible</th>
                          {canEdit && (
                            <th className="p-2 font-label-sm text-on-background font-medium text-xs text-center">Acciones</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {visibleStaff.length > 0 ? (visibleStaff.map((member, idx) => {
                          const color = getRoleColor(member.role);
                          const isBusy = togglingId === member.id || deletingId === member.id;
                          const hasPhoto =
                            typeof member.photo === 'string' &&
                            member.photo.trim() !== '' &&
                            !photoErrors[member.id];
                          const rowBg = idx % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface-container-lowest/50';
                          const badgeClass = 'bg-surface-variant text-on-surface-variant border-outline-variant/50';

                          return (
                            <tr key={member.id} className={`${rowBg} ${member.isVisible ? '' : 'opacity-60'}`}>
                              <td className="p-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center border border-outline-variant/50 flex-shrink-0">
                                  {hasPhoto ? (
                                    <img
                                      src={toDirectImageUrl(member.photo)}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                      onError={() =>
                                        setPhotoErrors((prev) => ({ ...prev, [member.id]: true }))
                                      }
                                    />
                                  ) : (
                                    <span className={`material-symbols-outlined text-${color} text-2xl`}>
                                      {getRoleIcon(member.role)}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2 font-label-sm text-on-background text-sm">{member.name}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 rounded text-xs font-label-sm border ${badgeClass}`}>
                                  {member.role}
                                </span>
                              </td>
                              <td className="p-2 font-label-sm text-on-surface-variant max-w-xs truncate text-xs">
                                {member.bio ? member.bio.substring(0, 50) + '...' : '—'}
                              </td>
                              <td className="p-2 font-label-sm text-on-surface-variant text-xs">
                                {member.socialLinks ? getSocialHandle(member.socialLinks) : '—'}
                              </td>
                              <td className="p-2 font-label-sm text-on-surface-variant text-xs">
                                {member.displayOrder ?? '—'}
                              </td>
                              <td className="p-2">
                                <span
                                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-label-sm border ${
                                    member.isVisible
                                      ? 'bg-primary/10 text-primary border-primary/20'
                                      : 'bg-outline/10 text-outline border-outline/20'
                                  }`}
                                >
                                  <span className={`w-1 h-1 rounded-full ${member.isVisible ? 'bg-primary' : 'bg-outline'}`}></span>
                                  {member.isVisible ? 'Visible' : 'Oculto'}
                                </span>
                              </td>
                              {canEdit && (
                                <td className="p-2 text-center">
                                  <div className="flex justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleVisibility(member)}
                                      disabled={isBusy}
                                      className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                                      aria-label={`${member.isVisible ? 'Ocultar' : 'Mostrar'} a ${member.name}`}
                                    >
                                      <span className="material-symbols-outlined text-2xl">
                                        {member.isVisible ? 'visibility' : 'visibility_off'}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleEdit(member)}
                                      disabled={isBusy}
                                      className="text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
                                      aria-label={`Editar a ${member.name}`}
                                    >
                                      <span className="material-symbols-outlined text-2xl">edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(member)}
                                      disabled={isBusy}
                                      className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
                                      aria-label={`Eliminar a ${member.name}`}
                                    >
                                      <span className="material-symbols-outlined text-2xl">delete</span>
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })) : (
                        <tr>
                          <td colSpan={canEdit ? 8 : 7} className="px-6 py-12 text-center font-body-md text-on-surface-variant">
                            No se encontraron miembros del staff
                          </td>
                        </tr>
                      )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination footer */}
                  {sortedStaff.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center p-2 border-t border-outline-variant/20 gap-4">
                      <div className="text-label-sm text-on-surface-variant text-xs">
                        {sortedStaff.length === 0
                          ? 'No hay staff'
                          : `Mostrando ${(currentPage - 1) * pageSize + 1}-${Math.min(currentPage * pageSize, sortedStaff.length)} de ${sortedStaff.length}`}
                      </div>
                      <div className="flex items-center bg-surface-container-low rounded-lg px-2 py-1 border border-outline-variant/50 gold-border-focus gap-2">
                        <span className="text-label-sm text-on-surface-variant">Filas:</span>
                        <select
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
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
                          type="button"
                          onClick={handlePrevPage}
                          disabled={currentPage <= 1}
                          className="p-1 rounded hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        </button>
                        <div className="flex gap-0.5">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              type="button"
                              onClick={() => goToPage(page)}
                              className={`w-6 h-6 flex items-center justify-center rounded font-label-sm text-xs transition-colors ${
                                page === currentPage
                                  ? 'bg-primary text-on-primary'
                                  : 'hover:bg-surface-container-highest text-on-surface-variant'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleNextPage}
                          disabled={currentPage >= totalPages}
                          className="p-1 rounded hover:bg-surface-container-highest transition-colors text-on-surface-variant disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  )}
                    </div>
                  </div>
              </>
            )}

            {/* Load More Button (mobile) */}
            {currentPage < totalPages && (
              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="md:hidden w-full mt-6 py-3 px-4 bg-outline/10 text-primary font-label-md text-label-md rounded-lg hover:bg-outline/20 transition-colors uppercase tracking-widest border border-outline/20 disabled:opacity-50"
              >
                Cargar más (pág. {currentPage} de {totalPages})
              </button>
            )}
          </div>

      {canEdit && editingMember && (
        <StaffEditModal
          member={editingMember}
          onSave={handleSave}
          onCancel={handleCloseEdit}
          isSubmitting={isSubmitting}
        />
      )}

      {canEdit && (
        <button
          type="button"
          onClick={handleAddClick}
          className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-200 z-[60] cursor-pointer"
          aria-label="Agregar miembro"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>add</span>
        </button>
      )}
    </section>
  );
}

StaffManagementSection.propTypes = {
  onUpdate: PropTypes.func,
  staff: PropTypes.array,
  canEdit: PropTypes.bool,
  autoOpenAdd: PropTypes.bool,
  onAutoOpenAdd: PropTypes.func,
};

export default StaffManagementSection;
