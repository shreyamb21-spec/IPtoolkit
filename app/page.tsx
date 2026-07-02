"use client";

import { useState } from "react";

// ─── InstaPlay palette ───
const C = {
  bg: "#0e0e16",
  surface: "#161622",
  card: "#1c1c2e",
  border: "rgba(255,255,255,0.06)",
  borderLight: "rgba(255,255,255,0.1)",
  brand: "#FF4B6E",
  brandDim: "rgba(255,75,110,0.15)",
  brandText: "#FF6B8A",
  green: "#30C464",
  greenDim: "rgba(48,196,100,0.12)",
  teal: "#2BBBA0",
  purple: "#5865F2",
  t1: "rgba(255,255,255,0.92)",
  t2: "rgba(255,255,255,0.6)",
  t3: "rgba(255,255,255,0.35)",
  t4: "rgba(255,255,255,0.18)",
};

// ─── Shared Components ───
function TabBar({ tabs, active, onChange }: { tabs: { id: string; label: string }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div style={{
      display: "flex", background: C.surface, borderRadius: 12, padding: 4,
      gap: 2, marginBottom: 28, border: `1px solid ${C.border}`, maxWidth: 480
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, padding: "11px 8px", borderRadius: 9, border: "none",
          cursor: "pointer", fontSize: 13, fontWeight: 700,
          background: active === t.id ? C.brand : "transparent",
          color: active === t.id ? "#fff" : C.t3,
          transition: "all 0.2s", whiteSpace: "nowrap"
        }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: C.t3,
      textTransform: "uppercase", marginBottom: 12, marginTop: 24
    }}>{children}</div>
  );
}

function Pill({ children, active, onClick, color }: { children: React.ReactNode; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px", borderRadius: 20,
      border: `1px solid ${active ? (color || C.brand) : C.borderLight}`,
      background: active ? `${color || C.brand}22` : "transparent",
      color: active ? (color || C.brand) : C.t2,
      fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
    }}>{children}</button>
  );
}

