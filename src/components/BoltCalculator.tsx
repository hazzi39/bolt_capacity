import React, { useState, useEffect } from 'react';
import { Calculator, Save, ChevronDown, ChevronUp, Download } from 'lucide-react';
import TooltipLabel from './TooltipLabel';
import CalculationDetails from './CalculationDetails';
import { BOLT_PROPERTIES, calculateKr, calculateAreas, calculateBoltShearCapacity, calculateBoltTensileCapacity } from '../utils/calculations';
import { formatNumber } from '../utils/formatters';

interface SavedCalculation {
  id: string;
  timestamp: string;
  inputs: {
    boltGrade: string;
    diameter: number;
    threadedLength: number;
    shearPlanes: number;
    unthreadedShearPlanes: number;
  };
  results: {
    shearCapacity: number;
    tensileCapacity: number;
  };
}

export default function BoltCalculator() {
  const [inputs, setInputs] = useState({
    boltGrade: '8.8',
    diameter: 20,
    threadedLength: 0,
    shearPlanes: 1,
    unthreadedShearPlanes: 0,
  });

  const [results, setResults] = useState({
    shearCapacity: 0,
    tensileCapacity: 0,
  });

  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [showSavedResults, setShowSavedResults] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    validateInputs();
    calculateResults();
  }, [inputs]);

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    if (inputs.diameter <= 0) {
      newErrors.diameter = 'Diameter must be positive';
    }
    if (inputs.threadedLength < 0) {
      newErrors.threadedLength = 'Length must be non-negative';
    }
    if (inputs.shearPlanes < 0) {
      newErrors.shearPlanes = 'Number of shear planes must be non-negative';
    }
    if (inputs.unthreadedShearPlanes < 0) {
      newErrors.unthreadedShearPlanes = 'Number of unthreaded shear planes must be non-negative';
    }

    setErrors(newErrors);
  };

  const calculateResults = () => {
    if (Object.keys(errors).length > 0) return;

    setIsCalculating(true);
    try {
      const shearCapacity = calculateBoltShearCapacity(
        inputs.boltGrade,
        inputs.diameter,
        inputs.threadedLength,
        inputs.shearPlanes,
        inputs.unthreadedShearPlanes
      );

      const tensileCapacity = calculateBoltTensileCapacity(
        inputs.boltGrade,
        inputs.diameter
      );

      setResults({
        shearCapacity,
        tensileCapacity,
      });
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: name === 'boltGrade' ? value : Number(value),
    }));
  };

  const saveCalculation = () => {
    const newCalculation: SavedCalculation = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleString(),
      inputs: { ...inputs },
      results: { ...results },
    };

    setSavedCalculations(prev => [newCalculation, ...prev]);
    setShowSavedResults(true);
  };

  const exportResults = () => {
    const csvContent = [
      ['Timestamp', 'Bolt Grade', 'Diameter (mm)', 'Threaded Length (mm)', 'Threaded Shear Planes', 'Unthreaded Shear Planes', 'Shear Capacity (kN)', 'Tensile Capacity (kN)'],
      ...savedCalculations.map(calc => [
        calc.timestamp,
        calc.inputs.boltGrade,
        calc.inputs.diameter,
        calc.inputs.threadedLength,
        calc.inputs.shearPlanes,
        calc.inputs.unthreadedShearPlanes,
        formatNumber(calc.results.shearCapacity),
        formatNumber(calc.results.tensileCapacity)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bolt-calculations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Calculator className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold text-white">Bolt Strength Calculator</h1>
            </div>
            <p className="mt-1 text-sm text-blue-100">
              Calculate bolt shear and tensile capacities according to AS/NZS 5100.6:2017
            </p>
          </div>

          {/* Input Section */}
          <div className="px-6 py-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <TooltipLabel
                  htmlFor="boltGrade"
                  label="Bolt Grade"
                  symbol="(f₍ᵤf₎)"
                  tooltip="Select the bolt grade according to AS/NZS 1252"
                />
                <select
                  id="boltGrade"
                  name="boltGrade"
                  value={inputs.boltGrade}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="4.6">4.6</option>
                  <option value="8.8">8.8</option>
                </select>
              </div>

              <div>
                <TooltipLabel
                  htmlFor="diameter"
                  label="Nominal Diameter"
                  symbol="(d)"
                  tooltip="Nominal bolt diameter in millimeters according to AS/NZS 1252"
                />
                <input
                  type="number"
                  id="diameter"
                  name="diameter"
                  value={inputs.diameter}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.diameter ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.diameter && (
                  <p className="mt-1 text-sm text-red-600">{errors.diameter}</p>
                )}
              </div>

              <div>
                <TooltipLabel
                  htmlFor="threadedLength"
                  label="Threaded Length"
                  symbol="(L₁)"
                  tooltip="Length of the threaded portion in millimeters"
                />
                <input
                  type="number"
                  id="threadedLength"
                  name="threadedLength"
                  value={inputs.threadedLength}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.threadedLength ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.threadedLength && (
                  <p className="mt-1 text-sm text-red-600">{errors.threadedLength}</p>
                )}
              </div>

              <div>
                <TooltipLabel
                  htmlFor="shearPlanes"
                  label="Threaded Shear Planes"
                  symbol="(n₍ₜ₎)"
                  tooltip="Number of shear planes with threads intercepting the shear plane"
                />
                <input
                  type="number"
                  id="shearPlanes"
                  name="shearPlanes"
                  value={inputs.shearPlanes}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.shearPlanes ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.shearPlanes && (
                  <p className="mt-1 text-sm text-red-600">{errors.shearPlanes}</p>
                )}
              </div>

              <div>
                <TooltipLabel
                  htmlFor="unthreadedShearPlanes"
                  label="Unthreaded Shear Planes"
                  symbol="(n₍ₓ₎)"
                  tooltip="Number of shear planes without threads intercepting the shear plane"
                />
                <input
                  type="number"
                  id="unthreadedShearPlanes"
                  name="unthreadedShearPlanes"
                  value={inputs.unthreadedShearPlanes}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                    errors.unthreadedShearPlanes ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.unthreadedShearPlanes && (
                  <p className="mt-1 text-sm text-red-600">{errors.unthreadedShearPlanes}</p>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            {isCalculating ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Nominal Shear Capacity</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {formatNumber(results.shearCapacity)} kN
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Nominal Tensile Capacity</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">
                      {formatNumber(results.tensileCapacity)} kN
                    </p>
                  </div>
                </div>

                <CalculationDetails
                  boltGrade={inputs.boltGrade}
                  diameter={inputs.diameter}
                  threadedLength={inputs.threadedLength}
                  minorDiameter={inputs.diameter - 1}
                  kr={calculateKr(inputs.threadedLength)}
                  fuf={BOLT_PROPERTIES[inputs.boltGrade as keyof typeof BOLT_PROPERTIES].fuf}
                />

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={saveCalculation}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Results
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Saved Results Section */}
          {savedCalculations.length > 0 && (
            <div className="border-t border-gray-200">
              <button
                onClick={() => setShowSavedResults(!showSavedResults)}
                className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <span>Saved Calculations ({savedCalculations.length})</span>
                {showSavedResults ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              
              {showSavedResults && (
                <div className="px-6 py-4">
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={exportResults}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export to CSV
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diameter</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shear Cap.</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tensile Cap.</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {savedCalculations.map((calc) => (
                          <tr key={calc.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calc.timestamp}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calc.inputs.boltGrade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calc.inputs.diameter} mm</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(calc.results.shearCapacity)} kN</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(calc.results.tensileCapacity)} kN</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
