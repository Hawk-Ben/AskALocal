import { Link } from '@tanstack/react-router'
import type { LocalEvent } from '../types/event'

type Props = {
    events: LocalEvent[]
    selected: LocalEvent | null
    onPick: (event: LocalEvent) => void
    onCreateClick: () => void
    onProfileClick: () => void
}

function EventList({ events, selected, onPick, onCreateClick, onProfileClick }: Props) {
    return (
        <div>
            <h3>Events</h3>
            <button className="button" type="button" onClick={onCreateClick}>+ Create Event</button>
            <p className="profile-link"><button className="button button-secondary" type="button" onClick={onProfileClick}>View Profile</button></p>
            {events.length === 0 && <p className="event-empty">No events yet. Create the first one!</p>}
            {events.map((event) => (
                <div key={event._id} className="event-item">
                    <button type="button" className="event-title" onClick={() => onPick(event)} aria-expanded={selected?._id === event._id}>
                        {event.title}
                    </button>

                    {/* more info for the one you clicked */}
                    {selected?._id === event._id && (
                        <div className="event-more">
                            <div>Where: {event.place}</div>
                            <div>Host: {event.host?.uname ?? 'Unavailable'}</div>
                            <div>{new Date(event.date).toLocaleString()}</div>
                            <div>{event.attendees.length} attending</div>
                            <p className="event-description">{event.description}</p>
                            <Link className="button event-link" to="/events/$eventId" params={{ eventId: event._id }}>View Event</Link>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default EventList
