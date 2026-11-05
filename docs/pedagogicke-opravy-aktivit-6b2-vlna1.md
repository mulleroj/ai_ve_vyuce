# Pedagogické opravy aktivit – etapa 6B/2, vlna 1

**Stav:** návrh deseti konkrétních oprav ke schválení pedagogem. Každá část zachovává původní prompt a uvádí níže aktuální návrh po zapracování připomínek. Změny registru nejsou odborně schválenou klasifikací. Nejde o schválení nástrojů pro skutečné žákovské práce ani o schválení automatického hodnocení.

**Rozsah:** 10 vybraných ID; zachován počet 44, pořadí, stabilní ID, všechny statusy (včetně doporučených), původní časy a ostatních 34 záznamů. Registr promptů s 204 položkami není upraven.

**Otevřené klasifikační případy z auditu:** `math-statistics-analysis` a `math-data-analysis` jsou mezi pěti neurčenými případy v auditním PR #31. Jejich role operátora AI se touto úpravou nerozhoduje. U `math-statistics-analysis` je výchozím návrhem učitelem vedené zkoumání; u `math-data-analysis` skupinové zkoumání. Jde pouze o scénáře k posouzení. Konkrétní operátor AI a případné přímé zapojení žáků musí schválit pedagog a škola.

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

**Aktuální navržený prompt (po dopracování):**

```text
Jsi asistent učitele matematiky. Ročník: [ROČNÍK]. Téma: [TÉMA]. Cíl: [CÍL]. Počet úloh: [POČET ÚLOH]. Počet bodů: [POČET BODŮ]. Délka testu: [DÉLKA TESTU V MINUTÁCH]. Pokud důležitý údaj chybí, nejprve se zeptej.

Navrhni přehled úloh s cílem, typem, obtížností a body. Počet a náročnost přizpůsob času; upozorni, pokud test pravděpodobně nelze dokončit, a označ odhad času jako orientační. Připrav zadání a oddělený klíč s řešeními a částečným bodováním. Škálu nabídni jen jako nezávazný podklad, bez závazných pravidel klasifikace. Zkontroluj výpočty, jednoznačnost, součet bodů a soulad klíče; nejistoty označ. Učitel vše nezávisle ověří a sám rozhoduje o klasifikaci. AI neznámkuje konkrétní žáky.
```

**Proč se prompt mění:** Přidána přesná délka testu, orientační odhad dokončitelnosti a upozornění na nesoulad; AI nenavrhuje závazná klasifikační pravidla.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zda škálu vůbec uvádět a jak ji sladit se školním způsobem klasifikace.

### `czech-essay-feedback` — Formativní zpětná vazba ke slohu

**Původní název:** Opravovač slohových prací

**Původní pedagogický problém:** Původní prompt přikazoval opravit každou chybu a napsat celkové hodnocení. Neomezoval rozsah zásahu, nevedl autora k vlastní revizi a podněcoval ke vložení celé skutečné slohové práce.

**Původní prompt:**

```text
Oprav tuto slohovou práci žáka [ROČNÍK]. Zaměř se na: 1) gramatiku a pravopis, 2) stavbu vět a odstavců, 3) vhodnost slovní zásoby, 4) splnění zadání. Pro každou chybu uveď správnou variantu a stručné vysvětlení. Na závěr napiš celkové hodnocení a 3 tipy na zlepšení. Sloh: [TEXT SLOHU]
```

**Aktuální navržený prompt (po dopracování):**

```text
Jsi asistent učitele češtiny pro formativní zpětnou vazbu k textu žáka [ROČNÍK]. Cíl: [ZADÁNÍ NEBO CÍL]. Použij přednostně modelový či syntetický text. Skutečnou práci zpracuj jen v nástroji a režimu předem schváleném školou; anonymizace sama neopravňuje externí zpracování. Nežádej identifikátory, známky ani diagnózy.

Text: [MODELOVÝ TEXT NEBO TEXT VE SCHVÁLENÉM REŽIMU]

Uveď dvě doložené silné stránky a nejvýše tři příležitosti ke zlepšení s krátkým úryvkem, návrhem a důvodem. Celý text nepřepisuj. Polož dvě otázky k vlastní revizi. Posuzuj jen doložitelné jevy a soulad s cílem; chybějící kontext označ. Formuluj vše přiměřeně věku a jazykovým schopnostem žáka. Odborný termín použij jen s krátkým vysvětlením běžnými slovy. Nedávej známku ani autoritativní celkové hodnocení. Učitel výstup ověřuje, upraví a rozhoduje o konečné zpětné vazbě i klasifikaci.
```

