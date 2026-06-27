#!/usr/bin/env node
// HavivNartikimBot
// התקנה: npm install node-telegram-bot-api
// הרצה: node bot.js

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

const TOKEN = "8927766030:AAEhjDCM1KvWE_OgaLwJlkhXmmOKnx6CSkk
"; // החלף בטוקן מ-BotFather
const ADMIN_CHAT_ID = "-5498872165"; // החלף בChat ID שלך (שלח הודעה ל @userinfobot)
const FILE = "inventory.json";
const LEAD = 90;

function load() {
if (!fs.existsSync(FILE)) return { models: [], history: [], schedule: { hour: 18, minute: 0 } };
return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
function persist(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }

const bot = new TelegramBot(TOKEN, { polling: true });
const inv = load();
const S = {};

const dL = m => m.dailyAvg > 0 ? Math.floor(m.stock / m.dailyAvg) : 999;
const isAlert = m => m.stock < m.minStock || dL(m) <= LEAD;
const isWarn = m => !isAlert(m) && dL(m) <= LEAD + 30;
const todayStr = () => new Date().toISOString().split("T")[0];
const fmtTime = ts => ts ? new Date(ts).toLocaleTimeString("he-IL",{hour:"2-digit",minute:"2-digit"}) : "-";

// =================== /start ===================
bot.onText(//start/, msg => {
bot.sendMessage(msg.chat.id,
"HavivNartikimBot - 245 דגמים\n\n" +
"/stock - מלאי\n/cat - קטגוריות\n/find שם - חיפוש\n" +
"/report - ספירת סוף יום\n/edit - עריכה\n/set שם כמות - עדכון מהיר\n" +
"/add שם מינ - הוסף\n/del שם - מחק\n/alert - התראות\n" +
"/top7 /top30 /top90 - מכירות\n/weekly - שבועי\n/monthly - חודשי\n" +
"/insight - תובנות\n/history - 7 ימים\n/settime HH:MM - שנה שעת תזכורת"
);
});

// =================== /stock ===================
bot.onText(//stock/, msg => {
if (!inv.models.length) return bot.sendMessage(msg.chat.id, "אין דגמים");
const lines = inv.models.slice(0, 50).map(m => {
const d = dL(m);
const ic = isAlert(m) ? "RED" : isWarn(m) ? "YELLOW" : "GREEN";
return ic + " " + m.name + " | " + m.stock + " | ~" + d + "d | " + fmtTime(m.lastUpdate);
}).join("\n");
const extra = inv.models.length > 50 ? "\n...ועוד " + (inv.models.length - 50) + " - השתמש /find" : "";
bot.sendMessage(msg.chat.id, "MALA\n\n" + lines + extra);
});

// =================== /cat ===================
bot.onText(//cat$/, msg => {
const cats = [...new Set(inv.models.map(m => m.category).filter(Boolean))];
bot.sendMessage(msg.chat.id, "CATEGORIES:\n" + cats.map((c,i)=>(i+1)+". "+c).join("\n") + "\n\n/cat [שם]");
});

bot.onText(//cat (.+)/, (msg, match) => {
const ms = inv.models.filter(m => m.category && m.category.includes(match[1].trim()));
if (!ms.length) return bot.sendMessage(msg.chat.id, "לא נמצא");
bot.sendMessage(msg.chat.id, match[1] + " (" + ms.length + "):\n" +
ms.map(m => (isAlert(m)?"RED ":"GREEN ") + m.name + " - " + m.stock).join("\n"));
});

// =================== /find ===================
bot.onText(//find (.+)/, (msg, match) => {
const q = match[1].toLowerCase();
const ms = inv.models.filter(m => m.name.toLowerCase().includes(q) || (m.sku && m.sku.toLowerCase().includes(q)));
if (!ms.length) return bot.sendMessage(msg.chat.id, "לא נמצא");
bot.sendMessage(msg.chat.id,
"RESULTS " + match[1] + ":\n" +
ms.map(m => (isAlert(m)?"RED ":"GREEN ") + m.name + " - " + m.stock + " | ~" + dL(m) + "d | " + fmtTime(m.lastUpdate)).join("\n")
);
});

// =================== /set ===================
bot.onText(//set (.+) (\d+)/, (msg, match) => {
const q = match[1].toLowerCase();
const ms = inv.models.filter(m => m.name.toLowerCase().includes(q) || (m.sku && m.sku.toLowerCase().includes(q)));
if (!ms.length) return bot.sendMessage(msg.chat.id, "לא נמצא");
if (ms.length > 1) return bot.sendMessage(msg.chat.id, "נמצאו " + ms.length + " - היה ספציפי:\n" + ms.map((m,i)=>(i+1)+". "+m.name).join("\n"));
const m = ms[0], old = m.stock;
m.stock = parseInt(match[2]);
m.lastUpdate = new Date().toISOString();
persist(inv);
bot.sendMessage(msg.chat.id, "OK " + m.name + "\n" + old + " -> " + m.stock + " | " + fmtTime(m.lastUpdate));
});

