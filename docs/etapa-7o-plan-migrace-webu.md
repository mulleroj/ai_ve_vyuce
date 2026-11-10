# Etapa 7O – plán systematické migrace webu AI ve Výuce

**Stav:** návrh, bez implementace. **Zdroj:** HEAD PR #52 `9a97de04072b721ce9b66dcfd0355049eb081da1`. **Návaznost:** PR #51 → PR #52 → dokumentační draft PR #53. **Datum:** 10. 11. 2026.

## Ověření vstupů a omezení

GitHub potvrzuje PR #51 jako otevřený draft na `473ef5d35580d0366aacbd4812a00cf85966a168`. PR #52 je otevřený draft na `9a97de04072b721ce9b66dcfd0355049eb081da1`, jeho base odpovídá přesně HEAD PR #51. Inventura vychází z obsahu úplného rekurzivního stromu a HTML souborů na HEAD PR #52.

Ve stromu je **104 HTML souborů**: 103 obsahových/veřejných stránek a jeden Google ověřovací soubor `googled4301464bc8f67c5.html`, který je z rozsahu vyřazen. Barvy a navigace jsou klasifikovány staticky podle HTML/CSS, nejde o computed styles ani browserové vizuální potvrzení.

Vizuální a funkční QA kompletního článku PR #52 zůstává neověřené. Předchozí lokální server narazil na odmítnutí socket oprávnění a prohlížeč na timeout; dostupné Netlify preview patří PR #51. Nový deploy se nezkouší. **Realizace migrace zůstává podmíněna doloženým browser QA článku PR #52 a schválením pořadí vln.**

## Starší inventury v repozitáři

| Dokument | Přínos | Stav vůči tomuto snapshotu |
|---|---|---|
| `docs/audit-informacni-architektury-7a.md` | Účel stránek, vazby rozcestníků, SEO; 103 HTML na starším snapshotu. | Aktuálně je souborů 104. |
| `docs/audit-pozadi-stranek-7j.md` | Statická inventura PR #49: 18 světlých, 85 tmavých z 103 souborů. | Po pěti světelných pilotních stránkách PR #51 je aktuální poměr 23/80 ze 103 obsahových stránek. |
| `docs/etapa-7h-inventura-sablon-clanku.md` | Rozlišuje ruční workflow/news/agentní články a generované výstupy. | Užitečný přehled rodin, ne současný úplný seznam. |
| `docs/proposal-article-content-navigation.md` | Rozlišuje `guide-toc`, `magazine-toc`, `article-toc`, navrhuje pilot PR #52. | Aktuální snapshot obsahuje 34 TOC variant; vizuální QA stále chybí. |
| `docs/guides-template.md`, `docs/JAK_PREVEST_CLANEK_NA_MAGAZINOVOU_SABLONU.md` | Pravidla pro zdroje, manifesty a generování guide/magazine článků. | Budoucí změny se musí propisovat do zdroje a generátoru. |

## Souhrn

| Stav z HTML/CSS | Počet | Poznámka |
|---|---:|---|
| Obsahové stránky | 103 | 104 HTML minus ověřovací soubor. |
| Světlé + menu šesti oblastí | 23 | 18 starších světlých a pět pilotů PR #51; neznamená vizuální schválení. |
| Tmavé + menu šesti oblastí | 10 | Menu je vložené, zbývá světlý styl a kontrola lokální šablony. |
| Bez šestipoložkového menu | 70 | 63 workflow hlaviček, 5 magazínových/sériových a 2 workflow logo varianty. |
| Drobečková navigace | 10 | 93 stránek nemá rozpoznanou breadcrumb navigaci; nedoplňovat ji mechanicky. |
| Nějaká obsahová navigace | 34 | 29 `article-toc`, 2 `guide-toc`, 2 `magazine-toc`, 1 komponenta PR #52. |
| Bez TOC | 69 | U rozcestníků/nástrojů to může být správně. |
| Články A/B/C s ≥5 H2 | 71 | Kandidáti podle standardu, po ověření, že jde o kapitoly. |
| Dlouhé články A/B/C bez TOC | 37 | Přesný seznam níže. |

### Dlouhé články bez TOC

`ai-agenti-10-ukolu.html`, `ai-agenti-co-je-ai-agent.html`, `ai-navod-ai-agent-v-prohlizeci.html`, `ai-navod-commands-chatgpt.html`, `ai-navod-edit-kontrola.html`, `ai-navod-lepsi-prompty-10-zasad.html`, `ai-navod-prep-prompty.html`, `ai-novinka-agenti-onenote-pruvodce-ucenim.html`, `ai-novinka-ai-ve-vzdelavani-srpen-2026.html`, `ai-novinka-chatgpt-interaktivni-kvizy.html`, `ai-novinka-filozofovani-s-ai-chybejici-role.html`, `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html`, `ai-novinka-gemini-desktop-chatgpt-word-agenti.html`, `ai-novinka-gemini-notebook-sablona.html`, `ai-novinka-google-ai-vzdelavani-zari-2026.html`, `ai-novinka-microsoft-ai-workflow.html`, `ai-novinka-microsoft-gemini.html`, `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html`, `ai-novinka-vykonnejsi-ai.html`, `ai-workflow-8-otazek.html`, `ai-workflow-css-grid-vibe-coding.html`, `ai-workflow-prep-edit.html`, `ai-workflow-prezentace-webova-stranka.html`, `ai-workflow-vibe-coding.html`, `ai-ziva-hlasova-ai-ve-vyuce.html`, `asistent-ucitele-osobni-ai-asistent.html`, `co-se-muze-ucitel-naucit-od-youtube.html`, `gemini-desktop-navod-pro-ucitele.html`, `gemini-notebook-ucitel-vidi-chaty-zaku.html`, `gemini-storybook-navod-pro-ucitele.html`, `kdyz-ai-jedna-odpovednost-ai-agenta.html`, `notebooklm-hlasovy-rozhovor-nad-zdroji.html`, `skill-anglictina-vyukove-materialy.html`, `uci-se-zak-nebo-za-nej-premysli-ai.html`, `vibe-coding-bezpecnost-kodu-php2shell.html`, `vibe-coding-pro-ucitele.html`, `vibe-coding-ucitele.html`

