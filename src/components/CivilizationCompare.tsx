"use client";

import { useState } from "react";
import { useLang, T, type Bi, type Lang } from "./lang";
import { CIVILIZATIONS, type Civilization } from "./content";

type BarKey = "legal" | "mobility" | "voice" | "floor";

const BAR_META: { key: BarKey; label: Bi }[] = [
  { key: "legal", label: { en: "Legal protection", zh: "法律保护" } },
  { key: "mobility", label: { en: "Social mobility", zh: "社会流动" } },
  { key: "voice", label: { en: "Political voice", zh: "政治声音" } },
  { key: "floor", label: { en: "Social floor", zh: "社会底线" } },
];

/* Full-size labeled equality profile for the selected civilization. */
function Profile({ civ, lang }: { civ: Civilization; lang: Lang }) {
  return (
    <div className="space-y-3">
      {BAR_META.map((b) => {
        const v = civ[b.key];
        return (
          <div key={b.key}>
            <div className="flex items-baseline justify-between">
              <span className={`text-xs text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
                {b.label[lang]}
              </span>
              <span className="font-mono text-xs text-ink-500">{v}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-void-800">
              <div
                className="h-full rounded"
                style={{ width: `${v}%`, backgroundColor: civ.accent, opacity: 0.85 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Compact small-multiple row used in the overview grid. */
function MiniRow({
  civ,
  lang,
  active,
  onSelect,
}: {
  civ: Civilization;
  lang: Lang;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`block w-full rounded-md border p-3 text-left transition ${
        active ? "border-ink-100/25 bg-void-800/60" : "border-ink-100/10 hover:border-ink-100/20"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`truncate text-xs ${lang === "zh" ? "zh" : ""}`}
          style={{ color: active ? civ.accent : undefined }}
        >
          <span className={active ? "" : "text-ink-300"}>{civ.name[lang]}</span>
        </span>
        <span className={`shrink-0 font-mono text-[0.6rem] text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
          {civ.era[lang]}
        </span>
      </div>
      <div className="mt-2 space-y-1.5">
        {BAR_META.map((b) => (
          <div key={b.key} className="flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded bg-void-800">
              <div
                className="h-full rounded"
                style={{ width: `${civ[b.key]}%`, backgroundColor: civ.accent, opacity: 0.7 }}
              />
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}

export default function CivilizationCompare() {
  const { lang } = useLang();
  const [selectedKey, setSelectedKey] = useState<string>("athens");

  const civ: Civilization =
    CIVILIZATIONS.find((c) => c.key === selectedKey) ?? CIVILIZATIONS[0];

  return (
    <div className="rounded-xl border border-ink-100/10 bg-void-900/70 p-5 md:p-7">
      <p className="label-mono text-ink-500">
        <T v={{ en: "Engine · Civilization comparison", zh: "引擎 · 文明对照" }} />
      </p>
      <h3 className="display mt-2 text-2xl text-ink-50 md:text-3xl">
        <T v={{ en: "Many answers to one question", zh: "对同一问题的众多作答" }} />
      </h3>
      <p className={`mt-3 max-w-2xl text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "Every civilization had to decide who counts as a full member and how power could move. None solved equality. Each struck a characteristic bargain — strong on one axis, blind on another.",
            zh: "每一种文明都必须决定：谁算作完整的成员，以及权力如何流动。无一解决了平等。每一个都做出了特有的交易——在某一维度上强大，在另一维度上盲目。",
          }}
        />
      </p>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CIVILIZATIONS.map((c) => {
          const isSel = c.key === selectedKey;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelectedKey(c.key)}
              aria-pressed={isSel}
              className={`rounded-md border px-3 py-1.5 text-xs transition ${
                isSel ? "bg-void-800/70" : "border-ink-100/10 text-ink-300 hover:border-ink-100/20"
              } ${lang === "zh" ? "zh" : ""}`}
              style={
                isSel
                  ? { borderColor: `${c.accent}99`, color: c.accent }
                  : undefined
              }
            >
              <span key={lang}>{c.name[lang]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected card */}
      <div
        key={selectedKey + lang}
        className="lang-fade panel mt-5 rounded-lg p-5 md:p-6"
        style={{ borderColor: `${civ.accent}33` }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4
            className={`display text-xl md:text-2xl ${lang === "zh" ? "zh" : ""}`}
            style={{ color: civ.accent }}
          >
            {civ.name[lang]}
          </h4>
          <span className={`label-mono text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            {civ.era[lang]}
          </span>
        </div>

        <p className={`mt-3 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
          {civ.governance[lang]}
        </p>

        {/* Circle of citizenship — highlighted */}
        <div
          className="relic mt-5 rounded-lg p-4"
          style={{ borderColor: `${civ.accent}40` }}
        >
          <p className={`label-mono ${lang === "zh" ? "zh" : ""}`} style={{ color: civ.accent }}>
            <T v={{ en: "The circle of citizenship", zh: "公民资格之圆" }} />
          </p>
          <p className={`mt-2 text-sm leading-relaxed text-ink-100 ${lang === "zh" ? "zh" : ""}`}>
            {civ.circle[lang]}
          </p>
          <p className={`mt-3 text-xs italic leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
            {civ.ladder[lang]}
          </p>
        </div>

        {/* Strength vs blindspot split */}
        <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-ink-100/10 bg-ink-100/10 md:grid-cols-2">
          <div className="bg-void-900/80 p-4">
            <p className="label-mono text-azure-400">
              <T v={{ en: "Strength", zh: "长处" }} />
            </p>
            <p className={`mt-2 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
              {civ.strength[lang]}
            </p>
          </div>
          <div className="bg-void-900/80 p-4">
            <p className="label-mono text-rose-400">
              <T v={{ en: "Blind spot", zh: "盲点" }} />
            </p>
            <p className={`mt-2 text-sm leading-relaxed text-ink-300 ${lang === "zh" ? "zh" : ""}`}>
              {civ.blindspot[lang]}
            </p>
          </div>
        </div>

        {/* Equality profile */}
        <div className="mt-6">
          <p className={`label-mono mb-3 text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
            <T v={{ en: "Equality profile", zh: "平等剖面" }} />
          </p>
          <Profile civ={civ} lang={lang} />
        </div>
      </div>

      {/* Overview small multiples */}
      <hr className="rule-eq mt-7" />
      <p className={`label-mono mt-5 text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
        <T v={{ en: "The whole trade-space", zh: "全部权衡空间" }} />
      </p>
      <p className={`mt-2 max-w-2xl text-xs leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>
        <T
          v={{
            en: "No civilization solved equality; each made a characteristic bargain. Scan all six at once.",
            zh: "没有任何文明解决了平等；每一个都做出了特有的交易。一次扫视全部六者。",
          }}
        />
      </p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CIVILIZATIONS.map((c) => (
          <MiniRow
            key={c.key}
            civ={c}
            lang={lang}
            active={c.key === selectedKey}
            onSelect={() => setSelectedKey(c.key)}
          />
        ))}
      </div>
    </div>
  );
}
