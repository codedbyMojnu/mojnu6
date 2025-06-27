import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import checkUserType from '../utils/checkUserType';

export const useWebSocket = (onProfileUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io('http://localhost:5000');

    // Get user token and username
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { username } = checkUserType(token);
        
        // Join user's personal room
        socketRef.current.emit('join-user-room', username);
        
        // Listen for profile updates
        socketRef.current.on('profile-updated', (updatedProfile) => {
          console.log('Profile updated via WebSocket:', updatedProfile);
          if (onProfileUpdate) {
            onProfileUpdate(updatedProfile);
          }
        });
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onProfileUpdate]);

  return socketRef.current;
}; 