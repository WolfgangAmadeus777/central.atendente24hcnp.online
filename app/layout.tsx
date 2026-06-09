import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'Promoção Oficial — Edição Limitada',
  description: 'Você pode ter sido pré-selecionado! Confira em menos de 30 segundos.',
  generator: 'v0.app',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-[#ede8e3]" style={{ fontFamily: inter.style.fontFamily }}>
      <head>
        {/* Performance hints para o player Vturb (VSL do BLOCK_5) */}
        <script dangerouslySetInnerHTML={{ __html: `!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);` }} />
        <link rel="preload" href="https://scripts.converteai.net/fc03d803-4795-4f47-92b9-4396de05022e/players/6a23758dcf5b757b7649c7b9/v4/player.js" as="script" />
        <link rel="preload" href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js" as="script" />
        <link rel="preload" href="https://cdn.converteai.net/fc03d803-4795-4f47-92b9-4396de05022e/6a23758869bed66a519f6cd3/main.m3u8" as="fetch" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.converteai.net" />
        <link rel="dns-prefetch" href="https://scripts.converteai.net" />
        <link rel="dns-prefetch" href="https://images.converteai.net" />
        <link rel="dns-prefetch" href="https://license.vturb.com" />
      </head>
      <body className="antialiased" style={{ fontFamily: inter.style.fontFamily }}>
        {/* Google tag (gtag.js) — Google Ads AW-18191867611 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18191867611"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag-1" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18191867611');
          `}
        </Script>
        {/* Google tag (gtag.js) — Google Ads AW-18191789336 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18191789336"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag-2" strategy="afterInteractive">
          {`
            gtag('config', 'AW-18191789336');
          `}
        </Script>
        {/* Google tag (gtag.js) — Google Ads AW-18191872933 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18191872933"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag-3" strategy="afterInteractive">
          {`
            gtag('config', 'AW-18191872933');
          `}
        </Script>
        {/* Google tag (gtag.js) — Google Ads AW-18191882746 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18191882746"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag-4" strategy="afterInteractive">
          {`
            gtag('config', 'AW-18191882746');
          `}
        </Script>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