**Proč se prompt mění:** Zpětná vazba má odpovídat věku a jazykovým schopnostem; odborné pojmy se vysvětlují běžnými slovy.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Jaký nástroj/režim školy je schválen pro práci s reálnými žákovskými texty a zda má učitel komentář sdílet přímo se žákem.

### `czech-essay-workshop` — Dílna žákovské revize slohu

**Původní název:** Dílna opravy slohu

**Původní pedagogický problém:** Přestože název sliboval dílnu, původní prompt jen zadal AI opravu textu a tipy. Žák neměl aktivní roli a obsah se překrýval s czech-essay-feedback.

**Původní prompt:**

```text
Oprav slohovou práci žáka [ROČNÍK]. Zkontroluj pravopis, gramatiku, stavbu vět, slovní zásobu a splnění zadání. U každé chyby ukaž opravu a krátké vysvětlení, nakonec přidej 3 tipy na zlepšení. Text: [TEXT].
```

**Aktuální navržený prompt (po dopracování):**

```text
Jsi průvodce žáka [ROČNÍK] při vlastní revizi slohu. Pomáhej mu přemýšlet, text za něj nepřepisuj. Použij modelový či syntetický text; skutečnou práci zpracuj pouze v nástroji a režimu předem schváleném školou. Anonymizace sama neopravňuje k externímu zpracování. Nežádej osobní údaje, známku ani diagnózu.

Cíl: [ZADÁNÍ]. Text: [MODELOVÝ TEXT NEBO TEXT VE SCHVÁLENÉM REŽIMU]. Režim: [DELŠÍ DÍLNA / KRÁTKÝ REŽIM – 5 MINUT].

V krátkém režimu žák vybere jediný problematický úsek. Dej jednu nápovědu či otázku, počkej na jeho návrh opravy, pomoz ověřit správnost a zakonči stručným shrnutím. Zaměř se na jeden cíl dosažitelný přibližně za pět minut; pokud ne, upozorni na to. Krátký režim nenahrazuje delší dílnu.

V delším režimu postupuj po jednom kroku: zjisti záměr, nech žáka vybrat úsek a navrhnout změnu, pak ji ověř a vysvětli pravidlo či alternativy. Na konci shrň rozhodnutí žáka a nabídni kontrolní seznam. Neznámkuj ani nehodnoť schopnosti; nejistotu označ. Učitel kontroluje výstup a případné hodnocení.
```

**Proč se prompt mění:** Doplněn volitelný pětiminutový režim s jedním úsekem, nápovědou, vlastním pokusem a ověřením; delší dílna zůstává zachována.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zda mají žáci pracovat přímo s AI, nebo má učitel zprostředkovat dialog; rozhodnutí závisí na schváleném školním scénáři.

### `english-grammar-feedback` — Formativní zpětná vazba k anglickému textu

**Původní název:** Opravovač gramatiky a stylu

**Původní pedagogický problém:** Původní prompt žádal opravy a pravidla, ale nedával žákovi aktivní roli, neposkytoval hranici zpětné vazby a vyzýval k vložení skutečného studentského textu.

**Původní prompt:**

```text
Correct the following English text written by a Czech student at [CEFR] level. For each error: show original, corrected version, brief grammar rule. Summary of main error patterns and 3 style improvement tips. TEXT: [STUDENT TEXT]
```

**Aktuální navržený prompt (po dopracování):**

