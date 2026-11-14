import { useEffect, useState } from 'react';

import Cell from './cell';
import { Color, Mode } from './colors';

type Props = Readonly<{
  selectedColor: Color;
  initialRows?: number;
  initialColumns?: number;
  mode: Mode;
}>;

export default function Canvas({
  selectedColor,
  mode,
  initialRows = 15,
  initialColumns = 15,
}: Props) {
  const [grid, setGrid] = useState<(Color | null)[][]>(
    Array.from({ length: initialRows }, () => Array(initialColumns).fill(null)),
  );
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    function endDragging() {
      setIsDragging(false);
    }

    window.addEventListener('pointerup', endDragging);
    window.addEventListener('pointercancel', endDragging);
    window.addEventListener('blur', endDragging);

    return () => {
      window.removeEventListener('pointerup', endDragging);
      window.removeEventListener('pointercancel', endDragging);
      window.removeEventListener('blur', endDragging);
    };
  }, []);

  return (
    <div className="grid" aria-label="Pixel art canvas" role="group">
      {grid.map((row, rowIndex) => (
        <div
          className={[
            'grid__row',
            rowIndex % 2 === 0 ? 'grid__row--even' : 'grid__row--odd',
          ].join(' ')}
          key={rowIndex}>
          {row.map((cellColor, cellIndex) => (
            <Cell
              key={cellIndex}
              color={cellColor}
              column={cellIndex + 1}
              isDragging={isDragging}
              onDragStart={() => setIsDragging(true)}
              onMark={() => {
                const newGrid = grid.map((row) => [...row]);
                newGrid[rowIndex][cellIndex] =
                  mode === 'erase' ? null : selectedColor;
                setGrid(newGrid);
              }}
              row={rowIndex + 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
