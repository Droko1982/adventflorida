Reviewed against the actual repo (`index.html` 1178 lines, `css/styles.css` 1438, `js/main.js` 853, and all eight harness files). The plan's audit numbers check out — 97 `.reveal`, exactly 17 on `.section-head`, `FAM_NEAR = {}`, `FAM_EVENTS = []`, `obs.unobserve` present. Change 0 is correct and is the only item that matters. Most of the rest has defects.

---

## 1. What would make the page worse / is cargo-cult

**IDEA 1, the four-way router — cut it, or reduce it to one line of text.**

Elevation's router routes to four *mutually exclusive products* (physical campus / live stream / watch party / pop-up). Yours routes to four anchors **in the document the reader is already inside**. That is not a router, it is a second table of contents duplicating the 8-link `.main-nav`, the `.mobile-nav`, and both `.footer-col`s. And card 1:

> `<a class="router-card" href="#cerca">` … *"Find a place near you"*

`#cerca` is at line 328, **the very next section under the hero**. You are adding a card to tell someone to scroll one screen.

Worse, it lands inside `.hero`, which on a phone already carries badge + h1 + lead + two buttons, and `.hero-art { display: none }` below 1060px. Four `.router-card`s at `padding: 22px` plus h3 plus 2–3 lines of copy is roughly **500–600px of new content above `#cerca`** — the router pushes the section it points at further away than it already was. The document also opens by criticising *"One maximal button, no exit for the unconvinced"* and then adds a fifth and sixth hero CTA.

If you want the idea, ship it as a chip row and no cards:

```html
<p class="router-line">
  <span data-i18n="first.lead">Four ways in, none of them costs anything:</span>
  <a href="#cerca"    data-i18n="first.1.b">find a place near you</a> ·
  <a href="#estudios" data-i18n="first.2.b">ask for a study</a> ·
  <a href="#cristo"   data-i18n="first.3.b">read about Jesus</a> ·
  <a href="#oracion"  data-i18n="first.4.b">send a prayer request</a>
</p>
```
```css
.router-line { margin-top: 26px; font-size: .95rem; color: var(--text-soft); }
.router-line a { color: var(--accent); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
```
That is 8 keys instead of 12, no new cards, no new IntersectionObserver targets, and it drops `first.3.b` — *"Read the five steps"* — which is internal jargon that leaks your own implementation detail at a stranger.

**IDEA 3's geolocation button — cut it outright, at least until `FAM_NEAR` is non-empty.**

Three problems, in order:

1. `nearestKey()` returns the nearest of 22 city keys **regardless of whether that key has data**. With `FAM_NEAR` holding the three or five cities Change 0 asks for, someone in Ocala presses *"Use my location"*, grants a location permission, and the page confidently selects `ocala` and then says *"We do not yet have a confirmed address for that city."* You have converted a passive miss into a personalised rejection. Minimum fix if you keep it:

```js
function nearestKey(lat, lon) {
  var pool = Object.keys(window.FAM_NEAR || {});
  if (!pool.length) return null;                    /* sin datos, no se adivina */
  var best = null, bestD = Infinity;
  for (var i = 0; i < pool.length; i++) {
    var c = CITY_LL[pool[i]]; if (!c) continue;
    var a = (c[0] - lat) * 111,
        b = (c[1] - lon) * 111 * Math.cos(lat * Math.PI / 180),
        d = a * a + b * b;
    if (d < bestD) { bestD = d; best = pool[i]; }
  }
  return best;
}
```
and render the button only when `Object.keys(window.FAM_NEAR).length` is truthy.

2. `var CITY_LL = { delray: [26.4615, -80.0728], miami: [25.7617, -80.1918] /* … */ };` — **this table already exists.** `js/sabbath.js:16-37` has all 22 with the identical coordinates (`{ id: "delray", name: "Delray Beach", lat: 26.4615, lon: -80.0728, tz: "America/New_York" }`). A second hand-maintained copy is a drift bug you are choosing to create. Export the existing one (`window.FAM_SUNSET` is already the export at `sabbath.js:180`) and read from it.

3. Product-level: a stranger who is nervous enough that the site's whole pitch is *"Sit at the back, say nothing, leave when you like"* is being asked, in the first screen of contact, to hand over their physical location. Hillsong can afford that; this page's entire proposition is that it does not ask you for anything.

**The amenity badges — keep `interp`, drop the rest.** `parking / transit / wheels / kids` is four booleans per city that a volunteer must verify and keep true. Publishing *Wheelchair Accessible* that turns out to be a flight of steps is a worse failure than saying nothing, and it is exactly the failure mode `near.js`'s own comment already legislates against: *"Solo pon un nombre si esa persona ya dijo que si."* `interp: ["ht"]` is the one badge that answers the question your nine-language audience actually has and the one a greeter can confirm from memory.

