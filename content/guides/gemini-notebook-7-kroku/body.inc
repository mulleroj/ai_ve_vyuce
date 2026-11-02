
                <p class="article-lead">Gemini Notebook nemusí být jen nástroj, do kterého nahrajeme několik dokumentů a necháme si je shrnout. Může fungovat jako celé pracovní prostředí pro přípravu výuky – od prvotního zpracování zdrojů přes tematický plán a konkrétní hodinu až po materiály pro žáky a individuálního AI tutora.</p>
                <p>Klíčový je ale správný postup.</p>
                <p>Místo toho, abychom začali příkazem:</p>
                <blockquote>„Vytvoř mi hodinu na téma…“</blockquote>
                <p>je mnohem spolehlivější pracovat postupně:</p>
                <div class="article-prompt"><strong>📚 zdroje → 🧠 znalostní mapa → 🗺️ plán výuky → 👩‍🏫 hodina → 📝 materiály → 💬 hlubší práce se zdroji → 🔎 aktualizace → 🎓 AI tutor</strong></div>
                <p>Právě tento postup využívá jednu z největších výhod Gemini Notebooku: AI může pracovat nad konkrétními materiály, které jí sami poskytneme, místo aby odpověď skládala pouze ze svých obecných znalostí.</p>

                <figure class="article-figure">
                    <img src="images/gemini-notebook-7-kroku-priprava-vyuky.png" alt="Infografika Gemini Notebooku jako kompletní přípravy výuky v sedmi krocích od zdrojů až k AI tutorovi" />
                    <figcaption>Vizuální shrnutí workflow Gemini Notebooku: od znalostní základny přes plánování a materiály až k AI tutorovi.</figcaption>
                </figure>

                <h2 id="toc-01">1. Nejprve vytvořte kvalitní znalostní základnu</h2>
                <p>Do notebooku můžete nahrát například:</p>
                <ul>
                    <li>tematický plán,</li>
                    <li>ŠVP nebo jiné kurikulární dokumenty,</li>
                    <li>učebnici,</li>
                    <li>pracovní sešit,</li>
                    <li>vlastní poznámky,</li>
                    <li>prezentace,</li>
                    <li>odborné články,</li>
                    <li>metodické materiály,</li>
                    <li>starší testy,</li>
                    <li>další zdroje používané ve výuce.</li>
                </ul>
                <p>A teď přijde důležitá věc:</p>
                <blockquote><strong>Ještě nic nevytvářejte.</strong></blockquote>
                <p>Nejprve nechte AI zjistit, co vlastně ve zdrojích máte.</p>
                <h3>Prompt</h3>
                <div class="article-prompt" data-guide-copyable="01">Vystupuj jako zkušený didaktik a odborník na <strong>[téma]</strong>.

Důkladně analyzuj a syntetizuj všechny nahrané zdroje.

Urči 5 hlavních principů nebo klíčových myšlenek, které se napříč dokumenty opakují.
Najdi významné rozdíly, rozpory nebo odlišné pohledy mezi jednotlivými zdroji.
Uveď hlavní praktická využití těchto poznatků v reálném životě nebo odborné praxi.
Upozorni na důležité mezery v informacích nebo témata, která zdroje nepokrývají dostatečně.

Zatím nevytvářej plán výuky ani výukové materiály.

Nejprve dokonči mapování znalostí a shrň mi jeho výsledky.</div>
                <h3>Proč tento krok dělat</h3>
                <p>AI tak nejprve pozná terén.</p>
                <p>Učitel zároveň získá rychlý přehled:</p>
                <ul>
                    <li>co se ve zdrojích opakuje,</li>
                    <li>kde si zdroje odporují,</li>
                    <li>co je skutečně důležité,</li>
                    <li>co v podkladech chybí.</li>
                </ul>
                <p>Teprve potom má smysl začít plánovat výuku.</p>

                <h2 id="toc-02">2. Ze zdrojů vytvořte mapu výuky</h2>
                <p>Jakmile máme zmapované zdroje, můžeme z nich vytvořit strukturovaný plán.</p>
                <p>Může jít o jeden tematický celek, několik týdnů nebo třeba celé pololetí.</p>
                <h3>Prompt</h3>
                <div class="article-prompt" data-guide-copyable="02">Vycházej výhradně z nahraných materiálů.

Vytvoř komplexní plán výuky tématu <strong>[téma]</strong> na období <strong>[počet týdnů / počet vyučovacích hodin]</strong>.

Učivo uspořádej tak, aby jednotlivé části logicky navazovaly a každá nová část vycházela z již osvojených znalostí.

U jednotlivých částí kombinuj různé úrovně kognitivní náročnosti – od porozumění základním pojmům až po aplikaci, analýzu, hodnocení a tvorbu. Obtížnost přizpůsob cíli konkrétní části výuky.

Pro každý týden nebo blok uveď:

A) hlavní vzdělávací cíl,
B) klíčové učivo,
C) zdroj, ze kterého učivo vychází,
D) další zdroj, který danou informaci rozšiřuje, doplňuje nebo problematizuje,
E) praktickou situaci z reálného života nebo odborné praxe žáků, ve které lze znalosti použít.

Nepřeskakuj předpokládané znalosti a upozorni mě, pokud některá část vyžaduje znalost, která v předchozím učivu není obsažena.</div>
                <p>To poslední je mimochodem velmi užitečné.</p>
                <p>AI často vytvoří krásně vypadající plán, ve kterém ovšem v půlce zjistíte, že žák potřebuje umět něco, co jste ho ještě neučili.</p>
                <p>Tímhle jí preventivně šlápneme na brzdu.</p>

                <h2 id="toc-03">3. Z tematického celku vytvořte konkrétní hodinu</h2>
                <p>Teď už můžeme jít na úroveň jedné vyučovací hodiny.</p>
                <p>Původní podobné prompty často počítají se šedesátiminutovou výukou. Na české střední škole ale většinou potřebujeme nacpat realitu do 45 minut.</p>
                <p>Proto je lepší délku hodiny zadat jako proměnnou.</p>
                <h3>Prompt</h3>
                <div class="article-prompt" data-guide-copyable="03">Vytvoř detailní plán vyučovací hodiny na téma <strong>[téma]</strong> v délce <strong>[45 minut / jiná délka]</strong>.

Vycházej pouze z nahraných materiálů.

Navrhni realistickou strukturu hodiny. Čas rozděl podle skutečné potřeby jednotlivých aktivit.

Hodina by měla podle charakteru tématu obsahovat:

1. Úvod a aktivizaci žáků
Využij zajímavou otázku, problém, překvapivou informaci nebo rozpor nalezený ve zdrojích.

2. Vysvětlení hlavního učiva
Vysvětli klíčový princip srozumitelně a přiměřeně věku žáků. Pokud je vhodné, použij praktickou analogii.

3. Problematická místa
Urči 2–3 části učiva, se kterými mohou mít žáci pravděpodobně problém, a navrhni, jak je vysvětlit.

4. Aktivní práci žáků
Navrhni úkol nebo problémovou situaci, při které žáci použijí nové poznatky.

5. Ověření porozumění
Připrav krátkou závěrečnou aktivitu, otázky nebo exit ticket.

U každé části uveď orientační čas, činnost učitele, činnost žáků a potřebné pomůcky.

Nevymýšlej fakta, příklady ani citace, které nelze opřít o nahrané zdroje.</div>
                <p>Tím už nedostáváme jen „přípravu hodiny“, ale skoro hotový scénář.</p>

                <h2 id="toc-04">4. Vytvořte kompletní balíček materiálů pro žáka</h2>
                <p>Máme plán. Máme hodinu.</p>
                <p>Teď můžeme Gemini Notebook nechat vytvořit materiály, které budou žáci skutečně používat.</p>
                <h3>Prompt</h3>
                <div class="article-prompt" data-guide-copyable="04">Vystupuj jako zkušený pedagog a tvůrce studijních materiálů.

Vytvoř studijní balíček pro žáky k tématu <strong>[téma]</strong> a vycházej pouze z nahraných zdrojů.

Připrav:

1. Studijní přehled
Shrň hlavní myšlenky a klíčové argumenty do přehledné struktury.

2. Kartičky pro opakování
Vytvoř 15 kartiček s důležitými pojmy. Na jedné straně bude pojem nebo otázka, na druhé vysvětlení.

3. Ověření porozumění
Vytvoř 5 otázek založených na praktických nebo problémových situacích. Otázky by neměly ověřovat pouze mechanické zapamatování.

4. Řešení pro učitele
Uveď správné nebo doporučené odpovědi.

Pokud je to možné, u odpovědí vždy uveď konkrétní zdroj, ze kterého informace vychází.

