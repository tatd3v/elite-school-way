export default function RulesSection() {
  const dressCodes = [
    { 
      hex: '#000080', 
      name: 'NAVY BLUE', 
      meaning: 'Autoridad y Tradición',
      description: 'El tono fundamental de nuestro uniforme. Representa el rigor y la historia de la academia.'
    },
    { 
      hex: '#990000', 
      name: 'CRIMSON RED', 
      meaning: 'Pasión y Audacia',
      description: 'Simboliza la fuerza vital y la valentía necesaria para destacar en la pasarela.'
    },
    { 
      hex: '#87CEEB', 
      name: 'SKY BLUE', 
      meaning: 'Claridad y Visión',
      description: 'Refleja la lucidez mental y la frescura de los nuevos talentos que ingresan.'
    },
    { 
      hex: '#FFFFFF', 
      name: 'PURE WHITE', 
      meaning: 'Excelencia Técnica',
      description: 'La limpieza en la ejecución y la pureza del talento sin adulterar.'
    },
  ]


  return (
    <section
      className="py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto"
      id="rules"
    >
      <div className="grid grid-cols-1 gap-16">
        {/* Dress Code Section - Mobile Card (Old Design) */}
        <div className="md:hidden p-10 border border-primary-container/30 bg-surface-container-lowest shadow-xl relative overflow-hidden rounded-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 -mr-16 -mt-16 rounded-full"></div>
          
          <h3 className="font-headline-lg text-headline-lg text-secondary uppercase mb-8">
            DRESS CODE ACADÉMICO
          </h3>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
            La paleta oficial es obligatoria para garantizar la cohesión visual del evento.
          </p>
          
          <div className="space-y-6">
            {dressCodes.map((dress) => (
              <div key={dress.name} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded shadow-inner border border-outline-variant"
                  style={{ backgroundColor: dress.hex }}
                ></div>
                <div>
                  <span className="font-label-lg text-label-lg text-on-surface">
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

        {/* Dress Code Section - Desktop Grid (New Design) */}
        <div className="hidden md:block mb-20">
          <div className="text-center mb-16">
            <h3 className="font-headline-lg text-headline-lg text-secondary uppercase tracking-[0.2em]">
              DRESS CODE ACADÉMICO
            </h3>
            <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto text-lg">
              La paleta oficial es obligatoria para todos los alumnos. Garantiza la excelencia estética y la cohesión visual del claustro.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {dressCodes.map((dress) => (
              <div 
                key={dress.name} 
                className="group bg-surface-container border border-outline-variant/20 p-8 rounded-2xl transition-all hover:bg-surface-bright flex flex-col items-center text-center"
              >
                <div 
                  className="w-24 h-24 rounded-full shadow-2xl mb-6 ring-4 ring-white/5 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: dress.hex }}
                ></div>
                <h4 className="font-headline-md text-headline-md text-on-surface mb-2">
                  {dress.name}
                </h4>
                <p className="text-label-sm text-secondary uppercase tracking-widest font-bold mb-3">
                  {dress.meaning}
                </p>
                <p className="text-on-surface-variant text-sm opacity-80">
                  {dress.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Card */}
        <div className="bg-surface-container-low rounded-3xl p-12 md:p-20 border border-outline-variant/20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 -mr-48 -mt-48 rounded-full blur-3xl"></div>
          
          <div className="max-w-3xl mx-auto">
            <h3 className="font-headline-lg text-headline-lg text-primary uppercase mb-10 text-center">
              KIKI BALL — CODE OF CONDUCT
            </h3>
            <p className="font-label-lg text-label-lg text-secondary uppercase tracking-widest mb-8 text-center">
              DISCIPLINE • CULTURE • RESPECT • LEGACY
            </p>

            <ul className="conduct-list">
              <li>
                <div>
                  <h5 className="font-headline-md text-on-surface mb-2">RESPECT</h5>
                  <p className="text-on-surface-variant leading-relaxed">
                    Respeta a participantes, Houses, judges, commentators, staff y
                    público. Cero tolerancia frente a racismo, homofobia,
                    transfobia, misoginia, xenofobia, clasismo, bullying o cualquier
                    forma de discriminación.
                  </p>
                </div>
              </li>

              <li>
                <div>
                  <h5 className="font-headline-md text-on-surface mb-2">BATTLE WITH RESPECT</h5>
                  <p className="text-on-surface-variant leading-relaxed">
                    El shade, reading y actitud hacen parte del Ball. La violencia
                    física, amenazas o intimidación NO.
                  </p>
                </div>
              </li>

              <li>
                <div>
                  <h5 className="font-headline-md text-on-surface mb-2">ZERO SUBSTANCE POLICY 🚫</h5>
                  <p className="text-on-surface-variant leading-relaxed">
                    Está prohibido portar, consumir, distribuir o comercializar
                    sustancias psicoactivas dentro del establecimiento, sus
                    inmediaciones y durante el desarrollo del evento.
                  </p>
                  <p className="text-on-surface-variant leading-relaxed mt-2">
                    También se podrá solicitar el retiro de personas que lleguen o
                    permanezcan bajo efectos evidentes de sustancias cuando esto
                    comprometa la seguridad o convivencia.
                  </p>
                </div>
              </li>

              <li>
                <div>
                  <h5 className="font-headline-md text-on-surface mb-2">PROTECT THE SPACE</h5>
                  <p className="text-on-surface-variant leading-relaxed">
                    Cuida las instalaciones, respeta las zonas de seguridad y sigue
                    las instrucciones del staff.
                  </p>
                </div>
              </li>

              <li>
                <div>
                  <h5 className="font-headline-md text-on-surface mb-2">HONOR YOUR HOUSE</h5>
                  <p className="text-on-surface-variant leading-relaxed">
                    Representa tu House con orgullo, disciplina y respeto. Tu
                    comportamiento también representa tu legado.
                  </p>
                </div>
              </li>

              <li>
                <div>
                  <h5 className="font-headline-md text-on-surface mb-2">CONSEQUENCES</h5>
                  <p className="text-on-surface-variant leading-relaxed">
                    El incumplimiento puede resultar en:
                  </p>
                  <p className="text-on-surface-variant leading-relaxed mt-2">
                    WARNING → REMOVAL → DISQUALIFICATION → SUSPENSION / BAN
                  </p>
                  <p className="text-on-surface-variant leading-relaxed mt-2">
                    La organización podrá tomar medidas inmediatas ante situaciones
                    que comprometan la seguridad de la comunidad.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <hr className="my-8 border-outline-variant/30" />

          <div className="space-y-4 text-center">
            <h4 className="font-headline-lg text-headline-lg text-secondary uppercase">
              THE ELITE PLEDGE
            </h4>
            <ul className="inline-block text-left space-y-2 font-body-md text-body-md text-on-surface-variant list-disc list-inside">
              <li>RESPECT THE CULTURE.</li>
              <li>PROTECT THE COMMUNITY.</li>
              <li>HONOR THE LEGACY.</li>
              <li>WALK WITH EXCELLENCE.</li>
            </ul>
            <p className="font-body-md text-body-md text-on-surface font-semibold mt-4">
              WELCOME TO THE ELITE WAY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
