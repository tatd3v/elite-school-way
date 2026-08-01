import PropTypes from 'prop-types';
import { logoutAdmin } from '../utils/auth';
import { CATEGORIES_COUNT } from '../config/constants';
import StatCard from './StatCard';
import InstructionItem from './InstructionItem';

function AdminDashboard({ user, onLogout }) {
  const registrations = [];

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-primary text-on-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="font-headline-lg text-headline-lg uppercase">
              Panel de Administración
            </h1>
            <p className="text-on-primary/80 text-label-md mt-1">
              Elite Way School - Bienvenido, {user.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-secondary text-on-secondary px-6 py-3 rounded font-label-md uppercase hover:bg-secondary/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="bg-surface-container-low border border-outline-variant/20 shadow-xl p-8 rounded-2xl">
          <div className="flex items-center gap-4 mb-8">
            <span className="material-symbols-outlined text-secondary text-4xl">
              dashboard
            </span>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase">
                Dashboard
              </h2>
              <p className="text-on-surface-variant text-label-md">
                Gestión de registros y categorías
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard
              label="Total Registros"
              value={registrations.length}
              icon="group"
              borderColor="border-primary/20"
              iconColor="text-primary"
            />
            <StatCard
              label="Categorías Activas"
              value={CATEGORIES_COUNT}
              icon="category"
              borderColor="border-secondary/20"
              iconColor="text-secondary"
            />
            <StatCard
              label="Tu Rol"
              value={user.role.toUpperCase()}
              icon="badge"
              borderColor="border-outline-variant/20"
              iconColor="text-outline"
            />
          </div>

          <div className="bg-surface-container-high border border-outline-variant/20 p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-on-surface text-3xl">
                description
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface uppercase">
                Instrucciones
              </h3>
            </div>
            
            <div className="space-y-4 text-on-surface-variant">
              <InstructionItem
                title="Ver Registros"
                description="Abre tu Google Sheet para ver todos los registros en tiempo real"
              />
              <InstructionItem
                title="Gestionar Admins"
                description='Edita la pestaña &quot;Admins&quot; en Google Sheets para agregar/remover administradores'
              />
              <InstructionItem
                title="Exportar Datos"
                description="Descarga el Google Sheet como Excel desde File → Download → Microsoft Excel"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant">
              <a
                href={`https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_GOOGLE_SCRIPT_URL?.match(/\/d\/([^/]+)/)?.[1] || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded font-label-md uppercase hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">table_chart</span>
                Abrir Google Sheet
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

AdminDashboard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;