**The greeter photograph.** This is the best idea in the document and the one that needs the most care. `person: "Marie"` plus a face plus a street address plus a fixed Saturday time is a public disclosure about a volunteer — frequently a woman — who will be standing outside a building alone at a published hour. Ship it only with written consent per person, first name only, and make the default (no photo) read as normal rather than second-best. Add a schema field rather than assuming: `photo: "assets/cerca/marie.jpg"`, absent = no photo, and never fall back to a generic stock face.

**Ministries chip list.** `min.6.t` = *"Nine languages"* is not the buried fact the plan thinks. It is already in `hero.badge`'s neighbourhood, `contact.lead` (*"Write in any of our nine languages"*), `contact.langs` (`EN · ES · FR · HT · PT · DE · NL · RU · UK`), `footer.tag`, the meta description, the og description, and the JSON-LD `description`. Moving it into `#quienes` adds a seventh statement of the same fact, not a rescue.

---

## 2. CSS that is actually wrong

**2.1 — `.band-ink` on `#cristo` makes the gospel section unreadable in light mode. This is the worst bug in the document.**

```css
.band-ink { background: var(--deep); color: var(--deep-ink); }
```
`--deep-ink: #FFFFFF`. Inside that band sit five cards that keep their own light background — `styles.css:670` `.gospel-step { background: var(--surface); }` (`#FFFCF6`). And `styles.css:688` is `.gospel-step h3 { font-size: 1.4rem; margin-bottom: 10px; }` — **no `color`**. So every card heading inherits `#FFFFFF` and paints white on `#FFFCF6`: **1.02:1**. Card 5 is worse: `.gospel-step.is-response { background: var(--accent-soft); }` = `#FBEFD9`, also with inherited white.

Body text is a coin flip decided by source order, which is not a design: `.gospel-step p { color: var(--text-soft) }` (line 689) and `.band-ink p { color: inherit }` are both specificity `0,1,1`.

Fix — scope the ink band to the section's own chrome and re-anchor the cards:

```css
section.band-ink { background: var(--deep); color: var(--deep-ink); }
section.band-ink > .container > .section-head .section-lead,
section.band-ink > .container > .section-head .eyebrow { color: inherit; }
section.band-ink .section-head .eyebrow { opacity: .78; }
section.band-ink .section-head .section-lead { opacity: .9; }
/* Las tarjetas siguen siendo de papel: recuperan su color propio. */
section.band-ink .gospel-step { color: var(--text); }
section.band-ink .gospel-step p { color: var(--text-soft); }
```
Note `section.band-ink` (`0,1,1`), not `.band-ink` — see 2.2.

**2.2 — `.band-ink` never applies to `#contacto` at all, and the harness will not notice.**

`styles.css:1268` is `.contact { background: radial-gradient(820px 460px at 12% 0%, var(--accent-soft), transparent 60%), var(--bg); }`. `.contact` and `.band-ink` are both `0,1,0`, so whichever is later wins. The plan's rhythm block sits with `section { padding: 84px 0; }` at line 321 — 947 lines earlier. `#contacto` renders paper.

Meanwhile the plan's own replacement `banda()` reads `sec.classList.contains("band-ink")` and reports INK. `test-rhythm.js` would print `ok exactamente dos bandas de tinta` for a page with one. **The test is now asserting a class attribute, not a colour.** Fix: use `section.band-ink`, place the block after line 1274, and delete the gradient from `.contact` — otherwise your gradient count is 3 by claim and 3 by accident for the wrong reason.

**2.3 — `#contacto` as an ink band breaks its only secondary button and its whole meta row.**

`index.html:1087`: `<a class="btn btn-ghost btn-lg" href="tel:+17862392331" data-i18n="contact.call">Or call us</a>`. `.btn-ghost { border-color: var(--line-btn); color: var(--text); }` → `#22201C` on `#0F3B4C` ≈ **1.4:1**. The plan's `.gospel-cta .btn-ghost { border-color: currentColor; color: inherit; }` is scoped to `.gospel-cta` and does not reach it. `.contact-meta`'s three spans and the `.eyebrow::before` rule (`background: var(--accent)`, `#8A5D0D` on `#0F3B4C` ≈ 1.9:1) go the same way — and `#contacto`'s eyebrow is *not* inside `.section-head.center`, so `.section-head.center .eyebrow::before { display: none }` does not save it either.

