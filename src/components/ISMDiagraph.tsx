import React, { useEffect, useRef } from 'react';
import { HelpCircle } from 'lucide-react';
import type { Factor, PartitionLevel } from '../types';
import { createDiagraph } from '../utils/diagraph';

interface ISMDiagraphProps {
  factors: Factor[];
  levels: PartitionLevel[];
  finalReachabilityMatrix: {
    [key: string]: {
      [key: string]: number;
    };
  };
}

export default function ISMDiagraph({
  factors,
  levels,
  finalReachabilityMatrix
}: ISMDiagraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && factors.length > 0 && levels.length > 0) {
      createDiagraph(svgRef.current, factors, levels, finalReachabilityMatrix);
    }
  }, [factors, levels, finalReachabilityMatrix]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">ISM Diagraph</h2>
        <div className="relative group">
          <HelpCircle className="text-gray-500 cursor-help" />
          <div className="absolute right-0 w-64 p-4 bg-white rounded-lg shadow-lg invisible group-hover:visible">
            <p className="text-sm">
              The diagraph shows hierarchical relationships between factors.
              Arrows indicate influence direction, and levels represent dependency hierarchy.
            </p>
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