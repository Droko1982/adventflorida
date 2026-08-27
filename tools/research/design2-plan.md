# CHANGE LIST — Florida Advent Missionaries

For one developer. Ordered by leverage. Everything here is static HTML/CSS/vanilla JS, no build, no npm, no photographs, WhatsApp-only contact. Every copy change ships as a `tools/patches/*.json` run through `tools/patch-i18n.js`.

**Two harness rules that constrain every item below** (I read the tests, not just the README):

- `tools/test-i18n.js` fails on **missing keys in any of the 9 languages** *and* on **orphan keys** (defined but no longer used in HTML). So: every new key must land in all nine dictionaries in the same patch, and every key whose HTML you delete must be set to `null` in the same patch.
- `tools/test-rhythm.js` asserts **no two consecutive sections share a background band**, **≤ 4 radial-gradient sections**, **≤ 4 distinct transition durations**, **no `transition: all`**, **≤ 16 box-shadow transitions**, **≤ 1 infinite animation**, and **nav/footer link order must match DOM section order**. Items 4 and 5 require edits to that file; they are specified.

---

## CHANGE 0 — The two empty data files. Do this before anything else.

`js/near.js` ships `window.FAM_NEAR = {};` and `js/events.js` ships `window.FAM_EVENTS = [];`.

Two of the seventeen sections are therefore promises that resolve to nothing:

- `#cerca` says *"where to go this Saturday, and the name of the person who will be waiting outside so you do not have to walk in alone."* There is no city with data behind it.
- `#misiones` renders tabs for upcoming/past events over an empty array.

Nothing else on this list matters as much. A stranger who follows the site's single most specific promise currently reaches a dead end, and the page's whole credibility rests on lines like *"No cost, no pressure, no obligation."*

**Do:** populate **three to five** cities in `js/near.js` — the ones where a named person has actually said yes. The schema in that file is already correct (`church`, `address`, `map`, `time`, `langs`, `person`). Three real cities beat twenty-two guessed ones. Same for `events.js`: one real dated event beats an empty tab set.

**Until they are populated**, the empty-state copy has to stop over-promising. Patch `near.lead` and add an explicit empty-state string rather than letting the section imply data that is not there. (Copy in the patch at the end of item 2.)

One optional exception to the zero-photograph rule, and the only place I would make it: a small photo of the greeter named in `person`. A face at the moment a stranger is deciding whether to walk into a room alone is the one photograph that does work no illustration can do. It is a photo the team can actually take. Everything else on this page should stay illustrated.

---

## 1. THE GOSPEL SECTION (`#cristo`)

### Verdict: keep the spine, keep card 4, fix cards 2 and 3, add the reader's step, and replace the single button with two doors.

**What is right, and should not be touched.**

The order — love → brokenness → cross → response — is the same shape as Cru's four principles (*"God loves you and offers a wonderful plan for your life"* → *"All of us sin, and our sin has separated us from God"* → *"Jesus Christ is God's only provision for our sin"* → *"We must individually receive Jesus Christ as Savior and Lord"*) and Billy Graham's four steps (God's Purpose → The Problem → God's Remedy → Our Response). You are not doing anything eccentric. Four cards is also the right count: Two Ways To Live needs six and its own author says the outline *"aren't the words that we would actually speak"* but *"the skeleton that we would flesh out in conversation"* — it needs a trained explainer. Four cards is scannable on a phone.

Card 4 — *"He is coming back for you"*, Revelation 21:4 — is the best thing in the section. Cru, Graham, Got Questions and bibleinfo.com all terminate at personal forgiveness; the story stops at the reader's soul. Ending on a restored world is distinctive among decision presentations and it is the least jargon-loaded card on the page. (It is not unprecedented — Got Questions closes on Revelation 21:3 and BibleProject's whole gospel explainer is about God's kingdom coming to Earth — so keep it, but don't let anyone write marketing copy claiming it's unique.) **Keep card 4 exactly as it is.**

The headlines are also in plain human English, which most of the field is not. Keep that voice.

**Three things that are actually wrong.**

**(a) All four cards are things God does. The reader never moves inside the outline, and then the button asks for everything at once.** Compare: Cru's principle 4 is *"We must individually receive Jesus Christ as Savior and Lord"* — a reader action, inside the outline. Two Ways To Live's point 6 is the reader's fork, inside the outline. bibleinfo.com's response section is four verbs the reader performs: *"Receive Jesus' death for your sins. / Repent and confess your sins. / Receive Jesus' life. / Rejoice, for you are now a child of God!"* Every comparator builds a ramp. This section builds a cliff. **Fix: add a fifth block that is the reader's step, spanning the full grid row.**

**(b) The section never says who Jesus is, so card 3 collects on a debt the page has not itemised.** Christianity Explored's entire architecture is *Who is Jesus?* → *Why did he come?* → *What does that mean for us?* — identity before mission before call — because "Jesus paid" is meaningless until you know who is paying. Talking Jesus 2022 (Savanta ComRes, ~4,000 UK adults) measures the consequence: **only 20% think Jesus is God in human form**. Four in five readers arrive without the premise card 3 assumes. Separately, card 2's *"Something is broken"* is agentless — it reads as circumstance, not culpability — so card 3's "paid" has no amount. Two Ways To Live carries a separate third point, *"God's punishment for rebellion is death and judgement"*, for exactly this reason. **Fix: card 2 names the action and the price; card 3 opens with identity.**

**(c) One maximal button, no exit for the unconvinced.** Both majors that ask for a decision fork afterwards. Graham: *"Did you pray to receive Jesus Christ and begin a relationship with him?"* → **"Yes, I prayed"** / **"No, but I have questions."** Cru: *"Does this prayer express the desire of your heart?"* → **"Yes I asked Jesus into my Life!"** / **"I'd like to ask some questions!"** Two independent presentations, same pattern. Right now the page has one exit for a willing reader and zero for an interested one. Barna (*Reviving Evangelism*, in partnership with Alpha USA, n=992 practising Christians / n=1,001 non-practising, May 2018): **50% of non-Christians and lapsed Christians want someone who "does not force conclusions"; only 26% see it.** A single maximal button is forcing a conclusion.

I would also change the label. "Give your life to Jesus" is my judgement, not a research finding — but note that no comparator uses it. Graham's own prayer says *"I want to turn from my sins"* and *"follow Him as my Lord from this day forward."* "Follow" is the mainstream word and it is one a stranger already owns.

**Two smaller wins, both free.**

- **Label the verse references.** Two Ways To Live prints its citations under each point beneath the words *"How the Bible puts it:"*. Yours already sit under the point (right place) but unlabelled, which reads as insider signalling to someone who does not know what "Romans 3:23" is. One label fixes it.
- **Disarm the ask.** Got Questions hands the reader a prayer and then says plainly that *"saying this prayer, or any other prayer, will not save you. It is only trusting in Christ that can save you from sin."* On a page whose FAQ opens with *"Is everything really free?"*, that move is on-brand and buys real credibility.

### Replacement HTML for `#cristo`

