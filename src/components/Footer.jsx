import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="bg-surface-container-highest dark:bg-tertiary-container py-12 border-t border-secondary/20 dark:border-outline/20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        
        {/* Branding */}
        <div>
          <span className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary">
            ELITE WAY SCHOOL
          </span>
          <p className="mt-4 font-label-sm text-label-sm text-on-surface-variant dark:text-inverse-on-surface">
            Ballroom Culture & Academic Excellence. Bogotá 2026.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-label-lg text-label-lg text-primary dark:text-inverse-primary uppercase mb-4">
            Contacto
          </h4>
          <ul className="space-y-2">
            <li className="font-label-sm text-label-sm text-on-surface-variant dark:text-inverse-on-surface hover:translate-x-1 transition-transform duration-200">
              Instagram: theeliteway_b
            </li>
            <li className="font-label-sm text-label-sm text-on-surface-variant dark:text-inverse-on-surface hover:translate-x-1 transition-transform duration-200">
              Phone: 3337380581
            </li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-label-lg text-label-lg text-primary dark:text-inverse-primary uppercase mb-4">
            Información
          </h4>
          <ul className="space-y-2">
            <li className="font-label-sm text-label-sm text-on-surface-variant dark:text-inverse-on-surface hover:translate-x-1 transition-transform duration-200">
              Dress Code
            </li>
            <li className="font-label-sm text-label-sm text-on-surface-variant dark:text-inverse-on-surface hover:translate-x-1 transition-transform duration-200">
              Rules
            </li>
          </ul>
        </div>

        {/* Logo & Copyright */}
        <div className="flex flex-col items-start md:items-end">
          <img 
            alt="Footer Logo" 
            className="h-16 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" 
            src={logo}
          />
          <p className="mt-4 font-label-sm text-label-sm text-on-surface-variant dark:text-inverse-on-surface text-left md:text-right">
            © 2026 ELITE WAY SCHOOL Ballroom Culture. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
