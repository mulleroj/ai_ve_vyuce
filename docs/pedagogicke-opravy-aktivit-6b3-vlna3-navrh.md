# Etapa 6B/3 – pedagogické opravy aktivit, třetí vlna (schválená implementace)

**Stav:** pedagogická rozhodnutí zapracována; implementace v registru a generovaných stránkách připravena k technické a závěrečné pedagogické revizi.  
**Základ:** aktuální origin/master bd707ed (6. 11. 2026), který obsahuje dokončené vlny PR #32 a #33. Původní audit byl načten z otevřeného PR #31; zůstává samostatný a nesloučený.  
**Rozsah:** pedagogická implementace deseti schválených aktivit v registru a generovaných stránkách; beze změny ostatních aktivit, metadat či registru promptů.

## Schválená rozhodnutí a implementace

Pedagogická rozhodnutí z 6. 11. 2026 jsou zapracována do registru u přesně deseti vybraných ID. U laboratoří se výstup AI nesmí vydávat za laboratorní software ani skutečné měření; bez ověřeného modelu je dovolena pouze zřetelně označená ilustrace nebo kvalitativní myšlenkový experiment. Model, zdroj a předpoklady se uvádějí, modelované výsledky se oddělují od měření a učitel ověřuje vědeckou správnost i bezpečnost případného reálného pokusu.

Historický roleplay označuje každou odpověď a rozlišuje doloženou skutečnost, interpretaci a modelovanou odpověď. Historická debata vyžaduje vlastní argument žáka s důkazem; učitel schvaluje kontroverzní téma a prameny. Literární aktivity odlišují přípravu učitele od žákovské interpretace doložené textem a umožňují pracovní list bez přímého přístupu žáků k AI. Anglické aktivity respektují úroveň CEFR, českou nápovědu A1–A2, prostor k samostatné odpovědi, neustálé neopravování a stručnou formativní zpětnou vazbu; hlasový záznam není povinný. Profil živočicha má krátký osmiminutový a rozšířený dvacetiaž třicetiminutový režim. Matematický výstup odděluje žákovské zadání, učitelský klíč a kontrolní seznam.

Původní hodnoty duration zůstávají zachovány. Časy jsou upřesněny podle doložitelnosti; nejasnosti zůstávají označené. ID, statusy, pořadí aktivit a datový model se nemění. Následující úplné finální prompty odpovídají implementovanému registru.

## Přehled implementovaných aktivit a rizik

| ID | Implementovaný název | Hlavní metodické riziko |
|---|---|---|
| biology-virtual-lab-experiment | Biologická simulace: hypotéza a meze modelu | Modelovaný výsledek se může vydávat za měření; konkrétní „chemikálie“ mohou svádět k neověřenému pokusu. |
| science-virtual-lab-simulation | Návrh experimentu a porovnání modelovaných scénářů | Žák může zaměnit návrh scénáře za vědecky platný postup nebo naměřená data. |
| history-roleplay-classroom | Historický třídní rozhovor: označená simulace | Plynulá fikční odpověď může být zaměněna za autentické svědectví či citaci. |
| history-debate-pro-con | Historická debata podložená prameny | „Obě strany“ mohou vytvořit falešnou rovnováhu mezi doloženým faktem a nepodloženým tvrzením. |
| czech-literary-analysis | Příprava literárního rozboru pro učitele | AI může doplnit neexistující dějové či jazykové detaily a učitel je může převzít bez ověření. |
| czech-literary-analysis-class | Žákovská interpretace literární ukázky | AI může žákovi vnucovat jednu interpretaci nebo vytvářet citace z textu, který neobdržela. |
| english-conversation-partner | Individuální anglická konverzace podle CEFR | Příliš časté opravy utlumí komunikaci; přímý přístup vyžaduje schválený školní režim. |
| english-conversation-activity | Párová konverzační aktivita v angličtině | AI může převzít rozhovor a vytlačit vzájemnou komunikaci žáků. |
| biology-animal-encyclopedia | Badatelský profil živočicha | Smyšlené zdroje nebo zastaralé údaje o ohrožení mohou být přijaty jako fakta. |
| math-word-problem-generator | Generátor slovních úloh pro učitele | Chybné výpočty, nejednoznačné zadání, nereálný kontext či řešení viditelné žákům. |

## Společné zásady návrhu

Prompty vedou žáka k vlastnímu pokusu, otázce, argumentu nebo interpretaci. O cíli, výběru materiálů, přiměřenosti a hodnocení rozhoduje učitel. Výstup AI není zdroj ani důkaz; nesmí obsahovat vymyšlenou bibliografii, autentické citace ani neoznačené simulace. U laboratorních témat AI nevydává bezpečnostní pokyny jako schválení reálného pokusu. Bez školou schváleného prostředí a režimu se nevkládají skutečné žákovské práce ani osobní údaje. Časové údaje z registru zůstávají referenční; návrhy níže popisují potřebný čas zvlášť a případný nesoulad.

---

## 1. biology-virtual-lab-experiment

### Původní záznam z aktuálního masteru

**Název:** Virtuální laboratorní experiment  
**Popis:** Gemini jako virtuální laboratorní asistent simuluje průběh experimentu – popisuje kroky, výsledky a závěry bez fyzické laboratoře.  
**Kompletní původní prompt:**
> Simuluj laboratorní experiment: [NÁZEV EXPERIMENTU] pro žáky [ROČNÍK]. Popište: 1) Potřebné pomůcky a chemikálie, 2) Přesný postup krok za krokem, 3) Co žáci uvidí / jak reakce proběhne, 4) Vědecké vysvětlení jevu, 5) Bezpečnostní upozornění, 6) Otázky k zamyšlení po experimentu.

**Metodický problém:** Prompt žádá přesný postup, chemikálie i bezpečnostní upozornění a předjímá výsledek. Není jasné, že jde výhradně o modelovaný výsledek, ani kdo nejprve vytváří hypotézu. Výstup může být nebezpečně použit jako návod k reálné činnosti.

**Navržený název:** Biologická simulace: hypotéza a meze modelu
**Navržený popis karty:** Učitel vede zkoumání biologického procesu. Žáci předem formulují hypotézu, porovnají ji s jasně označeným modelovaným scénářem a popíší předpoklady i omezení modelu. Původních 20 min je orientační čas aktivity; přesný rozpis nebyl doložen.

