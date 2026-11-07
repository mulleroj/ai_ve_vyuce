# Implementace rolí AI a časů aktivit — etapa 6C/5

**Základ:** `master` `703911b6e94b57b1e9983a3f8b510f938cf4c942`  
**Pedagogický zdroj:** [Role AI a časová metadata aktivit — etapa 6C/3](role-a-casy-aktivit-6c3-navrh.md), zejména oddíly 15 a 16.  
**Návaznost:** prompty a schválená rozhodnutí R01–R08 zůstávají zachované.

## Výsledek implementace

Do všech 44 aktivit přibyly `usage` a `timing`. Historické `duration` zůstává přesně zachováno jako kompatibilní zdrojový údaj. Ověření v tomto dokumentu rozlišuje pedagogicky schválené zařazení a skutečně odhadnuté časy: žádný údaj nemá doložené pilotní měření.

### Výsledný datový model

```json
"usage": {
  "aiOperator": "teacher_preparation",
  "requiresSchoolApprovedEnvironment": false,
  "studentDirectAccess": "not_required",
  "teacherRole": "Učitel připraví a ověří výstup.",
  "studentRole": "Žák pracuje s učitelem vybraným materiálem.",
  "offlineAlternative": null
},
"timing": {
  "teacherPrep": null,
  "learnerWork": null,
  "teacherReview": null,
  "activityTotal": null,
  "legacyUnclassified": {
    "value": 10,
    "range": null,
    "unit": "minutes",
    "per": null,
    "status": "unverified_estimate",
    "source": "legacy_duration"
  },
  "variants": []
}
```

`aiOperator` nabývá pouze `teacher_preparation`, `teacher_led`, `student_direct` nebo `flexible`. `studentDirectAccess` používá `required`, `optional` a `not_required`; validátor zná také `unknown`. Přímý přístup v režimu `flexible` znamená pouze možnost zvolenou učitelem podle podmínek školy.

Boolean `requiresSchoolApprovedEnvironment` se vztahuje výhradně na přímou interakci žáka s AI. `true` označuje požadavek pro přímý režim, nikoli potvrzení schválení. `false` znamená, že přímý žákovský přístup není součástí daného režimu; neznamená výjimku z obecných pravidel školy, ochrany dat, autorských práv ani dalších organizačních a právních povinností při učitelském použití AI.

`offlineAlternative` je `null`, pokud schválená dokumentace nedokládá konkrétní alternativu. Pokud ji dokládá, obsahuje popis a evidenci v promptu nebo schváleném podkladu. Rozhraní ji označuje **Alternativní postup**: může nahrazovat jen přímý přístup žáka nebo jednu fázi práce. Netvrdí, že celý postup včetně učitelské přípravy proběhne bez AI. Žádný veřejný stav netvrdí, že škola skutečně schválila určitý nástroj.

Časový záznam nese číselnou hodnotu nebo interval `range.min`/`range.max`, jednotku `minutes`, volitelnou jednotku osoby či textu (`per`), stav a zdroj. Stav `unknown` používá `value: null` a `range: null`; nejde o nulu. Varianty jsou samostatné záznamy s označením režimu a fází. `pilot_observed` validátor odmítne bez protokolu, vzorku a metody měření.

### Kompletní schválené mapování rolí

Pořadí odpovídá registru aktivit a schválené matici 6C/3.

