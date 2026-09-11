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
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row relative overflow-x-hidden">
      
      {/* ==================== LEFT BRANDING COLUMN (60%) ==================== */}
      <div className="w-full lg:w-[60%] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0b0f19] p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
        
        {/* Ambient tech glow & pattern */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4056d6]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

        {/* Brand Logo Header & Hero Info */}
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4056d6] to-[#6b7cff] flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white">Resource<span className="text-[#8492ff]">Hub</span></span>
              <span className="block text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Enterprise Edition</span>
            </div>
          </div>

          <div className="mt-12 lg:mt-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-[#8492ff] text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Version 3.0 • Production Spec</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent Workforce &amp; Project Resource Planning
            </h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              Streamline staffing blueprints, cross-project bandwidth sharing, candidate matching, and enterprise utilization in real-time.
            </p>
          </div>
        </div>

        {/* Feature Highlights Card */}
        <div className="my-8 lg:my-10 p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-md space-y-3.5 relative z-10 max-w-2xl">
          <div className="flex items-start gap-3 text-sm text-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span><strong className="text-white">Role-Based Access Control</strong> (Admin, Delivery Head, PM, HR)</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span><strong className="text-white">Automated Gap Engine &amp; 100% Guard</strong> prevents over-allocation</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span><strong className="text-white">Cross-Project Sharing</strong> with peer-to-peer approvals</span>
          </div>
        </div>

        {/* Footer Trust Marker */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10 max-w-2xl">
          <span className="flex items-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-emerald-400" />
            256-bit Encrypted
          </span>
          <span className="font-medium">Single Sign-On (SSO) Ready</span>
        </div>
      </div>

      {/* ==================== RIGHT LOGIN FORM COLUMN (40%) ==================== */}
      <div className="w-full lg:w-[40%] min-h-screen bg-slate-50/60 flex flex-col justify-between p-8 sm:p-10 lg:p-12 relative">
        
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-50 pointer-events-none"></div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto relative z-10 py-6">
          
          {/* Form Title */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Corporate Sign In</h1>
            <p className="text-slate-500 text-sm mt-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4056d6] focus:border-transparent transition-all shadow-sm"
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
                  className="text-xs font-medium text-[#4056d6] hover:text-[#3245b5] hover:underline cursor-pointer"
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
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4056d6] focus:border-transparent transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  className="w-4 h-4 text-[#4056d6] rounded border-slate-300 focus:ring-[#4056d6] cursor-pointer"
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
          <div className="mt-8 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Quick-Fill Demo Roles (Click to Autofill):
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Static Test Mode</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              {DEMO_ACCOUNTS.map((account) => {
                const isSelected = email.toLowerCase() === account.email.toLowerCase();
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleQuickFill(account)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer shadow-sm ${
                      isSelected
                        ? 'bg-indigo-50 border-[#4056d6] ring-1 ring-[#4056d6]'
                        : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
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
                    <span className="text-[11px] text-slate-500 block truncate mt-0.5 font-medium">
                      {account.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Help Text */}
        <div className="pt-6 text-center text-xs text-slate-400 border-t border-slate-200/80 relative z-10 max-w-md mx-auto w-full">
          Need assistance? Contact <a href="#" className="text-slate-600 hover:text-slate-900 font-medium underline">Enterprise IT Support</a> or view <a href="#" className="text-slate-600 hover:text-slate-900 font-medium underline">Security Policy</a>.
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
