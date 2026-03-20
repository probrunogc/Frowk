import { useState, useReducer, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   STORYFLOW v3 — Glassmorphism + Luxury Minimal + Bento
   Grok Imagine Studio
   ═══════════════════════════════════════════════════════ */

// ─── Persistence ───
const SK = "storyflow_v3";
const save = (s) => { try { localStorage.setItem(SK, JSON.stringify({ project: s.project, characters: s.characters, styles: s.styles, scenes: s.scenes })); } catch {} };
const load = () => { try { const r = localStorage.getItem(SK); return r ? JSON.parse(r) : null; } catch { return null; } };

// ─── Templates ───
const TEMPLATES = [
  { id: "3d", name: "DramatizeMe 3D", icon: "🎬", data: { project: { name: "DramatizeMe 3D", aspectRatio: "9:16", resolution: "720p", defaultDuration: 8 }, styles: [{ id: "t3d", name: "Pixar 3D", prompt: "high-quality 3D animation, Pixar Dreamworks quality, stylized photorealistic rendering, rich saturated colors, Unreal Engine 5 quality, ray-traced global illumination, subsurface scattering, volumetric lighting, smooth 3D surfaces, expressive character animation, cinematic depth of field", visualStyle: "3D Pixar", colorGrade: "rich saturated", filmRef: "UE5", texture: "smooth 3D", extras: "expressive animation" }] } },
  { id: "cine", name: "Cinematográfico", icon: "🎥", data: { project: { name: "Cinematic Short", aspectRatio: "16:9", resolution: "720p", defaultDuration: 8 }, styles: [{ id: "tcine", name: "Cinema Film", prompt: "cinematic photorealistic, desaturated blue-grey tones, warm skin highlights, teal amber contrast, ARRI Alexa Mini LF, anamorphic bokeh, 35mm film grain, dramatic shadows", visualStyle: "cinematic", colorGrade: "teal amber", filmRef: "ARRI Alexa", texture: "35mm grain", extras: "dramatic shadows" }] } },
  { id: "reel", name: "Reels Vertical", icon: "📱", data: { project: { name: "Reels", aspectRatio: "9:16", resolution: "720p", defaultDuration: 6 }, styles: [{ id: "treel", name: "Viral Punch", prompt: "high contrast vibrant colors, social media aesthetic, punchy saturated, dynamic energy, crisp rendering, vertical optimized", visualStyle: "vibrant social", colorGrade: "punchy saturated", filmRef: "sharp digital", texture: "crisp", extras: "vertical optimized" }] } },
];

// ─── Prompt Library ───
const LIB = {
  cameras: [
    { id: "c1", name: "Dolly Forward", v: "smooth dolly forward tracking move" },
    { id: "c2", name: "Pan Direita", v: "smooth pan right revealing the scene" },
    { id: "c3", name: "Crane Up", v: "crane shot rising upward" },
    { id: "c4", name: "Close-up Estático", v: "static extreme close-up, shallow depth of field" },
    { id: "c5", name: "Tracking Lateral", v: "lateral tracking shot following the subject" },
    { id: "c6", name: "Handheld", v: "subtle handheld movement, documentary feel" },
    { id: "c7", name: "Zoom Lento", v: "slow smooth zoom in" },
    { id: "c8", name: "Dutch Angle", v: "Dutch angle tilted composition, dramatic tension" },
    { id: "c9", name: "POV", v: "first person POV camera movement" },
    { id: "c10", name: "Orbital", v: "slow orbital camera circling around subject" },
  ],
  lights: [
    { id: "l1", name: "Golden Hour", v: "warm golden hour sunlight, long shadows, amber glow" },
    { id: "l2", name: "Neon Noir", v: "neon-lit urban night, cyan and magenta reflections, dark shadows" },
    { id: "l3", name: "Estúdio Suave", v: "soft diffused studio lighting, minimal shadows" },
    { id: "l4", name: "Contraluz", v: "dramatic backlighting creating silhouette rim light" },
    { id: "l5", name: "Luz Natural", v: "natural daylight, bright and airy, realistic" },
    { id: "l6", name: "Low-Key", v: "low-key dramatic lighting, deep shadows, single light source" },
    { id: "l7", name: "Fluorescente Frio", v: "cold fluorescent overhead lighting, clinical, blue-green tint" },
    { id: "l8", name: "Velas", v: "warm practical candlelight, intimate, flickering" },
  ],
  moods: [
    { id: "m1", name: "Épico", v: "epic cinematic trailer mood, high contrast, dramatic" },
    { id: "m2", name: "Intimista", v: "intimate and quiet, contemplative, personal" },
    { id: "m3", name: "Enérgico", v: "high energy, vibrant, dynamic movement" },
    { id: "m4", name: "Misterioso", v: "mysterious and suspenseful, ominous atmosphere" },
    { id: "m5", name: "Alegre", v: "joyful, bright, optimistic, warm colors" },
    { id: "m6", name: "Melancólico", v: "melancholic, desaturated, wistful, slow pace" },
    { id: "m7", name: "Futurista", v: "sleek futuristic aesthetic, clean lines, tech-forward" },
    { id: "m8", name: "Vintage", v: "retro vintage film aesthetic, grain, muted tones, nostalgic" },
  ],
  lenses: [
    { id: "le1", name: "24mm Wide", v: "24mm wide angle lens" },
    { id: "le2", name: "35mm", v: "35mm lens, natural perspective" },
    { id: "le3", name: "50mm", v: "50mm standard lens, shallow DoF" },
    { id: "le4", name: "85mm Retrato", v: "85mm portrait lens, beautiful bokeh" },
    { id: "le5", name: "135mm Tele", v: "135mm telephoto compression" },
    { id: "le6", name: "Anamórfico", v: "anamorphic lens, horizontal flares, cinematic" },
  ],
  audios: [
    { id: "a1", name: "Sem Música", v: "No music" },
    { id: "a2", name: "Épico Orquestral", v: "epic orchestral score building to climax" },
    { id: "a3", name: "Urbano", v: "urban city ambience, traffic, distant voices" },
    { id: "a4", name: "Natureza", v: "natural ambient sounds, birds, wind, water" },
    { id: "a5", name: "Lo-Fi", v: "lo-fi chill beats, relaxed atmosphere" },
    { id: "a6", name: "Suspense", v: "tense suspenseful score, low drones, heartbeat" },
    { id: "a7", name: "SFX Only", v: "complete silence except for specific sound effects" },
  ],
  eyes: [
    { id: "e0", name: "🚫 Nunca olhar pra câmera", v: "character NOT looking at camera, natural candid moment, eyes focused on the scene action, captured as if by a hidden observer" },
    { id: "e1", name: "Olhando pro outro personagem", v: "character looking directly at the other character, engaged in conversation, natural eye contact between characters" },
    { id: "e2", name: "Olhando pra baixo", v: "character looking down at hands or objects, contemplative gaze, not aware of camera" },
    { id: "e3", name: "Horizonte / Distância", v: "character gazing into the distance, thoughtful far-away look, profile or three-quarter view" },
    { id: "e4", name: "Perfil (lado)", v: "character shown in profile view from the side, not facing camera" },
    { id: "e5", name: "De costas", v: "character seen from behind, back to camera, walking away" },
    { id: "e6", name: "👁️ DIRETO pra câmera", v: "character looking directly into camera, breaking fourth wall, direct eye contact with viewer" },
  ],
  perspectives: [
    { id: "p1", name: "Observador oculto", v: "filmed as if captured by a hidden observer, documentary voyeur perspective, character unaware of being filmed" },
    { id: "p2", name: "Câmera cinematográfica", v: "cinematic camera framing, professional film composition" },
    { id: "p3", name: "Fourth wall break", v: "character aware of camera, breaking fourth wall, direct address to viewer" },
  ],
};

const SHOTS = [
  { v: "extreme wide shot", l: "Extreme Wide" }, { v: "wide shot", l: "Wide" },
  { v: "medium shot", l: "Medium" }, { v: "medium close-up", l: "Medium CU" },
  { v: "close-up", l: "Close-up" }, { v: "extreme close-up", l: "Extreme CU" },
  { v: "over-the-shoulder shot", l: "Over the Shoulder" }, { v: "POV shot", l: "POV" },
  { v: "bird's eye view", l: "Bird's Eye" }, { v: "low angle shot", l: "Low Angle" },
];

const DURATIONS = [{ v: "5", l: "5s" }, { v: "6", l: "6s" }, { v: "8", l: "8s" }, { v: "10", l: "10s" }, { v: "12", l: "12s" }, { v: "15", l: "15s" }];

// ─── State ───
const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const stored = load();
const init = {
  tab: "storyboard", panel: null, guide: false,
  project: stored?.project || { name: "Novo Projeto", aspectRatio: "16:9", resolution: "720p", defaultDuration: 8 },
  characters: stored?.characters || [], styles: stored?.styles || [], scenes: stored?.scenes || [],
};

function red(state, a) {
  let n = state;
  switch (a.type) {
    case "TAB": n = { ...state, tab: a.v }; break;
    case "PANEL": n = { ...state, panel: a.v }; break;
    case "GUIDE": n = { ...state, guide: !state.guide }; break;
    case "PROJ": n = { ...state, project: { ...state.project, ...a.v } }; break;
    case "ADD_CHAR": n = { ...state, characters: [...state.characters, a.v] }; break;
    case "UPD_CHAR": n = { ...state, characters: state.characters.map(c => c.id === a.v.id ? { ...c, ...a.v } : c) }; break;
    case "DEL_CHAR": n = { ...state, characters: state.characters.filter(c => c.id !== a.v) }; break;
    case "ADD_STY": n = { ...state, styles: [...state.styles, a.v] }; break;
    case "UPD_STY": n = { ...state, styles: state.styles.map(s => s.id === a.v.id ? { ...s, ...a.v } : s) }; break;
    case "DEL_STY": n = { ...state, styles: state.styles.filter(s => s.id !== a.v) }; break;
    case "ADD_SC": n = { ...state, scenes: [...state.scenes, a.v] }; break;
    case "UPD_SC": n = { ...state, scenes: state.scenes.map(s => s.id === a.v.id ? { ...s, ...a.v } : s) }; break;
    case "DEL_SC": n = { ...state, scenes: state.scenes.filter(s => s.id !== a.v) }; break;
    case "REORDER": n = { ...state, scenes: a.v }; break;
    case "DUP_SC": { const src = state.scenes.find(s => s.id === a.v); if (src) { const d = { ...src, id: uid(), title: (src.title || "Cena") + " (cópia)" }; const i = state.scenes.findIndex(s => s.id === a.v); const arr = [...state.scenes]; arr.splice(i + 1, 0, d); n = { ...state, scenes: arr }; } break; }
    case "LOAD": n = { ...state, ...a.v, panel: null }; break;
    case "TPL": n = { ...state, project: { ...a.v.project }, styles: [...(a.v.styles || [])], characters: [], scenes: [], panel: null }; break;
    default: return state;
  }
  save(n); return n;
}

// ─── Prompt Builder ───
function buildPrompt(sc, chars, stys, proj) {
  const p = [];
  p.push(`${sc.duration || proj.defaultDuration}-second ${proj.aspectRatio}`);
  const sty = stys.find(s => s.id === sc.styleId); if (sty) p.push(sty.prompt);
  if (sc.shotType) p.push(sc.shotType);
  (sc.characterIds || []).map(id => chars.find(c => c.id === id)).filter(Boolean).forEach(ch => p.push(ch.prompt));
  p.push(sc.eyeDirection || "character NOT looking at camera, natural candid moment, eyes focused on the scene action, captured as if by a hidden observer");
  if (sc.action) p.push(sc.action);
  if (sc.environment) p.push(sc.environment);
  if (sc.perspective) p.push(sc.perspective);
  if (sc.camera) p.push(sc.camera);
  if (sc.lens) p.push(sc.lens);
  if (sc.lighting) p.push(sc.lighting);
  if (sc.mood) p.push(sc.mood);
  if (sc.extras) p.push(sc.extras);
  let au = ""; if (sc.audio) au = `Audio: ${sc.audio}.`; if (sc.dialogue) au += ` Dialogue: "${sc.dialogue}"`;
  if (au) p.push(au.trim());
  return p.filter(Boolean).join(". ").replace(/\.\./g, ".").trim();
}
const wc = t => t ? t.split(/\s+/).filter(Boolean).length : 0;

// ─── Styles (CSS-in-JS) ───
const glass = {
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(20px) saturate(1.4)",
  WebkitBackdropFilter: "blur(20px) saturate(1.4)",
  border: "1px solid rgba(255,255,255,0.06)",
};
const glassHover = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
};
const gold = "#c9a84c";
const goldSoft = "rgba(201,168,76,0.12)";
const goldBright = "#e8c55a";
const subtle = "#6b7280";
const dim = "#3b3f4a";

