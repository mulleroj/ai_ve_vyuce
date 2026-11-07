# Přístupnost a technické opravy knihovny aktivit — etapa 6C/2

**Stav:** technické opravy k revizi; bez zásahu do pedagogického obsahu.

**Základ:** větev `codex/ai-ve-vyuce-etapa6c2-pristupnost` vychází z ověřeného `origin/master` `0ce95c67d6bb05c451c61d1f551b5e742cb79ed0`. Auditní PR #37 je samostatná dokumentační větev a není předkem této implementace.

## Původní zjištění

Audit 6C/1 při Axe scanování katalogu a pěti předmětových stránek zjistil:

| Axe ID | Závažnost | Před opravou |
|---|---|---|
| `aria-required-children` | critical | 3 nálezy / 3 uzly: jeden neúplný `role="tablist"` na každé z `cestina.html`, `prirodoveda.html`, `dejepis.html`. |
| `label-content-name-mismatch` | serious | 6 nálezů / 6 uzlů: patičkový odkaz se značkou na katalogu a pěti předmětových stránkách. |
| `color-contrast` | serious | Jeden modrý štítek v katalogu při každém viewportu; při 1440 px dalších 7 uzlů na `cestina.html` (karty a související barevné varianty). |

Počty výše odpovídají původnímu auditu 6C/1; Axe node count u kontrastu se mohl měnit podle rozměru viewportu a viditelných/animovaných prvků.

## Provedené změny

### Sekce předmětových stránek

- Na češtině, přírodovědě a dějepisu byla chybně deklarovaná `role="tablist"` nahrazena pojmenovanou nativní skupinou tlačítek `role="group" aria-label="Části předmětové stránky"`.
- Každé tlačítko má explicitní `type="button"`, `aria-controls` na existující panel a počáteční `aria-pressed`. Stávající JavaScript panel přepíná a aktualizuje `aria-pressed` při kliknutí. Nativní Tab, Enter a Mezerník zůstávají k dispozici; nebyly zavedeny role `tab`, šipkové ovládání ani další tab semantics.
- Panely dostaly `role="region"` a odpovídající `aria-label`. Stejný vzor tlačítek používají i matematika a angličtina; obě stránky byly zahrnuty do regresní klávesnicové kontroly.
- Viditelný focus zajišťuje existující společný styl `:focus-visible` o tloušťce 3 px.

### Kontrast

V `css/subject-pages.css` byly upraveny pouze barvy pro světlý vzhled subject-page: modrá, fialová, zelená, oranžová a růžová varianta badge, barva metadat a zelené tlačítko karty. Textové páry splňují 4.5:1; vypočtené poměry nových/ověřených barevných variant:

| Pár popředí / pozadí | Kontrast |
|---|---:|
| Modrá `#174a86` / `#eaf2fc` | 7.88:1 |
| Fialová `#603477` / `#f3eafa` | 7.96:1 |
| Zelená `#19633b` / `#eaf5ed` | 6.50:1 |
| Oranžová `#824000` / `#fff1dd` | 7.04:1 |
| Růžová `#8b2059` / `#fbeaf3` | 7.42:1 |
| Šedá `#455e53` / `#f1f4ef` | 6.35:1 |
| Mint/zlatý štítek `#086746` / `#eaf5ee` | 6.18:1 |
| Bílý text na kartovém tlačítku `#075b42` | 8.13:1 |
| Metadata `#526b62` / `#f7f5eb` | 5.28:1 |

Stránky používají světlé `subject-page` téma. V CSS nebyla nalezena samostatná varianta `prefers-color-scheme: dark` ani přepínač tmavého vzhledu; samostatný tmavý design proto není součástí této opravy.

### Přístupné názvy a patička

- Odstranil jsem nadbytečný `aria-label` z viditelného logotypového odkazu v patičce. Přístupný název nyní vzniká z viditelného textu odkazu.
- Změna je v jediném společném zdroji `scripts/subject-footer.js` a byla vygenerována do pěti předmětových stránek příkazem `node scripts/build-subject-footer.js`. Stejný nadbytečný label byl odstraněn z oddělené patičky `aktivity.html`.
- Společný skript `js/site-footer.js` a jeho viditelné označení **`AI + 👤 | HUMAN IN THE LOOP`** zůstaly nezměněné. Text byl ověřen v prohlížeči na všech pěti předmětových stránkách při všech třech rozměrech.

## Výsledky Playwright a Axe

