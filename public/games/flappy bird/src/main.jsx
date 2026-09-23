
import React,{useEffect,useRef,useState} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";

const LEVELS=Array.from({length:10},(_,i)=>({
 n:i+1, gap:220-i*5, speed:2.55+i*.17, gravity:.34+i*.017, target:5+i*2, spacing:270+i*22
}));

function Brand({compact=false}){
 return <div className="flex items-center gap-3">
  <div className={`${compact?"w-10 h-10":"w-12 h-12"} rounded-2xl bg-white/10 border border-white/15 overflow-hidden grid place-items-center`}>
   <img src="./logo2.png" onError={e=>{e.currentTarget.style.display="none"}} className="w-full h-full object-contain p-1" alt="Logo"/>
   <span className="absolute text-xl" style={{display:"none"}}>✦</span>
  </div>
  <div><div className="text-[9px] tracking-[.38em] font-bold text-cyan-200/80">EVENT EXPERIENCE</div><div className="font-black text-lg leading-none">FLAPPY<span className="text-cyan-300">VERSE</span></div></div>
 </div>
}
function Atmosphere(){return <div className="absolute inset-0 overflow-hidden pointer-events-none">
 <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-400/10 blur-3xl"/>
 <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl"/>
 <div className="drift absolute top-[18%] h-8 w-36 rounded-full bg-white/5 blur-sm"/>
 <div className="drift absolute top-[62%] h-6 w-24 rounded-full bg-white/5 blur-sm" style={{animationDuration:"37s",animationDelay:"-12s"}}/>
</div>}

function GearButton(){
 return <button aria-label="Settings" className="fv-gear" type="button">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
   <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z"/>
   <path d="M19.2 13.3a7.8 7.8 0 0 0 0-2.6l1.5-1.2-1.8-3.1-1.8.7a7.9 7.9 0 0 0-2.2-1.3L14.7 4h-3.5l-.3 1.8c-.8.3-1.5.7-2.2 1.3L6.9 6.4 5.1 9.5l1.5 1.2a7.8 7.8 0 0 0 0 2.6l-1.5 1.2 1.8 3.1 1.8-.7c.7.6 1.4 1 2.2 1.3l.3 1.8h3.5l.3-1.8a7.9 7.9 0 0 0 2.2-1.3l1.8.7 1.8-3.1-1.6-1.2Z"/>
  </svg>
 </button>
}

function BirdIllustration(){
 return <svg className="fv-bird" viewBox="0 0 320 180" aria-hidden="true">
  <defs>
   <linearGradient id="birdBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#dbe7ff"/></linearGradient>
   <linearGradient id="birdBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#65b8ff"/><stop offset="1" stopColor="#1269e8"/></linearGradient>
   <linearGradient id="birdWing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7dc6ff"/><stop offset="1" stopColor="#0868e9"/></linearGradient>
   <filter id="birdShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="9" floodColor="#3185ed" floodOpacity=".18"/></filter>
  </defs>
  <g filter="url(#birdShadow)">
   <path d="M48 95c28-19 48-28 78-28 37 0 66 13 83 36-14 28-43 43-78 43-34 0-59-12-83-35Z" fill="url(#birdBody)"/>
   <path d="M130 70c18-25 39-39 67-46 13 18 14 38 3 61-18-1-42-7-70-15Z" fill="url(#birdBlue)"/>
   <path d="M142 111c17-18 37-25 62-23-4 23-19 40-44 51-12-6-19-15-18-28Z" fill="url(#birdWing)"/>
   <path d="M160 72c18-16 40-22 67-18-4 20-16 34-35 43-12-3-22-11-32-25Z" fill="#2f8bf3"/>
   <circle cx="216" cy="72" r="20" fill="#edf4ff"/>
   <circle cx="222" cy="68" r="7" fill="#18223e"/><circle cx="224" cy="66" r="2" fill="#fff"/>
   <path d="M235 73l31 7-29 12c-5-6-6-12-2-19Z" fill="#ffad16"/>
  </g>
  <g stroke="#73baff" strokeWidth="5" strokeLinecap="round" opacity=".7"><path d="M35 91 8 101"/><path d="M61 110 25 124"/><path d="M80 71 54 78"/></g>
 </svg>
}

