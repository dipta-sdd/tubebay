import { useState, useEffect } from "react";
import { Input } from "../common/Input";
import Button from "../common/Button";
import Card from "../common/Card";
import { LinkIcon, YouTubeIcon, GoogleIcon } from "../common/Icons";
import { PluginSettings } from "../../utils/types";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { Tooltip } from "../common/ToolTip";
// @ts-ignore
import channelIdImg from "../../img/channel_id.png";

export type FeedbackType = "success" | "error" | "info";

export interface ConnectionFeedback {
  type: FeedbackType;
  message: string;
}

interface ConnectAccountCardProps {
  settings: PluginSettings;
  tmpCredentials: {
    api_key: string;
    channel_id: string;
    refresh_token: string;
  };
  setTmpCredentials: (creds: {
    api_key: string;
    channel_id: string;
    refresh_token: string;
  }) => void;
  editingConnection: boolean;
  setEditingConnection: (editing: boolean) => void;
  saving: boolean;
  testing: boolean;
  handleConnect: () => void;
  handleTestConnection: () => void;
  credentialsChanged: () => boolean;
  connectYouTube: () => void;
  feedback: ConnectionFeedback | null;
  setFeedback: (feedback: ConnectionFeedback | null) => void;
}

const feedbackStyles: Record<FeedbackType, string> = {
  success:
    "tubebay-bg-[#f0fdf4] tubebay-border-[#bbf7d0] tubebay-text-[#15803d]",
  error: "tubebay-bg-[#fef2f2] tubebay-border-[#fecaca] tubebay-text-[#b91c1c]",
  info: "tubebay-bg-[#eff6ff] tubebay-border-[#bfdbfe] tubebay-text-[#1d4ed8]",
};

function FeedbackIcon({ type }: { type: FeedbackType }) {
  if (type === "success")
    return (
      <CheckCircle
        size={16}
        className="tubebay-flex-shrink-0 tubebay-mt-[2px]"
      />
    );
  if (type === "error")
    return (
      <XCircle size={16} className="tubebay-flex-shrink-0 tubebay-mt-[2px]" />
    );
  return <Info size={16} className="tubebay-flex-shrink-0 tubebay-mt-[2px]" />;
}

