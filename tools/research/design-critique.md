# Critique of the build plan

Everything below was checked against the working tree at `C:\Users\asus\adventflorida`, not against the plan's own description of it. Contrast numbers are computed with the same WCAG 2.1 relative-luminance formula the repo's own `tools/test-contrast.js` uses.

---

## 1. Recommendations that make it worse, or are work with no value

### 1a. "mirror the literals into `tools/test-contrast.js`" — this work does not exist

The plan says it twice:

> "**0:20** — Palette: nine token edits in `css/styles.css`, **mirror the literals into `tools/test-contrast.js`**, run it."
> "Then re-run `node tools/test-contrast.js` **after updating the token literals inside that script**."

There are no token literals in that script. `tools/test-contrast.js` line 15 reads the stylesheet and `leerTokens()` regex-parses `:root` and `[data-theme="dark"]` out of it:

```js
const css = fs.readFileSync(path.join(__dirname, "..", "css", "styles.css"), "utf8");
```

The only hardcoded colour in the whole file is the `[255, 255, 255]` fallback for compositing an `rgba()` with no resolved background. A developer following step 1 spends ten minutes searching for hex values that aren't there. **Delete that clause from both places.** Step 1 is: edit the tokens, run the script.

### 1b. "Every replacement meets or beats what it replaces" is false — 22 of 30 pairs land lower

> "**Every replacement meets or beats what it replaces.**"

Running the harness's own 15 pairs against both palettes: in light, **9 pairs drop, 3 improve, 3 are unchanged**; in dark, **13 drop, 0 improve, 2 unchanged**.

| pair | light before → after | dark before → after |
|---|---|---|
| `text`/`bg` | 15.24 → **15.09** | 15.77 → **14.92** |
| `text`/`surface` | 16.04 → **15.88** | 13.86 → **13.10** |
| `text-soft`/`bg` | 5.41 → 5.63 ↑ | 8.37 → **7.38** |
| `text-soft`/`surface` | 5.69 → 5.93 ↑ | 7.35 → **6.48** |
| `accent`/`bg-alt` | 4.93 → **4.84** | 9.92 → **9.73** |
| `deep`/`bg` | 11.40 → **11.13** | 9.16 → **8.85** |
| `deep`/`deep-soft` | 10.28 → 10.28 | 8.43 → **7.92** |

Nothing fails — every pair still clears its threshold — but the sentence as written is wrong and it is the sentence that licenses skipping verification. **Rewrite it:** *"Every pair still clears AA. Most clear it by a slightly smaller margin than today; the only pairs that improve are the three `--text-soft` pairs in light mode, which is the defect being fixed. `accent`/`bg-alt` lands at 4.84:1, the thinnest margin in the palette — do not darken `--bg-alt` further without re-running the harness."*

Also correct two numbers in the dark table: white-on-fill for `--accent` is **9.47:1**, not the "ink-on-fill 9.15:1" claimed (9.15 is `accent`/`bg`, reused by mistake), and `--deep` ink-on-fill is **9.49:1**, not "9.29:1".

### 1c. The palette change warms six tokens and leaves the four coolest ones alone

The diagnosis is right and verifiable — `--text` is h=205°, `--text-soft` is h=208°. But `--deep` is **h=197°, s=67%** — the most saturated colour in the light palette — and it paints the brand mark circle (`index.html:209`, `<circle … fill="var(--deep)">`), the whole hero Bible illustration, and every `.btn` in the deep style. `--deep-soft #E6EFF2` is h=195°. `--shadow` and `--shadow-sm` are `rgba(15, 59, 76, …)` — a blue shadow under every card.

So after the change you get a 40°-warm ground and 40°-warm body copy sitting under a 197° logo, a 195° chip and a blue drop shadow. That is not "a printed letter", that is a two-temperature page, which reads worse than the consistent cool one it replaces. Either finish the job or don't start it. Concrete: add two more lines to the light block —

```css
--shadow:    0 18px 44px -26px rgba(58, 44, 26, .40);
--shadow-sm: 0 6px 20px -12px rgba(58, 44, 26, .30);
```

— and warm `--deep-soft` to `#EDEBE2` (deep on it: 9.98:1, still ≥3). Leave `--deep` itself, for the BA 40 40 reason the plan gives.

Header/table mismatch, while you're there: "**Warm six tokens and stop**" and "**Light — replace six values**" head a table with **nine** rows; "**Dark — replace six values**" heads one with **eight**. The prose says "the diff is nine lines". With my two shadow lines it's eleven light + eight dark. Say the real number.

### 1d. Moving `#misiones` to position three makes the ship-state page worse

`window.FAM_EVENTS = []`. Both grids render `emptyState()`. So the plan's reorder puts this in the third screenful of the page, directly under the claim it is meant to substantiate:

> "Nothing on the calendar yet" … "The record starts here"

The plan's own §2 argues *"'Who we are' makes a claim … The missions record is the evidence for that claim."* On the day this ships the missions record is evidence of nothing, and promoting it converts a quiet gap at position nine into a loud one at position three. It also runs straight into `wireMissions()`, which on zero-upcoming-plus-zero-past opens the **"Coming up"** tab showing the empty state — so the third thing a stranger reads is an admission.