function Start({onStart}){
 return <main className="fb-reference-home page relative h-dvh overflow-hidden">
  <div className="fb-sky-glow"/>
  <div className="fb-sun"/>
  <div className="fb-cloud fb-cloud-a"/><div className="fb-cloud fb-cloud-b"/><div className="fb-cloud fb-cloud-c"/><div className="fb-cloud fb-cloud-d"/>
  <div className="fb-bird-mark fb-bird-mark-a">⌁</div><div className="fb-bird-mark fb-bird-mark-b">⌁</div>
  <div className="fb-hills fb-hills-back"/><div className="fb-hills fb-hills-mid"/><div className="fb-hills fb-hills-front"/>
  <div className="fb-border"/>

  <div className="relative z-20 mx-auto flex h-full w-full max-w-[1600px] flex-col items-center px-5 pt-[2.4vh] text-center sm:px-8">
   <div className="fb-top-logo-wrap">
    <img src="./logo2.png" alt="Nebuloid Tech" className="fb-top-logo"/>
   </div>

   <div className="fb-welcome">
    <i/><span>WELCOME TO</span><i/>
   </div>

   <section className="fb-title-wrap">
    <h1 className="fb-title"><span>FLAPPY</span><strong>BIRD</strong></h1>
    <div className="fb-title-accent fb-title-accent-l">◆</div>
    <div className="fb-title-accent fb-title-accent-r">◆</div>
   </section>

   <div className="fb-side-copy fb-side-copy-left">
    <span>FLAP</span>
    <b>FLY</b>
    <span>SURVIVE</span>
    <small>TIME YOUR FLAPS<br/>DODGE THE PIPES<br/>BEAT YOUR SCORE</small>
   </div>

   <div className="fb-side-copy fb-side-copy-right">
    <span>DODGE</span>
    <b>SCORE</b>
    <span>REPEAT</span>
    <small>KEEP FLYING<br/>CLEAR EVERY GAP<br/>SET A NEW RECORD</small>
   </div>

   <div className="fb-flying-bird"><BirdIllustration/></div>

   <button onClick={onStart} type="button" aria-label="Start Flappy Bird" className="fb-start-circle">
    <span>START</span>
   </button>

   <button type="button" className="fb-howto" aria-label="How To Play">
    <b>?</b><span>How To Play</span>
   </button>
  </div>
 </main>
}
function NameBird(){
 return <svg className="name-bird" viewBox="0 0 340 190" aria-hidden="true">
  <defs>
   <linearGradient id="nbBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#d9e8ff"/></linearGradient>
   <linearGradient id="nbBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#70c4ff"/><stop offset="1" stopColor="#0875ed"/></linearGradient>
   <filter id="nbShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#2985ef" floodOpacity=".18"/></filter>
  </defs>
  <g filter="url(#nbShadow)">
   <path d="M72 100c28-20 55-31 91-31 42 0 74 15 91 41-17 27-46 40-83 40-38 0-70-16-99-50Z" fill="url(#nbBody)"/>
   <path d="M128 74c15-29 36-48 67-57 20 22 21 47 5 76-24 0-48-6-72-19Z" fill="url(#nbBlue)"/>
   <path d="M144 119c18-23 41-32 69-29-4 26-22 45-51 56-13-6-20-15-18-27Z" fill="#166fe9"/>
   <path d="M164 78c20-17 45-23 75-18-6 21-20 35-41 43-14-3-25-11-34-25Z" fill="#3d9bf7"/>
   <circle cx="235" cy="77" r="22" fill="#eef5ff"/>
   <circle cx="241" cy="72" r="8" fill="#16213e"/><circle cx="243" cy="70" r="2.5" fill="#fff"/>
   <path d="M254 76l33 8-31 13c-5-7-6-14-2-21Z" fill="#ffab13"/>
  </g>
  <g stroke="#62b3ff" strokeWidth="5" strokeLinecap="round" opacity=".72"><path d="M60 91 25 105"/><path d="M79 116 36 134"/><path d="M99 72 66 83"/></g>
 </svg>
}

