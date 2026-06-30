# Sri Lankan School Transport Authority Portal
### 🚍 High-Performance Fleet Management & Automated Invoicing Ledger System

A full-stack responsive web portal engineered to manage student passenger rosters, crew allocations, active route networks, monthly invoice billing, and compliance reports for Sri Lankan private school transit lines. The interface mimics a high-fidelity desktop client running a local SQLite database core, utilizing a retro, high-contrast, premium dark color palette.

---

## 🎨 Key Feature Modules

### 1. 📊 Interactive Revenue Analytics
*   **Visual Monthly Stream**: A custom-coded vertical bar chart displaying rolling income aggregates in LKR, with hover states detailing exact numbers.
*   **Live Metrics Counters**: Real-time counter metrics for total active students, active fleet vehicles, collected revenue, and outstanding arrears.

### 2. 👥 Student Passenger Administration
*   **Localized Sri Lankan Roster**: Initialized with authentic Sri Lankan student names and educational institutions (e.g., Royal College, Ananda College, Visakha Vidyalaya, Musaeus College).
*   **Detailed Profiles**: Tracks student photos, exact residential addresses, unique grades, specific monthly tuition fare plans, and designated parent emergency contact credentials.

### 3. 👮 Crew & Fleet Operator Rosters
*   **Driver Directory**: Logs licensed operators verified by Sri Lankan National Identity Card (NIC) formats and license numbers.
*   **Conductor Crew**: Registers boarding conductors assigned to monitor passengers during transit.

### 4. 🚍 Route & Fleet Network Allocation
*   **Vehicle Specifications**: Registers operational buses and vans (e.g., Toyota Coaster, Mitsubishi Fuso, Nissan Caravan) with valid Western Province registration numbers.
*   **Active Transit Routes**: Maps passenger capacity and aggregates active commuters along predefined corridors (e.g., Maharagama - Colombo Fort, Kaduwela - Colombo 03).

### 5. 🧾 Invoices & Ledger Billing Engine
*   **One-Click Batch Invoicing**: Runs automated billing routines calculating monthly dues across all active student passengers.
*   **Payment Handlers**: Instantly log completed transactions (via cash, card, or bank transfer) with automated payment status transitions (Paid, Pending, Overdue).
*   **Receipt Sheets**: Generates stylized boarding QR code transit receipts with custom tax and discount calculations ready for parents.

### 6. 📁 Compliance & Reports Center
*   **Defaulters Directory**: Instant overview of student accounts with active pending bills.
*   **Export Ledger CSV**: Generates standard encoded spreadsheet ledger files for quick financial processing.
*   **Print-Ready Layouts**: Features custom print CSS overrides for clean physical report sheets.

### 7. 💻 Interactive SQLite Diagnostic Playground
*   **SQL Console**: An interactive, terminal-style SQL editor allowing developers to write and execute SQLite queries against the state schema to filter and inspect records instantly.

---

## 🚀 Technical Stack
*   **Frontend Library**: React 18+ (Functional Components & Hooks)
*   **Build Tool**: Vite
*   **Language**: TypeScript (Strict type interfaces defined for all database entities)
*   **Styling Engine**: Tailwind CSS
*   **Micro-interactions**: Motion
*   **State Management**: LocalStorage-persisted custom SQLite state emulator

---

## 💻 Local Installation & Setup

### Prerequisites
*   **Node.js** (v18 or higher)

### 1. Setup the project
```bash
# Clone the repository
git clone https://github.com/your-username/sri-lankan-school-shuttle-portal.git

# Navigate to the folder
cd sri-lankan-school-shuttle-portal

# Install all dependencies
npm install
```

### 2. Run the application
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
