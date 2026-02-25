import { useState, useEffect } from "react";
import apiFetch from "@wordpress/api-fetch";
import { useToast } from "../store/toast/use-toast";
import { Input } from "../components/common/Input";
import Button from "../components/common/Button";

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
    <div className="wpab-p-[32px] wpab-max-w-[1200px] wpab-mx-auto wpab-w-full">
      {/* Header */}
      <div className="wpab-flex wpab-flex-col md:wpab-flex-row md:wpab-justify-between md:wpab-items-end wpab-mb-[32px] wpab-gap-[16px]">
        <div>
          <h1 className="wpab-text-[28px] wpab-font-bold wpab-text-gray-900 wpab-mb-[8px]">
            Channel Library
          </h1>
          <p className="wpab-text-[15px] wpab-text-gray-500">
            Manage and preview your synced YouTube videos
          </p>
        </div>
        <Button
          onClick={handleSyncNow}
          disabled={syncing}
          color="primary"
          className="wpab-whitespace-nowrap wpab-px-[24px]"
        >
          {syncing ? (
            "Syncing..."
          ) : (
            <>
              <svg
                className="wpab-mr-[8px]"
                width="16"
                height="16"
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
              Sync Now
            </>
          )}
        </Button>
      </div>

      {/* Status Banner */}
      <div className="wpab-bg-green-50 wpab-border wpab-border-green-200 wpab-rounded-[12px] wpab-p-[24px] wpab-mb-[32px] wpab-flex wpab-flex-col md:wpab-flex-row md:wpab-items-center md:wpab-justify-between">
        <div className="wpab-flex wpab-items-center wpab-gap-[16px]">
          <div className="wpab-bg-green-500 wpab-text-white wpab-rounded-full wpab-p-[8px] wpab-flex wpab-items-center wpab-justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <div>
            <h3 className="wpab-text-[16px] wpab-font-bold wpab-text-gray-900">
              {videos.length > 0 ? "All Videos Synced" : "No Videos YET"}
            </h3>
            <p className="wpab-text-[14px] wpab-text-gray-600">
              {videos.length} videos from your YouTube channel are available
            </p>
          </div>
        </div>
        <div className="wpab-text-right wpab-mt-[16px] md:wpab-mt-0">
          <p className="wpab-text-[14px] wpab-font-medium wpab-text-gray-900">
            Last sync: Recently
          </p>
          <p className="wpab-text-[12px] wpab-text-gray-500">Cache is active</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="wpab-flex wpab-flex-col md:wpab-flex-row wpab-gap-[16px] wpab-mb-[32px]">
        <div className="wpab-flex-1">
          <Input
            type="text"
            placeholder="Search videos by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            classNames={{ input: "wpab-bg-white" }}
          />
        </div>
        <div className="wpab-w-full md:wpab-w-[200px]">
          {/* Simple select for UI mockup */}
          <select className="wpab-w-full wpab-p-[9px] wpab-border wpab-border-gray-300 wpab-rounded-[8px] wpab-bg-white wpab-text-[13px] wpab-outline-none focus:wpab-ring-2 focus:wpab-ring-blue-500">
            <option>Recently Added</option>
            <option>Oldest First</option>
          </select>
        </div>
        <div className="wpab-flex wpab-items-center wpab-gap-[8px]">
          <button className="wpab-p-[10px] wpab-bg-white wpab-border wpab-border-gray-300 wpab-rounded-[8px] hover:wpab-bg-gray-50">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
          <button className="wpab-p-[10px] wpab-bg-white wpab-border wpab-border-gray-300 wpab-rounded-[8px] hover:wpab-bg-gray-50">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="wpab-text-center wpab-py-[48px] wpab-text-gray-500">
          Loading library...
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="wpab-text-center wpab-py-[48px] wpab-text-gray-500">
          No videos found. Try syncing or adjusting your search.
        </div>
      ) : (
        <div className="wpab-grid wpab-grid-cols-1 md:wpab-grid-cols-2 lg:wpab-grid-cols-3 xl:wpab-grid-cols-4 wpab-gap-[24px]">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="wpab-bg-white wpab-border wpab-border-gray-200 wpab-rounded-[12px] wpab-overflow-hidden wpab-shadow-sm hover:wpab-shadow-md wpab-transition-shadow"
            >
              {/* Thumbnail */}
              <div className="wpab-relative wpab-aspect-video wpab-bg-gray-100">
                <img
                  src={video.thumbnail_url}
                  alt={video.title}
                  className="wpab-w-full wpab-h-full wpab-object-cover"
                />
                <div className="wpab-absolute wpab-bottom-[8px] wpab-right-[8px] wpab-bg-black/80 wpab-text-white wpab-text-[11px] wpab-font-medium wpab-px-[6px] wpab-py-[2px] wpab-rounded-[4px]">
                  Video
                </div>
              </div>

              {/* Content */}
              <div className="wpab-p-[16px] wpab-flex wpab-flex-col wpab-justify-between">
                <div>
                  <h4
                    className="wpab-text-[15px] wpab-font-bold wpab-text-gray-900 wpab-tracking-tight wpab-line-clamp-2 wpab-mb-[8px] wpab-leading-tight"
                    title={video.title}
                  >
                    {video.title}
                  </h4>
                  <div className="wpab-flex wpab-items-center wpab-text-[13px] wpab-text-gray-500 wpab-mb-[16px] wpab-gap-[8px]">
                    <span className="wpab-flex wpab-items-center wpab-gap-[4px]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      YT Video
                    </span>
                    <span>•</span>
                    <span className="wpab-flex wpab-items-center wpab-gap-[4px]">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {formatDate(video.published_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="wpab-flex wpab-gap-[8px]">
                  <Button
                    className="wpab-flex-1"
                    color="primary"
                    onClick={() =>
                      window.open(
                        `https://youtube.com/watch?v=${video.id}`,
                        "_blank",
                      )
                    }
                  >
                    <svg
                      className="wpab-mr-[6px]"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    className="!wpab-px-[12px] wpab-text-gray-700 wpab-border-gray-300 hover:wpab-bg-gray-50"
                    title="Copy Shortcode"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `[tubebay_video id="${video.id}"]`,
                      );
                      addToast("Shortcode copied to clipboard", "success");
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredVideos.length > 0 && (
        <div className="wpab-mt-[32px] wpab-text-center">
          <Button
            variant="outline"
            className="wpab-w-full md:wpab-w-[200px] wpab-py-[12px] wpab-font-bold wpab-text-gray-700"
          >
            Load More Videos
          </Button>
        </div>
      )}
    </div>
  );
}
