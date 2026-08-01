import { useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import { submitForm } from '../utils/formSubmit'
import { categories as categoryData } from '../data/categories'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-md" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-surface w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-outline-variant/20 shadow-2xl p-8 md:p-12 rounded-2xl">
        <button 
          className="absolute top-4 right-4 text-outline hover:text-primary transition-colors"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-3xl">close</span>
        </button>

        <div className="text-center mb-10">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-[0.3em]">
            Formulario de Admisión
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-2">
            CONFIRMAR INSCRIPCIÓN
          </h2>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                Nombre artístico *
              </label>
              <input 
                className="border-silver focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low"
                placeholder="Ej: Legendarix Elite"
                required
                type="text"
                name="artistName"
                value={formData.artistName}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                Email *
              </label>
              <input 
                className="border-silver focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low"
                placeholder="correo@ejemplo.com"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                Teléfono *
              </label>
              <input 
                className="border-silver focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low"
                placeholder="300 000 0000"
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                House / 007
              </label>
              <input 
                className="border-silver focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low"
                placeholder="Casa de..."
                type="text"
                name="house"
                value={formData.house}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-2">
              Categorías de Competencia
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-outline-variant bg-surface-container-low">
              {categories.map((category) => (
                <label 
                  key={category}
                  className="flex items-center gap-2 font-label-sm text-on-surface-variant cursor-pointer"
                >
                  <input 
                    className="text-secondary focus:ring-secondary"
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col md:col-span-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                Edad
              </label>
              <input 
                className="border-silver focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low"
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col md:col-span-3">
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1">
                Comentarios / Requerimientos
              </label>
              <textarea 
                className="border-silver focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low"
                rows="2"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3">
              ¡Inscripción enviada exitosamente a la institución Elite Way!
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
              Error al enviar la inscripción. Por favor, inténtalo de nuevo.
            </div>
          )}

          <button 
            className="w-full bg-primary text-on-primary py-4 font-label-lg text-label-lg uppercase tracking-widest hover:bg-primary/90 transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar Inscripción'}
          </button>
        </form>
      </div>
    </div>
  )
}

RegistrationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
