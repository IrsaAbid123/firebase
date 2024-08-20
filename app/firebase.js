import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
// For push notification
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDGZcphZqgTwAEZkziuCXTom51McAWyHEI",
  authDomain: "firee-e2ae2.firebaseapp.com",
  projectId: "firee-e2ae2",
  storageBucket: "firee-e2ae2.appspot.com",
  messagingSenderId: "239086980222",
  appId: "1:239086980222:web:628837049e662ffe921c2f",
  measurementId: "G-XR9L551322",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Functionality for pushing notifications
export const messaging = getMessaging(app);
export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BF2-GEt3pLYK_JOxJuDsbSCZk8eMBfOkJ9tvoYZIlPrb7OkYNDhn_A8i8XPwjOfkvcAvfuLVXF52_Xt8QaOowTw",
    });
    console.log("Token:", token);
  }
};