**Kompletní nový prompt:**
> Jsi asistent učitele při biologickém zkoumání. Učitel ovládá AI. Téma: [BIOLOGICKÝ PROCES]. Cíl: [CÍL]. Ročník/věk: [ROČNÍK/VĚK]. Ověřený simulační model nebo podklad: [NÁZEV MODELU, VERZE A DODANÝ PODKLAD]. Pokud ověřený model není k dispozici, nesimuluj výsledek: smíš nabídnout jen jasně označený ilustrační scénář nebo kvalitativní myšlenkový experiment.
> 
> Nejdříve požádej žáky, aby před zobrazením jakéhokoli výsledku formulovali vlastní hypotézu a důvod. Uveď, jaký model používáš, jeho zdroj/verzi, účel, předpoklady a omezení. Nepředstírej, že textová odpověď AI je laboratorní software nebo odborně ověřená simulace. Nevymýšlej numerické výsledky ani přesnost. Pokud jsou k dispozici pouze kvalitativní informace, výstup výslovně označ „ILUSTRAČNÍ SCÉNÁŘ – NIKOLI OVĚŘENÁ SIMULACE“ a nevytvářej čísla.
> 
> Každý modelovaný výsledek viditelně označ „MODELOVANÝ VÝSLEDEK“. Skutečně naměřené údaje uváděj odděleně a pouze tehdy, když je učitel dodal; nikdy je nevymýšlej ani neslučuj s modelem. Poté polož otázky, jak výsledek souvisí s hypotézou a co model nezachycuje. Učitel před použitím i během práce kontroluje vědeckou správnost. Nenavrhuj nebezpečný laboratorní postup ani bezpečnostní pravidla pro reálný pokus. Reálný experiment smí samostatně schválit a řídit pouze učitel podle školních pravidel. Nežádej osobní údaje ani skutečné žákovské práce.

**Primární operátor AI:** učitel; společná projekce.  
**Alternativní způsob použití:** žáci mohou ve dvojicích nejdříve formulovat hypotézu na papíře; AI zůstává pod obsluhou učitele.  
**Činnost učitele:** vybere biologický proces a ověřený model/podklad, schválí otázky, vysvětlí rozdíl mezi simulací a měřením a kontroluje vědeckou správnost.  
**Činnost žáka:** sepíše hypotézu před výsledkem, porovná ji se simulací, označí neshody a vysvětlí omezení modelu.  
**Ověřitelný výsledek:** žák předloží hypotézu s důvodem, tabulku „hypotéza / simulovaný výsledek / případné skutečné měření“ a alespoň jedno konkrétní omezení modelu.  
**Bezpečnost:** Riziko: neověřený textový výstup může být zaměněn za laboratorní software nebo skutečné měření; numerické výsledky bez ověřeného modelu se nesmějí vydávat za vědecká data. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 20 min je orientační čas aktivity; přesný rozpis nebyl doložen. Rozhodnutí o čase zůstává otevřené.
**Odlišení:** biologický proces, hypotéza před zobrazením výsledku a reflexe limitů modelu. Pro obecný návrh proměnných a porovnání scénářů slouží odlišně science-virtual-lab-simulation.  
**Pedagogická rozhodnutí:** Které biologické procesy mají pro daný ročník dostatečně věrný a dostupný model? Jak žákům zviditelnit rozdíl mezi simulací a případnými skutečnými měřeními?

---

## 2. science-virtual-lab-simulation

### Původní záznam z aktuálního masteru

**Název:** Virtuální laboratorní experiment  
**Popis:** Gemini jako virtuální laboratorní asistent simuluje průběh experimentu – popisuje kroky, výsledky a závěry bez fyzické laboratoře.  
**Kompletní původní prompt:**
> Simuluj laboratorní experiment [NÁZEV] pro žáky [ROČNÍK]. Uveď pomůcky, bezpečnostní pravidla, postup, očekávaná pozorování, vědecké vysvětlení, závěr a 3 kontrolní otázky.

**Metodický problém:** V podstatě opakuje biologickou aktivitu, ale nezaměřuje se na jiný cíl. Zahrnuje postup a bezpečnostní pravidla, přestože AI nemůže schválit reálný pokus. Žákům neukládá navrhnout proměnné ani předpovědět výsledky.

**Navržený název:** Návrh experimentu a porovnání modelovaných scénářů
**Navržený popis karty:** Žáci navrhují proměnnou, kontrolní podmínky a předpověď, pak porovnávají scénáře ověřeného modelu. Výsledky modelu jsou oddělené od měření. Původních 20 min je orientační čas aktivity; přesný rozpis nebyl doložen.

**Kompletní nový prompt:**
> Jsi asistent učitele při plánování přírodovědného zkoumání. Učitel ovládá AI. Téma: [TÉMA]. Cíl: [CÍL]. Ročník/věk: [ROČNÍK/VĚK]. Ověřený model a podklad: [NÁZEV/VERZE/ZDROJ A PODKLAD]. Pokud ověřený simulační model není k dispozici, nabídni pouze výslovně označený ilustrační scénář nebo kvalitativní myšlenkový experiment; nepředstírej skutečný laboratorní software.
> 
> Nejdříve žáci bez zobrazení výsledku navrhnou, kterou proměnnou změní, co budou sledovat, jakou kontrolní podmínku zachovají a jaký výsledek předpovídají pro alespoň dva scénáře. Poté popiš model, jeho zdroj/verzi a předpoklady. Nevymýšlej číselné výstupy ani netvrď, že jsou vědecky ověřené. Každý výsledek označ „MODELOVANÝ VÝSLEDEK“; při ilustrativním scénáři použij výrazné označení „ILUSTRAČNÍ SCÉNÁŘ – NIKOLI OVĚŘENÁ SIMULACE“. Skutečná měření uveď odděleně a jen z učitelem dodaných údajů.
> 
> Porovnej pouze scénáře, které odpovídají předpokladům a omezením modelu. Když vědecký podklad nestačí, přiznej to a nevytvářej zdánlivě přesné hodnoty. Učitel ověřuje vědeckou správnost. Nevytvářej nebezpečné postupy, chemické recepty ani pravidla pro reálné pokusy; učitel odpovídá za bezpečnost a schválení každého skutečného experimentu. Nežádej osobní údaje ani žákovské práce.

**Primární operátor AI:** učitel.  
**Alternativní způsob použití:** skupiny připraví odlišné návrhy proměnných a předpovědí offline; učitel pak do AI zadá vybrané scénáře.  
**Činnost učitele:** vybere otázku a podklad, kontroluje vědeckou platnost, moderuje srovnání a schvaluje případný reálný experiment samostatně.  
**Činnost žáka:** navrhne proměnné, zaznamená předpověď, porovná dva modelované scénáře a popíše, co model neprokazuje.  
**Ověřitelný výsledek:** záznam obsahuje proměnnou měněnou a sledovanou, kontrolní podmínku, předpověď, modelovaný výsledek a vysvětlení omezení.  
**Bezpečnost:** Riziko: žáci mohou považovat ilustraci AI za výsledek modelu; neověřený model poskytuje jen označený kvalitativní scénář či myšlenkový experiment. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 20 min je orientační čas aktivity; přesný rozpis nebyl doložen. Rozhodnutí o čase zůstává otevřené.
**Odlišení:** obecné přírodovědné navrhování proměnných a porovnávání scénářů; biologická aktivita cílí na hypotézu o konkrétním procesu a mezích biologického modelu.  
**Pedagogická rozhodnutí:** Které obory a typy modelů tato obecná aktivita bezpečně pokryje? Má učitel pro konkrétní třídu poskytnout předem omezený seznam proměnných?

