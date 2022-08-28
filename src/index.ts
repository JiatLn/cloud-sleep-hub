import { createServer } from 'http'
import { Server } from 'socket.io'
import type { IPeopleInfo } from './types'

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

io.on('connection', (socket) => {
  // ...
  const count = io.engine.clientsCount
  console.log(`current clients count: ${count}`)
  console.log('a user connected', socket.id)
  // socket.broadcast.emit('add new user', socket.id)

  socket.on('addUser', (data: Partial<IPeopleInfo>) => {
    socket.broadcast.emit('[server](addUser)', {
      ...data,
      socketId: socket.id,
    })
  })

  socket.on('userMove', (data: any) => {
    socket.broadcast.emit('[server](userMove)', {
      ...data,
    })
  })

  socket.on('disconnect', (reason) => {
    // ...
    console.log(reason, socket.id)
    const count = io.engine.clientsCount
    console.log(`current clients count: ${count}`)
    socket.broadcast.emit('[server](userDisconnect)', socket.id)
  })
})

io.on('disconnect', (_socket) => {
  // ...
  console.log('a user disconnected')
})

httpServer.listen(3000, () => {
  console.log('listening on *:3000')
})
