import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Send, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MessagesPage = () => {
  const { user } = useAuth();
  const { members = [], projects = [] } = useProjects();
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // Can be a user or a project
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('new-message', (message) => {
        // Check if message belongs to current chat
        const isCurrentChat = selectedChat && (
          (message.project?._id === selectedChat._id) || 
          (message.sender._id === selectedChat._id && message.recipient?._id === user.id) ||
          (message.sender._id === user.id && message.recipient?._id === selectedChat._id)
        );

        if (isCurrentChat) {
          setMessages(prev => [...prev, message]);
        } else {
          toast.info(`New message from ${message.sender.name}`);
        }
      });

      return () => socket.off('new-message');
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      if (selectedChat.title) { // It's a project
        socket?.emit('join-project', selectedChat._id);
      }
      fetchMessages();
    }
  }, [selectedChat]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages');
      const filtered = res.data.data.filter(m => {
        if (selectedChat.title) { // Project
          return m.project?._id === selectedChat._id;
        } else { // Private
          return (m.sender._id === selectedChat._id && m.recipient?._id === user.id) ||
                 (m.sender._id === user.id && m.recipient?._id === selectedChat._id);
        }
      });
      setMessages(filtered);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedChat) return;

    setSending(true);
    try {
      const chatId = selectedChat._id || selectedChat.id;
      if (!chatId) {
        toast.error('Invalid chat selection');
        return;
      }

      const payload = selectedChat.title 
        ? { projectId: chatId, content }
        : { recipientId: chatId, content };

      const res = await api.post('/messages', payload);
      
      // Add message immediately for feedback
      setMessages(prev => {
        if (prev.find(m => m._id === res.data.data._id)) return prev;
        return [...prev, res.data.data];
      });
      
      setContent('');
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const otherMembers = members.filter(m => m._id !== user.id);

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 overflow-hidden">
      {/* Chats Sidebar */}
      <div className="w-80 glass-card flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5">
          <h2 className="text-lg font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="glass-input w-full pl-10 text-sm py-2"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-2">
            <h3 className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Teams</h3>
            {projects.map(p => (
              <div 
                key={p._id} 
                onClick={() => setSelectedChat(p)}
                className={`p-3 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-white/5 transition-colors mb-1
                  ${selectedChat?._id === p._id ? 'bg-primary-500/10 border-l-2 border-primary-500' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                  {p.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{p.title}</h4>
                  <p className="text-[10px] text-slate-400 truncate">{p.teamMembers?.length} Members</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-white/5">
            <h3 className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">Private Chats</h3>
            {otherMembers.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-[10px]">No members found</div>
            ) : (
              otherMembers.map((m) => (
                <div 
                  key={m._id} 
                  onClick={() => setSelectedChat(m)}
                  className={`p-3 flex items-center gap-3 cursor-pointer rounded-lg hover:bg-white/5 transition-colors mb-1
                    ${selectedChat?._id === m._id ? 'bg-primary-500/10 border-l-2 border-primary-500' : ''}`}
                >
                  <img src={m.avatar} className="w-10 h-10 rounded-full border border-white/10 object-cover" alt={m.name} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card flex flex-col min-w-0">
        {!selectedChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
              <MessageSquare size={32} />
            </div>
            <p>Select a team or member to start chatting</p>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedChat.title ? (
                  <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 font-bold">
                    {selectedChat.title.charAt(0)}
                  </div>
                ) : (
                  <img src={selectedChat.avatar} className="w-10 h-10 rounded-full border border-white/10 object-cover" alt={selectedChat.name} />
                )}
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedChat.title || selectedChat.name}</h4>
                  <p className="text-[10px] text-emerald-400 capitalize">{selectedChat.title ? 'Team Broadcast' : selectedChat.role}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-4">
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin text-primary-500" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">No messages yet. Say hello!</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md p-3 rounded-2xl ${
                      msg.sender._id === user.id 
                        ? 'bg-primary-500/20 border border-primary-500/30 rounded-tr-none' 
                        : 'bg-white/5 border border-white/5 rounded-tl-none'
                    }`}>
                      <p className="text-sm text-slate-200">{msg.content}</p>
                      <span className={`text-[10px] mt-1 block ${msg.sender._id === user.id ? 'text-primary-400/50 text-right' : 'text-slate-500'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type your message..." 
                  className="glass-input flex-1 py-3"
                />
                <button 
                  type="submit"
                  disabled={sending || !content.trim()}
                  className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
