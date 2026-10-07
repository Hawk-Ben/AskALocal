import React, { useState } from 'react'
import { findAddressCoordinates, saveEvent } from '../api/events'
import type { LocalEvent } from '../types/event'
import { readCoordinates, toLocalDateTime } from '../utils/eventForm'

type Props = {
    initialEvent?: LocalEvent
    onSave: (event: LocalEvent) => void
    onCancel: () => void
}

function CreateEvent({ initialEvent, onSave, onCancel }: Props) {
    const [title, setTitle] = useState(initialEvent?.title ?? '')
    const [address, setAddress] = useState(initialEvent?.place ?? '')
    const [time, setTime] = useState(initialEvent ? toLocalDateTime(initialEvent.date) : '')
    const [description, setDescription] = useState(initialEvent?.description ?? '')
    const [longitude, setLongitude] = useState(initialEvent ? String(initialEvent.location.coordinates[0]) : '')
    const [latitude, setLatitude] = useState(initialEvent ? String(initialEvent.location.coordinates[1]) : '')
    const [error, setError] = useState('')
    const [pending, setPending] = useState(false)

    async function findAddress() {
        setError('')
        setPending(true)
        try {
            if (!address.trim()) throw new Error('Enter an address first.')
            const [lng, lat] = await findAddressCoordinates(address.trim())
            setLongitude(String(lng))
            setLatitude(String(lat))
        } catch (lookupError) {
            setError(lookupError instanceof Error ? lookupError.message : 'Could not find the address. Enter coordinates manually instead.')
        } finally {
            setPending(false)
        }
    }

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setError('')

        setPending(true)
        try {
            if (!title.trim() || !address.trim() || !description.trim()) {
                throw new Error('Title, address, and description cannot be blank.')
            }
            const coordinates = !longitude.trim() && !latitude.trim()
                ? await findAddressCoordinates(address.trim())
                : readCoordinates(longitude, latitude)
            setLongitude(String(coordinates[0]))
            setLatitude(String(coordinates[1]))
            const event = await saveEvent({
                title: title.trim(),
                description: description.trim(),
                date: new Date(time).toISOString(),
                place: address.trim(),
                location: { type: 'Point', coordinates },
            }, initialEvent?._id)
            onSave(event)
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : 'Could not save your event.')
        } finally {
            setPending(false)
        }
    }

    return (
        <form className="create-event form" onSubmit={handleSubmit} aria-busy={pending}>
            <h3>{initialEvent ? 'Edit Event' : 'Create Event'}</h3>
            <fieldset disabled={pending} className="event-fields">
                <label className="field">
                    Title
                    <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
                </label>
                <label className="field">
                    Address
                    <input className="input" value={address} onChange={(e) => {
                        setAddress(e.target.value)
                        setLongitude('')
                        setLatitude('')
                    }} placeholder="Gordon Library" maxLength={300} required />
                </label>
                <button className="button button-secondary" type="button" onClick={findAddress}>Find address on map</button>
                <label className="field">
                    When
                    <input className="input" type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} required />
                </label>
                <label className="field">
                    Description
                    <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} required />
                </label>
                <div className="event-coordinates">
                    <label className="field">
                        Longitude
                        <input className="input" type="number" step="any" min="-180" max="180" value={longitude} onChange={(e) => setLongitude(e.target.value)} required={Boolean(latitude)} />
                    </label>
                    <label className="field">
                        Latitude
                        <input className="input" type="number" step="any" min="-90" max="90" value={latitude} onChange={(e) => setLatitude(e.target.value)} required={Boolean(longitude)} />
                    </label>
                </div>
                <p className="event-hint">Leave both coordinates blank to look up a Worcester address, or enter them yourself. For Gordon Library, use longitude -71.8064 and latitude 42.2742.</p>
            </fieldset>
            {error && <div role="alert" className="error">{error}</div>}
            <div className="event-actions">
                <button className="button" type="submit" disabled={pending}>{pending ? 'Saving...' : initialEvent ? 'Save changes' : 'Create event'}</button>
                <button className="button button-secondary" type="button" onClick={onCancel} disabled={pending}>Cancel</button>
            </div>
        </form>
    )
}

export default CreateEvent
