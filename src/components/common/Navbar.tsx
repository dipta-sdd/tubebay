import { useState, useEffect, FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { __ } from "@wordpress/i18n";
import { useWpabStore } from "../../store/wpabStore";
import {
  MenuIcon,
  CloseIcon,
  BookIcon,
  SupportIcon,
  ChannelLibraryIcon,
  SettingsIcon,
  HelpStethoscopeIcon,
  ShoppingBagIcon,
} from "./Icons";
// @ts-ignore
import logo_32px from "./../../../assets/img/TubeBay.svg";

interface MenuLink {
  label: string;
  path: string;
  icon?: FC<{ size?: number; className?: string }>;
  isExternal?: boolean;
}

interface SidebarNavItem {
  label: string;
  path: string;
  icon: JSX.Element;
  isExternal?: boolean;
}

const Navbar: FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { products_url } = useWpabStore();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = "/" + (location.pathname.split("/")[1] || "");

  // External links shown on large screens in the navbar
  const externalLinks: MenuLink[] = [
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

  // Navigation items for mobile drawer (mirrors sidebar)
  const mobileNavItems: SidebarNavItem[] = [
    {
      label: "Channel Library",
      path: "/",
      icon: <ChannelLibraryIcon />,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: <SettingsIcon />,
    },
    {
      label: "Help & Diagnostics",
      path: "/logs",
      icon: <HelpStethoscopeIcon />,
    },
    {
      label: "Go to Products",
      path: products_url,
      icon: <ShoppingBagIcon />,
      isExternal: true,
    },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div
        data-tubebay="navbar"
        className="tubebay-bg-white tubebay-p-0 !tubebay-border-0 !tubebay-border-b !tubebay-border-gray-300 tubebay-z-50 tubebay-relative"
      >
        <div className="tubebay-flex tubebay-pl-[24px] tubebay-pr-[12px] tubebay-justify-between tubebay-items-center tubebay-flex-wrap md:tubebay-flex-nowrap tubebay-gap-[4px] tubebay-relative tubebay-max-width">
          {/* Logo */}
          <div className="tubebay-flex tubebay-items-center tubebay-gap-[4px] tubebay-py-[12px]">
            <span className="tubebay-font-[700] tubebay-text-[16px] tubebay-text-gray-900">
              <a href="https://wpanchorbay.com/products/tubebay">
                <img
                  src={logo_32px}
                  alt="TubeBay"
                  className="tubebay-h-[40px]"
                />
              </a>
            </span>
          </div>

          {/* Desktop external links - hidden on small screens */}
          <div className="tubebay-hidden lg:tubebay-flex tubebay-items-center tubebay-gap-[8px]">
            {externalLinks.map((menu) => (
              <a
                key={menu.label}
                href={menu.path}
                target="_blank"
                rel="noopener noreferrer"
                className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-text-gray-600 hover:tubebay-text-blue-800 tubebay-font-[600] tubebay-text-[14px] tubebay-py-[8px] tubebay-px-[16px] tubebay-no-underline tubebay-transition-colors"
              >
                {menu.icon && <menu.icon size={18} />}
                {menu.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger - visible only on small screens */}
          <button
            className="tubebay-flex lg:tubebay-hidden tubebay-items-center tubebay-gap-[2px] tubebay-text-gray-800 hover:tubebay-text-blue-800 tubebay-bg-transparent tubebay-border-none tubebay-cursor-pointer tubebay-p-[8px]"
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

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="tubebay-fixed tubebay-top-0 tubebay-left-0 tubebay-w-full tubebay-h-full tubebay-bg-black/50 tubebay-z-[9998] lg:tubebay-hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in drawer */}
          <div className="tubebay-fixed tubebay-top-0 tubebay-right-0 tubebay-w-[280px] tubebay-h-full tubebay-bg-white tubebay-z-[9999] tubebay-shadow-2xl tubebay-flex tubebay-flex-col tubebay-animate-slide-in-right lg:tubebay-hidden">
            {/* Drawer header */}
            <div className="tubebay-flex tubebay-items-center tubebay-justify-between tubebay-px-[20px] tubebay-py-[16px] tubebay-border-b tubebay-border-gray-200">
              <span className="tubebay-font-bold tubebay-text-[16px] tubebay-text-gray-900">
                Menu
              </span>
              <button
                className="tubebay-bg-transparent tubebay-border-none tubebay-cursor-pointer tubebay-p-[4px] tubebay-text-gray-600 hover:tubebay-text-gray-900 tubebay-transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Navigation items */}
            <nav className="tubebay-flex tubebay-flex-col tubebay-gap-[4px] tubebay-p-[12px] tubebay-flex-1">
              {mobileNavItems.map((item) => {
                const isActive =
                  currentPath === item.path ||
                  (item.path === "/" && currentPath === "/library");
                const isExternal =
                  item.isExternal ||
                  item.path.startsWith("http") ||
                  item.path.includes("wp-admin");

                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      if (isExternal) {
                        window.location.href = item.path;
                      } else {
                        navigate(item.path);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`tubebay-flex tubebay-items-center tubebay-gap-[12px] tubebay-px-[16px] tubebay-py-[12px] tubebay-rounded-[12px] tubebay-text-[14px] tubebay-font-bold tubebay-w-full tubebay-text-left tubebay-border-0 tubebay-cursor-pointer tubebay-transition-all tubebay-duration-150 ${
                      isActive
                        ? "tubebay-bg-primary tubebay-text-white tubebay-shadow-sm"
                        : "tubebay-bg-transparent tubebay-text-gray-700 hover:tubebay-bg-gray-100"
                    }`}
                    style={{ outline: "none" }}
                  >
                    <span
                      className={
                        isActive
                          ? "tubebay-text-white"
                          : "tubebay-text-gray-500"
                      }
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* External links at the bottom of drawer */}
            <div className="tubebay-border-t tubebay-border-gray-200 tubebay-p-[12px] tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
              {externalLinks.map((menu) => (
                <a
                  key={menu.label}
                  href={menu.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tubebay-flex tubebay-items-center tubebay-gap-[12px] tubebay-text-gray-600 hover:tubebay-text-blue-800 tubebay-font-semibold tubebay-text-[14px] tubebay-py-[10px] tubebay-px-[16px] tubebay-no-underline tubebay-transition-colors tubebay-rounded-[12px] hover:tubebay-bg-gray-50"
                >
                  {menu.icon && <menu.icon size={18} />}
                  {menu.label}
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