Nevymýšlej fakta, příklady ani citace, které se v nahraných materiálech nenacházejí.</div>
                <p>Výhodou Gemini Notebooku je právě možnost vrátit se od tvrzení ke zdroji.</p>
                <p>To je při kontrole výukových materiálů zatraceně příjemná vlastnost.</p>

                <h2 id="toc-05">5. Audio Overview nepoužívejte jen jako „AI podcast“</h2>
                <p>Jednou z nejznámějších funkcí Gemini Notebooku je možnost vytvořit ze zdrojů zvukový přehled.</p>
                <p>Jenže tím možnosti nekončí.</p>
                <p>Mnohem zajímavější je použít audio jako první krok k další aktivitě.</p>
                <p>Žáci si například nejprve poslechnou přehled tématu a následně začnou informace rozebírat, porovnávat a zpochybňovat.</p>
                <h3>Prompt pro následnou diskusi</h3>
                <div class="article-prompt" data-guide-copyable="05">Žáci už si poslechli Audio Overview a znají základní informace o tématu.

Vytvoř nyní průvodce sokratovskou diskusí založený pouze na nahraných zdrojích.

Připrav tři části:

1. Ďáblův advokát
Vytvoř 3 otázky, které zpochybní nejslabší místa hlavních argumentů nebo závěrů.

2. Porovnání zdrojů
Nech žáky porovnat dvě části nebo dva zdroje, které se na problém dívají rozdílně.

3. Syntéza
Vytvoř 3 otázky, které žáky povedou ke spojení různých pohledů do nového závěru nebo návrhu řešení.

Každou otázku opři o informace obsažené v nahraných materiálech.</div>
                <p>Tady se z AI podcastu stává skutečná výuková aktivita.</p>
                <p>A to už je podstatně zajímavější než jen „pusťte si to cestou autobusem“.</p>

                <h2 id="toc-06">6. Zkontrolujte, zda vaše materiály nezestárly</h2>
                <p>Tento krok je trochu jiný než předchozí.</p>
                <p>Doteď jsme AI úmyslně drželi uvnitř vlastních zdrojů.</p>
                <p>Teď jí naopak dovolíme podívat se ven.</p>
                <p>Pokud je k dispozici funkce Deep Research nebo jiný nástroj pro vyhledávání aktuálních informací, můžeme porovnat vlastní materiály s novějšími zdroji.</p>
                <h3>Prompt</h3>
                <div class="article-prompt" data-guide-copyable="06">Vystupuj jako zkušený výzkumný asistent.

Analyzuj nahrané materiály k tématu <strong>[téma]</strong> a porovnej je s aktuálními důvěryhodnými zdroji.

Zaměř se na:

1. Mezery v materiálech
Urči 3 významná témata, nové poznatky nebo metodologické problémy, které naše materiály nepokrývají.

2. Zastaralé informace
Najdi tvrzení nebo části materiálů, které již mohou být překonané nebo vyžadují aktualizaci.

3. Aktuální výzkum
Najdi přibližně 5 kvalitních novějších zdrojů, studií nebo případových analýz, které mohou výukové materiály doplnit.

4. Doporučení
U každého zdroje stručně vysvětli, co přináší nového a jak by měl být původní materiál upraven nebo doplněn.

Jasně odděl informace pocházející z původních materiálů od nově nalezených informací.

Preferuj důvěryhodné odborné, institucionální nebo recenzované zdroje.</div>
                <p>Tohle je výborný způsob, jak jednou za čas udělat revizi vlastní digitální učebnice nebo tematického celku.</p>

                <h2>7. Udělejte z notebooku osobního AI tutora</h2>
                <p>A nakonec můžeme prostředí využít přímo pro žáky.</p>
                <p>Pokud mají přístup k notebooku s vhodně vybranými materiály, mohou AI používat jako tutora, který pracuje nad stejnými zdroji jako oni.</p>
                <p>Zásadní je ale instrukce:</p>
                <blockquote><strong>Nedávej žákovi okamžitě správnou odpověď.</strong></blockquote>
                <p>Jinak jsme si vytvořili velmi sofistikovaný opisovací stroj.</p>
                <h3>Prompt pro žáka</h3>
                <div class="article-prompt" data-guide-copyable="07">Vystupuj jako můj osobní studijní tutor.

Mám problém pochopit <strong>[obtížný pojem nebo téma]</strong> z tohoto týdne.

Používej pouze informace z poskytnutých studijních materiálů.

Nejprve mi problém vysvětli krok za krokem jednoduchým a srozumitelným způsobem.

Potom mi vytvoř realistickou situaci nebo problém, ve kterém budu muset daný princip použít.

Nedávej mi správnou odpověď.

Počkej na moje řešení.

Potom:

zhodnoť moje uvažování,
ukaž mi, co jsem použil správně,
upozorni na chyby nebo nepochopené části,
odkaž mě na informace z poskytnutých materiálů,
polož mi další otázku, která mi pomůže problém pochopit lépe.

