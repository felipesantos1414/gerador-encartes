import { useEffect, useRef, useState } from 'react'
import { getFlyer } from '../api/flyers'
import { themes, defaultTheme } from '../themes'
import { formatValidityRange } from '../constants'
import { exportPDF, exportPNG } from '../utils/export'
import { slugify } from '../utils/slugify'
import FlyerCanvas from '../components/FlyerCanvas'

function PreviewExportPage({ flyerId, onBack }) {
  const [flyer, setFlyer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState('')
  const flyerRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setError('')
    getFlyer(flyerId)
      .then(setFlyer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [flyerId])

  async function handleExport(type) {
    setExporting(type)
    setError('')
    try {
      const filename = `encarte-${slugify(flyer.title)}`
      if (type === 'pdf') await exportPDF(flyerRef.current, filename)
      else await exportPNG(flyerRef.current, filename)
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting('')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm font-medium text-slate-600 hover:underline"
      >
        ← Meus Encartes
      </button>

      {loading && <p className="text-sm text-slate-500">Carregando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {flyer && (
        <>
          <h1 className="mb-1 text-2xl font-bold text-slate-800">{flyer.title}</h1>
          <p className="mb-4 text-sm text-slate-500">{flyer.storeName}</p>

          <div className="flex flex-col items-center gap-4">
            <FlyerCanvas
              ref={flyerRef}
              theme={themes[flyer.themeId] || defaultTheme}
              storeName={flyer.storeName}
              validityText={formatValidityRange(flyer.validFrom, flyer.validUntil)}
              items={flyer.items.map((item) => ({
                id: item.product._id,
                name: item.product.name,
                unit: item.product.unit,
                imageUrl: item.product.imageUrl,
                price: item.overridePrice ?? item.product.price,
              }))}
            />

            <div className="flex gap-2">
              <button
                type="button"
                disabled={Boolean(exporting)}
                onClick={() => handleExport('pdf')}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {exporting === 'pdf' ? 'Gerando PDF...' : 'Baixar PDF'}
              </button>
              <button
                type="button"
                disabled={Boolean(exporting)}
                onClick={() => handleExport('png')}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                {exporting === 'png' ? 'Gerando PNG...' : 'Baixar PNG'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PreviewExportPage
