import React from 'react';
import type { Factor } from '../types';
import type { PartitionSet } from '../utils/partition';

interface PartitionSetsTableProps {
  factors: Factor[];
  partitionSets: Map<string, PartitionSet>;
  getFactorName: (id: string) => string;
}

export default function PartitionSetsTable({
  factors,
  partitionSets,
  getFactorName
}: PartitionSetsTableProps) {
  const formatSet = (set: Set<string>) => 
    Array.from(set)
      .map(id => getFactorName(id))
      .join(', ');

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 border font-semibold text-left">Factor</th>
            <th className="p-3 border font-semibold text-left">Reachability Set</th>
            <th className="p-3 border font-semibold text-left">Antecedent Set</th>
            <th className="p-3 border font-semibold text-left">Intersection Set</th>
          </tr>
        </thead>
        <tbody>
          {factors.map(factor => {
            const sets = partitionSets.get(factor.id);
            if (!sets) return null;

            return (
              <tr key={factor.id} className="hover:bg-gray-50">
                <td className="p-3 border font-medium">
                  {factor.name}
                </td>
                <td className="p-3 border">
                  {formatSet(sets.reachability)}
                </td>
                <td className="p-3 border">
                  {formatSet(sets.antecedent)}
                </td>
                <td className="p-3 border">
                  {formatSet(sets.intersection)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}