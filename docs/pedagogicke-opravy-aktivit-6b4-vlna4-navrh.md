# Etapa 6B/4 – pedagogické opravy aktivit, čtvrtá vlna (návrh)

**Stav:** pouze návrh k pedagogickému posouzení; bez implementace.

**Základ:** aktuální `master` `beba76a9606ae885c4f5373ca84b202280ea91a5` (6. 11. 2026). PR #32–34 jsou sloučeny; PR #31 zůstává otevřený draft a není měněn.

**Rozsah:** přesně deset ID z této vlny. `math-story-problem-game`, `czech-spelling-word-exercises`, `english-grammar-exercises` a `chemistry-elements-compounds-quiz` zůstávají mimo rozsah.

## Metodický rámec

Návrhy cílí na aktivní učení, ověřování výstupů AI a oddělení rolí učitele a žáka. Přímý přístup žáků k AI není automaticky povolen; pokud jej škola neschválila, aktivitu vede učitel nebo se použije modelový podklad či pracovní list bez AI. Neodesílají se identifikovatelné žákovské práce bez schváleného prostředí. Učitel kontroluje jazyková, fyzikální, historická i chemická tvrzení. AI neznámkuje. Zdroje si prompty nevymýšlejí: používají jen dodané ověřené podklady nebo přiznají nejistotu.

Každý záznam níže zachycuje původní obsah, problém, navržený název a popis, úplný návrh promptu, obsluhu AI, role, ověřitelný výsledek, bezpečnost, původní čas, rozdíl od podobných aktivit a otevřená rozhodnutí. Vše je návrh, nikoli schválená implementace.

## 1. `czech-dictation-generator`

**Původní název:** Generátor diktátů. **Původní popis:** AI vygeneruje diktáty zaměřené na konkrétní gramatické jevy s různou úrovní obtížnosti a klíčem.

**Původní prompt:** «Vytvoř diktát pro žáky [ROČNÍK] ZŠ zaměřený na [GRAMATICKÝ JEV, např. vyjmenovaná slova / psaní i/y / shoda přísudku s podmětem]. Délka: cca [POČET] slov. Přidej: opravný klíč a seznam procvičovaných jevů s vysvětlením pravidla.»

**Problém:** Neodděluje text pro žáka a klíč pro učitele a nevyžaduje kontrolu, že text skutečně procvičuje cílový jev. Snadno se zamění s druhým generátorem diktátu.

**Navržený název:** Učitelská příprava pravopisného diktátu. **Popis karty:** Učitel zadá jev a věkovou úroveň; AI navrhne text, oddělený klíč, procvičované jevy a poznámku k opravě. Učitel před použitím ověří správnost i přiměřenost.

**Nový prompt:**

```text
Jsi asistent učitele při přípravě krátkého českého pravopisného diktátu. Ročník/věk: [ROČNÍK/VĚK]. Cílový jev: [JEV]. Přibližná délka: [POČET SLOV]. Omezení učiva: [OMEZENÍ]. Pokud chybí ročník nebo jev, nejprve se zeptej.

Připrav jeden souvislý věku přiměřený návrh procvičující zadaný jev. Nevkládej záměrné chyby do diktovaného textu a nevydávej vedlejší jevy za hlavní cíl.

Výstup rozděl na: A) TEXT K DIKTOVÁNÍ – bez řešení; B) UČITELSKÝ KLÍČ – úplný text a cílová slova s pravopisným zdůvodněním; C) PROCVIČOVANÉ JEVY – jen ty skutečně obsažené v textu, případnou absenci cíle přiznej; D) METODICKÁ POZNÁMKA k opravě, která žáky vede ke zdůvodnění, ne k pouhému opsání.

Nevymýšlej pravidla ani zdroje. Nejistá místa označ k ověření. Učitel zkontroluje pravopis, délku i náročnost před použitím. Nepoužívej skutečnou žákovskou práci ani osobní údaje.
```

**AI ovládá:** učitel při přípravě; žáci pracují s ověřeným diktátem. **Učitel:** určí jev, ročník, délku a ověří klíč. **Žák:** zapíše text, provede první kontrolu a zdůvodní vybranou opravu. **Výsledek:** text a klíč jsou ve shodě a žák vysvětlí cílové pravidlo. **Bezpečnost:** pouze připravený text, bez osobních či identifikovatelných údajů; učitel kontroluje správnost. **Čas:** ponechat `5 min příprava`; není to délka diktování ani žákovské práce. **Rozdíl:** učitelská příprava materiálu vs. žákovská dílna následující aktivity. **Otevřené rozhodnutí:** kolik cílových jevů je vhodných pro ročník a zda se klíč po práci zpřístupní žákům.

## 2. `czech-dictation-activity`

**Původní název:** Generátor diktátů. **Původní popis:** AI vygeneruje diktáty zaměřené na konkrétní gramatické jevy s klíčem. Každý diktát je nový a originální.

**Původní prompt:** «Vytvoř diktát pro žáky 6.–9. ročníku na [GRAMATICKÝ JEV], dlouhý přibližně [POČET] slov. Přidej opravný klíč, seznam procvičovaných jevů a krátké vysvětlení pravidel.»

**Problém:** Popisuje druhou tvorbu diktátu, nikoli aktivní práci starších žáků s chybou a její příčinou. **Navržený název:** Žákovská dílna pravopisných chyb (6.–9. ročník). **Popis:** Žáci hledají, zdůvodňují a opravují chyby v ověřeném modelovém cvičení a reflektují použitou strategii; učitel ověřuje klíč.

**Nový prompt:**

```text
Jsi průvodce pravopisným cvičením pro žáky 6.–9. ročníku. Jev: [JEV]. Vstup je modelový nebo učitelem schválený text: [TEXT]. Ověřený klíč: [KLÍČ, POKUD JE]. Pokud text nebo cíl chybí, nejprve si je vyžádej.

Neprozrazuj opravy hned. Předlož jedno místo a požádej žáka, aby označil podezřelé slovo, navrhl opravu a vysvětlil pravidlo. Počkej. Pokud žák tápe, nabídni jednu nápovědu, ne řešení. Poté ukaž opravu pouze podle ověřeného klíče. Pokud klíč chybí nebo si nejsi jistý, předej místo učiteli; nevymýšlej chybu ani pravidlo.

Zeptej se, co mohlo vést k omylu, například záměna tvarů nebo neznalost pravidla. Reflexe je popisem strategie, ne diagnózou schopností žáka. Nakonec nabídni jeden nový modelový příklad a nech žáka rozhodnout samostatně.

Nevyžaduj skutečnou žákovskou práci, jméno ani jiné osobní údaje. Bez schváleného přímého přístupu vede otázky učitel nebo použije vytištěný list. Učitel ověřuje pravopis i klíč.
```

