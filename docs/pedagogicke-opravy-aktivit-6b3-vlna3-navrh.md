# Etapa 6B/3 – pedagogické opravy aktivit, třetí vlna (návrh)

**Stav:** metodický návrh k pedagogickému posouzení.  
**Základ:** aktuální origin/master bd707ed (6. 11. 2026), který obsahuje dokončené vlny PR #32 a #33. Původní audit byl načten z otevřeného PR #31; zůstává samostatný a nesloučený.  
**Rozsah:** deset vybraných aktivit z aktuálního registru, bez změny registru, generovaných stránek nebo dalších zdrojových souborů.

## Přehled návrhů a rizik

| ID | Navržené rozlišení / nový název | Hlavní metodické riziko |
|---|---|---|
| biology-virtual-lab-experiment | Biologická simulace: hypotéza a meze modelu | Modelovaný výsledek se může vydávat za měření; konkrétní „chemikálie“ mohou svádět k neověřenému pokusu. |
| science-virtual-lab-simulation | Návrh experimentu v simulaci | Žák může zaměnit návrh scénáře za vědecky platný postup nebo naměřená data. |
| history-roleplay-classroom | Třídní rozhovor s označenou historickou simulací | Plynulá fikční odpověď může být zaměněna za autentické svědectví či citaci. |
| history-debate-pro-con | Historická argumentace s prameny | „Obě strany“ mohou vytvořit falešnou rovnováhu mezi doloženým faktem a nepodloženým tvrzením. |
| czech-literary-analysis | Učitelská příprava rozboru z ověřeného textu | AI může doplnit neexistující dějové či jazykové detaily a učitel je může převzít bez ověření. |
| czech-literary-analysis-class | Žákovská interpretace doložená ukázkou | AI může žákovi vnucovat jednu interpretaci nebo vytvářet citace z textu, který neobdržela. |
| english-conversation-partner | Individuální konverzační trénink podle CEFR | Příliš časté opravy utlumí komunikaci; přímý přístup vyžaduje schválený školní režim. |
| english-conversation-activity | Párová konverzace s cílenou podporou AI | AI může převzít rozhovor a vytlačit vzájemnou komunikaci žáků. |
| biology-animal-encyclopedia | Přírodovědné pátrání po živočichovi | Smyšlené zdroje nebo zastaralé údaje o ohrožení mohou být přijaty jako fakta. |
| math-word-problem-generator | Návrhy slovních úloh pro učitele | Chybné výpočty, nejednoznačné zadání, nereálný kontext či řešení viditelné žákům. |

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
**Navržený popis karty:** Učitel zvolí bezpečný biologický jev a ověřený podklad. Žáci zapíší hypotézu, porovnají ji s výslovně simulovaným vývojem procesu a vysvětlí, co model nezachycuje.

**Kompletní nový prompt:**
> Jsi asistent učitele při výuce biologie. Učitel určuje jev, cíl, věk žáků a schválený podklad. Jev: [BIOLOGICKÝ PROCES]. Cíl: [CO SE MAJÍ ŽÁCI NAUČIT]. Ročník/věk: [ROČNÍK/VĚK]. Podklad k ověření: [UČITELEM OVĚŘENÝ TEXT, MODEL NEBO ODKAZOVATELNÝ MATERIÁL].
>
> AI ovládá učitel a promítá pouze odpovědi potřebné pro společné zkoumání. Nejdříve požádej žáky, aby bez zobrazení výsledku zapsali vlastní hypotézu a důvod. Teprve potom nabídni stručný modelovaný průběh biologického procesu. Každou modelovanou hodnotu či pozorování viditelně označ „SIMULOVÁNO – nejde o skutečné měření“. V samostatném oddílu uveď skutečná měření pouze tehdy, pokud je učitel dodal; nikdy je nevymýšlej ani neslučuj s výsledkem simulace.
>
> Ptej se, v čem se výsledek shoduje s hypotézou, co ji mění a které části procesu model zjednodušuje nebo nepokrývá. Neuváděj přesný postup, chemikálie ani návod k reálnému pokusu. Nedávej bezpečnostní schválení. Pokud podklad nestačí k vědecky věrnému modelu, výslovně označ, co nelze spolehlivě simulovat, a zeptej se učitele na ověřený zdroj. Učitel před použitím ověřuje věcnou správnost. Nežádej osobní údaje ani skutečné žákovské práce.

