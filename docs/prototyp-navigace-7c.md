# Etapa 7C – klikací prototyp informační architektury

## Stav a východiska

Prototyp vychází ze schválené taxonomie v návrhu etapy 7B a ze snapshotu `origin/master` na commitu `227a32e4993592aa845e3bb04e7f9247b70b6fd1` (stav ověřen před vytvořením větve). Hlavní menu používá beze změny šest oblastí: **Začít s AI, Připravit výuku, Učit s AI, Nástroje a asistenti, Tvořit s AI, Číst a objevovat**. Homepage navíc nabízí úkolové vstupy „Co dnes potřebujete udělat?“.

### Kde prototyp otevřít

Prototyp je samostatný statický soubor mimo repozitář a mimo publikovaný strom webu:

`C:\Users\mulle\.codex\visualizations\2026\11\08\01a1bb79-8100-7681-96e4-887193bff64d\ai-ve-vyuce-7c-prototype\index.html`

Na počítači, kde tento soubor existuje, jej otevřete přímo v prohlížeči (Průzkumník souborů → dvojklik na `index.html`). Styl a skript jsou ve stejném adresáři jako `styles.css` a `app.js`; složka `assets` obsahuje kopie použitých obrázků z webu. Prototyp není součástí tohoto PR, protože kořen repozitáře je statický publikační prostor a PR vytváří Netlify deploy preview. Do PR proto patří pouze tato dokumentace. Absolutní cesta je lokální cesta na autorově počítači; jiný recenzent potřebuje předat složku prototypu samostatně.

## Co prototyp ukazuje

Jde o samostatnou jednostránkovou demonstraci s kotvami, nikoli o produkční HTML. Obsahuje:
- homepage s úkolovými kartami a přehledem šesti oblastí;
- šest tematických rozcestníků a společné rozbalovací menu;
- reprezentativní obsahové náhledy: bezpečný začátek, příprava hodiny, materiály, knihovna aktivit s filtrem předmětu, porovnání nástrojů, prompty, workflow, vibe coding, návrh aplikace, magazín a detail článku;
- koncept rozcestníku Filozofování s AI se čtyřmi evidovanými díly a navigací mezi nimi;
- odkazy na skutečné produkční stránky jako externí odkazy otevřené v novém panelu.

Čtyři články série jsou zobrazeny v pořadí podle redakčních metadat z 7B: „Kritické myšlení už nestačí?“, „Možná nám AI ukáže, kolik lidí nám celou dobu chybělo“, „Učí se žák, nebo za něj přemýšlí AI?“ a „Když AI už nejen radí, ale jedná“. URL těchto článků zůstávají zachované; nová cesta `/filozofovani-s-ai` je pouze budoucí návrh rozcestníku.

## Procházené uživatelské cesty

Kroky níže počítají kliknutí od homepage; zkrácené cesty v prototypu mají ověřit logiku navržené IA, nikoli napodobit existující počet kliknutí na produkčním webu.

| Potřeba | Ukázaná cesta | Kroky | Co má recenzent posoudit |
|---|---|---:|---|
| Začít s AI | Úkolová karta „První bezpečný pokus“ → bezpečný návod | 1 | Je bezpečnost dost viditelným prvním krokem? |
| Připravit hodinu | „Připravit hodinu“ → postup s cílem, variantou a úpravou | 1 | Je postup srozumitelný pro učitele bez zkušeností s AI? |
| Vytvořit pracovní list/test | „Vytvořit materiál“ → cíl → návrh → kontrola | 1 | Je jasné, že AI výstup učitel kontroluje? |
| Najít aktivitu v předmětu | „Aktivita do angličtiny“ → knihovna filtrovaná parametrem `subject=aj` | 1 | Odpovídá vstup názvu i výsledku v knihovně? |
| Workflow / vlastní aplikace | „Vytvořit výukovou pomůcku“ → Tvořit s AI → návrh aplikace | 2 | Je hranice mezi workflow, aplikací a agentem jasná? |
| Článek / novinky | „Číst článek“ → magazín → detail → související série | 2–3 | Je z detailu zřejmý návrat do magazínu a další čtení? |

## Navigace a přístupnost v návrhu

