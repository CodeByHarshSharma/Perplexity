import 'dotenv/config'
import app from './src/app.js'
import connectToDb from './src/config/database.js'
import { testAI } from './src/services/ai.service.js'

connectToDb()

const PORT = process.env.PORT || 3000

testAI()

app.listen(3000, () => {
    console.log(`Server is running at port:${PORT}`)
})