"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  Users, TrendingUp, LogOut, CheckCircle2, Activity,
  RefreshCw, Lock, ChevronDown, ChevronUp, ArrowRight,
  MousePointerClick, MessageSquare, CreditCard, XCircle,
  Clock, Wifi, WifiOff, User, BarChart3, List, Eye
} from "lucide-react"

/* ── Types ── */
interface TrackEvent {
  sessionId: string
  type: string
  label: string
  ts: number
  value?: string
}

interface SessionRow {
  id: string
  nome: string
  startedAt: number
  lastActiveAt: number
  currentBlock: number
  stepName: string
  progress: number
  exited: boolean
  completed: boolean
  eventCount: number
  lastEvents: TrackEvent[]
  allEvents: TrackEvent[]
}

interface Snapshot {
  totalSessions: number
  activeSessions: number
  completed: number
  exited: number
  conversionRate: number
  stepReach: Record<number, number>
  stepNames: Record<number, string>
  sessions: SessionRow[]
}

/* ── Helpers ── */
function relTime(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60_000) return `${Math.round(diff / 1000)}s atrás`
  if (diff < 3_600_000) return `${Math.round(diff / 60_000)}m atrás`
  return `${Math.round(diff / 3_600_000)}h atrás`
}

function fmtTime(ts: number) {
  return new Date(ts).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
}

function eventLabel(e: TrackEvent) {
  const map: Record<string, string> = {
    enter:          "Entrou no funil",
    block:          `Avancou para etapa ${e.label}`,
    option_click:   `Clicou: "${e.label}"`,
    button_click:   `Botao: "${e.label}"`,
    text_input:     e.label === "nome" ? `Nome: ${e.value}` : e.label === "pix" ? `PIX: ${e.value}` : `Digitou: "${e.value}"`,
    checkout_click: "Clicou em Cadastro / Checkout",
    exit:           "Saiu da pagina",
    complete:       "Completou o funil",
  }
  return map[e.type] ?? `${e.type}: ${e.label}`
}

function eventIcon(type: string) {
  const map: Record<string, React.ReactNode> = {
    enter:          <ArrowRight size={12} className="text-green-500" />,
    block:          <ChevronDown size={12} className="text-blue-500" />,
    option_click:   <MousePointerClick size={12} className="text-amber-500" />,
    button_click:   <MousePointerClick size={12} className="text-orange-500" />,
    text_input:     <MessageSquare size={12} className="text-violet-500" />,
    checkout_click: <CreditCard size={12} className="text-emerald-600" />,
    exit:           <XCircle size={12} className="text-red-500" />,
    complete:       <CheckCircle2 size={12} className="text-emerald-600" />,
  }
  return map[type] ?? <Activity size={12} className="text-gray-400" />
}

function eventBadgeClass(type: string) {
  const map: Record<string, string> = {
    enter:          "bg-green-50 text-green-700 border-green-200",
    block:          "bg-blue-50 text-blue-700 border-blue-200",
    option_click:   "bg-amber-50 text-amber-700 border-amber-200",
    button_click:   "bg-orange-50 text-orange-700 border-orange-200",
    text_input:     "bg-violet-50 text-violet-700 border-violet-200",
    checkout_click: "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
    exit:           "bg-red-50 text-red-700 border-red-200",
    complete:       "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold",
  }
  return map[type] ?? "bg-gray-50 text-gray-600 border-gray-200"
}

