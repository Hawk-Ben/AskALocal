export type EventUser = {
    _id: string
    uname: string
}

export type CurrentUser = {
    id: string
    uname: string
}

export type EventInput = {
    title: string
    description: string
    place: string
    date: string
    location: {
        type: 'Point'
        coordinates: [number, number]
    }
}

export type LocalEvent = EventInput & {
    _id: string
    host: EventUser | null
    attendees: EventUser[]
}
