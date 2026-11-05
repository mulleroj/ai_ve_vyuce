# Pedagogické opravy aktivit – etapa 6B/2, vlna 1

**Stav:** návrhy k pedagogickému schválení v samostatném draft PR. Žádná změna není schválením školního datového režimu, automatického známkování ani použití se žáky bez pedagogického dohledu.

**Rozsah:** přesně 10 aktivit; zachováno všech 44 stabilních ID, jejich pořadí, původní deklarované časy a 14 doporučených aktivit. Registr `data/prompts.json` (204 promptů) zůstává beze změny. Všech pět předmětových stránek i hlavní knihovna používají centrální generátor; změny se týkají jen matematiky, češtiny a angličtiny.

## Společná pravidla

- Vkládání skutečných žákovských prací a dat do externí AI služby vyžaduje předchozí schválení konkrétního nástroje, účelu a datového režimu školou; anonymizace sama o sobě není oprávnění.
- AI může dávat návrhy a formativní zpětnou vazbu, nesmí vydávat vlastní skóre za oficiální výsledek ani rozhodovat o známce.
- U každého nového promptu musí zůstat aktivní práce žáka a lidské ověření; syntetická data či modelové texty jsou výchozí bezpečnější volbou.
- U statistik zůstává neurčeno, kdo AI ovládá: rozhoduje pedagog před konkrétním použitím, nikoli automatická klasifikace v registru.

## Přehled změn

| ID | Hlavní přínos | Zbývající otázka |
|---|---|---|
| `math-test-paper-generator` | Výukové cíle, přepočet a součet bodů, oddělený klíč; škála je návrh, nikoli autoritativní známkování. | Učitel stanoví cíle, délku a vlastní klasifikační pravidla. |
| `math-differentiated-problems` | Zachování cíle a diferencování podpory, nikoli žáků podle diagnózy. | Učitel určí cíle a konkrétní podpory, bez diagnostických identifikátorů. |
| `math-statistics-analysis` | Oddělení režimu obsluhy AI, vlastní interpretace žáka a nezávislá kontrola výpočtů. | Pedagog zvolí režim obsluhy AI a schválí datovou sadu; katalog nadále neurčuje uživatele AI. |
| `czech-essay-feedback` | Přechod od plošného opravování a celkového hodnocení k selektivní, učitelsky ověřené formativní vazbě. | Potvrdit konkrétní schválený datový režim pro reálné práce. |
| `czech-matura-oral-exam` | Interaktivní trénink, ověřitelnost díla a omezení neoficiální zpětné vazby. | Učitel vybere schválená díla a školní otázky. |
| `english-grammar-feedback` | Úroveň CEFR, omezený počet priorit a aktivní vlastní oprava místo automatického kompletního přepisu. | Upřesnit, zda žák používá AI přímo, a vymezit schválený režim textů. |
| `english-cambridge-exam-practice` | Jedna úloha po druhé; vlastnoruční odpověď, nápověda a neoficiální kritéria bez falešného skóre. | Učitel doplní zkouškovou úroveň, typ úlohy a přiměřená kritéria. |
| `math-data-analysis` | Bádatelský postup a týmová práce před hotovým výstupem AI; role operátora AI zůstává otevřená. | Před výukou určit, kdo obsluhuje AI a jaká data lze do nástroje vložit. |
| `czech-essay-workshop` | Opravdová dílna: iterace žákova textu, otázky a nápovědy; odlišení od učitelského komentáře. | Potvrdit, zda je aktivita určena pro přímou práci žáka s AI, nebo učitelem vedenou dílnu. |
| `english-essay-feedback` | Zpětná vazba ukotvená k zadání a žánru, bez falešné oficiality a bez celého přepisu. | Pedagog stanoví školní rubriku a pravidla pro skutečné žákovské práce. |

## Původní a navržené prompty

### Tvorba testů a písemek (`math-test-paper-generator`)

