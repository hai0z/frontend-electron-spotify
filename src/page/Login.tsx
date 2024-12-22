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
  const [email, setEmail] = React.useState<string>(() => {
    return localStorage.getItem("rememberedEmail") || "";
  });
  const [password, setPassword] = React.useState<string>(() => {
    return localStorage.getItem("rememberedPassword") || "";
  });
  const [rememberMe, setRememberMe] = React.useState<boolean>(() => {
    return localStorage.getItem("rememberMe") === "true";
  });

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

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
        localStorage.removeItem("rememberMe");
      }

      navigate("/", { replace: true });
    } catch (error: any) {
      throw new Error("Sai tên đăng nhập hoặc mật khẩu");
    }
  };

  return (
    <div className="w-full h-screen overflow-y-hidden">
      <Frame />
      <Toaster />

      <div className="w-full h-full flex ">
        {/* Left side - Decorative/Branding */}
        <div className="w-1/2 bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center p-8">
          <div className="text-center">
            <img
              src={logo}
              alt="Harmonify Logo"
              className="w-48 h-48 mx-auto animate-pulse"
            />
            <h1 className="text-5xl font-bold mt-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Harmonify
            </h1>
            <p className="text-xl mt-4 text-base-content/80">
              Trải nghiệm âm nhạc tuyệt vời
            </p>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-1/2 bg-base-100 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-8">
              Đăng nhập vào Harmonify
            </h2>

            <div className="flex flex-col gap-y-4">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-lg font-medium">Email</span>
                </div>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="text"
                  placeholder="Nhập email của bạn"
                  className="input input-bordered input-lg w-full focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-lg font-medium">
                    Mật khẩu
                  </span>
                </div>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  className="input input-bordered input-lg w-full focus:ring-2 focus:ring-primary"
                />
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Nhớ mật khẩu</span>
              </label>

              <button
                className="btn btn-primary btn-lg w-full mt-6 text-lg font-semibold hover:brightness-110 transition-all duration-300"
                onClick={() =>
                  toast.promise(handleLogin(), {
                    success: "Đăng nhập thành công",
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
    </div>
  );
};

export default LoginScreen;
