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
  'w-full bg-[#070a2b] border border-[#232a63] focus:border-[#ff8a80] focus:ring-1 focus:ring-[#ff8a80] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 font-medium transition-all shadow-inner focus:outline-none';

function FieldLabel({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-bold uppercase tracking-wider text-slate-300"
    >
      {children}
      {required && <span className="text-[#ff8a80]"> *</span>}
    </label>
  );
}

FieldLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node,
  required: PropTypes.bool,
};

function InputIcon({ children }) {
  return (
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
      {children}
    </div>
  );
}

InputIcon.propTypes = {
  children: PropTypes.node,
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

  // Full-screen takeover (like RegistrationModal) — lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#070a2b]">
      <button
        className="fixed top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center bg-[#141a4a] border border-[#2a3674] text-slate-300 hover:text-white hover:border-[#ff8a80] transition-all rounded-full shadow-lg active:scale-90 disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={onCancel}
        aria-label={isSubmitting ? 'Guardando...' : 'Cerrar'}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-3xl">close</span>
        )}
      </button>

      <div className="w-full max-w-3xl mx-auto py-10 md:py-14 px-margin-mobile flex-1 flex flex-col">
        <div
          className="rounded-2xl border border-[#232a63] bg-[#0c1030]/90 shadow-xl overflow-hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="participant-edit-title"
        >
          <header className="bg-[#0c1030]/90 px-4 py-3.5 sm:px-6 flex items-center justify-between shrink-0 border-b border-[#232a63] select-none">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c62828] to-[#600200] border border-[#ffd54f]/40 flex items-center justify-center shadow-md shadow-[#c62828]/20">
                <span className="material-symbols-outlined text-[18px] text-[#ffd54f]">shield</span>
              </div>
              <h3 id="participant-edit-title" className="font-extrabold text-base tracking-wide text-slate-100">
                Editar Participante
              </h3>
            </div>
            {isPaid ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {REGISTRATION_STATUS.PAID}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-950/80 text-amber-300 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                {REGISTRATION_STATUS.REGISTERED}
              </span>
            )}
          </header>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <div className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2">
                <FieldLabel htmlFor="participant-edit-name" required>
                  Nombre Completo o AKA de Ballroom
                </FieldLabel>
                <div className="relative">
                  <InputIcon>
                    <span className="material-symbols-outlined text-lg text-amber-400/80">badge</span>
                  </InputIcon>
                  <input
                    id="participant-edit-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ej. Tats"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="participant-edit-email" required>
                  Correo Electrónico
                </FieldLabel>
                <div className="relative">
                  <InputIcon>
                    <span className="material-symbols-outlined text-lg text-amber-400/80">mail</span>
                  </InputIcon>
                  <input
                    id="participant-edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="participant-edit-phone" required>
                  Teléfono / WhatsApp
                </FieldLabel>
                <div className="flex gap-2">
                  <CountryCodeSelect
                    dark
                    value={formData.countryCode}
                    onChange={(code) => handleChange('countryCode', code)}
                  />
                  <div className="relative flex-1 min-w-0">
                    <InputIcon>
                      <span className="material-symbols-outlined text-lg text-amber-400/80">phone_iphone</span>
                    </InputIcon>
                    <input
                      id="participant-edit-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="300 000 0000"
                      className={`${inputClass} font-mono`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="participant-edit-house">
                  House / 007
                </FieldLabel>
                <div className="relative">
                  <InputIcon>
                    <span className="material-symbols-outlined text-lg text-amber-400/80">castle</span>
                  </InputIcon>
                  <input
                    id="participant-edit-house"
                    type="text"
                    value={formData.house}
                    onChange={(e) => handleChange('house', e.target.value)}
                    placeholder="Ej. 007 / House of Miyake Mugler"
                    className={`${inputClass} text-amber-200 font-semibold`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="participant-edit-instagram">
                  Instagram
                </FieldLabel>
                <div className="relative">
                  <InputIcon>
                    <span className="text-sm font-bold text-amber-400/80">@</span>
                  </InputIcon>
                  <input
                    id="participant-edit-instagram"
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => handleChange('instagram', normalizeInstagramHandle(e.target.value))}
                    placeholder="usuario"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="participant-edit-age" required>
                  Edad
                </FieldLabel>
                <div className="relative">
                  <InputIcon>
                    <span className="material-symbols-outlined text-lg text-amber-400/80">cake</span>
                  </InputIcon>
                  <input
                    id="participant-edit-age"
                    type="number"
                    min="10"
                    max="99"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="24"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="participant-edit-entry-type">
                Tipo de Entrada
              </FieldLabel>
              <div className="relative">
                <InputIcon>
                  <span className="material-symbols-outlined text-lg text-amber-400/80">confirmation_number</span>
                </InputIcon>
                <select
                  id="participant-edit-entry-type"
                  value={formData.entryType}
                  onChange={(e) => handleChange('entryType', e.target.value)}
                  // Tailwind's appearance-none only emits unprefixed
                  // `appearance: none` — older WebViews need -webkit- to
                  // actually hide the native arrow (it renders on top of the
                  // custom expand_more icon otherwise).
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" className="bg-[#070a2b] text-slate-100">Ninguna</option>
                  {ENTRY_TYPES.map(({ label, value }) => (
                    <option key={value} value={String(value)} className="bg-[#070a2b] text-slate-100">
                      {label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="participant-edit-screenshot">
                Comprobante de Pago
              </FieldLabel>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1 min-w-0">
                  <InputIcon>
                    <span className="material-symbols-outlined text-lg text-[#ffd54f]">link</span>
                  </InputIcon>
                  <input
                    id="participant-edit-screenshot"
                    type="text"
                    value={isDataUrlScreenshot ? (formData.paymentScreenshotName || 'Archivo adjunto') : formData.paymentScreenshot}
                    onChange={handleScreenshotUrlChange}
                    placeholder="URL del comprobante o archivo..."
                    className={`${inputClass} font-mono text-slate-200 truncate`}
                  />
                </div>
                <label
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#141a4a] hover:bg-[#1c235e] border border-[#c62828]/30 hover:border-[#ff8a80] rounded-xl text-xs font-semibold text-slate-200 cursor-pointer transition-all shrink-0 active:scale-95 shadow-sm"
                  title="Actualizar archivo"
                >
                  <span className="material-symbols-outlined text-base text-[#ff8a80]">upload_file</span>
                  <span>Reemplazar</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {formData.paymentScreenshot && !isDataUrlScreenshot && (
                  <a
                    href={formData.paymentScreenshot}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abrir comprobante en nueva pestaña"
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#141a4a] hover:bg-[#1c235e] border border-[#ffd54f]/40 hover:border-amber-300 rounded-xl text-xs font-semibold text-amber-300 hover:text-white transition-all shrink-0 active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base text-[#ffd54f]">open_in_new</span>
                    <span>Previsualizar</span>
                  </a>
                )}
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                <span className="material-symbols-outlined text-xs text-slate-500">shield</span>
                <span>Acepta archivos JPG, PNG o vínculos de Google Drive.</span>
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-4 bg-[#070a2b]/90 border-t border-[#232a63] flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#232a63] bg-[#141a4a] hover:bg-[#1c235e] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all text-center active:scale-95 shadow-sm disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#c62828] hover:bg-[#b71c1c] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#c62828]/40 transition-all duration-150 active:scale-95 border border-[#ff7961]/40 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
          </form>
        </div>
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
