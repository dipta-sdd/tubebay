import { FC, SVGProps } from "react";

/**
 * Shared SVG icon props.
 * Pass `size` for width/height and `className` for styling.
 */
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const defaultStroke: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// ─── Settings / Gear ────────────────────────────────────────────────
export const SettingsIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 11.375C0 11.859 0.391016 12.25 0.875 12.25H2.3707C2.70703 13.0238 3.47813 13.5625 4.375 13.5625C5.27187 13.5625 6.04297 13.0238 6.3793 12.25H13.125C13.609 12.25 14 11.859 14 11.375C14 10.891 13.609 10.5 13.125 10.5H6.3793C6.04297 9.72617 5.27187 9.1875 4.375 9.1875C3.47813 9.1875 2.70703 9.72617 2.3707 10.5H0.875C0.391016 10.5 0 10.891 0 11.375ZM3.5 11.375C3.5 10.8921 3.89207 10.5 4.375 10.5C4.85793 10.5 5.25 10.8921 5.25 11.375C5.25 11.8579 4.85793 12.25 4.375 12.25C3.89207 12.25 3.5 11.8579 3.5 11.375ZM8.75 7C8.75 6.51707 9.14207 6.125 9.625 6.125C10.1079 6.125 10.5 6.51707 10.5 7C10.5 7.48293 10.1079 7.875 9.625 7.875C9.14207 7.875 8.75 7.48293 8.75 7ZM9.625 4.8125C8.72812 4.8125 7.95703 5.35117 7.6207 6.125H0.875C0.391016 6.125 0 6.51602 0 7C0 7 0.391016 7.875 0.875 7.875H7.6207C7.95703 8.64883 8.72812 9.1875 9.625 9.1875C9.625 9.1875 11.293 8.64883 11.6293 7.875H13.125C13.609 7.875 14 7.48398 14 7C14 7 13.609 6.125 13.125 6.125H11.6293C11.293 5.35117 10.5219 4.8125 9.625 4.8125ZM5.25 3.5C4.76707 3.5 4.375 3.10793 4.375 2.625C4.375 2.14207 4.76707 1.75 5.25 1.75C5.73293 1.75 6.125 2.14207 6.125 2.625C6.125 3.10793 5.73293 3.5 5.25 3.5ZM7.2543 1.75C6.91797 0.976172 6.14687 0.4375 5.25 0.4375C4.35313 0.4375 3.58203 0.976172 3.2457 1.75H0.875C0.391016 1.75 0 2.14102 0 2.625C0 3.10898 0.391016 3.5 0.875 3.5H3.2457C3.58203 4.27383 4.35313 4.8125 5.25 4.8125C5.25 4.8125 6.91797 4.27383 7.2543 3.5H13.125C13.609 3.5 14 3.10898 14 2.625C14 2.625 13.609 1.75 13.125 1.75H7.2543Z"
      fill="currentColor"
    />
  </svg>
);

// ─── Channel Library (monitor + chevron) ────────────────────────────
export const ChannelLibraryIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M0 3.5C0 2.53477 0.784766 1.75 1.75 1.75H8.75C9.71523 1.75 10.5 2.53477 10.5 3.5V10.5C10.5 11.4652 9.71523 12.25 8.75 12.25H1.75C0.784766 12.25 0 11.4652 0 10.5V3.5ZM15.2879 2.72891C15.5723 2.88203 15.75 3.17734 15.75 3.5V10.5C15.75 10.8227 15.5723 11.118 15.2879 11.2711C15.2879 11.2711 14.659 11.4078 14.3883 11.2273L11.7633 9.47734L11.375 9.21758V8.75V5.25V4.78242L11.7633 4.52266L14.3883 2.77266C14.6562 2.59492 15.0008 2.57578 15.2879 2.72891Z"
      fill="currentColor"
    />
  </svg>
);

// ─── Shopping Bag / Products ────────────────────────────────────────
export const ShoppingBagIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