**Rewrite:** leave `#misiones` where it is (line 788). Move it the day `FAM_EVENTS` holds three past entries with photographs. Write that trigger into the volunteer manual in `js/events.js` so it isn't forgotten. Spend the 0:20 on the near-you block instead, which is the thing that actually earns position three and is real on day one.

### 1e. The reorder as specified breaks the alternating bands it claims to preserve

> "In `index.html`, cut the `<section class="missions" id="misiones">` block and paste it after the close of `#quienes`; add `class="section-alt"` and drop it from `#ministerios` so the alternating bands still alternate."

Three things go wrong:

1. **The plan's 14-section order omits a section that exists.** Between `#quienes` (line 326) and `#cristo` (line 385) sits the video section — `index.html:366`, `<section class="section-alt">`, no id, `video.eyebrow` / `video.title`. Pasting missions "after the close of `#quienes`" and giving it `section-alt` produces **two adjacent `section-alt` bands** (missions, then video). The alternation is broken at exactly the seam the sentence claims to protect.
2. **Dropping `section-alt` from `#ministerios` (line 769) breaks a second seam:** `#estudios` (701, plain) would then be followed by `#ministerios` (plain).
3. **Nav order desyncs.** The desktop nav (`index.html:222–229`) and the drawer (268–280) both list Missions after Bible studies. Moving the section to third leaves the nav describing an order the page no longer has, and the `IntersectionObserver` scrollspy at `js/main.js:644–658` will highlight nav items out of sequence as the reader scrolls.

If the move happens later per 1d, the correct instruction is: paste **after** the video section and before `#cristo`, keep missions **plain**, leave `#ministerios` as `section-alt`, and move `<li><a href="#misiones">` to third in both nav lists.

### 1f. "Demote the two hero buttons to `btn-ghost`" is the one change in the plan that lowers contrast

`css/styles.css:142` — `.btn-ghost { border-color: var(--line-strong); color: var(--text); }`. Under the new light palette `--line-strong: rgba(34,32,28,.26)` composites to **1.71:1** against `--bg`. A ghost button's border is the only thing that identifies it as a control, so WCAG 2.1 SC 1.4.11 wants 3:1. The plan takes the two offers the site is actually built to deliver today —

```html
<a class="btn btn-primary btn-lg" href="#estudios" data-i18n="hero.cta1">Request a free Bible study</a>
<a class="btn btn-ghost btn-lg" href="#libro" data-i18n="hero.cta2">Get the book Steps to Christ</a>
```

— and demotes both to a boundary a low-vision reader cannot see, in service of a block (§4) whose data does not exist yet (`js/near.js` is unwritten and PENDIENTES §7 is open). See §2 for the fix; whatever else you do, **do not demote `hero.cta1` until the near block has verified data for at least three cities.**

### 1g. "reduces ten competing calls to action to one" — nothing in the plan removes any

> "This lifts that one moment into the first screenful, **reduces ten competing calls to action to one**"

`grep -c 'data-wa=' index.html` returns **11**, and one of them is `<a class="wa-float" …>` at line 1085 — a permanently visible floating WhatsApp button that will sit on top of the new hero block. The nine steps in "Order of work today" delete none of them and **add** three (`wa.near`, the second empty-state button, and a per-card `mis.ask`). Net 11 → 14.

**Rewrite the claim** to what the step list actually does, and add a real step if you want the claim: `0:15 — remove data-wa="general" from #contacto (line 1003) and from the drawer (282), leaving the float and the section-specific ones.` Also decide about `.wa-float` explicitly: a hero block that is "the page's one primary action" competing with a sticky green bubble is not one action.

### 1h. "patch-i18n.js will refuse a partial patch" — it does not

> "Until a human translates them, `patch-i18n.js` will refuse a partial patch — so pass the English string through for every language in the patch file"

Read `tools/patch-i18n.js` lines 121–125. The only failure mode is a language *code* in the patch that has no `window.FAM_I18N.<code>` block in `js/lang/`:

```js
const missing = Object.keys(patch).filter(c => !seen.has(c));
if (missing.length) { console.error("\nERROR: idiomas no encontrados …"); process.exit(1); }
```

A patch containing only `{"en": {...}}` applies cleanly and exits 0. The tool that catches partial coverage is `tools/test-i18n.js` (the *"no coincide con en · le falta:"* check).

Worse, the workaround the plan prescribes is actively harmful. Pass English through into all nine dictionaries and `test-i18n.js` goes green permanently — the untranslated state becomes invisible to every future run, which is the exact failure the plan says it wants to avoid ("Do not machine-translate silently"). And it is unnecessary: `t()` in `js/main.js:57–60` already falls back to `I18N[DEFAULT_LANG]`.

**Concrete rewrite.** Keep the pass-through (the key-set equality check needs it), and add eight lines to `tools/test-i18n.js` so the debt is reported forever instead of hidden:

```js
/* Claves que estan en ingles en otros idiomas: pendientes de traducir */
const sinTraducir = [];
for (const l of LANGS.slice(1)) {
  for (const k of enKeys) if (I18N[l.code][k] === I18N.en[k] && I18N.en[k].length > 12)
    sinTraducir.push(l.code + ":" + k);
}
if (sinTraducir.length) console.log("\n  AVISO sin traducir (" + sinTraducir.length + "): " +
  sinTraducir.slice(0, 12).join(", ") + (sinTraducir.length > 12 ? " …" : ""));
```