```html
<section class="gospel" id="cristo">
  <div class="container">
    <div class="section-head center">
      <span class="eyebrow" data-i18n="christ.eyebrow">The heart of everything</span>
      <h2 class="section-title" data-i18n="christ.title">Jesus Christ — guide, Saviour and friend</h2>
      <p class="section-lead" data-i18n="christ.lead">Before any doctrine, any church and any tradition, there is a Person. Everything we believe grows out of what He did for us. If you take away only one thing from this page, let it be Him.</p>
    </div>

    <div class="gospel-steps">
      <article class="gospel-step reveal">
        <div class="gospel-num">01</div>
        <h3 data-i18n="christ.1.t">God already loves you</h3>
        <p data-i18n="christ.1.d">Not the version of you that has everything together — you, today, exactly as you are. His love came first, before you ever looked for Him.</p>
        <span class="gospel-reflab" data-i18n="christ.refLabel">How the Bible puts it</span>
        <span class="gospel-ref" data-i18n="christ.1.r">Jeremiah 31:3 · 1 John 4:10</span>
      </article>

      <article class="gospel-step reveal">
        <div class="gospel-num">02</div>
        <h3 data-i18n="christ.2.t">We run our own lives, and it costs us</h3>
        <p data-i18n="christ.2.d">Not only the obvious wrongs. Every one of us decides for ourselves what is good and lives as though God were not there. The distance you feel is real, not imagined — and the Bible is blunt about the price of it.</p>
        <span class="gospel-reflab" data-i18n="christ.refLabel">How the Bible puts it</span>
        <span class="gospel-ref" data-i18n="christ.2.r">Romans 3:23 · Romans 6:23</span>
      </article>

      <article class="gospel-step reveal">
        <div class="gospel-num">03</div>
        <h3 data-i18n="christ.3.t">God did not send someone else. He came.</h3>
        <p data-i18n="christ.3.d">Jesus is not a good teacher God sent instead of coming Himself. He is God, in person, in a body. He lived the life we could not live, and at the cross He took the death that was ours. Three days later He walked out of the grave. That is why there is nothing left to pay.</p>
        <span class="gospel-reflab" data-i18n="christ.refLabel">How the Bible puts it</span>
        <span class="gospel-ref" data-i18n="christ.3.r">John 1:14 · Ephesians 2:8-9</span>
      </article>

      <article class="gospel-step reveal">
        <div class="gospel-num">04</div>
        <h3 data-i18n="christ.4.t">He is coming back for you</h3>
        <p data-i18n="christ.4.d">This world is not the end of the story. Jesus promised to return, wipe away every tear and make all things new. That hope is why we are called Adventists.</p>
        <span class="gospel-reflab" data-i18n="christ.refLabel">How the Bible puts it</span>
        <span class="gospel-ref" data-i18n="christ.4.r">John 14:1-3 · Revelation 21:4</span>
      </article>

      <article class="gospel-step is-response reveal">
        <div class="gospel-num">05</div>
        <h3 data-i18n="christ.5.t">Your part is small, and it is yours</h3>
        <p data-i18n="christ.5.lead">Four things. Not one of them is a ceremony, and nobody has to be watching.</p>
        <ol class="gospel-verbs">
          <li data-i18n="christ.5.a">Tell God the truth about yourself. He already knows. Saying it is for you, not for Him.</li>
          <li data-i18n="christ.5.b">Ask Him to forgive you — not so that He will love you, but because He already does.</li>
          <li data-i18n="christ.5.c">Let Him have the say over your life from today. This is the part that costs something, and we would rather tell you now than after you have started.</li>
          <li data-i18n="christ.5.d">Thank Him. You are His child from that moment, and nothing you feel tomorrow undoes it.</li>
        </ol>
        <span class="gospel-reflab" data-i18n="christ.refLabel">How the Bible puts it</span>
        <span class="gospel-ref" data-i18n="christ.5.r">1 John 1:9 · John 1:12</span>
      </article>
    </div>

    <div class="gospel-cta reveal">
      <h3 data-i18n="christ.cta.t">So — where does that leave you?</h3>
      <p data-i18n="christ.cta.d">Two honest answers, and we mean both of them. Whichever one you pick, the same person reads it and writes back to you in your language.</p>
      <p class="gospel-disarm" data-i18n="christ.cta.disarm">There are no magic words. A prayer does not save anybody — Jesus does. Say it out loud or under your breath, in your own language, in your own words. Nobody is grading it.</p>
      <div class="gospel-doors">
        <a class="btn btn-primary btn-lg" href="#" data-wa="decision" data-i18n="christ.cta.btn">I want to start following Jesus</a>
        <a class="btn btn-ghost btn-lg" href="#" data-wa="questions" data-i18n="christ.cta.btn2">I have questions — I am not there yet</a>
      </div>
      <p class="gospel-quiet"><a href="#libro" data-i18n="christ.cta.quiet">Not ready to write to anyone? Read the little book first. Nobody will know you did.</a></p>
    </div>
  </div>
</section>
```

Note the `.reveal` class is **gone from `.section-head`** — see item 3.

### CSS additions for `#cristo`

```css
/* La quinta tarjeta es la del lector: ocupa la fila entera
   para que se lea como un paso distinto, no como un quinto dato. */
.gospel-step.is-response {
    grid-column: 1 / -1;
    background: var(--accent-soft);
    border-color: var(--accent);
}
.gospel-verbs {
    list-style: none;
    counter-reset: verbo;
    display: grid;
    gap: 12px;
    margin: 18px 0 20px;
}
.gospel-verbs li {
    counter-increment: verbo;
    display: grid;
    grid-template-columns: 26px 1fr;
    gap: 12px;
    align-items: start;
}
.gospel-verbs li::before {
    content: counter(verbo);
    font-weight: 700;
    font-size: .82rem;
    line-height: 24px;
    text-align: center;
    color: var(--accent-ink);
    background: var(--accent);
    border-radius: 999px;
    height: 24px;
}
@media (min-width: 860px) {
    .gospel-verbs { grid-template-columns: 1fr 1fr; column-gap: 30px; }
}

/* Las referencias, etiquetadas. Un desconocido no sabe que es
   "Romanes 3:23" si nadie se lo dice. */
.gospel-reflab {
    display: block;
    margin-top: 18px;
    font-size: .68rem;
    font-weight: 700;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--text-soft);
}

/* Dos puertas, no una. */
.gospel-doors {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
}
.gospel-cta .btn-ghost {
    border-color: currentColor;
    color: inherit;
}
.gospel-disarm {
    font-size: .92rem;
    opacity: .78;
    max-width: 58ch;
    margin: 0 auto 26px;
}
.gospel-quiet { margin-top: 20px; font-size: .88rem; }
.gospel-quiet a { text-decoration: underline; text-underline-offset: 3px; opacity: .8; }
@media (max-width: 620px) {
    .gospel-doors .btn { width: 100%; }
}
```

### Patch file — `tools/patches/gospel-2doors.json`

English and Spanish below. **The remaining seven (`fr ht pt de nl ru uk`) must be in the same file before you run it**, or `test-i18n.js` fails on key parity.