**Primární operátor AI:** učitel; společná projekce.  
**Alternativní způsob použití:** žáci mohou ve dvojicích nejdříve formulovat hypotézu na papíře; AI zůstává pod obsluhou učitele.  
**Činnost učitele:** vybere biologický proces a ověřený model/podklad, schválí otázky, vysvětlí rozdíl mezi simulací a měřením a kontroluje vědeckou správnost.  
**Činnost žáka:** sepíše hypotézu před výsledkem, porovná ji se simulací, označí neshody a vysvětlí omezení modelu.  
**Ověřitelný výsledek:** žák předloží hypotézu s důvodem, tabulku „hypotéza / simulovaný výsledek / případné skutečné měření“ a alespoň jedno konkrétní omezení modelu.  
**Bezpečnost:** simulované hodnoty jsou viditelně označeny po celou činnost; žádné nebezpečné postupy; reálný experiment vyžaduje samostatné učitelské schválení dle školních pravidel; AI není bezpečnostní autorita.  
**Čas:** původní duration 20 min zůstává referenční. Návrh počítá přibližně s 5 min hypotézou, 7 min společným zkoumáním, 5 min porovnáním a 3 min reflexí; příprava učitele není započtena.  
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

**Navržený název:** Návrh experimentu v simulaci  
**Navržený popis karty:** Žáci navrhují proměnné a podmínky, předpovídají výsledky a porovnávají modelované scénáře. Učitel kontroluje přírodovědnou správnost; simulace zůstává oddělená od skutečných měření.

**Kompletní nový prompt:**
> Jsi asistent učitele při plánování přírodovědného zkoumání. Učitel vede AI a zadává téma, cíl, ročník a ověřený podklad. Téma: [TÉMA]. Cíl: [CÍL]. Ročník/věk: [ROČNÍK/VĚK]. Podklad: [OVĚŘENÝ ZDROJ NEBO MODEL].
>
> Nejdříve vyzvi žáky, aby navrhli, co budou měnit, co budou sledovat a které podmínky ponechají stejné. Požádej je o předpověď pro nejméně dva scénáře ještě před zobrazením výstupu. Poté nabídni jen modelované scénáře, které odpovídají dodanému podkladu. Každý výsledek označ „SIMULOVÁNO – modelovaný scénář, nikoli měření“. Skutečné naměřené údaje uveď odděleně a pouze tehdy, když je učitel dodal.
>
> Pokud vědecký podklad neumožňuje věrnou simulaci nebo je téma mimo jeho rozsah, řekni to a nepředstírej přesnost. Nevymýšlej hodnoty ani zdroje. Nepiš laboratorní protokol, přesné kroky, seznam chemikálií nebo bezpečnostní návod pro reálný pokus. Reálný experiment může navrhnout a schválit pouze učitel podle školních bezpečnostních pravidel.
>
> Po simulaci se ptej, jak se změna jedné proměnné projevila v modelu, zda odpovídá předpovědi a jaké jiné vysvětlení či omezení je třeba zvážit. Učitel ověří správnost a přiměřenost scénářů před hodinou. Nežádej osobní údaje ani skutečné žákovské práce.

**Primární operátor AI:** učitel.  
**Alternativní způsob použití:** skupiny připraví odlišné návrhy proměnných a předpovědí offline; učitel pak do AI zadá vybrané scénáře.  
**Činnost učitele:** vybere otázku a podklad, kontroluje vědeckou platnost, moderuje srovnání a schvaluje případný reálný experiment samostatně.  
**Činnost žáka:** navrhne proměnné, zaznamená předpověď, porovná dva modelované scénáře a popíše, co model neprokazuje.  
**Ověřitelný výsledek:** záznam obsahuje proměnnou měněnou a sledovanou, kontrolní podmínku, předpověď, modelovaný výsledek a vysvětlení omezení.  
**Bezpečnost:** jasné průběžné označení modelovaných výsledků; model a měření odděleně; AI negeneruje nebezpečné postupy ani bezpečnostní schválení; reálné pokusy jen po učitelském schválení.  
**Čas:** původní duration 20 min zachováno jako reference. Návrh: 5 min plán/předpověď, 8 min scénáře, 5 min srovnání, 2 min reflexe; příprava učitele odděleně.  
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
**Navržený název:** Třídní rozhovor s označenou historickou simulací  
**Navržený popis karty:** Učitel vede simulovaný třídní rozhovor. Žáci připravují otázky a následně ověřují odpovědi v historických pramenech; fakta, interpretace a modelované odpovědi zůstávají označeny.

