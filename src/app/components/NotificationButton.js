// components/NotificationButton.js

import { useEffect, useCallback } from 'react';

const subscribeUserToPush = async () => {
  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });

    await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    });
  } catch (error) {
    console.error('Error subscribing to push notifications', error);
  }
};

const NotificationButton = () => {
  const requestNotificationPermission = useCallback(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permission granted');
          subscribeUserToPush();
        }
      });
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window) {
      requestNotificationPermission();
    }
  }, [requestNotificationPermission]);

  const sendNotification = async () => {
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'notify',
        message: {
          title: 'Hola Sergio',
          body: '#solicitud #0003 El especialista ha propuesto una nueva negociación de precio.',
          icon: '/logo_work.png'
        }
      })
    });
  };

  return (
    <button onClick={sendNotification}>Negotiate Price</button>
  );
};

export default NotificationButton;
