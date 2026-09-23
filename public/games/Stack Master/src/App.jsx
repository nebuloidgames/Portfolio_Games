import React, { useCallback, useEffect, useRef, useState } from "react";

const LEVELS = [
  { level: 1, target: 5, speed: 2.0 }, { level: 2, target: 7, speed: 2.5 },
  { level: 3, target: 9, speed: 3.0 }, { level: 4, target: 11, speed: 3.5 },
  { level: 5, target: 13, speed: 4.0 }, { level: 6, target: 15, speed: 4.5 },
  { level: 7, target: 17, speed: 5.0 }, { level: 8, target: 19, speed: 5.5 },
  { level: 9, target: 22, speed: 6.0 }, { level: 10, target: 25, speed: 6.5 },
];

const GAME_WIDTH = 560, GAME_HEIGHT = 520, BLOCK_HEIGHT = 104, BASE_WIDTH = 330;

export default function App() {
  const [screen,setScreen]=useState("home"), [playerName,setPlayerName]=useState("");
  const [showHowToPlay,setShowHowToPlay]=useState(false);
  const [soundOn,setSoundOn]=useState(true);
  const [showKeyboard,setShowKeyboard]=useState(false);
  const [keyboardPos,setKeyboardPos]=useState({x:null,y:null});
  const keyboardDragRef=useRef(null);
  const [levelIndex,setLevelIndex]=useState(0), [score,setScore]=useState(0);
  const [combo,setCombo]=useState(0), [blocks,setBlocks]=useState([]);
  const [currentBlock,setCurrentBlock]=useState(null), [dropping,setDropping]=useState(false);
  const [message,setMessage]=useState("");
  const directionRef=useRef(1), rafRef=useRef(null);
  const audioCtxRef=useRef(null);
  const masterGainRef=useRef(null);

  const playStackSound=useCallback(()=>{
    try{
      const AudioContext=window.AudioContext||window.webkitAudioContext;
      if(!AudioContext) return;
      const ctx=audioCtxRef.current||new AudioContext();
      audioCtxRef.current=ctx;
      if(ctx.state==="suspended") ctx.resume();

      if(!masterGainRef.current){
        const master=ctx.createGain();
        master.gain.value=1.0;
        master.connect(ctx.destination);
        masterGainRef.current=master;
      }

      const now=ctx.currentTime;
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();

      osc.type="triangle";
      osc.frequency.setValueAtTime(190,now);
      osc.frequency.exponentialRampToValueAtTime(100,now+0.14);

      gain.gain.setValueAtTime(0.0001,now);
      gain.gain.exponentialRampToValueAtTime(0.65,now+0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+0.20);

      osc.connect(gain);
      gain.connect(masterGainRef.current);
      osc.start(now);
      osc.stop(now+0.21);
    }catch(e){}
  },[]);

  const level=LEVELS[levelIndex];

  const resetLevel=useCallback(()=>{
    const baseLeft=(GAME_WIDTH-BASE_WIDTH)/2;
    setBlocks([{left:baseLeft,width:BASE_WIDTH}]);
    setCurrentBlock({left:0,width:BASE_WIDTH});
    directionRef.current=1; setDropping(false); setCombo(0); setMessage("");
  },[]);

  useEffect(()=>{ if(screen==="playing") resetLevel(); },[screen,levelIndex,resetLevel]);

  useEffect(()=>{
    if(screen!=="playing"||dropping||!currentBlock) return;
    let last=performance.now();
    const tick=(now)=>{
      const delta=Math.min((now-last)/16.67,2); last=now;
      setCurrentBlock(prev=>{
        if(!prev) return prev;
        let left=prev.left+directionRef.current*level.speed*delta;
        const maxLeft=Math.max(0,GAME_WIDTH-prev.width);
        if(left<=0){left=0;directionRef.current=1;}
        if(left>=maxLeft){left=maxLeft;directionRef.current=-1;}
        return {...prev,left};
      });
      rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(rafRef.current);
  },[screen,dropping,currentBlock,level.speed]);

  const dropBlock=useCallback(()=>{
    if(screen!=="playing"||dropping||!currentBlock) return;

    setDropping(true);

    const previous=blocks[blocks.length-1];
    const left=Math.max(currentBlock.left,previous.left);
    const right=Math.min(currentBlock.left+currentBlock.width,previous.left+previous.width);
    const overlap=right-left;

    if(overlap<=0){
      setMessage("MISS!");
      setTimeout(()=>setScreen("gameover"),450);
      return;
    }

    // Play the landing sound only after a valid stack/overlap is detected.
    playStackSound();

    const perfect=
      Math.abs(currentBlock.left-previous.left)<=7 &&
      Math.abs(
        (currentBlock.left+currentBlock.width)-
        (previous.left+previous.width)
      )<=7;

    const newBlock={left,width:overlap};
    const newStackLength=blocks.length+1;

    // Keep the moving block separate while it visibly falls.
    // The landed copy is committed only after the drop animation completes.
    setScore(s=>s+(perfect?25:10)+(perfect?combo*5:0));
    setCombo(c=>perfect?c+1:0);
    setMessage(perfect?"PERFECT!":"NICE STACK!");

    setTimeout(()=>{
      setBlocks(prev=>[...prev,newBlock]);

      if(newStackLength>=level.target){
        setCurrentBlock(null);
        setDropping(false);
        setMessage(perfect?"PERFECT!":"NICE STACK!");
        setTimeout(()=>setScreen("complete"),260);
        return;
      }

      const d=directionRef.current;
      setCurrentBlock({
        left:d===1?0:GAME_WIDTH-overlap,
        width:overlap
      });
      setDropping(false);
      setMessage("");
    },420);
  },[
    screen,dropping,currentBlock,blocks,combo,level.target,playStackSound
  ]);

  useEffect(()=>{
    const key=e=>{
      if(screen==="playing"&&(e.code==="Space"||e.key==="Enter")){e.preventDefault();dropBlock();}
    };
    window.addEventListener("keydown",key); return()=>window.removeEventListener("keydown",key);
  },[screen,dropBlock]);

  const home=()=>{cancelAnimationFrame(rafRef.current);setShowKeyboard(false);setKeyboardPos({x:null,y:null});setScreen("home");setScore(0);setCombo(0);setBlocks([]);setCurrentBlock(null);};
  const startGame=()=>{setShowKeyboard(false);setKeyboardPos({x:null,y:null});setScreen("name");};
  const submitName=()=>{if(playerName.trim()){setLevelIndex(0);setScore(0);setScreen("intro");}};
  const retry=()=>{
    cancelAnimationFrame(rafRef.current);
    setScore(0);
    setCombo(0);
    setBlocks([]);
    setCurrentBlock(null);
    setDropping(false);
    setMessage("");
    setScreen("playing");
  };
  const nextLevel=()=>{if(levelIndex===9)setScreen("finished");else{setLevelIndex(v=>v+1);setScreen("intro");}};

  const keyboardRows=[
    ["1","2","3","4","5","6","7","8","9","0"],
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"]
  ];
  const typeKeyboardKey=(key)=>{
    if(key==="⌫"){setPlayerName(v=>v.slice(0,-1));return;}
    if(key==="SPACE"){setPlayerName(v=>v.length<30?v+" ":v);return;}
    if(key==="ENTER"){submitName();return;}
    setPlayerName(v=>v.length<30?v+key:v);
  };
  const beginKeyboardDrag=(e)=>{
    const p=e.touches?.[0]||e;
    const rect=e.currentTarget.parentElement.getBoundingClientRect();
    keyboardDragRef.current={sx:p.clientX,sy:p.clientY,bx:rect.left,by:rect.top};
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const moveKeyboardDrag=(e)=>{
    const d=keyboardDragRef.current;if(!d)return;
    const p=e.touches?.[0]||e;
    setKeyboardPos({x:Math.max(8,d.bx+p.clientX-d.sx),y:Math.max(8,d.by+p.clientY-d.sy)});
  };
  const endKeyboardDrag=()=>{keyboardDragRef.current=null;};

  useEffect(()=>{ if(screen!=="name") setShowKeyboard(false); },[screen]);

  const page="min-h-screen bg-white text-slate-900 flex items-center justify-center p-4";
  const card="w-full max-w-5xl min-h-[650px] rounded-[34px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.12)]";

  if(screen==="home") return <div className="stack-home relative h-screen w-full overflow-hidden bg-[#159de8] text-white">
    <style>{`
      @keyframes stackFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      @keyframes stackPulse { 0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(52,211,255,.32),0 18px 45px rgba(3,39,150,.35)} 50%{transform:scale(1.035);box-shadow:0 0 0 13px rgba(52,211,255,0),0 22px 55px rgba(3,39,150,.42)} }
      @keyframes ringSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes cloudDrift { 0%,100%{transform:translateX(0)} 50%{transform:translateX(18px)} }
      @keyframes shimmer { 0%{background-position:-220% 0} 100%{background-position:220% 0} }
      @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      .stack-start{animation:stackPulse 2.1s ease-in-out infinite;}
      .stack-start:hover{animation:stackPulse 1.2s ease-in-out infinite;transform:scale(1.055);}
      .stack-ring{animation:ringSpin 12s linear infinite;}
      .stack-cloud{animation:cloudDrift 8s ease-in-out infinite;}
      .stack-cloud-slow{animation:cloudDrift 11s ease-in-out infinite reverse;}
      .stack-logo{filter:brightness(0) invert(1) drop-shadow(0 3px 5px rgba(0,65,150,.22));}
      .stack-title{font-family:Arial Black,Impact,sans-serif;text-shadow:0 7px 0 #102d91,0 10px 20px rgba(0,34,112,.28);}
      .stack-title-master{background:linear-gradient(180deg,#9ffbff 0%,#20d9f2 46%,#06a9e6 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
      .stack-cta{background:linear-gradient(110deg,#ffffff 0%,#ffffff 38%,#c9faff 50%,#ffffff 62%,#ffffff 100%);background-size:220% 100%;animation:shimmer 3.5s linear infinite;}
      @media (max-height:760px){.stack-home-main{padding-top:18px!important}.stack-logo-wrap{height:88px!important}.stack-logo{height:72px!important}.stack-title-wrap{margin-top:4px!important}.stack-title{font-size:clamp(46px,8vw,92px)!important}.stack-start-wrap{margin-top:12px!important}.stack-how{margin-top:10px!important}.stack-platform{height:64px!important}}
    `}</style>

    {/* sky */}
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#0d98e8_0%,#23b7f3_46%,#73dcf6_100%)]" />
    <div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(122,226,246,.05),rgba(13,113,181,.18))]" />

    {/* soft clouds */}
    <div className="stack-cloud pointer-events-none absolute -left-16 top-[-35px] h-[190px] w-[440px] opacity-90">
      <span className="absolute left-12 top-16 h-28 w-52 rounded-full bg-white/85 blur-[2px]" />
      <span className="absolute left-28 top-4 h-32 w-36 rounded-full bg-white/90" />
      <span className="absolute left-48 top-22 h-28 w-44 rounded-full bg-white/88" />
      <span className="absolute left-0 top-28 h-24 w-60 rounded-full bg-white/82" />
    </div>
    <div className="stack-cloud-slow pointer-events-none absolute right-[-70px] top-[-48px] h-[190px] w-[470px] opacity-90">
      <span className="absolute right-20 top-15 h-28 w-56 rounded-full bg-white/86" />
      <span className="absolute right-40 top-0 h-36 w-40 rounded-full bg-white/92" />
      <span className="absolute right-0 top-30 h-24 w-64 rounded-full bg-white/82" />
    </div>
    <div className="stack-cloud-slow pointer-events-none absolute -left-20 top-[27%] h-40 w-80 opacity-80">
      <span className="absolute left-0 top-16 h-24 w-48 rounded-full bg-white/72 blur-[2px]" />
      <span className="absolute left-28 top-2 h-32 w-32 rounded-full bg-white/78" />
      <span className="absolute left-44 top-28 h-20 w-40 rounded-full bg-white/68" />
    </div>

    {/* distant skyline */}
    <div className="pointer-events-none absolute inset-x-0 bottom-[20%] h-[30%] opacity-45 blur-[1px]">
      <div className="absolute bottom-0 left-[3%] h-[55%] w-[8%] bg-[#4aaed5]" />
      <div className="absolute bottom-0 left-[13%] h-[78%] w-[6%] bg-[#56b9db]" />
      <div className="absolute bottom-0 left-[21%] h-[48%] w-[8%] bg-[#5db8d8]" />
      <div className="absolute bottom-0 left-[31%] h-[68%] w-[6%] bg-[#4faed2]" />
      <div className="absolute bottom-0 left-[42%] h-[42%] w-[9%] bg-[#59b8d9]" />
      <div className="absolute bottom-0 left-[54%] h-[63%] w-[7%] bg-[#4eaed2]" />
      <div className="absolute bottom-0 left-[65%] h-[50%] w-[9%] bg-[#55b6d7]" />
      <div className="absolute bottom-0 left-[77%] h-[73%] w-[6%] bg-[#4daed4]" />
      <div className="absolute bottom-0 left-[88%] h-[54%] w-[8%] bg-[#57b8d9]" />
      <div className="absolute bottom-[65%] left-[82%] h-[4px] w-[15%] rotate-[-10deg] bg-[#499fc8]" />
      <div className="absolute bottom-[63%] left-[89%] h-[55%] w-[3px] bg-[#499fc8]" />
    </div>

    {/* greenery */}
    <div className="pointer-events-none absolute inset-x-0 bottom-[12%] h-[26%]">
      <div className="absolute bottom-0 left-[5%] h-24 w-44 rounded-[50%] bg-[#39ad58] blur-[1px]" />
      <div className="absolute bottom-0 left-[11%] h-36 w-52 rounded-[50%] bg-[#49c85c]" />
      <div className="absolute bottom-0 left-[18%] h-28 w-44 rounded-[50%] bg-[#31ad54]" />
      <div className="absolute bottom-0 right-[7%] h-28 w-48 rounded-[50%] bg-[#43bf5a]" />
      <div className="absolute bottom-0 right-[15%] h-40 w-56 rounded-[50%] bg-[#35ad51]" />
      <div className="absolute bottom-0 right-[23%] h-24 w-40 rounded-[50%] bg-[#50c85e]" />
    </div>

    {/* construction towers / containers */}
    <div className="pointer-events-none absolute bottom-[9.5%] left-0 h-[48%] w-[125px] sm:w-[150px]">
      <div className="absolute left-0 top-0 h-9 w-full bg-[#ffb514] shadow-[0_5px_0_#d98300]" />
      <div className="absolute left-4 top-9 h-[78%] w-5 bg-[#263554] rotate-[0deg]" />
      <div className="absolute right-4 top-9 h-[78%] w-5 bg-[#263554]" />
      <div className="absolute left-0 top-[27%] h-5 w-full rotate-[35deg] bg-[#263554]" />
      <div className="absolute left-0 top-[55%] h-5 w-full rotate-[-35deg] bg-[#263554]" />
      <div className="absolute left-0 bottom-0 h-[31%] w-[92%] rounded-r-md bg-[#1472e5] shadow-inner" />
      <div className="absolute left-0 bottom-[31%] h-[5%] w-[92%] bg-[#0d56b8]" />
    </div>
    <div className="pointer-events-none absolute bottom-[9.5%] right-0 h-[47%] w-[125px] sm:w-[150px]">
      <div className="absolute right-0 top-0 h-9 w-full bg-[#ffb514] shadow-[0_5px_0_#d98300]" />
      <div className="absolute left-4 top-9 h-[78%] w-5 bg-[#263554]" />
      <div className="absolute right-4 top-9 h-[78%] w-5 bg-[#263554]" />
      <div className="absolute right-0 top-[27%] h-5 w-full rotate-[-35deg] bg-[#263554]" />
      <div className="absolute right-0 top-[55%] h-5 w-full rotate-[35deg] bg-[#263554]" />
      <div className="absolute right-0 bottom-0 h-[31%] w-[92%] rounded-l-md bg-[#f28b16] shadow-inner" />
      <div className="absolute right-0 bottom-[31%] h-[5%] w-[92%] bg-[#cc6410]" />
    </div>

    {/* top micro-copy */}
    <div className="absolute left-7 top-[12%] z-20 hidden text-left text-[14px] font-bold leading-[1.7] tracking-[0.24em] text-white/95 sm:block md:left-[4.5%] md:text-[16px]">
      BUILD<br/>STACK<br/>IMPROVE
      <div className="mt-3 h-[3px] w-10 bg-cyan-300" />
    </div>
    <div className="absolute right-7 top-[12%] z-20 hidden text-right text-[14px] font-bold leading-[1.7] tracking-[0.24em] text-white/95 sm:block md:right-[4.5%] md:text-[16px]">
      PLAY<br/>SOLVE<br/>ENJOY
      <div className="ml-auto mt-3 h-[3px] w-10 bg-cyan-300" />
    </div>

    <main className="stack-home-main relative z-10 mx-auto flex min-h-screen w-[94vw] max-w-[1240px] flex-col items-center px-4 pt-6 text-center">
      {/* studio logo */}
      <div className="stack-logo-wrap flex h-[112px] items-center justify-center sm:h-[126px]">
        <img src="/logo.png" alt="Nebuloid Tech Studio" className="stack-logo h-[104px] w-auto object-contain sm:h-[92px]" />
      </div>
      <div className="-mt-2 flex items-center gap-3 text-[9px] font-bold tracking-[0.48em] text-white/90 sm:text-[11px]">
        <span className="h-[2px] w-9 bg-cyan-300/90" /> NEBULOID TECH <span className="h-[2px] w-9 bg-cyan-300/90" />
      </div>

      {/* title */}
      <div className="stack-title-wrap mt-5">
        <div className="text-[17px] font-extrabold tracking-[0.5em] text-white drop-shadow-[0_3px_4px_rgba(0,50,130,.3)] sm:text-[22px]">WELCOME TO</div>
        <div className="relative mt-1 flex items-center justify-center gap-3">
          <span className="hidden h-3 w-10 rotate-[28deg] rounded-full bg-white sm:block" />
          <h1 className="stack-title whitespace-nowrap text-[48px] font-black leading-[.9] tracking-[-.045em] sm:text-[74px] md:text-[98px] lg:text-[116px]">
            <span className="text-white">STACK </span><span className="stack-title-master">MASTER</span>
          </h1>
          <span className="hidden h-3 w-10 -rotate-[28deg] rounded-full bg-white sm:block" />
        </div>
        <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-white/80 shadow-[0_2px_5px_rgba(0,65,150,.25)]" />
      </div>

      {/* animated start */}
      <div className="stack-start-wrap relative mt-7 flex h-[205px] w-[205px] items-center justify-center sm:mt-8 sm:h-[235px] sm:w-[235px]">
        <div className="stack-ring absolute inset-0 rounded-full border-[7px] border-cyan-300/90 border-r-[#053ba8] border-t-[#063aa8]" />
        <div className="absolute inset-[10px] rounded-full border-[4px] border-[#0a55bf] bg-[#0645b5] shadow-[inset_0_0_30px_rgba(0,221,255,.55),inset_0_-12px_25px_rgba(0,25,120,.45)]" />
        <button type="button" onClick={startGame} aria-label="Start Stack Master" className="stack-start relative z-10 flex h-[168px] w-[168px] items-center justify-center rounded-full border-[4px] border-[#072f87] bg-[radial-gradient(circle_at_50%_38%,#2bbff0_0%,#0c63ce_38%,#073a9f_78%,#062c82_100%)] text-[39px] font-black tracking-wide text-white shadow-[inset_0_5px_12px_rgba(255,255,255,.25),inset_0_-15px_24px_rgba(0,15,90,.45)] transition-all duration-300 sm:h-[192px] sm:w-[192px] sm:text-[46px]">
          START
        </button>
      </div>

      {/* how to play */}
      <button type="button" onClick={()=>setShowHowToPlay(true)} className="stack-how stack-cta mt-5 flex items-center justify-center gap-4 rounded-full border-2 border-[#0841a4] px-8 py-3 text-[17px] font-extrabold text-[#063d9f] shadow-[0_8px_20px_rgba(0,44,130,.25)] transition hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(0,44,130,.32)] sm:px-10 sm:py-3.5 sm:text-[19px]">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0844ae] text-sm font-black text-white">?</span>
        HOW TO PLAY
      </button>

      <div className="mt-4 text-[10px] font-bold tracking-[0.28em] text-white/85 sm:text-[11px]">PRECISION • TIMING • BALANCE</div>

      {showHowToPlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#03245f]/70 p-4 backdrop-blur-sm" onClick={()=>setShowHowToPlay(false)}>
          <div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] border-2 border-cyan-300/80 bg-white text-left shadow-[0_25px_80px_rgba(0,20,90,.45)]" onClick={e=>e.stopPropagation()}>
            <div className="bg-[linear-gradient(135deg,#063b9d,#0878d7)] px-7 py-5 text-white sm:px-9">
              <button type="button" onClick={()=>setShowHowToPlay(false)} className="absolute right-5 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-2xl font-bold hover:bg-white/25">×</button>
              <div className="text-[11px] font-black tracking-[0.35em] text-cyan-200">STACK MASTER</div>
              <h2 className="mt-1 text-3xl font-black sm:text-4xl">HOW TO PLAY</h2>
              <p className="mt-1 text-sm text-white/80">Build the tallest tower with perfect timing.</p>
            </div>

            <div className="max-h-[62vh] overflow-y-auto px-6 py-6 sm:px-9">
              <div className="space-y-4">
                <div className="flex gap-4 rounded-2xl bg-sky-50 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">1</div>
                  <div><h3 className="font-black text-slate-900">Watch the moving block</h3><p className="mt-1 text-sm leading-6 text-slate-600">The block automatically moves from left to right above your tower.</p></div>
                </div>
                <div className="flex gap-4 rounded-2xl bg-cyan-50 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-600 text-xl font-black text-white">2</div>
                  <div><h3 className="font-black text-slate-900">Drop at the right moment</h3><p className="mt-1 text-sm leading-6 text-slate-600">Click <b>STACK</b>, tap the screen, or press <b>Space / Enter</b> to drop the moving block.</p></div>
                </div>
                <div className="flex gap-4 rounded-2xl bg-indigo-50 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black text-white">3</div>
                  <div><h3 className="font-black text-slate-900">Match the previous block</h3><p className="mt-1 text-sm leading-6 text-slate-600">The more accurately the blocks overlap, the better your stack and score will be.</p></div>
                </div>
                <div className="flex gap-4 rounded-2xl bg-amber-50 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-xl font-black text-white">★</div>
                  <div><h3 className="font-black text-slate-900">Get PERFECT bonuses</h3><p className="mt-1 text-sm leading-6 text-slate-600">A very accurate placement gives a <b>PERFECT</b> bonus and can build your combo.</p></div>
                </div>
                <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-4">
                  <h3 className="font-black text-red-600">⚠️ Don't miss!</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">If the falling block does not overlap the tower, the level ends and you can retry it.</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
                <div className="text-xs font-black tracking-[0.25em] text-cyan-300">YOUR GOAL</div>
                <p className="mt-2 text-sm leading-6 text-white/85">Complete all <b>10 levels</b> by stacking the required number of blocks. As levels increase, the block moves faster.</p>
              </div>

              <button type="button" onClick={()=>setShowHowToPlay(false)} className="mt-5 w-full rounded-2xl bg-[#063d9f] py-3.5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#052f7b]">GOT IT — LET'S STACK!</button>
            </div>
          </div>
        </div>
      )}
    </main>

    {/* hazard platform */}
    <div className="stack-platform absolute bottom-0 left-0 right-0 z-20 h-[104px] overflow-hidden border-t-[7px] border-[#c7d0d9] bg-[#202b3d] shadow-[0_-8px_20px_rgba(0,30,80,.28)] sm:h-[92px]">
      <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,#f8b400_0,#f8b400_72px,#1d2636_72px,#1d2636_144px)]" />
      <div className="absolute inset-[7px] bg-[#202a3b] [background-image:repeating-linear-gradient(120deg,#f8b400_0,#f8b400_70px,#202a3b_70px,#202a3b_140px)]" />
      <div className="absolute inset-x-0 top-0 h-2 bg-white/65" />
      <div className="absolute inset-x-0 bottom-0 h-3 bg-[#111827]" />
    </div>
  </div>;

  if(screen==="name") return <div className="relative min-h-screen w-full overflow-hidden bg-[#0b8ddd] text-white">
    <style>{`
      @keyframes nameCloud{0%,100%{transform:translateX(0)}50%{transform:translateX(15px)}}
      @keyframes continuePulse{0%,100%{box-shadow:0 14px 32px rgba(0,84,220,.30)}50%{box-shadow:0 18px 45px rgba(0,84,220,.48),0 0 0 8px rgba(41,215,255,.10)}}
      .name-cloud{animation:nameCloud 10s ease-in-out infinite}
      .name-continue{animation:continuePulse 2.2s ease-in-out infinite}
      @media (max-height:800px){
        .name-screen main{padding-top:0}
        .name-screen main>div:first-child{height:82px}
        .name-screen main>div:nth-child(2){margin-top:22px}
        .name-screen h1{margin-top:18px}
        .name-screen h1 + p{margin-top:14px}
        .name-screen h1 + p + button{margin-top:18px}
        .name-screen h1 + p + button + button{margin-top:18px;height:62px}
        .name-screen h1 + p + button + button + button{margin-top:16px}
      }
    `}</style>
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#087fd8_0%,#4dbdec_48%,#d9f5fb_100%)]"/>
    <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.86),rgba(92,188,232,.24)_55%,rgba(14,83,160,.34)_100%)]"/>
    <div className="name-cloud pointer-events-none absolute -left-24 top-[-30px] h-52 w-[500px] opacity-80"><span className="absolute left-14 top-14 h-28 w-64 rounded-full bg-white/80 blur-[3px]"/><span className="absolute left-40 top-2 h-36 w-40 rounded-full bg-white/90"/><span className="absolute left-72 top-16 h-28 w-48 rounded-full bg-white/82"/></div>
    <div className="name-cloud pointer-events-none absolute -right-28 top-[-38px] h-52 w-[500px] opacity-80" style={{animationDirection:"reverse",animationDuration:"12s"}}><span className="absolute right-12 top-16 h-28 w-64 rounded-full bg-white/78 blur-[3px]"/><span className="absolute right-48 top-1 h-36 w-44 rounded-full bg-white/88"/><span className="absolute right-0 top-24 h-24 w-56 rounded-full bg-white/76"/></div>
    <div className="pointer-events-none absolute inset-x-0 bottom-[13%] h-[48%] opacity-45 blur-[3px]">{[["5%","36%","8%"],["15%","63%","5%"],["24%","45%","8%"],["34%","72%","5%"],["43%","48%","8%"],["54%","64%","7%"],["65%","43%","9%"],["77%","70%","6%"],["87%","50%","8%"]].map(([left,height,width],i)=><div key={i} className="absolute bottom-0 rounded-t-xl bg-[#4b9fd2]" style={{left,height,width}}/>)}</div>
    <div className="pointer-events-none absolute bottom-[8%] left-[-20px] h-44 w-64 opacity-80"><span className="absolute bottom-0 left-14 h-32 w-16 -rotate-[35deg] rounded-[100%] bg-[#36a95a]"/><span className="absolute bottom-0 left-2 h-36 w-16 rotate-[28deg] rounded-[100%] bg-[#48bd61]"/><span className="absolute bottom-0 left-28 h-40 w-16 rotate-[48deg] rounded-[100%] bg-[#2f9e55]"/></div>
    <div className="pointer-events-none absolute bottom-[8%] right-[-20px] h-44 w-64 opacity-80"><span className="absolute bottom-0 right-14 h-32 w-16 rotate-[35deg] rounded-[100%] bg-[#36a95a]"/><span className="absolute bottom-0 right-2 h-36 w-16 -rotate-[28deg] rounded-[100%] bg-[#48bd61]"/><span className="absolute bottom-0 right-28 h-40 w-16 -rotate-[48deg] rounded-[100%] bg-[#2f9e55]"/></div>

    <button type="button" onClick={()=>setSoundOn(v=>!v)} className="absolute left-7 top-7 z-30 flex items-center gap-2 border-0 bg-transparent px-1 py-1 text-white drop-shadow-[0_3px_5px_rgba(0,35,100,.35)] transition hover:scale-105">
      <span className="text-[27px]">{soundOn?"🔊":"🔇"}</span>
      <span className="text-[13px] font-black tracking-[0.08em]">{soundOn?"SOUND ON":"MUTED"}</span>
    </button>
    <button type="button" onClick={()=>setShowHowToPlay(true)} className="absolute right-7 top-7 z-30 flex items-center gap-2 border-0 bg-transparent px-1 py-1 text-white drop-shadow-[0_3px_5px_rgba(0,35,100,.35)] transition hover:scale-105">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/90 text-base font-black">?</span>
      <span className="text-[13px] font-black tracking-[0.06em]">HOW TO PLAY</span>
    </button>
    <div className="absolute left-[4.5%] top-[25%] z-10 hidden text-left text-[16px] font-black leading-[1.6] tracking-[0.20em] text-white drop-shadow-[0_3px_7px_rgba(0,40,110,.30)] sm:block">BUILD<br/><span className="text-[#ffe15a]">STACK</span><br/>IMPROVE<div className="mt-3 h-[3px] w-12 bg-[#ffe15a]"/></div>
    <div className="absolute right-[4.5%] top-[25%] z-10 hidden text-right text-[16px] font-black leading-[1.6] tracking-[0.20em] text-white drop-shadow-[0_3px_7px_rgba(0,40,110,.30)] sm:block">PLAY<br/>SOLVE<br/><span className="text-[#66f0e6]">ENJOY</span><div className="ml-auto mt-3 h-[3px] w-12 bg-[#66f0e6]"/></div>

    <main className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center px-5 pt-12 text-center">
      <div className="flex h-[105px] items-center justify-center"><img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[78px] w-auto object-contain brightness-0 invert drop-shadow-[0_4px_6px_rgba(0,40,120,.2)] sm:h-[116px]"/></div>
      <div className="mt-10 flex items-center gap-4 text-[11px] font-black tracking-[0.42em] text-[#09275d] sm:text-[13px]"><span className="h-[2px] w-12 bg-[#159eea]"/> WELCOME TO <span className="h-[2px] w-12 bg-[#159eea]"/></div>
      <h1 className="mt-7 whitespace-nowrap text-[52px] font-black leading-[.9] tracking-[-.045em] sm:text-[72px] md:text-[92px] lg:text-[105px]" style={{fontFamily:"Arial Black,Impact,sans-serif",textShadow:"0 5px 0 rgba(8,31,101,.18)"}}><span className="text-[#07122f]">STACK </span><span className="bg-gradient-to-b from-[#1b65ff] via-[#1479ef] to-[#08c7ed] bg-clip-text text-transparent">MASTER</span></h1>
      <p className="mt-6 text-[15px] font-semibold text-[#31588d] sm:text-[18px] md:text-[20px]">Your name will appear on every certificate.</p>

      <button type="button" onClick={()=>setShowKeyboard(true)} className="mt-7 flex w-full max-w-[650px] items-center rounded-[24px] border-2 border-[#188df0] bg-white/90 px-6 py-3.5 text-left shadow-[0_10px_28px_rgba(0,74,160,.18)]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e2efff] text-2xl text-[#1658d6]">♟</span>
        <input value={playerName} onFocus={()=>setShowKeyboard(true)} onChange={e=>setPlayerName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitName()} placeholder="Enter your name" maxLength={30} className="ml-5 w-full bg-transparent px-1 text-[21px] font-semibold text-[#355b8e] outline-none placeholder:text-[#6280a8]"/>
      </button>
      <button onClick={submitName} disabled={!playerName.trim()} className="name-continue mt-7 flex h-[72px] w-full max-w-[475px] items-center justify-center gap-5 rounded-full bg-gradient-to-r from-[#173cff] via-[#1687ee] to-[#12cbe8] text-[22px] font-black text-white transition hover:-translate-y-1 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-35"><span className="text-[30px]">›</span> CONTINUE</button>
      <button onClick={home} className="mt-7 text-[18px] font-semibold text-[#294c7d]">← &nbsp; Back</button>
    </main>

    {showKeyboard && <div className="fixed z-[200] w-[min(94vw,720px)] overflow-hidden rounded-[24px] border-2 border-cyan-300/80 bg-[#0a347e]/96 p-3 text-white shadow-[0_24px_70px_rgba(0,25,100,.50)] backdrop-blur-xl" style={{left:keyboardPos.x===null?"50%":keyboardPos.x,top:keyboardPos.y===null?"auto":keyboardPos.y,bottom:keyboardPos.y===null?"22px":"auto",transform:keyboardPos.x===null?"translateX(-50%)":"none"}} onPointerMove={moveKeyboardDrag} onPointerUp={endKeyboardDrag} onPointerCancel={endKeyboardDrag}>
      <div className="mb-2 flex cursor-grab items-center justify-between rounded-xl bg-white/10 px-3 py-2 active:cursor-grabbing" onPointerDown={beginKeyboardDrag}><div><div className="text-[10px] font-black tracking-[0.3em] text-cyan-200">STACK MASTER</div><div className="text-sm font-black">ON-SCREEN KEYBOARD</div></div><button type="button" onClick={()=>setShowKeyboard(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xl font-bold">×</button></div>
      <div className="space-y-1.5">{keyboardRows.map((row,i)=><div key={i} className="flex justify-center gap-1.5">{row.map(key=><button key={key} type="button" onClick={()=>typeKeyboardKey(key)} className="h-10 min-w-[28px] flex-1 rounded-lg border border-white/15 bg-white/12 px-2 text-sm font-black transition hover:-translate-y-0.5 hover:bg-cyan-400/30 active:scale-95 sm:h-11 sm:min-w-[42px] sm:text-base">{key}</button>)}</div>)}<div className="flex gap-1.5"><button type="button" onClick={()=>typeKeyboardKey("⌫")} className="h-10 flex-[1.6] rounded-lg bg-[#174ea7] text-xs font-black hover:bg-[#2163c6]">⌫ BACKSPACE</button><button type="button" onClick={()=>typeKeyboardKey("SPACE")} className="h-10 flex-[4] rounded-lg bg-white/12 text-xs font-black hover:bg-cyan-400/30">SPACE</button><button type="button" onClick={()=>typeKeyboardKey("ENTER")} className="h-10 flex-[1.6] rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-xs font-black">ENTER ↵</button></div></div>
    </div>}

    {showHowToPlay && <div className="fixed inset-0 z-[190] flex items-center justify-center bg-[#03245f]/70 p-4 backdrop-blur-sm" onClick={()=>setShowHowToPlay(false)}><div className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] bg-white text-left shadow-2xl" onClick={e=>e.stopPropagation()}><div className="bg-[linear-gradient(135deg,#063b9d,#0878d7)] px-7 py-5 text-white"><button type="button" onClick={()=>setShowHowToPlay(false)} className="absolute right-5 top-4 text-2xl">×</button><div className="text-[11px] font-black tracking-[0.35em] text-cyan-200">STACK MASTER</div><h2 className="mt-1 text-3xl font-black">HOW TO PLAY</h2></div><div className="space-y-3 px-7 py-6 text-sm leading-6 text-slate-600"><p><b>1.</b> Watch the moving block above your tower.</p><p><b>2.</b> Press STACK, tap/click, or Space/Enter to drop it.</p><p><b>3.</b> Match the previous block accurately for better scores and PERFECT combos.</p><p><b>4.</b> Don't miss the tower or the level ends.</p><p><b>5.</b> Complete all 10 levels as the speed increases.</p><button type="button" onClick={()=>setShowHowToPlay(false)} className="mt-3 w-full rounded-2xl bg-[#063d9f] py-3.5 font-black text-white">GOT IT — LET'S STACK!</button></div></div></div>}
  </div>;

  if(screen==="intro") return <div className="stack-level-screen relative min-h-screen w-full overflow-hidden bg-[#1aa9ef] text-white">
    <style>{`
      @keyframes levelCloudDrift{0%,100%{transform:translateX(0)}50%{transform:translateX(18px)}}
      @keyframes levelButtonPulse{0%,100%{transform:scale(1);box-shadow:0 12px 30px rgba(0,80,80,.28)}50%{transform:scale(1.025);box-shadow:0 16px 38px rgba(0,100,100,.38)}}
      .level-cloud{animation:levelCloudDrift 11s ease-in-out infinite}
      .level-start{animation:levelButtonPulse 2.2s ease-in-out infinite}
    `}</style>

    {/* bright sky */}
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#079fe9_0%,#38c0f1_52%,#a9e8f4_100%)]" />
    <div className="absolute inset-x-0 bottom-[13%] h-[42%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.30),transparent_65%)]" />

    {/* clouds */}
    <div className="level-cloud pointer-events-none absolute -left-20 top-[-35px] h-64 w-[500px] opacity-85">
      <span className="absolute left-0 top-28 h-28 w-72 rounded-full bg-white/75 blur-[3px]" />
      <span className="absolute left-24 top-12 h-36 w-52 rounded-full bg-white/88" />
      <span className="absolute left-56 top-24 h-32 w-56 rounded-full bg-white/82" />
    </div>
    <div className="level-cloud pointer-events-none absolute -right-24 top-[-40px] h-64 w-[520px] opacity-85" style={{animationDirection:"reverse",animationDuration:"13s"}}>
      <span className="absolute right-0 top-28 h-28 w-72 rounded-full bg-white/72 blur-[3px]" />
      <span className="absolute right-28 top-8 h-40 w-56 rounded-full bg-white/88" />
      <span className="absolute right-64 top-24 h-30 w-56 rounded-full bg-white/80" />
    </div>

    {/* blurred city skyline */}
    <div className="pointer-events-none absolute inset-x-0 bottom-[13%] h-[46%] opacity-60 blur-[3px]">
      {[["4%","35%","8%"],["14%","58%","6%"],["22%","42%","7%"],["31%","68%","6%"],["40%","48%","8%"],["51%","62%","7%"],["62%","43%","8%"],["72%","66%","7%"],["82%","49%","9%"],["93%","59%","6%"]].map(([left,height,width],i)=>
        <div key={i} className="absolute bottom-0 rounded-t-xl bg-[#4b9ed0]" style={{left,height,width}} />
      )}
      <div className="absolute bottom-[47%] left-[74%] h-2 w-32 rotate-[-7deg] rounded-full bg-[#4a91c2]" />
      <div className="absolute bottom-[45%] left-[82%] h-[44%] w-1 bg-[#4a91c2]" />
    </div>

    {/* side foliage */}
    <div className="pointer-events-none absolute bottom-[12%] left-[-24px] h-48 w-72 opacity-85">
      <span className="absolute bottom-0 left-16 h-32 w-16 -rotate-[35deg] rounded-[100%] bg-[#36a858]" />
      <span className="absolute bottom-0 left-3 h-36 w-16 rotate-[27deg] rounded-[100%] bg-[#4abc62]" />
      <span className="absolute bottom-0 left-32 h-40 w-16 rotate-[48deg] rounded-[100%] bg-[#26994e]" />
    </div>
    <div className="pointer-events-none absolute bottom-[12%] right-[-24px] h-48 w-72 opacity-85">
      <span className="absolute bottom-0 right-16 h-32 w-16 rotate-[35deg] rounded-[100%] bg-[#36a858]" />
      <span className="absolute bottom-0 right-3 h-36 w-16 -rotate-[27deg] rounded-[100%] bg-[#4abc62]" />
      <span className="absolute bottom-0 right-32 h-40 w-16 -rotate-[48deg] rounded-[100%] bg-[#26994e]" />
    </div>

    {/* construction towers / crates */}
    <div className="pointer-events-none absolute bottom-[13%] left-0 hidden h-[54%] w-[88px] sm:block">
      <div className="absolute bottom-0 left-0 h-[38%] w-16 bg-[#0867cb] shadow-inner" />
      <div className="absolute bottom-[37%] left-0 h-[19%] w-16 bg-[#ff9e0b]" />
      <div className="absolute bottom-[54%] left-1 h-[46%] w-14 border-x-[10px] border-[#253a63] bg-transparent">
        <span className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 rotate-[30deg] bg-[#253a63]" />
        <span className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 -rotate-[30deg] bg-[#253a63]" />
      </div>
      <div className="absolute bottom-[97%] left-0 h-4 w-16 bg-[#ffc11a]" />
    </div>
    <div className="pointer-events-none absolute bottom-[13%] right-0 hidden h-[54%] w-[88px] sm:block">
      <div className="absolute bottom-0 right-0 h-[38%] w-16 bg-[#0867cb] shadow-inner" />
      <div className="absolute bottom-[37%] right-0 h-[19%] w-16 bg-[#ff9e0b]" />
      <div className="absolute bottom-[54%] right-1 h-[46%] w-14 border-x-[10px] border-[#253a63] bg-transparent">
        <span className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 rotate-[30deg] bg-[#253a63]" />
        <span className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 -rotate-[30deg] bg-[#253a63]" />
      </div>
      <div className="absolute bottom-[97%] right-0 h-4 w-16 bg-[#ffc11a]" />
    </div>

    {/* top controls — direct on background, no cards */}
    <button type="button" onClick={()=>setSoundOn(v=>!v)}
      className="absolute left-7 top-7 z-30 flex items-center gap-2 border-0 bg-transparent px-1 py-1 text-white drop-shadow-[0_3px_6px_rgba(0,45,110,.45)] transition hover:scale-105">
      <span className="text-[27px]">{soundOn?"🔊":"🔇"}</span>
      <span className="text-[13px] font-black tracking-[0.08em]">{soundOn?"SOUND ON":"MUTED"}</span>
    </button>

    <button type="button" onClick={()=>setShowHowToPlay(true)}
      className="absolute right-7 top-7 z-30 flex items-center gap-2 border-0 bg-transparent px-1 py-1 text-white drop-shadow-[0_3px_6px_rgba(0,45,110,.45)] transition hover:scale-105">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/90 text-base font-black">?</span>
      <span className="text-[13px] font-black tracking-[0.06em]">HOW TO PLAY</span>
    </button>

    {/* level title */}
    <div className="pointer-events-none absolute left-[4.5%] top-[32%] z-20 hidden text-left sm:block">
      <div className="text-[15px] font-black tracking-[0.20em] text-white drop-shadow-[0_3px_6px_rgba(0,45,110,.45)]">BUILD</div>
      <div className="text-[30px] font-black tracking-[0.06em] text-[#ffe15a] drop-shadow-[0_3px_6px_rgba(0,45,110,.45)]">STACK</div>
      <div className="text-[15px] font-black tracking-[0.20em] text-white drop-shadow-[0_3px_6px_rgba(0,45,110,.45)]">IMPROVE</div>
      <div className="mt-3 h-[3px] w-12 bg-[#ffe15a]"/>
    </div>

    <div className="pointer-events-none absolute right-[4.5%] top-[32%] z-20 hidden text-right sm:block">
      <div className="text-[15px] font-black tracking-[0.20em] text-white drop-shadow-[0_3px_6px_rgba(0,45,110,.45)]">PLAY</div>
      <div className="text-[30px] font-black tracking-[0.06em] text-[#66f0e6] drop-shadow-[0_3px_6px_rgba(0,45,110,.45)]">SOLVE</div>
      <div className="text-[15px] font-black tracking-[0.20em] text-white drop-shadow-[0_3px_6px_rgba(0,45,110,.45)]">ENJOY</div>
      <div className="ml-auto mt-3 h-[3px] w-12 bg-[#66f0e6]"/>
    </div>

    <main className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col items-center px-5 pb-[15%] pt-6 text-center">
      <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[72px] w-auto object-contain brightness-0 invert drop-shadow-[0_4px_7px_rgba(0,40,120,.22)] sm:h-[104px]" />

      <h1 className="mt-6 font-black leading-none tracking-[-.055em] drop-shadow-[0_6px_0_rgba(4,42,120,.65)]"
        style={{fontFamily:"Arial Black, Impact, sans-serif",fontSize:"clamp(52px,7.4vw,112px)"}}>
        <span className="text-white">STACK </span><span className="text-[#08d7ef]">MASTER</span>
      </h1>

      <div className="mt-3 flex items-center gap-4">
        <span className="h-[3px] w-10 rounded-full bg-cyan-200" />
        <div className="rounded-[18px] bg-gradient-to-b from-[#0750ae] to-[#063d96] px-16 py-4 text-[36px] font-black shadow-[0_8px_20px_rgba(0,50,130,.30)] sm:text-[48px]">
          LEVEL {level.level}
        </div>
        <span className="h-[3px] w-10 rounded-full bg-cyan-200" />
      </div>

      <div className="mt-6 flex items-center gap-5 text-[22px] font-black sm:text-[29px]">
        <span className="h-[3px] w-12 bg-white" />
        <span>Stack {level.target} blocks</span>
        <span className="h-[3px] w-12 bg-white" />
      </div>

      <div className="mt-6 grid w-full max-w-[600px] grid-cols-2 gap-5">
        <div className="flex h-[124px] items-center gap-5 rounded-[20px] border-2 border-cyan-300/80 bg-[#0754a8]/90 px-5 text-left shadow-[0_12px_24px_rgba(0,55,130,.28)]">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[16px] bg-[#043c8b]">
            <span className="text-[57px] leading-none text-[#ff5874]">◎</span>
          </div>
          <div><div className="text-[18px] font-black">TARGET</div><div className="text-[52px] font-black leading-none">{level.target}</div></div>
        </div>
        <div className="flex h-[124px] items-center gap-5 rounded-[20px] border-2 border-cyan-300/80 bg-[#0754a8]/90 px-5 text-left shadow-[0_12px_24px_rgba(0,55,130,.28)]">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[16px] bg-[#043c8b]">
            <span className="text-[54px] leading-none text-cyan-300">◷</span>
          </div>
          <div><div className="text-[18px] font-black">SPEED</div><div className="text-[52px] font-black leading-none">{level.speed}</div></div>
        </div>
      </div>

      <button type="button" onClick={()=>setScreen("playing")}
        className="level-start mt-7 flex h-[88px] w-full max-w-[475px] items-center justify-center gap-6 rounded-full border-[3px] border-white bg-gradient-to-r from-[#0bd06a] to-[#00b85b] text-[27px] font-black shadow-[0_12px_30px_rgba(0,90,70,.30)] transition hover:brightness-110 active:scale-[.98]">
        <span className="text-[42px] leading-none">▶</span> START LEVEL
      </button>
    </main>

    {/* hazard floor */}
    <div className="absolute bottom-0 left-0 right-0 z-10 h-[13%] overflow-hidden border-t-[7px] border-white/90 bg-[#18253e]">
      <div className="absolute inset-0 opacity-100" style={{backgroundImage:"repeating-linear-gradient(125deg, #ffad0a 0 62px, #ffad0a 62px 92px, #18253e 92px 150px)"}} />
      <div className="absolute inset-0 bg-[#17243b]/20" />
    </div>
  </div>;

  if(screen==="playing") return <div className="h-[100dvh] w-screen max-w-[100vw] overflow-hidden overscroll-none overscroll-none bg-[#f7f5ff] text-slate-900">
    <style>{`
      html,body,#root{width:100%;height:100%;margin:0;overflow:hidden}
      @keyframes boardFloat {0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-10px) rotate(2deg)}}
      @keyframes stackGlow {0%,100%{box-shadow:0 10px 25px rgba(76,29,149,.18),0 0 0 0 rgba(124,58,237,.12)}50%{box-shadow:0 14px 34px rgba(76,29,149,.28),0 0 0 10px rgba(124,58,237,0)}}
      @keyframes movingShine {0%{background-position:-180% 0}100%{background-position:180% 0}}
      @keyframes fallingGlow {0%{filter:drop-shadow(0 0 2px rgba(236,72,153,.15));}50%{filter:drop-shadow(0 0 12px rgba(236,72,153,.55));}100%{filter:drop-shadow(0 0 3px rgba(236,72,153,.18));}}
      @keyframes landSquash {0%{transform:scaleY(1.35) scaleX(.96)}45%{transform:scaleY(.82) scaleX(1.025)}75%{transform:scaleY(1.04) scaleX(.99)}100%{transform:scaleY(1) scaleX(1)}}
      @keyframes perfectPop {0%{transform:scale(.7);opacity:0}35%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}
      .play-float{animation:boardFloat 5s ease-in-out infinite}
      .play-float-delay{animation:boardFloat 6s ease-in-out infinite reverse}
      .stack-button{animation:stackGlow 2.3s ease-in-out infinite}
      .moving-block{background-size:220% 100%;animation:movingShine 2.4s linear infinite,fallingGlow 1.4s ease-in-out infinite}.landed-block{animation:landSquash .28s ease-out}
      .play-grid{
        background-image:
          linear-gradient(rgba(126,145,190,.16) 1px,transparent 1px),
          linear-gradient(90deg,rgba(126,145,190,.16) 1px,transparent 1px);
        background-size:26px 26px;
      }
      @media (max-height:820px){
        .game-main{padding-top:10px!important}
        .game-logo{height:66px!important}
        .game-title{font-size:50px!important}
        .stats-card{margin-top:7px!important;padding-top:8px!important;padding-bottom:8px!important}
        .progress-wrap{margin-top:6px!important}
        .board-wrap{margin-top:6px!important}
        .instruction{margin-top:6px!important}
      }
      @media (max-width:900px){
        .game-title{font-size:clamp(34px,7vw,58px)!important}
        .stats-card{max-width:94vw!important}
        .board-wrap{max-width:94vw!important}
      }
    `}</style>

    {/* soft futuristic background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,#ffffff_0%,#fbfaff_38%,#f0edff_100%)]" />
    <div className="pointer-events-none absolute -left-24 top-[36%] h-[310px] w-[310px] rotate-12 rounded-[90px] bg-violet-200/45" />
    <div className="pointer-events-none absolute -right-28 bottom-[2%] h-[330px] w-[330px] -rotate-12 rounded-[100px] bg-violet-200/45" />

    {/* floating cubes */}
    <div className="play-float pointer-events-none absolute left-[8%] top-[39%] h-16 w-16 rotate-[-9deg] rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_14px_28px_rgba(37,99,235,.22)]" />
    <div className="play-float-delay pointer-events-none absolute right-[9%] top-[47%] h-16 w-16 rotate-[9deg] rounded-xl bg-gradient-to-br from-purple-300 to-purple-700 shadow-[0_14px_28px_rgba(124,58,237,.22)]" />
    <div className="play-float pointer-events-none absolute left-[30%] top-[16%] h-10 w-10 rotate-[7deg] rounded-lg bg-gradient-to-br from-blue-300 to-blue-600 shadow-lg" />
    <div className="play-float-delay pointer-events-none absolute right-[32%] top-[14%] h-11 w-11 rotate-[-6deg] rounded-lg bg-gradient-to-br from-purple-300 to-purple-700 shadow-lg" />

    {/* dotted accents */}
    <div className="pointer-events-none absolute left-[9%] top-[32%] hidden grid-cols-4 gap-2.5 lg:grid">
      {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300/80" />)}
    </div>
    <div className="pointer-events-none absolute right-[8%] top-[60%] hidden grid-cols-4 gap-2.5 lg:grid">
      {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300/80" />)}
    </div>

    {/* decorative diagonal lines */}
    <div className="pointer-events-none absolute right-[-25px] top-[130px] h-44 w-64 rotate-[43deg] opacity-60">
      <span className="absolute right-0 top-0 h-[2px] w-56 bg-violet-300" />
      <span className="absolute right-0 top-12 h-[2px] w-56 bg-violet-200" />
      <span className="absolute right-0 top-24 h-[2px] w-56 bg-violet-300" />
    </div>

    {/* left decorative stack */}
    <div className="pointer-events-none absolute bottom-0 left-0 hidden h-[310px] w-[150px] lg:block">
      <div className="absolute bottom-0 left-0 h-[70px] w-[135px] rounded-t-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_8px_18px_rgba(37,99,235,.18)]" />
      <div className="absolute bottom-[62px] left-0 h-[68px] w-[112px] rounded-t-xl bg-gradient-to-br from-purple-300 to-purple-700 shadow-[0_8px_18px_rgba(124,58,237,.18)]" />
      <div className="absolute bottom-[123px] left-7 h-[67px] w-[82px] rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_8px_18px_rgba(37,99,235,.18)]" />
      <div className="absolute bottom-[184px] left-1 h-[62px] w-[72px] rounded-xl bg-gradient-to-br from-purple-300 to-purple-700 shadow-[0_8px_18px_rgba(124,58,237,.18)]" />
    </div>

    {/* right decorative stack */}
    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[310px] w-[150px] lg:block">
      <div className="absolute bottom-0 right-0 h-[70px] w-[135px] rounded-t-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_8px_18px_rgba(37,99,235,.18)]" />
      <div className="absolute bottom-[62px] right-0 h-[68px] w-[112px] rounded-t-xl bg-gradient-to-br from-purple-300 to-purple-700 shadow-[0_8px_18px_rgba(124,58,237,.18)]" />
      <div className="absolute bottom-[123px] right-7 h-[67px] w-[82px] rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_8px_18px_rgba(37,99,235,.18)]" />
      <div className="absolute bottom-[184px] right-1 h-[62px] w-[72px] rounded-xl bg-gradient-to-br from-purple-300 to-purple-700 shadow-[0_8px_18px_rgba(124,58,237,.18)]" />
    </div>

    {/* top controls */}
    <button type="button" className="absolute left-6 top-6 z-40 flex h-[104px] w-[98px] flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white/95 text-violet-700 shadow-[0_12px_30px_rgba(76,29,149,.12)] backdrop-blur">
      <span className="text-[30px] leading-none">🔊</span>
      <span className="mt-1 text-[10px] font-black tracking-wide">SOUND</span>
      <span className="text-[8px] font-black text-violet-500">100%</span>
    </button>

    <button type="button" onClick={()=>setShowHowToPlay(true)} className="absolute right-6 top-6 z-40 flex h-[104px] w-[108px] flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white/95 text-violet-700 shadow-[0_12px_30px_rgba(76,29,149,.12)] backdrop-blur transition hover:-translate-y-1">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-violet-600 text-xl font-black">?</span>
      <span className="mt-1 text-[10px] font-black">HOW TO PLAY</span>
    </button>

    <main className="game-main relative z-10 mx-auto flex h-[100dvh] w-full max-w-[1400px] flex-col items-center overflow-hidden px-4 pb-2 pt-1 text-center">
      {/* logo + title */}
      <img src="/logo.png" alt="Nebuloid Tech Studio" className="game-logo h-[88px] w-auto max-w-[220px] object-contain" />

      <div className="mt-1 flex items-center gap-5">
        <span className="hidden h-[3px] w-14 rounded-full bg-violet-300 sm:block" />
        <h1 className="game-title text-[58px] font-black leading-none tracking-[-.055em]">
          <span className="text-[#081225]">STACK </span>
          <span className="bg-gradient-to-b from-[#246cff] via-[#1767ef] to-[#09bfe9] bg-clip-text text-transparent">MASTER</span>
        </h1>
        <span className="hidden h-[3px] w-14 rounded-full bg-violet-300 sm:block" />
      </div>

      {/* stats */}
      <div className="stats-card mt-3 flex w-full max-w-[820px] items-center rounded-[20px] border border-violet-200 bg-white/95 px-5 py-3 shadow-[0_12px_35px_rgba(76,29,149,.10)]">
        <div className="flex flex-1 items-center justify-center gap-3 text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl text-violet-700">▰</div>
          <div>
            <div className="text-[12px] font-black text-violet-700">LEVEL</div>
            <div className="text-[25px] font-black leading-none text-[#10182f]">{level.level} / 10</div>
          </div>
        </div>
        <div className="h-12 w-px bg-violet-200" />
        <div className="flex flex-1 items-center justify-center gap-3 text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl text-violet-700">★</div>
          <div>
            <div className="text-[12px] font-black text-violet-700">SCORE</div>
            <div className="text-[25px] font-black leading-none text-[#10182f]">{score}</div>
          </div>
        </div>
        <div className="h-12 w-px bg-violet-200" />
        <div className="flex flex-1 items-center justify-center gap-3 text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl text-violet-700">▥</div>
          <div>
            <div className="text-[12px] font-black text-violet-700">HEIGHT</div>
            <div className="text-[25px] font-black leading-none text-[#10182f]">{blocks.length-1} / {level.target-1}</div>
          </div>
        </div>
      </div>

      {/* progress */}
      <div className="progress-wrap mt-3 w-full max-w-[820px]">
        <div className="mb-1 flex justify-between text-[13px] font-black text-violet-700">
          <span>PROGRESS</span>
          <span>{blocks.length-1} / {level.target-1}</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-blue-500 transition-all duration-300" style={{width:`${Math.min(100,((blocks.length-1)/(level.target-1))*100)}%`}} />
        </div>
      </div>

      {/* game board */}
      <div className="board-wrap mt-2 w-full max-w-[1160px] flex-none">
        <div className="relative mx-auto h-[620px] min-h-[620px] max-h-none w-full overflow-hidden rounded-[28px] border-[3px] border-violet-300 bg-white/75 shadow-[0_18px_45px_rgba(76,29,149,.12)]">
          <div className="play-grid absolute inset-0 opacity-80" />

          {/* platform glow */}
          <div className="absolute bottom-[12px] left-1/2 h-5 w-[48%] -translate-x-1/2 rounded-full bg-violet-300/20 blur-xl" />

          {/* visual stack is compressed so ALL 10 levels stay inside this one viewport */}
          {blocks.map((b,i)=>{
            const step=Math.min(30, Math.max(16, 330/Math.max(level.target-1,1)));
            const blockH=Math.min(29, Math.max(16, step-3));
            return <div
              key={i}
              className="landed-block absolute rounded-[7px] border-2 border-white/80 bg-gradient-to-b from-cyan-300 via-blue-500 to-blue-700 shadow-[0_7px_16px_rgba(37,99,235,.30)]"
              style={{
                left:`${b.left/GAME_WIDTH*100}%`,
                width:`${b.width/GAME_WIDTH*100}%`,
                height:blockH,
                bottom:i*step+12
              }}
            />
          })}

          {currentBlock&&(()=>{
            const step=Math.min(30, Math.max(16, 330/Math.max(level.target-1,1)));
            const blockH=Math.min(29, Math.max(16, step-3));
            const targetBottom=blocks.length*step+12;
            return <div
              className={`moving-block absolute rounded-[7px] border-2 border-white/90 bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 shadow-[0_10px_24px_rgba(236,72,153,.42)] ${dropping?"transition-[top,left] duration-[320ms] ease-in":""}`}
              style={{
                left:`${currentBlock.left/GAME_WIDTH*100}%`,
                width:`${currentBlock.width/GAME_WIDTH*100}%`,
                height:blockH,
                top:dropping?`calc(100% - ${targetBottom+blockH}px)`:24,
                zIndex:30
              }}
            />
          })()}

          {/* landing guide */}
          <div className="pointer-events-none absolute left-1/2 top-5 z-10 -translate-x-1/2 text-[10px] font-black tracking-[.28em] text-violet-300/80">DROP ZONE</div>
          <div className="pointer-events-none absolute left-1/2 top-10 z-10 h-[2px] w-[18%] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />

          <div
            className="absolute bottom-0 h-[16px] rounded-t-lg bg-[#10143f] shadow-[0_-3px_10px_rgba(17,24,39,.24)]"
            style={{
              left:`${((GAME_WIDTH-BASE_WIDTH)/2/GAME_WIDTH)*100}%`,
              width:`${BASE_WIDTH/GAME_WIDTH*100}%`
            }}
          />

          {message&&
            <div className="absolute left-0 right-0 top-7 z-20 animate-[perfectPop_.35s_ease-out] text-center text-2xl font-black text-violet-700 drop-shadow-sm">
              {message}
            </div>
          }
        </div>
      </div>

      {/* instruction */}
      <div className="instruction mt-2 flex items-center justify-center gap-2 rounded-full bg-white/90 px-6 py-2 text-[14px] font-bold text-slate-500 shadow-[0_8px_22px_rgba(76,29,149,.08)] md:text-[15px]">
        <span className="text-xl text-violet-600">♧</span>
        <span>Block moves automatically</span>
        <span className="text-violet-400">•</span>
        <span>Click / Tap / Space to drop</span>
      </div>

      {combo>0&&<div className="mt-1 text-sm font-black text-orange-500">COMBO ×{combo}</div>}
    </main>
  </div>
  if(screen==="gameover") return <div className="fixed inset-0 h-[100dvh] w-screen max-w-[100vw] overflow-hidden overscroll-none bg-[#f8f7ff] text-slate-900">
    <style>{`
      @keyframes goFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-9px) rotate(2deg)}}
      @keyframes goGlow{0%,100%{opacity:.55}50%{opacity:.9}}
      .go-float{animation:goFloat 6s ease-in-out infinite}
      .go-float-delay{animation:goFloat 7s ease-in-out infinite reverse}
      .go-glow{animation:goGlow 3s ease-in-out infinite}
    `}</style>

    {/* soft futuristic background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#ffffff_0%,#fbfaff_48%,#efedff_100%)]" />
    <div className="pointer-events-none absolute -left-20 top-[24%] h-[420px] w-[260px] rounded-[110px] bg-violet-200/35 blur-[1px]" />
    <div className="pointer-events-none absolute -right-20 top-[26%] h-[430px] w-[270px] rounded-[110px] bg-violet-200/35 blur-[1px]" />

    {/* blurred city-like columns */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%] opacity-35">
      <div className="absolute left-[14%] bottom-0 h-[230px] w-16 bg-violet-200/55 blur-[3px]" />
      <div className="absolute left-[20%] bottom-0 h-[300px] w-20 bg-indigo-200/45 blur-[3px]" />
      <div className="absolute left-[26%] bottom-0 h-[180px] w-14 bg-violet-300/45 blur-[3px]" />
      <div className="absolute right-[14%] bottom-0 h-[260px] w-16 bg-violet-200/55 blur-[3px]" />
      <div className="absolute right-[21%] bottom-0 h-[330px] w-20 bg-indigo-200/45 blur-[3px]" />
      <div className="absolute right-[27%] bottom-0 h-[200px] w-14 bg-violet-300/45 blur-[3px]" />
    </div>

    {/* floating cubes */}
    <div className="go-float pointer-events-none absolute left-[18%] top-[15%] h-16 w-16 rotate-[18deg] rounded-2xl bg-gradient-to-br from-blue-300 to-blue-600 opacity-70 shadow-[0_18px_35px_rgba(37,99,235,.18)]" />
    <div className="go-float-delay pointer-events-none absolute right-[20%] top-[12%] h-16 w-16 rotate-[-18deg] rounded-2xl bg-gradient-to-br from-purple-300 to-purple-600 opacity-60 shadow-[0_18px_35px_rgba(124,58,237,.18)]" />
    <div className="go-float pointer-events-none absolute left-[20%] top-[42%] h-10 w-10 rotate-[12deg] rounded-xl bg-gradient-to-br from-purple-300 to-purple-600 opacity-45" />
    <div className="go-float-delay pointer-events-none absolute right-[22%] top-[48%] h-12 w-12 rotate-[-12deg] rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 opacity-45" />    
    {/* top controls — direct on background, no cards */}
    <button type="button" onClick={()=>setSoundOn(v=>!v)}
      className="absolute left-7 top-6 z-40 flex items-center gap-2 border-0 bg-transparent px-1 py-1 text-violet-700 drop-shadow-[0_3px_6px_rgba(76,29,149,.25)] transition hover:scale-105">
      <span className="text-[27px]">{soundOn?"🔊":"🔇"}</span>
      <span className="text-[13px] font-black tracking-[0.08em]">{soundOn?"SOUND ON":"MUTED"}</span>
    </button>
    <button type="button" onClick={()=>setShowHowToPlay(true)}
      className="absolute right-7 top-6 z-40 flex items-center gap-2 border-0 bg-transparent px-1 py-1 text-violet-700 drop-shadow-[0_3px_6px_rgba(76,29,149,.25)] transition hover:scale-105">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-violet-600 text-base font-black">?</span>
      <span className="text-[13px] font-black tracking-[0.06em]">HOW TO PLAY</span>
    </button>

    {/* side stacks */}
    <div className="pointer-events-none absolute bottom-0 left-0 hidden h-[390px] w-[250px] lg:block">
      <div className="absolute bottom-0 left-0 h-[108px] w-[250px] rounded-tr-2xl bg-gradient-to-br from-violet-300 to-violet-600 shadow-[0_12px_30px_rgba(76,29,149,.16)]" />
      <div className="absolute bottom-[102px] left-0 h-[105px] w-[178px] rounded-tr-2xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_12px_30px_rgba(37,99,235,.16)]" />
      <div className="absolute bottom-[203px] left-0 h-[96px] w-[140px] rounded-tr-2xl bg-gradient-to-br from-purple-300 to-purple-600 shadow-[0_12px_30px_rgba(124,58,237,.16)]" />
      <div className="absolute bottom-[290px] left-[72px] h-[80px] w-[84px] rotate-[7deg] rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-xl" />
    </div>
    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-[390px] w-[250px] lg:block">
      <div className="absolute bottom-0 right-0 h-[108px] w-[250px] rounded-tl-2xl bg-gradient-to-br from-violet-300 to-violet-600 shadow-[0_12px_30px_rgba(76,29,149,.16)]" />
      <div className="absolute bottom-[102px] right-0 h-[105px] w-[178px] rounded-tl-2xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_12px_30px_rgba(37,99,235,.16)]" />
      <div className="absolute bottom-[203px] right-0 h-[96px] w-[140px] rounded-tl-2xl bg-gradient-to-br from-purple-300 to-purple-600 shadow-[0_12px_30px_rgba(124,58,237,.16)]" />
      <div className="absolute bottom-[290px] right-[72px] h-[80px] w-[84px] -rotate-[7deg] rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-xl" />
    </div>

    <div className="pointer-events-none absolute left-[4.5%] top-[44%] z-20 hidden text-left lg:block">
      <div className="text-[14px] font-black tracking-[0.22em] text-[#6240d9]">BUILD</div>
      <div className="text-[28px] font-black tracking-[0.04em] text-[#2777ff]">HIGH</div>
      <div className="text-[14px] font-black tracking-[0.22em] text-[#6240d9]">STACKS</div>
      <div className="mt-3 h-[3px] w-12 bg-[#2777ff]"/>
    </div>
    <div className="pointer-events-none absolute right-[4.5%] top-[44%] z-20 hidden text-right lg:block">
      <div className="text-[14px] font-black tracking-[0.22em] text-[#8b45ed]">TIMING</div>
      <div className="text-[28px] font-black tracking-[0.04em] text-[#2777ff]">AIM</div>
      <div className="text-[14px] font-black tracking-[0.22em] text-[#8b45ed]">RETRY</div>
      <div className="ml-auto mt-3 h-[3px] w-12 bg-[#8b45ed]"/>
    </div>
    <main className="relative z-10 mx-auto flex h-[100dvh] w-full max-w-[1280px] flex-col items-center overflow-hidden px-5 pb-3 pt-2 text-center">
      {/* logo */}
      <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[78px] w-auto max-w-[250px] object-contain sm:h-[88px]" />

      {/* collapsed tower illustration */}
      <div className="relative top-28 mt-8 h-[105px] w-full max-w-[560px]">
        <div className="absolute bottom-5 left-1/2 h-[10px] w-[78%] -translate-x-1/2 rounded-full bg-violet-300/40 blur-[2px]" />
        <div className="absolute bottom-7 left-[23%] h-5 w-[54%] rounded-lg bg-gradient-to-r from-violet-300 via-indigo-300 to-violet-400 shadow-lg" />
        <div className="absolute bottom-8 left-[34%] h-[55px] w-[130px] -rotate-[18deg] rounded-xl bg-gradient-to-br from-violet-300 to-indigo-500 shadow-[0_12px_24px_rgba(76,29,149,.20)]" />
        <div className="absolute bottom-9 left-[47%] h-[48px] w-[122px] rotate-[13deg] rounded-xl bg-gradient-to-br from-indigo-300 to-violet-500 shadow-[0_12px_24px_rgba(76,29,149,.20)]" />
        <div className="absolute bottom-10 right-[23%] h-[45px] w-[92px] rotate-[24deg] rounded-xl bg-gradient-to-br from-blue-300 to-blue-600 shadow-[0_12px_24px_rgba(37,99,235,.20)]" />
        <div className="absolute bottom-7 left-[27%] h-[24px] w-[70px] rounded-lg bg-violet-200 shadow-md" />
        <div className="absolute bottom-7 right-[29%] h-[30px] w-[34px] rotate-[4deg] rounded-lg bg-violet-300 shadow-md" />
        <div className="absolute left-1/2 top-3 h-9 w-1 -translate-x-1/2 rotate-[8deg] rounded-full bg-violet-600" />
        <div className="absolute left-[44%] top-7 h-6 w-1 -rotate-[31deg] rounded-full bg-violet-600" />
        <div className="absolute left-[56%] top-7 h-6 w-1 rotate-[31deg] rounded-full bg-violet-600" />
      </div>

      <h1 className="relative top-28 mt-4 text-[42px] font-black leading-none tracking-[-.045em] text-[#0b1230] sm:text-[56px]">
        TOWER <span className="bg-gradient-to-r from-[#174eff] via-[#4d32ff] to-[#8b2cff] bg-clip-text text-transparent">COLLAPSED</span>
      </h1>
      <p className="relative top-28 mt-3 text-[15px] font-semibold text-slate-500 sm:text-[18px]">You missed the previous block.</p>

      {/* stats */}
      <div className="relative top-28 mt-4 grid w-full max-w-[620px] grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-violet-200 bg-white/95 px-5 py-4 shadow-[0_10px_30px_rgba(76,29,149,.08)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-[27px] text-violet-700">★</div>
          <div className="mt-2 text-[13px] font-black text-violet-700">SCORE</div>
          <div className="mt-1 text-[38px] font-black leading-none text-[#0b1230]">{score}</div>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-white/95 px-5 py-4 shadow-[0_10px_30px_rgba(76,29,149,.08)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-[25px] font-black text-violet-700">▥</div>
          <div className="mt-2 text-[13px] font-black text-violet-700">HEIGHT</div>
          <div className="mt-1 text-[38px] font-black leading-none text-[#0b1230]">{blocks.length}</div>
        </div>
      </div>

      {/* actions */}
      <div className="relative top-28 mt-4 grid w-full max-w-[620px] grid-cols-2 gap-3 sm:gap-4">
        <button onClick={retry} className="flex h-[66px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#3514c9] to-[#6530f5] px-5 text-[17px] font-black text-white shadow-[0_12px_28px_rgba(76,29,149,.25)] transition hover:-translate-y-1 hover:brightness-110">
          <span className="text-[30px] leading-none">↻</span> RETRY LEVEL
        </button>
        <button onClick={home} className="flex h-[66px] items-center justify-center gap-3 rounded-xl border-2 border-violet-300 bg-white/95 px-5 text-[17px] font-black text-[#10183b] shadow-[0_8px_22px_rgba(76,29,149,.08)] transition hover:-translate-y-1 hover:border-violet-500">
          <span className="text-[27px] leading-none text-violet-700">⌂</span> HOME
        </button>
      </div>

      {/* footer */}
      <div className="relative top-28 mt-5 flex items-center gap-5 text-[14px] font-black tracking-[.32em] text-violet-400">
        <span className="h-[2px] w-12 bg-violet-300 sm:w-16" />
        <span>SMALL STEPS</span>
        <span className="h-2 w-2 rounded-full bg-violet-500" />
        <span>BIG TOWERS</span>
        <span className="h-[2px] w-12 bg-violet-300 sm:w-16" />
      </div>

      {/* floor glow */}
      <div className="go-glow pointer-events-none absolute bottom-0 left-1/2 h-20 w-[65%] -translate-x-1/2 rounded-[50%] bg-violet-300/20 blur-3xl" />
    </main>
  </div>;

  if(screen==="complete") return <div className="min-h-screen w-full overflow-auto bg-gradient-to-br from-[#f4f1ff] via-white to-[#eeebff] px-4 py-7 text-slate-900 print:bg-white print:p-0">
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1450px] flex-col items-center justify-center print:min-h-0">

      {/* CERTIFICATE SHEET */}
      <div id="certificate-sheet" className="relative w-full max-w-[1240px] overflow-hidden rounded-[18px] border-[3px] border-violet-700 bg-white shadow-[0_20px_65px_rgba(50,35,110,0.20)] print:max-w-none print:rounded-none print:border-[3px] print:shadow-none">

        {/* layered border */}
        <div className="pointer-events-none absolute inset-[9px] rounded-[11px] border border-violet-300" />
        <div className="pointer-events-none absolute inset-[15px] rounded-[7px] border border-violet-100" />

        {/* corner ornaments */}
        <div className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-gradient-to-br from-violet-700 to-violet-500 [clip-path:polygon(0 0,100% 0,0 100%)]" />
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-violet-700 to-violet-500 [clip-path:polygon(100% 0,100% 100%,0 0)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-24 bg-gradient-to-tr from-violet-700 to-violet-500 [clip-path:polygon(0 100%,100% 100%,0 0)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 bg-gradient-to-tl from-violet-700 to-violet-500 [clip-path:polygon(100% 100%,100% 0,0 100%)]" />

        {/* subtle side decorations */}
        <div className="pointer-events-none absolute left-[7%] top-[23%] hidden opacity-60 lg:block">
          <div className="h-4 w-12 rounded bg-violet-200" />
          <div className="mt-1 h-4 w-20 rounded bg-violet-100" />
          <div className="mt-1 h-4 w-14 rounded bg-violet-200" />
          <div className="ml-7 mt-1 h-4 w-16 rounded bg-violet-100" />
        </div>
        <div className="pointer-events-none absolute right-[7%] top-[24%] hidden opacity-60 lg:block">
          <div className="h-4 w-20 rounded bg-violet-100" />
          <div className="ml-6 mt-1 h-4 w-14 rounded bg-violet-200" />
          <div className="mt-1 h-4 w-16 rounded bg-violet-100" />
        </div>

        <div className="pointer-events-none absolute left-[4%] top-[43%] hidden grid-cols-4 gap-2 lg:grid">
          {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300/70" />)}
        </div>
        <div className="pointer-events-none absolute right-[4%] top-[48%] hidden grid-cols-4 gap-2 lg:grid">
          {[...Array(16)].map((_,i)=><span key={i} className="h-1.5 w-1.5 rounded-full bg-violet-300/70" />)}
        </div>

        {/* certificate content — normal flow, no absolute stacking */}
        <div className="relative z-10 px-[8%] pb-7 pt-7 sm:px-[9%] md:pb-8 md:pt-8">

          {/* logo */}
          <div className="flex justify-center">
            <img src="/logo.png" alt="Nebuloid Tech Studio" className="h-[76px] w-auto max-w-[190px] object-contain sm:h-[104px] md:h-[94px]" />
          </div>

          {/* title */}
          <div className="mt-3 text-center">
            <h1 className="text-[39px] font-black leading-none tracking-[0.01em] text-[#081225] sm:text-[48px] md:text-[58px]">
              CERTIFICATE
            </h1>
            <div className="mt-2 flex items-center justify-center gap-4 text-[12px] font-black tracking-[0.28em] text-violet-700 sm:text-[15px] md:text-[18px]">
              <span className="h-[2px] w-11 bg-violet-300 sm:w-14" />
              <span>OF ACHIEVEMENT</span>
              <span className="h-[2px] w-11 bg-violet-300 sm:w-14" />
            </div>
          </div>

          {/* recipient */}
          <div className="mt-5 text-center sm:mt-6">
            <p className="text-[13px] font-medium text-slate-600 sm:text-[16px] md:text-[18px]">
              This certificate is proudly presented to
            </p>
            <div className="mx-auto mt-2 w-fit min-w-[42%] max-w-[80%] border-b-2 border-violet-600 px-8 pb-2 text-[29px] font-black leading-tight text-[#11183d] sm:text-[36px] md:text-[45px]">
              {playerName}
            </div>
            <p className="mt-3 text-[13px] font-medium text-slate-600 sm:text-[16px] md:text-[18px]">
              for successfully completing
            </p>
          </div>

          {/* game identity */}
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="h-4 w-9 -skew-x-12 rounded-sm bg-violet-600 sm:h-5 sm:w-11" />
              <span className="h-4 w-9 -skew-x-12 rounded-sm bg-indigo-600 sm:h-5 sm:w-11" />
              <span className="h-4 w-9 -skew-x-12 rounded-sm bg-violet-700 sm:h-5 sm:w-11" />
            </div>
            <div>
              <div className="text-left text-[24px] font-black leading-none sm:text-[31px] md:text-[38px]">
                <span className="text-[#081225]">STACK </span>
                <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">MASTER</span>
              </div>
              <div className="mt-1 text-left text-[8px] font-black tracking-[0.13em] text-slate-700 sm:text-[10px] md:text-[12px]">
                STACK HIGH, SCORE HIGHER!
              </div>
            </div>
          </div>

          {/* achievement ribbon */}
          <div className="mt-4 flex items-center justify-center">
            <span className="mr-1 h-0 w-0 border-b-[10px] border-r-[9px] border-t-[10px] border-b-transparent border-r-violet-600 border-t-transparent" />
            <div className="min-w-[300px] bg-gradient-to-r from-violet-500 via-violet-700 to-violet-500 px-6 py-1.5 text-center text-[11px] font-black tracking-[0.14em] text-white sm:min-w-[370px] sm:text-[14px] md:min-w-[430px] md:text-[17px]">
              LEVEL {level.level} ACHIEVEMENT
            </div>
            <span className="ml-1 h-0 w-0 border-b-[10px] border-l-[9px] border-t-[10px] border-b-transparent border-l-violet-600 border-t-transparent" />
          </div>

          {/* stats */}
          <div className="mx-auto mt-5 grid w-full max-w-[820px] grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[
              ["LEVEL",`${level.level} / 10`,"▰"],
              ["SCORE",score,"★"],
              ["HEIGHT",level.target,"▥"]
            ].map(([label,value,icon])=>
              <div key={label} className="flex min-h-[67px] items-center justify-center gap-2 rounded-xl border border-violet-300 bg-violet-50/30 px-2 py-2 sm:min-h-[76px] sm:gap-3 md:min-h-[104px]">
                <div className="text-[22px] text-violet-700 sm:text-[27px] md:text-[31px]">{icon}</div>
                <div className="text-left">
                  <div className="text-[8px] font-black tracking-wide text-violet-700 sm:text-[10px] md:text-[12px]">{label}</div>
                  <div className="mt-0.5 text-[17px] font-black leading-none text-[#081225] sm:text-[21px] md:text-[25px]">{value}</div>
                </div>
              </div>
            )}
          </div>

          {/* balanced footer */}
          <div className="mx-auto mt-6 grid w-full max-w-[900px] grid-cols-3 items-end gap-6">
            <div className="flex justify-center">
              <div className="w-[175px] rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 text-center">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-violet-700 text-sm font-black text-white">✓</div>
                <div className="mt-1.5 text-[10px] font-black tracking-[0.12em] text-violet-800 sm:text-[11px]">STACK MASTER</div>
                <div className="mt-0.5 text-[7px] font-bold tracking-[0.12em] text-slate-500 sm:text-[8px]">VERIFIED ACHIEVEMENT</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border-[3px] border-dashed border-violet-600 bg-violet-50 sm:h-[104px] sm:w-[78px]">
                <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full border-2 border-violet-400 bg-white text-2xl text-violet-700">★</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-[175px] text-center">
                <div className="border-b-2 border-violet-500 pb-1.5 text-[9px] font-bold text-slate-700 sm:text-[11px]">
                  {new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}
                </div>
                <div className="mt-1.5 text-[8px] font-black tracking-[0.12em] text-violet-800 sm:text-[10px]">DATE OF ACHIEVEMENT</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* actions outside certificate */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          onClick={()=>window.print()}
          className="rounded-xl bg-violet-700 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          ↓ DOWNLOAD CERTIFICATE
        </button>
        <button
          onClick={nextLevel}
          className="rounded-xl bg-[#101a3d] px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
        >
          {levelIndex<9?"NEXT LEVEL →":"FINISH GAME"}
        </button>
        <button
          onClick={home}
          className="rounded-xl border border-slate-200 bg-white px-7 py-3 font-bold text-slate-700 shadow"
        >
          HOME
        </button>
      </div>
    </div>
  </div>;

  return <div className={page}><div className={`${card} flex items-center justify-center`}><div className="text-center"><div className="text-5xl text-amber-500">★</div><h1 className="mt-5 text-6xl font-black">MASTER ACHIEVED</h1><p className="mt-5 text-lg text-slate-500">{playerName}, you completed all 10 levels.</p><div className="mt-8 inline-block rounded-2xl border border-slate-200 bg-slate-50 px-10 py-6"><div className="text-xs font-bold tracking-widest text-slate-400">FINAL SCORE</div><div className="mt-2 text-5xl font-black text-cyan-600">{score}</div></div><div className="mt-10"><button onClick={()=>{setLevelIndex(0);setScore(0);setCombo(0);setScreen("intro")}} className="rounded-xl bg-slate-900 px-10 py-4 font-black text-white">PLAY AGAIN</button></div></div></div></div>;
}