**AI ovládá:** žák jen ve schváleném prostředí, jinak učitel. **Učitel:** volí modelový text, ověřuje klíč a vede nehodnotící reflexi. **Žák:** hledá a opravuje chybu, zdůvodní pravidlo a vyřeší přenosový příklad. **Výsledek:** doložená oprava, vysvětlení pravidla a správně použitý nový příklad. **Bezpečnost:** bezpečnou výchozí volbou je modelový text, ne identifikovatelná práce. **Čas:** ponechat `5 min příprava`; délka žákovské dílny není doložena. **Rozdíl:** práce žáka s chybou vs. tvorba učitelského materiálu v ID 1. **Otevřené rozhodnutí:** pracovat se záměrně chybným modelovým textem, nebo následnou kontrolou vlastního diktátu? Jak zabránit fixaci chybných tvarů?

## 3. `physics-phenomenon-analogies-explainer`

**Původní název:** Vysvětlení fyzikálních jevů analogiemi. **Původní popis:** AI vysvětlí složité fyzikální pojmy pomocí analogií ze každodenního života, které žáci ihned pochopí a zapamatují si.

**Původní prompt:** «Vysvětli fyzikální jev [JEV] žákům [ROČNÍK] pomocí tří analogií z každodenního života. Přidej jednoduchý příklad, upozorni na limity každé analogie a zakonči třemi otázkami ověřujícími porozumění.»

**Problém:** Slibuje okamžité pochopení a nemá dostatečnou kontrolu fyzikální správnosti, limitů, miskoncepcí a věku. **Navržený název:** Učitelská příprava fyzikálních analogií. **Popis:** Učitel získá návrhy s mapováním podobností, hranicemi a riziky miskoncepcí; ověří a vybere vhodnou analogii.

**Nový prompt:**

```text
Jsi asistent učitele při přípravě vysvětlení fyzikálního jevu. Jev: [JEV]. Ročník/věk: [ROČNÍK]. Předchozí učivo: [CO ŽÁCI ZNAJÍ]. Cíl: [CÍL]. Pokud chybí jev či věk, zeptej se.

Navrhni nejvýše tři analogie k posouzení učitelem. U každé uveď: co přesně odpovídá čemu; kde analogie přestává platit; jakou nesprávnou představu může vyvolat; otázku, kterou učitel zjistí, zda žák odlišuje analogii od fyzikální reality.

Analogie nevydávej za důkaz ani úplné vysvětlení. Netvrď, že ji všichni žáci pochopí. Nejistou fyzikální správnost nebo přiměřenost označ k ověření; nevymýšlej zdroje. Učitel ověří fyziku a rozhodne, zda návrh použije.
```

**AI ovládá:** pouze učitel v přípravě. **Učitel:** kontroluje mapování, meze, možné miskoncepce a věk. **Žák:** vysvětlí, co analogie zachycuje a kde selhává. **Výsledek:** žák propojí pojem s analogií a pojmenuje konkrétní limit. **Bezpečnost:** analogie není měření ani důkaz; učitel ověřuje tvrzení. **Čas:** ponechat `5 min`; význam času není přesně vymezen. **Rozdíl:** učitelský výběr a odborná kontrola; další aktivita začíná žákovským nápadem. **Otevřené rozhodnutí:** které ověřené modely jsou dostupné a kdy analogii raději nepoužít?

## 4. physics-phenomenon-analogies-class

Původní název: Vysvětlení fyzikálních jevů analogiemi. Původní popis: AI vysvětlí složité fyzikální pojmy pomocí analogií ze každodenního života, které žáci ihned pochopí.
Původní prompt: Vysvětli fyzikální jev [JEV] žákům [ROČNÍK] pomocí 3 analogií z každodenního života. Přidej jednoduchý příklad, upozorni na limity analogií a zakonči 3 otázkami ověřujícími porozumění.

Problém: Žáci dostávají hotové analogie dříve, než sami přemýšlejí; chybí jejich tvorba, argumentace a kontrola hranic modelu. Navržený název: Třídní dílna: žáci tvoří a zkoumají fyzikální analogie. Popis: žáci navrhnou vlastní analogii, pak ji porovnají s jedním návrhem AI a označí podobnosti, limity i tvrzení k ověření.

Navržený prompt:
> Jsi moderátor učitelem organizované fyzikální dílny, ne hotový vysvětlovač. Jev: [JEV]. Ročník: [ROČNÍK]. Ověřené učitelské podklady: [PODKLADY]. Pokud jsou nutné k bezpečnému tvrzení a chybí, vyžádej si je.
>
> Nejprve vyzvi žáky, aby bez návrhu AI vytvořili vlastní analogii a zapsali, co v ní odpovídá částem jevu, co se podle nich děje a kde si nejsou jistí. Počkej na jejich nápad a polož jednu otázku k tomu, co analogie vysvětluje a co ne.
>
> Teprve po žákovském návrhu nabídni jednu alternativu ke kritickému porovnání, nikoli jako správnou odpověď. Vytvořte tabulku „podobnost / hranice / fyzikální skutečnost k ověření“. Odděluj metaforu od ověřeného tvrzení; nepřidávej neověřené mechanismy.
>
> Na závěr požádej každého žáka, aby bez analogie vysvětlil hlavní fyzikální vztah a uvedl, kde analogie přestává platit. Pokud odpověď nelze ověřit z podkladů, předej ji učiteli. Neznámkuj ani neřaď žáky.

AI ovládá: učitel řídí diskusi; žák přímo jen po schválení školy. Učitel: volí ověřený jev, dává prostor žákovskému návrhu před AI a ověřuje tvrzení. Žák: vytvoří analogii, obhájí mapování, označí hranice a vysvětlí jev bez analogie. Výsledek: žákovská analogie s limity a závěrečné věcné vysvětlení. Bezpečnost: přitažlivá analogie není důkaz; učitel ověří obsah. Čas: ponechat původních 5 min; délku diskuse nedoplňovat jako fakt. Rozdíl: žákovská tvorba a kritika vs. učitelský výběr u physics-phenomenon-analogies-explainer. Otevřené rozhodnutí: pracují jednotlivci nebo skupiny; jaký výstup prokáže individuální porozumění?

## 5. math-real-life-word-problems

Původní název: Slovní úlohy z reálného života. Původní popis: ChatGPT vygeneruje originální slovní úlohy zasazené do reálných situací blízkých žákům – procenta, zlomky, rovnice a geometrie.
Původní prompt: Vytvoř 5 slovních úloh z matematiky pro žáky 6.–9. ročníku na téma [TÉMA]. Každou úlohu zasaz do reálné situace a přidej podrobný postup řešení s výsledkem.

Problém: AI vytvoří i vyřeší zadání, takže žák nemusí vybrat údaje, sestavit model ani zhodnotit výsledek; hrozí překryv s math-word-problem-generator. Navržený název: Žáci matematicky modelují reálnou situaci. Popis: žáci 6.–9. ročníku zvolí údaje a předpoklady, sestaví a vyřeší model a posoudí výsledek. AI klade otázky, ale modelování nepřebírá.

Navržený prompt:
> Jsi průvodce matematickým modelováním pro žáka 6.–9. ročníku. Bezpečný scénář: [SCÉNÁŘ]. Cíl: [MATEMATICKÝ CÍL]. Předchozí učivo: [UČIVO]. Pokud scénář či cíl chybí, vyžádej si je.
>
> Neřeš situaci za žáka a nevymýšlej chybějící data jako fakta. Začni otázkou, co je známo a co je třeba zjistit. Nech žáka rozhodnout, které údaje jsou důležité, jaké předpoklady použije a jaké informace chybějí. Odhad musí být označen jako předpoklad.
>
> Postupuj vždy po jedné otázce: jak lze situaci zjednodušit; jaký matematický vztah, náčrt, tabulka či rovnice ji popisuje; jak žák provede výpočet a ověří jednotky; jak výsledek odhadne nebo nezávisle zkontroluje; zda výsledek dává smysl a jak by změna předpokladu působila.
>
> Nabízej nápovědu, ne hotový model či výpočet před žákovým pokusem. Pokud údaj nestačí, řekni, co zjistit, místo vymyšlení. Na závěr žák shrne předpoklady, model, výpočet a omezení výsledku. Používej neosobní modelové situace; nevyžaduj osobní údaje. Učitel ověřuje matematiku i kontext.

AI ovládá: žák/dvojice jen ve schváleném režimu, jinak učitel zprostředkuje otázky. Učitel: vybere scénář a cíl, ověřuje matematiku a rozlišuje údaje od předpokladů. Žák: sám zvolí potřebné údaje, předpoklady, model, výpočet a kontrolu reálnosti. Výsledek: model s údaji, předpoklady, postupem, jednotkami a interpretací. Bezpečnost: obecné scénáře bez osobních či finančních údajů. Čas: ponechat 5 min příprava; nejde o dobu žákovského modelování. Rozdíl: zde modeluje žák; math-word-problem-generator připravuje učiteli sadu a klíč. Otevřené rozhodnutí: které scénáře umožní bezpečné získání dat a co bude hodnotícím kritériem?

## 6. math-ai-tutor

Původní název: AI Matematický Tutor. Původní popis: Claude jako trpělivý soukromý tutor – vysvětluje krok za krokem, klade otázky, povzbuzuje a dává nápovědy místo přímých odpovědí.
Původní prompt: Jsi trpělivý matematický tutor pro žáka 6.–9. ročníku. Procvičuj se mnou [TÉMA] krok za krokem, vždy polož jednu otázku, čekej na odpověď, dávej nápovědy a neprozrazuj řešení předčasně.

Problém: Obecné procvičování se překrývá s math-step-by-step-guide, která už má vlastní pokus, nápovědy, ověření i přenosovou úlohu. Rozlišení: kontrola sporného nebo chybného řešení. Navržený název: Matematický tutor: prověř chybný postup. Popis: žáci 6.–9. ročníku, kteří dostali nejasné vysvětlení, porovnají postupy, ověří výpočet a vyřeší přenosovou úlohu.

Navržený prompt:
> Jsi matematický tutor pro žáka 6.–9. ročníku, který chce prověřit nejasný postup. Zadání: [ÚLOHA]. Žákův pokus: [POKUS]. Sporné vysvětlení: [POSTUP NEBO „ŽÁDNÉ“].
>
> Zeptej se, který krok je nejasný a co si žák myslí, že je v něm špatně. Počkej na jeho vysvětlení. Nabízej jednu stručnou otázku nebo nápovědu; celé řešení neprozrazuj před pokusem.
>
> Zkontroluj předložený postup po jednotlivých krocích. Odděl správné kroky od chybných a ukaž, jak ověřit výsledek výpočtem, dosazením, odhadem či opačným postupem. Pokud dvě metody nesouhlasí, ukaž místo rozdílu, přiznej nejistotu a požádej o kontrolu učitelem. Nevymýšlej pravidlo ani zadání.
>
> Požádej žáka o nezávislé ověření a vlastní vysvětlení opraveného kroku. Poté můžeš nabídnout druhou ověřitelnou metodu. Zakonči novou přenosovou úlohou bez řešení a vyčkej na pokus. Neznámkuj. Přímý přístup je možný jen ve školou schváleném prostředí; jinak vede aktivitu učitel.

AI ovládá: individuálně žák po školním schválení, jinak učitel na modelovém postupu. Učitel: vybírá úlohu, ověřuje matematická tvrzení a zasahuje při rozporu. Žák: vysvětlí vlastní postup, prověří sporný krok, ověří výsledek a řeší přenosovou úlohu. Výsledek: doložená oprava, kontrola a nový samostatný pokus. Bezpečnost: AI může chybovat; při rozporu přizná nejistotu a předá ověření učiteli. Čas: ponechat 15 min aktivita; ověřit pilotem, zda rozsah stačí. Rozdíl: audit nejasného/chybného postupu vs. obecné budování řešení v math-step-by-step-guide; stejný ročník znamená zbytkové riziko překryvu. Otevřené rozhodnutí: jak představit chybný krok, aniž se chybný princip zafixuje; kdy tutor předá slovo učiteli?

## 7. history-class-timeline

Původní název: Třídní časová osa. Původní popis: AI vytvoří přehlednou chronologickou osu klíčových událostí pro libovolné historické období s příčinami a důsledky.
Původní prompt: Vytvoř přehlednou chronologickou osu tématu [TÉMA] pro žáky [ROČNÍK]. U každé události uveď datum nebo období, stručný popis, příčinu, důsledek a zdroj k ověření.

Problém: Hotová osa může obsahovat vymyšlená data, citace, zdroje a kauzální vztahy, zatímco žáci nemusí rozhodovat o pořadí ani významu. Navržený název: Třídní laboratoř historické časové osy. Popis: učitel dodá ověřené události a prameny; žáci společně rozhodují o pořadí a významu, AI moderuje otázkami.

Navržený prompt:
> Jsi moderátor učitelem organizované práce s časovou osou. Téma a ročník: [TÉMA/ROČNÍK]. Ověřené události a zdrojové podklady učitele: [SEZNAM]. Pokud chybí, vyžádej si je a osu nevytvářej.
>
> Nevymýšlej události, data, citace ani zdroje. Zachovej označení podkladu; rozpory a přibližná data uveď jako nejisté. Nejprve nepředkládej hotovou osu: ukaž dodané karty v promíchaném pořadí a nech třídu zdůvodnit pořadí i význam.
>
> Rozlišuj časovou následnost, doloženou příčinu a domněnku. Kauzalitu uveď pouze s oporou v podkladu, jinak označ otázku k ověření. Připrav odděleně žákovské otázky bez odpovědí a učitelskou kontrolní osnovu se zdrojovým odkazem. Učitel kontroluje historickou správnost.

AI ovládá: učitel organizuje; žák přímo jen po schválení. Učitel: dodá ověřené podklady a moderuje. Žák: řadí karty, obhajuje význam a odlišuje následnost od příčiny. Výsledek: osa se zdrojovými štítky, zdůvodněním pořadí a vyznačenou nejistotou. Bezpečnost: jen dodané podklady, žádná smyšlená data, citace či zdroje. Čas: ponechat 5 min příprava; třídní čas není doložen. Rozdíl: společné rozhodování žáků vs. příprava materiálu v history-timeline-generator. Otevřené rozhodnutí: kolik událostí je zvládnutelných a jak zobrazit rozporné datování?

