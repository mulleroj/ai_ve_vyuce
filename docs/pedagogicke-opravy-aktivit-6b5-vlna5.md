# Etapa 6B/5 – pedagogické opravy aktivit, pátá vlna

**Stav:** metodický návrh dokončen a porovnán se zásadami předchozích čtyř vln; navazující implementace je zahrnuta v této větvi k technické a pedagogické revizi.

**Základ:** `origin/master` `88b487afb162f966d69ea2d5ecc8f7e8a2ff4382` po sloučení PR #35. PR #31 (pedagogický audit) zůstává otevřený draft; PR #32–35 jsou sloučené.

**Rozsah:** přesně čtyři dosud neupravená ID: `math-story-problem-game`, `czech-spelling-word-exercises`, `english-grammar-exercises` a `chemistry-elements-compounds-quiz`.

## Metodická kontrola proti předchozím vlnám

Návrhy zachovávají schválené principy: viditelná role učitele a žáka; žák nejprve samostatně přemýšlí a odpovídá; klíč a vysvětlení jsou odděleny od žákovské verze; učitel nezávisle ověřuje jazyková, matematická a přírodovědná tvrzení; AI neurčuje známku; žákovské osobní údaje ani identifikovatelné práce se nepředávají do neschváleného nástroje. Při chybějících vstupních podkladech se model zeptá, místo aby vymyslel učivo, seznam slov či chemické vlastnosti. Přímé ovládání AI žáky není podmínkou.

Původní `duration` zůstává beze změny. Označení „příprava“ znamená deklarovaný čas přípravy učitele, nikoli zaručené dokončení, kontrolu a tisk celého materiálu. U `math-story-problem-game` původní „15 min“ nerozlišuje přípravu od skupinové výuky a není měřením délky celé aktivity. Časový rozpočet promptu je proto pružný a ověřitelný pilotem.

## 1. `math-story-problem-game`

**Původní název:** Matematická hra – příběhové úlohy

**Původní popis:** Gemini vytvoří mini-příběh, ve kterém žáci musí vyřešit matematické problémy, aby postoupili dál v příběhu.

**Původní prompt:**

```text
Vytvoř matematickou hru pro žáky [ROČNÍK] na téma [TÉMA]. Napiš krátký příběh rozdělený do 5 kroků. V každém kroku přidej matematickou úlohu přiměřenou věku, správné řešení a podmínku pro pokračování. Zachovej motivující tón a nabídni práci ve skupinách.
```

**Pedagogický problém:** Pevně stanovených pět kroků nerespektuje věk, učivo ani čas. Prompt vkládá správné řešení přímo ke každé žákovské úloze a příběhový postup může zastínit matematický cíl. Není určeno, jak učitel oddělí žákovský materiál od klíče, zda skupiny zdůvodňují postup ani jak se ověří samostatný přenos.

**Navržený název:** Skupinová matematická výprava: příběh a úlohy

**Popis karty:** Učitel zadá ročník, probrané učivo a matematický cíl. AI navrhne krátký příběh s přizpůsobeným počtem navazujících úloh, oddělenými kartami a učitelským klíčem. Skupiny zdůvodňují postup; závěrečná samostatná úloha ověřuje přenos. Učitel ověří všechna zadání i řešení.

**Nový úplný prompt:**

