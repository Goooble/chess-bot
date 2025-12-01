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
  return moves[Math.floor(Math.random() * moves.length)];
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
