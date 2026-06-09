import { NextRequest, NextResponse } from "next/server"
import { monitorStore } from "@/lib/monitor-store"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pwd = searchParams.get("password") ?? searchParams.get("pwd")
  const mode = searchParams.get("mode") ?? "sse"

  if (pwd !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  /* Snapshot mode — one-shot JSON for initial load */
  if (mode === "snapshot") {
    return NextResponse.json(monitorStore.getSnapshot())
  }

  /* SSE streaming mode */
  const encoder = new TextEncoder()
  let unsub: (() => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      /* Send initial snapshot as first event */
      const snap = monitorStore.getSnapshot()
      controller.enqueue(encoder.encode(`event: snapshot\ndata: ${JSON.stringify(snap)}\n\n`))

      unsub = monitorStore.subscribe((event) => {
        try {
          /* After each event, also send updated snapshot */
          const snap = monitorStore.getSnapshot()
          controller.enqueue(encoder.encode(`event: update\ndata: ${JSON.stringify({ event, snapshot: snap })}\n\n`))
        } catch {
          /* Client disconnected */
        }
      })

      /* Heartbeat every 15s to keep connection alive */
      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`))
        } catch {
          clearInterval(interval)
        }
      }, 15_000)
    },
    cancel() {
      unsub?.()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
