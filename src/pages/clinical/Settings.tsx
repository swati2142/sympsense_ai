import React from 'react';
import { Card } from '../../components/ui/Card';

export const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Configuration</h1>
      
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Thresholds & Triggers</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-100 pb-4">
              <div>
                <p className="font-medium">Hypoxia Alert Level</p>
                <p className="text-xs text-gray-500">Trigger SpO2 critical alert below this value</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="range" min="80" max="95" defaultValue="90" className="w-full" />
              </div>
              <div className="text-right font-mono font-bold text-blue-600">90%</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-b border-gray-100 pb-4">
              <div>
                <p className="font-medium">Tachycardia Threshold</p>
                <p className="text-xs text-gray-500">High Heart Rate trigger</p>
              </div>
              <div className="flex items-center gap-2">
                <input type="range" min="100" max="150" defaultValue="120" className="w-full" />
              </div>
              <div className="text-right font-mono font-bold text-blue-600">120 bpm</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Channels</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Telegram Bot Integration</span>
              <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Digests</span>
              <div className="w-11 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
