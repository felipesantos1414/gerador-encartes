export const UNITS = ['un', 'kg', 'L', 'pct']

export const CATEGORIES = [
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'hortifruti', label: 'Hortifruti' },
  { value: 'padaria', label: 'Padaria' },
  { value: 'acougue', label: 'Açougue' },
  { value: 'mercearia', label: 'Mercearia' },
]

export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label || value
}

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
