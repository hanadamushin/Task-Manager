import React, { useState, useEffect, useRef, useMemo, createContext, useContext } from "react";
import {
  Bell, Plus, Play, Square, Check, X, Clock, AlertTriangle, Search, Sun, Moon,
  LogOut, User, Users, Home, Briefcase, Calendar, ChevronRight, ChevronDown,
  Download, Edit2, Trash2, Send, Sparkles, RefreshCw, Link2, MessageSquare,
  ArrowLeft, ClipboardList, Timer, History, Settings, Mail, Shield, Copy,
  CheckCircle2, XCircle, Info, Eye, EyeOff, Inbox
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from "recharts";

/* ============================================================
   FN.Task — チーム稼働・タスク管理
   単一ファイルReactアプリ / window.storage永続化 / Claude API連携
   ============================================================ */

const CSS = `
/* fonts loaded via <link> in index.html */
.kd *{ -webkit-tap-highlight-color:transparent; }
.kd{ --bg:#F6F5F1; --panel:#FFFFFF; --panel2:#F0EEE7; --text:#1C1E26; --muted:#6A6F7A;
  --border:#E5E2D9; --ai:#2F5AA8; --ai-soft:#E7EDF8; --amber:#B7791F; --amber-bg:#FBF3E2;
  --red:#C43D3D; --red-bg:#FBEAEA; --green:#2F855A; --green-bg:#E6F4EC;
  min-height:100vh; background:var(--bg); color:var(--text);
  font-family:'Noto Sans JP', system-ui, sans-serif; font-size:14px; line-height:1.6; }
.kd.dark{ --bg:#12141A; --panel:#1A1D25; --panel2:#22262F; --text:#E9EAEE; --muted:#979DA9;
  --border:#2A2E39; --ai:#7FA4E8; --ai-soft:#1F2B44; --amber:#F0B429; --amber-bg:#332A14;
  --red:#E8706A; --red-bg:#3A2020; --green:#57B98A; --green-bg:#16301F; }
.kd *{ box-sizing:border-box; }
.kd ::selection{ background:var(--ai-soft); }
.wordmark{ font-family:'Shippori Mincho', serif; font-weight:600; letter-spacing:.14em; }
.num{ font-variant-numeric: tabular-nums; }
.panel{ background:var(--panel); border:1px solid var(--border); border-radius:14px; }
.ledger{ border-bottom:3px double var(--border); }
.btn{ display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:10px;
  border:1px solid var(--border); background:var(--panel); color:var(--text); font-size:13px;
  font-weight:500; cursor:pointer; transition:filter .12s, background .12s; white-space:nowrap;
  touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.btn:hover{ background:var(--panel2); }
.btn:disabled{ opacity:.45; cursor:not-allowed; }
.btn-p{ background:var(--ai); border-color:var(--ai); color:#fff; }
.kd.dark .btn-p{ color:#0E1320; }
.btn-p:hover{ filter:brightness(1.08); background:var(--ai); }
.btn-d{ background:transparent; border-color:var(--red); color:var(--red); }
.btn-d:hover{ background:var(--red-bg); }
.btn-sm{ padding:4px 10px; font-size:12px; border-radius:8px; }
.iconbtn{ display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px;
  border-radius:10px; border:1px solid transparent; background:transparent; color:var(--muted);
  cursor:pointer; position:relative; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.iconbtn:hover{ background:var(--panel2); color:var(--text); }
.input,.select,.textarea{ width:100%; padding:8px 12px; border-radius:10px; border:1px solid var(--border);
  background:var(--panel); color:var(--text); font-size:14px; font-family:inherit; outline:none; }
.input:focus,.select:focus,.textarea:focus{ border-color:var(--ai); box-shadow:0 0 0 3px var(--ai-soft); }
.textarea{ resize:vertical; min-height:80px; }
.lbl{ display:block; font-size:12px; font-weight:700; color:var(--muted); margin-bottom:4px; }
.err{ color:var(--red); font-size:12px; margin-top:3px; }
.badge{ display:inline-flex; align-items:center; gap:5px; padding:2px 9px; border-radius:999px;
  font-size:11px; font-weight:700; line-height:1.7; white-space:nowrap; }
.badge i{ width:6px; height:6px; border-radius:99px; background:currentColor; display:inline-block; }
.b-slate{ background:var(--panel2); color:var(--muted); }
.b-blue{ background:var(--ai-soft); color:var(--ai); }
.b-amber{ background:var(--amber-bg); color:var(--amber); }
.b-red{ background:var(--red-bg); color:var(--red); }
.b-green{ background:var(--green-bg); color:var(--green); }
.prog{ height:7px; border-radius:99px; background:var(--panel2); overflow:hidden; }
.prog>i{ display:block; height:100%; border-radius:99px; background:var(--ai); transition:width .3s; }
.prog>i.warn{ background:var(--amber); } .prog>i.over{ background:var(--red); } .prog>i.ok{ background:var(--green); }
.tbl{ width:100%; border-collapse:collapse; font-size:13px; }
.tbl th{ text-align:left; padding:8px 10px; color:var(--muted); font-size:11px; font-weight:700;
  border-bottom:3px double var(--border); white-space:nowrap; user-select:none; }
.tbl th.sort{ cursor:pointer; } .tbl th.sort:hover{ color:var(--text); }
.tbl td{ padding:9px 10px; border-bottom:1px solid var(--border); vertical-align:middle; }
.tbl tr.click{ cursor:pointer; } .tbl tr.click:hover td{ background:var(--panel2); }
.tbl tr.warn90 td{ background:var(--amber-bg); }
.chip{ display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:999px;
  border:1px solid var(--border); background:var(--panel); color:var(--muted); font-size:12px;
  font-weight:500; cursor:pointer; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.chip.on{ background:var(--ai); border-color:var(--ai); color:#fff; }
.kd.dark .chip.on{ color:#0E1320; }
.navi{ display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px;
  color:var(--muted); font-size:13.5px; font-weight:500; cursor:pointer; touch-action:manipulation; -webkit-tap-highlight-color:transparent; }
.navi:hover{ background:var(--panel2); color:var(--text); }
.navi.on{ background:var(--ai-soft); color:var(--ai); font-weight:700; }
.modal-bg{ position:fixed; inset:0; background:rgba(10,12,18,.5); display:flex; align-items:flex-end;
  justify-content:center; z-index:50; padding:0; }
@media(min-width:768px){ .modal-bg{ align-items:center; padding:24px; } }
.modal{ background:var(--panel); border:1px solid var(--border); width:100%; max-width:560px;
  max-height:92vh; overflow-y:auto; border-radius:18px 18px 0 0; padding:20px; }
@media(min-width:768px){ .modal{ border-radius:16px; } }
.modal.wide{ max-width:860px; }
.stat{ font-size:22px; font-weight:700; }
.toastbox{ position:fixed; bottom:84px; left:50%; transform:translateX(-50%); z-index:80;
  background:var(--text); color:var(--bg); padding:10px 18px; border-radius:12px; font-size:13px;
  font-weight:500; box-shadow:0 8px 24px rgba(0,0,0,.25); max-width:90vw; }
@media(min-width:768px){ .toastbox{ bottom:28px; } }
.pulse{ width:8px; height:8px; border-radius:99px; background:var(--red); animation:kdpulse 1.2s infinite; }
@keyframes kdpulse{ 0%,100%{opacity:1} 50%{opacity:.3} }
@media (prefers-reduced-motion: reduce){ .pulse{ animation:none; } .prog>i{ transition:none; } }
.hcell{ width:100%; aspect-ratio:1.6; border-radius:6px; background:var(--panel2); }
.avatar{ display:inline-flex; align-items:center; justify-content:center; border-radius:99px;
  color:#fff; font-weight:700; flex-shrink:0; }
.searchdrop{ position:absolute; top:44px; left:0; right:0; z-index:40; max-height:320px; overflow-y:auto; }
.notifitem{ display:flex; gap:10px; padding:12px; border-bottom:1px solid var(--border); }
.notifitem.unread{ background:var(--ai-soft); }
.mono{ font-variant-numeric:tabular-nums; letter-spacing:.02em; }
.bignum{ font-size:40px; font-weight:700; font-variant-numeric:tabular-nums; letter-spacing:.01em; }
.kd a{ color:var(--ai); }
.kd::-webkit-scrollbar, .kd *::-webkit-scrollbar{ width:8px; height:8px; }
.kd *::-webkit-scrollbar-thumb{ background:var(--border); border-radius:99px; }
.dot{ position:absolute; top:6px; right:6px; min-width:16px; height:16px; padding:0 4px; border-radius:99px;
  background:var(--red); color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center;
  justify-content:center; }
`;

/* ---------- ユーティリティ ---------- */
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
const genPw = () => Math.random().toString(36).slice(2, 6) + Math.random().toString(36).slice(2, 6);
const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const fmtYen = (n) => "¥" + Math.round(Number(n) || 0).toLocaleString("ja-JP");
const fmtHM = (min) => { const m = Math.round(min || 0); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; };
const fmtHMS = (sec) => { sec = Math.max(0, Math.floor(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`; };
const fmtDate = (s) => { if (!s) return "—"; const d = new Date(s); return `${d.getMonth() + 1}/${d.getDate()}`; };
const fmtDT = (ts) => { const d = new Date(ts); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const daysUntil = (dateStr) => { if (!dateStr) return 9999; const end = new Date(dateStr + "T23:59:59"); return Math.floor((end - new Date()) / 864e5); };
const weekRange = () => { const d = new Date(); const day = (d.getDay() + 6) % 7; const s = new Date(d); s.setHours(0, 0, 0, 0); s.setDate(d.getDate() - day); const e = new Date(s); e.setDate(s.getDate() + 7); return [s.getTime(), e.getTime()]; };
const monthRange = () => { const d = new Date(); const s = new Date(d.getFullYear(), d.getMonth(), 1); const e = new Date(d.getFullYear(), d.getMonth() + 1, 1); return [s.getTime(), e.getTime()]; };
const clamp01 = (x) => Math.max(0, Math.min(1, x || 0));
const AV_COLORS = ["#2F5AA8", "#8C5AA8", "#B7791F", "#2F855A", "#C43D3D", "#3A7CA5", "#7A6A4F", "#5A67A8"];

async function sha(pw, salt) {
  const data = new TextEncoder().encode(salt + "::" + pw);
  const h = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(h)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ---------- 永続化 (window.storage) ----------
   共有スコープ: users/projects/tasks/worklogs/requests/notifications/comments
   個人スコープ: session / theme / timer                                    */
const S = {
  async get(key, shared = true) {
    try { const r = await window.storage.get(key, shared); return r && r.value != null ? JSON.parse(r.value) : null; }
    catch (e) { return null; }
  },
  async set(key, val, shared = true) {
    try { await window.storage.set(key, JSON.stringify(val), shared); return true; }
    catch (e) { console.error("storage set failed", key, e); return false; }
  },
  async del(key, shared = true) { try { await window.storage.delete(key, shared); } catch (e) {} },
};
const COLS = ["users", "projects", "tasks", "worklogs", "requests", "notifications", "comments"];

/* ---------- 定数 ---------- */
const ST = { todo: "未着手", in_progress: "進行中", done: "完了" };
const ST_BADGE = { todo: "b-slate", in_progress: "b-blue", done: "b-green" };
const PR = { high: "高", medium: "中", low: "低" };
const PR_BADGE = { high: "b-red", medium: "b-amber", low: "b-slate" };
const PJST = { active: "進行中", paused: "一時停止", completed: "完了" };
const PJ_BADGE = { active: "b-blue", paused: "b-amber", completed: "b-green" };
const NT_META = {
  assign: { icon: ClipboardList, label: "割当" }, request: { icon: Inbox, label: "申請" },
  approve: { icon: CheckCircle2, label: "承認" }, reject: { icon: XCircle, label: "却下" },
  limit90: { icon: AlertTriangle, label: "90%超過" }, over: { icon: AlertTriangle, label: "上限超過" },
  deadline: { icon: Calendar, label: "期日" }, done: { icon: CheckCircle2, label: "完了報告" },
  mention: { icon: MessageSquare, label: "コメント" }, extend: { icon: Calendar, label: "期日延長" },
  system: { icon: Info, label: "お知らせ" },
};

/* ---------- 集計ヘルパー ---------- */
const workedMin = (logs, taskId) => logs.filter((l) => l.task_id === taskId).reduce((a, l) => a + (l.duration_min || 0), 0);
// タスク消化率: 完了=100% / それ以外は稼働時間÷上限(上限なしは0)
const taskRatio = (t, worked) => t.status === "done" ? 1 : (t.max_minutes > 0 ? clamp01(worked / t.max_minutes) : 0);
function projectStats(p, tasks, logs) {
  const pts = tasks.filter((t) => t.project_id === p.id);
  const done = pts.filter((t) => t.status === "done").length;
  const alloc = pts.reduce((a, t) => a + (t.budget || 0), 0);
  const consumed = pts.reduce((a, t) => a + (t.budget || 0) * taskRatio(t, workedMin(logs, t.id)), 0);
  return {
    total: pts.length, done, progress: pts.length ? done / pts.length : 0,
    alloc, consumed, remain: (p.budget || 0) - alloc,
    consumedRate: p.budget > 0 ? consumed / p.budget : 0,
  };
}

/* ---------- Claude API ---------- */
async function callClaude(messages, extra = {}) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages, ...extra }),
  });
  if (!res.ok) throw new Error("APIエラー (" + res.status + ")");
  return await res.json();
}
const textOf = (data) => (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
const toolResultsOf = (data) => (data.content || []).filter((b) => b.type === "mcp_tool_result")
  .map((b) => (b.content && b.content[0] && b.content[0].text) || "").join("\n");
function parseJsonArray(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const m = clean.match(/\[[\s\S]*\]/);
  return JSON.parse(m ? m[0] : clean);
}
function parseJsonObject(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const m = clean.match(/\{[\s\S]*\}/);
  return JSON.parse(m ? m[0] : clean);
}

/* ---------- CSV ---------- */
const csvEsc = (v) => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
const toCSV = (rows) => rows.map((r) => r.map(csvEsc).join(",")).join("\r\n");
function tryDownload(filename, text) {
  try {
    const blob = new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch (e) { return false; }
}

/* ---------- 汎用UI部品 ---------- */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

function Avatar({ user, size = 28 }) {
  if (!user) return <span className="avatar" style={{ width: size, height: size, background: "var(--border)", fontSize: size * 0.4 }}>—</span>;
  return (
    <span className="avatar" title={user.name} style={{ width: size, height: size, background: user.avatarColor || AV_COLORS[0], fontSize: size * 0.42 }}>
      {user.name.slice(0, 1)}
    </span>
  );
}
function Badge({ cls, children, dot }) {
  return <span className={"badge " + cls}>{dot && <i />}{children}</span>;
}
function Prog({ ratio, tone }) {
  const r = clamp01(ratio);
  const cls = tone || (r >= 1 ? "over" : r >= 0.9 ? "warn" : "");
  return <div className="prog"><i className={cls} style={{ width: (r * 100).toFixed(1) + "%" }} /></div>;
}
function Modal({ open, onClose, title, children, wide, noClose }) {
  if (!open) return null;
  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget && !noClose) onClose(); }}>
      <div className={"modal" + (wide ? " wide" : "")}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold m-0">{title}</h3>
          {!noClose && <button className="iconbtn" onClick={onClose} aria-label="閉じる"><X size={18} /></button>}
        </div>
        {children}
      </div>
    </div>
  );
}
function Field({ label, error, children, hint }) {
  return (
    <div className="mb-3">
      <label className="lbl">{label}</label>
      {children}
      {hint && !error && <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{hint}</div>}
      {error && <div className="err">{error}</div>}
    </div>
  );
}
function Empty({ icon: I = Inbox, text }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10" style={{ color: "var(--muted)" }}>
      <I size={28} strokeWidth={1.5} /><div className="text-sm">{text}</div>
    </div>
  );
}
function Seg({ options, value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((o) => (
        <button key={o.value} className={"chip" + (value === o.value ? " on" : "")} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

/* ============================================================
   ルート App
   ============================================================ */
export default function App() {
  const [db, setDb] = useState({ users: [], projects: [], tasks: [], worklogs: [], requests: [], notifications: [], comments: [] });
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState(null); // {userId, exp}
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState({ page: "dash" });
  const [timer, setTimer] = useState(null); // {taskId, startedAt}
  const [now, setNow] = useState(Date.now());
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmReq, setConfirmReq] = useState(null); // {msg, resolve}
  const [timerDone, setTimerDone] = useState(null); // {task, seconds}
  const [openTaskId, setOpenTaskId] = useState(null); // Member用タスク詳細
  const toastT = useRef(null);

  const user = useMemo(() => session ? db.users.find((u) => u.id === session.userId) || null : null, [session, db.users]);

  /* --- 初期ロード --- */
  useEffect(() => {
    (async () => {
      const vals = await Promise.all(COLS.map((c) => S.get("tm:" + c)));
      const next = {};
      COLS.forEach((c, i) => { next[c] = vals[i] || []; });
      setDb(next);
      const th = await S.get("tm:theme", false); if (th === "dark" || th === "light") setTheme(th);
      const ses = await S.get("tm:session", false);
      if (ses && ses.exp > Date.now()) setSession(ses); else if (ses) S.del("tm:session", false);
      const tm = await S.get("tm:timer", false); if (tm && tm.taskId) setTimer(tm);
      setLoaded(true);
    })();
  }, []);

  /* --- タイマー刻み --- */
  useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [timer]);

  /* --- フォーカス時に共有データを再取得 --- */
  useEffect(() => {
    const onFocus = () => { if (loaded) refresh(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loaded]);

  /* --- セッション復元時のリマインダー走査 --- */
  const scanned = useRef(false);
  useEffect(() => {
    if (loaded && user && !scanned.current) { scanned.current = true; runDeadlineScan(user); }
  }, [loaded, user]);

  async function refresh() {
    const vals = await Promise.all(COLS.map((c) => S.get("tm:" + c)));
    setDb((d) => { const next = { ...d }; COLS.forEach((c, i) => { next[c] = vals[i] || []; }); return next; });
  }

  /* --- 変更系: 保存直前に最新を読み直して衝突を軽減 --- */
  async function mutate(col, fn) {
    const cur = (await S.get("tm:" + col)) || [];
    const next = fn(cur);
    await S.set("tm:" + col, next);
    setDb((d) => ({ ...d, [col]: next }));
    return next;
  }
  async function notifyUsers(userIds, type, message, opts = {}) {
    const ids = [...new Set(userIds)].filter(Boolean);
    if (!ids.length) return;
    await mutate("notifications", (list) => {
      const add = [];
      for (const uidTo of ids) {
        if (opts.k && list.some((n) => n.user_id === uidTo && n.k === opts.k)) continue;
        add.push({ id: uid(), user_id: uidTo, type, message, read: false, created_at: Date.now(), email: !!opts.email, k: opts.k || null });
      }
      return [...add, ...list].slice(0, 400);
    });
  }
  const pmIds = () => db.users.filter((u) => u.role === "PM" && !u.pending).map((u) => u.id);

  function toast(msg) {
    setToastMsg(msg);
    if (toastT.current) clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToastMsg(null), 2800);
  }
  function ask(msg) { return new Promise((resolve) => setConfirmReq({ msg, resolve })); }
  function nav(page, params = {}) { setView({ page, ...params }); }

  /* --- 認証 --- */
  async function doLogin(email, pw) {
    const list = (await S.get("tm:users")) || [];
    const u = list.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!u) return "メールアドレスが見つかりません";
    const h = await sha(pw, u.salt);
    if (h !== u.passHash) return "パスワードが正しくありません";
    if (u.pending) return "PM権限の申請が承認待ちです。既存のPMによる承認をお待ちください。";
    const ses = { userId: u.id, exp: Date.now() + 7 * 864e5 };
    await S.set("tm:session", ses, false);
    setDb((d) => ({ ...d, users: list }));
    setSession(ses);
    nav(u.role === "PM" ? "dash" : "mydash");
    runDeadlineScan(u);
    return null;
  }
  async function doLogout() {
    await S.del("tm:session", false);
    setSession(null); setView({ page: "dash" });
  }
  async function setTheme2(t) { setTheme(t); await S.set("tm:theme", t, false); }

  /* --- 期日3日前リマインダー --- */
  async function runDeadlineScan(u) {
    const tasks = (await S.get("tm:tasks")) || [];
    const targets = tasks.filter((t) => t.status !== "done" && t.assigned_user_id && t.deadline && daysUntil(t.deadline) >= 0 && daysUntil(t.deadline) <= 3);
    for (const t of targets) {
      await notifyUsers([t.assigned_user_id], "deadline", `「${t.title}」の期日が${daysUntil(t.deadline) === 0 ? "今日" : daysUntil(t.deadline) + "日後"}です (${t.deadline})`, { k: "dl:" + t.id + ":" + t.deadline });
    }
  }

  /* --- タイマー --- */
  async function startTimer(task) {
    if (timer) { toast("先に計測中のタスクを停止してください"); return; }
    const tm = { taskId: task.id, startedAt: Date.now() };
    setTimer(tm); await S.set("tm:timer", tm, false);
    if (task.status === "todo") {
      await mutate("tasks", (list) => list.map((t) => t.id === task.id ? { ...t, status: "in_progress" } : t));
    }
    toast("計測を開始しました");
  }
  async function stopTimer() {
    if (!timer) return;
    const task = db.tasks.find((t) => t.id === timer.taskId);
    const seconds = Math.max(1, Math.floor((Date.now() - timer.startedAt) / 1000));
    setTimerDone({ task, seconds, startedAt: timer.startedAt });
    setTimer(null); await S.del("tm:timer", false);
  }

  /* --- 稼働ログ確定 (短縮のみ許可はここでも強制) --- */
  async function commitWorkLog(task, startedAt, measuredSec, editedMin, note) {
    const measuredMin = measuredSec / 60;
    const dur = Math.min(editedMin, measuredMin); // サーバーサイド相当の強制
    const before = workedMin(db.worklogs, task.id);
    await mutate("worklogs", (list) => [{
      id: uid(), task_id: task.id, user_id: user.id, started_at: startedAt,
      ended_at: startedAt + measuredSec * 1000, duration_min: Math.round(dur * 100) / 100,
      note: (note || "").slice(0, 100), confirmed: true,
    }, ...list]);
    const after = before + dur;
    const lim = task.max_minutes || 0;
    if (lim > 0) {
      if (after >= lim && before < lim) {
        await notifyUsers(pmIds(), "over", `${user.name} のタスク「${task.title}」が稼働上限を超過しました (${fmtHM(after)} / ${fmtHM(lim)})`, { email: true });
        toast("⚠ 稼働上限を超過しました。PMに連絡してください。");
      } else if (after >= lim * 0.9 && before < lim * 0.9) {
        await notifyUsers(pmIds(), "limit90", `${user.name} のタスク「${task.title}」が稼働上限の90%を超えました (${fmtHM(after)} / ${fmtHM(lim)})`, { email: true });
        toast("稼働時間が上限の90%を超えました");
      } else toast("稼働を記録しました");
    } else toast("稼働を記録しました");
    setTimerDone(null);
  }

  const appVal = {
    db, user, view, nav, theme, setTheme: setTheme2, refresh, mutate, notifyUsers, pmIds,
    toast, ask, timer, now, startTimer, stopTimer, openTaskId, setOpenTaskId, doLogout,
    commitWorkLog, runDeadlineScan,
  };

  if (!loaded) return (
    <div className={"kd " + theme}><style>{CSS}</style>
      <div className="flex items-center justify-center" style={{ minHeight: "100vh", color: "var(--muted)" }}>読み込み中…</div>
    </div>
  );

  return (
    <Ctx.Provider value={appVal}>
      <div className={"kd " + theme}>
        <style>{CSS}</style>
        {!user
          ? <AuthView doLogin={doLogin} hasUsers={db.users.length > 0} />
          : (user.mustChange ? <ForcePwView /> : <Shell />)}
        {toastMsg && <div className="toastbox">{toastMsg}</div>}
        <Modal open={!!confirmReq} onClose={() => { confirmReq && confirmReq.resolve(false); setConfirmReq(null); }} title="確認">
          <p className="text-sm mb-5">{confirmReq && confirmReq.msg}</p>
          <div className="flex justify-end gap-2">
            <button className="btn" onClick={() => { confirmReq.resolve(false); setConfirmReq(null); }}>キャンセル</button>
            <button className="btn btn-p" onClick={() => { confirmReq.resolve(true); setConfirmReq(null); }}>実行する</button>
          </div>
        </Modal>
        {timerDone && <TimerConfirmModal data={timerDone} onClose={() => setTimerDone(null)} />}
      </div>
    </Ctx.Provider>
  );
}

/* ============================================================
   初回セットアップ / ログイン
   ============================================================ */
function BrandMark({ size = 30 }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col" style={{ gap: 3 }}>
        <span style={{ display: "block", width: size + 6, height: 3, background: "var(--ai)", borderRadius: 2 }} />
        <span style={{ display: "block", width: size + 6, height: 3, background: "var(--ai)", borderRadius: 2, opacity: 0.45 }} />
      </div>
      <span className="wordmark" style={{ fontSize: size }}>FN.Task</span>
    </div>
  );
}

/* ============================================================
   AuthView — ログイン / Member新規登録 / PM申請 / 初回セットアップ
   ============================================================ */
function AuthView({ doLogin, hasUsers }) {
  const [mode, setMode] = useState(hasUsers ? "login" : "setup");
  const [seedInfo, setSeedInfo] = useState(null);
  if (mode === "seed_done" && seedInfo) return <SeedDoneView seedInfo={seedInfo} doLogin={doLogin} />;
  if (mode === "setup") return <SetupView doLogin={doLogin} onSeedDone={(info) => { setSeedInfo(info); setMode("seed_done"); }} />;
  if (mode === "register") return <RegisterView doLogin={doLogin} toLogin={() => setMode("login")} />;
  if (mode === "pm_apply") return <PMApplyView toLogin={() => setMode("login")} />;
  return <LoginView doLogin={doLogin} toRegister={() => setMode("register")} toPMApply={() => setMode("pm_apply")} />;
}

function SetupView({ doLogin, onSeedDone }) {
  const { toast } = useApp();
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [pw, setPw] = useState(""); const [seed, setSeed] = useState(true);
  const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const [seedInfo, setSeedInfo] = useState(null);

  async function submit() {
    if (!name.trim() || !email.includes("@") || pw.length < 6) { setErr("名前・メールアドレス・パスワード(6文字以上)を入力してください"); return; }
    setBusy(true);
    const salt = uid();
    const pmUser = { id: uid(), name: name.trim(), email: email.trim().toLowerCase(), role: "PM", avatarColor: AV_COLORS[0], salt, passHash: await sha(pw, salt) };
    let users = [pmUser];
    let projects = [], tasks = [], worklogs = [];
    let memberCreds = [];
    if (seed) {
      const demo = [["佐藤 美咲", "misaki@example.com"], ["田中 蒼真", "soma@example.com"], ["鈴木 健", "ken@example.com"]];
      for (let i = 0; i < demo.length; i++) {
        const s2 = uid(); const p2 = "demo1234";
        users.push({ id: uid(), name: demo[i][0], email: demo[i][1], role: "Member", avatarColor: AV_COLORS[i + 1], salt: s2, passHash: await sha(p2, s2) });
        memberCreds.push({ name: demo[i][0], email: demo[i][1], pw: p2 });
      }
      const m = users.slice(1);
      const d = new Date(); const iso = (off) => { const x = new Date(d); x.setDate(d.getDate() + off); return x.toISOString().slice(0, 10); };
      const p1 = { id: uid(), name: "会員アプリ v2 開発", description: "モバイル会員アプリのリニューアル開発プロジェクト", budget: 1200000, status: "active", start_date: iso(-20), end_date: iso(40), member_ids: m.map((x) => x.id), notion_url: "", created_at: Date.now() };
      const p2j = { id: uid(), name: "営業資料テンプレ整備", description: "提案書・見積テンプレートの標準化", budget: 300000, status: "active", start_date: iso(-10), end_date: iso(25), member_ids: [m[0].id, m[2].id], notion_url: "", created_at: Date.now() };
      projects = [p1, p2j];
      const mk = (pj, title, goal, assignee, pr, bud, maxH, dl, st) => ({ id: uid(), project_id: pj.id, title, description: title + "の対応を行う。", goal, assigned_user_id: assignee, budget: bud, max_minutes: maxH * 60, deadline: iso(dl), status: st, priority: pr, created_at: Date.now() });
      tasks = [
        mk(p1, "ログイン画面の実装", "メール認証・エラー表示まで完了させる", m[0].id, "high", 150000, 20, 5, "in_progress"),
        mk(p1, "プッシュ通知基盤の構築", "iOS/Android双方で受信確認", m[1].id, "high", 200000, 30, 12, "in_progress"),
        mk(p1, "会員ランクAPIの設計", "API仕様書レビュー承認まで", m[2].id, "medium", 120000, 16, 8, "todo"),
        mk(p1, "利用規約ページ更新", "法務確認済みテキストの反映", m[0].id, "low", 30000, 4, 2, "done"),
        mk(p1, "画像アップロード最適化", "3MB→500KB圧縮パイプライン導入", null, "medium", 90000, 12, 18, "todo"),
        mk(p2j, "提案書テンプレ v1", "3案件で使えるマスター資料完成", m[0].id, "medium", 80000, 10, 6, "in_progress"),
        mk(p2j, "見積計算シート整備", "係数変更に耐える計算式に更新", m[2].id, "high", 100000, 14, 3, "todo"),
        mk(p2j, "過去事例集の作成", "10事例を1枚ずつに要約", null, "low", 60000, 8, 20, "todo"),
      ];
      const wl = (t, u2, min, dayOff, note) => { const st2 = Date.now() - dayOff * 864e5 - min * 60000; return { id: uid(), task_id: t.id, user_id: u2, started_at: st2, ended_at: st2 + min * 60000, duration_min: min, note, confirmed: true }; };
      worklogs = [
        wl(tasks[0], m[0].id, 240, 3, "UI組み込み"), wl(tasks[0], m[0].id, 180, 1, "バリデーション実装"),
        wl(tasks[1], m[1].id, 300, 4, "FCM設定"), wl(tasks[1], m[1].id, 420, 2, "端末検証"),
        wl(tasks[1], m[1].id, 900, 1, "iOS対応で難航"),
        wl(tasks[3], m[0].id, 200, 6, "反映と確認"), wl(tasks[5], m[0].id, 150, 2, "構成案作成"),
      ];
    }
    await S.set("tm:users", users);
    await S.set("tm:projects", projects); await S.set("tm:tasks", tasks);
    await S.set("tm:worklogs", worklogs);
    await S.set("tm:requests", []); await S.set("tm:notifications", []); await S.set("tm:comments", []);
    setBusy(false);
    if (seed) onSeedDone({ creds: memberCreds, email: email.trim().toLowerCase(), pw });
    else { toast("セットアップ完了"); await doLogin(email, pw); }
  }

  if (seedInfo) return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full" style={{ maxWidth: 480 }}>
        <BrandMark size={22} />
        <h2 className="text-base font-bold mt-5 mb-2">セットアップ完了</h2>
        <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>デモ用メンバーのログイン情報です。動作確認に使えます(この画面でのみ表示)。</p>
        <div className="panel p-3 mb-4" style={{ background: "var(--panel2)" }}>
          {seedInfo.creds.map((c) => (
            <div key={c.email} className="text-sm mono py-1">{c.name} — {c.email} / {c.pw}</div>
          ))}
        </div>
        <button className="btn btn-p w-full justify-center" onClick={() => doLogin(seedInfo.email, seedInfo.pw)}>PMとしてログイン</button>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full" style={{ maxWidth: 440 }}>
        <BrandMark />
        <p className="text-sm mt-3 mb-1" style={{ color: "var(--muted)" }}>チームの稼働とタスクをひとつの帳面に。</p>
        <p className="text-xs mb-5" style={{ color: "var(--muted)" }}>※ データはこのアプリの共有ストレージに保存されます。アプリを共有した相手からも閲覧できます。</p>
        <h2 className="text-base font-bold mb-3 ledger pb-2">初回セットアップ — PMアカウント作成</h2>
        <Field label="名前"><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="山田 太郎" /></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pm@example.com" /></Field>
        <Field label="パスワード (6文字以上)"><input type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} /></Field>
        <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer">
          <input type="checkbox" checked={seed} onChange={(e) => setSeed(e.target.checked)} />
          デモデータ(メンバー3名・プロジェクト2件・タスク8件)を投入する
        </label>
        {err && <div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center" disabled={busy} onClick={submit}>{busy ? "作成中…" : "はじめる"}</button>
      </div>
    </div>
  );
}

function LoginView({ doLogin, toRegister, toPMApply }) {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [show, setShow] = useState(false); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setErr("");
    const e = await doLogin(email, pw);
    setBusy(false); if (e) setErr(e);
  }
  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full" style={{ maxWidth: 400 }}>
        <BrandMark />
        <h2 className="text-base font-bold mt-6 mb-4 ledger pb-2">ログイン</h2>
        <Field label="メールアドレス"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="パスワード">
          <div className="relative">
            <input type={show ? "text" : "password"} className="input" style={{ paddingRight: 40 }} value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
            <button className="iconbtn" style={{ position: "absolute", right: 2, top: 1 }} onClick={() => setShow(!show)} aria-label="表示切替">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </Field>
        {err && <div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center" disabled={busy} onClick={submit}>{busy ? "確認中…" : "ログイン"}</button>
        <div className="flex flex-col gap-2 mt-4">
          <button className="btn w-full justify-center" onClick={toRegister}><User size={15} />新規登録 (Member)</button>
          <button className="btn w-full justify-center" onClick={toPMApply}><Shield size={15} />PM権限を申請する</button>
        </div>
        <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>パスワードを忘れた場合はPMに再発行を依頼してください。</p>
      </div>
    </div>
  );
}

/* ---------- Member新規登録 ---------- */
function RegisterView({ doLogin, toLogin }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit() {
    setErr("");
    if (!name.trim()) { setErr("名前を入力してください"); return; }
    if (!email.includes("@")) { setErr("有効なメールアドレスを入力してください"); return; }
    if (pw.length < 6) { setErr("パスワードは6文字以上にしてください"); return; }
    if (pw !== pw2) { setErr("確認用パスワードが一致しません"); return; }
    setBusy(true);
    const em = email.trim().toLowerCase();
    const existing = (await S.get("tm:users")) || [];
    if (existing.some((u) => u.email === em)) { setErr("そのメールアドレスはすでに登録されています"); setBusy(false); return; }
    const salt = uid(); const passHash = await sha(pw, salt);
    const nu = { id: uid(), name: name.trim(), email: em, role: "Member", avatarColor: AV_COLORS[existing.length % AV_COLORS.length], salt, passHash, created_at: Date.now() };
    await S.set("tm:users", [...existing, nu]);
    const pms = existing.filter((u) => u.role === "PM" && !u.pending).map((u) => u.id);
    if (pms.length) {
      const notifs = (await S.get("tm:notifications")) || [];
      const add = pms.map((pid) => ({ id: uid(), user_id: pid, type: "system", message: `新しいMemberが登録しました: ${nu.name} (${em})`, read: false, created_at: Date.now(), email: false, k: null }));
      await S.set("tm:notifications", [...add, ...notifs].slice(0, 400));
    }
    setBusy(false);
    await doLogin(em, pw);
  }
  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full" style={{ maxWidth: 420 }}>
        <BrandMark />
        <h2 className="text-base font-bold mt-5 mb-1 ledger pb-2">新規登録 — Member</h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>登録後すぐにMemberとしてログインできます。PM権限が必要な場合は別途申請してください。</p>
        <Field label="名前"><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="山田 太郎" /></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="パスワード (6文字以上)">
          <div className="relative">
            <input type={show ? "text" : "password"} className="input" style={{ paddingRight: 40 }} value={pw} onChange={(e) => setPw(e.target.value)} />
            <button className="iconbtn" style={{ position: "absolute", right: 2, top: 1 }} onClick={() => setShow(!show)} aria-label="表示切替">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </Field>
        <Field label="パスワード (確認)"><input type="password" className="input" value={pw2} onChange={(e) => setPw2(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} /></Field>
        {err && <div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center mb-3" disabled={busy} onClick={submit}>{busy ? "登録中…" : "登録してログイン"}</button>
        <button className="btn w-full justify-center" onClick={toLogin}><ArrowLeft size={14} />ログインに戻る</button>
      </div>
    </div>
  );
}

/* ---------- PM申請 ---------- */
function PMApplyView({ toLogin }) {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [reason, setReason] = useState("");
  const [show, setShow] = useState(false); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  async function submit() {
    setErr("");
    if (!name.trim()) { setErr("名前を入力してください"); return; }
    if (!email.includes("@")) { setErr("有効なメールアドレスを入力してください"); return; }
    if (pw.length < 6) { setErr("パスワードは6文字以上にしてください"); return; }
    if (pw !== pw2) { setErr("確認用パスワードが一致しません"); return; }
    setBusy(true);
    const em = email.trim().toLowerCase();
    const existing = (await S.get("tm:users")) || [];
    if (existing.some((u) => u.email === em)) { setErr("そのメールアドレスはすでに登録されています"); setBusy(false); return; }
    const salt = uid(); const passHash = await sha(pw, salt);
    const nu = { id: uid(), name: name.trim(), email: em, role: "PM", avatarColor: AV_COLORS[existing.length % AV_COLORS.length], salt, passHash, pending: true, pm_apply_reason: reason.trim(), created_at: Date.now() };
    await S.set("tm:users", [...existing, nu]);
    const pms = existing.filter((u) => u.role === "PM" && !u.pending).map((u) => u.id);
    if (pms.length) {
      const notifs = (await S.get("tm:notifications")) || [];
      const add = pms.map((pid) => ({ id: uid(), user_id: pid, type: "system", message: `PM権限申請: ${nu.name} (${em})${reason.trim() ? " — " + reason.trim() : ""}`, read: false, created_at: Date.now(), email: false, k: null }));
      await S.set("tm:notifications", [...add, ...notifs].slice(0, 400));
    }
    setBusy(false); setDone(true);
  }
  if (done) return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full text-center" style={{ maxWidth: 400 }}>
        <BrandMark />
        <CheckCircle2 size={40} style={{ color: "var(--green)", margin: "20px auto 12px" }} />
        <h2 className="text-base font-bold mb-2">申請を送信しました</h2>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>既存のPMが承認するとログインできるようになります。</p>
        <button className="btn w-full justify-center" onClick={toLogin}><ArrowLeft size={14} />ログインに戻る</button>
      </div>
    </div>
  );
  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full" style={{ maxWidth: 420 }}>
        <BrandMark />
        <h2 className="text-base font-bold mt-5 mb-1 ledger pb-2">PM権限の申請</h2>
        <p className="text-xs mb-4" style={{ color: "var(--muted)" }}>既存のPMが承認するまでログインできません。</p>
        <Field label="名前"><input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="山田 太郎" /></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
        <Field label="パスワード (6文字以上)">
          <div className="relative">
            <input type={show ? "text" : "password"} className="input" style={{ paddingRight: 40 }} value={pw} onChange={(e) => setPw(e.target.value)} />
            <button className="iconbtn" style={{ position: "absolute", right: 2, top: 1 }} onClick={() => setShow(!show)} aria-label="表示切替">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
          </div>
        </Field>
        <Field label="パスワード (確認)"><input type="password" className="input" value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
        <Field label="申請理由 (任意)" hint="PMが判断する際の参考になります"><textarea className="textarea" style={{ minHeight: 64 }} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="所属・役割など" /></Field>
        {err && <div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center mb-3" disabled={busy} onClick={submit}>{busy ? "送信中…" : "PM権限を申請する"}</button>
        <button className="btn w-full justify-center" onClick={toLogin}><ArrowLeft size={14} />ログインに戻る</button>
      </div>
    </div>
  );
}

/* ---------- デモデータ完了画面 ---------- */
function SeedDoneView({ seedInfo, doLogin }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function handleLogin() {
    if (busy) return;
    setBusy(true);
    try {
      const e = await doLogin(seedInfo.email, seedInfo.pw);
      if (e) setErr(e);
    } catch(ex) {
      setErr(String(ex));
    }
    setBusy(false);
  }
  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full" style={{ maxWidth: 480 }}>
        <BrandMark size={22} />
        <h2 className="text-base font-bold mt-5 mb-2">セットアップ完了</h2>
        <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>デモ用メンバーのログイン情報です(この画面でのみ表示)。</p>
        <div className="panel p-3 mb-4" style={{ background: "var(--panel2)" }}>
          {seedInfo.creds.map((c) => (
            <div key={c.email} className="text-sm mono py-1">{c.name} — {c.email} / {c.pw}</div>
          ))}
        </div>
        {err && <div className="err mb-2">{err}</div>}
        <button
          className="btn btn-p w-full justify-center"
          disabled={busy}
          onClick={handleLogin}
          onTouchEnd={(e) => { e.preventDefault(); handleLogin(); }}
        >
          {busy ? "ログイン中…" : "PMとしてログイン"}
        </button>
      </div>
    </div>
  );
}

function ForcePwView() {
  const { user, mutate, toast } = useApp();
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState(""); const [err, setErr] = useState("");
  async function submit() {
    if (pw.length < 6) { setErr("6文字以上にしてください"); return; }
    if (pw !== pw2) { setErr("確認用パスワードが一致しません"); return; }
    const salt = uid(); const h = await sha(pw, salt);
    await mutate("users", (list) => list.map((u) => u.id === user.id ? { ...u, salt, passHash: h, mustChange: false } : u));
    toast("パスワードを更新しました");
  }
  return (
    <div className="flex items-center justify-center px-4" style={{ minHeight: "100vh" }}>
      <div className="panel p-6 w-full" style={{ maxWidth: 400 }}>
        <BrandMark size={22} />
        <h2 className="text-base font-bold mt-5 mb-2">初回パスワード変更</h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>仮パスワードでログインしています。新しいパスワードを設定してください。</p>
        <Field label="新しいパスワード"><input type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        <Field label="新しいパスワード (確認)"><input type="password" className="input" value={pw2} onChange={(e) => setPw2(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} /></Field>
        {err && <div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center" onClick={submit}>設定する</button>
      </div>
    </div>
  );
}

/* ============================================================
   Shell — ナビ / 検索 / 通知 / タイマーバー
   ============================================================ */
function Shell() {
  const { user, view } = useApp();
  const isPM = user.role === "PM";
  return (
    <div className="flex" style={{ minHeight: "100vh" }}>
      <SideNav />
      <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
        <TopBar />
        <main className="flex-1 w-full px-4 py-5 md:px-8 md:py-6" style={{ maxWidth: 1180, margin: "0 auto", paddingBottom: 110 }}>
          <PageRouter />
        </main>
      </div>
      <FloatingTimer />
      <BottomNav />
      <MemberTaskModalHost />
    </div>
  );
}

function PageRouter() {
  const { view, user } = useApp();
  const isPM = user.role === "PM";
  const p = view.page;
  if (isPM) {
    if (p === "dash") return <PMDashboard />;
    if (p === "projects") return <ProjectsView />;
    if (p === "project") return <ProjectDetail id={view.id} tab={view.tab} />;
    if (p === "requests") return <RequestsView />;
    if (p === "users") return <UsersView />;
    if (p === "profile") return <ProfileView />;
    return <PMDashboard />;
  }
  if (p === "mydash" || p === "dash") return <MemberDashboard />;
  if (p === "mytasks") return <MemberTasks />;
  if (p === "unassigned") return <UnassignedView />;
  if (p === "history") return <HistoryView />;
  if (p === "profile") return <ProfileView />;
  return <MemberDashboard />;
}

const NAV_PM = [
  { page: "dash", label: "ダッシュボード", icon: Home },
  { page: "projects", label: "プロジェクト", icon: Briefcase },
  { page: "requests", label: "申請管理", icon: Inbox },
  { page: "users", label: "ユーザー管理", icon: Users },
];
const NAV_M = [
  { page: "mydash", label: "ホーム", icon: Home },
  { page: "mytasks", label: "マイタスク", icon: ClipboardList },
  { page: "history", label: "稼働履歴", icon: History },
];

function SideNav() {
  const { user, view, nav, db } = useApp();
  const items = user.role === "PM" ? NAV_PM : NAV_M;
  const pending = user.role === "PM" ? db.requests.filter((r) => r.status === "pending").length : 0;
  return (
    <aside className="hidden md:flex flex-col gap-1 p-4" style={{ width: 220, borderRight: "1px solid var(--border)", flexShrink: 0 }}>
      <div className="mb-6 mt-1 px-2"><BrandMark size={20} /></div>
      {items.map((it) => (
        <div key={it.page} className={"navi" + (view.page === it.page || (it.page === "projects" && view.page === "project") ? " on" : "")} onClick={() => nav(it.page)}>
          <it.icon size={17} strokeWidth={2} />
          <span className="flex-1">{it.label}</span>
          {it.page === "requests" && pending > 0 && <Badge cls="b-red">{pending}</Badge>}
        </div>
      ))}
      <div className="flex-1" />
      <div className="text-xs px-2 pb-1" style={{ color: "var(--muted)" }}>{user.role === "PM" ? "PMアカウント" : "Memberアカウント"}</div>
    </aside>
  );
}

function BottomNav() {
  const { user, view, nav, db } = useApp();
  const items = user.role === "PM" ? NAV_PM : NAV_M;
  const pending = user.role === "PM" ? db.requests.filter((r) => r.status === "pending").length : 0;
  return (
    <nav className="md:hidden" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 45, background: "var(--panel)", borderTop: "1px solid var(--border)", display: "flex" }}>
      {items.map((it) => {
        const on = view.page === it.page || (it.page === "projects" && view.page === "project");
        return (
          <button key={it.page} onClick={() => nav(it.page)} className="flex-1 flex flex-col items-center gap-1 py-2" style={{ background: "none", border: "none", color: on ? "var(--ai)" : "var(--muted)", fontSize: 10, fontWeight: on ? 700 : 500, cursor: "pointer", position: "relative" }}>
            <it.icon size={20} strokeWidth={on ? 2.4 : 2} />
            {it.label}
            {it.page === "requests" && pending > 0 && <span className="dot" style={{ top: 2, right: "24%" }}>{pending}</span>}
          </button>
        );
      })}
    </nav>
  );
}

function TopBar() {
  const { user, nav, theme, setTheme, doLogout, refresh, toast } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  return (
    <header className="flex items-center gap-2 px-4 md:px-8 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--panel)", position: "sticky", top: 0, zIndex: 30 }}>
      <div className="md:hidden mr-1"><BrandMark size={16} /></div>
      <SearchBox />
      <div className="flex-1" />
      <button className="iconbtn" onClick={async () => { await refresh(); toast("最新のデータを取得しました"); }} aria-label="更新"><RefreshCw size={17} /></button>
      <button className="iconbtn" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="テーマ切替">{theme === "light" ? <Moon size={17} /> : <Sun size={17} />}</button>
      <div className="relative">
        <NotifBell onToggle={() => setTrayOpen(!trayOpen)} />
        {trayOpen && <NotifTray onClose={() => setTrayOpen(false)} />}
      </div>
      <div className="relative">
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }} onClick={() => setMenuOpen(!menuOpen)} aria-label="アカウント">
          <Avatar user={user} size={32} />
        </button>
        {menuOpen && (
          <div className="panel searchdrop" style={{ left: "auto", right: 0, width: 200, top: 42, padding: 6 }}>
            <div className="px-3 py-2 text-sm font-bold">{user.name}</div>
            <div className="px-3 pb-2 text-xs" style={{ color: "var(--muted)" }}>{user.email}</div>
            <div className="navi" onClick={() => { setMenuOpen(false); nav("profile"); }}><Settings size={15} />プロフィール設定</div>
            <div className="navi" onClick={doLogout}><LogOut size={15} />ログアウト</div>
          </div>
        )}
      </div>
    </header>
  );
}

function NotifBell({ onToggle }) {
  const { db, user } = useApp();
  const unread = db.notifications.filter((n) => n.user_id === user.id && !n.read).length;
  return (
    <button className="iconbtn" onClick={onToggle} aria-label="通知">
      <Bell size={17} />
      {unread > 0 && <span className="dot">{unread > 99 ? "99+" : unread}</span>}
    </button>
  );
}

function NotifTray({ onClose }) {
  const { db, user, mutate } = useApp();
  const mine = db.notifications.filter((n) => n.user_id === user.id).slice(0, 60);
  async function markAll() {
    await mutate("notifications", (list) => list.map((n) => n.user_id === user.id ? { ...n, read: true } : n));
  }
  async function markOne(id) {
    await mutate("notifications", (list) => list.map((n) => n.id === id ? { ...n, read: true } : n));
  }
  return (
    <div className="panel searchdrop" style={{ left: "auto", right: -44, width: "min(380px, 92vw)", top: 42, padding: 0, overflow: "hidden" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "3px double var(--border)" }}>
        <span className="text-sm font-bold">通知</span>
        <div className="flex gap-1">
          <button className="btn btn-sm" onClick={markAll}>全て既読</button>
          <button className="iconbtn" style={{ width: 28, height: 28 }} onClick={onClose}><X size={15} /></button>
        </div>
      </div>
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {mine.length === 0 && <Empty text="通知はありません" icon={Bell} />}
        {mine.map((n) => {
          const meta = NT_META[n.type] || NT_META.system; const I = meta.icon;
          return (
            <div key={n.id} className={"notifitem" + (n.read ? "" : " unread")} onClick={() => markOne(n.id)} style={{ cursor: n.read ? "default" : "pointer" }}>
              <I size={17} style={{ color: n.type === "over" || n.type === "reject" ? "var(--red)" : n.type === "limit90" || n.type === "deadline" ? "var(--amber)" : "var(--ai)", flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1" style={{ minWidth: 0 }}>
                <div className="text-sm" style={{ wordBreak: "break-word" }}>{n.message}</div>
                <div className="text-xs flex items-center gap-2 mt-1" style={{ color: "var(--muted)" }}>
                  {fmtDT(n.created_at)}
                  {n.email && <span className="flex items-center gap-1" title="メール通知対象(本環境ではアプリ内のみ)"><Mail size={11} />メール対象</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchBox() {
  const { db, user, nav, setOpenTaskId } = useApp();
  const [q, setQ] = useState(""); const [open, setOpen] = useState(false);
  const isPM = user.role === "PM";
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 1) return { projects: [], tasks: [] };
    const myTaskFilter = (t) => isPM || t.assigned_user_id === user.id;
    const projects = db.projects.filter((p) => (p.name + p.description).toLowerCase().includes(s)).slice(0, 5);
    const tasks = db.tasks.filter((t) => myTaskFilter(t) && (t.title + (t.description || "")).toLowerCase().includes(s)).slice(0, 7);
    return { projects: isPM ? projects : projects.filter((p) => p.member_ids && p.member_ids.includes(user.id)), tasks };
  }, [q, db, isPM, user.id]);
  return (
    <div className="relative flex-1" style={{ maxWidth: 380 }}>
      <div className="relative">
        <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: "var(--muted)" }} />
        <input className="input" style={{ paddingLeft: 32 }} placeholder="プロジェクト・タスクを検索" value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 180)} />
      </div>
      {open && q.trim() && (
        <div className="panel searchdrop p-1">
          {results.projects.length === 0 && results.tasks.length === 0 && <div className="p-3 text-sm" style={{ color: "var(--muted)" }}>該当なし</div>}
          {results.projects.map((p) => (
            <div key={p.id} className="navi" onMouseDown={() => { isPM ? nav("project", { id: p.id }) : nav("mytasks"); setQ(""); }}>
              <Briefcase size={14} /><span className="flex-1 truncate">{p.name}</span><Badge cls={PJ_BADGE[p.status]}>{PJST[p.status]}</Badge>
            </div>
          ))}
          {results.tasks.map((t) => {
            const pj = db.projects.find((p) => p.id === t.project_id);
            return (
              <div key={t.id} className="navi" onMouseDown={() => { if (isPM) nav("project", { id: t.project_id }); else setOpenTaskId(t.id); setQ(""); }}>
                <ClipboardList size={14} />
                <span className="flex-1 truncate">{t.title}<span className="text-xs ml-2" style={{ color: "var(--muted)" }}>{pj ? pj.name : ""}</span></span>
                <Badge cls={ST_BADGE[t.status]}>{ST[t.status]}</Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FloatingTimer() {
  const { timer, now, db, stopTimer, setOpenTaskId } = useApp();
  if (!timer) return null;
  const task = db.tasks.find((t) => t.id === timer.taskId);
  const sec = (now - timer.startedAt) / 1000;
  return (
    <div className="fixed bottom-16 md:bottom-6" style={{ left: "50%", transform: "translateX(-50%)", zIndex: 46, width: "min(560px, calc(100vw - 24px))" }}>
      <div className="panel flex items-center gap-3 px-4 py-3" style={{ boxShadow: "0 10px 30px rgba(0,0,0,.18)", borderColor: "var(--ai)" }}>
        <span className="pulse" />
        <div className="flex-1 cursor-pointer" style={{ minWidth: 0 }} onClick={() => task && setOpenTaskId(task.id)}>
          <div className="text-xs" style={{ color: "var(--muted)" }}>計測中</div>
          <div className="text-sm font-bold truncate">{task ? task.title : "(削除されたタスク)"}</div>
        </div>
        <div className="mono text-lg font-bold">{fmtHMS(sec)}</div>
        <button className="btn btn-p btn-sm" onClick={stopTimer}><Square size={13} />停止</button>
      </div>
    </div>
  );
}

/* ============================================================
   PM: ダッシュボード
   ============================================================ */
function PMDashboard() {
  const { db, nav } = useApp();
  const active = db.projects.filter((p) => p.status === "active");
  const [wS, wE] = weekRange();
  const weekLogs = db.worklogs.filter((l) => l.started_at >= wS && l.started_at < wE);
  const weekMin = weekLogs.reduce((a, l) => a + l.duration_min, 0);
  const weekDone = db.tasks.filter((t) => t.status === "done" && t.completed_at && t.completed_at >= wS && t.completed_at < wE).length;
  const pending = db.requests.filter((r) => r.status === "pending");
  const alerts90 = db.tasks.filter((t) => { if (t.status === "done" || !t.max_minutes) return false; const w = workedMin(db.worklogs, t.id); return w >= t.max_minutes * 0.9; });
  const overdue = db.tasks.filter((t) => t.status !== "done" && t.deadline && daysUntil(t.deadline) < 0);
  const members = db.users.filter((u) => u.role === "Member");

  return (
    <div>
      <PageTitle title="ダッシュボード" sub="チーム全体の稼働状況" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="アクティブPJ" value={active.length} unit="件" />
        <StatCard label="今週のチーム稼働" value={fmtHM(weekMin)} unit="" mono />
        <StatCard label="今週の完了タスク" value={weekDone} unit="件" />
        <StatCard label="申請待ち" value={pending.length} unit="件" warn={pending.length > 0} onClick={() => nav("requests")} />
      </div>

      {(alerts90.length > 0 || overdue.length > 0 || pending.length > 0) && (
        <section className="panel p-4 mb-6">
          <SecTitle icon={AlertTriangle} title="アラート" tone="var(--amber)" />
          <div className="flex flex-col gap-2">
            {overdue.map((t) => <AlertRow key={"o" + t.id} tone="red" text={`期日超過: 「${t.title}」 (期日 ${t.deadline})`} onClick={() => nav("project", { id: t.project_id })} />)}
            {alerts90.map((t) => {
              const w = workedMin(db.worklogs, t.id);
              const over = w >= t.max_minutes;
              return <AlertRow key={"a" + t.id} tone={over ? "red" : "amber"} text={`${over ? "上限超過" : "90%超過"}: 「${t.title}」 ${fmtHM(w)} / ${fmtHM(t.max_minutes)}`} onClick={() => nav("project", { id: t.project_id })} />;
            })}
            {pending.length > 0 && <AlertRow tone="blue" text={`未処理の申請が ${pending.length} 件あります`} onClick={() => nav("requests")} />}
          </div>
        </section>
      )}

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold m-0">アクティブプロジェクト</h2>
          <button className="btn btn-sm" onClick={() => nav("projects")}>すべて見る<ChevronRight size={13} /></button>
        </div>
        {active.length === 0 ? <div className="panel"><Empty icon={Briefcase} text="アクティブなプロジェクトがありません" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {active.map((p) => <ProjectCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <section className="panel p-4">
        <SecTitle icon={Clock} title="メンバー稼働ヒートマップ (直近7日)" />
        <Heatmap members={members} logs={db.worklogs} />
      </section>
    </div>
  );
}

function PageTitle({ title, sub, back, right }) {
  const { nav } = useApp();
  return (
    <div className="flex items-start gap-3 mb-5 flex-wrap">
      {back && <button className="iconbtn" onClick={back} aria-label="戻る"><ArrowLeft size={18} /></button>}
      <div className="flex-1" style={{ minWidth: 200 }}>
        <h1 className="text-xl font-bold m-0 ledger pb-2 inline-block pr-6">{title}</h1>
        {sub && <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}
function SecTitle({ icon: I, title, tone }) {
  return <div className="flex items-center gap-2 mb-3 text-sm font-bold" style={{ color: tone || "var(--text)" }}><I size={15} />{title}</div>;
}
function StatCard({ label, value, unit, warn, mono, onClick }) {
  return (
    <div className={"panel p-4" + (onClick ? " cursor-pointer" : "")} onClick={onClick} style={warn ? { borderColor: "var(--amber)" } : {}}>
      <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{label}</div>
      <div className={"stat" + (mono ? " mono" : "")} style={warn ? { color: "var(--amber)" } : {}}>{value}<span className="text-xs font-medium ml-1" style={{ color: "var(--muted)" }}>{unit}</span></div>
    </div>
  );
}
function AlertRow({ tone, text, onClick }) {
  const c = tone === "red" ? "var(--red)" : tone === "amber" ? "var(--amber)" : "var(--ai)";
  const bg = tone === "red" ? "var(--red-bg)" : tone === "amber" ? "var(--amber-bg)" : "var(--ai-soft)";
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer" style={{ background: bg, color: c }} onClick={onClick}>
      <AlertTriangle size={14} style={{ flexShrink: 0 }} /><span className="flex-1">{text}</span><ChevronRight size={14} />
    </div>
  );
}

function Heatmap({ members, logs }) {
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (6 - i)); return d; });
  const cell = (u, d) => {
    const s = d.getTime(), e = s + 864e5;
    return logs.filter((l) => l.user_id === u.id && l.started_at >= s && l.started_at < e).reduce((a, l) => a + l.duration_min, 0);
  };
  if (members.length === 0) return <Empty icon={Users} text="メンバーがいません" />;
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 460 }}>
        <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: "120px repeat(7, 1fr)" }}>
          <div />
          {days.map((d, i) => <div key={i} className="text-center text-xs" style={{ color: "var(--muted)" }}>{d.getMonth() + 1}/{d.getDate()}</div>)}
        </div>
        {members.map((u) => (
          <div key={u.id} className="grid gap-1 mb-1 items-center" style={{ gridTemplateColumns: "120px repeat(7, 1fr)" }}>
            <div className="flex items-center gap-2 text-xs truncate"><Avatar user={u} size={20} />{u.name}</div>
            {days.map((d, i) => {
              const m = cell(u, d); const alpha = m <= 0 ? 0 : Math.min(0.95, 0.18 + (m / 480) * 0.8);
              return <div key={i} className="hcell" title={`${u.name} ${d.getMonth() + 1}/${d.getDate()} — ${fmtHM(m)}`}
                style={m > 0 ? { background: `color-mix(in srgb, var(--ai) ${Math.round(alpha * 100)}%, var(--panel2))` } : {}} />;
            })}
          </div>
        ))}
        <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>色が濃いほど稼働時間が長い(8h基準)</div>
      </div>
    </div>
  );
}

/* ============================================================
   PM: プロジェクト一覧・カード・作成/編集
   ============================================================ */
function ProjectCard({ p }) {
  const { db, nav } = useApp();
  const st = projectStats(p, db.tasks, db.worklogs);
  const members = (p.member_ids || []).map((id) => db.users.find((u) => u.id === id)).filter(Boolean);
  return (
    <div className="panel p-4 cursor-pointer" onClick={() => nav("project", { id: p.id })}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-bold text-sm truncate flex-1">{p.name}</div>
        <Badge cls={PJ_BADGE[p.status]} dot>{PJST[p.status]}</Badge>
      </div>
      <div className="flex items-center justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
        <span>予算消化 (稼働按分)</span><span className="mono">{Math.round(st.consumedRate * 100)}%</span>
      </div>
      <Prog ratio={st.consumedRate} />
      <div className="flex items-center justify-between text-xs mt-2 mb-1" style={{ color: "var(--muted)" }}>
        <span>タスク完了</span><span className="mono">{st.done}/{st.total}</span>
      </div>
      <Prog ratio={st.progress} tone="ok" />
      <div className="flex items-center justify-between mt-3">
        <div className="flex" style={{ paddingLeft: 4 }}>
          {members.slice(0, 5).map((m) => <span key={m.id} style={{ marginLeft: -6 }}><Avatar user={m} size={24} /></span>)}
          {members.length > 5 && <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>+{members.length - 5}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
          {p.notion_url && <a href={p.notion_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} title="Notionページを開く"><Link2 size={13} /></a>}
          <Calendar size={12} />〜{fmtDate(p.end_date)}
        </div>
      </div>
    </div>
  );
}

function ProjectsView() {
  const { db } = useApp();
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState(null); // null | {} | project
  const list = db.projects.filter((p) => filter === "all" || p.status === filter).sort((a, b) => b.created_at - a.created_at);
  return (
    <div>
      <PageTitle title="プロジェクト" sub={`全 ${db.projects.length} 件`} right={<button className="btn btn-p" onClick={() => setForm({})}><Plus size={15} />新規プロジェクト</button>} />
      <div className="mb-4"><Seg value={filter} onChange={setFilter} options={[{ value: "all", label: "すべて" }, { value: "active", label: "進行中" }, { value: "paused", label: "一時停止" }, { value: "completed", label: "完了" }]} /></div>
      {list.length === 0 ? <div className="panel"><Empty icon={Briefcase} text="プロジェクトがありません。「新規プロジェクト」から作成できます" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {list.map((p) => <ProjectCard key={p.id} p={p} />)}
        </div>
      )}
      {form !== null && <ProjectForm initial={form.id ? form : null} onClose={() => setForm(null)} />}
    </div>
  );
}

function ProjectForm({ initial, onClose }) {
  const { db, mutate, toast, notifyUsers } = useApp();
  const [f, setF] = useState(initial ? { ...initial } : { name: "", description: "", budget: "", start_date: todayStr(), end_date: "", member_ids: [], status: "active", notion_url: "" });
  const [errs, setErrs] = useState({});
  const members = db.users;
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  function toggleMember(id) { set("member_ids", f.member_ids.includes(id) ? f.member_ids.filter((x) => x !== id) : [...f.member_ids, id]); }
  async function submit() {
    const e = {};
    if (!f.name.trim()) e.name = "プロジェクト名は必須です";
    if (!f.description.trim()) e.description = "説明は必須です";
    if (!(Number(f.budget) > 0)) e.budget = "総予算(円)を入力してください";
    if (!f.start_date) e.start_date = "開始日は必須です";
    if (!f.end_date) e.end_date = "終了日は必須です";
    if (f.start_date && f.end_date && f.end_date < f.start_date) e.end_date = "終了日は開始日以降にしてください";
    setErrs(e); if (Object.keys(e).length) return;
    if (initial) {
      await mutate("projects", (list) => list.map((p) => p.id === initial.id ? { ...p, ...f, budget: Number(f.budget) } : p));
      toast("プロジェクトを更新しました");
    } else {
      const p = { ...f, id: uid(), budget: Number(f.budget), created_at: Date.now(), notion_page_id: "" };
      await mutate("projects", (list) => [p, ...list]);
      await notifyUsers(f.member_ids, "system", `プロジェクト「${f.name}」に追加されました`);
      toast("プロジェクトを作成しました");
    }
    onClose();
  }
  return (
    <Modal open onClose={onClose} title={initial ? "プロジェクトを編集" : "新規プロジェクト"}>
      <Field label="プロジェクト名 *" error={errs.name}><input className="input" value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
      <Field label="説明・概要 *" error={errs.description}><textarea className="textarea" value={f.description} onChange={(e) => set("description", e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="総予算 (円) *" error={errs.budget}><input type="number" className="input num" value={f.budget} onChange={(e) => set("budget", e.target.value)} /></Field>
        <Field label="ステータス">
          <select className="select" value={f.status} onChange={(e) => set("status", e.target.value)}>
            <option value="active">進行中</option><option value="paused">一時停止</option><option value="completed">完了</option>
          </select>
        </Field>
        <Field label="開始日 *" error={errs.start_date}><input type="date" className="input" value={f.start_date} onChange={(e) => set("start_date", e.target.value)} /></Field>
        <Field label="終了日 *" error={errs.end_date}><input type="date" className="input" value={f.end_date} onChange={(e) => set("end_date", e.target.value)} /></Field>
      </div>
      <Field label="参加メンバー" hint="タップで選択/解除">
        <div className="flex flex-wrap gap-2">
          {members.map((m) => (
            <button key={m.id} className={"chip" + (f.member_ids.includes(m.id) ? " on" : "")} onClick={() => toggleMember(m.id)}>{m.name}{m.role === "PM" ? " (PM)" : ""}</button>
          ))}
        </div>
      </Field>
      <Field label="Notion連携 (任意)" hint="「プロジェクト管理」または「営業管理」のNotionページURL。同期はプロジェクト詳細の設定タブから実行できます。">
        <input className="input" placeholder="https://www.notion.so/..." value={f.notion_url || ""} onChange={(e) => set("notion_url", e.target.value)} />
      </Field>
      <div className="flex justify-end gap-2 mt-4">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn btn-p" onClick={submit}>{initial ? "保存する" : "作成する"}</button>
      </div>
    </Modal>
  );
}

/* ============================================================
   PM: プロジェクト詳細 (タブ構造)
   ============================================================ */
function ProjectDetail({ id, tab }) {
  const { db, nav } = useApp();
  const [curTab, setCurTab] = useState(tab || "tasks");
  const [csvOpen, setCsvOpen] = useState(false);
  const p = db.projects.find((x) => x.id === id);
  if (!p) return <div><PageTitle title="プロジェクトが見つかりません" back={() => nav("projects")} /></div>;
  const st = projectStats(p, db.tasks, db.worklogs);
  const tabs = [["tasks", "タスク一覧"], ["members", "メンバー稼働"], ["budget", "予算管理"], ["settings", "設定"]];
  return (
    <div>
      <PageTitle back={() => nav("projects")} title={p.name}
        sub={`${p.start_date || "?"} 〜 ${p.end_date || "?"}`}
        right={<div className="flex gap-2 items-center flex-wrap">
          {p.notion_url && <a className="btn btn-sm" href={p.notion_url} target="_blank" rel="noreferrer"><Link2 size={13} />Notion</a>}
          <button className="btn btn-sm" onClick={() => setCsvOpen(true)}><Download size={13} />レポート出力</button>
          <Badge cls={PJ_BADGE[p.status]} dot>{PJST[p.status]}</Badge>
        </div>} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="総予算" value={fmtYen(p.budget)} unit="" mono />
        <StatCard label="未配分予算" value={fmtYen(st.remain)} unit="" mono warn={st.remain < 0} />
        <StatCard label="予算消化 (稼働按分)" value={Math.round(st.consumedRate * 100) + "%"} unit="" mono />
        <StatCard label="タスク進捗" value={`${st.done}/${st.total}`} unit="完了" mono />
      </div>
      <div className="flex gap-1 mb-4" style={{ borderBottom: "3px double var(--border)", overflowX: "auto" }}>
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setCurTab(k)} className="px-4 py-2 text-sm font-medium"
            style={{ background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap",
              color: curTab === k ? "var(--ai)" : "var(--muted)", fontWeight: curTab === k ? 700 : 500,
              borderBottom: curTab === k ? "2px solid var(--ai)" : "2px solid transparent", marginBottom: -3 }}>
            {l}
          </button>
        ))}
      </div>
      {curTab === "tasks" && <TasksTab p={p} />}
      {curTab === "members" && <MembersTab p={p} />}
      {curTab === "budget" && <BudgetTab p={p} />}
      {curTab === "settings" && <SettingsTab p={p} />}
      {csvOpen && <CSVModal p={p} onClose={() => setCsvOpen(false)} />}
    </div>
  );
}

/* ---------- タスク一覧タブ ---------- */
function TasksTab({ p }) {
  const { db } = useApp();
  const [q, setQ] = useState(""); const [stF, setStF] = useState("all"); const [asF, setAsF] = useState("all");
  const [sort, setSort] = useState({ key: "deadline", dir: 1 });
  const [form, setForm] = useState(null); // {} new | task edit
  const [llmOpen, setLlmOpen] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const tasks = db.tasks.filter((t) => t.project_id === p.id);
  const uname = (idv) => { const u = db.users.find((x) => x.id === idv); return u ? u.name : "未割当"; };
  const prOrder = { high: 0, medium: 1, low: 2 };
  const rows = useMemo(() => {
    let list = tasks.map((t) => {
      const worked = workedMin(db.worklogs, t.id);
      const ratio = taskRatio(t, worked);
      return { t, worked, ratio, remain: (t.budget || 0) * (1 - ratio), warn90: t.status !== "done" && t.max_minutes > 0 && worked >= t.max_minutes * 0.9 };
    });
    const s = q.trim().toLowerCase();
    if (s) list = list.filter((r) => (r.t.title + (r.t.description || "")).toLowerCase().includes(s));
    if (stF !== "all") list = list.filter((r) => r.t.status === stF);
    if (asF !== "all") list = list.filter((r) => asF === "none" ? !r.t.assigned_user_id : r.t.assigned_user_id === asF);
    const k = sort.key, d = sort.dir;
    list.sort((a, b) => {
      const va = k === "worked" ? a.worked : k === "remain" ? a.remain : k === "priority" ? prOrder[a.t.priority] : k === "assignee" ? uname(a.t.assigned_user_id) : (a.t[k] ?? "");
      const vb = k === "worked" ? b.worked : k === "remain" ? b.remain : k === "priority" ? prOrder[b.t.priority] : k === "assignee" ? uname(b.t.assigned_user_id) : (b.t[k] ?? "");
      if (va < vb) return -d; if (va > vb) return d; return 0;
    });
    return list;
  }, [tasks, db.worklogs, q, stF, asF, sort, db.users]);
  const th = (key, label) => (
    <th className="sort" onClick={() => setSort((s2) => ({ key, dir: s2.key === key ? -s2.dir : 1 }))}>
      {label}{sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : ""}
    </th>
  );
  const assignees = [...new Set(tasks.map((t) => t.assigned_user_id).filter(Boolean))].map((idv) => db.users.find((u) => u.id === idv)).filter(Boolean);
  return (
    <div>
      <div className="flex gap-2 flex-wrap items-center mb-3">
        <div className="relative" style={{ width: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "var(--muted)" }} />
          <input className="input" style={{ paddingLeft: 30 }} placeholder="タスク検索" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="select" style={{ width: "auto" }} value={stF} onChange={(e) => setStF(e.target.value)}>
          <option value="all">全ステータス</option><option value="todo">未着手</option><option value="in_progress">進行中</option><option value="done">完了</option>
        </select>
        <select className="select" style={{ width: "auto" }} value={asF} onChange={(e) => setAsF(e.target.value)}>
          <option value="all">全担当</option><option value="none">未割当</option>
          {assignees.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <div className="flex-1" />
        <button className="btn" onClick={() => setLlmOpen(true)}><Sparkles size={14} />LLMと相談して作成</button>
        <button className="btn btn-p" onClick={() => setForm({})}><Plus size={14} />新規タスク</button>
      </div>
      <div className="panel" style={{ overflowX: "auto" }}>
        <table className="tbl" style={{ minWidth: 880 }}>
          <thead><tr>
            <th>#</th>{th("title", "タスク名")}{th("assignee", "担当")}{th("priority", "優先度")}{th("budget", "予算")}
            {th("max_minutes", "稼働上限")}{th("deadline", "期日")}{th("status", "ステータス")}{th("worked", "稼働済")}{th("remain", "残予算")}
          </tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.t.id} className={"click" + (r.warn90 ? " warn90" : "")} onClick={() => setOpenTask(r.t)}>
                <td className="num" style={{ color: "var(--muted)" }}>{i + 1}</td>
                <td className="font-medium">
                  <span className="flex items-center gap-2">
                    {r.warn90 && <AlertTriangle size={13} style={{ color: r.worked >= r.t.max_minutes ? "var(--red)" : "var(--amber)", flexShrink: 0 }} />}
                    {r.t.title}
                  </span>
                </td>
                <td>{r.t.assigned_user_id ? <span className="flex items-center gap-2"><Avatar user={db.users.find((u) => u.id === r.t.assigned_user_id)} size={20} />{uname(r.t.assigned_user_id)}</span> : <Badge cls="b-slate">未割当</Badge>}</td>
                <td><Badge cls={PR_BADGE[r.t.priority]}>{PR[r.t.priority]}</Badge></td>
                <td className="num">{fmtYen(r.t.budget)}</td>
                <td className="num">{fmtHM(r.t.max_minutes)}</td>
                <td className="num" style={r.t.status !== "done" && daysUntil(r.t.deadline) < 0 ? { color: "var(--red)", fontWeight: 700 } : {}}>{r.t.deadline || "—"}</td>
                <td><Badge cls={ST_BADGE[r.t.status]} dot>{ST[r.t.status]}</Badge></td>
                <td className="num">{fmtHM(r.worked)}</td>
                <td className="num">{fmtYen(r.remain)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={10}><Empty icon={ClipboardList} text="タスクがありません" /></td></tr>}
          </tbody>
        </table>
      </div>
      {form !== null && <TaskForm p={p} initial={form.id ? form : null} onClose={() => setForm(null)} />}
      {llmOpen && <LLMModal p={p} onClose={() => setLlmOpen(false)} />}
      {openTask && <PMTaskModal taskId={openTask.id} onEdit={(t) => { setOpenTask(null); setForm(t); }} onClose={() => setOpenTask(null)} />}
    </div>
  );
}

/* ---------- タスク作成/編集フォーム ---------- */
function TaskForm({ p, initial, onClose }) {
  const { db, mutate, toast, notifyUsers } = useApp();
  const [f, setF] = useState(initial
    ? { ...initial, maxH: Math.floor((initial.max_minutes || 0) / 60), maxM: (initial.max_minutes || 0) % 60 }
    : { title: "", description: "", goal: "", assigned_user_id: "", priority: "medium", budget: "", maxH: "", maxM: "", deadline: "", status: "todo" });
  const [errs, setErrs] = useState({});
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const st = projectStats(p, db.tasks.filter((t) => !initial || t.id !== initial.id), db.worklogs);
  const budgetOver = Number(f.budget) > 0 && Number(f.budget) > st.remain;
  const deadlineOver = f.deadline && p.end_date && f.deadline > p.end_date;
  const candidates = db.users.filter((u) => (p.member_ids || []).includes(u.id) || u.id === f.assigned_user_id);
  async function submit() {
    const e = {};
    if (!f.title.trim()) e.title = "タスク名は必須です";
    if (!f.goal.trim()) e.goal = "目標・ノルマは必須です";
    if (!(Number(f.budget) >= 0) || f.budget === "") e.budget = "予算(円)を入力してください";
    const mm = (Number(f.maxH) || 0) * 60 + (Number(f.maxM) || 0);
    if (mm <= 0) e.maxH = "稼働時間上限を入力してください";
    if (!f.deadline) e.deadline = "期日は必須です";
    setErrs(e); if (Object.keys(e).length) return;
    const base = { title: f.title.trim(), description: f.description, goal: f.goal.trim(), assigned_user_id: f.assigned_user_id || null, priority: f.priority, budget: Number(f.budget), max_minutes: mm, deadline: f.deadline };
    if (initial) {
      await mutate("tasks", (list) => list.map((t) => t.id === initial.id ? { ...t, ...base, status: f.status, completed_at: f.status === "done" ? (t.completed_at || Date.now()) : null } : t));
      if (base.assigned_user_id && base.assigned_user_id !== initial.assigned_user_id)
        await notifyUsers([base.assigned_user_id], "assign", `タスク「${base.title}」が割り当てられました (${p.name})`, { email: true });
      toast("タスクを更新しました");
    } else {
      await mutate("tasks", (list) => [{ ...base, id: uid(), project_id: p.id, status: "todo", created_at: Date.now() }, ...list]);
      if (base.assigned_user_id) await notifyUsers([base.assigned_user_id], "assign", `タスク「${base.title}」が割り当てられました (${p.name})`, { email: true });
      toast("タスクを作成しました");
    }
    onClose();
  }
  return (
    <Modal open onClose={onClose} title={initial ? "タスクを編集" : "新規タスク"}>
      {budgetOver && <div className="flex items-center gap-2 p-3 rounded-lg text-sm mb-3" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}><AlertTriangle size={15} />タスク予算の合計がプロジェクト予算を超過します (未配分: {fmtYen(st.remain)})。作成は可能ですが確認してください。</div>}
      {deadlineOver && <div className="flex items-center gap-2 p-3 rounded-lg text-sm mb-3" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}><AlertTriangle size={15} />期日がプロジェクト終了日 ({p.end_date}) を超えています。</div>}
      <Field label="タスク名 *" error={errs.title}><input className="input" value={f.title} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="説明 (Markdown可)"><textarea className="textarea" value={f.description || ""} onChange={(e) => set("description", e.target.value)} /></Field>
      <Field label="目標・ノルマ * (Memberに表示される具体的なゴール)" error={errs.goal}><textarea className="textarea" style={{ minHeight: 60 }} value={f.goal} onChange={(e) => set("goal", e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="担当メンバー">
          <select className="select" value={f.assigned_user_id || ""} onChange={(e) => set("assigned_user_id", e.target.value)}>
            <option value="">未割当</option>
            {candidates.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </Field>
        <Field label="優先度">
          <select className="select" value={f.priority} onChange={(e) => set("priority", e.target.value)}>
            <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
          </select>
        </Field>
        <Field label="予算 (円) *" error={errs.budget}><input type="number" className="input num" value={f.budget} onChange={(e) => set("budget", e.target.value)} /></Field>
        <Field label="期日 *" error={errs.deadline}><input type="date" className="input" value={f.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
        <Field label="稼働時間上限 *" error={errs.maxH}>
          <div className="flex items-center gap-2">
            <input type="number" min="0" className="input num" style={{ width: 80 }} value={f.maxH} onChange={(e) => set("maxH", e.target.value)} /><span className="text-xs">時間</span>
            <input type="number" min="0" max="59" className="input num" style={{ width: 70 }} value={f.maxM} onChange={(e) => set("maxM", e.target.value)} /><span className="text-xs">分</span>
          </div>
        </Field>
        {initial && <Field label="ステータス">
          <select className="select" value={f.status} onChange={(e) => set("status", e.target.value)}>
            <option value="todo">未着手</option><option value="in_progress">進行中</option><option value="done">完了</option>
          </select>
        </Field>}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn btn-p" onClick={submit}>{initial ? "保存する" : "作成する"}</button>
      </div>
    </Modal>
  );
}

/* ---------- PM用タスク詳細モーダル ---------- */
function PMTaskModal({ taskId, onEdit, onClose }) {
  const { db, mutate, ask, toast } = useApp();
  const t = db.tasks.find((x) => x.id === taskId);
  if (!t) return null;
  const p = db.projects.find((x) => x.id === t.project_id);
  const logs = db.worklogs.filter((l) => l.task_id === t.id).sort((a, b) => b.started_at - a.started_at);
  const worked = workedMin(db.worklogs, t.id);
  const assignee = db.users.find((u) => u.id === t.assigned_user_id);
  async function del() {
    if (!(await ask(`タスク「${t.title}」を削除しますか？稼働ログ・コメントも削除されます。`))) return;
    await mutate("tasks", (list) => list.filter((x) => x.id !== t.id));
    await mutate("worklogs", (list) => list.filter((x) => x.task_id !== t.id));
    await mutate("comments", (list) => list.filter((x) => x.task_id !== t.id));
    await mutate("requests", (list) => list.filter((x) => x.task_id !== t.id));
    toast("タスクを削除しました"); onClose();
  }
  return (
    <Modal open onClose={onClose} title="タスク詳細" wide>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div>
          <div className="text-lg font-bold">{t.title}</div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>{p ? p.name : ""}</div>
        </div>
        <div className="flex gap-2 items-center">
          <Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge>
          <Badge cls={ST_BADGE[t.status]} dot>{ST[t.status]}</Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <MiniStat label="担当" value={assignee ? assignee.name : "未割当"} />
        <MiniStat label="期日" value={t.deadline || "—"} />
        <MiniStat label="稼働 / 上限" value={`${fmtHM(worked)} / ${fmtHM(t.max_minutes)}`} mono warn={t.max_minutes > 0 && worked >= t.max_minutes * 0.9} />
        <MiniStat label="予算" value={fmtYen(t.budget)} mono />
      </div>
      <Prog ratio={t.max_minutes > 0 ? worked / t.max_minutes : 0} />
      {t.description && <div className="mt-4"><div className="lbl">説明</div><div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{t.description}</div></div>}
      <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--ai-soft)" }}>
        <div className="lbl" style={{ color: "var(--ai)" }}>目標・ノルマ</div>
        <div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{t.goal || "—"}</div>
      </div>
      {t.completion_comment && <div className="mt-3 p-3 rounded-lg" style={{ background: "var(--green-bg)" }}>
        <div className="lbl" style={{ color: "var(--green)" }}>完了コメント ({t.completed_at ? fmtDT(t.completed_at) : ""})</div>
        <div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{t.completion_comment}</div>
      </div>}
      <div className="mt-4"><div className="lbl">稼働ログ ({logs.length}件)</div>
        {logs.length === 0 ? <div className="text-sm" style={{ color: "var(--muted)" }}>まだ稼働記録がありません</div> : (
          <div className="panel" style={{ maxHeight: 180, overflowY: "auto" }}>
            {logs.map((l) => { const u = db.users.find((x) => x.id === l.user_id); return (
              <div key={l.id} className="flex items-center gap-3 px-3 py-2 text-sm" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-xs mono" style={{ color: "var(--muted)", width: 88, flexShrink: 0 }}>{fmtDT(l.started_at)}</span>
                <span className="mono font-medium" style={{ width: 56 }}>{fmtHM(l.duration_min)}</span>
                <span className="text-xs" style={{ width: 72, flexShrink: 0 }}>{u ? u.name : "?"}</span>
                <span className="text-xs flex-1 truncate" style={{ color: "var(--muted)" }}>{l.note}</span>
              </div>); })}
          </div>
        )}
      </div>
      <CommentThread task={t} />
      <div className="flex justify-between gap-2 mt-5">
        <button className="btn btn-d" onClick={del}><Trash2 size={14} />削除</button>
        <div className="flex gap-2">
          <button className="btn" onClick={onClose}>閉じる</button>
          <button className="btn btn-p" onClick={() => onEdit(t)}><Edit2 size={14} />編集</button>
        </div>
      </div>
    </Modal>
  );
}
function MiniStat({ label, value, mono, warn }) {
  return (
    <div className="panel p-3" style={{ background: "var(--panel2)", border: "none" }}>
      <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{label}</div>
      <div className={"text-sm font-bold" + (mono ? " mono" : "")} style={warn ? { color: "var(--amber)" } : {}}>{value}</div>
    </div>
  );
}

/* ---------- コメント (PM/Member共通・@メンション対応) ---------- */
function CommentThread({ task }) {
  const { db, user, mutate, notifyUsers, toast } = useApp();
  const [text, setText] = useState("");
  const comments = db.comments.filter((c) => c.task_id === task.id).sort((a, b) => a.created_at - b.created_at);
  async function send() {
    const body = text.trim(); if (!body) return;
    await mutate("comments", (list) => [...list, { id: uid(), task_id: task.id, user_id: user.id, text: body.slice(0, 500), created_at: Date.now() }]);
    const mentioned = db.users.filter((u) => u.id !== user.id && (body.includes("@" + u.name.replace(/\s+/g, "")) || body.includes("@" + u.name)));
    const targets = new Set(mentioned.filter((u) => u.id !== user.id).map((u) => u.id));
    if (task.assigned_user_id && task.assigned_user_id !== user.id) targets.add(task.assigned_user_id);
    if (user.role !== "PM") db.users.filter((u) => u.role === "PM").forEach((u) => targets.add(u.id));
    await notifyUsers([...targets], "mention", `${user.name} が「${task.title}」にコメントしました: ${body.slice(0, 40)}${body.length > 40 ? "…" : ""}`);
    setText(""); toast("コメントを送信しました");
  }
  return (
    <div className="mt-4">
      <div className="lbl">コメント ({comments.length})</div>
      {comments.length > 0 && (
        <div className="flex flex-col gap-2 mb-2" style={{ maxHeight: 200, overflowY: "auto" }}>
          {comments.map((c) => { const u = db.users.find((x) => x.id === c.user_id); return (
            <div key={c.id} className="flex gap-2">
              <Avatar user={u} size={24} />
              <div className="panel px-3 py-2 flex-1" style={{ background: "var(--panel2)", border: "none" }}>
                <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{u ? u.name : "?"} · {fmtDT(c.created_at)}</div>
                <div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{c.text}</div>
              </div>
            </div>); })}
        </div>
      )}
      <div className="flex gap-2">
        <input className="input" placeholder="コメントを追加 (@名前 でメンション)" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
        <button className="btn btn-p" onClick={send} aria-label="送信"><Send size={14} /></button>
      </div>
    </div>
  );
}

/* ---------- LLM一括タスク作成 ---------- */
const LLM_JSON_SPEC = `[
  {
    "title": "タスク名",
    "description": "詳細説明",
    "goal": "目標・ノルマ",
    "assigned_member": "メンバー名またはメールアドレス(不明なら空文字)",
    "priority": "high|medium|low",
    "budget": 50000,
    "max_hours": 20,
    "deadline": "YYYY-MM-DD"
  }
]`;
function matchMember(s, users) {
  if (!s) return null;
  const q = String(s).trim().toLowerCase(); if (!q) return null;
  return users.find((x) => x.email.toLowerCase() === q)
    || users.find((x) => x.name.toLowerCase() === q)
    || users.find((x) => x.name.toLowerCase().replace(/\s+/g, "") === q.replace(/\s+/g, ""))
    || users.find((x) => x.name.toLowerCase().includes(q)) || null;
}
function LLMModal({ p, onClose }) {
  const { db, mutate, toast, notifyUsers } = useApp();
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [err, setErr] = useState("");
  const chatEnd = useRef(null);
  const candidates = db.users.filter((u) => (p.member_ids || []).includes(u.id));
  const st = projectStats(p, db.tasks, db.worklogs);
  useEffect(() => { chatEnd.current && chatEnd.current.scrollIntoView({ behavior: "smooth" }); }, [chat, loading]);

  const sysPrompt = () => `あなたはプロジェクトマネジメント支援AIです。ユーザーの依頼に基づき、以下のプロジェクトのタスク案を設計してください。
出力は必ず次のJSON配列【のみ】で返すこと。説明文・前置き・コードブロック記法は一切不要:
${LLM_JSON_SPEC}
制約:
- assigned_memberは下記メンバー一覧の名前かメールアドレスに限る。適任者が不明なら空文字。
- deadlineはプロジェクト終了日(${p.end_date || "未設定"})以内、今日(${todayStr()})以降。
- budgetの合計は未配分予算 ${Math.max(0, st.remain)}円 を目安に収める。
[プロジェクト] ${p.name}: ${p.description}
[メンバー一覧] ${candidates.map((u) => `${u.name} (${u.email})`).join(", ") || "なし"}`;

  function normalize(arr) {
    return (Array.isArray(arr) ? arr : []).map((r) => {
      const m = matchMember(r.assigned_member, candidates);
      return {
        _k: uid(), title: String(r.title || "").slice(0, 100), description: String(r.description || ""),
        goal: String(r.goal || ""), assigned_user_id: m ? m.id : "",
        unmatched: !!(r.assigned_member && String(r.assigned_member).trim() && !m),
        priority: ["high", "medium", "low"].includes(r.priority) ? r.priority : "medium",
        budget: Math.max(0, Number(r.budget) || 0), max_hours: Math.max(0, Number(r.max_hours) || 0),
        deadline: /^\d{4}-\d{2}-\d{2}$/.test(String(r.deadline || "")) ? r.deadline : "",
      };
    }).filter((r) => r.title);
  }
  async function send() {
    const msg = input.trim(); if (!msg || loading) return;
    setErr(""); setInput("");
    const nextChat = [...chat, { role: "user", content: msg }];
    setChat(nextChat); setLoading(true);
    try {
      const apiMessages = [
        { role: "user", content: sysPrompt() },
        { role: "assistant", content: "了解しました。依頼内容に応じてJSON配列のみで回答します。" },
        ...nextChat,
      ];
      const data = await callClaude(apiMessages, { max_tokens: 1000 });
      const text = textOf(data);
      setChat((c) => [...c, { role: "assistant", content: text }]);
      try {
        const rows = normalize(parseJsonArray(text));
        if (rows.length) setPreview(rows);
        else setErr("タスクを抽出できませんでした。依頼を具体的にするか、件数を減らして再度お試しください。");
      } catch (e2) {
        setErr("JSONの解析に失敗しました。「JSONだけで返して」と伝えるか、件数を減らしてください。");
      }
    } catch (e) { setErr(e.message || "APIエラーが発生しました"); }
    setLoading(false);
  }
  function importPaste() {
    setErr("");
    try {
      const rows = normalize(parseJsonArray(pasteText));
      if (!rows.length) { setErr("有効なタスクが見つかりませんでした"); return; }
      setPreview(rows); setPasteMode(false);
    } catch (e) { setErr("JSONの解析に失敗しました。フォーマットを確認してください。"); }
  }
  const setRow = (k, key, v) => setPreview((list) => list.map((r) => r._k === k ? { ...r, [key]: v, unmatched: key === "assigned_user_id" ? false : r.unmatched } : r));
  const budgetSum = preview.reduce((a, r) => a + r.budget, 0);
  const budgetWarn = budgetSum > st.remain;
  async function bulkCreate() {
    const bad = preview.find((r) => !r.title.trim());
    if (bad) { setErr("タスク名が空の行があります"); return; }
    const created = preview.map((r) => ({
      id: uid(), project_id: p.id, title: r.title.trim(), description: r.description, goal: r.goal,
      assigned_user_id: r.assigned_user_id || null, budget: r.budget, max_minutes: Math.round(r.max_hours * 60),
      deadline: r.deadline || p.end_date || todayStr(), status: "todo", priority: r.priority, created_at: Date.now(),
    }));
    await mutate("tasks", (list) => [...created, ...list]);
    const byUser = {};
    created.forEach((t) => { if (t.assigned_user_id) (byUser[t.assigned_user_id] = byUser[t.assigned_user_id] || []).push(t.title); });
    for (const [uidTo, titles] of Object.entries(byUser)) {
      await notifyUsers([uidTo], "assign", `${titles.length}件のタスクが割り当てられました: ${titles.slice(0, 2).join("、")}${titles.length > 2 ? " ほか" : ""} (${p.name})`, { email: true });
    }
    toast(`${created.length}件のタスクを作成しました`); onClose();
  }
  return (
    <Modal open onClose={onClose} title="LLMと相談して一括作成" wide>
      <div className="flex gap-2 mb-3">
        <button className={"chip" + (!pasteMode ? " on" : "")} onClick={() => setPasteMode(false)}><Sparkles size={13} />チャットで生成</button>
        <button className={"chip" + (pasteMode ? " on" : "")} onClick={() => setPasteMode(true)}><Copy size={13} />JSONを貼り付け</button>
      </div>
      {!pasteMode ? (
        <div>
          <div className="panel p-3 mb-2" style={{ height: 220, overflowY: "auto", background: "var(--panel2)", border: "none" }}>
            {chat.length === 0 && <div className="text-sm" style={{ color: "var(--muted)" }}>例: 「{p.name}のための開発タスクを5件作って」「テスト系のタスクを3件、優先度高めで」</div>}
            {chat.map((m, i) => (
              <div key={i} className={"flex mb-2 " + (m.role === "user" ? "justify-end" : "justify-start")}>
                <div className="px-3 py-2 rounded-xl text-sm" style={{ maxWidth: "85%", whiteSpace: "pre-wrap", wordBreak: "break-word",
                  background: m.role === "user" ? "var(--ai)" : "var(--panel)", color: m.role === "user" ? "#fff" : "var(--text)",
                  fontFamily: m.role === "assistant" ? "monospace" : "inherit", fontSize: m.role === "assistant" ? 11 : 13 }}>
                  {m.role === "assistant" && m.content.length > 400 ? m.content.slice(0, 400) + " …(下のプレビューに反映済み)" : m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm" style={{ color: "var(--muted)" }}>Claudeが考えています…</div>}
            <div ref={chatEnd} />
          </div>
          <div className="flex gap-2">
            <input className="input" placeholder="どんなタスクを作りますか？" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} disabled={loading} />
            <button className="btn btn-p" onClick={send} disabled={loading}><Send size={14} /></button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>規定フォーマット(JSON配列)を貼り付けてください。外部のLLMで生成したものも取り込めます。</div>
          <textarea className="textarea mono" style={{ minHeight: 160, fontFamily: "monospace", fontSize: 12 }} placeholder={LLM_JSON_SPEC} value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
          <div className="flex justify-end mt-2"><button className="btn btn-p" onClick={importPaste}>読み込んでプレビュー</button></div>
        </div>
      )}
      {err && <div className="err mt-2">{err}</div>}
      {preview.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-bold">プレビュー ({preview.length}件) — 修正できます</div>
            <div className="text-xs mono" style={{ color: budgetWarn ? "var(--amber)" : "var(--muted)" }}>予算合計 {fmtYen(budgetSum)} / 未配分 {fmtYen(st.remain)}</div>
          </div>
          {budgetWarn && <div className="flex items-center gap-2 p-2 rounded-lg text-xs mb-2" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}><AlertTriangle size={13} />予算合計が未配分額を超えています(作成は可能)</div>}
          <div className="panel" style={{ overflowX: "auto", maxHeight: 300, overflowY: "auto" }}>
            <table className="tbl" style={{ minWidth: 780 }}>
              <thead><tr><th>タスク名</th><th>担当</th><th>優先度</th><th>予算</th><th>上限(h)</th><th>期日</th><th /></tr></thead>
              <tbody>
                {preview.map((r) => (
                  <tr key={r._k}>
                    <td style={{ minWidth: 180 }}>
                      <input className="input" style={{ padding: "4px 8px", fontSize: 12 }} value={r.title} onChange={(e) => setRow(r._k, "title", e.target.value)} />
                      {r.goal && <div className="text-xs mt-1 truncate" style={{ color: "var(--muted)", maxWidth: 220 }} title={r.goal}>目標: {r.goal}</div>}
                    </td>
                    <td>
                      <select className="select" style={{ padding: "4px 8px", fontSize: 12, borderColor: r.unmatched ? "var(--amber)" : undefined }} value={r.assigned_user_id} onChange={(e) => setRow(r._k, "assigned_user_id", e.target.value)}>
                        <option value="">未割当</option>
                        {candidates.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                      {r.unmatched && <div className="text-xs" style={{ color: "var(--amber)" }}>照合できず</div>}
                    </td>
                    <td>
                      <select className="select" style={{ padding: "4px 8px", fontSize: 12 }} value={r.priority} onChange={(e) => setRow(r._k, "priority", e.target.value)}>
                        <option value="high">高</option><option value="medium">中</option><option value="low">低</option>
                      </select>
                    </td>
                    <td><input type="number" className="input num" style={{ padding: "4px 8px", fontSize: 12, width: 90 }} value={r.budget} onChange={(e) => setRow(r._k, "budget", Number(e.target.value) || 0)} /></td>
                    <td><input type="number" className="input num" style={{ padding: "4px 8px", fontSize: 12, width: 64 }} value={r.max_hours} onChange={(e) => setRow(r._k, "max_hours", Number(e.target.value) || 0)} /></td>
                    <td><input type="date" className="input" style={{ padding: "4px 6px", fontSize: 12, borderColor: r.deadline && p.end_date && r.deadline > p.end_date ? "var(--amber)" : undefined }} value={r.deadline} onChange={(e) => setRow(r._k, "deadline", e.target.value)} /></td>
                    <td><button className="iconbtn" style={{ width: 28, height: 28 }} onClick={() => setPreview((l) => l.filter((x) => x._k !== r._k))}><Trash2 size={13} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button className="btn" onClick={() => setPreview([])}>クリア</button>
            <button className="btn btn-p" onClick={bulkCreate}><Check size={14} />一括作成 ({preview.length}件)</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ---------- メンバー稼働タブ ---------- */
function MembersTab({ p }) {
  const { db } = useApp();
  const [range, setRange] = useState("week");
  const [rS, rE] = range === "week" ? weekRange() : monthRange();
  const pTasks = db.tasks.filter((t) => t.project_id === p.id);
  const pTaskIds = new Set(pTasks.map((t) => t.id));
  const members = (p.member_ids || []).map((id) => db.users.find((u) => u.id === id)).filter(Boolean);
  const data = members.map((u) => {
    const min = db.worklogs.filter((l) => l.user_id === u.id && pTaskIds.has(l.task_id) && l.started_at >= rS && l.started_at < rE).reduce((a, l) => a + l.duration_min, 0);
    return { name: u.name, hours: Math.round((min / 60) * 10) / 10 };
  });
  const stats = members.map((u) => {
    const mine = pTasks.filter((t) => t.assigned_user_id === u.id);
    const done = mine.filter((t) => t.status === "done").length;
    const sumMax = mine.reduce((a, t) => a + (t.max_minutes || 0), 0);
    const sumWorked = mine.reduce((a, t) => a + workedMin(db.worklogs, t.id), 0);
    return { u, count: mine.length, done, rate: sumMax > 0 ? sumWorked / sumMax : 0, worked: sumWorked };
  });
  const alerts = pTasks.filter((t) => t.status !== "done" && t.max_minutes > 0 && workedMin(db.worklogs, t.id) >= t.max_minutes * 0.9);
  return (
    <div className="flex flex-col gap-4">
      <div className="panel p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <SecTitle icon={Clock} title="メンバー稼働時間" />
          <Seg value={range} onChange={setRange} options={[{ value: "week", label: "今週" }, { value: "month", label: "今月" }]} />
        </div>
        {members.length === 0 ? <Empty icon={Users} text="このプロジェクトにメンバーがいません" /> : (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#8b8f98" }} axisLine={{ stroke: "#8b8f9855" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#8b8f98" }} axisLine={false} tickLine={false} unit="h" />
                <RTooltip cursor={{ fill: "rgba(139,143,152,0.08)" }} formatter={(v) => [v + " h", "稼働"]}
                  contentStyle={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--text)" }} />
                <Bar dataKey="hours" fill="var(--ai)" radius={[5, 5, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="panel" style={{ overflowX: "auto" }}>
        <table className="tbl" style={{ minWidth: 560 }}>
          <thead><tr><th>メンバー</th><th>担当タスク</th><th>完了</th><th>累計稼働</th><th>上限到達率</th></tr></thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.u.id}>
                <td><span className="flex items-center gap-2"><Avatar user={s.u} size={22} />{s.u.name}</span></td>
                <td className="num">{s.count}</td><td className="num">{s.done}</td>
                <td className="num">{fmtHM(s.worked)}</td>
                <td style={{ minWidth: 140 }}>
                  <div className="flex items-center gap-2"><div className="flex-1"><Prog ratio={s.rate} /></div><span className="text-xs mono" style={{ width: 36 }}>{Math.round(s.rate * 100)}%</span></div>
                </td>
              </tr>
            ))}
            {stats.length === 0 && <tr><td colSpan={5}><Empty icon={Users} text="データがありません" /></td></tr>}
          </tbody>
        </table>
      </div>
      {alerts.length > 0 && (
        <div className="panel p-4">
          <SecTitle icon={AlertTriangle} title="90%超過アラート" tone="var(--amber)" />
          <div className="flex flex-col gap-2">
            {alerts.map((t) => {
              const w = workedMin(db.worklogs, t.id); const u = db.users.find((x) => x.id === t.assigned_user_id);
              return <AlertRow key={t.id} tone={w >= t.max_minutes ? "red" : "amber"} text={`「${t.title}」 ${u ? u.name : "未割当"} — ${fmtHM(w)} / ${fmtHM(t.max_minutes)}`} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 予算管理タブ ---------- */
function BudgetTab({ p }) {
  const { db } = useApp();
  const st = projectStats(p, db.tasks, db.worklogs);
  const rows = db.tasks.filter((t) => t.project_id === p.id).map((t) => {
    const worked = workedMin(db.worklogs, t.id); const ratio = taskRatio(t, worked);
    return { t, worked, ratio, consumed: (t.budget || 0) * ratio, risk: t.status !== "done" && t.max_minutes > 0 && worked >= t.max_minutes * 0.9 };
  }).sort((a, b) => b.t.budget - a.t.budget);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="総予算" value={fmtYen(p.budget)} unit="" mono />
        <StatCard label="配分済み" value={fmtYen(st.alloc)} unit="" mono warn={st.alloc > p.budget} />
        <StatCard label="消化額 (稼働按分)" value={fmtYen(st.consumed)} unit="" mono />
        <StatCard label="残額 (総予算-消化)" value={fmtYen(p.budget - st.consumed)} unit="" mono />
      </div>
      {st.alloc > p.budget && <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ background: "var(--amber-bg)", color: "var(--amber)" }}><AlertTriangle size={15} />タスク予算の合計 ({fmtYen(st.alloc)}) がプロジェクト総予算を超過しています。</div>}
      <div className="panel" style={{ overflowX: "auto" }}>
        <table className="tbl" style={{ minWidth: 640 }}>
          <thead><tr><th>タスク</th><th>予算</th><th>消化</th><th style={{ width: "30%" }}>消化状況</th><th>稼働</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.t.id} className={r.risk ? "warn90" : ""}>
                <td className="font-medium"><span className="flex items-center gap-2">{r.risk && <AlertTriangle size={13} style={{ color: "var(--amber)" }} />}{r.t.title}</span></td>
                <td className="num">{fmtYen(r.t.budget)}</td>
                <td className="num">{fmtYen(r.consumed)}</td>
                <td><div className="flex items-center gap-2"><div className="flex-1"><Prog ratio={r.ratio} /></div><span className="text-xs mono" style={{ width: 36 }}>{Math.round(r.ratio * 100)}%</span></div></td>
                <td className="num text-xs">{fmtHM(r.worked)} / {fmtHM(r.t.max_minutes)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5}><Empty icon={ClipboardList} text="タスクがありません" /></td></tr>}
          </tbody>
        </table>
      </div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>※ 消化額 = タスク予算 × 進捗率(完了=100%、それ以外は稼働時間÷上限)で算出しています。</div>
    </div>
  );
}

/* ---------- 設定タブ (編集・Notion連携・削除) ---------- */
function SettingsTab({ p }) {
  const { db, mutate, toast, ask, nav } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [notionBusy, setNotionBusy] = useState(false);
  const [notionErr, setNotionErr] = useState("");
  const [fetched, setFetched] = useState(null); // {name, description, status, budget}
  const [apply, setApply] = useState({ name: false, description: true, status: false, budget: false });
  async function syncNotion() {
    if (!p.notion_url) { setNotionErr("先に「編集」からNotionページURLを設定してください"); return; }
    setNotionBusy(true); setNotionErr(""); setFetched(null);
    try {
      const data = await callClaude([
        { role: "user", content: `Notionの以下のページ/データベースを読み取り、プロジェクト情報を抽出してください。
URL: ${p.notion_url}
出力は必ず次のJSONオブジェクト【のみ】(説明・コードブロック不要):
{"name":"プロジェクト名","description":"概要(200字以内)","status":"active|paused|completed","budget":数値または null}
statusは内容から推定(進行中=active、保留=paused、完了=completed)。読み取れない項目はnull。` },
      ], { mcp_servers: [{ type: "url", url: "https://mcp.notion.com/mcp", name: "notion" }], max_tokens: 1000 });
      const raw = textOf(data) + "\n" + toolResultsOf(data);
      const obj = parseJsonObject(textOf(data) || raw);
      setFetched(obj);
    } catch (e) {
      setNotionErr("Notionからの取得に失敗しました。URLの共有設定・Notionコネクタの接続を確認してください。(" + (e.message || e) + ")");
    }
    setNotionBusy(false);
  }
  async function applyFetched() {
    const upd = {};
    if (apply.name && fetched.name) upd.name = String(fetched.name);
    if (apply.description && fetched.description) upd.description = String(fetched.description);
    if (apply.status && ["active", "paused", "completed"].includes(fetched.status)) upd.status = fetched.status;
    if (apply.budget && Number(fetched.budget) > 0) upd.budget = Number(fetched.budget);
    await mutate("projects", (list) => list.map((x) => x.id === p.id ? { ...x, ...upd, last_synced: Date.now() } : x));
    setFetched(null); toast("Notionの情報を取り込みました");
  }
  async function delProject() {
    if (!(await ask(`プロジェクト「${p.name}」を削除しますか？タスク・稼働ログもすべて削除されます。`))) return;
    const taskIds = new Set(db.tasks.filter((t) => t.project_id === p.id).map((t) => t.id));
    await mutate("tasks", (list) => list.filter((t) => t.project_id !== p.id));
    await mutate("worklogs", (list) => list.filter((l) => !taskIds.has(l.task_id)));
    await mutate("comments", (list) => list.filter((c) => !taskIds.has(c.task_id)));
    await mutate("requests", (list) => list.filter((r) => !taskIds.has(r.task_id)));
    await mutate("projects", (list) => list.filter((x) => x.id !== p.id));
    toast("プロジェクトを削除しました"); nav("projects");
  }
  return (
    <div className="flex flex-col gap-4" style={{ maxWidth: 640 }}>
      <div className="panel p-4">
        <SecTitle icon={Settings} title="基本情報" />
        <div className="text-sm mb-1"><span className="lbl">説明</span>{p.description || "—"}</div>
        <button className="btn mt-2" onClick={() => setEditOpen(true)}><Edit2 size={14} />編集する</button>
      </div>
      <div className="panel p-4">
        <SecTitle icon={Link2} title="Notion連携" />
        {p.notion_url
          ? <div className="text-sm mb-2 truncate"><a href={p.notion_url} target="_blank" rel="noreferrer">{p.notion_url}</a></div>
          : <div className="text-sm mb-2" style={{ color: "var(--muted)" }}>NotionページURLが未設定です(「編集する」から設定)。「プロジェクト管理」「営業管理」のページに対応しています。</div>}
        {p.last_synced && <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>最終同期: {fmtDT(p.last_synced)}</div>}
        <div className="text-xs mb-3" style={{ color: "var(--muted)" }}>同期は手動です。競合時はプレビューで選んだ項目のみ取り込みます(既定はアプリ側の値を優先)。</div>
        <button className="btn" disabled={notionBusy} onClick={syncNotion}><RefreshCw size={14} className={notionBusy ? "animate-spin" : ""} />{notionBusy ? "取得中…" : "Notionと同期"}</button>
        {notionErr && <div className="err mt-2">{notionErr}</div>}
        {fetched && (
          <div className="panel p-3 mt-3" style={{ background: "var(--panel2)", border: "none" }}>
            <div className="text-xs font-bold mb-2">取得結果 — 取り込む項目を選択</div>
            {[["name", "名前", fetched.name], ["description", "説明", fetched.description], ["status", "ステータス", fetched.status && PJST[fetched.status]], ["budget", "予算", fetched.budget != null ? fmtYen(fetched.budget) : null]].map(([k, l, v]) => (
              <label key={k} className="flex items-start gap-2 text-sm py-1 cursor-pointer" style={{ opacity: v ? 1 : 0.4 }}>
                <input type="checkbox" disabled={!v} checked={!!apply[k] && !!v} onChange={(e) => setApply((a) => ({ ...a, [k]: e.target.checked }))} style={{ marginTop: 4 }} />
                <span><b>{l}:</b> {v || "取得できず"}</span>
              </label>
            ))}
            <div className="flex justify-end gap-2 mt-2">
              <button className="btn btn-sm" onClick={() => setFetched(null)}>破棄</button>
              <button className="btn btn-p btn-sm" onClick={applyFetched}>取り込む</button>
            </div>
          </div>
        )}
      </div>
      <div className="panel p-4" style={{ borderColor: "var(--red)" }}>
        <SecTitle icon={Trash2} title="危険な操作" tone="var(--red)" />
        <button className="btn btn-d" onClick={delProject}>プロジェクトを削除</button>
      </div>
      {editOpen && <ProjectForm initial={p} onClose={() => setEditOpen(false)} />}
    </div>
  );
}

/* ---------- レポート出力 (CSV) ---------- */
function CSVModal({ p, onClose }) {
  const { db, toast } = useApp();
  const [month, setMonth] = useState("all");
  const months = useMemo(() => {
    const s = new Set();
    db.worklogs.forEach((l) => { const d = new Date(l.started_at); s.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); });
    return [...s].sort().reverse();
  }, [db.worklogs]);
  const csv = useMemo(() => {
    const tasks = db.tasks.filter((t) => t.project_id === p.id);
    const inMonth = (ts) => { if (month === "all") return true; const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === month; };
    const rows = [["タスク名", "担当者", "ステータス", "優先度", "期日", "稼働時間(分)", "稼働上限(分)", "予算(円)", "消化額(円)", "完了日"]];
    tasks.forEach((t) => {
      const u = db.users.find((x) => x.id === t.assigned_user_id);
      const w = db.worklogs.filter((l) => l.task_id === t.id && inMonth(l.started_at)).reduce((a, l) => a + l.duration_min, 0);
      const allW = workedMin(db.worklogs, t.id);
      rows.push([t.title, u ? u.name : "未割当", ST[t.status], PR[t.priority], t.deadline || "", Math.round(w), t.max_minutes || 0, t.budget || 0, Math.round((t.budget || 0) * taskRatio(t, allW)), t.completed_at ? new Date(t.completed_at).toISOString().slice(0, 10) : ""]);
    });
    return toCSV(rows);
  }, [db, p, month]);
  function copy() { navigator.clipboard && navigator.clipboard.writeText(csv).then(() => toast("コピーしました")).catch(() => toast("コピーに失敗しました")); }
  function dl() { const ok = tryDownload(`report_${p.name}_${month}.csv`, csv); toast(ok ? "ダウンロードを開始しました" : "ダウンロード不可のためコピーをご利用ください"); }
  return (
    <Modal open onClose={onClose} title="稼働レポート出力 (CSV)">
      <Field label="対象期間">
        <select className="select" value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="all">全期間</option>
          {months.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </Field>
      <textarea className="textarea mono" readOnly style={{ minHeight: 180, fontFamily: "monospace", fontSize: 11 }} value={csv} />
      <div className="text-xs mt-1 mb-3" style={{ color: "var(--muted)" }}>Excel/スプレッドシートに貼り付けるか、CSVファイルとして保存できます。</div>
      <div className="flex justify-end gap-2">
        <button className="btn" onClick={copy}><Copy size={14} />コピー</button>
        <button className="btn btn-p" onClick={dl}><Download size={14} />ダウンロード</button>
      </div>
    </Modal>
  );
}

/* ============================================================
   PM: 申請管理 (割当申請・期日延長)
   ============================================================ */
function RequestsView() {
  const { db, mutate, notifyUsers, toast } = useApp();
  const [rejecting, setRejecting] = useState(null); // request id
  const [reason, setReason] = useState("");
  const pend = db.requests.filter((r) => r.status === "pending").sort((a, b) => b.requested_at - a.requested_at);
  const hist = db.requests.filter((r) => r.status !== "pending").sort((a, b) => b.requested_at - a.requested_at).slice(0, 10);
  const taskOf = (r) => db.tasks.find((t) => t.id === r.task_id);
  const userOf = (r) => db.users.find((u) => u.id === r.user_id);
  async function approve(r) {
    const t = taskOf(r); if (!t) { toast("対象タスクが見つかりません"); return; }
    if (r.type === "extend") {
      await mutate("tasks", (list) => list.map((x) => x.id === t.id ? { ...x, deadline: r.extend_to } : x));
      await mutate("requests", (list) => list.map((x) => x.id === r.id ? { ...x, status: "approved" } : x));
      await notifyUsers([r.user_id], "approve", `「${t.title}」の期日延長が承認されました (新期日: ${r.extend_to})`, { email: true });
    } else {
      await mutate("tasks", (list) => list.map((x) => x.id === t.id ? { ...x, assigned_user_id: r.user_id } : x));
      await mutate("requests", (list) => list.map((x) => {
        if (x.id === r.id) return { ...x, status: "approved" };
        if (x.type !== "extend" && x.task_id === t.id && x.status === "pending") return { ...x, status: "rejected", reject_reason: "他のメンバーに割り当てられました" };
        return x;
      }));
      await notifyUsers([r.user_id], "approve", `タスク「${t.title}」の割当申請が承認されました`, { email: true });
      const others = db.requests.filter((x) => x.type !== "extend" && x.task_id === t.id && x.status === "pending" && x.id !== r.id);
      for (const o of others) await notifyUsers([o.user_id], "reject", `タスク「${t.title}」の割当申請は見送られました (他のメンバーに割当)`);
    }
    toast("承認しました");
  }
  async function reject(r) {
    const t = taskOf(r);
    await mutate("requests", (list) => list.map((x) => x.id === r.id ? { ...x, status: "rejected", reject_reason: reason.trim() } : x));
    await notifyUsers([r.user_id], "reject", `${r.type === "extend" ? "期日延長申請" : "割当申請"}「${t ? t.title : "?"}」が却下されました${reason.trim() ? ": " + reason.trim() : ""}`, { email: true });
    setRejecting(null); setReason(""); toast("却下しました");
  }
  const ReqCard = ({ r }) => {
    const t = taskOf(r); const u = userOf(r);
    return (
      <div className="panel p-4">
        <div className="flex items-start gap-3 flex-wrap">
          <Avatar user={u} size={30} />
          <div className="flex-1" style={{ minWidth: 200 }}>
            <div className="text-sm font-bold">{t ? t.title : "(削除済みタスク)"}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              {u ? u.name : "?"} · {fmtDT(r.requested_at)}
              {r.type === "extend" && t && <> · 期日 {t.deadline} → <b style={{ color: "var(--ai)" }}>{r.extend_to}</b></>}
            </div>
            {r.reason && <div className="text-sm mt-1">理由: {r.reason}</div>}
          </div>
          <Badge cls={r.type === "extend" ? "b-amber" : "b-blue"}>{r.type === "extend" ? "期日延長" : "割当申請"}</Badge>
        </div>
        {rejecting === r.id ? (
          <div className="flex gap-2 mt-3">
            <input className="input" placeholder="却下理由 (任意)" value={reason} onChange={(e) => setReason(e.target.value)} />
            <button className="btn btn-d" onClick={() => reject(r)}>却下する</button>
            <button className="btn" onClick={() => { setRejecting(null); setReason(""); }}>戻る</button>
          </div>
        ) : (
          <div className="flex justify-end gap-2 mt-3">
            <button className="btn" onClick={() => { setRejecting(r.id); setReason(""); }}><X size={14} />却下</button>
            <button className="btn btn-p" onClick={() => approve(r)}><Check size={14} />承認</button>
          </div>
        )}
      </div>
    );
  };
  return (
    <div>
      <PageTitle title="申請管理" sub={`未処理 ${pend.length} 件`} />
      {pend.length === 0 ? <div className="panel"><Empty icon={Inbox} text="未処理の申請はありません" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{pend.map((r) => <ReqCard key={r.id} r={r} />)}</div>
      )}
      {hist.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-bold mb-2">最近の処理履歴</h2>
          <div className="panel">
            {hist.map((r) => { const t = taskOf(r); const u = userOf(r); return (
              <div key={r.id} className="flex items-center gap-2 px-4 py-2 text-sm" style={{ borderBottom: "1px solid var(--border)" }}>
                <Badge cls={r.status === "approved" ? "b-green" : "b-red"}>{r.status === "approved" ? "承認" : "却下"}</Badge>
                <span className="flex-1 truncate">{t ? t.title : "(削除済み)"} — {u ? u.name : "?"}{r.type === "extend" ? "(期日延長)" : ""}</span>
                <span className="text-xs" style={{ color: "var(--muted)" }}>{fmtDT(r.requested_at)}</span>
              </div>); })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Member: ダッシュボード / タスク一覧 / 未割当申請
   ============================================================ */
function UnassignedBanner() {
  const { db, user, nav } = useApp();
  const myActive = db.tasks.filter((t) => t.assigned_user_id === user.id && t.status !== "done");
  const activePj = new Set(db.projects.filter((p) => p.status === "active").map((p) => p.id));
  const unassigned = db.tasks.filter((t) => !t.assigned_user_id && t.status !== "done" && activePj.has(t.project_id));
  if (myActive.length > 1 || unassigned.length === 0) return null;
  return (
    <div className="panel p-4 mb-4 flex items-center gap-3 flex-wrap" style={{ borderColor: "var(--ai)", background: "var(--ai-soft)" }}>
      <Sparkles size={18} style={{ color: "var(--ai)" }} />
      <div className="flex-1 text-sm" style={{ minWidth: 180 }}>
        <b>手が空きそうですか？</b> 割当可能なタスクが {unassigned.length} 件あります。
      </div>
      <button className="btn btn-p btn-sm" onClick={() => nav("unassigned")}>利用可能なタスクを見る</button>
    </div>
  );
}

function MemberDashboard() {
  const { db, user, now, timer, setOpenTaskId } = useApp();
  const mine = db.tasks.filter((t) => t.assigned_user_id === user.id);
  const [wS, wE] = weekRange();
  const today = todayStr();
  const dueToday = mine.filter((t) => t.status !== "done" && t.deadline === today);
  const dueWeek = mine.filter((t) => t.status !== "done" && t.deadline && t.deadline > today && new Date(t.deadline).getTime() < wE);
  const overdue = mine.filter((t) => t.status !== "done" && t.deadline && t.deadline < today);
  const weekMin = db.worklogs.filter((l) => l.user_id === user.id && l.started_at >= wS && l.started_at < wE).reduce((a, l) => a + l.duration_min, 0)
    + (timer ? (now - timer.startedAt) / 60000 : 0);
  const inProg = mine.filter((t) => t.status === "in_progress");
  const TaskRow = ({ t, tone }) => (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm" style={{ background: "var(--panel2)" }} onClick={() => setOpenTaskId(t.id)}>
      <Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge>
      <span className="flex-1 truncate font-medium">{t.title}</span>
      <span className="text-xs mono" style={{ color: tone || "var(--muted)" }}>{t.deadline}</span>
    </div>
  );
  return (
    <div>
      <PageTitle title={`こんにちは、${user.name.split(/\s+/)[0]} さん`} sub="今日の稼働をはじめましょう" />
      <UnassignedBanner />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="panel p-4 md:col-span-1">
          <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>今週の稼働時間</div>
          <div className="bignum" style={{ color: "var(--ai)" }}>{fmtHM(weekMin)}</div>
          <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{timer ? "計測中の時間を含む" : "月曜はじまり"}</div>
        </div>
        <div className="panel p-4 md:col-span-2">
          <SecTitle icon={Calendar} title="締め切りが近いタスク" />
          <div className="flex flex-col gap-2">
            {overdue.map((t) => <TaskRow key={t.id} t={t} tone="var(--red)" />)}
            {dueToday.map((t) => <TaskRow key={t.id} t={t} tone="var(--amber)" />)}
            {dueWeek.slice(0, 4).map((t) => <TaskRow key={t.id} t={t} />)}
            {overdue.length + dueToday.length + dueWeek.length === 0 && <div className="text-sm py-3" style={{ color: "var(--muted)" }}>今週締め切りのタスクはありません 🎉</div>}
          </div>
        </div>
      </div>
      <section className="panel p-4">
        <SecTitle icon={Timer} title="進行中のタスク" />
        {inProg.length === 0 ? <Empty icon={ClipboardList} text="進行中のタスクはありません" /> : (
          <div className="flex flex-col gap-3">
            {inProg.map((t) => {
              const w = workedMin(db.worklogs, t.id) + (timer && timer.taskId === t.id ? (now - timer.startedAt) / 60000 : 0);
              const r = t.max_minutes > 0 ? w / t.max_minutes : 0;
              return (
                <div key={t.id} className="cursor-pointer" onClick={() => setOpenTaskId(t.id)}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium flex items-center gap-2">{timer && timer.taskId === t.id && <span className="pulse" />}{t.title}</span>
                    <span className="text-xs mono" style={{ color: r >= 1 ? "var(--red)" : r >= 0.9 ? "var(--amber)" : "var(--muted)" }}>{fmtHM(w)} / {fmtHM(t.max_minutes)}</span>
                  </div>
                  <Prog ratio={r} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function MemberTaskCard({ t }) {
  const { db, setOpenTaskId, timer, now } = useApp();
  const w = workedMin(db.worklogs, t.id) + (timer && timer.taskId === t.id ? (now - timer.startedAt) / 60000 : 0);
  const r = t.max_minutes > 0 ? w / t.max_minutes : 0;
  const warn = t.status !== "done" && r >= 0.9;
  return (
    <div className="panel p-3 cursor-pointer" onClick={() => setOpenTaskId(t.id)}
      style={warn ? { borderColor: r >= 1 ? "var(--red)" : "var(--amber)", background: "var(--amber-bg)" } : {}}>
      <div className="flex items-center gap-2 mb-2">
        {warn && <AlertTriangle size={14} style={{ color: r >= 1 ? "var(--red)" : "var(--amber)", flexShrink: 0 }} />}
        {timer && timer.taskId === t.id && <span className="pulse" />}
        <span className="font-medium text-sm flex-1 truncate">{t.title}</span>
        <Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge>
      </div>
      <div className="flex items-center justify-between text-xs mb-1" style={{ color: "var(--muted)" }}>
        <span className="flex items-center gap-1"><Calendar size={11} />{t.deadline || "期日なし"}</span>
        <span className="mono">{fmtHM(w)} / {fmtHM(t.max_minutes)}</span>
      </div>
      <Prog ratio={r} />
      <div className="mt-2"><Badge cls={ST_BADGE[t.status]} dot>{ST[t.status]}</Badge></div>
    </div>
  );
}

function MemberTasks() {
  const { db, user } = useApp();
  const [stF, setStF] = useState("all");
  const [openDone, setOpenDone] = useState({});
  const mine = db.tasks.filter((t) => t.assigned_user_id === user.id);
  const pjIds = [...new Set(mine.map((t) => t.project_id))];
  const projects = pjIds.map((id) => db.projects.find((p) => p.id === id)).filter(Boolean);
  return (
    <div>
      <PageTitle title="マイタスク" sub={`全 ${mine.length} 件`} />
      <UnassignedBanner />
      <div className="mb-4"><Seg value={stF} onChange={setStF} options={[{ value: "all", label: "すべて" }, { value: "todo", label: "未着手" }, { value: "in_progress", label: "進行中" }, { value: "done", label: "完了" }]} /></div>
      {projects.length === 0 && <div className="panel"><Empty icon={ClipboardList} text="割り当てられたタスクはまだありません" /></div>}
      {projects.map((p) => {
        const ts = mine.filter((t) => t.project_id === p.id && (stF === "all" || t.status === stF));
        if (ts.length === 0) return null;
        const act = ts.filter((t) => t.status !== "done");
        const done = ts.filter((t) => t.status === "done");
        return (
          <section key={p.id} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-bold m-0">{p.name}</h2>
              <Badge cls={PJ_BADGE[p.status]}>{PJST[p.status]}</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {(stF === "done" ? done : act).map((t) => <MemberTaskCard key={t.id} t={t} />)}
            </div>
            {stF === "all" && done.length > 0 && (
              <div className="mt-2">
                <button className="btn btn-sm" onClick={() => setOpenDone((o) => ({ ...o, [p.id]: !o[p.id] }))}>
                  {openDone[p.id] ? <ChevronDown size={13} /> : <ChevronRight size={13} />}完了 {done.length} 件
                </button>
                {openDone[p.id] && <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-2" style={{ opacity: 0.75 }}>
                  {done.map((t) => <MemberTaskCard key={t.id} t={t} />)}
                </div>}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function UnassignedView() {
  const { db, user, nav, mutate, notifyUsers, pmIds, toast } = useApp();
  const activePj = new Set(db.projects.filter((p) => p.status === "active").map((p) => p.id));
  const list = db.tasks.filter((t) => !t.assigned_user_id && t.status !== "done" && activePj.has(t.project_id));
  const myPending = (t) => db.requests.find((r) => r.type !== "extend" && r.task_id === t.id && r.user_id === user.id && r.status === "pending");
  async function request(t) {
    await mutate("requests", (l) => [{ id: uid(), type: "assign", task_id: t.id, user_id: user.id, status: "pending", requested_at: Date.now() }, ...l]);
    await notifyUsers(pmIds(), "request", `${user.name} が未割当タスク「${t.title}」への割当を申請しました`, { email: true });
    toast("申請を送信しました");
  }
  return (
    <div>
      <PageTitle title="利用可能なタスク" sub="未割当のタスクに割当を申請できます" back={() => nav("mytasks")} />
      {list.length === 0 ? <div className="panel"><Empty icon={Inbox} text="現在、割当可能なタスクはありません" /></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {list.map((t) => {
            const p = db.projects.find((x) => x.id === t.project_id);
            const pending = myPending(t);
            return (
              <div key={t.id} className="panel p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm flex-1">{t.title}</span>
                  <Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge>
                </div>
                <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>{p ? p.name : ""}</div>
                {t.description && <div className="text-sm mb-2" style={{ color: "var(--muted)" }}>{t.description.slice(0, 80)}{t.description.length > 80 ? "…" : ""}</div>}
                <div className="flex gap-4 text-xs mb-3 flex-wrap" style={{ color: "var(--muted)" }}>
                  <span className="flex items-center gap-1"><Calendar size={11} />{t.deadline || "—"}</span>
                  <span className="mono">予算 {fmtYen(t.budget)}</span>
                  <span className="mono flex items-center gap-1"><Clock size={11} />上限 {fmtHM(t.max_minutes)}</span>
                </div>
                {pending
                  ? <button className="btn w-full justify-center" disabled>申請済み (承認待ち)</button>
                  : <button className="btn btn-p w-full justify-center" onClick={() => request(t)}>割当を申請する</button>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Member: タスク詳細モーダル (目標・タイマー・完了報告・延長申請)
   ============================================================ */
function MemberTaskModalHost() {
  const { openTaskId, setOpenTaskId } = useApp();
  if (!openTaskId) return null;
  return <MemberTaskModal taskId={openTaskId} onClose={() => setOpenTaskId(null)} />;
}

function MemberTaskModal({ taskId, onClose }) {
  const { db, user, timer, now, startTimer, stopTimer, mutate, notifyUsers, pmIds, toast } = useApp();
  const [completing, setCompleting] = useState(false);
  const [comment, setComment] = useState("");
  const [extending, setExtending] = useState(false);
  const [extDate, setExtDate] = useState(""); const [extReason, setExtReason] = useState("");
  const t = db.tasks.find((x) => x.id === taskId);
  if (!t) return null;
  const p = db.projects.find((x) => x.id === t.project_id);
  const running = timer && timer.taskId === t.id;
  const worked = workedMin(db.worklogs, t.id) + (running ? (now - timer.startedAt) / 60000 : 0);
  const remain = (t.max_minutes || 0) - worked;
  const logs = db.worklogs.filter((l) => l.task_id === t.id).sort((a, b) => b.started_at - a.started_at);
  const extPending = db.requests.find((r) => r.type === "extend" && r.task_id === t.id && r.user_id === user.id && r.status === "pending");
  const over = t.max_minutes > 0 && worked >= t.max_minutes;

  async function complete() {
    if (comment.trim().length < 50) return;
    await mutate("tasks", (list) => list.map((x) => x.id === t.id ? { ...x, status: "done", completed_at: Date.now(), completion_comment: comment.trim() } : x));
    if (running) await stopTimer();
    await notifyUsers(pmIds(), "done", `${user.name} が「${t.title}」を完了報告しました`, { email: true });
    toast("完了を報告しました"); setCompleting(false); onClose();
  }
  async function requestExtend() {
    if (!extDate || (t.deadline && extDate <= t.deadline)) { toast("現在の期日より後の日付を選んでください"); return; }
    await mutate("requests", (l) => [{ id: uid(), type: "extend", task_id: t.id, user_id: user.id, status: "pending", requested_at: Date.now(), extend_to: extDate, reason: extReason.trim() }, ...l]);
    await notifyUsers(pmIds(), "extend", `${user.name} が「${t.title}」の期日延長を申請しました (${t.deadline} → ${extDate})`, { email: true });
    setExtending(false); setExtDate(""); setExtReason(""); toast("延長申請を送信しました");
  }
  return (
    <Modal open onClose={onClose} title="タスク詳細">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <div className="text-lg font-bold">{t.title}</div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>{p ? p.name : ""}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge cls={ST_BADGE[t.status]} dot>{ST[t.status]}</Badge>
          <Badge cls={PR_BADGE[t.priority]}>優先度 {PR[t.priority]}</Badge>
        </div>
      </div>
      {over && t.status !== "done" && (
        <div className="flex items-center gap-2 p-3 rounded-lg text-sm my-3" style={{ background: "var(--red-bg)", color: "var(--red)" }}>
          <AlertTriangle size={15} />稼働時間が上限を超過しました。PMに連絡してください。
        </div>
      )}
      <div className="p-3 rounded-lg my-3" style={{ background: "var(--ai-soft)" }}>
        <div className="lbl" style={{ color: "var(--ai)" }}>目標・ノルマ</div>
        <div className="text-sm font-medium" style={{ whiteSpace: "pre-wrap" }}>{t.goal || "—"}</div>
      </div>
      {t.description && <div className="text-sm mb-3" style={{ whiteSpace: "pre-wrap", color: "var(--muted)" }}>{t.description}</div>}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <MiniStat label="期日" value={t.deadline || "—"} />
        <MiniStat label="累計 / 上限" value={`${fmtHM(worked)} / ${fmtHM(t.max_minutes)}`} mono warn={t.max_minutes > 0 && worked >= t.max_minutes * 0.9} />
        <MiniStat label="残り時間" value={remain >= 0 ? fmtHM(remain) : "-" + fmtHM(-remain)} mono warn={remain < 0} />
      </div>
      <Prog ratio={t.max_minutes > 0 ? worked / t.max_minutes : 0} />

      {t.status !== "done" ? (
        <div className="my-4">
          {running ? (
            <div className="panel p-4 flex items-center gap-3" style={{ borderColor: "var(--ai)" }}>
              <span className="pulse" />
              <div className="flex-1"><div className="text-xs" style={{ color: "var(--muted)" }}>計測中</div>
                <div className="mono text-2xl font-bold">{fmtHMS((now - timer.startedAt) / 1000)}</div></div>
              <button className="btn btn-p" onClick={stopTimer}><Square size={15} />稼働停止</button>
            </div>
          ) : (
            <button className="btn btn-p w-full justify-center py-3" style={{ fontSize: 15 }} onClick={() => startTimer(t)} disabled={!!timer}>
              <Play size={17} />{timer ? "他のタスクを計測中です" : "稼働開始"}
            </button>
          )}
        </div>
      ) : (
        t.completion_comment && <div className="p-3 rounded-lg my-3" style={{ background: "var(--green-bg)" }}>
          <div className="lbl" style={{ color: "var(--green)" }}>完了コメント</div>
          <div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{t.completion_comment}</div>
        </div>
      )}

      <div className="mb-3"><div className="lbl">過去の稼働ログ ({logs.length}件)</div>
        {logs.length === 0 ? <div className="text-sm" style={{ color: "var(--muted)" }}>まだ記録がありません</div> : (
          <div className="panel" style={{ maxHeight: 150, overflowY: "auto" }}>
            {logs.map((l) => (
              <div key={l.id} className="flex items-center gap-3 px-3 py-2 text-sm" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="text-xs mono" style={{ color: "var(--muted)", width: 88, flexShrink: 0 }}>{fmtDT(l.started_at)}</span>
                <span className="mono font-medium" style={{ width: 52 }}>{fmtHM(l.duration_min)}</span>
                <span className="text-xs flex-1 truncate" style={{ color: "var(--muted)" }}>{l.note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <CommentThread task={t} />

      {t.status !== "done" && (
        <div className="mt-5 flex flex-col gap-3">
          {completing ? (
            <div className="panel p-3" style={{ background: "var(--panel2)", border: "none" }}>
              <div className="lbl">完了コメント (50文字以上・必須)</div>
              <textarea className="textarea" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="達成内容・成果物の場所・引き継ぎ事項などを記入" />
              <div className="text-xs mt-1 text-right" style={{ color: comment.trim().length >= 50 ? "var(--green)" : "var(--muted)" }}>{comment.trim().length} / 50文字</div>
              <div className="flex justify-end gap-2 mt-2">
                <button className="btn btn-sm" onClick={() => setCompleting(false)}>戻る</button>
                <button className="btn btn-p btn-sm" disabled={comment.trim().length < 50} onClick={complete}><Check size={13} />完了報告を送信</button>
              </div>
            </div>
          ) : extending ? (
            <div className="panel p-3" style={{ background: "var(--panel2)", border: "none" }}>
              <div className="lbl">期日延長申請 (現在: {t.deadline || "—"})</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="date" className="input" value={extDate} onChange={(e) => setExtDate(e.target.value)} />
                <input className="input" placeholder="理由" value={extReason} onChange={(e) => setExtReason(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn btn-sm" onClick={() => setExtending(false)}>戻る</button>
                <button className="btn btn-p btn-sm" onClick={requestExtend}>申請する</button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <button className="btn flex-1 justify-center" onClick={() => setCompleting(true)}><CheckCircle2 size={15} />完了にする</button>
              {extPending
                ? <button className="btn flex-1 justify-center" disabled>延長申請中</button>
                : <button className="btn flex-1 justify-center" onClick={() => { setExtending(true); setExtDate(""); }}><Calendar size={15} />期日延長を申請</button>}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ---------- 稼働記録確認 (短縮のみ修正可) ---------- */
function TimerConfirmModal({ data, onClose }) {
  const { commitWorkLog, ask, toast } = useApp();
  const { task, seconds, startedAt } = data;
  const preH = Math.floor(seconds / 3600), preM = Math.floor((seconds % 3600) / 60);
  const [h, setH] = useState(preH); const [m, setM] = useState(preM);
  const [edited, setEdited] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const measuredMin = seconds / 60;
  const editedMin = (Number(h) || 0) * 60 + (Number(m) || 0);
  function onEdit(setter) { return (e) => { setter(e.target.value); setEdited(true); setErr(""); }; }
  function reset() { setH(preH); setM(preM); setEdited(false); setErr(""); }
  async function submit() {
    if (edited && editedMin > measuredMin) { setErr("計測時間より長くすることはできません (短縮のみ可能)"); return; }
    if (edited && editedMin <= 0) { setErr("1分以上を入力してください"); return; }
    if (!task) { toast("対象タスクが削除されていたため記録を破棄しました"); onClose(); return; }
    await commitWorkLog(task, startedAt, seconds, edited ? editedMin : measuredMin, note);
  }
  async function discard() {
    if (await ask("この計測記録を破棄しますか？")) onClose();
  }
  return (
    <Modal open onClose={discard} title="稼働の記録・報告" noClose>
      <div className="text-sm mb-1" style={{ color: "var(--muted)" }}>{task ? task.title : "(削除されたタスク)"}</div>
      <div className="text-center my-4">
        <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>計測時間</div>
        <div className="mono font-bold" style={{ fontSize: 40 }}>{fmtHMS(seconds)}</div>
      </div>
      <Field label="記録する時間 (短縮のみ可能)" error={err}>
        <div className="flex items-center gap-2">
          <input type="number" min="0" className="input num" style={{ width: 84 }} value={h} onChange={onEdit(setH)} /><span className="text-sm">時間</span>
          <input type="number" min="0" max="59" className="input num" style={{ width: 74 }} value={m} onChange={onEdit(setM)} /><span className="text-sm">分</span>
          <button className="btn btn-sm" onClick={reset}><RefreshCw size={12} />計測値にリセット</button>
        </div>
        {!edited && <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>未修正の場合は計測値(秒単位)がそのまま記録されます</div>}
      </Field>
      <Field label={`メモ (任意・${note.length}/100文字)`}>
        <input className="input" maxLength={100} value={note} onChange={(e) => setNote(e.target.value)} placeholder="作業内容のメモ" />
      </Field>
      <div className="flex justify-between gap-2 mt-4">
        <button className="btn btn-d" onClick={discard}>破棄</button>
        <button className="btn btn-p" onClick={submit}><Check size={15} />確定・報告</button>
      </div>
    </Modal>
  );
}

/* ============================================================
   Member: 稼働履歴 / 共通: プロフィール / PM: ユーザー管理
   ============================================================ */
function HistoryView() {
  const { db, user } = useApp();
  const [month, setMonth] = useState("all");
  const mine = db.worklogs.filter((l) => l.user_id === user.id).sort((a, b) => b.started_at - a.started_at);
  const months = useMemo(() => {
    const s = new Set(); mine.forEach((l) => { const d = new Date(l.started_at); s.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); });
    return [...s].sort().reverse();
  }, [db.worklogs, user.id]);
  const list = mine.filter((l) => { if (month === "all") return true; const d = new Date(l.started_at); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` === month; });
  const total = list.reduce((a, l) => a + l.duration_min, 0);
  return (
    <div>
      <PageTitle title="稼働履歴" sub={`${month === "all" ? "全期間" : month} 合計 ${fmtHM(total)}`} right={
        <select className="select" style={{ width: "auto" }} value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="all">全期間</option>
          {months.map((mo) => <option key={mo} value={mo}>{mo}</option>)}
        </select>} />
      <div className="panel" style={{ overflowX: "auto" }}>
        <table className="tbl" style={{ minWidth: 560 }}>
          <thead><tr><th>日時</th><th>タスク</th><th>プロジェクト</th><th>時間</th><th>メモ</th></tr></thead>
          <tbody>
            {list.map((l) => {
              const t = db.tasks.find((x) => x.id === l.task_id);
              const p = t && db.projects.find((x) => x.id === t.project_id);
              return (
                <tr key={l.id}>
                  <td className="num text-xs" style={{ color: "var(--muted)" }}>{fmtDT(l.started_at)}</td>
                  <td className="font-medium">{t ? t.title : "(削除済み)"}</td>
                  <td className="text-xs" style={{ color: "var(--muted)" }}>{p ? p.name : "—"}</td>
                  <td className="num">{fmtHM(l.duration_min)}</td>
                  <td className="text-xs" style={{ color: "var(--muted)" }}>{l.note}</td>
                </tr>
              );
            })}
            {list.length === 0 && <tr><td colSpan={5}><Empty icon={History} text="稼働記録がありません" /></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfileView() {
  const { user, mutate, toast } = useApp();
  const [name, setName] = useState(user.name);
  const [cur, setCur] = useState(""); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  async function saveName() {
    if (!name.trim()) return;
    await mutate("users", (list) => list.map((u) => u.id === user.id ? { ...u, name: name.trim() } : u));
    toast("名前を更新しました");
  }
  async function savePw() {
    setErr("");
    const curHash = await sha(cur, user.salt);
    if (curHash !== user.passHash) { setErr("現在のパスワードが正しくありません"); return; }
    if (pw.length < 6) { setErr("新しいパスワードは6文字以上にしてください"); return; }
    if (pw !== pw2) { setErr("確認用パスワードが一致しません"); return; }
    const salt = uid(); const h = await sha(pw, salt);
    await mutate("users", (list) => list.map((u) => u.id === user.id ? { ...u, salt, passHash: h } : u));
    setCur(""); setPw(""); setPw2(""); toast("パスワードを変更しました");
  }
  return (
    <div style={{ maxWidth: 480 }}>
      <PageTitle title="プロフィール設定" />
      <div className="panel p-4 mb-4">
        <div className="flex items-center gap-3 mb-4"><Avatar user={user} size={44} />
          <div><div className="font-bold">{user.name}</div><div className="text-xs" style={{ color: "var(--muted)" }}>{user.email} · {user.role}</div></div>
        </div>
        <Field label="表示名"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <button className="btn btn-p" onClick={saveName}>名前を保存</button>
      </div>
      <div className="panel p-4">
        <SecTitle icon={Shield} title="パスワード変更" />
        <Field label="現在のパスワード"><input type="password" className="input" value={cur} onChange={(e) => setCur(e.target.value)} /></Field>
        <Field label="新しいパスワード (6文字以上)"><input type="password" className="input" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        <Field label="新しいパスワード (確認)"><input type="password" className="input" value={pw2} onChange={(e) => setPw2(e.target.value)} /></Field>
        {err && <div className="err mb-2">{err}</div>}
        <button className="btn btn-p" onClick={savePw}>パスワードを変更</button>
      </div>
    </div>
  );
}

function UsersView() {
  const { db, user, mutate, toast, ask } = useApp();
  const [invite, setInvite] = useState(false);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [role, setRole] = useState("Member");
  const [issued, setIssued] = useState(null); // {name, email, pw}
  async function doInvite() {
    if (!name.trim() || !email.includes("@")) { toast("名前とメールアドレスを入力してください"); return; }
    const em = email.trim().toLowerCase();
    if (db.users.some((u) => u.email === em)) { toast("そのメールアドレスは登録済みです"); return; }
    const pw = genPw(); const salt = uid();
    const nu = { id: uid(), name: name.trim(), email: em, role, avatarColor: AV_COLORS[db.users.length % AV_COLORS.length], salt, passHash: await sha(pw, salt), mustChange: true };
    await mutate("users", (list) => [...list, nu]);
    setIssued({ name: nu.name, email: em, pw }); setInvite(false); setName(""); setEmail(""); setRole("Member");
  }
  async function resetPw(u) {
    if (!(await ask(`${u.name} の仮パスワードを再発行しますか？`))) return;
    const pw = genPw(); const salt = uid(); const h = await sha(pw, salt);
    await mutate("users", (list) => list.map((x) => x.id === u.id ? { ...x, salt, passHash: h, mustChange: true } : x));
    setIssued({ name: u.name, email: u.email, pw });
  }
  async function changeRole(u, r) {
    if (u.role === "PM" && r === "Member" && db.users.filter((x) => x.role === "PM").length <= 1) { toast("最後のPMは変更できません"); return; }
    await mutate("users", (list) => list.map((x) => x.id === u.id ? { ...x, role: r } : x));
    toast("ロールを変更しました");
  }
  async function del(u) {
    if (db.tasks.some((t) => t.assigned_user_id === u.id) || db.worklogs.some((l) => l.user_id === u.id)) { toast("タスクや稼働記録があるため削除できません"); return; }
    if (!(await ask(`${u.name} を削除しますか？`))) return;
    await mutate("users", (list) => list.filter((x) => x.id !== u.id));
    toast("削除しました");
  }
  return (
    <div>
      <PageTitle title="ユーザー管理" sub={`${db.users.length} 名`} right={<button className="btn btn-p" onClick={() => setInvite(true)}><Plus size={15} />メンバーを招待</button>} />
      <PMApprovalSection db={db} mutate={mutate} toast={toast} />
      <div className="panel" style={{ overflowX: "auto" }}>
        <table className="tbl" style={{ minWidth: 620 }}>
          <thead><tr><th>ユーザー</th><th>メール</th><th>ロール</th><th /></tr></thead>
          <tbody>
            {db.users.map((u) => (
              <tr key={u.id}>
                <td><span className="flex items-center gap-2"><Avatar user={u} size={26} />{u.name}{u.id === user.id && <Badge cls="b-blue">自分</Badge>}{u.pending && <Badge cls="b-amber">PM承認待ち</Badge>}{!u.pending && u.mustChange && <Badge cls="b-amber">仮PW</Badge>}</span></td>
                <td className="text-xs" style={{ color: "var(--muted)" }}>{u.email}</td>
                <td>
                  <select className="select" style={{ width: 110, padding: "4px 8px", fontSize: 12 }} value={u.role} onChange={(e) => changeRole(u, e.target.value)} disabled={u.id === user.id}>
                    <option value="PM">PM</option><option value="Member">Member</option>
                  </select>
                </td>
                <td>
                  <div className="flex gap-1 justify-end">
                    <button className="btn btn-sm" onClick={() => resetPw(u)}>PW再発行</button>
                    {u.id !== user.id && <button className="iconbtn" style={{ width: 30, height: 30 }} onClick={() => del(u)} aria-label="削除"><Trash2 size={14} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={invite} onClose={() => setInvite(false)} title="メンバーを招待">
        <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>仮パスワードが発行されます。本人に共有してください(初回ログイン時に変更を求められます)。</p>
        <Field label="名前"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="ロール">
          <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Member">Member</option><option value="PM">PM</option>
          </select>
        </Field>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn" onClick={() => setInvite(false)}>キャンセル</button>
          <button className="btn btn-p" onClick={doInvite}>発行する</button>
        </div>
      </Modal>
      <Modal open={!!issued} onClose={() => setIssued(null)} title="ログイン情報を発行しました">
        {issued && <div>
          <div className="panel p-3 mb-3 mono text-sm" style={{ background: "var(--panel2)", border: "none" }}>
            {issued.name}<br />メール: {issued.email}<br />仮パスワード: <b>{issued.pw}</b>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>この画面を閉じると仮パスワードは再表示できません(再発行は可能)。</p>
          <button className="btn btn-p w-full justify-center" onClick={() => { navigator.clipboard && navigator.clipboard.writeText(`${issued.email} / ${issued.pw}`); setIssued(null); }}><Copy size={14} />コピーして閉じる</button>
        </div>}
      </Modal>
    </div>
  );
}

/* ---------- PM申請承認セクション (UsersView内で使用) ---------- */
function PMApprovalSection({ db, mutate, toast }) {
  const pending = db.users.filter((u) => u.pending && u.role === "PM");
  if (pending.length === 0) return null;
  async function approve(u) {
    await mutate("users", (list) => list.map((x) => x.id === u.id ? { ...x, pending: false } : x));
    toast(`${u.name} のPM権限を承認しました`);
  }
  async function reject(u) {
    await mutate("users", (list) => list.filter((x) => x.id !== u.id));
    toast(`${u.name} のPM申請を却下・削除しました`);
  }
  return (
    <div className="panel p-4 mb-4" style={{ borderColor: "var(--amber)" }}>
      <SecTitle icon={Shield} title={`PM権限の申請 (${pending.length}件)`} tone="var(--amber)" />
      <div className="flex flex-col gap-2">
        {pending.map((u) => (
          <div key={u.id} className="flex items-center gap-3 flex-wrap p-2 rounded-lg" style={{ background: "var(--amber-bg)" }}>
            <Avatar user={u} size={30} />
            <div className="flex-1" style={{ minWidth: 160 }}>
              <div className="text-sm font-bold">{u.name}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{u.email} · 申請 {fmtDT(u.created_at)}</div>
              {u.pm_apply_reason && <div className="text-xs mt-1">理由: {u.pm_apply_reason}</div>}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-d btn-sm" onClick={() => reject(u)}><X size={13} />却下</button>
              <button className="btn btn-p btn-sm" onClick={() => approve(u)}><Check size={13} />承認</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