```text
Jsi asistent učitele při přípravě skupinového matematického procvičování pro 1. stupeň ZŠ. Vstupy: ročník [ROČNÍK], skutečně probrané učivo [UČIVO], konkrétní matematický cíl [CÍL], přibližný čas výuky [ČAS, POKUD JE ZNÁM] a případná omezení čtení či pomůcek [OMEZENÍ]. Pokud chybí ročník, učivo nebo cíl, nejdříve si je vyžádej a materiál zatím nevytvářej. Nepředpokládej, že žáci znají neuvedené učivo.

Připrav krátký příběhový rámec, jehož děj jen propojuje úlohy a nepřebíjí matematiku. Vytvoř několik navazujících kroků; jejich počet, délku a obtížnost přizpůsob věku, cíli a času. Nepoužívej automaticky pět kroků. Každý krok musí procvičovat uvedený cíl a mít jednoznačné, věku přiměřené zadání. Nevkládej zbytečně složité čtení, nereálné údaje ani matematické předpoklady mimo probrané učivo. Učitel před použitím ověří všechna čísla, výpočty, jednotky a návaznost.

Výstup rozděl přesně do těchto částí:
A. UČITELSKÉ NASTAVENÍ – cíl, požadované pomůcky, doporučené rozdělení do skupin a pružný návrh časových úseků. Původních 15 min nepovažuj za potvrzenou délku celé výuky; označ, že čas je nutné ověřit v konkrétní třídě.
B. ŽÁKOVSKÉ KARTY – příběhový úvod a úlohy bez řešení, nápověd odhalujících výsledek a klíče. U každé karty uveď otázku „Jak jste na to přišli?“ a prostor či pokyn, aby skupina vysvětlila svůj postup. Karty očísluj, ale nepiš na ně správnou podmínku postupu, která by prozradila odpověď.
C. UČITELSKÝ KLÍČ – řešení každého kroku, kontrolní výpočet a případné podmínky pokračování; jasně označ, že tato část není pro žáky před jejich pokusem.
D. SAMOSTATNÝ PŘENOS – jedna krátká nová úloha ke stejnému cíli bez řešení. Žák ji řeší sám po skupinové hře; připoj učitelský výsledek pouze do odděleného klíče.
E. KONTROLNÍ SEZNAM – ověř jednoznačnost, obtížnost, soulad s učivem a cílem, výpočty, jednotky, čitelnost i to, zda příběh nepřevážil nad matematikou. Nejistotu označ místo tvrzení, že je vše správně.

Před skupinovou diskusí dej každému žákovi krátký prostor k vlastnímu návrhu postupu (ústně, nákresem či jednoduchým zápisem podle věku). Následně skupina společně řešení zdůvodní; učitel se přesvědčí, že se zapojili všichni, a formu přizpůsobí času a věku.

Navrhni dvě varianty použití: (1) učitel promítá jednu žákovskou kartu po druhé a klíč ponechá skrytý; (2) učitel rozdá pouze žákovské karty a klíč si ponechá. Žáci řeší ve skupinách, nejprve se pokusí a vysvětlí postup; řešení ani zpětnou vazbu jim neukazuj před tímto pokusem. Přímé používání AI žáky není potřeba. Učitel řídí odhalování karet, kontroluje materiál a po skupinové práci zadá samostatný přenos.

Nevyžaduj jména, osobní údaje ani skutečné žákovské práce. Používej pouze neosobní fiktivní situaci. AI neznámkuje a její klíč není nezávislým důkazem správnosti.
```

**Role a ověřitelný výsledek:** Učitel ovládá AI, zadává probrané učivo, kontroluje příběh, zadání i klíč a volí promítání nebo pracovní karty. Žáci řeší úlohy ve skupině, zdůvodňují zvolený postup a následně samostatně řeší přenosovou úlohu. Ověřitelným výstupem je správné samostatné řešení přenosové úlohy se zdůvodněním podle cíle; učitel je vyhodnotí.

**Bezpečnost a kontrola:** Bez osobních údajů a identifikovatelných prací. Příběh je fiktivní a podřízený cíli. Učitel nezávisle ověří výpočty, jednotky, jednoznačnost a přiměřenost; AI neznámkuje.

**Časová organizace:** Původní údaj `15 min` zachovat, ale nepovažovat ho za doložený čas celé výuky. Počet kroků i doporučené úseky přizpůsobit třídě; skutečný čas ověřit pilotem. Tisk nebo příprava karet se může do údaje nevejít.

**Odlišení:** Skupinová příběhová sekvence s vysvětlováním a závěrečným samostatným přenosem; nejde o běžný soubor slovních úloh pro učitele (`math-word-problem-generator`, `math-real-life-word-problems`) ani individuální tutorskou nápovědu (`math-step-by-step-guide`, `math-ai-tutor`).

**Nevyřešené rozhodnutí:** Konkrétní ročník a téma určuje učitel při každém použití; délku, velikost skupin a přiměřenou formu zapojení každého žáka je třeba ověřit lokálně.

## 2. `czech-spelling-word-exercises`

**Původní název:** Cvičení vyjmenovaných slov

**Původní popis:** AI vygeneruje kreativní cvičení a příběhy procvičující vyjmenovaná slova zábavnou formou pro mladší žáky.

**Původní prompt:**

