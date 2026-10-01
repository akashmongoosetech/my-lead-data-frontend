import { Button } from './ui'

interface Props {
  page: number
  totalPages: number
  total: number
  limit: number
  loading: boolean
  onPage: (p: number) => void
  onLimit: (l: number) => void
}

function pageNumbers(page: number, totalPages: number): (number | '…')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set<number>([1, 2, page - 1, page, page + 1, totalPages - 1, totalPages])
  const valid = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const p of valid) {
    if (p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }
  return out
}

export default function Pagination({ page, totalPages, total, limit, loading, onPage, onLimit }: Props) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <p className="text-sm text-slate-500">
        Showing <span className="font-bold text-slate-900">{from}–{to}</span> of{' '}
        <span className="font-bold text-slate-900">{total.toLocaleString()}</span>
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant="outline"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1 || loading}
          className="px-3 py-1.5"
        >
          ← Previous
        </Button>
        {pageNumbers(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`e${i}`} className="px-1 text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              disabled={loading}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className={`min-w-9 rounded-xl border px-2.5 py-1.5 text-sm font-semibold transition-colors disabled:opacity-40 ${
                p === page
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <Button
          variant="outline"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages || loading}
          className="px-3 py-1.5"
        >
          Next →
        </Button>
        <label className="ml-1 text-sm text-slate-500">
          Rows per page:{' '}
          <select
            value={limit}
            disabled={loading}
            onChange={(e) => onLimit(Number(e.target.value))}
            className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm font-medium"
            aria-label="Rows per page"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