// ─── Help / Question Circle ─────────────────────────────────────────
export const HelpStethoscopeIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.89375 0.598839C4.04688 1.05821 3.79805 1.55314 3.34141 1.70626L2.625 1.94415V5.25001C2.625 6.69923 3.80078 7.87501 5.25 7.87501C6.69922 7.87501 7.875 6.69923 7.875 5.25001V1.94415L7.16133 1.70626C6.70195 1.55314 6.45586 1.05821 6.60898 0.598839C6.76211 0.139464 7.25703 -0.10663 7.71641 0.0464954L8.43008 0.284386C9.14375 0.522277 9.625 1.18946 9.625 1.94415V5.25001C9.625 7.36095 8.13203 9.12189 6.14414 9.53478C6.31641 11.0633 7.6125 12.25 9.1875 12.25C10.8801 12.25 12.25 10.8801 12.25 9.18751V7.25431C11.4762 6.91798 10.9375 6.14689 10.9375 5.25001C10.9375 4.04142 11.9164 3.06251 13.125 3.06251C14.3336 3.06251 15.3125 4.04142 15.3125 5.25001C15.3125 6.14689 14.7738 6.91798 14 7.25431V9.18751C14 11.8453 11.8453 14 9.1875 14C6.64727 14 4.56914 12.034 4.38867 9.54025C2.38438 9.13829 0.875 7.37189 0.875 5.25001V1.94415C0.875 1.1922 1.35625 0.522277 2.07266 0.284386L2.78633 0.0464954C3.2457 -0.10663 3.74062 0.142199 3.89375 0.598839ZM13.125 6.12501C13.6079 6.12501 14 5.73294 14 5.25001C14 4.76709 13.6079 4.37501 13.125 4.37501C12.6421 4.37501 12.25 4.76709 12.25 5.25001C12.25 5.73294 12.6421 6.12501 13.125 6.12501Z"
      fill="currentColor"
    />
  </svg>
);

// ─── Wifi / Connection ──────────────────────────────────────────────
export const WifiIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

// ─── YouTube (stroke) ───────────────────────────────────────────────
export const YouTubeIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