Report only — do not increment `fallos`, or the repo can never ship a new string.

### 1i. Step 9 will fail on the orphan-key check, and the plan never fixes it

`tools/test-i18n.js` treats a key that exists in `en.js` but appears in no `data-i18n` attribute as a **failure** (`fallos++`), unless it is listed in `SOLO_JS` or matches `PREFIJOS_JS`:

```js
const PREFIJOS_JS = ["ev.type.", "mis.empty", "mis.less", "mis.join", "mis.moreInfo", "mis.langNote", "wa."];
```

The plan's new JS-rendered keys `mis.f.where`, `mis.f.when`, `mis.f.lang`, `mis.f.kids`, `mis.f.kidsNo`, `mis.f.free`, `mis.f.bring`, `mis.f.map`, `mis.f.until`, `mis.ask` and `mis.noSignup` match none of them. Step 7 ("run `node tools/test-i18n.js`") exits 1 and step 9 commits nothing. Add to step 7:

```js
const PREFIJOS_JS = ["ev.type.", "mis.f.", "mis.empty", "mis.less", "mis.join", "mis.ask",
                     "mis.noSignup", "mis.moreInfo", "mis.langNote", "wa."];
```

Same trap on the footer, §1j.

### 1j. Step 8, "Footer disclaimer key", ships a key with no markup

> "**0:10** — Footer disclaimer key."

There is no `foot.*` key in `js/lang/en.js` today and no footer paragraph waiting for one. Add the key alone and `test-i18n.js` reports it as *"claves definidas y sin usar: foot.independent"* and fails. Step 8 must be **key + markup**, and the markup is what actually delivers the legal hygiene:

```html
<p class="foot-note" data-i18n="foot.independent">Florida Advent Missionaries is an independent group of lay Seventh-day Adventists. We are not an official body of the Seventh-day Adventist Church and we do not speak for it.</p>
```

---

## 2. Accessibility: two pairs below AA, neither of them in the plan's table, neither tested by the harness

Every pair the plan tabulates passes, and every pair `tools/test-contrast.js` checks passes. The failures are in the pairs neither one looks at — and the plan asserts the palette is *"fully AA today"* on the strength of a harness that tests fifteen text pairs and zero interface pairs.

**Failure 1 — the focus indicator, both themes.** `css/styles.css:82–84`:

```css
:focus-visible { outline: 3px solid var(--ring); outline-offset: 3px; }
```

- Light: `--ring: rgba(138, 93, 13, .40)` over `--bg #FAF6EE` composites to `rgb(205, 185, 148)` = **1.78:1**. Required: 3:1 (SC 1.4.11, non-text contrast — a focus indicator is exactly the case the SC names). Over the old `#FBF9F4` it is 1.79:1, so this is pre-existing, not introduced — but the plan re-declares the palette AA-clean and moves on.
- Dark: `rgba(227, 180, 92, .45)` over `#101B1D` = **2.84:1**. Also short.

This matters more under this plan than under the current page, because §4 makes two `<select>` elements the page's primary control, and `css/styles.css:617` gives selects the *weaker* variant with no outline at all:

```css
.sun-city select:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 4px var(--ring); }
```

A keyboard user tabbing into the plan's headline feature gets a 1.78:1 halo and no outline.

**Fix — two lines, no alpha maths:**

```css
:root, [data-theme="light"] { --ring: #8A5D0D; }   /* 5.33:1 on bg, 5.61:1 on surface, 4.84:1 on bg-alt */
[data-theme="dark"]        { --ring: #E3B45C; }   /* 9.15:1 on bg, 8.04:1 on surface */
```

Solid, not translucent, so the ratio no longer depends on what is behind it. Keep `outline-offset: 3px`.

**Failure 2 — the `btn-ghost` border, both themes.** `css/styles.css:142`, `border-color: var(--line-strong)`:

- Light, new palette: `rgba(34,32,28,.26)` = **1.71:1** on `--bg` (old: 1.64:1).
- Dark, new palette: `rgba(241,236,227,.28)` = **2.32:1** on `--bg`.

Both below the 3:1 an SC 1.4.11 control boundary needs. The plan's step 3 routes `hero.cta2` and (per §4) `hero.cta1` into this style, and `#donar` already uses it twice (`index.html:953, 957` — `data-wa="give"` and `data-wa="volunteer"`).

**Fix — do not raise `--line-strong` globally** (it is also used for hairlines where 1.7:1 is the correct, quiet value). Give ghost buttons their own token:

```css
:root, [data-theme="light"] { --line-btn: rgba(34, 32, 28, .50); }  /* 3.15:1 bg · 3.19:1 surface · 3.07:1 bg-alt */
[data-theme="dark"]        { --line-btn: rgba(241, 236, 227, .38); } /* 3.21:1 bg · 3.12:1 surface */
.btn-ghost { border-color: var(--line-btn); color: var(--text); }
```

