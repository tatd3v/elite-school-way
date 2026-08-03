import { useState, useEffect } from 'preact/hooks'
import PropTypes from 'prop-types'
import { submitForm } from '../utils/formSubmit'
import { categories as categoryData } from '../data/categories'
import logo from '../assets/logo.png'
import logoDark from '../assets/logo_dark_bg.png'

export default function RegistrationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    phone: '',
    house: '',
    categories: [],
    age: '',
    comments: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [categoryError, setCategoryError] = useState(false)

  const categories = categoryData.map((category) => category.title)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
      await submitForm(formData)
      setSubmitStatus('success')
      
      setTimeout(() => {
        setFormData({
          artistName: '',
          email: '',
          phone: '',
          house: '',
          categories: [],
          age: '',
          comments: ''
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
        className="fixed top-6 right-6 z-[110] w-12 h-12 flex items-center justify-center bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-all rounded-full shadow-lg group active:scale-90"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">close</span>
      </button>

      <div className="w-full max-w-3xl mx-auto py-12 md:py-20 px-margin-mobile">
        <div className="text-center mb-10">
          <img 
            alt="Elite Way School Crest" 
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 object-contain block dark:hidden" 
            src={logo}
          />
          <img 
            alt="Elite Way School Crest" 
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 object-contain hidden dark:block drop-shadow-[0_0_15px_rgba(233,195,73,0.3)]" 
            src={logoDark}
          />
          <div className="flex flex-col items-center gap-1 mb-2">
            <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
              ELITE WAY SCHOOL
            </span>
            <p className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.2em]">
              FORMULARIO DE ADMISIÓN
            </p>
          </div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary uppercase font-extrabold tracking-tighter">
            CONFIRMAR INSCRIPCIÓN
          </h1>
          <div className="w-16 h-1 bg-secondary mx-auto mt-6"></div>
        </div>

        <form className="bg-surface-container-lowest p-6 md:p-12 border border-outline-variant/40 shadow-xl" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Nombre o AKA *
              </label>
              <input 
                className="w-full bg-transparent border border-outline-variant px-4 py-3 font-body-md focus:border-primary focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-primary transition-all"
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
                className="w-full bg-transparent border border-outline-variant px-4 py-3 font-body-md focus:border-primary focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-primary transition-all"
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
              <input 
                className="w-full bg-transparent border border-outline-variant px-4 py-3 font-body-md focus:border-primary focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-primary transition-all"
                placeholder="+57 300 000 0000"
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                House / 007
              </label>
              <input 
                className="w-full bg-transparent border border-outline-variant px-4 py-3 font-body-md focus:border-primary focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-primary transition-all"
                placeholder="Nombre de tu House o 007"
                type="text"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-8">
              <h3 className="font-headline-md text-headline-md text-primary mb-2 flex items-center gap-2">
                Categorías que competirás *
              </h3>
              <p className="text-sm text-on-surface-variant mb-6">
                Debes seleccionar al menos una categoría.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <label 
                    key={category}
                    className="flex items-center gap-3 cursor-pointer group p-3 hover:bg-surface-container-low border border-transparent hover:border-outline-variant/20 transition-all"
                  >
                    <input 
                      className="w-5 h-5 border-2 border-outline rounded-none text-secondary focus:ring-0"
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
              {categoryError && (
                <p className="mt-4 bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
                  Debes seleccionar al menos una categoría para continuar.
                </p>
              )}
            </div>

            <div className="col-span-1 mt-6">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Edad *
              </label>
              <input 
                className="w-full bg-transparent border border-outline-variant px-4 py-3 font-body-md focus:border-primary focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-primary transition-all"
                placeholder="18+"
                required
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-span-1 md:col-span-2 mt-6">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">
                Comentarios / Requerimientos
              </label>
              <textarea 
                className="w-full bg-transparent border border-outline-variant px-4 py-3 font-body-md focus:border-primary focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-primary transition-all resize-none"
                placeholder="Cualquier información adicional importante..."
                rows="4"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
              ></textarea>
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
                className="w-full bg-secondary text-on-secondary py-5 font-label-lg text-label-lg font-extrabold tracking-[0.25em] uppercase hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ENVIANDO...' : 'CONFIRMAR INSCRIPCIÓN'}
                {!isSubmitting && (
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                )}
              </button>
              <p className="mt-4 text-center text-label-sm font-label-sm text-on-surface-variant opacity-70">
                Al confirmar, aceptas las reglas y el código de conducta del Elite Way School Ball.
              </p>
            </div>
          </div>
        </form>

        <div className="mt-12 text-center pb-12">
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">
            © 2026 ELITE WAY SCHOOL - Ballroom Bogotrans.
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
