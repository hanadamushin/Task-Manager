import React, { useState, useEffect, useRef, useMemo, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Bell, Plus, Play, Square, Check, X, Clock, AlertTriangle, Search, Sun, Moon,
  LogOut, User, Users, Home, Briefcase, Calendar, ChevronRight, ChevronDown,
  Download, Edit2, Trash2, Send, Sparkles, RefreshCw, Link2, MessageSquare,
  ArrowLeft, ClipboardList, Timer, History, Settings, Mail, Shield, Copy,
  CheckCircle2, XCircle, Info, Eye, EyeOff, Inbox
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from "recharts";

/* ============================================================
   FN.Task  ESupabase Auth牁E   ============================================================ */

const SUPABASE_URL = "https://bfzqetdxpzcrgngszueg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_aeO-GvHnBTZAOW3wHxrQ4A_khCpLkDY";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---------- CSS ---------- */
const CSS = `
.kd *{ -webkit-tap-highlight-color:transparent; box-sizing:border-box; }
.kd{ --bg:#F6F5F1; --panel:#FFFFFF; --panel2:#F0EEE7; --text:#1C1E26; --muted:#6A6F7A;
  --border:#E5E2D9; --ai:#2F5AA8; --ai-soft:#E7EDF8; --amber:#B7791F; --amber-bg:#FBF3E2;
  --red:#C43D3D; --red-bg:#FBEAEA; --green:#2F855A; --green-bg:#E6F4EC;
  min-height:100vh; background:var(--bg); color:var(--text);
  font-family:'Noto Sans JP', system-ui, sans-serif; font-size:14px; line-height:1.6; }
.kd.dark{ --bg:#12141A; --panel:#1A1D25; --panel2:#22262F; --text:#E9EAEE; --muted:#979DA9;
  --border:#2A2E39; --ai:#7FA4E8; --ai-soft:#1F2B44; --amber:#F0B429; --amber-bg:#332A14;
  --red:#E8706A; --red-bg:#3A2020; --green:#57B98A; --green-bg:#16301F; }
.wordmark{ font-family:'Shippori Mincho',serif; font-weight:600; letter-spacing:.14em; }
.num{ font-variant-numeric:tabular-nums; }
.panel{ background:var(--panel); border:1px solid var(--border); border-radius:14px; }
.ledger{ border-bottom:3px double var(--border); }
.btn{ display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:10px;
  border:1px solid var(--border); background:var(--panel); color:var(--text); font-size:13px;
  font-weight:500; cursor:pointer; transition:filter .12s,background .12s; white-space:nowrap;
  touch-action:manipulation; }
.btn:hover{ background:var(--panel2); }
.btn:disabled{ opacity:.45; cursor:not-allowed; }
.btn-p{ background:var(--ai); border-color:var(--ai); color:#fff; }
.btn-p:hover{ filter:brightness(1.08); background:var(--ai); }
.btn-d{ background:transparent; border-color:var(--red); color:var(--red); }
.btn-d:hover{ background:var(--red-bg); }
.btn-sm{ padding:4px 10px; font-size:12px; border-radius:8px; }
.iconbtn{ display:inline-flex; align-items:center; justify-content:center; width:36px; height:36px;
  border-radius:10px; border:1px solid transparent; background:transparent; color:var(--muted);
  cursor:pointer; position:relative; touch-action:manipulation; }
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
.tbl th.sort{ cursor:pointer; }
.tbl td{ padding:9px 10px; border-bottom:1px solid var(--border); vertical-align:middle; }
.tbl tr.click{ cursor:pointer; } .tbl tr.click:hover td{ background:var(--panel2); }
.tbl tr.warn90 td{ background:var(--amber-bg); }
.chip{ display:inline-flex; align-items:center; gap:4px; padding:4px 12px; border-radius:999px;
  border:1px solid var(--border); background:var(--panel); color:var(--muted); font-size:12px;
  font-weight:500; cursor:pointer; touch-action:manipulation; }
.chip.on{ background:var(--ai); border-color:var(--ai); color:#fff; }
.navi{ display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:10px;
  color:var(--muted); font-size:13.5px; font-weight:500; cursor:pointer; touch-action:manipulation; }
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
.hcell{ width:100%; aspect-ratio:1.6; border-radius:6px; background:var(--panel2); }
.avatar{ display:inline-flex; align-items:center; justify-content:center; border-radius:99px;
  color:#fff; font-weight:700; flex-shrink:0; }
.searchdrop{ position:absolute; top:44px; left:0; right:0; z-index:40; max-height:320px; overflow-y:auto; }
.notifitem{ display:flex; gap:10px; padding:12px; border-bottom:1px solid var(--border); }
.notifitem.unread{ background:var(--ai-soft); }
.mono{ font-variant-numeric:tabular-nums; letter-spacing:.02em; }
.bignum{ font-size:40px; font-weight:700; font-variant-numeric:tabular-nums; }
.kd a{ color:var(--ai); }
.dot{ position:absolute; top:6px; right:6px; min-width:16px; height:16px; padding:0 4px; border-radius:99px;
  background:var(--red); color:#fff; font-size:10px; font-weight:700; display:flex; align-items:center; justify-content:center; }
`;

/* ---------- ユーチE��リチE�� ---------- */
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)+Date.now().toString(36);
const genPw = () => Math.random().toString(36).slice(2,6)+Math.random().toString(36).slice(2,6);
const todayStr = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const fmtYen = n => "¥"+Math.round(Number(n)||0).toLocaleString("ja-JP");
const fmtHM = min => { const m=Math.round(min||0); return `${Math.floor(m/60)}:${String(m%60).padStart(2,"0")}`; };
const fmtHMS = sec => { sec=Math.max(0,Math.floor(sec)); const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; };
const fmtDate = s => { if(!s) return " E; const d=new Date(s); return `${d.getMonth()+1}/${d.getDate()}`; };
const fmtDT = ts => { const d=new Date(ts); return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };
const daysUntil = s => { if(!s) return 9999; return Math.floor((new Date(s+"T23:59:59")-new Date())/864e5); };
const weekRange = () => { const d=new Date(),day=(d.getDay()+6)%7,s=new Date(d); s.setHours(0,0,0,0); s.setDate(d.getDate()-day); const e=new Date(s); e.setDate(s.getDate()+7); return [s.getTime(),e.getTime()]; };
const monthRange = () => { const d=new Date(),s=new Date(d.getFullYear(),d.getMonth(),1),e=new Date(d.getFullYear(),d.getMonth()+1,1); return [s.getTime(),e.getTime()]; };
const clamp01 = x => Math.max(0,Math.min(1,x||0));
const AV_COLORS = ["#2F5AA8","#8C5AA8","#B7791F","#2F855A","#C43D3D","#3A7CA5","#7A6A4F","#5A67A8"];
const LS = { get:k=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch(e){return null;}}, set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}, del:k=>{try{localStorage.removeItem(k);}catch(e){}} };

/* ---------- Supabase DB操佁E---------- */
const db_select = async (table, query="") => { const {data,error}=await supabase.from(table).select("*"); if(error) throw error; return data||[]; };
const db_select_q = async (table, filters={}, order=null, limit=null) => {
  let q = supabase.from(table).select("*");
  Object.entries(filters).forEach(([k,v])=>{ q=q.eq(k,v); });
  if(order) q=q.order(order.col,{ascending:order.asc});
  if(limit) q=q.limit(limit);
  const {data,error}=await q; if(error) throw error; return data||[];
};
const db_insert = async (table, data) => { const rows=Array.isArray(data)?data:[data]; const {error}=await supabase.from(table).insert(rows); if(error) throw error; };
const db_update = async (table, match, data) => { let q=supabase.from(table).update(data); Object.entries(match).forEach(([k,v])=>{q=q.eq(k,v);}); const {error}=await q; if(error) throw error; };
const db_delete = async (table, match) => { let q=supabase.from(table).delete(); Object.entries(match).forEach(([k,v])=>{q=q.eq(k,v);}); const {error}=await q; if(error) throw error; };

