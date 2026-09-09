import { useState, useEffect } from 'preact/hooks'
import { Router } from './components/Router'
import { initializeTheme } from './utils/theme'
import { getAuthUser } from './utils/auth'
import Header from './components/Header'
import Hero from './components/Hero'
import EventDetails from './components/EventDetails'
import StaffSection from './components/StaffSection'
import Categories from './components/Categories'
import RulesSection from './components/RulesSection'
import FinalCTA from './components/FinalCTA'
import Footer from './components/Footer'
import RegistrationModal from './components/RegistrationModal'
import AdminLogin from './components/AdminLogin'
import AdminPanel from './components/AdminPanel'

// Dedicated hash for the registration modal, so it can be shared as its own
// link (e.g. "tusitio.com/#inscripcion") even though it's a modal, not a
// section/route.
const REGISTRATION_HASH = '#inscripcion'

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden'
    if (window.location.hash !== REGISTRATION_HASH) {
      window.history.pushState(null, '', REGISTRATION_HASH)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
    if (window.location.hash === REGISTRATION_HASH) {
      window.history.pushState(null, '', '/')
    }
  }

  // Support shared/direct links to a section (e.g. "tusitio.com/#categories")
  // or straight to the registration modal ("tusitio.com/#inscripcion"). The
  // nav's own clicks clean the section hash from the address bar afterwards
  // (see Header.jsx's handleNavClick), but a hash present on initial page
  // load — typed or shared directly — still needs to be handled manually: at
  // this point in an SPA the target section may not exist in the DOM yet for
  // the browser's native fragment-scroll to find it, and there's no element
  // with id="inscripcion" to scroll to at all since it opens a modal instead.
  useEffect(() => {
    if (!window.location.hash) return
    if (window.location.hash === REGISTRATION_HASH) {
      openModal()
      return
    }
    const target = document.querySelector(window.location.hash)
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth' }))
    }
  }, [])

  // Keep the modal in sync with browser back/forward navigation once we
  // start pushing REGISTRATION_HASH onto the history stack.
  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash === REGISTRATION_HASH) {
        setIsModalOpen(true)
        document.body.style.overflow = 'hidden'
      } else {
        setIsModalOpen(false)
        document.body.style.overflow = 'auto'
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <div className="min-h-screen">
      <Header onOpenModal={openModal} />
      <main>
        <Hero onOpenModal={openModal} />
        <EventDetails />
        <StaffSection />
        <Categories />
        <RulesSection />
        <FinalCTA onOpenModal={openModal} />
      </main>
      <Footer />
      <RegistrationModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  )
}

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated on mount
    const user = getAuthUser()
    if (user) {
      setIsLoggedIn(true)
      setCurrentUser(user)
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-surface dark:bg-background">
      <div className="text-on-surface-variant">Cargando...</div>
    </div>
  }

  if (isLoggedIn) {
    return <AdminPanel user={currentUser} onLogout={handleLogout} />
  }

  return <AdminLogin onLoginSuccess={handleLoginSuccess} />
}

export function App() {
  useEffect(() => {
    initializeTheme()
  }, [])

  const routes = [
    { path: '/', component: HomePage },
    { path: '/login', component: LoginPage },
    { path: '*', component: HomePage },
  ]

  return <Router routes={routes} />
}
