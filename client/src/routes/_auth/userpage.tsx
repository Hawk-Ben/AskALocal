import React, { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/userpage')({
    component: UserPage,
})

function UserPage() {
    const navigate = useNavigate()
    const [uname, setUname] = useState('')
    const [bio, setBio] = useState('')
    const [birthday, setBirthday] = useState('')
    const [homeLocation, setHomeLocation] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [profileLoaded, setProfileLoaded] = useState(false)
    const [retryCount, setRetryCount] = useState(0)
    const [pending, setPending] = useState(false)

    React.useEffect(() => {
        let active = true
        const controller = new AbortController()
        const timeoutId = window.setTimeout(() => controller.abort(), 10000)

        async function loadProfile() {
            try {
                const res = await fetch('/api/auth/editUser', { signal: controller.signal })
                if (!res.ok) {
                    throw new Error(res.status === 401 ? 'Please sign in to edit your profile.' : 'Could not load your profile.')
                }

                const profile = await res.json()
                if (active) {
                    setUname(profile.uname ?? '')
                    setBio(profile.bio ?? '')
                    setBirthday(profile.birthday ? new Date(profile.birthday).toISOString().slice(0, 16) : '')
                    setHomeLocation(profile.homeLocation ?? '')
                    setProfileLoaded(true)
                }
            } catch (loadError) {
                if (active) {
                    setError(
                        controller.signal.aborted
                            ? 'Loading your profile timed out. Check your connection and retry.'
                            : loadError instanceof Error
                                ? loadError.message
                                : 'Could not load your profile.',
                    )
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        void loadProfile()
        return () => {
            active = false
            window.clearTimeout(timeoutId)
            controller.abort()
        }
    }, [retryCount])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setPending(true)

        try {
            const res = await fetch('/api/auth/editUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uname, bio, birthday, homeLocation }),
            })
            if (res.ok) {
                navigate({ to: '/' })
                return
            }
            const data = await res.json().catch(() => ({}))
            setError(data.error ?? (res.status >= 502 && res.status <= 504 ? "Couldn't reach the server." : 'Edit profile failed'))
        } catch {
            setError("Couldn't reach the server. Try again.")
        } finally {
            setPending(false)
        }
    }

    return (
        <main className="user-page">
            <form className="create-event" onSubmit={handleSubmit}>
                <h3>Edit Profile</h3>
                {loading ? <p>Loading your profile…</p> : (
                    profileLoaded ? <>
                        <label>
                            Username
                            <input value={uname} onChange={(e) => setUname(e.target.value)} autoComplete="username" required />
                        </label>
                        <label>
                            Bio
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} autoComplete="off" />
                        </label>
                        <label>
                            Birthday
                            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                        </label>
                        <label>
                            Home Location
                            <input value={homeLocation} onChange={(e) => setHomeLocation(e.target.value)} placeholder="Gordon Library" />
                        </label>
                    </> : (
                        <div>
                            {error && <div role="alert" className="error">{error}</div>}
                            <button
                                type="button"
                                onClick={() => {
                                    setError('')
                                    setLoading(true)
                                    setRetryCount((count) => count + 1)
                                }}
                            >
                                Retry loading profile
                            </button>
                        </div>
                    )
                )}
                {profileLoaded && error && <div role="alert" className="error">{error}</div>}
                <div className="user-page-actions">
                    <button type="submit" disabled={loading || pending || !profileLoaded}>
                        {pending ? 'Saving…' : 'Save'}
                    </button>
                    <button type="button" onClick={() => navigate({ to: '/' })}>Cancel</button>
                </div>
            </form>
        </main>
    )
}
