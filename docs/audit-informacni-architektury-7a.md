# Audit informační architektury AI VE VÝUCE – etapa 7A

**Rozsah aktualizace 8. 11. 2026:** ověřený aktuální `origin/master` `899d11ee5a15e66fc8d7d71d1b2c1470c560c3c1` (produkční potvrzený commit) získaný `git fetch origin master`. Snapshot byl vybalen do izolovaného archivačního adresáře; hlavní pracovní kopie a jejích WIP změny zachovány. Audit nyní vychází z přesně zadaného commitu. Před implementací ověřit audit proti aktuálnímu `master` na remote.

**Rozsah práce:** analytický návrh. Produkční HTML/CSS/JS, URL, indexace ani přesměrování nebyly měněny. Inventura čítá 103 HTML souborů: 102 obsahových/veřejných HTML a 1 ověřovací HTML Google mimo navigaci. Na této revizi je 44 aktivit v knihovně, 97 URL v sitemapě a 94 pravidel v `_redirects`.

## 1. Inventura veřejných HTML stránek

Následující seznam přiřazuje každou stránku k funkční skupině podle současného názvu, titulku a pozice v hierarchii. Interní odkazy fungují převážně jako síť mezi rozcestníky, kartami v tematických sériích a sekcemi „související obsah“; není zde univerzální rodičovská hierarchie ani společná cesta zpět. „Typické vstupy / pokračování“ shrnuje opakující se odkazy nalezené v tématu a navrhuje očekávaný další krok; není to garantovaný jediný klikací odkaz na každé stránce. Detailní jednotlivé hrany je třeba před implementací znovu strojově zkontrolovat, protože odkazy mohou být v generovaných šablonách.

