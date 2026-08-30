import 'dotenv/config'
import app from './src/app.js'
import connectToDb from './src/config/database.js'

connectToDb()

const PORT = process.env.PORT || 3000

app.listen(3000, () => {
    console.log(`Server is running at port:${PORT}`)
})