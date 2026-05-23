"use client";

import { useMemo, useRef, useState } from "react";
import { useLang, T, type Bi } from "./lang";
import { ACCENT } from "./content";

/**
 * FairnessGame — the Ultimatum Game.
 *
 * A Proposer is given 100 coins and offers a split; the Responder either
 * accepts (both keep the split) or rejects (both get nothing). People reject
 * unfair offers even at a cost to themselves — fairness is felt, not calculated.
 *
 * Acceptance probability is a real logistic function of the offer:
 *   p(accept) = 1 / (1 + exp(-k (offer - x0)))
 * with x0 ≈ 27 (the indifference point) and k tuned so low-balls are rejected
 * and ~50/50 splits are almost always accepted. Round outcomes are sampled
 * from this probability — nothing is hardcoded.
 */

const X0 = 27; // offer at which acceptance ≈ 50%
const K = 0.16; // steepness of the felt-unfairness threshold

function acceptanceProb(offer: number): number {
  return 1 / (1 + Math.exp(-K * (offer - X0)));
}

/** Resentment 0–100: rises sharply as the offer drops below ~40. */
function resentment(offer: number): number {
  // Inverse of acceptance, sharpened, so the felt-unfairness curve is steep
  // in the "stingy / insulting" band and near-zero once the offer is fair.
  const r = 100 / (1 + Math.exp(K * 1.35 * (offer - (X0 + 8))));
  return Math.max(0, Math.min(100, r));
}

type Zone = "generous" | "fair" | "stingy" | "insulting";
function zoneOf(offer: number): Zone {
  if (offer >= 50) return "generous";
  if (offer >= 38) return "fair";
  if (offer >= 20) return "stingy";
  return "insulting";
}

const ZONE_COPY: Record<Zone, { verdict: Bi; reason: Bi; color: string }> = {
  generous: {
    verdict: { en: "Accept", zh: "接受" },
    reason: { en: "More than half — taken gladly, with a flicker of suspicion.", zh: "超过一半——欣然接受，只夹一丝狐疑。" },
    color: ACCENT.cyan,
  },
  fair: {
    verdict: { en: "Accept", zh: "接受" },
    reason: { en: "Close to even. This is what fairness feels like; the hand reaches out.", zh: "接近对半。这就是公平的感觉，手自然伸了出去。" },
    color: ACCENT.azure,
  },
  stingy: {
    verdict: { en: "Likely reject", zh: "多半拒绝" },
    reason: { en: "Stingy. The responder may burn the coins to deny you the win.", zh: "吝啬。回应者宁可烧掉硬币，也不让你得逞。" },
    color: ACCENT.gold,
  },
  insulting: {
    verdict: { en: "Reject", zh: "拒绝" },
    reason: { en: "An insult. Refusing costs the responder little and costs you everything.", zh: "这是侮辱。拒绝让回应者损失甚微，却让你一无所获。" },
    color: ACCENT.rose,
  },
};

type Round = { offer: number; accepted: boolean; propGain: number; respGain: number };

