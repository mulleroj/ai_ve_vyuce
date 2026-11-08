# Finální audit produkční knihovny aktivit – etapa 6C

**Datum kontroly:** 8. 11. 2026  
**Cíl:** https://ai-ve-vyuce.netlify.app/aktivity.html (produkce přesměruje na `/aktivity`)  
**Očekávaný commit:** `94cc5dc2dace5043c15d73b69a27d18fc77454a7`

## Verdikt

**Původní verdikt z produkční kontroly:** B. ETAPA 6C VYŽADUJE KONKRÉTNÍ OPRAVY kvůli chybějícímu přístupnému oznámení výsledku kopírování. Následující dodatek tuto konkrétní chybu opravuje a regresně ověřuje na izolované větvi. Samotný dodatek neuzavírá celý audit etapy 6C/6: staré modální vrstvy nelze otevřít běžným ovládáním, axe obsahuje položky vyžadující ruční kontrolu a skutečný test čtečkou obrazovky nebyl k dispozici.

## Rozsah a metoda

Dokončovací běh proběhl 8. 11. 2026 přímo proti `https://ai-ve-vyuce.netlify.app/aktivity.html`; odpověď byla HTTP 200 a produkce přesměrovala na `/aktivity`. Použil jsem izolovaný Playwright 1.65.0, Chromium a `@axe-core/playwright` s axe-core 4.14.0. Závislosti a testovací prohlížeč byly instalovány pod dočasnou cestu `%TEMP%\codex-audit-6c6`, mimo `node_modules` projektu. Nebyl změněn produkční kód ani jiné soubory než tento auditní dokument. Existující necommitnuté změny v hlavní pracovní kopii zůstaly zachovány.

Produkční commit `94cc5dc2dace5043c15d73b69a27d18fc77454a7` je převzat jako uživatelem ověřené východisko. Samotné SHA nebylo možné přečíst z veřejného HTML; tento audit jej nezávisle nezjišťoval přes Netlify API. Lokální HEAD hlavní pracovní kopie je odlišný a nebyl použit jako náhrada produkčního buildu.

Požadovaný axe audit byl proveden na katalogu i otevřeném detailu při všech třech rozměrech. V šesti stabilních bězích nebyla hlášena žádná axe violation. Axe vrátilo 2–3 incomplete/manual-check výsledky podle stavu stránky; proto nula automatických porušení neznamená úplný soulad s WCAG. Jednorázový nízký kontrast při úvodním rychlém běhu nebyl v následných časovaných opakováních reprodukován; je zaznamenán jako neuzavřený přechodový signál, nikoli jako potvrzená barevná závada.

## Ověřené výsledky

- Katalog obsahuje **44/44** aktivit; každá má jedno tlačítko Detail, jedno tlačítko kopírování, vyplněnou roli AI a vyplněný časový údaj.
- Součty rolí AI: **Učitel připravuje 16, Učitel vede AI 12, Učitel nebo žák 5, Žák pracuje s AI 11**.
- Otevřelo se **44/44** detailů se správným názvem a promptem. Kopírování přímo z detailu i z karty zapsalo odpovídající prompt do izolované schránky ve všech 44 případech; rozdíly CRLF/LF na Windows byly při porovnání normalizovány. Toast se vizuálně zobrazil.
- Přesný štítek „Alternativní postup“ se našel právě v šesti detailech: `czech-dictation-activity`, `czech-literary-analysis-class`, `english-conversation-activity`, `math-story-problem-game`, `czech-spelling-word-exercises`, `czech-writing-form-guide`.
- Čas a role jsou uvedeny na kartách. Detailní dialog opakuje předmět, ročník, nástroj a formu, ale nemá samostatné pole pro roli AI ani aktuální časovou hodnotu; u některých rozhodnutí se vysvětlení času vyskytuje v popisu. Hodnoty T01–T08 byly ověřeny na kartách/popisech proti schválenému rozhodovacímu záznamu.
- Vyhledání „časová osa“ vrátilo jednu aktivitu. Kombinace Matematika + 6.–9. ročník + Gemini vrátila odpovídající `math-step-by-step-guide`; reset obnovil všech 44 karet.