```text
Vytvoř kreativní cvičení pro žáky 1.–5. ročníku na téma vyjmenovaná slova [ŘADA]. Zařaď krátký příběh, 8 úloh s různými typy doplňování a výběru, okamžitou zpětnou vazbu a správné řešení s jednoduchým vysvětlením.
```

**Pedagogický problém:** Mechanické doplňování i/y a okamžité sdělení odpovědi nevyžadují vysvětlení pravopisného pravidla. Prompt neurčuje, co už bylo probráno, a může zaměnit slova příbuzná s pouhou zvukovou podobností nebo vytvořit neexistující odvozeninu. Žákovská část a klíč nejsou odděleny.

**Navržený název:** Vyjmenovaná slova: procvič pravopis i význam

**Popis karty:** Učitel určí probranou řadu a učivo. AI připraví krátký modelový text a několik různých úloh, v nichž žák volí odpověď a vysvětluje pravidlo i významový vztah. Učitelský klíč je oddělený a vyžaduje kontrolu pravopisu i příbuznosti slov.

**Nový úplný prompt:**

```text
Jsi asistent učitele při přípravě cíleného procvičování vyjmenovaných slov pro žáky 1. stupně ZŠ. Vstupy: ročník [ROČNÍK], vyjmenovaná řada [ŘADA], seznam slov a učivo, které třída už probrala [PROBRANÉ UČIVO A SLOVA], vzdělávací cíl [CÍL] a případná podpora [PODPORA] a čas žákovské práce [ČAS PRÁCE ŽÁKŮ, POKUD JE ZNÁM]. Pokud chybí ročník, řada, informace o probraném učivu nebo vzdělávací cíl, nejprve se zeptej na chybějící údaje a materiál zatím nevytvářej. Nepřidávej další řady ani pravidla, která učitel neuvedl.

Připrav krátký věkově přiměřený modelový text a několik úloh různých typů (například výběr správného i/y, zdůvodnění podle pravidla, doplnění slova do věty nebo rozlišení významu). Počet úloh přizpůsob cíli a případnému času žákovského řešení, nikoli deklarovanému času přípravy učitele; nevynucuj pevný počet. Procvičuj porozumění, ne pouze doplňování písmena.

U každého slova, jehož pravopis závisí na vyjmenovaném slově, výslovně rozliš:
- vyjmenované slovo z učitelem zadané řady,
- skutečné příbuzné slovo odvozené od jeho významu,
- pouze podobně znějící slovo, které příbuzné není.
Nevymýšlej odvozeniny ani významové vztahy. Pokud si nejsi jistý pravopisem, významem nebo příbuzností, slovo vynech nebo označ k učitelskému ověření; nevydávej nejistý příklad za správný.

Výstup rozděl na:
A. ŽÁKOVSKÝ LIST – modelový text a úlohy bez odpovědí a bez okamžité zpětné vazby. U každé odpovědi žáka vyžádej krátké zdůvodnění pravidla či významu.
B. UČITELSKÝ KLÍČ – správné odpovědi, cílové pravidlo a vysvětlení vztahu mezi slovy. Označ jej jako neveřejný pro žáka před jeho pokusem.
C. KONTROLNÍ SEZNAM – ověřit pravopis, slovní významy, příbuznost slov, ročník, probrané učivo, jednoznačnost a přiměřenost příběhu. Nic z této kontroly neprezentuj jako nezávisle ověřené: učitel musí zkontrolovat každý cílový výraz a celý klíč před použitím.

Žák nejprve samostatně vybere odpověď a vysvětlí pravidlo; zpětnou vazbu dostane až po pokusu. Učitel řídí aktivitu a podle potřeby pracuje s papírovým listem. Nejde o diktát: nevytvářej diktovaný souvislý text ani opravný klíč k diktátu. AI neznámkuje. Nevyžaduj jména, osobní údaje ani skutečné žákovské práce.
```

**Role a ověřitelný výsledek:** Učitel určuje řadu, probrané učivo a ročník, ovládá AI a ověřuje všechny příklady i klíč. Žák samostatně odpoví a zdůvodní pravopis pravidlem a významovým vztahem. Ověřitelným výsledkem je správná odpověď se smysluplným vysvětlením, které učitel porovná s probraným učivem.

**Bezpečnost a kontrola:** Pouze modelové věty, bez osobních údajů nebo žákovských prací. Každý pravopis, význam a příbuzenský vztah ověří učitel před rozdáním listu. Klíč a zpětná vazba zůstávají skryté do pokusu žáka.

