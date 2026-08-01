import PropTypes from 'prop-types'

export default function DressCode({ dressCodes }) {
  return (
    <>
      {/* Mobile Card (Old Design) */}
      <div className="md:hidden p-10 border border-primary-container/30 bg-surface-container-lowest shadow-xl relative overflow-hidden rounded-2xl">
        <div 
          className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 -mr-16 -mt-16 rounded-full" 
          aria-hidden="true"
        ></div>
        
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
                role="img"
                aria-label={`${dress.name} color swatch`}
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

      {/* Desktop Grid (New Design) */}
      <div className="hidden md:block mb-20">
        <div className="text-center mb-16">
          <h3 className="font-headline-lg text-headline-lg text-secondary uppercase tracking-[0.2em]">
            DRESS CODE ACADÉMICO
          </h3>
          <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto text-lg">
            La paleta oficial es obligatoria para todxs lxs estudiantxs. Garantiza la excelencia estética y la cohesión visual de la institución.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {dressCodes.map((dress) => (
            <div 
              key={dress.name} 
              className="group bg-surface-container border border-outline-variant/20 p-8 rounded-2xl transition-all hover:bg-surface-bright flex flex-col items-center text-center"
            >
              <div 
                className="w-24 h-24 rounded-full shadow-2xl mb-6 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: dress.hex }}
                role="img"
                aria-label={`${dress.name} color swatch`}
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
    </>
  )
}

DressCode.propTypes = {
  dressCodes: PropTypes.arrayOf(
    PropTypes.shape({
      hex: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      meaning: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
}
