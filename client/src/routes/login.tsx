import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
    component: LoginPage,
})

function LoginPage() {
    const navigate = useNavigate()
    const [uname, setUname] = useState('')
    const [pword, setPword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setError('')
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uname, pword }),
        })
        if (res.ok) {
            navigate({ to: '/' })
        } else {
            const data = await res.json().catch(() => ({}))
            setError(data.error ?? 'Login failed')
        }
    }

    return (
        <main>``
            <h2>Sign in</h2>
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
                <button type="submit" className="button">
                    Log in
                </button>
            </form>
        </main>
    )
}