## 8. czech-writing-form-guide

**Původní název:** Asistent pro tvorbu slohových útvarů. **Původní popis:** Žáci dostávají krok-za-krokem průvodce pro psaní různých slohových útvarů – líčení, popis, vypravování, charakteristika.

**Původní prompt:** Proveď žáka krok za krokem tvorbou slohového útvaru [ÚTVAR] na téma [TÉMA]. Nejprve vysvětli strukturu, potom navrhni osnovu a užitečná jazyková spojení, polož otázky k vlastnímu nápadu a nakonec pomoz upravit text. Nevytvářej celý text za žáka.

**Problém:** AI navrhuje osnovu ještě před zjištěním žákova záměru; hranice autorství a práce s modelem nejsou jasné. **Název:** Žák píše vlastní sloh s průvodcem. **Popis:** Žák nejprve formuluje záměr a nápady, z nich vytvoří osnovu, napíše text a s otázkami AI jej reviduje. AI nepíše odstavce.

**Nový prompt:**
> Jsi průvodce, který pomáhá žákovi zůstat autorem vlastního textu. Útvar: [ÚTVAR]. Zadání a cílový čtenář: [ZADÁNÍ]. Ročník: [ROČNÍK]. Pokud něco chybí, zeptej se.
>
> Stručně vysvětli znaky útvaru a polož jednu otázku, co chce žák sdělit. Vyžádej si jeho nápady; nevymýšlej osobní zkušenost za něj. Pomoz sestavit osnovu pouze z jeho myšlenek a u každého bodu se zeptej, co chce rozvinout. Jazyková spojení nabídni jako možnosti, ne věty k opsání.
>
> Při revizi ukaž konkrétní nejasnost, opakování nebo chybějící znak a vyzvi žáka, aby navrhl úpravu. Text za něj nepřepisuj a neměň význam. Příklad smí být jen krátký modelový text jasně označený jako model, ne práce k odevzdání.
>
> Nežádej osobní údaje. Skutečný žákovský text lze vložit jen do nástroje a režimu schváleného školou; jinak použij osnovu, modelovou větu nebo papírový list. Učitel stanoví kritéria a hodnotí práci; AI neurčuje známku.

AI ovládá: žák pouze ve schváleném nástroji, jinak učitel nebo papírový postup. Učitel: vymezí útvar a kritéria, chrání autorství a rozhodne o podkladech. Žák: tvoří nápady, osnovu i text a navrhuje revizi. Výsledek: vlastní text a osnova, žák doloží znaky útvaru a samostatnou úpravu. Bezpečnost: modelový text či schválené prostředí, bez osobních údajů. Čas: zachovat 15 min aktivita; vyjasnit, zda pokrývá celý proces či jen část. Rozdíl: plánování a vznik textu vs. revize hotové práce v czech-essay-workshop. Otevřené rozhodnutí: jak doložit autorství a které útvary vyžadují jiné otázky?

## 9. english-vocabulary-builder

**Původní název:** Slovní zásoba – tematické sety. **Původní popis:** AI vygeneruje tematické sety slovíček s příklady ve větách, obrázkovými popisy a paměťovými tipy pro mladší žáky.

**Původní prompt:** Create a thematic vocabulary set for Czech pupils at [AGE] level on [TOPIC]. Include 15 words with Czech translations, simple example sentences, a short image description for each word, one memory tip, and 8 exercises with an answer key. Use language suitable for beginners.

**Problém:** Pevných 15 slov a 8 cvičení ignoruje CEFR, ročník, komunikační cíl a známou slovní zásobu; klíč i přirozenost překladů nejsou kontrolovány. **Název:** Tematická slovní zásoba: vybav si a použij. **Popis:** Učitel určí CEFR, ročník, cíl a známá slova. AI připraví přiměřenou sadu a cyklus seznámení → aktivní vybavení → použití ve větě → opakování; klíč oddělí.

**Nový prompt:**
> Jsi asistent učitele angličtiny. CEFR: [A1–B2]. Ročník/věk: [ROČNÍK]. Komunikační cíl: [CO MÁ ŽÁK UMĚT]. Téma: [TÉMA]. Již známá slova: [SEZNAM]. Počet nových slov: [POČET NEBO „NAVRHNI MALOU SADU A VYŽÁDEJ POTVRZENÍ“]. Pokud chybí CEFR či cíl, zeptej se. Nevkládej automaticky patnáct slov.
>
> Vyber výrazy potřebné pro cíl a vynech již známá slova, pokud se výslovně neopakují. U každého uveď slovní druh, přirozený český význam, krátký anglický příklad a český překlad věty. Označ víceznačnost, kolokaci či registr; nepředstírej jediný překlad.
>
> Odděl A) učitelský klíč s významy, příklady a místy ke kontrole; B) žákovskou verzi bez řešení; C) cyklus (1) seznámení, (2) aktivní vybavení bez nahlížení, (3) vlastní věta k cíli, (4) opakování; D) kontrolní seznam překladů a přirozenosti.
>
> Přizpůsob rozsah CEFR a věku; nevytvářej dlouhou sadu jen kvůli počtu. Nevymýšlej citace či zdroje. Učitel ověřuje překlady a příklady. Nežádej osobní údaje; přímý přístup žáka musí schválit škola.

AI ovládá: učitel připravuje a ověřuje sadu; žák procvičuje z odděleného listu nebo ve schváleném prostředí. Učitel: stanoví CEFR, věk, cíl, známá slova a počet; ověří jazyk. Žák: vybavuje si význam, píše větu a opakuje. Výsledek: správné vybavení a použití slov v nové větě. Bezpečnost: učitel kontroluje jazyk a úroveň, bez osobních údajů. Čas: ponechat 10 min příprava; nejde o délku celého opakovacího cyklu. Rozdíl: cílené osvojení podle CEFR, ne pevný velký seznam. Otevřené rozhodnutí: počet slov a interval opakování podle úrovně; kdo ověřuje přirozenost příkladů?

## 10. chemistry-equation-guide

**Původní název:** Průvodce chemickými rovnicemi. **Původní popis:** AI krok za krokem vysvětlí postup vyčíslování chemických rovnic, jejich typy a aplikace v reálném světě.

**Původní prompt:** Vysvětli vyčíslování chemické rovnice [ROVNICE] žákům střední školy krok za krokem. Urči typ reakce, ukaž postup zachování počtu atomů, vysvětli každý krok jednoduchým jazykem a přidej jednu podobnou rovnici k samostatnému procvičení s řešením.

**Problém:** AI prozradí celý postup, nemusí ověřit chemický smysl reakce a může měnit index místo stechiometrického koeficientu. **Název:** Chemické rovnice: nejprve počty atomů, pak nápověda. **Popis:** Žák nejprve sám spočítá atomy a navrhne koeficienty; AI dává cílené nápovědy a nemění indexy, učitel ověřuje rovnici.

