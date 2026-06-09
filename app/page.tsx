"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const COMPANY = {
  name: "Agrelli Corretora de Seguros LTDA",
  cnpj: "48.255.060/0001-81",
  address: "Avenida Presidente Juscelino Kubitschek de Oliveira 5000 Conj 512/435 Torre 01, Iguatemi, São José do Rio Preto SP, CEP 15093-340",
  email: "atendimento@agrelliseguros.com.br",
  phone: "(17) 98111-5558",
}

export default function PresellPage() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [cookieBanner, setCookieBanner] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("_cookie_accepted")) setCookieBanner(true)
  }, [])

  function handleContinue() {
    if (!checked) return
    router.push("/chat")
  }

  function acceptCookies() {
    localStorage.setItem("_cookie_accepted", "1")
    setCookieBanner(false)
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#f5f5f5",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', sans-serif",
    }}>
      <main style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px 32px",
      }}>
        <div style={{
          width: "100%",
          maxWidth: 380,
          background: "#ffffff",
          borderRadius: 16,
          padding: "40px 28px 36px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          textAlign: "center",
        }}>
          {/* Ícone escudo */}
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "#f0faf4",
            border: "1.5px solid #c8f0d8",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5l-8-3z"
                fill="#d1f5e0" stroke="#25D366" strokeWidth="1.5" />
              <path d="M9 12l2 2 4-4" stroke="#25D366" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p style={{ fontSize: 11, letterSpacing: 2, color: "#25D366", fontWeight: 700,
            textTransform: "uppercase", margin: "0 0 10px" }}>
            Verificação de Segurança
          </p>

          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827",
            margin: "0 0 8px", lineHeight: 1.35 }}>
            Confirme que você é humano
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.6 }}>
            Marque a caixa abaixo para acessar sua área exclusiva.
          </p>

          {/* Checkbox */}
          <label
            onClick={() => setChecked(c => !c)}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: checked ? "#f0faf4" : "#fafafa",
              border: `1.5px solid ${checked ? "#25D366" : "#e5e7eb"}`,
              borderRadius: 10, padding: "14px 16px",
              cursor: "pointer", marginBottom: 20,
              transition: "all 0.2s", userSelect: "none",
            }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
              border: `2px solid ${checked ? "#25D366" : "#d1d5db"}`,
              background: checked ? "#25D366" : "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.18s",
            }}>
              {checked && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
              Não sou um robô
            </span>
          </label>

          <button
            onClick={handleContinue}
            disabled={!checked}
            style={{
              width: "100%", padding: "14px", borderRadius: 10, border: "none",
              background: checked ? "#25D366" : "#e5e7eb",
              color: checked ? "#fff" : "#9ca3af",
              fontSize: 15, fontWeight: 700,
              cursor: checked ? "pointer" : "not-allowed",
              transition: "all 0.2s", letterSpacing: 0.2,
            }}
          >
            Continuar
          </button>

          <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 20 }}>
            Protegido contra acesso automatizado
          </p>
        </div>
      </main>

      {/* Rodapé */}
      <footer style={{
        background: "#fff",
        borderTop: "1px solid #ebebeb",
        padding: "24px 20px 20px",
        textAlign: "center",
      }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "6px 20px",
          justifyContent: "center", marginBottom: 16,
        }}>
          {[
            { label: "Política de Privacidade", href: "/privacidade" },
            { label: "Termos de Uso", href: "/termos" },
            { label: "LGPD", href: "/lgpd" },
            { label: "Contato", href: "/contato" },
          ].map(l => (
            <Link key={l.href} href={l.href}
              style={{ fontSize: 12, color: "#9ca3af", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.9 }}>
          <p style={{ fontWeight: 600, color: "#6b7280", margin: "0 0 2px" }}>{COMPANY.name}</p>
          <p style={{ margin: 0 }}>CNPJ: {COMPANY.cnpj}</p>
          <p style={{ margin: 0 }}>{COMPANY.address}</p>
          <p style={{ margin: 0 }}>{COMPANY.email} &nbsp;|&nbsp; {COMPANY.phone}</p>
        </div>
        <p style={{ fontSize: 10, color: "#d1d5db", marginTop: 12 }}>
          &copy; {new Date().getFullYear()} {COMPANY.name}. Todos os direitos reservados.
        </p>
      </footer>

      {/* Banner de cookies */}
      {cookieBanner && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "#fff",
          borderTop: "1px solid #ebebeb",
          padding: "14px 20px",
          display: "flex", flexWrap: "wrap", gap: 12,
          alignItems: "center", justifyContent: "space-between",
          zIndex: 999, boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0, flex: 1, minWidth: 220 }}>
            Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa{" "}
            <Link href="/privacidade" style={{ color: "#25D366", textDecoration: "none" }}>
              Política de Privacidade
            </Link>.
          </p>
          <button onClick={acceptCookies} style={{
            background: "#25D366", color: "#fff",
            border: "none", borderRadius: 8,
            padding: "10px 22px", fontSize: 13,
            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>
            Aceitar
          </button>
        </div>
      )}
    </div>
  )
}
