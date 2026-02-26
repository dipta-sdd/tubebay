import { useState, useEffect, FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { __ } from "@wordpress/i18n";
import { useWpabStore } from "../../store/wpabStore";
import { MenuIcon, CloseIcon } from "./Icons";

interface MenuLink {
  label: string;
  path: string;
}

const Navbar: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const store = useWpabStore();

  const menus: MenuLink[] = [
    {
      label: __("Channel Library", "tubebay"),
      path: "/library",
    },
    {
      label: __("Settings", "tubebay"),
      path: "/settings",
    },
    {
      label: __("Logs", "tubebay"),
      path: "/logs",
    },
  ];

  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const basePath = "/" + (currentPath.split("/")[1] || "");
    setActiveTab(basePath);
  }, [currentPath]);

  return (
    <>
      <div className="tubebay-bg-white tubebay-p-0 !tubebay-border-0 !tubebay-border-b !tubebay-border-gray-300 tubebay-z-50 tubebay-relative">
        <div className="tubebay-flex tubebay-px-[12px] tubebay-justify-between tubebay-items-center tubebay-flex-wrap md:tubebay-flex-nowrap tubebay-gap-[4px] tubebay-relative">
          <div className="tubebay-flex tubebay-items-center tubebay-gap-[4px] tubebay-py-[12px]">
            <span className="tubebay-font-[700] tubebay-text-[16px] tubebay-text-gray-900">
              {store.pluginData?.plugin_name || "TubeBay"}
            </span>
          </div>
          <div
            className={`tubebay-flex-1 md:tubebay-flex-none tubebay-flex-col md:tubebay-flex-row tubebay-justify-stretch md:tubebay-items-center tubebay-absolute md:tubebay-relative tubebay-top-[102%] md:tubebay-top-auto tubebay-left-0 tubebay-w-full md:tubebay-w-auto tubebay-gap-0 md:tubebay-gap-[6px] tubebay-bg-white !tubebay-border-0 ${
              isMobileMenuOpen
                ? "tubebay-flex"
                : "tubebay-hidden md:tubebay-flex"
            }`}
          >
            <nav className="tubebay-items-stretch md:tubebay-items-center tubebay-gap-0 tubebay-flex tubebay-flex-col md:tubebay-flex-row tubebay-w-full">
              {menus.map((menu) => (
                <span
                  key={menu.path}
                  className={`tubebay-text-default tubebay-font-[700]
                    tubebay-cursor-pointer tubebay-py-[8px] tubebay-px-[16px] tubebay-border-b md:tubebay-border-b-0 tubebay-border-gray-300 last:tubebay-border-gray-300 ${
                      activeTab === menu.path
                        ? "tubebay-text-blue-800 tubebay-bg-gray-100 tubebay-rounded-[0] md:tubebay-rounded-[8px]"
                        : "tubebay-text-gray-800 hover:tubebay-text-blue-800"
                    }`}
                  onClick={() => {
                    navigate(menu.path);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {menu.label}
                </span>
              ))}
            </nav>
          </div>
          <button
            className="tubebay-flex md:tubebay-hidden tubebay-items-center tubebay-gap-[2px] tubebay-text-gray-800 hover:tubebay-text-blue-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="tubebay-transition-all tubebay-duration-300 tubebay-ease-in-out" />
            ) : (
              <MenuIcon className="tubebay-transition-all tubebay-duration-300 tubebay-ease-in-out" />
            )}
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div
          className="tubebay-fixed tubebay-top-0 tubebay-left-0 tubebay-w-full tubebay-h-full tubebay-bg-black tubebay-opacity-60 tubebay-z-40 md:tubebay-hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
