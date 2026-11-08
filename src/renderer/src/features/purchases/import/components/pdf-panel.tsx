import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Add, Minus } from 'reicon-react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useElementWidth } from '@/features/reports/hooks/use-element-width'
import { pdfjs } from '../pdf'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 4
const STEP = 1.25 // each + or - press (and each notch of the mouse wheel) changes the size by this much

const clamp = (value: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))

// The invoice PDF, page by page, to read next to the items. Zoom with the buttons, or Ctrl/Cmd + mouse wheel (or a
// trackpad pinch), and drag the page with the mouse to move around. The pages are drawn on canvases from the file's
// bytes (no web address is needed, which the app's security rules would block).
export function PdfPanel({ file }: { file: File }): React.JSX.Element {
  const [boxRef, boxWidth] = useElementWidth<HTMLDivElement>()
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [failed, setFailed] = useState(false)
  const [zoom, setZoom] = useState(1) // 1 = the page fits the panel's width
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const keepCentre = useRef<number | null>(null) // the zoom change still to be applied to the scroll position

  useEffect(() => {
    let cancelled = false
    let task: ReturnType<typeof pdfjs.getDocument> | null = null
    file
      .arrayBuffer()
      .then((bytes) => {
        task = pdfjs.getDocument({ data: new Uint8Array(bytes) })
        return task.promise
      })
      .then((pdf) => !cancelled && setDoc(pdf))
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
      void task?.destroy()
    }
  }, [file])

  // Zooming around the middle of what you are looking at, not the top-left corner.
  const zoomTo = useCallback((next: number) => {
    setZoom((current) => {
      const target = clamp(next)
      if (target !== current) keepCentre.current = target / current
      return target
    })
  }, [])

  useLayoutEffect(() => {
    const box = boxRef.current
    const ratio = keepCentre.current
    if (!box || ratio === null) return
    keepCentre.current = null
    box.scrollLeft = (box.scrollLeft + box.clientWidth / 2) * ratio - box.clientWidth / 2
    box.scrollTop = (box.scrollTop + box.clientHeight / 2) * ratio - box.clientHeight / 2
  }, [zoom, boxRef])

  // Ctrl/Cmd + wheel zooms (a trackpad pinch arrives the same way). It needs a non-passive listener to stop the page itself zooming.
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const onWheel = (event: WheelEvent): void => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      zoomTo(zoom * (event.deltaY < 0 ? STEP : 1 / STEP))
    }
    box.addEventListener('wheel', onWheel, { passive: false })
    return () => box.removeEventListener('wheel', onWheel)
  }, [boxRef, zoom, zoomTo])

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    const box = boxRef.current
    if (!box || event.button !== 0) return
    drag.current = { x: event.clientX, y: event.clientY, left: box.scrollLeft, top: box.scrollTop }
    box.setPointerCapture(event.pointerId)
    setDragging(true)
  }
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const box = boxRef.current
    if (!box || !drag.current) return
    box.scrollLeft = drag.current.left - (event.clientX - drag.current.x)
    box.scrollTop = drag.current.top - (event.clientY - drag.current.y)
  }
  const endDrag = (): void => {
    drag.current = null
    setDragging(false)
  }

  const pageWidth = boxWidth * zoom

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-center gap-1 border-b border-border p-2">
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Zoom out"
          disabled={zoom <= MIN_ZOOM}
          onClick={() => zoomTo(zoom / STEP)}
        >
          <Minus />
        </Button>
        <span className="w-12 text-center text-xs text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="outline"
          size="icon-xs"
          aria-label="Zoom in"
          disabled={zoom >= MAX_ZOOM}
          onClick={() => zoomTo(zoom * STEP)}
        >
          <Add />
        </Button>
        <Button variant="outline" size="xs" disabled={zoom === 1} onClick={() => zoomTo(1)}>
          Fit
        </Button>
      </div>

      <div
        ref={boxRef}
        className={`flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-2 select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {failed ? (
          <p className="p-4 text-sm text-muted-foreground">This PDF could not be shown.</p>
        ) : doc && boxWidth > 0 ? (
          Array.from({ length: doc.numPages }, (_, index) => (
            <PdfPage key={index} doc={doc} number={index + 1} width={pageWidth} />
          ))
        ) : (
          <Skeleton className="h-96 w-full" />
        )}
      </div>
    </div>
  )
}

function PdfPage({
  doc,
  number,
  width
}: {
  doc: PDFDocumentProxy
  number: number
  width: number
}): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let cancelled = false
    let task: { cancel: () => void } | null = null
    void doc.getPage(number).then((page) => {
      const canvas = canvasRef.current
      if (cancelled || !canvas) return
      const fit = width / page.getViewport({ scale: 1 }).width
      // Draw at the screen's real resolution so small print stays sharp, but never more than about 3200 pixels wide.
      const sharp = Math.min(window.devicePixelRatio || 1, 3200 / width)
      const viewport = page.getViewport({ scale: fit * sharp })
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.width = `${width}px`
      canvas.style.height = `${viewport.height / sharp}px`
      const render = page.render({ canvas, viewport })
      task = render
      render.promise.catch(() => undefined) // cancelled while zooming: nothing to do
    })
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, number, width])

  return (
    <canvas
      ref={canvasRef}
      className="max-w-none shrink-0 rounded-md border border-border bg-background"
      aria-label={`Invoice page ${number}`}
    />
  )
}
