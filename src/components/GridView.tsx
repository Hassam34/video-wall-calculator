'use client';

import { WallConfiguration } from '@/types/calculator';

interface GridViewProps {
  configuration: WallConfiguration;
  label: string;
}

export default function GridView({ configuration, label }: GridViewProps) {
  const { columns, rows } = configuration;
  
  // Create array of squares for the grid
  const totalSquares = columns * rows;
  const squares = Array.from({ length: totalSquares }, (_, index) => ({
    id: index,
    row: Math.floor(index / columns),
    col: index % columns,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{label}</h3>
      
      <div className="flex flex-col items-center gap-3">
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${columns}, 20px)`,
          }}
        >
          {squares.map((square) => (
            <div
              key={square.id}
              className="w-5 h-5 bg-blue-500 border border-blue-700 rounded-sm"
              title={`Row ${square.row + 1}, Column ${square.col + 1}`}
            />
          ))}
        </div>
        
        <p className="text-sm text-gray-600">
          {rows} rows × {columns} columns ({totalSquares} cabinets)
        </p>
      </div>
    </div>
  );
}
