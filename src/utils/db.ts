/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, Driver, Conductor, Vehicle, Invoice, Payment, ActivityLog } from '../types';

export interface DatabaseState {
  students: Student[];
  drivers: Driver[];
  conductors: Conductor[];
  vehicles: Vehicle[];
  invoices: Invoice[];
  payments: Payment[];
  logs: ActivityLog[];
}

const STORAGE_KEY = 'school_transport_db_v2';

// Seed Data
const initialStudents: Student[] = [
  { 
    StudentID: 101, 
    FullName: "Pathum Sandeepa Rajapakse", 
    School: "Royal College", 
    Grade: "Grade 10", 
    Address: "No. 45/2, Kottawa Road, Mirihana, Nugegoda", 
    MonthlyFee: 2500, 
    VehicleID: 1,
    PhotoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    ParentName: "Dharmasena Rajapakse",
    ParentPhone: "+94 77 123 4567",
    ParentEmail: "dharmasena.r@gmail.com"
  },
  { 
    StudentID: 102, 
    FullName: "Chathurika Jayasekara", 
    School: "Visakha Vidyalaya", 
    Grade: "Grade 8", 
    Address: "No. 12, Havelock Road, Colombo 05", 
    MonthlyFee: 3000, 
    VehicleID: 2,
    PhotoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    ParentName: "Kamal Jayasekara",
    ParentPhone: "+94 71 234 5678",
    ParentEmail: "kamal.jayasekara@yahoo.com"
  },
  { 
    StudentID: 103, 
    FullName: "Minura Gunawardena", 
    School: "Ananda College", 
    Grade: "Grade 11", 
    Address: "No. 88, Cotta Road, Borella, Colombo 10", 
    MonthlyFee: 2800, 
    VehicleID: 1,
    PhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    ParentName: "Samantha Gunawardena",
    ParentPhone: "+94 76 345 6789",
    ParentEmail: "sam.gunawardena@outlook.com"
  },
  { 
    StudentID: 104, 
    FullName: "Shenali Perera", 
    School: "Musaeus College", 
    Grade: "Grade 7", 
    Address: "No. 102/B, Baseline Road, Kirulapone", 
    MonthlyFee: 3200, 
    VehicleID: 3,
    PhotoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    ParentName: "Nihal Perera",
    ParentPhone: "+94 75 456 7890",
    ParentEmail: "nihal.perera@live.com"
  },
  { 
    StudentID: 105, 
    FullName: "Sahan Wickramasinghe", 
    School: "Nalanda College", 
    Grade: "Grade 12", 
    Address: "No. 23, High Level Road, Maharagama", 
    MonthlyFee: 2500, 
    VehicleID: 1,
    PhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    ParentName: "Ranjith Wickramasinghe",
    ParentPhone: "+94 72 567 8901",
    ParentEmail: "ranjith.wick@gmail.com"
  },
  { 
    StudentID: 106, 
    FullName: "Arundathi Alwis", 
    School: "Ladies' College", 
    Grade: "Grade 9", 
    Address: "No. 67, Inner Flower Road, Colombo 03", 
    MonthlyFee: 3000, 
    VehicleID: 2,
    PhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    ParentName: "Pradeep Alwis",
    ParentPhone: "+94 70 678 9012",
    ParentEmail: "pradeep.alwis@outlook.com"
  },
  { 
    StudentID: 107, 
    FullName: "Devinda Senanayake", 
    School: "St. Joseph's College", 
    Grade: "Grade 11", 
    Address: "No. 5, Station Road, Mount Lavinia", 
    MonthlyFee: 3500, 
    VehicleID: 3,
    PhotoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    ParentName: "Mahela Senanayake",
    ParentPhone: "+94 78 789 0123",
    ParentEmail: "mahela.sena@sltnet.lk"
  }
];

const initialDrivers: Driver[] = [
  { 
    DriverID: 1, 
    Name: "Wimal Siriwardena", 
    NIC: "682341235V", 
    Phone: "+94 77 111 2222", 
    LicenseNo: "D-9034123", 
    VehicleID: 1,
    PhotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  },
  { 
    DriverID: 2, 
    Name: "Sunil Jayasuriya", 
    NIC: "740192344V", 
    Phone: "+94 71 333 4444", 
    LicenseNo: "D-8823410", 
    VehicleID: 2,
    PhotoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
  },
  { 
    DriverID: 3, 
    Name: "Kamal Wijesinghe", 
    NIC: "812039485V", 
    Phone: "+94 76 555 6666", 
    LicenseNo: "D-7561934", 
    VehicleID: 3,
    PhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  }
];

