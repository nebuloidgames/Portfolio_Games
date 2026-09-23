import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Trophy,Timer,Target,Zap,ShieldCheck,ArrowRight,RotateCcw,Download,CheckCircle2,Swords,Keyboard,ChevronLeft,Volume2,VolumeX,HelpCircle,CalendarDays,UserRound} from 'lucide-react';
import './index.css';

const levels=[
 {n:1,title:'The Studio',text:'Nebuloid Tech Studio is a creative technology partner building memorable digital experiences for modern brands and audiences.'},
 {n:2,title:'Experience First',text:'Nebuloid brings branding, technology, and production together into one seamless event ecosystem, creating experiences that feel clear, engaging, and easy to remember.'},
 {n:3,title:'AI Experiences',text:'Nebuloid creates AI powered experiences designed to feel personalised, surprising, and engaging, helping visitors discover information through natural and interactive digital journeys.'},
 {n:4,title:'Interactive Games',text:'Nebuloid builds interactive games that turn passive visitors into active participants at live events, combining simple rules, responsive interfaces, and rewarding moments of competition.'},
 {n:5,title:'Event Technology',text:'Nebuloid develops kiosks, event websites, navigation systems, analytics, and digital engagement tools that help audiences explore spaces, interact with content, and stay connected throughout an event.'},
 {n:6,title:'Build With Purpose',text:'Every Nebuloid experience is designed with clear intent, from the first interaction to the final insight, balancing creative storytelling with reliable technology, useful information, and a smooth experience for every visitor.'},
 {n:7,title:'Live Engagement',text:'Nebuloid uses gamification, interactive installations, and smart interfaces to increase visitor engagement, turning ordinary event moments into memorable challenges where people can play, learn, explore, and share the experience with others.'},
 {n:8,title:'Digital Storytelling',text:'Nebuloid combines multimedia, interactive modules, and touch driven experiences to bring stories to life, guiding visitors through rich digital content while keeping every interaction intuitive, visually engaging, and connected to the larger message.'},
 {n:9,title:'Complete Ecosystems',text:'Nebuloid designs complete digital ecosystems for exhibitions, pavilions, venues, and high traffic environments, connecting interactive displays, navigation, analytics, content, and responsive experiences into one cohesive journey that remains engaging from beginning to end.'},
 {n:10,title:'Ideas Wired To Reality',text:'Nebuloid Tech Studio creates technology that transforms ideas into engaging experiences people remember, combining strategy, design, interactive development, live event technology, and thoughtful digital storytelling to build meaningful journeys that connect brands with audiences in real time.'}
];
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const TIME_LIMITS=[90,95,100,105,110,115,120,125,130,135];
const getTimeLimit=(n)=>TIME_LIMITS[n-1];
function App(){
 const [screen,setScreen]=useState('home'); const [playerName,setPlayerName]=useState(''); const [gameOverReason,setGameOverReason]=useState('timeout'); const [nameInput,setNameInput]=useState(''); const [level,setLevel]=useState(1); const [typed,setTyped]=useState(''); const [time,setTime]=useState(0); const [started,setStarted]=useState(false); const [done,setDone]=useState(false); const [score,setScore]=useState(0); const [best,setBest]=useState(0); const inputRef=useRef(null); const timerRef=useRef(null);
 const current=levels[level-1]; const timeLimit=getTimeLimit(level); const timeLeft=Math.max(0,timeLimit-time);
 const cpuFinishTime=useMemo(()=>Math.max(65,88-(level-1)*2),[level]);
 const opponent=Math.min(100,Math.round(time/cpuFinishTime*100));
 const progress=Math.min(100,typed.length/current.text.length*100); const correctChars=[...typed].filter((c,i)=>c===current.text[i]).length; const accuracy=typed.length?Math.round(correctChars/typed.length*100):100; const wpm=time?Math.round((correctChars/5)/(time/60)):0;
 useEffect(()=>()=>clearInterval(timerRef.current),[]);
  useEffect(()=>{
    window.scrollTo(0,0);
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  },[screen]);
  useEffect(()=>{
    if(screen==='game'){
      document.documentElement.style.scrollBehavior='auto';
      document.body.style.scrollBehavior='auto';
      window.scrollTo(0,0);
      document.documentElement.scrollTop=0;
      document.body.scrollTop=0;
    }
  },[screen]);
 useEffect(()=>{
  if(screen==='game'&&started&&!done&&!timerRef.current){
   timerRef.current=setInterval(()=>setTime(t=>t+1),1000)
  }
  return()=>{}
 },[screen,started,done]);
 useEffect(()=>{
  if(screen==='game'&&started&&!done){
   if(opponent>=100){
    clearInterval(timerRef.current); timerRef.current=null; setGameOverReason('opponent'); setDone(true); setScreen('gameover');
   }else if(time>=timeLimit){
    clearInterval(timerRef.current); timerRef.current=null; setGameOverReason('timeout'); setDone(true); setScreen('gameover');
   }
  }
 },[time,screen,started,done,timeLimit,opponent]);
 const begin=(n=1)=>{
    setNameInput('');
    setLevel(n);
    setTyped('');
    setTime(0);
    setStarted(false);
    setDone(false);
    setGameOverReason('timeout');
    setScreen('game');
    setTimeout(()=>inputRef.current?.focus(),50)
  };
 const finish=()=>{clearInterval(timerRef.current);timerRef.current=null;setDone(true);const s=Math.round(accuracy*0.55+wpm*2+Math.max(0,30-time)*.35);setScore(s);setBest(b=>Math.max(b,s));setScreen('certificate')};
 const handle=(e)=>{const v=e.target.value;if(!started&&v.length){setStarted(true)};setTyped(v);if(v===current.text)finish()};
 const next=()=>{if(level<10)begin(level+1);else setScreen('complete')};
 const startNameEntry=()=>{setNameInput('');setScreen('name')};
 const confirmName=()=>{const clean=nameInput.trim();if(!clean)return;setPlayerName(clean);begin(1)};
 const downloadCert=()=>{
  const c=document.createElement('canvas');
  c.width=1600;c.height=1000;
  const x=c.getContext('2d');

  const draw=()=>{
    x.clearRect(0,0,c.width,c.height);
    x.textAlign='center';
    x.textBaseline='alphabetic';

    // Warm game-page background.
    const bg=x.createLinearGradient(0,0,1600,1000);
    bg.addColorStop(0,'#fffaf3');
    bg.addColorStop(.62,'#f6e9da');
    bg.addColorStop(1,'#ead5bf');
    x.fillStyle=bg;x.fillRect(0,0,1600,1000);

    // Subtle light/shadow for depth.
    const glow=x.createRadialGradient(800,330,80,800,330,700);
    glow.addColorStop(0,'rgba(255,255,255,.82)');
    glow.addColorStop(1,'rgba(255,255,255,0)');
    x.fillStyle=glow;x.fillRect(0,0,1600,820);

    // Certificate paper and double border.
    x.fillStyle='rgba(255,252,247,.82)';
    x.fillRect(70,55,1460,790);
    x.strokeStyle='#f06417';x.lineWidth=6;
    x.strokeRect(55,40,1490,820);
    x.strokeStyle='rgba(240,100,23,.34)';x.lineWidth=2;
    x.strokeRect(75,60,1450,780);

    // Small orange corner accents.
    x.fillStyle='#f06417';
    [[95,80],[1505,80],[95,815],[1505,815]].forEach(([px,py])=>{
      x.fillRect(px-12,py-2,24,4);x.fillRect(px-2,py-12,4,24);
    });

    // Header logo. The certificate remains complete even if logo.png is unavailable.
    if(window.__certLogoReady){
      const logo=window.__certLogoReady;
      const maxW=205,maxH=72;
      const scale=Math.min(maxW/logo.width,maxH/logo.height);
      const lw=logo.width*scale,lh=logo.height*scale;
      x.drawImage(logo,800-lw/2,88,lw,lh);
    }else{
      x.fillStyle='#252d35';x.font='900 28px Arial';
      x.fillText('NEBULOID TECH',800,118);
    }

    x.fillStyle='#252d35';x.font='800 22px Arial';
    x.fillText('NEBULOID TECH STUDIO LLP',800,188);
    x.fillStyle='#6a625c';x.font='700 11px Arial';
    x.fillText('IDEAS. WIRED TO REALITY.',800,210);

    // Certificate heading.
    x.strokeStyle='#f06417';x.lineWidth=2;
    x.beginPath();x.moveTo(410,252);x.lineTo(675,252);x.stroke();
    x.beginPath();x.moveTo(925,252);x.lineTo(1190,252);x.stroke();

    x.fillStyle='#f06417';x.font='900 17px Arial';
    x.fillText('CERTIFICATE OF MASTERY',800,258);

    // Medal/badge.
    x.fillStyle='rgba(245,138,23,.16)';
    x.beginPath();x.arc(800,330,70,0,Math.PI*2);x.fill();
    x.fillStyle='#f58a17';
    x.beginPath();x.arc(800,330,56,0,Math.PI*2);x.fill();
    x.strokeStyle='#ffd19b';x.lineWidth=4;
    x.beginPath();x.arc(800,330,48,0,Math.PI*2);x.stroke();
    x.fillStyle='#fffaf3';x.font='900 28px Arial';
    x.fillText('★',800,340);

    x.fillStyle='#6a625c';x.font='800 12px Arial';
    x.fillText(`LEVEL ${level}`,800,418);

    // Main completion line.
    const levelText=`LEVEL ${level}`;
    const completeText='COMPLETE';
    x.font='900 70px Arial';
    const gap=22;
    const aW=x.measureText(levelText).width;
    const bW=x.measureText(completeText).width;
    const total=aW+gap+bW;
    const sx=800-total/2;
    x.fillStyle='#252d35';x.fillText(levelText,sx+aW/2,500);
    x.fillStyle='#f06417';x.fillText(completeText,sx+aW+gap+bW/2,500);

    // Player name.
    x.fillStyle='#6a625c';x.font='700 12px Arial';
    x.fillText('AWARDED TO',800,545);
    x.fillStyle='#252d35';x.font='900 29px Arial';
    x.fillText((playerName||'PLAYER').toUpperCase(),800,583);

    // Description.
    x.fillStyle='#5e5a56';x.font='500 19px Arial';
    x.fillText('You cleared another Nebuloid Speed Typing Battle level.',800,622);
    x.fillText('Your performance is recorded below.',800,649);

    // Metrics card.
    x.fillStyle='#fffdf9';x.strokeStyle='#e5c7a9';x.lineWidth=2;
    x.beginPath();x.roundRect(350,680,900,105,18,18);x.fill();x.stroke();

    x.fillStyle='#f06417';x.font='800 13px Arial';
    x.fillText('SCORE',500,713);
    x.fillText('ACCURACY',800,713);
    x.fillText('SPEED',1100,713);

    x.fillStyle='#252d35';x.font='900 27px Arial';
    x.fillText(String(score),500,752);
    x.fillText(`${accuracy}%`,800,752);
    x.fillText(`${wpm} WPM`,1100,752);

    // Footer wood strip ties the download to the game UI.
    x.fillStyle='#a76132';x.fillRect(0,900,1600,100);
    x.fillStyle='#d18b51';x.fillRect(0,900,1600,7);
    for(let i=0;i<16;i++){
      x.strokeStyle='rgba(70,32,14,.12)';x.lineWidth=2;
      x.beginPath();x.moveTo(i*110,910);x.lineTo(i*110+28,1000);x.stroke();
    }
    x.fillStyle='#fffaf3';x.font='800 15px Arial';
    x.fillText('NEBULOID TECH STUDIO LLP  •  SPEED TYPING BATTLE',800,955);

    const a=document.createElement('a');
    const safeName=(playerName||'player').trim().replace(/\s+/g,'-').toLowerCase();
    a.download=`${safeName}-level-${level}-certificate.png`;
    a.href=c.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Load the logo once, then draw the complete certificate. If it fails,
  // draw() still produces a complete certificate without the logo image.
  if(!window.__certLogoReady){
    const logo=new Image();
    logo.onload=()=>{window.__certLogoReady=logo;draw()};
    logo.onerror=()=>{window.__certLogoReady=null;draw()};
    logo.src='/logo.png';
  }else{
    draw();
  }
 };
 return <div className={screen==='home' ? 'min-h-screen bg-[#fbfbff] text-[#101827]' : 'h-screen w-screen overflow-hidden text-slate-100 grid-bg'}>
  {screen!=='home' && screen!=='name' && screen!=='game' && screen!=='certificate' && <header className="sticky top-0 z-20 flex h-[122px] items-center justify-center border-b border-[#e8e7f2] bg-white/90 px-5 backdrop-blur-xl">
   <div className="absolute left-7 top-5 flex h-[94px] w-[88px] flex-col items-center justify-center rounded-2xl border border-[#eeeef6] bg-white text-[#111827] shadow-[0_8px_28px_rgba(40,30,100,.09)]">
    <Volume2 size={31} className="text-violet-600"/><span className="mt-2 text-[11px] font-extrabold">SOUND</span>
   </div>
   <div className="flex items-center gap-4">
    <Swords size={52} strokeWidth={1.8} className="text-violet-700"/>
    <div className="text-left"><div className="text-[24px] font-black leading-none tracking-[.06em] text-[#152033]">SPEED TYPING</div><div className="mt-1 text-[17px] font-black tracking-[.28em] text-violet-600">BATTLE</div></div>
   </div>
   <div className="absolute right-7 top-5 flex h-[94px] w-[100px] flex-col items-center justify-center rounded-2xl border border-[#eeeef6] bg-white text-[#111827] shadow-[0_8px_28px_rgba(40,30,100,.09)]">
    <CalendarDays size={25} className="text-violet-600"/><span className="mt-2 text-[12px] font-extrabold">10 LEVELS</span>
   </div>
   <div className="absolute right-7 top-[118px] hidden h-[94px] w-[100px] flex-col items-center justify-center rounded-2xl border border-[#eeeef6] bg-white text-[#111827] shadow-[0_8px_28px_rgba(40,30,100,.09)] lg:flex">
    <HelpCircle size={31} className="text-violet-600"/><span className="mt-2 text-[12px] font-extrabold">HOW TO PLAY</span>
   </div>
  </header>}
  {screen==='home' ? <Home best={best} onStart={startNameEntry}/> : screen==='name' ? <NameEntry name={nameInput} setName={setNameInput} onStart={confirmName} onBack={()=>setScreen('home')}/> : <main className={screen==='game' || screen==='certificate' ? 'h-full w-full overflow-hidden p-0 m-0' : 'mx-auto w-full max-w-[1200px] px-5 py-8 sm:py-12'}>
   {screen==='game'&&<Game current={current} level={level} typed={typed} progress={progress} accuracy={accuracy} wpm={wpm} time={time} timeLimit={timeLimit} timeLeft={timeLeft} opponent={opponent} inputRef={inputRef} started={started} onChange={handle} onBack={()=>setScreen('home')}/>} 
   {screen==='gameover'&&<GameOver level={level} timeLimit={timeLimit} reason={gameOverReason} opponent={opponent} onRetry={()=>begin(level)} onBack={()=>setScreen('home')}/>} 
   {screen==='certificate'&&<Certificate playerName={playerName} level={level} score={score} accuracy={accuracy} wpm={wpm} onDownload={downloadCert} onNext={next} onReplay={()=>begin(level)}/>} 
   {screen==='complete'&&<Complete best={best} onRestart={()=>begin(1)}/>}
  </main>}
 </div>
}
function Home({onStart,best}){
 const [muted,setMuted]=useState(false);
 const [showHelp,setShowHelp]=useState(false);

 return <section className="relative h-screen w-screen overflow-hidden bg-[#eee3d6] text-[#25282b] speed-home">
  <style>{`
   .speed-home{isolation:isolate;font-family:Arial,Helvetica,sans-serif;}
   .speed-home .room{
    position:absolute;inset:0;
    background:
      radial-gradient(ellipse at 50% 36%,rgba(255,253,248,.98) 0%,rgba(249,240,229,.94) 34%,rgba(229,214,198,.82) 70%,rgba(204,184,164,.76) 100%);
   }
   .speed-home .room:before{
    content:"";position:absolute;inset:0;
    background:
      linear-gradient(90deg,rgba(255,248,235,.78),transparent 18%,transparent 82%,rgba(255,245,228,.55)),
      linear-gradient(115deg,rgba(255,255,255,.52) 0 19%,transparent 19% 100%);
    filter:blur(3px);
   }
   .speed-home .window-light{
    position:absolute;left:20%;top:-10%;width:30%;height:76%;
    background:linear-gradient(105deg,rgba(255,255,255,.72),rgba(255,255,255,0) 72%);
    transform:skewX(-10deg);filter:blur(9px);opacity:.72;
   }
   .speed-home .window-light.right{
    left:auto;right:16%;top:-8%;width:23%;height:64%;
    transform:skewX(8deg);opacity:.45;
   }
   .speed-home .wall-lines{
    position:absolute;inset:0 18% 27% 18%;
    background:
      linear-gradient(90deg,transparent 0 12%,rgba(75,61,50,.13) 12.2% 12.8%,transparent 13% 87%,rgba(75,61,50,.10) 87.2% 87.8%,transparent 88%),
      repeating-linear-gradient(90deg,transparent 0 20%,rgba(75,61,50,.055) 20.1% 20.5%,transparent 20.6% 40%);
    filter:blur(8px);opacity:.7;
   }
   .speed-home .floor{
    position:absolute;left:0;right:0;bottom:0;height:27%;
    background:
      repeating-linear-gradient(0deg,rgba(83,43,20,.13) 0 2px,transparent 2px 18px),
      repeating-linear-gradient(83deg,transparent 0 125px,rgba(255,211,157,.09) 127px 130px,transparent 132px 250px),
      linear-gradient(180deg,#c98549 0%,#a96332 44%,#7e4321 100%);
    box-shadow:inset 0 15px 25px rgba(71,36,17,.18);
   }
   .speed-home .floor:before{
    content:"";position:absolute;left:0;right:0;top:0;height:5px;
    background:rgba(255,208,151,.48);box-shadow:0 -5px 16px rgba(255,178,98,.3);
   }
   .speed-home .floor-glow{
    position:absolute;left:35%;bottom:0;width:31%;height:25%;
    background:radial-gradient(ellipse,rgba(255,180,90,.28),transparent 68%);
    filter:blur(7px);
   }
   .speed-home .game-floor-copy{
    position:absolute;bottom:10%;z-index:50;
    width:330px;color:#fff;
    font-family:inherit;
    pointer-events:none;
    text-shadow:0 2px 4px rgba(45,22,8,.55);
   }
   .speed-home .game-floor-copy.left{left:7%}
   .speed-home .game-floor-copy.right{right:7%;text-align:right}

   .speed-home .game-floor-kicker{
    display:inline-block;
    font-size:14px;font-weight:950;letter-spacing:.16em;
    color:#fff;margin-bottom:9px;
    text-shadow:0 2px 4px rgba(45,22,8,.65);
   }

   .speed-home .game-floor-title{
    font-size:36px;line-height:.94;font-weight:950;
    letter-spacing:-.035em;text-transform:uppercase;
    color:#fff;
    text-shadow:0 2px 4px rgba(45,22,8,.7);
   }

   .speed-home .game-floor-title span{
    color:#ff4b17;
    text-shadow:0 2px 4px rgba(55,20,5,.55);
   }

   .speed-home .game-floor-line{
    margin-top:14px;
    font-size:12px;font-weight:950;
    letter-spacing:.13em;color:#fff;
    text-shadow:0 2px 4px rgba(45,22,8,.7);
   }

   @media(max-width:900px){
    .speed-home .game-floor-copy{display:none}
   }

   .speed-home .side-copy{
    position:absolute;z-index:5;top:24%;width:300px;
   }
   .speed-home .side-copy.left{left:7.2%;text-align:left}
   .speed-home .side-copy.right{right:7.2%;text-align:left}
   .speed-home .side-icon{
    color:#f15a17;display:block;margin-bottom:10px;
   }
   .speed-home .side-title{
    font-size:42px;line-height:.91;font-weight:950;font-style:italic;letter-spacing:-.055em;
   }
   .speed-home .side-title span{color:#f15a17}
   .speed-home .side-rule{
    width:185px;height:3px;margin:20px 0 18px;background:linear-gradient(90deg,#f15a17,rgba(241,90,23,.08));
   }
   .speed-home .side-lines{
    font-size:15px;line-height:1.72;font-weight:600;letter-spacing:.16em;color:#4d4945;
   }
   .speed-home .center{
    position:relative;z-index:10;height:100%;width:100%;display:flex;flex-direction:column;
    align-items:center;justify-content:center;text-align:center;padding:1vh 24px 7vh;
   }
   .speed-home .brand{
    width:min(340px,25vw);height:auto;max-height:100px;object-fit:contain;
    filter:drop-shadow(0 4px 5px rgba(30,20,10,.16));margin-bottom:2vh;
   }
   .speed-home .keyboard-mark{position:relative;width:205px;height:82px;margin-bottom:2px}
   .speed-home .keyboard-body{
    position:absolute;left:38px;top:15px;width:132px;height:49px;
    border:5px solid #f15a17;border-radius:12px;
    transform:rotate(-8deg);box-sizing:border-box;
    background:rgba(255,255,255,.08);
   }
   .speed-home .keyboard-body:before{
    content:"";position:absolute;left:10px;right:9px;top:9px;height:22px;
    background:
      repeating-linear-gradient(90deg,#f15a17 0 7px,transparent 7px 11px),
      repeating-linear-gradient(90deg,#f15a17 0 7px,transparent 7px 11px);
    background-size:100% 8px,100% 8px;
    background-position:0 0,0 13px;
    background-repeat:no-repeat;
   }
   .speed-home .keyboard-body:after{
    content:"";position:absolute;left:47px;bottom:5px;width:32px;height:3px;
    border-radius:4px;background:#f15a17;
   }
   .speed-home .speed-line{
    position:absolute;height:4px;border-radius:4px;
    background:#f15a17;opacity:.9;
    transform-origin:right center;
   }
   .speed-home .speed-line.one{left:10px;top:36px;width:30px;transform:rotate(-10deg)}
   .speed-home .speed-line.two{left:3px;top:48px;width:25px;transform:rotate(-8deg)}
   .speed-home .speed-line.three{right:15px;top:22px;width:27px;transform:rotate(-28deg)}
   .speed-home h1{
    margin:0;font-size:clamp(68px,7.1vw,116px);line-height:.82;font-weight:950;font-style:italic;
    letter-spacing:-.065em;color:#24272b;
   }
   .speed-home h1 span{color:#ff5b18}
   .speed-home .tagline{
    margin-top:2vh;font-size:clamp(13px,1.25vw,20px);font-weight:600;letter-spacing:.13em;color:#4e4a47;
   }
   .speed-home .tagline b{color:#f15a17;padding:0 12px}
   .speed-home .start{
    position:relative;margin-top:3vh;width:270px;height:270px;border-radius:50%;border:5px solid rgba(255,255,255,.95);
    background:radial-gradient(circle at 34% 25%,#ffb72e 0%,#ff7b19 42%,#f45113 100%);
    color:#20252a;font-size:54px;font-weight:950;font-style:italic;letter-spacing:-.04em;
    box-shadow:0 12px 0 #c84b0c,0 24px 52px rgba(239,91,16,.42),inset 0 4px 14px rgba(255,255,255,.6);
    transition:transform .2s ease,box-shadow .2s ease;animation:homePulse 2s ease-in-out infinite;
   }
   .speed-home .start:before{
    content:"";position:absolute;inset:-12px;border:2px solid rgba(255,170,70,.55);border-radius:50%;
    animation:homeGlow 2s ease-in-out infinite;
   }
   .speed-home .start:after{
    content:"";position:absolute;inset:9px;border:1px solid rgba(255,255,255,.5);border-radius:50%;
   }
   .speed-home .start:hover{transform:translateY(-4px) scale(1.035);animation:none}
   .speed-home .start:active{transform:translateY(3px) scale(.98);animation:none}
   .speed-home .top-control{
    position:absolute;z-index:20;top:4.5%;display:flex;flex-direction:column;align-items:center;
    justify-content:center;color:#24272a;background:transparent;border:0;box-shadow:none;
    transition:transform .2s ease;
   }
   .speed-home .top-control:hover{transform:translateY(-2px)}
   .speed-home .top-control.left{left:3.2%}.speed-home .top-control.right{right:3.2%}
   .speed-home .top-control svg{color:#f15a17}
   .speed-home .top-control span{margin-top:8px;font-size:15px;font-weight:950;letter-spacing:.01em}
   @keyframes homePulse{0%,100%{box-shadow:0 12px 0 #c84b0c,0 24px 52px rgba(239,91,16,.38),inset 0 4px 14px rgba(255,255,255,.55)}50%{box-shadow:0 14px 0 #c84b0c,0 30px 64px rgba(239,91,16,.5),inset 0 4px 18px rgba(255,255,255,.68)}}
   @keyframes homeGlow{0%,100%{transform:scale(.96);opacity:.25}50%{transform:scale(1.04);opacity:.65}}
   @media(max-width:1050px){
    .speed-home .side-copy{width:220px}.speed-home .side-title{font-size:32px}.speed-home .side-lines{font-size:12px}
    .speed-home .side-copy.left{left:3%}.speed-home .side-copy.right{right:3%}
    .speed-home .plant{transform:scale(.8);transform-origin:bottom}
    .speed-home .start{width:230px;height:230px;font-size:46px}
   }
   @media(max-width:760px){
    .speed-home .side-copy{display:none}.speed-home .plant{opacity:.55;transform:scale(.62)}
    .speed-home .plant.left{left:-60px}.speed-home .plant.right{right:-60px}
    .speed-home .brand{width:230px}.speed-home h1{font-size:64px}
    .speed-home .tagline{font-size:11px;letter-spacing:.07em}.speed-home .tagline b{padding:0 5px}
    .speed-home .start{width:210px;height:210px;font-size:40px}
   }
   @media(max-height:760px) and (min-width:761px){
    .speed-home .brand{max-height:70px;margin-bottom:1vh}.speed-home .keyboard-mark{height:56px}
    .speed-home h1{font-size:78px}.speed-home .tagline{margin-top:1vh}
    .speed-home .start{width:205px;height:205px;margin-top:2vh;font-size:42px}
   }
  `}</style>

  <div className="room pointer-events-none"/>
  <div className="window-light pointer-events-none"/>
  <div className="window-light right pointer-events-none"/>
  <div className="wall-lines pointer-events-none"/>
  <div className="floor pointer-events-none"/>
  <div className="floor-glow pointer-events-none"/>

  <button onClick={()=>setMuted(v=>!v)} className="top-control left" aria-label={muted?'Unmute sound':'Mute sound'}>
   {muted?<VolumeX size={39}/>:<Volume2 size={39}/>}
   <span>SOUND</span>
  </button>

  <button onClick={()=>setShowHelp(true)} className="top-control right" aria-label="How to play">
   <HelpCircle size={39}/><span>HOW TO PLAY</span>
  </button>

  <div className="side-copy left pointer-events-none">
   <Keyboard size={70} strokeWidth={2.3} className="side-icon"/>
   <div className="side-title">TYPE<br/><span>FASTER</span><br/>EVERY DAY</div>
   <div className="side-rule"/>
   <div className="side-lines">SHARPEN YOUR FOCUS<br/>IMPROVE YOUR SKILLS<br/>SEE THE DIFFERENCE</div>
  </div>

  <div className="side-copy right pointer-events-none">
   <Zap size={70} strokeWidth={2.3} className="side-icon"/>
   <div className="side-title">SPEED<br/><span>BUILDS</span><br/>SUCCESS</div>
   <div className="side-rule"/>
   <div className="side-lines">PRACTICE MORE<br/>TYPE BETTER<br/>CHALLENGE YOURSELF</div>
  </div>

  <div className="game-floor-copy left pointer-events-none" aria-hidden="true">
   <div className="game-floor-kicker">READY. SET. TYPE.</div>
   <div className="game-floor-title">BUILD YOUR<br/><span>SPEED</span></div>
   <div className="game-floor-line">FOCUS &nbsp;•&nbsp; ACCURACY &nbsp;•&nbsp; SPEED</div>
  </div>
  <div className="game-floor-copy right pointer-events-none" aria-hidden="true">
   <div className="game-floor-kicker">YOUR NEXT CHALLENGE</div>
   <div className="game-floor-title">BEAT YOUR<br/><span>BEST</span></div>
   <div className="game-floor-line">TYPE &nbsp;•&nbsp; IMPROVE &nbsp;•&nbsp; REPEAT</div>
  </div>

  <div className="center">
   <img src="/logo.png" alt="Nebuloid Tech Studio" className="absolute top-6 left-1/2 -translate-x-1/2 brand" onError={e=>{e.currentTarget.style.display='none'}}/>

   <div className="keyboard-mark" aria-hidden="true">
    <div className="keyboard-body"/>
    <span className="speed-line one"/><span className="speed-line two"/><span className="speed-line three"/>
   </div>

   <h1>SPEED<br/><span>TYPING</span></h1>

   <div className="tagline">
    TEST YOUR MEMORY <b>•</b> TYPE FASTER <b>•</b> BEAT YOUR BEST
   </div>

   <button onClick={onStart} className="start">START</button>
  </div>

  {showHelp&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm" onClick={()=>setShowHelp(false)}>
   <div onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-white bg-[#fffaf3] p-7 text-left shadow-2xl">
    <div className="flex items-center gap-3"><div className="rounded-xl bg-orange-100 p-3 text-orange-600"><HelpCircle size={23}/></div><h2 className="text-xl font-black">How to play</h2></div>
    <div className="mt-5 space-y-3 text-sm leading-6 text-[#59677f]"><p>1. Press <b>Start</b> to begin.</p><p>2. Type the displayed sentence exactly as shown.</p><p>3. Complete all 10 levels and improve your typing speed.</p></div>
    <button onClick={()=>setShowHelp(false)} className="mt-6 w-full rounded-xl bg-[#f46616] px-4 py-3 font-bold text-white">Got it</button>
   </div>
  </div>}
 </section>
}

function NameEntry({name,setName,onStart,onBack, onToggleSound = () => {}, onHowToPlay = () => {}}){
 const inputRef=useRef(null);
 const [keyboardOpen,setKeyboardOpen]=useState(false);

 return <section className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden py-0">
  <style>{`.name-realistic{
    background:
      radial-gradient(circle at 50% 22%,rgba(255,255,255,.92),transparent 34%),
      linear-gradient(180deg,#f1e7dc 0%,#eee2d5 57%,#bf7842 57%,#8a4b28 100%);
   }
   .name-realistic:before{
    content:"";position:absolute;inset:0;
    background:
      linear-gradient(90deg,rgba(255,255,255,.22),transparent 28%,transparent 72%,rgba(255,255,255,.16)),
      linear-gradient(112deg,transparent 0 18%,rgba(255,255,255,.24) 18.5%,transparent 37%);
    pointer-events:none;
   }
   .name-realistic .desk{
    position:absolute;left:0;right:0;bottom:0;height:43%;
    background:
      repeating-linear-gradient(82deg,rgba(76,36,17,.09) 0 3px,transparent 3px 24px),
      linear-gradient(180deg,#bf7842,#99562e 45%,#75401f);
    box-shadow:inset 0 15px 28px rgba(63,30,14,.18);
   }
   .name-realistic .desk:before{
    content:"";position:absolute;left:0;right:0;top:0;height:5px;
    background:rgba(255,210,156,.32);
    box-shadow:0 -7px 18px rgba(255,170,80,.25);
   }
   .name-floor-copy{
    position:absolute;bottom:10%;z-index:5;width:300px;
    color:#fff;font-family:inherit;pointer-events:none;
    text-shadow:0 2px 4px rgba(45,22,8,.65);
   }
   .name-floor-copy.left{left:7%}
   .name-floor-copy.right{right:7%;text-align:right}
   .name-floor-kicker{
    font-size:12px;font-weight:900;letter-spacing:.17em;margin-bottom:7px;
    color:#fff;text-shadow:0 2px 4px rgba(45,22,8,.7);
   }
   .name-floor-title{
    font-size:29px;line-height:.95;font-weight:950;
    letter-spacing:-.035em;text-transform:uppercase;color:#fff;
    text-shadow:0 2px 4px rgba(45,22,8,.75);
   }
   .name-floor-title span{color:#ff4b17}
   .name-floor-line{
    margin-top:10px;font-size:10px;font-weight:900;letter-spacing:.13em;
    color:#fff;text-shadow:0 2px 4px rgba(45,22,8,.7);
   }
   .name-keyboard-icon{
    position:relative;width:145px;height:54px;color:#f15a24;
   }
   .name-keyboard-icon .kb-body{
    position:absolute;left:28px;top:9px;width:88px;height:35px;
    border:4px solid currentColor;border-radius:7px;
    transform:skewY(-7deg) rotate(-4deg);
    background:rgba(255,255,255,.12);
   }
   .name-keyboard-icon .kb-keys{
    display:grid;grid-template-columns:repeat(8,1fr);gap:2px;
    padding:5px 5px 2px;
   }
   .name-keyboard-icon .kb-keys b{
    display:block;height:4px;border-radius:1px;background:currentColor;
   }
   .name-keyboard-icon .kb-space{
    width:24px;height:4px;margin:1px auto 0;border-radius:2px;background:currentColor;
   }
   .name-keyboard-icon .kb-speed-lines{
    position:absolute;left:0;top:15px;display:flex;gap:4px;
    transform:rotate(-8deg);
   }
   .name-keyboard-icon .kb-speed-lines i{
    display:block;width:16px;height:3px;border-radius:3px;background:currentColor;
   }
   .name-keyboard-icon .kb-speed-lines i:nth-child(2){width:11px}
   .name-keyboard-icon .kb-speed-lines i:nth-child(3){width:7px}
   .name-keyboard-icon .kb-speed-line{
    position:absolute;right:0;top:10px;width:18px;height:3px;
    border-radius:3px;background:currentColor;transform:rotate(-12deg);
   }
   @media(max-width:900px){
    .name-floor-copy{display:none}
   }
   .name-main-content{transform:translateY(-70px);}
   @media(max-height:760px){.name-main-content{transform:translateY(-45px)}}
   .name-side-copy{
    position:absolute;z-index:15;top:28%;width:285px;
    color:#25282b;font-family:Arial,Helvetica,sans-serif;
    pointer-events:none;
   }
   .name-side-copy.left{left:7.2%;text-align:left}
   .name-side-copy.right{right:7.2%;text-align:left}
   .name-side-icon{
    color:#f15a17;display:block;margin-bottom:10px;
   }
   .name-side-title{
    font-size:40px;line-height:.91;font-weight:950;font-style:italic;
    letter-spacing:-.055em;
   }
   .name-side-title span{color:#f15a17}
   .name-side-rule{
    width:175px;height:3px;margin:18px 0 16px;
    background:linear-gradient(90deg,#f15a17,rgba(241,90,23,.08));
   }
   .name-side-lines{
    font-size:11px;line-height:1.8;font-weight:800;
    letter-spacing:.08em;color:#35302c;
   }
   @media(max-width:1050px){
    .name-side-copy{display:none}
   }
   .name-main-content{position:relative}
   .name-floating-keyboard{
    position:absolute;z-index:40;top:calc(100% + 9px);left:50%;
    transform:translateX(-50%);
    width:min(520px,82vw);padding:11px 13px 12px;
    border:2px solid rgba(238,101,34,.95);border-radius:14px;
    background:linear-gradient(180deg,#6f341b 0%,#4e2415 100%);
    box-shadow:0 9px 20px rgba(63,28,13,.28),inset 0 1px 0 rgba(255,173,103,.35);
   }
   .name-floating-keyboard .kb-row{
    display:flex;justify-content:center;gap:5px;margin-top:6px;
   }
   .name-floating-keyboard .kb-row:first-child{margin-top:0}
   .name-floating-keyboard .kb-key{
    appearance:none;-webkit-appearance:none;cursor:pointer;
    height:31px;min-width:35px;padding:0 6px;border:1px solid rgba(255,176,112,.45);
    border-radius:5px;background:linear-gradient(180deg,#ead0b9,#c99d7a);
    color:#3c2114;font-size:9px;font-weight:900;letter-spacing:.02em;
    box-shadow:0 2px 0 rgba(40,16,8,.3);
   }
   .name-floating-keyboard .kb-key.accent{
    color:#fff;border-color:#ff9a50;
    background:linear-gradient(180deg,#ff8a35,#ef4e1e);
   }
   .name-floating-keyboard .kb-key.wide{min-width:60px}
   .name-floating-keyboard .kb-key.space{min-width:175px}
   @media(max-width:700px){
    .name-floating-keyboard{width:min(360px,90vw);padding:7px 7px 8px}
    .name-floating-keyboard .kb-row{gap:2px;margin-top:3px}
    .name-floating-keyboard .kb-key{min-width:21px;height:20px;padding:0 3px;font-size:6px}
    .name-floating-keyboard .kb-key.wide{min-width:35px}
    .name-floating-keyboard .kb-key.space{min-width:98px}
   }
  `}</style>
  <button type="button" onClick={onToggleSound}
   className="absolute left-8 top-8 z-30 flex flex-col items-center gap-2 text-[#202020] hover:opacity-80 transition"
   aria-label="Sound">
   <span className="text-[#f15a24] text-4xl leading-none">◖))</span>
   <span className="text-sm font-black tracking-wide">SOUND</span>
  </button>
  <button type="button" onClick={onHowToPlay}
   className="absolute right-8 top-8 z-30 flex flex-col items-center gap-2 text-[#202020] hover:opacity-80 transition"
   aria-label="How to play">
   <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#f15a24] text-2xl font-black text-[#f15a24]">?</span>
   <span className="text-sm font-black tracking-wide">HOW TO PLAY</span>
  </button>

  <div className="name-side-copy left">
   <div className="name-side-title">TYPE<br/><span>FASTER</span><br/>EVERY DAY</div>
   <div className="name-side-rule"/>
   <div className="name-side-lines">SHARPEN YOUR FOCUS<br/>IMPROVE YOUR SKILLS<br/>SEE THE DIFFERENCE</div>
  </div>

  <div className="name-side-copy right">
   <div className="name-side-title">SPEED<br/><span>BUILDS</span><br/>SUCCESS</div>
   <div className="name-side-rule"/>
   <div className="name-side-lines">PRACTICE MORE<br/>TYPE BETTER<br/>CHALLENGE YOURSELF</div>
  </div>

  <div className="name-realistic absolute inset-0 overflow-hidden">
   <div className="desk"/>
   <div className="name-floor-copy left">
    <div className="name-floor-kicker">READY. SET. TYPE.</div>
    <div className="name-floor-title">BUILD YOUR<br/><span>SPEED</span></div>
    <div className="name-floor-line">FOCUS &nbsp;•&nbsp; ACCURACY &nbsp;•&nbsp; SPEED</div>
   </div>
   <div className="name-floor-copy right">
    <div className="name-floor-kicker">YOUR NEXT CHALLENGE</div>
    <div className="name-floor-title">BEAT YOUR<br/><span>BEST</span></div>
    <div className="name-floor-line">TYPE &nbsp;•&nbsp; IMPROVE &nbsp;•&nbsp; REPEAT</div>
   </div>
  </div>

  <div className="relative z-20 flex h-full w-full flex-col items-center justify-center px-5 pb-[7vh] pt-[13vh] text-center">
   <img src="/logo.png" alt="Nebuloid Tech Studio" className="absolute top-7 left-1/2 -translate-x-1/2 mb-2 h-16 w-auto max-w-[220px] object-contain sm:h-20" onError={e=>{e.currentTarget.style.display='none'}}/>
   <div className="name-main-content">
   <div className="name-keyboard-icon mx-auto mb-5" aria-hidden="true">
    <div className="kb-speed-lines"><i/><i/><i/></div>
    <div className="kb-body">
     <div className="kb-keys">{Array.from({length:24}).map((_,i)=><b key={i}/>)}</div>
     <div className="kb-space"/>
    </div>
    <div className="kb-speed-line"/>
   </div>
   <div className="text-[13px] font-black tracking-tight text-[#20252a] sm:text-[16px]">NEBULOID TECH STUDIO LLP</div>
   <div className="text-[8px] font-black tracking-[.32em] text-[#303238] sm:text-[10px]">IDEAS. WIRED TO REALITY.</div>

   <div className="mt-5 flex items-center justify-center gap-4 text-[10px] font-black tracking-[.28em] text-orange-600 sm:mt-6 sm:text-[11px]">
    <span className="h-px w-12 bg-orange-500/70"/><span>READY TO TYPE?</span><span className="h-px w-12 bg-orange-500/70"/>
   </div>
   <div className="mt-3 text-[48px] font-black italic leading-[.88] tracking-[-.055em] text-[#25292d] sm:text-[64px]">SPEED <span className="text-orange-600">TYPING</span></div>
      <div className="mt-3 flex items-center justify-center gap-3 text-[11px] font-black tracking-[.16em] text-[#35302c] sm:text-[13px]">
    <span>TEST YOUR MEMORY</span><b className="text-orange-600">•</b><span>TYPE FASTER</span><b className="text-orange-600">•</b><span>BEAT YOUR BEST</span>
   </div>
<p className="mt-3 text-[14px] font-medium tracking-[.08em] text-[#4d4a48] sm:text-[17px]">Enter your name to start the challenge.</p>

   <div className="relative mt-5 w-full max-w-[610px]">
    <UserRound size={23} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-orange-500"/>
    <input ref={inputRef} value={name} onFocus={()=>setKeyboardOpen(true)} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&name.trim())onStart()}} maxLength={30} placeholder="Enter your name" className="h-[68px] w-full rounded-2xl border-2 border-orange-300 bg-white/90 px-6 pl-14 text-left text-lg font-semibold text-[#263038] outline-none transition placeholder:text-[#8a8580] focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/15 sm:text-xl"/>
   </div>

   <div className="mt-4 flex w-full max-w-[610px] gap-3">
    <button onClick={onBack} className="flex h-[60px] w-[145px] items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white px-5 text-[16px] font-semibold text-[#303238] shadow-[0_10px_25px_rgba(55,30,15,.16)] transition hover:-translate-y-0.5 hover:bg-[#fffaf4]"><ChevronLeft size={21}/> Back</button>
    <button onClick={onStart} disabled={!name.trim()} className="group flex h-[60px] flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#ff8a19] to-[#ff4d18] px-7 text-[17px] font-extrabold text-white shadow-[0_12px_28px_rgba(245,91,20,.32)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(245,91,20,.4)] disabled:cursor-not-allowed disabled:opacity-45">Start Game <ArrowRight size={22} className="transition group-hover:translate-x-1"/></button>
   </div>
   {keyboardOpen && (
    <div className="name-floating-keyboard" aria-hidden="true">
     <div className="kb-row">
      {['Q','W','E','R','T','Y','U','I','O','P'].map((k,i)=><button type="button" key={k} onMouseDown={e=>e.preventDefault()} onClick={()=>setName(v=>v+k)} className={`kb-key ${i===0?'accent':''}`}>{k}</button>)}
     </div>
     <div className="kb-row">
      {['A','S','D','F','G','H','J','K','L'].map(k=><button type="button" key={k} onMouseDown={e=>e.preventDefault()} onClick={()=>setName(v=>v+k)} className="kb-key">{k}</button>)}
     </div>
     <div className="kb-row">
      {['Z','X','C','V','B','N','M'].map((k,i)=><button type="button" key={k} onMouseDown={e=>e.preventDefault()} onClick={()=>setName(v=>v+k)} className={`kb-key ${i===3?'accent':''}`}>{k}</button>)}
     </div>
     <div className="kb-row">
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>inputRef.current?.focus()} className="kb-key wide">SHIFT</button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>setName(v=>v+' ')} className="kb-key space">SPACE</button>
      <button type="button" onMouseDown={e=>e.preventDefault()} onClick={()=>onStart()} className="kb-key wide">ENTER</button>
     </div>
    </div>
   )}
  </div>
  </div>
 </section>
}
function BrightInfo({icon,title,text}){return <div className="rounded-2xl border border-[#ecebf4] bg-white p-6 text-left shadow-[0_8px_26px_rgba(45,35,110,.08)] transition hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(45,35,110,.11)]"><div className="mb-5 inline-flex rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 p-3 text-violet-600 shadow-sm">{React.cloneElement(icon,{size:23})}</div><h3 className="text-[17px] font-black text-[#111827]">{title}</h3><p className="mt-1.5 text-[15px] leading-6 text-[#60708a]">{text}</p></div>}
function Info({icon,title,text}){return <div className="rounded-2xl border border-white/10 bg-white/[.025] p-6 text-left"><div className="mb-4 inline-flex rounded-xl bg-violet-500/10 p-3 text-violet-300">{React.cloneElement(icon,{size:20})}</div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{text}</p></div>}
function Game({current,level,typed,progress,accuracy,wpm,time,timeLimit,timeLeft,opponent,inputRef,started,onChange,onBack}){
 const [keyboardOpen,setKeyboardOpen]=useState(false);
 const [keyboardPos,setKeyboardPos]=useState({x:null,y:null});
 const drag=useRef(null);
 const audioRef=useRef(null);
 const keys=[['Q','W','E','R','T','Y','U','I','O','P'],['A','S','D','F','G','H','J','K','L'],['Z','X','C','V','B','N','M']];

 // Every key gets its own short musical note. Web Audio keeps this lightweight
 // and works for both the physical keyboard and the floating on-screen keyboard.
 const playKeySound=(key)=>{
  try{
   const AudioCtx=window.AudioContext||window.webkitAudioContext;
   if(!AudioCtx)return;
   if(!audioRef.current)audioRef.current=new AudioCtx();
   const ctx=audioRef.current;
   if(ctx.state==='suspended')ctx.resume();

   const noteMap={
    '1':261.63,'2':277.18,'3':293.66,'4':311.13,'5':329.63,
    '6':349.23,'7':369.99,'8':392.00,'9':415.30,'0':440.00,
    Q:466.16,W:493.88,E:523.25,R:554.37,T:587.33,
    Y:622.25,U:659.25,I:698.46,O:739.99,P:783.99,
    A:830.61,S:880.00,D:932.33,F:987.77,G:1046.50,
    H:1108.73,J:1174.66,K:1244.51,L:1318.51,
    Z:1396.91,X:1479.98,C:1567.98,V:1661.22,B:1760.00,
    N:1864.66,M:1975.53
   };
   const special={SPACE:220,BACK:196,ENTER:329.63};
   const frequency=noteMap[key]||special[key]||440;
   const now=ctx.currentTime;
   const osc=ctx.createOscillator();
   const gain=ctx.createGain();
   osc.type=key==='BACK'?'triangle':'sine';
   osc.frequency.setValueAtTime(frequency,now);
   gain.gain.setValueAtTime(0.0001,now);
   gain.gain.exponentialRampToValueAtTime(0.055,now+0.008);
   gain.gain.exponentialRampToValueAtTime(0.0001,now+0.075);
   osc.connect(gain);
   gain.connect(ctx.destination);
   osc.start(now);
   osc.stop(now+0.085);
  }catch(_){}
 };

 const sendKey=(key)=>{
  playKeySound(key);
  if(key==='BACK'){onChange({target:{value:typed.slice(0,-1)}});return}
  if(key==='SPACE'){onChange({target:{value:typed+' '}});return}
  if(key==='ENTER'){return}
  onChange({target:{value:typed+key}});
 };
 const startDrag=(e)=>{
  e.preventDefault();
  const rect=e.currentTarget.parentElement.getBoundingClientRect();
  drag.current={sx:e.clientX,sy:e.clientY,x:rect.left,y:rect.top};
  const move=(ev)=>{
   if(!drag.current)return;
   setKeyboardPos({x:drag.current.x+(ev.clientX-drag.current.sx),y:drag.current.y+(ev.clientY-drag.current.sy)});
  };
  const up=()=>{drag.current=null;window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up)};
  window.addEventListener('pointermove',move);window.addEventListener('pointerup',up);
 };
 return <section className="relative h-full min-h-0 w-full overflow-hidden bg-[#efe1d3] font-sans">
  {/* Warm realistic room / desk backdrop built entirely with CSS. */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
   <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(255,248,235,.98),rgba(239,220,204,.9)_42%,rgba(204,171,143,.86)_100%)]"/>
   <div className="absolute inset-x-0 top-0 h-[67%] bg-[linear-gradient(105deg,rgba(255,247,231,.9),transparent_31%,rgba(255,245,226,.28)_58%,rgba(222,194,171,.32))]"/>
   <div className="absolute left-[-5%] top-[12%] h-[55%] w-[30%] rotate-[-5deg] bg-[linear-gradient(90deg,rgba(255,255,255,.58),rgba(255,255,255,.03))] blur-[1px]"/>
   <div className="absolute right-[6%] top-[8%] h-[250px] w-[175px] rotate-[-3deg] border-[9px] border-[#765f51]/55 bg-[#f4e9db]/55 shadow-[0_18px_30px_rgba(77,47,30,.16)]">
    <div className="m-3 flex h-[calc(100%-24px)] items-center justify-center bg-[#f6eee5]/70 text-center text-[20px] font-black leading-tight tracking-wide text-[#4f4a45]/55 blur-[1px]">PRACTICE<br/>TYPE<br/>IMPROVE<br/>REPEAT</div>
   </div>
   <div className="absolute right-[11%] top-[8%] h-[8px] w-[190px] rounded-full bg-white/45 blur-xl"/>
   <div className="absolute inset-x-0 bottom-0 h-[31%] bg-[linear-gradient(180deg,#d28d52_0%,#ad6330_25%,#7d421f_100%)] shadow-[inset_0_15px_30px_rgba(88,39,14,.18)]"/>
   <div className="absolute inset-x-0 bottom-[30.5%] h-[3px] bg-[#f2b47b]/65 shadow-[0_-2px_9px_rgba(255,196,139,.45)]"/>
   <div className="absolute inset-x-0 bottom-0 h-[28%] opacity-30 [background-image:repeating-linear-gradient(83deg,transparent_0,transparent_42px,rgba(73,34,16,.32)_43px,transparent_45px)]"/>
   {/* left decorative plant + cup — compact, centered and clean */}
   <div className="absolute bottom-[3%] left-[1.2%] h-[205px] w-[145px]">
    <div className="absolute bottom-0 left-[27px] h-[96px] w-[92px] rounded-[16px_16px_27px_27px] bg-gradient-to-b from-[#fffdf7] via-[#f3e7d7] to-[#d7c0a7] shadow-[6px_10px_16px_rgba(67,37,20,.22)]"/>
    <div className="absolute bottom-[91px] left-[35px] h-[6px] w-[76px] rounded-full bg-[#76533a]/35"/>

    <div className="absolute bottom-[89px] left-[71px] h-[78px] w-[4px] rounded-full bg-[#52733a]"/>
    <div className="absolute bottom-[89px] left-[70px] h-[65px] w-[4px] -rotate-[29deg] origin-bottom rounded-full bg-[#52733a]"/>
    <div className="absolute bottom-[89px] left-[72px] h-[62px] w-[4px] rotate-[30deg] origin-bottom rounded-full bg-[#52733a]"/>

    <span className="absolute bottom-[145px] left-[50px] h-[38px] w-[21px] -rotate-[38deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#82b55a] to-[#376f37]"/>
    <span className="absolute bottom-[132px] left-[33px] h-[35px] w-[20px] -rotate-[64deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#79aa50] to-[#356b36]"/>
    <span className="absolute bottom-[148px] left-[75px] h-[40px] w-[21px] rotate-[37deg] rounded-[0_100%_0_100%] bg-gradient-to-br from-[#7cad50] to-[#356c36]"/>
    <span className="absolute bottom-[131px] left-[91px] h-[34px] w-[19px] rotate-[63deg] rounded-[0_100%_0_100%] bg-gradient-to-br from-[#73a64c] to-[#316536]"/>
    <span className="absolute bottom-[160px] left-[62px] h-[38px] w-[20px] -rotate-[7deg] rounded-[100%_0_100%_0] bg-gradient-to-br from-[#8abb59] to-[#3b7539]"/>

    <div className="absolute bottom-[22px] left-[37px] w-[72px] text-center text-[10px] font-extrabold leading-[1.3] tracking-[.03em] text-[#493c31]">
     TYPE<br/>FASTER<br/>BE BETTER<br/><span className="text-[#f06417]">:)</span>
    </div>
   </div>

   {/* right books */}
   <div className="absolute bottom-[4%] right-[2%] w-[245px] space-y-1.5 text-center font-black">
    <div style={{color:"#17120f"}} className="h-[47px] rounded-[7px] bg-[#ef7d26] px-5 py-2 text-[19px] font-black shadow-[0_6px_8px_rgba(53,29,17,.24)]">TYPE</div>
    <div style={{color:"#ffffff"}} className="h-[47px] rounded-[7px] bg-[#252d35] px-5 py-2 text-[19px] font-black shadow-[0_6px_8px_rgba(53,29,17,.24)]">LEARN</div>
    <div style={{color:"#17120f"}} className="h-[47px] rounded-[7px] bg-[#ead5bf] px-5 py-2 text-[19px] font-black shadow-[0_6px_8px_rgba(53,29,17,.24)]">IMPROVE</div>
    <div style={{color:"#ffffff"}} className="h-[47px] rounded-[7px] bg-[#292d31] px-5 py-2 text-[19px] font-black shadow-[0_6px_8px_rgba(53,29,17,.24)]">REPEAT</div>
   </div>
   <div className="absolute bottom-[1%] right-[18%] h-12 w-48 rotate-[-7deg] rounded-full bg-[#6c442a]/20 blur-xl"/>
   {/* notebook and pen */}
   <div className="absolute bottom-[1%] left-[10%] h-[80px] w-[280px] -rotate-3 rounded-md bg-[#eee3d5] shadow-[0_12px_18px_rgba(62,31,16,.25)]"/>
   <div className="absolute bottom-[7%] left-[9%] h-[10px] w-[250px] rotate-[-8deg] rounded-full bg-[#1e2329] shadow-[0_5px_6px_rgba(30,20,10,.35)]"/>
   <div className="absolute left-[3%] top-[25%] grid grid-cols-3 gap-3 opacity-55">{Array.from({length:9}).map((_,i)=><span key={i} className="h-2.5 w-2.5 rounded-full bg-[#ef7d26]"/>)}</div>
   <div className="absolute right-[3%] bottom-[38%] h-44 w-44 rounded-full border-[18px] border-[#f4a56e]/35"/>
  </div>

  <div className="relative z-10 flex h-full min-h-0 flex-col px-6 pb-5 pt-5 sm:px-8 lg:px-12">
   <div className="flex items-start justify-between">
    <button onClick={onBack} className="rounded-2xl border border-[#d9c4b1] bg-white/90 px-7 py-4 text-[16px] font-black text-[#252d35] shadow-[0_8px_22px_rgba(76,43,25,.12)] backdrop-blur-md transition hover:-translate-y-0.5">← Exit</button>
    <div className="flex flex-col items-center">
     <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-16 w-auto max-w-[210px] object-contain drop-shadow-[0_5px_5px_rgba(30,20,10,.15)] sm:h-20"/>
    </div>
    <div className="rounded-2xl border border-[#d9c4b1] bg-white/90 px-6 py-3 text-center shadow-[0_8px_22px_rgba(76,43,25,.12)]">
     <div className="text-[12px] font-black tracking-[.16em] text-[#f06417]">LEVEL {level} / 10</div>
    </div>
   </div>

   <div className="mx-auto flex w-full max-w-[1240px] min-h-0 flex-1 flex-col items-center justify-center pb-1">
    <div className="flex items-center gap-4 text-[#f06417]">
     <span className="h-[3px] w-14 rounded-full bg-[#f06417]"/>
     <Keyboard size={62} strokeWidth={2.2} className="text-[#252d35] drop-shadow-[0_4px_4px_rgba(40,25,15,.18)]"/>
     <span className="h-[3px] w-14 rounded-full bg-[#f06417]"/>
    </div>
    <div className="mt-1 text-[clamp(42px,5vw,76px)] font-black italic leading-none tracking-[-.05em] text-[#252d35]">SPEED <span className="text-[#f06417]">TYPING</span></div>
    <div className="mt-1 flex items-center gap-5 text-[13px] font-black tracking-[.38em] text-[#252d35] sm:text-[16px]"><span className="h-[2px] w-12 bg-[#f06417]"/>BATTLE<span className="h-[2px] w-12 bg-[#f06417]"/></div>
    <div className="mt-2 text-[11px] font-black tracking-[.45em] text-[#f06417]">TYPE THE SENTENCE</div>

    <div className="mt-5 flex flex-wrap justify-center gap-3">
     <div className="rounded-2xl border border-white/80 bg-white/90 px-6 py-3 text-[18px] font-semibold shadow-[0_8px_20px_rgba(72,43,24,.12)]">⏱ {String(Math.floor(timeLeft/60)).padStart(2,'0')}:{String(timeLeft%60).padStart(2,'0')}</div>
     <div className="rounded-2xl border border-white/80 bg-white/90 px-6 py-3 text-[18px] font-semibold shadow-[0_8px_20px_rgba(72,43,24,.12)]">◎ {accuracy}%</div>
     <div className="rounded-2xl border border-white/80 bg-white/90 px-6 py-3 text-[18px] font-semibold shadow-[0_8px_20px_rgba(72,43,24,.12)]">ϟ {wpm} WPM</div>
    </div>

    <div className="mt-5 grid w-full gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
     <div>
      <div className="rounded-[25px] border border-[#ead9c9] bg-white/72 p-7 shadow-[0_18px_45px_rgba(72,43,24,.12)] backdrop-blur-sm sm:p-8">
       <div className="text-[clamp(19px,1.7vw,27px)] leading-[1.8] tracking-[.01em] text-[#526173]">
        {[...current.text].map((c,i)=><span key={i} className={i<typed.length?(typed[i]===c?'text-[#ef6418]':'text-[#dc3545] underline decoration-[#dc3545]'):(i===typed.length?'text-[#26313f]':'text-[#657487]')}>{c}</span>)}
       </div>
      </div>
      <div className="relative mt-5">
       <textarea ref={inputRef} value={typed} onChange={onChange} spellCheck="false" autoCapitalize="off" onFocus={()=>{}} className="h-[142px] w-full resize-none rounded-[24px] border-[2px] border-[#f06417] bg-white/92 p-7 pr-20 text-[20px] leading-8 text-[#526173] outline-none shadow-[0_10px_25px_rgba(72,43,24,.12)] placeholder:text-[#8a96a4] focus:ring-4 focus:ring-orange-200/40" placeholder="Start typing here…" disabled={typed===current.text}/>
       <button type="button" onClick={()=>setKeyboardOpen(v=>!v)} className="absolute bottom-6 right-6 grid h-12 w-12 place-items-center rounded-xl bg-[#fff3e9] text-[#f06417] shadow-sm transition hover:scale-105"><Keyboard size={28}/></button>
      </div>
      <div className="mt-3 flex justify-between text-[15px] font-bold text-[#f06417]"><span>{started?'Battle in progress':'The timer starts when you type.'}</span><span>{typed.length} / {current.text.length}</span></div>
     </div>

     <aside className="rounded-[25px] border-l-[2px] border-[#f0cdb6] bg-white/45 p-6 backdrop-blur-[1px]">
      <div className="flex items-center gap-3 text-[20px] font-black text-[#26313f]"><Swords size={27} className="text-[#f06417]"/> Opponent</div>
      <div className="mt-7 text-[20px] font-medium text-[#39495b]">CPU Racer <span className="float-right font-black text-[#f06417]">{opponent}%</span></div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e2dcd6]"><div className="h-full rounded-full bg-[#f06417] transition-all" style={{width:`${opponent}%`}}/></div>
      <p className="mt-5 text-[15px] leading-7 text-[#526173]">Your progress must reach 100% before the virtual opponent wins.</p>
      <div className="mt-7 border-t border-[#dfd3c9] pt-5 text-[14px] leading-7 text-[#526173] space-y-3">
       <p><span className="text-[#f06417]">•</span> Accuracy matters as much as speed.</p>
       <p><span className="text-[#f06417]">•</span> The sentence is based on Nebuloid's public studio information.</p>
       <p><span className="text-[#f06417]">•</span> Finish the level to unlock its certificate.</p>
      </div>
     </aside>
    </div>
   </div>
  </div>

  {keyboardOpen && <div className="fixed z-[100] w-[min(650px,calc(100vw-24px))] rounded-2xl border border-[#9d9aa0] bg-[#20242a]/96 p-2 shadow-[0_20px_50px_rgba(0,0,0,.35)] backdrop-blur-xl" style={keyboardPos.x===null?{left:'50%',bottom:'22px',transform:'translateX(-50%)'}:{left:keyboardPos.x,top:keyboardPos.y}}>
   <div onPointerDown={startDrag} className="flex cursor-move items-center justify-between px-2 py-1 text-[10px] font-black tracking-[.16em] text-white/65"><span>ON-SCREEN KEYBOARD</span><button type="button" onClick={()=>setKeyboardOpen(false)} className="grid h-6 w-6 place-items-center rounded bg-white/10 text-white">×</button></div>
   <div className="space-y-1.5">
    <div className="grid grid-cols-10 gap-1.5">{['1','2','3','4','5','6','7','8','9','0'].map(k=><button key={k} onClick={()=>sendKey(k)} className="h-9 rounded border border-white/10 bg-[#27313b] text-xs font-black text-white hover:bg-[#35414d]">{k}</button>)}</div>
    {keys.map((row,ri)=><div key={ri} className={`flex justify-center gap-1.5 ${ri===1?'px-4':''}`}>{row.map(k=><button key={k} onClick={()=>sendKey(k)} className="h-9 flex-1 rounded border border-white/10 bg-[#27313b] text-xs font-black text-white hover:bg-[#35414d]">{k}</button>)}</div>)}
    <div className="flex gap-1.5"><button onClick={()=>sendKey('BACK')} className="h-9 w-[28%] rounded border border-white/10 bg-[#27313b] text-xs font-black text-white">⌫</button><button onClick={()=>sendKey('SPACE')} className="h-9 flex-1 rounded border border-white/10 bg-[#27313b] text-xs font-black text-white">SPACE</button><button onClick={()=>sendKey('ENTER')} className="h-9 w-[28%] rounded border border-[#f06417]/60 bg-[#f06417] text-xs font-black text-white">ENTER ↵</button></div>
   </div>
  </div>}
 </section>
}
function Stat({icon,value}){return <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[.03] px-3 py-2 text-slate-300">{React.cloneElement(icon,{size:13})}{value}</div>}

function GameOver({level,timeLimit,reason,onRetry,onBack}){
 const lostToOpponent=reason==='opponent';
 const [muted,setMuted]=useState(false);
 const [showHelp,setShowHelp]=useState(false);
 return <section className="fixed inset-0 z-40 overflow-hidden bg-[#eadfd3] text-[#252525]">
  <style>{`
   .gameover-scene{position:absolute;inset:0;overflow:hidden;background:
    radial-gradient(circle at 50% 37%,rgba(255,247,235,.98) 0%,rgba(246,229,210,.94) 34%,rgba(218,190,163,.78) 68%,rgba(190,157,129,.82) 100%),
    linear-gradient(110deg,#d9c2af 0%,#f3e1ce 45%,#d1b49d 100%);}
   .gameover-scene:before{content:"";position:absolute;inset:0;background:
    linear-gradient(105deg,rgba(255,239,211,.78),transparent 30%,transparent 70%,rgba(255,235,207,.42)),
    radial-gradient(circle at 48% 12%,rgba(255,255,255,.62),transparent 30%);filter:blur(1px);}
   .gameover-desk{position:absolute;left:0;right:0;bottom:0;height:25%;background:
    repeating-linear-gradient(82deg,transparent 0 84px,rgba(91,48,26,.10) 85px 87px,transparent 88px 170px),
    linear-gradient(180deg,#c17b43 0%,#a95f31 35%,#77401f 100%);box-shadow:inset 0 10px 22px rgba(74,38,19,.18);}
   .gameover-desk:before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:rgba(255,215,169,.5);box-shadow:0 -7px 18px rgba(255,184,111,.35);}
   .gameover-frame{position:absolute;top:7%;width:180px;height:270px;border:10px solid rgba(59,46,40,.72);background:rgba(244,235,225,.5);box-shadow:0 14px 25px rgba(49,30,20,.24);}
   .gameover-frame:after{content:"PRACTICE\\A TYPE\\A IMPROVE\\A REPEAT";white-space:pre;display:block;text-align:center;padding-top:48px;font:800 22px/1.35 Arial;color:rgba(61,51,45,.72);filter:blur(1.4px);}
   .gameover-frame.left{left:8%;transform:rotate(-4deg);}.gameover-frame.right{right:7%;transform:rotate(3deg);}
   .gameover-window{position:absolute;left:28%;top:-8%;width:25%;height:72%;transform:rotate(8deg);background:linear-gradient(135deg,rgba(255,250,236,.82),rgba(255,250,236,0));filter:blur(3px);clip-path:polygon(0 0,100% 0,72% 100%,25% 100%);opacity:.85;}
   .gameover-window.two{left:42%;top:-5%;width:14%;height:65%;transform:rotate(7deg);opacity:.38;}
   .gameover-plant-left{position:absolute;left:-1%;bottom:19%;width:170px;height:250px;opacity:.9;}
   .gameover-plant-left i{position:absolute;bottom:0;left:50%;width:42px;height:125px;border-radius:100% 0 100% 0;background:linear-gradient(135deg,#6d9e45,#245d31);transform-origin:bottom center;box-shadow:inset -5px -7px 8px rgba(20,63,29,.15);}
   .gameover-plant-left i:nth-child(1){transform:translateX(-55px) rotate(-42deg)}.gameover-plant-left i:nth-child(2){transform:translateX(-22px) rotate(-18deg)}.gameover-plant-left i:nth-child(3){transform:translateX(18px) rotate(16deg)}.gameover-plant-left i:nth-child(4){transform:translateX(48px) rotate(38deg)}.gameover-plant-left i:nth-child(5){height:105px;transform:translateX(-5px) rotate(2deg)}
   .gameover-cup{position:absolute;left:-2px;bottom:12%;width:125px;height:165px;border-radius:12px 12px 38px 38px;background:linear-gradient(90deg,#d1c5b5,#fff9ee 38%,#ded0bf);box-shadow:0 18px 25px rgba(53,29,15,.3);}
   .gameover-cup:before{content:"";position:absolute;left:8px;top:-9px;width:109px;height:31px;border-radius:50%;background:radial-gradient(ellipse,#4b2d1e 0 40%,#d9cbbb 43% 61%,#fffaf0 63% 76%,#c4b6a5 78%);}
   .gameover-cup:after{content:"Type\\A Faster\\A Be Better\\A :)";white-space:pre;position:absolute;inset:58px 18px auto;text-align:center;font:700 16px/1.3 Arial;color:#302923;}
   .gameover-pen{position:absolute;left:0;bottom:5%;width:330px;height:16px;border-radius:12px;background:#1d2228;transform:rotate(-9deg);box-shadow:0 6px 8px rgba(20,16,12,.35);}
   .gameover-books{position:absolute;right:2%;bottom:17%;width:145px;height:210px;}
   .gameover-books:after{content:"GOOD\\A IDEAS\\A FASTER\\A :)";white-space:pre;position:absolute;inset:62px 12px auto;text-align:center;color:#f4e8db;font:800 18px/1.35 Arial;z-index:3;}
   .gameover-books .pot{position:absolute;inset:42px 0 0;border-radius:8px 8px 28px 28px;background:linear-gradient(90deg,#17191c,#373438 48%,#0f1113);box-shadow:0 16px 22px rgba(37,22,13,.35);}
   .gameover-books i{position:absolute;bottom:110px;width:23px;height:120px;border-radius:100% 0 100% 0;background:linear-gradient(135deg,#826c55,#25251f);z-index:4;transform-origin:bottom;}
   .gameover-books i:nth-child(1){left:24px;transform:rotate(-28deg)}.gameover-books i:nth-child(2){left:56px;transform:rotate(-5deg)}.gameover-books i:nth-child(3){right:25px;transform:rotate(25deg)}
   .gameover-laptop{position:absolute;right:-30px;bottom:-12px;width:360px;height:125px;transform:rotate(-7deg);}
   .gameover-laptop:before{content:"";position:absolute;left:20px;top:0;width:285px;height:92px;border-radius:8px 8px 3px 3px;background:linear-gradient(145deg,#55595d,#15181b 65%,#060708);box-shadow:inset 0 0 0 5px #64676a,0 8px 12px rgba(0,0,0,.25);}
   .gameover-laptop:after{content:"";position:absolute;left:0;bottom:0;width:360px;height:35px;border-radius:6px 6px 20px 20px;background:linear-gradient(#b6aaa0,#6c635d);box-shadow:0 7px 10px rgba(0,0,0,.2);}
   .gameover-control{position:absolute;z-index:30;top:4.5%;display:flex;height:98px;width:108px;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.9);border-radius:20px;background:rgba(255,255,255,.94);color:#20262d;box-shadow:0 12px 35px rgba(72,42,20,.18);backdrop-filter:blur(8px);}
   .gameover-control.left{left:1.8%}.gameover-control.right{right:1.8%}.gameover-control.help{top:17%;}
   .gameover-control span{margin-top:7px;font:900 12px Arial;}
   .gameover-main{position:relative;z-index:20;display:flex;height:100%;width:100%;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:3vh 20px 20vh;}
   .gameover-logo{height:92px;width:auto;max-width:230px;object-fit:contain;filter:drop-shadow(0 5px 5px rgba(30,20,10,.14));}
   .gameover-badge{position:relative;margin-top:22px;display:flex;height:122px;width:122px;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,180,116,.24);color:#f34d10;}
   .gameover-badge:before{content:"";position:absolute;inset:-10px;border-radius:50%;border:1px solid rgba(243,77,16,.13);}
   .gameover-badge:after{content:"";position:absolute;inset:-38px;background:radial-gradient(circle,rgba(255,161,94,.18),transparent 68%);z-index:-1;}
   .gameover-lines{display:flex;align-items:center;gap:22px;margin-top:18px;color:#f34d10;font:900 16px Arial;letter-spacing:.34em;}
   .gameover-lines b{display:block;width:64px;height:2px;background:#f34d10;}
   .gameover-title{margin-top:22px;font:900 clamp(52px,6vw,92px)/.95 Arial,sans-serif;letter-spacing:-.055em;color:#18212b;}
   .gameover-title .accent{color:#f34d10;}
   .gameover-sub{margin-top:18px;max-width:720px;font:500 clamp(18px,1.5vw,25px)/1.45 Arial,sans-serif;color:#46515c;}
   .gameover-actions{display:flex;gap:26px;margin-top:42px;}
   .gameover-actions button{height:72px;min-width:320px;border-radius:17px;font:700 21px Arial;display:flex;align-items:center;justify-content:center;gap:15px;transition:transform .2s,box-shadow .2s;}
   .gameover-actions button:hover{transform:translateY(-2px)}
   .gameover-retry{border:1px solid #fff;background:#fff;color:#171d24;box-shadow:0 10px 24px rgba(80,46,24,.16)}
   .gameover-exit{border:1px solid #ff6a27;background:linear-gradient(135deg,#ff6430,#f04a12);color:white;box-shadow:0 12px 25px rgba(239,79,20,.25)}
   @media(max-width:900px){.gameover-frame,.gameover-laptop,.gameover-books,.gameover-plant-left,.gameover-cup,.gameover-pen{display:none}.gameover-actions{gap:12px}.gameover-actions button{min-width:230px}.gameover-title{font-size:58px}}
   @media(max-width:620px){.gameover-control{height:72px;width:78px;top:2%}.gameover-control.help{top:12%}.gameover-control span{font-size:9px}.gameover-logo{height:68px}.gameover-badge{height:96px;width:96px}.gameover-lines{font-size:11px;gap:10px}.gameover-lines b{width:38px}.gameover-title{font-size:45px}.gameover-sub{font-size:15px}.gameover-actions{flex-direction:column;width:min(90vw,360px);margin-top:28px}.gameover-actions button{width:100%;min-width:0;height:62px;font-size:17px}}
  `}</style>

  <div className="gameover-scene">
   <div className="gameover-window"/><div className="gameover-window two"/>
   <div className="gameover-frame left"/><div className="gameover-frame right"/>
   <div className="gameover-desk"/>
   <div className="gameover-plant-left"><i/><i/><i/><i/><i/></div>
   <div className="gameover-cup"/><div className="gameover-pen"/>
   <div className="gameover-books"><i/><i/><i/><div className="pot"/></div>
   <div className="gameover-laptop"/>
  </div>

  <button onClick={()=>setMuted(v=>!v)} className="gameover-control left" aria-label={muted?'Unmute sound':'Mute sound'}>
   {muted?<VolumeX size={34} className="text-[#f34d10]"/>:<Volume2 size={34} className="text-[#f34d10]"/>}<span>SOUND</span>
  </button>
  <button className="gameover-control right" onClick={()=>{}}><CalendarDays size={30} className="text-[#f34d10]"/><span>10 LEVELS</span></button>
  <button onClick={()=>setShowHelp(true)} className="gameover-control right help"><HelpCircle size={34} className="text-[#f34d10]"/><span>HOW TO PLAY</span></button>

  <div className="gameover-main">
   <img src="/logo.png" alt="Nebuloid Tech Studio" className="gameover-logo" onError={e=>{e.currentTarget.style.display='none'}}/>
   <div className="gameover-badge">{lostToOpponent?<Swords size={66} strokeWidth={2.2}/>:<Timer size={66} strokeWidth={2.2}/>}</div>
   <div className="gameover-lines"><b/>{lostToOpponent?'OPPONENT WINS':"TIME'S UP"}<b/></div>
   <h1 className="gameover-title">Level {level} <span className="accent">{lostToOpponent?'Lost':'Expired'}</span></h1>
   <p className="gameover-sub">{lostToOpponent?<>The CPU Racer finished the sentence before you.<br/>Retry the level and try to outrun the opponent.</>:<>You ran out of the {timeLimit}-second time limit before finishing the sentence.<br/>Retry the level and beat the clock.</>}</p>
   <div className="gameover-actions">
    <button onClick={onRetry} className="gameover-retry"><RotateCcw size={32} className="text-[#f34d10]"/>Retry Level</button>
    <button onClick={onBack} className="gameover-exit"><ArrowRight size={32} className="rotate-180"/>Exit Battle</button>
   </div>
  </div>

  {showHelp&&<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-5 backdrop-blur-sm" onClick={()=>setShowHelp(false)}><div onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-white bg-[#fffaf3] p-7 text-left shadow-2xl"><div className="flex items-center gap-3"><div className="rounded-xl bg-orange-100 p-3 text-orange-600"><HelpCircle size={23}/></div><h2 className="text-xl font-black text-[#20252a]">How to play</h2></div><div className="mt-5 space-y-3 text-sm leading-6 text-[#59677f]"><p>1. Type the displayed sentence exactly as shown.</p><p>2. Complete the sentence before the CPU Racer.</p><p>3. Finish all 10 levels to complete the battle.</p></div><button onClick={()=>setShowHelp(false)} className="mt-6 w-full rounded-xl bg-[#f46616] px-4 py-3 font-bold text-white">Got it</button></div></div>}
 </section>
}
function Certificate({level,score,accuracy,wpm,onDownload,onNext,onReplay,playerName}){
 return <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#efe1d3] px-4 py-5 text-[#252d35] sm:px-8 lg:py-4">
  <style>{`
   .cert-scene{position:absolute;inset:0;overflow:hidden;background:radial-gradient(circle at 50% 24%,rgba(255,253,248,.98),rgba(247,236,222,.9) 43%,rgba(222,201,181,.72) 100%);}
   .cert-scene:after{content:"";position:absolute;left:0;right:0;bottom:0;height:18%;background:linear-gradient(180deg,#c98a55,#a96132 55%,#80451f);box-shadow:inset 0 12px 22px rgba(76,38,17,.18);}
   .cert-wall-light{position:absolute;left:20%;top:-12%;width:36%;height:78%;background:linear-gradient(75deg,rgba(255,255,255,.72),rgba(255,255,255,0));transform:skewX(9deg);filter:blur(8px);}
   .cert-frame-left,.cert-frame-right{position:absolute;top:8%;width:132px;height:238px;border:9px solid rgba(91,72,58,.25);background:rgba(245,237,226,.25);box-shadow:0 12px 25px rgba(61,40,26,.12);filter:blur(1.5px)}
   .cert-frame-left{left:8%;transform:rotate(-4deg)}.cert-frame-right{right:8%;transform:rotate(4deg)}
   .cert-frame-left:after,.cert-frame-right:after{content:"PRACTICE\\A TYPE\\A IMPROVE\\A REPEAT";white-space:pre;text-align:center;position:absolute;inset:30px 10px;font:800 16px/1.35 Arial,sans-serif;color:rgba(50,42,37,.38)}
   .cert-cup{position:absolute;left:1.5%;bottom:4%;width:98px;height:122px;border-radius:14px 14px 30px 30px;background:linear-gradient(90deg,#d9d0c4,#fffaf2 35%,#e8ded0);box-shadow:0 15px 22px rgba(56,32,18,.2);transform:rotate(-2deg);z-index:2}
   .cert-cup:before{content:"";position:absolute;left:7px;top:-8px;width:84px;height:23px;border-radius:50%;background:radial-gradient(ellipse at center,#4b2d1e 0 42%,#d8cbb9 44% 60%,#fff9ee 62% 78%)}
   .cert-cup:after{content:"Faster\\A Typing\\A Brighter\\A Future\\A :)";white-space:pre;text-align:center;position:absolute;left:12px;top:39px;width:74px;font:700 11px/1.25 Arial,sans-serif;color:#2f2923}
   .cert-books{position:absolute;right:0;bottom:4%;width:190px;height:155px;z-index:2}.cert-book{position:absolute;right:0;width:180px;height:36px;border-radius:3px 0 0 3px;box-shadow:0 6px 11px rgba(45,29,19,.2);font:800 15px/36px Arial,sans-serif;padding-left:24px}.cert-book.b1{bottom:117px;background:#e87929;color:#17120f}.cert-book.b2{bottom:80px;background:#302f32;color:#fff}.cert-book.b3{bottom:43px;background:#dfd0bf;color:#3b3029}.cert-book.b4{bottom:6px;background:#343338;color:#fff}
   .cert-pen{position:absolute;right:16%;bottom:3%;width:150px;height:10px;border-radius:10px;background:linear-gradient(90deg,#171717,#444,#111);transform:rotate(-10deg);box-shadow:0 4px 8px rgba(0,0,0,.22);z-index:2}
   .cert-main{position:relative;z-index:5;width:min(1060px,92vw);text-align:center;}
   .cert-paper{position:relative;margin:0 auto;width:min(980px,100%);padding:24px 46px 22px;border:2px solid #f06417;border-radius:10px;background:rgba(255,251,245,.82);box-shadow:0 20px 45px rgba(76,43,25,.13),inset 0 0 0 8px rgba(240,100,23,.055);backdrop-filter:blur(3px)}
   .cert-paper:before{content:"";position:absolute;inset:11px;border:1px solid rgba(240,100,23,.28);border-radius:5px;pointer-events:none}
   .cert-divider{height:1px;background:linear-gradient(90deg,transparent,#f06417,transparent)}
   .cert-medal{display:flex;height:72px;width:72px;align-items:center;justify-content:center;border-radius:50%;background:#f58a17;color:#fff;box-shadow:0 0 0 9px rgba(245,138,23,.13),0 10px 22px rgba(229,101,12,.18)}
   .cert-metrics{border:1px solid #e6c8ab;background:#fffdf9;border-radius:16px;overflow:hidden;box-shadow:0 8px 20px rgba(76,43,25,.06)}
   @media(max-width:700px){.cert-frame-left,.cert-frame-right,.cert-cup,.cert-books,.cert-pen{display:none}.cert-paper{padding:20px 16px 18px}.cert-main{width:96vw}}
  `}</style>

  <div className="cert-scene"/><div className="cert-wall-light"/>
  <div className="cert-frame-left"/><div className="cert-frame-right"/><div className="cert-cup"/>
  <div className="cert-books"><div className="cert-book b1">TYPE</div><div className="cert-book b2">LEARN</div><div className="cert-book b3">IMPROVE</div><div className="cert-book b4">REPEAT</div></div><div className="cert-pen"/>

  <div className="cert-main pop">
   <div className="cert-paper">
    <img src="/logo.png" alt="Nebuloid Tech Studio" className="mx-auto h-[54px] w-auto max-w-[190px] object-contain" onError={e=>{e.currentTarget.style.display='none'}}/>
    <div className="mt-1 text-[11px] font-black tracking-[.22em] text-[#252d35] sm:text-[13px]">NEBULOID TECH STUDIO LLP</div>
    <div className="mt-0.5 text-[8px] font-bold tracking-[.35em] text-[#766d65]">IDEAS. WIRED TO REALITY.</div>

    <div className="mx-auto mt-4 flex max-w-[620px] items-center gap-4"><span className="cert-divider flex-1"/><div className="cert-medal"><Trophy size={35} strokeWidth={1.8}/></div><span className="cert-divider flex-1"/></div>

    <div className="mt-3 text-[11px] font-black tracking-[.38em] text-[#f06417]">CERTIFICATE OF MASTERY</div>
    <div className="mt-2 text-[11px] font-bold tracking-[.25em] text-[#756d66]">THIS CERTIFICATE IS PROUDLY PRESENTED TO</div>
    <div className="mt-1 text-[26px] font-black uppercase tracking-[.02em] text-[#252d35] sm:text-[34px]">{playerName}</div>

    <div className="mx-auto mt-3 h-px w-[min(420px,70%)] bg-gradient-to-r from-transparent via-[#f06417] to-transparent"/>
    <div className="mt-3 flex items-baseline justify-center gap-3 text-[33px] font-black tracking-[-.04em] sm:text-[48px]"><span>LEVEL {level}</span><span className="text-[#f06417]">COMPLETE</span></div>
    <p className="mx-auto mt-2 max-w-[620px] text-[13px] leading-5 text-[#665f59] sm:text-[15px]">For successfully completing another level of the Nebuloid Speed Typing Battle with focus, accuracy and speed.</p>

    <div className="cert-metrics mx-auto mt-4 max-w-[650px]"><div className="grid grid-cols-3"><Metric label="SCORE" value={score}/><Metric label="ACCURACY" value={`${accuracy}%`}/><Metric label="SPEED" value={`${wpm} WPM`}/></div></div>

    <div className="mt-4 flex items-end justify-between px-5 sm:px-12">
     <div className="text-left"><div className="h-px w-32 bg-[#8f8175]"/><div className="mt-1 text-[9px] font-bold tracking-[.18em] text-[#71675f]">PLAYER</div></div>
     <div className="text-right"><div className="h-px w-32 bg-[#8f8175]"/><div className="mt-1 text-[9px] font-bold tracking-[.18em] text-[#71675f]">NEBULOID TECH</div></div>
    </div>
   </div>

   <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row">
    <button onClick={onDownload} className="flex min-w-[230px] items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#ff5b23] to-[#ff3d12] px-7 py-3.5 text-[16px] font-bold text-white shadow-[0_9px_20px_rgba(236,75,18,.24)] transition hover:-translate-y-1"><Download size={19}/> Download Certificate</button>
    <button onClick={onReplay} className="flex min-w-[210px] items-center justify-center gap-3 rounded-2xl bg-white/95 px-7 py-3.5 text-[16px] font-semibold text-[#222] shadow-[0_7px_18px_rgba(70,45,25,.12)] transition hover:-translate-y-1"><RotateCcw size={19} className="text-[#f06417]"/> Replay Level</button>
   </div>
   <button onClick={onNext} className="mt-2 inline-flex h-[48px] min-w-[225px] items-center justify-center gap-2 rounded-2xl border border-[#f06417] bg-white px-7 text-[15px] font-extrabold text-[#252d35] shadow-[0_8px_20px_rgba(76,43,25,.12)] transition hover:-translate-y-0.5 hover:bg-[#fff7ef]"><span>{level<10?`Continue to Level ${level+1}`:'View Final Results'}</span><ArrowRight size={18} className="text-[#f06417]"/></button>
  </div>
 </section>
}
function Metric({label,value}){
 return <div className="border-r border-[#f06417]/60 p-3 last:border-0 sm:p-4">
  <div className="text-[10px] font-bold tracking-[.28em] text-[#f06417]">{label}</div>
  <div className="mt-1 text-[29px] font-black text-[#252d35] sm:text-[34px]">{value}</div>
 </div>
}
function Complete({best,onRestart}){return <section className="pop mx-auto max-w-2xl py-10 text-center sm:py-20"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-violet-500/10 text-violet-300 glow"><CheckCircle2 size={50}/></div><p className="mt-8 text-xs font-bold tracking-[.35em] text-violet-300">BATTLE COMPLETE</p><h1 className="mt-3 text-5xl font-black sm:text-7xl">You mastered<br/><span className="text-violet-400">all 10 levels.</span></h1><p className="mt-6 text-slate-400">Every certificate is available to download after its level. Your best score this session was <b className="text-white">{best}</b>.</p><button onClick={onRestart} className="mt-9 rounded-2xl bg-violet-600 px-7 py-4 font-bold hover:bg-violet-500">Battle Again</button></section>}
createRoot(document.getElementById('root')).render(<App/>);
