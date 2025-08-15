import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});

export default socket;
