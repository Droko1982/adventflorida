I read the repo first — the missions section, `js/events.js`, the split i18n and the SEO/contrast harnesses already exist, so the plan below is a delta against the live code, not a rebuild.

---

# BUILD PLAN — one developer, one day

**Repo:** `C:\Users\asus\adventflorida` · no build step · 9 languages via `js/lang/*.js`, edited only through `tools/patch-i18n.js`

## State of play (verified in the working tree, not assumed)

Already done, do not rebuild: `#misiones` section exists in `index.html` between `#ministerios` and `#oracion`; `js/events.js` ships with an empty `window.FAM_EVENTS = []` and a volunteer manual in the header comment; `js/main.js` lines ~348–560 render upcoming/past, split on Florida civil date, do per-field language fallback with `lang=` marking, and emit Event JSON-LD; all 18 `mis.*` keys and 7 `ev.type.*` keys exist in all nine dictionaries; the i18n bundle is split per language (one file downloaded per visit); `node tools/test-contrast.js` reports the whole palette AA. Still true from the audit: **zero `<img>` on the page, zero service times, zero addresses, zero maps.**

---

## 1. COLOUR — do not re-skin. Warm six tokens and stop.

**Verdict: the palette is right.** Petrol blue + gold + ivory is inside real Adventist practice (NAD Denim `#003B5C` is the church's core colour; Adventist Review runs a cream ground `#fafae1`), it is fully AA today, and the General Conference states in its own identity system that *there is no official global colour or colour system* — so there is no palette you are failing to match and no trademark exposure in colour at all. A re-skin buys nothing and costs you a day.

The one real defect is locatable: `--text` at hue 205° and `--text-soft` at hue 208° are blue-greys, and they carry ~90% of the words on the page. That is what reads as B2B SaaS. Pure `#FFFFFF` cards on a warm ground compound it.

Note the dossier's premise is slightly stale: the shipped accent is `#8A5D0D`, not `#96650F` — already warmer and at 5.46:1. **Leave the accent alone.**

### Light — replace six values in `css/styles.css`

| Token | From | To | Contrast on new bg |
|---|---|---|---|
| `--bg` | `#FBF9F4` | `#FAF6EE` | — |
| `--bg-alt` | `#F2EDE2` | `#F2EBDC` | — |
| `--surface` | `#FFFFFF` | `#FFFCF6` | 1.05:1 from bg (identical separation to today) |
| `--surface-2` | `#F7F3EA` | `#F6F0E4` | — |
| `--text` | `#14232E` | `#22201C` | **15.09:1** on bg · 15.88:1 on surface · 13.70:1 on bg-alt |
| `--text-soft` | `#55697A` | `#6A6157` | **5.63:1** on bg · 5.93:1 on surface · 5.11:1 on bg-alt |
| `--accent-soft` | `#FBF1DC` | `#FBEFD9` | accent on it: 5.05:1 |
| `--line` | `rgba(20,35,46,.13)` | `rgba(34,32,28,.15)` | — |
| `--line-strong` | `rgba(20,35,46,.24)` | `rgba(34,32,28,.26)` | — |

Unchanged: `--accent #8A5D0D` (5.33:1 on the new bg, 5.61:1 on surface, white-on-fill 5.75:1), `--deep #0F3B4C` (11.13:1 on bg, white-on-fill 12.00:1), `--ring`.

### Dark — replace six values

| Token | From | To | Contrast |
|---|---|---|---|
| `--bg` | `#0A1720` | `#101B1D` | — |
| `--bg-alt` | `#071119` | `#0B1416` | — |
| `--surface` | `#10242F` | `#18272A` | 1.14:1 from bg (identical to today) |
| `--surface-2` | `#0D1E28` | `#141F22` | — |
| `--text` | `#E9F0F4` | `#F1ECE3` | **14.92:1** on bg · 13.10:1 on surface |
| `--text-soft` | `#9FB3BF` | `#B0A798` | **7.38:1** on bg · 6.48:1 on surface |
| `--accent-soft` | `#1B2A2C` | `#202C26` | accent on it: 7.55:1 |
| `--deep-soft` | `#0D2029` | `#12262B` | deep on it: 7.92:1 |

Unchanged: `--accent #E3B45C` (9.15:1 on bg, 8.04:1 on surface, ink-on-fill 9.15:1), `--deep #7FC2D6` (8.85:1 on bg, 7.77:1 on surface, ink-on-fill 9.29:1).

Every replacement meets or beats what it replaces. Then re-run `node tools/test-contrast.js` after updating the token literals inside that script.

**What it buys:** the page stops feeling like a software product and starts feeling like a printed letter. Warm taupe sub-copy and a warm-white card are what separate "a company" from "people who wrote this". Nothing moves, nothing re-flows, the diff is nine lines.

**Two things not to do.** First, do **not** adopt NAD Denim `#003B5C` for `--deep`, even though it is a good colour and the dossier suggests it. Florida Conference runs `#003b5d`, the NAD runs `#003B5C`; matching it exactly is the one colour choice that starts to read as "this is an official entity". You are an independent lay group — under GC Working Policy BA 40 40 §4, members and supporting ministries may use the church's marks *only with express written approval* from the General Conference Corporation, and that protection covers the **name** "Adventist" and derivatives, not just the flame graphic. Colour is free; looking official is not. Keep the 5° of distance. Second, never place the flame/open-Bible/cross symbol on this site — not in the favicon, not in the footer, not "just as a background watermark".

While you are in identity: add a one-line disclaimer to the footer. It is the cheapest legal hygiene available and it costs nothing in warmth.

```json
{ "en": { "foot.independent": "Florida Advent Missionaries is an independent group of lay Seventh-day Adventists. We are not an official body of the Seventh-day Adventist Church and we do not speak for it." } }
```

---

## 2. MISSIONS SECTION — built. Move it, deepen the fields, ship it empty.

### Position

Move `#misiones` from ninth to **third**: `hero · who we are · missions · Jesus Christ · Steps to Christ · beliefs · Sabbath · Bible studies · ministries · prayer · resources · giving · FAQ · contact`.

"Who we are" makes a claim — teachers, nurses, drivers, grandparents. The missions record is the evidence for that claim and belongs against it, not eight sections downstream. Everything that asks something of the reader still comes after the gospel section, which is where it should be. In `index.html`, cut the `<section class="missions" id="misiones">` block and paste it after the close of `#quienes`; add `class="section-alt"` and drop it from `#ministerios` so the alternating bands still alternate.

### Block structure (deltas against the current markup)

Keep the head, the two tabs with counts, the two grids, the show-more and the "Is there a need on your street?" card — all of that is right. Four changes:

1. **Photo first.** `ev-photo` renders after the body today; move it above `ev-body` and give it `aspect-ratio:16/10;object-fit:cover`. A face is the one thing a stranger studies.
2. **A practical block on every upcoming card**, below the description: address (not just city), a map link, start *and* end time, the language spoken, whether children are welcome, and the word *free* stated outright. These are the six things that decide whether someone comes.
3. **A stable anchor per event**: `id="ev-<id>"` on the `<article>`, so a WhatsApp link can point at one event.
4. **The empty upcoming state gets a real offer**, not just a "tell me later" button — see below.

### Exact English copy

Existing `mis.*` keys stay as they are; they are good. Add these, then run `node tools/patch-i18n.js tools/patches/missions-2.json`:

```json
{
  "en": {
    "mis.eyebrow": "Out on mission",
    "mis.title": "Where we have been, and where we are going next",
    "mis.lead": "This is the honest record of what we actually do: the streets we knocked on, the tables we set up in a park, the evenings we spent in someone's living room. If something here is near you, come. You do not need an invitation and you do not need to be an Adventist.",

    "mis.tabUp": "Coming up",
    "mis.tabPast": "Already done",

    "mis.f.where": "Where",
    "mis.f.when": "When",
    "mis.f.lang": "Spoken in",
    "mis.f.kids": "Children are welcome",
    "mis.f.kidsNo": "This one is for adults",
    "mis.f.free": "Free. Nothing is collected and nothing is sold.",
    "mis.f.bring": "Bring",
    "mis.f.map": "Open in maps",
    "mis.f.until": "until",

    "mis.join": "I would like to come",
    "mis.ask": "Ask about this one",
    "mis.moreInfo": "More about this",
    "mis.noSignup": "There is nothing to sign up for. Come to the address at the time above, or send a message first if you would rather know someone is expecting you.",

    "mis.langNote": "Written in {lang}. Ask us and we will tell you about it in your language.",

    "mis.emptyUp.t": "Nothing on the calendar yet",
    "mis.emptyUp.d": "We are planning the next one. In the meantime the invitation that never expires still stands: this Sabbath, someone will meet you outside a congregation near you and walk in with you. Or tell us your city and we will write to you once, when something is happening close by.",
    "mis.emptyUp.cta": "Come this Sabbath",
    "mis.emptyUp.cta2": "Tell me when something is near me",

    "mis.emptyPast.t": "The record starts here",
    "mis.emptyPast.d": "We have only just begun writing down what we do. As each visit, health table and week of meetings happens, it will appear here, with photographs where the people in them have said yes.",

    "mis.more": "Show more",
    "mis.less": "Show fewer",

    "mis.need.t": "Is there a need on your street?",
    "mis.need.d": "A neighbour nobody checks on. A family that lost everything in the last storm. A block where nobody has ever been offered a Bible study. Tell us and we will come — you do not have to organise anything, and you do not have to be there when we do.",
    "mis.need.cta": "Tell us about it",

    "wa.event": "Hello. I would like to come to this: {title}. Could you tell me more?",
    "wa.eventNews": "Hello. I would like to know when something is happening near me. My city is:"
  }
}
```

The eight other dictionaries need the same keys. Until a human translates them, `patch-i18n.js` will refuse a partial patch — so pass the English string through for every language in the patch file and keep a checklist of which are genuinely translated. Do not machine-translate silently; see the honest answer below.

### Data shape — `js/events.js`

The existing header comment is already the best thing in the repo: it is a manual written for a volunteer, in their language, with copy-paste examples. Keep it. Add five fields to the documented schema and the examples:

```js
{
  id:    "2026-11-14-feria-orlando",   // never reuse: it becomes the anchor and the calendar UID
  start: "2026-11-14",                 // OBLIGATORIO, "AAAA-MM-DD"
  end:   "2026-11-21",                 // opcional, solo si dura varios dias
  time:  "10:00",                      // opcional, hora local de Florida, 24h
  until: "14:00",                      // opcional, hora de terminar
  type:  "health",
  city:  "Orlando",
  place: "Barnett Park",
  address: "4801 W Colonial Dr, Orlando, FL 32808",   // NUEVO: la calle, no solo la ciudad
  map:   "https://maps.google.com/?q=4801+W+Colonial+Dr+Orlando+FL",  // NUEVO
  speak: ["es", "en"],                 // NUEVO: en que idiomas se atiende ese dia
  kids:  true,                         // NUEVO: true, false, o quitalo si no aplica
  bring: "Nada. Si tomas medicinas, trae la lista.",  // NUEVO, opcional
  lang:  "es",
  title: "Feria de salud gratuita",
  desc:  "Toma de presion, azucar y peso sin costo, una clase de cocina sencilla y oracion para quien la pida.",
  photo: "assets/eventos/feria-orlando.jpg"
}
```

Three things the current renderer already gets right and must not be broken: `.js` not `.json` (a volunteer who double-clicks `index.html` gets `file://` CORS errors with fetch, and a trailing comma is legal in JS and fatal in JSON); the `+ "T12:00:00"` on parse, which is what stops a date-only string being read as UTC midnight and jumping a day; and the split on `(e.end || e.start) >= today` computed in `America/New_York`, so an event in progress stays in "coming up".

### Zero upcoming events — the state it ships in today

This is the state that matters, because it is the only one a stranger will see this week. The current empty state offers a button that means "maybe later". Replace it with something that can be acted on tonight: the Sabbath invitation, which is real, recurring, and needs no calendar. Two buttons, primary first:

> **Nothing on the calendar yet**
> We are planning the next one. In the meantime the invitation that never expires still stands: this Sabbath, someone will meet you outside a congregation near you and walk in with you. Or tell us your city and we will write to you once, when something is happening close by.
> [ Come this Sabbath ] [ Tell me when something is near me ]

The first button jumps to the near-you block from §4. The past tab keeps its current copy — "The record starts here" is honest and does not apologise.

One caution flagged in `PENDIENTES.md` §7 that applies here: "someone will meet you and walk in with you" needs a named person per region who has actually agreed. Do not publish that sentence in nine languages before that person exists. If they do not exist yet today, ship the shorter form: *"In the meantime, the Sabbath is every week. Ask us where to go this Saturday and we will tell you."*

### schema.org Event

The current `eventSchema()` is close. Three corrections:

- **`startDate` has no timezone offset.** Google asks for one. Resolve it at render time.
- **`location.name` should always be present** — Google's prose calls it required even though the property table says recommended.
- **Drop `endDate` when it equals `start`** rather than emitting a redundant date-only value, and never invent a start hour: if `time` is absent, emit a date-only `startDate` rather than midnight.

```js
function offsetFor(dateStr, tz) {                 // "-05:00" / "-04:00", DST-correct
  var s = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
            .format(new Date(dateStr + "T12:00:00")).match(/GMT([+-]\d{2}:\d{2})/);
  return s ? s[1] : "-05:00";
}

{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Free health expo",
  "startDate": "2026-11-14T10:00-05:00",
  "endDate": "2026-11-14T14:00-05:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "inLanguage": "es",
  "isAccessibleForFree": true,
  "location": {
    "@type": "Place",
    "name": "Barnett Park",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "4801 W Colonial Dr",
      "addressLocality": "Orlando",
      "addressRegion": "FL",
      "postalCode": "32808",
      "addressCountry": "US"
    }
  },
  "organizer": { "@type": "Organization", "name": "Florida Advent Missionaries",
                 "url": "https://droko1982.github.io/adventflorida/" },
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": "https://droko1982.github.io/adventflorida/#ev-2026-11-14-feria-orlando",
              "validFrom": "2026-08-27" }
}
```

Be straight with the owner about the ceiling here, as `PENDIENTES.md` §10 already is: Google requires *one leaf page per event* for an Event rich result, and a listing page will not earn the dated card no matter how correct the markup is. The markup is still worth emitting — it feeds the knowledge graph and other consumers. If one campaign ever matters enough, hand-write `events/<id>.html` for that single event. Do not build a page generator; that is a build step.

### Nine-language event text — the honest answer

**No. It is not realistic, and requiring it would kill the section within a month.** A volunteer who has to produce nine translations before a health expo can be listed will simply not list it.

Split the problem the way the code already does. The **chrome** — "Coming up", "Already done", "Free", month and weekday names — is about thirty strings, translated once by nine people and then never touched; `Intl.DateTimeFormat` gives you every date, month and weekday in all nine languages for nothing. The **event text** is the opposite: it changes weekly and expires. So: one authored language is mandatory and recorded in `lang`; per-language overrides are optional and *per field*; fallback runs current language → the event's own language → English → whatever exists; and every fallen-back string is wrapped in `lang="xx"` so a screen reader does not read Kreyòl with an English voice — that is WCAG 2.2 SC 3.1.2 at level AA, not a nicety. All of this is already implemented in `evText`, `evNeedsNote` and `evShownLang`. It is correct. Leave it.

Do **not** bulk machine-translate events. Google's spam policy names automated translation among the transformations it targets when many near-duplicate pages are produced, and more to the point, a mistranslated funeral or fast day is a pastoral problem, not an SEO one. What the site does instead — show the original, name the language, and offer to explain it over WhatsApp — is the honest version and reads as such.

---

## 3. WHAT THE ADVENTIST TRADITION WOULD ADD

Ranked by what helps a stranger, not by what a member would expect.

**1. A Sabbath you can actually attend: city, address, time, and a named person.** This is the largest hole on the page and it is Adventist to the core — the Sabbath section already explains what it is, and then never says where to go. Nationally, checking service times is the single most common reason anyone opens a church website (43%), and location weighs 70% in the decision to attend. The page currently answers neither. Build `js/near.js` with per-city entries the team fills in — congregation name, street address, map link, the hour the service starts, the languages spoken, and the missionary who will meet you at the door. Ship it with whatever three cities are verified; the widget hides the rest.

**2. Faces and names.** Zero `<img>` on the whole page against 101 decorative SVGs. Eye-tracking is unambiguous: people ignore decorative graphics and stock models, and study photographs of real, identifiable people. For a group whose claim is "ordinary Floridians", there is currently no evidence on the page that a single Floridian exists. Four phone photographs — a health table, a doorstep, a Bible open on a kitchen table, the team — beat any illustration you could commission.

**3. Free help for a problem someone has tonight.** Three real, named, free denominational programmes a lay group can genuinely run or refer to: **Breathe-Free 2** (stop smoking; eight-day intensive then follow-up support; free, open-source materials; Spanish edition *Respire Libremente 2*), **Journey to Wholeness** (weekly Christ-centred twelve-step group, run by Adventist Recovery Ministries), and **Seasons** (grief support). These meet a seeker at the point of pain, which is exactly how Adventist health outreach has always functioned as an on-ramp. Only list what you will actually answer for.

**4. Hurricane help, described accurately.** Florida. Say plainly that when a storm hits you work through **Adventist Community Services**, whose specialty is donations management through multi-agency warehouses and distribution centres, and which is a founding member of NVOAD alongside the Red Cross, Salvation Army and state emergency management. That single paragraph tells a stranger you are connected to something competent rather than improvising, and it tells a would-be volunteer where to turn up.

**5. Somewhere for the children.** A parent's question is "where does my child fit". Answer it in one line each: **Adventurers**, grades 1–4 with a parent (Florida clubs run Pre-K–4 and meet twice a month); **Pathfinders**, grades 5–8; **TLT** for grades 9–12. Plus **Vacation Bible School** in the summer, run from the official denominational kit in English and Spanish. Children's programmes weigh 56% in a parent's choice of congregation, 65% among parents of under-18s.

**6. More free literature than one book.** *Steps to Christ* is there; add **GLOW** tracts — pocket-sized, free, twenty-five-plus languages including Spanish, French and Portuguese — as a "we will put some in your hand" offer and as the thing to give a volunteer on day one.

**7. Prayer that is already happening.** **Ten Days of Prayer** each January (ten consecutive nights, closing on a Sabbath) and the **Week of Prayer** in early November (eight nights). Frame them as *"the whole church is doing this in November; you can join from your kitchen"* — an open door with no cost and no exposure.

**8. Which conference, and the disclaimer.** Florida is covered by the Florida Conference, the Southeastern Conference and, in the western Panhandle, Gulf States — they overlap. Saying which one your church belongs to is a two-line credibility signal and it is a genuine open question in `PENDIENTES.md` §9.

### What not to add, and why

- **The flame/Bible/cross symbol, the word "official", or anything shaped like the church's wordmark.** BA 40 40 §4: no automatic licence for a lay group; permission is discretionary and revocable at any time, with or without cause. This is the only item on the page with legal exposure.
- **Conference events listed as if they were yours.** Camp Meeting, Campestre, Global Youth Day, Pathfinder Day, FC-LIFE, Disaster Response Training — real dates, someone else's events. Putting them in `FAM_EVENTS` claims work you did not do. `PENDIENTES.md` §9 already reaches the right conclusion: keep them as a planning table for the team, not as public listings.
- **All twenty-eight fundamental beliefs.** Eight is already more than most first visits need, and the accordion is currently eating the third screenful.
- **Prophecy charts, 1844, the mark of the beast, "the remnant".** Not because they are not held, but because they are the fourth conversation, not the first, and a stranger who meets them cold will read the whole page as an argument rather than an invitation.
- **Insider vocabulary** — Total Member Involvement, camporee, colporteur, canvassing, Investiture, magabook, AFCOE, Big Week. Every one of these is invisible to the audience. (Also: "Global Youth Day" is still its name; "Big Week" is retired — the live April dates are World Impact Day and Literature Evangelism Rally Week.)
- **NEWSTART and CHIP.** Real programmes, but neither is verified in the dossier and neither is what Florida Conference itself promotes. Do not publish a health programme you cannot deliver.
- **A registration wall on anything.** Across 119 Adventist evangelistic campaigns, most attendees never pre-registered at all, and the frictionless registration channel produced 5.9% follow-through against 45.3% for the high-friction one. Registration is a weak signal of intent and a strong deterrent. Offer "tell us you're coming" as an optional message; never as a gate.

---

## 4. THE SINGLE HIGHEST-IMPACT CHANGE

**Put a "someone near you" block directly beneath the hero, and make it the page's one primary action.**

One block, in the first screenful after the headline: a city select (reuse the 22 cities already in `sabbath.js` — they carry lat, lon and the correct IANA zone, including the four Panhandle cities on Central time), a language select, and one button. On selection it renders, in plain text: *this Friday's sunset for that city* (`sabbath.js` already computes it), the nearest congregation with its street address and a map link, and the name of the person who will meet you there. The button opens WhatsApp with the city and language already written into the message. Beneath it, one real photograph of the team.

Copy, ready to translate:

```json
{
  "en": {
    "near.eyebrow": "Wherever you are in Florida",
    "near.title": "Someone near you would be glad to meet you",
    "near.lead": "Choose your city and the language you would rather speak. We will tell you when the Sabbath begins where you live, where to go this Saturday, and the name of the person who will be waiting outside so you do not have to walk in alone.",
    "near.city": "Your city",
    "near.lang": "The language you would rather speak",
    "near.cta": "Tell me where to go",
    "near.sunset": "The Sabbath begins in {city} at {time} this Friday, and ends at {time2} on Saturday.",
    "near.person": "{name} is the person to ask in {city}. She speaks {langs}.",
    "near.none": "We do not have anyone in {city} yet, and we would rather tell you that than send you somewhere we do not know. Write to us anyway — we will find the nearest congregation in your language and someone will go with you.",
    "near.note": "Nothing is asked of you. You do not have to be a member, you do not have to dress a particular way, and nobody will ask you for money.",
    "wa.near": "Hello. I am in {city} and I would rather speak {lang}. Where should I go this Sabbath?"
  }
}
```

**Why this one.** Every other candidate improves the page; this one changes what the page is *for*. The site's whole traffic model is hand-to-hand: a missionary has a doorstep conversation and sends the link over WhatsApp. That visitor is not researching a denomination — they are deciding whether to meet a human being. Today the only decision-shaped moment on the page sits at 40.7% depth inside the Sabbath section, below where 81% of viewing time ever reaches, competing with ten equal-weight WhatsApp buttons. This lifts that one moment into the first screenful, reduces ten competing calls to action to one, answers the two questions a stranger actually arrives with — *when* and *where* — which the page currently never answers at all, and adds the one image class people demonstrably study. It reuses code already in the repo, needs no backend, no build step, no framework, and it degrades honestly: with no congregation data for a city, it says so and still opens the conversation.

It also does something the rest of the page cannot. A gospel section explains that Christ is near. This block puts a name, a street and a time under that claim — which is the moment a stranger stops reading about Jesus and starts walking towards Him with someone.

The runner-up, worth the following day: the four photographs. They are what make this block believable.

---

## Order of work today

1. **0:20** — Palette: nine token edits in `css/styles.css`, mirror the literals into `tools/test-contrast.js`, run it.
2. **0:20** — Move `#misiones` to position three; swap the `section-alt` class between it and `#ministerios`.
3. **1:30** — The near-you block: markup under the hero, `js/near.js` data file with whatever cities are verified, wire the city select to `window.FAM_SABBATH.cities` and `waLink()`. Demote the two hero buttons to `btn-ghost`.
4. **0:40** — Missions card deltas: photo above body, the practical block, `id="ev-<id>"`, new empty-state buttons.
5. **0:30** — `events.js` schema additions plus the five new field explanations in the header manual, in the volunteer's own words.
6. **0:20** — JSON-LD: `offsetFor()`, `location.name`, `inLanguage`, drop the redundant `endDate`.
7. **0:40** — `tools/patches/missions-2.json` + `near.json`, run `node tools/patch-i18n.js` for each, then `node tools/test-i18n.js`.
8. **0:10** — Footer disclaimer key.
9. **0:20** — `node tools/test-page.js && node tools/test-seo.js && node tools/test-loader.js`, then commit.

Authorship: Dr. Mauricio Rodríguez Herrera, no AI co-author trailer.

**Two things to settle with the group before any of this ships in nine languages:** who, by name and by region, has agreed to meet someone outside a congregation on a Sabbath; and which conference the group belongs to. Both are already open in `PENDIENTES.md`, and the near-you block is exactly the feature that turns those from paperwork into promises.