**Nový prompt:**
> Jsi průvodce vyčíslováním rovnic pro žáka střední školy. Konkrétní rovnice od žáka či učitele: [ROVNICE]. Pokud chybí, vyžádej si ji; nevymýšlej reakci ani produkty.
>
> Nejprve požádej žáka, aby sám spočítal počet atomů každého prvku na obou stranách a navrhl krok. Počkej. Pak dávej jednu nápovědu podle chyby; celé řešení před pokusem neprozrazuj.
>
> Rozlišuj koeficient před vzorcem od indexu ve vzorci; indexy nikdy neměň. Po návrhu koeficientů vypiš počty atomů na obou stranách. Rovnici označ za vyčíslenou jen tehdy, shodují-li se všechny počty atomů. Samotná bilance nedokazuje, že reakce nebo produkty jsou chemicky možné.
>
> Pokud nelze ověřit chemický smysl, řekni, co je nejisté, a požádej o kontrolu učitelem. Nevymýšlej zdroje, produkty, neexistující reakce ani laboratorní pokusy. Nakonec požádej žáka, aby vysvětlil rozdíl koeficientu a indexu; nabídni novou učitelem ověřenou rovnici bez řešení, dokud se žák nepokusí. Učitel ověřuje chemii.

AI ovládá: žák jen ve schváleném prostředí, jinak učitel moderuje. Učitel: dodá či ověří rovnici a její chemický smysl. Žák: spočítá atomy, navrhne koeficienty, vysvětlí indexy a řeší přenosový příklad. Výsledek: kontrolovatelná bilance a vysvětlení, proč se mění koeficient, nikoli vzorec. Bezpečnost: žádné pokusy či nebezpečné postupy; vyčíslení není schválení experimentu. Čas: ponechat 10 min; rozsah není určen. Rozdíl: procesní bilance vs. pojmový kvíz chemistry-elements-compounds-quiz, který je ponechán další vlně. Otevřené rozhodnutí: kdo schvaluje přenosové rovnice a co dělat u vyčíslitelné, ale chemicky sporné reakce?

## Obsahové duplicity a rizika

| Dvojice / aktivita | Riziko | Navržená hranice či kontrola |
|---|---|---|
| Dva diktáty | Obě karty vypadají jako generátor | Učitelská příprava a klíč vs. žákovské hledání, zdůvodnění a oprava chyby. |
| Fyzikální analogie – vysvětlení / třída | Stejný jev i forma analogie | Učitel vybírá a validuje vs. žák tvoří a kriticky porovnává. |
| Reálné slovní úlohy / generátor | Obě jsou slovní úlohy | Žák modeluje situaci vs. učitel připravuje sadu a klíč. |
| Matematický tutor / step-by-step-guide | Stejný věk a nápovědy | Sporný či chybný postup vs. obecné procvičení; zbytkový překryv vyžaduje pilot. |
| Třídní časová osa / generátor osy | Obě pracují s chronologií | Třídní rozhodování nad zdroji vs. příprava materiálu pro učitele. |
| Writing form guide / essay workshop | Obě mohou pracovat s textem | Plánování a vznik textu vs. revize již napsaného; vždy zachovat autorství. |
| Vocabulary builder / grammar exercises (další vlna) | Obě mohou mít jazyková cvičení | Vybavování a použití slov podle CEFR vs. samostatný gramatický cíl. |
| Equation guide / elements-compounds quiz (další vlna) | Obě se týkají chemických vzorců | Vyčíslování a bilance atomů vs. rozpoznání prvků a sloučenin. |

| Aktivita | Riziko | Kontrola |
|---|---|---|
| Diktát pro učitele | Chybný klíč nebo nevhodná úroveň | Učitel ověří pravopis, cílová slova a obtížnost. |
| Žákovská práce s chybou | Fixace chybného tvaru, stigmatizace | Modelový text, oprava po pokusu, neutrální reflexe. |
| Fyzikální analogie | Miskoncepce nebo záměna za důkaz | Ověřit mapování, hranice, věk; vysvětlit jev bez analogie. |
| Matematické modelování | Vymyšlená data či model za žáka | Označit předpoklady; čekat na vlastní postup žáka. |
| Matematický tutor | AI potvrdí chybu | Nezávislá kontrola, přiznat nejistotu, zapojit učitele. |
| Historická osa | Vymyšlené datum, zdroj nebo kauzalita | Pouze podklady učitele; rozlišit následnost a příčinu. |
| Slohový průvodce | AI převezme autorství | Osnova z nápadů žáka; modelový text či schválené prostředí. |
| Slovní zásoba | Nepřesný překlad nebo nepřiměřená CEFR | Učitel ověří příklady, překlad, úroveň a klíč. |
| Chemická rovnice | Změna indexů či falešná chemická platnost | Měnit jen koeficienty; kontrola atomů i chemického smyslu; bez pokusů. |

## Otázky k pedagogickému schválení

1. Jak jasně odlišit oba diktátové scénáře a který model chyby je bezpečný pro věk žáků?
2. Kdo ověří pravopis, fyzikální analogie, historické podklady, jazykové příklady a chemickou správnost před použitím?
3. Které aktivity mohou žáci ovládat přímo a které zůstanou učitelem řízené? Jaké nástroje a účty škola schvaluje?
4. Jak vyhodnocovat modelování a reflexi bez přenesení známkování na AI?
5. Které fyzikální jevy mají ověřené podklady a kdy analogii nepoužít?
6. Jaké zdrojové sady použít pro časovou osu a jak označovat rozporné či přibližné datace?
7. Jak zachovat autorství slohu a kdy lze zpracovat skutečný žákovský text?
8. Jaká velikost slovní zásoby a frekvence opakování odpovídají CEFR i ročníku?
9. Kdo schvaluje chemické příklady a řeší nejistotu o chemické platnosti?
10. Co přesně znamená původní duration tam, kde jde pouze o přípravu učitele?

## Rozsah a stav registru

- Zahrnuto přesně deset požadovaných ID; čtyři ID další fáze zůstávají neupravená.
- Větev obsahuje pouze návrhovou dokumentaci. Registr, generované HTML, JS, CSS, 204 promptů, ID, pořadí, statusy a duration zůstávají beze změny.
- Základ je aktuální master beba76a9606ae885c4f5373ca84b202280ea91a5. PR #31 je mimo rozsah.






## Implementační doplněk po pedagogickém schválení

### Schválená zpřesnění

- **Diktátová dílna:** žák pracuje s předem ověřeným modelovým textem a klíčem. Bez klíče AI smí klást otázky k pravidlu, ale vlastní opravu nesmí vydávat za ověřenou. Po pokusu dostane žák správný tvar podle ověřeného klíče, aby se chyba nefixovala.
- **Matematický tutor:** podporuje buď učitelem připravený modelový chybný postup, nebo vlastní pokus žáka výhradně ve školou schváleném prostředí pro daný účel a zpracování dat. Žákův text není povinný. Správnost se ověřuje výpočtem, dosazením či jinou kontrolou a nesmí být potvrzena pouze autoritou AI.
- **Fyzikální analogie ve třídě:** žáci vytvoří vlastní analogii před zobrazením návrhu AI; určí, co jev vystihuje, kde analogie končí a jak jev fyzikálně funguje. Původní duration 5 min zůstává, ale plná dílna může trvat déle; pět minut se neuvádí jako ověřená délka celého scénáře.
- **Chemické rovnice:** AI nepřidává novou reakci. Přenosovou rovnici dodá nebo předem schválí učitel. AI nikdy nemění indexy, kontroluje počty atomů, přizná nejistotu chemické platnosti a nedává nebezpečné experimentální návody.

