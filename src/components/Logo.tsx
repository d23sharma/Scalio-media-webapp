type LogoProps = {
  size?: number;
  className?: string;
};

export const Logo = ({ size = 36, className = "" }: LogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Scalio Media logo"
  >
    <defs>
      <linearGradient id="scalio-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4A9EFF" />
        <stop offset="100%" stopColor="#00D48A" />
      </linearGradient>
      <linearGradient
        id="scalio-grad-2"
        x1="0"
        y1="64"
        x2="64"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#00D48A" />
        <stop offset="100%" stopColor="#4A9EFF" />
      </linearGradient>
    </defs>
    {/* Infinity symbol */}
    <path
      d="M16 40 C 8 40, 8 24, 16 24 C 24 24, 28 40, 36 40 C 44 40, 48 32, 48 32"
      stroke="url(#scalio-grad)"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M48 32 C 48 32, 52 24, 48 24 C 40 24, 36 40, 28 40"
      stroke="url(#scalio-grad-2)"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    {/* Upward arrow */}
    <path
      d="M44 22 L52 14 L52 22 M52 14 L44 14"
      stroke="url(#scalio-grad)"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);
