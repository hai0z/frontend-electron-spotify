import Header from "../components/Header";
import { darkThemes } from "../constants";
import { useAppSettingStore } from "../store/AppSettingStore";
const Setting = () => {
  const theme = useAppSettingStore((state) => state.theme);

  const setTheme = useAppSettingStore((state) => state.setTheme);

  function handleChangeTheme(themeName: string) {
    setTheme(themeName);
    document
      .getElementsByTagName("html")[0]
      ?.setAttribute("data-theme", themeName);
  }

  return (
    <div className="bg-base-200 mx-2 rounded-md w-full">
      <Header color="oklch(var(--b2))" />
      <div className="px-4">
        <span className="text-3xl font-bold">Cài đặt</span>
      </div>
      <div className="mt-4 px-4">
        <div className="bg-base-300 collapse collapse-arrow">
          <input type="checkbox" className="peer" />
          <div className="collapse-title">
            <p className="text-xl font-bold">Giao diện</p>
            <p className="mt-2">Tuỳ chình giao diện cho ứng dụng</p>
          </div>
          <div className="collapse-content">
            <div className="">
              <div className="flex flex-row flex-wrap gap-4 mt-2">
                {darkThemes.map((t) => {
                  return (
                    <div
                      data-theme={t.name}
                      className="flex gap-2 bg-transparent"
                      key={t.name}
                    >
                      <input
                        onChange={() => handleChangeTheme(t.name)}
                        type="radio"
                        name="radio-1"
                        className="radio radio-primary md:tooltip hover:bg-primarys"
                        data-tip={t.name}
                        checked={theme === t.name}
                      />
                      <p className={"block md:hidden"}>{t.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
