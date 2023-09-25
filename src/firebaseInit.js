// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu09Cl4I4GGGEb_5T0A8lvnAVX7UKI24M",
  authDomain: "blogging-app-react-13246.firebaseapp.com",
  projectId: "blogging-app-react-13246",
  storageBucket: "blogging-app-react-13246.appspot.com",
  messagingSenderId: "693634050155",
  appId: "1:693634050155:web:6c7fca258c6592285be92e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);