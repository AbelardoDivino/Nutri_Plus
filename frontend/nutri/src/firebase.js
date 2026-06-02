import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJoWcPr3f6MDazGrYYDM6YRY2NxQSGJn0",
  authDomain: "tetris-effect-456314-e0.firebaseapp.com",
  projectId: "tetris-effect-456314-e0",
  storageBucket: "tetris-effect-456314-e0.firebasestorage.app",
  messagingSenderId: "609824879295",
  appId: "1:609824879295:web:deaebf610b9a54840e4c0a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export default app;
