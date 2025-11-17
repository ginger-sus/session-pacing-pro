import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Session Pacing Pro — App principal
 * Idiomes: ca/es/en/fr
 * Cicles personalitzats, TTS/gravacions, temes/paletes, import/export, ajuda.
 */

const EVENT_KEYS = {
  START: "START",
  PAUSE: "PAUSE",
  RESET: "RESET",
  ADD10: "ADD10",
  SKIP_NEXT_PREP: "SKIP_NEXT_PREP",
  PHASE_CHANGE: "PHASE_CHANGE",
  TIMER_END: "TIMER_END",
} as const;
type EventKey = keyof typeof EVENT_KEYS | string;

const DEFAULT_PREP_MIN = 5;
const DEFAULT_ACTIVE_MIN = 60;

type UIStrings = {
  appTitle: string; subtitle: string; currentPhase: string;
  start: string; pause: string; reset: string; add10: string; skip: string; switchPhase: string;
  voiceAlerts: string; tts: string; rec: string; settings: string; language: string;
  phases: string; addPhase: string; remove: string; moveUp: string; moveDown: string;
  name: string; minutes: string; color: string; alertsTexts: string; recordAlerts: string;
  record: string; stop: string; play: string; clear: string; useRecording: string; none: string;
  theme: string; light: string; dark: string; primary: string; accent: string;
  importExport: string; importCfg: string; exportCfg: string; shareCfg: string; help: string;
  tip: string; phaseTitles: string;
};

type LangPack = {
  name: string;
  ui: UIStrings;
  defaultCycle: { id: string; title: string; minutes: number; color: string }[];
  defaultAlerts: Record<string,string>;
  helpText: string;
};

