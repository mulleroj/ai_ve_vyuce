# Šablona praktických návodů a workflow

Dvě pilotní stránky používají samostatný design v `css/guide-article.css`. Jejich zdrojové obsahové fragmenty, hlavičky, metadata, přehledy postupu, související odkazy a patičky jsou popsány v `content/guides/articles.json` a složkách pro jednotlivé stránky. Šablona stránky se sestavuje deterministicky skriptem `scripts/build-guide-articles.js`.

## Kontrola a sestavení

- `node scripts/build-guide-articles.js` přegeneruje pouze stránky uvedené v manifestu.
- `node scripts/build-guide-articles.js --check` ověří, že výstup odpovídá zdrojům.
- Skript zachovává existující ID nadpisů a doplňuje stabilní ID jen tam, kde chybí. Kontroluje duplicitní ID v nadpisech a očekávaný počet kopírovatelných promptů.
- Klikací obsah je odvozen z H2 a H3; čistě obecné nadpisy „Prompt“ z něj vynechává, jejich cílová ID ale ponechává.
- Vizuální overview se přebírá z původního článku a nepřidává nové kroky.
- Prompt se kopíruje pouze tehdy, když původní blok výslovně nese `data-guide-copyable`; ostatní bloky `.article-prompt` zůstávají běžným obsahem.

## Převod dalšího článku

1. Nejprve porovnejte celý původní text, datum, metadata, všechny obrázky, odkazy a související obsah. Nepoužívejte prototyp jako zdroj redakčního textu.
2. Přidejte do `content/guides/<slug>/` obsahové fragmenty `body.inc`, `overview.inc`, `related.inc` a `footer.inc`. Do `body.inc` vložte pouze obsah původního článku; prompty označte jako kopírovatelné jen po ověření, že jde skutečně o kompletní prompt.
3. Přidejte záznam do `content/guides/articles.json` se zdrojovým souborem, datem, kategorií, perexem, metadaty, odkazy na fragmenty a kontrolními součty původního obsahu. Hash těla ověřuje normalizovaný viditelný text a jeho délku; hash související části a patičky ověřuje normalizovaný viditelný text. Tyto hodnoty se aktivně kontrolují při každém sestavení. Odkazy a obrázky v těle se také porovnávají s manifestem.
4. Každý obsahový obrázek uveďte v `sourceBodyImages` ve stejném pořadí jako v `body.inc`, včetně `src`, přesného `alt` textu a rozměrů. Bez úvodního obrázku vynechte `hero.imageSrc`; úvodní obrázek se vybírá samostatným `hero.imageSrc` a z těla se přesune jen odpovídající `<figure>`. Ostatní obrázky zůstávají v původním pořadí a zachovávají své odkazy i poměr stran.
5. Upravte pouze příslušný záznam v `js/site-articles.js`, přičemž ponechte všechna jeho stávající data a datum shodné s článkem.
6. Spusťte `node scripts/build-guide-articles.js` a následně `node scripts/build-guide-articles.js --check`. Ověřte obsah, obrázky, odkazy, copy tlačítka, navigaci klávesnicí, šířky obrazovky a katalog. Další migrační stránku přidávejte až po redakčním schválení pilotů.

Zastaralé nebo časově proměnlivé výroky se hlásí samostatně k redakční kontrole. Šablona ani sestavení je automaticky nepřepisují.
