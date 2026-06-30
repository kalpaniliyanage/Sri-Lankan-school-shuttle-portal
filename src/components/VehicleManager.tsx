/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Vehicle, Driver, Conductor, Student } from '../types';
import { 
  Search, Plus, Edit2, Trash2, Bus, AlertTriangle, UserCheck, 
  ShieldCheck, CheckCircle, X, Route, Sparkles, Image as ImageIcon, Users2
} from 'lucide-react';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  conductors: Conductor[];
  students: Student[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'VehicleID'>) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: number) => void;
}

export default function VehicleManager({
  vehicles, drivers, conductors, students,
  onAddVehicle, onUpdateVehicle, onDeleteVehicle
}: VehicleManagerProps) {
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form Fields
  const [regNo, setRegNo] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState<number>(30);
  const [routeName, setRouteName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [driverId, setDriverId] = useState<number>(0);
  const [conductorId, setConductorId] = useState<number>(0);

  // Search Filter
  const filteredVehicles = vehicles.filter(v =>
    v.RegNo.toLowerCase().includes(search.toLowerCase()) ||
    v.Model.toLowerCase().includes(search.toLowerCase()) ||
    v.RouteName.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingVehicle(null);
    setRegNo('');
    setModel('');
    setCapacity(30);
    setRouteName('');
    setPhotoUrl('');
    setDriverId(0);
    setConductorId(0);
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setRegNo(vehicle.RegNo);
    setModel(vehicle.Model);
    setCapacity(vehicle.Capacity);
    setRouteName(vehicle.RouteName);
    setPhotoUrl(vehicle.PhotoUrl || '');
    setDriverId(vehicle.DriverID || 0);
    setConductorId(vehicle.ConductorID || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo || !model || !capacity || !routeName) {
      alert("Please fill in Registration Number, Model, Capacity, and Route Name.");
      return;
    }

    const payload = {
      RegNo: regNo,
      Model: model,
      Capacity: Number(capacity),
      RouteName: routeName,
      PhotoUrl: photoUrl.trim() || undefined,
      DriverID: driverId > 0 ? Number(driverId) : undefined,
      ConductorID: conductorId > 0 ? Number(conductorId) : undefined
    };

    if (editingVehicle) {
      onUpdateVehicle({
        VehicleID: editingVehicle.VehicleID,
        ...payload
      });
    } else {
      onAddVehicle(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl p-6" id="vehicle-manager-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Bus className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">Vehicle Fleet & Routes</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage school transport service vehicles, route allocations, safety limits, and crew assignments.</p>
        </div>
        <button
          onClick={openAddModal}
          id="btn-add-vehicle"
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-md shadow-amber-500/5"
        >
          <Plus className="w-4 h-4" /> Add Active Vehicle
        </button>
      </div>

      {/* Toolbar Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search vehicles by Registration Plate, Model type, or Route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
          />
        </div>
      </div>

      {/* Fleet Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => {
          // Find linked operators
          const driver = drivers.find(d => d.DriverID === vehicle.DriverID || d.VehicleID === vehicle.VehicleID);
          const conductor = conductors.find(c => c.ConductorID === vehicle.ConductorID || c.VehicleID === vehicle.VehicleID);
          
          // Calculate Occupancy
          const assignedStudents = students.filter(s => s.VehicleID === vehicle.VehicleID);
          const studentCount = assignedStudents.length;
          const occupancyPercentage = Math.round((studentCount / vehicle.Capacity) * 100);
          const isOverloaded = studentCount > vehicle.Capacity;

          // Default vehicle photo fallback
          const defaultBusPhoto = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400";
          const vehiclePhoto = vehicle.PhotoUrl && vehicle.PhotoUrl.startsWith('http') ? vehicle.PhotoUrl : defaultBusPhoto;

          return (
            <div 
              key={vehicle.VehicleID} 
              className={`border rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all hover:scale-[1.01] bg-slate-950/40 ${
                isOverloaded ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              {/* Cover Image */}
              <div className="h-44 w-full relative overflow-hidden bg-slate-900 border-b border-slate-800">
                <img 
                  src={vehiclePhoto} 
                  alt={vehicle.RegNo} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-xs font-bold bg-slate-900/90 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/30 backdrop-blur-xs">
                    {vehicle.RegNo}
                  </span>
                </div>
                {isOverloaded && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 bg-rose-500/90 text-white font-bold text-[10px] px-2 py-1 rounded-lg border border-rose-400 uppercase tracking-wider animate-pulse">
                      <AlertTriangle className="w-3 h-3" /> Overloaded
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base font-sans tracking-tight">{vehicle.Model}</h3>
                      <p className="text-[11px] text-slate-500 font-mono font-bold mt-0.5">FLEET ID: #BUS-00{vehicle.VehicleID}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => openEditModal(vehicle)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                        title="Edit Vehicle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { if (confirm(`Deregister vehicle ${vehicle.RegNo} from active fleet database?`)) onDeleteVehicle(vehicle.VehicleID); }}
                        className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
                        title="Deregister Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Route details */}
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-300 font-semibold bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <Route className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="truncate" title={vehicle.RouteName}>{vehicle.RouteName}</span>
                  </div>

                  {/* Operator assignments */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                      <span className="text-slate-500 font-medium">Driver Assigned:</span>
                      {driver ? (
                        <span className="font-bold text-slate-200 inline-flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" /> {driver.Name}
                        </span>
                      ) : (
                        <span className="text-rose-400 italic font-bold">None assigned</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-slate-500 font-medium">Conductor Assigned:</span>
                      {conductor ? (
                        <span className="font-bold text-slate-200 inline-flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> {conductor.Name}
                        </span>
                      ) : (
                        <span className="text-rose-400 italic font-bold">None assigned</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div className="mt-5 pt-4 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users2 className="w-3.5 h-3.5" /> Passengers Logged:
                    </span>
                    <span className={isOverloaded ? 'text-rose-400' : 'text-amber-400'}>
                      {studentCount} / {vehicle.Capacity} ({occupancyPercentage}%)
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverloaded ? 'bg-gradient-to-r from-rose-500 to-red-600' :
                        occupancyPercentage > 85 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                    ></div>
                  </div>

                  {isOverloaded && (
                    <div className="flex items-start gap-1.5 text-[10px] text-rose-400 font-bold mt-1 bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Warning: Exceeds maximum authorized capacity safety threshold!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredVehicles.length === 0 && (
          <div className="col-span-full p-12 text-center text-slate-500 text-sm">
            No registered active vehicles match constraints. Click "Add Active Vehicle" to start.
          </div>
        )}
      </div>

      {/* MODAL DIALOG (VEHICLE CREATE/EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-500/20 text-amber-400 rounded">
                  <Bus className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-white text-base">
                  {editingVehicle ? 'Edit Vehicle Registry' : 'Register New Fleet Transit Bus'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer transition-colors p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Plate License No. *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WP-GA-5231"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Model & Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Coaster"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Vehicle Cover Photo URL
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Seat Capacity *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Primary Transport Route *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colombo - Gampaha"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Assign Active Driver</label>
                  <select
                    value={driverId}
                    onChange={(e) => setDriverId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                  >
                    <option value={0}>Unassigned (Reserve List)</option>
                    {drivers.map(d => (
                      <option key={d.DriverID} value={d.DriverID}>{d.Name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Assign Active Conductor</label>
                  <select
                    value={conductorId}
                    onChange={(e) => setConductorId(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                  >
                    <option value={0}>Unassigned (Reserve List)</option>
                    {conductors.map(c => (
                      <option key={c.ConductorID} value={c.ConductorID}>{c.Name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-5 flex justify-end gap-3 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  {editingVehicle ? 'Save Vehicle details' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