```json
{
  "en": {
    "christ.refLabel": "How the Bible puts it",
    "christ.2.t": "We run our own lives, and it costs us",
    "christ.2.d": "Not only the obvious wrongs. Every one of us decides for ourselves what is good and lives as though God were not there. The distance you feel is real, not imagined — and the Bible is blunt about the price of it.",
    "christ.2.r": "Romans 3:23 · Romans 6:23",
    "christ.3.t": "God did not send someone else. He came.",
    "christ.3.d": "Jesus is not a good teacher God sent instead of coming Himself. He is God, in person, in a body. He lived the life we could not live, and at the cross He took the death that was ours. Three days later He walked out of the grave. That is why there is nothing left to pay.",
    "christ.3.r": "John 1:14 · Ephesians 2:8-9",
    "christ.5.t": "Your part is small, and it is yours",
    "christ.5.lead": "Four things. Not one of them is a ceremony, and nobody has to be watching.",
    "christ.5.a": "Tell God the truth about yourself. He already knows. Saying it is for you, not for Him.",
    "christ.5.b": "Ask Him to forgive you — not so that He will love you, but because He already does.",
    "christ.5.c": "Let Him have the say over your life from today. This is the part that costs something, and we would rather tell you now than after you have started.",
    "christ.5.d": "Thank Him. You are His child from that moment, and nothing you feel tomorrow undoes it.",
    "christ.5.r": "1 John 1:9 · John 1:12",
    "christ.cta.t": "So — where does that leave you?",
    "christ.cta.d": "Two honest answers, and we mean both of them. Whichever one you pick, the same person reads it and writes back to you in your language.",
    "christ.cta.disarm": "There are no magic words. A prayer does not save anybody — Jesus does. Say it out loud or under your breath, in your own language, in your own words. Nobody is grading it.",
    "christ.cta.btn": "I want to start following Jesus",
    "christ.cta.btn2": "I have questions — I am not there yet",
    "christ.cta.quiet": "Not ready to write to anyone? Read the little book first. Nobody will know you did.",
    "wa.decision": "Hello. I have read the page and I want to start following Jesus. I do not really know where to begin. Could someone talk with me?",
    "wa.questions": "Hello. I read the part about Jesus on your website and I am not convinced, but I would like to ask some questions. No pressure either way."
  },
  "es": {
    "christ.refLabel": "Como lo dice la Biblia",
    "christ.2.t": "Llevamos la vida por nuestra cuenta, y eso se paga",
    "christ.2.d": "No solo lo evidente. Cada uno de nosotros decide por su cuenta lo que esta bien y vive como si Dios no estuviera. Esa distancia que sientes es real, no imaginada, y la Biblia dice sin rodeos lo que cuesta.",
    "christ.2.r": "Romanos 3:23 · Romanos 6:23",
    "christ.3.t": "Dios no mando a otro. Vino Él.",
    "christ.3.d": "Jesus no es un buen maestro que Dios envio para no venir Él mismo. Es Dios, en persona, en un cuerpo. Vivio la vida que nosotros no pudimos vivir y en la cruz cargo con la muerte que era nuestra. Tres dias despues salio de la tumba. Por eso ya no queda nada que pagar.",
    "christ.3.r": "Juan 1:14 · Efesios 2:8-9",
    "christ.5.t": "Tu parte es pequena, y es tuya",
    "christ.5.lead": "Cuatro cosas. Ninguna es una ceremonia, y nadie tiene que estar mirando.",
    "christ.5.a": "Dile a Dios la verdad sobre ti. Él ya la sabe. Decirla es para ti, no para Él.",
    "christ.5.b": "Pidele que te perdone. No para que te quiera, sino porque ya te quiere.",
    "christ.5.c": "Dejale la ultima palabra sobre tu vida desde hoy. Esta es la parte que cuesta algo, y preferimos decirtelo ahora y no despues de que hayas empezado.",
    "christ.5.d": "Dale las gracias. Desde ese momento eres su hijo, y lo que sientas manana no lo deshace.",
    "christ.5.r": "1 Juan 1:9 · Juan 1:12",
    "christ.cta.t": "Entonces, ¿en que te deja esto?",
    "christ.cta.d": "Dos respuestas honestas, y las dos van en serio. Elijas la que elijas, la misma persona la lee y te contesta en tu idioma.",
    "christ.cta.disarm": "No hay palabras magicas. Una oracion no salva a nadie: Jesus si. Dila en voz alta o por dentro, en tu idioma, con tus palabras. Nadie la esta calificando.",
    "christ.cta.btn": "Quiero empezar a seguir a Jesus",
    "christ.cta.btn2": "Tengo preguntas, todavia no estoy ahi",
    "christ.cta.quiet": "¿No quieres escribirle a nadie todavia? Lee primero el librito. Nadie se va a enterar.",
    "wa.decision": "Hola. He leido la pagina y quiero empezar a seguir a Jesus. No se muy bien por donde empezar. ¿Podria hablar alguien conmigo?",
    "wa.questions": "Hola. He leido lo de Jesus en su pagina y no estoy convencido, pero me gustaria hacer algunas preguntas. Sin compromiso."
  }
}
```

Run: `node tools/patch-i18n.js tools/patches/gospel-2doors.json`, then `node tools/test-i18n.js`.

---

## 2. THE THREE IDEAS WORTH STEALING

Rejected first, so nobody re-proposes them: **Compassion's video hero and identifiable-person photographs** (no photos), **Samaritan's Purse's persistent donation cart** (backend), **Alpha USA's finder iframe at `finder.alphausa.org`** (external app), **Amazing Facts' "God's Word Every Day" three-tile daily block** (needs new content every day — no CMS), **desiringGod's dated "Current Theme" with a future-dated instalment** (looks alive for a month, then visibly stale, and nothing enforces the update).

Provenance note: the three below are from pages the researcher retrieved but that were **not** independently fact-checked. Copy the *structure*, do not reproduce their sentences verbatim.

### IDEA 1 — Elevation Church's four-way router, with a different verb on every card

Elevation's homepage puts, immediately below a two-CTA hero, a band headed *"Find the right experience for you"* with four cards — Physical Campus → **[Find a location]**, Live Streams → **[Find a time]**, Watch Party → **[Find a watch party]**, Pop-Up → **[Find a pop-up]**. The verbs and objects differ per card rather than four identical "Learn more" buttons.

This site has 17 sections and exactly two CTAs in the hero, then a flat 17-anchor scroll with nothing telling a stranger which door is theirs. One static block fixes it, and it also stops `#cristo` and `#cerca` competing for the same click.

**Build it inside `<section id="inicio">`, after `.hero-grid`, not as an 18th `<section>.`** A new section between `#inicio` and `#cerca` would break `test-rhythm.js`'s band-alternation assertion no matter which band you gave it; inside the hero, nothing in the harness moves.

```html
    <div class="router reveal">
      <h2 class="router-title" data-i18n="first.title">Find the first step that fits you</h2>
      <p class="router-lead" data-i18n="first.lead">Four ways in. None of them costs anything, and none of them commits you to the next one.</p>
      <div class="router-grid">
        <a class="router-card" href="#cerca">
          <h3 data-i18n="first.1.t">Come and see</h3>
          <p data-i18n="first.1.d">Sit at the back, say nothing, leave when you like. Someone will be waiting at the door so you do not walk in alone.</p>
          <span class="router-verb" data-i18n="first.1.b">Find a place near you</span>
        </a>
        <a class="router-card" href="#estudios">
          <h3 data-i18n="first.2.t">Study at home</h3>
          <p data-i18n="first.2.d">About an hour a week, at your own table or on a video call, in your own language.</p>
          <span class="router-verb" data-i18n="first.2.b">Ask for a study</span>
        </a>
        <a class="router-card" href="#cristo">
          <h3 data-i18n="first.3.t">Just curious</h3>
          <p data-i18n="first.3.d">You are not sure what you believe and you would rather read something than talk to anybody yet.</p>
          <span class="router-verb" data-i18n="first.3.b">Read the five steps</span>
        </a>
        <a class="router-card" href="#oracion">
          <h3 data-i18n="first.4.t">Carrying something heavy</h3>
          <p data-i18n="first.4.d">You do not want a course. You want someone to pray for you tonight, by name.</p>
          <span class="router-verb" data-i18n="first.4.b">Send a prayer request</span>
        </a>
      </div>
    </div>
```

