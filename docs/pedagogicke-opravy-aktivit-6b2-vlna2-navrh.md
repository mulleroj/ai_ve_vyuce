# Pedagogický návrh oprav aktivit – etapa 6B/2, vlna 2

**Stav:** všech deset scénářů druhé vlny je implementováno v PR #33 na základě sloučené první vlny. Implementace zachovává původní ID, pořadí, statusy a délky; tento technický stav nepředstavuje pedagogické schválení služby ani školního datového režimu. Otevřená pedagogická rozhodnutí zůstávají uvedena níže.

**Východisko implementace:** `origin/master` po sloučení PR #32, commit `16f115d294c5a74b49b9dedd7222e433cbf14b36`. Návrhový audit PR #31 je oddělený. PR #33 přidává přesně deset zde vybraných záznamů do `data/activities.json` a regeneruje příslušné HTML stránky; samostatný registr promptů zůstává nedotčen.

## Výběr podle závažnosti

Vybíráme deset dosud neupravených aktivit s přímým rizikem, že AI převezme žákovu práci, operátor nebo zdroj zůstane nejasný, případně se simulace či chybná informace představí jako fakt. Výběr není pořadím v registru; první položky mají nejzávažnější riziko pro aktivní učení nebo faktickou důvěryhodnost.

| Priorita | ID | Hlavní důvod výběru |
|---:|---|---|
| 1 | `general-prompt-power-up-relay` | AI vytváří všechny čtyři postupně „lepší“ verze za týmy; může jim odebrat právě procvičovanou dovednost návrhu promptu. |
| 2 | `physics-problem-solver` | AI rovnou vyřeší úlohu; žák nemusí formulovat vlastní postup ani se pokusit o výpočet. |
| 3 | `math-step-by-step-guide` | Široký požadavek „libovolný“ postup; není jasné, kdo AI ovládá, ani zda žák dostane prostor před vysvětlením přemýšlet. |
| 4 | `general-fact-or-fiction` | AI vytváří dvě pravdy, lež, klíč i zdroj; chyba v klíči nebo vymyšlený zdroj může přenést nepravdu do třídy. |
| 5 | `history-source-analysis` | AI má určit autora, dobu, účel a kontext z vloženého pramene bez pokynu rozlišit doložené údaje od odhadu; navíc může jít o chráněný nebo citlivý text. |
| 6 | `history-roleplay-historical-person` | „Pravděpodobné“ odpovědi v první osobě mohou být zaměněny za doložené výroky historické osoby. |
| 7 | `history-period-newspaper` | Fiktivní žurnalistický text může vypadat jako dobový pramen; požadované „dobové reakce“ mohou být vymyšlené citace. |
| 8 | `history-map-analysis` | Prompt žádá rozbor mapy, ale nedodá mapu ani zdroj; AI může domýšlet hranice, migraci či příčiny. Operátor není jasný. |
| 9 | `history-timeline-generator` | AI má sama vybrat klíčové události, data a příčiny bez zdrojů; kauzální výklad může být zjednodušený nebo chybný. |
| 10 | `english-contextual-translation` | Neurčuje operátora AI ani oprávnění k vloženému textu; hotový překlad může nahradit jazykové rozhodování žáků a kulturní interpretace AI nemusí být doložená. |

Pět zbývajících neurčených případů z auditu se tímto výběrem samo nerozhoduje; návrhy níže jsou pracovní scénáře a vyžadují odborné schválení.

## Společné bezpečnostní minimum návrhů

- Výchozí vstupy mají být učitelem vytvořené, veřejně dostupné s právem k použití nebo syntetické. Skutečné žákovské práce, údaje o žácích ani jejich osobní příběhy se nevkládají do externí služby bez předchozího schválení školy pro konkrétní službu, účel, prostředí a datový režim. Anonymizace sama oprávnění nezakládá.
- Přímé ovládání AI žáky je možné pouze v prostředí a režimu schváleném školou. Pokud není schváleno, AI ovládá učitel a zprostředkuje výstupy. Tento dokument žádnou službu ani datové zpracování neschvaluje.
- AI není důkaz ani primární historický, přírodovědný či jazykový zdroj. Učitel nebo žáci porovnají konkrétní tvrzení s důvěryhodnými, skutečně existujícími podklady. Neověřená citace ani odkaz vygenerovaný AI se nepovažují za zdroj.
- Fikce, simulace a záměrně nepravdivý herní výrok jsou označené ještě před sdílením. Učitel uzavře aktivitu opravou a shrnutím faktů, aby nezůstala zapamatována dezinformace.
- Výsledky jsou návrhem k učení; AI neznámkuje a nerozhoduje o schopnostech žáka. Učitel kontroluje výstup a vede závěrečné vyhodnocení.

## 1. `general-prompt-power-up-relay` — Prompt Power-Up Relay

**Původní název a popis:** Prompt Power-Up Relay. „Žáci v týmech postupně vylepšují slabý AI prompt – přidávají roli, kontext, formát a omezení. Srovnají výstupy kola 0 a finále a hlasují o nejlepším výsledku.“

**Původní prompt:**

```text
Vezmi tento základní prompt: [PROMPT]. Vytvoř 4 postupně lepší verze přidáním role, kontextu, formátu a omezení. U každé verze stručně vysvětli, co se zlepšilo, a na konci přidej pravidlo pro ověření výstupu.
```

**Konkrétní problém:** AI za týmy vytvoří všechny kroky zlepšení. Žáci mohou jen převzít hotové verze, přestože účelem je procvičit tvorbu a iteraci promptů.

**Implementovaný název:** Týmová laboratoř promptů: navrhni, otestuj, uprav.

**Implementovaný popis:** Týmy na stejném úkolu upraví slabý prompt ve vlastních krocích, porovnají dva výstupy a doloží, jak změny ovlivnily přesnost a použitelnost. AI poskytuje zpětnou vazbu až po pokusu týmu.

**Finální implementovaný prompt:**

```text
Jsi průvodce týmové aktivity pro žáky [ROČNÍK]. Cílem je, aby tým sám navrhl a ověřil lepší prompt, ne aby jej AI napsala za něj. Úkol: [ÚKOL]. Výchozí slabý prompt: [PROMPT].

Nejprve požádej tým, aby vlastními slovy pojmenoval, co ve výchozím promptu chybí. Potom vždy polož jen jednu otázku a počkej na návrh týmu. Veď jej postupně ke zvážení role, kontextu a cílové skupiny, požadovaného výstupu, omezení a ověření správnosti. Nepředkládej hotovou další verzi; nabídni nanejvýš krátkou nápovědu.

Po každém týmovém návrhu pomoz porovnat jej s původní verzí na stejném úkolu. Ptej se, co se změnilo, zda je výstup přesnější a co je nutné ověřit nezávislým zdrojem. Na závěr nech tým napsat finální prompt a dvě věty zdůvodnění. Označ nejistá tvrzení; nevymýšlej zdroje. Učitel schvaluje téma, kontroluje výstupy a vede reflexi.
```

