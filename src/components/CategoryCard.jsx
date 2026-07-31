import PropTypes from 'prop-types'

export default function CategoryCard({ category }) {
  return (
    <div 
      className="bg-surface-container-lowest border border-outline-variant/20 p-8 flex flex-col items-center text-center card-hover rounded-xl"
      role="article"
      aria-labelledby={`category-${category.id}`}
    >
      <span 
        className={`material-symbols-outlined text-4xl text-${category.iconColor} mb-4`}
        aria-hidden="true"
      >
        {category.icon}
      </span>
      <h4 
        id={`category-${category.id}`}
        className="font-headline text-headline-md text-on-surface mb-2"
      >
        {category.title}
      </h4>
      <p className="font-body text-body-md text-on-surface-variant">
        {category.description}
      </p>
    </div>
  )
}

CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
}
