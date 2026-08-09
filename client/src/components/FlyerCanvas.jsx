import { forwardRef } from 'react'
import './FlyerCanvas.css'

const priceFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function buildRows(items, grid, maxProducts) {
  const capped = items.slice(0, maxProducts)
  const rows = []
  let i = 0
  let isFirstRow = true
  while (i < capped.length) {
    const columns = isFirstRow ? grid.row1 : grid.rowRest
    rows.push({ items: capped.slice(i, i + columns), columns })
    i += columns
    isFirstRow = false
  }
  return rows
}

const FlyerCanvas = forwardRef(function FlyerCanvas({ theme, storeName, validityText, items }, ref) {
  const rows = buildRows(items, theme.grid, theme.maxProducts)

  return (
    <div
      ref={ref}
      className="flyer"
      style={{
        '--bg': theme.colors.background,
        '--header-bg': theme.colors.headerBg,
        '--footer-bg': theme.colors.footerBg,
        '--tag': theme.colors.priceTag,
        fontFamily: theme.font,
      }}
    >
      <header className="header">
        <div className="headline">
          <div className="l1">{theme.headline.l1}</div>
          <div className="l2">{theme.headline.l2}</div>
        </div>
        <div className="brand">
          <div className="store">{storeName}</div>
          <div className="badge">{theme.badgeText}</div>
          <div className="validity">{validityText}</div>
        </div>
      </header>
      <div className="divider" />

      <main className="grid">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="row"
            style={{
              gridTemplateColumns: `repeat(${row.items.length}, 1fr)`,
              width: `${(row.items.length / row.columns) * 100}%`,
            }}
          >
            {row.items.map((item, itemIndex) => (
              <div className="product" key={item.id ?? itemIndex}>
                <div className="name">{item.name}</div>
                <div className="img-wrap">
                  <div className="price">
                    {priceFormatter.format(item.price)}
                    <span className="unit">{item.unit}</span>
                  </div>
                  {item.imageUrl ? (
                    <img className="img-photo" src={item.imageUrl} alt={item.name} crossOrigin="anonymous" />
                  ) : (
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
                  )}
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
