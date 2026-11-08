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


## Revize 7D

### Nová samostatná verze

Upravený prototyp je uložen mimo repozitář a Netlify publikační strom ve složce:

`C:\Users\mulle\.codex\visualizations\2026\11\08\01a1bb79-8100-7681-96e4-887193bff64d\ai-ve-vyuce-7d-prototype`

Kompletní ZIP je v uživatelské složce Downloads:

`C:\Users\mulle\Downloads\ai-ve-vyuce-prototyp-7d.zip`

Původní složka a archiv 7C zůstaly zachované. V 7D jsou čtyři soubory v kořeni (`index.html`, `filozofovani-s-ai.html`, `styles.css`, `app.js`) a šest obrazových podkladů v `assets/`. HTML odkazují na soubory relativně. Samostatná stránka série i homepage mají `noindex,nofollow`; jde o lokální prototyp, nikoli o vytvoření produkční cesty `/filozofovani-s-ai`.

### Provedené úpravy

- Zachováno šest schválených oblastí. Každý název hlavního menu je nativní rozbalovací ovládací prvek a každá podkategorie vede na konkrétní sekci prototypu nebo existující veřejnou stránku.
- Menu na desktopu i mobilu používá stejné názvy a pořadí. Jeho rozbalení je založeno na `details/summary`; Escape zavírá podmenu, na mobilu také celé menu a vrací fokus na spouštěč. Na desktopu vrací fokus na příslušnou oblast. Aktivní oblast se označuje atributem `aria-current="location"` po výběru odkazu, změně kotvy i při posunu stránky.
- Zpřesněny cíle „Základy práce s AI“, „Praktické návody“, „Práce žáků s AI“, „Bezpečnost a testování“, „Novinky“ a „Filozofování s AI“. Katalog aktivit pro angličtinu zachovává `subject=aj`.
- Příprava materiálů nyní odděluje pracovní list a test, uvádí kroky kontroly a propojuje prompt, návod a workflow podle jejich účelu.
- Doplněno průřezové téma práce žáků s AI, které vede k roli žáka, roli AI a důkazu učení; nevzniká druhý katalog aktivit.
- Porovnání ChatGPT/Gemini obsahuje rozhodovací otázky podle úkolu a školních podmínek. Formulář návrhové karty aplikace vytvoří lokální textové zadání; nevolá žádnou AI službu.
- Přidáno přímé obousměrné rozlišení: hotový asistent vede do katalogu asistentů, tvorba vlastního agenta do návodu „První agent“. Popisy vysvětlují rozdíl mezi používáním připraveného pomocníka a navrhováním agenta.
- Inline výpis série na homepage byl nahrazen stručnou upoutávkou. Nový soubor `filozofovani-s-ai.html` vysvětluje smysl série, ukazuje čtyři díly podle evidovaného pořadí `seriesNumber`, uvádí téma každého dílu, odkazy na celé články, předchozí/následující díl, návrat do magazínu a související pedagogická témata. URL článků se nemění.
- Zvětšeny drobné navigační popisky a dotykové cíle; styly zachovávají tmavě zelenou identitu, žlutý akcent a existující grafiku. Nepřidány nové animace.

### Kontroly 7D

Statické ověření lokální složky:
- 2 HTML stránky: homepage a samostatný rozcestník série; po 33 a 6 jedinečných ID, bez duplicit;
- 67 fragmentových odkazů na homepage a 10 na stránce série; žádný neplatný fragment;
- všech 6 obrazových souborů nalezeno a všech 6 použitých obrazových zdrojů se odkazuje na existující soubor;
- šest hlavních oblastí je přítomno v menu;
- všech 21 unikátních cílových produkčních HTML stránek, na které verze 7D odkazuje, existuje v `master`; odkazy otevírané v novém panelu mají `rel="noopener"`;
- pořadí čtyř článků odpovídá `seriesNumber` z 7B: kritické myšlení → role lidí → učení žáků → odpovědnost agentů;
- `node --check app.js` prošel;
- zdrojové barvy pro běžný text, odkaz a tmavý text na žlutém tlačítku mají vypočtený kontrastní poměr 17,73:1, 8,26:1 a 7,68:1. Jde o kontrolu zadaných barev, nikoli o měření všech vykreslených kombinací;
- ZIP obsahuje 10 souborů, neobsahuje absolutní ani nebezpečně relativní cesty a byl rozbalen do dočasné složky; všech 10 očekávaných souborů se při rozbalení našlo.

### Neprovedené testy a omezení

Playwrightové testy, axe ani jiné automatizované kontroly přístupnosti v běžícím prohlížeči nebyly provedeny. Dostupné browser-control rozhraní dříve výslovně odmítlo otevřít lokální soubor a zakázalo dosáhnout stejného výsledku přes jiný browser, lokální HTTP server nebo jinou obchvatnou cestu. Toto omezení nebylo obcházeno. Playwright modul nebyl v dostupném Node prostředí použitelný. Nejsou tedy potvrzené skutečné rozměry, přetékání, dotykové cíle, vizuální kontrast na pozadích, chování klávesnice, aktivní oblast v reálném prohlížeči ani výsledek interaktivních cest. Screenshoty nebyly pořízeny.

Před pedagogickou/uživatelskou revizí a implementací otevřete rozbalenou složku 7D ručně v prohlížeči a projděte šířky **320, 390, 768 a 1440 px**. Ověřte přetečení a čitelnost, hlavní menu i podmenu, aktivní oblast, ovládání Enter/Space/Tab, Escape a návrat fokusu, změnu šířky, režim bez JavaScriptu a formulář návrhu aplikace. Projděte všech šest cest: bezpečný začátek; příprava hodiny; pracovní list i test; angličtina s filtrem; volba ChatGPT/Gemini a přechod asistent–agent; novinky/článek a všechny díly série včetně navigace tam i zpět. Zkontrolujte také zoom, čtečku obrazovky a rozdíly v kontrastu. Pořiďte screenshot homepage, otevřeného menu, rozcestníku „Připravit výuku“ a stránky série na desktopu i mobilu.

Prototyp zůstává návrhem k uživatelskému a vizuálnímu posouzení, nikoli podkladem připraveným k produkční implementaci. Při této revizi se měnil pouze externí prototyp a tento dokument v PR #44; produkční HTML, CSS, JavaScript, sitemap, canonical, `_redirects` a existující URL zůstaly beze změny. PR #44 zůstává draft a nesloučený.
