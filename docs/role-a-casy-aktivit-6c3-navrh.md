# Role AI a časová metadata aktivit – etapa 6C/3

**Stav:** návrh k pedagogickému schválení, bez implementace.  
**Analyzovaný obsah:** origin/master, commit 9a47dfb0244927082777eff13291bab556bbaea6 (7. 11. 2026).  
**Zdroje:** úplný data/activities.json a data/prompts.json, audit docs/zaverecny-audit-knihovny-aktivit-6c.md, dokumentace docs/pristupnost-knihovny-aktivit-6c2.md, scripts/generate-activities.js, aktivity.html a js/activity-library.js.

## 1. Shrnutí

Klasifikace vychází z úplných promptů všech 44 záznamů v pořadí registru. Operátor znamená osobu, která technicky zadává pokyn AI, nikoli sociální formu práce. Předběžné rozdělení: teacher_preparation 15, teacher_led 8, student_direct 12, flexible 3 a nerozhodnuto 6; součet je 44. Jde o návrh, nikoli potvrzení školního přístupu.

Z 44 původních časových štítků 12 výslovně říká příprava, 6 aktivita, 4 udává jednotku na žáka/text, 2 jsou neoznačené rozsahy a 20 pouhý počet minut. Žádný údaj není pilotně naměřený. biology-animal-encyclopedia navíc rozlišuje krátký režim asi 8 min a rozšířený asi 20–30 min. Preferuji vnořené usage a timing a zachování původního duration jako kompatibilního historického údaje.

## 2. Metodika klasifikace

teacher_preparation znamená přípravu materiálu učitelem; teacher_led výslovné učitelské ovládání v hodině; student_direct žákovský dialog; flexible více explicitně popsaných operátorů. Pokud prompt operátora neříká a nelze jej bezpečně vyvodit, uvádím N (nerozhodnuto). Vysoká jistota = explicitní operátor; střední = žákovský dialog naznačen, ale technická obsluha ne zcela; nízká = neurčeno. Offline alternativy nepřidávám, pokud je prompt neuvádí. Sociální forma práce není důkazem operátora. Přímý režim není schválení školy, účtu, věku ani zpracování dat.

## 3. Návrh slovníku rolí

| Hodnota | Význam | Český štítek |
|---|---|---|
| teacher_preparation | Učitel připravuje materiál AI | Učitel připravuje |
| teacher_led | Učitel ovládá AI v průběhu výuky | Učitel vede AI |
| student_direct | Žák přímo komunikuje s AI; školní povolení zvlášť | Žák pracuje s AI |
| flexible | Prompt připouští více obsluh | Učitel nebo žák |
| undecided | Prompt operátora neurčuje | Režim upřesní učitel |

Schválení školy má samostatný stav unknown / approved / not_approved. Přímý přístup může být required / optional / not_required / unknown.

## 4. Návrh časového modelu

Počty řetězců: 10 min (3), 5 min (4), 3 min (1), 8 min (2), 15 min (3), 20 min (6), 2 min/žák (2), 5 min příprava (7), 10 min příprava (4), 20 min aktivita (1), 15 min aktivita (3), 3 min/text (2), 30 min aktivita (1), 10 min aktivita (1), 6 min příprava (1), 25 min (1), 12–20 min (1), 10–18 min (1): 18 variant, součet 44.

| Třída | Počet | Přímý význam | Neprokazuje |
|---|---:|---|---|
| Příprava | 12 | Deklarovaná fáze přípravy | Naměřený čas, rozsah kontroly |
| Aktivita | 6 | Orientační délka aktivity | Pilotní měření či rozpad fází |
| Na žáka/text | 4 | Jednotku | Zda jde o práci, zpracování či kontrolu |
| Holý rozsah | 2 | Interval | Fázi ani skutečnou dobu |
| Holé minuty | 20 | Historickou hodnotu | Fázi, osobu, jednotku, ověření |

Další tvrzení v popisech/promptu: czech-literary-analysis-class uvádí přípravu 10 min a práci žáků orientačně 15–20 min; biology-animal-encyclopedia rozlišuje asi 8 a 20–30 min; math-story-problem-game říká, že 15 min není potvrzená délka celé výuky; physics-phenomenon-analogies-class říká, že 5 min není celá dílna. Jsou to neověřené odhady. Délka testu v promptu math-test-paper-generator je vstupní parametr generovaného testu, ne důkaz významu metadata 3 min.

