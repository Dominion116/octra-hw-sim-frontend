'use client';
import React from 'react';
import { Shield } from 'lucide-react';
import { DeviceState } from '@/types/device';

interface DeviceScreenProps {
  deviceState: DeviceState;
}

export default function DeviceScreen({ deviceState }: DeviceScreenProps) {
  const screenContent = {
    home: (
      <div className="text-center">
        <Shield className="w-8 h-8 mx-auto mb-2 text-blue-400" />
        <div className="text-sm">Device Locked</div>
        <div className="text-xs mt-1 text-gray-400">Enter PIN</div>
      </div>
    ),
    wallet: (
      <div className="text-center">
        <div className="text-xs text-gray-400 mb-1">OCTRA Balance</div>
        <div className="text-lg font-mono">{deviceState.balance}</div>
        <div className="text-xs mt-1 text-gray-400 truncate">{deviceState.address}</div>
      </div>
    ),
    confirm: (
      <div className="text-center">
        <div className="text-xs text-yellow-400 mb-2">Confirm Transaction</div>
        <div className="text-sm">Send 10.5 OCTRA</div>
        <div className="text-xs mt-1 text-gray-400">to octra1abc...</div>
        <div className="flex justify-center mt-2 space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    ),
    signed: (
      <div className="text-center">
        <div className="text-green-400 text-sm">✓ Signed</div>
        <div className="text-xs mt-1 text-gray-400">Transaction Complete</div>
      </div>
    )
  };

  return (
    <div className="bg-black text-white p-4 rounded-lg border border-gray-700 h-32 flex items-center justify-center">
      {screenContent[deviceState.screen]}
    </div>
  );
}