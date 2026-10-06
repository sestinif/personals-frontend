import { PlusIcon } from './Icons'

// Page header: optional greeting, 24px title, primary action on the right.
// On desktop the action shows its label; on phones (≤640px) it is a round "+".
export default function PageHead({ greeting, title, actionLabel, onAction }) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        {greeting && <div className="text-[14px] text-ink-dim">{greeting}</div>}
        <h1 className="text-[24px] font-medium text-ink tracking-tight leading-tight">{title}</h1>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="flex-shrink-0 inline-flex items-center justify-center gap-2 bg-accent text-bg font-medium rounded-lg transition-colors hover:bg-brand-700 h-9 px-3.5 text-[13px] max-[640px]:w-9 max-[640px]:px-0 max-[640px]:rounded-full"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="max-[640px]:hidden">{actionLabel}</span>
        </button>
      )}
    </div>
  )
}
