import React, { createContext, useState, useCallback, type ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  icon?: React.ReactNode;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `${Date.now()}-${Math.random()}`;
    const fullNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 3000,
    };

    setNotifications((prev) => {
      let updated = [...prev, fullNotification];
      // Keep only the last 2 notifications
      if (updated.length > 2) {
        updated = updated.slice(-2);
      }
      return updated;
    });

    if (fullNotification.duration) {
      setTimeout(() => {
        removeNotification(id);
      }, fullNotification.duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, showNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
