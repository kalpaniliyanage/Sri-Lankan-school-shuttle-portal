import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Server, KeyRound, Check, ArrowRight, Play } from 'lucide-react';
// @ts-ignore
import appLogo from '../assets/images/app_logo_1782819908730.jpg';
// @ts-ignore
import shuttleIllustration from '../assets/images/shuttle_illustration_1782823811226.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

const loadingSteps = [
  { text: 'Starting Local Database Engine...', icon: Server },
  { text: 'Loading private configuration rules...', icon: ShieldCheck },
  { text: 'Initializing school shuttle routes...', icon: KeyRound },
  { text: 'Portal ready!', icon: Check },
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Fast automatic load: 1.5 seconds splash duration
    const duration = 1500;
    const intervalTime = 20;
    const stepsCount = loadingSteps.length;
    const totalTicks = duration / intervalTime;
    let tick = 0;

    const timer = setInterval(() => {
      tick += 1;
      const currentProgress = Math.min((tick / totalTicks) * 100, 100);
      setProgress(currentProgress);

      // Determine step index based on progress
      const nextStepIndex = Math.min(
        Math.floor((currentProgress / 100) * stepsCount),
        stepsCount - 1
      );
      if (nextStepIndex !== currentStepIndex) {
        setCurrentStepIndex(nextStepIndex);
      }

      if (tick >= totalTicks) {
        clearInterval(timer);
        // Slightly delayed automatic trigger for natural feeling
        const timeout = setTimeout(() => {
          onComplete();
        }, 300);
        return () => clearTimeout(timeout);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete, currentStepIndex]);

  const CurrentStepIcon = loadingSteps[currentStepIndex].icon;

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center overflow-hidden z-50 select-none">
      {/* Dynamic ambient lighting bubbles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-[400px] h-[400px] bg-slate-800/35 rounded-full blur-[120px] pointer-events-none" />

      {/* Main glassmorphism card container */}
      <div className="relative z-10 max-w-4xl w-full mx-4 bg-slate-900/60 border border-slate-800/85 rounded-3xl overflow-hidden shadow-2xl shadow-slate-950/80 grid grid-cols-1 md:grid-cols-12 gap-0 backdrop-blur-md">
        
        {/* Left Side: Modern Scenic Illustration */}
        <div className="md:col-span-5 relative bg-slate-950 flex flex-col justify-between p-8 border-b md:border-b-0 md:border-r border-slate-800/80">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90 z-10" />
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          
          {/* Image */}
          <img 
            src={shuttleIllustration} 
            alt="School Shuttle Scenic Illustration" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />

          {/* Top content of the left side */}
          <div className="relative z-20">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 uppercase tracking-widest inline-block mb-3">
              Individual Project
            </span>
          </div>

          {/* Bottom content of the left side */}
          <div className="relative z-20 text-left">
            <p className="text-xs font-mono text-amber-500 font-extrabold uppercase tracking-widest mb-1">
              Private Utility
            </p>
            <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight mb-2">
              School Shuttle Manager
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              A handy local tool designed to coordinate driver routes, student registers, monthly billing status, and local activity log histories.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Branding & Fast Boot Controls */}
        <div className="md:col-span-7 p-8 md:p-12 flex flex-col justify-between min-h-[420px] md:min-h-[480px]">
          
          {/* Logo, Title and Badges */}
          <div className="flex items-start gap-4 text-left">
            {/* Logo Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative shrink-0"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-2xl blur opacity-25" />
              <div className="relative p-0.5 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={appLogo}
                  alt="App Logo"
                  className="w-16 h-16 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>

            {/* Typography */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest font-mono block">
                Personal App
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none">
                School Shuttle Assistant
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                React & Vite Modern Management Interface
              </p>
            </div>
          </div>

          {/* Center Loading progress indicators */}
          <div className="space-y-4 my-8 text-left">
            {/* Dynamic Step Text */}
            <div className="h-6 overflow-hidden flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-xs text-slate-300 font-mono"
                >
                  <CurrentStepIcon className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '2.5s' }} />
                  <span className="font-medium">{loadingSteps[currentStepIndex].text}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Glowing Linear Progress Bar */}
            <div className="w-full bg-slate-950/90 border border-slate-800 rounded-full h-3 overflow-hidden p-[1px] shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 rounded-full relative"
                style={{ width: `${progress}%` }}
                layoutId="progress-bar-fill"
              >
                {/* Glossy light effect */}
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white blur-[3px] opacity-40" />
              </motion.div>
            </div>

            {/* Technical Detail Label */}
            <div className="flex justify-between items-center text-[10px] font-bold font-mono text-slate-500 uppercase tracking-wider">
              <span>{Math.floor(progress)}% Local System Ready</span>
              <span className="text-amber-500/80">Offline Client</span>
            </div>
          </div>

          {/* Bottom Row: Skip / Enter Now Button (Super User Friendly!) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/50">
            <div className="text-left hidden sm:block">
              <p className="text-[10px] text-slate-500 font-bold font-mono tracking-wide uppercase">
                Host Server
              </p>
              <p className="text-xs text-slate-300 font-mono font-bold">
                localhost:3000 (React Dev Client)
              </p>
            </div>

            {/* "Quick Go to Login" Interactive Trigger */}
            <button
              onClick={onComplete}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.98]"
            >
              <span>Enter Portal Now</span>
              <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
            </button>
          </div>

        </div>

      </div>

      {/* Aesthetic Frame Corner Brackets */}
      <div className="absolute top-6 left-6 border-t-2 border-l-2 border-slate-800 w-4 h-4 rounded-tl pointer-events-none" />
      <div className="absolute top-6 right-6 border-t-2 border-r-2 border-slate-800 w-4 h-4 rounded-tr pointer-events-none" />
      <div className="absolute bottom-6 left-6 border-b-2 border-l-2 border-slate-800 w-4 h-4 rounded-bl pointer-events-none" />
      <div className="absolute bottom-6 right-6 border-b-2 border-r-2 border-slate-800 w-4 h-4 rounded-br pointer-events-none" />
    </div>
  );
}
