import CategoryCard from './CategoryCard'
import ShareButton from './ShareButton'
import { categories } from '../data/categories'

export default function Categories() {
  return (
    <section
      className="relative py-12 md:py-section-gap-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto bg-surface-container-low dark:bg-surface-container"
      id="categories"
      aria-labelledby="categories-heading"
    >
      <ShareButton label="Currículo de Categorías" sectionId="categories" />
      <div className="text-center mb-8">
        <span className="text-secondary font-label-lg text-label-lg tracking-[0.4em] uppercase mb-2 block">
          Currículo Oficial
        </span>
        <h2
          id="categories-heading"
          className="font-display-lg text-3xl md:text-display-lg-mobile lg:text-display-lg text-primary uppercase leading-tight"
        >
          CATEGORIAS
        </h2>
        <div className="w-24 h-1 bg-secondary mx-auto mt-4"></div>
        <p className="text-on-surface-variant mt-4 max-w-2xl mx-auto font-body-lg">
          Doce disciplinas para demostrar el linaje y el talento. Solo los más aptos alcanzarán la
          excelencia académica en la pasarela.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  )
}