```css
section.band-ink .btn-ghost { border-color: currentColor; color: inherit; }
section.band-ink .contact-meta,
section.band-ink .contact-meta span { color: inherit; opacity: .82; }
section.band-ink .eyebrow::before { background: currentColor; }
```

**2.4 — the `.js` reveal gate silently breaks printing.**

`styles.css:1435-1437`:
```css
@media print {
    .reveal { opacity: 1; transform: none; }
}
```
`.reveal` is `0,1,0`. The new `.js .reveal { opacity: 0 }` is `0,2,0`, and a media block adds no specificity. Today it works by source order; after the change the print rule loses and **every unrevealed block prints as a white rectangle**. Same trap in `@media print` at 1437 as in the plan's untouched print stylesheet.

```css
@media print {
    .reveal, .js .reveal { opacity: 1 !important; transform: none !important; }
}
```

**2.5 — the three spacing tiers are overridden on tablet and inverted on mobile.**

`styles.css:1401` `@media (min-width: 700px) and (max-width: 1060px) { section { padding: 72px 0; } }` and `1420` `@media (max-width: 620px) { section { padding: 62px 0; } }` are both `0,0,1`. `.band-compact { padding: 60px 0 }` is `0,1,0` and wins **at every width**, so on a phone "compact" is 60px against a 62px baseline — a 2px distinction — and `.band-anchor`'s `clamp(96px, 11vw, 128px)` sits at 96px on a 380px screen while its neighbours sit at 62px. The tiers must carry the same responsive curve:

```css
.band-anchor  { padding: clamp(72px, 11vw, 128px) 0; }
.band-compact { padding: clamp(40px, 6vw, 60px) 0; }
```

**2.6 — `.band-bound` is applied across a colour change in the pair the plan itself names.**

The band map says row 7 `#libro` PAPER and row 8 `#creencias` PAPER, "bound to 7". The Applied line says `<section class="section-alt band-bound band-compact" id="creencias">` — `section-alt` is `background: var(--bg-alt)`, i.e. RAISED. So `.band-bound { padding-top: 0 }` removes the top padding at exactly the point where the background changes colour, and then draws a 64px hairline *on top of* a hard band edge. Either drop `section-alt` from `#creencias` (matching the map) or drop `band-bound`. The same contradiction is in `<section class="section-alt band-bound band-compact" id="faq">`.

**2.7 — the plan's own cuts dissolve two of the four bound pairs.** Item 4's pairs are 4–5, 7–8, 11–12, 15–16. Item 5 deletes `#ministerios` (11) and moves `#donar` (15) to the end. `#misiones` keeps `.band-bound` and now binds to `#estudios`; `#faq` keeps it and now binds to `#recursos`; `#donar` ends up as the final section with **no band class assigned at all**, and the map's "two ink peaks, the centre and the close" no longer closes anything — `#contacto` INK is followed by `#donar` paper. Someone has to redraw the map after the cuts, and the plan doesn't.

I did run the sequence: with the classes as literally given, after both cuts, `maxRacha` is 2 and `tintas` is 2, so the rewritten assertions pass. They pass on a page whose ink bands don't paint (2.2) and whose bound pairs bind the wrong things.

**2.8 — small ones.**

`.gospel-verbs li::before { … height: 24px; border-radius: 999px; }` has no `width` and sits in a `26px` grid track with default `justify-self: stretch` — a 26×24 ellipse, not a circle. Add `width: 24px; justify-self: start;`.

`.study-body .study-tag { display: block; order: -1; }` — `order: -1` is dead code, because the plan's own HTML already moves `<span class="study-tag">` above `<h3>` in source. And `display: block` is a no-op: `.study-tag` is a flex item of `.study-body { display: flex; flex-direction: column }`, already blockified; `align-self: flex-start` at `styles.css:934` is what keeps the pill from going full width, and the new rule doesn't touch it. Delete both declarations, keep only `margin-bottom: 10px`.

`overflow-x: hidden; overflow-x: clip;` on `body` is **correct** and the MDN reasoning is right — `visible`/`clip` is the one compatible pair, so nothing blockifies and the sticky header stops depending on `html` having no `overflow`. `test-responsive.js:44` checks `/overflow-x:\s*hidden/`, which still matches. Ship it. One caveat the plan misses: `overflow: clip` clips at the padding box with `overflow-clip-margin: 0`, and `:focus-visible { outline: 3px solid var(--ring); outline-offset: 3px; }` at `styles.css:92` means a focus ring on any edge-adjacent element loses 3px on the right. Add `overflow-clip-margin: 6px;`.

---

## 3. The gospel rewrite

**3.1 — The rewrite deletes the word "sin" from the section, while claiming to add culpability.**

