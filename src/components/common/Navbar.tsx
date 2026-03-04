import { useState, useEffect, FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { __ } from "@wordpress/i18n";
import { useWpabStore } from "../../store/wpabStore";
import { MenuIcon, CloseIcon, BookIcon, HelpStethoscopeIcon, SupportIcon } from "./Icons";
// @ts-ignore
import logo_32px from "./../../../assets/img/TubeBay.svg";

interface MenuLink {
  label: string;
  path: string;
  icon?: FC<{ size?: number; className?: string }>;
  isExternal?: boolean;
}

const Navbar: FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const store = useWpabStore();


  const secondaryMenus: MenuLink[] = [
    {
      label: __("Documentation", "tubebay"),
      path: "https://docs.wpanchorbay.com/tubebay/",
      icon: BookIcon,
      isExternal: true,
    },
    {
      label: __("Support", "tubebay"),
      path: "https://wpanchorbay.com/support/",
      icon: SupportIcon,
      isExternal: true,
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
      <div data-tubebay="navbar" className="tubebay-bg-white tubebay-p-0 !tubebay-border-0 !tubebay-border-b !tubebay-border-gray-300 tubebay-z-50 tubebay-relative">
        <div className="tubebay-flex tubebay-pl-[24px] tubebay-pr-[12px] tubebay-justify-between tubebay-items-center tubebay-flex-wrap md:tubebay-flex-nowrap tubebay-gap-[4px] tubebay-relative tubebay-max-width">
          <div className="tubebay-flex tubebay-items-center tubebay-gap-[4px] tubebay-py-[12px]">
            <span className="tubebay-font-[700] tubebay-text-[16px] tubebay-text-gray-900">
              <a href="https://wpanchorbay.com/products/tubebay"><img src={logo_32px} alt="TubeBay" className="tubebay-h-[40px]" /></a>
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
              
              <div className="tubebay-flex tubebay-flex-col md:tubebay-flex-row tubebay-items-stretch md:tubebay-items-center tubebay-gap-0 md:tubebay-gap-[8px]">
                {secondaryMenus.map((menu) => (
                  <a
                    key={menu.label}
                    href={menu.path}
                    target={menu.isExternal ? "_blank" : undefined}
                    rel={menu.isExternal ? "noopener noreferrer" : undefined}
                    className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-text-gray-600 hover:tubebay-text-blue-800 tubebay-font-[600] tubebay-text-[14px] tubebay-py-[8px] tubebay-px-[16px] tubebay-no-underline tubebay-transition-colors"
                  >
                    {menu.icon && <menu.icon size={18} />}
                    {menu.label}
                  </a>
                ))}
              </div>
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
