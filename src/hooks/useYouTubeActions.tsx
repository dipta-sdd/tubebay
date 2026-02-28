import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import { useWpabStore, useWpabStoreActions } from "../store/wpabStore";

export const useYouTubeActions = () => {
  const { addToast } = useToast();
  const { plugin_settings } = useWpabStore();
  const { updateStore } = useWpabStoreActions();

  const connectYouTube = async () => {
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: any;
      }>({
        path: "/tubebay/v1/settings",
        method: "POST",
        data: {
          connection_status: "connected",
        },
      });

      if (response.success) {
        updateStore("plugin_settings", response.data);
        addToast("YouTube account connected.", "success");
      }
    } catch (error) {
      addToast(`Failed to connect: ${(error as Error).message}`, "error");
    }
  };

  const disconnectYouTube = async () => {
    try {
      const response = await apiFetch<{
        success: boolean;
        message: string;
        data: any;
      }>({
        path: "/tubebay/v1/settings",
        method: "POST",
        data: {
          connection_status: "disconnected",
        },
      });

      if (response.success) {
        updateStore("plugin_settings", response.data);
        addToast("YouTube account disconnected.", "success");
      }
    } catch (error) {
      addToast(`Failed to disconnect: ${(error as Error).message}`, "error");
    }
  };

  const syncLibrary = async () => {
    try {
      addToast("Syncing library...", "info");
      const response = await apiFetch<{
        success: boolean;
        message: string;
        last_sync_time?: number;
      }>({
        path: "/tubebay/v1/youtube/sync-library-status",
      });

      if (response.success) {
        if (response.last_sync_time !== undefined) {
          updateStore("plugin_settings", {
            ...plugin_settings,
            last_sync_time: response.last_sync_time,
          });
        }
        addToast("Library synced successfully.", "success");
      }
    } catch (error) {
      addToast(`Sync failed: ${(error as Error).message}`, "error");
    }
  };

  return {
    connectYouTube,
    disconnectYouTube,
    syncLibrary,
  };
};
