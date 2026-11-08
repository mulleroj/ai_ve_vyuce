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
- **Existující stránky:** `ai-novinky.html` zůstává chronologickým indexem novinek; samostatná landing stránky série je nová, zatím se nevytváří.

## 2. Kompletní mapování 102 obsahových HTML stránek

Každá obsahová HTML má právě jednu primární kategorii, podkategorii, rodiče a název navigační hierarchie. Sekundární odkazy jsou navigační vazby; nevytvářejí druhé kopie. Rodiče označené **[NOVÝ ROZCESTNÍK]** jsou navrhované cílové uzly, nikoli existující URL. U kategorií, kde lze použít existující stránku, je to uvedeno v oddílu 5.

| Současná URL | Název stránky | Primární oblast | Primární podkategorie | Rodičovský rozcestník (cílový uzel) | Název v hierarchii | Sekundární vazba → navržený další krok |
|---|---|---|---|---|---|---|
| `ai-agenti-10-ukolu.html` | 10 úkolů, které může AI agent převzít učiteli | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › 10 úkolů, které může AI agent převzít učiteli | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-agentni-smycka.html` | Jak funguje AI agent: agentní smyčka krok za krokem | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Jak funguje AI agent: agentní smyčka krok za krokem | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-co-je-ai-agent.html` | AI agenti: když AI začne pracovat | Tvořit s AI | Základy agentů a bezpečné použití | `ai-agenti.html` (upravit jako agentní rozcestník) | Základy agentů a bezpečné použití › AI agenti: když AI začne pracovat | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-coding-agenti.html` | Od vibe codingu ke coding agentům | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Od vibe codingu ke coding agentům | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-chatbot-automatizace-workflow.html` | AI agent, automatizace, workflow nebo chatbot? | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › AI agent, automatizace, workflow nebo chatbot? | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-kdy-nepouzivat.html` | Kdy AI agenta ve škole raději nepoužívat | Tvořit s AI | Základy agentů a bezpečné použití | `ai-agenti.html` (upravit jako agentní rozcestník) | Základy agentů a bezpečné použití › Kdy AI agenta ve škole raději nepoužívat | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html` | Jak spolu souvisí LLM, Tools, RAG, Memory, Skills, Workflow a MCP | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Jak spolu souvisí LLM, Tools, RAG, Memory, Skills, Workflow a MCP | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-mcp.html` | MCP: univerzální konektor pro svět AI agentů | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › MCP: univerzální konektor pro svět AI agentů | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-multi-agentni.html` | Multi-agentní systémy: když na jednom úkolu pracuje tým AI | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Multi-agentní systémy: když na jednom úkolu pracuje tým AI | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-nastroje-function-calling.html` | Nástroje a Function Calling: jak dostane AI „ruce“ | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Nástroje a Function Calling: jak dostane AI „ruce“ | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-pamet.html` | Paměť AI agentů: co si AI skutečně pamatuje | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Paměť AI agentů: co si AI skutečně pamatuje | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-prvni-agent.html` | Jak navrhnout svého prvního jednoduchého AI agenta | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Jak navrhnout svého prvního jednoduchého AI agenta | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-rag.html` | RAG: když AI pracuje s vašimi vlastními dokumenty | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › RAG: když AI pracuje s vašimi vlastními dokumenty | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-skills.html` | Skills: jak naučit AI agenta opakovat osvědčený postup | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Skills: jak naučit AI agenta opakovat osvědčený postup | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti-ve-skole.html` | AI agent ve škole: co může skutečně dělat učiteli | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › AI agent ve škole: co může skutečně dělat učiteli | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-agenti.html` | AI agenti | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › AI agenti | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `ai-navod-7-univerzalnich-promptu.html` | 7 univerzálních AI promptů: rychlejší příprava výuky | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › 7 univerzálních AI promptů: rychlejší příprava výuky | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-ai-agent-v-prohlizeci.html` | AI agent v prohlížeči: když AI také pracuje | Připravit výuku | AI agenti a automatizace | `ai-navody.html` (oblastní rozcestník) | AI agenti a automatizace › AI agent v prohlížeči: když AI také pracuje | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-commands-chatgpt.html` | Commands v ChatGPT | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › Commands v ChatGPT | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-edit-kontrola.html` | EDIT: kontrola výstupů | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › EDIT: kontrola výstupů | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-gemini-notebook-infografiky.html` | 7 promptů pro Gemini Notebook | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › 7 promptů pro Gemini Notebook | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-gemini-notebook-prezentace.html` | 7 promptů pro lepší výukovou prezentaci | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › 7 promptů pro lepší výukovou prezentaci | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-gemini-notebook-priprava.html` | 7 promptů pro Gemini Notebook | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › 7 promptů pro Gemini Notebook | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-gemini-notebook-vyuka.html` | Gemini Notebook ve výuce: interaktivní studijní prostředí | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › Gemini Notebook ve výuce: interaktivní studijní prostředí | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-chatgpt-vizualni-materialy.html` | 7 promptů pro ChatGPT: vizuální výukové materiály | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › 7 promptů pro ChatGPT: vizuální výukové materiály | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-chatgpt-zacatek-bezpecne.html` | ChatGPT pro učitele: jak začít bezpečně | Připravit výuku | Bezpečný začátek | `ai-navody.html` (oblastní rozcestník) | Bezpečný začátek › ChatGPT pro učitele: jak začít bezpečně | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-lepsi-prompty-10-zasad.html` | Jak psát lepší prompty pro AI: 10 zásad pro učitele | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › Jak psát lepší prompty pro AI: 10 zásad pro učitele | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-navod-prep-prompty.html` | PREP: lepší prompty | Připravit výuku | Prompty | `ai-navody.html` (upravit jako rozcestník přípravy) | Prompty › PREP: lepší prompty | návod/workflow → použít prompt a ověřit výsledek |
| `ai-navody.html` | Praktické návody pro učitele | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › Praktické návody pro učitele | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `ai-novinka-agenti-onenote-pruvodce-ucenim.html` | AI ve vzdělávání: chytřejší agenti, OneNote v ChatGPT a AI jako průvodce učením | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: chytřejší agenti, OneNote v ChatGPT a AI jako průvodce učením | `ai.html` → související návod nebo workflow |
| `ai-novinka-ai-duvod-premyslet.html` | AI nemá za žáka přemýšlet. Má mu dát důvod přemýšlet. | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI nemá za žáka přemýšlet. Má mu dát důvod přemýšlet. | `ai.html` → související návod nebo workflow |
| `ai-novinka-ai-ve-vzdelavani-srpen-2026.html` | AI ve vzdělávání: co je nového na konci srpna | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: co je nového na konci srpna | `ai.html` → související návod nebo workflow |
| `ai-novinka-ai-ve-vzdelavani-zari-2026.html` | AI ve vzdělávání: přesnější práce s obrázky, bezpečnější přístup k AI a nové zázemí pro školy | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: přesnější práce s obrázky, bezpečnější přístup k AI a nové zázemí pro školy | `ai.html` → související návod nebo workflow |
| `ai-novinka-datovi-agenti-lidske-schvaleni.html` | AI ve vzdělávání: datoví agenti, lidské schvalování a bezpečnější automatizace | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: datoví agenti, lidské schvalování a bezpečnější automatizace | `ai.html` → související návod nebo workflow |
| `ai-novinka-filozofovani-s-ai-chybejici-role.html` | AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo | Číst a objevovat | Filozofování s AI | Nový rozcestník série (bez URL zatím) | Filozofování s AI › AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo | `ai.html` → související návod nebo workflow |
| `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html` | Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI | Číst a objevovat | Filozofování s AI | Nový rozcestník série (bez URL zatím) | Filozofování s AI › Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI | `ai.html` → související návod nebo workflow |
| `ai-novinka-gemini-classroom.html` | Gemini míří přímo do výuky | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Gemini míří přímo do výuky | `ai.html` → související návod nebo workflow |
| `ai-novinka-gemini-desktop-chatgpt-word-agenti.html` | AI ve vzdělávání: Gemini na Windows, ChatGPT ve Wordu a nové hranice pro AI agenty | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: Gemini na Windows, ChatGPT ve Wordu a nové hranice pro AI agenty | `ai.html` → související návod nebo workflow |
| `ai-novinka-gemini-notebook-sablona.html` | Gemini Notebook jako výuková šablona | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Gemini Notebook jako výuková šablona | `ai.html` → související návod nebo workflow |
| `ai-novinka-google-ai-vzdelavani-zari-2026.html` | AI ve vzdělávání: Google posiluje tvorbu materiálů i bezpečnost práce s daty | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: Google posiluje tvorbu materiálů i bezpečnost práce s daty | `ai.html` → související návod nebo workflow |
| `ai-novinka-chatgpt-interaktivni-kvizy.html` | ChatGPT přidává interaktivní kvízy | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › ChatGPT přidává interaktivní kvízy | `ai.html` → související návod nebo workflow |
| `ai-novinka-microsoft-ai-workflow.html` | Microsoft skládá AI workflow pro učitele | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Microsoft skládá AI workflow pro učitele | `ai.html` → související návod nebo workflow |
| `ai-novinka-microsoft-gemini.html` | Microsoft skládá AI do jednoho prostředí | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Microsoft skládá AI do jednoho prostředí | `ai.html` → související návod nebo workflow |
| `ai-novinka-pravidla-ve-skole.html` | AI pravidla ve škole | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI pravidla ve škole | `ai.html` → související návod nebo workflow |
| `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html` | AI ve vzdělávání: sdílené zdroje, propojené aplikace a bezpečnější práce s daty | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › AI ve vzdělávání: sdílené zdroje, propojené aplikace a bezpečnější práce s daty | `ai.html` → související návod nebo workflow |
| `ai-novinka-vykonnejsi-ai.html` | Výkonnější AI se stává běžně dostupnou | Číst a objevovat | Novinky | `ai-novinky.html` | Novinky › Výkonnější AI se stává běžně dostupnou | `ai.html` → související návod nebo workflow |
| `ai-novinky.html` | AI ve vzdělávání: co opravdu stojí za pozornost | Číst a objevovat | Novinky | `ai.html` | Novinky › AI ve vzdělávání: co opravdu stojí za pozornost | `ai.html` → související návod nebo workflow |
| `ai-workflow-10-promptu-gemini.html` | 10 promptů: pro Gemini Notebook | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › 10 promptů: pro Gemini Notebook | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-18-promptu.html` | 18 promptů: pro učitele | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › 18 promptů: pro učitele | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-7-kroku-gemini-notebook.html` | 7 kroků: od zdrojů k AI tutorovi | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › 7 kroků: od zdrojů k AI tutorovi | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-8-otazek.html` | 8 otázek: AI ve výuce | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › 8 otázek: AI ve výuce | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-css-grid-vibe-coding.html` | CSS Grid: proč se při vibe codingu vyplatí rozumět řádkům a sloupcům | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › CSS Grid: proč se při vibe codingu vyplatí rozumět řádkům a sloupcům | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `ai-workflow-fotografie-ucebnice.html` | Fotografii učebnice už nemusíte přepisovat | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › Fotografii učebnice už nemusíte přepisovat | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-gemini-notebook-ai-agent.html` | Chytrý učitelský sešit v Gemini Notebooku | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › Chytrý učitelský sešit v Gemini Notebooku | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-chatgpt-images-2-5.html` | ChatGPT Images 2.5 ve výuce: od jednoduchého obrázku k výukovému materiálu | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › ChatGPT Images 2.5 ve výuce: od jednoduchého obrázku k výukovému materiálu | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-prep-edit.html` | PREP + EDIT: AI workflow ve škole | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › PREP + EDIT: AI workflow ve škole | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-prezentace-webova-stranka.html` | Od prezentace k webové stránce | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › Od prezentace k webové stránce | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-udl-ai.html` | UDL + AI: více cest k cíli | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › UDL + AI: více cest k cíli | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-usetri-praci.html` | Jak AI: šetří práci | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › Jak AI: šetří práci | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-workflow-vibe-coding.html` | Vibe coding krok za krokem | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › Vibe coding krok za krokem | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `ai-workflow.html` | Workflow: ChatGPT → Claude | Připravit výuku | Workflow | `ai-navody.html` (upravit jako rozcestník přípravy) | Workflow › Workflow: ChatGPT → Claude | návody a prompty k jednotlivým krokům → použít aktivitu ve výuce |
| `ai-ziva-hlasova-ai-ve-vyuce.html` | Když AI začne skutečně naslouchat: živá hlasová umělá inteligence ve výuce | Číst a objevovat | Články | `ai.html` | Články › Když AI začne skutečně naslouchat: živá hlasová umělá inteligence ve výuce | návod / aktivita → přenést poznatek do přípravy a výuky |
| `ai.html` | AI ve vzdělávání: co opravdu stojí za pozornost | Číst a objevovat | Články a katalog obsahu | Hlavní rozcestník oblasti | Články a katalog obsahu › AI ve vzdělávání: co opravdu stojí za pozornost | návody / workflow / témata → konkrétní detail |
| `aktivity.html` | Výukové aktivity s AI | Učit s AI | Knihovna aktivit | Hlavní rozcestník oblasti | Knihovna aktivit › Výukové aktivity s AI | role AI a čas → detail vhodné aktivity; odtud související návod |
| `anglictina.html` | Anglický jazyk s AI | Učit s AI | Výuka podle předmětů |  | Výuka podle předmětů › Anglický jazyk s AI | role AI a čas → detail vhodné aktivity; odtud související návod |
| `asistent-ucitele-osobni-ai-asistent.html` | Asistent učitele: Pomocník, který pedagogům dosud chyběl | Nástroje a asistenti | Hotoví AI asistenti | `asistenti.html` | Hotoví AI asistenti › Asistent učitele: Pomocník, který pedagogům dosud chyběl | návod / aktivita → přenést poznatek do přípravy a výuky |
| `asistenti.html` | AI asistenti a boti | Nástroje a asistenti | Hotoví AI asistenti | `asistenti.html` (upravit jako oblastní rozcestník) | Hotoví AI asistenti › AI asistenti a boti | `ai-agenti.html` → jak postavit a otestovat vlastního agenta |
| `asistenti/math-cermat.html` | MathCERMAT | Nástroje a asistenti | Hotoví AI asistenti | `asistenti.html` | Hotoví AI asistenti › MathCERMAT | vlastní agenti → `ai-agenti.html` nebo návod k použití |
| `asistenti/metodicky-asistent-gemini.html` | Metodický asistent (Gemini Gem) | Nástroje a asistenti | Hotoví AI asistenti | `asistenti.html` | Hotoví AI asistenti › Metodický asistent (Gemini Gem) | vlastní agenti → `ai-agenti.html` nebo návod k použití |
| `cestina.html` | Český jazyk s AI | Učit s AI | Výuka podle předmětů |  | Výuka podle předmětů › Český jazyk s AI | role AI a čas → detail vhodné aktivity; odtud související návod |
| `claude-pro-ucitele.html` | Claude pro učitele | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Claude pro učitele | úkolový návod → porovnat alternativní nástroj |
| `co-se-muze-ucitel-naucit-od-youtube.html` | Co se může učitel naučit od YouTube? Pozornost žáků není samozřejmost | Číst a objevovat | Články | `ai.html` | Články › Co se může učitel naučit od YouTube? Pozornost žáků není samozřejmost | návod / aktivita → přenést poznatek do přípravy a výuky |
| `copilot-pro-ucitele.html` | Microsoft Copilot pro učitele | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Microsoft Copilot pro učitele | úkolový návod → porovnat alternativní nástroj |
| `dejepis.html` | Dějepis s AI | Učit s AI | Výuka podle předmětů |  | Výuka podle předmětů › Dějepis s AI | role AI a čas → detail vhodné aktivity; odtud související návod |
| `gemini-desktop-navod-pro-ucitele.html` | Gemini Desktop pro učitele: instalace a první kroky ve Windows | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Gemini Desktop pro učitele: instalace a první kroky ve Windows | úkolový návod → porovnat alternativní nástroj |
| `gemini-notebook-navod-pro-ucitele.html` | Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci | úkolový návod → porovnat alternativní nástroj |
| `gemini-notebook-prompty.html` | Prompty pro Gemini Notebook | Připravit výuku | Prompty | `ai-navody.html` (upravit jako rozcestník přípravy) | Prompty › Prompty pro Gemini Notebook | návod/workflow → použít prompt a ověřit výsledek |
| `gemini-notebook-ucitel-vidi-chaty-zaku.html` | Učitel nově uvidí, jak se žáci učí s AI. Google Gemini Notebook otevírá novou kapitolu výuky | Připravit výuku | Workflow | `ai-navody.html` (oblastní rozcestník) | Workflow › Učitel nově uvidí, jak se žáci učí s AI. Google Gemini Notebook otevírá novou kapitolu výuky | příslušný nástrojový přehled → použít v hodině nebo aktivitě |
| `gemini-notebook.html` | Gemini Notebook | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Gemini Notebook | úkolový návod → porovnat alternativní nástroj |
| `gemini-pro-ucitele.html` | Google Gemini pro učitele | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Google Gemini pro učitele | úkolový návod → porovnat alternativní nástroj |
| `gemini-skills-pro-ucitele.html` | Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat | úkolový návod → porovnat alternativní nástroj |
| `gemini-storybook-navod-pro-ucitele.html` | Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku | úkolový návod → porovnat alternativní nástroj |
| `google-ai-studio-2026-vibe-coding.html` | Google AI Studio 2026: od jednoduchého promptu k celé aplikaci | Tvořit s AI | Vibe coding | `vibe-coding.html` | Vibe coding › Google AI Studio 2026: od jednoduchého promptu k celé aplikaci | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `chatgpt-pro-ucitele.html` | ChatGPT pro učitele | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › ChatGPT pro učitele | úkolový návod → porovnat alternativní nástroj |
| `index.html` | Umělá inteligence ve škole, která má smysl. | Začít s AI | Úkolové vstupy homepage | Kořenový vstup webu (logo vede zpět) | Začít s AI › Úkolové vstupy | všech šest oblastí → zvolit jeden úkolový vstup |
| `katalog-asistenti.html` | Hotoví AI asistenti pro učitele | Nástroje a asistenti | Hotoví AI asistenti | `asistenti.html` (upravit jako oblastní rozcestník) | Hotoví AI asistenti › Hotoví AI asistenti pro učitele | `ai-agenti.html` → jak postavit a otestovat vlastního agenta |
| `kdyz-ai-jedna-odpovednost-ai-agenta.html` | Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta? | Tvořit s AI | AI agenti a automatizace | `ai-agenti.html` (upravit jako agentní rozcestník) | AI agenti a automatizace › Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta? | `asistenti.html` → rozlišit hotového asistenta od návrhu vlastního agenta |
| `matematika.html` | Matematika s AI | Učit s AI | Výuka podle předmětů |  | Výuka podle předmětů › Matematika s AI | role AI a čas → detail vhodné aktivity; odtud související návod |
| `neplytvej-inteligenci-ai-modely.html` | Neplýtvej inteligencí | Číst a objevovat | Články | `ai.html` | Články › Neplýtvej inteligencí | návod / aktivita → přenést poznatek do přípravy a výuky |
| `notebooklm-hlasovy-rozhovor-nad-zdroji.html` | Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM | Připravit výuku | Workflow | `ai-navody.html` (oblastní rozcestník) | Workflow › Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM | příslušný nástrojový přehled → použít v hodině nebo aktivitě |
| `perplexity-pro-ucitele.html` | Perplexity pro učitele | Nástroje a asistenti | Přehled AI nástrojů | `asistenti.html` (oblastní přehled nástrojů + hotových asistentů) | Přehled AI nástrojů › Perplexity pro učitele | úkolový návod → porovnat alternativní nástroj |
| `prirodoveda.html` | Přírodní vědy s AI | Učit s AI | Výuka podle předmětů |  | Výuka podle předmětů › Přírodní vědy s AI | role AI a čas → detail vhodné aktivity; odtud související návod |
| `prompty.html` | Knihovna Promptů | Připravit výuku | Prompty | `ai-navody.html` (upravit jako rozcestník přípravy) | Prompty › Knihovna Promptů | návod/workflow → použít prompt a ověřit výsledek |
| `qr-kod.html` | Vytvořte QR kód z odkazu | Nástroje a asistenti | Užitečné nástroje | `asistenti.html` | Užitečné nástroje › Vytvořte QR kód z odkazu | aktivita → použít QR kód pro distribuci odkazu |
| `skill-anglictina-vyukove-materialy.html` | Jeden SKILL, sedm výukových materiálů: AI pomocník pro angličtinu | Připravit výuku | Praktické návody | `ai-navody.html` (oblastní rozcestník) | Praktické návody › Jeden SKILL, sedm výukových materiálů: AI pomocník pro angličtinu | `prompty.html` nebo relevantní workflow → navázat na aktivitu |
| `uci-se-zak-nebo-za-nej-premysli-ai.html` | Učí se žák, nebo za něj přemýšlí AI? | Číst a objevovat | Práce žáků s AI | Učit s AI (rozcestník oblasti) | Práce žáků s AI › Učí se žák, nebo za něj přemýšlí AI? | návod / aktivita → přenést poznatek do přípravy a výuky |
| `vibe-coding-bezpecnost-kodu-php2shell.html` | Vibe Coding: AI ti naprogramuje aplikaci. Ale kdo zkontroluje její bezpečnost? | Tvořit s AI | Bezpečnost a testování | `vibe-coding.html` | Bezpečnost a testování › Vibe Coding: AI ti naprogramuje aplikaci. Ale kdo zkontroluje její bezpečnost? | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `vibe-coding-clanky.html` | Články o Vibe Codingu | Tvořit s AI | Vibe coding – články | `vibe-coding.html` | Vibe coding – články › Články o Vibe Codingu | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `vibe-coding-pro-ucitele.html` | Co si můžete vytvořit do výuky | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › Co si můžete vytvořit do výuky | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `vibe-coding-prompty.html` | Prompty pro Vibe Coding | Tvořit s AI | Vibe coding – prompty | `vibe-coding.html` | Vibe coding – prompty › Prompty pro Vibe Coding | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `vibe-coding-ucitele.html` | Úvod do vibe codingu pro učitele | Tvořit s AI | Vlastní výukové aplikace | `vibe-coding.html` | Vlastní výukové aplikace › Úvod do vibe codingu pro učitele | bezpečnost/testování → projekt nebo návod k ověření aplikace |
| `vibe-coding.html` | Vibe Coding | Tvořit s AI | Vibe coding | `vibe-coding.html` | Vibe coding › Vibe Coding | bezpečnost/testování → projekt nebo návod k ověření aplikace |

## 3. Striktní rozlišení asistentů a agentů

| Pojem | Definice | Primární oblast | Správné pokračování |
|---|---|---|---|
| **Hotový AI asistent** | Nástroj nebo připravený pomocník, kterého učitel otevře a používá při konkrétním úkolu. | Nástroje a asistenti → Hotoví AI asistenti | vybrat pomocníka → návod k použití → ověřit odpověď / aktivitu |
| **Tvorba AI agenta** | Postup návrhu, konfigurace oprávnění, nástrojů a paměti, testování a dohledu nad vlastním agentem. | Tvořit s AI → AI agenti a automatizace | vysvětlit pojem → navrhnout omezený úkol → testovat a zavést lidské schválení |

V obou rozcestnících se umístí jeden kontextový odkaz: z hotových asistentů „Chcete si navrhnout vlastního agenta?“ → `ai-agenti.html`; z tvorby agentů „Hledáte už hotového pomocníka?“ → `asistenti.html`. Zmínka o agentovi v článku o asistentovi je sekundární odkaz, nikoli změna primární kategorie. **Obsahové rozhodnutí:** zda některé konkrétní záznamy v `katalog-asistenti.html` jsou produkty, uživatelské konfigurace nebo vlastní agentské projekty; ověřit jednotlivě při 7C prototypu.

## 4. Koncept samostatného rozcestníku série „Filozofování s AI“

**Nový rozcestník – žádná nová URL ani HTML se v 7B nevytváří.** Do realizace schválit místo URL; doporučený návrh `/filozofovani-s-ai` bude až samostatné rozhodnutí. Stávající URL všech článků zůstávají beze změny.

- **Úvod:** série zkoumá, jak AI mění učení, odpovědnost, práci a lidskou roli. Je určena učitelům, kteří chtějí kriticky uvažovat o dopadech technologie, ne jen vyzkoušet funkci.
- **Díly podle číslování v `js/site-articles.js`:**
  1. `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html` — „Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI“.
  2. `ai-novinka-filozofovani-s-ai-chybejici-role.html` — „AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo“.
  3. `ai-novinka-ai-duvod-premyslet.html` — „AI nemá za žáka přemýšlet. Má mu dát důvod přemýšlet.“ (v registru je série, část titulku je didakticky orientovaná).
  4. `kdyz-ai-jedna-odpovednost-ai-agenta.html` — „Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta?“ (registr označuje sérii; téma odpovědnosti agentů).
- **Navigace dílu:** zobrazit číslo série, odkaz na rozcestník, přesně jeden předchozí a jeden následující díl; první nemá předchozí, poslední nemá následující. Při čtení z katalogu zachovat odkaz „Zpět do magazínu“ (`ai.html` nebo `ai-novinky.html` podle vstupního kontextu).
- **Související témata:** práce žáků s AI; Human in the Loop; bezpečnost a odpovědnost agentů; praktická aktivita/otázky pro diskusi. Doporučit nejvýše 2–4 odkazy a odlišit „další díl“ od tematických souvislostí.
- **Uspořádání:** primárně číslování z registru. **Obsahové rozhodnutí:** zda díl #3 má zůstat v sérii (registr ho dnes označuje), protože přináší i praktický didaktický návod; zda text o odpovědnosti agenta je tematický epilog série, nebo samostatný článek. Do rozhodnutí neměnit stávající označení ani pořadí automaticky.

## 5. Šest rozcestníků – účel, obsah a status

| Oblast | Účel a cílový návštěvník | Základní navigační položky a praktické vstupy | Existující obsah / reuse | Související oblast a doporučené pokračování |
|---|---|---|---|---|
| Začít s AI | Bezpečně provést začátečníka od prvního dotazu ke kontrole odpovědi | bezpečný začátek; základy; pravidla/data; „Zkuste první úkol“ | **Nový rozcestník potřebný.** Využít `ai-navod-chatgpt-zacatek-bezpecne.html`, `ai-agenti-co-je-ai-agent.html`, pravidla ve škole; nevytvářet nový obecný článek | Připravit výuku → krátký návod/prompt; nástroje → dostupný nástroj |
| Připravit výuku | Pomoci učiteli připravit hodinu, pracovní list, test nebo podklad | připravit hodinu; materiály; návody; prompty; workflow; CTA „Vyberte úkol“ | Upravit `ai-navody.html` jako rozcestník; reuse `prompty.html`, `ai-workflow.html`, příslušné detaily | Učit s AI → aktivita; nástroje → nástroj podle úkolu |
| Učit s AI | Najít pedagogicky použitelný scénář pro třídu/předmět | knihovna; předměty; žáci s AI; filtry předmět/ročník/nástroj | `aktivity.html` je hlavní existující rozcestník/katalog; předmětové stránky jako kurátorované vstupy | Připravit výuku → příprava a pracovní list; Začít s AI → pravidla přístupu |
| Nástroje a asistenti | Vybrat službu nebo hotového pomocníka pro potřebu učitele | srovnat podle úkolu; nástroje; hotoví asistenti | Reuse `asistenti.html` jako kandidáta na oblastní vstup; `katalog-asistenti.html` pouze hotové asistenty; produktové detaily zůstávají | Připravit výuku → návod pro vybraný nástroj; Tvořit s AI → vlastní agent |
| Tvořit s AI | Vést pokročilejšího učitele k prototypu aplikace či agenta a k ověření bezpečnosti | vibe coding; aplikace; agenti/automatizace; testování/bezpečnost | `vibe-coding.html` jako existující vstup pro aplikace; `ai-agenti.html` pro agentní větev; **rozhodnout**, zda je nutný nový sjednocující rozcestník, nebo se `ai-agenti.html` rozšíří o vibe coding | Nástroje a asistenti → hotový příklad; Připravit výuku → použití aplikace v hodině |
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
| `skill-anglictina-vyukove-materialy.html` | `/skill-anglictina-vyukove-materialy` | ne | Prověřit soulad zip/download, veřejné stránky, `noindex` a canonical; pokud má být veřejný detail, doplnit sitemapu. |

### Dvě canonical URL s odlišným tvarem

| HTML soubor | Canonical ve zdroji | Redirect | Co ověřit |
|---|---|---|---|
| `asistent-ucitele-osobni-ai-asistent.html` | `/asistent-ucitele-osobni-ai-asistent.html` | Pro tuto stránku není v `_redirects` specifické pravidlo `.html` → bez přípony; produkční stránka načetla přímo `.html` URL. | Canonical je v rozporu s obvyklou bezpříponovou cestou v sitemapě. Ověřit provozní záměr a vybrat jednu kanonickou variantu. |
| `vibe-coding-bezpecnost-kodu-php2shell.html` | `/vibe-coding-bezpecnost-kodu-php2shell.html` | Pro tuto stránku není v `_redirects` specifické pravidlo `.html` → bez přípony; produkční stránka načetla přímo `.html` URL. | Canonical je v rozporu s obvyklou bezpříponovou cestou v sitemapě. Ověřit provozní záměr a vybrat jednu kanonickou variantu. |

**Produkční URL – kontrola 8. 11. 2026:** přímé otevření v prohlížeči potvrdilo, že všechny tři sitemapou vynechané bezpříponové URL načítají odpovídající obsah a jejich produkční canonical odpovídá této bezpříponové cestě. Obě `.html` stránky se také načetly na přesné `.html` adrese a produkční canonical obsahoval `.html`; žádné konkrétní přesměrovací pravidlo pro tyto dvě cesty v `_redirects` není. To je reálný nesoulad se sitemapou, kde je shodný slug uveden bez přípony. Prohlížečová kontrola nevrátila HTTP status ani hlavičky `Location`; přesný status/redirect je proto ještě třeba ověřit HTTP crawl/Netlify logem. Tři sitemapové výpadky a oba canonical rozpory zůstávají rozhodnutími, nic se neopravuje v 7B. Nedoplňovat canonical/sitemap/redirecty v tomto dokumentačním PR.

Další kontroly pro 7C/SEO: srovnat každý indexovatelný canonical s jednou sitemap URL; potvrdit záměr u `noindex`; kontrolovat katalogové karty na platné interní href; query filtry mají zůstat nekanonickými stavy a všechny vést na stejnou canonical stránku; zachovat 94 existujících 301 a nepřidávat řetězce/smyčky. URL se v 7B nemění.

## 9. Přesný plán prototypu etapy 7C

### Záměr

Prototyp navigačního kontraktu na stávajících šablonách bez přestavby webu. Kód/HTML změny budou až po přijetí tohoto dokumentu k obsahové revizi; v této 7B etapě se nevykonávají.

### Rozsah prototypu

1. **IA manifest:** definovat šest oblastí, přesné štítky/podštítky a datové schéma; přidělit všech 102 stránek dle tabulky. Vložit review checkbox pro všechny položky označené **[OBSAHOVÉ ROZHODNUTÍ]**.
2. **Čtyři reprezentativní šablony:** homepage; katalog obsahu `ai.html`; knihovna `aktivity.html`; specializovaný microsite `vibe-coding.html`. Dále kontrolní stránka detailu článku a návodu kvůli breadcrumbs.
3. **Strom menu:** desktop dropdowny a mobilní disclosure vykreslené ze stejného seznamu. Prototyp obsahuje logo → Domů, 6 oblastí, stejné názvy a jasné označení aktuální oblasti/podkategorie.
4. **Rozcestníky:** navrhnout obsahové wireframy pro šest sekcí; existující cílové stránky využít dle části 5. Nová HTML ani nové URL se v prototype specification nepřidávají.
5. **Cesty:** projít šest cest v oddílu 6; max. dva kliky do primárního cíle při přímém vstupu z homepage; zaznamenat rozhodování, slepé odbočky a zda návazný krok pomáhá učiteli.
6. **Aktivity:** ověřit, že předmětové odkazy nastaví `subject`, zachovají `level/tool/q`, že návrat z detailu obnoví filtr; kontrolovat zobrazení pedagogicky schválené role AI, času přípravy/aktivity a schvalování přímého přístupu žáků.
7. **Asistenti a agenti:** samostatný test cesty z hotového asistenta k vlastnímu agentovi a zpět; štítky vysvětlují rozdíl před klikem.
8. **Filozofování:** wireframe série se 4 očíslovanými díly, prev/next a návratem do magazínu; zkušební sezení ověří chronologii a zda #3/#4 skutečně patří do série.
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

## 10. Otevřená obsahová rozhodnutí před implementací

1. **[OBSAHOVÉ ROZHODNUTÍ]** Zda `ai-navody.html` může být zastřešující rozcestník „Připravit výuku“, aniž by slovo „návody“ mylně slibovalo jen formát návodu; navržený název navigace zůstává „Připravit výuku“.
2. **[OBSAHOVÉ ROZHODNUTÍ]** Zda `asistenti.html` může být jedním rozcestníkem jak nástrojů, tak hotových asistentů, nebo potřebuje rozšířený stávající katalog bez nové URL.
3. **[OBSAHOVÉ ROZHODNUTÍ]** Zda `ai-agenti.html` rozšířit na celý rozcestník „Tvořit s AI“, nebo ponechat jako podstránku a společný rozcestník umístit na existující `vibe-coding.html`.
4. **[OBSAHOVÉ ROZHODNUTÍ]** Které čtyři díly oficiálně tvoří sérii Filozofování s AI, zvláště prakticky laděný díl #3 a agentně orientovaný díl #4.
5. **[OBSAHOVÉ ROZHODNUTÍ]** Zda nové URL/stránky rozcestníků jsou v pozdější etapě vůbec přijatelné; 7B upřednostňuje úpravu stávajících vstupů a URL nemění.
6. **[SEO ROZHODNUTÍ]** Zda tři stránky chybějící v sitemapě mají být indexovatelné a zda canonical u dvou `.html` stránek má ukazovat na redirectovaný extensionless cíl.
7. **[OBSAHOVÉ ROZHODNUTÍ]** Jestli „Práce žáků s AI“ patří jako samostatná stránka/podkategorie, nebo je to průřezový štítek a filtrovací vstup do aktivit.

**Předání:** návrh je připraven k závěrečné obsahové revizi pedagogem a učitelem běžným uživatelem webu. Zahájení 7C prototypování a následné implementace je podmíněno vypořádáním označených rozhodnutí.






