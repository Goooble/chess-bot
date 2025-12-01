import { ChessGame } from "@react-chess-tools/react-chess-game";
const startfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function isGameOver(engine) {
  const info = engine.info;
  console.log(engine.orientation);
  let orientation = engine.orientation === "w" ? "White" : "Black";
  if (info.isGameOver) {
    if (info.hasPlayerWon || info.hasPlayerLost) {
      return info.hasPlayerWon ? orientation + " Won!" : orientation + " Lost!";
    } else {
      return "Draw!";
    }
  }
}

export default function Board({ engine }) {
  console.log(engine);
  let result = isGameOver(engine);

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
            engine.methods.setPosition(startfen, "b");
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            engine.methods.flipBoard();
          }}
        >
          Flip Board
        </button>
      </div>
    </>
  );
}