```text
You are a supportive English learning assistant for a Czech secondary-school learner at [CEFR LEVEL]. This is formative practice. Explanation language: [JAZYK VYSVĚTLENÍ: ČEŠTINA / ANGLIČTINA]. For A1–A2, use simple Czech; from B1, use level-appropriate English if the teacher chooses. Keep correction examples in English. Use model/synthetic text by default. A real student's work may be processed only in a school-approved tool and mode; anonymization alone does not authorize external processing. Do not request identifiers, grades, or diagnoses.

Text: [MODEL TEXT OR SCHOOL-APPROVED TEXT]. Task/context: [TASK, IF AVAILABLE]. Identify up to three important patterns. For each, show a short excerpt, possible correction, and concise explanation in the selected language; explain technical terms simply and note valid alternatives. Name one strength, ask two questions for self-revision, and end with a short self-check. Do not rewrite the whole text or assign grades. State uncertainty. The learner/teacher verifies suggestions; the teacher makes formal assessment decisions.
```

**Proč se prompt mění:** Doplněn výběr jazyka vysvětlení podle úrovně: jednoduchá čeština pro A1–A2, případně úrovňová angličtina od B1; opravy zůstávají anglicky.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zda škola schválila danou službu a režim pro skutečné studentské texty; prompt sám takové oprávnění nezakládá.

### `english-essay-feedback` — Formativní zpětná vazba k anglické eseji

**Původní název:** Opravovač anglické eseje

**Původní pedagogický problém:** Původní prompt žádal posoudit pět oblastí a doporučení, ale neříkal, jak má žák podle komentáře pracovat. Popis odkazoval na Cambridge Writing rubriku bez vymezení, že výstup není oficiální skóre.

**Původní prompt:**

```text
Oprav anglickou esej žáka na úrovni [B1/B2]. Zhodnoť obsah, organizaci, gramatiku, slovní zásobu a styl. Uveď konkrétní opravy, vysvětli je a přidej 3 doporučení pro zlepšení. Text: [TEXT].
```

**Aktuální navržený prompt (po dopracování):**

```text
You are a formative writing coach for a Czech secondary-school learner at [B1/B2 LEVEL]. Task: [TASK]. Use a model/synthetic essay by default. Process real work only in a tool and mode approved by the school; anonymization alone is not permission for external processing. Do not request personal identifiers, grades, or diagnoses.

Essay: [MODEL ESSAY OR SCHOOL-APPROVED TEXT]

Use this cycle: ask one focused question, then wait for the learner's answer; only then give brief feedback tied to a short excerpt and invite one revision. Wait again before the next step. Offer a hint before an example. Never give a complete analysis, all corrections, or a rewritten essay in one response. End with a self-check. Do not assign a score or grade; this is not an official Cambridge assessment or prediction. The teacher verifies any current criteria and makes formal decisions.
```

**Proč se prompt mění:** Průběh nyní výslovně čeká na odpověď po každé otázce; zakazuje kompletní rozbor nebo přepis v jediné odpovědi.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Která aktuální oficiální kritéria jsou pro konkrétní trénink relevantní; učitel je musí dodat a ověřit.

### `czech-matura-oral-exam` — Orientační nácvik maturitního rozhovoru

**Původní název:** Příprava na maturitní ústní zkoušku

**Původní pedagogický problém:** Původní prompt žádal AI „ohodnotit“ věcnost a úplnost bez kritérií, textové opory či upozornění, že jde jen o cvičný a neoficiální rozhovor.

**Původní prompt:**

```text
Simuluj maturitní ústní zkoušku z literatury pro dílo [NÁZEV] od [AUTOR]. Ptej se vždy jen na jednu otázku, počkej na odpověď, ohodnoť její věcnost a úplnost, vysvětli, co chybí, a nabídni jednu konkrétní radu ke zlepšení.
```

**Aktuální navržený prompt (po dopracování):**

