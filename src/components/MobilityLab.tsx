"use client";

import { useMemo, useState } from "react";
import { useLang, T, type Bi } from "./lang";
import { ACCENT } from "./content";

/**
 * MobilityLab — intergenerational social-mobility simulator.
 *
 * Models 5 income quintiles (Q1 bottom … Q5 top). A child's destination
 * quintile depends on the parent's origin plus three forces:
 *   - inherited advantage (stickiness around the diagonal)
 *   - education access (an upward + middle-ward leveling drift)
 *   - luck / networks (random spread that widens the kernel)
 *
 * A real 5×5 row-stochastic transition matrix P(destination | origin) is
 * computed from the sliders. Everything downstream reads from this matrix.
 */

type Preset = "rigid" | "open" | "lottery";

const Q = 5;
const QLABELS: Bi[] = [
  { en: "Q1", zh: "Q1" },
  { en: "Q2", zh: "Q2" },
  { en: "Q3", zh: "Q3" },
  { en: "Q4", zh: "Q4" },
  { en: "Q5", zh: "Q5" },
];
const QFULL: Bi[] = [
  { en: "Bottom", zh: "最底层" },
  { en: "Lower-mid", zh: "中下层" },
  { en: "Middle", zh: "中层" },
  { en: "Upper-mid", zh: "中上层" },
  { en: "Top", zh: "最高层" },
];

/**
 * Build a 5×5 row-stochastic transition matrix from the three forces.
 * Each value is in [0, 100]. Returns rows[origin][destination].
 */
function buildMatrix(inherit: number, education: number, luck: number): number[][] {
  const inh = inherit / 100; // 0..1 stickiness strength
  const edu = education / 100; // 0..1 leveling drift
  const lk = luck / 100; // 0..1 randomness

  // Spread (sigma) of the destination kernel around the origin quintile.
  // High inheritance → tight kernel; high luck → wide kernel.
  // Range chosen so the kernel meaningfully spans the 5 quintiles.
  const sigma = 0.45 + (1 - inh) * 1.7 + lk * 1.9; // ~0.45 (sticky) .. ~4.05 (chaotic)

  const rows: number[][] = [];
  for (let origin = 0; origin < Q; origin++) {
    // Education pulls the kernel center upward (toward Q3..Q5), strongest
    // for low origins (broad schooling helps those at the bottom most).
    const headroom = (Q - 1 - origin) / (Q - 1); // 1 at Q1, 0 at Q5
    const center = origin + edu * (1.0 + 1.4 * headroom);

    const raw: number[] = [];
    for (let dest = 0; dest < Q; dest++) {
      // Gaussian kernel around the (education-shifted) center.
      const d = dest - center;
      const gauss = Math.exp(-(d * d) / (2 * sigma * sigma));
      // A uniform floor scaled by luck: pure chance flattens the row.
      const floor = (0.04 + 0.55 * lk) / Q;
      raw.push(gauss + floor);
    }
    // Normalize the row to sum to 1, then express as percentages.
    const sum = raw.reduce((a, b) => a + b, 0) || 1;
    rows.push(raw.map((v) => (v / sum) * 100));
  }
  return rows;
}

const PRESETS: Record<Preset, { inherit: number; education: number; luck: number; label: Bi }> = {
  rigid: { inherit: 100, education: 8, luck: 6, label: { en: "Rigid caste", zh: "森严种姓" } },
  open: { inherit: 22, education: 88, luck: 30, label: { en: "Open society", zh: "开放社会" } },
  lottery: { inherit: 10, education: 18, luck: 100, label: { en: "Pure lottery", zh: "纯粹运气" } },
};

