import AnimatedNumber from './AnimatedNumber'

export default function SplitCurrency({ amount, className = '', size = 'lg', animate = true }) {
  const sizes = {
    sm: { main: 'text-[16px]', cents: 'text-[11px]', symbol: 'text-[11px]' },
    md: { main: 'text-[22px]', cents: 'text-[13px]', symbol: 'text-[13px]' },
    lg: { main: 'text-[32px]', cents: 'text-[16px]', symbol: 'text-[16px]' },
    xl: { main: 'text-[40px]', cents: 'text-[20px]', symbol: 'text-[18px]' },
  }

  const s = sizes[size] || sizes.lg

  function renderStatic(val) {
    const parts = val.toFixed(2).split('.')
    const intPart = parseInt(parts[0]).toLocaleString('it-IT')
    const decPart = parts[1]
    return (
      <span className={`font-number inline-flex items-baseline gap-0.5 ${className}`}>
        <span className={`${s.main} font-bold tracking-tight leading-none`}>{intPart}</span>
        <span className={`${s.cents} font-semibold text-white/50 leading-none`}>,{decPart}</span>
        <span className={`${s.symbol} font-semibold text-white/40 ml-0.5 leading-none`}>EUR</span>
      </span>
    )
  }

  if (!animate) return renderStatic(amount)

  return (
    <AnimatedNumber
      value={amount}
      duration={1200}
      formatFn={(val) => null}
      className={className}
      renderFn={(val) => {
        const parts = val.toFixed(2).split('.')
        const intPart = parseInt(parts[0]).toLocaleString('it-IT')
        const decPart = parts[1]
        return (
          <span className={`font-number inline-flex items-baseline gap-0.5 ${className}`}>
            <span className={`${s.main} font-bold tracking-tight leading-none`}>{intPart}</span>
            <span className={`${s.cents} font-semibold text-white/50 leading-none`}>,{decPart}</span>
            <span className={`${s.symbol} font-semibold text-white/40 ml-0.5 leading-none`}>EUR</span>
          </span>
        )
      }}
    />
  )
}
