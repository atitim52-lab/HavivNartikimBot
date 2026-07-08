// ═══════════════════════════════════════════════════
//  HavivNartikimBot — גרסה סופית
//  בוט טלגרם + API לאתר — הכל מסונכרן
// ═══════════════════════════════════════════════════

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const http = require("http");

// אפשרות א: הגדר ב-Railway → Variables → BOT_TOKEN ו-CHAT_ID (מומלץ!)
// אפשרות ב: החלף כאן ישירות את YOUR_BOT_TOKEN ו-YOUR_CHAT_ID
const TOKEN = process.env.BOT_TOKEN || "YOUR_BOT_TOKEN";
const ADMIN_CHAT_ID = process.env.CHAT_ID || "YOUR_CHAT_ID";

if (TOKEN === "YOUR_BOT_TOKEN") {
  console.error("שגיאה: חסר טוקן! הגדר BOT_TOKEN ב-Railway Variables או ערוך את הקובץ");
  process.exit(1);
}
const APP_PASSWORD = "havivvip";
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
const fmtTime = ts => ts ? new Date(ts).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }) : "-";

// רישום שילוח: מחסיר מהמלאי + שומר בהיסטוריה
function recordShipment(m, sent) {
  const old = m.stock;
  m.stock = Math.max(0, m.stock - sent);
  m.dailyAvg = Math.max(1, Math.round(((m.dailyAvg || 0) * 6 + sent) / 7));
  m.lastUpdate = new Date().toISOString();
  const today = todayStr();
  inv.history = inv.history || [];
  let day = inv.history.find(d => d.date === today);
  if (!day) { day = { date: today, time: m.lastUpdate, entries: [] }; inv.history.push(day); }
  day.time = m.lastUpdate;
  const e = day.entries.find(x => x.modelId === m.id);
  if (e) e.sent += sent; else day.entries.push({ modelId: m.id, name: m.name, sent: sent });
  if (inv.history.length > 365) inv.history.shift();
  persist(inv);
  return old;
}

// חיפוש דגם לפי שם/SKU
function findModels(q) {
  q = q.toLowerCase().trim();
  return inv.models.filter(m =>
    m.name.toLowerCase().includes(q) || (m.sku && m.sku.toLowerCase().includes(q))
  );
}

// ═══════ פקודות — כולן תומכות ב-@BotName בקבוצות ═══════

bot.onText(/^\/start(?:@\S+)?/, msg => {
  bot.sendMessage(msg.chat.id,
    "🕶 HavivNartikimBot — " + inv.models.length + " דגמים\n\n" +
    "📦 /stock — מלאי\n📋 /cat — קטגוריות\n🔍 /find שם — חיפוש\n" +
    "⚡ /quick שם כמות — דיווח שילוח מהיר\n📝 /report — ספירה מלאה\n" +
    "🛠 /set שם כמות — קביעת מלאי\n✏️ /edit — עריכה\n" +
    "➕ /add שם מינימום — הוסף דגם\n🗑 /del שם — מחק\n" +
    "⚠️ /alert — התראות\n🏆 /top7 /top30 /top90 — מכירות\n" +
    "📅 /weekly — שבועי\n📆 /monthly — חודשי\n💡 /insight — תובנות\n" +
    "📖 /history — 7 ימים\n🕐 /settime HH:MM — שעת תזכורת"
  );
});

// ⚡ /quick — דיווח שילוח מהיר (מחסיר מהמלאי!)
bot.onText(/^\/quick(?:@\S+)?\s+(.+?)\s+(\d+)\s*$/, (msg, match) => {
  const chatId = msg.chat.id;
  const sent = parseInt(match[2]);
  const ms = findModels(match[1]);
  if (!ms.length) return bot.sendMessage(chatId, "❌ לא נמצא \"" + match[1] + "\" — נסה /find " + match[1]);
  if (ms.length > 1) {
    let t = "נמצאו " + ms.length + " — היה ספציפי יותר:\n";
    ms.slice(0, 8).forEach(m => { t += "• " + m.name + " (" + m.stock + ")\n"; });
    return bot.sendMessage(chatId, t);
  }
  const m = ms[0];
  const old = recordShipment(m, sent);
  const ic = isAlert(m) ? "🔴" : isWarn(m) ? "🟡" : "🟢";
  let t = "✅ " + m.name + "\nנשלחו: " + sent + " | מלאי: " + old + " ← " + m.stock + "\n" + ic + " ~" + dL(m) + " ימים נותרו";
  if (isAlert(m)) t += "\n⚠️ להזמין מסין עכשיו!";
  bot.sendMessage(chatId, t);
});

