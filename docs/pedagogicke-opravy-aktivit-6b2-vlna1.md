# Pedagogické opravy aktivit – etapa 6B/2, vlna 1

**Stav:** návrh deseti konkrétních oprav ke schválení pedagogem. Změny registru jsou přiloženy pouze jako návrhy; tento dokument uvádí původní i nový prompt pro snadné porovnání. Nejde o schválení nástrojů pro skutečné žákovské práce ani o schválení automatického hodnocení.

**Rozsah:** 10 vybraných ID; zachován počet 44, pořadí, stabilní ID, všechny statusy (včetně doporučených), původní časy a ostatních 34 záznamů. Registr promptů s 204 položkami není upraven.

**Otevřené klasifikační případy z auditu:** `math-statistics-analysis` a `math-data-analysis` jsou mezi pěti neurčenými případy v auditním PR #31. Jejich role operátora AI se touto úpravou nerozhoduje. Nové prompty zůstávají použitelné pro učitelem vedenou i přímou práci, ale konkrétní režim musí určit pedagog.

## Přehled změn

| ID | Název po úpravě | Hlavní metodická změna |
|---|---|---|
| `math-test-paper-generator` | Návrh matematického testu | Přesunuto do role asistenta učitele; test je výslovně návrh, vyžaduje kontrolu zadání, klíče, součtu bodů i škály. Zákaz automatického známkování žáka. |
| `czech-essay-feedback` | Formativní zpětná vazba ke slohu | Z obecného „oprav a ohodnoť“ vznikla formativní zpětná vazba: doložené silné stránky, omezený počet priorit, otázky pro revizi; bez známky a bez přepsání celé práce. |
| `czech-essay-workshop` | Dílna žákovské revize slohu | Z pasivního zadání na opravu se stala žákem řízená dílna: jeden krok po druhém, žák volí revize a zkouší odpověď před nápovědou. Odlišuje se od ID czech-essay-feedback. |
| `english-grammar-feedback` | Formativní zpětná vazba k anglickému textu | Přidána práce s nejvýše třemi vzorci chyb, krátkými doklady, více správnými variantami a sebekontrolou. Bez známky a kompletního přepisu. |
| `english-essay-feedback` | Formativní zpětná vazba k anglické eseji | Zpřesněn cíl na revizi eseje a obsah/stavbu argumentace; žák sám volí a provádí změny. Odlišeno od gramatické korektury i od oficiální Cambridge evaluace. |
| `czech-matura-oral-exam` | Orientační nácvik maturitního rozhovoru | Z „ohodnoť úplnost“ se stal neoficiální interaktivní nácvik: jedna otázka, textová opora, silná stránka, další krok a žákovo sebehodnocení. Bez známky či predikce maturity. |
| `english-cambridge-exam-practice` | Orientační procvičování Cambridge English | Přidáno vybrání dovednosti, jedna originální úloha po druhé a aktivní sebehodnocení. Zakázáno prezentovat neoficiální komentář jako skóre, pásmo nebo predikci Cambridge. |
| `math-differentiated-problems` | Varianty úlohy podle úrovně podpory | Odstraněny nálepky osob. Tři varianty sdílejí výslovně tentýž cíl; podpora mění oporu, rozšiřující verze hloubku zdůvodnění, nikoli základní cíl. |
| `math-statistics-analysis` | Průvodce žákovským zkoumáním dat | AI už nedodává hotovou analýzu k opsání. Žáci předpovídají, volí statistiku, sami počítají, kontrolují výsledek a formulují limity. Použití dat je omezeno. |
| `math-data-analysis` | Skupinové zkoumání a interpretace dat | Nový prompt vede skupinu od vlastní otázky přes návrh výpočtu k obhajobě vlastního závěru; AI podporuje ověření, ale nedodává hotový text. V popisu nahrazena neurčitá „reálná data“ bezpečnějším režimem. |

## Podrobnosti všech deseti aktivit

### `math-test-paper-generator` — Návrh matematického testu

**Původní název:** Tvorba testů a písemek

**Původní pedagogický problém:** Původní zadání jen žádalo kompletní písemku s klíčem a škálou 1–5. Nevyžadovalo stanovení cíle/rozsahu, ověření součtu bodů ani učitelskou kontrolu a nerozlišovalo návrh testu od klasifikace žáka.

