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

Pushing to `main` triggers `.github/workflows/deploy.yml`, which lints, type-checks, builds, and publishes `dist/` to GitHub Pages. The `base` path in `vite.config.ts` (`/pomodoro-timer/`) must match the repository name.

## License

MIT
