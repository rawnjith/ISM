import type { ReachabilityMatrix } from '../types';

export function calculatePowers(matrix: ReachabilityMatrix): {
  drivingPower: { [key: string]: number };
  dependencePower: { [key: string]: number };
} {
  const factors = Object.keys(matrix);
  const drivingPower: { [key: string]: number } = {};
  const dependencePower: { [key: string]: number } = {};

  factors.forEach(i => {
    drivingPower[i] = Object.values(matrix[i]).reduce((sum, val) => sum + val, 0);
    dependencePower[i] = factors.reduce((sum, j) => sum + matrix[j][i], 0);
  });

  return { drivingPower, dependencePower };
}