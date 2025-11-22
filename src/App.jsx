import { ChessGame } from "@react-chess-tools/react-chess-game";
import "./App.css";
import Menu from "./Menu";

function App() {
  return (
    <div className="flex items-center flex-col gap-5">
      <ChessGame.Root>
        <div className="w-2/5">
          <ChessGame.Board />
        </div>
        <Menu></Menu>
      </ChessGame.Root>
    </div>
  );
}

export default App;
