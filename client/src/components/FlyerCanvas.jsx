import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { splitHeadline } from '../constants'
import './FlyerCanvas.css'

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// Splits items into as few rows as possible (never exceeding maxCols per
// row), then balances the item count evenly across those rows so the last
// row never ends up with a lone orphan item - e.g. 7 items at maxCols=4
// becomes 4+3, not 4+3 front-loaded followed by a leftover, and 4 items
// becomes 2+2 rather than a single row of 4.
function buildRows(items, maxCols, maxProducts) {
  const capped = items.slice(0, maxProducts)
  if (capped.length === 0) return []
  const rowCount = Math.ceil(capped.length / maxCols)
  const base = Math.floor(capped.length / rowCount)
  const remainder = capped.length % rowCount
  const rows = []
  let i = 0
  for (let r = 0; r < rowCount; r++) {
    const count = base + (r < remainder ? 1 : 0)
    rows.push({ items: capped.slice(i, i + count), maxCols })
    i += count
  }
  return rows
}

function FallbackIcon() {
  return (
    <div className="img-fallback-wrap">
      <svg
        className="img-fallback"
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2 3h2l1.2 4h13.6l-1.8 8H7.4L6.4 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9.5" cy="19" r="1.4" fill="currentColor" />
        <circle cx="16.5" cy="19" r="1.4" fill="currentColor" />
      </svg>
    </div>
  )
}

// l1/l2 are forced to a single line each via CSS (white-space: nowrap), so
// the headline can never wrap into a 3rd line. This hook instead measures
// whether either line's natural text width overflows the space the flex
// layout actually gave .headline, and computes the font-size scale that
// makes the wider line fit.
//
// .headline's available width isn't stable at mount: for the "logo" header
// variant it depends on the mascot/logo images' rendered width, which is
// still unknown (0) until those <img>s finish loading, well after this
// effect's first synchronous pass. A ResizeObserver on .headline re-measures
// whenever its allotted width actually changes for any reason (images
// loading, the flyer itself resizing), instead of trusting a single
// mount-time reading. Each measurement forces --headline-scale back to 1
// first so scrollWidth always reflects the true unshrunk text width, rather
// than compounding ratios against whatever scale happened to be applied.
function useHeadlineFit(l1, l2) {
  const l1Ref = useRef(null)
  const l2Ref = useRef(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const l1El = l1Ref.current
    const l2El = l2Ref.current
    if (!l1El || !l2El) return
    const headlineEl = l1El.parentElement

    function measureAndFit() {
      const prevScale = headlineEl.style.getPropertyValue('--headline-scale')
      headlineEl.style.setProperty('--headline-scale', '1')
      const ratio = Math.max(
        l1El.scrollWidth / Math.max(l1El.clientWidth, 1),
        l2El.scrollWidth / Math.max(l2El.clientWidth, 1),
        1,
      )
      headlineEl.style.setProperty('--headline-scale', prevScale || '1')
      setScale(ratio > 1 ? Math.max(0.2, 1 / ratio) : 1)
    }

    measureAndFit()
    const observer = new ResizeObserver(measureAndFit)
    observer.observe(headlineEl)
    return () => observer.disconnect()
  }, [l1, l2])

  return { l1Ref, l2Ref, scale }
}

function ProductImage({ item }) {
  const [failed, setFailed] = useState(false)
  if (!item.imageUrl || failed) return <FallbackIcon />
  return (
    <img
      className="img-photo"
      src={item.imageUrl}
      alt={item.name}
      crossOrigin="anonymous"
      onError={() => setFailed(true)}
    />
  )
}

const FlyerCanvas = forwardRef(function FlyerCanvas({ theme, title, storeName, validityText, items }, ref) {
  const rows = buildRows(items, theme.maxCols, theme.maxProducts)
  const { l1, l2 } = splitHeadline(title)
  const isLogoHeader = theme.headerVariant === 'logo'
  const { l1Ref, l2Ref, scale: headlineScale } = useHeadlineFit(l1, l2)

  return (
    <div
      ref={ref}
      className="flyer"
      style={{
        '--bg': theme.colors.background,
        '--header-bg': theme.colors.headerBg,
        '--footer-bg': theme.colors.footerBg,
        '--tag': theme.colors.priceTag,
        '--img-size': theme.imageSize,
        fontFamily: theme.font,
      }}
    >
      <div className={`header-zone ${isLogoHeader ? 'header-zone-fixed' : ''}`}>
        <div className="header-bg" />
        <div className={`header-content ${isLogoHeader ? 'header-content-logo' : ''}`}>
          <div className="headline" style={{ '--headline-scale': headlineScale }}>
            <div className="l1" ref={l1Ref}>{l1}</div>
            <div className="l2" ref={l2Ref}>{l2}</div>
          </div>

          {isLogoHeader ? (
            <div className="brand brand-logo">
              <img className="mascot" src={theme.mascotUrl} alt="" crossOrigin="anonymous" />
              <div className="logo-stack">
                <img className="logo-img" src={theme.logoUrl} alt={theme.name} crossOrigin="anonymous" />
                <div className="validity">{validityText}</div>
              </div>
            </div>
          ) : (
            <div className="brand">
              <div className="store">{storeName}</div>
              <div className="badge">{theme.badgeText}</div>
              <div className="validity">{validityText}</div>
            </div>
          )}
        </div>
      </div>
      <div className="divider" />

      <main className="grid">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="row"
            style={{
              gridTemplateColumns: `repeat(${row.items.length}, 1fr)`,
              width: `${(row.items.length / row.maxCols) * 100}%`,
            }}
          >
            {row.items.map((item, itemIndex) => (
              <div className="product" key={item.id ?? itemIndex}>
                <div className="name">{item.name}</div>
                <ProductImage item={item} />
                <div className="price">
                  {priceFormatter.format(item.price)}
                  <span className="unit">{item.unit}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </main>

      <footer className="footer">{theme.footerText}</footer>
    </div>
  )
})

export default FlyerCanvas
