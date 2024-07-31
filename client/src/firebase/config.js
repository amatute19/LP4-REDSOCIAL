import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "react-lp4-redsocial.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = async (file) => {
  const uniqueId = uuidv4(); // Genera un ID único
  const storageRef = ref(storage, `post/${uniqueId}-${file.name}`); // Guarda el archivo en la carpeta "post"
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);
  return { fileUrl, uniqueId };
};