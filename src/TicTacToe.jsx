function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value === "1u8" ? "X" : value === "2u8" ? "O" : ""}
    </button>
  );
}

export function Board({ squares, onPlay }) {
  async function handleClick(r, c) {
    await onPlay(r, c)
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares["r1"]["c1"]} onSquareClick={() => handleClick(1, 1)} />
        <Square value={squares["r1"]["c2"]} onSquareClick={() => handleClick(1, 2)} />
        <Square value={squares["r1"]["c3"]} onSquareClick={() => handleClick(1, 3)} />
      </div>
      <div className="board-row">
        <Square value={squares["r2"]["c1"]} onSquareClick={() => handleClick(2, 1)} />
        <Square value={squares["r2"]["c2"]} onSquareClick={() => handleClick(2, 2)} />
        <Square value={squares["r2"]["c3"]} onSquareClick={() => handleClick(2, 3)} />
      </div>
      <div className="board-row">
        <Square value={squares["r3"]["c1"]} onSquareClick={() => handleClick(3, 1)} />
        <Square value={squares["r3"]["c2"]} onSquareClick={() => handleClick(3, 2)} />
        <Square value={squares["r3"]["c3"]} onSquareClick={() => handleClick(3, 3)} />
      </div>
    </>
  );
}