function NameEntry({onStart,onBack}){
 const[name,setName]=useState("");
 const[keyboardOpen,setKeyboardOpen]=useState(false);
 const[keyboardPos,setKeyboardPos]=useState(null);
 const keyboardDrag=useRef(null);
 const letters=[..."QWERTYUIOPASDFGHJKLZXCVBNM"];
 const addKey=(key)=>{
  if(key==="⌫") setName(v=>v.slice(0,-1));
  else if(key==="SPACE") setName(v=>v.length<26?(v+" ").slice(0,26):v);
  else if(name.length<26) setName(v=>(v+key).slice(0,26));
 };
 return <main className="name-screen page relative h-dvh overflow-hidden text-slate-900">
  <div className="name-orb name-orb-a"/><div className="name-orb name-orb-b"/>
  <div className="name-dots name-dots-top"/><div className="name-dots name-dots-bottom"/>
  <div className="name-chevron name-chevron-left">›››</div><div className="name-chevron name-chevron-right">›››</div>
  <div className="name-plus name-plus-one">+</div><div className="name-plus name-plus-two">+</div>
  <div className="name-streak name-streak-one"/><div className="name-streak name-streak-two"/>

  <button onClick={onBack} className="name-back" type="button">← <span>BACK</span></button>
  <div className="name-side-copy name-side-left">SMALL<br/>STEPS<br/>BIG<br/>PROGRESS<div>—</div></div>
  <div className="name-side-copy name-side-right">PLAY<br/>SOLVE<br/>IMPROVE<div>—</div></div>
  <div className="name-side-copy name-side-bottom">CLEAR<br/>SOLVE<br/>ACHIEVE<div>—</div></div>

  <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col items-center px-6 py-5 sm:px-10">
   <header className="name-header shrink-0">
    <img src="./logo2.png" alt="Nebuloid Tech" className="name-logo"/>
   </header>

   <section className="name-content flex min-h-0 flex-1 w-full flex-col items-center justify-center text-center">
    <NameBird/>
    <h1>ENTER YOUR <span>NAME</span></h1>
    <p>Your name will appear on every achievement certificate.</p>

    <div className="name-form">
     <div className="name-input-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-3.7 3.1-5.5 7-5.5s6.3 1.8 7 5.5"/></svg>
      <input value={name} onFocus={()=>setKeyboardOpen(true)} onChange={e=>setName(e.target.value)} maxLength={26} placeholder="Your name" aria-label="Your name"/>
      <span>{name.length}/26</span>
     </div>
     <button disabled={!name.trim()} onClick={()=>onStart(name.trim())} className="name-continue" type="button">CONTINUE <span>→</span></button>
     {keyboardOpen && <div
      className={`floating-keyboard${keyboardDrag.current ? " is-dragging" : ""}`}
      aria-label="On-screen keyboard"
      style={keyboardPos ? {left:keyboardPos.x, top:keyboardPos.y, right:"auto", transform:"none"} : undefined}
      onPointerDown={e=>{
       if(e.button!==undefined && e.button!==0)return;
       const el=e.currentTarget;
       const rect=el.getBoundingClientRect();
       keyboardDrag.current={
        offsetX:e.clientX-rect.left,
        offsetY:e.clientY-rect.top,
        moved:false
       };
       el.setPointerCapture?.(e.pointerId);
      }}
      onPointerMove={e=>{
       const d=keyboardDrag.current;
       if(!d)return;
       const dx=Math.abs(e.clientX-(d.startX??e.clientX));
       const dy=Math.abs(e.clientY-(d.startY??e.clientY));
       if(dx>4||dy>4)d.moved=true;
       const x=Math.max(8,Math.min(window.innerWidth-e.currentTarget.offsetWidth,e.clientX-d.offsetX));
       const y=Math.max(8,Math.min(window.innerHeight-e.currentTarget.offsetHeight,e.clientY-d.offsetY));
       setKeyboardPos({x,y});
      }}
      onPointerUp={e=>{keyboardDrag.current=null;e.currentTarget.releasePointerCapture?.(e.pointerId)}}
      onPointerCancel={()=>{keyboardDrag.current=null}}
     >
      <div className="keyboard-drag-handle" aria-hidden="true"><span/> <b>DRAG KEYBOARD</b> <span/></div>
      <div className="keyboard-row">{letters.slice(0,10).map(k=><button key={k} type="button" onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.preventDefault()} onClick={()=>addKey(k)}>{k}</button>)}</div>
      <div className="keyboard-row keyboard-row-mid">{letters.slice(10,19).map(k=><button key={k} type="button" onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.preventDefault()} onClick={()=>addKey(k)}>{k}</button>)}</div>
      <div className="keyboard-row">{letters.slice(19).map(k=><button key={k} type="button" onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.preventDefault()} onClick={()=>addKey(k)}>{k}</button>)}<button className="key-wide key-delete" type="button" onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.preventDefault()} onClick={()=>addKey("⌫")}>⌫</button></div>
      <div className="keyboard-row keyboard-bottom"><button className="key-space" type="button" onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.preventDefault()} onClick={()=>addKey("SPACE")}>SPACE</button><button className="key-done" type="button" onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>e.preventDefault()} onClick={()=>setKeyboardOpen(false)}>DONE</button></div>
     </div>}
    </div>
   </section>

   <footer className="name-footer"><i/><span>PUZZLE&nbsp; • &nbsp;SKILL&nbsp; • &nbsp;FUN</span><i/></footer>
  </div>
 </main>
}

