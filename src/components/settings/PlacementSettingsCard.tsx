import { useState } from "react";
import Card from "../common/Card";
import { Switch } from "../common/Switch";
import Select from "../common/Select";
import { MapPinIcon } from "../common/Icons";
import { SyncPlacementSettings } from "../../utils/types";
import { ProductSkeleton } from "./ProductSkeleton";
import { VideoPosition } from "./types";
import CustomModal from "../common/CustomModal";
import Button from "../common/Button";
import { Eye } from "lucide-react";

interface PlacementSettingsCardProps {
  tmpOtherSettings: SyncPlacementSettings;
  setTmpOtherSettings: (settings: SyncPlacementSettings) => void;
  hideHeader?: boolean;
}

const PLACEMENT_OPTIONS = [
  {
    id: "woocommerce_before_single_product",
    label: "Before Single Product",
    description: "Top of the product page wrapper",
  },
  {
    id: "woocommerce_before_single_product_summary",
    label: "Before Product Summary",
    description: "Above the image and details columns",
  },
  {
    id: "woocommerce_product_thumbnails",
    label: "Product Thumbnails",
    description: "Inside the product gallery",
  },
  {
    id: "woocommerce_single_product_summary",
    label: "Single Product Summary",
    description: "Top of the product details column",
  },
  {
    id: "woocommerce_before_add_to_cart_form",
    label: "Before Add to Cart Form",
    description: "Before the entire add to cart form",
  },
  {
    id: "woocommerce_before_variations_form",
    label: "Before Variations Form",
    description: "Inside form, before variation options",
  },
  {
    id: "woocommerce_before_add_to_cart_button",
    label: "Before Add to Cart Button",
    description: "Before the add to cart button",
  },
  {
    id: "woocommerce_before_single_variation",
    label: "Before Single Variation",
    description: "Before selected variation details",
  },
  {
    id: "woocommerce_single_variation",
    label: "Single Variation",
    description: "Where variation price/description appears",
  },
  {
    id: "woocommerce_before_add_to_cart_quantity",
    label: "Before Quantity",
    description: "Before the quantity input",
  },
  {
    id: "woocommerce_after_single_variation",
    label: "After Single Variation",
    description: "After selected variation details",
  },
  {
    id: "woocommerce_after_add_to_cart_button",
    label: "After Add to Cart Button",
    description: "After the add to cart button",
  },
  {
    id: "woocommerce_after_variations_form",
    label: "After Variations Form",
    description: "After the variations section",
  },
  {
    id: "woocommerce_after_add_to_cart_form",
    label: "After Add to Cart Form",
    description: "After the entire add to cart form",
  },
  {
    id: "woocommerce_product_meta_start",
    label: "Product Meta Start",
    description: "Before SKU, Category, Tags",
  },
  {
    id: "woocommerce_product_meta_end",
    label: "Product Meta End",
    description: "After SKU, Category, Tags",
  },
  {
    id: "woocommerce_share",
    label: "Product Share",
    description: "At the bottom of product meta",
  },
  {
    id: "woocommerce_after_single_product_summary",
    label: "After Product Summary",
    description: "Full width below details/tabs",
  },
  {
    id: "woocommerce_after_single_product",
    label: "After Single Product",
    description: "Very bottom of the product page",
  },
];

