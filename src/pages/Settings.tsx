import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import { Input } from "../components/common/Input";
import Button from "../components/common/Button";
import { NumberInput } from "../components/common/NumberInput";
import Page from "../components/common/Page";

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
    <Page>
      <div className="tubebay-mb-[32px]">
        <h1 className="tubebay-text-[24px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[4px]">
          TubeBay Settings
        </h1>
        <p className="tubebay-text-[14px] tubebay-text-gray-500">
          Connect your YouTube channel once, sync everywhere.
        </p>
      </div>

      <div className="tubebay-flex tubebay-flex-col tubebay-gap-[24px]">
        {/* Connect Account Card */}
        <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-border tubebay-border-gray-200 tubebay-p-[24px] tubebay-shadow-sm">
          <div className="tubebay-flex tubebay-items-center tubebay-justify-between tubebay-mb-[24px]">
            <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px]">
              <svg
                className="tubebay-text-blue-600"
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
              <h2 className="tubebay-text-[18px] tubebay-font-bold tubebay-text-gray-900">
                Connect Account
              </h2>
            </div>
            {settings.connection_status && (
              <div
                className={`tubebay-flex tubebay-items-center tubebay-gap-[6px] tubebay-px-[10px] tubebay-py-[4px] tubebay-rounded-full tubebay-text-[12px] tubebay-font-medium ${
                  settings.connection_status === "connected"
                    ? "tubebay-bg-green-100 tubebay-text-green-700 tubebay-border tubebay-border-green-200"
                    : "tubebay-bg-red-100 tubebay-text-red-700 tubebay-border tubebay-border-red-200"
                }`}
              >
                <span
                  className={`tubebay-w-[6px] tubebay-h-[6px] tubebay-rounded-full ${
                    settings.connection_status === "connected"
                      ? "tubebay-bg-green-500"
                      : "tubebay-bg-red-500"
                  }`}
                ></span>
                {settings.connection_status === "connected"
                  ? "Connected"
                  : "Connection Failed"}
              </div>
            )}
          </div>

          <div className="tubebay-flex tubebay-flex-col tubebay-gap-[20px]">
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
              <p className="tubebay-text-[12px] tubebay-text-gray-500 tubebay-mt-[4px]">
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
                <div className="tubebay-bg-gray-50 tubebay-border tubebay-border-gray-200 tubebay-rounded-[8px] tubebay-p-[12px] tubebay-flex tubebay-items-center tubebay-gap-[12px]">
                  <div className="tubebay-w-[40px] tubebay-h-[40px] tubebay-bg-red-100 tubebay-rounded-full tubebay-flex tubebay-items-center tubebay-justify-center tubebay-text-red-600">
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
                    <p className="tubebay-text-[12px] tubebay-text-gray-500 tubebay-font-medium tubebay-mb-[2px]">
                      Connected Channel
                    </p>
                    <p className="tubebay-text-[14px] tubebay-font-bold tubebay-text-gray-900">
                      {settings.channel_name}
                    </p>
                  </div>
                </div>
              )}

            <div className="tubebay-flex tubebay-gap-[12px] tubebay-mt-[8px]">
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
        <div className="tubebay-bg-white tubebay-rounded-[12px] tubebay-border tubebay-border-gray-200 tubebay-p-[24px] tubebay-shadow-sm">
          <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-mb-[24px]">
            <svg
              className="tubebay-text-gray-700"
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
            <h2 className="tubebay-text-[18px] tubebay-font-bold tubebay-text-gray-900">
              Sync & Placement Settings
            </h2>
          </div>

          <div className="tubebay-flex tubebay-flex-col tubebay-gap-[20px]">
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
              <p className="tubebay-text-[12px] tubebay-text-gray-500 tubebay-mt-[4px]">
                How long to store fetched videos locally before querying YouTube
                again.
              </p>
            </div>

            <div className="tubebay-pt-[8px]">
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
    </Page>
  );
}
