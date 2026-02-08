import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User, Radio, AlertCircle, CheckCircle } from 'lucide-react';
import API_BASE_URL from '../api.config';

const ChatSidebar = ({ asteroidId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log('🔌 ChatSidebar: Initializing Socket.io connection');
    console.log('  API_BASE_URL:', API_BASE_URL);
    console.log('  asteroidId:', asteroidId);
    
    const newSocket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Socket.io connected:', newSocket.id);
      setConnectionStatus('connected');
      // Join this asteroid's room for chat
      newSocket.emit('join_room', asteroidId);
      console.log('📍 Joined room:', asteroidId);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.io disconnected');
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 Socket.io connection error:', error.message);
      setConnectionStatus('error');
    });

    // Message events
    newSocket.on('receive_message', (data) => {
      console.log('📨 Message received:', data);
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on('user_joined', (data) => {
      console.log('👤 User joined:', data);
      setMessages((prev) => [...prev, { 
        author: 'SYSTEM', 
        message: data.message, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSystem: true
      }]);
    });

    setSocket(newSocket);

    return () => {
      console.log('🧹 Cleaning up Socket.io connection');
      newSocket.disconnect();
    };
  }, [asteroidId]);

  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) {
      console.warn('⚠️  Cannot send: message empty or socket disconnected');
      return;
    }

    const messageData = { 
      room: asteroidId, 
      author: 'Cmdr. Guest', 
      message: newMessage, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    console.log('📤 Sending message:', messageData);
    
    // Emit to server
    socket.emit('send_message', messageData);
    
    // Add to local state immediately
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-cosmic-glass backdrop-blur-xl rounded-3xl border border-cosmic-border shadow-glass-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h3 className="font-rajdhani font-bold text-white flex items-center gap-2 tracking-wide">
            <Radio size={18} className={`${connectionStatus === 'connected' ? 'text-neon-cyan animate-pulse' : connectionStatus === 'error' ? 'text-hazard-critical' : 'text-gray-400'}`} /> SECURE COMMS
        </h3>
        <div className="flex items-center gap-2">
          {connectionStatus === 'connected' && (
            <span className="text-[10px] text-green-400 font-mono border border-green-400/50 px-2 py-0.5 rounded bg-green-400/10 flex items-center gap-1">
              <CheckCircle size={10} /> ONLINE
            </span>
          )}
          {connectionStatus === 'connecting' && (
            <span className="text-[10px] text-gray-400 font-mono border border-gray-400/50 px-2 py-0.5 rounded bg-gray-400/10">
              CONNECTING...
            </span>
          )}
          {connectionStatus === 'error' && (
            <span className="text-[10px] text-hazard-critical font-mono border border-hazard-critical/50 px-2 py-0.5 rounded bg-hazard-critical/10 flex items-center gap-1">
              <AlertCircle size={10} /> ERROR
            </span>
          )}
          {connectionStatus === 'disconnected' && (
            <span className="text-[10px] text-gray-400 font-mono border border-gray-400/50 px-2 py-0.5 rounded bg-gray-400/10">
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neon-purple/20">
        {messages.length === 0 && (
          <div className="text-center mt-20 opacity-50">
            <div className="w-16 h-1 bg-white/10 mx-auto mb-2 rounded-full"></div>
            <p className="text-gray-400 text-xs font-rajdhani tracking-widest">CHANNEL SILENT</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 animate-float ${msg.isSystem ? 'justify-center' : ''}`}>
            {!msg.isSystem && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
                <User size={14} className="text-white" />
              </div>
            )}
            <div className={`p-3 rounded-r-xl rounded-bl-xl border backdrop-blur-sm max-w-[80%] ${
              msg.isSystem 
                ? 'bg-white/5 border-white/5 text-center text-[11px] text-gray-400'
                : 'bg-white/5 border-white/5'
            }`}>
              {!msg.isSystem && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-neon-cyan font-rajdhani tracking-wide">{msg.author}</span>
                  <span className="text-[9px] text-gray-500 font-mono">{msg.time}</span>
                </div>
              )}
              <p className={`leading-relaxed font-inter ${msg.isSystem ? '' : 'text-sm text-gray-200'}`}>{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-white/5">
        <div className="relative flex items-center">
            <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Transmit data..."
            disabled={connectionStatus !== 'connected'}
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-neon-cyan focus:bg-black/40 focus:shadow-glow-cyan outline-none transition-all font-rajdhani tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit" 
              disabled={connectionStatus !== 'connected' || !newMessage.trim()}
              className="absolute right-2 p-2 bg-neon-cyan/10 text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <Send size={16} />
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSidebar;