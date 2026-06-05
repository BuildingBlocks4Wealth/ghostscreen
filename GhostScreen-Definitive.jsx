import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════
   GHOST SCREEN  ·  THE DEFINITIVE EDITION
   $5/mo · All Features · Human AI Voices · 40+ Languages
   ═══════════════════════════════════════════════════════════════ */

const T = {
  bg0:"#04040e", bg1:"#070712", card:"#0c0c1e", card2:"#101024",
  border:"#1c1c3a", borderHi:"#2a2a50",
  green:"#00f0a0", greenDim:"#00c880",
  red:"#ff2d55", amber:"#ffb830", blue:"#2080ff", indigo:"#6366f1",
  text:"#eeeeff", textSub:"#7070a8", textDim:"#3a3a60", white:"#ffffff",
};
const g=(h,a)=>{const v=h.replace("#","");const r=parseInt(v.slice(0,2),16),gg=parseInt(v.slice(2,4),16),b=parseInt(v.slice(4,6),16);return `rgba(${r},${gg},${b},${a})`;};

/* ── ELEVENLABS VOICE IDs (real production IDs) ── */
const EL_VOICES = {
  aria:   { id:"EXAVITQu4vr4xnSDxMaL", name:"Sarah",   desc:"Professional female · American English" },
  nova:   { id:"FGY2WhTYpPnrIDTdsKH5", name:"Laura",   desc:"Warm female · Friendly tone" },
  luna:   { id:"XB0fDUnXU5powFXDhCwa", name:"Charlotte",desc:"Authoritative female · British" },
  marcus: { id:"TX3LPaxmHKxFdv7VOQHJ", name:"Liam",    desc:"Professional male · Clear & calm" },
  rex:    { id:"bIHbv24MWmeRgasZH58o", name:"Will",    desc:"Commanding male · Deep & firm" },
  sage:   { id:"XrExE9yKIg1WjnnlVkGX", name:"Matilda", desc:"Neutral · Balanced & approachable" },
};

/* ── AVATARS ── */
const AVATARS = [
  { id:"aria",   name:"Aria",   gender:"female",  desc:"Professional · Clear",     emoji:"👩‍💼", color:"#00d4ff" },
  { id:"nova",   name:"Nova",   gender:"female",  desc:"Warm · Friendly",           emoji:"💜",  color:"#c084fc" },
  { id:"luna",   name:"Luna",   gender:"female",  desc:"Firm · Authoritative",      emoji:"🛡️", color:"#f472b6" },
  { id:"marcus", name:"Marcus", gender:"male",    desc:"Professional · Confident",  emoji:"👨‍💼", color:"#60a5fa" },
  { id:"rex",    name:"Rex",    gender:"male",    desc:"Direct · Commanding",       emoji:"⚡",  color:"#f87171" },
  { id:"sage",   name:"Sage",   gender:"neutral", desc:"Balanced · Approachable",   emoji:"✦",   color:T.green  },
  { id:"custom", name:"My Voice", gender:"custom", desc:"Your own recorded voice",  emoji:"🎤",  color:"#ffb830" },
];

const LANGS = [
  {code:"en-US",name:"English",   country:"United States",  flag:"🇺🇸",lang:"en"},
  {code:"en-GB",name:"English",   country:"United Kingdom", flag:"🇬🇧",lang:"en"},
  {code:"en-AU",name:"English",   country:"Australia",      flag:"🇦🇺",lang:"en"},
  {code:"es-ES",name:"Spanish",   country:"Spain",          flag:"🇪🇸",lang:"es"},
  {code:"es-MX",name:"Spanish",   country:"Mexico",         flag:"🇲🇽",lang:"es"},
  {code:"es-US",name:"Spanish",   country:"United States",  flag:"🇺🇸",lang:"es"},
  {code:"fr-FR",name:"French",    country:"France",         flag:"🇫🇷",lang:"fr"},
  {code:"fr-CA",name:"French",    country:"Canada",         flag:"🇨🇦",lang:"fr"},
  {code:"de-DE",name:"German",    country:"Germany",        flag:"🇩🇪",lang:"de"},
  {code:"it-IT",name:"Italian",   country:"Italy",          flag:"🇮🇹",lang:"it"},
  {code:"pt-BR",name:"Portuguese",country:"Brazil",         flag:"🇧🇷",lang:"pt"},
  {code:"pt-PT",name:"Portuguese",country:"Portugal",       flag:"🇵🇹",lang:"pt"},
  {code:"ru-RU",name:"Russian",   country:"Russia",         flag:"🇷🇺",lang:"ru"},
  {code:"zh-CN",name:"Chinese",   country:"China",          flag:"🇨🇳",lang:"zh"},
  {code:"zh-TW",name:"Chinese",   country:"Taiwan",         flag:"🇹🇼",lang:"zh"},
  {code:"ja-JP",name:"Japanese",  country:"Japan",          flag:"🇯🇵",lang:"ja"},
  {code:"ko-KR",name:"Korean",    country:"South Korea",    flag:"🇰🇷",lang:"ko"},
  {code:"ar-SA",name:"Arabic",    country:"Saudi Arabia",   flag:"🇸🇦",lang:"ar"},
  {code:"hi-IN",name:"Hindi",     country:"India",          flag:"🇮🇳",lang:"hi"},
  {code:"nl-NL",name:"Dutch",     country:"Netherlands",    flag:"🇳🇱",lang:"nl"},
  {code:"pl-PL",name:"Polish",    country:"Poland",         flag:"🇵🇱",lang:"pl"},
  {code:"sv-SE",name:"Swedish",   country:"Sweden",         flag:"🇸🇪",lang:"sv"},
  {code:"tr-TR",name:"Turkish",   country:"Turkey",         flag:"🇹🇷",lang:"tr"},
  {code:"vi-VN",name:"Vietnamese",country:"Vietnam",        flag:"🇻🇳",lang:"vi"},
  {code:"th-TH",name:"Thai",      country:"Thailand",       flag:"🇹🇭",lang:"th"},
  {code:"id-ID",name:"Indonesian",country:"Indonesia",      flag:"🇮🇩",lang:"id"},
  {code:"uk-UA",name:"Ukrainian", country:"Ukraine",        flag:"🇺🇦",lang:"uk"},
  {code:"cs-CZ",name:"Czech",     country:"Czech Republic", flag:"🇨🇿",lang:"cs"},
  {code:"ro-RO",name:"Romanian",  country:"Romania",        flag:"🇷🇴",lang:"ro"},
  {code:"el-GR",name:"Greek",     country:"Greece",         flag:"🇬🇷",lang:"el"},
  {code:"he-IL",name:"Hebrew",    country:"Israel",         flag:"🇮🇱",lang:"he"},
  {code:"hu-HU",name:"Hungarian", country:"Hungary",        flag:"🇭🇺",lang:"hu"},
  {code:"da-DK",name:"Danish",    country:"Denmark",        flag:"🇩🇰",lang:"da"},
  {code:"no-NO",name:"Norwegian", country:"Norway",         flag:"🇳🇴",lang:"no"},
  {code:"fi-FI",name:"Finnish",   country:"Finland",        flag:"🇫🇮",lang:"fi"},
  {code:"ms-MY",name:"Malay",     country:"Malaysia",       flag:"🇲🇾",lang:"ms"},
  {code:"tl-PH",name:"Filipino",  country:"Philippines",    flag:"🇵🇭",lang:"tl"},
  {code:"sw-KE",name:"Swahili",   country:"Kenya",          flag:"🇰🇪",lang:"sw"},
  {code:"am-ET",name:"Amharic",   country:"Ethiopia",       flag:"🇪🇹",lang:"am"},
  {code:"yo-NG",name:"Yoruba",    country:"Nigeria",        flag:"🇳🇬",lang:"yo"},
];

const PROMPTS = {
  en:"You've reached a protected number. Please state your full name and reason for calling after the tone.",
  es:"Ha llegado a un número protegido. Por favor, indique su nombre completo y motivo de llamada después del tono.",
  fr:"Vous avez atteint un numéro protégé. Veuillez indiquer votre nom et la raison de votre appel après le bip.",
  de:"Sie haben eine geschützte Nummer erreicht. Bitte nennen Sie Ihren Namen und Grund nach dem Ton.",
  it:"Hai raggiunto un numero protetto. Indica il tuo nome e motivo della chiamata dopo il segnale.",
  pt:"Você alcançou um número protegido. Informe seu nome e motivo da ligação após o sinal.",
  ru:"Вы позвонили на защищённый номер. Назовите своё имя и причину звонка после сигнала.",
  zh:"您拨打了一个受保护的号码，请在提示音后说明您的姓名和来电原因。",
  ja:"保護された番号です。発信音の後にお名前と用件をお話しください。",
  ko:"보호된 번호입니다. 신호음 후 성함과 전화 목적을 말씀해 주세요.",
  ar:"اتصلت برقم محمي. يرجى ذكر اسمك وسبب اتصالك بعد الإشارة.",
  hi:"यह एक सुरक्षित नंबर है। बीप के बाद अपना नाम और कारण बताएं।",
  nl:"U heeft een beveiligd nummer gebeld. Geef na de toon uw naam en reden op.",
  pl:"Zadzwoniłeś na chroniony numer. Po sygnale podaj imię i powód rozmowy.",
  sv:"Du har ringt ett skyddat nummer. Ange ditt namn och anledningen efter tonen.",
  tr:"Korumalı bir numara aradınız. Tondan sonra adınızı ve nedeninizi belirtin.",
  vi:"Bạn gọi đến số được bảo vệ. Vui lòng nêu tên và lý do sau tiếng bíp.",
  th:"คุณโทรมาที่หมายเลขที่ได้รับการปกป้อง กรุณาระบุชื่อและเหตุผลหลังเสียงสัญญาณ",
  id:"Anda menghubungi nomor yang dilindungi. Nyatakan nama dan alasan setelah nada.",
  default:"You've reached a protected number. Please state your full name and reason for calling after the tone.",
};

const CONTACTS_MOCK=[
  {id:"c1", name:"Mom",            phone:"+1 (404) 555-0110",emoji:"❤️"},
  {id:"c2", name:"Dad",            phone:"+1 (404) 555-0111",emoji:"👨"},
  {id:"c3", name:"Dr. Williams",   phone:"+1 (678) 555-0234",emoji:"🏥"},
  {id:"c4", name:"Marcus (Work)",  phone:"+1 (312) 555-0987",emoji:"💼"},
  {id:"c5", name:"Sister Keisha",  phone:"+1 (770) 555-0312",emoji:"👩"},
  {id:"c6", name:"Pastor Brown",   phone:"+1 (404) 555-0450",emoji:"⛪"},
  {id:"c7", name:"Cousin Deja",    phone:"+1 (555) 555-0201",emoji:"🤝"},
  {id:"c8", name:"Dentist Office", phone:"+1 (678) 555-0880",emoji:"🦷"},
  {id:"c9", name:"Employer HR",    phone:"+1 (800) 555-0300",emoji:"🏢"},
  {id:"c10",name:"Best Friend Tony",phone:"+1 (214) 555-0566",emoji:"😎"},
  {id:"c11",name:"Grandma Rose",   phone:"+1 (229) 555-0144",emoji:"👵"},
  {id:"c12",name:"Attorney James", phone:"+1 (404) 555-0720",emoji:"⚖️"},
  {id:"c13",name:"School Office",  phone:"+1 (770) 555-0190",emoji:"🏫"},
  {id:"c14",name:"Mechanic Ray",   phone:"+1 (678) 555-0654",emoji:"🔧"},
  {id:"c15",name:"Neighbor Maria", phone:"+1 (404) 555-0391",emoji:"🏠"},
];

const CALLS_SEED=[
  {id:1,num:"+1 (800) 449-7723",name:"Unknown Caller",   t:"2:14 PM",d:"Today",    s:"fl",tag:"collector",emo:"⚠️",out:"declined",
   trans:"This is John Reed from Midland Credit Management regarding your account ending in 4471. You have a past due balance.",kw:["account","past due","balance"],dur:"0:23",agency:"Midland Credit Mgmt."},
  {id:2,num:"+1 (404) 555-0110",name:"Mom",              t:"1:52 PM",d:"Today",    s:"by",tag:"vip",      emo:"❤️",out:"bypassed",trans:null,kw:[],vipName:"Mom"},
  {id:3,num:"+1 (213) 774-0089",name:"Unknown Caller",   t:"1:30 PM",d:"Today",    s:"pe",tag:"unknown",  emo:"❓",out:"pending", trans:null,kw:[]},
  {id:4,num:"+1 (678) 903-2211",name:"Dr. Williams",     t:"11:08 AM",d:"Today",   s:"sa",tag:"safe",     emo:"✅",out:"answered",
   trans:"Tanya from Dr. Williams' office confirming your appointment Thursday at 2pm.",kw:[],dur:"0:18"},
  {id:5,num:"+1 (877) 322-8019",name:"Unknown Caller",   t:"9:44 AM",d:"Today",    s:"bl",tag:"collector",emo:"🚫",out:"blocked",
   trans:"Final notice regarding your overdue account before we proceed with legal action.",kw:["overdue","account","legal","final notice"],dur:"0:31",agency:"Portfolio Recovery"},
  {id:6,num:"+1 (312) 555-0987",name:"Marcus (Work)",    t:"8:15 AM",d:"Today",    s:"by",tag:"vip",      emo:"💼",out:"bypassed",trans:null,kw:[],vipName:"Marcus"},
  {id:7,num:"+1 (800) 772-1213",name:"Unknown Caller",   t:"6:02 PM",d:"Yesterday",s:"bl",tag:"collector",emo:"🚫",out:"blocked",
   trans:"Calling regarding your delinquent balance. Contact us immediately to settle this debt.",kw:["delinquent","balance","settle","debt"],dur:"0:19",agency:"SSA Collections"},
  {id:8,num:"+1 (555) 201-4490",name:"Cousin Deja",      t:"1:15 PM",d:"Yesterday",s:"sa",tag:"safe",     emo:"✅",out:"answered",
   trans:"Hey it's Deja! Just calling to catch up when you get a chance.",kw:[],dur:"0:12"},
];

const INIT_SCHEDS=[
  {id:1,name:"Work Hours",days:[1,2,3,4,5],start:"08:00",end:"18:00",active:true,icon:"💼"},
  {id:2,name:"Weekends",  days:[0,6],       start:"09:00",end:"20:00",active:true,icon:"🏖️"},
  {id:3,name:"Late Night",days:[0,1,2,3,4,5,6],start:"21:00",end:"23:59",active:false,icon:"🌙"},
];
const INIT_VIP=[
  {id:"c1",name:"Mom",         num:"+1 (404) 555-0110",emoji:"❤️"},
  {id:"c3",name:"Dr. Williams",num:"+1 (678) 555-0234",emoji:"🏥"},
  {id:"c4",name:"Marcus (Work)",num:"+1 (312) 555-0987",emoji:"💼"},
];

const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const OUTCOME_ICON={answered:"📞",declined:"📵",blocked:"🚫",bypassed:"⭐",pending:"⏳"};
const SS={fl:{bg:g(T.red,.09),bb:g(T.red,.32)},sa:{bg:g(T.green,.09),bb:g(T.green,.32)},by:{bg:g(T.amber,.09),bb:g(T.amber,.32)},bl:{bg:g(T.textSub,.07),bb:g(T.textSub,.18)},pe:{bg:g(T.blue,.09),bb:g(T.blue,.32)}};
const TAG={collector:[T.red,g(T.red,.09),g(T.red,.25),"🚨 Collector"],safe:[T.green,g(T.green,.09),g(T.green,.25),"✅ Verified"],vip:[T.amber,g(T.amber,.09),g(T.amber,.25),"⭐ VIP"],unknown:[T.blue,g(T.blue,.09),g(T.blue,.25),"⏳ Screening"]};

/* ═══════════════════════════════════════════════════════════════
   ELEVENLABS VOICE ENGINE
   Human-quality · Not robotic · Real voices
   ═══════════════════════════════════════════════════════════════ */
