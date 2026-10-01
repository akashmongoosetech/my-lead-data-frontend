import { useEffect, useState } from 'react'
import {
  fetchLeadCities,
  fetchLeadStats,
  type CityCount,
  type LeadStats,
} from '../api/leads'
import { BuildingIcon, CheckIcon, LeadsIcon, PinIcon } from './icons'
import { Button, Card, EmptyState, ErrorState, PageHeader, StatSkeleton } from './ui'

const CARD_ACCENTS = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-purple-500 to-fuchsia-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-sky-500',
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard({
  onOpenLeads,
}: {
  onOpenLeads: (city?: string) => void
}) {
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [cities, setCities] = useState<CityCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, c] = await Promise.all([fetchLeadStats(), fetchLeadCities()])
      setStats(s)
      setCities(c)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const ctrl = new AbortController()
    load()
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cards = stats
    ? [
        {
          label: 'Total Leads',
          value: stats.total,
          hint: 'Across all cities',
          icon: <LeadsIcon width={18} height={18} />,
          chip: 'bg-brand-50 text-brand-700',
        },
        {
          label: 'New Leads',
          value: stats.byStatus.New,
          hint: 'Awaiting first action',
          icon: <PinIcon width={18} height={18} />,
          chip: 'bg-blue-50 text-blue-700',
        },
        {
          label: 'Working',
          value: stats.byStatus.Working,
          hint: 'In active progress',
          icon: <BuildingIcon width={18} height={18} />,
          chip: 'bg-indigo-50 text-indigo-700',
        },
        {
          label: 'Converted',
          value: stats.byStatus.Convert,
          hint: 'Successfully closed',
          icon: <CheckIcon width={18} height={18} />,
          chip: 'bg-emerald-50 text-emerald-700',
        },
        {
          label: 'Dataset 1',
          value: stats.byDataset.dataset_1,
          hint: 'Ujjain medical leads',
          icon: <BuildingIcon width={18} height={18} />,
          chip: 'bg-slate-100 text-slate-600',
        },
        {
          label: 'Dataset 2',
          value: stats.byDataset.dataset_2,
          hint: 'Indore construction leads',
          icon: <BuildingIcon width={18} height={18} />,
          chip: 'bg-cyan-50 text-cyan-700',
        },
      ]
    : []

  return (
    <div className="mx-auto max-w-[1400px] animate-[fade-up_0.25s_ease_both] px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={`${greeting()} 👋`}
        subtitle="Lead Management Dashboard — monitor and manage your leads across cities."
        action={
          <Button onClick={() => onOpenLeads()} variant="primary">
            View All Leads
          </Button>
        }
      />

      <div className="mt-6">
        {loading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <StatSkeleton key={i} />
            ))}
          </div>
        )}
        {!loading && error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => (
              <Card key={c.label} className="p-5 transition-shadow hover:shadow-[var(--shadow-pop)]">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">{c.label}</p>
                  <span className={`rounded-lg p-2 ${c.chip}`}>{c.icon}</span>
                </div>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                  {c.value.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-400">{c.hint}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold tracking-tight text-slate-900">
          Explore Leads by City
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Select a city to view and manage its leads.
        </p>
        {loading && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Card key={i} className="p-5">
                <div className="flex items-center gap-3">
                  <div className="size-11 animate-pulse rounded-xl bg-slate-200/80" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200/80" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200/80" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {!loading && !error && cities.length === 0 && (
          <div className="mt-4">
            <EmptyState
              title="No cities found"
              message="There are no lead cities in the database yet."
            />
          </div>
        )}
        {!loading && !error && cities.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cities.slice(0, 9).map((c, i) => (
              <button
                key={c.city || 'unknown'}
                onClick={() => onOpenLeads(c.city)}
                className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-pop)] focus-visible:outline-2 focus-visible:outline-brand-600"
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`}
                >
                  <PinIcon />
                </span>
                <span className="mt-3 block text-base font-bold text-slate-900">
                  {c.city || 'Unknown'}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">
                  {c.count.toLocaleString()} leads
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2">
                  View Leads <span aria-hidden="true">→</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