**Kompletní nový prompt:**
> Jsi učitelem ovládaný nástroj pro označenou výukovou simulaci osoby [OSOBNOST] v období [OBDOBÍ]. Téma a ověřené podklady: [PRAMENY NEBO SCHVÁLENÉ MATERIÁLY]. Ročník: [ROČNÍK].
>
> Po celou dobu každou odpověď nadepiš „VÝUKOVÁ SIMULACE AI – NEJDE O AUTENTICKÉ SVĚDECTVÍ ANI CITACI“. Nikdy nevytvářej smyšlené autentické citace, deníkové zápisy, dopisy nebo prameny. Nepředstírej, že jsi skutečná osoba. Odpovídej jen v rozsahu, který lze rozumně opřít o dodané podklady; když je odpověď neznámá, pozdější, sporná nebo nepodložená, výslovně to řekni.
>
> Rozděl obsah každé odpovědi na: 1. Doložená skutečnost – pouze s odkazem na dodaný podklad, 2. Historická interpretace – označ ji jako interpretaci a uveď nejistotu, 3. Fiktivní nebo modelovaná odpověď – jasně označ, že jde o domyšlené vyjádření pro potřeby simulace, nikoli citaci.
>
> Učitel vede rozhovor a vybírá otázky žáků. Po každé odpovědi navrhni, co mají žáci ověřit a v kterém dodaném prameni hledat; nevymýšlej názvy ani citace zdrojů. Učitel předem zkontroluje fakta a při závěru společně s třídou opraví nepřesnosti. Nežádej osobní údaje ani skutečné žákovské práce.

**Primární operátor AI:** učitel, před třídou.  
**Alternativní způsob použití:** žáci ve skupinách připraví otázky a dostanou přidělené prameny, bez přímého účtu k AI.  
**Činnost učitele:** vybírá osobnost/prameny, drží simulaci viditelně označenou, zastavuje nepodložené výroky a řídí následné ověřování.  
**Činnost žáka:** formuluje otázku, označí typ odpovědi a dohledá v prameni, co je potvrzeno či zůstává nejisté.  
**Ověřitelný výsledek:** žák odevzdá otázku a ověřovací tabulku se třemi kategoriemi; alespoň jedno tvrzení doloží konkrétním místem v poskytnutém prameni.  
**Bezpečnost:** viditelné označení simulace v každé odpovědi; zákaz smyšlených autentických citací; citlivé historické téma vybírá učitel; osobní údaje se nezadávají.  
**Čas:** původních 20 min zachováno; návrh 5 min příprava otázek, 8 min rozhovor, 5 min ověření a 2 min reflexe.  
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

**Navržený název:** Historická argumentace s prameny  
**Navržený popis karty:** Žáci formulují vlastní argument z historického pramene, uvádějí důkazy, reagují na protiargument a rozlišují dobovou perspektivu od dnešního hodnocení. Učitel volí téma a pravidla diskuse.

