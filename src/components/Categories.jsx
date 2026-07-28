export default function Categories() {
  const categories = [
    { name: 'Realness', icon: 'verified', color: 'secondary', description: 'La personificación perfecta del rol asignado. Sin grietas en la ilusión.' },
    { name: 'GNC Face', icon: 'face', color: 'primary', description: 'Belleza estructural sin etiquetas. La excelencia facial en su máxima expresión.' },
    { name: 'OTA Body', icon: 'fitness_center', color: 'secondary', description: 'Líneas, silueta y confianza. El cuerpo como templo de disciplina.' },
    { name: 'Runway', icon: 'directions_walk', color: 'primary', description: 'El arte de caminar. Poder, ritmo y presencia en la pasarela principal.' },
    { name: 'Best Outfit', icon: 'checkroom', color: 'secondary', description: 'Curaduría textil de alto nivel. La estética del Elite Way School hecha prenda.' },
    { name: 'Beginners', icon: 'school', color: 'primary', description: 'Nuevos talentos. El primer paso hacia la gloria académica del ballroom.' },
    { name: 'Commentator', icon: 'record_voice_over', color: 'secondary', description: 'Dominio del micrófono. Ritmo, rima y mando sobre la pista.' },
    { name: 'Best Pic', icon: 'photo_camera', color: 'primary', description: 'Angulaciones perfectas. Inmortaliza tu presencia en un solo disparo.' },
    { name: 'Triple Threat', icon: 'star', color: 'secondary', description: 'Canto, baile y presencia. El artista integral del claustro.' },
    { name: 'Femme Queen Performance', icon: 'diamond', color: 'primary', description: 'Esencia femenina, poder trans. Realeza pura en el escenario.' },
    { name: 'GNC Perf', icon: 'theater_comedy', color: 'secondary', description: 'Movimiento sin género. El performance como expresión política y artística.' },
    { name: 'Twister vs Sister', icon: 'groups', color: 'primary', description: 'La batalla final. Agilidad mental y física en el coliseo.' },
  ]

  return (
    <section className="py-section-gap-desktop bg-surface-container-high" id="categories">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface uppercase text-left border-l-8 border-secondary pl-6">
            CURRÍCULO DE CATEGORIAS
          </h2>
          <p className="text-on-surface-variant mt-4 pl-8 max-w-2xl">
            Doce categorias para demostrar el linaje y el talento. Solo los más aptos alcanzarán la excelencia académica en la pasarela.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.name}
              className="bg-surface-container-lowest border border-outline-variant/20 p-8 flex flex-col items-center text-center card-hover rounded-xl"
            >
              <span className={`material-symbols-outlined text-4xl text-${category.color} mb-4`}>
                {category.icon}
              </span>
              <h4 className="font-headline text-headline-md text-on-surface mb-2">
                {category.name}
              </h4>
              <p className="font-body text-body-md text-on-surface-variant">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
