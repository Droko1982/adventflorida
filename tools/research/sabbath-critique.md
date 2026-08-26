## Review — `#sabado` content brief, Florida Advent Missionaries

Files checked: `C:\Users\asus\adventflorida\index.html`, `C:\Users\asus\adventflorida\js\sabbath.js`, `C:\Users\asus\adventflorida\js\main.js`, `C:\Users\asus\adventflorida\js\i18n.js`, `C:\Users\asus\adventflorida\PENDIENTES.md`. Sunset figures below were computed by running `js/sabbath.js` under Node with a `window` shim, not estimated.

---

## 1. What is missing

**M1 — Nothing anywhere tells the reader what language the service will be in.** This is the single largest gap. The site promises nine languages (`contact.langs`, `footer.tag`, `faq.a4`), Block E answers five questions a nervous visitor has, and not one of them is the question a Kreyòl, Ukrainian or Brazilian reader asks first. Add as `sab.e.0`, before "What do I wear?":

> **Will I understand anything?**
> Tell us your language before you come and we will send you to a congregation that uses it, if there is one near you. Florida has Spanish, Haitian Creole, French, Portuguese and other congregations, and many English ones have someone who will sit beside you and translate. If the nearest church is in a language you do not speak, say so — we would rather find you a study at your kitchen table in your own language than send you somewhere you will sit through in silence.

And add a language field to `sab.g.lead` (it already asks for city and language — good; make the reply promise explicit).

**M2 — No path for the reader who cannot or will not go to a church.** Every route in the brief ends at a building. For someone housebound, undocumented, working Saturdays, or 90 minutes from the nearest congregation in their language, the section has nothing. Add a block between F and G:

> **If you cannot get to a church**
> The day is not stored in a building. People keep it alone, in a flat, in a hospital ward, on a break room sofa. Turn the phone off, read something slowly, call someone who is worse off than you, sleep. If you would like someone to read the same passage at the same hour and speak to you afterwards, tell us and we will arrange it.

**M3 — No answer for "this will cause a fight at home."** For Haitian, Hispanic, Brazilian and Ukrainian readers from Catholic, Pentecostal or Orthodox families, this is the actual obstacle, larger than the doctrine. Add as a fifth honest question:

> **My family will not like this. What then?**
> Then go slowly. Nothing here asks you to argue with your mother or to walk out of the church you grew up in. Read for yourself, pray about it, and let the change be something people notice rather than something you announce. Most of us have had that conversation in our own families, and some of us are still having it.

**M4 — No Jewish reader is imagined at any point**, on a Sabbath page written by a group based in Delray Beach. Block B's only line on the subject is the wrong one (see L9). At minimum, one sentence that does not treat the seventh day as something Christians recovered from someone else.

**M5 — No "watch one first from home."** Many Florida congregations livestream. It is the cheapest possible on-ramp for exactly the frightened reader Block E is written for, and it is absent. One line in Block G: *"If walking in is too much this month, ask us for a church near you that streams its service, and watch from your sofa first. Nobody will know you were there."*

**M6 — Block F never answers the factual half of the Sunday question.** `sab.f.a2` answers it pastorally and beautifully, then stops. A reader who has been told all his life that the apostles moved the day will read that silence as evasion — and will go find the answer on a hostile website instead. Add one non-polemical beat to Block B, positive only, no Constantine:

> `sab.b.4.t` — **The first Christians kept it too**
> `sab.b.4.d` — Luke's account of the early church shows Paul in the synagogue on the Sabbath week after week, and the women who buried Jesus resting on it even in their grief. We are not claiming more than the text says. We are saying the practice did not stop at the cross, and we would rather keep reading than stop early.
> `sab.b.4.r` — Luke 23:56 · Acts 13:42-44 · Acts 17:2 · Acts 18:4

**M7 — No privacy line on the Block G CTA.** `sab.g.lead` asks a stranger for his city and language over WhatsApp, and `sab.g.note` promises "we will find it" — i.e. someone will go looking near where he lives. Given who reads this page in Florida in 2026, add: *"We do not publish your name anywhere, we do not pass your number to anyone, and nobody will turn up at your door unless you ask them to."*

