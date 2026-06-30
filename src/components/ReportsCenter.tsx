/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Invoice, Student, Vehicle, Payment } from '../types';
import { FileSpreadsheet, Printer, TrendingUp, Users, AlertCircle, Coins, Search, Sparkles } from 'lucide-react';

interface ReportsCenterProps {
    invoices: Invoice[];
    students: Student[];
    vehicles: Vehicle[];
}

export default function ReportsCenter({ invoices, students, vehicles }: ReportsCenterProps) {
    const [reportType, setReportType] = useState<'defaulters' | 'route_revenue' | 'school_totals'>('defaulters');
    const [selectedMonth, setSelectedMonth] = useState<string>('June');
    const [selectedYear, setSelectedYear] = useState<number>(2026);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = [2025, 2026, 2027];

    // ==================== REPORT 1: DEFAULTERS ====================
    const defaulterInvoices = invoices.filter(inv =>
        inv.Month === selectedMonth &&
        inv.Year === selectedYear &&
        (inv.Status === 'Pending' || inv.Status === 'Overdue')
    );

    const defaultersData = defaulterInvoices.map(inv => {
        const student = students.find(s => s.StudentID === inv.StudentID);
        const vehicle = student ? vehicles.find(v => v.VehicleID === student.VehicleID) : null;
        return {
            InvoiceID: inv.InvoiceID,
            StudentID: inv.StudentID,
            Name: student ? student.FullName : 'Deleted Student',
            School: student ? student.School : '',
            Grade: student ? student.Grade : '',
            Vehicle: vehicle ? vehicle.RegNo : 'Unassigned',
            Route: vehicle ? vehicle.RouteName : 'Unassigned',
            Amount: inv.Amount,
            Status: inv.Status
        };
    });

    const totalOutstandingDefaulters = defaultersData.reduce((acc, d) => acc + d.Amount, 0);

    // ==================== REPORT 2: ROUTE REVENUE ====================
    const routeRevenueData = vehicles.map(vehicle => {
        // Invoices for students on this vehicle
        const vehicleStudentIds = students.filter(s => s.VehicleID === vehicle.VehicleID).map(s => s.StudentID);
        const vehicleInvoices = invoices.filter(inv =>
            inv.Month === selectedMonth &&
            inv.Year === selectedYear &&
            vehicleStudentIds.includes(inv.StudentID)
        );

        const paid = vehicleInvoices.filter(i => i.Status === 'Paid').reduce((sum, i) => sum + i.Amount, 0);
        const pending = vehicleInvoices.filter(i => i.Status === 'Pending' || i.Status === 'Overdue').reduce((sum, i) => sum + i.Amount, 0);
        const total = paid + pending;

        return {
            VehicleID: vehicle.VehicleID,
            RegNo: vehicle.RegNo,
            Route: vehicle.RouteName,
            TotalStudents: vehicleStudentIds.length,
            Collected: paid,
            Outstanding: pending,
            Expected: total
        };
    });

    // ==================== REPORT 3: SCHOOL TOTALS ====================
    // Group students by school
    const uniqueSchools = Array.from(new Set(students.map(s => s.School)));
    const schoolTotalsData = uniqueSchools.map((school, idx) => {
        const schoolStudents = students.filter(s => s.School === school);
        const studentIds = schoolStudents.map(s => s.StudentID);
        const schoolInvoices = invoices.filter(inv =>
            inv.Month === selectedMonth &&
            inv.Year === selectedYear &&
            studentIds.includes(inv.StudentID)
        );

        const collected = schoolInvoices.filter(i => i.Status === 'Paid').reduce((sum, i) => sum + i.Amount, 0);
        const outstanding = schoolInvoices.filter(i => i.Status === 'Pending' || i.Status === 'Overdue').reduce((sum, i) => sum + i.Amount, 0);

        return {
            id: idx + 1,
            School: school,
            StudentCount: schoolStudents.length,
            CollectedRevenue: collected,
            OutstandingRevenue: outstanding,
            GrossTotal: collected + outstanding
        };
    });

    // ==================== EXPORT TO CSV GENERATOR ====================
    const handleExportCsv = () => {
        let csvContent = "data:text/csv;charset=utf-8,";

        if (reportType === 'defaulters') {
            csvContent += "Invoice ID,Student ID,Passenger Name,School,Grade,Vehicle No,Amount Due,Status\n";
            defaultersData.forEach(d => {
                csvContent += `ST-${d.InvoiceID},#${d.StudentID},"${d.Name}","${d.School}","${d.Grade}","${d.Vehicle}",${d.Amount},${d.Status}\n`;
            });
        } else if (reportType === 'route_revenue') {
            csvContent += "Vehicle Reg No,Transport Route,Active Students,Collected Income (LKR),Outstanding Fees (LKR),Expected Total (LKR)\n";
            routeRevenueData.forEach(r => {
                csvContent += `"${r.RegNo}","${r.Route}",${r.TotalStudents},${r.Collected},${r.Outstanding},${r.Expected}\n`;
            });
        } else {
            csvContent += "School Name,Student Count,Collected Income (LKR),Outstanding Outstanding (LKR),Expected Expected (LKR)\n";
            schoolTotalsData.forEach(s => {
                csvContent += `"${s.School}",${s.StudentCount},${s.CollectedRevenue},${s.OutstandingRevenue},${s.GrossTotal}\n`;
            });
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `school_transport_report_${reportType}_${selectedMonth}_${selectedYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl p-6" id="reports-center-card">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-4 border-b border-slate-800/60 no-print">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1 bg-amber-500/10 text-amber-400 rounded-lg">
                            <Sparkles className="w-4 h-4" />
                        </span>
                        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Compliance & Reports Center</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Generate fleet operational indices, school aggregates, and accounts in default.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportCsv}
                        id="btn-export-csv"
                        className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-emerald-500/5"
                    >
                        <FileSpreadsheet className="w-4 h-4" /> Export Ledger CSV
                    </button>
                    <button
                        onClick={handlePrint}
                        id="btn-print-report"
                        className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer transition-all active:scale-[0.98]"
                    >
                        <Printer className="w-4 h-4" /> Print Report Sheet
                    </button>
                </div>
            </div>

            {/* Selector Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-850 no-print">
                {/* Report Type Selector */}
                <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Select Intelligence Profile</label>
                    <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setReportType('defaulters')}
                            className={`px-3 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all ${reportType === 'defaulters' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Defaulters Directory
                        </button>
                        <button
                            onClick={() => setReportType('route_revenue')}
                            className={`px-3 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all ${reportType === 'route_revenue' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Route Revenue
                        </button>
                        <button
                            onClick={() => setReportType('school_totals')}
                            className={`px-3 py-2 text-xs font-bold rounded-lg text-center cursor-pointer transition-all ${reportType === 'school_totals' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            School Summaries
                        </button>
                    </div>
                </div>

                {/* Month Selection */}
                <div className="w-32 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Month</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden cursor-pointer h-10"
                    >
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>

                {/* Year Selection */}
                <div className="w-28 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Year</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden cursor-pointer h-10"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {/* Dynamic Report Content Wrapper (Styled for beautiful printing also) */}
            <div className="border border-slate-800/80 rounded-2xl p-6 bg-slate-950/20" id="printable-report-area">
                {/* Printable Sheet Header */}
                <div className="hidden print:block text-center space-y-1 pb-6 mb-6 border-b border-dashed border-slate-800">
                    <h2 className="text-xl font-bold uppercase text-slate-100">School Shuttle Assistant</h2>
                    <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">{reportType.replace('_', ' ')} Report Profile</p>
                    <p className="text-xs text-slate-500 font-mono">Run: {selectedMonth} {selectedYear} • Generated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Defaulters Report Section */}
                {reportType === 'defaulters' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-rose-300 uppercase tracking-tight">Active Commuters Defaulting</h4>
                                    <p className="text-xs text-slate-400">Displaying students with pending or overdue bills for {selectedMonth} {selectedYear}.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-rose-400 font-bold block uppercase tracking-wider">Total Default Amount</span>
                                <span className="text-xl font-black text-rose-400 font-mono">{totalOutstandingDefaulters.toLocaleString()} LKR</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/30">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-3.5 pl-4">Invoice ID</th>
                                        <th className="p-3.5">Student Passenger</th>
                                        <th className="p-3.5">School Name</th>
                                        <th className="p-3.5">Grade</th>
                                        <th className="p-3.5">Assigned Vehicle</th>
                                        <th className="p-3.5">Outstanding Fee</th>
                                        <th className="p-3.5 pr-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                                    {defaultersData.map((d, index) => (
                                        <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                                            <td className="p-3.5 pl-4 font-mono font-bold text-slate-500">#INV-{d.InvoiceID}</td>
                                            <td className="p-3.5 font-bold text-white">{d.Name}</td>
                                            <td className="p-3.5 text-slate-400">{d.School}</td>
                                            <td className="p-3.5 text-slate-400">{d.Grade}</td>
                                            <td className="p-3.5 font-semibold text-slate-300">{d.Vehicle}</td>
                                            <td className="p-3.5 font-mono font-bold text-rose-400">{d.Amount.toLocaleString()} LKR</td>
                                            <td className="p-3.5 pr-4 text-center">
                                                <span className={`px-2.5 py-1 font-bold text-[9px] uppercase tracking-wider rounded-full border ${d.Status === 'Overdue' ? 'bg-rose-500/10 border-rose-500/25 text-rose-400' : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                                                    }`}>
                                                    {d.Status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {defaultersData.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center text-slate-500 font-medium">
                                                Excellent! There are no defaulting passenger accounts for {selectedMonth} {selectedYear}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Route Financials Report Section */}
                {reportType === 'route_revenue' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2.5 bg-slate-900/60 p-4 border border-slate-800/60 rounded-xl">
                            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Fleet Route Financial Balance</h4>
                                <p className="text-xs text-slate-400">Aggregated breakdown of collection totals, outstanding debt, and projected yields for {selectedMonth} {selectedYear}.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/30">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-3.5 pl-4">Vehicle No</th>
                                        <th className="p-3.5">Assigned Route</th>
                                        <th className="p-3.5 text-center">Active Passengers</th>
                                        <th className="p-3.5">Collected (LKR)</th>
                                        <th className="p-3.5">Outstanding (LKR)</th>
                                        <th className="p-3.5 pr-4 text-right">Projected Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                                    {routeRevenueData.map((r, index) => (
                                        <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                                            <td className="p-3.5 pl-4 font-mono font-bold text-amber-400">{r.RegNo}</td>
                                            <td className="p-3.5 text-slate-300">{r.Route}</td>
                                            <td className="p-3.5 text-center font-bold text-white">{r.TotalStudents}</td>
                                            <td className="p-3.5 font-mono text-emerald-400 font-bold">{r.Collected.toLocaleString()} LKR</td>
                                            <td className="p-3.5 font-mono text-rose-400 font-bold">{r.Outstanding.toLocaleString()} LKR</td>
                                            <td className="p-3.5 pr-4 text-right font-mono font-extrabold text-white">{r.Expected.toLocaleString()} LKR</td>
                                        </tr>
                                    ))}
                                    {routeRevenueData.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                                                No active transport vehicle routes found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* School Summaries Section */}
                {reportType === 'school_totals' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2.5 bg-slate-900/60 p-4 border border-slate-800/60 rounded-xl">
                            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">School Destination Summaries</h4>
                                <p className="text-xs text-slate-400">Breakdown of active commuters and collections mapped across partner education institutions.</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/30">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        <th className="p-3.5 pl-4">ID</th>
                                        <th className="p-3.5">Institution Name</th>
                                        <th className="p-3.5 text-center">Active Passengers</th>
                                        <th className="p-3.5">Collected (LKR)</th>
                                        <th className="p-3.5">Outstanding (LKR)</th>
                                        <th className="p-3.5 pr-4 text-right">Total Billing Expected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                                    {schoolTotalsData.map((school, index) => (
                                        <tr key={index} className="hover:bg-slate-900/40 transition-colors">
                                            <td className="p-3.5 pl-4 font-mono text-slate-500 font-bold">#S-0{school.id}</td>
                                            <td className="p-3.5 font-bold text-white">{school.School}</td>
                                            <td className="p-3.5 text-center font-bold text-white">{school.StudentCount}</td>
                                            <td className="p-3.5 font-mono text-emerald-400 font-bold">{school.CollectedRevenue.toLocaleString()} LKR</td>
                                            <td className="p-3.5 font-mono text-rose-400 font-bold">{school.OutstandingRevenue.toLocaleString()} LKR</td>
                                            <td className="p-3.5 pr-4 text-right font-mono font-extrabold text-white">{school.GrossTotal.toLocaleString()} LKR</td>
                                        </tr>
                                    ))}
                                    {schoolTotalsData.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-500 font-medium">
                                                No registered school destinations found. Register student passengers to collect statistics.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