const LANGS: Record<string, LangPack> = {
  ca: {
    name: "Català/Valencià",
    ui: {
      appTitle: "Ritme de sessió",
      subtitle: "Temporitzador cíclic amb avisos personalitzables",
      currentPhase: "Fase actual",
      start: "Inicia", pause: "Pausa", reset: "Reinicia",
      add10: "+10 min a l'interval", skip: "Següent interval (+5m prep)", switchPhase: "Canvia de fase",
      voiceAlerts: "Avisos de veu", tts: "Síntesi de veu", rec: "Gravacions pròpies",
      settings: "Configuració", language: "Idioma de la interfície",
      phases: "Cicles personalitzats (fases)", addPhase: "Afig fase",
      remove: "Lleva", moveUp: "Puja", moveDown: "Baixa",
      name: "Nom", minutes: "Minuts", color: "Color",
      alertsTexts: "Textos d'avisos (per a TTS)", recordAlerts: "Grava els teus avisos (opcional)",
      record: "Grava", stop: "Para", play: "Reprodueix", clear: "Neteja",
      useRecording: "Usa gravació", none: "Sense gravació",
      theme: "Tema i paleta", light: "Clar", dark: "Fosc", primary: "Primari", accent: "Acent",
      importExport: "Importa/Exporta", importCfg: "Importa configuració", exportCfg: "Exporta configuració", shareCfg: "Comparteix configuració",
      help: "Ajuda", tip: "Consell: Les gravacions substitueixen el TTS quan existisquen.", phaseTitles: "Títols",
    },
    defaultCycle: [
      { id: "prep", title: "Preparació", minutes: DEFAULT_PREP_MIN, color: "#f59e0b" },
      { id: "active", title: "Actiu", minutes: DEFAULT_ACTIVE_MIN, color: "#10b981" },
    ],
    defaultAlerts: {
      [EVENT_KEYS.START]: "Temporitzador iniciat",
      [EVENT_KEYS.PAUSE]: "Temporitzador en pausa",
      [EVENT_KEYS.RESET]: "Temporitzador reiniciat",
      [EVENT_KEYS.ADD10]: "Afegits deu minuts",
      [EVENT_KEYS.SKIP_NEXT_PREP]: "Salt al pròxim cicle",
      [EVENT_KEYS.PHASE_CHANGE]: "Canvi de fase",
      [EVENT_KEYS.TIMER_END]: "Interval completat",
    },
    helpText: `— Ús bàsic —
1) Configura les fases del cicle (nom, minuts i color).
2) Inicia/Pausa el temporitzador. Pots afegir +10' o saltar al següent interval.
3) Activa TTS o grava els teus avisos.
4) Exporta la configuració per a usar-la en altres dispositius.

— Consells —
· Reordena fases per adaptar el cicle.
· Les gravacions es queden al navegador fins que les exportes.
· Personalitza el tema (clar/fosc) i els colors primari/acent.`,
  },
  es: {
    name: "Castellano",
    ui: {
      appTitle: "Ritmo de sesión",
      subtitle: "Temporizador cíclico con avisos personalizables",
      currentPhase: "Fase actual",
      start: "Iniciar", pause: "Pausa", reset: "Reiniciar",
      add10: "+10 min al intervalo", skip: "Siguiente intervalo (+5m prep)", switchPhase: "Cambiar de fase",
      voiceAlerts: "Avisos de voz", tts: "Síntesis de voz", rec: "Grabaciones propias",
      settings: "Configuración", language: "Idioma de la interfaz",
      phases: "Ciclos personalizados (fases)", addPhase: "Añadir fase",
      remove: "Quitar", moveUp: "Subir", moveDown: "Bajar",
      name: "Nombre", minutes: "Minutos", color: "Color",
      alertsTexts: "Textos de avisos (para TTS)", recordAlerts: "Graba tus avisos (opcional)",
      record: "Grabar", stop: "Detener", play: "Reproducir", clear: "Borrar",
      useRecording: "Usar grabación", none: "Sin grabación",
      theme: "Tema y paleta", light: "Claro", dark: "Oscuro", primary: "Primario", accent: "Acento",
      importExport: "Importar/Exportar", importCfg: "Importar configuración", exportCfg: "Exportar configuración", shareCfg: "Compartir configuración",
      help: "Ayuda", tip: "Consejo: Las grabaciones sustituyen al TTS cuando existan.", phaseTitles: "Títulos",
    },
    defaultCycle: [
      { id: "prep", title: "Preparación", minutes: DEFAULT_PREP_MIN, color: "#f59e0b" },
      { id: "active", title: "Activo", minutes: DEFAULT_ACTIVE_MIN, color: "#10b981" },
    ],
    defaultAlerts: {
      [EVENT_KEYS.START]: "Temporizador iniciado",
      [EVENT_KEYS.PAUSE]: "Temporizador en pausa",
      [EVENT_KEYS.RESET]: "Temporizador reiniciado",
      [EVENT_KEYS.ADD10]: "Añadidos diez minutos",
      [EVENT_KEYS.SKIP_NEXT_PREP]: "Salto al próximo ciclo",
      [EVENT_KEYS.PHASE_CHANGE]: "Cambio de fase",
      [EVENT_KEYS.TIMER_END]: "Intervalo completado",
    },
    helpText: `— Uso básico —
1) Configura las fases (nombre, minutos, color).
2) Inicia/Pausa. Añade +10' o salta al siguiente intervalo.
3) Activa TTS o graba tus avisos.
4) Exporta la configuración para reutilizarla.

— Consejos —
· Reordena fases según tus necesidades.
· Las grabaciones permanecen en el navegador hasta exportarlas.
· Personaliza tema (claro/oscuro) y colores primario/acento.`,
  },
  en: {
    name: "English",
    ui: {
      appTitle: "Session pacing",
      subtitle: "Cyclic timer with customizable alerts",
      currentPhase: "Current phase",
      start: "Start", pause: "Pause", reset: "Reset",
      add10: "+10 min to interval", skip: "Next interval (+5m prep)", switchPhase: "Switch phase",
      voiceAlerts: "Voice alerts", tts: "Text‑to‑speech", rec: "Custom recordings",
      settings: "Settings", language: "App language",
      phases: "Custom cycles (phases)", addPhase: "Add phase",
      remove: "Remove", moveUp: "Move up", moveDown: "Move down",
      name: "Name", minutes: "Minutes", color: "Color",
      alertsTexts: "Alert texts (for TTS)", recordAlerts: "Record your alerts (optional)",
      record: "Record", stop: "Stop", play: "Play", clear: "Clear",
      useRecording: "Use recording", none: "No recording",
      theme: "Theme & palette", light: "Light", dark: "Dark", primary: "Primary", accent: "Accent",
      importExport: "Import/Export", importCfg: "Import config", exportCfg: "Export config", shareCfg: "Share config",
      help: "Help", tip: "Tip: Recordings override TTS when available.", phaseTitles: "Titles",
    },
    defaultCycle: [
      { id: "prep", title: "Preparation", minutes: DEFAULT_PREP_MIN, color: "#f59e0b" },
      { id: "active", title: "Active", minutes: DEFAULT_ACTIVE_MIN, color: "#10b981" },
    ],
    defaultAlerts: {
      [EVENT_KEYS.START]: "Timer started",
      [EVENT_KEYS.PAUSE]: "Timer paused",
      [EVENT_KEYS.RESET]: "Timer reset",
      [EVENT_KEYS.ADD10]: "Ten minutes added",
      [EVENT_KEYS.SKIP_NEXT_PREP]: "Jump to next cycle",
      [EVENT_KEYS.PHASE_CHANGE]: "Phase changed",
      [EVENT_KEYS.TIMER_END]: "Interval completed",
    },
    helpText: `— Basics —
1) Configure phases (name, minutes, color).
2) Start/Pause the timer. Add +10' or jump to the next interval.
3) Enable TTS or record your own alerts.
4) Export your configuration to reuse elsewhere.

— Tips —
· Reorder phases to fit your flow.
· Recordings stay in the browser until exported.
· Customize theme (light/dark) and primary/accent colors.`,
  },
  fr: {
    name: "Français",
    ui: {
      appTitle: "Rythme de session",
      subtitle: "Minuteur cyclique avec alertes personnalisables",
      currentPhase: "Phase actuelle",
      start: "Démarrer", pause: "Pause", reset: "Réinitialiser",
      add10: "+10 min à l'intervalle", skip: "Prochain intervalle (+5m prep)", switchPhase: "Changer de phase",
      voiceAlerts: "Alertes vocales", tts: "Synthèse vocale", rec: "Enregistrements perso",
      settings: "Réglages", language: "Langue de l'application",
      phases: "Cycles personnalisés (phases)", addPhase: "Ajouter une phase",
      remove: "Supprimer", moveUp: "Monter", moveDown: "Descendre",
      name: "Nom", minutes: "Minutes", color: "Couleur",
      alertsTexts: "Textes d'alertes (pour TTS)", recordAlerts: "Enregistrez vos alertes (optionnel)",
      record: "Enregistrer", stop: "Arrêter", play: "Lire", clear: "Effacer",
      useRecording: "Utiliser l'enregistrement", none: "Pas d'enregistrement",
      theme: "Thème et palette", light: "Clair", dark: "Sombre", primary: "Primaire", accent: "Accent",
      importExport: "Importer/Exporter", importCfg: "Importer la config", exportCfg: "Exporter la config", shareCfg: "Partager la config",
      help: "Aide", tip: "Astuce : Les enregistrements remplacent le TTS s'ils existent.", phaseTitles: "Titres",
    },
    defaultCycle: [
      { id: "prep", title: "Préparation", minutes: DEFAULT_PREP_MIN, color: "#f59e0b" },
      { id: "active", title: "Actif", minutes: DEFAULT_ACTIVE_MIN, color: "#10b981" },
    ],
    defaultAlerts: {
      [EVENT_KEYS.START]: "Minuteur démarré",
      [EVENT_KEYS.PAUSE]: "Minuteur en pause",
      [EVENT_KEYS.RESET]: "Minuteur réinitialisé",
      [EVENT_KEYS.ADD10]: "Dix minutes ajoutées",
      [EVENT_KEYS.SKIP_NEXT_PREP]: "Passage au prochain cycle",
      [EVENT_KEYS.PHASE_CHANGE]: "Changement de phase",
      [EVENT_KEYS.TIMER_END]: "Intervalle terminé",
    },
    helpText: `— Utilisation —
1) Configurez les phases (nom, minutes, couleur).
2) Lancez/Mettez en pause. Ajoutez +10' ou passez à l'intervalle suivant.
3) Activez la synthèse vocale ou enregistrez vos alertes.
4) Exportez la configuration pour l'utiliser ailleurs.

— Conseils —
· Réordonnez les phases selon vos besoins.
· Les enregistrements restent dans le navigateur jusqu'à exportation.
· Personnalisez le thème (clair/sombre) et les couleurs primaire/Accent.`,
  },
};