// ─── Components ───
const GlassCard = ({ children, style: ex, onClick, hover = true, padding = 20 }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...glass, ...(hov && hover ? glassHover : {}),
        borderRadius: 16, padding, cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", ...ex,
      }}>{children}</div>
  );
};

const Btn = ({ children, onClick, gold: isGold, ghost, sm, style: ex, disabled, title, danger }) => (
  <button onClick={disabled ? undefined : onClick} title={title}
    style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: sm ? "6px 12px" : "9px 18px",
      fontSize: sm ? 11 : 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
      borderRadius: 10, border: "none", cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: 0.3, transition: "all 0.2s",
      opacity: disabled ? 0.4 : 1, whiteSpace: "nowrap",
      background: danger ? "rgba(239,68,68,0.15)" : isGold ? `linear-gradient(135deg, ${gold}, ${goldBright})` : ghost ? "transparent" : "rgba(255,255,255,0.06)",
      color: danger ? "#ef4444" : isGold ? "#0a0a0f" : ghost ? subtle : "#e2e2e8",
      ...ex,
    }}>{children}</button>
);

const Field = ({ label, value, onChange, placeholder, multi, rows = 3, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <div style={{ display: "flex", justifyContent: "space-between" }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: subtle, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "'Sora', sans-serif" }}>{label}</label>
      {hint && <span style={{ fontSize: 9, color: dim, fontStyle: "italic" }}>{hint}</span>}
    </div>}
    {multi ? (
      <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ ...glass, borderRadius: 10, padding: "10px 14px", color: "#e2e2e8", fontSize: 13, fontFamily: "'Sora', sans-serif", resize: "vertical", outline: "none" }}
        onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />
    ) : (
      <input value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ ...glass, borderRadius: 10, padding: "10px 14px", color: "#e2e2e8", fontSize: 13, fontFamily: "'Sora', sans-serif", outline: "none" }}
        onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"} />
    )}
  </div>
);

