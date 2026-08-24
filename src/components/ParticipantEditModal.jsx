import { useEffect, useState } from 'preact/hooks';
import PropTypes from 'prop-types';

function ParticipantEditModal({ participant, onSave, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    house: '',
    age: '',
    comments: '',
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        email: participant.email || '',
        phone: participant.phone || '',
        house: participant.house || '',
        age: participant.age || '',
        comments: participant.comments || '',
      });
    }
  }, [participant]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    onSave({
      ...participant,
      ...formData,
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
        aria-labelledby="participant-edit-title"
      >
        <div className="bg-primary p-4 flex justify-between items-center rounded-t-xl">
          <h3 id="participant-edit-title" className="font-headline-md text-white text-md">
            Editar Participante
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
            <label htmlFor="participant-edit-name" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Nombre Artístico
            </label>
            <input
              id="participant-edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
              required
            />
          </div>

          <div>
            <label htmlFor="participant-edit-email" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Email
            </label>
            <input
              id="participant-edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
              required
            />
          </div>

          <div>
            <label htmlFor="participant-edit-phone" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Teléfono
            </label>
            <input
              id="participant-edit-phone"
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
            />
          </div>

          <div>
            <label htmlFor="participant-edit-house" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              House / Linaje
            </label>
            <input
              id="participant-edit-house"
              type="text"
              value={formData.house}
              onChange={(e) => handleChange('house', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
            />
          </div>

          <div>
            <label htmlFor="participant-edit-age" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Edad
            </label>
            <input
              id="participant-edit-age"
              type="text"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md"
            />
          </div>

          <div>
            <label htmlFor="participant-edit-comments" className="block font-label-sm text-label-sm text-outline mb-1 uppercase tracking-tighter">
              Comentarios
            </label>
            <textarea
              id="participant-edit-comments"
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              rows={3}
              className="w-full p-3 rounded border border-outline-variant bg-surface focus:ring-1 focus:ring-primary outline-none font-body-md resize-none"
            />
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

ParticipantEditModal.propTypes = {
  participant: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    house: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    comments: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default ParticipantEditModal;
