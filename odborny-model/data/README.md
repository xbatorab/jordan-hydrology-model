# Geografická data – připravené místo

V této verzi **nejsou** součástí projektu ověřené rastrové výškové podklady (DEM).
Modrá plocha výchozí mapy představuje **analytickou geometrickou ilustraci**, nikoliv hranici zaplavení z reliéfu.

Před přidáním skutečného výpočtu zátopy je třeba:
1. Získat oprávněně použitelný DEM, evidovat zdroj, výškový datum, rozlišení, licenci a datum pořízení.
2. Převést DEM do pravidelné mřížky a vymezit skutečné povodí nad hypotetickou hrází.
3. Ověřit výškový datum řeky; výškové rozdíly relativně k toku nevyvozovat jen z modelu povrchu.
4. Numericky invertovat objemovou křivku a zobrazovat pouze hydraulicky propojené buňky.
5. Rozlišit celkovou vodu v korytě a **přírůstek** vody zadržený hrází.
6. Testovat citlivost na změny historického reliéfu, polohu hráze a rozlišení DEM.

Geografie historických sídel je hypotetická tam, kde archeologie neurčuje jednoznačnou lokalizaci.