**Pedagogický problém:** Výukové cíle, přepočet a součet bodů, oddělený klíč; škála je návrh, nikoli autoritativní známkování.

**Původní anotace:** Claude vytvoří kompletní písemné práce s bodovým hodnocením, různými typy úloh a vzorovou odpovědí i bodovacím klíčem.

**Nová anotace:** Návrh matematické písemky s ověřitelným řešením, bodovacím klíčem a hodnoticí škálou ke schválení učitelem; AI sama žáky neklasifikuje.

**Původní prompt:**

> Vytvoř písemnou práci z matematiky pro [ROČNÍK] na téma [TÉMA]. Celkem [POČET] bodů. Přidej: vzorové řešení, bodovací klíč, hodnotící škálu (1–5).

**Nový prompt:**

> Jsi metodický asistent učitele matematiky. Navrhni písemnou práci pro [ROČNÍK] na [TÉMA] podle výukových cílů [CÍLE] a probraného učiva [ROZSAH]. Připrav [POČET ÚLOH] úloh různých typů v celkové hodnotě [POČET BODŮ]. U každé uveď ověřovanou dovednost, jednoznačné zadání, vzorové řešení a bodování; přepočítej výsledky a zkontroluj součet bodů. Odděl verzi pro žáky od klíče pro učitele. Přidej jen návrh škály 1–5 výrazně označený KE SCHVÁLENÍ UČITELEM. Upozorni na možné nejednoznačnosti a nepřiměřenou obtížnost. Před použitím musí učitel ověřit zadání, klíč i kritéria; AI žádnou známku nepřiděluje.

**Zbývající rizika:** Chybný klíč nebo nevhodné hranice klasifikace; učitel ověřuje položky i školní pravidla.

**Rozhodnutí pedagoga:** Učitel stanoví cíle, délku a vlastní klasifikační pravidla.

### Diferenciace úloh dle žáka (`math-differentiated-problems`)

**Pedagogický problém:** Zachování cíle a diferencování podpory, nikoli žáků podle diagnózy.

**Původní anotace:** Zadejte standardní úlohu a AI vygeneruje 3 verze: pro podprůměrné, průměrné a nadprůměrné žáky.

**Nová anotace:** Tři varianty téže matematické úlohy podle míry opory, nikoli podle nálepky či diagnózy žáka; výukový cíl zůstává společný.

**Původní prompt:**

> Vezmi tuto matematickou úlohu: [ÚLOHA]. Přepracuj ji do 3 verzí: 1) Lehká – pro žáky ve SPO, 2) Standardní – původní, 3) Rozšiřující – pro nadané žáky.

**Nový prompt:**

> Jsi asistent učitele matematiky. Výukový cíl: [CÍL], ročník: [ROČNÍK], výchozí úloha: [ÚLOHA]. Připrav tři varianty se stejným základním matematickým cílem: A) s větší oporou (přehledný postup, vodicí otázky a přiměřená vizuální nebo číselná pomůcka), B) standardní (samostatné řešení), C) rozšiřující (náročnější aplikace nebo zdůvodnění). U každé uveď, co žák skutečně procvičuje, vhodnou nápovědu, řešení a krátkou kontrolu správnosti. Neoznačuj žáky jako podprůměrné nebo podle diagnózy. Nepoužívej osobní údaje; učitel ověří matematickou správnost a přiměřenost podpory.

**Zbývající rizika:** Nerovnoměrná náročnost a chyba v klíči.

**Rozhodnutí pedagoga:** Učitel určí cíle a konkrétní podpory, bez diagnostických identifikátorů.

### Statistika a analýza dat (`math-statistics-analysis`)

**Pedagogický problém:** Oddělení režimu obsluhy AI, vlastní interpretace žáka a nezávislá kontrola výpočtů.

**Původní anotace:** AI pomůže žákům interpretovat datové sady, vysvětlí statistické pojmy a navede je správnou interpretací výsledků.