**Doporučený operátor AI:** učitel předvádí první společný krok; při přímém týmovém zadávání pouze ve školou schváleném prostředí. Když přímý přístup schválen není, učitel zprostředkuje odpověď AI.

**Činnost učitele:** vybere bezpečné, věkově vhodné téma a stejný testovací úkol pro všechny; ukáže pravidlo ověřování; hlídá, aby AI nenavrhla hotové iterace; závěrem shrne, které konkrétní změny promptu pomohly.

**Činnost žáků:** týmy diagnostikují slabý prompt, navrhují změny po jedné, testují dvě verze na stejném úkolu a obhajují, kterou změnu ponechají.

**Ověřitelný vzdělávací výsledek:** tým odevzdá původní a vlastní konečný prompt, popíše alespoň dvě změny a doloží porovnání výstupů i jeden fakt, který ověřil mimo AI.

**Bezpečnost:** žádná jména, známky, diagnózy ani identifikovatelné školní situace; učitel předem kontroluje téma. Výstup AI může být chybný a není zdrojem. Přímé používání služby závisí na schválení školy.

**Časová organizace:** deklarováno `12–20 min`. Návrh: úvodní pokus, týmové iterace a porovnání v rámci původního rozpětí; učitel může zvolit méně kroků, ale žákovská tvorba zůstává jádrem. Původní čas se tímto návrhem nepřepisuje.

**Otevřené rozhodnutí:** zda AI žáci zadávají přímo ve schváleném prostředí, nebo učitel promítá odpovědi; zda se ponechá soutěžní hlasování, nebo se výsledek posoudí společným kritériem.

## 2. `physics-problem-solver` — Řešení fyzikálních úloh s výkladem

**Původní název a popis:** Řešení fyzikálních úloh s výkladem. „Claude nejen vyřeší fyzikální úlohu, ale vysvětlí každý krok, použité vzorce a jejich odvození – jako soukromý tutor.“

**Původní prompt:**

```text
Vyřeš fyzikální úlohu [ÚLOHA] pro žáka střední školy. Vypiš známé a neznámé veličiny, zvol vhodné vzorce, vysvětli jejich význam, postupuj krok za krokem a zkontroluj jednotky i výsledek. Na konci přidej krátké vysvětlení, proč je postup správný.
```

**Konkrétní problém:** AI dodá úplné řešení bez pokusu žáka. Žák může přepsat postup, aniž by zvolil veličiny, vzorec nebo ověřil jednotky.

**Navržený název:** Fyzikální tutor s nápovědou po vlastním pokusu.

**Navržený popis:** Žák nejprve sepíše známé veličiny a vlastní plán. AI potom po krocích nabízí nápovědu a kontrolní otázky; celý vzorový postup ukáže až po žákově pokusu a ověří jej učitel.

**Navržený nový prompt:**

```text
Jsi trpělivý fyzikální tutor pro žáka střední školy. Úloha: [ÚLOHA]. Probíraný cíl: [CÍL]. Pomáhej žákovi dojít k vlastnímu řešení; nevypočítej vše v první odpovědi.

Nejprve požádej žáka, aby vypsal známé a hledané veličiny a navrhl první krok. Počkej na odpověď. Poté reaguj jednou krátkou otázkou nebo nápovědou k dalšímu kroku. Neprozrazuj vzorec či číselný výsledek, pokud je žák může odvodit z učiva; nejprve ověř, jak uvažuje.

Po žákově řešení společně zkontrolujte dosazení, jednotky, znaménko a řád výsledku. Vysvětli chybu bez nálepkování a vyžádej si opravený pokus. Teprve potom ukaž stručné vzorové řešení a zadej jednu krátkou přenosovou otázku bez hotového řešení.

Pokud zadání neobsahuje potřebné údaje, upozorni na to a nic nevymýšlej. Učitel ověří fyzikální správnost i přiměřenost úlohy; AI neurčuje známku.
```

**Doporučený operátor AI:** žák jako samostatný uživatel ve školou schváleném prostředí; není-li přímý přístup schválen, učitel vede tutoriál společně s třídou.

**Činnost učitele:** vybere úlohu navázanou na probrané učivo, vyjasní, že AI nejprve napovídá, a ověří vzorce, jednotky i závěrečný výsledek.

**Činnost žáků:** vlastními slovy určí veličiny, navrhnou postup, provedou výpočet, opraví případnou chybu a vyřeší přenosovou otázku.

**Ověřitelný vzdělávací výsledek:** žák odevzdá vlastní postup s označenými veličinami a jednotkami a správně vysvětlí, proč zvolený vztah odpovídá úloze.

**Bezpečnost:** AI může zvolit chybný model nebo vzorec. Učitel kontroluje fyziku; skutečný experiment ani měření se z promptu nevyvozují. Neposílat osobní údaje ani práci identifikující žáka.

**Časová organizace:** původní `5 min` je nejasné. Doporučený rámec krátké úlohy: samostatný pokus → nápověda → kontrola a přenosová otázka. Pokud se úloha do 5 minut nevejde, učitel ji rozdělí; čas `duration` se tímto návrhem nemění.

**Otevřené rozhodnutí:** zda krátký samostatný formát 5 minut odpovídá zamýšlené výuce a jaké třídy/typy úloh mají být podporovány.

## 3. `math-step-by-step-guide` — Krok-za-krokem průvodce

**Původní název a popis:** Krok-za-krokem průvodce. „Gemini vysvětlí libovolný matematický postup srozumitelně s pojmenováním každého kroku, příklady a mnemotechnickými pomůckami.“

**Původní prompt:**

```text
Vysvětli postup řešení [MATEMATICKÝ PROBLÉM] pro žáky [ROČNÍK] krok za krokem. Každý krok pojmenuj, vysvětli proč ho děláme a uveď příklad. Na konci přidej tip jak si postup zapamatovat.
```

**Konkrétní problém:** AI rovnou vykládá postup a příklad, aniž by zjistila, co žák už ví nebo jej nechala vyzkoušet jeden krok. „Libovolný problém“ je neomezený a ovládání AI není určeno.

**Navržený název:** Matematický průvodce: nejdřív zkus, potom nápověda.

**Navržený popis:** Žák si zkusí první krok matematického problému. AI vysvětluje po malých částech, klade kontrolní otázky a nechá žáka samostatně vyřešit podobný příklad.