| URL | Název / skutečný účel | Čtenář a oblast | Současné umístění | Typické vstupy → pokračování / problém |
|---|---|---|---|---|
| `ai-agenti-10-ukolu.html` | 10 úkolů, které může AI agent převzít učiteli | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-agentni-smycka.html` | Jak funguje AI agent: agentní smyčka krok za krokem | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-co-je-ai-agent.html` | AI agenti: když AI začne pracovat | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-coding-agenti.html` | Od vibe codingu ke coding agentům | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-chatbot-automatizace-workflow.html` | AI agent, automatizace, workflow nebo chatbot? | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-kdy-nepouzivat.html` | Kdy AI agenta ve škole raději nepoužívat | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html` | Jak spolu souvisí LLM, Tools, RAG, Memory, Skills, Workflow a MCP | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-mcp.html` | MCP: univerzální konektor pro svět AI agentů | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-multi-agentni.html` | Multi-agentní systémy: když na jednom úkolu pracuje tým AI | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-nastroje-function-calling.html` | Nástroje a Function Calling: jak dostane AI „ruce“ | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-pamet.html` | Paměť AI agentů: co si AI skutečně pamatuje | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-prvni-agent.html` | Jak navrhnout svého prvního jednoduchého AI agenta | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-rag.html` | RAG: když AI pracuje s vašimi vlastními dokumenty | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-skills.html` | Skills: jak naučit AI agenta opakovat osvědčený postup | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti-ve-skole.html` | AI agent ve škole: co může skutečně dělat učiteli | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-agenti.html` | AI agenti | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `ai-navod-7-univerzalnich-promptu.html` | 7 univerzálních AI promptů: rychlejší příprava výuky | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-ai-agent-v-prohlizeci.html` | AI agent v prohlížeči: když AI také pracuje | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-commands-chatgpt.html` | Commands v ChatGPT | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-edit-kontrola.html` | EDIT: kontrola výstupů | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-gemini-notebook-infografiky.html` | 7 promptů pro Gemini Notebook | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-gemini-notebook-prezentace.html` | 7 promptů pro lepší výukovou prezentaci | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-gemini-notebook-priprava.html` | 7 promptů pro Gemini Notebook | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-gemini-notebook-vyuka.html` | Gemini Notebook ve výuce: interaktivní studijní prostředí | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-chatgpt-vizualni-materialy.html` | 7 promptů pro ChatGPT: vizuální výukové materiály | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-chatgpt-zacatek-bezpecne.html` | ChatGPT pro učitele: jak začít bezpečně | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-lepsi-prompty-10-zasad.html` | Jak psát lepší prompty pro AI: 10 zásad pro učitele | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navod-prep-prompty.html` | PREP: lepší prompty | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-navody.html` | Praktické návody pro učitele | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `ai-novinka-agenti-onenote-pruvodce-ucenim.html` | AI ve vzdělávání: chytřejší agenti, OneNote v ChatGPT a AI jako průvodce učením | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-ai-duvod-premyslet.html` | AI nemá za žáka přemýšlet. Má mu dát důvod přemýšlet. | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-ai-ve-vzdelavani-srpen-2026.html` | AI ve vzdělávání: co je nového na konci srpna | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-ai-ve-vzdelavani-zari-2026.html` | AI ve vzdělávání: přesnější práce s obrázky, bezpečnější přístup k AI a nové zázemí pro školy | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-datovi-agenti-lidske-schvaleni.html` | AI ve vzdělávání: datoví agenti, lidské schvalování a bezpečnější automatizace | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-filozofovani-s-ai-chybejici-role.html` | AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html` | Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-gemini-classroom.html` | Gemini míří přímo do výuky | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-gemini-desktop-chatgpt-word-agenti.html` | AI ve vzdělávání: Gemini na Windows, ChatGPT ve Wordu a nové hranice pro AI agenty | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-gemini-notebook-sablona.html` | Gemini Notebook jako výuková šablona | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-google-ai-vzdelavani-zari-2026.html` | AI ve vzdělávání: Google posiluje tvorbu materiálů i bezpečnost práce s daty | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-chatgpt-interaktivni-kvizy.html` | ChatGPT přidává interaktivní kvízy | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-microsoft-ai-workflow.html` | Microsoft skládá AI workflow pro učitele | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-microsoft-gemini.html` | Microsoft skládá AI do jednoho prostředí | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-pravidla-ve-skole.html` | AI pravidla ve škole | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html` | AI ve vzdělávání: sdílené zdroje, propojené aplikace a bezpečnější práce s daty | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinka-vykonnejsi-ai.html` | Výkonnější AI se stává běžně dostupnou | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-novinky.html` | AI ve vzdělávání: co opravdu stojí za pozornost | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `ai-workflow-10-promptu-gemini.html` | 10 promptů: pro Gemini Notebook | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-18-promptu.html` | 18 promptů: pro učitele | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-7-kroku-gemini-notebook.html` | 7 kroků: od zdrojů k AI tutorovi | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-8-otazek.html` | 8 otázek: AI ve výuce | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-css-grid-vibe-coding.html` | CSS Grid: proč se při vibe codingu vyplatí rozumět řádkům a sloupcům | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-fotografie-ucebnice.html` | Fotografii učebnice už nemusíte přepisovat | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-gemini-notebook-ai-agent.html` | Chytrý učitelský sešit v Gemini Notebooku | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-chatgpt-images-2-5.html` | ChatGPT Images 2.5 ve výuce: od jednoduchého obrázku k výukovému materiálu | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-prep-edit.html` | PREP + EDIT: AI workflow ve škole | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-prezentace-webova-stranka.html` | Od prezentace k webové stránce | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-udl-ai.html` | UDL + AI: více cest k cíli | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-usetri-praci.html` | Jak AI: šetří práci | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow-vibe-coding.html` | Vibe coding krok za krokem | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-workflow.html` | Workflow: ChatGPT → Claude | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai-ziva-hlasova-ai-ve-vyuce.html` | Když AI začne skutečně naslouchat: živá hlasová umělá inteligence ve výuce | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `ai.html` | AI ve vzdělávání: co opravdu stojí za pozornost | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `aktivity.html` | Výukové aktivity s AI | učitel podle úkolu nebo předmětu · Tematické rozcestníky / knihovna | Tematické rozcestníky / knihovna | hlavní navigace / homepage → karty, aktivity, návody; terminologie lišící se mezi katalogem a články |
| `anglictina.html` | Anglický jazyk s AI | učitel podle úkolu nebo předmětu · Tematické rozcestníky / knihovna | Tematické rozcestníky / knihovna | hlavní navigace / homepage → karty, aktivity, návody; terminologie lišící se mezi katalogem a články |
| `asistent-ucitele-osobni-ai-asistent.html` | Asistent učitele: Pomocník, který pedagogům dosud chyběl | učitel hledající hotového pomocníka · Asistenti a boti | Asistenti a boti | homepage / rozcestník asistentů → katalog / detail asistenta; obsah i nástrojová nabídka splývají |
| `asistenti.html` | AI asistenti a boti | učitel hledající hotového pomocníka · Asistenti a boti | Asistenti a boti | homepage / rozcestník asistentů → katalog / detail asistenta; obsah i nástrojová nabídka splývají |
| `asistenti/math-cermat.html` | MathCERMAT | učitel ZŠ/SŠ · Články / novinky | Články / novinky | homepage / související tematické stránky → tematický rozcestník nebo návazný obsah |
| `asistenti/metodicky-asistent-gemini.html` | Metodický asistent (Gemini Gem) | učitel ZŠ/SŠ · Články / novinky | Články / novinky | homepage / související tematické stránky → tematický rozcestník nebo návazný obsah |
| `cestina.html` | Český jazyk s AI | učitel podle úkolu nebo předmětu · Tematické rozcestníky / knihovna | Tematické rozcestníky / knihovna | hlavní navigace / homepage → karty, aktivity, návody; terminologie lišící se mezi katalogem a články |
| `claude-pro-ucitele.html` | Claude pro učitele | učitel porovnávající nástroje · Přehled AI nástrojů | Přehled AI nástrojů | katalog nástrojů / tematické články → detail nástroje a návod; navigační vstup není jednotný |
| `co-se-muze-ucitel-naucit-od-youtube.html` | Co se může učitel naučit od YouTube? Pozornost žáků není samozřejmost | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `copilot-pro-ucitele.html` | Microsoft Copilot pro učitele | učitel porovnávající nástroje · Přehled AI nástrojů | Přehled AI nástrojů | katalog nástrojů / tematické články → detail nástroje a návod; navigační vstup není jednotný |
| `dejepis.html` | Dějepis s AI | učitel podle úkolu nebo předmětu · Tematické rozcestníky / knihovna | Tematické rozcestníky / knihovna | hlavní navigace / homepage → karty, aktivity, návody; terminologie lišící se mezi katalogem a články |
| `gemini-desktop-navod-pro-ucitele.html` | Gemini Desktop pro učitele: instalace a první kroky ve Windows | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `gemini-notebook-navod-pro-ucitele.html` | Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `gemini-notebook-prompty.html` | Prompty pro Gemini Notebook | učitel ZŠ/SŠ · Články / novinky | Články / novinky | homepage / související tematické stránky → tematický rozcestník nebo návazný obsah |
| `gemini-notebook-ucitel-vidi-chaty-zaku.html` | Učitel nově uvidí, jak se žáci učí s AI. Google Gemini Notebook otevírá novou kapitolu výuky | učitel ZŠ/SŠ · Články / novinky | Články / novinky | homepage / související tematické stránky → tematický rozcestník nebo návazný obsah |
| `gemini-notebook.html` | Gemini Notebook | učitel porovnávající nástroje · Přehled AI nástrojů | Přehled AI nástrojů | katalog nástrojů / tematické články → detail nástroje a návod; navigační vstup není jednotný |
| `gemini-pro-ucitele.html` | Google Gemini pro učitele | učitel porovnávající nástroje · Přehled AI nástrojů | Přehled AI nástrojů | katalog nástrojů / tematické články → detail nástroje a návod; navigační vstup není jednotný |
| `gemini-skills-pro-ucitele.html` | Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `gemini-storybook-navod-pro-ucitele.html` | Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `google-ai-studio-2026-vibe-coding.html` | Google AI Studio 2026: od jednoduchého promptu k celé aplikaci | pokročilejší učitel / tvůrce · Vibe coding | Vibe coding | vibe coding rozcestník / workflow / novinky → projekty, bezpečnost; samostatná navigační varianta |
| `googled4301464bc8f67c5.html` | ověřovací stránka Google | vyhledávač / správce · Technické / ověření | Technické / ověření | žádné; mimo navigaci a sitemapu |
| `chatgpt-pro-ucitele.html` | ChatGPT pro učitele | učitel porovnávající nástroje · Přehled AI nástrojů | Přehled AI nástrojů | katalog nástrojů / tematické články → detail nástroje a návod; navigační vstup není jednotný |
| `index.html` | Umělá inteligence ve škole, která má smysl. | všichni návštěvníci · Domů | Domů | vstupní stránka → potřeby, aktuality, obory, rozcestníky |
| `katalog-asistenti.html` | Hotoví AI asistenti pro učitele | učitel hledající hotového pomocníka · Asistenti a boti | Asistenti a boti | homepage / rozcestník asistentů → katalog / detail asistenta; obsah i nástrojová nabídka splývají |
| `kdyz-ai-jedna-odpovednost-ai-agenta.html` | Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta? | pokročilejší učitel · AI agenti | AI agenti | AI agenti / článek → vysvětlující články, bezpečnost, asistenti; hraniční překryv s vibe codingem |
| `matematika.html` | Matematika s AI | učitel podle úkolu nebo předmětu · Tematické rozcestníky / knihovna | Tematické rozcestníky / knihovna | hlavní navigace / homepage → karty, aktivity, návody; terminologie lišící se mezi katalogem a články |
| `neplytvej-inteligenci-ai-modely.html` | Neplýtvej inteligencí | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `notebooklm-hlasovy-rozhovor-nad-zdroji.html` | Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM | učitel připravující materiál či výuku · Workflow a postupy | Workflow a postupy | workflow / návody / katalog promptů → výsledek, související postup; hranice proti návodu a promptu není zřejmá |
| `perplexity-pro-ucitele.html` | Perplexity pro učitele | učitel porovnávající nástroje · Přehled AI nástrojů | Přehled AI nástrojů | katalog nástrojů / tematické články → detail nástroje a návod; navigační vstup není jednotný |
| `prirodoveda.html` | Přírodní vědy s AI | učitel podle úkolu nebo předmětu · Tematické rozcestníky / knihovna | Tematické rozcestníky / knihovna | hlavní navigace / homepage → karty, aktivity, návody; terminologie lišící se mezi katalogem a články |
| `prompty.html` | Knihovna Promptů | učitel hledající prompt · Knihovna promptů | Knihovna promptů | homepage / návody → vyhledávání a použití promptu; prompt zaměnitelný s workflow |
| `qr-kod.html` | Vytvořte QR kód z odkazu | učitel ZŠ/SŠ · Články / novinky | Články / novinky | homepage / související tematické stránky → tematický rozcestník nebo návazný obsah |
| `skill-anglictina-vyukove-materialy.html` | Jeden SKILL, sedm výukových materiálů: AI pomocník pro angličtinu | učitel hledající postup · Praktické návody | Praktické návody | návody / nástrojové stránky / články → pracovní postup, aktivita nebo další návod |
| `uci-se-zak-nebo-za-nej-premysli-ai.html` | Učí se žák, nebo za něj přemýšlí AI? | učitel hledající kontext a inspiraci · Články, novinky a Filozofování s AI | Články, novinky a Filozofování s AI | homepage / novinky / série → tematický rozcestník nebo článek série |
| `vibe-coding-bezpecnost-kodu-php2shell.html` | Vibe Coding: AI ti naprogramuje aplikaci. Ale kdo zkontroluje její bezpečnost? | pokročilejší učitel / tvůrce · Vibe coding | Vibe coding | vibe coding rozcestník / workflow / novinky → projekty, bezpečnost; samostatná navigační varianta |
| `vibe-coding-clanky.html` | Články o Vibe Codingu | pokročilejší učitel / tvůrce · Vibe coding | Vibe coding | vibe coding rozcestník / workflow / novinky → projekty, bezpečnost; samostatná navigační varianta |
| `vibe-coding-pro-ucitele.html` | Co si můžete vytvořit do výuky | pokročilejší učitel / tvůrce · Vibe coding | Vibe coding | vibe coding rozcestník / workflow / novinky → projekty, bezpečnost; samostatná navigační varianta |
| `vibe-coding-prompty.html` | Prompty pro Vibe Coding | pokročilejší učitel / tvůrce · Vibe coding | Vibe coding | vibe coding rozcestník / workflow / novinky → projekty, bezpečnost; samostatná navigační varianta |
| `vibe-coding-ucitele.html` | Úvod do vibe codingu pro učitele | pokročilejší učitel / tvůrce · Vibe coding | Vibe coding | vibe coding rozcestník / workflow / novinky → projekty, bezpečnost; samostatná navigační varianta |
| `vibe-coding.html` | Vibe Coding | pokročilejší učitel / tvůrce · Vibe coding | Vibe coding | vibe coding rozcestník / workflow / novinky → projekty, bezpečnost; samostatná navigační varianta |