**Časová organizace:** Zachovat `5 min příprava` jako původní deklaraci přípravy učitele; nejde o ověřenou dobu vytvoření a kontroly listu ani o délku žákovské aktivity. Počet úloh volit podle cíle.

**Odlišení:** Procvičuje konkrétní řadu, význam a slovotvorné vztahy v krátkých úlohách. Není to generování ani opravování diktátu (`czech-dictation-generator`, `czech-dictation-activity`).

**Nevyřešené rozhodnutí:** Učitel stanoví ročník, cíl, které řady, slova a terminologii třída již zná; pro slovní vztahy může určit preferovaný školní slovník či učebnici. Počet úloh se řídí časem práce žáků, nikoli časem přípravy učitele.

## 3. `english-grammar-exercises`

**Původní název:** Gramatická cvičení na míru

**Původní popis:** Generujte cvičení na konkrétní gramatiku – časy, podmínkové věty, slovesa – s klíčem a doplňujícím vysvětlením pravidla.

**Původní prompt:**

```text
Create 15 English grammar exercises for Czech students at [CEFR] level on [GRAMMAR TOPIC]. Mix fill-in, transformation, error correction, and short production tasks. Add an answer key and a concise Czech explanation of each rule. Adjust the difficulty to the selected level.
```

**Pedagogický problém:** Pevný počet patnácti položek nereaguje na cíl, čas ani potřebu podpory. Chybí ročník, předchozí znalosti a rozdělení žákovské verze od klíče. Jediná odpověď může neprávem označit za chybnou gramaticky možnou variantu. Diferenciace není vymezena.

**Navržený název:** Anglická gramatika: krátký pracovní list podle cíle

**Popis karty:** Učitel zadá CEFR, ročník, gramatický jev, předchozí znalosti, cíl, počet úloh, čas žákovského řešení a případnou podporu. AI připraví žákovský list, oddělený klíč s českým vysvětlením, kontrolní seznam přiměřenosti a volitelnou přenosovou úlohu. Učitel ověří jednoznačnost i možné správné varianty.

**Nový úplný prompt:**

```text
You are an assistant helping a teacher prepare a short English grammar worksheet for Czech learners. Required inputs: CEFR level [CEFR], school grade [SCHOOL GRADE], grammar point [GRAMMAR POINT], prior knowledge [WHAT LEARNERS HAVE STUDIED], learning objective [OBJECTIVE], requested number of items or range [NUMBER/RANGE], and time available for students to complete the worksheet [STUDENT WORK TIME]. Optional inputs: desired level of support [SUPPORT] and teacher preparation time [TEACHER PREPARATION TIME]. If any required input is missing, ask one concise question covering all missing details before drafting. Student work time and teacher preparation time are different; do not use teacher preparation time to determine the number of items. Do not assume grammar or vocabulary that learners have not studied.

Prepare only the requested number of items when it fits the objective and student work time. If the requested count seems too large or too small for the objective, briefly flag that and suggest a smaller or larger range; do not automatically create fifteen items. Use a balanced selection of suitable formats, such as gap-fill, transformation, error analysis, or short production, only where they assess the stated objective. Keep instructions, vocabulary, sentence length, and grammar at the chosen CEFR level and appropriate for the school year.

Provide:
A. STUDENT WORKSHEET – exercises only, with no answers, worked examples that reveal the target answers, or immediate feedback.
B. TEACHER KEY – suggested answers and a concise explanation in Czech of the target grammar. For each item, list other grammatical answers that fit the context; if the context does not support a single answer, state that clearly and accept valid alternatives.
C. SUITABILITY CHECKLIST – check CEFR and age suitability, alignment with prior learning and objective, clarity of instructions, item count versus student work time, and whether each item tests the target grammar. Flag uncertainties instead of claiming independent verification.
D. OPTIONAL TRANSFER TASK – invite the learner to use the grammar point in their own short message. Keep it optional and do not ask for personal or sensitive information.

Differentiation may change scaffolding (for example, a word bank, a first-step hint, or a model unrelated to the answer), but must retain the same learning objective and grammar target. Give feedback only after the learner has attempted the item. The teacher controls the AI and checks the answer key, naturalness, ambiguity, CEFR fit, and all acceptable alternatives before use. The AI does not grade learners or assign marks.

Do not request identifiable student work, names, or personal data. Use neutral fictional contexts unless the teacher provides material approved for this tool and purpose. If direct student use has not been approved by the school, use the worksheet without student access to AI.
```

