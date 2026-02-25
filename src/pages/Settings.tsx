import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";

interface SettingsData {
  api_key: string;
  channel_id: string;
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
      setSettings(response);
    } catch (error) {
      addToast(`Error fetching settings: ${(error as Error).message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiFetch<{ success: boolean; message: string }>({
        path: "/tubebay/v1/settings",
        method: "POST",
        data: settings,
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
    try {
      const response = await apiFetch<{ success: boolean; message: string }>({
        path: "/tubebay/v1/youtube/test-connection",
      });

      if (response.success) {
        addToast(response.message, "success");
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

  if (loading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">TubeBay Settings</h2>
        <p className="text-muted-foreground">
          Configure your YouTube channel connection (Phase 1 API Key mode).
        </p>
      </div>

      <div className="grid gap-6 bg-card p-6 border rounded-lg shadow-sm">
        <div className="wpab-grid wpab-gap-2">
          <label htmlFor="api_key" className="wpab-font-[600]">
            Google Cloud API Key
          </label>
          <input
            id="api_key"
            type="password"
            className="wpab-p-2 wpab-border wpab-border-gray-300 wpab-rounded focus:wpab-ring-2 focus:wpab-ring-blue-500"
            value={settings.api_key}
            onChange={(e) =>
              setSettings({ ...settings, api_key: e.target.value })
            }
            placeholder="AIzaSyB-xxxxxxxxxxxxxxx"
          />
          <p className="wpab-text-sm wpab-text-gray-500">
            Requires YouTube Data API v3 enabled.
          </p>
        </div>

        <div className="wpab-grid wpab-gap-2">
          <label htmlFor="channel_id" className="wpab-font-[600]">
            YouTube Channel ID
          </label>
          <input
            id="channel_id"
            className="wpab-p-2 wpab-border wpab-border-gray-300 wpab-rounded focus:wpab-ring-2 focus:wpab-ring-blue-500"
            value={settings.channel_id}
            onChange={(e) =>
              setSettings({ ...settings, channel_id: e.target.value })
            }
            placeholder="UCxxxxxxxxxxxxxxx"
          />
        </div>

        <div className="wpab-grid wpab-gap-2">
          <label htmlFor="cache_duration" className="wpab-font-[600]">
            Cache Duration (Hours)
          </label>
          <input
            id="cache_duration"
            type="number"
            min="1"
            max="168"
            className="wpab-p-2 wpab-border wpab-border-gray-300 wpab-rounded focus:wpab-ring-2 focus:wpab-ring-blue-500"
            value={settings.cache_duration}
            onChange={(e) =>
              setSettings({
                ...settings,
                cache_duration: parseInt(e.target.value) || 12,
              })
            }
          />
          <p className="wpab-text-sm wpab-text-gray-500">
            How long to store fetched videos locally before querying YouTube
            again.
          </p>
        </div>

        <div className="wpab-flex wpab-gap-4 wpab-pt-4">
          <button
            className="wpab-bg-blue-600 wpab-text-white wpab-px-4 wpab-py-2 wpab-rounded hover:wpab-bg-blue-700 disabled:wpab-opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

          <button
            className="wpab-bg-white wpab-text-gray-800 wpab-border wpab-border-gray-300 wpab-px-4 wpab-py-2 wpab-rounded hover:wpab-bg-gray-50 disabled:wpab-opacity-50"
            onClick={handleTestConnection}
            disabled={testing || !settings.api_key || !settings.channel_id}
          >
            {testing ? "Testing..." : "Test Connection"}
          </button>

          <button
            className="wpab-bg-gray-100 wpab-text-gray-800 wpab-border wpab-border-gray-300 wpab-px-4 wpab-py-2 wpab-rounded hover:wpab-bg-gray-200 disabled:wpab-opacity-50"
            onClick={handleSyncLibrary}
            disabled={syncing || !settings.api_key || !settings.channel_id}
          >
            {syncing ? "Syncing..." : "Sync Library Manually"}
          </button>
        </div>
      </div>
    </div>
  );
}
