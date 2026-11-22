import Avatar from './Avatar'
import PageHead from './PageHead'

// Money map: where the money leaves the LLC and what each account is for.
// A reminder only, nothing here is calculated.
const SOURCE = { name: 'Oakstone Thirteen LLC', note: 'Moves money out to Revolut and Bunq' }
const DESTINATIONS = [
  { name: 'Revolut', use: 'Spending in Malta' },
  { name: 'Bunq', use: 'Personal investments and savings' },
]
const SEPARATE = { name: 'Intesa', use: 'Pays off Amex' }

function Row({ name, use }) {
  return (
    <div className="flex items-center gap-3 py-3 border-t border-line first:border-t-0">
      <Avatar name={name} size={28} />
      <span className="text-[15px] text-ink flex-1 min-w-0 truncate">{name}</span>
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
          <div className="mt-3 pt-1 border-t border-line">
            <Row {...SEPARATE} />
          </div>
        </div>
      </section>
    </div>
  )
}
