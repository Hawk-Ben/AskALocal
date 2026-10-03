import fakeEvents from '../fakeEvents'

type Props = {
    events: typeof fakeEvents
    selected: typeof fakeEvents[0] | null
    onPick: (event: typeof fakeEvents[0]) => void
    onCreateClick: () => void
}

function EventList({ events, selected, onPick, onCreateClick }: Props) {
    return (
        <div>
            <h3>Events</h3>
            <button onClick={onCreateClick}>+ Create Event</button>
            {events.map((event) => (
                <div key={event._id} className="event-item">
                    <div className="event-title" onClick={() => onPick(event)}>
                        {event.title}
                    </div>

                    {/* more info for the one you clicked */}
                    {selected?._id === event._id && (
                        <div className="event-more">
                            <div>Where: {event.place}</div>
                            <div>Host: {event.owner.uname}</div>
                            <div>{new Date(event.time).toLocaleString()}</div>
                            <div>{event.description}</div>
                            <button onClick={() => alert('Event page coming soon')}>View Event</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default EventList
