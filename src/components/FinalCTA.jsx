import PropTypes from 'prop-types'

export default function FinalCTA({ onOpenModal }) {
  return (
    <section className="py-12 md:py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto bg-surface-container-low dark:bg-surface-container text-on-surface relative overflow-hidden border-b border-outline-variant/20">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="font-display-lg text-3xl md:text-display-lg-mobile lg:text-display-lg mb-6 uppercase text-primary leading-tight">
          ¿LISTX PARA MOSTRAR TU TALENTO?
        </h2>
        <p className="font-body-lg text-body-lg mb-12 text-on-surface-variant">
          No pierdas la oportunidad de ser parte de la historia. Las admisiones están abiertas por
          tiempo limitado.
        </p>
        <button
          className="bg-secondary text-on-secondary px-12 py-5 font-label-lg text-label-lg uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-xl"
          onClick={onOpenModal}
        >
          ¡Únete a nosotrxs!
        </button>
      </div>
    </section>
  )
}

FinalCTA.propTypes = {
  onOpenModal: PropTypes.func.isRequired,
}