const initialConductors: Conductor[] = [
  { 
    ConductorID: 1, 
    Name: "Nimal Sirisena", 
    NIC: "851230491V", 
    Phone: "+94 72 222 3333", 
    VehicleID: 1,
    PhotoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"
  },
  { 
    ConductorID: 2, 
    Name: "Ruwan Kumara", 
    NIC: "900293847V", 
    Phone: "+94 78 444 5555", 
    VehicleID: 2,
    PhotoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=200"
  },
  { 
    ConductorID: 3, 
    Name: "Priyasiri Gunathilake", 
    NIC: "791238495V", 
    Phone: "+94 75 666 7777", 
    VehicleID: 3,
    PhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"
  }
];

const initialVehicles: Vehicle[] = [
  { 
    VehicleID: 1, 
    RegNo: "WP-GA-5231", 
    Model: "Toyota Coaster Bus", 
    Capacity: 30, 
    RouteName: "Maharagama - Colombo Fort", 
    DriverID: 1, 
    ConductorID: 1,
    PhotoUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=400"
  },
  { 
    VehicleID: 2, 
    RegNo: "WP-NA-8842", 
    Model: "Mitsubishi Fuso Bus", 
    Capacity: 26, 
    RouteName: "Kaduwela - Colombo 03", 
    DriverID: 2, 
    ConductorID: 2,
    PhotoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400"
  },
  { 
    VehicleID: 3, 
    RegNo: "WP-ND-0094", 
    Model: "Nissan Caravan Van", 
    Capacity: 15, 
    RouteName: "Nugegoda - Town Hall", 
    DriverID: 3, 
    ConductorID: 3,
    PhotoUrl: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&q=80&w=400"
  }
];

const initialInvoices: Invoice[] = [
  // Previous Month - Paid
  { InvoiceID: 1001, StudentID: 101, Month: "May", Year: 2026, Amount: 2500, Status: "Paid", CreatedDate: "2026-05-01" },
  { InvoiceID: 1002, StudentID: 102, Month: "May", Year: 2026, Amount: 3000, Status: "Paid", CreatedDate: "2026-05-01" },
  { InvoiceID: 1003, StudentID: 103, Month: "May", Year: 2026, Amount: 2800, Status: "Paid", CreatedDate: "2026-05-01" },
  { InvoiceID: 1004, StudentID: 104, Month: "May", Year: 2026, Amount: 3200, Status: "Paid", CreatedDate: "2026-05-01" },
  { InvoiceID: 1005, StudentID: 105, Month: "May", Year: 2026, Amount: 2500, Status: "Paid", CreatedDate: "2026-05-01" },
  // Current Month - Mixed Statuses
  { InvoiceID: 1006, StudentID: 101, Month: "June", Year: 2026, Amount: 2500, Status: "Paid", CreatedDate: "2026-06-01" },
  { InvoiceID: 1007, StudentID: 102, Month: "June", Year: 2026, Amount: 3000, Status: "Pending", CreatedDate: "2026-06-01" },
  { InvoiceID: 1008, StudentID: 103, Month: "June", Year: 2026, Amount: 2800, Status: "Paid", CreatedDate: "2026-06-01" },
  { InvoiceID: 1009, StudentID: 104, Month: "June", Year: 2026, Amount: 3200, Status: "Pending", CreatedDate: "2026-06-01" },
  { InvoiceID: 1010, StudentID: 105, Month: "June", Year: 2026, Amount: 2500, Status: "Pending", CreatedDate: "2026-06-01" },
  { InvoiceID: 1011, StudentID: 106, Month: "June", Year: 2026, Amount: 3000, Status: "Paid", CreatedDate: "2026-06-01" },
  { InvoiceID: 1012, StudentID: 107, Month: "June", Year: 2026, Amount: 3500, Status: "Overdue", CreatedDate: "2026-05-15" }
];

