import Link from "next/link"

const COMPANY = {
  name: "Agr Consultoria e Corretora de Seguros LTDA",
  cnpj: "51.712.936/0001-86",
  address: "Avenida Pedro Ludovico, 505 – Quadra 116, Lote 1-18, Apt 301, Cond. Anhembi – Setor Sudoeste, Goiânia/GO – CEP 74305-520",
  email: "agrseguros.corretora@gmail.com",
  phone: "(62) 99697-6970",
}

export const metadata = {
  title: "Termos de Uso — Agr Consultoria",
}

export default function TermosPage() {
  return (
    <div style={{ minHeight: "100dvh", background: "#0d1117", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
      <main style={{ flex: 1, maxWidth: 720, margin: "0 auto", padding: "48px 24px 40px", color: "#d1d5db" }}>
        <Link href="/" style={{ fontSize: 13, color: "#25D366", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
          ← Voltar
        </Link>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0f6f1", marginBottom: 8 }}>Termos de Uso</h1>
        <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 36 }}>Última atualização: junho de 2025</p>

        {[
          {
            title: "1. Aceitação dos termos",
            body: "Ao acessar e utilizar este site, você declara que leu, compreendeu e concorda com os presentes Termos de Uso. Caso não concorde, pedimos que não utilize os serviços disponibilizados.",
          },
          {
            title: "2. Sobre os serviços",
            body: `Este site é operado pela ${COMPANY.name}, inscrita no CNPJ ${COMPANY.cnpj}. Prestamos serviços de consultoria, corretagem de seguros e produtos financeiros digitais, conforme descrito em cada oferta disponibilizada na plataforma.`,
          },
          {
            title: "3. Uso adequado",
            body: "Você se compromete a utilizar o site apenas para fins lícitos, não realizando atividades que possam causar danos à plataforma, a terceiros ou que violem qualquer legislação vigente, incluindo leis de proteção de dados e propriedade intelectual.",
          },
          {
            title: "4. Propriedade intelectual",
            body: "Todo o conteúdo disponível neste site — textos, imagens, logotipos, vídeos e demais materiais — é de titularidade exclusiva da empresa ou de seus licenciantes, sendo vedada qualquer reprodução sem autorização prévia e expressa.",
          },
          {
            title: "5. Limitação de responsabilidade",
            body: "A empresa não se responsabiliza por danos decorrentes de uso indevido da plataforma, interrupções de serviço, falhas de terceiros ou quaisquer eventos fora de seu controle razoável.",
          },
          {
            title: "6. Modificações",
            body: "Reservamo-nos o direito de alterar estes Termos a qualquer momento. As alterações entram em vigor na data de publicação. O uso continuado do site após a publicação implica aceitação das novas condições.",
          },
          {
            title: "7. Foro",
            body: "Fica eleito o foro da Comarca de Goiânia/GO para dirimir quaisquer controvérsias oriundas destes Termos, com renúncia a qualquer outro, por mais privilegiado que seja.",
          },
          {
            title: "8. Contato",
            body: `Em caso de dúvidas: ${COMPANY.email} | ${COMPANY.phone}`,
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
