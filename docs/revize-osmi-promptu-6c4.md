# Revize osmi promptů – etapa 6C/4

**Stav:** cílená revize promptů podle schválených rozhodnutí R01–R08. Proměněna byla výhradně pole `prompt` u osmi uvedených aktivit; ostatní metadata ani samostatný registr `data/prompts.json` se nemění.

## Přehled

| Aktivita | ID rozhodnutí | Schválený režim | Rozsah revize |
|---|---|---|---|
| Anglická gramatika | R01 | teacher_preparation | Povinná: výslovně učitelská příprava a vyjasnění vkládání textu. |
| Chemické rovnice | R02 | flexible | Povinná: oddělení osoby dodávající rovnici od operátora a režimy A/B. |
| Fyzikální tutor | R03 | student_direct | Doporučená: výslovná podmínka schváleného prostředí; zachován vlastní první pokus. |
| Historická osobnost | R04 | teacher_led | Povinná: učitel ovládá simulaci a zprostředkovává otázky. |
| Historická debata | R05 | teacher_led | Povinná: učitel ovládá AI a určuje, kdy položí kontrolní otázku. |
| Analýza pramene | R06 | teacher_led | Povinná: učitel vybírá, ověřuje oprávnění, ovládá AI a vede předepsané pořadí. |
| Historická mapa | R07 | teacher_led | Povinná: učitel vybírá mapu, ovládá AI, žáci formulují závěr. |
| Anglická esej | R08 | flexible | Doporučená: samostatné učitelské a přímé žákovské režimy. |

## Změny a zachované principy

### R01 — `english-grammar-feedback`

- **Původní problém:** textová proměnná a formulace „learner/teacher verifies“ neříkaly, kdo prompt obsluhuje; text mohl přímo vkládat žák.
- **Změna:** učitel vybírá a vkládá modelový nebo školou schválený text. AI připravuje návrh zpětné vazby určený učiteli; učitel jej ověří, upraví a rozhodne, jak jej použije. Přímé vkládání žákem není výchozí režim a prompt nepředstírá, že žák v chatu odpovídal.
- **Zachováno:** CEFR, volba češtiny/angličtiny podle úrovně, nejvýše tři jevy, ukázka a oprava, přijatelné alternativy, jedna silná stránka, dvě otázky k revizi, self-check a zákaz známkování či přepsání celého textu.
- **Bezpečnost:** skutečná práce žáka jen ve školou schváleném nástroji a režimu; jinak modelový/syntetický text. Anonymizace sama nestačí. Nežádat identifikátory, známky ani diagnózy.
- **Riziko/omezení:** prompt nemůže sám potvrdit školní schválení. Učitel musí být schopný rozlišit návrh od vlastního hodnocení.

### R02 — `chemistry-equation-guide`

- **Původní problém:** „rovnici dodá žák nebo učitel“ určovalo zdroj vstupu, nikoli technického operátora AI.
- **Změna:** režim A výslovně znamená, že AI ovládá učitel a žákovské pokusy i nápovědy zprostředkovává. Režim B dovoluje přímou komunikaci jen po potvrzení školou schváleného prostředí a dohledu. Není-li režim zvolen, prompt se nejprve zeptá a nezačne řešit rovnici.
- **Zachováno:** nejprve samostatné počítání atomů a první krok; vždy jedna nápověda; koeficienty versus indexy; počty atomů po každém návrhu; chemická smysluplnost; učitelské ověření; bez vymýšlení reakcí/produktů a nebezpečných postupů; přenosová úloha schválená učitelem.
- **Bezpečnost:** operátor není odvozen od toho, kdo rovnici dodal. Přímý režim je podmíněný potvrzením schválení; samotný prompt schválení nedokládá.
- **Riziko/omezení:** AI nedokáže nezávisle ověřit, zda školní schválení skutečně platí; tuto podmínku musí zajistit uživatel a škola.

### R03 — `physics-problem-solver`

- **Původní problém:** přímý žákovský dialog byl patrný, ale podmínka schváleného nástroje/režimu chyběla.
- **Změna:** na začátku je výslovně řečeno, že přímá práce probíhá pouze ve školou schváleném nástroji a režimu, pod dohledem podle školních pravidel. Prompt sám není povolením; bez potvrzení se žák obrací na učitele.
- **Zachováno:** první vlastní pokus, známé a hledané veličiny, postupné nápovědy, jednotky, znaménko a řád výsledku, oprava bez nálepkování, vzorové řešení až poté, přenosová úloha, učitelské ověření a žádné známkování.
- **Bezpečnost:** přímý režim jen ve schváleném prostředí a pod dohledem; chybějící údaje se nevymýšlejí.
- **Riziko/omezení:** textový prompt nemůže ověřit školní režim ani faktický dohled.

### R04 — `history-roleplay-historical-person`

