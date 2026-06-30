# 🚐 Sri Lankan School Transport Authority Portal

A web portal for managing school van/bus services in Sri Lanka — student rosters, driver and conductor records, route allocation, monthly billing, and basic compliance reporting. It's built to feel like a desktop app, with a dark, high-contrast UI and a SQLite-style data layer running entirely in the browser. 🌙

This was put together as a fleet management tool for private school transport operators who need an easier way to track who's riding, who's driving, which routes are running, and who still owes money for the month. 💰

## ✨ What it does

**📊 Dashboard / Analytics**
A quick overview of how the business is doing — a monthly revenue bar chart (in LKR), and live counts for active students, vehicles on the road, money collected, and outstanding payments.

**🎒 Student Records**
Keeps a roster of students with their school (Royal College, Ananda College, Visakha Vidyalaya, Musaeus College, etc.), home address, grade, monthly fare, and a parent/guardian contact for emergencies.

**👨‍✈️ Drivers & Conductors**
A directory of drivers (with NIC and license numbers) and conductors assigned to each vehicle.

**🛣️ Routes & Vehicles**
Registers vehicles (Toyota Coaster, Mitsubishi Fuso, Nissan Caravan, etc.) with their registration numbers, and maps out the actual routes they run — e.g. Maharagama to Colombo Fort, Kaduwela to Colombo 03 — along with how many students are on each one.

**🧾 Billing & Invoices**
Generate invoices for everyone in one go each month, log payments (cash, card, bank transfer), and the system updates each student's status automatically (✅ Paid, ⏳ Pending, ⚠️ Overdue). It also produces a printable receipt with a QR code for parents.

**📁 Reports**
A list of defaulters (accounts with unpaid bills), CSV export for the ledger, and print-friendly formatting for anything you need on paper.

**💻 SQL Console**
A built-in terminal-style query tool, mainly for developers — lets you run SQL directly against the underlying data if you need to inspect or debug something.

## 🛠️ Tech stack

- React 18 (functional components, hooks)
- Vite
- TypeScript
- Tailwind CSS
- Motion (for animations/transitions)
- A local, LocalStorage-backed SQLite emulator for state — no external database needed

## 🚀 Getting started

You'll need Node.js v18 or later installed.

```bash
# clone the repo
git clone https://github.com/kalpaniliyanage/Sri-Lankan-school-shuttle-portal.git

# move into the project folder
cd Sri-Lankan-school-shuttle-portal

# install dependencies
npm install

# start the dev server
npm run dev
```

By default this will be available at `http://localhost:5173` (Vite's default port — check your terminal output to confirm).

To build a production-ready version:

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting provider.

## 📝 Notes

- All data lives in the browser's LocalStorage — there's no backend server or real database. Clearing your browser storage will reset everything. 🗑️
- Sample/seed data uses Sri Lankan names, schools, and routes for realism during development and demos. 🇱🇰

## 📄 License

This project is licensed under the MIT License.