function draw(ctx,w,h,s,c,finishX=0){
 ctx.clearRect(0,0,w,h);

 // Bright event-style sky
 let sky=ctx.createLinearGradient(0,0,0,h);
 sky.addColorStop(0,"#42b8f4");
 sky.addColorStop(.55,"#7edcf0");
 sky.addColorStop(1,"#8fc4ef");
 ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);

 // Soft sun / atmospheric glow
 const sun=ctx.createRadialGradient(w*.75,h*.36,8,w*.75,h*.36,170);
 sun.addColorStop(0,"rgba(255,255,255,.55)");sun.addColorStop(1,"rgba(255,255,255,0)");
 ctx.fillStyle=sun;ctx.fillRect(0,0,w,h);

 // Clouds
 const cloud=(x,y,scale=1)=>{
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
  ctx.fillStyle="rgba(255,255,255,.34)";
  ctx.beginPath();ctx.arc(0,10,25,0,Math.PI*2);ctx.arc(30,-2,38,0,Math.PI*2);ctx.arc(68,12,27,0,Math.PI*2);ctx.roundRect(-24,10,116,32,16);ctx.fill();
  ctx.restore();
 };
 cloud(65,145,1.15);cloud(w-105,195,1.05);cloud(w*.35,h*.42,.72);cloud(w*.78,h*.48,.7);

 // Tiny sky birds
 ctx.strokeStyle="rgba(36,115,222,.38)";ctx.lineWidth=4;ctx.lineCap="round";
 for(const [x,y,sc] of [[w*.26,h*.22,1],[w*.74,h*.10,.75]]){
  ctx.beginPath();ctx.moveTo(x-18*sc,y);ctx.quadraticCurveTo(x-8*sc,y-9*sc,x, y);ctx.quadraticCurveTo(x+9*sc,y-9*sc,x+18*sc,y);ctx.stroke();
 }

 // Layered mountain range
 ctx.fillStyle="rgba(72,142,226,.30)";ctx.beginPath();ctx.moveTo(0,h*.67);
 for(let x=0;x<=w;x+=120)ctx.lineTo(x,h*.58+Math.sin(x*.014)*42);
 ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
 ctx.fillStyle="rgba(52,120,221,.34)";ctx.beginPath();ctx.moveTo(0,h*.76);
 for(let x=0;x<=w;x+=75)ctx.lineTo(x,h*.67+Math.sin(x*.021+1.5)*35);
 ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();
 ctx.fillStyle="rgba(41,103,212,.26)";ctx.beginPath();ctx.moveTo(0,h*.86);
 for(let x=0;x<=w;x+=38)ctx.lineTo(x,h*.76+Math.sin(x*.06)*22);
 ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.fill();

 // Green pipes
 for(const p of s.p){
  let g=ctx.createLinearGradient(p.x,0,p.x+72,0);
  g.addColorStop(0,"#087650");g.addColorStop(.28,"#0dbf78");g.addColorStop(.52,"#36f09b");g.addColorStop(.78,"#0cae6d");g.addColorStop(1,"#075d42");
  ctx.fillStyle=g;ctx.fillRect(p.x,0,72,p.top);ctx.fillRect(p.x,p.top+c.gap,72,h);
  ctx.fillStyle="#8dffbf";ctx.fillRect(p.x-7,p.top-20,86,20);ctx.fillRect(p.x-7,p.top+c.gap,86,20);
  ctx.fillStyle="rgba(255,255,255,.18)";ctx.fillRect(p.x+14,0,9,p.top);ctx.fillRect(p.x+14,p.top+c.gap,9,h);
  ctx.fillStyle="rgba(0,0,0,.14)";ctx.fillRect(p.x+55,0,9,p.top);ctx.fillRect(p.x+55,p.top+c.gap,9,h);
 }

 // Finish marker remains after the final pipe
 if(finishX>0){
  const fx=finishX, fy=40, fh=h-74, pole=10;
  if(fx>-130 && fx<w+130){
   ctx.save();ctx.shadowBlur=18;ctx.shadowColor="rgba(38,55,180,.25)";ctx.fillStyle="#554bd4";ctx.fillRect(fx,fy,pole,fh);ctx.shadowBlur=0;
   const tile=18,flagW=108,flagH=72;
   for(let yy=0;yy<flagH;yy+=tile)for(let xx=0;xx<flagW;xx+=tile){ctx.fillStyle=((xx/tile+yy/tile)%2===0)?"#18203b":"#fff";ctx.fillRect(fx+pole,fy+18+yy,tile,tile)}
   ctx.fillStyle="#18203b";ctx.font="900 10px Inter, sans-serif";ctx.textAlign="left";ctx.fillText("FINISH • LEVEL "+String(c.n).padStart(2,"0"),fx+pole+5,fy+8);ctx.restore();
  }
 }

 // Ground
 ctx.fillStyle="#ffc92f";ctx.fillRect(0,h-44,w,44);
 ctx.fillStyle="#e8a71d";for(let x=0;x<w;x+=42)ctx.fillRect(x,h-44,21,8);
 ctx.fillStyle="rgba(255,235,100,.65)";ctx.fillRect(0,h-44,w,3);

 // Blue event bird
 ctx.save();
 ctx.translate(145,s.y);
 ctx.rotate(Math.max(-.4,Math.min(.65,s.v*.045)));
 ctx.shadowBlur=18;ctx.shadowColor="rgba(22,106,225,.28)";
 ctx.fillStyle="#f4f8ff";ctx.beginPath();ctx.ellipse(0,0,30,22,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#1878ed";ctx.beginPath();ctx.moveTo(-27,-5);ctx.lineTo(-3,-29);ctx.lineTo(9,-3);ctx.lineTo(-7,12);ctx.closePath();ctx.fill();
 ctx.fillStyle="#0b62dc";ctx.beginPath();ctx.moveTo(-24,12);ctx.lineTo(-5,-5);ctx.lineTo(15,8);ctx.lineTo(-9,24);ctx.closePath();ctx.fill();
 ctx.fillStyle="#2d91f4";ctx.beginPath();ctx.moveTo(-2,-10);ctx.lineTo(13,-24);ctx.lineTo(25,-7);ctx.lineTo(7,7);ctx.closePath();ctx.fill();
 ctx.fillStyle="#eef5ff";ctx.beginPath();ctx.arc(20,-7,18,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#17213d";ctx.beginPath();ctx.arc(26,-11,6,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(28,-13,2,0,Math.PI*2);ctx.fill();
 ctx.fillStyle="#ffae16";ctx.beginPath();ctx.moveTo(35,-7);ctx.lineTo(52,-2);ctx.lineTo(35,5);ctx.closePath();ctx.fill();
 ctx.restore();

 // Bird motion streaks
 ctx.strokeStyle="rgba(255,255,255,.45)";ctx.lineWidth=4;ctx.lineCap="round";
 ctx.beginPath();ctx.moveTo(25,s.y+13);ctx.lineTo(100,s.y+5);ctx.moveTo(10,s.y+29);ctx.lineTo(76,s.y+16);ctx.stroke();
}
function Game({level,onComplete,onExit}){
 const ref=useRef(null),st=useRef({y:0,v:0,p:[],score:0,dead:false,finished:false,last:0});
 const audioRef=useRef(null);
 const[score,setScore]=useState(0),[paused,setPaused]=useState(false),[retry,setRetry]=useState(0);
 const[gameOver,setGameOver]=useState(false);
 const cfg=LEVELS[level-1];

 const playFlapSound=()=>{
  try{
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC)return;
   if(!audioRef.current)audioRef.current=new AC();
   const a=audioRef.current;
   if(a.state==="suspended")a.resume();

   const now=a.currentTime;
   const osc=a.createOscillator(),gain=a.createGain();
   osc.type="triangle";
   osc.frequency.setValueAtTime(520,now);
   osc.frequency.exponentialRampToValueAtTime(760,now+0.075);
   gain.gain.setValueAtTime(0.0001,now);
   gain.gain.exponentialRampToValueAtTime(0.16,now+0.008);
   gain.gain.exponentialRampToValueAtTime(0.0001,now+0.095);
   osc.connect(gain);gain.connect(a.destination);
   osc.start(now);osc.stop(now+0.105);
  }catch{}
 };

 const playGameOverSound=()=>{
  try{
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC)return;
   if(!audioRef.current)audioRef.current=new AC();
   const a=audioRef.current;if(a.state==="suspended")a.resume();
   const now=a.currentTime;
   [[240,0],[180,.12],[120,.25]].forEach(([freq,offset])=>{
    const osc=a.createOscillator(),gain=a.createGain(),t=now+offset;
    osc.type="sawtooth";osc.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.18,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+.16);
    osc.connect(gain);gain.connect(a.destination);osc.start(t);osc.stop(t+.18);
   });
  }catch{}
 };

 const playWinSound=()=>{
  try{
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC)return;
   if(!audioRef.current)audioRef.current=new AC();
   const a=audioRef.current;if(a.state==="suspended")a.resume();
   const now=a.currentTime;
   [523.25,659.25,783.99,1046.5].forEach((freq,i)=>{
    const osc=a.createOscillator(),gain=a.createGain(),t=now+i*.11;
    osc.type="sine";osc.frequency.setValueAtTime(freq,t);
    gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.2,t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+.28);
    osc.connect(gain);gain.connect(a.destination);osc.start(t);osc.stop(t+.3);
   });
  }catch{}
 };

 const flap=()=>{
  if(!st.current.dead&&!st.current.finished&&!paused){
   st.current.v=-7.2;
   playFlapSound();
  }
 };
 const restart=()=>{setGameOver(false);setScore(0);setRetry(x=>x+1)};

 useEffect(()=>{
  const cv=ref.current,ctx=cv.getContext("2d"),s=st.current;
  let raf;
  const resize=()=>{cv.width=cv.clientWidth*devicePixelRatio;cv.height=cv.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};
  resize();addEventListener("resize",resize);

  const W=()=>cv.clientWidth,H=()=>cv.clientHeight;
  s.y=H()*.45;s.v=0;s.p=[];s.score=0;s.dead=false;s.finished=false;s.last=performance.now();

  // Finish is NOT visible at the start. It is placed only after the final obstacle.
  let finish=Infinity;
  const addPipe=()=>{
   const max=Math.max(90,H()-cfg.gap-190);
   const x=s.p.length ? s.p[s.p.length-1].x+cfg.spacing : W()+70;
   s.p.push({x,top:80+Math.random()*(max-80),passed:false});
   if(s.p.length===cfg.target){ finish=x+cfg.spacing*.72; }
  };
  addPipe();

  function loop(t){
   const dt=Math.min(2,(t-s.last)/16.67);s.last=t;

   if(!paused&&!s.dead&&!s.finished){
    s.v+=cfg.gravity*dt;s.y+=s.v*dt;

    // Hitting the top or bottom of the playable frame is also Game Over.
    const birdR=30, topLimit=birdR, bottomLimit=H()-44-birdR;
    if(s.y-birdR<=0 || s.y+birdR>=H()-44){
     s.dead=true;setGameOver(true);playGameOverSound();
    }
    if(!s.dead){
     if(s.y<topLimit){s.y=topLimit;if(s.v<0)s.v=0;}
     if(s.y>bottomLimit){s.y=bottomLimit;if(s.v>0)s.v=0;}
    }

    if(s.dead){
     draw(ctx,W(),H(),s,cfg,finish);
     raf=requestAnimationFrame(loop);
     return;
    }

    s.p.forEach(p=>p.x-=cfg.speed*dt);
    if(Number.isFinite(finish)) finish-=cfg.speed*dt;

    if(s.p.at(-1).x<W()-180 && s.p.length<cfg.target) addPipe();

    for(const p of s.p){
     if(!p.passed&&p.x+72<145){p.passed=true;s.score++;setScore(s.score)}
     // GAME OVER ONLY ON ACTUAL PIPE COLLISION.
     // The bird's visual center is x=145 and its collision radius is 16px.
     const birdX=145, hitR=16;
     if(birdX+hitR>p.x&&birdX-hitR<p.x+72&&
        (s.y-hitR<p.top||s.y+hitR>p.top+cfg.gap)){
      s.dead=true;setGameOver(true);playGameOverSound();
      break;
     }
    }

    // Finish only becomes active after the required number of pipes.
    if(s.score>=cfg.target && Number.isFinite(finish) && finish<145){
      s.finished=true;
      setTimeout(()=>onComplete(s.score),250);
    }
   }

   draw(ctx,W(),H(),s,cfg,finish);
   raf=requestAnimationFrame(loop);
  }
  raf=requestAnimationFrame(loop);
  return()=>{cancelAnimationFrame(raf);removeEventListener("resize",resize)}
 },[level,paused,retry]);

 useEffect(()=>()=>{
  if(audioRef.current){
   audioRef.current.close().catch(()=>{});
   audioRef.current=null;
  }
 },[]);

 useEffect(()=>{
  const k=e=>{
   if(e.code==="Space"||e.code==="ArrowUp"){e.preventDefault();flap()}
   if(e.code==="KeyR"&&gameOver)restart()
  };
  addEventListener("keydown",k);
  return()=>removeEventListener("keydown",k)
 },[paused,gameOver]);

 return <div className="game-board relative h-full w-full overflow-hidden cursor-pointer select-none" onPointerDown={flap}>
  <canvas ref={ref} className="absolute inset-0 w-full h-full"/>

  <div className="absolute top-4 left-5 right-5 sm:top-5 sm:left-5 sm:right-5 flex items-start justify-between pointer-events-none">
   <div className="glass rounded-2xl px-4 py-2">
    <small className="text-[9px] tracking-widest text-slate-500">LEVEL</small>
    <b className="block text-xl leading-5 text-slate-900">{String(level).padStart(2,"0")} <span className="text-slate-400">/ 10</span></b>
   </div>
   <div className="glass rounded-2xl px-6 py-2 text-center">
    <small className="text-[9px] tracking-widest text-slate-500">SCORE</small>
    <b className="block text-2xl leading-5 text-slate-900">{score}</b>
   </div>
   <button onPointerDown={e=>e.stopPropagation()} onClick={()=>setPaused(v=>!v)} className="glass pointer-events-auto rounded-2xl px-4 py-3 font-black text-slate-800">{paused?"▶":"Ⅱ"}</button>
  </div>

  {!gameOver&&<div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-5 py-2 text-[10px] font-black tracking-widest whitespace-nowrap pointer-events-none text-slate-700">TAP • CLICK • SPACE TO FLAP</div>}
  {!gameOver&&<button onClick={onExit} className="absolute bottom-4 left-4 glass rounded-full px-4 py-2 text-[10px] font-black text-slate-700">EXIT</button>}

  {gameOver&&<div onPointerDown={e=>e.stopPropagation()} className="gameover-overlay absolute inset-0">
   <div className="gameover-brand">
    <img src="./logo2.png" alt="Nebuloid Tech"/>
    <div><span>NEBULOID</span> <b>TECH</b></div>
    <small><i/> FLAPPYVERSE <i/></small>
   </div>

   <div className="gameover-center">
    <svg className="gameover-bird" viewBox="0 0 340 170" aria-hidden="true">
     <defs>
      <linearGradient id="deadBody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffffff"/><stop offset="1" stopColor="#dbe8ff"/></linearGradient>
      <linearGradient id="deadBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#55b8ff"/><stop offset="1" stopColor="#0a67e8"/></linearGradient>
     </defs>
     <ellipse cx="170" cy="130" rx="86" ry="13" fill="rgba(18,73,157,.25)"/>
     <g transform="translate(46 18) rotate(-8 125 65)">
      <path d="M55 88c25-19 52-29 85-29 37 0 67 12 84 34-17 26-45 39-78 39-35 0-65-14-91-44Z" fill="url(#deadBody)"/>
      <path d="M110 64c17-27 39-44 69-51 17 19 18 42 4 68-24 0-48-5-73-17Z" fill="url(#deadBlue)"/>
      <path d="M122 105c18-22 39-30 67-27-5 24-21 42-47 52-14-6-20-14-20-25Z" fill="#176ee9"/>
      <path d="M145 69c19-15 42-21 68-16-5 19-19 32-38 40-12-4-22-11-30-24Z" fill="#2d90f4"/>
      <circle cx="208" cy="68" r="20" fill="#eef5ff"/>
      <path d="M201 61l15 15m0-15l-15 15" stroke="#111a38" strokeWidth="5" strokeLinecap="round"/>
      <path d="M226 67l31 7-29 12c-5-6-6-13-2-19Z" fill="#ffad16"/>
     </g>
    </svg>
    <div className="gameover-kicker">F L I G H T &nbsp; E N D E D</div>
    <h1>GAME <span>OVER</span></h1>
    <p>Your bird hit an obstacle. Try the level again.</p>

    <div className="gameover-stats">
     <div><span className="stat-icon">♜</span><div className="stat-copy"><label>YOUR SCORE</label><b>{score}</b></div></div>
     <div><span className="stat-icon">◎</span><div className="stat-copy"><label>TARGET</label><b>{cfg.target}</b></div></div>
    </div>

    <button onClick={restart} className="gameover-retry">↻ <span>RETRY LEVEL {String(level).padStart(2,"0")}</span></button>
    <button onClick={onExit} className="gameover-exit">⌂ <span>EXIT TO HOME</span></button>
    <div className="gameover-footer"><i/> FLY&nbsp;&nbsp; • &nbsp;&nbsp;DODGE&nbsp;&nbsp; • &nbsp;&nbsp;WIN <i/></div>
   </div>
  </div>}
 </div>
}
function LevelStart({level,onBegin}){
 const n=String(level).padStart(2,"0");
 return <main className="level-start-screen page relative h-dvh overflow-hidden text-slate-900">
  <div className="level-orb level-orb-a"/><div className="level-orb level-orb-b"/>
  <div className="level-dots level-dots-top"/><div className="level-dots level-dots-bottom"/>
  <div className="level-chevron level-chevron-left">›››</div><div className="level-chevron level-chevron-right">›››</div>
  <div className="level-plus level-plus-one">+</div><div className="level-plus level-plus-two">+</div>
  <div className="level-streak level-streak-one"/><div className="level-streak level-streak-two"/>
  <button className="level-back" type="button" onClick={()=>window.history.back()}>← <span>BACK</span></button>
  <div className="level-side-copy level-side-left">SMALL<br/>STEPS<br/>BIG<br/>PROGRESS<div>—</div></div>
  <div className="level-side-copy level-side-right">PLAY<br/>SOLVE<br/>IMPROVE<div>—</div></div>
  <div className="level-side-copy level-side-bottom">PUZZLE<br/>SKILL<br/>FUN<div>—</div></div>
  <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] flex-col items-center px-6 py-5 sm:px-10">
   <header className="level-header shrink-0">
    <div className="level-logo-wrap">
     <img src="./logo2.png" alt="Nebuloid Tech" className="level-logo"/>
    </div>
   </header>
   <section className="level-content flex min-h-0 flex-1 w-full flex-col items-center justify-center text-center">
    <div className="level-bird-wrap"><NameBird/></div>
    <div className="level-label">LEVEL</div>
    <div className="level-number"><span>{n[0]}</span><b>{n[1]}</b></div>
    <div className="level-of">of <b>10</b></div>
    <div className="level-progress"><i style={{width:`${level*10}%`}}/><b/></div>
    <p>Clear this level by flying through the required pipes.</p>
    <button onClick={onBegin} className="level-start-btn" type="button">START LEVEL {n} <span>→</span></button>
   </section>
   <footer className="level-footer"><i/><span>FLY&nbsp; • &nbsp;DODGE&nbsp; • &nbsp;WIN</span><i/></footer>
  </div>
 </main>
}
function Complete({level,score,next}){
 const final=level===10;
 return <main className="page relative h-dvh grid place-items-center p-5 text-white">
  <Atmosphere/>
  <div className="relative glass rounded-[36px] p-8 sm:p-12 w-full max-w-xl text-center">
   <div className="pulse text-7xl">{final?"🏆":"⚡"}</div>
   <div className="mt-3 text-[10px] tracking-[.4em] font-black text-cyan-600">{final?"ALL LEVELS COMPLETE":"LEVEL COMPLETE"}</div>
   <h1 className="text-4xl sm:text-5xl font-black mt-2 text-slate-900">{final?"YOU DID IT!":`LEVEL ${String(level).padStart(2,"0")} CLEARED`}</h1>
   <p className="mt-3 text-slate-500">{final?"You cleared all 10 levels. Your personalized certificate is ready.":"Great flight. Get ready for the next level."}</p>
   <div className="mt-7 grid grid-cols-2 gap-3">
    <div className="rounded-2xl bg-slate-900/5 p-4"><small className="text-slate-500">LEVEL</small><b className="block text-2xl text-slate-900">{level} / 10</b></div>
    <div className="rounded-2xl bg-slate-900/5 p-4"><small className="text-slate-500">ROUND SCORE</small><b className="block text-2xl text-slate-900">{score}</b></div>
   </div>
   <button onClick={next} className="cta w-full rounded-2xl py-4 mt-7 font-black text-lg">{final?"VIEW CERTIFICATE":`START LEVEL ${String(level+1).padStart(2,"0")} →`}</button>
  </div>
 </main>
}

