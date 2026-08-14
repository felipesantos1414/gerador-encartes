import { useEffect, useMemo, useState } from 'react'
import { createProduct, deleteProduct, listProducts, updateProduct } from '../api/products'
import { CATEGORIES } from '../constants'
import ProductCard from '../components/ProductCard'
import ProductFormModal from '../components/ProductFormModal'

function ProdutosPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const data = await listProducts(category)
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((p) => p.name.toLowerCase().includes(term))
  }, [products, search])

  function openCreateModal() {
    setEditingProduct(null)
    setModalOpen(true)
  }

  function openEditModal(product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  async function handleSubmit(form) {
    if (editingProduct) {
      await updateProduct(editingProduct._id, form)
    } else {
      await createProduct(form)
    }
    setModalOpen(false)
    await loadProducts()
  }

  async function handleDelete(product) {
    if (!window.confirm(`Excluir "${product.name}"?`)) return
    await deleteProduct(product._id)
    await loadProducts()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-ink">Produtos</h1>
        <button
          type="button"
          onClick={openCreateModal}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          + Novo produto
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome..."
          className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-faint"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {error && <p className="mb-4 text-sm text-accent">{error}</p>}

      {loading ? (
        <p className="text-sm text-ink-muted">Carregando...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-sm text-ink-muted">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

export default ProdutosPage
