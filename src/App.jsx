import { useState, useEffect } from 'preact/hooks'
import { Router } from './components/Router'
import { initializeTheme } from './utils/theme'
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

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
    if (!isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero onOpenModal={toggleModal} />
        <EventDetails />
        <StaffSection />
        <Categories />
        <RulesSection />
        <FinalCTA onOpenModal={toggleModal} />
      </main>
      <Footer />
      <RegistrationModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  )
}

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const handleLoginSuccess = (user) => {
    setIsLoggedIn(true)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
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
    { path: '/', component: <HomePage /> },
    { path: '/login', component: <LoginPage /> },
    { path: '*', component: <HomePage /> },
  ]

  return <Router routes={routes} />
}
