import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Navigate } from 'react-router'
import '../styles/auth.css'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()
        setError('')
        setSubmitting(true)

        const payload = { email, password }

        try {
            const data = await handleLogin(payload)
            if (data?.user) {
                navigate("/")
            }
        }
        catch (err) {
            setError(err.response.data.message || "Couldn't Log in. Please check your credentials")
        }
        finally {
            setSubmitting(false)
        }
    }

    if (!loading && user) {
        return <Navigate to='/' replace />
    }

    return (
        <section className="auth-section">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <h1 className="auth-title">
                        Welcome Back
                    </h1>
                    <p className="auth-subtitle">
                        Sign in with your email and password.
                    </p>

                    <form onSubmit={submitForm} className="auth-form">
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

                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                required
                                className="form-input" />
                        </div>

                        {error && <p className='form-error'>{error}</p>}

                        <button type="submit" className="auth-button" disabled={submitting} >
                            {submitting ? 'Login' : 'Login'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login