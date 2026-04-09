import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";

const useAuth = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [isloading, setIsloading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    setIsloading(true);
    return signInWithPopup(auth, googleProvider).finally(() =>
      setIsloading(false)
    );
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {})
      .finally(() => setIsloading(false));
  };

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (userSession) => {
      if (userSession) {
        setUser(userSession);
      } else {
        setUser({});
      }
      setIsloading(false);
    });
    return () => unsubscribed;
  }, []);

  const updateUserProfile = (name) => {
    return updateProfile(auth.currentUser, {
      displayName: name
    });
  };

  const handleEmailRegister = (fullName, email, password) => {
    setName(fullName);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const handleEmailLogin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  return {
    user,
    signInWithGoogle,
    logOut,
    isloading,
    handleEmailRegister,
    handleEmailLogin,
    updateUserProfile,
    name
  };
};

export default useAuth;