async function speakElevenLabs(text, voiceId, apiKey, onStart, onEnd, onError) {
  try {
    onStart();
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.85,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });
    if (!res.ok) throw new Error(`ElevenLabs error: ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.onended = () => { URL.revokeObjectURL(url); onEnd(); };
    audio.onerror = () => { URL.revokeObjectURL(url); onError("Audio playback error"); };
    await audio.play();
    return audio;
  } catch (err) {
    onError(err.message);
    return null;
  }
}

/* Fallback: browser speech synthesis (better settings to reduce robotic feel) */
function speakBrowser(text, langCode, gender, onStart, onEnd) {
  if (!window.speechSynthesis) { onEnd(); return; }
  window.speechSynthesis.cancel();
  const doSpeak = () => {
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = langCode;
    const voices = window.speechSynthesis.getVoices();
    const root = langCode.split("-")[0].toLowerCase();
    const inLang = voices.filter(v => v.lang.toLowerCase().startsWith(root));
    // Prefer Google or Apple voices — they sound best
    const premium = inLang.find(v => v.name.includes("Google") || v.name.includes("Siri") || v.name.includes("Samantha") || v.name.includes("Daniel") || v.name.includes("Karen") || v.name.includes("Moira"));
    const femaleHints=["samantha","victoria","tessa","ava","allison","zira","karen","moira","google uk english female"];
    const maleHints  =["daniel","alex","david","mark","thomas","oliver","google uk english male"];
    const hintMatch = inLang.find(v => (gender==="female"?femaleHints:maleHints).some(h=>v.name.toLowerCase().includes(h)));
    utt.voice = premium || hintMatch || inLang[0] || voices.find(v=>v.lang.startsWith("en")) || voices[0];
    utt.rate = 0.86;
    utt.pitch = gender === "female" ? 1.05 : gender === "male" ? 0.82 : 0.95;
    utt.volume = 1.0;
    utt.onstart = onStart;
    utt.onend = onEnd;
    utt.onerror = onEnd;
    window.speechSynthesis.speak(utt);
  };
  const v = window.speechSynthesis.getVoices();
  if (v.length) doSpeak();
  else { window.speechSynthesis.onvoiceschanged = () => { doSpeak(); window.speechSynthesis.onvoiceschanged = null; }; setTimeout(doSpeak, 1200); }
}

/* ═══════════════════════════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&family=DM+Serif+Display:ital@0;1&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html{background:${T.bg0};overscroll-behavior:none;}
body{background:${T.bg0};color:${T.text};font-family:'Sora',sans-serif;min-height:100vh;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
button,input,select,textarea{font-family:'Sora',sans-serif;outline:none;border:none;}
input[type=time]::-webkit-calendar-picker-indicator{filter:invert(.5);}
select option{background:${T.card};color:${T.text};}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:2px;}
.root{position:relative;z-index:1;max-width:430px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;padding-bottom:100px;}
.layer-bg{position:fixed;inset:0;z-index:0;pointer-events:none;
  background:radial-gradient(ellipse 800px 600px at -10% -10%,${g(T.green,.055)} 0%,transparent 60%),
             radial-gradient(ellipse 600px 600px at 110% 110%,${g(T.indigo,.07)} 0%,transparent 60%),
             radial-gradient(ellipse 400px 400px at 50% 40%,${g(T.blue,.03)} 0%,transparent 60%),${T.bg0};}
.layer-grid{position:fixed;inset:0;z-index:0;pointer-events:none;
  background-image:linear-gradient(${g(T.green,.018)} 1px,transparent 1px),linear-gradient(90deg,${g(T.green,.018)} 1px,transparent 1px);
  background-size:40px 40px;}

/* ── SPLASH ── */
.splash{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 32px;text-align:center;position:relative;}
.splash-canvas{position:absolute;inset:0;width:100%;height:100%;}
.sp-logo-wrap{position:relative;display:flex;flex-direction:column;align-items:center;margin-bottom:40px;z-index:1;}
.sp-shield{position:relative;width:120px;height:120px;margin-bottom:20px;}
.sh-outer{position:absolute;inset:0;border-radius:50% 50% 44% 44%;background:linear-gradient(160deg,${g(T.green,.18)},${g(T.indigo,.12)});border:1.5px solid ${g(T.green,.35)};animation:sh-pulse 3s ease-in-out infinite;}
@keyframes sh-pulse{0%,100%{box-shadow:0 0 30px ${g(T.green,.2)},0 0 60px ${g(T.green,.08)};}50%{box-shadow:0 0 50px ${g(T.green,.38)},0 0 100px ${g(T.green,.16)};}}
.sh-ring1{position:absolute;inset:-12px;border-radius:50% 50% 44% 44%;border:1px solid ${g(T.green,.12)};animation:sh-ring 2.8s ease-in-out infinite;}
.sh-ring2{position:absolute;inset:-24px;border-radius:50% 50% 44% 44%;border:1px solid ${g(T.green,.06)};animation:sh-ring 2.8s ease-in-out infinite .6s;}
@keyframes sh-ring{0%,100%{transform:scale(1);opacity:.5;}50%{transform:scale(1.06);opacity:.1;}}
.sh-ghost{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:52px;filter:drop-shadow(0 0 20px ${g(T.green,.5)});animation:gf 3s ease-in-out infinite;}
@keyframes gf{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-8px) rotate(1deg);}}
.sp-wordmark{font-family:'DM Serif Display',serif;font-size:48px;color:#fff;line-height:1;letter-spacing:-1px;animation:wi .8s ease .2s both;}
.sp-wordmark em{font-style:italic;color:${T.green};}
@keyframes wi{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
.sp-tag{font-size:11px;letter-spacing:3px;color:${T.textSub};text-transform:uppercase;font-weight:500;animation:wi .8s ease .4s both;}
.flags-wrap{width:100%;overflow:hidden;margin:28px 0;position:relative;z-index:1;}
.flags-wrap::before,.flags-wrap::after{content:'';position:absolute;top:0;bottom:0;width:50px;z-index:2;pointer-events:none;}
.flags-wrap::before{left:0;background:linear-gradient(90deg,${T.bg0},transparent);}
.flags-wrap::after{right:0;background:linear-gradient(-90deg,${T.bg0},transparent);}
.flags-track{display:flex;gap:12px;animation:marquee 22s linear infinite;width:max-content;}
.flags-track span{font-size:22px;}
@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
.sp-cta{width:100%;display:flex;flex-direction:column;gap:11px;z-index:1;animation:wi .8s ease .6s both;}
.btn-primary{width:100%;padding:18px 24px;border-radius:16px;background:linear-gradient(135deg,${T.green},${T.greenDim});color:#000;font-size:16px;font-weight:700;letter-spacing:.3px;position:relative;overflow:hidden;transition:all .25s;box-shadow:0 8px 32px ${g(T.green,.28)},0 0 0 1px ${g(T.green,.2)};}
.btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent);pointer-events:none;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 44px ${g(T.green,.42)};}
.btn-primary:active{transform:translateY(0);}
.btn-secondary{width:100%;padding:15px 24px;border-radius:15px;border:1px solid ${T.border};color:${T.textSub};font-size:14px;font-weight:600;transition:all .2s;background:transparent;}
.btn-secondary:hover{border-color:${T.borderHi};color:${T.text};background:${g(T.white,.03)};}
.sp-trust{display:flex;gap:16px;justify-content:center;margin-top:18px;flex-wrap:wrap;z-index:1;}
.trust-item{font-size:10px;color:${T.textDim};font-weight:500;letter-spacing:.3px;}

/* ── PRICING ── */
.pricing-screen{min-height:100vh;display:flex;flex-direction:column;padding:0 22px 40px;overflow-y:auto;}
.screen-hdr{display:flex;align-items:center;padding:20px 0 24px;gap:12px;}
.btn-back{display:flex;align-items:center;gap:6px;color:${T.textSub};font-size:13px;font-weight:600;padding:8px 14px;border-radius:10px;border:1px solid ${T.border};background:${g(T.white,.03)};transition:all .2s;flex-shrink:0;}
.btn-back:hover{color:${T.text};border-color:${T.borderHi};}
.screen-label{font-size:12px;color:${T.textSub};font-weight:600;letter-spacing:.5px;text-transform:uppercase;}

/* PRICE HERO */
.price-hero{background:linear-gradient(140deg,${g(T.green,.08)},${g(T.blue,.04)});border:1px solid ${g(T.green,.38)};border-radius:26px;padding:36px 28px;text-align:center;margin-bottom:22px;position:relative;overflow:hidden;}
.price-hero::before{content:'';position:absolute;top:0;left:20px;right:20px;height:1.5px;background:linear-gradient(90deg,transparent,${T.green},transparent);}
.ph-eyebrow{font-size:11px;font-family:'Space Mono',monospace;letter-spacing:2px;color:${T.green};text-transform:uppercase;margin-bottom:16px;}
.ph-price-wrap{display:flex;align-items:flex-start;justify-content:center;gap:4px;margin-bottom:6px;}
.ph-dollar{font-size:28px;font-weight:800;color:${T.white};margin-top:10px;}
.ph-amount{font-family:'DM Serif Display',serif;font-size:88px;color:${T.white};line-height:1;}
.ph-per{font-size:16px;color:${T.textSub};font-weight:400;align-self:flex-end;margin-bottom:14px;}
.ph-sub{font-size:14px;color:${T.textSub};margin-bottom:6px;}
.ph-trial{display:inline-block;background:${g(T.green,.12)};color:${T.green};font-size:11px;font-weight:700;font-family:'Space Mono',monospace;padding:4px 14px;border-radius:20px;border:1px solid ${g(T.green,.28)};letter-spacing:.5px;margin-top:8px;}

/* FEATURES */
.features-grid{display:flex;flex-direction:column;gap:9px;margin-bottom:22px;}
.feat-row{display:flex;align-items:center;gap:14px;padding:14px 16px;background:${T.card};border:1px solid ${T.border};border-radius:15px;transition:border-color .2s;}
.feat-row:hover{border-color:${T.borderHi};}
.feat-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;}
.feat-text strong{display:block;font-size:14px;font-weight:700;color:${T.white};margin-bottom:2px;}
.feat-text span{font-size:11px;color:${T.textSub};}
.feat-check{margin-left:auto;color:${T.green};font-size:14px;font-weight:700;flex-shrink:0;}
.comparison-note{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:18px;margin-bottom:16px;}
.cn-title{font-size:13px;font-weight:700;color:${T.white};margin-bottom:10px;}
.cn-row{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid ${T.bg0};font-size:12px;}
.cn-row:last-child{border-bottom:none;}
.cn-app{color:${T.textSub};}
.cn-us{color:${T.green};font-weight:700;}
.price-terms{font-size:11px;color:${T.textDim};text-align:center;margin-top:14px;line-height:1.7;font-family:'Space Mono',monospace;}

/* ── WIZARD ── */
.wizard{min-height:100vh;display:flex;flex-direction:column;}
.wiz-head{padding:20px 22px 0;}
.wiz-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.wiz-step-lbl{font-size:11px;color:${T.textSub};font-weight:600;letter-spacing:.5px;font-family:'Space Mono',monospace;}
.btn-skip{color:${T.textSub};font-size:12px;font-weight:600;padding:6px 10px;transition:color .2s;}
.btn-skip:hover{color:${T.text};}
.pip-row{display:flex;gap:5px;margin-bottom:22px;}
.pip{flex:1;height:3px;border-radius:2px;background:${T.card2};transition:all .5s;}
.pip.done{background:${T.green};}
.pip.cur{background:linear-gradient(90deg,${T.green},${g(T.green,.4)});}
.wiz-title{font-family:'DM Serif Display',serif;font-size:28px;color:${T.white};line-height:1.1;margin-bottom:8px;}
.wiz-title em{font-style:italic;color:${T.green};}
.wiz-sub{font-size:13px;color:${T.textSub};line-height:1.65;margin-bottom:20px;}
.wiz-body{flex:1;padding:0 22px;overflow-y:auto;}
.wiz-foot{padding:16px 22px 28px;border-top:1px solid ${T.border};background:${T.bg0};}
.btn-wiz-next{width:100%;padding:16px;border-radius:14px;background:linear-gradient(135deg,${T.green},${T.greenDim});color:#000;font-size:15px;font-weight:700;transition:all .2s;box-shadow:0 4px 20px ${g(T.green,.25)};}
.btn-wiz-next:hover{transform:translateY(-1px);box-shadow:0 8px 30px ${g(T.green,.4)};}
.btn-wiz-next:disabled{opacity:.35;transform:none;cursor:not-allowed;}

/* ── LANG PICKER ── */
.search-wrap{position:relative;margin-bottom:10px;}
.search-ico{position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:14px;pointer-events:none;color:${T.textSub};}
.search-input{width:100%;background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:12px 14px 12px 40px;color:${T.white};font-size:14px;font-family:'Sora',sans-serif;transition:border-color .2s;}
.search-input:focus{border-color:${g(T.green,.5)};}
.search-input::placeholder{color:${T.textDim};}
.lang-list{display:flex;flex-direction:column;gap:6px;max-height:340px;overflow-y:auto;padding-right:3px;}
.lang-item{display:flex;align-items:center;gap:13px;padding:12px 15px;background:${T.card};border:1px solid ${T.border};border-radius:13px;cursor:pointer;transition:all .2s;}
.lang-item:hover{border-color:${g(T.green,.28)};background:${g(T.green,.03)};}
.lang-item.sel{border-color:${g(T.green,.5)};background:${g(T.green,.06)};}
.li-flag{font-size:26px;flex-shrink:0;}
.li-name{font-size:14px;font-weight:700;color:${T.white};display:block;}
.li-country{font-size:11px;color:${T.textSub};font-family:'Space Mono',monospace;margin-top:1px;display:block;}
.li-check{font-size:14px;color:${T.green};margin-left:auto;flex-shrink:0;}

/* ── AVATAR CARDS ── */
.gender-tabs{display:flex;gap:6px;margin-bottom:14px;}
.gender-tab{padding:7px 14px;border-radius:20px;border:1px solid ${T.border};color:${T.textSub};font-size:12px;font-weight:700;transition:all .2s;background:transparent;}
.gender-tab.on{background:${T.green};color:#000;border-color:${T.green};}
.av-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;}
.av-card{background:${T.card};border:1.5px solid ${T.border};border-radius:18px;padding:20px 14px;text-align:center;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;}
.av-card.sel{transform:scale(1.02);}
.av-card-glow{position:absolute;inset:0;opacity:0;transition:opacity .3s;pointer-events:none;}
.av-card.sel .av-card-glow{opacity:1;}
.av-active-tag{position:absolute;top:10px;right:10px;font-size:9px;font-family:'Space Mono',monospace;padding:2px 7px;border-radius:6px;font-weight:700;letter-spacing:.4px;}
.av-emoji-ring{width:70px;height:70px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:34px;margin:0 auto 12px;transition:all .3s;border:1.5px solid;}
.av-name{font-size:15px;font-weight:800;color:${T.white};margin-bottom:3px;transition:color .2s;}
.av-desc{font-size:10px;color:${T.textSub};font-family:'Space Mono',monospace;letter-spacing:.3px;margin-bottom:6px;}
.av-gender-chip{display:inline-block;font-size:9px;font-family:'Space Mono',monospace;padding:2px 8px;border-radius:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}

/* ── AVATAR SPEAKER ── */
.av-speaker{background:${T.card};border:1px solid ${T.border};border-radius:22px;padding:28px 20px;text-align:center;margin-bottom:14px;position:relative;overflow:hidden;}
.av-sp-bg{position:absolute;inset:0;pointer-events:none;transition:background .5s;}
.av-orb-outer{position:relative;width:110px;height:110px;margin:0 auto 16px;}
.ring-a{position:absolute;inset:-8px;border-radius:50%;border:1.5px solid;animation:ra 2.2s ease-in-out infinite;}
.ring-b{position:absolute;inset:-18px;border-radius:50%;border:1px solid;animation:ra 2.2s ease-in-out infinite .55s;}
@keyframes ra{0%,100%{transform:scale(1);opacity:.45;}50%{transform:scale(1.08);opacity:.1;}}
.av-orb{width:110px;height:110px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:52px;border:2px solid;transition:all .4s;}
.av-sp-name{font-size:20px;font-weight:800;margin-bottom:3px;transition:color .3s;}
.av-sp-role{font-size:11px;color:${T.textSub};margin-bottom:4px;font-family:'Space Mono',monospace;letter-spacing:.4px;}
.av-voice-quality{font-size:10px;color:${T.green};font-family:'Space Mono',monospace;letter-spacing:.5px;margin-bottom:18px;}
.sound-bars{display:flex;align-items:flex-end;justify-content:center;gap:4px;height:40px;margin-bottom:14px;}
.sb{width:5px;border-radius:3px;min-height:4px;transition:height .1s ease;}
.av-sp-status{font-size:10px;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;}
.av-prompt-txt{font-size:12px;color:${T.textSub};font-style:italic;line-height:1.75;margin-top:14px;padding-top:14px;border-top:1px solid ${T.border};width:100%;text-align:center;}

/* ── API KEY INPUT ── */
.api-key-section{background:${g(T.amber,.06)};border:1px solid ${g(T.amber,.22)};border-radius:16px;padding:16px;margin-bottom:14px;}
.ak-title{font-size:13px;font-weight:700;color:${T.white};margin-bottom:4px;display:flex;align-items:center;gap:8px;}
.ak-sub{font-size:11px;color:${T.textSub};margin-bottom:12px;line-height:1.6;}
.ak-input-row{display:flex;gap:8px;}
.ak-input{flex:1;background:${T.bg0};border:1px solid ${T.border};border-radius:10px;padding:10px 13px;color:${T.white};font-size:12px;font-family:'Space Mono',monospace;transition:border-color .2s;}
.ak-input:focus{border-color:${g(T.amber,.5)};}
.ak-input::placeholder{color:${T.textDim};font-size:11px;}
.ak-save{padding:10px 14px;border-radius:10px;background:${T.amber};color:#000;font-size:12px;font-weight:800;flex-shrink:0;transition:all .2s;}
.ak-save:hover{box-shadow:0 4px 16px ${g(T.amber,.4)};}
.ak-status{display:flex;align-items:center;gap:6px;margin-top:10px;font-size:11px;font-family:'Space Mono',monospace;}
.ak-status.ok{color:${T.green};}
.ak-status.demo{color:${T.amber};}
.ak-link{color:${T.blue};text-decoration:underline;cursor:pointer;}

/* ── CONTACTS ── */
.contacts-perm{background:linear-gradient(140deg,${g(T.blue,.1)},${g(T.green,.06)});border:1px solid ${g(T.blue,.28)};border-radius:20px;padding:28px 22px;text-align:center;margin-bottom:14px;}
.cp-icon{font-size:52px;display:block;margin-bottom:14px;animation:gf 3s ease-in-out infinite;}
.cp-title{font-family:'DM Serif Display',serif;font-size:22px;color:${T.white};margin-bottom:8px;}
.cp-desc{font-size:13px;color:${T.textSub};line-height:1.7;margin-bottom:22px;}
.btn-allow{width:100%;padding:15px;border-radius:14px;background:linear-gradient(135deg,${T.blue},${T.indigo});color:#fff;font-size:15px;font-weight:700;transition:all .2s;box-shadow:0 6px 22px ${g(T.blue,.28)};}
.btn-allow:hover{transform:translateY(-1px);}
.btn-skip-ct{width:100%;padding:12px;border-radius:12px;border:1px solid ${T.border};color:${T.textSub};font-size:13px;font-weight:600;margin-top:10px;transition:all .2s;}
.sel-bar{display:flex;align-items:center;justify-content:space-between;background:${g(T.green,.07)};border:1px solid ${g(T.green,.2)};border-radius:11px;padding:10px 15px;margin-bottom:10px;}
.sel-count{color:${T.green};font-size:13px;font-weight:700;font-family:'Space Mono',monospace;}
.btn-clear{color:${T.textSub};font-size:12px;font-weight:600;}
.contact-list{display:flex;flex-direction:column;gap:6px;max-height:340px;overflow-y:auto;padding-right:2px;}
.ct-item{display:flex;align-items:center;gap:13px;padding:13px 15px;background:${T.card};border:1px solid ${T.border};border-radius:14px;cursor:pointer;transition:all .2s;}
.ct-item:hover{border-color:${g(T.blue,.28)};}
.ct-item.sel{border-color:${g(T.green,.45)};background:${g(T.green,.05)};}
.ct-av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0;background:${T.card2};border:1px solid ${T.border};transition:all .2s;}
.ct-item.sel .ct-av{background:${g(T.green,.12)};border-color:${g(T.green,.35)};}
.ct-name{font-size:14px;font-weight:700;color:${T.white};display:block;}
.ct-phone{font-size:11px;color:${T.textSub};font-family:'Space Mono',monospace;display:block;margin-top:2px;}
.ct-check{width:22px;height:22px;border-radius:50%;border:1.5px solid ${T.border};display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-left:auto;transition:all .2s;font-weight:700;}
.ct-item.sel .ct-check{background:${T.green};border-color:${T.green};color:#000;}

/* ── INSTALL ── */
.inst-steps{display:flex;flex-direction:column;gap:10px;}
.inst-step{display:flex;align-items:center;gap:14px;padding:14px 16px;background:${T.card};border:1px solid ${T.border};border-radius:15px;transition:all .6s;}
.inst-step.done{border-color:${g(T.green,.3)};background:${g(T.green,.04)};}
.inst-step.cur{border-color:${g(T.amber,.3)};background:${g(T.amber,.04)};}
.inst-dot{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;transition:all .6s;font-weight:700;}
.inst-dot.done{background:${g(T.green,.15)};color:${T.green};border:1px solid ${g(T.green,.3)};}
.inst-dot.cur{background:${g(T.amber,.15)};color:${T.amber};border:1px solid ${g(T.amber,.3)};animation:spin 1.5s linear infinite;}
.inst-dot.wait{background:${T.card2};color:${T.textDim};border:1px solid ${T.border};}
@keyframes spin{to{transform:rotate(360deg);}}
.inst-lbl{font-size:14px;font-weight:700;display:block;color:${T.white};transition:color .4s;}
.inst-step.done .inst-lbl{color:${T.green};}
.inst-step.cur .inst-lbl{color:${T.amber};}
.inst-sub{font-size:11px;color:${T.textSub};font-family:'Space Mono',monospace;display:block;margin-top:2px;}

/* ── MAIN APP ── */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 20px 0;}
.brand{display:flex;align-items:center;gap:10px;}
.brand-icon{width:38px;height:38px;border-radius:50% 50% 40% 40%;background:linear-gradient(150deg,${T.green},${T.greenDim});display:flex;align-items:center;justify-content:center;font-size:19px;box-shadow:0 0 22px ${g(T.green,.38)},0 4px 12px ${g(T.green,.2)};}
.brand-name{font-family:'DM Serif Display',serif;font-size:22px;color:${T.white};letter-spacing:-.3px;}
.brand-name em{font-style:italic;color:${T.green};}
.tb-right{display:flex;align-items:center;gap:8px;}
.lang-pill{display:flex;align-items:center;gap:5px;padding:6px 11px;background:${T.card};border:1px solid ${T.border};border-radius:9px;cursor:pointer;transition:all .2s;}
.lang-pill:hover{border-color:${T.borderHi};}
.lp-code{font-family:'Space Mono',monospace;font-size:9px;color:${T.textSub};}
.ver-tag{font-family:'Space Mono',monospace;font-size:9px;color:${T.textDim};background:${T.card};padding:3px 8px;border-radius:6px;border:1px solid ${T.border};}
.notif-btn{width:36px;height:36px;border-radius:10px;background:${T.card};border:1px solid ${T.border};display:flex;align-items:center;justify-content:center;font-size:15px;position:relative;cursor:pointer;}
.notif-dot{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:${T.red};border:2px solid ${T.bg0};font-size:8px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;}
.master-wrap{margin:14px 20px 0;}
.master-card{border-radius:24px;overflow:hidden;transition:all .4s;position:relative;}
.master-card.on{background:linear-gradient(140deg,${g(T.green,.1)},${g(T.green,.04)});border:1px solid ${g(T.green,.35)};}
.master-card.off{background:${T.card};border:1px solid ${T.border};}
.master-card::before{content:'';position:absolute;top:0;left:20px;right:20px;height:1px;background:linear-gradient(90deg,transparent,${g(T.green,.35)},transparent);transition:opacity .4s;}
.master-card.off::before{opacity:0;}
.mc-body{display:flex;align-items:center;gap:14px;padding:18px 20px 14px;}
.mc-shield{width:52px;height:52px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;position:relative;transition:all .4s;}
.mc-shield.on{background:${g(T.green,.12)};border:1.5px solid ${g(T.green,.35)};box-shadow:0 0 24px ${g(T.green,.25)};}
.mc-shield.off{background:${T.card2};border:1.5px solid ${T.border};opacity:.4;}
.mc-pulse{position:absolute;inset:-7px;border-radius:50%;border:1px solid ${g(T.green,.22)};animation:ra 2.2s infinite;}
.mc-info{flex:1;}
.mc-heading{font-size:19px;font-weight:800;color:${T.white};}
.mc-sub{font-size:11px;font-family:'Space Mono',monospace;margin-top:3px;transition:color .3s;}
.mc-sub.on{color:${T.green};}
.mc-sub.off{color:${T.textSub};}
.mc-av{width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;border:1.5px solid;transition:all .3s;}
.big-tog{width:64px;height:34px;border-radius:17px;position:relative;flex-shrink:0;transition:background .3s;border:none;}
.big-tog.on{background:${T.green};box-shadow:0 0 16px ${g(T.green,.45)};}
.big-tog.off{background:${T.card2};border:1px solid ${T.border};}
.tog-dot{position:absolute;top:4px;width:26px;height:26px;border-radius:50%;background:${T.white};box-shadow:0 2px 8px rgba(0,0,0,.35);transition:left .28s cubic-bezier(.34,1.56,.64,1);}
.big-tog.on .tog-dot{left:34px;}
.big-tog.off .tog-dot{left:4px;}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid ${T.border};}
.stat-cell{padding:12px 6px;text-align:center;border-right:1px solid ${T.border};}
.stat-cell:last-child{border-right:none;}
.stat-num{font-family:'DM Serif Display',serif;font-size:28px;line-height:1;}
.stat-lbl{font-size:9px;font-family:'Space Mono',monospace;color:${T.textSub};text-transform:uppercase;letter-spacing:.6px;margin-top:2px;}
.live-alert{margin:12px 20px 0;border-radius:16px;padding:13px 16px;display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,${g(T.red,.1)},${g(T.red,.04)});border:1px solid ${g(T.red,.35)};animation:al-in .4s cubic-bezier(.34,1.56,.64,1);}
@keyframes al-in{from{transform:translateY(-10px);opacity:0;}to{transform:translateY(0);opacity:1;}}
.live-dot{width:9px;height:9px;border-radius:50%;background:${T.red};box-shadow:0 0 9px ${T.red};flex-shrink:0;animation:blink 1s infinite;}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.15;}}
.la-info strong{display:block;font-size:13px;color:${T.white};font-weight:700;}
.la-info span{font-size:10px;color:${T.textSub};font-family:'Space Mono',monospace;}
.la-btns{display:flex;gap:7px;}
.la-btn{padding:7px 11px;border-radius:8px;font-size:11px;font-weight:700;transition:all .2s;}
.la-listen{background:${g(T.red,.18)};color:${T.red};border:1px solid ${g(T.red,.32)};}
.la-dismiss{background:${T.card};border:1px solid ${T.border};color:${T.textSub};}
.nav-bar{display:flex;gap:3px;margin:14px 20px 0;background:${T.card};border-radius:18px;padding:5px;border:1px solid ${T.border};}
.nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:9px 2px;border-radius:13px;font-size:9px;font-weight:700;color:${T.textSub};transition:all .2s;line-height:1;}
.nav-btn .nav-icon{font-size:17px;display:block;margin-bottom:2px;}
.nav-btn.on{background:${T.green};color:#000;box-shadow:0 2px 14px ${g(T.green,.35)};}
.sec{padding:13px 20px 0;}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.sec-title{font-size:18px;font-weight:800;color:${T.white};}
.btn-add{display:flex;align-items:center;gap:5px;padding:8px 13px;border-radius:10px;border:1px solid ${T.border};background:${T.card};color:${T.green};font-size:12px;font-weight:700;transition:all .2s;}
.btn-add:hover{background:${g(T.green,.08)};border-color:${g(T.green,.35)};}
.stat-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:12px;}
.sm{background:${T.card};border:1px solid ${T.border};border-radius:14px;padding:11px 8px;text-align:center;}
.sm-num{font-family:'DM Serif Display',serif;font-size:26px;line-height:1;}
.sm-lbl{font-size:9px;font-family:'Space Mono',monospace;color:${T.textSub};text-transform:uppercase;letter-spacing:.5px;margin-top:3px;}
.exp-bar{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,${g(T.indigo,.1)},${g(T.blue,.05)});border:1px solid ${g(T.indigo,.28)};border-radius:14px;padding:13px 16px;margin-bottom:12px;}
.exp-info strong{display:block;font-size:13px;color:${T.white};font-weight:700;}
.exp-info span{font-size:10px;color:${T.textSub};font-family:'Space Mono',monospace;}
.btn-export{padding:9px 16px;border-radius:10px;background:${T.indigo};color:#fff;font-size:12px;font-weight:700;flex-shrink:0;transition:all .2s;}
.btn-export:hover{box-shadow:0 4px 16px ${g(T.indigo,.45)};}
.filter-bar{display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;margin-bottom:12px;}
.filter-bar::-webkit-scrollbar{display:none;}
.fc{padding:6px 13px;border-radius:20px;border:1px solid ${T.border};color:${T.textSub};font-size:10px;font-weight:700;font-family:'Space Mono',monospace;white-space:nowrap;transition:all .2s;background:transparent;}
.fc.on{background:${T.green};color:#000;border-color:${T.green};}
.date-div{display:flex;align-items:center;gap:10px;margin:14px 0 9px;font-size:10px;font-family:'Space Mono',monospace;color:${T.textDim};letter-spacing:1px;text-transform:uppercase;}
.date-div::before,.date-div::after{content:'';flex:1;height:1px;background:${T.border};}
.receipt{background:${T.card};border:1px solid ${T.border};border-radius:18px;margin-bottom:9px;overflow:hidden;transition:all .25s;}
.receipt.fl{border-left:3px solid ${T.red};}
.receipt.sa{border-left:3px solid ${T.green};}
.receipt.by{border-left:3px solid ${T.amber};}
.receipt.bl{border-left:3px solid ${T.textSub};}
.receipt.pe{border-left:3px solid ${T.blue};}
.receipt.open{border-color:${g(T.green,.28)};box-shadow:0 6px 24px ${g(T.green,.06)};}
.rc-row{display:flex;align-items:center;gap:12px;padding:14px 14px 12px;cursor:pointer;user-select:none;}
.rc-av{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0;}
.rc-mid{flex:1;min-width:0;}
.rc-num{font-family:'Space Mono',monospace;font-size:13px;font-weight:700;color:${T.white};letter-spacing:.3px;margin-bottom:2px;}
.rc-name{font-size:12px;color:${T.textSub};margin-bottom:5px;}
.rc-tags{display:flex;gap:5px;flex-wrap:wrap;}
.rtag{font-size:9px;font-family:'Space Mono',monospace;padding:2px 7px;border-radius:5px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;}
.rc-right{text-align:right;flex-shrink:0;}
.rc-ico{font-size:20px;margin-bottom:3px;}
.rc-time{font-size:10px;color:${T.textSub};font-family:'Space Mono',monospace;}
.chev{font-size:10px;color:${T.textDim};display:block;margin-top:3px;transition:transform .2s;}
.chev.open{transform:rotate(180deg);}
.rc-detail{border-top:1px solid ${T.border};padding:15px;animation:di .2s ease;}
@keyframes di{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
.dt-table{background:${T.card2};border-radius:13px;overflow:hidden;margin-bottom:13px;}
.dt-row{display:flex;align-items:flex-start;justify-content:space-between;padding:9px 14px;border-bottom:1px solid ${T.border};gap:10px;}
.dt-row:last-child{border-bottom:none;}
.dt-key{font-size:10px;font-family:'Space Mono',monospace;color:${T.textSub};text-transform:uppercase;letter-spacing:.6px;flex-shrink:0;}
.dt-val{font-size:12px;color:${T.text};font-weight:600;text-align:right;max-width:58%;word-break:break-word;}
.dt-val.g{color:${T.green};}
.dt-val.r{color:${T.red};}
.rec-player{background:${T.bg0};border:1px solid ${T.border};border-radius:13px;padding:13px;margin-bottom:12px;}
.rp-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.rp-lbl{font-size:10px;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:1px;color:${T.textSub};}
.rp-alert{font-size:10px;font-family:'Space Mono',monospace;color:${T.red};animation:blink 1.2s infinite;}
.wave{display:flex;align-items:center;gap:2px;height:28px;margin-bottom:10px;}
.wb{flex:1;border-radius:2px;transition:height .08s;}
.rp-ctrl{display:flex;align-items:center;gap:10px;}
.btn-play{width:30px;height:30px;border-radius:50%;background:${T.green};color:#000;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:700;transition:transform .15s,box-shadow .15s;}
.btn-play:hover{transform:scale(1.12);box-shadow:0 0 14px ${g(T.green,.45)};}
.trans-txt{font-size:12px;color:${T.textSub};font-style:italic;line-height:1.55;flex:1;}
.kw-strip{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;}
.kw-tag{font-size:10px;font-family:'Space Mono',monospace;padding:3px 9px;border-radius:6px;background:${g(T.red,.08)};color:${T.red};border:1px solid ${g(T.red,.22)};}
.chip-vip{background:${g(T.amber,.08)};border:1px solid ${g(T.amber,.22)};border-radius:10px;padding:9px 13px;font-size:11px;color:${T.amber};font-family:'Space Mono',monospace;margin-bottom:12px;}
.chip-pend{background:${g(T.blue,.08)};border:1px solid ${g(T.blue,.22)};border-radius:10px;padding:9px 13px;font-size:11px;color:${T.blue};font-family:'Space Mono',monospace;margin-bottom:12px;}
.act-row{display:flex;gap:8px;}
.ab{flex:1;padding:12px 6px;border-radius:12px;font-size:12px;font-weight:700;transition:all .2s;}
.ab-ans{background:${T.green};color:#000;}
.ab-ans:hover{box-shadow:0 4px 16px ${g(T.green,.42)};transform:translateY(-1px);}
.ab-dec{background:${T.card2};color:${T.red};border:1px solid ${g(T.red,.22)};}
.ab-dec:hover{background:${g(T.red,.1)};}
.ab-blk{background:${T.red};color:#fff;}
.ab-blk:hover{box-shadow:0 4px 16px ${g(T.red,.42)};transform:translateY(-1px);}
.sched-card{background:${T.card};border:1px solid ${T.border};border-radius:17px;margin-bottom:9px;overflow:hidden;}
.sc-top{display:flex;align-items:center;gap:12px;padding:14px 14px 10px;}
.sc-ico{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;transition:all .3s;}
.sc-ico.on{background:${g(T.green,.1)};border:1px solid ${g(T.green,.28)};}
.sc-ico.off{background:${T.card2};opacity:.4;}
.sc-name{font-size:14px;font-weight:700;color:${T.white};}
.day-row{display:flex;gap:4px;margin-top:5px;flex-wrap:wrap;}
.dc{font-size:9px;font-family:'Space Mono',monospace;padding:2px 6px;border-radius:5px;font-weight:700;}
.dc.on{background:${g(T.green,.12)};color:${T.green};border:1px solid ${g(T.green,.28)};}
.dc.off{background:${T.card2};color:${T.textDim};}
.sc-time-col{text-align:right;}
.sc-time{font-family:'Space Mono',monospace;font-size:12px;font-weight:700;color:${T.white};}
.sc-sts{font-size:10px;margin-top:2px;}
.sc-foot{display:flex;align-items:center;gap:10px;padding:0 14px 13px;}
.add-form{background:${T.card};border:1px solid ${T.border};border-radius:17px;padding:18px;margin-bottom:9px;}
.af-title{font-size:15px;font-weight:800;color:${T.white};margin-bottom:15px;}
.af-f{margin-bottom:13px;}
.af-lbl{font-size:10px;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:1px;color:${T.textSub};margin-bottom:7px;display:block;}
.af-in{width:100%;background:${T.bg0};border:1px solid ${T.border};border-radius:11px;padding:10px 14px;color:${T.white};font-size:14px;font-family:'Sora',sans-serif;transition:border-color .2s;}
.af-in:focus{border-color:${g(T.green,.5)};}
.af-in::placeholder{color:${T.textDim};}
.af-days{display:flex;gap:5px;flex-wrap:wrap;}
.af-day{padding:6px 10px;border-radius:8px;border:1px solid ${T.border};background:${T.card2};color:${T.textSub};font-size:10px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Space Mono',monospace;}
.af-day.sel{background:${g(T.green,.1)};color:${T.green};border-color:${g(T.green,.38)};}
.af-tp{display:flex;align-items:center;gap:8px;}
.af-tp .af-in{flex:1;}
.af-tp span{font-size:12px;color:${T.textSub};flex-shrink:0;}
.btn-af-save{width:100%;padding:13px;border-radius:12px;background:${T.green};color:#000;font-size:14px;font-weight:800;margin-top:6px;transition:all .2s;}
.btn-af-save:hover{box-shadow:0 4px 20px ${g(T.green,.35)};}
.btn-af-cancel{width:100%;padding:11px;border-radius:12px;border:1px solid ${T.border};color:${T.textSub};font-size:13px;font-weight:700;margin-top:7px;transition:all .2s;}
.vip-notice{background:${g(T.amber,.07)};border:1px solid ${g(T.amber,.2)};border-radius:13px;padding:12px 15px;font-size:12px;color:${T.amber};line-height:1.7;margin-bottom:12px;}
.btn-contacts{width:100%;padding:14px;border-radius:13px;border:1px solid ${g(T.blue,.35)};background:${g(T.blue,.08)};color:${T.blue};font-size:14px;font-weight:700;margin-bottom:10px;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .2s;}
.btn-contacts:hover{background:${g(T.blue,.14)};}
.vip-card{background:${T.card};border:1px solid ${T.border};border-radius:15px;margin-bottom:9px;}
.vc-inner{display:flex;align-items:center;gap:12px;padding:13px;}
.vc-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,${g(T.amber,.14)},${g(T.amber,.04)});border:1.5px solid ${g(T.amber,.3)};display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0;}
.vc-name{font-size:14px;font-weight:700;color:${T.white};}
.vc-num{font-family:'Space Mono',monospace;font-size:10px;color:${T.textSub};margin-top:2px;}
.vc-badge{font-size:9px;font-family:'Space Mono',monospace;padding:3px 9px;border-radius:20px;background:${g(T.amber,.1)};color:${T.amber};border:1px solid ${g(T.amber,.28)};font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin-right:7px;flex-shrink:0;}
.btn-vc-rm{padding:7px 12px;border-radius:9px;border:1px solid ${T.border};color:${T.textSub};font-size:11px;font-weight:700;transition:all .2s;flex-shrink:0;}
.btn-vc-rm:hover{color:${T.red};border-color:${g(T.red,.3)};background:${g(T.red,.07)};}
.vip-manual{background:${T.card};border:1px solid ${T.border};border-radius:15px;padding:16px;margin-bottom:9px;}
.vip-inp-row{display:flex;gap:8px;margin-top:8px;}
.vip-inp-row .af-in{flex:1;}
.btn-vip-add{padding:10px 14px;border-radius:10px;background:${T.amber};color:#000;font-size:12px;font-weight:800;flex-shrink:0;transition:all .2s;}
.btn-vip-add:hover{box-shadow:0 4px 16px ${g(T.amber,.42)};}
.sg{background:${T.card};border:1px solid ${T.border};border-radius:18px;padding:18px;margin-bottom:12px;}
.sg-hd{font-size:10px;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:1.3px;color:${T.textSub};margin-bottom:13px;}
.s-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid ${T.bg0};}
.s-row:last-child{border-bottom:none;}
.s-info strong{display:block;font-size:13px;font-weight:600;color:#c8ccff;}
.s-info small{display:block;font-size:10px;color:${T.textSub};font-family:'Space Mono',monospace;margin-top:2px;line-height:1.4;}
.sm-tog{width:44px;height:24px;border-radius:12px;position:relative;transition:background .22s;flex-shrink:0;border:none;}
.sm-tog.on{background:${T.green};}
.sm-tog.off{background:${T.card2};border:1px solid ${T.border};}
.sm-dot{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:${T.white};box-shadow:0 1px 6px rgba(0,0,0,.5);transition:left .22s cubic-bezier(.34,1.56,.64,1);}
.sm-tog.on .sm-dot{left:23px;}
.sm-tog.off .sm-dot{left:3px;}
.prompt-box{background:${T.bg0};border:1px solid ${T.border};border-radius:12px;padding:14px 16px;font-size:12px;color:${T.textSub};font-style:italic;line-height:1.8;border-left:3px solid ${T.green};margin-bottom:10px;}
.prompt-box strong{color:${T.text};font-style:normal;font-weight:600;}
.btn-cust{width:100%;padding:11px;border-radius:11px;border:1px solid ${g(T.green,.28)};background:${g(T.green,.05)};color:${T.green};font-size:12px;font-weight:700;transition:all .2s;}
.tech-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid ${T.bg0};font-size:11px;font-family:'Space Mono',monospace;color:${T.textSub};}
.tech-row:last-child{border-bottom:none;}
.tech-val{color:#00d4ff;font-weight:600;}
.hint-box{background:${g(T.green,.04)};border:1px solid ${g(T.green,.16)};border-radius:14px;padding:13px 16px;font-size:12px;color:${T.textSub};line-height:1.8;margin-top:6px;}
.hint-box strong{color:${T.text};}
.modal-backdrop{position:fixed;inset:0;z-index:500;background:rgba(4,4,14,.92);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;animation:fi .2s ease;}
@keyframes fi{from{opacity:0;}to{opacity:1;}}
.modal-sheet{width:100%;max-width:430px;background:${T.card2};border-radius:28px 28px 0 0;border:1px solid ${T.border};border-bottom:none;padding:22px 22px 40px;animation:su .35s cubic-bezier(.34,1.56,.64,1);}
@keyframes su{from{transform:translateY(100%);}to{transform:translateY(0);}}
.modal-handle{width:42px;height:4px;border-radius:2px;background:${T.border};margin:0 auto 20px;}
.modal-title{font-family:'DM Serif Display',serif;font-size:22px;color:${T.white};margin-bottom:4px;}
.modal-sub{font-size:12px;color:${T.textSub};font-family:'Space Mono',monospace;margin-bottom:18px;}
.btn-modal-close{width:100%;padding:14px;border-radius:14px;border:1px solid ${T.border};color:${T.textSub};font-size:14px;font-weight:700;margin-top:12px;transition:all .2s;}
.btn-modal-close:hover{border-color:${T.borderHi};color:${T.text};}
/* ── ACCESS CODE SCREEN ── */
.access-screen{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 32px;text-align:center;position:relative;}
.ac-card{width:100%;background:${T.card};border:1px solid ${T.border};border-radius:24px;padding:32px 26px;position:relative;overflow:hidden;}
.ac-card::before{content:'';position:absolute;top:0;left:20px;right:20px;height:1.5px;background:linear-gradient(90deg,transparent,${T.green},transparent);}
.ac-card-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 260px 200px at 50% 0%,${g(T.green,.06)},transparent 70%);}
.ac-ghost{font-size:52px;margin-bottom:14px;display:block;filter:drop-shadow(0 0 18px ${g(T.green,.5)});animation:gf 3s ease-in-out infinite;}
.ac-title{font-family:'DM Serif Display',serif;font-size:26px;color:${T.white};margin-bottom:6px;}
.ac-title em{font-style:italic;color:${T.green};}
.ac-sub{font-size:13px;color:${T.textSub};line-height:1.65;margin-bottom:28px;}
/* code input */
.ac-input-wrap{position:relative;margin-bottom:10px;}
.ac-input{width:100%;background:${T.bg0};border:2px solid ${T.border};border-radius:14px;padding:16px 20px;color:${T.white};font-size:22px;font-family:'Space Mono',monospace;font-weight:700;letter-spacing:4px;text-align:center;text-transform:uppercase;transition:border-color .2s;}
.ac-input:focus{border-color:${g(T.green,.55)};}
.ac-input::placeholder{color:${T.textDim};font-size:16px;letter-spacing:2px;}
.ac-input.error{border-color:${g(T.red,.55)};animation:shake .35s ease;}
.ac-input.success{border-color:${g(T.green,.7)};}
@keyframes shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-6px);}40%,80%{transform:translateX(6px);}}
.ac-error{font-size:12px;color:${T.red};font-family:'Space Mono',monospace;text-align:center;margin-bottom:14px;min-height:18px;animation:wi .2s ease;}
.ac-success-badge{display:flex;align-items:center;justify-content:center;gap:8px;background:${g(T.green,.1)};border:1px solid ${g(T.green,.3)};border-radius:11px;padding:10px 16px;margin-bottom:14px;font-size:13px;color:${T.green};font-family:'Space Mono',monospace;font-weight:700;animation:wi .3s cubic-bezier(.34,1.56,.64,1);}
/* divider */
.ac-divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:${T.textDim};font-size:11px;font-family:'Space Mono',monospace;letter-spacing:1px;}
.ac-divider::before,.ac-divider::after{content:'';flex:1;height:1px;background:${T.border};}
/* beta badge */
.ac-beta{display:inline-flex;align-items:center;gap:6px;background:${g(T.amber,.1)};border:1px solid ${g(T.amber,.25)};color:${T.amber};font-size:10px;font-family:'Space Mono',monospace;font-weight:700;padding:4px 12px;border-radius:20px;letter-spacing:.5px;margin-bottom:20px;}

/* ── CUSTOM VOICE RECORDER ── */
.cv-modal{background:${T.card};border:1px solid ${T.border};border-radius:22px;padding:26px 22px;margin-bottom:14px;position:relative;overflow:hidden;}
.cv-modal-bg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 260px 200px at 50% 30%,${g(T.amber,.06)},transparent 70%);}
.cv-title{font-family:'DM Serif Display',serif;font-size:22px;color:${T.white};margin-bottom:6px;}
.cv-title em{font-style:italic;color:${T.amber};}
.cv-sub{font-size:12px;color:${T.textSub};line-height:1.65;margin-bottom:22px;}
/* steps */
.cv-step{display:flex;flex-direction:column;align-items:center;}
/* record button */
.cv-rec-btn{width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:36px;border:none;transition:all .25s;position:relative;flex-shrink:0;}
.cv-rec-btn.idle{background:${g(T.amber,.14)};border:2px solid ${g(T.amber,.4)};box-shadow:0 0 24px ${g(T.amber,.2)};}
.cv-rec-btn.idle:hover{box-shadow:0 0 38px ${g(T.amber,.4)};transform:scale(1.05);}
.cv-rec-btn.recording{background:${T.red};border:2px solid ${T.red};box-shadow:0 0 32px ${g(T.red,.55)};animation:rec-pulse 1s ease-in-out infinite;}
@keyframes rec-pulse{0%,100%{box-shadow:0 0 32px ${g(T.red,.55)};}50%{box-shadow:0 0 52px ${g(T.red,.8)};}}
.cv-rec-btn.done{background:${g(T.green,.14)};border:2px solid ${g(T.green,.4)};box-shadow:0 0 24px ${g(T.green,.2)};}
.cv-rec-timer{font-family:'Space Mono',monospace;font-size:28px;font-weight:700;color:${T.red};margin:14px 0 6px;letter-spacing:2px;}
.cv-rec-label{font-size:11px;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:1.5px;color:${T.textSub};margin-bottom:18px;}
/* live waveform while recording */
.cv-live-wave{display:flex;align-items:flex-end;justify-content:center;gap:3px;height:44px;margin:14px 0;}
.cv-wb{width:5px;border-radius:3px;min-height:4px;transition:height .08s ease;}
/* playback */
.cv-playback{background:${T.bg0};border:1px solid ${T.border};border-radius:14px;padding:16px;margin-bottom:16px;width:100%;}
.cv-pb-label{font-size:10px;font-family:'Space Mono',monospace;text-transform:uppercase;letter-spacing:1px;color:${T.green};margin-bottom:10px;}
.cv-pb-controls{display:flex;align-items:center;gap:12px;}
.cv-pb-play{width:38px;height:38px;border-radius:50%;background:${T.green};color:#000;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:none;transition:all .2s;}
.cv-pb-play:hover{transform:scale(1.1);box-shadow:0 0 16px ${g(T.green,.5)};}
.cv-pb-info{flex:1;}
.cv-pb-name{font-size:14px;font-weight:700;color:${T.white};}
.cv-pb-dur{font-size:11px;color:${T.textSub};font-family:'Space Mono',monospace;margin-top:2px;}
/* action buttons */
.cv-actions{display:flex;gap:9px;width:100%;}
.cv-btn{flex:1;padding:13px;border-radius:12px;font-size:13px;font-weight:700;border:none;transition:all .2s;}
.cv-btn-primary{background:${T.amber};color:#000;}
.cv-btn-primary:hover{box-shadow:0 4px 18px ${g(T.amber,.45)};transform:translateY(-1px);}
.cv-btn-secondary{background:${T.card2};color:${T.textSub};border:1px solid ${T.border};}
.cv-btn-secondary:hover{color:${T.text};border-color:${T.borderHi};}
.cv-btn-danger{background:${g(T.red,.12)};color:${T.red};border:1px solid ${g(T.red,.25)};}
.cv-btn-danger:hover{background:${g(T.red,.2)};}
/* success banner */
.cv-success{background:${g(T.green,.08)};border:1px solid ${g(T.green,.25)};border-radius:13px;padding:14px 16px;display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.cv-success-ico{font-size:28px;flex-shrink:0;}
.cv-success-text strong{display:block;font-size:14px;color:${T.white};font-weight:700;}
.cv-success-text span{font-size:11px;color:${T.textSub};font-family:'Space Mono',monospace;}
/* mic permission denied */
.cv-no-mic{background:${g(T.red,.08)};border:1px solid ${g(T.red,.22)};border-radius:13px;padding:14px 16px;font-size:12px;color:${T.red};line-height:1.7;margin-bottom:14px;font-family:'Space Mono',monospace;}
/* tip box */
.cv-tip{background:${g(T.amber,.06)};border:1px solid ${g(T.amber,.18)};border-radius:12px;padding:12px 15px;font-size:11px;color:${T.textSub};line-height:1.7;margin-top:10px;}
.cv-tip strong{color:${T.amber};}

.toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%);background:${T.white};color:#000;padding:11px 24px;border-radius:30px;font-size:13px;font-weight:700;box-shadow:0 10px 36px rgba(0,0,0,.5);z-index:9999;white-space:nowrap;animation:ti .38s cubic-bezier(.34,1.56,.64,1);}
@keyframes ti{from{transform:translateX(-50%) translateY(20px);opacity:0;}to{transform:translateX(-50%) translateY(0);opacity:1;}}
.empty-state{text-align:center;padding:52px 16px;}
.empty-ico{font-size:50px;margin-bottom:14px;opacity:.35;display:block;}
.empty-state p{font-size:13px;color:${T.textSub};line-height:1.8;}
.scroll{overflow-y:auto;}
.mt0{margin-top:4px;}
`;

/* ── WAVEFORM ── */
const WBH=[5,9,16,24,18,30,36,28,22,34,42,32,24,36,44,34,26,20,28,22,16,12,20,14,10,8,13,18,24,19,14,10,16,12,8];
function Waveform({playing,color}){
  const[f,sf]=useState(0);
  useEffect(()=>{if(!playing)return;const id=setInterval(()=>sf(x=>x+1),72);return()=>clearInterval(id);},[playing]);
  return(<div className="wave">{WBH.map((h,i)=>(<div key={i} className="wb" style={{height:playing?`${Math.max(3,WBH[(i+f)%WBH.length])}px`:`${h*.37+3}px`,background:color||T.green,opacity:playing?.9:.16}}/>))}</div>);
}

function SmTog({on,toggle}){
  return(<button className={`sm-tog ${on?"on":"off"}`} onClick={toggle}><div className="sm-dot"/></button>);
}

/* ── AVATAR SPEAKER ── */
function AvatarSpeaker({avatar,speaking,showPrompt,promptText}){
  const[frame,setFrame]=useState(0);
  useEffect(()=>{if(!speaking)return;const id=setInterval(()=>setFrame(f=>f+1),100);return()=>clearInterval(id);},[speaking]);
  const bars=16;
  const heights=useMemo(()=>Array.from({length:bars},(_,i)=>{
    if(!speaking)return 4;
    const t=frame*.16+i*.52;
    return Math.max(4,Math.round(8+Math.sin(t)*10+Math.sin(t*1.8+1.1)*7+Math.sin(t*2.5+2.0)*4));
  }),[frame,speaking]);
  return(
    <div className="av-speaker">
      <div className="av-sp-bg" style={{background:`radial-gradient(ellipse 200px 180px at 50% 35%,${g(avatar.color,.07)},transparent 70%)`}}/>
      <div className="av-orb-outer">
        <div className="ring-a" style={{borderColor:g(avatar.color,.3)}}/>
        <div className="ring-b" style={{borderColor:g(avatar.color,.15)}}/>
        <div className="av-orb" style={{background:`radial-gradient(circle,${g(avatar.color,.14)},${g(avatar.color,.04)})`,borderColor:g(avatar.color,.35),boxShadow:`0 0 32px ${g(avatar.color,.18)}`}}>
          <span style={{fontSize:50,filter:`drop-shadow(0 0 14px ${g(avatar.color,.5)})`}}>{avatar.emoji}</span>
        </div>
      </div>
      <div className="av-sp-name" style={{color:avatar.color}}>{avatar.name}</div>
      <div className="av-sp-role">{avatar.desc} · {avatar.gender}</div>
      <div className="av-voice-quality">✦ ElevenLabs · Human-Quality Voice</div>
      <div className="sound-bars">
        {heights.map((h,i)=>(<div key={i} className="sb" style={{height:`${h}px`,background:avatar.color,opacity:speaking?.82:.18}}/>))}
      </div>
      <div className="av-sp-status" style={{color:speaking?avatar.color:T.textSub}}>
        {speaking?"● SPEAKING NOW":"○ READY"}
      </div>
      {showPrompt&&promptText&&(
        <div className="av-prompt-txt">"{promptText}"</div>
      )}
    </div>
  );
}

/* ── PARTICLE CANVAS ── */
function ParticleCanvas(){
  const ref=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pts=Array.from({length:55},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.4+.5,a:Math.random()}));
    let raf;
    const draw=()=>{
      ctx.clearRect(0,0,W,H);
      pts.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,240,160,${p.a*.35})`;ctx.fill();
      });
      for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<90){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(0,240,160,${.1*(1-d/90)})`;ctx.lineWidth=.5;ctx.stroke();}
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    const onR=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
    window.addEventListener("resize",onR);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",onR);};
  },[]);
  return <canvas ref={ref} className="splash-canvas"/>;
}

