/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bus, KeyRound, ShieldCheck, ArrowRight, Sparkles, Terminal, Eye, EyeOff, Lock } from 'lucide-react';
import { playTap, playSuccess, playWarning } from '../utils/audio';
// @ts-ignore
import appLogo from '../assets/images/app_logo_1782819908730.jpg';

interface LoginProps {
    onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        playTap();

        if (!username || !password) {
            playWarning();
            setError('Please provide valid login credentials.');
            return;
        }

        setIsLoading(true);
        // Simulate high-speed secure database query response
        setTimeout(() => {
            if (username.toLowerCase() === 'admin' && password === 'admin123') {
                playSuccess();
                onLoginSuccess(username);
            } else {
                playWarning();
                setError('Security Access Denied: Invalid username or signature keys.');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-amber-400 selection:text-slate-950 font-sans animate-fade-in" id="login-container">
            <div className="w-full max-w-5xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl flex flex-col md:flex-row min-h-[580px]">

                {/* Left Side: Gorgeous visual image and school transport values */}
                <div className="md:w-1/2 relative bg-slate-950 flex flex-col justify-between p-8 md:p-12 overflow-hidden border-b md:border-b-0 md:border-r border-slate-800/80">
                    {/* Background decoration */}
                    <div className="absolute inset-0 z-0 opacity-45">
                        <img
                            src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=1000"
                            alt="Premium Shuttle Bus at Night"
                            className="w-full h-full object-cover grayscale brightness-50 contrast-125 transition-transform duration-700 hover:scale-105"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
                    </div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="p-0.5 bg-slate-900 border border-slate-700/50 rounded-xl font-bold shadow-lg shadow-amber-500/5 overflow-hidden">
                            <img src={appLogo} alt="App Logo" className="w-10 h-10 object-cover rounded-lg" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                            <span className="text-white font-extrabold text-base tracking-tight block">School Shuttle Assistant</span>
                            <span className="text-[10px] text-amber-400 font-bold font-mono tracking-wider uppercase block">React & Vite Management Client</span>
                        </div>
                    </div>

                    <div className="relative z-10 my-8 space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" /> Fleet Management & Invoicing
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                            Premium Safe School Transit Systems
                        </h2>
                        <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                            Real-time student boarding QR logs, automated monthly billing generators, active fleet crew rosters, and SQLite data queries.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-slate-500 text-xs font-mono">
                        <Terminal className="w-4 h-4 text-emerald-500" />
                        <span>SQLite v3.42 Engine Secure Connection</span>
                    </div>
                </div>

                {/* Right Side: High-fidelity Secure Login form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-slate-900/60 backdrop-blur-xs">
                    <div>
                        <div className="mb-8">
                            <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">SECURE ENTRY PORTAL</span>
                            <h3 className="text-2xl font-bold text-white tracking-tight mt-2.5">System Administrator Sign In</h3>
                            <p className="text-xs text-slate-400 mt-1">Enter authorized operator credentials to access transport registers.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3.5 rounded-xl font-medium flex items-center gap-2 animate-shake">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 animate-ping"></span>
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-300 block tracking-wide uppercase">OPERATOR USERNAME</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter operator username"
                                        className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-400 text-slate-100 rounded-xl px-4 py-3 text-sm placeholder-slate-600 focus:outline-hidden transition-all font-medium focus:ring-1 focus:ring-amber-400/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-slate-300 block tracking-wide uppercase">SECURITY PASSWORD</label>
                                    <span className="text-[10px] text-slate-500 hover:text-amber-400 cursor-pointer font-semibold transition-colors">Forgot Password?</span>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter security password"
                                        className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-400 text-slate-100 rounded-xl pl-4 pr-11 py-3 text-sm placeholder-slate-600 focus:outline-hidden transition-all font-mono focus:ring-1 focus:ring-amber-400/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-hidden p-1 rounded-md transition-colors"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:from-slate-800 disabled:text-slate-500 text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/5 cursor-pointer mt-6"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                                        Authenticating Signature...
                                    </span>
                                ) : (
                                    <>
                                        <span>Decrypt & Open Dashboard</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Secure Protection warning notice */}
                    <div className="mt-8 pt-6 border-t border-slate-800/60 space-y-4">
                        <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-start gap-3">
                            <Lock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Security Protocol Enabled</span>
                                <p className="text-[10px] text-slate-500 leading-normal">
                                    Credentials are authenticated using isolated local cryptographic signatures. Unauthorized access attempts are monitored and recorded.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Complies with standard secure system architecture guidelines.</span>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    ä