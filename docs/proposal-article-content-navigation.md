# Obsahová navigace dlouhých článků: návrh a pilot

## Rozsah

Návrh vychází z PR #51 na commitu `473ef5d35580d0366aacbd4812a00cf85966a168`. Navazuje samostatnou draft etapou a nemění větev ani obsah PR #51.

Dlouhé články s pěti a více hlavními H2 mají obsahovou navigaci standardně. U kratších článků se přidá pouze při složitější struktuře. Navigace článku zůstává oddělená od globálního menu a drobečkové navigace.

## Inventura existujících variant

| Varianta | Kde je | Co už umí | Co se liší od požadovaného společného řešení |
|---|---|---|---|
| Průvodci `guide-toc` | `scripts/build-guide-articles.js`, `css/guide-article.css` | Generátor vytváří kotvy pro H2/H3; desktop má levý sticky panel; mobil používá rozbalovací `details`. | Desktopový panel a mobilní navigace jsou dvě samostatné kopie obsahu. `overflow:auto` je na celém panelu, nikoli jen na seznamu odkazů. Breakpoint je 900 px. |
| Magazín `magazine-toc` | `scripts/build-magazine-articles.js`, `css/magazine-article.css` | Generátor vytváří hierarchii H2/H3; panel je vlevo, světlý a sticky. | Při šířce do 800 px se panel skryje bez mobilní náhrady. Posouvá se celý panel. |
| Workflow `article-toc` | `css/workflow.css`, ručně vložené do některých článků | Statické odkazy fungují bez JavaScriptu a mají viditelný fokus. | Je to zalamovaný seznam pod úvodem článku, nikoli postranní panel; implementace a rozsah odkazů se liší podle stránky. |

Příklady již obsloužených článků jsou `ai-agenti-skills.html`, `ai-agenti-rag.html`, `ai-workflow-7-kroku-gemini-notebook.html` a průvodce `gemini-notebook-navod-pro-ucitele.html`. Ty pilot nemění.

## Návrh sdílené komponenty

V dalších článcích používat jednu statickou strukturu `<details class="article-content-navigation" open>` s jedním seznamem odkazů. Na desktopu bude v levém sloupci vedle článku. Na mobilu bude před článkem jako rozbalovací obsah. Jeden strom DOM odstraní potřebu udržovat zvláštní desktopovou a mobilní kopii.

- HTML obsahuje skutečné odkazy na jedinečná ID nadpisů H2 a vybraných H3. Vnořené H3 se řadí pod odpovídající H2.
- Odkazy a jejich cíle jsou v HTML; fungují i bez JavaScriptu. Nadpisy dostávají `tabindex="-1"`, takže po skoku lze přístupně pokračovat v četbě.
- Sdílený CSS soubor řeší levý grid, světlý povrch, sticky polohu a `scroll-margin`. Omezení výšky a `overflow-y` má pouze vnitřní seznam odkazů. Pod 960 px se panel vrátí do běžného toku a seznam se posouvá s dokumentem.
- Malý JS enhancement přes `IntersectionObserver` přidá `aria-current="location"` a decentní zvýraznění aktuální kapitoly. Při nedostupném JS nebo API navigace zůstává plně použitelná.
- Globální menu a breadcrumbs se nemění.

## Pilot

Pilotem je `ai-novinka-datovi-agenti-lidske-schvaleni.html`. Na výchozím commitu má 11 hlavních H2, pět užitečných H3 a žádnou lokální obsahovou navigaci. Je součástí světlého pilotu, proto umožňuje ověřit panel na schváleném vzhledu bez změny dalších stránek.

Pilot přidává 11 odkazů na H2 a pět vybraných pododkazů H3 ve dvou kapitolách, stabilní ID těmto nadpisům, sdílený soubor `css/article-content-navigation.css` a volitelný enhancement `js/article-content-navigation.js`. Text článku a globální navigace zůstávají beze změn. Záznam centrálního katalogu je aktualizován spolu s článkem.

## Kandidáti pro pozdější etapy

Počty jsou ze zdrojů na výchozím commitu uvedeném výše. Jde o kandidáty k postupné migraci, ne o schválení plošné změny.

| Stránka | H2 | H3 | Stav / důvod |
|---|---:|---:|---|
| `gemini-notebook-ucitel-vidi-chaty-zaku.html` | 10 | 3 | Světlý pilot, bez obsahové navigace. |
| `ai-agenti-co-je-ai-agent.html` | 10 | 0 | Světlý pilot, bez obsahové navigace. |
| `ai-navod-edit-kontrola.html` | 21 | — | Dlouhý workflow článek, bez navigace. |
| `ai-ziva-hlasova-ai-ve-vyuce.html` | 16 | — | Dlouhý workflow článek, bez navigace. |
| `asistent-ucitele-osobni-ai-asistent.html` | 14 | — | Dlouhý workflow článek, bez navigace. |
| `kdyz-ai-jedna-odpovednost-ai-agenta.html` | 13 | 13 | Delší článek série, bez navigace. |
| `ai-workflow-prep-edit.html` | 18 | — | Dlouhý workflow článek, bez navigace. |

Pomlčka znamená, že počet H3 nebyl v této inventuře ověřen. Před migrací každé stránky je třeba zkontrolovat její konkrétní obsah, kotvy a katalogový záznam. Již obsloužené stránky se znovu nepřidávají.

## Navržené pořadí

1. Dokončit kontrolu jediného pilotu v desktopovém a mobilním zobrazení včetně klávesnice, kotev, sticky panelu a vypnutého JavaScriptu.
2. Po samostatném schválení návrhu migrovat generátory nebo stránky po menších skupinách; každá skupina musí předchozí obsahové navigace nahradit, ne duplikovat.
3. Až následně vyhodnotit, zda je vhodné starší varianty převést na společnou třídu a markup.

V tomto pilotu nejsou upravovány jiné stránky ani globální design.
