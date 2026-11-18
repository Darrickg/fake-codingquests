# CodingQuests concept site (Group Delta, SFU BUS 401)

A concept demo of what [CodingQuests](https://codingquests.io) could look like with our three
recommendations in place. **Not the real CodingQuests site.** It is a static site: no accounts,
no payments, no analytics, no third-party requests. Everything a visitor does is stored on their
own device (localStorage, falling back to memory when storage is blocked).

## Run it locally

Needs Node 20.19 or newer.

```bash
npm install
npm run dev          # http://localhost:5173
```

Other commands:

```bash
npm run typecheck    # TypeScript only
npm run build        # type check, then production build into dist/
npm run preview      # serve dist/ locally to check the production build
```

## Deploy to Vercel

Option A, from the command line:

```bash
npm install -g vercel
vercel login
vercel              # first run: accept the defaults (framework: Vite, output: dist)
vercel --prod       # publish the production URL
```

Option B, from the dashboard: push this folder to a GitHub repo, then in Vercel choose
**Add New, Project**, import the repo and keep the detected settings
(build command `npm run build`, output directory `dist`).

`vercel.json` rewrites every path to `index.html` so deep links like `/from/why-your-combat-feels-weak`
survive a refresh, and sends `X-Robots-Tag: noindex, nofollow`. `public/robots.txt` disallows
everything, and `index.html` has the noindex meta tags, so the concept never competes with the real site.

## Deploy to GitHub Pages

`.github/workflows/pages.yml` builds and publishes the site on every push to `main`.

1. In the repo on GitHub: **Settings, Pages, Build and deployment, Source: GitHub Actions**.
2. Push to `main` (or run the workflow from the **Actions** tab).
3. The site appears at `https://<user>.github.io/<repo-name>/`.

The workflow sets `BASE_PATH=/<repo-name>/` so assets and routes work under the subfolder, and
copies `index.html` to `404.html` so deep links survive a refresh (Pages has no rewrites).
Pages for a private repo needs a paid GitHub plan; on a free account make the repo public.

Two differences from Vercel: Pages cannot send the `X-Robots-Tag` header, and a `robots.txt`
inside `/<repo-name>/` is not read by crawlers. The `noindex, nofollow` meta tags in
`index.html` still apply to every page.

## Make the QR code for the slide

Once the site is live:

```bash
npm run qr -- https://your-project.vercel.app
```

This writes `presentation/qr.svg` and `presentation/qr.png` (1200 x 1200, black on white, with a
quiet zone). To land people on a video page instead, pass that URL, for example
`https://your-project.vercel.app/?from=why-most-top-down-movement-feels-bad`.

## Where to change names, prices and wording

Everything a teammate might change lives in `src/content/`. Components read from these files and
hard-code nothing.

| File | What is in it |
|---|---|
| `site.ts` | Team credit, concept bar text, the **`showExamplePriceTags`** flag, home page copy, About page, Realm, 404 |
| `plans.ts` | Plan names (Apprentice, Adventurer), monthly and yearly prices, what each opens, trial length, pricing FAQ, the poll, the leave flow |
| `packs.ts` | The three packs, their quests and prices, the bundle price, the **pack credit window** (`creditDays`), the "Which pack next?" candidates |
| `videos.ts` | The ten videos, the quest each lands on, what each offers next, the text pasted under a video |
| `pins.ts` | The three recommendations (name, why, what we would measure) and the one-line wording behind every "New" pin |
| `catalog.ts` | Campaigns, waypoints, shelves and quests as they exist today, plus level tags |
| `lessons.ts` | The playable lessons: GDScript, blanks, chip choices, hints, XP |

## What is where

- `src/lesson/` the playable lesson: simulation (`sim.ts`), canvas preview and pad (`Preview.tsx`), code panel with tap-to-fill blanks, the player.
- `src/art/` hand-drawn SVG: camp, campaign map, pack folios, video cards.
- `src/components/` layout and concept layer (concept bar, pins, sheets), commerce pieces (pack and plan cards, mock checkout, poll, vote board).
- `src/pages/` one file per route.

## Demo controls

Go to **Realm**. "View the site as" switches between Free, Apprentice, Adventurer and Guild Hall and
changes what shows as open or locked across the site. "Reset demo" clears everything. The leave flow
is at `/realm/leave` and is reachable from Realm when viewing as a member.
