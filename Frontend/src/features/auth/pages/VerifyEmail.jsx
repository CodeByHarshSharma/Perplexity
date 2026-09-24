import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import '../styles/auth.css'
import { useAuth } from '../hook/useAuth.js'

const STATES = {
  success: {
    icon: '✓',
    title: 'Email verified',
    subtitle: 'Your account is active. You can log in and start a conversation.'
  },
  pending: {
    icon: '✉',
    title: 'Verify your email',
    subtitle: 'This account needs to be verified before you can log in. Send yourself a fresh link below.'
  },
  already: {
    icon: '✓',
    title: 'Already verified',
    subtitle: 'This email was verified earlier, so you can go straight to login.'
  },
  expired: {
    icon: '!',
    title: 'Link expired',
    subtitle: 'Verification links are valid for 3 days. Send yourself a fresh one below.',
    isError: true
  },
  invalid: {
    icon: '!',
    title: 'Link not valid',
    subtitle: 'This verification link is broken or was already replaced by a newer one.',
    isError: true
  }
}

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const [resending, setResending] = useState(false)
  const [resendNote, setResendNote] = useState('')
  const [resendError, setResendError] = useState('')
  const [email, setEmail] = useState(searchParams.get('email') || '')

  const { handleResendVerification } = useAuth()

  const status = searchParams.get('status')
  const state = STATES[status] || STATES.invalid
  const isVerified = status === 'success' || status === 'already'

  const resendEmail = async (event) => {
    event.preventDefault()
    setResending(true)
    setResendNote('')
    setResendError('')

    try {
      const data = await handleResendVerification({ email })
      setResendNote(data?.message || 'Verification email sent.')
    }
    catch (err) {
      setResendError(err.response?.data?.message || "Couldn't resend the email. Please try again")
    }
    finally {
      setResending(false)
    }
  }

  return (
    <section className="auth-section">
      <div className="auth-wrapper">
        <div className="auth-card">
          <span className={`auth-badge ${state.isError ? 'is-error' : ''}`} aria-hidden="true">
            {state.icon}
          </span>
          <h1 className="auth-title">
            {state.title}
          </h1>
          <p className="auth-subtitle">
            {state.subtitle}
          </p>

          {isVerified ? (
            <div className="auth-actions">
              <Link to="/login" className="auth-button">
                Login to Quantix
              </Link>
            </div>
          ) : (
            <form onSubmit={resendEmail} className="auth-form">
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

              {resendNote && <p className='form-note'>{resendNote}</p>}
              {resendError && <p className='form-error'>{resendError}</p>}

              <button type="submit" className="auth-button" disabled={resending}>
                {resending ? 'Sending...' : 'Send a new link'}
              </button>
            </form>
          )}

          <p className="auth-footer">
            Need a new account?{' '}
            <Link to="/register" className="auth-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default VerifyEmail
