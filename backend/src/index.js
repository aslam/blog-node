import { app } from './app.js'
import dotenv from 'dotenv'
import { initDatabase } from './db/init.js'

dotenv.config()

try {
  await initDatabase()
  const PORT = process.env.PORT
  app.listen(PORT)
  console.info(`Running on http://localhost:${PORT}`)
} catch (err) {
  console.error('Error starting server: ', err)
}
