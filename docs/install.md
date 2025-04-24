# Teleítési útmutató

### 1. Host fájl szerkesztése 

- Keresd meg a host fájlt az alábbi útvonalon: `C:\Windows\System32\drivers\etc\hosts`
Add hozzá az alábbi kódot: 

`127.0.0.1 vm1.test api.vm1.test frontend.vm1.test checkitoutlite.test backend.vm1.test pma.vm1.test docs.vm1.test swagger.vm1.test jsonserver.vm1.test mailcatcher.vm1.test`

### 2. Projekt indítása
- Clone-ozd le a projektet
A start.sh futtatásával indítható
``` bash start.sh ```

Adatbázis létrehozása és mintaadatok feltöltése
```docker compose exec backend php artisan migrate:fresh --seed```

### 3. Projekt megtekintése 

Nyisd meg az egyik bőngészőben a projektet, az alábbi linken: 
```checkitoutlite.test```