## Kritické

V rámci omezeného provedení nebyl potvrzen kritický nález. Neprovedená část auditu však nedovoluje vyslovit závěr, že kritické nedostatky neexistují.

## Závažné

### Kopírovací potvrzení není oznámeno čtečce obrazovky

- **Závažnost:** Závažné (přístupnost, WCAG 2.2 AA 4.1.3 – Status Messages).
- **Stránka:** `https://ai-ve-vyuce.netlify.app/aktivity`.
- **Reprodukce:** Otevřít katalog a aktivovat „Kopírovat zadání“ na libovolné kartě nebo „Kopírovat prompt“ v detailu. Vizuální toast „Prompt zkopírován do schránky!“ se zobrazí. Kontrola toastu v DOM ukázala `role=null` a `aria-live=null`.
- **Očekávané chování:** Asistivní technologie oznámí výsledek kopírování bez přesunu fokusu.
- **Doporučená oprava:** Vytvořit trvalý status region s `role="status"`, `aria-live="polite"` a vhodným `aria-atomic`; měnit jeho text při úspěchu i selhání kopírování. Poté ověřit oznámení se čtečkou obrazovky.

#### Neuzavřený přechodový signál kontrastu

První rychlý axe běh při otevřeném dialogu jednou zachytil toast s kontrastem 4,09:1 (`#3d554e` na `#b2bbb5`, pod 4,5:1). Stabilní audity na všech třech viewportech byly bez violation a pět cílených časovaných opakování během zhasínání toastu (2,78–2,90 s) nález nezopakovalo. Považuji jej za nereprodukovaný signál animačního stavu, ne za potvrzenou barevnou závadu; doporučuji zopakovat po úpravě status regionu.

## Drobné

V auditovaných stavech nebyl potvrzen další drobný funkční nález. Jednotlivá časová hodnota a role AI nejsou znovu uvedeny v detailním dialogu; zůstávají na kartě, z níž byl dialog otevřen. Doporučení: zvážit jejich zopakování v dialogu, aby při otevření zůstaly dostupné bez nutnosti dialog zavřít.

## Doporučení do budoucna / neuzavřené kontroly

Tabulka shrnuje dokončení požadovaných kontrol a omezení, která zůstala po přímém testu.

| Kontrola | Konkrétní stránka a reprodukce | Očekávané chování / další krok |
|---|---|---|
| Produkční commit | SHA `94cc5dc2dace5043c15d73b69a27d18fc77454a7` uvedl uživatel jako ověřený | Použit jako zadané produkční východisko; z HTML jej nelze nezávisle načíst. |
| T01–T08 | Ověřeny karty/obsahy osmi určených ID proti schválenému záznamu 6C/3 | Všech osm rozhodnutí odpovídá; přesná tabulka níže. |
| Šest „Alternativní postup“ | Prohledáno všech 44 produkčních detailů | Nalezeno přesně šest na ID vypsaných výše. |
| Příprava vs. výuka | Prověřeny všech 44 časových štítků a popisy T01–T08 | Role a čas jsou přítomné na všech kartách; oddělení přípravy/aktivity a neznámých fází je patrné v rozhodovacích případech. Detail modal samostatný časový údaj neopakuje. |
| 44 detailů a kopírování | Otevřeno všech 44 detailů; zkontrolován titul, prompt, zavření; z obou tlačítek kopírován text do izolované schránky | 44/44 detailů správně; 44/44 detailních a 44/44 kartových copy přesné po normalizaci konců řádků; toast se vizuálně objevil, ale není přístupně oznámen. |
| Vyhledávání a kombinované filtry | Hledání „časová osa“, Matematika + 6.–9. ročník + Gemini, reset | 1 očekávaná položka pro oba výběry; reset obnovil 44. |
| Klávesnice, Escape, fokus, dynamický obsah | Prošel Tab od začátku stránky; Enter otevřel dialog; Tab/Shift+Tab, Escape a zavření; pozorován status toast | Ovládání a návrat fokusu fungují; fokus zůstal uvnitř detailu a měl viditelný 3px obrys. Chybí přístupné oznámení kopírovacího toastu (závažný nález). |
| axe / WCAG 2.2 AA | axe-core 4.14.0, tagy WCAG 2.0/2.1/2.2 A/AA; katalog + dialog při 390×844, 768×900, 1440×900 | 0 stabilních violation ve všech šesti stavech; 2–3 incomplete/manual check výstupy. Neprokazuje plný WCAG soulad. |
| Mobil, tablet, desktop | Přímá produkce v 390×844, 768×900, 1440×900; měřen scrollWidth, karty, detail | Bez horizontálního overflow; dialog se vešel a vnitřně nepřetékal na všech třech rozměrech. |
| Starší modální vrstvy | DOM obsahuje dvě skryté `.modal-overlay` vrstvy, ale žádný `[data-modal-target]` spouštěč | Běžný uživatelský open/close test nelze vyvolat; staré vrstvy nebyly posouzeny jako používaná funkce. |

