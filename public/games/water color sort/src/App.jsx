import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Award, BarChart3, Check, ChevronRight, Droplets, Home, Lightbulb, Play, RotateCcw, Sparkles, Trophy, Undo2, UserRound, Volume2, VolumeX } from "lucide-react";

const COLORS=["#ff6b6b","#4d96ff","#ffc857","#45c486","#9b72cf","#ff9f43","#38c9d9","#f36ba8"];
const LEVELS=[
 [[0,1,0,1],[1,0,1,0],[],[]],
 [[1,2,1,2],[2,1,2,1],[],[]],
 [[0,3,1,0],[1,0,3,1],[3,1,0,3],[],[]],
 [[2,1,3,2],[3,2,0,1],[1,0,2,3],[0,3,1,0],[],[]],
 [[0,4,1,2],[3,0,2,4],[1,3,4,0],[2,1,3,2],[4,2,0,3],[],[]],
 [[5,1,3,4],[2,5,7,1],[4,3,2,6],[6,7,1,5],[3,2,6,4],[7,6,5,3],[],[]],
 [[0,1,2,4],[3,5,6,7],[2,0,4,1],[7,3,5,6],[1,2,6,3],[5,7,0,4],[6,4,3,5],[],[]],
 [[1,5,7,3],[6,4,2,0],[3,1,0,5],[4,2,6,7],[5,3,7,1],[0,6,1,2],[2,7,5,4],[3,0,4,6],[],[]],
 [[0,3,1,2],[4,5,6,7],[1,0,2,3],[7,6,5,4],[2,1,7,0],[3,4,0,5],[6,2,3,1],[5,7,4,6],[1,3,5,2],[],[]],
 [[0,1,2,3],[4,5,6,7],[6,0,4,1],[3,2,7,5],[1,3,5,6],[2,7,0,4],[5,6,3,2],[7,4,1,0],[3,2,6,5],[4,7,5,1],[],[]]
];
const clone=x=>x.map(t=>[...t]);
const amount=(a,b)=>{
 if(!a.length||b.length===4)return 0;
 const c=a[a.length-1];
 if(b.length&&b[b.length-1]!==c)return 0;
 let n=0;for(let i=a.length-1;i>=0&&a[i]===c;i--)n++;
 return Math.min(n,4-b.length);
};
const doPour=(t,from,to)=>{
 playPourSound();
 const n=clone(t),m=amount(n[from],n[to]);if(!m)return [t,0];
 n[to].push(...n[from].splice(n[from].length-m,m));return [n,m];
};
const solved=t=>t.every(x=>!x.length||(x.length===4&&x.every(c=>c===x[0])));

function Screen({children,id}){return <div key={id} className="page">{children}</div>}

