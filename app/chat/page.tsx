"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vturb-smartplayer": React.HTMLAttributes<HTMLElement> & { id?: string }
    }
  }
}

import { useSearchParams } from "next/navigation"
import { Video, Phone, MoreVertical } from "lucide-react"
import Image from "next/image"

/* ─── Tipos ─── */
type Message = {
  id: number
  type: "text" | "audio" | "user-bubble" | "options" | "video" | "video2" | "video3" | "video4" | "cta-button" | "user-input" | "image"
  content?: string
  duration?: string
  audioSrc?: string
  options?: string[]
  videoSrc?: string
  longDelay?: boolean
}

type Block = Message[]

/* ─── Data atual em portugues ─── */
const DIAS_SEMANA = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"]
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"]

function formatarData(d: Date): string {
  return `${DIAS_SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`
}

function gerarDataFalsa(baseDate: Date, offsetDias: number): string {
  const d = new Date(baseDate)
  d.setDate(d.getDate() + offsetDias)
  return formatarData(d)
}

const hoje = new Date()
const dataCorreta = formatarData(hoje)
const dataFalsa1 = gerarDataFalsa(hoje, -587)
const dataFalsa2 = gerarDataFalsa(hoje, -365)

/* ═══════════════════════════════════════════════════════════
   BLOCOS DE MENSAGENS — edite aqui para montar o novo funil
   ═══════════════════════════════════════════════════════════ */

/* Nome e foto da atendente */
const ATENDENTE_NOME = "Suporte Oficial"
const ATENDENTE_FOTO = "/atendente.webp"

/* Delays por id de mensagem (ms) */
const CUSTOM_DELAYS: Record<number, number> = {
  /* intro */
  1: 3000,
  2: 2000,
  3: 2000,
  /* block 2 */
  101: 2000,
  102: 2000,
  103: 2000,
  104: 15000,
  /* block 3 */
  201: 2000,
  202: 2000,
  203: 25000,
  204: 2000,
  205: 30000,
  206: 2000,
  207: 18000,
  /* block 4 */
  301: 2000,
  302: 8000,
  303: 2000,
  /* block 5 */
  401: 2000,
  402: 2000,   /* audio 11s aparece 2s apos "Aguarde..." */
  403: 11000,  /* texto aparece 11s apos o audio */
  404: 2000,   /* video aparece 2s apos o texto tutorial */
  405: 227000, /* "Avaliacao processada" aparece apos 3:47min do video */
  406: 2000,
  407: 2000,   /* audio 8s aparece 2s apos "Encontrada" */
  408: 8000,   /* texto final aparece 8s apos o audio */
  /* block 6 */
  501: 2000,
  502: 3000,
  503: 2000,
  504: 2000,
  505: 2000,
  /* block 7 */
  601: 2000,
  /* block 8 */
  701: 2000,
  /* block 9 */
  801: 2000,
  802: 3000,
  803: 2000,
  804: 2000,
  805: 3000,
  806: 2000,
  807: 21000,
  808: 8000,
  809: 6000,
  /* block 10 */
  901: 2000,
  902: 3000,
  903: 3000,   /* video3 aparece 3s apos a msg anterior */
  904: 300000, /* 5 minutos de delay apos o video */
  905: 3000,
  906: 3000,
  907: 3000,
  908: 2000,
  909: 2000,
  910: 3000,
  911: 3000,
  /* block 11 - pergunta 2/3 ar condicionado */
  1001: 2000,
  /* block 12 - pergunta 3/3 ar condicionado */
  1101: 2000,
  /* block 13 - resultado ar condicionado + iphone perguntas */
  1201: 2000,
  1202: 2000,
  1203: 2000,
  1204: 2000,
  1205: 2000,
  1206: 2000,
  1207: 2000,
  1208: 2000,
  1209: 2000,
  1210: 2000,
  /* block 14 - pergunta 2/3 iphone */
  1301: 2000,
  /* block 15 - pergunta 3/3 iphone */
  1401: 2000,
  /* block 16 - resultado final + audio + input */
  1501: 2000,
  1502: 2000,
  1503: 2000,
  1504: 2000,   /* audio 21s aparece 2s apos saldo */
  1505: 21000,  /* texto aparece 21s apos o audio */
  /* block 18 - coleta chave pix */
  1701: 2000,
  1702: 2000,
  /* block 19 - confirma chave pix */
  1801: 2000,
  /* block 19 corrigir */
  1850: 2000,
  /* block 20 - erro + VSL anti-fraude
     1901=proc 1902=erro 1903=audio14s 1904=PRESTE ATENCAO 1905=audio11s
     1906=TUTORIAL texto 1907=video4 1908=Calculando taxa 1909=Sua taxa
     1910=Essa TAXA 1911=Apenas 1912=depois 1913=Logo apos 1914=options */
  1901: 2000,
  1902: 2000,
  1903: 2000,
  1904: 14000,  /* PRESTE ATENCAO aparece 14s apos o audio */
  1905: 2000,
  1906: 11000,  /* TUTORIAL aparece 11s apos o audio 11s */
  1907: 2000,   /* video4 aparece 2s apos o texto TUTORIAL */
  1908: 264000, /* "Calculando taxa" aparece 4min24s APOS o video iniciar */
  1909: 3000,
  1910: 3000,
  1911: 3000,
  1912: 3000,
  1913: 3000,
  1914: 3000,
  /* block 17 */
  1601: 2000,
  1602: 2000,   /* audio 31s aparece 2s apos msg */
  1603: 31000,  /* msg 3 aparece apos 31s do audio */
  1604: 2000,
  1605: 2000,   /* audio 11s */
  1606: 11000,
  1607: 8000,   /* AVISO IMPORTANTE aparece 8s apos o audio anterior */
  1608: 2000,   /* audio 11s aparece 2s apos AVISO IMPORTANTE */
  1609: 11000,  /* "So mais uma coisa" aparece 11s apos o audio */
  1610: 2000,   /* audio 15s aparece 2s apos msg */
  1611: 15000,  /* saldo aparece 15s apos o audio */
  1612: 2000,
  /* block 21 - por que devo pagar */
  2001: 2000,
  2002: 2000,
  2003: 2000,
}

/* Bloco inicial */
const INTRO_BLOCK: Block = [
  { id: 1, type: "text", content: "👋 Seja Bem-vindo(a) ao Chat do CASH NO PIX!" },
  {
    id: 2,
    type: "text",
    content: "Você Foi Selecionado Para Trabalhar em Home Office (em casa).\n\nSalario: R$300 a R$500 por Dia ✅\n\nCarga Horária: 1h a 2h por dia.",
  },
  {
    id: 3,
    type: "text",
    content: "E ganhou uma Licença Gratuita para Avaliar Produtos e Recebe-los de GRAÇA! 😁\n(Clique no Botão Abaixo para prosseguir)",
  },
  { id: 4, type: "user-bubble", content: "Prosseguir!" },
]

