import React from "react";
import logo from "../assets/sound.png";
import {
  getAdditionalUserInfo,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { db } from "../firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Frame from "../components/Frame";
import toast, { Toaster } from "react-hot-toast";
const LoginScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        getAuth(),
        email.trim(),
        password.trim()
      );
      const {
        user: { uid, photoURL, displayName, email: userEmail },
      } = userCredential;
      if (getAdditionalUserInfo(userCredential)?.isNewUser) {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
          uid,
          photoURL,
          displayName,
          email: userEmail,
        });
      }
      navigate("/", { replace: true });
    } catch (error: any) {
      throw new Error("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <div className="w-full h-[calc(100vh-40px)] overflow-y-hidden">
      <Frame />
      <Toaster />

      <div className="w-full h-full bg-gradient-to-b from-primary/30 to-base-100 flex flex-col justify-center items-center">
        <div className="w-1/2 flex flex-col bg-base-100 rounded-xl p-4">
          <div className="flex jce items-center flex-col">
            <img src={logo} alt="" className="w-24 h24" />
            <span className="text-3xl font-bold">Đăng nhập vào Harmonify</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-2 py-4">
            <label className="form-control w-full max-w-md">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
                placeholder="Email"
                className="input input-bordered w-full max-w-md"
              />
            </label>
            <label className="form-control w-full max-w-md">
              <div className="label">
                <span className="label-text">Mật khẩu</span>
              </div>
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
                placeholder="Mật khẩu"
                className="input input-bordered w-full max-w-md"
              />
            </label>
            <button
              className="btn btn-primary max-w-md w-full mt-4"
              onClick={() =>
                toast.promise(handleLogin(), {
                  success: "Đăng nhập thành công",
                  error: (err) => err.message,
                  loading: "Đang đăng nhập",
                })
              }
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
