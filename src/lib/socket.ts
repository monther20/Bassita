import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export const initializeSocket = (url: string = 'http://localhost:3001') => {
  if (!socket) {
    socket = io(url, {
      transports: ['websocket'],
      autoConnect: false,
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}