Then extend `tools/test-contrast.js` so this can never regress. Add to `PARES`:

```js
["ring", "bg", 3, "anillo de foco sobre el fondo"],
["ring", "surface", 3, "anillo de foco sobre tarjeta"],
["line-btn", "bg", 3, "borde del boton fantasma"],
["line-btn", "surface", 3, "borde del boton fantasma en tarjeta"],
```

`rgbaSobre()` already composites alpha correctly, but note the harness passes `fondoBase` (always `--bg`) as the compositing ground for the *background* token and then composites the foreground over the resolved background — so `["ring","surface",…]` resolves correctly. This is the single highest-value addition to the plan's accessibility section and it costs four lines.

One more, not a failure but worth stating: the plan's light `--surface #FFFCF6` sits at **1.05:1** from `--bg`, and `--line` at `rgba(34,32,28,.15)` gives the card edge **1.35:1**. That is fine for a decorative card, but `.value-card` (line 419) is the container the plan wraps the near-you block and the "need on your street" CTA in. If a card is ever the hit target itself, that 1.35:1 edge becomes a 1.4.11 case too.

---

## 3. Does the events section survive zero events, and survive going stale? Partly — and the plan's own copy is what breaks

### Zero events (the state it ships in today)

The mechanics hold up. `splitEvents()` returns `{up: [], past: []}`, `renderMissions()` calls `emptyState()` for both grids, `eventSchema()` bails before emitting anything (`if (!upcoming.length) return;`), the counts are blanked (`cUp.textContent = s.up.length ? s.up.length : ""`), and `tools/test-page.js:75–76` explicitly asserts the empty state and its button render. Nothing throws, nothing looks broken.

**What breaks is the copy above it, which the plan keeps verbatim and even quotes approvingly.** The section head is not empty-aware:

> `mis.title` — "Where we have been, and where we are going next"
> `mis.lead` — "This is the honest record of what we actually do… **If something here is near you, come.** You do not need an invitation and you do not need to be an Adventist."

With `FAM_EVENTS = []`, the title's second clause ("and where we are going next") is contradicted eight lines below by "Nothing on the calendar yet", and the lead's instruction ("If something here is near you, come") points at an empty grid. The plan says *"Existing `mis.*` keys stay as they are; they are good"* — they are good for a populated section and wrong for the one that ships.

**Concrete fix — make the head empty-aware in `renderMissions()`, two keys and four lines:**

```js
var head = $("#misiones .section-title"), lead = $("#misiones .section-lead");
var vacio = !s.up.length && !s.past.length;
if (head) head.textContent = t(vacio ? "mis.title0" : "mis.title");
if (lead) lead.textContent = t(vacio ? "mis.lead0" : "mis.lead");
```

```json
{ "en": {
  "mis.title0": "This is where we will write down what we do",
  "mis.lead0": "We have not kept a record until now. From here on, every visit, every health table and every week of meetings gets written down on this page — the date, the street, and a photograph where the people in it have said yes. If you would rather not wait for the first one, the Sabbath is every week and someone can tell you where to go this Saturday."
} }
```

Note this also fixes a `data-i18n` collision you would otherwise hit: `mis.title` and `mis.lead` carry `data-i18n` attributes in the markup, so the language switcher will overwrite whatever `renderMissions()` writes on every language change. Call `renderMissions()` *after* the translation pass, or drop the `data-i18n` attributes from those two nodes and let `renderMissions()` own them. The plan does not mention this and it is a real ordering bug.

Second problem in the ship state: the plan's replacement empty-state CTA.

> `mis.emptyUp.cta`: "Come this Sabbath" … "The first button jumps to the near-you block from §4."

Step 3 (the near block, 1:30) is the largest and most slip-prone item in the day, and it depends on data that PENDIENTES §7 says does not exist yet. If step 3 does not land, `href="#cerca"` is a link to nothing — worse than the button it replaces, which at least opened WhatsApp. **Make the first button conditional in `emptyState()`:**

```js
if (withCta && $("#cerca")) h += '<a class="btn btn-primary" href="#cerca">' + esc(t("mis.emptyUp.cta")) + "</a>";
```

### Six months later, last event stale

This is the state the plan does not handle at all, and it is the likelier long-run state than "zero".

Suppose the last event is 2026-02-14 and today is 2026-08-27. `splitEvents()` puts it in `past`. `wireMissions()` does the right thing at the end —

```js
var s = splitEvents();
show(!s.up.length && s.past.length ? "past" : "up");
```

— so the section opens on "Already done". Then:

- The date block (`.ev-date`) renders `14 Feb 2026` with **no relative framing**. A reader who does not do the arithmetic sees a card; a reader who does sees a group that stopped six months ago. There is no key anywhere for "we have not been out since February", which is the honest thing to say.
- `#tabUpCount` is blanked to `""`, so the "Coming up" tab reads simply **"Coming up"** with no zero next to it — the one place the number would be informative is the one place it is suppressed. `cPast` shows a count; `cUp` shows nothing. A visitor cannot tell whether the tab is empty or just unvisited.
- The **head copy is still "and where we are going next"** — now a claim about the future made on top of a six-month-old record. This is the same defect as the zero state, and it survives the fix above (which only triggers when *both* lists are empty).