### Implementované záznamy

Tato část je přesnou textovou kopií názvů, popisů a promptů z registru po implementaci. Role, rozdíly aktivit, časová omezení a provozní otázky jsou zachovány v příslušných návrhových oddílech výše.

### czech-dictation-generator

**Finální název:** Učitelská příprava pravopisného diktátu

**Finální popis:** Učitel zadá konkrétní pravopisný jev a věkovou úroveň; AI připraví krátký diktát, oddělený klíč, procvičované jevy a poznámku k opravě. Učitel před použitím ověří správnost i přiměřenost textu.

**Kompletní implementovaný prompt:**

~~~~text
Jsi asistent učitele při přípravě krátkého českého pravopisného diktátu. Ročník/věk: [ROČNÍK/VĚK]. Cílový jev: [JEV]. Přibližná délka: [POČET SLOV]. Omezení učiva: [OMEZENÍ]. Pokud chybí ročník nebo jev, nejprve se zeptej.

Připrav jeden souvislý věku přiměřený návrh procvičující zadaný jev. Nevkládej záměrné chyby do diktovaného textu a nevydávej vedlejší jevy za hlavní cíl.

Výstup rozděl na: A) TEXT K DIKTOVÁNÍ – bez řešení; B) UČITELSKÝ KLÍČ – úplný text a cílová slova s pravopisným zdůvodněním; C) PROCVIČOVANÉ JEVY – jen ty skutečně obsažené v textu, případnou absenci cíle přiznej; D) METODICKÁ POZNÁMKA k opravě, která žáky vede ke zdůvodnění, ne k pouhému opsání.

Nevymýšlej pravidla ani zdroje. Nejistá místa označ k ověření. Učitel zkontroluje pravopis, délku i náročnost před použitím. Nepoužívej skutečnou žákovskou práci ani osobní údaje.
~~~~

### czech-dictation-activity

**Finální název:** Žákovská dílna pravopisných chyb (6.–9. ročník)

**Finální popis:** Žáci 6.–9. ročníku hledají, zdůvodňují a opravují chyby v předem ověřeném modelovém cvičení a reflektují použitou strategii. Učitel ověřuje klíč; skutečné žákovské práce se do neschválených nástrojů nevkládají.

**Kompletní implementovaný prompt:**

~~~~text
Jsi průvodce pravopisným cvičením pro žáky 6.–9. ročníku. Jev: [JEV]. Vstup musí být předem ověřený modelový text: [TEXT]. Ověřený učitelský klíč: [KLÍČ, POKUD JE K DISPOZICI]. Pokud text nebo cíl chybí, nejprve si je vyžádej.

Neprozrazuj opravy hned. Předlož jedno místo a požádej žáka, aby sám označil podezřelé slovo, navrhl opravu a vysvětlil pravidlo. Počkej na odpověď. Pokud žák tápe, nabídni jednu otázku k pravidlu, nikoli řešení.

Pokud je ověřený klíč k dispozici, po žákově pokusu poskytni zpětnou vazbu a správný tvar podle klíče, aby chybná podoba nezůstala jako neopravená odpověď. Vysvětli, proč je tvar správný. Pokud klíč k dispozici není, můžeš klást další otázky k pravidlu a pomoci žákovi ověřit vlastní úvahu, ale nesmíš svou navrženou opravu označit za ověřené řešení; požádej učitele o potvrzení správného tvaru. Nevymýšlej chybu, pravidlo ani klíč.

Na závěr se zeptej, co mohlo vést k omylu, například záměna tvarů nebo neznalost pravidla. Reflexe popisuje strategii, nikoli schopnosti či diagnózu žáka. Nabídni jeden nový modelový příklad k samostatnému rozhodnutí.

Nepoužívej skutečnou identifikovatelnou žákovskou práci bez školou schváleného prostředí a účelu. Bez schváleného přímého přístupu vede otázky učitel nebo použije vytištěný list. Učitel ověřuje pravopis i klíč.
~~~~

### physics-phenomenon-analogies-explainer

**Finální název:** Učitelská příprava fyzikálních analogií

**Finální popis:** Učitel získá návrhy analogií k obtížnému fyzikálnímu jevu včetně mapování podobností, hranic a možných zavádějících představ. Každý návrh před výukou ověří a vybere jen ten vhodný pro daný ročník.

**Kompletní implementovaný prompt:**

~~~~text
Jsi asistent učitele při přípravě vysvětlení fyzikálního jevu. Jev: [JEV]. Ročník/věk: [ROČNÍK]. Předchozí učivo: [CO ŽÁCI ZNAJÍ]. Cíl: [CÍL]. Pokud chybí jev či věk, zeptej se.

Navrhni nejvýše tři analogie k posouzení učitelem. U každé uveď: co přesně odpovídá čemu; kde analogie přestává platit; jakou nesprávnou představu může vyvolat; otázku, kterou učitel zjistí, zda žák odlišuje analogii od fyzikální reality.

Analogie nevydávej za důkaz ani úplné vysvětlení. Netvrď, že ji všichni žáci pochopí. Nejistou fyzikální správnost nebo přiměřenost označ k ověření; nevymýšlej zdroje. Učitel ověří fyziku a rozhodne, zda návrh použije.
~~~~

### physics-phenomenon-analogies-class

**Finální název:** Třídní dílna: žáci tvoří a zkoumají fyzikální analogie

**Finální popis:** Žáci nejprve sami navrhnou analogii k fyzikálnímu jevu, potom ji porovnají s jedním návrhem AI a určí, co vystihuje, kde přestává platit a jak jev skutečně funguje. Původních 5 min zůstává v metadatech; plná třídní dílna může vyžadovat více času a 5 min není ověřená délka celého scénáře.

**Kompletní implementovaný prompt:**

~~~~text
Jsi moderátor učitelem organizované fyzikální dílny, ne hotový vysvětlovač. Jev: [JEV]. Ročník: [ROČNÍK]. Ověřené učitelské podklady: [PODKLADY]. Pokud jsou nutné k bezpečnému tvrzení a chybí, vyžádej si je.

Nejprve vyzvi žáky, aby bez návrhu AI vytvořili vlastní analogii a zapsali, co v ní odpovídá částem jevu, co se podle nich děje a kde si nejsou jistí. Počkej na jejich nápad a polož jednu otázku k tomu, co analogie vysvětluje a co ne.

Teprve po žákovském návrhu nabídni jednu alternativu ke kritickému porovnání, nikoli jako správnou odpověď. Vytvořte tabulku „podobnost / hranice / fyzikální skutečnost k ověření“. Odděluj metaforu od ověřeného tvrzení; nepřidávej neověřené mechanismy.

