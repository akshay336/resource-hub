import React, { useState } from 'react';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Loader2, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordModal({ isOpen, onClose, onOtpVerified }) {
  const { requestPasswordReset, verifyOTP } = useAuth();
  
  const [step, setStep] = useState('EMAIL'); // 'EMAIL' | 'OTP'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoHint, setDemoHint] = useState('');

  if (!isOpen) return null;

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your work email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setDemoHint(res.demoOtp);
      setStep('OTP');
    } catch (err) {
      setError(err.message || 'Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await verifyOTP(email, fullOtp);
      onOtpVerified(email);
    } catch (err) {
      setError(err.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('EMAIL');
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setError('');
    setDemoHint('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 !m-0 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-brand-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-[#4056d6]" />
            </div>
            <h3 className="font-semibold text-slate-800 text-sm">
              {step === 'EMAIL' ? 'Account Recovery' : 'Verify Identity'}
            </h3>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="text-center pb-2">
                <p className="text-sm font-medium text-slate-700">Forgot your password?</p>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered enterprise email address and we'll send a 6-digit authorization code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. pm.rao@resourcehub.corp"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#4056d6] hover:bg-[#3245b5] text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center pb-1">
                <p className="text-sm font-medium text-slate-700">Enter 6-Digit Code</p>
                <p className="text-xs text-slate-500 mt-1">
                  We've sent an authorization code to <span className="font-semibold text-slate-700">{email}</span>
                </p>
              </div>

              {demoHint && (
                <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
                  <span className="text-xs font-medium text-[#4056d6]">
                    ✨ Demo Simulation OTP: <strong className="font-bold tracking-widest">{demoHint}</strong>
                  </span>
                </div>
              )}

              {/* 6-box OTP input */}
              <div className="flex justify-center gap-2 py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-box-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] focus:border-transparent transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#4056d6] hover:bg-[#3245b5] text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </button>

              <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setStep('EMAIL')}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to email
                </button>
                <button
                  type="button"
                  onClick={handleSendCode}
                  className="text-[#4056d6] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Resend Code
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