**Concrete fix.** (a) Always render the upcoming count, including zero — one character change: `cUp.textContent = String(s.up.length);` and style `.count` to show `0` in `--text-soft`. (b) Add a staleness line to the head when `up` is empty and the newest past event is more than 90 days old:

```js
var ultimo = s.past.length ? s.past[0].start : null;
var dias = ultimo ? Math.round((Date.now() - new Date(ultimo + "T12:00:00")) / 86400000) : 0;
if (!s.up.length && dias > 90) {
  lead.textContent = t("mis.lead.stale").replace("{months}", Math.round(dias / 30));
}
```

```json
{ "en": { "mis.lead.stale": "We have not put anything new on this calendar in about {months} months. That is the truth and we would rather show it than pad the page. What has not stopped is the Sabbath — it comes every week, and someone can tell you where to go this Saturday." } }
```

That single string is worth more than the six practical fields in §2, because it is the one that fires by default when a volunteer-maintained calendar does what volunteer-maintained calendars do.

### Two smaller breakages in the plan's card deltas

**The `id` field has no fallback.** The plan adds `id: "2026-11-14-feria-orlando"` to the schema and `id="ev-<id>"` to the `<article>`, but the three copy-paste examples already in the `js/events.js` header manual have no `id`, and volunteers copy the manual, not the plan. Two id-less events produce `id="ev-undefined"` twice — invalid HTML, and the WhatsApp deep link the whole feature exists for lands on the wrong card. **Derive it:**

```js
function evId(ev) {
  return ev.id || (ev.start + "-" + String(ev.city || "fl").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"));
}
```

and add `id` to the manual's examples too, with the note the plan already wrote — *"never reuse: it becomes the anchor and the calendar UID"* — in the volunteer's own Spanish.

**`mis.f.free` hardcodes a claim there is no field for.**

> `"mis.f.free": "Free. Nothing is collected and nothing is sold."`

`eventSchema()` already hardcodes `isAccessibleForFree: true` and a `$0` offer for every event, with no field to say otherwise. Printing the sentence on every card deepens a promise the data cannot qualify. The day someone lists a Camp Meeting with a registration fee, or a health expo where the venue charges for parking, the page and the structured data both lie. **Add the field with the right default:**

```js
free: true,   // NUEVO: ponlo en false si hay que pagar algo, aunque sea el parqueadero
```

and render `mis.f.free` only when `ev.free !== false`, and set `isAccessibleForFree: ev.free !== false` with the `offers` block dropped entirely when it is false.

---

## 4. Claims of official standing, and promises not yet backed

### 4a. The plan contradicts its own caution, one section later

§2 gets this exactly right:

> "One caution flagged in `PENDIENTES.md` §7 that applies here: 'someone will meet you and walk in with you' needs a named person per region who has actually agreed. **Do not publish that sentence in nine languages before that person exists.**"

Then §4 publishes the same promise in nine languages, twice, unconditionally, above the fold, as the page's primary action:

> `near.title`: "Someone near you would be glad to meet you"
> `near.lead`: "…where to go this Saturday, and **the name of the person who will be waiting outside so you do not have to walk in alone**."

`near.lead` renders from a `data-i18n` attribute *before any city is selected*, so it makes the promise for all 22 cities in `js/sabbath.js` regardless of how many have data. The `near.none` fallback fires only after the reader has already read the promise and chosen a city. Meanwhile `PENDIENTES.md` §7 lists this exact sentence as unresolved, and it is already live in `sab.g.lead` and `sab.e.2.d`.

**Rewrite `near.lead` to promise only the two things the code can actually compute today** (sunset from `sabbath.js`, and a congregation only where one is entered):

```json
{ "en": {
  "near.lead": "Choose your city and the language you would rather speak. We will tell you when the Sabbath begins where you live. Where we have someone in that city, we will tell you who they are and where to go; where we do not, we will say so plainly rather than send you somewhere we do not know.",
  "near.person": "In {city}, ask for {name} — {langs}. Write first if you would rather someone is expecting you, or just come.",
  "near.personNone": "We do not have anyone in {city} yet. Write to us and we will find the nearest congregation in the language you asked for."
} }
```

### 4b. Publishing a volunteer's name, street, and standing time is a safety decision the plan does not flag

> `near.person`: "{name} is the person to ask in {city}. **She** speaks {langs}."

This publishes a named individual, a physical address, a day and an hour at which she will be standing outside it, in nine languages, on an indexed page. That is a decision for the person named, not a design decision, and the plan never says so. **Add a hard gate to `js/near.js`:** no entry appears without a `consent: true` field and a first name only, never a surname; and offer a role label as the default (`"Ask at the door for the Florida Advent Missionaries welcome"`) with a name as the opt-in upgrade.

The hardcoded `She` is a separate bug — see §5.

### 4c. The existing structured data already says "Church", which no footer disclaimer undoes

The plan spends its longest legal passage on colour —

> "Florida Conference runs `#003b5d`, the NAD runs `#003B5C`; matching it exactly is the one colour choice that starts to read as 'this is an official entity'."

— while `index.html:111–121` already declares to every crawler:

```json
"@type": "Organization",
"additionalType": "https://schema.org/Church",
"alternateName": "Florida Advent Missionaries Inc.",
"nonprofitStatus": "Nonprofit501c3",
"taxID": "81-1180614",
```

`schema.org/Church` is a stronger "official entity" signal than any hex value, and Google reads it. And `PENDIENTES.md` §1 records that the EIN and the Delray Beach address were "**se tomaron de registros publicos**" and are **still unconfirmed** — a published, unverified tax ID is a materially larger exposure than a 5° hue difference. **Two concrete additions the plan should carry:** change `additionalType` to `https://schema.org/Organization` (or drop the line), and add `"disambiguatingDescription"` carrying the same disclaimer text as `foot.independent`. Then move "confirm EIN and address before the next commit" ahead of the palette in the day's order.

### 4d. Three §3 recommendations promise capability the group has not confirmed

The plan applies the right test to one of them and not the other two:

> "**Only list what you will actually answer for.**" — applied to Breathe-Free 2 / Journey to Wholeness / Seasons, correctly.

But not here:

> "Say plainly that **when a storm hits you work through Adventist Community Services**, whose specialty is donations management through multi-agency warehouses…"

That asserts an operational relationship with a denominational agency. ACS disaster response is activated *by a conference* through its ACS director; a lay group with no confirmed conference (PENDIENTES §9 — "**Confirmar a que asociacion pertenece el grupo**", three candidates, overlapping) cannot state this. And a stranger who reads it after a hurricane and turns up expecting a distribution centre gets nothing. **Rewrite to the version that is true regardless:** *"When a storm hits, the Adventist response in Florida runs through Adventist Community Services and their warehouses. We are not that operation — we are neighbours with a truck and a phone. Tell us what your street needs and we will get it to whoever can supply it."*

And:

> "**Adventurers**, grades 1–4 with a parent … **Pathfinders**, grades 5–8; **TLT** for grades 9–12."

Adventurer and Pathfinder clubs are *chartered by a conference*. Listing them in a "somewhere for the children" section reads as "we run a club", and a parent will arrive asking to enrol. Same unconfirmed-conference problem. **Rewrite:** *"We do not run a Pathfinder club. The congregations we send people to do, and we will tell you which one is nearest and who to ask."* — which is honest, is useful, and needs no charter.

### 4e. GLOW, recommended to the readership least likely to be served by it

> "add **GLOW** tracts — pocket-sized, free, twenty-five-plus languages **including Spanish, French and Portuguese** — as a 'we will put some in your hand' offer"

The list conspicuously omits Haitian Creole, and `PENDIENTES.md` §8 says kreyòl is already **"el idioma peor servido"** with no *Steps to Christ*, no library, no broadcast. Recommending a literature offer without first checking it covers the one language that has nothing repeats the gap. **Before this ships:** verify the kreyòl inventory, and if it is absent, say so in the kreyòl dictionary rather than showing the same offer to everyone.

Also worth noting the plan never mentions the one piece of name exposure the group cannot design around: the brand is "Florida Advent **Missionaries**", and the plan's own reading of BA 40 40 says the protection "covers the **name** 'Adventist' and derivatives, not just the flame graphic." Colour is the cheap part. If the legal section is worth 400 words, at least one sentence belongs on the name.

---

## 5. Tone for Haitian, Hispanic, Brazilian, German, Dutch, Russian and Ukrainian readers, and for an undocumented reader

**5a. `near.note` lists everything a stranger is not asked for, except the one thing a large part of this readership is actually afraid of.**

> `near.note`: "Nothing is asked of you. You do not have to be a member, you do not have to dress a particular way, and nobody will ask you for money."

For a Haitian or Central American reader in Florida, the unspoken fourth item is the only one that matters. The omission is louder than the list. **Rewrite:**

```json
"near.note": "Nothing is asked of you. Not your papers, not your name, not your address. You do not have to be a member, you do not have to dress a particular way, and nobody will ask you for money. We do not keep a list of who comes."
```

Add the last clause only if it is true, and if it is, put it in the FAQ too.

**5b. The plan's primary action requires handing a phone number to a stranger, and offers no alternative.**

`wa.near`: *"Hello. I am in {city} and I would rather speak {lang}. Where should I go this Sabbath?"* — sent over WhatsApp, which discloses the sender's number and profile photo, from an account tied to a real phone. For an undocumented reader that is a real cost, and the plan makes it the one button on the page. **Add a no-identifier path directly under the button:**

```json
"near.walkin": "You do not have to write to anyone. The address and the time above are all you need — come and sit at the back, and leave whenever you like."
```

That line costs nothing and is the difference between an invitation and a form.

**5c. `mis.lead` — kept verbatim by the plan and promoted to the third section — opens with a knock on the door.**

> "the honest record of what we actually do: **the streets we knocked on**, the tables we set up in a park…"

An unannounced knock is the frame the plan is choosing to lead with, for a readership in which a knock at the door is, for a meaningful share, the thing they most fear. **Rewrite the clause:** *"the doors that opened to us, the tables we set up in a park, the evenings we spent in someone's living room."* Same rhythm, same honesty, no threat.

**5d. `mis.f.kidsNo` reads badly in every language.**

