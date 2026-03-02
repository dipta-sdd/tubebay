import Card from "../common/Card";
import { Switch } from "../common/Switch";
import { CheckCircleIcon } from "../common/Icons";
import { SyncPlacementSettings } from "../../utils/types";

interface AdvancedSettingsCardProps {
  tmpOtherSettings: SyncPlacementSettings;
  setTmpOtherSettings: (settings: SyncPlacementSettings) => void;
  /** Hide the card header. Useful for onboarding steps. */
  hideHeader?: boolean;
}

export default function AdvancedSettingsCard({
  tmpOtherSettings,
  setTmpOtherSettings,
  hideHeader = false,
}: AdvancedSettingsCardProps) {
  return (
    <Card className="tubebay-flex tubebay-flex-col tubebay-gap-[32px] tubebay-mt-[24px]">
      {!hideHeader && (
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px]">
          <h2 className="tubebay-t-3">Advanced Settings</h2>
        </div>
      )}

      {/* Debug Mode Row */}
      <div className="tubebay-flex tubebay-items-start tubebay-justify-between ">
        <div className="tubebay-flex tubebay-gap-[12px]">
          <div className="tubebay-bg-[#fff1f2] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
            <CheckCircleIcon size={18} className="tubebay-text-[#e11d48]" />
          </div>
          <div className="tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
            <h3 className="tubebay-t-4-bold tubebay-text-color-default">
              Debug Mode
            </h3>
            <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[540px]">
              Enable detailed logging for troubleshooting purposes. Logs will be
              saved to the plugin's log directory.
            </p>
          </div>
        </div>
        <Switch
          checked={!!tmpOtherSettings.debug_enableMode}
          onChange={(checked) =>
            setTmpOtherSettings({
              ...tmpOtherSettings,
              debug_enableMode: checked,
            })
          }
          className={
            tmpOtherSettings.debug_enableMode
              ? "tubebay-bg-[#e11d48]"
              : "tubebay-bg-gray-200"
          }
        />
      </div>
    </Card>
  );
}
