import { useChessGameContext } from "@react-chess-tools/react-chess-game";
import { ChessGame } from "@react-chess-tools/react-chess-game";
import Board from "./Board";

export function Game() {
  const engine = useChessGameContext();
  return (
    <>
      {/* <Master engine={engine}></Master> */}
      <Board engine={engine}></Board>
    </>
  );
}
