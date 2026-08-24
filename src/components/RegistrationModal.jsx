import { useState, useEffect, useRef } from 'preact/hooks'
import PropTypes from 'prop-types'
import { submitForm } from '../utils/formSubmit'
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
        className="w-[4.75rem] sm:w-24 h-full bg-surface-container-low border border-outline-variant pl-3 pr-1 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-left"
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
            className="w-full bg-surface-container-high border-b border-outline-variant px-4 py-2 font-body-md text-[#fbf9f8] placeholder:text-[#c6c5d4]/60 focus:outline-none"
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
                className="w-full flex items-center gap-2 px-4 py-2 text-left font-body-md text-[#fbf9f8] hover:bg-surface-container-high transition-all"
              >
                <span className="text-base" aria-hidden="true">{flag}</span>
                <span className="flex-1 truncate">{country}</span>
                <span className="text-[#c6c5d4]">{code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-2 text-sm text-[#c6c5d4]">No se encontraron resultados</p>
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
    <div className="col-span-1 md:col-span-2 mt-10 p-6 md:p-8 bg-surface-container-low border border-outline-variant/30 rounded-lg">
      <div className="mb-6">
        <h3 className="font-headline-md text-headline-md text-[#fbf9f8] mb-2">Pago por QR</h3>
        <p className="font-body-md text-[#c6c5d4] text-sm md:text-xs">Escanea el código QR para realizar el pago y sube el comprobante.</p>
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
          <label className="block font-label-lg text-label-lg text-[#c6c5d4] mb-2 uppercase tracking-wider">
            {PAYMENT_SCREENSHOT_LABEL}
          </label>
          <p className="font-body-md text-[#c6c5d4] text-sm md:text-xs mb-3">
            Debes cargar o subir el comprobante del pago para que el registro se haga efectivo.
          </p>
          <div className="flex flex-col gap-2 w-full min-w-0">
            <label className="cursor-pointer inline-flex items-center justify-center bg-surface-container-high border border-outline-variant px-6 py-3 rounded-md font-label-sm text-[#fbf9f8] hover:bg-surface-bright hover:text-surface transition-all w-full sm:w-auto text-center whitespace-nowrap shrink-0">
              <span>Seleccionar archivo</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="paymentScreenshot"
                onChange={handleFileChange}
              />
            </label>
            <span className="text-label-sm text-[#c6c5d4] opacity-60 truncate block w-full min-w-0">
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
            className="fixed top-6 right-6 z-[130] w-12 h-12 flex items-center justify-center text-[#c6c5d4] hover:text-[#c62828] transition-all rounded-full"
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await submitForm({
        ...formData,
        phone: `${formData.countryCode} ${formData.phone}`.trim(),
      })
      setSubmitStatus('success')

      setTimeout(() => {
        setFormData({
          artistName: '',
          email: '',
          countryCode: DEFAULT_COUNTRY_CODE,
          phone: '',
          house: '',
          entryType: '',
          age: '',
          paymentScreenshot: '',
          paymentScreenshotName: '',
        })
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
        className="fixed top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center bg-surface-container-high border border-outline-variant text-[#fbf9f8] hover:text-[#c62828] hover:border-[#c62828] transition-all rounded-full shadow-lg group active:scale-90"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">close</span>
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
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-[#fbf9f8]">
              ELITE WAY SCHOOL
            </span>
            <p className="font-label-sm text-label-sm text-[#c62828] uppercase tracking-[0.2em] font-bold">
              FORMULARIO DE ADMISIÓN
            </p>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#fbf9f8] uppercase font-extrabold tracking-tighter">
            CONFIRMAR INSCRIPCIÓN
          </h1>
          <div className="w-16 h-1 bg-[#c62828] mx-auto mt-6"></div>
        </div>

        <form className="bg-surface-container-lowest p-6 md:p-12 border border-outline-variant/30 rounded-lg shadow-[0px_8px_48px_rgba(0,0,0,0.4)]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-[#c6c5d4] mb-2 uppercase tracking-wider">
                Nombre Completo o AKA de Ballroom *
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="Escribe tu nombre de escena"
                required
                type="text"
                name="artistName"
                value={formData.artistName}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-[#c6c5d4] mb-2 uppercase tracking-wider">
                Email *
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="ejemplo@eliteway.edu"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-[#c6c5d4] mb-2 uppercase tracking-wider">
                Teléfono *
              </label>
              <div className="flex gap-2">
                <CountryCodeSelect
                  value={formData.countryCode}
                  onChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                />
                <input
                  className="flex-1 min-w-0 bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
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
              <label className="block font-label-sm text-label-sm text-[#c6c5d4] mb-2 uppercase tracking-wider">
                House / 007
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="Nombre de tu House o Independiente"
                type="text"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-8">
              <h3 className="font-headline-md text-headline-md text-[#fbf9f8] mb-2 flex items-center gap-2">
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
                      <span className={`font-body-md transition-colors ${isSelected ? 'text-[#fbf9f8]' : 'text-[#c6c5d4] group-hover:text-[#fbf9f8]'
                        }`}>
                        {option}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>



            <div className="col-span-1 mt-6">
              <label className="block font-label-sm text-label-sm text-[#c6c5d4] mb-2 uppercase tracking-wider">
                Edad *
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="18+"
                type="number"
                required
                min="18"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
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

              {submitStatus === 'error' && (
                <div className="mb-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
                  Error al enviar la inscripción. Por favor, inténtalo de nuevo.
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
              <p className="mt-4 text-center text-label-sm font-label-sm text-[#c6c5d4] opacity-70">
                Al confirmar, aceptas las reglas y el código de conducta de Elite Way School Kiki Ball
              </p>
            </div>
          </div>
        </form>

        <div className="mt-12 text-center">
          <p className="font-label-sm text-label-sm text-[#c6c5d4] opacity-60">
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
