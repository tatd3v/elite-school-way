import ShareButton from './ShareButton'

export default function EventDetails() {
  return (
    <section
      className="relative py-12 md:py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto bg-surface-container-low dark:bg-surface-container border-b border-outline-variant/20"
      id="event"
    >
      <ShareButton label="Evento Elite Way School" sectionId="event" />
      <div className="text-center mb-12 relative">
        <span className="text-secondary font-label-lg text-label-lg tracking-[0.4em] uppercase mb-2 block">
          Información Oficial
        </span>
        <h2 className="font-display-lg text-3xl md:text-display-lg-mobile lg:text-display-lg text-primary uppercase leading-tight">
          DATOS DEL EVENTO
        </h2>
        <div className="w-24 h-1 bg-secondary mx-auto mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

        {/* Date Card */}
        <div className="flex flex-col gap-2 p-8 border-l-4 border-secondary bg-surface-container-lowest shadow-sm">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            Cuándo
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            17 DE OCTUBRE 2026
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Recepción: 6:00 PM
          </p>
        </div>

        {/* Venue Card */}
        <div className="flex flex-col gap-2 p-8 border-l-4 border-primary bg-surface-container-lowest shadow-sm">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
            Dónde
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            THE GAME DANCE STUDIO
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Kr 13 #56-72, Chapinero, Bogotá
          </p>
        </div>

        {/* Map Card */}
        <div className="flex flex-col gap-2 p-8 border-l-4 border-outline text-left bg-surface-container-lowest shadow-sm">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
            Ubicación
          </span>
          <a
            href="https://maps.app.goo.gl/GPzLik5eJuqEryjk9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-24 w-full bg-surface-variant/50 flex items-center justify-center rounded hover:bg-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary text-4xl">map</span>
            <span className="ml-2 font-label-lg">Ver en Mapa</span>
          </a>
        </div>

      </div>
    </section>
  )
}