/* Blocos seguintes */
const BLOCK_2: Block = [
  { id: 101, type: "text",       content: "Aguarde um atendente... ⏳" },
  { id: 102, type: "text",       content: "Atendente Júlia entrou no bate-papo! ✅" },
  { id: 103, type: "audio",      duration: "0:15", audioSrc: "/julia-block2.mp3" },
  { id: 104, type: "text",       content: "Mas antes, qual seu nome? (apenas seu primeiro nome)" },
  { id: 105, type: "user-input", content: "" },
]
const BLOCK_3: Block = [
  { id: 201, type: "text",        content: "Prazer {nome}, preste Bastante Atenção!" },
  { id: 202, type: "audio",       duration: "0:25", audioSrc: "/audio-block3-2.mp3" }, /* 25s — arquivo medio */
  { id: 203, type: "text",        content: "Sua opinião vale dinheiro pra você e vendas pra gente!" },
  { id: 204, type: "audio",       duration: "0:30", audioSrc: "/audio-block3-3.mp3" }, /* 30s — arquivo maior */
  { id: 205, type: "text",        content: "Pagamos de R$ 50 a R$ 150 (Reais) por Avaliação!" },
  { id: 206, type: "audio",       duration: "0:18", audioSrc: "/audio-block3-1.mp3" }, /* 18s — arquivo menor */
  { id: 207, type: "text",        content: "Clique no Botão Abaixo para Continuar!" },
  { id: 208, type: "user-bubble", content: "Entendi, Como posso começar?!" },
]
const BLOCK_4: Block = [
  { id: 301, type: "audio",       duration: "0:08", audioSrc: "/audio-block4-1.mp3" },
  { id: 302, type: "text",        content: "Ao concluir a Avaliação Teste você receberá em média: R$ 63 - R$ 94" },
  { id: 303, type: "text",        content: "Clique no Botão Abaixo para Continuar!" },
  { id: 304, type: "user-bubble", content: "Ok, vamos começar 👍" },
]
const BLOCK_5: Block = [
  { id: 401, type: "text",        content: "Aguarde, gerando uma avaliação... ⌛" },
  { id: 402, type: "audio",       duration: "0:11", audioSrc: "/audio-block5-1.mp3" },
  { id: 403, type: "text",        content: "TUTORIAL - Como funciona e como pagamos nossos avaliadores!" },
  { id: 404, type: "video2" },
  { id: 405, type: "text",        content: "Aguarde, avaliação sendo processada... ⌛ (2 a 3 minutos)" },
  { id: 406, type: "text",        content: "Avaliação ENCONTRADA com sucesso! ✅" },
  { id: 407, type: "audio",       duration: "0:08", audioSrc: "/audio-block5-2.mp3" },
  { id: 408, type: "text",        content: "Clique no Botão Abaixo para Começar a Avaliação Teste!" },
  { id: 409, type: "user-bubble", content: "Começar Avaliação Teste!" },
]
const BLOCK_6: Block = [
  {
    id: 501,
    type: "text",
    content: "Avaliação 1:\n\n• Pagamento de: R$ 62 a R$ 97\n\n• Duração: 1 a 5 minutos\n\n• Avaliação: Básica",
  },
  { id: 502, type: "text",    content: "Foto do produto:" },
  { id: 503, type: "image",   content: "/produto-airfryer.png" },
  { id: 504, type: "text",    content: "Nome do Produto: Fritadeira Britânia Air Fryer BFR37 4,2L" },
  { id: 505, type: "options", options: ["Sim", "Talvez", "Não"],
    content: "📝 Pergunta 1/3:\n{nome}, você compraria este produto?" },
]

const BLOCK_7: Block = [
  {
    id: 601,
    type: "options",
    options: ["0", "1", "2", "3", "4", "5"],
    content: "📝 Pergunta 2/3:\n{nome}, avalie de 0 a 5 essa Air Fryer:",
  },
]

const BLOCK_8: Block = [
  {
    id: 701,
    type: "options",
    options: ["Sim", "Talvez", "Não"],
    content: "📝 Pergunta 3/3:\n{nome}, você recomendaria para alguém?",
  },
]

const BLOCK_9: Block = [
  { id: 801, type: "text",        content: "Sua Avaliação foi Finalizada e Aprovada ✅" },
  { id: 802, type: "text",        content: "Processando respostas e calculando pagamento... ⌛" },
  { id: 803, type: "text",        content: "Primeiro Produto - Resumo\n\n• Nível das respostas: 9/10\n\n• Pagamento: R$90,37" },
  { id: 804, type: "text",        content: "Seu saldo: R$90,37" },
  { id: 805, type: "text",        content: "Para sacar esse valor R$97,37 você precisa terminar sua Avaliação Teste!" },
  { id: 806, type: "audio",       duration: "0:21", audioSrc: "/audio-block7-1.mp3" },
  { id: 807, type: "text",        content: "Meus Parabéns! 😊" },
  { id: 808, type: "audio",       duration: "0:06", audioSrc: "/audio-block7-2.mp3" },
  { id: 809, type: "text",        content: "Clique no Botão Abaixo para Terminar com a Avaliação Teste!" },
  { id: 810, type: "user-bubble", content: "Terminar Avaliação!" },
]

const BLOCK_10: Block = [
  { id: 901, type: "text",        content: "Aguarde, gerando uma avaliação... ⌛" },
  { id: 902, type: "text",        content: "Enquanto sua Avaliação carrega, assista o vídeo da nossa visita ao TOP Avaliadores!" },
  { id: 903, type: "video3" },
  { id: 904, type: "text",        content: "Aguarde, avaliação sendo processada... ⌛ (2 a 3 minutinhos)" },
  { id: 905, type: "text",        content: "TUTORIAL de como fazer seu saque no aplicativo!" },
  { id: 906, type: "text",        content: "Avaliação ENCONTRADA com sucesso! ✅" },
  {
    id: 907, type: "text",
    content: "Avaliação 2:\n\n• Pagamento de: R$ 68 a R$ 119\n\n• Duração: 1 a 5 minutos\n\n• Avaliação: Premium",
  },
  { id: 908, type: "text",        content: "Foto do produto:" },
  { id: 909, type: "image",       content: "/produto-arcondicionado.png" },
  { id: 910, type: "text",        content: "Nome do Produto: Ar Condicionado Split Hi Wall Philco 9000 BTU" },
  {
    id: 911, type: "options",
    options: ["Sim", "Talvez", "Não"],
    content: "📝 Pergunta 1/3:\n{nome}, você compraria este produto?",
  },
]

const BLOCK_11: Block = [
  {
    id: 1001, type: "options",
    options: ["Sim", "Talvez", "Não"],
    content: "📝 Pergunta 2/3:\n{nome}, já viu alguém usando esse Ar Condicionado?",
  },
]

const BLOCK_12: Block = [
  {
    id: 1101, type: "options",
    options: ["Sim, eu gostei", "Mais ou menos", "Não gostei!"],
    content: "📝 Pergunta 3/3:\n{nome}, você gostou das fotos do Ar Condicionado, ou poderiam ser melhores?",
  },
]

const BLOCK_13: Block = [
  { id: 1201, type: "text",  content: "Sua Avaliação foi Finalizada e Aprovada ✅" },
  { id: 1202, type: "text",  content: "Processando respostas e calculando pagamento... ⌛" },
  { id: 1203, type: "text",  content: "Primeiro Produto - Resumo\n\n• Nível das respostas: 9/10\n\n• Pagamento: R$ 126,67" },
  { id: 1204, type: "text",  content: "Seu saldo: R$217,04" },
  { id: 1205, type: "text",  content: "Para sacar esse valor R$196,05 você precisa terminar sua Avaliação Teste!" },
  { id: 1206, type: "text",  content: "Avaliação Final:\n\n• Pagamento de: R$ 68 a R$ 150\n\n• Duração: 1 a 5 minutos\n\n• Avaliação: Premium" },
  { id: 1207, type: "text",  content: "Foto do produto:" },
  { id: 1208, type: "image", content: "/produto-iphone17.png" },
  { id: 1209, type: "text",  content: "Nome do Produto: Iphone 17 Pro Max" },
  {
    id: 1210, type: "options",
    options: ["Sim", "Talvez", "Não"],
    content: "📝 Pergunta 1/3:\n{nome}, você compraria este produto?",
  },
]

const BLOCK_14: Block = [
  {
    id: 1301, type: "options",
    options: ["Sim", "Talvez", "Não"],
    content: "📝 Pergunta 2/3:\n{nome}, já viu alguém usando esse Iphone?",
  },
]

const BLOCK_15: Block = [
  {
    id: 1401, type: "options",
    options: ["Sim, eu gostei", "Mais ou menos", "Não gostei!"],
    content: "📝 Pergunta 3/3:\n{nome}, você gostou das fotos do Iphone, ou poderiam ser melhores?",
  },
]

const BLOCK_16: Block = [
  { id: 1501, type: "text",       content: "Processando respostas e calculando pagamento... ⌛" },
  { id: 1502, type: "text",       content: "Segundo Produto - Resumo\n\n• Nível das respostas: 10/10\n\n• Pagamento: R$ 132,19" },
  { id: 1503, type: "text",       content: "Seu saldo: R$350,24" },
  { id: 1504, type: "audio",      duration: "0:21", audioSrc: "/audio-final-21s.mp3" },
  { id: 1505, type: "text",       content: "Enquanto eu libero seu saque de R$307,24, me conta aí..." },
  { id: 1506, type: "user-input", content: "" },
]

