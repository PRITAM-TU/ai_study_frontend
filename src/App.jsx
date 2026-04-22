import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Chat from './pages/Chat.jsx'
import Quiz from './pages/Quiz.jsx'
import Flashcards from './pages/Flashcards.jsx'
import ExamMode from './pages/ExamMode.jsx'
import LazyMode from './pages/LazyMode.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'

function AppLayout({ children }) {
  return (
    <div className="page-container">
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/chat" element={
        <ProtectedRoute>
          <AppLayout><Chat /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/quiz" element={
        <ProtectedRoute>
          <AppLayout><Quiz /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/flashcards" element={
        <ProtectedRoute>
          <AppLayout><Flashcards /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/exam-mode" element={
        <ProtectedRoute>
          <AppLayout><ExamMode /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/lazy-mode" element={
        <ProtectedRoute>
          <AppLayout><LazyMode /></AppLayout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