export default function MobilityLab() {
  const { lang } = useLang();
  const [inherit, setInherit] = useState(64);
  const [education, setEducation] = useState(40);
  const [luck, setLuck] = useState(28);
  const [origin, setOrigin] = useState(0); // selected origin quintile (Q1)

  const matrix = useMemo(() => buildMatrix(inherit, education, luck), [inherit, education, luck]);

  // Headline stats read directly from the matrix.
  const bottomToTop = matrix[0][Q - 1]; // P(reach Q5 | born Q1)
  const topStaysTop = matrix[Q - 1][Q - 1]; // P(stay Q5 | born Q5)

  // Mobility score 0–100: 100 minus the average diagonal stickiness,
  // nudged up by the bottom→top rise probability. Fully derived from P.
  const mobilityScore = useMemo(() => {
    let diag = 0;
    for (let i = 0; i < Q; i++) diag += matrix[i][i];
    const avgStick = diag / Q; // 0..100, average chance of staying put
    const base = 100 - avgStick; // higher = more churn off the diagonal
    const rise = bottomToTop; // 0..100, extra credit for genuine bottom→top
    const score = base * 0.78 + rise * 0.22;
    return Math.max(0, Math.min(100, Math.round(score)));
  }, [matrix, bottomToTop]);

  const caption: Bi = useMemo(() => {
    if (mobilityScore < 22)
      return { en: "Birth is destiny — the quintile you are born into is the one you die in.", zh: "出身即命运——你生于哪个阶层，多半也死于哪个阶层。" };
    if (mobilityScore < 45)
      return { en: "Origin weighs heavily — most children land close to where they started.", zh: "出身分量极重——多数孩子的归宿都离起点不远。" };
    if (mobilityScore < 68)
      return { en: "A mixed society — origin tilts the odds but does not fix the outcome.", zh: "混合的社会——出身只是让概率倾斜，并未锁定结局。" };
    return { en: "Origin barely predicts outcome — where you start tells you little about where you arrive.", zh: "出身几乎无法预测结果——起点几乎说明不了你的归宿。" };
  }, [mobilityScore]);

  const applyPreset = (p: Preset) => {
    setInherit(PRESETS[p].inherit);
    setEducation(PRESETS[p].education);
    setLuck(PRESETS[p].luck);
  };

  const azure = ACCENT.azure;
  const row = matrix[origin];
  const maxInRow = Math.max(...row);

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <div className="label-mono mb-2">
        <T v={{ en: "02 · Mobility lab", zh: "02 · 流动实验室" }} />
      </div>
      <h3 className="display text-xl text-ink-50 md:text-2xl">
        <T v={{ en: "Where you start vs. where you arrive", zh: "你的起点与你的归宿" }} />
      </h3>
      <p className={`mt-2 max-w-2xl text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "把人口分成五个收入五分位。一个孩子的归宿，取决于父母的起点，再加上三种力量的拉扯。"
          : "Split the population into five income quintiles. A child's destination depends on the parent's origin, pulled by three forces."}
      </p>

      <div className="rule-eq mt-5 h-px w-full opacity-60" />

      <div className="mt-6 grid gap-7 lg:grid-cols-[1.5fr_1fr]">
        {/* ---- LEFT: sliders + heatmap ---- */}
        <div>
          {/* Sliders */}
          <div className="space-y-5">
            <Slider
              label={{ en: "Inherited advantage", zh: "继承的优势" }}
              hint={{ en: "high = sticky · low = mobile", zh: "高=黏滞 · 低=流动" }}
              value={inherit}
              onChange={setInherit}
              lang={lang}
            />
            <Slider
              label={{ en: "Education access", zh: "教育机会" }}
              hint={{ en: "broad schooling lifts the low-born", zh: "普惠教育托举寒门" }}
              value={education}
              onChange={setEducation}
              lang={lang}
            />
            <Slider
              label={{ en: "Luck / networks", zh: "运气 / 人脉" }}
              hint={{ en: "high = more random, more chaotic", zh: "高=更随机、更混乱" }}
              value={luck}
              onChange={setLuck}
              lang={lang}
            />
          </div>

          {/* Presets */}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label-mono text-ink-500">
              <T v={{ en: "Presets", zh: "预设" }} />
            </span>
            {(Object.keys(PRESETS) as Preset[]).map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className={`font-mono text-[0.72rem] tracking-wide text-ink-500 underline-offset-4 transition hover:text-azure-300 hover:underline ${
                  lang === "zh" ? "zh" : ""
                }`}
              >
                {PRESETS[p].label[lang]}
              </button>
            ))}
          </div>

          {/* Heatmap */}
          <div className="mt-7">
            <div className="label-mono mb-3 text-ink-500">
              <T v={{ en: "Transition matrix · P(destination | origin)", zh: "转移矩阵 · P(归宿 | 起点)" }} />
            </div>
            <HeatMap matrix={matrix} origin={origin} setOrigin={setOrigin} lang={lang} azure={azure} />
          </div>
        </div>

        {/* ---- RIGHT: your odds + score ---- */}
        <div className="space-y-6">
          {/* Mobility score */}
          <div className="rounded-lg border border-ink-100/10 bg-void-950/50 p-5" style={{ borderLeft: `2px solid ${azure}` }}>
            <div className="label-mono text-ink-500">
              <T v={{ en: "Mobility score", zh: "流动性指数" }} />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="display tabular-nums text-5xl text-azure-300 glow-azure">{mobilityScore}</span>
              <span className="font-mono text-sm text-ink-500">/ 100</span>
            </div>
            {/* track */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-void-700">
              <div className="h-full rounded-full" style={{ width: `${mobilityScore}%`, backgroundColor: azure }} />
            </div>
            <p key={`${lang}-${caption.en}`} className={`lang-fade mt-3 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
              {caption[lang]}
            </p>
          </div>

          {/* Your odds */}
          <div>
            <div className="label-mono mb-2 text-ink-500">
              <T v={{ en: "Your odds", zh: "你的概率" }} />
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className={`font-mono text-[0.72rem] text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                {lang === "zh" ? "出生于" : "born into"}
              </span>
              {QLABELS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setOrigin(i)}
                  aria-pressed={origin === i}
                  className={`rounded border px-2 py-1 font-mono text-[0.72rem] tabular-nums transition ${
                    origin === i
                      ? "border-azure-500/60 bg-azure-500/15 text-azure-300"
                      : "border-ink-100/10 text-ink-500 hover:text-ink-300"
                  }`}
                >
                  {q[lang]}
                </button>
              ))}
            </div>

            {/* destination distribution bars for selected origin */}
            <div className="space-y-1.5">
              {row.map((p, dest) => {
                const isDiag = dest === origin;
                return (
                  <div key={dest} className="flex items-center gap-2">
                    <span className="w-7 shrink-0 font-mono text-[0.72rem] text-ink-500">{QLABELS[dest].en}</span>
                    <div className="relative h-4 flex-1 overflow-hidden rounded-sm bg-void-700">
                      <div
                        className="h-full rounded-sm transition-[width] duration-300"
                        style={{
                          width: `${(p / (maxInRow || 1)) * 100}%`,
                          backgroundColor: azure,
                          opacity: isDiag ? 0.45 : 0.85,
                        }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono text-[0.72rem] tabular-nums text-ink-300">
                      {p.toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Headline stats from the matrix */}
          <div className="grid grid-cols-2 gap-3">
            <Stat
              label={{ en: "Bottom → Top", zh: "由底至顶" }}
              sub={{ en: "Q1 child reaches Q5", zh: "Q1 的孩子升至 Q5" }}
              value={`${bottomToTop.toFixed(1)}%`}
              color={ACCENT.cyan}
              lang={lang}
            />
            <Stat
              label={{ en: "Top stays Top", zh: "顶端不坠" }}
              sub={{ en: "Q5 child stays Q5", zh: "Q5 的孩子留在 Q5" }}
              value={`${topStaysTop.toFixed(1)}%`}
              color={ACCENT.rose}
              lang={lang}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */

function Slider({
  label,
  hint,
  value,
  onChange,
  lang,
}: {
  label: Bi;
  hint: Bi;
  value: number;
  onChange: (n: number) => void;
  lang: "en" | "zh";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className={`text-sm text-ink-100 ${lang === "zh" ? "zh" : ""}`}>{label[lang]}</span>
        <span className="font-mono text-sm tabular-nums text-azure-300">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-void-700 accent-[#5b8cff]"
        style={{ accentColor: "#5b8cff" }}
      />
      <div className={`mt-1 font-mono text-[0.68rem] text-ink-500 ${lang === "zh" ? "zh" : ""}`}>{hint[lang]}</div>
    </div>
  );
}

function HeatMap({
  matrix,
  origin,
  setOrigin,
  lang,
  azure,
}: {
  matrix: number[][];
  origin: number;
  setOrigin: (i: number) => void;
  lang: "en" | "zh";
  azure: string;
}) {
  // Geometry in viewBox units.
  const cell = 64;
  const labelL = 70;
  const labelT = 30;
  const W = labelL + cell * Q + 8;
  const H = labelT + cell * Q + 26;
  // Color opacity scales with probability; a value of 100% is fully opaque.
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={lang === "zh" ? "转移矩阵热力图" : "Transition matrix heatmap"}>
      {/* column header: destination */}
      <text x={labelL + (cell * Q) / 2} y={12} textAnchor="middle" fill={ACCENT.silver} fillOpacity={0.55} fontSize={11} className={lang === "zh" ? "zh" : ""} style={{ fontFamily: "var(--font-mono, monospace)" }}>
        {lang === "zh" ? "归宿 →" : "destination →"}
      </text>
      {QLABELS.map((q, c) => (
        <text key={c} x={labelL + cell * c + cell / 2} y={labelT - 8} textAnchor="middle" fill={ACCENT.silver} fillOpacity={0.7} fontSize={12} style={{ fontFamily: "var(--font-mono, monospace)" }}>
          {q.en}
        </text>
      ))}

      {/* row header: origin */}
      <text x={12} y={labelT + (cell * Q) / 2} textAnchor="middle" fill={ACCENT.silver} fillOpacity={0.55} fontSize={11} transform={`rotate(-90 12 ${labelT + (cell * Q) / 2})`} className={lang === "zh" ? "zh" : ""} style={{ fontFamily: "var(--font-mono, monospace)" }}>
        {lang === "zh" ? "起点 →" : "origin →"}
      </text>

      {matrix.map((rowVals, r) => {
        const isSelRow = r === origin;
        return (
          <g key={r} onClick={() => setOrigin(r)} style={{ cursor: "pointer" }} role="button" aria-label={`origin ${QLABELS[r].en}`}>
            {/* row label */}
            <text x={labelL - 12} y={labelT + cell * r + cell / 2 + 4} textAnchor="end" fill={isSelRow ? azure : ACCENT.silver} fillOpacity={isSelRow ? 1 : 0.7} fontSize={12} style={{ fontFamily: "var(--font-mono, monospace)" }}>
              {QLABELS[r].en}
            </text>
            {rowVals.map((p, c) => {
              const x = labelL + cell * c;
              const y = labelT + cell * r;
              const op = 0.06 + (p / 100) * 0.92; // probability → opacity
              const onDiag = r === c;
              return (
                <g key={c}>
                  <rect x={x + 2} y={y + 2} width={cell - 4} height={cell - 4} rx={3} fill={azure} fillOpacity={op} stroke={onDiag ? azure : "none"} strokeOpacity={onDiag ? 0.5 : 0} strokeWidth={1} />
                  {isSelRow && <rect x={x + 1} y={y + 1} width={cell - 2} height={cell - 2} rx={3} fill="none" stroke={azure} strokeOpacity={0.85} strokeWidth={1.5} />}
                  <text x={x + cell / 2} y={y + cell / 2 + 4} textAnchor="middle" fill={op > 0.55 ? "#050810" : ACCENT.silver} fillOpacity={op > 0.55 ? 0.95 : 0.85} fontSize={12} style={{ fontFamily: "var(--font-mono, monospace)" }}>
                    {p.toFixed(0)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function Stat({ label, sub, value, color, lang }: { label: Bi; sub: Bi; value: string; color: string; lang: "en" | "zh" }) {
  return (
    <div className="rounded-lg border border-ink-100/10 bg-void-950/40 p-3">
      <div className={`label-mono ${lang === "zh" ? "zh" : ""}`} style={{ color, opacity: 0.9 }}>
        {label[lang]}
      </div>
      <div className="mt-1 font-mono text-2xl tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className={`mt-1 text-[0.68rem] leading-snug text-ink-500 ${lang === "zh" ? "zh" : ""}`}>{sub[lang]}</div>
    </div>
  );
}
