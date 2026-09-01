# Projektová pravidla pro AI ve Výuce

## Články a centrální katalog

- Každý nový nebo upravený detailní článek, který patří do některého rozcestníku, musí být ve stejné změně přidán nebo aktualizován v `js/site-articles.js`.
- Do katalogu nepatří samotné rozcestníky (`ai-agenti.html`, `ai.html` apod.), ale pouze stránky s plným článkem.
- Každý katalogový záznam musí obsahovat existující relativní `href`, `title`, krátké `summary`, `category`, ISO datum `date`, čitelné `dateLabel`, `icon`, `tags` a `badgeClass`.
- Datum v katalogu musí odpovídat datu uvedenému v metadatech detailního článku. Katalog zachovává aktuální automatické řazení indexu podle data a zobrazení šesti nejnovějších článků.
- Před dokončením zkontroluj, že katalog nemá duplicitní `href`, všechny odkazy existují a index skutečně zobrazí očekávaných šest nejnovějších článků.

Chybějící záznam v `js/site-articles.js` znamená neúplně zveřejněný článek.
