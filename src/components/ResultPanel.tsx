'use client';

import { WallConfiguration, Unit } from '@/types/calculator';
import { fromMm, formatValue } from '@/utils/unitConversion';

interface ResultPanelProps {
  configuration: WallConfiguration;
  unit: Unit;
  label: string;
}

export default function ResultPanel({ configuration, unit, label }: ResultPanelProps) {
  const widthInUnit = fromMm(configuration.width, unit);
  const heightInUnit = fromMm(configuration.height, unit);
  const diagonalInUnit = fromMm(configuration.diagonal, unit);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{label}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-600">Columns</div>
          <div className="text-2xl font-bold text-gray-800">{configuration.columns}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-600">Rows</div>
          <div className="text-2xl font-bold text-gray-800">{configuration.rows}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-600">Total Cabinets</div>
          <div className="text-2xl font-bold text-gray-800">{configuration.totalCabinets}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-600">Aspect Ratio</div>
          <div className="text-2xl font-bold text-gray-800">{configuration.aspectRatio}</div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-600">Width</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatValue(widthInUnit, unit)} {unit}
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-sm text-gray-600">Height</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatValue(heightInUnit, unit)} {unit}
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md col-span-2">
          <div className="text-sm text-gray-600">Diagonal</div>
          <div className="text-2xl font-bold text-gray-800">
            {formatValue(diagonalInUnit, unit)} {unit}
          </div>
        </div>
      </div>
    </div>
  );
}