```css
/* ---------- Cuatro puertas ---------- */
/* Diecisiete secciones son diecisiete puertas sin senalizar.
   Esto las reduce a cuatro, y cada una con su propio verbo:
   buscar, pedir, leer, enviar. */
.router { margin-top: clamp(40px, 6vw, 64px); }
.router-title { font-size: clamp(1.5rem, 3vw, 2.1rem); margin-bottom: 8px; }
.router-lead { color: var(--text-soft); font-size: .98rem; margin-bottom: 26px; max-width: 60ch; }
.router-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
    gap: 14px;
}
.router-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--surface);
    transition: border-color var(--t-base) var(--ease-out),
                transform var(--t-base) var(--ease-out);
}
.router-card:hover { border-color: var(--accent); transform: translateY(-3px); }
.router-card h3 { font-size: 1.28rem; }
.router-card p { font-size: .92rem; color: var(--text-soft); flex: 1; }
.router-verb {
    font-weight: 700;
    font-size: .84rem;
    color: var(--accent);
    letter-spacing: .01em;
}
.router-verb::after { content: " →"; }
@media (pointer: coarse) {
    .router-card:hover { transform: none; }
}
```

No new box-shadow transition (budget is ≤16), no new gradient (budget is ≤4). Keys `first.*` go in the same patch as everything else, all nine languages.

### IDEA 2 — Christianity Explored's cost-of-entry line, and two audiences that never share a button

Christianity Explored lists seven courses and every card shows a commitment line *before* any description, in a fixed shape: *"Christianity Explored — 7 Sessions | Mark's Gospel"*, *"Hope Explored — 3 Sessions | Luke's Gospel"*, *"Discipleship Explored — 8 Sessions | Philippians"*. Then every card carries **[Run a course]** and **[Find a course]** side by side. The footer splits navigation into *"Join a course"* and *"Run a course"* as separate columns. The church leader and the seeker are never made to share a button.

Telling a stranger it is three sessions rather than an open-ended commitment is the highest-value disclosure available on a page like this, and it costs nothing to ship.

`#estudios` is already halfway there — the four cards carry `study-tag` values like `"12 lessons · Beginner"`. Two changes:

1. **Move the tag above the description** and extend it to the CE shape: `<lessons> · <what you will read> · <languages>`. A visitor who reads *"8 lessons · Genesis and the Gospels · 9 languages"* before the prose knows the price of admission before they read the sales copy.
2. **Give each card two CTAs**: `[Request this study]` (seeker, `data-wa="study"`) and `[Host this study]` (member, `data-wa="host"`). Right now `#estudios` (four series, aimed at strangers) and `#unirse` ("go yourself", aimed at members) address opposite audiences with the same undifferentiated framing, and the only study CTA on the page is a single button 44px below the fourth card.

```html
        <div class="study-body">
          <span class="study-tag" data-i18n="studies.1.tag">12 lessons · Who God is and why the world hurts · 9 languages</span>
          <h3 data-i18n="studies.1.t">Discovering hope</h3>
          <p data-i18n="studies.1.d">The best place to start…</p>
          <div class="study-doors">
            <a class="btn btn-primary btn-sm" href="#" data-wa="study" data-i18n="studies.ask">Request this study</a>
            <a class="btn btn-ghost btn-sm" href="#" data-wa="host" data-i18n="studies.host">Host this study</a>
          </div>
        </div>
```

```css
.study-body .study-tag {
    display: block;
    order: -1;                 /* la linea de compromiso, antes del titulo */
    margin-bottom: 10px;
}
.study-doors { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
@media (max-width: 620px) { .study-doors .btn { width: 100%; } }
```

New keys: `studies.ask`, `studies.host`, `wa.host`, and the four rewritten `studies.N.tag` values. Nine languages.

### IDEA 3 — Hillsong's result card: badges, not just an address; and a location button with a written refusal string

Hillsong's finder puts **[Use my current location]** *above* the text input, and ships an explicit denied-permission string rather than failing silently: *"It looks like location services are turned off. Enable location services in your settings to use your current location, or type your address in the search bar."* Each venue card then carries amenity badges — *Free Parking*, *Close To Public Transport*, *Wheelchair Accessible*, *Parents Room*, *Interpretation Available*, *Gathering Online* — plus **[Get Directions]**.

For a nine-language audience whose real questions are "will anyone there speak to me" and "can I get there", badges are worth more than prose. This is a data change plus about forty lines of JS, no API, no backend.

Extend the `js/near.js` schema with booleans and render them as chips:

```js
   delray: {
     church:  "…",
     address: "…",
     map:     "https://maps.google.com/?q=…",
     time:    "11:00",
     langs:   ["en", "ht"],
     person:  "Marie",
     parking: true,       /* aparcamiento gratis */
     transit: true,       /* parada de autobus cerca */
     wheels:  true,       /* accesible en silla de ruedas */
     kids:    true,       /* sala para padres con ninos */
     interp:  ["ht"]      /* traduccion en vivo a estos idiomas */
   },
```

Geolocation, with the refusal handled in copy and no external service — a hardcoded lat/lng table for the 22 city keys plus haversine, resolved entirely client-side:

```js
  /* Boton "usar mi ubicacion". No hay API ni servidor: solo
     una tabla de coordenadas y la distancia mas corta. Si el
     navegador dice que no, se dice con palabras, no en silencio. */
  var CITY_LL = { delray: [26.4615, -80.0728], miami: [25.7617, -80.1918] /* … */ };

  function nearestKey(lat, lon) {
    var best = null, bestD = Infinity;
    for (var k in CITY_LL) {
      var a = (CITY_LL[k][0] - lat) * 111,
          b = (CITY_LL[k][1] - lon) * 111 * Math.cos(lat * Math.PI / 180),
          d = a * a + b * b;
      if (d < bestD) { bestD = d; best = k; }
    }
    return best;
  }

  function useMyLocation(btn, select, out) {
    if (!navigator.geolocation) { out.textContent = t("near.geoOff"); return; }
    btn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      function (p) {
        btn.disabled = false;
        select.value = nearestKey(p.coords.latitude, p.coords.longitude);
        select.dispatchEvent(new Event("change"));
      },
      function () { btn.disabled = false; out.textContent = t("near.geoOff"); },
      { timeout: 8000, maximumAge: 600000 }
    );
  }
```

Copy for the refusal — written, not a console error:

```json
"near.geo":    "Use my location",
"near.geoOff": "Your browser is not sharing your location. Turn location on in your settings, or just pick your city from the list — it works exactly the same.",
"near.empty":  "We do not yet have a confirmed address for that city, and we would rather say so than send you to the wrong door on a Saturday morning. Write to us and we will find out which congregation is closest to you and who can meet you there."
```

`near.empty` is what closes the gap in Change 0 honestly while the data is being gathered.

---

## 3. MOTION AND TRANSITIONS

