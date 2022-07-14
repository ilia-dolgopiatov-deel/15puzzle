import React, { useState } from "react";
import { GameGrid, generateGrid } from "./utils";
import Puzzle from "./Components/Puzzle";

function App() {
  const [initialGrid, setInitialGrid] = useState<GameGrid>();
  const [isSolvable, setIsSolvable] = useState<boolean>(true);

  const newGame = (ensureSolvable: boolean = true) => {
    const { result, isSolvable } = generateGrid(ensureSolvable);
    setInitialGrid(result);
    setIsSolvable(isSolvable);
  };

  if (!initialGrid) {
    return (
      <div className="App">
        <div className="puzzle">
          <div className="menu">
            <button
              className="button button-random"
              onClick={() => newGame(false)}
            >
              Generate random
            </button>
            <button
              className="button button-valid"
              onClick={() => newGame(true)}
            >
              Generate valid
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Puzzle initialGrid={initialGrid} isSolvable={isSolvable} />
    </div>
  );
}

export default App;
