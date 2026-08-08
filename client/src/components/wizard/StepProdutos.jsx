import { useEffect, useState } from 'react'
import { listProducts } from '../../api/products'
import { categoryLabel, currencyFormatter } from '../../constants'

function StepProdutos({ selectedItems, onToggle, onOverridePriceChange, maxProducts }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    listProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const term = search.trim().toLowerCase()
  const filtered = term ? products.filter((p) => p.name.toLowerCase().includes(term)) : products

  const isSelected = (id) => selectedItems.some((item) => item.product._id === id)
  const atLimit = selectedItems.length >= maxProducts

  return (
    <div>
      <h2 className="mb-1 text-lg font-bold text-slate-800">2. Escolha os produtos</h2>
      <p className="mb-3 text-sm text-slate-500">
        {selectedItems.length}/{maxProducts} selecionados. Defina um preço promocional opcional para o encarte.
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nome..."
        className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-500">Carregando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum produto encontrado.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((product) => {
            const selected = isSelected(product._id)
            const item = selectedItems.find((i) => i.product._id === product._id)
            const disabled = !selected && atLimit

            return (
              <li
                key={product._id}
                className={`flex flex-wrap items-center gap-3 rounded-lg border p-2 ${
                  selected ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'
                } ${disabled ? 'opacity-50' : ''}`}
              >
                <label className="flex flex-1 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected}
                    disabled={disabled}
                    onChange={() => onToggle(product)}
                  />
                  <span className="text-sm font-medium text-slate-800">{product.name}</span>
                  <span className="text-xs text-slate-500">
                    {categoryLabel(product.category)} · {currencyFormatter.format(product.price)}/{product.unit}
                  </span>
                </label>

                {selected && (
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Preço promo."
                    value={item.overridePrice ?? ''}
                    onChange={(e) => onOverridePriceChange(product._id, e.target.value)}
                    className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  />
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default StepProdutos