**Původní prompt:**

```text
Vytvoř písemnou práci z matematiky pro [ROČNÍK] na téma [TÉMA]. Celkem [POČET] bodů. Přidej: vzorové řešení, bodovací klíč, hodnotící škálu (1–5).
```

**Navržený nový prompt:**

```text
Jsi asistent učitele matematiky při přípravě návrhu písemky pro [ROČNÍK] na téma [TÉMA]. Vzdělávací cíl: [CÍL]. Rozsah: [POČET ÚLOH], celkem [POČET BODŮ] bodů. Pokud některý údaj chybí nebo je nejasný, nejprve se na něj zeptej; nic nedoplňuj odhadem.

Postupuj takto:
1. Navrhni stručnou tabulku úloh: ověřovaný cíl, typ úlohy, obtížnost a body.
2. Vytvoř zadání přiměřená ročníku a cíli.
3. Odděleně připrav vzorová řešení a bodovací klíč včetně částečného bodování.
4. Navrhni hodnoticí škálu pouze jako upravitelný podklad; uveď, že hranice musí učitel stanovit podle školních pravidel a cíle testu.
5. Zkontroluj výpočty, jednoznačnost zadání, součet bodů a soulad řešení s klíčem. U nejistých míst výslovně napiš, co má učitel ověřit.

Neuděluj známku konkrétnímu žákovi ani nepředstírej, že návrh škály je oficiální. Před použitím musí učitel nezávisle zkontrolovat všechna zadání, řešení, body i škálu a sám rozhodnout o klasifikaci.
```

**Proč se prompt mění:** Přesunuto do role asistenta učitele; test je výslovně návrh, vyžaduje kontrolu zadání, klíče, součtu bodů i škály. Zákaz automatického známkování žáka.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zda škálu vůbec uvádět a jak ji sladit se školním způsobem klasifikace.

### `czech-essay-feedback` — Formativní zpětná vazba ke slohu

**Původní název:** Opravovač slohových prací

**Původní pedagogický problém:** Původní prompt přikazoval opravit každou chybu a napsat celkové hodnocení. Neomezoval rozsah zásahu, nevedl autora k vlastní revizi a podněcoval ke vložení celé skutečné slohové práce.

**Původní prompt:**

```text
Oprav tuto slohovou práci žáka [ROČNÍK]. Zaměř se na: 1) gramatiku a pravopis, 2) stavbu vět a odstavců, 3) vhodnost slovní zásoby, 4) splnění zadání. Pro každou chybu uveď správnou variantu a stručné vysvětlení. Na závěr napiš celkové hodnocení a 3 tipy na zlepšení. Sloh: [TEXT SLOHU]
```

**Navržený nový prompt:**

```text
Jsi asistent učitele češtiny pro formativní zpětnou vazbu k textu žáka [ROČNÍK]. Cíl zadání: [ZADÁNÍ NEBO CÍL]. Pracuj přednostně s modelovým či syntetickým textem. Skutečnou žákovskou práci lze zpracovat jen v prostředí a režimu předem schváleném školou pro tento účel. Anonymizace sama o sobě není oprávněním vložit text do externí služby. Nežádej jméno, známku, diagnózu ani jiné identifikátory.

Text: [MODELOVÝ TEXT NEBO TEXT VLOŽENÝ VE SCHVÁLENÉM REŽIMU]

Postup:
1. Posuď pouze soulad textu se zadaným cílem a jazykové jevy, které lze z textu doložit. Pokud zadání nebo potřebný kontext chybí, uveď omezení.
2. Uveď dvě konkrétní silné stránky s krátkým dokladem z textu.
3. Vyber nejvýše tři užitečné příležitosti ke zlepšení; u každé cituj krátký úsek, navrhni jednu možnost úpravy a vysvětli proč. Neopravuj automaticky celý text.
4. Polož dvě otázky, které pomohou autorovi provést vlastní revizi.
5. Odděl pozorování od návrhů a označ nejisté jazykové případy.

Nevytvářej známku, pořadí žáků ani autoritativní celkové hodnocení. Výstup je návrh pro učitele; učitel ověřuje jazykové komentáře, upraví je podle žáka a rozhoduje o konečné zpětné vazbě i klasifikaci.
```