const BLOCK_17: Block = [
  { id: 1601, type: "text",        content: "Fico feliz de mais lendo isso!..." },
  { id: 1602, type: "audio",       duration: "0:31", audioSrc: "/audio-b17-a.mp3" },
  { id: 1603, type: "text",        content: "E quem está chegando agora, está bebendo água limpa e fazendo muito dinheiro!" },
  { id: 1604, type: "audio",       duration: "0:11", audioSrc: "/audio-b17-b.mp3" },
  { id: 1605, type: "text",        content: "Máximo: 10 AVALIAÇÕES\nRenda: 300 a 1000 por dia" },
  { id: 1606, type: "audio",       duration: "0:08", audioSrc: "/audio-b17-c.mp3" },
  { id: 1607, type: "text",        content: "AVISO IMPORTANTE:" },
  { id: 1608, type: "audio",       duration: "0:11", audioSrc: "/audio-b17-d.mp3" },
  { id: 1609, type: "text",        content: "Só mais uma coisa:" },
  { id: 1610, type: "audio",       duration: "0:15", audioSrc: "/audio-b17-e.mp3" },
  { id: 1611, type: "text",        content: "Seu saldo com o bônus de iniciante: R$467.24" },
  { id: 1612, type: "user-bubble", content: "Sacar Agora!" },
]

const BLOCK_18: Block = [
  { id: 1701, type: "text",       content: "Perfeito! Vou solicitar seu saque, seu dinheiro será enviado Automaticamente!" },
  { id: 1702, type: "text",       content: "Insira sua Chave PIX:\n*Sem pontuação*" },
  { id: 1703, type: "user-input", content: "" },
]

const BLOCK_19: Block = [
  {
    id: 1801,
    type: "options",
    options: ["Confirmar Chave PIX", "Corrigir Chave PIX"],
    content: "Confirme sua Chave:\n{pix}",
  },
]

/* Bloco de correcao: re-abre o input PIX sem avancar o funil */
const BLOCK_19_CORRIGIR: Block = [
  { id: 1850, type: "text",       content: "Tudo bem! Digite sua Chave PIX correta:" },
  { id: 1851, type: "user-input", content: "" },
]

const BLOCK_20: Block = [
  { id: 1901, type: "text",   content: "Processando seu saque... ⌛" },
  { id: 1902, type: "text",   content: "ERRO DE CADASTRO ❌\n\nPara efetuar seu saque, você precisa se cadastrar no app CASH NO PIX !" },
  { id: 1903, type: "audio",  duration: "0:14", audioSrc: "/audio-b19-a.mp3" },
  { id: 1904, type: "text",   content: "⚠️ PRESTE ATENÇÃO!" },
  { id: 1905, type: "audio",  duration: "0:11", audioSrc: "/audio-b19-b.mp3" },
  { id: 1906, type: "text",   content: "TUTORIAL - Como e por que passar no Anti-Fraude para fazer seu saque:" },
  { id: 1907, type: "video4" },
  { id: 1908, type: "text",   content: "Calculando sua taxa...." },
  { id: 1909, type: "text",   content: "Sua taxa será R$37 ✅" },
  { id: 1910, type: "text",   content: "Essa TAXA será paga uma ÚNICA VEZ!" },
  { id: 1911, type: "text",   content: "Apenas para passar no Anti-fraude CASHNOPIX ⚠️" },
  { id: 1912, type: "text",   content: "E depois do pagamento, o valor dessa taxa RETORNARÁ AUTOMATICAMENTE pra você." },
  { id: 1913, type: "text",   content: "Logo após o pagamento dessa taxa, você receberá R$504,24 em seu PIX ✅\n\n(R$467,24 + R$37 = R$504,24)" },
  {
    id: 1914, type: "options",
    options: ["QUERO FAZER MEU CADASTRO!", "POR QUE DEVO PAGAR?"],
    content: "",
  },
]

const BLOCK_21: Block = [
  {
    id: 2001, type: "text",
    content: "Como o Roberto explicou, essa é uma Taxa Obrigatória pelos seguintes motivos;\n\n- Verificar se você é o portador da chave Pix: {pix}\n\n- Manter nossos servidores abertos!\n\n- Evitar Golpes de Terceiros!",
  },
  {
    id: 2002, type: "text",
    content: "Com essa Transferência de R$37,00; Podemos garantir que a transação está sendo realizada pelo Verdadeiro Portador do PIX e não por outra pessoa tentando sacar esse valor!",
  },
  {
    id: 2003, type: "text",
    content: "IMPORTANTE:\nO pagamento deve ser feito no seu nome e através de uma conta bancária de sua titularidade para confirmar sua identidade.",
  },
  {
    id: 2004, type: "user-bubble",
    content: "QUERO FAZER MEU CADASTRO",
  },
]

/* Mapa: indice da pergunta respondida -> proximo bloco */
const NEXT_BLOCKS: Record<number, Block> = {
  1:  BLOCK_2,
  2:  BLOCK_3,
  3:  BLOCK_4,
  4:  BLOCK_5,
  5:  BLOCK_6,
  6:  BLOCK_7,
  7:  BLOCK_8,
  8:  BLOCK_9,
  9:  BLOCK_10,
  10: BLOCK_11,
  11: BLOCK_12,
  12: BLOCK_13,
  13: BLOCK_14,
  14: BLOCK_15,
  15: BLOCK_16,
  16: BLOCK_17,
  17: BLOCK_18,
  18: BLOCK_19,
  19: BLOCK_20,
  20: BLOCK_21,
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  AUDIO ENGINE — elemento <audio> HTML singleton                        */
/*                                                                        */
/*  Por que <audio> HTML e nao Web Audio API:                             */
/*  • No iOS, o Web Audio API e MUDO quando o interruptor de silencio      */
/*    fisico do iPhone esta ligado. O elemento <audio> HTML toca pela      */
/*    categoria de MIDIA e ignora esse interruptor.                        */
/*  • Um unico elemento e reusado por todos os audios (chat e sequencial,  */
/*    toca um por vez). Desbloquear UM elemento no gesto o mantem          */
/*    desbloqueado para todos os src.set() seguintes — autoplay garantido. */
/* ═══════════════════════════════════════════════════════════════════════ */

let _audioEl: HTMLAudioElement | null = null
let _audioUnlocked = false
/* Qual AudioBubble e "dono" do elemento agora (para roteamento de eventos) */
let _audioOwner: symbol | null = null

function getAudioEl(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null
  if (!_audioEl) {
    _audioEl = new Audio()
    _audioEl.preload = "auto"
    _audioEl.setAttribute("playsinline", "")
    _audioEl.setAttribute("webkit-playsinline", "")
  }
  return _audioEl
}

/* Desbloqueia o elemento <audio> — DEVE ser chamado dentro de um gesto.
   Da play() em um data-uri silencioso e pausa: isso "ativa" o elemento
   para reproducao programatica posterior no iOS/Android. */
function unlockAudio() {
  if (_audioUnlocked) return
  const el = getAudioEl()
  if (!el) return
  _audioUnlocked = true
  /* WAV silencioso minimo em base64 (44 bytes header + 0 samples) */
  const silent = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
  const prevSrc = el.src
  try {
    el.muted = true
    el.src = silent
    const p = el.play()
    if (p && typeof p.then === "function") {
      p.then(() => {
        el.pause()
        el.muted = false
        if (prevSrc && prevSrc !== silent) { /* nao restaura — bubble seta o seu */ }
      }).catch(() => { el.muted = false })
    } else {
      el.pause()
      el.muted = false
    }
  } catch { el.muted = false }
}

/* Gestos globais tambem desbloqueiam, como rede de seguranca */
if (typeof document !== "undefined") {
  const u = () => unlockAudio()
  document.addEventListener("touchend", u, { capture: true, passive: true })
  document.addEventListener("click",    u, { capture: true, passive: true })
}

/* Compat: handlers de clique do chat chamam ensureUnlocked() */
function ensureUnlocked() { unlockAudio() }

/* ─── Hora atual formatada ─── */
function getTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

/* Converte "0:15" em segundos (15) */
function parseDuration(d: string): number {
  const parts = d.split(":").map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]
  return Number(d) || 0
}

