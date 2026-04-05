type LogoSize = 'sm' | 'md' | 'lg';

export type LogoVariant = 'responsive' | 'full' | 'icon';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}

const sizeClasses: Record<LogoSize, { icon: string; full: string }> = {
  sm: {
    icon: 'h-10 w-auto max-h-10 sm:h-11 sm:max-h-11',
    full: 'h-9 w-auto max-h-9 sm:h-10 sm:max-h-10 md:h-11 md:max-h-11 max-w-[220px] sm:max-w-[260px] md:max-w-[280px]',
  },
  md: {
    icon: 'h-12 w-auto max-h-12 sm:h-14 sm:max-h-14',
    full: 'h-11 w-auto max-h-11 sm:h-12 sm:max-h-12 md:h-14 md:max-h-14 lg:h-[4.25rem] lg:max-h-[4.25rem] max-w-[min(92vw,320px)] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[480px]',
  },
  lg: {
    icon: 'h-14 w-auto max-h-14 sm:h-16 sm:max-h-16',
    full: 'h-12 w-auto max-h-12 sm:h-14 sm:max-h-14 md:h-16 md:max-h-16 lg:h-[4.5rem] lg:max-h-[4.5rem] max-w-[min(92vw,360px)] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[520px]',
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