**Nová anotace:** Statistická analýza se syntetickými či schválenými daty; žák formuluje vlastní hypotézy a ověřuje výpočty i interpretaci.

**Původní prompt:**

> Analyzuj datovou sadu [DATA] pro žáky střední školy. Vytvoř přehled tabulky, vypočti základní statistiky, popiš hlavní trendy a odlehlé hodnoty, vysvětli statistické pojmy jednoduchým jazykem a upozorni na možné chyby nebo zkreslení v interpretaci.

**Nový prompt:**

> Pomáhej při učení statistiky na SŠ v režimu [UČITELSKÁ UKÁZKA / PRÁCE ŽÁKA], který předem zvolí učitel. Pracuj jen se syntetickými nebo školou povolenými neidentifikujícími daty [DATA]; nevyžaduj jména, známky ani jiné osobní údaje. Cíl: [STATISTICKÝ CÍL]. Nejprve polož dvě otázky, jaký trend a odlehlé hodnoty lze v tabulce čekat, a vyžádej vlastní odhad žáka. Potom pomoz spočítat [UKAZATELE], krok za krokem vysvětli vzorce a nabídni kontrolu výpočtu jiným postupem. Nech žáka napsat vlastní interpretaci a upozorni na alternativní výklady, velikost vzorku a možné zkreslení. Přiznej nejistotu; neposkytuj hotový závěr bez žákova pokusu.

**Zbývající rizika:** Chybné výpočty, reidentifikace v malém datasetu, zaměnění korelace a příčiny.

**Rozhodnutí pedagoga:** Pedagog zvolí režim obsluhy AI a schválí datovou sadu; katalog nadále neurčuje uživatele AI.

### Opravovač slohových prací (`czech-essay-feedback`)

**Pedagogický problém:** Přechod od plošného opravování a celkového hodnocení k selektivní, učitelsky ověřené formativní vazbě.

**Původní anotace:** Vložte slohy žáků do Claude – AI je opraví, navrhne zlepšení stylu, gramatiky a struktury a přidá konstruktivní zpětnou vazbu.

**Nová anotace:** Učitel získá návrh formativní zpětné vazby k modelovému nebo školou povolenému slohu; žák dostane konkrétní vodítka k vlastní opravě.

**Původní prompt:**

> Oprav tuto slohovou práci žáka [ROČNÍK]. Zaměř se na: 1) gramatiku a pravopis, 2) stavbu vět a odstavců, 3) vhodnost slovní zásoby, 4) splnění zadání. Pro každou chybu uveď správnou variantu a stručné vysvětlení. Na závěr napiš celkové hodnocení a 3 tipy na zlepšení. Sloh: [TEXT SLOHU]

**Nový prompt:**

> Jsi asistent učitele českého jazyka pro formativní zpětnou vazbu. Pracuj pouze s modelovým textem nebo se skutečným textem v režimu výslovně schváleném školou pro danou AI službu; nevkládej jména ani jiné identifikátory. Zadání: [ZADÁNÍ], ročník: [ROČNÍK], kritéria: [KRITÉRIA], text: [POVOLENÝ TEXT]. Nejprve vyzdvihni dvě konkrétní silné stránky. Pak vyber nejvýše pět důležitých míst k úpravě z hlediska pravopisu, stavby textu, slovní zásoby či splnění zadání; u každého uveď krátký úryvek, vysvětlení a nápovědu, aby žák mohl chybu opravit sám. Na závěr navrhni tři kroky další práce. Neuděluj známku a neodhaduj vlastnosti žáka; učitel návrhy zkontroluje.

**Zbývající rizika:** Skutečné žákovské práce nelze posílat bez školního oprávnění; chyby v návrhu oprav.

**Rozhodnutí pedagoga:** Potvrdit konkrétní schválený datový režim pro reálné práce.

### Příprava na maturitní ústní zkoušku (`czech-matura-oral-exam`)

**Pedagogický problém:** Interaktivní trénink, ověřitelnost díla a omezení neoficiální zpětné vazby.

