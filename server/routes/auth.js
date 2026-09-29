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
    const user = await User.findOne({uname})
    if (!user || !(await bcrypt.compare(pword ?? '', user.pword))) {
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

export default router