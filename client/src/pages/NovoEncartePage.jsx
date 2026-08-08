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

function NovoEncartePage() {
  const [step, setStep] = useState(1)
  const [themeId, setThemeId] = useState(defaultTheme.id)
  const [selectedItems, setSelectedItems] = useState([])
  const [dados, setDados] = useState(emptyDados)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState(null)

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
      setSavedId(flyer._id)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function resetWizard() {
    setStep(1)
    setThemeId(defaultTheme.id)
    setSelectedItems([])
    setDados(emptyDados)
    setSavedId(null)
    setError('')
  }

  if (savedId) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <h2 className="mb-2 text-xl font-bold text-slate-800">Encarte salvo!</h2>
        <p className="mb-4 text-sm text-slate-500">
          Seu encarte foi salvo com sucesso. O export em PDF/PNG chega na próxima fase.
        </p>
        <button
          type="button"
          onClick={resetWizard}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Criar outro encarte
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Novo Encarte</h1>

      <ol className="mb-6 flex gap-4">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex items-center gap-2 text-sm font-medium ${
              step === i + 1 ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                step === i + 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200'
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

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Voltar
              </button>
            )}
            {step < 3 && (
              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setStep((s) => s + 1)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Próximo
              </button>
            )}
            {step === 3 && (
              <button
                type="button"
                disabled={!canSave || saving}
                onClick={handleSave}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? 'Salvando...' : 'Salvar encarte'}
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center md:sticky md:top-6 md:w-[360px] md:shrink-0">
          <FlyerCanvas
            theme={theme}
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