## 2. Mapa současné struktury

```text
Homepage
├── témata: AI ve vzdělávání / novinky
├── práce: návody, workflow, prompty
├── učitelská praxe: aktivity + předmětové stránky
├── produkty a pomocníci: AI nástroje / asistenti a boti
└── specializované tematické větve: AI agenti / vibe coding

Detailní obsah
├── samostatné články a novinky (část tvoří sérii Filozofování s AI)
├── návody (postupy pro konkrétní úkol či produkt)
├── workflow (složené scénáře a pracovní postupy)
├── knihovna promptů (znovupoužitelné vstupy)
├── knihovna aktivit (filtrovatelný katalog; doplněný předmětovými stránkami)
├── katalog AI nástrojů a produktové stránky
└── asistenti (rozcestník, katalog a detailní implementace)
```

Je to spíše soustava tematických mikrowebů než jednotná taxonomie. Shodné typy obsahu (novinka, návod, workflow, prompt, aktivita) se nevyskytují jen v jedné sekci. Hloubka navigace kolísá: někde vede hlavní nabídka na obecný rozcestník, jinde přímo na nástroj či specializovanou oblast. Patičky, zpětné odkazy a související obsah doplňují menu, ale ne vždy obnovují kontext nebo ukazují společného rodiče.

## 3. Audit současného menu a informačního kontextu

- Homepage, katalogové stránky a vibe coding mají odlišné navigační varianty. Uživatel proto může po přechodu změnit nabídku i názvosloví; lokální menu vibe codingu zdůrazňuje specializovanou větev.
- Nabídka mísí **oblast** (AI agenti), **formát** (návody), **konkrétní výsledek** (aktivity), **produkt** (Gemini/ChatGPT) a někde **zdroj** (prompty). Tyto položky si konkurují na stejné úrovni.
- „Článek“, „návod“, „workflow“, „prompt“ a „aktivita“ se v některých materiálech překrývají. Několik workflow je pojmenováno počtem promptů; vyhledávající učitel tak nemusí vědět, zda hledá návod, hotový prompt, nebo aktivitu.
- Stránky s názvem produktu a „pro učitele“ jsou součástí produktových vstupů, ale vedle nich jsou obecné katalogy; cesta k porovnání napříč produkty není vždy zřejmá.
- AI agenti a asistenti/boti souvisí, ale nejsou synonyma. Jedno označuje princip/typ systému, druhé může být hotová role či katalog. Současné rozdělení může čtenáře nutit znát technický rozdíl předem.
- Vibe coding je obsahový formát/téma pro tvorbu softwaru, ne kategorie konkrétního produktu. Vlastní hlavička a karty mohou působit jako samostatný web.
- Navigační prvky a kontext je třeba posuzovat podle skutečného HTML každé šablony. Atributy `aria-label`, drobečky a zvýraznění aktuální položky nejsou doloženy jednotným kontraktem napříč stránkami. U živě generovaných/šablonových článků se stav může lišit od statických souborů.
- `ai.html` a `ai-novinky.html` mají podobně formulovaný titul a v zásadě informační vstup k AI; bez jasného označení může uživatel zaměnit obecný přehled a chronologický magazín.
- Patička a odkazy „zpět“ neposkytují všude stejně předvídatelnou cestu k rodiči; interní odkazy často vedou mezi tématy bez vysvětlení, proč je další obsah doporučen.

### Rozdíl typů obsahu pro uživatelské štítky

