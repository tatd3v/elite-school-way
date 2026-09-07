import { useEffect, useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import ThemeToggle from './ThemeToggle'
import longLogo from '../assets/long_logo.png'
import longLogoDark from '../assets/long_logo_dark_bg.png'

const NAV_LINKS = [
  { href: '#event', label: 'EVENTO' },
  { href: '#staff', label: 'STAFF' },
  { href: '#categories', label: 'CATEGORÍAS' },
  { href: '#dresscode', label: 'DRESS CODE' },
  { href: '#rules', label: 'REGLAMENTO' },
]

export default function Header({ onOpenModal }) {
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu whenever the route/hash changes (e.g. tapping a link)
  // and prevent background scroll while it's open.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm dark:shadow-lg transition-shadow ${
        scrolled ? 'shadow-md dark:shadow-2xl' : ''
      }`}
    >
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-8 mx-auto">
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="Elite Way School — Inicio"
          onClick={(e) => {
            // The header only ever renders on the home page, so clicking the
            // logo should just scroll back to the top instead of reloading.
            // Also explicitly reset the URL to "/" — without this, a
            // previously clicked section link (e.g. "#rules") stays in the
            // address bar even though we scroll away from it, making it
            // look like the click "did nothing".
            e.preventDefault()
            if (window.location.pathname !== '/' || window.location.hash) {
              window.history.pushState(null, '', '/')
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setIsMobileMenuOpen(false)
          }}
        >
          <img
            alt="Elite Way School Logo"
            className="h-12 w-auto block dark:hidden"
            src={longLogo}
          />
          <img
            alt="Elite Way School Logo"
            className="h-12 w-auto hidden dark:block"
            src={longLogoDark}
          />
          {/* <span className="font-headline-md text-headline-md font-bold tracking-tighter text-primary">
            ELITE WAY SCHOOL
          </span> */}
        </a>

        <nav className="hidden md:flex gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors"
              href={href}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 text-on-surface-variant hover:text-secondary transition-colors"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          className="md:hidden flex flex-col bg-surface border-t border-outline-variant/30 px-margin-mobile py-4 gap-1 shadow-md dark:shadow-2xl"
        >
          <button
            type="button"
            className="bg-secondary text-on-secondary font-label-lg text-label-lg uppercase tracking-widest py-3 px-2 mb-2 rounded-md hover:bg-secondary/90 transition-colors"
            onClick={() => {
              setIsMobileMenuOpen(false)
              onOpenModal()
            }}
            aria-label="Abrir formulario de inscripción"
          >
            Inscríbete Ya!
          </button>
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors py-3 px-2 rounded-md"
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

Header.propTypes = {
  onOpenModal: PropTypes.func.isRequired,
}
