'use client';
import { useState, useCallback } from 'react';
import { DeviceState, LogEntry, DeviceActions } from '@/types/device';
import { DEFAULT_PIN, MOCK_ADDRESS, MOCK_BALANCE, INITIAL_ADDRESS, INITIAL_BALANCE } from '@/utils/constants';

const initialDeviceState: DeviceState = {
  isConnected: false,
  isUnlocked: false,
  screen: 'home',
  balance: INITIAL_BALANCE,
  address: INITIAL_ADDRESS,
  pin: '',
  awaitingConfirmation: false
};

export const useDeviceSimulator = () => {
  const [selectedDevice, setSelectedDevice] = useState('ledger');
  const [deviceState, setDeviceState] = useState<DeviceState>(initialDeviceState);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-50), { timestamp, message, type }]);
  }, []);

  const connectDevice = useCallback(() => {
    setDeviceState(prev => ({ ...prev, isConnected: true }));
    addLog(`${selectedDevice.charAt(0).toUpperCase() + selectedDevice.slice(1)} device connected`, 'success');
  }, [selectedDevice, addLog]);

  const disconnectDevice = useCallback(() => {
    setDeviceState(prev => ({ 
      ...prev, 
      isConnected: false, 
      isUnlocked: false,
      screen: 'home',
      awaitingConfirmation: false 
    }));
    addLog('Device disconnected', 'warning');
  }, [addLog]);

  const unlockDevice = useCallback(() => {
    if (deviceState.pin === DEFAULT_PIN) {
      setDeviceState(prev => ({ 
        ...prev, 
        isUnlocked: true, 
        screen: 'wallet',
        address: MOCK_ADDRESS,
        balance: MOCK_BALANCE
      }));
      addLog('Device unlocked successfully', 'success');
    } else {
      addLog('Invalid PIN', 'error');
    }
  }, [deviceState.pin, addLog]);

  const simulateTransaction = useCallback(() => {
    setDeviceState(prev => ({ ...prev, awaitingConfirmation: true, screen: 'confirm' }));
    addLog('Transaction confirmation requested', 'info');
  }, [addLog]);

  const confirmTransaction = useCallback(() => {
    setDeviceState(prev => ({ ...prev, awaitingConfirmation: false, screen: 'signed' }));
    addLog('Transaction signed successfully', 'success');
    setTimeout(() => {
      setDeviceState(prev => ({ ...prev, screen: 'wallet' }));
    }, 2000);
  }, [addLog]);

  const rejectTransaction = useCallback(() => {
    setDeviceState(prev => ({ ...prev, awaitingConfirmation: false, screen: 'wallet' }));
    addLog('Transaction rejected by user', 'warning');
  }, [addLog]);

  const resetDevice = useCallback(() => {
    setDeviceState(initialDeviceState);
    setLogs([]);
  }, []);

  const updatePin = useCallback((pin: string) => {
    setDeviceState(prev => ({ ...prev, pin }));
  }, []);

  const actions: DeviceActions = {
    setSelectedDevice,
    connectDevice,
    disconnectDevice,
    unlockDevice,
    simulateTransaction,
    confirmTransaction,
    rejectTransaction,
    resetDevice,
    updatePin
  };

  return {
    selectedDevice,
    deviceState,
    logs,
    actions
  };
};