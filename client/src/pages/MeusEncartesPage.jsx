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
      <h1 className="mb-4 text-2xl font-bold text-ink">Meus Encartes</h1>

      {error && <p className="mb-4 text-sm text-accent">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-muted">Carregando...</p>
      ) : flyers.length === 0 ? (
        <p className="text-sm text-ink-muted">Nenhum encarte salvo ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {flyers.map((flyer) => {
            const theme = themes[flyer.themeId] || defaultTheme
            const busy = busyId === flyer._id

            return (
              <li
                key={flyer._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: theme.colors.background }} />
                    <h2 className="font-semibold text-ink">{flyer.title}</h2>
                  </div>
                  <p className="text-sm text-ink-muted">{flyer.storeName}</p>
                  <p className="text-xs text-ink-faint">
                    {formatValidityRange(flyer.validFrom, flyer.validUntil)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onOpen(flyer._id)}
                    className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
                  >
                    Reabrir
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDuplicate(flyer)}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-hover disabled:opacity-50"
                  >
                    Duplicar
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDelete(flyer)}
                    className="rounded-lg border border-accent px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent-soft disabled:opacity-50"
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