Doporučuji variantu B, vnořené usage a timing, před plochými poli: odděluje role a čas, umožní evidence, fázi i budoucí varianty. Návrhová ukázka:

    duration: "5 min příprava"
    usage:
      aiOperator: teacher_preparation
      aiOperatorEvidence: "asistent učitele při přípravě…"
      studentDirectAccess: not_required
      approvalStatus: unknown
      offlineAlternative: {available: true, evidence: "..."}
    timing:
      teacherPrep: {value: 5, unit: minutes, status: unverified_estimate, source: legacy duration}
      learnerWork: null
      teacherReview: null

Hodnota času může být null, jediná hodnota nebo interval min/max. Vždy zaznamenat jednotku, fázi, zdroj a stav. null není nula; unverified_estimate není pilot_observed. Pilotní údaj vyžaduje protokol, vzorek a metodu. Neurčenou fázi ponechat null, nikoli domýšlet. Kořenové duration zachovat beze změny a nevykreslit jako potvrzenou dobu výuky.

## 5. Kompletní pedagogická rozhodovací matice

TP=teacher_preparation, TL=teacher_led, SD=student_direct, F=flexible, N=undecided. Přímý přístup je požadavek hlavního režimu; školní schválení není tím potvrzeno. ? znamená, že škola/nástroj/účet/věk/data nejsou zdrojem ověřeny.

