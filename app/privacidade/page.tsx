import Link from "next/link"

const COMPANY = {
  name: "Agrelli Corretora de Seguros LTDA",
  cnpj: "48.255.060/0001-81",
  address: "Avenida Presidente Juscelino Kubitschek de Oliveira 5000 Conj 512/435 Torre 01, Iguatemi, São José do Rio Preto SP, CEP 15093-340",
  email: "atendimento@agrelliseguros.com.br",
  phone: "(17) 98111-5558",
}

export const metadata = {
  title: "Política de Privacidade — Agrelli Seguros",
}

export default function PrivacidadePage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#0d1117", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, maxWidth: 720, margin: "0 auto", padding: "48px 24px 40px", color: "#d1d5db" }}>
        <Link href="/" style={{ fontSize: 13, color: "#25D366", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Voltar
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0f6f1", marginBottom: 8 }}>Política de Privacidade</h1>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 36 }}>Última atualização: junho de 2025</p>

        {[
          {
            title: "1. Quem somos",
            body: `A ${COMPANY.name}, inscrita no CNPJ ${COMPANY.cnpj}, com sede em ${COMPANY.address}, é responsável pelo tratamento dos dados pessoais coletados neste site.`,
          },
          {
            title: "2. Dados que coletamos",
            body: "Coletamos informações fornecidas voluntariamente por você, como nome, chave PIX e dados de navegação (endereço IP, páginas visitadas, tempo de sessão) por meio de cookies e tecnologias similares.",
          },
          {
            title: "3. Finalidade do tratamento",
            body: "Os dados são utilizados para: (a) operar e melhorar nossos serviços; (b) comunicar promoções e novidades, mediante consentimento; (c) cumprir obrigações legais e regulatórias.",
          },
          {
            title: "4. Base legal",
            body: "O tratamento se apoia nas bases legais previstas na Lei nº 13.709/2018 (LGPD): consentimento do titular, execução de contrato e legítimo interesse.",
          },
          {
            title: "5. Compartilhamento de dados",
            body: "Não vendemos seus dados. Podemos compartilhá-los com parceiros de pagamento, provedores de infraestrutura e autoridades competentes quando exigido por lei, sempre garantindo nível adequado de proteção.",
          },
          {
            title: "6. Cookies",
            body: "Utilizamos cookies essenciais (para funcionamento do site), analíticos (para mensurar audiência) e de marketing (para personalizar anúncios). Você pode gerenciar suas preferências nas configurações do navegador.",
          },
          {
            title: "7. Retenção de dados",
            body: "Mantemos seus dados pelo período necessário para as finalidades descritas ou conforme exigido por lei. Após esse prazo, os dados são anonimizados ou excluídos de forma segura.",
          },
          {
            title: "8. Seus direitos",
            body: "Nos termos da LGPD, você pode: confirmar a existência de tratamento, acessar, corrigir ou excluir seus dados, revogar o consentimento e opor-se ao tratamento. Solicitações devem ser enviadas para " + COMPANY.email + ".",
          },
          {
            title: "9. Contato",
            body: `Dúvidas sobre esta política? Entre em contato: ${COMPANY.email} | ${COMPANY.phone}`,
          },
        ].map(s => (
          <section key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f0f6f1", marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.75, margin: 0 }}>{s.body}</p>
          </section>
        ))}
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