function InfoBox({ color, children }: { color?: string; children: React.ReactNode }) {
  const c = color || C.brand;
  return (
    <div style={{
      background: `${c}12`, border: `1px solid ${c}33`, borderRadius: 10,
      padding: 14, marginBottom: 20
    }}>
      <div style={{ fontSize: 12, color: `${c}CC`, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{
      background: C.card, borderRadius: 10, padding: 16,
      border: `1px solid ${C.border}`, textAlign: "center", flex: 1, minWidth: 140
    }}>
      <div style={{ fontSize: 10, color: C.t3, marginBottom: 8, letterSpacing: 0.3 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || C.t1 }}>{value}</div>
    </div>
  );
}

type CellType = { text: string; color?: string; bold?: boolean };
type RowType = { highlight?: boolean; cells: CellType[] };

function StatsTable({ headers, rows }: { headers: string[]; rows: RowType[] }) {
  return (
    <div style={{ background: C.card, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
      <div style={{
        display: "grid", gridTemplateColumns: `repeat(${headers.length}, 1fr)`,
        padding: "10px 16px", borderBottom: `1px solid ${C.border}`
      }}>
        {headers.map(h => (
          <span key={h} style={{ fontSize: 10, color: C.t3, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: `repeat(${headers.length}, 1fr)`,
          padding: "10px 16px", alignItems: "center",
          borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
          background: row.highlight ? C.brandDim : "transparent"
        }}>
          {row.cells.map((cell, j) => (
            <span key={j} style={{ fontSize: 12, color: cell.color || C.t2, fontWeight: cell.bold ? 700 : 400 }}>
              {cell.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 1: SHARE FLOW
// ═══════════════════════════════════════
const CHANNELS = [
  { id: "copy", label: "Copy Link", icon: "🔗", color: C.brand, existing: true, message: null },
  { id: "x", label: "Post to X", icon: "𝕏", color: "#999", existing: true,
    message: `I just made a game on @instaplayGG — play Stridefall Station with me 🎮\nhttps://instaplay.ai/g/stridefall-station` },
  { id: "reddit", label: "Post to Reddit", icon: "🔴", color: "#FF4500", existing: true, message: null },
  { id: "whatsapp", label: "WhatsApp", icon: "💬", color: "#25D366", existing: false,
    message: `yo play this game I just made 🎮\nhttps://instaplay.ai/g/stridefall-station` },
  { id: "imessage", label: "iMessage", icon: "💭", color: "#30C464", existing: false,
    message: `check out this game I made — tap to play\nhttps://instaplay.ai/g/stridefall-station` },
  { id: "sms", label: "SMS", icon: "📱", color: "#5AC8FA", existing: false,
    message: `play this with me!\nhttps://instaplay.ai/g/stridefall-station` },
  { id: "discord", label: "Discord", icon: "🎮", color: "#5865F2", existing: false,
    message: `just made a game on instaplay — who's down? 🎮\nhttps://instaplay.ai/g/stridefall-station` },
] as const;

type Channel = typeof CHANNELS[number];

function ShareFlow() {
  const [mode, setMode] = useState<"current" | "proposed">("proposed");
  const [selected, setSelected] = useState<Channel | null>(null);
  const [copied, setCopied] = useState(false);
  const channels = mode === "current" ? CHANNELS.filter(c => c.existing) : [...CHANNELS];

  const handleClick = (ch: Channel) => {
    if (ch.id === "copy") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      setSelected(null);
    } else {
      setSelected(selected?.id === ch.id ? null : ch);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <Pill active={mode === "current"} onClick={() => { setMode("current"); setSelected(null); }} color="#666">Current</Pill>
        <Pill active={mode === "proposed"} onClick={() => { setMode("proposed"); setSelected(null); }}>Proposed</Pill>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Left column */}
        <div style={{ flex: "1 1 340px", minWidth: 280 }}>
          {/* Game card */}
          <div style={{
            background: C.card, borderRadius: 12, padding: 16, display: "flex",
            gap: 14, alignItems: "center", border: `1px solid ${C.border}`, marginBottom: 16
          }}>
            <div style={{
              width: 68, height: 68, borderRadius: 10,
              background: "linear-gradient(135deg, #1a1a3e, #3a2050)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, position: "relative", flexShrink: 0
            }}>
              🚀
              <div style={{
                position: "absolute", top: -4, right: -4, background: C.brand,
                borderRadius: 4, padding: "2px 6px", fontSize: 7, fontWeight: 800, letterSpacing: 0.5, color: "#fff"
              }}>LIVE</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: C.t1 }}>Stridefall Station</div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 2 }}>@megadragon · 47 plays</div>
            </div>
          </div>

          <SectionLabel>
            Share to {channels.length} channel{channels.length > 1 ? "s" : ""}
            {mode === "proposed" && <span style={{ color: C.green, marginLeft: 8 }}>+4 direct invite</span>}
          </SectionLabel>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {channels.map(ch => (
              <button key={ch.id} onClick={() => handleClick(ch)} style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "11px 6px", borderRadius: 9, border: `1px solid ${ch.color}33`,
                cursor: "pointer", fontSize: 12, fontWeight: 600,
                background: selected?.id === ch.id ? ch.color : `${ch.color}10`,
                color: selected?.id === ch.id ? "#fff" : ch.color,
                transition: "all 0.15s", position: "relative"
              }}>
                <span style={{ fontSize: 14 }}>{ch.icon}</span>{ch.label}
                {!ch.existing && (
                  <span style={{
                    position: "absolute", top: -6, right: -4, background: C.brand,
                    color: "#fff", fontSize: 7, padding: "2px 6px", borderRadius: 6,
                    fontWeight: 800, letterSpacing: 0.3
                  }}>NEW</span>
                )}
              </button>
            ))}
          </div>

          {copied && (
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: C.green, fontWeight: 600 }}>
              ✓ Copied
            </div>
          )}

          {selected?.message && (
            <div style={{
              background: C.surface, border: `1px solid ${selected.color}33`,
              borderRadius: 10, padding: 16, marginTop: 14
            }}>
              <div style={{ fontSize: 10, color: C.t3, fontWeight: 600, marginBottom: 8 }}>
                Pre-filled for {selected.label}
              </div>
              <div style={{
                background: `${selected.color}0D`, borderRadius: 8, padding: 12,
                fontSize: 13, color: C.t2, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "system-ui"
              }}>{selected.message}</div>
              <div style={{ fontSize: 10, color: C.t4, marginTop: 8 }}>Editable before sending. Link auto-included.</div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ flex: "1 1 260px", minWidth: 240 }}>
          {mode === "proposed" ? (
            <>
              <SectionLabel>Rich link preview</SectionLabel>
              <div style={{
                background: "#fff", borderRadius: 12, overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)", marginBottom: 20
              }}>
                <div style={{
                  height: 140, background: "linear-gradient(135deg, #1a1a3e, #4a2060)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative"
                }}>
                  <span style={{ fontSize: 52 }}>🚀</span>
                  <div style={{
                    position: "absolute", bottom: 8, left: 8, background: C.brand,
                    color: "#fff", fontSize: 9, padding: "3px 8px", borderRadius: 5, fontWeight: 700
                  }}>MULTIPLAYER</div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: "#999", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: C.brand, fontSize: 8 }}>▶</span> instaplay.ai
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111", marginBottom: 4 }}>Stridefall Station</div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4, marginBottom: 10 }}>
                    Dodge obstacles on a space station. Play free in your browser.
                  </div>
                  <div style={{
                    background: C.brand, color: "#fff", textAlign: "center",
                    padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 700
                  }}>Play Now</div>
                </div>
              </div>

              <SectionLabel>Projected impact</SectionLabel>
              <div style={{ background: C.card, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
                {[
                  ["Share rate", "0.8%", "3.5%+"],
                  ["Direct invite channels", "0", "4"],
                  ["Pre-filled messages", "No", "Yes"],
                  ["Rich link previews", "Basic", "Thumb + CTA"],
                ].map(([label, cur, prop], i, a) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", padding: "10px 14px",
                    borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center"
                  }}>
                    <span style={{ fontSize: 11, color: C.t3 }}>{label}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: C.t4, textDecoration: "line-through" }}>{cur}</span>
                      <span style={{ fontSize: 9, color: C.t4 }}>→</span>
                      <span style={{ fontSize: 11, color: C.green, fontWeight: 700 }}>{prop}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              background: C.card, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`,
              textAlign: "center", marginTop: 32
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 13, color: C.t3, lineHeight: 1.6 }}>
                Only 3 share channels. No direct messaging. No pre-filled messages. No rich previews.
              </div>
              <div style={{ fontSize: 11, color: C.t4, marginTop: 10 }}>
                Switch to "Proposed" to see the improvements.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 2: CREATOR ECONOMICS
// ═══════════════════════════════════════
function CreatorEconomics() {
  const [rate, setRate] = useState(0.10);
  const [avgPlays, setAvgPlays] = useState(19);
  const [gamesPerWeek, setGamesPerWeek] = useState(5);

  const playsPerWeek = avgPlays * gamesPerWeek;
  const earningsPerWeek = (playsPerWeek / 100) * rate;
  const weeksToFirstPayout = earningsPerWeek > 0 ? Math.ceil(50 / earningsPerWeek) : Infinity;
  const yearlyEarnings = earningsPerWeek * 52;

  const rates = [
    { value: 0.10, label: "$0.10 (current)" },
    { value: 0.25, label: "$0.25" },
    { value: 0.50, label: "$0.50" },
    { value: 1.00, label: "$1.00" },
    { value: 2.00, label: "$2.00" },
  ];

  return (
    <div>
      <InfoBox color={C.brand}>
        At the current rate, the top creator (@motlarry) with 153 games and 2.9K total plays
        has earned ~$2.90 in potential payouts. The first cashout requires $50.
        Adjust the inputs below to model different scenarios.
      </InfoBox>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Left: Inputs */}
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <SectionLabel>Model inputs</SectionLabel>
          <div style={{ background: C.card, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: C.t3, marginBottom: 10 }}>Payout rate per 100 plays</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {rates.map(r => (
                  <Pill key={r.value} active={rate === r.value} onClick={() => setRate(r.value)}
                    color={r.value === 0.10 ? "#666" : C.brand}>{r.label}</Pill>
                ))}
              </div>
            </div>

            {([
              { label: "Avg plays per game", value: avgPlays, set: setAvgPlays, min: 5, max: 200, step: 5 },
              { label: "Games created per week", value: gamesPerWeek, set: setGamesPerWeek, min: 1, max: 20, step: 1 },
            ] as { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number }[]).map(s => (
              <div key={s.label} style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: C.t3 }}>{s.label}</span>
                  <span style={{ fontSize: 14, color: C.t1, fontWeight: 700 }}>{s.value}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(Number(e.target.value))}
                  style={{ width: "100%", accentColor: C.brand, height: 4, cursor: "pointer" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Results */}
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <SectionLabel>Creator earnings model</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <MetricCard label="Weekly plays" value={playsPerWeek.toLocaleString()} />
            <MetricCard label="Weekly earnings" value={`$${earningsPerWeek.toFixed(2)}`}
              color={earningsPerWeek > 5 ? C.green : C.brand} />
            <MetricCard label="Time to first $50"
              value={weeksToFirstPayout > 200 ? "200+ wk" : `${weeksToFirstPayout} wk`}
              color={weeksToFirstPayout > 52 ? C.brand : C.green} />
            <MetricCard label="Yearly earnings" value={`$${yearlyEarnings.toFixed(0)}`}
              color={yearlyEarnings > 100 ? C.green : C.brand} />
          </div>
        </div>
      </div>

      <SectionLabel>Rate comparison at current volumes (19 avg plays, 5 games/week)</SectionLabel>
      <StatsTable
        headers={["Rate", "Weekly", "First $50", "Yearly"]}
        rows={[0.10, 0.25, 0.50, 1.00, 2.00].map(r => {
          const wp = 19 * 5;
          const we = (wp / 100) * r;
          const wk = we > 0 ? Math.ceil(50 / we) : 999;
          return {
            highlight: r === 0.10,
            cells: [
              { text: `$${r.toFixed(2)} ${r === 0.10 ? "★" : ""}`, color: r === 0.10 ? C.brand : C.t2, bold: r === 0.10 },
              { text: `$${we.toFixed(2)}` },
              { text: wk > 200 ? "200+ wk" : `${wk} wk`, color: wk > 100 ? C.brand : wk > 26 ? "#FFA726" : C.green, bold: true },
              { text: `$${(we * 52).toFixed(0)}` },
            ]
          };
        })}
      />

      <div style={{ marginTop: 16 }}>
        <InfoBox color={C.green}>
          <strong>Takeaway:</strong> At $0.10/100 plays, even prolific creators earn less than a coffee per month.
          Raising to $0.50 makes the first payout reachable in ~{Math.ceil(50 / ((19 * 5 / 100) * 0.50))} weeks.
          Non-monetary incentives (visibility boosts, badges, early access) can bridge the gap while volumes grow.
        </InfoBox>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TAB 3: ONBOARDING TEMPLATES
// ═══════════════════════════════════════
const TEMPLATES = [
  {
    category: "Party", emoji: "🎉", color: "#FF4B6E",
    templates: [
      { title: "Party Trivia", prompt: "4 player trivia game about movies with a timer and scoreboard", players: "2-4" },
      { title: "Dance Battle", prompt: "rhythm game where 2 players compete to hit the beat", players: "2" },
      { title: "Draw & Guess", prompt: "one player draws a word and others guess what it is", players: "3-4" },
    ]
  },
  {
    category: "Battle", emoji: "⚔️", color: "#FF6B35",
    templates: [
      { title: "Tank Wars", prompt: "2 player tank battle with power-ups and destructible walls", players: "2" },
      { title: "Arena Brawl", prompt: "top-down arena fighter with melee weapons and health pickups", players: "2-4" },
      { title: "Capture the Flag", prompt: "capture the flag with 2 teams on a forest map", players: "2-4" },
    ]
  },
  {
    category: "Solo", emoji: "🎯", color: "#5865F2",
    templates: [
      { title: "Space Runner", prompt: "endless runner where you dodge obstacles on a space station", players: "1" },
      { title: "Tower Defense", prompt: "medieval tower defense with 5 wave levels and upgrades", players: "1" },
      { title: "Puzzle Blocks", prompt: "falling block puzzle game with combos and increasing speed", players: "1" },
    ]
  },
  {
    category: "Creative", emoji: "🧪", color: "#2BBBA0",
    templates: [
      { title: "Cooking Chaos", prompt: "catch falling ingredients and assemble recipes before time runs out", players: "1-2" },
      { title: "Farm Builder", prompt: "plant crops harvest them and sell at market to grow your farm", players: "1" },
      { title: "Music Maker", prompt: "rhythm game where you compose a song by hitting notes in sequence", players: "1" },
    ]
  },
];

function OnboardingTemplates() {
  const [selectedCat, setSelectedCat] = useState("Party");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const cat = TEMPLATES.find(t => t.category === selectedCat)!;

  return (
    <div>
      <InfoBox color={C.brand}>
        The current create page shows a blank prompt box. New users face a cold-start problem:
        "What should I make?" Templates reduce friction by offering proven prompts organized
        by intent. Users can still type custom prompts.
      </InfoBox>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Left: Current */}
        <div style={{ flex: "1 1 300px", minWidth: 260 }}>
          <SectionLabel>Current create page</SectionLabel>
          <div style={{
            background: C.card, borderRadius: 12, padding: 28, border: `1px solid ${C.border}`, textAlign: "center"
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.t1, marginBottom: 20 }}>
              What do you want<br />to make?
            </div>
            <div style={{
              background: C.surface, borderRadius: 8, padding: "14px 16px",
              color: C.t4, fontSize: 14, textAlign: "left", border: `1px solid ${C.border}`, marginBottom: 14
            }}>
              a cat rhythm game
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {["Solo", "Multiplayer"].map(m => (
                <span key={m} style={{
                  padding: "7px 18px", borderRadius: 7, background: C.surface,
                  border: `1px solid ${C.borderLight}`, fontSize: 12, color: C.t2
                }}>{m}</span>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "10px 0", background: C.brand, borderRadius: 8, fontSize: 13, fontWeight: 700, color: "#fff" }}>
              Create
            </div>
            <div style={{ fontSize: 10, color: C.t4, marginTop: 14 }}>
              No templates. No examples. No inspiration. Blank page anxiety.
            </div>
          </div>
        </div>

        {/* Right: Proposed */}
        <div style={{ flex: "1 1 380px", minWidth: 300 }}>
          <SectionLabel>Proposed: template-first create</SectionLabel>

          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {TEMPLATES.map(t => (
              <button key={t.category} onClick={() => { setSelectedCat(t.category); setSelectedTemplate(null); }} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 16px", borderRadius: 20,
                border: `1px solid ${selectedCat === t.category ? t.color : C.borderLight}`,
                background: selectedCat === t.category ? `${t.color}20` : "transparent",
                color: selectedCat === t.category ? t.color : C.t2,
                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
              }}>
                <span>{t.emoji}</span>{t.category}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cat.templates.map((t, i) => (
              <button key={i} onClick={() => setSelectedTemplate(selectedTemplate === i ? null : i)} style={{
                background: selectedTemplate === i ? `${cat.color}15` : C.card,
                border: `1px solid ${selectedTemplate === i ? `${cat.color}44` : C.border}`,
                borderRadius: 10, padding: 14, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                width: "100%"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: selectedTemplate === i ? 6 : 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.t1 }}>{t.title}</span>
                  <span style={{
                    fontSize: 10, color: cat.color, background: `${cat.color}18`,
                    padding: "3px 10px", borderRadius: 10, fontWeight: 600
                  }}>{t.players}p</span>
                </div>
                {selectedTemplate === i && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 9, color: C.t3, marginBottom: 4, fontWeight: 700, letterSpacing: 1 }}>AUTO-FILLS PROMPT</div>
                    <div style={{
                      background: C.surface, borderRadius: 8, padding: 12,
                      fontSize: 12, color: C.t2, lineHeight: 1.5, border: `1px solid ${C.border}`
                    }}>{t.prompt}</div>
                    <div style={{
                      marginTop: 10, background: C.brand, color: "#fff", textAlign: "center",
                      padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 700
                    }}>Create This Game</div>
                  </div>
                )}
                {selectedTemplate !== i && (
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>Tap to preview</div>
                )}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: 12, background: C.surface, borderRadius: 10, padding: 16,
            border: `1px dashed ${C.borderLight}`, textAlign: "center"
          }}>
            <div style={{ fontSize: 12, color: C.t3, marginBottom: 8 }}>or type your own idea</div>
            <div style={{
              background: C.card, borderRadius: 8, padding: "12px 14px",
              color: C.t4, fontSize: 13, textAlign: "left", border: `1px solid ${C.border}`
            }}>Describe any game...</div>
          </div>
        </div>
      </div>

      <SectionLabel>Expected impact</SectionLabel>
      <div style={{ background: C.card, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
        {[
          ["First-game creation rate", "+25-40%"],
          ["Time to first game", "~30 sec (vs ~3 min thinking)"],
          ["Multiplayer game %", "Higher (Party/Battle default to MP)"],
          ["Creator activation", "Templates reduce blank-page dropout"],
        ].map(([label, val], i, a) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", padding: "10px 16px",
            borderBottom: i < a.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "center"
          }}>
            <span style={{ fontSize: 12, color: C.t3 }}>{label}</span>
            <span style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════
const TABS = [
  { id: "share", label: "Share Flow" },
  { id: "economics", label: "Creator Economics" },
  { id: "onboarding", label: "Onboarding" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("share");

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: "#fff",
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      padding: "32px 24px"
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2.5, color: C.brand, marginBottom: 6, textTransform: "uppercase" }}>
            Growth Engineer Proposal
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: C.t1 }}>
            InstaPlay Growth Toolkit
          </h1>
          <p style={{ fontSize: 13, color: C.t3, margin: "6px 0 0" }}>
            Shreyam Borah · July 2026 · Built after hands-on product testing
          </p>
        </div>

        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {activeTab === "share" && <ShareFlow />}
        {activeTab === "economics" && <CreatorEconomics />}
        {activeTab === "onboarding" && <OnboardingTemplates />}

        <div style={{
          marginTop: 40, padding: "16px 0", borderTop: `1px solid ${C.border}`, textAlign: "center"
        }}>
          <div style={{ fontSize: 10, color: C.t4 }}>
            All observations from real product usage on instaplay.ai · shreyamborah.com
          </div>
        </div>
      </div>
    </div>
  );
}
