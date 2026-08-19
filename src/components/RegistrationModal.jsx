import { useState, useEffect } from 'preact/hooks'
import PropTypes from 'prop-types'
import { submitForm } from '../utils/formSubmit'
import { categories as categoryData } from '../data/categories'
import { countryCodes, DEFAULT_COUNTRY_CODE } from '../data/countryCodes'
import { PAYMENT_QR_IMAGE_URL, PAYMENT_SCREENSHOT_LABEL } from '../config/constants'
import logo from '../assets/logo.png'
import logoDark from '../assets/logo_dark_bg.png'

export default function RegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    countryCode: DEFAULT_COUNTRY_CODE,
    phone: '',
    house: '',
    categories: [],
    age: '',
    paymentScreenshot: '',
    paymentScreenshotName: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [categoryError, setCategoryError] = useState(false)
  const [qrLightboxOpen, setQrLightboxOpen] = useState(false)

  const categories = categoryData.map((category) => category.title)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        paymentScreenshot: reader.result,
        paymentScreenshotName: file.name,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  useEffect(() => {
    if (isOpen) {
      setCategoryError(false)
      setSubmitStatus(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (formData.categories.length > 0) {
      setCategoryError(false)
    }
  }, [formData.categories])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.categories.length === 0) {
      setCategoryError(true)
      return
    }

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
          categories: [],
          age: '',
          paymentScreenshot: '',
          paymentScreenshotName: '',
        })
        setSubmitStatus(null)
        setCategoryError(false)
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
                Nombre artístico *
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
                <select
                  className="flex-shrink-0 w-[4.75rem] sm:w-24 bg-surface-container-low border border-outline-variant pl-3 pr-1 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%3E%3Cpath%20fill%3D%22%23c6c5d4%22%20d%3D%22M1%201l5%205%205-5%22%20stroke%3D%22%23c6c5d4%22%20stroke-width%3D%221.5%22%20fill%3D%22none%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:10px]"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  aria-label="Código de país"
                >
                  {countryCodes.map(({ code, country }) => (
                    <option key={code} value={code} title={country}>
                      {code}
                    </option>
                  ))}
                </select>
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
              <h3 className="font-headline-md text-headline-md text-[#fbf9f8] mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c62828]">stars</span>
                Categorías de Competición
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const isChecked = formData.categories.includes(category)
                  return (
                    <label
                      key={category}
                      className={`flex items-center gap-3 cursor-pointer group p-3 border transition-all rounded-md ${
                        isChecked
                          ? 'bg-[#c62828]/10 border-[#c62828]/40'
                          : 'bg-surface-container-low hover:bg-surface-container-high border-outline-variant/10 hover:border-outline-variant/40'
                      }`}
                    >
                      <input
                        className="w-5 h-5 border-2 border-outline-variant bg-transparent rounded-sm text-[#c62828] focus:ring-0"
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className={`font-body-md transition-colors ${
                        isChecked ? 'text-[#fbf9f8]' : 'text-[#c6c5d4] group-hover:text-[#fbf9f8]'
                      }`}>
                        {category}
                      </span>
                    </label>
                  )
                })}
              </div>
              {categoryError && (
                <p className="mt-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
                  Debes seleccionar al menos una categoría para continuar.
                </p>
              )}
            </div>

            <div className="col-span-1 mt-6">
              <label className="block font-label-sm text-label-sm text-[#c6c5d4] mb-2 uppercase tracking-wider">
                Edad
              </label>
              <input
                className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 font-body-md text-[#fbf9f8] rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                placeholder="18+"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-10 p-6 md:p-8 bg-surface-container-low border border-outline-variant/30 rounded-lg">
              <div className="mb-6">
                <h3 className="font-headline-md text-headline-md text-[#fbf9f8] mb-2">Pago por QR</h3>
                <p className="font-body-md text-[#c6c5d4]">Escanea el código QR para realizar el pago y sube el comprobante.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="flex flex-col items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQrLightboxOpen(true)}
                    aria-label="Ver QR en pantalla completa"
                    className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-white rounded-sm border-0 cursor-pointer overflow-hidden transition-transform hover:scale-105"
                  >
                    <img
                      src={PAYMENT_QR_IMAGE_URL}
                      alt="Código QR de pago"
                      className="w-full h-full object-cover object-center scale-100"
                    />
                  </button>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setQrLightboxOpen(true)}
                      className="text-label-sm text-[#c62828] hover:underline uppercase tracking-wider bg-transparent border-0 p-0 cursor-pointer"
                    >
                      Ver en pantalla completa
                    </button>
                    <a
                      href={PAYMENT_QR_IMAGE_URL}
                      download="qr-pago-elite-way.jpg"
                      className="text-label-sm text-[#c62828] hover:underline uppercase tracking-wider"
                    >
                      Descargar
                    </a>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <label className="block font-label-lg text-label-lg text-[#c6c5d4] mb-2 uppercase tracking-wider">
                    {PAYMENT_SCREENSHOT_LABEL}
                  </label>
                  <p className="font-body-md text-[#c6c5d4] text-sm mb-3">
                    Debes cargar o subir el comprobante del pago para que el registro se haga efectivo.
                  </p>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-surface-container-high border border-outline-variant px-6 py-3 rounded-md font-label-sm text-[#fbf9f8] hover:bg-surface-bright hover:text-surface transition-all">
                      <span>Seleccionar archivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        name="paymentScreenshot"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <span className="text-label-sm text-[#c6c5d4] opacity-60">
                      {formData.paymentScreenshotName || 'Sin archivos seleccionados'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
                Al confirmar, aceptas las reglas y el código de conducta de Elite Way School Kiki Ball - Ballroom Bogotá.
              </p>
            </div>
          </div>
        </form>

        <div className="mt-12 text-center pb-12">
          <p className="font-label-sm text-label-sm text-[#c6c5d4] opacity-60">
            © 2026 ELITE WAY SCHOOL Ballroom Culture.
          </p>
        </div>
      </div>

      {qrLightboxOpen && (
        <div
          className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setQrLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Código QR en pantalla completa"
        >
          <button
            type="button"
            onClick={() => setQrLightboxOpen(false)}
            className="fixed top-6 right-6 z-[130] w-12 h-12 flex items-center justify-center text-[#c6c5d4] hover:text-[#c62828] transition-all rounded-full"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          <img
            src={PAYMENT_QR_IMAGE_URL}
            alt="Código QR de pago"
            className="max-w-[95vw] max-h-[90vh] w-auto h-auto object-contain rounded-lg bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

RegistrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