export default function FairnessGame() {
  const { lang } = useLang();
  const [offer, setOffer] = useState(20);
  const [rounds, setRounds] = useState<Round[]>([]);
  // Deterministic-on-server: PRNG only ever runs in the click handler.
  const seedRef = useRef(0x2545f491);

  const p = acceptanceProb(offer);
  const res = resentment(offer);
  const zone = zoneOf(offer);
  const zc = ZONE_COPY[zone];

  // Cumulative tallies derived from the round history.
  const totals = useMemo(() => {
    let prop = 0;
    let resp = 0;
    let acc = 0;
    for (const r of rounds) {
      prop += r.propGain;
      resp += r.respGain;
      if (r.accepted) acc++;
    }
    return { prop, resp, acc, n: rounds.length };
  }, [rounds]);

  // Simple LCG so sampling is reproducible and never touches Math.random
  // during render (SSR-safe). Advances only inside playRound.
  function nextRandom(): number {
    let s = seedRef.current;
    s = (s * 1664525 + 1013904223) >>> 0;
    seedRef.current = s;
    return s / 0xffffffff;
  }

  function playRound() {
    const accepted = nextRandom() < acceptanceProb(offer);
    const propGain = accepted ? 100 - offer : 0;
    const respGain = accepted ? offer : 0;
    setRounds((prev) => [{ offer, accepted, propGain, respGain }, ...prev].slice(0, 24));
  }

  function reset() {
    setRounds([]);
  }

  // ---- acceptance curve geometry ----
  const W = 460;
  const H = 220;
  const padL = 40;
  const padR = 16;
  const padT = 16;
  const padB = 32;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let o = 0; o <= 100; o += 2) {
      const x = padL + (plotW * o) / 100;
      const y = padT + plotH * (1 - acceptanceProb(o));
      pts.push(`${pts.length === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return pts.join(" ");
  }, [plotW, plotH]);

  const markX = padL + (plotW * offer) / 100;
  const markY = padT + plotH * (1 - p);

  const accentForMeter = res > 60 ? ACCENT.rose : res > 30 ? ACCENT.gold : ACCENT.cyan;

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <div className="label-mono mb-2">
        <T v={{ en: "03 · Fairness game · the ultimatum", zh: "03 · 公平博弈 · 最后通牒" }} />
      </div>
      <h3 className="display text-xl text-ink-50 md:text-2xl">
        <T v={{ en: "The price of unfairness", zh: "不公平的代价" }} />
      </h3>
      <p className={`mt-2 max-w-2xl text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "在 Brosnan 与 de Waal 的实验里，得到黄瓜的猴子看见同伴换来葡萄，便把黄瓜砸回实验员脸上。不公平是一种会被感受到的情绪——这里，由你出价。"
          : "In Brosnan & de Waal's experiment, a monkey paid in cucumber threw it back at the keeper the moment it saw a neighbour paid in grapes. Unfairness is an emotion that is felt — here, you set the offer."}
      </p>

      <div className="rule-eq mt-5 h-px w-full opacity-60" />

      <div className="mt-6 grid gap-7 lg:grid-cols-[1.2fr_1fr]">
        {/* ---- LEFT: offer slider, curve, verdict ---- */}
        <div>
          {/* offer split readout */}
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className={`text-sm text-ink-100 ${lang === "zh" ? "zh" : ""}`}>
              <T v={{ en: "Offer to the responder", zh: "给回应者的份额" }} />
            </span>
            <span className="font-mono text-sm tabular-nums text-azure-300">{offer}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={offer}
            onChange={(e) => setOffer(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-void-700 accent-[#5b8cff]"
            style={{ accentColor: "#5b8cff" }}
          />
          <div className="mt-1.5 flex justify-between font-mono text-[0.68rem] text-ink-500">
            <span>
              <T v={{ en: "you keep", zh: "你留下" }} /> {100 - offer}
            </span>
            <span>
              <T v={{ en: "they get", zh: "对方得" }} /> {offer}
            </span>
          </div>

          {/* acceptance curve */}
          <div className="mt-6">
            <div className="label-mono mb-2 text-ink-500">
              <T v={{ en: "Acceptance probability", zh: "接受概率" }} />
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={lang === "zh" ? "接受概率曲线" : "Acceptance probability curve"}>
              {/* gridlines at 0/50/100% */}
              {[0, 50, 100].map((v) => {
                const y = padT + plotH * (1 - v / 100);
                return (
                  <g key={v}>
                    <line x1={padL} x2={W - padR} y1={y} y2={y} stroke={ACCENT.silver} strokeOpacity={0.1} strokeWidth={1} />
                    <text x={padL - 6} y={y + 4} textAnchor="end" fill={ACCENT.silver} fillOpacity={0.5} fontSize={10} style={{ fontFamily: "var(--font-mono, monospace)" }}>
                      {v}
                    </text>
                  </g>
                );
              })}
              {/* x-axis ticks */}
              {[0, 25, 50, 75, 100].map((v) => {
                const x = padL + (plotW * v) / 100;
                return (
                  <text key={v} x={x} y={H - 10} textAnchor="middle" fill={ACCENT.silver} fillOpacity={0.5} fontSize={10} style={{ fontFamily: "var(--font-mono, monospace)" }}>
                    {v}
                  </text>
                );
              })}

              {/* the curve */}
              <path d={curvePath} fill="none" stroke={ACCENT.azure} strokeWidth={2} strokeLinecap="round" />

              {/* current offer marker */}
              <line x1={markX} x2={markX} y1={padT} y2={padT + plotH} stroke={zc.color} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={markX} cy={markY} r={5} fill={zc.color} />
              <text x={Math.min(markX + 8, W - padR - 30)} y={Math.max(markY - 8, padT + 10)} fill={zc.color} fontSize={11} style={{ fontFamily: "var(--font-mono, monospace)" }}>
                {(p * 100).toFixed(0)}%
              </text>
            </svg>
          </div>

          {/* verdict */}
          <div key={`${zone}-${lang}`} className="lang-fade mt-4 rounded-lg border border-ink-100/10 bg-void-950/50 p-4" style={{ borderLeft: `2px solid ${zc.color}` }}>
            <div className="flex items-baseline justify-between">
              <span className="label-mono text-ink-500">
                <T v={{ en: "Responder's verdict", zh: "回应者的裁决" }} />
              </span>
              <span className={`font-mono text-sm ${lang === "zh" ? "zh" : ""}`} style={{ color: zc.color }}>
                {zc.verdict[lang]}
              </span>
            </div>
            <p className={`mt-2 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>{zc.reason[lang]}</p>
          </div>
        </div>

        {/* ---- RIGHT: resentment meter, play, tallies, history ---- */}
        <div className="space-y-6">
          {/* resentment meter */}
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="label-mono text-ink-500">
                <T v={{ en: "Resentment", zh: "怨怒值" }} />
              </span>
              <span className="font-mono text-sm tabular-nums" style={{ color: accentForMeter }}>
                {res.toFixed(0)}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-void-700">
              <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${res}%`, backgroundColor: accentForMeter }} />
            </div>
            <p className={`mt-1.5 font-mono text-[0.68rem] text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh" ? "份额跌破约 40 时，怨怒陡升。" : "Rises sharply once the offer drops below ~40."}
            </p>
          </div>

          {/* play a round */}
          <div className="flex items-center gap-3">
            <button
              onClick={playRound}
              className="rounded-md border border-azure-500/50 bg-azure-500/10 px-4 py-2 font-mono text-sm text-azure-300 transition hover:bg-azure-500/20"
            >
              <T v={{ en: "Play a round", zh: "玩一轮" }} />
            </button>
            <button onClick={reset} className={`font-mono text-[0.72rem] text-ink-500 underline-offset-4 transition hover:text-ink-300 hover:underline ${lang === "zh" ? "zh" : ""}`}>
              <T v={{ en: "reset", zh: "重置" }} />
            </button>
          </div>

          {/* cumulative tallies */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-ink-100/10 bg-void-950/40 p-3">
              <div className={`label-mono text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                <T v={{ en: "Proposer coins", zh: "提议者硬币" }} />
              </div>
              <div className="mt-1 font-mono text-2xl tabular-nums text-azure-300">{totals.prop}</div>
            </div>
            <div className="rounded-lg border border-ink-100/10 bg-void-950/40 p-3">
              <div className={`label-mono text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                <T v={{ en: "Responder coins", zh: "回应者硬币" }} />
              </div>
              <div className="mt-1 font-mono text-2xl tabular-nums text-cyan-300">{totals.resp}</div>
            </div>
          </div>
          <div className={`-mt-2 font-mono text-[0.68rem] text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            {totals.n > 0 ? (
              <span>
                {totals.n} <T v={{ en: "rounds", zh: "轮" }} /> · {totals.acc} <T v={{ en: "accepted", zh: "成交" }} /> · {totals.n - totals.acc} <T v={{ en: "rejected → both got nothing", zh: "拒绝 → 双方皆空" }} />
              </span>
            ) : (
              <T v={{ en: "Play rounds to watch low-balls leave both poorer.", zh: "多玩几轮，看低价如何让双方都更穷。" }} />
            )}
          </div>

          {/* round history */}
          {rounds.length > 0 && (
            <div>
              <div className="label-mono mb-2 text-ink-500">
                <T v={{ en: "Recent rounds", zh: "近期回合" }} />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rounds.map((r, i) => (
                  <span
                    key={i}
                    title={`${r.offer} → ${r.accepted ? "accept" : "reject"}`}
                    className="flex h-7 w-7 items-center justify-center rounded font-mono text-[0.62rem] tabular-nums"
                    style={{
                      backgroundColor: r.accepted ? `${ACCENT.azure}26` : `${ACCENT.rose}26`,
                      color: r.accepted ? ACCENT.azure : ACCENT.rose,
                      border: `1px solid ${r.accepted ? ACCENT.azure : ACCENT.rose}55`,
                    }}
                  >
                    {r.offer}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className={`mt-6 max-w-3xl text-sm leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "一个理性的回应者本该接受任何正数的份额。可人不是这样：人会自付代价去惩罚不公平。怨怒不是缺陷，而是一种纪律——它让吝啬的提议者长期一无所获。"
          : "A rational responder should accept any positive offer. Humans do not: we will pay to punish unfairness. Resentment is not a flaw but a discipline — it leaves the stingy proposer poorer over time."}
      </p>
    </div>
  );
}
