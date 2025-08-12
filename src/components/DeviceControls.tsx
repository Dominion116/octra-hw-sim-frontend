'use client';
import React from 'react';
import { Key } from 'lucide-react';
import { DeviceState, DeviceActions } from '@/types/device';

interface DeviceControlsProps {
  deviceState: DeviceState;
  actions: DeviceActions;
}

export default function DeviceControls({ deviceState, actions }: DeviceControlsProps) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Key className="w-5 h-5 mr-2 text-blue-400" />
        Device Controls
      </h2>
      
      <div className="space-y-4">
        {!deviceState.isUnlocked ? (
          <div>
            <label className="block text-sm font-medium mb-2">PIN Code</label>
            <div className="flex space-x-2">
              <input
                type="password"
                placeholder="Enter PIN (1234)"
                value={deviceState.pin}
                onChange={(e) => actions.updatePin(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={actions.unlockDevice}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Unlock
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={actions.simulateTransaction}
              disabled={deviceState.awaitingConfirmation}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              Simulate Transaction
            </button>
            
            {deviceState.awaitingConfirmation && (
              <div className="flex space-x-2">
                <button
                  onClick={actions.rejectTransaction}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={actions.confirmTransaction}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}