
import { initializeApp } from "firebase/app";
import { signInWithEmailAndPassword, getAuth, signOut, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import {getStorage, ref , uploadBytes, getDownloadURL } from 'firebase/storage'
import {v4} from 'uuid'




const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDERID,
  appId: import.meta.env.VITE_APPID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app)
const storage = getStorage(app)

// login
export const onSigIn = async ({ email, password }) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (err) {
    console.log(err);
  }
};

// logout
export const logout = () => {
  try {
    signOut(auth);
  } catch (err) {
    console.log('error logout');
  }
};

// login con google
const googleProvider = new GoogleAuthProvider();
export const loginGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return res;
  } catch (error) {
    console.log('error en login de google', error);
  }
};

// registro
export const signUp = async ({ email, password }) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log('error en registro', error);
  }
};

// olvidé contraseña
export const forgotPassword = async ({ email }) => {
  try {
    const res = await sendPasswordResetEmail(auth, email);
    return res;
  } catch (error) {
    console.log("Error al enviar el correo electrónico de restablecimiento de contraseña:", error);
  }
};


// storage
export const uploadFile = async (file)=> {
  const storageRef = ref(storage, v4())
  await uploadBytes(storageRef, file)
  let url = await getDownloadURL(storageRef)
  return url
}

