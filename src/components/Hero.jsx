import PropTypes from 'prop-types'
import logo from '../assets/logo_dark_bg.png'
import heroBackground from '../assets/hero_background.png'

export default function Hero({ onOpenModal }) {
  return (
    <section 
      className="relative min-h-screen h-auto md:h-[90vh] flex items-center justify-center overflow-hidden bg-background dark:bg-[#000666] py-20"
      aria-labelledby="hero-heading"
      role="region"
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 dark:from-[#000666]/80 to-background/40 dark:to-[#000666]/40 z-10"></div>
        <img 
          className="w-full h-full object-cover grayscale-[0.3] brightness-[0.4]" 
          alt="Elite Way School Hero Background" 
          src={heroBackground}
        />
      </div>
      
      <div className="relative z-20 text-center px-4 md:px-margin-mobile max-w-4xl">
        <img 
          alt="Elite Way School Logo" 
          className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-8 drop-shadow-2xl animate-pulse" 
          src={logo}
        />
        
        <h1 
          id="hero-heading"
          className="font-display-lg text-3xl md:text-display-lg-mobile lg:text-display-lg text-white mb-3 md:mb-4 uppercase leading-tight"
        >
          BIENVENIDXS A LA LEGENDARIA<br />
          <span className="text-secondary-fixed">ELITE WAY SCHOOL</span>
        </h1>
        
        <p className="font-body-lg text-base md:text-body-lg text-primary-fixed mb-6 md:mb-12 max-w-2xl mx-auto">
          No pierdas la oportunidad de ser parte de la historia de Ballroom Colombia. Las admisiones están abiertas por tiempo limitado.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            className="bg-secondary text-on-secondary px-6 py-3 md:px-8 md:py-4 font-label-lg text-sm md:text-label-lg uppercase tracking-widest hover:bg-secondary/90 transition-all border border-secondary"
            onClick={onOpenModal}
            aria-label="Abrir formulario de inscripción"
          >
            Inscríbete Ya!
          </button>
          <a 
            className="bg-transparent border-2 border-white/30 text-white px-6 py-3 md:px-8 md:py-4 font-label-lg text-sm md:text-label-lg uppercase tracking-widest hover:bg-white/10 transition-all" 
            href="#event"
            aria-label="Ir a detalles del evento"
          >
            Explorar Evento
          </a>
        </div>
      </div>
    </section>
  )
}

Hero.propTypes = {
  onOpenModal: PropTypes.func.isRequired,
}
