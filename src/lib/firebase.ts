import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent as firebaseLogEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAxjdm5n-nwWRRV_JiauPV8Ib_0_9mzqg8",
  authDomain: "bt-ogretmeni.firebaseapp.com",
  projectId: "bt-ogretmeni",
  storageBucket: "bt-ogretmeni.appspot.com",
  messagingSenderId: "1091270900048",
  appId: "1:1091270900048:web:946f0c78574679fb035455",
  measurementId: "G-6ML43HP34B"
};

// Firebase'i yalnızca tarayıcıda başlat
let app = null;
let analytics = null;

if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Analytics başlatılamadı:', error);
  }
}

// Basit event gönderme
const logEvent = (eventName: string, eventParams?: any) => {
  if (analytics) {
    try {
      firebaseLogEvent(analytics, eventName, eventParams);
    } catch (error) {
      // Hata durumunda sessizce devam et
      console.error('Event hatası:', error);
    }
  }
};

export { app, logEvent }; 


