import { useState, useCallback, useReducer, useRef, useEffect } from "react";

// ─── State Management ───
const initialState = {
  // Navigation
  activeTab: "storyboard", // storyboard | characters | styles | prompts | export
  activePanel: null, // which scene/character/style is being edited
  
  // Project
  project: {
    name: "Novo Projeto",
    aspectRatio: "16:9",
    resolution: "720p",
    defaultDuration: 8,
  },
  
  // Characters
  characters: [],
  
  // Styles
  styles: [],
  
  // Scenes
  scenes: [],
  
  // Prompt Templates
  promptTemplates: {
    cameras: [
      { id: "cam1", name: "Dolly Forward", value: "smooth dolly forward tracking move" },
      { id: "cam2", name: "Pan Direita", value: "smooth pan right revealing the scene" },
      { id: "cam3", name: "Crane Up", value: "crane shot rising upward" },
      { id: "cam4", name: "Close-up Estático", value: "static extreme close-up, shallow depth of field" },
      { id: "cam5", name: "Tracking Lateral", value: "lateral tracking shot following the subject" },
      { id: "cam6", name: "Handheld", value: "subtle handheld movement, documentary feel" },
      { id: "cam7", name: "Zoom Lento", value: "slow smooth zoom in" },
      { id: "cam8", name: "Dutch Angle", value: "Dutch angle tilted composition, dramatic tension" },
      { id: "cam9", name: "POV", value: "first person POV camera movement" },
      { id: "cam10", name: "Orbital", value: "slow orbital camera circling around subject" },
    ],
    lightings: [
      { id: "lit1", name: "Golden Hour", value: "warm golden hour sunlight, long shadows, amber glow" },
      { id: "lit2", name: "Neon Noir", value: "neon-lit urban night, cyan and magenta reflections, dark shadows" },
      { id: "lit3", name: "Estúdio Suave", value: "soft diffused studio lighting, minimal shadows, clean" },
      { id: "lit4", name: "Contraluz", value: "dramatic backlighting creating silhouette rim light" },
      { id: "lit5", name: "Luz Natural", value: "natural daylight, bright and airy, realistic" },
      { id: "lit6", name: "Moody Low-Key", value: "low-key dramatic lighting, deep shadows, single light source" },
      { id: "lit7", name: "Fluorescente Frio", value: "cold fluorescent overhead lighting, clinical, blue-green tint" },
      { id: "lit8", name: "Velas/Prático", value: "warm practical candlelight, intimate, flickering" },
    ],
    moods: [
      { id: "mood1", name: "Épico/Trailer", value: "epic cinematic trailer mood, high contrast, dramatic" },
      { id: "mood2", name: "Intimista", value: "intimate and quiet, contemplative, personal" },
      { id: "mood3", name: "Enérgico", value: "high energy, vibrant, dynamic movement" },
      { id: "mood4", name: "Misterioso", value: "mysterious and suspenseful, ominous atmosphere" },
      { id: "mood5", name: "Alegre", value: "joyful, bright, optimistic, warm colors" },
      { id: "mood6", name: "Melancólico", value: "melancholic, desaturated, wistful, slow pace" },
      { id: "mood7", name: "Futurista", value: "sleek futuristic aesthetic, clean lines, tech-forward" },
      { id: "mood8", name: "Retrô/Vintage", value: "retro vintage film aesthetic, grain, muted tones, nostalgic" },
    ],
    lenses: [
      { id: "lens1", name: "24mm Wide", value: "24mm wide angle lens" },
      { id: "lens2", name: "35mm Natural", value: "35mm lens, natural perspective" },
      { id: "lens3", name: "50mm Standard", value: "50mm standard lens, shallow DoF" },
      { id: "lens4", name: "85mm Retrato", value: "85mm portrait lens, beautiful bokeh" },
      { id: "lens5", name: "135mm Tele", value: "135mm telephoto compression" },
      { id: "lens6", name: "Anamórfico", value: "anamorphic lens, horizontal flares, cinematic widescreen" },
    ],
    audios: [
      { id: "aud1", name: "Sem Música", value: "No music" },
      { id: "aud2", name: "Épico Orquestral", value: "epic orchestral score building to climax" },
      { id: "aud3", name: "Ambiente Urbano", value: "urban city ambience, traffic, distant voices" },
      { id: "aud4", name: "Natureza", value: "natural ambient sounds, birds, wind, water" },
      { id: "aud5", name: "Lo-Fi Chill", value: "lo-fi chill beats, relaxed atmosphere" },
      { id: "aud6", name: "Suspense Tenso", value: "tense suspenseful score, low drones, heartbeat" },
      { id: "aud7", name: "Silêncio + SFX", value: "complete silence except for specific sound effects" },
    ],
  },
  
  // UI State
  showPromptPreview: false,
  previewSceneId: null,
  dragOverSceneId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_TAB": return { ...state, activeTab: action.payload };
    case "SET_PANEL": return { ...state, activePanel: action.payload };
    case "UPDATE_PROJECT": return { ...state, project: { ...state.project, ...action.payload } };
    
    // Characters
    case "ADD_CHARACTER": return { ...state, characters: [...state.characters, action.payload] };
    case "UPDATE_CHARACTER": return { ...state, characters: state.characters.map(c => c.id === action.payload.id ? { ...c, ...action.payload } : c) };
    case "DELETE_CHARACTER": return { ...state, characters: state.characters.filter(c => c.id !== action.payload) };
    
    // Styles
    case "ADD_STYLE": return { ...state, styles: [...state.styles, action.payload] };
    case "UPDATE_STYLE": return { ...state, styles: state.styles.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) };
    case "DELETE_STYLE": return { ...state, styles: state.styles.filter(s => s.id !== action.payload) };
    
    // Scenes
    case "ADD_SCENE": return { ...state, scenes: [...state.scenes, action.payload] };
    case "UPDATE_SCENE": return { ...state, scenes: state.scenes.map(s => s.id === action.payload.id ? { ...s, ...action.payload } : s) };
    case "DELETE_SCENE": return { ...state, scenes: state.scenes.filter(s => s.id !== action.payload) };
    case "REORDER_SCENES": return { ...state, scenes: action.payload };
    
    case "SET_PREVIEW": return { ...state, showPromptPreview: action.payload.show, previewSceneId: action.payload.sceneId };
    case "SET_DRAG_OVER": return { ...state, dragOverSceneId: action.payload };
    
    // Import/Export
    case "LOAD_PROJECT": return { ...state, ...action.payload };
    
    default: return state;
  }
}

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ─── Prompt Builder ───
function buildPrompt(scene, characters, styles, project) {
  const parts = [];
  
  // Duration + Aspect ratio header
  parts.push(`${scene.duration || project.defaultDuration}-second ${project.aspectRatio}`);
  
  // Style prefix
  if (scene.styleId) {
    const style = styles.find(s => s.id === scene.styleId);
    if (style) parts.push(style.prompt);
  }
  
  // Shot type
  if (scene.shotType) parts.push(scene.shotType);
  
  // Main subject/character + action (FRONT-LOADED for maximum weight)
  const sceneChars = (scene.characterIds || []).map(cid => characters.find(c => c.id === cid)).filter(Boolean);
  if (sceneChars.length > 0) {
    sceneChars.forEach(char => {
      parts.push(`${char.prompt}`);
    });
  }
  
  // Action description
  if (scene.action) parts.push(scene.action);
  
  // Environment
  if (scene.environment) parts.push(scene.environment);
  
  // Camera
  if (scene.camera) parts.push(scene.camera);
  
  // Lens
  if (scene.lens) parts.push(scene.lens);
  
  // Lighting
  if (scene.lighting) parts.push(scene.lighting);
  
  // Mood
  if (scene.mood) parts.push(scene.mood);
  
  // Extra details
  if (scene.extras) parts.push(scene.extras);
  
  // Audio (always last)
  let audioSection = "";
  if (scene.audio) audioSection = `Audio: ${scene.audio}.`;
  if (scene.dialogue) audioSection += ` Dialogue: "${scene.dialogue}"`;
  if (audioSection) parts.push(audioSection.trim());
  
  return parts.filter(Boolean).join(". ").replace(/\.\./g, ".").trim();
}

