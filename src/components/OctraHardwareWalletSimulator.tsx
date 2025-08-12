'use client';
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useDeviceSimulator } from '@/hooks/useDeviceSimulator';
import DeviceConfiguration from './DeviceConfiguration';
import DeviceDisplay from './DeviceDisplay';
import ActivityLogs from './ActivityLogs';

export default function OctraHardwareWalletSimulator() {
  const { selectedDevice, deviceState, logs, actions } = useDeviceSimulator();

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Hardware Wallet Simulator</h1>
                <p className="text-sm text-gray-400">Test Octra hardware wallet integration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {deviceState.isConnected ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : (
                  <WifiOff className="w-5 h-5 text-gray-500" />
                )}
                <span className="text-sm text-gray-400">
                  {deviceState.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DeviceConfiguration 
            selectedDevice={selectedDevice}
            deviceState={deviceState}
            onDeviceChange={actions.setSelectedDevice}
            onConnect={actions.connectDevice}
            onDisconnect={actions.disconnectDevice}
            onReset={actions.resetDevice}
            actions={actions}
          />
          <DeviceDisplay 
            selectedDevice={selectedDevice}
            deviceState={deviceState}
          />
          <ActivityLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}