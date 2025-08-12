'use client';
import React from 'react';
import { LogEntry } from '@/types/device';

interface ActivityLogsProps {
  logs: LogEntry[];
}

export default function ActivityLogs({ logs }: ActivityLogsProps) {
  const getLogStyles = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-900/20 border-green-500 text-green-300';
      case 'error':
        return 'bg-red-900/20 border-red-500 text-red-300';
      case 'warning':
        return 'bg-yellow-900/20 border-yellow-500 text-yellow-300';
      default:
        return 'bg-blue-900/20 border-blue-500 text-blue-300';
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Activity Logs</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            No activity yet. Connect a device to start.
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`text-xs p-2 rounded border-l-2 ${getLogStyles(log.type)}`}
            >
              <div className="font-mono text-xs text-gray-400 mb-1">{log.timestamp}</div>
              <div>{log.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}