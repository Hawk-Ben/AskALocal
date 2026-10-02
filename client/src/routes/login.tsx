import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import styles from '../styles/auth.module.css'

export const Route = createFileRoute('/login')({
    component: LoginPage,
})

function LoginPage() {
    const navigate = useNavigate()
    const [uname, setUname] = useState('')
    const [pword, setPword] = useState('')
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setError('')
        setPending(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uname, pword }),
            })
            if (res.ok) {
                navigate({ to: '/' })
                return
            }
            if (res.status >= 502 && res.status <= 504) {
                setError("Couldn't reach the server.")
            } else {
                const data = await res.json().catch(() => ({}))
                setError(data.error ?? 'Login failed')
            }
        } catch {
            setError("Couldn't reach the server. Try again.")
        }
        setPending(false)
    }

    return (
        <main className={styles.auth}>
            <div className={styles.card}>
                <h1 className={styles.cardTitle}>Sign in</h1>
                <form onSubmit={handleSubmit} className="form">
                    <label className="field">
                        Username
                        <input
                            className="input"
                            value={uname}
                            onChange={(e) => setUname(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </label>
                    <label className="field">
                        Password
                        <input
                            className="input"
                            type="password"
                            value={pword}
                            onChange={(e) => setPword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>
                    {error && <p role="alert" className="error">{error}</p>}
                    <button type="submit" className="button" disabled={pending}>
                        {pending ? 'Logging in…' : 'Log in'}
                    </button>
                </form>
            </div>
        </main>
    )
}
