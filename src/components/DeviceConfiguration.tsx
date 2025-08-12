'use client';
import React from 'react';
import { Usb, Smartphone, Shield, Settings, Play, Square, RotateCcw } from 'lucide-react';
import { DeviceState, DeviceActions } from '@/types/device';
import { DEVICES } from '@/utils/constants';
import DeviceControls from './DeviceControls';

interface DeviceConfigurationProps {
  selectedDevice: string;
  deviceState: DeviceState;
  onDeviceChange: (device: string) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onReset: () => void;
  actions: DeviceActions;
}

const iconMap = {
  Usb,
  Smartphone,
  Shield
};

export default function DeviceConfiguration({
  selectedDevice,
  deviceState,
  onDeviceChange,
  onConnect,
  onDisconnect,
  onReset,
  actions
}: DeviceConfigurationProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-400" />
          Device Configuration
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hardware Wallet Type</label>
            <div className="space-y-2">
              {DEVICES.map(device => {
                const IconComponent = iconMap[device.icon as keyof typeof iconMap];
                return (
                  <label key={device.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="device"
                      value={device.id}
                      checked={selectedDevice === device.id}
                      onChange={(e) => onDeviceChange(e.target.value)}
                      className="text-blue-600 focus:ring-blue-500 bg-gray-800 border-gray-700"
                    />
                    <IconComponent className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{device.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-2">
            {!deviceState.isConnected ? (
              <button
                onClick={onConnect}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Connect</span>
              </button>
            ) : (
              <button
                onClick={onDisconnect}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>Disconnect</span>
              </button>
            )}
            <button
              onClick={onReset}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {deviceState.isConnected && (
        <DeviceControls 
          deviceState={deviceState}
          actions={actions}
        />
      )}
    </div>
  );
}