const initialPayments: Payment[] = [
  { PaymentID: 501, InvoiceID: 1001, PaidAmount: 2500, PaidDate: "2026-05-05", Method: "Cash" },
  { PaymentID: 502, InvoiceID: 1002, PaidAmount: 3000, PaidDate: "2026-05-06", Method: "Bank Transfer" },
  { PaymentID: 503, InvoiceID: 1003, PaidAmount: 2800, PaidDate: "2026-05-04", Method: "Cash" },
  { PaymentID: 504, InvoiceID: 1004, PaidAmount: 3200, PaidDate: "2026-05-05", Method: "Card" },
  { PaymentID: 505, InvoiceID: 1005, PaidAmount: 2500, PaidDate: "2026-05-07", Method: "Cheque" },
  // June Payments
  { PaymentID: 506, InvoiceID: 1006, PaidAmount: 2500, PaidDate: "2026-06-02", Method: "Cash" },
  { PaymentID: 507, InvoiceID: 1008, PaidAmount: 2800, PaidDate: "2026-06-05", Method: "Bank Transfer" },
  { PaymentID: 508, InvoiceID: 1011, PaidAmount: 3000, PaidDate: "2026-06-03", Method: "Card" }
];

const initialLogs: ActivityLog[] = [
  { id: "l1", timestamp: "2026-06-28 08:30:00", category: "database", message: "SQLite Database initialized successfully.", type: "success" },
  { id: "l2", timestamp: "2026-06-28 09:00:15", category: "driver", message: "Driver 'Wimal Siriwardena' registered and linked with WP-GA-5231.", type: "info" },
  { id: "l3", timestamp: "2026-06-28 10:11:42", category: "student", message: "New Student 'Devinda Senanayake' registered. Monthly Fee set to 3500 LKR.", type: "success" },
  { id: "l4", timestamp: "2026-06-29 08:00:00", category: "invoice", message: "Automated check: Found 1 Overdue invoice for May/June.", type: "warning" },
  { id: "l5", timestamp: "2026-06-29 09:02:10", category: "payment", message: "Payment of 3000 LKR recorded for Arundathi Alwis (Invoice #1011).", type: "success" }
];

export const getInitialState = (): DatabaseState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing stored state, loading initial seeds", e);
    }
  }

  const state: DatabaseState = {
    students: initialStudents,
    drivers: initialDrivers,
    conductors: initialConductors,
    vehicles: initialVehicles,
    invoices: initialInvoices,
    payments: initialPayments,
    logs: initialLogs
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
};

export const saveState = (state: DatabaseState): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const addLog = (state: DatabaseState, category: ActivityLog['category'], message: string, type: ActivityLog['type'] = 'info'): DatabaseState => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const newLog: ActivityLog = {
    id: 'log_' + Math.random().toString(36).substr(2, 9),
    timestamp,
    category,
    message,
    type
  };
  const updatedLogs = [newLog, ...state.logs].slice(0, 100); // limit to last 100 logs
  const updatedState = { ...state, logs: updatedLogs };
  saveState(updatedState);
  return updatedState;
};

// ==================== SQL PARSER EMULATOR ====================
// This simulates actual SQLite SQL requests in the client-side for visual/educational utility!
export interface SQLResult {
  columns: string[];
  rows: any[][];
  count: number;
  error?: string;
}

