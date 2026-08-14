import { useState } from 'react'
import { categoryLabel, currencyFormatter } from '../constants'

function ProductCard({ product, onEdit, onDelete }) {
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
      <div className="flex h-32 items-center justify-center bg-surface-hover">
        {product.imageUrl && !imgFailed ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-sm text-ink-faint">Sem imagem</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="w-fit rounded-full bg-surface-hover px-2 py-0.5 text-xs font-medium text-ink-muted">
          {categoryLabel(product.category)}
        </span>
        <h3 className="font-semibold text-ink">{product.name}</h3>
        <p className="text-lg font-bold text-accent">
          {currencyFormatter.format(product.price)}
          <span className="ml-1 text-sm font-normal text-ink-muted">/{product.unit}</span>
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex-1 rounded-lg border border-line py-1.5 text-sm font-medium text-ink hover:bg-surface-hover"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex-1 rounded-lg border border-accent py-1.5 text-sm font-medium text-accent hover:bg-accent-soft"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