| # ID | Režim / operátor / jistota | Učitel a žáci; přímý / fallback | Bezpečnost | Prompt evidence | Legacy čas → doložený význam; prep / práce / kontrola |
|---|---|---|---|---|---|
| 1 math-word-problem-generator | TP učitel vysoká | učitel připraví, žák řeší list; ne / list | bez osobních dat, ověřit výpočty | „asistent učitele … při přípravě“ | 10 min neurčeno; null/null/null |
| 2 math-step-by-step-guide | F učitel nebo žák vysoká | žák procvičí, učitel může demonstrovat; volitelný / demonstrace | žák jen ve schváleném prostředí | „žák … individuálním procvičování; učitel … demonstraci“ | 5 min neurčeno; null/null/null |
| 3 math-test-paper-generator | TP učitel vysoká | učitel připraví/ověří, žák řeší; ne / list | AI neznámkuje | „asistent učitele“; učitel „sám rozhoduje o klasifikaci“ | 3 min neurčeno; null/null/null |
| 4 math-differentiated-problems | TP učitel vysoká | učitel vytvoří varianty, žáci řeší; ne / list | bez nálepkování, ověřit vhodnost | „Učitel ověří správnost a vybírá potřebnou oporu“ | 8 min neurčeno; null/null/null |
| 5 math-story-problem-game | TP učitel vysoká | učitel připraví/ověří, skupiny řeší; ne / karty | fiktivně, bez osobních údajů, klíč oddělit | „asistent učitele při přípravě“; „Přímé používání AI žáky není potřeba“ | 15 min; celý čas výuky nepotvrzen; null/null/null |
| 6 math-statistics-analysis | TL učitel vysoká | učitel ovládá, žáci zkoumají; ne / učitel vede | syntetická data, skutečná jen schválená pro účel/nástroj | „AI ovládá učitel“ | 20 min neurčeno; null/null/null |
| 7 czech-essay-feedback | TP učitel střední | učitel vloží/posoudí, žák příjemce; ne / žádný výslovný | modelový text přednostně; skutečný jen schváleně; anonymizace nestačí | „asistent učitele češtiny“; „Učitel výstup ověřuje, upraví“ | 2 min/žák, fáze nejasná; null/null/null |
| 8 czech-dictation-generator | TP učitel vysoká | učitel připraví/ověří; ne / diktát | kontrola pravopisu | „asistent učitele při přípravě“ | 5 min příprava; 5/null/null |
| 9 czech-literary-analysis | TP učitel vysoká | učitel vytvoří otázky; ne / podklady | oprávněná krátká ukázka, ověřené zdroje | „při přípravě literárního rozboru“ | 10 min příprava; 10/null/null |
| 10 czech-spelling-word-exercises | TP učitel vysoká | učitel připraví/řídí, žák řeší; ne / papírový list | modelový text, kontrola pravopisu/příbuznosti | „asistent učitele při přípravě“; „papírovým listem“ | 5 min příprava; 5/null/null |
| 11 czech-matura-oral-exam | SD žák střední | žák odpovídá; ano / neurčeno | neoficiální zkouška, školní režim ? | „nácviku … pro žáka“; „čekej na odpověď“ | 20 min aktivita; null/20/null |
| 12 czech-writing-form-guide | SD žák vysoká | žák píše/dialoguje; ano / osnova, modelový text, papír | reálný text pouze ve schváleném režimu; bez citlivých údajů | „zůstat autorem“; „papírového pracovního listu“ | 15 min aktivita; null/15/null |
| 13 english-conversation-partner | SD žák vysoká | žák konverzuje; ano / neurčeno | učitel volí schválený režim, účet/věk/data ? | “teacher selects … school-approved mode”; “Start with one clear question” | 15 min aktivita; null/15/null |
| 14 english-grammar-feedback | N neurčeno nízká | žák adresát, vkládající neznámý; ? / ne | modelový text; skutečný jen schváleně, anonymizace nestačí | “assistant for a … learner” neurčuje obsluhu (R01) | 3 min/text; fáze nejasná; null/null/null |
| 15 english-vocabulary-builder | TP učitel vysoká | učitel vytvoří sadu, žáci procvičí; ne / sada | ověřit překlad a věkovou vhodnost | „asistent učitele angličtiny“ | 10 min příprava; 10/null/null |
| 16 english-cambridge-exam-practice | SD žák střední | žák odpovídá; ano / neurčeno | neoficiální a originální úlohy; školní účet ? | “Give one task and wait for the learner's response” | 30 min aktivita; null/30/null |
| 17 english-grammar-exercises | TP učitel vysoká | učitel vytvoří/ověří list; ne / list | ověřit jazykové varianty | “teacher prepare a short … worksheet” | 5 min příprava; 5/null/null |
| 18 english-contextual-translation | TL učitel vysoká | žáci překládají, učitel zprostředkuje AI; ne / tištěný materiál | oprávnění k textu | „text, který má učitel oprávnění použít“ | 10 min aktivita; null/10/null |
| 19 biology-virtual-lab-experiment | TL učitel vysoká | učitel ovládá, žáci tvoří hypotézu; ne / ilustrace | ověřený model; ilustrace nesmí být vydávána za měření | „Učitel ovládá AI“ | 20 min neurčeno; null/null/null |
| 20 chemistry-equation-guide | N neurčeno střední | žák či učitel dodá rovnici, ale operátor neznámý; ? / neurčeno | školní účet/režim ? (R02) | „rovnici dodá žák nebo učitel“ | 10 min neurčeno; null/null/null |
| 21 physics-phenomenon-analogies-explainer | TP učitel vysoká | učitel tvoří/ověří; ne / připravené vysvětlení | ověřit analogii a její meze | „při přípravě vysvětlení“ | 5 min neurčeno; null/null/null |
| 22 biology-animal-encyclopedia | SD žák střední | žáci kladou otázku; ano / fallback neuveden | ověřené zdroje, školní přístup ? | „požádej žáky, aby formulovali vlastní otázku“ | 8 min krátký; 20–30 rozšířený; režimové odhady (T01) |
| 23 physics-problem-solver | SD žák střední | žák předkládá postup; ano / neurčeno | školní režim/účet ? (R03) | „požádej žáka, aby vypsal známé a hledané veličiny“ | 5 min neurčeno; null/null/null |
| 24 chemistry-elements-compounds-quiz | TP učitel vysoká | učitel ovládá; žák řeší; ne / kvíz | ověřit fakta; neznámkovat | „Učitel ovládá AI“; „Přímý přístup … není nutný“ | 6 min příprava; 6/null/null |
| 25 history-roleplay-historical-person | N neurčeno střední | žáci vedou simulaci; operátor ? / fallback ne | simulace není pramen, ověřené podklady (R04) | prompt popisuje simulaci pro žáky, neurčuje obsluhu | 20 min neurčeno; null/null/null |
| 26 history-timeline-generator | TP učitel vysoká | učitel připraví, žáci následně pracují; ne / osa | jen ověřené události | „asistent učitele při přípravě“ | 5 min příprava; 5/null/null |
| 27 history-debate-pro-con | N neurčeno nízká | žáci argumentují, kdo obsluhuje AI ? / fallback neuveden | učitel schvaluje téma a prameny (R05) | „AI může klást kontrolní otázky“ bez operátora | 25 min neurčeno; null/null/null |
| 28 history-period-newspaper | TP učitel vysoká | učitel připraví; žáci ověřují; ne / simulovaný text | označit simulaci, doložená fakta | „asistent učitele při tvorbě“ | 10 min příprava; 10/null/null |
| 29 history-source-analysis | N neurčeno nízká | skupina analyzuje; kdo zadává AI ? / fallback neexplicitní | oprávnění/původ/kontekst (R06) | „průvodce skupinovou analýzou“ neříká operátora | 15 min neurčeno; null/null/null |
| 30 history-map-analysis | N neurčeno nízká | žáci zkoumají mapu; operátor ? / fallback neurčen | mapa, legenda, zdroj, práva (R07) | „průvodce … pro žáky“ neurčuje obsluhu | 10 min neurčeno; null/null/null |
| 31 math-real-life-word-problems | SD žák střední | žák modeluje; ano / fallback neuveden | bezpečný scénář; data jako odhad označit | „průvodce … pro žáka“; „Neřeš … za žáka“ | 5 min příprava, ale prompt je žákovský; work null (T02) |
| 32 math-ai-tutor | SD žák vysoká | žák pracuje s AI; ano / modelový postup či žádný vstup | vlastní práce pouze schváleně, neznámkovat/diagnostikovat | „v prostředí schváleném školou“ | 15 min aktivita; null/15/null |
| 33 math-data-analysis | F žák nebo učitel vysoká | skupina zkoumá; přímý po schválení, jinak učitel; ano/ne | syntetická data, skutečná jen schválená | „Pokud schváleno není, AI ovládá učitel“ | 20 min neurčeno; null/null/null |
| 34 czech-essay-workshop | SD žák střední | žák reviduje; ano / neurčeno | modelový text; skutečný jen schváleně | „průvodce žáka … při vlastní revizi“ | 2 min/žák; prompt též 5 min a delší režim (T03) |
| 35 czech-dictation-activity | F žák nebo učitel vysoká | žák opravuje; přímý volitelný / učitel nebo list | ověřený modelový text/klíč; skutečné práce jen schváleně | „Bez schváleného přímého přístupu vede otázky učitel nebo použije vytištěný list“ | 5 min příprava, žákovský čas chybí (T04) |
| 36 czech-literary-analysis-class | SD žák vysoká | žák interpretuje; ano / pracovní list | oprávněná ukázka, schválené prostředí | „pracovní list bez přímého přístupu žáků k AI“ | 10 prep dle popisu; práce žáků 15–20 orientačně (T05) |
| 37 english-conversation-activity | TL učitel vysoká | učitel řídí AI; páry mluví spolu; fallback tištěný prompt | schválený režim; bez osobních dat/nahrávek | “The teacher controls when you participate”; “teacher operates the tool or uses a printed no-AI prompt” | 15 min orientační aktivita, bez rozpisu (T06) |
| 38 english-essay-feedback | SD žák střední | žák reviduje; ano; fallback neuveden | modelový text, skutečný pouze schváleně; bez identifikátorů | “ask one focused question… wait for the learner's answer”; obsluha není výslovně uvedena (R08) | 3 min/text; fáze neurčena |
| 39 science-virtual-lab-simulation | TL učitel vysoká | učitel ovládá; žáci tvoří hypotézy | ověřený model; oddělit model od měření; žádné nebezpečné postupy | „Učitel ovládá AI“ | 20 min orientační aktivita; rozpis null |
| 40 physics-phenomenon-analogies-class | TL učitel vysoká | učitel moderuje; žáci nejdřív tvoří sami | ověřené podklady, odlišit metaforu od faktu | „moderátor učitelem organizované dílny“ | 5 min není celá dílna (T07) |
| 41 history-roleplay-classroom | TL učitel vysoká | učitel ovládá/moderuje; žáci ověřují | simulaci vždy označit, jen ověřené prameny | „Učitel ovládá AI a moderuje rozhovor“ | 20 min orientační výuka; bez rozpisu |
| 42 history-class-timeline | TL učitel střední | učitel moderuje karty; třída skládá | ověřené zdroje; nevymýšlet data/příčiny | „moderátor učitelem organizované práce“; „ukaž dodané karty“ | 5 min příprava; žákovský čas chybí (T08) |
| 43 general-prompt-power-up-relay | SD týmový operátor střední | tým tvoří/testuje prompt; učitel schvaluje téma | bez osobních dat, ověřit výstupy, školní režim ? | „tým sám navrhl a ověřil lepší prompt“ | 12–20 min interval týmového cyklu; odhad |
| 44 general-fact-or-fiction | TP učitel vysoká | učitel připravuje/ověří neveřejný klíč; týmy ověřují zdroje | citlivá témata vyloučit; učitel ověří a opraví záměrnou nepravdu | „Pomoz učiteli připravit bezpečnou hru“; „učitel musí nezávisle ověřit“ | 10–18 min interval hry dle popisu; odhad |

