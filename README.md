# 🌴 Retro Tasks — Cyber Dashboard

A neon, 80s-vaporwave **to-do list dashboard**. It's a fun way to track your tasks,
with a retro synthwave look, a built-in radio, live stats, and even a little arcade
game — all in one page.

Built with **React** and **Vite**.

---

## What can it do?

Everything lives on a single scrolling page with these sections:

- **My Task List** — add tasks, tick them off, or delete them.
- **Task Archive** — every task you complete is saved here with a timestamp.
- **System Stats** — a live clock, a "completion rate" and "productivity" bar that
  update as you finish tasks, and a drop-down **donut chart** showing done vs. remaining.
- **Synth Radio** — a cassette-style music player (press play for a synthwave track).
- **Neon Outrun** — a small arcade driving game. Press **Start**, dodge obstacles with
  the **arrow keys**, and rack up points.

**Fun extra:** click and drag any panel (or the top bar) and it stretches like rubber,
then wobbles back into place when you let go. The background also fades from a sunset
photo into a vaporwave video as you scroll.

---

## Try it on your own computer

You'll need [Node.js](https://nodejs.org) installed (it's free). Then, in this folder:

```bash
npm install     # download what the app needs (only the first time)
npm run dev     # start the app
```

The terminal will print a link like `http://localhost:5173` — open it in your browser.
To stop the app, press `Ctrl + C` in the terminal.

> **Note about the background:** two media files aren't included in this project:
> `miami4.jpg` (the sunset image) and `vaporwave1.mp4` (the video). Put them in a
> folder named `public/` to get the full look. The app still runs fine without them —
> you'll just see a black background.

---

## Put it online (free)

This project is set up to deploy to **[Vercel](https://vercel.com)** for free, which
gives you a public link like `https://retro-task-manager.vercel.app`.

```bash
npm i -g vercel   # install the Vercel tool (once)
vercel            # log in and set up the project (accept the defaults)
vercel --prod     # publish to your live link
```

The included `vercel.json` already tells Vercel how to build the site, so you can just
accept the detected settings.

---

## For developers

### Tech stack
- **React 18** (function components + hooks)
- **Vite 5** (dev server + build tool)
- Plain **CSS** (one global `src/styles.css`, no framework)
- No backend — it's a fully client-side single-page app. State lives in memory and
  resets on refresh.

### Scripts
```bash
npm run dev       # start the dev server (hot reload)
npm run build     # production build into dist/
npm run preview   # serve the built dist/ locally to test it
```

### Project structure
```
index.html                 # Vite entry point (mounts the React app)
vercel.json                # Deployment config for Vercel
src/
  main.jsx                 # React bootstrap (renders <App />)
  App.jsx                  # Root component + shared task/archive state (useReducer)
  styles.css               # Global synthwave theme
  hooks/
    useScrollTransition.js # Fades the background layers based on scroll position
    useRubberBand.js       # The click-drag "rubber/jelly" stretch + spring wobble
  components/
    Navbar.jsx             # Top bar; highlights the section you're viewing (scrollspy)
    VaporBackground.jsx    # CRT overlay + background video + dark dimmer layer
    TaskManager.jsx        # Add / complete / delete tasks
    StatsPanel.jsx         # Clock, progress bars, and the chart drop-down
    DonutChart.jsx         # <canvas> donut: completed vs. pending
    RadioPlayer.jsx        # Cassette-style audio player
    Arcade.jsx             # "Neon Outrun" <canvas> game (own animation loop)
    Archive.jsx            # List of completed tasks
```

### How the data flows
All task data is owned by `App.jsx` (via a `useReducer`) and passed down as props, so
every section stays in sync from one source of truth:

- `total = pending + completed`
- **Completion rate** = `completed / total`
- **Productivity level** = `min(20 + completed * 15, 100)`

Actions:
- **Add** → new task appears in *My Task List*.
- **Complete (tick)** → task is removed from the list and pushed into *Archive* with a
  timestamp; stats + chart update.
- **Delete** → task is removed and drops out of the totals.

The reducer is kept **pure** (no side effects inside it) so it behaves correctly under
React's StrictMode.

### Notable implementation details
- **`useRubberBand`** tracks pointer drags and applies a directional squash-and-stretch
  transform, then runs a small spring simulation (`requestAnimationFrame`) to wobble
  back to rest. It ignores drags that start on interactive controls (inputs, buttons,
  links, the game canvas) so those keep working normally.
- **`Arcade.jsx`** keeps all fast-changing game state in refs (not React state) so
  re-renders never disturb the game loop; only the score and button label are React
  state. The loop and key listeners are cleaned up on unmount.
- The **navbar highlight** uses an `IntersectionObserver` to detect which section is
  centered in the viewport.

### Adding a new section
1. Create a component in `src/components/`, e.g. `MyThing.jsx`, returning a
   `<section id="my-thing" className="dashboard-section">...</section>`.
2. Render it inside `<VaporBackground>` in `App.jsx`.
3. (Optional) Add a `{ href: '#my-thing', label: 'My Thing' }` entry to the `LINKS`
   array in `Navbar.jsx` so it appears in the top bar.