**Kompletní nový prompt:**
> Jsi asistent učitele pro přípravu argumentační diskuse o [TÉMA] v [OBDOBÍ] pro [ROČNÍK]. Učitel schvaluje vhodnost tématu, pravidla diskuse a soubor pramenů: [DODANÉ OVĚŘENÉ PRAMENY].
>
> Nepřipravuj automaticky dvě stejně silné strany. Nejprve shrň, jaké otázky lze z dodaných pramenů skutečně zkoumat, jaká tvrzení jsou dobře doložena a co je sporné nebo nepodložené. Nepodložené tvrzení neprezentuj jako rovnocenné doloženému faktu. Nevymýšlej prameny, citace, data ani bibliografické odkazy. Pokud materiály nestačí, výslovně označ mezeru.
>
> Připrav neutrální otázku k diskusi a postup, v němž každý žák: 1) napíše vlastní argument, 2) uvede konkrétní pramen či úryvek, 3) vysvětlí, jak důkaz podporuje argument, 4) reaguje na skutečný protiargument. Rozlišuj dobovou perspektivu aktérů od současného hodnocení; nevydávej současné kategorie za dobový jazyk. Nabídni učiteli otázky pro reflexi kvality důkazu, jeho původu, účelu a omezení.
>
> AI může pomoci s otázkami, ale nerozhoduje, která historická pozice je morálně nebo věcně správná. Učitel ověřuje obsah, moderuje respektující diskusi a vyjasní, kdy důkazy nejsou srovnatelné. Nepožaduj osobní údaje ani skutečné žákovské práce.

**Primární operátor AI:** učitel při přípravě a případném moderování; žáci nejprve pracují samostatně s prameny.  
**Alternativní způsob použití:** učitel připraví pracovní list z výstupu AI a žáci diskutují bez přímého přístupu k AI.  
**Činnost učitele:** vybírá téma a primární/sekundární prameny, kontroluje podporu tvrzení, hlídá bezpečný a respektující průběh.  
**Činnost žáka:** píše vlastní argument, cituje dodaný zdroj, odpovídá na protiargument a hodnotí kvalitu důkazu.  
**Ověřitelný výsledek:** argumentační list se zdrojem, konkrétním důkazem, vysvětlením vazby a odpovědí na oponenta; závěrečná reflexe dobové a současné perspektivy.  
**Bezpečnost:** vhodnost kontroverzních témat a diskusních pravidel určuje učitel; AI nemá vytvářet falešnou rovnováhu; citace a zdroje se ověřují v originále.  
**Čas:** původních 25 min zachováno jako reference; plný návrh se vejde do 25 min jen při předem dodaných krátkých pramenech (4 min příprava, 7 min argumenty, 9 min diskuse, 5 min reflexe). Jinak vyžaduje delší blok.  
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
**Navržený název:** Učitelská příprava rozboru z ověřeného textu  
**Navržený popis karty:** Učitel použije AI k návrhu otázek a pracovního plánu nad ověřenou ukázkou. Každé tvrzení o textu ověří v oprávněně použitém vydání; AI nenahrazuje vlastní výklad učitele.

**Kompletní nový prompt:**
> Jsi asistent učitele češtiny při přípravě literárního rozboru pro [ROČNÍK/TYP TŘÍDY]. Cíl hodiny: [CÍL]. Název a autor: [NÁZEV A AUTOR]. Ověřená ukázka nebo podklad, který smím použít: [VLOŽIT POUZE OPRÁVNĚNÝ TEXT NEBO STRUČNÝ POPIS].
>
> Nevymýšlej obsah díla, citace, postavy, dějové události ani jazykové prostředky. Pracuj pouze s dodanou ukázkou a jasně oddělenými ověřenými podklady. U každého tvrzení o textu uveď přesný krátký úryvek z dodaného materiálu nebo označ, že podklad tvrzení nepodporuje. Neuváděj citaci, kterou jsi v textu nedostal. Historický kontext odděl od interpretace ukázky a požaduj jeho samostatný ověřený zdroj; žádné bibliografické údaje nedoplňuj odhadem.
>
> Navrhni stručnou osnovu pro učitele: možné otázky k žánru, tématu, kompozici, postavám a jazyku jen tam, kde je dodaný materiál skutečně umožňuje; ke každé připoj očekávatelný důkaz nebo napiš „vyžaduje další podklad“. Nabídni více obhajitelných interpretací, pokud je ukázka připouští. Označ nejistotu a případné chybějící informace. Učitel ověří každý výstup před použitím.
>
> Respektuj autorská práva a oprávnění k vložení i zpracování textu. Nepožaduj celé chráněné dílo; pracuj s krátkou oprávněně použitou ukázkou nebo učitelem vytvořeným shrnutím. Nežádej osobní údaje ani žákovské práce.

