import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const TITLE_EN = "Equality Engine — The Nature of Equality, Justice, Power, Rights & Civilizational Coordination";
const TITLE_ZH = "平等引擎 · 平等、正义、权力、权利与文明协调的本质";
const DESC =
  "A civilization-scale, fully bilingual exploration of equality, inequality, hierarchy, justice, rights, power, opportunity and the coordination systems that hold complex societies together. From the egalitarian forager band to caste, democracy, capitalism, social democracy and AI-governed futures — equality is treated not as a slogan but as a deep structural problem spanning biology, psychology, economics, law, technology and governance.";

export const metadata: Metadata = {
  metadataBase: new URL("https://equality-engine.psyverse.fun"),
  title: `${TITLE_EN} | ${TITLE_ZH}`,
  description: DESC,
  keywords: [
    "equality", "inequality", "justice", "fairness", "hierarchy", "rights", "human rights", "power",
    "opportunity", "social mobility", "meritocracy", "wealth distribution", "Gini coefficient",
    "redistribution", "universal basic income", "democracy", "capitalism", "socialism", "social democracy",
    "caste", "aristocracy", "rule of law", "legal equality", "citizenship", "algorithmic bias",
    "digital inequality", "AI governance", "surveillance", "post-scarcity", "decentralization",
    "civilizational coordination", "political philosophy", "economics", "the ultimatum game",
    "平等", "不平等", "正义", "公平", "等级", "权利", "人权", "权力", "机会", "社会流动", "贤能制",
    "财富分配", "基尼系数", "再分配", "全民基本收入", "民主", "资本主义", "社会主义", "社会民主",
    "种姓", "贵族制", "法治", "法律平等", "公民身份", "算法偏见", "数字不平等", "AI 治理", "监控",
    "后稀缺", "去中心化", "文明协调", "政治哲学", "经济学", "最后通牒博弈",
  ],
  authors: [{ name: "Gewenbo", url: "https://psyverse.fun" }],
  alternates: { canonical: "/", languages: { en: "/", "zh-CN": "/", "x-default": "/" } },
  openGraph: {
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Equality Engine · 平等引擎 — The Nature of Equality, Justice, Power, Rights & Civilizational Coordination" }],
    title: TITLE_EN,
    description:
      "Absolute equality may be impossible; absolute inequality is unstable. A bilingual atlas of how civilizations negotiate fairness, dignity, opportunity, coordination and the distribution of power — across biology, law, economics, technology and AI.",
    url: "https://equality-engine.psyverse.fun/",
    siteName: "Psyverse",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
  },
  twitter: {
    images: ["/twitter-image.png"],
    card: "summary_large_image",
    title: TITLE_EN,
    description: "Equality is not everyone becoming identical. It is balanced coordination, fair participation, dignity and constrained power — the deepest structural problem a civilization solves, and re-solves.",
  },
  robots: { index: true, follow: true },
  other: { "theme-color": "#050810" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Serif+SC:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: TITLE_EN,
              alternateName: TITLE_ZH,
              description: DESC,
              url: "https://equality-engine.psyverse.fun/",
              inLanguage: ["en", "zh-CN"],
              author: { "@type": "Person", name: "Gewenbo", url: "https://psyverse.fun/" },
              publisher: { "@type": "Organization", name: "Psyverse", url: "https://psyverse.fun/" },
            }),
          }}
        />
      </head>
      <body className="bg-void-950 text-ink-100 antialiased">
        {children}
        <Script src="https://analytics-dashboard-two-blue.vercel.app/tracker.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
