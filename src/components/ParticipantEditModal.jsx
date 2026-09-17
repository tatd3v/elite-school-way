import { useEffect, useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import { normalizeInstagramHandle } from '../utils/instagram';
import { countryCodes, DEFAULT_COUNTRY_CODE } from '../data/countryCodes';
import { ENTRY_TYPES } from '../data/entryTypes';
import { REGISTRATION_STATUS } from '../config/constants';
import CountryCodeSelect from './CountryCodeSelect';

// The sheet stores phone as a single "+57 300 000 0000" string — split it
// back into dial code + local number for the picker's two fields. The
// longest code is matched first so e.g. "+1" can't eat "+1242" (Bahamas).
function splitPhone(phone) {
  const cleaned = String(phone || '').replace(/^'/, '').trim();
  const match = countryCodes
    .map(({ code }) => code)
    .sort((a, b) => b.length - a.length)
    .find((code) => cleaned.startsWith(code));
  if (!match) return { countryCode: DEFAULT_COUNTRY_CODE, phone: cleaned };
  return { countryCode: match, phone: cleaned.slice(match.length).trim() };
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl text-sm bg-[#0c1030] border border-[#232a63] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#fba592] focus:ring-1 focus:ring-[#fba592] transition-all';

function FieldLabel({ htmlFor, icon, children, badge }) {
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className="flex items-center space-x-1.5 text-[11px] font-bold tracking-wider text-amber-200/90 uppercase"
      >
        {typeof icon === 'string' ? (
          <span className="material-symbols-outlined text-[15px] text-[#ff8a80]">{icon}</span>
        ) : (
          icon
        )}
        <span>{children}</span>
      </label>
      {badge}
    </div>
  );
}

FieldLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
  badge: PropTypes.node,
};

function ParticipantEditModal({ participant, onSave, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: '',
    house: '',
    instagram: '',
    entryType: '',
    age: '',
    paymentScreenshot: '',
    paymentScreenshotName: '',
  });

  useEffect(() => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        email: participant.email || '',
        ...splitPhone(participant.phone),
        house: participant.house || '',
        instagram: normalizeInstagramHandle(participant.instagram),
        // The sheet stores the numeric price (or 'N/A'); map it back to the
        // matching option's value so the select shows the current entry.
        entryType: ENTRY_TYPES.some((o) => String(o.value) === String(participant.entryType))
          ? String(participant.entryType)
          : '',
        age: participant.age || '',
        paymentScreenshot: participant.screenshot || '',
        paymentScreenshotName: participant.screenshotName || '',
      });
    }
  }, [participant]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        paymentScreenshot: reader.result,
        paymentScreenshotName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotUrlChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      paymentScreenshot: e.target.value,
      paymentScreenshotName: '',
    }));
  };

  const isDataUrlScreenshot = formData.paymentScreenshot.startsWith('data:');
  const isPaid = participant?.status === REGISTRATION_STATUS.PAID;

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [formData.name, formData.email, formData.phone, formData.age];
    if (requiredFields.some((value) => !String(value || '').trim())) {
      return;
    }

    onSave({
      ...participant,
      ...formData,
      phone: `${formData.countryCode} ${formData.phone}`.trim(),
      entryType: formData.entryType ? Number(formData.entryType) : 'N/A',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/50"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] bg-[#0c1030] sm:rounded-2xl shadow-2xl border-0 sm:border sm:border-[#232a63] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="participant-edit-title"
      >
        <header className="bg-[#0b102b]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between shrink-0 border-b border-[#232d66] shadow-xl select-none">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c62828] to-[#600200] border border-[#ff5c45]/40 flex items-center justify-center shadow-md shadow-[#c62828]/20">
              <span className="material-symbols-outlined text-[18px] text-amber-200">military_tech</span>
            </div>
            <h3 id="participant-edit-title" className="font-extrabold text-base tracking-wide text-slate-100">
              Editar Participante
            </h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#141b44] hover:bg-[#1f2963] border border-[#2a3674] active:scale-95 transition-all text-slate-300 hover:text-white"
            aria-label="Cerrar formulario"
          >
            <span className="material-symbols-outlined text-lg font-bold">close</span>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 p-4 sm:p-5 flex flex-col space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#12183c] via-[#161f4d] to-[#12183c] border border-[#2b3874] shadow-inner mb-1">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPaid ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isPaid ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Estado de Registro</span>
            </div>
            {isPaid ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                {REGISTRATION_STATUS.PAID}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                {REGISTRATION_STATUS.REGISTERED}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="participant-edit-name"
              icon="person"
              badge={<span className="text-[10px] text-slate-400 font-mono">Requerido</span>}
            >
              Nombre Completo o AKA de Ballroom
            </FieldLabel>
            <input
              id="participant-edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej. Tats"
              className={`${inputClass} font-semibold tracking-wide`}
              required
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="participant-edit-email"
              icon="mail"
              badge={<span className="text-[10px] text-slate-400 font-mono">Requerido</span>}
            >
              Correo Electrónico
            </FieldLabel>
            <input
              id="participant-edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="usuario@dominio.com"
              className={inputClass}
              required
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="participant-edit-phone"
              icon="call"
              badge={<span className="text-[10px] text-slate-400 font-mono">Requerido</span>}
            >
              Teléfono / WhatsApp
            </FieldLabel>
            <div className="flex gap-2">
              <CountryCodeSelect
                dark
                value={formData.countryCode}
                onChange={(code) => handleChange('countryCode', code)}
              />
              <input
                id="participant-edit-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="300 000 0000"
                className={`${inputClass} font-medium tracking-wide flex-1 min-w-0`}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="participant-edit-house" icon="shield">
              House / Linaje
            </FieldLabel>
            <input
              id="participant-edit-house"
              type="text"
              value={formData.house}
              onChange={(e) => handleChange('house', e.target.value)}
              placeholder="Nombre de linaje o casa"
              className={`${inputClass} font-bold tracking-wider`}
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel htmlFor="participant-edit-entry-type" icon="confirmation_number">
              Entrada del Evento
            </FieldLabel>
            <div className="relative">
              <select
                id="participant-edit-entry-type"
                value={formData.entryType}
                onChange={(e) => handleChange('entryType', e.target.value)}
                className={`${inputClass} font-medium appearance-none pr-10 cursor-pointer`}
              >
                <option value="" disabled>Seleccionar entrada</option>
                {ENTRY_TYPES.map(({ label, value }) => (
                  <option key={value} value={String(value)} className="bg-[#0c1030] text-slate-100">
                    {label}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 space-y-1.5">
              <FieldLabel
                htmlFor="participant-edit-instagram"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px] text-[#ff8a80]">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                }
              >
                Instagram
              </FieldLabel>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm text-slate-400 font-semibold pointer-events-none select-none">@</span>
                <input
                  id="participant-edit-instagram"
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => handleChange('instagram', normalizeInstagramHandle(e.target.value))}
                  placeholder="usuario"
                  className={`${inputClass} pl-8 font-medium`}
                />
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <FieldLabel
                htmlFor="participant-edit-age"
                icon="cake"
                badge={<span className="text-[10px] text-slate-400 font-mono">Requerido</span>}
              >
                Edad
              </FieldLabel>
              <input
                id="participant-edit-age"
                type="number"
                min="10"
                max="99"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="24"
                className={`${inputClass} font-semibold text-center`}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="participant-edit-screenshot"
              icon="receipt_long"
              badge={formData.paymentScreenshot && (
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">check_circle</span>
                  Confirmado
                </span>
              )}
            >
              Comprobante de Pago
            </FieldLabel>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 flex items-center min-w-0">
                <span className="absolute left-3 material-symbols-outlined text-slate-400 text-[18px] pointer-events-none">attach_file</span>
                <input
                  id="participant-edit-screenshot"
                  type="text"
                  value={isDataUrlScreenshot ? (formData.paymentScreenshotName || 'Archivo adjunto') : formData.paymentScreenshot}
                  onChange={handleScreenshotUrlChange}
                  placeholder="URL del comprobante o archivo..."
                  className={`${inputClass} pl-9 pr-3 font-mono text-xs sm:text-sm truncate`}
                />
              </div>
              <label
                className="h-10 px-3 flex-shrink-0 flex items-center justify-center space-x-1.5 rounded-xl bg-[#18214f] hover:bg-[#222e6b] border border-[#2e3e86] text-amber-200 hover:text-white transition-all duration-150 active:scale-95 shadow-sm text-xs font-semibold cursor-pointer"
                title="Actualizar archivo"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span className="hidden sm:inline">Subir</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div className="pt-3 pb-1 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#c62828] via-[#d32f2f] to-[#b71c1c] hover:brightness-110 active:scale-[0.99] text-white font-extrabold text-sm tracking-wide rounded-xl shadow-lg shadow-[#c62828]/40 border border-[#ff7961]/40 transition-all duration-150 flex items-center justify-center space-x-2 group disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">save</span>
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#101638]/80 hover:bg-[#18204e] border border-[#27336e] active:scale-[0.99] text-slate-300 hover:text-white font-semibold text-sm tracking-wide rounded-xl transition-all duration-150 flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base text-slate-400">close</span>
              <span>Cancelar</span>
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
    instagram: PropTypes.string,
    entryType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    comments: PropTypes.string,
    screenshot: PropTypes.string,
    screenshotName: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default ParticipantEditModal;
