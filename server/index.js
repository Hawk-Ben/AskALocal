import 'dotenv/config'
import express from 'express'

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
