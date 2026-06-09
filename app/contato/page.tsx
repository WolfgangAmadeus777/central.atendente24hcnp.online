import Link from "next/link"

const COMPANY = {
  name: "Agrelli Corretora de Seguros LTDA",
  cnpj: "48.255.060/0001-81",
  address: "Avenida Presidente Juscelino Kubitschek de Oliveira 5000 Conj 512/435 Torre 01, Iguatemi, São José do Rio Preto SP, CEP 15093-340",
  email: "atendimento@agrelliseguros.com.br",
  phone: "(17) 98111-5558",
}

export const metadata = {
  title: "Contato — Agrelli Seguros",
}

export default function ContatoPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#0d1117", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, maxWidth: 600, margin: "0 auto", padding: "48px 24px 40px", color: "#d1d5db" }}>
        <Link href="/" style={{ fontSize: 13, color: "#25D366", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Voltar
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0f6f1", marginBottom: 8 }}>Contato</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 40, lineHeight: 1.6 }}>
          Entre em contato conosco pelos canais abaixo. Nossa equipe responde em até 1 dia útil.
        </p>

        {/* Cards de contato */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="#25D366"/>
                </svg>
              ),
              label: "E-mail",
              value: COMPANY.email,
              href: `mailto:${COMPANY.email}`,
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.12-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="#25D366"/>
                </svg>
              ),
              label: "Telefone / WhatsApp",
              value: COMPANY.phone,
              href: `https://wa.me/5517981115558`,
            },
          ].map(c => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
              display: "flex", alignItems: "center", gap: 16,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "18px 20px",
              textDecoration: "none", transition: "border-color 0.2s",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "rgba(37,211,102,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {c.icon}
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 3px", letterSpacing: 0.5, textTransform: "uppercase" }}>{c.label}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#f0f6f1", margin: 0 }}>{c.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Dados da empresa */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: "20px 22px",
        }}>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 12px", letterSpacing: 0.5, textTransform: "uppercase" }}>Dados da Empresa</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f6f1", margin: "0 0 6px" }}>{COMPANY.name}</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 4px" }}>CNPJ: {COMPANY.cnpj}</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>{COMPANY.address}</p>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", justifyContent: "center", marginBottom: 14 }}>
          {[{ label: "Política de Privacidade", href: "/privacidade" }, { label: "Termos de Uso", href: "/termos" }, { label: "LGPD", href: "/lgpd" }, { label: "Contato", href: "/contato" }].map(l => (
            <Link key={l.href} href={l.href} style={{ fontSize: 12, color: "#4b5563", textDecoration: "none" }}>{l.label}</Link>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#374151", margin: 0 }}>{COMPANY.name} — CNPJ: {COMPANY.cnpj}</p>
        <p style={{ fontSize: 10, color: "#1f2937", marginTop: 6 }}>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
