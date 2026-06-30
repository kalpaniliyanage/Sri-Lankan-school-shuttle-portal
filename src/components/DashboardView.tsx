/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseState } from '../utils/db';
import { 
  Users, Bus, CreditCard, Coins, CheckCircle2, Clock, AlertTriangle, 
  TrendingUp, RefreshCw, ChevronRight, FileText, Sparkles, ShieldAlert,
  CalendarCheck2
} from 'lucide-react';

interface DashboardViewProps {
  state: DatabaseState;
  onGenerateInvoices: () => void;
  onNavigate: (tab: string) => void;
}

export default function DashboardView({ state, onGenerateInvoices, onNavigate }: DashboardViewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Stats Calculations
  const totalStudents = state.students.length;
  const totalDrivers = state.drivers.length;
  const totalConductors = state.conductors.length;
  const totalVehicles = state.vehicles.length;

  const paidInvoices = state.invoices.filter(i => i.Status === 'Paid');
  const totalIncome = paidInvoices.reduce((acc, i) => acc + i.Amount, 0);
  
  const pendingInvoices = state.invoices.filter(i => i.Status === 'Pending');
  const totalPendingAmount = pendingInvoices.reduce((acc, i) => acc + i.Amount, 0);

  const overdueInvoices = state.invoices.filter(i => i.Status === 'Overdue');
  const totalOverdueAmount = overdueInvoices.reduce((acc, i) => acc + i.Amount, 0);

  // Group invoices by month for current year (2026) to make a visual SVG bar chart
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  // Calculate income trend for the past 6 months
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1); // Set to 1st of the month first to prevent 29/30/31 overflow bugs
    d.setMonth(d.getMonth() - (5 - i));
    return months[d.getMonth()];
  });

  const incomeByMonth = last6Months.map(month => {
    const monthPaidInvoices = state.invoices.filter(i => i.Month === month && i.Status === 'Paid');
    const total = monthPaidInvoices.reduce((sum, inv) => sum + inv.Amount, 0);
    return { month, total };
  });

  const maxIncome = Math.max(...incomeByMonth.map(d => d.total), 1000);

  // Status Counts
  const paidCount = state.invoices.filter(i => i.Status === 'Paid').length;
  const pendingCount = pendingInvoices.length;
  const overdueCount = overdueInvoices.length;
  const totalInvoiceCount = state.invoices.length || 1;

  const paidPercentage = Math.round((paidCount / totalInvoiceCount) * 100);
  const pendingPercentage = Math.round((pendingCount / totalInvoiceCount) * 100);
  const overduePercentage = Math.round((overdueCount / totalInvoiceCount) * 100);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onGenerateInvoices();
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Overview Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800/80 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-500/20 text-amber-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white font-sans tracking-tight">System Status Overview</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Real-time stats, boarding statistics, route capacity, and billing streams.</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          id="btn-generate-invoices-dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          {isGenerating ? 'Generating Roster Bills...' : 'Auto-Generate Monthly Invoices'}
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students Card */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => onNavigate('students')} id="stat-card-students">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pupils</span>
            <h3 className="text-3xl font-extrabold text-white font-mono">{totalStudents}</h3>
            <span className="text-[11px] text-amber-400 font-bold inline-flex items-center mt-1">
              Active Commuters <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Fleet Vehicles */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => onNavigate('vehicles')} id="stat-card-vehicles">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Transit Fleet</span>
            <h3 className="text-3xl font-extrabold text-white font-mono">{totalVehicles}</h3>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              {totalDrivers} Drivers / {totalConductors} Conductors
            </span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Bus className="w-6 h-6" />
          </div>
        </div>

        {/* Total Collected Revenue */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => onNavigate('invoices')} id="stat-card-income">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Income</span>
            <h3 className="text-3xl font-extrabold text-emerald-400 font-mono">{totalIncome.toLocaleString()} LKR</h3>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              From {paidInvoices.length} Paid Invoices
            </span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Pending & Overdue Claims */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md flex items-center justify-between hover:border-amber-500/30 transition-all cursor-pointer" onClick={() => onNavigate('invoices')} id="stat-card-pending">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Outstanding</span>
            <h3 className="text-3xl font-extrabold text-rose-400 font-mono">{(totalPendingAmount + totalOverdueAmount).toLocaleString()} LKR</h3>
            <span className="text-[11px] text-slate-400 font-medium block mt-1">
              {pendingCount} Pending / {overdueCount} Overdue
            </span>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts & Stats split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income Trend Chart */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md lg:col-span-2">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800/60">
            <div>
              <h4 className="text-sm font-bold text-white">Monthly Revenue Stream (LKR)</h4>
              <p className="text-xs text-slate-400 mt-0.5">Rolling 6 months paid invoice aggregate totals</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Simple Vector SVG Chart to avoid massive library load bugs */}
          <div className="h-64 flex items-end justify-between px-2 pt-4 relative">
            {/* Grid background lines */}
            <div className="absolute inset-x-0 top-0 border-t border-slate-800/60 border-dashed h-px pointer-events-none"></div>
            <div className="absolute inset-x-0 top-1/3 border-t border-slate-800/60 border-dashed h-px pointer-events-none"></div>
            <div className="absolute inset-x-0 top-2/3 border-t border-slate-800/60 border-dashed h-px pointer-events-none"></div>
            
            {incomeByMonth.map((item, index) => {
              const heightPct = Math.max((item.total / maxIncome) * 100, 5); // caps min height at 5% to show activity
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-4 scale-0 group-hover:scale-100 bg-slate-950 text-amber-400 text-[10px] font-mono px-2.5 py-1.5 rounded-lg border border-slate-800 shadow-xl transition-all z-20 pointer-events-none whitespace-nowrap">
                    {item.total.toLocaleString()} LKR
                  </div>
                  
                  {/* Bar Container with Fixed Height so percentage heights work correctly */}
                  <div className="h-44 w-full flex items-end justify-center relative">
                    {/* Bar */}
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className="w-10 sm:w-16 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg hover:from-amber-450 hover:to-amber-300 shadow-md cursor-pointer transition-all duration-300 relative"
                    >
                      <span className="absolute bottom-1 left-0 right-0 text-[10px] text-center font-bold text-slate-950 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(item.total / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  
                  {/* X Axis Label */}
                  <span className="text-xs text-slate-400 mt-2 font-bold">{item.month.slice(0, 3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Payment Ratio / Status Panel */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white pb-3 border-b border-slate-800/60">Invoice Status Mix</h4>
            
            {/* Visual Circular donut mock with clean SVG */}
            <div className="flex justify-center my-6">
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Background circle */}
                <circle cx="64" cy="64" r="50" stroke="#1e293b" strokeWidth="12" fill="none" />
                
                {/* Paid circle portion */}
                <circle 
                  cx="64" cy="64" r="50" 
                  stroke="#10b981" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - paidPercentage / 100)}`}
                />

                {/* Overdue circle portion */}
                <circle 
                  cx="64" cy="64" r="50" 
                  stroke="#ef4444" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - (paidPercentage + overduePercentage) / 100)}`}
                  style={{ transform: `rotate(${360 * (paidPercentage / 100)}deg)`, transformOrigin: '64px 64px' }}
                />
              </svg>
            </div>

            {/* List with progress bars */}
            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Paid Receipts</span>
                  <span>{paidPercentage}% ({paidCount})</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${paidPercentage}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>Pending Invoices</span>
                  <span>{pendingPercentage}% ({pendingCount})</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${pendingPercentage}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Overdue Notices</span>
                  <span>{overduePercentage}% ({overdueCount})</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-slate-800">
                  <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${overduePercentage}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Activity Logs */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800/80 shadow-md" id="activity-log-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white">System Transaction Audit Logs</h4>
            <p className="text-xs text-slate-400 mt-0.5">Real-time mock logs of localized active database transactions.</p>
          </div>
          <span className="text-[10px] bg-slate-950 text-slate-400 font-mono px-2.5 py-1 rounded-md border border-slate-800">
            Live Stream
          </span>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/60 font-mono text-[11px] max-h-60 overflow-y-auto bg-slate-950/60">
          {state.logs.map((log) => (
            <div key={log.id} className="p-3 flex items-start gap-3 hover:bg-slate-900/60 transition-colors">
              <span className="text-[10px] text-slate-500 whitespace-nowrap mt-0.5 font-bold">{log.timestamp}</span>
              
              <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded tracking-wider whitespace-nowrap ${
                log.category === 'student' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/10' :
                log.category === 'payment' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' :
                log.category === 'invoice' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/10' :
                log.category === 'vehicle' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/10' :
                log.category === 'driver' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' :
                'bg-slate-800 text-slate-300'
              }`}>
                {log.category}
              </span>

              <span className="text-slate-300 flex-1">{log.message}</span>

              <span>
                {log.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />}
                {log.type === 'info' && <Clock className="w-4 h-4 text-slate-500" />}
              </span>
            </div>
          ))}
          {state.logs.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-xs">
              No audit logs recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
