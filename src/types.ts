/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  StudentID: number;
  FullName: string;
  School: string;
  Grade: string;
  Address: string;
  MonthlyFee: number;
  VehicleID: number; // Foreign Key to Vehicle
  PhotoUrl?: string;
  ParentName?: string;
  ParentPhone?: string;
  ParentEmail?: string;
}

export interface Driver {
  DriverID: number;
  Name: string;
  NIC: string;
  Phone: string;
  LicenseNo: string;
  VehicleID?: number; // Linked vehicle
  PhotoUrl?: string;
}

export interface Conductor {
  ConductorID: number;
  Name: string;
  NIC: string;
  Phone: string;
  VehicleID?: number; // Linked vehicle
  PhotoUrl?: string;
}

export interface Vehicle {
  VehicleID: number;
  RegNo: string; // e.g. WP-GA-5231
  Model: string; // e.g. Toyota Coaster, Leyland Bus
  Capacity: number; // e.g. 30
  RouteName: string; // e.g. Colombo - Negombo
  DriverID?: number; // Linked Driver
  ConductorID?: number; // Linked Conductor
  PhotoUrl?: string;
}

export interface Invoice {
  InvoiceID: number;
  StudentID: number;
  Month: string; // Month name e.g. "June"
  Year: number; // e.g. 2026
  Amount: number;
  Status: 'Pending' | 'Paid' | 'Overdue';
  CreatedDate: string; // YYYY-MM-DD
}

export interface Payment {
  PaymentID: number;
  InvoiceID: number;
  PaidAmount: number;
  PaidDate: string; // YYYY-MM-DD
  Method: 'Cash' | 'Bank Transfer' | 'Card' | 'Cheque';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  category: 'student' | 'driver' | 'conductor' | 'vehicle' | 'invoice' | 'payment' | 'database';
  message: string;
  type: 'info' | 'success' | 'warning';
}