**M8 — The brief does not give the builder the widget contract, and the widget is already written.** `js/main.js` lines 248-315 already implement `renderSabbath()` / `wireSabbath()`. They require DOM ids that the brief never mentions and that do not exist in `index.html` today (`grep` returns nothing):

`#sabCity` (a `<select>`; `wireSabbath()` returns early without it, so a wrong id yields a silent dead widget), `#sabStartTime`, `#sabStartDay`, `#sabEndTime`, `#sabEndDay`, `#sabStatus`, `#sabStatusText`.

**M9 — Two i18n keys are already being called and do not exist.** `main.js` calls `t("sab.now")` and `t("sab.next")`. `grep -o '"sab\.[a-zA-Z0-9._]*"' js/i18n*.js` returns **0 matches** across all three i18n files. The brief claims the `sab.*` prefix for the whole section without reserving these two. Define them explicitly in §2 — e.g. `sab.now` = "The Sabbath is under way", `sab.next` = "The next Sabbath begins" — or the status pill renders as a raw key string in all nine languages.

**M10 — The prose hardcodes a 12-hour American clock that the widget will not match.** Verified: `Intl` under the site's own locale mapping (`main.js:256`) renders the same instant as `5:40 PM` for `en-US` but `17:40` for `es-ES`, `de-DE`, `nl-NL`, `ru-RU`, `uk-UA`, `pt-BR` and `fr-FR`. So a German reader sees the widget say **17:40** and the paragraph beside it say **5:40**, and `sab.e.5.d`'s "half past nine to half past twelve" will not survive translation at all. Write the times so translators can localise them, and add a translator note to that effect.

**M11 — "Add a nav item" is underspecified.** The desktop nav (`index.html` ~line 183) carries seven items and is already full; the mobile nav carries eleven. Say which one gets `#sabado`, and note that `nav.sabbath` needs a key in all three i18n files.

**M12 — No practical arrival detail at all**: no address, no "is there a service this Saturday", no parking, nothing for a wheelchair user or a deaf visitor. Block C tells the reader precisely when the day begins and then gives him nowhere to be.

---

## 2. Legalism, salvation-by-works, and judgement of Sunday Christians

**L1 — `sab.f.a3`: "the things that can wait until Sunday."** Two faults in six words. It hands the reader a covert rule, and it casually assigns another Christian's day of worship as the errand-day dump — in the very answer whose neighbour, `sab.f.a2`, calls those Christians brothers and sisters. **Rewrite:** *"the things that can wait."*

**L2 — `sab.f.a3` contradicts itself inside one paragraph.** It opens "We set aside the ordinary business of the week: paid work, shopping, errands…" — a list of prohibitions — and closes "There is no official list of prohibitions." The brief's own §6.3 forbids the first sentence. **Rewrite the opening:**

> Most of us let the ordinary business of the week go for those hours — the paid work, the shopping, the errands. Not because there is a list; the church has warned for decades against writing one, and could not be your conscience even if it wanted to be. What fills the space is worship, family, a long meal, time outdoors, and visiting people who are ill or alone.

**L3 — `sab.f.a3`: "our own church has warned for decades against writing one."** The site is a lay group that states twice — `faq.a6` and the footer disclaimer — that it does *not* speak for the denomination. "Our own church" quietly claims institutional voice. **Rewrite:** *"the church's own 1990 statement warns against writing one, and says the church cannot be conscience for its members."*

**L4 — `sab.b.3.d`: "We would rather follow His practice than improve on it."** This is the sharpest sentence in the brief and it is aimed at Sunday Christians. "Improve on it" says: you tried to do better than Jesus. **Rewrite:** *"We would rather keep His habit than think of a better one."* — or cut the clause entirely; the paragraph is stronger without it.

**L5 — `sab.b.lead`: "It is not an argument with anyone else's Sunday, and we will say more about that further down."** Announcing that a rebuttal is coming raises the temperature the sentence claims to lower, and "anyone else's Sunday" is faintly possessive. **Rewrite:** *"This is our answer, given the way we would give it over coffee — what we found when we read, and why we kept it. It is not aimed at anyone."*

**L6 — `sab.f.a2`: "to tell you that your family's church is wrong about everything."** The qualifier does the damage: *everything* implies *something*. **Rewrite:** *"We are not here to tell you what your family's church has got wrong. We are here to show you what we found in Scripture and let you read it for yourself, before God, at your own pace."*

