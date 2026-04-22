import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { HiSun, HiMoon, HiUser } from 'react-icons/hi2'
import './Navbar.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-left">
        <h2 className="navbar-brand">
          <span className="brand-icon">🧠</span>
          <span className="gradient-text">StudyAI</span>
        </h2>
      </div>

      <div className="navbar-right">
        <button className="btn btn-icon btn-ghost" onClick={toggleTheme} title="Toggle theme" id="theme-toggle">
          {theme === 'dark' ? <HiSun size={18} /> : <HiMoon size={18} />}
        </button>

        {user && (
          <div className="navbar-user">
            <div className="user-avatar">
              <HiUser size={16} />
            </div>
            <span className="user-name">{user.username}</span>
            <button className="btn btn-ghost btn-sm" onClick={logout} id="logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
