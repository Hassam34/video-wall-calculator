// calculatorLogic.ts
import { CabinetType, WallConfiguration, CalculatorInputs } from '@/types/calculator';
import { toMm, fromMm } from './unitConversion';
import { Unit } from '@/types/calculator';

// Cabinet dimensions in mm
const CABINET_DIMENSIONS: Record<CabinetType, { width: number; height: number }> = {
  '16:9': { width: 600, height: 337.5 },
  '1:1': { width: 500, height: 500 },
};

/**
 * Calculate diagonal from width and height
 */
function calculateDiagonal(width: number, height: number): number {
  return Math.sqrt(width * width + height * height);
}

/**
 * Calculate width from height and aspect ratio
 */
function calculateWidthFromHeight(height: number, aspectRatio: number): number {
  return height * aspectRatio;
}

/**
 * Calculate height from width and aspect ratio
 */
function calculateHeightFromWidth(width: number, aspectRatio: number): number {
  return width / aspectRatio;
}

/**
 * Calculate all dimensions from two inputs
 */
export function calculateDimensions(
  inputs: CalculatorInputs,
  unit: Unit
): { width: number; height: number; diagonal: number; aspectRatio: number } {
  let width: number;
  let height: number;
  let diagonal: number;
  let aspectRatio: number;

  const aspectRatioValue = inputs.aspectRatio ?? 16 / 9;
  const heightValue = inputs.height ? toMm(inputs.height, unit) : null;
  const widthValue = inputs.width ? toMm(inputs.width, unit) : null;
  const diagonalValue = inputs.diagonal ? toMm(inputs.diagonal, unit) : null;

  if (inputs.aspectRatio !== null && inputs.height !== null) {
    aspectRatio = aspectRatioValue;
    height = heightValue!;
    width = calculateWidthFromHeight(height, aspectRatio);
    diagonal = calculateDiagonal(width, height);
  } else if (inputs.aspectRatio !== null && inputs.width !== null) {
    aspectRatio = aspectRatioValue;
    width = widthValue!;
    height = calculateHeightFromWidth(width, aspectRatio);
    diagonal = calculateDiagonal(width, height);
  } else if (inputs.aspectRatio !== null && inputs.diagonal !== null) {
    aspectRatio = aspectRatioValue;
    diagonal = diagonalValue!;
    height = diagonal / Math.sqrt(1 + aspectRatio * aspectRatio);
    width = height * aspectRatio;
  } else if (inputs.height !== null && inputs.width !== null) {
    height = heightValue!;
    width = widthValue!;
    diagonal = calculateDiagonal(width, height);
    aspectRatio = width / height;
  } else if (inputs.height !== null && inputs.diagonal !== null) {
    height = heightValue!;
    diagonal = diagonalValue!;
    width = Math.sqrt(diagonal * diagonal - height * height);
    aspectRatio = width / height;
  } else if (inputs.width !== null && inputs.diagonal !== null) {
    width = widthValue!;
    diagonal = diagonalValue!;
    height = Math.sqrt(diagonal * diagonal - width * width);
    aspectRatio = width / height;
  } else {
    // fallback default
    aspectRatio = 16 / 9;
    width = 1000;
    height = width / aspectRatio;
    diagonal = calculateDiagonal(width, height);
  }

  return { width, height, diagonal, aspectRatio };
}

/**
 * Create a wall configuration from columns and rows
 */
function createConfiguration(columns: number, rows: number, cabinetType: CabinetType): WallConfiguration {
  const cabinet = CABINET_DIMENSIONS[cabinetType];
  const width = columns * cabinet.width;
  const height = rows * cabinet.height;
  const diagonal = calculateDiagonal(width, height);
  const aspectRatio = width / height;

  return {
    columns,
    rows,
    totalCabinets: columns * rows,
    width,
    height,
    diagonal,
    aspectRatio: `${aspectRatio.toFixed(2)}:1`,
  };
}

/**
 * Calculate Euclidean distance between two points (width, height)
 */
function calculateDistance(width1: number, height1: number, width2: number, height2: number): number {
  return Math.sqrt((width1 - width2) ** 2 + (height1 - height2) ** 2);
}

