import { Router } from "express";
import bcrypt from 'bcrypt'
import User from '../models/User.js'

const router = Router()

// Use this for codes: https://devhints.io/http-status

router.post('/register', async (req, res) => {
    const {uname, pword } = req.body
    if (!uname || !pword) {
        return res.status(400).json({ error: 'Bad request'})
    }
    if (await User.exists({ uname })) {
        return res.status(409).json({ error: 'Conflicting username'})
    }
    const newUser = await User.create({ uname: uname, pword: await bcrypt.hash(pword, 10)})
    req.session.userID = newUser.id;
    res.status(201).json({id: newUser.id, uname: newUser.uname})
})

router.post('/login', async (req, res) => {
    const {uname, pword } = req.body
    if (!uname || !pword) {
        return res.status(400).json({ error: 'Bad request'})
    }
    let user = await User.findOne({uname})
    // No account with this name yet, so make one
    if (!user) {
        user = await User.create({ uname: uname, pword: await bcrypt.hash(pword, 10)})
    } else if (!(await bcrypt.compare(pword, user.pword))) {
        return res.status(401).json({ error: 'Bad user or password'})
    }
    req.session.userID = user.id;
    res.json({id: user.id, uname: user.uname})
})

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.sendStatus(204))
})

// So we can check who is logged in
router.get('/me', async (req, res) => {
    const user = req.session.userID && await User.findById(req.session.userID)
    if (!user) {
        return res.sendStatus(401)
    }
    res.json({id: user.id, uname: user.uname})
})

//pulls user info for profile display
router.get('/editUser', async (req, res) => {
    const user = req.session.userID && await User.findById(req.session.userID)
    if (!user) {
        return res.sendStatus(401)
    }

    //Load events into user profile for display
    await user.populate([
        { path: 'eventsHosting', select: 'title host' },
        { path: 'eventsAttending', select: 'title attendees' },
    ])
    res.json({
        uname: user.uname,
        bio: user.bio,
        birthday: user.birthday,
        homeLocation: user.homeLocation,
        eventsHosting: user.eventsHosting.map((event) => ({ _id: event._id, title: event.title })),
        eventsAttending: user.eventsAttending.map((event) => ({ _id: event._id, title: event.title })),
    })
})

//Edit user profile information
router.post('/editUser', async (req, res) => {
    const user = req.session.userID && await User.findById(req.session.userID)
    if (!user) {
        return res.sendStatus(401)
    }

    //Checks for valid input types and non-empty username
    const { uname, bio, birthday, homeLocation } = req.body
    if (
        typeof uname !== 'string' || !uname.trim() ||
        typeof bio !== 'string' ||
        typeof homeLocation !== 'string' ||
        (birthday !== '' && birthday !== null && typeof birthday !== 'string')
    ) {
        return res.status(400).json({ error: 'Invalid profile information' })
    }

    //Ensure no conflicting usernames
    const updatedUsername = uname.trim()
    const conflictingUser = await User.findOne({ uname: updatedUsername, _id: { $ne: user._id } })
    if (conflictingUser) {
        return res.status(409).json({ error: 'Conflicting username' })
    }

    //Checks if birthday is a valid date
    const updatedBirthday = birthday ? new Date(birthday) : null
    if (updatedBirthday && Number.isNaN(updatedBirthday.getTime())) {
        return res.status(400).json({ error: 'Invalid birthday' })
    }

    //The editting!!!
    user.uname = updatedUsername
    user.bio = bio
    user.homeLocation = homeLocation
    user.birthday = updatedBirthday
    await user.save()

    res.json({
        uname: user.uname,
        bio: user.bio,
        birthday: user.birthday,
        homeLocation: user.homeLocation,
    })
})
export default router