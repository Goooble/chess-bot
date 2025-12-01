export function botMove(engine) {
  const chess = engine.game;
  //   console.log(chess.moves()[0]);
  const moves = chess.moves({ verbose: true });
  //   move = moves[0];
  const move = moves[Math.floor(Math.random() * moves.length)];
  engine.methods.makeMove({
    from: move.from,
    to: move.to,
    promotion: move.promotion,
  });
}
