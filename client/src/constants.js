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

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })

export function formatValidityRange(validFrom, validUntil) {
  if (!validFrom || !validUntil) return ''
  const from = shortDateFormatter.format(new Date(`${validFrom}T00:00:00`))
  const until = shortDateFormatter.format(new Date(`${validUntil}T00:00:00`))
  return `Ofertas válidas de ${from} à ${until}`
}
