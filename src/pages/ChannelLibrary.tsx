import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import { Input } from "../components/common/Input";
import Button from "../components/common/Button";
import Page from "../components/common/Page";
import {
  RefreshIcon,
  CheckIcon,
  InfoIcon,
  ListIcon,
  EyeIcon,
  CalendarIcon,
  CodeIcon,
} from "../components/common/Icons";

interface VideoData {
  id: string;
  title: string;
  thumbnail_url: string;
  published_at: string;
  description: string;
}

export default function ChannelLibrary() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        videos: VideoData[];
      }>({
        path: "/tubebay/v1/youtube/videos",
      });
      if (response.success) {
        setVideos(response.videos);
      }
    } catch (error) {
      addToast(`Error fetching library: ${(error as Error).message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    try {
      const response = await apiFetch<{
        success: boolean;
        videos: VideoData[];
      }>({
        path: "/tubebay/v1/youtube/sync-library",
      });
      if (response.success) {
        setVideos(response.videos);
        addToast(
          `Successfully fetched ${response.videos.length} videos.`,
          "success",
        );
      }
    } catch (error) {
      addToast(`Sync Failed: ${(error as any).message}`, "error");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Page>
      {/* Header */}
      <div className="tubebay-flex tubebay-flex-col md:tubebay-flex-row md:tubebay-justify-between md:tubebay-items-end tubebay-mb-[32px] tubebay-gap-[16px]">
        <div>
          <h1 className="tubebay-text-[28px] tubebay-font-bold tubebay-text-gray-900 tubebay-mb-[8px]">
            Channel Library
          </h1>
          <p className="tubebay-text-[15px] tubebay-text-gray-500">
            Manage and preview your synced YouTube videos
          </p>
        </div>
        <Button
          onClick={handleSyncNow}
          disabled={syncing}
          color="primary"
          className="tubebay-whitespace-nowrap tubebay-px-[24px]"
        >
          {syncing ? (
            "Syncing..."
          ) : (
            <>
              <RefreshIcon size={16} className="tubebay-mr-[8px]" />
              Sync Now
            </>
          )}
        </Button>
      </div>

      {/* Status Banner */}
      <div className="tubebay-bg-green-50 tubebay-border tubebay-border-green-200 tubebay-rounded-[12px] tubebay-p-[24px] tubebay-mb-[32px] tubebay-flex tubebay-flex-col md:tubebay-flex-row md:tubebay-items-center md:tubebay-justify-between">
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[16px]">
          <div className="tubebay-bg-green-500 tubebay-text-white tubebay-rounded-full tubebay-p-[8px] tubebay-flex tubebay-items-center tubebay-justify-center">
            <CheckIcon size={24} />
          </div>
          <div>
            <h3 className="tubebay-text-[16px] tubebay-font-bold tubebay-text-gray-900">
              {videos.length > 0 ? "All Videos Synced" : "No Videos YET"}
            </h3>
            <p className="tubebay-text-[14px] tubebay-text-gray-600">
              {videos.length} videos from your YouTube channel are available
            </p>
          </div>
        </div>
        <div className="tubebay-text-right tubebay-mt-[16px] md:tubebay-mt-0">
          <p className="tubebay-text-[14px] tubebay-font-medium tubebay-text-gray-900">
            Last sync: Recently
          </p>
          <p className="tubebay-text-[12px] tubebay-text-gray-500">
            Cache is active
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="tubebay-flex tubebay-flex-col md:tubebay-flex-row tubebay-gap-[16px] tubebay-mb-[32px]">
        <div className="tubebay-flex-1">
          <Input
            type="text"
            placeholder="Search videos by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            classNames={{ input: "tubebay-bg-white" }}
          />
        </div>
        <div className="tubebay-w-full md:tubebay-w-[200px]">
          {/* Simple select for UI mockup */}
          <select className="tubebay-w-full tubebay-p-[9px] tubebay-border tubebay-border-gray-300 tubebay-rounded-[8px] tubebay-bg-white tubebay-text-[13px] tubebay-outline-none focus:tubebay-ring-2 focus:tubebay-ring-blue-500">
            <option>Recently Added</option>
            <option>Oldest First</option>
          </select>
        </div>
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px]">
          <button className="tubebay-p-[10px] tubebay-bg-white tubebay-border tubebay-border-gray-300 tubebay-rounded-[8px] hover:tubebay-bg-gray-50">
            <InfoIcon size={18} />
          </button>
          <button className="tubebay-p-[10px] tubebay-bg-white tubebay-border tubebay-border-gray-300 tubebay-rounded-[8px] hover:tubebay-bg-gray-50">
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="tubebay-text-center tubebay-py-[48px] tubebay-text-gray-500">
          Loading library...
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="tubebay-text-center tubebay-py-[48px] tubebay-text-gray-500">
          No videos found. Try syncing or adjusting your search.
        </div>
      ) : (
        <div className="tubebay-grid tubebay-grid-cols-1 md:tubebay-grid-cols-2 lg:tubebay-grid-cols-3 xl:tubebay-grid-cols-4 tubebay-gap-[24px]">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="tubebay-bg-white tubebay-border tubebay-border-gray-200 tubebay-rounded-[12px] tubebay-overflow-hidden tubebay-shadow-sm hover:tubebay-shadow-md tubebay-transition-shadow"
            >
              {/* Thumbnail */}
              <div className="tubebay-relative tubebay-aspect-video tubebay-bg-gray-100">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="tubebay-w-full tubebay-h-full tubebay-object-cover"
                />
                <div className="tubebay-absolute tubebay-bottom-[8px] tubebay-right-[8px] tubebay-bg-black/80 tubebay-text-white tubebay-text-[11px] tubebay-font-medium tubebay-px-[6px] tubebay-py-[2px] tubebay-rounded-[4px]">
                  Video
                </div>
              </div>

              {/* Content */}
              <div className="tubebay-p-[16px] tubebay-flex tubebay-flex-col tubebay-justify-between">
                <div>
                  <h4
                    className="tubebay-text-[15px] tubebay-font-bold tubebay-text-gray-900 tubebay-tracking-tight tubebay-line-clamp-2 tubebay-mb-[8px] tubebay-leading-tight"
                    title={video.title}
                  >
                    {video.title}
                  </h4>
                  <div className="tubebay-flex tubebay-items-center tubebay-text-[13px] tubebay-text-gray-500 tubebay-mb-[16px] tubebay-gap-[8px]">
                    <span className="tubebay-flex tubebay-items-center tubebay-gap-[4px]">
                      <EyeIcon size={14} />
                      YT Video
                    </span>
                    <span>•</span>
                    <span className="tubebay-flex tubebay-items-center tubebay-gap-[4px]">
                      <CalendarIcon size={14} />
                      {formatDate(video.published_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="tubebay-flex tubebay-gap-[8px]">
                  <Button
                    className="tubebay-flex-1"
                    color="primary"
                    onClick={() =>
                      window.open(
                        `https://youtube.com/watch?v=${video.id}`,
                        "_blank",
                      )
                    }
                  >
                    <EyeIcon size={16} className="tubebay-mr-[6px]" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    className="!tubebay-px-[12px] tubebay-text-gray-700 tubebay-border-gray-300 hover:tubebay-bg-gray-50"
                    title="Copy Shortcode"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `[tubebay_video id="${video.id}"]`,
                      );
                      addToast("Shortcode copied to clipboard", "success");
                    }}
                  >
                    <CodeIcon size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredVideos.length > 0 && (
        <div className="tubebay-mt-[32px] tubebay-text-center">
          <Button
            variant="outline"
            className="tubebay-w-full md:tubebay-w-[200px] tubebay-py-[12px] tubebay-font-bold tubebay-text-gray-700"
          >
            Load More Videos
          </Button>
        </div>
      )}
    </Page>
  );
}