function Certificate({name,score,level,total,restart,onContinue}){
 const final=level===10;
 const n=String(level).padStart(2,"0");
 return <main className="certificate-screen page relative h-dvh overflow-hidden text-slate-900">
  <div className="certificate-sky-glow certificate-glow-left"/>
  <div className="certificate-sky-glow certificate-glow-right"/>
  <div className="certificate-ray certificate-ray-left"/>
  <div className="certificate-ray certificate-ray-right"/>

  <div className="certificate-dots certificate-dots-one"/><div className="certificate-dots certificate-dots-two"/>
  <div className="certificate-streak certificate-streak-one"/><div className="certificate-streak certificate-streak-two"/>
  <div className="certificate-side-copy certificate-side-left">SMALL<br/>STEPS<br/>BIG<br/>PROGRESS<div>—</div></div>
  <div className="certificate-side-copy certificate-side-right">PLAY<br/>SOLVE<br/>IMPROVE<div>—</div></div>
  <div className="certificate-side-copy certificate-side-bottom">FLY<br/>DODGE<br/>WIN<div>—</div></div>

  <div className="certificate-cloud certificate-cloud-one"/>
  <div className="certificate-cloud certificate-cloud-two"/>

  <header className="certificate-header">
   <div className="certificate-brand-lockup">
    <div className="certificate-logo-box"><img src="./logo2.png" alt="Nebuloid Tech"/></div>
    <div className="certificate-brand-text">
     <div><span>NEBULOID</span> <b>TECH</b></div>
     <small>F L A P P Y V E R S E</small>
    </div>
   </div>
   <div className="certificate-header-copy">P L A Y<br/>S O L V E<br/>I M P R O V E<div>—</div></div>
  </header>

  <section className="certificate-main">
   <div className="certificate-bird-area">
    <div className="certificate-crown" aria-hidden="true">
     <svg viewBox="0 0 100 70"><path d="M12 18 30 34 50 10 70 34 88 18 82 53H18Z" fill="#ffb52e"/><path d="M18 53h64v7H18z" fill="#ffca45"/><circle cx="12" cy="16" r="6" fill="#ffb52e"/><circle cx="50" cy="8" r="6" fill="#ffb52e"/><circle cx="88" cy="16" r="6" fill="#ffb52e"/></svg>
    </div>
    <div className="certificate-bird"><NameBird/></div>
    <div className="certificate-confetti confetti-a">◆</div><div className="certificate-confetti confetti-b">◆</div><div className="certificate-confetti confetti-c">◆</div><div className="certificate-confetti confetti-d">◆</div><div className="certificate-confetti confetti-e">◆</div>
   </div>

   <div className="certificate-title-row">
    <span/><h1>CERTIFICATE OF <b>ACHIEVEMENT</b></h1><span/>
   </div>
   <div className="certificate-subtitle">F L A P P Y V E R S E &nbsp;&nbsp; E V E N T &nbsp;&nbsp; C H A L L E N G E</div>

   <div className="certificate-laurel certificate-laurel-left" aria-hidden="true"><Laurel/></div>
   <div className="certificate-laurel certificate-laurel-right" aria-hidden="true"><Laurel flip/></div>

   <p className="certificate-presented">This certificate is proudly presented to</p>
   <h2 className="certificate-name">{name}</h2>
   <div className="certificate-achievement">{final?'FLAPPYVERSE CHAMPION':`LEVEL ${n} CHAMPION`}</div>
   <p className="certificate-description">{final?<>For successfully completing all <b>10 levels</b> of the FlappyVerse event-tech flight challenge.</>:<>For successfully clearing <b>Level {n}</b> of the FlappyVerse event-tech flight challenge.</>}</p>

   <div className="certificate-stats">
    <div className="certificate-stat"><div className="certificate-stat-icon certificate-trophy-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 8h20v7c0 8-4 13-10 15-6-2-10-7-10-15V8Z" fill="currentColor"/><path d="M14 12H7v4c0 7 5 12 12 12M34 12h7v4c0 7-5 12-12 12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="M24 30v8M16 40h16" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg></div><div><small>ROUND SCORE</small><b>{score}</b></div></div>
    <div className="certificate-stat"><div className="certificate-stat-icon certificate-target-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="24" cy="24" r="9" fill="none" stroke="currentColor" strokeWidth="4"/><circle cx="24" cy="24" r="3.5" fill="currentColor"/><path d="m28 20 11-11" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/><path d="m39 9-1 7-6-6 7-1Z" fill="currentColor"/></svg></div><div><small>LEVELS CLEARED</small><b>{level} / 10</b></div></div>
    <div className="certificate-stat"><div className="certificate-stat-icon certificate-star-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 5 5.8 11.8 13 1.9-9.4 9.2 2.2 13-11.6-6.1-11.6 6.1 2.2-13-9.4-9.2 13-1.9L24 5Z" fill="currentColor"/></svg></div><div><small>TOTAL SCORE</small><b>{total}</b></div></div>
   </div>

   <div className="certificate-actions print-hide">
    {!final&&<button onClick={onContinue} className="certificate-continue">CONTINUE LEVEL {String(level+1).padStart(2,'0')} <span>→</span></button>}
    {final&&<button onClick={restart} className="certificate-continue">PLAY AGAIN <span>→</span></button>}
    <button onClick={()=>window.print()} className="certificate-print"><span className="certificate-print-icon"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 18V7h22v11M13 35H9a4 4 0 0 1-4-4V21a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/><path d="M13 29h22v12H13z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><circle cx="36" cy="23" r="2" fill="currentColor"/></svg></span> PRINT CERTIFICATE</button>
   </div>
  </section>

  <div className="certificate-mountains certificate-mountains-back"/>
  <div className="certificate-mountains certificate-mountains-front"/>
  <footer className="certificate-footer"><i/><span>A N E B U L O I D &nbsp; T E C H &nbsp; E X P E R I E N C E</span><i/></footer>
 </main>
}