function countWords(text) {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

// ─── Color Palette ───
const C = {
  bg: "#0a0a0f",
  surface: "#12121a",
  surfaceHover: "#1a1a26",
  card: "#16161f",
  cardHover: "#1e1e2a",
  border: "#2a2a3a",
  borderFocus: "#6366f1",
  text: "#e8e8f0",
  textMuted: "#8888a0",
  textDim: "#5a5a70",
  accent: "#6366f1",
  accentHover: "#818cf8",
  accentSoft: "rgba(99,102,241,0.12)",
  success: "#10b981",
  successSoft: "rgba(16,185,129,0.12)",
  warning: "#f59e0b",
  warningSoft: "rgba(245,158,11,0.12)",
  danger: "#ef4444",
  dangerSoft: "rgba(239,68,68,0.12)",
  cyan: "#06b6d4",
  cyanSoft: "rgba(6,182,212,0.12)",
  purple: "#a855f7",
  purpleSoft: "rgba(168,85,247,0.12)",
  pink: "#ec4899",
  pinkSoft: "rgba(236,72,153,0.12)",
};

// ─── Icons (inline SVG) ───
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const paths = {
    film: <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" fill="none" stroke={color} strokeWidth="1.5"/><line x1="7" y1="2" x2="7" y2="22" stroke={color} strokeWidth="1.5"/><line x1="17" y1="2" x2="17" y2="22" stroke={color} strokeWidth="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5"/><line x1="2" y1="7" x2="7" y2="7" stroke={color} strokeWidth="1.5"/><line x1="2" y1="17" x2="7" y2="17" stroke={color} strokeWidth="1.5"/><line x1="17" y1="7" x2="22" y2="7" stroke={color} strokeWidth="1.5"/><line x1="17" y1="17" x2="22" y2="17" stroke={color} strokeWidth="1.5"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,
    palette: <><circle cx="13.5" cy="6.5" r="0.5" fill={color}/><circle cx="17.5" cy="10.5" r="0.5" fill={color}/><circle cx="8.5" cy="7.5" r="0.5" fill={color}/><circle cx="6.5" cy="12" r="0.5" fill={color}/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" fill="none" stroke={color} strokeWidth="1.5"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke={color} strokeWidth="1.5"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="7 10 12 15 17 10" fill="none" stroke={color} strokeWidth="1.5"/><line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="1.5"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="2"/></>,
    trash: <><polyline points="3 6 5 6 21 6" fill="none" stroke={color} strokeWidth="1.5"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke={color} strokeWidth="1.5"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" fill="none" stroke={color} strokeWidth="1.5"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke={color} strokeWidth="1.5"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1.5"/></>,
    chevDown: <><polyline points="6 9 12 15 18 9" fill="none" stroke={color} strokeWidth="1.5"/></>,
    chevRight: <><polyline points="9 18 15 12 9 6" fill="none" stroke={color} strokeWidth="1.5"/></>,
    grip: <><circle cx="9" cy="5" r="1" fill={color}/><circle cx="9" cy="12" r="1" fill={color}/><circle cx="9" cy="19" r="1" fill={color}/><circle cx="15" cy="5" r="1" fill={color}/><circle cx="15" cy="12" r="1" fill={color}/><circle cx="15" cy="19" r="1" fill={color}/></>,
    camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="13" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,
    settings: <><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="1.5"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke={color} strokeWidth="1.5"/></>,
    play: <><polygon points="5 3 19 12 5 21 5 3" fill="none" stroke={color} strokeWidth="1.5"/></>,
    music: <><path d="M9 18V5l12-2v13" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="6" cy="18" r="3" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="18" cy="16" r="3" fill="none" stroke={color} strokeWidth="1.5"/></>,
    sun: <><circle cx="12" cy="12" r="5" fill="none" stroke={color} strokeWidth="1.5"/><line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="1.5"/><line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="1.5"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="1.5"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="1.5"/><line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="1.5"/><line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="1.5"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="1.5"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="1.5"/></>,
    move: <><polyline points="5 9 2 12 5 15" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="9 5 12 2 15 5" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="15 19 12 22 9 19" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="19 9 22 12 19 15" fill="none" stroke={color} strokeWidth="1.5"/><line x1="2" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5"/><line x1="12" y1="2" x2="12" y2="22" stroke={color} strokeWidth="1.5"/></>,
    type: <><polyline points="4 7 4 4 20 4 20 7" fill="none" stroke={color} strokeWidth="1.5"/><line x1="9" y1="20" x2="15" y2="20" stroke={color} strokeWidth="1.5"/><line x1="12" y1="4" x2="12" y2="20" stroke={color} strokeWidth="1.5"/></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="17 21 17 13 7 13 7 21" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="7 3 7 8 15 8" fill="none" stroke={color} strokeWidth="1.5"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="17 8 12 3 7 8" fill="none" stroke={color} strokeWidth="1.5"/><line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="1.5"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}>{paths[name]}</svg>;
};