- Desktop a mobil používají stejné pořadí oblastí, názvy i podkategorie. Na mobilu se stejné položky skládají do jednosloupcového menu.
- Menu i podmenu jsou nativní elementy `details/summary`; základní navigační kotvy zůstávají v HTML dostupné bez JavaScriptu. JavaScript pouze zavírá menu/skupiny při Escape, výběru odkazu nebo změně šířky.
- Escape na mobilu zavírá navigaci a vrací fokus na spouštěcí prvek; na desktopu se fokus vrací na aktivní položku oblasti. Odkazy a ovládací prvky mají viditelný fokus.
- Je přítomen odkaz na přeskočení k hlavnímu obsahu, sémantické oblasti a hierarchie nadpisů H1/H2/H3. Respektuje se `prefers-reduced-motion`.
- Přechod do knihovny aktivit zachovává parametr `subject=aj`. Cesta Filozofování obsahuje pořadí, předchozí/následující díl a návrat do magazínu.
- Při implementaci musí zůstat menu použitelné klávesnicí, na dotykových displejích i při nedostupném JavaScriptu. Tato dokumentace neurčuje finální mikrotexty ani redakční obsah karet.

## Technická bezpečnost a ověření

V ověřeném snapshotu je web statický a obsah kořene repozitáře je publikační zdroj; zároveň existuje automatický Netlify deploy preview pro PR. Proto nejsou soubory prototypu commitnuty do kořene ani do adresáře `docs`. Nezměnily se produkční HTML, CSS, JavaScript, URL, canonical, sitemap ani `_redirects`. Nepožadoval se merge ani produkční deploy.

Statická kontrola prototypu:
- 112 odkazů a 28 ID; po opravě odkazu menu „Praktické návody“ z `#guide` na existující `#safe-start` nebyl v HTML nalezen žádný neexistující fragment;
- všech 6 lokálních obrazových souborů v `assets` existuje;
- všech 19 unikátních odkazů na produkční HTML ověřeno jako existující v snapshotu `227a32e4993592aa845e3bb04e7f9247b70b6fd1`;
- desktopový fallback pro uzavřený `details` kontejner je explicitně zobrazen CSS pravidlem; mobilní zobrazení používá nativní přepínání `details`;
- skript po Escape vrací fokus na spouštěč nabídky na mobilu, nebo na aktuální položku menu na desktopu.

**Vizuální a interakční browser QA nebylo provedeno.** Otevření lokálního `file://` souboru přes dostupné browser-control rozhraní zablokovala jeho bezpečnostní politika (povoluje pouze HTTP(S)); tento zákaz nebyl obcházen. Proto nejsou potvrzeny skutečné rozměry/zalomení při 320, 390, 768 a 1440 px, barevný kontrast, chování klávesnice v konkrétním browseru ani vizuální čitelnost. Tyto body zůstávají před implementací k ručnímu ověření v prohlížeči; dokumentace je neoznačuje za úspěšné testy.

## Návrh dalších etap

### 7D – pedagogická a uživatelská revize prototypu
Předat složku prototypu k posouzení učitelům ZŠ/SŠ. Ověřit šest cest, pojmy „návod / workflow / aktivita / asistent / agent“, pořadí magazínu a série, čitelnost a úkolové vstupy. Zapsat konkrétní rozhodnutí a změny textů před kódováním.

### 7E – vizuální, responzivní a přístupnostní QA
Otevřít lokální kopii v prohlížeči a otestovat šířky 320, 390, 768 a 1440 px; ověřit přetečení, menu, klávesnici, Escape/fokus, no-JS fallback, kontrast, zoom a čtečku obrazovky. Zaznamenat výsledky před implementací.

### 7F – technický návrh a pilot
Vybrat omezený počet reprezentativních stránek a navrhnout sdílený zdroj navigace / šablonu. Nejprve ověřit dopad na generátory a odlišné šablony. Zachovat existující URL, canonical, sitemap a veřejné odkazy. Produkční nasazení až po samostatné revizi a schválení.

### 7G – postupné rozšíření
Nasazovat společné menu a rozcestníky po tematických skupinách. Každou skupinu ověřit v desktopu i mobilu, bez JS a s klávesnicí; zkontrolovat interní odkazy, metadata, canonical a sitemap po každé etapě. Přesměrování 301 přidat pouze pro URL, které by byly samostatně schváleny ke změně.

## Stav pro revizi

Prototyp představuje návrh IA, nikoli schválení finální podoby. Recenzentům je třeba předat jak tento dokument, tak lokální složku prototypu. Před implementací čeká na potvrzení zejména pojmenování karet a podkategorií, vhodnost úkolových vstupů, srozumitelnost tematických hranic a vizuální použitelnost na uvedených šířkách.
