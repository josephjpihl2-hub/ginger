import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Plus, Search, Star, Bookmark, Clock3, Settings2, Moon, Sun, X, ExternalLink, Globe2 } from "lucide-react";

type Tab = { id:number; title:string; url:string };
const sites = [
  ["YouTube","https://youtube.com","▶","red"],["Google","https://google.com","G","blue"],
  ["Wikipedia","https://wikipedia.org","W","gray"],["GitHub","https://github.com","⌘","dark"],
  ["Twitch","https://twitch.tv","▣","purple"],["Raccoon Game","https://www.raccoongame.com/","R","orange"]
];
const addressOf = (s:string) => {
  const v=s.trim(); if(!v) return "";
  if(/^https?:\/\//i.test(v)) return v;
  if(v.includes(".") && !v.includes(" ")) return "https://"+v;
  return "https://duckduckgo.com/?q="+encodeURIComponent(v);
};
export default function App(){
  const [tabs,setTabs]=useState<Tab[]>([{id:1,title:"New tab",url:""}]);
  const [active,setActive]=useState(1);
  const [value,setValue]=useState("");
  const [dark,setDark]=useState(localStorage.getItem("ginger-theme")==="dark");
  const [bookmarks,setBookmarks]=useState<{title:string,url:string}[]>(JSON.parse(localStorage.getItem("ginger-bookmarks")||"[]"));
  const [history,setHistory]=useState<{title:string,url:string}[]>(JSON.parse(localStorage.getItem("ginger-history")||"[]"));
  const [panel,setPanel]=useState<"bookmarks"|"history"|"settings"|null>(null);
  const tab=tabs.find(t=>t.id===active)!;
  useEffect(()=>{document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("ginger-theme",dark?"dark":"light")},[dark]);
  useEffect(()=>localStorage.setItem("ginger-bookmarks",JSON.stringify(bookmarks)),[bookmarks]);
  useEffect(()=>localStorage.setItem("ginger-history",JSON.stringify(history)),[history]);
  function go(raw:string){const url=addressOf(raw);if(!url)return;const title=raw.trim()||url;setTabs(ts=>ts.map(t=>t.id===active?{...t,title:title.slice(0,28),url}:t));setValue("");setHistory(h=>[{title,url},...h.filter(x=>x.url!==url)].slice(0,100));}
  function addTab(){const id=Math.max(...tabs.map(t=>t.id))+1;setTabs([...tabs,{id,title:"New tab",url:""}]);setActive(id);}
  function close(id:number){if(tabs.length===1){setTabs([{id:1,title:"New tab",url:""}]);setActive(1);return;}const next=tabs.filter(t=>t.id!==id);setTabs(next);if(active===id)setActive(next[next.length-1].id);}
  function toggleBookmark(){if(!tab.url)return;setBookmarks(b=>b.some(x=>x.url===tab.url)?b.filter(x=>x.url!==tab.url):[{title:tab.title,url:tab.url},...b]);}
  const saved=bookmarks.some(x=>x.url===tab.url);
  return <main className="app">
    <header className="top"><div className="brand"><b>g</b> GINGER</div><div className="tabs">{tabs.map(t=><button className={"tab "+(t.id===active?"selected":"")} onClick={()=>setActive(t.id)} key={t.id}><Globe2 size={13}/><span>{t.title}</span><i onClick={e=>{e.stopPropagation();close(t.id)}}><X size={12}/></i></button>)}<button className="tiny" onClick={addTab}><Plus size={16}/></button></div><button className="tiny" onClick={()=>setPanel("settings")}><Settings2 size={17}/></button></header>
    <nav className="bar"><div className="navbtn"><button className="tiny" disabled><ArrowLeft size={17}/></button><button className="tiny" disabled><ArrowRight size={17}/></button><button className="tiny" onClick={()=>tab.url&&window.open(tab.url,"_blank","noopener,noreferrer")}><RotateCw size={16}/></button></div><form className="address" onSubmit={e=>{e.preventDefault();go(value)}}><Search size={16}/><input value={value} onChange={e=>setValue(e.target.value)} placeholder="Search the web or enter an address"/><button type="button" className={saved?"star saved":"star"} onClick={toggleBookmark}><Star size={16}/></button></form><div className="navbtn"><button className="tiny" onClick={()=>setPanel("bookmarks")}><Bookmark size={17}/></button><button className="tiny" onClick={()=>setPanel("history")}><Clock3 size={17}/></button></div></nav>
    {tab.url?<section className="page"><div className="notice"><Globe2 size={24}/><h2>{tab.title}</h2><p>GINGER's proxy connection is not deployed yet.</p><p>For now, this page can be opened directly. A real embedded proxy needs a compatible Scramjet + Wisp server hosted separately in the cloud.</p><button className="primary" onClick={()=>window.open(tab.url,"_blank","noopener,noreferrer")}>Open directly <ExternalLink size={14}/></button><small>{tab.url}</small></div></section>:
    <section className="home"><div className="home-top"><span>YOUR SPACE ON THE OPEN WEB</span><button className="theme" onClick={()=>setDark(!dark)}>{dark?<Sun size={15}/>:<Moon size={15}/>} {dark?"Light":"Dark"} mode</button></div><div className="hero"><div className="logo"><em>g</em><strong>GINGER<span>.</span></strong></div><p>A calmer corner of the internet.</p><form className="hero-search" onSubmit={e=>{e.preventDefault();go(value)}}><Search size={18}/><input value={value} onChange={e=>setValue(e.target.value)} placeholder="Where do you want to go?"/><kbd>↵</kbd></form></div><div className="links"><label>YOUR PLACES</label><div className="grid">{sites.map(([name,url,mark,tint])=><button className="shortcut" key={name} onClick={()=>go(url)}><b className={String(tint)}>{mark}</b>{name}<ExternalLink size={12}/></button>)}</div></div><footer>GINGER / BUILT FOR THE OPEN WEB <span>● GUEST MODE</span></footer></section>}
    {panel&&<div className="shade" onClick={()=>setPanel(null)}><aside onClick={e=>e.stopPropagation()}><div className="panelhead"><div><small>GINGER / {panel.toUpperCase()}</small><h2>{panel==="settings"?"Preferences":panel==="bookmarks"?"Saved places":"Recent history"}</h2></div><button className="tiny" onClick={()=>setPanel(null)}><X size={18}/></button></div>
    {panel==="settings"?<><div className="item"><div><b>Appearance</b><small>Switch between light and dark</small></div><button className="pill" onClick={()=>setDark(!dark)}>{dark?"Dark":"Light"}</button></div><div className="item"><div><b>Search engine</b><small>DuckDuckGo</small></div><small>DEFAULT</small></div><div className="item"><div><b>Proxy service</b><small>Not deployed yet</small></div><small>OFFLINE</small></div></>:<div className="list">{(panel==="bookmarks"?bookmarks:history).length?(panel==="bookmarks"?bookmarks:history).map((x,i)=><div className="saved" key={x.url+i}><button onClick={()=>{go(x.url);setPanel(null)}}><b>{x.title}</b><small>{x.url}</small></button>{panel==="bookmarks"&&<button className="tiny" onClick={()=>setBookmarks(b=>b.filter((_,n)=>n!==i))}>×</button>}</div>):<p className="empty">Nothing here yet.</p>)}{panel==="history"&&<button className="clear" onClick={()=>setHistory([])}>Clear history</button>}</div>}
    </aside></div>}
  </main>;
}