// =================== /alert ===================
bot.onText(//alert/, msg => {
const cr = inv.models.filter(isAlert);
const wa = inv.models.filter(isWarn);
if (!cr.length && !wa.length) return bot.sendMessage(msg.chat.id, "ALL OK");
bot.sendMessage(msg.chat.id,
"ALERTS:\n" +
cr.map(m => "RED " + m.name + " - " + dL(m) + "d | " + fmtTime(m.lastUpdate)).join("\n") +
(wa.length ? "\nWARN:\n" + wa.map(m => "YELLOW " + m.name + " - " + dL(m) + "d").join("\n") : "")
);
});

// =================== /report ===================
bot.onText(//report/, msg => {
const chatId = msg.chat.id;
S[chatId] = { mode: "report", step: 0, date: todayStr(), entries: [] };
bot.sendMessage(chatId, "REPORT " + new Date().toLocaleDateString("he-IL") + "\nכמה נשלחו?");
askReport(chatId);
});

function askReport(chatId) {
const s = S[chatId];
if (!s || s.step >= inv.models.length) return finishReport(chatId);
const m = inv.models[s.step];
bot.sendMessage(chatId, "[" + (s.step+1) + "/" + inv.models.length + "] " + m.name + "\nמלאי: " + m.stock + " | " + fmtTime(m.lastUpdate) + "\nכמה נשלחו? (0 אם לא)");
}

function finishReport(chatId) {
const s = S[chatId]; if (!s) return;
inv.history = inv.history || [];
inv.history.push({ date: s.date, time: new Date().toISOString(), entries: s.entries });
if (inv.history.length > 365) inv.history.shift();
persist(inv);
let sum = "DONE " + s.date + " " + fmtTime(new Date().toISOString()) + "\n";
s.entries.filter(e=>e.sent>0).forEach(e => { sum += e.name + ": " + e.sent + "\n"; });
const alerts = inv.models.filter(isAlert);
if (alerts.length) sum += "\nALERTS:\n" + alerts.map(m=>"RED "+m.name+" - "+dL(m)+"d").join("\n");
bot.sendMessage(chatId, sum);
delete S[chatId];
}

// =================== /edit ===================
bot.onText(//edit/, msg => {
S[msg.chat.id] = { mode: "edit_search" };
bot.sendMessage(msg.chat.id, "EDIT - שלח שם דגם לחיפוש:\n(או /set שם כמות לעדכון מהיר)");
});

// =================== /add ===================
bot.onText(//add (.+) (\d+)/, (msg, match) => {
const name = match[1].trim(), min = parseInt(match[2]);
inv.models.push({ id: Date.now(), name, sku: "", category: "אחר", stock: min, minStock: min, dailyAvg: 2, lastUpdate: new Date().toISOString() });
persist(inv);
bot.sendMessage(msg.chat.id, "ADDED " + name);
});

// =================== /del ===================
bot.onText(//del (.+)/, (msg, match) => {
const m = inv.models.find(m => m.name.toLowerCase().includes(match[1].toLowerCase()));
if (!m) return bot.sendMessage(msg.chat.id, "לא נמצא");
S[msg.chat.id] = { mode: "confirm_del", modelId: m.id };
bot.sendMessage(msg.chat.id, "DELETE " + m.name + "? שלח כן:");
});

// =================== /history ===================
bot.onText(//history/, msg => {
const hist = (inv.history||[]).slice(-7);
if (!hist.length) return bot.sendMessage(msg.chat.id, "אין היסטוריה");
bot.sendMessage(msg.chat.id, "HISTORY:\n" +
[...hist].reverse().map(d => d.date + " " + fmtTime(d.time) + " - " + d.entries.reduce((s,e)=>s+e.sent,0) + " yach").join("\n")
);
});

