# The Tea Atelier

A cosy, illustrated tea game and companion: an encyclopedia of 45 teas and infusions, a tasting journal, an illustrated cabinet with stock tracking, a brewing timer, a world atlas with passport stamps, a wishlist and a quiz academy.

It is a static web app with no server, no accounts and no build step. Once installed on a home screen it works fully offline.

## Files

Every file sits at the top level of the repository, with no subfolders:

```
index.html              the page
style.css               all styles (light and dark themes)
data.js                 encyclopedia, lessons, atlas and quiz content
app.js                  the app
sw.js                   service worker: caches the app for offline use
manifest.webmanifest    name, icons and colours for home-screen install
favicon.svg, icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png
.nojekyll               optional; tells GitHub Pages to serve files as they are
```

## Publish on GitHub Pages

1. Create a new repository on GitHub, for example `tea-atelier`.
2. Upload all the files to the root of the repository. The hidden `.nojekyll` file is optional; it's fine if your device skips it.
   - On github.com: **Add file → Upload files**, drag everything in, then **Commit changes**.
   - Or from a terminal:
     ```
     cd tea-atelier
     git init && git add . && git commit -m "The Tea Atelier"
     git branch -M main
     git remote add origin https://github.com/YOUR-NAME/tea-atelier.git
     git push -u origin main
     ```
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two the site is live at `https://YOUR-NAME.github.io/tea-atelier/`.

All paths are relative, so the app works at a repository subpath like this. GitHub Pages serves over HTTPS, which offline install requires.

## Install on iPhone or iPad

1. Open the GitHub Pages address in **Safari**.
2. Wait a few seconds for the "ready to use offline" message.
3. Tap **Share**, then **Add to Home Screen**, then **Add**.
4. Open the atelier from the home screen once while online. From then on it works without internet.

On Android Chrome and desktop Chrome or Edge, use the **Install** button on the hub or in Settings, or the install icon in the address bar.

**Important on iPhone and iPad:** the home-screen app keeps its own data, separate from Safari. If you already added teas in Safari, save a backup file there first (Settings → Save backup file), then open it in the installed app (Settings → Open a backup file).

## Your data

- Everything is saved automatically in the browser's storage on that device. The app asks the browser to keep this storage persistent.
- Nothing syncs between devices. Use **Settings → Save backup file** to keep a copy (for example in iCloud Drive via the Files app) and **Open a backup file** to restore or move to another device. You can also copy and paste the backup as text.
- Restoring keeps a copy of your previous data so you can undo one restore.
- Deleting the home-screen app, or clearing website data, deletes your records. Make backups. In the installed app, the hub reminds you when your last backup is more than 30 days old.
- Sample entries are marked "Sample" and can be removed in Settings.

## Updating the app

When you change any file, open `sw.js` and raise `VERSION` (for example `1.2.0` → `1.2.1`), then push. Installed copies download the new version in the background and show an **Update** button; tapping it reloads into the new version. Your records are untouched by updates. If you skip the version bump, installed copies keep running the old files.

## Fonts

The display and body typefaces (Fraunces and Alegreya Sans) load from Google Fonts on the first online visit and are then cached for offline use. If they have never loaded, the app falls back to Georgia and system sans-serif fonts and works the same. To remove the dependency on Google completely, download the font files, put them next to the other files, replace the Google Fonts `<link>` in `index.html` with `@font-face` rules in `style.css`, and add the files to `APP_SHELL` in `sw.js`.

## What works

| Area | Status |
| --- | --- |
| Illustrated atelier hub, seven rooms, time-of-day window, rank decorations | Working |
| Library: 45 teas, 7 science lessons, 6 tea cultures, search, filters, favourites | Working |
| Journal: add, edit, delete, flavour wheel, ratings, photos, compare two, flavour profile | Working |
| Cabinet: add, edit, archive, restore, delete; optional stock subtraction with low-stock warnings; grams and ounces | Working |
| Brewing Table: Western, gongfu, Japanese and cold brew; wall-clock timer that survives switching rooms; pause, resume, reset; infusions; chime | Working |
| Atlas: 14 regions, growing vs culture vs herbal origin, passport stamps | Working |
| Market: wishlist, priorities, status, move to cabinet | Working |
| Academy: 44 questions in 4 categories, explanations, XP, 5 ranks | Working |
| Offline use and home-screen install | Working |
| Backup file export and import with validation and undo | Working |

## Known limitations

- **Timer alerts:** the chime plays only while the app is open on screen. iPhone and iPad don't allow a web app to ring in the background without a push server, which this app deliberately doesn't use. The timer itself stays accurate, and shows "Ready to pour" when you come back.
- **Storage:** data is kept in the browser's local storage (with a request for persistent storage). Very large photo collections could reach the browser's storage limit; photos are shrunk before saving to reduce this.
- **No sync** between devices, by design for this version; use backup files.
- **Map:** the coastlines are deliberately simplified, hand-drawn style outlines. Region markers use real coordinates.
- **Caffeine** is described qualitatively, not as milligram figures, because real values vary too much with leaf and brewing.

## Content

Encyclopedia content lives in `data.js`, separate from user data. Each tea has a stable `id`; journal, cabinet and wishlist records reference that id and also keep their own copy of the tea's name, so editing or extending the content never rewrites anyone's history. To add a tea, copy an entry in `TEAS`, give it a new unique `id`, and raise `VERSION` in `sw.js`.