**Navržený nový prompt:**

```text
Jsi podpůrný matematický tutor pro žáka [ROČNÍK]. Téma/postup: [KONKRÉTNÍ TÉMA]. Cíl: žák vysvětlí, proč zvolil jednotlivé kroky, a samostatně vyřeší podobnou úlohu.

Začni otázkou, co už žák o tématu ví, a vyžádej si jeho pokus na prvním kroku. Počkej na odpověď. Potom vysvětli nejvýše jeden krok stručně a slovy přiměřenými ročníku; ukaž krátký příklad s jinými čísly a zeptej se, co by žák udělal dál. Neprozrazuj celé řešení před žákovým pokusem.

Pokud žák udělá chybu, pojmenuj konkrétní místo, polož otázku nebo nabídni nápovědu a dej mu prostor opravit ji sám. Na konci zadej jednu podobnou úlohu bez řešení a požádej žáka, aby postup vysvětlil. Tip k zapamatování nabídni jen tehdy, když nezkresluje matematický princip.

Nevymýšlej chybějící zadání. Nejistotu přiznej; učitel ověří správnost vysvětlení i vhodnost úrovně. Nehodnoť ani neznámkuj žáka.
```

**Doporučený operátor AI:** žák individuálně ve školou schváleném prostředí; alternativně učitel promítá dialog a dává prostor pro společné odpovědi.

**Činnost učitele:** zúží „libovolné téma“ na aktuální učivo, připraví vhodnou přenosovou úlohu a kontroluje, že nápověda žákovi neprozrazuje řešení.

**Činnost žáků:** sdělí svůj dosavadní postup, řeší krok za krokem, vysvětlují volbu a samostatně provedou nový příklad.

**Ověřitelný vzdělávací výsledek:** žák vyřeší přenosovou úlohu bez nápovědy a vysvětlí alespoň jeden důležitý krok.

**Bezpečnost:** AI může chybně vysvětlit matematiku nebo přizpůsobit jazyk; učitel kontroluje. Přímý přístup žáka závisí na školním schválení. Nevkládat osobní údaje.

**Časová organizace:** původní `5 min` je orientační/nejasný. Zachovat jej jako krátký mikronácvik; delší vysvětlování rozdělit do více částí, nezahlcovat jeden prompt.

**Otevřené rozhodnutí:** zda aktivita primárně cílí na samostatné používání žákem, nebo na učitelem vedenou demonstraci; škola rozhoduje o přímém přístupu.

## 4. `general-fact-or-fiction` — AI Fakt nebo Finta

**Původní název a popis:** AI Fakt nebo Finta. „Týmy použijí AI k vytvoření tří tvrzení (dvě pravdy a lež). Ostatní týmy fungují jako ověřovací detektivové a odhalují nepravdivé tvrzení pomocí důkazů.“

**Původní prompt:**

```text
Vytvoř 3 tvrzení o tématu [TÉMA] pro žáky 6.–8. ročníku: dvě tvrzení pravdivá a jedno uvěřitelně nepravdivé. Každé napiš jednou větou. Přidej klíč odpovědí A/B/C, vysvětlení lži a zdroj, podle kterého lze tvrzení ověřit.
```

**Konkrétní problém:** AI vyrábí záměrnou nepravdu i klíč a „zdroj“ může být smyšlený nebo tvrzení nepodporovat. Převzetí AI klíče by znehodnotilo ověřování.

**Navržený název:** Detektivové faktů: ověř tvrzení z nezávislých zdrojů.

**Navržený popis:** AI navrhne nízkoriziková tvrzení pro hru, ale týmy před určením odpovědi každé tvrzení ověří v učitelem schválených podkladech. Klíč AI je pouze hypotéza; učitel jej zkontroluje a po hře opraví nepravdu.

**Navržený nový prompt:**

```text
Pomoz učiteli připravit bezpečnou hru „Dvě pravdy a tvrzení k ověření“ pro žáky 6.–8. ročníku. Téma: [TÉMA]. Povolené zdroje pro ověření: [UČITELEM SCHVÁLENÉ ZDROJE]. Vyhni se zdraví, bezpečnosti, aktuálním politickým tvrzením, osobám žáků a citlivým tématům.

Navrhni tři krátká, konkrétní tvrzení. Jedno označ pouze v odděleném pracovním návrhu pro učitele jako záměrně nepravdivé a výslovně u něj uveď „VZDĚLÁVACÍ HRA – ZÁMĚRNĚ NEPRAVDIVÉ TVRZENÍ“, aby se označení zachovalo při každém sdílení. U každého tvrzení uveď, jakou otázkou a ve kterém dodaném zdroji lze ověřit pravdivost. Nevymýšlej citace, názvy stránek ani odkazy; pokud zdroj nelze zkontrolovat z poskytnutých podkladů, napiš „zdroj chybí – učitel musí doplnit a ověřit“ a tvrzení nepředkládej jako ověřené.

Než materiál dostanou žáci, učitel musí nezávisle ověřit všechna tři tvrzení, správný klíč i každý uvedený zdroj. Klíč je neveřejný učitelský podklad a nesmí se zobrazit žákům v žádné fázi hry ani v kopírovaném či promítaném výstupu. Žákům zobraz pouze tři tvrzení a pokyny k ověřování. Po jejich pátrání vyzvi týmy, aby doložily odpověď důkazem. Aktivitu vždy zakonči učitelským odhalením správného řešení, opravou nepravdivého tvrzení ověřeným faktem a krátkým vysvětlením; ověř, že žáci opravu pochopili. Záměrná nepravda musí být před sdílením i při závěru jasně označena jako součást vzdělávací hry.
```

**Doporučený operátor AI:** učitel připravuje a ověřuje tvrzení; žáci jako skupiny provádějí ověřování. Přímé používání AI žáky není pro splnění cíle nutné.

**Činnost učitele:** vybere bezpečné téma a ověřitelné zdroje, nezávisle zkontroluje tvrzení, klíč i zdroje, žákům skryje klíč a po hře uzavře správnou informací.

**Činnost žáků:** formulují dotazy, hledají důkaz v určených zdrojích, rozlišují důkaz od tvrzení AI a obhájí svůj závěr.

**Ověřitelný vzdělávací výsledek:** tým ke každému tvrzení uvede verdikt a dohledatelný doklad; po hře každý žák zapíše opravenou verzi nepravdivého tvrzení.

**Bezpečnost:** hra nesmí šířit neopravenou nepravdu; nepoužívat citlivá témata ani osobní údaje. AI zdroje se vždy ručně ověřují; žádné smyšlené odkazy. Učitel drží klíč.

