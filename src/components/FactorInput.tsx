import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Factor } from '../types';

interface FactorInputProps {
  factors: Factor[];
  onAddFactor: (factor: Factor) => void;
  onRemoveFactor: (id: string) => void;
}

export default function FactorInput({ factors, onAddFactor, onRemoveFactor }: FactorInputProps) {
  const [factorName, setFactorName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (factorName.trim()) {
      onAddFactor({
        id: crypto.randomUUID(),
        name: factorName.trim()
      });
      setFactorName('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enter Factors</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={factorName}
            onChange={(e) => setFactorName(e.target.value)}
            placeholder="Enter factor name"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Add Factor
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {factors.map((factor) => (
          <div
            key={factor.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <span>{factor.name}</span>
            <button
              onClick={() => onRemoveFactor(factor.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {factors.length < 2 && (
        <p className="mt-4 text-sm text-amber-600">
          Please enter at least 2 factors to proceed with the analysis.
        </p>
      )}
    </div>
  );
}