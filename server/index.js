import 'dotenv/config'
import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import authRouter from './routes/auth.js'

await mongoose.connect(process.env.MONGODB_URI)

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ client: mongoose.connection.getClient() }),
  cookie: {}
}))

app.use('/api/auth', authRouter)

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