**Časová organizace:** deklarováno `10–18 min`. Navržený průběh v tomto rozpětí: zadání tématu a pravidel, týmové ověřování, sdílení důkazů a závěrečná oprava. Zachovat původní rozsah; konkrétní délku volí učitel podle počtu tvrzení a zdrojů.

**Otevřené rozhodnutí:** pedagog schvaluje témata a zdroje, které jsou věkově vhodné; škola stanoví, zda žáci smí používat vyhledávání nebo AI přímo.

## 5. `history-source-analysis` — Analýza historického pramene

**Původní název a popis:** Analýza historického pramene. „Vložte text historického pramene – AI pomůže žákům pochopit kontext, identifikovat bias autora a interpretovat obsah kriticky.“

**Původní prompt:**

```text
Analyzuj tento historický pramen pro žáky střední školy: [TEXT PRAMENE]. Urči autora, dobu vzniku, účel a cílové publikum, vysvětli historický kontext, odliš fakta od názorů a upozorni na možný bias. Přidej pět otázek, které povedou ke kritické interpretaci.
```

**Konkrétní problém:** AI může autora, dataci či účel odhadnout a vydávat odhad za fakt. Text může být chráněný nebo obsahovat osobní údaje; „bias“ může nahradit práci žáků s důkazy.

**Navržený název:** Skupinová analýza pramene: důkaz, kontext, nejistota.

**Navržený popis:** Žáci ve skupině sami nejprve zkoumají vybraný pramen a jeho jazyk. AI nabídne otázky a oddělené hypotézy; skupina je ověřuje proti prameni a schváleným zdrojům.

**Navržený nový prompt:**

```text
Jsi průvodce skupinovou analýzou historického pramene pro žáky SŠ. Pramen: [KRÁTKÝ PRAMEN, K JEHOŽ POUŽITÍ MÁ UČITEL OPRÁVNĚNÍ]. Ověřené údaje o původu, které poskytl učitel: [AUTOR / DATACE / ARCHIVNÍ NEBO UČEBNICOVÝ ZDROJ, POKUD JSOU ZNÁMY].

Neurčuj autora, dataci ani kontext jako jistotu, pokud nejsou v dodaných podkladech. Odděl (1) co lze přímo citovat či popsat z pramene, (2) hypotézu vyžadující ověření a (3) co nevíš. Citace nevymýšlej.

Nejprve požádej skupinu, aby sama označila dvě tvrzení pramene a jednu otázku. Potom po jedné polož otázku k autorovi/publiku, účelu, okolnostem vzniku a tomu, co v prameni chybí. Po odpovědi nabídni krátkou nápovědu, nikoli hotový rozbor. Pomoz skupině formulovat alternativní výklad a ověřit jej v učitelem dodaných zdrojích.

Na závěr požádej skupinu, aby předložila závěr s konkrétní oporou v prameni a vyznačila nejistotu. Učitel kontroluje historickou správnost, původ pramene i oprávnění k jeho vložení. Neznámkuj žáky.
```

**Doporučený operátor AI:** učitel, který vkládá pouze vhodný a oprávněně použitelný pramen; skupiny pracují nad promítnutými otázkami/výstupem. Přímý přístup žáků je možný jen ve schváleném prostředí.

**Činnost učitele:** ověří původ a práva k textu, dodá známá metadata a vhodný doplňkový zdroj, upozorní na rozdíl mezi citací a interpretací a ověří závěry.

**Činnost žáků:** vyhledají tvrzení a jazykové indicie, navrhnou otázky, porovnají hypotézy s pramenem a formulují doložený, omezený závěr.

**Ověřitelný vzdělávací výsledek:** skupina předloží závěr se dvěma konkrétními textovými důkazy a označí alespoň jednu otázku, kterou samotný pramen neumožňuje rozhodnout.

**Bezpečnost:** pouze veřejný, učitelem vytvořený nebo jinak oprávněně použitelný krátký text; u osobních či žákovských údajů platí školní schválení. Anonymizace sama nestačí. AI nemá autoritu určit původ ani historický kontext.

**Časová organizace:** původní `15 min` navrhnout jako krátkou skupinovou práci s jedním úryvkem. Pokud skupina potřebuje rozsáhlejší zdrojové ověřování, rozdělit do další části; přesnou délku učitel přizpůsobí obtížnosti pramene.

**Otevřené rozhodnutí:** pedagog vybere druhy pramenů a způsob citování; škola určí, zda konkrétní nástroj smí zpracovat text a zda jej mohou přímo ovládat žáci.

## 6. `history-roleplay-historical-person` — Roleplay historické osobnosti

**Původní název a popis:** Roleplay historické osobnosti. „Claude hraje roli historické osobnosti – žáci mu mohou klást otázky jako novinář, soudce nebo spolučasník. Rozvíjí empatii a historické myšlení.“

**Původní prompt:**

```text
Budeš hrát roli [HISTORICKÁ OSOBNOST] v době [HISTORICKÉ OBDOBÍ]. Mluv v první osobě, přesně podle historických faktů. Odpovídej na otázky z pohledu této osoby s ohledem na její dobu, hodnoty a přesvědčení. Pokud nemáš historicky přesnou odpověď, odpověz v souladu s tím, co by tato osoba pravděpodobně řekla. Nezapomínej na kontext doby.
```

**Konkrétní problém:** Prompt vybízí k domýšlení pravděpodobných odpovědí v první osobě, což vytváří dojem autentického svědectví. Žák nevidí, co je doložené a co fikce.

**Navržený název:** Historický rozhovor – výslovně označená simulace.

**Navržený popis:** Učitelem vedená historická simulace, v níž žáci kladou otázky, AI označuje neověřené odpovědi jako modelované a třída po každém kole porovnává tvrzení s historickými prameny.

**Navržený nový prompt:**

```text
Na začátku každé odpovědi v celém rozhovoru zachovej označení „VZDĚLÁVACÍ SIMULACE – AI NENÍ HISTORICKÁ OSOBNOST ANI PRAMEN“. Jsi výslovně fiktivní vzdělávací simulace osoby [OSOBNOST] v období [OBDOBÍ] pro žáky [ROČNÍK]. Podklady ověřené učitelem: [STRUČNÝ SEZNAM ZDROJŮ / FAKTŮ].

U každého tvrzení důsledně rozliš jednu z přesných kategorií: „historicky doložené tvrzení“ s odkazem na dodaný podklad, „historická interpretace“ s uvedením, že jde o výklad, nebo „modelovaná odpověď vytvořená AI“, která není citací ani skutečným výrokem osobnosti. Nikdy nevydávej vytvořenou formulaci za autentickou citaci a nevymýšlej soukromé myšlenky. Pokud dodané podklady pro odpověď nestačí, výslovně řekni „to z dodaných podkladů nevím“ a navrhni, co třída může ověřit.

Po každé odpovědi polož žákům otázku: které tvrzení mohou doložit a z jakého zdroje? Neodpovídej za ně a neprohlašuj modelovanou reakci za skutečný výrok historické osoby. Na konci shrň doložená fakta, interpretace a fikční prvky odděleně. Učitel řídí simulaci a ověřuje závěry.
```

