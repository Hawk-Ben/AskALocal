import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

type Profile = {
    uname: string
    bio: string
    birthday: string | null
    homeLocation: string
    eventsHosting: { _id: string, title: string }[]
    eventsAttending: { _id: string, title: string }[]
}

type Props = {
    onBack: () => void
}

function ProfileView({ onBack }: Props) {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        const timeoutId = window.setTimeout(() => controller.abort(), 10000)
        let active = true

        async function loadProfile() {
            try {
                const response = await fetch('/api/auth/editUser', { signal: controller.signal })
                if (!response.ok) {
                    throw new Error(response.status === 401 ? 'Please sign in to view your profile.' : 'Could not load your profile.')
                }
                const data: Profile = await response.json()
                if (active) setProfile(data)
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

    return (
        <section className="profile-panel" aria-labelledby="profile-title">
            <div className="profile-panel-header">
                <h3 id="profile-title">My Profile</h3>
                <button type="button" onClick={onBack}>Back to events</button>
            </div>
            {loading ? <p>Loading your profile…</p> : profile ? (
                <>
                    <dl className="profile-details">
                        <div>
                            <dt>Username</dt>
                            <dd>{profile.uname}</dd>
                        </div>
                        <div>
                            <dt>Bio</dt>
                            <dd>{profile.bio || 'No bio added yet.'}</dd>
                        </div>
                        <div>
                            <dt>Birthday</dt>
                            <dd>{profile.birthday ? new Date(profile.birthday).toLocaleDateString() : 'Not provided'}</dd>
                        </div>
                        <div>
                            <dt>Home location</dt>
                            <dd>{profile.homeLocation || 'Not provided'}</dd>
                        </div>
                        <div>
                            <dt>Events hosting</dt>
                            <dd>{profile.eventsHosting.length ? <ul className="profile-events">
                                {profile.eventsHosting.map((event) => <li key={event._id}>
                                    <Link to="/events/$eventId" params={{ eventId: event._id }}>{event.title}</Link>
                                </li>)}
                            </ul> : 'None'}</dd>
                        </div>
                        <div>
                            <dt>Events attending</dt>
                            <dd>{profile.eventsAttending.length ? <ul className="profile-events">
                                {profile.eventsAttending.map((event) => <li key={event._id}>
                                    <Link to="/events/$eventId" params={{ eventId: event._id }}>{event.title}</Link>
                                </li>)}
                            </ul> : 'None'}</dd>
                        </div>
                    </dl>
                    <p className="profile-link"><button type="button" onClick={() => window.location.href = '/userpage'}>Edit Profile</button></p>
                </>
            ) : (
                <>
                    {error && <p role="alert" className="error">{error}</p>}
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
                </>
            )}
        </section>
    )
}

export default ProfileView
