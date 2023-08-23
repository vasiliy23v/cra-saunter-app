import { initializeApp } from "firebase/app";
import { getFirestore  } from 'firebase/firestore'; // Import firestore from the correct path

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASAAXpaR_pSb6tGD_rs7y13YgADJyvWEI",
  authDomain: "saunter-react-app.firebaseapp.com",
  projectId: "saunter-react-app",
  storageBucket: "saunter-react-app.appspot.com",
  messagingSenderId: "290504034822",
  appId: "1:290504034822:web:b6fae18762cca9571b9187"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);