import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const WebSocketListener = () => {
  const [ws, setWs] = useState(null);
  const playSound = () => {
    console.log('🔊 Playing sound...');
    const audio = new Audio('/sound/linkclicked.mp3')
    audio.play()
  };

  useEffect(() => {
    const socket = new WebSocket('wss://kitly.onrender.com'); // Change to wss:// if in production
    setWs(socket);

    socket.onopen = () => console.log('✅ Connected to WebSocket');
    socket.onerror = (error) => console.error('❌ WebSocket Error:', error);
    socket.onclose = () => console.log('❌ Disconnected from WebSocket');

    socket.onmessage = (event) => {
      console.log('📩 Message received:', event.data);
      const data = JSON.parse(event.data);

      if (data.message === 'Link Clicked!') {
        toast.success(`🔔 You got a new Click !`, {
          theme: 'colored',
          style: { backgroundColor: '#bb6a3b', color: '#fff', fontSize: '16px' },
          position: 'bottom-right'
        });

        playSound();
      }
    };

    return () => {
      console.log('🛑 Closing WebSocket connection...');
      socket.close();
    };
  }, []);

  return null;
};



export default WebSocketListener;