// ─── Reusable Components ───
const Btn = ({ children, onClick, variant = "default", size = "md", icon, style: extraStyle, disabled, title }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", fontWeight: 500, borderRadius: 8, transition: "all 0.15s",
    opacity: disabled ? 0.4 : 1, whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { padding: "5px 10px", fontSize: 12 },
    md: { padding: "8px 14px", fontSize: 13 },
    lg: { padding: "10px 18px", fontSize: 14 },
  };
  const variants = {
    default: { background: C.surfaceHover, color: C.text },
    accent: { background: C.accent, color: "#fff" },
    ghost: { background: "transparent", color: C.textMuted },
    danger: { background: C.dangerSoft, color: C.danger },
    success: { background: C.successSoft, color: C.success },
    outline: { background: "transparent", color: C.accent, border: `1px solid ${C.border}` },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extraStyle }}
      onMouseEnter={e => { if (!disabled) e.target.style.opacity = "0.85"; }}
      onMouseLeave={e => { e.target.style.opacity = disabled ? "0.4" : "1"; }}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, multiline, rows = 3, style: extraStyle }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
    {multiline ? (
      <textarea
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px",
          color: C.text, fontSize: 13, fontFamily: "inherit", resize: "vertical",
          outline: "none", transition: "border-color 0.15s", ...extraStyle,
        }}
        onFocus={e => e.target.style.borderColor = C.borderFocus}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    ) : (
      <input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px",
          color: C.text, fontSize: 13, fontFamily: "inherit",
          outline: "none", transition: "border-color 0.15s", ...extraStyle,
        }}
        onFocus={e => e.target.style.borderColor = C.borderFocus}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    )}
  </div>
);

const Select = ({ label, value, onChange, options, placeholder }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    {label && <label style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>}
    <select
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      style={{
        background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px",
        color: value ? C.text : C.textDim, fontSize: 13, fontFamily: "inherit",
        outline: "none", cursor: "pointer", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238888a0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
        paddingRight: 30,
      }}
    >
      <option value="" style={{ color: C.textDim }}>{placeholder || "Selecione..."}</option>
      {options.map(o => <option key={o.value || o.id} value={o.value || o.id} style={{ color: C.text, background: C.surface }}>{o.label || o.name}</option>)}
    </select>
  </div>
);

const Badge = ({ children, color = C.accent, bg }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20,
    fontSize: 10, fontWeight: 700, color, background: bg || `${color}22`, letterSpacing: 0.3,
    textTransform: "uppercase",
  }}>{children}</span>
);

const Card = ({ children, style: extraStyle, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: 16, cursor: onClick ? "pointer" : "default",
      transition: "all 0.15s", ...extraStyle,
    }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = C.borderFocus; e.currentTarget.style.background = C.cardHover; }}}
    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}
  >
    {children}
  </div>
);

const Chip = ({ label, selected, onClick, color = C.accent }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", padding: "4px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 500, border: `1px solid ${selected ? color : C.border}`,
      background: selected ? `${color}18` : "transparent",
      color: selected ? color : C.textMuted, cursor: "pointer",
      transition: "all 0.15s", fontFamily: "inherit",
    }}
  >{label}</button>
);

const Divider = () => <div style={{ height: 1, background: C.border, margin: "12px 0" }} />;

// ─── Tabs ───
const TABS = [
  { id: "storyboard", label: "Storyboard", icon: "film" },
  { id: "characters", label: "Personagens", icon: "user" },
  { id: "styles", label: "Estilos", icon: "palette" },
  { id: "prompts", label: "Biblioteca", icon: "zap" },
  { id: "export", label: "Exportar", icon: "download" },
];

