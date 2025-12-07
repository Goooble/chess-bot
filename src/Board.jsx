import { ChessGame } from "@react-chess-tools/react-chess-game";
import { botMove, evaluate } from "./master";
import { useEffect } from "react";
import { useState } from "react";
const startfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
// const startfen = "6k1/pp4p1/2p5/2bp4/8/P5Pb/1P3rrP/2BRRN1K b - - 0 1";

function resetStats(stats = []) {
  stats.forEach((set) => {
    set(0);
  });
}

export default function Board({ engine }) {
  const [evaluatedPositions, setEvaluatedPositions] = useState(0);
  const [totalPositions, setTotalPositions] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [isStock, setIsStock] = useState(false);
  const [stockEval, setStockEval] = useState(0);
  // const [depth, setDepth] = useState(1); //stockfish depth

  useEffect(() => {
    //stockfish
    async function getMove() {
      let res = await fetch("https://chess-api.com/v1", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ fen: engine.game.fen(), depth: 12 }),
      });
      res = await res.json();
      // console.log(res);
      engine.methods.makeMove(res.san);
      setStockEval(res.eval);
    }
    //
    if (isStock) {
      if (!engine.info.isGameOver) {
        if (engine.info.turn == engine.orientation) {
          getMove();
        }
      }
    }

    //botmove
    if (!engine.info.isGameOver) {
      if (engine.info.turn != engine.orientation) {
        setTimeout(async () => {
          const { bestMove: move, nodes, time } = await botMove(engine);
          engine.methods.makeMove({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
          setTimeTaken(time);
          setTotalTimeTaken(timeTaken + time);
          setEvaluatedPositions(nodes);
          setTotalPositions(totalPositions + nodes);
        }, 0);
      }
    }
  }, [engine, isStock]); //its crying but meh should be fine

  //displays score of the position
  // const played = engine.info.turn === "w" ? "b" : "w";
  // console.log(played + evaluate(engine.game.board()));
  // console.log(engine);

  let result; //who won

  //calculating total bot moves - this was builtin with chess.js T_T
  let totalBotMoves;
  let totalMoves = engine.info.moveNumber; //in the game
  if (engine.orientation === "w") {
    totalBotMoves = Math.floor(totalMoves / 2);
  } else {
    totalBotMoves = Math.ceil(totalMoves / 2);
  }

  //checking for game over
  if (engine.info.isGameOver) {
    result = isGameOver(engine);
  }
  //getting current board evaluation
  let evaluation = evaluate(engine.game.board()) / 100;

  //stats to reset
  const resetStates = [
    setEvaluatedPositions,
    setTotalPositions,
    setTimeTaken,
    setTotalTimeTaken,
    setIsStock,
    setStockEval,
  ];
  return (
    <>
      <div>{result}</div>
      <div>move: {engine.info.moveNumber}</div>
      <div className="absolute top-5 left-5">
        <div>Positions evaluated: {evaluatedPositions} </div>
        <div>
          Average positions evaluated per move:
          {Math.floor(totalPositions / totalBotMoves)}
        </div>
        <div>Time Taken: {Math.floor(timeTaken) / 1000}s </div>
        <div>
          Avg Time Taken: {Math.floor(totalTimeTaken / totalBotMoves)}ms{" "}
        </div>
        <div>Current Eval: {evaluation}</div>
        <div>Stockfish Eval: {stockEval}</div>
      </div>
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
            resetStats(resetStates);
          }}
        >
          Reset
        </button>
        <button
          onClick={() => {
            const orientation = engine.orientation === "w" ? "w" : "b";
            engine.methods.setPosition(startfen, orientation);
            engine.methods.flipBoard();
            resetStats(resetStates);
          }}
        >
          Flip Board
        </button>
        <div>
          <button
            onClick={() => {
              setIsStock(!isStock);
              setStockEval(0);
            }}
          >
            Stockfish vs Shute
          </button>
          {/* Depth: {depth} */}
        </div>
      </div>
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