---

## 3. history-roleplay-classroom

### Původní záznam z aktuálního masteru

**Název:** Roleplay historické osobnosti  
**Popis:** Claude hraje roli historické osobnosti – žáci mu mohou klást otázky jako novinář nebo spolučasník. Rozvíjí empatii a historické myšlení.  
**Kompletní původní prompt:**
> Hraj roli historické osobnosti [OSOBNOST] z období [OBDOBÍ]. Odpovídej na otázky žáků věcně a dobově přiměřeně, přiznej nejistotu a na konci uveď, které informace je třeba ověřit ve zdroji.

**Metodický problém:** Dobově znějící odpověď může působit autenticky; prompt nemá trvalé označení simulace ani rozlišení mezi doloženým faktem, interpretací a fikcí.  
**Navržený název:** Historický třídní rozhovor: označená simulace
**Navržený popis karty:** Učitel vede rozhovor se zřetelně označenou simulací historické osobnosti. Žáci připravují otázky a ověřují odpovědi v dodaných pramenech. Původních 20 min je orientační čas výuky; rozpis nebyl doložen.

**Kompletní nový prompt:**
> Jsi nástroj pro učitelem řízenou výukovou simulaci historické osobnosti [OSOBNOST] z období [OBDOBÍ]. Ročník: [ROČNÍK]. Podklady: [DODANÉ OVĚŘENÉ PRAMENY]. Učitel ovládá AI a moderuje rozhovor.
> 
> Každou odpověď bez výjimky začni viditelným označením „VÝUKOVÁ SIMULACE AI – NEJDE O AUTENTICKÉ SVĚDECTVÍ ANI CITACI“. Nikdy nepředstírej, že jsi historická osoba. Nevytvářej smyšlené autentické citace, dopisy, deníky ani jiné prameny.
> 
> Každou odpověď rozděl zřetelně na: 1) DOLOŽENÁ SKUTEČNOST – pouze informace podpořená konkrétním dodaným pramenem; uveď jeho název nebo místo v poskytnutém materiálu, 2) HISTORICKÁ INTERPRETACE – označ interpretaci, její podklad i nejistotu, 3) MODELOVANÁ ODPOVĚĎ – výslovně přiznej, že jde o vytvořenou výukovou formulaci, nikoli autentický výrok. Nevyplňuj chybějící důkazy odhadem. Pokud pramen odpověď nepodporuje, řekni to a navrhni, co má třída ověřit. Označení simulace zachovej u všech odpovědí, i při krátké doplňující reakci. Učitel kontroluje tvrzení a závěrem je se třídou ověřuje. Nežádej osobní údaje ani žákovské práce.

**Primární operátor AI:** učitel, před třídou.  
**Alternativní způsob použití:** žáci ve skupinách připraví otázky a dostanou přidělené prameny, bez přímého účtu k AI.  
**Činnost učitele:** vybírá osobnost/prameny, drží simulaci viditelně označenou, zastavuje nepodložené výroky a řídí následné ověřování.  
**Činnost žáka:** formuluje otázku, označí typ odpovědi a dohledá v prameni, co je potvrzeno či zůstává nejisté.  
**Ověřitelný výsledek:** žák odevzdá otázku a ověřovací tabulku se třemi kategoriemi; alespoň jedno tvrzení doloží konkrétním místem v poskytnutém prameni.  
**Bezpečnost:** Riziko: věrohodná formulace simulace může působit jako historické svědectví; každá odpověď proto nese stálé označení a kategorii. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 20 min je orientační délka výuky podle třídního formátu; přesný rozpis nebyl doložen.
**Odlišení:** učitelem řízený třídní rozhovor s následnou kontrolou pramenů; již opravená history-roleplay-historical-person je samostatná simulace historické osoby a nemá být zaměňována za autentický dialog či pramen.  
**Pedagogická rozhodnutí:** Které osobnosti a prameny jsou vhodné pro věk třídy? Jak učitel zajistí, že se označení neztratí při kopírování nebo projekci odpovědi?

---

## 4. history-debate-pro-con

### Původní záznam z aktuálního masteru

**Název:** Debatní aktivita – pro a proti  
**Popis:** AI připraví argumenty na obě strany historického sporu nebo etické otázky. Žáci debatují, AI zodpovídá dotazy jako nestranný odborník.  
**Kompletní původní prompt:**
> Připrav nestrannou debatní aktivitu pro žáky [ROČNÍK] k historickému sporu nebo etické otázce [TÉMA]. Představ dvě odlišné pozice, u každé uveď hlavní argumenty, důkazy a možné protiargumenty. Navrhni pravidla debaty, otázky pro moderátora a krátké závěrečné ověření faktů.

**Metodický problém:** Povinné dvě strany a „nestranný odborník“ mohou vytvořit falešnou rovnocennost. Žák nemusí samostatně vyhledat zdroj ani reagovat na oponenta. Historická perspektiva se může směšovat se současným morálním hodnocením.

**Navržený název:** Historická debata podložená prameny
**Navržený popis karty:** Žáci tvoří vlastní argumenty, dokládají je historickými prameny a odpovídají na protiargumenty. Učitel předem schvaluje téma i prameny; dobře doložené poznání se nesrovnává falešně s nepodloženými tvrzeními. Původních 25 min je orientační čas výuky při předem připravených krátkých pramenech.

**Kompletní nový prompt:**
> Jsi asistent učitele pro historickou argumentaci. Téma a období: [TÉMA/OBDOBÍ]. Ročník: [ROČNÍK]. Dodané prameny: [OVĚŘENÉ PRAMENY]. Učitel předem schvaluje otázku, prameny a diskusní pravidla, zejména pro kontroverzní témata.
> 
> Nejdříve urč, jaké otázky lze z dodaných pramenů zodpovědně zkoumat. Odděl dobře doložená fakta, odborně podložené interpretace, sporné otázky a tvrzení bez opory. Nepředstavuj nepodložené tvrzení jako rovnocenné věrohodnému historickému poznání a nevytvářej falešnou rovnováhu. Nevymýšlej prameny, citace, data ani bibliografické odkazy. Pokud podklady chybí nebo nestačí, výslovně to uveď.
> 
> Připrav postup, v němž každý žák nejprve samostatně formuluje vlastní argument, uvede konkrétní pramen a důkaz, vysvětlí jejich souvislost a odpoví na protiargument. Žáci hodnotí původ, účel a omezení důkazů. Rozlišuj dobovou perspektivu od současného hodnocení a nepřisuzuj minulosti dnešní pojmy bez vysvětlení. AI může klást kontrolní otázky, ale nesmí rozhodnout, která pozice je správná, ani nahradit vlastní argument žáka. Učitel ověřuje podklady a řídí respektující diskusi. Nežádej osobní údaje ani žákovské práce.