// =================== Analytics ===================
function calcTop(days, label, chatId) {
const cutoff = new Date(Date.now() - days * 86400000);
const hist = (inv.history||[]).filter(d => new Date(d.time||d.date) >= cutoff);
if (!hist.length) return bot.sendMessage(chatId, "אין נתונים ל-" + label);
const totals = {};
hist.forEach(d => d.entries.forEach(e => { if (e.sent>0) totals[e.name]=(totals[e.name]||0)+e.sent; }));
const sorted = Object.entries(totals).sort((a,b)=>b[1]-a[1]);
if (!sorted.length) return bot.sendMessage(chatId, "אין מכירות");
const total = sorted.reduce((s,[,v])=>s+v,0);
let text = "TOP " + label + "\n" + total + " yach b-" + hist.length + " days\n\n";
sorted.slice(0,15).forEach(([n,q],i) => { text += (i+1)+". "+n+": "+q+" ("+Math.round(q/total*100)+"%)\n"; });
bot.sendMessage(chatId, text);
}

bot.onText(//top7/, msg => calcTop(7, "7 ימים", msg.chat.id));
bot.onText(//top30/, msg => calcTop(30, "30 יום", msg.chat.id));
bot.onText(//top90/, msg => calcTop(90, "רבעון", msg.chat.id));
bot.onText(//topall/, msg => calcTop(36500,"כל הזמן",msg.chat.id));

bot.onText(//weekly/, msg => {
const now = Date.now();
let text = "WEEKLY\n\n";
for (let w=0;w<4;w++) {
const from = new Date(now-(w+1)786400000);
const to = new Date(now-w786400000);
const days = (inv.history||[]).filter(d=>{const dt=new Date(d.time||d.date);return dt>=from&&dt<to;});
const total = days.reduce((s,d)=>s+d.entries.reduce((ss,e)=>ss+e.sent,0),0);
text += (w===0?"THIS WEEK":w===1?"LAST WEEK":w+" weeks ago")+" ("+from.toLocaleDateString("he-IL",{day:"numeric",month:"numeric"})+")\n";
text += " "+total+" yach | "+days.length+" days\n\n";
}
bot.sendMessage(msg.chat.id, text);
});

bot.onText(//monthly/, msg => {
const now = new Date();
let text = "MONTHLY\n\n";
for (let mo=0;mo<3;mo++) {
const d = new Date(now.getFullYear(),now.getMonth()-mo,1);
const days = (inv.history||[]).filter(day=>{const dt=new Date(day.time||day.date);return dt.getMonth()===d.getMonth()&&dt.getFullYear()===d.getFullYear();});
const total= days.reduce((s,dd)=>s+dd.entries.reduce((ss,e)=>ss+e.sent,0),0);
const top = {};
days.forEach(dd=>dd.entries.forEach(e=>{if(e.sent>0)top[e.name]=(top[e.name]||0)+e.sent;}));
const top3 = Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n,q])=>n+":"+q).join(", ");
text += d.toLocaleDateString("he-IL",{month:"long",year:"numeric"})+"\n";
text += " "+total+" | "+days.length+" days"+(top3?" | "+top3:"")+"\n\n";
}
bot.sendMessage(msg.chat.id, text);
});

bot.onText(//insight/, msg => {
const ms = {};
(inv.history||[]).forEach(day=>day.entries.forEach(e=>{if(!ms[e.name])ms[e.name]=0;ms[e.name]+=e.sent;}));
const sorted = Object.entries(ms).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
if (!sorted.length) return bot.sendMessage(msg.chat.id, "אין מספיק נתונים");
const total = sorted.reduce((s,[,v])=>s+v,0);
const top20 = sorted.slice(0,Math.ceil(sorted.length0.2));
const top20t= top20.reduce((s,[,v])=>s+v,0);
const never = inv.models.filter(m=>!ms[m.name]);
let text = "INSIGHT\n\nTotal: "+total+"\n";
text += "TOP "+top20.length+": "+Math.round(top20t/total100)+"% of sales\n\n";
text += "STARS:\n"+sorted.slice(0,5).map(([n,q],i)=>(i+1)+". "+n+": "+q).join("\n");
text += "\n\nSLOW:\n"+[...sorted].reverse().slice(0,5).map(([n,q])=>n+": "+q).join("\n");
if (never.length) text += "\n\nNEVER SOLD: "+never.length+" items";
bot.sendMessage(msg.chat.id, text);
});

// =================== /settime ===================
bot.onText(//settime (\d{1,2}):(\d{2})/, (msg, match) => {
const h=parseInt(match[1]),min=parseInt(match[2]);
if(h>23||min>59) return bot.sendMessage(msg.chat.id,"INVALID TIME");
inv.schedule={hour:h,minute:min};persist(inv);
bot.sendMessage(msg.chat.id,"TIME SET "+String(h).padStart(2,"0")+":"+String(min).padStart(2,"0"));
});