const Sel = ({ label, value, onChange, options, placeholder, hint }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
    {label && <div style={{ display: "flex", justifyContent: "space-between" }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: subtle, textTransform: "uppercase", letterSpacing: 1.2, fontFamily: "'Sora', sans-serif" }}>{label}</label>
      {hint && <span style={{ fontSize: 9, color: dim, fontStyle: "italic" }}>{hint}</span>}
    </div>}
    <select value={value || ""} onChange={e => onChange(e.target.value)}
      style={{ ...glass, borderRadius: 10, padding: "10px 14px", color: value ? "#e2e2e8" : "#555", fontSize: 13, fontFamily: "'Sora', sans-serif", outline: "none", cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32 }}>
      <option value="" style={{ background: "#0f0f14" }}>{placeholder || "—"}</option>
      {options.map(o => <option key={o.v || o.id} value={o.v || o.id} style={{ background: "#0f0f14", color: "#e2e2e8" }}>{o.l || o.name}</option>)}
    </select>
  </div>
);

const Tag = ({ children, color = gold }) => (
  <span style={{ display: "inline-flex", padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, color, background: `${color}18`, letterSpacing: 0.5, textTransform: "uppercase", fontFamily: "'Sora', sans-serif" }}>{children}</span>
);

const Pill = ({ label, selected, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 500,
    border: `1px solid ${selected ? gold : "rgba(255,255,255,0.08)"}`,
    background: selected ? goldSoft : "transparent",
    color: selected ? gold : subtle, cursor: "pointer", fontFamily: "'Sora', sans-serif",
    transition: "all 0.2s",
  }}>{label}</button>
);

