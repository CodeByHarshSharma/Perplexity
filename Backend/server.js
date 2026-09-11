import 'dotenv/config'
import app from './src/app.js'
import http from 'http'
import connectToDb from './src/config/database.js'
import { testAI } from './src/services/ai.service.js'
import { initSocket } from './src/sockets/server.socket.js'

connectToDb()

const PORT = process.env.PORT || 3000

const httpServer = http.createServer(app)

initSocket(httpServer)

testAI()

httpServer.listen(3000, () => {
    console.log(`Server is running at port:${PORT}`)
})