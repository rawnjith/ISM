import React from 'react';
import type { Factor, SSIMValue, SSIMMatrix } from '../types';
import { HelpCircle } from 'lucide-react';

interface SSIMMatrixProps {
  factors: Factor[];
  matrix: SSIMMatrix;
  onChange: (i: string, j: string, value: SSIMValue) => void;
}

export default function SSIMMatrix({ factors, matrix, onChange }: SSIMMatrixProps) {
  const options: SSIMValue[] = ['V', 'A', 'X', 'O'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">SSIM Matrix</h2>
        <div className="relative group">
          <HelpCircle className="text-gray-500 cursor-help" />
          <div className="absolute right-0 w-64 p-4 bg-white rounded-lg shadow-lg invisible group-hover:visible">
            <h3 className="font-bold mb-2">Legend:</h3>
            <ul className="text-sm space-y-1">
              <li><span className="font-semibold">V:</span> Factor i influences Factor j</li>
              <li><span className="font-semibold">A:</span> Factor j influences Factor i</li>
              <li><span className="font-semibold">X:</span> Factors i and j influence each other</li>
              <li><span className="font-semibold">O:</span> Factors i and j are unrelated</li>
            </ul>
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
            </tr>
          </thead>
          <tbody>
            {factors.map((rowFactor, i) => (
              <tr key={rowFactor.id}>
                <th className="p-2 border font-medium">{rowFactor.name}</th>
                {factors.map((colFactor, j) => (
                  <td key={colFactor.id} className="p-2 border">
                    {i < j ? (
                      <select
                        value={matrix[rowFactor.id]?.[colFactor.id] || ''}
                        onChange={(e) => 
                          onChange(rowFactor.id, colFactor.id, e.target.value as SSIMValue)
                        }
                        className="w-full p-1 border rounded"
                      >
                        <option value="">Select</option>
                        {options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : i === j ? (
                      '-'
                    ) : (
                      matrix[colFactor.id]?.[rowFactor.id] 
                        ? {
                          'V': 'A',
                          'A': 'V',
                          'X': 'X',
                          'O': 'O'
                        }[matrix[colFactor.id][rowFactor.id]]
                        : ''
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}