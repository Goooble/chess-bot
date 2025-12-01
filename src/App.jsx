import { ChessGame } from "@react-chess-tools/react-chess-game";
import "./App.css";
import { Game } from "./Game";

function App() {
  return (
    <div className="flex items-center flex-col gap-5">
      <ChessGame.Root>
        <Game></Game>
        {<ChessGame.Sounds />}
        {<ChessGame.KeyboardControls />}
      </ChessGame.Root>
    </div>
  );
}

export default App;
