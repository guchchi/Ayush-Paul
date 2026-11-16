import React, { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  Avatar,
  Badge,
  Bar,
  Icon,
  Connector,
  Count,
  Stage,
  States,
  Text,
  Window,
  useReducedMotion,
  type Act,
  type Layout,
  type Rect,
} from '../stageshow';
import './gitglow-bento.css';

// ─── Bento Timing Beats (Stageshow Reference Standard) ────────────────────────
const STEP = 110;
const LEAD = 400;

type Beat = { on: boolean };
const before: Beat = { on: false };
const after: Beat = { on: true };

const beat = (i: number) => async (a: Act<Beat>) => {
  await a.wait(LEAD + i * STEP);
  await a.set({ on: true });
};

function usePictureWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => setWidth(Math.max(1, node.getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, width] as const;
}

function useInView<T extends Element>(delay: number) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t = window.setTimeout(() => setSeen(true), delay);
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [delay]);
  return [ref, seen] as const;
}

function Tile({
  area,
  title,
  children,
  picture,
  dark,
}: {
  area: string;
  title: ReactNode;
  children?: ReactNode;
  picture?: ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={`gb-tile gb-tile--${area}${dark ? ' gb-tile--dark' : ''}`} data-crop>
      {title ? (
        <p className="gb-copy">
          {title} {children}
        </p>
      ) : (
        children
      )}
      {picture}
    </section>
  );
}

// ─── Tile 1: Hero (Attributed Commits & Merges) ────────────────────────────────
function HeroTile() {
  const [picture, width] = usePictureWidth();

  return (
    <Tile
      area="hero"
      title={<b>Every commit, attributed.</b>}
      picture={
        <div ref={picture} className="gb-picture gb-picture--hero">
          <Stage<Beat>
            width={width}
            height={280}
            initial={before}
            poster={after}
            play="once"
            script={beat(0)}
            className="gb-stage"
          >
            {(s) => (
              <Window
                title="gitglow / missions — pull/104"
                chrome="hairline"
                className="gb-window"
                style={{ width: Math.max(340, width - 20) }}
              >
                <div className="flex flex-col text-left select-none">
                  {/* PR Row 1: Co-authored PR */}
                  <div
                    className={`gb-pr-row transition-colors duration-300 ${
                      s.on ? 'bg-[#F7F8EF]' : 'bg-white'
                    }`}
                  >
                    <div className="flex -space-x-1.5 items-center">
                      <Avatar name="Ayush" tone="accent" size={22} />
                      <Avatar name="Guchchi" tone="person" size={22} />
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="gb-pr-title truncate">
                        <span>feat: pair-extraordinaire co-author trailer</span>
                        <span className="text-[#65666A] font-normal text-[11px]">#104</span>
                      </div>
                      <div className="gb-pr-meta flex items-center gap-2 mt-0.5">
                        <span className="text-[#65A30D] font-bold">main</span>
                        <span>←</span>
                        <span className="text-[#65666A]">feat/co-author</span>
                        <span className="text-[#94A3B8]">• 2 co-authors verified</span>
                      </div>
                    </div>
                    <States
                      value={s.on ? 'merged' : 'open'}
                      align="end"
                      states={{
                        open: (
                          <Badge tone="neutral" className="text-[10px]">
                            Open
                          </Badge>
                        ),
                        merged: (
                          <Badge
                            tone="success"
                            icon={<Icon name="check" size={11} />}
                            className="text-[10px]"
                          >
                            Merged
                          </Badge>
                        ),
                      }}
                    />
                  </div>

                  {/* PR Row 2: Quickdraw Triage */}
                  <div className="gb-pr-row bg-white">
                    <Avatar name="Quickdraw" tone="ink" size={22} />
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="gb-pr-title truncate">
                        <span>track: quickdraw audit temp milestone</span>
                        <span className="text-[#65666A] font-normal text-[11px]">#103</span>
                      </div>
                      <div className="gb-pr-meta flex items-center gap-2 mt-0.5">
                        <span className="text-[#65666A]">closed in 142s</span>
                        <span className="text-[#94A3B8]">• SLA: &lt; 300s pass</span>
                      </div>
                    </div>
                    <Badge tone="neutral" className="text-[10px]">
                      Closed
                    </Badge>
                  </div>

                  {/* PR Row 3: YOLO Direct Push */}
                  <div className="gb-pr-row bg-white">
                    <Avatar name="Yolo" tone="person" size={22} />
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="gb-pr-title truncate">
                        <span>fix: emergency patch direct merge</span>
                        <span className="text-[#65666A] font-normal text-[11px]">#102</span>
                      </div>
                      <div className="gb-pr-meta flex items-center gap-2 mt-0.5">
                        <span className="text-[#65666A]">yolo/direct-push</span>
                        <span className="text-[#94A3B8]">• zero PR review</span>
                      </div>
                    </div>
                    <Badge tone="success" className="text-[10px]">
                      Merged
                    </Badge>
                  </div>
                </div>
              </Window>
            )}
          </Stage>
        </div>
      }
    >
      Co-authored commits and pull requests land directly on the default branch with verified Git signatures.
    </Tile>
  );
}

