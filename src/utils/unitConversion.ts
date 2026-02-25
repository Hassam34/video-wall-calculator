import { Unit } from '@/types/calculator';

// All conversions are based on mm as the base unit
const CONVERSION_FACTORS: Record<Unit, number> = {
  mm: 1,
  meters: 1000,
  feet: 304.8,
  inches: 25.4,
};

/**
 * Convert a value from one unit to another
 */
export function convertUnit(value: number, from: Unit, to: Unit): number {
  if (from === to) return value;
  
  // Convert to mm first, then to target unit
  const valueInMm = value * CONVERSION_FACTORS[from];
  return valueInMm / CONVERSION_FACTORS[to];
}

/**
 * Convert a value to mm (base unit)
 */
export function toMm(value: number, unit: Unit): number {
  return value * CONVERSION_FACTORS[unit];
}

/**
 * Convert a value from mm to target unit
 */
export function fromMm(value: number, unit: Unit): number {
  return value / CONVERSION_FACTORS[unit];
}

/**
 * Format a number with appropriate decimal places based on unit
 */
export function formatValue(value: number, unit: Unit): string {
  const decimals = unit === 'mm' ? 1 : unit === 'meters' ? 3 : 2;
  return value.toFixed(decimals);
}
