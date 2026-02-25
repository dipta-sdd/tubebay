import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useWpabStore } from "../../store/wpabStore";

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
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
    },
    {
      label: "Channel Library",
      path: "/",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
      ),
    },
    {
      label: "Products",
      path: "/products",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
    },
    {
      label: "Help & Diagnostics",
      path: "/logs",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
    },
  ];

  const isConnected = plugin_settings?.connection_status === "connected";
  const channelName = plugin_settings?.channel_name || "";

  return (
    <aside className="tubebay-w-[260px] tubebay-min-w-[260px] tubebay-hidden lg:tubebay-flex tubebay-flex-col tubebay-gap-[16px] ">
      {/* Navigation Card */}
      <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-border tubebay-border-gray-200 tubebay-p-[24px] tubebay-shadow-sm">
        <nav className="tubebay-flex tubebay-flex-col tubebay-gap-[8px]">
          {menuItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path === "/" && currentPath === "/library");
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`tubebay-flex tubebay-items-center tubebay-gap-[10px] tubebay-px-[14px] tubebay-py-[10px] tubebay-rounded-[8px] tubebay-text-[13px] tubebay-font-semibold tubebay-w-full tubebay-text-left tubebay-border-0 tubebay-cursor-pointer tubebay-transition-all tubebay-duration-150 ${
                  isActive
                    ? "tubebay-bg-[#3858e9] tubebay-text-white tubebay-shadow-sm"
                    : "tubebay-bg-transparent tubebay-text-gray-700 hover:tubebay-bg-gray-100"
                }`}
                style={{ outline: "none" }}
              >
                <span
                  className={
                    isActive ? "tubebay-text-white" : "tubebay-text-gray-500"
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
      <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-border tubebay-border-gray-200 tubebay-p-[16px] tubebay-shadow-sm">
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-mb-[14px]">
          <svg
            className={
              isConnected ? "tubebay-text-green-500" : "tubebay-text-gray-400"
            }
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
          <span className="tubebay-text-[14px] tubebay-font-bold tubebay-text-gray-900">
            Connection Status
          </span>
        </div>

        {/* Status Indicator */}
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-mb-[16px]">
          <span
            className={`tubebay-w-[8px] tubebay-h-[8px] tubebay-rounded-full ${
              isConnected ? "tubebay-bg-green-500" : "tubebay-bg-gray-400"
            }`}
          ></span>
          <span className="tubebay-text-[13px] tubebay-text-gray-700">
            API Connection: {isConnected ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Channel Info (only when connected) */}
        {isConnected && channelName && (
          <div className="tubebay-flex tubebay-items-center tubebay-gap-[10px] tubebay-mb-[14px] tubebay-bg-gray-50 tubebay-rounded-[8px] tubebay-p-[10px]">
            <div className="tubebay-w-[36px] tubebay-h-[36px] tubebay-bg-red-100 tubebay-rounded-full tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-red-600 tubebay-flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
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
        )}

        {/* Actions */}
        {isConnected && (
          <div className="tubebay-flex tubebay-gap-[12px] tubebay-mb-[14px]">
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
        )}

        {/* Last Sync */}
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[6px] tubebay-pt-[10px] tubebay-border-t tubebay-border-gray-100">
          <svg
            className="tubebay-text-gray-400"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="tubebay-text-[11px] tubebay-text-gray-500">
            Last sync: {isConnected ? "Recently" : "Never"}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