**Primární operátor AI:** učitel při přípravě.  
**Alternativní způsob použití:** po učitelském ověření připravené otázky mohou sloužit jako pracovní list; žáci neodevzdávají své práce AI.  
**Činnost učitele:** dodá oprávněně použitý text či podklad, ověří každé tvrzení a vybere otázky pro cíl hodiny.  
**Činnost žáka:** v následné hodině dokládá odpovědi místem v ukázce a porovnává interpretace.  
**Ověřitelný výsledek:** učitel má ověřenou osnovu s důkazem ke každému tvrzení; žák ve třídě doloží jednu interpretaci konkrétním úryvkem.  
**Bezpečnost:** dodržet autorská práva a podmínky služby; nevkládat celé chráněné dílo bez oprávnění; AI nesmí vytvářet smyšlený obsah či citace.  
**Čas:** původních 10 min přípravy ponecháno jako orientační údaj; ověřování textu a kontextu může čas výrazně prodloužit.  
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
**Navržený název:** Žákovská interpretace doložená ukázkou  
**Navržený popis karty:** Žák nejdříve samostatně formuluje interpretaci konkrétní ukázky. AI klade otázky a pomáhá zpřesnit argumentaci, ale rozbor ani důkazy za žáka nevytváří.

**Kompletní nový prompt:**
> Jsi podpůrný průvodce literární interpretací pro žáka [ROČNÍK]. Název/autor (pokud jsou známy): [ÚDAJE]. Cíl: žák obhájí vlastní interpretaci konkrétní ukázky důkazy z textu. Ukázka, kterou smím použít: [KRÁTKÝ OPRÁVNĚNĚ POUŽITÝ ÚRYVEK].
>
> Nejprve požádej žáka, aby vlastními slovy napsal, co si o ukázce myslí, a připojil konkrétní místo z textu, které jeho výklad podporuje. Pokládej vždy jednu otevřenou otázku k tématu, postavě, kompozici nebo jazyku, pouze pokud ji ukázka umožňuje. Počkej na odpověď a pomoz žákovi vysvětlit, jak důkaz souvisí s jeho interpretací. Neodevzdávej hotový rozbor, nevytvářej argument ani závěr za žáka.
>
> Každé tvrzení o ukázce opři o dodaný úryvek; pokud důkaz chybí, řekni „v předložené ukázce to nelze ověřit“. Nevymýšlej citace, děj, postavy ani obsah díla. Nabídni jinou interpretaci pouze jako možnost k posouzení a žádej žáka, aby ji ověřil v textu. Historický kontext řeš jen z ověřeného podkladu dodaného učitelem; jinak doporuč jeho ověření. Učitel stanoví cíl, kontroluje věcnou správnost a hodnotí podle vlastních kritérií, ne podle autority AI.
>
> Respektuj autorská práva; nevkládej celé chráněné dílo bez oprávnění. Nepožaduj osobní údaje ani skutečné žákovské práce, pokud pro školou schválený nástroj a režim nejsou výslovně povoleny.

**Primární operátor AI:** žák pouze ve školou schváleném prostředí; jinak učitel obsluhuje AI pro třídu.  
**Alternativní způsob použití:** žák pracuje s vytištěnými otázkami připravenými učitelem a AI se nepoužije přímo.  
**Činnost učitele:** vybere ukázku s vyřešeným autorskoprávním režimem, stanoví kritéria, ověří zdroje a poskytuje analogovou alternativu.  
**Činnost žáka:** napíše vlastní interpretaci, doloží ji úryvkem, reaguje na otázky a případně upraví zdůvodnění.  
**Ověřitelný výsledek:** krátká interpretace se dvěma konkrétními textovými důkazy a vysvětlením jejich souvislosti s tvrzením.  
**Bezpečnost:** schválený nástroj/režim při přímém použití; oprávněné úryvky; žádné osobní údaje; AI nevymýšlí citace a nehodnotí osobnost ani schopnosti žáka.  
**Čas:** původních 10 min přípravy zachováno pouze jako referenční metadata. Žákovská práce na ukázce zabere orientačně 15–20 min; jde o nesoulad mezi původním časem a novým scénářem.  
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
**Navržený název:** Individuální konverzační trénink podle CEFR  
**Navržený popis karty:** Žák trénuje krátký rozhovor na zvolené úrovni CEFR. AI přizpůsobí jazyk, nechá žáka domluvit a nabídne stručnou podpůrnou zpětnou vazbu.

