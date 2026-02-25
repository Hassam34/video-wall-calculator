'use client';

import { Unit, CabinetType, InputType, CalculatorInputs } from '@/types/calculator';
import { convertUnit } from '@/utils/unitConversion';

interface InputPanelProps {
  inputs: CalculatorInputs;
  activeInputs: InputType[];
  unit: Unit;
  cabinetType: CabinetType;
  onInputChange: (type: InputType, value: number | null) => void;
  onInputToggle: (type: InputType) => void;
  onUnitChange: (unit: Unit) => void;
  onCabinetTypeChange: (type: CabinetType) => void;
}

export default function InputPanel({
  inputs,
  activeInputs,
  unit,
  cabinetType,
  onInputChange,
  onInputToggle,
  onUnitChange,
  onCabinetTypeChange,
}: InputPanelProps) {
  const isInputDisabled = (type: InputType): boolean => {
    // If two inputs are already active and this one is not active, disable it
    return activeInputs.length >= 2 && !activeInputs.includes(type);
  };

  const handleInputChange = (type: InputType, value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    onInputChange(type, numValue);
  };

  const handleToggle = (type: InputType) => {
    if (activeInputs.includes(type)) {
      // If already active, deactivate it
      onInputChange(type, null);
      onInputToggle(type);
    } else if (activeInputs.length < 2) {
      // If less than 2 active, activate it
      onInputToggle(type);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Input Parameters</h2>
      
      {/* Cabinet Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cabinet Type
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => onCabinetTypeChange('16:9')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              cabinetType === '16:9'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            16:9 (600mm × 337.5mm)
          </button>
          <button
            onClick={() => onCabinetTypeChange('1:1')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              cabinetType === '1:1'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            1:1 (500mm × 500mm)
          </button>
        </div>
      </div>

      {/* Unit Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Unit
        </label>
        <div className="flex gap-2">
          {(['mm', 'meters', 'feet', 'inches'] as Unit[]).map((u) => (
            <button
              key={u}
              onClick={() => onUnitChange(u)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                unit === u
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Aspect Ratio */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={activeInputs.includes('aspectRatio')}
              onChange={() => handleToggle('aspectRatio')}
              disabled={isInputDisabled('aspectRatio')}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Aspect Ratio (16:9 preset)
            </label>
          </div>
          {activeInputs.includes('aspectRatio') && (
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
              16:9 (fixed preset)
            </div>
          )}
        </div>

        {/* Height */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={activeInputs.includes('height')}
              onChange={() => handleToggle('height')}
              disabled={isInputDisabled('height')}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Height ({unit})
            </label>
          </div>
          {activeInputs.includes('height') && (
            <input
              type="number"
              value={inputs.height ?? ''}
              onChange={(e) => handleInputChange('height', e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Width */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={activeInputs.includes('width')}
              onChange={() => handleToggle('width')}
              disabled={isInputDisabled('width')}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Width ({unit})
            </label>
          </div>
          {activeInputs.includes('width') && (
            <input
              type="number"
              value={inputs.width ?? ''}
              onChange={(e) => handleInputChange('width', e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        {/* Diagonal */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={activeInputs.includes('diagonal')}
              onChange={() => handleToggle('diagonal')}
              disabled={isInputDisabled('diagonal')}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Diagonal ({unit})
            </label>
          </div>
          {activeInputs.includes('diagonal') && (
            <input
              type="number"
              value={inputs.diagonal ?? ''}
              onChange={(e) => handleInputChange('diagonal', e.target.value)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Select exactly 2 inputs to calculate the video wall configuration.
      </p>
    </div>
  );
}
