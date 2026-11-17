// Shared quiz engine (adapted from skeledical). Topic-agnostic.
// Items: { id, name, aliases, region, near, fame, fact, hint }

export const MODES = { practice: "Practice", exam: "Exam", timed: "Timed" };
export const STYLES = { explore: "Explore", find: "Find it", name: "Name it" };

export function norm(s) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(the|of|a|an)\b/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
}

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export class Quiz {
  constructor(items, { statsKey = "fini-stats", timedMinutes = () => 10, allowHints = () => true } = {}) {
    this.stats = new Stats(statsKey);
    this.timedMinutes = timedMinutes;
    this.allowHints = allowHints;
    this.setItems(items);
    this.start("practice", "explore");
  }

  setItems(items) {
    this.items = items;
    this.byId = Object.fromEntries(items.map(i => [i.id, i]));
    this.keys = Object.fromEntries(items.map(i => [i.id, new Set([i.name, ...(i.aliases || [])].map(norm))]));
  }

  start(mode, style) {
    this.mode = mode;
    this.style = style;
    this.res = {};
    this.wrongClicks = {};
    this.hintsUsed = {};
    this.queue = style === "find" ? shuffle(this.items.map(i => i.id)) : [];
    this.selected = null;
    this.graded = false;
    this.started = Date.now();
    this.endsAt = mode === "timed" && style !== "explore" ? this.started + this.timedMinutes() * 60000 : 0;
    this.recorded = false;
  }

  get exam() { return this.mode !== "practice"; }
  get target() { return this.style === "find" && !this.graded ? this.queue[0] || null : null; }
  get playing() { return this.style !== "explore"; }

  pick(id) {
    if (this.style === "name") {
      if (!this.graded && id && (!this.res[id] || this.exam || this.res[id].st === "wrong")) this.selected = id;
      return { selected: id };
    }
    const t = this.target;
    if (!t || !id) return {};
    if (this.exam) {
      this.res[t] = { st: "answered", guess: id, hinted: !!this.hintsUsed[t] };
      this.queue.shift();
      return { answered: true };
    }
    if (id === t) {
      this.res[t] = { st: "right", hinted: !!this.hintsUsed[t] };
      this.stats.hit(t, "right");
      this.queue.shift();
      return { ok: true, id: t };
    }
    this.wrongClicks[t] = (this.wrongClicks[t] || 0) + 1;
    this.stats.hit(t, "wrong");
    return { ok: false, id: t, picked: id };
  }

  answerName(text) {
    const id = this.selected;
    if (!id || !text.trim()) return {};
    const ok = this.keys[id].has(norm(text));
    if (this.exam) {
      this.res[id] = { st: "answered", guess: text.trim(), hinted: !!this.hintsUsed[id] };
      this.selected = null;
      return { answered: true };
    }
    if (ok) {
      this.res[id] = { st: "right", hinted: !!this.hintsUsed[id] };
      this.stats.hit(id, "right");
      this.selected = null;
    } else {
      this.res[id] = { st: "wrong" };
      this.stats.hit(id, "wrong");
    }
    return { ok, id };
  }

  reveal() {
    const id = this.style === "find" ? this.target : this.selected;
    if (!id || this.exam) return null;
    this.res[id] = { st: "revealed" };
    this.stats.hit(id, "missed");
    if (this.style === "find") this.queue.shift(); else this.selected = null;
    return id;
  }

  skip() { if (this.target) this.queue.push(this.queue.shift()); }

  hintSteps(id) { const f = this.byId[id].fame || 3; return f <= 1 ? 1 : f === 2 ? 2 : 3; }
  hintList(id) {
    const it = this.byId[id], near = this.byId[it.near];
    if (this.style === "find") return [
      `It's in the ${ (it.region || "assembly").toLowerCase() }.`,
      near ? `It's next to the ${near.name.toLowerCase()}.` : "",
      "Look inside the circle."
    ].filter(Boolean).slice(0, this.hintSteps(id));
    const n = it.name.replace(/\s*\(.*\)$/, "");
    return [
      near ? `It sits next to the ${near.name.toLowerCase()}.` : `It's part of the ${ (it.region || "system").toLowerCase() }.`,
      `Starts with "${n[0]}", ${n.replace(/[^A-Za-z]/g, "").length} letters.`
    ].slice(0, Math.min(2, this.hintSteps(id)));
  }
  takeHint() {
    const id = this.style === "find" ? this.target : this.selected;
    if (!id || !this.allowHints()) return null;
    const used = this.hintsUsed[id] || 0;
    if (used >= this.hintList(id).length) return null;
    this.hintsUsed[id] = used + 1;
    return { id, step: used + 1, text: this.hintList(id)[used] };
  }

  grade() {
    if (!this.exam || this.graded) return;
    for (const it of this.items) {
      const r = this.res[it.id];
      const ok = r && (this.style === "find" ? r.guess === it.id : this.keys[it.id].has(norm(r.guess)));
      if (ok) { r.st = "right"; this.stats.hit(it.id, "right"); }
      else { this.res[it.id] = { ...(r || {}), st: r ? "wrong" : "blank" }; this.stats.hit(it.id, "missed"); }
    }
    this.graded = true;
    this.selected = null;
  }

  get finished() {
    if (!this.playing) return false;
    if (this.exam) return this.graded;
    return this.items.every(i => this.res[i.id] && this.res[i.id].st !== "wrong");
  }

  timeLeft() { return this.endsAt ? Math.max(0, this.endsAt - Date.now()) : null; }
  tick() { if (this.endsAt && !this.graded && this.timeLeft() === 0) { this.grade(); return true; } return false; }

  score() {
    const s = { total: this.items.length, right: 0, hinted: 0, wrong: 0, revealed: 0, answered: 0, blank: 0, misses: 0 };
    for (const it of this.items) {
      const r = this.res[it.id];
      if (!r) { if (this.graded) s.blank++; continue; }
      if (r.st === "right") { s.right++; if (r.hinted) s.hinted++; }
      else if (r.st === "wrong" || r.st === "blank") s[r.st]++;
      else s[r.st]++;
    }
    s.misses = Object.values(this.wrongClicks).reduce((a, b) => a + b, 0);
    s.points = s.right - s.hinted / 2;
    return s;
  }

  markOf(id) {
    if (this.selected === id) return "selected";
    const r = this.res[id];
    if (!r) return null;
    if (r.st === "right") return r.hinted ? "hinted" : "right";
    return r.st === "blank" ? "wrong" : r.st;
  }

  record() {
    if (this.recorded || !this.playing) return;
    this.recorded = true;
    const s = this.score();
    this.stats.game({ mode: this.mode, style: this.style, right: s.right, points: s.points, total: s.total, secs: Math.round((Date.now() - this.started) / 1000), at: Date.now() });
  }
}

export class Stats {
  constructor(key) { this.key = key; try { this.d = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { this.d = {}; } this.d.items ||= {}; this.d.games ||= []; }
  save() { try { localStorage.setItem(this.key, JSON.stringify(this.d)); } catch (e) {} }
  hit(id, kind) { const r = this.d.items[id] ||= { right: 0, wrong: 0, missed: 0 }; r[kind]++; this.save(); }
  game(g) { this.d.games.unshift(g); this.d.games.length = Math.min(this.d.games.length, 50); this.save(); }
  mostMissed(n = 10) {
    return Object.entries(this.d.items).filter(([, r]) => r.missed || r.wrong)
      .sort((a, b) => (b[1].missed - a[1].missed) || (b[1].wrong - a[1].wrong)).slice(0, n);
  }
  reset() { this.d = { items: {}, games: [] }; this.save(); }
}