## 6. Nejasné a sporné případy

1. R01 english-grammar-feedback: kdo vloží text – žák, učitel, nebo oba?
2. R02 chemistry-equation-guide: „rovnici dodá žák nebo učitel“ je volba vstupu, nebo režimu obsluhy?
3. R03 physics-problem-solver: explicitní přímý režim podmíněný schválením, nebo učitelské zprostředkování?
4. R04 history-roleplay-historical-person: ovládá simulaci učitel jako v aktivitě 41, nebo žáci?
5. R05 history-debate-pro-con: kdo obsluhuje AI při kontrolních otázkách?
6. R06 history-source-analysis: kdo předkládá pramen a zadává dotazy?
7. R07 history-map-analysis: přímá práce žáka, nebo učitelsky připravené otázky?
8. R08 english-essay-feedback: kdo technicky vkládá text a v jakém režimu?
9. T01 biology-animal-encyclopedia: zachovat režimové hodnoty 8 a 20–30 min odděleně?
10. T02 math-real-life-word-problems: zachovat 5min přípravu jako legacy, learnerWork neznámý?
11. T03 czech-essay-workshop: 2 min/žák je jedna varianta, prompt nabízí i 5 min a delší?
12. T04 czech-dictation-activity: ponechat 5 min jen jako přípravu, žákovský čas chybí?
13. T05 czech-literary-analysis-class: evidovat oba odhady 10min prep a 15–20min práce?
14. T06 english-conversation-activity: uvádět orientační celek 15 min bez rozpisu?
15. T07 physics-phenomenon-analogies-class: zachovat 5 min jako legacy, ne délku celé dílny?
16. T08 history-class-timeline: ponechat jen přípravný čas, žákovskou dobu nechat neznámou?

