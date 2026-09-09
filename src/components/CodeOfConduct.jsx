import PropTypes from 'prop-types'
import ShareButton from './ShareButton'

export default function CodeOfConduct({ rules, pledge }) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-12 md:p-10 border border-outline-variant/20 shadow-2xl relative overflow-hidden dark:bg-surface-container">
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 -mr-48 -mt-48 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <ShareButton label="Código de Conducta" sectionId="rules" />

      <div className="max-w-3xl mx-auto">
        <h3 className="font-headline-lg text-headline-lg text-primary uppercase mb-10 text-center">
          KIKI BALL — CÓDIGO DE CONDUCTA
        </h3>
        <p className="font-label-lg text-label-lg text-secondary uppercase tracking-widest mb-8 text-center">
          DISCIPLINA • CULTURA • RESPETO • LEGADO
        </p>

        <ul className="conduct-list space-y-10 hidden md:block">
          {rules.map((rule) => (
            <li key={rule.id}>
              <div className="flex-1 text-justify">
                <h5 className="font-headline-md text-on-surface mb-2">{rule.title}</h5>
                <p className="text-on-surface-variant leading-relaxed">{rule.content}</p>
                {rule.extraContent && (
                  <p className="text-on-surface-variant leading-relaxed mt-2">
                    {rule.extraContent}
                  </p>
                )}
                {rule.footerContent && (
                  <p className="text-on-surface-variant leading-relaxed mt-2">
                    {rule.footerContent}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* Mobile-only numbered rule cards */}
        <div className="md:hidden space-y-6">
          {rules.map((rule, index) => (
            <article
              key={rule.id}
              className="bg-surface-container-lowest border border-outline-variant/40 rounded-DEFAULT p-6 relative overflow-hidden group transition-all duration-300 hover:shadow-sm"
            >
              <div
                className="absolute top-0 left-0 w-1 h-full bg-secondary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500"
                aria-hidden="true"
              ></div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="bg-primary text-white font-bold px-2 py-1 rounded text-label-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h5 className="font-label-lg text-label-lg text-primary uppercase tracking-tight font-bold">
                    {rule.title}
                  </h5>
                </div>
                <p className="text-body-md text-on-surface-variant leading-relaxed">{rule.content}</p>
                {rule.extraContent && (
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {rule.extraContent}
                  </p>
                )}
                {rule.footerContent && (
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {rule.footerContent}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <hr className="my-8 border-outline-variant/30" />

      <div className="space-y-4 text-center">
        <h4 className="font-headline-lg text-headline-lg text-secondary uppercase">
          EL JURAMENTO ÉLITE
        </h4>
        <ul className="space-y-3 font-body-lg text-body-lg text-on-surface font-semibold list-none">
          {pledge.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

CodeOfConduct.propTypes = {
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      extraContent: PropTypes.string,
      footerContent: PropTypes.string,
    })
  ).isRequired,
  pledge: PropTypes.arrayOf(PropTypes.string).isRequired,
}