function Laurel({flip=false}){
 return <svg viewBox="0 0 100 220" className={flip?"laurel-svg flip":"laurel-svg"} aria-hidden="true">
  <path d="M50 205C18 170 16 125 30 80 37 57 45 35 58 15" fill="none" stroke="#8bbaf6" strokeWidth="4" strokeLinecap="round"/>
  <g fill="#9bc6fa">
   <ellipse cx="30" cy="173" rx="11" ry="25" transform="rotate(-42 30 173)"/><ellipse cx="24" cy="145" rx="10" ry="24" transform="rotate(-38 24 145)"/>
   <ellipse cx="23" cy="116" rx="10" ry="23" transform="rotate(-28 23 116)"/><ellipse cx="29" cy="89" rx="10" ry="22" transform="rotate(-18 29 89)"/>
   <ellipse cx="38" cy="63" rx="9" ry="21" transform="rotate(-2 38 63)"/><ellipse cx="48" cy="39" rx="8" ry="19" transform="rotate(18 48 39)"/>
  </g>
 </svg>
}

function App(){
 const[screen,setScreen]=useState("start"),[name,setName]=useState(""),[level,setLevel]=useState(1),[total,setTotal]=useState(0),[roundScore,setRoundScore]=useState(0);
 const openName=()=>setScreen("name");
 const start=n=>{setName(n);setLevel(1);setTotal(0);setRoundScore(0);setScreen("level-start")};
 const beginLevel=()=>setScreen("play");
 const complete=s=>{setRoundScore(s);setTotal(v=>v+s);setScreen("certificate")};
 const next=()=>{if(level<10){setLevel(v=>v+1);setScreen("level-start")}};
 const restart=()=>{setName("");setLevel(1);setTotal(0);setRoundScore(0);setScreen("start")};
 if(screen==="start")return <Start onStart={openName}/>;
 if(screen==="name")return <NameEntry onStart={start} onBack={()=>setScreen("start")}/>;
 if(screen==="level-start")return <LevelStart level={level} onBegin={beginLevel}/>;
 if(screen==="play")return <main className="game-screen page relative h-dvh w-full overflow-hidden text-white"><Game key={level} level={level} onComplete={complete} onExit={restart}/></main>;
 if(screen==="certificate")return <Certificate name={name} score={roundScore} total={total} level={level} restart={restart} onContinue={next}/>;
 return <Start onStart={start}/>;
}

createRoot(document.getElementById("root")).render(<App/>);
