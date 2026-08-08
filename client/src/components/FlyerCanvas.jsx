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
    const size = isFirstRow ? grid.row1 : grid.rowRest
    rows.push(capped.slice(i, i + size))
    i += size
    isFirstRow = false
  }
  return rows
}

function FlyerCanvas({ theme, storeName, validityText, items }) {
  const rows = buildRows(items, theme.grid, theme.maxProducts)

  return (
    <div
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
            style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}
          >
            {row.map((item, itemIndex) => (
              <div className="product" key={item.id ?? itemIndex}>
                <div className="name">{item.name}</div>
                {item.imageUrl ? (
                  <img className="img-photo" src={item.imageUrl} alt={item.name} />
                ) : (
                  <div className="img">🛒</div>
                )}
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
}

export default FlyerCanvas