// ─── YouTube (filled logo) ──────────────────────────────────────────
export const YouTubeFilledIcon: FC<IconProps> = ({ size = 40, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

// ─── Clock ──────────────────────────────────────────────────────────
export const ClockIcon: FC<IconProps> = ({ size = 12, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 0C9.31149 0 12 2.68851 12 6C12 9.31149 9.31149 12 6 12C2.68851 12 0 9.31149 0 6C0 2.68851 2.68851 0 6 0ZM5.4375 2.8125V6C5.4375 6.1875 5.53125 6.36328 5.68828 6.46875L7.93828 7.96875C8.19609 8.14219 8.54531 8.07188 8.71875 7.81172C8.89219 7.55156 8.82188 7.20469 8.56172 7.03125L6.5625 5.7V2.8125C6.5625 2.50078 6.31172 2.25 6 2.25C5.68828 2.25 5.4375 2.50078 5.4375 2.8125Z"
      fill="currentColor"
    />
  </svg>
);

// ─── Link / Connect ─────────────────────────────────────────────────
export const LinkIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

// ─── Refresh / Sync ─────────────────────────────────────────────────
export const RefreshIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21v-5h5" />
  </svg>
);

// ─── Refresh (half variant for onboarding) ──────────────────────────
export const RefreshHalfIcon: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M3 12a9 9 1 0 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

// ─── Check ──────────────────────────────────────────────────────────
export const CheckIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Info Circle ────────────────────────────────────────────────────
export const InfoIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// ─── List ───────────────────────────────────────────────────────────
export const ListIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

// ─── Eye / Preview ──────────────────────────────────────────────────
export const EyeIcon: FC<IconProps> = ({ size = 16, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// ─── Calendar ───────────────────────────────────────────────────────
export const CalendarIcon: FC<IconProps> = ({ size = 14, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// ─── Code / Shortcode brackets ──────────────────────────────────────
export const CodeIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

// ─── Menu (hamburger) ───────────────────────────────────────────────
export const MenuIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 12H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 6H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 18H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Close (X) ──────────────────────────────────────────────────────
export const CloseIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 18L18 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── File / Setup Wizard ────────────────────────────────────────────
export const FlightIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.11967 15.0352L4.91264 13.8281C4.5806 13.4961 4.46342 13.0156 4.61185 12.5703C4.72904 12.2227 4.88529 11.7696 5.07279 11.25H0.939979C0.604042 11.25 0.291542 11.0703 0.123573 10.7774C-0.0443957 10.4844 -0.0404895 10.125 0.131386 9.83596L2.18217 6.37893C2.68998 5.52346 3.60795 5.00002 4.60014 5.00002H7.81498C7.90873 4.84377 8.00248 4.69924 8.09623 4.55862C11.2954 -0.160134 16.0611 -0.316384 18.9048 0.207054C19.3579 0.289085 19.7095 0.644554 19.7954 1.09768C20.3189 3.94533 20.1587 8.70705 15.4439 11.9063C15.3072 12 15.1587 12.0938 15.0025 12.1875V15.4024C15.0025 16.3946 14.479 17.3164 13.6236 17.8203L10.1665 19.8711C9.87748 20.043 9.5181 20.0469 9.22514 19.8789C8.93217 19.711 8.75248 19.4024 8.75248 19.0625V14.875C8.2017 15.0664 7.72123 15.2227 7.35795 15.3399C6.92045 15.4805 6.44389 15.3594 6.11576 15.0352H6.11967ZM15.0025 6.56252C15.8648 6.56252 16.565 5.86239 16.565 5.00002C16.565 4.13766 15.8648 3.43752 15.0025 3.43752C14.1401 3.43752 13.44 4.13766 13.44 5.00002C13.44 5.86239 14.1401 6.56252 15.0025 6.56252Z"
      fill="white"
    />
  </svg>
);

// ─── Book / Documentation ───────────────────────────────────────────
export const BookIcon: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

// ─── Arrow Right ────────────────────────────────────────────────────
export const ArrowRightIcon: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ─── Headphones / Support ───────────────────────────────────────────
export const HeadphonesIcon: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M2 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2v-8z" />
    <path d="M22 12h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v-8z" />
    <path d="M12 2C6.48 2 2 6.48 2 12" />
    <path d="M22 12c0-5.52-4.48-10-10-10" />
  </svg>
);

// ─── Sliders / Adjustments ──────────────────────────────────────────
export const SlidersIcon: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

// ─── Target / Bullseye (WordPress) ──────────────────────────────────
export const TargetIcon: FC<IconProps> = ({ size = 14, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// ─── Chevron Down (Selects) ─────────────────────────────────────────
export const ChevronDownIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// ─── X (Close alternate) ────────────────────────────────────────────
export const XIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// ─── Check (Stepper/Path variant) ───────────────────────────────────
export const CheckPathIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

// ─── Lock Keyhole ───────────────────────────────────────────────────
export const LockKeyholeIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <circle cx="12" cy="16" r="1" />
    <rect x="3" y="10" width="18" height="12" rx="2" />
    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
  </svg>
);

// ─── Hourglass ──────────────────────────────────────────────────────
export const HourglassIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M5 22h14" />
    <path d="M5 2h14" />
    <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
    <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
  </svg>
);

// ─── Map Pin / Location ─────────────────────────────────────────────
export const MapPinIcon: FC<IconProps> = ({ size = 18, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// ─── Plus ───────────────────────────────────────────────────────────
export const PlusIcon: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Minus ──────────────────────────────────────────────────────────
export const MinusIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    {...defaultStroke}
    {...props}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ─── Google ────────────────────────────────────────────────────────
export const GoogleIcon: FC<IconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

// ─── Check Circle (Solid) ──────────────────────────────────────────
export const CheckCircleIcon: FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

// ─── Check Solid (Selects) ──────────────────────────────────────────
export const CheckSolidIcon: FC<IconProps> = ({ ...props }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
