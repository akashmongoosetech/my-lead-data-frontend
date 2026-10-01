import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LeadStatus } from '../api/leads'
import { CheckIcon } from './icons'

export const STATUS_STYLES: Record<LeadStatus, string> = {
  New: 'bg-blue-100 text-blue-800 ring-blue-600/20',
  Message: 'bg-purple-100 text-purple-800 ring-purple-600/20',
  Whatsapp: 'bg-green-100 text-green-800 ring-green-600/20',
  Call: 'bg-orange-100 text-orange-800 ring-orange-600/20',
  'Follow Up': 'bg-amber-100 text-amber-800 ring-amber-600/20',
  Convert: 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
  Working: 'bg-indigo-100 text-indigo-800 ring-indigo-600/20',
  Complete: 'bg-teal-100 text-teal-800 ring-teal-600/20',
}

const STATUS_DOT: Record<LeadStatus, string> = {
  New: 'bg-blue-600',
  Message: 'bg-purple-600',
  Whatsapp: 'bg-green-600',
  Call: 'bg-orange-500',
  'Follow Up': 'bg-amber-500',
  Convert: 'bg-emerald-600',
  Working: 'bg-indigo-600',
  Complete: 'bg-teal-600',
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      <span
        className={`size-1.5 rounded-full ${STATUS_DOT[status] ?? 'bg-gray-400'}`}
        aria-hidden="true"
      />
      {status}
    </span>
  )
}

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-sm hover:bg-brand-700 focus-visible:outline-brand-600',
  secondary:
    'bg-brand-50 text-brand-700 ring-brand-600/20 hover:bg-brand-100 focus-visible:outline-brand-600',
  outline:
    'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus-visible:outline-brand-600',
  ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:outline-brand-600',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:outline-red-600',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}

export function Card({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 ${className}`}
      aria-hidden="true"
    />
  )
}

export function StatSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-20" />
      <Skeleton className="mt-2 h-3 w-32" />
    </Card>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white"
      aria-label="Loading leads"
      role="status"
    >
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"
        >
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <Card className="px-6 py-12 text-center">
      <p className="text-base font-semibold text-slate-900">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <Card className="border-red-200 bg-red-50/60 px-6 py-10 text-center">
      <p className="text-base font-semibold text-slate-900">
        Something went wrong
      </p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-600">
        We couldn&apos;t load the data right now.
      </p>
      <p className="mx-auto mt-2 max-w-md truncate text-xs text-slate-400">
        {message}
      </p>
      <Button onClick={onRetry} className="mt-4" variant="danger">
        Try Again
      </Button>
    </Card>
  )
}

export function Toast({ message, tone = 'dark' }: { message: string; tone?: 'dark' | 'success' }) {
  return (
    <div
      role="status"
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 animate-[toast-in_0.2s_ease_both] items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-[var(--shadow-pop)] ${
        tone === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'
      }`}
    >
      {tone === 'success' && <CheckIcon width={16} height={16} />}
      {message}
    </div>
  )
}