Current `christ.2.d` (`en.js`, and `es.js:63`): *"Every one of us has failed, hurt someone, and felt the distance. **The Bible calls it sin.** Naming it honestly is the first step towards being healed of it."*

Proposed: *"Not only the obvious wrongs. Every one of us decides for ourselves what is good and lives as though God were not there. The distance you feel is real, not imagined — **and the Bible is blunt about the price of it**."*

The plan's stated fault was that card 2 *"is agentless — it reads as circumstance, not culpability"*, and it approvingly quotes bibleinfo's *"Repent and confess your sins."* The rewrite then removes the only sentence in the section that names sin, and replaces a direct statement with a report *about* what the Bible says. It also removes *"Naming it honestly is the first step towards being healed of it"*, which is the one line in the card that gives the reader something to do. Keep the naming:

> **christ.2.d (en):** "Not only the obvious wrongs. Every one of us decides for ourselves what is good and lives as though God were not there. The Bible calls that sin, and it does not soften what it costs: the distance you feel is real, not imagined. Naming it honestly is where healing starts."

**3.2 — "God did not send someone else. He came." is modalism, and it is worse in Spanish.**

Proposed `christ.3.t` (es): *"Dios no mando a otro. Vino Él."* and `christ.3.d`: *"Jesus no es un buen maestro que Dios envio para no venir Él mismo."*

The Bible's own grammar is that the Father **sent** the Son — John 3:17, Galatians 4:4, 1 John 4:10 (which this very section already cites in `christ.1.r`). Fundamental Belief 4 says *God the eternal Son became incarnate in Jesus Christ*, which is a statement about one Person of the Trinity, not about the Godhead arriving undifferentiated. "God did not send someone else, He came" denies the sending, and in Spanish *"Vino Él"* reads unambiguously as *the Father* came. That is patripassianism, and it is a claim a lay group has no business making in nine languages on a public page. It is also unnecessary — the point being made (Jesus is God, not a delegate) survives without it:

> **christ.3.t (en):** "God did not send a stand-in. He came Himself, as one of us."
> **christ.3.t (es):** "Dios no envió a un sustituto. Vino Él mismo, como uno de nosotros."
> **christ.3.d (en):** "Jesus is not a good teacher God sent instead of getting involved. He is God the Son, in person, in a body. He lived the life we could not live, and at the cross He took the death that was ours. Three days later He walked out of the grave. Salvation is a gift you receive, never a wage you earn."

**3.3 — the rewrite deletes John 3:16 and the grace clause.**

`christ.3.r` goes from *"Ephesians 2:8-9 · John 3:16"* to *"John 1:14 · Ephesians 2:8-9"*. John 3:16 is the one reference a stranger in any of your nine languages may already recognise; the plan's own argument is that unlabelled citations *"read as insider signalling to someone who does not know what 'Romans 3:23' is."* Removing the recognisable one and adding John 1:14 moves in the wrong direction. Use three: `John 1:14 · John 3:16 · Ephesians 2:8-9`.

More serious, `christ.3.d` currently ends *"La salvación es un regalo que se recibe, jamás un salario que se gana"* / *"Salvation is a gift you receive, never a wage you earn."* The rewrite replaces it with *"That is why there is nothing left to pay."* Adventists get accused of legalism more than any other charge; that sentence is the page's standing pre-emptive answer to it, in the one section where it lands. Do not trade it for a metaphor about debt. Restored above.

**3.4 — card 5 completes the transaction and then leaves the reader nowhere.**

`christ.5.d`: *"Thank Him. You are His child from that moment, and nothing you feel tomorrow undoes it."* Read narrowly (feelings only) that is defensible and I would keep it. But the four verbs are the entire response, and nothing in them or in the CTA mentions the two things this group's own model rests on: a person to walk with, and baptism. The current copy carries it — *"and then let us walk with you"* — and the rewrite drops it in favour of *"nobody has to be watching"*. Combined with CUT 3 (deleting the find-a-church link) and `FAM_NEAR = {}`, a reader who finishes card 5 has literally no next step on the page.

Add a fifth verb rather than a doctrine paragraph:

> **christ.5.e (en):** "Do not do it alone. Tell one person — us, if you have nobody else. When you are ready, the Bible's own next step is baptism, and there is no hurry about it."
> **christ.5.e (es):** "No lo hagas a solas. Cuéntaselo a alguien; a nosotros, si no hay nadie más. Cuando estés listo, el paso siguiente que da la Biblia es el bautismo, y no hay ninguna prisa."

**3.5 — the button label change is backwards.**

