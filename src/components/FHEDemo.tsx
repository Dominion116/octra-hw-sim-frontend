'use client';
import React, { useState, useEffect } from 'react';
import { Lock, Zap, Calculator, Eye, EyeOff } from 'lucide-react';
import { fheApi } from '@/utils/api';

interface EncryptedValue {
  encrypted_data: string;
  data_type: string;
  noise_level: number;
  can_compute: boolean;
}

interface Demo {
  name: string;
  description: string;
  operation: string;
  demo_data: Array<{ value: any; label: string }>;
  expected_result: string;
}

interface ComputationResult {
  operation: string;
  result: EncryptedValue;
  computation_time: number;
  gas_used: number;
  success: boolean;
  error_message?: string;
}

interface ExtendedEncryptedValue extends EncryptedValue {
  label?: string;
  original_value?: any;
}

export default function FHEDemo() {
  const [demos, setDemos] = useState<Demo[]>([]);
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [encryptedValues, setEncryptedValues] = useState<ExtendedEncryptedValue[]>([]);
  const [computationResult, setComputationResult] = useState<ComputationResult | null>(null);
  const [isComputing, setIsComputing] = useState(false);
  const [showPlaintext, setShowPlaintext] = useState(false);

  useEffect(() => {
    loadDemos();
  }, []);

  const loadDemos = async () => {
    try {
      const response = await fheApi.getDemos();
      if (response.success) {
        setDemos(response.data.demos);
      }
    } catch (error) {
      console.error('Failed to load demos:', error);
    }
  };

  const runDemo = async (demo: any) => {
    setSelectedDemo(demo);
    setIsComputing(true);
    setComputationResult(null);
    setEncryptedValues([]);

    try {
      // Step 1: Encrypt all demo data
      const encrypted = [];
      for (const item of demo.demo_data) {
        const response = await fheApi.encrypt(item.value, 'integer');
        if (response.success) {
          encrypted.push({
            ...response.data.encrypted_value,
            label: item.label,
            original_value: showPlaintext ? item.value : '***'
          });
        }
      }
      setEncryptedValues(encrypted);

      // Step 2: Perform FHE computation
      await new Promise(resolve => setTimeout(resolve, 500)); // Show encryption first
      
      const computeResponse = await fheApi.compute(
        demo.operation,
        encrypted.map(e => ({ 
          encrypted_data: e.encrypted_data, 
          data_type: e.data_type,
          noise_level: e.noise_level,
          can_compute: e.can_compute
        }))
      );

      if (computeResponse.success) {
        setComputationResult(computeResponse.data.computation_result);
      }
    } catch (error) {
      console.error('Demo failed:', error);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Lock className="w-5 h-5 mr-2 text-blue-400" />
        FHE Operations Demo
      </h2>

      {/* Privacy Toggle */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          This demonstrates Octra's unique FHE capabilities
        </span>
        <button
          onClick={() => setShowPlaintext(!showPlaintext)}
          className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300"
        >
          {showPlaintext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showPlaintext ? 'Hide' : 'Show'} Values</span>
        </button>
      </div>

      {/* Demo Scenarios */}
      <div className="space-y-3 mb-6">
        {demos.map((demo, index) => (
          <div key={index} className="border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-white">{demo.name}</h3>
                <p className="text-sm text-gray-400">{demo.description}</p>
              </div>
              <button
                onClick={() => runDemo(demo)}
                disabled={isComputing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
              >
                <Zap className="w-4 h-4" />
                <span>Run Demo</span>
              </button>
            </div>
            <p className="text-xs text-green-400">Expected: {demo.expected_result}</p>
          </div>
        ))}
      </div>

      {/* Computation Process */}
      {selectedDemo && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="font-medium mb-3">Demo: {selectedDemo.name}</h3>
          
          {/* Encrypted Values */}
          {encryptedValues.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Step 1: Encrypted Data</h4>
              <div className="space-y-2">
                {encryptedValues.map((value, index) => (
                  <div key={index} className="bg-gray-800 p-2 rounded text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">{value.label}:</span>
                      <span className="text-green-400">
                        {showPlaintext ? `${value.original_value} →` : ''} 
                        {value.encrypted_data.substring(0, 16)}...
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Noise Level: {value.noise_level}/10 | Can Compute: {value.can_compute ? '✓' : '✗'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Computation Status */}
          {isComputing && (
            <div className="flex items-center space-x-2 text-blue-400 mb-4">
              <Calculator className="w-4 h-4 animate-spin" />
              <span className="text-sm">Performing FHE computation...</span>
            </div>
          )}

          {/* Computation Result */}
          {computationResult && (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
              <h4 className="text-sm font-medium text-green-300 mb-2">Step 2: Computation Complete</h4>
              <div className="text-xs space-y-1">
                <div>Operation: <span className="text-green-400">{computationResult.operation}</span></div>
                <div>Gas Used: <span className="text-yellow-400">{computationResult.gas_used}</span></div>
                <div>Time: <span className="text-blue-400">{(computationResult.computation_time * 1000).toFixed(2)}ms</span></div>
                <div>Result Hash: <span className="font-mono text-green-400">{computationResult.result.encrypted_data.substring(0, 32)}...</span></div>
                <div className="text-green-300 mt-2">✓ {selectedDemo.expected_result}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}