| Typ | Odpovídá na otázku | Očekávaný formát |
|---|---|---|
| Článek / novinka | Proč je téma důležité a co se změnilo? | vysvětlení a kontext |
| Návod | Jak udělám konkrétní úkol? | kroky a kontrolní body |
| Workflow | Jak propojit více kroků/nástrojů do práce? | celý postup a výsledek |
| Prompt | Co mohu vložit do AI? | kopírovatelný vstup + doporučené použití |
| Aktivita | Co udělají žáci a učitel v hodině? | cíl, průběh, role a čas |
| Nástroj | Jaké možnosti a omezení má služba? | přehled produktu, přístup a vhodné použití |
| Asistent | Jak použít hotového pomocníka? | role, vstup, limity a spuštění |

## 4. Duplicitní a nelogické návaznosti

- **Tematické novinky vs. obecné AI přehledy:** `ai.html` / `ai-novinky.html` a tematické novinky mohou směšovat nadčasový úvod s časovou osou. Doporučit oddělené štítky „Začít“ a „Novinky“.
- **Workflow vs. návod vs. prompt:** obsah jako „7 promptů“ může být objevován z více knihoven; každá karta má jasně uvést formát a výstup, místo vytváření druhého konkurenčního seznamu.
- **Aktivity vs. předmětové stránky:** předmětové vstupy mohou duplikovat nebo znovu vybírat stejné aktivity. Jedno úložiště aktivity s filtrem předmětu, nikoli samostatné paralelní karty bez společného ID.
- **Asistenti vs. katalog asistentů vs. agenti:** podobná slova ve vyhledávání, různé úrovně obsahu. Vysvětlit „hotový asistent“ a odkazovat z technického tématu agentů.
- **Vibe coding vs. coding agenti:** společný zájem o tvorbu kódu, ale rozdílná zkušenost a rizika. Propojit s bezpečnostním a ověřovacím návodem bez slévání témat.
- **Produktové stránky vs. obecné návody:** obsah podle značky usnadňuje hledání, ale může duplikovat postupy pro stejný úkol. Vést úkolové návody a z nich uvádět kompatibilní nástroje.
- **Filozofování s AI:** články jsou v novinkové řadě, a tak se série může ztratit v chronologii. Potřebuje vlastní přistávací stránku/seznam série a předchozí/další článek.

## 5. Šest uživatelských cest

Počty kroků jsou orientační kliknutí od homepage k cíli na základě současných vstupních rozcestníků; konkrétní počet závisí na viditelnosti karet a mobilním zobrazení. Každý krok v novém návrhu znamená jednu volbu.

| Situace | Současná pravděpodobná cesta a kroky | Tření / slepé odbočky | Doporučená návaznost |
|---|---|---|---|
| Začínající učitel chce poprvé vyzkoušet AI | Domů → obecné AI → obecný návod/produkt → bezpečný začátek: cca 3–4 kroky | Nejasné, zda začít u produktu, článku či promptu; riziko skoku do technického tématu | „Začněte bezpečně“ → jeden krátký návod → první ověřený prompt → pracovní úkol |
| Potřebuje rychle připravit pracovní list | Domů → návody/workflow → Gemini/ChatGPT nebo knihovna promptů → konkrétní postup: 2–4 | Vstup organizovaný podle produktu vede k volbě nástroje před úkolem; překryv s promptem | Úkol „Připravit pracovní list“ → návod → prompt jako vložitelná pomůcka → kontrolní seznam výstupu |
| Hledá aktivitu do konkrétního předmětu | Domů → předmět → aktivity / filtr knihovny: 2–3 | Předmětová landing page a knihovna mohou působit jako dva zdroje; není zaručeno, že filtry obnoví kontext předmětu | Vybrat předmět → filtrovaná aktivita s cílem/časem/rolí → příprava učitele a alternativy |
| Chce porovnat AI nástroje | Domů → nástroje nebo stránka konkrétního produktu: 2–3 | Vstup podle značky není neutrální srovnání; výběr nástroje přichází před potřebou, cenou/účtem či soukromím | Porovnat podle úkolu, přístupu školy a práce s daty → detail nástroje → související návod |
| Pokročilý chce vytvořit aplikaci nebo AI agenta | Domů → vibe coding / AI agenti → rozcestník → návod/bezpečnost: 2–4 | Dvě oddělené větve pro související dovednosti; hranice mezi agentem a aplikací nejasná; bezpečnost snadno přehlédnutelná | Zvolit „aplikaci“ vs. „agenta“ → postup pro začátečníky/pokročilé → bezpečnost/ověření → příklad |
| Čtenář chce novinky nebo sérii Filozofování s AI | Domů → novinky → článek; série může být v seznamu článků: 2–3 | Časová osa a tematická série mají jiné cíle; není jistý vstup do série ani její další díl | Novinky (chronologicky) / Filozofování (tematická série) → obsah série a předchozí/další díl |

## 6. Dvě varianty hlavní architektury

### Varianta A – podle učitelova záměru (doporučená)

1. **Začít s AI** — bezpečnost, první kroky, základní pojmy.
2. **Připravit výuku** — úkoly, návody a workflow k přípravě materiálů.
3. **Učit s AI** — aktivity a předměty.
4. **Nástroje a asistenti** — porovnání služeb; hotoví asistenti odděleně od nástrojů.
5. **Tvořit s AI** — vibe coding a agenti jako podkategorie „Aplikace“ a „Automatizace“.
6. **Číst a objevovat** — články, novinky a série Filozofování s AI.

**Výhody:** začíná úkolem a zkušeností učitele, používá srozumitelná slovesa, snižuje potřebu předem znát terminologii. **Nevýhody:** obsah může přirozeně patřit do více úkolů; nutno umožnit tagy a související vstupy bez vytváření duplicitních URL.

### Varianta B – podle typu obsahu

1. Návody
2. Workflow
3. Aktivity
4. Nástroje
5. Agenti a asistenti
6. Novinky a články
7. Vibe coding

**Výhody:** autorům a čtenářům se snadno vysvětluje formát. **Nevýhody:** návštěvník musí znát název formátu; rozsekává cestu „připravit pracovní list“ mezi návody, workflow, prompty a nástroje. Vibe coding se jeví vedle formátů jako rovnocenná disciplína. Pro hlavní menu méně vhodná, ale vhodná jako filtrování/štítky uvnitř katalogů.

## 7. Doporučené menu a společné rozcestníky

Doporučuji Variantu A, šest položek:

| Položka | Podkategorie / vstupy |
|---|---|
| Začít s AI | Bezpečný začátek; základy a pojmy; AI pravidla ve škole; časté úkoly pro začátečníka |
| Připravit výuku | Materiály a pracovní listy; prompty; návody; workflow; práce se zdroji a NotebookLM |
| Učit s AI | Aktivity; předměty (ČJ, AJ, matematika, dějepis, přírodní vědy); role učitele a žáka |
| Nástroje a asistenti | Porovnat nástroje podle úkolu; produktové přehledy; katalog hotových asistentů; vlastní asistent |
| Tvořit s AI | Aplikace (vibe coding); agenti a automatizace; bezpečnost a ověřování kódu / agentů |
| Číst a objevovat | Novinky; vysvětlující články; Filozofování s AI (samostatná série) |

