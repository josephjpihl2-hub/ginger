
import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, RotateCw, Plus, Search,
  Star, Bookmark, Clock3, Settings2, Moon, Sun,
  X, ExternalLink, Globe2, Trash2, Home, Gamepad2
} from "lucide-react";

type Tab = {
  id: number;
  title: string;
  url: string;
};

type SavedSite = {
  title: string;
  url: string;
};

const sites = [
  { name: "YouTube", url: "https://www.youtube.com", icon: "▶", color: "#ff4545" },
  { name: "Google", url: "https://www.google.com", icon: "G", color: "#4285f4" },
  { name: "Wikipedia", url: "https://www.wikipedia.org", icon: "W", color: "#888888" },
  { name: "GitHub", url: "https://github.com", icon: "⌘", color: "#777777" },
  { name: "Twitch", url: "https://www.twitch.tv", icon: "▣", color: "#9146ff" },
  { name: "Raccoon Game", url: "https://www.raccoongame.com/", icon: "🦝", color: "#e49b45" }
];

const getStored = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

function getAddress(input: string): string {
  const value = input.trim();

  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  if (/^[\w-]+(\.[\w-]+)+/.test(value) && !value.includes(" ")) {
    return "https://" + value;
  }

  return "https://duckduckgo.com/?q=" + encodeURIComponent(value);
}

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: 1, title: "New tab", url: "" }
  ]);

  const [active, setActive] = useState(1);
  const [address, setAddress] = useState("");
  const [dark, setDark] = useState(
    () => getStored("ginger-theme", "dark") === "dark"
  );

  const [bookmarks, setBookmarks] = useState<SavedSite[]>(
    () => getStored("ginger-bookmarks", [])
  );

  const [history, setHistory] = useState<SavedSite[]>(
    () => getStored("ginger-history", [])
  );

  const [panel, setPanel] = useState<
    "bookmarks" | "history" | "settings" | null
  >(null);

  const [showAbout, setShowAbout] = useState(false);

  const tab = tabs.find(t => t.id === active) || tabs[0];

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem("ginger-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("ginger-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("ginger-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    setAddress("");
  }, [active]);

  function openWebsite(raw: string) {
    const url = getAddress(raw);
    if (!url) return;

    const title = raw.trim().slice(0, 35) || "Website";

    setTabs(current =>
      current.map(t =>
        t.id === active ? { ...t, title, url } : t
      )
    );

    setHistory(current =>
      [{ title, url }, ...current.filter(item => item.url !== url)].slice(0, 100)
    );

    setAddress("");

    // Open the actual website in a separate browser tab.
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function newTab() {
    const id = Math.max(0, ...tabs.map(t => t.id)) + 1;

    setTabs(current => [
      ...current,
      { id, title: "New tab", url: "" }
    ]);

    setActive(id);
    setPanel(null);
  }

  function closeTab(id: number) {
    if (tabs.length === 1) {
      setTabs([{ id: 1, title: "New tab", url: "" }]);
      setActive(1);
      return;
    }

    const next = tabs.filter(t => t.id !== id);
    setTabs(next);

    if (active === id) {
      setActive(next[next.length - 1].id);
    }
  }

  function toggleBookmark() {
    if (!tab.url) return;

    setBookmarks(current =>
      current.some(item => item.url === tab.url)
        ? current.filter(item => item.url !== tab.url)
        : [{ title: tab.title, url: tab.url }, ...current]
    );
  }

  function goHome() {
    setTabs(current =>
      current.map(t =>
        t.id === active ? { ...t, title: "New tab", url: "" } : t
      )
    );
    setPanel(null);
  }

  const saved = bookmarks.some(item => item.url === tab.url);

  const bg = dark ? "#111210" : "#f7f5f0";
  const surface = dark ? "#1b1c19" : "#ffffff";
  const text = dark ? "#f2f0e9" : "#24241f";
  const muted = dark ? "#96958d" : "#85847c";
  const border = dark ? "#30312c" : "#e7e4dc";
  const accent = "#e58b43";

  const buttonStyle = {
    background: "transparent",
    border: "none",
    color: muted,
    cursor: "pointer",
    padding: 9,
    borderRadius: 9,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  } as const;

  const cardStyle = {
    background: surface,
    border: `1px solid ${border}`,
    borderRadius: 15,
    color: text
  } as const;

  return (
    <main style={{
      minHeight: "100vh",
      background: bg,
      color: text,
      fontFamily: "Inter, system-ui, Arial, sans-serif",
      transition: "background .2s, color .2s"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        button, input { font: inherit; }
        button { transition: .15s ease; }
        button:hover { filter: brightness(1.12); }
        .ginger-tab {
          display:flex; align-items:center; gap:9px;
          padding:10px 12px; border:1px solid transparent;
          border-radius:10px; background:transparent;
          color:inherit; cursor:pointer; max-width:210px;
        }
        .ginger-tab.active {
          background:${surface}; border-color:${border};
        }
        .ginger-tab span {
          overflow:hidden; white-space:nowrap; text-overflow:ellipsis;
        }
        .ginger-shortcut {
          display:flex; align-items:center; gap:13px;
          padding:17px; border:1px solid ${border};
          background:${surface}; color:inherit; border-radius:13px;
          cursor:pointer; text-decoration:none; min-width:0;
        }
        .ginger-shortcut:hover {
          border-color:${accent}; transform:translateY(-2px);
        }
        .ginger-shortcut b {
          width:37px;height:37px;border-radius:11px;
          display:grid;place-items:center;font-size:18px;
          flex-shrink:0;
        }
        .ginger-shortcut span {
          overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
        }
        .ginger-input {
          background:transparent;color:${text};border:0;
          outline:none;width:100%;font-size:15px;
        }
        .ginger-panel-button {
          display:flex;align-items:center;justify-content:space-between;
          gap:10px;width:100%;padding:13px 0;
          background:transparent;color:inherit;border:0;
          border-bottom:1px solid ${border};cursor:pointer;text-align:left;
        }
        @media(max-width:600px) {
          .ginger-shortcuts { grid-template-columns:1fr !important; }
          .ginger-brand { font-size:14px !important; }
          .ginger-tab { padding:8px; }
          .ginger-tab span { max-width:65px; }
        }
      `}</style>

      {/* TOP BAR */}
      <header style={{
        height:65,
        padding:"0 22px",
        display:"flex",
        alignItems:"center",
        gap:20,
        borderBottom:`1px solid ${border}`,
        background:surface
      }}>
        <button
          className="ginger-brand"
          onClick={goHome}
          style={{
            border:0,
            background:"transparent",
            color:text,
            fontWeight:850,
            fontSize:18,
            letterSpacing:2,
            cursor:"pointer",
            display:"flex",
            alignItems:"center",
            gap:9
          }}
        >
          <span style={{
            background:accent,
            color:"#21170f",
            width:29,
            height:29,
            borderRadius:9,
            display:"grid",
            placeItems:"center",
            fontSize:20,
            fontWeight:900
          }}>g</span>
          GINGER<span style={{color:accent}}>.</span>
        </button>

        <div style={{
          display:"flex",
          alignItems:"center",
          gap:5,
          flex:1,
          overflowX:"auto"
        }}>
          {tabs.map(t => (
            <div
              key={t.id}
              className={`ginger-tab ${t.id === active ? "active" : ""}`}
              onClick={() => setActive(t.id)}
            >
              <Globe2 size={14} color={accent} />
              <span style={{fontSize:12, flex:1}}>{t.title}</span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  closeTab(t.id);
                }}
                style={{...buttonStyle, padding:2}}
                aria-label="Close tab"
              >
                <X size={13}/>
              </button>
            </div>
          ))}

          <button onClick={newTab} style={buttonStyle} aria-label="New tab">
            <Plus size={19}/>
          </button>
        </div>

        <button
          style={buttonStyle}
          onClick={() => setPanel("settings")}
          aria-label="Settings"
        >
          <Settings2 size={19}/>
        </button>
      </header>

      {/* NAVIGATION BAR */}
      <nav style={{
        display:"flex",
        alignItems:"center",
        gap:9,
        padding:"12px 22px",
        borderBottom:`1px solid ${border}`,
        background:surface
      }}>
        <div style={{display:"flex",gap:3}}>
          <button style={buttonStyle} disabled><ArrowLeft size={17}/></button>
          <button style={buttonStyle} disabled><ArrowRight size={17}/></button>
          <button
            style={buttonStyle}
            onClick={() => tab.url && window.open(tab.url, "_blank", "noopener,noreferrer")}
            aria-label="Reload"
          >
            <RotateCw size={16}/>
          </button>
          <button style={buttonStyle} onClick={goHome} aria-label="Home">
            <Home size={17}/>
          </button>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            openWebsite(address);
          }}
          style={{
            flex:1,
            display:"flex",
            alignItems:"center",
            gap:10,
            padding:"11px 15px",
            background:bg,
            border:`1px solid ${border}`,
            borderRadius:12,
            minWidth:0
          }}
        >
          <Search size={17} color={muted}/>
          <input
            className="ginger-input"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Search DuckDuckGo or enter a website"
          />
          <button type="submit" style={{
            ...buttonStyle,
            color:accent,
            padding:3
          }}>
            <ArrowRight size={17}/>
          </button>
        </form>

        <div style={{display:"flex",gap:2}}>
          <button
            style={{...buttonStyle,color:saved ? accent : muted}}
            onClick={toggleBookmark}
            aria-label="Bookmark"
          >
            <Star size={18} fill={saved ? accent : "none"}/>
          </button>
          <button
            style={buttonStyle}
            onClick={() => setPanel("bookmarks")}
            aria-label="Bookmarks"
          >
            <Bookmark size={18}/>
          </button>
          <button
            style={buttonStyle}
            onClick={() => setPanel("history")}
            aria-label="History"
          >
            <Clock3 size={18}/>
          </button>
        </div>
      </nav>

      {/* HOME SCREEN */}
      {!tab.url && (
        <section style={{
          maxWidth:850,
          margin:"auto",
          padding:"65px 24px 30px"
        }}>
          <div style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}>
            <span style={{
              color:muted,
              fontSize:10,
              fontWeight:750,
              letterSpacing:2
            }}>
              YOUR SPACE ON THE OPEN WEB
            </span>

            <button
              onClick={() => setDark(!dark)}
              style={{
                ...buttonStyle,
                border:`1px solid ${border}`,
                fontSize:12,
                gap:7,
                padding:"8px 12px"
              }}
            >
              {dark ? <Sun size={15}/> : <Moon size={15}/>}
              {dark ? "Light mode" : "Dark mode"}
            </button>
          </div>

          <div style={{
            textAlign:"center",
            padding:"75px 0 68px"
          }}>
            <div style={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              gap:12
            }}>
              <span style={{
                fontSize:64,
                fontWeight:900,
                color:accent,
                lineHeight:1
              }}>g</span>
              <h1 style={{
                fontSize:"clamp(42px, 8vw, 65px)",
                letterSpacing:-4,
                margin:0,
                fontWeight:850
              }}>
                GINGER<span style={{color:accent}}>.</span>
              </h1>
            </div>

            <p style={{
              color:muted,
              fontSize:15,
              marginTop:15
            }}>
              A calmer corner of the internet.
            </p>

            <form
              onSubmit={e => {
                e.preventDefault();
                openWebsite(address);
              }}
              style={{
                ...cardStyle,
                maxWidth:590,
                margin:"34px auto 0",
                padding:"8px 15px",
                display:"flex",
                alignItems:"center",
                gap:12,
                boxShadow:dark ? "none" : "0 8px 30px #0000000a"
              }}
            >
              <Search size={19} color={accent}/>
              <input
                className="ginger-input"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Where do you want to go?"
                autoFocus
              />
              <button
                type="submit"
                style={{
                  background:accent,
                  border:0,
                  borderRadius:9,
                  color:"#21170f",
                  padding:"10px 15px",
                  cursor:"pointer",
                  fontWeight:750
                }}
              >
                Go
              </button>
            </form>
          </div>

          {/* SHORTCUTS */}
          <div style={{marginTop:8}}>
            <div style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              marginBottom:17
            }}>
              <span style={{
                fontSize:11,
                color:muted,
                letterSpacing:1.7,
                fontWeight:750
              }}>
                YOUR PLACES
              </span>
              <span style={{fontSize:11,color:muted}}>
                {sites.length} shortcuts
              </span>
            </div>

            <div
              className="ginger-shortcuts"
              style={{
                display:"grid",
                gridTemplateColumns:"repeat(3,minmax(0,1fr))",
                gap:12
              }}
            >
              {sites.map(site => (
                <a
                  key={site.name}
                  className="ginger-shortcut"
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setHistory(current =>
                      [{title:site.name,url:site.url},
                        ...current.filter(x => x.url !== site.url)].slice(0,100)
                    );
                  }}
                >
                  <b style={{
                    background:site.color + "20",
                    color:site.color
                  }}>
                    {site.icon}
                  </b>
                  <span style={{
                    fontSize:13,
                    fontWeight:650,
                    flex:1
                  }}>{site.name}</span>
                  <ExternalLink size={13} color={muted}/>
                </a>
              ))}
            </div>
          </div>

          {/* STATUS */}
          <div style={{
            marginTop:55,
            paddingTop:17,
            borderTop:`1px solid ${border}`,
            display:"flex",
            justifyContent:"space-between",
            color:muted,
            fontSize:10,
            letterSpacing:1
          }}>
            <span>GINGER / BUILT FOR THE OPEN WEB</span>
            <span>● GUEST MODE</span>
          </div>
        </section>
      )}

      {/* WEBSITE INFORMATION */}
      {tab.url && (
        <section style={{
          minHeight:"calc(100vh - 130px)",
          display:"grid",
          placeItems:"center",
          padding:25
        }}>
          <div style={{
            ...cardStyle,
            maxWidth:540,
            width:"100%",
            padding:35,
            textAlign:"center"
          }}>
            <Globe2 size={36} color={accent}/>
            <h2 style={{marginBottom:8}}>{tab.title}</h2>
            <p style={{color:muted,fontSize:13}}>
              This website opens in a separate browser tab.
            </p>
            <p style={{
              color:muted,
              fontSize:12,
              overflowWrap:"anywhere"
            }}>
              {tab.url}
            </p>
            <button
              onClick={() => window.open(tab.url, "_blank", "noopener,noreferrer")}
              style={{
                background:accent,
                color:"#21170f",
                border:0,
                borderRadius:10,
                padding:"12px 20px",
                fontWeight:750,
                cursor:"pointer",
                display:"inline-flex",
                alignItems:"center",
                gap:8,
                marginTop:10
              }}
            >
              Open website <ExternalLink size={15}/>
            </button>
            <p style={{
              fontSize:11,
              color:muted,
              marginTop:20
            }}>
              Embedded browsing will require the GINGER proxy backend.
            </p>
          </div>
        </section>
      )}

      {/* SIDE PANEL */}
      {panel && (
        <div
          onClick={() => setPanel(null)}
          style={{
            position:"fixed",
            inset:0,
            zIndex:10,
            background:"#0008",
            display:"flex",
            justifyContent:"flex-end"
          }}
        >
          <aside
            onClick={e => e.stopPropagation()}
            style={{
              width:"min(390px,92vw)",
              height:"100%",
              background:surface,
              padding:25,
              overflowY:"auto",
              boxShadow:"-10px 0 40px #0002"
            }}
          >
            <div style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              marginBottom:30
            }}>
              <div>
                <small style={{
                  color:accent,
                  letterSpacing:1.5,
                  fontWeight:750
                }}>
                  GINGER / {panel.toUpperCase()}
                </small>
                <h2 style={{margin:"7px 0 0"}}>
                  {panel === "settings" ? "Preferences" :
                    panel === "bookmarks" ? "Saved places" : "Recent history"}
                </h2>
              </div>
              <button style={buttonStyle} onClick={() => setPanel(null)}>
                <X size={20}/>
              </button>
            </div>

            {panel === "settings" && (
              <>
                <button
                  className="ginger-panel-button"
                  onClick={() => setDark(!dark)}
                >
                  <span>
                    <b>Appearance</b>
                    <br/>
                    <small style={{color:muted}}>Change your theme</small>
                  </span>
                  {dark ? <Sun size={18}/> : <Moon size={18}/>}
                </button>

                <div className="ginger-panel-button">
                  <span>
                    <b>Search engine</b>
                    <br/>
                    <small style={{color:muted}}>DuckDuckGo</small>
                  </span>
                  <span style={{color:accent,fontSize:11}}>ACTIVE</span>
                </div>

                <div className="ginger-panel-button">
                  <span>
                    <b>Proxy service</b>
                    <br/>
                    <small style={{color:muted}}>Scramjet / Wisp</small>
                  </span>
                  <span style={{color:"#d99a52",fontSize:11}}>NOT CONNECTED</span>
                </div>

                <button
                  className="ginger-panel-button"
                  onClick={() => setShowAbout(!showAbout)}
                >
                  <span><b>About GINGER</b></span>
                  <span>{showAbout ? "−" : "+"}</span>
                </button>

                {showAbout && (
                  <p style={{color:muted,fontSize:13,lineHeight:1.7}}>
                    GINGER is a browser-style web launcher. Your bookmarks,
                    theme and history are saved in this browser.
                  </p>
                )}
              </>
            )}

            {(panel === "bookmarks" || panel === "history") && (
              <>
                {(panel === "bookmarks" ? bookmarks : history).length === 0 ? (
                  <p style={{color:muted}}>Nothing here yet.</p>
                ) : (
                  (panel === "bookmarks" ? bookmarks : history).map((item,i) => (
                    <div
                      key={item.url + i}
                      style={{
                        display:"flex",
                        alignItems:"center",
                        gap:8,
                        borderBottom:`1px solid ${border}`,
                        padding:"13px 0"
                      }}
                    >
                      <button
                        onClick={() => {
                          openWebsite(item.url);
                          setPanel(null);
                        }}
                        style={{
                          flex:1,
                          minWidth:0,
                          textAlign:"left",
                          border:0,
                          background:"transparent",
                          color:text,
                          cursor:"pointer"
                        }}
                      >
                        <b style={{display:"block",fontSize:13}}>
                          {item.title}
                        </b>
                        <small style={{
                          display:"block",
                          color:muted,
                          overflow:"hidden",
                          textOverflow:"ellipsis",
                          whiteSpace:"nowrap",
                          marginTop:4
                        }}>
                          {item.url}
                        </small>
                      </button>

                      {panel === "bookmarks" && (
                        <button
                          style={buttonStyle}
                          onClick={() => setBookmarks(current =>
                            current.filter((_,index) => index !== i)
                          )}
                        >
                          <Trash2 size={15}/>
                        </button>
                      )}
                    </div>
                  ))
                )}

                {panel === "history" && history.length > 0 && (
                  <button
                    onClick={() => setHistory([])}
                    style={{
                      marginTop:20,
                      border:0,
                      background:dark ? "#3a2420" : "#fff0ec",
                      color:"#d66c50",
                      borderRadius:9,
                      padding:"10px 15px",
                      cursor:"pointer"
                    }}
                  >
                    Clear history
                  </button>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
