"use client";

import { useMemo, useState } from "react";
import { T, useLang, Bi } from "./lang";

/**
 * The distribution problem, made interactive. A market draws a wealth curve;
 * tax and transfer redraw it. Move the sliders and watch the Lorenz curve bend
 * and the Gini coefficient fall — the live argument between innovation and fairness.
 */

const DECILES = 10;

/** raw market shares from a concentration exponent k (higher = more top-heavy). */
function marketShares(k: number): number[] {
  const raw = Array.from({ length: DECILES }, (_, i) => Math.pow(i + 1, k));
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((v) => v / sum);
}

/** blend toward perfectly equal (0.1 each) by redistribution fraction r. */
function redistribute(shares: number[], r: number): number[] {
  const eq = 1 / DECILES;
  return shares.map((s) => (1 - r) * s + r * eq);
}

/** Gini from grouped, equal-population deciles. */
function gini(shares: number[]): number {
  let cum = 0;
  let g = 0;
  let prev = 0;
  for (let k = 0; k < DECILES; k++) {
    cum += shares[k];
    g += (1 / DECILES) * (cum + prev);
    prev = cum;
  }
  return Math.max(0, 1 - g);
}

/** cumulative Lorenz points incl. origin. */
function lorenz(shares: number[]): [number, number][] {
  const pts: [number, number][] = [[0, 0]];
  let cum = 0;
  for (let k = 0; k < DECILES; k++) {
    cum += shares[k];
    pts.push([(k + 1) / DECILES, cum]);
  }
  return pts;
}

const PRESETS: { key: string; label: Bi; k: number; r: number; accent: string }[] = [
  { key: "feudal", label: { en: "Feudal / caste", zh: "封建 / 种姓" }, k: 4.4, r: 0, accent: "#ff6f91" },
  { key: "capitalist", label: { en: "Market capitalism", zh: "市场资本主义" }, k: 3.0, r: 0.18, accent: "#e3b24f" },
  { key: "mixed", label: { en: "Mixed economy", zh: "混合经济" }, k: 2.6, r: 0.42, accent: "#3fd1c7" },
  { key: "social", label: { en: "Social democracy", zh: "社会民主" }, k: 2.4, r: 0.62, accent: "#5b8cff" },
];

