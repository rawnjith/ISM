import React, { useState } from 'react';
import type { Factor, PartitionLevel } from '../types';
import type { IterationStep } from '../utils/partition';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import PartitionSetsTable from './PartitionSetsTable';

interface PartitionLevelAnalysisProps {
  factors: Factor[];
  levels: PartitionLevel[];
  finalReachabilityMatrix: {
    [key: string]: {
      [key: string]: number;
    };
  };
  iterationSteps: IterationStep[];
}

export default function PartitionLevelAnalysis({
  factors,
  levels,
  finalReachabilityMatrix,
  iterationSteps
}: PartitionLevelAnalysisProps) {
  const [expandedIterations, setExpandedIterations] = useState<number[]>([1]);

  const getFactorName = (id: string) => 
    factors.find(f => f.id === id)?.name || id;

  const toggleIteration = (iteration: number) => {
    setExpandedIterations(prev => 
      prev.includes(iteration)
        ? prev.filter(i => i !== iteration)
        : [...prev, iteration]
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Partition Level Analysis</h2>
        <div className="relative group">
          <HelpCircle className="text-gray-500 cursor-help" />
          <div className="absolute right-0 w-80 p-4 bg-white rounded-lg shadow-lg invisible group-hover:visible z-10">
            <h3 className="font-bold mb-2">Understanding the Process:</h3>
            <ul className="text-sm space-y-2">
              <li><span className="font-semibold">Iterations:</span> Each step identifies factors at the same level</li>
              <li><span className="font-semibold">Reachability Set:</span> Factors that this factor can influence</li>
              <li><span className="font-semibold">Antecedent Set:</span> Factors that can influence this factor</li>
              <li><span className="font-semibold">Intersection Set:</span> Common factors between sets</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {iterationSteps.map((step) => (
          <div key={step.iteration} className="border rounded-lg">
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleIteration(step.iteration)}
            >
              <span className="font-semibold">
                Iteration {step.iteration}
                {step.levelFactors.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    (Level {step.iteration} identified)
                  </span>
                )}
              </span>
              {expandedIterations.includes(step.iteration) ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>

            {expandedIterations.includes(step.iteration) && (
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Remaining Factors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {step.remainingFactors.map(factorId => (
                      <span
                        key={factorId}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {getFactorName(factorId)}
                      </span>
                    ))}
                  </div>
                </div>

                <PartitionSetsTable
                  factors={factors.filter(f => 
                    step.remainingFactors.includes(f.id)
                  )}
                  partitionSets={step.partitionSets}
                  getFactorName={getFactorName}
                />

                {step.levelFactors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">
                      Level {step.iteration} Factors:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {step.levelFactors.map(factorId => (
                        <span
                          key={factorId}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {getFactorName(factorId)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Final Level Partitioning</h3>
          <div className="space-y-4">
            {levels.map(({ level, factors: levelFactors }) => (
              <div
                key={level}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <h4 className="font-semibold mb-2">
                  Level {level}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {levelFactors.map(factorId => (
                    <span
                      key={factorId}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {getFactorName(factorId)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}