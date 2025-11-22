import { ChessGame } from "@react-chess-tools/react-chess-game";
import "./App.css";

function App() {
  return (
    <div className="flex justify-center">
      <ChessGame.Root>
        <div className="w-3/5">
          <ChessGame.Board />
        </div>
      </ChessGame.Root>
    </div>
  );
}

export default App;
