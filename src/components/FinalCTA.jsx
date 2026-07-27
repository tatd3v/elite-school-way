export default function FinalCTA({ onOpenModal }) {
  return (
    <section className="py-section-gap-desktop bg-primary text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center px-margin-mobile relative z-10">
        <h2 className="font-headline text-display-lg mb-6 uppercase">
          ¿LISTO PARA MOSTRAR TU TALENTO?
        </h2>
        <p className="font-body text-body-lg mb-12 text-primary-fixed opacity-90">
          No pierdas la oportunidad de ser parte de la historia. Las admisiones están abiertas por tiempo limitado.
        </p>
        <button 
          className="bg-secondary text-on-secondary px-12 py-5 font-headline text-label-lg uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-xl rounded"
          onClick={onOpenModal}
        >
          ¡Únete a nosotros!
        </button>
      </div>
    </section>
  )
}
