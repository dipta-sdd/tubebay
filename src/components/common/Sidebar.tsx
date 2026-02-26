import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWpabStore } from "../../store/wpabStore";
import {
  SettingsIcon,
  ChannelLibraryIcon,
  ShoppingBagIcon,
  HelpStethoscopeIcon,
  WifiIcon,
  YouTubeIcon,
  ClockIcon,
} from "./Icons";

interface SidebarMenuItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

const Sidebar: FC = () => {
  const { plugin_settings } = useWpabStore();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = "/" + (location.pathname.split("/")[1] || "");

  const menuItems: SidebarMenuItem[] = [
    {
      label: "TubeBay Settings",
      path: "/settings",
      icon: <SettingsIcon />,
    },
    {
      label: "Channel Library",
      path: "/",
      icon: <ChannelLibraryIcon />,
    },
    {
      label: "Products",
      path: "/products",
      icon: <ShoppingBagIcon />,
    },
    {
      label: "Help & Diagnostics",
      path: "/logs",
      icon: <HelpStethoscopeIcon />,
    },
  ];

  const isConnected = plugin_settings?.connection_status === "connected";
  const channelName = plugin_settings?.channel_name || "";

  return (
    <aside className="tubebay-w-[clamp(260px,10%,300px)] tubebay-hidden lg:tubebay-flex tubebay-flex-col tubebay-gap-[16px] ">
      {/* Navigation Card */}
      <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[24px] tubebay-shadow-xl">
        <nav className="tubebay-flex tubebay-flex-col tubebay-gap-[8px]">
          {menuItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path === "/" && currentPath === "/library");
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`tubebay-flex tubebay-items-center tubebay-gap-[10px] 
                  tubebay-px-[16px] tubebay-py-[12px] tubebay-rounded-[12px] 
                  tubebay-t-6-bold
                  tubebay-w-full tubebay-text-left tubebay-border-0 tubebay-cursor-pointer tubebay-transition-all tubebay-duration-150 ${
                  isActive
                    ? "tubebay-bg-primary tubebay-text-white tubebay-shadow-sm"
                    : "tubebay-bg-transparent tubebay-text-color-default hover:tubebay-bg-gray-100"
                }`}
                style={{ outline: "none" }}
              >
                <span
                  className={
                    isActive ? "tubebay-text-white" : "tubebay-text-color-default"
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Connection Status Card */}
      <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[24px] tubebay-flex tubebay-flex-col  tubebay-gap-[16px] tubebay-shadow-xl">
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px]">
          <WifiIcon
            className={` tubebay-w-[18px] tubebay-h-[18px]
              ${isConnected ? "tubebay-text-green-500" : "tubebay-text-gray-400"}`
            }
          />
          <span className="tubebay-t-6-bold tubebay-text-color-default">Connection Status</span>
        </div>

        {/* Status Indicator */}
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px]">
          <span
            className={`tubebay-w-[8px] tubebay-h-[8px] tubebay-mx-[5px] tubebay-rounded-full ${
              isConnected ? "tubebay-bg-green-500" : "tubebay-bg-gray-400"
            }`}
          ></span>
          <span className="tubebay-t-6-bold tubebay-text-color-default">
            API Connection: {isConnected ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Channel Info (only when connected) */}
        {isConnected && channelName && (
          <div className="tubebay-flex tubebay-flex-col tubebay-gap-[12px] tubebay-bg-[#f9fafb] tubebay-p-[16px] tubebay-rounded-[12px]">
            <div className="tubebay-flex tubebay-items-center tubebay-gap-[12px] tubebay-bg-gray-50 tubebay-rounded-[8px] tubebay-w-full">
              <div className="tubebay-w-[36px] tubebay-h-[36px] tubebay-bg-red-100 tubebay-rounded-full tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-red-600 tubebay-flex-shrink-0">
                <YouTubeIcon />
              </div>
              <div className="tubebay-overflow-hidden">
                <p className="tubebay-text-[13px] tubebay-font-bold tubebay-text-gray-900 tubebay-truncate">
                  {channelName}
                </p>
                <p className="tubebay-text-[11px] tubebay-text-gray-500">
                  Channel
                </p>
              </div>
            </div>
            <div className="tubebay-flex tubebay-gap-[12px] tubebay-justify-between tubebay-w-full">
              <button
                className="tubebay-text-[12px] tubebay-font-semibold tubebay-text-red-500 hover:tubebay-text-red-700 tubebay-bg-transparent tubebay-border-0 tubebay-cursor-pointer tubebay-p-0"
                onClick={() => navigate("/settings")}
              >
                Disconnect
              </button>
              <button
                className="tubebay-text-[12px] tubebay-font-semibold tubebay-text-[#3858e9] hover:tubebay-text-blue-800 tubebay-bg-transparent tubebay-border-0 tubebay-cursor-pointer tubebay-p-0"
                onClick={() => navigate("/settings")}
              >
                Reconnect
              </button>
            </div>
          </div>
        )}

        {/* Last Sync */}
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[6px] tubebay-border-gray-100">
          <ClockIcon className="tubebay-text-gray-400" />
          <span className="tubebay-text-small tubebay-text-secondary">
            Last sync: {isConnected ? "Recently" : "Never"}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
