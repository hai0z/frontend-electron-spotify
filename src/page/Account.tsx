import { useAuth } from "../context/AuthProvider";
import Header from "../components/Header";
import Logo from "../assets/sound.png";
import dayjs from "dayjs";
import React from "react";
import {
  deleteDoc,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import toast from "react-hot-toast";
const Account = () => {
  const { userData } = useAuth();

  const [vipCode, setVipCode] = React.useState("");

  const isVip = dayjs.unix(userData?.vip?.expired?.seconds).isAfter(dayjs());

  const [modalOpen, setModalOpen] = React.useState(false);

  const handleVipCode = async () => {
    const docRef = doc(db, "vipcode", vipCode);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const day = docSnap.data().day;
      await updateDoc(doc(db, `users/${userData?.uid}`), {
        vip: {
          expired: Timestamp.fromDate(dayjs().add(day, "day").toDate()),
        },
      });
      await deleteDoc(doc(db, `vipcode/${vipCode}`));
      toast.success("Kích hoạt VIP Thành công");
      setModalOpen(false);
    } else {
      // docSnap.data() will be undefined in this case
      toast.error("Mã VIP không hợp lệ");
    }
  };
  return (
    <div className="w-full mx-2">
      <Header color="oklch(var(--b2))" />
      <div>
        <div className="w-full h-40 bg-gradient-to-br from-primary to-secondary relative">
          <img
            src={Logo}
            className="w-20 h-20 object-cover avatar absolute -bottom-0 left-4 border-2 border-base-content rounded-full p-2"
            alt="Logo"
          />
        </div>
        <div className="mt-2">
          <h1 className="text-3xl font-bold">{userData?.email}</h1>
          <p className="mt-2">Trạng thái tài khoản: {isVip ? "VIP" : "FREE"}</p>
          <p className="mt-2">
            {isVip &&
              `Ngày hết hạn: ${dayjs
                .unix(userData?.vip?.expired.seconds)
                .format("DD/MM/YYYY HH:mm")}`}
          </p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => setModalOpen(true)}
          >
            Kích hoạt VIP
          </button>
          <dialog
            id="my_modal_1"
            className={`modal ${modalOpen ? "modal-open" : ""}`}
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Kích hoạt VIP</h3>
              <p className="py-4">Nhập mã VIP Code để kich hoạt vip</p>
              <input
                value={vipCode}
                onChange={(e) => setVipCode(e.target.value)}
                type="text"
                placeholder="Nhập VIP Code"
                className="input input-bordered"
              />
              <div className="modal-action">
                <form method="dialog">
                  <button
                    className="btn btn-error"
                    onClick={() => setModalOpen(false)}
                  >
                    Close
                  </button>
                </form>
                <button className="btn btn-primary" onClick={handleVipCode}>
                  {" "}
                  Kích hoạt{" "}
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Account;