Rozcestník každé skupiny sdílí stejné pořadí: krátké „co tu najdu“, primární akce podle úkolu, začátečnická cesta, katalog/filtrování, vybrané návody a workflow, související články a jasná cesta zpět. Typ obsahu se zobrazí jako štítek, ne jako konkurenční navigační hierarchie.

### Mapování všech obsahových URL do doporučené struktury

| Nová sekce | Stávající URL (URL zachovat) |
|---|---|
| Domů | `index.html` |
| Začít s AI | `ai.html`, `ai-navod-chatgpt-zacatek-bezpecne.html`, `ai-navod-lepsi-prompty-10-zasad.html`, `ai-navod-prep-prompty.html`, `ai-navod-edit-kontrola.html`, `ai-navod-7-univerzalnich-promptu.html`, `ai-navod-commands-chatgpt.html`, `neplytvej-inteligenci-ai-modely.html`, `ai-novinka-pravidla-ve-skole.html`, `ai-agenti-co-je-ai-agent.html`, `ai-agenti-kdy-nepouzivat.html` |
| Připravit výuku | `ai-navody.html`, `prompty.html`, `ai-workflow.html`, `ai-workflow-18-promptu.html`, `ai-workflow-10-promptu-gemini.html`, `ai-workflow-7-kroku-gemini-notebook.html`, `ai-workflow-8-otazek.html`, `ai-workflow-prep-edit.html`, `ai-workflow-usetri-praci.html`, `ai-workflow-fotografie-ucebnice.html`, `ai-workflow-prezentace-webova-stranka.html`, `ai-workflow-udl-ai.html`, `ai-navod-gemini-notebook-infografiky.html`, `ai-navod-gemini-notebook-prezentace.html`, `ai-navod-gemini-notebook-priprava.html`, `ai-navod-gemini-notebook-vyuka.html`, `gemini-notebook-navod-pro-ucitele.html`, `gemini-notebook-prompty.html`, `gemini-notebook.html`, `notebooklm-hlasovy-rozhovor-nad-zdroji.html`, `ai-novinka-gemini-notebook-sablona.html`, `gemini-storybook-navod-pro-ucitele.html`, `gemini-desktop-navod-pro-ucitele.html`, `ai-workflow-chatgpt-images-2-5.html`, `ai-navod-chatgpt-vizualni-materialy.html`, `ai-workflow-gemini-notebook-ai-agent.html`, `ai-navod-ai-agent-v-prohlizeci.html`, `ai-ziva-hlasova-ai-ve-vyuce.html` |
| Učit s AI | `aktivity.html`, `anglictina.html`, `cestina.html`, `dejepis.html`, `matematika.html`, `prirodoveda.html`, `uci-se-zak-nebo-za-nej-premysli-ai.html`, `skill-anglictina-vyukove-materialy.html` |
| Nástroje a asistenti | `asistenti.html`, `katalog-asistenti.html`, `asistenti/metodicky-asistent-gemini.html`, `asistenti/math-cermat.html`, `asistent-ucitele-osobni-ai-asistent.html`, `chatgpt-pro-ucitele.html`, `claude-pro-ucitele.html`, `copilot-pro-ucitele.html`, `gemini-pro-ucitele.html`, `gemini-skills-pro-ucitele.html`, `perplexity-pro-ucitele.html` |
| Tvořit s AI | `vibe-coding.html`, `vibe-coding-ucitele.html`, `vibe-coding-pro-ucitele.html`, `vibe-coding-prompty.html`, `vibe-coding-clanky.html`, `vibe-coding-bezpecnost-kodu-php2shell.html`, `ai-workflow-vibe-coding.html`, `ai-workflow-css-grid-vibe-coding.html`, `google-ai-studio-2026-vibe-coding.html`, `ai-agenti.html`, `ai-agenti-ve-skole.html`, `ai-agenti-10-ukolu.html`, `ai-agenti-agentni-smycka.html`, `ai-agenti-chatbot-automatizace-workflow.html`, `ai-agenti-coding-agenti.html`, `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html`, `ai-agenti-mcp.html`, `ai-agenti-multi-agentni.html`, `ai-agenti-nastroje-function-calling.html`, `ai-agenti-pamet.html`, `ai-agenti-rag.html`, `ai-agenti-skills.html`, `ai-agenti-prvni-agent.html`, `kdyz-ai-jedna-odpovednost-ai-agenta.html` |
| Číst a objevovat | `ai-novinky.html`, `ai-novinka-vykonnejsi-ai.html`, `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html`, `ai-novinka-microsoft-gemini.html`, `ai-novinka-microsoft-ai-workflow.html`, `ai-novinka-google-ai-vzdelavani-zari-2026.html`, `ai-novinka-gemini-desktop-chatgpt-word-agenti.html`, `ai-novinka-gemini-classroom.html`, `ai-novinka-chatgpt-interaktivni-kvizy.html`, `ai-novinka-ai-ve-vzdelavani-srpen-2026.html`, `ai-novinka-ai-ve-vzdelavani-zari-2026.html`, `ai-novinka-datovi-agenti-lidske-schvaleni.html`, `ai-novinka-agenti-onenote-pruvodce-ucenim.html`, `ai-novinka-ai-duvod-premyslet.html`, `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html`, `ai-novinka-filozofovani-s-ai-chybejici-role.html`, `ai.html`, `co-se-muze-ucitel-naucit-od-youtube.html` |
| Samostatná utility | `qr-kod.html` — umístit jen tehdy, je-li stále aktivně odkazována; jinak zachovat přímé URL a posoudit užitečnost mimo navigaci. |
| Mimo obsahovou navigaci | `googled4301464bc8f67c5.html` — ověřovací soubor vyhledávače, nečlánková stránka. |

Poznámka: některé URL mají více legitimních vstupů (např. agent v prohlížeči přes návody i agenty; prompty pro produkt přes přípravu i produktový detail). Klasifikovat kanonicky jednou a sekundární vstupy dělat interními odkazy, ne kopiemi obsahu.

### Návaznosti, breadcrumbs a responzivní menu

- Na detailech použít drobečky jen pokud je stabilní rodičovská sekce: `Domů > Připravit výuku > Návody > Název`. U článku zařazeného do více témat zvolit primární cestu z metadat; související obsah řešit kartami.
- Na homepage zobrazit úkolové vstupy a jasné „Začít“; na sekčních rozcestnících udržovat stejné štítky, obsah i cíl napříč desktopem a mobilem.
- Jedna datově řízená definice položek menu, kterou vykreslí stávající šablony s přístupným HTML. Mobilní podoba může měnit vizuální ovládání (hamburger, skládání), ne obsah, názvy, hierarchii ani cílové URL.
- Aktuální oblast označovat konzistentně (`aria-current="page"` pro aktuální stránku a zřetelné vizuální zvýraznění rodičovské sekce); ověřit klávesnici a čtečku obrazovky.
- Každý detail zakončit jedním dalším doporučeným krokem a 2–4 souvisejícími zdroji s důvodem relevance. Aktivita odkazuje k přípravě učitele a variantě; návod k odpovídajícímu promptu/workflow; produkt k úkolovému návodu a bezpečnosti; agent/vibe coding k ověřování.

