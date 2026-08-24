import PropTypes from 'prop-types'

export default function CategoryCard({ category }) {
  return (
    <article 
      className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-4 transition-all duration-300 group flex flex-col h-full relative overflow-hidden justify-between card-hover"
      role="article"
      aria-labelledby={`category-${category.id}`}
    >
      <div className="flex items-center gap-4 justify-around mb-2 relative z-10">
        <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline flex items-center justify-center shrink-0">
          <span className={`material-symbols-outlined text-${category.iconColor}`}>{category.icon}</span>
        </div>
        <div>
          <h4
            id={`category-${category.id}`}
            className="font-headline-md text-headline-md md:text-body-md text-on-surface whitespace-pre-wrap text-center"
          >
            {category.title}
          </h4>
        </div>
      </div>
      
      <div className="mb-2 relative z-10 flex justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-high rounded border border-tertiary/20">
          <span className="material-symbols-outlined text-secondary text-sm">styler</span>
          <p className="font-label-md text-label-md text-secondary text-center">{category.dressCode || 'Dress Code'}</p>
        </div>
      </div>
      
      <div className="max-w-none relative z-10 min-h-[200px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/20 scrollbar-track-transparent">
        <p className="font-body-md text-body-md md:text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">
          {category.description}
        </p>
      </div>
    </article>
  )
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dressCode: PropTypes.string,
    description: PropTypes.string.isRequired,
  }).isRequired,
}