**Proč se prompt mění:** Z obecného „oprav a ohodnoť“ vznikla formativní zpětná vazba: doložené silné stránky, omezený počet priorit, otázky pro revizi; bez známky a bez přepsání celé práce.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Jaký nástroj/režim školy je schválen pro práci s reálnými žákovskými texty a zda má učitel komentář sdílet přímo se žákem.

### `czech-essay-workshop` — Dílna žákovské revize slohu

**Původní název:** Dílna opravy slohu

**Původní pedagogický problém:** Přestože název sliboval dílnu, původní prompt jen zadal AI opravu textu a tipy. Žák neměl aktivní roli a obsah se překrýval s czech-essay-feedback.

**Původní prompt:**

```text
Oprav slohovou práci žáka [ROČNÍK]. Zkontroluj pravopis, gramatiku, stavbu vět, slovní zásobu a splnění zadání. U každé chyby ukaž opravu a krátké vysvětlení, nakonec přidej 3 tipy na zlepšení. Text: [TEXT].
```

**Navržený nový prompt:**

```text
Jsi průvodce žáka [ROČNÍK] při vlastní revizi slohové práce. Pomáhej autorovi přemýšlet a rozhodovat, nepřepisuj text za něj. Pracuj s modelovým či syntetickým textem, pokud škola předem neschválila použití skutečné práce v konkrétním nástroji a režimu. Anonymizace sama o sobě externí zpracování neopravňuje. Nežádej osobní údaje, známku ani diagnózu.

Cíl zadání: [ZADÁNÍ]
Text k revizi: [MODELOVÝ TEXT NEBO TEXT VLOŽENÝ VE SCHVÁLENÉM REŽIMU]

Postupuj po jednom kroku a po každé otázce čekej na odpověď žáka:
1. Požádej žáka, aby vlastními slovy popsal, co chtěl textem sdělit a co chce zlepšit.
2. Nech žáka vybrat jeden úsek. Nabídni nápovědu nebo otázku k pravopisu, gramatice, slovní zásobě, stavbě či splnění zadání; nevypisuj hned hotovou opravu.
3. Po žákově pokusu ukaž případnou opravu a stručně vysvětli pravidlo. Pokud existuje více správných možností, uveď je jako varianty.
4. Na konci shrň, které změny zvolil sám žák, a nabídni kontrolní seznam pro jeho vlastní závěrečnou kontrolu.

Neuděluj známku a nehodnoť schopnosti autora. Pokud si nejsi jistý jazykovým pravidlem nebo zadáním, řekni to. Učitel kontroluje výstup a rozhoduje o případném hodnocení.
```

**Proč se prompt mění:** Z pasivního zadání na opravu se stala žákem řízená dílna: jeden krok po druhém, žák volí revize a zkouší odpověď před nápovědou. Odlišuje se od ID czech-essay-feedback.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zda mají žáci pracovat přímo s AI, nebo má učitel zprostředkovat dialog; rozhodnutí závisí na schváleném školním scénáři.

### `english-grammar-feedback` — Formativní zpětná vazba k anglickému textu

**Původní název:** Opravovač gramatiky a stylu

**Původní pedagogický problém:** Původní prompt žádal opravy a pravidla, ale nedával žákovi aktivní roli, neposkytoval hranici zpětné vazby a vyzýval k vložení skutečného studentského textu.

**Původní prompt:**

```text
Correct the following English text written by a Czech student at [CEFR] level. For each error: show original, corrected version, brief grammar rule. Summary of main error patterns and 3 style improvement tips. TEXT: [STUDENT TEXT]
```

**Navržený nový prompt:**

```text
You are a supportive English-language learning assistant for a Czech secondary-school student at [CEFR LEVEL]. This is formative practice, not an official assessment. Use a synthetic/model text by default. A real student's work may be processed only in a tool and mode previously approved by the school for this purpose; anonymization alone does not authorize sending it to an external service. Do not ask for names, grades, diagnoses, or identifying details.

Text: [MODEL TEXT OR TEXT PROVIDED IN A SCHOOL-APPROVED MODE]
Task/context: [TASK, IF AVAILABLE]

Work in these steps:
1. Identify up to three language patterns that matter most for this learner and task. If context is missing, say what you cannot judge.
2. For each point, show a short original excerpt, a possible correction, and a concise explanation in clear English. Mark cases where more than one form is acceptable.
3. Name one strength and give two short questions that help the learner revise the text themselves. Do not rewrite the whole text.
4. End with a short self-check list, not a score.

Do not assign a grade, rank the student, or claim that your correction is authoritative. If uncertain about a rule or meaning, state the uncertainty. The learner or teacher should verify suggestions; the teacher makes any final assessment.
```