/* ═══════════════════════════════════════════════════════════════
   PAYMENT METHOD CARD
   ═══════════════════════════════════════════════════════════════ */
function PayMethodCard({ method, selected, onSelect }) {
  const isSel = selected === method.id;
  return (
    <div
      onClick={() => onSelect(method.id)}
      style={{
        display:"flex", alignItems:"center", gap:10,
        padding:"12px 13px",
        background: isSel ? g(T.green,.07) : T.card,
        border:`1.5px solid ${isSel ? g(T.green,.45) : T.border}`,
        borderRadius:13, cursor:"pointer", transition:"all .2s",
        userSelect:"none",
        boxShadow: isSel ? `0 4px 16px ${g(T.green,.12)}` : "none",
      }}
    >
      <span style={{fontSize:20,flexShrink:0}}>{method.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color: isSel ? T.white : T.text,marginBottom:1}}>{method.label}</div>
        <div style={{fontSize:10,color:T.textSub,fontFamily:"'Space Mono',monospace"}}>{method.sub}</div>
      </div>
      <div style={{
        width:18,height:18,borderRadius:"50%",
        border:`1.5px solid ${isSel ? T.green : T.border}`,
        background: isSel ? T.green : "transparent",
        display:"flex",alignItems:"center",justifyContent:"center",
        fontSize:10,color:"#000",fontWeight:700,flexShrink:0,
        transition:"all .2s",
      }}>{isSel?"✓":""}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOM VOICE RECORDER
   ═══════════════════════════════════════════════════════════════ */
function CustomVoiceRecorder({ onSave, onCancel, existingBlob }) {
  const [phase, setPhase]         = useState(existingBlob ? "done" : "idle");
  const [seconds, setSeconds]     = useState(0);
  const [audioBlob, setAudioBlob] = useState(existingBlob || null);
  const [audioUrl,  setAudioUrl]  = useState(existingBlob ? URL.createObjectURL(existingBlob) : null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const [liveH, setLiveH]         = useState(Array(18).fill(4));
  const mrRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const animRef  = useRef(null);
  const streamRef= useRef(null);
  const chunks   = useRef([]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const fmt = s => `${Math.floor(s/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const src = ctx.createMediaStreamSource(stream);
        const anl = ctx.createAnalyser(); anl.fftSize = 64;
        src.connect(anl);
        const data = new Uint8Array(anl.frequencyBinCount);
        const anim = () => {
          anl.getByteFrequencyData(data);
          setLiveH(Array.from({length:18},(_,i) => Math.max(4, Math.round((data[Math.floor(i*data.length/18)]/255)*36))));
          animRef.current = requestAnimationFrame(anim);
        };
        anim();
      } catch(e) {}
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const mr = new MediaRecorder(stream, { mimeType });
      chunks.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: mr.mimeType });
        setAudioBlob(blob); setAudioUrl(URL.createObjectURL(blob));
        setPhase("done"); setLiveH(Array(18).fill(4));
        cancelAnimationFrame(animRef.current);
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(100); mrRef.current = mr;
      setPhase("recording"); setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => { if (s >= 59) { stopRecording(); return 60; } return s + 1; }), 1000);
    } catch (e) { setMicDenied(true); }
  };

  const stopRecording = () => { clearInterval(timerRef.current); if (mrRef.current?.state !== "inactive") mrRef.current?.stop(); };
  const playback = () => { if (!audioUrl) return; const a = new Audio(audioUrl); audioRef.current = a; setIsPlaying(true); a.play(); a.onended = () => setIsPlaying(false); a.onerror = () => setIsPlaying(false); };
  const stopPlay = () => { audioRef.current?.pause(); setIsPlaying(false); };
  const reRecord = () => { stopPlay(); setAudioBlob(null); setAudioUrl(null); setPhase("idle"); setSeconds(0); };

  return (
    <div className="cv-modal">
      <div className="cv-modal-bg"/>
      <div className="cv-title">Record <em>Your Voice</em></div>
      <div className="cv-sub">Your actual voice will greet callers — not AI, not a robot. Sounds exactly like you. Just read the prompt below.</div>

      {micDenied && <div className="cv-no-mic">🎤 Microphone access was denied. Please allow microphone access in your browser settings and try again.</div>}

      {phase === "idle" && !micDenied && (
        <div className="cv-step">
          <button className="cv-rec-btn idle" onClick={startRecording}>🎤</button>
          <div className="cv-rec-label" style={{marginTop:14}}>Tap to start recording</div>
          <div className="cv-tip"><strong>💡 Tip:</strong> Speak naturally and clearly. You can re-record as many times as you like until it sounds perfect.</div>
        </div>
      )}

      {phase === "recording" && (
        <div className="cv-step">
          <div className="cv-live-wave">{liveH.map((h,i)=><div key={i} className="cv-wb" style={{height:`${h}px`,background:T.red,opacity:.85}}/>)}</div>
          <button className="cv-rec-btn recording" onClick={stopRecording}>⏹</button>
          <div className="cv-rec-timer">{fmt(seconds)}</div>
          <div className="cv-rec-label">Recording… tap square to stop</div>
          <div style={{fontSize:11,color:T.textSub,fontFamily:"'Space Mono',monospace"}}>Max 60 seconds</div>
        </div>
      )}

      {phase === "done" && (
        <div className="cv-step" style={{width:"100%"}}>
          {/* success */}
          <div className="cv-success" style={{width:"100%"}}>
            <span className="cv-success-ico">✅</span>
            <div className="cv-success-text">
              <strong>Recording saved — {fmt(seconds)}</strong>
              <span>Tap ▶ to preview before using</span>
            </div>
          </div>
          <div className="cv-playback">
            <div className="cv-pb-label">🎙 Your Voice Recording</div>
            <div className="cv-pb-controls">
              <button className="cv-pb-play" onClick={isPlaying ? stopPlay : playback}>{isPlaying ? "⏸" : "▶"}</button>
              <div className="cv-pb-info">
                <div className="cv-pb-name">My Custom Voice</div>
                <div className="cv-pb-dur">{fmt(seconds)} · tap to preview</div>
              </div>
            </div>
          </div>
          <div className="cv-actions">
            <button className="cv-btn cv-btn-danger" onClick={reRecord}>🔄 Re-record</button>
            <button className="cv-btn cv-btn-primary" onClick={() => onSave(audioBlob, audioUrl)}>✓ Use My Voice</button>
          </div>
        </div>
      )}

      <div className="cv-tip" style={{marginTop:14}}>
        <strong>📢 Read this:</strong> "You've reached a protected number. Please state your full name and reason for calling after the tone."
      </div>
      <button className="cv-btn cv-btn-secondary" style={{width:"100%",marginTop:12}} onClick={onCancel}>Cancel</button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function GhostScreen(){
  const[screen,setScreen]=useState("splash"); // splash|access|pricing|payment|wizard|app
  const[wizStep,setWizStep]=useState(0);
  const[wizProg,setWizProg]=useState(-1);
  const[payMethod,setPayMethod]=useState(null);
  // ── Access code system
  const[codeInput,setCodeInput]=useState("");
  const[codeError,setCodeError]=useState("");
  const[codeValid,setCodeValid]=useState(false);
  const[avatar,setAvatar]=useState(AVATARS[0]);
  const[gFilter,setGFilter]=useState("all");
  const[lang,setLang]=useState(LANGS[0]);
  const[langQ,setLangQ]=useState("");
  const[speaking,setSpeaking]=useState(false);
  const[showLangModal,setShowLangModal]=useState(false);
  const[apiKey,setApiKey]=useState(""); // ElevenLabs API key
  const[apiKeyInput,setApiKeyInput]=useState("");
  const[apiKeyStatus,setApiKeyStatus]=useState("demo"); // demo|active
  // ── Custom voice
  const[customVoiceBlob,setCustomVoiceBlob]=useState(null);
  const[customVoiceUrl,setCustomVoiceUrl]=useState(null);
  const[showCustomRecorder,setShowCustomRecorder]=useState(false);
  const[customAudioPlaying,setCustomAudioPlaying]=useState(false);
  const customAudioRef=useRef(null);
  const[contactsGranted,setContactsGranted]=useState(false);
  const[contactQ,setContactQ]=useState("");
  const[selectedCIDs,setSelectedCIDs]=useState(new Set(["c1","c3","c4"]));
  const[showContactsModal,setShowContactsModal]=useState(false);
  const[tab,setTab]=useState("log");
  const[masterOn,setMasterOn]=useState(true);
  const[calls,setCalls]=useState(CALLS_SEED);
  const[scheds,setScheds]=useState(INIT_SCHEDS);
  const[vip,setVip]=useState(INIT_VIP);
  const[expanded,setExpanded]=useState(null);
  const[playing,setPlaying]=useState(null);
  const[filter,setFilter]=useState("all");
  const[toast,setToast]=useState(null);
  const[showAddSched,setShowAddSched]=useState(false);
  const[showAddVip,setShowAddVip]=useState(false);
  const[liveDismissed,setLiveDismissed]=useState(false);
  const[newSched,setNewSched]=useState({name:"",days:[],start:"09:00",end:"17:00",icon:"🕐"});
  const[newVipName,setNewVipName]=useState("");
  const[newVipNum,setNewVipNum]=useState("");
  const[settings,setSettings]=useState({voicePrompt:true,autoDetect:true,blockSilent:false,autoBlock:false,notifyVip:true,recordAll:true});

  const audioRef=useRef(null);
  const toastRef=useRef(null);

  const showToast=useCallback(msg=>{
    setToast(msg);clearTimeout(toastRef.current);
    toastRef.current=setTimeout(()=>setToast(null),2600);
  },[]);

  // ── ACCESS CODES ── change or add codes here any time
  const ACCESS_CODES = useMemo(()=>new Set([
    "GHOST2024",   // your personal code
    "FAMILY01",    // family member 1
    "FAMILY02",    // family member 2
    "BETA2024",    // close friends
    "TESTMODE",    // for your own testing
  ]),[]);

  const validateCode = useCallback(()=>{
    const code = codeInput.trim().toUpperCase();
    if(!code){ setCodeError("Please enter an access code."); return; }
    if(ACCESS_CODES.has(code)){
      setCodeValid(true);
      setCodeError("");
      showToast("✅ Access granted! Welcome to Ghost Screen.");
      setTimeout(()=>setScreen("wizard"),1200);
    } else {
      setCodeError("That code isn't valid. Try again or go to the paid plan.");
      setCodeInput("");
    }
  },[codeInput, ACCESS_CODES, showToast]);

  /* ── VOICE PLAYBACK ── */
  const stopSpeak=useCallback(()=>{
    if(audioRef.current){audioRef.current.pause();audioRef.current=null;}
    if(window.speechSynthesis)window.speechSynthesis.cancel();
    setSpeaking(false);
  },[]);

  const speak=useCallback(async(text,langCode,avt)=>{
    stopSpeak();
    const av=avt||avatar;
    // ── Custom voice: play the user's own recording ──
    if(av.id==="custom"&&customVoiceUrl){
      try{
        const a=new Audio(customVoiceUrl);
        audioRef.current=a;
        setSpeaking(true);
        a.play();
        a.onended=()=>setSpeaking(false);
        a.onerror=()=>setSpeaking(false);
      }catch(e){setSpeaking(false);}
      return;
    }
    const elVoice=EL_VOICES[av.id];
    if(apiKey&&elVoice){
      const audio=await speakElevenLabs(
        text, elVoice.id, apiKey,
        ()=>setSpeaking(true),
        ()=>setSpeaking(false),
        (err)=>{ setSpeaking(false); showToast("⚠️ "+err); speakBrowser(text,langCode||lang.code,av.gender,()=>setSpeaking(true),()=>setSpeaking(false)); }
      );
      if(audio)audioRef.current=audio;
    } else {
      speakBrowser(text,langCode||lang.code,av.gender,()=>setSpeaking(true),()=>setSpeaking(false));
    }
  },[avatar,lang,apiKey,customVoiceUrl,stopSpeak,showToast]);

  const testVoice=useCallback((avt,lg)=>{
    const a=avt||avatar,l=lg||lang;
    speak(PROMPTS[l.lang]||PROMPTS.default,l.code,a);
  },[avatar,lang,speak]);

  const saveApiKey=useCallback(()=>{
    if(!apiKeyInput.trim()){showToast("⚠️ Enter your ElevenLabs API key");return;}
    setApiKey(apiKeyInput.trim());
    setApiKeyStatus("active");
    showToast("✅ ElevenLabs connected — human voices active!");
  },[apiKeyInput,showToast]);

  const saveCustomVoice=useCallback((blob,url)=>{
    setCustomVoiceBlob(blob);
    setCustomVoiceUrl(url);
    setAvatar(AVATARS.find(a=>a.id==="custom"));
    setShowCustomRecorder(false);
    showToast("🎤 Your voice is now active!");
  },[showToast]);

  /* ── CONTACTS ── */
  const grantContacts=useCallback(()=>{setTimeout(()=>{setContactsGranted(true);showToast("📱 Contacts access granted!");},700);},[showToast]);
  const toggleCID=useCallback(id=>{setSelectedCIDs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});},[]);
  const applyContacts=useCallback(()=>{
    const added=CONTACTS_MOCK.filter(c=>selectedCIDs.has(c.id)).map(c=>({id:c.id,name:c.name,num:c.phone,emoji:c.emoji}));
    setVip(added);setShowContactsModal(false);
    showToast(`⭐ ${added.length} VIP contact${added.length!==1?"s":""} saved`);
  },[selectedCIDs,showToast]);

  /* ── INSTALL ── */
  const runInstall=useCallback(()=>{
    setWizProg(0);
    [0,1,2,3,4].forEach((_,i)=>setTimeout(()=>setWizProg(i),i*820));
    setTimeout(()=>setScreen("app"),5*820+400);
  },[]);

  /* ── CALL ACTIONS ── */
  const answerCall =id=>{setCalls(p=>p.map(c=>c.id===id?{...c,s:"sa",out:"answered"}:c));showToast("📞 Connecting call…");};
  const declineCall=id=>{setCalls(p=>p.map(c=>c.id===id?{...c,s:"sa",out:"declined"}:c));showToast("📵 Call declined");};
  const blockCall  =id=>{setCalls(p=>p.map(c=>c.id===id?{...c,s:"bl",out:"blocked",emo:"🚫"}:c));showToast("🚫 Number blocked");};
  const toggleSched=id=>setScheds(p=>p.map(s=>s.id===id?{...s,active:!s.active}:s));
  const deleteSched=id=>{setScheds(p=>p.filter(s=>s.id!==id));showToast("Schedule removed");};
  const saveSched=()=>{
    if(!newSched.name||!newSched.days.length){showToast("⚠️ Add name and select days");return;}
    setScheds(p=>[...p,{...newSched,id:Date.now(),active:true}]);
    setNewSched({name:"",days:[],start:"09:00",end:"17:00",icon:"🕐"});
    setShowAddSched(false);showToast("✅ Schedule saved");
  };
  const removeVip=id=>{setVip(p=>p.filter(v=>v.id!==id));setSelectedCIDs(p=>{const n=new Set(p);n.delete(id);return n;});showToast("Removed from VIP list");};
  const addVip=()=>{
    if(!newVipName||!newVipNum){showToast("⚠️ Enter name and number");return;}
    setVip(p=>[...p,{id:"m"+Date.now(),name:newVipName,num:newVipNum,emoji:"⭐"}]);
    setNewVipName("");setNewVipNum("");setShowAddVip(false);showToast("⭐ VIP contact added");
  };
  const exportLog=()=>{
    const lines=["═══════════════════════════════\n  GHOST SCREEN · CALL RECEIPT\n  "+new Date().toLocaleString()+"\n  "+lang.flag+" "+lang.name+" · "+avatar.emoji+" "+avatar.name+"\n═══════════════════════════════\n",
      ...calls.map(c=>[`[${c.d} ${c.t}]  ${c.num}`,`Name: ${c.name}`,`Status: ${c.tag.toUpperCase()} · ${c.out.toUpperCase()}`,c.agency?`Agency: ${c.agency}`:null,c.dur?`Duration: ${c.dur}`:null,c.trans?`Message: "${c.trans}"`:null,c.kw?.length?`Keywords: ${c.kw.join(", ")}`:null,"───────────────────────────────"].filter(Boolean).join("\n"))
    ].join("\n");
    const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([lines],{type:"text/plain"}));a.download=`ghost-screen-${Date.now()}.txt`;a.click();
    showToast("📄 Receipt exported!");
  };

  /* ── COMPUTED ── */
  const totScreened=calls.filter(c=>c.s!=="pe").length;
  const totCollect =calls.filter(c=>c.tag==="collector").length;
  const totBlocked =calls.filter(c=>c.out==="blocked").length;
  const totVip     =calls.filter(c=>c.tag==="vip").length;
  const todayCalls =calls.filter(c=>c.d==="Today").length;
  const filtered   =calls.filter(c=>{if(filter==="all")return true;if(filter==="collector")return c.tag==="collector";if(filter==="safe")return c.tag==="safe";if(filter==="vip")return c.tag==="vip";if(filter==="blocked")return c.out==="blocked";if(filter==="pending")return c.s==="pe";return true;});
  const filteredLangs =useMemo(()=>LANGS.filter(l=>l.name.toLowerCase().includes(langQ.toLowerCase())||l.country.toLowerCase().includes(langQ.toLowerCase())),[langQ]);
  const filteredAvatars=useMemo(()=>gFilter==="all"?AVATARS:AVATARS.filter(a=>a.gender===gFilter),[gFilter]);
  const filteredCts    =useMemo(()=>CONTACTS_MOCK.filter(c=>c.name.toLowerCase().includes(contactQ.toLowerCase())||c.phone.includes(contactQ)),[contactQ]);
  const liveCall=!liveDismissed&&calls[0]?.s==="fl";
  const currentPrompt=PROMPTS[lang.lang]||PROMPTS.default;

  /* ══════════ SPLASH ══════════ */
  if(screen==="splash") return(
    <><style>{CSS}</style><div className="layer-bg"/><div className="layer-grid"/>
    <div className="root"><div className="splash">
      <ParticleCanvas/>
      <div className="sp-logo-wrap">
        <div className="sp-shield">
          <div className="sh-ring2"/><div className="sh-ring1"/>
          <div className="sh-outer"/>
          <div className="sh-ghost">👻</div>
        </div>
        <div className="sp-wordmark">Ghost<em>Screen</em></div>
        <div className="sp-tag">AI-Powered Call Protection · Worldwide</div>
      </div>
      <div className="flags-wrap">
        <div className="flags-track">{[...LANGS,...LANGS].map((l,i)=><span key={i}>{l.flag}</span>)}</div>
      </div>
      <div className="sp-cta">
        <button className="btn-primary" onClick={()=>setScreen("access")}>Get Started — Only $5/month</button>
        <button className="btn-secondary" onClick={()=>setScreen("wizard")}>Sign In to Existing Account</button>
      </div>
      <div className="sp-trust">{["🛡️ Private","🌍 40+ Languages","🤖 Human AI Voices","📱 Contact Sync","📄 Receipts"].map(t=>(<span key={t} className="trust-item">{t}</span>))}</div>
    </div></div></>
  );

  /* ══════════ ACCESS CODE SCREEN ══════════ */
  if(screen==="access") return(
    <><style>{CSS}</style><div className="layer-bg"/><div className="layer-grid"/>
    <ParticleCanvas/>
    <div className="root"><div className="access-screen">

      <div className="ac-card">
        <div className="ac-card-bg"/>
        <span className="ac-ghost">👻</span>
        <div className="ac-beta">🔒 BETA · INVITE ONLY</div>
        <div className="ac-title">Enter Your <em>Access Code</em></div>
        <div className="ac-sub">
          Ghost Screen is currently in private beta. Enter your personal access code to get in free — or continue to the paid plan below.
        </div>

        {/* CODE INPUT */}
        <div className="ac-input-wrap">
          <input
            className={`ac-input ${codeError?"error":""} ${codeValid?"success":""}`}
            placeholder="ENTER CODE"
            value={codeInput}
            maxLength={12}
            onChange={e=>{setCodeInput(e.target.value.toUpperCase());setCodeError("");setCodeValid(false);}}
            onKeyDown={e=>{ if(e.key==="Enter") validateCode(); }}
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>

        {/* ERROR OR SUCCESS */}
        {codeError&&<div className="ac-error">⚠️ {codeError}</div>}
        {codeValid&&(
          <div className="ac-success-badge">
            <span>✅</span> Access granted! Loading Ghost Screen…
          </div>
        )}

        {/* SUBMIT */}
        <button
          className="btn-primary"
          onClick={validateCode}
          disabled={codeValid}
          style={codeValid?{opacity:.6,cursor:"not-allowed"}:{}}
        >
          {codeValid?"Unlocking…":"Unlock with Code →"}
        </button>

        {/* DIVIDER */}
        <div className="ac-divider">or</div>

        {/* PAY INSTEAD */}
        <button
          className="btn-secondary"
          onClick={()=>setScreen("pricing")}
          style={{width:"100%",marginBottom:12}}
        >
          Continue to Paid Plan — $5/mo
        </button>

        <button
          className="btn-secondary"
          onClick={()=>setScreen("splash")}
          style={{width:"100%",fontSize:13,color:T.textDim}}
        >
          ← Back
        </button>

        {/* FOOTNOTE */}
        <div style={{marginTop:20,fontSize:11,color:T.textDim,fontFamily:"'Space Mono',monospace",lineHeight:1.7}}>
          Don't have a code? Ask the person who referred you, or tap "Continue to Paid Plan" above. Codes are case-insensitive.
        </div>
      </div>

    </div></div>
    {toast&&<div className="toast">{toast}</div>}
    </>
  );

  /* ══════════ PRICING ══════════ */
  if(screen==="pricing") return(
    <><style>{CSS}</style><div className="layer-bg"/><div className="layer-grid"/>
    <div className="root"><div className="pricing-screen">
      <div className="screen-hdr">
        <button className="btn-back" onClick={()=>setScreen("splash")}>← Back</button>
        <span className="screen-label">Simple Pricing</span>
      </div>

      {/* PRICE HERO */}
      <div className="price-hero">
        <div className="ph-eyebrow">GHOST SCREEN PRO · ALL FEATURES INCLUDED</div>
        <div className="ph-price-wrap">
          <span className="ph-dollar">$</span>
          <span className="ph-amount">5</span>
          <span className="ph-per">/month</span>
        </div>
        <div className="ph-sub">One plan. Every feature. No limits. No tiers.</div>
        <span className="ph-trial">7-DAY FREE TRIAL · NO CARD REQUIRED</span>
      </div>

      {/* FEATURES */}
      <div className="features-grid">
        {[
          {icon:"🤖",bg:g(T.green,.12),title:"Human AI Avatar Voices",desc:"6 avatars — male, female & neutral · Sounds like a real person"},
          {icon:"🌍",bg:g(T.blue,.12),  title:"40+ World Languages",   desc:"English, Spanish, French, Mandarin, Arabic, Hindi & more"},
          {icon:"🚨",bg:g(T.red,.12),   title:"Collector AI Detection", desc:"Scans recordings for debt keywords · Flags automatically"},
          {icon:"⭐",bg:g(T.amber,.12), title:"VIP Bypass List",        desc:"Contacts you trust ring straight through — no prompts"},
          {icon:"⏰",bg:g(T.indigo,.12),title:"Smart Scheduling",       desc:"Set exact hours and days for auto-activation"},
          {icon:"📱",bg:g(T.blue,.12),  title:"Contact Picker",         desc:"Tap your contacts to add VIPs — syncs instantly"},
          {icon:"📄",bg:g(T.purple,.12||g(T.indigo,.12)),title:"Full Call Receipts",desc:"Every call logged with recording, keywords & outcome"},
          {icon:"🔒",bg:g(T.green,.12), title:"Private & Encrypted",    desc:"Your calls and contacts are never shared or sold"},
        ].map(({icon,bg,title,desc})=>(
          <div key={title} className="feat-row">
            <div className="feat-icon" style={{background:bg}}>{icon}</div>
            <div className="feat-text"><strong>{title}</strong><span>{desc}</span></div>
            <span className="feat-check">✓</span>
          </div>
        ))}
      </div>

      {/* COMPARISON */}
      <div className="comparison-note">
        <div className="cn-title">How we compare</div>
        {[["Robokiller","$5.99/mo · Basic"],["Hiya Premium","$3.99/mo · Limited"],["Nomorobo","$1.99/mo · Calls only"],["Ghost Screen","$5/mo · Everything ✓"]].map(([app,price])=>(
          <div key={app} className="cn-row">
            <span className="cn-app">{app}</span>
            <span className={app==="Ghost Screen"?"cn-us":""}>{price}</span>
          </div>
        ))}
      </div>

      <button className="btn-primary" onClick={()=>setScreen("payment")}>Start My Free Trial →</button>
      <div className="price-terms">No credit card required · Cancel anytime<br/>Billed monthly at $5.00 after 7-day trial<br/>Works everywhere in the world 🌍</div>
    </div></div></>
  );

  /* ══════════ PAYMENT SCREEN ══════════ */
  if(screen==="payment") return(
    <><style>{CSS}</style><div className="layer-bg"/><div className="layer-grid"/>
    <div className="root"><div className="pricing-screen">
      <div className="screen-hdr">
        <button className="btn-back" onClick={()=>setScreen("pricing")}>← Back</button>
        <span className="screen-label">Secure Checkout</span>
      </div>

      {/* ORDER SUMMARY */}
      <div style={{background:`linear-gradient(140deg,${g(T.green,.08)},${g(T.blue,.04)})`,border:`1px solid ${g(T.green,.3)}`,borderRadius:20,padding:"20px 22px",marginBottom:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:20,right:20,height:1,background:`linear-gradient(90deg,transparent,${T.green},transparent)`}}/>
        <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",letterSpacing:"2px",color:T.green,textTransform:"uppercase",marginBottom:12}}>Order Summary</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,color:T.white,marginBottom:3}}>Ghost Screen PRO</div>
            <div style={{fontSize:12,color:T.textSub}}>All features · 40+ languages · AI voices · VIP bypass</div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:T.white,lineHeight:1}}>$5<span style={{fontSize:14,color:T.textSub,fontFamily:"'Sora',sans-serif",fontWeight:400}}>/mo</span></div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
          {["7-day free trial","Cancel anytime","No hidden fees","Instant access"].map(b=>(
            <span key={b} style={{fontSize:10,fontFamily:"'Space Mono',monospace",padding:"3px 10px",borderRadius:20,background:g(T.green,.1),color:T.green,border:`1px solid ${g(T.green,.25)}`}}>{b}</span>
          ))}
        </div>
      </div>

      {/* PAYMENT METHODS */}
      <div style={{fontSize:13,fontWeight:700,color:T.white,marginBottom:12}}>Choose Payment Method</div>

      {/* Digital Wallets */}
      <div style={{fontSize:10,fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:"1px",color:T.textSub,marginBottom:8}}>Digital Wallets</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {id:"apple",  label:"Apple Pay",   icon:"🍎", color:"#fff",    sub:"Face ID / Touch ID"},
          {id:"google", label:"Google Pay",  icon:"🔵", color:"#4285f4", sub:"Fast & secure"},
          {id:"paypal", label:"PayPal",      icon:"💙", color:"#003087", sub:"PayPal balance or card"},
          {id:"cashapp",label:"Cash App",    icon:"💚", color:"#00d632", sub:"$Cashtag or card"},
          {id:"venmo",  label:"Venmo",       icon:"💜", color:"#3d95ce", sub:"Venmo balance"},
          {id:"zelle",  label:"Zelle",       icon:"💜", color:"#6d1ed4", sub:"Bank to bank"},
        ].map(m=>(
          <PayMethodCard key={m.id} method={m} selected={payMethod} onSelect={setPayMethod}/>
        ))}
      </div>

      {/* Buy Now Pay Later */}
      <div style={{fontSize:10,fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:"1px",color:T.textSub,marginBottom:8}}>Buy Now, Pay Later</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {id:"klarna",  label:"Klarna",   icon:"🛍️", color:"#ffb3c7", sub:"Pay in 4 · 0% interest"},
          {id:"afterpay",label:"Afterpay", icon:"⬛", color:"#b2fce4", sub:"4 payments · no fees"},
          {id:"affirm",  label:"Affirm",   icon:"⚫", color:"#d2f4c3", sub:"Monthly installments"},
        ].map(m=>(
          <PayMethodCard key={m.id} method={m} selected={payMethod} onSelect={setPayMethod}/>
        ))}
      </div>

      {/* Cards */}
      <div style={{fontSize:10,fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:"1px",color:T.textSub,marginBottom:8}}>Credit / Debit Card</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {id:"visa",    label:"Visa",       icon:"💳", color:"#1a1f71", sub:"Credit or debit"},
          {id:"mc",      label:"Mastercard", icon:"🔴", color:"#eb001b", sub:"Credit or debit"},
          {id:"amex",    label:"Amex",       icon:"💳", color:"#007bc1", sub:"Credit card"},
          {id:"discover",label:"Discover",   icon:"🟠", color:"#ff6000", sub:"Credit or debit"},
          {id:"prepaid", label:"Prepaid",    icon:"💳", color:T.green,   sub:"Any prepaid card"},
        ].map(m=>(
          <PayMethodCard key={m.id} method={m} selected={payMethod} onSelect={setPayMethod}/>
        ))}
      </div>

      {/* International / Unbanked */}
      <div style={{fontSize:10,fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:"1px",color:T.textSub,marginBottom:8}}>International & Unbanked</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {id:"carrier", label:"Carrier Bill",icon:"📱", color:T.amber,  sub:"Charge to phone bill"},
          {id:"bitcoin", label:"Bitcoin",     icon:"₿",   color:"#f7931a",sub:"BTC accepted"},
          {id:"usdt",    label:"USDT",        icon:"💲", color:"#26a17b", sub:"Tether stablecoin"},
          {id:"ach",     label:"Bank Transfer",icon:"🏦", color:T.blue,  sub:"ACH · 1-2 business days"},
        ].map(m=>(
          <PayMethodCard key={m.id} method={m} selected={payMethod} onSelect={setPayMethod}/>
        ))}
      </div>

      {/* SELECTED SUMMARY */}
      {payMethod&&(
        <div style={{background:g(T.green,.07),border:`1px solid ${g(T.green,.22)}`,borderRadius:13,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>✅</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:T.white}}>Payment method selected</div>
            <div style={{fontSize:11,color:T.textSub,fontFamily:"'Space Mono',monospace",marginTop:2}}>You won't be charged until your 7-day trial ends</div>
          </div>
        </div>
      )}

      {/* DISCLAIMERS */}
      <div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px 18px",marginBottom:16}}>
        <div style={{fontSize:11,fontFamily:"'Space Mono',monospace",textTransform:"uppercase",letterSpacing:"1px",color:T.textSub,marginBottom:12}}>📋 Terms & Disclaimers</div>
        {[
          {ico:"🆓",title:"Free Trial",       text:"Your 7-day free trial starts today. You will not be charged until Day 8. We send a reminder on Day 6."},
          {ico:"❌",title:"Cancel Anytime",   text:"Cancel before Day 8 and you owe nothing. Cancel at any time — your service continues until the end of the paid period. No cancellation fees, ever."},
          {ico:"💰",title:"Refund Policy",    text:"Not satisfied in your first 7 days of paid service? Contact us for a full refund. No questions asked."},
          {ico:"🎙️",title:"Call Recording",  text:"Recording laws vary by location. By using Ghost Screen you confirm you are aware of and compliant with local call recording laws. Ghost Screen is not liable for user-initiated recordings."},
          {ico:"🚨",title:"Emergency Calls",  text:"Ghost Screen NEVER blocks emergency calls. 911, 999, 112, and all emergency numbers always connect instantly regardless of your settings."},
          {ico:"🔒",title:"Your Privacy",     text:"All call recordings are encrypted with AES-256. We never sell, share, or monetize your data. Recordings are auto-deleted after 30 days unless you save them."},
          {ico:"⚠️",title:"No 100% Guarantee",text:"Ghost Screen catches the vast majority of spam and collector calls but no technology can block 100% of calls. We are continuously improving detection accuracy."},
          {ico:"💳",title:"Billing Descriptor",text:"Your bank statement will show: GHOSTSCREEN $5.00 — so you always know what the charge is."},
        ].map(({ico,title,text})=>(
          <div key={title} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:`1px solid ${T.bg0}`}}>
            <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{ico}</span>
            <div><div style={{fontSize:12,fontWeight:700,color:T.white,marginBottom:3}}>{title}</div><div style={{fontSize:11,color:T.textSub,lineHeight:1.6}}>{text}</div></div>
          </div>
        ))}
        <div style={{padding:"10px 0",borderBottom:`1px solid ${T.bg0}`}}>
          <div style={{fontSize:11,fontWeight:700,color:T.white,marginBottom:3}}>🔄 Chargeback Policy</div>
          <div style={{fontSize:11,color:T.textSub,lineHeight:1.6}}>If you believe you were charged in error, contact us at <span style={{color:T.blue}}>support@ghostscreen.app</span> before disputing with your bank. We resolve billing issues within 24 hours. Fraudulent chargebacks may result in account termination. All account activity is logged for dispute resolution.</div>
        </div>
        <div style={{padding:"10px 0 0"}}>
          <div style={{fontSize:11,fontWeight:700,color:T.white,marginBottom:3}}>📄 Full Terms</div>
          <div style={{fontSize:11,color:T.textSub,lineHeight:1.6}}>By starting your trial you agree to our <span style={{color:T.blue}}>Terms of Service</span> and <span style={{color:T.blue}}>Privacy Policy</span>. Ghost Screen is operated under applicable consumer protection and telecommunications laws.</div>
        </div>
      </div>

      {/* SECURITY BADGES */}
      <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
        {["🔒 SSL Encrypted","🛡️ Stripe Secured","✅ PCI Compliant","🔐 2FA Protected"].map(b=>(
          <span key={b} style={{fontSize:10,fontFamily:"'Space Mono',monospace",color:T.textDim,padding:"4px 10px",border:`1px solid ${T.border}`,borderRadius:8}}>{b}</span>
        ))}
      </div>

      <button className="btn-primary" onClick={()=>setScreen("wizard")} disabled={!payMethod} style={!payMethod?{opacity:.4,cursor:"not-allowed"}:{}}>
        {payMethod?`Start Free Trial →`:"Select a Payment Method"}
      </button>
      <div className="price-terms">No charge for 7 days · $5.00/mo after trial · Cancel anytime</div>
    </div></div></>
  );

  /* ══════════ WIZARD ══════════ */
  if(screen==="wizard"){
    const TOTAL=4;
    const goNext=()=>{stopSpeak();setWizStep(s=>s+1);};
    const goBack=()=>{stopSpeak();wizStep===0?setScreen("pricing"):setWizStep(s=>s-1);};
    return(
      <><style>{CSS}</style><div className="layer-bg"/><div className="layer-grid"/>
      <div className="root"><div className="wizard">
        <div className="wiz-head">
          <div className="wiz-nav">
            <button className="btn-back" onClick={goBack} disabled={wizProg>=0&&wizStep===3}>
              ← {wizStep===0?"Plans":"Back"}
            </button>
            <span className="wiz-step-lbl">Step {wizStep+1} of {TOTAL}</span>
            {wizStep<3&&<button className="btn-skip" onClick={goNext}>Skip</button>}
          </div>
          <div className="pip-row">{Array.from({length:TOTAL}).map((_,i)=><div key={i} className={`pip ${i<wizStep?"done":i===wizStep?"cur":""}`}/>)}</div>
          {wizStep===0&&<><div className="wiz-title">Choose Your <em>Language</em></div><div className="wiz-sub">Ghost Screen speaks to your callers naturally — pick the language that fits where you are in the world.</div></>}
          {wizStep===1&&<><div className="wiz-title">Choose Your <em>AI Voice</em></div><div className="wiz-sub">Tap any avatar to hear them speak. These are human-quality voices — not robotic. Real people won't know the difference.</div></>}
          {wizStep===2&&<><div className="wiz-title">Add <em>VIP Contacts</em></div><div className="wiz-sub">These people ring straight through — no screening, no prompts, no delays. Family, doctors, employers.</div></>}
          {wizStep===3&&<><div className="wiz-title">{wizProg<0?"Ready to <em>Activate</em>":wizProg>=4?"You're <em>Protected</em>":"Activating…"}</div><div className="wiz-sub">{wizProg>=4?`${avatar.emoji} ${avatar.name} is live in ${lang.flag} ${lang.name}. ${vip.length} VIP contact${vip.length!==1?"s":""} set.`:"Setting up your Ghost Screen…"}</div></>}
        </div>

        <div className="wiz-body">
          {wizStep===0&&(
            <>
              <div className="search-wrap">
                <span className="search-ico">🔍</span>
                <input className="search-input" placeholder="Search language or country…" value={langQ} onChange={e=>setLangQ(e.target.value)}/>
              </div>
              <div className="lang-list">
                {filteredLangs.map(l=>(
                  <div key={l.code} className={`lang-item ${lang.code===l.code?"sel":""}`} onClick={()=>{setLang(l);setLangQ("");}}>
                    <span className="li-flag">{l.flag}</span>
                    <div><span className="li-name">{l.name}</span><span className="li-country">{l.country} · {l.code}</span></div>
                    {lang.code===l.code&&<span className="li-check">✓</span>}
                  </div>
                ))}
              </div>
            </>
          )}

          {wizStep===1&&(
            <>
              <div className="gender-tabs">
                {["all","female","male","neutral"].map(gv=>(
                  <button key={gv} className={`gender-tab ${gFilter===gv?"on":""}`} onClick={()=>setGFilter(gv)}>
                    {gv==="all"?"All":gv.charAt(0).toUpperCase()+gv.slice(1)}
                  </button>
                ))}
              </div>
              <AvatarSpeaker avatar={avatar} speaking={speaking} showPrompt promptText={currentPrompt}/>
              <div className="av-grid">
                {filteredAvatars.filter(av=>av.id!=="custom").map(av=>(
                  <div key={av.id} className={`av-card ${avatar.id===av.id?"sel":""}`}
                    onClick={()=>{stopSpeak();setAvatar(av);setTimeout(()=>speak(currentPrompt,lang.code,av),150);}}
                    style={avatar.id===av.id?{borderColor:g(av.color,.5),boxShadow:`0 6px 24px ${g(av.color,.15)}`}:{}}>
                    <div className="av-card-glow" style={{background:`radial-gradient(circle at 50% 30%,${g(av.color,.09)},transparent 70%)`}}/>
                    {avatar.id===av.id&&<div className="av-active-tag" style={{background:g(av.color,.16),color:av.color,border:`1px solid ${g(av.color,.3)}`}}>ACTIVE</div>}
                    <div className="av-emoji-ring" style={{background:avatar.id===av.id?g(av.color,.14):T.card2,borderColor:avatar.id===av.id?g(av.color,.38):T.border,boxShadow:avatar.id===av.id?`0 0 20px ${g(av.color,.2)}`:"none"}}>
                      {av.emoji}
                    </div>
                    <div className="av-name" style={{color:avatar.id===av.id?av.color:T.white}}>{av.name}</div>
                    <div className="av-desc">{av.desc}</div>
                    <span className="av-gender-chip" style={{background:g(av.color,.09),color:av.color,border:`1px solid ${g(av.color,.22)}`}}>{av.gender}</span>
                  </div>
                ))}
                {/* MY VOICE card in wizard */}
                <div className={`av-card ${avatar.id==="custom"?"sel":""}`}
                  onClick={()=>setShowCustomRecorder(true)}
                  style={avatar.id==="custom"?{borderColor:g(T.amber,.5),boxShadow:`0 6px 24px ${g(T.amber,.15)}`}:{borderStyle:"dashed"}}>
                  <div className="av-card-glow" style={{background:`radial-gradient(circle at 50% 30%,${g(T.amber,.09)},transparent 70%)`}}/>
                  {avatar.id==="custom"&&<div className="av-active-tag" style={{background:g(T.amber,.16),color:T.amber,border:`1px solid ${g(T.amber,.3)}`}}>ACTIVE</div>}
                  <div className="av-emoji-ring" style={{background:avatar.id==="custom"?g(T.amber,.14):T.card2,borderColor:avatar.id==="custom"?g(T.amber,.38):T.border}}>{customVoiceUrl?"🎤":"➕"}</div>
                  <div className="av-name" style={{color:avatar.id==="custom"?T.amber:T.white}}>My Voice</div>
                  <div className="av-desc">{customVoiceUrl?"Your recording":"Record yourself"}</div>
                  <span className="av-gender-chip" style={{background:g(T.amber,.09),color:T.amber,border:`1px solid ${g(T.amber,.22)}`}}>custom</span>
                </div>
              </div>
              {/* Show recorder inline in wizard if triggered */}
              {showCustomRecorder&&(
                <CustomVoiceRecorder
                  onSave={saveCustomVoice}
                  onCancel={()=>setShowCustomRecorder(false)}
                  existingBlob={customVoiceBlob}
                />
              )}
              {/* API KEY SECTION */}
              <div className="api-key-section">
                <div className="ak-title">🎙 Unlock True Human Voices</div>
                <div className="ak-sub">Enter your free ElevenLabs API key to enable voices that sound like real people — not a computer. Get a free key at <a className="ak-link" href="https://elevenlabs.io" target="_blank" rel="noopener">elevenlabs.io</a></div>
                <div className="ak-input-row">
                  <input className="ak-input" type="password" placeholder="sk_••••••••••••••••••••••••••••••••" value={apiKeyInput} onChange={e=>setApiKeyInput(e.target.value)}/>
                  <button className="ak-save" onClick={saveApiKey}>Connect</button>
                </div>
                <div className={`ak-status ${apiKeyStatus}`}>
                  {apiKeyStatus==="active"?<>✓ ElevenLabs connected · Human voices active</>:<>○ Using device voices · Add key for human quality</>}
                </div>
              </div>
            </>
          )}

          {wizStep===2&&(
            !contactsGranted?(
              <div className="contacts-perm">
                <span className="cp-icon">📱</span>
                <div className="cp-title">Access Your Contacts</div>
                <div className="cp-desc">Tap below and Ghost Screen will show your contacts. Tap who you want — no one else sees your list. Your privacy is protected.</div>
                <button className="btn-allow" onClick={grantContacts}>Allow Contact Access</button>
                <button className="btn-skip-ct" onClick={goNext}>Skip — I'll add manually</button>
              </div>
            ):(
              <>
                {selectedCIDs.size>0&&<div className="sel-bar"><span className="sel-count">{selectedCIDs.size} selected as VIP</span><button className="btn-clear" onClick={()=>setSelectedCIDs(new Set())}>Clear all</button></div>}
                <div className="search-wrap">
                  <span className="search-ico">🔍</span>
                  <input className="search-input" placeholder="Search contacts…" value={contactQ} onChange={e=>setContactQ(e.target.value)}/>
                </div>
                <div className="contact-list">
                  {filteredCts.map(c=>{const sel=selectedCIDs.has(c.id);return(
                    <div key={c.id} className={`ct-item ${sel?"sel":""}`} onClick={()=>toggleCID(c.id)}>
                      <div className="ct-av">{c.emoji}</div>
                      <div style={{flex:1}}><span className="ct-name">{c.name}</span><span className="ct-phone">{c.phone}</span></div>
                      <div className="ct-check">{sel?"✓":""}</div>
                    </div>
                  );})}
                </div>
              </>
            )
          )}

          {wizStep===3&&(
            <div className="inst-steps">
              {[
                {l:"Language configured",  s:`${lang.flag} ${lang.name} · ${lang.country}`},
                {l:"AI Voice activated",   s:apiKey?`${avatar.emoji} ${avatar.name} · ElevenLabs · Human quality`:`${avatar.emoji} ${avatar.name} · Device voice`},
                {l:"Voice prompt ready",   s:"Collector AI keyword engine loaded"},
                {l:"VIP contacts synced",  s:`${vip.length} contact${vip.length!==1?"s":""} bypass-enabled`},
                {l:"Ghost Screen is LIVE", s:"All systems operational · $5/mo"},
              ].map(({l,s},i)=>{
                const st=wizProg>i?"done":wizProg===i?"cur":"wait";
                return(<div key={i} className={`inst-step ${st==="done"?"done":st==="cur"?"cur":""}`}>
                  <div className={`inst-dot ${st}`}>{st==="done"?"✓":st==="cur"?"◌":i+1}</div>
                  <div><span className="inst-lbl">{l}</span><span className="inst-sub">{s}</span></div>
                </div>);
              })}
            </div>
          )}
        </div>

        <div className="wiz-foot">
          {wizStep===0&&<button className="btn-wiz-next" onClick={goNext}>Set Language & Continue →</button>}
          {wizStep===1&&<button className="btn-wiz-next" onClick={goNext}>Save Voice & Continue →</button>}
          {wizStep===2&&contactsGranted&&selectedCIDs.size>0&&<button className="btn-wiz-next" onClick={()=>{applyContacts();goNext();}}>Save {selectedCIDs.size} VIP Contact{selectedCIDs.size!==1?"s":""} & Continue →</button>}
          {wizStep===2&&contactsGranted&&selectedCIDs.size===0&&<button className="btn-wiz-next" onClick={goNext}>Continue →</button>}
          {wizStep===3&&wizProg<0&&<button className="btn-wiz-next" onClick={runInstall}>🚀 Activate Ghost Screen</button>}
          {wizStep===3&&wizProg>=0&&wizProg<4&&<button className="btn-wiz-next" disabled>Setting up…</button>}
          {wizStep===3&&wizProg>=4&&<button className="btn-wiz-next" onClick={()=>{stopSpeak();setScreen("app");}}>Enter Ghost Screen →</button>}
        </div>
      </div></div></>
    );
  }

  /* ══════════════════════════════════
     MAIN APP
     ══════════════════════════════════ */
  return(
    <><style>{CSS}</style><div className="layer-bg"/><div className="layer-grid"/>
    <div className="root">
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">👻</div>
          <div className="brand-name">Ghost<em>Screen</em></div>
        </div>
        <div className="tb-right">
          <div className="lang-pill" onClick={()=>setShowLangModal(true)}>
            <span style={{fontSize:15}}>{lang.flag}</span>
            <span className="lp-code">{lang.code}</span>
          </div>
          <span className="ver-tag">$5/mo</span>
          <div className="notif-btn">🔔{calls.filter(c=>c.s==="fl"||c.s==="pe").length>0&&<div className="notif-dot">{calls.filter(c=>c.s==="fl"||c.s==="pe").length}</div>}</div>
        </div>
      </div>

      <div className="master-wrap">
        <div className={`master-card ${masterOn?"on":"off"}`}>
          <div className="mc-body">
            <div className={`mc-shield ${masterOn?"on":"off"}`}>
              {masterOn&&<div className="mc-pulse"/>}
              <span style={{filter:masterOn?`drop-shadow(0 0 10px ${g(T.green,.5)})`:"none"}}>{masterOn?"🛡️":"💤"}</span>
            </div>
            <div className="mc-info">
              <div className="mc-heading">{masterOn?"Screening Active":"Screening Paused"}</div>
              <div className={`mc-sub ${masterOn?"on":"off"}`}>
                {masterOn?`${avatar.emoji} ${avatar.name} · ${lang.flag} ${lang.name}`:"Tap toggle to re-enable"}
              </div>
            </div>
            <div className="mc-av" style={{background:g(avatar.color,.1),borderColor:g(avatar.color,.32)}}>
              <span style={{fontSize:18}}>{avatar.emoji}</span>
            </div>
            <button className={`big-tog ${masterOn?"on":"off"}`} onClick={()=>{setMasterOn(p=>{showToast(p?"👻 Screening paused":"🛡️ Screening active");return !p;});}}>
              <div className="tog-dot"/>
            </button>
          </div>
          <div className="stats-row">
            {[{n:totScreened,l:"Screened",c:T.green},{n:totCollect,l:"Collectors",c:T.red},{n:totVip,l:"VIP",c:T.amber},{n:totBlocked,l:"Blocked",c:T.textSub}].map(({n,l,c})=>(
              <div key={l} className="stat-cell"><div className="stat-num" style={{color:c}}>{n}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {liveCall&&(
        <div className="live-alert">
          <div className="live-dot"/>
          <div className="la-info"><strong>{avatar.name} Speaking Now</strong><span>+1 (800) 449-7723 · collector · {lang.flag}</span></div>
          <div className="la-btns">
            <button className="la-btn la-listen" onClick={()=>{setTab("log");setFilter("collector");}}>Listen</button>
            <button className="la-btn la-dismiss" onClick={()=>setLiveDismissed(true)}>✕</button>
          </div>
        </div>
      )}

      <div className="nav-bar">
        {[["log","📋","Log"],["avatar","🤖","Avatar"],["schedule","⏰","Schedule"],["vip","⭐","VIP"],["settings","⚙️","Settings"]].map(([id,ico,lbl])=>(
          <button key={id} className={`nav-btn ${tab===id?"on":""}`} onClick={()=>setTab(id)}>
            <span className="nav-icon">{ico}</span>{lbl}
          </button>
        ))}
      </div>

      {/* LOG */}
      {tab==="log"&&(
        <div className="sec scroll">
          <div className="stat-bar" style={{marginTop:0}}>
            {[{n:todayCalls,l:"Today",c:T.blue},{n:totCollect,l:"Collectors",c:T.red},{n:totBlocked,l:"Blocked",c:T.textSub},{n:totVip,l:"VIP",c:T.amber}].map(({n,l,c})=>(
              <div key={l} className="sm"><div className="sm-num" style={{color:c}}>{n}</div><div className="sm-lbl">{l}</div></div>
            ))}
          </div>
          <div className="exp-bar">
            <div className="exp-info"><strong>📄 Export Receipts</strong><span>{calls.length} calls · {lang.flag} {lang.name} · {avatar.emoji} {avatar.name}</span></div>
            <button className="btn-export" onClick={exportLog}>Export</button>
          </div>
          <div className="filter-bar">
            {[["all","All"],["collector","🚨 Collectors"],["safe","✅ Safe"],["vip","⭐ VIP"],["blocked","🚫 Blocked"],["pending","⏳ Pending"]].map(([f,l])=>(
              <button key={f} className={`fc ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>{l}</button>
            ))}
          </div>
          {filtered.length===0&&<div className="empty-state"><span className="empty-ico">📋</span><p>No calls match this filter.</p></div>}
          {["Today","Yesterday","Mon Jun 2"].map(date=>{
            const grp=filtered.filter(c=>c.d===date);if(!grp.length)return null;
            return(<div key={date}>
              <div className="date-div"><span>{date}</span></div>
              {grp.map(call=>{
                const ss=SS[call.s]||SS.pe;
                const ti=TAG[call.tag]||TAG.unknown;
                const isOpen=expanded===call.id;
                return(
                  <div key={call.id} className={`receipt ${call.s} ${isOpen?"open":""}`}>
                    <div className="rc-row" onClick={()=>setExpanded(e=>e===call.id?null:call.id)}>
                      <div className="rc-av" style={{background:ss.bg,border:`1.5px solid ${ss.bb}`}}>{call.emo}</div>
                      <div className="rc-mid">
                        <div className="rc-num">{call.num}</div>
                        <div className="rc-name">{call.name}</div>
                        <div className="rc-tags">
                          <span className="rtag" style={{color:ti[0],background:ti[1],border:`1px solid ${ti[2]}`}}>{ti[3]}</span>
                          {call.agency&&<span className="rtag" style={{color:T.red,background:g(T.red,.09),border:`1px solid ${g(T.red,.25)}`}}>{call.agency}</span>}
                        </div>
                      </div>
                      <div className="rc-right"><div className="rc-ico">{OUTCOME_ICON[call.out]||"❓"}</div><div className="rc-time">{call.t}</div><span className={`chev ${isOpen?"open":""}`}>▼</span></div>
                    </div>
                    {isOpen&&(
                      <div className="rc-detail">
                        <div className="dt-table">
                          {[["Phone",call.num,null],["Caller",call.name,null],["Date",`${call.d} · ${call.t}`,null],
                            ["Outcome",call.out.toUpperCase(),call.out==="blocked"||call.out==="declined"?"r":call.out==="answered"||call.out==="bypassed"?"g":null],
                            ["Status",call.tag.toUpperCase(),call.tag==="collector"?"r":"safe"===call.tag||"vip"===call.tag?"g":null],
                            call.dur?["Duration",call.dur,null]:null,call.agency?["Agency",call.agency,"r"]:null,
                            ["Avatar",`${avatar.emoji} ${avatar.name}`,"g"],["Language",`${lang.flag} ${lang.name}`,"g"],
                          ].filter(Boolean).map(([k,v,c])=>(
                            <div key={k} className="dt-row"><span className="dt-key">{k}</span><span className={`dt-val ${c||""}`}>{v}</span></div>
                          ))}
                        </div>
                        {call.trans&&(
                          <div className="rec-player">
                            <div className="rp-head"><span className="rp-lbl">🎙 Caller Recording</span>{call.kw?.length>0&&<span className="rp-alert">● COLLECTOR DETECTED</span>}</div>
                            <Waveform playing={playing===call.id} color={call.tag==="collector"?T.red:T.green}/>
                            <div className="rp-ctrl">
                              <button className="btn-play" onClick={()=>setPlaying(p=>p===call.id?null:call.id)}>{playing===call.id?"⏸":"▶"}</button>
                              <div className="trans-txt">"{call.trans}"</div>
                            </div>
                          </div>
                        )}
                        {call.kw?.length>0&&<div className="kw-strip"><span style={{fontSize:10,color:T.red,fontFamily:"'Space Mono',monospace",marginRight:4,flexShrink:0}}>⚠ Flags:</span>{call.kw.map(k=><span key={k} className="kw-tag">{k}</span>)}</div>}
                        {call.s==="by"&&<div className="chip-vip">⭐ VIP bypass · {call.vipName} rang through without screening</div>}
                        {call.s==="pe"&&<div className="chip-pend">⏳ {avatar.name} is speaking to this caller now…</div>}
                        {(call.s==="fl"||call.s==="sa"||call.s==="pe")&&(
                          <div className="act-row">
                            {call.s==="fl"?(<><button className="ab ab-dec" onClick={()=>declineCall(call.id)}>📵 Decline</button><button className="ab ab-blk" onClick={()=>blockCall(call.id)}>🚫 Block</button></>)
                            :call.s==="sa"?(<><button className="ab ab-ans" onClick={()=>answerCall(call.id)}>📞 Answer</button><button className="ab ab-dec" onClick={()=>declineCall(call.id)}>📵 Decline</button></>)
                            :(<><button className="ab ab-dec" onClick={()=>declineCall(call.id)}>📵 Decline</button><button className="ab ab-ans" style={{background:T.blue,color:"#fff"}} onClick={()=>answerCall(call.id)}>📞 Answer</button></>)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>);
          })}
        </div>
      )}

      {/* AVATAR */}
      {tab==="avatar"&&(
        <div className="sec scroll">
          {/* Show recorder OR normal view */}
          {showCustomRecorder ? (
            <CustomVoiceRecorder
              onSave={saveCustomVoice}
              onCancel={()=>setShowCustomRecorder(false)}
              existingBlob={customVoiceBlob}
            />
          ) : (
            <>
              <AvatarSpeaker avatar={avatar} speaking={speaking} showPrompt promptText={avatar.id==="custom"?"Your own recorded voice will play for callers.":currentPrompt}/>

              {/* Custom voice active banner */}
              {avatar.id==="custom"&&customVoiceUrl&&(
                <div className="cv-success" style={{marginBottom:14}}>
                  <span className="cv-success-ico">🎤</span>
                  <div className="cv-success-text">
                    <strong>Your Voice is Active</strong>
                    <span>Callers hear your real voice — not AI</span>
                  </div>
                  <button onClick={()=>setShowCustomRecorder(true)} style={{marginLeft:"auto",padding:"7px 12px",borderRadius:9,border:`1px solid ${g(T.amber,.3)}`,background:g(T.amber,.1),color:T.amber,fontSize:11,fontWeight:700,flexShrink:0}}>Re-record</button>
                </div>
              )}

              <div style={{display:"flex",gap:9,marginBottom:14}}>
                <button onClick={()=>speaking?stopSpeak():testVoice()} style={{flex:1,padding:"11px",borderRadius:12,border:`1px solid ${g(avatar.color,.38)}`,background:g(avatar.color,.07),color:avatar.color,fontSize:13,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                  {speaking?`⏹ Stop`:`▶ Hear ${avatar.name}`}
                </button>
                <button onClick={()=>setShowLangModal(true)} style={{flex:1,padding:"11px",borderRadius:12,border:`1px solid ${T.border}`,background:T.card,color:T.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  🌍 {lang.flag} {lang.code}
                </button>
              </div>

              {/* ElevenLabs key */}
              {!apiKey&&(
                <div className="api-key-section">
                  <div className="ak-title">🎙 Human Voice Upgrade</div>
                  <div className="ak-sub">Add your free ElevenLabs key for true human-quality voices. Get one free at <a className="ak-link" href="https://elevenlabs.io" target="_blank" rel="noopener">elevenlabs.io</a></div>
                  <div className="ak-input-row">
                    <input className="ak-input" type="password" placeholder="Paste your ElevenLabs API key…" value={apiKeyInput} onChange={e=>setApiKeyInput(e.target.value)}/>
                    <button className="ak-save" onClick={saveApiKey}>Connect</button>
                  </div>
                </div>
              )}
              {apiKey&&<div style={{background:g(T.green,.07),border:`1px solid ${g(T.green,.22)}`,borderRadius:13,padding:"11px 15px",marginBottom:14,fontSize:12,color:T.green,fontFamily:"'Space Mono',monospace"}}>✓ ElevenLabs connected · True human voices active</div>}

              <div style={{fontSize:16,fontWeight:800,color:T.white,marginBottom:12}}>Choose Avatar</div>
              <div className="gender-tabs">
                {["all","female","male","neutral"].map(gv=>(
                  <button key={gv} className={`gender-tab ${gFilter===gv?"on":""}`} onClick={()=>setGFilter(gv)}>{gv==="all"?"All":gv.charAt(0).toUpperCase()+gv.slice(1)}</button>
                ))}
              </div>
              <div className="av-grid">
                {filteredAvatars.filter(av=>av.id!=="custom").map(av=>(
                  <div key={av.id} className={`av-card ${avatar.id===av.id?"sel":""}`}
                    onClick={()=>{stopSpeak();setAvatar(av);setTimeout(()=>speak(currentPrompt,lang.code,av),150);}}
                    style={avatar.id===av.id?{borderColor:g(av.color,.5),boxShadow:`0 6px 24px ${g(av.color,.15)}`}:{}}>
                    <div className="av-card-glow" style={{background:`radial-gradient(circle at 50% 30%,${g(av.color,.09)},transparent 70%)`}}/>
                    {avatar.id===av.id&&<div className="av-active-tag" style={{background:g(av.color,.16),color:av.color,border:`1px solid ${g(av.color,.3)}`}}>ACTIVE</div>}
                    <div className="av-emoji-ring" style={{background:avatar.id===av.id?g(av.color,.14):T.card2,borderColor:avatar.id===av.id?g(av.color,.38):T.border,boxShadow:avatar.id===av.id?`0 0 20px ${g(av.color,.2)}`:"none"}}>{av.emoji}</div>
                    <div className="av-name" style={{color:avatar.id===av.id?av.color:T.white}}>{av.name}</div>
                    <div className="av-desc">{av.desc}</div>
                    <span className="av-gender-chip" style={{background:g(av.color,.09),color:av.color,border:`1px solid ${g(av.color,.22)}`}}>{av.gender}</span>
                  </div>
                ))}

                {/* MY VOICE CARD — always shown at end */}
                <div
                  className={`av-card ${avatar.id==="custom"?"sel":""}`}
                  onClick={()=>{ stopSpeak(); setShowCustomRecorder(true); }}
                  style={avatar.id==="custom"?{borderColor:g(T.amber,.5),boxShadow:`0 6px 24px ${g(T.amber,.15)}`}:{borderStyle:"dashed"}}>
                  <div className="av-card-glow" style={{background:`radial-gradient(circle at 50% 30%,${g(T.amber,.09)},transparent 70%)`}}/>
                  {avatar.id==="custom"&&customVoiceUrl&&<div className="av-active-tag" style={{background:g(T.amber,.16),color:T.amber,border:`1px solid ${g(T.amber,.3)}`}}>ACTIVE</div>}
                  <div className="av-emoji-ring" style={{background:avatar.id==="custom"?g(T.amber,.14):T.card2,borderColor:avatar.id==="custom"?g(T.amber,.38):T.border,boxShadow:avatar.id==="custom"?`0 0 20px ${g(T.amber,.2)}`:"none"}}>
                    {customVoiceUrl?"🎤":"➕"}
                  </div>
                  <div className="av-name" style={{color:avatar.id==="custom"?T.amber:T.white}}>My Voice</div>
                  <div className="av-desc">{customVoiceUrl?"Your recorded voice":"Record your own"}</div>
                  <span className="av-gender-chip" style={{background:g(T.amber,.09),color:T.amber,border:`1px solid ${g(T.amber,.22)}`}}>custom</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SCHEDULE */}
      {tab==="schedule"&&(
        <div className="sec scroll">
          <div className="sec-hdr mt0"><div className="sec-title">Auto-Schedule</div><button className="btn-add" onClick={()=>setShowAddSched(s=>!s)}>{showAddSched?"✕ Cancel":"+ Add"}</button></div>
          {showAddSched&&(
            <div className="add-form">
              <div className="af-title">New Screening Window</div>
              <div className="af-f"><span className="af-lbl">Name</span><input className="af-in" placeholder="e.g. Work Hours" value={newSched.name} onChange={e=>setNewSched(s=>({...s,name:e.target.value}))}/></div>
              <div className="af-f"><span className="af-lbl">Days</span><div className="af-days">{DAYS.map((d,i)=><div key={i} className={`af-day ${newSched.days.includes(i)?"sel":""}`} onClick={()=>setNewSched(s=>({...s,days:s.days.includes(i)?s.days.filter(x=>x!==i):[...s.days,i]}))}>{d}</div>)}</div></div>
              <div className="af-f"><span className="af-lbl">Time</span><div className="af-tp"><input type="time" className="af-in" value={newSched.start} onChange={e=>setNewSched(s=>({...s,start:e.target.value}))}/><span>to</span><input type="time" className="af-in" value={newSched.end} onChange={e=>setNewSched(s=>({...s,end:e.target.value}))}/></div></div>
              <button className="btn-af-save" onClick={saveSched}>Save Schedule</button>
              <button className="btn-af-cancel" onClick={()=>setShowAddSched(false)}>Cancel</button>
            </div>
          )}
          {scheds.map(sc=>(
            <div key={sc.id} className="sched-card">
              <div className="sc-top">
                <div className={`sc-ico ${sc.active?"on":"off"}`}>{sc.icon}</div>
                <div style={{flex:1}}><div className="sc-name">{sc.name}</div><div className="day-row">{DAYS.map((d,i)=><span key={i} className={`dc ${sc.days.includes(i)?"on":"off"}`}>{d}</span>)}</div></div>
                <div className="sc-time-col"><div className="sc-time">{sc.start}–{sc.end}</div><div className="sc-sts" style={{color:sc.active?T.green:T.textSub}}>{sc.active?"● Active":"○ Paused"}</div></div>
              </div>
              <div className="sc-foot">
                <SmTog on={sc.active} toggle={()=>toggleSched(sc.id)}/>
                <span style={{fontSize:12,color:sc.active?T.green:T.textSub,fontWeight:600,flex:1}}>{sc.active?"Enabled":"Paused"}</span>
                <button onClick={()=>deleteSched(sc.id)} style={{padding:"5px 11px",border:`1px solid ${T.border}`,borderRadius:8,color:T.textSub,fontSize:11,fontWeight:700,transition:"all .2s"}}>Remove</button>
              </div>
            </div>
          ))}
          <div className="hint-box">Ghost Screen activates <strong>automatically</strong> during your windows. Master toggle always overrides instantly.</div>
        </div>
      )}

      {/* VIP */}
      {tab==="vip"&&(
        <div className="sec scroll">
          <div className="sec-hdr mt0"><div className="sec-title">VIP Bypass</div><button className="btn-add" onClick={()=>setShowAddVip(s=>!s)}>{showAddVip?"✕ Cancel":"+ Manual"}</button></div>
          <div className="vip-notice">⭐ These contacts <strong>skip all screening</strong> — they ring straight through, every time, instantly.</div>
          <button className="btn-contacts" onClick={()=>{if(!contactsGranted)grantContacts();setShowContactsModal(true);}}>📱 Add from Contacts</button>
          {showAddVip&&(
            <div className="vip-manual">
              <div style={{fontSize:13,fontWeight:700,color:T.white,marginBottom:11}}>Add Manually</div>
              <div className="af-f"><input className="af-in" placeholder="Name" value={newVipName} onChange={e=>setNewVipName(e.target.value)}/></div>
              <div className="vip-inp-row"><input className="af-in" placeholder="+1 (555) 000-0000" value={newVipNum} onChange={e=>setNewVipNum(e.target.value)}/><button className="btn-vip-add" onClick={addVip}>Add ⭐</button></div>
            </div>
          )}
          {vip.length===0&&!showAddVip&&<div className="empty-state"><span className="empty-ico">⭐</span><p>No VIP contacts yet.</p></div>}
          {vip.map(v=>(
            <div key={v.id} className="vip-card"><div className="vc-inner">
              <div className="vc-av">{v.emoji}</div>
              <div style={{flex:1}}><div className="vc-name">{v.name}</div><div className="vc-num">{v.num}</div></div>
              <div className="vc-badge">VIP</div>
              <button className="btn-vc-rm" onClick={()=>removeVip(v.id)}>Remove</button>
            </div></div>
          ))}
        </div>
      )}

      {/* SETTINGS */}
      {tab==="settings"&&(
        <div className="sec scroll">
          <div className="sg mt0">
            <div className="sg-hd">🎙 Voice & Language</div>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bg0}`}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:g(avatar.color,.1),border:`1.5px solid ${g(avatar.color,.32)}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{avatar.emoji}</div>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.white}}>{avatar.name}</div><div style={{fontSize:10,color:T.textSub,fontFamily:"'Space Mono',monospace"}}>{avatar.desc} · {avatar.gender}</div></div>
              <button style={{padding:"7px 12px",borderRadius:9,border:`1px solid ${g(avatar.color,.28)}`,background:g(avatar.color,.07),color:avatar.color,fontSize:11,fontWeight:700}} onClick={()=>setTab("avatar")}>Change</button>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${T.bg0}`}}>
              <span style={{fontSize:22}}>{lang.flag}</span>
              <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.white}}>{lang.name} · {lang.country}</div><div style={{fontSize:10,color:T.textSub,fontFamily:"'Space Mono',monospace"}}>{lang.code}</div></div>
              <button style={{padding:"7px 12px",borderRadius:9,border:`1px solid ${T.border}`,background:T.card2,color:T.green,fontSize:11,fontWeight:700}} onClick={()=>setShowLangModal(true)}>Change</button>
            </div>
            <div style={{padding:"10px 0"}}>
              <div style={{fontSize:12,color:apiKey?T.green:T.amber,fontFamily:"'Space Mono',monospace"}}>{apiKey?"✓ ElevenLabs · Human voices active":"○ Device voices · Add ElevenLabs key for human quality"}</div>
              {!apiKey&&<div className="ak-input-row" style={{marginTop:10}}>
                <input className="ak-input" type="password" placeholder="ElevenLabs API key…" value={apiKeyInput} onChange={e=>setApiKeyInput(e.target.value)}/>
                <button className="ak-save" onClick={saveApiKey}>Connect</button>
              </div>}
            </div>
          </div>
          <div className="sg">
            <div className="sg-hd">💰 Plan</div>
            <div style={{background:g(T.green,.06),border:`1px solid ${g(T.green,.2)}`,borderRadius:14,padding:"16px 18px",textAlign:"center"}}>
              <div style={{fontFamily:"'DM Serif Display',serif",fontSize:36,color:T.white,lineHeight:1}}>$5<span style={{fontSize:16,color:T.textSub,fontFamily:"'Sora',sans-serif",fontWeight:400}}>/month</span></div>
              <div style={{fontSize:12,color:T.green,fontFamily:"'Space Mono',monospace",marginTop:4}}>ALL FEATURES INCLUDED · NO LIMITS</div>
            </div>
          </div>
          <div className="sg">
            <div className="sg-hd">🎙 Screening</div>
            {[["voicePrompt","Voice Prompt Active","Avatar speaks to all unknown callers"],["autoDetect","AI Collector Detection","Flags debt/collection keywords in recordings"],["blockSilent","Block Silent Callers","Auto-decline if caller doesn't record"],["autoBlock","Auto-Block Collectors","Block flagged collectors without your review"]].map(([k,l,d])=>(
              <div key={k} className="s-row"><div className="s-info"><strong>{l}</strong><small>{d}</small></div><SmTog on={settings[k]} toggle={()=>setSettings(s=>({...s,[k]:!s[k]}))}/></div>
            ))}
          </div>
          <div className="sg">
            <div className="sg-hd">🔊 Voice Prompt Preview</div>
            <div className="prompt-box">"{currentPrompt}"</div>
            <button className="btn-cust" onClick={()=>speaking?stopSpeak():testVoice()}>{speaking?`⏹ Stop ${avatar.name}`:`▶ Preview in ${lang.flag} ${lang.name}`}</button>
          </div>
          <div className="sg">
            <div className="sg-hd">🔧 Tech Stack</div>
            {[["Human Voices","ElevenLabs · Turbo v2.5"],["AI Detection","OpenAI Whisper + GPT-4o"],["Languages","40+ · Google Cloud TTS"],["Backend","Twilio Voice API"],["Storage","AWS S3 · AES-256"],["Auth","Firebase + Biometrics"],["Platforms","iOS CallKit + Android"],["Compliance","TCPA · GDPR · CCPA"]].map(([k,v])=>(
              <div key={k} className="tech-row"><span>{k}</span><span className="tech-val">{v}</span></div>
            ))}
          </div>
          <div className="sg">
            <div className="sg-hd">📱 Account</div>
            {[["Plan","Ghost Screen · $5/mo",null],["Avatar",`${avatar.emoji} ${avatar.name}`,avatar.color],["Language",`${lang.flag} ${lang.name}`,null],["VIP Contacts",vip.length,T.amber],["Calls Screened",totScreened,T.green],["Collectors Blocked",totBlocked,T.red]].map(([k,v,c])=>(
              <div key={k} className="tech-row"><span>{k}</span><span style={{color:c||T.text,fontWeight:600}}>{v}</span></div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* LANG MODAL */}
    {showLangModal&&(
      <div className="modal-backdrop" onClick={()=>{setShowLangModal(false);setLangQ("");}}>
        <div className="modal-sheet" onClick={e=>e.stopPropagation()}>
          <div className="modal-handle"/>
          <div className="modal-title">🌍 Select Language</div>
          <div className="modal-sub">{LANGS.length} languages · {avatar.name} adapts instantly</div>
          <div className="search-wrap">
            <span className="search-ico">🔍</span>
            <input className="search-input" placeholder="Search language or country…" value={langQ} onChange={e=>setLangQ(e.target.value)} autoFocus/>
          </div>
          <div className="lang-list" style={{maxHeight:360}}>
            {filteredLangs.map(l=>(
              <div key={l.code} className={`lang-item ${lang.code===l.code?"sel":""}`}
                onClick={()=>{setLang(l);setShowLangModal(false);setLangQ("");showToast(`${l.flag} ${l.name} · ${l.country}`);stopSpeak();setTimeout(()=>speak(PROMPTS[l.lang]||PROMPTS.default,l.code),200);}}>
                <span className="li-flag">{l.flag}</span>
                <div><span className="li-name">{l.name}</span><span className="li-country">{l.country}</span></div>
                {lang.code===l.code&&<span className="li-check">✓</span>}
              </div>
            ))}
          </div>
          <button className="btn-modal-close" onClick={()=>{setShowLangModal(false);setLangQ("");}}>Close</button>
        </div>
      </div>
    )}

    {/* CONTACTS MODAL */}
    {showContactsModal&&(
      <div className="modal-backdrop" onClick={()=>setShowContactsModal(false)}>
        <div className="modal-sheet" onClick={e=>e.stopPropagation()} style={{paddingBottom:32}}>
          <div className="modal-handle"/>
          <div className="modal-title">📱 Select VIP Contacts</div>
          <div className="modal-sub">Tap contacts to add to your VIP bypass list</div>
          {!contactsGranted?(
            <div className="contacts-perm" style={{marginBottom:0}}>
              <span className="cp-icon">📱</span>
              <div className="cp-title">Allow Contact Access</div>
              <div className="cp-desc">Ghost Screen needs permission to show your contacts. Your list is never stored or shared.</div>
              <button className="btn-allow" onClick={grantContacts}>Allow Contact Access</button>
            </div>
          ):(
            <>
              {selectedCIDs.size>0&&<div className="sel-bar"><span className="sel-count">{selectedCIDs.size} selected</span><button className="btn-clear" onClick={()=>setSelectedCIDs(new Set())}>Clear all</button></div>}
              <div className="search-wrap">
                <span className="search-ico">🔍</span>
                <input className="search-input" placeholder="Search contacts…" value={contactQ} onChange={e=>setContactQ(e.target.value)}/>
              </div>
              <div className="contact-list" style={{maxHeight:300}}>
                {filteredCts.map(c=>{const sel=selectedCIDs.has(c.id);return(
                  <div key={c.id} className={`ct-item ${sel?"sel":""}`} onClick={()=>toggleCID(c.id)}>
                    <div className="ct-av">{c.emoji}</div>
                    <div style={{flex:1}}><span className="ct-name">{c.name}</span><span className="ct-phone">{c.phone}</span></div>
                    <div className="ct-check">{sel?"✓":""}</div>
                  </div>
                );})}
              </div>
              <button className="btn-wiz-next" style={{marginTop:14}} onClick={applyContacts} disabled={selectedCIDs.size===0}>
                {selectedCIDs.size>0?`Save ${selectedCIDs.size} VIP Contact${selectedCIDs.size!==1?"s":""} →`:"Select contacts above"}
              </button>
            </>
          )}
          <button className="btn-modal-close" onClick={()=>setShowContactsModal(false)}>Close</button>
        </div>
      </div>
    )}

    {toast&&<div className="toast">{toast}</div>}
    </>
  );
}
