export default function StaffSection() {
  const staffMembers = [
    { title: 'Director', icon: 'person' },
    { title: 'Maestro de Ceremonia', icon: 'mic' },
    { title: 'Curador Musical', icon: 'album' },
  ]

  return (
    <section className="hidden py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
      <div className="flex flex-col items-center mb-16">
        <div className="w-12 h-1 bg-secondary mb-4"></div>
        <h2 className="font-headline-lg text-headline-lg text-primary dark:text-inverse-primary uppercase text-center">
          EL CLAUSTRO DOCENTE
        </h2>
        <p className="text-on-surface-variant dark:text-inverse-on-surface mt-2 text-center">
          Docentes por confirmar
        </p>
        <p className="text-label-sm text-secondary mt-4 animate-pulse">
          La lista final se anunciará pronto
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {staffMembers.map((member) => (
          <div 
            key={member.title}
            className="group border border-outline-variant dark:border-outline hover:border-secondary dark:hover:border-secondary transition-colors overflow-hidden bg-surface-container-lowest dark:bg-inverse-surface p-6"
          >
            <div className="relative h-96 mb-6 overflow-hidden border border-outline-variant/30 dark:border-outline/30 bg-surface-container-low dark:bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-outline-variant opacity-50">
                {member.icon}
              </span>
            </div>
            <h3 className="font-headline text-headline-md text-outline text-center">
              PRÓXIMAMENTE
            </h3>
            <p className="font-headline text-label-lg text-outline-variant text-center uppercase mb-2">
              {member.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