// ─── Tile 2: Stat (Official GitHub Webhook SLA) ────────────────────────────────
function StatTile() {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>(LEAD + STEP);

  return (
    <Tile area="stat" dark title={null}>
      <div ref={ref} className="gb-stat">
        <div>
          <span className="gb-stat-lead">
            <span className="w-2 h-2 rounded-full bg-[#D7FF36] inline-block" />
            GitHub Indexing SLA
          </span>
          <div className="gb-stat-number">
            <Count value={seen || reduced ? 72 : 24} duration={1200} />
            <span className="gb-stat-unit">h</span>
          </div>
        </div>

        <div className="space-y-3">
          <p className="gb-stat-label">
            Official background indexing window. Zero fake badges or local README hacks — genuine webhooks registered to GitHub's profile badge servers.
          </p>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1C1F26] border border-[#2E333D] text-[11px] font-mono text-[#D7FF36] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF36] animate-pulse" />
            100% Genuine Webhook Delivery
          </div>
        </div>
      </div>
    </Tile>
  );
}

// ─── Tile 3: Cards/Object (Authentic 3D Medallions) ───────────────────────────
function ObjectTile() {
  const sharkGradId = useId();
  const pairGradId = useId();

  return (
    <Tile
      area="card"
      title={<b>Authentic 3D medallions.</b>}
      picture={
        <div className="gb-picture gb-picture--card">
          <Stage<Beat>
            width={340}
            height={220}
            initial={before}
            poster={after}
            play="once"
            script={beat(2)}
            className="gb-stage"
          >
            {(s) => (
              <div
                className={`flex items-center justify-center gap-6 transition-all duration-700 ${
                  s.on ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-40'
                }`}
              >
                {/* Medallion 1: Pull Shark */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-2 border-[#38BDF8]/40 shadow-[0_10px_25px_rgba(56,189,248,0.25)] flex items-center justify-center p-3 transform transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 48 48" className="w-14 h-14" aria-hidden>
                      <defs>
                        <linearGradient id={sharkGradId} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#38BDF8" />
                          <stop offset="100%" stopColor="#0284C7" />
                        </linearGradient>
                      </defs>
                      <circle cx="24" cy="24" r="22" fill="none" stroke={`url(#${sharkGradId})`} strokeWidth="2.5" />
                      <path
                        d="M24 8 C16 14 12 24 24 38 C36 24 32 14 24 8 Z"
                        fill={`url(#${sharkGradId})`}
                        opacity="0.9"
                      />
                      <circle cx="24" cy="21" r="3.5" fill="#FFFFFF" />
                    </svg>
                    <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-[#0284C7] text-white text-[9px] font-mono font-black uppercase tracking-wider shadow">
                      Pull Shark
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#65666A] mt-3 font-semibold">Tier 1 Unlocked</span>
                </div>

                {/* Medallion 2: Pair Extraordinaire */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-b from-[#312E81] to-[#1E1B4B] border-2 border-[#A855F7]/40 shadow-[0_10px_25px_rgba(168,85,247,0.25)] flex items-center justify-center p-3 transform transition-transform group-hover:scale-105">
                    <svg viewBox="0 0 48 48" className="w-14 h-14" aria-hidden>
                      <defs>
                        <linearGradient id={pairGradId} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#C084FC" />
                          <stop offset="100%" stopColor="#9333EA" />
                        </linearGradient>
                      </defs>
                      <circle cx="24" cy="24" r="22" fill="none" stroke={`url(#${pairGradId})`} strokeWidth="2.5" />
                      <circle cx="18" cy="22" r="6" fill={`url(#${pairGradId})`} />
                      <circle cx="30" cy="22" r="6" fill="#F472B6" opacity="0.8" />
                      <path
                        d="M14 36 C14 30 22 30 24 30 C26 30 34 30 34 36"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-[#9333EA] text-white text-[9px] font-mono font-black uppercase tracking-wider shadow">
                      Pair Extra
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#65666A] mt-3 font-semibold">Co-Author Pass</span>
                </div>
              </div>
            )}
          </Stage>
        </div>
      }
    >
      Five official profile achievements unlocked through legitimate git operations.
    </Tile>
  );
}

// ─── Tile 4: Approvals/Component (Galaxy Brain 1-Click Solution) ────────────────
function ComponentTile() {
  const [picture, width] = usePictureWidth();

  return (
    <Tile
      area="approve"
      title={<b>Galaxy Brain in one solve.</b>}
      picture={
        <div ref={picture} className="gb-picture gb-picture--aligned">
          <Stage<Beat>
            width={width}
            height={220}
            initial={before}
            poster={after}
            play="once"
            script={beat(3)}
            className="gb-stage"
          >
            {(s) => (
              <div className="gb-disc-card text-left select-none w-full">
                <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DA]">
                  <div className="flex items-center gap-2">
                    <Avatar name="Alex" tone="person" size={24} />
                    <span className="text-xs font-bold text-[#101114]">GitHub Discussions</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#65666A]">#disc-89</span>
                </div>

                <div className="py-2.5">
                  <div className="text-[11px] font-semibold text-[#101114] line-clamp-1">
                    Q: Correct Git trailer syntax for automated co-authoring?
                  </div>
                  <div className="mt-1.5 p-1.5 rounded bg-white border border-[#E5E3DA] font-mono text-[10px] text-[#65A30D] truncate">
                    Co-authored-by: bot &lt;agent@gitglow.io&gt;
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#E5E3DA]">
                  <span className="text-[10px] text-[#65666A]">2 community upvotes</span>
                  <States
                    value={s.on ? 'accepted' : 'ask'}
                    align="end"
                    states={{
                      ask: (
                        <span className="px-2.5 py-1 rounded-md bg-[#101114] text-white text-[11px] font-semibold cursor-pointer">
                          Accept Answer
                        </span>
                      ),
                      accepted: (
                        <span className="px-2.5 py-1 rounded-md bg-[#84CC16] text-[#101114] text-[11px] font-bold flex items-center gap-1 shadow-xs">
                          <Icon name="check" size={13} />
                          Accepted Answer
                        </span>
                      ),
                    }}
                  />
                </div>
              </div>
            )}
          </Stage>
        </div>
      }
    >
      Answer an indexed technical discussion and mark the accepted solution.
    </Tile>
  );
}

// ─── Tile 5: Coding/Diagram (Webhook Telemetry Bus) ───────────────────────────
function DiagramTile() {
  const [picture, width] = usePictureWidth();

  const TRIGGERS = [
    { label: 'commit --amend', tag: 't1' },
    { label: 'pr merge --admin', tag: 't2' },
    { label: 'issue close 1', tag: 't3' },
  ];

  return (
    <Tile
      area="code"
      title={<b>Real webhook telemetry.</b>}
      picture={
        <div ref={picture} className="gb-picture gb-picture--aligned">
          <Stage<Beat>
            width={width}
            height={220}
            initial={before}
            poster={after}
            play="once"
            script={beat(4)}
            className="gb-stage"
          >
            {(s, rect) => {
              const right = (r: Rect) => ({ x: r.x + r.width, y: r.y + r.height / 2 });
              const left = (r: Rect) => ({ x: r.x, y: r.y + r.height / 2 });
              const to = rect('daemon');

              return (
                <div className="relative w-full h-full flex items-center justify-between px-2">
                  {/* Left Column: 3 Git Triggers */}
                  <div className="flex flex-col gap-3 z-10">
                    {TRIGGERS.map((t) => (
                      <span
                        key={t.tag}
                        className="gb-diagram-node"
                        data-target={t.tag}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                        {t.label}
                      </span>
                    ))}
                  </div>

                  {/* Right Column: Webhook Ingest Target */}
                  <div className="z-10">
                    <span
                      className="gb-diagram-target"
                      data-target="daemon"
                      data-on={s.on || undefined}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#D7FF36] animate-pulse" />
                      GitHub Ingest
                    </span>
                  </div>

                  {/* Connecting Lines */}
                  {to &&
                    to.width > 0 &&
                    TRIGGERS.map((t) => {
                      const from = rect(t.tag);
                      return from && from.width > 0 ? (
                        <Connector
                          key={t.tag}
                          from={right(from)}
                          to={left(to)}
                          route="step"
                          show={s.on}
                          dashed
                          className="text-[#84CC16]"
                        />
                      ) : null;
                    })}
                </div>
              );
            }}
          </Stage>
        </div>
      }
    >
      Git events stream directly to GitHub's achievement verification daemon.
    </Tile>
  );
}

// ─── Main Stageshow Bento Grid ────────────────────────────────────────────────
export function GitGlowStageshowBento() {
  return (
    <div className="gitglow-bento">
      <div className="gb-grid">
        <HeroTile />
        <StatTile />
        <ObjectTile />
        <ComponentTile />
        <DiagramTile />
      </div>
    </div>
  );
}

export default GitGlowStageshowBento;
