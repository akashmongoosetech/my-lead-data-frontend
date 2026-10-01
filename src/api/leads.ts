const API_BASE = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
).replace(/\/+$/, '')

export const LEAD_STATUSES = [
  'New',
  'Message',
  'Whatsapp',
  'Call',
  'Follow Up',
  'Convert',
  'Working',
  'Complete',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const DATASETS = ['dataset_1', 'dataset_2'] as const

export type Dataset = (typeof DATASETS)[number]

export const DATASET_LABELS: Record<Dataset, string> = {
  dataset_1: 'Dataset 1',
  dataset_2: 'Dataset 2',
}

export interface Lead {
  _id: string
  title: string
  categoryName: string
  address: string
  city: string
  postalCode: string
  website: string
  phone: string
  phoneUnformatted: string
  status: LeadStatus
  sourceDataset: Dataset
  createdAt: string
  updatedAt: string
}

export interface LeadListParams {
  page?: number
  limit?: number
  search?: string
  status?: LeadStatus | ''
  category?: string
  city?: string
  sourceDataset?: Dataset | ''
  sort?: string
}

export interface LeadListResponse {
  success: boolean
  data: Lead[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export async function fetchLeads(
  params: LeadListParams,
  signal?: AbortSignal
): Promise<LeadListResponse> {
  const q = new URLSearchParams()
  q.set('page', String(params.page ?? 1))
  q.set('limit', String(params.limit ?? 20))
  if (params.search) q.set('search', params.search)
  if (params.status) q.set('status', params.status)
  if (params.category) q.set('category', params.category)
  if (params.city) q.set('city', params.city)
  if (params.sourceDataset) q.set('sourceDataset', params.sourceDataset)
  if (params.sort) q.set('sort', params.sort)
  const res = await fetch(`${API_BASE}/api/leads?${q.toString()}`, { signal })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Failed to fetch leads (${res.status})`)
  }
  return res.json()
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<Lead> {
  const res = await fetch(`${API_BASE}/api/leads/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Status update failed (${res.status})`)
  }
  const json = await res.json()
  return json.data as Lead
}

export async function fetchLeadCategories(signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/leads/meta/categories`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch categories (${res.status})`)
  const json = await res.json()
  return json.data as string[]
}

export interface LeadStats {
  total: number
  byStatus: Record<LeadStatus, number>
  byDataset: Record<Dataset, number>
}

export async function fetchLeadStats(signal?: AbortSignal): Promise<LeadStats> {
  const res = await fetch(`${API_BASE}/api/leads/stats`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch stats (${res.status})`)
  const json = await res.json()
  return json.data as LeadStats
}

export interface CityCount {
  city: string
  count: number
}

export async function fetchLeadCities(signal?: AbortSignal): Promise<CityCount[]> {
  const res = await fetch(`${API_BASE}/api/leads/meta/cities`, { signal })
  if (!res.ok) throw new Error(`Failed to fetch cities (${res.status})`)
  const json = await res.json()
  return json.data as CityCount[]
}

export function normalizeWebsite(url: string): string | null {
  const v = url?.trim()
  if (!v) return null
  try {
    const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`
    const u = new URL(withProto)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    return u.toString()
  } catch {
    return null
  }
}
