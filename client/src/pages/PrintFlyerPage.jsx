import { useEffect, useState } from 'react'
import { getFlyer } from '../api/flyers'
import { themes, defaultTheme } from '../themes'
import { formatValidityRange } from '../constants'
import FlyerCanvas from '../components/FlyerCanvas'

// Chrome-less render target for the server-side (Puppeteer) export pipeline -
// reached via App.jsx's ?print=<flyerId> branch, not part of the normal
// tab/screen flow. Reuses the exact same FlyerCanvas component and CSS the
// client's own html2canvas export already relies on, so there's no separate
// render path that could drift from what desktop already produces correctly.
//
// Readiness is signaled through document.body.dataset (not a React ref/
// callback) because Puppeteer observes this page from outside React
// entirely, via page.waitForFunction(() => document.body.dataset.printReady).
// Three preconditions gate it - the same ones utils/export.js already waits
// on for the client-side capture path, now the server's job to wait on
// instead: every <img> in the flyer finishing loading, the Nunito web font
// finishing its swap (font-display: swap means the page first paints with a
// fallback font whose metrics don't match the header's pixel-tuned CSS -
// see FlyerCanvas.css), and two animation frames after that so
// useHeadlineFit's ResizeObserver (which can re-fire once Nunito's metrics
// change the headline's natural width) has settled and React has committed
// the corrected --headline-scale.
function PrintFlyerPage({ flyerId }) {
  const [flyer, setFlyer] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getFlyer(flyerId)
      .then(setFlyer)
      .catch((err) => setError(err.message || 'Erro ao carregar encarte'))
  }, [flyerId])

  useEffect(() => {
    if (error) document.body.dataset.printError = error
  }, [error])

  useEffect(() => {
    if (!flyer) return
    let cancelled = false

    async function signalReady() {
      const node = document.querySelector('.flyer')
      if (!node) return
      const images = [...node.querySelectorAll('img')]
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true })
                img.addEventListener('error', resolve, { once: true })
              }),
        ),
      )
      if (document.fonts && document.fonts.ready) await document.fonts.ready
      await new Promise(requestAnimationFrame)
      await new Promise(requestAnimationFrame)
      if (!cancelled) document.body.dataset.printReady = 'true'
    }

    signalReady()
    return () => {
      cancelled = true
    }
  }, [flyer])

  if (error || !flyer) return null

  const theme = themes[flyer.themeId] || defaultTheme

  // No wrapper around FlyerCanvas - a plain `display: flex` div here (row
  // direction by default) put .flyer inside a flex context with the default
  // align-items: stretch, unlike PreviewExportPage's Tailwind
  // `flex flex-col items-center` (explicit align-items: center). That
  // default stretch measurably changed how the last row's price tags
  // resolved their position (965.3px vs the correct 881.2px from the bottom
  // of .grid, confirmed via a direct Puppeteer DOM measurement) - overlapping
  // the footer - even though .flyer's own outer height stayed correct. There
  // is no viewer for this page, so nothing needs centering; .flyer can just
  // render as a normal block-level child of <body>.
  return (
    <FlyerCanvas
      theme={theme}
      title={flyer.title}
      storeName={flyer.storeName}
      validityText={formatValidityRange(flyer.validFrom, flyer.validUntil)}
      items={flyer.items.map((item) => ({
        id: item.product._id,
        name: item.product.name,
        unit: item.product.unit,
        imageUrl: item.product.imageUrl,
        price: item.overridePrice ?? item.product.price,
      }))}
    />
  )
}

export default PrintFlyerPage