**Doporučený operátor AI:** učitel před třídou; třída pokládá otázky. Přímé zadávání žáků je možné pouze po schválení prostředí a režimu školou.

**Činnost učitele:** vybere bezpečné téma a zdroje, připomene fikční rámec, během simulace zastaví nepodložená tvrzení a vede závěrečné třídění fakt/interpretace/model.

**Činnost žáků:** formulují otázky, označují tvrzení, která potřebují ověřit, hledají oporu v pramenech a rozlišují důkaz od domněnky.

**Ověřitelný vzdělávací výsledek:** žák vybere dvě tvrzení z rozhovoru, každé zařadí jako doložené/interpretaci/model a doloží jedno z nich pramenem.

**Bezpečnost:** simulace není historický pramen; nevymýšlet citace ani „pravděpodobné“ osobní výroky bez označení. U citlivých historických témat učitel kontroluje věkovou vhodnost a vyváženost.

**Časová organizace:** zachovat původní `20 min` jako zamýšlenou celou třídní činnost; doporučený průběh je krátké uvedení, rozhovor a ověřovací závěr. Konkrétní rozdělení učitel přizpůsobí počtu otázek, nejde o nová strukturovaná metadata.

**Otevřené rozhodnutí:** které osobnosti a zdroje jsou vhodné pro konkrétní ročník; zda simulaci povede učitel frontálně nebo ji použije jako učitelem řízené stanoviště.

## 7. `history-period-newspaper` — Dobový novinový článek

**Původní název a popis:** Dobový novinový článek. „AI napíše fiktivní dobový novinový článek o historické události očima tehdejšího novináře. Vhodné jako ukázka přístupu dobové žurnalistiky.“

**Původní prompt:**

```text
Napiš fiktivní dobový novinový článek o události [UDÁLOST] z roku [ROK] očima novináře žijícího v dané době. Zachovej dobový jazyk a znalosti, uveď titulek, místo, datum, popis události a dvě dobové reakce. Nakonec odděl historicky doložená fakta od tvůrčího doplnění.
```

**Konkrétní problém:** „Dvě dobové reakce“ mohou být vymyšlené citace; samotný výstup může působit autenticky, i když je označen jako fiktivní až na konci.

**Navržený název:** Simulovaný dobový článek a redakční kontrola faktů.

**Navržený popis:** Učitel připraví jasně označený simulovaný článek. Žáci jej porovnají s ověřenými prameny, vyznačí doložené informace a tvůrčí prvky a článek upraví tak, aby čtenář fikci nezaměnil za historický zdroj.

**Navržený nový prompt:**

```text
Jsi asistent učitele při tvorbě krátkého historického cvičení pro [ROČNÍK]. Událost: [UDÁLOST, ROK]. Podklady učitele: [OVĚŘENÉ FAKTY A ZDROJE]. Vytvoř krátký modelový text ve stylu dobového novinového článku, ale viditelně jej nadepiš „SIMULOVANÝ TEXT – NENÍ DOBOVÝ PRAMEN“.

Používej pouze doložená fakta z dodaných podkladů. Nevytvářej citace, jména svědků, reakce ani přesná data, která ve zdrojích nejsou. Tvůrčí jazykové prvky označ v oddělené poznámce pro učitele; nepředkládej je jako skutečná svědectví. Pokud podklady nestačí, nejprve se zeptej nebo dané tvrzení vynech.

Po článku připoj krátký seznam tvrzení, která má třída ověřit, a otázky: co je přímo doloženo, co je pouze stylizace a podle čeho by čtenář poznal simulaci? Žákům nedávej hotový rozbor. Učitel zkontroluje fakta, zdroje i viditelné označení před sdílením.
```

**Doporučený operátor AI:** učitel při přípravě materiálu; žáci pracují s označeným výstupem a zdroji, ne s předstíraným rozhovorem s historickou osobou.

**Činnost učitele:** dodá ověřené, použitelné zdroje; kontroluje všechna fakta; zachová označení simulace na každé kopii/slide.

**Činnost žáků:** porovnají článek se zdroji, vyznačí fakt a stylizaci a navrhnou redakční úpravu, která lépe označí nejistotu.

**Ověřitelný vzdělávací výsledek:** žák správně roztřídí alespoň tři tvrzení podle opory v prameni a vysvětlí jeden znak, že text je simulovaný.

**Bezpečnost:** žádné smyšlené citace ani reakce osob; AI nesmí být vydávána za historický zdroj. Použít pouze materiály s oprávněním; neklást do externí služby neveřejná nebo citlivá data.

**Časová organizace:** původních `10 min příprava` se týká přípravy učitele, nikoli doby práce žáků. Učitel může připravit krátký text v této orientační době; žákovskou analýzu zařadí zvlášť podle složitosti zdrojů. Hodnota registru se nemění.

**Otevřené rozhodnutí:** učitel vybírá událost, zdroje a míru jazykové stylizace; pedagog potvrzuje, zda je tato simulace přínosnější než práce s autentickým pramenem.

## 8. `history-map-analysis` — Přehled historické mapy

**Původní název a popis:** Přehled historické mapy. „AI vysvětlí geopolitické změny hranic, migrace a vliv zeměpisu na historický vývoj – vhodné doplnit fyzickou mapou.“

**Původní prompt:**

```text
Vysvětli historickou mapu regionu [REGION] v období [OBDOBÍ] pro žáky [ROČNÍK]. Popiš změny hranic, migrace, mocenské vztahy a vliv geografie na historický vývoj. Navrhni, co mají žáci na mapě vyhledat, a přidej tři otázky k interpretaci.
```

**Konkrétní problém:** AI nevidí ani nedostává konkrétní mapu, přesto má „vysvětlit“ změny a migraci. Hrozí zaměnění obecného generického textu za analýzu mapových důkazů.

**Navržený název:** Čtení historické mapy: žák hledá důkaz.

**Navržený popis:** Učitel vybere mapu a její ověřený zdroj. Žáci z mapy sami popisují změnu; AI nabídne interpretační otázky a oddělí, co je vidět, od historického vysvětlení, které je třeba doložit.

**Navržený nový prompt:**