| # | ID aktivity | Role AI |
|---:|---|---|
| 1 | `math-word-problem-generator` | Učitel připravuje |
| 2 | `math-step-by-step-guide` | Učitel nebo žák |
| 3 | `math-test-paper-generator` | Učitel připravuje |
| 4 | `math-differentiated-problems` | Učitel připravuje |
| 5 | `math-story-problem-game` | Učitel připravuje |
| 6 | `math-statistics-analysis` | Učitel vede AI |
| 7 | `czech-essay-feedback` | Učitel připravuje |
| 8 | `czech-dictation-generator` | Učitel připravuje |
| 9 | `czech-literary-analysis` | Učitel připravuje |
| 10 | `czech-spelling-word-exercises` | Učitel připravuje |
| 11 | `czech-matura-oral-exam` | Žák pracuje s AI |
| 12 | `czech-writing-form-guide` | Žák pracuje s AI |
| 13 | `english-conversation-partner` | Žák pracuje s AI |
| 14 | `english-grammar-feedback` | Učitel připravuje |
| 15 | `english-vocabulary-builder` | Učitel připravuje |
| 16 | `english-cambridge-exam-practice` | Žák pracuje s AI |
| 17 | `english-grammar-exercises` | Učitel připravuje |
| 18 | `english-contextual-translation` | Učitel vede AI |
| 19 | `biology-virtual-lab-experiment` | Učitel vede AI |
| 20 | `chemistry-equation-guide` | Učitel nebo žák |
| 21 | `physics-phenomenon-analogies-explainer` | Učitel připravuje |
| 22 | `biology-animal-encyclopedia` | Žák pracuje s AI |
| 23 | `physics-problem-solver` | Žák pracuje s AI |
| 24 | `chemistry-elements-compounds-quiz` | Učitel připravuje |
| 25 | `history-roleplay-historical-person` | Učitel vede AI |
| 26 | `history-timeline-generator` | Učitel připravuje |
| 27 | `history-debate-pro-con` | Učitel vede AI |
| 28 | `history-period-newspaper` | Učitel připravuje |
| 29 | `history-source-analysis` | Učitel vede AI |
| 30 | `history-map-analysis` | Učitel vede AI |
| 31 | `math-real-life-word-problems` | Žák pracuje s AI |
| 32 | `math-ai-tutor` | Žák pracuje s AI |
| 33 | `math-data-analysis` | Učitel nebo žák |
| 34 | `czech-essay-workshop` | Žák pracuje s AI |
| 35 | `czech-dictation-activity` | Učitel nebo žák |
| 36 | `czech-literary-analysis-class` | Žák pracuje s AI |
| 37 | `english-conversation-activity` | Učitel vede AI |
| 38 | `english-essay-feedback` | Učitel nebo žák |
| 39 | `science-virtual-lab-simulation` | Učitel vede AI |
| 40 | `physics-phenomenon-analogies-class` | Učitel vede AI |
| 41 | `history-roleplay-classroom` | Učitel vede AI |
| 42 | `history-class-timeline` | Učitel vede AI |
| 43 | `general-prompt-power-up-relay` | Žák pracuje s AI |
| 44 | `general-fact-or-fiction` | Učitel připravuje |

Ověřený součet: **16 učitel připravuje, 12 učitel vede AI, 11 žák pracuje s AI, 5 učitel nebo žák**. R01–R08 v registru souhlasí se schválenými rolemi; zejména R02 a R08 jsou flexibilní, R03 přímý žákovský režim a R04–R07 učitelsky vedené.

## Migrace časů

Původní `duration` zůstává beze změny u všech aktivit. Fáze byla přiřazena pouze tam, kde ji určoval schválený výklad 6C/3 nebo výslovný popis aktivity. Holé historické minuty zůstaly v `legacyUnclassified`; karta u nich zobrazuje neutrální **Čas zatím neurčen** a detail zachovává hodnotu s vysvětlením, že fáze není doložena. Jednotky „na žáka“ a „na text“ se nezaměňují za čas celé aktivity.

Časy s doloženou fází jsou označeny `unverified_estimate` a formulovány jako orientační. Rozsahy zůstávají intervaly; žádný chybějící údaj nebyl dopočítán. Samotná historická přítomnost hodnoty v katalogu neprokazuje její měření.

### T01–T08

| Rozhodnutí | Implementace | Kontrola |
|---|---|---|
| T01 | `biology-animal-encyclopedia`: dva scénáře zachovány odděleně: krátký režim asi 8 minut, rozšířený 20–30 minut. | Varianta krátkého a rozšířeného režimu je samostatně vidět v detailu; karta nepředstírá jednu délku. |
| T02 | `math-real-life-word-problems`: 5 minut je pouze příprava učitele; práce žáků zůstává `null`. | Karta říká „Příprava · asi 5 min“; detail výslovně uvádí, že čas přípravy není délkou práce žáků. |
| T03 | `czech-essay-workshop`: 2 minuty na žáka, samostatný pětiminutový režim a delší režim bez vymyšlené délky. | Jednotka na žáka zachována; neurčený delší režim používá `status: unknown`, nikoli nulu. |
| T04 | `czech-dictation-activity`: 5 minut přípravy; žákovský čas není určen. | Příprava se zobrazuje odděleně od neurčeného času práce žáků. |
| T05 | `czech-literary-analysis-class`: příprava 10 minut a orientační žákovská práce 15–20 minut. | Dvě fáze jsou odděleny v datech i detailu; karta ukazuje, že je rozpis v detailu. |
| T06 | `english-conversation-activity`: orientačních 15 minut celkem, bez smyšleného rozpisu. | Hodnota je `activityTotal`; příprava a práce žáků zůstávají nevyčíslené. |
| T07 | `physics-phenomenon-analogies-class`: původních 5 minut zůstává historickým nejednoznačným údajem. | Karta ukazuje „Čas zatím neurčen“; detail vysvětluje, že 5 minut není doložená délka celé dílny. |
| T08 | `history-class-timeline`: 5 minut přípravy; délka práce žáků není určena. | Detail odděluje přípravu a neznámou dobu žákovské práce. |

## Zobrazení karet a detailu

Každá karta zobrazuje textovou roli „Role AI: …“, stručný časový popisek a stávající formu práce. Role není sdělena pouze barvou či ikonou. U více časových fází a variant je karta nezplošťuje do zavádějícího čísla, ale odkazuje na rozpis v detailu. Nezařazené historické hodnoty neprezentuje jako dobu výuky.