function SiteHeader(){
 return <header className="site-header">
  <button className="brand" type="button" aria-label="Nebuloid Tech"><img src="/logo.png" alt="Nebuloid Tech" onError={e=>e.currentTarget.style.visibility="hidden"}/><span>NEBULOID TECH</span></button>
 </header>
}
function DecoBottle({className="",colors=[1,0],tilt=0}){return <div className={`deco-bottle ${className}`} style={{"--tilt":`${tilt}deg`}}><div className="deco-neck"/><div className="deco-mouth"/><div className="deco-body">{colors.map((c,i)=><span key={i} style={{bottom:`${i*50}%`,background:`linear-gradient(100deg,${COLORS[c]},${COLORS[c]}dd 62%,${COLORS[c]}aa)`}}/>)}<i/></div></div>}
function DecorativeScene({name=false}){return <div className={`decorative-scene ${name?"name-scene":""}`} aria-hidden="true"><DecoBottle className="deco-left-top" colors={[1,0]} tilt={18}/><DecoBottle className="deco-left-bottom" colors={[1,0,1]} tilt={14}/><DecoBottle className="deco-right-top" colors={[1,0]} tilt={-18}/><DecoBottle className="deco-right-bottom" colors={[2,1,0]} tilt={-16}/><span className="scene-dot dot-blue-a"/><span className="scene-dot dot-blue-b"/><span className="scene-dot dot-pink"/><span className="scene-dot dot-yellow"/></div>}
function Start({go}){
 const [soundOn,setSoundOn]=useState(window.__waterSortSoundEnabled!==false);
 const [showHelp,setShowHelp]=useState(false);

 const toggleSound=()=>{
  const next=!soundOn;
  setSoundOn(next);
  window.__waterSortSoundEnabled=next;
 };

 return <Screen id="start"><main className="realistic-start">
  <div className="lake-sky" aria-hidden="true">
   <div className="sun-glow"/><div className="sun-disc"/>
   <div className="cloud cloud-one"/><div className="cloud cloud-two"/>
   <div className="mountain mountain-back left"/><div className="mountain mountain-back right"/>
   <div className="mountain mountain-front left"/><div className="mountain mountain-front right"/>
   <div className="forest forest-left"/><div className="forest forest-right"/>
   <div className="lake-shimmer"/><div className="lake-horizon"/>
   <div className="foreground-leaves leaves-left"/><div className="foreground-leaves leaves-right"/>
   <div className="dock"><div className="dock-rail rail-left"/><div className="dock-rail rail-right"/><div className="dock-planks"/></div>
  </div>

  <button className="scene-corner scene-sound" type="button" onClick={toggleSound} aria-label={soundOn?"Mute sound":"Turn sound on"}>
   {soundOn?<Volume2 size={31}/>:<VolumeX size={31}/>}
   <span>{soundOn?"SOUND ON":"MUTED"}</span>
  </button>
  <button className="scene-home scene-how-to-play" type="button" onClick={()=>setShowHelp(true)}>
   <Lightbulb size={22}/><span>HOW TO PLAY</span>
  </button>

  <section className="realistic-start-content">
   <div className="studio-brand"><img src="/logo.png" alt="Nebuloid Tech Studio"/><strong>NEBULOID TECH STUDIO LLP</strong><span>IDEAS. WIRED TO REALITY.</span></div>
   <div className="welcome-line"><i/> WELCOME TO <i/></div>
   <h1 className="water-logo" aria-label="Water Color Sort"><b>WATER</b><strong><em>C</em><em>O</em><em>L</em><em>O</em><em>R</em></strong><span>SORT</span></h1>
   <button onClick={go} className="water-play" aria-label="Start game"><span className="play-ring ring-one"/><span className="play-ring ring-two"/><span className="play-core"><Play size={54} fill="currentColor"/></span></button>
      <div className="water-side-copy water-side-copy-left" aria-hidden="true">
        <span>POUR</span>
        <b>MATCH</b>
        <span>SORT</span>
        <small>POUR THE RIGHT COLORS<br/>MATCH EVERY TUBE<br/>CLEAR THE PUZZLE</small>
      </div>
      <div className="water-side-copy water-side-copy-right" aria-hidden="true">
        <span>THINK</span>
        <b>SOLVE</b>
        <span>WIN</span>
        <small>PLAN EVERY MOVE<br/>GROUP THE COLORS<br/>BEAT ALL 10 LEVELS</small>
      </div>
         <div className="water-start-label">START</div>
  </section>

  {showHelp&&<div className="howto-overlay" role="dialog" aria-modal="true" aria-label="How to play">
    <div className="howto-panel">
      <button className="howto-close" type="button" onClick={()=>setShowHelp(false)} aria-label="Close">×</button>
      <div className="howto-icon"><Droplets size={30}/></div>
      <h2>HOW TO PLAY</h2>
      <p className="howto-intro">Sort every color into its own bottle.</p>
      <div className="howto-steps">
        <div><b>1</b><span><strong>SELECT</strong> a bottle with colored water.</span></div>
        <div><b>2</b><span><strong>POUR</strong> into an empty bottle or one with the same top color.</span></div>
        <div><b>3</b><span><strong>MATCH</strong> the same colors together.</span></div>
        <div><b>4</b><span><strong>SOLVE</strong> the puzzle using as few moves as possible.</span></div>
      </div>
      <div className="howto-rule">Each bottle can hold up to 4 color units.</div>
      <button className="howto-start" type="button" onClick={()=>setShowHelp(false)}>GOT IT — LET'S PLAY</button>
    </div>
  </div>}
 </main></Screen>
}
function FloatingKeyboard({value,onChange,onEnter,onClose}){
 const [pos,setPos]=useState({x:null,y:null});
 const drag=useRef(null);
 const keys=["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"];
 const press=e=>{
  e.preventDefault();
  const key=e.currentTarget.dataset.key;
  if(key==="BACKSPACE") onChange(value.slice(0,-1));
  else if(key==="SPACE") onChange((value+" ").slice(0,24));
  else if(key==="ENTER") onEnter();
  else onChange((value+key).slice(0,24));
 };
 const startDrag=e=>{
  if(e.button!==undefined&&e.button!==0)return;
  const r=e.currentTarget.parentElement.getBoundingClientRect();
  drag.current={ox:e.clientX-r.left,oy:e.clientY-r.top};
  e.currentTarget.setPointerCapture?.(e.pointerId);
 };
 const moveDrag=e=>{
  if(!drag.current)return;
  const w=window.innerWidth,h=window.innerHeight;
  const el=e.currentTarget.parentElement;
  const r=el.getBoundingClientRect();
  setPos({x:Math.max(8,Math.min(w-r.width-8,e.clientX-drag.current.ox)),y:Math.max(8,Math.min(h-r.height-8,e.clientY-drag.current.oy))});
 };
 const endDrag=()=>{drag.current=null};
 const style=pos.x===null?{}:{left:pos.x,top:pos.y,right:"auto",bottom:"auto"};
 return <div className="floating-keyboard" style={style}>
  <div className="keyboard-head" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag}>
   <span><span className="keyboard-grip"/> Floating Keyboard</span>
   <button type="button" onPointerDown={e=>e.stopPropagation()} onClick={onClose} aria-label="Close keyboard">×</button>
  </div>
  <div className="keyboard-keys">
   {keys.map(k=><button type="button" key={k} data-key={k} onPointerDown={press}>{k}</button>)}
   <button type="button" className="key-wide" data-key="SPACE" onPointerDown={press}>SPACE</button>
   <button type="button" className="key-action" data-key="BACKSPACE" onPointerDown={press}>⌫</button>
   <button type="button" className="key-enter" data-key="ENTER" onPointerDown={press}>ENTER ↵</button>
  </div>
 </div>
}

