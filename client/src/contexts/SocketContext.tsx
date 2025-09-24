import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [isConnected, setIsConnected] = React.useState(false);

  useEffect(() => {
    if (token && user) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token
        }
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('Connected to server');
        
        // Join user's room for notifications
        newSocket.emit('join', user.id);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('Disconnected from server');
      });

      // Listen for nearby event notifications
      newSocket.on('nearby-event', (data) => {
        toast.success(`New event nearby: ${data.title}`, {
          duration: 6000,
          icon: '🎯',
        });
      });

      // Listen for event updates
      newSocket.on('event-update', (data) => {
        toast.success(`Event updated: ${data.title}`, {
          duration: 4000,
        });
      });

      // Listen for registration confirmations
      newSocket.on('registration-confirmed', (data) => {
        toast.success(`Registration confirmed for: ${data.eventTitle}`, {
          duration: 4000,
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token, user]);

  const value: SocketContextType = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 