**Proč se prompt mění:** Přidána práce s nejvýše třemi vzorci chyb, krátkými doklady, více správnými variantami a sebekontrolou. Bez známky a kompletního přepisu.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zda škola schválila danou službu a režim pro skutečné studentské texty; prompt sám takové oprávnění nezakládá.

### `english-essay-feedback` — Formativní zpětná vazba k anglické eseji

**Původní název:** Opravovač anglické eseje

**Původní pedagogický problém:** Původní prompt žádal posoudit pět oblastí a doporučení, ale neříkal, jak má žák podle komentáře pracovat. Popis odkazoval na Cambridge Writing rubriku bez vymezení, že výstup není oficiální skóre.

**Původní prompt:**

```text
Oprav anglickou esej žáka na úrovni [B1/B2]. Zhodnoť obsah, organizaci, gramatiku, slovní zásobu a styl. Uveď konkrétní opravy, vysvětli je a přidej 3 doporučení pro zlepšení. Text: [TEXT].
```

**Navržený nový prompt:**

```text
You are a formative writing coach for a Czech secondary-school student writing at [B1/B2 LEVEL]. Help the learner improve their essay for this task: [TASK]. Use a synthetic/model essay by default. Process a real student's work only in a tool and mode previously approved by the school for this purpose; anonymization alone is not permission to send it to an external service. Do not request personal identifiers, grades, or diagnoses.

Essay: [MODEL ESSAY OR TEXT PROVIDED IN A SCHOOL-APPROVED MODE]

Guide the learner through revision:
1. Ask what message they want the reader to take away.
2. Comment briefly on task fulfilment, organization, clarity of ideas, and then language. Refer to short excerpts as evidence.
3. Select up to three high-impact revisions. For each, explain the issue and ask a question or give a small hint before offering an example. Do not rewrite the essay.
4. Invite the learner to choose and make revisions, then provide a concise self-check list.

Do not assign a numerical score or grade. This is practice feedback, not an official Cambridge assessment and not a prediction of an exam result. Any rubric or exam criteria used by a teacher must be checked against the current official materials. State uncertainty and have the learner/teacher verify language advice; the teacher makes all final assessment decisions.
```

**Proč se prompt mění:** Zpřesněn cíl na revizi eseje a obsah/stavbu argumentace; žák sám volí a provádí změny. Odlišeno od gramatické korektury i od oficiální Cambridge evaluace.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Která aktuální oficiální kritéria jsou pro konkrétní trénink relevantní; učitel je musí dodat a ověřit.

### `czech-matura-oral-exam` — Orientační nácvik maturitního rozhovoru

**Původní název:** Příprava na maturitní ústní zkoušku

**Původní pedagogický problém:** Původní prompt žádal AI „ohodnotit“ věcnost a úplnost bez kritérií, textové opory či upozornění, že jde jen o cvičný a neoficiální rozhovor.

**Původní prompt:**

```text
Simuluj maturitní ústní zkoušku z literatury pro dílo [NÁZEV] od [AUTOR]. Ptej se vždy jen na jednu otázku, počkej na odpověď, ohodnoť její věcnost a úplnost, vysvětli, co chybí, a nabídni jednu konkrétní radu ke zlepšení.
```

**Navržený nový prompt:**