**Role a ověřitelný výsledek:** Učitel zadává všechna kritéria včetně dostupného času, ovládá AI a ověřuje list, jazykovou přirozenost, klíč i přijatelné varianty. Žák řeší list bez zobrazených odpovědí a může volitelně použít jev ve vlastním neosobním sdělení. Ověřitelným výsledkem je správné použití cílového jevu a vysvětlení podle klíče; učitel sám vyhodnocuje.

**Bezpečnost a kontrola:** Pracovní list používá neutrální fiktivní kontext. Identifikovatelné práce či osobní údaje se nepředávají neschválenému nástroji. Učitel kontroluje CEFR, přirozenost, jednoznačnost a všechny přijatelné varianty. AI neznámkuje.

**Časová organizace:** Zachovat `5 min příprava` jako deklarovaný čas učitele, nikoli jako ověřené vytvoření, kontrolu a případný tisk. Počet cvičení přizpůsobit cíli a času; přenosové zadání je volitelné.

**Odlišení:** Učitelem připravovaný gramatický pracovní list, ne osvojení tematické slovní zásoby (`english-vocabulary-builder`) ani formativní komentář k vlastnímu žákovskému textu (`english-grammar-feedback`, `english-essay-feedback`).

**Nevyřešené rozhodnutí:** Konkrétní gramatický jev, úroveň, ročník a počet úloh určí učitel pro každou třídu; počet úloh se ověřuje proti času žákovské práce, nikoli času učitelovy přípravy. Přiměřenost musí ověřit podle právě probraného kurikula.

## 4. `chemistry-elements-compounds-quiz`

**Původní název:** Kvíz – prvky a sloučeniny

**Původní popis:** Generátor opakovacích kvízů o prvcích periodické tabulky, sloučeninách a jejich vlastnostech s automatickým klíčem.

**Původní prompt:**

```text
Vytvoř opakovací kvíz pro žáky [ROČNÍK] na téma [PRVKY NEBO SLOUČENINY]. Připrav deset otázek různých typů, zahrň vlastnosti, značky, názvy a praktické využití, přidej správné odpovědi a krátké vysvětlení každé odpovědi.
```

**Pedagogický problém:** Pevných deset otázek a současně viditelný klíč nepodporují přiměřené samostatné vybavení znalostí. Široké „vlastnosti a praktické využití“ mohou vyvolat nepodložená tvrzení. Chybí vymezení přesně probraného učiva, oddělený žákovský kvíz, vysvětlení odpovědí a lidská kontrola. Kvíz může být mylně zaměněn za úlohy na vyčíslování rovnic.

**Navržený název:** Chemický kvíz: značky, vzorce a vlastnosti

**Popis karty:** Učitel stanoví ročník, probrané pojmy a cíl kvízu. AI připraví přiměřený počet různých otázek v žákovské verzi a oddělený klíč s vysvětlením. Učitel ověří každý symbol, vzorec a údaj o vlastnosti; žák pak reflektuje chybu nebo zdůvodní správnou odpověď.

**Nový úplný prompt:**

