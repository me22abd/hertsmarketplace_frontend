type LogoSize = 'sm' | 'md' | 'lg';

export type LogoVariant = 'responsive' | 'full' | 'icon';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}

const sizeClasses: Record<LogoSize, { icon: string; full: string }> = {
  sm: {
    icon: 'h-8 w-auto max-h-8',
    full: 'h-8 w-auto max-h-8 sm:h-9 sm:max-h-9 max-w-[200px] sm:max-w-[220px]',
  },
  md: {
    icon: 'h-9 w-auto max-h-9 sm:h-10 sm:max-h-10',
    full: 'h-9 w-auto max-h-9 sm:h-10 sm:max-h-10 md:h-11 md:max-h-11 max-w-[240px] sm:max-w-[280px] md:max-w-[300px]',
  },
  lg: {
    icon: 'h-10 w-auto max-h-10 sm:h-11 sm:max-h-11',
    full: 'h-10 w-auto max-h-10 sm:h-12 sm:max-h-12 md:h-14 md:max-h-14 max-w-[260px] sm:max-w-[300px] md:max-w-[340px]',
  },
};

export default function Logo({ size = 'md', variant = 'responsive', className = '' }: LogoProps) {
  const { icon: iconH, full: fullH } = sizeClasses[size];
  const showResponsive = variant === 'responsive';
  const showFull = variant === 'full' || showResponsive;
  const showIcon = variant === 'icon' || showResponsive;

  const imgClass = 'block object-contain object-left shrink-0';

  return (
    <div className={`flex items-center ${className}`.trim()}>
      {showIcon && (showResponsive ? (
        <img
          src="/herts-logo-icon.png"
          alt="HertsMarketplace"
          width={120}
          height={120}
          className={`${imgClass} ${iconH} md:hidden`}
          decoding="async"
        />
      ) : (
        <img
          src="/herts-logo-icon.png"
          alt="HertsMarketplace"
          width={120}
          height={120}
          className={`${imgClass} ${iconH}`}
          decoding="async"
        />
      ))}
      {showFull && (showResponsive ? (
        <img
          src="/herts-logo-full.png"
          alt="HertsMarketplace"
          width={320}
          height={120}
          className={`${imgClass} ${fullH} hidden md:block`}
          decoding="async"
        />
      ) : (
        <img
          src="/herts-logo-full.png"
          alt="HertsMarketplace"
          width={320}
          height={120}
          className={`${imgClass} ${fullH}`}
          decoding="async"
        />
      ))}
    </div>
  );
}
