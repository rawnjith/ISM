import type { SSIMMatrix, ReachabilityMatrix } from '../types';

export function generateInitialReachabilityMatrix(
  factors: string[],
  ssimMatrix: SSIMMatrix
): {
  matrix: ReachabilityMatrix;
  drivingPower: { [key: string]: number };
  dependencePower: { [key: string]: number };
} {
  const matrix: ReachabilityMatrix = {};
  const drivingPower: { [key: string]: number } = {};
  const dependencePower: { [key: string]: number } = {};

  // Initialize the matrix
  factors.forEach(i => {
    matrix[i] = {};
    factors.forEach(j => {
      if (i === j) {
        matrix[i][j] = 1; // Diagonal elements are always 1
      } else if (ssimMatrix[i]?.[j]) {
        // Upper triangular conversion
        matrix[i][j] = ssimMatrix[i][j] === 'V' || ssimMatrix[i][j] === 'X' ? 1 : 0;
      } else if (ssimMatrix[j]?.[i]) {
        // Lower triangular conversion
        matrix[i][j] = ssimMatrix[j][i] === 'A' || ssimMatrix[j][i] === 'X' ? 1 : 0;
      } else {
        matrix[i][j] = 0;
      }
    });
  });

  // Calculate powers for initial matrix
  factors.forEach(i => {
    drivingPower[i] = factors.reduce((sum, j) => sum + matrix[i][j], 0);
  });

  factors.forEach(j => {
    dependencePower[j] = factors.reduce((sum, i) => sum + matrix[i][j], 0);
  });

  return { matrix, drivingPower, dependencePower };
}