/* ---------- 定数 ---------- */
const ST={todo:"未着扁E,in_progress:"進行中",done:"完亁E};
const ST_BADGE={todo:"b-slate",in_progress:"b-blue",done:"b-green"};
const PR={high:"髁E,medium:"中",low:"佁E};
const PR_BADGE={high:"b-red",medium:"b-amber",low:"b-slate"};
const PJST={active:"進行中",paused:"一時停止",completed:"完亁E};
const PJ_BADGE={active:"b-blue",paused:"b-amber",completed:"b-green"};
const NT_META={
  assign:{icon:ClipboardList},request:{icon:Inbox},approve:{icon:CheckCircle2},
  reject:{icon:XCircle},limit90:{icon:AlertTriangle},over:{icon:AlertTriangle},
  deadline:{icon:Calendar},done:{icon:CheckCircle2},mention:{icon:MessageSquare},
  extend:{icon:Calendar},system:{icon:Info},
};

/* ---------- 雁E��E---------- */
const workedMin = (logs,taskId) => logs.filter(l=>l.task_id===taskId).reduce((a,l)=>a+(l.duration_min||0),0);
const taskRatio = (t,worked) => t.status==="done"?1:(t.max_minutes>0?clamp01(worked/t.max_minutes):0);
function projectStats(p,tasks,logs) {
  const pts=tasks.filter(t=>t.project_id===p.id);
  const done=pts.filter(t=>t.status==="done").length;
  const alloc=pts.reduce((a,t)=>a+(t.budget||0),0);
  const consumed=pts.reduce((a,t)=>a+(t.budget||0)*taskRatio(t,workedMin(logs,t.id)),0);
  return{total:pts.length,done,progress:pts.length?done/pts.length:0,alloc,consumed,remain:(p.budget||0)-alloc,consumedRate:p.budget>0?consumed/p.budget:0};
}

/* ---------- Claude API ---------- */
async function callClaude(messages,extra={}) {
  const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages,...extra})});
  if(!res.ok) throw new Error("APIエラー ("+res.status+")");
  return await res.json();
}
const textOf = data => (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");
function parseJsonArray(text){const c=text.replace(/```json|```/g,"").trim();const m=c.match(/\[[\s\S]*\]/);return JSON.parse(m?m[0]:c);}
function parseJsonObject(text){const c=text.replace(/```json|```/g,"").trim();const m=c.match(/\{[\s\S]*\}/);return JSON.parse(m?m[0]:c);}
const csvEsc = v=>{const s=String(v==null?"":v);return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
const toCSV = rows=>rows.map(r=>r.map(csvEsc).join(",")).join("\r\n");
function tryDownload(filename,text){try{const b=new Blob(["\uFEFF"+text],{type:"text/csv;charset=utf-8"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);return true;}catch(e){return false;}}

/* ---------- Context ---------- */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

/* ---------- 汎用UI ---------- */
function Avatar({user,size=28}){if(!user)return <span className="avatar" style={{width:size,height:size,background:"var(--border)",fontSize:size*0.4}}> E/span>;return <span className="avatar" title={user.name} style={{width:size,height:size,background:user.avatar_color||AV_COLORS[0],fontSize:size*0.42}}>{user.name.slice(0,1)}</span>;}
function Badge({cls,children,dot}){return <span className={"badge "+cls}>{dot&&<i/>}{children}</span>;}
function Prog({ratio,tone}){const r=clamp01(ratio);const cls=tone||(r>=1?"over":r>=0.9?"warn":"");return <div className="prog"><i className={cls} style={{width:(r*100).toFixed(1)+"%"}}/></div>;}
function Modal({open,onClose,title,children,wide,noClose}){if(!open)return null;return <div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget&&!noClose)onClose();}}><div className={"modal"+(wide?" wide":"")}><div className="flex items-center justify-between mb-4"><h3 className="text-base font-bold m-0">{title}</h3>{!noClose&&<button className="iconbtn" onClick={onClose}><X size={18}/></button>}</div>{children}</div></div>;}
function Field({label,error,children,hint}){return <div className="mb-3"><label className="lbl">{label}</label>{children}{hint&&!error&&<div className="text-xs mt-1" style={{color:"var(--muted)"}}>{hint}</div>}{error&&<div className="err">{error}</div>}</div>;}
function Empty({icon:I=Inbox,text}){return <div className="flex flex-col items-center gap-2 py-10" style={{color:"var(--muted)"}}><I size={28} strokeWidth={1.5}/><div className="text-sm">{text}</div></div>;}
function Seg({options,value,onChange}){return <div className="flex gap-2 flex-wrap">{options.map(o=><button key={o.value} className={"chip"+(value===o.value?" on":"")} onClick={()=>onChange(o.value)}>{o.label}</button>)}</div>;}
function SecTitle({icon:I,title,tone}){return <div className="flex items-center gap-2 mb-3 text-sm font-bold" style={{color:tone||"var(--text)"}}><I size={15}/>{title}</div>;}
function MiniStat({label,value,mono,warn}){return <div className="panel p-3" style={{background:"var(--panel2)",border:"none"}}><div className="text-xs mb-1" style={{color:"var(--muted)"}}>{label}</div><div className={"text-sm font-bold"+(mono?" mono":"")} style={warn?{color:"var(--amber)"}:{}}>{value}</div></div>;}
function StatCard({label,value,unit,warn,mono,onClick}){return <div className={"panel p-4"+(onClick?" cursor-pointer":"")} onClick={onClick} style={warn?{borderColor:"var(--amber)"}:{}}><div className="text-xs mb-1" style={{color:"var(--muted)"}}>{label}</div><div className={"stat"+(mono?" mono":"")} style={warn?{color:"var(--amber)"}:{}}>{value}<span className="text-xs font-medium ml-1" style={{color:"var(--muted)"}}>{unit}</span></div></div>;}
function AlertRow({tone,text,onClick}){const c=tone==="red"?"var(--red)":tone==="amber"?"var(--amber)":"var(--ai)";const bg=tone==="red"?"var(--red-bg)":tone==="amber"?"var(--amber-bg)":"var(--ai-soft)";return <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer" style={{background:bg,color:c}} onClick={onClick}><AlertTriangle size={14} style={{flexShrink:0}}/><span className="flex-1">{text}</span><ChevronRight size={14}/></div>;}
function PageTitle({title,sub,back,right}){return <div className="flex items-start gap-3 mb-5 flex-wrap">{back&&<button className="iconbtn" onClick={back}><ArrowLeft size={18}/></button>}<div className="flex-1" style={{minWidth:200}}><h1 className="text-xl font-bold m-0 ledger pb-2 inline-block pr-6">{title}</h1>{sub&&<div className="text-xs mt-2" style={{color:"var(--muted)"}}>{sub}</div>}</div>{right}</div>;}
function BrandMark({size=30}){return <div className="flex items-center gap-3"><div className="flex flex-col" style={{gap:3}}><span style={{display:"block",width:size+6,height:3,background:"var(--ai)",borderRadius:2}}/><span style={{display:"block",width:size+6,height:3,background:"var(--ai)",borderRadius:2,opacity:0.45}}/></div><span className="wordmark" style={{fontSize:size}}>FN.Task</span></div>;}

/* ============================================================
   App Root  ESupabase Auth牁E   ============================================================ */
export default function App() {
  const [dbState, setDbState] = useState({users:[],projects:[],tasks:[],worklogs:[],requests:[],notifications:[],comments:[]});
  const [authUser, setAuthUser] = useState(null); // Supabase auth user
  const [profile, setProfile] = useState(null);   // public.users row
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState("light");
  const [view, setView] = useState({page:"dash"});
  const [timer, setTimer] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmReq, setConfirmReq] = useState(null);
  const [timerDone, setTimerDone] = useState(null);
  const [openTaskId, setOpenTaskId] = useState(null);
  const toastT = useRef(null);

  /* --- 全チE�Eタ取征E--- */
  async function loadAll() {
    try {
      const [u,p,t,wl,req,notif,com] = await Promise.all([
        supabase.from("users").select("*").then(r=>r.data||[]),
        supabase.from("projects").select("*").order("created_at",{ascending:false}).then(r=>r.data||[]),
        supabase.from("tasks").select("*").order("created_at",{ascending:false}).then(r=>r.data||[]),
        supabase.from("worklogs").select("*").order("started_at",{ascending:false}).limit(2000).then(r=>r.data||[]),
        supabase.from("requests").select("*").order("requested_at",{ascending:false}).then(r=>r.data||[]),
        supabase.from("notifications").select("*").order("created_at",{ascending:false}).limit(400).then(r=>r.data||[]),
        supabase.from("comments").select("*").order("created_at",{ascending:true}).then(r=>r.data||[]),
      ]);
      setDbState({users:u,projects:p,tasks:t,worklogs:wl,requests:req,notifications:notif,comments:com});
      return {users:u,projects:p,tasks:t,worklogs:wl,requests:req,notifications:notif,comments:com};
    } catch(e) { console.error("loadAll failed",e); return null; }
  }

  /* --- 初期匁E Supabase AuthセチE��ョン確誁E--- */
  useEffect(()=>{
    const th=LS.get("fn:theme"); if(th) setTheme(th);
    const tm=LS.get("fn:timer"); if(tm&&tm.taskId) setTimer(tm);

    supabase.auth.getSession().then(async({data:{session}})=>{
      if(session) {
        setAuthUser(session.user);
        const data = await loadAll();
        if(data) {
          const prof = data.users.find(u=>u.auth_id===session.user.id || u.email===session.user.email);
          if(prof&&!prof.pending) setProfile(prof);
          else await supabase.auth.signOut();
        }
      }
      setLoaded(true);
    });

    const {data:{subscription}} = supabase.auth.onAuthStateChange(async(event,session)=>{
      if(event==="SIGNED_IN"&&session) {
        setAuthUser(session.user);
        const data = await loadAll();
        if(data) {
          const prof = data.users.find(u=>u.auth_id===session.user.id || u.email===session.user.email);
          if(prof&&!prof.pending) setProfile(prof);
        }
      } else if(event==="SIGNED_OUT") {
        setAuthUser(null); setProfile(null);
      }
    });
    return ()=>subscription.unsubscribe();
  },[]);

  /* --- タイマ�E刻み --- */
  useEffect(()=>{ if(!timer) return; const id=setInterval(()=>setNow(Date.now()),1000); return()=>clearInterval(id); },[timer]);

  /* --- 定期リフレチE��ュ30私E--- */
  useEffect(()=>{ const id=setInterval(()=>{ if(loaded&&profile) loadAll(); },30000); return()=>clearInterval(id); },[loaded,profile]);

  async function refresh() { await loadAll(); }

  /* --- DB操作�Eルパ�E --- */
  async function insertRow(table,data){const rows=Array.isArray(data)?data:[data];const {error}=await supabase.from(table).insert(rows);if(error)throw error;await loadAll();}
  async function updateRow(table,match,data){let q=supabase.from(table).update(data);Object.entries(match).forEach(([k,v])=>{q=q.eq(k,v);});const {error}=await q;if(error)throw error;await loadAll();}
  async function deleteRow(table,match){let q=supabase.from(table).delete();Object.entries(match).forEach(([k,v])=>{q=q.eq(k,v);});const {error}=await q;if(error)throw error;await loadAll();}

  /* --- 通知 --- */
  async function notifyUsers(userIds,type,message,opts={}){
    const ids=[...new Set(userIds)].filter(Boolean);
    if(!ids.length) return;
    const rows=ids.map(uid=>({id:uid(),user_id:uid,type,message,read:false,email:!!opts.email,k:opts.k||null,created_at:Date.now()}));
    const filtered=opts.k?rows.filter(r=>!dbState.notifications.some(n=>n.user_id===r.user_id&&n.k===opts.k)):rows;
    if(filtered.length){await supabase.from("notifications").insert(filtered);await loadAll();}
  }
  const pmIds = () => dbState.users.filter(u=>u.role==="PM"&&!u.pending).map(u=>u.id);

  /* --- ト�Eスト�E確誁E--- */
  function toast(msg){setToastMsg(msg);if(toastT.current)clearTimeout(toastT.current);toastT.current=setTimeout(()=>setToastMsg(null),2800);}
  function ask(msg){return new Promise(resolve=>setConfirmReq({msg,resolve}));}
  function nav(page,params={}){setView({page,...params});}

  /* --- 認証 --- */
  async function doLogin(email,pw) {
    const {error} = await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password:pw});
    if(error) {
      if(error.message.includes("Invalid login")) return "メールアドレスまた�Eパスワードが正しくありません";
      return error.message;
    }
    // profileはonAuthStateChangeで設定されるが、pendingチェチE��を追加
    const {data} = await supabase.from("users").select("*").eq("email",email.trim().toLowerCase()).single();
    if(data&&data.pending) {
      await supabase.auth.signOut();
      return "PM権限�E申請が承認征E��です。既存�EPMによる承認をお征E��ください、E;
    }
    return null;
  }

  async function doSignUp(email,pw,name,role="Member",reason="") {
    const em=email.trim().toLowerCase();
    // メール重褁E��ェチE��
    const {data:existing}=await supabase.from("users").select("id").eq("email",em);
    if(existing&&existing.length) return "そ�Eメールアドレスはすでに登録されてぁE��ぁE;
    // Supabase AuthにサインアチE�E
    const {data:authData,error:authError}=await supabase.auth.signUp({email:em,password:pw});
    if(authError) return authError.message;
    const authId = authData.user?.id;
    // public.usersに追加
    const {data:allUsers}=await supabase.from("users").select("id");
    const nu={id:uid(),auth_id:authId,name:name.trim(),email:em,role,avatar_color:AV_COLORS[(allUsers||[]).length%AV_COLORS.length],pending:role==="PM",must_change:false,pm_apply_reason:reason,created_at:Date.now()};
    const {error:insertError}=await supabase.from("users").insert(nu);
    if(insertError) return insertError.message;
    // PMへ通知
    const {data:pms}=await supabase.from("users").select("id").eq("role","PM").eq("pending",false);
    if(pms&&pms.length){
      const msg=role==="PM"?`PM権限申諁E ${name} (${em})${reason?"  E"+reason:""}`:`新しいMemberが登録しました: ${name} (${em})`;
      await supabase.from("notifications").insert(pms.map(p=>({id:uid(),user_id:p.id,type:"system",message:msg,read:false,email:false,k:null,created_at:Date.now()})));
    }
    if(role==="PM") {
      await supabase.auth.signOut();
      return null; // 申請完亁EログインしなぁE
    }
    return null;
  }

  async function doLogout(){await supabase.auth.signOut();setView({page:"dash"});}
  async function setTheme2(t){setTheme(t);LS.set("fn:theme",t);}

  /* --- 期日リマインダー --- */
  async function runDeadlineScan(){
    const tasks=dbState.tasks.filter(t=>t.status!=="done"&&t.assigned_user_id&&t.deadline&&daysUntil(t.deadline)>=0&&daysUntil(t.deadline)<=3);
    for(const t of tasks) await notifyUsers([t.assigned_user_id],"deadline",`、E{t.title}」�E期日ぁE{daysUntil(t.deadline)===0?"今日":daysUntil(t.deadline)+"日征E}でぁE(${t.deadline})`,{k:"dl:"+t.id+":"+t.deadline});
  }
  const scanned=useRef(false);
  useEffect(()=>{if(loaded&&profile&&!scanned.current){scanned.current=true;runDeadlineScan();}},[loaded,profile]);

  /* --- タイマ�E --- */
  async function startTimer(task){
    if(timer){toast("先に計測中のタスクを停止してください");return;}
    const tm={taskId:task.id,startedAt:Date.now()};
    setTimer(tm);LS.set("fn:timer",tm);
    if(task.status==="todo") await updateRow("tasks",{id:task.id},{status:"in_progress"});
    toast("計測を開始しました");
  }
  async function stopTimer(){
    if(!timer) return;
    const task=dbState.tasks.find(t=>t.id===timer.taskId);
    const seconds=Math.max(1,Math.floor((Date.now()-timer.startedAt)/1000));
    setTimerDone({task,seconds,startedAt:timer.startedAt});
    setTimer(null);LS.del("fn:timer");
  }
  async function commitWorkLog(task,startedAt,measuredSec,editedMin,note){
    const dur=Math.min(editedMin,measuredSec/60);
    const before=workedMin(dbState.worklogs,task.id);
    await insertRow("worklogs",{id:uid(),task_id:task.id,user_id:profile.id,started_at:startedAt,ended_at:startedAt+measuredSec*1000,duration_min:Math.round(dur*100)/100,note:(note||"").slice(0,100),confirmed:true,created_at:Date.now()});
    const after=before+dur; const lim=task.max_minutes||0;
    if(lim>0){
      if(after>=lim&&before<lim){await notifyUsers(pmIds(),"over",`${profile.name} のタスク、E{task.title}」が稼働上限を趁E��しました`,{email:true});toast("⚠ 稼働上限を趁E��しました。PMに連絡してください、E);}
      else if(after>=lim*0.9&&before<lim*0.9){await notifyUsers(pmIds(),"limit90",`${profile.name} のタスク、E{task.title}」が稼働上限の90%を趁E��ました`,{email:true});toast("稼働時間が上限の90%を趁E��ました");}
      else toast("稼働を記録しました");
    } else toast("稼働を記録しました");
    setTimerDone(null);
  }

  const appVal={db:dbState,user:profile,view,nav,theme,setTheme:setTheme2,refresh,insertRow,updateRow,deleteRow,notifyUsers,pmIds,toast,ask,timer,now,startTimer,stopTimer,openTaskId,setOpenTaskId,doLogout,commitWorkLog};

  if(!loaded) return <div className={"kd "+theme}><style>{CSS}</style><div className="flex items-center justify-center" style={{minHeight:"100vh",color:"var(--muted)"}}>読み込み中…</div></div>;

  return (
    <Ctx.Provider value={appVal}>
      <div className={"kd "+theme}>
        <style>{CSS}</style>
        {!profile
          ? <AuthView doLogin={doLogin} doSignUp={doSignUp} hasUsers={dbState.users.length>0}/>
          : (profile.must_change?<ForcePwView/>:<Shell/>)}
        {toastMsg&&<div className="toastbox">{toastMsg}</div>}
        <Modal open={!!confirmReq} onClose={()=>{confirmReq&&confirmReq.resolve(false);setConfirmReq(null);}} title="確誁E>
          <p className="text-sm mb-5">{confirmReq&&confirmReq.msg}</p>
          <div className="flex justify-end gap-2">
            <button className="btn" onClick={()=>{confirmReq.resolve(false);setConfirmReq(null);}}>キャンセル</button>
            <button className="btn btn-p" onClick={()=>{confirmReq.resolve(true);setConfirmReq(null);}}>実行すめE/button>
          </div>
        </Modal>
        {timerDone&&<TimerConfirmModal data={timerDone} onClose={()=>setTimerDone(null)}/>}
      </div>
    </Ctx.Provider>
  );
}

/* ============================================================
   認証画面
   ============================================================ */
function AuthView({doLogin,doSignUp,hasUsers}){
  const [mode,setMode]=useState(hasUsers?"login":"setup");
  const [seedInfo,setSeedInfo]=useState(null);
  if(mode==="seed_done"&&seedInfo) return <SeedDoneView seedInfo={seedInfo} doLogin={doLogin}/>;
  if(mode==="setup") return <SetupView doLogin={doLogin} doSignUp={doSignUp} onSeedDone={info=>{setSeedInfo(info);setMode("seed_done");}}/>;
  if(mode==="register") return <RegisterView doSignUp={doSignUp} doLogin={doLogin} toLogin={()=>setMode("login")}/>;
  if(mode==="pm_apply") return <PMApplyView doSignUp={doSignUp} toLogin={()=>setMode("login")}/>;
  return <LoginView doLogin={doLogin} toRegister={()=>setMode("register")} toPMApply={()=>setMode("pm_apply")}/>;
}

function LoginView({doLogin,toRegister,toPMApply}){
  const [email,setEmail]=useState(""); const [pw,setPw]=useState("");
  const [show,setShow]=useState(false); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(){setBusy(true);setErr("");const e=await doLogin(email,pw);setBusy(false);if(e)setErr(e);}
  return(
    <div className="flex items-center justify-center px-4" style={{minHeight:"100vh"}}>
      <div className="panel p-6 w-full" style={{maxWidth:400}}>
        <BrandMark/>
        <h2 className="text-base font-bold mt-6 mb-4 ledger pb-2">ログイン</h2>
        <Field label="メールアドレス"><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></Field>
        <Field label="パスワーチE>
          <div className="relative">
            <input type={show?"text":"password"} className="input" style={{paddingRight:40}} value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
            <button className="iconbtn" style={{position:"absolute",right:2,top:1}} onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
        </Field>
        {err&&<div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center mb-4" disabled={busy} onClick={submit}>{busy?"確認中…":"ログイン"}</button>
        <div className="flex flex-col gap-2">
          <button className="btn w-full justify-center" onClick={toRegister}><User size={15}/>新規登録 (Member)</button>
          <button className="btn w-full justify-center" onClick={toPMApply}><Shield size={15}/>PM権限を申請すめE/button>
        </div>
        <p className="text-xs mt-4" style={{color:"var(--muted)"}}>パスワードを忘れた場合�EPMに再発行を依頼してください、E/p>
      </div>
    </div>
  );
}

function RegisterView({doSignUp,doLogin,toLogin}){
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [show,setShow]=useState(false); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(){
    setErr("");
    if(!name.trim()){setErr("名前を�E力してください");return;}
    if(!email.includes("@")){setErr("有効なメールアドレスを�E力してください");return;}
    if(pw.length<6){setErr("パスワード�E6斁E��以上にしてください");return;}
    if(pw!==pw2){setErr("確認用パスワードが一致しません");return;}
    setBusy(true);
    const e=await doSignUp(email,pw,name,"Member");
    if(e){setErr(e);setBusy(false);return;}
    await doLogin(email,pw);
  }
  return(
    <div className="flex items-center justify-center px-4" style={{minHeight:"100vh"}}>
      <div className="panel p-6 w-full" style={{maxWidth:420}}>
        <BrandMark/>
        <h2 className="text-base font-bold mt-5 mb-1 ledger pb-2">新規登録  EMember</h2>
        <p className="text-xs mb-4" style={{color:"var(--muted)"}}>登録後すぐにMemberとしてログインできます、E/p>
        <Field label="名前"><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="山田 太郁E/></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></Field>
        <Field label="パスワーチE(6斁E��以丁E">
          <div className="relative">
            <input type={show?"text":"password"} className="input" style={{paddingRight:40}} value={pw} onChange={e=>setPw(e.target.value)}/>
            <button className="iconbtn" style={{position:"absolute",right:2,top:1}} onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
        </Field>
        <Field label="パスワーチE(確誁E"><input type="password" className="input" value={pw2} onChange={e=>setPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></Field>
        {err&&<div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center mb-3" disabled={busy} onClick={submit}>{busy?"登録中…":"登録してログイン"}</button>
        <button className="btn w-full justify-center" onClick={toLogin}><ArrowLeft size={14}/>ログインに戻めE/button>
      </div>
    </div>
  );
}

function PMApplyView({doSignUp,toLogin}){
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [pw,setPw]=useState(""); const [pw2,setPw2]=useState(""); const [reason,setReason]=useState("");
  const [show,setShow]=useState(false); const [err,setErr]=useState(""); const [busy,setBusy]=useState(false); const [done,setDone]=useState(false);
  async function submit(){
    setErr("");
    if(!name.trim()||!email.includes("@")||pw.length<6||pw!==pw2){setErr("すべての頁E��を正しく入力してください");return;}
    setBusy(true);
    const e=await doSignUp(email,pw,name,"PM",reason);
    if(e){setErr(e);setBusy(false);return;}
    setBusy(false);setDone(true);
  }
  if(done) return(
    <div className="flex items-center justify-center px-4" style={{minHeight:"100vh"}}>
      <div className="panel p-6 w-full text-center" style={{maxWidth:400}}>
        <BrandMark/><CheckCircle2 size={40} style={{color:"var(--green)",margin:"20px auto 12px"}}/>
        <h2 className="text-base font-bold mb-2">申請を送信しました</h2>
        <p className="text-sm mb-5" style={{color:"var(--muted)"}}>既存�EPMが承認するとログインできます、E/p>
        <button className="btn w-full justify-center" onClick={toLogin}><ArrowLeft size={14}/>ログインに戻めE/button>
      </div>
    </div>
  );
  return(
    <div className="flex items-center justify-center px-4" style={{minHeight:"100vh"}}>
      <div className="panel p-6 w-full" style={{maxWidth:420}}>
        <BrandMark/>
        <h2 className="text-base font-bold mt-5 mb-1 ledger pb-2">PM権限�E申諁E/h2>
        <p className="text-xs mb-4" style={{color:"var(--muted)"}}>既存�EPMが承認するまでログインできません、E/p>
        <Field label="名前"><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="山田 太郁E/></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></Field>
        <Field label="パスワーチE(6斁E��以丁E">
          <div className="relative">
            <input type={show?"text":"password"} className="input" style={{paddingRight:40}} value={pw} onChange={e=>setPw(e.target.value)}/>
            <button className="iconbtn" style={{position:"absolute",right:2,top:1}} onClick={()=>setShow(!show)}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
          </div>
        </Field>
        <Field label="パスワーチE(確誁E"><input type="password" className="input" value={pw2} onChange={e=>setPw2(e.target.value)}/></Field>
        <Field label="申請理由 (任愁E"><textarea className="textarea" style={{minHeight:64}} value={reason} onChange={e=>setReason(e.target.value)} placeholder="所属�E役割など"/></Field>
        {err&&<div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center mb-3" disabled={busy} onClick={submit}>{busy?"送信中…":"PM権限を申請すめE}</button>
        <button className="btn w-full justify-center" onClick={toLogin}><ArrowLeft size={14}/>ログインに戻めE/button>
      </div>
    </div>
  );
}

function SetupView({doLogin,doSignUp,onSeedDone}){
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [pw,setPw]=useState(""); const [seed,setSeed]=useState(true);
  const [busy,setBusy]=useState(false); const [err,setErr]=useState("");
  async function submit(){
    if(!name.trim()||!email.includes("@")||pw.length<6){setErr("名前・メールアドレス・パスワーチE6斁E��以丁Eを�E力してください");return;}
    setBusy(true);
    try{
      // PMアカウント作�E
      const e=await doSignUp(email,pw,name,"PM");
      if(e){setErr(e);setBusy(false);return;}
      // auth_idを取得してpendingを解除
      const {data:authData}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password:pw});
      if(authData?.user){
        await supabase.from("users").update({pending:false,auth_id:authData.user.id}).eq("email",email.trim().toLowerCase());
      }
      let memberCreds=[];
      if(seed){
        const demo=[["佐藤 美咲","misaki@example.com"],["田中 蒼省E,"soma@example.com"],["鈴木 健","ken@example.com"]];
        const members=[];
        for(let i=0;i<demo.length;i++){
          const p2="demo1234";
          const {data:ad}=await supabase.auth.admin ? {data:null} : await supabase.auth.signUp({email:demo[i][1],password:p2});
          const authId=ad?.user?.id;
          const {data:allU}=await supabase.from("users").select("id");
          const mu={id:uid(),auth_id:authId||null,name:demo[i][0],email:demo[i][1],role:"Member",avatar_color:AV_COLORS[(allU||[]).length%AV_COLORS.length],pending:false,must_change:false,created_at:Date.now()};
          await supabase.from("users").insert(mu);
          members.push(mu); memberCreds.push({name:mu.name,email:mu.email,pw:p2});
        }
        const d=new Date(); const iso=off=>{const x=new Date(d);x.setDate(d.getDate()+off);return x.toISOString().slice(0,10);};
        const {data:pmRow}=await supabase.from("users").select("id").eq("email",email.trim().toLowerCase()).single();
        const pmId=pmRow?.id;
        const p1={id:uid(),name:"会員アプリ v2 開発",description:"モバイル会員アプリのリニューアル",budget:1200000,status:"active",start_date:iso(-20),end_date:iso(40),member_ids:members.map(x=>x.id),notion_url:"",created_at:Date.now()};
        const p2j={id:uid(),name:"営業賁E��チE��プレ整傁E,description:"提案書・見積テンプレート�E標準化",budget:300000,status:"active",start_date:iso(-10),end_date:iso(25),member_ids:[members[0].id,members[2].id],notion_url:"",created_at:Date.now()};
        await supabase.from("projects").insert([p1,p2j]);
        const mk=(pj,title,goal,assignee,pr,bud,maxH,dl,st)=>({id:uid(),project_id:pj.id,title,description:title+"の対応を行う、E,goal,assigned_user_id:assignee,budget:bud,max_minutes:maxH*60,deadline:iso(dl),status:st,priority:pr,created_at:Date.now()});
        const tasks=[
          mk(p1,"ログイン画面の実裁E,"メール認証・エラー表示まで完亁E��せる",members[0].id,"high",150000,20,5,"in_progress"),
          mk(p1,"プッシュ通知基盤の構篁E,"iOS/Android双方で受信確誁E,members[1].id,"high",200000,30,12,"in_progress"),
          mk(p1,"会員ランクAPIの設訁E,"API仕様書レビュー承認まで",members[2].id,"medium",120000,16,8,"todo"),
          mk(p1,"利用規紁E�Eージ更新","法務確認済みチE��スト�E反映",members[0].id,"low",30000,4,2,"done"),
          mk(p1,"画像アチE�Eロード最適匁E,"3MBↁE00KB圧縮パイプライン導�E",null,"medium",90000,12,18,"todo"),
          mk(p2j,"提案書チE��プレ v1","3案件で使えるマスター賁E��完�E",members[0].id,"medium",80000,10,6,"in_progress"),
          mk(p2j,"見積計算シート整傁E,"係数変更に耐える計算式に更新",members[2].id,"high",100000,14,3,"todo"),
          mk(p2j,"過去事例集の作�E","10事例を1枚ずつに要紁E,null,"low",60000,8,20,"todo"),
        ];
        await supabase.from("tasks").insert(tasks);
        const wl=(t,u2,min,dayOff,note)=>{const st=Date.now()-dayOff*864e5-min*60000;return{id:uid(),task_id:t.id,user_id:u2,started_at:st,ended_at:st+min*60000,duration_min:min,note,confirmed:true,created_at:Date.now()};};
        await supabase.from("worklogs").insert([
          wl(tasks[0],members[0].id,240,3,"UI絁E��込み"),wl(tasks[0],members[0].id,180,1,"バリチE�Eション実裁E),
          wl(tasks[1],members[1].id,300,4,"FCM設宁E),wl(tasks[1],members[1].id,420,2,"端末検証"),
          wl(tasks[1],members[1].id,900,1,"iOS対応で難航"),
          wl(tasks[3],members[0].id,200,6,"反映と確誁E),wl(tasks[5],members[0].id,150,2,"構�E案作�E"),
        ]);
        setBusy(false);
        onSeedDone({creds:memberCreds,email:email.trim().toLowerCase(),pw});
      } else {
        setBusy(false);
        await doLogin(email,pw);
      }
    }catch(e){setErr("セチE��アチE�Eに失敗しました: "+e.message);setBusy(false);}
  }
  return(
    <div className="flex items-center justify-center px-4" style={{minHeight:"100vh"}}>
      <div className="panel p-6 w-full" style={{maxWidth:440}}>
        <BrandMark/>
        <p className="text-sm mt-3 mb-1" style={{color:"var(--muted)"}}>チ�Eムの稼働とタスクを�Eとつの帳面に、E/p>
        <h2 className="text-base font-bold mt-4 mb-3 ledger pb-2">初回セチE��アチE�E  EPMアカウント作�E</h2>
        <Field label="名前"><input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="山田 太郁E/></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="pm@example.com"/></Field>
        <Field label="パスワーチE(6斁E��以丁E"><input type="password" className="input" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></Field>
        <label className="flex items-center gap-2 text-sm mb-4 cursor-pointer"><input type="checkbox" checked={seed} onChange={e=>setSeed(e.target.checked)}/>チE��チE�Eタを投入する</label>
        {err&&<div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center" disabled={busy} onClick={submit}>{busy?"作�E中…":"はじめめE}</button>
      </div>
    </div>
  );
}

function SeedDoneView({seedInfo,doLogin}){
  const [busy,setBusy]=useState(false); const [err,setErr]=useState("");
  async function handleLogin(){
    if(busy) return; setBusy(true); setErr("");
    for(let i=0;i<3;i++){
      await new Promise(r=>setTimeout(r,i===0?800:1000));
      const result=await doLogin(seedInfo.email,seedInfo.pw);
      if(!result) return;
      if(i===2) setErr(result);
    }
    setBusy(false);
  }
  return(
    <div className="flex items-center justify-center px-4" style={{minHeight:"100vh"}}>
      <div className="panel p-6 w-full" style={{maxWidth:480}}>
        <BrandMark size={22}/>
        <h2 className="text-base font-bold mt-5 mb-2">セチE��アチE�E完亁E/h2>
        <p className="text-sm mb-3" style={{color:"var(--muted)"}}>チE��用メンバ�Eのログイン惁E��でぁEこ�E画面でのみ表示)、E/p>
        <div className="panel p-3 mb-4" style={{background:"var(--panel2)"}}>
          {seedInfo.creds.map(c=><div key={c.email} className="text-sm mono py-1">{c.name}  E{c.email} / {c.pw}</div>)}
        </div>
        {err&&<div className="err mb-2">{err}</div>}
        <button className="btn btn-p w-full justify-center" disabled={busy} onClick={handleLogin} onTouchEnd={e=>{e.preventDefault();handleLogin();}}>
          {busy?"ログイン中…":"PMとしてログイン"}
        </button>
      </div>
    </div>
  );
}

function ForcePwView(){
  const {user,updateRow,doLogout,toast}=useApp();
  const [pw,setPw]=useState(""); const [pw2,setPw2]=useState(""); const [err,setErr]=useState("");
  async function submit(){
    if(pw.length<6){setErr("6斁E��以上にしてください");return;}
    if(pw!==pw2){setErr("確認用パスワードが一致しません");return;}
    const {error}=await supabase.auth.updateUser({password:pw});
    if(error){setErr(error.message);return;}
    await updateRow("users",{id:user.id},{must_change:false});
    toast("パスワードを更新しました");
  }
  return(
    <div className="flex items-center justify-center px-4" style={{minHeight:"100vh"}}>
      <div className="panel p-6 w-full" style={{maxWidth:400}}>
        <BrandMark size={22}/>
        <h2 className="text-base font-bold mt-5 mb-2">初回パスワード変更</h2>
        <p className="text-sm mb-4" style={{color:"var(--muted)"}}>仮パスワードでログインしてぁE��す。新しいパスワードを設定してください、E/p>
        <Field label="新しいパスワーチE><input type="password" className="input" value={pw} onChange={e=>setPw(e.target.value)}/></Field>
        <Field label="新しいパスワーチE(確誁E"><input type="password" className="input" value={pw2} onChange={e=>setPw2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></Field>
        {err&&<div className="err mb-3">{err}</div>}
        <button className="btn btn-p w-full justify-center" onClick={submit}>設定すめE/button>
      </div>
    </div>
  );
}

/* ============================================================
   Shell・ナビ・TopBar・検索・通知
   ============================================================ */
function Shell() {
  return (
    <div className="flex" style={{minHeight:"100vh"}}>
      <SideNav/>
      <div className="flex-1 flex flex-col" style={{minWidth:0}}>
        <TopBar/>
        <main className="flex-1 w-full px-4 py-5 md:px-8 md:py-6" style={{maxWidth:1180,margin:"0 auto",paddingBottom:110}}>
          <PageRouter/>
        </main>
      </div>
      <FloatingTimer/>
      <BottomNav/>
      <MemberTaskModalHost/>
    </div>
  );
}

function PageRouter() {
  const {view,user}=useApp();
  const isPM=user.role==="PM";
  const p=view.page;
  if(isPM){
    if(p==="dash") return <PMDashboard/>;
    if(p==="projects") return <ProjectsView/>;
    if(p==="project") return <ProjectDetail id={view.id} tab={view.tab}/>;
    if(p==="requests") return <RequestsView/>;
    if(p==="users") return <UsersView/>;
    if(p==="profile") return <ProfileView/>;
    return <PMDashboard/>;
  }
  if(p==="mydash"||p==="dash") return <MemberDashboard/>;
  if(p==="mytasks") return <MemberTasks/>;
  if(p==="unassigned") return <UnassignedView/>;
  if(p==="history") return <HistoryView/>;
  if(p==="profile") return <ProfileView/>;
  return <MemberDashboard/>;
}

const NAV_PM=[{page:"dash",label:"ダチE��ュボ�EチE,icon:Home},{page:"projects",label:"プロジェクチE,icon:Briefcase},{page:"requests",label:"申請管琁E,icon:Inbox},{page:"users",label:"ユーザー管琁E,icon:Users}];
const NAV_M=[{page:"mydash",label:"ホ�Eム",icon:Home},{page:"mytasks",label:"マイタスク",icon:ClipboardList},{page:"history",label:"稼働履歴",icon:History}];

function SideNav() {
  const {user,view,nav,db}=useApp();
  const items=user.role==="PM"?NAV_PM:NAV_M;
  const pending=user.role==="PM"?db.requests.filter(r=>r.status==="pending").length:0;
  return (
    <aside className="hidden md:flex flex-col gap-1 p-4" style={{width:220,borderRight:"1px solid var(--border)",flexShrink:0}}>
      <div className="mb-6 mt-1 px-2"><BrandMark size={20}/></div>
      {items.map(it=>(
        <div key={it.page} className={"navi"+(view.page===it.page||(it.page==="projects"&&view.page==="project")?" on":"")} onClick={()=>nav(it.page)}>
          <it.icon size={17} strokeWidth={2}/><span className="flex-1">{it.label}</span>
          {it.page==="requests"&&pending>0&&<Badge cls="b-red">{pending}</Badge>}
        </div>
      ))}
      <div className="flex-1"/>
      <div className="text-xs px-2 pb-1" style={{color:"var(--muted)"}}>{user.role==="PM"?"PMアカウンチE:"MemberアカウンチE}</div>
    </aside>
  );
}

function BottomNav() {
  const {user,view,nav,db}=useApp();
  const items=user.role==="PM"?NAV_PM:NAV_M;
  const pending=user.role==="PM"?db.requests.filter(r=>r.status==="pending").length:0;
  return (
    <nav className="md:hidden" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:45,background:"var(--panel)",borderTop:"1px solid var(--border)",display:"flex"}}>
      {items.map(it=>{
        const on=view.page===it.page||(it.page==="projects"&&view.page==="project");
        return (
          <button key={it.page} onClick={()=>nav(it.page)} className="flex-1 flex flex-col items-center gap-1 py-2"
            style={{background:"none",border:"none",color:on?"var(--ai)":"var(--muted)",fontSize:10,fontWeight:on?700:500,cursor:"pointer",position:"relative",touchAction:"manipulation"}}>
            <it.icon size={20} strokeWidth={on?2.4:2}/>{it.label}
            {it.page==="requests"&&pending>0&&<span className="dot" style={{top:2,right:"24%"}}>{pending}</span>}
          </button>
        );
      })}
    </nav>
  );
}

function TopBar() {
  const {nav,theme,setTheme,doLogout,refresh,toast,user}=useApp();
  const [menuOpen,setMenuOpen]=useState(false);
  const [trayOpen,setTrayOpen]=useState(false);
  return (
    <header className="flex items-center gap-2 px-4 md:px-8 py-3" style={{borderBottom:"1px solid var(--border)",background:"var(--panel)",position:"sticky",top:0,zIndex:30}}>
      <div className="md:hidden mr-1"><BrandMark size={16}/></div>
      <SearchBox/>
      <div className="flex-1"/>
      <button className="iconbtn" onClick={async()=>{await refresh();toast("最新のチE�Eタを取得しました");}} aria-label="更新"><RefreshCw size={17}/></button>
      <button className="iconbtn" onClick={()=>setTheme(theme==="light"?"dark":"light")} aria-label="チE�Eマ�E替">{theme==="light"?<Moon size={17}/>:<Sun size={17}/>}</button>
      <div className="relative">
        <NotifBell onToggle={()=>setTrayOpen(!trayOpen)}/>
        {trayOpen&&<NotifTray onClose={()=>setTrayOpen(false)}/>}
      </div>
      <div className="relative">
        <button style={{background:"none",border:"none",cursor:"pointer",padding:2,touchAction:"manipulation"}} onClick={()=>setMenuOpen(!menuOpen)}>
          <Avatar user={user} size={32}/>
        </button>
        {menuOpen&&(
          <div className="panel searchdrop" style={{left:"auto",right:0,width:200,top:42,padding:6}}>
            <div className="px-3 py-2 text-sm font-bold">{user.name}</div>
            <div className="px-3 pb-2 text-xs" style={{color:"var(--muted)"}}>{user.email}</div>
            <div className="navi" onClick={()=>{setMenuOpen(false);nav("profile");}}><Settings size={15}/>プロフィール設宁E/div>
            <div className="navi" onClick={doLogout}><LogOut size={15}/>ログアウチE/div>
          </div>
        )}
      </div>
    </header>
  );
}

function NotifBell({onToggle}) {
  const {db,user}=useApp();
  const unread=db.notifications.filter(n=>n.user_id===user.id&&!n.read).length;
  return <button className="iconbtn" onClick={onToggle} aria-label="通知"><Bell size={17}/>{unread>0&&<span className="dot">{unread>99?"99+":unread}</span>}</button>;
}

function NotifTray({onClose}) {
  const {db,user,updateRow}=useApp();
  const mine=db.notifications.filter(n=>n.user_id===user.id).slice(0,60);
  async function markAll() { const unread=mine.filter(x=>!x.read); if(unread.length) { await supabase.from("notifications").update({read:true}).in("id",unread.map(x=>x.id)); await refresh(); } }
  async function markOne(id) { await updateRow("notifications",{id},{read:true}); }
  return (
    <div className="panel searchdrop" style={{left:"auto",right:-44,width:"min(380px, 92vw)",top:42,padding:0,overflow:"hidden"}}>
      <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:"3px double var(--border)"}}>
        <span className="text-sm font-bold">通知</span>
        <div className="flex gap-1">
          <button className="btn btn-sm" onClick={markAll}>全て既読</button>
          <button className="iconbtn" style={{width:28,height:28}} onClick={onClose}><X size={15}/></button>
        </div>
      </div>
      <div style={{maxHeight:380,overflowY:"auto"}}>
        {mine.length===0&&<Empty text="通知はありません" icon={Bell}/>}
        {mine.map(n=>{const meta=NT_META[n.type]||NT_META.system;const I=meta.icon;return(
          <div key={n.id} className={"notifitem"+(n.read?"":" unread")} onClick={()=>markOne(n.id)} style={{cursor:n.read?"default":"pointer"}}>
            <I size={17} style={{color:n.type==="over"||n.type==="reject"?"var(--red)":n.type==="limit90"||n.type==="deadline"?"var(--amber)":"var(--ai)",flexShrink:0,marginTop:2}}/>
            <div className="flex-1" style={{minWidth:0}}>
              <div className="text-sm" style={{wordBreak:"break-word"}}>{n.message}</div>
              <div className="text-xs mt-1" style={{color:"var(--muted)"}}>{fmtDT(n.created_at)}{n.email&&<span className="ml-2 flex items-center gap-1" style={{display:"inline-flex"}}><Mail size={11}/>メール対象</span>}</div>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
}

function SearchBox() {
  const {db,user,nav,setOpenTaskId}=useApp();
  const [q,setQ]=useState(""); const [open,setOpen]=useState(false);
  const isPM=user.role==="PM";
  const results=useMemo(()=>{
    const s=q.trim().toLowerCase(); if(s.length<1) return {projects:[],tasks:[]};
    const myPjs=isPM?db.projects:db.projects.filter(p=>(p.member_ids||[]).includes(user.id));
    const projects=myPjs.filter(p=>(p.name+(p.description||"")).toLowerCase().includes(s)).slice(0,5);
    const tasks=db.tasks.filter(t=>(isPM||t.assigned_user_id===user.id)&&(t.title+(t.description||"")).toLowerCase().includes(s)).slice(0,7);
    return {projects,tasks};
  },[q,db,isPM,user.id]);
  return (
    <div className="relative flex-1" style={{maxWidth:380}}>
      <div className="relative">
        <Search size={15} style={{position:"absolute",left:11,top:11,color:"var(--muted)"}}/>
        <input className="input" style={{paddingLeft:32}} placeholder="プロジェクト�Eタスクを検索" value={q} onChange={e=>{setQ(e.target.value);setOpen(true);}} onFocus={()=>setOpen(true)} onBlur={()=>setTimeout(()=>setOpen(false),180)}/>
      </div>
      {open&&q.trim()&&(
        <div className="panel searchdrop p-1">
          {results.projects.length===0&&results.tasks.length===0&&<div className="p-3 text-sm" style={{color:"var(--muted)"}}>該当なぁE/div>}
          {results.projects.map(p=><div key={p.id} className="navi" onMouseDown={()=>{isPM?nav("project",{id:p.id}):nav("mytasks");setQ("");}}>
            <Briefcase size={14}/><span className="flex-1 truncate">{p.name}</span><Badge cls={PJ_BADGE[p.status]}>{PJST[p.status]}</Badge>
          </div>)}
          {results.tasks.map(t=>{const pj=db.projects.find(p=>p.id===t.project_id);return(
            <div key={t.id} className="navi" onMouseDown={()=>{if(isPM)nav("project",{id:t.project_id});else setOpenTaskId(t.id);setQ("");}}>
              <ClipboardList size={14}/><span className="flex-1 truncate">{t.title}<span className="text-xs ml-2" style={{color:"var(--muted)"}}>{pj?pj.name:""}</span></span>
              <Badge cls={ST_BADGE[t.status]}>{ST[t.status]}</Badge>
            </div>);
          })}
        </div>
      )}
    </div>
  );
}

function FloatingTimer() {
  const {timer,now,db,stopTimer,setOpenTaskId}=useApp();
  if(!timer) return null;
  const task=db.tasks.find(t=>t.id===timer.taskId);
  const sec=(now-timer.startedAt)/1000;
  return (
    <div className="fixed bottom-16 md:bottom-6" style={{left:"50%",transform:"translateX(-50%)",zIndex:46,width:"min(560px, calc(100vw - 24px))"}}>
      <div className="panel flex items-center gap-3 px-4 py-3" style={{boxShadow:"0 10px 30px rgba(0,0,0,.18)",borderColor:"var(--ai)"}}>
        <span className="pulse"/>
        <div className="flex-1 cursor-pointer" style={{minWidth:0}} onClick={()=>task&&setOpenTaskId(task.id)}>
          <div className="text-xs" style={{color:"var(--muted)"}}>計測中</div>
          <div className="text-sm font-bold truncate">{task?task.title:"(削除されたタスク)"}</div>
        </div>
        <div className="mono text-lg font-bold">{fmtHMS(sec)}</div>
        <button className="btn btn-p btn-sm" onClick={stopTimer}><Square size={13}/>停止</button>
      </div>
    </div>
  );
}

/* ============================================================
   PM: ダチE��ュボ�Eド�Eプロジェクト一覧・詳細
   ============================================================ */
function PMDashboard() {
  const {db,nav}=useApp();
  const active=db.projects.filter(p=>p.status==="active");
  const [wS,wE]=weekRange();
  const weekMin=db.worklogs.filter(l=>l.started_at>=wS&&l.started_at<wE).reduce((a,l)=>a+l.duration_min,0);
  const weekDone=db.tasks.filter(t=>t.status==="done"&&t.completed_at&&t.completed_at>=wS&&t.completed_at<wE).length;
  const pending=db.requests.filter(r=>r.status==="pending");
  const alerts90=db.tasks.filter(t=>{if(t.status==="done"||!t.max_minutes) return false; const w=workedMin(db.worklogs,t.id); return w>=t.max_minutes*0.9;});
  const overdue=db.tasks.filter(t=>t.status!=="done"&&t.deadline&&daysUntil(t.deadline)<0);
  const members=db.users.filter(u=>u.role==="Member");
  return (
    <div>
      <PageTitle title="ダチE��ュボ�EチE sub="チ�Eム全体�E稼働状況E/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="アクチE��ブPJ" value={active.length} unit="件"/>
        <StatCard label="今週のチ�Eム稼僁E value={fmtHM(weekMin)} unit="" mono/>
        <StatCard label="今週の完亁E��スク" value={weekDone} unit="件"/>
        <StatCard label="申請征E��" value={pending.length} unit="件" warn={pending.length>0} onClick={()=>nav("requests")}/>
      </div>
      {(alerts90.length>0||overdue.length>0||pending.length>0)&&(
        <section className="panel p-4 mb-6">
          <SecTitle icon={AlertTriangle} title="アラーチE tone="var(--amber)"/>
          <div className="flex flex-col gap-2">
            {overdue.map(t=><AlertRow key={"o"+t.id} tone="red" text={`期日趁E��: 、E{t.title}、E(期日 ${t.deadline})`} onClick={()=>nav("project",{id:t.project_id})}/>)}
            {alerts90.map(t=>{const w=workedMin(db.worklogs,t.id);const over=w>=t.max_minutes;return <AlertRow key={"a"+t.id} tone={over?"red":"amber"} text={`${over?"上限趁E��":"90%趁E��"}: 、E{t.title}、E${fmtHM(w)} / ${fmtHM(t.max_minutes)}`} onClick={()=>nav("project",{id:t.project_id})}/>;})}
            {pending.length>0&&<AlertRow tone="blue" text={`未処琁E�E申請が ${pending.length} 件あります`} onClick={()=>nav("requests")}/>}
          </div>
        </section>
      )}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold m-0">アクチE��ブ�EロジェクチE/h2>
          <button className="btn btn-sm" onClick={()=>nav("projects")}>すべて見る<ChevronRight size={13}/></button>
        </div>
        {active.length===0?<div className="panel"><Empty icon={Briefcase} text="アクチE��ブなプロジェクトがありません"/></div>:(
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{active.map(p=><ProjectCard key={p.id} p={p}/>)}</div>
        )}
      </section>
      <section className="panel p-4">
        <SecTitle icon={Clock} title="メンバ�E稼働ヒート�EチE�E (直迁E日)"/>
        <Heatmap members={members} logs={db.worklogs}/>
      </section>
    </div>
  );
}

function Heatmap({members,logs}) {
  const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(6-i));return d;});
  const cell=(u,d)=>{const s=d.getTime(),e=s+864e5;return logs.filter(l=>l.user_id===u.id&&l.started_at>=s&&l.started_at<e).reduce((a,l)=>a+l.duration_min,0);};
  if(members.length===0) return <Empty icon={Users} text="メンバ�Eがいません"/>;
  return (
    <div style={{overflowX:"auto"}}>
      <div style={{minWidth:460}}>
        <div className="grid gap-1 mb-1" style={{gridTemplateColumns:"120px repeat(7, 1fr)"}}>
          <div/>{days.map((d,i)=><div key={i} className="text-center text-xs" style={{color:"var(--muted)"}}>{d.getMonth()+1}/{d.getDate()}</div>)}
        </div>
        {members.map(u=>(
          <div key={u.id} className="grid gap-1 mb-1 items-center" style={{gridTemplateColumns:"120px repeat(7, 1fr)"}}>
            <div className="flex items-center gap-2 text-xs truncate"><Avatar user={u} size={20}/>{u.name}</div>
            {days.map((d,i)=>{const m=cell(u,d);const alpha=m<=0?0:Math.min(0.95,0.18+(m/480)*0.8);return <div key={i} className="hcell" title={`${u.name} ${d.getMonth()+1}/${d.getDate()}  E${fmtHM(m)}`} style={m>0?{background:`color-mix(in srgb, var(--ai) ${Math.round(alpha*100)}%, var(--panel2))`}:{}}/>;})}</div>
        ))}
        <div className="text-xs mt-2" style={{color:"var(--muted)"}}>色が濁E��ほど稼働時間が長ぁE8h基溁E</div>
      </div>
    </div>
  );
}

function ProjectCard({p}) {
  const {db,nav}=useApp();
  const st=projectStats(p,db.tasks,db.worklogs);
  const members=(p.member_ids||[]).map(id=>db.users.find(u=>u.id===id)).filter(Boolean);
  return (
    <div className="panel p-4 cursor-pointer" onClick={()=>nav("project",{id:p.id})}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="font-bold text-sm truncate flex-1">{p.name}</div>
        <Badge cls={PJ_BADGE[p.status]} dot>{PJST[p.status]}</Badge>
      </div>
      <div className="flex items-center justify-between text-xs mb-1" style={{color:"var(--muted)"}}><span>予算消化</span><span className="mono">{Math.round(st.consumedRate*100)}%</span></div>
      <Prog ratio={st.consumedRate}/>
      <div className="flex items-center justify-between text-xs mt-2 mb-1" style={{color:"var(--muted)"}}><span>タスク完亁E/span><span className="mono">{st.done}/{st.total}</span></div>
      <Prog ratio={st.progress} tone="ok"/>
      <div className="flex items-center justify-between mt-3">
        <div className="flex" style={{paddingLeft:4}}>{members.slice(0,5).map(m=><span key={m.id} style={{marginLeft:-6}}><Avatar user={m} size={24}/></span>)}{members.length>5&&<span className="text-xs ml-1" style={{color:"var(--muted)"}}>+{members.length-5}</span>}</div>
        <div className="flex items-center gap-2 text-xs" style={{color:"var(--muted)"}}>
          {p.notion_url&&<a href={p.notion_url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title="Notionを開ぁE><Link2 size={13}/></a>}
          <Calendar size={12}/>〜{fmtDate(p.end_date)}
        </div>
      </div>
    </div>
  );
}

function ProjectsView() {
  const {db}=useApp();
  const [filter,setFilter]=useState("all");
  const [form,setForm]=useState(null);
  const list=db.projects.filter(p=>filter==="all"||p.status===filter).sort((a,b)=>b.created_at-a.created_at);
  return (
    <div>
      <PageTitle title="プロジェクチE sub={`全 ${db.projects.length} 件`} right={<button className="btn btn-p" onClick={()=>setForm({})}><Plus size={15}/>新規�EロジェクチE/button>}/>
      <div className="mb-4"><Seg value={filter} onChange={setFilter} options={[{value:"all",label:"すべて"},{value:"active",label:"進行中"},{value:"paused",label:"一時停止"},{value:"completed",label:"完亁E}]}/></div>
      {list.length===0?<div className="panel"><Empty icon={Briefcase} text="プロジェクトがありません"/></div>:(
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{list.map(p=><ProjectCard key={p.id} p={p}/>)}</div>
      )}
      {form!==null&&<ProjectForm initial={form.id?form:null} onClose={()=>setForm(null)}/>}
    </div>
  );
}

function ProjectForm({initial, onClose}) {
  const {db,insertRow,updateRow,toast,notifyUsers}=useApp();
  const [f,setF]=useState(initial?{...initial}:{name:"",description:"",budget:"",start_date:todayStr(),end_date:"",member_ids:[],status:"active",notion_url:""});
  const [errs,setErrs]=useState({});
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  function toggleMember(id){set("member_ids",f.member_ids.includes(id)?f.member_ids.filter(x=>x!==id):[...f.member_ids,id]);}
  async function submit() {
    const e={};
    if(!f.name.trim()) e.name="プロジェクト名は忁E��でぁE;
    if(!f.description.trim()) e.description="説明�E忁E��でぁE;
    if(!(Number(f.budget)>0)) e.budget="総予箁E冁Eを�E力してください";
    if(!f.start_date) e.start_date="開始日は忁E��でぁE;
    if(!f.end_date) e.end_date="終亁E��は忁E��でぁE;
    if(f.start_date&&f.end_date&&f.end_date<f.start_date) e.end_date="終亁E��は開始日以降にしてください";
    setErrs(e); if(Object.keys(e).length) return;
    const data={...f,budget:Number(f.budget)};
    if(initial){
      await updateRow("projects",{id:initial.id},data);
      toast("プロジェクトを更新しました");
    } else {
      const row={...data,id:uid(),created_at:Date.now()};
      await insertRow("projects",row);
      await notifyUsers(f.member_ids,"system",`プロジェクト、E{f.name}」に追加されました`);
      toast("プロジェクトを作�Eしました");
    }
    onClose();
  }
  return (
    <Modal open onClose={onClose} title={initial?"プロジェクトを編雁E:"新規�EロジェクチE}>
      <Field label="プロジェクト名 *" error={errs.name}><input className="input" value={f.name} onChange={e=>set("name",e.target.value)}/></Field>
      <Field label="説明�E概要E*" error={errs.description}><textarea className="textarea" value={f.description} onChange={e=>set("description",e.target.value)}/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="総予箁E(冁E *" error={errs.budget}><input type="number" className="input num" value={f.budget} onChange={e=>set("budget",e.target.value)}/></Field>
        <Field label="スチE�Eタス"><select className="select" value={f.status} onChange={e=>set("status",e.target.value)}><option value="active">進行中</option><option value="paused">一時停止</option><option value="completed">完亁E/option></select></Field>
        <Field label="開始日 *" error={errs.start_date}><input type="date" className="input" value={f.start_date} onChange={e=>set("start_date",e.target.value)}/></Field>
        <Field label="終亁E�� *" error={errs.end_date}><input type="date" className="input" value={f.end_date} onChange={e=>set("end_date",e.target.value)}/></Field>
      </div>
      <Field label="参加メンバ�E" hint="タチE�Eで選抁E解除">
        <div className="flex flex-wrap gap-2">{db.users.map(m=><button key={m.id} className={"chip"+(f.member_ids.includes(m.id)?" on":"")} onClick={()=>toggleMember(m.id)}>{m.name}{m.role==="PM"?" (PM)":""}</button>)}</div>
      </Field>
      <Field label="Notion連携 (任愁E"><input className="input" placeholder="https://www.notion.so/..." value={f.notion_url||""} onChange={e=>set("notion_url",e.target.value)}/></Field>
      <div className="flex justify-end gap-2 mt-4">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn btn-p" onClick={submit}>{initial?"保存すめE:"作�Eする"}</button>
      </div>
    </Modal>
  );
}

/* ============================================================
   PM: プロジェクト詳細・タスク管琁E�ELLM生�E
   ============================================================ */
function ProjectDetail({id, tab}) {
  const {db,nav}=useApp();
  const [curTab,setCurTab]=useState(tab||"tasks");
  const [csvOpen,setCsvOpen]=useState(false);
  const p=db.projects.find(x=>x.id===id);
  if(!p) return <div><PageTitle title="プロジェクトが見つかりません" back={()=>nav("projects")}/></div>;
  const st=projectStats(p,db.tasks,db.worklogs);
  const tabs=[["tasks","タスク一覧"],["members","メンバ�E稼僁E],["budget","予算管琁E],["settings","設宁E]];
  return (
    <div>
      <PageTitle back={()=>nav("projects")} title={p.name} sub={`${p.start_date||"?"} 、E${p.end_date||"?"}`}
        right={<div className="flex gap-2 items-center flex-wrap">
          {p.notion_url&&<a className="btn btn-sm" href={p.notion_url} target="_blank" rel="noreferrer"><Link2 size={13}/>Notion</a>}
          <button className="btn btn-sm" onClick={()=>setCsvOpen(true)}><Download size={13}/>レポ�Eト�E劁E/button>
          <Badge cls={PJ_BADGE[p.status]} dot>{PJST[p.status]}</Badge>
        </div>}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="総予箁E value={fmtYen(p.budget)} unit="" mono/>
        <StatCard label="未配�E予箁E value={fmtYen(st.remain)} unit="" mono warn={st.remain<0}/>
        <StatCard label="予算消化" value={Math.round(st.consumedRate*100)+"%"} unit="" mono/>
        <StatCard label="タスク進捁E value={`${st.done}/${st.total}`} unit="完亁E mono/>
      </div>
      <div className="flex gap-1 mb-4" style={{borderBottom:"3px double var(--border)",overflowX:"auto"}}>
        {tabs.map(([k,l])=>(
          <button key={k} onClick={()=>setCurTab(k)} className="px-4 py-2 text-sm font-medium"
            style={{background:"none",border:"none",cursor:"pointer",whiteSpace:"nowrap",touchAction:"manipulation",
              color:curTab===k?"var(--ai)":"var(--muted)",fontWeight:curTab===k?700:500,
              borderBottom:curTab===k?"2px solid var(--ai)":"2px solid transparent",marginBottom:-3}}>{l}</button>
        ))}
      </div>
      {curTab==="tasks"&&<TasksTab p={p}/>}
      {curTab==="members"&&<MembersTab p={p}/>}
      {curTab==="budget"&&<BudgetTab p={p}/>}
      {curTab==="settings"&&<SettingsTab p={p}/>}
      {csvOpen&&<CSVModal p={p} onClose={()=>setCsvOpen(false)}/>}
    </div>
  );
}

function TasksTab({p}) {
  const {db}=useApp();
  const [q,setQ]=useState(""); const [stF,setStF]=useState("all"); const [asF,setAsF]=useState("all");
  const [sort,setSort]=useState({key:"deadline",dir:1});
  const [form,setForm]=useState(null);
  const [llmOpen,setLlmOpen]=useState(false);
  const [openTask,setOpenTask]=useState(null);
  const tasks=db.tasks.filter(t=>t.project_id===p.id);
  const uname=id=>{const u=db.users.find(x=>x.id===id);return u?u.name:"未割彁E;};
  const prOrder={high:0,medium:1,low:2};
  const rows=useMemo(()=>{
    let list=tasks.map(t=>{const worked=workedMin(db.worklogs,t.id);const ratio=taskRatio(t,worked);return{t,worked,ratio,remain:(t.budget||0)*(1-ratio),warn90:t.status!=="done"&&t.max_minutes>0&&worked>=t.max_minutes*0.9};});
    const s=q.trim().toLowerCase();
    if(s) list=list.filter(r=>(r.t.title+(r.t.description||"")).toLowerCase().includes(s));
    if(stF!=="all") list=list.filter(r=>r.t.status===stF);
    if(asF!=="all") list=list.filter(r=>asF==="none"?!r.t.assigned_user_id:r.t.assigned_user_id===asF);
    const k=sort.key,d=sort.dir;
    list.sort((a,b)=>{
      const va=k==="worked"?a.worked:k==="remain"?a.remain:k==="priority"?prOrder[a.t.priority]:k==="assignee"?uname(a.t.assigned_user_id):(a.t[k]??"");
      const vb=k==="worked"?b.worked:k==="remain"?b.remain:k==="priority"?prOrder[b.t.priority]:k==="assignee"?uname(b.t.assigned_user_id):(b.t[k]??"");
      if(va<vb) return -d; if(va>vb) return d; return 0;
    });
    return list;
  },[tasks,db.worklogs,q,stF,asF,sort,db.users]);
  const th=(key,label)=><th className="sort" onClick={()=>setSort(s=>({key,dir:s.key===key?-s.dir:1}))}>{label}{sort.key===key?(sort.dir===1?" ↁE:" ↁE):""}</th>;
  const assignees=[...new Set(tasks.map(t=>t.assigned_user_id).filter(Boolean))].map(id=>db.users.find(u=>u.id===id)).filter(Boolean);
  return (
    <div>
      <div className="flex gap-2 flex-wrap items-center mb-3">
        <div className="relative" style={{width:200}}>
          <Search size={14} style={{position:"absolute",left:10,top:10,color:"var(--muted)"}}/>
          <input className="input" style={{paddingLeft:30}} placeholder="タスク検索" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="select" style={{width:"auto"}} value={stF} onChange={e=>setStF(e.target.value)}>
          <option value="all">全スチE�Eタス</option><option value="todo">未着扁E/option><option value="in_progress">進行中</option><option value="done">完亁E/option>
        </select>
        <select className="select" style={{width:"auto"}} value={asF} onChange={e=>setAsF(e.target.value)}>
          <option value="all">全拁E��E/option><option value="none">未割彁E/option>
          {assignees.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <div className="flex-1"/>
        <button className="btn" onClick={()=>setLlmOpen(true)}><Sparkles size={14}/>LLMと相諁E��て作�E</button>
        <button className="btn btn-p" onClick={()=>setForm({})}><Plus size={14}/>新規タスク</button>
      </div>
      <div className="panel" style={{overflowX:"auto"}}>
        <table className="tbl" style={{minWidth:880}}>
          <thead><tr><th>#</th>{th("title","タスク吁E)}{th("assignee","拁E��E)}{th("priority","優先度")}{th("budget","予箁E)}{th("max_minutes","稼働上限")}{th("deadline","期日")}{th("status","スチE�Eタス")}{th("worked","稼働渁E)}{th("remain","残予箁E)}</tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.t.id} className={"click"+(r.warn90?" warn90":"")} onClick={()=>setOpenTask(r.t)}>
                <td className="num" style={{color:"var(--muted)"}}>{i+1}</td>
                <td className="font-medium"><span className="flex items-center gap-2">{r.warn90&&<AlertTriangle size={13} style={{color:r.worked>=r.t.max_minutes?"var(--red)":"var(--amber)",flexShrink:0}}/>}{r.t.title}</span></td>
                <td>{r.t.assigned_user_id?<span className="flex items-center gap-2"><Avatar user={db.users.find(u=>u.id===r.t.assigned_user_id)} size={20}/>{uname(r.t.assigned_user_id)}</span>:<Badge cls="b-slate">未割彁E/Badge>}</td>
                <td><Badge cls={PR_BADGE[r.t.priority]}>{PR[r.t.priority]}</Badge></td>
                <td className="num">{fmtYen(r.t.budget)}</td>
                <td className="num">{fmtHM(r.t.max_minutes)}</td>
                <td className="num" style={r.t.status!=="done"&&daysUntil(r.t.deadline)<0?{color:"var(--red)",fontWeight:700}:{}}>{r.t.deadline||" E}</td>
                <td><Badge cls={ST_BADGE[r.t.status]} dot>{ST[r.t.status]}</Badge></td>
                <td className="num">{fmtHM(r.worked)}</td>
                <td className="num">{fmtYen(r.remain)}</td>
              </tr>
            ))}
            {rows.length===0&&<tr><td colSpan={10}><Empty icon={ClipboardList} text="タスクがありません"/></td></tr>}
          </tbody>
        </table>
      </div>
      {form!==null&&<TaskForm p={p} initial={form.id?form:null} onClose={()=>setForm(null)}/>}
      {llmOpen&&<LLMModal p={p} onClose={()=>setLlmOpen(false)}/>}
      {openTask&&<PMTaskModal taskId={openTask.id} onEdit={t=>{setOpenTask(null);setForm(t);}} onClose={()=>setOpenTask(null)}/>}
    </div>
  );
}

function TaskForm({p, initial, onClose}) {
  const {db,insertRow,updateRow,toast,notifyUsers}=useApp();
  const [f,setF]=useState(initial?{...initial,maxH:Math.floor((initial.max_minutes||0)/60),maxM:(initial.max_minutes||0)%60}:{title:"",description:"",goal:"",assigned_user_id:"",priority:"medium",budget:"",maxH:"",maxM:"",deadline:"",status:"todo"});
  const [errs,setErrs]=useState({});
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const st=projectStats(p,db.tasks.filter(t=>!initial||t.id!==initial.id),db.worklogs);
  const budgetOver=Number(f.budget)>0&&Number(f.budget)>st.remain;
  const deadlineOver=f.deadline&&p.end_date&&f.deadline>p.end_date;
  const candidates=db.users.filter(u=>(p.member_ids||[]).includes(u.id)||u.id===f.assigned_user_id);
  async function submit() {
    const e={};
    if(!f.title.trim()) e.title="タスク名�E忁E��でぁE;
    if(!f.goal.trim()) e.goal="目標�Eノルマ�E忁E��でぁE;
    if(!(Number(f.budget)>=0)||f.budget==="") e.budget="予箁E冁Eを�E力してください";
    const mm=(Number(f.maxH)||0)*60+(Number(f.maxM)||0);
    if(mm<=0) e.maxH="稼働時間上限を�E力してください";
    if(!f.deadline) e.deadline="期日は忁E��でぁE;
    setErrs(e); if(Object.keys(e).length) return;
    const base={title:f.title.trim(),description:f.description,goal:f.goal.trim(),assigned_user_id:f.assigned_user_id||null,priority:f.priority,budget:Number(f.budget),max_minutes:mm,deadline:f.deadline};
    if(initial){
      await updateRow("tasks",{id:initial.id},{...base,status:f.status,completed_at:f.status==="done"?(initial.completed_at||Date.now()):null});
      if(base.assigned_user_id&&base.assigned_user_id!==initial.assigned_user_id)
        await notifyUsers([base.assigned_user_id],"assign",`タスク、E{base.title}」が割り当てられました (${p.name})`,{email:true});
      toast("タスクを更新しました");
    } else {
      await insertRow("tasks",{...base,id:uid(),project_id:p.id,status:"todo",created_at:Date.now()});
      if(base.assigned_user_id) await notifyUsers([base.assigned_user_id],"assign",`タスク、E{base.title}」が割り当てられました (${p.name})`,{email:true});
      toast("タスクを作�Eしました");
    }
    onClose();
  }
  return (
    <Modal open onClose={onClose} title={initial?"タスクを編雁E:"新規タスク"}>
      {budgetOver&&<div className="flex items-center gap-2 p-3 rounded-lg text-sm mb-3" style={{background:"var(--amber-bg)",color:"var(--amber)"}}><AlertTriangle size={15}/>予算がプロジェクト未配�E額を趁E��しまぁE(未配�E: {fmtYen(st.remain)})</div>}
      {deadlineOver&&<div className="flex items-center gap-2 p-3 rounded-lg text-sm mb-3" style={{background:"var(--amber-bg)",color:"var(--amber)"}}><AlertTriangle size={15}/>期日が�Eロジェクト終亁E��を趁E��てぁE��ぁE/div>}
      <Field label="タスク吁E*" error={errs.title}><input className="input" value={f.title} onChange={e=>set("title",e.target.value)}/></Field>
      <Field label="説昁E><textarea className="textarea" value={f.description||""} onChange={e=>set("description",e.target.value)}/></Field>
      <Field label="目標�EノルチE*" error={errs.goal}><textarea className="textarea" style={{minHeight:60}} value={f.goal} onChange={e=>set("goal",e.target.value)}/></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="拁E��メンバ�E"><select className="select" value={f.assigned_user_id||""} onChange={e=>set("assigned_user_id",e.target.value)}><option value="">未割彁E/option>{candidates.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select></Field>
        <Field label="優先度"><select className="select" value={f.priority} onChange={e=>set("priority",e.target.value)}><option value="high">髁E/option><option value="medium">中</option><option value="low">佁E/option></select></Field>
        <Field label="予箁E(冁E *" error={errs.budget}><input type="number" className="input num" value={f.budget} onChange={e=>set("budget",e.target.value)}/></Field>
        <Field label="期日 *" error={errs.deadline}><input type="date" className="input" value={f.deadline} onChange={e=>set("deadline",e.target.value)}/></Field>
        <Field label="稼働時間上限 *" error={errs.maxH}>
          <div className="flex items-center gap-2">
            <input type="number" min="0" className="input num" style={{width:80}} value={f.maxH} onChange={e=>set("maxH",e.target.value)}/><span className="text-xs">時間</span>
            <input type="number" min="0" max="59" className="input num" style={{width:70}} value={f.maxM} onChange={e=>set("maxM",e.target.value)}/><span className="text-xs">刁E/span>
          </div>
        </Field>
        {initial&&<Field label="スチE�Eタス"><select className="select" value={f.status} onChange={e=>set("status",e.target.value)}><option value="todo">未着扁E/option><option value="in_progress">進行中</option><option value="done">完亁E/option></select></Field>}
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button className="btn" onClick={onClose}>キャンセル</button>
        <button className="btn btn-p" onClick={submit}>{initial?"保存すめE:"作�Eする"}</button>
      </div>
    </Modal>
  );
}

function PMTaskModal({taskId, onEdit, onClose}) {
  const {db,deleteRow,ask,toast}=useApp();
  const t=db.tasks.find(x=>x.id===taskId); if(!t) return null;
  const p=db.projects.find(x=>x.id===t.project_id);
  const logs=db.worklogs.filter(l=>l.task_id===t.id).sort((a,b)=>b.started_at-a.started_at);
  const worked=workedMin(db.worklogs,t.id);
  const assignee=db.users.find(u=>u.id===t.assigned_user_id);
  async function del() {
    if(!(await ask(`タスク、E{t.title}」を削除しますか�E�`))) return;
    await deleteRow("tasks",{id:t.id});
    toast("タスクを削除しました"); onClose();
  }
  return (
    <Modal open onClose={onClose} title="タスク詳細" wide>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
        <div><div className="text-lg font-bold">{t.title}</div><div className="text-xs" style={{color:"var(--muted)"}}>{p?p.name:""}</div></div>
        <div className="flex gap-2 items-center"><Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge><Badge cls={ST_BADGE[t.status]} dot>{ST[t.status]}</Badge></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        <MiniStat label="拁E��E value={assignee?assignee.name:"未割彁E}/>
        <MiniStat label="期日" value={t.deadline||" E}/>
        <MiniStat label="稼僁E/ 上限" value={`${fmtHM(worked)} / ${fmtHM(t.max_minutes)}`} mono warn={t.max_minutes>0&&worked>=t.max_minutes*0.9}/>
        <MiniStat label="予箁E value={fmtYen(t.budget)} mono/>
      </div>
      <Prog ratio={t.max_minutes>0?worked/t.max_minutes:0}/>
      {t.description&&<div className="mt-4"><div className="lbl">説昁E/div><div className="text-sm" style={{whiteSpace:"pre-wrap"}}>{t.description}</div></div>}
      <div className="mt-3 p-3 rounded-lg" style={{background:"var(--ai-soft)"}}><div className="lbl" style={{color:"var(--ai)"}}>目標�EノルチE/div><div className="text-sm" style={{whiteSpace:"pre-wrap"}}>{t.goal||" E}</div></div>
      {t.completion_comment&&<div className="mt-3 p-3 rounded-lg" style={{background:"var(--green-bg)"}}><div className="lbl" style={{color:"var(--green)"}}>完亁E��メンチE/div><div className="text-sm" style={{whiteSpace:"pre-wrap"}}>{t.completion_comment}</div></div>}
      <div className="mt-4"><div className="lbl">稼働ログ ({logs.length}件)</div>
        {logs.length===0?<div className="text-sm" style={{color:"var(--muted)"}}>まだ記録がありません</div>:(
          <div className="panel" style={{maxHeight:180,overflowY:"auto"}}>
            {logs.map(l=>{const u=db.users.find(x=>x.id===l.user_id);return(
              <div key={l.id} className="flex items-center gap-3 px-3 py-2 text-sm" style={{borderBottom:"1px solid var(--border)"}}>
                <span className="text-xs mono" style={{color:"var(--muted)",width:88,flexShrink:0}}>{fmtDT(l.started_at)}</span>
                <span className="mono font-medium" style={{width:56}}>{fmtHM(l.duration_min)}</span>
                <span className="text-xs" style={{width:72,flexShrink:0}}>{u?u.name:"?"}</span>
                <span className="text-xs flex-1 truncate" style={{color:"var(--muted)"}}>{l.note}</span>
              </div>);})}
          </div>
        )}
      </div>
      <CommentThread task={t}/>
      <div className="flex justify-between gap-2 mt-5">
        <button className="btn btn-d" onClick={del}><Trash2 size={14}/>削除</button>
        <div className="flex gap-2"><button className="btn" onClick={onClose}>閉じめE/button><button className="btn btn-p" onClick={()=>onEdit(t)}><Edit2 size={14}/>編雁E/button></div>
      </div>
    </Modal>
  );
}

function CommentThread({task}) {
  const {db,user,insertRow,notifyUsers,toast}=useApp();
  const [text,setText]=useState("");
  const comments=db.comments.filter(c=>c.task_id===task.id).sort((a,b)=>a.created_at-b.created_at);
  async function send() {
    const body=text.trim(); if(!body) return;
    await insertRow("comments",{id:uid(),task_id:task.id,user_id:user.id,text:body.slice(0,500),created_at:Date.now()});
    const mentioned=db.users.filter(u=>u.id!==user.id&&(body.includes("@"+u.name.replace(/\s+/g,""))||body.includes("@"+u.name)));
    const targets=new Set(mentioned.map(u=>u.id));
    if(task.assigned_user_id&&task.assigned_user_id!==user.id) targets.add(task.assigned_user_id);
    if(user.role!=="PM") db.users.filter(u=>u.role==="PM"&&!u.pending).forEach(u=>targets.add(u.id));
    await notifyUsers([...targets],"mention",`${user.name} が、E{task.title}」にコメントしました: ${body.slice(0,40)}${body.length>40?"…":""}`);
    setText(""); toast("コメントを送信しました");
  }
  return (
    <div className="mt-4">
      <div className="lbl">コメンチE({comments.length})</div>
      {comments.length>0&&<div className="flex flex-col gap-2 mb-2" style={{maxHeight:200,overflowY:"auto"}}>
        {comments.map(c=>{const u=db.users.find(x=>x.id===c.user_id);return(
          <div key={c.id} className="flex gap-2"><Avatar user={u} size={24}/>
            <div className="panel px-3 py-2 flex-1" style={{background:"var(--panel2)",border:"none"}}>
              <div className="text-xs mb-1" style={{color:"var(--muted)"}}>{u?u.name:"?"} · {fmtDT(c.created_at)}</div>
              <div className="text-sm" style={{whiteSpace:"pre-wrap"}}>{c.text}</div>
            </div>
          </div>);})}
      </div>}
      <div className="flex gap-2">
        <input className="input" placeholder="コメントを追加 (@名前でメンション)" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()}/>
        <button className="btn btn-p" onClick={send}><Send size={14}/></button>
      </div>
    </div>
  );
}

const LLM_JSON_SPEC=`[{"title":"タスク吁E,"description":"詳細説昁E,"goal":"目標�EノルチE,"assigned_member":"メンバ�E名また�Eメールアドレス","priority":"high|medium|low","budget":50000,"max_hours":20,"deadline":"YYYY-MM-DD"}]`;
function matchMember(s,users){if(!s)return null;const q=String(s).trim().toLowerCase();if(!q)return null;return users.find(x=>x.email.toLowerCase()===q)||users.find(x=>x.name.toLowerCase()===q)||users.find(x=>x.name.toLowerCase().replace(/\s+/g,"")===q.replace(/\s+/g,""))||users.find(x=>x.name.toLowerCase().includes(q))||null;}

function LLMModal({p, onClose}) {
  const {db,insertRow,toast,notifyUsers}=useApp();
  const [chat,setChat]=useState([]); const [input,setInput]=useState(""); const [loading,setLoading]=useState(false);
  const [preview,setPreview]=useState([]); const [pasteMode,setPasteMode]=useState(false); const [pasteText,setPasteText]=useState(""); const [err,setErr]=useState("");
  const chatEnd=useRef(null);
  const candidates=db.users.filter(u=>(p.member_ids||[]).includes(u.id));
  const st=projectStats(p,db.tasks,db.worklogs);
  useEffect(()=>{chatEnd.current&&chatEnd.current.scrollIntoView({behavior:"smooth"});},[chat,loading]);
  const sysPrompt=()=>`あなた�EPM支援AIです。以下�EJSON配�E【�Eみ】で回答してください(説明文不要E:\n${LLM_JSON_SPEC}\n制紁E assigned_memberは${candidates.map(u=>u.name).join(",")||"なぁE}のみ。deadline: ${todayStr()}、E{p.end_date||"未設宁E}。budgetの合計�E${Math.max(0,st.remain)}冁E��冁E�E目安、EnプロジェクチE ${p.name}: ${p.description}`;
  function normalize(arr){return(Array.isArray(arr)?arr:[]).map(r=>{const m=matchMember(r.assigned_member,candidates);return{_k:uid(),title:String(r.title||"").slice(0,100),description:String(r.description||""),goal:String(r.goal||""),assigned_user_id:m?m.id:"",unmatched:!!(r.assigned_member&&String(r.assigned_member).trim()&&!m),priority:["high","medium","low"].includes(r.priority)?r.priority:"medium",budget:Math.max(0,Number(r.budget)||0),max_hours:Math.max(0,Number(r.max_hours)||0),deadline:/^\d{4}-\d{2}-\d{2}$/.test(String(r.deadline||""))?r.deadline:""};}).filter(r=>r.title);}
  async function send(){const msg=input.trim();if(!msg||loading)return;setErr("");setInput("");const nextChat=[...chat,{role:"user",content:msg}];setChat(nextChat);setLoading(true);
    try{const data=await callClaude([{role:"user",content:sysPrompt()},{role:"assistant",content:"亁E��しました、ESON配�Eのみで回答します、E},...nextChat],{max_tokens:1000});const text=textOf(data);setChat(c=>[...c,{role:"assistant",content:text}]);try{const rows=normalize(parseJsonArray(text));if(rows.length)setPreview(rows);else setErr("タスクを抽出できませんでした");}catch(e2){setErr("JSONの解析に失敗しました");}}catch(e){setErr(e.message||"APIエラー");}
    setLoading(false);}
  function importPaste(){setErr("");try{const rows=normalize(parseJsonArray(pasteText));if(!rows.length){setErr("有効なタスクが見つかりませんでした");return;}setPreview(rows);setPasteMode(false);}catch(e){setErr("JSONの解析に失敗しました");}}
  const setRow=(k,key,v)=>setPreview(list=>list.map(r=>r._k===k?{...r,[key]:v,unmatched:key==="assigned_user_id"?false:r.unmatched}:r));
  const budgetSum=preview.reduce((a,r)=>a+r.budget,0);
  async function bulkCreate(){
    const bad=preview.find(r=>!r.title.trim());if(bad){setErr("タスク名が空の行がありまぁE);return;}
    const created=preview.map(r=>({id:uid(),project_id:p.id,title:r.title.trim(),description:r.description,goal:r.goal,assigned_user_id:r.assigned_user_id||null,budget:r.budget,max_minutes:Math.round(r.max_hours*60),deadline:r.deadline||p.end_date||todayStr(),status:"todo",priority:r.priority,created_at:Date.now()}));
    for(const t of created) await insertRow("tasks",t);
    const byUser={};created.forEach(t=>{if(t.assigned_user_id)(byUser[t.assigned_user_id]=byUser[t.assigned_user_id]||[]).push(t.title);});
    for(const[uidTo,titles]of Object.entries(byUser)) await notifyUsers([uidTo],"assign",`${titles.length}件のタスクが割り当てられました: ${titles.slice(0,2).join("、E)}${titles.length>2?" ほぁE:""}`,{email:true});
    toast(`${created.length}件のタスクを作�Eしました`); onClose();
  }
  return (
    <Modal open onClose={onClose} title="LLMと相諁E��て一括作�E" wide>
      <div className="flex gap-2 mb-3">
        <button className={"chip"+(pasteMode?"":" on")} onClick={()=>setPasteMode(false)}><Sparkles size={13}/>チャチE��</button>
        <button className={"chip"+(pasteMode?" on":"")} onClick={()=>setPasteMode(true)}><Copy size={13}/>JSONを貼り付け</button>
      </div>
      {!pasteMode?(
        <div>
          <div className="panel p-3 mb-2" style={{height:200,overflowY:"auto",background:"var(--panel2)",border:"none"}}>
            {chat.length===0&&<div className="text-sm" style={{color:"var(--muted)"}}>侁E 「{p.name}のための開発タスクめE件作って、E/div>}
            {chat.map((m,i)=><div key={i} className={"flex mb-2 "+(m.role==="user"?"justify-end":"justify-start")}>
              <div className="px-3 py-2 rounded-xl text-sm" style={{maxWidth:"85%",whiteSpace:"pre-wrap",wordBreak:"break-word",background:m.role==="user"?"var(--ai)":"var(--panel)",color:m.role==="user"?"#fff":"var(--text)",fontFamily:m.role==="assistant"?"monospace":"inherit",fontSize:m.role==="assistant"?11:13}}>
                {m.role==="assistant"&&m.content.length>400?m.content.slice(0,400)+" …(プレビューに反映済み)":m.content}</div></div>)}
            {loading&&<div className="text-sm" style={{color:"var(--muted)"}}>Claudeが老E��てぁE��す…</div>}
            <div ref={chatEnd}/>
          </div>
          <div className="flex gap-2"><input className="input" placeholder="どんなタスクを作りますか�E�E value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} disabled={loading}/><button className="btn btn-p" onClick={send} disabled={loading}><Send size={14}/></button></div>
        </div>
      ):(
        <div>
          <textarea className="textarea mono" style={{minHeight:160,fontFamily:"monospace",fontSize:12}} placeholder={LLM_JSON_SPEC} value={pasteText} onChange={e=>setPasteText(e.target.value)}/>
          <div className="flex justify-end mt-2"><button className="btn btn-p" onClick={importPaste}>読み込んでプレビュー</button></div>
        </div>
      )}
      {err&&<div className="err mt-2">{err}</div>}
      {preview.length>0&&(
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2"><div className="text-sm font-bold">プレビュー ({preview.length}件)</div><div className="text-xs mono" style={{color:budgetSum>st.remain?"var(--amber)":"var(--muted)"}}>予算合訁E{fmtYen(budgetSum)} / 未配�E {fmtYen(st.remain)}</div></div>
          <div className="panel" style={{overflowX:"auto",maxHeight:280,overflowY:"auto"}}>
            <table className="tbl" style={{minWidth:700}}>
              <thead><tr><th>タスク吁E/th><th>拁E��E/th><th>優先度</th><th>予箁E/th><th>上限(h)</th><th>期日</th><th/></tr></thead>
              <tbody>{preview.map(r=>(
                <tr key={r._k}>
                  <td style={{minWidth:160}}><input className="input" style={{padding:"4px 8px",fontSize:12}} value={r.title} onChange={e=>setRow(r._k,"title",e.target.value)}/>{r.goal&&<div className="text-xs mt-1 truncate" style={{color:"var(--muted)",maxWidth:200}} title={r.goal}>目樁E {r.goal}</div>}</td>
                  <td><select className="select" style={{padding:"4px 8px",fontSize:12,borderColor:r.unmatched?"var(--amber)":undefined}} value={r.assigned_user_id} onChange={e=>setRow(r._k,"assigned_user_id",e.target.value)}><option value="">未割彁E/option>{candidates.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}</select>{r.unmatched&&<div className="text-xs" style={{color:"var(--amber)"}}>照合できず</div>}</td>
                  <td><select className="select" style={{padding:"4px 8px",fontSize:12}} value={r.priority} onChange={e=>setRow(r._k,"priority",e.target.value)}><option value="high">髁E/option><option value="medium">中</option><option value="low">佁E/option></select></td>
                  <td><input type="number" className="input num" style={{padding:"4px 8px",fontSize:12,width:90}} value={r.budget} onChange={e=>setRow(r._k,"budget",Number(e.target.value)||0)}/></td>
                  <td><input type="number" className="input num" style={{padding:"4px 8px",fontSize:12,width:64}} value={r.max_hours} onChange={e=>setRow(r._k,"max_hours",Number(e.target.value)||0)}/></td>
                  <td><input type="date" className="input" style={{padding:"4px 6px",fontSize:12}} value={r.deadline} onChange={e=>setRow(r._k,"deadline",e.target.value)}/></td>
                  <td><button className="iconbtn" style={{width:28,height:28}} onClick={()=>setPreview(l=>l.filter(x=>x._k!==r._k))}><Trash2 size={13}/></button></td>
                </tr>))}</tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button className="btn" onClick={()=>setPreview([])}>クリア</button>
            <button className="btn btn-p" onClick={bulkCreate}><Check size={14}/>一括作�E ({preview.length}件)</button>
          </div>
        </div>
      )}
    </Modal>
  );
}

/* ============================================================
   PM: 稼働�E予算�E設定タチE/ 申請管琁E/ レポ�EチE   ============================================================ */
function MembersTab({p}) {
  const {db}=useApp();
  const [range,setRange]=useState("week");
  const [rS,rE]=range==="week"?weekRange():monthRange();
  const pTasks=db.tasks.filter(t=>t.project_id===p.id);
  const pTaskIds=new Set(pTasks.map(t=>t.id));
  const members=(p.member_ids||[]).map(id=>db.users.find(u=>u.id===id)).filter(Boolean);
  const data=members.map(u=>{const min=db.worklogs.filter(l=>l.user_id===u.id&&pTaskIds.has(l.task_id)&&l.started_at>=rS&&l.started_at<rE).reduce((a,l)=>a+l.duration_min,0);return{name:u.name,hours:Math.round((min/60)*10)/10};});
  const stats=members.map(u=>{const mine=pTasks.filter(t=>t.assigned_user_id===u.id);const done=mine.filter(t=>t.status==="done").length;const sumMax=mine.reduce((a,t)=>a+(t.max_minutes||0),0);const sumWorked=mine.reduce((a,t)=>a+workedMin(db.worklogs,t.id),0);return{u,count:mine.length,done,rate:sumMax>0?sumWorked/sumMax:0,worked:sumWorked};});
  const alerts=pTasks.filter(t=>t.status!=="done"&&t.max_minutes>0&&workedMin(db.worklogs,t.id)>=t.max_minutes*0.9);
  return (
    <div className="flex flex-col gap-4">
      <div className="panel p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <SecTitle icon={Clock} title="メンバ�E稼働時閁E/>
          <Seg value={range} onChange={setRange} options={[{value:"week",label:"今週"},{value:"month",label:"今月"}]}/>
        </div>
        {members.length===0?<Empty icon={Users} text="こ�Eプロジェクトにメンバ�Eがいません"/>:(
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{top:4,right:8,left:-18,bottom:0}}>
                <XAxis dataKey="name" tick={{fontSize:11,fill:"#8b8f98"}} axisLine={{stroke:"#8b8f9855"}} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#8b8f98"}} axisLine={false} tickLine={false} unit="h"/>
                <RTooltip cursor={{fill:"rgba(139,143,152,0.08)"}} formatter={v=>[v+" h","稼僁E]} contentStyle={{background:"var(--panel)",border:"1px solid var(--border)",borderRadius:10,fontSize:12,color:"var(--text)"}}/>
                <Bar dataKey="hours" fill="var(--ai)" radius={[5,5,0,0]} maxBarSize={44}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <div className="panel" style={{overflowX:"auto"}}>
        <table className="tbl" style={{minWidth:560}}>
          <thead><tr><th>メンバ�E</th><th>拁E��タスク</th><th>完亁E/th><th>累計稼僁E/th><th>上限到達率</th></tr></thead>
          <tbody>{stats.map(s=>(
            <tr key={s.u.id}>
              <td><span className="flex items-center gap-2"><Avatar user={s.u} size={22}/>{s.u.name}</span></td>
              <td className="num">{s.count}</td><td className="num">{s.done}</td><td className="num">{fmtHM(s.worked)}</td>
              <td style={{minWidth:140}}><div className="flex items-center gap-2"><div className="flex-1"><Prog ratio={s.rate}/></div><span className="text-xs mono" style={{width:36}}>{Math.round(s.rate*100)}%</span></div></td>
            </tr>))}
            {stats.length===0&&<tr><td colSpan={5}><Empty icon={Users} text="チE�Eタがありません"/></td></tr>}
          </tbody>
        </table>
      </div>
      {alerts.length>0&&<div className="panel p-4"><SecTitle icon={AlertTriangle} title="90%趁E��アラーチE tone="var(--amber)"/>
        <div className="flex flex-col gap-2">{alerts.map(t=>{const w=workedMin(db.worklogs,t.id);const u=db.users.find(x=>x.id===t.assigned_user_id);return <AlertRow key={t.id} tone={w>=t.max_minutes?"red":"amber"} text={`、E{t.title}、E${u?u.name:"未割彁E}  E${fmtHM(w)} / ${fmtHM(t.max_minutes)}`}/>;})}</div>
      </div>}
    </div>
  );
}

function BudgetTab({p}) {
  const {db}=useApp();
  const st=projectStats(p,db.tasks,db.worklogs);
  const rows=db.tasks.filter(t=>t.project_id===p.id).map(t=>{const worked=workedMin(db.worklogs,t.id);const ratio=taskRatio(t,worked);return{t,worked,ratio,consumed:(t.budget||0)*ratio,risk:t.status!=="done"&&t.max_minutes>0&&worked>=t.max_minutes*0.9};}).sort((a,b)=>b.t.budget-a.t.budget);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="総予箁E value={fmtYen(p.budget)} unit="" mono/>
        <StatCard label="配�E済み" value={fmtYen(st.alloc)} unit="" mono warn={st.alloc>p.budget}/>
        <StatCard label="消化顁E value={fmtYen(st.consumed)} unit="" mono/>
        <StatCard label="残顁E value={fmtYen(p.budget-st.consumed)} unit="" mono/>
      </div>
      <div className="panel" style={{overflowX:"auto"}}>
        <table className="tbl" style={{minWidth:620}}>
          <thead><tr><th>タスク</th><th>予箁E/th><th>消化</th><th style={{width:"30%"}}>消化状況E/th><th>稼僁E/th></tr></thead>
          <tbody>{rows.map(r=>(
            <tr key={r.t.id} className={r.risk?"warn90":""}>
              <td className="font-medium"><span className="flex items-center gap-2">{r.risk&&<AlertTriangle size={13} style={{color:"var(--amber)"}}/>}{r.t.title}</span></td>
              <td className="num">{fmtYen(r.t.budget)}</td><td className="num">{fmtYen(r.consumed)}</td>
              <td><div className="flex items-center gap-2"><div className="flex-1"><Prog ratio={r.ratio}/></div><span className="text-xs mono" style={{width:36}}>{Math.round(r.ratio*100)}%</span></div></td>
              <td className="num text-xs">{fmtHM(r.worked)} / {fmtHM(r.t.max_minutes)}</td>
            </tr>))}
            {rows.length===0&&<tr><td colSpan={5}><Empty icon={ClipboardList} text="タスクがありません"/></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab({p}) {
  const {db,updateRow,deleteRow,toast,ask,nav}=useApp();
  const [editOpen,setEditOpen]=useState(false);
  const [notionBusy,setNotionBusy]=useState(false);
  const [notionErr,setNotionErr]=useState("");
  const [fetched,setFetched]=useState(null);
  const [apply,setApply]=useState({name:false,description:true,status:false,budget:false});
  async function syncNotion(){
    if(!p.notion_url){setNotionErr("先に「編雁E��からNotionペ�EジURLを設定してください");return;}
    setNotionBusy(true);setNotionErr("");setFetched(null);
    try{
      const data=await callClaude([{role:"user",content:`Notionの以下�Eペ�Eジを読み取り、�Eロジェクト情報を抽出してください。URL: ${p.notion_url}\n出力�EJSONオブジェクト【�Eみ、E\n{"name":"プロジェクト名","description":"概要E200字以冁E","status":"active|paused|completed","budget":数値また�Enull}`}],{mcp_servers:[{type:"url",url:"https://mcp.notion.com/mcp",name:"notion"}],max_tokens:1000});
      const obj=parseJsonObject(textOf(data));setFetched(obj);
    }catch(e){setNotionErr("Notionからの取得に失敗しました、E"+e.message+")");}
    setNotionBusy(false);
  }
  async function applyFetched(){
    const upd={};
    if(apply.name&&fetched.name) upd.name=String(fetched.name);
    if(apply.description&&fetched.description) upd.description=String(fetched.description);
    if(apply.status&&["active","paused","completed"].includes(fetched.status)) upd.status=fetched.status;
    if(apply.budget&&Number(fetched.budget)>0) upd.budget=Number(fetched.budget);
    await updateRow("projects",{id:p.id},{...upd,last_synced:Date.now()});
    setFetched(null);toast("Notionの惁E��を取り込みました");
  }
  async function delProject(){
    if(!(await ask(`プロジェクト、E{p.name}」を削除しますか�E�`))) return;
    await deleteRow("projects",{id:p.id});
    toast("プロジェクトを削除しました");nav("projects");
  }
  return (
    <div className="flex flex-col gap-4" style={{maxWidth:640}}>
      <div className="panel p-4">
        <SecTitle icon={Settings} title="基本惁E��"/>
        <div className="text-sm mb-1"><span className="lbl">説昁E/span>{p.description||" E}</div>
        <button className="btn mt-2" onClick={()=>setEditOpen(true)}><Edit2 size={14}/>編雁E��めE/button>
      </div>
      <div className="panel p-4">
        <SecTitle icon={Link2} title="Notion連携"/>
        {p.notion_url?<div className="text-sm mb-2 truncate"><a href={p.notion_url} target="_blank" rel="noreferrer">{p.notion_url}</a></div>:<div className="text-sm mb-2" style={{color:"var(--muted)"}}>Notionペ�EジURLが未設定です、E/div>}
        {p.last_synced&&<div className="text-xs mb-2" style={{color:"var(--muted)"}}>最終同朁E {fmtDT(p.last_synced)}</div>}
        <button className="btn" disabled={notionBusy} onClick={syncNotion}><RefreshCw size={14}/>{notionBusy?"取得中…":"Notionと同期"}</button>
        {notionErr&&<div className="err mt-2">{notionErr}</div>}
        {fetched&&<div className="panel p-3 mt-3" style={{background:"var(--panel2)",border:"none"}}>
          <div className="text-xs font-bold mb-2">取得結果  E取り込む頁E��を選抁E/div>
          {[["name","名前",fetched.name],["description","説昁E,fetched.description],["status","スチE�Eタス",fetched.status&&PJST[fetched.status]],["budget","予箁E,fetched.budget!=null?fmtYen(fetched.budget):null]].map(([k,l,v])=>(
            <label key={k} className="flex items-start gap-2 text-sm py-1 cursor-pointer" style={{opacity:v?1:0.4}}>
              <input type="checkbox" disabled={!v} checked={!!apply[k]&&!!v} onChange={e=>setApply(a=>({...a,[k]:e.target.checked}))} style={{marginTop:4}}/><span><b>{l}:</b> {v||"取得できず"}</span>
            </label>))}
          <div className="flex justify-end gap-2 mt-2"><button className="btn btn-sm" onClick={()=>setFetched(null)}>破棁E/button><button className="btn btn-p btn-sm" onClick={applyFetched}>取り込む</button></div>
        </div>}
      </div>
      <div className="panel p-4" style={{borderColor:"var(--red)"}}>
        <SecTitle icon={Trash2} title="危険な操佁E tone="var(--red)"/>
        <button className="btn btn-d" onClick={delProject}>プロジェクトを削除</button>
      </div>
      {editOpen&&<ProjectForm initial={p} onClose={()=>setEditOpen(false)}/>}
    </div>
  );
}

function CSVModal({p, onClose}) {
  const {db,toast}=useApp();
  const [month,setMonth]=useState("all");
  const months=useMemo(()=>{const s=new Set();db.worklogs.forEach(l=>{const d=new Date(l.started_at);s.add(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);});return [...s].sort().reverse();},[db.worklogs]);
  const csv=useMemo(()=>{
    const tasks=db.tasks.filter(t=>t.project_id===p.id);
    const inMonth=ts=>{if(month==="all") return true;const d=new Date(ts);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`===month;};
    const rows=[["タスク吁E,"拁E��老E,"スチE�Eタス","優先度","期日","稼働時閁E刁E","稼働上限(刁E","予箁E冁E","消化顁E冁E","完亁E��"]];
    tasks.forEach(t=>{const u=db.users.find(x=>x.id===t.assigned_user_id);const w=db.worklogs.filter(l=>l.task_id===t.id&&inMonth(l.started_at)).reduce((a,l)=>a+l.duration_min,0);const allW=workedMin(db.worklogs,t.id);rows.push([t.title,u?u.name:"未割彁E,ST[t.status],PR[t.priority],t.deadline||"",Math.round(w),t.max_minutes||0,t.budget||0,Math.round((t.budget||0)*taskRatio(t,allW)),t.completed_at?new Date(t.completed_at).toISOString().slice(0,10):""]);});
    return toCSV(rows);
  },[db,p,month]);
  function copy(){navigator.clipboard&&navigator.clipboard.writeText(csv).then(()=>toast("コピ�Eしました")).catch(()=>toast("コピ�Eに失敗しました"));}
  function dl(){const ok=tryDownload(`report_${p.name}_${month}.csv`,csv);toast(ok?"ダウンロードを開始しました":"ダウンロード不可のためコピ�Eをご利用ください");}
  return (
    <Modal open onClose={onClose} title="稼働レポ�Eト�E劁E(CSV)">
      <Field label="対象期間"><select className="select" value={month} onChange={e=>setMonth(e.target.value)}><option value="all">全期間</option>{months.map(m=><option key={m} value={m}>{m}</option>)}</select></Field>
      <textarea className="textarea mono" readOnly style={{minHeight:180,fontFamily:"monospace",fontSize:11}} value={csv}/>
      <div className="flex justify-end gap-2 mt-3"><button className="btn" onClick={copy}><Copy size={14}/>コピ�E</button><button className="btn btn-p" onClick={dl}><Download size={14}/>ダウンローチE/button></div>
    </Modal>
  );
}

function RequestsView() {
  const {db,updateRow,notifyUsers,toast}=useApp();
  const [rejecting,setRejecting]=useState(null); const [reason,setReason]=useState("");
  const pend=db.requests.filter(r=>r.status==="pending").sort((a,b)=>b.requested_at-a.requested_at);
  const hist=db.requests.filter(r=>r.status!=="pending").sort((a,b)=>b.requested_at-a.requested_at).slice(0,10);
  const taskOf=r=>db.tasks.find(t=>t.id===r.task_id);
  const userOf=r=>db.users.find(u=>u.id===r.user_id);
  async function approve(r){
    const t=taskOf(r);if(!t){toast("対象タスクが見つかりません");return;}
    if(r.type==="extend"){
      await updateRow("tasks",{id:t.id},{deadline:r.extend_to});
      await updateRow("requests",{id:r.id},{status:"approved"});
      await notifyUsers([r.user_id],"approve",`、E{t.title}」�E期日延長が承認されました (新期日: ${r.extend_to})`,{email:true});
    } else {
      await updateRow("tasks",{id:t.id},{assigned_user_id:r.user_id});
      await updateRow("requests",{id:r.id},{status:"approved"});
      const others=db.requests.filter(x=>x.type!=="extend"&&x.task_id===t.id&&x.status==="pending"&&x.id!==r.id);
      for(const o of others){await updateRow("requests",{id:o.id},{status:"rejected",reject_reason:"他�Eメンバ�Eに割り当てられました"});await notifyUsers([o.user_id],"reject",`タスク、E{t.title}」�E申請�E見送られました`);}
      await notifyUsers([r.user_id],"approve",`タスク、E{t.title}」�E割当申請が承認されました`,{email:true});
    }
    toast("承認しました");
  }
  async function reject(r){
    const t=taskOf(r);
    await updateRow("requests",{id:r.id},{status:"rejected",reject_reason:reason.trim()});
    await notifyUsers([r.user_id],"reject",`${r.type==="extend"?"期日延長申諁E:"割当申諁E}、E{t?t.title:"?"}」が却下されました${reason.trim()?": "+reason.trim():""}`,{email:true});
    setRejecting(null);setReason("");toast("却下しました");
  }
  const ReqCard=({r})=>{const t=taskOf(r);const u=userOf(r);return(
    <div className="panel p-4">
      <div className="flex items-start gap-3 flex-wrap">
        <Avatar user={u} size={30}/>
        <div className="flex-1" style={{minWidth:200}}>
          <div className="text-sm font-bold">{t?t.title:"(削除済みタスク)"}</div>
          <div className="text-xs mt-1" style={{color:"var(--muted)"}}>{u?u.name:"?"} · {fmtDT(r.requested_at)}{r.type==="extend"&&t&&<> · 期日 {t.deadline} ↁE<b style={{color:"var(--ai)"}}>{r.extend_to}</b></>}</div>
          {r.reason&&<div className="text-sm mt-1">琁E��: {r.reason}</div>}
        </div>
        <Badge cls={r.type==="extend"?"b-amber":"b-blue"}>{r.type==="extend"?"期日延長":"割当申諁E}</Badge>
      </div>
      {rejecting===r.id?(
        <div className="flex gap-2 mt-3">
          <input className="input" placeholder="却下理由 (任愁E" value={reason} onChange={e=>setReason(e.target.value)}/>
          <button className="btn btn-d" onClick={()=>reject(r)}>却下すめE/button>
          <button className="btn" onClick={()=>{setRejecting(null);setReason("");}}>戻めE/button>
        </div>
      ):(
        <div className="flex justify-end gap-2 mt-3">
          <button className="btn" onClick={()=>{setRejecting(r.id);setReason("");}}><X size={14}/>却丁E/button>
          <button className="btn btn-p" onClick={()=>approve(r)}><Check size={14}/>承誁E/button>
        </div>
      )}
    </div>);};
  return (
    <div>
      <PageTitle title="申請管琁E sub={`未処琁E${pend.length} 件`}/>
      {pend.length===0?<div className="panel"><Empty icon={Inbox} text="未処琁E�E申請�Eありません"/></div>:(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{pend.map(r=><ReqCard key={r.id} r={r}/>)}</div>
      )}
      {hist.length>0&&<div className="mt-6"><h2 className="text-sm font-bold mb-2">最近�E処琁E��歴</h2>
        <div className="panel">{hist.map(r=>{const t=taskOf(r);const u=userOf(r);return(
          <div key={r.id} className="flex items-center gap-2 px-4 py-2 text-sm" style={{borderBottom:"1px solid var(--border)"}}>
            <Badge cls={r.status==="approved"?"b-green":"b-red"}>{r.status==="approved"?"承誁E:"却丁E}</Badge>
            <span className="flex-1 truncate">{t?t.title:"(削除済み)"}  E{u?u.name:"?"}{r.type==="extend"?"(期日延長)":""}</span>
            <span className="text-xs" style={{color:"var(--muted)"}}>{fmtDT(r.requested_at)}</span>
          </div>);})}</div>
      </div>}
    </div>
  );
}

/* ============================================================
   Member: ダチE��ュボ�Eド�Eタスク・タイマ�E・履歴
   ============================================================ */
function UnassignedBanner() {
  const {db,user,nav}=useApp();
  const myActive=db.tasks.filter(t=>t.assigned_user_id===user.id&&t.status!=="done");
  const activePj=new Set(db.projects.filter(p=>p.status==="active").map(p=>p.id));
  const unassigned=db.tasks.filter(t=>!t.assigned_user_id&&t.status!=="done"&&activePj.has(t.project_id));
  if(myActive.length>1||unassigned.length===0) return null;
  return <div className="panel p-4 mb-4 flex items-center gap-3 flex-wrap" style={{borderColor:"var(--ai)",background:"var(--ai-soft)"}}>
    <Sparkles size={18} style={{color:"var(--ai)"}}/>
    <div className="flex-1 text-sm" style={{minWidth:180}}><b>手が空きそぁE��すか�E�E/b> 割当可能なタスクぁE{unassigned.length} 件あります、E/div>
    <button className="btn btn-p btn-sm" onClick={()=>nav("unassigned")}>利用可能なタスクを見る</button>
  </div>;
}

function MemberDashboard() {
  const {db,user,now,timer,setOpenTaskId}=useApp();
  const mine=db.tasks.filter(t=>t.assigned_user_id===user.id);
  const [wS,wE]=weekRange();
  const today=todayStr();
  const dueToday=mine.filter(t=>t.status!=="done"&&t.deadline===today);
  const dueWeek=mine.filter(t=>t.status!=="done"&&t.deadline&&t.deadline>today&&new Date(t.deadline).getTime()<wE);
  const overdue=mine.filter(t=>t.status!=="done"&&t.deadline&&t.deadline<today);
  const weekMin=db.worklogs.filter(l=>l.user_id===user.id&&l.started_at>=wS&&l.started_at<wE).reduce((a,l)=>a+l.duration_min,0)+(timer?(now-timer.startedAt)/60000:0);
  const inProg=mine.filter(t=>t.status==="in_progress");
  const TaskRow=({t,tone})=><div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm" style={{background:"var(--panel2)"}} onClick={()=>setOpenTaskId(t.id)}><Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge><span className="flex-1 truncate font-medium">{t.title}</span><span className="text-xs mono" style={{color:tone||"var(--muted)"}}>{t.deadline}</span></div>;
  return (
    <div>
      <PageTitle title={`こんにちは、E{user.name.split(/\s+/)[0]} さん`} sub="今日の稼働をはじめましょぁE/>
      <UnassignedBanner/>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="panel p-4 md:col-span-1">
          <div className="text-xs mb-1" style={{color:"var(--muted)"}}>今週の稼働時閁E/div>
          <div className="bignum" style={{color:"var(--ai)"}}>{fmtHM(weekMin)}</div>
          <div className="text-xs mt-1" style={{color:"var(--muted)"}}>{timer?"計測中の時間を含む":"月曜はじまめE}</div>
        </div>
        <div className="panel p-4 md:col-span-2">
          <SecTitle icon={Calendar} title="締め�Eりが近いタスク"/>
          <div className="flex flex-col gap-2">
            {overdue.map(t=><TaskRow key={t.id} t={t} tone="var(--red)"/>)}
            {dueToday.map(t=><TaskRow key={t.id} t={t} tone="var(--amber)"/>)}
            {dueWeek.slice(0,4).map(t=><TaskRow key={t.id} t={t}/>)}
            {overdue.length+dueToday.length+dueWeek.length===0&&<div className="text-sm py-3" style={{color:"var(--muted)"}}>今週締め�Eり�Eタスクはありません 🎉</div>}
          </div>
        </div>
      </div>
      <section className="panel p-4">
        <SecTitle icon={Timer} title="進行中のタスク"/>
        {inProg.length===0?<Empty icon={ClipboardList} text="進行中のタスクはありません"/>:(
          <div className="flex flex-col gap-3">{inProg.map(t=>{
            const w=workedMin(db.worklogs,t.id)+(timer&&timer.taskId===t.id?(now-timer.startedAt)/60000:0);
            const r=t.max_minutes>0?w/t.max_minutes:0;
            return <div key={t.id} className="cursor-pointer" onClick={()=>setOpenTaskId(t.id)}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-2">{timer&&timer.taskId===t.id&&<span className="pulse"/>}{t.title}</span>
                <span className="text-xs mono" style={{color:r>=1?"var(--red)":r>=0.9?"var(--amber)":"var(--muted)"}}>{fmtHM(w)} / {fmtHM(t.max_minutes)}</span>
              </div><Prog ratio={r}/></div>;})}
          </div>
        )}
      </section>
    </div>
  );
}

function MemberTaskCard({t}) {
  const {db,setOpenTaskId,timer,now}=useApp();
  const w=workedMin(db.worklogs,t.id)+(timer&&timer.taskId===t.id?(now-timer.startedAt)/60000:0);
  const r=t.max_minutes>0?w/t.max_minutes:0;
  const warn=t.status!=="done"&&r>=0.9;
  return <div className="panel p-3 cursor-pointer" onClick={()=>setOpenTaskId(t.id)} style={warn?{borderColor:r>=1?"var(--red)":"var(--amber)",background:"var(--amber-bg)"}:{}}>
    <div className="flex items-center gap-2 mb-2">
      {warn&&<AlertTriangle size={14} style={{color:r>=1?"var(--red)":"var(--amber)",flexShrink:0}}/>}
      {timer&&timer.taskId===t.id&&<span className="pulse"/>}
      <span className="font-medium text-sm flex-1 truncate">{t.title}</span>
      <Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge>
    </div>
    <div className="flex items-center justify-between text-xs mb-1" style={{color:"var(--muted)"}}>
      <span className="flex items-center gap-1"><Calendar size={11}/>{t.deadline||"期日なぁE}</span>
      <span className="mono">{fmtHM(w)} / {fmtHM(t.max_minutes)}</span>
    </div>
    <Prog ratio={r}/>
    <div className="mt-2"><Badge cls={ST_BADGE[t.status]} dot>{ST[t.status]}</Badge></div>
  </div>;
}

function MemberTasks() {
  const {db,user}=useApp();
  const [stF,setStF]=useState("all");
  const [openDone,setOpenDone]=useState({});
  const mine=db.tasks.filter(t=>t.assigned_user_id===user.id);
  const pjIds=[...new Set(mine.map(t=>t.project_id))];
  const projects=pjIds.map(id=>db.projects.find(p=>p.id===id)).filter(Boolean);
  return (
    <div>
      <PageTitle title="マイタスク" sub={`全 ${mine.length} 件`}/>
      <UnassignedBanner/>
      <div className="mb-4"><Seg value={stF} onChange={setStF} options={[{value:"all",label:"すべて"},{value:"todo",label:"未着扁E},{value:"in_progress",label:"進行中"},{value:"done",label:"完亁E}]}/></div>
      {projects.length===0&&<div className="panel"><Empty icon={ClipboardList} text="割り当てられたタスクはまだありません"/></div>}
      {projects.map(p=>{
        const ts=mine.filter(t=>t.project_id===p.id&&(stF==="all"||t.status===stF));
        if(ts.length===0) return null;
        const act=ts.filter(t=>t.status!=="done"); const done=ts.filter(t=>t.status==="done");
        return <section key={p.id} className="mb-6">
          <div className="flex items-center gap-2 mb-2"><h2 className="text-sm font-bold m-0">{p.name}</h2><Badge cls={PJ_BADGE[p.status]}>{PJST[p.status]}</Badge></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">{(stF==="done"?done:act).map(t=><MemberTaskCard key={t.id} t={t}/>)}</div>
          {stF==="all"&&done.length>0&&<div className="mt-2">
            <button className="btn btn-sm" onClick={()=>setOpenDone(o=>({...o,[p.id]:!o[p.id]}))}>{openDone[p.id]?<ChevronDown size={13}/>:<ChevronRight size={13}/>}完亁E{done.length} 件</button>
            {openDone[p.id]&&<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-2" style={{opacity:0.75}}>{done.map(t=><MemberTaskCard key={t.id} t={t}/>)}</div>}
          </div>}
        </section>;})}
    </div>
  );
}

function UnassignedView() {
  const {db,user,nav,insertRow,updateRow,notifyUsers,pmIds,toast}=useApp();
  const activePj=new Set(db.projects.filter(p=>p.status==="active").map(p=>p.id));
  const list=db.tasks.filter(t=>!t.assigned_user_id&&t.status!=="done"&&activePj.has(t.project_id));
  const myPending=t=>db.requests.find(r=>r.type!=="extend"&&r.task_id===t.id&&r.user_id===user.id&&r.status==="pending");
  async function request(t){
    await insertRow("requests",{id:uid(),type:"assign",task_id:t.id,user_id:user.id,status:"pending",requested_at:Date.now()});
    await notifyUsers(pmIds(),"request",`${user.name} が未割当タスク、E{t.title}」への割当を申請しました`,{email:true});
    toast("申請を送信しました");
  }
  return (
    <div>
      <PageTitle title="利用可能なタスク" sub="未割当�Eタスクに割当を申請できまぁE back={()=>nav("mytasks")}/>
      {list.length===0?<div className="panel"><Empty icon={Inbox} text="現在、割当可能なタスクはありません"/></div>:(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{list.map(t=>{
          const p=db.projects.find(x=>x.id===t.project_id); const pending=myPending(t);
          return <div key={t.id} className="panel p-4">
            <div className="flex items-center gap-2 mb-1"><span className="font-bold text-sm flex-1">{t.title}</span><Badge cls={PR_BADGE[t.priority]}>{PR[t.priority]}</Badge></div>
            <div className="text-xs mb-2" style={{color:"var(--muted)"}}>{p?p.name:""}</div>
            {t.description&&<div className="text-sm mb-2" style={{color:"var(--muted)"}}>{t.description.slice(0,80)}{t.description.length>80?"…":""}</div>}
            <div className="flex gap-4 text-xs mb-3 flex-wrap" style={{color:"var(--muted)"}}>
              <span className="flex items-center gap-1"><Calendar size={11}/>{t.deadline||" E}</span>
              <span className="mono">予箁E{fmtYen(t.budget)}</span>
              <span className="mono flex items-center gap-1"><Clock size={11}/>上限 {fmtHM(t.max_minutes)}</span>
            </div>
            {pending?<button className="btn w-full justify-center" disabled>申請済み (承認征E��)</button>:<button className="btn btn-p w-full justify-center" onClick={()=>request(t)}>割当を申請すめE/button>}
          </div>;})}
        </div>
      )}
    </div>
  );
}

function MemberTaskModalHost() {
  const {openTaskId,setOpenTaskId}=useApp();
  if(!openTaskId) return null;
  return <MemberTaskModal taskId={openTaskId} onClose={()=>setOpenTaskId(null)}/>;
}

function MemberTaskModal({taskId, onClose}) {
  const {db,user,timer,now,startTimer,stopTimer,updateRow,insertRow,notifyUsers,pmIds,toast}=useApp();
  const [completing,setCompleting]=useState(false); const [comment,setComment]=useState("");
  const [extending,setExtending]=useState(false); const [extDate,setExtDate]=useState(""); const [extReason,setExtReason]=useState("");
  const t=db.tasks.find(x=>x.id===taskId); if(!t) return null;
  const p=db.projects.find(x=>x.id===t.project_id);
  const running=timer&&timer.taskId===t.id;
  const worked=workedMin(db.worklogs,t.id)+(running?(now-timer.startedAt)/60000:0);
  const remain=(t.max_minutes||0)-worked;
  const logs=db.worklogs.filter(l=>l.task_id===t.id).sort((a,b)=>b.started_at-a.started_at);
  const extPending=db.requests.find(r=>r.type==="extend"&&r.task_id===t.id&&r.user_id===user.id&&r.status==="pending");
  const over=t.max_minutes>0&&worked>=t.max_minutes;
  async function complete(){
    if(comment.trim().length<50) return;
    await updateRow("tasks",{id:t.id},{status:"done",completed_at:Date.now(),completion_comment:comment.trim()});
    if(running) await stopTimer();
    await notifyUsers(pmIds(),"done",`${user.name} が、E{t.title}」を完亁E��告しました`,{email:true});
    toast("完亁E��報告しました"); setCompleting(false); onClose();
  }
  async function requestExtend(){
    if(!extDate||(t.deadline&&extDate<=t.deadline)){toast("現在の期日より後�E日付を選んでください");return;}
    await insertRow("requests",{id:uid(),type:"extend",task_id:t.id,user_id:user.id,status:"pending",requested_at:Date.now(),extend_to:extDate,reason:extReason.trim()});
    await notifyUsers(pmIds(),"extend",`${user.name} が、E{t.title}」�E期日延長を申請しました (${t.deadline} ↁE${extDate})`,{email:true});
    setExtending(false);setExtDate("");setExtReason("");toast("延長申請を送信しました");
  }
  return (
    <Modal open onClose={onClose} title="タスク詳細">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div><div className="text-lg font-bold">{t.title}</div><div className="text-xs" style={{color:"var(--muted)"}}>{p?p.name:""}</div></div>
        <div className="flex flex-col items-end gap-1"><Badge cls={ST_BADGE[t.status]} dot>{ST[t.status]}</Badge><Badge cls={PR_BADGE[t.priority]}>優先度 {PR[t.priority]}</Badge></div>
      </div>
      {over&&t.status!=="done"&&<div className="flex items-center gap-2 p-3 rounded-lg text-sm my-3" style={{background:"var(--red-bg)",color:"var(--red)"}}><AlertTriangle size={15}/>稼働時間が上限を趁E��しました。PMに連絡してください、E/div>}
      <div className="p-3 rounded-lg my-3" style={{background:"var(--ai-soft)"}}><div className="lbl" style={{color:"var(--ai)"}}>目標�EノルチE/div><div className="text-sm font-medium" style={{whiteSpace:"pre-wrap"}}>{t.goal||" E}</div></div>
      {t.description&&<div className="text-sm mb-3" style={{whiteSpace:"pre-wrap",color:"var(--muted)"}}>{t.description}</div>}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <MiniStat label="期日" value={t.deadline||" E}/>
        <MiniStat label="累訁E/ 上限" value={`${fmtHM(worked)} / ${fmtHM(t.max_minutes)}`} mono warn={t.max_minutes>0&&worked>=t.max_minutes*0.9}/>
        <MiniStat label="残り時間" value={remain>=0?fmtHM(remain):"-"+fmtHM(-remain)} mono warn={remain<0}/>
      </div>
      <Prog ratio={t.max_minutes>0?worked/t.max_minutes:0}/>
      {t.status!=="done"?(
        <div className="my-4">
          {running?(
            <div className="panel p-4 flex items-center gap-3" style={{borderColor:"var(--ai)"}}>
              <span className="pulse"/>
              <div className="flex-1"><div className="text-xs" style={{color:"var(--muted)"}}>計測中</div><div className="mono text-2xl font-bold">{fmtHMS((now-timer.startedAt)/1000)}</div></div>
              <button className="btn btn-p" onClick={stopTimer}><Square size={15}/>稼働停止</button>
            </div>
          ):(
            <button className="btn btn-p w-full justify-center py-3" style={{fontSize:15}} onClick={()=>startTimer(t)} disabled={!!timer} onTouchEnd={e=>{if(!timer){e.preventDefault();startTimer(t);}}}>
              <Play size={17}/>{timer?"他�Eタスクを計測中":"稼働開姁E}
            </button>
          )}
        </div>
      ):(t.completion_comment&&<div className="p-3 rounded-lg my-3" style={{background:"var(--green-bg)"}}><div className="lbl" style={{color:"var(--green)"}}>完亁E��メンチE/div><div className="text-sm" style={{whiteSpace:"pre-wrap"}}>{t.completion_comment}</div></div>)}
      <div className="mb-3"><div className="lbl">過去の稼働ログ ({logs.length}件)</div>
        {logs.length===0?<div className="text-sm" style={{color:"var(--muted)"}}>まだ記録がありません</div>:(
          <div className="panel" style={{maxHeight:150,overflowY:"auto"}}>
            {logs.map(l=><div key={l.id} className="flex items-center gap-3 px-3 py-2 text-sm" style={{borderBottom:"1px solid var(--border)"}}>
              <span className="text-xs mono" style={{color:"var(--muted)",width:88,flexShrink:0}}>{fmtDT(l.started_at)}</span>
              <span className="mono font-medium" style={{width:52}}>{fmtHM(l.duration_min)}</span>
              <span className="text-xs flex-1 truncate" style={{color:"var(--muted)"}}>{l.note}</span>
            </div>)}
          </div>
        )}
      </div>
      <CommentThread task={t}/>
      {t.status!=="done"&&<div className="mt-5 flex flex-col gap-3">
        {completing?(
          <div className="panel p-3" style={{background:"var(--panel2)",border:"none"}}>
            <div className="lbl">完亁E��メンチE(50斁E��以上�E忁E��E</div>
            <textarea className="textarea" value={comment} onChange={e=>setComment(e.target.value)} placeholder="達�E冁E��・成果物の場所・引き継ぎ事頁E��どを記�E"/>
            <div className="text-xs mt-1 text-right" style={{color:comment.trim().length>=50?"var(--green)":"var(--muted)"}}>{comment.trim().length} / 50斁E��E/div>
            <div className="flex justify-end gap-2 mt-2">
              <button className="btn btn-sm" onClick={()=>setCompleting(false)}>戻めE/button>
              <button className="btn btn-p btn-sm" disabled={comment.trim().length<50} onClick={complete}><Check size={13}/>完亁E��告を送信</button>
            </div>
          </div>
        ):extending?(
          <div className="panel p-3" style={{background:"var(--panel2)",border:"none"}}>
            <div className="lbl">期日延長申諁E(現在: {t.deadline||" E})</div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input type="date" className="input" value={extDate} onChange={e=>setExtDate(e.target.value)}/>
              <input className="input" placeholder="琁E��" value={extReason} onChange={e=>setExtReason(e.target.value)}/>
            </div>
            <div className="flex justify-end gap-2"><button className="btn btn-sm" onClick={()=>setExtending(false)}>戻めE/button><button className="btn btn-p btn-sm" onClick={requestExtend}>申請すめE/button></div>
          </div>
        ):(
          <div className="flex gap-2 flex-wrap">
            <button className="btn flex-1 justify-center" onClick={()=>setCompleting(true)}><CheckCircle2 size={15}/>完亁E��する</button>
            {extPending?<button className="btn flex-1 justify-center" disabled>延長申請中</button>:<button className="btn flex-1 justify-center" onClick={()=>{setExtending(true);setExtDate("");}}><Calendar size={15}/>期日延長を申諁E/button>}
          </div>
        )}
      </div>}
    </Modal>
  );
}

function TimerConfirmModal({data, onClose}) {
  const {commitWorkLog,ask,toast}=useApp();
  const {task,seconds,startedAt}=data;
  const preH=Math.floor(seconds/3600),preM=Math.floor((seconds%3600)/60);
  const [h,setH]=useState(preH); const [m,setM]=useState(preM);
  const [edited,setEdited]=useState(false); const [note,setNote]=useState(""); const [err,setErr]=useState("");
  const measuredMin=seconds/60;
  const editedMin=(Number(h)||0)*60+(Number(m)||0);
  function onEdit(setter){return e=>{setter(e.target.value);setEdited(true);setErr("");};}
  function reset(){setH(preH);setM(preM);setEdited(false);setErr("");}
  async function submit(){
    if(edited&&editedMin>measuredMin){setErr("計測時間より長くすることはできません");return;}
    if(edited&&editedMin<=0){setErr("1刁E��上を入力してください");return;}
    if(!task){toast("対象タスクが削除されてぁE��ため記録を破棁E��ました");onClose();return;}
    await commitWorkLog(task,startedAt,seconds,edited?editedMin:measuredMin,note);
  }
  async function discard(){if(await ask("こ�E計測記録を破棁E��ますか�E�E)) onClose();}
  return (
    <Modal open onClose={discard} title="稼働�E記録・報呁E noClose>
      <div className="text-sm mb-1" style={{color:"var(--muted)"}}>{task?task.title:"(削除されたタスク)"}</div>
      <div className="text-center my-4"><div className="text-xs mb-1" style={{color:"var(--muted)"}}>計測時間</div><div className="mono font-bold" style={{fontSize:40}}>{fmtHMS(seconds)}</div></div>
      <Field label="記録する時間 (短縮のみ可能)" error={err}>
        <div className="flex items-center gap-2">
          <input type="number" min="0" className="input num" style={{width:84}} value={h} onChange={onEdit(setH)}/><span className="text-sm">時間</span>
          <input type="number" min="0" max="59" className="input num" style={{width:74}} value={m} onChange={onEdit(setM)}/><span className="text-sm">刁E/span>
          <button className="btn btn-sm" onClick={reset}><RefreshCw size={12}/>リセチE��</button>
        </div>
      </Field>
      <Field label={`メモ (任意�E${note.length}/100斁E��E`}><input className="input" maxLength={100} value={note} onChange={e=>setNote(e.target.value)} placeholder="作業冁E��のメモ"/></Field>
      <div className="flex justify-between gap-2 mt-4">
        <button className="btn btn-d" onClick={discard}>破棁E/button>
        <button className="btn btn-p" onClick={submit}><Check size={15}/>確定�E報呁E/button>
      </div>
    </Modal>
  );
}

function HistoryView() {
  const {db,user}=useApp();
  const [month,setMonth]=useState("all");
  const mine=db.worklogs.filter(l=>l.user_id===user.id).sort((a,b)=>b.started_at-a.started_at);
  const months=useMemo(()=>{const s=new Set();mine.forEach(l=>{const d=new Date(l.started_at);s.add(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);});return [...s].sort().reverse();},[db.worklogs,user.id]);
  const list=mine.filter(l=>{if(month==="all") return true;const d=new Date(l.started_at);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`===month;});
  const total=list.reduce((a,l)=>a+l.duration_min,0);
  return (
    <div>
      <PageTitle title="稼働履歴" sub={`${month==="all"?"全期間":month} 合訁E${fmtHM(total)}`} right={<select className="select" style={{width:"auto"}} value={month} onChange={e=>setMonth(e.target.value)}><option value="all">全期間</option>{months.map(mo=><option key={mo} value={mo}>{mo}</option>)}</select>}/>
      <div className="panel" style={{overflowX:"auto"}}>
        <table className="tbl" style={{minWidth:560}}>
          <thead><tr><th>日晁E/th><th>タスク</th><th>プロジェクチE/th><th>時間</th><th>メモ</th></tr></thead>
          <tbody>{list.map(l=>{const t=db.tasks.find(x=>x.id===l.task_id);const p=t&&db.projects.find(x=>x.id===t.project_id);return(
            <tr key={l.id}>
              <td className="num text-xs" style={{color:"var(--muted)"}}>{fmtDT(l.started_at)}</td>
              <td className="font-medium">{t?t.title:"(削除済み)"}</td>
              <td className="text-xs" style={{color:"var(--muted)"}}>{p?p.name:" E}</td>
              <td className="num">{fmtHM(l.duration_min)}</td>
              <td className="text-xs" style={{color:"var(--muted)"}}>{l.note}</td>
            </tr>);})}
            {list.length===0&&<tr><td colSpan={5}><Empty icon={History} text="稼働記録がありません"/></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProfileView() {
  const {user,updateRow,toast}=useApp();
  const [name,setName]=useState(user.name);
  const [cur,setCur]=useState(""); const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [err,setErr]=useState("");
  async function saveName(){if(!name.trim()) return;await updateRow("users",{id:user.id},{name:name.trim()});toast("名前を更新しました");}
  async function savePw(){
    setErr("");
    if(pw.length<6){setErr("新しいパスワード�E6斁E��以上にしてください");return;}
    if(pw!==pw2){setErr("確認用パスワードが一致しません");return;}
    // 現在のパスワードで再認証
    const {error:signInErr}=await supabase.auth.signInWithPassword({email:user.email,password:cur});
    if(signInErr){setErr("現在のパスワードが正しくありません");return;}
    const {error}=await supabase.auth.updateUser({password:pw});
    if(error){setErr(error.message);return;}
    setCur("");setPw("");setPw2("");toast("パスワードを変更しました");
  }
  return (
    <div style={{maxWidth:480}}>
      <PageTitle title="プロフィール設宁E/>
      <div className="panel p-4 mb-4">
        <div className="flex items-center gap-3 mb-4"><Avatar user={user} size={44}/><div><div className="font-bold">{user.name}</div><div className="text-xs" style={{color:"var(--muted)"}}>{user.email} · {user.role}</div></div></div>
        <Field label="表示吁E><input className="input" value={name} onChange={e=>setName(e.target.value)}/></Field>
        <button className="btn btn-p" onClick={saveName}>名前を保孁E/button>
      </div>
      <div className="panel p-4">
        <SecTitle icon={Shield} title="パスワード変更"/>
        <Field label="現在のパスワーチE><input type="password" className="input" value={cur} onChange={e=>setCur(e.target.value)}/></Field>
        <Field label="新しいパスワーチE(6斁E��以丁E"><input type="password" className="input" value={pw} onChange={e=>setPw(e.target.value)}/></Field>
        <Field label="新しいパスワーチE(確誁E"><input type="password" className="input" value={pw2} onChange={e=>setPw2(e.target.value)}/></Field>
        {err&&<div className="err mb-2">{err}</div>}
        <button className="btn btn-p" onClick={savePw}>パスワードを変更</button>
      </div>
    </div>
  );
}

function UsersView() {
  const {db,user,insertRow,updateRow,deleteRow,toast,ask}=useApp();
  const [invite,setInvite]=useState(false);
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [role,setRole]=useState("Member");
  const [issued,setIssued]=useState(null);
  async function doInvite(){
    if(!name.trim()||!email.includes("@")){toast("名前とメールアドレスを�E力してください");return;}
    const em=email.trim().toLowerCase();
    if(db.users.some(u=>u.email===em)){toast("そ�Eメールアドレスは登録済みでぁE);return;}
    const pw=genPw(); const salt=uid();
    const nu={id:uid(),name:name.trim(),email:em,role,avatar_color:AV_COLORS[db.users.length%AV_COLORS.length],salt,pass_hash:await sha(pw,salt),pending:false,must_change:true,created_at:Date.now()};
    await insertRow("users",nu);
    setIssued({name:nu.name,email:em,pw}); setInvite(false); setName(""); setEmail(""); setRole("Member");
  }
  async function resetPw(u){
    if(!(await ask(`${u.name} の仮パスワードを再発行しますか�E�`))) return;
    const pw=genPw();
    // Supabase Auth側のパスワードをサービスロールで更新�E�Enon keyでは不可のためユーザー自身に変更させる！E    await updateRow("users",{id:u.id},{must_change:true});
    setIssued({name:u.name,email:u.email,pw,note:"※ パスワードリセチE��はSupabaseダチE��ュボ�Eド�EAuthentication→Usersから行ってください"});
  }
  async function changeRole(u,r){
    if(u.role==="PM"&&r==="Member"&&db.users.filter(x=>x.role==="PM"&&!x.pending).length<=1){toast("最後�EPMは変更できません");return;}
    await updateRow("users",{id:u.id},{role:r}); toast("ロールを変更しました");
  }
  async function del(u){
    if(!(await ask(`${u.name} を削除しますか�E�`))) return;
    await deleteRow("users",{id:u.id}); toast("削除しました");
  }
  return (
    <div>
      <PageTitle title="ユーザー管琁E sub={`${db.users.length} 名`} right={<button className="btn btn-p" onClick={()=>setInvite(true)}><Plus size={15}/>メンバ�Eを招征E/button>}/>
      <PMApprovalSection/>
      <div className="panel" style={{overflowX:"auto"}}>
        <table className="tbl" style={{minWidth:620}}>
          <thead><tr><th>ユーザー</th><th>メール</th><th>ロール</th><th/></tr></thead>
          <tbody>{db.users.map(u=>(
            <tr key={u.id}>
              <td><span className="flex items-center gap-2"><Avatar user={u} size={26}/>{u.name}{u.id===user.id&&<Badge cls="b-blue">自刁E/Badge>}{u.pending&&<Badge cls="b-amber">PM承認征E��</Badge>}{!u.pending&&u.must_change&&<Badge cls="b-amber">仮PW</Badge>}</span></td>
              <td className="text-xs" style={{color:"var(--muted)"}}>{u.email}</td>
              <td><select className="select" style={{width:110,padding:"4px 8px",fontSize:12}} value={u.role} onChange={e=>changeRole(u,e.target.value)} disabled={u.id===user.id||u.pending}><option value="PM">PM</option><option value="Member">Member</option></select></td>
              <td><div className="flex gap-1 justify-end">
                <button className="btn btn-sm" onClick={()=>resetPw(u)}>PW再発衁E/button>
                {u.id!==user.id&&<button className="iconbtn" style={{width:30,height:30}} onClick={()=>del(u)}><Trash2 size={14}/></button>}
              </div></td>
            </tr>))}
          </tbody>
        </table>
      </div>
      <Modal open={invite} onClose={()=>setInvite(false)} title="メンバ�Eを招征E>
        <p className="text-xs mb-3" style={{color:"var(--muted)"}}>仮パスワードが発行されます。本人に共有してください、E/p>
        <Field label="名前"><input className="input" value={name} onChange={e=>setName(e.target.value)}/></Field>
        <Field label="メールアドレス"><input className="input" value={email} onChange={e=>setEmail(e.target.value)}/></Field>
        <Field label="ロール"><select className="select" value={role} onChange={e=>setRole(e.target.value)}><option value="Member">Member</option><option value="PM">PM</option></select></Field>
        <div className="flex justify-end gap-2 mt-4"><button className="btn" onClick={()=>setInvite(false)}>キャンセル</button><button className="btn btn-p" onClick={doInvite}>発行すめE/button></div>
      </Modal>
      <Modal open={!!issued} onClose={()=>setIssued(null)} title="ログイン惁E��を発行しました">
        {issued&&<div>
          <div className="panel p-3 mb-3 mono text-sm" style={{background:"var(--panel2)",border:"none"}}>{issued.name}<br/>メール: {issued.email}<br/>仮パスワーチE <b>{issued.pw}</b></div>
          <p className="text-xs mb-3" style={{color:"var(--muted)"}}>こ�E画面を閉じると再表示できません、E/p>
          <button className="btn btn-p w-full justify-center" onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(`${issued.email} / ${issued.pw}`);setIssued(null);}}><Copy size={14}/>コピ�Eして閉じめE/button>
        </div>}
      </Modal>
    </div>
  );
}

function PMApprovalSection() {
  const {db,updateRow,deleteRow,toast}=useApp();
  const pending=db.users.filter(u=>u.pending&&u.role==="PM");
  if(pending.length===0) return null;
  async function approve(u){await updateRow("users",{id:u.id},{pending:false});toast(`${u.name} のPM権限を承認しました`);}
  async function reject(u){await deleteRow("users",{id:u.id});toast(`${u.name} のPM申請を却下しました`);}
  return (
    <div className="panel p-4 mb-4" style={{borderColor:"var(--amber)"}}>
      <SecTitle icon={Shield} title={`PM権限�E申諁E(${pending.length}件)`} tone="var(--amber)"/>
      <div className="flex flex-col gap-2">{pending.map(u=>(
        <div key={u.id} className="flex items-center gap-3 flex-wrap p-2 rounded-lg" style={{background:"var(--amber-bg)"}}>
          <Avatar user={u} size={30}/>
          <div className="flex-1" style={{minWidth:160}}>
            <div className="text-sm font-bold">{u.name}</div>
            <div className="text-xs" style={{color:"var(--muted)"}}>{u.email}{u.pm_apply_reason&&` · ${u.pm_apply_reason}`}</div>
          </div>
          <div className="flex gap-2"><button className="btn btn-d btn-sm" onClick={()=>reject(u)}><X size={13}/>却丁E/button><button className="btn btn-p btn-sm" onClick={()=>approve(u)}><Check size={13}/>承誁E/button></div>
        </div>))}
      </div>
    </div>
  );
}