```text
Jsi asistent učitele při přípravě krátkého opakovacího kvízu z chemie. Vstupy: ročník [ROČNÍK], přesně probrané učivo [SEZNAM POJMŮ A FAKTŮ], cíle [CÍLE], požadovaný počet či rozsah otázek [POČET/ROZSAH] a případné podklady nebo zdroje schválené učitelem [PODKLADY]. Pokud chybí ročník, seznam probraného učiva nebo cíl kvízu, nejprve si chybějící údaje vyžádej a kvíz zatím nevytvářej. Nepřidávej témata, která třída dosud neprobrala.

Připrav přiměřený počet různých typů otázek k uvedenému učivu, například rozlišení značky a názvu, čtení vzorce, přiřazení názvu nebo výběr vlastnosti, kterou učitel výslovně dodal. Nedrž se automaticky deseti položek. Každá otázka musí odpovídat cíli a mít jasné zadání. Nepožaduj neprobrané znalosti ani nebezpečné pokusy.

Používej pouze chemické údaje, které lze bezpečně odvodit z dodaného učiva nebo podkladů. Nevymýšlej vlastnosti, využití, zdravotní či bezpečnostní údaje, reakce ani výsledky pokusů. U značek, názvů a vzorců, u nichž si nejsi jistý, položku vynech nebo označ k ověření; nevydávej ji jako fakt.

Rozděl výstup na:
A. ŽÁKOVSKÝ KVÍZ – otázky bez odpovědí, klíče a zpětné vazby.
B. UČITELSKÝ KLÍČ – odpovědi a stručné zdůvodnění každé položky; vyznač podklad, pokud jej učitel dodal. Tento klíč se neukazuje před pokusem žáka.
C. KONTROLNÍ SEZNAM – ověř soulad s ročníkem, probraným učivem a cíli; jednoznačnost zadání; správnost každé značky, názvu, vzorce a vlastnosti; absenci nepodložených tvrzení a nebezpečných činností. Přiznej nejistotu. Učitel musí nezávisle ověřit všechny chemické údaje a klíč před použitím.
D. REFLEXE – po vyhodnocení: pokud žák chyboval, vysvětlí jednu vybranou chybu a popíše, jak ověřil správnou odpověď. Pokud odpověděl vše správně, zdůvodní jednu zvolenou správnou odpověď a uvede, jak ji ověřil.

Učitel ovládá AI, vybírá otázky a řídí kvíz. Žák nejprve samostatně odpovídá; odpovědi a klíč získá až po pokusu. AI neposuzuje žáka, automaticky neznámkuje ani nerozhoduje o klasifikaci. Přímý přístup žáků k AI není nutný.

Nepoužívej osobní údaje ani identifikovatelné práce. Nepřidávej experimenty, laboratorní postupy, nebezpečné reakce ani tvrzení o reakcích, které nejsou výslovně doloženy. Jde o pojmový kvíz, ne o vyčíslování chemických rovnic.
```

**Role a ověřitelný výsledek:** Učitel dodá ročník, probrané učivo a cíl kvízu, ovládá AI, ověří všechny položky a klíč a rozhoduje o případném hodnocení. Žák řeší kvíz samostatně a po vyhodnocení vysvětlí jednu vybranou chybu, nebo zdůvodní správnou odpověď, pokud nechyboval. Ověřitelným výsledkem jsou odpovědi a žákovo zdůvodnění; známku přiděluje případně učitel podle vlastních pravidel.

**Bezpečnost a kontrola:** Jen probrané a ověřené chemické údaje; žádné vymyšlené vlastnosti, reakce, pokusy ani bezpečnostní pokyny. Bez osobních údajů. Učitel kontroluje každý symbol, název, vzorec, vlastnost a klíč. AI neznámkuje.

**Časová organizace:** Zachovat `6 min příprava` jako původní deklarovaný čas přípravy, nikoli jako ověřenou délku tvorby a kontroly. Počet položek volit podle cíle a času; délka samotného kvízu není určena.

**Odlišení:** Pojmové ověřování značek, názvů, vzorců a probraných vlastností; nejde o procvičování vyčíslování chemických rovnic (`chemistry-equation-guide`).

**Nevyřešené rozhodnutí:** Učitel stanoví cíl a rozsah učiva i případný ověřený zdroj pro vlastnosti; bez takového podkladu se otázky o vlastnostech vynechají.

## Rozdíl návrhu a implementace

Implementace v `data/activities.json` přebírá pro tato čtyři ID navržené názvy, popisy a úplné prompty. Ostatní metadata (včetně ID, předmětu, ročníku, nástroje, `duration`, formátu, statusu, kolekce a pořadí) zůstávají beze změny. HTML je vytvořeno standardním generátorem; ruční úprava generovaných stránek se neprovádí.

## Omezení k závěrečnému auditu

Deklarované časy nejsou změřeny v konkrétní třídě. Věcnou správnost a přiměřenost každého vytvořeného materiálu musí před použitím zkontrolovat učitel. Školní schválení konkrétních nástrojů, účtů a způsobu zpracování dat se tímto návrhem ani implementací nepředpokládá.

## Kontrola souladu před implementací

Před přenesením návrhu do registru byly všechny čtyři prompty zkontrolovány proti schváleným zásadám vln 1–4 a požadavkům etapy 6B/5:

