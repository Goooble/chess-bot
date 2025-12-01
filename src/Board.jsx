import { ChessGame } from "@react-chess-tools/react-chess-game";
import { botMove } from "./master";
const startfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export default function Board({ engine }) {
  console.log(engine);
  let result;
  if (engine.info.isGameOver) {
    result = isGameOver(engine);
  } else {
    if (engine.info.turn != engine.orientation) {
      console.log("bot made a move");
      botMove(engine);
    }
  }

  return (
    <>
      <div>{result}</div>
      <div className="w-2/5">
        <ChessGame.Board
          options={{
            showNotation: true,
            animationDurationInMs: 300,
          }}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            const orientation = engine.orientation === "w" ? "w" : "b";
            engine.methods.setPosition(startfen, orientation);
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            const orientation = engine.orientation === "w" ? "w" : "b";
            engine.methods.setPosition(startfen, orientation);
            engine.methods.flipBoard();
          }}
        >
          Flip Board
        </button>
      </div>
    </>
  );
}

function isGameOver(engine) {
  const info = engine.info;
  console.log(engine.orientation);
  let orientation = engine.orientation === "w" ? "White" : "Black";
  if (info.hasPlayerWon || info.hasPlayerLost) {
    return info.hasPlayerWon ? orientation + " Won!" : orientation + " Lost!";
  } else {
    return "Draw!";
  }
}
