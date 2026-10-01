import { useEffect, useState } from 'react'
import { fetchLeadCities, type CityCount } from './api/leads'
import Dashboard from './components/Dashboard'
import Header from './components/Header'
import MainSection from './components/MainSection'
import Sidebar, { type NavView } from './components/Sidebar'

function App() {
  const [view, setView] = useState<NavView>('dashboard')
  const [city, setCity] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [cities, setCities] = useState<CityCount[]>([])

  useEffect(() => {
    const ctrl = new AbortController()
    fetchLeadCities(ctrl.signal)
      .then(setCities)
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  const navigate = (v: NavView, c = '') => {
    setView(v)
    setCity(c)
    window.scrollTo({ top: 0 })
  }

  const title =
    view === 'dashboard' ? 'Dashboard' : city ? `${city} Leads` : 'All Leads'

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <Header
        title={title}
        breadcrumb="LeadFlow"
        onMenu={() => setSidebarOpen(true)}
      />
      <div className="mx-auto flex max-w-[1400px] items-start">
        <Sidebar
          open={sidebarOpen}
          view={view}
          activeCity={city}
          cities={cities}
          onNavigate={navigate}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1 pb-10">
          {view === 'dashboard' ? (
            <Dashboard onOpenLeads={(c = '') => navigate('leads', c)} />
          ) : (
            <MainSection
              key={city}
              city={city}
              onCityChange={setCity}
              cities={cities}
            />
          )}
        </main>
      </div>
      <footer className="border-t border-slate-200/80 bg-white">
        <p className="mx-auto max-w-[1400px] px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-8">
          LeadFlow · Lead data served live from MongoDB · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}

export default App