The plan writes: *"I would also change the label. 'Give your life to Jesus' is my judgement, not a research finding."* That is the **heading** (`christ.cta.t`, *"Would you like to give your life to Jesus?"*). The actual button today is `christ.cta.btn`: **"I want to know Jesus"** / *"Quiero conocer a Jesús"*. The rewrite replaces it with *"I want to start following Jesus"* — a strictly **higher** commitment than "know". The plan diagnosed a cliff and then raised it. Change the heading, keep the button:

> **christ.cta.t (en):** "So — where does that leave you?"
> **christ.cta.btn (en):** "I want to know Jesus" (unchanged)
> **christ.cta.btn2 (en):** "I have questions first"

**3.6 — what the current version got right that the rewrite loses.** *"You do not need special words or a perfect life. Talk to Him honestly, right where you are"* already does the disarming work the plan credits to Got Questions, in half the words, and it does it *before* the ask rather than in a separate `.gospel-disarm` paragraph the reader meets after. Fold `christ.cta.disarm` into it rather than adding a third paragraph to a CTA that already has two.

---

## 4. Motion — where the plan fails its own standard

**4.1 — deleting the universal reset re-enables five things the plan promised to remove, including the worst one.**

The plan lists exactly what to suppress. Grepping every transform in `styles.css` against that list, these survive under `prefers-reduced-motion: reduce`:

- **`styles.css:303-306` — `.mobile-nav { position: fixed; inset: 0; transform: translateX(100%); transition: transform var(--t-slow) var(--ease); }` / `.mobile-nav.is-open { transform: translateX(0); }`.** A **full-viewport panel sliding horizontally across the screen for 450ms**. That is WebKit's "peripheral horizontal motion" and it is by far the largest moving area on the site. The current `*, *::before, *::after { transition-duration: .01ms !important }` kills it today. The replacement does not mention `.mobile-nav` at all. This is a straight vestibular regression, and on mobile it is the *only* way to reach the navigation.
- `styles.css:1346` `.wa-float:hover { transform: scale(1.08); }` — the plan removes the pulse ring because *"scaling is on WebKit's list"*, then leaves the button's own scale.
- `styles.css:580` `.st-card:hover .st-thumb img { transform: scale(1.04); }`
- `styles.css:596` `.st-card:hover .st-play { transform: translate(-50%,-50%) scale(1.1); }`
- `styles.css:654` `.video-facade:hover .video-play { transform: scale(1.09); }`

Also missing from the list but minor: `styles.css:241` `.icon-btn:hover { transform: translateY(-1px) }` and `1318` `.socials a:hover { transform: translateY(-2px) }`.

Corrected block:

```css
@media (prefers-reduced-motion: reduce) {
    /* Se quita el desplazamiento. El fundido se queda: es lo
       que le dice al lector que algo aparecio. */
    .js .reveal { transform: none; transition: opacity var(--t-base) var(--ease-out); }

    /* Lo peor de la pagina para un oido sensible: un panel del
       tamano de la pantalla entera cruzando en horizontal. */
    .mobile-nav { transition: none; }

    /* Levantamientos, deslizamientos y ESCALADOS al pasar por
       encima: fuera la distancia, se quedan color y borde. */
    .value-card:hover, .study-card:hover, .min-card:hover,
    .ev-card:hover, .st-card:hover, .res-card:hover,
    .sab-why article:hover, .gospel-step:hover, .router-card:hover,
    .btn:hover, .btn:active, .icon-btn:hover, .socials a:hover,
    .wa-float:hover,
    .res-card:hover .arrow,
    .st-card:hover .st-thumb img,
    .st-card:hover .st-play,
    .video-facade:hover .video-play { transform: none; }
    .st-card:hover .st-play { transform: translate(-50%, -50%); }

    /* El anillo que crece alrededor del boton de WhatsApp es
       un escalado: fuera. */
    .wa-float::after { animation: none; }
}
```
(The `.st-play` line must come after, because its resting state *is* a transform — `transform: none` would drop it out of centre.)

**4.2 — `animation: wa-pulse 2.4s var(--ease-out) 2` complies with 2.2.2 but only just, and it is the wrong lever.** 4.8s against a 5s threshold with no margin. The honest fix is one iteration on load (`… 1`), or `.wa-float::after { animation: wa-pulse 2.4s var(--ease-out) 2; }` gated behind `@media (prefers-reduced-motion: no-preference)` so it never runs for the affected user at all rather than running twice.

**4.3 — the pause button has a permanently wrong accessible name, and defines a key it never uses.**

