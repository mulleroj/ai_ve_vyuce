# Návrh obsahové architektury – etapa 7B

**Stav:** implementační zadání před závěrečnou obsahovou revizí. Návrh přebírá schválenou variantu A – navigaci podle učitelských potřeb. **Není souhlasem k implementaci ani k URL změnám.**

**Auditní základ:** ověřený `origin/master` = `899d11ee5a15e66fc8d7d71d1b2c1470c560c3c1`, 8. 11. 2026. HTML inventura: 103 souborů, z toho 102 obsahových a jeden ověřovací Google HTML. Knihovna aktivit má 44 karet. Hlavní checkout obsahuje WIP změny a zůstal nedotčen; snapshot byl získán izolovaně. Git worktree creation byl zakázán zápisem do `.git/refs`, proto větev PR #43 použita přes GitHub API po ověření, že její HEAD i base odpovídají očekávanému stavu.

## 1. Schválená taxonomie šesti oblastí

### 1. Začít s AI

- **Bezpečný začátek:** první drobný úkol, účet/přístup a kontrola výstupu.
- **Základy práce s AI:** co AI umí a neumí, jak zadat kontext, iterovat a ověřit výsledek.
- **Pravidla a ochrana dat:** školní pravidla, osobní a citlivé údaje, schvalování nástrojů.
- **Rozcestník:** nová landing stránka; existující článek či návod může sloužit jako první krok, ale není sám přehledovým rozcestníkem.

### 2. Připravit výuku

- **Připravit hodinu:** plán, cíle, diferenciace, příprava na vyučovací situaci.
- **Vytvořit materiály:** pracovní list, prezentace, test, vizuál nebo podklad pro výuku.
- **Praktické návody:** postupy krok za krokem, vč. konkrétních nástrojů.
- **Prompty:** kopírovatelné zadání s kontextem, možností úprav a doporučenou kontrolou.
- **Workflow:** více kroků nebo nástrojů s jasným vstupem, výstupem a ověřením.
- **Rozcestník:** upravit existující `ai-navody.html` jako obsahový přehled této oblasti; nemá duplikovat knihovnu promptů ani katalog obsahu.

### 3. Učit s AI

- **Knihovna aktivit:** 44 aktivit, hledání a filtry podle předmětu, ročníku/stupně a nástroje; karta a detail uvádějí roli AI a čas.
- **Výuka podle předmětů:** aktuální stránky pěti předmětů jako kurátorované vstupy a přednastavené filtry do knihovny.
- **Práce žáků s AI:** pedagogická pravidla, role učitele/žáka/skupiny a schválení školy pro přímý přístup žáků.
- **Rozcestník:** zůstává `aktivity.html`; homepage a předmětové stránky do něj vstupují s kontextem filtrů.

### 4. Nástroje a asistenti

- **Přehled AI nástrojů:** služby a jejich vhodnost, omezení a podmínky přístupu.
- **Výběr nástroje podle úkolu:** úkolově orientované srovnání – nikoli nové kopie produktových karet.
- **Hotoví AI asistenti:** připravený pomocník, kterého učitel používá; přehled katalogu, role, vstupu, limitů a ověření.
- **Rozcestník:** upravit `asistenti.html` nebo vhodnou existující katalogovou stránku po obsahové revizi; `katalog-asistenti.html` zůstane seznamem hotových asistentů, ne druhým katalogem nástrojů.

### 5. Tvořit s AI

- **Vibe coding:** učitel vytváří aplikaci pomocí přirozeného jazyka a kódu.
- **Vlastní výukové aplikace:** příklady, specifikace, prototyp, testování a bezpečné sdílení.
- **AI agenti a automatizace:** návrh, konfigurace, nástroje, paměť, přístupová práva a schvalovací body.
- **Bezpečnost a testování:** testy, kontrola kódu, ochrana dat, omezení oprávnění a provozní dohled.
- **Rozcestník:** stávající `vibe-coding.html` je vstup pro aplikace; oblast agentů vyžaduje společnou vstupní stránku nebo upravení existující `ai-agenti.html`. Rozhodnutí v části 9.

### 6. Číst a objevovat

- **Články:** nadčasové odborné a didaktické texty.
- **Novinky:** chronologické aktuality.
- **Filozofování s AI:** série s jasnou posloupností a samostatným přehledem dílů.
- **Rozcestník:** `ai.html` se kanonicky zařazuje sem jako katalog obsahu. Jiné oblasti mohou odkazovat na `ai.html` nebo filtrovaný katalog, ale katalog není jejich rodičem.
- **Existující stránky:** `ai-novinky.html` zůstává chronologickým indexem novinek; budoucí rozcestník série je navržen na `/filozofovani-s-ai`; v této etapě se nevytváří.

## 2. Kompletní mapování: homepage jako kořen, 101 tematických stránek

Inventura snapshotu obsahuje **102 obsahových HTML**: `index.html` je kořen webu bez tematické primární oblasti; zbývajících **101 obsahových stránek** má každá právě jednu primární oblast ze šesti schválených kategorií. Ověřovací Google soubor se nepočítá. Sekundární témata jsou pouze vazby/štítky, nevytvářejí další kanonické zařazení.

`ai-navody.html` je širší existující vstup pro **Připravit výuku**: hodina, materiály, praktické návody, prompty i workflow. Stránky s produktovým názvem se řadí podle účelu. Krokový návod pro učitele patří pod přípravu výuky; produktový přehled pod nástroje.