Seven findings, in order of how much they matter. Exact CSS follows each.

### 3.1 Reveal-on-scroll: KEEP the mechanism, but strip it off primary text and shorten it

Keep it, with three changes. The argument:

NN/g's usability testing (*"Scroll-Triggered Text Animations Delay Users"*, Aurora Harley, 2017) found that users cannot distinguish an animation delay from a system delay, so a reveal reads as slowness. A participant, verbatim: *"I don't like how everything comes together when I'm scrolling down. … I hate that it has to load every single section."* Their operative rules: apply reveals to **secondary/supporting content only, never primary body text**; **fire once**, never on scroll-back; acceptable in leisure/browsing contexts, not in goal-directed ones.

The current code fires once (`obs.unobserve(en.target)` — correct, leave it). It fails the other rule seventeen times: `.section-head` carries `.reveal` on every single section, so **the title and lead paragraph of every section — the primary text — animate in**. That is precisely the "it has to load every single section" complaint, seventeen times down a long page. There are 97 `.reveal` elements in `index.html`.

Second problem: `--t-reveal: .6s` with `translateY(22px)`. Material's published guidance is that *"transitions that exceed 400ms may feel too slow"*, with 150–200ms for desktop UI and ~300ms for mobile standard transitions. 600ms is 50% over the ceiling, and a 22px slide is large enough to read as movement rather than as arrival.

Third problem, and the serious one: **the resting state is `opacity: 0`.** If `main.js` 404s, is blocked, or throws before `wireReveal()` runs, ninety-seven blocks of this page are invisible. There is an `IntersectionObserver`-missing fallback inside the function, which does not help if the function never runs. The fallback state must be the *finished* state, and the hidden state must be applied only by a page that has proven it can un-hide.

I am **not** recommending CSS scroll-driven animations (`animation-timeline: view()`) as the replacement. caniuse puts `animation-timeline` at **85.43% global**, and MDN's browser-compat-data records Firefox as `"preview"` — Nightly only. Firefox stable today is 154.0; 157 does not ship until 2026-09-29. Firefox stable has no support as of today. `IntersectionObserver` already works everywhere and is already written. Revisit after 29 September 2026, not before.

**Do:**

1. Delete `class="reveal"` from every `.section-head` (17 occurrences) and from the `#quienes` verse card. Keep it on cards, accordion items, resource tiles, CTA blocks.
2. Replace the reveal CSS with the block below.
3. Add one line to `index.html`, immediately after the stylesheet `<link>`:

```html
<script>document.documentElement.classList.add("js");</script>
```

```css
/* ---------- Reveal ---------- */
/* El estado en reposo es el estado FINAL. Si el script no
   llega, no carga o falla, no se esconde nada: el fallo mas
   comun de las librerias de reveal es dejar la pagina en
   blanco cuando el JS no aparece. */
.reveal { opacity: 1; transform: none; }

.js .reveal {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity var(--t-reveal) var(--ease-out),
                transform var(--t-reveal) var(--ease-out);
}
.js .reveal.is-visible { opacity: 1; transform: none; }
```

And retune the token — **do not add a fifth duration**, `test-rhythm.js` allows four:

```css
    --t-fast:   .18s;
    --t-base:   .26s;
    --t-reveal: .32s;   /* era .6s — por encima del techo de 400ms */
    --t-slow:   .45s;
```

### 3.2 `prefers-reduced-motion`: the current block is the nuclear reset, and that is its own failure

Current:

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
        scroll-behavior: auto !important;
    }
    .reveal { opacity: 1; transform: none; }
}
```

The `.01ms` (rather than `0`) is right — a `transitionend` listener still fires. But the preference means *reduced*, not *none*. WebKit's own article, which introduced the media query, says: *"Only remove the animations you know to be vestibular triggers"* and *"It's okay to keep many real-time, user-controlled direct manipulation effects."* Six named triggers to remove: scaling/zooming, 3D dolly zoom, spinning/vortex, multi-speed parallax, 2.5D shifts, peripheral horizontal motion. Cross-fades, small state-change indicators and focus rings **stay** — they are what tells a user something changed. Killing all of them is a comprehension regression, not an accessibility win.

**Precisely what to disable:** the reveal's `translateY`; every hover `transform: translateY(-Npx)` lift on `.value-card`, `.study-card`, `.min-card`, `.ev-card`, `.st-card`, `.res-card`, `.sab-why article`, `.gospel-step`, `.router-card`; the `.res-card .arrow` slide; the `wa-pulse` scaling ring on the floating WhatsApp button (scaling is on WebKit's list); smooth scrolling.

**Precisely what to KEEP:** the reveal's opacity fade (it is a cross-fade, not motion, and it is how the reader knows the block arrived); the `body` background/colour transition on theme toggle (colour only); every `border-color`, `background` and `color` transition on hover and focus; `:focus-visible` outlines, which are never animated here anyway; the accordion chevron's 180° rotation, which is a small state indicator on an element the user just clicked, not a spin; the Sabbath sunset clock, which updates because the information itself changes.

```css
@media (prefers-reduced-motion: reduce) {
    /* Se quita el desplazamiento. El fundido se queda: es lo
       que le dice al lector que algo aparecio. */
    .js .reveal { transform: none; transition: opacity var(--t-base) var(--ease-out); }

    /* Levantamientos y deslizamientos al pasar por encima:
       fuera la distancia, se quedan el color y el borde. */
    .value-card:hover, .study-card:hover, .min-card:hover,
    .ev-card:hover, .st-card:hover, .res-card:hover,
    .sab-why article:hover, .gospel-step:hover, .router-card:hover,
    .btn:hover, .res-card:hover .arrow { transform: none; }

    /* El anillo que crece alrededor del boton de WhatsApp es
       un escalado: fuera. */
    .wa-float::after { animation: none; }
}
```

Delete the `*, *::before, *::after` block entirely.

### 3.3 Smooth scrolling must be gated positively

`html { scroll-behavior: smooth }` is currently unconditional, undone by an `!important` inside the universal reset. The CSS spec says only that smooth scrolling uses *"a user-agent-defined easing function over a user-agent-defined period of time"* and that *"user agents are allowed to ignore this property"* — there is no requirement to honour the motion preference. Firefox honours the OS setting; Chromium does not. A long smooth scroll from the header nav down to `#contacto` on a seventeen-section page is exactly the peripheral motion WebKit warns about. Gate it positively so the reduced state is the default and cannot be forgotten:

```css
html {
    scroll-behavior: auto;
    -webkit-text-size-adjust: 100%;
}
@media (prefers-reduced-motion: no-preference) {
    html { scroll-behavior: smooth; }
}
```

Second-order gotcha worth knowing: `scroll-behavior: smooth` on `html` also animates browser find-on-page jumps in some builds, which users experience as the page fighting them. If anyone reports that, this is why.

### 3.4 Two WCAG 2.2.2 (Level A) failures

The criterion: *"For any moving, blinking or scrolling information that (1) starts automatically, (2) lasts more than five seconds, and (3) is presented in parallel with other content, there is a mechanism for the user to pause, stop, or hide it."* A second clause covers auto-updating information, **with no five-second grace**.

**(a) `wa-pulse` is `infinite`.** `.wa-float::after { animation: wa-pulse 2.4s ease-out infinite; }` — automatic, in parallel with content, unbounded. There is no pause control. The cheapest compliant fix is to make it stop before the criterion engages: two iterations is 4.8s.

