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

export async function exportPDF(node, filename) {
  const canvas = await captureCanvas(node)
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight)
  pdf.save(`${filename}.pdf`)
}
