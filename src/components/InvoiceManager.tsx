/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Invoice, Student, Payment, Vehicle } from '../types';
import {
    Search, FileText, CheckCircle2, Clock, AlertTriangle, Coins,
    Printer, X, CreditCard, ChevronRight, CheckCircle, RefreshCw, Calendar,
    QrCode, ShieldAlert, Sparkles, User, Landmark, ArrowLeft, Download
} from 'lucide-react';

interface InvoiceManagerProps {
    invoices: Invoice[];
    students: Student[];
    payments: Payment[];
    vehicles: Vehicle[];
    onPayInvoice: (invoiceId: number, amount: number, method: Payment['Method'], date: string) => void;
    onGenerateInvoices: () => void;
}

export default function InvoiceManager({
    invoices, students, payments, vehicles, onPayInvoice, onGenerateInvoices
}: InvoiceManagerProps) {

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
    const [selectedInvoiceForReceipt, setSelectedInvoiceForReceipt] = useState<Invoice | null>(null);

    // Payment Form Fields
    const [paymentAmount, setPaymentAmount] = useState<number>(2500);
    const [paymentMethod, setPaymentMethod] = useState<Payment['Method']>('Cash');
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Invoice Filter
    const filteredInvoices = invoices.filter(inv => {
        const student = students.find(s => s.StudentID === inv.StudentID);
        const studentName = student ? student.FullName.toLowerCase() : '';
        const schoolName = student ? student.School.toLowerCase() : '';
        const idStr = inv.InvoiceID.toString();
        const matchesSearch = studentName.includes(search.toLowerCase()) ||
            schoolName.includes(search.toLowerCase()) ||
            idStr.includes(search) ||
            inv.Month.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === 'all' || inv.Status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const openPaymentModal = (invoice: Invoice) => {
        setSelectedInvoiceForPayment(invoice);
        setPaymentAmount(invoice.Amount);
        setPaymentMethod('Cash');
        setPaymentDate(new Date().toISOString().split('T')[0]);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoiceForPayment) return;

        onPayInvoice(
            selectedInvoiceForPayment.InvoiceID,
            Number(paymentAmount),
            paymentMethod,
            paymentDate
        );
        setSelectedInvoiceForPayment(null);
    };

    const triggerPrint = () => {
        // Elegant client-side printing using a hidden iframe to bypass browser iframe sandbox restrictions
        const printContent = document.getElementById('printable-receipt-content');
        if (printContent) {
            let iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
            if (iframe) {
                iframe.remove();
            }

            iframe = document.createElement('iframe');
            iframe.id = 'print-iframe';
            iframe.style.position = 'absolute';
            iframe.style.width = '0px';
            iframe.style.height = '0px';
            iframe.style.border = 'none';
            document.body.appendChild(iframe);

            const doc = iframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(`
          <html>
            <head>
              <title>School Transport System - Invoice #${selectedInvoiceForReceipt?.InvoiceID}</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                body { font-family: sans-serif; padding: 40px; background-color: #ffffff; color: #1e293b; }
                @media print {
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
              <script>
                setTimeout(function() {
                  window.print();
                }, 300);
              </script>
            </body>
          </html>
        `);
                doc.close();
            }
        }
    };

    // Function to build standard QR code URL via qrserver
    const getQrCodeUrl = (invoice: Invoice, student: Student | undefined) => {
        const dataString = `ST-INV-${invoice.InvoiceID}-PUPIL-${student?.FullName || 'Unknown'}-FEE-${invoice.Amount}-STATUS-${invoice.Status}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(dataString)}&color=030712`;
    };

    return (
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl p-6" id="invoice-manager-card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
                            <Sparkles className="w-5 h-5" />
                        </span>
                        <h2 className="text-xl font-bold text-white tracking-tight font-sans">Billing Ledger & Invoices</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Generate, audit, and collect passenger transport fees. Instantly verify scanning-enabled boarding QR invoices.</p>
                </div>
                <button
                    onClick={onGenerateInvoices}
                    id="btn-generate-invoices-manager"
                    className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-md shadow-amber-500/5"
                >
                    <RefreshCw className="w-4 h-4" /> Batch Run Monthly Billing
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by Invoice ID, Student Name, School, Month..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                    />
                </div>
                <div className="sm:w-56">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                    >
                        <option value="all">Filter Status: All</option>
                        <option value="paid">Paid Receipts</option>
                        <option value="pending">Pending Invoices</option>
                        <option value="overdue">Overdue Notices</option>
                    </select>
                </div>
            </div>

            {/* Invoice Ledger Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/30">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="p-4">Invoice ID</th>
                            <th className="p-4">Student Passenger</th>
                            <th className="p-4">Billing Cycle</th>
                            <th className="p-4">Amount Due</th>
                            <th className="p-4">Invoice Date</th>
                            <th className="p-4">Boarding QR</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                        {filteredInvoices.map((inv) => {
                            const student = students.find(s => s.StudentID === inv.StudentID);
                            return (
                                <tr key={inv.InvoiceID} className="hover:bg-slate-800/40 transition-colors">
                                    {/* ID */}
                                    <td className="p-4 font-mono text-xs text-slate-500 font-bold">#INV-{inv.InvoiceID}</td>
                                    {/* Student Details */}
                                    <td className="p-4">
                                        {student ? (
                                            <div className="flex items-center gap-2.5">
                                                {student.PhotoUrl && (
                                                    <img
                                                        src={student.PhotoUrl}
                                                        alt={student.FullName}
                                                        referrerPolicy="no-referrer"
                                                        className="w-8 h-8 rounded-full object-cover border border-amber-500/20 shrink-0"
                                                    />
                                                )}
                                                <div>
                                                    <div className="font-bold text-white">{student.FullName}</div>
                                                    <div className="text-[10px] text-slate-400 font-semibold">{student.School} ({student.Grade})</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-rose-400 italic text-xs">Student record deleted</span>
                                        )}
                                    </td>
                                    {/* Billing Cycle */}
                                    <td className="p-4">
                                        <span className="inline-flex items-center gap-1 text-slate-300 font-bold text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                            <Calendar className="w-3.5 h-3.5 text-amber-500/70" /> {inv.Month} {inv.Year}
                                        </span>
                                    </td>
                                    {/* Amount Due */}
                                    <td className="p-4 font-mono font-bold text-amber-400">{inv.Amount.toLocaleString()} LKR</td>
                                    {/* Invoice Date */}
                                    <td className="p-4 text-xs text-slate-400 font-semibold">{inv.CreatedDate}</td>
                                    {/* QR Icon */}
                                    <td className="p-4">
                                        <span
                                            onClick={() => setSelectedInvoiceForReceipt(inv)}
                                            className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold bg-slate-900 hover:bg-amber-400 hover:text-slate-950 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 cursor-pointer transition-colors"
                                            title="Click to view boarding QR code"
                                        >
                                            <QrCode className="w-3.5 h-3.5 shrink-0" />
                                            <span>Scan Code</span>
                                        </span>
                                    </td>
                                    {/* Status Badge */}
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${inv.Status === 'Paid' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
                                                inv.Status === 'Pending' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
                                                    'bg-rose-500/10 border-rose-500/25 text-rose-400'
                                            }`}>
                                            {inv.Status === 'Paid' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                            {inv.Status === 'Pending' && <Clock className="w-3 h-3 text-amber-400" />}
                                            {inv.Status === 'Overdue' && <AlertTriangle className="w-3 h-3 text-rose-400 animate-pulse" />}
                                            {inv.Status}
                                        </span>
                                    </td>
                                    {/* Action buttons */}
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            {inv.Status !== 'Paid' ? (
                                                <button
                                                    onClick={() => openPaymentModal(inv)}
                                                    className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer shadow-md active:scale-95"
                                                    title="Collect Payment"
                                                >
                                                    <Coins className="w-3.5 h-3.5" /> Collect Fee
                                                </button>
                                            ) : (
                                                <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                                    <CheckCircle className="w-3 h-3" /> Settled
                                                </span>
                                            )}

                                            <button
                                                onClick={() => setSelectedInvoiceForReceipt(inv)}
                                                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                                title="Print / View Receipt"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredInvoices.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-12 text-center text-slate-500 text-sm">
                                    No billing invoices matched constraints. Choose "Batch Run Monthly Billing" to trigger.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* COLLECT PAYMENT MODAL */}
            {selectedInvoiceForPayment && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-sm w-full overflow-hidden">
                        <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
                            <h3 className="font-bold text-white text-base">Collect Transport Fee</h3>
                            <button onClick={() => setSelectedInvoiceForPayment(null)} className="text-slate-400 hover:text-white cursor-pointer transition-colors p-1 rounded-lg hover:bg-slate-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
                                <div className="flex justify-between"><span className="text-slate-500 font-medium">INVOICE NUMBER:</span> <span className="font-mono font-bold text-amber-400">#INV-{selectedInvoiceForPayment.InvoiceID}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 font-medium">PASSENGER:</span> <span className="font-bold text-slate-200">{students.find(s => s.StudentID === selectedInvoiceForPayment.StudentID)?.FullName}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 font-medium">BILLING CYCLE:</span> <span className="font-bold text-slate-200">{selectedInvoiceForPayment.Month} {selectedInvoiceForPayment.Year}</span></div>
                                <div className="flex justify-between border-t border-slate-800/80 pt-2 mt-1 font-bold text-white text-sm"><span className="text-slate-400">TOTAL DUE:</span> <span>{selectedInvoiceForPayment.Amount.toLocaleString()} LKR</span></div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">Payment Mode *</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value as Payment['Method'])}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                                >
                                    <option value="Cash">Cash Currency</option>
                                    <option value="Bank Transfer">Bank Transfer (Online)</option>
                                    <option value="Card">Visa / Mastercard POS</option>
                                    <option value="Cheque">Cheque Draft</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">Date Collected *</label>
                                <input
                                    type="date"
                                    required
                                    value={paymentDate}
                                    onChange={(e) => setPaymentDate(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono focus:outline-hidden"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-300 block">Collected Amount (LKR) *</label>
                                <input
                                    type="number"
                                    required
                                    min={0}
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-amber-400 font-mono font-bold focus:outline-hidden focus:border-amber-400"
                                />
                            </div>

                            <div className="pt-5 flex justify-end gap-3 border-t border-slate-800 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSelectedInvoiceForPayment(null)}
                                    className="px-4 py-2.5 text-sm font-semibold border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                                >
                                    Confirm Collection
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PAPER RECEIPT MODAL (VIEW / PRINT DIALOG) */}
            {selectedInvoiceForReceipt && (() => {
                const student = students.find(s => s.StudentID === selectedInvoiceForReceipt.StudentID);
                const paymentRecord = payments.find(p => p.InvoiceID === selectedInvoiceForReceipt.InvoiceID);
                const vehicle = student ? vehicles.find(v => v.VehicleID === student.VehicleID) : null;
                const qrCodeUrl = getQrCodeUrl(selectedInvoiceForReceipt, student);

                return (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden my-8 border border-slate-200">
                            {/* Receipt Options Bar */}
                            <div className="flex items-center justify-between p-4 bg-slate-950 text-white no-print">
                                <h3 className="font-bold text-sm flex items-center gap-1.5 text-slate-100">
                                    <Printer className="w-4 h-4 text-amber-400" /> Digital Receipt Invoice
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={triggerPrint}
                                        className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                                    >
                                        <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                                    </button>
                                    <button onClick={() => setSelectedInvoiceForReceipt(null)} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-slate-800 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Printable Receipt Paper Sheet */}
                            <div className="p-8 bg-white text-slate-800" id="printable-receipt-content">
                                <div className="border-2 border-slate-800 p-6 space-y-6">
                                    {/* Receipt Header */}
                                    <div className="text-center space-y-1.5 pb-4 border-b-2 border-dashed border-slate-300">
                                        <h2 className="text-xl font-extrabold uppercase tracking-tight text-slate-950">School Transport Authority</h2>
                                        <p className="text-xs font-semibold text-slate-500">Official Student Passenger Safety Portal</p>
                                        <p className="text-[10px] text-slate-400 font-mono">Colombo, Western Province • Tel: +94 11 234 5678 • support@transport.edu</p>
                                    </div>

                                    {/* Metadata Row */}
                                    <div className="flex justify-between items-start text-xs font-mono">
                                        <div className="space-y-1">
                                            <div><span className="text-slate-400 font-bold">INVOICE NO:</span> <span className="font-bold text-slate-950">INV-{selectedInvoiceForReceipt.InvoiceID}</span></div>
                                            <div><span className="text-slate-400 font-bold">CYCLE:</span> <span className="font-bold text-slate-900">{selectedInvoiceForReceipt.Month} {selectedInvoiceForReceipt.Year}</span></div>
                                            <div><span className="text-slate-400 font-bold">ISSUED DATE:</span> <span>{selectedInvoiceForReceipt.CreatedDate}</span></div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <div><span className="text-slate-400 font-bold">STATUS:</span> <span className={`font-bold uppercase px-2 py-0.5 rounded ${selectedInvoiceForReceipt.Status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{selectedInvoiceForReceipt.Status}</span></div>
                                            {paymentRecord && (
                                                <>
                                                    <div><span className="text-slate-400 font-bold">TRANSACTION ID:</span> <span className="font-bold">TX-{paymentRecord.PaymentID}</span></div>
                                                    <div><span className="text-slate-400 font-bold">SETTLED DATE:</span> <span className="font-bold">{paymentRecord.PaidDate}</span></div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* QR Code and Passenger Split */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 p-4 border border-slate-200 rounded-xl">
                                        <div className="md:col-span-2 space-y-3">
                                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passenger Credentials</h4>

                                            <div className="space-y-2">
                                                {student && (
                                                    <div className="flex items-center gap-3">
                                                        {student.PhotoUrl && (
                                                            <img
                                                                src={student.PhotoUrl}
                                                                alt={student.FullName}
                                                                referrerPolicy="no-referrer"
                                                                className="w-10 h-10 rounded-full object-cover border border-slate-300"
                                                            />
                                                        )}
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{student.FullName}</div>
                                                            <div className="text-[10px] text-slate-500 font-semibold">{student.School} — {student.Grade}</div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-200 pt-2 text-slate-600 font-medium">
                                                    <div>
                                                        <span className="text-slate-400 text-[9px] block uppercase">Guardian Contact:</span>
                                                        <span className="text-slate-900">{student?.ParentName || "N/A"} ({student?.ParentPhone || "N/A"})</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-400 text-[9px] block uppercase">Assigned Transit Bus:</span>
                                                        <span className="text-slate-900">{vehicle ? `${vehicle.RegNo}` : 'Unassigned'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* QR Code Display */}
                                        <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                                            <img
                                                src={qrCodeUrl}
                                                alt="Invoice scan QR code"
                                                className="w-28 h-28 object-contain"
                                                referrerPolicy="no-referrer"
                                            />
                                            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase mt-1.5 tracking-wider">Boarding QR Code</span>
                                        </div>
                                    </div>

                                    {/* Ledger Table */}
                                    <div className="space-y-2">
                                        <table className="w-full text-xs font-mono border-collapse text-left">
                                            <thead>
                                                <tr className="border-b-2 border-slate-800 font-bold text-slate-900">
                                                    <th className="py-2">Tuition Transport Tariff Details</th>
                                                    <th className="py-2 text-right">Qty</th>
                                                    <th className="py-2 text-right">Rate</th>
                                                    <th className="py-2 text-right">Gross Sum</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 text-slate-700">
                                                <tr>
                                                    <td className="py-3 font-sans font-semibold">Monthly School Transport Bus Commuter Pass</td>
                                                    <td className="py-3 text-right">1</td>
                                                    <td className="py-3 text-right">{selectedInvoiceForReceipt.Amount.toLocaleString()} LKR</td>
                                                    <td className="py-3 text-right font-bold text-slate-950">{selectedInvoiceForReceipt.Amount.toLocaleString()} LKR</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Total section */}
                                    <div className="border-t-2 border-slate-800 pt-4 flex justify-between items-start">
                                        <div className="text-[10px] text-slate-400 font-mono space-y-1">
                                            <div>* Scanning boarding QR verification grants shuttle entry.</div>
                                            <div>* Parent invoice statements are stored digitally.</div>
                                            {paymentRecord && <div>* Payment collected via: <span className="font-bold text-slate-800 font-sans">{paymentRecord.Method}</span></div>}
                                        </div>
                                        <div className="text-right space-y-1 font-mono">
                                            <div className="text-xs text-slate-400">Tariff Rate: <span className="text-slate-900 font-bold">{selectedInvoiceForReceipt.Amount.toLocaleString()} LKR</span></div>
                                            <div className="text-xs text-slate-400">Discounts/Surcharges: <span className="text-slate-950">0.00 LKR</span></div>
                                            <div className="text-base font-extrabold text-slate-950 border-t border-slate-300 pt-1.5 mt-1.5">NET TOTAL: {selectedInvoiceForReceipt.Amount.toLocaleString()} LKR</div>
                                            {paymentRecord && (
                                                <div className="text-xs text-green-700 font-bold mt-1.5 uppercase flex items-center gap-1 justify-end">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Settled in full
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer removed per user request */}
                                </div>
                            </div>

                            {/* Modal Control Footer (visible on screen only, hidden during print) */}
                            <div className="bg-slate-950 px-8 py-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print text-white">
                                <div className="space-y-1 max-w-sm">
                                    <p className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                                        <span>💡</span> Save to Device Guideline
                                    </p>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        To download this invoice as a secure PDF document, click <strong className="text-amber-400">"Print / Save as PDF"</strong> above and change your destination printer to <strong className="text-amber-400">"Save as PDF"</strong>.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedInvoiceForReceipt(null)}
                                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:text-amber-400 shrink-0 border border-slate-700/60"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Close & Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