// ─── Character Editor ───
function CharacterEditor({ character, dispatch, onClose }) {
  const [c, setC] = useState({ ...character });
  const update = (k, v) => setC(prev => ({ ...prev, [k]: v }));
  
  const save = () => {
    // Build composite prompt
    const promptParts = [];
    if (c.gender) promptParts.push(c.gender);
    if (c.age) promptParts.push(`${c.age} years old`);
    if (c.ethnicity) promptParts.push(c.ethnicity);
    if (c.body) promptParts.push(c.body);
    if (c.face) promptParts.push(c.face);
    if (c.hair) promptParts.push(c.hair);
    if (c.clothing) promptParts.push(`wearing ${c.clothing}`);
    if (c.extras) promptParts.push(c.extras);
    const prompt = promptParts.join(", ");
    
    dispatch({ type: character.id ? "UPDATE_CHARACTER" : "ADD_CHARACTER", payload: { ...c, prompt, id: c.id || uid() } });
    onClose();
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, color: C.text }}>{character.id ? "Editar" : "Novo"} Personagem</h3>
        <Btn variant="ghost" size="sm" onClick={onClose}>✕</Btn>
      </div>
      
      <Input label="Nome" value={c.name} onChange={v => update("name", v)} placeholder="Ex: Detective Silva" />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Input label="Gênero" value={c.gender} onChange={v => update("gender", v)} placeholder="Ex: male, female" />
        <Input label="Idade" value={c.age} onChange={v => update("age", v)} placeholder="Ex: 35" />
      </div>
      
      <Input label="Etnia / Tom de Pele" value={c.ethnicity} onChange={v => update("ethnicity", v)} placeholder="Ex: Brazilian, dark skin" />
      <Input label="Corpo / Build" value={c.body} onChange={v => update("body", v)} placeholder="Ex: tall athletic build" />
      <Input label="Rosto / Traços" value={c.face} onChange={v => update("face", v)} placeholder="Ex: sharp jawline, brown eyes, stubble" />
      <Input label="Cabelo" value={c.hair} onChange={v => update("hair", v)} placeholder="Ex: short black curly hair" />
      <Input label="Roupa / Figurino" value={c.clothing} onChange={v => update("clothing", v)} placeholder="Ex: dark brown leather jacket, white t-shirt, jeans" />
      <Input label="Detalhes Extras" value={c.extras} onChange={v => update("extras", v)} placeholder="Ex: silver wristwatch, scar on left cheek" multiline rows={2} />
      
      <div style={{ background: C.bg, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Preview do Prompt</div>
        <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>
          {[c.gender, c.age && `${c.age} years old`, c.ethnicity, c.body, c.face, c.hair, c.clothing && `wearing ${c.clothing}`, c.extras].filter(Boolean).join(", ") || "Preencha os campos acima..."}
        </div>
      </div>
      
      <Btn variant="accent" onClick={save} icon="save">Salvar Personagem</Btn>
    </div>
  );
}

// ─── Style Editor ───
function StyleEditor({ style, dispatch, onClose }) {
  const [s, setS] = useState({ ...style });
  const update = (k, v) => setS(prev => ({ ...prev, [k]: v }));
  
  const save = () => {
    const promptParts = [];
    if (s.visualStyle) promptParts.push(s.visualStyle);
    if (s.colorGrade) promptParts.push(s.colorGrade);
    if (s.filmRef) promptParts.push(s.filmRef);
    if (s.texture) promptParts.push(s.texture);
    if (s.extras) promptParts.push(s.extras);
    const prompt = promptParts.join(", ");
    
    dispatch({ type: style.id ? "UPDATE_STYLE" : "ADD_STYLE", payload: { ...s, prompt, id: s.id || uid() } });
    onClose();
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, color: C.text }}>{style.id ? "Editar" : "Novo"} Estilo</h3>
        <Btn variant="ghost" size="sm" onClick={onClose}>✕</Btn>
      </div>
      
      <Input label="Nome do Estilo" value={s.name} onChange={v => update("name", v)} placeholder="Ex: Neo-Noir Cyberpunk" />
      <Input label="Estilo Visual" value={s.visualStyle} onChange={v => update("visualStyle", v)} placeholder="Ex: cinematic, photorealistic, anime, watercolor" />
      <Input label="Color Grade" value={s.colorGrade} onChange={v => update("colorGrade", v)} placeholder="Ex: teal and orange, desaturated, high contrast" />
      <Input label="Referência de Filme/Câmera" value={s.filmRef} onChange={v => update("filmRef", v)} placeholder="Ex: shot on ARRI Alexa Mini LF, Blade Runner 2049 look" />
      <Input label="Textura / Grain" value={s.texture} onChange={v => update("texture", v)} placeholder="Ex: subtle film grain, 35mm film stock" />
      <Input label="Extras" value={s.extras} onChange={v => update("extras", v)} placeholder="Ex: atmospheric haze, volumetric lighting" multiline rows={2} />
      
      <div style={{ background: C.bg, borderRadius: 8, padding: 10, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Preview do Estilo</div>
        <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>
          {[s.visualStyle, s.colorGrade, s.filmRef, s.texture, s.extras].filter(Boolean).join(", ") || "Preencha os campos acima..."}
        </div>
      </div>
      
      <Btn variant="accent" onClick={save} icon="save">Salvar Estilo</Btn>
    </div>
  );
}

