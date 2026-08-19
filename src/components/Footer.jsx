export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-16 border-t border-outline-variant/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        {/* Branding */}
        <div className="text-center">
          <span className="font-headline-md text-headline-md font-bold text-primary">
            ELITE WAY SCHOOL
          </span>
          <p className="mt-4 font-label-sm text-label-sm text-on-surface-variant">
            Ballroom Bogotrans & Academic Excellence. 2026.
          </p>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h4 className="font-label-lg text-label-lg text-secondary uppercase mb-4">Contacto</h4>
          <ul className="space-y-2">
            <li className="font-label-sm text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200">
              <a
                href="https://www.instagram.com/theeliteway_b"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Instagram: theeliteway_b
              </a>
            </li>
            <li className="font-label-sm text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200">
              <a
                href="tel:+573337380581"
                className="hover:text-primary transition-colors"
              >
                Phone: +57 333 738 0581
              </a>
            </li>
          </ul>
        </div>

        {/* Information */}
        {/* <div>
          <h4 className="font-label-lg text-label-lg text-secondary uppercase mb-4">
            Información
          </h4>
          <ul className="space-y-2">
            <li className="font-label-sm text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200">
              Dress Code
            </li>
            <li className="font-label-sm text-label-sm text-on-surface-variant hover:translate-x-1 transition-transform duration-200">
              Rules
            </li>
          </ul>
        </div> */}

        {/* Logo & Copyright */}
        <div className="text-left flex flex-col items-center justify-center">
          {/* <img
            alt="Footer Logo"
            className="h-16 w-auto opacity-50 grayscale hover:grayscale-0 transition-all"
            src={logo}
          /> */}
          <p className="mt-4 font-label-sm text-label-sm text-on-surface-variant">
            © 2026 ELITE WAY SCHOOL KIKI BALL. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
