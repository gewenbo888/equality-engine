"use client";

import { useMemo, useState } from "react";
import { useLang, T, type Bi } from "./lang";

/* ──────────────────────────────────────────────────────────────────────────
   The algorithm that judges · 做出裁决的算法
   ------------------------------------------------------------------------
   Two groups A and B carry the SAME latent qualification, but group B's
   observed-score distribution is shifted lower — the accumulated residue of
   historical disadvantage, NOT an innate difference. A single decision
   threshold approves everyone above it. We compute, live:
     · approval rate per group  (1 - Φ at the threshold)
     · false-positive / false-negative rates against a latent "truly
       qualified" cut-off
     · the approval-rate disparity between the groups
   "Equalize approval rates" sets per-group thresholds so approval rates match,
   and surfaces that you can equalize approval OR equalize error — not both.
   ────────────────────────────────────────────────────────────────────────── */

// Group score distributions (mean / sd) on a 0–100 scale.
const MEAN_A = 62;
const MEAN_B = 50; // shifted lower by history, same spread
const SD = 14;
// A latent "truly qualified" boundary — applicants above it would succeed.
const TRUTH_CUT = 50;

// Abramowitz & Stegun 7.1.26 erf approximation (max error ~1.5e-7).
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

// Normal CDF Φ(x; μ, σ).
function normCdf(x: number, mu: number, sd: number): number {
  return 0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2)));
}

// Normal PDF (for drawing curves).
function normPdf(x: number, mu: number, sd: number): number {
  const z = (x - mu) / sd;
  return Math.exp(-0.5 * z * z) / (sd * Math.sqrt(2 * Math.PI));
}

type Metrics = {
  approval: number; // P(score ≥ threshold)
  fpr: number; // approved AND not truly qualified, among the not-qualified
  fnr: number; // rejected AND truly qualified, among the qualified
};

// Compute approval / error rates for one group at a given threshold.
function metricsFor(mu: number, thr: number): Metrics {
  const approval = 1 - normCdf(thr, mu, SD);
  const pQualified = 1 - normCdf(TRUTH_CUT, mu, SD); // truly-qualified share
  const pNotQualified = 1 - pQualified;

  // Joint masses (independence of error around the cut is approximated by the
  // shared latent axis: "qualified" ≈ score above TRUTH_CUT).
  // Approved & qualified: score ≥ max(thr, TRUTH_CUT) ... but we model the
  // observed score AS the qualification proxy, so:
  const approvedAndNotQual = Math.max(
    0,
    normCdf(TRUTH_CUT, mu, SD) - normCdf(thr, mu, SD),
  ); // thr < TRUTH_CUT → approve some below the truth line (false positives)
  const rejectedAndQual = Math.max(
    0,
    normCdf(thr, mu, SD) - normCdf(TRUTH_CUT, mu, SD),
  ); // thr > TRUTH_CUT → reject some above the truth line (false negatives)

  const fpr = pNotQualified > 1e-6 ? approvedAndNotQual / pNotQualified : 0;
  const fnr = pQualified > 1e-6 ? rejectedAndQual / pQualified : 0;
  return { approval, fpr, fnr };
}

