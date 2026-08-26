# CONTENT BRIEF — "Sabbath" section
**Site:** Florida Advent Missionaries (single page, 9 languages) · **Proposed section id:** `#sabado` (matches existing Spanish-id convention: `inicio, quienes, cristo, libro, creencias, estudios…`) · **i18n key prefix:** `sab.*`
**Register check performed against the live `index.html`:** second person, British spelling (`neighbours`, `Saviour`, `honour`, `realise`), no exclamation marks, short sentences, texts cited as `Book 0:0 · Book 0:0` in a `.ref` span.
**Note:** `js/sabbath.js` already exists in the repo — a NOAA sunset calculator for 22 Florida cities with correct `America/New_York` / `America/Chicago` splits. Block C below is written to sit on top of that widget, not to replace it.

---

## 1. RECOMMENDED STRUCTURE

Place the section **between `#creencias` (beliefs) and `#estudios` (Bible studies)**. It is the natural next step after "Why do you worship on Saturday?" and it feeds straight into "Open the Bible with someone who cares". Add a nav item and update `sitemap.xml`.

| # | Block | Purpose | Suggested markup |
|---|---|---|---|
| — | Section head | eyebrow + title + lead | `.section-head.center` (as elsewhere) |
| A | **A gift you did not have to earn** | Gospel first. Kills the legalism reading before the reader can form it. | Lead prose + 3 small cards |
| B | **Why the seventh day** | The positive case, three beats, texts visible. Never a comparison with anyone else. | 3 cards with `.ref` lines |
| C | **When it begins where you live** | Sunset to sunset, local, practical. Hosts the existing calculator. | Widget + 2 short paragraphs |
| D | **What a Sabbath actually looks like** | The imaginative payload. Friday sunset to Saturday sunset. | Vertical timeline, reuse `.steps` styling |
| E | **Your first visit** | Five reassurances for a nervous stranger. | Cards or `.accordion` |
| F | **Honest questions** | The four questions people are too polite to ask. | `.accordion` (same pattern as `#creencias`) |
| G | **Come and see** | One WhatsApp CTA + "find a church near you" links. | `.btn-wa.btn-lg` + two outbound links |
| H | **Explore on your own** | Free Sabbath resources in the visitor's language. | Small link list, or fold into existing `#recursos` |

If the page is getting long, merge **E + F** into a single eight-item accordion and keep everything else. Do not cut **A** or **C**: A is what stops the section reading as a rulebook, C is the only genuinely practical thing on the page.

---

## 2. THE COPY (English, ready to translate)

### Section head

- `sab.eyebrow` — **The seventh day**
- `sab.title` — **A day God gave away**
- `sab.lead` — Once a week, from sunset on Friday to sunset on Saturday, we stop. Not because stopping earns us anything, but because Someone who loves us set the time aside and asked us to spend it with Him. This is what that day is, why we keep it, and what it would look like if you joined us for one.

---

### Block A — A gift you did not have to earn

- `sab.a.title` — **A gift you did not have to earn**
- `sab.a.lead` — If you take one thing from this page, take this: the Sabbath is not how anyone gets saved. Jesus already did that, and He did not leave a balance for you to pay. Salvation is a gift received by faith, and everything that follows — including this day — is the response of someone who has already been rescued, not the price of the rescue.
- `sab.a.1.t` — **Rest came before work**
  `sab.a.1.d` — The first full day Adam and Eve lived was a day of rest. They had not built anything, earned anything or proved anything yet. That is the order God set at the very beginning, and He has never reversed it.
  `sab.a.1.r` — Genesis 2:1-3
- `sab.a.2.t` — **Freedom came before the commandment**
  `sab.a.2.d` — When God gave Israel the Ten Commandments, they were already free. He brought them out of slavery first and gave them the law afterwards, as a way to live in the freedom they had been handed. Grace has always come first.
  `sab.a.2.r` — Deuteronomy 5:12-15
- `sab.a.3.t` — **Made for you, not against you**
  `sab.a.3.d` — Jesus said the Sabbath was made for people, not people for the Sabbath. Where it has been turned into a list of things you may not do, it has been misused — and He said so plainly to the religious people of His own day.
  `sab.a.3.r` — Mark 2:27-28 · Matthew 12:1-12