**L7 — `sab.a.3.d`: "He said so plainly to the religious people of His own day."** A coded swipe, and on a page about a Jewish institution it slides toward the oldest bad reading in Christian preaching. It also lets *us* off. **Rewrite:** *"Where it has been turned into a list of things you may not do, it has been misused — and He said so plainly. Adventists have needed to hear that as much as anyone."*

**L8 — `sab.b.1.d`: "It belongs to the world, not to one people."** Written to say "not the property of one denomination"; it reads as "not the Jews'." From a group headquartered in Delray Beach, that is not a small misfire. **Rewrite:** *"It was given to the whole human family, before there was a nation or a church to argue about it."*

**L9 — `sab.f.r2` cites Romans 14:4-5.** Romans 14:5 — "one person considers one day more sacred than another; each should be fully convinced in their own mind" — is the standard proof text used *against* Sabbath-keeping. Printing it under this question either concedes Block B or reads as not having noticed. **Fix:** cite `Romans 14:4 · Acts 17:11 · John 13:35`.

**L10 — `sab.f.a1`: "they have got the gospel backwards."** True, and a judgement thrown at unnamed people (in practice, other Adventists) in the middle of a paragraph about grace. **Rewrite:** *"If anyone ever tells you the day is the price of heaven, do not believe them. That is not the gospel, and it is not what we believe."*

**L11 — `sab.c.note`: "finishing on Friday afternoon rather than at the last second."** "Rather than at the last second" quietly grades the person who finishes at 5:39. **Rewrite:** *"Nobody here is timing you. Most of us simply give the edges of the day a little room."* Stop there.

**L12 — `sab.e.6.d`: "men and women in separate rooms"** is stated as universal. Many congregations seat couples and families together. **Rewrite:** *"usually with men and women in separate rooms, though in many congregations couples and families wash together."*

---

## 3. Unsupported or overstated claims

**S1 — `sab.t.2.d` breaks the brief's own §6.4, with numbers I can verify.** "In Florida that moment lands around 5:40 in early January and after eight in midsummer." Running `js/sabbath.js`:

| City | 2 Jan 2026 | late June 2026 |
|---|---|---|
| Delray Beach | 5:40 PM | 8:16–8:17 PM |
| Pensacola (Central) | **5:00 PM** | **7:55 PM — never reaches eight** |
| Key West | 5:51 PM | 8:18–8:20 PM |

So the sentence is 40 minutes wrong in January and flatly false in midsummer for every reader in the Central Panhandle — the exact statewide-Eastern assumption §6.4 forbids, reintroduced by the copy. There is also an antecedent bug: "that moment" is *half an hour before sunset*, so the quoted figures are the wrong quantity even where they are right. **Rewrite:**

> `sab.t.2.d` — Work stops. Phones go down. Somebody puts a tablecloth on. Sunset itself moves a long way through the year and across the state — in early January it is just before six in most of Florida and around five in Pensacola; in midsummer it is past eight almost everywhere, and just short of it in the western Panhandle. That is why the times on this page change every week. Use the ones for your own city above.

**S2 — The widget and the calendar the brief links will disagree, and nothing warns the reader.** `sab.c.link` points at the Florida Conference table immediately after the paragraph explaining Central time — and §5 already records that the table does not cover the western Panhandle. Worse, for 3 January 2026 the two sources differ:

| City | Conference table (§7) | `js/sabbath.js` |
|---|---|---|
| Tallahassee | 5:50 | **5:49** |
| Tampa | 5:48 | **5:47** |
| Jacksonville | 5:40 | **5:39** |
| Miami | 5:44 | **5:43** |
| Orlando | 5:42 | 5:42 |
| Ft. Myers | 5:48 | 5:48 |

Four of six differ by a minute (rounding convention, not an error in either). A reader who checks both and finds a discrepancy is being handed precisely the anxiety §6.5 exists to prevent. Fold it into `sab.c.note`: *"You will find printed tables that differ from this one by a minute — different sources round differently, and cloud and terrain move it anyway. That minute has never mattered to anyone here."* And caveat the link: *"…covers six cities in Eastern time; if you are west of the Apalachicola River, use the calculator above."*

