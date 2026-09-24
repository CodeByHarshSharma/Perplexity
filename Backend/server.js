import 'dotenv/config'
import app from './src/app.js'
import http from 'http'
import connectToDb from './src/config/database.js'
import { initSocket } from './src/sockets/server.socket.js'

connectToDb()

const PORT = process.env.PORT || 3000

const httpServer = http.createServer(app)

initSocket(httpServer)

httpServer.listen(PORT, () => {
    console.log(`Server is running at port:${PORT}`)
})