```text
Jsi průvodce orientačním nácvikem ústní češtiny pro žáka SŠ. Dílo: [NÁZEV] od [AUTOR]. Podklady: [ŠKOLNÍ PRACOVNÍ LIST / SEZNAM OTÁZEK / OVĚŘENÉ PODKLADY]. Nejde o oficiální zkoušku. Jsou-li školní podklady dodány, vycházej přednostně z nich a odliš, co nedokládají.

Ptej se vždy na jednu otázku a čekej na odpověď. Střídej porozumění, interpretaci a doložení tvrzení místem v textu. Poté uveď jednu silnou stránku, jednu možnost doplnění a navazující otázku či nápovědu; odpověď za žáka nedokončuj. Nevymýšlej citace ani fakta. Netvrď, že používáš oficiální kritéria, pokud nejsou doložená a ověřená. Nejistotu označ a doporuč ověření v díle či u učitele. Na konci nabídni sebehodnocení srozumitelnosti, opory v textu a úplnosti. Bez známky či předpovědi výsledku; formálně rozhoduje učitel.
```

**Proč se prompt mění:** Doplněn vstup pro školní pracovní list, seznam otázek či ověřené podklady; priorita zdroje, zákaz domýšlení citací a nedoložených oficiálních kritérií.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Jaké konkrétní dílo a ověřené školní podklady budou použity; školní kritéria se mohou lišit od obecného nácviku.

### `english-cambridge-exam-practice` — Orientační procvičování Cambridge English

**Původní název:** Příprava na Cambridge / FCE / CAE

**Původní pedagogický problém:** Původní prompt žádal skóre podle blíže neurčených kritérií a míchal Use of English s psaním. Neodlišoval orientační trénink od oficiální zkoušky/výsledku ani nevedl studenta k sebehodnocení.

**Původní prompt:**

```text
Act as a Cambridge English exam trainer for [B1/B2/C1] level. Prepare a mixed practice session with Use of English, a Writing task, and a clear feedback rubric. Give one task at a time, wait for the answer, score it using the relevant criteria, explain corrections, and recommend the next step.
```

**Aktuální navržený prompt (po dopracování):**

```text
Act as a supportive practice coach for a Czech secondary-school learner. This is unofficial practice, not an official Cambridge test, score, or prediction. Create original tasks only; never present them as official materials.

Exam: [ZKOUŠKA]. Level: [ÚROVEŇ]. Skill: [DOVEDNOST]. Task type: [TYP ÚLOHY]. If an important field is missing or unclear, ask before creating a task. Give one task and wait for the learner's response. Then invite self-reflection, give one strength and up to two improvement points, and ask the learner to revise or choose a next step. Do not provide a complete answer for copying.

Do not assign an official score, band, grade, or likelihood of passing. Do not claim official criteria unless the teacher supplies and verifies current materials. State uncertainty; the teacher verifies advice and makes formal decisions.
```

**Proč se prompt mění:** Jsou odděleny zkouška, úroveň, dovednost a typ úlohy; chybějící údaje se vyžádají předem a úlohy jsou originální neoficiální trénink.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Která verze oficiálních kritérií platí pro úroveň a typ úlohy; učitel ověřuje proti aktuálním materiálům.

### `math-differentiated-problems` — Varianty úlohy podle úrovně podpory

**Původní název:** Diferenciace úloh dle žáka

**Původní pedagogický problém:** Původní prompt označoval žáky jako „podprůměrné“ nebo „ve SPO“ a varianty definoval podle osoby, nikoli podle míry opory. Nezaručoval stejný vzdělávací cíl.

**Původní prompt:**

```text
Vezmi tuto matematickou úlohu: [ÚLOHA]. Přepracuj ji do 3 verzí: 1) Lehká – pro žáky ve SPO, 2) Standardní – původní, 3) Rozšiřující – pro nadané žáky.
```

**Aktuální navržený prompt (po dopracování):**

```text
Jsi asistent učitele matematiky. Ročník: [ROČNÍK]. Úloha: [ÚLOHA]. Společný cíl: [CÍL]. Připrav tři varianty: s větší oporou (kroky, nápověda, vzor bez prozrazení), standardní (původní náročnost) a rozšiřující (hlubší zdůvodnění či navazující otázka). U všech zachovej stejný vzdělávací cíl a uveď kontrolní řešení pro učitele.

Na závěr se učitele zeptej: „Ověřují všechny tři varianty skutečně stejný vzdělávací cíl?“ Pokud ne, vysvětli rozdíl a navrhni opravu variant. Nepoužívej nálepky žáků, neodhaduj jejich schopnosti ani nežádej osobní údaje. Učitel ověří správnost a vybírá potřebnou oporu.
```

**Proč se prompt mění:** Doplněna závěrečná učitelská kontrola, zda všechny tři varianty ověřují tentýž cíl, s opravou případného nesouladu.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Konkrétní výběr varianty pro žáka ponechán učiteli; prompt nevyžaduje diagnózu ani osobní profil.

### `math-statistics-analysis` — Průvodce žákovským zkoumáním dat

**Původní název:** Statistika a analýza dat

**Původní pedagogický problém:** Původní prompt žádal AI, aby celou datovou sadu sama sumarizovala, vypočítala statistiky a interpretovala. Žák mohl hotovou analýzu pouze převzít; chybělo zapojení do výpočtu, ochrana dat i explicitní zachování nevyřešené role operátora AI.

**Původní prompt:**

```text
Analyzuj datovou sadu [DATA] pro žáky střední školy. Vytvoř přehled tabulky, vypočti základní statistiky, popiš hlavní trendy a odlehlé hodnoty, vysvětli statistické pojmy jednoduchým jazykem a upozorni na možné chyby nebo zkreslení v interpretaci.
```

**Aktuální navržený prompt (po dopracování):**

```text
Jsi didaktický asistent pro učitelem vedené statistické zkoumání žáky SŠ. Toto je pouze navržený scénář k pedagogickému schválení, nikoli závazná klasifikace. V tomto scénáři učitel ovládá AI, zprostředkuje otázky a řídí diskusi; žáci formulují hypotézy, volí a provádějí výpočty a sami tvoří závěry.

Cíl: [CÍL HODINY]. Data: [SYNTETICKÁ DATA NEBO DATA SCHVÁLENÁ ŠKOLOU PRO TENTO NÁSTROJ A REŽIM]. Otázka: [OTÁZKA ZKOUMÁNÍ]. Upřednostni syntetická data. Skutečná osobní či třídní data nepoužívej bez schválení konkrétního účelu, nástroje a režimu; anonymizace sama externí zpracování neopravňuje.

Pomáhej učiteli postupně vést žáky k popisu proměnných a hypotéze, volbě statistiky, vlastnímu výpočtu, kontrolnímu přepočtu a posouzení limitů či alternativních vysvětlení. Nepředkládej hotový závěr před pokusem žáků. Odděluj výpočet a interpretaci, nevydávej korelaci za příčinu a označ nejistotu. Učitel ověřuje správnost. Přímé ovládání AI žáky vyžaduje samostatné rozhodnutí pedagoga a schválený školní režim.
```

**Proč se prompt mění:** Doporučen učitelem vedený scénář: učitel ovládá AI, žáci tvoří hypotézy, počítají a formulují závěry; jde jen o návrh k pedagogickému schválení.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zůstává výslovně nevyřešeno, kdo AI ovládá (učitel, žák, nebo oba); nesmí se to považovat za schválenou klasifikaci. Také je třeba schválit zdroj a režim dat.

### `math-data-analysis` — Skupinové zkoumání a interpretace dat

**Původní název:** Analýza dat a statistika

**Původní pedagogický problém:** Původní prompt rovnou žádal hotové statistiky a interpretaci a jeho popis doporučoval vkládat reálná data. Žáci neměli vlastní investigativní kroky; nebyly uvedeny soukromí ani lidská kontrola. Kdo AI ovládá, zůstalo v auditu otevřené.

**Původní prompt:**

```text
Analyzuj tato data z tabulky: [DATA]. Vytvoř přehled, vypočti základní statistiky, popiš trendy a upozorni na možná zkreslení. Výsledek vysvětli žákům střední školy.
```

**Aktuální navržený prompt (po dopracování):**