// /quick בלי פרמטרים — הסבר
bot.onText(/^\/quick(?:@\S+)?\s*$/, msg => {
  bot.sendMessage(msg.chat.id,
    "⚡ דיווח מהיר — מחסיר מהמלאי ונשמר בהיסטוריה\n\n" +
    "כתוב: /quick שם_דגם כמות\n\n" +
    "דוגמאות:\n/quick 8121 שחור 15\n/quick 7582 כחול 30\n/quick 2044 זהב 8"
  );
});

// /stock
bot.onText(/^\/stock(?:@\S+)?/, msg => {
  if (!inv.models.length) return bot.sendMessage(msg.chat.id, "אין דגמים");
  const lines = inv.models.slice(0, 50).map(m => {
    const ic = isAlert(m) ? "🔴" : isWarn(m) ? "🟡" : "🟢";
    return ic + " " + m.name + " | " + m.stock + " | ~" + dL(m) + " ימים | " + fmtTime(m.lastUpdate);
  }).join("\n");
  const extra = inv.models.length > 50 ? "\n...ועוד " + (inv.models.length - 50) + " — השתמש /find" : "";
  bot.sendMessage(msg.chat.id, "📦 מלאי:\n\n" + lines + extra);
});

// /cat
bot.onText(/^\/cat(?:@\S+)?\s*$/, msg => {
  const cats = [...new Set(inv.models.map(m => m.category).filter(Boolean))];
  bot.sendMessage(msg.chat.id, "📋 קטגוריות:\n" + cats.map((c, i) => (i + 1) + ". " + c).join("\n") + "\n\nלפירוט: /cat שם");
});
bot.onText(/^\/cat(?:@\S+)?\s+(.+)/, (msg, match) => {
  const ms = inv.models.filter(m => m.category && m.category.includes(match[1].trim()));
  if (!ms.length) return bot.sendMessage(msg.chat.id, "לא נמצא");
  bot.sendMessage(msg.chat.id, match[1] + " (" + ms.length + "):\n" +
    ms.map(m => (isAlert(m) ? "🔴 " : "🟢 ") + m.name + " — " + m.stock).join("\n"));
});

// /find
bot.onText(/^\/find(?:@\S+)?\s+(.+)/, (msg, match) => {
  const ms = findModels(match[1]);
  if (!ms.length) return bot.sendMessage(msg.chat.id, "לא נמצא");
  bot.sendMessage(msg.chat.id, "🔍 " + match[1] + ":\n" +
    ms.slice(0, 30).map(m => (isAlert(m) ? "🔴 " : "🟢 ") + m.name + " — " + m.stock + " | ~" + dL(m) + " ימים | " + fmtTime(m.lastUpdate)).join("\n"));
});

// /set — קובע מלאי חדש (לא מחסיר)
bot.onText(/^\/set(?:@\S+)?\s+(.+?)\s+(\d+)\s*$/, (msg, match) => {
  const ms = findModels(match[1]);
  if (!ms.length) return bot.sendMessage(msg.chat.id, "לא נמצא");
  if (ms.length > 1) return bot.sendMessage(msg.chat.id, "נמצאו " + ms.length + " — היה ספציפי:\n" + ms.slice(0, 8).map((m, i) => (i + 1) + ". " + m.name).join("\n"));
  const m = ms[0], old = m.stock;
  m.stock = parseInt(match[2]);
  m.lastUpdate = new Date().toISOString();
  persist(inv);
  bot.sendMessage(msg.chat.id, "✅ " + m.name + "\n" + old + " ← " + m.stock + " | " + fmtTime(m.lastUpdate));
});

