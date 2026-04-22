import { NavLink } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineChatBubbleLeftRight,
  HiOutlineAcademicCap,
  HiOutlineRectangleStack,
  HiOutlineClipboardDocumentCheck,
  HiOutlineMusicalNote,
} from 'react-icons/hi2'
import './Sidebar.css'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
  { path: '/chat', label: 'Chat Q&A', icon: HiOutlineChatBubbleLeftRight },
  { path: '/quiz', label: 'Quiz', icon: HiOutlineAcademicCap },
  { path: '/flashcards', label: 'Flashcards', icon: HiOutlineRectangleStack },
  { path: '/exam-mode', label: 'Exam Mode', icon: HiOutlineClipboardDocumentCheck },
  { path: '/lazy-mode', label: 'Lazy Mode 🎧', icon: HiOutlineMusicalNote },
]

export default function Sidebar() {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-emoji">🧠</span>
          <div>
            <h3 className="gradient-text">StudyAI</h3>
            <span className="sidebar-version">v1.0</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
            id={`nav-${item.path.slice(1)}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-card glass-card">
          <p className="sidebar-footer-text">
            Upload your study materials and let AI help you learn faster.
          </p>
        </div>
      </div>
    </aside>
  )
}
