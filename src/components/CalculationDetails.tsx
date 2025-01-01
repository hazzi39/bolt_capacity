import React from 'react';
import { formatNumber } from '../utils/formatters';

interface CalculationDetailsProps {
  boltGrade: string;
  diameter: number;
  threadedLength: number;
  minorDiameter: number;
  kr: number;
  fuf: number;
}

export default function CalculationDetails({
  boltGrade,
  diameter,
  threadedLength,
  minorDiameter,
  kr,
  fuf
}: CalculationDetailsProps) {
  const minPitch = 2.5 * diameter;
  const maxPitch = Math.min(200, 32 * diameter);
  const minEdgeDistanceSheared = 1.75 * diameter;
  const minEdgeDistanceRolled = 1.5 * diameter;
  const minEdgeDistanceRolledSection = 1.25 * diameter;

  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Parameters Used</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Tensile Strength (f<sub>uf</sub>): {fuf} MPa</li>
            <li>Minor Diameter: {formatNumber(minorDiameter)} mm</li>
            <li>Length Reduction Factor (k<sub>r</sub>): {formatNumber(kr)}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">Design Requirements</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>Minimum Pitch: {formatNumber(minPitch)} mm</li>
            <li>Maximum Pitch: {formatNumber(maxPitch)} mm</li>
            <li>Minimum Edge Distances:
              <ul className="ml-4 mt-1">
                <li>• Sheared Edge: {formatNumber(minEdgeDistanceSheared)} mm</li>
                <li>• Rolled/Machine Cut: {formatNumber(minEdgeDistanceRolled)} mm</li>
                <li>• Rolled Section: {formatNumber(minEdgeDistanceRolledSection)} mm</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}