function Name({onGo}){
 const [name,setName]=useState("");
 const [keyboardOpen,setKeyboardOpen]=useState(false);
 const [soundOn,setSoundOn]=useState(window.__waterSortSoundEnabled!==false);
 const [showHelp,setShowHelp]=useState(false);

 const submit=()=>{if(name.trim())onGo(name.trim())};
 const toggleSound=()=>{
  const next=!soundOn;
  setSoundOn(next);
  window.__waterSortSoundEnabled=next;
 };

 return <Screen id="name"><main className="landing-page name-page">
  <SiteHeader/>
  <div className="corner-blob blob-tl"/><div className="corner-blob blob-tr"/><div className="corner-blob blob-bl"/><div className="corner-blob blob-br"/>
  <DecorativeScene name/>
  <div className="name-haze haze-left"/><div className="name-haze haze-right"/>

  <button className="name-corner-control name-sound-control" type="button" onClick={toggleSound} aria-label={soundOn?"Mute sound":"Turn sound on"}>
   {soundOn?<Volume2 size={30}/>:<VolumeX size={30}/>}
   <span>{soundOn?"SOUND ON":"MUTED"}</span>
  </button>
  <button className="name-corner-control name-how-control" type="button" onClick={()=>setShowHelp(true)}>
   <Lightbulb size={22}/><span>HOW TO PLAY</span>
  </button>

  <div className="name-side-copy name-side-copy-left" aria-hidden="true">
   <span>POUR</span><b>MATCH</b><span>SORT</span>
   <small>POUR THE RIGHT COLORS<br/>MATCH EVERY TUBE<br/>CLEAR THE PUZZLE</small>
  </div>
  <div className="name-side-copy name-side-copy-right" aria-hidden="true">
   <span>THINK</span><b>SOLVE</b><span>WIN</span>
   <small>PLAN EVERY MOVE<br/>GROUP THE COLORS<br/>BEAT ALL 10 LEVELS</small>
  </div>

  <section className="name-content">
   <div className="challenge-label"><span/> PUZZLE CHALLENGE <span/></div>
   <h1 className="logo-title name-logo"><b>WATER</b><strong><em>C</em><em>O</em><em>L</em><em>O</em><em>R</em></strong><b>SORT</b></h1>
   <p className="name-subtitle">Sort the colors. Clear the tubes. Challenge your mind.</p>
   <div className="player-icon"><UserRound size={31}/></div>
   <p className="registration-label">PLAYER REGISTRATION</p>
   <h2>Enter your name</h2>
   <p className="registration-copy">This name will be printed on every certificate.</p>
   <form onSubmit={e=>{e.preventDefault();submit()}}>
    <div className="name-input-wrap" onClick={()=>setKeyboardOpen(true)}><UserRound size={25}/><input value={name} onFocus={()=>setKeyboardOpen(true)} onChange={e=>setName(e.target.value.slice(0,24))} placeholder="Your name"/></div>
    <button type="submit" disabled={!name.trim()} className="primary-cta name-cta">START <ArrowRight size={29}/></button>
   </form>
   {keyboardOpen&&<FloatingKeyboard value={name} onChange={setName} onEnter={submit} onClose={()=>setKeyboardOpen(false)}/>}
   <div className="bottom-motto"><span/> PLAY&nbsp;&nbsp;•&nbsp;&nbsp;THINK&nbsp;&nbsp;•&nbsp;&nbsp;ACHIEVE <span/></div>
  </section>

  {showHelp&&<div className="name-howto-overlay" role="dialog" aria-modal="true" aria-label="How to play">
    <div className="name-howto-panel">
      <button className="name-howto-close" type="button" onClick={()=>setShowHelp(false)} aria-label="Close">×</button>
      <div className="name-howto-icon"><Droplets size={30}/></div>
      <h2>HOW TO PLAY</h2>
      <p className="name-howto-intro">Sort every color into its own bottle.</p>
      <div className="name-howto-steps">
       <div><b>1</b><span><strong>SELECT</strong> a bottle with colored water.</span></div>
       <div><b>2</b><span><strong>POUR</strong> into an empty bottle or one with the same top color.</span></div>
       <div><b>3</b><span><strong>MATCH</strong> the same colors together.</span></div>
       <div><b>4</b><span><strong>SOLVE</strong> the puzzle using as few moves as possible.</span></div>
      </div>
      <div className="name-howto-rule">Each bottle can hold up to 4 color units.</div>
      <button className="name-howto-start" type="button" onClick={()=>setShowHelp(false)}>GOT IT — LET'S PLAY</button>
    </div>
  </div>}
 </main></Screen>}


function Bottle({tube,i,selected,pouringFrom,receiving,invalid,incomingColor,incomingAmount,pourAngle,onClick,refFn}){
 const complete=tube.length===4&&tube.every(c=>c===tube[0]);
 return <button ref={refFn} onClick={onClick} className={`bottle ${pouringFrom ? "pouring" : ""} ${invalid ? "invalid" : ""}`} style={{"--pour-direction":pourAngle||"-27deg","--pour-shift":pourAngle==="27deg"?"34px":"-34px"}}>
  <div className="bottle-neck"/><div className="bottle-mouth"/>
  <div className="bottle-body">
   {tube.map((c,j)=><div key={j} className="liquid" style={{bottom:`${j*25}%`,background:`linear-gradient(100deg,${COLORS[c]},${COLORS[c]}dd 62%,${COLORS[c]}aa)`}}/>)}
   {incomingColor!==undefined&&incomingAmount>0&&<div className="incoming-liquid" style={{height:`${incomingAmount*25}%`,background:`linear-gradient(100deg,${incomingColor},${incomingColor}dd 62%,${incomingColor}aa)`}}><span className="incoming-wave"/></div>}
   {!tube.length&&!incomingAmount&&<span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold tracking-[.16em] text-slate-300">EMPTY</span>}
   {complete&&<span className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/20 px-2 py-1 text-[8px] font-extrabold uppercase tracking-wider text-white">Sorted</span>}
  </div>
  <span className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-extrabold ${selected?"text-sky-500":"text-slate-400"}`}>{i+1}</span>
 </button>
}

function Game({level,tubes,setTubes,moves,setMoves,onComplete,home}){
 const [selected,setSelected]=useState(null),[history,setHistory]=useState([]),[pouring,setPouring]=useState(null),[invalid,setInvalid]=useState(null);
 const refs=useRef([]), board=useRef(null), [stream,setStream]=useState(null);

 useEffect(()=>{
  if(!pouring||!board.current)return;

  let rafId=0;
  const update=()=>{
   const source=refs.current[pouring.from];
   const target=refs.current[pouring.to];
   const boardRect=board.current?.getBoundingClientRect();
   if(!source||!target||!boardRect){
    rafId=requestAnimationFrame(update);
    return;
   }

   const sourceMouth=source.querySelector('.bottle-mouth');
   const targetMouth=target.querySelector('.bottle-mouth');
   if(!sourceMouth||!targetMouth){
    rafId=requestAnimationFrame(update);
    return;
   }

   const a=sourceMouth.getBoundingClientRect();
   const b=targetMouth.getBoundingClientRect();

   // Track the real mouth positions every frame. This prevents the stream
   // from looking detached while the source bottle lifts and rotates.
   const x1=a.left+a.width*.52-boardRect.left;
   const y1=a.bottom-boardRect.top+1;
   const x2=b.left+b.width*.50-boardRect.left;
   const y2=b.top-boardRect.top+8;

   const dx=x2-x1;
   const dy=y2-y1;
   const distance=Math.hypot(dx,dy);
   const lift=Math.max(75,Math.min(150,distance*.32));
   const side=dx>=0?1:-1;

   // A smooth S-curve gives the water a natural hanging/falling shape.
   const c1x=x1+dx*.16;
   const c1y=y1-lift;
   const c2x=x2-dx*.22;
   const c2y=y2-lift*.72;

   const d=`M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
   setStream({d,x1,y1,x2,y2,color:pouring.color,side,dy});

   rafId=requestAnimationFrame(update);
  };

  rafId=requestAnimationFrame(update);

  return()=>{
   cancelAnimationFrame(rafId);
  };
 },[pouring]);

 const click=i=>{
  if(pouring)return;
  if(selected===null){if(tubes[i].length){setInvalid(null);setSelected(i)}return}
  if(selected===i){setSelected(null);return}
  const from=selected,[next,m]=doPour(tubes,from,i);
  if(!m){
   setInvalid(i);setTimeout(()=>setInvalid(null),380);
   return;
  }
  const sourceColor=COLORS[tubes[from][tubes[from].length-1]];
  setSelected(null);
  setPouring({from,to:i,color:sourceColor,amount:m});
  setTimeout(()=>{
   setHistory(h=>[...h,clone(tubes)]);
   setTubes(next);setMoves(x=>x+1);
   setTimeout(()=>setPouring(null),170);
   if(solved(next))setTimeout(()=>onComplete(moves+1),470)
  },680);
 };
 const restart=()=>{setTubes(clone(LEVELS[level-1]));setMoves(0);setHistory([]);setSelected(null);setPouring(null);setInvalid(null)};
