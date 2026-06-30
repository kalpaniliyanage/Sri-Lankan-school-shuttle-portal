/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DatabaseState, executeSql, SQLResult } from '../utils/db';
import { Terminal, Play, HelpCircle, FileText, Check, Database } from 'lucide-react';

interface SqlPlaygroundProps {
  state: DatabaseState;
}

export default function SqlPlayground({ state }: SqlPlaygroundProps) {
  const [sqlQuery, setSqlQuery] = useState<string>("SELECT SUM(Amount) FROM Invoices WHERE Status='Paid';");
  const [result, setResult] = useState<SQLResult | null>(null);

  // Quick Preset Queries
  const presets = [
    { label: "Total Paid Income Sum", sql: "SELECT SUM(Amount) FROM Invoices WHERE Status='Paid';" },
    { label: "Pending Invoices Count", sql: "SELECT COUNT(*) FROM Invoices WHERE Status='Pending';" },
    { label: "Total Students Count", sql: "SELECT COUNT(*) FROM Students;" },
    { label: "All Registered Students List", sql: "SELECT * FROM Students;" },
    { label: "Drivers Records", sql: "SELECT * FROM Drivers;" },
    { label: "Active Fleet Vehicles", sql: "SELECT * FROM Vehicles;" }
  ];

  const handleRunQuery = (queryText: string) => {
    const res = executeSql(state, queryText);
    setResult(res);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-lg p-6 space-y-6 font-mono" id="sql-playground-card">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-md font-bold text-slate-100 tracking-tight font-sans">SQLite SQL Interactive Playground</h2>
            <p className="text-xs text-slate-400 font-sans">Run native SQL commands directly on the live client-side SQLite emulator state.</p>
          </div>
        </div>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-bold uppercase tracking-widest border border-slate-700">
          SQLite 3 Emulation
        </span>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Preset Queries & Help */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1 font-sans">
              <HelpCircle className="w-4 h-4 shrink-0" /> C# / SQLite Design Queries
            </h3>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              These preset queries match the C# queries from your project outline. Click to load into the console:
            </p>

            <div className="space-y-1.5 pt-1">
              {presets.map((p, index) => (
                <button
                  key={index}
                  onClick={() => setSqlQuery(p.sql)}
                  className="w-full text-left text-[11px] p-2 hover:bg-slate-850 bg-slate-900 rounded border border-slate-800 text-slate-300 font-mono transition-colors truncate block"
                  title={p.sql}
                >
                  <span className="text-amber-500 font-semibold block text-[10px] uppercase font-sans mb-0.5">{p.label}</span>
                  <code>{p.sql}</code>
                </button>
              ))}
            </div>
          </div>

          {/* Database Schema Viewer */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1 font-sans">
              <FileText className="w-4 h-4 text-slate-500" /> DB Table Manifest
            </h4>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div>• <span className="text-slate-200">Students</span>: ID, FullName, School, Grade, MonthlyFee, VehicleID</div>
              <div>• <span className="text-slate-200">Drivers</span>: ID, Name, NIC, Phone, LicenseNo, VehicleID</div>
              <div>• <span className="text-slate-200">Conductors</span>: ID, Name, NIC, Phone, VehicleID</div>
              <div>• <span className="text-slate-200">Vehicles</span>: ID, RegNo, Model, Capacity, RouteName</div>
              <div>• <span className="text-slate-200">Invoices</span>: ID, StudentID, Month, Year, Amount, Status, CreatedDate</div>
              <div>• <span className="text-slate-200">Payments</span>: ID, InvoiceID, PaidAmount, PaidDate, Method</div>
            </div>
          </div>
        </div>

        {/* Right Side: Command Prompt & Results Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Terminal className="w-4 h-4 text-slate-500" /> SQLite Prompt
            </label>
            <div className="flex gap-2">
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-400 focus:outline-hidden focus:border-amber-500 h-20 resize-none"
                placeholder="SELECT * FROM Students;"
              />
              <button
                onClick={() => handleRunQuery(sqlQuery)}
                id="btn-run-sql"
                className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-all active:scale-95 font-semibold cursor-pointer shrink-0"
              >
                <Play className="w-5 h-5" />
                <span className="text-[10px] uppercase">Run</span>
              </button>
            </div>
          </div>

          {/* Result Output Terminal */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 min-h-[12rem] flex flex-col justify-between overflow-x-auto">
            {result ? (
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800 pb-2 mb-3">
                  <span>SQLite Command Executed Successfully</span>
                  <span>{result.count} rows returned</span>
                </div>

                {result.error ? (
                  <div className="text-rose-500 text-xs py-2">
                    ⚡ SQLite ERROR: {result.error}
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                          {result.columns.map((col, idx) => (
                            <th key={idx} className="p-2">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40 text-slate-300">
                        {result.rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-900/50">
                            {row.map((cell, cellIdx) => (
                              <td key={cellIdx} className="p-2 truncate max-w-[200px]" title={String(cell)}>
                                {cell === null ? <span className="text-slate-600 font-bold italic">NULL</span> : String(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-500 text-xs flex flex-col items-center justify-center py-12 gap-2 text-center">
                <Terminal className="w-8 h-8 text-slate-700 animate-pulse" />
                <span>sqlite&gt; Type or select a SQL query and click "Run Query" to see output records.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
