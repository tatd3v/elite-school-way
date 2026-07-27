import { useEffect, useState } from 'preact/hooks'

export default function Header({ onOpenModal }) {
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
      className={`fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 transition-shadow ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="flex justify-between items-center h-20 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img 
            alt="Elite Way School Logo" 
            className="h-12 w-auto" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLuXcw0qGMJ6pITeTn94TSyqfCbzllwT6cPd7A6Mjns63rBxRp5XyQnMGQEpMo87owpMTEsMwQ7nHoGfJEMEiWRFByrz0hHwsgOVlcIx_vLSJ-_x116i-6Vec4HV6-s0K_L28ZKBg7Y0_OhRLbLQQaF78sWlfLV08Tcbzl1lWttsOvhyY_0nA4CaOqpxZSdq4CtzfDZ3Sj0S9xj5jcsohnTfbRSvQApDfQNGPEmZdMgJWUuuQNkqResbd33-"
          />
          <span className="font-headline text-headline-md font-bold tracking-tighter text-primary">
            ELITE WAY SCHOOL
          </span>
        </div>

        <nav className="hidden md:flex gap-8">
          <a 
            className="font-headline text-label-lg text-on-surface-variant hover:text-primary transition-colors uppercase" 
            href="#event"
          >
            EVENTO
          </a>
          <a 
            className="font-headline text-label-lg text-on-surface-variant hover:text-primary transition-colors uppercase" 
            href="#categories"
          >
            CATEGORÍAS
          </a>
          <a 
            className="font-headline text-label-lg text-on-surface-variant hover:text-primary transition-colors uppercase" 
            href="#rules"
          >
            REGLAMENTO
          </a>
        </nav>

        <button 
          className="bg-secondary text-on-secondary px-6 py-2.5 font-headline text-label-lg uppercase tracking-wider hover:bg-secondary/90 transition-all active:scale-95 rounded"
          onClick={onOpenModal}
        >
          Inscríbete Ya!
        </button>
      </div>
    </header>
  )
}