- `sab.a.close` — So we do not keep this day to be accepted. We keep it because we already are.

---

### Block B — Why the seventh day

- `sab.b.title` — **Why the seventh day**
- `sab.b.lead` — This is our answer, given the way we would give it over coffee. It is not an argument with anyone else's Sunday, and we will say more about that further down.
- `sab.b.1.t` — **It was there before any religion existed**
  `sab.b.1.d` — Before there was a temple, a nation or a church, there was a seventh day that God rested on, blessed and set apart. It belongs to the world, not to one people. That is where we start, because that is where the Bible starts.
  `sab.b.1.r` — Genesis 2:1-3
- `sab.b.2.t` — **It is the one commandment that begins "Remember"**
  `sab.b.2.d` — In the middle of the Ten Commandments, God asks us to remember something — a day, a Maker, and the fact that we are not machines. We take that request at face value.
  `sab.b.2.r` — Exodus 20:8-11
- `sab.b.3.t` — **Jesus kept it, and He called it His**
  `sab.b.3.d` — Luke records that going to worship on the Sabbath was Jesus' custom. He spent those hours healing people and doing good, and He called Himself Lord of the Sabbath. We would rather follow His practice than improve on it.
  `sab.b.3.r` — Luke 4:16 · Mark 2:28 · Isaiah 58:13-14

---

### Block C — When it begins where you live

- `sab.c.title` — **When it begins where you live**
- `sab.c.lead` — In the Bible a day runs from evening to evening, and evening is when the sun goes down. So the Sabbath begins at sunset on Friday and ends at sunset on Saturday. Not at six o'clock, not at midnight — at the actual sunset outside your window, which moves a little every week.
- `sab.c.body` — That means the day starts at a slightly different moment in Pensacola than in Key West, and the Panhandle west of the Apalachicola River is on Central time as well. Choose your city below and you will see this Friday's and this Saturday's sunset for your part of the state.
- `sab.c.note` — Printed sunset times are close, not exact — cloud, terrain and the horizon itself move them by a minute or so. Nobody here is timing you. Most of us simply give the edges of the day a little room, finishing on Friday afternoon rather than at the last second.
- `sab.c.link` — Sunset times for the whole year, city by city → *(link: Florida Conference sunset calendar)*
  `sab.c.scripture` — Genesis 1:5 · Leviticus 23:32 · Mark 1:32

---

### Block D — What a Sabbath actually looks like

- `sab.d.title` — **What a Sabbath actually looks like**
- `sab.d.lead` — Nobody hands you a schedule when you arrive, and no two families do this identically. But if you spent a Sabbath with one of ours, it would probably run something like this.

*(Timeline copy is in section 3 below — it is written to be dropped in as-is.)*

- `sab.d.close` — Under all of it there is one idea: for twenty-four hours, nothing is owed. Not to a boss, not to a client, not to your own list. That is not an achievement to reach. It is a gift already given, waiting each week for whoever will take it.

---

### Block E — Your first visit

*(Full copy in section 4 below.)*

- `sab.e.title` — **If you have never been to a church like ours**
- `sab.e.lead` — Walking into an unfamiliar church is one of the more exposed things a person can do. Here is exactly what happens, so that none of it has to be a surprise.

---

### Block F — Honest questions

- `sab.f.title` — **Honest questions**
- `sab.f.lead` — These are the four we get most often. We would rather answer them here than have you wonder.

- `sab.f.q1` — **Do I have to keep the Sabbath to be saved?**
  `sab.f.a1` — No. You are saved by trusting Jesus, and nothing else has ever been added to that. We keep this day because we love the One who gave it, the way you would keep an evening free for someone who matters to you. If anyone ever tells you the day is the price of heaven, they have got the gospel backwards.
  `sab.f.r1` — Ephesians 2:8-9 · Romans 3:28