Jde o 37 statických kandidátů; nadpisy v kartách nebo boxech před migrací znovu redakčně ověřit. Přítomnost staré TOC třídy také není důkazem správných odkazů či jedinečných kotev.

## Rozdělení podle šablon

| Skupina | Stránek | S ≥5 H2 | S TOC |
|---|---:|---:|---:|
| A · Dlouhé metodické články a návody | 51 | 50 | 30 |
| B · Krátké články a novinky | 16 | 15 | 2 |
| C · Magazín a Filozofování s AI | 7 | 6 | 2 |
| D · Rozcestníky a katalogy | 13 | 4 | 0 |
| E · Generátory promptů a interaktivní nástroje | 5 | 1 | 0 |
| F · Asistenti, produktové stránky a projekty | 11 | 3 | 0 |

- **A – dlouhé metodické články a návody:** zachovat příklady, infografiky, prompty, tabulky, kód, workflow a vlastní hero.
- **B – krátké články a novinky:** zahrnuje i delší news-roundup; délka se rozhoduje podle H2 obsahu, ne názvu stránky.
- **C – magazín a Filozofování s AI:** zachovat rubriky, sériové návaznosti, CTA a generované zdroje.
- **D – rozcestníky a katalogy:** nepoužívat sidebar článku; zachovat filtry, karty, tematické cesty. Homepage zůstává mimo redesign.
- **E – generátory promptů a interaktivní nástroje:** zachovat formuláře, kopírování, schránku, výsledky a stavové zprávy.
- **F – asistenti, produktové stránky a projekty:** rozlišit katalog, detail asistenta, produktový rozcestník a projektový článek.

### Cílová šablona podle skupiny

| Skupina | Cílová podoba |
|---|---|
| A | Světlá identita a šest oblastí menu; od pěti skutečných H2 jedna komponenta PR #52 s vybranými H3. |
| B | Světlý news shell; zachovat perex, zdroje, obrázky a související obsah. TOC pouze pro skutečné dlouhé kapitoly. |
| C | Světlá magazínová/sériová šablona; rubrika, metadata, sériové odkazy a vlastní generátor zůstávají. |
| D | Světlý katalog podle uživatelské úlohy; filtrování a karty, bez článkové TOC. |
| E | Světlé rozhraní podle funkce; kopírování, formulář, stavové hlášky a JS fallback se testují samostatně. |
| F | Světlý katalog, produktový přehled či detail asistenta podle současné URL; externí cíle a CTA zůstávají. |

## Kompletní inventura 103 obsahových stránek

Počty H2/H3 jsou staticky získané z hlavního obsahu po odečtení menu a souvisejících karet. Na katalogu nemusí H2 odpovídat kapitolám. „Ručně“ značí ručně udržovaný shell; některé jeho oblasti mohou generovat skripty.

### A · Dlouhé metodické články a návody

