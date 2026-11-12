# Audit světlého pozadí stránek – etapa 7J

**Rozsah:** statická inventura 103 obsahových HTML souborů na HEAD PR #49 `3ef60a6dbf05af9813e84845847c963403bdbfb7`. Zahrnuje homepage a referenční stránku; vyřazen je pouze `googled4301464bc8f67c5.html`, který je ověřovacím souborem, ne obsahovou stránkou. Relativní cesty podsložky jsou uvedeny s `/`.

## Souhrn

| Typ | Počet | Kritérium |
|---|---:|---|
| Světlé | 18 | Základní plocha body i obsah jsou světlé, zpravidla kolem #fffefa až #f7f7f1. |
| Tmavé | 85 | Tmavý je základ body a hlavního obsahu; lokální světlé komponenty nemění základ stránky. |
| Smíšené | 0 | Žádná stránka nemá současně významnou světlou i tmavou základní plochu těla/hlavního obsahu. |
| **Celkem** | **103** | |

Účelové tmavé fotografie, hero, ilustrace, bannerové vrstvy a patičky nepočítám jako „smíšené“, pokud základní plocha stránky zůstává světlá nebo tmavá. Za hlavní obsah považuji plochu pod hlavičkou; průhledné wrappery přebírají pozadí body. Klasifikace vychází z deklarací CSS a tříd body, nikoli z runtime computed styles v prohlížeči.
## Úplný seznam stránek

Každý HTML soubor je uveden právě v jedné skupině se stejnou klasifikací, třídou body a přesnou sadou lokálních stylesheetů. Cesty v buňce jsou úplným seznamem členů skupiny; různé cache query parametry byly normalizovány, protože nemění CSS soubor. Externí Font Awesome se používá na vybraných katalogových stránkách, ale neřídí základní pozadí.

