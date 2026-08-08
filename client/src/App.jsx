import { useState } from 'react'
import ProdutosPage from './pages/ProdutosPage'
import NovoEncartePage from './pages/NovoEncartePage'

const TABS = [
  { id: 'produtos', label: 'Produtos' },
  { id: 'novo-encarte', label: 'Novo Encarte' },
]

function App() {
  const [tab, setTab] = useState('produtos')

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <h1 className="mb-2 text-lg font-bold text-slate-800">Gerador de Encartes</h1>
        <nav className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === t.id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'produtos' && <ProdutosPage />}
      {tab === 'novo-encarte' && <NovoEncartePage />}
    </div>
  )
}

export default App