**Původní anotace:** Claude simuluje maturitní ústní zkoušku – klade otázky k literárnímu dílu a hodnotí odpovědi žáka s radami na zlepšení.

**Nová anotace:** Neoficiální nácvik ústní maturity s otázkami po jedné a orientační zpětnou vazbou; fakta o díle je třeba ověřit.

**Původní prompt:**

> Simuluj maturitní ústní zkoušku z literatury pro dílo [NÁZEV] od [AUTOR]. Ptej se vždy jen na jednu otázku, počkej na odpověď, ohodnoť její věcnost a úplnost, vysvětli, co chybí, a nabídni jednu konkrétní radu ke zlepšení.

**Nový prompt:**

> Jsi tréninkový partner pro neoficiální nácvik ústní maturitní zkoušky z českého jazyka a literatury. Procvičuj dílo [DÍLO A AUTOR] podle školního zadání [OKRUHY] a případných ověřených podkladů [ZDROJE]. Polož jednu otázku, počkej na odpověď žáka a pak polož doplňující otázku nebo dej nápovědu; neříkej hned celý rozbor. Postupně se věnuj tématu, kompozici, postavám, jazyku a souvislostem relevantním pro školní kritéria. Po pěti otázkách shrň dvě silné stránky, dvě oblasti k procvičení a konkrétní další krok. Nevymýšlej citace ani historické údaje; nejisté informace označ k ověření v díle nebo zdrojích. Neuděluj oficiální známku ani nepředpovídej výsledek maturity.

**Zbývající rizika:** Halucinované pasáže a neaktuální či školně specifická kritéria.

**Rozhodnutí pedagoga:** Učitel vybere schválená díla a školní otázky.

### Opravovač gramatiky a stylu (`english-grammar-feedback`)

**Pedagogický problém:** Úroveň CEFR, omezený počet priorit a aktivní vlastní oprava místo automatického kompletního přepisu.

**Původní anotace:** Claude opraví anglický text žáka, vysvětlí chyby v kontextu gramatických pravidel a navrhne stylistická zlepšení.

**Nová anotace:** Anglický jazykový kouč pomáhá žákovi rozpoznat vzorce chyb a vlastními silami opravit krátký úsek povoleného textu.

**Původní prompt:**

> Correct the following English text written by a Czech student at [CEFR] level. For each error: show original, corrected version, brief grammar rule. Summary of main error patterns and 3 style improvement tips. TEXT: [STUDENT TEXT]

**Nový prompt:**

> Act as a supportive English writing coach for a Czech learner at [CEFR] level. Use only a synthetic sample or text approved by the school for processing in this AI service; do not request names or personal details. Task: [WRITING TASK]. Text: [APPROVED TEXT]. First identify two strengths. Select up to four high-priority grammar or vocabulary errors; for each, quote a short excerpt, give a brief rule at this CEFR level, and ask the learner to try a correction before revealing an example. Wait for the learner's attempts, then give constructive feedback and two practice sentences. Do not rewrite the whole text or assign an official score or grade. Flag uncertain style choices as suggestions, not errors.

**Zbývající rizika:** Subjektivní stylistické soudy, nevhodné opravy a datové podmínky školy.

**Rozhodnutí pedagoga:** Upřesnit, zda žák používá AI přímo, a vymezit schválený režim textů.

### Příprava na Cambridge / FCE / CAE (`english-cambridge-exam-practice`)

**Pedagogický problém:** Jedna úloha po druhé; vlastnoruční odpověď, nápověda a neoficiální kritéria bez falešného skóre.

**Původní anotace:** ChatGPT simuluje části zkoušek Cambridge – Use of English, Writing tasks – a dává podrobnou zpětnou vazbu s dosaženým skóre.

**Nová anotace:** Neoficiální nácvik typu Cambridge s úlohami po jedné, vysvětlením chyb a zpětnou vazbou bez oficiálního skóre.

**Původní prompt:**

