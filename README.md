# Duty Roster (routine-maker)

A super lightweight, single-file web app for building a department's **weekly duty roster** (OT / station × day grid).

- **No install, no server, no dependencies.** Open `index.html` in a browser, or host it on any static host (GitHub Pages works).
- **Data lives in the browser's `localStorage`.** Download a backup now and then, because clearing browser data erases it.

## Workflow

The app has four steps, shown at the top.

1. **Upload**: drop the senior's roster (`.docx`) into the box. Earlier weeks are listed below it.
2. **Leave**: add who asked for leave and tick their days, or press **No leave requested**. Leave is written in the roster's format, initials then dates (e.g. Dr. Ankit Sthapit → `AS 30,1,5`), and is added to the **LEAVE** box of the downloaded file.
3. **Plan 1st years**: one row per 1st-year resident, one column per day. Pick each person's station from the dropdown. People on leave are locked for that day, and the bottom row lists cases that still have no 1st year.
   - **OT rules**, on any day of the week: they're filled in automatically when you pick the duty, and undone if you change it.
     - **OT 2 (neuro)** today → tomorrow **OT 5/LR** → day after **leave**
     - **OT 7 (GI)** today → tomorrow **LR** → day after **leave**
     - If the chain runs past Sunday, the review lists what carries into next week.
4. **Review & download**: the whole table, with your 1st years in blue. **Download Word (.docx)** gives back **the senior's original file**, with only the 1st-year codes added to the table and your leave added to the LEAVE box. Everything else is byte-for-byte unchanged.

If the senior sends a **revised file** for the same week, upload it and choose *update*. Their part is replaced, and your 1st-year plan is kept.

The senior's part is locked; you can only place 1st years. Everything else lives in the **⋯** menu: staff directory, settings (which categories you plan, the next-day rule, unlocking a week), the full table editor, other download formats, backup and restore.

## Features

- **Weekly routines.** Each week is a grid of columns (OT 1 … ACADEMIC, which you can rename, add or remove) × 7 days. **+ New week** fills in the next dates for you (Bikram Sambat style `YYYY/MM/DD`; set the days in the month for the rollover). It can copy the columns, and optionally the assignments, from an earlier week.
- **Cell editor.** Each cell has a case/unit label (e.g. `URO`, `GI`, `XX` for closed), staff codes and an optional note. Pick staff by clicking their codes. People already on duty elsewhere that day are shown in orange, and people on leave in red.
- **Leave box.** Enter leave as `SaS: 30,1  PP: 1-4  RP: 4`. Anyone assigned on a leave day is flagged.
- **Checks.** The app flags double bookings, leave conflicts and unknown codes. **Duties this week** counts each person's assignments. Click a code there to highlight that person across the grid.
- **Staff directory.** Name, code and category (faculty, residents by year, …). It is shared across weeks, and renaming a code updates every week.
- **Upload**
  - `.docx`: an existing roster in the same layout as the department's Word roster (grid table + staff table + LEAVE box). Columns, days, cases, staff codes, leave, rotations and signature are all read in.
  - `.json`: a single week or a full backup.
- **Download**
  - Word document (`.doc`, A4 landscape, in the same layout as the paper roster)
  - Print / Save as PDF
  - This week as `.json`
  - Full backup (all weeks + staff) as `.json`

Keyboard: click a cell, then use the arrow keys to move, **Enter** to edit and **Delete** to clear.

## Install as an app (PWA)

The app is a Progressive Web App. Once it's hosted over HTTPS:

- **Android / Chrome / Edge (desktop):** click **Install app** in the toolbar, or use the browser menu → *Install app* / *Add to Home screen*.
- **iPhone / iPad (Safari):** tap **Share → Add to Home Screen**.

After the first visit it works **fully offline**. Rosters are kept on the device (localStorage), and the app asks the browser to keep that storage from being cleared automatically.

> Each installed copy and each browser keeps **its own** data (on iOS, the home-screen app and Safari don't share storage). To move a roster between devices, use **Download → Full backup** and **Upload** it on the other device.

## Deploy (free)

The app is plain static files with no build step: `index.html`, `sw.js`, `manifest.webmanifest`, `icons/`.

- **Vercel:** *Add New → Project* → import this GitHub repo → Framework preset **Other**, no build command, output directory `.` → Deploy. `vercel.json` sets the cache headers.
- **Netlify:** *Add new site → Import from Git* → pick the repo. The build settings come from `netlify.toml` (publish `.`). Or drag-and-drop the folder onto app.netlify.com/drop.
- **GitHub Pages:** *Settings → Pages* → deploy from branch, folder `/ (root)`. All paths are relative, so a sub-path like `/routine-maker/` works.
- **Cloudflare Pages** (or any static host) works the same way.

**When you change files**, bump `VERSION` in `sw.js` (e.g. `v1` → `v2`). Users then see a *"A new version is available — Reload"* prompt.

Run locally: `python3 -m http.server` and open http://localhost:8000. The service worker needs `http(s)://`, so opening the file directly works but stays online-only.
