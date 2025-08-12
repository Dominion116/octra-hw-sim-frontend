'use client';
import React from 'react';
import { Monitor } from 'lucide-react';
import { DeviceState } from '@/types/device';
import DeviceScreen from './DeviceScreen';
import ApiEndpoints from './ApiEndpoints';

interface DeviceDisplayProps {
  selectedDevice: string;
  deviceState: DeviceState;
}

export default function DeviceDisplay({ selectedDevice, deviceState }: DeviceDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Monitor className="w-5 h-5 mr-2 text-blue-400" />
          {selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} Display
        </h2>
        
        <div className="space-y-4">
          <DeviceScreen deviceState={deviceState} />
          
          <div className="text-xs text-gray-400 space-y-1">
            <div>Status: {deviceState.isConnected ? 'Connected' : 'Disconnected'}</div>
            <div>Security: {deviceState.isUnlocked ? 'Unlocked' : 'Locked'}</div>
            <div>Screen: {deviceState.screen}</div>
          </div>
        </div>
      </div>

      <ApiEndpoints />
    </div>
  );
}