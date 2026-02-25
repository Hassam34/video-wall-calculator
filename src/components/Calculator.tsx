'use client';

import { useState, useEffect } from 'react';
import { Unit, CabinetType, InputType, CalculatorInputs, WallConfiguration } from '@/types/calculator';
import { calculateDimensions, findClosestConfigurations, findClosestConfigurationsByWidthAndDiagonal } from '@/utils/calculations';
import { convertUnit } from '@/utils/unitConversion';
import InputPanel from './InputPanel';
import ResultPanel from './ResultPanel';
import GridView from './GridView';

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    aspectRatio: null,
    height: null,
    width: null,
    diagonal: null,
  });
  
  const [activeInputs, setActiveInputs] = useState<InputType[]>([]);
  const [unit, setUnit] = useState<Unit>('mm');
  const [cabinetType, setCabinetType] = useState<CabinetType>('16:9');
  
  const [lowerConfig, setLowerConfig] = useState<WallConfiguration | null>(null);
  const [upperConfig, setUpperConfig] = useState<WallConfiguration | null>(null);

  // Handle input changes
  const handleInputChange = (type: InputType, value: number | null) => {
    setInputs((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  // Handle input toggling
  const handleInputToggle = (type: InputType) => {
    if (activeInputs.includes(type)) {
      // Remove from active inputs and clear value
      setActiveInputs((prev) => prev.filter((t) => t !== type));
      setInputs((prev) => ({
        ...prev,
        [type]: null,
      }));
    } else {
      // Add to active inputs (max 2)
      if (activeInputs.length < 2) {
        setActiveInputs((prev) => [...prev, type]);
        // Set default value for aspect ratio
        if (type === 'aspectRatio') {
          setInputs((prev) => ({
            ...prev,
            aspectRatio: 16 / 9,
          }));
        }
      }
    }
  };

  // Handle unit change with conversion
  const handleUnitChange = (newUnit: Unit) => {
    if (newUnit === unit) return;
    
    setInputs((prev) => {
      const converted: CalculatorInputs = {
        aspectRatio: prev.aspectRatio, // Aspect ratio doesn't change with unit
        height: prev.height ? convertUnit(prev.height, unit, newUnit) : null,
        width: prev.width ? convertUnit(prev.width, unit, newUnit) : null,
        diagonal: prev.diagonal ? convertUnit(prev.diagonal, unit, newUnit) : null,
      };
      return converted;
    });
    
    setUnit(newUnit);
  };

  // Calculate configurations when inputs change
  useEffect(() => {
    if (activeInputs.length !== 2) {
      setLowerConfig(null);
      setUpperConfig(null);
      return;
    }

    try {
      const dimensions = calculateDimensions(inputs, unit);
      
      // Check if we're using Width + Diagonal inputs
      const isWidthAndDiagonal = 
        activeInputs.includes('width') && activeInputs.includes('diagonal');
      
      const configurations = isWidthAndDiagonal
        ? findClosestConfigurationsByWidthAndDiagonal(
            dimensions.width,
            dimensions.diagonal,
            cabinetType
          )
        : findClosestConfigurations(
            dimensions.width,
            dimensions.height,
            cabinetType
          );
      
      setLowerConfig(configurations.lower);
      setUpperConfig(configurations.upper);
    } catch (error) {
      console.error('Calculation error:', error);
      setLowerConfig(null);
      setUpperConfig(null);
    }
  }, [inputs, activeInputs, unit, cabinetType]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Video Wall Size Calculator
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InputPanel
            inputs={inputs}
            activeInputs={activeInputs}
            unit={unit}
            cabinetType={cabinetType}
            onInputChange={handleInputChange}
            onInputToggle={handleInputToggle}
            onUnitChange={handleUnitChange}
            onCabinetTypeChange={setCabinetType}
          />
        </div>

        {activeInputs.length === 2 && lowerConfig && upperConfig && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ResultPanel
              configuration={lowerConfig}
              unit={unit}
              label="Closest Lower Configuration"
            />
            <ResultPanel
              configuration={upperConfig}
              unit={unit}
              label="Closest Upper Configuration"
            />
          </div>
        )}

        {activeInputs.length === 2 && lowerConfig && upperConfig && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GridView
              configuration={lowerConfig}
              label="Lower Configuration Grid"
            />
            <GridView
              configuration={upperConfig}
              label="Upper Configuration Grid"
            />
          </div>
        )}

        {activeInputs.length !== 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">
              Please select exactly 2 input parameters to see the calculations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
