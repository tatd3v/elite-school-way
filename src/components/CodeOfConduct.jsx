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
          KIKI BALL — CODE OF CONDUCT
        </h3>
        <p className="font-label-lg text-label-lg text-secondary uppercase tracking-widest mb-8 text-center">
          DISCIPLINE • CULTURE • RESPECT • LEGACY
        </p>

        <ul className="conduct-list">
          {rules.map((rule) => (
            <li key={rule.id}>
              <div>
                <h5 className="font-headline-md text-on-surface mb-2">{rule.title}</h5>
                <p className="text-on-surface-variant leading-relaxed">
                  {rule.content}
                </p>
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

      <div className="space-y-4">
        <h4 className="font-headline-lg text-headline-lg text-secondary uppercase">
          THE ELITE PLEDGE
        </h4>
        <ul className="space-y-2 font-body-md text-body-md text-on-surface-variant list-disc pl-5">
          {pledge.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p className="font-body-md text-body-md text-on-surface font-semibold mt-4">
          WELCOME TO THE ELITE WAY.
        </p>
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