U přímého přístupu musí škola ověřit nástroj/režim, účet a věk, data, dohled a offline volbu. Nejde o splněné podmínky. Nejasné fallbacky nejsou domyšleny. Citlivé oblasti zahrnují osobní/třídní data, žákovské práce, autorské texty/mapy/prameny a historické simulace.

## 7. Srovnání podobných aktivit

| Skupina z auditu 6C/1 | Zachovaný rozdíl |
|---|---|
| math-word-problem-generator / math-real-life-word-problems | příprava učitelem vs žákovské modelování |
| czech-essay-feedback / czech-essay-workshop | učitel připraví feedback vs žák reviduje |
| czech-dictation-generator / czech-dictation-activity | generátor vs žákovské opravy |
| czech-literary-analysis / czech-literary-analysis-class | otázky pro učitele vs přímá žákovská interpretace/offline list |
| english-conversation-partner / english-conversation-activity | žák–AI vs žák–žák s učitelem řídícím vstup AI |
| english-grammar-feedback / english-essay-feedback | první neurčeno, druhý žákovská revize |
| biology-virtual-lab-experiment / science-virtual-lab-simulation | oba teacher-led; model není měření |
| physics-phenomenon-analogies-explainer / physics-phenomenon-analogies-class | příprava analogií vs žáci tvoří před AI |
| history-roleplay-historical-person / history-roleplay-classroom | neurčený operátor vs výslovně učitel |
| history-timeline-generator / history-class-timeline | příprava hotové osy vs třídní skládání |
| math-statistics-analysis / math-data-analysis | jen učitel ovládá vs flexibilní podle schválení |
| math-step-by-step-guide / math-ai-tutor / physics-problem-solver / chemistry-equation-guide | demonstrace, žákovské pokusy a rozdílná explicitnost obsluhy |