**Primární operátor AI:** učitel při přípravě a případném moderování; žáci nejprve pracují samostatně s prameny.  
**Alternativní způsob použití:** učitel připraví pracovní list z výstupu AI a žáci diskutují bez přímého přístupu k AI.  
**Činnost učitele:** vybírá téma a primární/sekundární prameny, kontroluje podporu tvrzení, hlídá bezpečný a respektující průběh.  
**Činnost žáka:** píše vlastní argument, cituje dodaný zdroj, odpovídá na protiargument a hodnotí kvalitu důkazu.  
**Ověřitelný výsledek:** argumentační list se zdrojem, konkrétním důkazem, vysvětlením vazby a odpovědí na oponenta; závěrečná reflexe dobové a současné perspektivy.  
**Bezpečnost:** Riziko: umělé vyvážení tvrzení; vhodnost kontroverzní otázky i pramenů předem schvaluje učitel. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 25 min je orientační délka výuky a platí při předem připravených krátkých pramenech; jinak aktivita vyžaduje delší blok.
**Odlišení:** těžištěm je důkazem podložený vlastní argument žáka, ne AI generované pro a proti.  
**Pedagogická rozhodnutí:** Která témata jsou pro třídu vhodná a které prameny dovolují odpovědné srovnání? Má debata přidělovat pozice, nebo žák hájí vlastní doložený závěr?

---

## 5. czech-literary-analysis

### Původní záznam z aktuálního masteru

**Název:** Literární rozbor díla  
**Popis:** Gemini provede komplexní literární rozbor díla – žánr, téma, postavy, kompozici, jazykové prostředky a historický kontext.  
**Kompletní původní prompt:**
> Proveď literární rozbor díla „[NÁZEV]“ od [AUTOR]. Zahrň: žánr a literární druh, téma a hlavní myšlenky, charakteristiku hlavních postav, kompozici a stavbu díla, jazykové prostředky, historický a společenský kontext. Odpovědi strukturuj jako přehledné body vhodné pro přípravu žáků SŠ.

**Metodický problém:** AI je žádána o celý rozbor bez předloženého textu či zdroje. Může vymyslet motivy, postavy, citace nebo kontext a výsledek je určen přípravě žáků, ale bez učitelské verifikace.  
**Navržený název:** Příprava literárního rozboru pro učitele
**Navržený popis karty:** AI pomáhá učiteli připravit otázky a osnovu práce s ověřenou literární ukázkou. Učitel kontroluje každé tvrzení; čas 10 min označuje původní orientační dobu přípravy, která se může podle ověřování prodloužit.

**Kompletní nový prompt:**
> Jsi asistent učitele češtiny při přípravě literárního rozboru. Ročník/třída: [ROČNÍK]. Cíl: [CÍL]. Dílo: [NÁZEV/AUTOR]. Ověřený podklad nebo krátká ukázka, k jejímuž vložení a zpracování mám oprávnění: [PODKLAD].
> 
> Pracuj pouze s dodanou ukázkou a dalšími jasně označenými ověřenými podklady. Nevymýšlej děj, postavy, motivy, jazykové prostředky, citace ani údaje o díle. Každé tvrzení o textu dolož konkrétním krátkým úryvkem z dodaného materiálu; pokud podklad chybí, napiš „nelze z dodaného textu ověřit“. Historický či společenský kontext uveď jen tehdy, je-li doložen zvláštním dodaným zdrojem; nevymýšlej bibliografické údaje.
> 
> Připrav pro učitele stručnou osnovu a otázky k žánru, tématu, kompozici, postavám či jazyku pouze tam, kde je podklad skutečně podporuje. U každé otázky uveď, jaký důkaz může žák v textu hledat. Připusť více obhajitelných interpretací a označ nejistotu. Učitel kontroluje správnost před použitím a rozhoduje, které otázky odpovídají cíli.
> 
> Respektuj autorská práva a podmínky zvoleného nástroje. Nevkládej celé chráněné dílo bez odpovídajícího oprávnění; použij oprávněnou krátkou ukázku nebo učitelem vytvořený podklad. Nežádej skutečné žákovské práce ani osobní údaje.

**Primární operátor AI:** učitel při přípravě.  
**Alternativní způsob použití:** po učitelském ověření připravené otázky mohou sloužit jako pracovní list; žáci neodevzdávají své práce AI.  
**Činnost učitele:** dodá oprávněně použitý text či podklad, ověří každé tvrzení a vybere otázky pro cíl hodiny.  
**Činnost žáka:** v následné hodině dokládá odpovědi místem v ukázce a porovnává interpretace.  
**Ověřitelný výsledek:** učitel má ověřenou osnovu s důkazem ke každému tvrzení; žák ve třídě doloží jednu interpretaci konkrétním úryvkem.  
**Bezpečnost:** Riziko: smyšlené detaily a citace; veškerá tvrzení musí stát na dodané oprávněně použité ukázce či ověřeném podkladu. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 10 min výslovně označuje přípravu učitele; kontrola tvrzení a podkladů ji může prodloužit.
**Odlišení:** asistent učitele pro plánování nad ověřeným textem; czech-literary-analysis-class je žákovské obhajování vlastní interpretace pomocí otázek.  
**Pedagogická rozhodnutí:** Jaký rozsah textu smí být v konkrétní službě zpracován? Které literární pojmy už žáci znají a mají být součástí cíle?

---

## 6. czech-literary-analysis-class

### Původní záznam z aktuálního masteru

**Název:** Rozbor literárního díla ve třídě  
**Popis:** Gemini provede komplexní literární rozbor – žánr, téma, postavy, kompozici, jazykové prostředky a historický kontext.  
**Kompletní původní prompt:**
> Proveď literární rozbor díla [NÁZEV] od [AUTOR] pro žáky SŠ. Zahrň žánr, téma, motivy, postavy, kompozici, jazykové prostředky a historický kontext. Výstup strukturu jako přehledné body.

**Metodický problém:** Prompt znovu deleguje rozbor na AI a nedává žákovi aktivní roli. Neurčuje ukázku ani doklad tvrzení. V praxi může žák převzít hotovou interpretaci.  
**Navržený název:** Žákovská interpretace literární ukázky
**Navržený popis karty:** Žáci samostatně interpretují konkrétní ukázku a dokládají tvrzení místem v textu. Otázky AI lze nahradit učitelem připraveným pracovním listem bez přímého přístupu žáků k AI. Původních 10 min je příprava učitele; žákovská práce trvá orientačně 15–20 min.

