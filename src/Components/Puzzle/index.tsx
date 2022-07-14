import React, { useState } from "react";
import cn from "classnames";
import { GameGrid } from "../../utils";
import Grid from "../Grid";
import "./index.css";

const Puzzle: React.FC<{
  initialGrid: GameGrid;
  isSolvable: boolean;
}> = ({ initialGrid, isSolvable }) => {
  const [moves, setMoves] = useState(0);

  return (
    <div
      className={cn("puzzle", {
        solvable: isSolvable,
        unsolvable: !isSolvable,
      })}
    >
      <Grid initialGrid={initialGrid} onMove={setMoves} />
      {moves ? <div className="moves">Moves: {moves}</div> : null}
    </div>
  );
};

export default Puzzle;
