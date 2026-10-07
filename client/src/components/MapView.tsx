import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { getEvents } from '../api/events'
import type { LocalEvent } from '../types/event'
import EventList from './EventList'
import CreateEvent from './CreateEvent'
import ProfileView from './ProfileView'

// WPI, used until we know where the user is
const startCenter: [number, number] = [-71.8063, 42.2746]

function MapView() {
    const mapDiv = useRef<HTMLDivElement>(null)
    const mapRef = useRef<maplibregl.Map | null>(null)
    const markers = useRef<maplibregl.Marker[]>([])
    const [events, setEvents] = useState<LocalEvent[]>([])
    const [selected, setSelected] = useState<LocalEvent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [mapError, setMapError] = useState('')
    const [retryCount, setRetryCount] = useState(0)
    const [creating, setCreating] = useState(false)
    const [showProfile, setShowProfile] = useState(false)

    useEffect(() => {
        if (!mapDiv.current) return
        const map = new maplibregl.Map({
            container: mapDiv.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                        attribution: '© OpenStreetMap contributors',
                    },
                },
                layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
            },
            center: startCenter,
            zoom: 15,
        })
        mapRef.current = map

        map.addControl(new maplibregl.NavigationControl())
        map.on('error', () => setMapError('Map tiles could not load. You can still view and create events.'))

        // red pin for where you are
        let active = true
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                if (!active) return
                const me: [number, number] = [pos.coords.longitude, pos.coords.latitude]
                new maplibregl.Marker({ color: 'red' })
                    .setLngLat(me)
                    .setPopup(new maplibregl.Popup().setText('You are here'))
                    .addTo(map)
                map.setCenter(me)
            }, () => {
                if (active) setMapError('Your location is unavailable. The map is centered on WPI instead.')
            })
        }

        return () => {
            active = false
            mapRef.current = null
            map.remove()
        }
    }, [])

    useEffect(() => {
        let active = true
        async function loadEvents() {
            setLoading(true)
            setError('')
            try {
                const data = await getEvents()
                if (active) setEvents(data)
            } catch (loadError) {
                if (active) setError(loadError instanceof Error ? loadError.message : 'Could not load events.')
            } finally {
                if (active) setLoading(false)
            }
        }
        void loadEvents()
        return () => { active = false }
    }, [retryCount])

    // blue pins for events, redone whenever the events change
    useEffect(() => {
        markers.current.forEach((m) => m.remove())
        const map = mapRef.current
        if (!map) return

        markers.current = events.map((event) => {
            const info = document.createElement('div')
            info.innerText = event.title + '\n' + event.place + '\nHost: ' + (event.host?.uname ?? 'Unavailable') + '\n' + new Date(event.date).toLocaleString()
            const link = document.createElement('a')
            link.href = '/events/' + encodeURIComponent(event._id)
            link.textContent = 'View Event'
            info.append(document.createElement('br'), link)

            const marker = new maplibregl.Marker({ color: 'blue' })
                .setLngLat(event.location.coordinates)
                .setPopup(new maplibregl.Popup().setDOMContent(info))
                .addTo(map)
            marker.getElement().style.cursor = 'pointer'
            marker.getElement().addEventListener('click', () => setSelected(event))
            return marker
        })
        return () => markers.current.forEach((marker) => marker.remove())
    }, [events])

    // clicking an event in the side box moves the map to it
    function pickEvent(event: LocalEvent) {
        setSelected(event)
        mapRef.current?.flyTo({ center: event.location.coordinates })

        const i = events.indexOf(event)
        markers.current.forEach((m) => m.getPopup()?.remove())
        markers.current[i]?.togglePopup()
    }

    function addEvent(event: LocalEvent) {
        setEvents((current) => [...current, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
        setCreating(false)
        setSelected(event)
        mapRef.current?.flyTo({ center: event.location.coordinates })
    }

    return (
        <div className="map-page">
            <div className="side-panel">
                {mapError && <p role="status" className="event-hint">{mapError}</p>}
                {showProfile
                    ? <ProfileView onBack={() => setShowProfile(false)} />
                    : creating
                    ? <CreateEvent onSave={addEvent} onCancel={() => setCreating(false)} />
                    : loading
                    ? <p role="status">Loading events...</p>
                    : error
                    ? <div>
                        <p role="alert" className="error">{error}</p>
                        <button className="button" type="button" onClick={() => setRetryCount((count) => count + 1)}>Retry loading events</button>
                    </div>
                    : <EventList
                        events={events}
                        selected={selected}
                        onPick={pickEvent}
                        onCreateClick={() => setCreating(true)}
                        onProfileClick={() => setShowProfile(true)}
                    />}
            </div>
            <div ref={mapDiv} className="map"></div>
        </div>
    )
}

export default MapView