## 8. Návrhy štítků

Použít krátké role štítky výše. Čas označit například „Příprava učitele · orientačně 5 min“, „Práce žáků · asi 15–20 min“, „Kontrola učitele · čas neuveden“, „asi 2 min na žáka“ nebo „Původní údaj 10 min · fáze neurčena“. Barva nesmí být jediným nositelem významu. Nedávat dlouhé právní výstrahy na kartu; konkrétní režim uvést stručně v detailu.

## 9. Dopady na generátory a UI

generate-activities.js generuje karty a datové atributy; detail uvádí předmět, ročník, nástroj, dobu a formu. js/activity-library.js vypisuje data-duration jako dobu. Po schválení upravit schéma/validaci, generátor, atributy v aktivity.html a detail UI. format dál popisuje sociální formu. Karta může zobrazit stručný role štítek a jasný čas; detail důkaz, alternativu a stav školního rozhodnutí. Zachovat filtry a přístupnost z 6C/2.

## 10. Migrační plán

1. Rozhodnout R01–R08 a T01–T08.
2. Schválit schéma usage/timing a povinné důkazy.
3. Ručně namapovat 44 záznamů; neznámé fáze zůstávají null.
4. Zachovat duration beze změny a označit jej jako původní/orientační.
5. Validovat enumy, jednotky, intervaly, stav, zdroj; pilot vyžaduje protokol.
6. Teprve pak implementovat UI a otestovat klávesnici, mobil, čtečku, filtry; časový pilot oddělit.

## 11. Regresní rizika

Záměna sociálního formátu za operátora; dojem, že student_direct znamená školní schválení; sloučení přípravy a živého řízení; starý duration jako délka hodiny; ztráta intervalu/jednotky; null zaměněné za nulu; odhad označený jako pilot; odkrytí učitelského klíče; ztráta offline varianty; nekompatibilní generátor/validátor.

## 12. Akceptační kritéria

Každá z 44 aktivit má jeden režim nebo undecided a důkaz. format není důkazem obsluhy. Školní schválení/účet/věk/data/dohled jsou samostatné. Prompty, statusy a duration zůstávají beze změny. Čas podporuje hodnotu, interval a null se zdrojem, jednotkou, fází a stavem. Souhrny dávají 44 a nejistoty jsou viditelné. Význam sděluje text, ne jen barva.

## 13. Rozhodnutí vyžadující pedagogické schválení

Schválit jednotlivě R01–R08 (obsluha AI u anglické gramatiky, chemického/fyzikálního tutora, historické simulace/debaty/pramene/mapy a anglické eseje) a T01–T08 (režimové časy profilu živočicha, konflikt přípravného štítku modelování, varianty slohové dílny, přípravný čas diktátu, dvojí čas literární interpretace, anglická konverzace, fyzikální dílna a časová osa). Dále schválit prezentaci odhadů a požadavky případného měření. Nic z toho tímto dokumentem není považováno za rozhodnuté.

### Provedené invarianty

44 záznamů/44 unikátních ID, pořadí matice odpovídá registru; activities-main má 14 členů; registr promptů má 204 položek. Časové skupiny jsou uvedeny výše a dávají 44. Rozdělení rolí: TP 15 + TL 8 + SD 12 + F 3 + N 6 = 44. Výchozí master obsahuje prompty po předchozích etapách; tento návrh mění pouze nový Markdown soubor.