- `sab.f.q2` — **What about Christians who worship on Sunday?**
  `sab.f.a2` — They are our brothers and sisters, and we are not their judges. We are not here to attack anyone's worship or to tell you that your family's church is wrong about everything. We are here to show you what we found in Scripture and let you read it for yourself, before God, at your own pace. Whatever you conclude, you will still be welcome at our table.
  `sab.f.r2` — Romans 14:4-5 · Acts 17:11

- `sab.f.q3` — **So what do you actually do — and not do?**
  `sab.f.a3` — We set aside the ordinary business of the week: paid work, shopping, errands, the things that can wait until Sunday. What fills the space is worship, family, a long meal, time outdoors, and visiting people who are ill or alone. Helping someone was never the exception to this day — Jesus healed on it, deliberately. There is no official list of prohibitions, and our own church has warned for decades against writing one. How it looks in your home will depend on your work, your family and your own conscience.
  `sab.f.r3` — Isaiah 58:13-14 · Matthew 12:12

- `sab.f.q4` — **My job needs me on Saturdays. Does that shut me out?**
  `sab.f.a4` — Not at all, and please do not let it stop you from coming. Nurses, carers and emergency workers are on duty every Sabbath, and always have been — illness does not keep a calendar. Others work out shift swaps with an employer over time, and some never can. Come as your life actually is. If it would help to talk it through with someone who has been there, write to us.

---

### Block G — Come and see

- `sab.g.title` — **Come and see one for yourself**
- `sab.g.lead` — Reading about a day only gets you so far. Tell us your city and the language you are most comfortable in, and we will point you to a congregation near you — or one of us will simply meet you there and sit with you, so you never have to walk in alone.
- `sab.g.cta` — **Ask about visiting a Sabbath**
- `sab.g.alt` — You can also look one up yourself: *(links)* Florida Conference church locator · Southeastern Conference church map
- `sab.g.note` — Between them, these two directories cover most of the state. Some congregations belong to one, some to the other, and many towns have both. If neither shows something near you, write to us and we will find it.

---

### Block H — Explore on your own

- `sab.h.title` — **Take it further on your own**
- `sab.h.lead` — Everything below is free, and none of it asks for your money or puts you on a list. If you would rather read quietly for a few months before speaking to anyone, that is a perfectly good way to do this.

*(Link copy and exact URLs in section 5.)*

---

### Closing line (optional, sits under the section)

- `sab.close` — "Come to me, all you who are weary and burdened, and I will give you rest." That invitation was not for the people who had earned a break. It was for the ones who could not go on. If that is you this week, the day is yours as much as anyone's.
  `sab.close.r` — Matthew 11:28

---

## 3. THE TIMELINE — "Friday sunset to Saturday sunset"

Times are the common pattern, not a rule. **Every congregation publishes its own; the 9:30 / 11:00 pattern is the most frequent one in Florida but 9:45 and 10:45 also exist. Use the real times of the congregations you actually send people to.**

**FRIDAY — the day before**
- `sab.t.1.time` — **Friday afternoon**
  `sab.t.1.d` — Called the preparation day, and it earns the name. Shopping, cooking, laundry, the last emails — finished early on purpose, so that nothing is hanging over the evening. Houses get tidied. Old arguments, where possible, get settled.
- `sab.t.2.time` — **About half an hour before sunset**
  `sab.t.2.d` — Work stops. Phones go down. Somebody puts a tablecloth on. In Florida that moment lands around 5:40 in early January and after eight in midsummer, which is why the sunset time on this page changes every week.
- `sab.t.3.time` — **Sunset**
  `sab.t.3.d` — The family gathers — a hymn, a few verses, a prayer, and each person says something about their week. Ten minutes in some homes, an hour in others. It is the moment everything else is set down. You will hear people say "Happy Sabbath" to each other from here on.
- `sab.t.4.time` — **Friday evening**
  `sab.t.4.d` — A simple meal, usually soup and bread, cooked earlier. No screens. Many churches also hold an informal evening gathering called vespers — singing, prayer, someone telling the story of their week. Anyone can come to it.