| Typ | Počet | Třídy body | Lokální CSS | Stránky |
|---|---:|---|---|---|
| Tmavá | 55 | workflow-page | `css/workflow.css` | `ai-agenti-10-ukolu.html`, `ai-agenti-agentni-smycka.html`, `ai-agenti-chatbot-automatizace-workflow.html`, `ai-agenti-co-je-ai-agent.html`, `ai-agenti-coding-agenti.html`, `ai-agenti-kdy-nepouzivat.html`, `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html`, `ai-agenti-mcp.html`, `ai-agenti-multi-agentni.html`, `ai-agenti-nastroje-function-calling.html`, `ai-agenti-pamet.html`, `ai-agenti-prvni-agent.html`, `ai-agenti-rag.html`, `ai-agenti-skills.html`, `ai-agenti-ve-skole.html`, `ai-navod-7-univerzalnich-promptu.html`, `ai-navod-ai-agent-v-prohlizeci.html`, `ai-navod-chatgpt-vizualni-materialy.html`, `ai-navod-commands-chatgpt.html`, `ai-navod-edit-kontrola.html`, `ai-navod-gemini-notebook-infografiky.html`, `ai-navod-gemini-notebook-prezentace.html`, `ai-navod-gemini-notebook-priprava.html`, `ai-navod-gemini-notebook-vyuka.html`, `ai-navod-lepsi-prompty-10-zasad.html`, `ai-navod-prep-prompty.html`, `ai-novinka-ai-ve-vzdelavani-srpen-2026.html`, `ai-novinka-chatgpt-interaktivni-kvizy.html`, `ai-novinka-gemini-classroom.html`, `ai-novinka-gemini-notebook-sablona.html`, `ai-novinka-google-ai-vzdelavani-zari-2026.html`, `ai-novinka-microsoft-ai-workflow.html`, `ai-novinka-microsoft-gemini.html`, `ai-novinka-pravidla-ve-skole.html`, `ai-novinka-vykonnejsi-ai.html`, `ai-workflow-10-promptu-gemini.html`, `ai-workflow-18-promptu.html`, `ai-workflow-8-otazek.html`, `ai-workflow-chatgpt-images-2-5.html`, `ai-workflow-css-grid-vibe-coding.html`, `ai-workflow-fotografie-ucebnice.html`, `ai-workflow-gemini-notebook-ai-agent.html`, `ai-workflow-prep-edit.html`, `ai-workflow-prezentace-webova-stranka.html`, `ai-workflow-udl-ai.html`, `ai-workflow-usetri-praci.html`, `ai-workflow-vibe-coding.html`, `ai-ziva-hlasova-ai-ve-vyuce.html`, `asistent-ucitele-osobni-ai-asistent.html`, `copilot-pro-ucitele.html`, `gemini-desktop-navod-pro-ucitele.html`, `google-ai-studio-2026-vibe-coding.html`, `perplexity-pro-ucitele.html`, `vibe-coding-bezpecnost-kodu-php2shell.html`, `vibe-coding-ucitele.html` |
| Světlá | 3 | site-navigation-enabled | `css/catalog-directory.css`, `css/site-navigation.css` | `ai-agenti.html`, `ai-navody.html`, `ai-novinky.html` |
| Světlá | 2 | home-redesign guide-page site-navigation-enabled | `css/home.css`, `css/guide-article.css`, `css/site-navigation.css` | `ai-navod-chatgpt-zacatek-bezpecne.html`, `ai-workflow-7-kroku-gemini-notebook.html` |
| Tmavá | 4 | workflow-page workflow-news-roundup | `css/workflow.css` | `ai-novinka-agenti-onenote-pruvodce-ucenim.html`, `ai-novinka-datovi-agenti-lidske-schvaleni.html`, `ai-novinka-gemini-desktop-chatgpt-word-agenti.html`, `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html` |
| Světlá | 2 | magazine-article-page site-navigation-enabled | `css/magazine-article.css`, `css/site-navigation.css` | `ai-novinka-ai-duvod-premyslet.html`, `ai-novinka-ai-ve-vzdelavani-zari-2026.html` |
| Tmavá | 4 | workflow-page workflow-news-roundup workflow-philosophy | `css/style.css`, `css/workflow.css`, `css/series-page.css` | `ai-novinka-filozofovani-s-ai-chybejici-role.html`, `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html`, `kdyz-ai-jedna-odpovednost-ai-agenta.html`, `uci-se-zak-nebo-za-nej-premysli-ai.html` |
| Tmavá | 5 | workflow-page site-navigation-enabled | `css/workflow.css`, `css/site-navigation.css` | `ai-workflow.html`, `claude-pro-ucitele.html`, `gemini-pro-ucitele.html`, `neplytvej-inteligenci-ai-modely.html`, `vibe-coding-pro-ucitele.html` |
| Světlá | 1 | (bez třídy body) | `css/catalog-directory.css`, `css/site-navigation.css` | `ai.html` |
| Světlá | 1 | subject-page activity-library-page | `css/style.css`, `css/subject-pages.css`, `css/activity-library.css`, `css/site-navigation.css` | `aktivity.html` |
| Světlá | 1 | subject-page subject-page--english site-navigation-enabled | `css/style.css`, `css/subject-pages.css`, `css/site-navigation.css` | `anglictina.html` |
| Tmavá | 2 | (bez třídy body) | `../css/style.css` | `asistenti/math-cermat.html`, `asistenti/metodicky-asistent-gemini.html` |
| Tmavá | 4 | site-navigation-enabled | `css/style.css`, `css/site-navigation.css` | `asistenti.html`, `katalog-asistenti.html`, `prompty.html`, `qr-kod.html` |
| Světlá | 1 | subject-page subject-page--czech site-navigation-enabled | `css/style.css`, `css/subject-pages.css`, `css/site-navigation.css` | `cestina.html` |
| Světlá | 1 | workflow-page catalog-product-page site-navigation-enabled | `css/workflow.css`, `css/site-navigation.css`, `css/catalog-directory.css` | `chatgpt-pro-ucitele.html` |
| Tmavá | 1 | workflow-page workflow-youtube-article | `css/workflow.css` | `co-se-muze-ucitel-naucit-od-youtube.html` |
| Světlá | 1 | subject-page subject-page--history site-navigation-enabled | `css/style.css`, `css/subject-pages.css`, `css/site-navigation.css` | `dejepis.html` |
| Světlá | 1 | home-redesign philosophy-series-page | `css/style.css`, `css/home.css`, `css/site-navigation.css`, `css/series-page.css` | `filozofovani-s-ai.html` |
| Tmavá | 2 | workflow-page tool-guide-page | `css/workflow.css` | `gemini-notebook-navod-pro-ucitele.html`, `gemini-storybook-navod-pro-ucitele.html` |
| Tmavá | 1 | gemini-notebook-prompt-page site-navigation-enabled | `css/style.css`, `css/site-navigation.css` | `gemini-notebook-prompty.html` |
| Tmavá | 1 | workflow-page workflow-news-roundup insight-summaries-page | `css/style.css`, `css/workflow.css` | `gemini-notebook-ucitel-vidi-chaty-zaku.html` |
| Světlá | 1 | workflow-page catalog-product-page site-navigation-enabled | `css/catalog-directory.css`, `css/site-navigation.css` | `gemini-notebook.html` |
| Tmavá | 1 | workflow-page tool-guide-page gemini-skills-page | `css/workflow.css` | `gemini-skills-pro-ucitele.html` |
| Světlá | 1 | home-redesign | `css/style.css`, `css/home.css`, `css/site-navigation.css` | `index.html` |
| Světlá | 1 | subject-page subject-page--mathematics site-navigation-enabled | `css/style.css`, `css/subject-pages.css`, `css/site-navigation.css` | `matematika.html` |
| Tmavá | 1 | workflow-page workflow-news-roundup | `css/style.css`, `css/workflow.css` | `notebooklm-hlasovy-rozhovor-nad-zdroji.html` |
| Světlá | 1 | subject-page subject-page--science site-navigation-enabled | `css/style.css`, `css/subject-pages.css`, `css/site-navigation.css` | `prirodoveda.html` |
| Tmavá | 1 | workflow-page workflow-news-roundup english-skill-article | `css/workflow.css` | `skill-anglictina-vyukove-materialy.html` |
| Tmavá | 1 | (bez třídy body) | `css/style.css` | `vibe-coding-clanky.html` |
| Tmavá | 1 | vibe-prompt-page site-navigation-enabled | `css/style.css`, `css/site-navigation.css` | `vibe-coding-prompty.html` |
| Tmavá | 1 | (bez třídy body) | `css/style.css`, `css/site-navigation.css` | `vibe-coding.html` |



