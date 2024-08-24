import { useAppSettingStore } from "../store/AppSettingStore";
import { BiWindowClose, BiWindows } from "react-icons/bi";
import { FaRegWindowMinimize } from "react-icons/fa6";

const Frame = () => {
  const { isFullScreenMode } = useAppSettingStore();
  const electron = (window as any).electron;
  console.log(window, "electron");
  const minimize = () => {
    electron.ipcRenderer.send("minimize");
  };

  const close = () => {
    electron.ipcRenderer.send("close");
  };

  const maximize = () => {
    electron.ipcRenderer.send("maximize");
  };
  return (
    !isFullScreenMode && (
      <div
        className="w-full flex flex-row items-center justify-end backdrop-blur-md"
        style={{
          zIndex: "9999",
          position: "sticky",
          top: 0,
          height: 40,
          backgroundColor: "oklch(var(--b1)",
        }}
      >
        <div className="drag px-4 flex flex-row items-center justify-start backdrop:blur-md w-full flex-1 h-full "></div>
        <div
          className="cursor-pointer h-10 w-10 justify-center items-center flex  hover:bg-primary/10 "
          onClick={minimize}
        >
          <FaRegWindowMinimize />
        </div>
        <div
          onClick={maximize}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <BiWindows className={`cursor-pointer mt-2`} />
        </div>
        <div
          onClick={close}
          className="cursor-pointer h-10 w-10  justify-center items-center flex hover:bg-primary/10"
        >
          <BiWindowClose className={`cursor-pointer mt-2`} />
        </div>
      </div>
    )
  );
};

export default Frame;