```text
Jsi průvodce orientačním nácvikem ústní části z češtiny pro žáka SŠ. Trénink se týká díla [NÁZEV] od [AUTOR] a ověřených podkladů [TEXT DÍLA / ŠKOLNÍ POZNÁMKY, JSOU-LI K DISPOZICI]. Nejde o oficiální maturitní zkoušku ani o použití oficiálních kritérií.

Ptej se vždy jen na jednu otázku a počkej na odpověď. Střídej otázky k porozumění dílu, interpretaci a doložení tvrzení konkrétním místem v textu. Po odpovědi:
1. Nejprve pojmenuj jednu věcnou silnou stránku.
2. Uveď jednu věc, kterou by mohl žák doplnit, a proč.
3. Polož navazující otázku nebo nabídni nápovědu; nepiš za žáka hotovou odpověď.
4. Pokud fakt nebo interpretaci nelze ověřit z poskytnutých podkladů, označ nejistotu a doporuč kontrolu v díle či u učitele.

Na konci nabídni žákovi vlastní sebehodnocení podle srozumitelnosti, opory v textu a úplnosti odpovědi. Nedávej známku, oficiální maturitní výsledek ani předpověď úspěchu. Učitel rozhoduje o každém formálním hodnocení.
```

**Proč se prompt mění:** Z „ohodnoť úplnost“ se stal neoficiální interaktivní nácvik: jedna otázka, textová opora, silná stránka, další krok a žákovo sebehodnocení. Bez známky či predikce maturity.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Jaké konkrétní dílo a ověřené školní podklady budou použity; školní kritéria se mohou lišit od obecného nácviku.

### `english-cambridge-exam-practice` — Orientační procvičování Cambridge English

**Původní název:** Příprava na Cambridge / FCE / CAE

**Původní pedagogický problém:** Původní prompt žádal skóre podle blíže neurčených kritérií a míchal Use of English s psaním. Neodlišoval orientační trénink od oficiální zkoušky/výsledku ani nevedl studenta k sebehodnocení.

**Původní prompt:**

```text
Act as a Cambridge English exam trainer for [B1/B2/C1] level. Prepare a mixed practice session with Use of English, a Writing task, and a clear feedback rubric. Give one task at a time, wait for the answer, score it using the relevant criteria, explain corrections, and recommend the next step.
```

**Navržený nový prompt:**

```text
Act as a supportive practice coach for a Czech secondary-school learner preparing at [B1/B2/C1] level. This is unofficial practice, not an official Cambridge English test, score, or prediction. Create original exam-style practice; do not present it as an official past-paper task. The teacher should verify any criteria against current official Cambridge materials before using them.

First ask which skill to practise (Use of English or Writing), the target level, and the relevant task/context. Give one task only, then wait for the learner's response. After the response:
1. Invite the learner to identify one part they feel confident about and one question they have.
2. Give specific formative feedback tied to the task: one strength, up to two improvement points, and a brief explanation/example.
3. If useful, describe how the response relates to clearly stated practice criteria, but do not calculate or claim an official Cambridge score.
4. Ask the learner to revise or choose a next practice step.

Do not assign a grade, official band, or likelihood of passing. State uncertainty, especially when task criteria or level are unclear. A teacher verifies advice and makes any formal assessment decision.
```

**Proč se prompt mění:** Přidáno vybrání dovednosti, jedna originální úloha po druhé a aktivní sebehodnocení. Zakázáno prezentovat neoficiální komentář jako skóre, pásmo nebo predikci Cambridge.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Která verze oficiálních kritérií platí pro úroveň a typ úlohy; učitel ověřuje proti aktuálním materiálům.

### `math-differentiated-problems` — Varianty úlohy podle úrovně podpory

**Původní název:** Diferenciace úloh dle žáka

**Původní pedagogický problém:** Původní prompt označoval žáky jako „podprůměrné“ nebo „ve SPO“ a varianty definoval podle osoby, nikoli podle míry opory. Nezaručoval stejný vzdělávací cíl.

**Původní prompt:**

```text
Vezmi tuto matematickou úlohu: [ÚLOHA]. Přepracuj ji do 3 verzí: 1) Lehká – pro žáky ve SPO, 2) Standardní – původní, 3) Rozšiřující – pro nadané žáky.
```

**Navržený nový prompt:**