/* ─── AudioBubble ─── */
function AudioBubble({
  duration,
  audioSrc,
  autoPlay,
  onPlayStarted,
}: {
  duration: string
  audioSrc?: string
  autoPlay?: boolean
  onPlayStarted?: () => void
}) {
  const [playing, setPlaying]       = useState(false)
  const [progress, setProgress]     = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")

  const idRef         = useRef<symbol>(Symbol("audio"))
  const offsetRef     = useRef(0)   /* posicao em segundos */
  const mountedRef    = useRef(true)
  const onPlayRef     = useRef(onPlayStarted)
  onPlayRef.current   = onPlayStarted
  const didAutoRef    = useRef(false)

  /* Anexa os listeners ao elemento global quando este bubble e o dono */
  function attachListeners() {
    const el = getAudioEl()
    if (!el) return
    el.ontimeupdate = () => {
      if (_audioOwner !== idRef.current || !mountedRef.current) return
      if (!el.duration || isNaN(el.duration)) return
      offsetRef.current = el.currentTime
      setProgress((el.currentTime / el.duration) * 100)
      const m = Math.floor(el.currentTime / 60)
      const s = Math.floor(el.currentTime % 60).toString().padStart(2, "0")
      setCurrentTime(`${m}:${s}`)
    }
    el.onended = () => {
      if (_audioOwner !== idRef.current || !mountedRef.current) return
      offsetRef.current = 0
      setPlaying(false)
      setProgress(0)
      setCurrentTime("0:00")
    }
    el.onpause = () => {
      if (_audioOwner !== idRef.current || !mountedRef.current) return
      setPlaying(false)
    }
    el.onplay = () => {
      if (_audioOwner !== idRef.current || !mountedRef.current) return
      setPlaying(true)
    }
  }

  function startPlay(from: number) {
    if (!audioSrc) return
    const el = getAudioEl()
    if (!el) return

    unlockAudio()

    /* Assume posse do elemento global */
    _audioOwner = idRef.current
    attachListeners()

    /* Se o src ja e este audio, apenas continua; senao carrega */
    const wantSrc = new URL(audioSrc, window.location.href).href
    if (el.src !== wantSrc) {
      el.src = audioSrc
    }
    el.muted = false
    try { el.currentTime = from } catch {}

    const p = el.play()
    if (p && typeof p.then === "function") {
      p.then(() => {
        if (_audioOwner !== idRef.current || !mountedRef.current) return
        setPlaying(true)
        onPlayRef.current?.()
      }).catch(() => {
        /* Bloqueado — tenta de novo no proximo gesto do usuario */
        const retry = () => {
          document.removeEventListener("touchend", retry)
          document.removeEventListener("click", retry)
          startPlay(offsetRef.current)
        }
        document.addEventListener("touchend", retry, { once: true, passive: true })
        document.addEventListener("click",    retry, { once: true, passive: true })
      })
    } else {
      setPlaying(true)
      onPlayRef.current?.()
    }
  }

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  /* Autoplay quando a bubble aparece */
  useEffect(() => {
    if (!audioSrc || !autoPlay || didAutoRef.current) return
    didAutoRef.current = true
    startPlay(0)
  }, [audioSrc, autoPlay]) // eslint-disable-line

  function togglePlay() {
    const el = getAudioEl()
    if (!el) return
    if (playing && _audioOwner === idRef.current) {
      el.pause()
      setPlaying(false)
    } else {
      startPlay(offsetRef.current)
    }
  }

  function handleTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect  = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const totalSec = parseDuration(duration)
    const newOff = ratio * totalSec
    offsetRef.current = newOff
    if (playing && _audioOwner === idRef.current) {
      const el = getAudioEl()
      if (el) { try { el.currentTime = newOff } catch {} }
    } else {
      const m = Math.floor(newOff / 60)
      const s = Math.floor(newOff % 60).toString().padStart(2, "0")
      setCurrentTime(`${m}:${s}`)
      setProgress((newOff / totalSec) * 100)
    }
  }

  return (
    <div className="wa-audio-bubble">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={togglePlay} className="wa-audio-btn" aria-label={playing ? "Pausar" : "Reproduzir"}>
          {playing
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#667781"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="#667781"><path d="M8 5v14l11-7z"/></svg>
          }
        </button>
        <div className="wa-audio-track" onClick={handleTrackClick} style={{ cursor: "pointer" }}>
          <div className="wa-audio-fill" style={{ width: `${progress}%` }} />
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#aaa">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
        </svg>
        <MoreVertical size={13} color="#aaa" />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 4 }}>
        <span className="wa-msg-time">{currentTime} / {duration}</span>
      </div>
    </div>
  )
}

/* ─── VturbBubble ─── */
const VTURB_PLAYERS = {
  video1: {
    scriptId: "vturb-script-69ff5b9c",
    src: "https://scripts.converteai.net/abbfb8e9-1820-4d22-b6f1-31161a8ea891/players/69ff5b9c9c0c7d2462e88151/v4/player.js",
    playerId: "vid-69ff5b9c9c0c7d2462e88151",
  },
  video2: {
    scriptId: "vturb-script-6a23758d",
    src: "https://scripts.converteai.net/fc03d803-4795-4f47-92b9-4396de05022e/players/6a23758dcf5b757b7649c7b9/v4/player.js",
    playerId: "vid-6a23758dcf5b757b7649c7b9",
  },
  video3: {
    scriptId: "vturb-script-6a237fdc",
    src: "https://scripts.converteai.net/fc03d803-4795-4f47-92b9-4396de05022e/players/6a237fdca85d6b55026ee6de/v4/player.js",
    playerId: "vid-6a237fdca85d6b55026ee6de",
  },
  video4: {
    scriptId: "vturb-script-6a2386c4",
    src: "https://scripts.converteai.net/fc03d803-4795-4f47-92b9-4396de05022e/players/6a2386c4c73d237d88f22de9/v4/player.js",
    playerId: "vid-6a2386c4c73d237d88f22de9",
  },
}

function VturbBubble({ time, variant = "video1" }: { time: string; variant?: keyof typeof VTURB_PLAYERS }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const player = VTURB_PLAYERS[variant]

  useEffect(() => {
    if (!containerRef.current) return
    if (document.getElementById(player.scriptId)) return
    const s = document.createElement("script")
    s.id = player.scriptId
    s.src = player.src
    s.async = true
    document.head.appendChild(s)
  }, [player])

  return (
    <div style={{
      background: "#fff",
      borderRadius: "0 8px 8px 8px",
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
      width: "min(520px, 90vw)",
    }}>
      <div ref={containerRef} style={{ width: "100%", background: "#000" }}>
        <vturb-smartplayer id={player.playerId} style={{ display: "block", width: "100%" }} />
      </div>
      <div className="wa-msg-time" style={{ padding: "4px 10px 6px", textAlign: "right" }}>{time}</div>
    </div>
  )
}