**S3 — §7: "Combined, roughly 397 churches and 127,243 members."** The brief says in the same bullet that the Southeastern figure includes southern Georgia — then prints a nine-digit-precision sum as a Florida total. **Fix:** *"Between them, roughly 400 congregations and more than 120,000 members across Florida and southern Georgia (as of 31 December 2025)."*

**S4 — §7 and §5 give two incompatible congregation counts** for the Florida Conference: 238 churches + 50 companies = 288, versus "281 Florida congregations" from the locator. Reconcile, or say "about 280–290" and pick one denominator for the Spanish share ("87 of about 280").

**S5 — §6.8's own "safest wording" is itself the overstatement.** "Four to ten years longer than other Californians, depending on sex and diet" is not what the data say: the 7.3 / 4.4-year gap is Adventists versus other Californians, while the ~10-year figure comes from comparing *vegetarian Adventists with non-vegetarian Adventists*. The proposed wording merges two different comparisons into one. Given §6.9 and §6.10 already ban lifespan attribution to the Sabbath and all prevent/treat/cure language, the coherent instruction is: **do not use a lifespan number on this site at all.** Replace §6.8's remedy with: *"Adventists describe the day as a weekly release from pressure. Say that, and nothing about years."*

**S6 — A live health claim on the page today that the brief's verify list misses.** `index.html` line ~510, `studies.4.d`: *"Practical, evidence-friendly habits that add years to your life — plus the peace of mind that no diet can give you."* That is exactly the claim §6.9/§6.10 prohibit, already published, in all nine languages. Add it to §8. **Rewrite:** *"Practical habits — rest, water, sunlight, movement, plain food — the way our own families live. Plus the peace of mind that no diet can give you."*

**S7 — §7: "That spread is genuine local-horizon variation."** No — Tallahassee to Miami is longitude and latitude. Local horizon is the minute-scale effect the brief correctly describes elsewhere. Calling a ten-minute geographic spread "horizon variation" undercuts the very distinction Block C depends on. **Fix:** *"That spread is longitude and latitude, and it is the cleanest possible illustration for Block C."*

**S8 — `sab.a.1.d`: "The first full day Adam and Eve lived was a day of rest."** A devotional inference stated as fact; Genesis 2:1-3 says nothing about Adam and Eve resting. Defensible as reading, not as reporting, and the block's whole force depends on the reader trusting that the cited text says what is claimed. **Rewrite:** *"Genesis puts the first Sabbath at the very end of the creation week, before a single day of human work is recorded. Nothing had been built, earned or proved. That is the order God set at the beginning, and we have never found Him reversing it."*

**S9 — §7's headline figures need attribution as well as a year.** "24,372,139" and "about 9.7 million" come from different instruments with very different reliability; the attendance number rests on incomplete returns. If they appear together, phrase it as: *"24.4 million baptised members on the rolls as of 31 December 2025; the church's own research puts average weekly attendance at roughly 9.7 million."* Also verify the source document name — the brief cites a "2026 Annual Statistical Report advance release" for 2025 data, which needs a human to confirm before it goes on a public page.

**S10 — `sab.b.3.r` files Isaiah 58:13-14 under a heading about Jesus.** Move it to `sab.f.r3`, where it already appears and belongs.

**S11 — `sab.close` duplicates the site's hero verse.** Matthew 11:28 is already the opening rotating verse (`index.html:287`, `#verseText`) and is cited again in `beliefs.r8`. Third use in one page. Either make the repetition deliberate (*"The verse at the top of this page was not written for people who had earned a break…"*) or close on Mark 2:27 or Isaiah 58:13-14.

**S12 — Link hygiene the brief flags but does not apply to the existing file.** `res.3` currently links `https://www.hopetv.org/` (brief prescribes `hopetv.org/global-networks`); `res.2.d` claims the EGW library covers "150+ languages" while §5's own per-language counts run to nine languages with **no Kreyòl**. Also the §5 sunset PDF is year-stamped (`/2025/12/2026-Calendar.pdf`) and will 404 after this year — link the calendar page, not the PDF.

---

## 4. Warmth versus arguing a doctrine

