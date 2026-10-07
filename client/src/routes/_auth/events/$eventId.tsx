import { createFileRoute } from '@tanstack/react-router'
import EventView from '../../../components/EventView'

export const Route = createFileRoute('/_auth/events/$eventId')({
    component: function EventPage() {
        const { eventId } = Route.useParams()
        return <EventView key={eventId} eventId={eventId} />
    },
})