## 8. SEO a technická rizika

- V této fázi ponechat všechna URL, canonical, meta robots, interní cíle a sitemapu beze změny. Návrh přesouvá **navigační zařazení**, nikoli nutně soubory či URL.
- Před realizací automaticky ověřit sitemapu proti všem indexovatelným kanonickým stránkám; zkontrolovat, že neobsahuje ověřovací stránku, duplicitní varianty ani chybějící důležité články. Prověřit `_redirects` pro stávající aliasy a staré cesty; nic nepřidávat bez konkrétního přesunu.
- Pokud budoucí schválená změna URL nastane, každá stará URL má mít jeden přesný 301 na nejbližší ekvivalent; vyhnout se řetězení, hromadným přesměrováním na homepage a smyčkám. Aktualizovat interní odkazy, sitemapu, canonical, metadata, případně schema a odkazy z externích zdrojů, které lze spravovat.
- Zachovat indexovatelnost veřejného obsahu. Katalogové stránky s filtry musí zabránit nekontrolované indexaci parametrických kopií; detailní kanonická URL zůstává stabilní.
- Centrální navigační komponenta je vhodná jako jediný zdroj struktury/štítků, nikoli jako důvod k přepisu všech HTML stránek. Lze ji zavést postupně přes existující JS/šablony; nutno zohlednit ručně psané, generované a sekční šablony, fallback bez JS a rozdílné navigační DOM. Nejprve inventarizovat všechny varianty a cílové stránky, poté pilot na jedné reprezentativní šabloně.
- Rizika: rozbití relativních odkazů v podadresáři `asistenti/`; nekonzistentní generované články; nesoulad mobil/desktop; změna interního link equity; chybějící zpětné odkazy; odlišná data mezi registry katalogů a HTML. Kontrolovat cestu normalizovanou vůči kořeni a případně změny URL ponechat mimo 7B.

## 9. Implementační etapy po schválení

1. **7A – audit a návrh (tato etapa):** inventura, cesty, varianty menu, doporučená taxonomie; předat k pedagogickému a uživatelskému posouzení. Nic nenasazovat.
2. **7B – validace a obsahové rozhodnutí:** potvrdit slovník šesti položek; určit primární rodiče stránek, štítky, série, vlastnictví duplicit; zkontrolovat edge list interních odkazů, canonical, sitemap, `_redirects`, katalogové registry. Uzavřít rozhodnutí o mobilním menu a breadcrumbs.
3. **7C – prototyp navigace a rozcestníků:** připravit prototyp centrální definice menu a jednu stránku od každého typu šablony (homepage, katalog, detail, vibe coding). Zachovat URL a HTML strukturu; provést obsahové, mobilní, klávesnicové a čtečkové ověření. Vyhodnotit šest cest s učiteli.
4. **7D – postupná implementace:** převést šablony po skupinách; současně doplnit breadcrumbs, kontextové související odkazy a konzistentní aktuální položku. Aktualizovat generátory, ne jen výsledné stránky.
5. **7E – kontrola a stabilizace:** crawl všech interních odkazů, porovnání sitemap/canonical/robots, kontrola mobil/desktop, broken links, přístupnost a analytika úspěšnosti cest. Opravovat bez změny URL.
6. **Pozdější samostatná etapa URL (jen pokud je důvod a schválení):** plán přesných 301, aktualizace všech odkazů a sitemap; monitorovat 404 a indexaci. Není součástí návrhu 7A.

## Metodická omezení a předání

Toto je informačně-architektonický audit, nikoli pedagogické schválení jednotlivých materiálů ani test živé produkce. Inventura a technická kontrola vychází ze snapshotu `origin/master` `899d11e` (8. 11. 2026). Rozdělení do nových skupin je návrh podle účelu a titulku, nikoli tvrzení, že současné všechny interní odkazy přesně odpovídají uvedeným typickým trasám.

**Před zahájením 7B je třeba předat návrh pedagogickému a uživatelskému posouzení.** Zejména potvrdit, zda jsou položky „Začít s AI“, „Připravit výuku“ a „Učit s AI“ pro učitele přirozené; zda „Nástroje a asistenti“ jasně odděluje katalog produktu od hotové role; a zda série Filozofování s AI má být samostatně viditelná.

## Aktualizace 8. 11. 2026 proti první verzi auditu

| Oblast | První verze (`01aae885`, 5. 11.) | Aktualizovaný stav (`899d11ee`, 8. 11.) | Dopad na návrh |
|---|---|---|---|
| Základ auditu | Starší lokální `master`; výchozí commit nebyl dostupný | `git fetch origin master` úspěšně ověřil `origin/master` přesně na potvrzeném `899d11ee5a15e66fc8d7d71d1b2c1470c560c3c1` | Staré omezení odstraněno; toto je správný podklad k revizi |
| Homepage | Návrh staršího webu | Nová, redizajnovaná homepage má vlastní menu Domů / Články / Návody a workflow / AI nástroje / Pro školy / Filozofování s AI; sekce „Co dnes potřebujete?“, nástroje, předměty, novinky i série | Homepage už nabízí záměrové vstupy, ale menu je stále specifické a některé cesty vedou přímo do fragmentů/filtrů |
| Katalog `ai.html` | Zachycen jako obecný rozcestník | Samostatná katalogová navigace: Úvod / AI obsah / Praktické návody / Novinky; rozbalovací Předměty a Nástroje a aktivity; vyhledávání a filtry témat, vč. Vibe Coding a Filozofování s AI | Katalog je obsahový index článků, návodů a workflow, nikoli obecné „AI“ téma; názvy neodpovídají homepage |
| Aktivity | Zachycen jako knihovna a předměty | 44 aktivit, filtry předmět/ročník/nástroj, detailní dialogy, role AI a časová metadata; stránka používá katalogový header, přístupné filtry a role jasně rozlišené pro učitele/žáka/skupinu | Knihovna je nejlépe strukturovaný úkolový katalog; předmětové landing pages mají být filtry/vstupy do stejného zdroje, ne paralelní katalogy |
| Vibe coding | Samostatná navigační větev | Stále vlastní legacy navigace s odlišným desktop menu a mobilním seznamem; canonical `/vibe-coding`; samostatné podstránky článků, projektů, promptů, workflow a bezpečnosti | Největší vizuální/názvová odchylka; zachovat URL, sjednotit shell a umístit pod „Tvořit s AI“ |
| Prompt katalog | Zmíněn jako samostatný katalog | `prompty.html` si ponechává legacy menu, kde jsou předměty, prompty, asistenti, aktivity, AI pro školy, Vibe Coding i QR kód; mobilní menu vypisuje všechny odkazy naplocho | Desktop/mobile hierarchie se liší a navigace výrazně přetěžuje stránku; prompt je formát, nikoli obsahová oblast |
| Metadata aktivit | Nebylo aktuální | Etapa 6C přinesla pedagogicky schválené role a časová metadata; role AI zohledňuje, kdo AI obsluhuje, přímý žákovský přístup vyžaduje schválení školy | V menu a detailech má být aktivita odlišena od návodu/promptu a zobrazit „kdo pracuje s AI“ a čas |
| Sitemap a redirects | Pouze obecné doporučení kontroly | 97 URL sitemap, 94 redirect pravidel, 103 HTML. Při porovnání canonical cest se sitemapou jsou tři bezpříponové canonical cesty skutečně nezastoupené: `ai-novinka-ai-duvod-premyslet`, `gemini-skills-pro-ucitele`, `skill-anglictina-vyukove-materialy`. Dvě další HTML stránky mají canonical s `.html` (`asistent-ucitele-osobni-ai-asistent.html`, `vibe-coding-bezpecnost-kodu-php2shell.html`), zatímco sitemap používá obvyklou bezpříponovou cestu; nejde o chybějící obsahovou URL, ale o nejednotný canonical tvar a je potřeba ověřit, zda canonical cíl odpovídá zamýšlenému redirectu. | Zjištění předat do 7B k ověření indexačního záměru; tento IA návrh nemění URL, redirects ani canonical |
| Drobečky a šablony | Předpoklad chybějícího jednotného kontraktu | Generátory návodů už vykreslují breadcrumbs (Domů > rodič > detail), magazínové články mají vlastní navigační vzor; šablony se liší | Drobečky nerozepisovat od nuly. Rozšířit stejný kontrakt postupně na statické stránky a katalogy podle primární taxonomie |

