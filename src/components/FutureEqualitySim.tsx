"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLang, T, type Bi } from "./lang";
import { SCENARIOS, FUTURE_DIMS, ACCENT } from "./content";

/* ──────────────────────────────────────────────────────────────────────────
   Simulate a possible future · 模拟一个可能的未来
   ------------------------------------------------------------------------
   (a) Seven sliders → an aggregate Civilizational Equality score (the mean of
       the seven dimensions) → classified into one of four scenarios.
   (b) The recursive engine: a "Run forward" button steps the state through
       nine civilizational layers. At each layer the aggregate is nudged; the
       SIGN of the nudge depends on the current state. Concentrated power + low
       opportunity → inequality compounds downward. Distributed power + high
       opportunity → coordination lifts it upward. The trajectory is drawn as a
       small line chart and the run ends on a final classification.
   ────────────────────────────────────────────────────────────────────────── */

type State = Record<string, number>;

// Classify a 0–100 score: the scenario with the highest `min` that is ≤ score.
function classify(score: number) {
  const sorted = [...SCENARIOS].sort((a, b) => a.min - b.min);
  let chosen = sorted[0];
  for (const s of sorted) if (score >= s.min) chosen = s;
  return chosen;
}

const aggregate = (st: State) => {
  const ks = FUTURE_DIMS.map((d) => d.key);
  return ks.reduce((sum, k) => sum + (st[k] ?? 0), 0) / ks.length;
};

// The nine civilizational layers the engine steps through.
const LAYERS: Bi[] = [
  { en: "Biology", zh: "生物" },
  { en: "Hierarchy", zh: "等级" },
  { en: "Economics", zh: "经济" },
  { en: "Governance", zh: "治理" },
  { en: "Law", zh: "法律" },
  { en: "Technology", zh: "技术" },
  { en: "AI coordination", zh: "AI 协调" },
  { en: "Digital society", zh: "数字社会" },
  { en: "Planetary civilization", zh: "行星文明" },
];

// Presets that set all seven sliders at once.
const PRESETS: { key: string; label: Bi; values: State }[] = [
  {
    key: "feudal",
    label: { en: "Techno-feudalism", zh: "技术封建主义" },
    values: { opportunity: 22, power: 14, legal: 48, mobility: 18, information: 30, economic: 20, dignity: 32 },
  },
  {
    key: "social",
    label: { en: "Social democracy", zh: "社会民主" },
    values: { opportunity: 74, power: 70, legal: 80, mobility: 72, information: 76, economic: 72, dignity: 78 },
  },
  {
    key: "flourishing",
    label: { en: "Post-scarcity flourishing", zh: "后稀缺的繁荣" },
    values: { opportunity: 94, power: 90, legal: 95, mobility: 92, information: 93, economic: 91, dignity: 96 },
  },
];

const INITIAL: State = {
  opportunity: 55,
  power: 50,
  legal: 60,
  mobility: 52,
  information: 58,
  economic: 54,
  dignity: 60,
};

