import React from 'react';
import { useNotifications } from '../api/NotificationContext';

export const NotificationDisplay: React.FC = () =>  {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => removeNotification(notification.id)}
          style={{
            pointerEvents: 'auto',
            animation: 'slideInRight 0.3s ease-out',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            minWidth: '300px',
            maxWidth: '400px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          {/* Icon */}
          {notification.icon && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor:
                  notification.type === 'success'
                    ? 'rgba(34, 197, 94, 0.1)'
                    : notification.type === 'error'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : notification.type === 'warning'
                    ? 'rgba(251, 146, 60, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
                color:
                  notification.type === 'success'
                    ? '#22c55e'
                    : notification.type === 'error'
                    ? '#ef4444'
                    : notification.type === 'warning'
                    ? '#fb923c'
                    : '#3b82f6',
              }}
            >
              {notification.icon}
            </div>
          )}

          {/* Content */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: notification.message ? '4px' : '0',
              }}
            >
              {notification.title}
            </div>
            {notification.message && (
              <div
                style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  lineHeight: '1.4',
                }}
              >
                {notification.message}
              </div>
            )}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(400px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
