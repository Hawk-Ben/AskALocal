import type { CurrentUser, EventInput, LocalEvent } from '../types/event'
import { readCoordinates } from '../utils/eventForm'

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    try {
        const response = await fetch(url, { ...options, signal: controller.signal })
        if (!response.ok) {
            if (response.status === 401) throw new Error('Please sign in again to use events.')
            if (response.status >= 500) throw new Error('The server could not complete your request. Please try again.')
            if (response.headers.get('Content-Type')?.includes('application/json')) {
                const data: unknown = await response.json()
                if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
                    throw new Error(data.error)
                }
            }
            throw new Error('Could not complete your request. Please try again.')
        }
        return await response.json()
    } catch (error) {
        if (controller.signal.aborted) throw new Error('The request timed out. Please try again.')
        if (error instanceof TypeError) throw new Error('Could not reach the server. Check your connection and try again.')
        if (error instanceof SyntaxError) throw new Error('The server returned an invalid response. Please try again.')
        throw error
    } finally {
        window.clearTimeout(timeout)
    }
}

export function getEvents() {
    return requestJson<LocalEvent[]>('/api/events')
}

export function getEvent(id: string) {
    return requestJson<LocalEvent>(`/api/events/${encodeURIComponent(id)}`)
}

export function getCurrentUser() {
    return requestJson<CurrentUser>('/api/auth/me')
}

export function saveEvent(input: EventInput, id?: string) {
    return requestJson<LocalEvent>(id ? `/api/events/${encodeURIComponent(id)}` : '/api/events', {
        method: id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })
}

export function setAttendance(id: string, attending: boolean) {
    return requestJson<LocalEvent>(`/api/events/${encodeURIComponent(id)}/attendees`, {
        method: attending ? 'POST' : 'DELETE',
    })
}

export async function findAddressCoordinates(address: string) {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&viewbox=-71.85,42.30,-71.75,42.24&bounded=1&q=' + encodeURIComponent(address)
    const results: unknown = await requestJson(url)
    if (
        !Array.isArray(results) || !results.length ||
        typeof results[0]?.lon !== 'string' || typeof results[0]?.lat !== 'string'
    ) {
        throw new Error('Could not find that Worcester address. Enter the longitude and latitude manually instead.')
    }
    return readCoordinates(results[0].lon, results[0].lat)
}