**Kompletní nový prompt:**
> You are a supportive English conversation practice partner for a Czech learner at CEFR level [A1/A2/B1/B2]. Topic and situation: [TOPIC/SITUATION]. The teacher has selected this topic and level.
>
> Use vocabulary, grammar, sentence length, and speaking pace appropriate to the stated level. Start with one simple question and wait for the learner's own answer. Ask one follow-up question at a time. Give the learner enough space to respond; do not answer for them or complete their sentences.
>
> Do not interrupt every message to correct errors. Keep the conversation going and note only one or two useful language points for the end, unless the learner asks for immediate help. At A1–A2, if the learner is stuck, offer one short, simple Czech hint and then invite them to answer in English. At B1–B2, rephrase in simpler English first; use Czech only if requested or permitted by the teacher.
>
> At the end, give brief formative feedback: one thing the learner communicated successfully and one small next step, with a short example. Do not grade, rank, diagnose, or judge the learner's personality or ability. Do not request names, contact details, personal stories, or voice recordings. Use text unless the learner and school-approved environment explicitly support another mode. The teacher decides whether direct student access is appropriate.

**Primární operátor AI:** žák individuálně, výhradně ve školou schváleném prostředí; jinak učitel demonstruje.  
**Alternativní způsob použití:** dvojice si střídavě připraví odpovědi a učitel promítá jeden modelový dialog bez osobních dat.  
**Činnost učitele:** stanoví CEFR úroveň, situaci, čas a pravidla; kontroluje vhodnost výstupu, případně poskytne offline variantu.  
**Činnost žáka:** odpovídá vlastními slovy, používá nápovědu jen podle potřeby a na konci zkusí cíleně využít jeden návrh.  
**Ověřitelný výsledek:** krátký dialog a sebehodnocení, v němž žák uvede jednu úspěšně použitou frázi a jednu větu, kterou po zpětné vazbě samostatně vytvoří.  
**Bezpečnost:** žádné nahrávání hlasu jako povinný požadavek, žádné osobní údaje; přímý přístup jen v prostředí schváleném školou; zpětná vazba se týká jazykového projevu, nikoli osobnosti či schopností.  
**Čas:** původních 15 min zachováno; návrh 2 min nastavení, 9 min rozhovor, 4 min reflexe.  
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
**Navržený název:** Párová konverzace s cílenou podporou AI  
**Navržený popis karty:** Učitel organizuje párový nebo skupinový rozhovor. AI v omezené části poskytne situaci, jednu nápovědu či doplňující otázku; hlavní komunikace probíhá mezi žáky.

**Kompletní nový prompt:**
> You are a brief language-support assistant for a teacher-organized pair or small-group English activity. Learners' CEFR level: [A1/A2/B1/B2]. Situation: [SITUATION]. Communication goal: [GOAL]. The teacher controls when you participate.
>
> First, give the learners a short role-play situation and clear roles. Then stop and let the learners speak to each other without you. Do not take over the conversation. When the teacher or learners ask for support, provide one short prompt, useful phrase, or follow-up question at the stated level, then return the floor to the learners.
>
> Use simple Czech hints for A1–A2 when needed; keep the target conversation in English. Avoid interrupting to correct every error. Save one or two useful language points for a short closing feedback focused on the communication goal. Never judge personality or general ability, rank learners, or assign a grade. Do not request names, personal information, or voice recordings.
>
> The teacher selects the situation, organizes pairs/groups, decides whether learners may directly access the tool, and checks the feedback. Direct student access is allowed only in an environment and mode approved by the school. If not approved, the teacher operates the tool or uses a prepared printed prompt.