| URL | Název stránky | Primární oblast | Primární podkategorie | Rodičovský rozcestník | Hierarchie | Sekundární vazby | Doporučený další krok |
|---|---|---|---|---|---|---|---|| URL | Název stránky | Primární oblast | Primární podkategorie | Rodičovský rozcestník | Hierarchie | Sekundární vazby | Doporučený další krok |
|---|---|---|---|---|---|---|---|
| `ai-agenti-10-ukolu.html` | 10 úkolů, které může AI agent převzít učiteli | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › 10 úkolů, které může AI agent převzít učiteli | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-agentni-smycka.html` | Jak funguje AI agent: agentní smyčka krok za krokem | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Jak funguje AI agent: agentní smyčka krok za krokem | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-co-je-ai-agent.html` | AI agenti: když AI začne pracovat | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › AI agenti: když AI začne pracovat | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-coding-agenti.html` | Od vibe codingu ke coding agentům | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Od vibe codingu ke coding agentům | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-chatbot-automatizace-workflow.html` | AI agent, automatizace, workflow nebo chatbot? | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › AI agent, automatizace, workflow nebo chatbot? | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-kdy-nepouzivat.html` | Kdy AI agenta ve škole raději nepoužívat | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Kdy AI agenta ve škole raději nepoužívat | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html` | Jak spolu souvisí LLM, Tools, RAG, Memory, Skills, Workflow a MCP | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Jak spolu souvisí LLM, Tools, RAG, Memory, Skills, Workflow a MCP | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-mcp.html` | MCP: univerzální konektor pro svět AI agentů | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › MCP: univerzální konektor pro svět AI agentů | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-multi-agentni.html` | Multi-agentní systémy: když na jednom úkolu pracuje tým AI | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Multi-agentní systémy: když na jednom úkolu pracuje tým AI | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-nastroje-function-calling.html` | Nástroje a Function Calling: jak dostane AI „ruce“ | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Nástroje a Function Calling: jak dostane AI „ruce“ | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-pamet.html` | Paměť AI agentů: co si AI skutečně pamatuje | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Paměť AI agentů: co si AI skutečně pamatuje | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-prvni-agent.html` | Jak navrhnout svého prvního jednoduchého AI agenta | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Jak navrhnout svého prvního jednoduchého AI agenta | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-rag.html` | RAG: když AI pracuje s vašimi vlastními dokumenty | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › RAG: když AI pracuje s vašimi vlastními dokumenty | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-skills.html` | Skills: jak naučit AI agenta opakovat osvědčený postup | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › Skills: jak naučit AI agenta opakovat osvědčený postup | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti-ve-skole.html` | AI agent ve škole: co může skutečně dělat učiteli | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` | AI agenti a automatizace › AI agent ve škole: co může skutečně dělat učiteli | Hotový asistent: `asistenti.html`. | Navázat od principu k návrhu agenta a testování. |
| `ai-agenti.html` | AI agenti | Tvořit s AI | AI agenti a automatizace | Kořen podkategorie AI agenti a automatizace (menu; bez rodičovské URL) | AI agenti a automatizace › AI agenti | Hotoví asistenti v `asistenti.html`. | Začít v `ai-agenti-co-je-ai-agent.html` nebo `ai-agenti-prvni-agent.html`. |
| `ai-navod-7-univerzalnich-promptu.html` | 7 univerzálních AI promptů: rychlejší příprava výuky | Připravit výuku | Prompty | `ai-navody.html` (širší vstup „Připravit výuku“) | Prompty › 7 univerzálních AI promptů: rychlejší příprava výuky | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-ai-agent-v-prohlizeci.html` | AI agent v prohlížeči: když AI také pracuje | Připravit výuku | Praktické návody | `ai-navody.html` | Přehled AI nástrojů › AI agent v prohlížeči: když AI také pracuje | Tvorba vlastního agenta je v `ai-agenti.html`. | Přejít k návodu podle učitelského úkolu v `ai-navody.html`. |
| `ai-navod-commands-chatgpt.html` | Commands v ChatGPT | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › Commands v ChatGPT | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-edit-kontrola.html` | EDIT: kontrola výstupů | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › EDIT: kontrola výstupů | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-gemini-notebook-infografiky.html` | 7 promptů pro Gemini Notebook | Připravit výuku | Vytvořit materiály | `ai-navody.html` (širší vstup „Připravit výuku“) | Vytvořit materiály › 7 promptů pro Gemini Notebook | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-gemini-notebook-prezentace.html` | 7 promptů pro lepší výukovou prezentaci | Připravit výuku | Vytvořit materiály | `ai-navody.html` (širší vstup „Připravit výuku“) | Vytvořit materiály › 7 promptů pro lepší výukovou prezentaci | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-gemini-notebook-priprava.html` | 7 promptů pro Gemini Notebook | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › 7 promptů pro Gemini Notebook | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-gemini-notebook-vyuka.html` | Gemini Notebook ve výuce: interaktivní studijní prostředí | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › Gemini Notebook ve výuce: interaktivní studijní prostředí | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-chatgpt-vizualni-materialy.html` | 7 promptů pro ChatGPT: vizuální výukové materiály | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › 7 promptů pro ChatGPT: vizuální výukové materiály | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-chatgpt-zacatek-bezpecne.html` | ChatGPT pro učitele: jak začít bezpečně | Začít s AI | Bezpečný začátek | [NOVÝ ROZCESTNÍK — „Začít s AI“; budoucí cíl, URL k rozhodnutí] | Bezpečný začátek › ChatGPT pro učitele: jak začít bezpečně | Pravidla ve škole: `ai-novinka-pravidla-ve-skole.html`. | Zkusit bezpečný učitelský úkol a ověřit odpověď. |
| `ai-navod-lepsi-prompty-10-zasad.html` | Jak psát lepší prompty pro AI: 10 zásad pro učitele | Připravit výuku | Prompty | `ai-navody.html` (širší vstup „Připravit výuku“) | Prompty › Jak psát lepší prompty pro AI: 10 zásad pro učitele | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navod-prep-prompty.html` | PREP: lepší prompty | Připravit výuku | Prompty | `ai-navody.html` (širší vstup „Připravit výuku“) | Prompty › PREP: lepší prompty | Produktový nástroj je sekundární vazba. | Navázat promptem, workflow nebo aktivitou podle cíle. |
| `ai-navody.html` | Praktické návody pro učitele | Připravit výuku | Praktické návody | Kořen oblasti „Připravit výuku“ (menu; bez rodičovské URL) | Oblastní rozcestník › Praktické návody pro učitele | Hodina, materiály, návody, prompty a workflow. | Zvolit úkol a odpovídající typ obsahu. |
| `ai-novinka-agenti-onenote-pruvodce-ucenim.html` | AI ve vzdělávání: chytřejší agenti, OneNote v ChatGPT a AI jako průvodce učením | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: chytřejší agenti, OneNote v ChatGPT a AI jako průvodce učením | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-ai-duvod-premyslet.html` | AI nemá za žáka přemýšlet. Má mu dát důvod přemýšlet. | Číst a objevovat | Články | `ai.html` | Články › AI nemá za žáka přemýšlet. Má mu dát důvod přemýšlet. | Didaktika a práce žáků s AI. | Související aktivita v `aktivity.html`. |
| `ai-novinka-ai-ve-vzdelavani-srpen-2026.html` | AI ve vzdělávání: co je nového na konci srpna | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: co je nového na konci srpna | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-ai-ve-vzdelavani-zari-2026.html` | AI ve vzdělávání: přesnější práce s obrázky, bezpečnější přístup k AI a nové zázemí pro školy | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: přesnější práce s obrázky, bezpečnější přístup k AI a nové zázemí pro školy | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-datovi-agenti-lidske-schvaleni.html` | AI ve vzdělávání: datoví agenti, lidské schvalování a bezpečnější automatizace | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: datoví agenti, lidské schvalování a bezpečnější automatizace | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-filozofovani-s-ai-chybejici-role.html` | AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo | Číst a objevovat | Filozofování s AI | [NOVÝ ROZCESTNÍK — `/filozofovani-s-ai`; budoucí cíl, zatím bez HTML] | Filozofování s AI › AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo | Předchozí/následující díl dle `seriesNumber`; návrat do magazínu `ai.html`. | Další díl podle redakčního čísla; po #4 návrat do `ai.html`. |
| `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html` | Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI | Číst a objevovat | Filozofování s AI | [NOVÝ ROZCESTNÍK — `/filozofovani-s-ai`; budoucí cíl, zatím bez HTML] | Filozofování s AI › Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI | Předchozí/následující díl dle `seriesNumber`; návrat do magazínu `ai.html`. | Další díl podle redakčního čísla; po #4 návrat do `ai.html`. |
| `ai-novinka-gemini-classroom.html` | Gemini míří přímo do výuky | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Gemini míří přímo do výuky | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-gemini-desktop-chatgpt-word-agenti.html` | AI ve vzdělávání: Gemini na Windows, ChatGPT ve Wordu a nové hranice pro AI agenty | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: Gemini na Windows, ChatGPT ve Wordu a nové hranice pro AI agenty | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-gemini-notebook-sablona.html` | Gemini Notebook jako výuková šablona | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Gemini Notebook jako výuková šablona | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-google-ai-vzdelavani-zari-2026.html` | AI ve vzdělávání: Google posiluje tvorbu materiálů i bezpečnost práce s daty | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: Google posiluje tvorbu materiálů i bezpečnost práce s daty | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-chatgpt-interaktivni-kvizy.html` | ChatGPT přidává interaktivní kvízy | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › ChatGPT přidává interaktivní kvízy | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-microsoft-ai-workflow.html` | Microsoft skládá AI workflow pro učitele | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Microsoft skládá AI workflow pro učitele | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-microsoft-gemini.html` | Microsoft skládá AI do jednoho prostředí | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Microsoft skládá AI do jednoho prostředí | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-pravidla-ve-skole.html` | AI pravidla ve škole | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI pravidla ve škole | Pravidla/data: `ai-navod-chatgpt-zacatek-bezpecne.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html` | AI ve vzdělávání: sdílené zdroje, propojené aplikace a bezpečnější práce s daty | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: sdílené zdroje, propojené aplikace a bezpečnější práce s daty | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinka-vykonnejsi-ai.html` | Výkonnější AI se stává běžně dostupnou | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Výkonnější AI se stává běžně dostupnou | Tematický kontext v `ai.html`. | Praktický postup v `ai-navody.html`. |
| `ai-novinky.html` | AI ve vzdělávání: co opravdu stojí za pozornost | Číst a objevovat | Novinky | `ai.html` | Novinky › AI ve vzdělávání: co opravdu stojí za pozornost | Články a série zůstávají v `ai.html`. | Otevřít aktualitu a praktickou návaznost. |
| `ai-workflow-10-promptu-gemini.html` | 10 promptů: pro Gemini Notebook | Připravit výuku | Prompty | `ai-workflow.html` (existující přehled workflow) | Prompty › 10 promptů: pro Gemini Notebook | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-18-promptu.html` | 18 promptů: pro učitele | Připravit výuku | Prompty | `ai-workflow.html` (existující přehled workflow) | Prompty › 18 promptů: pro učitele | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-7-kroku-gemini-notebook.html` | 7 kroků: od zdrojů k AI tutorovi | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › 7 kroků: od zdrojů k AI tutorovi | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-8-otazek.html` | 8 otázek: AI ve výuce | Připravit výuku | Připravit hodinu | `ai-workflow.html` (existující přehled workflow) | Připravit hodinu › 8 otázek: AI ve výuce | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-css-grid-vibe-coding.html` | CSS Grid: proč se při vibe codingu vyplatí rozumět řádkům a sloupcům | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › CSS Grid: proč se při vibe codingu vyplatí rozumět řádkům a sloupcům | Agenti a automatizace: `ai-agenti.html`. | Pokračovat od příkladu k testování a bezpečnému sdílení. |
| `ai-workflow-fotografie-ucebnice.html` | Fotografii učebnice už nemusíte přepisovat | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › Fotografii učebnice už nemusíte přepisovat | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-gemini-notebook-ai-agent.html` | Chytrý učitelský sešit v Gemini Notebooku | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › Chytrý učitelský sešit v Gemini Notebooku | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-chatgpt-images-2-5.html` | ChatGPT Images 2.5 ve výuce: od jednoduchého obrázku k výukovému materiálu | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › ChatGPT Images 2.5 ve výuce: od jednoduchého obrázku k výukovému materiálu | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-prep-edit.html` | PREP + EDIT: AI workflow ve škole | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › PREP + EDIT: AI workflow ve škole | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-prezentace-webova-stranka.html` | Od prezentace k webové stránce | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › Od prezentace k webové stránce | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-udl-ai.html` | UDL + AI: více cest k cíli | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › UDL + AI: více cest k cíli | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-usetri-praci.html` | Jak AI: šetří práci | Připravit výuku | Workflow | `ai-workflow.html` (existující přehled workflow) | Workflow › Jak AI: šetří práci | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-workflow-vibe-coding.html` | Vibe coding krok za krokem | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › Vibe coding krok za krokem | Agenti a automatizace: `ai-agenti.html`. | Pokračovat od příkladu k testování a bezpečnému sdílení. |
| `ai-workflow.html` | Workflow: ChatGPT → Claude | Připravit výuku | Workflow | `ai-navody.html` (širší vstup „Připravit výuku“) | Workflow › Workflow: ChatGPT → Claude | Návod podle nástroje nebo úkolu: `ai-navody.html`. | Použít výsledek při přípravě hodiny a ověřit jej. |
| `ai-ziva-hlasova-ai-ve-vyuce.html` | Když AI začne skutečně naslouchat: živá hlasová umělá inteligence ve výuce | Číst a objevovat | Články | `ai.html` | Články › Když AI začne skutečně naslouchat: živá hlasová umělá inteligence ve výuce | Související výuka: `aktivity.html`. | Vybrat vhodnou aktivitu v `aktivity.html`. |
| `ai.html` | AI ve vzdělávání: co opravdu stojí za pozornost | Číst a objevovat | Články | Kořen oblasti „Číst a objevovat“ (menu; bez samostatné rodičovské URL) | Články › AI ve vzdělávání: co opravdu stojí za pozornost | Jediný celkový katalog; propojitelný z tematických rozcestníků. | Vybrat článek, návod nebo workflow. |
| `aktivity.html` | Výukové aktivity s AI | Učit s AI | Knihovna aktivit | Kořen oblasti „Učit s AI“ (menu; bez rodičovské URL) | Knihovna aktivit › Výukové aktivity s AI | Předměty a průřezová témata. | Nastavit filtry a otevřít detail aktivity. |
| `anglictina.html` | Anglický jazyk s AI | Učit s AI | Výuka podle předmětů | `aktivity.html` (předfiltrovat předmět) | Výuka podle předmětů › Anglický jazyk s AI | Práce žáků s AI je průřezové téma, nikoli katalog. | Otevřít `aktivity.html` s přednastaveným předmětem. |
| `asistent-ucitele-osobni-ai-asistent.html` | Asistent učitele: Pomocník, který pedagogům dosud chyběl | Nástroje a asistenti | Hotoví AI asistenti | `katalog-asistenti.html` | Hotoví AI asistenti › Asistent učitele: Pomocník, který pedagogům dosud chyběl | Vlastní agent: `ai-agenti.html`. | Otevřít asistenta a zkontrolovat jeho limity. |
| `asistenti.html` | AI asistenti a boti | Nástroje a asistenti | Hotoví AI asistenti | Kořen podkategorie Hotoví AI asistenti (menu; bez rodičovské URL) | Hotoví AI asistenti › AI asistenti a boti | Tvorba agentů samostatně v `ai-agenti.html`. | Prohlédnout `katalog-asistenti.html`. |
| `asistenti/math-cermat.html` | MathCERMAT | Nástroje a asistenti | Hotoví AI asistenti | `katalog-asistenti.html` | Hotoví AI asistenti › MathCERMAT | Vlastní agent: `ai-agenti.html`. | Otevřít asistenta a zkontrolovat jeho limity. |
| `asistenti/metodicky-asistent-gemini.html` | Metodický asistent (Gemini Gem) | Nástroje a asistenti | Hotoví AI asistenti | `katalog-asistenti.html` | Hotoví AI asistenti › Metodický asistent (Gemini Gem) | Vlastní agent: `ai-agenti.html`. | Otevřít asistenta a zkontrolovat jeho limity. |
| `cestina.html` | Český jazyk s AI | Učit s AI | Výuka podle předmětů | `aktivity.html` (předfiltrovat předmět) | Výuka podle předmětů › Český jazyk s AI | Práce žáků s AI je průřezové téma, nikoli katalog. | Otevřít `aktivity.html` s přednastaveným předmětem. |
| `claude-pro-ucitele.html` | Claude pro učitele | Nástroje a asistenti | Přehled AI nástrojů | [NOVÝ ROZCESTNÍK — „Přehled AI nástrojů“; budoucí cíl, URL k rozhodnutí] | Přehled AI nástrojů › Claude pro učitele | Návody jsou v `ai-navody.html`; hotoví asistenti v `asistenti.html`. | Vybrat praktický návod pro stejný úkol. |
| `co-se-muze-ucitel-naucit-od-youtube.html` | Co se může učitel naučit od YouTube? Pozornost žáků není samozřejmost | Číst a objevovat | Články | `ai.html` | Články › Co se může učitel naučit od YouTube? Pozornost žáků není samozřejmost | Související výuka: `aktivity.html`. | Vybrat vhodnou aktivitu v `aktivity.html`. |
| `copilot-pro-ucitele.html` | Microsoft Copilot pro učitele | Nástroje a asistenti | Přehled AI nástrojů | [NOVÝ ROZCESTNÍK — „Přehled AI nástrojů“; budoucí cíl, URL k rozhodnutí] | Přehled AI nástrojů › Microsoft Copilot pro učitele | Návody jsou v `ai-navody.html`; hotoví asistenti v `asistenti.html`. | Vybrat praktický návod pro stejný úkol. |
| `dejepis.html` | Dějepis s AI | Učit s AI | Výuka podle předmětů | `aktivity.html` (předfiltrovat předmět) | Výuka podle předmětů › Dějepis s AI | Práce žáků s AI je průřezové téma, nikoli katalog. | Otevřít `aktivity.html` s přednastaveným předmětem. |
| `gemini-desktop-navod-pro-ucitele.html` | Gemini Desktop pro učitele: instalace a první kroky ve Windows | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › Gemini Desktop pro učitele: instalace a první kroky ve Windows | Název produktu je sekundární, stránka učí učitelský úkol. | Dokončit přípravu materiálu nebo hodiny a ověřit výstup. |
| `gemini-notebook-navod-pro-ucitele.html` | Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci | Název produktu je sekundární, stránka učí učitelský úkol. | Dokončit přípravu materiálu nebo hodiny a ověřit výstup. |
| `gemini-notebook-prompty.html` | Prompty pro Gemini Notebook | Připravit výuku | Prompty | `prompty.html` | Prompty › Prompty pro Gemini Notebook | Workflow do kterého prompt zapadá: `ai-workflow.html`. | Doplnit kontext, použít prompt a zkontrolovat výstup. |
| `gemini-notebook-ucitel-vidi-chaty-zaku.html` | Učitel nově uvidí, jak se žáci učí s AI. Google Gemini Notebook otevírá novou kapitolu výuky | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Učitel nově uvidí, jak se žáci učí s AI. Google Gemini Notebook otevírá novou kapitolu výuky | Práce žáků s AI je průřezový kontext. | Pokračovat k pravidlům školy a ochraně dat. |
| `gemini-notebook.html` | Gemini Notebook | Nástroje a asistenti | Přehled AI nástrojů | [NOVÝ ROZCESTNÍK — „Přehled AI nástrojů“; budoucí cíl, URL k rozhodnutí] | Přehled AI nástrojů › Gemini Notebook | Návody jsou v `ai-navody.html`; hotoví asistenti v `asistenti.html`. | Vybrat praktický návod pro stejný úkol. |
| `gemini-pro-ucitele.html` | Google Gemini pro učitele | Nástroje a asistenti | Přehled AI nástrojů | [NOVÝ ROZCESTNÍK — „Přehled AI nástrojů“; budoucí cíl, URL k rozhodnutí] | Přehled AI nástrojů › Google Gemini pro učitele | Návody jsou v `ai-navody.html`; hotoví asistenti v `asistenti.html`. | Vybrat praktický návod pro stejný úkol. |
| `gemini-skills-pro-ucitele.html` | Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat | Připravit výuku | Praktické návody | `ai-navody.html` (širší vstup „Připravit výuku“) | Praktické návody › Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat | Název produktu je sekundární, stránka učí učitelský úkol. | Dokončit přípravu materiálu nebo hodiny a ověřit výstup. |
| `gemini-storybook-navod-pro-ucitele.html` | Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku | Připravit výuku | Vytvořit materiály | `ai-navody.html` (širší vstup „Připravit výuku“) | Vytvořit materiály › Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku | Název produktu je sekundární, stránka učí učitelský úkol. | Dokončit přípravu materiálu nebo hodiny a ověřit výstup. |
| `google-ai-studio-2026-vibe-coding.html` | Google AI Studio 2026: od jednoduchého promptu k celé aplikaci | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › Google AI Studio 2026: od jednoduchého promptu k celé aplikaci | Agenti a automatizace: `ai-agenti.html`. | Pokračovat od příkladu k testování a bezpečnému sdílení. |
| `chatgpt-pro-ucitele.html` | ChatGPT pro učitele | Nástroje a asistenti | Přehled AI nástrojů | [NOVÝ ROZCESTNÍK — „Přehled AI nástrojů“; budoucí cíl, URL k rozhodnutí] | Přehled AI nástrojů › ChatGPT pro učitele | Návody jsou v `ai-navody.html`; hotoví asistenti v `asistenti.html`. | Vybrat praktický návod pro stejný úkol. |
| `neplytvej-inteligenci-ai-modely.html` | Neplýtvej inteligencí: Efektivnější práce s AI | Číst a objevovat | Články | `ai.html` | Články › Neplýtvej inteligencí: Efektivnější práce s AI | Základy ověřování a efektivní práce s AI. | Vybrat konkrétní učitelský úkol v `ai-navody.html`. |
| `notebooklm-hlasovy-rozhovor-nad-zdroji.html` | Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM | Připravit výuku | Praktické návody | `ai-navody.html` | Praktické návody › Hlasový rozhovor nad zdroji | NotebookLM jako použitý nástroj; ochrana školních zdrojů. | Vyzkoušet návazný workflow pro přípravu výukového materiálu. |
| `index.html` | Umělá inteligence ve škole, která má smysl. | Kořen webu | Úvodní stránka | Bez rodiče (kořen) | Kořen webu › Domů | Úkolové vstupy do šesti oblastí. | Začít bezpečně: `ai-navod-chatgpt-zacatek-bezpecne.html`. |
| `katalog-asistenti.html` | Hotoví AI asistenti pro učitele | Nástroje a asistenti | Hotoví AI asistenti | `asistenti.html` | Hotoví AI asistenti › Hotoví AI asistenti pro učitele | Vlastní agent: `ai-agenti.html`. | Otevřít asistenta a zkontrolovat jeho limity. |
| `kdyz-ai-jedna-odpovednost-ai-agenta.html` | Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta? | Číst a objevovat | Filozofování s AI | [NOVÝ ROZCESTNÍK — `/filozofovani-s-ai`; budoucí cíl, zatím bez HTML] | Filozofování s AI › Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta? | Předchozí/následující díl dle `seriesNumber`; návrat do magazínu `ai.html`. | Další díl podle redakčního čísla; po #4 návrat do `ai.html`. |
| `matematika.html` | Matematika s AI | Učit s AI | Výuka podle předmětů | `aktivity.html` (předfiltrovat předmět) | Výuka podle předmětů › Matematika s AI | Práce žáků s AI je průřezové téma, nikoli katalog. | Otevřít `aktivity.html` s přednastaveným předmětem. |
| 
eplytvej-inteligenci-ai-modely.html` | Neplýtvej inteligencí | Číst a objevovat | Články | `ai.html` | Články › Neplýtvej inteligencí | Související výuka: `aktivity.html`. | Vybrat vhodnou aktivitu v `aktivity.html`. |
| 
otebooklm-hlasovy-rozhovor-nad-zdroji.html` | Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM | Připravit výuku | Workflow | `ai-navody.html` (širší vstup „Připravit výuku“) | Workflow › Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM | NotebookLM jako použitý nástroj. | Převést práci se zdroji do aktivity. |
| `perplexity-pro-ucitele.html` | Perplexity pro učitele | Nástroje a asistenti | Přehled AI nástrojů | [NOVÝ ROZCESTNÍK — „Přehled AI nástrojů“; budoucí cíl, URL k rozhodnutí] | Přehled AI nástrojů › Perplexity pro učitele | Návody jsou v `ai-navody.html`; hotoví asistenti v `asistenti.html`. | Vybrat praktický návod pro stejný úkol. |
| `prirodoveda.html` | Přírodní vědy s AI | Učit s AI | Výuka podle předmětů | `aktivity.html` (předfiltrovat předmět) | Výuka podle předmětů › Přírodní vědy s AI | Práce žáků s AI je průřezové téma, nikoli katalog. | Otevřít `aktivity.html` s přednastaveným předmětem. |
| `prompty.html` | Knihovna Promptů | Připravit výuku | Prompty | `ai-navody.html` (širší vstup „Připravit výuku“) | Prompty › Knihovna Promptů | Workflow do kterého prompt zapadá: `ai-workflow.html`. | Doplnit kontext, použít prompt a zkontrolovat výstup. |
| `qr-kod.html` | Vytvořte QR kód z odkazu | Připravit výuku | Vytvořit materiály | `ai-navody.html` | Vytvořit materiály › Vytvořte QR kód z odkazu | Ne-AI utilita k distribuci výukového materiálu. | Připojit QR kód k pracovnímu listu. |
| `skill-anglictina-vyukove-materialy.html` | Jeden SKILL, sedm výukových materiálů: AI pomocník pro angličtinu | Připravit výuku | Vytvořit materiály | `ai-navody.html` (širší vstup „Připravit výuku“) | Vytvořit materiály › Jeden SKILL, sedm výukových materiálů: AI pomocník pro angličtinu | Název produktu je sekundární, stránka učí učitelský úkol. | Dokončit přípravu materiálu nebo hodiny a ověřit výstup. |
| `uci-se-zak-nebo-za-nej-premysli-ai.html` | Učí se žák, nebo za něj přemýšlí AI? | Číst a objevovat | Filozofování s AI | [NOVÝ ROZCESTNÍK — `/filozofovani-s-ai`; budoucí cíl, zatím bez HTML] | Filozofování s AI › Učí se žák, nebo za něj přemýšlí AI? | Předchozí/následující díl dle `seriesNumber`; návrat do magazínu `ai.html`. | Další díl podle redakčního čísla; po #4 návrat do `ai.html`. |
| `vibe-coding-bezpecnost-kodu-php2shell.html` | Vibe Coding: AI ti naprogramuje aplikaci. Ale kdo zkontroluje její bezpečnost? | Tvořit s AI | Bezpečnost a testování | `vibe-coding.html` | Bezpečnost a testování › Vibe Coding: AI ti naprogramuje aplikaci. Ale kdo zkontroluje její bezpečnost? | Agenti a automatizace: `ai-agenti.html`. | Ověřit bezpečnost před sdílením. |
| `vibe-coding-clanky.html` | Články o Vibe Codingu | Tvořit s AI | Vibe coding | `vibe-coding.html` | Vibe coding › Články o Vibe Codingu | Agenti a automatizace: `ai-agenti.html`. | Pokračovat od příkladu k testování a bezpečnému sdílení. |
| `vibe-coding-pro-ucitele.html` | Co si můžete vytvořit do výuky | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › Co si můžete vytvořit do výuky | Agenti a automatizace: `ai-agenti.html`. | Pokračovat od příkladu k testování a bezpečnému sdílení. |
| `vibe-coding-prompty.html` | Prompty pro Vibe Coding | Tvořit s AI | Vibe coding | `vibe-coding.html` | Vibe coding › Prompty pro Vibe Coding | Agenti a automatizace: `ai-agenti.html`. | Pokračovat od příkladu k testování a bezpečnému sdílení. |
| `vibe-coding-ucitele.html` | Úvod do vibe codingu pro učitele | Tvořit s AI | Vibe coding | `vibe-coding.html` | Vibe coding › Úvod do vibe codingu pro učitele | Agenti a automatizace: `ai-agenti.html`. | Pokračovat od příkladu k testování a bezpečnému sdílení. |
| `vibe-coding.html` | Vibe Coding | Tvořit s AI | Vibe coding | Kořen podkategorie Vibe coding (menu; bez rodičovské URL) | Vibe coding › Vibe Coding | Agenti zvlášť v `ai-agenti.html`. | Začít úvodem `vibe-coding-ucitele.html`. |

## 3. Striktní rozlišení asistentů a agentů

| Pojem | Definice | Primární oblast | Správné pokračování |
|---|---|---|---|
| **Hotový AI asistent** | Nástroj nebo připravený pomocník, kterého učitel otevře a používá při konkrétním úkolu. | Nástroje a asistenti → Hotoví AI asistenti | vybrat pomocníka → návod k použití → ověřit odpověď / aktivitu |
| **Tvorba AI agenta** | Postup návrhu, konfigurace oprávnění, nástrojů a paměti, testování a dohledu nad vlastním agentem. | Tvořit s AI → AI agenti a automatizace | vysvětlit pojem → navrhnout omezený úkol → testovat a zavést lidské schválení |

V obou rozcestnících se umístí jeden kontextový odkaz: z hotových asistentů „Chcete si navrhnout vlastního agenta?“ → `ai-agenti.html`; z tvorby agentů „Hledáte už hotového pomocníka?“ → `asistenti.html`. Zmínka o agentovi v článku o asistentovi je sekundární odkaz, nikoli změna primární kategorie. **Obsahové rozhodnutí:** zda některé konkrétní záznamy v `katalog-asistenti.html` jsou produkty, uživatelské konfigurace nebo vlastní agentské projekty; ověřit jednotlivě při 7C prototypu.

## 4. Koncept samostatného rozcestníku série „Filozofování s AI“

**Budoucí rozcestník:** navržená URL `/filozofovani-s-ai`; v této etapě se stránka ani URL nevytváří. Vstupy budou z homepage a z „Číst a objevovat“. Stávající URL článků zůstávají zachovány.

- **Úvod:** série zkoumá, jak AI mění učení, odpovědnost, práci a lidskou roli.
- **Oficiální pořadí:** redakční metadata `seriesNumber` v `js/site-articles.js` uvádějí tyto čtyři díly:
  1. `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html` — „Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI“.
  2. `ai-novinka-filozofovani-s-ai-chybejici-role.html` — „AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo“.
  3. `uci-se-zak-nebo-za-nej-premysli-ai.html` — „Učí se žák, nebo za něj přemýšlí AI?“
  4. `kdyz-ai-jedna-odpovednost-ai-agenta.html` — „Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta?“
- **Navigace dílu:** čísla 1–4 z metadat jsou oficiálním pořadím; použít je pro seznam i předchozí/následující odkazy. První díl nemá předchozí, čtvrtý nemá následující. Každý díl nabídne návrat do magazínu `ai.html`.
- **Související témata:** práce žáků s AI, Human in the Loop, bezpečnost a odpovědnost agentů, otázky pro diskusi; nejvýše 2–4 odkazy.
## 5. Šest rozcestníků – účel, obsah a status

| Oblast | Účel a cílový návštěvník | Základní navigační položky a praktické vstupy | Existující obsah / reuse | Související oblast a doporučené pokračování |
|---|---|---|---|---|
| Začít s AI | Bezpečně provést začátečníka od prvního dotazu ke kontrole odpovědi | bezpečný začátek; základy; pravidla/data; „Zkuste první úkol“ | **Nový rozcestník potřebný.** Využít `ai-navod-chatgpt-zacatek-bezpecne.html`, `ai-agenti-co-je-ai-agent.html`, pravidla ve škole; nevytvářet nový obecný článek | Připravit výuku → krátký návod/prompt; nástroje → dostupný nástroj |
| Připravit výuku | Pomoci učiteli připravit hodinu, pracovní list, test nebo podklad | připravit hodinu; materiály; návody; prompty; workflow; CTA „Vyberte úkol“ | Upravit `ai-navody.html` jako rozcestník; reuse `prompty.html`, `ai-workflow.html`, příslušné detaily | Učit s AI → aktivita; nástroje → nástroj podle úkolu |
| Učit s AI | Najít pedagogicky použitelný scénář pro třídu/předmět | knihovna; předměty; žáci s AI; filtry předmět/ročník/nástroj | `aktivity.html` je hlavní existující rozcestník/katalog; předmětové stránky jako kurátorované vstupy | Připravit výuku → příprava a pracovní list; Začít s AI → pravidla přístupu |
| Nástroje a asistenti | Vybrat službu nebo hotového pomocníka pro potřebu učitele | srovnat podle úkolu; nástroje; hotoví asistenti | Nový přehledový rozcestník nástrojů lze doplnit, pokud oddělí produktové přehledy od hotových asistentů; `asistenti.html` a `katalog-asistenti.html` zůstávají v oblasti hotových asistentů. | Připravit výuku → návod pro vybraný nástroj; Tvořit s AI → vlastní agent |
| Tvořit s AI | Vést pokročilejšího učitele k prototypu aplikace či agenta a k ověření bezpečnosti | vibe coding; aplikace; agenti/automatizace; testování/bezpečnost | `vibe-coding.html` jako existující vstup pro aplikace; `ai-agenti.html` zůstává agentním rozcestníkem. Nový vstup „Tvořit s AI“ je přípustný, pokud zabrání obsahové kolizi. | Nástroje a asistenti → hotový příklad; Připravit výuku → použití aplikace v hodině |
| Číst a objevovat | Najít kontext, nové poznatky nebo seriálové čtení | články; novinky; Filozofování s AI; vyhledávání a štítky | Reuse `ai.html` jako katalog obsahu; `ai-novinky.html` jako chronologický index; **nový obsahový koncept** série bez nové stránky v 7B | Praktický návod/aktivita → vyzkoušet relevantní myšlenku |

Princip: šest položek v globální navigaci nejsou šest povinných nových HTML. Nový rozcestník zavést jen pokud existující stránku nelze přizpůsobit bez kolize účelu. Katalog `ai.html` zůstává jediným celkovým katalogem obsahu; filtry nebudou kopírovány do druhého katalogu.

## 6. Uživatelské cesty a doporučený krok

| Cíl | Cesta | Krok na konci cílové stránky |
|---|---|---|
| Začít používat AI | Domů → Začít s AI → bezpečný začátek | první nenáročný úkol → kontrola výstupu → návod podle úkolu |
| Připravit hodinu | Domů → Připravit výuku → Připravit hodinu → workflow | vybraný předmět → aktivita s cílem a rolí AI |
| Vytvořit pracovní list/test | Domů → Připravit výuku → Vytvořit materiály → návod | kopírovatelný prompt → kontrolní seznam → aktivita pro použití materiálu |
| Aktivita pro předmět | Domů → Učit s AI → předmět → `aktivity.html` s filtrem | role AI a oddělené časy → detail → související příprava učitele |
| Workflow/vlastní aplikace | Domů → Připravit výuku → Workflow nebo Tvořit s AI → Vibe coding → testy | bezpečnost/testování → publikovat/sdílet pouze po ověření; související výuková aktivita |
| Článek/novinka | Domů → Číst a objevovat → článek/novinky/série | další díl nebo kontextový návod/aktivita; návrat do magazínu |

Na homepage zůstávají úkolové vstupy (co dnes potřebujete, předmětové vstupy, praktické karty). Nezobrazovat šest abstraktních názvů jako jediný způsob orientace.

## 7. Společná navigace, hierarchie a návaznosti

1. Desktop i mobil používají stejná data, názvy, hierarchii, cíle a pořadí. Liší se jen ovládací prezentace (dropdown vs. rozbalovací panel).
2. Logo vede na domů. Šest oblastí je v jednotném pořadí výše. Hledání je globální nástroj mimo strom kategorií.
3. Každá stránka má jedinou primární kategorii v metadatech IA. Breadcrumbs zobrazují `Domů > Primární oblast > Podkategorie > Stránka`; vynechat úroveň, pokud rodič neexistuje jako reálný rozcestník. Sekundární vazba není breadcrumb.
4. Aktivní detail má viditelné zvýraznění a `aria-current="page"`; aktivní rodičovská oblast je současně otevřená nebo označená. Mobilní menu poskytne stejný kontext.
5. Na konci každého detailu jeden zřetelný doporučený další krok, maximálně 2–4 související odkazy, každý s vysvětlujícím popisem. Související články nesmí soupeřit s dalším dílem série ani s rodičem.
6. Přechod z předmětové stránky do knihovny zachová parametry `subject`, `level`, `tool`, `q`; musí existovat možnost filtr vymazat a návrat neztratí stav. Odkazy na karty mohou mít anchor/id, ale nemají vytvářet nové obsahové URL.
7. Bez myši: všechny rozbalovací prvky ovládnutelné klávesnicí; logické pořadí Tab, Escape zavírá menu, focus se neztrácí, Enter/Space spouští položky. Otevřený panel nesmí blokovat hlavní obsah.
8. Přístupnost: viditelný focus, kontrast, smysluplné názvy ovládacích prvků, `aria-expanded` synchronní se stavem, landmarks a skip link. Aktuální položka musí být vyznačena i bez barvy.
9. JavaScript fallback: hlavní navigační odkazy a základní obsah jsou v HTML dostupné bez JS. Filtry mohou být rozšířením, ale bez JS zůstane seznam aktivit/článků přístupný; formulářové odkazy nesmějí vést na nefunkční `#`.
10. Centrální navigace má jednu datovou definici a jeden IA manifest pro `primaryArea`, `subcategory`, `parent`, `label`, `secondaryLinks`. Šablony vykreslují stejné údaje; neprovádět plošný přepis HTML. Breadcrumbs nejsou generovány z URL názvu, ale z manifestu.