/**
 * Find closest lower and upper configurations (width+height mode)
 */
export function findClosestConfigurations(
  targetWidth: number,
  targetHeight: number,
  cabinetType: CabinetType
): { lower: WallConfiguration; upper: WallConfiguration } {
  const maxSize = 50;
  let exactMatch: WallConfiguration | null = null;
  let exactColumns = 0;
  let exactRows = 0;
  const epsilon = 0.5; // 0.5mm tolerance

  // First: check for exact match
  for (let c = 1; c <= maxSize; c++) {
    for (let r = 1; r <= maxSize; r++) {
      const config = createConfiguration(c, r, cabinetType);
      if (Math.abs(config.width - targetWidth) < epsilon && Math.abs(config.height - targetHeight) < epsilon) {
        exactMatch = config;
        exactColumns = c;
        exactRows = r;
        break;
      }
    }
    if (exactMatch) break;
  }

  if (exactMatch) {
    const upperConfig = createConfiguration(Math.min(exactColumns + 1, maxSize), Math.min(exactRows + 1, maxSize), cabinetType);
    return { lower: exactMatch, upper: upperConfig };
  }

  // No exact match → find closest lower and upper by distance
  let lowerConfig: WallConfiguration | null = null;
  let upperConfig: WallConfiguration | null = null;
  let lowerDistance = Infinity;
  let upperDistance = Infinity;

  for (let c = 1; c <= maxSize; c++) {
    for (let r = 1; r <= maxSize; r++) {
      const config = createConfiguration(c, r, cabinetType);
      const distance = calculateDistance(config.width, config.height, targetWidth, targetHeight);

      // Lower: both smaller or equal
      if (config.width <= targetWidth && config.height <= targetHeight && distance < lowerDistance) {
        lowerConfig = config;
        lowerDistance = distance;
      }

      // Upper: both larger or equal
      if (config.width >= targetWidth && config.height >= targetHeight && distance < upperDistance) {
        upperConfig = config;
        upperDistance = distance;
      }
    }
  }

  return {
    lower: lowerConfig!,
    upper: upperConfig!,
  };
}

/**
 * Find closest configurations for Width + Diagonal inputs
 */
export function findClosestConfigurationsByWidthAndDiagonal(
  targetWidth: number,
  targetDiagonal: number,
  cabinetType: CabinetType
): { lower: WallConfiguration; upper: WallConfiguration } {
  const maxSize = 50;
  let exactMatch: WallConfiguration | null = null;
  let exactColumns = 0;
  let exactRows = 0;
  const epsilon = 0.5;

  // Check for exact match
  for (let c = 1; c <= maxSize; c++) {
    for (let r = 1; r <= maxSize; r++) {
      const config = createConfiguration(c, r, cabinetType);
      if (Math.abs(config.width - targetWidth) < epsilon && Math.abs(config.diagonal - targetDiagonal) < epsilon) {
        exactMatch = config;
        exactColumns = c;
        exactRows = r;
        break;
      }
    }
    if (exactMatch) break;
  }

  if (exactMatch) {
    const upperConfig = createConfiguration(Math.min(exactColumns + 1, maxSize), Math.min(exactRows + 1, maxSize), cabinetType);
    return { lower: exactMatch, upper: upperConfig };
  }

  // No exact match → use total error (width + diagonal)
  let lowerConfig: WallConfiguration | null = null;
  let upperConfig: WallConfiguration | null = null;
  let lowerError = Infinity;
  let upperError = Infinity;

  for (let c = 1; c <= maxSize; c++) {
    for (let r = 1; r <= maxSize; r++) {
      const config = createConfiguration(c, r, cabinetType);
      const totalError = Math.abs(config.width - targetWidth) + Math.abs(config.diagonal - targetDiagonal);

      // Lower: both smaller
      if (config.width <= targetWidth && config.diagonal <= targetDiagonal && totalError < lowerError) {
        lowerConfig = config;
        lowerError = totalError;
      }

      // Upper: both larger
      if (config.width >= targetWidth && config.diagonal >= targetDiagonal && totalError < upperError) {
        upperConfig = config;
        upperError = totalError;
      }
    }
  }

  return { lower: lowerConfig!, upper: upperConfig! };
}