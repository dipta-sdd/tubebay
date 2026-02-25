import { Outlet } from "react-router-dom";
import { FC } from "react";
import Navbar from "./Navbar";
import { useWpabStore } from "../../store/wpabStore";

const AppLayout: FC = () => {
  const { plugin_settings } = useWpabStore();
  console.log(plugin_settings);
  return (
    <div className="wpab-cb-container radius-large">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
