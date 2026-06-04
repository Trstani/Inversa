import { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { apiClient } from '../api/client';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await apiClient.notifications.getAll();
        if (response.success) setNotifications(response.data);
      } catch (error) {
        console.error('Failed loading notifications:', error);
      }
    };
    loadNotifications();
    const handleNotificationClick =
async (
  notificationId
) => {

  try {

    await apiClient
      .notifications
      .markAsRead(
        notificationId
      );

    setNotifications(
      prev =>
        prev.map(
          notification =>
            notification.id === notificationId
              ? {
                  ...notification,
                  is_read: true
                }
              : notification
        )
    );

  }

  catch (
    error
  ) {

    console.error(
      error
    );

  }

};
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-light-surface dark:hover:bg-dark-surface transition-colors"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-lg z-50">
          <div className="p-4 border-b border-light-border dark:border-dark-border">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-light-secondary dark:text-dark-secondary">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-4 border-b border-light-border dark:border-dark-border"
                >
                  <h4 className="font-medium">{notification.title}</h4>
                  <p className="text-sm text-light-secondary dark:text-dark-secondary mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;