export const executeSql = (state: DatabaseState, query: string): SQLResult => {
  const cleanQuery = query.trim().replace(/\s+/g, ' ');
  const normalized = cleanQuery.toUpperCase();

  try {
    // Basic Table Mapping
    const tables: Record<string, any[]> = {
      STUDENTS: state.students,
      DRIVERS: state.drivers,
      CONDUCTORS: state.conductors,
      VEHICLES: state.vehicles,
      INVOICES: state.invoices,
      PAYMENTS: state.payments
    };

    // 1. SELECT SUM(...) FROM Invoices WHERE Status='Paid';
    if (normalized.startsWith("SELECT SUM(") && normalized.includes("FROM INVOICES")) {
      const match = cleanQuery.match(/SELECT\s+SUM\(([^)]+)\)\s+FROM\s+(\w+)(?:\s+WHERE\s+([^;]+))?/i);
      if (match) {
        const col = match[1].trim();
        const tableName = match[2].toUpperCase();
        const whereClause = match[3];

        let list = tables[tableName];
        if (!list) throw new Error(`Table '${tableName}' not found`);

        if (whereClause) {
          list = applyWhereFilter(list, whereClause);
        }

        const sum = list.reduce((acc, row) => {
          const val = Number(row[col] || row[Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase()) || '']);
          return acc + (isNaN(val) ? 0 : val);
        }, 0);

        return {
          columns: [`SUM(${col})`],
          rows: [[sum]],
          count: 1
        };
      }
    }

    // 2. SELECT COUNT(...) FROM ...
    if (normalized.startsWith("SELECT COUNT(") && normalized.includes("FROM")) {
      const match = cleanQuery.match(/SELECT\s+COUNT\(([^)]+)\)\s+FROM\s+(\w+)(?:\s+WHERE\s+([^;]+))?/i);
      if (match) {
        const col = match[1].trim();
        const tableName = match[2].toUpperCase();
        const whereClause = match[3];

        let list = tables[tableName];
        if (!list) throw new Error(`Table '${tableName}' not found`);

        if (whereClause) {
          list = applyWhereFilter(list, whereClause);
        }

        return {
          columns: [`COUNT(${col})`],
          rows: [[list.length]],
          count: 1
        };
      }
    }

    // 3. SELECT * FROM Table OR SELECT col1, col2 FROM Table
    if (normalized.startsWith("SELECT")) {
      const match = cleanQuery.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?\s*;?$/i);
      if (!match) {
        throw new Error("Invalid or unsupported SELECT syntax. Support matches: 'SELECT * FROM Table [WHERE col=val] [ORDER BY col]'");
      }

      const colsStr = match[1].trim();
      const tableName = match[2].toUpperCase();
      const whereClause = match[3];
      const orderByClause = match[4];

      let list = tables[tableName];
      if (!list) {
        throw new Error(`Table '${tableName}' not found. Available: Students, Drivers, Conductors, Vehicles, Invoices, Payments.`);
      }

      // Filter
      if (whereClause) {
        list = applyWhereFilter(list, whereClause);
      }

      // Sort
      if (orderByClause) {
        const [sortCol, direction] = orderByClause.trim().split(/\s+/);
        const isDesc = direction && direction.toUpperCase() === 'DESC';
        list = [...list].sort((a, b) => {
          const keyA = findKeyCaseInsensitive(a, sortCol);
          const keyB = findKeyCaseInsensitive(b, sortCol);
          let valA = a[keyA];
          let valB = b[keyB];

          if (typeof valA === 'string') valA = valA.toLowerCase();
          if (typeof valB === 'string') valB = valB.toLowerCase();

          if (valA < valB) return isDesc ? 1 : -1;
          if (valA > valB) return isDesc ? -1 : 1;
          return 0;
        });
      }

      // Columns Selection
      let selectedCols: string[] = [];
      if (colsStr === '*') {
        if (list.length > 0) {
          selectedCols = Object.keys(list[0]);
        } else {
          // Empty table fallback cols
          selectedCols = getFallbackColumns(tableName);
        }
      } else {
        selectedCols = colsStr.split(',').map(c => c.trim());
      }

      const rows = list.map(item => {
        return selectedCols.map(col => {
          const actualKey = findKeyCaseInsensitive(item, col);
          return item[actualKey] !== undefined ? item[actualKey] : null;
        });
      });

      return {
        columns: selectedCols,
        rows,
        count: rows.length
      };
    }

    throw new Error("Supported SQL commands in this emulator: SELECT, SELECT COUNT, SELECT SUM. Example: SELECT * FROM Students;");
  } catch (err: any) {
    return {
      columns: [],
      rows: [],
      count: 0,
      error: err.message || "SQL Syntax Error"
    };
  }
};

const findKeyCaseInsensitive = (obj: any, key: string): string => {
  const match = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
  return match || key;
};

const applyWhereFilter = (list: any[], whereClause: string): any[] => {
  const parts = whereClause.trim().split(/\s*=\s*/);
  if (parts.length === 2) {
    const col = parts[0].trim();
    let val = parts[1].trim().replace(/^['"]|['"]$/g, ''); // strip quotes

    return list.filter(item => {
      const actualKey = findKeyCaseInsensitive(item, col);
      const itemVal = item[actualKey];
      return String(itemVal).toLowerCase() === String(val).toLowerCase();
    });
  }
  return list;
};

const getFallbackColumns = (tableName: string): string[] => {
  switch (tableName) {
    case 'STUDENTS': return ['StudentID', 'FullName', 'School', 'Grade', 'MonthlyFee', 'VehicleID'];
    case 'DRIVERS': return ['DriverID', 'Name', 'NIC', 'Phone', 'LicenseNo', 'VehicleID'];
    case 'CONDUCTORS': return ['ConductorID', 'Name', 'NIC', 'Phone', 'VehicleID'];
    case 'VEHICLES': return ['VehicleID', 'RegNo', 'Model', 'Capacity', 'RouteName'];
    case 'INVOICES': return ['InvoiceID', 'StudentID', 'Month', 'Year', 'Amount', 'Status', 'CreatedDate'];
    case 'PAYMENTS': return ['PaymentID', 'InvoiceID', 'PaidAmount', 'PaidDate', 'Method'];
    default: return [];
  }
};
