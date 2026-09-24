import React, { useState } from 'react'
import { Link } from 'react-router'
import '../styles/auth.css'
import { useAuth } from '../hook/useAuth.js'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resendNote, setResendNote] = useState('')
  const [resendError, setResendError] = useState('')

  const { handleRegister, handleResendVerification } = useAuth()

  const submitForm = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const payload = { username, email, password }

    try{
      const data = await handleRegister(payload)
      if(data?.user){
        setRegisteredEmail(data.user.email)
        setPassword('')
      }
    }
    catch(err){
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Couldn't Register. Please try again")
    }
    finally{
      setSubmitting(false)
    }
  }

  const resendEmail = async () => {
    setResending(true)
    setResendNote('')
    setResendError('')

    try{
      const data = await handleResendVerification({ email: registeredEmail })
      setResendNote(data?.message || 'Verification email sent again.')
    }
    catch(err){
      setResendError(err.response?.data?.message || "Couldn't resend the email. Please try again")
    }
    finally{
      setResending(false)
    }
  }

  const editEmail = () => {
    setRegisteredEmail('')
    setResendNote('')
    setResendError('')
  }

  if(registeredEmail){
    return (
      <section className="auth-section">
        <div className="auth-wrapper">
          <div className="auth-card">
            <span className="auth-badge" aria-hidden="true">✉</span>
            <h1 className="auth-title">
              Verify your email
            </h1>
            <p className="auth-subtitle">
              Your account is created. We sent a verification link to{' '}
              <span className="auth-highlight">{registeredEmail}</span>.
            </p>

            <ol className="auth-steps">
              <li>Open your inbox and find the email from Quantix.</li>
              <li>Click <span className="auth-highlight">Verify Email</span> inside that message.</li>
              <li>Come back here and log in.</li>
            </ol>

            <p className="auth-hint">
              Nothing yet? It can take a minute, also check your spam folder. The link expires in 3 days.
            </p>

            {resendNote && <p className='form-note'>{resendNote}</p>}
            {resendError && <p className='form-error'>{resendError}</p>}

            <div className="auth-actions">
              <button type="button" className="auth-button" onClick={resendEmail} disabled={resending}>
                {resending ? 'Sending...' : 'Resend verification email'}
              </button>
              <Link to="/login" className="auth-button is-secondary">
                Go to login
              </Link>
            </div>

            <p className="auth-footer">
              Wrong address?{' '}
              <button type="button" className="auth-link-button" onClick={editEmail}>
                Register again
              </button>
            </p>
          </div>
        </div>
      </section>
    )
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