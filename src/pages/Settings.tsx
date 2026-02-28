import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import Button from "../components/common/Button";
import Page from "../components/common/Page";
import { useWpabStore, useWpabStoreActions } from "../store/wpabStore";
import { PluginSettings } from "../utils/types";
import { useYouTubeActions } from "../hooks/useYouTubeActions";
import ConnectAccountCard from "../components/settings/ConnectAccountCard";
import SyncPlacementCard from "../components/settings/SyncPlacementCard";
import AdvancedSettingsCard from "../components/settings/AdvancedSettingsCard";

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
  const { connectYouTube } = useYouTubeActions();

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
    debug_enableMode: settings.debug_enableMode ?? false,
    muted_autoplay: settings.muted_autoplay ?? true,
    show_controls: settings.show_controls ?? true,
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
        debug_enableMode: response.debug_enableMode ?? false,
        muted_autoplay: response.muted_autoplay ?? true,
        show_controls: response.show_controls ?? true,
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
      tmpOtherSettings.cache_duration !== (settings.cache_duration || 12) ||
      tmpOtherSettings.debug_enableMode !==
        (settings.debug_enableMode ?? false) ||
      tmpOtherSettings.muted_autoplay !== (settings.muted_autoplay ?? true) ||
      tmpOtherSettings.show_controls !== (settings.show_controls ?? true)
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

      {/* Sync & Placement Settings Card */}
      <SyncPlacementCard
        settings={settings}
        tmpOtherSettings={tmpOtherSettings}
        setTmpOtherSettings={setTmpOtherSettings}
        syncing={syncing}
        handleSyncLibrary={handleSyncLibrary}
      />

      {/* Advanced Settings Card */}
      <AdvancedSettingsCard
        tmpOtherSettings={tmpOtherSettings}
        setTmpOtherSettings={setTmpOtherSettings}
      />

      {/* Save Settings Button */}
      <div className="tubebay-flex tubebay-justify-end tubebay-mt-[16px]">
        <Button
          onClick={handleSaveSettings}
          disabled={savingSettings || !otherSettingsChanged()}
          color="primary"
        >
          {savingSettings ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Page>
  );
}
