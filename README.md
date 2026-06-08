# 🍅 Pomodoro Timer

A clean, fast, fully client-side Pomodoro timer built with **React 19 + Vite 8** on the **OXC / Rolldown** toolchain. No backend, no tracking — everything lives in your browser via `localStorage`.

**Live demo:** https://dhunganasaroj3.github.io/pomodoro-timer/

## Features

- ⏱️ **Pomodoro loop** — focus / short break / long break with automatic cycling
- ⚙️ **Customizable durations** — set focus, break lengths, and rounds before a long break
- 🔁 **Auto-start** — optionally auto-start breaks and/or focus sessions
- 🔔 **Alerts** — Web Audio chime, optional final-seconds ticking, and desktop notifications
- ✅ **Tasks + stats** — track tasks, count completed pomodoros per task, and see today / all-time / total focus time
- 🌗 **Light / dark / system theme** — accent colour shifts per mode
- ⌨️ **Keyboard shortcuts** — `Space` start/pause · `R` reset · `S` skip
- 💾 **Persistent** — settings, tasks, stats, and the running timer survive a refresh
- ♿ Respects `prefers-reduced-motion`, live tab-title countdown, responsive layout

## Tech stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 (Rolldown bundler, OXC transform — no Babel) |
| Lint | [oxlint](https://oxc.rs) |
| Hosting | GitHub Pages via GitHub Actions |

## Development

```bash
npm install
npm run dev        # start dev server
npm run lint       # oxlint
npm run typecheck  # tsc --noEmit
npm run build      # production build to dist/
npm run preview    # preview the build locally
```

## Deployment

The site is published to **GitHub Pages** from the `gh-pages` branch (the built `dist/` output). To redeploy after changes:

```bash
npm run build
npx gh-pages -d dist        # or push the dist contents to the gh-pages branch
```

The `base` path in `vite.config.ts` (`/pomodoro-timer/`) must match the repository name.

> A ready-to-use GitHub Actions workflow lives at `ci/deploy.yml`. Move it to `.github/workflows/deploy.yml` and push (requires a token with the `workflow` scope) to switch to fully automated build-and-deploy on every push to `main`.

## License

MIT