### Srovnání vstupních stránek

| Stránka | Co návštěvník skutečně najde | Navigace a vstupní mechanismus | IA závěr |
|---|---|---|---|
| Homepage `index.html` | Redesignovaný editorial/úkolový rozcestník, poslední články, nástroje, předměty, filozofická série | Nové hlavní menu s dropdowny a responzivním toggle; odkazy na `ai.html`, `ai-navody.html`, `ai-workflow.html`, `prompty.html`, `aktivity.html`, produktové stránky a sérii | Nejlepší východisko pro jazyk orientovaný na učitelské potřeby; odstranit duplicitní cestu do téhož obsahu a terminologii sjednotit |
| Katalog `ai.html` | Vyhledávatelný a filtrovatelný mix článků, návodů, workflow a tematických karet | Samostatná katalogová hlavička; jump odkazy na AI, návody, workflow a témata; filtr témat včetně Vibe Coding a Filozofování | Přeznačit jako „Články a inspirace“ nebo „Knihovna obsahu“, ne vydávat za hlavní kategorii AI |
| Knihovna `aktivity.html` | 44 záznamů s filtry podle předmětu, stupně/ročníku a nástroje; modal s rolemi, načasováním a aktivitou | Katalogový header a stejné základní odkazy, ale obsah má hlubokou oborovou filtraci a vlastní parametrizaci URL | Model pro sjednocení filtrů a výsledkových karet; zachovat kód aktivity, URL stavy a kontext filtrů |
| `vibe-coding.html` | Tematický microsite: úvodní kroky, projekty, prompty, články a bezpečnost | Starší globální menu + rozbalovací mobilní menu, odlišné třídy a struktura od nové homepage/katalogu; vlastní obsahová podnavigace | Přesunout do „Tvořit s AI > Aplikace (vibe coding)“, zachovat jeho vlastní sekundární místní navigaci a přidat společný globální shell |

### Pedagogické cesty podle aktuálního webu

| Cíl učitele | Doporučená cesta a počet kliknutí | Následný užitečný obsah | Současná překážka |
|---|---|---|---|
| Začít používat AI | Homepage „Začít bezpečně“ → bezpečný návod → první ověřitelný úkol (2 kliky) | krátký prompt, ochrana údajů, kontrolní postup | Aktuální hlavní menu nemá přímou položku „Začít“; člověk může skončit v katalogu s širokým filtrem |
| Připravit vyučovací hodinu | „Připravit výuku“ → workflow/úkol (1–2 kliky) | předmětová aktivita, materiál nebo související návod | Nabídka dělí návody, workflow, prompty a předměty podle formátu/systému; učitel musí sám složit cestu |
| Vytvořit pracovní list nebo test | „Připravit materiál“ → odpovídající návod → prompt / workflow (2 kliky) | kontrola faktů, úrovně a přístupnosti materiálu; aktivita pro použití v hodině | Produktové stránky ChatGPT/Gemini a knihovna promptů rozdělují jeden úkol do různých vstupů |
| Najít aktivitu do konkrétního předmětu | „Učit s AI“ → knihovna → filtr předmětu/ročníku (2 kliky) | detail aktivity: cíl, role AI, příprava/čas, nutné schválení přímého přístupu; návazný návod | Homepage předměty a knihovna aktivit jsou dvě vstupní cesty; nutné zachovat předvyplněný filtr a nezdvojovat karty |
| Naučit se workflow nebo tvořit aplikaci | „Připravit výuku > Workflow“ nebo „Tvořit s AI > Aplikace“ → krokový postup → bezpečnostní ověření (2 kliky) | prompt šablona, projektový příklad, bezpečnost PHP/AI kódu, pak případně agenti | Dnešní workflow i vibe coding/agentní obsah se kříží v katalogu i specializovaných menu; návštěvník nemusí poznat rozdíl aplikace vs. agent |
| Přečíst odborný článek / novinku | „Číst a objevovat > Novinky“ nebo série Filozofování → článek → další díl/odkaz na praktické použití (2 kliky) | předchozí/následující článek, relevantní návod či aktivita | Filozofická série je dostupná z homepage a filtru katalogu, ale bez jednoznačné samostatné série-landing stránky |

### Doporučené pokračování z detailu

1. **Článek/novinka:** zobrazení série nebo data, potom „Co to znamená pro učitele?“ a jeden praktický návod/aktivita.
2. **Návod:** odkaz na kopírovatelný prompt a na související workflow; při výstupu přidat kontrolní checklist a aktivitu, pokud jde o žáky.
3. **Workflow:** uvést vstup, výstup, předpokládanou dobu, nástroje a alternativní cestu; odkázat na návody k jednotlivým krokům.
4. **Aktivita:** související příprava učitele, hodnocení/ověření, předmětové varianty a vysvětlení role AI; zobrazit čas přípravy odděleně od času aktivity.
5. **Nástroj/asistent/agent:** propojit „vyber podle úkolu“ → detail a omezení → konkrétní návod; rozlišit hotového asistenta od obecného konceptu agenta.
6. **Vibe coding:** další projekt, návod na testování/bezpečnost a až pak pokročilé agenty; popsat případná rizika pro žákovská data a publikaci.

### Doporučení finálního menu

Použít **variantu A – podle záměru učitele**, v desktopu i mobilu se stejnými názvy, pořadím, cíli a podkategoriemi:

1. **Začít s AI** — bezpečný začátek; základy; pravidla a ochrana dat.
2. **Připravit výuku** — hodina a materiály; návody; prompty; workflow.
3. **Učit s AI** — aktivity; vybrané předměty; role učitele a žáka.
4. **Nástroje a asistenti** — srovnání podle úkolu; přehled nástrojů; katalog hotových asistentů.
5. **Tvořit s AI** — aplikace/vibe coding; agenti a automatizace; bezpečnost a ověřování.
6. **Číst a objevovat** — články; novinky; Filozofování s AI jako série.

Domů je přístupné značkou/logem. Hledání je globální ovládací prvek, ne hlavní kategorie. QR generátor se umístí do užitečných nástrojů uvnitř sekce „Nástroje a asistenti“ nebo do patičky podle ověřené návštěvnosti. Desktopový dropdown a mobilní accordion mohou používat jiné ovládací vzory, ale nikdy jiné odkazy či odlišnou taxonomii. Zachovat skip link, focus management, `aria-expanded`, `aria-current`, ovládání klávesnicí a stav filtru v URL.

### Tabulka současného a navrhovaného zařazení – doplnění zjištěné po `origin/master`

Předchozí tabulka „Mapování všech obsahových URL“ zůstává platná jako mapování obsahu. Tato tabulka zachycuje nové/aktualizované vstupní a šablonové vztahy specifické pro revizi 6C:

| Současná stránka nebo skupina | Současný vstup/rodič | Navržené hlavní umístění | Sekundární návaznost |
|---|---|---|---|
| `index.html` | samostatné redesignované menu | globální homepage a výchozí rozcestník | přímé úkolové karty pro všech 6 hlavních cest |
| `ai.html` | katalog obsahu + produktová navigace | `Číst a objevovat > Knihovna obsahu` | štítky Návod, Workflow, Článek a tematické štítky |
| `ai-navody.html`, detaily návodů | hlavní menu / katalog | `Připravit výuku > Návody` nebo `Začít s AI` podle úrovně | breadcrumbs, prompt, workflow, relevantní aktivita |
| `ai-workflow.html`, detaily workflow | hlavní menu / katalog | `Připravit výuku > Workflow` | návod k jednotlivému kroku; odpovídající prompt |
| `prompty.html`, produktové prompty | legacy ploché menu | `Připravit výuku > Prompty` | návody, úkolové karty, předmětové filtry |
| `aktivity.html` + 44 karet | knihovna s filtry | `Učit s AI > Aktivity` | ročník, předmět, role, čas, související příprava |
| pět předmětových stránek | předměty / oborové mini stránky | `Učit s AI > Předměty` | odkaz do `aktivity.html` s odpovídajícím filtrem |
| `asistenti.html`, `katalog-asistenti.html`, detaily | oddělené katalogové vstupy | `Nástroje a asistenti > Hotoví asistenti` | jak upravit/ověřit, použití v aktivitě |
| nástrojové stránky (ChatGPT, Gemini atd.) | přístup skrze menu a články | `Nástroje a asistenti > Přehled nástrojů` | úkolový návod, soukromí a přístup školy |
| `vibe-coding.html` + šest navazujících stránek | vlastní legacy globální menu | `Tvořit s AI > Aplikace (vibe coding)` | projekty → testování → bezpečnost |
| `ai-agenti.html` + články/agentní workflow | katalog a články | `Tvořit s AI > Agenti a automatizace` | začátečnická cesta, bezpečnost, asistent jako použití |
| `ai-novinky.html` + magazínové články | katalog / homepage | `Číst a objevovat > Novinky` | chronologické předchozí/další; téma → návod |
| Filozofování s AI články | homepage banner a filtr `ai.html` | `Číst a objevovat > Série` | stránka série a předchozí/další díl |
| `qr-kod.html` | položka mezi hlavními odkazy legacy menu | utility, ne hlavní navigace | dostupnost z nástrojů/patičky |

### SEO a navigační bezpečnost – konkrétní ověření

`origin/master` má 103 HTML souborů, 97 záznamů sitemap a 94 neprázdných přesměrování. V sitemapě jsou čisté bezpříponové cesty; většina HTML má shodné canonical na stejnou cestu bez `.html`. Při porovnání canonical cest a sitemap se ukazují tři stránky, které v sitemapě nejsou, a dvě stránky s odlišným tvarem canonical cesty (viz výše). Není doloženo, zda jsou záměrně mimo index; před úpravou ověřit meta robots a stav produkce.

Sitemap URL 97 nejsou prostým počtem všech HTML, proto je nelze automaticky označit jako chybu. Google verification HTML se nemá indexovat ani nabízet v menu. `_redirects` obsahuje mnoho starých `.html` → extensionless 301 pravidel; to jsou aliasy zachovávající veřejné staré odkazy. Nová IA navigace má mířit na kanonické bezpříponové URL (HTML linky ve zdrojích mohou být zachovány pouze tam, kde je to zaběhlé a redirect je záměrný). Žádný přesun v návrhu nemění slug, canonical, redirect ani externí cíl.

### Rozhraní implementace a navigační orientace

Již existují dílčí sdílené mechanismy: nové homepage menu a generátory článků s breadcrumbs, `js/main.js` obsluhující více tříd toggle, `scripts/build-subject-navigation.js` a katalogové šablony. Přesto hlavní navigace není centrální: `index.html`, `ai.html`, `aktivity.html`, `prompty.html` a `vibe-coding.html` mají rozdílné DOM/třídy, názvosloví i menu. Doporučení pro 7C je vytvořit jeden datový kontrakt položek a jeho adaptéry na existující HTML/šablony; nepřepisovat stránky jen kvůli navigaci. Začít s pilotem homepage, katalogu a vibe codingu; knihovnu aktivit zahrnout jako čtvrtou samostatnou šablonu.

### Přehled revizních kroků

- Stažení `origin/master`: úspěšné, SHA ověřen.
- Izolace lokálního stavu: hlavní kopie nepřepnuta ani přepsána; Git odmítl vytvořit worktree větev kvůli oprávnění zápisu do `.git/refs`, proto byl read-only snapshot vybalen z ověřeného `origin/master` do izolovaného adresáře.
- Počet HTML/sitemap/redirectů: 103 / 97 / 94.
- Knihovna aktivit: 44 karet; aktualizovaná metadata role/času z Etapy 6C.
- Produkční UI se neměnilo.
- Vzhledem k žádosti o draft PR bude dokument commitnut na samostatné větvi z přesného `899d11e`; merge a deploy nejsou součástí.