## Dokončení produkčního auditu – 8. 11. 2026

### T01–T08: porovnání schválených rozhodnutí s produkcí

Mapování ID a očekávaných rozhodnutí vychází ze schválené matice 6C/3 v `docs/role-a-casy-aktivit-6c3-navrh.md` (záznam v commitu `f7f19269906504c77934c88d27222c81b952fdfa`). Všechny minuty jsou orientační a nebyly pilotně měřeny.

| ID | Produkční aktivita | Zobrazená historická hodnota / zjištění | Výsledek |
|---|---|---|---|
| T01 | `biology-animal-encyclopedia` | 8 min; krátký režim asi 8 min, rozšířený asi 20–30 min | Odpovídá |
| T02 | `math-real-life-word-problems` | 5 min příprava; čas žákovské práce zůstává neznámý | Odpovídá |
| T03 | `czech-essay-workshop` | 2 min/žák; samostatně je zmíněna volitelná 5min varianta a delší režim bez nepodloženého čísla | Odpovídá |
| T04 | `czech-dictation-activity` | 5 min příprava; délka práce žáků neuvedena | Odpovídá |
| T05 | `czech-literary-analysis-class` | 10 min příprava; žákovská práce orientačně 15–20 min | Odpovídá |
| T06 | `english-conversation-activity` | 15 min aktivita celkem; části nejsou rozpočítány | Odpovídá |
| T07 | `physics-phenomenon-analogies-class` | Historických 5 min není vydáváno za délku celé dílny; karta uvádí čas jako neurčený | Odpovídá |
| T08 | `history-class-timeline` | 5 min příprava; délka práce žáků neuvedena | Odpovídá |

### Responzivní měření

Měřeno přímo v produkčním Chromiu při šířkách 390, 768 a 1440 px. Katalog měl v každém případě `document.scrollWidth === clientWidth`. Všechny karty zůstaly uvnitř viewportu. Dialog měl šířku 370 px při 390 px viewportu, 720 px při 768 a 1440 px; panel nepřetékal uvnitř. Nadpisy nepřetekly. Počet sloupců se přizpůsobil šířce (jeden na mobilu, dva na tabletu a desktopu). Čas a role byly na kartách přítomné ve všech rozměrech.

### Automatický axe audit

Použité tagy: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; každá kombinace katalog/detail × viewport byla testována samostatně. Výsledky:

| Viewport | Katalog | Detail |
|---|---:|---:|
| 390 × 844 | 0 violation (28 pravidel pass; 2 incomplete) | 0 violation (31 pass; 3 incomplete) |
| 768 × 900 | 0 violation (28 pass; 2 incomplete) | 0 violation (31 pass; 3 incomplete) |
| 1440 × 900 | 0 violation (29 pass; 2 incomplete) | 0 violation (32 pass; 3 incomplete) |

Mezi incomplete axe výsledky patřila ruční kontrola kontrastu a některých ARIA vztahů. Automatická kontrola se nevztahuje na správnost výuky ani plný soulad WCAG.

### Ruční kontroly přístupnosti

- Pořadí viditelných nadpisů na katalogu nevynechává úroveň (H1 → H2 → H3); žádné tlačítko stránky nemělo chybějící název.
- Tab od začátku stránky procházel přeskočením na obsah, identitu webu, navigaci, vyhledávání, tři filtry, reset a karty. Enter otevřel detail. Tab/Shift+Tab zůstaly v dialogu; v kontrolovaném cyklu bylo možné přejít na tlačítko zavření i kopírování. Obrys fokusu byl viditelný, 3 px.
- Escape z nadpisu i kopírovacího tlačítka detail zavřel; fokus se po zavření vrátil na původní spouštěč. Tlačítko zavření mělo stejný návrat fokusu. Opakované otevření různých karet fungovalo.
- Ručně spočtený kontrast reprezentativních statických ploch: text těla na pozadí 11,89:1, text v dialogovém panelu 12,66:1 a ikona zavření na jejím pozadí 11,49:1. Všech šest stabilních axe stavů bylo bez contrast violation. Jednorázový přechodový signál je uveden v závažném nálezu výše.
- Dynamický toast po kopírování má viditelný text, ale žádné `role` ani `aria-live`. Skutečné oznámení nebylo možné ověřit se čtečkou obrazovky; DOM neposkytuje status semantics, které by oznámení spolehlivě vyvolaly.
- Dialog zobrazuje předmět, ročník, nástroj a formu, ale neopakuje oddělené štítky role AI ani čas. Ty zůstávají na kartě. Je vhodné zvážit zopakování těchto polí v detailu, není to však potvrzená chyba hodnot v katalogu.

### Filtrování a kopírování

Hledání `časová osa` ukázalo `history-timeline-generator` a stav „Zobrazeno 1 aktivita“. Kombinace `subject=mat`, `level=zs2`, `tool=gemini` ukázala `math-step-by-step-guide`; reset odkryl znovu 44 aktivit. Všech 44 kartových tlačítek i všech 44 tlačítek kopírování v detailu bylo aktivováno. Schránka obsahovala odpovídající text; Windows CRLF konce řádků byly před porovnáním normalizovány na LF. Všech 88 porovnání prošlo.

Starší modální prvky `#modalPowerUpRelay` a `#modalFaktFinta` jsou v HTML, obě vrstvy jsou zavřené a produkční stránka nemá žádné `[data-modal-target]` spouštěcí tlačítko. Jejich běžnou interakci proto nelze považovat za otestovanou; není doloženo, že se jedná o aktuálně používanou funkcionalitu.

## Diagnostika Escape a regresní testy – 8. 11. 2026

Produkční stránka byla ovládána Playwright locatory v Chromium browser session. Zadání URL `/aktivity.html` přesměrovalo na `/aktivity`.

