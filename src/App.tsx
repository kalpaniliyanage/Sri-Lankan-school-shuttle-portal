/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
    getInitialState, saveState, addLog, DatabaseState
} from './utils/db';
import { Student, Driver, Conductor, Vehicle, Invoice, Payment } from './types';

// Icons
import {
    LayoutDashboard, Users, Bus, FileText, Coins, Terminal,
    ShieldAlert, RefreshCw, Calendar, Clock, LogOut, ShieldCheck, User
} from 'lucide-react';

// Components
import DashboardView from './components/DashboardView';
import StudentManager from './components/StudentManager';
import StaffManager from './components/StaffManager';
import VehicleManager from './components/VehicleManager';
import InvoiceManager from './components/InvoiceManager';
import ReportsCenter from './components/ReportsCenter';
import SqlPlayground from './components/SqlPlayground';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
// @ts-ignore
import appLogo from './assets/images/app_logo_1782819908730.jpg';

export default function App() {
    const [dbState, setDbState] = useState<DatabaseState>(getInitialState);
    const [activeTab, setActiveTab] = useState<string>('dashboard');
    const [showSplash, setShowSplash] = useState<boolean>(true);

    // Custom Login authentication state
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return localStorage.getItem('shuttle_logged_in') === 'true';
    });
    const [operatorName, setOperatorName] = useState<string>(() => {
        return localStorage.getItem('shuttle_operator') || 'Administrator';
    });

    // Trigger auto-save to localstorage whenever state changes
    useEffect(() => {
        saveState(dbState);
    }, [dbState]);

    // Handle successful login
    const handleLoginSuccess = (username: string) => {
        setIsLoggedIn(true);
        setOperatorName(username);
        localStorage.setItem('shuttle_logged_in', 'true');
        localStorage.setItem('shuttle_operator', username);
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('shuttle_logged_in');
        localStorage.removeItem('shuttle_operator');
    };

    // Reset database back to factory seeds
    const handleResetDatabase = () => {
        if (confirm("Are you sure you want to restore the SQLite database to factory default seeds? This deletes custom additions.")) {
            localStorage.removeItem('school_transport_db_v2');
            const freshState = getInitialState();
            const updatedState = addLog(freshState, 'database', 'SQLite database restored to factory seeds.', 'info');
            setDbState(updatedState);
            alert("SQLite Database seeded successfully!");
        }
    };

    // 1. Student Administration Operations
    const handleAddStudent = (studentData: Omit<Student, 'StudentID'>) => {
        const nextId = Math.max(...dbState.students.map(s => s.StudentID), 100) + 1;
        const newStudent: Student = {
            StudentID: nextId,
            ...studentData
        };

        let updated = { ...dbState, students: [...dbState.students, newStudent] };
        updated = addLog(updated, 'student', `Registered Student '${newStudent.FullName}' (ID: #${newStudent.StudentID}) under ${newStudent.School}.`, 'success');
        setDbState(updated);
    };

    const handleUpdateStudent = (updatedStudent: Student) => {
        const updatedList = dbState.students.map(s => s.StudentID === updatedStudent.StudentID ? updatedStudent : s);
        let updated = { ...dbState, students: updatedList };
        updated = addLog(updated, 'student', `Updated student records for '${updatedStudent.FullName}' (ID: #${updatedStudent.StudentID}).`, 'info');
        setDbState(updated);
    };

    const handleDeleteStudent = (studentId: number) => {
        const student = dbState.students.find(s => s.StudentID === studentId);
        const updatedList = dbState.students.filter(s => s.StudentID !== studentId);
        let updated = { ...dbState, students: updatedList };
        updated = addLog(updated, 'student', `Removed student record for '${student?.FullName || 'Unknown'}' (ID: #${studentId}).`, 'warning');
        setDbState(updated);
    };

    // 2. Driver Crew Operations
    const handleAddDriver = (driverData: Omit<Driver, 'DriverID'>) => {
        const nextId = Math.max(...dbState.drivers.map(d => d.DriverID), 0) + 1;
        const newDriver: Driver = {
            DriverID: nextId,
            ...driverData
        };

        let updated = { ...dbState, drivers: [...dbState.drivers, newDriver] };
        updated = addLog(updated, 'driver', `Registered Driver '${newDriver.Name}' (NIC: ${newDriver.NIC}).`, 'success');
        setDbState(updated);
    };

    const handleUpdateDriver = (updatedDriver: Driver) => {
        const updatedList = dbState.drivers.map(d => d.DriverID === updatedDriver.DriverID ? updatedDriver : d);
        let updated = { ...dbState, drivers: updatedList };
        updated = addLog(updated, 'driver', `Updated driver profiles for '${updatedDriver.Name}' (ID: #DRV-${updatedDriver.DriverID}).`, 'info');
        setDbState(updated);
    };

    const handleDeleteDriver = (driverId: number) => {
        const driver = dbState.drivers.find(d => d.DriverID === driverId);
        const updatedList = dbState.drivers.filter(d => d.DriverID !== driverId);
        let updated = { ...dbState, drivers: updatedList };
        updated = addLog(updated, 'driver', `Deleted driver profile of '${driver?.Name || 'Unknown'}' (ID: #DRV-${driverId}).`, 'warning');
        setDbState(updated);
    };

    // 3. Conductor Crew Operations
    const handleAddConductor = (conductorData: Omit<Conductor, 'ConductorID'>) => {
        const nextId = Math.max(...dbState.conductors.map(c => c.ConductorID), 0) + 1;
        const newConductor: Conductor = {
            ConductorID: nextId,
            ...conductorData
        };

        let updated = { ...dbState, conductors: [...dbState.conductors, newConductor] };
        updated = addLog(updated, 'conductor', `Registered Conductor '${newConductor.Name}' (NIC: ${newConductor.NIC}).`, 'success');
        setDbState(updated);
    };

    const handleUpdateConductor = (updatedConductor: Conductor) => {
        const updatedList = dbState.conductors.map(c => c.ConductorID === updatedConductor.ConductorID ? updatedConductor : c);
        let updated = { ...dbState, conductors: updatedList };
        updated = addLog(updated, 'conductor', `Updated conductor profiles for '${updatedConductor.Name}' (ID: #CND-${updatedConductor.ConductorID}).`, 'info');
        setDbState(updated);
    };

    const handleDeleteConductor = (conductorId: number) => {
        const conductor = dbState.conductors.find(c => c.ConductorID === conductorId);
        const updatedList = dbState.conductors.filter(c => c.ConductorID !== conductorId);
        let updated = { ...dbState, conductors: updatedList };
        updated = addLog(updated, 'conductor', `Deleted conductor profile of '${conductor?.Name || 'Unknown'}' (ID: #CND-${conductorId}).`, 'warning');
        setDbState(updated);
    };

    // 4. Vehicle & Route Fleet Operations
    const handleAddVehicle = (vehicleData: Omit<Vehicle, 'VehicleID'>) => {
        const nextId = Math.max(...dbState.vehicles.map(v => v.VehicleID), 0) + 1;
        const newVehicle: Vehicle = {
            VehicleID: nextId,
            ...vehicleData
        };

        let updated = { ...dbState, vehicles: [...dbState.vehicles, newVehicle] };
        updated = addLog(updated, 'vehicle', `Registered Fleet Vehicle '${newVehicle.RegNo}' on route '${newVehicle.RouteName}'.`, 'success');
        setDbState(updated);
    };

    const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
        const updatedList = dbState.vehicles.map(v => v.VehicleID === updatedVehicle.VehicleID ? updatedVehicle : v);
        let updated = { ...dbState, vehicles: updatedList };
        updated = addLog(updated, 'vehicle', `Updated vehicle profile and route for '${updatedVehicle.RegNo}'.`, 'info');
        setDbState(updated);
    };

    const handleDeleteVehicle = (vehicleId: number) => {
        const vehicle = dbState.vehicles.find(v => v.VehicleID === vehicleId);
        const updatedList = dbState.vehicles.filter(v => v.VehicleID !== vehicleId);
        let updated = { ...dbState, vehicles: updatedList };
        updated = addLog(updated, 'vehicle', `Deregistered Vehicle '${vehicle?.RegNo || 'Unknown'}' from active fleet crew operations.`, 'warning');
        setDbState(updated);
    };

    // 5. Billing Auto monthly Invoice Generation
    const handleGenerateMonthlyInvoices = () => {
        const currentMonth = "June"; // Simulated Cycle Month
        const currentYear = 2026;

        let billingCount = 0;
        let billingSum = 0;
        const newInvoices: Invoice[] = [];
        let nextInvoiceId = Math.max(...dbState.invoices.map(i => i.InvoiceID), 1000) + 1;

        dbState.students.forEach(student => {
            // Check if student is already billed for current cycle
            const alreadyInvoiced = dbState.invoices.some(
                inv => inv.StudentID === student.StudentID &&
                    inv.Month === currentMonth &&
                    inv.Year === currentYear
            );

            if (!alreadyInvoiced) {
                newInvoices.push({
                    InvoiceID: nextInvoiceId++,
                    StudentID: student.StudentID,
                    Month: currentMonth,
                    Year: currentYear,
                    Amount: student.MonthlyFee,
                    Status: 'Pending',
                    CreatedDate: new Date().toISOString().split('T')[0]
                });
                billingCount++;
                billingSum += student.MonthlyFee;
            }
        });

        if (billingCount > 0) {
            let updated = { ...dbState, invoices: [...dbState.invoices, ...newInvoices] };
            updated = addLog(updated, 'invoice', `Automated billing run: Generated ${billingCount} pending invoices for '${currentMonth} ${currentYear}'. Value: ${billingSum} LKR.`, 'success');
            setDbState(updated);
            alert(`Automated Batch Billing Successful!\nGenerated ${billingCount} invoices. Total: ${billingSum} LKR.`);
        } else {
            let updated = addLog(dbState, 'invoice', `Automated billing skipped: All active passenger students are already invoiced for '${currentMonth} ${currentYear}'.`, 'info');
            setDbState(updated);
            alert(`System billing up to date! No pending students found for ${currentMonth} ${currentYear}.`);
        }
    };

    // 6. Record Payments & Set Status as Paid
    const handlePayInvoice = (invoiceId: number, amount: number, method: Payment['Method'], date: string) => {
        // Update status to 'Paid' in Invoices Table
        const updatedInvoices = dbState.invoices.map(inv => {
            if (inv.InvoiceID === invoiceId) {
                return { ...inv, Status: 'Paid' as const };
            }
            return inv;
        });

        // Insert new transaction details into Payments Table
        const nextPaymentId = Math.max(...dbState.payments.map(p => p.PaymentID), 500) + 1;
        const newPayment: Payment = {
            PaymentID: nextPaymentId,
            InvoiceID: invoiceId,
            PaidAmount: amount,
            PaidDate: date,
            Method: method
        };

        const targetInvoice = dbState.invoices.find(i => i.InvoiceID === invoiceId);
        const targetStudent = dbState.students.find(s => s.StudentID === targetInvoice?.StudentID);

        let updated = {
            ...dbState,
            invoices: updatedInvoices,
            payments: [...dbState.payments, newPayment]
        };

        updated = addLog(
            updated,
            'payment',
            `Recorded ${amount} LKR via ${method} for invoice #INV-${invoiceId} (${targetStudent?.FullName || 'Pupil'}).`,
            'success'
        );
        setDbState(updated);
        alert(`Payment of ${amount} LKR recorded successfully under ID: #TX-${nextPaymentId}!`);
    };

    // Render Splash Screen on initial boot
    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    // Render Login page if not authenticated
    if (!isLoggedIn) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans antialiased text-slate-100">
            {/* Visual Top Branding Bar */}
            <header className="bg-slate-900 border-b border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 shadow-xl no-print">
                <div className="flex items-center gap-3">
                    <div className="p-0.5 bg-slate-950 border border-slate-800 rounded-xl shadow-md overflow-hidden shrink-0">
                        <img src={appLogo} alt="App Logo" className="w-9 h-9 object-cover rounded-lg" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                            School Shuttle Assistant
                        </h1>
                        <p className="text-[10px] text-slate-400 font-extrabold font-mono tracking-wider uppercase">
                            React & Vite Personal Project
                        </p>
                    </div>
                </div>

                {/* User context information */}
                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                            <span className="text-slate-500 font-bold">OPERATOR:</span> <span className="text-white font-bold">{operatorName}</span>
                        </div>
                        <span className="text-slate-600">|</span>
                        <div>
                            <span className="text-slate-500 font-bold">CYCLE:</span> <span className="text-emerald-400 font-bold">June 2026</span>
                        </div>
                    </div>
                    <button
                        onClick={handleResetDatabase}
                        id="btn-reset-db-main"
                        className="bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-slate-300 font-bold px-3 py-2 rounded-xl text-[11px] transition-all cursor-pointer flex items-center gap-1 active:scale-[0.98]"
                        title="Reset DB Seeds"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Reset Seeds
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold px-3 py-2 rounded-xl text-[11px] transition-all cursor-pointer flex items-center gap-1 active:scale-[0.98]"
                        title="Logout Session"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Exit Portal
                    </button>
                </div>
            </header>

            {/* Main Structural split */}
            <div className="flex-1 flex flex-col md:flex-row">

                {/* Navigation Sidebar */}
                <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col text-slate-300 shrink-0 select-none pb-6 md:pb-0 no-print">
                    <div className="px-4 py-3.5 border-b border-slate-800/50 flex items-center gap-2 bg-slate-950/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Local State Database Connected</span>
                    </div>

                    <nav className="flex-1 p-3.5 space-y-1 font-semibold text-xs">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <LayoutDashboard className="w-4 h-4 shrink-0" />
                            <span>Control Dashboard</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('students')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'students' ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Users className="w-4 h-4 shrink-0" />
                            <span>Students Directory</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('staff')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'staff' ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>Fleet Crews & Operators</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('vehicles')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'vehicles' ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Bus className="w-4 h-4 shrink-0" />
                            <span>Vehicles & Routes</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('invoices')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'invoices' ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span>Invoices & Payments</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('reports')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'reports' ? 'bg-amber-400 text-slate-950 font-bold shadow-md' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Coins className="w-4 h-4 shrink-0" />
                            <span>Financial Reports</span>
                        </button>

                        <div className="border-t border-slate-800/80 my-4 pt-4">
                            <span className="text-[10px] uppercase font-bold text-slate-500 px-4 block tracking-widest font-mono">Developer Diagnostics</span>
                        </div>

                        <button
                            onClick={() => setActiveTab('sql')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${activeTab === 'sql' ? 'bg-emerald-600 text-white font-bold shadow-md' : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Terminal className="w-4 h-4 shrink-0 text-emerald-400" />
                            <span>SQLite Query Terminal</span>
                        </button>
                    </nav>

                    {/* Footer Branding details */}
                    <div className="p-4 border-t border-slate-800/50 text-[10px] text-slate-500 space-y-1.5 mt-auto">
                        <div>React & Vite Single-Page Application</div>
                        <div>Database Engine: Browser LocalStorage State</div>
                        <div>© 2026 Personal Shuttle Project</div>
                    </div>
                </aside>

                {/* Primary Screen Area */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
                    {activeTab === 'dashboard' && (
                        <DashboardView
                            state={dbState}
                            onGenerateInvoices={handleGenerateMonthlyInvoices}
                            onNavigate={setActiveTab}
                        />
                    )}

                    {activeTab === 'students' && (
                        <StudentManager
                            students={dbState.students}
                            vehicles={dbState.vehicles}
                            onAddStudent={handleAddStudent}
                            onUpdateStudent={handleUpdateStudent}
                            onDeleteStudent={handleDeleteStudent}
                        />
                    )}

                    {activeTab === 'staff' && (
                        <StaffManager
                            drivers={dbState.drivers}
                            conductors={dbState.conductors}
                            vehicles={dbState.vehicles}
                            onAddDriver={handleAddDriver}
                            onUpdateDriver={handleUpdateDriver}
                            onDeleteDriver={handleDeleteDriver}
                            onAddConductor={handleAddConductor}
                            onUpdateConductor={handleUpdateConductor}
                            onDeleteConductor={handleDeleteConductor}
                        />
                    )}

                    {activeTab === 'vehicles' && (
                        <VehicleManager
                            vehicles={dbState.vehicles}
                            drivers={dbState.drivers}
                            conductors={dbState.conductors}
                            students={dbState.students}
                            onAddVehicle={handleAddVehicle}
                            onUpdateVehicle={handleUpdateVehicle}
                            onDeleteVehicle={handleDeleteVehicle}
                        />
                    )}

                    {activeTab === 'invoices' && (
                        <InvoiceManager
                            invoices={dbState.invoices}
                            students={dbState.students}
                            payments={dbState.payments}
                            vehicles={dbState.vehicles}
                            onPayInvoice={handlePayInvoice}
                            onGenerateInvoices={handleGenerateMonthlyInvoices}
                        />
                    )}

                    {activeTab === 'reports' && (
                        <ReportsCenter
                            invoices={dbState.invoices}
                            students={dbState.students}
                            vehicles={dbState.vehicles}
                        />
                    )}

                    {activeTab === 'sql' && (
                        <SqlPlayground state={dbState} />
                    )}
                </main>
            </div>
        </div>
    );
}
