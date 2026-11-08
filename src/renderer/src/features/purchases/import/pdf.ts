import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// pdf.js, set up once. It reads and draws PDFs on this computer. The worker is a file inside the app.
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

export { pdfjs }
