# Závěrečný audit knihovny aktivit – etapa 6C/1

**Stav:** audit a návrh; neobsahuje schválení změn webu ani automatické přepisování aktivit.

**Ověřený zdroj:** `origin/master` = `0ce95c67d6bb05c451c61d1f551b5e742cb79ed0` (squash páté vlny). Audit vychází z aktuálních 44 položek `data/activities.json`, `aktivity.html`, pěti předmětových stránek, jejich CSS/JS a již schválených vln 1–5. PR #31 je použit jako historický výchozí audit; jeho větev ani soubory se nemění.

## 1. Manažerské shrnutí

Knihovna má silný pedagogický základ: všech 44 záznamů má stabilní ID, předmět, cílovou skupinu, nástroj, kartu a samostatný prompt. V popisech i promptech se objevuje učitelská kontrola, samostatná práce žáka, práce se zdroji a ochranné podmínky. Rozhraní umožňuje hledání, kombinovat předmět/ročník/nástroj, zobrazit detail a kopírovat prompt. Při heuristických scénářích se vhodná aktivita našla v několika krocích.

Audit ale zjistil tři systémové problémy, které stojí za cílenou opravnou etapou: význam `duration` nelze u více než poloviny záznamů bezpečně vyložit; před otevřením detailu není vždy jasné, kdo bude skutečně zadávat AI instrukce; a přístupnost tabů na třech předmětových stránkách má kritické strojově nalezené porušení ARIA. Další věci jsou převážně nejednoznačné štítky, obsahová hustota nebo podobné aktivity s rozdílnými rolemi.

| Priorita | Počet nálezů | Co zahrnuje |
|---|---:|---|
| P0 | 0 | Nebyl potvrzen blokující výpadek katalogu ani bezpečnostní závada použití. |
| P1 | 3 | Časové štítky, nerozlišené role při použití AI, chybné tab semantics na 3/5 předmětových stránek. |
| P2 | 6 | Statusy a doporučení, přístupnostní kontrast/jméno odkazu, informační hustota karet, překryvy aktivit, podmínky bezpečného použití v kartě, neověřené předpoklady začátečnického výběru. |
| P3 | 0 | Drobné kosmetické návrhy jsou uvedeny jen jako volitelné varianty IA, nepočítají se jako zjištěný problém. |

**Doporučené pořadí:** opravit tab semantics a současně navrhnout minimální role/časová metadata; teprve po pedagogickém rozhodnutí změnit jejich štítky; nakonec zlepšit navigaci mezi podobnými aktivitami a ověřit řešení s pěti začínajícími učiteli. Zachovat všech 44 položek. Obsah promptů není předmětem automatické úpravy.

## 2. Metodika a meze důkazů

- Ověřeno přesné `origin/master` a jeho shoda s uvedeným squash commitem. Prohlédnuto všech 44 záznamů a úplné prompty, všech 44 karet katalogu, katalogové filtry a detaily, pět předmětových stránek, komponentní CSS/JS a navigace.
- Statické kontroly: počet/pořadí ID, `duration`, statusy a délky popisů; vyhledání bezpečnostních a rolových formulací; přímé porovnání názvů/popisků karet s registrem.
- Automatické UX: Playwright 1.65.0 přes Chromium API nad dostupným Google Chrome 156.0.8078.81. Šířky 390, 768 a 1440 px. Playwright obsloužil lokální skutečné HTML/CSS/JS a obrázky z checkoutu přes request routing, protože sandbox nepřijal přímé připojení k localhost HTTP serveru. Google Fonts byly blokovány, nikoli nahrazeny lokálními styly. Konzolové chyby z fontů a lokálně nedostupných doplňkových zdrojů se proto nepovažují za chybu aplikačního JavaScriptu.
- Axe-core WCAG 2.1 A/AA automatický scan katalogu, jeho detailního dialogu a pěti předmětových stránek ve všech šířkách. Nález automatického scanneru je důkaz k ověření, ne certifikace či úplný audit přístupnosti. Neproběhl test se čtečkou obrazovky, externími fonty ani uživateli.
- Pět scénářů níže je **heuristická simulace** z pohledu nového učitele, nikoli skutečný výzkum. Nejsou doloženy pilotní časy přípravy, délky výuky, vhodnost pro konkrétní třídy ani schválení nástrojů školami.
- Kód důkazů v matici: **A** = na kartě (název/popisek/štítky); **B** = pouze v detailu nebo promptu; **C** = lze usuzovat, ale zdroj to výslovně neříká; **D** = chybí. Více kódů v buňce rozlišuje dílčí části, např. `R A role učitele / D kdo píše do AI`.

## 3. Maticе všech 44 aktivit

Předmět a cílová skupina jsou na kartě přímo jako štítky u všech položek (A); v matici jsou vypsány pro rychlou orientaci. `R` = AI operátor i činnost učitele/žáka; `V` = vstupy; `O` = pozorovatelný výsledek a lidská kontrola; `S` = bezpečnostní podmínka; `T` = čas. Časová hodnota je vždy viditelná na kartě (A), ale její význam označujeme zvlášť. „—“ v S znamená, že v popisu karty není uvedena konkrétní podmínka; příslušný prompt může obsahovat další instrukce.

### Matematika

| ID a aktivita (cílová skupina) | Cíl a role R | Vstupy V · výsledek/kontrola O | Čas T · bezpečnost S | Karta pro začátečníka |
|---|---|---|---|---|
| `math-word-problem-generator` — Generátor slovních úloh pro učitele (1.–5.) | C A: učitel získá návrhy; žák je následně řeší C. R A: příprava učitelem; B: prompt je asistent učitele. | V A: cíl, ročník, čtenářská náročnost; B: předchozí učivo/kontext. O A: učitel ověřuje zadání, výpočet, jednotku a klíč. | `10 min` A; C: příprava či výuka nejsou rozlišeny. S B: obecný bezpečný kontext. | B: srozumitelný účel, ale 246 znaků; čas bez vymezení. |
| `math-step-by-step-guide` — Matematický průvodce (6.–9.) | G A: žák vlastními kroky dojde k řešení. R A: žák může vést dialog, učitel může předvést; D: kdo zadává AI v běžném použití. | V B: téma, ročník a žákův pokus. O B: vysvětlený postup a nová samostatná úloha. | `5 min` A; C: rozsah práce neurčen. S B: přímý přístup jen ve školou schváleném prostředí. | B: název a popis objasní nápovědu, ne volbu mezi učitelem a žákem u AI. |
| `math-test-paper-generator` — Návrh matematického testu (SŠ) | G A: učitel připraví test. R A: učitel ověřuje klíč, bodování i škálu a klasifikuje. | V A: cíl, počet úloh, délka; B: ročník/téma/bodový plán. O A: test a kontrola učitelem. | `3 min` A; C: doba tvorby vs kontroly neurčena. S B: nespoléhat na AI jako klasifikátora. | B: výstup je jasný, ale čas působí jako úplné vytvoření testu. |
| `math-differentiated-problems` — Varianty úlohy podle podpory (6.–9.) | G A: tři úrovně opory pro stejný cíl. R A: učitel zadává a kontroluje vhodnost. | V A: úloha a společný cíl; B: ročník. O A: tři verze a učitelská kontrola. | `8 min` A; C: tvorba vs volba/úpravy neurčena. S B: prompt používá potřebnost podpory, ale rizikem je nálepkování skupin. | B: účel čitelný; otevřením promptu je nutné definovat konkrétní cíl. |
| `math-story-problem-game` — Skupinová matematická výprava (1.–5.) | G A: skupiny zdůvodní řešení a zvládnou samostatný přenos. R A: učitel volí učivo; B: ovládá AI při přípravě. | V A: ročník, probrané učivo, cíl; B: čas a omezení. O A: žákovské karty, klíč a samostatná úloha; učitel ověřuje řešení. | `15 min` A; C: celá hra může trvat déle. S B: klíč oddělit a ukázat až po pokusu. | B: skupinový režim je jasný; 268 znaků a čas může být zaměněn za celé trvání. |
| `math-statistics-analysis` — Průvodce žákovským zkoumáním dat (SŠ) | G A: žáci formulují hypotézy, počítají a interpretují. R A: učitel vede a výslovně ovládá AI. | V A: data, otázka a cíl; O A: interpretace, kterou učitel kontroluje. | `20 min` A; C: čas není rozpadnutý. S A: syntetická nebo školou schválená data. | A: výrazně vysvětluje učitelskou roli i soukromí. |

