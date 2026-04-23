// 🔥 Firebase core
import { initializeApp } from "firebase/app";

// 🔐 Auth
import { getAuth } from "firebase/auth";

// 🗄️ Firestore
import { getFirestore } from "firebase/firestore";

// ⚙️ Tu configuración
const firebaseConfig = {
  apiKey: "AIzaSyAQL6_XRvJG3YjRsDfSaSzbF_FBdrJqVjg",
  authDomain: "sact-f72ed.firebaseapp.com",
  projectId: "sact-f72ed",
  storageBucket: "sact-f72ed.firebasestorage.app",
  messagingSenderId: "2514814555",
  appId: "1:2514814555:web:4957ac936212255524617e"
};

// 🚀 Inicializar app
const app = initializeApp(firebaseConfig);

// 🔐 Exportar Auth
export const auth = getAuth(app);

// 🗄️ Exportar Firestore
export const db = getFirestore(app);