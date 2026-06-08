import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, AlertCircle, Mail, User, MessageSquare, Briefcase } from 'lucide-react';
import { db, collection, addDoc, serverTimestamp } from '../../firebase';

interface CollaborationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const INQUIRY_TYPES = [
  'Website Development',
  'AI Agent Integration',
  'API Automation',
  'Digital Systems',
  'Content Platform',
  'Robotics Project',
  'Technical Mentorship',
  'Other',
];

export const CollaborationForm: React.FC<CollaborationFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      await addDoc(collection(db, 'collaboration_requests'), {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        status: 'New',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', inquiryType: '', message: '' });
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-[32px] border border-[#c2c6d6]/35 shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-extrabold text-[#0b1c30]">Start a Project</h2>
              <p className="text-xs text-[#424754]/70 font-semibold mt-1">Fill in the details and I'll get back to you.</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
              <X size={16} className="text-[#0b1c30]" />
            </button>
          </div>

          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-extrabold text-[#0b1c30] mb-1">Request Sent!</h3>
              <p className="text-sm text-[#424754]/70">I'll review your project and reach out soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-1.5 block">Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/40" />
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white border border-[#c2c6d6]/30 rounded-xl outline-none focus:border-[#0b1c30] text-[#0b1c30] placeholder:text-[#424754]/40 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-1.5 block">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/40" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white border border-[#c2c6d6]/30 rounded-xl outline-none focus:border-[#0b1c30] text-[#0b1c30] placeholder:text-[#424754]/40 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-1.5 block">Inquiry Type</label>
                <div className="relative">
                  <Briefcase size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#424754]/40 z-10" />
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white border border-[#c2c6d6]/30 rounded-xl outline-none focus:border-[#0b1c30] text-[#0b1c30] appearance-none font-semibold"
                  >
                    <option value="">Select a category...</option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#424754]/60 mb-1.5 block">Project Details *</label>
                <div className="relative">
                  <MessageSquare size={14} className="absolute left-3.5 top-3 text-[#424754]/40" />
                  <textarea
                    placeholder="Describe your project, idea, or what you need help with..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full pl-9 pr-3 py-3 text-sm bg-white border border-[#c2c6d6]/30 rounded-xl outline-none focus:border-[#0b1c30] text-[#0b1c30] placeholder:text-[#424754]/40 font-semibold resize-none"
                    required
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-3 rounded-xl">
                  <AlertCircle size={14} />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 rounded-full bg-[#0b1c30] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#d1f34d] hover:text-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Request <Send size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
