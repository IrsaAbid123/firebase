importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDGZcphZqgTwAEZkziuCXTom51McAWyHEI",
  authDomain: "firee-e2ae2.firebaseapp.com",
  projectId: "firee-e2ae2",
  storageBucket: "firee-e2ae2.appspot.com",
  messagingSenderId: "239086980222",
  appId: "1:239086980222:web:628837049e662ffe921c2f",
  measurementId: "G-XR9L551322",
});

const messaging = firebase.messaging();

// OnBackground message
messaging.onMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
}
