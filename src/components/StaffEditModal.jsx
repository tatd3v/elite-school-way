import { useEffect, useState } from 'preact/hooks';
import PropTypes from 'prop-types';

function StaffEditModal({ member, onSave, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    photo: '',
    socialLinks: '',
    displayOrder: 0,
    isVisible: true,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        role: member.role || '',
        bio: member.bio || '',
        photo: member.photo || '',
        socialLinks: member.socialLinks || '',
        displayOrder: member.displayOrder || 0,
        isVisible: member.isVisible ?? true,
      });
    }
  }, [member]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.role.trim()) {
      return;
    }

    onSave({
      ...member,
      ...formData,
      displayOrder: Number(formData.displayOrder) || 0,
      isVisible: Boolean(formData.isVisible),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="luxury-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-edit-title"
      >
        <div className="bg-primary p-4 flex justify-between items-center rounded-t-xl">
          <h3 id="staff-edit-title" className="font-headline-md text-white text-md">
            Editar Miembro del Staff
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="staff-edit-name" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Nombre
            </label>
            <input
              id="staff-edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
              required
            />
          </div>

          <div>
            <label htmlFor="staff-edit-role" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Rol
            </label>
            <input
              id="staff-edit-role"
              type="text"
              value={formData.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
              required
            />
          </div>

          <div>
            <label htmlFor="staff-edit-bio" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Bio
            </label>
            <textarea
              id="staff-edit-bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={3}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md resize-none"
            />
          </div>

          <div>
            <label htmlFor="staff-edit-photo" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              URL de Foto
            </label>
            <input
              id="staff-edit-photo"
              type="url"
              value={formData.photo}
              onChange={(e) => handleChange('photo', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
            />
          </div>

          <div>
            <label htmlFor="staff-edit-social" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Redes Sociales
            </label>
            <input
              id="staff-edit-social"
              type="text"
              value={formData.socialLinks}
              onChange={(e) => handleChange('socialLinks', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="staff-edit-order" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
                Orden
              </label>
              <input
                id="staff-edit-order"
                type="number"
                min={0}
                value={formData.displayOrder}
                onChange={(e) => handleChange('displayOrder', e.target.value)}
                className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => handleChange('isVisible', e.target.checked)}
                  className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <span className="font-body-md text-on-surface">Visible</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded border border-outline-variant text-on-surface font-label-md uppercase tracking-wider hover:bg-surface-container transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded bg-secondary text-white font-label-md uppercase tracking-wider hover:bg-secondary/90 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

StaffEditModal.propTypes = {
  member: PropTypes.shape({
    id: PropTypes.string,
    rowIndex: PropTypes.number,
    name: PropTypes.string,
    role: PropTypes.string,
    bio: PropTypes.string,
    photo: PropTypes.string,
    socialLinks: PropTypes.string,
    displayOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isVisible: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default StaffEditModal;
