type LogoSize = 'sm' | 'md' | 'lg';

export type LogoVariant = 'responsive' | 'full' | 'icon';

interface LogoProps {
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
}

const sizeClasses: Record<LogoSize, { icon: string; full: string }> = {
  sm: {
    icon: 'h-12 w-auto sm:h-14',
    full: 'h-11 w-auto sm:h-12 md:h-14 max-w-[260px] sm:max-w-[300px] md:max-w-[340px]',
  },
  md: {
    icon: 'h-14 w-auto sm:h-16',
    full: 'h-12 w-auto sm:h-14 md:h-16 lg:h-20 xl:h-[5.5rem] max-w-[min(92vw,360px)] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[600px] xl:max-w-[640px]',
  },
  lg: {
    icon: 'h-16 w-auto sm:h-[4.5rem]',
    full: 'h-14 w-auto sm:h-16 md:h-20 lg:h-24 xl:h-[6.5rem] max-w-[min(92vw,400px)] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[680px] xl:max-w-[720px]',
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
          width={160}
          height={160}
          className={`${imgClass} ${iconH} md:hidden`}
          decoding="async"
        />
      ) : (
        <img
          src="/herts-logo-icon.png"
          alt="HertsMarketplace"
          width={160}
          height={160}
          className={`${imgClass} ${iconH}`}
          decoding="async"
        />
      ))}
      {showFull && (showResponsive ? (
        <img
          src="/herts-logo-full.png"
          alt="HertsMarketplace"
          width={640}
          height={200}
          className={`${imgClass} ${fullH} hidden md:block`}
          decoding="async"
        />
      ) : (
        <img
          src="/herts-logo-full.png"
          alt="HertsMarketplace"
          width={640}
          height={200}
          className={`${imgClass} ${fullH}`}
          decoding="async"
        />
      ))}
    </div>
  );
}
