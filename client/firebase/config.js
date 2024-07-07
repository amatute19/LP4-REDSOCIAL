
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvGJ5qgDYBikWSRPek4WOMOMv7JutrTpU",
  authDomain: "react-lp4-redsocial.firebaseapp.com",
  projectId: "react-lp4-redsocial",
  storageBucket: "react-lp4-redsocial.appspot.com",
  messagingSenderId: "532738337779",
  appId: "1:532738337779:web:a83b35dbe55c2dcdbac086",
  measurementId: "G-T1XTVSG5SH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);

export function uploadFile(file){
    const storageRef = ref(storage)
    uploadBytes(storageRef, file).then(snapshot => {
        console.log(snapshot)
    })
}