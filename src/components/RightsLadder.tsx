"use client";

import { useState } from "react";
import { useLang, T } from "./lang";
import { RIGHTS_LADDER, ACCENT } from "./content";

/**
 * The widening circle of rights.
 * An ascending staircase: each rung climbs up-and-right, and a horizontal
 * bar encodes `reach` — the share of people the rights protect. The set
 * ratchets upward through struggle, with an open edge to the future.
 */
export default function RightsLadder() {
  const { lang } = useLang();
  const [selected, setSelected] = useState(RIGHTS_LADDER.length - 1);

  const n = RIGHTS_LADDER.length;

  // SVG geometry. Steps stack bottom→top (earliest at the bottom).
  const W = 1000;
  const stepH = 58; // vertical pitch per rung
  const padT = 28;
  const padB = 36;
  const padL = 60;
  const padR = 40;
  const H = padT + padB + n * stepH;
  const plotW = W - padL - padR;
  const barMax = plotW; // a reach of 100 fills the plot width

  // Each rung i sits at a row; row 0 (earliest) at the bottom.
  const rowY = (i: number) => padT + (n - 1 - i) * stepH + stepH / 2;

  // Connecting path: a step line through the bar-ends, ascending up-and-right.
  const stepEndX = (reach: number) => padL + (barMax * reach) / 100;
  const connectorPts = RIGHTS_LADDER.map((r, i) => ({
    x: stepEndX(r.reach),
    y: rowY(i),
  }));
  // Build an L-shaped staircase polyline from earliest (bottom) to latest (top).
  let connector = "";
  for (let i = 0; i < connectorPts.length; i++) {
    const p = connectorPts[i];
    if (i === 0) {
      connector = `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    } else {
      const prev = connectorPts[i - 1];
      // vertical riser then horizontal tread
      connector += ` L ${prev.x.toFixed(1)} ${p.y.toFixed(1)} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
  }
  // Open future edge: continue upward-right past the last (top) rung.
  const top = connectorPts[connectorPts.length - 1];
  const futurePath = `M ${top.x.toFixed(1)} ${top.y.toFixed(1)} L ${top.x.toFixed(1)} ${(top.y - stepH * 0.55).toFixed(1)} L ${(top.x + 70).toFixed(1)} ${(top.y - stepH * 0.55).toFixed(1)}`;

  const active = RIGHTS_LADDER[selected];
  const activeHex = ACCENT[active.k];

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <div className="label-mono mb-2">
        <T v={{ en: "02 · The rights ratchet", zh: "02 · 权利的棘轮" }} />
      </div>
      <h3 className="display text-xl text-ink-50 md:text-2xl">
        <T v={{ en: "The widening circle of rights", zh: "权利之圆的扩张" }} />
      </h3>
      <p className={`mt-2 max-w-xl text-sm leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
        {lang === "zh"
          ? "每一级阶梯，是谁被算作完整的权利主体——那个圆只升不降，却唯有靠斗争才能向上扣动。"
          : "Each step is who counts as a full rights-bearer — the circle only ratchets upward, and only through struggle."}
      </p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ascending staircase */}
        <div>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            role="img"
            aria-label={lang === "zh" ? "权利扩张的阶梯" : "The ascending ladder of rights"}
          >
            <defs>
              <linearGradient id="rl-bar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={ACCENT.azure} stopOpacity="0.05" />
                <stop offset="100%" stopColor={ACCENT.azure} stopOpacity="0.28" />
              </linearGradient>
            </defs>

            {/* connecting staircase line between rungs */}
            <path
              d={connector}
              fill="none"
              stroke={ACCENT.silver}
              strokeOpacity={0.25}
              strokeWidth={1}
            />
            {/* animated leading edge into the open future */}
            <path
              className="flow"
              d={futurePath}
              fill="none"
              stroke={ACCENT.aura}
              strokeOpacity={0.7}
              strokeWidth={1.5}
              strokeDasharray="5 6"
            />
            <text
              x={top.x + 76}
              y={top.y - stepH * 0.55 + 4}
              fill={ACCENT.aura}
              fillOpacity={0.8}
              fontSize={12}
              className={lang === "zh" ? "zh" : ""}
              style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
            >
              {lang === "zh" ? "未来 →" : "future →"}
            </text>

            {/* rungs (bottom = earliest) */}
            {RIGHTS_LADDER.map((r, i) => {
              const hex = ACCENT[r.k];
              const y = rowY(i);
              const barEnd = stepEndX(r.reach);
              const isSel = i === selected;
              const barH = 16;
              return (
                <g
                  key={i}
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  style={{ cursor: "pointer" }}
                  tabIndex={0}
                  role="button"
                  aria-label={r.title[lang]}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") setSelected(i);
                  }}
                >
                  {/* full-width hit row */}
                  <rect x={0} y={y - stepH / 2} width={W} height={stepH} fill="transparent" />

                  {/* baseline tick */}
                  <line
                    x1={padL}
                    x2={padL}
                    y1={y - barH / 2 - 2}
                    y2={y + barH / 2 + 2}
                    stroke={ACCENT.silver}
                    strokeOpacity={0.2}
                    strokeWidth={1}
                  />

                  {/* reach bar */}
                  <rect
                    x={padL}
                    y={y - barH / 2}
                    width={Math.max(0, barEnd - padL)}
                    height={barH}
                    fill={isSel ? hex : "url(#rl-bar)"}
                    fillOpacity={isSel ? 0.32 : 1}
                    rx={2}
                  />
                  <rect
                    x={padL}
                    y={y - barH / 2}
                    width={Math.max(0, barEnd - padL)}
                    height={barH}
                    fill="none"
                    stroke={hex}
                    strokeOpacity={isSel ? 0.9 : 0.45}
                    strokeWidth={1}
                    rx={2}
                  />

                  {/* end-node marker */}
                  <circle
                    cx={barEnd}
                    cy={y}
                    r={isSel ? 5 : 3.5}
                    fill={isSel ? hex : "#0a0e1a"}
                    stroke={hex}
                    strokeWidth={1.5}
                  />

                  {/* when (mono, left of bar baseline, above) */}
                  <text
                    x={padL}
                    y={y - barH / 2 - 7}
                    fill={isSel ? hex : ACCENT.silver}
                    fillOpacity={isSel ? 1 : 0.6}
                    fontSize={12}
                    className={lang === "zh" ? "zh" : ""}
                    style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
                  >
                    {r.when[lang]}
                  </text>

                  {/* title (display, ACCENT[k], past the bar end) */}
                  <text
                    x={barEnd + 12}
                    y={y + 4}
                    fill={hex}
                    fillOpacity={isSel ? 1 : 0.78}
                    fontSize={15}
                    className={`display ${lang === "zh" ? "zh" : ""}`}
                  >
                    {r.title[lang]}
                  </text>

                  {/* reach numeral */}
                  <text
                    x={padL - 12}
                    y={y + 4}
                    fill={isSel ? hex : ACCENT.silver}
                    fillOpacity={isSel ? 1 : 0.45}
                    fontSize={12}
                    textAnchor="end"
                    style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
                  >
                    {r.reach}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* detail card for the selected rung */}
        <div className="lg:pt-1">
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
            <p className={`mt-3 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
              {active.desc[lang]}
            </p>

            <div className="rule-eq mt-5 h-px w-full opacity-60" />
            <div className="mt-3 flex items-baseline justify-between">
              <span className="label-mono">
                <T v={{ en: "Circle of reach", zh: "覆盖之圆" }} />
              </span>
              <span className="font-mono text-2xl tabular-nums" style={{ color: activeHex }}>
                {active.reach}
              </span>
            </div>
            <p className={`mt-2 text-xs leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
              {lang === "zh"
                ? "权利所保护之人的份额（0–100）。"
                : "The share of people these rights protect (0–100)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
