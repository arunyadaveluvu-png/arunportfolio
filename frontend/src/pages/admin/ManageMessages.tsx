import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FiMail, FiTrash2, FiSearch, FiCheck, FiSend, FiX, FiInbox } from 'react-icons/fi';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  const [sendingReply, setSendingReply] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.messages.getAll();
      setMessages(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string, currentRead: boolean) => {
    try {
      await api.messages.markRead(id, !currentRead);
      fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(prev => prev ? { ...prev, is_read: !currentRead } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkReadAndReply = async (msg: Message) => {
    // Optimistically update the message as read in UI state
    setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage(prev => prev ? { ...prev, is_read: true } : null);
    }

    // Open mail client immediately
    const mailtoUrl = `mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || 'Inquiry'}`)}&body=${encodeURIComponent(`Hi ${msg.name},\n\n`)}`;
    window.location.href = mailtoUrl;

    // Update database in the background if it was unread
    if (!msg.is_read) {
      try {
        await api.messages.markRead(msg.id, true);
      } catch (err) {
        console.error('Failed to mark read in database:', err);
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText) return;

    setSendingReply(true);
    setError(null);
    setSuccess(null);

    try {
      await api.messages.reply(selectedMessage.id, replyText);
      setSuccess('Reply sent successfully!');
      setReplyText('');
      fetchMessages();
      
      // Update selected message in view to read
      setSelectedMessage(prev => prev ? { ...prev, is_read: true } : null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send reply email.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.messages.delete(id);
      setSelectedMessage(null);
      fetchMessages();
    } catch (err) {
      console.error(err);
      alert('Failed to delete message.');
    }
  };

  // Search & Filter computation
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = 
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(search.toLowerCase())) ||
      msg.message.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !msg.is_read) ||
      (filter === 'read' && msg.is_read);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Inquiries Inbox</h1>
        <p className="text-gray-400 text-sm mt-1">Review contact inquiries, track requests, and mail replies.</p>
      </div>

      {/* Control panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <FiSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or keywords..."
            className="block w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
          />
        </div>

        {/* Filter Toggles */}
        <div className="flex space-x-2">
          {(['all', 'unread', 'read'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                filter === opt
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border-transparent'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Messages list */}
          <div className="xl:col-span-1 glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col max-h-[60vh] overflow-y-auto pr-1">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setReplyText('');
                    setError(null);
                    setSuccess(null);
                    if (!msg.is_read) {
                      handleMarkRead(msg.id, false);
                    }
                  }}
                  className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-all flex flex-col justify-between space-y-2 ${
                    selectedMessage?.id === msg.id ? 'bg-purple-600/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${msg.is_read ? 'text-gray-400' : 'text-purple-300'}`}>
                      {msg.name}
                    </span>
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[9px] text-gray-500">
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleMarkReadAndReply(msg)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${msg.is_read ? 'bg-white/5 border-white/5 text-gray-400 hover:text-purple-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white'}`}
                        title="Mark Read and Reply via Email"
                      >
                        <FiCheck className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p className={`text-xs truncate font-medium ${msg.is_read ? 'text-gray-500' : 'text-gray-200 font-semibold'}`}>
                    {msg.subject || 'No Subject'}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate leading-relaxed">
                    {msg.message}
                  </p>
                </button>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-2">
                <FiInbox className="w-8 h-8 text-gray-600" />
                <span className="text-xs">No inquiries in this folder.</span>
              </div>
            )}
          </div>

          {/* Message Detail View */}
          <div className="xl:col-span-2">
            {selectedMessage ? (
              <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-md font-bold text-white tracking-tight">{selectedMessage.subject}</h3>
                    <p className="text-purple-300 text-xs font-semibold mt-1 flex flex-wrap items-center gap-1">
                      <span>From: {selectedMessage.name}</span>
                      <a
                        href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject || 'Inquiry'}`)}`}
                        className="text-blue-400 hover:text-blue-300 underline flex items-center space-x-1"
                        title="Send email directly"
                      >
                        <span>({selectedMessage.email})</span>
                        <FiMail className="w-3.5 h-3.5" />
                      </a>
                    </p>
                    <span className="text-[9px] text-gray-500 block mt-2">
                      Received: {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMarkReadAndReply(selectedMessage)}
                      className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                        selectedMessage.is_read ? 'bg-white/5 border-white/5 text-gray-400 hover:text-purple-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white'
                      }`}
                      title="Mark Read and Reply via Email"
                    >
                      <FiCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(selectedMessage.id)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Delete inquiry"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-xs text-gray-300 whitespace-pre-line leading-relaxed">
                  {selectedMessage.message}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendReply} className="space-y-4 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Reply</h4>

                  {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs">
                      {success}
                    </div>
                  )}

                  <textarea
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response email..."
                    rows={4}
                    className="block w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/5 focus:border-purple-500/40 text-sm text-white placeholder-gray-600 focus:outline-none transition-all resize-none"
                  />

                   <div className="flex items-center justify-end space-x-3">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject || 'Inquiry'}`)}&body=${encodeURIComponent(replyText)}`}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-semibold text-xs transition-all duration-300 cursor-pointer"
                    >
                      <FiMail className="w-4 h-4 text-purple-400" />
                      <span>Reply via Email App</span>
                    </a>
                    <button
                      type="submit"
                      disabled={sendingReply || !replyText}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-600/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {sendingReply ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          <span>Send Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 glass-panel border border-white/5 rounded-2xl text-gray-500 text-sm">
                Select an inquiry from the list to view details and draft a reply.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageMessages;