### Čeština

| ID a aktivita (cílová skupina) | Cíl a role R | Vstupy V · výsledek/kontrola O | Čas T · bezpečnost S | Karta pro začátečníka |
|---|---|---|---|---|
| `czech-essay-feedback` — Formativní zpětná vazba ke slohu (6.–9.) | G A: získat návrhy formativních komentářů. R A: učitel vkládá text; B: žák je příjemce komentáře. | V A: modelový či schválený text; B: zadání/ročník. O B: návrh feedbacku, který učitel posoudí. | `2 min/žák` A; C: není jasné, zda je to AI zpracování, učitelská kontrola či čas práce. S A: skutečný text pouze ve školou schváleném režimu. | B: důležité soukromí je až v detailu/promptu; „hodnocení“ může znít jako známkování. |
| `czech-dictation-generator` — Učitelská příprava pravopisného diktátu (6.–9.) | G A: učitel připraví diktát a procvičovaný jev. R A: učitelská příprava. | V A: jev a věk; B: rozsah a omezení učiva. O B: diktát, oddělený klíč a poznámka k opravě; učitel kontroluje pravopis. | `5 min příprava` A, jasně příprava, neověřená. S B: učitel ověřuje text a přiměřenost. | A: role a rozsah jsou srozumitelné. |
| `czech-literary-analysis` — Příprava literárního rozboru (SŠ) | G A: učitel připraví otázky/osnovu. R A: učitelská příprava; žák později analyzuje. | V A: dílo, ověřený úryvek/podklad; B: cíl/ročník. O B: návrh otázek; ověřovat tvrzení o díle a textu. | `10 min příprava` A; C: skutečný čas zdrojové kontroly není měřen. S B: podklad musí být ověřený a oprávněně použitelný. | A/B: účel jasný, podmínka zdrojů až po otevření promptu. |
| `czech-spelling-word-exercises` — Vyjmenovaná slova (1.–5.) | G A: žák volí tvar a vysvětluje pravidlo/význam. R A: učitel připraví; B: žák pracuje s listem. | V A: probraná řada a učivo; B: cíl, podpora a čas žáků. O A: krátký text/úlohy/oddělený klíč; učitel ověřuje pravopis a příbuznost. | `5 min příprava` A; C: příprava materiálu vs jeho kontrola. S B: modelový text, bez skutečné práce žáka. | B: podmínky jsou podrobné, popis má 235 znaků. |
| `czech-matura-oral-exam` — Orientační nácvik maturitního rozhovoru (SŠ) | G A: žák procvičuje ústní odpověď. R A: žák mluví s AI. | V B: dílo, školní otázky/podklady. O B: dialog a feedback; učitel nesmí považovat AI hodnocení za oficiální výsledek. | `20 min aktivita` A; C: časový plán není doložen. S A: neoficiální nácvik; B: ověřovat interpretace. | B: příjemně jasné „orientační“, režim soukromí/účet není na kartě. |
| `czech-writing-form-guide` — Žák píše vlastní sloh s průvodcem (6.–9.) | G A: žák zůstává autorem; plánuje, píše a reviduje. R B: žák vede interaktivní AI. | V B: útvar, zadání a vlastní nápady žáka. O B: osnova a žákův text; ověřitelnost přes žákovy cíle, nikoli AI skóre. | `15 min aktivita` A; C: rozpis je neurčen. S B: osobní text a schválené prostředí nejsou v kartě. | B: účel dobře viditelný; podmínky a ochrana autorství až v promptu. |

### Angličtina

| ID a aktivita (cílová skupina) | Cíl a role R | Vstupy V · výsledek/kontrola O | Čas T · bezpečnost S | Karta pro začátečníka |
|---|---|---|---|---|
| `english-conversation-partner` — Individuální anglická konverzace podle CEFR (6.–9.) | G A: žák procvičuje rozhovor na úrovni CEFR. R B: žák jedná přímo s AI. | V A: úroveň a téma; B: učitel volí režim. O B: konverzace a závěrečný feedback. | `15 min aktivita` A; C: bez časového rozpisu. S B: učitel určuje školou schválený režim. | B: popis dlouhý 260 znaků; role AI přímá až při rozbalení. |
| `english-grammar-feedback` — Formativní zpětná vazba k anglickému textu (SŠ) | G A: žák dostane feedback na gramatiku a jazyk. R B: žák/učitel pracuje s AI; card neurčuje, kdo vkládá text. | V B: CEFR, jazyk vysvětlení a text. O B: vysvětlení pravidla a možné varianty; lidská kontrola. | `3 min/text` A; C: není to délka práce žáka ani jasně označený čas opravy. S B: skutečná práce pouze ve schváleném režimu. | B: jasný účel, slabá informace o operátorovi/soukromí. |
| `english-vocabulary-builder` — Tematická slovní zásoba (1.–5.) | G A: žák vybavuje a používá nová slova. R A: učitel vybírá cíl, žáci následně procvičují. | V A: téma, CEFR, známá slova; B: velikost sady. O B: cyklus procvičení a klíč, kontrola překladu/přiměřenosti. | `10 min příprava` A; C: neznáme čas následné žákovské práce. S B: obecné použití, bez osobních dat. | B: z názvu není patrné, že jde o učitelskou přípravu; 200 znaků. |
| `english-cambridge-exam-practice` — Orientační procvičování Cambridge English (SŠ) | G A: žák procvičí dovednost/zadání. R B: žák komunikuje s AI. | V B: typ zkoušky, úroveň, dovednost a úloha. O B: úlohy/feedback; skóre není oficiální a učitel ověřuje kritéria. | `30 min aktivita` A; C: bez rozpisu a ověření. S A: výslovně neoficiální; B: školní přístup. | A: „orientační“ pomáhá, ale žádná podpora začátečníka v přípravě. |
| `english-grammar-exercises` — Anglická gramatika: pracovní list (6.–9.) | G A: pracovní list k cíli. R A: učitel připravuje, žák řeší list; B: další úlohy až z promptu. | V A: CEFR, ročník, jev, znalosti, cíl, počet a žákovský čas; O A: list, oddělený klíč a kontrola přijatelnosti variant. | `5 min příprava` A; C: kontrola/realizace nezahrnuta. S B: školní pravidla a ověření jazykových variant. | B: detailní úkol, ale popis 298 znaků; začátečník má mnoho vstupů najednou. |
| `english-contextual-translation` — Skupinová překladatelská dílna (SŠ) | G A: skupina volí/zdůvodňuje překlad. R A: žáci nejprve překládají, učitel následně zprostředkuje AI. | V A: text, jazyky a úroveň; B: text, který lze použít. O A: porovnání variant; B: reflexe idiomů. | `10 min aktivita` A; C: bez rozpisu. S B: oprávnění k textu je v promptu. | A: role žáků jasná; učitelské zprostředkování a copyright až v promptu. |

### Přírodní vědy