// /alert
bot.onText(/^\/alert(?:@\S+)?/, msg => {
  const cr = inv.models.filter(isAlert);
  const wa = inv.models.filter(isWarn);
  if (!cr.length && !wa.length) return bot.sendMessage(msg.chat.id, "✅ הכל תקין!");
  let t = "⚠️ התראות:\n";
  cr.forEach(m => { t += "🔴 " + m.name + " — " + m.stock + " יח | ~" + dL(m) + " ימים\n"; });
  if (wa.length) { t += "\nשקול הזמנה:\n"; wa.forEach(m => { t += "🟡 " + m.name + " — " + dL(m) + " ימים\n"; }); }
  bot.sendMessage(msg.chat.id, t);
});

// /report — ספירה מלאה
bot.onText(/^\/report(?:@\S+)?/, msg => {
  const chatId = msg.chat.id;
  S[chatId] = { mode: "report", step: 0, date: todayStr(), entries: [] };
  bot.sendMessage(chatId, "📝 ספירת סוף יום " + new Date().toLocaleDateString("he-IL") + "\nכמה נשלחו? (0 אם לא, /cancel לביטול)");
  askReport(chatId);
});

// /cancel — ביטול ספירה
bot.onText(/^\/cancel(?:@\S+)?/, msg => {
  if (S[msg.chat.id]) { delete S[msg.chat.id]; bot.sendMessage(msg.chat.id, "↩️ בוטל."); }
});

function askReport(chatId) {
  const s = S[chatId];
  if (!s || s.step >= inv.models.length) return finishReport(chatId);
  const m = inv.models[s.step];
  bot.sendMessage(chatId, "[" + (s.step + 1) + "/" + inv.models.length + "] " + m.name + "\nמלאי: " + m.stock + "\nכמה נשלחו?");
}

function finishReport(chatId) {
  const s = S[chatId]; if (!s) return;
  inv.history = inv.history || [];
  inv.history.push({ date: s.date, time: new Date().toISOString(), entries: s.entries });
  if (inv.history.length > 365) inv.history.shift();
  persist(inv);
  let t = "✅ דוח " + s.date + " נשמר!\n";
  s.entries.filter(e => e.sent > 0).forEach(e => { t += e.name + ": " + e.sent + "\n"; });
  const al = inv.models.filter(isAlert);
  if (al.length) t += "\n⚠️ התראות:\n" + al.map(m => "🔴 " + m.name + " — " + dL(m) + " ימים").join("\n");
  bot.sendMessage(chatId, t);
  delete S[chatId];
}

// /edit
bot.onText(/^\/edit(?:@\S+)?/, msg => {
  S[msg.chat.id] = { mode: "edit_search" };
  bot.sendMessage(msg.chat.id, "✏️ שלח שם דגם לעריכה (/cancel לביטול):");
});

// /add
bot.onText(/^\/add(?:@\S+)?\s+(.+?)\s+(\d+)\s*$/, (msg, match) => {
  inv.models.push({ id: Date.now(), name: match[1].trim(), sku: "", category: "אחר", stock: parseInt(match[2]), minStock: parseInt(match[2]), dailyAvg: 2, lastUpdate: new Date().toISOString() });
  persist(inv);
  bot.sendMessage(msg.chat.id, "✅ " + match[1].trim() + " נוסף!");
});

// /del
bot.onText(/^\/del(?:@\S+)?\s+(.+)/, (msg, match) => {
  const ms = findModels(match[1]);
  if (!ms.length) return bot.sendMessage(msg.chat.id, "לא נמצא");
  if (ms.length > 1) return bot.sendMessage(msg.chat.id, "נמצאו " + ms.length + " — היה ספציפי:\n" + ms.slice(0, 8).map(m => "• " + m.name).join("\n"));
  S[msg.chat.id] = { mode: "confirm_del", modelId: ms[0].id };
  bot.sendMessage(msg.chat.id, "🗑 למחוק " + ms[0].name + "? שלח כן:");
});

// /history
bot.onText(/^\/history(?:@\S+)?/, msg => {
  const h = (inv.history || []).slice(-7);
  if (!h.length) return bot.sendMessage(msg.chat.id, "אין היסטוריה");
  bot.sendMessage(msg.chat.id, "📖 7 ימים:\n" +
    [...h].reverse().map(d => d.date + " " + fmtTime(d.time) + " — " + d.entries.reduce((s, e) => s + e.sent, 0) + " יח").join("\n"));
});

