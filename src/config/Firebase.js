import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHqcMSHj6D42YMZQATrUXxnD1j0-K7ndc",
  authDomain: "scrum-management-6pk6ht.firebaseapp.com",
  projectId: "scrum-management-6pk6ht",
  storageBucket: "scrum-management-6pk6ht.appspot.com",
  messagingSenderId: "1071824203920",
  appId: "1:1071824203920:web:bc37824df956b1773e2815",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const dbImage = getStorage(app);
export const auth = getAuth(app);
