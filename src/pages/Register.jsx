import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Auth.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const { register, loading, error } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(email, username, password, fullName)
      navigate('/dashboard')
    } catch {}
  }

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-glow" />
      <div className="auth-card glass-card animate-scaleIn">
        <div className="auth-header">
          <span className="auth-logo">🧠</span>
          <h1>Create Account</h1>
          <p>Start your AI-powered study journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="input-group">
            <label className="input-label" htmlFor="fullName">Full Name</label>
            <input id="fullName" type="text" className="input-field" placeholder="John Doe"
              value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="username">Username</label>
            <input id="username" type="text" className="input-field" placeholder="johndoe"
              value={username} onChange={e => setUsername(e.target.value)} required minLength={3} />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input-field" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input-field" placeholder="Min 6 characters"
              value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading} id="register-submit">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