// אנליטיקה
function calcTop(days, label, chatId) {
  const cutoff = new Date(Date.now() - days * 86400000);
  const hist = (inv.history || []).filter(d => new Date(d.time || d.date) >= cutoff);
  if (!hist.length) return bot.sendMessage(chatId, "אין נתונים ל" + label);
  const totals = {};
  hist.forEach(d => d.entries.forEach(e => { if (e.sent > 0) totals[e.name] = (totals[e.name] || 0) + e.sent; }));
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return bot.sendMessage(chatId, "אין מכירות בתקופה");
  const total = sorted.reduce((s, x) => s + x[1], 0);
  let t = "🏆 Top " + label + " — " + total + " יח ב-" + hist.length + " ימים\n\n";
  sorted.slice(0, 15).forEach((x, i) => { t += (i + 1) + ". " + x[0] + ": " + x[1] + " (" + Math.round(x[1] / total * 100) + "%)\n"; });
  bot.sendMessage(chatId, t);
}
bot.onText(/^\/top7(?:@\S+)?/, msg => calcTop(7, "7 ימים", msg.chat.id));
bot.onText(/^\/top30(?:@\S+)?/, msg => calcTop(30, "30 יום", msg.chat.id));
bot.onText(/^\/top90(?:@\S+)?/, msg => calcTop(90, "רבעון", msg.chat.id));

bot.onText(/^\/weekly(?:@\S+)?/, msg => {
  let t = "📅 שבועי:\n\n";
  for (let w = 0; w < 4; w++) {
    const from = new Date(Date.now() - (w + 1) * 7 * 86400000);
    const to = new Date(Date.now() - w * 7 * 86400000);
    const days = (inv.history || []).filter(d => { const dt = new Date(d.time || d.date); return dt >= from && dt < to; });
    const total = days.reduce((s, d) => s + d.entries.reduce((ss, e) => ss + e.sent, 0), 0);
    t += (w === 0 ? "השבוע" : w === 1 ? "שבוע שעבר" : w + " שבועות לפני") + " (" + from.toLocaleDateString("he-IL", { day: "numeric", month: "numeric" }) + "): " + total + " יח\n";
  }
  bot.sendMessage(msg.chat.id, t);
});

bot.onText(/^\/monthly(?:@\S+)?/, msg => {
  const now = new Date();
  let t = "📆 חודשי:\n\n";
  for (let mo = 0; mo < 3; mo++) {
    const d = new Date(now.getFullYear(), now.getMonth() - mo, 1);
    const days = (inv.history || []).filter(day => { const dt = new Date(day.time || day.date); return dt.getMonth() === d.getMonth() && dt.getFullYear() === d.getFullYear(); });
    const total = days.reduce((s, dd) => s + dd.entries.reduce((ss, e) => ss + e.sent, 0), 0);
    t += d.toLocaleDateString("he-IL", { month: "long", year: "numeric" }) + ": " + total + " יח (" + days.length + " ימים)\n";
  }
  bot.sendMessage(msg.chat.id, t);
});

bot.onText(/^\/insight(?:@\S+)?/, msg => {
  const ms = {};
  (inv.history || []).forEach(day => day.entries.forEach(e => { ms[e.name] = (ms[e.name] || 0) + e.sent; }));
  const sorted = Object.entries(ms).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return bot.sendMessage(msg.chat.id, "אין מספיק נתונים");
  const total = sorted.reduce((s, x) => s + x[1], 0);
  const topN = Math.max(1, Math.ceil(sorted.length * 0.2));
  const topT = sorted.slice(0, topN).reduce((s, x) => s + x[1], 0);
  const never = inv.models.filter(m => !ms[m.name]);
  let t = "💡 תובנות:\n\nסהכ נשלחו: " + total + " יח\n";
  t += "⚡ " + topN + " דגמים = " + Math.round(topT / total * 100) + "% מהמכירות\n\n";
  t += "⭐ כוכבים:\n" + sorted.slice(0, 5).map((x, i) => (i + 1) + ". " + x[0] + ": " + x[1]).join("\n");
  t += "\n\n🐢 איטיים:\n" + [...sorted].reverse().slice(0, 5).map(x => x[0] + ": " + x[1]).join("\n");
  if (never.length) t += "\n\n⬛ לא נמכרו: " + never.length + " דגמים";
  bot.sendMessage(msg.chat.id, t);
});

