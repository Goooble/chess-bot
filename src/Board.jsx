import { ChessGame } from "@react-chess-tools/react-chess-game";
import { botMove, evaluate } from "./master";
import { useEffect } from "react";
const startfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// const startfen = "6k1/pp4p1/2p5/2bp4/8/P5Pb/1P3rrP/2BRRN1K b - - 0 1";

export default function Board({ engine }) {
  useEffect(() => {
    if (!engine.info.isGameOver) {
      if (engine.info.turn != engine.orientation) {
        setTimeout(async () => {
          const move = await botMove(engine);
          engine.methods.makeMove({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
        }, 0);
      }
    }
  }, [engine]);
  //displays score of the position
  // const played = engine.info.turn === "w" ? "b" : "w";
  // console.log(played + evaluate(engine.game.board()));
  // console.log(engine);
  let result;
  if (engine.info.isGameOver) {
    result = isGameOver(engine);
  }
  let evaluation = evaluate(engine.game.board());
  return (
    <>
      <div>{result}</div>
      <div className="w-4/5 lg:w-2/5">
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
      <div>{evaluation}</div>
    </>
  );
}

function isGameOver(engine) {
  const info = engine.info;
  let orientation = engine.orientation === "w" ? "White" : "Black";
  if (info.hasPlayerWon || info.hasPlayerLost) {
    return info.hasPlayerWon ? orientation + " Won!" : orientation + " Lost!";
  } else {
    return "Draw!";
  }
}