- **Původní problém:** simulace pro žáky neříkala dostatečně jasně, kdo AI ovládá.
- **Změna:** AI technicky ovládá učitel, žáci předkládají otázky učiteli a ten je zadává i moderuje následné ověřování.
- **Zachováno:** přesný štítek `VZDĚLÁVACÍ SIMULACE – AI NENÍ HISTORICKÁ OSOBNOST ANI PRAMEN` na začátku každé odpovědi; tři kategorie historicky doložené tvrzení, historická interpretace a modelovaná odpověď AI; žádné autentické citace či soukromé myšlenky; srovnání tvrzení s prameny po každém kole.
- **Bezpečnost:** bez učitelem ověřených podkladů simulovaná odpověď nevznikne; modelovaná odpověď se nevydává za pramen.
- **Riziko/omezení:** učitel musí označení zachovat při projekci či kopírování každé odpovědi.

### R05 — `history-debate-pro-con`

- **Původní problém:** prompt o kontrolních otázkách neurčoval, kdo spouští AI a kdy.
- **Změna:** učitel ovládá AI a výslovným pokynem rozhoduje, zda a kdy položí jednu kontrolní otázku. Žáci samostatně formulují argumenty a dokládají je prameny; AI jejich argumentaci nevytváří ani nenahrazuje.
- **Zachováno:** rozlišení doložených faktů, odborných interpretací, sporných otázek a tvrzení bez opory; zákaz falešné rovnováhy; schválení tématu, pramenů a pravidel; rozbor původu a omezení důkazů.
- **Bezpečnost:** nevymýšlet prameny, citace ani data; bez učitelského pokynu AI do debaty otázky nevkládá.
- **Riziko/omezení:** kvalita argumentace stále závisí na výběru a kontrole učitelem schválených pramenů.

### R06 — `history-source-analysis`

- **Původní problém:** skupinová práce nevymezovala technickou obsluhu AI a pořadí předávání podnětů.
- **Změna:** učitel vybírá pramen, ověřuje oprávnění, ovládá AI a předává její otázky/nápovědy. Žáci analyzují ve skupině. Prompt vynucuje pořadí: dvě tvrzení a otázka nejprve bez AI; učitel předá podněty; AI položí jednu otázku; skupina odpovídá a ověřuje; učitel kontroluje správnost.
- **Zachováno:** přímý doklad versus hypotéza versus neznámé; nevymýšlet citace, autora, dataci ani původ; nápověda místo hotového rozboru; bez známkování.
- **Bezpečnost:** vyžádat pramen a potvrzení oprávnění; pokud chybí, analýzu nevytvářet.
- **Riziko/omezení:** učitel musí předávat podněty skupiny bez identifikujících údajů.

### R07 — `history-map-analysis`

- **Původní problém:** mapa i diskuse byly popsány pro žáky, ale technické ovládání AI a vlastní závěr žáků nebyly dost ostře odděleny.
- **Změna:** mapu a zdroje vybírá učitel a ovládá AI. Žáci nejprve sami popíší dva prvky a otázku, teprve poté učitel zprostředkuje jednu otázku AI. Závěr formulují žáci.
- **Zachováno:** pozorování, interpretace, historické vysvětlení a nepodložená hypotéza jsou oddělené; kauzální vysvětlení vyžaduje zdroj; AI netvrdí, že viděla nepředloženou mapu a nevymýšlí příčiny.
- **Bezpečnost:** chybějící mapa, legenda, měřítko nebo zdroj se vyžádá od učitele; bez nich se analýza neprovádí.
- **Riziko/omezení:** textový popis mapy nenahrazuje její vizuální kontrolu učitelem a žáky.

### R08 — `english-essay-feedback`

- **Původní problém:** dialog s „learner“ mohl budit dojem, že žák přímo odpovídá, i když učitel pouze připravuje materiál.
- **Změna:** prompt nejprve vyžádá volbu režimu. A: učitel používá modelový/schválený text a obdrží učitelský návrh; AI nepředstírá odpovědi žáka. B: žák přímo komunikuje jen ve školou schváleném prostředí. Učitel vybírá režim; prompt neurčený režim nerozběhne.
- **Zachováno:** CEFR B1/B2, formativní účel, jedna zaměřená otázka na krok, čekání na odpověď v interaktivním režimu, nápověda před příkladem, žádné celé přepsání, známka ani předpověď zkoušky.
- **Bezpečnost:** skutečná práce pouze ve schváleném nástroji a režimu; anonymizace sama není povolením; bez osobních údajů, známek a diagnóz.
- **Riziko/omezení:** v režimu A učitel předává doporučenou otázku a zpětnou vazbu žákovi; nejde o přímou konverzaci žáka s AI.

## Rozsah a omezení

Povinnou revizi měly R01, R02 a R04–R07; doporučenou revizi R03 a R08. Žádné další aktivity ani samostatné prompty z `data/prompts.json` nebyly předmětem této změny. Textová podmínka školního schválení není technickým potvrzením, že konkrétní škola použití povolila.
