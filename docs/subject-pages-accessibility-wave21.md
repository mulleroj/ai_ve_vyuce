# Předmětové stránky – přístupnost, vlna 21

Základ: `bfd39f3973d7139aeb4632ba7a74e94ab648f7bc` (PR #74 / vlna 20). Stránky používají sdílený světlý design; tato práce není plošná designová migrace.

## Nálezy před opravou

| Stránka | Pravidlo / závažnost | Prvek | Příčina | Rozhodnutí |
|---|---|---|---|---|
| Všech pět | Chybí hlavní landmark | Obsah od `.page-hero` po poslední obsahovou sekci | Obsah stránky není vymezen jako hlavní oblast pro asistivní technologie. | Potvrzeno; obalit stránkový obsah jedním `<main>`. |
| Všech pět | `label-content-name-mismatch` / serious (axe-core) | `nav.site-nav a.brand[href="index.html"][aria-label="AI ve výuce – domů"]` | ARIA label nahrazuje přirozený název odvozený z viditelné značky a sloganu; viditelný text není celý zahrnutý. | Potvrzeno; odstranit nadbytečný `aria-label`, ponechat viditelný text pro přirozený název. |
| Čeština, dějepis, přírodověda (původní běh) | `color-contrast` / serious (axe-core) | Texty odznaků, názvů, popisů a metadat karet | Původní scan proběhl během přechodu `.reveal` (opacity ještě nedosáhla 1); vypočtené barvy byly přechodné. | Po stabilizaci přechodu opakovaný scan tyto porušení nepotvrdil. Bez barevných změn. |

## Kontrola „incomplete“ – vyžaduje ruční posouzení

- Všech pět: `aria-prohibited-attr` (serious, incomplete), `.footer-links`. Axe upozorňuje, že `aria-label` na `div` bez role není spolehlivě podporováno. Není to potvrzené porušení. Případná oprava by měla převést skupinu odkazů na sémantické `<nav>` nebo odstranit nepoužitý label; rozsah sdílené patičky vyžaduje samostatné rozhodnutí.
- Všech pět: `color-contrast` (serious, incomplete) v hero oblasti: `h1`, barevný text nad gradientem, podnadpisy, statistiky a někde CTA. Axe nedokáže vypočítat kontrast přes CSS gradient, krátké číselné texty nebo překrývající se pozadí. Ručně zkontrolovat kontrast v nejméně příznivých místech gradientu; hodnoty a cíle jsou v JSON důkazu běhu.
- Původní kontrastní hlášení u karet je časově závislé na animaci. Stabilizovaný baseline scan s vypnutou pouze testovací animací `.reveal` našel na každé stránce jen `label-content-name-mismatch`; barvy karet definované v `css/subject-pages.css` mají v ustáleném stavu dostatečný kontrast.

## Rozsah a regresní ochrana

- Jedno `<main>` obaluje stávající hero a obsahové sekce mezi hlavičkou a patičkou. Nemá nové ID; veřejná ID a kotvy zůstávají zachované.
- Značka zůstává viditelná a navigovatelná; její přístupný název se nyní odvodí z viditelného textu.
- `tests/fixtures/subject-pages-wave21-baseline.json` zachycuje normalizovaný text, nadpisy, pořadí a text karet, hash inline akcí/promptů, odkazy, obrázky a alt texty, veřejná ID, SEO metadata, navigaci a odkazy do knihovny z referenčního SHA.
- Browser QA ověřuje landmark, axe, klávesnici/fokus, menu, karty a záložky, mobilní rozložení, 22 šířek, overflow, no-JS fallback a pořizuje desktop/mobilní screenshoty. Podrobná evidence axe a screenshoty budou v artefaktu PR běhu.
