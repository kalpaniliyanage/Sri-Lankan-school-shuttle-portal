/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import { Invoice, Student, Payment, Vehicle } from '../types';

// Helper to convert an image URL to Base64 to bypass jsPDF network limitations
async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result as string);
      };
      reader.onerror = function () {
        resolve('');
      };
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.warn('Could not fetch image as base64 (CORS or offline):', e);
    return '';
  }
}

/**
 * Download a highly polished, professional PDF receipt for a specific invoice
 */
export async function downloadInvoicePdf(
  invoice: Invoice,
  student: Student | undefined,
  payment: Payment | undefined,
  vehicle: Vehicle | undefined,
  qrCodeUrl: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Fetch QR code image
  const qrBase64 = qrCodeUrl ? await getBase64ImageFromUrl(qrCodeUrl) : '';

  // Page Colors
  const darkSlate = '#0f172a';
  const amberAccent = '#f59e0b';
  const lightBg = '#f8fafc';
  const borderCol = '#cbd5e1';

  // --- Header Banner ---
  doc.setFillColor(15, 23, 42); // darkSlate
  doc.rect(0, 0, 210, 25, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SCHOOL SHUTTLE ASSISTANT', 15, 10);

  // Subtitle
  doc.setTextColor(245, 158, 11); // amberAccent
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('COLOMBO, SRI LANKA • STUDENT TRANSIT DISPATCH LEDGER', 15, 16);

  // Timestamp on header right
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`SYSTEM RUN: ${new Date().toLocaleDateString()}`, 195, 13, { align: 'right' });

  // --- Document Type Accent ---
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 32, 180, 22, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 32, 180, 22, 'S');

  // Title in box
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('PASSENGER TRANSPORT BILLING STATEMENT', 20, 41);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('This serves as formal billing/receipt of active transport operations.', 20, 47);

  // --- Invoice & Payment Summary Details (Two-Column Layout) ---
  const leftColX = 15;
  const rightColX = 115;
  let currentY = 65;

  // Header lines for sections
  doc.setDrawColor(226, 232, 240);
  doc.line(15, currentY - 5, 195, currentY - 5);

  // Left Side: Student Credentials
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PASSENGER CREDENTIALS', leftColX, currentY);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(student ? student.FullName : 'Deleted Student', leftColX, currentY + 6);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`School: ${student?.School || 'N/A'} (${student?.Grade || 'N/A'})`, leftColX, currentY + 11);
  doc.text(`Guardian Name: ${student?.ParentName || 'N/A'}`, leftColX, currentY + 16);
  doc.text(`Guardian Contact: ${student?.ParentPhone || 'N/A'}`, leftColX, currentY + 21);
  doc.text(`Transit Vehicle: ${vehicle ? vehicle.RegNo : 'Unassigned'}`, leftColX, currentY + 26);

  // Right Side: Billing Details
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('BILLING METADATA', rightColX, currentY);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`INVOICE: #INV-${invoice.InvoiceID}`, rightColX, currentY + 6);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Cycle/Period: ${invoice.Month} ${invoice.Year}`, rightColX, currentY + 11);
  doc.text(`Invoice Issued: ${invoice.CreatedDate}`, rightColX, currentY + 16);
  
  if (payment) {
    doc.text(`Transaction ID: #TX-${payment.PaymentID}`, rightColX, currentY + 21);
    doc.text(`Date Settled: ${payment.PaidDate}`, rightColX, currentY + 26);
  } else {
    doc.text('Transaction ID: Pending Payment', rightColX, currentY + 21);
    doc.text('Date Settled: N/A', rightColX, currentY + 26);
  }

  // --- Draw QR Code Section ---
  currentY += 36;
  doc.setFillColor(248, 250, 252);
  doc.rect(15, currentY, 180, 42, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, currentY, 180, 42, 'S');

  // Left info in QR Box
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Boarding Access Verification Pass', 22, currentY + 11);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('1. Scanning this dynamic QR code at the bus entryway verifies payment.', 22, currentY + 18);
  doc.text('2. Keep a digital copy on your mobile device for shuttle check-ins.', 22, currentY + 23);
  doc.text('3. This QR code belongs uniquely to this passenger billing period.', 22, currentY + 28);

  // Drawing Status badge in QR Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('STATEMENT STATUS: ', 22, currentY + 36);

  if (invoice.Status === 'Paid') {
    doc.setFillColor(220, 252, 231); // light green
    doc.rect(60, currentY + 32, 20, 6, 'F');
    doc.setTextColor(21, 128, 61); // green
    doc.setFontSize(8.5);
    doc.text('SETTLED', 63, currentY + 36.5);
  } else if (invoice.Status === 'Overdue') {
    doc.setFillColor(254, 226, 226); // light red
    doc.rect(60, currentY + 32, 22, 6, 'F');
    doc.setTextColor(185, 28, 28); // red
    doc.setFontSize(8.5);
    doc.text('OVERDUE', 63, currentY + 36.5);
  } else {
    doc.setFillColor(254, 243, 199); // light yellow
    doc.rect(60, currentY + 32, 22, 6, 'F');
    doc.setTextColor(180, 83, 9); // yellow/orange
    doc.setFontSize(8.5);
    doc.text('PENDING', 63, currentY + 36.5);
  }

  // QR code image right-aligned in QR box
  if (qrBase64) {
    try {
      doc.addImage(qrBase64, 'PNG', 153, currentY + 3, 36, 36);
    } catch (err) {
      console.error('Error drawing image on PDF:', err);
    }
  } else {
    // Elegant fallback box
    doc.setFillColor(241, 245, 249);
    doc.rect(153, currentY + 3, 36, 36, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(153, currentY + 3, 36, 36, 'S');
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('QR PREVIEW', 171, currentY + 18, { align: 'center' });
    doc.setFontSize(6.5);
    doc.text('ACTIVE IN SYSTEM', 171, currentY + 23, { align: 'center' });
  }

  // --- Tariff Ledger Table ---
  currentY += 52;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TARIFF & LEDGER BREAKDOWN', 15, currentY);

  // Table Headers
  doc.setFillColor(15, 23, 42);
  doc.rect(15, currentY + 3, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Tuition Transport Tariff Details', 18, currentY + 8.5);
  doc.text('Qty', 125, currentY + 8.5);
  doc.text('Rate', 145, currentY + 8.5);
  doc.text('Total (LKR)', 175, currentY + 8.5);

  // Row
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Monthly School Transport Bus Commuter Pass', 18, currentY + 16);
  doc.text('1', 127, currentY + 16);
  doc.text(`${invoice.Amount.toLocaleString()} LKR`, 145, currentY + 16);
  
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(`${invoice.Amount.toLocaleString()} LKR`, 175, currentY + 16);

  // Table line
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(15, currentY + 20, 195, currentY + 20);

  // Grand Total Rows
  currentY += 26;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Tariff Rate Total:', 140, currentY);
  doc.setTextColor(15, 23, 42);
  doc.text(`${invoice.Amount.toLocaleString()} LKR`, 175, currentY);

  doc.setTextColor(100, 116, 139);
  doc.text('Discounts / Surcharges:', 140, currentY + 5);
  doc.setTextColor(15, 23, 42);
  doc.text('0 LKR', 175, currentY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('GRAND NET TOTAL:', 140, currentY + 11);
  doc.setTextColor(245, 158, 11); // amber color
  doc.text(`${invoice.Amount.toLocaleString()} LKR`, 175, currentY + 11);

  // --- Terms / Footer ---
  doc.setLineWidth(0.2);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 270, 195, 270);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('For any billing queries or transit service corrections, please consult the operational portal dashboard.', 15, 274);
  doc.text('This is a dynamically system-generated transport statement. Valid signature stored on ledger secure keys.', 15, 278);

  // Download PDF file
  doc.save(`invoice_INV-${invoice.InvoiceID}_${invoice.Month}-${invoice.Year}.pdf`);
}

/**
 * Download a beautiful PDF summarizing the selected Operational / Financial Report
 */
export function downloadReportPdf(
  reportType: 'defaulters' | 'route_revenue' | 'school_totals',
  selectedMonth: string,
  selectedYear: number,
  data: any[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const darkSlate = '#0f172a';
  const lightBg = '#f8fafc';
  const borderCol = '#cbd5e1';

  // --- Header Banner ---
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('SCHOOL SHUTTLE ASSISTANT', 15, 10);

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(7.5);
  doc.text('COMPLIANCE, OPERATIONS & FLEET INTELLIGENCE SYSTEMS', 15, 16);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`SYSTEM RUN: ${new Date().toLocaleDateString()}`, 195, 13, { align: 'right' });

  // --- Document Title Banner ---
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 32, 180, 22, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 32, 180, 22, 'S');

  let reportTitle = '';
  let reportSubtitle = '';
  if (reportType === 'defaulters') {
    reportTitle = 'PASSENGER DEFAULTERS DIRECTORY';
    reportSubtitle = 'List of active commuters defaulting with pending or overdue transport fares.';
  } else if (reportType === 'route_revenue') {
    reportTitle = 'FLEET ROUTE FINANCIAL STABILITY REPORT';
    reportSubtitle = 'Analysis of expected collections, actual paid amounts, and outstanding revenue per transit bus.';
  } else {
    reportTitle = 'SCHOOL DESTINATION SUMMARIES';
    reportSubtitle = 'Operational and statistical summary grouped across active partner educational institutions.';
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`${reportTitle} - ${selectedMonth.toUpperCase()} ${selectedYear}`, 20, 41);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(reportSubtitle, 20, 47);

  // --- Key Summary Metrics ---
  let currentY = 65;
  doc.setFillColor(248, 250, 252);
  doc.rect(15, currentY, 180, 15, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, currentY, 180, 15, 'S');

  if (reportType === 'defaulters') {
    const totalOutstanding = data.reduce((acc, d) => acc + d.Amount, 0);
    // Draw colored badge bar
    doc.setFillColor(239, 68, 68); // Red Left Border
    doc.rect(15, currentY, 2, 15, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('SUMMARY OF COMPLIANCE:', 22, currentY + 9.5);

    doc.setTextColor(185, 28, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`${data.length} Accounts in Default`, 85, currentY + 10);
    doc.text(`Total Outstanding: ${totalOutstanding.toLocaleString()} LKR`, 130, currentY + 10);
  } else if (reportType === 'route_revenue') {
    const totalCollected = data.reduce((acc, d) => acc + d.Collected, 0);
    const totalOutstanding = data.reduce((acc, d) => acc + d.Outstanding, 0);
    
    doc.setFillColor(16, 185, 129); // Green Left Border
    doc.rect(15, currentY, 2, 15, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('TOTAL FINANCIAL SUMMARY:', 22, currentY + 9.5);

    doc.setTextColor(21, 128, 61);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`Collected: ${totalCollected.toLocaleString()} LKR`, 80, currentY + 10);
    doc.setTextColor(185, 28, 28);
    doc.text(`Outstanding: ${totalOutstanding.toLocaleString()} LKR`, 135, currentY + 10);
  } else {
    const totalPassengers = data.reduce((acc, d) => acc + d.StudentCount, 0);
    const totalExpected = data.reduce((acc, d) => acc + d.GrossTotal, 0);

    doc.setFillColor(99, 102, 241); // Indigo Left Border
    doc.rect(15, currentY, 2, 15, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('INSTITUTION STATISTICS:', 22, currentY + 9.5);

    doc.setTextColor(79, 70, 229);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(`Active Passengers: ${totalPassengers}`, 85, currentY + 10);
    doc.text(`Projected Total: ${totalExpected.toLocaleString()} LKR`, 130, currentY + 10);
  }

  // --- Report Grid Table ---
  currentY += 25;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DETAILED METRICS DATABASE', 15, currentY);

  // Table header background
  doc.setFillColor(15, 23, 42);
  doc.rect(15, currentY + 3, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  let headers: string[] = [];
  let colWidths: number[] = [];

  if (reportType === 'defaulters') {
    headers = ['Invoice ID', 'Student Passenger', 'School Institution', 'Assigned Bus', 'Default Fee'];
    colWidths = [22, 52, 48, 30, 28];

    // Draw header text
    let x = 18;
    headers.forEach((h, i) => {
      doc.text(h, x, currentY + 8.5);
      x += colWidths[i];
    });

    // Draw rows
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    let y = currentY + 16;

    data.forEach((item) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(`#INV-${item.InvoiceID}`, 18, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(item.Name, 40, y);
      doc.setTextColor(71, 85, 105);
      doc.text(item.School, 92, y);
      doc.text(item.Vehicle, 140, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(185, 28, 28); // red
      doc.text(`${item.Amount.toLocaleString()} LKR`, 170, y);

      // thin separation line
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(15, y + 2.5, 195, y + 2.5);
      y += 7;
    });

    if (data.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 116, 139);
      doc.text('Excellent! There are no outstanding passenger defaults recorded.', 20, y + 5);
    }
  } else if (reportType === 'route_revenue') {
    headers = ['Bus No', 'Assigned Route', 'Students', 'Collected', 'Outstanding', 'Expected'];
    colWidths = [24, 48, 20, 28, 30, 30];

    // Draw header text
    let x = 18;
    headers.forEach((h, i) => {
      doc.text(h, x, currentY + 8.5);
      x += colWidths[i];
    });

    // Draw rows
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    let y = currentY + 16;

    data.forEach((item) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(item.RegNo, 18, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(item.Route, 42, y);
      doc.text(item.TotalStudents.toString(), 90, y);
      doc.setTextColor(21, 128, 61); // green
      doc.text(`${item.Collected.toLocaleString()} LKR`, 110, y);
      doc.setTextColor(185, 28, 28); // red
      doc.text(`${item.Outstanding.toLocaleString()} LKR`, 138, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${item.Expected.toLocaleString()} LKR`, 168, y);

      // thin separation line
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(15, y + 2.5, 195, y + 2.5);
      y += 7;
    });
  } else {
    headers = ['School Institution', 'Students', 'Collected Fares', 'Outstanding Fares', 'Gross Expected'];
    colWidths = [56, 24, 34, 34, 32];

    // Draw header text
    let x = 18;
    headers.forEach((h, i) => {
      doc.text(h, x, currentY + 8.5);
      x += colWidths[i];
    });

    // Draw rows
    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    let y = currentY + 16;

    data.forEach((item) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(item.School, 18, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(item.StudentCount.toString(), 74, y);
      doc.setTextColor(21, 128, 61); // green
      doc.text(`${item.CollectedRevenue.toLocaleString()} LKR`, 98, y);
      doc.setTextColor(185, 28, 28); // red
      doc.text(`${item.OutstandingRevenue.toLocaleString()} LKR`, 132, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${item.GrossTotal.toLocaleString()} LKR`, 166, y);

      // thin separation line
      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(15, y + 2.5, 195, y + 2.5);
      y += 7;
    });
  }

  // --- Footer Stamp ---
  doc.setLineWidth(0.2);
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 270, 195, 270);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('This is a secure system-compiled analytical report. Restricted for operational use.', 15, 274);
  doc.text('Colombo School Transit Dispatch Operations & Compliance, Sri Lanka.', 15, 278);

  doc.save(`report_${reportType}_${selectedMonth}_${selectedYear}.pdf`);
}
