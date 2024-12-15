import { useMemo } from 'react';
import type { Factor, SSIMMatrix } from '../types';
import { generateInitialReachabilityMatrix } from '../utils/matrix';
import { applyTransitivity } from '../utils/transitivity';
import { calculatePowers } from '../utils/powers';
import { findPartitionLevels } from '../utils/partition';

export function useISMAnalysis(
  factors: Factor[],
  ssimMatrix: SSIMMatrix,
  isMatrixComplete: boolean
) {
  return useMemo(() => {
    if (factors.length < 2 || !isMatrixComplete) return {};

    const factorIds = factors.map(f => f.id);
    const { matrix: initial, drivingPower: initialDriving, dependencePower: initialDependence } = 
      generateInitialReachabilityMatrix(factorIds, ssimMatrix);
    const { final, changes } = applyTransitivity(initial);
    const { drivingPower, dependencePower } = calculatePowers(final);
    const { levels, iterations } = findPartitionLevels(final);

    return {
      initialReachabilityMatrix: initial,
      initialDrivingPower: initialDriving,
      initialDependencePower: initialDependence,
      finalReachabilityMatrix: final,
      transitivityChanges: changes,
      drivingPower,
      dependencePower,
      partitionLevels: levels,
      iterationSteps: iterations
    };
  }, [factors, ssimMatrix, isMatrixComplete]);
}