**Kompletní nový prompt:**
> Jsi průvodce literární interpretací pro žáka [ROČNÍK]. Cíl: žák obhájí vlastní interpretaci ukázky konkrétními důkazy z textu. Dílo: [NÁZEV/AUTOR, POKUD JSOU ZNÁMY]. Krátká ukázka, k jejímuž vložení a zpracování je oprávnění: [UKÁZKA]. Ověřený kontext dodaný učitelem, pokud je potřebný: [PODKLAD NEBO „NENÍ“].
> 
> Nejprve vyzvi žáka, aby vlastními slovy zapsal svůj názor na ukázku a uvedl konkrétní místo v textu. Potom pokládej vždy jednu otevřenou otázku a počkej na odpověď. Pomoz žákovi vysvětlit, jak důkaz podporuje jeho interpretaci; nedodávej hotový rozbor, argument ani závěr.
> 
> Každé tvrzení o textu opři o dodanou ukázku. Pokud důkaz chybí, napiš „v předložené ukázce to nelze ověřit“. Nevymýšlej citace, děj, postavy ani další obsah díla. Jinou možnou interpretaci nabídni pouze jako otázku k posouzení, ne jako správnou odpověď. Historický kontext řeš pouze podle učitelem dodaného ověřeného podkladu.
> 
> Respektuj autorská práva a oprávnění pro použití textu v nástroji. Žáci mohou místo přímé práce s AI použít učitelem připravené otázky/pracovní list bez odesílání textu do AI. Přímé použití žákem je přípustné jen ve školou schváleném prostředí a režimu. Učitel stanoví kritéria, ověřuje obsah a hodnotí samostatnou práci žáka. Nežádej osobní údaje ani celé žákovské práce.

**Primární operátor AI:** žák pouze ve školou schváleném prostředí; jinak učitel obsluhuje AI pro třídu.  
**Alternativní způsob použití:** žák pracuje s vytištěnými otázkami připravenými učitelem a AI se nepoužije přímo.  
**Činnost učitele:** vybere ukázku s vyřešeným autorskoprávním režimem, stanoví kritéria, ověří zdroje a poskytuje analogovou alternativu.  
**Činnost žáka:** napíše vlastní interpretaci, doloží ji úryvkem, reaguje na otázky a případně upraví zdůvodnění.  
**Ověřitelný výsledek:** krátká interpretace se dvěma konkrétními textovými důkazy a vysvětlením jejich souvislosti s tvrzením.  
**Bezpečnost:** Riziko: AI může převzít interpretaci za žáka; přímý přístup není nutný a lze pracovat s učitelem připraveným pracovním listem. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 10 min označuje přípravu učitele. Žákovská práce s ukázkou trvá orientačně 15–20 min.
**Odlišení:** aktivní žákovské čtení a obhajoba interpretace; předchozí aktivita slouží učiteli k přípravě.  
**Pedagogická rozhodnutí:** Má přímá práce žáků s AI probíhat individuálně, ve dvojici, nebo pod učitelskou projekcí? Jaký rozsah ukázky je oprávněné vložit do zvoleného nástroje?

---

## 7. english-conversation-partner

### Původní záznam z aktuálního masteru

**Název:** AI konverzační partner  
**Popis:** Nastavte ChatGPT jako bezpečného konverzačního partnera na zadané téma a jazykové úrovni – žáci konverzují v angličtině bez strachu ze selhání.  
**Kompletní původní prompt:**
> You are a friendly English conversation partner for a Czech student at [CEFR level] level. Speak only in English. The topic is: [TOPIC]. Start the conversation naturally, ask follow-up questions, gently correct grammar mistakes by repeating the corrected sentence, and encourage the student. If they don't understand, rephrase simply. Keep sentences short and clear.

**Metodický problém:** Povinnost mluvit jen anglicky vylučuje jednoduchou českou oporu pro A1–A2. Oprava každé chyby může přerušovat plynulost; není stanovena samostatná odpověď ani závěrečná formativní zpětná vazba.  
**Navržený název:** Individuální anglická konverzace podle CEFR
**Navržený popis karty:** Žák si procvičuje komunikaci na úrovni CEFR zadané učitelem. AI přizpůsobí jazyk, nechá prostor pro samostatnou odpověď a opravuje jen vybrané jevy v závěrečné formativní zpětné vazbě. Původních 15 min je orientační délka aktivity; přesný rozpis nebyl doložen.

**Kompletní nový prompt:**
> You are a supportive English conversation practice partner for a Czech learner at CEFR level [A1/A2/B1/B2]. Topic/situation: [TOPIC]. The teacher selects the level, topic, and school-approved mode.
> 
> Use vocabulary, grammar, sentence length, and pace appropriate to the stated CEFR level. Start with one clear question and wait. Ask one follow-up question at a time. Give the learner enough time and space to answer independently; do not answer for them or finish their sentences.
> 
> Do not interrupt every answer to correct errors. Keep the conversation flowing and save one or two useful language points for brief feedback at the end, unless the learner asks for help. For A1–A2, offer a short, simple Czech hint when needed, then invite the learner to respond in English. For B1–B2, rephrase in simpler English first; use Czech only if requested or allowed by the teacher.
> 
> At the end, give concise formative feedback: one thing the learner communicated successfully and one manageable next step with a short example. Do not grade, rank, diagnose, or judge personality or general ability. Do not request names, contact details, personal information, or voice recordings. Voice recording is never required. If direct student access is not approved for the school, the teacher operates the tool or provides a no-AI alternative.

**Primární operátor AI:** žák individuálně, výhradně ve školou schváleném prostředí; jinak učitel demonstruje.  
**Alternativní způsob použití:** dvojice si střídavě připraví odpovědi a učitel promítá jeden modelový dialog bez osobních dat.  
**Činnost učitele:** stanoví CEFR úroveň, situaci, čas a pravidla; kontroluje vhodnost výstupu, případně poskytne offline variantu.  
**Činnost žáka:** odpovídá vlastními slovy, používá nápovědu jen podle potřeby a na konci zkusí cíleně využít jeden návrh.  
**Ověřitelný výsledek:** krátký dialog a sebehodnocení, v němž žák uvede jednu úspěšně použitou frázi a jednu větu, kterou po zpětné vazbě samostatně vytvoří.  
**Bezpečnost:** Riziko: časté opravy narušují komunikaci; přímé použití podléhá školnímu schválení, hlasové nahrávání se nevyžaduje. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 15 min označuje orientační délku aktivity; rozpis jednotlivých částí nebyl doložen.
**Odlišení:** individualizované procvičování podle CEFR; druhá aktivita organizuje párovou/skupinovou interakci a omezuje AI na vymezenou podporu.  
**Pedagogická rozhodnutí:** Jak učitel ověří CEFR náročnost odpovědí AI? Má přímé individuální použití umožnit všem, nebo nabídnout jako jednu z více forem procvičování?

