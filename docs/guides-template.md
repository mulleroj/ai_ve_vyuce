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
2. Přidejte do `content/guides/<slug>/` obsahové fragmenty `body.html`, `overview.html`, `related.html` a `footer.html`. Do `body.html` vložte pouze obsah původního článku; prompty označte jako kopírovatelné jen po ověření, že jde skutečně o kompletní prompt.
3. Přidejte manifest se zdrojovým souborem, datem, kategorií, perexem, metadaty, odkazy na fragmenty a kontrolními součty původního obsahu. Zachovejte původní ID kotev a přehled kroků.
4. Upravte pouze příslušný záznam v `js/site-articles.js`, přičemž ponechte všechna jeho stávající data a datum shodné s článkem.
5. Spusťte sestavení a ověřte obsah, obrázky, odkazy, copy tlačítka, navigaci klávesnicí, šířky obrazovky a katalog. Další migrační stránku přidávejte až po redakčním schválení pilotů.

Zastaralé nebo časově proměnlivé výroky se hlásí samostatně k redakční kontrole. Šablona ani sestavení je automaticky nepřepisují.