```html
<button class="verse-pause" id="versePause" type="button"
        aria-pressed="false" data-i18n-aria="a11y.versePause">⏸</button>
```
`main.js:79-80` maps `data-i18n-aria` → `aria-label`. The handler flips `aria-pressed` and `textContent` but never the label, so a screen-reader user hears "Pause, pressed" forever. And `a11y.verseResume` is declared as a new key and used nowhere — see §5 for why that alone fails the harness.

```js
  var versePaused = false;
  function wireVersePause() {
    var b = $("#versePause");
    if (!b) return;
    function paint() {
      b.setAttribute("aria-pressed", versePaused ? "true" : "false");
      b.setAttribute("aria-label", t(versePaused ? "a11y.verseResume" : "a11y.versePause"));
      b.textContent = versePaused ? "▶" : "⏸";
    }
    b.addEventListener("click", function () {
      versePaused = !versePaused;
      paint();
      if (versePaused) { clearInterval(verseTimer); verseTimer = null; }
      else restartVerses();
    });
    paint();
  }
```
Then remove `data-i18n-aria` from the markup (the JS owns the label now) and add `"a11y.versePause"` **and** `"a11y.verseResume"` to `PREFIJOS_JS` in `test-i18n.js` — or, simpler, add the prefix `"a11y.verse"`.

One more: the plan keeps `restartVerses()`'s early return under `prefers-reduced-motion`. Correct — but then the pause button renders as ⏸ over a carousel that is not moving, and pressing it does nothing. Hide it: `@media (prefers-reduced-motion: reduce) { .verse-pause { display: none; } }`.

**4.4 — 3.3 smooth-scroll gating is correct.** `html { scroll-behavior: auto }` plus a `no-preference` override is the right shape and I'd ship it as written. `main.js` uses no `scrollIntoView({behavior:"smooth"})`, so there is no JS path to also gate.

**4.5 — the `content-visibility` list contains a section whose content is measured.** `#sabado` runs the sunset clock and `#misiones` runs a tab UI that renders and re-renders card lists. The plan's own warning — *"any code calling `offsetHeight` / `getBoundingClientRect` / `getComputedStyle` into one of those subtrees defeats the optimisation entirely"* — applies to the two sections most likely to do it. Drop `#sabado` and `#misiones` from the selector list and ship the other eight.

---

## 5. Cuts that are load-bearing

**CUT 4 — "hide the section (`hidden` attribute plus a `null` pass on `mis.*`)" hard-fails `test-page.js`.** Two named assertions:

```js
comprobar(!!sel("#misUpcoming .mis-empty"), "estado vacio", txt("#misUpcoming .mis-empty h3"));
```
and, in the nine-language loop:
```js
const t2 = txt('[data-i18n="mis.title"]');
comprobar(t1 !== "sab.title" && t2 !== "mis.title", code, …);
```
Nulling `mis.title` makes `t()` return the key, the element's textContent becomes the literal string `"mis.title"`, and the loop fails nine times. It also trips the final sweep:
```js
const crudas = [...window.document.querySelectorAll("[data-i18n],[data-i18n-html]")]
  .filter((e) => /^[a-z]+(\.[a-zA-Z0-9]+)+$/.test(e.textContent.trim()))
```
`test-i18n.js` will *not* catch this, because `mis.title`, `mis.lead`, `mis.empty*` are all whitelisted in `SOLO_JS` / `PREFIJOS_JS`. So the plan's claim that *"the first two will fail loudly if you got the patch wrong"* is exactly wrong here — i18n passes green and page four goes red. **Add `hidden`, change nothing in the dictionaries.**

**CUT 3 — deleting `res.5` before Change 0 lands removes the site's only working path to a congregation.** The plan's own reasoning gives the condition away: *"Once Change 0 is done, this card competes with the best thing on the page."* Today `FAM_NEAR = {}` and Change 0 asks for **three to five** cities. `test-page.js` asserts `sel("#nearCity").options.length === 22`. So after Change 0 there are still seventeen-plus Florida cities where `adventist.org/find-a-church/` is the only answer the site can give, and the plan is deleting it. Gate the cut: `res.5` goes when `FAM_NEAR` covers the city list, not before, and until then it belongs *inside* `#cerca`'s empty state, not in `#recursos`:

> **near.empty (en):** "We do not yet have a confirmed address for that city, and we would rather say so than send you to the wrong door on a Saturday morning. Write to us and we will find out which congregation is closest to you and who can meet you there — or look it up yourself in the official directory."