> `"mis.f.kidsNo": "This one is for adults"`

In Spanish, Portuguese, French and Russian the literal rendering ("es para adultos", "para adultos", "pour adultes", "для взрослых") collides with the adult-content sense. **Rewrite:** `"mis.f.kidsNo": "There is nothing prepared for children at this one."` — which is also more informative: it explains *why*.

**5e. `near.person` hardcodes a gender the placeholder cannot carry.**

> "{name} is the person to ask in {city}. **She** speaks {langs}."

In Spanish, French, Portuguese, German, Russian and Ukrainian the surrounding sentence agrees with the referent's gender, and Russian and Ukrainian also decline the name and the city. `.replace("{name}", …)` cannot produce a grammatical sentence in six of nine dictionaries, and "She" is wrong for half the volunteers in English. **Rewrite to a form with no pronoun and no agreement**, per 4a: `"In {city}, ask for {name} — {langs}."` Put `{city}` at the head of the clause so ru/uk translators can use the prepositional case in their own version without fighting the template.

**5f. The plan makes a language select a primary control and never touches the flag question `PENDIENTES.md` §8 raises about that exact control.**

> §8: "El selector usa 🇷🇺 para el ruso. Buena parte de quienes leen en ruso en Florida son ucranianos, moldavos o centroasiaticos, y desde 2022 una bandera de Estado puede leerse mal."

Today that selector is in the header. The plan promotes a second language chooser into the first screenful and labels it `near.lang`: *"The language you would rather speak"* — putting a Ukrainian reader one line below a Russian flag, in the page's most prominent block. Promoting the control without resolving §8 amplifies the exact problem §8 names. **Do it in the same commit:** drop flags for `ru` and `uk` (or all nine — the native names are unambiguous and shorter), listing `Русский` and `Українська` as plain text in `FAM_LANGS` in `js/i18n.js`.

**5g. The near-you block will fail for German and Dutch readers in every city, by construction.**

`near.none` is the honest fallback, but for `de` and `nl` in Florida it is the *only* branch that will ever execute — there is essentially no German- or Dutch-speaking Adventist congregation in the state. A German reader who uses the page's one primary feature gets "we do not have anyone in your city yet" one hundred percent of the time, which reads as a broken widget rather than honest scarcity. **Concrete:** populate `near.lang` from the languages that actually appear in `js/near.js` entries, plus a final option `near.langOther`:

```json
"near.langOther": "Another language — tell us which",
"near.leadOther": "We do not have a congregation in every language. Tell us yours and we will find the nearest one where someone can sit with you and translate."
```

That converts a guaranteed failure into a specific offer.

**5h. Russian and Ukrainian readers are least likely to be on WhatsApp.** The single-channel design (one WhatsApp button, `WA_NUMBER = "17862392331"`) is right for Haitian, Hispanic and Brazilian readers and wrong for the ru/uk pair, where Telegram and Viber dominate. The site already has `#contacto`. **Concrete:** in the `ru` and `uk` dictionaries only, have the near-block CTA fall back to the contact form, or add a `tel:`/email line beneath. One extra key, `near.altChannel`, rendered only for those two codes.

---

## 6. What the plan missed

**6a. Alt text — for a plan whose central argument is photographs.** `tools/test-seo.js:103` enforces `imgs.every(i => i.hasAttribute("alt"))`. `eventCard()` currently emits `alt=""` (`js/main.js`, the `ev.photo` branch), which is a *decorative* declaration. The plan's own justification — "**A face is the one thing a stranger studies**" — makes `alt=""` indefensible the moment a photo goes in, and §4 adds a team photograph with no alt guidance and no i18n key at all. On a nine-language site every alt string is a translatable key. **Concrete:** add `alt` to the events schema and the volunteer manual —

```js
alt: "Dos voluntarias toman la presion a un senor en una carpa del parque",  // NUEVO: describe la foto para quien no la ve
```

— render `alt="' + esc(evText(ev.alt, ev) || evText(ev.title, ev)) + '"`, and add `near.photoAlt` for the team photograph. Zero images today means this has never been exercised; the first photo is the moment it matters.

**6b. Image weight and layout shift — 0 minutes budgeted.** `PENDIENTES.md` §10 records the current cost as "**238 KB por visita en el peor caso**". Four unresized phone photographs are 2–8 MB, an order of magnitude over the entire current page, and they land on a mission-critical mobile audience reached over WhatsApp on cellular. The plan specifies `aspect-ratio:16/10;object-fit:cover` but no intrinsic dimensions — and by moving `ev-photo` *above* `ev-body` it makes cumulative layout shift strictly worse, because the photo now pushes all the text down when it loads instead of arriving below it. **Concrete:** emit `width="960" height="600"` on the `<img>` alongside the existing `loading="lazy" decoding="async"`, and put a hard rule in the `js/events.js` manual in the volunteer's own words — *"Antes de subir la foto, achicala: 1600 px de ancho como maximo y menos de 200 KB. Una foto del celular sin achicar pesa veinte veces mas que toda la pagina."*

