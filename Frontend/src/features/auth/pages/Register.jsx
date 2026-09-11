import React, { useState } from 'react'
import { Link } from 'react-router'
import '../styles/auth.css'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitForm = (event) => {
    event.preventDefault()

    const payload = {
      username,
      email,
      password,
    }

    console.log('Register payload:', payload)
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
            </div>

            <div className="form-group">
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
            </div>

            <div className="form-group">
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

            <button type="submit" className="auth-button" >
              Register
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