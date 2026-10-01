import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DATASETS,
  DATASET_LABELS,
  LEAD_STATUSES,
  fetchLeadCategories,
  fetchLeads,
  updateLeadStatus,
  type CityCount,
  type Dataset,
  type Lead,
  type LeadStatus,
} from '../api/leads'
import { SearchIcon } from './icons'
import LeadCard from './LeadCard'
import LeadTable from './LeadTable'
import Pagination from './Pagination'
import { Button, EmptyState, ErrorState, PageHeader, TableSkeleton, Toast } from './ui'

const SORTS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: 'title', label: 'Title A–Z' },
  { value: '-title', label: 'Title Z–A' },
]

export default function MainSection({
  city,
  onCityChange,
  cities,
}: {
  city: string
  onCityChange: (city: string) => void
  cities: CityCount[]
}) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LeadStatus | ''>('')
  const [category, setCategory] = useState('')
  const [dataset, setDataset] = useState<Dataset | ''>('')
  const [sort, setSort] = useState('-createdAt')
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [toastTone, setToastTone] = useState<'dark' | 'success'>('dark')
  const abortRef = useRef<AbortController | null>(null)
  const reqId = useRef(0)

  // Reset to first page when navigating to another city
  const cityRef = useRef(city)
  useEffect(() => {
    if (cityRef.current !== city) {
      cityRef.current = city
      setPage(1)
    }
  }, [city])

  // Debounce search input -> server query
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      setSearch(searchInput.trim())
    }, 400)
    return () => clearTimeout(t)
  }, [searchInput])

  const load = useCallback(async () => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const myReq = ++reqId.current
    setLoading(true)
    setError(null)
    try {
      const res = await fetchLeads(
        { page, limit, search, status, category, city: city || undefined, sourceDataset: dataset || undefined, sort },
        ctrl.signal
      )
      if (myReq !== reqId.current) return // stale response
      setLeads(res.data)
      setTotal(res.pagination.total)
      setTotalPages(res.pagination.totalPages)
      setPage(res.pagination.page)
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
      setError((e as Error).message)
      setLeads([])
    } finally {
      if (myReq === reqId.current) setLoading(false)
    }
  }, [page, limit, search, status, category, city, dataset, sort])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const ctrl = new AbortController()
    fetchLeadCategories(ctrl.signal)
      .then(setCategories)
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  const showToast = (msg: string, tone: 'dark' | 'success' = 'dark', ms = 2500) => {
    setToast(msg)
    setToastTone(tone)
    setTimeout(() => setToast(null), ms)
  }

  const handleStatusChange = async (id: string, next: LeadStatus) => {
    if (updatingId) return
    setUpdatingId(id)
    try {
      const updated = await updateLeadStatus(id, next)
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)))
      showToast(`✓ Lead status updated to ${next}`, 'success')
    } catch (e) {
      console.error(e)
      showToast('Could not update status. Please try again.', 'dark', 3000)
    } finally {
      setUpdatingId(null)
    }
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearch('')
    setStatus('')
    setCategory('')
    setDataset('')
    setSort('-createdAt')
    onCityChange('')
    setPage(1)
  }

  const hasFilters = Boolean(search || status || category || city || dataset || sort !== '-createdAt')

  return (
    <div className="mx-auto max-w-[1400px] animate-[fade-up_0.25s_ease_both] px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title={city ? `${city} Leads` : 'All Leads'}
        subtitle={`${total.toLocaleString()} total leads · server-side pagination`}
      />

      <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[var(--shadow-card)] sm:p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5 text-sm focus-within:ring-2 focus-within:ring-brand-600/30">
            <SearchIcon width={16} height={16} />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search title, category, city, phone…"
              className="w-full bg-transparent outline-none placeholder:text-slate-400"
              aria-label="Search leads"
            />
          </label>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <select
              value={dataset}
              onChange={(e) => {
                setPage(1)
                setDataset(e.target.value as Dataset | '')
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium"
              aria-label="Filter by data source"
            >
              <option value="">Data Source: All</option>
              {DATASETS.map((d) => (
                <option key={d} value={d}>{DATASET_LABELS[d]}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setPage(1)
                setStatus(e.target.value as LeadStatus | '')
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium"
              aria-label="Filter by status"
            >
              <option value="">Status: All</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={city}
              onChange={(e) => {
                setPage(1)
                onCityChange(e.target.value)
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium"
              aria-label="Filter by city"
            >
              <option value="">City: All</option>
              {cities.map((c) => (
                <option key={c.city || 'unknown'} value={c.city}>
                  {c.city || 'Unknown'} ({c.count.toLocaleString()})
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => {
                setPage(1)
                setCategory(e.target.value)
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium"
              aria-label="Filter by category"
            >
              <option value="">Category: All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setPage(1)
                setSort(e.target.value)
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium"
              aria-label="Sort leads"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>Sort: {s.label}</option>
              ))}
            </select>
          </div>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-2 text-xs font-semibold text-brand-600 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="mt-4">
        {loading && <TableSkeleton rows={6} />}
        {!loading && error && (
          <ErrorState message={error} onRetry={load} />
        )}
        {!loading && !error && leads.length === 0 && (
          <EmptyState
            title={city ? `No leads available for ${city}` : 'No leads found'}
            message="There are no leads matching your current filters."
            action={
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            }
          />
        )}
        {!loading && !error && leads.length > 0 && (
          <>
            <div className="hidden md:block">
              <LeadTable leads={leads} updatingId={updatingId} onStatusChange={handleStatusChange} page={page} limit={limit} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">
              {leads.map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  updating={updatingId === lead._id}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={limit}
              loading={loading}
              onPage={setPage}
              onLimit={(l) => {
                setPage(1)
                setLimit(l)
              }}
            />
          </>
        )}
      </div>

      {toast && <Toast message={toast} tone={toastTone} />}
    </div>
  )
}
