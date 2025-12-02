import { Chess } from "chess.js";

const points = {
  p: 100,
  n: 300,
  b: 300,
  r: 600,
  q: 900,
  k: 0,
};

export function botMove(engine) {
  const chess = engine.game;
  const board = chess.board();
  // let score = evaluate(board) / 100;
  // console.log(score);
  const moves = chess.moves({ verbose: true });
  const searchEngine = Chess(engine.currentFen);
  const bestMove = search(searchEngine);
  return bestMove;
  // return moves[Math.floor(Math.random() * moves.length)];
}

//search
function search(chess) {
  const moves = chess.moves({ verbose: true });
  let bestMove = moves[0];
  let maxScore = -Infinity;
  moves.forEach((element) => {
    chess.move(element.san);
    let score = -1 * negaMax(chess, 2);
    if (score > maxScore) {
      maxScore = score;
      bestMove = element;
    }
    chess.undo();
  });
  console.log("Best Score: " + bestMove);
  return bestMove;
}

function negaMax(chess, depth) {
  if (depth === 0) {
    let turn = 1;
    if (chess.turn === "b") turn = -1;
    let valuation = evaluate(chess.board());

    return valuation * turn;
  }
  const moves = chess.moves({ verbose: true });
  let maxScore = -Infinity;
  moves.forEach((element) => {
    chess.move(element.san);
    let score = -1 * negaMax(chess, depth - 1);
    if (score > maxScore) {
      maxScore = score;
    }
    chess.undo();
  });
  return maxScore;
}

//Evaluation:
export function evaluate(board) {
  return material(board);
}

function material(board) {
  let black = 0;
  let white = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];

      if (!square) {
        continue;
      }
      if (square.color === "w") {
        white += points[square.type];
      } else {
        black += points[square.type];
      }
    }
  }
  return white - black;
}
