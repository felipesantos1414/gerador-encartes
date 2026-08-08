import { useEffect, useState } from 'react'
import { listFlyers, createFlyer, deleteFlyer } from '../api/flyers'
import { themes, defaultTheme } from '../themes'
import { formatValidityRange } from '../constants'

function MeusEncartesPage({ onOpen }) {
  const [flyers, setFlyers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      setFlyers(await listFlyers())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDuplicate(flyer) {
    setBusyId(flyer._id)
    setError('')
    try {
      await createFlyer({
        title: `${flyer.title} (cópia)`,
        themeId: flyer.themeId,
        validFrom: flyer.validFrom,
        validUntil: flyer.validUntil,
        storeName: flyer.storeName,
        items: flyer.items.map((item) => ({ product: item.product, overridePrice: item.overridePrice })),
      })
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId('')
    }
  }

  async function handleDelete(flyer) {
    if (!window.confirm(`Excluir "${flyer.title}"?`)) return
    setBusyId(flyer._id)
    setError('')
    try {
      await deleteFlyer(flyer._id)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Meus Encartes</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Carregando...</p>
      ) : flyers.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum encarte salvo ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {flyers.map((flyer) => {
            const theme = themes[flyer.themeId] || defaultTheme
            const busy = busyId === flyer._id

            return (
              <li
                key={flyer._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: theme.colors.background }} />
                    <h2 className="font-semibold text-slate-800">{flyer.title}</h2>
                  </div>
                  <p className="text-sm text-slate-500">{flyer.storeName}</p>
                  <p className="text-xs text-slate-400">
                    {formatValidityRange(flyer.validFrom, flyer.validUntil)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onOpen(flyer._id)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Reabrir
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDuplicate(flyer)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Duplicar
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(flyer)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default MeusEncartesPage