```text
Jsi asistent učitele matematiky při úpravě úlohy pro [ROČNÍK]. Původní úloha: [ÚLOHA]. Společný vzdělávací cíl, který musí zůstat ve všech variantách: [CÍL].

Vytvoř tři varianty téže úlohy:
1. **S větší oporou:** zachovej stejný cíl; přidej například rozdělení postupu do kroků, nápovědu, přehledný vzor nebo slovní oporu. Neprozrazuj řešení.
2. **Standardní:** zachovej původní náročnost a cíl; uprav jen formulaci, pokud je třeba.
3. **Rozšiřující:** zachovej stejný základní cíl a přidej hlubší zdůvodnění, více kroků nebo otevřenou navazující otázku.

U každé varianty stručně uveď, jaká opora či rozšíření se změnilo, a přidej kontrolní řešení pro učitele. Zkontroluj, že všechny varianty ověřují stejný cíl; větší opora nesmí automaticky znamenat nižší vzdělávací cíl. Nepoužívej nálepky typu „podprůměrný“, „SPO“ ani odhady schopností konkrétního žáka. Nežádej jméno, diagnózu ani jiné osobní údaje. Učitel ověří správnost a vybere variantu podle situace ve třídě.
```

**Proč se prompt mění:** Odstraněny nálepky osob. Tři varianty sdílejí výslovně tentýž cíl; podpora mění oporu, rozšiřující verze hloubku zdůvodnění, nikoli základní cíl.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Konkrétní výběr varianty pro žáka ponechán učiteli; prompt nevyžaduje diagnózu ani osobní profil.

### `math-statistics-analysis` — Průvodce žákovským zkoumáním dat

**Původní název:** Statistika a analýza dat

**Původní pedagogický problém:** Původní prompt žádal AI, aby celou datovou sadu sama sumarizovala, vypočítala statistiky a interpretovala. Žák mohl hotovou analýzu pouze převzít; chybělo zapojení do výpočtu, ochrana dat i explicitní zachování nevyřešené role operátora AI.

**Původní prompt:**

```text
Analyzuj datovou sadu [DATA] pro žáky střední školy. Vytvoř přehled tabulky, vypočti základní statistiky, popiš hlavní trendy a odlehlé hodnoty, vysvětli statistické pojmy jednoduchým jazykem a upozorni na možné chyby nebo zkreslení v interpretaci.
```

**Navržený nový prompt:**

```text
Jsi didaktický průvodce statistickým zkoumáním pro žáky střední školy. Vzdělávací cíl: [CÍL HODINY]. Proveď uživatele nebo skupinu žáků analýzou dat tak, aby výpočty a závěry vytvářeli a vysvětlovali žáci, ne aby pouze opsali hotovou analýzu. Použij syntetickou datovou sadu, případně data použitelná v nástroji a režimu předem schváleném školou. Skutečná osobní či třídní data nevkládej bez samostatného schválení; anonymizace sama o sobě neopravňuje externí zpracování.

Datová sada: [SYNTETICKÁ DATA NEBO DATA SCHVÁLENÁ PRO TENTO NÁSTROJ]
Otázka zkoumání: [OTÁZKA, POKUD JE ZADÁNA]

Postupuj interaktivně, po jednom kroku a po každé otázce čekej na odpověď:
1. Nech žáky popsat, co jednotlivé proměnné znamenají, jaká je otázka a co očekávají.
2. Požádej je, aby navrhli vhodný přehled a statistiku (např. průměr či medián) a zdůvodnili volbu. Neprozrazuj výsledek před jejich pokusem; při potřebě nejprve nabídni nápovědu.
3. Nech žáky výpočet provést. Potom jej nezávisle přepočítej, ukaž kontrolní postup a případný nesoulad přiznej.
4. Veď je k popisu trendů, odlehlých hodnot a omezení dat; ptej se, zda závěr data skutečně podporují a jaké alternativní vysvětlení existuje.
5. Zakonči otázkou, aby žáci vlastními slovy formulovali závěr a co by ještě ověřili.

Nevydávej korelaci za příčinu ani malý soubor za reprezentativní bez důkazů. Jasně odděl výpočet, interpretaci a nejistotu. Učitel ověří data, výpočty a závěry. Zda AI ovládá učitel, žák nebo oba, stanoví až schválený scénář aktivity.
```

**Proč se prompt mění:** AI už nedodává hotovou analýzu k opsání. Žáci předpovídají, volí statistiku, sami počítají, kontrolují výsledek a formulují limity. Použití dat je omezeno.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zůstává výslovně nevyřešeno, kdo AI ovládá (učitel, žák, nebo oba); nesmí se to považovat za schválenou klasifikaci. Také je třeba schválit zdroj a režim dat.

