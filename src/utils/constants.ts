import { DeviceInfo } from '@/types/device';

export const DEVICES: DeviceInfo[] = [
  { id: 'ledger', name: 'Ledger Nano S', icon: 'Usb' },
  { id: 'trezor', name: 'Trezor Model T', icon: 'Smartphone' },
  { id: 'octra', name: 'Octra Device', icon: 'Shield' }
];

export const DEFAULT_PIN = '1234';
export const MOCK_ADDRESS = 'octra1qpzry9x8gf2tvdw0s3jn54khce6mua7l5ta2m8c';
export const MOCK_BALANCE = '125.80000000';
export const INITIAL_ADDRESS = 'octra1...';
export const INITIAL_BALANCE = '0.00000000';

export const API_ENDPOINTS = [
  { method: 'GET', path: '/api/device/status', color: 'text-green-400' },
  { method: 'POST', path: '/api/device/connect', color: 'text-blue-400' },
  { method: 'POST', path: '/api/transaction/sign', color: 'text-blue-400' },
  { method: 'PUT', path: '/api/device/unlock', color: 'text-yellow-400' }
];

export const OCTRA_COLORS = {
  primary: '#1a1aff',
  primaryHover: '#1616e6',
  background: '#000000',
  surface: '#1a1a1a',
  border: '#333333'
};