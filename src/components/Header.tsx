import { BellIcon, LogoIcon, MenuIcon, SearchIcon } from './icons'

export default function Header({
  title,
  breadcrumb,
  onMenu,
}: {
  title: string
  breadcrumb: string
  onMenu: () => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <MenuIcon />
        </button>
        <span className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <LogoIcon width={20} height={20} />
          </span>
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            LeadFlow
          </span>
        </span>
        <span className="ml-2 hidden text-sm text-slate-400 md:inline">
          {breadcrumb}
          <span className="mx-2 text-slate-300">/</span>
          <span className="font-semibold text-slate-700">{title}</span>
        </span>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <label className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500 focus-within:ring-2 focus-within:ring-brand-600/30 md:flex">
            <SearchIcon width={16} height={16} />
            <input
              placeholder="Quick search…"
              className="w-36 bg-transparent outline-none placeholder:text-slate-400 lg:w-48"
              aria-label="Quick search"
            />
          </label>
          <button
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <BellIcon />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-brand-600 ring-2 ring-white" />
          </button>
          <span
            className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white"
            role="img"
            aria-label="Signed in as Admin"
            title="Admin"
          >
            A
          </span>
        </div>
      </div>
    </header>
  )
}