export default function FutureEqualitySim() {
  const { lang } = useLang();
  const [state, setState] = useState<State>(INITIAL);

  // ── Recursive engine state ──
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0); // 0..LAYERS.length ; 0 = base/start
  const [traj, setTraj] = useState<number[]>([]); // score after each layer
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const liveScore = aggregate(state);
  const liveScenario = classify(liveScore);

  // The score the big readout shows: trajectory tip while running, else live.
  const shownScore = running && traj.length > 0 ? traj[traj.length - 1] : liveScore;
  const shownScenario = classify(shownScore);

  const setDim = (key: string, v: number) => {
    if (running) return;
    setState((s) => ({ ...s, [key]: v }));
  };

  const applyPreset = (values: State) => {
    if (running) return;
    setState(values);
    setTraj([]);
    setStep(0);
  };

  // The feedback rule: given the current state, how much does the next layer
  // move equality, and in which direction? Concentration + low opportunity
  // erodes; distribution + high opportunity lifts. Compounding is real because
  // each step feeds the next via the running score.
  function layerDelta(power: number, opportunity: number, score: number): number {
    // Balance signal in [-1, 1]: positive = distributed power & open chances.
    const balance = (power + opportunity) / 2 - 50; // -50..+50
    const dir = balance / 50; // -1..+1
    // Magnitude grows toward the extremes (a tipping dynamic) and is damped
    // near the ceiling/floor so trajectories saturate instead of diverging.
    const room = dir >= 0 ? (100 - score) / 100 : score / 100;
    const magnitude = 3 + 9 * Math.abs(dir); // 3..12 per layer
    return dir * magnitude * (0.4 + 0.6 * room);
  }

  // Run / re-run the engine.
  const run = () => {
    if (timer.current) clearInterval(timer.current);
    setRunning(true);
    setStep(0);
    setTraj([liveScore]); // layer 0 = current state
  };

  const reset = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setRunning(false);
    setStep(0);
    setTraj([]);
  };

  // Drive the stepping with setInterval inside an effect; clean it up.
  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setStep((prev) => {
        const next = prev + 1;
        setTraj((tr) => {
          if (tr.length === 0) return tr;
          const last = tr[tr.length - 1];
          const d = layerDelta(state.power, state.opportunity, last);
          const nextScore = Math.max(0, Math.min(100, last + d));
          return [...tr, nextScore];
        });
        if (next >= LAYERS.length) {
          if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
          }
          setRunning(false);
        }
        return next;
      });
    }, 720);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
    // We intentionally snapshot power/opportunity at run start; they cannot
    // change while running (sliders are locked), so this is stable.
  }, [running, state.power, state.opportunity]);

  const finished = !running && traj.length === LAYERS.length + 1;

  // ── Trajectory chart geometry ──
  const W = 1000;
  const H = 220;
  const padL = 30;
  const padR = 30;
  const padT = 24;
  const padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = LAYERS.length + 1; // base + nine layers
  const xAt = (i: number) => padL + (plotW * i) / (n - 1);
  const yAt = (v: number) => padT + plotH * (1 - v / 100);

  const trajPath = useMemo(() => {
    if (traj.length < 1) return "";
    return traj.map((v, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(2)} ${yAt(v).toFixed(2)}`).join(" ");
  }, [traj]);

  const startScore = traj.length ? traj[0] : liveScore;
  const endScore = traj.length ? traj[traj.length - 1] : liveScore;
  const climbing = endScore >= startScore;
  const trajColor = climbing ? ACCENT.azure : ACCENT.rose;

  // Scenario threshold bands for the chart background.
  const bands = [...SCENARIOS].sort((a, b) => a.min - b.min);

  const formula: Bi = {
    en: "Fair Opportunity + Power Distribution + Legal Protection + Social Mobility + Information Access + Economic Participation + Dignity Preservation, divided by seven.",
    zh: "公平机会 + 权力分布 + 法律保护 + 社会流动 + 信息获取 + 经济参与 + 尊严维护，除以七。",
  };

  const runVerdict: Bi = finished
    ? climbing
      ? {
          en: "A balanced start climbs. Distributed power and open opportunity let each layer reinforce the last — a virtuous loop, equality compounding upward across the nine scales.",
          zh: "平衡的起点会攀升。分散的权力与开放的机会，使每一层都强化上一层——一个良性循环，平等沿着九个尺度向上复利。",
        }
      : {
          en: "A concentrated start spirals down. With power held tight and opportunity closed, each layer erodes the one before — inequality compounding through biology, hierarchy, economics, law, AI and planetary scale alike.",
          zh: "集中的起点会盘旋而下。当权力被紧握、机会被关闭，每一层都侵蚀着上一层——不平等在生物、等级、经济、法律、AI 直至行星尺度上层层复利。",
        }
    : { en: "", zh: "" };

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <p className="label-mono text-ink-500">
        <T v={{ en: "Simulator · The recursive future", zh: "模拟器 · 递归的未来" }} />
      </p>
      <h3 className="display mt-2 text-2xl text-ink-50 md:text-3xl">
        <T v={{ en: "Simulate a possible future", zh: "模拟一个可能的未来" }} />
      </h3>
      <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "Set the seven dimensions of equality, read the kind of civilization they produce — then run the state forward through nine layers and watch it compound. Where you start decides whether it climbs or spirals.",
            zh: "设定平等的七个维度，读出它们造就的那一类文明——然后让这一状态向前运行，穿过九个层级，看它如何复利。你的起点，决定了它是攀升还是盘旋下坠。",
          }}
        />
      </p>

      {/* ── (a) The seven sliders ── */}
      <div className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2">
        {FUTURE_DIMS.map((d) => (
          <div key={d.key}>
            <div className="flex items-baseline justify-between">
              <label htmlFor={`fes-${d.key}`} className={`text-sm text-ink-100 ${lang === "zh" ? "zh" : ""}`}>
                <T v={d.label} />
              </label>
              <span className="font-mono text-xs text-ink-300">{(state[d.key] ?? 0).toFixed(0)}</span>
            </div>
            <input
              id={`fes-${d.key}`}
              type="range"
              min={0}
              max={100}
              step={1}
              value={state[d.key] ?? 0}
              disabled={running}
              onChange={(e) => setDim(d.key, Number(e.target.value))}
              className="mt-1.5 w-full accent-[#5b8cff] disabled:opacity-40"
            />
            <p className={`mt-1 text-xs leading-snug text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              <T v={d.gloss} />
            </p>
          </div>
        ))}
      </div>

      {/* Presets */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className={`label-mono mr-1 text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
          <T v={{ en: "Presets", zh: "预设" }} />
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => applyPreset(p.values)}
            disabled={running}
            className={`rounded-md border border-ink-100/10 px-2.5 py-1.5 text-xs text-ink-300 transition hover:border-ink-100/25 hover:text-ink-100 disabled:opacity-40 ${lang === "zh" ? "zh" : ""}`}
          >
            <T v={p.label} />
          </button>
        ))}
      </div>

      {/* Aggregate score + classification */}
      <div className="mt-6 grid items-center gap-5 sm:grid-cols-[auto_1fr]">
        <div className="text-center sm:text-left">
          <p className={`label-mono text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Civilizational equality", zh: "文明平等度" }} />
          </p>
          <p className="display font-mono text-6xl leading-none" style={{ color: ACCENT[shownScenario.k] }}>
            {shownScore.toFixed(0)}
            <span className="font-mono text-2xl text-ink-500">/100</span>
          </p>
        </div>
        <div className="panel rounded-lg p-4" style={{ borderColor: `${ACCENT[shownScenario.k]}33` }}>
          <p className={`display text-xl ${lang === "zh" ? "zh" : ""}`} style={{ color: ACCENT[shownScenario.k] }}>
            <span key={`${shownScenario.key}-${lang}`} className="lang-fade">
              {shownScenario.name[lang]}
            </span>
          </p>
          <p key={`${shownScenario.key}-desc-${lang}`} className={`lang-fade mt-2 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
            {shownScenario.desc[lang]}
          </p>
        </div>
      </div>

      {/* Formula */}
      <p className={`mt-3 text-xs leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
        <span className="font-mono text-ink-300">{lang === "zh" ? "平均 = " : "mean = "}</span>
        <T v={formula} />
      </p>

      <hr className="rule-eq mt-6" />

      {/* ── (b) The recursive engine ── */}
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label-mono text-ink-500">
              <T v={{ en: "Recursive engine", zh: "递归引擎" }} />
            </p>
            <p className={`mt-1 text-sm text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
              <T v={{ en: "Step the state through nine civilizational layers.", zh: "让状态穿过九个文明层级。" }} />
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className={`rounded-md border px-3.5 py-2 text-sm transition disabled:opacity-40 ${lang === "zh" ? "zh" : ""}`}
              style={{ borderColor: `${ACCENT.azure}55`, color: ACCENT.azure }}
            >
              <T v={{ en: "Run forward ▸", zh: "向前运行 ▸" }} />
            </button>
            {(traj.length > 0 || running) && (
              <button
                type="button"
                onClick={reset}
                className={`rounded-md border border-ink-100/10 px-3 py-2 text-sm text-ink-500 transition hover:text-ink-300 ${lang === "zh" ? "zh" : ""}`}
              >
                <T v={{ en: "Reset", zh: "重置" }} />
              </button>
            )}
          </div>
        </div>

        {/* Trajectory chart */}
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Equality trajectory across nine civilizational layers">
          {/* scenario bands */}
          {bands.map((b, i) => {
            const top = bands[i + 1]?.min ?? 100;
            const y0 = yAt(top);
            const y1 = yAt(b.min);
            return (
              <rect key={b.key} x={padL} y={y0} width={plotW} height={Math.max(0, y1 - y0)} fill={ACCENT[b.k]} fillOpacity={0.05} />
            );
          })}
          {/* band gridlines + labels */}
          {bands.map((b) => (
            <g key={`g-${b.key}`}>
              <line x1={padL} y1={yAt(b.min)} x2={W - padR} y2={yAt(b.min)} stroke={ACCENT[b.k]} strokeOpacity={0.18} strokeWidth={0.8} strokeDasharray="2 6" />
              <text x={padL + 4} y={yAt(b.min) - 4} fontSize={11} fontFamily="monospace" fill={ACCENT[b.k]} fillOpacity={0.55} className={lang === "zh" ? "zh" : ""}>
                {b.name[lang]}
              </text>
            </g>
          ))}

          {/* x-axis layer ticks */}
          {LAYERS.map((L, i) => {
            const idx = i + 1; // layer i sits at x position idx (base = 0)
            return (
              <g key={i}>
                <line x1={xAt(idx)} y1={padT} x2={xAt(idx)} y2={yAt(0)} stroke={ACCENT.silver} strokeOpacity={0.08} strokeWidth={0.6} />
                <text
                  x={xAt(idx)}
                  y={H - 14}
                  textAnchor="middle"
                  fontSize={11}
                  fill={idx <= step ? ACCENT.silver : ACCENT.silver}
                  fillOpacity={idx <= step ? 0.8 : 0.35}
                  className={lang === "zh" ? "zh" : ""}
                >
                  {L[lang]}
                </text>
              </g>
            );
          })}

          {/* the trajectory */}
          {trajPath && <path d={trajPath} fill="none" stroke={trajColor} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />}
          {traj.map((v, i) => (
            <circle key={i} cx={xAt(i)} cy={yAt(v)} r={i === traj.length - 1 ? 4 : 2.4} fill={i === traj.length - 1 ? trajColor : "var(--void-900, #080d1a)"} stroke={trajColor} strokeWidth={1.4} />
          ))}
          {/* moving head value */}
          {traj.length > 0 && (
            <text x={xAt(traj.length - 1)} y={yAt(traj[traj.length - 1]) - 10} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={trajColor}>
              {traj[traj.length - 1].toFixed(0)}
            </text>
          )}
        </svg>

        {/* Run verdict */}
        {finished && (
          <p key={`verdict-${climbing}-${lang}`} className={`lang-fade mt-3 text-sm leading-relaxed ${lang === "zh" ? "zh" : ""}`} style={{ color: trajColor }}>
            {runVerdict[lang]}
          </p>
        )}
        {finished && (
          <p className={`mt-2 text-sm text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Final state:", zh: "最终状态：" }} />{" "}
            <span style={{ color: ACCENT[shownScenario.k] }}>
              <span key={`final-${shownScenario.key}-${lang}`} className="lang-fade">
                {shownScenario.name[lang]}
              </span>
            </span>{" "}
            <span className="font-mono text-ink-500">({endScore.toFixed(0)}/100)</span>
          </p>
        )}
      </div>
    </div>
  );
}
