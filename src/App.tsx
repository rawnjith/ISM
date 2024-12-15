import React, { useState } from 'react';
import FactorInput from './components/FactorInput';
import SSIMMatrix from './components/SSIMMatrix';
import ReachabilityMatrix from './components/ReachabilityMatrix';
import PartitionLevelAnalysis from './components/PartitionLevelAnalysis';
import ISMDiagraph from './components/ISMDiagraph';
import MICMACAnalysis from './components/MICMACAnalysis';
import { useISMAnalysis } from './hooks/useISMAnalysis';
import type { Factor, SSIMValue, SSIMMatrix as SSIMMatrixType } from './types';

function App() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [ssimMatrix, setSsimMatrix] = useState<SSIMMatrixType>({});

  const handleAddFactor = (factor: Factor) => {
    setFactors(prev => [...prev, factor]);
  };

  const handleRemoveFactor = (id: string) => {
    setFactors(prev => prev.filter(f => f.id !== id));
    setSsimMatrix(prev => {
      const newMatrix = { ...prev };
      delete newMatrix[id];
      Object.keys(newMatrix).forEach(key => {
        delete newMatrix[key][id];
      });
      return newMatrix;
    });
  };

  const handleSsimChange = (i: string, j: string, value: SSIMValue) => {
    setSsimMatrix(prev => ({
      ...prev,
      [i]: {
        ...prev[i],
        [j]: value
      }
    }));
  };

  const isMatrixComplete = factors.length >= 2 && factors.every((factor1, i) =>
    factors.slice(i + 1).every(factor2 => 
      ssimMatrix[factor1.id]?.[factor2.id] !== undefined
    )
  );

  const analysis = useISMAnalysis(factors, ssimMatrix, isMatrixComplete);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ISM Analysis Tool
          </h1>
          <p className="text-gray-600">
            Developed by Ranjith Raj A.
          </p>
          <p className="text-gray-600 mt-2">
            Analyze relationships between factors using Interpretive Structural Modeling
          </p>
        </header>

        <FactorInput
          factors={factors}
          onAddFactor={handleAddFactor}
          onRemoveFactor={handleRemoveFactor}
        />

        {factors.length >= 2 && (
          <SSIMMatrix
            factors={factors}
            matrix={ssimMatrix}
            onChange={handleSsimChange}
          />
        )}

        {isMatrixComplete && analysis.initialReachabilityMatrix && (
          <>
            <ReachabilityMatrix
              factors={factors}
              matrix={analysis.initialReachabilityMatrix}
              drivingPower={analysis.initialDrivingPower}
              dependencePower={analysis.initialDependencePower}
              title="Initial Reachability Matrix"
            />

            <ReachabilityMatrix
              factors={factors}
              matrix={analysis.finalReachabilityMatrix}
              transitivityChanges={analysis.transitivityChanges}
              drivingPower={analysis.drivingPower}
              dependencePower={analysis.dependencePower}
              title="Final Reachability Matrix"
            />
            
            <PartitionLevelAnalysis
              factors={factors}
              levels={analysis.partitionLevels}
              finalReachabilityMatrix={analysis.finalReachabilityMatrix}
              iterationSteps={analysis.iterationSteps}
            />
            
            <ISMDiagraph
              factors={factors}
              levels={analysis.partitionLevels}
              finalReachabilityMatrix={analysis.finalReachabilityMatrix}
            />

            <MICMACAnalysis
              factors={factors}
              drivingPower={analysis.drivingPower}
              dependencePower={analysis.dependencePower}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;