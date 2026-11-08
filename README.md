# AI ve Výuce

Statický web pro učitele: články, návody, workflow, knihovna promptů, aktivity, přehled AI asistentů a rozcestníky podle předmětů a nástrojů. Veřejná verze běží na Netlify na adrese [https://ai-ve-vyuce.netlify.app](https://ai-ve-vyuce.netlify.app).

Stránky jsou ručně psané HTML soubory doplněné sdílenými styly (`css/`), skripty (`js/`) a obrázky (`images/`). Úvodní stránka načítá katalog článků z `js/site-articles.js` a v sekci nejnovějších článků zobrazuje šest záznamů seřazených podle pole `date` (viz `js/main.js`).

## Struktura repozitáře

| Část | Účel |
|------|------|
| **Kořen (`*.html`)** | Veřejné stránky: úvod (`index.html`), rozcestníky (např. `ai.html`, `ai-agenti.html`, `ai-navody.html`, `ai-novinky.html`, `ai-workflow.html`, `prompty.html`, `aktivity.html`, `asistenti.html`, `vibe-coding.html`, stránky předmětů), detailní články a další obsah. Část URL bez přípony `.html` řeší soubor `_redirects` pro Netlify. |
| **`css/`** | Společné styly (`style.css`, `home.css`, `workflow.css`). |
| **`js/`** | Chování webu: `main.js` (navigace, nejnovější články), `site-articles.js` (katalog článků), `site-footer.js` (společná patička), další stránkové skripty (`home.js`, `ai-page.js`, …). |
| **`data/`** | Registr promptů (`prompts.json`) a aktivit (`activities.json`) — zdroj pravdy pro generátory. |
| **`scripts/`** | Generátory (`generate-prompts.js`, `generate-activities.js`), validace obsahu (`validate-content.js`) a kontrola patičky (`check-site-footer.js`). |
| **`images/`** | Obrázky a ilustrace používané v článkách a na stránkách. |
| **`asistenti/`** | Samostatné stránky specializovaných asistentů (např. `math-cermat.html`, `metodicky-asistent-gemini.html), na které odkazuje rozcestník `asistenti.html`. |

Doplňkové soubory v kořeni (např. `sitemap.xml`, `robots.txt`, favicon) podporují SEO a nasazení; nejsou součástí výše uvedených složek, ale patří ke stejné statické publikaci.

## Přidání nového článku

1. **Nový soubor HTML** v kořeni repozitáře (nebo v podsložce, pokud tak vyžaduje typ stránky — běžné články jsou v kořeni). Název souboru je v kebab-case, končí `.html` a odpovídá URL článku.

2. **Předpony sekcí** — články v řadách „AI pro školy“ často používají prefixy podle typu obsahu, například:
   - `ai-novinka-…` — novinky,
   - `ai-navod-…` — návody,
   - `ai-agenti-…` — série o AI agentech,
   - `ai-workflow-…` — workflow články.

   Skript `scripts/validate-content.js` při kontrole upozorňuje na možné opomenutí katalogu u souborů odpovídajících vzoru `ai-(novinka|navod|agenti|workflow)-*.html`. Samotné rozcestníky (`ai.html`, `ai-agenti.html`, `ai-navody.html`, `ai-novinky.html`, `ai-workflow.html`) do katalogu nepatří.

3. **Metadata v článku** — v detailní HTML stránce udržujte titul, shrnutí a datum konzistentní s katalogem (typicky `<time datetime="YYYY-MM-DD">` a čitelný `dateLabel` v obsahu).

4. **Povinná aktualizace `js/site-articles.js`** — každý nový nebo upravený detailní článek, který patří do katalogu na úvodní stránku, musí být ve stejné změně doplněn nebo upraven v poli `window.siteArticles`. Každý záznam musí obsahovat těchto **9 povinných polí** (ověřuje `scripts/validate-content.js`):

   - `href` — relativní cesta k existujícímu HTML souboru,
   - `title`,
   - `summary`,
   - `category`,
   - `date` — ISO formát `YYYY-MM-DD`,
   - `dateLabel` — čitelné datum v češtině,
   - `icon`,
   - `tags` — pole řetězců,
   - `badgeClass`.

   Volitelně lze doplnit např. `platforms`, `series`, `seriesNumber`, `contentType` nebo `featured`. Datum v katalogu musí odpovídat datu v metadatech článku. Duplicitní `href` v katalogu nejsou povoleny.

5. **Závazná pravidla** — podrobnosti a kontrolní seznamy jsou v souborech [AGENTS.md](AGENTS.md) (pravidla pro AI přispěvatele, katalog článků) a [CONTRIBUTING.md](CONTRIBUTING.md) (prompty, aktivity, patička, kontroly před commitem). Při úpravách je nutné se jimi řídit.

## Generovaný obsah a `data/*.json`

Soubory `data/prompts.json` a `data/activities.json` jsou **zdroj pravdy**. HTML bloky označené komentáři `GENERATED:…` (prompty na stránkách předmětů, v `prompty.html`, `vibe-coding-prompty.html`, `gemini-notebook-prompty.html`, aktivity v `aktivity.html` a na předmětových stránkách, počítadla `PROMPT_COUNT` a `ACTIVITY_COUNT` na `index.html`) vytvářejí skripty `scripts/generate-prompts.js` a `scripts/generate-activities.js`.

**Tyto generované části HTML ani registry v `data/` neupravujte ručně** (kromě záměrné editace JSON a následného spuštění generátoru podle [CONTRIBUTING.md](CONTRIBUTING.md)). Ruční zásah by při příštím běhu generátoru nebo při `--check` skončil nesouladem.

Detailní články a katalog `js/site-articles.js` se naopak udržují ručně; pro články se nepoužívá generátor.

## Kontroly před commitem

Před odesláním změn spusťte kontroly uvedené v [CONTRIBUTING.md](CONTRIBUTING.md):

```bash
node scripts/generate-prompts.js --check
node scripts/generate-activities.js --check
node scripts/validate-content.js
node scripts/check-site-footer.js

node --check scripts/generate-prompts.js
node --check scripts/generate-activities.js
node --check scripts/validate-content.js
node --check js/main.js
node --check js/site-articles.js
node --check js/site-footer.js

git diff --check
git status --short
```

Při změně registru commitujte společně zdrojový JSON a výstup generátoru. V diffu by neměly být nesouvisející úpravy.

## Publikace do produkce

Nasazení na produkční doménu [ai-ve-vyuce.netlify.app](https://ai-ve-vyuce.netlify.app) je **ruční** a vyžaduje **schválení vlastníka** repozitáře. Sloučení pull requestu nebo push do větve nasazené na Netlify samo o sobě nenahrazuje tento krok, pokud o něm vlastník nerozhodne jinak.
