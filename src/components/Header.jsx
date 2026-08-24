import { useEffect, useState } from 'preact/hooks'
import ThemeToggle from './ThemeToggle'
import longLogo from '../assets/long_logo.png'
import longLogoDark from '../assets/long_logo_dark_bg.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm dark:shadow-lg transition-shadow ${
        scrolled ? 'shadow-md dark:shadow-2xl' : ''
      }`}
    >
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-8 mx-auto">
        <div className="flex items-center gap-3">
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
        </div>

        <nav className="hidden md:flex gap-8">
          <a
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors"
            href="#event"
          >
            EVENTO
          </a>
          <a
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors"
            href="#staff"
          >
            STAFF
          </a>
          <a
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors"
            href="#categories"
          >
            CATEGORÍAS
          </a>
          <a
            className="font-label-lg text-label-lg text-on-surface-variant hover:text-secondary transition-colors"
            href="#rules"
          >
            REGLAMENTO
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