## Základní barvy, původ a nutné návazné úpravy

| CSS | Základní pozadí | Původ a co by změna musela zahrnout |
|---|---|---|
| `css/home.css` | `body.home-redesign` používá `#fffefa`; tmavý banner/fotografie a `home-footer` jsou samostatné sekce. | Schválený vzor. Zachovat čitelnost textu na světlých vrstvách i tmavém obrazovém překryvu. |
| `css/workflow.css` | `body.workflow-page`: gradient do `#0a0f1e`; text `#eaf0fb`; hlavní povrch často `#0d1530`. | Starší tmavá workflow šablona. Přechod vyžaduje mapovat texty, odkazy, prompt/kód, tabulky, infoboxy, karty, diagramy, tlačítka a jejich stavy, ohraničení, stíny, hero overlay i patičku. |
| `css/style.css` | `--bg-primary: #0a0f1e`; globální `body` a text používají tmavé tokeny. | Starší globální design. Vedle pozadí prověřit globální nadpisy, odkazy, karty, dialogy, formuláře a interaktivní stavy; některé stránky přepisují pouze dílčí komponenty. |
| `css/subject-pages.css` + `css/style.css` | `.subject-page` přepíše tokeny na `#f7f7f1`, tmavý text a bílé karty. | Již světlá výjimka nad tmavým základem. Ověřit dialog aktivity a prvky mimo scope `.subject-page`. |
| `css/guide-article.css` + `css/home.css` | `.guide-page` světlé `var(--guide-cream)`. | Novější světlá šablona; zachovat čitelnost promptů, kódu, screenshotů a obsahu TOC. |
| `css/magazine-article.css` | `body.magazine-article-page` = `#fffdf7`. | Světlá magazínová šablona; samostatný tmavý footer a meta texty potřebují samostatné kontrastní posouzení. |
| `css/catalog-directory.css` | `body` = `var(--paper)`; u produktové stránky přepisuje staré workflow pozadí/text. | Světlé katalogy a výjimka ChatGPT. Zkontrolovat úplnost specifičtějších přepisů workflow a kontrast filtrů, badge a stavů. |

### Zvláštní kontrola PR #49

Pět změněných článků má nyní společnou šestipoložkovou navigaci, ale navigační CSS samo o sobě nezesvětluje tělo:

- `chatgpt-pro-ucitele.html` načítá `workflow.css`, `site-navigation.css` a `catalog-directory.css`. Poslední CSS přepíše `body.workflow-page.catalog-product-page` na světlé paper/ink a styluje článek do světlé karty. Klasifikace: **světlá, s legacy strukturální závislostí**.
- `gemini-pro-ucitele.html`, `claude-pro-ucitele.html`, `vibe-coding-pro-ucitele.html`, `neplytvej-inteligenci-ai-modely.html` načítají `workflow.css` a `site-navigation.css`; jejich tělo i hlavní obsah zůstává tmavý. Klasifikace: **tmavé**, se světlou navigační hlavičkou, tedy vizuálně nesourodé vůči homepage.

## Rizika kontrastu a čitelnosti

1. Světlý text (`#eaf0fb`) ztratí kontrast na světlé ploše; tmavý text z lokálních komponent může naopak zaniknout po změně podkladů.
2. Prompty, kódové bloky, tabulky, workflow diagramy a ilustrace používají vlastní povrchy a barvy; změna samotného `body` nechá jejich barvy nekonzistentní.
3. Akcent `#00d4a8`, badge i odkazy byly navrženy na tmavém podkladu. Ověřit běžný, hover, focus, visited, disabled a selected stav.
4. Tmavé fotografické overlaye a bannery často nesou světlý text. Zachovat jejich účel a nepřebarvovat plošně obrázky či sekce.
5. Hlavička může být už světlá, zatímco obsah zůstává tmavý; patičky bývají naopak záměrně tmavé i na světlé stránce.
6. Globální token `style.css` může ovlivnit odlišné šablony, zatímco pozdější selektory `subject-pages.css` a `catalog-directory.css` přepisují jen část kaskády. Změna tokenu proto není bezpečný univerzální přístup.

## Bezpečný postup sjednocení po skupinách

1. Rozhodnout, zda cílová světlá identita platí i pro hlavní obsah a článkové hero stránek PR #49; nejprve ověřit čtyři tmavé články vedle ChatGPT.
2. Pilotovat jednotlivé tmavé kaskády samostatně: čisté `workflow.css`, kombinaci `style.css + workflow.css`, samostatné `style.css` a zvláštní novinkovou/promptovou/agentní šablonu.
3. V každé rodině vytvořit mapu povrchů a textových/stavových barev; upravovat pouze scoped CSS dané rodiny, ne globální hromadnou náhradou.
4. Zachovat tmavé grafické bloky, fotografie a účelové ilustrace; ověřit screenshoty ve stejných rozměrech a automaticky i ručně posoudit kontrast, focus, tlačítka, prompty a obrázky.
5. Po každé rodině otestovat původní interakce jako vyhledávání, filtry, kopírování promptů, rozbalování a dialogy.

### Doporučená první testovací skupina pěti stránek

- `gemini-pro-ucitele.html` — jedna z tmavých stránek PR #49 pod novou navigací.
- `ai-agenti-co-je-ai-agent.html` — samostatný článek agenta na čistém `workflow.css`.
- `ai-novinka-datovi-agenti-lidske-schvaleni.html` — novinka/roundup na workflow variantě.
- `gemini-notebook-ucitel-vidi-chaty-zaku.html` — kombinace `style.css + workflow.css` a insight-summaries šablona.
- `gemini-notebook-prompty.html` — samostatná promptová stránka na `style.css`.

Tato pětice pokrývá odlišné kaskády a komponenty. Není to návrh jejich současného přebarvení, ale kandidátů pro pozdější kontrolovaný vizuální pilot.

## Rozsah kontroly

- **Provedeno:** statická inventura 103 HTML; vyčteny body třídy, lokální CSS vazby a deklarace základních pozadí v `home.css`, `workflow.css`, `style.css`, `subject-pages.css`, `catalog-directory.css`, `magazine-article.css` a `guide-article.css`; zvláštní kontrola pěti stránek PR #49.
- **Neprovedeno:** Deploy Preview prohlížeč, screenshoty/computed styles, axe audit ani vizuální či interakční test. Tento krok je zdrojový audit a nic graficky nemění.
- **Změna webu:** žádná; dokument slouží k rozhodnutí před implementací.

## Doporučení

**Hromadné zesvětlení zatím nedoporučuji.** Je zde nejméně dvojí samostatná legacy tmavá kaskáda (`workflow.css` a `style.css`) a mnoho rozdílných obsahových komponent. Zvláštní problém představují čtyři stránky PR #49 s tmavým obsahem pod světlou hlavičkou. Nejdřív schválit rozsah cílového světlého pozadí a provést oddělený vizuální/kontrastní pilot.