| ID a aktivita (cílová skupina) | Cíl a role R | Vstupy V · výsledek/kontrola O | Čas T · bezpečnost S | Karta pro začátečníka |
|---|---|---|---|---|
| `biology-virtual-lab-experiment` — Biologická simulace (6.–9.) | G A: žáci tvoří hypotézu a posuzují meze modelu. R A: učitel ovládá AI. | V B: ověřený model, verze a podklad. O A: modelový scénář není měření; učitel kontroluje předpoklady. | `20 min` A; C: orientační délka bez rozpisu. S A: pokud model chybí, žádný předstíraný experiment. | A: jasný rozdíl mezi simulací a měřením. |
| `chemistry-equation-guide` — Chemické rovnice: nápověda po pokusu (SŠ) | G A: žák počítá atomy a postupně vyvažuje rovnici. R B: žák interaguje přímo; učitel ověřuje chemickou smysluplnost. | V A: konkrétní rovnice; O B: kroky/nápovědy a kontrola učitele. | `10 min` A; C: čas neurčený. S B: pracovat s konkrétní dodanou rovnicí, nic nevymýšlet. | A/B: smysluplný cíl, ochrana účtu/školní schválení až v promptu. |
| `physics-phenomenon-analogies-explainer` — Učitelská příprava analogií (6.–9.) | G A: učitel vybere analogii a vysvětlí její hranice. R A: učitelská příprava. | V A: jev, ročník, znalosti, cíl; O A: nejvýše tři analogie s mapováním a možnou mylnou představou, kontrola učitelem. | `5 min` A; C: příprava vs. celý proces neurčen. S B: ověřit přírodovědné tvrzení. | A: roli učitele říká název; neověřený čas může znít velmi krátce. |
| `biology-animal-encyclopedia` — Badatelský profil živočicha (1.–5.) | G A: žáci porovnají tvrzení ze zdrojů a doloží poznatek. R A: učitel volí krátký/rozšířený režim; žáci zkoumají. | V A: dva ověřené texty v krátkém režimu; B: zdroje pro rozšířený. O A: důkaz/shoda/nejistota; kontrola zdrojů. | `8 min` A pro krátký režim; B: rozšířený prompt uvádí orientačně 20–30 min. S A: nevymýšlet zdroje či stav ohrožení. | B: dvě délky a režimy nejsou v hodnotě `duration`; popis 258 znaků. |
| `physics-problem-solver` — Fyzikální tutor po vlastním pokusu (SŠ) | G A: žák navrhne první krok, dostává jednu nápovědu. R B: žák je adresát/interaguje s AI; učitel kontroluje. | V B: úloha a cíl, známé/hledané veličiny. O B: samostatný postup; lidské ověření. | `5 min` A; C: čas řešení neurčen. S B: nenahradit kontrolu učitelem. | B: student role je jasná, AI operátor/školní režim méně. |
| `chemistry-elements-compounds-quiz` — Chemický kvíz (6.–9.) | G A: žák samostatně řeší kvíz a reflektuje odpověď. R A: učitel stanoví cíl a ověřuje každý chemický údaj. | V A: učivo a cíl; B: zdroje a rozsah. O A: kvíz, oddělený klíč, reflexe chyby nebo správné odpovědi. | `6 min příprava` A; C: kontrola rozsahu není měřena. S A: nepřidávat nepodložené chemické údaje či pokusy. | A/B: jasné, ale role kvízu a zdroje se plně vyjasní až v detailu. |

### Dějepis

| ID a aktivita (cílová skupina) | Cíl a role R | Vstupy V · výsledek/kontrola O | Čas T · bezpečnost S | Karta pro začátečníka |
|---|---|---|---|---|
| `history-roleplay-historical-person` — Historický rozhovor/simulace (6.–9.) | G A: žáci kladou otázky simulaci a porovnávají tvrzení. R A: učitelem vedené; B: kdo technicky zadává AI není výslovně v kartě. | V B: osobnost, období a ověřené zdroje. O A: AI označí modelované odpovědi; třída srovná s prameny. | `20 min` A; C: čas neurčen. S A: fiktivní simulace, ne autentický pramen. | A: simulace i kontrola viditelné; A/B: školní režim až v promptu. |
| `history-timeline-generator` — Časová osa z podkladů (1.–5./6.–9./SŠ) | G A: učitel připraví osu z ověřených událostí. R A: příprava učitelem. | V A: období, události a zdroje; B: jejich dostatečnost. O B: chronologický návrh, žákovské ověřování. | `5 min příprava` A; C: ověření zdrojů není zahrnuto. S A: nevymýšlet data/fakta. | A: čitelný učitelský postup, zdrojové podmínky až v promptu. |
| `history-debate-pro-con` — Historická debata podle pramenů (SŠ) | G A: žáci argumentují a reagují na důkazy. R A: žáci diskutují; B: není jasné, zda AI používá učitel, skupina nebo oba. | V A: téma, období, prameny; O B: argumenty a rozlišení jistoty; učitel schvaluje otázku/prameny. | `25 min` A; C: výuková délka není výslovně označena. S A: téma a zdroje schvaluje učitel. | B: smysl jasný, operátor AI neurčen; potřebné zdroje v detailu. |
| `history-period-newspaper` — Simulovaný dobový článek (6.–9.) | G A: žáci ověřují fakta a odlišují fikci. R A: učitel připravuje text, žáci kontrolují. | V A: událost, fakta, zdroje; O A: simulovaný článek a redakční kontrola. | `10 min příprava` A; C: ověřování žáky navazující. S A: simulovaný text nesmí být zaměněn za pramen. | A: fikce/ověření jasné; oprávnění ke zdrojům až v promptu. |
| `history-source-analysis` — Skupinová analýza pramene (SŠ) | G A: skupina analyzuje důkaz, jazyk a nejistotu. R A: skupina pracuje; B: AI operátor není určena. | V A: konkrétní pramen a původ; O B: hypotézy, které žáci ověřují. | `15 min` A; C: rozsah úkolu závisí na prameni. S A: právo použít pramen i ověřené údaje. | B: detailní, ale vstup vyžaduje konkrétní zdroj a oprávnění. |
| `history-map-analysis` — Čtení historické mapy (1.–5./6.–9.) | G A: žák popisuje mapové důkazy. R A: učitel vybírá mapu, žáci hledají; B: operátor AI neurčen. | V A: mapa/zdroj; B: legenda, měřítko, období. O B: doložený popis vs. hypotéza. | `10 min` A; C: čas není rozpadnutý. S B: autorská práva mapy / zdrojový kontext nejsou na kartě. | B: účel jasný, ale nutnost mapy/legendy skrytá v promptu. |

### Hlavní knihovna („Doporučeno“)