function ttsSpeak(text: string, langCode: string) {
  try {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang?.toLowerCase().startsWith(langCode)) || voices[0];
    if (pref) utter.voice = pref as SpeechSynthesisVoice;
    utter.lang = (pref?.lang || langCode);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  } catch {}
}

function usePersistedState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : initial;
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}

type Phase = { id: string; title: string; minutes: number; color: string };

export default function App() {
  const [lang, setLang] = usePersistedState<string>("spt_lang", "ca");
  const L = (LANGS[lang] || LANGS.ca);

  const [theme, setTheme] = usePersistedState<string>("spt_theme", "light");
  const [primary, setPrimary] = usePersistedState<string>("spt_color_primary", "#0f172a");
  const [accent, setAccent] = usePersistedState<string>("spt_color_accent", "#10b981");
  useEffect(() => {
    const root = document.documentElement as HTMLElement & { dataset: any };
    root.style.setProperty("--c-primary", primary);
    root.style.setProperty("--c-accent", accent);
    (root.dataset as any).theme = theme;
  }, [theme, primary, accent]);

  const [phases, setPhases] = usePersistedState<Phase[]>("spt_phases", L.defaultCycle);
  useEffect(() => { if (!phases || phases.length===0) setPhases(L.defaultCycle); /* eslint-disable-next-line */ }, [lang]);

  const [idx, setIdx] = usePersistedState<number>("spt_phase_index", 0);
  const current = phases[idx] || phases[0];
  const [remainingSec, setRemainingSec] = usePersistedState<number>("spt_remaining", (current?.minutes || 1) * 60);
  const [running, setRunning] = usePersistedState<boolean>("spt_running", false);

  const [alertsText, setAlertsText] = usePersistedState<Record<string,string>>("spt_alerts_text", L.defaultAlerts);
  const [recordings, setRecordings] = usePersistedState<Record<string,string|undefined>>("spt_recordings", {});
  const [useRecording, setUseRecording] = usePersistedState<boolean>("spt_use_recording", true);

  useEffect(() => { setAlertsText(prev => ({...L.defaultAlerts, ...prev})); /* eslint-disable-next-line */ }, [lang]);

  const totalSec = useMemo(() => (current?.minutes || 1) * 60, [current]);
  const progress = useMemo(() => 1 - remainingSec / totalSec, [remainingSec, totalSec]);

  const tickRef = useRef<number | null>(null);
  useEffect(() => {
    if (!running) { if (tickRef.current) window.clearInterval(tickRef.current); tickRef.current = null; return; }
    tickRef.current = window.setInterval(() => {
      setRemainingSec(prev => {
        const next = prev - 1;
        if (next <= 0) {
          notify(EVENT_KEYS.TIMER_END);
          const nextIdx = (idx + 1) % phases.length;
          setIdx(nextIdx);
          return (phases[nextIdx]?.minutes || 1) * 60;
        }
        return next;
      });
    }, 1000);
    return () => { if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [running, idx, phases, setRemainingSec, setIdx]);

  function vibrate() { if (navigator.vibrate) navigator.vibrate(200); }
  function playRecordingIfAny(key: string) {
    const dataURL = recordings?.[key];
    if (!useRecording || !dataURL) return false;
    const audio = new Audio(dataURL);
    audio.play();
    return true;
  }
  function notify(key: string) {
    vibrate();
    if (!playRecordingIfAny(key)) {
      const text = alertsText?.[key];
      if (text) {
        const langCode = lang === "ca" ? "ca" : lang === "es" ? "es" : lang === "fr" ? "fr" : "en";
        ttsSpeak(text, langCode);
      }
    }
  }

  function handleStartStop() { setRunning(r => { const n = !r; notify(n?EVENT_KEYS.START:EVENT_KEYS.PAUSE); return n; }); }
  function handleReset() { setRunning(false); setRemainingSec((current?.minutes || 1) * 60); notify(EVENT_KEYS.RESET); }
  function handleAdd10() { setRemainingSec(rs => rs + 10*60); notify(EVENT_KEYS.ADD10); }
  function nextPhase() {
    const nextIdx = (idx + 1) % phases.length;
    setIdx(nextIdx);
    setRemainingSec((phases[nextIdx]?.minutes || 1) * 60);
    notify(EVENT_KEYS.PHASE_CHANGE);
  }
  function skipToNext() { setRunning(false); nextPhase(); notify(EVENT_KEYS.SKIP_NEXT_PREP); }

  function updatePhase(i: number, patch: Partial<Phase>) {
    const copy = [...phases]; copy[i] = { ...copy[i], ...patch }; setPhases(copy);
  }
  function addPhase() {
    const id = (window.crypto?.randomUUID?.() || Math.random().toString(36).slice(2));
    setPhases([...phases, { id, title: L.ui.name, minutes: 10, color: "#64748b" }]);
  }
  function removePhase(i: number) {
    if (phases.length <= 1) return;
    const copy = phases.filter((_, k) => k !== i); setPhases(copy); if (idx >= copy.length) setIdx(0);
  }
  function movePhase(i: number, dir: number) {
    const j = i + dir; if (j<0 || j>=phases.length) return;
    const copy = [...phases]; const tmp = copy[i]; copy[i]=copy[j]; copy[j]=tmp; setPhases(copy);
    if (idx===i) setIdx(j); else if (idx===j) setIdx(i);
  }

  function exportConfig() {
    const payload = { version: 2, lang, theme, primary, accent, phases, idx, alertsText, recordings, useRecording };
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "session-pacing-config.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function importConfigFromFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result) || "{}");
        if (data.lang) setLang(data.lang);
        if (data.theme) setTheme(data.theme);
        if (data.primary) setPrimary(data.primary);
        if (data.accent) setAccent(data.accent);
        if (Array.isArray(data.phases)) setPhases(data.phases);
        if (typeof data.idx === "number") setIdx(Math.max(0, Math.min(data.phases?.length-1 || 0, data.idx)));
        if (data.alertsText) setAlertsText(data.alertsText);
        if (data.recordings) setRecordings(data.recordings);
        if (typeof data.useRecording === "boolean") setUseRecording(data.useRecording);
        alert("Configuració importada correctament");
      } catch { alert("Fitxer invàlid"); }
    };
    reader.readAsText(file);
  }
  async function shareConfig() {
    try {
      const payload = { version: 2, lang, theme, primary, accent, phases, idx, alertsText, recordings, useRecording };
      const text = JSON.stringify(payload);
      if (navigator.share) await navigator.share({ title: "Session Pacing Config", text });
      else { await navigator.clipboard.writeText(text); alert("Copiat al porta-retalls"); }
    } catch { alert("No s'ha pogut compartir"); }
  }

  const ringColor = current?.color || "#0ea5e9";

  return (
    <div className="min-h-screen w-full" style={{background:"var(--bg)", color:"var(--fg)", padding:"1.5rem"}}>
      <div className="w-full" style={{maxWidth: "1100px", margin:"0 auto"}}>
        <header style={{textAlign:"center"}}>
          <h1 style={{fontSize:"1.875rem", fontWeight:700, color:"var(--c-primary)"}}>{L.ui.appTitle}</h1>
          <p style={{opacity:.8}}>{L.ui.subtitle}</p>
        </header>

        <div className="rounded-2xl border shadow-sm" style={{background:"var(--card)", borderColor:"var(--muted)", padding:"1.5rem", marginTop:"1.5rem"}}>
          <div style={{display:"flex", gap:"1.5rem", alignItems:"center", flexWrap:"wrap"}}>
            <ProgressCircle progress={progress} label={formatTime(remainingSec)} ring={ringColor} />

            <div style={{flex:1}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:".5rem"}}>
                <span style={{fontSize:".875rem", textTransform:"uppercase", opacity:.8}}>{L.ui.currentPhase}</span>
                <span style={{fontSize:".75rem", opacity:.7}}>{new Date().toLocaleTimeString()}</span>
              </div>
              <h2 style={{fontSize:"1.5rem", fontWeight:600, marginBottom:"1rem", color:"var(--c-accent)"}}>{current?.title || "-"}</h2>

              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:".75rem"}}>
                <button onClick={handleStartStop} className="rounded-xl" style={{padding:"0.75rem 1rem", background:"var(--c-primary)", color:"#fff"}}>{running ? L.ui.pause : L.ui.start}</button>
                <button onClick={handleReset} className="rounded-xl border" style={{padding:"0.75rem 1rem", background:"var(--card)", borderColor:"var(--muted)"}}>{L.ui.reset}</button>
                <button onClick={handleAdd10} className="rounded-xl border" style={{padding:"0.75rem 1rem", background:"var(--card)", borderColor:"var(--muted)"}}>{L.ui.add10}</button>
                <button onClick={skipToNext} className="rounded-xl border" style={{padding:"0.75rem 1rem", background:"var(--card)", borderColor:"var(--muted)"}}>{L.ui.skip}</button>
                <button onClick={nextPhase} className="rounded-xl border" style={{padding:"0.75rem 1rem", background:"var(--card)", borderColor:"var(--muted)"}}>{L.ui.switchPhase}</button>
                <label className="rounded-xl border" style={{padding:"0.75rem 1rem", display:"flex", gap:".5rem", alignItems:"center", background:"var(--card)", borderColor:"var(--muted)"}}>
                  <input type="checkbox" checked={useRecording} onChange={(e)=>setUseRecording(e.target.checked)} />
                  <span>{L.ui.voiceAlerts}: {useRecording ? L.ui.rec : L.ui.tts}</span>
                </label>
              </div>

              <p style={{marginTop:"1rem", fontSize:".75rem", opacity:.7}}>{L.ui.tip}</p>
            </div>
          </div>
        </div>

        <section className="rounded-2xl border shadow-sm" style={{background:"var(--card)", borderColor:"var(--muted)", padding:"1.5rem", marginTop:"1.5rem"}}>
          <h3 style={{fontSize:"1.25rem", fontWeight:600, color:"var(--c-primary)", marginBottom:"1rem"}}>{L.ui.settings}</h3>

          <div style={{display:"grid", gap:"1.5rem", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", marginBottom:"2rem"}}>
            <div>
              <label style={{display:"block", fontSize:".875rem", opacity:.8, marginBottom:".5rem"}}>{L.ui.language}</label>
              <div style={{display:"flex", gap:".5rem", flexWrap:"wrap"}}>
                {Object.entries(LANGS).map(([code, cfg]) => (
                  <button key={code} onClick={()=>setLang(code)} className="rounded-xl border"
                    style={{padding:".5rem .75rem", background:lang===code?"var(--c-primary)":"var(--card)",
                            color: lang===code?"#fff":"inherit", borderColor:"var(--muted)"}}>{cfg.name}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{display:"block", fontSize:".875rem", opacity:.8, marginBottom:".5rem"}}>{L.ui.theme}</label>
              <div style={{display:"flex", gap:".5rem", flexWrap:"wrap", marginBottom:".5rem"}}>
                <button onClick={()=>setTheme("light")} className="rounded-xl border"
                  style={{padding:".5rem .75rem", background:theme==="light"?"var(--c-primary)":"var(--card)",
                          color: theme==="light"?"#fff":"inherit", borderColor:"var(--muted)"}}>{L.ui.light}</button>
                <button onClick={()=>setTheme("dark")} className="rounded-xl border"
                  style={{padding:".5rem .75rem", background:theme==="dark"?"var(--c-primary)":"var(--card)",
                          color: theme==="dark"?"#fff":"inherit", borderColor:"var(--muted)"}}>{L.ui.dark}</button>
              </div>
              <div style={{display:"grid", gap:"1rem", gridTemplateColumns:"repeat(2,1fr)"}}>
                <ColorField label={L.ui.primary} value={primary} onChange={setPrimary} />
                <ColorField label={L.ui.accent} value={accent} onChange={setAccent} />
              </div>
            </div>
          </div>

          <div style={{marginBottom:"2rem"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:".5rem"}}>
              <span style={{fontSize:".875rem", opacity:.8}}>{L.ui.phases}</span>
              <button onClick={addPhase} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.ui.addPhase}</button>
            </div>
            <div style={{display:"grid", gap:".75rem"}}>
              {phases.map((p, i) => (
                <div key={p.id} className="rounded-xl border" style={{borderColor:"var(--muted)", background:"var(--card)", padding:".75rem", display:"grid", gap:".5rem", gridTemplateColumns:"1fr 120px 140px auto"}}>
                  <TextField label={L.ui.name} value={p.title} onChange={(v)=>updatePhase(i,{title:v})} />
                  <NumberField label={L.ui.minutes} value={p.minutes} setValue={(v)=>updatePhase(i,{minutes:v})} min={0} max={600} />
                  <ColorField label={L.ui.color} value={p.color} onChange={(v)=>updatePhase(i,{color:v})} />
                  <div style={{display:"flex", gap:".5rem", justifyContent:"flex-end", alignItems:"center"}}>
                    <button onClick={()=>movePhase(i,-1)} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.ui.moveUp}</button>
                    <button onClick={()=>movePhase(i,1)} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.ui.moveDown}</button>
                    <button onClick={()=>removePhase(i)} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.ui.remove}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginBottom:"2rem"}}>
            <div style={{fontSize:".875rem", opacity:.8, marginBottom:".5rem"}}>{L.ui.alertsTexts}</div>
            <div style={{display:"grid", gap:".75rem", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
              {Object.values(EVENT_KEYS).map((key) => (
                <TextField key={key} label={`${key}`} value={alertsText[key] || ""} onChange={(v)=>setAlertsText({...alertsText, [key]: v})} />
              ))}
            </div>
          </div>

          <div style={{marginBottom:"1.5rem"}}>
            <div style={{fontSize:".875rem", opacity:.8, marginBottom:".5rem"}}>{L.ui.recordAlerts}</div>
            <div style={{display:"grid", gap:".75rem", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
              {Object.values(EVENT_KEYS).map((key) => (
                <RecorderRow key={key} label={`${key}`} dataURL={recordings[key]} onChange={(data)=>setRecordings({...recordings, [key]: data})} L={L.ui} />
              ))}
            </div>
          </div>

          <div style={{display:"grid", gap:".75rem", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
            <label className="rounded-xl border" style={{padding:".5rem .75rem", display:"flex", justifyContent:"center", cursor:"pointer", borderColor:"var(--muted)"}}>
              <input type="file" accept="application/json" onChange={(e)=> e.target.files?.[0] && importConfigFromFile(e.target.files[0])} style={{display:"none"}} />
              {L.ui.importCfg}
            </label>
            <button onClick={exportConfig} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.ui.exportCfg}</button>
            <button onClick={shareConfig} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.ui.shareCfg}</button>
          </div>
        </section>

        <section className="rounded-2xl border shadow-sm" style={{background:"var(--card)", borderColor:"var(--muted)", padding:"1.5rem", marginTop:"1.5rem"}}>
          <h3 style={{fontSize:"1.25rem", fontWeight:600, color:"var(--c-primary)", marginBottom:".5rem"}}>{L.ui.help}</h3>
          <pre style={{whiteSpace:"pre-wrap", opacity:.9, fontSize:".9rem"}}>{L.helpText}</pre>
        </section>

        <footer style={{fontSize:".75rem", opacity:.7, marginTop:"1rem"}}>
          <p>Ús responsable: Eina genèrica no mèdica. Gravacions i configuracions locals fins que les exportes o compartixes.</p>
        </footer>
      </div>
    </div>
  );
}

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function NumberField({ label, value, setValue, min=0, max=999, step=1 }:{label:string, value:number, setValue:(n:number)=>void, min?:number, max?:number, step?:number}) {
  return (
    <label style={{display:"block"}}>
      <span style={{fontSize:".875rem", opacity:.8}}>{label}</span>
      <div style={{marginTop:".25rem", display:"flex", gap:".5rem", alignItems:"center"}}>
        <input type="number" style={{width:"7rem", padding:".5rem .75rem"}} className="rounded-xl border"
               value={value} min={min} max={max} step={step}
               onChange={(e)=> setValue(Math.max(min, Math.min(max, Number(e.target.value) || 0)))} />
        <div style={{display:"flex", gap:".5rem"}}>
          <button type="button" className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}} onClick={()=> setValue(Math.max(min, value - step))}>−</button>
          <button type="button" className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}} onClick={()=> setValue(Math.min(max, value + step))}>+</button>
        </div>
      </div>
    </label>
  );
}

