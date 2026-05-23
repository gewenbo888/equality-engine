"use client";

import { useMemo, useState } from "react";
import { useLang, T, type Bi } from "./lang";
import { SPECIES, ACCENT, type Species } from "./content";

/* Abstract per-species glyph, drawn at a small fixed box (16×16 viewBox).
   Despotic forms read as pyramids/points; egalitarian forms read as rings/loops. */
function Glyph({ shape, color }: { shape: string; color: string }) {
  const common = { stroke: color, strokeWidth: 1.4, fill: "none" } as const;
  return (
    <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true">
      {shape === "caste" && (
        // ordered rows — castes by birth
        <g {...common}>
          <line x1={3} y1={5} x2={13} y2={5} />
          <line x1={4} y1={8} x2={12} y2={8} />
          <line x1={5} y1={11} x2={11} y2={11} />
        </g>
      )}
      {shape === "pyramid" && (
        // dominance pyramid
        <g {...common}>
          <path d="M8 3 L13 13 L3 13 Z" />
          <circle cx={8} cy={6} r={1.1} fill={color} stroke="none" />
        </g>
      )}
      {shape === "family" && (
        // a pair leading a small group
        <g {...common}>
          <circle cx={6} cy={6} r={2} />
          <circle cx={10} cy={6} r={2} />
          <path d="M4 12 q4 -3 8 0" />
        </g>
      )}
      {shape === "coalition" && (
        // overlapping alliance rings
        <g {...common}>
          <circle cx={6.5} cy={8} r={3.5} />
          <circle cx={9.5} cy={8} r={3.5} />
        </g>
      )}
      {shape === "ring" && (
        // a level circle of equals
        <g {...common}>
          <circle cx={8} cy={8} r={4.5} />
          <circle cx={8} cy={3.5} r={0.9} fill={color} stroke="none" />
          <circle cx={12.5} cy={8} r={0.9} fill={color} stroke="none" />
          <circle cx={8} cy={12.5} r={0.9} fill={color} stroke="none" />
          <circle cx={3.5} cy={8} r={0.9} fill={color} stroke="none" />
        </g>
      )}
      {shape === "split" && (
        // two minds: egalitarian instinct + restratified
        <g {...common}>
          <circle cx={8} cy={8} r={5} />
          <path d="M8 3 L8 13" />
          <circle cx={5.5} cy={8} r={0.9} fill={color} stroke="none" />
        </g>
      )}
    </svg>
  );
}

const GLYPH: Record<string, string> = {
  ants: "caste",
  chimps: "pyramid",
  wolves: "family",
  bonobos: "coalition",
  foragers: "ring",
  modern: "split",
};

