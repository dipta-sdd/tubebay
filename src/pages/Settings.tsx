import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import { Input } from "../components/common/Input";
import Button from "../components/common/Button";
import { NumberInput } from "../components/common/NumberInput";

interface SettingsData {
  api_key: string;
  channel_id: string;
  channel_name: string;
  connection_status: string;
  cache_duration: number;
}

export default function Settings() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [settings, setSettings] = useState<SettingsData>({
    api_key: "",
    channel_id: "",
    channel_name: "",
    connection_status: "",
    cache_duration: 12,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiFetch<SettingsData>({
        path: "/tubebay/v1/settings",
      });
      setSettings({
        api_key: response.api_key || "",
        channel_id: response.channel_id || "",
        channel_name: response.channel_name || "",
        connection_status: response.connection_status || "",
        cache_duration: response.cache_duration || 12,
      });
    } catch (error) {
      addToast(`Error fetching settings: ${(error as Error).message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (settingsToSave = settings) => {
    setSaving(true);
    try {
      const response = await apiFetch<{ success: boolean; message: string }>({
        path: "/tubebay/v1/settings",
        method: "POST",
        data: settingsToSave,
      });

      if (response.success) {
        addToast(response.message, "success");
      }
    } catch (error) {
      addToast(`Error saving settings: ${(error as Error).message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);

    // Optimistically save current API key and Channel ID before testing
    await apiFetch({
      path: "/tubebay/v1/settings",
      method: "POST",
      data: {
        api_key: settings.api_key,
        channel_id: settings.channel_id,
      },
    });

    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        channel_name?: string;
        connection_status?: string;
      }>({
        path: "/tubebay/v1/youtube/test-connection",
      });

      if (response.success) {
        addToast(response.message, "success");

        const updatedSettings = {
          ...settings,
          channel_name: response.channel_name || "",
          connection_status: response.connection_status || "connected",
        };
        setSettings(updatedSettings);

        // Auto-save the new status and name
        await handleSave(updatedSettings);
      }
    } catch (error) {
      addToast(`Connection Failed: ${(error as any).message}`, "error");
      const updatedSettings = {
        ...settings,
        connection_status: "failed",
      };
      setSettings(updatedSettings);
      await handleSave(updatedSettings);
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

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="wpab-p-[32px] wpab-max-w-[760px] wpab-mx-auto wpab-w-full">
      <div className="wpab-mb-[32px]">
        <h1 className="wpab-text-[24px] wpab-font-bold wpab-text-gray-900 wpab-mb-[4px]">
          TubeBay Settings
        </h1>
        <p className="wpab-text-[14px] wpab-text-gray-500">
          Connect your YouTube channel once, sync everywhere.
        </p>
      </div>

      <div className="wpab-flex wpab-flex-col wpab-gap-[24px]">
        {/* Connect Account Card */}
        <div className="wpab-bg-white wpab-rounded-[12px] wpab-border wpab-border-gray-200 wpab-p-[24px] wpab-shadow-sm">
          <div className="wpab-flex wpab-items-center wpab-justify-between wpab-mb-[24px]">
            <div className="wpab-flex wpab-items-center wpab-gap-[8px]">
              <svg
                className="wpab-text-blue-600"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <h2 className="wpab-text-[18px] wpab-font-bold wpab-text-gray-900">
                Connect Account
              </h2>
            </div>
            {settings.connection_status && (
              <div
                className={`wpab-flex wpab-items-center wpab-gap-[6px] wpab-px-[10px] wpab-py-[4px] wpab-rounded-full wpab-text-[12px] wpab-font-medium ${
                  settings.connection_status === "connected"
                    ? "wpab-bg-green-100 wpab-text-green-700 wpab-border wpab-border-green-200"
                    : "wpab-bg-red-100 wpab-text-red-700 wpab-border wpab-border-red-200"
                }`}
              >
                <span
                  className={`wpab-w-[6px] wpab-h-[6px] wpab-rounded-full ${
                    settings.connection_status === "connected"
                      ? "wpab-bg-green-500"
                      : "wpab-bg-red-500"
                  }`}
                ></span>
                {settings.connection_status === "connected"
                  ? "Connected"
                  : "Connection Failed"}
              </div>
            )}
          </div>

          <div className="wpab-flex wpab-flex-col wpab-gap-[20px]">
            <div>
              <Input
                label="Google Cloud API Key"
                type="password"
                value={settings.api_key}
                onChange={(e) =>
                  setSettings({ ...settings, api_key: e.target.value })
                }
                placeholder="AIzaSyB-xxxxxxxxxxxxxxx"
              />
              <p className="wpab-text-[12px] wpab-text-gray-500 wpab-mt-[4px]">
                Requires YouTube Data API v3 enabled.
              </p>
            </div>

            <Input
              label="YouTube Channel ID"
              value={settings.channel_id}
              onChange={(e) =>
                setSettings({ ...settings, channel_id: e.target.value })
              }
              placeholder="UCxxxxxxxxxxxxxxx"
            />

            {settings.channel_name &&
              settings.connection_status === "connected" && (
                <div className="wpab-bg-gray-50 wpab-border wpab-border-gray-200 wpab-rounded-[8px] wpab-p-[12px] wpab-flex wpab-items-center wpab-gap-[12px]">
                  <div className="wpab-w-[40px] wpab-h-[40px] wpab-bg-red-100 wpab-rounded-full wpab-flex wpab-items-center wpab-justify-center wpab-text-red-600">
                    <svg
                      width="20"
                      height="20"
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
                  <div>
                    <p className="wpab-text-[12px] wpab-text-gray-500 wpab-font-medium wpab-mb-[2px]">
                      Connected Channel
                    </p>
                    <p className="wpab-text-[14px] wpab-font-bold wpab-text-gray-900">
                      {settings.channel_name}
                    </p>
                  </div>
                </div>
              )}

            <div className="wpab-flex wpab-gap-[12px] wpab-mt-[8px]">
              <Button
                onClick={() => handleSave(settings)}
                disabled={saving}
                color="primary"
              >
                {saving ? "Saving..." : "Save Settings"}
              </Button>
              <Button
                onClick={handleTestConnection}
                disabled={testing || !settings.api_key || !settings.channel_id}
                color="secondary"
                variant="outline"
              >
                {testing ? "Testing..." : "Test Connection"}
              </Button>
            </div>
          </div>
        </div>

        {/* Sync Settings Card */}
        <div className="wpab-bg-white wpab-rounded-[12px] wpab-border wpab-border-gray-200 wpab-p-[24px] wpab-shadow-sm">
          <div className="wpab-flex wpab-items-center wpab-gap-[8px] wpab-mb-[24px]">
            <svg
              className="wpab-text-gray-700"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M16 21v-5h5"></path>
            </svg>
            <h2 className="wpab-text-[18px] wpab-font-bold wpab-text-gray-900">
              Sync & Placement Settings
            </h2>
          </div>

          <div className="wpab-flex wpab-flex-col wpab-gap-[20px]">
            <div>
              <NumberInput
                label="Cache Duration (Hours)"
                value={settings.cache_duration}
                onChange={(val) =>
                  setSettings({ ...settings, cache_duration: val || 12 })
                }
                min={1}
                max={168}
              />
              <p className="wpab-text-[12px] wpab-text-gray-500 wpab-mt-[4px]">
                How long to store fetched videos locally before querying YouTube
                again.
              </p>
            </div>

            <div className="wpab-pt-[8px]">
              <Button
                onClick={handleSyncLibrary}
                disabled={syncing || !settings.api_key || !settings.channel_id}
                color="secondary"
                variant="outline"
              >
                {syncing ? "Syncing..." : "Sync Library Manually"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
