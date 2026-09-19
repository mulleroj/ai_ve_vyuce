# Údržba AI ve Výuce

## Základní pravidlo

`data/prompts.json` a `data/activities.json` jsou zdroje pravdy. HTML označené komentáři `GENERATED:...` je výstup generátorů. Po změně registru spusťte příslušný generátor a jeho kontrolu; generované karty ani počítadla neupravujte ručně.

## Přidání promptu

1. Upravte `data/prompts.json`. Každý záznam potřebuje jedinečné stabilní `id`, `title`, text `prompt`, `sourcePage` a řetězcová pole `subjects`, `levels`, `tools`, `collections` a `tags`. Běžné záznamy používají také `category`; Gemini Notebook navíc vyžaduje neprázdné `lead`, `category` a platný `geminiSection`.
2. Zvolte `sourcePage` podle místa, kam prompt patří:
   - předmětová stránka (`matematika.html`, `cestina.html`, `anglictina.html`, `prirodoveda.html` nebo `dejepis.html`) a odpovídající kolekce;
   - `prompty.html`, kde je navíc povinný platný `librarySection`, `filterKey` a kolekce `prompty`;
   - `vibe-coding-prompty.html`, kde jsou povinné kolekce `vibe-coding` a právě jedna sekce Vibe Coding;
   - `gemini-notebook-prompty.html`, kde `geminiSection` určuje generovanou sekci.
3. ID je součást odkazů a vazeb, proto ho po zveřejnění neměňte. Musí být ve stabilním kebab-case formátu a v registru jedinečné.
4. Spusťte `node scripts/generate-prompts.js`. Tím se aktualizují příslušné HTML regiony i homepage počítadlo. Následně ověřte stav příkazem `node scripts/generate-prompts.js --check`.

Neměňte vygenerované HTML ručně. Při příštím běhu by se ruční změna ztratila a kontrola driftu ji označí jako nesoulad.

## Přidání aktivity

1. Upravte `data/activities.json`. Záznam potřebuje jedinečné ID, `title`, `description`, právě jeden hlavní `subject`, `levels`, právě jeden `tool`, `duration`, platný `format`, `status`, `icon` a právě jednu kolekci s `id` a `order`.
2. Kolekce určují stránku i pořadí. Generátor kontroluje povolené kolekce, jedinečnost pořadí a to, že ID odpovídá pozici v dané kolekci. Novou aktivitu proto vložte na správné místo a upravte očekávané pořadí jen jako součást vědomé změny pravidel generátoru.
3. `prompt` je text uložený přímo u aktivity. `promptId` by odkazovalo na záznam v `data/prompts.json`; tyto dvě vlastnosti se nesmí použít současně. `relatedPromptId` je nepovinná vazba hlavní aktivity na prompt v `prompty.html`, není to zdroj jejího vlastního textu.
4. U kolekce `activities-main` musí aktivita používat vlastní `prompt`, mít `detail.ctaLabel` a nabídnout buď `relatedPromptId`, nebo `detail.modalId`. `detail.modalId` použijte tehdy, když CTA otevírá modal definovaný v `aktivity.html`; ID musí být jedinečné a v HTML skutečně existovat. Obě vazby nelze kombinovat.
5. Spusťte `node scripts/generate-activities.js` a potom `node scripts/generate-activities.js --check`.

Generated karty v předmětových stránkách a v `aktivity.html` neupravujte ručně. Změny patří do registru a do výstupu se promítnou generátorem.

## Homepage počítadla

Počet promptů se odvozuje z délky `data/prompts.json` a počet aktivit z délky `data/activities.json`. Příslušné generátory aktualizují své označené části `index.html` (`PROMPT_COUNT` a `ACTIVITY_COUNT`). Hodnoty v homepage proto ručně nepřepisujte. Aktuální čísla jsou jen datovaný stav registrů, nikoli pevná definice systému.

## Články

`js/site-articles.js` obsahuje metadata katalogu: mimo jiné `href`, `title`, `summary`, `category`, `date`, `dateLabel`, `icon`, `tags` a `badgeClass`. Detailní HTML článku je stále udržované ručně. Při přidání nebo úpravě článku musí katalog a detailní stránka zůstat obsahově synchronizované, zejména v `title`, `summary` a `date`.

`node scripts/validate-content.js` kontroluje strukturu katalogu, lokální cíle, duplicity, odkazy a možné opomenutí článku. Nenahrazuje redakční porovnání metadat s detailní stránkou. Pro články proto nevytvářejte nový generátor.

## Kontrola před commitem

```bash
node scripts/generate-prompts.js --check
node scripts/generate-activities.js --check
node scripts/validate-content.js

node --check scripts/generate-prompts.js
node --check scripts/generate-activities.js
node --check scripts/validate-content.js
node --check js/main.js
node --check js/site-articles.js

git diff --check
git status --short
```

Při změně registru se společně commituje zdrojový JSON a odpovídající generované HTML. Před commitem zkontrolujte diff a ujistěte se, že v něm nejsou nesouvisející změny.
