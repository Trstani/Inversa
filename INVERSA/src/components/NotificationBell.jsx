import { useEffect, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { apiClient } from '../api/client';
import { isAuthenticated } from '../api/client';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {

    if (
      !isAuthenticated()
    ) {
      return;
    }

    const loadNotifications =
      async () => {

        try {

          const response =
            await apiClient
              .notifications
              .getAll();

          if (
            response.success
          ) {

            setNotifications(
              response.data
            );

          }

        }

        catch (
        error
        ) {

          console.error(
            'Failed loading notifications:',
            error
          );

        }

      };

    loadNotifications();

    const interval =
      setInterval(
        loadNotifications,
        30000
      );

    return () =>
      clearInterval(
        interval
      );

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
        <div className="fixed top-14 left-2 right-2 sm:absolute sm:right-0 sm:left-auto sm:top-auto mt-2 sm:w-96 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-lg z-50">
          <div className="p-4 border-b border-light-border dark:border-dark-border">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-light-secondary dark:text-dark-secondary">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => {
                    handleNotificationClick(
                      notification.id
                    );
                  }}
                  className={`p-3 sm:p-4 border-b border-light-border dark:border-dark-border cursor-pointer transition-all
                        ${notification.is_read
                      ? 'opacity-60'
                      : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}
                >
                  <h4 className="font-medium text-sm sm:text-base">
                    {notification.title}
                  </h4>

                  <p className="text-xs sm:text-sm">
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