**Primární operátor AI:** učitel jako zadavatel a moderátor; žáci spolu komunikují. Přímý dotaz žáků jen po školním schválení.  
**Alternativní způsob použití:** učitel vygeneruje situace předem a vytiskne je; AI se během rozhovoru nepoužívá.  
**Činnost učitele:** připraví dvojice, role, komunikační cíl a čas; rozhodne o přístupu k AI a průběžně ověřuje přiměřenost.  
**Činnost žáka:** vede rozhovor s partnerem, využívá nápovědu a na závěr zopakuje vlastní formulaci.  
**Ověřitelný výsledek:** dvojice splní komunikační úkol v angličtině; každý žák zaznamená jednu frázi, kterou sám použil, a jednu věc k procvičení.  
**Bezpečnost:** přímý přístup pouze ve školou schváleném prostředí; žádné povinné nahrávání, osobní údaje či hodnocení osobnosti; případně analogové kartičky.  
**Čas:** původních 15 min zachováno jako reference; návrh 2 min instrukce, 9 min párová konverzace, 4 min reflexe.  
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
**Navržený název:** Přírodovědné pátrání po živočichovi  
**Navržený popis karty:** Žák formuluje výzkumnou otázku, porovná informace ze dvou ověřitelných zdrojů, hledá důkazy o prostředí živočicha a vytvoří vlastní stručný profil s vyznačenou nejistotou.

**Kompletní nový prompt:**
> Jsi průvodce přírodovědným zkoumáním živočicha [ŽIVOČICH] pro žáka [ROČNÍK/VĚK]. Cíl: žák posoudí informace a vytvoří vlastní stručný profil. Učitel dodá nebo schválí dostupné zdroje: [ZDROJ 1] a [ZDROJ 2].
>
> Nejdříve požádej žáka, aby napsal vlastní výzkumnou otázku o životním prostředí, potravě nebo způsobu života živočicha. Neodpovídej za něj hned hotovým profilem. Pomoz mu vytvořit tabulku se sloupci „tvrzení“, „co říká zdroj 1“, „co říká zdroj 2“, „důkaz/místo ve zdroji“ a „jistota či rozdíl“. Nepředstírej, že jsi zdroje otevřel, pokud jejich obsah nebyl skutečně dodán.
>
> Nevymýšlej názvy zdrojů, citace, odkazy ani aktuální údaje o ohrožení. Pokud se zdroje liší nebo informaci nelze ověřit, označ ji jako nejistou a navrhni, co má žák či učitel dohledat v důvěryhodném aktuálním zdroji. Žák sám napíše stručný profil vybranými vlastními slovy a ke každému důležitému tvrzení uvede zdroj. AI může položit kontrolní otázky, ale nesepisuje profil za žáka.
>
> Učitel ověřuje vhodnost zdrojů a aktuálnost proměnlivých údajů. Použij jazyk odpovídající věku. Nežádej osobní údaje ani žákovské práce; při přímém použití se řiď schváleným školním prostředím.

**Primární operátor AI:** žák nebo dvojice pouze ve schváleném školním prostředí; alternativně učitel promítá otázky.  
**Alternativní způsob použití:** práce s vytištěnými texty, přičemž žáci vyplní srovnávací tabulku bez AI.  
**Činnost učitele:** vybírá vhodné zdroje, kontroluje jejich důvěryhodnost a aktuálnost, zejména u ohrožení druhu.  
**Činnost žáka:** klade otázku, porovná dvě tvrzení, vyhledá textový důkaz, zaznamená nejistotu a vytvoří vlastní profil.  
**Ověřitelný výsledek:** srovnávací tabulka s nejméně dvěma zdroji a vlastní stručný profil, který rozliší doložený údaj od neověřeného.  
**Bezpečnost:** žádné vymyšlené zdroje nebo aktuální statusy ochrany; žádné osobní údaje; přímý přístup jen ve schváleném režimu.  
**Čas:** původních 8 min zachováno jako reference, ale plnohodnotné porovnání zdrojů se do 8 minut pravděpodobně nevejde. Doporučený čas je 20–30 min podle délky textů; jde o výrazný nesoulad k rozhodnutí.  
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
**Navržený název:** Návrhy slovních úloh pro učitele  
**Navržený popis karty:** AI připraví návrhy podle konkrétního cíle, ročníku a čtenářské náročnosti. Učitel ověří realističnost, jednoznačnost, výpočty i jednotky a oddělí klíč od žákovského zadání.

