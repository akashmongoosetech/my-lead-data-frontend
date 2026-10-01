import { useState } from 'react'
import { LEAD_STATUSES, normalizeWebsite, type Lead, type LeadStatus } from '../api/leads'
import { CheckIcon, CopyIcon, GlobeIcon, PhoneIcon } from './icons'
import { StatusBadge } from './ui'

interface Props {
  leads: Lead[]
  updatingId: string | null
  onStatusChange: (id: string, status: LeadStatus) => void
  page: number
  limit: number
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    } catch {
      return false
    }
  }
}

function CopyButton({
  text,
  copied,
  onCopy,
  label,
}: {
  text: string
  copied: boolean
  onCopy: () => void
  label: string
}) {
  return (
    <button
      onClick={() => void copyText(text).then((ok) => ok && onCopy())}
      className={`rounded-lg p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-brand-600 ${
        copied
          ? 'bg-emerald-100 text-emerald-700'
          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      }`}
      aria-label={copied ? 'Copied' : label}
      title={copied ? 'Copied!' : label}
    >
      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
    </button>
  )
}

export default function LeadTable({ leads, updatingId, onStatusChange, page, limit }: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const markCopied = (key: string) => {
    setCopiedKey(key)
    setTimeout(() => {
      setCopiedKey((cur) => (cur === key ? null : cur))
    }, 1500)
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-[var(--shadow-card)]">
      <table className="min-w-[1100px] w-full text-left text-sm">
        <thead className="sticky top-0 border-b border-slate-200 bg-slate-50/95 text-xs uppercase tracking-wide text-slate-500 backdrop-blur">
          <tr>
            {['#', 'Lead', 'Category', 'Location', 'Contact', 'Website', 'Status', 'Actions'].map((h) => (
              <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leads.map((lead, i) => {
            const site = normalizeWebsite(lead.website)
            return (
              <tr key={lead._id} className="transition-colors hover:bg-brand-50/50">
                <td className="whitespace-nowrap px-4 py-3 font-semibold tabular-nums text-slate-400">
                  {(page - 1) * limit + i + 1}
                </td>
                <td className="max-w-[240px] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700"
                      aria-hidden="true"
                    >
                      {(lead.title || '?').charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 truncate font-semibold text-slate-900" title={lead.title}>
                        <span className="truncate">{lead.title || '—'}</span>
                        {lead.sourceDataset && (
                          <span
                            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ring-1 ring-inset ${
                              lead.sourceDataset === 'dataset_2'
                                ? 'bg-cyan-50 text-cyan-700 ring-cyan-600/20'
                                : 'bg-slate-100 text-slate-600 ring-slate-500/20'
                            }`}
                            title={lead.sourceDataset === 'dataset_2' ? 'Dataset 2' : 'Dataset 1'}
                          >
                            {lead.sourceDataset === 'dataset_2' ? 'D2' : 'D1'}
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-slate-400" title={lead.address}>
                        {lead.address || '—'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="max-w-[160px] truncate px-4 py-3 text-slate-600" title={lead.categoryName}>
                  {lead.categoryName || '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {[lead.city, lead.postalCode].filter(Boolean).join(' · ') || '—'}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {lead.phone ? (
                    <span className="inline-flex items-center gap-1">
                      <a
                        href={`tel:${lead.phoneUnformatted || lead.phone}`}
                        className="inline-flex items-center gap-1.5 font-medium text-brand-600 hover:underline"
                      >
                        <PhoneIcon width={14} height={14} />
                        {lead.phone}
                      </a>
                      <CopyButton
                        text={lead.phoneUnformatted || lead.phone}
                        copied={copiedKey === `${lead._id}:phone`}
                        onCopy={() => markCopied(`${lead._id}:phone`)}
                        label={`Copy phone number for ${lead.title}`}
                      />
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                  {lead.phoneUnformatted && (
                    <span className="block text-xs text-slate-400">{lead.phoneUnformatted}</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {site ? (
                    <span className="inline-flex items-center gap-1">
                      <a
                        href={site}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-brand-600 hover:underline"
                        title={lead.website}
                      >
                        <GlobeIcon width={14} height={14} />
                        {lead.website.length > 24 ? `${lead.website.slice(0, 24)}…` : lead.website}
                      </a>
                      <CopyButton
                        text={site}
                        copied={copiedKey === `${lead._id}:site`}
                        onCopy={() => markCopied(`${lead._id}:site`)}
                        label={`Copy website URL for ${lead.title}`}
                      />
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <select
                    value={lead.status}
                    disabled={updatingId === lead._id}
                    onChange={(e) => onStatusChange(lead._id, e.target.value as LeadStatus)}
                    className="rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium disabled:opacity-50"
                    aria-label={`Change status for ${lead.title}`}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
