import { Socket } from 'socket.io';
export interface SocketMessage{
    message: string, 
    receiverId: string,
    senderId: string, 
    chatId: string, 
}

export interface SocketType extends Socket{
    userId?: string
}