```css
.wa-float::after {
    …
    animation: wa-pulse 2.4s var(--ease-out) 2;
}
```

This also drops the file's infinite-animation count to zero, which still satisfies `test-rhythm.js` (`≤ 1`).

**(b) The verse carousel auto-advances every 8s with no pause.** `restartVerses()` sets an 8-second `setInterval`; the dots re-render a verse but then call `restartVerses()` again, so they are navigation, not a pause. Auto-updating information presented in parallel needs pause/stop/hide with no grace period. (`restartVerses` already returns early under `prefers-reduced-motion: reduce`, which is correct and should stay — but the criterion applies to everyone.)

Add a real control next to the dots:

```html
      <div class="verse-controls">
        <button class="verse-pause" id="versePause" type="button"
                aria-pressed="false" data-i18n-aria="a11y.versePause">⏸</button>
        <div class="verse-dots" id="verseDots" role="tablist" aria-label="Bible verses"></div>
      </div>
```

```js
  /* WCAG 2.2.2: lo que cambia solo tiene que poder pararse. */
  var versePaused = false;
  function wireVersePause() {
    var b = $("#versePause");
    if (!b) return;
    b.addEventListener("click", function () {
      versePaused = !versePaused;
      b.setAttribute("aria-pressed", versePaused ? "true" : "false");
      b.textContent = versePaused ? "▶" : "⏸";
      if (versePaused) { clearInterval(verseTimer); verseTimer = null; }
      else restartVerses();
    });
  }
```

and guard the restart: `function restartVerses() { if (versePaused) return; … }`. Call `wireVersePause()` from the `DOMContentLoaded` handler. New keys: `a11y.versePause`, `a11y.verseResume`.

**Not a failure, do not touch:** the Sabbath sunset clock. It auto-updates, but the movement *is* the information — 2.2.2's "essential" exception applies squarely.

### 3.5 Sticky header and anchor offsets

`scroll-padding-top: 92px` is hardcoded while `.header-inner { min-height: 74px }` lives 100 lines away. They will drift. `scroll-padding-top` on the scroll container is the correct mechanism — it *"defines offsets for the top of the optimal viewing region of the scrollport"* and governs hash navigation, `scrollIntoView()` and scroll-snap alike — so keep the approach and just make the two numbers one number:

```css
:root {
    --header-h: 74px;
    …
}
html { scroll-padding-top: calc(var(--header-h) + 18px); }
.header-inner { min-height: var(--header-h); }
```

Do **not** replace this with `scroll-margin-top` on all seventeen targets, and do not reintroduce a `::before` pseudo-element offset hack.

Second: `body { overflow-x: hidden }`. MDN is normative that a sticky element sticks to *"its nearest ancestor that has a scrolling mechanism (created when overflow is hidden, scroll, auto, or overlay), even if that ancestor isn't the nearest actually scrolling ancestor."* The header works today only because `html` has no `overflow` declared, so `body`'s overflow propagates to the viewport and `body` does not itself become the scroller. That is a coincidence, not a design. The moment anyone sets `overflow` on `html`, or wraps the page in a div, the sticky header silently stops sticking. `overflow: clip` *"is not a scroll container and no new formatting context is created"*, which is what was actually wanted here (killing a horizontal scrollbar). Write both so older engines keep the old behaviour:

```css
body {
    …
    overflow-x: hidden;
    overflow-x: clip;   /* clip no crea contenedor de scroll: la
                           cabecera sticky deja de depender de la suerte */
}
```

Accessibility caveat from the same MDN page: with `clip`, hidden focusable content still receives keyboard focus but will not scroll into view. Nothing interactive is currently clipped here — keep it that way.

### 3.6 Jank on a seventeen-section page

The real causes are animating non-compositor properties, main-thread tasks over 50ms, and oversized paint areas — not "too many animations". Frame budget at 60fps is 16.7ms total, of which script realistically gets ~10ms.

Audit of this code:

- **Already right, leave alone:** the scroll listener is `{ passive: true }` and only toggles a class; every animated property in the file is `opacity`, `transform`, `background`, `color`, `border-color` or `box-shadow`; nothing animates `top`/`left`/`width`/`height`/`margin`; there is no `transition: all`; `will-change` appears nowhere. **Do not add `will-change`.** MDN: *"Overusing the property can cause the page to slow down instead of improving its performance"* and it *"is intended to be used as a last resort to try to deal with existing performance problems."* Spraying it across cards is a net loss — every promoted layer costs GPU memory.
- **The one real repaint risk:** the sticky header's `backdrop-filter: saturate(165%) blur(14px)`. A full-width blurred strip repaints on every scroll frame. Test on a low-end Android before anything else. If scrolling stutters, remove `saturate(165%)` first (it is the cheaper half of the win and the more expensive half of the cost); if it still stutters, drop the whole `@supports (backdrop-filter: …)` block — the fallback is already a solid `var(--bg)` and looks fine.
- **`box-shadow` transitions:** there are already many, and `test-rhythm.js` caps them at 16. Do not add more; animating `box-shadow` forces paint. If a new hover shadow is ever needed, animate the `opacity` of a pseudo-element instead.
- **Cut the observer count.** Removing `.reveal` from the 17 section heads (3.1) takes ~97 IntersectionObserver targets down to roughly 78, and removes the animation from exactly the elements NN/g says must never carry it.

**`content-visibility` — worth shipping, with a test.** caniuse puts `css-content-visibility` at **93.19% global** (Chrome/Edge 85+, Firefox 125+, Safari and Safari iOS 18.0+, Samsung Internet 14.0+), and it is the single biggest rendering win available for a long page. It is useless — actively harmful — without `contain-intrinsic-size`, because size containment makes the element lay out as if empty and the scrollbar jumps as sections enter and leave.

```css
/* Solo lo que esta muy por debajo del primer pantallazo.
   NUNCA en el heroe, en "cerca", ni en la seccion de Cristo. */
@supports (content-visibility: auto) {
    #libro, #creencias, #sabado, #estudios, #ministerios,
    #misiones, #oracion, #recursos, #donar, #faq {
        content-visibility: auto;
        contain-intrinsic-size: auto 900px;
    }
}
```

**Then run this test before you commit it:** from a cold load (hard refresh), click all eight desktop nav links and all mobile-nav links in turn and confirm each lands with its heading under the header, not mid-section. Six of those ten ids are anchor targets. If any one of them lands wrong, remove that id from the selector list — the page carries no images, so the win here is smaller than the published case studies and is not worth a broken anchor. Also note that any code calling `offsetHeight` / `getBoundingClientRect` / `getComputedStyle` into one of those subtrees defeats the optimisation entirely.

**View Transitions: do not add.** Same-document is at 90.2% and cross-document `@view-transition` has no Firefox implementation at all — but the decisive point is simpler: this is one document with no navigations, so there is nothing to transition. `document.startViewTransition()` earns its keep only when you are swapping DOM state, and this page does not.

### 3.7 One statistic to blacklist

If anyone brings a design argument built on *"animated interfaces reduced comprehension by 26% (Tuch et al., 2009, Journal of Consumer Research)"* — that citation is fabricated and is circulating through search summaries. The real Tuch et al. 2009 paper is *"Visual complexity of websites: Effects on users' experience, physiology, performance, and memory"*, Int. J. Human-Computer Studies 67(9), 703–715: static visual complexity, not animation, and not that journal. Do not put it in a commit message.