Detail obsahuje přístupné sekce **Jak se používá AI** a **Časová náročnost**. Zobrazuje obsluhu AI, stručnou roli učitele i žáka, stav a podmínku přímého přístupu, doloženou offline variantu a všechny dostupné časové fáze či scénáře. U časů je vysvětleno, že jde o orientační odhady a ne o pilotní měření. Dosavadní úplný prompt, kopírování, filtrování, sdílené odkazy, dialogy, Escape a návrat fokusu zůstávají zachovány.

## Bezpečnost a přístupnost

- Přímý žákovský přístup není považován za automaticky schválený; školní schválení je požadavek režimu, ne uložený stav školy.
- Učitel v přímých či flexibilních rolích nadále stanovuje vzdělávací cíl a školní podmínky.
- Alternativní postupy jsou uvedeny jen tam, kde je dokládá prompt nebo schválený podklad; nejsou odvozeny z pouhé možnosti práci vytisknout a neznamenají, že předchozí učitelská příprava nevyužívá AI.
- Popisky jsou skutečný text; sekce detailu mají nadpisy a definované seznamy. Stávající tlačítka detailu, kopírování a zavření zůstávají ovladatelná klávesnicí.
- Nové štítky používají střídmé barvy a zalamování. Kontrola po implementaci zahrnuje malé, střední a široké zobrazení a ověření klávesnicového dialogu.

## Budoucí pilotní měření

Žádný současný čas není pilotně měřen. Budoucí měření může změnit stav na `pilot_observed` pouze s doloženým protokolem, popisem vzorku a metodou. Měření má oddělovat přípravu učitele, práci žáků, kontrolu a případné režimy; školní data mají být sbírána jen v souladu s pravidly školy. Historický `duration` zůstane zachován pro zpětnou kompatibilitu.

## Výsledky kontrol

- `node scripts/generate-activities.js --check`: všech šest regionů bez driftu; 44 aktivit, 14 doporučených.
- `node scripts/generate-prompts.js --check`: 204 samostatných promptů, bez driftu.
- `node scripts/validate-content.js`: 76 článků, 76 unikátních odkazů, žádné chybějící cíle, duplicity, chyby ani upozornění.
- `node scripts/check-site-footer.js`: prošlo pro všech 102 relevantních HTML souborů.
- JavaScript syntaxe: `node --check` prošel pro 24 souborů v `js/` a `scripts/`.
- `git diff --check` a kontrola staged diffu: bez whitespace chyb.
- Vlastní kontrola invariants: všech 44 ID a pořadí, všech 44 promptů, všechna ostatní metadata včetně `duration`, 14 doporučených položek a hash `data/prompts.json` beze změny; registr obsahuje 204 položek.
- Negativní validační případy: neplatná role, záporný čas a `pilot_observed` bez protokolu/vzorku/metody validátor odmítl.
- Playwright na 390×844, 768×900 a 1440×900: všech 44 karet má štítek role a čas; 44 detailů vykreslilo správnou roli, fáze a nezměněný prompt; všech osm rozhodnutí T01–T08 bylo ověřeno.
- Skutečné kopírování přes schránku: ověřeno všech 44 promptů z detailu a z karty, navíc osm kopií při kontrole T01–T08 (96 kontrol celkem).
- Filtry a vyhledávání, modal dialog, Escape, návrat fokusu, názvy tlačítek, nadpis stránky, žádná nulová minuta, horizontální přetečení a nové JavaScriptové chyby: bez nálezu.
- Kontrast nově použitých textů: 5.77:1 až 12.15:1 na příslušném pozadí.
- Srovnatelné snímky devíti karet a jejich detailů před/po jsou uloženy v `qa-6c5-before/` a `qa-6c5-after/` v adresáři výstupů této revize.
- Draft PR #41: [AI VE VÝUCE 2.0 – 6C/5](https://github.com/mulleroj/ai_ve_vyuce/pull/41). Netlify Deploy Preview je připraveno: [deploy-preview-41](https://deploy-preview-41--ai-ve-vyuce.netlify.app/). Produkční deploy nebyl proveden.

Plný axe audit nebylo možné spustit: `axe-core` ani `@axe-core/playwright` nejsou v dostupném prostředí nainstalované. Browser kontrola ověřila základní názvy ovládacích prvků, sémantiku dialogu, klávesnicové ovládání, fokus a kontrast nového textu; nenahrazuje kompletní audit WCAG.

## Známá omezení

Role jsou pedagogicky schválené kategorie z matice 6C/3; nejsou technickým vynucením role v AI nástroji. Orientační časy nejsou změřené. U historických údajů bez fáze zůstává možné pouze neutrální zobrazení. Alternativní postup označuje pouze doložený dílčí způsob práce bez přímého žákovského AI přístupu, nikoli nutně celý scénář bez AI ani automatickou náhradu přípravy učitele.
