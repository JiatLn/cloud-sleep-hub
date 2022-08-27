import { createServer } from 'http'
import { Server } from 'socket.io'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    // or with an array of origins
    origin: [
      'https://my-frontend.com',
      'https://my-other-frontend.com',
      'http://localhost:5577',
    ],
    credentials: true,
  },
})

io.on('connection', (_socket) => {
  // ...
  console.log('a user connected')
})

httpServer.listen(3000, () => {
  console.log('listening on *:3000')
})
