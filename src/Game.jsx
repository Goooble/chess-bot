import { useChessGameContext } from "@react-chess-tools/react-chess-game";
import { ChessGame } from "@react-chess-tools/react-chess-game";
import Board from "./Board";
import { useState } from "react";

export function Game() {
  const engine = useChessGameContext();
  const [move, setMove] = useState(engine.info.moveNumber);
  const [gameState, setGameState] = useState({ ...engine.info });
  return (
    <>
      {/* <Master engine={engine}></Master> */}
      <Board engine={engine} gameState={gameState}></Board>
    </>
  );
}
