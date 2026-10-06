import { useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import fakeEvents from '../fakeEvents'
import EventList from './EventList'
import CreateEvent from './CreateEvent'

// WPI, used until we know where the user is
const startCenter: [number, number] = [-71.8063, 42.2746]

function MapView() {
    const mapDiv = useRef<HTMLDivElement>(null)
    const mapRef = useRef<maplibregl.Map | null>(null)
    const markers = useRef<maplibregl.Marker[]>([])
    const [events, setEvents] = useState(fakeEvents)
    const [selected, setSelected] = useState<typeof fakeEvents[0] | null>(null)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapDiv.current!,
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

        // red pin for where you are
        navigator.geolocation.getCurrentPosition((pos) => {
            const me: [number, number] = [pos.coords.longitude, pos.coords.latitude]
            new maplibregl.Marker({ color: 'red' })
                .setLngLat(me)
                .setPopup(new maplibregl.Popup().setText('You are here'))
                .addTo(map)
            map.setCenter(me)
        })

        return () => map.remove()
    }, [])

    // blue pins for events, redone whenever the events change
    useEffect(() => {
        markers.current.forEach((m) => m.remove())

        markers.current = events.map((event) => {
            const info = document.createElement('div')
            info.innerText = event.title + '\n' + event.place + '\nHost: ' + event.owner.uname + '\n' + new Date(event.time).toLocaleString()

            const marker = new maplibregl.Marker({ color: 'blue' })
                .setLngLat(event.location.coordinates as [number, number])
                .setPopup(new maplibregl.Popup().setDOMContent(info))
                .addTo(mapRef.current!)
            marker.getElement().style.cursor = 'pointer'
            marker.getElement().addEventListener('click', () => setSelected(event))
            return marker
        })
    }, [events])

    // clicking an event in the side box moves the map to it
    function pickEvent(event: typeof fakeEvents[0]) {
        setSelected(event)
        mapRef.current!.flyTo({ center: event.location.coordinates as [number, number] })

        const i = events.indexOf(event)
        markers.current.forEach((m) => m.getPopup()?.remove())
        markers.current[i].togglePopup()
    }

    // TODO send this to the backend once events are saved in mongo
    function addEvent(event: typeof fakeEvents[0]) {
        setEvents([...events, event])
        setCreating(false)
        setSelected(event)
        mapRef.current!.flyTo({ center: event.location.coordinates as [number, number] })
    }

    return (
        <div className="map-page">
            <div className="side-panel">
                {creating
                    ? <CreateEvent onCreate={addEvent} onCancel={() => setCreating(false)} />
                    : <EventList events={events} selected={selected} onPick={pickEvent} onCreateClick={() => setCreating(true)} />}
            </div>
            <div ref={mapDiv} className="map"></div>
        </div>
    )
}

export default MapView
