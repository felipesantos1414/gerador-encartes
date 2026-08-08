import { useState } from 'react'
import ProdutosPage from './pages/ProdutosPage'
import NovoEncartePage from './pages/NovoEncartePage'
import MeusEncartesPage from './pages/MeusEncartesPage'
import PreviewExportPage from './pages/PreviewExportPage'

const TABS = [
  { id: 'produtos', label: 'Produtos' },
  { id: 'novo-encarte', label: 'Novo Encarte' },
  { id: 'meus-encartes', label: 'Meus Encartes' },
]

function App() {
  const [screen, setScreen] = useState({ name: 'produtos' })

  function goToTab(tabId) {
    setScreen({ name: tabId })
  }

  function goToPreview(flyerId) {
    setScreen({ name: 'preview', flyerId })
  }

  const activeTab = screen.name === 'preview' ? 'meus-encartes' : screen.name

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="mb-2 text-lg font-bold text-slate-800">Gerador de Encartes</h1>
        <nav className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goToTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                activeTab === t.id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
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
