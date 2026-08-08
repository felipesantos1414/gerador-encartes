const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g')

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
