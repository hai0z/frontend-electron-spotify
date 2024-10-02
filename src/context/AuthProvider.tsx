"use client";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { getRecentListening } from "../services/firebase";
import { useUserStore } from "../store/UserStore";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import React from "react";

interface IAuthContext {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  userData: any;
  setUserData: (userData: any) => void;
}
const AuthContext = React.createContext({} as IAuthContext);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = React.useState(false);
  const [userData, setUserData] = React.useState<any>(null);
  const { setRecentList, setLikedPlaylists, setLikedSongs, setMyPlaylists } =
    useUserStore();

  const getUserData = async () => {
    const recentList = await getRecentListening();
    const unsub4 = onSnapshot(
      doc(db, `users/${auth.currentUser?.uid}`),
      (doc) => {
        setUserData(doc.data() as any);
      }
    );
    setRecentList(recentList as any[]);
    const q = query(collection(db, `users/${auth.currentUser?.uid}/likedSong`));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const songs = [] as any;
      querySnapshot.forEach((doc) => {
        songs.push(doc.data());
      });
      setLikedSongs(songs);
    });
    const q1 = query(
      collection(db, `users/${auth.currentUser?.uid}/likedPlaylists`)
    );
    const unsub1 = onSnapshot(q1, (querySnapshot) => {
      const likedPlaylists = [] as any;
      querySnapshot.forEach((doc) => {
        likedPlaylists.push(doc.data());
      });
      setLikedPlaylists(likedPlaylists);
    });
    const q2 = query(
      collection(db, `users/${auth.currentUser?.uid}/myPlaylists`)
    );
    const unsub2 = onSnapshot(q2, (querySnapshot) => {
      const myPlaylists = [] as any;
      querySnapshot.forEach((doc) => {
        myPlaylists.push(doc.data());
      });
      setMyPlaylists(myPlaylists);
    });
    return () => {
      unsub();
      unsub1();
      unsub2();
      unsub4();
    };
  };
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLogin(true);
        getUserData();
        navigate("/", { replace: true });
      } else {
        setIsLogin(false);
        navigate("/login", { replace: true });
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, userData, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return React.useContext(AuthContext);
}
