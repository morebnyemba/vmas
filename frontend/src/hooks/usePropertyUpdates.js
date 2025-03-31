// hooks/usePropertyUpdates.js
import { useEffect } from 'react';
import { useWebSocket } from 'react-use-websocket';

export const usePropertyUpdates = (propertyId) => {
  const { lastMessage } = useWebSocket(
    `wss://your-domain.com/ws/properties/${propertyId}/`
  );

  useEffect(() => {
    if (lastMessage) {
      // Handle real-time updates
    }
  }, [lastMessage]);
};