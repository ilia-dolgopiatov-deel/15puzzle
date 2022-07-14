import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import Draggable, { DraggableEventHandler } from "react-draggable";
import { GameGrid, getDraggableParams, updateGrid } from "../../utils";
import './index.css';


const GridContext = React.createContext<GameGrid | null>(null);

const GridItem: React.FC<{
  row: number;
  column: number;
  onStart?: DraggableEventHandler;
  onStop?: DraggableEventHandler;
}> = ({ row, column, onStart, onStop }) => {
  const grid = useContext(GridContext);

  if (!grid) {
    throw new Error("Grid context is null");
  }

  const value = grid[row][column];

  if (value === null) {
    return <div className="empty" />;
  }

  const { axis, bounds } = getDraggableParams(grid, row, column);

  if (axis === "none") {
    return <div className="item">{value}</div>;
  }

  return (
    <Draggable
      key={Math.random()}
      axis={axis}
      bounds={bounds}
      scale={1}
      onStart={onStart}
      onStop={onStop}
    >
      <div className="item">{value}</div>
    </Draggable>
  );
};

const Grid: React.FC<{
  initialGrid: GameGrid;
  onMove: Dispatch<SetStateAction<number>>;
}> = ({ initialGrid, onMove }) => {
  const [grid, setGrid] = useState<GameGrid>(initialGrid);
  const ref = useRef({ x: 0, y: 0 });

  const handleStart: DraggableEventHandler = (e, { x, y }) => {
    ref.current.x = x;
    ref.current.y = y;
  };

  const handleDrag: DraggableEventHandler = (e, data) => {
    const { x, y } = data;
    const deltaX = ref.current.x + x;
    const deltaY = ref.current.y + y;

    if (deltaX || deltaY) {
      const el = Number(data.node.textContent);
      const newGrid = updateGrid(grid, el, deltaX, deltaY);
      if (newGrid !== grid) {
        setGrid(newGrid);
        onMove((moves) => moves + 1);
      }
    }
  };

  return (
    <GridContext.Provider value={grid}>
      {grid.map((row, rIdx) => (
        <div className="row" key={rIdx}>
          {row.map((_, cIdx) => (
            <GridItem
              key={_ || "empty"}
              row={rIdx}
              column={cIdx}
              onStart={handleStart}
              onStop={handleDrag}
            />
          ))}
        </div>
      ))}
    </GridContext.Provider>
  );
};

export default Grid;