| Soubor a název | Šablona / plocha | Hlavní navigace / drobečky | H2/H3 / TOC | Zdroj / interakce | Postup / riziko |
|---|---|---|---|---|---|
| `ai-agenti-10-ukolu.html` · 10 úkolů, které může AI agent převzít učiteli | workflow · tmavá | workflow logo + návrat; drobečky ne | 17/3; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-agentni-smycka.html` · Jak funguje AI agent: agentní smyčka krok za krokem | workflow · tmavá | workflow logo + návrat; drobečky ne | 15/15; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-chatbot-automatizace-workflow.html` · AI agent, automatizace, workflow nebo chatbot? | workflow · tmavá | workflow logo + návrat; drobečky ne | 20/16; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-co-je-ai-agent.html` · AI agenti: když AI začne pracovat | workflow · světlá | 6 oblastí; drobečky ano | 10/0; — | ruční statické HTML; statické | světlý pilot/menu; čeká QA; dlouhý článek posoudit TOC · **nízké*** |
| `ai-agenti-coding-agenti.html` · Od vibe codingu ke coding agentům | workflow · tmavá | workflow logo + návrat; drobečky ne | 26/7; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-kdy-nepouzivat.html` · Kdy AI agenta ve škole raději nepoužívat | workflow · tmavá | workflow logo + návrat; drobečky ne | 20/3; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html` · Jak spolu souvisí LLM, Tools, RAG, Memory, Skills, Workflow a MCP | workflow · tmavá | workflow logo + návrat; drobečky ne | 24/14; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-mcp.html` · MCP: univerzální konektor pro svět AI agentů | workflow · tmavá | workflow logo + návrat; drobečky ne | 19/11; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-multi-agentni.html` · Multi-agentní systémy: když na jednom úkolu pracuje tým AI | workflow · tmavá | workflow logo + návrat; drobečky ne | 27/0; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-nastroje-function-calling.html` · Nástroje a Function Calling: jak dostane AI „ruce“ | workflow · tmavá | workflow logo + návrat; drobečky ne | 20/7; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-pamet.html` · Paměť AI agentů: co si AI skutečně pamatuje | workflow · tmavá | workflow logo + návrat; drobečky ne | 23/7; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-prvni-agent.html` · Jak navrhnout svého prvního jednoduchého AI agenta | workflow · tmavá | workflow logo + návrat; drobečky ne | 24/5; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-rag.html` · RAG: když AI pracuje s vašimi vlastními dokumenty | workflow · tmavá | workflow logo + návrat; drobečky ne | 20/20; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-skills.html` · Skills: jak naučit AI agenta opakovat osvědčený postup | workflow · tmavá | workflow logo + návrat; drobečky ne | 28/17; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-agenti-ve-skole.html` · AI agent ve škole: co může skutečně dělat učiteli | workflow · tmavá | workflow logo + návrat; drobečky ne | 24/11; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-7-univerzalnich-promptu.html` · 7 univerzálních AI promptů: rychlejší příprava výuky | workflow · tmavá | workflow logo + návrat; drobečky ne | 11/10; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-ai-agent-v-prohlizeci.html` · AI agent v prohlížeči: když AI také pracuje | workflow · tmavá | workflow logo + návrat; drobečky ne | 11/11; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-chatgpt-vizualni-materialy.html` · 7 promptů pro ChatGPT: vizuální výukové materiály | workflow · tmavá | workflow logo + návrat; drobečky ne | 13/7; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-chatgpt-zacatek-bezpecne.html` · ChatGPT pro učitele: jak začít bezpečně | guide · světlá | 6 oblastí; drobečky ano | 14/5; guide-toc | plný výstup build-guide-articles.js; copy/akordeon, sdílené UI; button×2, details×1 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `ai-navod-commands-chatgpt.html` · Commands v ChatGPT | workflow · tmavá | workflow logo + návrat; drobečky ne | 10/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-edit-kontrola.html` · EDIT: kontrola výstupů | workflow · tmavá | workflow logo + návrat; drobečky ne | 19/20; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-gemini-notebook-infografiky.html` · 7 promptů pro Gemini Notebook | workflow · tmavá | workflow logo + návrat; drobečky ne | 9/11; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-gemini-notebook-prezentace.html` · 7 promptů pro lepší výukovou prezentaci | workflow · tmavá | workflow logo + návrat; drobečky ne | 13/14; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-gemini-notebook-priprava.html` · 7 promptů pro Gemini Notebook | workflow · tmavá | workflow logo + návrat; drobečky ne | 10/8; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-gemini-notebook-vyuka.html` · Gemini Notebook ve výuce: interaktivní studijní prostředí | workflow · tmavá | workflow logo + návrat; drobečky ne | 13/16; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-lepsi-prompty-10-zasad.html` · Jak psát lepší prompty pro AI: 10 zásad pro učitele | workflow · tmavá | workflow logo + návrat; drobečky ne | 13/2; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-navod-prep-prompty.html` · PREP: lepší prompty | workflow · tmavá | workflow logo + návrat; drobečky ne | 16/8; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-10-promptu-gemini.html` · 10 promptů: pro Gemini Notebook | workflow · tmavá | workflow logo + návrat; drobečky ne | 15/25; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-18-promptu.html` · 18 promptů: pro učitele | workflow · tmavá | workflow logo + návrat; drobečky ne | 25/1; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-7-kroku-gemini-notebook.html` · 7 kroků: od zdrojů k AI tutorovi | guide · světlá | 6 oblastí; drobečky ano | 12/10; guide-toc | plný výstup build-guide-articles.js; copy/akordeon, sdílené UI; button×8, details×1 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `ai-workflow-8-otazek.html` · 8 otázek: AI ve výuce | workflow · tmavá | workflow logo + návrat; drobečky ne | 17/15; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-chatgpt-images-2-5.html` · ChatGPT Images 2.5 ve výuce: od jednoduchého obrázku k výukovému materiálu | workflow · tmavá | workflow logo + návrat; drobečky ne | 13/13; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-css-grid-vibe-coding.html` · CSS Grid: proč se při vibe codingu vyplatí rozumět řádkům a sloupcům | workflow · tmavá | workflow logo + návrat; drobečky ne | 13/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-fotografie-ucebnice.html` · Fotografii učebnice už nemusíte přepisovat | workflow · tmavá | workflow logo + návrat; drobečky ne | 4/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC jen při složitější struktuře · **střední** |
| `ai-workflow-gemini-notebook-ai-agent.html` · Chytrý učitelský sešit v Gemini Notebooku | workflow · tmavá | workflow logo + návrat; drobečky ne | 11/15; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-prep-edit.html` · PREP + EDIT: AI workflow ve škole | workflow · tmavá | workflow logo + návrat; drobečky ne | 17/27; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-prezentace-webova-stranka.html` · Od prezentace k webové stránce | workflow · tmavá | workflow logo + návrat; drobečky ne | 10/5; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-udl-ai.html` · UDL + AI: více cest k cíli | workflow · tmavá | workflow logo + návrat; drobečky ne | 29/24; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-usetri-praci.html` · Jak AI: šetří práci | workflow · tmavá | workflow logo + návrat; drobečky ne | 28/10; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-workflow-vibe-coding.html` · Vibe coding krok za krokem | workflow · tmavá | workflow logo + návrat; drobečky ne | 15/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-ziva-hlasova-ai-ve-vyuce.html` · Když AI začne skutečně naslouchat: živá hlasová umělá inteligence ve výuce | workflow · tmavá | workflow logo + návrat; drobečky ne | 15/6; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `asistent-ucitele-osobni-ai-asistent.html` · Asistent učitele: Pomocník, který pedagogům dosud chyběl | workflow · tmavá | workflow logo + návrat; drobečky ne | 13/1; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `gemini-desktop-navod-pro-ucitele.html` · Gemini Desktop pro učitele: instalace a první kroky ve Windows | workflow · tmavá | workflow logo + návrat; drobečky ne | 12/10; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `gemini-notebook-navod-pro-ucitele.html` · Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci | tool guide · tmavá | workflow logo + návrat; drobečky ne | 20/25; article-toc | ruční statické HTML; copy/akordeon; button×2 | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `gemini-skills-pro-ucitele.html` · Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat | tool guide · tmavá | workflow logo + návrat; drobečky ne | 18/25; article-toc | ruční statické HTML; copy/akordeon; input×8, button×11, details×8 | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **vysoké** |
| `gemini-storybook-navod-pro-ucitele.html` · Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku | tool guide · tmavá | workflow logo + návrat; drobečky ne | 9/17; — | ruční statické HTML; copy/akordeon; button×3 | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `neplytvej-inteligenci-ai-modely.html` · Neplýtvej inteligencí | workflow · tmavá | 6 oblastí; drobečky ne | 22/3; article-toc | ruční HTML; migrační skript pouze pro menu; copy/akordeon; button×6, details×1 | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `skill-anglictina-vyukove-materialy.html` · Jeden SKILL, sedm výukových materiálů: AI pomocník pro angličtinu | workflow · tmavá | workflow logo + návrat; drobečky ne | 7/6; — | ruční statické HTML; copy/akordeon; button×1 | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `vibe-coding-bezpecnost-kodu-php2shell.html` · Vibe Coding: AI ti naprogramuje aplikaci. Ale kdo zkontroluje její bezpečnost? | workflow · tmavá | workflow logo + návrat; drobečky ne | 10/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `vibe-coding-pro-ucitele.html` · Co si můžete vytvořit do výuky | workflow · tmavá | 6 oblastí; drobečky ne | 7/16; — | ruční HTML; migrační skript pouze pro menu; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `vibe-coding-ucitele.html` · Úvod do vibe codingu pro učitele | workflow · tmavá | workflow logo + návrat; drobečky ne | 12/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |

### B · Krátké články a novinky

| Soubor a název | Šablona / plocha | Hlavní navigace / drobečky | H2/H3 / TOC | Zdroj / interakce | Postup / riziko |
|---|---|---|---|---|---|
| `ai-novinka-agenti-onenote-pruvodce-ucenim.html` · AI ve vzdělávání: chytřejší agenti, OneNote v ChatGPT a AI jako průvodce učením | workflow · tmavá | workflow logo + návrat; drobečky ne | 11/3; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-ai-ve-vzdelavani-srpen-2026.html` · AI ve vzdělávání: co je nového na konci srpna | workflow · tmavá | workflow logo + návrat; drobečky ne | 7/3; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-chatgpt-interaktivni-kvizy.html` · ChatGPT přidává interaktivní kvízy | workflow · tmavá | workflow logo + návrat; drobečky ne | 6/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-datovi-agenti-lidske-schvaleni.html` · AI ve vzdělávání: datoví agenti, lidské schvalování a bezpečnější automatizace | workflow · světlá | 6 oblastí; drobečky ano | 11/5; article-content-navigation | ruční statické HTML; ruční ovládání; details×1 | světlý pilot/menu; čeká QA; dlouhý článek posoudit TOC · **nízké*** |
| `ai-novinka-gemini-classroom.html` · Gemini míří přímo do výuky | workflow · tmavá | workflow logo + návrat; drobečky ne | 4/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC jen při složitější struktuře · **střední** |
| `ai-novinka-gemini-desktop-chatgpt-word-agenti.html` · AI ve vzdělávání: Gemini na Windows, ChatGPT ve Wordu a nové hranice pro AI agenty | workflow · tmavá | workflow logo + návrat; drobečky ne | 8/5; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-gemini-notebook-sablona.html` · Gemini Notebook jako výuková šablona | workflow · tmavá | workflow logo + návrat; drobečky ne | 10/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-google-ai-vzdelavani-zari-2026.html` · AI ve vzdělávání: Google posiluje tvorbu materiálů i bezpečnost práce s daty | workflow · tmavá | workflow logo + návrat; drobečky ne | 9/4; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-microsoft-ai-workflow.html` · Microsoft skládá AI workflow pro učitele | workflow · tmavá | workflow logo + návrat; drobečky ne | 6/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-microsoft-gemini.html` · Microsoft skládá AI do jednoho prostředí | workflow · tmavá | workflow logo + návrat; drobečky ne | 6/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-pravidla-ve-skole.html` · AI pravidla ve škole | workflow · tmavá | workflow logo + návrat; drobečky ne | 29/26; article-toc | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html` · AI ve vzdělávání: sdílené zdroje, propojené aplikace a bezpečnější práce s daty | workflow · tmavá | workflow logo + návrat; drobečky ne | 14/3; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-vykonnejsi-ai.html` · Výkonnější AI se stává běžně dostupnou | workflow · tmavá | workflow logo + návrat; drobečky ne | 6/0; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `co-se-muze-ucitel-naucit-od-youtube.html` · Co se může učitel naučit od YouTube? Pozornost žáků není samozřejmost | workflow · tmavá | workflow logo + návrat; drobečky ne | 8/3; — | ruční statické HTML; statické | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `gemini-notebook-ucitel-vidi-chaty-zaku.html` · Učitel nově uvidí, jak se žáci učí s AI. Google Gemini Notebook otevírá novou kapitolu výuky | workflow · světlá | 6 oblastí; drobečky ano | 10/3; — | ruční statické HTML; sdílené UI | světlý pilot/menu; čeká QA; dlouhý článek posoudit TOC · **nízké*** |
| `notebooklm-hlasovy-rozhovor-nad-zdroji.html` · Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM | workflow · tmavá | workflow logo + návrat; drobečky ne | 12/0; — | ruční statické HTML; sdílené UI | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |

### C · Magazín a Filozofování s AI

