import { Outlet, useNavigate } from "react-router-dom";
import { FC, useEffect } from "react";
import Navbar from "./Navbar";
import { useWpabStore } from "../../store/wpabStore";

const AppLayout: FC = () => {
  const { plugin_settings } = useWpabStore();
  const navigate = useNavigate();
  console.table(plugin_settings);
  useEffect(() => {
    if (plugin_settings.connection_status === "disconnected") {
      navigate("/onboarding");
    }
  }, [plugin_settings]);
  return (
    <div className="wpab-cb-container radius-large">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
