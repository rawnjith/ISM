import React, { useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';
import type { Factor } from '../types';
import { createMICMACPlot } from '../utils/micmac';

interface MICMACAnalysisProps {
  factors: Factor[];
  drivingPower: { [key: string]: number };
  dependencePower: { [key: string]: number };
}

export default function MICMACAnalysis({
  factors,
  drivingPower,
  dependencePower
}: MICMACAnalysisProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && factors.length > 0) {
      createMICMACPlot(svgRef.current, factors, drivingPower, dependencePower);
    }
  }, [factors, drivingPower, dependencePower]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">MICMAC Analysis</h2>
        <div className="relative group">
          <HelpCircle className="text-gray-500 cursor-help" />
          <div className="absolute right-0 w-64 p-4 bg-white rounded-lg shadow-lg invisible group-hover:visible">
            <h3 className="font-bold mb-2">Quadrants:</h3>
            <ul className="text-sm space-y-1">
              <li><span className="font-semibold">Autonomous:</span> Weak driving & dependence power</li>
              <li><span className="font-semibold">Dependent:</span> Weak driving, strong dependence power</li>
              <li><span className="font-semibold">Linkage:</span> Strong driving & dependence power</li>
              <li><span className="font-semibold">Independent:</span> Strong driving, weak dependence power</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          ref={svgRef}
          className="w-full"
          style={{ minHeight: '500px' }}
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
    </div>
  );
}