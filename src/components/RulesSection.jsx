export default function RulesSection() {
  const dressCodes = [
    { color: 'bg-primary', name: 'NAVY BLUE', hex: '#000666', meaning: 'Autoridad y Tradición' },
    { color: 'bg-secondary', name: 'CRIMSON RED', hex: '#b52617', meaning: 'Pasión y Audacia' },
    { color: 'bg-sky-blue', name: 'SKY BLUE', hex: '#87CEEB', meaning: 'Claridad y Visión' },
    { color: 'bg-white', name: 'PURE WHITE', hex: '#ffffff', meaning: 'Pureza y Excelencia' },
  ]

  const rules = [
    { 
      title: 'PUNTUALIDAD RIGUROSA:', 
      description: 'Las puertas se cierran a las 7:00 PM sin excepciones para competidores.' 
    },
    { 
      title: 'CONDUCTA ELITE:', 
      description: 'Se exige respeto absoluto hacia los jueces y compañeros. Cualquier conducta antideportiva resultará en expulsión inmediata.' 
    },
    { 
      title: 'ORIGINALIDAD:', 
      description: 'Plagios en vestuario o performance serán penalizados severamente por el jurado.' 
    },
    { 
      title: 'SEGURIDAD:', 
      description: 'Prohibido el ingreso de objetos peligrosos o sustancias ilegales al recinto escolar.' 
    },
  ]

  return (
    <section className="py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto" id="rules">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Dress Code Card */}
        <div className="p-10 border border-secondary/20 dark:border-secondary/30 bg-surface-container-lowest dark:bg-inverse-surface shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 -mr-16 -mt-16 rounded-full"></div>
          
          <h3 className="font-headline-lg text-headline-lg text-secondary uppercase mb-8">
            REGLAMENTO DEL CLAUSTRO
          </h3>
          
          <p className="font-body-lg text-body-lg text-on-surface dark:text-inverse-on-surface mb-8">
            Inspiración Académica Prestigiosa. La paleta oficial es obligatoria para garantizar la cohesión visual del evento.
          </p>
          
          <div className="space-y-6">
            {dressCodes.map((dress) => (
              <div key={dress.name} className="flex items-center gap-4">
                <div className={`w-12 h-12 ${dress.color} rounded shadow-inner border border-outline`}></div>
                <div>
                  <span className={`font-label-lg text-label-lg ${dress.color === 'bg-white' ? 'text-outline' : `text-${dress.color.replace('bg-', '')}`}`}>
                    {dress.name}
                  </span>
                  <p className="text-label-sm text-on-surface-variant">
                    {dress.meaning}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Card */}
        <div className="p-10 border border-primary-container/30 bg-surface-container-lowest shadow-xl rounded-2xl">
          <h3 className="font-headline-lg text-headline-lg text-primary uppercase mb-8">
            REGLAMENTO DEL CLAUSTRO
          </h3>
          
          <ul className="space-y-6">
            {rules.map((rule, index) => (
              <li key={index} className="flex gap-4">
                <span className="material-symbols-outlined text-secondary">
                  priority_high
                </span>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  <strong className="text-on-surface">{rule.title}</strong> {rule.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  )
}