- Učitel ovládá AI, vyplňuje potřebné podklady, vybírá bezpečný režim a před použitím kontroluje obsah; žák vykonává samostatnou či skupinovou práci podle cíle.
- Žákovská verze a učitelský klíč jsou oddělené; odpovědi a zpětná vazba se nezobrazují před pokusem.
- Ověřitelný výsledek je popsán jako práce žáka, nikoli jako automatický verdikt AI. AI neznámkuje.
- Používají se pouze učitelem určené/probrané podklady nebo neosobní modelové situace. Nežádají se osobní údaje ani identifikovatelné práce v neschváleném režimu.
- Učitel ověřuje matematické výpočty, český pravopis a slovní vztahy, anglickou přirozenost a možné varianty i chemické údaje.
- Původní hodnoty `duration`, statusy, formáty a další metadata jsou zachovány. Časy nejsou vydávány za měření a flexibilita počtu úloh je v promptu výslovná.

Kontrola nezjistila rozpor s předchozími vlnami. Jediným dolaďováním návrhu před implementací bylo výslovné doplnění dostupného času jako povinného vstupu anglického pracovního listu, aby počet položek šel upravit podle času; název, popis a finální prompt v tomto dokumentu jsou totožné s implementací.

## Výsledky technické a browserové kontroly

- `node scripts/generate-activities.js --check`: 44 aktivit, drift 0.
- `node scripts/generate-prompts.js --check`: registr 204 promptů, drift 0.
- `node scripts/validate-content.js`: 76 článků, 0 chyb, 0 varování.
- `node scripts/check-site-footer.js`: 102 relevantních HTML souborů prošlo.
- `node --check`: všech 23 souborů JavaScriptu prošlo.
- `git diff --check`: prošel.
- Automatické porovnání registru: 44 unikátních ID a stejné pořadí; 14 doporučených aktivit; změnily se přesně čtyři cílové záznamy a v nich jen `title`, `description` a `prompt`. Statusy a `duration` všech aktivit, ostatních 40 kompletních záznamů i samostatný registr 204 promptů zůstaly stejné.
- Samostatný Playwright Chromium proces, viewports 390 × 844 a 1440 × 900: v obou byly ověřeny názvy, popisy a otevřené detaily všech čtyř změněných aktivit; úplné prompty se shodovaly mezi registrem, HTML, detailem i skutečnou schránkou přes `navigator.clipboard.readText()` (8/8). Diakritika, odstavce a poslední znak odpovídaly. Escape zavřel detaily a focus se vrátil na spouštěcí tlačítko.
- Kombinovaný filtr `mat` + `zs1` + `gemini` + textové hledání vrátil očekávanou matematickou příběhovou aktivitu. Horizontálního přetečení nebylo. `pageerror`: 0; `console.error`: 0; selhání kritických skriptů: 0.
- Regresní detail a prompt se ověřily v obou viewports pro reprezentanty předchozích vln: `math-statistics-analysis` (vlna 1), `math-step-by-step-guide` (vlna 2), `biology-virtual-lab-experiment` (vlna 3) a `physics-phenomenon-analogies-class` (vlna 4).

Chromium test běžel nad lokálním `file://` zdrojem a dostal odpovídající Clipboard oprávnění. Izolované prostředí nedokázalo vyřešit externí Google Fonts DNS, proto testovací stránka nahradila pouze tento vzdálený stylesheet prázdným CSS; místní HTML, JavaScript, CSS a interakce zůstaly skutečné. Tento test není kontrolou veřejného Deploy Preview.


## Doplnění po pedagogické revizi – 7. 11. 2026

Po revizi PR #36: v matematice přibyl krátký individuální návrh postupu před skupinovou diskusí; v češtině se musí vyžádat ročník a vzdělávací cíl a počet úloh se odvíjí od času práce žáků; v angličtině je ročník nezaměnitelný s kalendářním rokem, čas žákovského řešení je povinný a čas přípravy učitele nepovinný; v chemii je povinný cíl a reflexe i pro žáka bez chyby. Úplná znění promptů a popisy výše jsou aktualizované.

Původní technické a prohlížečové testy uvedené výše platí pro HEAD `afce315814fce818ef2c73e02eab5f1a946b6908`. Po opravné iteraci je nutné ověřit nový HEAD, generované stránky, kontrolní sadu a Deploy Preview. Časové údaje nebyly pilotně ověřené a obsah musí před výukou zkontrolovat učitel.

## Finální QA aktuálního obsahového commitu

