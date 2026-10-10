# Jordan Hydrology Model — dvě varianty

- `pro-verejnost/index.html`: výuková verze s jednodušším uživatelským rozhraním.
- `odborny-model/index.html`: odborná verze se všemi posuvníky, numerickou kontrolou objemu a citlivostní tabulkou.
- `index.html`: rozcestník pro GitLab Pages.

## Spuštění

Rozbalte ZIP a otevřete kořenový `index.html`. Pro samotné fyzikální výpočty není internet potřeba. Pro mapu s reliéfem je nutný internet; pokud místní prohlížeč omezuje načítání lokálních skriptů, použijte jednoduchý statický HTTP server (`python -m http.server 8000`).

## Odborná omezení

Objem = průtok × doba × (1 − ztráty). Geometrický model integruje proměnlivý příčný profil údolí. Není použito skutečné DEM; zátopa vykreslená v mapě je analytická ilustrace. Referenční sklon ani šířka 350 m nejsou historickým měřením. Nejde o prokázaný mechanismus či rekonstrukci události z Jozua 3–4.

Poloha biblických míst (zejména Gilgalu a místa přechodu) může být nejistá. Externí mapové podklady podléhají licenci svých poskytovatelů.


## Volitelný výpočet z DEM (obě varianty)

Obě verze mají tlačítko **Vypočítat zátopu podle reliéfu (DEM, online)**. Zůstává zachován okamžitý analytický výpočet a návrat do něj. DEM využívá veřejné obrazové výškové dlaždice Terrarium (Mapzen/AWS, ne Copernicus GLO-30) v okolí Adamu; vyžaduje internet a povolené CORS. Zkoumá současnou topografii jen v omezeném výřezu a jejím fyzikálním přiblížení. Výstupy DEM jsou nezávislý experimentální scénář, nikoli definitivně validovaný model ani historická záplava.

V režimu DEM se hlavní analytický panel **nezaměňuje** s výsledkem DEM: odlišné výsledky jsou explicitně uvedeny pod mapou. Při chybě načítání mapa zůstane v analytickém režimu. V mapě nelze předpokládat spolehlivou hladinu bez přesných výšek koryta a skutečného stavu povrchu v biblické době.

## Navigace
Kořenový `index.html` automaticky otevře základní model. Nahoře je tlačítko na odborný model a v odborném modelu tlačítko pro návrat. Obě stránky mají volitelné tlačítko pro DEM (online).

**Důležité:** DEM pochází z online výškových dlaždic Terrarium (nikoli přímo Copernicus). DEM režim je experimentální, dosud není empiricky validován, jeho výsledky nejsou zaměnitelné s analytickými a neprokazují historickou zátopu. Při problému s CORS nebo daty zůstává analytické zobrazení.


## Údaje o průtoku a terminologie

Rozsah 50–150 m³/s slouží jako pracovní scénář zvýšeného jarního průtoku. **Není to historicky ověřené rozpětí u Adamu v době Jozua.** Jednotkou je **m³/s**, nikoli m³/h; při 100 m³/s přiteče za jednu hodinu 360 000 m³. Historický roční odtok dolního Jordánu kolem 1,2–1,3 miliardy m³ odpovídá ročnímu průměru přibližně 38–41 m³/s. Zdroj: Farber et al. (2004), *Geochimica et Cosmochimica Acta*, The origin and mechanisms of salinization of the Lower Jordan River, https://www.sciencedirect.com/science/article/pii/S0016703703007476 ; a Jordan Valley (Springer), https://link.springer.com/chapter/10.1007/978-3-319-30036-8_2 .

Ve veřejné i odborné verzi se užívá především „zvýšení hladiny“, „zaplavená oblast“ a „rozloha zaplaveného území“. Technický pojem vzdutí se v odborné části může vyskytovat tam, kde označuje samotný fyzikální jev.