---

## 4. VISUAL RHYTHM

### The diagnosis

The page currently runs a **perfect ABABAB alternation** across all seventeen sections:

`hero(gradient) · cerca ALT · quienes BASE · testimonios ALT · cristo BASE · unirse ALT · libro BASE · creencias ALT · sabado BASE · estudios ALT · ministerios BASE · misiones ALT · oracion BASE · recursos ALT · donar BASE · faq ALT · contacto BASE`

Seventeen alternations is not rhythm, it is a stripe. Every section is announced with exactly the same emphasis, so nothing is emphasised; the eye gets no peaks and no grouping, and the page reads as a stack of blocks because structurally it *is* a stack of blocks. Made worse by the fact that **every one of the seventeen sections opens with the identical `.section-head` component** — eyebrow, serif title, grey lead — and **every section has the same `84px` vertical padding**.

### The fix: three bands, three spacing tiers, two heading weights, five acts

**Bands.** Stop alternating; start grouping. Three bands, not two:

| Band | Token | Job |
|---|---|---|
| PAPER | `var(--bg)` | the default reading surface |
| RAISED | `var(--bg-alt)` | binds two or three consecutive sections into one act |
| INK | `var(--deep)` / `var(--deep-ink)` | used **exactly twice**, at the two moments that matter |

**Band map.** The ink band goes on `#cristo` (the most important section on the site, which currently sits on the same paper as `#libro` and `#donar`) and `#contacto` (the close). Everything else groups:

| # | Section | Band | Act |
|---|---|---|---|
| 1 | `#inicio` | gradient | **I — Arrival** |
| 2 | `#cerca` | RAISED | I |
| 3 | `#quienes` | PAPER | I |
| 4 | `#testimonios` | RAISED | **II — Why us** |
| 5 | `#unirse` | RAISED | II (bound to 4, hairline rule between) |
| 6 | `#cristo` | **INK** | **III — The centre** |
| 7 | `#libro` | PAPER | III |
| 8 | `#creencias` | PAPER | III (bound to 7) |
| 9 | `#sabado` | RAISED | III |
| 10 | `#estudios` | PAPER | **IV — Doors** |
| 11 | `#ministerios` | RAISED | IV |
| 12 | `#misiones` | RAISED | IV (bound to 11) |
| 13 | `#oracion` | PAPER | IV |
| 14 | `#recursos` | RAISED | IV |
| 15 | `#donar` | PAPER | **V — Close** |
| 16 | `#faq` | PAPER | V (bound to 15) |
| 17 | `#contacto` | **INK** | V |

Four bound pairs (4–5, 7–8, 11–12, 15–16). Two ink peaks. Gradient count drops from 4 to 3 (the `.gospel` radial is replaced by the ink band), which stays inside the harness cap.

**Spacing, three tiers instead of one.** The two anchor sections get more air; the reference sections get less; bound pairs lose the seam between them.

```css
/* ---------- Ritmo ---------- */
/* Tres alturas, no una. Lo que ancla respira; lo que se
   consulta se aprieta; lo que va junto pierde la costura. */
section { padding: 84px 0; }

.band-anchor { padding: clamp(96px, 11vw, 128px) 0; }   /* #cristo, #contacto */
.band-compact { padding: 60px 0; }                       /* #creencias, #recursos, #faq */

/* Dos secciones de la misma banda, seguidas: son un solo acto.
   Se quita el hueco de arriba y se marca la union con una linea
   fina en lugar de un cambio de color. */
.band-bound {
    padding-top: 0;
    border-top: 0;
}
.band-bound > .container::before {
    content: "";
    display: block;
    width: 64px;
    height: 1px;
    background: var(--line-strong);
    margin: 0 auto 56px;
}

/* La banda de tinta. Dos veces en toda la pagina: el centro y
   el cierre. En modo oscuro --deep es AZUL CLARO, asi que la
   banda se invertiria: ahi se usa la superficie elevada. */
.band-ink {
    background: var(--deep);
    color: var(--deep-ink);
}
.band-ink .section-lead,
.band-ink p { color: inherit; opacity: .88; }
.band-ink .eyebrow { color: inherit; opacity: .72; }
[data-theme="dark"] .band-ink {
    background: var(--surface-2);
    color: var(--text);
    border-block: 1px solid var(--line);
}
[data-theme="dark"] .band-ink .section-lead,
[data-theme="dark"] .band-ink p { color: var(--text-soft); opacity: 1; }
```

Applied: `<section class="gospel band-ink band-anchor" id="cristo">`, `<section class="contact band-ink band-anchor" id="contacto">`, `<section class="join band-bound" id="unirse">`, `<section class="section-alt band-bound band-compact" id="creencias">`, `<section class="missions band-bound" id="misiones">`, `<section class="section-alt band-bound band-compact" id="faq">`, `.band-compact` also on `#recursos`. And delete the `radial-gradient` from the `.gospel` rule — the ink band replaces it.

**The `.section-head` monotony is the other half of the problem.** Seventeen identical eyebrow-title-lead stacks is what makes the page read as a template. Rule: **only the section that opens an act gets the full head.** Everything else loses the eyebrow and the lead, keeping title only.

Keep full heads on: `#cerca`, `#testimonios`, `#cristo`, `#estudios`, `#donar`.
Drop the `<span class="eyebrow">` and demote the title on: `#quienes`, `#unirse`, `#libro`, `#creencias`, `#sabado`, `#ministerios`, `#misiones`, `#oracion`, `#recursos`, `#faq`, `#contacto`.

```css
.section-head.is-minor { margin-bottom: 32px; }
.section-head.is-minor .section-title { font-size: clamp(1.55rem, 3vw, 2.15rem); }
```

Each dropped eyebrow means one key deleted from HTML → **set it to `null` in the patch**, or `test-i18n.js` fails on orphan keys (`about.eyebrow`, `join.eyebrow`, `book.eyebrow`, `min.eyebrow`, `res.eyebrow`, `faq.eyebrow`, etc.). Keep `section-lead` where it carries real information; drop it where it restates the title.

### Required `tools/test-rhythm.js` edit

The current assertion (`repetidas.length === 0` — no two consecutive sections may share a band) is exactly the rule that produces the stripe. Replace the band function and the assertion:

```js
/* Que banda pinta una seccion: INK, ALT o BASE */
function banda(sec) {
  if (sec.classList.contains("band-ink")) return "INK";
  if (sec.classList.contains("section-alt")) return "ALT";
  for (const c of sec.classList) { /* … sin cambios … */ }
  return "BASE";
}
```

```js
/* Agrupar es el objetivo, no el fallo. Lo que se prohibe es
   una racha larga (la pagina se aplana) y una banda de tinta
   pegada a otra (dos climax seguidos no son un climax). */
let racha = 1, maxRacha = 1, tintaSeguida = [];
for (let i = 1; i < bandas.length; i++) {
  racha = bandas[i] === bandas[i - 1] ? racha + 1 : 1;
  if (racha > maxRacha) maxRacha = racha;
  if (bandas[i] === "INK" && bandas[i - 1] === "INK") tintaSeguida.push(secciones[i].id);
}
const tintas = bandas.filter(b => b === "INK").length;
ok(maxRacha <= 2, "ninguna banda se repite mas de dos veces", "racha maxima: " + maxRacha);
ok(tintas === 2, "exactamente dos bandas de tinta", tintas + " encontradas");
ok(tintaSeguida.length === 0, "las bandas de tinta estan separadas", tintaSeguida.join(", "));
```