**Testovaný obsahový commit:** `441cc46c0548c1922d69d02471d4ff9b1e2a31f4`, načtený do nové samostatné Git kopie z větve PR #36 `codex/ai-ve-vyuce-etapa6b5-pedagogicke-opravy-5`. Kontrola GitHubu potvrdila stejný HEAD; základ `origin/master` je `88b487afb162f966d69ea2d5ecc8f7e8a2ff4382`. Pracovní strom byl před testem čistý. Původní kopie a starší testovací worktree nebyly měněny.

**Obsah a projektové kontroly:**

- `node scripts/generate-activities.js --check`: 44 aktivit, drift 0.
- `node scripts/generate-prompts.js --check`: 204 promptů, drift 0.
- `node scripts/validate-content.js`: 76 článků, 0 chyb, 0 varování.
- `node scripts/check-site-footer.js`: 102 HTML souborů prošlo.
- Syntaxe všech 23 JavaScriptových souborů prošla; `git diff --check origin/master...HEAD` prošel.
- Registry invariants: 44 unikátních ID ve stejném pořadí, 14 aktivit v hlavním výběru, statusy a `duration` zachovány, všech 40 ostatních záznamů beze změny. Změněny přesně čtyři cílové záznamy (`math-story-problem-game`, `czech-spelling-word-exercises`, `english-grammar-exercises`, `chemistry-elements-compounds-quiz`) a pouze jejich `title`, `description`, `prompt`. Registr `data/prompts.json` zůstal shodný s masterem, 204/204.

**Browser QA:** Playwright 1.65.0, Chromium API nad dostupným systémovým Google Chrome 156.0.8078.81 (Chromium), headless, oba skutečné viewports `390 × 844` a `1440 × 900`; `window.innerWidth` a `window.innerHeight` odpovídaly oběma rozměrům. V každém viewportu bylo ověřeno všech 44 karet v DOM a u všech čtyř cílových aktivit název a celý popis karty, otevření detailu a shoda názvu, popisu i celého promptu s registrem. Dialog zavřel Escape a fokus se vrátil na původní tlačítko. Kombinace filtrů `mat` + `zs1` + `gemini` ponechala jedinou očekávanou matematickou aktivitu. Horizontální přetečení nebylo.

Skutečné čtení `navigator.clipboard.readText()` prošlo **8/8** (čtyři prompty ve dvou viewports). Schránka vracela odstavce s Windows konci řádků CRLF; po normalizaci CRLF na LF byl obsah přesně shodný s registrem, včetně diakritiky u českých promptů, odstavců i posledního znaku. Anglický prompt je celý anglicky a českou diakritiku neobsahuje ani ve zdroji.

Regresní detail a prompt se v obou viewports ověřily také pro `math-statistics-analysis` (vlna 1), `math-step-by-step-guide` (vlna 2), `biology-virtual-lab-experiment` (vlna 3) a `physics-phenomenon-analogies-class` (vlna 4). Celkem: `pageerror` **0**, `console.error` **2**, selhání kritických skriptů **0**. Obě chyby konzole vznikly očekávaným zablokováním externích Google Fonts; žádný místní CSS ani JavaScript nebyl nahrazen testovací verzí.

**Omezení prostředí:** Přímé připojení browseru k lokálnímu HTTP serveru bylo sandboxem odmítnuto. Playwright proto použil loopback origin s request routingem, který četl a vracel skutečné soubory HTML, CSS, JavaScript a obrázky přímo z tohoto checkoutu. Jen požadavky na Google Fonts byly zablokovány; typografie vzdálených fontů se tedy v tomto běhu neověřila. Veřejný Deploy Preview byl nezávisle zkontrolován přes Netlify: deploy `6aef5ba185796fcd59d2e9f1` má stav **Ready**, větev odpovídá PR #36 a `commit_ref` přesně odpovídá `441cc46c0548c1922d69d02471d4ff9b1e2a31f4`. Preview URL: https://deploy-preview-36--ai-ve-vyuce.netlify.app/.

Tyto výsledky nahrazují pouze dosavadní závěrečné technické tvrzení o aktuálním stavu. Historický záznam testů `afce315…` výše zůstává zachován a vztahuje se pouze ke staršímu commitu. Časové údaje zůstávají neověřené v konkrétní třídě; materiál před použitím kontroluje učitel.