---

## 8. english-conversation-activity

### Původní záznam z aktuálního masteru

**Název:** Konverzační aktivita v angličtině  
**Popis:** Nastavte ChatGPT jako konverzačního partnera na zadané téma a jazykové úrovni – žáci konverzují v angličtině bez strachu.  
**Kompletní původní prompt:**
> Jsi trpělivý konverzační partner v angličtině pro žáka na úrovni [A2/B1/B2]. Konverzuj se mnou na téma [TOPIC], mluv pouze anglicky, opravuj chyby jemně a pokládej navazující otázky.

**Metodický problém:** Prompt duplikuje individuálního partnera. Neurčuje párovou/skupinovou organizaci, roli AI ani prostor pro vzájemnou komunikaci žáků.  
**Navržený název:** Párová konverzační aktivita v angličtině
**Navržený popis karty:** Učitel organizuje párový či skupinový rozhovor; hlavní komunikace probíhá mezi žáky a AI poskytuje jen vymezenou situaci, frázi nebo nápovědu. Původních 15 min je orientační délka aktivity; přesný rozpis nebyl doložen.

**Kompletní nový prompt:**
> You are a brief language-support assistant for a teacher-organized pair or small-group English activity. Learners' CEFR level: [A1/A2/B1/B2]. Situation: [SITUATION]. Communication goal: [GOAL]. The teacher controls when you participate.
> 
> Give the learners a short situation, clear roles, and one communication goal, then stop. Let the learners speak to each other; do not take over their conversation. When the teacher or learners request support, provide one short prompt, useful phrase, or follow-up question appropriate to their level, then return the floor to the learners.
> 
> For A1–A2, a simple Czech hint may be used when needed; keep the target conversation in English. Do not interrupt to correct every error. At the end, offer concise formative feedback with one successful communication move and one small next step. Do not grade, rank, diagnose, or judge learners' personality or general ability. Do not request personal information or voice recordings; recording is never required.
> 
> The teacher chooses the situation, organizes pairs/groups, checks feedback, and decides whether direct student access is permitted in the school-approved environment and mode. If it is not approved, the teacher operates the tool or uses a printed no-AI prompt. Learners must have time to answer one another independently.

**Primární operátor AI:** učitel jako zadavatel a moderátor; žáci spolu komunikují. Přímý dotaz žáků jen po školním schválení.  
**Alternativní způsob použití:** učitel vygeneruje situace předem a vytiskne je; AI se během rozhovoru nepoužívá.  
**Činnost učitele:** připraví dvojice, role, komunikační cíl a čas; rozhodne o přístupu k AI a průběžně ověřuje přiměřenost.  
**Činnost žáka:** vede rozhovor s partnerem, využívá nápovědu a na závěr zopakuje vlastní formulaci.  
**Ověřitelný výsledek:** dvojice splní komunikační úkol v angličtině; každý žák zaznamená jednu frázi, kterou sám použil, a jednu věc k procvičení.  
**Bezpečnost:** Riziko: AI může vytlačit rozhovor mezi žáky; nástroj má jen omezenou podpůrnou roli a existuje varianta bez AI. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 15 min označuje orientační délku párové/skupinové aktivity; rozpis jednotlivých částí nebyl doložen.
**Odlišení:** hlavní komunikační partner je spolužák, AI pouze podpůrná nápověda či zadavatel situace; individual partner je individuální dialog žáka s AI.  
**Pedagogická rozhodnutí:** Jaká míra přímého přístupu je vhodná pro danou třídu? Mají žáci AI vyvolat sami, nebo ve všech případech obsluhuje učitel?

---

## 9. biology-animal-encyclopedia

### Původní záznam z aktuálního masteru

**Název:** Encyklopedie živočichů na míru  
**Popis:** Gemini vytvoří poutavý popis libovolného živočicha přizpůsobený věku žáků – výskyt, potravní řetězec, zajímavosti.  
**Kompletní původní prompt:**
> Vytvoř poutavý profil živočicha [ŽIVOČICH] pro žáky [ROČNÍK]. Uveď vzhled, výskyt, potravu, potravní řetězec, způsob života, ohrožení a pět zajímavostí. Přizpůsob jazyk věku žáků a přidej tři otázky k ověření porozumění.

**Metodický problém:** Aktivita končí převzetím generovaného textu; zdroje, nejistota a ověřování chybí. Údaj o ohrožení je aktuální a může se měnit.  
**Navržený název:** Badatelský profil živočicha
**Navržený popis karty:** Krátký režim (původních 8 min): učitel dodá dva ověřené krátké podklady, žáci porovnají tvrzení a vytvoří stručný profil. Rozšířený režim (orientačně 20–30 min): žáci ověřují informace ve více zdrojích. AI nesmí vymýšlet zdroje ani aktuální údaje o ohrožení.

**Kompletní nový prompt:**
> Jsi průvodce přírodovědným zkoumáním živočicha [ŽIVOČICH] pro žáky [ROČNÍK/VĚK]. Nejdříve se zeptej, zda třída pracuje v krátkém nebo rozšířeném režimu.
> 
> KRÁTKÝ REŽIM – přibližně 8 minut: Učitel dodá dva krátké ověřené podklady [ZDROJ 1] a [ZDROJ 2]. Požádej žáky, aby formulovali vlastní otázku. Pomoz porovnat vybraná tvrzení z obou textů, zaznamenat konkrétní důkaz a označit shodu, rozdíl nebo nejistotu. Žák poté vlastními slovy sestaví stručný profil živočicha s uvedením podkladu u každého ověřeného údaje.
> 
> ROZŠÍŘENÝ REŽIM – orientačně 20–30 minut: Žáci formulují vlastní výzkumnou otázku a vyhledávají/porovnávají informace ve více důvěryhodných zdrojích. Pomáhej jim posuzovat autora či instituci, datum, důkaz a shodu zdrojů. Žáci píší vlastní závěr a rozlišují ověřené údaje, interpretaci a nejistotu.
> 
> Nevymýšlej zdroje, názvy, citace ani odkazy. Nepředstírej, že jsi zdroj otevřel, pokud jeho obsah nebyl dodán. Neuváděj aktuální status ohrožení bez konkrétního aktuálního ověřitelného podkladu; označ jej jako neověřený a požádej o kontrolu u důvěryhodného aktuálního zdroje. Učitel ověřuje vhodnost zdrojů a fakta. Přizpůsob jazyk věku. Nežádej osobní údaje ani žákovské práce.