// =================== Message handler ===================
bot.on("message", msg => {
const chatId = msg.chat.id, s = S[chatId];
if (!s || msg.text?.startsWith("/")) return;

if (s.mode === "report") {
const n = parseInt(msg.text);
if (isNaN(n)||n<0) return bot.sendMessage(chatId,"מספר בלבד");
const m = inv.models[s.step];
s.entries.push({modelId:m.id,name:m.name,sent:n});
m.stock = Math.max(0,m.stock-n);
m.dailyAvg = Math.max(1,Math.round(((m.dailyAvg||0)*6+n)/7));
m.lastUpdate = new Date().toISOString();
s.step++;
s.step<inv.models.length ? askReport(chatId) : finishReport(chatId);
return;
}

if (s.mode === "edit_search") {
const ms = inv.models.filter(m=>m.name.toLowerCase().includes(msg.text.toLowerCase()));
if (!ms.length) { bot.sendMessage(chatId,"לא נמצא"); return; }
if (ms.length>1) {
S[chatId]={mode:"edit_pick",results:ms.slice(0,10)};
bot.sendMessage(chatId,"נמצאו "+ms.length+":\n"+ms.slice(0,10).map((m,i)=>(i+1)+". "+m.name).join("\n"));
return;
}
showEdit(chatId,ms[0]); return;
}

if (s.mode === "edit_pick") {
const i=parseInt(msg.text)-1;
if(isNaN(i)||i<0||i>=s.results.length) return bot.sendMessage(chatId,"מספר לא תקין");
showEdit(chatId,s.results[i]); return;
}

if (s.mode === "edit_field") {
const f=parseInt(msg.text);
if(![1,2,3,4].includes(f)) return bot.sendMessage(chatId,"שלח 1-4");
S[chatId]={...s,mode:"edit_value",field:f};
bot.sendMessage(chatId,"ערך חדש:"); return;
}

if (s.mode === "edit_value") {
const m=inv.models.find(m=>m.id===s.modelId);
if(!m){delete S[chatId];return;}
if(s.field===4){m.name=msg.text.trim();}
else{
const v=parseInt(msg.text);
if(isNaN(v)||v<0) return bot.sendMessage(chatId,"מספר לא תקין");
if(s.field===1){m.stock=v;m.lastUpdate=new Date().toISOString();}
if(s.field===2) m.minStock=v;
if(s.field===3) m.dailyAvg=Math.max(1,v);
}
persist(inv);
bot.sendMessage(chatId,"UPDATED "+m.name);
delete S[chatId]; return;
}

if (s.mode === "confirm_del") {
if(msg.text?.trim()==="כן"){
const m=inv.models.find(m=>m.id===s.modelId);
inv.models=inv.models.filter(m=>m.id!==s.modelId);
persist(inv);
bot.sendMessage(chatId,"DELETED "+(m?.name||""));
} else bot.sendMessage(chatId,"CANCELLED");
delete S[chatId];
}
});

function showEdit(chatId,m) {
S[chatId]={mode:"edit_field",modelId:m.id};
bot.sendMessage(chatId,
"EDIT "+m.name+"\nStock:"+m.stock+" Min:"+m.minStock+" Avg:"+m.dailyAvg+"\nLast:"+fmtTime(m.lastUpdate)+"\n\n1. מלאי\n2. מינימום\n3. ממוצע יומי\n4. שם\n\nשלח מספר:"
);
}

// =================== Daily reminder ===================
setInterval(()=>{
const sc=inv.schedule||{hour:18,minute:0};
const now=new Date();
if(now.getHours()!==sc.hour||now.getMinutes()!==sc.minute) return;
bot.sendMessage(ADMIN_CHAT_ID,"TIME TO UPDATE\n/report");
const alerts=inv.models.filter(isAlert);
if(alerts.length){
setTimeout(()=>bot.sendMessage(ADMIN_CHAT_ID,"CRITICAL:\n"+alerts.map(m=>"RED "+m.name+" - "+dL(m)+"d").join("\n")),2000);
}
if(now.getDay()===0){
const cutoff=new Date(Date.now()-7*86400000);
const hist=(inv.history||[]).filter(d=>new Date(d.time||d.date)>=cutoff);
const total=hist.reduce((s,d)=>s+d.entries.reduce((ss,e)=>ss+e.sent,0),0);
const top={};
hist.forEach(d=>d.entries.forEach(e=>{if(e.sent>0)top[e.name]=(top[e.name]||0)+e.sent;}));
const top5=Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,5);
setTimeout(()=>bot.sendMessage(ADMIN_CHAT_ID,"WEEKLY REPORT\nTotal:"+total+"\n"+top5.map(([n,q],i)=>(i+1)+". "+n+": "+q).join("\n")),4000);
}
},60000);

console.log("HavivNartikimBot READY - 245 models loaded");
