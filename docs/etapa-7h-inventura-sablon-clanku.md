# Etapa 7H – inventura článků a šablon

Inventura vychází z HTML na HEAD PR #47 (`f2968d372dcd1e040f64de3161930554d1297c84`), před změnami této větve. Vynechány jsou stránky se společnou navigací z předchozích etap a soubor ověření vlastnictví Google.

## Výsledek inventury

| Skupina podle skutečné struktury | Počet | Hlavička a bezpečný postup |
|---|---:|---|
| Magazínové články, `body.workflow-page`, `header.workflow-shell` | 21 | Ručně vložená hlavička v jednotlivých souborech; migrovat až po oddělení navigace od článkového hero. |
| Novinky, `body.workflow-page`, `header.workflow-shell` | 15 | Ručně vložená hlavička; stejný technický shell, obsah a hero jsou ale ručně skládané. Pilotovat samostatně po zavedení spolehlivého partialu. |
| Praktické návody, `body.workflow-page`, `header.workflow-shell` | 11 | Ručně vložená hlavička; nejprve zachovat celý hero a nahradit jen logo/navigační část. |
| Workflow články, `body.workflow-page`, `header.workflow-shell` | 12 | Ručně vložená hlavička; diagramy a interaktivní prvky ponechat beze změny. |
| Články o AI agentech, `body.workflow-page`, `header.workflow-shell` | 15 | Ručně vložená hlavička; statické stránky, obsahově odlišné od rozcestníku `ai-agenti.html`. |
| Samostatné promptové stránky (`vibe-prompt-page`, `gemini-notebook-prompt-page`) | 2 | Každá ručně vložená desktopová i mobilní nabídka; pilot nahrazuje obě jednou společnou hlavičkou a ponechává původní obsah/CSS. |
| Magazínové/news výstupy generátoru `scripts/build-magazine-articles.js` | 2 | Hlavička sdílená přes magazínovou šablonu; použít společný partial v generátoru a ověřit oba výstupy proti generátoru. |
| Guide výstupy generátoru `scripts/build-guide-articles.js` | 2 | Hlavička dosud sdílená s magazínem přes `templates/magazine/navigation.tpl`; přepojit pouze výstupní šablonu na nový společný partial a ověřit oba výstupy. |
| Ostatní specifické statické stránky | 3 | Ručně zkontrolovat každou zvlášť; žádná univerzální automatická náhrada. |

## Přesné seznamy dosud nepilotovaných statických stránek

### Magazínové články

`ai-ziva-hlasova-ai-ve-vyuce.html`, `asistent-ucitele-osobni-ai-asistent.html`, `claude-pro-ucitele.html`, `co-se-muze-ucitel-naucit-od-youtube.html`, `copilot-pro-ucitele.html`, `gemini-desktop-navod-pro-ucitele.html`, `gemini-notebook-navod-pro-ucitele.html`, `gemini-notebook-ucitel-vidi-chaty-zaku.html`, `gemini-pro-ucitele.html`, `gemini-skills-pro-ucitele.html`, `gemini-storybook-navod-pro-ucitele.html`, `chatgpt-pro-ucitele.html`, `kdyz-ai-jedna-odpovednost-ai-agenta.html`, `neplytvej-inteligenci-ai-modely.html`, `notebooklm-hlasovy-rozhovor-nad-zdroji.html`, `perplexity-pro-ucitele.html`, `skill-anglictina-vyukove-materialy.html`, `uci-se-zak-nebo-za-nej-premysli-ai.html`, `vibe-coding-bezpecnost-kodu-php2shell.html`, `vibe-coding-pro-ucitele.html`, `vibe-coding-ucitele.html`.

### Novinky

