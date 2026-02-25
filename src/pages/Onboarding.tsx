import { FC } from "react";
import { __ } from "@wordpress/i18n";
import { useWpabStore } from "../store/wpabStore";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const Dashboard: FC = () => {
  const store = useWpabStore();
  const navigate = useNavigate();

  return (
    <div className="tubebay-p-[32px] tubebay-max-w-[760px] tubebay-mx-auto tubebay-w-full">
      {/* Header Section */}
      <div className="tubebay-text-center tubebay-mb-[48px] tubebay-mt-[16px]">
        <div className="tubebay-inline-flex tubebay-items-center tubebay-justify-center tubebay-w-[72px] tubebay-h-[72px] tubebay-rounded-[16px] tubebay-bg-[#ff0000] tubebay-mb-[24px] tubebay-shadow-[0_8px_16px_rgba(255,0,0,0.2)]">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
        <h1 className="tubebay-text-[32px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[12px] tubebay-tracking-tight">
          Welcome to {store.pluginData?.plugin_name || "TubeBay"}
        </h1>
        <p className="tubebay-text-[16px] tubebay-text-gray-600 tubebay-max-w-[600px] tubebay-mx-auto tubebay-leading-relaxed">
          Connect your YouTube channel once, and seamlessly sync product videos
          across your entire WooCommerce store.
        </p>
      </div>

      {/* Features Grid */}
      <div className="tubebay-grid tubebay-grid-cols-1 md:tubebay-grid-cols-3 tubebay-gap-[20px] tubebay-mb-[32px]">
        {/* Card 1 */}
        <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[24px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm">
          <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-blue-50 tubebay-rounded-[10px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-mb-[16px] tubebay-text-blue-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
          <h3 className="tubebay-text-[16px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[8px]">
            One-Time Connection
          </h3>
          <p className="tubebay-text-[13px] tubebay-text-gray-600 tubebay-leading-relaxed">
            Connect your YouTube account once and access all your videos
            instantly across products.
          </p>
        </div>

        {/* Card 2 */}
        <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[24px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm">
          <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-green-50 tubebay-rounded-[10px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-mb-[16px] tubebay-text-green-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </div>
          <h3 className="tubebay-text-[16px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[8px]">
            Automatic Sync
          </h3>
          <p className="tubebay-text-[13px] tubebay-text-gray-600 tubebay-leading-relaxed">
            Keep your product videos up-to-date with automatic daily
            synchronization from YouTube.
          </p>
        </div>

        {/* Card 3 */}
        <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[24px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm">
          <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-purple-50 tubebay-rounded-[10px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-mb-[16px] tubebay-text-purple-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="21" x2="4" y2="14"></line>
              <line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line>
              <line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line>
              <line x1="9" y1="8" x2="15" y2="8"></line>
              <line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
          </div>
          <h3 className="tubebay-text-[16px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[8px]">
            Flexible Placement
          </h3>
          <p className="tubebay-text-[13px] tubebay-text-gray-600 tubebay-leading-relaxed">
            Choose where videos appear on your product pages with customizable
            placement options.
          </p>
        </div>
      </div>

      {/* System Requirements */}
      <div className="tubebay-bg-[#f5f8ff] tubebay-rounded-[12px] tubebay-border tubebay-border-blue-100 tubebay-p-[24px] tubebay-mb-[32px] tubebay-flex tubebay-gap-[16px]">
        <div className="tubebay-w-[32px] tubebay-h-[32px] tubebay-bg-blue-600 tubebay-rounded-full tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-white tubebay-shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </div>
        <div>
          <h4 className="tubebay-text-[15px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[4px]">
            System Requirements
          </h4>
          <p className="tubebay-text-[13px] tubebay-text-gray-600 tubebay-mb-[16px]">
            TubeBay requires WooCommerce to be installed and activated on your
            WordPress site.
          </p>
          <div className="tubebay-flex tubebay-flex-wrap tubebay-gap-[8px]">
            <span className="tubebay-inline-flex tubebay-items-center tubebay-gap-[6px] tubebay-bg-white tubebay-px-[10px] tubebay-py-[4px] tubebay-rounded-[6px] tubebay-text-[12px] tubebay-font-medium tubebay-text-gray-700 tubebay-border tubebay-border-gray-200">
              <svg
                className="tubebay-text-blue-500"
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
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
              WordPress 5.8+
            </span>
            <span className="tubebay-inline-flex tubebay-items-center tubebay-gap-[6px] tubebay-bg-white tubebay-px-[10px] tubebay-py-[4px] tubebay-rounded-[6px] tubebay-text-[12px] tubebay-font-medium tubebay-text-gray-700 tubebay-border tubebay-border-gray-200">
              <svg
                className="tubebay-text-purple-500"
                width="14"
                height="14"
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
              WooCommerce 6.0+
            </span>
            <span className="tubebay-inline-flex tubebay-items-center tubebay-gap-[6px] tubebay-bg-white tubebay-px-[10px] tubebay-py-[4px] tubebay-rounded-[6px] tubebay-text-[12px] tubebay-font-medium tubebay-text-gray-700 tubebay-border tubebay-border-gray-200">
              <span className="tubebay-text-indigo-500 tubebay-font-bold tubebay-text-[10px] tubebay-tracking-tighter tubebay-bg-indigo-50 tubebay-px-[4px] tubebay-rounded tubebay-border tubebay-border-indigo-100">
                PHP
              </span>
              PHP 7.4+
            </span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[40px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm tubebay-text-center tubebay-mb-[32px]">
        <h2 className="tubebay-text-[22px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[8px]">
          Ready to Get Started?
        </h2>
        <p className="tubebay-text-[15px] tubebay-text-gray-500 tubebay-mb-[24px]">
          Set up your YouTube connection in just a few simple steps.
        </p>
        <div className="tubebay-flex tubebay-flex-col tubebay-items-center tubebay-gap-[16px] tubebay-w-full tubebay-max-w-[360px] tubebay-mx-auto">
          <Button
            className="tubebay-w-full tubebay-h-[48px] tubebay-text-[15px] tubebay-font-bold tubebay-bg-blue-600 hover:tubebay-bg-blue-700 tubebay-shadow-[0_4px_12px_rgba(37,99,235,0.2)] hover:tubebay-shadow-[0_6px_16px_rgba(37,99,235,0.3)]"
            color="primary"
            onClick={() => navigate("/settings")}
          >
            <svg
              className="tubebay-mr-[8px]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
              <polygon points="12 16 16 12 12 8 12 16"></polygon>
            </svg>
            Start Setup Wizard
          </Button>

          <div className="tubebay-flex tubebay-items-center tubebay-w-full">
            <div className="tubebay-flex-1 tubebay-h-[1px] tubebay-bg-gray-200"></div>
            <span className="tubebay-px-[16px] tubebay-text-[12px] tubebay-font-bold tubebay-text-gray-400 tubebay-tracking-wider">
              OR
            </span>
            <div className="tubebay-flex-1 tubebay-h-[1px] tubebay-bg-gray-200"></div>
          </div>

          <Button
            variant="outline"
            className="tubebay-w-full tubebay-h-[48px] tubebay-text-[14px] tubebay-font-bold tubebay-text-gray-700 tubebay-border-gray-300 hover:tubebay-bg-gray-50"
            onClick={() => navigate("/settings")}
          >
            <svg
              className="tubebay-mr-[8px] tubebay-text-gray-500"
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
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Skip Setup & Go to Settings
          </Button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="tubebay-grid tubebay-grid-cols-1 md:tubebay-grid-cols-2 tubebay-gap-[16px]">
        <button className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[20px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm hover:tubebay-shadow-md tubebay-transition-all tubebay-flex tubebay-items-center tubebay-gap-[16px] tubebay-text-left group">
          <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-blue-50 tubebay-rounded-[10px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-blue-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          </div>
          <div className="tubebay-flex-1">
            <h4 className="tubebay-text-[14px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[2px]">
              View Documentation
            </h4>
            <p className="tubebay-text-[12px] tubebay-text-gray-500">
              Learn how to use TubeBay with our comprehensive guides
            </p>
          </div>
          <svg
            className="tubebay-text-gray-400 tubebay-transition-transform group-hover:tubebay-translate-x-1"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>

        <button className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[20px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm hover:tubebay-shadow-md tubebay-transition-all tubebay-flex tubebay-items-center tubebay-gap-[16px] tubebay-text-left group">
          <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-green-50 tubebay-rounded-[10px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-green-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2v-8z"></path>
              <path d="M22 12h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v-8z"></path>
              <path d="M12 2C6.48 2 2 6.48 2 12"></path>
              <path d="M22 12c0-5.52-4.48-10-10-10"></path>
            </svg>
          </div>
          <div className="tubebay-flex-1">
            <h4 className="tubebay-text-[14px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[2px]">
              Contact Support
            </h4>
            <p className="tubebay-text-[12px] tubebay-text-gray-500">
              Need help? Our support team is here to assist you
            </p>
          </div>
          <svg
            className="tubebay-text-gray-400 tubebay-transition-transform group-hover:tubebay-translate-x-1"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
