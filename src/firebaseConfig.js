import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; //

// my Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7AynWmnG97vszvymDXjni6jHP9w9huOc",
  authDomain: "dev-deakin-app-41302.firebaseapp.com",
  projectId: "dev-deakin-app-41302",
  storageBucket: "dev-deakin-app-41302.appspot.com",
  messagingSenderId: "604215408514",
  appId: "1:604215408514:web:94fc69a21cd389f186c19b",
  measurementId: "G-WPG7ST055W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
//firebase storage
const storage = getStorage(app);

export { auth, db, storage };
