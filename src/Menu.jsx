import { useChessGameContext } from "@react-chess-tools/react-chess-game";

const startfen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const matefen = "";

export default function Menu() {
  const master = useChessGameContext();
  const game = master.game;
  console.log(master);

  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          master.methods.setPosition(startfen, "b");
        }}
      >
        Reset
      </button>
      <button
        onClick={() => {
          master.methods.flipBoard();
        }}
      >
        Flip Board
      </button>
    </div>
  );
}