/* ── Login ── */
function LoginScreen({ onLogin }: { onLogin: (pwd: string) => void }) {
  const [pwd, setPwd] = useState("")
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onLogin(pwd)
    setError(true)
    setTimeout(() => setError(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center mb-4 shadow-lg shadow-green-200">
            <Lock size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Painel de Monitoramento</h1>
          <p className="text-sm text-slate-500 mt-1">Cash No Pix — Admin</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            type="password"
            value={pwd}
            onChange={e => setPwd(e.target.value)}
            placeholder="Senha de acesso"
            className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors ${error ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-green-400"}`}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

/* ── Session detail modal ── */
function SessionDetail({ session, onClose }: { session: SessionRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold ${session.completed ? "bg-emerald-500" : session.exited ? "bg-red-400" : "bg-blue-500"}`}>
              {session.nome ? session.nome[0].toUpperCase() : "?"}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{session.nome || "Anonimo"}</p>
              <p className="text-xs text-slate-500">ID: {session.id.slice(-8)} · entrou {relTime(session.startedAt)}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <XCircle size={20} />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{session.progress}%</p>
            <p className="text-xs text-slate-500">Progresso</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{session.eventCount}</p>
            <p className="text-xs text-slate-500">Eventos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-800">{session.currentBlock}</p>
            <p className="text-xs text-slate-500 truncate">Etapa atual</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-600">{session.stepName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${session.completed ? "bg-emerald-50 text-emerald-600 border-emerald-200" : session.exited ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
              {session.completed ? "Converteu" : session.exited ? "Saiu" : "Ativo"}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${session.completed ? "bg-emerald-500" : session.exited ? "bg-red-400" : "bg-blue-500"}`}
              style={{ width: `${session.progress}%` }}
            />
          </div>
        </div>

        {/* All events */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Linha do tempo completa</p>
          <div className="flex flex-col gap-2">
            {session.allEvents.map((ev, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">{eventIcon(ev.type)}</div>
                <div className="flex-1 min-w-0">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${eventBadgeClass(ev.type)}`}>
                    {eventLabel(ev)}
                  </span>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{fmtTime(ev.ts)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Funnel bar ── */
function FunnelStep({ name, count, max, step }: { name: string; count: number; max: number; step: number }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  const dropPct = step === 1 ? 0 : Math.round(100 - pct)

  return (
    <div className="flex items-center gap-3 py-2 group">
      <span className="text-xs text-slate-400 w-4 flex-shrink-0 text-right">{step}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-700 truncate">{name}</span>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {dropPct > 0 && (
              <span className="text-xs text-red-500">-{dropPct}%</span>
            )}
            <span className="text-xs font-semibold text-slate-800">{count}</span>
          </div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: `hsl(${140 - (step / 20) * 100}, ${70 - step}%, ${45 + step}%)`,
            }}
          />
        </div>
      </div>
    </div>
  )
}

/* ── Session row ── */
function SessionRowItem({ session, onSelect }: { session: SessionRow; onSelect: () => void }) {
  const isActive = Date.now() - session.lastActiveAt < 3 * 60 * 1000 && !session.exited
  const lastEvent = session.lastEvents[session.lastEvents.length - 1]

  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 last:border-0"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold ${session.completed ? "bg-emerald-500" : session.exited ? "bg-red-400" : "bg-blue-500"}`}>
          {session.nome ? session.nome[0].toUpperCase() : "?"}
        </div>
        {isActive && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate">{session.nome || "Anonimo"}</p>
          <span className={`text-xs px-1.5 py-0.5 rounded-full border flex-shrink-0 ${session.completed ? "bg-emerald-50 text-emerald-600 border-emerald-200" : session.exited ? "bg-red-50 text-red-600 border-red-200" : "bg-blue-50 text-blue-600 border-blue-200"}`}>
            {session.completed ? "Converteu" : session.exited ? "Saiu" : "Ativo"}
          </span>
        </div>
        <p className="text-xs text-slate-500 truncate">
          {session.stepName} · {lastEvent ? eventLabel(lastEvent) : "—"}
        </p>
      </div>

      {/* Meta */}
      <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
        <div className="flex items-center gap-1">
          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${session.completed ? "bg-emerald-500" : session.exited ? "bg-red-400" : "bg-blue-500"}`}
              style={{ width: `${session.progress}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-8 text-right">{session.progress}%</span>
        </div>
        <p className="text-xs text-slate-400">{relTime(session.lastActiveAt)}</p>
      </div>

      <Eye size={14} className="text-slate-300 flex-shrink-0" />
    </div>
  )
}

/* ── Main Dashboard ── */
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [snap, setSnap] = useState<Snapshot | null>(null)
  const [loading, setLoading] = useState(false)
  const [sseOk, setSseOk] = useState(false)
  const [liveEvents, setLiveEvents] = useState<TrackEvent[]>([])
  const [tab, setTab] = useState<"overview" | "sessions" | "funnel" | "live">("overview")
  const [selectedSession, setSelectedSession] = useState<SessionRow | null>(null)
  const [sessionFilter, setSessionFilter] = useState<"all" | "active" | "converted" | "exited">("all")
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set())
  const liveRef = useRef<HTMLDivElement>(null)

  const fetchSnap = useCallback(async () => {
    if (!password) return
    setLoading(true)
    try {
      const res = await fetch(`/api/monitor?password=${encodeURIComponent(password)}&mode=snapshot`)
      if (!res.ok) return
      const data = await res.json()
      setSnap(data)
    } finally {
      setLoading(false)
    }
  }, [password])

  /* SSE live stream */
  useEffect(() => {
    if (!authed || !password) return
    fetchSnap()
    const interval = setInterval(fetchSnap, 15_000)

    const es = new EventSource(`/api/monitor?password=${encodeURIComponent(password)}&mode=stream`)
    es.onopen = () => setSseOk(true)
    es.onerror = () => setSseOk(false)
    es.addEventListener("update", (e) => {
      try {
        const payload = JSON.parse((e as MessageEvent).data)
        const ev: TrackEvent = payload.event
        if (ev) setLiveEvents(p => [ev, ...p].slice(0, 100))
        if (payload.snapshot) setSnap(payload.snapshot)
      } catch {/* ignore */}
    })

    return () => { es.close(); clearInterval(interval) }
  }, [authed, password, fetchSnap])

  /* Auto-scroll live feed */
  useEffect(() => {
    liveRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }, [liveEvents])

  function handleLogin(pwd: string) {
    fetch(`/api/monitor?password=${encodeURIComponent(pwd)}&mode=snapshot`)
      .then(r => {
        if (r.ok) { setPassword(pwd); setAuthed(true) }
      })
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />

  const activeSessions = snap?.sessions.filter(s => Date.now() - s.lastActiveAt < 3 * 60 * 1000 && !s.exited) ?? []
  const filteredSessions = (snap?.sessions ?? []).filter(s => {
    if (sessionFilter === "active") return Date.now() - s.lastActiveAt < 3 * 60_000 && !s.exited
    if (sessionFilter === "converted") return s.completed
    if (sessionFilter === "exited") return s.exited
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <BarChart3 size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">Cash No Pix — Monitor</span>
            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${sseOk ? "bg-green-50 text-green-600 border-green-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
              {sseOk ? <Wifi size={10} /> : <WifiOff size={10} />}
              {sseOk ? "Ao vivo" : "Conectando..."}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchSnap} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Atualizar">
              <RefreshCw size={14} className={`text-slate-500 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={() => { setAuthed(false); setPassword("") }} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              <LogOut size={13} /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-0">
            {([
              { key: "overview", label: "Visao Geral", icon: <BarChart3 size={13} /> },
              { key: "sessions", label: "Clientes", icon: <Users size={13} /> },
              { key: "funnel",   label: "Funil",     icon: <TrendingUp size={13} /> },
              { key: "live",     label: "Ao Vivo",   icon: <Activity size={13} /> },
            ] as const).map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors ${tab === t.key ? "border-green-500 text-green-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              >
                {t.icon} {t.label}
                {t.key === "live" && liveEvents.length > 0 && (
                  <span className="ml-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">{liveEvents.length > 99 ? "99" : liveEvents.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total de entradas", value: snap?.totalSessions ?? 0, icon: <Users size={18} className="text-blue-500" />, bg: "bg-blue-50", border: "border-blue-100" },
                { label: "Ativos agora", value: activeSessions.length, icon: <Wifi size={18} className="text-green-500" />, bg: "bg-green-50", border: "border-green-100" },
                { label: "Conversoes", value: snap?.completed ?? 0, icon: <CheckCircle2 size={18} className="text-emerald-500" />, bg: "bg-emerald-50", border: "border-emerald-100" },
                { label: "Taxa de conversao", value: `${snap?.conversionRate ?? 0}%`, icon: <TrendingUp size={18} className="text-violet-500" />, bg: "bg-violet-50", border: "border-violet-100" },
              ].map(c => (
                <div key={c.label} className={`bg-white rounded-2xl border ${c.border} p-5 flex items-center gap-4`}>
                  <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{c.value}</p>
                    <p className="text-xs text-slate-500">{c.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ativos em tempo real */}
            <div className="bg-white rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800 text-sm">Clientes ativos agora ({activeSessions.length})</h2>
                <span className="flex items-center gap-1 text-xs text-green-600"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Tempo real</span>
              </div>
              {activeSessions.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">Nenhum cliente ativo no momento</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {activeSessions.map(s => (
                    <SessionRowItem key={s.id} session={s} onSelect={() => setSelectedSession(s)} />
                  ))}
                </div>
              )}
            </div>

            {/* Mini funil */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800 text-sm">Funil resumido</h2>
                <button onClick={() => setTab("funnel")} className="text-xs text-green-600 hover:underline">Ver completo</button>
              </div>
              {snap && Object.entries(snap.stepNames).slice(0, 10).map(([step, name]) => (
                <FunnelStep
                  key={step}
                  step={Number(step)}
                  name={name}
                  count={snap.stepReach[Number(step)] ?? 0}
                  max={snap.totalSessions}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SESSIONS ── */}
        {tab === "sessions" && (
          <div className="space-y-4">
            {/* Filter pills */}
            <div className="flex gap-2 flex-wrap">
              {([
                { key: "all", label: `Todos (${snap?.totalSessions ?? 0})` },
                { key: "active", label: `Ativos (${activeSessions.length})` },
                { key: "converted", label: `Convertidos (${snap?.completed ?? 0})` },
                { key: "exited", label: `Saidas (${snap?.exited ?? 0})` },
              ] as const).map(f => (
                <button
                  key={f.key}
                  onClick={() => setSessionFilter(f.key)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${sessionFilter === f.key ? "bg-green-500 text-white border-green-500" : "bg-white text-slate-600 border-slate-200 hover:border-green-300"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {filteredSessions.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">Nenhum cliente nesta categoria</div>
              ) : (
                <div>
                  {filteredSessions.map(s => (
                    <SessionRowItem key={s.id} session={s} onSelect={() => setSelectedSession(s)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FUNNEL ── */}
        {tab === "funnel" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-slate-800 text-sm">Funil completo — todas as etapas</h2>
                <span className="text-xs text-slate-500">{snap?.totalSessions ?? 0} entradas totais</span>
              </div>
              <p className="text-xs text-slate-400 mb-5">A barra mostra a % de usuarios que chegaram em cada etapa. O numero em vermelho indica a queda em relacao a entrada.</p>
              <div className="space-y-1">
                {snap && Object.entries(snap.stepNames).map(([step, name]) => (
                  <FunnelStep
                    key={step}
                    step={Number(step)}
                    name={name}
                    count={snap.stepReach[Number(step)] ?? 0}
                    max={snap.totalSessions}
                  />
                ))}
              </div>
            </div>

            {/* Maiores quedas */}
            {snap && snap.totalSessions > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h2 className="font-semibold text-slate-800 text-sm mb-4">Maiores pontos de queda</h2>
                {Object.entries(snap.stepNames)
                  .map(([step, name]) => {
                    const n = Number(step)
                    const curr = snap.stepReach[n] ?? 0
                    const prev = snap.stepReach[n - 1] ?? snap.totalSessions
                    const drop = prev > 0 ? Math.round(((prev - curr) / prev) * 100) : 0
                    return { step: n, name, drop, lost: prev - curr }
                  })
                  .filter(x => x.drop > 0)
                  .sort((a, b) => b.drop - a.drop)
                  .slice(0, 5)
                  .map(x => (
                    <div key={x.step} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                      <span className="w-6 h-6 rounded-lg bg-red-50 text-red-600 text-xs font-bold flex items-center justify-center flex-shrink-0">{x.step}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 truncate">{x.name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-red-500">-{x.drop}%</p>
                        <p className="text-xs text-slate-400">{x.lost} usuario{x.lost !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ── LIVE ── */}
        {tab === "live" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 text-sm">Feed de eventos em tempo real</h2>
              <button onClick={() => setLiveEvents([])} className="text-xs text-slate-500 hover:text-red-500 transition-colors">Limpar</button>
            </div>
            <div ref={liveRef} className="bg-white rounded-2xl border border-slate-200 overflow-hidden max-h-[70vh] overflow-y-auto">
              {liveEvents.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm">
                  <Activity size={32} className="mx-auto mb-2 text-slate-300" />
                  Aguardando eventos...
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {liveEvents.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                      <div className="flex-shrink-0">{eventIcon(ev.type)}</div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${eventBadgeClass(ev.type)}`}>
                          {eventLabel(ev)}
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">ID: {ev.sessionId.slice(-8)}</p>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{fmtTime(ev.ts)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Session detail modal */}
      {selectedSession && (
        <SessionDetail session={selectedSession} onClose={() => setSelectedSession(null)} />
      )}
    </div>
  )
}
