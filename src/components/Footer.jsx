export default function Footer() {
  return (
    <footer className="bg-surface-container-highest py-12 border-t border-secondary/20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        
        {/* Branding */}
        <div>
          <span className="font-headline text-headline-md font-bold text-primary">
            ELITE WAY SCHOOL
          </span>
          <p className="mt-4 font-headline text-label-sm text-on-surface-variant">
            Ballroom Culture & Academic Excellence. Bogotá 2026.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-headline text-label-lg text-primary uppercase mb-4">
            Contacto
          </h4>
          <ul className="space-y-2">
            <li className="font-headline text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200">
              Instagram: theeliteway_b
            </li>
            <li className="font-headline text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200">
              Phone: 3337380581
            </li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-headline text-label-lg text-primary uppercase mb-4">
            Información
          </h4>
          <ul className="space-y-2">
            <li>
              <a 
                href="#rules" 
                className="font-headline text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200 inline-block"
              >
                Dress Code
              </a>
            </li>
            <li>
              <a 
                href="#rules" 
                className="font-headline text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200 inline-block"
              >
                Rules
              </a>
            </li>
          </ul>
        </div>

        {/* Logo & Copyright */}
        <div className="flex flex-col items-start md:items-end">
          <img 
            alt="Footer Logo" 
            className="h-16 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLuXcw0qGMJ6pITeTn94TSyqfCbzllwT6cPd7A6Mjns63rBxRp5XyQnMGQEpMo87owpMTEsMwQ7nHoGfJEMEiWRFByrz0hHwsgOVlcIx_vLSJ-_x116i-6Vec4HV6-s0K_L28ZKBg7Y0_OhRLbLQQaF78sWlfLV08Tcbzl1lWttsOvhyY_0nA4CaOqpxZSdq4CtzfDZ3Sj0S9xj5jcsohnTfbRSvQApDfQNGPEmZdMgJWUuuQNkqResbd33-"
          />
          <p className="mt-4 font-headline text-label-sm text-on-surface-variant text-left md:text-right">
            © 2026 ELITE WAY SCHOOL Ballroom Culture. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
