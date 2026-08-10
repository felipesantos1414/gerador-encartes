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

function formatLocalDate(value) {
  // Accepts a "YYYY-MM-DD" date-input value or a full ISO datetime from the
  // API. Only the calendar date matters here, so the time is normalized to
  // local midnight to avoid UTC-offset day shifts near midnight.
  const datePart = String(value).slice(0, 10)
  return shortDateFormatter.format(new Date(`${datePart}T00:00:00`))
}

export function formatValidityRange(validFrom, validUntil) {
  if (!validFrom || !validUntil) return ''
  return `Ofertas válidas de ${formatLocalDate(validFrom)} à ${formatLocalDate(validUntil)}`
}

const DEFAULT_HEADLINE = 'Ofertas da Semana'

// Splits a flyer title into the two headline lines used by FlyerCanvas: the
// last word goes on line 2 (outlined), everything before it on line 1
// (solid) - e.g. "Mega Ofertas" -> "Mega" / "Ofertas",
// "Quarta de Ofertas" -> "Quarta de" / "Ofertas".
export function splitHeadline(title) {
  const trimmed = (title || DEFAULT_HEADLINE).trim()
  const lastSpace = trimmed.lastIndexOf(' ')
  if (lastSpace === -1) return { l1: '', l2: trimmed }
  return { l1: trimmed.slice(0, lastSpace), l2: trimmed.slice(lastSpace + 1) }
}