The copy is warm and Christ-centred almost everywhere. `sab.a.close` ("So we do not keep this day to be accepted. We keep it because we already are."), `sab.d.close`, `sab.e.3.d` ("We are not going to charge you for a morning."), `sab.t.8.d` ("This is not the leftover half of the day. It is the half most people remember.") and `sab.f.a4` are the best writing in the brief. Protect them in translation.

**The drift is Block B, and it is structural, not incidental.** Three symptoms:

1. **It is the only block on the page with no second person.** The live site addresses the reader constantly — `hero.sub`, `beliefs.a8` ("Come exactly as you are"), `studies.lead`. Block B's three cards contain no "you" at all. The register break is what makes it read as a brief rather than a conversation.
2. **The headings are argument beats, not gifts.** "It was there before any religion existed" · "It is the one commandment that begins Remember" · "Jesus kept it, and He called it His." That is a three-point case for the prosecution. "He called it His" in particular converts Christ's Lordship into a possession claim — Jesus as exhibit.
3. **`sab.b.1.d`: "That is where we start, because that is where the Bible starts."** A rhetorical flourish that flatters the speaker.

**Rewrite the three beats to be about what God did toward the reader:**

> `sab.b.1.t` — **It was there before anyone was religious**
> `sab.b.1.d` — Before there was a temple, a nation or a church to belong to, there was a day God stopped on, blessed, and set aside. It was given to the whole human family, and it was given before anyone had done anything to deserve it.
>
> `sab.b.2.t` — **The one commandment that begins "Remember"**
> `sab.b.2.d` — In the middle of the Ten Commandments God asks you to remember something: a day, a Maker, and the fact that you are not a machine. If you have ever felt that the week is trying to spend you, that request is aimed at you. We take it at face value.
>
> `sab.b.3.t` — **It was Jesus' own habit**
> `sab.b.3.d` — Luke says going to worship on the Sabbath was Jesus' custom. He spent those hours healing people and doing good — deliberately, and to some people's annoyance. That is the shape we want ours to have.

One more drift, smaller: `sab.f.a3` uses "we" seventeen words before it uses "you," and never returns. Its last sentence — "How it looks in your home will depend on your work, your family and your own conscience" — is the best line in the answer and should move to second position, not last.

---

## 5. Culturally tone-deaf for a Florida readership in nine languages

**C1 — The copy is written in British English vocabulary, not just British spelling.** The live site uses British *spelling* (`Saviour`, `neighbours`, `organisation`) and American *vocabulary*. The brief crosses that line: **"car park"** (`sab.e.2.d`), **"queue"** (`sab.t.7.d`), **"in hospital"** (`sab.t.8.d`), **"half past nine to half past twelve"** (`sab.e.5.d`), **"carers"** (`sab.f.a4`), **"a flat"**. To a Florida reader — and especially to an ESL reader who learned American English here — this reads as written by someone who has never been to Florida. **Swaps:** car park → **parking lot**; queue → **line**; in hospital → **in the hospital**; carers → **home health aides**; half past nine to half past twelve → **9:30 to about 12:30**. Keep `-our` / `-ise` spelling and `programme`.

**C2 — `sab.f.a4` names only high-status Saturday jobs.** "Nurses, carers and emergency workers are on duty every Sabbath… Others work out shift swaps with an employer over time." For the Haitian and Hispanic readers this site exists to reach, the real conflict is hourly work in retail, hospitality, construction, landscaping, agriculture and warehousing, where "working out a shift swap over time" is not a thing that happens and asking can cost you the job. As written, the answer tells a hotel housekeeper that people like her are not in view. **Rewrite:**

> Not at all, and please do not let it stop you from coming. Nurses and paramedics are on duty every Sabbath and always have been — illness does not keep a calendar. So are people in kitchens, shops, warehouses, packing houses and on building sites, where nobody is offered a choice about Saturdays and asking for one can cost you the job. Some work out a swap over the years. Some never can. Come as your life actually is, and if it would help to talk it through with someone who has stood exactly where you are standing, write to us.