| ID a aktivita (cílová skupina) | Cíl a role R | Vstupy V · výsledek/kontrola O | Čas T · bezpečnost S | Karta pro začátečníka |
|---|---|---|---|---|
| `math-real-life-word-problems` — Žáci modelují reálnou situaci (6.–9.) | G A: žák volí údaje/předpoklady a obhájí model. R A: žák řeší; B: student-AI režim v promptu. | V A: scénář, matematický cíl, učivo; O A: žákův model, AI pouze klade otázky. | `5 min příprava` A; C: přestože úkol je žákovský, délka je přípravná. S B: bezpečný scénář. | B: rozpor role/tématu času vyžaduje detail. |
| `math-ai-tutor` — Tutor: prověř chybný postup (6.–9.) | G A: žák odhalí chybu a udělá přenosovou úlohu. R A: žák s AI, učitel kontroluje; B: vlastní práce jen ve schváleném režimu. | V A: případný postup, modelová chyba nebo žádný vstup; O A: oprava a samostatný transfer. | `15 min aktivita` A; C: bez rozpisu. S A: nevyžadovat skutečnou práci žáka. | A: popis užitečný, role vhodná pro začátečníka. |
| `math-data-analysis` — Skupinové zkoumání dat (SŠ) | G A: skupina volí otázky/výpočty a obhájí závěr. R A: žáci zkoumají; B: přímé ovládání AI jen ve schváleném prostředí, jinak učitel. | V A: cíl, data a otázka; O A: vlastní závěr skupiny, AI jen s nápovědou. | `20 min` A; C: není určeno, zda aktivita či AI relace. S A: syntetická/schválená data. | A: roli vysvětluje; přímý AI přístup má jasný fallback. |
| `czech-essay-workshop` — Dílna žákovské revize slohu (6.–9.) | G A: žák sám reviduje úsek. R A: žák jako autor; B: AI role při konzultaci. | V A: vybraný úsek a zadání; O B: žákova revize/reflexe. | `2 min/žák` A; C: konzultace vs. psaní/čtení není vymezeno. S A: modelový text nebo schválený režim; anonymizace nestačí. | A/B: rozlišení od AI zpětné vazby ke slohu je patrné, role AI detailnější až v promptu. |
| `czech-dictation-activity` — Žákovská dílna pravopisných chyb (6.–9.) | G A: žák rozpozná, opraví a zdůvodní chyby. R A: práce žáků; B: zda žáci zadávají prompt přímo. | V A: předem ověřený modelový text; O A: oprava a reflexe, klíč kontroluje učitel. | `5 min příprava` A; C: při žákovské dílně není práce zahrnuta. S A: žádné neověřené skutečné práce. | A/B: název odlišuje od generátoru, čas je zavádějící. |
| `czech-literary-analysis-class` — Žákovská interpretace ukázky (SŠ) | G A: žák dokládá vlastní interpretaci textem. R A: žák interpretuje; B: otázky AI lze nahradit offline listem. | V A: ukázka, cíl a případný kontext; O A: interpretace s textovým důkazem. | `10 min příprava` A; B: popis uvádí žákům orientačně 15–20 min práce. S B: oprávnění k úryvku a zdroj. | A/B: role dobře odlišena, ale čas na kartě čten jako příprava. |
| `english-conversation-activity` — Párová konverzace (6.–9.) | G A: komunikace mezi žáky; AI poskytuje jen scénář/frázi. R A: učitel organizuje a určuje vstup AI. | V B: CEFR, situace a cíl. O A: žákovský rozhovor. | `15 min` A; B: aktivita, přesný rozpis chybí. S B: škola volí schválený režim. | A: skupinový/párový úkol zřetelný; vstupy až v promptu. |
| `english-essay-feedback` — Formativní zpětná vazba k eseji (SŠ) | G A: žák reviduje esej v jednom kroku. R A: žák/AI dialog; B: kdo vloží text není zcela jasné. | V A: esej a zadání; O B: návrh na revizi, bez oficiálního skóre. | `3 min/text` A; C: neurčeno, zda práce žáka či zpracování vstupu. S A: schválený režim pro skutečné texty. | B: důležité soukromí detailněji než popis karty. |
| `science-virtual-lab-simulation` — Modelované přírodovědné scénáře (6.–9.) | G A: žáci formulují hypotézu a srovnávají modelové scénáře. R A: učitel ovládá AI. | V A: téma/cíl/ročník/model; O A: modelový výsledek oddělen od měření. | `20 min` A; B: orientační, rozpis chybí. S A: ověřený model; při absenci jen označená ilustrace. | A: srozumitelný příklad bezpečné AI role. |
| `physics-phenomenon-analogies-class` — Žáci tvoří fyzikální analogie (6.–9.) | G A: žáci tvoří a kritizují analogii. R A: učitel moderuje, žáci začnou bez návrhu AI. | V A: jev, ročník a podklady; O A: vymezení podobnosti, hranic a fyzikální reality. | `5 min` A; C: karta sama uvádí, že plná dílna může trvat déle. S B: ověřené podklady. | A: text přímo varuje před podceněním času, ale popis 288 znaků. |
| `history-roleplay-classroom` — Historický třídní rozhovor (6.–9.) | G A: žáci připraví otázky a ověřují odpovědi. R A: učitel moderuje; B: explicitně ovládá AI. | V A: ověřené prameny; O A: odpovědi se ověřují vůči nim. | `20 min` A; B: orientační, rozpis není doložen. S A: simulace označena, ne svědectví. | A: role a varování simulace jasná. |
| `history-class-timeline` — Třídní laboratoř časové osy (6.–9.) | G A: třída rozhoduje o pořadí a souvislostech. R A: učitel moderuje, žáci skládají. | V A: ověřené události a zdroje; O A: osa vzniká až z práce žáků; AI ji nemá prozradit. | `5 min příprava` A; C: vlastní třída/žákovská práce chybí. S A: žádná vymyšlená data/příčiny. | A/B: dobrý popis úlohy, čas míchá přípravu s třídní činností. |
| `general-prompt-power-up-relay` — Týmová laboratoř promptů (6.–9./SŠ) | G A: tým navrhne a otestuje prompt. R A: žáci tvoří; B: kdo vede technický dialog s AI. | V B: úkol a záměrně slabý prompt. O A: porovnání výstupů a doložená úprava. | `12–20 min` A; C: rozpětí bez rozpisu. S B: aktivita má vlastní detailní pravidla; školní přístup k AI. | B: doporučeno, ale nejasný začátek a potřeba připraveného podkladu. |
| `general-fact-or-fiction` — Detektivové faktů (6.–8.) | G A: tým ověří tvrzení v nezávislých zdrojích. R A: učitel vybírá/ověřuje zdroje; skupiny pracují. | V A: téma a schválené zdroje; O A: ověřené tvrzení, opravená nepravda. | `10–18 min` A; C: rozsah bez fáze. S A: citlivá/aktuální témata vyloučena, AI klíč jen hypotéza. | A: dobře vymezené hranice; „Doporučeno“ nemá veřejně dané kritérium. |

## 4. Časové údaje

V datech je **18 různých řetězců** `duration`:

| Typ zápisu | Počet aktivit | Výklad z dostupných podkladů |
|---|---:|---|
| `… min příprava` | 12 | Jednoznačně deklarovaná příprava učitele; není doloženo, zda obsahuje kontrolu, úpravy, tisk či setup nástroje. |
| `… min aktivita` | 6 | Jednoznačně míněno trvání aktivity; bez časového rozpisu a bez potvrzení pilotem. |
| `… min/žák` nebo `… min/text` | 4 | Jednotka je jasná, ale ne vždy je jasné, zda jde o práci žáka, průchod AI jedním textem, učitelskou kontrolu či celou konzultaci. |
| Rozsah bez štítku `aktivita`/`příprava` (`12–20`, `10–18`) | 2 | Rozsah je viditelný, fáze a způsob výpočtu nejsou. |
| Pouhé `N min` | 20 | Význam se nedá bezpečně rozlišit mezi přípravou, výukou, jedním dialogem a kontrolou. |

Časy lze na kartě rychle najít, ale údaj často svádí k plánování bez odhadu přípravy a ověření. Konkrétní třecí případy: `math-real-life-word-problems` má žákovskou práci, ale `5 min příprava`; `czech-dictation-activity` a `history-class-timeline` popisují žákovskou/třídní práci, ale uvádějí jen přípravu; `czech-literary-analysis-class` rozlišuje 10 minut učitelské přípravy a orientačních 15–20 minut žákovské práce; `biology-animal-encyclopedia` má krátký 8min režim a delší 20–30min režim v promptu, nikoli v `duration`; `physics-phenomenon-analogies-class` výslovně varuje, že 5 minut není délka celé dílny.

**Navržený budoucí model** (metadata; nevymýšlet neznámé hodnoty):

