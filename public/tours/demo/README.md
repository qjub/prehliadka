# Tour balík

Toto je jeden "tour balík" = jedna prehliadka interiéru. Skladá sa z:

- `tour.json` — popis prehliadky (miestnosti, flagy, pôdorys). Tvorí sa v EDIT režime.
- `*.jpg` — equirectangular panorámy (2:1), jedna na miestnosť. Sem dáš výstup z UE5 appky.
- `podorys.png` — obrázok pôdorysu (voliteľné).

## Ako pridať vlastný interiér

1. Vyrenderuj panorámy v UE5 appke a ulož ich sem (napr. `obyvacka.jpg`, `kuchyna.jpg`...).
   Odporúčaná veľkosť pre web: ~4096×2048, JPG/WebP.
2. Daj sem aj `podorys.png` (pôdorys interiéru).
3. Spusti web s `?edit=1`, naklikaj flagy a body pôdorysu.
4. Klikni **Stiahnuť tour.json** a prepíš ním tento súbor.
5. `git push` → Vercel nasadí.

## Nový interiér = nový priečinok

Skopíruj celý priečinok (napr. `public/tours/byt-kosice/`), vymeň obrázky a `tour.json`.
Na webe potom len ukáž komponent na novú cestu:

```jsx
<Tour src="/tours/byt-kosice/tour.json" />
```

> Pozn.: ukážkový `tour.json` odkazuje na `obyvacka.jpg`, `kuchyna.jpg`, `spalna.jpg`
> a `podorys.png`, ktoré tu zatiaľ nie sú — kým ich sem nedáš, viewer zobrazí chybu
> načítania. Doplň svoje obrázky (alebo uprav názvy v `tour.json`).