**CUT 2 — deleting `#ministerios` leaves two dead anchors the harness will not flag.** `index.html:276` and `index.html:1143` both carry `<a href="#ministerios" data-i18n="nav.ministries">`. The plan only says to reorder the `#donar` links. `test-rhythm.js`'s `enOrden()` skips them silently:
```js
const i = orden.indexOf(id);
if (i === -1) continue;
```
and `nav.ministries` stays in the HTML so `test-i18n.js` sees no orphan. You get a nav link that scrolls nowhere and nothing tells you. Delete the two `<li>`s and null `nav.ministries` in the same patch. Also delete `.min-card` from `styles.css:1113`, from the `@media (pointer: coarse)` list at 1393, and from the reduced-motion list — otherwise the plan's own rules reference a class that no longer exists.

**CUT 1 — `#donar` must keep being a `<section>` and must get a band.** `test-rhythm.js` iterates `doc.querySelectorAll("section")` and bands every one. "Shrink it from a section band to a single card" is fine visually, but if it stops being a `<section>` it disappears from the band map and from `orden`, which breaks the nav-order check for `#donar` links in a different way. And the reorder is four places, not two: `.main-nav` (line 280 region), `.mobile-nav ul`, and **both** `.footer-col`s — `test-rhythm.js` checks each footer column separately.

**"Not cut, but moved: `#creencias`"** — it is not moved. It is already at position 8, directly after `#libro` at position 7 (`index.html:509` then `561`). *"Bind it under `#libro` where the band map puts it"* describes the order the file already has. Either say "no change" or actually move it below `#estudios`.

---

## 6. What the plan missed about nine languages

**6.1 — `.btn { white-space: nowrap }` plus sentence-length button labels will clip text in six of nine languages.** `styles.css:141`:

```css
.btn {
    …
    line-height: 1;
    white-space: nowrap;
}
```

The current labels are short by design — *"I want to know Jesus"*, *"Quiero conocer a Jesús"*. The plan replaces them with sentences: `christ.cta.btn2` = *"I have questions — I am not there yet"*, plus `studies.ask` / `studies.host` on four cards. In German that second door is roughly *"Ich habe Fragen — ich bin noch nicht so weit"*; in Russian longer again. With `white-space: nowrap`, `@media (max-width: 620px) { .gospel-doors .btn { width: 100% } }` does not help — the box is 100% wide and the text overflows it, then gets silently swallowed by `body { overflow-x: hidden }`. `test-responsive.js:44` will report green while Dutch readers see a truncated button.

```css
.gospel-doors .btn,
.study-doors .btn,
.router-card .btn { white-space: normal; line-height: 1.25; text-wrap: balance; }
@media (max-width: 620px) { .gospel-doors .btn, .study-doors .btn { width: 100%; } }
```
And keep door 2 short — `christ.cta.btn2` should be **"I have questions first"** / *"Primero tengo preguntas"*, not a clause with an em dash.

**6.2 — the CE-shape `study-tag` becomes a three-line all-caps block in German and Russian.** `styles.css:932-938`:
```css
.study-tag {
    font-size: .73rem; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
```
*"12 lessons · Who God is and why the world hurts · 9 languages"* is already 58 characters in English. German runs ~35% longer, Cyrillic uppercase is wider per glyph, and `.08em` tracking multiplies both. Uppercase also degrades Cyrillic and Haitian-Creole legibility. Split the commitment line into three chips and drop uppercase for the middle one:

```html
<span class="study-tag"><b data-i18n="studies.1.n">12</b> <span data-i18n="studies.lessons">lessons</span></span>
<span class="study-sub" data-i18n="studies.1.about">Who God is and why the world hurts</span>
```
```css
.study-sub { display: block; order: -1; font-size: .8rem; color: var(--text-soft); margin-bottom: 8px; }
```
This also cuts the translation bill: `studies.lessons` is one word translated nine times instead of four full sentences.

**6.3 — gendered adjectives. The Spanish patch misgenders the reader in the message she sends you.**

```json
"wa.questions": "Hola. He leido lo de Jesus en su pagina y no estoy convencido, pero me gustaria hacer algunas preguntas."
```
*"no estoy convencido"* is masculine. Half your readers will send you a WhatsApp message that misgenders them, in a first contact, in the message *you* wrote for them. Same problem in `christ.5.d`: *"Desde ese momento eres su hijo."* Portuguese has it too; French, Dutch, German, Russian, Ukrainian and Haitian Creole each differ. Genderless rewrites:

```json
"wa.questions": "Hola. He leído lo de Jesús en su página y todavía tengo dudas, pero me gustaría hacer algunas preguntas. Sin compromiso.",
"christ.5.d": "Dale las gracias. Desde ese momento perteneces a su familia, y lo que sientas mañana no lo deshace."
```
Add a rule to the patch process: **no first-person adjective in any `wa.*` string.** They are the only strings the *user* speaks rather than reads, and they are the ones that must be gender-neutral in every language.