| Pole | Význam |
|---|---|
| `teacherPrepMinutes` | Rozmezí/odhad přípravy, nebo `null`. |
| `learnerWorkMinutes` | Rozmezí práce jednotlivce/skupiny/třídy, nebo `null`. |
| `teacherReviewMinutes` | Kontrola, úprava a výběr výstupu, pokud ji lze samostatně odhadnout; jinak `null`. |
| `timeStatus` | `not_provided`, `unverified_estimate` nebo `pilot_observed`. U pilotu ukládat kontext; nepředstírat univerzální přesnost. |
| `timeNote` | Stručné vysvětlení zvláštností, např. „8 min krátký režim; delší podle volby“. |

Pro zpětnou kompatibilitu ponechat `duration` a jeho současné hodnoty jako legacy display fallback. Nová pole vyplňovat jen tam, kde dokumentace podporuje rozdělení. `null` a „neuvedeno“ jsou bezpečnější než odvozený přesný čas. Před převodem těchto 44 hodnot je potřeba pedagogické rozhodnutí/pilot, ne mechanická migrace.

## 5. Role učitel–žák–AI

| Model použití | Příklady | Závěr o viditelnosti před otevřením |
|---|---|---|
| AI při učitelské přípravě | `czech-dictation-generator`, `english-grammar-exercises`, `history-timeline-generator` | Název „příprava“ nebo popis to většinou sděluje; vstupy a kontrola jsou často až v promptu. |
| Učitel AI ovládá při výuce | `math-statistics-analysis`, `biology-virtual-lab-experiment`, `science-virtual-lab-simulation`, `history-roleplay-classroom` | U několika jasně uvedeno na kartě; většinou zůstává na učiteli, zda AI technicky ovládá on, nebo skupina. |
| Žák vede dialog přímo s AI | `math-step-by-step-guide`, `czech-matura-oral-exam`, `english-conversation-partner`, `physics-problem-solver` | Název/popisek někdy naznačí přímý dialog, avšak schválené školní prostředí, účet a pravidla se často objeví až v promptu. |
| Přímý přístup volitelný | `math-data-analysis`, `czech-literary-analysis-class` | Dobrý vzor: karta/detail může ukázat učitelem vedenou/offline variantu; doporučit stejnou stručnou volbu i u dalších podobných aktivit. |
| AI poskytuje materiál, žák pracuje bez ní | `czech-spelling-word-exercises`, `chemistry-elements-compounds-quiz`, `math-story-problem-game` | Materiál a oddělený klíč jsou čitelné; karta však ne vždy výslovně říká „žáci AI nepoužívají“. |

Všech 44 promptů zmiňuje učitele, ale to neznamená, že je role AI operátora výslovně rozhodnuta. Pouhý formát `individual`, `groups` či `classroom` neurčuje, kdo má přihlášený účet a kdo zadává prompt. Strojová obsahová kontrola našla výslovný odkaz na školní schválení v 17/44 promtech; formulace se vztahuje jen na relevantní úkoly a není důkazem, že škola konkrétní nástroj schválila.

**Návrh role na kartě:** krátký textový štítek `Učitel připravuje`, `Učitel vede AI`, `Žák používá AI*`, `Učitel / žák – zvolit variantu` nebo `AI jen v připraveném materiálu`. Hvězdička u žákovského přístupu rozbalí přesnou větu: „Jen pokud škola schválila konkrétní nástroj, účet a režim práce s daty; jinak použijte učitelem připravený materiál.“ Nezaměňovat s aktuálním schválením školy.

## 6. Překryvy a podobné aktivity

Nebyla potvrzena dvojice, jejíž odstranění by zlepšilo knihovnu. Následující páry jsou příbuzné, ale mají jiný účel, fázi nebo rozdělení práce. Výchozí doporučení je zachovat všech 44 položek a tam, kde je rozdíl na kartě slabý, přidat související aktivitu či stručné „Vyberte, pokud…“.

| ID | Překryv | Duplicita, nebo smysluplné varianty? | Rozdíl viditelný z karty? | Doporučení |
|---|---|---|---|---|
| `math-word-problem-generator` ↔ `math-real-life-word-problems` | Slovní úlohy a reálný kontext. | Varianta: první učitel připraví úlohy, druhá vede žákovo vlastní modelování. | Částečně; druhá říká, že žáci modelují, první je výslovně pro učitele. | Ponechat; propojit jako „vytvoř materiál / uč žáky modelovat“. |
| `math-step-by-step-guide` ↔ `math-ai-tutor` ↔ `physics-problem-solver` ↔ `chemistry-equation-guide` | Interaktivní tutor a nápověda po vlastním pokusu. | Příbuzné, nikoli duplicity: obecné matematické procvičení, kontrola chybného řešení, fyzikální veličiny, vyčíslování rovnic. | Ano podle předmětu/titulu; přesný typ nápovědy až v promptu. | Ponechat; propojit jako „tutor podle předmětu / problému“. |
| `czech-essay-feedback` ↔ `czech-essay-workshop` | Slohový text a zlepšování psaní. | První připravuje feedback pro učitele; druhá vede žáka k vlastní revizi. | Středně; názvy jsou podobné, popisy lépe rozlišují příjemce. | Ponechat; jasně popsat „učitel poskytne feedback“ vs. „žák sám reviduje“. |
| `czech-dictation-generator` ↔ `czech-dictation-activity` | Pravopisné cvičení/diktát. | Příprava ověřeného diktátu vs. žák hledá chyby v hotovém modelovém textu. | Ano, ale přípona generator/activity a přípravný čas mohou být pro nováčka nejasné. | Ponechat; přidat křížový odkaz. |
| `czech-literary-analysis` ↔ `czech-literary-analysis-class` | Práce s literární ukázkou. | Učitel připravuje otázky/osnovu vs. žák samostatně interpretuje a dokládá tvrzení. | Ano v názvu; největší rozdíl je v popisu a fázi AI. | Ponechat; propojit přípravnou a žákovskou variantu. |
| `english-conversation-partner` ↔ `english-conversation-activity` | Procvičování mluvení v angličtině. | Individuální AI konverzace vs. komunikace ve dvojici/skupině s omezeným vstupem AI. | Ano, „individuální“ vs. „párová“, ale operator AI až v detailu. | Ponechat; viditelně označit, zda hlavní rozhovor vede AI nebo spolužák. |
| `english-grammar-feedback` ↔ `english-essay-feedback` | Zpětná vazba k anglickému textu. | Gramatické vysvětlení vs. revize eseje; úrovně a cíle se liší. | Slabě/středně; obě karty vypadají jako feedback k textu. | Ponechat; krátkým štítkem rozlišit „gramatika“ a „revize eseje“. |
| `biology-virtual-lab-experiment` ↔ `science-virtual-lab-simulation` | Modelované přírodovědné scénáře. | Biologicky zaměřená hypotéza a limity modelu vs. širší návrh proměnných a kontrolních podmínek. | Částečně; rozdíl oboru je v kartě, fáze inquiry je podobná. | Ponechat; propojit a uvést, kdy volit obecný vs. biologický scénář. |
| `physics-phenomenon-analogies-explainer` ↔ `physics-phenomenon-analogies-class` | Fyzikální analogie. | Učitel vybírá/vysvětluje analogii vs. žáci sami tvoří a zkoumají její meze. | Ano, „učitelská příprava“ vs. „žáci tvoří“. | Ponechat; použít jako ukázkový pár rozdílných rolí. |
| `history-roleplay-historical-person` ↔ `history-roleplay-classroom` | Simulace historické osobnosti. | Dialogová simulace s ověřenými zdroji vs. učitelem moderovaný třídní rozhovor. | Ano, ale operační role obou karet ještě není stejně jasná. | Ponechat; doplnit role AI/učitele/žáka. |
| `history-timeline-generator` ↔ `history-class-timeline` | Historická časová osa. | Učitel připraví návrh z podkladů vs. žáci sami skládají karty a diskutují souvislosti. | Ano podle „generator / třídní laboratoř“, časová metadata ale rozostřují fázi. | Ponechat; propojit s volbou „příprava vs. třídní aktivita“. |
| `math-statistics-analysis` ↔ `math-data-analysis` | Zkoumání a interpretace dat. | První výslovně učitelem vedená s AI pod kontrolou; druhá nechává skupiny volit otázky a výpočty. | Středně; obě uvádějí skupinové zkoumání dat. | Ponechat; vyznačit rozdíl v iniciativě žáků a operátorovi AI. |

## 7. Katalog, UX a přístupnost

### Co funguje

- Hlavní katalog obsahuje všech 44 unikátních karet a 14 karet v doporučeném výběru. Filtry předmět/ročník/nástroj a textové hledání lze kombinovat; vyhledávání normalizuje českou diakritiku. Výsledkový stav je `aria-live="polite"`.
- Názvy a popisy na všech 44 kartách se shodují s registrem. Detail vystaví předmět, ročník, nástroj, čas, formát a plný prompt. Skutečné kopírování přes Clipboard API se při testu podařilo.
- Katalog se při šířkách 390/768/1440 px skládá do jednoho/dvou/tří sloupců, filtry jsou ovladatelné a v testu nebylo horizontální přetečení. Tlačítka a vstupy katalogu mají nejméně 46 px na výšku; klávesnicové obrysy jsou stylovány v CSS.
- Dialog katalogu má název, popis, `role=dialog`, `aria-modal`, zavření Escape, návrat fokusu a omezení Tab cyklu. Tato kontrola proběhla automatizovaně v Chrome; nebyla ověřena čtečkou obrazovky.

### Konkrétní nálezy

1. **Statusy míchají různé významy (P2).** V registru je 35 `ready`, 7 `favorite`, 2 `recommended`. Karty zobrazují „Připraveno“, „Oblíbené“, „Doporučeno“, zatímco hero hlásí 14 doporučených položek (kolekce `activities-main`). Chybí legenda i kritérium „oblíbenosti“; „Připraveno“ může znamenat připravený prompt nebo materiál ověřený pro použití.
2. **Doporučený výběr není definován jako začátečnická cesta (P2).** Čtrnáct aktivit zahrnuje např. SŠ analýzu dat, feedback k eseji, ověřování zdrojů a práci s modely. To může být hodnotné, ale „doporučeno“ neříká, podle čeho, pro koho, jaké vstupy jsou potřeba ani zda je to vhodné jako úplně první aktivita.
3. **Popisy jsou informačně husté (P2).** Průměrná délka je 202 znaků, medián 200; 22/44 přesahují 200 a 8/44 přesahuje 250 znaků (maximum 298). Většina delších vět přidává důležitou roli, ověření nebo časovou výhradu, takže plošné zkrácení by ztratilo bezpečnost. Lepší je první věta pro rozhodnutí a druhá pouze pro klíčovou hranici; zbytek do detailu.
4. **Přístupnost tabů na třech stránkách (P1).** Axe WCAG 2.1 A/AA hlásí `aria-required-children` s kritickým dopadem na `.tabs` v `cestina.html`, `prirodoveda.html`, `dejepis.html`: `role="tablist"` obsahuje obyčejná tlačítka bez `role="tab"`, vybraného stavu/ovládání a správně napojených panelů. `matematika.html` a `anglictina.html` používají novější vzor `role="group"` s `aria-pressed`; stránky jsou nejednotné. Preferovat jednoduchou skupinu tlačítek, pokud se nemá plně implementovat vzor tabů s šipkovou klávesnicovou navigací.
5. **Kontrast a pojmenování odkazu (P2).** Axe našel kontrastní nedostatek na modrém štítku `Čeština` na kartě `czech-spelling-word-exercises` ve všech třech šířkách katalogu a 7 kontrastních prvků na `cestina.html` v 1440 px. Ve footerech všech pěti předmětových stránek i katalogu axe hlásí `label-content-name-mismatch`: `aria-label` značky nepřebírá její viditelný text. Nejde o vizuální výpadek, ale o odlišný název pro hlasové ovládání/pomocné technologie.
6. **Karty neříkají stabilním jazykem, kdo používá AI (P1, viz oddíl 5).** Formát `👥 Skupiny` nebo `👤 Individuální` popisuje sociální uspořádání, ne operátora. U 25 karet popis zmiňuje AI a žáka/žáky, ale jen výjimečně explicitně stanoví, kdo prompt zadává. Tato volba se často objeví až v promptu.
7. **Bezpečnostní kvalifikace jsou nerovnoměrně viditelné (P2).** Obsahová kontrola nalezla výslovnou formulaci o školním schválení v 17/44 promtech a osobních/identifikovatelných údajích v 25/44. Některé aktivity, které přijímají text, data či zdroje, mají podmínky přesně formulované až v promptu; jiné nejsou na data citlivé. To není důkaz nebezpečnosti ostatních 19, ale důvod zobrazovat přesný typ podmínky u relevantních vstupů, nikoli univerzální varování.

### Mobil a navigace

Po příchodu na hlavní katalog se stránka nejprve představí názvem/počtem, poté nabídne hledání a tři filtry. Na mobilu se filtry skládají do sloupce. Předmětové stránky mají čtyři taby/sekce, úrovňové filtry a karty; na 390/768/1440 px přetekání nebylo. Všechny dotazované stránky mají horní navigaci i odkaz „Výukové aktivity“; detail katalogu se zavírá a vrací fokus. V rámci auditu nebylo plně ověřeno procházení celého webu, hlasové ovládání ani zvětšení textu na 200 %.

## 8. Bezpečnost a pedagogická odpovědnost

| Oblast | Současný důkaz | Auditní závěr / hranice |
|---|---|---|
| Lidské ověření | `teacher`/`učitel` je v každém promptu; 41/44 obsahuje přímo ověřovací či kontrolní instrukci podle obsahového vyhledání. | Silná kostra, ale ověřovatel se liší: výpočet, pravopis, jazyková varianta, zdroj, modelový výsledek či hodnoticí rubrika. Karta má říci jednu konkrétní kontrolní povinnost. |
| Návrh AI vs. fakt | Přírodovědné a dějepisné aktivity často výslovně rozlišují simulaci, pramen, model a měření. | Zachovat konkrétní rozlišení pro danou disciplínu; obecný štítek „ověřte AI“ jej nenahrazuje. |
| Osobní údaje a práce žáků | Výslovné formulace jsou v části promptů, zvlášť u esejí, feedbacku a dat. | Pro každou aktivitu přijímající práci/dat uvést použitelnou bezpečnou alternativu (modelový/syntetický podklad) a konkrétní podmínku školy. Anonymizaci nepovažovat za schválení. |
| Přímý přístup žáka k AI | Některé prompty ho dovolují jen ve školou schváleném prostředí; jiné radí přístup učitele nebo offline materiál. | Doporučený režim není schválením účtu/nástroje. Škola stanoví nástroje, věkové podmínky, přihlášení, uchování dat a dohled. |
| Autorská práva | Výslovná oprávnění/licenční formulace se objevují jen u některých úryvků, map a zdrojů. | U aktivit s vloženým textem/mapou zdůraznit odpovědnost dodat podklad, k jehož použití má učitel oprávnění. Nepřidávat neurčitý právní blok všem kartám. |
| Hodnocení | Některé aktivity pracují s rubrikou, testem nebo jazykovým feedbackem; jinde je výslovně uvedeno, že AI neznámkuje/nepředpovídá výsledek. | Striktně odlišovat návrh komentáře od známky, oficiálního skóre, maturitní predikce či nezávislého důkazu. Učitel rozhoduje a vysvětluje kritéria. |
| Disciplínová rizika | Matematika: výpočty/jednotky; historie: datum, pramen a simulace; přírodověda: model vs měření a bezpečnost; jazyky: přirozenost, alternativy a autorské texty. | Konkrétní ověřovací seznamy v promtech zachovat. Školní pravidla použití laboratoře a zdrojů musí určit škola, ne prompt. |