**Primární operátor AI:** žák nebo dvojice pouze ve schváleném školním prostředí; alternativně učitel promítá otázky.  
**Alternativní způsob použití:** práce s vytištěnými texty, přičemž žáci vyplní srovnávací tabulku bez AI.  
**Činnost učitele:** vybírá vhodné zdroje, kontroluje jejich důvěryhodnost a aktuálnost, zejména u ohrožení druhu.  
**Činnost žáka:** klade otázku, porovná dvě tvrzení, vyhledá textový důkaz, zaznamená nejistotu a vytvoří vlastní profil.  
**Ověřitelný výsledek:** srovnávací tabulka s nejméně dvěma zdroji a vlastní stručný profil, který rozliší doložený údaj od neověřeného.  
**Bezpečnost:** Riziko: smyšlené zdroje a zastaralé údaje o ohrožení; učitel dodá či ověří zdroje, aktuálnost se netvrdí bez dokladu. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 8 min odpovídá krátkému režimu se dvěma učitelem dodanými krátkými ověřenými podklady. Rozšířený režim trvá orientačně 20–30 min.
**Odlišení:** práce s informační gramotností a důkazy ze zdrojů, nikoli pouhé vytvoření encyklopedického profilu.  
**Pedagogická rozhodnutí:** Které typy zdrojů budou pro věk žáků vhodné? Má se aktuální ochrana druhu probírat, pokud učitel nemůže garantovat čerstvost dostupných dat?

---

## 10. math-word-problem-generator

### Původní záznam z aktuálního masteru

**Název:** Generátor slovních úloh  
**Popis:** AI vygeneruje sadu slovních úloh na téma přizpůsobených věku žáků s realistickými kontexty a správnými řešeními.  
**Kompletní původní prompt:**
> Jsi zkušený učitel matematiky. Vygeneruj 10 slovních úloh na téma [TÉMA] pro žáky [ROČNÍK]. Každá úloha musí mít realistický kontext. Uveď správné řešení s postupem.

**Metodický problém:** Chybí přesný cíl, ročník je jediná kontrola přiměřenosti, nevynucuje jednoznačnost, kontrolu výpočtů a oddělení učitelského klíče. Řešení mohou být omylem předána spolu s pracovní verzí žákům.  
**Navržený název:** Generátor slovních úloh pro učitele
**Navržený popis karty:** AI připraví návrhy pro učitele podle cíle, ročníku a čtenářské náročnosti. Učitel samostatně ověří každé zadání, výpočet, jednotku a klíč. Původních 10 min je referenční údaj bez doloženého vymezení; zahrnuje-li kontrolu i úpravy, může být delší.

**Kompletní nový prompt:**
> Jsi asistent učitele matematiky při přípravě návrhů slovních úloh. Cíl: [KONKRÉTNÍ MATEMATICKÝ CÍL]. Ročník: [ROČNÍK]. Předchozí znalosti: [CO JIŽ ŽÁCI PROBRALI]. Počet úloh: [POČET]. Čtenářská náročnost: [STRUČNÁ/OBVYKLÁ/NÁROČNĚJŠÍ]. Bezpečný obecný kontext: [KONTEXT]. Pokud chybí cíl nebo ročník, nejprve se zeptej.
> 
> Nevkládej požadavky na matematické znalosti, které nejsou uvedeny jako předchozí učivo. Každá úloha musí mít jednoznačné zadání, realistické údaje, potřebné jednotky a jasnou vazbu na zadaný cíl. Označ neověřené předpoklady a možné čtenářské obtíže.
> 
> Výstup rozděl do tří oddělených částí:
> A. ŽÁKOVSKÁ VERZE – pouze zadání úloh; bez výsledků, postupů, řešení a nápověd odhalujících odpověď.
> B. UČITELSKÝ KLÍČ – postup a výsledek s jednotkou ke každé úloze; tato část není určena žákům.
> C. KONTROLNÍ SEZNAM – ověř matematickou správnost, výpočty, jednotky, jednoznačnost, realističnost kontextu, čtenářskou náročnost a soulad každé úlohy s cílem. Pokud nemůžeš něco spolehlivě ověřit, označ to místo tvrzení, že je výsledek správný.
> 
> Učitel všechny výpočty a formulace nezávisle zkontroluje a předá žákům pouze ověřenou žákovskou verzi. Nežádej osobní údaje ani práce konkrétních žáků.

**Primární operátor AI:** učitel při tvorbě a kontrole zadání i klíče.  
**Alternativní způsob použití:** učitel po nezávislém ověření vydá pouze část „Žákovské zadání“; přímý žákovský přístup k AI není potřebný.  
**Činnost učitele:** definuje cíl a předchozí znalosti, kontroluje kontext, jednoznačnost, výpočty i jednotky a odděluje klíč.  
**Činnost žáka:** řeší zadání samostatně, vysvětluje postup a kontroluje výsledek zvolenou metodou.  
**Ověřitelný výsledek:** žák vyřeší úlohu odpovídající cíli a vysvětlí postup i jednotku; učitel má samostatně ověřený klíč.  
**Bezpečnost:** Riziko: chybné výpočty, jednotky nebo víceznačná zadání; učitel nezávisle ověří zadání i klíč před použitím. Školní režim a oprávnění k datům/textům posuzuje učitel před použitím; AI nenahrazuje odborné ani bezpečnostní schválení.
**Čas:** Původních 10 min zůstává referenční hodnota, ale její význam (příprava, kontrola či jiný úsek práce) není doložen a vyžaduje budoucí rozhodnutí.
**Odlišení:** tato aktivita připravuje učiteli sadu úloh k přesnému cíli a ročníku; math-real-life-word-problems zůstává beze změny a nadále se soustředí na úlohy z reálných situací pro svůj cílový stupeň.  
**Pedagogická rozhodnutí:** Kolik variant chce učitel? Jak ověřit jazykovou náročnost u vícejazyčných tříd, aniž by se měnil matematický cíl? Má žákovská verze přiřazovat úlohy jednotlivě, nebo jako společnou sadu?

---

## Překryvy, časové a bezpečnostní otázky k posouzení

