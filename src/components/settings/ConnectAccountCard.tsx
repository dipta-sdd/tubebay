import { Input } from "../common/Input";
import Button from "../common/Button";
import Card from "../common/Card";
import { LinkIcon, YouTubeIcon, GoogleIcon } from "../common/Icons";
import { PluginSettings } from "../../utils/types";
import { CheckCircle, XCircle, Info } from "lucide-react";

export type FeedbackType = "success" | "error" | "info";

export interface ConnectionFeedback {
  type: FeedbackType;
  message: string;
}

interface ConnectAccountCardProps {
  settings: PluginSettings;
  tmpCredentials: { api_key: string; channel_id: string };
  setTmpCredentials: (creds: { api_key: string; channel_id: string }) => void;
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
        <div className="tubebay-w-full tubebay-flex tubebay-flex-col tubebay-gap-[12px]">
          <div className="tubebay-w-full tubebay-flex tubebay-flex-row tubebay-gap-[12px]">
            <div className="tubebay-w-full">
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
                Find your Channel ID in your{" "}
                <a
                  href="https://www.youtube.com/account_advanced"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tubebay-text-blue-600 tubebay-underline hover:tubebay-text-blue-800"
                >
                  YouTube Advanced Settings
                </a>
                .
              </p>
            </div>
            <div className="tubebay-w-full">
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
                  settings.connection_status === "connected")
              }
              color="primary"
            >
              {saving ? "Connecting..." : "Connect"}
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={
                testing || !tmpCredentials.api_key || !tmpCredentials.channel_id
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
