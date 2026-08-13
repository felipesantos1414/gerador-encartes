import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

async function captureCanvas(node) {
  return html2canvas(node, { scale: 3, useCORS: true, backgroundColor: null })
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
