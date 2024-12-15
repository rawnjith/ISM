import type { ReachabilityMatrix } from '../types';

export function applyTransitivity(matrix: ReachabilityMatrix): {
  final: ReachabilityMatrix;
  changes: Set<string>;
} {
  const factors = Object.keys(matrix);
  const final = JSON.parse(JSON.stringify(matrix)) as ReachabilityMatrix;
  const changes = new Set<string>();

  // Floyd-Warshall algorithm for transitive closure
  for (let k = 0; k < factors.length; k++) {
    for (let i = 0; i < factors.length; i++) {
      for (let j = 0; j < factors.length; j++) {
        if (
          final[factors[i]][factors[k]] && 
          final[factors[k]][factors[j]] &&
          !final[factors[i]][factors[j]]
        ) {
          final[factors[i]][factors[j]] = 1;
          changes.add(`${factors[i]},${factors[j]}`);
        }
      }
    }
  }

  return { final, changes };
}