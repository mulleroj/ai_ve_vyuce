# Jak převést další článek na magazínovou šablonu

Magazínové stránky se skládají lokálně příkazem `node scripts/build-magazine-articles.js`. Výsledné soubory v kořeni projektu jsou plné statické HTML stránky; čtení článku ani navigace v obsahu nečekají na JavaScript.

## Postup pro nový článek

1. Uložte pouze vnitřek původního `.article-content` do samostatného souboru `content/magazine/<nazev>.body`. Jde o HTML fragment bez přípony `.html`, aby jej katalogový validátor nezaměnil za veřejnou stránku. Zachovejte veškerý text, prompty, odkazy, obrázky, popisky a obsahové bloky.
2. Přidejte záznam do `content/magazine/articles.json`: cestu k obsahu, drobečky, perex, štítek rubriky, SEO metadata, případný úvodní obrázek, související odkazy a odkazy v patičce. Použijte jen existující redakční údaje.
3. V `js/site-articles.js` přidejte nebo aktualizujte katalogový záznam a nastavte `contentType: 'magazine'` pouze pro stránku, která používá tuto šablonu. Datum musí souhlasit s publikovaným datem článku.
4. Vygenerujte stránky: `node scripts/build-magazine-articles.js`.
5. Ověřte výstup: `node scripts/build-magazine-articles.js --check`, `node scripts/validate-content.js` a `git diff --check`. Zkontrolujte náhled na mobilu i desktopu a pak commitněte zdrojový obsah, katalog i vygenerované `.html`.

## Co přebírá společná šablona

`templates/magazine/*.tpl` obsahuje společný `<head>`, navigaci, záhlaví článku, úvod, postranní obsah, tlačítko „Zpět nahoru“, související články a patičku. Sdílené styly jsou v `css/magazine-article.css`; menu a interakce navigace používají existující `js/main.js`.

Generátor sestaví „V tomto článku“ z nadpisů H2/H3 v těle článku. Zachová existující ID, chybějícím vytvoří stabilní kotvy, upraví kolize a vypíše dostupné odkazy přímo do HTML. Viditelná čísla z textu nadpisů odstraní pouze v odkazech obsahu, takže se nezdvojují se značkami seznamu. Článek bez nadpisů H2/H3 dostane jednosloupcový rozvrh a žádné prázdné menu.

Obsah těla se načítá z `content/magazine/*.body.html`; stránky v kořeni jsou publikované výstupy a neupravují se ručně. Netlify nadále servíruje běžné statické HTML; pro náhled stačí commitnout znovu vygenerované stránky.