function TextField({ label, value, onChange }:{label:string, value:string, onChange:(v:string)=>void}) {
  return (
    <label style={{display:"block"}}>
      <span style={{fontSize:".875rem", opacity:.8}}>{label}</span>
      <input className="rounded-xl border" style={{marginTop:".25rem", width:"100%", padding:".5rem .75rem", background:"var(--card)", borderColor:"var(--muted)"}}
             value={value} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}

function ColorField({ label, value, onChange }:{label:string, value:string, onChange:(v:string)=>void}) {
  return (
    <label style={{display:"block"}}>
      <span style={{fontSize:".875rem", opacity:.8}}>{label}</span>
      <input type="color" className="rounded-xl border" style={{marginTop:".25rem", width:"100%", height:"2.5rem", padding:".25rem", background:"var(--card)", borderColor:"var(--muted)"}}
             value={value} onChange={(e)=>onChange(e.target.value)} />
    </label>
  );
}

function ProgressCircle({ progress, label, ring }:{progress:number, label:string, ring:string}) {
  const size = 160;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, progress)) * c;
  const empty = c - dash;
  return (
    <div className="rounded-full" style={{position:"relative", padding:"0.5rem", boxShadow:`0 0 0 4px ${ring}44`}}>
      <svg width={size} height={size} style={{display:"block", transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} stroke="#e5e7eb" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} strokeDasharray={`${dash} ${empty}`} strokeLinecap="round" stroke="var(--c-primary)" fill="none" />
      </svg>
      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
        <span style={{fontSize:"1.75rem", fontWeight:600, fontVariantNumeric:"tabular-nums"}}>{label}</span>
      </div>
    </div>
  );
}

