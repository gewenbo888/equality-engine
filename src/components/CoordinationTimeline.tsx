"use client";

import { useMemo, useState } from "react";
import { useLang, T } from "./lang";
import { COORD_TIMELINE, ACCENT } from "./content";

/**
 * The equality index across history.
 * A luminous curve through 10 epochs (x = time, y = equality 0–100),
 * with selectable nodes and a detail card for the chosen epoch.
 */
export default function CoordinationTimeline() {
  const { lang } = useLang();
  const [selected, setSelected] = useState(0);

  // Chart geometry in viewBox units.
  const W = 1000;
  const H = 440;
  const padL = 56;
  const padR = 28;
  const padT = 36;
  const padB = 64;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const n = COORD_TIMELINE.length;

  const points = useMemo(
    () =>
      COORD_TIMELINE.map((e, i) => {
        const x = padL + (n === 1 ? plotW / 2 : (plotW * i) / (n - 1));
        const y = padT + plotH * (1 - e.equality / 100);
        return { x, y };
      }),
    [n, plotW, plotH],
  );

  // Smooth Catmull-Rom → cubic Bézier path through the points.
  const linePath = useMemo(() => {
    if (points.length < 2) return "";
    const d: string[] = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const t = 0.5; // tension / 6 smoothing factor reciprocal
      const c1x = p1.x + ((p2.x - p0.x) / 6) * t * 2;
      const c1y = p1.y + ((p2.y - p0.y) / 6) * t * 2;
      const c2x = p2.x - ((p3.x - p1.x) / 6) * t * 2;
      const c2y = p2.y - ((p3.y - p1.y) / 6) * t * 2;
      d.push(
        `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
      );
    }
    return d.join(" ");
  }, [points]);

  const areaPath = useMemo(() => {
    if (!linePath) return "";
    const first = points[0];
    const last = points[points.length - 1];
    const baseY = padT + plotH;
    return `${linePath} L ${last.x.toFixed(2)} ${baseY.toFixed(2)} L ${first.x.toFixed(2)} ${baseY.toFixed(2)} Z`;
  }, [linePath, points, plotH]);

  // Horizontal gridlines at 0 / 50 / 100.
  const gridYs = [0, 50, 100].map((v) => ({
    v,
    y: padT + plotH * (1 - v / 100),
  }));

  const active = COORD_TIMELINE[selected];
  const activeHex = ACCENT[active.k];

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <div className="label-mono mb-2">
        <T v={{ en: "01 · Coordination timeline", zh: "01 · 协调的时间线" }} />
      </div>
      <h3 className="display text-xl text-ink-50 md:text-2xl">
        <T
          v={{
            en: "The equality index across history",
            zh: "贯穿历史的平等指数",
          }}
        />
      </h3>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Chart */}
        <div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={lang === "zh" ? "平等指数曲线" : "Equality index curve"}
          >
            <defs>
              <linearGradient id="ct-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT.azure} stopOpacity="0.34" />
                <stop offset="60%" stopColor={ACCENT.azure} stopOpacity="0.08" />
                <stop offset="100%" stopColor={ACCENT.azure} stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ct-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={ACCENT.azure} />
                <stop offset="100%" stopColor={ACCENT.aura} />
              </linearGradient>
            </defs>

            {/* gridlines */}
            {gridYs.map((g) => (
              <line
                key={g.v}
                x1={padL}
                x2={W - padR}
                y1={g.y}
                y2={g.y}
                stroke={ACCENT.silver}
                strokeOpacity={0.1}
                strokeWidth={1}
              />
            ))}

            {/* y-axis hint: more equal (top) / more hierarchical (bottom) */}
            <text
              x={14}
              y={padT + 4}
              fill={ACCENT.silver}
              fillOpacity={0.55}
              fontSize={13}
              transform={`rotate(-90 14 ${padT + 4})`}
              className={lang === "zh" ? "zh" : ""}
              style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
            >
              {lang === "zh" ? "更平等 ↑" : "more equal ↑"}
            </text>
            <text
              x={14}
              y={padT + plotH}
              fill={ACCENT.silver}
              fillOpacity={0.45}
              fontSize={13}
              transform={`rotate(-90 14 ${padT + plotH})`}
              className={lang === "zh" ? "zh" : ""}
              style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
            >
              {lang === "zh" ? "更等级化 ↓" : "more hierarchical ↓"}
            </text>

            {/* area + line */}
            <path d={areaPath} fill="url(#ct-area)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#ct-line)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* nodes */}
            {points.map((p, i) => {
              const e = COORD_TIMELINE[i];
              const hex = ACCENT[e.k];
              const isSel = i === selected;
              return (
                <g
                  key={i}
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  style={{ cursor: "pointer" }}
                  tabIndex={0}
                  role="button"
                  aria-label={e.title[lang]}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") setSelected(i);
                  }}
                >
                  {/* selection halo */}
                  {isSel && (
                    <circle cx={p.x} cy={p.y} r={11} fill={hex} fillOpacity={0.18} />
                  )}
                  {/* generous hit target */}
                  <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSel ? 6 : 4}
                    fill={isSel ? hex : "#0a0e1a"}
                    stroke={hex}
                    strokeWidth={1.5}
                  />
                  {/* equality numeral above selected node */}
                  {isSel && (
                    <text
                      x={p.x}
                      y={p.y - 16}
                      fill={hex}
                      fontSize={13}
                      textAnchor="middle"
                      style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
                    >
                      {e.equality}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* selectable epoch labels (the `when` values) */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
            {COORD_TIMELINE.map((e, i) => {
              const hex = ACCENT[e.k];
              const isSel = i === selected;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  className={`text-[0.7rem] font-mono tracking-wide transition ${
                    lang === "zh" ? "zh" : ""
                  } ${isSel ? "" : "text-ink-500 hover:text-ink-300"}`}
                  style={isSel ? { color: hex } : undefined}
                  aria-pressed={isSel}
                >
                  {e.when[lang]}
                </button>
              );
            })}
          </div>
        </div>

        {/* detail card */}
        <div className="lg:pt-2">
          <div
            key={selected}
            className="lang-fade rounded-lg border border-ink-100/10 bg-void-950/50 p-5"
            style={{ borderLeft: `2px solid ${activeHex}` }}
          >
            <div
              className={`font-mono text-[0.72rem] tracking-wide ${lang === "zh" ? "zh" : ""}`}
              style={{ color: activeHex }}
            >
              {active.when[lang]}
            </div>
            <h4
              className={`display mt-2 text-lg leading-snug ${lang === "zh" ? "zh" : ""}`}
              style={{ color: activeHex }}
            >
              {active.title[lang]}
            </h4>
            <p
              className={`mt-3 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}
            >
              {active.desc[lang]}
            </p>

            <div className="rule-eq mt-5 h-px w-full opacity-60" />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="label-mono">
                <T v={{ en: "Equality index", zh: "平等指数" }} />
              </span>
              <span
                className="font-mono text-2xl tabular-nums"
                style={{ color: activeHex }}
              >
                {active.equality}
              </span>
            </div>
          </div>

          <p className={`mt-4 text-xs leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            {lang === "zh"
              ? "高于采集者；随国家与种姓崩塌；在大拉平中部分回升；在此刻分岔。"
              : "High among foragers; it collapses with states and castes; partially recovers in the great leveling; and forks at the present."}
          </p>
        </div>
      </div>
    </div>
  );
}
