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
            Apertura de puertas: 7:30 PM
            <br />
            Inicio del evento: 8:00 PM
          </p>
        </div>

        {/* Venue Card */}
        <div className="flex flex-col gap-2 p-8 border-l-4 border-primary bg-surface-container-lowest shadow-sm md:col-span-2">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
            Dónde
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            THE GAME DANCE STUDIO
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Kr 13 #56-72, Chapinero, Bogotá
          </p>
          <a
            href="https://maps.app.goo.gl/GPzLik5eJuqEryjk9"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 min-h-24 w-full bg-surface-variant/50 flex items-center justify-center rounded hover:bg-surface-variant transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-primary text-4xl">map</span>
            <span className="ml-2 font-label-lg">Ver en Mapa</span>
          </a>
        </div>

        {/* Price Card */}
        <div className="flex flex-col gap-2 p-8 border-l-4 border-secondary text-left bg-surface-container-lowest shadow-sm md:col-span-3">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
            Entradas
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface font-bold uppercase mb-2">
            Precio de Entradas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-on-surface-variant font-body-md text-body-md">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider block">
                Preventa
              </span>
              <ul className="mt-1 space-y-1 font-body-md">
                <li className="flex items-start gap-1.5">
                  <span className="text-secondary font-bold">•</span>
                  <span><strong className="text-on-surface">$15.000</strong> personas negrxs, trans y marronxs.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-secondary font-bold">•</span>
                  <span><strong className="text-on-surface">$20.000</strong> general</span>
                </li>
              </ul>
            </div>
            <div className="border-t border-outline-variant/30 pt-6 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-6">
              <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider block">
                Taquilla
              </span>
              <ul className="mt-1 space-y-1 font-body-md">
                <li className="flex items-start gap-1.5">
                  <span className="text-secondary font-bold">•</span>
                  <span><strong className="text-on-surface">$20.000</strong> personas negrxs, trans y marronxs.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-secondary font-bold">•</span>
                  <span><strong className="text-on-surface">$25.000</strong> general</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Rules & Health Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:col-span-3">

          {/* Rules Card */}
          <div className="flex flex-col gap-2 p-8 border-l-4 border-secondary text-left bg-surface-container-lowest shadow-sm">
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">
              Normativa
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold uppercase mb-2">
              Reglas Importantes
            </h2>
            <div className="space-y-4 text-on-surface-variant font-body-md text-body-md">
              <ul className="mt-1 space-y-2 font-body-md">
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">•</span>
                  <span>Evento para personas <strong className="text-on-surface">mayores de 14 años</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary font-bold">•</span>
                  <span><strong className="text-on-surface">Espacio 100% libre de humo y alcohol:</strong> no fumar, no tomar, ni consumir sustancias.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Health Services Card */}
          <div className="flex flex-col gap-2 p-8 border-l-4 border-primary text-left bg-surface-container-lowest shadow-sm">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest">
              Cuidado Comunitario
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold uppercase mb-2">
              Servicios de Salud
            </h2>
            <div className="space-y-4 text-on-surface-variant font-body-md text-body-md">
              <p className="text-label-sm text-on-surface-variant">
                Atención y pruebas gratuitas durante la jornada:
              </p>
              <ul className="mt-1 space-y-2 font-body-md">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-base mt-0.5">medical_services</span>
                  <span><strong className="text-on-surface">Tamizaje de VIH y sífilis</strong> (Se entrega certificado de la prueba)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-base mt-0.5">favorite</span>
                  <span><strong className="text-on-surface">Entrega gratuita</strong> de preservativos y lubricante.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
