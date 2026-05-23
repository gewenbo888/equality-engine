"use client";

import { useEffect, useRef } from "react";

/**
 * Hero field: a deep navy void in which two luminous poles — equality (azure)
 * and hierarchy (rose) — hold a population of nodes between them. The nodes
 * drift and link into a constellation that is forever rebalancing; a faint
 * level-line (the balance beam) tilts and re-levels overhead. Nothing settles
 * completely. Coordination, made visible.
 */
const AZURE = "91,140,255";
const ROSE = "255,111,145";
const CYAN = "63,209,199";
const GOLD = "227,178,79";
const HUES = [AZURE, AZURE, CYAN, GOLD, ROSE];

export default function BalanceCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w = (canvas.width = canvas.clientWidth * dpr);
    let h = (canvas.height = canvas.clientHeight * dpr);

    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: string };
    const COUNT = Math.min(70, Math.floor((w * h) / (28000 * dpr)));
    const LINK = 130 * dpr;
    const mk = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
      r: (0.8 + Math.random() * 2) * dpr,
      hue: HUES[(Math.random() * HUES.length) | 0],
    });
    const ps: P[] = Array.from({ length: COUNT }, mk);

    const onResize = () => {
      w = canvas.width = canvas.clientWidth * dpr;
      h = canvas.height = canvas.clientHeight * dpr;
    };
    window.addEventListener("resize", onResize);

    // two attractor poles — equality (left) and hierarchy (right)
    const poles = () => {
      const cy = h * 0.5;
      const sway = Math.sin(t * 0.006) * h * 0.05;
      return [
        { x: w * 0.32, y: cy + sway, hue: AZURE },
        { x: w * 0.68, y: cy - sway, hue: ROSE },
      ];
    };

    const drawPole = (x: number, y: number, hue: string, R: number) => {
      const b = 0.55 + 0.45 * Math.sin(t * 0.02 + (hue === AZURE ? 0 : 2.4));
      const g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, `rgba(${hue},${0.18 + b * 0.14})`);
      g.addColorStop(0.5, `rgba(${hue},${0.05 + b * 0.04})`);
      g.addColorStop(1, `rgba(${hue},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, (2.6 + b * 1.4) * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hue},${0.7 + b * 0.3})`;
      ctx.fill();
    };

    // the balance beam — a level line that tilts then re-levels, fulcrum at centre
    const drawBeam = () => {
      const cx = w * 0.5, cy = h * 0.2;
      const ang = Math.sin(t * 0.008) * 0.06; // tips and re-levels
      const len = Math.min(w, h) * 0.34;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);
      ctx.strokeStyle = "rgba(180,192,219,0.16)";
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.moveTo(-len, 0);
      ctx.lineTo(len, 0);
      ctx.stroke();
      // pans
      for (const s of [-1, 1]) {
        const px = s * len;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px - 12 * dpr, 26 * dpr);
        ctx.lineTo(px + 12 * dpr, 26 * dpr);
        ctx.closePath();
        ctx.strokeStyle = `rgba(${s < 0 ? AZURE : ROSE},0.22)`;
        ctx.stroke();
      }
      // fulcrum
      ctx.beginPath();
      ctx.arc(0, 0, 2.4 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(227,178,79,0.5)";
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      t += 1;

      const pl = poles();
      drawPole(pl[0].x, pl[0].y, pl[0].hue, Math.min(w, h) * 0.34);
      drawPole(pl[1].x, pl[1].y, pl[1].hue, Math.min(w, h) * 0.34);
      drawBeam();

      // links
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${a.hue},${(1 - d / LINK) * 0.2})`;
            ctx.lineWidth = 0.6 * dpr;
            ctx.stroke();
          }
        }
      }

      for (const p of ps) {
        // gentle pull toward nearest pole, kept from collapsing — a balance never reached
        let nearest = pl[0];
        if (Math.hypot(p.x - pl[1].x, p.y - pl[1].y) < Math.hypot(p.x - pl[0].x, p.y - pl[0].y)) nearest = pl[1];
        const dx = nearest.x - p.x, dy = nearest.y - p.y;
        const d = Math.hypot(dx, dy) || 1;
        const pull = d > 150 * dpr ? 0.006 : -0.004; // attract from afar, repel up close → orbiting equilibrium
        p.vx += (dx / d) * pull;
        p.vy += (dy / d) * pull;
        p.vx *= 0.992;
        p.vy *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const tw = 0.6 + 0.4 * Math.sin(t * 0.05 + p.x * 0.01);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${0.85 * tw})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},0.05)`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