// Solve for the threshold on group B that matches group A's approval rate.
// Approval is monotonic in threshold, so a bisection converges cleanly.
function thresholdForApproval(mu: number, targetApproval: number): number {
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const a = 1 - normCdf(mid, mu, SD);
    if (a > targetApproval) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

export default function AIFairnessDashboard() {
  const { lang } = useLang();
  const [threshold, setThreshold] = useState(58);
  const [equalize, setEqualize] = useState(false);
  const [ownership, setOwnership] = useState<"central" | "decentral">("central");

  const C = {
    azure: "#5b8cff",
    rose: "#ff6f91",
    gold: "#e3b24f",
    aura: "#9b8cff",
    silver: "#c2cce4",
  };

  // Per-group thresholds. In demographic-parity mode, group B's threshold is
  // lowered so its approval rate matches group A's.
  const thrA = threshold;
  const targetApproval = 1 - normCdf(thrA, MEAN_A, SD);
  const thrB = equalize ? thresholdForApproval(MEAN_B, targetApproval) : threshold;

  const mA = useMemo(() => metricsFor(MEAN_A, thrA), [thrA]);
  const mB = useMemo(() => metricsFor(MEAN_B, thrB), [thrB]);

  const approvalGap = Math.abs(mA.approval - mB.approval);
  const fnrGap = Math.abs(mA.fnr - mB.fnr);
  const fprGap = Math.abs(mA.fpr - mB.fpr);
  const gapHot = approvalGap > 0.1;

  // ── SVG geometry for the distribution chart ──
  const W = 1000;
  const H = 300;
  const padL = 20;
  const padR = 20;
  const padT = 20;
  const padB = 36;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xOf = (s: number) => padL + (s / 100) * plotW;
  // Peak of a SD=14 normal sets the y scale.
  const peak = normPdf(MEAN_A, MEAN_A, SD);
  const yOf = (d: number) => padT + plotH * (1 - d / (peak * 1.12));

  // Build a curve path + a filled "approved" area path for a group.
  function curve(mu: number, thr: number) {
    const N = 120;
    const pts: { x: number; y: number; s: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const s = (i / N) * 100;
      pts.push({ x: xOf(s), y: yOf(normPdf(s, mu, SD)), s });
    }
    const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
    const baseY = yOf(0);
    const area = pts.filter((p) => p.s >= thr);
    let fill = "";
    if (area.length) {
      fill =
        `M${xOf(thr).toFixed(2)} ${baseY.toFixed(2)} ` +
        `L${xOf(thr).toFixed(2)} ${yOf(normPdf(thr, mu, SD)).toFixed(2)} ` +
        area.map((p) => `L${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") +
        ` L${xOf(100).toFixed(2)} ${baseY.toFixed(2)} Z`;
    }
    return { line, fill };
  }

  const cA = curve(MEAN_A, thrA);
  const cB = curve(MEAN_B, thrB);

  // ── Explanatory line that updates with the equalize toggle ──
  const impossibility: Bi = equalize
    ? {
        en: "Approval rates are now equal — but look at the error gap below: the two groups no longer face the same false-negative rate. You bought demographic parity by spending equal accuracy. The two cannot both be satisfied while the input distributions differ.",
        zh: "通过率现已相等——但请看下方的错误率差距：两组不再面对相同的漏判率。你用「同等准确」换来了「人口均等」。只要输入分布不同，二者便无法同时成立。",
      }
    : {
        en: "One threshold, applied to all. Because group B's observed scores sit lower — the residue of history, not ability — the same rule approves fewer of them. Equal treatment of unequal starting points reproduces the gap.",
        zh: "一条阈值，适用于所有人。由于 B 组的观测分数更低——那是历史的残留，而非能力——同一条规则便批准了更少的人。对不平等起点的「平等对待」，复制了原有的差距。",
      };

  const ownerCaption: Bi =
    ownership === "central"
      ? {
          en: "Centralized: one firm sets this threshold once and applies it silently to millions. No one outside sees the line, the score, or the shifted distribution. The judged cannot see how they were judged — and cannot contest it.",
          zh: "中心化：一家公司一次性设定这条阈值，再悄无声息地施加于数百万人。外界看不到这条线、看不到分数、看不到被移动的分布。被裁决者无从知晓自己如何被裁决——也无从申诉。",
        }
      : {
          en: "Decentralized: the threshold, the data and the disparity are open and auditable. Multiple parties run and contest the model; the judged can see the line, challenge it, and demand a different one. Fairness becomes plural and revisable, not decreed.",
          zh: "去中心化：阈值、数据与差距都是公开、可审计的。多方运行并质询该模型；被裁决者能看到这条线、挑战它、要求一条不同的线。公平因此成为多元且可修订的，而非被独断颁布。",
        };

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <p className="label-mono text-ink-500">
        <T v={{ en: "Lab · Algorithmic fairness", zh: "实验 · 算法公平" }} />
      </p>
      <h3 className="display mt-2 text-2xl text-ink-50 md:text-3xl">
        <T v={{ en: "The algorithm that judges", zh: "做出裁决的算法" }} />
      </h3>
      <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "An algorithm learns the past — including its bias — then judges millions. Two groups carry the same potential, but group B's observed scores sit lower: the residue of accumulated disadvantage, not innate difference. Move the single threshold and watch fairness fracture.",
            zh: "算法习得过去——连同过去的偏见——然后裁决数百万人。两组拥有相同的潜能，但 B 组的观测分数更低：那是累积劣势的残留，而非天生的差异。移动这唯一的阈值，看公平如何碎裂。",
          }}
        />
      </p>

      {/* Distribution chart */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className={`label-mono ${lang === "zh" ? "zh" : ""}`} style={{ color: C.azure }}>
            <T v={{ en: "Group A", zh: "A 组" }} />
          </span>
          <span className={`label-mono text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Qualification score 0–100", zh: "资格分数 0–100" }} />
          </span>
          <span className={`label-mono ${lang === "zh" ? "zh" : ""}`} style={{ color: C.gold }}>
            <T v={{ en: "Group B (shifted lower by history)", zh: "B 组（被历史压低）" }} />
          </span>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Overlapping score distributions with decision threshold">
          {/* baseline */}
          <line x1={padL} y1={yOf(0)} x2={W - padR} y2={yOf(0)} stroke={C.silver} strokeOpacity={0.18} strokeWidth={1} />
          {/* x ticks */}
          {[0, 25, 50, 75, 100].map((s) => (
            <g key={s}>
              <line x1={xOf(s)} y1={yOf(0)} x2={xOf(s)} y2={yOf(0) + 5} stroke={C.silver} strokeOpacity={0.25} strokeWidth={0.8} />
              <text x={xOf(s)} y={yOf(0) + 22} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={C.silver} fillOpacity={0.55}>
                {s}
              </text>
            </g>
          ))}

          {/* truth cut-off — the latent "truly qualified" line */}
          <line x1={xOf(TRUTH_CUT)} y1={padT} x2={xOf(TRUTH_CUT)} y2={yOf(0)} stroke={C.silver} strokeOpacity={0.3} strokeWidth={1} strokeDasharray="2 5" />
          <text x={xOf(TRUTH_CUT) + 6} y={padT + 12} fontSize={12} fontFamily="monospace" fill={C.silver} fillOpacity={0.55} className={lang === "zh" ? "zh" : ""}>
            {lang === "zh" ? "真正合格线" : "truly-qualified line"}
          </text>

          {/* Group A */}
          <path d={cA.fill} fill={C.azure} fillOpacity={0.16} />
          <path d={cA.line} fill="none" stroke={C.azure} strokeWidth={2} />
          {/* Group B */}
          <path d={cB.fill} fill={C.gold} fillOpacity={0.16} />
          <path d={cB.line} fill="none" stroke={C.gold} strokeWidth={2} />

          {/* threshold line(s) */}
          {equalize ? (
            <>
              <line x1={xOf(thrA)} y1={padT - 6} x2={xOf(thrA)} y2={yOf(0)} stroke={C.azure} strokeWidth={1.6} />
              <line x1={xOf(thrB)} y1={padT - 6} x2={xOf(thrB)} y2={yOf(0)} stroke={C.gold} strokeWidth={1.6} />
              <text x={xOf(thrA)} y={padT - 10} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={C.azure}>
                {thrA.toFixed(0)}
              </text>
              <text x={xOf(thrB)} y={padT - 10} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={C.gold}>
                {thrB.toFixed(0)}
              </text>
            </>
          ) : (
            <>
              <line x1={xOf(thrA)} y1={padT - 6} x2={xOf(thrA)} y2={yOf(0)} stroke={C.silver} strokeWidth={1.8} />
              <text x={xOf(thrA)} y={padT - 10} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={C.silver}>
                {lang === "zh" ? `阈值 ${thrA.toFixed(0)}` : `threshold ${thrA.toFixed(0)}`}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* Threshold slider */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <label className={`label-mono text-ink-500 ${lang === "zh" ? "zh" : ""}`} htmlFor="afd-threshold">
            <T v={{ en: "Decision threshold", zh: "决策阈值" }} />
          </label>
          <span className="font-mono text-sm text-ink-100">{threshold.toFixed(0)}</span>
        </div>
        <input
          id="afd-threshold"
          type="range"
          min={20}
          max={85}
          step={1}
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="mt-2 w-full accent-[#5b8cff]"
        />
        {equalize && (
          <p className={`mt-1 text-xs text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Group B's threshold is solved automatically to match approval.", zh: "B 组的阈值被自动求解，以匹配通过率。" }} />
          </p>
        )}
      </div>

      {/* Per-group metric cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {([
          { label: { en: "Group A", zh: "A 组" } as Bi, m: mA, thr: thrA, color: C.azure },
          { label: { en: "Group B", zh: "B 组" } as Bi, m: mB, thr: thrB, color: C.gold },
        ]).map((g) => (
          <div key={g.label.en} className="panel rounded-lg p-4" style={{ borderColor: `${g.color}33` }}>
            <div className="flex items-center justify-between">
              <span className={`label-mono ${lang === "zh" ? "zh" : ""}`} style={{ color: g.color }}>
                <T v={g.label} />
              </span>
              <span className="font-mono text-xs text-ink-500">
                {lang === "zh" ? `阈值 ${g.thr.toFixed(0)}` : `thr ${g.thr.toFixed(0)}`}
              </span>
            </div>
            <div className="mt-3">
              <p className={`text-xs text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                <T v={{ en: "Approval rate", zh: "通过率" }} />
              </p>
              <p className="font-mono text-3xl" style={{ color: g.color }}>
                {pct(g.m.approval)}
              </p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className={`text-xs text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                  <T v={{ en: "False positives", zh: "误判通过" }} />
                </p>
                <p className="font-mono text-lg text-ink-100">{pct(g.m.fpr)}</p>
              </div>
              <div>
                <p className={`text-xs text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                  <T v={{ en: "False negatives", zh: "误判拒绝" }} />
                </p>
                <p className="font-mono text-lg text-ink-100">{pct(g.m.fnr)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disparity strip */}
      <div
        className="mt-4 rounded-lg border p-4"
        style={{
          borderColor: gapHot ? `${C.rose}55` : "rgba(180,192,219,0.14)",
          backgroundColor: gapHot ? `${C.rose}10` : "transparent",
        }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span className={`label-mono ${lang === "zh" ? "zh" : ""}`} style={{ color: gapHot ? C.rose : C.silver }}>
            <T v={{ en: "Approval-rate disparity", zh: "通过率差距" }} />
          </span>
          <span className="font-mono text-2xl" style={{ color: gapHot ? C.rose : C.silver }}>
            {pct(approvalGap)}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-500">
          <span className={lang === "zh" ? "zh" : ""}>
            <T v={{ en: "False-negative gap", zh: "漏判率差距" }} /> <span className="font-mono text-ink-300">{pct(fnrGap)}</span>
          </span>
          <span className={lang === "zh" ? "zh" : ""}>
            <T v={{ en: "False-positive gap", zh: "误通过率差距" }} /> <span className="font-mono text-ink-300">{pct(fprGap)}</span>
          </span>
        </div>
      </div>

      {/* Controls: equalize + ownership */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Equalize toggle */}
        <button
          type="button"
          onClick={() => setEqualize((v) => !v)}
          aria-pressed={equalize}
          className={`flex items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition ${
            equalize ? "border-ink-100/30 bg-void-800/70" : "border-ink-100/10 hover:border-ink-100/20"
          }`}
        >
          <span
            className="inline-flex h-4 w-7 items-center rounded-full border transition"
            style={{
              borderColor: equalize ? C.azure : "rgba(180,192,219,0.3)",
              backgroundColor: equalize ? `${C.azure}33` : "transparent",
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full transition"
              style={{
                marginLeft: equalize ? "14px" : "3px",
                backgroundColor: equalize ? C.azure : C.silver,
              }}
            />
          </span>
          <span className={lang === "zh" ? "zh" : ""}>
            <T v={{ en: "Equalize approval rates (demographic parity)", zh: "拉平通过率（人口均等）" }} />
          </span>
        </button>

        {/* Ownership segmented control */}
        <div className="flex flex-col">
          <span className={`label-mono mb-1 text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Who owns the model", zh: "谁拥有这个模型" }} />
          </span>
          <div className="inline-flex overflow-hidden rounded-md border border-ink-100/15 text-xs">
            <button
              type="button"
              onClick={() => setOwnership("central")}
              aria-pressed={ownership === "central"}
              className={`px-3 py-1.5 transition ${
                ownership === "central" ? "bg-void-800/80 text-ink-100" : "text-ink-500 hover:text-ink-300"
              } ${lang === "zh" ? "zh" : ""}`}
            >
              <T v={{ en: "Centralized", zh: "中心化" }} />
            </button>
            <span className="w-px bg-ink-100/15" />
            <button
              type="button"
              onClick={() => setOwnership("decentral")}
              aria-pressed={ownership === "decentral"}
              className={`px-3 py-1.5 transition ${
                ownership === "decentral" ? "bg-void-800/80 text-ink-100" : "text-ink-500 hover:text-ink-300"
              } ${lang === "zh" ? "zh" : ""}`}
            >
              <T v={{ en: "Decentralized", zh: "去中心化" }} />
            </button>
          </div>
        </div>
      </div>

      {/* The impossibility line — updates with equalize */}
      <div key={`imp-${equalize}-${lang}`} className="lang-fade mt-5">
        <hr className="rule-eq" />
        <p className={`mt-4 text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`} style={{ color: equalize ? C.rose : C.azure }}>
          {impossibility[lang]}
        </p>
      </div>

      {/* Ownership caption — text only, does not change the math */}
      <p
        key={`own-${ownership}-${lang}`}
        className={`lang-fade mt-3 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}
      >
        {ownerCaption[lang]}
      </p>
    </div>
  );
}