**6.4 — the Spanish in the patch is unaccented, and the existing dictionary is not.** `es.js` is fully accented — `"christ.title": "Jesucristo: guía, salvador y amigo"`, `"christ.1.d": "…la versión de ti que lo tiene todo resuelto…"`, `"christ.4.t": "Él va a volver por ti"`. The patch writes `"Tu parte es pequena"` (→ **pequeña**), `"lo que sientas manana"` (→ **mañana**; *manana* is not a word), `"¿en que te deja esto?"` (→ **qué**), plus *mando, envió, vivió, cargó, días, después, última, Pídele, Déjale*. `patch-i18n.js`'s `jsString()` only escapes `\`, `"` and `\n` — UTF-8 passes through untouched, so there is no tooling reason for this. Shipping it would visibly degrade the language of the largest audience this page has in Florida.

**6.5 — nobody priced the translation.** `en.js` holds 402 keys and `index.html` uses 372. The plan adds roughly 34 new keys (`christ.5.*`, `christ.refLabel`, `christ.cta.*`, `first.*`, `studies.ask/host`, `near.geo*`, `a11y.verse*`, badge labels) and nulls another ~15 (11 eyebrows, several leads, `min.*`, `mis.*`, `res.4/5`). At nine languages that is **~300 new strings plus ~135 deletions**, for a lay volunteer group, in a single patch file that must land atomically or `test-i18n.js`'s parity check fails. The repo already has the answer to this and the plan ignores it: `js/events.js` documents a `lang:` field precisely so *"nadie espera que un voluntario traduzca nueve veces."* Sequence the copy work — `christ.*` first, `first.*` never, badges last — and use the existing single-language convention for anything that is not the gospel section.

**6.6 — `contain-intrinsic-size: auto 900px` is a per-language guess.** With ±40% text-length variance the placeholder is wrong by hundreds of pixels in German and Russian, and the scrollbar behaviour the plan warns about arrives anyway. `auto` (the keyword prefix) caches the real size after first render, so this is mostly self-correcting after one pass — but the first cold scroll in the longest language is the worst one. Not a blocker; worth measuring in `de` and `ru`, not `en`.

---

## Two harness claims in the plan that are wrong

**"≤ 4 distinct transition durations… do not add a fifth duration."** `test-rhythm.js` measures literal time values *inside `transition:` shorthands*:
```js
const duraciones = (css.match(/transition:[^;]*/g) || [])
  .flatMap(t => t.match(/\d*\.?\d+m?s/g) || []);
```
Every transition in `styles.css` uses `var(--t-*)`. Grepping the file returns **zero** literal durations, so `distintas.length === 0` and the assertion passes vacuously. Adding a fifth `--t-*` token would not fail it; writing one literal `transition: opacity .3s ease` would start populating it. Retuning `--t-reveal` from `.6s` to `.32s` is a good change on the Material argument alone — just don't justify it with a constraint that isn't enforced.

**Orphan keys.** `test-i18n.js` will fail on **`a11y.verseResume`**, **`near.geo`**, **`near.geoOff`** and **`near.empty`** the moment they land, because the orphan filter is:
```js
const huerfanas = enKeys.filter(k =>
  !keys.has(k) && !SOLO_JS.includes(k) && !OPCIONALES.includes(k) &&
  !PREFIJOS_JS.some(p => k.startsWith(p)));
```
`PREFIJOS_JS` contains `"near.church"`, `"near.time"`, `"near.person"`, `"near.none"`, `"near.sunsetLine"`, `"near.mapLink"` — but not `"near.geo"` or `"near.empty"`, and nothing for `a11y.`. Any key rendered only from JS needs a `PREFIJOS_JS` entry in the same commit. Add `"near.geo"`, `"near.empty"`, `"a11y.verse"`.

---

## Verdict

Ship: **Change 0** (unchanged), **3.1** reveal-off-section-heads and the `.js` gate (with the print fix in 2.4), **3.2** as corrected in 4.1, **3.3** as written, **3.4b** verse pause as corrected in 4.3, **3.5** both halves, **3.6**'s "add nothing" findings, **CUT 5**.

Rewrite before shipping: the gospel section (3.1–3.6 above), the whole `.band-ink` mechanism (2.1–2.3), the spacing tiers (2.5), the bound pairs (2.6–2.7), every new button's wrapping (6.1), and the Spanish (6.3–6.4).

Cut from the plan: the four-way router as cards, the geolocation button, three of the five amenity badges, the `null` pass on `mis.*`, and the `res.5` deletion until `FAM_NEAR` is populated.