import { useAuth } from "../context/AuthProvider";
import Header from "../components/Header";
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
          expired: Timestamp.fromDate(
            dayjs(dayjs.unix(userData?.vip?.expired.seconds))
              .add(day, "day")
              .toDate()
          ),
        },
      });
      await deleteDoc(doc(db, `vipcode/${vipCode}`));
      toast.success("Kích hoạt VIP Thành công");
      setModalOpen(false);
    } else {
      toast.error("Mã VIP không hợp lệ");
    }
  };

  return (
    <div className="bg-base-200 w-full">
      <Header color="oklch(var(--b2))" />
      <div className="container mx-auto px-4 py-8">
        <div className="w-full h-48 bg-gradient-to-br from-primary via-accent to-secondary rounded-lg shadow-xl relative mb-8"></div>

        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-xl">
                  {userData?.email?.[0].toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{userData?.email}</h1>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-base-content/70">
                  Trạng thái tài khoản:
                </span>
                {isVip ? (
                  <span className="badge badge-warning gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                    VIP
                  </span>
                ) : (
                  <span className="badge badge-neutral">FREE</span>
                )}
              </div>
            </div>
          </div>

          {isVip && (
            <div className="mt-4 p-4 bg-warning/10 rounded-lg">
              <div className="flex items-center gap-2 text-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">
                  Ngày hết hạn:{" "}
                  {dayjs
                    .unix(userData?.vip?.expired.seconds)
                    .format("DD/MM/YYYY HH:mm")}
                </span>
              </div>
            </div>
          )}

          <button
            className="btn btn-primary mt-6 gap-2"
            onClick={() => setModalOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
              />
            </svg>
            Gia hạn VIP
          </button>
        </div>

        <dialog
          id="my_modal_1"
          className={`modal ${modalOpen ? "modal-open" : ""}`}
        >
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-4">Gia hạn VIP</h3>
            <div className="divider"></div>
            <p className="py-4">Nhập mã VIP Code để gia hạn VIP</p>
            <input
              value={vipCode}
              onChange={(e) => setVipCode(e.target.value)}
              type="text"
              placeholder="Nhập VIP Code"
              className="input input-bordered w-full"
            />
            <div className="modal-action">
              <form method="dialog">
                <button
                  className="btn btn-error btn-outline"
                  onClick={() => setModalOpen(false)}
                >
                  Đóng
                </button>
              </form>
              <button className="btn btn-primary" onClick={handleVipCode}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Gia hạn
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Account;