Everything else in that file stays. The gradient cap (`≤ 4`) still passes at 3.

---

## 5. WHAT TO CUT

### CUT 1 — Move `#donar` below `#contacto`, and cut it to a card

This is the strongest cut on the page because the site contradicts itself out loud. `#faq` answers *"Is everything really free?"* with *"Yes. Bible studies, the books, the visits and the prayers cost you nothing, ever. **We will never ask you for money** — not at the first study and not at the last one."* And `#donar` — a full-width band with its own heading and a WhatsApp giving CTA — sits **directly above that FAQ**, at position 15 of 17.

The distinction (giving is for supporters, free is for seekers) is real, but a stranger scrolling one continuous page does not get to make it. They read a promise of no money three seconds after being asked for money.

**Do:** move `#donar` to position 17, after `#contacto`, and shrink it from a section band to a single card with one line of framing that names who it is for. **Gain:** the page's most-repeated promise stops being undercut, and the last thing a seeker sees becomes contact, not a donation ask.

Because `test-rhythm.js` asserts nav and footer link order matches DOM order, **reorder the corresponding `#donar` links in `.mobile-nav` and every `.footer-col` in the same commit**, or that test fails.

New framing line, `give.lead`:
> *"This part is not for you if you are new here — everything we offer you is free, and it stays free. This is for the people who already walk with us and have asked how to help carry it."*

### CUT 2 — `#ministerios`, six cards → fold into `#quienes`

Six cards (Bible work, Health, Youth, Community help, Prison, Nine languages), no CTA, purely self-descriptive. `#quienes` already runs four value cards saying much the same thing at position 3 (free Bible studies / someone praying / a church near you / practical help), and `#unirse` covers "come and do this with us" at position 6. Three sections describe the organisation to itself.

`min.6.t` — *"Nine languages"* — is not a ministry, it is the site's headline capability and it is buried at position 11 in a card nobody scrolls to.

**Do:** delete the section. Move the nine-languages fact into `#quienes`'s lead or the hero badge, where it does work. Keep the other five as a single-line chip list inside `#quienes` (`Bible work · Health · Youth · Community · Prison`) — the reader who wants detail asks on WhatsApp, which is the whole model. **Gain:** one entire band removed from the middle of the scroll (16 sections), six cards and six IntersectionObserver targets gone, and Act IV tightens from five sections to four.

`null` out `min.eyebrow`, `min.title`, `min.lead`, `min.1.t`–`min.6.d` in the patch.

### CUT 3 — `#recursos`, six outbound links → three, and demote

Six cards, every one of which sends the reader **off this site**, positioned at 14 of 17 — immediately before the two sections that ask for something. That is an exit door installed in front of the conversion.

Worse, `res.5` — *"Find a church · Official directory · search by city"*, pointing at `adventist.org/find-a-church/` — is the site's own `#cerca` promise, outsourced to a third party. `#cerca` exists precisely so that a stranger gets a named human at a door instead of a directory row. Once Change 0 is done, this card competes with the best thing on the page. And `res.4` points at `adventist.org/beliefs/`, duplicating `#creencias`.

**Do:** keep three — BibleGateway, the Ellen G. White library (which `#libro` already depends on), and the group's own YouTube channel. Delete `res.4` and `res.5` entirely. Apply `.band-compact`. **Gain:** three fewer exits before the ask, and `#cerca` and `#creencias` stop being undercut by links to other people's versions of themselves.

Separately, while you are in there: **every remaining resource CTA should name the artifact, not say "learn more".** Life.Church's Open Network does this consistently — *"41 Bible App for Kids Coloring Sheets"* → **[Get the Coloring Sheets]**; *"A Devo for New Believers"* → **[Download the PDF]**. `#libro` already does it right (*"Download the PDF"*, *"Read it online now"*, *"Ask for a free printed copy"*). Copy that rule everywhere.

### CUT 4 — `#misiones`, until `events.js` has data

An empty tab set with two tabs and nothing behind them is worse than no section. See Change 0. Either publish one real dated event this week, or hide the section (`hidden` attribute plus a `null` pass on `mis.*`) until there is one. Do not ship a tab UI over an empty array.

If you keep it, steal It Is Written's framing when the data arrives: they list individual trips as first-class named destinations with country and year — *"Colombia 2026"*, *"Dominican Republic 2027"*, *"Malawi 2027"* — rather than a generic "Missions" page. A named, dated, bookable trip is a CTA; a tab is not.

### CUT 5 — 97 `.reveal` wrappers → roughly 60

Covered in 3.1: off all 17 `.section-head`s (NN/g's rule, and the single largest perceived-slowness source on this page), plus the cards removed by Cuts 2 and 3.

### Not cut, but moved: `#creencias`

Keep the beliefs accordion — it answers a real question and the FAQ already handles the "do I have to become an Adventist" version of it. But it sits at position 8, ahead of `#estudios` and `#oracion`. Christianity Explored's whole architecture is identity → mission → call, with doctrine nowhere in the funnel; Barna's largest measured gap is that 50% of non-Christians want someone who *"does not force conclusions"* and only 26% see it. Doctrine before the invitation reads as a conclusion being forced. Bind it under `#libro` where the band map puts it, keep it `.band-compact`, and let `#faq` carry the load for first-time readers.

---

## Harness checklist before you push

Run all eight, in this order — the first two will fail loudly if you got the patch wrong:

```
node tools/test-i18n.js        # parity across 9 langs + no orphan keys ← will catch every deleted eyebrow
node tools/test-loader.js
node tools/test-page.js        # full DOM; new ids: none (the router lives inside #inicio)
node tools/test-rhythm.js      # REQUIRES the edit in item 4 before it can pass
node tools/test-contrast.js    # ADD 4 pairs: text-soft/deep, accent/deep, line/deep, and deep-ink/deep already exists
node tools/test-sunset.js
node tools/test-seo.js
node tools/test-responsive.js
```

`test-contrast.js` currently checks 12 interface pairs plus the token pairs listed at lines 68–92. The full-bleed ink band introduces `--text-soft` and `--accent` over `--deep`, which are not currently tested and which I would expect to fail in light mode (`--text-soft: #6A6157` on `--deep: #0F3B4C`). That is why `.band-ink` above sets `color: inherit` with an `opacity` on the lead and eyebrow rather than reusing those tokens — verify it, and if the harness wants explicit tokens, add `--deep-soft-ink` rather than bending the existing ones.

Manual checks the harness cannot do:

1. Disable JavaScript. Every section must still be readable (this is what the `.js` class change buys you).
2. Set the OS to reduce motion. Cards must still cross-fade, hovers must still change colour, focus rings must still appear, the accordion chevron must still turn, the sunset clock must still tick — only the sliding, the lift and the pulse ring should be gone.
3. Cold-load, then click all eight desktop nav anchors and all mobile-nav anchors. Every heading must land clear of the sticky header. This is the `content-visibility` acceptance test.
4. Scroll the whole page on a low-end Android. If it stutters, remove `saturate(165%)` from the header's `backdrop-filter` and re-test.