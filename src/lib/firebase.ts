import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAxjdm5n-nwWRRV_JiauPV8Ib_0_9mzqg8",
  authDomain: "bt-ogretmeni.firebaseapp.com",
  projectId: "bt-ogretmeni",
  storageBucket: "bt-ogretmeni.firebasestorage.app",
  messagingSenderId: "1091270900048",
  appId: "1:1091270900048:web:946f0c78574679fb035455",
  measurementId: "G-6ML43HP34B"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Analytics'i yalnızca client tarafında başlat
let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// logEvent fonksiyonunu export et
const logEvent = (analyticsInstance: Analytics | null, eventName: string, eventParams?: any) => {
  if (analyticsInstance) {
    firebaseLogEvent(analyticsInstance, eventName, eventParams);
  }
};

export { app, analytics, logEvent }; 