```text
Jsi průvodce čtením konkrétní historické mapy pro žáky [ROČNÍK]. Mapa/zdroj: [TITULEK, AUTOR/INSTITUCE, DATACE, ODKAZ NEBO UČITELEM POSKYTNUTÝ POPIS]. Téma a období: [TÉMA/OBDOBÍ]. Neanalyzuj mapu, kterou jsi nedostal; pokud chybí legenda, měřítko či podklady, řekni, co nelze určit.

Nejprve požádej žáky, aby sami popsali dva prvky, které skutečně vidí, a formulovali otázku. Potom po jedné nabídni otázky: co ukazuje legenda, co se změnilo mezi mapami, jakou evidenci mapa poskytuje a co z ní naopak nelze vyvodit? Počkej na odpovědi a vyžádej si důkaz z mapy.

Odděl pozorování mapy od historického vysvětlení. Kauzální tvrzení o hranicích, migraci nebo moci spoj s ověřeným zdrojem, nikoli s odhadem. Pokud zdroj nemáš, označ vysvětlení jako hypotézu k ověření. Učitel vede diskusi a ověřuje interpretaci. Závěr formulují žáci.
```

**Doporučený operátor AI:** učitel, který zvolí a poskytne konkrétní mapu či schválený popis. Přímé žákovské použití pouze ve schváleném prostředí; nejprve ověřit, že služba může daný mapový vstup zpracovat.

**Činnost učitele:** připraví mapu včetně legendy, měřítka, autora a datace, určí důvěryhodný doprovodný zdroj a nepřijme neověřený kauzální výklad.

**Činnost žáků:** čtou mapové symboly, popisují viditelný důkaz, pokládají vlastní otázku a obhájí závěr s odkazem na konkrétní prvek.

**Ověřitelný vzdělávací výsledek:** každý žák uvede jedno pozorování z mapy, jeden podložený závěr a jednu věc, kterou mapa sama neprokazuje.

**Bezpečnost:** AI může mapu nevidět nebo špatně číst; nesmí si domýšlet hranice ani migrační směry. Učitel ověřuje mapu, zdroj i tvrzení. Respektovat podmínky použití mapového obrazu.

**Časová organizace:** původní `10 min` je nejasné, zda označuje přípravu či výuku. Návrh krátkého čtení jedné jednoduché mapy; složitější změny hranic či více map vyžadují delší blok. `duration` zůstává nezměněno.

**Otevřené rozhodnutí:** které ročníky a typy map se mají pokrýt; zda škola umožní obrazový vstup do vybrané AI služby, nebo učitel bude zprostředkovávat pouze textové výřezy.

## 9. `history-timeline-generator` — Generátor časových os

**Původní název a popis:** Generátor časových os. „AI vytvoří přehlednou chronologickou osu klíčových událostí pro libovolné historické období s vysvětlením příčin a důsledků.“

**Původní prompt:**

```text
Vytvoř chronologickou osu klíčových událostí pro [HISTORICKÉ OBDOBÍ] vhodnou pro žáky [ROČNÍK]. Pro každou událost uveď: datum, název události, stručný popis (2–3 věty), příčiny a důsledky, přesah do dalšího vývoje. Zvýrazni 3 nejdůležitější zlomové momenty.
```

**Konkrétní problém:** AI vybírá, co je „klíčové“, produkuje data a příčinné vztahy bez zdrojů. Hotová osa může nahradit žákovu chronologickou práci a reprodukovat zjednodušující výklad.

**Navržený název:** Historická časová osa z podkladů: seřaď a dolož.

**Navržený popis:** AI převede učitelem dodaný ověřený seznam událostí do pracovního návrhu. Žáci jej kontrolují, seřadí případné karty a označí, která příčinná tvrzení vyžadují další zdroj.

**Navržený nový prompt:**

```text
Jsi asistent učitele při přípravě práce s historickou chronologií pro [ROČNÍK]. Období: [OBDOBÍ]. Vstupní události a zdroje: [OVĚŘENÝ SEZNAM UDÁLOSTÍ SE ZDROJI]. Nevymýšlej události ani přesná data, která nejsou v podkladech.

Uspořádej dodané události chronologicky a zachovej u každé zdrojové označení. Pokud se data zdrojů rozcházejí nebo je datum přibližné, uveď to místo falešné přesnosti. Odděl údaj o datu od tvrzení o příčině a důsledku; kauzální vztah naznač pouze tehdy, když jej podporují podklady, jinak označ otázku k ověření.

Pro žáky připrav pracovní verzi bez hotového hodnocení: seznam událostí v promíchaném pořadí a otázky, podle kterých je seřadí a zdůvodní význam. Nepiš odpovědi do žákovské části. V odděleném učitelském klíči uveď navržené pořadí a zdroj ke každému spornému údaji. Učitel vše kontroluje; žáci navrhují, které události jsou pro jejich otázku důležité.
```

**Doporučený operátor AI:** učitel při přípravě pracovního listu; žáci dostávají pracovní verzi a sami sestavují osu. Přímé AI zadávání není pro cíl potřebné.

**Činnost učitele:** dodá seznam s ověřenými zdroji, zkontroluje datum i kauzální tvrzení, případně vybere osu odpovídající výkladové perspektivě a cíli.

**Činnost žáků:** řadí události, zdůvodňují vztahy mezi nimi pomocí zdrojů a diskutují, proč některou událost považují za důležitou.

**Ověřitelný vzdělávací výsledek:** žák seřadí události správně vůči podkladům, uvede zdroj u dvou údajů a zdůvodní jeden vztah bez záměny následnosti za příčinu.

**Bezpečnost:** AI sama nedokládá historická fakta; přesnost dat a výklad ověřuje učitel. Neuvádět vymyšlené citace. Zdrojové materiály musí být oprávněně použitelné.

**Časová organizace:** zachovat `5 min příprava` jako orientační přípravu učitele jednoduché osy z hotových zdrojů; žákovská práce s řazením je samostatná výuková část a není současným polem `duration` měřena.

**Otevřené rozhodnutí:** učitel volí počet událostí a kritérium „klíčové“ podle otázky hodiny; ověřit, zda stávající údaj 5 minut odpovídá přípravě se zdroji.

## 10. `english-contextual-translation` — Překlad s kulturním kontextem

**Původní název a popis:** Překlad s kulturním kontextem. „Překlad nejde jen o slova – Claude vysvětlí kulturní kontext, idiomy a nuance, které strojový překlad mine.“

**Původní prompt:**

```text
Translate the text below from [SOURCE LANGUAGE] to [TARGET LANGUAGE]. Preserve the meaning and tone. Then explain important idioms, cultural references, and language nuances in Czech, offer two natural alternatives for difficult phrases, and identify places where a literal translation would sound unnatural. TEXT: [TEXT]
```

