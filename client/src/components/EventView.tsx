import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { getCurrentUser, getEvent, setAttendance } from '../api/events'
import type { CurrentUser, LocalEvent } from '../types/event'
import CreateEvent from './CreateEvent'

type Props = {
    eventId: string
}

function EventView({ eventId }: Props) {
    const [event, setEvent] = useState<LocalEvent | null>(null)
    const [user, setUser] = useState<CurrentUser | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(false)
    const [pending, setPending] = useState(false)
    const [notice, setNotice] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    useEffect(() => {
        let active = true
        async function loadEvent() {
            setLoading(true)
            setError('')
            setEvent(null)
            setEditing(false)
            setNotice('')
            try {
                const [data, currentUser] = await Promise.all([getEvent(eventId), getCurrentUser()])
                if (active) {
                    setEvent(data)
                    setUser(currentUser)
                }
            } catch (loadError) {
                if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load this event.')
            } finally {
                if (active) setLoading(false)
            }
        }
        void loadEvent()
        return () => { active = false }
    }, [eventId, retryCount])

    const isHost = Boolean(user && event?.host?._id === user.id)
    const attending = Boolean(user && event?.attendees.some((attendee) => attendee._id === user.id))

    async function toggleAttendance() {
        if (!event) return
        setPending(true)
        setError('')
        setNotice('')
        try {
            const updated = await setAttendance(event._id, !attending)
            setEvent(updated)
            setNotice(attending ? 'You have left this event.' : 'You have joined this event.')
        } catch (attendanceError) {
            setError(attendanceError instanceof Error ? attendanceError.message : 'Could not update your attendance.')
        } finally {
            setPending(false)
        }
    }

    return (
        <main className="event-page">
            <Link className="event-back" to="/">Back to map</Link>
            {loading ? <p role="status">Loading event...</p> : editing && event && isHost ? (
                <CreateEvent
                    key={event._id}
                    initialEvent={event}
                    onCancel={() => setEditing(false)}
                    onSave={(updated) => {
                        setEvent(updated)
                        setEditing(false)
                        setError('')
                        setNotice('Your event was saved.')
                    }}
                />
            ) : event ? (
                <article className="event-card">
                    <header className="event-page-header">
                        <p className="event-hint">Hosted by {event.host?.uname ?? 'Unavailable'}</p>
                        <h1>{event.title}</h1>
                        {isHost && <button className="button button-secondary" type="button" onClick={() => {
                            setNotice('')
                            setEditing(true)
                        }}>Edit event</button>}
                    </header>
                    <dl className="profile-details">
                        <div>
                            <dt>When</dt>
                            <dd><time dateTime={event.date}>{new Date(event.date).toLocaleString()}</time></dd>
                        </div>
                        <div>
                            <dt>Where</dt>
                            <dd>{event.place}</dd>
                        </div>
                        <div>
                            <dt>Map coordinates</dt>
                            <dd>{event.location.coordinates[1]}, {event.location.coordinates[0]} (latitude, longitude)</dd>
                        </div>
                    </dl>
                    <section className="event-section" aria-labelledby="event-description">
                        <h2 id="event-description">About this event</h2>
                        <p className="event-description">{event.description}</p>
                    </section>
                    <section className="event-section" aria-labelledby="event-attendees">
                        <h2 id="event-attendees">Attendees ({event.attendees.length})</h2>
                        {event.attendees.length ? (
                            <ul className="attendee-list">
                                {event.attendees.map((attendee) => <li key={attendee._id}>{attendee.uname}</li>)}
                            </ul>
                        ) : <p>No attendees yet.</p>}
                        {isHost ? <p className="event-hint">You are the host. Other users can join your event.</p> : (
                            <button className="button" type="button" disabled={pending} onClick={toggleAttendance}>
                                {pending ? 'Updating...' : attending ? 'Leave event' : 'Join event'}
                            </button>
                        )}
                    </section>
                </article>
            ) : null}
            {error && <div className="event-section">
                <p role="alert" className="error">{error}</p>
                {!event && !loading && <button className="button" type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry loading event</button>}
                <p><Link to="/login">Go to sign in</Link></p>
            </div>}
            {notice && <p role="status" className="event-notice">{notice}</p>}
        </main>
    )
}

export default EventView
