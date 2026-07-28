export default function FinalCTA({ onOpenModal }) {
  return (
    <section className="py-section-gap-desktop bg-primary dark:bg-inverse-surface text-white dark:text-inverse-on-surface relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-margin-mobile relative z-10">
        <h2 className="font-display-lg text-display-lg mb-6 uppercase">
          ¿LISTO PARA MOSTRAR TU TALENTO?
        </h2>
        <p className="font-body-lg text-body-lg mb-12 text-primary-fixed dark:text-inverse-on-surface opacity-90">
          No pierdas la oportunidad de ser parte de la historia. Las admisiones están abiertas por tiempo limitado.
        </p>
        <button 
          className="bg-secondary text-on-secondary px-12 py-5 font-label-lg text-label-lg uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-xl"
          onClick={onOpenModal}
        >
          ¡Únete a nosotros!
        </button>
      </div>
    </section>
  )
}
