import { useState } from 'react'
import ProdutosPage from './pages/ProdutosPage'
import NovoEncartePage from './pages/NovoEncartePage'
import MeusEncartesPage from './pages/MeusEncartesPage'
import PreviewExportPage from './pages/PreviewExportPage'
import PrintFlyerPage from './pages/PrintFlyerPage'

const TABS = [
  { id: 'produtos', label: 'Produtos' },
  { id: 'novo-encarte', label: 'Novo Encarte' },
  { id: 'meus-encartes', label: 'Meus Encartes' },
]

// ?print=<flyerId> is not a real screen in the tab flow above - it's the URL
// the server's Puppeteer export pipeline navigates to (see
// server/src/routes/export.js), reusing this same app/build instead of a
// separate render path. Checked before any of the normal screen state so it
// takes over the whole page with nothing else (no header/nav chrome) - see
// PrintFlyerPage for the readiness signal Puppeteer waits on.
const printFlyerId = new URLSearchParams(window.location.search).get('print')

function App() {
  if (printFlyerId) {
    return <PrintFlyerPage flyerId={printFlyerId} />
  }

  return <AppShell />
}

function AppShell() {
  const [screen, setScreen] = useState({ name: 'produtos' })

  function goToTab(tabId) {
    setScreen({ name: tabId })
  }

  function goToPreview(flyerId) {
    setScreen({ name: 'preview', flyerId })
  }

  const activeTab = screen.name === 'preview' ? 'meus-encartes' : screen.name

  return (
    <div className="min-h-screen bg-base">
      <header className="border-b border-line bg-surface px-4 py-3">
        <h1 className="mb-2 text-lg font-bold text-ink">Gerador de Encartes</h1>
        <nav className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goToTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                activeTab === t.id ? 'bg-accent text-white' : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {screen.name === 'produtos' && <ProdutosPage />}
      {screen.name === 'novo-encarte' && <NovoEncartePage onSaved={goToPreview} />}
      {screen.name === 'meus-encartes' && <MeusEncartesPage onOpen={goToPreview} />}
      {screen.name === 'preview' && (
        <PreviewExportPage flyerId={screen.flyerId} onBack={() => goToTab('meus-encartes')} />
      )}
    </div>
  )
}

export default App