// ─── Character Editor ───
function CharEditor({ char: initial, dispatch, onClose }) {
  const [c, setC] = useState({ ...initial }); const u = (k, v) => setC(p => ({ ...p, [k]: v }));
  const doSave = () => {
    const pr = [c.gender, c.age && `${c.age} years old`, c.ethnicity, c.body, c.face, c.hair, c.clothing && `wearing ${c.clothing}`, c.extras].filter(Boolean).join(", ");
    dispatch({ type: initial.id ? "UPD_CHAR" : "ADD_CHAR", v: { ...c, prompt: pr, id: c.id || uid() } }); onClose();
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 300, color: "#e2e2e8", letterSpacing: -0.5 }}>{initial.id ? "Editar" : "Novo"} <span style={{ color: gold }}>Personagem</span></h3>
        <Btn ghost sm onClick={onClose}>✕</Btn>
      </div>
      <Field label="Nome" value={c.name} onChange={v => u("name", v)} placeholder="Detective Silva" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Gênero" value={c.gender} onChange={v => u("gender", v)} placeholder="male" />
        <Field label="Idade" value={c.age} onChange={v => u("age", v)} placeholder="35" />
      </div>
      <Field label="Etnia" value={c.ethnicity} onChange={v => u("ethnicity", v)} placeholder="Brazilian, brown skin" />
      <Field label="Corpo" value={c.body} onChange={v => u("body", v)} placeholder="tall athletic build" />
      <Field label="Rosto" value={c.face} onChange={v => u("face", v)} placeholder="sharp jawline, brown eyes" />
      <Field label="Cabelo" value={c.hair} onChange={v => u("hair", v)} placeholder="short black curly hair" />
      <Field label="Roupa" value={c.clothing} onChange={v => u("clothing", v)} placeholder="dark leather jacket, jeans" />
      <Field label="Extras" value={c.extras} onChange={v => u("extras", v)} placeholder="silver watch, scar" multi rows={2} />
      <GlassCard padding={12} hover={false} style={{ borderColor: `${gold}22` }}>
        <div style={{ fontSize: 9, color: gold, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>Preview</div>
        <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>
          {[c.gender, c.age && `${c.age} years old`, c.ethnicity, c.body, c.face, c.hair, c.clothing && `wearing ${c.clothing}`, c.extras].filter(Boolean).join(", ") || "Preencha os campos..."}
        </div>
      </GlassCard>
      <Btn gold onClick={doSave}>Salvar Personagem</Btn>
    </div>
  );
}

// ─── Style Editor ───
function StyEditor({ sty: initial, dispatch, onClose }) {
  const [s, setS] = useState({ ...initial }); const u = (k, v) => setS(p => ({ ...p, [k]: v }));
  const doSave = () => {
    const pr = [s.visualStyle, s.colorGrade, s.filmRef, s.texture, s.extras].filter(Boolean).join(", ");
    dispatch({ type: initial.id ? "UPD_STY" : "ADD_STY", v: { ...s, prompt: pr, id: s.id || uid() } }); onClose();
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 300, color: "#e2e2e8" }}>Novo <span style={{ color: gold }}>Estilo</span></h3>
        <Btn ghost sm onClick={onClose}>✕</Btn>
      </div>
      <Field label="Nome" value={s.name} onChange={v => u("name", v)} placeholder="Neo-Noir" />
      <Field label="Estilo Visual" value={s.visualStyle} onChange={v => u("visualStyle", v)} placeholder="cinematic, 3D animation" />
      <Field label="Color Grade" value={s.colorGrade} onChange={v => u("colorGrade", v)} placeholder="teal and orange" />
      <Field label="Ref. Câmera" value={s.filmRef} onChange={v => u("filmRef", v)} placeholder="ARRI Alexa" />
      <Field label="Textura" value={s.texture} onChange={v => u("texture", v)} placeholder="film grain" />
      <Field label="Extras" value={s.extras} onChange={v => u("extras", v)} placeholder="atmospheric haze" multi rows={2} />
      <Btn gold onClick={doSave}>Salvar Estilo</Btn>
    </div>
  );
}