`ai-novinka-agenti-onenote-pruvodce-ucenim.html`, `ai-novinka-ai-ve-vzdelavani-srpen-2026.html`, `ai-novinka-datovi-agenti-lidske-schvaleni.html`, `ai-novinka-filozofovani-s-ai-chybejici-role.html`, `ai-novinka-filozofovani-s-ai-kriticke-mysleni.html`, `ai-novinka-gemini-classroom.html`, `ai-novinka-gemini-desktop-chatgpt-word-agenti.html`, `ai-novinka-gemini-notebook-sablona.html`, `ai-novinka-google-ai-vzdelavani-zari-2026.html`, `ai-novinka-chatgpt-interaktivni-kvizy.html`, `ai-novinka-microsoft-ai-workflow.html`, `ai-novinka-microsoft-gemini.html`, `ai-novinka-pravidla-ve-skole.html`, `ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html`, `ai-novinka-vykonnejsi-ai.html`.

### Praktické návody

`ai-navod-7-univerzalnich-promptu.html`, `ai-navod-ai-agent-v-prohlizeci.html`, `ai-navod-commands-chatgpt.html`, `ai-navod-edit-kontrola.html`, `ai-navod-gemini-notebook-infografiky.html`, `ai-navod-gemini-notebook-prezentace.html`, `ai-navod-gemini-notebook-priprava.html`, `ai-navod-gemini-notebook-vyuka.html`, `ai-navod-chatgpt-vizualni-materialy.html`, `ai-navod-lepsi-prompty-10-zasad.html`, `ai-navod-prep-prompty.html`.

### Workflow články

`ai-workflow-10-promptu-gemini.html`, `ai-workflow-18-promptu.html`, `ai-workflow-8-otazek.html`, `ai-workflow-css-grid-vibe-coding.html`, `ai-workflow-fotografie-ucebnice.html`, `ai-workflow-gemini-notebook-ai-agent.html`, `ai-workflow-chatgpt-images-2-5.html`, `ai-workflow-prep-edit.html`, `ai-workflow-prezentace-webova-stranka.html`, `ai-workflow-udl-ai.html`, `ai-workflow-usetri-praci.html`, `ai-workflow-vibe-coding.html`.

### Články o AI agentech

`ai-agenti-10-ukolu.html`, `ai-agenti-agentni-smycka.html`, `ai-agenti-co-je-ai-agent.html`, `ai-agenti-coding-agenti.html`, `ai-agenti-chatbot-automatizace-workflow.html`, `ai-agenti-kdy-nepouzivat.html`, `ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html`, `ai-agenti-mcp.html`, `ai-agenti-multi-agentni.html`, `ai-agenti-nastroje-function-calling.html`, `ai-agenti-pamet.html`, `ai-agenti-prvni-agent.html`, `ai-agenti-rag.html`, `ai-agenti-skills.html`, `ai-agenti-ve-skole.html`.

### Ostatní specifické statické stránky

`asistenti/math-cermat.html`, `asistenti/metodicky-asistent-gemini.html`, `vibe-coding-clanky.html`.

## Pilot (šest stránek)

- Guide generator: `ai-navod-chatgpt-zacatek-bezpecne.html`, `ai-workflow-7-kroku-gemini-notebook.html`.
- Magazine/news generator: `ai-novinka-ai-duvod-premyslet.html`, `ai-novinka-ai-ve-vzdelavani-zari-2026.html`.
- Ručně skládané promptové stránky: `vibe-coding-prompty.html`, `gemini-notebook-prompty.html`.

Nový `templates/site-navigation.tpl` je společný statický fallback pro těchto šest výstupů. Obsahuje šest přímých odkazů i bez JavaScriptu; `js/site-navigation.js` je při dostupném JavaScriptu rozšíří o schválená podmenu. Detailní stránky vybírají aktivní oblast z existujícího rozcestníkového href nebo podle stabilního typu URL (návod/workflow, novinka, promptová stránka či AI agent). Šablony vytvářejí pouze výstupy vedené ve svých stávajících manifestech, ruční pilot se týká pouze dvou uvedených HTML stránek.

Hromadné rozšíření není zatím doporučeno: většina stránek se generuje/udržuje ručně a její `workflow-shell` kombinuje identitu, návratový odkaz a obsahový hero. Každá rodina musí být pilotována s obsahovou regresí a mobilní kontrolou, případně musí předem vzniknout zdrojová šablona. Následující krok může využít společný partial, ale nemá automaticky přepisovat zbývajících 77 dosud nemigrovaných stránek.
