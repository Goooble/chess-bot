# Shute

A lightweight chess bot built in JavaScript with a minimal evaluation and search implementation. The UI is built with React.

Try it: https://chess-bot-rho.vercel.app/

## Installation

```bash
git clone git@github.com:Goooble/chess-bot.git
cd chess-bot
npm install
npm run dev
```

## Libraries

- **@react-chess-tools/react-chess-game** — used for game logic and board rendering
  (https://www.npmjs.com/package/@react-chess-tools/react-chess-game)
- **chess.js** — used to generate legal moves and validate game state
  (https://www.npmjs.com/package/chess.js)

## Search

- Negamax: a simplified minimax-based search
- Alpha–beta pruning: provides ~30% improvement in search time compared to no pruning
- Move ordering: captures first (MVV-LVA — Most Valuable Victim / Least Valuable Aggressor)
- Search depth: 3 (default)
  - Endgame: increased depth to 4
- Opening database: Lichess opening explorer (https://lichess.org/api#tag/opening-explorer/get/masters)

## Evaluation

- Material count
- Piece-square tables (PSQT)