| Scénář | Stav před akcí | Akce a výsledek | Aktivní prvek po akci |
|---|---|---|---|
| Běžný detail, fokus na nadpisu | `hidden=false`; aktivní `#activityDetailTitle`; název „Žáci matematicky modelují reálnou situaci“ | Escape přes locator nadpisu; `hidden=true` | Původní Detail pro `math-real-life-word-problems` |
| Detail druhé aktivity | `hidden=false`; název „Matematický tutor: prověř chybný postup“ | Escape přes locator kopírovacího tlačítka; `hidden=true` | Původní Detail pro `math-ai-tutor` |
| Fokus kopírovacího tlačítka | Klik na `#activityDetailCopy`; `hidden=false`, aktivní `#activityDetailCopy`; toast „Prompt zkopírován do schránky!“ | Escape z fokusovaného tlačítka; `hidden=true` | Původní Detail pro `math-data-analysis` |
| Zavření tlačítkem | Detail „Žákovská interpretace literární ukázky“ otevřen, fokus nadpis | Klik `.activity-dialog-close`; `hidden=true` | Původní Detail pro `czech-literary-analysis-class` |
| Opakované cykly | Otevřeny postupně „Žáci matematicky modelují reálnou situaci“, „Žákovská interpretace literární ukázky“, první detail znovu; pokaždé `hidden=false`, fokus nadpis | Escape, tlačítko zavřít, Escape; vždy `hidden=true` | Pokaždé správný spouštěcí Detail |
| Starší modální okno | `#modalPowerUpRelay` a `#modalFaktFinta` existují, obě zavřené | Nebylo nalezeno žádné `[data-modal-target]` ani jiné uživatelské tlačítko otevírající je; běžný open/close cyklus nelze na produkční stránce vyvolat | Neověřeno, stará modální vrstva není dosažitelná běžnou akcí |

### Příčina původního nálezu

Původní test poslal Escape přes `locator('body').press('Escape')`, který necílil na fokusovaný prvek dialogu. Při opakování skončil Playwright action timeoutem, dialog zůstal otevřený a fokus zůstal na `#activityDetailTitle`. Test proto neprokázal selhání aplikace. Escape z aktuálně fokusovaného nadpisu i z tlačítka kopírování dialog zavřel a fokus vrátil ke správnému spouštěcímu tlačítku.

Produkční DOM potvrzuje načtení `js/activity-library.js`. Zdroj registruje `document.addEventListener('keydown', ..., true)` v capture fázi. Úspěšné fokusované stisky dokazují, že handler klávesu obdrží, dialog přepne `hidden` a propagace není v tomto scénáři zastavena dřívějším posluchačem. Detail se otevřel bez chyby stránky; v Playwright běhu nebyly zachyceny `pageerror` ani chyby konzole.

Kopírovací akce zobrazila toast „Prompt zkopírován do schránky!“ a detail ponechala otevřený do stisku Escape. Po Escape i kliknutí na tlačítko zavření se fokus vrátil na přesné původní tlačítko Detail.

První browser bridge nepodporoval nastavení viewportu a přímý sandboxový síťový požadavek selhal DNS. Tuto překážku obešlo izolované Playwright Chromium v testovacím prostředí; tím byly všechny tři požadované viewporty ověřeny přímo na produkci. Jedinou neproveditelnou funkcí zůstává otevření starých modalů, protože stránka nemá jejich spouštěče.

**Stav nálezu Escape: uzavřen jako falešně pozitivní nález původního testovacího postupu.** Kód aplikace nebyl měněn; nevznikla větev ani PR. Tento dílčí závěr neuzavírá celý audit 6C/6.

## Doporučení pro dokončení auditu

1. **Splněno tímto dodatkem:** doplněna trvalá status oblast pro úspěch i selhání kopírování; automaticky ověřen DOM a aktualizace na třech viewports. Skutečné hlasové oznámení čtečkou stále vyžaduje manuální ověření.
2. **Částečně splněno:** axe bylo po opravě spuštěno v otevřeném detailu na třech viewports bez porušení; katalog a další stránky nebyly po opravě znovu celé auditovány.
3. Role/time pole v detailu lze zvážit jako následné UX zlepšení; hodnoty na kartách byly ověřeny a bez chyby.
4. Staré modální vrstvy zůstávají netestovatelné přes uživatelské rozhraní, dokud neexistuje jejich spouštěč; nepředpokládat jejich používanost.

