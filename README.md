# Duty Roster (routine-maker)

A super lightweight, single-file web app for building a department's **weekly duty roster** (OT / station × day grid).

- **No install, no server, no dependencies.** Open `index.html` in a browser, or host it on any static host (GitHub Pages works).
- **Data lives in the browser's `localStorage`.** Download a backup now and then, because clearing browser data erases it.

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
