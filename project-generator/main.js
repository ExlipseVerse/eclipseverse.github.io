const things = ["chrome extension","habit tracker","recipe finder","budget splitter","ai chatbot","browser game","music visualizer","drawing app","flashcard app","pomodoro timer","meme generator","color palette tool","url shortener","weather widget","mood journal","plant care tracker","commute planner","dream journal","typing test","qr code generator","link-in-bio page","countdown timer","random name picker","habit streak tracker"];
const fors = ["astronauts","procrastinators","night owls","coffee addicts","plant parents","introverts","conspiracy theorists","time travelers","minimalists","hoarders","grandparents","toddlers","pirates","vampires","remote workers","stand-up comedians","competitive eaters","insomniacs","cat burglars","broke superheroes","long-distance couples","undercover spies","retired wizards","people who talk to plants"];
const twists = ["no mouse allowed","must work fully offline","voice-controlled only","fits on one screen, no scroll","zero javascript frameworks","must hide an easter egg","has to work on a flip phone","dark mode only, no exceptions","gamified with points and streaks","ascii art only, no images","needs a live countdown","self-destructs after 60 seconds","keyboard-only control","retro 8-bit aesthetic","apologizes when it breaks","exactly one button","collaborative in real time","must be usable one-handed","every action needs confirmation","comic sans is mandatory","works with no internet","hides a mini-game inside","reskins itself by time of day","must ship in under 2 hours"];

const ROW_H = 104;
let rolling = false;
let rollCount = 0;

const cols = [
    { el: document.getElementById('reelThing'), wrap: document.getElementById('slotThing'), list: things, dur: 1700, delay: 0,   pitch: 1.0 },
    { el: document.getElementById('reelFor'),   wrap: document.getElementById('slotFor'),   list: fors,   dur: 2150, delay: 180, pitch: 1.25 },
    { el: document.getElementById('reelTwist'), wrap: document.getElementById('slotTwist'), list: twists, dur: 2600, delay: 360, pitch: 1.55 },
];

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

let actx;
function ctx(){ if(!actx) actx = new (window.AudioContext||window.webkitAudioContext)(); return actx; }

function tone(freq, dur, type, gainPeak, when){
    const c = ctx();
    const t0 = c.currentTime + (when||0);
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type||'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(gainPeak||0.2, t0+0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0+dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0+dur+0.02);
}

function playWhoosh(){
    const c = ctx();
    const bufferSize = c.sampleRate * 0.4;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++){ data[i] = (Math.random()*2-1) * (1 - i/bufferSize); }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, c.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2200, c.currentTime+0.35);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.25, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime+0.4);
    src.connect(filter).connect(gain).connect(c.destination);
    src.start();
}

function playThunk(pitchMul){
    tone(90*pitchMul, 0.22, 'triangle', 0.35, 0);
    tone(180*pitchMul, 0.12, 'square', 0.08, 0.01);
}

function playChord(){
    tone(523.25, 0.5, 'sine', 0.18, 0);
    tone(659.25, 0.5, 'sine', 0.15, 0.06);
    tone(783.99, 0.6, 'sine', 0.15, 0.12);
}

function buildReel(col, chosen){
    const N = 26;
    const items = [];
    for(let i=0;i<N;i++) items.push(pick(col.list));
    items.push(chosen);
    col.el.innerHTML = items.map(w=>`<div class="reel-item">${w}</div>`).join('');
    col.el.style.transition = 'none';
    col.el.style.transform = 'translateY(0px)';
    col.el.getBoundingClientRect(); // force reflow
    return items.length;
}

function spinColumn(col, chosen){
    return new Promise(resolve=>{
        const count = buildReel(col, chosen);
        const target = -(count-1) * ROW_H;
        col.wrap.classList.remove('landed');
        col.el.classList.add('spinning');

        setTimeout(()=>{
            col.el.style.transition = `transform ${col.dur}ms cubic-bezier(0.13,0.82,0.18,1)`;
            requestAnimationFrame(()=>{ col.el.style.transform = `translateY(${target}px)`; });
            setTimeout(()=>{ col.el.classList.remove('spinning'); }, Math.max(col.dur-260,0));
        }, col.delay);

        setTimeout(()=>{
            col.wrap.classList.add('landed');
            playThunk(col.pitch);
            resolve(chosen);
        }, col.delay + col.dur);
    });
}

function addHistory(thing, forWho, twist){
    const list = document.getElementById('historyList');
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.innerHTML = `
      <div class="txt">Build a <b>${thing}</b> for <b>${forWho}</b> — twist: <b>${twist}</b></div>
      <button class="copy">COPY</button>
    `;
    entry.querySelector('.copy').addEventListener('click', ()=>{
      const str = `Build a ${thing} for ${forWho} — twist: ${twist}`;
      navigator.clipboard?.writeText(str).catch(()=>{});
      const btn = entry.querySelector('.copy');
      btn.textContent = 'COPIED';
      setTimeout(()=>btn.textContent='COPY', 1200);
    });
    list.prepend(entry);
}

async function roll(){
    if(rolling) return;
    rolling = true;
    document.getElementById('rollBtn').disabled = true;
    try{ playWhoosh(); }catch(e){}

    const chosenThing = pick(things);
    const chosenFor = pick(fors);
    const chosenTwist = pick(twists);

    await Promise.all([
      spinColumn(cols[0], chosenThing),
      spinColumn(cols[1], chosenFor),
      spinColumn(cols[2], chosenTwist),
    ]);
    try{ playChord(); }catch(e){}
    addHistory(chosenThing, chosenFor, chosenTwist);
    rollCount++;
    document.getElementById('counterVal').textContent = String(rollCount).padStart(3,'0');

    document.getElementById('rollBtn').disabled = false;
    rolling = false;
}

document.getElementById('rollBtn').addEventListener('click', roll);
window.addEventListener('keydown', (e)=>{
    if(e.code === 'Space'){ e.preventDefault(); roll(); }
});
