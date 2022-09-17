import { createServer } from 'http'
import { Server } from 'socket.io'
import type { IPeopleInfo, MoveData } from './types'

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    // or with an array of origins
    origin: [
      'https://my-frontend.com',
      'https://my-other-frontend.com',
      'https://cloud-sleep.netlify.app',
      'http://localhost:5577',
    ],
    credentials: true,
  },
})

const map = new Map<string, Partial<IPeopleInfo>>()

io.on('connection', (socket) => {
  // ...
  const count = io.engine.clientsCount
  console.log(`current clients count: ${count}`)
  console.log('a user connected', socket.id)
  console.log('current online: ', map.size)

  socket.on('addUser', (data: Partial<IPeopleInfo>) => {
    const userData = {
      ...data,
      socketId: socket.id,
    }
    socket.broadcast.emit('[server](addUser)', userData)
    map.set(socket.id, userData)
    io.to(socket.id).emit('your-socket-id', socket.id)
    console.log('addUser, current: ', map.size)
  })

  socket.on('hello-world', () => {
    io.to(socket.id).emit('welcome', Array.from(map.values()))
  })

  socket.on('userMove', (data: MoveData) => {
    socket.broadcast.emit('[server](userMove)', {
      ...data,
    })
    const user = map.get(socket.id)
    if (user) {
      user.pos = data.position
    }
  })

  socket.on('userCheat', (data: any) => {
    socket.broadcast.emit('[server](userCheat)', {
      ...data,
    })
  })

  socket.on('disconnect', (reason) => {
    // ...
    console.log(reason, socket.id)
    const count = io.engine.clientsCount
    map.delete(socket.id)
    socket.broadcast.emit('[server](userDisconnect)', socket.id)
    console.log(`current clients count: ${count}`)
  })
})

io.on('disconnect', (_socket) => {
  // ...
  console.log('a user disconnected')
})

httpServer.listen(3000, () => {
  console.log('listening on *:3000')
})