## 8. SEO a technické nálezy k rozhodnutí

**Kontrola snapshotu `899d11e`:** 103 HTML souborů (102 obsahových), 97 sitemap `<loc>`, 94 neprázdných `_redirects` pravidel. Canonical HTML adres ve většině případů používají bezpříponovou cestu; `_redirects` obsahuje jednotlivá přesměrování starších `.html` cest na čistou cestu s kódem 301. Sitemap obsahuje čisté URL. 3 canonical cílové cesty se v sitemapě nenacházejí a 2 canonical hodnoty mají `.html` navzdory obvyklému bezpříponovému tvaru.

### Tři cesty, které v sitemapě chybí

| HTML soubor | Canonical | V sitemapě | Rozhodnutí potřebné |
|---|---|---|---|
| `ai-novinka-ai-duvod-premyslet.html` | `/ai-novinka-ai-duvod-premyslet` | ne | Má být indexovatelný článek (je v katalogu a homepage feedu); přidat canonical URL do sitemapy, je-li veřejný/indexovatelný. |
| `gemini-skills-pro-ucitele.html` | `/gemini-skills-pro-ucitele` | ne | Prověřit indexovatelnost a veřejnou dostupnost; pokud veřejný detail, doplnit sitemapu. |
| `skill-anglictina-vyukove-materialy.html` | `/skill-anglictina-vyukove-materialy` | ne | Prověřit soulad zip/download, veřejné stránky, 
oindex` a canonical; pokud má být veřejný detail, doplnit sitemapu. |

### Dvě canonical URL s odlišným tvarem

| HTML soubor | Canonical ve zdroji | Redirect | Co ověřit |
|---|---|---|---|
| `asistent-ucitele-osobni-ai-asistent.html` | `/asistent-ucitele-osobni-ai-asistent.html` | Pro tuto stránku není v `_redirects` specifické pravidlo `.html` → bez přípony; produkční stránka načetla přímo `.html` URL. | Canonical je v rozporu s obvyklou bezpříponovou cestou v sitemapě. Ověřit provozní záměr a vybrat jednu kanonickou variantu. |
| `vibe-coding-bezpecnost-kodu-php2shell.html` | `/vibe-coding-bezpecnost-kodu-php2shell.html` | Pro tuto stránku není v `_redirects` specifické pravidlo `.html` → bez přípony; produkční stránka načetla přímo `.html` URL. | Canonical je v rozporu s obvyklou bezpříponovou cestou v sitemapě. Ověřit provozní záměr a vybrat jednu kanonickou variantu. |

**Produkční URL – kontrola 8. 11. 2026:** přímé otevření v prohlížeči potvrdilo, že všechny tři sitemapou vynechané bezpříponové URL načítají odpovídající obsah a jejich produkční canonical odpovídá této bezpříponové cestě. Obě `.html` stránky se také načetly na přesné `.html` adrese a produkční canonical obsahoval `.html`; žádné konkrétní přesměrovací pravidlo pro tyto dvě cesty v `_redirects` není. To je reálný nesoulad se sitemapou, kde je shodný slug uveden bez přípony. Prohlížečová kontrola nevrátila HTTP status ani hlavičky `Location`; přesný status/redirect je proto ještě třeba ověřit HTTP crawl/Netlify logem. Tři sitemapové výpadky a oba canonical rozpory zůstávají rozhodnutími, nic se neopravuje v 7B. Nedoplňovat canonical/sitemap/redirecty v tomto dokumentačním PR.

Další kontroly pro 7C/SEO: srovnat každý indexovatelný canonical s jednou sitemap URL; potvrdit záměr u 
oindex`; kontrolovat katalogové karty na platné interní href; query filtry mají zůstat nekanonickými stavy a všechny vést na stejnou canonical stránku; zachovat 94 existujících 301 a nepřidávat řetězce/smyčky. URL se v 7B nemění.

