import type { AuthUser } from "@/lib/auth/types";

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
       <rect width="40" height="40" rx="20" fill="#374151"/>
       <circle cx="20" cy="16" r="6" fill="#9CA3AF"/>
       <path d="M8 34c2-6 8-9 12-9s10 3 12 9" fill="#9CA3AF"/>
     </svg>`,
  );

interface UserIconProps {
  user: AuthUser | null;
  size?: number;
}

export const UserIcon = ({ user, size = 36 }: UserIconProps) => {
  const dimension = { width: size, height: size };

  if (!user) {
    return (
      <img
        src={DEFAULT_AVATAR}
        alt="Guest user"
        style={dimension}
        className="rounded-full object-cover ring-1 ring-white/20"
      />
    );
  }

  if (user.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name || user.email}
        style={dimension}
        className="rounded-full object-cover ring-1 ring-white/20"
      />
    );
  }

  const letter = (user.name || user.email || "?").trim().charAt(0).toUpperCase();
  return (
    <div
      style={dimension}
      className="rounded-full bg-gradient-brand text-white font-semibold flex items-center justify-center ring-1 ring-white/20"
      aria-label={user.name || user.email}
    >
      {letter}
    </div>
  );
};
