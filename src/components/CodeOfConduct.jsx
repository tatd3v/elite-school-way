import PropTypes from 'prop-types'

export default function CodeOfConduct({ rules, pledge }) {
  return (
    <div className="bg-surface-container-low rounded-3xl p-12 md:p-20 border border-outline-variant/20 shadow-2xl relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 -mr-48 -mt-48 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>

      <div className="max-w-3xl mx-auto">
        <h3 className="font-headline-lg text-headline-lg text-primary uppercase mb-10 text-center">
          KIKI BALL — CÓDIGO DE CONDUCTA
        </h3>
        <p className="font-label-lg text-label-lg text-secondary uppercase tracking-widest mb-8 text-center">
          DISCIPLINA • CULTURA • RESPETO • LEGADO
        </p>

        <ul className="conduct-list">
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