**Konkrétní problém:** AI dodá hotový překlad i kulturní interpretaci bez žákovského pokusu. Prompt neříká, kdo AI ovládá, jaká je cílová jazyková úroveň ani zda je text oprávněně použitelný.

**Navržený název:** Skupinová překladatelská dílna: volba, zdůvodnění, revize.

**Navržený popis:** Skupiny nejprve navrhnou vlastní překlad krátkého oprávněně použitelného textu. Učitel následně zprostředkuje AI jako druhou variantu; žáci porovnají idiomy a kulturní odkazy, zdůvodní vlastní volbu a označí nejistotu.

**Navržený nový prompt:**

```text
Jsi podpůrný asistent překladatelské dílny pro žáky SŠ. Jazyk originálu: [SOURCE LANGUAGE]. Cílový jazyk: [TARGET LANGUAGE]. Úroveň žáků: [ÚROVEŇ]. Krátký text, který má učitel oprávnění použít: [TEXT]. Nežádej jména, osobní zprávy ani neveřejné žákovské texty.

Nepředkládej úplný překlad hned. Nejprve požádej skupinu o vlastní překlad jedné věty a zdůvodnění obtížného místa. Potom nabídni jednu možnou variantu překladu této věty a polož otázku, v čem se liší tón nebo význam. U idiomu vysvětli doslovný význam a kontextovou interpretaci odděleně; kulturní tvrzení označ jako hypotézu, pokud nemáš doložený zdroj. Nevytvářej univerzální tvrzení o celé kultuře.

Pokračuj po jedné větě nebo krátkém úryvku. Nabídni nejvýše dvě přirozené varianty a vysvětli, v jakém kontextu by se hodily. Na konci vyzvi skupinu, aby zvolila vlastní konečnou verzi a označila jedno místo, které chce ověřit ve slovníku nebo důvěryhodném zdroji. Učitel kontroluje jazykovou i kulturní přesnost.
```

**Doporučený operátor AI:** učitel zprostředkuje AI varianty; skupiny připraví vlastní překlad. Přímý přístup žáků pouze ve školou schváleném prostředí.

**Činnost učitele:** vybere krátký text, k němuž má právo, a stanoví cíl (význam, tón či idiomy); připomene, že AI variantu nelze považovat za autoritativní překlad.

**Činnost žáků:** přeloží úryvek před zobrazením AI, porovnají alternativy, vysvětlí volbu a ověří nejistý výraz.

**Ověřitelný vzdělávací výsledek:** skupina odevzdá vlastní překlad a stručně vysvětlí dvě překladatelská rozhodnutí s odkazem na kontext nebo zdroj.

**Bezpečnost:** text musí být učitelem vytvořený, veřejně dostupný s odpovídajícím oprávněním nebo jinak právně použitelný; respektovat smluvní podmínky služby. Neposílat osobní korespondenci ani žákovské práce bez schválení školy. Kulturní výklad ověřit.

**Časová organizace:** původní `10 min aktivita` je orientační. Doporučit jediný krátký úryvek, nejprve vlastní překlad, potom srovnání a závěrečnou volbu. Delší text rozdělit; hodnotu duration tento návrh nemění.

**Otevřené rozhodnutí:** jaké typy textu, délka úryvku a jazykové úrovně jsou pro zamýšlené ročníky vhodné; jaká pravidla školy platí pro autorská práva a externí zpracování.

## Rozhodnutí pro pedagogickou kontrolu

1. Potvrdit, zda u `math-step-by-step-guide` je zamýšlen přímý individuální tutor, nebo učitelem řízená demonstrace; přímý provoz vyžaduje schválené školní prostředí.
2. Potvrdit, že `general-prompt-power-up-relay` bude hodnotit vlastní iterace týmů, nikoli kvalitu čtyř variant vygenerovaných AI.
3. Schválit konkrétní zdroje, mapy, prameny a texty pro historii a překlad; prověřit jejich oprávněné použití a podmínky služby.
4. Rozhodnout, jak se budou učitelé seznamovat s oddělením doloženého faktu, interpretace a simulace; u herní lži potvrdit proces okamžité opravy.
5. Posoudit věkovou a kurikulární přiměřenost ročníků, témat a navržených přenosových úloh. Návrhy nejsou ověřením souladu s kurikulem.
6. Potvrdit doporučené délky jednotlivých částí. Všechny původní řetězce `duration` jsou zachovány pouze jako údaje zdrojového registru, nikoli jako validovaná měření.

## Implementace a technický záznam PR #33

PR #32 je sloučen do master jako commit 16f115d294c5a74b49b9dedd7222e433cbf14b36. Větev PR #33 byla rebasována na tento commit. Implementované změny jsou omezeny na deset ID uvedených v tomto dokumentu, jejich generované zobrazení a drobnou opravu směrování detailu pro dvě obecné aktivity. Registr data/prompts.json zůstává beze změny.

### Regresní kontroly

Provedeno na implementační pracovní kopii:

- node scripts/generate-activities.js --check: 44 aktivit, drift 0.
- node scripts/generate-prompts.js --check: 204 promptů, drift 0.
- node scripts/validate-content.js: 76 článků, 0 chyb, 0 varování.
- node scripts/check-site-footer.js: 102 HTML souborů prošlo.
- node --check js/activity-library.js a node --check js/main.js: prošlo.
- git diff --check: prošlo.
- Vlastní invarianty: zachováno všech 44 stabilních ID i pořadí; změněno přesně deset očekávaných ID a pouze jejich title, description, prompt; statusy a délky beze změny; ostatních 34 aktivit včetně první vlny beze změny; registr 204 promptů hashově beze změny; generovaný hlavní katalog uvádí 14 doporučených aktivit.
- Browserová kontrola před odhalením problému zjistila, že dvě obecné aktivity otevíraly zastaralé ruční modály. Oprava v scripts/generate-activities.js přesměrovala v knihovně detail přímých promptových aktivit do společného dialogu; kontrola byla opakována po opravě.

### Browserová kontrola Deploy Preview

Kontrolováno na Deploy Preview #33 pro implementační commit 764d023d82b2217a9e2dd2422e54bd84473fa27a (deploy 6aedf6c20393ddea79453c8e, ready; commit_ref přesně odpovídal HEAD).

