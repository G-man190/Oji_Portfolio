# Oji Cletus Portfolio (Static GitHub Pages Site)

A professional, recruiter-friendly portfolio website focused on Power BI projects, analytics case studies, and BI/AI product work.

This project is fully static (HTML, CSS, JS), data-driven through a single project file, and optimized for quick GitHub Pages deployment.

## Tech Stack Recommendation

Best-fit stack for your goals:

- HTML5 for structure
- CSS3 for design system and responsive layout
- Vanilla JavaScript for data rendering, project modal, filtering, and progressive interactions
- JSON (`data/projects.json`) as the single source of truth for project content

Why this is ideal:

- Fully static and GitHub Pages native
- No build pipeline required
- Easy maintenance and fast updates
- Clean handoff for non-framework environments

## Folder Structure

```text
Oji_Portfolio/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── images/
│       ├── favicon.svg
│       ├── og-preview.svg
│       └── projects/
│           ├── customer-retention.svg
│           ├── operations-kpi.svg
│           ├── placeholder-project.svg
│           └── sales-dashboard.svg
├── data/
│   ├── projects.json
│   └── projects.template.jsonc
├── js/
│   └── main.js
└── resume/
    ├── Oji_Cletus_CV.pdf
    └── README.txt
```

## Run Locally

Because this site fetches `data/projects.json`, run it with a local static server (do not open from `file://`).

### Option A: VS Code Live Server

1. Install Live Server extension.
2. Right-click `index.html`.
3. Choose **Open with Live Server**.

### Option B: Python

```bash
python -m http.server 5500
```

Then visit: `http://localhost:5500`

## How to Update Project Data

All project cards and case study modal content come from:

- `data/projects.json`

Edit or append project objects there.

If you run the site through a local server (recommended), this file is all you need.

If you open the site directly from file preview modes where JSON fetch can be blocked, run the sync script below after each edit so the fallback file stays current.

### Required Object Shape

```json
{
  "slug": "",
  "title": "",
  "summary": "",
  "image": "",
  "embedUrl": "",
  "reportUrl": "",
  "githubUrl": "",
  "tools": [],
  "category": "",
  "overview": "",
  "businessProblem": "",
  "objective": "",
  "process": "",
  "insights": "",
  "outcome": "",
  "challenges": "",
  "nextSteps": ""
}
```

## Exactly Where to Insert Power BI and Link Fields

Use `data/projects.json` and update these keys per project:

- `image`: local screenshot path, example `assets/images/projects/my-report.png`
- `embedUrl`: embeddable public Power BI URL for iframe
- `reportUrl`: public Power BI report URL for button links
- `githubUrl`: optional GitHub repository link

A commented reference template is provided in:

- `data/projects.template.jsonc`

## How to Replace Images

1. Save project screenshots into `assets/images/projects/`.
2. Use the exact filenames already mapped in `data/projects.json`:

- `hr-dashboard.png`
- `hr-metric-insights.png`
- `customer-satisfaction.png`
- `pharmacy-report.png`
- `customer-loyalty.png`
- `christmas-sales-analysis.png`
- `titanic-exploratory-analysis.png`
- `wine-exploratory-analysis.png`
- `real-estate-linear-regression.png`
- `automated-excel-etl-pipeline.png`

3. If you prefer a different file name, update the matching `image` field in `data/projects.json`.

The UI applies a consistent 16:9 crop and has a fallback image if a file is missing.

## How to Add a New Power BI Project

1. Copy an existing object in `data/projects.json`.
2. Update `slug` with a unique value (kebab-case preferred).
3. Fill title, summary, tools, category, and case study fields.
4. Add screenshot to `assets/images/projects/` and set `image`.
5. Add `embedUrl` if available; if empty, the modal automatically shows a **View Report** button.
6. Add optional `githubUrl` if applicable.
7. Save and refresh the page.

No redesign or code edits required.

## Sync Fallback Data (Optional but Recommended)

This portfolio includes `data/projects.js` as a fallback when `fetch` to `data/projects.json` is blocked (for example, some `file://` preview contexts).

After editing `data/projects.json`, run one of these:

### PowerShell

```powershell
powershell -ExecutionPolicy Bypass -File scripts/sync-projects.ps1
```

### Double-click helper

Run:

`scripts/sync-projects.cmd`

You should see: `Synced data/projects.js from data/projects.json`

## GitHub Pages Deployment

### Step 1: Push this folder to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/G-man190/Oji_Portfolio.git
git push -u origin main
```

### Step 2: Enable Pages

1. Open your GitHub repository.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Save.

### Step 3: Access Site

Your site will be available at:

`https://g-man190.github.io/Oji_Portfolio/`

## Customization Checklist

- Update social links in `index.html` (LinkedIn and GitHub)
- Replace placeholder email in `index.html`
- Add your real resume PDF to `resume/Oji_Cletus_CV.pdf`
- Replace or refine project narrative text in `data/projects.json` as needed
- Optionally update `og:url` in `index.html` after deployment

## Accessibility and UX Notes

- Keyboard-accessible navigation and controls
- Focus-visible styles for buttons and links
- Mobile-first responsive card and modal behavior
- Smooth scroll and subtle reveal animations

## License

Personal portfolio use.
