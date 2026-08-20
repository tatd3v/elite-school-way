import { useState, useEffect, useCallback } from 'preact/hooks';
import PropTypes from 'prop-types';
import { dashboardService } from '../services/dashboardService';
import StaffEditModal from './StaffEditModal';

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

function StaffManagementSection({ onUpdate, staff: initialStaff = [], canEdit = false }) {
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

  const toggleBio = (id) =>
    setExpandedBios((prev) => ({ ...prev, [id]: !prev[id] }));

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

  const handleAddClick = () => {
    const visibleOrders = staff
      .filter((m) => m.isVisible)
      .map((m) => Number(m.displayOrder) || 0);
    const nextOrder = visibleOrders.length > 0 ? Math.max(...visibleOrders) + 1 : 1;

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
  };

  const handleSaveEdit = async (updated) => {
    setIsSubmitting(true);
    setActionError(null);

    try {
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

  const sortedStaff = [...staff].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="mb-section-gap-mobile">
      <div className="luxury-card rounded-xl overflow-hidden">

        <div className="p-5">
          {actionError && (
            <div className="mb-4 p-3 rounded bg-error-container text-error text-sm font-body-md" role="alert">
              {actionError}
            </div>
          )}
          {actionSuccess && (
            <div className="mb-4 p-3 rounded bg-primary-fixed text-on-primary-fixed text-sm font-body-md" role="status">
              {actionSuccess}
            </div>
          )}

          <div className="space-y-4">
            <div className="md:hidden flex items-center justify-between mb-2">
              <h2 className="font-headline-md text-headline-md text-on-surface">Staff</h2>
              <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
            </div>

            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                <p className="text-on-surface-variant text-label-sm">Cargando...</p>
              </div>
            ) : (
              <>
                {/* Mobile card list */}
                <div className="md:hidden space-y-4">
                  {sortedStaff.map((member) => {
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
                              src={member.photo}
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

                {/* Desktop row list */}
                <div className="hidden md:block space-y-4">
                  {sortedStaff.map((member) => {
                    const color = getRoleColor(member.role);
                    const isBusy = togglingId === member.id || deletingId === member.id;
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 py-2 ${member.isVisible ? '' : 'opacity-60'}`}
                      >
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center border border-outline-variant/20 flex-shrink-0">
                          {typeof member.photo === 'string' && member.photo.trim() !== '' && !photoErrors[member.id] ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={() =>
                                setPhotoErrors((prev) => ({ ...prev, [member.id]: true }))
                              }
                            />
                          ) : (
                            <span className={`material-symbols-outlined text-${color}`}>{getRoleIcon(member.role)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-[10px] font-bold text-${color} uppercase tracking-widest`}>{member.role}</p>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${
                                member.isVisible
                                  ? 'bg-primary/10 text-primary border-primary/20'
                                  : 'bg-outline/10 text-outline border-outline/20'
                              }`}
                            >
                              {member.isVisible ? 'Visible' : 'Oculto'}
                            </span>
                          </div>
                          <p className="font-body-md text-sm font-semibold text-on-surface truncate">{member.name}</p>
                          {member.bio && (
                            <BioWithToggle
                              bio={member.bio}
                              isExpanded={!!expandedBios[member.id]}
                              onToggle={() => toggleBio(member.id)}
                              className="text-on-surface-variant text-xs"
                            />
                          )}
                          <div className="flex items-center gap-3 text-outline text-[11px] mt-0.5">
                            <span>Orden: {member.displayOrder ?? '—'}</span>
                            {member.socialLinks && (
                              <a
                                href={getSocialUrl(member.socialLinks)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate max-w-[160px] text-primary hover:text-secondary transition-colors"
                              >
                                {getSocialHandle(member.socialLinks)}
                              </a>
                            )}
                          </div>
                        </div>

                        {canEdit && (
                          <>
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
                              className="text-outline hover:text-primary transition-colors flex-shrink-0 disabled:opacity-50"
                              aria-label={`Editar a ${member.name}`}
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(member)}
                              disabled={isBusy}
                              className="text-outline hover:text-error transition-colors flex-shrink-0 disabled:opacity-50"
                              aria-label={`Eliminar a ${member.name}`}
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {canEdit && (
            <button
              onClick={onUpdate}
              className="w-full mt-6 bg-secondary text-white py-4 font-label-lg text-label-lg rounded active:scale-[0.98] transition-transform uppercase tracking-widest"
            >
              Actualizar
            </button>
          )}
        </div>
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
};

export default StaffManagementSection;
