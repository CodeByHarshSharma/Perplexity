import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import '../styles/auth.css'
import { useAuth } from '../hook/useAuth.js'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { handleRegister } = useAuth()

  const navigate = useNavigate()

  const submitForm = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(false)

    const payload = { username, email, password }

    try{
      const data = await handleRegister(payload)
      if(data?.user){
        navigate('/login')
      }
    }
    catch(err){
      setError(err.response.data.message || err.response.data.errors[0].msg || "Couldn't Register. Please try again")
    }
    finally{
      setSubmitting(false)
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-wrapper">
        <div className="auth-card">
          <h1 className="auth-title">
            Create Account
          </h1>
          <p className="auth-subtitle">
            Register with your username, email, and password.
          </p>

          <form onSubmit={submitForm} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                required
                className="form-input" />

              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="form-input" />

              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                className="form-input" />
            </div>

            {error && <p className='form-error'>{error}</p>}

            <button type="submit" className="auth-button" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Register