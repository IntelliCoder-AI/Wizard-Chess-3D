# ♟️ Wizard Chess 3D

An interactive **3D chess game** set inside a Gothic cathedral, featuring sculpted chess pieces, cinematic captures, animated effects, and a built-in computer opponent. Play in your browser and explore the board from multiple camera angles.

## ✨ Features

- **Immersive 3D environment** — Gothic cathedral setting, a detailed chessboard, and sculpted pieces.
- **Interactive chess gameplay** — select pieces and choose legal moves directly on the board.
- **Built-in chess AI** — play against a computer opponent or trigger the next AI move manually.
- **Cinematic animations** — animated captures, stone-shatter effects, and an endgame presentation.
- **Multiple camera views** — player, overhead, side, and wide cathedral views.
- **Desktop and touch controls** — orbit, pan, and zoom around the game.
- **Switch sides and restart** — play as White or Black and begin a new game whenever you like.

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| React 19 + TypeScript | Application UI |
| Three.js | 3D rendering, scene, and animations |
| Vite 8 | Development server and production build |
| HTML + CSS | Game HUD and responsive layout |
| JavaScript | Chess rules and built-in AI logic |

## 🚀 Run Locally — Step by Step

### Step 1: Install the prerequisites

Make sure you have:

- **Git** — [Download Git](https://git-scm.com/downloads)
- **Node.js** — install a supported version: **20.19+ or 22.12+** (a current LTS release is recommended). npm comes with Node.js. [Download Node.js](https://nodejs.org/)
- A modern browser with **WebGL** support (Chrome, Edge, Firefox, etc.)
- A code editor such as [Visual Studio Code](https://code.visualstudio.com/) (recommended)

Check the installed versions by opening a terminal:

```bash
node -v
npm -v
git --version
```

### Step 2: Clone the GitHub repository

Open **Terminal**, **PowerShell**, or the **VS Code terminal** and run:

```bash
git clone https://github.com/YOUR_USERNAME/wizard-chess-3d.git
```

**Important:** Replace `YOUR_USERNAME` (and the repository name, if different) with the actual GitHub repository URL. You can copy it using your repo's green **Code → HTTPS** button.

Move into the downloaded project:

```bash
cd wizard-chess-3d
```

### Step 3: Install project dependencies

```bash
npm install
```

This installs the required packages from `package.json`, including React, Three.js, Vite, and the Google Gen AI SDK.

### Step 4: Create the `.env` file

In the **root of the project** (the same folder as `package.json` and `vite.config.ts`), create a new file named exactly:

```text
.env
```

**Use `.env`, not `.evn` or `.env.txt`.**

To create the file using the terminal:

**Windows PowerShell:**

```powershell
New-Item -Path .env -ItemType File
notepad .env
```

**macOS / Linux:**

```bash
touch .env
```

Or create `.env` using the VS Code file explorer.

### Step 5: Get your Gemini API key

1. Open [Google AI Studio — API Keys](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Create an API key or use an existing key you control.
4. Copy your key.

Google API key access, limits, and billing depend on your Google AI Studio / API account.

### Step 6: Add the Gemini API key to `.env`

Open your `.env` file and add:

```dotenv
GEMINI_API_KEY=PASTE_YOUR_GEMINI_API_KEY_HERE
```

Replace `PASTE_YOUR_GEMINI_API_KEY_HERE` with your actual key and save the file.

Your folder should now look similar to this:

```text
wizard-chess-3d/
├── .env                    # Your local key — do NOT commit
├── .gitignore
├── index.html
├── package.json
├── vite.config.ts
├── public/
│   └── assets/glb/         # Compressed 3D models
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── styles.css
│   └── wizardChessEngine.js
└── test/
    └── applet.test.mjs
```

> **Important:** The current game uses its **built-in chess AI**, not Gemini API calls. The project's `vite.config.ts` reads `GEMINI_API_KEY`, but the present gameplay does not require a working Gemini key. The setup above prepares the existing environment configuration for future Gemini functionality.

### Step 7: Start the development server

```bash
npm run dev
```

When Vite starts, open:

**http://localhost:3000/**

The game should load in your browser. The first load may take a little longer because it loads the 3D assets.

### Step 8: Play the game

- Click or tap a chess piece to select it, then choose a highlighted destination.
- Play your moves against the built-in computer opponent.
- Use **Play as Black** to change sides, **AI Move** to trigger a computer move, and **New Game** to restart.
- Change the camera using **Player Cam**, **Overhead**, **Side**, or **Cathedral**.

To stop the local server, return to the terminal and press **Ctrl + C**.

## 🎮 Controls

| Action | Desktop | Touch / Mobile |
| --- | --- | --- |
| Select piece / move | Click a piece, then a destination | Tap a piece, then a destination |
| Orbit camera | Left-click + drag | One-finger drag |
| Pan camera | Right-click + drag | Two-finger drag |
| Zoom | Mouse wheel | Pinch |
| Fly camera | `W`, `A`, `S`, `D` | — |
| Move camera up / down | `R` / `F` | — |
| Hide / show game UI | `H` | Use the Show UI / Controls buttons |

On smaller screens, tap **Controls** to reveal the game and camera buttons.

## 📦 Available Commands

Run these commands from the project root:

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Run the development server at `http://localhost:3000` |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the built app locally (Vite normally uses port `4173`) |
| `npm run lint` | Run the TypeScript check (`tsc --noEmit`) |
| `node --test test/applet.test.mjs` | Run the included HUD and 3D asset tests |

To test the production build:

```bash
npm run build
npm run preview
```

**Port 3000 is already in use**  
Run the dev server on a different port:

```bash
npm run dev -- --port 3001
```

Then visit `http://localhost:3001/`.

**The AI works even without a Gemini key**  
That is expected. The current chess opponent runs using built-in chess logic; it does not require a Gemini API call.

## 📁 Project Structure

```text
public/assets/glb/       3D cathedral and chess-piece assets
src/App.tsx              React game interface
src/main.tsx             React entry point
src/styles.css           UI and responsive styles
src/wizardChessEngine.js Three.js scene, game logic, and chess AI
vite.config.ts           Vite setup and local environment configuration
test/applet.test.mjs     Automated asset and HUD checks
```

---

**Made for the browser.** Clone the project, install dependencies, create your `.env`, and start playing at `http://localhost:3000/`.