**6c. Photo consent has copy but no mechanism.** `mis.emptyPast.d` already promises *"with photographs where the people in them have said yes"*, and the `js/events.js` manual says *"Pide permiso antes de publicar caras de menores."* The plan promotes photographs to the top of every card and extends nothing. Adults need the same permission, and the record of it should live where the photo lives. **Concrete:** one more field —

```js
consent: "2026-08-20, permiso verbal de las tres personas que salen",  // NUEVO: quien dio permiso y cuando
```

— never rendered, always required by the manual. It costs the volunteer eight seconds and it is the difference between a promise and a practice.

**6d. Two city selects, two states, no shared memory.** `wireSabbath()` already persists a city choice to `store(LS_CITY)` and repopulates `#sabCity` from `window.FAM_SUNSET.cities`. The plan's near block builds a second select over the same 22 cities and says nothing about sharing state. A visitor who picks Hialeah in the hero and scrolls to the Sabbath section is asked for their city again — on the one page whose entire argument is "we already know where you are". **Concrete:** have the near block write and read the same `LS_CITY` key, and on change call the existing `renderSabbath()`; likewise initialise from `store(LS_CITY)` so the hero remembers a returning visitor.

**6e. `js/near.js` is never wired.** `index.html:1089–1092` loads four scripts in order, `js/main.js` last. The plan adds a fifth file and never adds the `<script>` tag, never adds it to `tools/test-loader.js`'s budget accounting, and never says whether it loads before `main.js` (it must — `main.js` runs its wiring on `DOMContentLoaded` and would read `window.FAM_NEAR`). One line, but it is not in any of the nine steps.

**6f. The new `#cerca` section is never registered anywhere it needs to be.** Not in the desktop nav (222–229), not in the drawer (268–280), not in the scrollspy's `sections` list (`js/main.js:644`), not in `sitemap.xml`. If it is genuinely "the page's one primary action" it should be the first nav item, and the plan's own §2 reorder pass is the moment to do both together.

**6g. `offers.validFrom: "2026-08-27"` is hardcoded in the plan's JSON-LD example.** A literal today-date pasted into a template goes stale the next morning and stays stale for years. Either compute it (`new Date().toISOString().slice(0,10)`) or drop the property — it is optional and adds nothing for a free event.

**6h. Nobody proofs the nine dictionaries after `patch-i18n.js` writes to them.** The tool inserts by regex against the *existing* file and reflows the closing brace:

```js
const close = body.lastIndexOf("}");
let before = body.slice(0, close).replace(/\s*$/, "");
if (!before.endsWith(",")) before += ",";
```

The plan runs it three times in one day (`missions-2.json`, `near.json`, the footer key) across nine files, and the only syntax check in the pipeline is `test-i18n.js`'s `eval()`. That is adequate but the plan should say so explicitly, and step 7 should run `node -c`-equivalent on each dictionary first (`node -e "require('./js/lang/es.js')"` will not work — these assign to `window`; use `node --check js/lang/es.js`) so a malformed insert is caught before the eval of nine files makes the error hard to attribute.

**6i. The plan never states what happens to `sab.g.lead` and `sab.e.2.d`.** Both already carry the unconfirmed "one of us will meet you / walk in with you" promise flagged in PENDIENTES §7, in nine languages, live today. The plan writes a careful new caution about not publishing that sentence, and leaves two existing instances of it in place. Either the promise is backed and all four places can say it, or it is not and all four need the shorter form the plan itself drafts: *"In the meantime, the Sabbath is every week. Ask us where to go this Saturday and we will tell you."* Pick one, apply it everywhere, in the same commit.

---

## What I would actually do with the day

Reordered, with the corrections above folded in:

| | |
|---|---|
| 0:15 | `--ring` solid + `--line-btn` + four new pairs in `tools/test-contrast.js`. **This is the only genuine AA fix in the day** and the plan does not contain it. |
| 0:20 | Palette: nine light + eight dark tokens, plus the two shadow lines. No literals to mirror anywhere. Run the harness. |
| 0:25 | Empty-aware and stale-aware section head (`mis.title0`, `mis.lead0`, `mis.lead.stale`), always-render the upcoming count, ordering fix so `renderMissions()` runs after the translate pass. |
| 1:30 | Near-you block — with `near.lead` rewritten to promise only what the code computes, `near.note` naming papers, `near.walkin`, shared `LS_CITY`, `<script>` tag, nav entry. Hero buttons stay `btn-primary` until three cities have data. |
| 0:30 | Card deltas: `evId()` fallback, photo above body **with `width`/`height` and a real `alt`**, `free` field, practical block. |
| 0:20 | `events.js` manual: five new fields plus `alt`, `consent`, and the resize rule, in the volunteer's Spanish. |
| 0:20 | JSON-LD: `offsetFor()`, `location.name`, `inLanguage`, drop redundant `endDate`, drop `validFrom`, `isAccessibleForFree` from the field, `additionalType` off the Organization block. |
| 0:40 | Patches + the `PREFIJOS_JS` additions + the eight-line "sin traducir" reporter + drop the ru/uk flags. |
| 0:15 | Footer disclaimer: **key and markup**. |
| 0:15 | Harnesses, commit. |

Not today: the section reorder (1d/1e — it belongs to the day the third past event is written down), and every §3 item that names a denominational programme (4d), which is blocked on PENDIENTES §9.