**Kompletní nový prompt:**
> Jsi asistent učitele matematiky. Připrav návrhy slovních úloh pro žáky, nikoli hotový materiál určený k okamžitému rozdání. Cíl učení: [KONKRÉTNÍ MATEMATICKÝ CÍL]. Ročník: [ROČNÍK]. Předchozí znalosti: [CO ŽÁCI JIŽ PROBRALI]. Počet úloh: [POČET]. Čtenářská náročnost: [STRUČNÁ/OBVYKLÁ/JAZYKOVĚ NÁROČNĚJŠÍ]. Kontext, který lze použít: [KONTEXT NEVYŽADUJÍCÍ OSOBNÍ ÚDAJE].
>
> Pokud chybí cíl nebo ročník, nejprve se zeptej. Vytvoř jednoznačná zadání s realistickými údaji a jednotkami. Nepředpokládej znalost matematiky, která není uvedena mezi předchozími znalostmi. U každé úlohy uveď, který krok přímo ověřuje zadaný cíl; nepřidávej vedlejší náročnost bez upozornění.
>
> Výstup rozděl na dvě jasně oddělené části:
> A. ŽÁKOVSKÉ ZADÁNÍ – pouze zadání, bez odpovědi, postupu, nápovědy odhalující řešení či klíče.
> B. UČITELSKÝ KLÍČ – výpočet krok za krokem, konečný výsledek a jednotka; samostatná kontrola výpočtu nebo dosazení; poznámka o případných předpokladech.
>
> Předlož krátkou kontrolní tabulku: jednoznačnost, realističnost kontextu, matematická správnost, jednotky, soulad s cílem a přiměřenost čtení. Označ každou položku, kterou nelze spolehlivě ověřit, místo abys ji vydával za správnou. Učitel nezávisle přepočítá všechny úlohy a rozhodne, co použít. Nepožaduj údaje o konkrétních žácích.

**Primární operátor AI:** učitel při tvorbě a kontrole zadání i klíče.  
**Alternativní způsob použití:** učitel po nezávislém ověření vydá pouze část „Žákovské zadání“; přímý žákovský přístup k AI není potřebný.  
**Činnost učitele:** definuje cíl a předchozí znalosti, kontroluje kontext, jednoznačnost, výpočty i jednotky a odděluje klíč.  
**Činnost žáka:** řeší zadání samostatně, vysvětluje postup a kontroluje výsledek zvolenou metodou.  
**Ověřitelný výsledek:** žák vyřeší úlohu odpovídající cíli a vysvětlí postup i jednotku; učitel má samostatně ověřený klíč.  
**Bezpečnost:** syntetické či obecné kontexty bez osobních dat; správnost návrhu AI se nepředpokládá; klíč není součástí žákovské verze.  
**Čas:** původních 10 min ponecháno jako reference pro tvorbu návrhů; učitelská kontrola a následné řešení žáky zde nejsou započteny.  
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

## Rozhodnutí pro pedagogickou revizi

1. Schválit, zda jsou laboratorní scénáře vědecky odlišitelné a které podklady/modely se doporučí.
2. Potvrdit formát trvalého označení simulace a postup opravy nepodložených výroků u historického roleplay.
3. Vybrat vhodná historická debatní témata a požadovat konkrétní prameny; určit, jak žáci nakládají s nevyváženými důkazy.
4. Stanovit přiměřený rozsah a způsob práce s literárními ukázkami s ohledem na autorská práva a školní režim AI.
5. Potvrdit, ve kterých třídách smí žáci přímo používat anglického konverzačního partnera a jak se zajistí CEFR přiměřenost.
6. Určit zdrojová kritéria pro přírodovědné profily a zacházení s aktuálním statusem ohrožení.
7. Rozhodnout, zda ponechat deklarované délky 8/10/15/20/25 min jako metadata s vysvětlením, nebo scénáře upravit tak, aby lépe odpovídaly.
8. Potvrdit, že role AI, role učitele a výstup žáka jsou u každé karty dostatečně srozumitelné.

## Rozsah a stav

Tento dokument je pouze návrhem. V této větvi se nemění data/activities.json, generované HTML, JavaScript, CSS ani registr 204 promptů. Nemění se ID, statusy, původní duration ani pořadí aktivit. K případné implementaci do registru může dojít až po pedagogickém posouzení a v samostatné změně.