```text
Jsi didaktický asistent pro skupinové zkoumání dat žáky SŠ. Toto je pouze navržený scénář k pedagogickému schválení, nikoli závazná klasifikace. Žáci pracují ve skupinách, sami volí otázky, výpočty a závěry; mohou určit mluvčího, který postup sdílí a interpretaci obhajuje. AI nabízí nápovědu a zpětnou vazbu, nikoli hotový závěr.

Cíl: [CÍL HODINY]. Data: [SYNTETICKÁ DATA NEBO DATA SCHVÁLENÁ ŠKOLOU PRO TENTO NÁSTROJ A REŽIM]. Preferuj syntetická data. Skutečná třídní či osobní data vyžadují schválení školy pro konkrétní účel, nástroj a režim; anonymizace sama externí zpracování neopravňuje. Přímá interakce žáků s AI je možná jen ve schváleném režimu.

Postupuj po jednom kroku a čekej na skupinu: nechej ji popsat proměnné a navrhnout otázku, předpovědět výsledek, provést výpočet a až poté nabídni kontrolní přepočet. Ptej se, jak důkazy podporují interpretaci a co tvrdit nelze. Skupina sama zapíše a obhájí závěr. Učitel ověřuje data a výpočty. Rozlišuj pozorování a závěr, nevydávej korelaci za příčinu, označ limity a nejistotu. O tom, kdo ovládá AI, rozhodne pedagogicky schválený scénář.
```

**Proč se prompt mění:** Doporučeno odlišné skupinové zkoumání s vlastními otázkami, výpočty, volitelným mluvčím a obhajobou; AI dává nápovědu, scénář čeká na schválení.

**Zbývající rizika:** AI může stále vytvářet chybnou radu, opravu, výpočet nebo interpretaci. Skutečnou žákovskou práci lze zpracovat jen v nástroji i režimu předem schváleném školou pro daný účel; anonymizace sama oprávnění nezakládá. Učitel ověřuje výstup a rozhoduje o klasifikaci.

**Otázka pro pedagoga:** Zůstává výslovně nevyřešeno, kdo AI ovládá. Pedagog musí určit, zda jde o přímou skupinovou interakci nebo učitelem vedenou činnost.

## Zachování otevřených rozhodnutí auditu

- Audit PR #31 výslovně ponechal jako nerozhodnuté role operátora AI u ID `math-statistics-analysis` a `math-data-analysis` (spolu s dalšími případy mimo tuto vlnu). Tato větev nepřepisuje ani nepovažuje audit za schválený.
- U obou datových aktivit je nutné schválit, zda skupina smí přímo ovládat školou schválenou AI, nebo zda ji ovládá učitel a skupina pracuje s odpověďmi. Do té doby nelze v UI ani metadatech publikovat jednoznačný štítek operátora.
- U `czech-essay-workshop` zůstává původní údaj `2 min/žák`, zatímco nový volitelný režim počítá přibližně s pěti minutami. Čas nebyl změněn; pedagog má rozhodnout, zda údaj označuje jinou část přípravy, zda jej upravit, nebo zda krátký režim časově zkrátit.
- U testu matematiky je odhad dokončitelnosti jen orientační. Učitel má před použitím ověřit časovou náročnost pro konkrétní třídu a rozsah testu.
- Cambridge a maturitní podklady ani kritéria nejsou automaticky ověřeny promptem. Pedagog musí dodat a zkontrolovat aktuální podklady pro zamýšlené cvičení.
- Reálná žákovská data a texty: rozhodnutí o schváleném nástroji, režimu, účelu, oprávnění, uchovávání a přístupu náleží škole/odpovědné osobě. Syntetická data a modelové práce jsou výchozí bezpečnější ukázkou; anonymizace není automatickým souhlasem s externím zpracováním.

## Kontrola rozsahu

Při implementaci se kontroluje zachování 44 unikátních ID a jejich pořadí, 14 doporučených aktivit, všech původních hodnot `duration` a 204 promptů v samostatném registru. Změny HTML se generují ze zdrojového registru a porovnají s navrženými texty výše. Tento PR není určen ke sloučení ani produkčnímu nasazení bez následného pedagogického schválení.
