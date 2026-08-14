import { useMemo, useState } from 'react'
import { themes, defaultTheme } from '../themes'
import { formatValidityRange } from '../constants'
import { createFlyer } from '../api/flyers'
import FlyerCanvas from '../components/FlyerCanvas'
import StepTema from '../components/wizard/StepTema'
import StepProdutos from '../components/wizard/StepProdutos'
import StepDados from '../components/wizard/StepDados'

const STEPS = ['Tema', 'Produtos', 'Dados']

const emptyDados = { title: '', storeName: '', validFrom: '', validUntil: '' }

function NovoEncartePage({ onSaved }) {
  const [step, setStep] = useState(1)
  const [themeId, setThemeId] = useState(defaultTheme.id)
  const [selectedItems, setSelectedItems] = useState([])
  const [dados, setDados] = useState(emptyDados)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const theme = themes[themeId] || defaultTheme

  function toggleProduct(product) {
    setSelectedItems((prev) => {
      const exists = prev.some((item) => item.product._id === product._id)
      if (exists) return prev.filter((item) => item.product._id !== product._id)
      if (prev.length >= theme.maxProducts) return prev
      return [...prev, { product, overridePrice: '' }]
    })
  }

  function setOverridePrice(productId, value) {
    setSelectedItems((prev) =>
      prev.map((item) => (item.product._id === productId ? { ...item, overridePrice: value } : item)),
    )
  }

  const previewItems = useMemo(
    () =>
      selectedItems.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        unit: item.product.unit,
        imageUrl: item.product.imageUrl,
        price: item.overridePrice !== '' && item.overridePrice != null
          ? Number(item.overridePrice)
          : item.product.price,
      })),
    [selectedItems],
  )

  const validityText = formatValidityRange(dados.validFrom, dados.validUntil)

  const canGoNext =
    (step === 1 && Boolean(themeId)) ||
    (step === 2 && selectedItems.length > 0) ||
    step === 3

  const canSave =
    dados.title.trim() && dados.storeName.trim() && dados.validFrom && dados.validUntil && selectedItems.length > 0

  async function handleSave() {
    setError('')
    setSaving(true)
    try {
      const flyer = await createFlyer({
        title: dados.title,
        themeId,
        validFrom: dados.validFrom,
        validUntil: dados.validUntil,
        storeName: dados.storeName,
        items: selectedItems.map((item) => ({
          product: item.product._id,
          overridePrice: item.overridePrice !== '' && item.overridePrice != null
            ? Number(item.overridePrice)
            : undefined,
        })),
      })
      onSaved(flyer._id)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-ink">Novo Encarte</h1>

      <ol className="mb-6 flex gap-4">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex items-center gap-2 text-sm font-medium ${
              step === i + 1 ? 'text-accent' : 'text-ink-faint'
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                step === i + 1 ? 'bg-accent text-white' : 'bg-surface-hover text-ink-muted'
              }`}
            >
              {i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="flex-1">
          {step === 1 && <StepTema themeId={themeId} onSelect={setThemeId} />}
          {step === 2 && (
            <StepProdutos
              selectedItems={selectedItems}
              onToggle={toggleProduct}
              onOverridePriceChange={setOverridePrice}
              maxProducts={theme.maxProducts}
            />
          )}
          {step === 3 && <StepDados form={dados} onChange={(patch) => setDados((d) => ({ ...d, ...patch }))} />}

          {error && <p className="mt-3 text-sm text-accent">{error}</p>}

          <div className="mt-6 flex gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-surface-hover"
              >
                Voltar
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
              >
                Próximo
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                disabled={!canSave || saving}
                onClick={handleSave}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar encarte'}
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center md:sticky md:top-6 md:w-[360px] md:shrink-0">
          <FlyerCanvas
            theme={theme}
            title={dados.title}
            storeName={dados.storeName || 'Seu Mercado'}
            validityText={validityText || 'Defina o período de validade'}
            items={previewItems}
          />
        </div>
      </div>
    </div>
  )
}

export default NovoEncartePage