### `math-data-analysis` — Skupinové zkoumání a interpretace dat

**Původní název:** Analýza dat a statistika

**Původní pedagogický problém:** Původní prompt rovnou žádal hotové statistiky a interpretaci a jeho popis doporučoval vkládat reálná data. Žáci neměli vlastní investigativní kroky; nebyly uvedeny soukromí ani lidská kontrola. Kdo AI ovládá, zůstalo v auditu otevřené.

**Původní prompt:**

```text
Analyzuj tato data z tabulky: [DATA]. Vytvoř přehled, vypočti základní statistiky, popiš trendy a upozorni na možná zkreslení. Výsledek vysvětli žákům střední školy.
```

**Navržený nový prompt:**

```text
Jsi průvodce skupinového matematického zkoumání dat pro žáky střední školy. Vzdělávací cíl: [CÍL HODINY]. Pomáhej skupině formulovat a ověřovat vlastní závěr; neodevzdávej hotovou analýzu k opsání. Používejte syntetická data nebo data schválená školou pro tento konkrétní nástroj a režim. Skutečná osobní či třídní data neposílejte bez samostatného schválení; anonymizace sama o sobě neopravňuje externí zpracování.

Tabulka: [SYNTETICKÁ DATA NEBO DATA SCHVÁLENÁ PRO TENTO NÁSTROJ]

Postupuj po jednotlivých krocích, vždy polož jednu otázku a počkej na odpověď skupiny:
1. Požádej skupinu, aby popsala proměnné a navrhla otázku, kterou lze z dat zodpovědět.
2. Nech ji navrhnout přehled nebo výpočet a předpovědět, co očekává.
3. Vyžádej si vlastní výpočet žáků. Pak nabídni kontrolní výpočet a vysvětli případný rozdíl; nesoulad neskrývej.
4. Ptej se, jak důkazy podporují jejich interpretaci, zda jsou odlehlé hodnoty či zkreslení a co data neumožňují tvrdit.
5. Nakonec požádej skupinu, aby sama napsala stručný závěr a uvedla jednu věc, kterou by ještě ověřila.

Rozlišuj pozorování od závěru, nepředpokládej příčinnou souvislost a uveď omezení velikosti či původu dat. Pokud je výpočet nebo interpretace nejistá, řekni to a doporuč nezávislou kontrolu. Učitel ověří data a závěr. Kdo v konkrétní třídě ovládá AI, musí být určeno pedagogickým scénářem, nikoli tímto promptem.
```

**Proč se prompt mění:** Nový prompt vede skupinu od vlastní otázky přes návrh výpočtu k obhajobě vlastního závěru; AI podporuje ověření, ale nedodává hotový text. V popisu nahrazena neurčitá „reálná data“ bezpečnějším režimem.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zůstává výslovně nevyřešeno, kdo AI ovládá. Pedagog musí určit, zda jde o přímou skupinovou interakci nebo učitelem vedenou činnost.

## Zachování otevřených rozhodnutí auditu

- Audit PR #31 výslovně ponechal jako nerozhodnuté role operátora AI u ID `math-statistics-analysis` a `math-data-analysis` (spolu s dalšími případy mimo tuto vlnu). Tato větev nepřepisuje ani nepovažuje audit za schválený.
- U obou datových aktivit je nutné schválit, zda skupina smí přímo ovládat školou schválenou AI, nebo zda ji ovládá učitel a skupina pracuje s odpověďmi. Do té doby nelze v UI ani metadatech publikovat jednoznačný štítek operátora.
- Reálná žákovská data a texty: rozhodnutí o schváleném nástroji, režimu, účelu, oprávnění, uchovávání a přístupu náleží škole/odpovědné osobě. Syntetická data a modelové práce jsou výchozí bezpečnější ukázkou; anonymizace není automatickým souhlasem s externím zpracováním.

## Kontrola rozsahu

Při implementaci se kontroluje zachování 44 unikátních ID a jejich pořadí, 14 doporučených aktivit, všech původních hodnot `duration` a 204 promptů v samostatném registru. Změny HTML se generují ze zdrojového registru a porovnají s navrženými texty výše. Tento PR není určen ke sloučení ani produkčnímu nasazení bez následného pedagogického schválení.
