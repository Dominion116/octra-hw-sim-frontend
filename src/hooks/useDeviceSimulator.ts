"use client";
import { useState, useCallback } from "react";
import { DeviceState, LogEntry, DeviceActions } from "@/types/device";
import { deviceApi } from "@/utils/api";
import {
  DEFAULT_PIN,
  MOCK_ADDRESS,
  MOCK_BALANCE,
  INITIAL_ADDRESS,
  INITIAL_BALANCE,
} from "@/utils/constants";

const initialDeviceState: DeviceState = {
  isConnected: false,
  isUnlocked: false,
  screen: "home",
  balance: INITIAL_BALANCE,
  address: INITIAL_ADDRESS,
  pin: "",
  awaitingConfirmation: false,
};

export const useDeviceSimulator = () => {
  const [selectedDevice, setSelectedDevice] = useState("ledger");
  const [deviceState, setDeviceState] =
    useState<DeviceState>(initialDeviceState);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback(
    (message: string, type: LogEntry["type"] = "info") => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prev) => [...prev.slice(-50), { timestamp, message, type }]);
    },
    []
  );

  const connectDevice = useCallback(async () => {
  try {
    const response = await deviceApi.connect(selectedDevice);
    if (response.success) {
      // Sync backend state with frontend
      const statusResponse = await deviceApi.getStatus();
      console.log('Backend status after connect:', statusResponse);
      
      setDeviceState((prev) => ({ ...prev, isConnected: true }));
      addLog(`${selectedDevice} device connected`, "success");
    } else {
      addLog(`Connection failed: ${response.message}`, "error");
    }
  } catch (error) {
    addLog(`Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
  }
}, [selectedDevice, addLog]);

  const disconnectDevice = useCallback(async () => {
    try {
      const response = await deviceApi.disconnect();
      if (response.success) {
        setDeviceState((prev) => ({
          ...prev,
          isConnected: false,
          isUnlocked: false,
          screen: "home",
          awaitingConfirmation: false,
        }));
        addLog("Device disconnected", "warning");
      }
    } catch (error) {
      addLog(`Disconnect error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    }
  }, [addLog]);

  const unlockDevice = useCallback(async () => {
    try {
      const response = await deviceApi.unlock(deviceState.pin);
      if (response.success && response.data.unlocked) {
        setDeviceState((prev) => ({
          ...prev,
          isUnlocked: true,
          screen: "wallet",
          address: response.data.address,
          balance: response.data.balance,
        }));
        addLog("Device unlocked successfully", "success");
      } else {
        addLog("Invalid PIN", "error");
      }
    } catch (error) {
      addLog(`Unlock error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    }
  }, [deviceState.pin, addLog]);

  const simulateTransaction = useCallback(async () => {
  try {
    // Check prerequisites
    if (!deviceState.isConnected) {
      addLog("Device not connected", "error");
      return;
    }
    
    if (!deviceState.isUnlocked) {
      addLog("Device not unlocked", "error");
      return;
    }
    
    const response = await deviceApi.signTransaction();
    if (response.success) {
      setDeviceState((prev) => ({
        ...prev,
        awaitingConfirmation: true,
        screen: "confirm",
      }));
      addLog("Transaction confirmation requested", "info");
    } else {
      addLog(`Transaction failed: ${response.message}`, "error");
    }
  } catch (error) {
    addLog(`Transaction error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
  }
}, [deviceState.isConnected, deviceState.isUnlocked, addLog]);

  const confirmTransaction = useCallback(async () => {
    try {
      const response = await deviceApi.confirmTransaction(true);
      if (response.success) {
        setDeviceState((prev) => ({
          ...prev,
          awaitingConfirmation: false,
          screen: "signed",
        }));
        addLog("Transaction signed successfully", "success");
        setTimeout(() => {
          setDeviceState((prev) => ({ ...prev, screen: "wallet" }));
        }, 2000);
      }
    } catch (error) {
      addLog(`Confirm error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    }
  }, [addLog]);

  const rejectTransaction = useCallback(async () => {
    try {
      const response = await deviceApi.confirmTransaction(false);
      if (response.success) {
        setDeviceState((prev) => ({
          ...prev,
          awaitingConfirmation: false,
          screen: "wallet",
        }));
        addLog("Transaction rejected by user", "warning");
      }
    } catch (error) {
      addLog(`Reject error: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    }
  }, [addLog]);

  const resetDevice = useCallback(() => {
    setDeviceState(initialDeviceState);
    setLogs([]);
  }, []);

  const updatePin = useCallback((pin: string) => {
    setDeviceState((prev) => ({ ...prev, pin }));
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
    updatePin,
  };

  return {
    selectedDevice,
    deviceState,
    logs,
    actions,
  };
};
