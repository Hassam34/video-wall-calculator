export type Unit = 'mm' | 'meters' | 'feet' | 'inches';

export type CabinetType = '16:9' | '1:1';

export type InputType = 'aspectRatio' | 'height' | 'width' | 'diagonal';

export interface CabinetDimensions {
  width: number; // in mm
  height: number; // in mm
}

export interface CabinetConfig {
  type: CabinetType;
  dimensions: CabinetDimensions;
}

export interface WallConfiguration {
  columns: number;
  rows: number;
  totalCabinets: number;
  width: number; // in mm
  height: number; // in mm
  diagonal: number; // in mm
  aspectRatio: string;
}

export interface CalculatorInputs {
  aspectRatio: number | null;
  height: number | null;
  width: number | null;
  diagonal: number | null;
}

export interface CalculatorState {
  inputs: CalculatorInputs;
  activeInputs: InputType[];
  unit: Unit;
  cabinetType: CabinetType;
}
