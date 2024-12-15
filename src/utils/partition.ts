import type { ReachabilityMatrix } from '../types';

export interface PartitionSet {
  reachability: Set<string>;
  antecedent: Set<string>;
  intersection: Set<string>;
}

export interface IterationStep {
  iteration: number;
  remainingFactors: string[];
  partitionSets: Map<string, PartitionSet>;
  levelFactors: string[];
}

export interface PartitionResult {
  level: number;
  factors: string[];
}

function getReachabilitySet(
  factor: string,
  matrix: ReachabilityMatrix,
  availableFactors: Set<string>
): Set<string> {
  return new Set(
    Object.entries(matrix[factor])
      .filter(([key, value]) => value === 1 && availableFactors.has(key))
      .map(([key]) => key)
  );
}

function getAntecedentSet(
  factor: string,
  matrix: ReachabilityMatrix,
  availableFactors: Set<string>
): Set<string> {
  return new Set(
    Array.from(availableFactors)
      .filter(key => matrix[key][factor] === 1)
  );
}

export function calculatePartitionSets(
  factors: string[],
  matrix: ReachabilityMatrix,
  availableFactors?: Set<string>
): Map<string, PartitionSet> {
  const factorSet = availableFactors || new Set(factors);
  const partitionSets = new Map<string, PartitionSet>();

  Array.from(factorSet).forEach(factor => {
    const reachability = getReachabilitySet(factor, matrix, factorSet);
    const antecedent = getAntecedentSet(factor, matrix, factorSet);
    const intersection = new Set(
      [...reachability].filter(x => antecedent.has(x))
    );

    partitionSets.set(factor, {
      reachability,
      antecedent,
      intersection
    });
  });

  return partitionSets;
}

export function findPartitionLevels(
  matrix: ReachabilityMatrix
): {
  levels: PartitionResult[];
  iterations: IterationStep[];
} {
  const levels: PartitionResult[] = [];
  const iterations: IterationStep[] = [];
  let remainingFactors = new Set(Object.keys(matrix));
  let currentLevel = 1;

  while (remainingFactors.size > 0) {
    const partitionSets = calculatePartitionSets(
      Array.from(remainingFactors),
      matrix,
      remainingFactors
    );

    const currentLevelFactors = Array.from(remainingFactors).filter(factor => {
      const sets = partitionSets.get(factor)!;
      return setsEqual(sets.reachability, sets.intersection);
    });

    if (currentLevelFactors.length === 0) {
      break; // Prevent infinite loop in case of circular dependencies
    }

    // Record iteration step
    iterations.push({
      iteration: currentLevel,
      remainingFactors: Array.from(remainingFactors),
      partitionSets,
      levelFactors: currentLevelFactors
    });

    // Add level result
    levels.push({
      level: currentLevel,
      factors: currentLevelFactors
    });

    // Remove identified factors from remaining set
    currentLevelFactors.forEach(factor => remainingFactors.delete(factor));
    currentLevel++;
  }

  return { levels, iterations };
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  return a.size === b.size && [...a].every(value => b.has(value));
}