| Soubor a název | Šablona / plocha | Hlavní navigace / drobečky | H2/H3 / TOC | Zdroj / interakce | Postup / riziko |
|---|---|---|---|---|---|
| `ai-novinka-ai-duvod-premyslet.html` · AI nemá za žáka přemýšlet. Má mu dát důvod přemýšlet. | magazín · světlá | 6 oblastí; drobečky ano | 12/8; magazine-toc | plný výstup build-magazine-articles.js; copy/akordeon, sdílené UI; button×3 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `ai-novinka-ai-ve-vzdelavani-zari-2026.html` · AI ve vzdělávání: přesnější práce s obrázky, bezpečnější přístup k AI a nové zázemí pro školy | magazín · světlá | 6 oblastí; drobečky ano | 14/3; magazine-toc | plný výstup build-magazine-articles.js; sdílené UI | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `ai-novinka-filozofovani-s-ai-chybejici-role.html` · AI možná nevezme učitelům práci. Možná nám ukáže, kolik lidí nám celou dobu chybělo | série · tmavá | magazín/série; drobečky ne | 8/0; — | ruční statické HTML; série, sdílené UI | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html` · Kritické myšlení už nestačí? Human in the Loop jako další krok v době AI | série · tmavá | magazín/série; drobečky ne | 9/0; — | ruční statické HTML; série, sdílené UI | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `filozofovani-s-ai.html` · Filozofování s AI | série · světlá | 6 oblastí; drobečky ano | 2/0; — | ruční statické HTML; série, sdílené UI | ponechat světlý základ/menu; TOC či regrese dle typu · **střední** |
| `kdyz-ai-jedna-odpovednost-ai-agenta.html` · Když AI už nejen radí, ale jedná: kdo nese odpovědnost za AI agenta? | série · tmavá | magazín/série; drobečky ne | 16/9; — | ruční statické HTML; série, sdílené UI | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |
| `uci-se-zak-nebo-za-nej-premysli-ai.html` · Učí se žák, nebo za něj přemýšlí AI? | série · tmavá | workflow logo + návrat; drobečky ne | 12/5; — | ruční statické HTML; série, sdílené UI | světlý obsah + 6 oblastí; TOC z H2/vybraných H3 · **střední** |

### D · Rozcestníky a katalogy

| Soubor a název | Šablona / plocha | Hlavní navigace / drobečky | H2/H3 / TOC | Zdroj / interakce | Postup / riziko |
|---|---|---|---|---|---|
| `ai-agenti.html` · AI agenti | katalog · světlá | 6 oblastí; drobečky ne | 2/15; — | build-catalog-pages.js; hledání/filtry; input×1, button×6 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `ai-navody.html` · Praktické návody pro učitele | katalog · světlá | 6 oblastí; drobečky ne | 2/35; — | build-catalog-pages.js; hledání/filtry; input×1, button×7 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `ai-novinky.html` · AI ve vzdělávání: co opravdu stojí za pozornost | katalog · světlá | 6 oblastí; drobečky ne | 2/25; — | build-catalog-pages.js; hledání/filtry; input×1, button×5 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `ai-workflow.html` · Workflow: ChatGPT → Claude | workflow · tmavá | 6 oblastí; drobečky ne | 14/16; — | ruční statické HTML; statické | světlit shell/menu; zachovat katalog/SEO; bez článkové TOC · **střední** |
| `ai.html` · AI ve vzdělávání: co opravdu stojí za pozornost | katalog · světlá | 6 oblastí; drobečky ne | 4/76; — | build-catalog-pages.js; hledání/filtry; input×1, button×7 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `anglictina.html` · Anglický jazyk s AI | předmět · světlá | 6 oblastí; drobečky ne | 5/7; — | ruční shell; generátory aktivit i promptů mění části; submenu, sdílené UI; button×19 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `cestina.html` · Český jazyk s AI | předmět · světlá | 6 oblastí; drobečky ne | 0/1; — | ruční shell; generátory aktivit i promptů mění části; submenu, sdílené UI; button×19 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `dejepis.html` · Dějepis s AI | předmět · světlá | 6 oblastí; drobečky ne | 0/1; — | ruční shell; generátory aktivit i promptů mění části; submenu, sdílené UI; button×19 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `index.html` · Umělá inteligence ve škole, která má smysl. | homepage/série · světlá | 6 oblastí; drobečky ne | 5/1; — | ruční shell; generate-prompts.js mění část; sdílené UI | homepage zachovat; jen regrese · **vysoké** |
| `matematika.html` · Matematika s AI | předmět · světlá | 6 oblastí; drobečky ne | 4/7; — | ruční shell; generátory aktivit i promptů mění části; submenu, sdílené UI; button×19 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `prirodoveda.html` · Přírodní vědy s AI | předmět · světlá | 6 oblastí; drobečky ne | 0/1; — | ruční shell; generátory aktivit i promptů mění části; submenu, sdílené UI; button×23 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `vibe-coding-clanky.html` · Články o Vibe Codingu | legacy/nástroj · tmavá | magazín/série; drobečky ne | 9/0; — | ruční statické HTML; sdílené UI | světlit shell/menu; zachovat katalog/SEO; bez článkové TOC · **střední** |
| `vibe-coding.html` · Vibe Coding | legacy/nástroj · tmavá | 6 oblastí; drobečky ne | 0/1; — | ruční statické HTML; sdílené UI | světlit shell/menu; zachovat katalog/SEO; bez článkové TOC · **střední** |

### E · Generátory promptů a interaktivní nástroje

| Soubor a název | Šablona / plocha | Hlavní navigace / drobečky | H2/H3 / TOC | Zdroj / interakce | Postup / riziko |
|---|---|---|---|---|---|
| `aktivity.html` · Výukové aktivity s AI | předmět · světlá | 6 oblastí; drobečky ne | 1/45; — | ruční shell; generate-activities.js mění část; aktivity/dialogy, submenu, sdílené UI; input×1, button×89 | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `gemini-notebook-prompty.html` · Prompty pro Gemini Notebook | legacy/nástroj · světlá | 6 oblastí; drobečky ano | 1/3; — | ruční shell; generate-prompts.js mění část; sdílené UI; button×28 | světlý pilot/menu; čeká QA; dlouhý článek posoudit TOC · **vysoké** |
| `prompty.html` · Knihovna Promptů | legacy/nástroj · tmavá | 6 oblastí; drobečky ne | 9/1; — | ruční shell; generate-prompts.js mění část; sdílené UI; input×1, button×154 | samostatně; zachovat generátor, formulář, filtry, kopírování · **vysoké** |
| `qr-kod.html` · Vytvořte QR kód z odkazu | legacy/nástroj · tmavá | 6 oblastí; drobečky ne | 2/4; — | ruční statické HTML; sdílené UI; form×1, input×6, button×3 | samostatně; zachovat generátor, formulář, filtry, kopírování · **vysoké** |
| `vibe-coding-prompty.html` · Prompty pro Vibe Coding | legacy/nástroj · tmavá | 6 oblastí; drobečky ne | 2/0; — | ruční shell; generate-prompts.js mění část; sdílené UI; button×11 | samostatně; zachovat generátor, formulář, filtry, kopírování · **vysoké** |

### F · Asistenti, produktové stránky a projekty

| Soubor a název | Šablona / plocha | Hlavní navigace / drobečky | H2/H3 / TOC | Zdroj / interakce | Postup / riziko |
|---|---|---|---|---|---|
| `asistenti.html` · AI asistenti a boti | legacy/nástroj · tmavá | 6 oblastí; drobečky ne | 0/0; — | ruční statické HTML; sdílené UI | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |
| `asistenti/math-cermat.html` · MathCERMAT | legacy/nástroj · tmavá | workflow logo; drobečky ne | 7/0; — | ruční statické HTML; sdílené UI; button×1 | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |
| `asistenti/metodicky-asistent-gemini.html` · Metodický asistent (Gemini Gem) | legacy/nástroj · tmavá | workflow logo; drobečky ne | 3/0; — | ruční statické HTML; sdílené UI; button×1 | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |
| `chatgpt-pro-ucitele.html` · ChatGPT pro učitele | katalog · světlá | 6 oblastí; drobečky ne | 3/20; — | build-catalog-pages.js; hledání/filtry | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `claude-pro-ucitele.html` · Claude pro učitele | workflow · tmavá | 6 oblastí; drobečky ne | 3/0; — | ruční HTML; migrační skript pouze pro menu; statické | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |
| `copilot-pro-ucitele.html` · Microsoft Copilot pro učitele | workflow · tmavá | workflow logo + návrat; drobečky ne | 3/0; — | ruční statické HTML; statické | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |
| `gemini-notebook.html` · Gemini Notebook | katalog · světlá | 6 oblastí; drobečky ne | 5/12; — | build-catalog-pages.js; hledání/filtry | ponechat světlý základ/menu; TOC či regrese dle typu · **vysoké** |
| `gemini-pro-ucitele.html` · Google Gemini pro učitele | workflow · světlá | 6 oblastí; drobečky ano | 4/0; — | ruční HTML; migrační skript pouze pro menu; statické | světlý pilot/menu; čeká QA; dlouhý článek posoudit TOC · **nízké*** |
| `google-ai-studio-2026-vibe-coding.html` · Google AI Studio 2026: od jednoduchého promptu k celé aplikaci | workflow · tmavá | workflow logo + návrat; drobečky ne | 14/4; — | ruční statické HTML; statické | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |
| `katalog-asistenti.html` · Hotoví AI asistenti pro učitele | legacy/nástroj · tmavá | 6 oblastí; drobečky ne | 0/0; — | ruční statické HTML; sdílené UI; button×4 | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |
| `perplexity-pro-ucitele.html` · Perplexity pro učitele | workflow · tmavá | workflow logo + návrat; drobečky ne | 3/0; — | ruční statické HTML; statické | produktová šablona; zachovat CTA, karty, externí cíle · **střední** |

## Již vyhovující a vyžadující úpravy

### Částečně vyhovující / reference

- **23 světlých stránek se šestipoložkovým menu.** Pět pilotů PR #51: `ai-agenti-co-je-ai-agent.html`, `ai-novinka-datovi-agenti-lidske-schvaleni.html`, `gemini-notebook-prompty.html`, `gemini-notebook-ucitel-vidi-chaty-zaku.html`, `gemini-pro-ucitele.html`. Vizuální schválení čeká na browser QA.
- **18 starších světlých stránek:** `ai-agenti.html`, `ai-navod-chatgpt-zacatek-bezpecne.html`, `ai-navody.html`, `ai-novinka-ai-duvod-premyslet.html`, `ai-novinka-ai-ve-vzdelavani-zari-2026.html`, `ai-novinky.html`, `ai-workflow-7-kroku-gemini-notebook.html`, `ai.html`, `aktivity.html`, `anglictina.html`, `cestina.html`, `chatgpt-pro-ucitele.html`, `dejepis.html`, `filozofovani-s-ai.html`, `gemini-notebook.html`, `index.html`, `matematika.html`, `prirodoveda.html`. Zachovat jejich odlišné generátory/šablony.
- **10 stránek s menu, ale tmavým základem:** `ai-workflow.html`, `asistenti.html`, `claude-pro-ucitele.html`, `katalog-asistenti.html`, `neplytvej-inteligenci-ai-modely.html`, `prompty.html`, `qr-kod.html`, `vibe-coding-pro-ucitele.html`, `vibe-coding-prompty.html`, `vibe-coding.html`.
- **34 stránek s nějakou TOC:** jen jedna používá komponentu PR #52; staré varianty migrací postupně sjednotit bez druhé DOM kopie.

### Vyžadují úpravu nebo individuální posouzení

80 obsahových stránek má tmavý základ, 70 z nich nemá šestipoložkové menu. Z dlouhých článků A/B/C nemá TOC 37. To není zadání pro hromadnou náhradu: každá stránka nejdřív potřebuje určení šablony, zdroje a interakcí.

## Generátory a pravidla úprav

| Zdroj | Co aktualizuje | Pravidlo pro migraci |
|---|---|---|
| `scripts/build-guide-articles.js`, `content/guides/articles.json`, `content/guides/` | Plně generuje `ai-navod-chatgpt-zacatek-bezpecne.html` a `ai-workflow-7-kroku-gemini-notebook.html`; generuje H2/H3 kotvy a copy bloky. | Změnit zdroj/generátor/template, nikoli jen HTML. Ověřit `--check`, obsah, metadata, jedinečná ID. |
| `scripts/build-magazine-articles.js`, manifest a `templates/magazine/*.tpl` | Plně generuje `ai-novinka-ai-duvod-premyslet.html` a `ai-novinka-ai-ve-vzdelavani-zari-2026.html`; používá `magazine-toc`. | Upravit generátor i template/manifest, zachovat datum, SEO a drobečky; ověřit oba výstupy. |
| `scripts/build-catalog-pages.js` | Vytváří `ai.html`, `ai-navody.html`, `ai-novinky.html`, `ai-agenti.html`, `chatgpt-pro-ucitele.html`, `gemini-notebook.html`; čerpá z `js/site-articles.js`. | Změny do skriptu/šablony; zachovat hledání, filtry, noscript, canonical/OG a šest nejnovějších článků. |
| `scripts/generate-activities.js` | Aktualizuje oblasti aktivit v `aktivity.html` a pěti oborových stránkách. | Shell je ruční, aktivita generovaná; porovnat ID, počty a modální cíle. |
| `scripts/generate-prompts.js` | Mění promptové oblasti v `prompty.html`, obou specializovaných prompt stránkách, pěti předmětech a čítač promptů v `index.html`. | Zachovat ID promptů, obsah, kopírování a homepage counter. |
| `scripts/migrate-manual-article-navigation.js`, `templates/site-navigation.tpl` | Menu na ChatGPT, Gemini, Claude, Vibe Coding Pro a `neplytvej-inteligenci-ai-modely.html`. | Jde o menu, nikoli generátor článkového vzhledu; spouštět jen po kontrole a s `--check`. |
| `js/site-navigation-data.js` + `js/site-navigation.js` | Statické menu šesti oblastí a JS vylepšení aktivní oblasti/ovládání. | HTML odkazy fungují i bez JS; otestovat mobil, klávesnici a fokus. |
| `js/site-articles.js` + `js/catalog-directory.js` | Katalogová metadata a vyhledávání/filtry. | Při změně detailního článku synchronně aktualizovat katalog dle `AGENTS.md`; designová migrace nemění URL, datum ani metadata. |

### Standard obsahové navigace

1. Pět a více hlavních H2 → standardně TOC; kratší článek jen při složitější struktuře.
2. Jeden `details/nav/ol` seznam: vlevo sticky na desktopu, na mobilu rozbalovací nad obsahem; vnitřní seznam může scrollovat.
3. Odkazy jdou na skutečné H2 a vybrané H3 se stabilními ID. Zachovat všechny existující fragmenty.
4. Odkazy fungují bez JS; JS pouze zvýrazní aktivní kapitolu.
5. `guide-toc`, `magazine-toc`, `article-toc` se slučují přes konkrétní zdroje/generátory. Žádný globální find/replace ani duplicitní seznam.
6. Globální menu, drobečky a lokální TOC mají oddělenou roli. Drobečky přidávat jen při užitečné hierarchii.

## Návrh migračních vln

Vlny jsou návrhem pořadí, ne souhlasem s implementací. První realizační vlna má čtyři související stránky stejného typu.

| Vlna | Stránky / soubory a důvod | Změny, rizika a testy |
|---|---|---|
| 0 · Brána QA | Bez změn souborů: browser QA kompletní stránky PR #52 (desktop, mobil, klávesnice, H2/H3 kotvy, sticky, active section, JS vypnuto, screenshot). Implementace čeká na důkaz a schválení pořadí. |
| 1 · Pilot AI agenti | `ai-agenti-10-ukolu.html`, `ai-agenti-agentni-smycka.html`, `ai-agenti-chatbot-automatizace-workflow.html`, `ai-agenti-kdy-nepouzivat.html`. Stejný `workflow-page`; jedna bez TOC, tři se starým `article-toc`, různé H3. |
| 2 · AI agenti A | `ai-agenti-coding-agenti.html`, `ai-agenti-nastroje-function-calling.html`, `ai-agenti-pamet.html`, `ai-agenti-rag.html`. Zachovat kód/diagramy a kotvy. |
| 3 · AI agenti B | `ai-agenti-mcp.html`, `ai-agenti-multi-agentni.html`, `ai-agenti-prvni-agent.html`, `ai-agenti-skills.html`. Otestovat vnořené H3 a vnitřní scroll. |
| 4 · AI agenti C | `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html`, `ai-agenti-ve-skole.html`, `ai-agenti-co-je-ai-agent.html`. Dva tmavé články a světlý pilot #51 pro regresi/TOC. |
| 5 · Praktické návody A | `ai-navod-gemini-notebook-infografiky.html`, `ai-navod-gemini-notebook-prezentace.html`, `ai-navod-gemini-notebook-priprava.html`, `ai-navod-gemini-notebook-vyuka.html`. Společná workflow šablona, obrázky a prompty. |
| 6 · Praktické návody B | `ai-navod-7-univerzalnich-promptu.html`, `ai-navod-ai-agent-v-prohlizeci.html`, `ai-navod-chatgpt-vizualni-materialy.html`, `ai-navod-commands-chatgpt.html`. Zachovat promptové bloky. |
| 7 · Praktické návody C | `ai-navod-edit-kontrola.html`, `ai-navod-lepsi-prompty-10-zasad.html`, `ai-navod-prep-prompty.html`. Stabilní ID, delší struktura. |
| 8 · Tool guides | `gemini-desktop-navod-pro-ucitele.html`, `gemini-notebook-navod-pro-ucitele.html`, `gemini-skills-pro-ucitele.html`, `gemini-storybook-navod-pro-ucitele.html`. Samostatné copy/akordeon testy. |
| 9 · Guide generátor | `ai-navod-chatgpt-zacatek-bezpecne.html`, `ai-workflow-7-kroku-gemini-notebook.html`; upravit `scripts/build-guide-articles.js` a zdroje/template, ne pouze výstup. Sjednotit dvojí TOC. |
| 10 · Workflow A | `ai-workflow-8-otazek.html`, `ai-workflow-prep-edit.html`, `ai-workflow-udl-ai.html`, `ai-workflow-usetri-praci.html`. Tabulky, ilustrace, dlouhé kapitoly. |
| 11 · Workflow B | `ai-workflow-10-promptu-gemini.html`, `ai-workflow-18-promptu.html`, `ai-workflow-chatgpt-images-2-5.html`, `ai-workflow-gemini-notebook-ai-agent.html`. Zachovat copy a obrázky. |
| 12 · Workflow C | `ai-workflow-css-grid-vibe-coding.html`, `ai-workflow-fotografie-ucebnice.html`, `ai-workflow-prezentace-webova-stranka.html`, `ai-workflow-vibe-coding.html`, `ai-ziva-hlasova-ai-ve-vyuce.html`. Kód, obrázky a nadpisy. |
| 13 · Ostatní metodické/projektové články | `asistent-ucitele-osobni-ai-asistent.html`, `neplytvej-inteligenci-ai-modely.html`, `skill-anglictina-vyukove-materialy.html`, `vibe-coding-bezpecnost-kodu-php2shell.html`, `vibe-coding-pro-ucitele.html`, `vibe-coding-ucitele.html`. Před úpravou rozlišit článek a landing page. |
| 14 · News roundup | `ai-novinka-agenti-onenote-pruvodce-ucenim.html`, `ai-novinka-gemini-desktop-chatgpt-word-agenti.html`, `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html`, `notebooklm-hlasovy-rozhovor-nad-zdroji.html`. Čtyři `workflow-news-roundup` stránky; pilot datových agentů je reference. |
| 15 · Kratší novinky | `ai-novinka-ai-ve-vzdelavani-srpen-2026.html`, `ai-novinka-gemini-classroom.html`, `ai-novinka-microsoft-ai-workflow.html`, `ai-novinka-microsoft-gemini.html`, `ai-novinka-vykonnejsi-ai.html`. TOC pouze podle skutečných kapitol. |
| 16 · Delší/tematické novinky | `ai-novinka-chatgpt-interaktivni-kvizy.html`, `ai-novinka-gemini-notebook-sablona.html`, `ai-novinka-google-ai-vzdelavani-zari-2026.html`, `ai-novinka-pravidla-ve-skole.html`, `gemini-notebook-ucitel-vidi-chaty-zaku.html`, `co-se-muze-ucitel-naucit-od-youtube.html`, `ai-novinka-datovi-agenti-lidske-schvaleni.html`. Zachovat interakce, zdroje a metadata. |
| 17 · Magazínový generátor | `ai-novinka-ai-duvod-premyslet.html`, `ai-novinka-ai-ve-vzdelavani-zari-2026.html`; změnit `scripts/build-magazine-articles.js`, manifest a `templates/magazine/`, ne pouze výstup. |
| 18 · Filozofování a série | `ai-novinka-filozofovani-s-ai-chybejici-role.html`, `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html`, `kdyz-ai-jedna-odpovednost-ai-agenta.html`, `uci-se-zak-nebo-za-nej-premysli-ai.html`, `filozofovani-s-ai.html`. Zachovat sériové návaznosti. |
| 19 · Generované katalogy | `ai.html`, `ai-navody.html`, `ai-novinky.html`, `ai-agenti.html`, `chatgpt-pro-ucitele.html`, `gemini-notebook.html`; zdrojem je `scripts/build-catalog-pages.js`. `index.html` se neredesignuje. |
| 20 · Oborová a tematická rozcestí | `anglictina.html`, `cestina.html`, `dejepis.html`, `matematika.html`, `prirodoveda.html`, `ai-workflow.html`, `vibe-coding.html`, `vibe-coding-clanky.html`; homepage pouze regresně. Oborové generované oblasti aktivit/promptů chránit. |
| 21 · Interaktivní nástroje | `aktivity.html`, `prompty.html`, `gemini-notebook-prompty.html`, `vibe-coding-prompty.html`, `qr-kod.html`. Samostatně testovat formuláře, filtry, dialogy, schránku a stav kopírování. |
| 22 · Asistenti a produktové stránky | `asistenti.html`, `asistenti/math-cermat.html`, `asistenti/metodicky-asistent-gemini.html`, `katalog-asistenti.html`, `claude-pro-ucitele.html`, `copilot-pro-ucitele.html`, `gemini-pro-ucitele.html`, `perplexity-pro-ucitele.html`, `google-ai-studio-2026-vibe-coding.html`. ChatGPT/Gemini Notebook produktové výstupy jsou ve vlně 19. |
| 23 · Regresní sada | `ai-novinka-datovi-agenti-lidske-schvaleni.html`, `ai-agenti-co-je-ai-agent.html`, `index.html` (bez redesignu), `ai.html`, `aktivity.html`, `prompty.html`, `ai-workflow-7-kroku-gemini-notebook.html`, `ai-novinka-ai-duvod-premyslet.html`. Rozsah testů podle dotčeného CSS/JS/generátoru. |

### Regresní minimum

- Porovnat text, pořadí H2/H3, ID, obrázky/alt, odkazy, SEO metadata, datum a katalogové údaje.
- Pokud browser dovolí přesné viewporty, prověřit 320, 390, 768, 800, 801, 1024 a 1440 px; screenshoty, overflow, logo/menu, sticky a mobilní disclosure.
- Otestovat Tab, Shift+Tab, Enter, Space, Escape, fokus, H2/H3 kotvy a JS vypnutý režim.
- Prověřit konzoli, CSS/obrázky, computed styles, WCAG AA a axe-core, pokud dostupný.
- Sdílené CSS/JS regresně ověřit na světlém pilotu, článku #52, katalogu a interaktivním nástroji podle změněné vrstvy.
- Generátory spouštět jen cíleně s `--check` a kontrolou diffu; neprovádět plošný rebuild.

## Počty na závěr

- **104 HTML:** 103 obsahových a jeden ověřovací soubor mimo rozsah.
- **23 světlých / 80 tmavých** obsahových stránek podle statických stylů.
- **33 stránek se šestipoložkovým menu:** 23 světlých a 10 tmavých; 70 bez společného menu.
- **10 breadcrumb ano / 93 ne.**
- **34 TOC ano / 69 ne.** Mezi články A/B/C je 71 s pěti a více H2; 34 mají nějakou TOC a 37 ji nemají.
- **Rizikovost budoucích úprav:** 22 vysoká, 77 střední, 4 nízká*. Vysoká zahrnuje generátory, generované fragmenty nebo výraznou interaktivitu. Nízká* jsou čtyři pilotní světlé stránky PR #51; promptová stránka je vyhodnocena jako vysoká kvůli generátoru. Vizuální schválení všech pěti pilotů přesto chybí.
- **Počet stránek podle skupin:** A 51, B 16, C 7, D 13, E 5, F 11.

## Schválení před implementací

Prosím schválit nebo upravit pořadí vln 1–23. Doporučuji začít čtyřmi AI agentními články ve vlně 1. Implementace zůstává podmíněna vizuálním ověřením kompletního článku PR #52. PR #53 obsahuje pouze inventuru a plán.
