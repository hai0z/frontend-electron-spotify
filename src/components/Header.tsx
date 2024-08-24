import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Logo from "../assets/sound.png";
import { useTrackPlayerStore } from "../store/TrackPlayerStore";
interface Props {
  color: string;
  content?: React.JSX.Element;
}
function Header({ color, content }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="flex-row h-16 sticky top-0 w-full z-10 flex items-center justify-between rounded-t-md px-4 "
      style={{
        backgroundColor: color,
      }}
    >
      <div className="flex flex-row items-center flex-1">
        <div
          className="w-8 h-8 rounded-full flex justify-center items-center bg-black/30 cursor-pointer mr-2"
          onClick={() => navigate(-1)}
        >
          <MdKeyboardArrowLeft className="text-[24px] text-base-content" />
        </div>
        <div
          className="w-8 h-8 rounded-full flex justify-center items-center bg-black/30 cursor-pointer mr-2"
          onClick={() => navigate(1)}
        >
          <MdKeyboardArrowRight className="text-[24px] text-base-content" />
        </div>
        <div className="w-full">{content}</div>
      </div>
      <div className="dropdown dropdown-end z-[999]">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle ">
          <div className="rounded-full justify-center items-center flex">
            <img src={Logo} className="object-cover w-8 h-8" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <Link to="/" className="justify-between">
              Tài khoản
              <span className="badge">New</span>
            </Link>
          </li>
          <li>
            <Link to={"/setting"}>Cài đặt</Link>
          </li>
          <li
            onClick={() => {
              useTrackPlayerStore.persist.clearStorage();
              signOut(getAuth());
            }}
          >
            <span>Đăng xuất</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