Chromium přes Playwright 1.65.0, systémový Google Chrome 156.0.8078.81, Axe-core 4.10.3. Testované viewporty: 390 × 844, 768 × 900 a 1440 × 900 px. Playwright obsluhoval **skutečné lokální HTML, CSS a JavaScript** z checkoutu přes request routing; nebyly použity nahrazené styly ani aplikační skripty.

| Axe ID | Po opravě | Výsledek |
|---|---|---|
| `aria-required-children` | 0 uzlů | Opraveno na všech 3 dotčených stránkách a bez opětovného výskytu v ostatních předmětových stránkách. |
| `label-content-name-mismatch` | 0 uzlů | Opraveno na katalogu a všech 5 předmětových stránkách. |
| `color-contrast` | 0 uzlů | Nulový nález na katalogu, otevřeném detailu a pěti předmětových stránkách ve všech třech viewportech. |

Axe stále hlásí středně závažné, původní strukturální nálezy mimo rozsah této opravy: `landmark-one-main` (1 uzel na každé z pěti předmětových stránek) a `region` (katalog/toast 1, otevřený detail/toast 1; předmětové stránky mají 2 nebo 4 uzly podle stránky). Nejde o kritické ani závažné porušení. Automatický scan není úplná certifikace přístupnosti.

Browserové kontroly prošly na všech třech rozměrech:

- skutečný `window.innerWidth`/`innerHeight`, bez horizontálního přetečení;
- 44 karet katalogu; kombinované filtry předmět–ročník–nástroj odpovídají registru;
- shoda názvu karty a detailu; úplný český prompt ve schránce se shoduje s registrem po normalizaci Windows CRLF na LF, včetně diakritiky, odstavců a posledního znaku;
- dialog se zavře Escape a focus se vrátí na tlačítko detailu;
- `Tab` vede ke skupině sekcí, další Tab na tlačítko Prompty; focus je viditelný (3 px), Mezerník přepíná panel a mění `aria-pressed`;
- klávesnicový test byl proveden na všech pěti předmětových stránkách při všech třech rozměrech;
- žádné `pageerror`, žádný neúspěšný kritický skript a žádná lokální HTTP chyba.

### Chyby konzole a omezení prostředí

V každé sadě prohlížeče se objevilo 23 hlášení `Failed to load resource: net::ERR_FAILED`, všechna z blokovaných externích CSS/XHR požadavků na Google Fonts a Font Awesome CDN. Nešlo o chybu JavaScriptu aplikace; počet `pageerror` i selhání kritických skriptů byl 0. Vzhled byl proto vykreslen systémovými fallback fonty; produkční fonty ani CSS nebyly nahrazeny.

Přímý localhost server nebyl prostředím přijat, proto Playwright použil lokální request routing. Windows Narrator je v systému dostupný, ale computer-use vrstva odmítla zadat `file://` URL, protože nedokázala s dostatečnou jistotou ověřit cílovou adresu. Skutečný Narrator smoke test tedy nebyl dokončen. Nepoužil jsem jiný screen reader.

## Regresní kontroly a invarianty

- `node scripts/generate-activities.js --check`: prošlo, drift 0, 44 položek.
- `node scripts/generate-prompts.js --check`: prošlo, drift 0, registr 204 promptů.
- `node scripts/validate-content.js`: prošlo, 76 článků, 0 chyb, 0 varování.
- `node scripts/check-site-footer.js`: prošlo po odstranění dočasných browserových závislostí.
- `node scripts/build-subject-footer.js --check`: všech 5 předmětových patiček OK.
- Syntaktická kontrola všech JS souborů v `js/` a `scripts/`: prošla.
- `git diff --check`: prošlo.
- `data/activities.json` a `data/prompts.json` jsou beze změny proti `origin/master`; počet a pořadí 44 aktivit, 14 členů kolekce `activities-main`, statusy, `duration` a 204 promptů zůstávají zachované.

## Zbývající rizika

- Nebyl proveden skutečný test se screen readerem ani test s uživateli.
- Středně závažné Axe nálezy `landmark-one-main` a `region` zůstávají mimo rozsah této etapy.
- Při ověření nebyly načteny externí webfonty a ikony z CDN; typografie a ikonografie v testu používaly dostupné fallbacky.

**Závěr:** cílené opravy ARIA struktury, kontrastu a názvu patičkového odkazu prošly automatickými kontrolami a klávesnicovým browserovým QA. Dokumentace nenahrazuje review ani uživatelský test se screen readerem.
