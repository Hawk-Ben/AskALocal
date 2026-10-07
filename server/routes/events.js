import { Router } from 'express'
import mongoose from 'mongoose'
import Event from '../models/Event.js'
import User from '../models/User.js'

const router = Router()
const eventPeople = [
    { path: 'host', select: 'uname' },
    { path: 'attendees', select: 'uname' },
]

router.use(async (req, res, next) => {
    const userID = req.session?.userID
    if (!mongoose.isObjectIdOrHexString(userID) || !(await User.exists({ _id: userID }))) {
        return res.status(401).json({ error: 'Please sign in to use events.' })
    }
    next()
})

router.param('eventId', (req, res, next, eventId) => {
    if (!mongoose.isObjectIdOrHexString(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID.' })
    }
    next()
})

function eventInput(body) {
    if (!body || typeof body !== 'object') return null
    const { title, description, place, date, location } = body
    const coordinates = location?.coordinates
    if (
        typeof title !== 'string' || !title.trim() || title.trim().length > 120 ||
        typeof description !== 'string' || !description.trim() || description.trim().length > 5000 ||
        typeof place !== 'string' || !place.trim() || place.trim().length > 300 ||
        typeof date !== 'string' || !date.trim() || Number.isNaN(new Date(date).getTime()) ||
        location?.type !== 'Point' || !Array.isArray(coordinates) || coordinates.length !== 2 ||
        !coordinates.every((value) => typeof value === 'number' && Number.isFinite(value)) ||
        coordinates[0] < -180 || coordinates[0] > 180 ||
        coordinates[1] < -90 || coordinates[1] > 90
    ) {
        return null
    }
    return {
        title: title.trim(),
        description: description.trim(),
        place: place.trim(),
        date: new Date(date),
        location: { type: 'Point', coordinates },
    }
}

router.get('/', async (req, res) => {
    const events = await Event.find().sort({ date: 1 }).populate(eventPeople)
    res.json(events)
})

router.get('/:eventId', async (req, res) => {
    const event = await Event.findById(req.params.eventId).populate(eventPeople)
    if (!event) return res.status(404).json({ error: 'Event not found.' })
    res.json(event)
})

router.post('/', async (req, res) => {
    const input = eventInput(req.body)
    if (!input) {
        return res.status(400).json({ error: 'Enter a title, description, place, valid date, and valid map coordinates.' })
    }
    const event = await Event.create({ ...input, host: req.session.userID, attendees: [] })
    await event.populate(eventPeople)
    res.status(201).json(event)
})

router.patch('/:eventId', async (req, res) => {
    const event = await Event.findById(req.params.eventId)
    if (!event) return res.status(404).json({ error: 'Event not found.' })
    if (event.host.toString() !== req.session.userID) {
        return res.status(403).json({ error: 'Only the host can edit this event.' })
    }
    const input = eventInput(req.body)
    if (!input) {
        return res.status(400).json({ error: 'Enter a title, description, place, valid date, and valid map coordinates.' })
    }
    // Update only editable fields so a save cannot overwrite attendees.
    const updated = await Event.findOneAndUpdate(
        { _id: event._id, host: req.session.userID },
        { $set: input },
        { new: true, runValidators: true },
    ).populate(eventPeople)
    if (!updated) return res.status(404).json({ error: 'Event not found.' })
    res.json(updated)
})

async function changeAttendance(req, res, joining) {
    const event = await Event.findById(req.params.eventId)
    if (!event) return res.status(404).json({ error: 'Event not found.' })
    if (event.host.toString() === req.session.userID) {
        return res.status(400).json({ error: 'You are already the host of this event.' })
    }
    const update = joining
        ? { $addToSet: { attendees: req.session.userID } }
        : { $pull: { attendees: req.session.userID } }
    const updated = await Event.findOneAndUpdate(
        { _id: event._id },
        update,
        { new: true, runValidators: true },
    ).populate(eventPeople)
    if (!updated) return res.status(404).json({ error: 'Event not found.' })
    res.json(updated)
}

router.post('/:eventId/attendees', (req, res) => changeAttendance(req, res, true))
router.delete('/:eventId/attendees', (req, res) => changeAttendance(req, res, false))

router.use((error, req, res, next) => {
    console.error('Event request failed:', error)
    if (res.headersSent) return next(error)
    res.status(500).json({ error: 'Could not complete the event request. Please try again.' })
})

export default router
