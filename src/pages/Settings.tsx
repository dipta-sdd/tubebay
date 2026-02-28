import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import { Input } from "../components/common/Input";
import Button from "../components/common/Button";
import { NumberInput } from "../components/common/NumberInput";
import Page from "../components/common/Page";
import {
  LinkIcon,
  RefreshIcon,
  YouTubeIcon,
  ClockIcon,
  HourglassIcon,
  MapPinIcon,
  GoogleIcon,
  CheckCircleIcon,
} from "../components/common/Icons";
import Card from "../components/common/Card";
import { Switch } from "../components/common/Switch";
import Select from "../components/common/Select";
import { useWpabStore, useWpabStoreActions } from "../store/wpabStore";
import { PluginSettings } from "../utils/types";
type SettingsData = Partial<PluginSettings>;

export default function Settings() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editingConnection, setEditingConnection] = useState(false);

  const { plugin_settings: settings } = useWpabStore();
  const { updateStore } = useWpabStoreActions();

  const setSettings = (data: SettingsData) => {
    updateStore("plugin_settings", {
      ...settings,
      ...data,
    });
  };

  // Separate temp state for credentials
  const [tmpCredentials, setTmpCredentials] = useState({
    api_key: settings.api_key || "",
    channel_id: settings.channel_id || "",
  });

  // Separate temp state for other settings
  const [tmpOtherSettings, setTmpOtherSettings] = useState({
    auto_sync: settings.auto_sync ?? true,
    video_placement: settings.video_placement || "below_gallery",
    cache_duration: settings.cache_duration || 12,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiFetch<SettingsData>({
        path: "/tubebay/v1/settings",
      });

      const creds = {
        api_key: response.api_key || "",
        channel_id: response.channel_id || "",
      };
      const other = {
        auto_sync: response.auto_sync !== undefined ? response.auto_sync : true,
        video_placement: response.video_placement || "below_gallery",
        cache_duration: response.cache_duration || 12,
      };

      setTmpCredentials(creds);
      setTmpOtherSettings(other);
      setSettings(response);
    } catch (error) {
      addToast(`Error fetching settings: ${(error as Error).message}`, "error");
    } finally {
      setLoading(false);
    }
  };

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
        },
      });

      if (response.success) {
        addToast(response.message, "success");
        setSettings(response.data);
        setTmpOtherSettings({
          auto_sync: response.data.auto_sync ?? true,
          video_placement: response.data.video_placement || "below_gallery",
          cache_duration: response.data.cache_duration || 12,
        });
      }
    } catch (error) {
      addToast(`Error saving settings: ${(error as Error).message}`, "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);

    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        channel_name?: string;
        channel_description?: string;
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

  const credentialsChanged = () => {
    return (
      tmpCredentials.api_key !== (settings.api_key || "") ||
      tmpCredentials.channel_id !== (settings.channel_id || "")
    );
  };

  const otherSettingsChanged = () => {
    return (
      tmpOtherSettings.auto_sync !== (settings.auto_sync ?? true) ||
      tmpOtherSettings.video_placement !==
        (settings.video_placement || "below_gallery") ||
      tmpOtherSettings.cache_duration !== (settings.cache_duration || 12)
    );
  };

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <Page>
      <div className="">
        <h1 className="tubebay-t-1">TubeBay Settings</h1>
        <p className="tubebay-t-4 tubebay-text-secondary">
          Connect your YouTube channel once, sync everywhere.
        </p>
      </div>

      {/* Connect Account Card */}
      <Card className="tubebay-flex tubebay-flex-col tubebay-items-center">
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-mb-[32px]">
          <LinkIcon size={24} className="tubebay-text-[#3858e9]" />
          <h2 className="tubebay-text-[22px] tubebay-font-bold tubebay-text-[#111827]">
            Connect Account
          </h2>
        </div>

        {!editingConnection &&
        settings.connection_status === "connected" &&
        settings.channel_name ? (
          <div className="tubebay-w-full tubebay-flex tubebay-flex-col tubebay-items-center tubebay-gap-[24px]">
            {/* Connected Confirmation Box */}
            <div className="tubebay-w-full tubebay-max-w-[480px] tubebay-bg-[#f0fdf4] tubebay-border tubebay-border-[#dcfce7] tubebay-rounded-[16px] tubebay-p-[32px] tubebay-flex tubebay-flex-col tubebay-items-center tubebay-gap-[16px]">
              <div className="tubebay-flex tubebay-items-center tubebay-gap-[-8px]">
                <div className="tubebay-bg-[#22c55e] tubebay-text-white tubebay-rounded-full tubebay-p-[2px] tubebay-z-10 tubebay-border-[4px] tubebay-border-[#f0fdf4]">
                  <CheckCircleIcon size={44} />
                </div>
                <div className="tubebay-bg-[#d92121] tubebay-text-white tubebay-rounded-[12px] tubebay-p-[12px] tubebay-ml-[-12px]">
                  <YouTubeIcon size={24} fill="white" stroke="none" />
                </div>
              </div>

              <div className="tubebay-text-center">
                <h3 className="tubebay-text-[18px] tubebay-font-bold tubebay-text-[#111827] tubebay-mb-[4px]">
                  YouTube Account Connected
                </h3>
                <div className="tubebay-flex tubebay-items-center tubebay-justify-center tubebay-gap-[8px]">
                  <span className="tubebay-text-[14px] tubebay-text-gray-600">
                    {settings.channel_name}
                  </span>
                  <span className="tubebay-bg-[#dcfce7] tubebay-text-[#15803d] tubebay-text-[12px] tubebay-font-bold tubebay-px-[8px] tubebay-py-[2px] tubebay-rounded-full">
                    Connected
                  </span>
                </div>
              </div>
            </div>

            {/* Change Account Button */}
            <Button
              onClick={() => setEditingConnection(true)}
              className="tubebay-w-full tubebay-max-w-[480px] !tubebay-bg-[#d92121] hover:!tubebay-bg-[#b91c1c] tubebay-text-white tubebay-h-[56px] tubebay-rounded-[12px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-gap-[12px] tubebay-text-[16px] tubebay-font-bold"
            >
              <div className="tubebay-bg-white/10 tubebay-rounded-full tubebay-p-[6px]">
                <GoogleIcon size={20} className="tubebay-text-white" />
              </div>
              Change Google Account
            </Button>
          </div>
        ) : (
          <div className="tubebay-w-full tubebay-flex tubebay-flex-col tubebay-gap-[20px]">
            <div>
              <Input
                label="Google Cloud API Key"
                type="password"
                value={tmpCredentials.api_key}
                onChange={(e) =>
                  setTmpCredentials({
                    ...tmpCredentials,
                    api_key: (e.target as HTMLInputElement).value,
                  })
                }
                placeholder="AIzaSyB-xxxxxxxxxxxxxxx"
              />
              <p className="tubebay-text-[12px] tubebay-text-gray-500 tubebay-mt-[4px]">
                Requires YouTube Data API v3 enabled.
              </p>
            </div>

            <Input
              label="YouTube Channel ID"
              value={tmpCredentials.channel_id}
              onChange={(e) =>
                setTmpCredentials({
                  ...tmpCredentials,
                  channel_id: (e.target as HTMLInputElement).value,
                })
              }
              placeholder="UCxxxxxxxxxxxxxxx"
            />

            <div className="tubebay-flex tubebay-gap-[12px] tubebay-mt-[8px]">
              <Button
                onClick={handleConnect}
                disabled={saving || !credentialsChanged()}
                color="primary"
              >
                {saving ? "Connecting..." : "Connect"}
              </Button>
              <Button
                onClick={handleTestConnection}
                disabled={
                  testing ||
                  !tmpCredentials.api_key ||
                  !tmpCredentials.channel_id
                }
                color="secondary"
                variant="outline"
              >
                {testing ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Sync Settings Card */}
      <Card className="tubebay-flex tubebay-flex-col tubebay-gap-[32px]">
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-justify-between">
          <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px]">
            {/* <RefreshIcon size={24} className="tubebay-text-gray-700" /> */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3711 6.50781C19.4961 6.84766 19.3906 7.22656 19.1211 7.46875L17.4297 9.00781C17.4727 9.33203 17.4961 9.66406 17.4961 10C17.4961 10.3359 17.4727 10.668 17.4297 10.9922L19.1211 12.5312C19.3906 12.7734 19.4961 13.1523 19.3711 13.4922C19.1992 13.957 18.9922 14.4023 18.7539 14.832L18.5703 15.1484C18.3125 15.5781 18.0234 15.9844 17.707 16.3672C17.4766 16.6484 17.0938 16.7422 16.75 16.6328L14.5742 15.9414C14.0508 16.3438 13.4727 16.6797 12.8555 16.9336L12.3672 19.1641C12.2891 19.5195 12.0156 19.8008 11.6563 19.8594C11.1172 19.9492 10.5625 19.9961 9.9961 19.9961C9.4297 19.9961 8.87501 19.9492 8.33595 19.8594C7.97657 19.8008 7.70314 19.5195 7.62501 19.1641L7.13673 16.9336C6.51954 16.6797 5.94142 16.3438 5.41798 15.9414L3.2461 16.6367C2.90235 16.7461 2.51954 16.6484 2.28907 16.3711C1.97267 15.9883 1.6836 15.582 1.42579 15.1523L1.2422 14.8359C1.00392 14.4062 0.796885 13.9609 0.62501 13.4961C0.50001 13.1562 0.605479 12.7773 0.87501 12.5352L2.56642 10.9961C2.52345 10.668 2.50001 10.3359 2.50001 10C2.50001 9.66406 2.52345 9.33203 2.56642 9.00781L0.87501 7.46875C0.605479 7.22656 0.50001 6.84766 0.62501 6.50781C0.796885 6.04297 1.00392 5.59766 1.2422 5.16797L1.42579 4.85156C1.6836 4.42188 1.97267 4.01562 2.28907 3.63281C2.51954 3.35156 2.90235 3.25781 3.2461 3.36719L5.42189 4.05859C5.94532 3.65625 6.52345 3.32031 7.14064 3.06641L7.62892 0.835938C7.70704 0.480469 7.98048 0.199219 8.33985 0.140625C8.87892 0.046875 9.4336 0 10 0C10.5664 0 11.1211 0.046875 11.6602 0.136719C12.0195 0.195312 12.293 0.476562 12.3711 0.832031L12.8594 3.0625C13.4766 3.31641 14.0547 3.65234 14.5781 4.05469L16.7539 3.36328C17.0977 3.25391 17.4805 3.35156 17.7109 3.62891C18.0274 4.01172 18.3164 4.41797 18.5742 4.84766L18.7578 5.16406C18.9961 5.59375 19.2031 6.03906 19.375 6.50391L19.3711 6.50781ZM10 13.125C11.7247 13.125 13.125 11.7247 13.125 10C13.125 8.27527 11.7247 6.875 10 6.875C8.27528 6.875 6.87501 8.27527 6.87501 10C6.87501 11.7247 8.27528 13.125 10 13.125Z"
                fill="#4B5563"
              />
            </svg>

            <h2 className="tubebay-t-3">Sync & Placement Settings</h2>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={savingSettings || !otherSettingsChanged()}
            color="primary"
          >
            {savingSettings ? "Saving..." : "Save Settings"}
          </Button>
        </div>
        <div className="tubebay-flex tubebay-items-start tubebay-justify-between ">
          <div className="tubebay-flex tubebay-gap-[12px]">
            <div className="tubebay-bg-[#f5f3ff] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
              <RefreshIcon size={18} className="tubebay-text-[#7c3aed]" />
            </div>
            <div className="tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
              <h3 className="tubebay-t-4-bold tubebay-text-color-default">
                Automatic Daily Sync
              </h3>
              <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[540px]">
                Keep your video library up-to-date automatically. TubeBay will
                sync new videos from your YouTube channel every 24 hours.
              </p>
              <div className="tubebay-flex tubebay-items-center tubebay-gap-[6px] tubebay-mt-[4px]">
                <ClockIcon size={14} className="tubebay-text-gray-400" />
                <span className="tubebay-text-[12px] tubebay-text-gray-400">
                  Next sync: Today at 3:00 AM
                </span>
              </div>
            </div>
          </div>
          <Switch
            checked={!!tmpOtherSettings.auto_sync}
            onChange={(checked) =>
              setTmpOtherSettings({ ...tmpOtherSettings, auto_sync: checked })
            }
            className={
              tmpOtherSettings.auto_sync
                ? "tubebay-bg-[#3858e9]"
                : "tubebay-bg-gray-200"
            }
          />
        </div>
        {/* Cache Settings Row */}
        {/* <div className="tubebay-flex tubebay-items-start tubebay-justify-between ">
          <div className="tubebay-flex tubebay-gap-[12px]">
            <div className="tubebay-bg-[#eff6ff] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
              <HourglassIcon size={18} className="tubebay-text-[#3b82f6]" />
            </div>
            <div className="tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
              <h3 className="tubebay-t-4-bold tubebay-text-color-default">
                Cache Duration
              </h3>
              <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[540px]">
                How long to store fetched videos locally before querying YouTube
                again.
              </p>
              <div className="tubebay-mt-[8px] tubebay-w-[120px]">
                <NumberInput
                  value={tmpSettings.cache_duration}
                  onChange={(val) =>
                    setTmpSettings({ ...tmpSettings, cache_duration: val || 12 })
                  }
                  min={1}
                  max={168}
                  className="tubebay-h-[36px]"
                />
              </div>
            </div>
          </div>
          <span className="tubebay-text-[12px] tubebay-font-medium tubebay-text-gray-400 tubebay-mt-[4px]">
            Hours
          </span>
        </div> */}
        {/* Manual Sync Row */}
        <div className="tubebay-flex tubebay-items-start tubebay-justify-between tubebay-border-b-2 tubebay-border-[#f2f3f5] tubebay-pb-[20px]">
          <div className="tubebay-flex tubebay-gap-[12px]">
            <div className="tubebay-bg-[#f0fdf4] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
              <RefreshIcon size={18} className="tubebay-text-[#22c55e]" />
            </div>
            <div className="tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
              <h3 className="tubebay-t-4-bold tubebay-text-color-default">
                Force Sync Library
              </h3>
              <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[540px]">
                Manually refresh your video library now if you've recently added
                videos to your YouTube channel.
              </p>
            </div>
          </div>
          <Button
            onClick={handleSyncLibrary}
            disabled={syncing || !settings.api_key || !settings.channel_id}
            color="secondary"
            variant="outline"
            className="tubebay-h-[38px] tubebay-px-[16px] tubebay-text-[13px] tubebay-font-bold"
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>{" "}
        {/* Global Video Placement Row */}
        <div className="tubebay-flex tubebay-flex-col tubebay-gap-[16px]">
          <div className="tubebay-flex tubebay-gap-[12px]">
            <div className="tubebay-bg-[#fff7ed] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
              <MapPinIcon size={18} className="tubebay-text-[#ea580c]" />
            </div>
            <div className="tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
              <h3 className="tubebay-t-4-bold tubebay-text-color-default">
                Global Video Placement
              </h3>
              <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[700px]">
                Choose where videos will appear by default on your product
                pages. You can override this for individual products.
              </p>
            </div>
          </div>
          <div className="tubebay-w-full">
            <Select
              value={tmpOtherSettings.video_placement || ""}
              onChange={(val) =>
                setTmpOtherSettings({
                  ...tmpOtherSettings,
                  video_placement: val as string,
                })
              }
              options={[
                { value: "below_gallery", label: "Below Gallery" },
                { value: "below_summary", label: "Below Summary" },
                { value: "tab", label: "Product Tab" },
                { value: "custom", label: "Custom Hook" },
              ]}
              placeholder="Choose placement..."
              border="tubebay-border-gray-200"
              color="tubebay-text-gray-700"
              fontSize={14}
            />
          </div>
        </div>
      </Card>
    </Page>
  );
}