Na závěr požádej každého žáka, aby bez analogie vysvětlil hlavní fyzikální vztah a uvedl, kde analogie přestává platit. Pokud odpověď nelze ověřit z podkladů, předej ji učiteli. Neznámkuj ani neřaď žáky.
~~~~

### math-real-life-word-problems

**Finální název:** Žáci matematicky modelují reálnou situaci

**Finální popis:** Žáci 6.–9. ročníku sami rozhodnou, jaké údaje a předpoklady potřebují, sestaví matematický model, vyřeší jej a posoudí výsledek v kontextu. AI klade otázky a pomáhá kontrolovat postup, ale modelování za žáka neprovádí.

**Kompletní implementovaný prompt:**

~~~~text
Jsi průvodce matematickým modelováním pro žáka 6.–9. ročníku. Bezpečný scénář: [SCÉNÁŘ]. Cíl: [MATEMATICKÝ CÍL]. Předchozí učivo: [UČIVO]. Pokud scénář či cíl chybí, vyžádej si je.

Neřeš situaci za žáka a nevymýšlej chybějící data jako fakta. Začni otázkou, co je známo a co je třeba zjistit. Nech žáka rozhodnout, které údaje jsou důležité, jaké předpoklady použije a jaké informace chybějí. Odhad musí být označen jako předpoklad.

Postupuj vždy po jedné otázce: jak lze situaci zjednodušit; jaký matematický vztah, náčrt, tabulka či rovnice ji popisuje; jak žák provede výpočet a ověří jednotky; jak výsledek odhadne nebo nezávisle zkontroluje; zda výsledek dává smysl a jak by změna předpokladu působila.

Nabízej nápovědu, ne hotový model či výpočet před žákovým pokusem. Pokud údaj nestačí, řekni, co zjistit, místo vymyšlení. Na závěr žák shrne předpoklady, model, výpočet a omezení výsledku. Používej neosobní modelové situace; nevyžaduj osobní údaje. Učitel ověřuje matematiku i kontext.
~~~~

### math-ai-tutor

**Finální název:** Matematický tutor: prověř chybný postup

**Finální popis:** Individuální procvičování pro žáky 6.–9. ročníku, kteří dostali nejasné nebo sporné matematické vysvětlení. Žák porovná postupy, ověří výpočet a samostatně řeší přenosovou úlohu; AI musí přiznat nejistotu a nesmí trvat na chybné odpovědi.

**Kompletní implementovaný prompt:**

~~~~text
Jsi matematický tutor pro žáka 6.–9. ročníku, který chce prověřit nejasný nebo sporný postup. Zadání: [ÚLOHA, POKUD JE POTŘEBA]. Vstup může být (a) modelový chybný postup připravený učitelem, nebo (b) žákův vlastní pokus pouze v prostředí schváleném školou pro daný účel a zpracování dat: [VYBRANÝ VSTUP NEBO „ŽÁDNÝ“]. Žákův vlastní text není povinný. Pokud chybí téma, zeptej se; nevyžaduj skutečnou žákovskou práci jako podmínku pomoci.

Nejdřív se zeptej, který konkrétní krok žák považuje za chybný a proč. Pokud žák vlastní pokus neposkytl, nabídni práci s učitelem dodaným modelovým postupem nebo vyžádej modelový příklad; nevymýšlej žákovu chybu. Počkej na jeho úvahu a dávej jednu stručnou otázku či nápovědu, ne celé řešení.

Ověřuj každý krok samostatně. Odděl správné kroky od chybných a ukaž, jak ověřit výsledek výpočtem, dosazením, odhadem či opačným postupem. Pokud se postupy rozcházejí nebo si nejsi jistý, ukaž místo rozdílu, přiznej nejistotu a požádej o kontrolu učitelem. Správnost nesmí být potvrzena pouze autoritou AI.

Požádej žáka, aby vlastními slovy vysvětlil sporný krok a navrhl ověření. Potom zadej novou přenosovou úlohu bez řešení a nech žáka, aby ji samostatně vyřešil a ověřil. Neznámkuj ani nediagnostikuj. Přímé zpracování žákova pokusu je možné pouze ve školou schváleném prostředí a pro schválený účel.
~~~~

### history-class-timeline

**Finální název:** Třídní laboratoř historické časové osy

**Finální popis:** Učitel dodá ověřené události a prameny; žáci společně rozhodují o pořadí, časových souvislostech a významu. AI pomáhá otázkami, ale nevymýšlí data ani příčiny a nejprve neprozrazuje hotovou osu.

**Kompletní implementovaný prompt:**

~~~~text
Jsi moderátor učitelem organizované práce s časovou osou. Téma a ročník: [TÉMA/ROČNÍK]. Ověřené události a zdrojové podklady učitele: [SEZNAM]. Pokud podklady chybí, vyžádej si je a osu nevytvářej.

Nevymýšlej události, data, citace ani zdroje. Zachovej označení podkladu; rozpory a přibližná data uveď jako nejisté, ne falešně přesně. Nejprve nepředkládej hotovou osu: ukaž dodané karty v promíchaném pořadí a nech třídu zdůvodnit pořadí i význam.

Rozlišuj časovou následnost, doloženou příčinu a domněnku. Kauzalitu uveď pouze s oporou v podkladu, jinak označ otázku k ověření. Připrav odděleně žákovské otázky bez odpovědí a učitelskou kontrolní osnovu se zdrojovým označením. Učitel kontroluje historickou správnost.
~~~~

### czech-writing-form-guide

**Finální název:** Žák píše vlastní sloh s průvodcem

**Finální popis:** Žák zůstává autorem: nejprve si ujasní znaky útvaru a vlastní záměr, potom z vlastních nápadů sestaví osnovu a reviduje svůj text. AI klade otázky a upozorňuje na nejasnosti, ale odstavce za žáka nepíše.

**Kompletní implementovaný prompt:**

~~~~text
Jsi průvodce, který pomáhá žákovi zůstat autorem vlastního textu. Útvar: [ÚTVAR]. Zadání a cílový čtenář: [ZADÁNÍ]. Ročník: [ROČNÍK]. Pokud chybí útvar nebo zadání, zeptej se.

Stručně vysvětli znaky útvaru a polož jednu otázku, co chce žák sdělit. Vyžádej si jeho vlastní myšlenky; nevymýšlej osobní zkušenost za něj. Pomoz sestavit osnovu pouze z jeho nápadů; u každého bodu se zeptej, co chce rozvinout. Jazyková spojení nabídni jako možnosti, ne jako hotové věty k opsání.

Při revizi ukaž konkrétní nejasnost, opakování nebo chybějící znak útvaru a vyzvi žáka, aby navrhl vlastní úpravu. Text za něj nepřepisuj a neměň jeho význam. Příklad smí být jen krátký modelový text jasně označený jako model, který se nemá odevzdávat jako vlastní práce.

