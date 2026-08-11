import { useEffect, useState } from 'react'
import { removeBackground } from '@imgly/background-removal'
import { CATEGORIES, UNITS } from '../constants'
import { uploadImage } from '../api/products'

const emptyForm = { name: '', price: '', unit: 'un', category: 'mercearia', imageUrl: '' }

function ProductFormModal({ product, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [removeBg, setRemoveBg] = useState(true)
  const [saving, setSaving] = useState(false)
  const [removingBg, setRemovingBg] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        unit: product.unit,
        category: product.category,
        imageUrl: product.imageUrl || '',
      })
      setPreview(product.imageUrl || '')
    } else {
      setForm(emptyForm)
      setPreview('')
    }
    setImageFile(null)
    setError('')
  }, [product])

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || !form.price || Number(form.price) <= 0) {
      setError('Preencha nome e um preço válido.')
      return
    }

    setSaving(true)
    try {
      let imageUrl = form.imageUrl
      if (imageFile) {
        let fileToUpload = imageFile
        if (removeBg) {
          setRemovingBg(true)
          try {
            const cutout = await removeBackground(imageFile)
            const baseName = imageFile.name.replace(/\.[^.]+$/, '')
            fileToUpload = new File([cutout], `${baseName}.png`, { type: 'image/png' })
          } finally {
            setRemovingBg(false)
          }
        }
        imageUrl = await uploadImage(fileToUpload)
      }
      await onSubmit({ ...form, price: Number(form.price), imageUrl })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-lg font-bold text-slate-800">
          {product ? 'Editar produto' : 'Novo produto'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Nome
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Refrigerante 2L"
            />
          </label>

          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
              Preço (R$)
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="6.99"
              />
            </label>

            <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
              Unidade
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Categoria
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Imagem
            <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm" />
          </label>

          {imageFile && (
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Remover fundo automaticamente
                <span className="block text-xs text-slate-400">
                  Desative se a foto já tiver fundo transparente
                </span>
              </span>
            </label>
          )}

          {preview && (
            <img src={preview} alt="Pré-visualização" className="h-24 w-24 self-center rounded-lg object-cover" />
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-emerald-600 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {removingBg ? 'Removendo fundo...' : saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