**C3 — Block D is written entirely for an intact resident family.** "The family gathers" · "Ten minutes in some homes, an hour in others" · "How it looks in your home will depend on… your family." A very large share of the Haitian, Brazilian and Ukrainian readers of this page are in Florida without their families — that is *why* they are here. As written, the timeline is a window onto a life the reader does not have. One clause repairs it: `sab.t.3.d` → *"The family gathers — or the two of you, or just you and an open Bible. A hymn, a few verses, a prayer, and each person says something about their week. If you are on your own, this is the hour most of us would want you at our table; say the word and you will be."*

**C4 — `sab.e.6.d` describes Communion without saying who may take it.** For readers from Catholic, Orthodox and some Pentecostal backgrounds, communion is fenced — the assumption is that a visitor may *not* receive. Adventist practice is open. Saying nothing leaves the most anxious reader assuming the strictest rule. **Add:** *"The table is open — you do not have to be a member, or an Adventist, to take part. And if you would rather not, stay in your seat; no one will think anything of it."*

**C5 — `sab.t.7.d`: "the food is usually vegetarian so that nobody is left out"** and *"Guests bring nothing."* Two misses. For Haitian, Brazilian and Slavic readers a meatless table can read as poverty, or as a fast (Orthodox *post*), rather than as hospitality — and arriving empty-handed at a shared meal is shameful in most of those cultures. **Rewrite:** *"People bring a dish in the morning. The food is usually vegetarian — that is how most Adventist kitchens cook, and it means everyone can eat everything on the table. As a guest you are not expected to bring anything; if you want to anyway, bring it, and it will be eaten."*

**C6 — Don't shelve Russian and Ukrainian resources together.** §5 lists `hopetv.ru` and `tv.hope.ua` in one row and treats the two languages as an equivalent pair. Many Ukrainian speakers in Florida arrived after 2022 and will not accept Russian-language material as a fallback, however well meant. Keep the two lists separate, never offer one as a substitute for the other, and add a build note that `js/i18n.js` uses 🇷🇺 for `ru` — a *state* flag serving Russian-speaking Ukrainians, Moldovans and Central Asians, which is worth a separate decision.

**C7 — The Kreyòl honesty passage is right, but "French as the practical fallback" needs care.** Not all Haitian readers are comfortable in French, and in Haiti the French/Kreyòl pairing carries class history; offered flatly it can read as "your language does not really count." **Suggested copy for `sab.h`:** *"In Kreyòl there is one free study guide, and it is a good one. There is no Kreyòl Adventist television, radio or online library yet — we would rather tell you that than send you round in circles. Some of our Kreyòl readers use the French material as well; if you would rather not, tell us and we will read with you in Kreyòl ourselves."*

**C8 — `sab.g.alt` presents the two conferences as a plain either/or**: "Florida Conference church locator · Southeastern Conference church map." §6.12 correctly bans describing Southeastern as segregated or as "for Black Adventists" — but a bare two-link menu invites the reader to sort himself, which produces the same result silently. **Rewrite:** *"You can also look one up yourself. Two directories cover the state and they overlap — most towns appear in both, so search both. Florida Conference locator · Southeastern Conference map. If neither shows something near you, or nothing near you is in your language, write to us and we will find it."*

**C9 — `sab.g.lead` and `sab.e.2.d` both offer that a stranger will meet the reader in person**, and Block G collects a city plus a WhatsApp number, with no word about what happens to either. For undocumented readers in Florida in 2026, that offer is not purely reassuring. Pair it with M7's privacy line, and add to `sab.e.2.d`: *"…tell us and one of us will meet you in the parking lot and walk in with you. We will not ask you anything about yourself."*

---

### Verification notes for whoever builds this

- `PENDIENTES.md` flags that the group's church partnerships, ministries and study series are all still unconfirmed. Blocks D, E and G promise a specific Saturday morning at specific times and a person who will meet the reader there. §8.1 raises the service times; extend it: **the meet-you-there promise in `sab.g.lead` and `sab.e.2.d` needs a named human who has agreed to it, per region, before it is published in nine languages.**
- §8.4 is correct and confirmed: `index.html` line ~452 (`beliefs.r3`) reads `Genesis 2:2-3`; align to `Genesis 2:1-3` while in the file.
- §8.2 is now resolved: "after eight in midsummer" **is** confirmed for Delray Beach (8:16–8:17 PM late June) and **is false** for Pensacola (7:55 PM maximum). Do not soften it — regionalise it, per S1.