/* ─── TypingBubble ─── */
function TypingBubble({ isAudio }: { isAudio: boolean }) {
  return (
    <div className="wa-typing-row">
      <div className="wa-avatar">
        <Image src={ATENDENTE_FOTO} alt={ATENDENTE_NOME} width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      </div>
      {isAudio ? (
        <div className="wa-typing-bubble wa-audio-typing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#128c7e" style={{ flexShrink: 0 }}>
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          {[0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((d, i) => (
            <span key={i} className="wa-wave" style={{ animationDelay: `${d}s` }} />
          ))}
        </div>
      ) : (
        <div className="wa-typing-bubble">
          <span className="wa-dot" style={{ animationDelay: "0s" }} />
          <span className="wa-dot" style={{ animationDelay: "0.2s" }} />
          <span className="wa-dot" style={{ animationDelay: "0.4s" }} />
        </div>
      )}
    </div>
  )
}

/* ─── Utilitario de tracking (fire-and-forget) ─── */
function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/* ─── Wrapper com Suspense (exigido pelo useSearchParams no Next.js App Router) ─── */
export default function ChatPageWrapper() {
  return (
    <React.Suspense fallback={<div style={{ background: "#efeae2", minHeight: "100dvh" }} />}>
      <ChatPage />
    </React.Suspense>
  )
}

/* ─── Persistencia do funil (sobrevive a fechar/reabrir o navegador) ─── */
const FLOW_STORAGE_KEY = "_funnel_state_v1"

type PersistedState = {
  visibleMessages: Message[]
  queue: Message[]
  queueIndex: number
  waitingForOption: boolean
  waitingForButtonClick: boolean
  waitingForTextInput: boolean
  leadNome: string
  leadPix: string
  questionCount: number
  done: boolean
  showCta: boolean
}

function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(FLOW_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch { return null }
}

/* ─── Componente principal ─── */
function ChatPage() {
  const searchParams = useSearchParams()
  const nome = searchParams.get("nome") || "você"
  const [time] = useState(getTime())

  /* Session ID persistido na sessao do browser */
  const sessionIdRef = useRef<string>("")
  if (!sessionIdRef.current) {
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("_monitor_sid")
      if (!id) { id = generateSessionId(); sessionStorage.setItem("_monitor_sid", id) }
      sessionIdRef.current = id
    } else {
      sessionIdRef.current = generateSessionId()
    }
  }

  const track = useCallback((type: string, label: string, value?: string) => {
    const body = { sessionId: sessionIdRef.current, type, label, ts: Date.now(), value }
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .catch(() => {/* silently fail */})
  }, [])

  /* Fim dos helpers de tracking */

  /* Estado restaurado do localStorage (se o usuario ja tinha avancado o funil).
     O guard typeof window garante que no SSR sempre retorna null,
     evitando hydration mismatch. */
  const restoredRef = useRef<PersistedState | null>(null)
  if (restoredRef.current === null && typeof window !== "undefined") {
    restoredRef.current = loadPersistedState() ?? (undefined as any)
  }
  const restored = restoredRef.current

  /* mounted: false no servidor → renderiza estado vazio (sem mensagens).
     true no cliente (pos-hydration) → renderiza com dados do storage.
     Isso elimina o hydration mismatch. */
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const [visibleMessages, setVisibleMessages] = useState<Message[]>(() =>
    typeof window !== "undefined" ? (restored?.visibleMessages ?? []) : []
  )
  const [isTyping, setIsTyping] = useState(false)
  const [isTypingAudio, setIsTypingAudio] = useState(false)
  const [queue, setQueue] = useState<Message[]>(() =>
    typeof window !== "undefined" ? (restored?.queue ?? INTRO_BLOCK) : INTRO_BLOCK
  )
  const [queueIndex, setQueueIndex] = useState(() =>
    typeof window !== "undefined" ? (restored?.queueIndex ?? 0) : 0
  )
  const [waitingForOption, setWaitingForOption] = useState(() =>
    typeof window !== "undefined" ? (restored?.waitingForOption ?? false) : false
  )
  const [waitingForButtonClick, setWaitingForButtonClick] = useState(() =>
    typeof window !== "undefined" ? (restored?.waitingForButtonClick ?? false) : false
  )
  const [waitingForTextInput, setWaitingForTextInput] = useState(() =>
    typeof window !== "undefined" ? (restored?.waitingForTextInput ?? false) : false
  )
  /* Controle de áudio no mobile: delay da próxima msg só começa após o play */
  const [waitingForAudioPlay, setWaitingForAudioPlay] = useState(false)
  const pendingAudioDelayRef = useRef<{ delay: number; msgId: number } | null>(null)
  const [textInputValue, setTextInputValue] = useState("")
  const [leadNome, setLeadNome] = useState(() => restored?.leadNome ?? "")
  const [leadPix, setLeadPix] = useState(() => restored?.leadPix ?? "")
  const leadPixRef = useRef(restored?.leadPix ?? "")
  const [questionCount, setQuestionCount] = useState(() => restored?.questionCount ?? 0)
  /* Placeholder derivado do questionCount — nunca fica desatualizado no restore */
  const textInputPlaceholder =
    questionCount >= 17 ? "Digite sua chave PIX (sem pontuacao)..." :
    questionCount >= 14 ? "Me conta o que mudaria na sua vida..." :
    "Digite seu primeiro nome..."
  const [done, setDone] = useState(() => restored?.done ?? false)
  const [showCta, setShowCta] = useState(() => restored?.showCta ?? false)
  /* Marca se a sessao foi restaurada — usado para nao dar autoPlay em audios antigos */
  const isRestoredSession = useRef(!!restored && (restored.visibleMessages?.length ?? 0) > 0)
  /* IDs de mensagens ja presentes na restauracao (audios delas nao tocam sozinhos) */
  const restoredMsgIds = useRef<Set<number>>(
    new Set((restored?.visibleMessages ?? []).map(m => m.id))
  )
  const bottomRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  /* Input fantasma fora da viewport — foca via touchstart para abrir teclado no iOS */
  const ghostInputRef = useRef<HTMLInputElement>(null)

  /* Abre o teclado no mobile de forma confiavel:
     - Foca o input real imediatamente dentro do handler de toque do usuario
     - O ghostInput garante que haja um elemento focavel pronto antes do gesto */
  function openKeyboard() {
    if (textInputRef.current) {
      textInputRef.current.focus()
    }
  }

  /* Tenta focar quando waitingForTextInput muda (funciona em desktop e em
     algumas versoes do Android; no iOS e necessario o toque abaixo) */
  useEffect(() => {
    if (waitingForTextInput && textInputRef.current) {
      const t = setTimeout(() => {
        textInputRef.current?.focus()
      }, 80)
      return () => clearTimeout(t)
    }
  }, [waitingForTextInput])

  /* Rastreia entrada no funil */
  useEffect(() => {
    track("enter", "Funil iniciado")
    const onExit = () => track("exit", "Saiu da pagina")
    window.addEventListener("beforeunload", onExit)
    return () => window.removeEventListener("beforeunload", onExit)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [visibleMessages, isTyping])

  /* Persiste o progresso do funil no localStorage (sobrevive a fechar o navegador) */
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const state: PersistedState = {
        visibleMessages,
        queue,
        queueIndex,
        waitingForOption,
        waitingForButtonClick,
        waitingForTextInput,
        leadNome,
        leadPix,
        questionCount,
        done,
        showCta,
      }
      localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify(state))
    } catch {/* storage cheio ou indisponivel — ignora */}
  }, [
    visibleMessages, queue, queueIndex, waitingForOption, waitingForButtonClick,
    waitingForTextInput, leadNome, leadPix, questionCount, done, showCta,
  ])

  /* ── Engine de mensagens ── */
  useEffect(() => {
    if (queueIndex >= queue.length) {
      if (!waitingForOption && !waitingForButtonClick && !waitingForTextInput) setDone(true)
      return
    }
    if (waitingForOption || waitingForButtonClick || waitingForTextInput) return

    const msg = queue[queueIndex]

    if (msg.type === "options") {
      const t = setTimeout(() => {
        setVisibleMessages(p => [...p, msg])
        setWaitingForOption(true)
        setQueueIndex(i => i + 1)
      }, 400)
      return () => clearTimeout(t)
    }

    if (msg.type === "user-bubble") {
      const t = setTimeout(() => {
        setVisibleMessages(p => [...p, msg])
        setWaitingForButtonClick(true)
      }, 300)
      return () => clearTimeout(t)
    }

    if (msg.type === "user-input") {
      const t = setTimeout(() => {
        setWaitingForTextInput(true)
        setQueueIndex(i => i + 1)
      }, 300)
      return () => clearTimeout(t)
    }

    if (msg.type === "cta-button") {
      const t = setTimeout(() => {
        setVisibleMessages(p => [...p, msg])
        setShowCta(true)
        setQueueIndex(i => i + 1)
      }, 800)
      return () => clearTimeout(t)
    }

    const delay = CUSTOM_DELAYS[msg.id] ?? 2000
    const typingShowDelay = Math.max(0, delay - 3000)

    /* Mostra o typing bubble 3s antes de revelar a mensagem */
    const tTyping = setTimeout(() => {
      setIsTyping(true)
      setIsTypingAudio(msg.type === "audio")
    }, typingShowDelay)

    const t = setTimeout(() => {
      setIsTyping(false)
      setIsTypingAudio(false)
      setVisibleMessages(p => [...p, msg])

      if (msg.type === "audio") {
        setQueueIndex(i => i + 1)
        if (msg.longDelay) {
          const lt = setTimeout(() => {
            setQueue(BLOCK_6)
            setQueueIndex(0)
            setDone(false)
          }, 725_000)
          return () => clearTimeout(lt)
        }
        return
      }

      if (msg.longDelay) {
        const lt = setTimeout(() => {
          setQueue(BLOCK_6)
          setQueueIndex(0)
          setDone(false)
        }, 725_000)
        return () => clearTimeout(lt)
      }

      setQueueIndex(i => i + 1)
    }, delay)
    return () => { clearTimeout(tTyping); clearTimeout(t) }
  }, [queueIndex, waitingForOption, waitingForButtonClick, waitingForTextInput, queue])

  /* Chamado pelo AudioBubble quando o play realmente começa.
     Aguarda o tempo restante do audio antes de liberar a proxima mensagem. */
  const audioReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleAudioPlayStarted() {
    if (!waitingForAudioPlay) return
    const pending = pendingAudioDelayRef.current
    if (!pending) { setWaitingForAudioPlay(false); return }
    /* O delay configurado (ex: 15000ms) representa a duração do áudio.
       Iniciamos esse timer agora que o usuário deu play. */
    if (audioReleaseTimerRef.current) clearTimeout(audioReleaseTimerRef.current)
    audioReleaseTimerRef.current = setTimeout(() => {
      pendingAudioDelayRef.current = null
      setWaitingForAudioPlay(false)
    }, pending.delay)
  }

  function handleTextSubmit() {
    const val = textInputValue.trim()
    if (!val || !waitingForTextInput) return
    /* Bloco 18 (PIX) e carregado quando questionCount === 16
       Bloco 16 (texto livre) e carregado quando questionCount === 15 */
    if (questionCount === 17) {
      /* Este input e a chave PIX — salva imediatamente */
      leadPixRef.current = val
      setLeadPix(val)
      track("text_input", "pix", val)
    } else if (!leadNome) {
      setLeadNome(val)
      track("text_input", "nome", val)
    } else {
      track("text_input", "livre", val)
    }
    setVisibleMessages(p => [...p, { id: Date.now(), type: "user-bubble", content: val }])
    setTextInputValue("")
    setWaitingForTextInput(false)
    setQuestionCount(q => {
      const nextQ = q + 1
      let nextBlock = NEXT_BLOCKS[nextQ]
      /* Substitui {pix} no BLOCK_19 usando o val capturado neste fechamento.
         Usa q (valor real do updater) em vez de questionCount (stale closure).
         BLOCK_18 (user-input PIX) e carregado em nextQ=18, entao q=17 quando o lead digita */
      if (nextBlock && q === 17) {
        nextBlock = nextBlock.map(msg =>
          msg.content?.includes("{pix}")
            ? { ...msg, content: msg.content.replace("{pix}", val) }
            : msg
        )
      }
      /* Define o placeholder correto para o proximo input
         nextQ=15 → carrega BLOCK_16 que tem user-input "texto livre"
         nextQ=16 ��� botao "Sacar Agora" clicado → carrega BLOCK_18 que tem user-input PIX
      */
      track("block", String(nextQ))
      if (nextBlock && nextBlock.length > 0) {
        setQueue(nextBlock)
        setQueueIndex(0)
        setDone(false)
      } else {
        setDone(true)
      }
      return nextQ
    })
  }

  function handleButtonClick(content?: string) {
    if (!waitingForButtonClick) return
    /* Desbloqueia o audio SINCRONICAMENTE neste clique do usuario.
       A partir daqui todos os audios do funil tocam automaticamente. */
    ensureUnlocked()
    track("button_click", content ?? "user-bubble")
    /* Botao de cadastro redireciona para o checkout */
    if (content === "QUERO FAZER MEU CADASTRO") {
      track("checkout_click", content)
      window.open("https://go.perfectpay.com.br/PPU38CQD06J", "_blank")
      setWaitingForButtonClick(false)
      return
    }
    setWaitingForButtonClick(false)
    const nextQ = questionCount + 1
    setQuestionCount(nextQ)
    const nextBlock = NEXT_BLOCKS[nextQ]
    if (nextBlock && nextBlock.length > 0) {
      setQueue(nextBlock)
      setQueueIndex(0)
      setDone(false)
    } else {
      setDone(true)
    }
  }

  function handleOptionClick(opt: string, msgId: number) {
    if (!waitingForOption) return
    /* Desbloqueia o audio SINCRONICAMENTE neste clique do usuario */
    ensureUnlocked()
    /* Mantem a mensagem de options (com a pergunta) e adiciona a resposta do usuario logo apos */
    setVisibleMessages(p => [
      ...p,
      { id: Date.now(), type: "user-bubble", content: opt },
    ])
    setWaitingForOption(false)
    track("option_click", opt)
    /* Checkout direto */
    if (opt === "QUERO FAZER MEU CADASTRO!" || opt === "QUERO FAZER MEU CADASTRO") {
      track("checkout_click", opt)
      window.open("https://go.perfectpay.com.br/PPU38CQD06J", "_blank")
      return
    }
    /* Explica o motivo da taxa antes de redirecionar */
    if (opt === "POR QUE DEVO PAGAR?") {
      track("option_click", opt)
      setQueue(BLOCK_21)
      setQueueIndex(0)
      setDone(false)
      setQuestionCount(q => q + 1)
      return
    }
    /* Opcao especial: corrigir chave pix - volta ao input sem avancar o funil */
    if (opt === "Corrigir Chave PIX") {
      setLeadPix("")
      setQueue(BLOCK_19_CORRIGIR)
      setQueueIndex(0)
      setDone(false)
      return
    }
    setQuestionCount(q => {
      const nextQ = q + 1
      const nextBlock = NEXT_BLOCKS[nextQ]
      if (nextBlock && nextBlock.length > 0) {
        setQueue(nextBlock)
        setQueueIndex(0)
        setDone(false)
      } else {
        setDone(true)
      }
      return nextQ
    })
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }

        .wa-shell {
          display: flex;
          height: 100dvh;
          width: 100%;
          background: #f0f2f5;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .wa-chat-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
        }

        /* ── Header ── */
        .wa-header {
          display: flex;
          align-items: center;
          background: #075e54;
          padding: 10px 16px;
          gap: 12px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .wa-header-avatar {
          width: 40px; height: 40px;
          border-radius: 50%; overflow: hidden;
          flex-shrink: 0; cursor: pointer;
        }
        .wa-header-name { flex: 1; }
        .wa-header-name span {
          display: block; font-size: 16px;
          font-weight: 600; color: #fff;
          line-height: 1.2;
        }
        .wa-header-name small {
          font-size: 12px; color: rgba(255,255,255,0.75);
        }
        .wa-verified {
          display: inline-block;
          width: 14px; height: 14px;
          background: #4fc3f7;
          border-radius: 50%;
          margin-left: 4px;
          vertical-align: middle;
          position: relative;
        }
        .wa-verified::after {
          content: '';
          position: absolute; inset: 3px;
          border-bottom: 2px solid #fff;
          border-right: 2px solid #fff;
          transform: rotate(45deg) translate(-1px, -2px);
        }
        .wa-header-actions { display: flex; gap: 18px; }
        .wa-header-actions button {
          background: none; border: none;
          cursor: pointer; padding: 0;
          color: #fff; display: flex;
          align-items: center;
        }

        /* ── Area de mensagens ── */
        .wa-messages-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          background-color: #efeae2;
          background-image: url('/wa-bg.png');
          background-size: 400px auto;
          background-repeat: repeat;
          padding: 12px 16px 8px;
          scroll-behavior: smooth;
        }
        .wa-messages-area::-webkit-scrollbar { width: 6px; }
        .wa-messages-area::-webkit-scrollbar-track { background: transparent; }
        .wa-messages-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }

        /* ── Conta comercial ── */
        .wa-commercial-badge {
          text-align: center; margin: 8px 0 16px;
        }
        .wa-commercial-badge span {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(0,0,0,0.1); border-radius: 99px;
          padding: 5px 14px; font-size: 12px; color: #555;
        }

        /* ── Animacao de entrada das bolhas ── */
        @keyframes wa-msg-in-left {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wa-msg-in-right {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wa-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Bolhas da Julia ── */
        .wa-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          margin-bottom: 2px;
          animation: wa-msg-in-left 0.25s cubic-bezier(0.2, 0, 0.2, 1) both;
        }
        .wa-avatar {
          width: 36px; height: 36px;
          border-radius: 50%; overflow: hidden;
          flex-shrink: 0;
        }
        .wa-bubble-left {
          background: #fff;
          border-radius: 0 8px 8px 8px;
          padding: 8px 12px;
          max-width: 72%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
          position: relative;
        }
        .wa-bubble-left p {
          font-size: 14.5px;
          color: #111;
          line-height: 1.55;
        }
        .wa-msg-time {
          font-size: 11px;
          color: #667781;
          font-family: 'Inter', sans-serif;
          margin-top: 2px;
        }

        /* ── Bolhas do usuario ── */
        .wa-bubble-right-wrap {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 2px;
          animation: wa-msg-in-right 0.25s cubic-bezier(0.2, 0, 0.2, 1) both;
        }
        .wa-bubble-right {
          background: #d9fdd3;
          border-radius: 8px 0 8px 8px;
          padding: 8px 12px;
          max-width: 72%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
        }
        .wa-bubble-right p {
          font-size: 14.5px;
          color: #111;
          line-height: 1.55;
        }
        .wa-ts-row {
          display: flex; align-items: center;
          justify-content: flex-end; gap: 4px;
          margin-top: 2px;
        }

        /* ── CTA clicavel ── */
        .wa-bubble-cta {
          background: #25d366 !important;
          transition: background 0.2s ease;
        }
        .wa-bubble-cta p { color: #fff !important; }
        .wa-bubble-cta .wa-msg-time { color: rgba(255,255,255,0.75) !important; }

        /* ── Opcoes ── */
        .wa-options-wrap {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          margin: 4px 0 8px;
          animation: wa-fade-in 0.3s ease both;
        }
        .wa-option-btn {
          background: #d9fdd3;
          border: 1.5px solid #128c7e;
          border-radius: 20px;
          padding: 10px 22px;
          font-size: 14px;
          font-weight: 500;
          color: #075e54;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background 0.18s ease, opacity 0.18s ease, transform 0.15s ease;
        }
        .wa-option-btn:hover:not(:disabled) { background: #c5f5be; transform: scale(1.02); }
        .wa-option-btn:active:not(:disabled) { transform: scale(0.98); }
        .wa-option-btn:disabled { opacity: 0.4; cursor: default; }

        /* ── Audio bubble ── */
        .wa-audio-bubble {
          background: #fff;
          border-radius: 0 8px 8px 8px;
          padding: 10px 14px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
          min-width: 220px; max-width: 280px;
        }
        .wa-audio-btn {
          width: 34px; height: 34px; border-radius: 50%;
          background: #f0f0f0; border: none;
          cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wa-audio-track {
          flex: 1; height: 3px;
          background: #d0d0d0; border-radius: 99px;
          position: relative; overflow: hidden;
        }
        .wa-audio-fill {
          position: absolute; left: 0; top: 0;
          height: 100%; background: #128c7e;
          border-radius: 99px;
          transition: width 0.2s linear;
        }

        /* ── Typing ── */
        .wa-typing-row {
          display: flex; align-items: flex-end;
          gap: 6px; margin-bottom: 6px;
          animation: wa-msg-in-left 0.2s cubic-bezier(0.2, 0, 0.2, 1) both;
        }
        .wa-typing-bubble {
          background: #fff;
          border-radius: 0 8px 8px 8px;
          padding: 12px 16px;
          display: flex; align-items: center; gap: 5px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12);
        }
        @keyframes wa-dot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30%            { opacity: 1;   transform: translateY(-5px); }
        }
        .wa-dot {
          display: inline-block;
          width: 7px; height: 7px;
          background: #90a4ae; border-radius: 50%;
          animation: wa-dot 1.2s ease-in-out infinite;
        }
        @keyframes wa-wave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
          50%       { transform: scaleY(1.4); opacity: 1; }
        }
        .wa-audio-typing {
          display: flex; align-items: center; gap: 3px;
          padding: 10px 14px;
        }
        .wa-wave {
          display: inline-block;
          width: 3px; height: 16px;
          background: #128c7e; border-radius: 99px;
          animation: wa-wave 0.9s ease-in-out infinite;
        }

        /* ── CTA Button ── */
        .wa-cta-button {
          width: calc(100% - 32px);
          margin: 0 16px;
          background: #25d366;
          border: none;
          border-radius: 8px;
          padding: 16px 0;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.06em;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        /* ── Barra inferior ─�� */
        .wa-footer {
          background: #f0f2f5;
          padding: 10px 16px;
          flex-shrink: 0;
        }
        .wa-footer-inner {
          display: flex; align-items: center;
          background: #fff;
          border-radius: 24px;
          padding: 10px 18px;
          gap: 10px;
        }
        .wa-footer-inner span {
          flex: 1; font-size: 15px;
          color: #aaa;
          font-family: 'Inter', sans-serif;
          user-select: none;
        }
        .wa-text-input {
          flex: 1; border: none; outline: none;
          /* font-size >= 16px previne zoom automatico no iOS ao focar */
          font-size: 16px; color: #111;
          font-family: 'Inter', sans-serif;
          background: transparent;
        }
        .wa-text-input::placeholder { color: #aaa; }
        .wa-send-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          background: #075e54;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .wa-send-btn:disabled { opacity: 0.4; cursor: default; }
        .wa-send-btn-active {
          background: #25d366;
          box-shadow: 0 2px 8px rgba(37,211,102,0.4);
        }

        .wa-footer-active .wa-footer-inner {
          border-top: 2px solid #e5e5e5;
        }

        /* Hint "Toque aqui para responder" acima do input */
        .wa-input-hint {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: #25D366; font-weight: 600;
          padding: 0 6px 6px 6px;
          animation: wa-hint-fade 1.6s ease-in-out infinite alternate;
        }
        @keyframes wa-hint-fade {
          from { opacity: 0.6; }
          to   { opacity: 1; }
        }

        /* Pulso sutil no contorno do input enquanto aguarda toque */
        @keyframes wa-pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(37,211,102,0.0); }
          50%       { box-shadow: 0 0 0 3px rgba(37,211,102,0.35); }
        }
        .wa-footer-pulse {
          animation: wa-pulse-border 1.8s ease-in-out infinite;
        }
        .wa-footer-pulse:focus-within {
          animation: none;
          box-shadow: 0 0 0 2px rgba(37,211,102,0.5);
        }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .wa-messages-area { background-size: 280px auto; padding: 10px 10px 6px; }
          .wa-bubble-left, .wa-bubble-right { max-width: 85%; }
          .wa-audio-bubble { min-width: 180px; }
          .wa-header { padding: 8px 12px; }
          .wa-cta-button { width: calc(100% - 24px); margin: 0 12px; }
        }
      `}</style>

      {/* Aguarda hydration para evitar mismatch SSR/cliente */}
      {!mounted ? (
        <div style={{ background: "#efeae2", minHeight: "100dvh" }} />
      ) : (
      <div className="wa-shell">
        <main className="wa-chat-panel">

          {/* ── Header ── */}
          <header className="wa-header">
            <div className="wa-header-avatar">
              <Image src={ATENDENTE_FOTO} alt={ATENDENTE_NOME} width={40} height={40} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
            </div>
            <div className="wa-header-name">
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {ATENDENTE_NOME}
                {/* Selo verificado verde */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#25d366" aria-label="Verificado">
                  <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
                </svg>
              </span>
              <small>{isTyping ? (isTypingAudio ? "gravando audio..." : "digitando...") : "Verificado"}</small>
            </div>
            <div className="wa-header-actions">
              <button aria-label="Video"><Video size={20} /></button>
              <button aria-label="Ligar"><Phone size={20} /></button>
              <button aria-label="Menu"><MoreVertical size={20} /></button>
            </div>
          </header>

          {/* ── Mensagens ── */}
          <div className="wa-messages-area" role="log" aria-live="polite">
            <div className="wa-commercial-badge">
              <span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                Esta e uma conta comercial
              </span>
            </div>

            {visibleMessages.map((msg, index) => {
              const nomeExibido = leadNome || nome
              const pixExibido = leadPixRef.current || leadPix || "—"
              const text = (msg.content || "")
                .replace("{nome}", nomeExibido)
                .replace("{pix}", pixExibido)

              /* Determina se e a ultima mensagem consecutiva do bot */
              const isBotMsg = msg.type !== "user-bubble" && msg.type !== "options" && msg.type !== "cta-button"
              const nextMsg = visibleMessages[index + 1]
              const nextIsBotMsg = nextMsg && nextMsg.type !== "user-bubble" && nextMsg.type !== "options" && nextMsg.type !== "cta-button"
              const isLastInGroup = isBotMsg && !nextIsBotMsg

              if (msg.type === "options") {
                const pergunta = msg.content
                  ? (msg.content).replace("{nome}", leadNome || nome).replace("{pix}", leadPixRef.current || leadPix || "—")
                  : null
                /* Verifica se ja ha uma resposta do usuario apos esta pergunta */
                const jaRespondida = visibleMessages.slice(index + 1).some(m => m.type === "user-bubble")
                return (
                  <div key={msg.id}>
                    {pergunta && (
                      <div className="wa-msg-row" style={{ alignItems: "flex-end", marginBottom: 6 }}>
                        <div className="wa-avatar" style={{ flexShrink: 0 }}>
                          <Image src={ATENDENTE_FOTO} alt={ATENDENTE_NOME} width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                        </div>
                        <div className="wa-bubble-left">
                          <p style={{ whiteSpace: "pre-line" }}>{pergunta}</p>
                          <div className="wa-msg-time">{time}</div>
                        </div>
                      </div>
                    )}
                    {!jaRespondida && (
                      <div className="wa-options-wrap">
                        {msg.options?.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleOptionClick(opt, msg.id)}
                            disabled={!waitingForOption}
                            className="wa-option-btn"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              if (msg.type === "cta-button") return null

              if (msg.type === "user-bubble") {
                /* Clicavel se estiver aguardando clique E for o user-bubble mais recente da lista */
                const lastUserBubble = [...visibleMessages].reverse().find(m => m.type === "user-bubble")
                const isClickable = waitingForButtonClick && lastUserBubble?.id === msg.id
                return (
                  <div key={msg.id} className="wa-bubble-right-wrap" style={{ marginTop: 4, marginBottom: 4 }}>
                    <div
                      className={`wa-bubble-right${isClickable ? " wa-bubble-cta" : ""}`}
                      onClick={isClickable ? () => handleButtonClick(msg.content) : undefined}
                      role={isClickable ? "button" : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                      onKeyDown={isClickable ? (e) => e.key === "Enter" && handleButtonClick(msg.content) : undefined}
                      style={{ cursor: isClickable ? "pointer" : "default" }}
                    >
                      <p>{text}</p>
                      {isClickable && (
                        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 2, fontWeight: 500 }}>
                          Toque para iniciar
                        </p>
                      )}
                      <div className="wa-ts-row">
                        <span className="wa-msg-time">{time}</span>
                        {!isClickable && (
                          <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                            <path d="M1 5.5L5 9.5L15 1.5" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M5 5.5L9 9.5L15 1.5" stroke="#53bdeb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }

              /* Mensagens do bot — avatar so na ultima da sequencia */
              return (
                <div key={msg.id} className="wa-msg-row" style={{ alignItems: "flex-end" }}>
                  <div className="wa-avatar" style={{ visibility: isLastInGroup ? "visible" : "hidden", flexShrink: 0 }}>
                    <Image src={ATENDENTE_FOTO} alt={ATENDENTE_NOME} width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  </div>
                  {msg.type === "audio" ? (
                    <AudioBubble duration={msg.duration!} audioSrc={msg.audioSrc} autoPlay={!restoredMsgIds.current.has(msg.id)} onPlayStarted={handleAudioPlayStarted} />
                  ) : msg.type === "video" ? (
                    <VturbBubble time={time} variant="video1" />
                  ) : msg.type === "video2" ? (
                    <VturbBubble time={time} variant="video2" />
                  ) : msg.type === "video3" ? (
                    <VturbBubble time={time} variant="video3" />
                  ) : msg.type === "video4" ? (
                    <VturbBubble time={time} variant="video4" />
                  ) : msg.type === "image" ? (
                    <div style={{ background: "#fff", borderRadius: "0 8px 8px 8px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.12)", maxWidth: "min(280px, 80vw)" }}>
                      <Image src={msg.content!} alt="Produto" width={280} height={200} style={{ objectFit: "cover", width: "100%", height: "auto", display: "block" }} />
                      <div className="wa-msg-time" style={{ padding: "2px 10px 6px", textAlign: "right" }}>{time}</div>
                    </div>
                  ) : (
                    <div className="wa-bubble-left">
                      <p style={{ whiteSpace: "pre-line" }}>{text}</p>
                      <div className="wa-msg-time">{time}</div>
                    </div>
                  )}
                </div>
              )
            })}

            {isTyping && <TypingBubble isAudio={isTypingAudio} />}
            <div ref={bottomRef} />
          </div>

          {/* ── CTA fixo ── */}
          {showCta && (
            <div style={{ padding: "8px 0", background: "#f0f2f5" }}>
              <button className="wa-cta-button">QUERO PAGAR A TAXA</button>
            </div>
          )}

          {/* ── Barra inferior ── */}
          <input
            ref={ghostInputRef}
            aria-hidden="true"
            tabIndex={-1}
            readOnly
            style={{ position: "fixed", top: "-9999px", left: "-9999px", opacity: 0, width: "1px", height: "1px", fontSize: "16px" }}
          />
          <div className="wa-footer">
            {waitingForTextInput ? (
              <>
                {/* Hint discreto acima do input — some ao focar */}
                <div className="wa-input-hint">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#25D366"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                  Toque aqui para responder
                </div>
                <form
                  className="wa-footer-inner wa-footer-pulse"
                  onSubmit={(e) => { e.preventDefault(); handleTextSubmit() }}
                >
                <input
                  ref={textInputRef}
                  className="wa-text-input"
                  type="text"
                  inputMode="text"
                  placeholder={textInputPlaceholder}
                  value={textInputValue}
                  onChange={(e) => setTextInputValue(e.target.value)}
                  onTouchStart={openKeyboard}
                  maxLength={40}
                  aria-label="Digite seu nome"
                />
                <button
                  type="submit"
                  className="wa-send-btn wa-send-btn-active"
                  aria-label="Enviar"
                  disabled={!textInputValue.trim()}
                  /* preventDefault no pointerdown impede o input de perder foco:
                     o teclado nao fecha e o envio dispara no mesmo toque */
                  onPointerDown={(e) => {
                    if (!textInputValue.trim()) return
                    e.preventDefault()
                    handleTextSubmit()
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </form>
              </>
            ) : (
              <div className="wa-footer-inner">
                <span>Selecione uma opcao acima...</span>
                <button className="wa-send-btn" aria-label="Enviar" disabled>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

        </main>
      </div>
      )} {/* fim do bloco mounted */}
    </>
  )
}
