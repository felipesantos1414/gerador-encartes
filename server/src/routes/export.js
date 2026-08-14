import { Router } from 'express';
import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import Flyer from '../models/Flyer.js';

const router = Router();

// PDF points, not mm - pdf-lib's page sizes are in points (72/inch), unlike
// jsPDF on the client side which works in mm. 96px = 1 CSS inch = 72pt.
const PX_TO_PT = 72 / 96;
const DEVICE_SCALE_FACTOR = 3; // matches the client's html2canvas scale: 3
const VIEWPORT_WIDTH = 900; // comfortably above the flyer's own ~720px cap
const VIEWPORT_HEIGHT = 1400; // just an initial value - elementHandle.screenshot()
// captures the element's full height regardless of viewport, Puppeteer
// scrolls/composites past it automatically for taller flyers.
const READY_TIMEOUT_MS = 20000;

function clientUrl() {
  return process.env.CLIENT_URL || 'http://localhost:5173';
}

// Drives a real, fixed-size headless Chromium instance to the client app's
// own ?print=<id> route (see client/src/App.jsx, client/src/pages/
// PrintFlyerPage.jsx) and screenshots the .flyer element there - reusing the
// exact same React component/CSS the (working, correct) desktop html2canvas
// export already relies on, rather than re-implementing the flyer's markup
// server-side. This is what actually fixes the iOS Safari clipping bug:
// Chromium's viewport here is entirely under our control (900px wide, so the
// flyer's own width: min(720px, 94vw) always clamps to 720px), not the
// visiting device's - Safari's mobile viewport/scroll quirks never enter the
// picture at all.
//
// One browser launched and closed per request rather than a shared/pooled
// instance - slower, but far simpler and safer against a leaked/crashed
// browser process taking the whole server down with it. Revisit only if
// export volume actually makes the per-request launch cost matter.
async function renderFlyerScreenshot(flyerId) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
    });

    const printUrl = `${clientUrl()}/?print=${flyerId}`;
    await page.goto(printUrl, { waitUntil: 'domcontentloaded', timeout: READY_TIMEOUT_MS });

    // PrintFlyerPage sets document.body.dataset.printReady once the flyer
    // has loaded, every <img> in it has finished loading, and the Nunito
    // web font has swapped in - see that file for why each of those matters.
    // printError covers a bad/missing flyer id so this doesn't just hang
    // until the timeout in that case.
    await page.waitForFunction(
      () => document.body.dataset.printReady === 'true' || Boolean(document.body.dataset.printError),
      { timeout: READY_TIMEOUT_MS },
    );

    const printError = await page.evaluate(() => document.body.dataset.printError || null);
    if (printError) {
      throw new Error(printError);
    }

    const flyerHandle = await page.$('.flyer');
    if (!flyerHandle) {
      throw new Error('Flyer element not found on the render page');
    }

    // boundingBox() is in CSS px (unaffected by deviceScaleFactor) - the
    // same unit client/src/utils/export.js uses via node.offsetWidth/Height
    // for the PDF page size, so the two paths produce identically-sized
    // pages for the same flyer. The screenshot itself is still captured at
    // the page's 3x deviceScaleFactor for print-quality resolution.
    const boundingBox = await flyerHandle.boundingBox();
    const pngBuffer = await flyerHandle.screenshot({ type: 'png' });

    return { pngBuffer, widthPx: boundingBox.width, heightPx: boundingBox.height };
  } finally {
    await browser.close();
  }
}

router.get('/:id/export', async (req, res) => {
  const { type } = req.query;
  if (type !== 'pdf' && type !== 'png') {
    return res.status(400).json({ error: 'type must be "pdf" or "png"' });
  }

  try {
    const flyer = await Flyer.findById(req.params.id);
    if (!flyer) return res.status(404).json({ error: 'Flyer not found' });

    const { pngBuffer, widthPx, heightPx } = await renderFlyerScreenshot(req.params.id);

    if (type === 'png') {
      res.set('Content-Type', 'image/png');
      res.set('Content-Disposition', 'attachment; filename="encarte.png"');
      return res.send(pngBuffer);
    }

    // PDF page sized to the flyer's own real rendered dimensions, not a
    // fixed A4 page - mirrors client/src/utils/export.js's local fallback:
    // the flyer's height is intrinsic to its content, so a hardcoded page
    // size would reintroduce empty padding around it in the PDF.
    const pdfDoc = await PDFDocument.create();
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    const page = pdfDoc.addPage([widthPx * PX_TO_PT, heightPx * PX_TO_PT]);
    page.drawImage(pngImage, { x: 0, y: 0, width: page.getWidth(), height: page.getHeight() });
    const pdfBytes = await pdfDoc.save();

    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'attachment; filename="encarte.pdf"');
    return res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Server-side export failed:', err);
    res.status(500).json({ error: err.message || 'Export failed' });
  }
});

export default router;