return <Screen id={"game"+level}>
  <main className="game-page">
   <SiteHeader/>

   <div className="game-page-art"><DecorativeScene/></div>

   {/* Direct background controls */}
   <div className="game-corner-controls">
    <button className="game-sound-control" type="button"
      onClick={()=>{
       const next=window.__waterSortSoundEnabled===false;
       window.__waterSortSoundEnabled=next;
       window.dispatchEvent(new Event("water-sort-sound"));
      }}
      aria-label="Toggle sound">
      <span className="game-sound-icon">{window.__waterSortSoundEnabled===false?"🔇":"🔊"}</span>
      <span>{window.__waterSortSoundEnabled===false?"MUTED":"SOUND ON"}</span>
    </button>

    <button className="game-how-control" type="button"
      onClick={()=>window.dispatchEvent(new Event("water-sort-howto"))}>
      <Lightbulb size={21}/><span>HOW TO PLAY</span>
    </button>
   </div>

   <div className="game-side-copy game-side-copy-left" aria-hidden="true">
    <span>POUR</span>
    <b>MATCH</b>
    <span>SORT</span>
    <small>POUR THE RIGHT COLORS<br/>MATCH EVERY TUBE<br/>CLEAR THE PUZZLE</small>
   </div>

   <div className="game-side-copy game-side-copy-right" aria-hidden="true">
    <span>THINK</span>
    <b>SOLVE</b>
    <span>WIN</span>
    <small>PLAN EVERY MOVE<br/>GROUP THE COLORS<br/>BEAT ALL 10 LEVELS</small>
   </div>

   <div className="game-wrap">
    <div className="game-heading">
     <div className="game-title-block">
      <div className="game-kicker"><span/> PUZZLE CHALLENGE <span/></div>
      <h1 className="game-logo-title"><b>WATER</b><strong><em>C</em><em>O</em><em>L</em><em>O</em><em>R</em></strong><span>SORT</span></h1>
      <p className="game-instruction">{pouring?"Pouring water...":selected===null?"Select a bottle to pour.":"Choose an empty bottle or matching color."}</p>
     </div>

     <div className="game-controls">
      <button disabled={!!pouring} onClick={home} className="control-btn home-btn"><ArrowLeft size={17}/>Home</button>
      <div className="stat-pill"><span>LEVEL</span><b>{level} / 10</b></div>
      <div className="stat-pill"><span>MOVES</span><b>{moves}</b></div>
      <button disabled={!history.length||!!pouring} onClick={()=>{const p=history.at(-1);setTubes(clone(p));setHistory(h=>h.slice(0,-1));setMoves(x=>Math.max(0,x-1));setSelected(null)}} className="control-btn"><Undo2 size={17}/>Undo</button>
      <button disabled={!!pouring} onClick={restart} className="control-btn dark"><RotateCcw size={17}/>Restart</button>
     </div>
    </div>

    <section ref={board} className="game-board">
     <div className="board-aura aura-one"/><div className="board-aura aura-two"/>

     <div className="board-topline">
      <span>Sort every bottle</span>
      <small><Lightbulb size={14}/> Match top color</small>
     </div>

     {pouring&&stream&&<svg className="pour-svg pour-svg-real" viewBox={`0 0 ${board.current?.clientWidth||1000} ${board.current?.clientHeight||600}`} preserveAspectRatio="none" aria-hidden="true">
       <path className="pour-shadow" d={stream.d}/>
       <path className="pour-path" d={stream.d} style={{stroke:stream.color}}/>
       <path className="pour-highlight" d={stream.d}/>
       <circle className="pour-drop" cx={stream.x2} cy={stream.y2} r="5" style={{fill:stream.color}}/>
       <circle className="pour-splash" cx={stream.x2} cy={stream.y2} r="2.5" style={{stroke:stream.color}}/>
     </svg>}

     <div className="game-bottles">
      {tubes.map((t,i)=><div key={i} className="game-bottle-slot bottle-enter" style={{animationDelay:`${i*35}ms`}}>
       <Bottle refFn={e=>refs.current[i]=e} tube={t} i={i} selected={selected===i} pouringFrom={pouring?.from===i} receiving={pouring?.to===i} invalid={invalid===i} pourAngle={pouring?.from===i?(pouring.to>i?"27deg":"-27deg"):"-27deg"} incomingColor={pouring?.to===i?pouring.color:undefined} incomingAmount={pouring?.to===i?pouring.amount:0} onClick={()=>click(i)}/>
      </div>)}
     </div>

     <div className="board-help"><Droplets size={15}/><span>Pour only onto an empty bottle or a bottle with the same top color.</span></div>
    </section>
   </div>

   {/* How-to modal: opened by the top-right control, no navigation/game-state changes. */}
   <GameHowToPlay/>
  </main>
 </Screen>
}