**SATURDAY — the day itself**
- `sab.t.5.time` — **9:30 a.m. — Sabbath School**
  `sab.t.5.d` — Not a school and not for children only. Everyone sings together for a few minutes, someone reads a short report about mission work somewhere in the world, and then people split into small groups to study the same Bible passage that Adventists everywhere are studying that week. Groups run about forty-five minutes, and there are classes for every age from babies upward. Guests are welcome to sit and listen without saying a word.
- `sab.t.6.time` — **11:00 a.m. — The main service**
  `sab.t.6.d` — Roughly seventy-five to ninety minutes. Welcome, singing — anything from old hymns to a band, depending on the congregation — prayer, a Bible reading, the offering, a short story told to the children at the front, and a sermon of twenty to forty minutes. That is the whole shape of it.
- `sab.t.7.time` — **12:30 p.m. — Lunch together**
  `sab.t.7.d` — On many Sabbaths, though not every one, everybody stays for a shared meal. People bring a dish in the morning; the food is usually vegetarian so that nobody is left out. Guests bring nothing and, at more than one church we know, go first in the queue.
- `sab.t.8.time` — **Saturday afternoon**
  `sab.t.8.d` — The quietest and, for a lot of us, the best part. A walk somewhere green, a nap, reading, singing round a piano. Or a visit — to someone in hospital, someone newly widowed, someone who has not had a knock at the door all week. This is not the leftover half of the day. It is the half most people remember.
- `sab.t.9.time` — **Twenty minutes before sunset**
  `sab.t.9.d` — People gather again, often outside. Prayer, a hymn, and thanks for the day that is ending.
- `sab.t.10.time` — **Sunset**
  `sab.t.10.d` — The Sabbath closes and the week begins. Nobody switches abruptly back into ordinary life — most of us let the evening stay quiet and carry a little of the day into Monday.

---

## 4. FIVE REASSURANCES (Block E copy)

- `sab.e.1.t` — **What do I wear?**
  `sab.e.1.d` — Whatever you own. You will see suits, jeans, dresses and work clothes in the same row. The usual advice members give each other is to dress as you would to meet someone you care about, and that covers a very wide range. Nobody will look at your shoes.

- `sab.e.2.t` — **What happens when I walk in?**
  `sab.e.2.d` — Someone at the door will say "Happy Sabbath", hand you a printed programme and ask if you need anything. That greeting is just what Adventists say to each other on a Saturday; it means they are glad you came. You will not be asked to stand up, introduce yourself, or say anything in front of the room. If greeting a stranger at the door is more than you want, tell us and one of us will meet you in the car park and go in with you.

- `sab.e.3.t` — **They will pass a plate. What do I do?**
  `sab.e.3.d` — Pass it on. Giving is how members support the work, and it is entirely voluntary for a guest — nobody counts, nobody notices, and there is no envelope with your name on it. You are our guest. We are not going to charge you for a morning.

- `sab.e.4.t` — **What about my children?**
  `sab.e.4.d` — They are genuinely wanted there. Most churches run Bible classes by age group, from babies through to teenagers, during the first hour, and someone will help you sign them in when you arrive. In the main service there is a short story told to the children at the front. If a baby needs feeding or a toddler needs a break, most buildings have a side room, often with the service on a screen. Crying is not a problem here.

- `sab.e.5.t` — **How long will this take, and can I leave?**
  `sab.e.5.d` — About an hour for the Bible-study hour and about ninety minutes for the main service, so a full morning runs from around half past nine to half past twelve. You can come for only one part. You can slip out at any point. Nobody will chase you to the door, and nobody will phone you on Monday unless you asked them to.

- `sab.e.6.t` — *(optional sixth, worth including)* **One thing worth knowing in advance**
  `sab.e.6.d` — About four times a year the service includes Communion, and before it many congregations hold a short foot-washing — men and women in separate rooms, washing one another's feet the way Jesus did for His disciples. If that lands on the day you visit and you would rather not take part, you are under no obligation at all. You are welcome to stay in your seat and watch, and no one will think anything of it.

---

## 5. VERIFIED FREE RESOURCES (exact URLs)

**Sabbath-specific, and safe to link**

