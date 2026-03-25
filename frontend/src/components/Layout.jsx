import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: '🏠 Dashboard' },
  { to: '/patients', label: '🧑‍⚕️ Patients' },
  { to: '/appointments', label: '📅 Appointments' },
  { to: '/pharmacy', label: '💊 Pharmacy' },
  { to: '/billing', label: '💳 Billing' },
  { to: '/reports', label: '📊 Reports' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-blue-700">🏥 HMS</div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm transition ${isActive ? 'bg-blue-600' : 'hover:bg-blue-700'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-700 text-sm">
          <p className="mb-2 text-blue-200">{user?.username} ({user?.role})</p>
          <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white">
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