function GameHowToPlay(){
 const [open,setOpen]=useState(false);

 useEffect(()=>{
  const openHelp=()=>setOpen(true);
  window.addEventListener("water-sort-howto",openHelp);
  return()=>window.removeEventListener("water-sort-howto",openHelp);
 },[]);

 if(!open)return null;

 return <div className="game-howto-overlay" role="dialog" aria-modal="true" aria-label="How to play">
  <div className="game-howto-panel">
   <button className="game-howto-close" type="button" onClick={()=>setOpen(false)} aria-label="Close">×</button>
   <div className="game-howto-icon"><Droplets size={30}/></div>
   <h2>HOW TO PLAY</h2>
   <p>Sort every color into its own bottle.</p>
   <div className="game-howto-steps">
    <div><b>1</b><span><strong>SELECT</strong> a bottle containing color.</span></div>
    <div><b>2</b><span><strong>POUR</strong> into an empty bottle or onto the same top color.</span></div>
    <div><b>3</b><span><strong>MATCH</strong> identical colors together.</span></div>
    <div><b>4</b><span><strong>SOLVE</strong> the level and move to the next challenge.</span></div>
   </div>
   <div className="game-howto-rule">A bottle can hold up to 4 color units.</div>
   <button className="game-howto-start" type="button" onClick={()=>setOpen(false)}>GOT IT — LET'S PLAY</button>
  </div>
 </div>
}

function playPourSound(){
 try{
  if(window.__waterSortSoundEnabled===false)return;
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx) return;
  const ctx=window.__waterSortAudioCtx||(window.__waterSortAudioCtx=new AudioCtx());
  if(ctx.state==="suspended") ctx.resume();
  const now=ctx.currentTime;
  const gain=ctx.createGain();
  const osc=ctx.createOscillator();
  const filter=ctx.createBiquadFilter();

  filter.type="lowpass";
  filter.frequency.setValueAtTime(1250,now);
  filter.frequency.exponentialRampToValueAtTime(520,now+0.48);

  osc.type="sine";
  osc.frequency.setValueAtTime(520,now);
  osc.frequency.exponentialRampToValueAtTime(190,now+0.5);

  gain.gain.setValueAtTime(0.0001,now);
  gain.gain.exponentialRampToValueAtTime(0.16,now+0.035);
  gain.gain.exponentialRampToValueAtTime(0.055,now+0.20);
  gain.gain.exponentialRampToValueAtTime(0.0001,now+0.56);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now+0.58);

  // Small water/bubble layer.
  const buffer=ctx.createBuffer(1,ctx.sampleRate*0.42,ctx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++){
   const t=i/data.length;
   data[i]=(Math.random()*2-1)*Math.pow(1-t,2.2);
  }
  const noise=ctx.createBufferSource();
  const ng=ctx.createGain();
  const nf=ctx.createBiquadFilter();
  nf.type="bandpass";
  nf.frequency.setValueAtTime(850,now);
  nf.Q.value=0.8;
  ng.gain.setValueAtTime(0.0001,now);
  ng.gain.exponentialRampToValueAtTime(0.035,now+0.04);
  ng.gain.exponentialRampToValueAtTime(0.0001,now+0.40);
  noise.buffer=buffer;
  noise.connect(nf);
  nf.connect(ng);
  ng.connect(ctx.destination);
  noise.start(now);
 }catch(e){}
}