export default function PlacementSettingsCard({
  tmpOtherSettings,
  setTmpOtherSettings,
  hideHeader = false,
}: PlacementSettingsCardProps) {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  return (
    <Card className="tubebay-flex tubebay-flex-col tubebay-gap-[32px]">
      {!hideHeader && (
        <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px] tubebay-justify-between">
          <div className="tubebay-flex tubebay-items-center tubebay-gap-[8px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.3711 6.50781C19.4961 6.84766 19.3906 7.22656 19.1211 7.46875L17.4297 9.00781C17.4727 9.33203 17.4961 9.66406 17.4961 10C17.4961 10.3359 17.4727 10.668 17.4297 10.9922L19.1211 12.5312C19.3906 12.7734 19.4961 13.1523 19.3711 13.4922C19.1992 13.957 18.9922 14.4023 18.7539 14.832L18.5703 15.1484C18.3125 15.5781 18.0234 15.9844 17.707 16.3672C17.4766 16.6484 17.0938 16.7422 16.75 16.6328L14.5742 15.9414C14.0508 16.3438 13.4727 16.6797 12.8555 16.9336L12.3672 19.1641C12.2891 19.5195 12.0156 19.8008 11.6563 19.8594C11.1172 19.9492 10.5625 19.9961 9.9961 19.9961C9.4297 19.9961 8.87501 19.9492 8.33595 19.8594C7.97657 19.8008 7.70314 19.5195 7.62501 19.1641L7.13673 16.9336C6.51954 16.6797 5.94142 16.3438 5.41798 15.9414L3.2461 16.6367C2.90235 16.7461 2.51954 16.6484 2.28907 16.3711C1.97267 15.9883 1.6836 15.582 1.42579 15.1523L1.2422 14.8359C1.00392 14.4062 0.796885 13.9609 0.62501 13.4961C0.50001 13.1562 0.605479 12.7773 0.87501 12.5352L2.56642 10.9961C2.52345 10.668 2.50001 10.3359 2.50001 10C2.50001 9.66406 2.52345 9.33203 2.56642 9.00781L0.87501 7.46875C0.605479 7.22656 0.50001 6.84766 0.62501 6.50781C0.796885 6.04297 1.00392 5.59766 1.2422 5.16797L1.42579 4.85156C1.6836 4.42188 1.97267 4.01562 2.28907 3.63281C2.51954 3.35156 2.90235 3.25781 3.2461 3.36719L5.42189 4.05859C5.94532 3.65625 6.52345 3.32031 7.14064 3.06641L7.62892 0.835938C7.70704 0.480469 7.98048 0.199219 8.33985 0.140625C8.87892 0.046875 9.4336 0 10 0C10.5664 0 11.1211 0.046875 11.6602 0.136719C12.0195 0.195312 12.293 0.476562 12.3711 0.832031L12.8594 3.0625C13.4766 3.31641 14.0547 3.65234 14.5781 4.05469L16.7539 3.36328C17.0977 3.25391 17.4805 3.35156 17.7109 3.62891C18.0274 4.01172 18.3164 4.41797 18.5742 4.84766L18.7578 5.16406C18.9961 5.59375 19.2031 6.03906 19.375 6.50391L19.3711 6.50781ZM10 13.125C11.7247 13.125 13.125 11.7247 13.125 10C13.125 8.27527 11.7247 6.875 10 6.875C8.27528 6.875 6.87501 8.27527 6.87501 10C6.87501 11.7247 8.27528 13.125 10 13.125Z"
                fill="#4B5563"
              />
            </svg>
            <h2 className="tubebay-t-3">Placement &amp; Player Settings</h2>
          </div>
        </div>
      )}

      {/* Muted Autoplay Default */}
      <div className="tubebay-flex tubebay-items-start tubebay-justify-between">
        <div className="tubebay-flex tubebay-gap-[12px]">
          <div className="tubebay-bg-[#eff6ff] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
            <svg
              width="18"
              height="18"
              fill="none"
              opacity="0.8"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="tubebay-text-[#3b82f6]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          </div>
          <div className="tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
            <h3 className="tubebay-t-4-bold tubebay-text-color-default">
              Muted Autoplay
            </h3>
            <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[540px]">
              By default, videos play automatically without sound.
            </p>
          </div>
        </div>
        <Switch
          checked={!!tmpOtherSettings.muted_autoplay}
          onChange={(checked) =>
            setTmpOtherSettings({
              ...tmpOtherSettings,
              muted_autoplay: checked,
            })
          }
          className={
            tmpOtherSettings.muted_autoplay
              ? "tubebay-bg-[#3b82f6]"
              : "tubebay-bg-gray-200"
          }
        />
      </div>

      {/* Show Controls Default */}
      <div className="tubebay-flex tubebay-items-start tubebay-justify-between">
        <div className="tubebay-flex tubebay-gap-[12px]">
          <div className="tubebay-bg-[#eff6ff] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
            <svg
              width="18"
              height="18"
              fill="none"
              opacity="0.8"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="tubebay-text-[#3b82f6]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="tubebay-flex tubebay-flex-col tubebay-gap-[4px]">
            <h3 className="tubebay-t-4-bold tubebay-text-color-default">
              Show Player Controls
            </h3>
            <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[540px]">
              By default, display YouTube video playback controls.
            </p>
          </div>
        </div>
        <Switch
          checked={!!tmpOtherSettings.show_controls}
          onChange={(checked) =>
            setTmpOtherSettings({
              ...tmpOtherSettings,
              show_controls: checked,
            })
          }
          className={
            tmpOtherSettings.show_controls
              ? "tubebay-bg-[#3b82f6]"
              : "tubebay-bg-gray-200"
          }
        />
      </div>

      <hr className="tubebay-border-gray-200" />

      {/* Global Video Placement */}
      <div className="tubebay-flex tubebay-flex-col tubebay-gap-[16px]">
        <div className="tubebay-flex tubebay-w-full tubebay-gap-[12px]">
          <div className=" tubebay-bg-[#fff7ed] tubebay-p-[8px] tubebay-rounded-[8px] tubebay-h-fit">
            <MapPinIcon size={18} className="tubebay-text-[#ea580c]" />
          </div>
          <div className="tubebay-flex tubebay-w-full tubebay-flex-col tubebay-gap-[4px]">
            <h3 className="tubebay-t-4-bold tubebay-text-color-default">
              Global Video Placement
            </h3>
            <p className="tubebay-text-[13px] tubebay-leading-[20px] tubebay-text-gray-500 tubebay-max-w-[700px]">
              Choose where videos will appear by default on your product pages.
            </p>

            <div className="tubebay-flex tubebay-items-center tubebay-gap-[12px] tubebay-w-full tubebay-mt-[12px]">
              <div className="tubebay-flex-1">
                <Select
                  value={tmpOtherSettings.video_placement || ""}
                  onChange={(val) =>
                    setTmpOtherSettings({
                      ...tmpOtherSettings,
                      video_placement: val as string,
                    })
                  }
                  options={PLACEMENT_OPTIONS.map((opt) => ({
                    value: opt.id,
                    label: opt.label,
                    labelNode: (
                      <div className="tubebay-flex tubebay-flex-col tubebay-py-1">
                        <span className="tubebay-font-bold tubebay-text-[13px]">
                          {opt.label}
                        </span>
                        <span className="tubebay-text-[11px] tubebay-opacity-60 tubebay-leading-tight">
                          {opt.description}
                        </span>
                      </div>
                    ),
                  }))}
                  placeholder="Choose placement..."
                  enableSearch={true}
                  border="tubebay-border-gray-200"
                  color="tubebay-text-gray-700"
                  fontSize={14}
                />
              </div>

              <div className="tubebay-flex-shrink-0">
                <Button
                  variant="outline"
                  className="tubebay-flex tubebay-items-center tubebay-gap-2 !tubebay-h-[42px] tubebay-w-[140px]"
                  onClick={() => setIsPreviewModalOpen(true)}
                >
                  <Eye className="w-4 h-4 tubebay-text-gray-500" />
                  <span className="tubebay-font-medium tubebay-text-[13px]">
                    Preview
                  </span>
                </Button>
              </div>
            </div>

            {isPreviewModalOpen && (
              <CustomModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                title="Live Placement Preview"
                maxWidth="tubebay-max-w-[90%] md:tubebay-max-w-[1000px] lg:tubebay-max-w-[1240px]"
                className="!tubebay-z-[9999]"
              >
                <div className="tubebay-flex tubebay-flex-col md:tubebay-flex-row tubebay-gap-8 tubebay-mb-2">
                  <div className="tubebay-w-full md:tubebay-w-[320px] tubebay-flex-shrink-0">
                    <div className="tubebay-mb-4">
                      <label className="tubebay-block tubebay-text-sm tubebay-font-semibold tubebay-text-gray-800 tubebay-mb-1">
                        Experiment with Video Positions
                      </label>
                      <p className="tubebay-text-[13px] tubebay-text-gray-500 tubebay-leading-relaxed">
                        Note: Changing the field below instantly mutates your
                        active global setting without needing to save. You will
                        see a live mock product page layout on the right.
                      </p>
                    </div>

                    <Select
                      value={tmpOtherSettings.video_placement || ""}
                      onChange={(val) =>
                        setTmpOtherSettings({
                          ...tmpOtherSettings,
                          video_placement: val as string,
                        })
                      }
                      options={PLACEMENT_OPTIONS.map((opt) => ({
                        value: opt.id,
                        label: opt.label,
                        labelNode: (
                          <div className="tubebay-flex tubebay-flex-col tubebay-py-1">
                            <span className="tubebay-font-bold tubebay-text-[13px]">
                              {opt.label}
                            </span>
                            <span className="tubebay-text-[11px] tubebay-opacity-60 tubebay-leading-tight">
                              {opt.description}
                            </span>
                          </div>
                        ),
                      }))}
                      placeholder="Choose placement..."
                      enableSearch={true}
                      border="tubebay-border-gray-200"
                      color="tubebay-text-gray-700"
                      fontSize={14}
                    />
                  </div>

                  <div
                    className="tubebay-flex-1 tubebay-bg-gray-50/50 tubebay-p-6 tubebay-rounded-xl tubebay-border tubebay-border-gray-200 tubebay-overflow-y-auto"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                  >
                    <ProductSkeleton
                      selectedPosition={
                        tmpOtherSettings.video_placement as VideoPosition
                      }
                      useMotion={false}
                    />
                  </div>
                </div>
              </CustomModal>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