**Etapu 6C nyní nedoporučuji uzavřít.** Závažný nález přístupného oznámení kopírování je třeba opravit a znovu ověřit. Ostatní uvedené funkční a responzivní kontroly prošly; Escape zůstává uzavřeným falešně pozitivním nálezem. Tento audit netvrdí úplný soulad s WCAG.

## Oprava přístupného oznámení kopírování – 8. 11. 2026

### Potvrzená příčina

`showToast()` v `js/main.js` měnil pouze obsah vizuálního `.toast`. Tento prvek se vytvářel až při prvním oznámení a neměl `role="status"`, `aria-live` ani `aria-atomic`. Proto nebyla dynamická změna spolehlivě nabízena asistivním technologiím. Chyba se týkala společné funkce používané na více stránkách.

### Oprava

Při načtení `js/main.js` se nyní vloží prázdná, vizuálně skrytá oznamovací oblast se sémantikou `role="status"`, `aria-live="polite"` a `aria-atomic="true"`, ještě před prvním kopírováním. `showToast()` ji aktualizuje samostatně od viditelného toastu, takže toast zůstává beze změny a existuje jen jeden live region pro výsledek. Aktualizace fokusu se neprovádí a text tlačítka zůstává označením akce „Kopírovat“, aby výsledek oznamovala pouze status oblast. Při rychlých opakovaných změnách se předchozí čekající oznámení zruší; oznámí se poslední výsledek, včetně opakovaného stejného textu. Úspěch i chybová větev kopírování používají stejnou cestu oznámení.

### Ověření

- Základ opravy: `94cc5dc2dace5043c15d73b69a27d18fc77454a7`; GitHub `master` při kontrole ukazoval stejný commit, rozdíl proti uvedenému produkčnímu commitu byl nulový.
- Testovací prostředí: samostatný worktree `codex/ai-ve-vyuce-etapa6c6-toast-accessibility` z `origin/master`.
- Playwright Chromium proti lokálnímu statickému serveru z izolovaného worktree: při 390 × 844, 768 × 900 a 1440 × 900 prošla úspěšná kopie z karty i detailu, ověření obsahu Clipboard API (normalizace Windows CRLF), klávesová aktivace, opakovaná rychlá kopie, simulované selhání Clipboard API, zachování fokusu a viditelného textu toastu. Společná funkce prošla také na `prompty.html`. Dialog šel zavřít Escape a fokus se vrátil k původnímu spouštěči.
- Axe-core s tagy `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` na otevřeném detailu po postupném prosrolování všech 44 karet a doběhnutí jejich reveal animací (bez tohoto kroku axe zachytí dočasný kontrast průhledných karet mimo viewport): 390 × 844 — 0 porušení, 31 pass, 2 incomplete; 768 × 900 — 0 porušení, 31 pass, 2 incomplete; 1440 × 900 — 0 porušení, 32 pass, 2 incomplete. Incomplete položky vyžadují ruční posouzení. Automatický test ověřil, že jediná status oblast existuje prázdná před akcí a poté obdrží text úspěchu/chyby.

- Testovací závislosti: použity existující izolované Playwright a `@axe-core/playwright` z dočasné složky mimo produkční projekt; žádné testovací závislosti nebyly do projektu přidány. `node --check` všech souborů JavaScriptu, generátor aktivit `--check`, generátor promptů `--check`, validace obsahu i `git diff --check` prošly. Generátory potvrdily 44 aktivit, 14 hlavních doporučených položek a 204 promptů bez driftu.
- Skutečná čtečka obrazovky nebyla v prostředí dostupná. DOM a axe ověřují sémantiku a změny live regionu, ne skutečné hlasové oznámení ani interoperabilitu s konkrétní čtečkou.

**Stav nálezu:** opravený a regresně ověřený v izolovaném Playwright Chromium. Nejde o tvrzení úplného souladu s WCAG a tento dílčí výsledek neuzavírá jiné otevřené části auditu 6C/6.