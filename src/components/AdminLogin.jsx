import { useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import { loginAdmin } from '../utils/auth';
import { DEFAULT_ADMIN } from '../config/constants';

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await loginAdmin(email, password);

    if (result.success) {
      onLoginSuccess(result.user);
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface-container-low border border-outline-variant/20 shadow-2xl p-8 md:p-12 rounded-2xl">
        <div className="text-center mb-10">
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase mb-2">
            Admin Login
          </h1>
          <p className="text-on-surface-variant text-label-md">
            Elite Way School - Panel de Administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-outline-variant focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low rounded"
              placeholder="admin@elite.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-outline-variant focus:ring-primary focus:border-primary px-4 py-3 bg-surface-container-low rounded"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-on-primary py-4 font-label-lg text-label-lg uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div className="mt-8 text-center">
            <p className="text-on-surface-variant text-label-sm">
              Credenciales de prueba:<br />
              Email: <code className="bg-surface-container px-2 py-1 rounded">{DEFAULT_ADMIN.EMAIL}</code><br />
              Password: <code className="bg-surface-container px-2 py-1 rounded">{DEFAULT_ADMIN.PASSWORD}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

AdminLogin.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired,
};

export default AdminLogin;
