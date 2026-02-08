import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const NotificationDropdown = ({ notifications, onClose }) => {
  if (!notifications.length) return null;

  return (
    <div className="absolute top-16 right-4 w-80 bg-cosmic-900 border border-cosmic-border rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h4 className="font-rajdhani font-bold text-white tracking-wider">SYSTEM ALERTS</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={16}/></button>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No active threats.</div>
        ) : (
          notifications.map((notif, idx) => (
            <div key={idx} className="p-4 border-b border-white/5 hover:bg-white/5 transition flex gap-3">
              <div className="mt-1">
                 {notif.type === 'CRITICAL' ? <AlertTriangle size={16} className="text-hazard-critical animate-pulse"/> : <Info size={16} className="text-neon-blue"/>}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono mb-1">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                <p className="text-sm text-white font-rajdhani leading-tight">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;