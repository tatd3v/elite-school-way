import { useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import { loginAdmin } from '../utils/auth'
import { DEFAULT_ADMIN } from '../config/constants'
import logo from '../assets/logo.png'
import logoDark from '../assets/logo_dark_bg.png'

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await loginAdmin(email, password)

    if (result.success) {
      onLoginSuccess(result.user)
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-background flex items-center justify-center px-4 transition-colors duration-300 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <header className="mb-12 flex flex-col items-center text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 mb-6">
            <img 
              alt="Elite Way School Shield" 
              className="w-full h-full object-contain block dark:hidden" 
              src={logo}
            />
            <img 
              alt="Elite Way School Shield" 
              className="w-full h-full object-contain hidden dark:block drop-shadow-[0_0_15px_rgba(233,195,73,0.3)]" 
              src={logoDark}
            />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-on-surface uppercase mb-2 tracking-widest font-bold">
            ELITE WAY SCHOOL
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant/70 mt-2 tracking-widest uppercase">
            Acceso Académico
          </p>
        </header>

        <section className="w-full bg-surface-container-lowest p-6 md:p-12 border border-outline-variant/40 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider" htmlFor="email">
                EMAIL
              </label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant/40 group-focus-within:text-secondary transition-colors">
                  mail
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-outline-variant dark:border-outline-variant/30 focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low dark:bg-surface-container text-on-surface dark:text-on-surface rounded transition-colors"
                  placeholder="ejemplo@eliteway.edu"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider" htmlFor="password">
                CONTRASEÑA
              </label>
              <div className="relative flex items-center group">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant/40 group-focus-within:text-secondary transition-colors">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-outline-variant px-4 py-3 pl-12 pr-12 font-body-md text-on-surface focus:border-primary focus:outline-none focus:shadow-[0_0_0_1px] focus:shadow-primary transition-all placeholder:text-on-surface-variant placeholder:opacity-60"
                  placeholder="+57 300 000 0000"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 text-on-surface-variant/40 hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-error-container/20 border border-red-400 dark:border-error text-red-700 dark:text-error px-4 py-3 rounded transition-colors">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary dark:bg-primary text-on-primary dark:text-on-primary py-4 font-label-lg text-label-lg uppercase tracking-widest hover:bg-primary/90 dark:hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
                disabled={isLoading}
              >
                {isLoading ? 'VERIFICANDO...' : 'INICIAR SESIÓN'}
                {!isLoading && (
                  <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
                )}
              </button>
            </div>
          </form>
        </section>

        <footer className="mt-12 text-center opacity-40">
          <p className="font-label-sm text-label-sm uppercase tracking-[0.2em]">
            Prestigio • Excelencia • Tradición
          </p>
          <p className="font-label-sm text-label-sm mt-2">
            2026 Elite Way School - Ballroom Bogotrans
          </p>
        </footer>

        {import.meta.env.DEV && (
          <div className="max-w-md w-full bg-surface-container-low dark:bg-surface-container border border-outline-variant/20 dark:border-outline-variant/10 shadow-2xl p-8 md:p-12 rounded-2xl transition-colors duration-300">
            <p className="text-on-surface-variant dark:text-on-surface-variant text-label-md">
              <strong>Credenciales de prueba:</strong><br />
              Email: <code className="bg-surface-container px-2 py-1 rounded text-secondary">{DEFAULT_ADMIN.EMAIL}</code><br />
              Password: <code className="bg-surface-container px-2 py-1 rounded text-secondary">{DEFAULT_ADMIN.PASSWORD}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

AdminLogin.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
}

export default AdminLogin
