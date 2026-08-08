import { categoryLabel, currencyFormatter } from '../constants'

function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex h-32 items-center justify-center bg-slate-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm text-slate-400">Sem imagem</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {categoryLabel(product.category)}
        </span>
        <h3 className="font-semibold text-slate-800">{product.name}</h3>
        <p className="text-lg font-bold text-emerald-700">
          {currencyFormatter.format(product.price)}
          <span className="ml-1 text-sm font-normal text-slate-500">/{product.unit}</span>
        </p>

        <div className="mt-auto flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => onEdit(product)}
            className="flex-1 rounded-lg border border-slate-300 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="flex-1 rounded-lg border border-red-300 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