export default function WealthLab() {
  const { lang } = useLang();
  const [k, setK] = useState(3.0);
  const [r, setR] = useState(0.2);

  const { market, after, giniMarket, giniAfter, lorMarket, lorAfter, top10, bottom50, top10A, bottom50A } = useMemo(() => {
    const market = marketShares(k);
    const after = redistribute(market, r);
    return {
      market,
      after,
      giniMarket: gini(market),
      giniAfter: gini(after),
      lorMarket: lorenz(market),
      lorAfter: lorenz(after),
      top10: market[DECILES - 1],
      bottom50: market.slice(0, 5).reduce((a, b) => a + b, 0),
      top10A: after[DECILES - 1],
      bottom50A: after.slice(0, 5).reduce((a, b) => a + b, 0),
    };
  }, [k, r]);

  // SVG geometry
  const S = 300, pad = 0;
  const px = (x: number) => x * S;
  const py = (y: number) => S - y * S;
  const path = (pts: [number, number][]) => pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${px(x).toFixed(1)} ${py(y).toFixed(1)}`).join(" ");
  const areaAfter = `${path(lorAfter)} L ${S} ${S} L 0 ${S} Z`;

  const pct = (v: number) => `${(v * 100).toFixed(0)}%`;
  const giniLabel = (g: number) => (g < 0.25 ? { en: "very equal", zh: "非常平等" } : g < 0.38 ? { en: "moderate", zh: "中等" } : g < 0.5 ? { en: "high", zh: "偏高" } : { en: "extreme", zh: "极端" });

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <div className="label-mono">{lang === "zh" ? "洛伦兹曲线 · 基尼系数" : "Lorenz curve · Gini coefficient"}</div>
      <h3 className="display mt-1 text-2xl text-ink-50">
        <T v={{ en: "Who owns how much", zh: "谁占有多少" }} />
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-[320px_1fr]">
        {/* Lorenz chart */}
        <div>
          <svg viewBox={`-34 -10 ${S + 50} ${S + 44}`} className="block w-full">
            {/* frame */}
            <rect x="0" y="0" width={S} height={S} fill="#070d19" stroke="#11203c" strokeWidth="1" />
            {[0.25, 0.5, 0.75].map((g) => (
              <g key={g}>
                <line x1={px(g)} y1="0" x2={px(g)} y2={S} stroke="#0e1a30" strokeWidth="0.7" />
                <line x1="0" y1={py(g)} x2={S} y2={py(g)} stroke="#0e1a30" strokeWidth="0.7" />
              </g>
            ))}
            {/* line of perfect equality */}
            <line x1="0" y1={S} x2={S} y2="0" stroke="#7d89a8" strokeWidth="1" strokeDasharray="3 4" />
            {/* gini area (after) */}
            <path d={areaAfter} fill="#5b8cff" fillOpacity="0.10" />
            {/* market curve (before) */}
            <path d={path(lorMarket)} fill="none" stroke="#ff6f91" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.8" />
            {/* after curve */}
            <path d={path(lorAfter)} fill="none" stroke="#5b8cff" strokeWidth="2.4" />
            {lorAfter.map(([x, y], i) => (
              <circle key={i} cx={px(x)} cy={py(y)} r="2.4" fill="#8aadff" />
            ))}
            {/* axis labels */}
            <text x={S / 2} y={S + 30} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#7d89a8">
              <tspan className={lang === "zh" ? "zh" : ""}>{lang === "zh" ? "人口（由贫到富）→" : "population (poorest → richest) →"}</tspan>
            </text>
            <text x="-22" y={S / 2} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9" fill="#7d89a8" transform={`rotate(-90 -22 ${S / 2})`}>
              <tspan className={lang === "zh" ? "zh" : ""}>{lang === "zh" ? "累计财富份额 →" : "cumulative wealth share →"}</tspan>
            </text>
          </svg>
          <div className="mt-2 flex items-center justify-center gap-5 font-mono text-[0.6rem] text-ink-500">
            <span className="flex items-center gap-1.5"><span className="inline-block h-[2px] w-4" style={{ background: "#ff6f91" }} /> {lang === "zh" ? "市场（税前）" : "market (pre-tax)"}</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-[2px] w-4" style={{ background: "#5b8cff" }} /> {lang === "zh" ? "再分配后" : "after redistribution"}</span>
          </div>
        </div>

        {/* controls + readouts */}
        <div>
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <div>
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-rose-400">{lang === "zh" ? "税前基尼" : "Pre-tax Gini"}</div>
              <div className="display text-4xl text-rose-400">{giniMarket.toFixed(2)}</div>
            </div>
            <div className="text-2xl text-ink-500">→</div>
            <div>
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-azure-400">{lang === "zh" ? "再分配后基尼" : "After-tax Gini"}</div>
              <div className="display text-5xl text-azure-400">{giniAfter.toFixed(2)} <span key={lang} className={`lang-fade text-base text-ink-500 ${lang === "zh" ? "zh" : ""}`}>· {giniLabel(giniAfter)[lang]}</span></div>
            </div>
          </div>

          <div className="mt-7 space-y-6">
            <label className="block">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-300"><T v={{ en: "Market concentration", zh: "市场集中度" }} /></span>
                <span className="font-mono text-xs text-ink-500">{k.toFixed(1)}</span>
              </div>
              <input type="range" min={1} max={5} step={0.1} value={k} onChange={(e) => setK(parseFloat(e.target.value))} className="mt-2 w-full accent-[#ff6f91]" />
              <div className="mt-1 font-mono text-[0.58rem] text-ink-500"><T v={{ en: "how top-heavy the economy draws the curve before tax", zh: "税前，经济把曲线画得有多向顶端倾斜" }} /></div>
            </label>

            <label className="block">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-300"><T v={{ en: "Redistribution", zh: "再分配" }} /></span>
                <span className="font-mono text-xs text-ink-500">{pct(r)}</span>
              </div>
              <input type="range" min={0} max={0.85} step={0.01} value={r} onChange={(e) => setR(parseFloat(e.target.value))} className="mt-2 w-full accent-[#5b8cff]" />
              <div className="mt-1 font-mono text-[0.58rem] text-ink-500"><T v={{ en: "tax-and-transfer reshaping toward an equal share", zh: "税收与转移，朝向均等份额的再塑形" }} /></div>
            </label>
          </div>

          {/* before/after stats */}
          <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="border-b border-ink-100/8 pb-1.5">
              <div className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-500"><T v={{ en: "Top 10% own", zh: "最富 10% 占有" }} /></div>
              <div className="mt-0.5"><span className="text-rose-400">{pct(top10)}</span> <span className="text-ink-500">→</span> <span className="text-azure-300">{pct(top10A)}</span></div>
            </div>
            <div className="border-b border-ink-100/8 pb-1.5">
              <div className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-ink-500"><T v={{ en: "Bottom 50% own", zh: "最贫 50% 占有" }} /></div>
              <div className="mt-0.5"><span className="text-rose-400">{pct(bottom50)}</span> <span className="text-ink-500">→</span> <span className="text-azure-300">{pct(bottom50A)}</span></div>
            </div>
          </div>

          {/* presets */}
          <div className="mt-6 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => { setK(p.k); setR(p.r); }}
                className="rounded-full border border-ink-100/20 px-3 py-1 font-mono text-[0.64rem] text-ink-300 transition hover:text-ink-50"
                style={{ borderColor: `${p.accent}55` }}
              >
                <span className={lang === "zh" ? "zh" : ""}>{p.label[lang]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-3xl font-serif text-sm leading-relaxed text-ink-300">
        <T v={{
          en: "No setting is free. Push redistribution to the top and the curve nears the diagonal of perfect equality — but real economies find the engine of innovation strains long before that. Push it to zero and the market's natural drift toward concentration runs unchecked. Every society lives somewhere on this curve, and keeps choosing where.",
          zh: "没有一个设定是免费的。把再分配推到顶端，曲线便逼近那条完全平等的对角线——但现实经济会发现，远在抵达之前，创新的引擎便已吃力。把它推到零，市场朝向集中的自然漂移便不受制约地运转。每一个社会都活在这条曲线上的某处，并不断地，重新选择那一处。",
        }} />
      </p>
    </div>
  );
}