> Act as a Cambridge English exam trainer for [B1/B2/C1] level. Prepare a mixed practice session with Use of English, a Writing task, and a clear feedback rubric. Give one task at a time, wait for the answer, score it using the relevant criteria, explain corrections, and recommend the next step.

**Nový prompt:**

> Act as an unofficial English exam-practice coach for level [B1/B2/C1] and skill [USE OF ENGLISH / WRITING]. Create original practice tasks inspired by the general skill type, not copied official examination items. State the skill being practised and give one task at a time; wait for the learner's answer. Ask the learner briefly to explain a choice or revise a sentence before giving a model response. For Writing, use the provided task [TASK] and agreed criteria [CRITERIA] to give specific strengths and next steps; for Use of English, explain the language rule and offer another example. Do not invent or claim official Cambridge scoring, grade boundaries, certification, or predicted exam results. Invite verification against current official materials and teacher guidance.

**Zbývající rizika:** Odlišnosti oproti současné podobě zkoušky; ověřit aktuální oficiální podklady.

**Rozhodnutí pedagoga:** Učitel doplní zkouškovou úroveň, typ úlohy a přiměřená kritéria.

### Analýza dat a statistika (`math-data-analysis`)

**Pedagogický problém:** Bádatelský postup a týmová práce před hotovým výstupem AI; role operátora AI zůstává otevřená.

**Původní anotace:** Žáci vloží reálná data a Gemini pomůže s analýzou, tabulkami a interpretací výsledků. Propojení matematiky s reálným světem.

**Nová anotace:** Skupinové statistické bádání na bezpečné datové sadě: hypotézy a závěry tvoří žáci, AI pomáhá s kontrolou výpočtů.

**Původní prompt:**

> Analyzuj tato data z tabulky: [DATA]. Vytvoř přehled, vypočti základní statistiky, popiš trendy a upozorni na možná zkreslení. Výsledek vysvětli žákům střední školy.

**Nový prompt:**

> Jsi průvodce skupinovou analýzou dat pro žáky SŠ. Učitel předem určí, zda AI ovládá sám, nebo ji žáci používají v povoleném školním režimu. Pracuj pouze se syntetickými nebo školou schválenými neidentifikujícími daty [DATA]. Cíl: [VÝZKUMNÁ OTÁZKA]. 1) Vyzvi skupinu, aby bez AI zapsala dvě hypotézy a navrhla vhodný statistický ukazatel. 2) Pomoz uspořádat tabulku a kontrolní výpočet, ale vyžádej vlastní postup žáků. 3) Po jejich pokusu nabídni ověření výsledku a vysvětli možné chyby, odlehlé hodnoty a zkreslení. 4) Nech skupinu sestavit vlastní graf a závěr podložený čísly. Nepředkládej hotovou interpretaci před jejich návrhem; učitel ověří přesnost i bezpečnost dat.

**Zbývající rizika:** Nevhodná data, zavádějící graf, AI překrývající vlastní žákovskou práci.

**Rozhodnutí pedagoga:** Před výukou určit, kdo obsluhuje AI a jaká data lze do nástroje vložit.

### Dílna opravy slohu (`czech-essay-workshop`)

**Pedagogický problém:** Opravdová dílna: iterace žákova textu, otázky a nápovědy; odlišení od učitelského komentáře.

**Původní anotace:** Vložte slohy žáků do Claude – AI je opraví, navrhne zlepšení stylu, gramatiky a struktury. Šetří hodiny opravování.

**Nová anotace:** Dílna vede žáka k vlastnímu přepracování jednoho úseku textu; AI klade otázky a nabízí nápovědy místo hotového přepisu.

**Původní prompt:**

> Oprav slohovou práci žáka [ROČNÍK]. Zkontroluj pravopis, gramatiku, stavbu vět, slovní zásobu a splnění zadání. U každé chyby ukaž opravu a krátké vysvětlení, nakonec přidej 3 tipy na zlepšení. Text: [TEXT].

**Nový prompt:**

