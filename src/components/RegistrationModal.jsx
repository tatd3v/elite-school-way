import { useState, useEffect, useRef } from 'preact/hooks'
import PropTypes from 'prop-types'
import { submitForm } from '../utils/formSubmit'
import { dashboardService } from '../services/dashboardService'
import { countryCodes, DEFAULT_COUNTRY_CODE } from '../data/countryCodes'
import { PAYMENT_QR_IMAGE_URL, PAYMENT_SCREENSHOT_LABEL } from '../config/constants'
import logo from '../assets/logo.png'
import logoDark from '../assets/logo_dark_bg.png'

function CountryCodeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const selectRef = useRef(null)

  const normalize = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\+/g, '')

  const filtered = (search
    ? countryCodes.filter(({ country, code }) => {
      const query = normalize(search)
      return normalize(country).includes(query) || normalize(code).includes(query)
    })
    : countryCodes
  ).slice().sort((a, b) => {
    if (a.country === 'Colombia') return -1
    if (b.country === 'Colombia') return 1
    return parseInt(a.code.replace('+', ''), 10) - parseInt(b.code.replace('+', ''), 10)
  })

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={selectRef} className="relative flex-shrink-0">
      <button
        type="button"
        className="w-[4.75rem] sm:w-24 h-full bg-surface-container-low border border-outline-variant pl-3 pr-1 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-left"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Código de país"
        aria-expanded={isOpen}
      >
        {value}
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 max-h-72 bg-surface-container-low border border-outline-variant rounded-md shadow-lg overflow-hidden z-50 flex flex-col">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país o código"
            className="w-full bg-surface-container-high border-b border-outline-variant px-4 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            aria-label="Buscar país"
          />
          <div className="overflow-y-auto">
            {filtered.map(({ code, country, flag }) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  onChange(code)
                  setSearch('')
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-left font-body-md text-on-surface hover:bg-surface-container-high transition-all"
              >
                <span className="text-base" aria-hidden="true">{flag}</span>
                <span className="flex-1 truncate">{country}</span>
                <span className="text-on-surface-variant">{code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-2 text-sm text-on-surface-variant">No se encontraron resultados</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

CountryCodeSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

function QrPayment({ screenshotName, onScreenshotChange, qrImageUrl }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      onScreenshotChange(reader.result, file.name)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="col-span-1 md:col-span-2 p-6 md:p-8 bg-surface-container-low border border-outline-variant/30 rounded-lg">
      <div className="mb-6">
        <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Pago por QR</h3>
        <p className="font-body-md text-on-surface-variant text-sm md:text-xs">Escanea el código QR para realizar el pago y sube el comprobante.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Ver QR en pantalla completa"
            className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-white rounded-sm border-0 cursor-pointer overflow-hidden transition-transform hover:scale-105"
          >
            <img
              src={qrImageUrl}
              alt="Código QR de pago"
              className="w-full h-full object-cover object-center scale-100"
            />
          </button>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="text-label-sm text-[#c62828] hover:underline uppercase tracking-wider bg-transparent border-0 p-0 cursor-pointer"
            >
              Ver en pantalla completa
            </button>
            <a
              href={qrImageUrl}
              download="qr-pago-elite-way.jpg"
              className="text-label-sm text-[#c62828] hover:underline uppercase tracking-wider"
            >
              Descargar
            </a>
          </div>
        </div>
        <div className="flex-1 w-full min-w-0">
          <label className="block font-label-lg text-label-lg text-on-surface-variant mb-2 uppercase tracking-wider">
            {PAYMENT_SCREENSHOT_LABEL}
          </label>
          <p className="font-body-md text-on-surface-variant text-sm md:text-xs mb-3">
            Debes cargar o subir el comprobante del pago para que el registro se haga efectivo.
          </p>
          <div className="flex flex-col gap-2 w-full min-w-0">
            <label className="cursor-pointer inline-flex items-center justify-center bg-surface-container-high border border-outline-variant px-6 py-3 rounded-md font-label-sm text-on-surface hover:bg-surface-bright hover:text-surface transition-all w-full sm:w-auto text-center whitespace-nowrap shrink-0">
              <span>Seleccionar archivo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="paymentScreenshot"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-label-sm text-on-surface-variant opacity-60 truncate block w-full min-w-0">
              {screenshotName || 'Sin archivos seleccionados'}
            </span>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Código QR en pantalla completa"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="fixed top-6 right-6 z-[130] w-12 h-12 flex items-center justify-center text-on-surface-variant hover:text-[#c62828] transition-all rounded-full"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          <img
            src={qrImageUrl}
            alt="Código QR de pago"
            className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

QrPayment.propTypes = {
  screenshotName: PropTypes.string.isRequired,
  onScreenshotChange: PropTypes.func.isRequired,
  qrImageUrl: PropTypes.string.isRequired,
}

export default function RegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: '',
    house: '',
    instagram: '',
    entryType: '',
    age: '',
    paymentScreenshot: '',
    paymentScreenshotName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (isOpen) {
      setSubmitStatus(null)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const resetForm = () => {
    setFormData({
      artistName: '',
      email: '',
      countryCode: DEFAULT_COUNTRY_CODE,
      phone: '',
      house: '',
      instagram: '',
      entryType: '',
      age: '',
      paymentScreenshot: '',
      paymentScreenshotName: '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Belt-and-suspenders check on top of the inputs' own `required`
    // attribute: shows a styled, Spanish notification consistent with the
    // rest of this form instead of relying only on the browser's native
    // (inconsistently styled, English-in-some-browsers) validation tooltip.
    const requiredFields = [formData.artistName, formData.email, formData.phone, formData.age]
    const hasMissingField = requiredFields.some((value) => !String(value || '').trim())
    if (hasMissingField) {
      setSubmitStatus('missing-fields')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    const phone = `${formData.countryCode} ${formData.phone}`.trim()

    try {
      // Check for an existing registration by email or phone before
      // creating a new one. If found, don't submit a duplicate row — the
      // person just uses this same form's own "Pago por QR" field to
      // (re)attach their payment screenshot to the existing registration
      // instead of creating a second one.
      const existing = await dashboardService.checkRegistrationExists(formData.email, phone)
      if (existing?.exists) {
        if (existing.hasScreenshot) {
          setSubmitStatus('duplicate-has-screenshot')
          return
        }

        if (!formData.paymentScreenshot) {
          setSubmitStatus('duplicate-needs-screenshot')
          return
        }

        await dashboardService.attachPaymentScreenshot({
          rowIndex: existing.rowIndex,
          email: existing.email,
          phone: existing.phone,
          paymentScreenshot: formData.paymentScreenshot,
        })

        // The POST is fire-and-forget (mode: 'no-cors'), so a stale
        // deployment or a Drive permission error would look like success.
        // Re-check the row to make sure the screenshot was actually saved.
        await new Promise((resolve) => setTimeout(resolve, 800))
        const afterAttach = await dashboardService.checkRegistrationExists(formData.email, phone)
        if (!afterAttach?.hasScreenshot) {
          setSubmitStatus('attach-failed')
          return
        }

        setSubmitStatus('duplicate-added')
        setTimeout(() => {
          resetForm()
          setSubmitStatus(null)
          onClose()
        }, 2500)
        return
      }

      await submitForm({
        ...formData,
        phone,
      })
      setSubmitStatus('success')

      setTimeout(() => {
        resetForm()
        setSubmitStatus(null)
        onClose()
      }, 2000)
    } catch (error) {
      setSubmitStatus('error')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-surface">
      <button
        className="fixed top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center bg-surface-container-high border border-outline-variant text-on-surface hover:text-[#c62828] hover:border-[#c62828] transition-all rounded-full shadow-lg group active:scale-90 disabled:opacity-70 disabled:cursor-not-allowed"
        onClick={onClose}
        aria-label={isSubmitting ? 'Enviando...' : 'Cerrar'}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
        ) : (
          <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">close</span>
        )}
      </button>

      <div className="w-full max-w-3xl mx-auto py-12 md:py-20 px-margin-mobile">
        <div className="text-center mb-10">
          <img
            alt="Elite Way School Crest"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 object-contain filter brightness-110 contrast-125 block dark:hidden"
            src={logo}
          />
          <img
            alt="Elite Way School Crest"
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 object-contain filter brightness-110 contrast-125 hidden dark:block drop-shadow-[0_0_15px_rgba(233,195,73,0.3)]"
            src={logoDark}
          />
          <div className="flex flex-col items-center gap-1 mb-2">
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-on-surface">
              ELITE WAY SCHOOL
            </span>
            <p className="font-label-sm text-label-sm text-[#c62828] uppercase tracking-[0.2em] font-bold">
              FORMULARIO DE ADMISIÓN
            </p>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface uppercase font-extrabold tracking-tighter">
            CONFIRMAR INSCRIPCIÓN
          </h1>
          <div className="w-16 h-1 bg-[#c62828] mx-auto mt-6"></div>
        </div>

        <form className={`bg-surface-container-lowest p-6 md:p-12 border border-outline-variant/30 rounded-lg shadow-[0px_8px_48px_rgba(0,0,0,0.4)] ${isSubmitting ? 'pointer-events-none' : ''}`} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Nombre Completo o AKA de Ballroom *
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="Escribe tu nombre de escena"
                required
                type="text"
                name="artistName"
                value={formData.artistName}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Email *
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="ejemplo@eliteway.edu"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Teléfono *
              </label>
              <div className="flex gap-2">
                <CountryCodeSelect
                  value={formData.countryCode}
                  onChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                />
                <input
                  className="flex-1 min-w-0 bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="300 000 0000"
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                House / 007 / Espectadorx
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="House, 007 o espectadorx"
                type="text"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1 mt-6">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Instagram
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="@tu_usuario"
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1 mt-6">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Edad *
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="18+"
                type="number"
                required
                min="18"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-8">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c62828]">confirmation_number</span>
                Entrada del Evento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['General — $20.000', 'Personas negrxs y marronxs — $15.000'].map((option) => {
                  const isSelected = formData.entryType === option
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-3 cursor-pointer group p-3 border transition-all rounded-md ${isSelected
                          ? 'bg-[#c62828]/10 border-[#c62828]/40'
                          : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant/10 hover:border-outline-variant/40'
                        }`}
                    >
                      <input
                        className="w-5 h-5 border-2 border-outline-variant bg-transparent rounded-full text-[#c62828] focus:ring-0"
                        type="radio"
                        name="entryType"
                        value={option}
                        checked={isSelected}
                        onChange={handleInputChange}
                      />
                      <span className={`font-body-md transition-colors ${isSelected ? 'text-on-surface' : 'text-on-surface-variant group-hover:text-on-surface'
                        }`}>
                        {option}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 mb-4 px-2">
              <div className="flex items-start gap-2 text-on-surface-variant opacity-80">
                <span className="material-symbols-outlined text-label-sm">info</span>
                <p className="text-sm font-bold leading-relaxed">
                  Si no se confirma el pago con el comprobante antes del 15 de Octubre, no se podra pagar el precio de preventa en taquilla. El día del evento el costo de la entrada será de $5,000 adicionales.
                </p>
              </div>
            </div>

            <QrPayment
              screenshotName={formData.paymentScreenshotName}
              onScreenshotChange={(dataUrl, name) => setFormData(prev => ({
                ...prev,
                paymentScreenshot: dataUrl,
                paymentScreenshotName: name,
              }))}
              qrImageUrl={PAYMENT_QR_IMAGE_URL}
            />

            <div className="col-span-1 md:col-span-2 mt-10">
              {submitStatus === 'success' && (
                <div className="mb-4 bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-3 rounded">
                  ¡Inscripción enviada exitosamente a la institución Elite Way!
                </div>
              )}

              {submitStatus === 'duplicate-added' && (
                <div className="mb-4 bg-green-900/20 border border-green-500/50 text-green-400 px-4 py-3 rounded">
                  ¡Ya estabas registradx! Agregamos tu comprobante de pago a tu inscripción existente.
                </div>
              )}

              {submitStatus === 'duplicate-needs-screenshot' && (
                <div className="mb-4 bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 px-4 py-3 rounded">
                  Ya estás registradx con este email o teléfono. Sube tu comprobante de pago en la sección &ldquo;Pago por QR&rdquo; y vuelve a confirmar para agregarlo a tu inscripción.
                </div>
              )}

              {submitStatus === 'duplicate-has-screenshot' && (
                <div className="mb-4 bg-blue-900/20 border border-blue-500/50 text-blue-300 px-4 py-4 rounded space-y-3">
                  <p>Ya estás registradx con este email o teléfono, y ya tenemos tu comprobante de pago registrado.</p>
                  <p>Si necesitas realizar un cambio, contacta a las personas que administran el sitio web:</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://www.instagram.com/theeliteway_b"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:underline"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                      <span>Instagram: theeliteway_b</span>
                    </a>
                    <a href="tel:+573337380581" className="flex items-center gap-2 hover:underline">
                      <span className="material-symbols-outlined text-base flex-shrink-0">call</span>
                      <span>Teléfono: +57 333 738 0581</span>
                    </a>
                    <a
                      href="https://wa.me/573337380581"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:underline"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4 flex-shrink-0">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.05c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.18-4.94-4.37-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.81 2 .88 2.15.07.15.12.32.02.52-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.66.78 1.94.92.29.15.48.22.55.34.07.13.07.72-.17 1.4z"></path>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {submitStatus === 'missing-fields' && (
                <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
                  Por favor completa todos los campos requeridos (marcados con *) antes de continuar.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
                  Error al enviar la inscripción. Por favor, inténtalo de nuevo.
                </div>
              )}

              {submitStatus === 'attach-failed' && (
                <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
                  No se pudo guardar el comprobante. Asegúrate de que el script de Apps Script esté desplegado y tenga permisos de Google Drive.
                </div>
              )}

              <button
                className="w-full bg-[#c62828] text-[#ffffff] py-5 font-label-lg text-label-lg font-extrabold tracking-[0.25em] uppercase hover:bg-surface-bright hover:text-surface transition-all duration-500 flex items-center justify-center gap-3 group rounded-md"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ENVIANDO...' : 'CONFIRMAR INSCRIPCIÓN'}
                {!isSubmitting && (
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                )}
              </button>
              <p className="mt-4 text-center text-label-sm font-label-sm text-on-surface-variant opacity-70">
                Al confirmar, aceptas las reglas y el código de conducta de Elite Way School Kiki Ball
              </p>
            </div>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">
            © 2026 ELITE WAY SCHOOL - Ballroom Xua & Ballroom Bogotrans..
          </p>
        </div>
      </div>
    </div>
  )
}

RegistrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