Cílem není získat odpověď, ale naučit se problém samostatně řešit.</div>
                <p>A tady se dostáváme k jedné z nejzajímavějších možností AI ve vzdělávání.</p>
                <p>Ne:</p>
                <blockquote>„AI, udělej mi úkol.“</blockquote>
                <p>Ale:</p>
                <blockquote>„AI, pomoz mi pochopit, jak ho mám vyřešit.“</blockquote>

                <h2>Jeden notebook, několik rolí</h2>
                <p>Při tomto způsobu práce může jeden dobře připravený notebook postupně zastávat několik funkcí.</p>
                <p>Pro učitele může být:</p>
                <div class="article-prompt"><strong>analytikem zdrojů → pomocníkem při plánování → tvůrcem příprav → generátorem materiálů → kontrolou aktuálnosti.</strong></div>
                <p>Pro žáka může být:</p>
                <div class="article-prompt"><strong>studijním průvodcem → partnerem pro opakování → oponentem v diskusi → individuálním tutorem.</strong></div>
                <p>A přitom pořád pracuje nad stejným základním souborem zdrojů.</p>
                <p>To je na tomto workflow možná nejcennější.</p>

                <h2>Co do Gemini Notebooku nahrát?</h2>
                <p>Čím kvalitnější znalostní základnu vytvoříte, tím lepší výsledky můžete očekávat.</p>
                <p>Pro jeden předmět nebo tematický celek se mohou hodit například:</p>
                <ul>
                    <li>ŠVP a tematický plán,</li>
                    <li>učebnice a pracovní sešity, pokud je smíte tímto způsobem používat,</li>
                    <li>vlastní prezentace a přípravy,</li>
                    <li>pracovní listy,</li>
                    <li>metodické materiály,</li>
                    <li>odborné články,</li>
                    <li>poznámky učitele,</li>
                    <li>slovníčky pojmů,</li>
                    <li>případové studie,</li>
                    <li>starší testy a otázky.</li>
                </ul>
                <p>Není ale dobrý nápad naházet do notebooku všechno, co najdeme na disku.</p>
                <p><strong>Kvalita zdrojů je důležitější než jejich počet.</strong></p>

                <h2>Důležité pravidlo: oddělte dva režimy práce</h2>
                <p>Při používání tohoto workflow je užitečné vědomě rozlišovat:</p>
                <h3>🔒 Práce pouze s vlastními zdroji</h3>
                <p>Používáme ji při:</p>
                <ul>
                    <li>vysvětlování učiva,</li>
                    <li>tvorbě pracovních materiálů,</li>
                    <li>tvorbě testů,</li>
                    <li>plánování hodin,</li>
                    <li>práci žáků s připravenou znalostní základnou.</li>
                </ul>
                <p>V promptu můžeme jasně napsat:</p>
                <div class="article-prompt" data-guide-copyable="08">Vycházej pouze z poskytnutých zdrojů.</div>
                <h3>🌐 Hledání nových informací</h3>
                <p>Používáme ho tehdy, když chceme:</p>
                <ul>
                    <li>aktualizovat materiály,</li>
                    <li>doplnit nový výzkum,</li>
                    <li>najít novější data,</li>
                    <li>ověřit, zda se něco nezměnilo.</li>
                </ul>
                <p>Tady naopak AI výslovně povolujeme práci s externími zdroji.</p>
                <p>Míchat oba režimy bez rozmyslu není ideální. Učitel pak přestává vědět, zda určitá informace pochází z jeho učebnice, nebo ji AI někde nově našla.</p>

                <h2>Nejlepší workflow není jeden geniální prompt</h2>
                <p>Na celém postupu je zajímavá ještě jedna věc.</p>
                <p>Často hledáme „dokonalý prompt“, který po jednom stisknutí vytvoří perfektní hodinu.</p>
                <p>Ve skutečnosti bývá mnohem spolehlivější série menších kroků:</p>
                <ol>
                    <li>Pochop zdroje.</li>
                    <li>Navrhni strukturu učiva.</li>
                    <li>Připrav konkrétní hodinu.</li>
                    <li>Vytvoř materiály.</li>
                    <li>Nech žáky s informacemi aktivně pracovat.</li>
                    <li>Pravidelně obsah aktualizuj.</li>
                    <li>Použij AI jako tutora.</li>
                </ol>
                <p>To už není sbírka promptů.</p>
                <p>Je to workflow pro přípravu a vedení výuky s AI.</p>
                <p>A právě tady podle mě začíná být Gemini Notebook pro učitele opravdu zajímavý: ne jako další generátor textů, ale jako prostředí, ve kterém lze propojit vlastní zdroje, plánování výuky, tvorbu materiálů a samostatné učení žáků.</p>
