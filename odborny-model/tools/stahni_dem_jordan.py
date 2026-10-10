#!/usr/bin/env python3
"""Stáhne Copernicus DEM GLO-30 pro oblast Jordánu u Adamu a Jericha.
Spuštění: python stahni_dem_jordan.py
Vyžaduje pouze Python 3 a internet, bez dalších balíčků.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

OUT=Path(__file__).resolve().parent/'jordan_dem_original'
OUT.mkdir(exist_ok=True)
BASE='https://copernicus-dem-30m.s3.eu-central-1.amazonaws.com'
for lat in (31,32):
    name=f'Copernicus_DSM_COG_10_N{lat:02d}_00_E035_00_DEM'
    url=f'{BASE}/{name}/{name}.tif'
    dest=OUT/f'{name}.tif'
    print(f'\n{lat}°–{lat+1}° N: {dest.name}')
    if dest.exists() and dest.stat().st_size>100000:
        print('Soubor už je stažen.');continue
    tmp=dest.with_suffix('.part')
    try:
        req=Request(url, headers={'User-Agent':'JordanHydrologyResearch/1.0'})
        with urlopen(req,timeout=50) as r, open(tmp,'wb') as w:
            while True:
                block=r.read(1024*1024)
                if not block:break
                w.write(block)
                print(f'\rStaženo {w.tell()/1048576:.1f} MB',end='',flush=True)
        tmp.replace(dest)
        print('\nOK:',dest)
    except (HTTPError,URLError,OSError) as e:
        print('\nStažení se nepodařilo:',e)
        if tmp.exists():tmp.unlink()
print('\nHotovo. Soubor(y) .tif lze nahrát do chatu pro zpracování terénního modelu.')