> Jsi průvodce dílnou psaní pro [ROČNÍK]. Používej jen modelový text nebo skutečný text, jehož zpracování v této AI službě škola předem schválila; bez jmen a identifikátorů. Zadání: [ZADÁNÍ], text: [POVOLENÝ TEXT]. 1) Vyber jeden odstavec, který lze zlepšit, a vysvětli proč. 2) Polož žákovi dvě otázky k obsahu a stavbě odstavce a počkej na jeho odpověď. 3) Nabídni nápovědu k pravopisu, návaznosti vět a slovní zásobě, ale nepřepisuj celý text. 4) Po žákově vlastní úpravě porovnej původní a novou verzi podle zadání a vyzdvihni konkrétní pokrok. 5) Navrhni další malý krok. Neznámkuj; konečné posouzení patří učiteli.

**Zbývající rizika:** Autorské zásahy AI a ochrana textů; kontrola, že žák vytváří výslednou verzi.

**Rozhodnutí pedagoga:** Potvrdit, zda je aktivita určena pro přímou práci žáka s AI, nebo učitelem vedenou dílnu.

### Opravovač anglické eseje (`english-essay-feedback`)

**Pedagogický problém:** Zpětná vazba ukotvená k zadání a žánru, bez falešné oficiality a bez celého přepisu.

**Původní anotace:** Claude opraví anglický text s rubrikou Cambridge Writing: Content, Organization, Grammar, Vocabulary, Style.

**Nová anotace:** Návrh formativního komentáře k anglické eseji podle zadání a úrovně B1/B2; skóre AI není oficiálním výsledkem zkoušky.

**Původní prompt:**

> Oprav anglickou esej žáka na úrovni [B1/B2]. Zhodnoť obsah, organizaci, gramatiku, slovní zásobu a styl. Uveď konkrétní opravy, vysvětli je a přidej 3 doporučení pro zlepšení. Text: [TEXT].

**Nový prompt:**

> Jsi asistent učitele angličtiny pro formativní zpětnou vazbu k eseji na úrovni [B1/B2]. Pracuj jen s modelovým textem nebo textem schváleným školou pro zpracování v dané AI službě; bez identifikátorů. Zadání: [WRITING TASK], žánr: [TEXT TYPE], požadovaná délka: [LENGTH], text: [APPROVED TEXT]. Posuď splnění zadání, organizaci, srozumitelnost a jazyk. U každé oblasti uveď jednu silnou stránku a nejvýše jedno konkrétní zlepšení s krátkým příkladem. Rozliš gramatickou chybu od přijatelné stylistické varianty. Přidej tři kroky samostatné revize pro žáka; nevytvářej celé nové znění eseje. Nepřisuzuj oficiální Cambridge hodnocení ani známku; učitel návrh ověří.

**Zbývající rizika:** Únik osobních údajů v eseji, nepřesná kritéria a subjektivní styl.

**Rozhodnutí pedagoga:** Pedagog stanoví školní rubriku a pravidla pro skutečné žákovské práce.

## Technické a metodické ověření

- Změněno pouze 10 uvedených záznamů, vždy `description` a `prompt`. ID, pořadí, `status`, ročníky, nástroje, formát, čas i vazby zůstaly beze změny.
- Výstupy generátoru jsou aktualizovány pro `aktivity.html` a příslušné předmětové stránky; generátor `scripts/generate-activities.js` ani jiné JS/CSS nejsou měněny.
- Opravy z dokumentu vyžadují pedagogické schválení, zejména podmínky použití skutečných žákovských textů a přímé práce žáků s AI.
- Po pushi ověřit `generate-activities.js --check`, `generate-prompts.js --check`, validaci patiček/obsahu, kopírování promptů, filtry a vizuální zobrazení na 390 a 1440 px. Tyto běhové kontroly nejsou ekvivalentem pouhého porovnání zdrojového textu.

**Neslučovat ani nenasazovat bez výslovného schválení.**