// ─── Scene Editor ───
function SceneEditor({ scene, state, dispatch, onClose }) {
  const [s, setS] = useState({ ...scene });
  const update = (k, v) => setS(prev => ({ ...prev, [k]: v }));
  
  const toggleChar = (charId) => {
    const ids = s.characterIds || [];
    update("characterIds", ids.includes(charId) ? ids.filter(id => id !== charId) : [...ids, charId]);
  };
  
  const save = () => {
    dispatch({ type: scene.id ? "UPDATE_SCENE" : "ADD_SCENE", payload: { ...s, id: s.id || uid(), order: s.order ?? state.scenes.length } });
    onClose();
  };
  
  const fullPrompt = buildPrompt(s, state.characters, state.styles, state.project);
  const wordCount = countWords(fullPrompt);
  const wordColor = wordCount < 50 ? C.warning : wordCount > 150 ? C.danger : C.success;
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: C.card, paddingBottom: 8, zIndex: 2 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: C.text }}>{scene.id ? `Cena #${state.scenes.findIndex(sc => sc.id === scene.id) + 1}` : "Nova Cena"}</h3>
        <Btn variant="ghost" size="sm" onClick={onClose}>✕</Btn>
      </div>
      
      <Input label="Título da Cena" value={s.title} onChange={v => update("title", v)} placeholder="Ex: Perseguição na chuva" />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <Select label="Duração" value={s.duration} onChange={v => update("duration", v)} options={[
          { value: "5", label: "5 segundos" }, { value: "6", label: "6 segundos" }, { value: "8", label: "8 segundos" },
          { value: "10", label: "10 segundos" }, { value: "12", label: "12 segundos" }, { value: "15", label: "15 segundos" },
        ]} placeholder="Padrão do projeto" />
        <Select label="Estilo" value={s.styleId} onChange={v => update("styleId", v)}
          options={state.styles.map(st => ({ value: st.id, label: st.name }))} placeholder="Nenhum" />
      </div>
      
      {/* Characters */}
      {state.characters.length > 0 && (
        <div>
          <label style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, display: "block" }}>Personagens na Cena</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {state.characters.map(ch => (
              <Chip key={ch.id} label={ch.name} selected={(s.characterIds || []).includes(ch.id)} onClick={() => toggleChar(ch.id)} color={C.cyan} />
            ))}
          </div>
        </div>
      )}
      
      <Select label="Tipo de Shot" value={s.shotType} onChange={v => update("shotType", v)} options={[
        { value: "extreme wide shot", label: "Extreme Wide Shot" },
        { value: "wide shot", label: "Wide Shot" },
        { value: "medium shot", label: "Medium Shot" },
        { value: "medium close-up", label: "Medium Close-up" },
        { value: "close-up", label: "Close-up" },
        { value: "extreme close-up", label: "Extreme Close-up" },
        { value: "over-the-shoulder shot", label: "Over the Shoulder" },
        { value: "POV shot", label: "POV" },
        { value: "bird's eye view", label: "Bird's Eye View" },
        { value: "low angle shot", label: "Low Angle" },
      ]} />
      
      <Input label="Ação / O que acontece" value={s.action} onChange={v => update("action", v)} placeholder="Ex: o detetive examina as pistas sobre a mesa enquanto a chuva bate na janela" multiline rows={3} />
      <Input label="Ambiente / Cenário" value={s.environment} onChange={v => update("environment", v)} placeholder="Ex: escritório escuro e bagunçado, noite chuvosa, cidade visível pela janela" multiline rows={2} />
      
      <Select label="Câmera" value={s.camera} onChange={v => update("camera", v)}
        options={state.promptTemplates.cameras.map(c => ({ value: c.value, label: c.name }))} />
      
      <Select label="Lente" value={s.lens} onChange={v => update("lens", v)}
        options={state.promptTemplates.lenses.map(l => ({ value: l.value, label: l.name }))} />
      
      <Select label="Iluminação" value={s.lighting} onChange={v => update("lighting", v)}
        options={state.promptTemplates.lightings.map(l => ({ value: l.value, label: l.name }))} />
      
      <Select label="Mood / Clima" value={s.mood} onChange={v => update("mood", v)}
        options={state.promptTemplates.moods.map(m => ({ value: m.value, label: m.name }))} />
      
      <Select label="Áudio" value={s.audio} onChange={v => update("audio", v)}
        options={state.promptTemplates.audios.map(a => ({ value: a.value, label: a.name }))} />
      
      <Input label="Diálogo (opcional)" value={s.dialogue} onChange={v => update("dialogue", v)} placeholder='Ex: "Eu sabia que era você desde o começo."' />
      <Input label="Detalhes Extras" value={s.extras} onChange={v => update("extras", v)} placeholder="Ex: crisp motion, sharp focus, cinematic depth" multiline rows={2} />
      
      <Divider />
      
      {/* Prompt Preview */}
      <div style={{ background: C.bg, borderRadius: 10, padding: 12, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 0.5 }}>Prompt Final para o Grok Imagine</span>
          <Badge color={wordColor}>{wordCount} palavras</Badge>
        </div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6, fontFamily: "'JetBrains Mono', 'Fira Code', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {fullPrompt || "Configure os campos acima para gerar o prompt..."}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 8 }}>
        <Btn variant="accent" onClick={save} icon="save" style={{ flex: 1 }}>Salvar Cena</Btn>
        <Btn variant="outline" onClick={() => navigator.clipboard?.writeText(fullPrompt)} icon="copy" title="Copiar prompt">Copiar</Btn>
      </div>
    </div>
  );
}

