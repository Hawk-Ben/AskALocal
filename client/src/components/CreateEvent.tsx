import React, { useState } from 'react'
import fakeEvents from '../fakeEvents'

type Props = {
    onCreate: (event: typeof fakeEvents[0]) => void
    onCancel: () => void
}

function CreateEvent({ onCreate, onCancel }: Props) {
    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [time, setTime] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setError('')

        // turn the address into coordinates with openstreetmap
        // only looks around worcester so it doesnt find a random place in another state
        const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&viewbox=-71.85,42.30,-71.75,42.24&bounded=1&q=' + encodeURIComponent(address))
        const results = await res.json()
        if (results.length === 0) {
            setError("Couldn't find that address")
            return
        }

        const me = await fetch('/api/auth/me').then((r) => r.json())

        onCreate({
            _id: String(Date.now()),
            title: title,
            owner: { _id: me.id, uname: me.uname },
            description: description,
            time: time,
            place: address,
            location: { type: 'Point', coordinates: [Number(results[0].lon), Number(results[0].lat)] },
        })
    }

    return (
        <form className="create-event" onSubmit={handleSubmit}>
            <h3>Create Event</h3>
            <label>
                Title
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </label>
            <label>
                Address
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Gordon Library" required />
            </label>
            <label>
                When
                <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required />
            </label>
            <label>
                Description
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            {error && <div className="error">{error}</div>}
            <div>
                <button type="submit">Create</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    )
}

export default CreateEvent
