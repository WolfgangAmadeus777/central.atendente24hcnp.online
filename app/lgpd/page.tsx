import Link from "next/link"

const COMPANY = {
  name: "Agrelli Corretora de Seguros LTDA",
  cnpj: "48.255.060/0001-81",
  address: "Avenida Presidente Juscelino Kubitschek de Oliveira 5000 Conj 512/435 Torre 01, Iguatemi, São José do Rio Preto SP, CEP 15093-340",
  email: "atendimento@agrelliseguros.com.br",
  phone: "(17) 98111-5558",
}

export const metadata = {
  title: "LGPD — Agrelli Seguros",
}

export default function LgpdPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#0d1117", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, maxWidth: 720, margin: "0 auto", padding: "48px 24px 40px", color: "#d1d5db" }}>
        <Link href="/" style={{ fontSize: 13, color: "#25D366", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Voltar
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0f6f1", marginBottom: 8 }}>LGPD — Lei Geral de Proteção de Dados</h1>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 36 }}>Lei nº 13.709/2018 — Última atualização: junho de 2025</p>

        {[
          {
            title: "1. Compromisso com a LGPD",
            body: `A ${COMPANY.name} está comprometida com o cumprimento integral da Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018), garantindo a privacidade e a segurança das informações de seus usuários.`,
          },
          {
            title: "2. Controlador dos dados",
            body: `O Controlador responsável pelo tratamento dos dados pessoais é: ${COMPANY.name}, CNPJ ${COMPANY.cnpj}, endereço: ${COMPANY.address}.`,
          },
          {
            title: "3. Encarregado (DPO)",
            body: `O Encarregado de Proteção de Dados (DPO) pode ser contatado pelo e-mail: ${COMPANY.email}. É o canal oficial para solicitações de titulares e comunicações com a Autoridade Nacional de Proteção de Dados (ANPD).`,
          },
          {
            title: "4. Direitos dos titulares",
            body: "Nos termos do art. 18 da LGPD, você possui os seguintes direitos: (I) confirmação da existência de tratamento; (II) acesso aos dados; (III) correção de dados incompletos, inexatos ou desatualizados; (IV) anonimização, bloqueio ou eliminação de dados desnecessários; (V) portabilidade dos dados; (VI) eliminação dos dados tratados com consentimento; (VII) informação sobre compartilhamentos; (VIII) revogação do consentimento.",
          },
          {
            title: "5. Como exercer seus direitos",
            body: `Envie sua solicitação para ${COMPANY.email}, identificando-se e descrevendo o direito que deseja exercer. Responderemos em até 15 dias corridos, conforme prazo legal.`,
          },
          {
            title: "6. Bases legais utilizadas",
            body: "Tratamos dados com base em: (a) consentimento do titular (art. 7º, I); (b) execução de contrato (art. 7º, V); (c) cumprimento de obrigação legal (art. 7º, II); (d) legítimo interesse (art. 7º, IX), sempre respeitando os direitos e expectativas dos titulares.",
          },
          {
            title: "7. Segurança dos dados",
            body: "Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acesso não autorizado, destruição, perda, alteração ou divulgação indevida, em conformidade com o art. 46 da LGPD.",
          },
          {
            title: "8. Incidentes de segurança",
            body: "Em caso de incidente de segurança que possa acarretar risco ou dano relevante, notificaremos a ANPD e os titulares afetados nos prazos estabelecidos pela legislação.",
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