## 9. Přesný plán prototypu etapy 7C

### Záměr

Prototyp navigačního kontraktu na stávajících šablonách bez přestavby webu. Kód/HTML změny budou až po přijetí tohoto dokumentu k obsahové revizi; v této 7B etapě se nevykonávají.

### Rozsah prototypu

1. **IA manifest:** definovat šest oblastí, přesné štítky/podštítky a datové schéma; přidělit všech 102 stránek dle tabulky. Vložit kontrolu pro mapovací položky a budoucí rozcestníky; nevyřešené jsou pouze technické SEO otázky.
2. **Čtyři reprezentativní šablony:** homepage; katalog obsahu `ai.html`; knihovna `aktivity.html`; specializovaný microsite `vibe-coding.html`. Dále kontrolní stránka detailu článku a návodu kvůli breadcrumbs.
3. **Strom menu:** desktop dropdowny a mobilní disclosure vykreslené ze stejného seznamu. Prototyp obsahuje logo → Domů, 6 oblastí, stejné názvy a jasné označení aktuální oblasti/podkategorie.
4. **Rozcestníky:** navrhnout obsahové wireframy pro šest sekcí; existující cílové stránky využít dle části 5. Nová HTML ani nové URL se v prototype specification nepřidávají.
5. **Cesty:** projít šest cest v oddílu 6; max. dva kliky do primárního cíle při přímém vstupu z homepage; zaznamenat rozhodování, slepé odbočky a zda návazný krok pomáhá učiteli.
6. **Aktivity:** ověřit, že předmětové odkazy nastaví `subject`, zachovají `level/tool/q`, že návrat z detailu obnoví filtr; kontrolovat zobrazení pedagogicky schválené role AI, času přípravy/aktivity a schvalování přímého přístupu žáků.
7. **Asistenti a agenti:** samostatný test cesty z hotového asistenta k vlastnímu agentovi a zpět; štítky vysvětlují rozdíl před klikem.
8. **Filozofování:** wireframe série se 4 očíslovanými díly, prev/next a návratem do magazínu; zkušební sezení ověří chronologii a potvrdit návaznosti podle `seriesNumber`.
9. **Přístupnost:** klávesnice-only na desktopu a mobilním viewportu; kontrola focus, escape, expanded state, landmarks, čtečkového názvu a fallback bez JS. Ověřit nejméně 320/390 px a desktop.
10. **Technická/SEO:** crawl lokálního prototypu; diff povolených URL musí být prázdný; porovnat interní odkazy, canonical, sitemap a redirects beze změny. Tři chybějící sitemap URL a dva canonical tvary přesunout do samostatných úkolů, ne „opravit bokem“.