| Resource | URL | Note for the build |
|---|---|---|
| Sabbath School study guide, free, 91 languages — **all nine site languages present** | `https://sabbath-school.adventech.io/` | The single best multilingual pick. Per-language reader: `/en /es /fr /ht /pt /de /nl /ru /uk` |
| Kreyòl Ayisyen study on rest in Christ — *Repo nan Kris la* | `https://sabbath-school.adventech.io/ht/2021-03` | **The only Haitian Creole resource that exists.** It is from 2021 — present it as a study, never as "this quarter's lesson". Includes a Haitian Creole Bible text |
| Ukrainian, current quarter | `https://sabbath-school.adventech.io/uk` | Fully current |
| Russian, current quarter | `https://sabbath-school.adventech.io/ru` | Fully current |
| Adult Bible Study Guide (official) | `https://absg.sspmadventist.org/` | Use this, **not** `absg.adventist.org` (two redirects) |
| Free Bible course on this exact question, "Does It Matter Which Day I Worship?" | `https://hope.study/en/courses/DoesItMatterWhichDayIWorship` | States free access always |
| Hope.Study in other languages | `https://espoir.hope.study/fr/` · `https://mehrfinden.com/de/` · `https://ca-po.hope.study/pt/` · `https://clasebiblica.org/es/` · `https://bible.ua/uk/` | No Russian, Dutch or Kreyòl edition exists |
| Discover Bible School (Voice of Prophecy) | `https://bibleschools.com/en/` | **Never link `biblestudies.com`** — expired certificate, HTTP 500 |
| Discover Bible School, Russian | `https://languages.bibleschools.com/russian/` | |
| Dutch Bible course | `https://esda-instituut.nl/` | |
| Ellen G. White library, free | `https://egwwritings.org/` | EN 1504 · ES 124 · PT 115 · RU 111 · DE 59 · FR 55 · UK 37 (+20 audiobooks) · NL 17 titles. **No Haitian Creole** |
| Adventist World Radio | `https://awr.org/listen` | Ukrainian is exceptionally strong (27 programmes). **No Dutch, no Haitian Creole** |
| Hope Channel, international | `https://hopetv.org/global-networks` | **Not `hopechannel.com`** — that is Hope Channel Australia |
| Hope Channel Ukrainian / Russian | `https://tv.hope.ua/` · `https://hopetv.ru/` | |
| 3ABN (EN/ES/PT/RU/FR) | `https://3abn.org/about.html` | **Not `/networks/`** — that is a 404 |
| Florida sunset calendar, whole year | `https://floridaconference.com/sunset-calendar/` · PDF: `https://floridaconference.com/wp-content/uploads/2025/12/2026-Calendar.pdf` | Covers Tallahassee, Tampa, Ft. Myers, Jacksonville, Orlando, Miami — all Eastern time. **Does not cover the western Panhandle** |
| Find a church — Florida Conference | `https://floridaconference.com/locator/` | 281 Florida congregations, 87 of them Spanish-language |
| Find a church — Southeastern Conference | `https://www.secsda.org/resources/find-a-church/` | 174 congregations; 50 are French/Haitian Creole |
| The church's own official Sabbath document | `https://gc.adventist.org/documents/sabbath-observance/` | Fine for human visitors; returns 403 to link-checkers |

**Language reality to build around (the site promises nine languages):**
Kreyòl Ayisyen is served by **exactly one** free official Sabbath resource — the study guide above. There is no Kreyòl Hope Channel, no Kreyòl radio, no Kreyòl Ellen White library and no Kreyòl Bible course. Do not build a Kreyòl resource list that implies parity; offer the one real thing plus French as the practical fallback, and say so honestly. Ukrainian and Russian, by contrast, can be promoted with confidence — current lessons, TV, radio and courses all exist.

**Link-checker warning for whoever runs the build:** `hopetv.org`, `egwwritings.org`, `gc.adventist.org` and `adventistreview.org` return 403/429 to automated clients while working perfectly in a browser. They will show up as false failures. Verify by hand before deleting anything.

---

## 6. STATEMENTS THE SITE MUST AVOID

