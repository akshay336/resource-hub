import React, { useState, useEffect } from 'react';
import { 
  Lock, Mail, Eye, EyeOff, Shield, ArrowRight, 
  Layers, Users, CheckCircle, AlertCircle, Loader2, Sparkles, Building2
} from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import ResetPasswordModal from '../components/auth/ResetPasswordModal';

export default function LoginPage() {
  const { login, rememberedEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Recovery modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Pre-fill remembered email if present
  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [rememberedEmail]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your work email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing demo roles
  const handleQuickFill = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
    showToast(`Loaded ${account.role} credentials (${account.name})`);
  };

  const handleOtpVerified = (verifiedUserEmail) => {
    setShowForgotModal(false);
    setVerifiedEmail(verifiedUserEmail);
    setShowResetModal(true);
  };

  const handleResetSuccess = () => {
    setShowResetModal(false);
    showToast('Password updated! You can now log in with your new password.');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center relative overflow-hidden">
      
      {/* Subtle Background Pattern & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-3xl shadow-card border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          
          {/* ==================== LEFT BRANDING COLUMN ==================== */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#0f172a] p-8 sm:p-10 flex flex-col justify-between text-white relative">
            
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4056d6]/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Brand Logo Header */}
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4056d6] to-[#6b7cff] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-white">Resource<span className="text-[#8492ff]">Hub</span></span>
                  <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Enterprise Edition</span>
                </div>
              </div>

              <div className="mt-12 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[#8492ff] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Version 3.0 • Production Spec</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Intelligent Workforce &amp; Project Resource Planning
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Streamline staffing blueprints, cross-project bandwidth sharing, candidate matching, and enterprise utilization in real-time.
                </p>
              </div>
            </div>

            {/* Feature Highlights Card */}
            <div className="my-8 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm space-y-3">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span><strong>Role-Based Access Control</strong> (Admin, Delivery Head, PM, HR)</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span><strong>Automated Gap Engine &amp; 100% Guard</strong> prevents over-allocation</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span><strong>Cross-Project Sharing</strong> with peer-to-peer approvals</span>
              </div>
            </div>

            {/* Footer Trust Marker */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                256-bit Encrypted
              </span>
              <span>Single Sign-On (SSO) Ready</span>
            </div>
          </div>


          {/* ==================== RIGHT LOGIN FORM COLUMN ==================== */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-white">
            
            <div>
              {/* Form Title */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Corporate Sign In</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Access your assigned projects, team rosters, and resource operations.
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-3 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Work Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Corporate Email
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

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-medium text-[#4056d6] hover:text-[#3245b5] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4056d6] focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#4056d6] rounded border-slate-300 focus:ring-[#4056d6]"
                    />
                    <span className="text-xs text-slate-600 font-medium">Remember my work email</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#4056d6] hover:bg-[#3245b5] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In to Workspace
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick-Fill Demo Roles Toolbar (For Smooth Testing) */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Quick-Fill Demo Roles (Click to Autofill):
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">Static Test Mode</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEMO_ACCOUNTS.map((account) => {
                    const isSelected = email.toLowerCase() === account.email.toLowerCase();
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleQuickFill(account)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-[#4056d6] ring-1 ring-[#4056d6]'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            account.role === 'System Admin' ? 'bg-indigo-500' :
                            account.role === 'Delivery Head' ? 'bg-blue-500' :
                            account.role === 'Project Manager' ? 'bg-emerald-500' : 'bg-purple-500'
                          }`} />
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {account.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                          {account.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom Help Text */}
            <div className="mt-8 pt-4 text-center text-xs text-slate-400 border-t border-slate-100">
              Need assistance? Contact <a href="#" className="text-slate-600 hover:text-slate-900 font-medium underline">Enterprise IT Support</a> or view <a href="#" className="text-slate-600 hover:text-slate-900 font-medium underline">Security Policy</a>.
            </div>

          </div>

        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Password Recovery Modals */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onOtpVerified={handleOtpVerified}
      />

      <ResetPasswordModal
        isOpen={showResetModal}
        email={verifiedEmail}
        onClose={() => setShowResetModal(false)}
        onSuccess={handleResetSuccess}
      />

    </div>
  );
}
