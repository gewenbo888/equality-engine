"use client";

import { ReactNode } from "react";
import { LangProvider, LangToggle, T, useLang } from "./lang";
import { SECTIONS, PANELS, TENSIONS, ACCENT } from "./content";
import BalanceCanvas from "./BalanceCanvas";
import CoordinationTimeline from "./CoordinationTimeline";
import HierarchyLab from "./HierarchyLab";
import RightsLadder from "./RightsLadder";
import WealthLab from "./WealthLab";
import MobilityLab from "./MobilityLab";
import AIFairnessDashboard from "./AIFairnessDashboard";
import CivilizationCompare from "./CivilizationCompare";
import FairnessGame from "./FairnessGame";
import FutureEqualitySim from "./FutureEqualitySim";
import EqualityModel from "./EqualityModel";

const VIS: Record<string, ReactNode> = {
  origin: <CoordinationTimeline />,
  biology: <HierarchyLab />,
  law: <RightsLadder />,
  economy: <WealthLab />,
  opportunity: <MobilityLab />,
  technology: <AIFairnessDashboard />,
  civilizations: <CivilizationCompare />,
  psychology: <FairnessGame />,
  future: <FutureEqualitySim />,
};

/* ---------- balance-scale emblem ---------- */
function Emblem({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className="block">
      <g fill="none" stroke="#5b8cff" strokeWidth="1.5" strokeLinecap="round">
        <line x1="16" y1="6.5" x2="16" y2="24" />
        <line x1="7.5" y1="10.5" x2="24.5" y2="10.5" />
        <path d="M7.5 10.5 L4.5 17 a3 3 0 0 0 6 0 Z" />
        <path d="M24.5 10.5 L21.5 17 a3 3 0 0 0 6 0 Z" />
        <line x1="11.5" y1="24" x2="20.5" y2="24" />
      </g>
      <circle cx="16" cy="6.5" r="1.6" fill="#e3b24f" />
    </svg>
  );
}

function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-ink-100/10 bg-void-950/80 px-5 py-3 backdrop-blur md:px-9">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border border-azure-500/30 bg-void-800"><Emblem /></div>
        <div className="leading-tight">
          <div className="display text-lg text-ink-50">Equality Engine</div>
          <div className="zh text-[0.62rem] text-ink-500">平等引擎</div>
        </div>
      </div>
      <nav className="hidden gap-5 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-500 lg:flex">
        <a href="#origin" className="hover:text-azure-400">Origin</a>
        <a href="#biology" className="hover:text-rose-400">Biology</a>
        <a href="#law" className="hover:text-gold-400">Law</a>
        <a href="#economy" className="hover:text-cyan-400">Economy</a>
        <a href="#civilizations" className="hover:text-gold-400">Civilizations</a>
        <a href="#future" className="hover:text-aura-400">Future</a>
        <a href="#model" className="hover:text-azure-400">Model</a>
      </nav>
      <div className="flex items-center gap-3">
        <LangToggle />
        <a href="https://psyverse.fun" className="hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-azure-400 hover:text-ink-50 sm:block">← Psyverse</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0 z-0"><BalanceCanvas /></div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-void-950/30 via-transparent to-void-950" />
      <div className="relative z-20 mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="label-mono">Psyverse · the structure of fairness</div>
        <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-ink-500">
          EN · 中文 · equality × hierarchy × justice × power × coordination
        </div>
        <h1 className="display mt-6 text-6xl leading-[0.95] text-ink-50 md:text-8xl">
          <span className="equality-text">Equality Engine</span>
        </h1>
        <h2 className="zh mt-3 text-3xl text-ink-200 md:text-5xl">平 等 引 擎</h2>

        <p className="mt-9 max-w-2xl font-serif text-lg leading-relaxed text-ink-100 md:text-xl">
          <T v={{
            en: "Human societies are held together by a constant negotiation — between equality and hierarchy, freedom and coordination, merit and solidarity. This is an atlas of that negotiation: how fairness emerged from survival, how power concentrates and resists constraint, and how every civilization, from the forager band to the AI-governed future, has had to answer one question — how do we act together without one of us swallowing the rest?",
            zh: "人类社会，靠一场不断的协商维系——在平等与等级、自由与协调、贤能与团结之间。这是一张关于那场协商的图志：公平如何从生存中浮现，权力如何集中、又如何抗拒约束，以及每一个文明——从采集部落到 AI 治理的未来——都不得不回答的同一个问题：我们如何共同行动，而不让其中一人吞噬其余？",
          }} />
        </p>

        <div className="mt-10 max-w-2xl panel rounded-lg p-6">
          <div className="label-mono">Central thesis · 核心论点</div>
          <p className="mt-3 font-serif text-xl leading-relaxed text-ink-50 md:text-2xl">
            <T v={{
              en: "Absolute equality may be impossible. Absolute inequality is unstable. Civilizations endure by continuously balancing fairness, dignity, opportunity, coordination and the distribution of power.",
              zh: "绝对的平等或许不可能。绝对的不平等则不稳定。文明之所以长存，靠的是不断地平衡——公平、尊严、机会、协调，与权力的分配。",
            }} />
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-500">
          <span>10 systems · 十大系统</span>
          <span>7 equality dimensions · 七维平等</span>
          <span>biology · law · economics · technology · AI</span>
        </div>
      </div>
    </section>
  );
}

/* The three great tensions, as a triptych */
function TensionTriptych() {
  const { lang } = useLang();
  return (
    <section className="relative border-t border-ink-100/10 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="label-mono">The balance · 三重张力</div>
          <h2 className="display mt-3 text-4xl text-ink-50 md:text-5xl">
            <T v={{ en: "Three tensions every society must hold", zh: "每个社会都必须承受的三重张力" }} />
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TENSIONS.map((tn) => {
            const c = ACCENT[tn.key];
            return (
              <div key={tn.han} className="panel relative overflow-hidden rounded-xl p-7 text-center">
                <div className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-32 w-32 rounded-full breathe" style={{ background: `radial-gradient(circle, ${c}44, transparent 70%)` }} />
                <div className="relative display text-7xl" style={{ color: c, textShadow: `0 0 40px ${c}88` }}>{tn.han}</div>
                <div className="mt-3 flex items-center justify-center gap-2 display text-xl text-ink-50">
                  <span key={"l" + lang} className={lang === "zh" ? "zh" : ""}>{tn.left[lang]}</span>
                  <span className="text-ink-500" style={{ color: c }}>⇄</span>
                  <span key={"r" + lang} className={lang === "zh" ? "zh" : ""}>{tn.right[lang]}</span>
                </div>
                <p key={"g" + lang} className={`lang-fade mt-4 font-serif text-[0.95rem] leading-relaxed text-ink-200 ${lang === "zh" ? "zh" : ""}`}>{tn.gloss[lang]}</p>
                <div className="mx-auto mt-5 h-px w-12" style={{ background: c, opacity: 0.5 }} />
                <p key={"q" + lang} className={`lang-fade mt-4 font-mono text-[0.66rem] italic leading-relaxed text-ink-500 ${lang === "zh" ? "zh" : ""}`}>{tn.question[lang]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ConceptPanels({ id }: { id: string }) {
  const { lang } = useLang();
  const set = PANELS[id];
  if (!set) return null;
  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {set.map((c, i) => (
        <div key={i} className="panel rounded-xl p-5">
          <div key={`t-${lang}`} className={`display text-xl lang-fade ${lang === "zh" ? "zh" : ""}`} style={{ color: c.k ? ACCENT[c.k] : "#5b8cff" }}>{c.t[lang]}</div>
          <p key={`d-${lang}`} className={`mt-2 text-sm leading-relaxed text-ink-300 lang-fade ${lang === "zh" ? "zh" : ""}`}>{c.d[lang]}</p>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({ num, id, title, sub, body, accent, vis }: {
  num: string; id: string; title: { en: string; zh: string }; sub: { en: string; zh: string }; body: { en: string; zh: string }; accent: keyof typeof ACCENT; vis?: ReactNode;
}) {
  const c = ACCENT[accent];
  return (
    <section id={id} className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline gap-4">
          <span className="display text-5xl" style={{ color: c, opacity: 0.4 }}>{num}</span>
          <div>
            <h2 className="display text-4xl text-ink-50 md:text-5xl"><T v={title} /></h2>
            <h3 className="mt-1 text-lg" style={{ color: c }}><T v={sub} /></h3>
          </div>
        </div>
        <div className="mt-5 h-px rule-eq opacity-70" />
        <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-ink-200"><T v={body} /></p>
        {vis && <div className="mt-12">{vis}</div>}
        <ConceptPanels id={id} />
      </div>
    </section>
  );
}

function Body() {
  const { lang } = useLang();
  return (
    <main className="relative bg-void-950 text-ink-100">
      <Header />
      <Hero />

      {/* marquee */}
      <div className="border-y border-ink-100/10 bg-void-900 py-2.5 overflow-hidden">
        <div className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.3em] text-azure-400/80">
          {(lang === "zh"
            ? "平等 · 等级 · 正义 · 公平 · 权利 · 权力 · 机会 · 流动 · 协调 · 尊严 · 法治 · 平等不是人人相同，而是平衡的协调、公平的参与与被约束的权力 · "
            : "EQUALITY · HIERARCHY · JUSTICE · FAIRNESS · RIGHTS · POWER · OPPORTUNITY · MOBILITY · COORDINATION · DIGNITY · RULE OF LAW · ").repeat(2)}
        </div>
      </div>

      <TensionTriptych />

      {SECTIONS.map((s) => (
        <SectionBlock key={s.id} num={s.num} id={s.id} title={s.title} sub={s.sub} body={s.body} accent={s.accent} vis={VIS[s.id]} />
      ))}

      {/* meta-model */}
      <section id="model" className="relative border-t border-ink-100/8 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-baseline gap-4">
            <span className="display text-5xl text-azure-500/40">10</span>
            <div>
              <div className="label-mono">Meta-model · 元模型</div>
              <h2 className="display mt-1 text-4xl text-ink-50 md:text-5xl">
                <T v={{ en: "The Unified Equality Model", zh: "统一平等模型" }} />
              </h2>
            </div>
          </div>
          <div className="mt-5 h-px rule-eq opacity-70" />
          <p className="mt-8 max-w-3xl font-serif text-lg leading-relaxed text-ink-200">
            <T v={{
              en: "Civilizational equality = fair opportunity + power distribution + legal protection + social mobility + information access + economic participation + dignity preservation. Score any society across these seven and its distinctive shape appears: the forager band spikes on power-sharing and dignity but is poor and lawless; Athens on political voice but rests on slavery; a caste society collapses on every axis; social democracy keeps all seven moderately high. Sustainable equality is not maximizing one axis — it is the rare art of holding all seven in balance at once.",
              zh: "文明平等 = 公平机会 + 权力分布 + 法律保护 + 社会流动 + 信息获取 + 经济参与 + 尊严维护。把任意一个社会在这七维上打分，它独特的形状便会显现：采集部落在权力共享与尊严上尖峰，却贫穷而无法；雅典在政治声音上尖峰，却建立在奴隶制之上；种姓社会在每一维上崩塌；社会民主使七维同时保持中高位。可持续的平等，并非把某一维最大化——而是同时把七维维持于平衡之中的、那门稀有的技艺。",
            }} />
          </p>
          <div className="mt-12"><EqualityModel /></div>
        </div>
      </section>

      {/* closing */}
      <section className="relative border-t border-ink-100/8 px-6 py-32 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="display text-4xl leading-snug text-ink-50 md:text-6xl">
            <T v={{ en: "Not everyone identical. Everyone counted.", zh: "并非人人相同。而是人人被算上。" }} />
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-serif text-lg leading-relaxed text-ink-300">
            <T v={{
              en: "Equality was never the demand that all people be the same. It is the demand that no one be treated as less than a full member of the human project — that power be constrained, that the process be fair, that dignity be preserved, and that the door to opportunity not be locked at birth. Civilizations rise by widening that circle and fall by letting power, wealth and rights pool in too few hands. The negotiation never ends; it only changes substrate — from the campfire, to the constitution, to the code we are now writing for the minds that will help govern what comes next.",
              zh: "平等从来不是「所有人都一样」的诉求。它是这样一个诉求：没有人应被当作「不足以成为人类共同事业之完整成员」者——权力应被约束，程序应当公平，尊严应被维护，而通往机会之门，不应在出生时便被锁上。文明因扩大那个圆而兴起，因任由权力、财富与权利汇聚于太少之手而衰落。这场协商永不终结；它只更换基底——从篝火，到宪法，再到我们如今正在为「将协助治理未来之心智」而书写的代码。",
            }} />
          </p>
          <div className="mx-auto mt-10 max-w-2xl rounded-lg border border-azure-500/25 bg-void-900 p-5">
            <p className="text-xs leading-relaxed text-ink-500">
              <T v={{
                en: "A conceptual and educational resource, drawing on political philosophy, economics, evolutionary biology, anthropology, law and the study of governance. It compares systems in good faith and takes no ideology as the final word — these questions remain, rightly, contested.",
                zh: "一份概念性、教育性的资料，取材于政治哲学、经济学、进化生物学、人类学、法律与治理研究。它以善意比较各种制度，不以任何意识形态为定论——这些问题，理应，悬而未决。",
              }} />
            </p>
          </div>
          <div className="mx-auto mt-12 h-px w-40 rule-eq" />
          <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-azure-400/70">
            Equality Engine · 平等引擎 · Psyverse · 2026
          </p>
        </div>
      </section>

      <footer className="border-t border-ink-100/10 bg-void-950 px-6 py-16 md:px-12">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2"><Emblem size={22} /><span className="display text-xl text-ink-50">Equality Engine</span></div>
            <div className="zh mt-1 text-sm text-ink-300">平等引擎</div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
              <T v={{ en: "The nature of equality, justice, power, rights and civilizational coordination.", zh: "平等、正义、权力、权利与文明协调的本质。" }} />
            </p>
          </div>
          <div>
            <div className="label-mono">Systems · 系统</div>
            <ul className="mt-4 space-y-1.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-500">
              {SECTIONS.slice(0, 6).map((s) => (
                <li key={s.id}><a href={`#${s.id}`} className="hover:text-azure-400">{s.num} · <T v={s.title} /></a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="label-mono">Companion archives</div>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-300">
              <li><a href="https://great-convergence.psyverse.fun" className="hover:text-azure-300">The Great Convergence · 大汇流</a></li>
              <li><a href="https://truth-goodness-beauty.psyverse.fun" className="hover:text-azure-300">Truth · Goodness · Beauty · 真善美</a></li>
              <li><a href="https://meta-civilization.psyverse.fun" className="hover:text-azure-300">Meta-Civilization · 元文明</a></li>
              <li className="pt-3"><a href="https://psyverse.fun" className="text-azure-400 hover:text-ink-50">↩ All Psyverse archives</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 h-px max-w-7xl rule-eq" />
        <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between text-[0.58rem] uppercase tracking-[0.3em] text-ink-500">
          <div>© 2026 Gewenbo · Psyverse</div>
          <div>EN · 中文 · educational</div>
        </div>
      </footer>
    </main>
  );
}

export default function EqualityEngine() {
  return (
    <LangProvider>
      <Body />
    </LangProvider>
  );
}