export default function HierarchyLab() {
  const { lang } = useLang();
  const [selectedKey, setSelectedKey] = useState<string>("foragers");

  const selected: Species =
    SPECIES.find((s) => s.key === selectedKey) ?? SPECIES[0];

  // Stagger marker label rows so close-by dots don't collide.
  const sorted = useMemo(
    () => [...SPECIES].sort((a, b) => a.egalitarian - b.egalitarian),
    []
  );
  const labelRow = useMemo(() => {
    const rows = new Map<string, number>();
    let prevX = -Infinity;
    let level = 0;
    for (const s of sorted) {
      if (s.egalitarian - prevX < 16) level = level === 0 ? 1 : 0;
      else level = 0;
      rows.set(s.key, level);
      prevX = s.egalitarian;
    }
    return rows;
  }, [sorted]);

  const trackY = 56;
  const W = 100; // SVG user units on x (percent-like)

  const posLabel: Bi = {
    en:
      selected.egalitarian <= 33
        ? "Toward dominance — power concentrated"
        : selected.egalitarian >= 67
        ? "Toward coalition — power dispersed"
        : "In the middle — re-balancing",
    zh:
      selected.egalitarian <= 33
        ? "趋向支配——权力集中"
        : selected.egalitarian >= 67
        ? "趋向联盟——权力分散"
        : "居于中间——重新平衡",
  };

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <p className="label-mono text-ink-500">
        <T v={{ en: "Lab · The hierarchy spectrum", zh: "实验 · 等级光谱" }} />
      </p>
      <h3 className="display mt-2 text-2xl text-ink-50 md:text-3xl">
        <T v={{ en: "Is hierarchy inevitable?", zh: "等级是否不可避免？" }} />
      </h3>
      <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "Look across the social animals — including our two closest cousins — and the same species can sit anywhere from despotism to fierce equality. The arrangement is not fixed by nature.",
            zh: "环视群居动物——包括我们最近的两位表亲——同一物种可落在从专制到激烈平等之间的任何位置。这一安排，并非由自然所固定。",
          }}
        />
      </p>

      {/* Spectrum */}
      <div className="mt-7">
        <div className="flex items-center justify-between">
          <span className={`label-mono text-rose-400 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Despotic · dominance", zh: "专制 · 支配" }} />
          </span>
          <span className={`label-mono text-azure-400 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Egalitarian · coalition", zh: "平等 · 联盟" }} />
          </span>
        </div>

        <svg
          viewBox="0 0 100 84"
          className="mt-2 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="Hierarchy spectrum from dominance to equality"
        >
          <defs>
            <linearGradient id="hl-track" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={ACCENT.rose} stopOpacity={0.85} />
              <stop offset="50%" stopColor={ACCENT.silver} stopOpacity={0.45} />
              <stop offset="100%" stopColor={ACCENT.azure} stopOpacity={0.85} />
            </linearGradient>
          </defs>

          {/* gradient track */}
          <rect x={2} y={trackY - 1} width={W - 4} height={2} rx={1} fill="url(#hl-track)" />
          {/* tick midline */}
          <line
            x1={W / 2}
            y1={trackY - 6}
            x2={W / 2}
            y2={trackY + 6}
            stroke={ACCENT.silver}
            strokeOpacity={0.18}
            strokeWidth={0.4}
          />

          {SPECIES.map((s) => {
            const x = 2 + (s.egalitarian / 100) * (W - 4);
            const isSel = s.key === selectedKey;
            const c = ACCENT[s.k];
            const row = labelRow.get(s.key) ?? 0;
            const ly = row === 0 ? trackY - 12 : trackY + 18;
            return (
              <g
                key={s.key}
                onMouseEnter={() => setSelectedKey(s.key)}
                onClick={() => setSelectedKey(s.key)}
                style={{ cursor: "pointer" }}
              >
                {/* generous transparent hit target */}
                <rect x={x - 6} y={trackY - 24} width={12} height={48} fill="transparent" />
                {/* connector */}
                <line
                  x1={x}
                  y1={trackY}
                  x2={x}
                  y2={ly + (row === 0 ? 4 : -4)}
                  stroke={c}
                  strokeOpacity={isSel ? 0.5 : 0.22}
                  strokeWidth={0.4}
                />
                {/* dot */}
                <circle
                  cx={x}
                  cy={trackY}
                  r={isSel ? 2.6 : 1.7}
                  fill={isSel ? c : "#050810"}
                  stroke={c}
                  strokeWidth={isSel ? 0.8 : 0.9}
                />
                {isSel && (
                  <circle
                    cx={x}
                    cy={trackY}
                    r={4.4}
                    fill="none"
                    stroke={c}
                    strokeOpacity={0.4}
                    strokeWidth={0.4}
                  />
                )}
                <text
                  x={x}
                  y={ly}
                  textAnchor="middle"
                  className={lang === "zh" ? "zh" : ""}
                  fontSize={3}
                  fill={isSel ? c : ACCENT.silver}
                  fillOpacity={isSel ? 1 : 0.6}
                  style={{ fontWeight: isSel ? 600 : 400 }}
                >
                  {s.name[lang]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selectable chips (accessible, keyboard-friendly mirror of the dots) */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SPECIES.map((s) => {
          const isSel = s.key === selectedKey;
          const c = ACCENT[s.k];
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSelectedKey(s.key)}
              aria-pressed={isSel}
              className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition ${
                isSel ? "border-ink-100/30 bg-void-800/70" : "border-ink-100/10 hover:border-ink-100/20"
              } ${lang === "zh" ? "zh" : ""}`}
              style={isSel ? { color: c } : { color: ACCENT.silver }}
            >
              <Glyph shape={GLYPH[s.key] ?? "ring"} color={isSel ? c : ACCENT.silver} />
              <span key={lang}>{s.name[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* Detail card */}
      <div
        key={selectedKey + lang}
        className="lang-fade panel mt-5 rounded-lg p-5"
        style={{ borderColor: `${ACCENT[selected.k]}33` }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Glyph shape={GLYPH[selected.key] ?? "ring"} color={ACCENT[selected.k]} />
            <div>
              <p
                className={`display text-xl md:text-2xl ${lang === "zh" ? "zh" : ""}`}
                style={{ color: ACCENT[selected.k] }}
              >
                {selected.name[lang]}
              </p>
              <p className={`mt-0.5 text-xs text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
                {posLabel[lang]}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl text-ink-100">{selected.egalitarian}</span>
            <span className="font-mono text-xs text-ink-500">/100</span>
          </div>
        </div>

        {/* mini position bar */}
        <div className="mt-4 h-px w-full bg-ink-100/10" />
        <div className="relative mt-3 h-1 w-full rounded bg-void-800">
          <div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            style={{
              left: `calc(${selected.egalitarian}% - 5px)`,
              backgroundColor: ACCENT[selected.k],
            }}
          />
        </div>

        <p className={`mt-4 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
          {selected.structure[lang]}
        </p>

        <blockquote
          className={`mt-4 border-l pl-4 text-base italic leading-relaxed ${lang === "zh" ? "zh" : ""}`}
          style={{ borderColor: ACCENT[selected.k], color: ACCENT[selected.k] }}
        >
          {selected.lesson[lang]}
        </blockquote>
      </div>

      <hr className="rule-eq mt-6" />
      <p className={`mt-4 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "The verdict: hierarchy is not inevitable, but neither is equality automatic. We run hierarchical software on egalitarian hardware — built by millions of years as fierce-fairness apes, then re-stratified in ten thousand years of surplus.",
            zh: "结论：等级并非不可避免，但平等也非自动到来。我们在平等主义的硬件上，运行着等级制的软件——由数百万年「激烈求公平」的猿类塑成，又在一万年的盈余中被重新分层。",
          }}
        />
      </p>
    </div>
  );
}