function RecorderRow({ label, dataURL, onChange, L }:{label:string, dataURL?:string, onChange:(d?:string)=>void, L:UIStrings}) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => onChange(String(reader.result));
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t=>t.stop());
      };
      rec.start();
      setRecording(true);
    } catch (e) {
      alert("Permís/Accés al micròfon denegat o no disponible");
    }
  }
  function stop() {
    const rec = mediaRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    setRecording(false);
  }
  function play() { if (dataURL) new Audio(dataURL).play(); }
  function clear() { onChange(undefined); }

  return (
    <div className="rounded-xl border" style={{padding:".75rem", background:"var(--card)", borderColor:"var(--muted)"}}>
      <div style={{fontSize:".75rem", opacity:.7, marginBottom:".25rem"}}>{label}</div>
      <div style={{display:"flex", gap:".5rem", flexWrap:"wrap", alignItems:"center"}}>
        {!recording ? (
          <button onClick={start} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.record}</button>
        ) : (
          <button onClick={stop} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)"}}>{L.stop}</button>
        )}
        <button onClick={play} disabled={!dataURL} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)", opacity: dataURL?1:.5}}>{L.play}</button>
        <button onClick={clear} disabled={!dataURL} className="rounded-xl border" style={{padding:".5rem .75rem", borderColor:"var(--muted)", opacity: dataURL?1:.5}}>{L.clear}</button>
        <span style={{fontSize:".75rem", opacity:.7, marginLeft:"auto"}}>{dataURL ? L.useRecording : L.none}</span>
      </div>
    </div>
  );
}
