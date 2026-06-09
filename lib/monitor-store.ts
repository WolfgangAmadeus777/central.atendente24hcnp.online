/**
 * In-memory store for real-time funnel monitoring.
 * Data lives in the Node.js process — no database required.
 * On Vercel with multiple instances, data is per-instance (displayed with a warning).
 */

export type EventType =
  | "enter"
  | "block"
  | "option_click"
  | "button_click"
  | "text_input"
  | "checkout_click"
  | "exit"
  | "complete"

export interface TrackEvent {
  sessionId: string
  type: EventType
  /** Human-readable label, e.g. block name or button text */
  label: string
  /** UTC timestamp */
  ts: number
  /** Optional value (e.g. text the user typed) */
  value?: string
}

export interface Session {
  id: string
  nome: string
  startedAt: number
  lastActiveAt: number
  currentBlock: number
  totalBlocks: number
  exited: boolean
  completed: boolean
  events: TrackEvent[]
}

/* ── Singleton store ── */
declare global {
  // eslint-disable-next-line no-var
  var __monitorStore: MonitorStore | undefined
}

const FUNNEL_STEPS: Record<number, string> = {
  1:  "Entrada",
  2:  "Nome",
  3:  "Apresentacao",
  4:  "Ganhos estimados",
  5:  "VSL Tutorial",
  6:  "Avaliacao 1 - Airfryer",
  7:  "Pergunta 2/3 Airfryer",
  8:  "Pergunta 3/3 Airfryer",
  9:  "Resultado Airfryer",
  10: "Avaliacao 2 - Ar Cond.",
  11: "Pergunta 2/3 Ar Cond.",
  12: "Pergunta 3/3 Ar Cond.",
  13: "Resultado + iPhone",
  14: "Pergunta 2/3 iPhone",
  15: "Pergunta 3/3 iPhone",
  16: "Me conta - input livre",
  17: "Coleta de PIX",
  18: "Confirmacao PIX",
  19: "Anti-Fraude VSL",
  20: "CTA Cadastro",
}

export const TOTAL_STEPS = Object.keys(FUNNEL_STEPS).length

class MonitorStore {
  private sessions = new Map<string, Session>()
  private subscribers = new Set<(event: TrackEvent) => void>()
  private maxEvents = 200

  addEvent(event: TrackEvent) {
    let session = this.sessions.get(event.sessionId)
    if (!session) {
      session = {
        id: event.sessionId,
        nome: "",
        startedAt: event.ts,
        lastActiveAt: event.ts,
        currentBlock: 1,
        totalBlocks: TOTAL_STEPS,
        exited: false,
        completed: false,
        events: [],
      }
      this.sessions.set(event.sessionId, session)
    }

    session.lastActiveAt = event.ts
    session.events.push(event)
    /* Keep events bounded per session */
    if (session.events.length > this.maxEvents) {
      session.events = session.events.slice(-this.maxEvents)
    }

    /* Update derived state */
    if (event.type === "block") {
      const n = parseInt(event.label)
      if (!isNaN(n)) session.currentBlock = n
    }
    if (event.type === "text_input" && !session.nome && event.label === "nome") {
      session.nome = event.value ?? ""
    }
    if (event.type === "exit") session.exited = true
    if (event.type === "complete") session.completed = true
    if (event.type === "checkout_click") session.completed = true

    /* Notify all SSE subscribers */
    this.subscribers.forEach(cb => cb(event))
  }

  subscribe(cb: (e: TrackEvent) => void) {
    this.subscribers.add(cb)
    return () => this.subscribers.delete(cb)
  }

  getSnapshot() {
    const sessions = Array.from(this.sessions.values())
    const now = Date.now()
    const active = sessions.filter(s => now - s.lastActiveAt < 5 * 60 * 1000 && !s.exited)

    /* Drop sessions older than 2 hours to avoid unbounded growth */
    for (const [id, s] of this.sessions) {
      if (now - s.startedAt > 2 * 60 * 60 * 1000) this.sessions.delete(id)
    }

    const total = sessions.length
    const completed = sessions.filter(s => s.completed).length
    const exited = sessions.filter(s => s.exited).length

    /* Per-step reach counts */
    const stepReach: Record<number, number> = {}
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      stepReach[i] = sessions.filter(s => s.currentBlock >= i).length
    }

    return {
      totalSessions: total,
      activeSessions: active.length,
      completed,
      exited,
      conversionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      stepReach,
      stepNames: FUNNEL_STEPS,
      sessions: sessions
        .sort((a, b) => b.lastActiveAt - a.lastActiveAt)
        .slice(0, 50)
        .map(s => ({
          id: s.id,
          nome: s.nome,
          startedAt: s.startedAt,
          lastActiveAt: s.lastActiveAt,
          currentBlock: s.currentBlock,
          stepName: FUNNEL_STEPS[s.currentBlock] ?? `Bloco ${s.currentBlock}`,
          progress: Math.round((s.currentBlock / TOTAL_STEPS) * 100),
          exited: s.exited,
          completed: s.completed,
          eventCount: s.events.length,
          lastEvents: s.events.slice(-5),
          allEvents: s.events,
        })),
    }
  }
}

/* Singleton pattern — survives hot reload in dev */
if (!global.__monitorStore) {
  global.__monitorStore = new MonitorStore()
}

export const monitorStore = global.__monitorStore