- **390 × 844 px:** zobrazeno všech 44 aktivit; všech deset upravených názvů, popisů a promptů bylo kompletní; otevření detailu, shoda detailového a kopírovaného promptu, úspěšné zkopírování, zavření Escape a návrat focusu prošly u všech deseti ID. Kombinovaný filtr (matematika + SŠ + ChatGPT) vrátil očekávanou aktivitu math-statistics-analysis. Dokument ani tělo stránky nepřetékaly vodorovně; titulky a popisy neměly horizontální přetečení.
- **1440 × 900 px:** stejné kontroly všech deseti aktivit prošly; všech 44 karet bylo zobrazeno, bez horizontálního přetečení. Kombinovaný filtr vrátil math-statistics-analysis.
- Konzole: žádné relevantní JavaScriptové chyby.

Po aktualizaci dokumentace vznikne ještě doc-only commit; jeho Deploy Preview se ověří proti novému HEAD.

### Otevřené pedagogické otázky

Šest rozhodnutí pro pedagogickou kontrolu výše zůstává otevřeno. Technické kontroly neposuzují kurikulární vhodnost, délku výuky, školní pravidla pro služby ani souhlas s konkrétním provozním režimem. PR #33 zůstává draftem do pedagogické revize. Neprovádí se produkční deploy ani sloučení.

## Závěrečné pedagogické rozhodnutí – druhá vlna

Toto rozhodnutí uzavírá pedagogickou kontrolu návrhů a zachovává původní výběr i zdůvodnění výše. Nejde o potvrzení souladu s konkrétním RVP/ŠVP ani o schválení konkrétní AI služby školou. Ročník a cíl musí učitel před použitím doplnit nebo přizpůsobit úrovni třídy.

| Aktivita | Závěr | Cílená úprava / omezení |
|---|---|---|
| `general-prompt-power-up-relay` | Splňuje požadavky. | Žáci vytvářejí každou verzi promptu sami; AI se ptá, dává nápovědu a pomáhá porovnávat. Závěr vyžaduje dvě věty zdůvodnění konkrétní účinnější změny. Omezení: učitel volí věkově vhodný úkol a zajišťuje ověření; přímý přístup jen ve školou schváleném prostředí. |
| `physics-problem-solver` | Splňuje požadavky po cíleném zpřesnění. | Přenosová otázka výslovně procvičuje tentýž fyzikální cíl a vztah, bez nového principu. Cíl doplňuje učitel; správnost i vhodnost ověřuje učitel. |
| `math-step-by-step-guide` | Splňuje požadavky po cílené úpravě. | Primárně individuální procvičování, alternativně učitelem vedená demonstrace. Prompt nyní řídí sled vlastní pokus → nápověda → oprava → ověření → nová samostatná úloha. Přímé použití žákem vyžaduje školou schválené prostředí. |
| `general-fact-or-fiction` | Splňuje požadavky. | Učitel předem ověřuje všechna tvrzení, klíč i zdroje; klíč zůstává oddělený od žákovské části; žáci nejprve ověřují sami; závěr opraví nepravdivé tvrzení a vysvětlí je. Omezení: AI výstup není důkaz; chybějící či nevěrohodný zdroj znamená, že tvrzení nelze označit za ověřené. |
| `history-source-analysis` | Splňuje požadavky po cíleném zpřesnění. | Bez pramene nebo nutných podkladů si je AI nejprve vyžádá. Přímý popis, hypotéza a neznámé zůstávají oddělené; AI pramen nenahrazuje. Omezení: učitel ověřuje původ i oprávnění k použití textu. |
| `history-roleplay-historical-person` | Splňuje požadavky. | Doložené údaje, interpretace a výslovně modelované odpovědi jsou oddělené; chybějící podklady se vyžádají a AI nevytváří citace ani nedoložené biografické údaje. Omezení: simulace je učitelem řízená a nesmí být zaměněna za pramen. |
| `history-period-newspaper` | Splňuje požadavky po cíleném zpřesnění. | Při chybějících podkladech se AI nejprve zeptá; používá jen doložená fakta a viditelně označí simulaci. Nevytváří citace ani reakce svědků. Omezení: učitel ověří zdroje a označení na všech kopiích. |
| `history-map-analysis` | Splňuje požadavky po cíleném zpřesnění. | Bez mapy, legendy, měřítka nebo dalších potřebných podkladů AI nejprve požádá o doplnění a analýzu nevytváří. Pozorování z mapy je oddělené od interpretace. Omezení: služba musí konkrétní mapový vstup skutečně umět zpracovat; kauzální výklad vyžaduje další ověřený zdroj. |
| `history-timeline-generator` | Splňuje požadavky po cíleném zpřesnění. | Bez ověřeného seznamu událostí a zdrojů si je AI vyžádá; nedoplňuje smyšlená data. Datum, nejistota a doložená kauzalita jsou odděleny. Omezení: výběr „klíčových“ událostí a pracovní verzi kontroluje učitel. |
| `english-contextual-translation` | Splňuje požadavky. | Žáci nejprve překládají sami, učitel zprostředkuje AI variantu a skupina zdůvodní vlastní řešení. Kulturní tvrzení bez zdroje zůstává hypotézou. Omezení: učitel volí ročník/úroveň a text s odpovídajícím oprávněním. |

### Ročník, cíle a přenos

Aktivity zachovávají stávající pole úrovně; u jednotlivého použití učitel zvolí konkrétní ročník, doplní učební cíl a upraví obtížnost i zadání. Tato kontrola tedy netvrdí automatický soulad s RVP ani ŠVP. U fyziky přenosová otázka zůstává u stejného cíle a vztahu; u matematiky nová samostatná úloha ověřuje stejný postup.

### Časová organizace

Původní hodnoty `duration` zůstaly beze změny. Záznamy „příprava“ (historický článek, časová osa) označují přípravu učitele, ne dobu žákovské aktivity; „aktivita“ označuje výukovou část. U matematického a fyzikálního `5 min` a historické mapy `10 min` není přesný rozsah dostatečně ověřen a nemá se prezentovat jako změřená délka. U individuálního procvičování délka závisí na žákově pokusu a tempu.

Doporučení pro budoucí metadata: oddělit `teacherPreparation`, `classroomActivity` a případně `individualPractice`, uvádět je jako orientační intervaly s předpoklady a ponechat nynější `duration` do samostatně schválené datové změny.

## Výsledky závěrečné kontroly

Změny se týkají pouze promptů/popisu nutných k naplnění výše uvedených rozhodnutí a tohoto závěrečného záznamu. ID, pořadí, statusy, časy, první vlna i ostatních 24 aktivit a registr promptů zůstávají invarianty. Generátory a validační kontroly jsou spuštěny po změně; kontrola Deploy Preview proti novému HEAD se zaznamená po dokončení aktualizovaného buildu. Do té doby PR zůstává draftem a závěr technického QA není nahrazen předchozím browser testem.
