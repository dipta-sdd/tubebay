import { FC } from "react";
import { __ } from "@wordpress/i18n";
import { useWpabStore } from "../store/wpabStore";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import {
  YouTubeFilledIcon,
  LinkIcon,
  RefreshHalfIcon,
  SlidersIcon,
  InfoIcon,
  TargetIcon,
  ShoppingBagIcon,
  FilePlayIcon,
  SettingsIcon,
  BookIcon,
  ArrowRightIcon,
  HeadphonesIcon,
} from "../components/common/Icons";

const Dashboard: FC = () => {
  const store = useWpabStore();
  const navigate = useNavigate();

  return (
    <div className="tubebay-p-[32px] tubebay-max-w-[760px] tubebay-mx-auto tubebay-w-full">
      {/* Header Section */}
      <div className="tubebay-text-center tubebay-mb-[48px] tubebay-mt-[16px]">
        <div className="tubebay-inline-flex tubebay-items-center tubebay-justify-center tubebay-w-[72px] tubebay-h-[72px] tubebay-rounded-[16px] tubebay-bg-[#ff0000] tubebay-mb-[24px] tubebay-shadow-[0_8px_16px_rgba(255,0,0,0.2)]">
          <YouTubeFilledIcon size={40} />
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
            <LinkIcon size={20} className="!tubebay-stroke-[2.5px]" />
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
            <RefreshHalfIcon size={20} className="!tubebay-stroke-[2.5px]" />
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
            <SlidersIcon size={20} className="!tubebay-stroke-[2.5px]" />
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
          <InfoIcon size={18} className="!tubebay-stroke-[2.5px]" />
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
              <TargetIcon size={14} className="tubebay-text-blue-500" />
              WordPress 5.8+
            </span>
            <span className="tubebay-inline-flex tubebay-items-center tubebay-gap-[6px] tubebay-bg-white tubebay-px-[10px] tubebay-py-[4px] tubebay-rounded-[6px] tubebay-text-[12px] tubebay-font-medium tubebay-text-gray-700 tubebay-border tubebay-border-gray-200">
              <ShoppingBagIcon size={14} className="tubebay-text-purple-500" />
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
            <FilePlayIcon size={18} className="tubebay-mr-[8px]" />
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
            <SettingsIcon
              size={18}
              className="tubebay-mr-[8px] tubebay-text-gray-500"
            />
            Skip Setup & Go to Settings
          </Button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="tubebay-grid tubebay-grid-cols-1 md:tubebay-grid-cols-2 tubebay-gap-[16px]">
        <button className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[20px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm hover:tubebay-shadow-md tubebay-transition-all tubebay-flex tubebay-items-center tubebay-gap-[16px] tubebay-text-left group">
          <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-blue-50 tubebay-rounded-[10px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-blue-600">
            <BookIcon size={20} className="!tubebay-stroke-[2.5px]" />
          </div>
          <div className="tubebay-flex-1">
            <h4 className="tubebay-text-[14px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[2px]">
              View Documentation
            </h4>
            <p className="tubebay-text-[12px] tubebay-text-gray-500">
              Learn how to use TubeBay with our comprehensive guides
            </p>
          </div>
          <ArrowRightIcon className="tubebay-text-gray-400 tubebay-transition-transform group-hover:tubebay-translate-x-1" />
        </button>

        <button className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[20px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm hover:tubebay-shadow-md tubebay-transition-all tubebay-flex tubebay-items-center tubebay-gap-[16px] tubebay-text-left group">
          <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-green-50 tubebay-rounded-[10px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-green-600">
            <HeadphonesIcon size={20} className="!tubebay-stroke-[2.5px]" />
          </div>
          <div className="tubebay-flex-1">
            <h4 className="tubebay-text-[14px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[2px]">
              Contact Support
            </h4>
            <p className="tubebay-text-[12px] tubebay-text-gray-500">
              Need help? Our support team is here to assist you
            </p>
          </div>
          <ArrowRightIcon className="tubebay-text-gray-400 tubebay-transition-transform group-hover:tubebay-translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
