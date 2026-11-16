# SEO finalizace 8P/2

## Rozhodnutí o indexaci

Všechny následující stránky jsou běžné veřejné stránky, v jejich HTML není robots meta s `noindex`, a všechny jsou interně odkazovány z katalogu `ai.html`. Při přímé kontrole hlavní domény se načetly obě varianty (s `.html` a bez přípony) se stejným titulkem; URL se v adresním řádku nepřepsala. Kontrola browser UI nezpřístupnila HTTP status ani response headers, proto status/Location neprohlašuji za nezávisle ověřený.

| Soubor | Canonical + OG po změně | Indexace | Sitemap |
|---|---|---|---|
| `ai-novinka-ai-duvod-premyslet.html` | `/ai-novinka-ai-duvod-premyslet` (již shodné) | veřejná, bez noindex, odkaz v katalogu | přidáno |
| `asistent-ucitele-osobni-ai-asistent.html` | `/asistent-ucitele-osobni-ai-asistent` | veřejná, bez noindex, odkaz v katalogu | přidáno |
| `filozofovani-s-ai.html` | `/filozofovani-s-ai` (již shodné) | veřejný rozcestník série, bez noindex, interní odkaz | přidáno |
| `gemini-skills-pro-ucitele.html` | `/gemini-skills-pro-ucitele` (již shodné) | veřejná, bez noindex, odkaz v katalogu | přidáno |
| `skill-anglictina-vyukove-materialy.html` | `/skill-anglictina-vyukove-materialy` (již shodné) | veřejná stránka s článkem a soubory, bez noindex, odkaz v katalogu | přidáno |
| `vibe-coding-bezpecnost-kodu-php2shell.html` | `/vibe-coding-bezpecnost-kodu-php2shell` | veřejná, bez noindex, odkaz v katalogu | přidáno |

Canonical a Open Graph URL jsou sjednoceny na čisté URL. Šest čistých URL je v sitemapě právě jednou; počet položek se mění z 97 na 103. `_redirects` nebyl změněn: přímá browserová kontrola potvrdila, že obě formy URL načítají stránku a neprovedou navigační přesměrování, ale bez HTTP status/Location nelze bezpečně určit další serverové chování. Canonical tag poskytuje čistou preferovanou adresu. Nová přesměrovací pravidla proto v této etapě nepřidáváme; jejich runtime chování by bez preview/deploye nešlo ověřit a zadání staging zakazuje.

## Regresní fixture a testy

Fixture `tests/fixtures/seo-preflight-8p2-baseline.json` zachycuje přesně HEAD `2d1bbb915a393d78dbefbfebfd2acc9ea00bb30f`: canonical/OG, titulky, nadpisy, ID, odkazy s jejich texty, obrázky a alt texty, skripty, ovládací prvky a SHA-256 HTML po odebrání pouze canonical a og:url tagu. Test očekává změny právě v těchto SEO tagách, kontroluje, že ostatní HTML bajty zůstaly shodné, validuje sitemap XML a jedinečnost, canonical všech položek sitemap, indexovatelnost a existenci cílových souborů, plus duplicity a cykly v `_redirects`.

Živé ověření obou forem URL bylo provedeno na hlavní doméně během etapy; úspěšný HTTP status a přesměrovací Location nebyly v použitém browser rozhraní dostupné. Nová pravidla redirects se nepřidávají.

## Netlify – ověřené nastavení v UI

Projekt `ai-ve-vyuce` (site ID `24c9a6f1-bc77-4ea3-90bd-8ae9f6f5d10e`) je propojen s `github.com/mulleroj/ai_ve_vyuce` pro Continuous deployment. Netlify UI potvrzuje:

- Production branch: `master`.
- Branch deploys: pouze production branch; Deploy Previews: každý PR proti production branch / branch deploy branches.
- Deploy settings hlásí „Auto publishing is on“ a „Deploys from master are published automatically“; push do master tedy automaticky vede k production publikaci po deployi.
- Build settings: Runtime Not set, Base directory `/`, Package directory Not set, Build command Not set, Publish directory Not set, Functions directory `netlify/functions`, Build status Active. U statického repozitáře jsou command/publish explicitně nevyplněné; efektivní kořenový výstup je nutné v kandidátním preview ověřit.
- Deployment methods: všechny metody mohou nasazovat do production.
- Nedůvěryhodné Deploy Preview z forku: Require approval.
- Auto-publishing lze v Deploys panelu zastavit tlačítkem „Lock to stop auto publishing“; nic nebylo stisknuto ani změněno.

### Závažná současná odchylka

Aktuální/current deploy `6af2366ea3ce8c9dc0051e82` je v Netlify UI veden jako **Published deploy** pro `ai-ve-vyuce`, ale současně je označen jako **Deploy Preview**, title „PR 51 Stage 7M navigation draft“, branch `master`, s `commit_ref: null`. Netlify deploy detail ukazuje, že byl nahrán přes API, build/deploy fáze byly skipped, a commit URL/SHA chybí. Hlavní doména `https://ai-ve-vyuce.netlify.app/` při přímém otevření skutečně zobrazuje obsah tohoto novějšího vzhledu; její přesné zdrojové SHA nelze z dostupných signálů přiřadit. Deploy panel ukazuje auto-publishing zapnuté a current preview jako publikovaný na projektu.

Znamená to, že publikovaný alias nemusí odpovídat ověřenému Git SHA. Před stagingem musí vlastník určit, zda tento stav byl záměrný, dohledat skutečný obsah/deploy původ a zaznamenat přesný commit. Nepublikovat žádný nový deploy v této etapě. Historie UI obsahovala starší Branch Deploy a Deploy Preview záznamy; jejich SHA a způsobilost jako bezpečný předchozí production rollback nebyly všechny ověřeny.

## Změny této větve

- `sitemap.xml`: šest čistých URL, bez duplicit.
- `asistent-ucitele-osobni-ai-asistent.html`, `vibe-coding-bezpecnost-kodu-php2shell.html`: canonical a og:url bez `.html`.
- `tests/fixtures/seo-preflight-8p2-baseline.json`: source-derived fixture.
- `tests/seo-preflight-8p2.spec.js`: SEO a zachování obsahu testy, přidané do kompletního Browser QA workflow.
- `.github/workflows/browser-qa.yml`: spouští nový test a povoluje workflow na izolované větvi 8P/2.

Žádná změna `_redirects`, pedagogického textu, veřejných ID, grafiky ani Netlify konfigurace.