export default function ConnectAccountCard({
  settings,
  tmpCredentials,
  setTmpCredentials,
  editingConnection,
  setEditingConnection,
  saving,
  testing,
  handleConnect,
  handleTestConnection,
  credentialsChanged,
  connectYouTube,
  feedback,
  setFeedback,
}: ConnectAccountCardProps) {
  const [connectionMode, setConnectionMode] = useState<"oauth" | "manual">(
    "oauth",
  );

  return (
    <Card className="tubebay-flex tubebay-flex-col tubebay-items-center">
      <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-mb-[16px]">
        <LinkIcon size={24} className="tubebay-text-[#3858e9]" />
        <h2 className="tubebay-text-[22px] tubebay-font-bold tubebay-text-[#111827]">
          Connect Account
        </h2>
      </div>

      {!editingConnection &&
      (settings.connection_status === "connected" ||
        settings.connection_status === "disconnected") &&
      settings.channel_name ? (
        <div className="tubebay-w-full tubebay-flex tubebay-flex-col tubebay-items-center tubebay-gap-[12px]">
          {/* Connected Confirmation Box */}
          <div
            className={`tubebay-w-full tubebay-max-w-[480px] tubebay-border tubebay-rounded-[16px] tubebay-p-[12px] tubebay-flex tubebay-flex-col tubebay-items-center tubebay-gap-[8px] ${
              settings.connection_status === "connected"
                ? "tubebay-bg-[#f0fdf4] tubebay-border-[#dcfce7]"
                : "tubebay-bg-red-100 tubebay-border-red-200"
            }`}
          >
            <div className="tubebay-flex tubebay-items-center tubebay-gap-[4px]">
              {settings.thumbnails_medium ? (
                <img
                  src={settings.thumbnails_medium}
                  alt={settings.channel_name}
                  className="tubebay-w-[48px] tubebay-h-[48px] tubebay-rounded-full tubebay-border-[4px] tubebay-border-white tubebay-object-cover"
                />
              ) : (
                <div className="tubebay-bg-[#d92121] tubebay-text-white tubebay-rounded-[12px] tubebay-p-[12px]">
                  <YouTubeIcon size={24} fill="white" stroke="none" />
                </div>
              )}
            </div>

            <div className="tubebay-text-center">
              <h3 className="tubebay-text-[18px] tubebay-font-bold tubebay-text-[#111827] tubebay-mb-[4px]">
                {settings.channel_name}
              </h3>
              <div className="tubebay-flex tubebay-items-center tubebay-justify-center tubebay-gap-[8px]">
                <span
                  className={`tubebay-text-[12px] tubebay-font-bold tubebay-px-[8px] tubebay-py-[2px] tubebay-rounded-full ${
                    settings.connection_status === "connected"
                      ? "tubebay-bg-[#dcfce7] tubebay-text-[#15803d]"
                      : "tubebay-bg-red-200 tubebay-text-red-900"
                  }`}
                >
                  {settings.connection_status === "connected"
                    ? "Connected"
                    : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Change Account Button */}
          <div className="tubebay-flex tubebay-gap-2 tubebay-justify-center tubebay-w-full">
            {settings.connection_status === "disconnected" ? (
              <Button
                onClick={() => connectYouTube()}
                className="tubebay-w-full tubebay-max-w-[480px] !tubebay-bg-blue-600 hover:!tubebay-bg-blue-700 tubebay-text-white tubebay-h-[56px] tubebay-rounded-[12px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-gap-[12px] tubebay-text-[16px] tubebay-font-bold"
              >
                <GoogleIcon size={20} />
                Connect
              </Button>
            ) : null}
            <Button
              onClick={() => {
                setFeedback(null);
                setEditingConnection(true);
              }}
              className="tubebay-w-full tubebay-max-w-[480px] tubebay-whitespace-nowrap !tubebay-bg-[#bd1e1e] hover:!tubebay-bg-[#bd1e1e]/80 !tubebay-text-white !tubebay-border-[#bd1e1e] tubebay-h-[56px] tubebay-rounded-[12px] tubebay-flex tubebay-items-center tubebay-justify-center tubebay-gap-[12px] tubebay-text-[16px] tubebay-font-bold"
            >
              <GoogleIcon size={20} />
              Change Credentials
            </Button>
          </div>
        </div>
      ) : (
        <div className="tubebay-w-full tubebay-flex tubebay-flex-col tubebay-gap-[16px]">
          <div className="tubebay-w-full tubebay-flex tubebay-flex-col tubebay-gap-[16px] tubebay-bg-gray-50 tubebay-p-4 tubebay-rounded-xl tubebay-border">
            <h3 className="tubebay-font-bold tubebay-text-gray-800">
              Connection Method
            </h3>

            <div className="tubebay-flex tubebay-items-center tubebay-gap-[16px] tubebay-border-b tubebay-border-gray-200 tubebay-pb-4">
              <label className="tubebay-flex tubebay-items-center tubebay-gap-2 tubebay-cursor-pointer">
                <input
                  type="radio"
                  name="connectionMode"
                  value="oauth"
                  checked={connectionMode === "oauth"}
                  onChange={() => setConnectionMode("oauth")}
                  className="tubebay-accent-blue-600"
                />
                <span className="tubebay-text-sm tubebay-font-medium tubebay-text-gray-700">
                  OAuth (Recommended)
                </span>
              </label>
              <label className="tubebay-flex tubebay-items-center tubebay-gap-2 tubebay-cursor-pointer">
                <input
                  type="radio"
                  name="connectionMode"
                  value="manual"
                  checked={connectionMode === "manual"}
                  onChange={() => setConnectionMode("manual")}
                  className="tubebay-accent-blue-600"
                />
                <span className="tubebay-text-sm tubebay-font-medium tubebay-text-gray-700">
                  Manual (API Key + Channel ID)
                </span>
              </label>
            </div>

            {connectionMode === "oauth" ? (
              <div className="tubebay-flex tubebay-flex-col tubebay-gap-[12px]">
                <p className="tubebay-text-sm tubebay-text-gray-600">
                  Click the button below to authorize TubeBay securely with
                  Google. You will be provided with a token to paste here.
                </p>
                <div>
                  <a
                    href="https://tbac.wpanchorbay.com/oauth?action=connect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tubebay-inline-flex tubebay-items-center tubebay-gap-2 tubebay-bg-white tubebay-border tubebay-border-gray-300 hover:tubebay-bg-gray-50 tubebay-text-gray-700 tubebay-px-4 tubebay-py-2 tubebay-rounded-lg tubebay-font-medium tubebay-transition-colors"
                  >
                    <GoogleIcon size={18} />
                    Authorize with Google
                  </a>
                </div>

                <div className="tubebay-mt-2">
                  <Input
                    label="Refresh Token"
                    type="password"
                    value={tmpCredentials.refresh_token || ""}
                    onChange={(e) =>
                      setTmpCredentials({
                        ...tmpCredentials,
                        refresh_token: (e.target as HTMLInputElement).value,
                      })
                    }
                    placeholder="Paste your token here..."
                  />
                </div>
              </div>
            ) : (
              <div className="tubebay-w-full tubebay-flex tubebay-flex-col tubebay-gap-4">
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
                    Generate an API Key in the{" "}
                    <a
                      href="https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tubebay-text-blue-600 tubebay-underline hover:tubebay-text-blue-800"
                    >
                      Google Cloud Console
                    </a>
                    .
                  </p>
                </div>
                <div>
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
                  <p className="tubebay-text-[12px] tubebay-text-gray-500 tubebay-mt-[4px]">
                    Find your Channel ID in your
                    <Tooltip
                      content={<ChannelIdTooltip />}
                      color="light"
                      position="bottom"
                      className="!tubebay-max-w-[min(700px,90vw)]"
                    >
                      <a
                        href="https://www.youtube.com/account_advanced"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tubebay-text-blue-600 tubebay-underline hover:tubebay-text-blue-800 tubebay-ml-1"
                      >
                        YouTube Advanced Settings
                      </a>
                    </Tooltip>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Inline Feedback Message */}
          {feedback && (
            <div
              className={`tubebay-flex tubebay-items-start tubebay-gap-[10px] tubebay-px-[14px] tubebay-py-[12px] tubebay-rounded-[10px] tubebay-border tubebay-text-[13px] tubebay-leading-[20px] ${
                feedbackStyles[feedback.type]
              }`}
            >
              <FeedbackIcon type={feedback.type} />
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="tubebay-flex tubebay-gap-[12px] tubebay-mt-[8px]">
            <Button
              onClick={handleConnect}
              disabled={
                saving ||
                (!credentialsChanged() &&
                  settings.connection_status === "connected") ||
                (!tmpCredentials.refresh_token &&
                  (!tmpCredentials.api_key || !tmpCredentials.channel_id))
              }
              color="primary"
            >
              {saving ? "Connecting..." : "Connect"}
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={
                testing ||
                (!tmpCredentials.refresh_token &&
                  (!tmpCredentials.api_key || !tmpCredentials.channel_id))
              }
              color="secondary"
              variant="outline"
            >
              {testing ? "Testing..." : "Test Connection"}
            </Button>

            {settings.channel_name && (
              <Button
                onClick={() => {
                  setFeedback(null);
                  setEditingConnection(false);
                }}
                color="secondary"
                variant="ghost"
                disabled={saving}
                className="tubebay-ml-auto"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

const ChannelIdTooltip = () => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsZoomed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="tubebay-p-2 tubebay-max-w-full tubebay-overflow-hidden">
      <p className="tubebay-font-bold tubebay-mb-2 tubebay-text-gray-800">
        How to find your Channel ID:
      </p>
      <div className="tubebay-flex tubebay-items-start tubebay-gap-4">
        <div className="">
          <ol className="tubebay-list-decimal tubebay-list-inside tubebay-space-y-1 tubebay-text-gray-600">
            <li>Sign in to your YouTube account</li>
            <li>
              Go to{" "}
              <span className="tubebay-font-semibold">Advanced settings</span>
            </li>
            <li>
              Copy the <span className="tubebay-font-semibold">Channel ID</span>
            </li>
          </ol>
        </div>
        <div className="tubebay-flex-1 tubebay-overflow-hidden tubebay-rounded tubebay-border tubebay-border-gray-200">
          <img
            src={channelIdImg}
            alt="Channel ID Tutorial"
            className={`tubebay-w-full tubebay-transition-all tubebay-duration-1000 tubebay-ease-in-out ${
              isZoomed
                ? "tubebay-scale-[1.5] -tubebay-translate-x-[7%] -tubebay-translate-y-[18%]"
                : "tubebay-scale-100 tubebay-translate-x-0 tubebay-translate-y-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