function Certificate({name,level,moves,final,next,replay}){
 const pieces=Array.from({length:24},(_,i)=>({
  left:(i*29+7)%100,
  top:8+(i*17)%28,
  delay:(i%8)*.07,
  rot:(i*37)%360,
  color:COLORS[i%COLORS.length]
 }));

 return <Screen id={"cert"+level}>
  <main className="relative flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#eef9ff_48%,#d7efff_100%)] px-4 py-5 sm:px-8">

   {/* soft blue corner shapes */}
   <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-80 rounded-[45%] bg-[#9ed5ff]/45 blur-[1px] sm:h-80 sm:w-96"/>
   <div className="pointer-events-none absolute -right-28 -top-24 h-64 w-80 rounded-[45%] bg-[#b9e1ff]/50 blur-[1px] sm:h-80 sm:w-96"/>
   <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-[430px] rotate-[13deg] rounded-[50%] bg-[#a8d9ff]/55"/>
   <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-[430px] rotate-[-13deg] rounded-[50%] bg-[#a8d9ff]/55"/>

   {/* floating confetti */}
   {pieces.map((p,i)=><span key={i}
    className="pointer-events-none absolute h-3 w-6 rounded-[4px] shadow-sm animate-[confettiFloat_3.8s_ease-in-out_infinite]"
    style={{left:`${p.left}%`,top:`${p.top}%`,background:p.color,animationDelay:`${p.delay}s`,transform:`rotate(${p.rot}deg)`}}
   />)}

   {/* decorative bottles */}
   <DecoBottle className="deco-left-top !left-[2%] !top-[28%] !scale-[.9] sm:!scale-100" colors={[1,0,2]} tilt={18}/>
   <DecoBottle className="deco-right-top !right-[2%] !left-auto !top-[30%] !scale-[.9] sm:!scale-100" colors={[4,3,5]} tilt={-18}/>

   {/* top brand */}
   <div className="absolute left-7 top-6 z-20 flex items-center sm:left-[10%] sm:top-7">
    <img src="/logo.png" alt="Nebuloid Tech" className="h-16 w-auto object-contain sm:h-20"/>
   </div>

   <nav className="absolute right-7 top-8 z-20 hidden items-center gap-8 text-[15px] font-semibold text-[#122956] sm:flex sm:right-[9%]">
    <button type="button">How to Play</button>
    <button type="button">About</button>
    <button type="button">More Games</button>
   </nav>

   <section className="relative z-10 flex h-full w-full max-w-[1000px] flex-col items-center justify-center text-center">

    {/* medal */}
    <div className="relative mb-4 mt-10 sm:mb-3">
     <div className="absolute -bottom-5 left-[18px] h-11 w-7 rotate-[15deg] bg-[#f0443e] shadow-sm"/>
     <div className="absolute -bottom-5 right-[18px] h-11 w-7 rotate-[-15deg] bg-[#e73531] shadow-sm"/>
     <div className="relative grid h-28 w-28 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff2a3,#ffc928_55%,#ed9411)] shadow-[0_12px_30px_rgba(232,157,28,.28)] sm:h-32 sm:w-32">
      <div className="grid h-20 w-20 place-items-center rounded-full border-[5px] border-[#f2a91c] bg-[#ffc83d] sm:h-24 sm:w-24">
       <Award className="h-12 w-12 text-white drop-shadow-[0_2px_2px_rgba(120,75,0,.2)] sm:h-14 sm:w-14"/>
      </div>
     </div>
    </div>

    <div className="flex items-center gap-5 text-[11px] font-black uppercase tracking-[.32em] text-[#2088e8] sm:text-[13px]">
     <span className="h-[2px] w-12 bg-[#7c9abd] sm:w-14"/>
     <span>Certificate of Achievement</span>
     <span className="h-[2px] w-12 bg-[#7c9abd] sm:w-14"/>
    </div>

    <h1 className="mt-5 text-[48px] font-black leading-[.94] tracking-[-.045em] text-[#142b55] sm:text-[76px]">
     Level <span className="text-[#167ee8]">{level}</span>
    </h1>
    <h2 className="mt-1 text-[45px] font-black leading-none tracking-[-.045em] text-[#157ee7] sm:text-[70px]">
     Complete!
    </h2>

    <p className="mt-5 text-[16px] font-medium text-[#647da1] sm:text-[20px]">
     This achievement is proudly awarded to
    </p>

    <div className="mt-1 min-w-[280px] border-b-2 border-[#d8e5f2] px-5 pb-2 text-[29px] font-black text-[#152e59] sm:min-w-[430px] sm:text-[39px]">
     {name || "Player"}
    </div>

    <p className="mt-4 max-w-[520px] text-[12px] font-medium leading-5 text-[#667e9f] sm:text-[15px] sm:leading-6">
     for successfully sorting every water color through<br className="hidden sm:block"/>
     logic, focus and precision.
    </p>

    <div className="mt-5 grid w-full max-w-[545px] grid-cols-2 gap-3 sm:mt-6 sm:gap-5">
     <div className="rounded-[20px] bg-[#e1f2ff]/90 px-6 py-3.5 shadow-[0_8px_20px_rgba(80,150,220,.08)] sm:py-4">
      <div className="flex items-center justify-center gap-3">
       <BarChart3 className="h-8 w-8 text-[#1c9be9] sm:h-9 sm:w-9"/>
       <div className="text-left">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#6c83a4]">Level</div>
        <div className="text-[21px] font-black text-[#17325d]">{level} / 10</div>
       </div>
      </div>
     </div>
     <div className="rounded-[20px] bg-[#ece9ff]/95 px-6 py-3.5 shadow-[0_8px_20px_rgba(120,100,220,.08)] sm:py-4">
      <div className="flex items-center justify-center gap-3">
       <Sparkles className="h-8 w-8 text-[#7958e9] sm:h-9 sm:w-9"/>
       <div className="text-left">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#7d88a8]">Moves</div>
        <div className="text-[21px] font-black text-[#17325d]">{moves}</div>
       </div>
      </div>
     </div>
    </div>

    <button onClick={final?replay:next}
     className="group mt-5 flex min-w-[290px] items-center justify-center gap-5 rounded-full bg-gradient-to-r from-[#2698f3] to-[#087be6] px-9 py-3.5 text-[20px] font-black text-white shadow-[0_10px_22px_rgba(28,132,235,.25)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(28,132,235,.32)] sm:mt-6 sm:min-w-[355px] sm:py-4 sm:text-[24px]">
     {final ? "Play Again" : "Next Level"}
     <ArrowRight className="h-6 w-6 transition group-hover:translate-x-1 sm:h-7 sm:w-7"/>
    </button>

    <div className="mt-5 flex items-center gap-5 text-[10px] font-bold uppercase tracking-[.28em] text-[#7188a8] sm:mt-6 sm:text-[12px]">
     <span className="h-[2px] w-12 bg-[#91b0d1]"/>
     <span>Play • Think • Achieve</span>
     <span className="h-[2px] w-12 bg-[#91b0d1]"/>
    </div>
   </section>
  </main>
 </Screen>
}

export default function App(){
 const [screen,setScreen]=useState("start"),[name,setName]=useState(""),[level,setLevel]=useState(1),[tubes,setTubes]=useState(clone(LEVELS[0])),[moves,setMoves]=useState(0),[certMoves,setCertMoves]=useState(0);
 const start=name=>{setName(name);setLevel(1);setTubes(clone(LEVELS[0]));setMoves(0);setScreen("game")};
 if(screen==="start")return <Start go={()=>setScreen("name")}/>;
 if(screen==="name")return <Name onGo={start}/>;
 if(screen==="game")return <Game level={level} tubes={tubes} setTubes={setTubes} moves={moves} setMoves={setMoves} onComplete={m=>{setCertMoves(m);setScreen("certificate")}} home={()=>setScreen("start")}/>;
 return <Certificate name={name} level={level} moves={certMoves} final={level===10} next={()=>{const n=level+1;setLevel(n);setTubes(clone(LEVELS[n-1]));setMoves(0);setScreen("game")}} replay={()=>{setName("");setLevel(1);setTubes(clone(LEVELS[0]));setMoves(0);setScreen("start")}}/>;
}