// /settime
bot.onText(/^\/settime(?:@\S+)?\s+(\d{1,2}):(\d{2})/, (msg, match) => {
  const h = parseInt(match[1]), min = parseInt(match[2]);
  if (h > 23 || min > 59) return bot.sendMessage(msg.chat.id, "שעה לא תקינה");
  inv.schedule = { hour: h, minute: min };
  persist(inv);
  bot.sendMessage(msg.chat.id, "🕐 שעת עדכון: " + String(h).padStart(2, "0") + ":" + String(min).padStart(2, "0"));
});

// ═══════ טיפול בשיחות (report/edit/del) ═══════
bot.on("message", msg => {
  const chatId = msg.chat.id, s = S[chatId];
  if (!s || !msg.text || msg.text.startsWith("/")) return;

  if (s.mode === "report") {
    const n = parseInt(msg.text);
    if (isNaN(n) || n < 0) return bot.sendMessage(chatId, "מספר בלבד (או /cancel)");
    const m = inv.models[s.step];
    s.entries.push({ modelId: m.id, name: m.name, sent: n });
    if (n > 0) {
      m.stock = Math.max(0, m.stock - n);
      m.dailyAvg = Math.max(1, Math.round(((m.dailyAvg || 0) * 6 + n) / 7));
      m.lastUpdate = new Date().toISOString();
    }
    s.step++;
    s.step < inv.models.length ? askReport(chatId) : finishReport(chatId);
    return;
  }

  if (s.mode === "edit_search") {
    const ms = findModels(msg.text);
    if (!ms.length) return bot.sendMessage(chatId, "לא נמצא — נסה שוב (או /cancel)");
    if (ms.length > 1) {
      S[chatId] = { mode: "edit_pick", results: ms.slice(0, 10) };
      return bot.sendMessage(chatId, "בחר מספר:\n" + ms.slice(0, 10).map((m, i) => (i + 1) + ". " + m.name).join("\n"));
    }
    showEdit(chatId, ms[0]);
    return;
  }

  if (s.mode === "edit_pick") {
    const i = parseInt(msg.text) - 1;
    if (isNaN(i) || i < 0 || i >= s.results.length) return bot.sendMessage(chatId, "מספר לא תקין");
    showEdit(chatId, s.results[i]);
    return;
  }

  if (s.mode === "edit_field") {
    const f = parseInt(msg.text);
    if (![1, 2, 3, 4].includes(f)) return bot.sendMessage(chatId, "שלח 1-4");
    S[chatId] = { mode: "edit_value", modelId: s.modelId, field: f };
    bot.sendMessage(chatId, "ערך חדש:");
    return;
  }

  if (s.mode === "edit_value") {
    const m = inv.models.find(x => x.id === s.modelId);
    if (!m) { delete S[chatId]; return; }
    if (s.field === 4) { m.name = msg.text.trim(); }
    else {
      const v = parseInt(msg.text);
      if (isNaN(v) || v < 0) return bot.sendMessage(chatId, "מספר לא תקין");
      if (s.field === 1) { m.stock = v; m.lastUpdate = new Date().toISOString(); }
      if (s.field === 2) m.minStock = v;
      if (s.field === 3) m.dailyAvg = Math.max(1, v);
    }
    persist(inv);
    bot.sendMessage(chatId, "✅ " + m.name + " עודכן!");
    delete S[chatId];
    return;
  }

  if (s.mode === "confirm_del") {
    if (msg.text.trim() === "כן") {
      const m = inv.models.find(x => x.id === s.modelId);
      inv.models = inv.models.filter(x => x.id !== s.modelId);
      persist(inv);
      bot.sendMessage(chatId, "🗑 " + (m ? m.name : "") + " נמחק.");
    } else bot.sendMessage(chatId, "↩️ ביטול.");
    delete S[chatId];
  }
});

function showEdit(chatId, m) {
  S[chatId] = { mode: "edit_field", modelId: m.id };
  bot.sendMessage(chatId, "✏️ " + m.name + "\nמלאי: " + m.stock + " | מינ: " + m.minStock + " | יומי: " + m.dailyAvg + "\n\n1. מלאי\n2. מינימום\n3. ממוצע יומי\n4. שם\n\nשלח מספר:");
}

