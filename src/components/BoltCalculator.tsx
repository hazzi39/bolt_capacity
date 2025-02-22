import React, { useState } from 'react';
import { getBoltGrades, getBoltSizes, getBoltSpec, type BoltSpec } from '../data/bolts';
import { Save } from 'lucide-react';

const BoltCalculator: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [savedResults, setSavedResults] = useState<BoltSpec[]>([]);

  const boltGrades = getBoltGrades();
  const boltSizes = selectedGrade ? getBoltSizes(selectedGrade) : [];
  const boltSpec = selectedGrade && selectedSize ? getBoltSpec(selectedGrade, selectedSize) : undefined;

  const handleSaveResult = () => {
    if (boltSpec) {
      setSavedResults(prev => [...prev, boltSpec]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Bolt Capacity and Detailing
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bolt Grade
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedSize('');
                }}
              >
                <option value="">Select Grade</option>
                {boltGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bolt Size
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                disabled={!selectedGrade}
              >
                <option value="">Select Size</option>
                {boltSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          {boltSpec && (
            <>
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-2">Bolt Capacities</h2>
                <p className="text-sm text-gray-600 italic mb-4">Capacity reduction factor, φ = 0.8</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <span className="text-sm text-gray-600">φVf (Shear)</span>
                    <p className="text-2xl font-bold">{boltSpec.phiVf} kN</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow">
                    <span className="text-sm text-gray-600">φNtf (Tension)</span>
                    <p className="text-2xl font-bold">{boltSpec.phiNtf} kN</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-6">Key Parameters</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Bolt Details</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Tensile Area: {boltSpec.tensileArea} mm²</li>
                      <li>Ultimate Tensile Strength (fuf): {boltSpec.fuf} MPa</li>
                      <li>Minimum Pitch: {boltSpec.minimumPitch} mm</li>
                      <li>Minimum Edge Distance (Shear): {boltSpec.minEdgeDistanceShear} mm</li>
                      <li>Minimum Edge Distance (Rolled Plate): {boltSpec.minEdgeDistanceRolledPlate} mm</li>
                      <li>Minimum Edge Distance (Rolled Section): {boltSpec.minEdgeDistanceRolledSection} mm</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Nuts</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Maximum Height: {boltSpec.maxNutHeight} mm</li>
                      <li>Width Across Flats: {boltSpec.nutWidthAcrossFlats} mm</li>
                      <li>Width Across Corners: {boltSpec.nutWidthAcrossCorners} mm</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Washers</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Maximum Inside Diameter: {boltSpec.washerMaxInsideDiameter} mm</li>
                      <li>Maximum Outside Diameter: {boltSpec.washerMaxOutsideDiameter} mm</li>
                      <li>Maximum Thickness: {boltSpec.washerMaxThickness} mm</li>
                      <li>Minimum Thickness: {boltSpec.washerMinThickness} mm</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveResult}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Result
              </button>
            </>
          )}
        </div>

        {savedResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Saved Results</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">φVf (kN)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">φNtf (kN)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {savedResults.map((result, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.boltGrade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.boltSize}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.phiVf}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.phiNtf}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoltCalculator;