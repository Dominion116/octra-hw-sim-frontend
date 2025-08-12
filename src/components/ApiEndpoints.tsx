'use client';
import React from 'react';
import { API_ENDPOINTS } from '@/utils/constants';

export default function ApiEndpoints() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">API Endpoints</h2>
      <div className="space-y-2 text-sm font-mono">
        {API_ENDPOINTS.map((endpoint, index) => (
          <div key={index} className="flex justify-between">
            <span className={endpoint.color}>{endpoint.method}</span>
            <span className="text-gray-300">{endpoint.path}</span>
          </div>
        ))}
      </div>
    </div>
  );
}