1. **Anything implying the Sabbath is required for salvation, or that keeping it earns favour.** The church's own belief statement says salvation is all of grace and obedience is its fruit. Getting this wrong contradicts the site's own answer #2 in the beliefs accordion.
2. **Any polemic about Sunday** — Constantine, "the church changed the day", "the mark of the beast", "the only true church". The Constantine claim is genuinely contested by historians, the end-time framing is easily misread as condemning the reader's own family, and none of it belongs on a welcome page. State the positive case and stop.
3. **A list of prohibitions presented as rules.** The church's own 1990 document warns that developing lists of Sabbath prohibitions is "counterproductive to a sound spiritual experience" and says the church "cannot be conscience for the members". Write abstentions as widely shared practice varying by conviction and circumstance, never as a membership test.
4. **"Florida is in the Eastern time zone."** Ten Panhandle counties are Central, and Gulf County is split — Wewahitchka Central, Port St. Joe Eastern. A single statewide sunset time would be an hour wrong for Pensacola. (`js/sabbath.js` already handles this correctly; the copy must not undo it.)
5. **A sunset minute presented as a hard legal boundary.** Published times can be a minute or more out even in perfect conditions. Second-level precision invites exactly the legalism the church's own documents warn against.
6. **"6 p.m. to 6 p.m."** That was early Adventist practice in the 1800s, not current counsel.
7. **"24 million Adventists worship every Sabbath."** 24.4 million is the membership roll as of 31 December 2025; average weekly attendance worldwide is about 9.7 million. Never equate the two.
8. **"Adventists live ten years longer."** The published gap versus the general Californian population is 7.3 years for men and 4.4 for women; "ten years" is a comparison *between* Adventists. Safest wording if it is ever used: "four to ten years longer than other Californians, depending on sex and diet."
9. **Any number of years of life attributed to the Sabbath.** No study isolates it. What exists is an association with better self-reported *mental* well-being. Say "Adventists describe it as a weekly release from pressure", not a lifespan claim.
10. **Any prevent/treat/cure language** about diet, rest or the health message, for cancer, diabetes, heart disease or anything else. All the underlying evidence is observational.
11. **"The Adventist Church operates AdventHealth."** AdventHealth is a separate nonprofit corporation sponsored within the denominational structure. The conference and the hospital system are distinct legal entities.
12. **"Two conferences divide Florida."** They overlay the same ground — a regional conference is constituency-based, not territory-exclusive, and one town can have congregations of both. This is the single most common error on the topic. Also do not describe the Southeastern Conference in the present tense as segregated, or flatly as "for Black Adventists" — 29% of its congregations are Haitian and at least 27 are Spanish.
13. **"Florida is moving to permanent daylight saving time."** As of 26 August 2026 nothing is law: H.R. 139 passed the House 308-117 on 14 July 2026 and awaits the Senate. Clocks still change, next on 1 November 2026. If any DST line appears on the site, date-stamp it.
14. **"Visitors are not expected to give"** as if it were published church policy. No official page says that. Say giving is voluntary and invite the guest to pass the plate along — which is what the copy above does.
15. **Never link** `biblestudies.com` (expired placeholder certificate, HTTP 500 — visitors get a full-page security warning), `flcoe.org` (hijacked, now serves gambling spam), `hoopkanaal.org`, `3abn.org/networks/`, or an "Adventist Review sunset calendar" (404).
16. **Do not claim** Adventist Review has Spanish or French editions (it is a machine-translation widget), that EGW Writings offers Haitian Creole (the one "ht" title is a Portuguese-based creole), or that Adventist World Radio broadcasts in Kreyòl or Dutch (zero programmes in either).

---

## 7. WORLDWIDE FACTS WORTH SURFACING ELSEWHERE ON THE SITE

Use these in `#quienes` (who we are), `#recursos`, or a small stat strip. **Every figure needs its year attached** — two different "latest years" are currently in play.

**Safe and useful, as of 31 December 2025** (source: General Conference Office of Archives, Statistics and Research, 2026 Annual Statistical Report advance release)
- **24,372,139 baptized members** worldwide — up 687,902 on the year, a growth rate of 2.90%.
- **106,936 churches and 78,061 smaller congregations.**
- **Average weekly attendance about 9.7 million.** Pair this with the membership figure whenever both appear; it is the honest way to describe the church's active size.
- **Florida Conference: 238 churches, 50 companies, 76,100 members.** **Southeastern Conference: 159 churches, 15 companies, 51,143 members.** Combined, roughly 397 churches and 127,243 members — but say "approximately", because the Southeastern figure includes southern Georgia and neither covers the western Panhandle.
- Growth is concentrated in Africa: the three African divisions held **11.6 million members, 47.7% of the world church**.

**As of 31 December 2024** (institutional data lags membership by a year — label it 2024, never "current")
- **10,363 schools with 2,457,694 students.** Do not use the "7,500 schools / 1.5 million students" figure that still appears on some Adventist sites; it is badly out of date.
- **596 healthcare institutions**, including 199 hospitals, with US$904,924,342 in charity care. Never present the hospital count as a decline from 2023 — the counting method changed.
- **ADRA**, the church's relief agency, ran **1,116 projects reaching 10,844,023 people in more than 118 countries**, on a budget of US$248.5 million. Founded in 1956 as the Seventh-day Adventist Welfare Service, renamed ADRA in the early 1980s.
- Work in **420 languages, publications in 295** — not the "700+ languages" figure some Adventist sites still carry.

**Useful for a Florida page specifically**
- Spanish is the largest language bloc in the Florida Conference: **87 of its 281 listed congregations**, retrieved from the conference's own locator, August 2026.
- Statewide there are roughly **68 French / Haitian Creole congregations** — 50 in the Southeastern Conference and 18 in the Florida Conference. This is a strong, concrete argument for the site's own nine-language approach.
- Beyond those, Florida has Korean, Filipino, Vietnamese, Burmese, Romanian, Brazilian Portuguese and Hebrew-Messianic congregations. The state's Adventist community already looks like the site's language list.

**Verified in the fact-check pass, so quotable with confidence**
- Adventist health work in North America is organised into five systems — AdventHealth, Adventist Health, Adventist HealthCare, Kettering Health and Loma Linda University Health — within a worldwide denomination of over 23 million members *(North American Division, 12 July 2025; note explicitly that "over 23 million" is the **global** membership, not a North American one)*.
- The Florida Conference's own weekly sunset table for 3 January 2026 shows Tallahassee 5:50, Tampa 5:48, Ft. Myers 5:48, Jacksonville 5:40, Orlando 5:42, Miami 5:44 — six cities, all Eastern time, ten minutes apart. That spread is genuine local-horizon variation and is the cleanest possible illustration for Block C.

---

## 8. VERIFY BEFORE PUBLISHING (short list for a human)

1. **Service times.** Do not publish 9:30 / 11:00 as "the" Adventist schedule — confirm the actual times of the congregations Florida Advent Missionaries actually refers people to, and put those on the page.
2. **Sunset range in Block D.** "Around 5:40 in early January" is confirmed against the Florida Conference table; "after eight in midsummer" was not independently checked — verify it against the output of `js/sabbath.js` for Delray Beach before publishing, or soften it to "well past seven".
3. **If you decide to quote the church's belief statement verbatim,** the current wording opens "The gracious Creator…" — the 2015 General Conference Session replaced "beneficent" with "gracious". Several Adventist sites, including the North American Division's own beliefs page, still show the old word. Take the text from the General Conference booklet at `https://www.adventistarchives.org/fundamental-beliefs-of-seventh-day-adventists.pdf`, not from a division page.
4. **The existing belief answer #3** in `#creencias` cites Genesis 2:2-3; the church's own reference list for this belief is Genesis 2:1-3. Worth aligning while you are in the file.
5. **Ellen G. White.** The site currently never names her, and this brief deliberately keeps it that way — she needs explaining to a newcomer, and she is a contested figure outside Adventism. If the team wants her included, quote the book and page ("*The Desire of Ages*, 1898") rather than presenting her as an authority the reader is assumed to accept, and keep it to one line.
6. **Any DST or "as of" statement** should carry a date and be rechecked before each clock change.