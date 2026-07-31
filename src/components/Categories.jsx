import CategoryCard from './CategoryCard'
import { categories } from '../data/categories'

export default function Categories() {
  return (
    <section
      className="py-section-gap-desktop bg-surface-container-high"
      id="categories"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-16">
          <h2
            id="categories-heading"
            className="font-headline-lg text-headline-lg text-on-surface uppercase text-left border-l-8 border-secondary pl-6"
          >
            CURRÍCULO DE CATEGORIAS
          </h2>
          <p className="text-on-surface-variant mt-4 pl-8 max-w-2xl">
            Doce disciplinas para demostrar el linaje y el talento. Solo los más aptos alcanzarán la
            excelencia académica en la pasarela.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}
