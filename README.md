# 🔥 Las Fallas Countdown Website

A fully featured countdown website for the Las Fallas festival in Valencia, Spain.

---

## 📁 File Structure

```
las-fallas/
├── index.html          ← Main page
├── css/
│   └── style.css       ← All styles (day/night themes)
├── js/
│   └── app.js          ← Countdown, fireworks, i18n, theme logic
├── data/
│   ├── images.json     ← Image metadata (edit this to update photo info)
│   └── translations.json  ← EN / ES / Valencian strings
└── images/
    ├── falla1.jpg      ← Replace with your own Fallas photos
    ├── falla2.jpg
    ├── falla3.jpg
    ├── falla4.jpg
    └── falla5.jpg
```

---

## 🖼️ Adding / Replacing Images

1. Drop your `.jpg` or `.webp` images into the `images/` folder.
2. Open `data/images.json` and add/edit entries:

```json
[
  {
    "filename": "my-photo.jpg",
    "title": "My Falla Monument",
    "location": "Ruzafa, Valencia",
    "date": "March 2024",
    "source": "My Camera",
    "photographer": "Your Name"
  }
]
```

The image displayed each day is selected by `currentDay % totalImages`,
so it rotates automatically — one image per day.

---

## 💻 Running Locally

Because the site uses `fetch()` to load JSON files, you need a local
web server (browsers block file:// CORS requests).

### Option A — Python (recommended, zero install if Python 3 is present)
```bash
cd las-fallas
python3 -m http.server 8080
# Open http://localhost:8080 in your browser
```

### Option B — Node.js (npx, no global install needed)
```bash
cd las-fallas
npx serve .
# Open the URL shown in your terminal
```

### Option C — VS Code Live Server
Install the **Live Server** extension, right-click `index.html` → "Open with Live Server".

---

## 🌐 Deploying Online for Free

### ── GitHub Pages (free, fast) ──────────────────────────────

1. Create a free account at https://github.com
2. Create a new **public** repository (e.g. `las-fallas`)
3. Upload all files (drag & drop in the GitHub UI, or use git):
   ```bash
   git init
   git add .
   git commit -m "Initial Las Fallas site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/las-fallas.git
   git push -u origin main
   ```
4. Go to **Settings → Pages → Source**: choose `main` branch, root `/`
5. Click **Save**. Your site will be live at:
   `https://YOUR_USERNAME.github.io/las-fallas`

⏱️ Takes ~2 minutes to go live after first push.

---

### ── Netlify (free, easiest drag & drop) ────────────────────

1. Go to https://netlify.com and sign up free.
2. Click **"Add new site" → "Deploy manually"**.
3. Drag your entire `las-fallas/` folder onto the upload area.
4. Netlify gives you a free URL instantly (e.g. `jolly-fallas-123.netlify.app`).
5. Optionally connect a custom domain for free.

✅ Netlify auto-handles CORS, HTTPS, and CDN for you.

---

### ── Cloudflare Pages (free, globally fast) ─────────────────

1. Push your code to GitHub (see above).
2. Go to https://pages.cloudflare.com → "Create a project".
3. Connect your GitHub repo, leave build settings blank (static site).
4. Deploy — globally distributed on Cloudflare's CDN.

---

## ✨ Features

| Feature | Description |
|---|---|
| ⏱️ Live Countdown | Days / Hours / Minutes / Seconds to next March 15 |
| 🖼️ Daily Background | Rotates automatically at midnight via `images.json` |
| 📷 Image Info Modal | Click the camera icon or bottom-right bar for photo metadata |
| 🎆 Cremà Fireworks | Canvas particle fireworks when the festival starts (Mar 15–19) |
| 🌗 Day / Night Theme | Toggle between warm red/gold (day) and deep purple/orange (night) |
| 🌍 3 Languages | English / Spanish / Valencian — saved to localStorage |
| 📜 History Section | Full history with timeline, key events, cultural significance |

---

## 🔧 Customisation Tips

- **Change festival date**: Edit `FALLAS_MONTH` and `FALLAS_DAY` in `js/app.js`
- **Add more languages**: Add a new key to `data/translations.json` and an `<option>` in `index.html`
- **Adjust fireworks colours**: Edit the `colors` array in `startFireworks()` in `app.js`
- **Change themes**: All colour variables are CSS custom properties in `:root` in `style.css`