- Dvě laboratorní aktivity byly záměrně rozlišeny: biologická hypotéza o procesu a omezeních konkrétního modelu versus obecný návrh proměnných a porovnání scénářů. Pedagogové mají potvrdit, zda tato hranice odpovídá dostupným nástrojům a věku žáků.
- Dvojice history-roleplay-classroom a dříve opravená history-roleplay-historical-person obě používají historickou simulaci. Nový návrh vymezuje classroom jako učitelem řízený třídní rozhovor následovaný kontrolou pramenů. U obou musí být fikční povaha trvale viditelná a bez smyšlených autentických citací.
- Dvojice literárních rozborů má nyní rozdíl příprava učitele versus argumentace žáka. Přímé používání chráněných textů v AI vyžaduje vyřešená oprávnění; alternativou je ověřený krátký úryvek nebo učitelem vytvořený podklad.
- Dvojice anglických aktivit se liší individuálním tréninkem podle CEFR versus párovou komunikací, kde AI přichází na řadu jen jako podpůrný zásah. Školní schválení přímého přístupu zůstává podmínkou.
- U biology-animal-encyclopedia se původních 8 min patrně nevztahuje na celé zdrojové zkoumání; u czech-literary-analysis-class původních 10 min přípravy neodpovídá žákovské aktivitě. Duration se nemění, ale před zveřejněním scénářů je třeba rozhodnout, zda čas popisuje přípravu, práci AI nebo práci žáka.
- U history-debate-pro-con se 25 min dá udržet jen při předem dostupných krátkých pramenech. Učitel musí zvážit citlivost a přiměřenost tématu.
- U všech aktivit zůstává nevhodné vydávat AI za důkaz, zdroj, odborné schválení nebo rozhodujícího hodnotitele. Přímý žákovský přístup i zpracování skutečných žákovských prací závisejí na konkrétním školním schválení nástroje, účelu a režimu.

## Zbývající otázky pro pedagogickou revizi

1. Které konkrétní biologické či přírodovědné modely a verze škola ověří pro jednotlivé ročníky? Pokud nejsou k dispozici, aktivita zůstává pouze kvalitativním myšlenkovým experimentem.
2. Jaké jsou přesné časové rozpočty u položek, jejichž původní duration není blíže definováno? Jejich číselné hodnoty se v této změně nemění.
3. Které nástroje, účty a režimy školní pravidla schvalují pro přímé použití žáky, zejména u anglické konverzace?
4. Jaké konkrétní literární ukázky lze v daném nástroji použít v souladu s autorskými právy a podmínkami zpracování?
5. Kdo bude pravidelně ověřovat důvěryhodnost a aktuálnost zdrojů o živočiších, zejména údajů o ochraně druhů?
6. Jak bude učitel v praxi ověřovat přiměřenost jazykové náročnosti odpovědí AI pro CEFR A1–B2?


## Rozsah a stav

Pedagogická rozhodnutí jsou zapracována do `data/activities.json` a vygenerovaných HTML stránek pro přesně deset ID. Tento dokument zachovává původní problémy a zdůvodnění a zaznamenává finální implementované prompty, výsledky, rizika, časová rozhodnutí i zbývající otázky. ID, statusy, původní hodnoty `duration`, pořadí aktivit a registr 204 promptů se nemění. PR #34 zůstává draftem; nic nebylo sloučeno ani nasazeno do produkce.


## Dokončení QA bez závislosti na Netlify DNS – 2026-11-06

### A. Lokální aplikace

- Testovaný obsahový commit: `8d5ad5388da2a1bc81c7251c211d7d2f609a3693`. Přes `git fetch origin pull/34/head` byl ověřen stejný SHA ve `FETCH_HEAD`. Sedm lokálních HTML/JSON souborů odpovídá tomuto obsahu; jediný rozdíl jsou závěrečné prázdné řádky (bez obsahového rozdílu).
- Server: Python `http.server` na `http://127.0.0.1:8765`; samostatný Node.js v24.11.1 + Playwright proces a Chromium Headless Shell 151.0.7922.34. Clipboard API běželo na loopback originu, nikoli přes `file://`.
- Oba skutečné viewporty: 390 × 844 px a 1440 × 900 px. `window.innerWidth/innerHeight` odpovídaly přesně; `documentElement` i `body` měly stejné `scrollWidth` jako viewport, bez horizontálního přetečení.
- Před navigací byly připojeny posluchače `pageerror`, `console.error`, neúspěšných síťových požadavků a HTTP chyb JavaScriptů. Výsledek: 0 `pageerror`, 0 chyb konzole, 0 selhání kritických skriptů.
- V každém viewportu bylo otevřeno všech deset aktivit třetí vlny. Názvy karet a detailů, celý text promptu v detailu a prompt v `data/activities.json` souhlasily. Escape zavřel detail a fokus se vrátil na otevírací tlačítko.
- Skutečná schránka byla po každém kliknutí přečtena přes `navigator.clipboard.readText()`: 20/20 čtení (10 aktivit × 2 viewports) souhlasilo s úplným promptem. Windows převedl LF na CRLF; při porovnání byla normalizována pouze tato forma konců řádků. Obsah odstavců, diakritika, první i poslední znak zůstaly shodné. Aplikace nemá záložní kopírovací metodu; systémové Clipboard API uspělo.
- Kombinované filtrování podle předmětu, ročníku a nástroje bylo v obou viewports porovnáno s očekáváním odvozeným přímo z registru karet. Filtr Matematika + 1.–5. ročník + ChatGPT zobrazil jedinou odpovídající aktivitu `math-word-problem-generator`.
- Tři regresní aktivity z předchozích vln (`math-statistics-analysis`, `history-source-analysis`, `general-prompt-power-up-relay`) prošly v obou viewports kontrolou úplného promptu, otevření/zavření a návratu fokusu: 6/6.

### B. Validace a zachované invarianty

- `node scripts/generate-activities.js --check`: 44 aktivit, drift 0; ID unikátní a pořadí odpovídá masteru.
- `node scripts/generate-prompts.js --check`: samostatný registr 204 promptů, drift 0.
- `node scripts/validate-content.js`: 76 článků, 0 chyb a 0 varování.
- `node scripts/check-site-footer.js`: 102 relevantních HTML souborů prošlo.
- `node --check` pro 23 JavaScript souborů: vše prošlo.
- `git diff --check`: prošel; upozornění LF/CRLF je pouze formátovací a nevytváří obsahovou změnu. Zachováno 14 doporučených aktivit, statusy a původní délky aktivit, předchozí opravené vlny i zbývajících 14 nezměněných aktivit.

### C. Nasazení a veřejné preview

- Netlify deploy `6aee30d770841d765d38c980` byl ve stavu `ready` a jeho `commit_ref` odpovídal testovanému obsahu `8d5ad5388da2a1bc81c7251c211d7d2f609a3693`.
- Samostatné načtení veřejného Deploy Preview v předchozím běhu nebylo možné kvůli `ERR_NAME_NOT_RESOLVED`; tento browserový test zůstává neprovedený. Lokální Playwright test ověřuje aplikaci z lokální kopie a sám o sobě nedokazuje dostupnost veřejného preview.
- Toto QA neprovádělo produkční deploy ani sloučení PR. Po dokumentačním commitu `f6eae8f806e0e1365189660f76b689ceb00ea4e2` byl nový Deploy Preview `6aee3bf6d4643d2737280b82` ověřen jako `ready`; jeho `commit_ref` přesně odpovídal tomuto HEAD. Tato dokumentační aktualizace sama vyvolá další dokumentační-only deploy, jehož HEAD se znovu ověří před označením PR jako Ready for review.