// ─── Scene Editor ───
function ScEditor({ sc: initial, state, dispatch, onClose }) {
  const [s, setS] = useState({ ...initial }); const u = (k, v) => setS(p => ({ ...p, [k]: v }));
  const togChar = (id) => { const ids = s.characterIds || []; u("characterIds", ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]); };
  const doSave = () => { dispatch({ type: initial.id ? "UPD_SC" : "ADD_SC", v: { ...s, id: s.id || uid() } }); onClose(); };
  const fp = buildPrompt(s, state.characters, state.styles, state.project);
  const words = wc(fp); const wcColor = words < 50 ? "#f59e0b" : words > 150 ? "#ef4444" : "#10b981";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#0f0f14", paddingBottom: 8, zIndex: 2 }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 300, color: "#e2e2e8" }}>{initial.id ? `Cena #${state.scenes.findIndex(x => x.id === initial.id) + 1}` : "Nova"} <span style={{ color: gold }}>Cena</span></h3>
        <Btn ghost sm onClick={onClose}>✕</Btn>
      </div>
      <Field label="Título" value={s.title} onChange={v => u("title", v)} placeholder="Perseguição na chuva" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Sel label="Duração" value={s.duration} onChange={v => u("duration", v)} options={DURATIONS} />
        <Sel label="Estilo" value={s.styleId} onChange={v => u("styleId", v)} options={state.styles.map(st => ({ v: st.id, l: st.name }))} />
      </div>
      {state.characters.length > 0 && <div>
        <label style={{ fontSize: 10, fontWeight: 700, color: subtle, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, display: "block", fontFamily: "'Sora', sans-serif" }}>Personagens</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {state.characters.map(ch => <Pill key={ch.id} label={ch.name} selected={(s.characterIds || []).includes(ch.id)} onClick={() => togChar(ch.id)} />)}
        </div>
      </div>}
      <Sel label="Shot" value={s.shotType} onChange={v => u("shotType", v)} options={SHOTS} />

      {/* 👁️ Eye direction */}
      <GlassCard padding={12} hover={false} style={{ borderColor: "rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.04)" }}>
        <Sel label="👁️ Direção do Olhar" value={s.eyeDirection} onChange={v => u("eyeDirection", v)} hint="anti camera-stare" options={LIB.eyes.map(e => ({ v: e.v, l: e.name }))} placeholder="🚫 Nunca olhar (padrão)" />
        <div style={{ height: 8 }} />
        <Sel label="Perspectiva" value={s.perspective} onChange={v => u("perspective", v)} options={LIB.perspectives.map(p => ({ v: p.v, l: p.name }))} placeholder="Observador oculto" />
      </GlassCard>

      <Field label="Ação" value={s.action} onChange={v => u("action", v)} placeholder="o detetive examina pistas na mesa..." multi rows={3} />
      <Field label="Ambiente" value={s.environment} onChange={v => u("environment", v)} placeholder="escritório escuro, noite chuvosa..." multi rows={2} />
      <Sel label="Câmera" value={s.camera} onChange={v => u("camera", v)} options={LIB.cameras.map(c => ({ v: c.v, l: c.name }))} />
      <Sel label="Lente" value={s.lens} onChange={v => u("lens", v)} options={LIB.lenses.map(l => ({ v: l.v, l: l.name }))} />
      <Sel label="Iluminação" value={s.lighting} onChange={v => u("lighting", v)} options={LIB.lights.map(l => ({ v: l.v, l: l.name }))} />
      <Sel label="Mood" value={s.mood} onChange={v => u("mood", v)} options={LIB.moods.map(m => ({ v: m.v, l: m.name }))} />
      <Sel label="Áudio" value={s.audio} onChange={v => u("audio", v)} options={LIB.audios.map(a => ({ v: a.v, l: a.name }))} />

      <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />

      {/* 🎙️ Narration */}
      <GlassCard padding={12} hover={false} style={{ borderColor: "rgba(236,72,153,0.2)", background: "rgba(236,72,153,0.03)" }}>
        <Field label="🎙️ Narração" value={s.narration} onChange={v => u("narration", v)} hint="pra gravar — NÃO vai pro Grok" placeholder='"Eu tava de boa no aeroporto..."' multi rows={3} />
      </GlassCard>

      <Field label="Diálogo no vídeo" value={s.dialogue} onChange={v => u("dialogue", v)} placeholder="Fala que aparece no vídeo gerado" />
      <Field label="Extras" value={s.extras} onChange={v => u("extras", v)} placeholder="crisp motion, sharp focus" multi rows={2} />

      <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "4px 0" }} />

      {/* Prompt Preview */}
      <GlassCard padding={14} hover={false} style={{ borderColor: `${gold}22` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: gold, textTransform: "uppercase", letterSpacing: 1.5 }}>Prompt Final</span>
          <Tag color={wcColor}>{words}w</Tag>
        </div>
        <div style={{ fontSize: 11, color: "#aaa", lineHeight: 1.7, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {fp || "Configure os campos..."}
        </div>
      </GlassCard>

      {s.narration && <GlassCard padding={10} hover={false} style={{ borderColor: "rgba(236,72,153,0.15)" }}>
        <div style={{ fontSize: 9, color: "#ec4899", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>🎙️ Narração</div>
        <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.5, fontStyle: "italic" }}>"{s.narration}"</div>
      </GlassCard>}

      <div style={{ display: "flex", gap: 8 }}>
        <Btn gold onClick={doSave} style={{ flex: 1 }}>Salvar Cena</Btn>
        <Btn onClick={() => navigator.clipboard?.writeText(fp)}>Copiar</Btn>
      </div>
    </div>
  );
}

