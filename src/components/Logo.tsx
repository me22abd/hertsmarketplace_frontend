import { motion } from 'framer-motion';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
}

const sizeClasses: Record<LogoSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 sm:w-11 sm:h-11',
  lg: 'w-11 h-11 sm:w-14 sm:h-14',
};

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
        className={`${sizeClasses[size]} bg-primary rounded-xl flex items-center justify-center shadow-sm`}
      >
        {/* Simple HM monogram inside a bag shape */}
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6 text-white"
          aria-hidden="true"
        >
          <rect
            x="6"
            y="9"
            width="20"
            height="16"
            rx="4"
            ry="4"
            fill="currentColor"
            opacity="0.18"
          />
          <path
            d="M11 15v6M21 15v6M11 18h10"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 13a4 4 0 0 1 8 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
      {showText && (
        <div className="font-bold leading-tight">
          <span className="text-primary">Herts</span>
          <span className="text-gray-800">Marketplace</span>
        </div>
      )}
    </div>
  );
}

