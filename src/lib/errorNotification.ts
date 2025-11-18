type ErrorNotificationHandler = (title: string, message: string) => void;

let notificationHandler: ErrorNotificationHandler | null = null;

export const setErrorNotificationHandler = (
  handler: ErrorNotificationHandler
) => {
  notificationHandler = handler;
};

export const showErrorNotification = (title: string, message: string) => {
  if (notificationHandler) {
    notificationHandler(title, message);
  } else {
    // Fallback to alert if no handler is set
    alert(`${title}\n\n${message}`);
  }
};
