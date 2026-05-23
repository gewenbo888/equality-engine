"use client";

import { useState } from "react";
import { EQ_SYSTEMS, EQ_DIMS } from "./content";
import { useLang } from "./lang";

/** Civilizational Equality — a seven-axis radar over societies and systems. */
export default function EqualityModel() {
  const { lang } = useLang();
  const [sel, setSel] = useState(EQ_SYSTEMS[5].key); // Social democracy
  const s = EQ_SYSTEMS.find((x) => x.key === sel)!;
  const dims = EQ_DIMS;
  const n = dims.length;
  const cx = 200, cy = 200, R = 150;

  const val = (key: string) => (s as unknown as Record<string, number>)[key];
  const pt = (i: number, v: number) => {
    const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
    const r = (v / 100) * R;
    return [cx + Math.cos(ang) * r, cy + Math.sin(ang) * r];
  };
  const poly = dims.map((d, i) => pt(i, val(d.key)).join(",")).join(" ");
  const score = Math.round(dims.reduce((a, d) => a + val(d.key), 0) / n);

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <div className="mb-6 flex flex-wrap gap-2">
        {EQ_SYSTEMS.map((vs) => (
          <button
            key={vs.key}
            onClick={() => setSel(vs.key)}
            className={`rounded-full border px-3 py-1 font-mono text-[0.68rem] transition ${sel === vs.key ? "border-transparent text-void-950" : "border-ink-100/20 text-ink-300 hover:text-ink-50"}`}
            style={sel === vs.key ? { background: vs.accent } : undefined}
          >
            <span className={lang === "zh" ? "zh" : ""}>{vs.name[lang]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[400px_1fr]">
        <svg viewBox="-92 -12 624 424" className="block w-full">
          {[0.25, 0.5, 0.75, 1].map((f, i) => (
            <polygon
              key={i}
              points={dims.map((_, j) => {
                const ang = (j / n) * Math.PI * 2 - Math.PI / 2;
                return [cx + Math.cos(ang) * R * f, cy + Math.sin(ang) * R * f].join(",");
              }).join(" ")}
              fill="none" stroke="#11203c" strokeWidth="0.8"
            />
          ))}
          {dims.map((d, i) => {
            const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
            const ex = cx + Math.cos(ang) * R, ey = cy + Math.sin(ang) * R;
            const lx = cx + Math.cos(ang) * (R + 32), ly = cy + Math.sin(ang) * (R + 24);
            return (
              <g key={i}>
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#0e1a30" strokeWidth="0.8" />
                <text x={lx} y={ly} textAnchor={Math.abs(Math.cos(ang)) < 0.3 ? "middle" : Math.cos(ang) > 0 ? "start" : "end"} dominantBaseline="middle" fontFamily="IBM Plex Mono" fontSize="8.5" fill="#7d89a8">
                  <tspan className={lang === "zh" ? "zh" : ""}>{d.label[lang]}</tspan>
                </text>
              </g>
            );
          })}
          <polygon points={poly} fill={s.accent} fillOpacity="0.18" stroke={s.accent} strokeWidth="2" />
          {dims.map((d, i) => {
            const [px, py] = pt(i, val(d.key));
            return <circle key={i} cx={px} cy={py} r="3.6" fill={s.accent} />;
          })}
        </svg>

        <div>
          <div className="label-mono">{lang === "zh" ? "文明平等强度" : "Civilizational equality"}</div>
          <div key={sel + lang} className={`display lang-fade mt-1 text-2xl text-ink-50 ${lang === "zh" ? "zh" : ""}`}>{s.name[lang]} <span className="text-base text-ink-500">· {s.era[lang]}</span></div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="display text-6xl" style={{ color: s.accent }}>{score}</span>
            <span className="text-ink-500">/ 100</span>
          </div>
          <p key={"n" + sel + lang} className={`lang-fade mt-3 max-w-md font-serif text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>{s.note[lang]}</p>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5">
            {dims.map((d) => (
              <div key={d.key} className="flex items-center justify-between gap-2 border-b border-ink-100/8 pb-1">
                <span className={`font-mono text-[0.62rem] text-ink-500 ${lang === "zh" ? "zh" : ""}`}>{d.label[lang]}</span>
                <span className="font-mono text-xs" style={{ color: s.accent }}>{val(d.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