### Výstup a akceptační kritéria 7C

- Klikatelný statický prototyp nebo izolovaná testovací větev a rozhodovací protokol; žádný deploy.
- Všech 102 stránek má právě jednu schválenou primární kategorii, rodiče a doporučený další krok.
- Desktop a mobil mají shodnou informační architekturu; všech šest cest je dohledatelných bez znalosti názvů nástrojů.
- Žádná URL se nemění, `ai.html` má jedinou primární roli jako katalog „Číst a objevovat“.
- Filtry aktivit se zachovají při navigaci a návratu.
- Cesty asistenti ↔ agenti jsou srozumitelné; obsahové rozhodnutí o sérii je uzavřeno.
- Přístupnost klávesnicí a fallback bez JS jsou zkontrolovány před žádostí o schválení implementace.

## 10. Definitivní obsahová rozhodnutí a zbývající technické otázky

### Definitivní obsahová rozhodnutí 7B

- Schválené hlavní menu zůstává beze změny: **Začít s AI · Připravit výuku · Učit s AI · Nástroje a asistenti · Tvořit s AI · Číst a objevovat**. Domů je dostupné logem; homepage je kořenem webu a zachovává úkolové vstupy.
- `index.html` stojí mimo šest kategorií. Zbývajících 101 obsahových stránek má právě jednu primární oblast; sekundární témata jsou samostatné odkazy.
- `ai-navody.html` lze využít jako širší vstup „Připravit výuku“. Stránky s názvem produktu se zařazují podle skutečného účelu.
- Hotoví asistenti zůstávají v „Nástroje a asistenti“. Tvorba AI agentů zůstává v „Tvořit s AI“; `ai-agenti.html` je agentní rozcestník, nikoli zastřešení celé tvorby. Mezi oblastmi jsou obousměrné odkazy.
- „Práce žáků s AI“ je průřezové téma, ne duplicitní katalog. Nové rozcestníky jsou přípustné, pokud zabrání obsahové kolizi.
- Budoucí rozcestník Filozofování s AI má navrženou URL `/filozofovani-s-ai`, vstupy z homepage a „Číst a objevovat“ a čtyři evidované díly v pořadí `seriesNumber`; URL článků se nemění.

### Zbývající technické otázky — samostatné úkoly, bez automatické opravy

1. Prověřit, zda tři veřejně načtené cílové adresy chybějící v `sitemap.xml` mají být indexovatelné a doplněné do mapy webu.
2. Rozhodnout zamýšlený canonical tvar pro `asistent-ucitele-osobni-ai-asistent.html` a `vibe-coding-bezpecnost-kodu-php2shell.html`; jejich `.html` hodnoty se liší od obvyklých čistých URL.
3. Při budoucí implementaci zkontrolovat interní odkazy, `sitemap.xml`, `_redirects`, canonical a veřejné URL jako samostatný SEO úkol. V této etapě nic z toho neopravovat.

**Předání:** návrh je připraven k pedagogické a uživatelské revizi před zahájením 7C.

