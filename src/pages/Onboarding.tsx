import { FC, useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import { useWpabStore, useWpabStoreActions } from "../store/wpabStore";
import { useYouTubeActions } from "../hooks/useYouTubeActions";
import { PluginSettings } from "../utils/types";
import Button from "../components/common/Button";
import { Stepper } from "../components/common/Stepper";
import ConnectAccountCard from "../components/settings/ConnectAccountCard";
import SyncPlacementCard from "../components/settings/SyncPlacementCard";
import {
  YouTubeFilledIcon,
  LinkIcon,
  RefreshHalfIcon,
  SlidersIcon,
  InfoIcon,
  TargetIcon,
  ShoppingBagIcon,
  BookIcon,
  ArrowRightIcon,
  HeadphonesIcon,
  CheckCircleIcon,
  RefreshIcon,
  FlightIcon,
} from "../components/common/Icons";

type SettingsData = Partial<PluginSettings>;

const WIZARD_STEPS = ["Connect YouTube", "Configure Settings", "Done"];

const Onboarding: FC = () => {
  const store = useWpabStore();
  const { plugin_settings: settings } = useWpabStore();
  const { updateStore } = useWpabStoreActions();
  const { connectYouTube } = useYouTubeActions();
  const { addToast } = useToast();

  // Whether the user has clicked "Start Setup Wizard"
  const [wizardStarted, setWizardStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Credential & connection state
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [editingConnection, setEditingConnection] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [tmpCredentials, setTmpCredentials] = useState({
    api_key: settings.api_key || "",
    channel_id: settings.channel_id || "",
  });

  const [tmpOtherSettings, setTmpOtherSettings] = useState({
    auto_sync: settings.auto_sync ?? true,
    video_placement: settings.video_placement || "below_gallery",
    cache_duration: settings.cache_duration || 12,
    debug_enableMode: settings.debug_enableMode ?? false,
    muted_autoplay: settings.muted_autoplay ?? true,
    show_controls: settings.show_controls ?? true,
  });

  const setSettings = (data: SettingsData) => {
    updateStore("plugin_settings", { ...settings, ...data });
  };

  // Auto-advance to step 2 when connection succeeds
  useEffect(() => {
    if (
      wizardStarted &&
      currentStep === 1 &&
      settings.connection_status === "connected"
    ) {
      setCurrentStep(2);
    }
  }, [settings.connection_status, wizardStarted]);

  const handleConnect = async () => {
    setSaving(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: SettingsData;
      }>({
        path: "/tubebay/v1/settings",
        method: "POST",
        data: {
          api_key: tmpCredentials.api_key,
          channel_id: tmpCredentials.channel_id,
        },
      });

      if (response.success) {
        addToast(response.message, "success");
        setSettings(response.data);
        setTmpCredentials({
          api_key: response.data.api_key || "",
          channel_id: response.data.channel_id || "",
        });
        setEditingConnection(false);
      }
    } catch (error) {
      addToast(`Error connecting: ${(error as Error).message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        channel_name?: string;
      }>({
        path: "/tubebay/v1/youtube/test-connection",
        method: "POST",
        data: {
          api_key: tmpCredentials.api_key,
          channel_id: tmpCredentials.channel_id,
        },
      });

      if (response.success) {
        addToast(
          `${response.message} Channel: ${
            response.channel_name || "Unknown"
          }. Click "Connect" to save this connection.`,
          "success",
        );
      }
    } catch (error) {
      addToast(`Connection Failed: ${(error as any).message}`, "error");
    } finally {
      setTesting(false);
    }
  };

  const handleSyncLibrary = async () => {
    setSyncing(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        videos: any[];
      }>({
        path: "/tubebay/v1/youtube/sync-library",
      });
      if (response.success) {
        addToast(
          `Successfully fetched and cached ${response.videos.length} videos.`,
          "success",
        );
      }
    } catch (error) {
      addToast(`Sync Failed: ${(error as any).message}`, "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: SettingsData;
      }>({
        path: "/tubebay/v1/settings",
        method: "POST",
        data: {
          auto_sync: tmpOtherSettings.auto_sync,
          video_placement: tmpOtherSettings.video_placement,
          cache_duration: tmpOtherSettings.cache_duration,
          debug_enableMode: tmpOtherSettings.debug_enableMode,
          muted_autoplay: tmpOtherSettings.muted_autoplay,
          show_controls: tmpOtherSettings.show_controls,
        },
      });

      if (response.success) {
        addToast(response.message, "success");
        setSettings(response.data);
        setTmpOtherSettings({
          auto_sync: response.data.auto_sync ?? true,
          video_placement: response.data.video_placement || "below_gallery",
          cache_duration: response.data.cache_duration || 12,
          debug_enableMode: response.data.debug_enableMode ?? false,
          muted_autoplay: response.data.muted_autoplay ?? true,
          show_controls: response.data.show_controls ?? true,
        });
      }
    } catch (error) {
      addToast(`Error saving settings: ${(error as Error).message}`, "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const credentialsChanged = () => {
    return (
      tmpCredentials.api_key !== (settings.api_key || "") ||
      tmpCredentials.channel_id !== (settings.channel_id || "")
    );
  };

  const handleFinish = async () => {
    await handleSaveSettings();
    // Mark onboarding as completed
    try {
      await apiFetch({
        path: "/tubebay/v1/settings",
        method: "POST",
        data: { is_onboarding_completed: true },
      });
      setSettings({ is_onboarding_completed: true });
    } catch (e) {
      // non-blocking
    }
    setCurrentStep(3);
  };

  // ─── Welcome Screen (before wizard starts) ───
  if (!wizardStarted) {
    return (
      <div className="tubebay-py-[64px] tubebay-px-[24px] tubebay-w-full tubebay-flex tubebay-flex-col tubebay-items-center tubebay-gap-[48px]">
        {/* Header Section */}
        <div className="tubebay-text-center">
          <div className="tubebay-inline-flex tubebay-items-center tubebay-justify-center tubebay-w-[72px] tubebay-h-[72px] tubebay-rounded-[16px] tubebay-bg-[#ff0000] tubebay-mb-[24px] tubebay-shadow-[0_8px_16px_rgba(255,0,0,0.2)]">
            <YouTubeFilledIcon size={40} />
          </div>
          <h1 className="tubebay-text-[48px] tubebay-leading-[48px] tubebay-font-bold tubebay-text-[#111827] tubebay-mb-[12px] tubebay-tracking-tight">
            Welcome to TubeBay
          </h1>
          <p className="tubebay-text-[20px] tubebay-leading-[32px] tubebay-text-[#4b5563] tubebay-max-w-[600px] tubebay-mx-auto tubebay-leading-relaxed">
            Connect your YouTube channel once, and seamlessly sync product
            videos across your entire WooCommerce store.
          </p>
        </div>

        {/* Features Grid */}
        <div className="tubebay-grid tubebay-grid-cols-1 md:tubebay-grid-cols-3 tubebay-gap-[24px] ">
          <div className="tubebay-bg-white tubebay-rounded-[16px] tubebay-p-[32px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm tubebay-flex tubebay-flex-col tubebay-items-start tubebay-justify-start tubebay-gap-[16px]">
            <div className="tubebay-w-[56px] tubebay-h-[56px] tubebay-bg-[#eff6ff] tubebay-rounded-[12px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-[#2563eb]">
              <LinkIcon size={20} className="!tubebay-stroke-[2.5px]" />
            </div>
            <h3 className="tubebay-t-4-bold tubebay-text-[#111827]">
              One-Time Connection
            </h3>
            <p className="tubebay-text-[14px] tubebay-leading-[22px] tubebay-text-[#4b5563]">
              Connect your YouTube account once and access all your videos
              instantly across products.
            </p>
          </div>

          <div className="tubebay-bg-white tubebay-rounded-[16px] tubebay-p-[32px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm tubebay-flex tubebay-flex-col tubebay-items-start tubebay-justify-start tubebay-gap-[16px]">
            <div className="tubebay-w-[56px] tubebay-h-[56px] tubebay-bg-[#f0fdf4] tubebay-rounded-[12px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-[#16a34a]">
              <RefreshIcon size={20} className="!tubebay-stroke-[2.5px]" />
            </div>
            <h3 className="tubebay-t-4-bold tubebay-text-[#111827]">
              Automatic Sync
            </h3>
            <p className="tubebay-text-[14px] tubebay-leading-[22px] tubebay-text-[#4b5563]">
              Keep your product videos up-to-date with automatic daily
              synchronization from YouTube.
            </p>
          </div>

          <div className="tubebay-bg-white tubebay-rounded-[16px] tubebay-p-[32px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm tubebay-flex tubebay-flex-col tubebay-items-start tubebay-justify-start tubebay-gap-[16px]">
            <div className="tubebay-w-[56px] tubebay-h-[56px] tubebay-bg-[#faf5ff] tubebay-rounded-[12px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-[#9333ea]">
              <SlidersIcon size={20} className="!tubebay-stroke-[2.5px]" />
            </div>
            <h3 className="tubebay-t-4-bold tubebay-text-[#111827]">
              Flexible Placement
            </h3>
            <p className="tubebay-text-[14px] tubebay-leading-[22px] tubebay-text-[#4b5563]">
              Choose where videos appear on your product pages with customizable
              placement options.
            </p>
          </div>
        </div>

        {/* System Requirements */}
        <div className=" tubebay-w-full tubebay-bg-[#f5f8ff] tubebay-rounded-[12px] tubebay-border tubebay-border-blue-100 tubebay-p-[24px] tubebay-flex tubebay-gap-[32px]">
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
                <ShoppingBagIcon
                  size={14}
                  className="tubebay-text-purple-500"
                />
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
        <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[48px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm tubebay-flex tubebay-flex-col tubebay-items-center tubebay-justify-center tubebay-gap-[16px]">
          <h2 className="tubebay-t-1 tubebay-text-[#111827] ">
            Ready to Get Started?
          </h2>
          <p className="tubebay-t-4 tubebay-text-[#4b5563]">
            Set up your YouTube connection in just a few simple steps.
          </p>
          <div className="tubebay-flex tubebay-flex-col tubebay-items-center tubebay-gap-[16px] tubebay-w-full tubebay-max-w-[360px] tubebay-mx-auto">
            <Button
              className="tubebay-w-full tubebay-py-[16px] tubebay-px-[32px] tubebay-text-4 tubebay-font-bold"
              color="primary"
              onClick={() => setWizardStarted(true)}
            >
              <FlightIcon size={18} className="tubebay-mr-[8px]" />
              Start Setup Wizard
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
  }

  // ─── Wizard Flow ───
  return (
    <div className="tubebay-p-[32px] tubebay-max-w-[760px] tubebay-mx-auto tubebay-w-full">
      {/* Header */}
      <div className="tubebay-text-center tubebay-mb-[16px]">
        <h1 className="tubebay-text-[26px] tubebay-font-bold tubebay-text-gray-900 tubebay-tracking-tight">
          Setup Wizard
        </h1>
        <p className="tubebay-text-[14px] tubebay-text-gray-500">
          Complete these steps to get TubeBay up and running.
        </p>
      </div>

      {/* Stepper */}
      <Stepper
        steps={WIZARD_STEPS}
        currentStep={currentStep}
        setStep={setCurrentStep}
      />

      {/* Step Content */}
      <div className="tubebay-mt-[24px]">
        {/* ─── Step 1: Connect YouTube ─── */}
        {currentStep === 1 && (
          <ConnectAccountCard
            settings={settings}
            tmpCredentials={tmpCredentials}
            setTmpCredentials={setTmpCredentials}
            editingConnection={editingConnection}
            setEditingConnection={setEditingConnection}
            saving={saving}
            testing={testing}
            handleConnect={handleConnect}
            handleTestConnection={handleTestConnection}
            credentialsChanged={credentialsChanged}
            connectYouTube={connectYouTube}
          />
        )}

        {/* ─── Step 2: Configure Settings ─── */}
        {currentStep === 2 && (
          <>
            <SyncPlacementCard
              settings={settings}
              tmpOtherSettings={tmpOtherSettings}
              setTmpOtherSettings={setTmpOtherSettings}
              syncing={syncing}
              handleSyncLibrary={handleSyncLibrary}
              hideHeader
              hideSyncRow
            />
            <div className="tubebay-flex tubebay-justify-end tubebay-mt-[20px]">
              <Button
                onClick={handleFinish}
                disabled={savingSettings}
                color="primary"
                className="tubebay-h-[44px] tubebay-px-[24px] tubebay-text-[14px] tubebay-font-bold"
              >
                {savingSettings ? "Saving..." : "Save & Finish"}
              </Button>
            </div>
          </>
        )}

        {/* ─── Step 3: Done ─── */}
        {currentStep === 3 && (
          <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-p-[48px] tubebay-border tubebay-border-gray-200 tubebay-shadow-sm tubebay-text-center">
            <div className="tubebay-inline-flex tubebay-items-center tubebay-justify-center tubebay-w-[64px] tubebay-h-[64px] tubebay-rounded-full tubebay-bg-green-100 tubebay-mb-[20px]">
              <CheckCircleIcon size={32} className="tubebay-text-green-600" />
            </div>
            <h2 className="tubebay-text-[22px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[8px]">
              You're All Set!
            </h2>
            <p className="tubebay-text-[15px] tubebay-text-gray-500 tubebay-mb-[28px] tubebay-max-w-[420px] tubebay-mx-auto">
              TubeBay is connected and configured. You can now assign YouTube
              videos to your WooCommerce products.
            </p>
            <Button
              color="primary"
              className="tubebay-h-[44px] tubebay-px-[24px] tubebay-text-[14px] tubebay-font-bold"
              onClick={() => window.location.reload()}
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
