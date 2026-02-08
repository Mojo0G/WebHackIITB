import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User, Radio } from 'lucide-react';

const ChatSidebar = ({ asteroidId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    newSocket.emit('join_room', asteroidId);
    newSocket.on('receive_message', (data) => setMessages((prev) => [...prev, data]));
    return () => newSocket.disconnect();
  }, [asteroidId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;
    const messageData = { room: asteroidId, author: 'Cmdr. Guest', message: newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, messageData]); 
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[500px] bg-cosmic-glass backdrop-blur-xl rounded-3xl border border-cosmic-border shadow-glass-lg overflow-hidden">
      
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <h3 className="font-rajdhani font-bold text-white flex items-center gap-2 tracking-wide">
            <Radio size={18} className="text-neon-cyan animate-pulse" /> SECURE COMMS
        </h3>
        <span className="text-[10px] text-neon-cyan/70 font-mono border border-neon-cyan/30 px-2 py-0.5 rounded bg-neon-cyan/5">
          ENCRYPTED
        </span>
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
          <div key={idx} className="flex gap-3 animate-float">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
              <User size={14} className="text-white" />
            </div>
            <div className="bg-white/5 p-3 rounded-r-xl rounded-bl-xl border border-white/5 backdrop-blur-sm max-w-[80%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-neon-cyan font-rajdhani tracking-wide">{msg.author}</span>
                <span className="text-[9px] text-gray-500 font-mono">{msg.time}</span>
              </div>
              <p className="text-sm text-gray-200 leading-relaxed font-inter">{msg.message}</p>
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
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-neon-cyan focus:bg-black/40 focus:shadow-glow-cyan outline-none transition-all font-rajdhani tracking-wide"
            />
            <button type="submit" className="absolute right-2 p-2 bg-neon-cyan/10 text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-black transition">
            <Send size={16} />
            </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSidebar;