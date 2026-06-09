import { NextRequest, NextResponse } from "next/server"
import { monitorStore, TrackEvent } from "@/lib/monitor-store"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as TrackEvent
    if (!body.sessionId || !body.type) {
      return NextResponse.json({ error: "invalid" }, { status: 400 })
    }
    monitorStore.addEvent({ ...body, ts: body.ts ?? Date.now() })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
}

/* Allow CORS from same origin */
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
