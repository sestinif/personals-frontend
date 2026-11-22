import Avatar from './Avatar'
import PageHead from './PageHead'

// Money map: where the money leaves the LLC and what each account is for.
// A reminder only, nothing here is calculated.
const SOURCE = { name: 'Oakstone Thirteen LLC', note: 'Moves money out to Revolut, Bunq and Intesa' }
const DESTINATIONS = [
  { name: 'Revolut', use: 'Spending in Malta', note: 'Only account for the Malta declaration' },
  { name: 'Bunq', use: 'Personal investments and savings' },
  { name: 'Intesa', use: 'Pays off Amex', note: 'Also receives dividends' },
]

function Row({ name, use, note }) {
  return (
    <div className="flex items-center gap-3 py-3 border-t border-line first:border-t-0">
      <Avatar name={name} size={28} />
      <div className="flex-1 min-w-0">
        <div className="text-[15px] text-ink truncate">{name}</div>
        {note && <div className="text-[13px] text-ink-dim">{note}</div>}
      </div>
      <span className="text-[14px] text-ink-dim text-right">{use}</span>
    </div>
  )
}

export default function Settings() {
  return (
    <div>
      <PageHead title="Settings" />
      <section>
        <h2 className="text-[13px] text-ink-dim mb-2">Mapping</h2>
        <div className="card p-[18px]">
          <div className="flex items-center gap-3 pb-3">
            <Avatar name={SOURCE.name} size={28} />
            <div className="min-w-0">
              <div className="text-[15px] text-ink truncate">{SOURCE.name}</div>
              <div className="text-[13px] text-ink-dim">{SOURCE.note}</div>
            </div>
          </div>
          <div className="ps-[14px] ms-[14px] border-s border-line">
            {DESTINATIONS.map((d) => <Row key={d.name} {...d} />)}
          </div>
        </div>
      </section>
    </div>
  )
}
