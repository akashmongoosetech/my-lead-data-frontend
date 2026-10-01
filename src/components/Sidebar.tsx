import { CloseIcon, DashboardIcon, LeadsIcon, LogoIcon, PinIcon } from './icons'

export type NavView = 'dashboard' | 'leads'

export interface CityCount {
  city: string
  count: number
}

const ACCENTS = [
  'from-blue-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-purple-500 to-fuchsia-500',
  'from-rose-500 to-pink-500',
  'from-cyan-500 to-sky-500',
]

export default function Sidebar({
  open,
  view,
  activeCity,
  cities,
  onNavigate,
  onClose,
}: {
  open: boolean
  view: NavView
  activeCity: string
  cities: CityCount[]
  onNavigate: (view: NavView, city?: string) => void
  onClose: () => void
}) {
  const go = (v: NavView, city = '') => {
    onNavigate(v, city)
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-68 max-w-[85vw] -translate-x-full flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 lg:sticky lg:top-16 lg:z-auto lg:h-[calc(100svh-4rem)] lg:w-64 lg:shrink-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : ''
        }`}
        aria-label="Primary navigation"
      >
        <div className="flex items-center gap-2 px-5 pb-2 pt-5 lg:hidden">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <LogoIcon width={20} height={20} />
          </span>
          <span className="text-base font-extrabold text-slate-900">LeadFlow</span>
          <button
            onClick={onClose}
            className="ml-auto rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation menu"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <button
            onClick={() => go('dashboard')}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              view === 'dashboard' && !activeCity
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-current={view === 'dashboard' && !activeCity ? 'page' : undefined}
          >
            <DashboardIcon width={18} height={18} />
            Dashboard
          </button>
          <button
            onClick={() => go('leads', '')}
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              view === 'leads' && !activeCity
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-current={view === 'leads' && !activeCity ? 'page' : undefined}
          >
            <LeadsIcon width={18} height={18} />
            All Leads
          </button>

          <p className="px-3 pb-1 pt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
            Cities
          </p>
          <ul className="space-y-1">
            {cities.slice(0, 6).map((c, i) => {
              const active = view === 'leads' && activeCity === c.city
              return (
                <li key={c.city}>
                  <button
                    onClick={() => go('leads', c.city)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-brand-50 font-semibold text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white ${ACCENTS[i % ACCENTS.length]}`}
                    >
                      <PinIcon width={15} height={15} />
                    </span>
                    <span className="truncate">{c.city || 'Unknown'}</span>
                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                      {c.count.toLocaleString()}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Need help?</p>
            <p className="mt-0.5">Manage leads across cities from one place.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
