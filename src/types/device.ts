export interface DeviceState {
  isConnected: boolean;
  isUnlocked: boolean;
  screen: 'home' | 'wallet' | 'confirm' | 'signed';
  balance: string;
  address: string;
  pin: string;
  awaitingConfirmation: boolean;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export interface DeviceInfo {
  id: string;
  name: string;
  icon: string;
}

export interface DeviceActions {
  setSelectedDevice: (device: string) => void;
  connectDevice: () => void;
  disconnectDevice: () => void;
  unlockDevice: () => void;
  simulateTransaction: () => void;
  confirmTransaction: () => void;
  rejectTransaction: () => void;
  resetDevice: () => void;
  updatePin: (pin: string) => void;
}