Plošný výstražný banner pro všechny aktivity není doporučen. Podmínku ukaž až tam, kde je relevantní: vstup skutečné práce, dat, textu, mapy/zdroje nebo přímý žákovský přístup k AI.

## 9. Pět simulovaných scénářů začínajícího učitele

Kroky jsou orientační kliky/rozhodnutí podle rozhraní; nejde o časová měření.

| Scénář | Jak najde a rozhodne | Vstupy, bezpečnost a výsledek | Kroky / riziko nedorozumění |
|---|---|---|---|
| Čeština: krátké procvičení vyjmenovaných slov | Hledá textem „vyjmenovaná“ nebo vybere Češtinu + 1.–5.; otevře `czech-spelling-word-exercises`. | Potřebuje řadu, učivo, cíl; kontroluje pravopis/příbuznost. `5 min příprava` může vypadat jako celý úkol. | ~4 kroky do rozhodnutí, 2 další pro kopii a vložení promptu. Nejasnost: „oblíbené“ neříká proč; student time je až prompt. |
| Angličtina: pracovní list A1 | Zvolí Angličtinu + 6.–9. a hledá „gramatika“; otevře `english-grammar-exercises`. | CEFR A1, ročník, jev, dříve probrané učivo, cíl, počet a čas žáka. Učitel ověřuje přirozenost/varianty. | ~4 kroky do výběru. Riziko: karta neukazuje CEFR/počet vstupů, popis je dlouhý a `5 min příprava` může být mylně pokládáno za čas listu. |
| Matematika: skupinová aktivita | Matematika + 1.–5. + Gemini nebo hledání „skupinová“; vybere `math-story-problem-game`. | Učivo, cíl, ročník, čas; žákovské karty bez klíče, učitel ověřuje výpočty. | ~3 kroky do výběru, ~2 pro prompt. Karta dobře ukazuje skupiny a úlohu; 15 min není potvrzeno jako plná aktivita. |
| Dějepis: práce s prameny | Dějepis + SŠ + hledání „pramen“; vybere `history-source-analysis`. | Musí mít konkrétní pramen i původ; ověřit oprávnění a nechat žáky kontrolovat AI hypotézy vůči prameni. | ~4 kroky. Riziko: operátor AI ani oprávnění k podkladu nejsou jasné bez detailu; čas 15 min bez ověření podle délky pramene. |
| Přírodověda: bezpečný modelový příklad | Přírodní vědy + 6.–9. + Gemini; vybere `science-virtual-lab-simulation` nebo `biology-virtual-lab-experiment`. | Ověřený model/verze a cíl; rozlišit simulaci od měření. Bez modelu jen označený scénář, žádný domnělý experiment. | ~3–4 kroky. Karta pomáhá rozpoznat bezpečnou hranici; nutný konkrétní model je až v detailu. |

Pro všechny scénáře rozhraní před promptem ukazuje kopírování, ale žádný přímý odkaz na externí AI službu. To je přijatelné, pokud je zřejmé, že se prompt kopíruje do zvoleného účtu; začátečník může potřebovat krátký obecný návod, který nenaznačuje schválení konkrétní služby.

## 10. Prioritizované nálezy a rozhodovací tabulka

| Priorita / nález | Důkaz a dopad | Dotčené stránky / ID | Návrh a očekávaný rozsah | Regresní riziko / změna promptu |
|---|---|---|---|---|
| **P1-1 Čas nemá jednotnou sémantiku** | 18 forem; 12 prep, 6 activity, 4 per-item, 2 range, 20 bare. Učitel může naplánovat méně času, než vyžaduje kontrola či práce žáka. | `data/activities.json`, všechny katalogové karty; zvlášť IDs uvedené v oddílu 4. | Po rozhodnutí přidat oddělená pole prep/learner/review + stav odhadu; starý `duration` ponechat. Prázdné tam, kde nemáme doklad. | Střední při migraci/popiscích; bez změny promptů, pilotní data nejsou podmínkou prvního metadata návrhu. |
| **P1-2 Operátor AI není stabilně patrný** | Formát individual/groups/classroom neříká, kdo zadává prompt. Karta obecně dobře popisuje činnost žáka, ale přímý AI režim bývá v promptu. | `aktivity.html`, všech 44; nejvíce užitečné u konverzací, tutorů, feedbacku, historie/dat. | Přidat vybraný role tag jen po klasifikaci každé aktivity (učitel připravuje/vede, žák ve schváleném režimu, offline materiál, varianta). | Střední: chybný tag může zavést víc než chybějící. Bez změny promptů, ale vyžaduje pedagogické rozhodnutí pro neurčené. |
| **P1-3 Tablist porušuje ARIA** | Axe critical `aria-required-children`; tablist bez tab rolí/napojení/selected state. Ovládání čtečkou obrazovky může být chybně oznámeno. | `cestina.html`, `prirodoveda.html`, `dejepis.html`, sdílený navigační pattern. | Buď všechny převést na popsanou skupinu tlačítek (nejmenší zásah, sladit se stránkami matematika/angličtina), nebo implementovat plný tab pattern včetně šipek a panelů. | Nízké až střední; ověřit běžný klik, focus a zobrazení všech panelů. Bez zásahu do promptů. |
| **P2-1 Význam statusů není vysvětlen** | 35 ready / 7 favorite / 2 recommended; jiný „14 recommended“ je kolekce. Učitel nezná kritérium, „Připraveno“ může slibovat kontrolu výstupu. | Karty všech stránek, hero, badge šablony. | Sjednotit dimenzi: např. „K dispozici“, „Redakční výběr“, „Pro začátek“ nebo legendu. Neoznačovat „oblíbené“ bez skutečných uživatelských dat. | Nízké; texty/status mapování. Promptů se netýká. |
| **P2-2 Kontrast a dostupné jméno značky** | Axe serious: barevné štítky (katalog + čeština); `label-content-name-mismatch` na patičkové značce na všech šesti stránkách. | `css/style.css`, `css/subject-pages.css`, `aktivity.html` a pět předmětových stránek. | Upravit barvy na ověřený kontrast; sladit `aria-label` s viditelným názvem (nebo odstranit nadbytečný label). | Nízké; ověřit badge varianty ve světlém/tmavém stavu a hover/focus. Bez změny promptů. |
| **P2-3 Karta je hustá** | 22 popisů >200 znaků; 8 >250; nejdelší 298. Mobile layout neteče, ale rozhodovací signál se může ztrácet mezi více povinnostmi. | Především `english-grammar-exercises`, `physics-phenomenon-analogies-class`, `math-story-problem-game`, `english-conversation-partner`, atd. | Dvě vrstvy: jedna věta účel/role; detail pro vstupy, ověření, variantu a výjimku. Zkrátit jen po kontrole, že bezpečnostní hranice zůstane viditelná. | Střední: obsah se může ztratit v truncation. Nejdřív prototyp, bez změn promptů. |
| **P2-4 Blízké aktivity nemají jednotné křížové vysvětlení** | 11 rodin/párů v oddílu 6; rozlišení zpravidla spočívá v přípravě vs. přímé činnosti žáka nebo v míře učitelského vedení. | Matematika, čeština, angličtina, přírodověda, dějepis. | Zachovat; přidat „Vyberte, pokud…“ a odkaz na sousední variantu v detailu. Žádné slučování bez důkazu. | Nízké při čistě navigačním odkazu; bez změny promptů. |
| **P2-5 Schválení a ochrana dat jsou až v promptu** | 17/44 explicitně odkazuje na školní schválení; 25/44 zmiňuje osobní/identifikovatelná data; kontexty se liší. | Textové feedbacky, dialogové aktivity, práce se zdroji/data. | U konkrétního vstupu zobrazit jednu relevantní podmínku a bezpečnou alternativu; nesypat plošná varování do všech karet. | Střední: blanket text může falešně naznačit právní schválení. Bez změny promptů pro první UI návrh. |
| **P2-6 Výběr „14 doporučených“ nemá kritérium pro nováčka** | K výběru patří i SŠ data/eseje a práce se zdroji/modely. Není doloženo, že byly vybírány podle snadnosti prvního použití. | Hero „14 doporučených“, `activities-main`. | Popsat redakční kritérium (např. nízký vstupní práh / připravená alternativa) nebo přejmenovat na tematický výběr. Ověřit u učitelů. | Nízké, pokud zůstane všech 14 a změní se jen vysvětlení. Bez promptů. |

Počty znamenají šest P2 rozhodovacích položek, ne šest chyb v kódu; párové překryvy jsou směrovací doporučení, nikoli důvod ke sloučení.

## 11. Návrh informační architektury karty

### Nezbytné na každé kartě

- Název s konkrétním výsledkem nebo činností.
- Předmět a cílová skupina/ročník.
- Jedna krátká věta „Co žák udělá / co vznikne“.
- Role AI ve stručném štítku, pokud je výslovně rozhodnuta; jinak zobrazit „Způsob práce s AI upřesněte v detailu“ místo domněnky.
- Čas s fází (příprava/žákovská práce/aktivita) pouze pokud doložen; jinak „čas neuveden“ nebo „orientační“.
- Jedno klíčové „Učitel ověří…“ jen pro konkrétní riziko této aktivity.

### Do detailu

Požadované vstupy a podklady; rozdělení učitel/žák/AI; výstup a kdy se odhalí klíč; délka a varianty; bezpečný/offline režim; kontrolní seznam; právní/přístupové omezení konkrétních zdrojů; související aktivita.

### Do promptu

Úplné instrukce pro model, pořadí otázek, čekání na pokus žáka, šablony výstupu, limity faktů, ověřovací checklisty, fallback při chybějících podkladech a ochrana dat. Prompt nemá nahrazovat označení role a času na kartě.

### Dvě varianty zobrazení

| Varianta | Obsah | Kdy ji použít |
|---|---|---|
| **Kompaktní** | Název · předmět/ročník · role AI · jedna účelová věta · čas (jen se známou fází) · Detail/Kopírovat. | Výchozí katalog a mobil. Popisek ideálně 1–2 věty, podmínky zobrazí detail. |
| **Rozšířená** | Totéž + „Žáci…“, „Učitel ověří…“, jedna podmínka použití. | Doporučená cesta pro nováčka nebo desktop při rozbalení/preview. Nezobrazovat všechna pole všem. |

Předem nikdy neskrývat podstatnou bezpečnostní podmínku za tlačítkem „Kopírovat“. Zároveň nenutit každou kartu do stejného dlouhého textu.

## 12. Návrh implementačních etap

| Etapa | Rozsah | Brána k pokračování |
|---|---|---|
| 6C/2 — role, statusy, čas | Nejdřív rozhodnout slovník rolí, statusů a časové metadatové schéma; nic neodvozovat z dosavadního `duration`. | Pedagogicky potvrzená klasifikace všech 44 a příklady neurčených stavů. |
| 6C/3 — přístupnost | Opravit tab semantics, barevný kontrast a accessible name v katalogu/předmětových stránkách. | Axe bez critical/serious relevantních porušení; klávesnice bez myši; manuální screen-reader smoke test. |
| 6C/4 — prototyp karty | Navrhnout kompaktní a rozšířenou kartu v izolovaném prototypu; zachovat registry, názvy a prompty. | Scénáře lze dokončit; časy/role se neinterpretují navíc. |
| 6C/5 — ověření s učiteli | Pět až osm začínajících učitelů absolvuje pět scénářů bez vysvětlování moderátorem. Zaznamenat úspěšnost, kroky, chybný výklad, potřebu pomoci. | Předem stanovené akceptační prahy níže; piloty časů pouze pokud škola souhlasí a je doložen postup. |
| 6C/6 — cílená implementace | Upravit pouze schválená metadata, popisy UI a přístupnost. Prompty měnit až u konkrétní doložené chyby a samostatně je znovu revidovat. | Generátory, katalogové invarianty, Playwright a regresní testy zelené; nezměněné ID/pořadí/URL. |

## 13. Akceptační kritéria pro následné opravy

1. **Úplnost:** zachovat 44 jedinečných ID, původní pořadí, názvy/URL, statusy/duration dokud nebudou schváleny změny; nedotknout se registru 204 promptů bez samostatného rozsahu.
2. **Důkazní přesnost:** žádná role, délka ani školní autorizace nesmí být odvozena jako potvrzený fakt. Neznámý čas zůstane „neuvedeno“; odhad je výslovně označen.
3. **Rozhodnutí učitele:** ze samotné karty lze určit předmět, cílovou skupinu, žákovskou činnost a kdo vede AI, pokud je režim rozhodnut. Neurčený režim zobrazí volbu, ne domněnku.
4. **Bezpečné použití:** u skutečných textů/dat/zdrojů je jasný bezpečnější modelový/syntetický vstup a konkrétní podmínka školního schválení. Nikde se netvrdí, že je externí služba školou schválena.
5. **Čas:** pole rozlišují přípravu, práci žáka a kontrolu; každý číselný odhad má stav (neověřeno/pilotně pozorováno) a kontext. Nevyplněná hodnota nemá být nahrazena vymyšlenou.
6. **Přístupnost:** opravené stránky nemají kritické/závažné axe porušení související s ovládáním; focus je viditelný, jména přístupných odkazů odpovídají viditelnému textu, filtry a dialog fungují klávesnicí a s jednou čtečkou obrazovky.
7. **Mobil/desktop:** ověřit 390, 768 a 1440 px; bez horizontálního přetečení, bez řezání karet/dialogu, s čitelnou délkou textu a dosažitelnými tlačítky.
8. **Interakce:** ověřit filtrování kombinací, diakritiku, reset, dialog/Escape/focus, skutečnou Clipboard API včetně českých znaků/odstavců/posledního znaku, kritické skripty a konzolové chyby odděleně od blokovaných externích fontů.
9. **Začátečníci:** v pěti scénářích alespoň 4/5 účastníků bez nápovědy najdou vhodnou aktivitu a správně určí vstupy, roli AI a kontrolu; žádný účastník nesmí „Připraveno“ chápat jako záruku správnosti výstupu. Pokud kritérium neprojde, zjistit konkrétní příčinu před změnou.
10. **Prompty:** žádný prompt se nemění jen kvůli stylu či délce karty. Každá budoucí obsahová oprava musí uvést reprodukovatelný problém, odborné schválení a regresní kontrolu.

## 14. Závěrečné doporučení

Implementovat má smysl: (1) přístupnost tabů/kontrastu/názvu, (2) po pedagogickém potvrzení jednoznačné role AI a časová metadata, (3) vysvětlení statusů a křížové propojení podobných variant, (4) test s novými učiteli. Zatím není důvod slučovat/smazat aktivity, měnit prompty plošně, přepisovat popisy bez prototypu ani měnit produkční web.

**Výsledek:** 44 aktivit bylo auditováno proti současnému masteru. Tento dokument je návrh pro posouzení; sám neopravňuje implementaci ani produkční nasazení.