// ─── Scene Card (Timeline) ───
function SceneCard({ scene, index, state, dispatch }) {
  const sceneChars = (scene.characterIds || []).map(cid => state.characters.find(c => c.id === cid)).filter(Boolean);
  const style = state.styles.find(s => s.id === scene.styleId);
  const fullPrompt = buildPrompt(scene, state.characters, state.styles, state.project);
  const wordCount = countWords(fullPrompt);
  
  const gradients = [
    "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    "linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)",
    "linear-gradient(135deg, #1e1e30 0%, #2d1b4e 100%)",
    "linear-gradient(135deg, #1a1a2e 0%, #1b4332 100%)",
    "linear-gradient(135deg, #1e1e2a 0%, #4a1942 100%)",
  ];
  
  return (
    <div
      style={{
        background: gradients[index % gradients.length],
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        padding: 0,
        width: 280,
        flexShrink: 0,
        overflow: "hidden",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onClick={() => dispatch({ type: "SET_PANEL", payload: { type: "scene", data: scene } })}
      onMouseEnter={e => { e.currentTarget.style.borderColor = C.borderFocus; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
    >
      {/* Header */}
      <div style={{ padding: "12px 14px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: C.accentSoft, color: C.accent, width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{index + 1}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{scene.title || `Cena ${index + 1}`}</span>
        </div>
        <Badge color={C.cyan}>{scene.duration || state.project.defaultDuration}s</Badge>
      </div>
      
      {/* Visual preview area */}
      <div style={{ height: 100, margin: "0 14px", borderRadius: 8, background: `${C.bg}88`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4, border: `1px solid ${C.border}44` }}>
        <Icon name="play" size={24} color={C.textDim} />
        <span style={{ fontSize: 10, color: C.textDim }}>Preview</span>
      </div>
      
      {/* Info */}
      <div style={{ padding: "8px 14px 12px" }}>
        {scene.action && <p style={{ margin: "4px 0", fontSize: 11, color: C.textMuted, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{scene.action}</p>}
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
          {sceneChars.map(ch => <Badge key={ch.id} color={C.cyan}>{ch.name}</Badge>)}
          {style && <Badge color={C.purple}>{style.name}</Badge>}
          {scene.shotType && <Badge color={C.textMuted} bg={C.surfaceHover}>{scene.shotType}</Badge>}
        </div>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <span style={{ fontSize: 10, color: C.textDim }}>{wordCount} palavras no prompt</span>
          <div style={{ display: "flex", gap: 4 }}>
            <Btn variant="ghost" size="sm" icon="copy" title="Copiar prompt"
              onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(fullPrompt); }} />
            <Btn variant="ghost" size="sm" icon="trash" title="Excluir"
              onClick={e => { e.stopPropagation(); dispatch({ type: "DELETE_SCENE", payload: scene.id }); }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function GrokStoryboardTool() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const scrollRef = useRef(null);
  
  const addNewScene = () => dispatch({ type: "SET_PANEL", payload: { type: "scene", data: {} } });
  const addNewCharacter = () => dispatch({ type: "SET_PANEL", payload: { type: "character", data: {} } });
  const addNewStyle = () => dispatch({ type: "SET_PANEL", payload: { type: "style", data: {} } });
  
  // Export project as JSON
  const exportProject = () => {
    const data = {
      project: state.project,
      characters: state.characters,
      styles: state.styles,
      scenes: state.scenes,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.project.name.replace(/\s+/g, "_")}_storyboard.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Export all prompts
  const exportPrompts = () => {
    const lines = state.scenes.map((scene, i) => {
      const prompt = buildPrompt(scene, state.characters, state.styles, state.project);
      return `═══ CENA ${i + 1}: ${scene.title || "Sem título"} ═══\nDuração: ${scene.duration || state.project.defaultDuration}s | ${state.project.aspectRatio} | ${state.project.resolution}\n\n${prompt}\n`;
    });
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.project.name.replace(/\s+/g, "_")}_prompts.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Import project
  const importProject = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          dispatch({ type: "LOAD_PROJECT", payload: data });
        } catch (err) { alert("Erro ao importar: arquivo inválido"); }
      };
      reader.readAsText(file);
    };
    input.click();
  };
  
  // Total duration
  const totalDuration = state.scenes.reduce((acc, s) => acc + (parseInt(s.duration) || state.project.defaultDuration), 0);
  const estimatedCost = (totalDuration * (state.project.resolution === "720p" ? 0.07 : 0.05)).toFixed(2);
  
  return (
    <div style={{
      fontFamily: "'DM Sans', 'Satoshi', -apple-system, sans-serif",
      background: C.bg, color: C.text, minHeight: "100vh",
      display: "flex", flexDirection: "column",
    }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      
      {/* ─── Header ─── */}
      <header style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="film" size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.3 }}>StoryFlow</div>
              <div style={{ fontSize: 9, color: C.textDim, textTransform: "uppercase", letterSpacing: 1 }}>Grok Imagine Studio</div>
            </div>
          </div>
          
          <div style={{ width: 1, height: 24, background: C.border, margin: "0 4px" }} />
          
          <input
            value={state.project.name}
            onChange={e => dispatch({ type: "UPDATE_PROJECT", payload: { name: e.target.value } })}
            style={{ background: "transparent", border: "none", color: C.text, fontSize: 14, fontWeight: 500, fontFamily: "inherit", outline: "none", width: 200 }}
          />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Project Settings */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.bg, borderRadius: 8, padding: "4px 8px" }}>
            <select value={state.project.aspectRatio} onChange={e => dispatch({ type: "UPDATE_PROJECT", payload: { aspectRatio: e.target.value } })}
              style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 11, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
              {["16:9","9:16","1:1","4:3","3:4","3:2","2:3"].map(ar => <option key={ar} value={ar} style={{ background: C.surface }}>{ar}</option>)}
            </select>
            <div style={{ width: 1, height: 14, background: C.border }} />
            <select value={state.project.resolution} onChange={e => dispatch({ type: "UPDATE_PROJECT", payload: { resolution: e.target.value } })}
              style={{ background: "transparent", border: "none", color: C.textMuted, fontSize: 11, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
              <option value="480p" style={{ background: C.surface }}>480p</option>
              <option value="720p" style={{ background: C.surface }}>720p</option>
            </select>
          </div>
          
          {state.scenes.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.bg, borderRadius: 8, padding: "4px 10px", fontSize: 11, color: C.textMuted }}>
              <span>{state.scenes.length} cenas</span>
              <span>·</span>
              <span>{totalDuration}s total</span>
              <span>·</span>
              <span style={{ color: C.success }}>~${estimatedCost}</span>
            </div>
          )}
          
          <Btn variant="ghost" size="sm" icon="upload" onClick={importProject}>Importar</Btn>
          <Btn variant="ghost" size="sm" icon="save" onClick={exportProject}>Salvar</Btn>
        </div>
      </header>
      
      {/* ─── Tab Bar ─── */}
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 20px", display: "flex", gap: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: "SET_TAB", payload: tab.id })}
            style={{
              background: "none", border: "none", borderBottom: state.activeTab === tab.id ? `2px solid ${C.accent}` : "2px solid transparent",
              color: state.activeTab === tab.id ? C.text : C.textMuted,
              padding: "10px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 500,
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
            }}
          >
            <Icon name={tab.icon} size={14} />
            {tab.label}
          </button>
        ))}
      </nav>
      
      {/* ─── Main Content ─── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left: Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
          
          {/* ════════ STORYBOARD TAB ════════ */}
          {state.activeTab === "storyboard" && (
            <div>
              {state.scenes.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: 16 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 20, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="film" size={36} color={C.accent} />
                  </div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Crie seu Storyboard</h2>
                  <p style={{ margin: 0, color: C.textMuted, fontSize: 13, textAlign: "center", maxWidth: 400 }}>
                    Comece adicionando personagens e estilos, depois monte suas cenas. Cada cena gera um prompt otimizado para o Grok Imagine.
                  </p>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <Btn variant="accent" icon="plus" onClick={addNewScene}>Primeira Cena</Btn>
                    <Btn variant="outline" icon="user" onClick={() => dispatch({ type: "SET_TAB", payload: "characters" })}>Criar Personagem</Btn>
                  </div>
                </div>
              ) : (
                <>
                  {/* Timeline Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="film" size={20} color={C.accent} />
                      Timeline
                    </h2>
                    <Btn variant="accent" size="sm" icon="plus" onClick={addNewScene}>Nova Cena</Btn>
                  </div>
                  
                  {/* Scene Cards - Horizontal scroll */}
                  <div ref={scrollRef} style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16, scrollbarWidth: "thin" }}>
                    {state.scenes.map((scene, i) => (
                      <SceneCard key={scene.id} scene={scene} index={i} state={state} dispatch={dispatch} />
                    ))}
                    
                    {/* Add Scene Card */}
                    <div
                      onClick={addNewScene}
                      style={{
                        width: 280, minHeight: 220, flexShrink: 0, borderRadius: 14,
                        border: `2px dashed ${C.border}`, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="plus" size={20} color={C.accent} />
                      </div>
                      <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>Adicionar Cena</span>
                    </div>
                  </div>
                  
                  {/* All Prompts Preview */}
                  <div style={{ marginTop: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.textMuted }}>Todos os Prompts</h3>
                      <Btn variant="outline" size="sm" icon="copy" onClick={() => {
                        const all = state.scenes.map((s, i) => `--- CENA ${i+1}: ${s.title || ""} ---\n${buildPrompt(s, state.characters, state.styles, state.project)}`).join("\n\n");
                        navigator.clipboard?.writeText(all);
                      }}>Copiar Todos</Btn>
                    </div>
                    {state.scenes.map((scene, i) => {
                      const prompt = buildPrompt(scene, state.characters, state.styles, state.project);
                      return (
                        <div key={scene.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>Cena {i + 1}{scene.title ? `: ${scene.title}` : ""}</span>
                            <Btn variant="ghost" size="sm" icon="copy" onClick={() => navigator.clipboard?.writeText(prompt)} />
                          </div>
                          <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.5, fontFamily: "'JetBrains Mono', monospace" }}>{prompt}</div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* ════════ CHARACTERS TAB ════════ */}
          {state.activeTab === "characters" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="user" size={20} color={C.cyan} />
                  Personagens
                </h2>
                <Btn variant="accent" size="sm" icon="plus" onClick={addNewCharacter}>Novo Personagem</Btn>
              </div>
              
              {state.characters.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                  <p style={{ color: C.textMuted, fontSize: 13 }}>Nenhum personagem criado ainda.</p>
                  <p style={{ color: C.textDim, fontSize: 12, maxWidth: 400, margin: "8px auto" }}>
                    Crie personagens detalhados para manter consistência visual em todas as cenas. 
                    Cada campo vira parte do prompt — quanto mais específico, melhor a IA mantém o visual.
                  </p>
                  <Btn variant="accent" icon="plus" onClick={addNewCharacter} style={{ marginTop: 12 }}>Criar Primeiro Personagem</Btn>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                  {state.characters.map(char => (
                    <Card key={char.id} onClick={() => dispatch({ type: "SET_PANEL", payload: { type: "character", data: char } })}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.cyanSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon name="user" size={18} color={C.cyan} />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{char.name || "Sem Nome"}</div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>{[char.gender, char.age && `${char.age}a`, char.ethnicity].filter(Boolean).join(" · ")}</div>
                          </div>
                        </div>
                        <Btn variant="ghost" size="sm" icon="trash" onClick={e => { e.stopPropagation(); dispatch({ type: "DELETE_CHARACTER", payload: char.id }); }} />
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: C.textDim, lineHeight: 1.4, fontFamily: "'JetBrains Mono', monospace" }}>
                        {char.prompt || "Sem descrição"}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* ════════ STYLES TAB ════════ */}
          {state.activeTab === "styles" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="palette" size={20} color={C.purple} />
                  Estilos Visuais
                </h2>
                <Btn variant="accent" size="sm" icon="plus" onClick={addNewStyle}>Novo Estilo</Btn>
              </div>
              
              {state.styles.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                  <p style={{ color: C.textMuted, fontSize: 13 }}>Nenhum estilo criado ainda.</p>
                  <p style={{ color: C.textDim, fontSize: 12, maxWidth: 400, margin: "8px auto" }}>
                    Estilos definem a estética visual do projeto: color grade, referência de câmera, textura. 
                    Aplique o mesmo estilo em múltiplas cenas para consistência visual.
                  </p>
                  <Btn variant="accent" icon="plus" onClick={addNewStyle} style={{ marginTop: 12 }}>Criar Primeiro Estilo</Btn>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                  {state.styles.map(style => (
                    <Card key={style.id} onClick={() => dispatch({ type: "SET_PANEL", payload: { type: "style", data: style } })}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: C.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon name="palette" size={18} color={C.purple} />
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{style.name || "Sem Nome"}</div>
                        </div>
                        <Btn variant="ghost" size="sm" icon="trash" onClick={e => { e.stopPropagation(); dispatch({ type: "DELETE_STYLE", payload: style.id }); }} />
                      </div>
                      <div style={{ marginTop: 10, fontSize: 11, color: C.textDim, lineHeight: 1.4, fontFamily: "'JetBrains Mono', monospace" }}>
                        {style.prompt || "Sem descrição"}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* ════════ PROMPTS LIBRARY TAB ════════ */}
          {state.activeTab === "prompts" && (
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="zap" size={20} color={C.warning} />
                Biblioteca de Componentes
              </h2>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: C.textMuted }}>
                Componentes pré-definidos otimizados para o Grok Imagine. Usados automaticamente nos seletores do editor de cena.
              </p>
              
              {[
                { key: "cameras", label: "Câmera / Movimento", icon: "camera", color: C.accent },
                { key: "lenses", label: "Lentes", icon: "eye", color: C.cyan },
                { key: "lightings", label: "Iluminação", icon: "sun", color: C.warning },
                { key: "moods", label: "Mood / Clima", icon: "music", color: C.purple },
                { key: "audios", label: "Áudio", icon: "music", color: C.pink },
              ].map(cat => (
                <div key={cat.key} style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: cat.color, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <Icon name={cat.icon} size={14} color={cat.color} />
                    {cat.label}
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                    {state.promptTemplates[cat.key].map(item => (
                      <div key={item.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: C.text }}>{item.name}</div>
                          <div style={{ fontSize: 10, color: C.textDim, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{item.value}</div>
                        </div>
                        <Btn variant="ghost" size="sm" icon="copy" onClick={() => navigator.clipboard?.writeText(item.value)} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* ════════ EXPORT TAB ════════ */}
          {state.activeTab === "export" && (
            <div>
              <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="download" size={20} color={C.success} />
                Exportar Projeto
              </h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                <Card>
                  <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="save" size={16} color={C.accent} /> Projeto Completo (.json)
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: C.textMuted }}>Salva tudo — personagens, estilos, cenas. Reimporte depois para continuar editando.</p>
                  <Btn variant="accent" icon="download" onClick={exportProject}>Exportar JSON</Btn>
                </Card>
                
                <Card>
                  <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="type" size={16} color={C.warning} /> Todos os Prompts (.txt)
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: C.textMuted }}>Exporta todos os prompts prontos para copiar e colar direto no Grok Imagine.</p>
                  <Btn variant="accent" icon="download" onClick={exportPrompts} style={{ background: C.warning }}>Exportar Prompts</Btn>
                </Card>
                
                <Card>
                  <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="upload" size={16} color={C.cyan} /> Importar Projeto
                  </h3>
                  <p style={{ margin: "0 0 12px", fontSize: 12, color: C.textMuted }}>Carregue um arquivo .json previamente exportado.</p>
                  <Btn variant="outline" icon="upload" onClick={importProject}>Importar JSON</Btn>
                </Card>
              </div>
              
              {state.scenes.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: C.textMuted, marginBottom: 12 }}>Resumo do Projeto</h3>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                      {[
                        { label: "Cenas", value: state.scenes.length, color: C.accent },
                        { label: "Personagens", value: state.characters.length, color: C.cyan },
                        { label: "Duração Total", value: `${totalDuration}s`, color: C.warning },
                        { label: "Custo Estimado", value: `$${estimatedCost}`, color: C.success },
                      ].map(stat => (
                        <div key={stat.label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* ─── Right Panel (Editor) ─── */}
        {state.activePanel && (
          <div style={{
            width: 380, borderLeft: `1px solid ${C.border}`, background: C.card,
            padding: 16, overflowY: "auto", flexShrink: 0,
          }}>
            {state.activePanel.type === "character" && (
              <CharacterEditor
                character={state.activePanel.data}
                dispatch={dispatch}
                onClose={() => dispatch({ type: "SET_PANEL", payload: null })}
              />
            )}
            {state.activePanel.type === "style" && (
              <StyleEditor
                style={state.activePanel.data}
                dispatch={dispatch}
                onClose={() => dispatch({ type: "SET_PANEL", payload: null })}
              />
            )}
            {state.activePanel.type === "scene" && (
              <SceneEditor
                scene={state.activePanel.data}
                state={state}
                dispatch={dispatch}
                onClose={() => dispatch({ type: "SET_PANEL", payload: null })}
              />
            )}
          </div>
        )}
      </div>
      
      {/* ─── Dica Fixa (Footer) ─── */}
      <div style={{
        background: C.surface, borderTop: `1px solid ${C.border}`, padding: "6px 20px",
        fontSize: 10, color: C.textDim, display: "flex", justifyContent: "space-between",
      }}>
        <span>💡 Dica: Prompts entre 50-150 palavras funcionam melhor no Grok Imagine. Front-load o sujeito principal.</span>
        <span>Grok Imagine Aurora · $0.05/s (480p) · $0.07/s (720p)</span>
      </div>
    </div>
  );
}
