import {
  LEAD_STATUSES,
  normalizeWebsite,
  type Lead,
  type LeadStatus,
} from '../api/leads'
import { GlobeIcon, PhoneIcon, PinIcon } from './icons'
import { Card, StatusBadge } from './ui'

export default function LeadCard({
  lead,
  updating,
  onStatusChange,
}: {
  lead: Lead
  updating: boolean
  onStatusChange: (id: string, status: LeadStatus) => void
}) {
  const site = normalizeWebsite(lead.website)
  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-base font-bold text-brand-700"
          aria-hidden="true"
        >
          {(lead.title || '?').charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-bold text-slate-900">
            <span className="truncate">{lead.title || '—'}</span>
            {lead.sourceDataset && (
              <span
                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset ${
                  lead.sourceDataset === 'dataset_2'
                    ? 'bg-cyan-50 text-cyan-700 ring-cyan-600/20'
                    : 'bg-slate-100 text-slate-600 ring-slate-500/20'
                }`}
              >
                {lead.sourceDataset === 'dataset_2' ? 'D2' : 'D1'}
              </span>
            )}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {lead.categoryName || 'Uncategorized'}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <dl className="mt-3 space-y-1.5 text-sm">
        {(lead.city || lead.postalCode) && (
          <div className="flex items-center gap-2 text-slate-600">
            <PinIcon width={15} height={15} />
            <span className="truncate">
              {[lead.city, lead.postalCode].filter(Boolean).join(' · ') || '—'}
            </span>
          </div>
        )}
        {lead.address && (
          <p className="line-clamp-2 text-xs text-slate-500">{lead.address}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
          {lead.phone ? (
            <a
              href={`tel:${lead.phoneUnformatted || lead.phone}`}
              className="inline-flex items-center gap-1.5 font-medium text-brand-600"
            >
              <PhoneIcon width={15} height={15} />
              {lead.phone}
            </a>
          ) : (
            <span className="text-slate-400">No phone</span>
          )}
          {site ? (
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-brand-600"
            >
              <GlobeIcon width={15} height={15} />
              Website
            </a>
          ) : (
            <span className="text-slate-400">No website</span>
          )}
        </div>
      </dl>

      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
        <label htmlFor={`status-${lead._id}`} className="text-xs font-medium text-slate-500">
          Status
        </label>
        <select
          id={`status-${lead._id}`}
          value={lead.status}
          disabled={updating}
          onChange={(e) => onStatusChange(lead._id, e.target.value as LeadStatus)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium disabled:opacity-50"
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </Card>
  )
}