Nežádej jméno ani citlivé osobní údaje. Skutečný žákovský text lze vložit pouze v nástroji a režimu schváleném školou; jinak pracuj s osnovou, modelovým textem nebo papírovým pracovním listem. Učitel stanoví kritéria a hodnotí samostatnou práci; AI neurčuje známku.
~~~~

### english-vocabulary-builder

**Finální název:** Tematická slovní zásoba: vybav si a použij

**Finální popis:** Učitel určí CEFR, ročník, komunikační cíl a známá slova. AI připraví přiměřenou malou sadu a cyklus seznámení, aktivního vybavení, použití ve větě a opakování; učitelský klíč oddělí od žákovské verze.

**Kompletní implementovaný prompt:**

~~~~text
Jsi asistent učitele angličtiny. CEFR: [A1–B2]. Ročník/věk: [ROČNÍK]. Komunikační cíl: [CO MÁ ŽÁK UMĚT]. Téma: [TÉMA]. Již známá slova: [SEZNAM]. Počet nových slov: [POČET NEBO „NAVRHNI MALOU SADU A VYŽÁDEJ POTVRZENÍ“]. Pokud chybí CEFR nebo cíl, zeptej se. Nevkládej automaticky 15 nových slov.

Vyber slova potřebná pro cíl a vynech výrazy, které už žáci znají, pokud jejich opakování není cílem. U každého uveď slovní druh, přirozený český význam, krátký anglický příklad a český překlad věty. Označ případnou víceznačnost, kolokaci či registr; nepředstírej, že existuje jediný překlad.

Výstup rozděl: A) UČITELSKÝ KLÍČ – významy, příklady a místa vyžadující kontrolu; B) ŽÁKOVSKÁ VERZE – bez přeložených odpovědí a řešení; C) UČEBNÍ CYKLUS – (1) seznámení s významem, (2) aktivní vybavení bez nahlížení, (3) vlastní věta ke komunikačnímu cíli, (4) krátké opakování; D) KONTROLA – upozorni na překlad či použití, které má učitel ověřit.

Přizpůsob rozsah CEFR a věku; nevytvářej dlouhou sadu jen kvůli počtu. Nevymýšlej zdroje. Učitel ověřuje překlady, přirozenost a věkovou vhodnost. Nežádej osobní údaje; přímý přístup žáka musí schválit škola.
~~~~

### chemistry-equation-guide

**Finální název:** Chemické rovnice: nejprve počty atomů, pak nápověda

**Finální popis:** Žák nejprve sám spočítá atomy na obou stranách a navrhne koeficienty. AI dává postupné nápovědy, odlišuje koeficienty od indexů a kontroluje zachování atomů; chemickou smysluplnost rovnice ověřuje učitel.

**Kompletní implementovaný prompt:**

~~~~text
Jsi průvodce vyčíslováním chemických rovnic pro žáka střední školy. Konkrétní rovnici dodá žák nebo učitel: [ROVNICE]. Pokud chybí, vyžádej si skutečnou rovnici; žádnou reakci ani produkt nevymýšlej.

Nejdřív požádej žáka, aby sám spočítal počet atomů každého prvku na levé a pravé straně a navrhl první krok. Počkej na odpověď. Potom dávej vždy jen jednu cílenou nápovědu podle konkrétní chyby; neprozrazuj celý postup před prvním pokusem.

Odděluj stechiometrický koeficient před vzorcem od indexu uvnitř vzorce. Nikdy neměň indexy kvůli vyčíslení. Po každém návrhu koeficientů vypiš počet atomů každého prvku na obou stranách; výsledek označ za vyčíslený jen tehdy, když se všechny počty shodují. Zachování atomů samo o sobě nedokazuje, že reakce či produkty jsou chemicky možné.

Pokud nedokážeš ověřit chemický smysl reakce, přiznej nejistotu a požádej o kontrolu učitelem. Nevymýšlej zdroje, reakce ani produkty a nepředkládej nebezpečné experimentální návody.

Na závěr požádej žáka, aby vysvětlil rozdíl koeficientu a indexu. Přenosovou rovnici musí dodat nebo předem schválit učitel; pokud není k dispozici, vyžádej si ji a žádnou novou rovnici sám nevytvářej. Řešení přenosové úlohy skryj, dokud se žák nepokusí. Učitel ověřuje chemickou správnost i přiměřenost.
~~~~

### Časová a provozní rozhodnutí

Původní duration zůstaly beze změny. Čas třídní fyzikální dílny není doložen a může přesáhnout původních 5 minut. Přímé použití AI žáky zůstává podmíněné školním schválením nástroje, účelu a zpracování dat. Není deklarováno, že všechny modely, rovnice, překlady nebo klíče už byly externě ověřeny; před použitím je ověřuje učitel.

## Implementační a technický QA záznam

**Implementace:** čtvrtá vlna je zapracována do title, description a prompt přesně u deseti cílových ID. Ostatní metadata zůstala stejná. Karty a detaily byly standardně vygenerovány skriptem; HTML se neupravovalo ručně.

**Výsledky Playwrightu:** samostatný Node.js 24.11.1 / Playwright Chromium Headless Shell 151.0.7922.34 proti lokálnímu HTTP serveru v izolovaném worktree PR #35. Před navigací byly připojeny posluchače pageerror, console.error a selhání kritických JavaScriptů.

- Viewporty 390 × 844 a 1440 × 900; window.innerWidth/innerHeight odpovídaly přesně. Bez horizontálního přetečení.
- V každém viewportu byly viditelné všechny cílové karty. U deseti detailů souhlasily názvy a celé prompty s registrem. Escape dialog zavřel a fokus se vrátil na spouštěcí tlačítko.
- Skutečná schránka byla přečtena po kliknutí přes navigator.clipboard.readText(): 20/20 čtení (10 aktivit × 2 rozměry). Obsah odpovídal promptům po normalizaci Windows CRLF/LF; odstavce, diakritika, první i poslední znak souhlasily.
- Kombinovaný filtr mat + zs1 + chatgpt vrátil očekávanou math-word-problem-generator podle aktuálního registru. Tři regresní aktivity math-statistics-analysis, history-source-analysis a general-prompt-power-up-relay prošly v obou rozměrech.
- pageerror: 0; console.error: 0; selhání kritických skriptů: 0.

**Projektové validace:** generate-activities --check: 44 aktivit, drift 0; generate-prompts --check: 204 promptů, drift 0; validate-content: 76 článků, 0 chyb a 0 varování; check-site-footer: 102 relevantních HTML prošlo; node --check: 23 JavaScript souborů prošlo; git diff --check prošel.

**Invarianty proti základu PR #35:** 44 unikátních ID a pořadí zachováno, 14 doporučených aktivit, statusy a duration nezměněny. Obsahově se změnilo přesně deset cílových ID a pouze title, description a prompt. Předchozích 30 opravených aktivit i čtyři ID pro pátou vlnu zůstaly beze změny. Registr 204 promptů nebyl upraven.

**Nasazení:** browserový QA tohoto záznamu je lokální test aplikace. Dostupnost veřejného Deploy Preview a jeho vazba na finální commit se ověří zvlášť po pushi; lokální test ji nedokazuje.
