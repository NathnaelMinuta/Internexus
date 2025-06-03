'use client';

import { useEffect, useState } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'danger';
  duration?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { ...notification, id }]);

    // Auto-dismiss after specified duration or default 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, addNotification, removeNotification };
}

export default function Notifications({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
            notification.type === 'danger' ? 'bg-danger text-white' :
            notification.type === 'warning' ? 'bg-warning text-white' :
            'bg-secondary text-white'
          }`}
        >
          <div className="flex justify-between items-start">
            <p className="text-sm">{notification.message}</p>
            <button
              onClick={() => onRemove(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 