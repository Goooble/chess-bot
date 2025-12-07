import { Chess } from "chess.js";
import pst from "./PSQT";

const points = {
  p: 100,
  n: 300,
  b: 300,
  r: 600,
  q: 900,
  k: 0,
};

function sanToVerbose(engine, san) {
  const moves = engine.moves({ verbose: true });
  let verbose = moves.find((move) => {
    return move.san === san;
  });
  return verbose;
}

let isOpening = true;
export async function botMove(engine) {
  const begin = performance.now();
  let bestMove;
  const fen = engine.game.fen();
  const searchEngine = new Chess(fen); //messes up three fold repitition lol i think? verify
  let result;
  if (isOpening) {
    try {
      result = await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`);
      if (!result.ok) {
        bestMove = search(searchEngine);
      } else {
        result = await result.json();
        if (result.moves.length === 0) {
          isOpening = false;
          bestMove = search(searchEngine);
        } else {
          bestMove = sanToVerbose(searchEngine, result.moves[0].san);
        }
      }
    } catch (e) {
      bestMove = search(searchEngine);
    }
  } else {
    bestMove = search(searchEngine);
  }

  const end = performance.now();
  return { bestMove, nodes, time: end - begin };
  // return moves[Math.floor(Math.random() * moves.length)];
}

//search
let nodes = 0;
let depth = 2;
function search(chess) {
  if (depth < 3) {
    if (isEndGame(chess.board())) {
      depth = 3;
    }
  }

  nodes = 0;
  const moves = chess.moves({ verbose: true });
  moveOrdering(moves);
  let bestMoves = [];
  let maxScore = -Infinity;
  for (let element of moves) {
    chess.move({
      from: element.from,
      to: element.to,
      promotion: element.promotion,
    });
    let score = -1 * negaMax(chess, depth, -Infinity, Infinity);
    if (score > maxScore) {
      bestMoves.length = 0;
      maxScore = score;
    }
    if (score === maxScore) {
      bestMoves.push(element);
    }

    chess.undo();
  }
  console.log("Best Score: " + maxScore);
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function negaMax(chess, depth, alpha, beta) {
  //for checkmate, it just returns default maxscore -infinity as no new moves are evaluated
  if (!chess.in_checkmate() && chess.game_over()) {
    return 0;
  }
  if (chess.in_checkmate()) return -Infinity;
  if (depth === 0) {
    nodes++;
    let turn = chess.turn() === "w" ? 1 : -1;
    let valuation = evaluate(chess.board());

    return valuation * turn;
  }

  //search
  const moves = chess.moves({ verbose: true });
  moveOrdering(moves);
  let maxScore = -Infinity;
  for (let element of moves) {
    chess.move({
      from: element.from,
      to: element.to,
      promotion: element.promotion,
    });
    let score = -1 * negaMax(chess, depth - 1, -1 * beta, -1 * alpha);
    chess.undo();
    if (score > alpha) {
      alpha = score;
    }
    if (alpha > beta) break;
    if (score > maxScore) {
      maxScore = score;
    }
  }
  return alpha;
}

//Evaluation:
export function evaluate(board) {
  return material(board);
}

function pstEval(piece, color, i, j, isEnd) {
  // choose the correct PST table
  let table;

  if (piece === "k") {
    table = isEnd ? pst.KING_EG : pst.KING_MG;
  } else if (piece === "p") {
    table = isEnd ? pst.P_EG : pst.P_MG;
  } else {
    // other pieces use a single PST
    table = pst[piece];
  }

  // apply orientation
  if (color === "w") {
    return table[i][j];
  } else {
    return table[7 - i][j];
  }
}

function isEndGame(board) {
  const weights = {
    q: 4,
    r: 2,
    b: 1,
    n: 1,
  };
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];

      if (!square) {
        continue;
      }
      if (square.type !== "k" && square.type !== "p") {
        sum += weights[square.type];
      }
    }
  }
  if (sum <= 8) return true;
  else return false;
}

function material(board) {
  const isEnd = isEndGame(board);

  let black = 0;
  let white = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];

      if (!square) {
        continue;
      }
      if (square.color === "w") {
        white += points[square.type] + pstEval(square.type, "w", i, j, isEnd);
      } else {
        black += points[square.type] + pstEval(square.type, "b", i, j, isEnd);
      }
    }
  }
  return white - black;
}

function moveOrdering(moves) {
  function mvvlva(move) {
    if (!move.flags.includes("c")) return 0;
    let victim = move.captured;
    let attacker = move.piece;

    return points[victim] * 10 - points[attacker];
  }
  moves.sort((a, b) => mvvlva(b) - mvvlva(a));
}
