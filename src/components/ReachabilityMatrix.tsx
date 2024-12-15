import React from 'react';
import type { Factor, ReachabilityMatrix as ReachabilityMatrixType } from '../types';
import { HelpCircle } from 'lucide-react';

interface ReachabilityMatrixProps {
  factors: Factor[];
  matrix: ReachabilityMatrixType;
  transitivityChanges?: Set<string>;
  drivingPower: { [key: string]: number };
  dependencePower: { [key: string]: number };
  title: string;
}

export default function ReachabilityMatrix({
  factors,
  matrix,
  transitivityChanges,
  drivingPower,
  dependencePower,
  title
}: ReachabilityMatrixProps) {
  const isCellTransitive = (rowId: string, colId: string) => {
    return transitivityChanges?.has(`${rowId},${colId}`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="relative group">
          <HelpCircle className="text-gray-500 cursor-help" />
          <div className="absolute right-0 w-64 p-4 bg-white rounded-lg shadow-lg invisible group-hover:visible">
            <p className="text-sm">
              1 indicates influence between factors, while 0 indicates no influence.
              {transitivityChanges && (
                <span className="block mt-2">
                  Highlighted cells indicate new relationships identified through transitivity.
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border"></th>
              {factors.map((factor) => (
                <th key={factor.id} className="p-2 border font-medium">
                  {factor.name}
                </th>
              ))}
              <th className="p-2 border font-medium">Driving Power</th>
            </tr>
          </thead>
          <tbody>
            {factors.map((rowFactor) => (
              <tr key={rowFactor.id}>
                <th className="p-2 border font-medium">{rowFactor.name}</th>
                {factors.map((colFactor) => {
                  const value = matrix[rowFactor.id]?.[colFactor.id] ?? 0;
                  const isTransitive = isCellTransitive(rowFactor.id, colFactor.id);
                  
                  return (
                    <td 
                      key={colFactor.id} 
                      className={`p-2 border text-center ${
                        isTransitive ? 'bg-yellow-100 font-medium' : ''
                      }`}
                    >
                      {value}
                    </td>
                  );
                })}
                <td className="p-2 border text-center font-medium">
                  {drivingPower[rowFactor.id]}
                </td>
              </tr>
            ))}
            <tr>
              <th className="p-2 border font-medium">Dependence Power</th>
              {factors.map((factor) => (
                <td key={factor.id} className="p-2 border text-center font-medium">
                  {dependencePower[factor.id]}
                </td>
              ))}
              <td className="p-2 border"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}