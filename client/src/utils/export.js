import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

// The export button sits below the flyer preview (see PreviewExportPage) -
// on a phone screen, reaching it requires scrolling down past the flyer
// first, especially now that the flyer's height is intrinsic to its content
// and can run 700-1000px tall. html2canvas needs to know the page's current
// scroll offset to correctly locate the target node within the DOM snapshot
// it captures from; iOS Safari's visual-vs-layout-viewport behavior is a
// well-documented source of exactly this kind of mismatch, which shows up as
// the top of the capture (here, the header) being clipped. Passing the
// negated current scroll position - the pattern html2canvas's own docs use
// for "capture after the page has scrolled" - removes the ambiguity instead
// of relying on html2canvas's own (viewport-dependent) default. windowWidth/
// windowHeight are pinned to the full document size for the same reason: a
// clone iframe sized to just the visible viewport could clip content that's
// scrolled out of view at capture time.
function captureOptions(node) {
  return {
    scale: 3,
    useCORS: true,
    backgroundColor: null,
    width: node.offsetWidth,
    height: node.offsetHeight,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.scrollWidth,
    windowHeight: document.documentElement.scrollHeight,
  }
}

// Nunito loads via Google Fonts with font-display: swap (see index.html),
// so there's a real window - wider on a slower mobile connection - where the
// page is still painting with a fallback font. The header's title position
// (line-height, margin-top, the translateY correction) is tuned pixel-by-
// pixel against Nunito's own glyph metrics specifically (see the comments in
// FlyerCanvas.css); capturing before the swap completes would silently
// render with a different font's ascent/descent, breaking every one of
// those offsets and plausibly producing exactly the "clipped header, torn
// date line" symptom on a device slow enough to still be mid-swap.
async function waitForFonts() {
  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready
  }
}

async function waitForImages(node) {
  const images = [...node.querySelectorAll('img')]
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true })
        img.addEventListener('error', resolve, { once: true })
      })
    }),
  )
}

async function captureCanvas(node) {
  await waitForFonts()
  await waitForImages(node)
  return html2canvas(node, captureOptions(node))
}

export async function exportPNG(node, filename) {
  const canvas = await captureCanvas(node)
  const link = document.createElement('a')
  link.download = `${filename}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

// The flyer's height is intrinsic to its content (see FlyerCanvas.css), so
// there's no fixed page size to target anymore - a hardcoded A4 page here
// would just reintroduce the empty white band this was meant to fix, only
// in the PDF instead of on the flyer itself. The PDF page is instead sized
// to the flyer's own real rendered dimensions (node.offsetWidth/Height, the
// same box html2canvas captures), converted from CSS px to mm at the
// standard 96dpi so the page matches the on-screen flyer 1:1 with no
// extra padding.
const PX_TO_MM = 25.4 / 96

export async function exportPDF(node, filename) {
  const canvas = await captureCanvas(node)
  const imgData = canvas.toDataURL('image/png')
  const pageWidth = node.offsetWidth * PX_TO_MM
  const pageHeight = node.offsetHeight * PX_TO_MM
  const pdf = new jsPDF({
    orientation: pageHeight >= pageWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pageWidth, pageHeight],
  })
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
  pdf.save(`${filename}.pdf`)
}
