import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="20"
      height="20"
      {...props}
    >
      {children}
    </svg>
  )
}

export const LogoIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h4l2 3h6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" />
    <path d="M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z" />
  </Base>
)

export const DashboardIcon = (p: P) => (
  <Base {...p}>
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="12" width="7" height="9" rx="1.5" />
    <rect x="3" y="16" width="7" height="5" rx="1.5" />
  </Base>
)

export const LeadsIcon = (p: P) => (
  <Base {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 8.5a3.5 3.5 0 0 1 0 7" />
    <path d="M17.5 14.5a6.5 6.5 0 0 1 4 5.5" />
  </Base>
)

export const PinIcon = (p: P) => (
  <Base {...p}>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Base>
)

export const SearchIcon = (p: P) => (
  <Base {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.8-3.8" />
  </Base>
)

export const BellIcon = (p: P) => (
  <Base {...p}>
    <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </Base>
)

export const MenuIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Base>
)

export const CloseIcon = (p: P) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
)

export const ChevronDownIcon = (p: P) => (
  <Base {...p}>
    <path d="m6 9 6 6 6-6" />
  </Base>
)

export const BackIcon = (p: P) => (
  <Base {...p}>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </Base>
)

export const PhoneIcon = (p: P) => (
  <Base {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </Base>
)

export const GlobeIcon = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </Base>
)

export const BuildingIcon = (p: P) => (
  <Base {...p}>
    <rect x="4" y="3" width="16" height="18" rx="1.5" />
    <path d="M9 21v-4h6v4M8 7h2m4 0h2M8 11h2m4 0h2" />
  </Base>
)

export const CheckIcon = (p: P) => (
  <Base {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Base>
)

export const FilterIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 6h16M7 12h10m-7 6h4" />
  </Base>
)

export const ExternalIcon = (p: P) => (
  <Base {...p}>
    <path d="M14 4h6v6m0-6L10 14" />
    <path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </Base>
)

export const TagIcon = (p: P) => (
  <Base {...p}>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z" />
    <circle cx="8" cy="8" r="1.5" />
  </Base>
)

export const CopyIcon = (p: P) => (
  <Base {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </Base>
)