// ─── Scene Card (Timeline) ───
function SceneCard({ sc, i, state, dispatch }) {
  const chars = (sc.characterIds || []).map(id => state.characters.find(c => c.id === id)).filter(Boolean);
  const sty = state.styles.find(s => s.id === sc.styleId);
  const move = (d) => { const a = [...state.scenes]; const ni = i + d; if (ni < 0 || ni >= a.length) return; [a[i], a[ni]] = [a[ni], a[i]]; dispatch({ type: "REORDER", v: a }); };
  const [hov, setHov] = useState(false);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={() => dispatch({ type: "PANEL", v: { t: "scene", d: sc } })}
      style={{
        ...glass, ...(hov ? glassHover : {}),
        borderRadius: 18, width: 270, flexShrink: 0, overflow: "hidden",
        cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hov ? "translateY(-4px)" : "none",
        boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.3)" : "none",
      }}>
      {/* Number + Title */}
      <div style={{ padding: "14px 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ background: `linear-gradient(135deg, ${gold}, ${goldBright})`, color: "#0a0a0f", width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, fontFamily: "'Sora'" }}>{i + 1}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#e2e2e8", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sc.title || `Cena ${i + 1}`}</span>
        </div>
        <Tag>{sc.duration || state.project.defaultDuration}s</Tag>
      </div>

      {/* Preview zone */}
      <div style={{ height: 80, margin: "0 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 22, opacity: 0.2 }}>▶</span>
      </div>

      <div style={{ padding: "8px 16px 14px" }}>
        {sc.action && <p style={{ margin: "4px 0", fontSize: 11, color: "#777", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{sc.action}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          {chars.map(ch => <Tag key={ch.id} color="#06b6d4">{ch.name}</Tag>)}
          {sty && <Tag color="#a855f7">{sty.name}</Tag>}
          {sc.narration && <Tag color="#ec4899">🎙️</Tag>}
          {sc.eyeDirection && <Tag color="#f97316">👁️</Tag>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 9, color: dim }}>{wc(buildPrompt(sc, state.characters, state.styles, state.project))}w</span>
          <div style={{ display: "flex", gap: 2 }}>
            <Btn ghost sm onClick={e => { e.stopPropagation(); move(-1); }}>↑</Btn>
            <Btn ghost sm onClick={e => { e.stopPropagation(); move(1); }}>↓</Btn>
            <Btn ghost sm onClick={e => { e.stopPropagation(); dispatch({ type: "DUP_SC", v: sc.id }); }}>⊕</Btn>
            <Btn ghost sm danger onClick={e => { e.stopPropagation(); dispatch({ type: "DEL_SC", v: sc.id }); }}>✕</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Guide ───
function Guide({ onClose }) {
  const S = { p: { fontSize: 12, color: "#999", lineHeight: 1.8, margin: "0 0 6px" } };
  return (
    <div style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 300, color: "#e2e2e8" }}>Como <span style={{ color: gold }}>usar</span></h2>
        <Btn ghost sm onClick={onClose}>✕</Btn>
      </div>
      {[
        { t: "1. Fluxo", c: "Personagens → Estilos → Cenas → Exportar. O prompt é montado automaticamente." },
        { t: "2. 👁️ Anti Camera-Stare", c: "Por padrão, todo prompt inclui 'NOT looking at camera'. Só mude pra fourth wall break intencional." },
        { t: "3. 🎙️ Narração", c: "Campo separado do Grok. Escreva o texto → gere vídeos → grave voz → monte no CapCut." },
        { t: "4. Consistência", c: "Prompts 50-150 palavras. Gere IMAGEM primeiro, use image-to-video. Extend from Frame entre cenas (regere após 2-3)." },
        { t: "5. Auto-save", c: "Dados salvam no navegador. Use Exportar JSON pra backup." },
        { t: "6. Custos", c: "$0.05/s (480p) · $0.07/s (720p) · 10 cenas × 8s ≈ $5.60 · $25 crédito grátis na xAI." },
      ].map(s => <div key={s.t} style={{ marginBottom: 18 }}>
        <h4 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: gold }}>{s.t}</h4>
        <p style={S.p}>{s.c}</p>
      </div>)}
    </div>
  );
}

// ═══════════════ MAIN APP ═══════════════
export default function App() {
  const [state, dispatch] = useReducer(red, init);
  const [copied, setCopied] = useState(null);
  const cp = (t, id) => { navigator.clipboard?.writeText(t); setCopied(id); setTimeout(() => setCopied(null), 1500); };

  const expJSON = () => { const d = { project: state.project, characters: state.characters, styles: state.styles, scenes: state.scenes }; const b = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${state.project.name.replace(/\s+/g, "_")}.json`; a.click(); };
  const expTXT = () => { const l = state.scenes.map((s, i) => { let b = `═══ CENA ${i + 1}: ${s.title || ""} (${s.duration || state.project.defaultDuration}s) ═══\n`; if (s.narration) b += `🎙️ "${s.narration}"\n\n`; b += `PROMPT:\n${buildPrompt(s, state.characters, state.styles, state.project)}\n`; return b; }); const b = new Blob([l.join("\n\n")], { type: "text/plain" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `${state.project.name.replace(/\s+/g, "_")}_prompts.txt`; a.click(); };
  const imp = () => { const i = document.createElement("input"); i.type = "file"; i.accept = ".json"; i.onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { try { dispatch({ type: "LOAD", v: JSON.parse(ev.target.result) }); } catch { alert("Inválido"); } }; r.readAsText(f); }; i.click(); };

  const td = state.scenes.reduce((a, s) => a + (parseInt(s.duration) || state.project.defaultDuration), 0);
  const cost = (td * (state.project.resolution === "720p" ? 0.07 : 0.05)).toFixed(2);

  const TABS = [
    { id: "storyboard", l: "Storyboard" }, { id: "characters", l: "Personagens" },
    { id: "styles", l: "Estilos" }, { id: "library", l: "Biblioteca" }, { id: "export", l: "Exportar" },
  ];

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: "#0a0a0f", color: "#e2e2e8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      {/* Ambient gradient */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 400, background: "radial-gradient(ellipse at 30% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: 0, right: 0, width: 500, height: 500, background: "radial-gradient(ellipse at 100% 100%, rgba(99,102,241,0.04) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />

      {/* Header */}
      <header style={{ ...glass, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.8, background: `linear-gradient(135deg, ${gold}, ${goldBright})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Story</span>
            <span style={{ fontSize: 18, fontWeight: 300, letterSpacing: -0.8, color: "#e2e2e8" }}>Flow</span>
          </div>
          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.06)" }} />
          <input value={state.project.name} onChange={e => dispatch({ type: "PROJ", v: { name: e.target.value } })}
            style={{ background: "transparent", border: "none", color: "#e2e2e8", fontSize: 14, fontWeight: 400, fontFamily: "'Sora'", outline: "none", width: 160 }} />
          <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "3px 8px" }}>
            <select value={state.project.aspectRatio} onChange={e => dispatch({ type: "PROJ", v: { aspectRatio: e.target.value } })} style={{ background: "transparent", border: "none", color: subtle, fontSize: 10, fontFamily: "'Sora'", cursor: "pointer", outline: "none" }}>
              {["16:9", "9:16", "1:1", "4:3"].map(a => <option key={a} value={a} style={{ background: "#0f0f14" }}>{a}</option>)}
            </select>
            <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
            <select value={state.project.resolution} onChange={e => dispatch({ type: "PROJ", v: { resolution: e.target.value } })} style={{ background: "transparent", border: "none", color: subtle, fontSize: 10, fontFamily: "'Sora'", cursor: "pointer", outline: "none" }}>
              <option value="480p" style={{ background: "#0f0f14" }}>480p</option>
              <option value="720p" style={{ background: "#0f0f14" }}>720p</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {state.scenes.length > 0 && <span style={{ fontSize: 10, color: dim }}>{state.scenes.length} cenas · {td}s · <span style={{ color: "#10b981" }}>${cost}</span></span>}
          <Btn ghost sm onClick={() => dispatch({ type: "GUIDE" })}>?</Btn>
          <Btn ghost sm onClick={imp}>↑</Btn>
          <Btn ghost sm onClick={expJSON}>↓</Btn>
        </div>
      </header>

      {/* Tabs */}
      <nav style={{ padding: "0 24px", display: "flex", gap: 2, borderBottom: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => dispatch({ type: "TAB", v: t.id })}
            style={{ background: "none", border: "none", borderBottom: state.tab === t.id ? `2px solid ${gold}` : "2px solid transparent", color: state.tab === t.id ? gold : dim, padding: "12px 16px", cursor: "pointer", fontFamily: "'Sora'", fontSize: 11, fontWeight: state.tab === t.id ? 600 : 400, letterSpacing: 0.5, transition: "all 0.2s" }}>
            {t.l}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>

          {/* ═══ STORYBOARD ═══ */}
          {state.tab === "storyboard" && <div>
            {state.scenes.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "55vh", gap: 20 }}>
                <span style={{ fontSize: 48, fontWeight: 200, letterSpacing: -2, color: "#e2e2e8" }}>Story<span style={{ background: `linear-gradient(135deg,${gold},${goldBright})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Flow</span></span>
                <p style={{ color: "#666", fontSize: 13, textAlign: "center", maxWidth: 380, lineHeight: 1.7, fontWeight: 300 }}>
                  Crie storyboards com prompts otimizados para o Grok Imagine.<br />Anti-camera-stare · Narração · Auto-save
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn gold onClick={() => dispatch({ type: "PANEL", v: { t: "scene", d: {} } })}>+ Nova Cena</Btn>
                  <Btn onClick={() => dispatch({ type: "TAB", v: "characters" })}>Personagem</Btn>
                </div>
                <div style={{ height: 1, width: 60, background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />
                <span style={{ fontSize: 10, color: dim, letterSpacing: 1 }}>TEMPLATES</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {TEMPLATES.map(t => <Btn key={t.id} sm onClick={() => dispatch({ type: "TPL", v: t.data })}>{t.icon} {t.name}</Btn>)}
                </div>
              </div>
            ) : <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 300 }}>Time<span style={{ color: gold, fontWeight: 600 }}>line</span></h2>
                <Btn gold sm onClick={() => dispatch({ type: "PANEL", v: { t: "scene", d: {} } })}>+ Cena</Btn>
              </div>
              <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 14 }}>
                {state.scenes.map((sc, i) => <SceneCard key={sc.id} sc={sc} i={i} state={state} dispatch={dispatch} />)}
                <div onClick={() => dispatch({ type: "PANEL", v: { t: "scene", d: {} } })} style={{ width: 270, minHeight: 200, flexShrink: 0, borderRadius: 18, border: `1px dashed rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s", fontSize: 12, color: dim }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = gold} onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}>+ Adicionar</div>
              </div>

              {/* All prompts */}
              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 13, fontWeight: 400, color: subtle }}>Prompts</h3>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn sm onClick={() => { const a = state.scenes.map((s, i) => { let b = `--- CENA ${i + 1} ---\n`; if (s.narration) b += `🎙️ "${s.narration}"\n\n`; b += buildPrompt(s, state.characters, state.styles, state.project); return b; }).join("\n\n"); cp(a, "all"); }}>{copied === "all" ? "✓" : "Copiar"}</Btn>
                    <Btn gold sm onClick={expTXT}>.txt</Btn>
                  </div>
                </div>
                {state.scenes.map((sc, i) => {
                  const pr = buildPrompt(sc, state.characters, state.styles, state.project);
                  return <GlassCard key={sc.id} padding={12} style={{ marginBottom: 8 }}>
                    {sc.narration && <div style={{ background: "rgba(236,72,153,0.06)", borderRadius: 8, padding: "4px 10px", marginBottom: 8, fontSize: 11, color: "#ec4899" }}>🎙️ "{sc.narration}"</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: gold }}>Cena {i + 1}{sc.title ? ` — ${sc.title}` : ""}</span>
                      <Btn ghost sm onClick={() => cp(pr, `p${sc.id}`)}>{copied === `p${sc.id}` ? "✓" : "⎘"}</Btn>
                    </div>
                    <div style={{ fontSize: 10, color: "#777", lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>{pr}</div>
                  </GlassCard>;
                })}
              </div>
            </>}
          </div>}

          {/* ═══ CHARACTERS ═══ */}
          {state.tab === "characters" && <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 300 }}>Perso<span style={{ color: gold, fontWeight: 600 }}>nagens</span></h2>
              <Btn gold sm onClick={() => dispatch({ type: "PANEL", v: { t: "char", d: {} } })}>+ Novo</Btn>
            </div>
            {state.characters.length === 0 ? <div style={{ textAlign: "center", padding: 60 }}><p style={{ color: "#666", fontSize: 12 }}>Nenhum personagem.</p><Btn gold onClick={() => dispatch({ type: "PANEL", v: { t: "char", d: {} } })} style={{ marginTop: 12 }}>Criar</Btn></div>
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {state.characters.map(ch => <GlassCard key={ch.id} onClick={() => dispatch({ type: "PANEL", v: { t: "char", d: ch } })}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><div style={{ fontSize: 14, fontWeight: 600 }}>{ch.name}</div><div style={{ fontSize: 10, color: dim }}>{[ch.gender, ch.age && `${ch.age}a`].filter(Boolean).join(" · ")}</div></div>
                    <Btn ghost sm danger onClick={e => { e.stopPropagation(); dispatch({ type: "DEL_CHAR", v: ch.id }); }}>✕</Btn>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", maxHeight: 50, overflow: "hidden", lineHeight: 1.5 }}>{ch.prompt}</div>
                </GlassCard>)}
              </div>}
          </div>}

          {/* ═══ STYLES ═══ */}
          {state.tab === "styles" && <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 300 }}>Esti<span style={{ color: gold, fontWeight: 600 }}>los</span></h2>
              <Btn gold sm onClick={() => dispatch({ type: "PANEL", v: { t: "sty", d: {} } })}>+ Novo</Btn>
            </div>
            {state.styles.length === 0 ? <div style={{ textAlign: "center", padding: 60 }}><p style={{ color: "#666", fontSize: 12 }}>Nenhum estilo.</p><div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}><Btn gold onClick={() => dispatch({ type: "PANEL", v: { t: "sty", d: {} } })}>Criar</Btn>{TEMPLATES.map(t => <Btn key={t.id} sm onClick={() => dispatch({ type: "TPL", v: t.data })}>{t.icon}</Btn>)}</div></div>
              : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {state.styles.map(st => <GlassCard key={st.id} onClick={() => dispatch({ type: "PANEL", v: { t: "sty", d: st } })}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{st.name}</div>
                    <Btn ghost sm danger onClick={e => { e.stopPropagation(); dispatch({ type: "DEL_STY", v: st.id }); }}>✕</Btn>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", maxHeight: 50, overflow: "hidden" }}>{st.prompt}</div>
                </GlassCard>)}
              </div>}
          </div>}

          {/* ═══ LIBRARY ═══ */}
          {state.tab === "library" && <div>
            <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 300 }}>Biblio<span style={{ color: gold, fontWeight: 600 }}>teca</span></h2>
            {[
              { k: "cameras", l: "Câmera" }, { k: "eyes", l: "👁️ Direção do Olhar" },
              { k: "lenses", l: "Lentes" }, { k: "lights", l: "Iluminação" },
              { k: "moods", l: "Mood" }, { k: "audios", l: "Áudio" },
            ].map(cat => <div key={cat.k} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 11, fontWeight: 600, color: gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{cat.l}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 6 }}>
                {LIB[cat.k].map(item => <GlassCard key={item.id} padding={10} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 11, fontWeight: 500 }}>{item.name}</div><div style={{ fontSize: 9, color: "#555", marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{item.v.slice(0, 50)}...</div></div>
                  <Btn ghost sm onClick={() => cp(item.v, item.id)}>{copied === item.id ? "✓" : "⎘"}</Btn>
                </GlassCard>)}
              </div>
            </div>)}
          </div>}

          {/* ═══ EXPORT ═══ */}
          {state.tab === "export" && <div>
            <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 300 }}>Expor<span style={{ color: gold, fontWeight: 600 }}>tar</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              <GlassCard><h3 style={{ margin: "0 0 4px", fontSize: 13 }}>💾 Projeto</h3><p style={{ margin: "0 0 12px", fontSize: 11, color: "#666" }}>JSON reimportável</p><Btn gold onClick={expJSON}>Exportar</Btn></GlassCard>
              <GlassCard><h3 style={{ margin: "0 0 4px", fontSize: 13 }}>📝 Prompts</h3><p style={{ margin: "0 0 12px", fontSize: 11, color: "#666" }}>Com narração</p><Btn gold onClick={expTXT}>Exportar</Btn></GlassCard>
              <GlassCard><h3 style={{ margin: "0 0 4px", fontSize: 13 }}>📂 Importar</h3><p style={{ margin: "0 0 12px", fontSize: 11, color: "#666" }}>Carregar .json</p><Btn onClick={imp}>Importar</Btn></GlassCard>
            </div>
            {state.scenes.length > 0 && <GlassCard style={{ marginTop: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, textAlign: "center" }}>
                {[{ l: "Cenas", v: state.scenes.length, c: gold }, { l: "Personagens", v: state.characters.length, c: "#06b6d4" }, { l: "Duração", v: `${td}s`, c: "#f59e0b" }, { l: "Custo", v: `$${cost}`, c: "#10b981" }].map(s =>
                  <div key={s.l}><div style={{ fontSize: 28, fontWeight: 200, color: s.c }}>{s.v}</div><div style={{ fontSize: 9, color: dim, letterSpacing: 1, textTransform: "uppercase" }}>{s.l}</div></div>)}
              </div>
            </GlassCard>}
          </div>}
        </div>

        {/* Right Panel */}
        {(state.panel || state.guide) && <div style={{ width: 380, borderLeft: "1px solid rgba(255,255,255,0.04)", background: "#0f0f14", padding: 18, overflowY: "auto", flexShrink: 0 }}>
          {state.guide ? <Guide onClose={() => dispatch({ type: "GUIDE" })} />
            : state.panel?.t === "char" ? <CharEditor char={state.panel.d} dispatch={dispatch} onClose={() => dispatch({ type: "PANEL", v: null })} />
              : state.panel?.t === "sty" ? <StyEditor sty={state.panel.d} dispatch={dispatch} onClose={() => dispatch({ type: "PANEL", v: null })} />
                : state.panel?.t === "scene" ? <ScEditor sc={state.panel.d} state={state} dispatch={dispatch} onClose={() => dispatch({ type: "PANEL", v: null })} />
                  : null}
        </div>}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 24px", fontSize: 9, color: dim, display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.03)", letterSpacing: 0.5 }}>
        <span>👁️ Anti-camera-stare · 🎙️ Narração · 💾 Auto-save</span>
        <span>Aurora · $0.05/s · $0.07/s</span>
      </div>
    </div>
  );
}
