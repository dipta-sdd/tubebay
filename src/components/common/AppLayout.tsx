import { Outlet, useNavigate } from "react-router-dom";
import { FC, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useWpabStore } from "../../store/wpabStore";

const AppLayout: FC = () => {
  const { plugin_settings } = useWpabStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(plugin_settings.connection_status);
    if (
      plugin_settings.connection_status !== "disconnected" &&
      plugin_settings.connection_status !== "connected"
    ) {
      navigate("/onboarding");
    }
  }, []);

  return (
    <div className="">
      <Navbar />
      <div className="tubebay-flex tubebay-px-[24px] tubebay-py-[32px] tubebay-gap-[32px] tubebay-max-width">
        <Sidebar />
        <main className="tubebay-flex-1 tubebay-min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
