import { useState, useEffect, useRef } from 'preact/hooks'
import PropTypes from 'prop-types'
import { countryCodes } from '../data/countryCodes'

/**
 * Shared dialing-code dropdown. `dark` switches to the hardcoded navy
 * palette used by ParticipantEditModal (which is always dark regardless of
 * the admin light theme); otherwise it uses the regular surface tokens.
 */
export default function CountryCodeSelect({ value, onChange, dark = false }) {
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

  const buttonClass = dark
    ? 'w-[4.75rem] sm:w-24 h-full bg-[#0c1030] border border-[#232a63] pl-3 pr-1 py-2.5 text-sm text-slate-100 rounded-xl focus:border-[#fba592] focus:ring-1 focus:ring-[#fba592] focus:outline-none transition-all text-left'
    : 'w-[4.75rem] sm:w-24 h-full bg-surface-container-low border border-outline-variant pl-3 pr-1 py-3 font-body-md text-on-surface rounded-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-left'

  const menuClass = dark
    ? 'absolute left-0 top-full mt-1 w-64 max-h-72 bg-[#151939] border border-[#232a63] rounded-xl shadow-lg overflow-hidden z-50 flex flex-col'
    : 'absolute left-0 top-full mt-1 w-64 max-h-72 bg-surface-container-low border border-outline-variant rounded-md shadow-lg overflow-hidden z-50 flex flex-col'

  const searchClass = dark
    ? 'w-full bg-[#0c1030] border-b border-[#232a63] px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none'
    : 'w-full bg-surface-container-high border-b border-outline-variant px-4 py-2 font-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none'

  const optionClass = dark
    ? 'w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-slate-100 hover:bg-[#1e2450] transition-all'
    : 'w-full flex items-center gap-2 px-4 py-2 text-left font-body-md text-on-surface hover:bg-surface-container-high transition-all'

  return (
    <div ref={selectRef} className="relative flex-shrink-0">
      <button
        type="button"
        className={buttonClass}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Código de país"
        aria-expanded={isOpen}
      >
        {value}
      </button>
      {isOpen && (
        <div className={menuClass}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país o código"
            className={searchClass}
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
                className={optionClass}
              >
                <span className="text-base" aria-hidden="true">{flag}</span>
                <span className="flex-1 truncate">{country}</span>
                <span className={dark ? 'text-slate-400' : 'text-on-surface-variant'}>{code}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className={`px-4 py-2 text-sm ${dark ? 'text-slate-400' : 'text-on-surface-variant'}`}>No se encontraron resultados</p>
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
  dark: PropTypes.bool,
}