// ═══════ תזכורת יומית ═══════
setInterval(() => {
  const sc = inv.schedule || { hour: 18, minute: 0 };
  const now = new Date();
  if (now.getHours() !== sc.hour || now.getMinutes() !== sc.minute) return;
  bot.sendMessage(ADMIN_CHAT_ID, "⏰ שעת עדכון מלאי!\nדווח שילוחים: /quick שם כמות\nאו ספירה מלאה: /report").catch(() => {});
  const al = inv.models.filter(isAlert);
  if (al.length) {
    setTimeout(() => {
      bot.sendMessage(ADMIN_CHAT_ID, "🚨 קריטי להזמנה:\n" + al.slice(0, 20).map(m => "🔴 " + m.name + " — " + m.stock + " יח").join("\n")).catch(() => {});
    }, 2000);
  }
  if (now.getDay() === 0) {
    const cutoff = new Date(Date.now() - 7 * 86400000);
    const hist = (inv.history || []).filter(d => new Date(d.time || d.date) >= cutoff);
    const total = hist.reduce((s, d) => s + d.entries.reduce((ss, e) => ss + e.sent, 0), 0);
    const top = {};
    hist.forEach(d => d.entries.forEach(e => { if (e.sent > 0) top[e.name] = (top[e.name] || 0) + e.sent; }));
    const top5 = Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 5);
    setTimeout(() => {
      bot.sendMessage(ADMIN_CHAT_ID, "📊 דוח שבועי\nסהכ: " + total + " יח\n" + top5.map((x, i) => (i + 1) + ". " + x[0] + ": " + x[1]).join("\n")).catch(() => {});
    }, 4000);
  }
}, 60000);

// ═══════ HTTP API לאתר ═══════
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method === "OPTIONS") { res.writeHead(200); res.end(); return; }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200);
    res.end(JSON.stringify({ status: "ok", models: inv.models.length }));
    return;
  }

  if (req.method === "GET" && req.url === "/inventory") {
    res.writeHead(200);
    res.end(JSON.stringify({ models: inv.models, updated: new Date().toISOString() }));
    return;
  }

  if (req.method === "POST") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 5e6) req.destroy(); });
    req.on("end", () => {
      let data;
      try { data = JSON.parse(body); } catch (e) { res.writeHead(400); res.end(JSON.stringify({ error: "bad json" })); return; }
      if (data.password !== APP_PASSWORD) { res.writeHead(403); res.end(JSON.stringify({ error: "סיסמה שגויה" })); return; }

      if (req.url === "/update") {
        const m = inv.models.find(x => x.id === data.id);
        if (!m) { res.writeHead(404); res.end(JSON.stringify({ error: "לא נמצא" })); return; }
        if (data.stock !== undefined) { m.stock = parseInt(data.stock); m.lastUpdate = new Date().toISOString(); }
        if (data.minStock !== undefined) m.minStock = parseInt(data.minStock);
        if (data.name !== undefined) m.name = data.name;
        if (data.image !== undefined) m.image = data.image;
        if (data.notes !== undefined) m.notes = data.notes;
        persist(inv);
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
        return;
      }

      if (req.url === "/add") {
        const nm = { id: Date.now(), name: data.name || "דגם חדש", sku: data.sku || "", category: data.category || "אחר", stock: parseInt(data.stock) || 0, minStock: parseInt(data.minStock) || 500, dailyAvg: 2, image: data.image || "", lastUpdate: new Date().toISOString() };
        inv.models.push(nm);
        persist(inv);
        res.writeHead(200); res.end(JSON.stringify({ ok: true, model: nm }));
        return;
      }

      if (req.url === "/delete") {
        inv.models = inv.models.filter(x => x.id !== data.id);
        persist(inv);
        res.writeHead(200); res.end(JSON.stringify({ ok: true }));
        return;
      }

      res.writeHead(404); res.end(JSON.stringify({ error: "not found" }));
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(process.env.PORT || 3000, () => {
  console.log("API on port " + (process.env.PORT || 3000));
});

console.log("HavivNartikimBot פעיל! " + inv.models.length + " דגמים");
