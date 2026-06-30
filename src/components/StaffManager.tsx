/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Driver, Conductor, Vehicle } from '../types';
import { 
  Search, Plus, Edit2, Trash2, Bus, Shield, UserCheck, X, Phone, 
  FileText, ShieldAlert, BadgeCheck, Image as ImageIcon, Contact2
} from 'lucide-react';

interface StaffManagerProps {
  drivers: Driver[];
  conductors: Conductor[];
  vehicles: Vehicle[];
  onAddDriver: (driver: Omit<Driver, 'DriverID'>) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (driverId: number) => void;
  onAddConductor: (conductor: Omit<Conductor, 'ConductorID'>) => void;
  onUpdateConductor: (conductor: Conductor) => void;
  onDeleteConductor: (conductorId: number) => void;
}

export default function StaffManager({ 
  drivers, conductors, vehicles, 
  onAddDriver, onUpdateDriver, onDeleteDriver,
  onAddConductor, onUpdateConductor, onDeleteConductor 
}: StaffManagerProps) {
  
  const [activeTab, setActiveTab] = useState<'drivers' | 'conductors'>('drivers');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [assignedVehicle, setAssignedVehicle] = useState<number>(0);

  // Search filter
  const filteredDrivers = drivers.filter(d => 
    d.Name.toLowerCase().includes(search.toLowerCase()) || 
    d.NIC.toLowerCase().includes(search.toLowerCase()) || 
    d.Phone.includes(search)
  );

  const filteredConductors = conductors.filter(c => 
    c.Name.toLowerCase().includes(search.toLowerCase()) || 
    c.NIC.toLowerCase().includes(search.toLowerCase()) || 
    c.Phone.includes(search)
  );

  const openAddModal = () => {
    setEditingStaff(null);
    setName('');
    setNic('');
    setPhone('');
    setLicenseNo('');
    setPhotoUrl('');
    setAssignedVehicle(0);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingStaff(item);
    setName(item.Name);
    setNic(item.NIC);
    setPhone(item.Phone);
    setLicenseNo(item.LicenseNo || '');
    setPhotoUrl(item.PhotoUrl || '');
    setAssignedVehicle(item.VehicleID || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nic || !phone) {
      alert("Please fill in name, NIC, and phone number.");
      return;
    }

    if (activeTab === 'drivers') {
      const driverObj = {
        Name: name,
        NIC: nic,
        Phone: phone,
        LicenseNo: licenseNo,
        VehicleID: assignedVehicle > 0 ? Number(assignedVehicle) : undefined,
        PhotoUrl: photoUrl.trim() || undefined
      };
      if (editingStaff) {
        onUpdateDriver({
          DriverID: editingStaff.DriverID,
          ...driverObj
        });
      } else {
        onAddDriver(driverObj);
      }
    } else {
      const conductorObj = {
        Name: name,
        NIC: nic,
        Phone: phone,
        VehicleID: assignedVehicle > 0 ? Number(assignedVehicle) : undefined,
        PhotoUrl: photoUrl.trim() || undefined
      };
      if (editingStaff) {
        onUpdateConductor({
          ConductorID: editingStaff.ConductorID,
          ...conductorObj
        });
      } else {
        onAddConductor(conductorObj);
      }
    }
    setIsModalOpen(false);
  };

  const renderStaffAvatar = (item: any) => {
    if (item.PhotoUrl && item.PhotoUrl.startsWith('http')) {
      return (
        <img 
          src={item.PhotoUrl} 
          alt={item.Name} 
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/30 shadow-md" 
        />
      );
    }
    const initials = item.Name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
    return (
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-slate-800 text-indigo-200 font-bold flex items-center justify-center text-sm border-2 border-slate-700">
        {initials || "ST"}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl p-6" id="staff-manager-card">
      {/* Tab Selectors & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Contact2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">Fleet Crew & Operators</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Manage licensed school transit bus drivers, active conductors, contact profiles, and routes.</p>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/60 w-fit">
          <button
            onClick={() => { setActiveTab('drivers'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'drivers' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Drivers Directory ({drivers.length})
          </button>
          <button
            onClick={() => { setActiveTab('conductors'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${activeTab === 'conductors' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Conductors Directory ({conductors.length})
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search active school ${activeTab === 'drivers' ? 'drivers' : 'conductors'} by name, NIC, phone...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
          />
        </div>
        <button
          onClick={openAddModal}
          id="btn-add-staff"
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-95 cursor-pointer shadow-md shadow-amber-500/5"
        >
          <Plus className="w-4 h-4" /> Add New {activeTab === 'drivers' ? 'Driver' : 'Conductor'}
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Crew ID</th>
              <th className="p-4">Profile Portrait</th>
              <th className="p-4">National ID (NIC)</th>
              <th className="p-4">Phone Contact</th>
              {activeTab === 'drivers' && <th className="p-4">Driving License</th>}
              <th className="p-4">Assigned Active Bus</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
            {activeTab === 'drivers' ? (
              filteredDrivers.map(d => {
                const vehicle = vehicles.find(v => v.VehicleID === d.VehicleID);
                return (
                  <tr key={d.DriverID} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-xs text-amber-500/70 font-bold">DRV-00{d.DriverID}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {renderStaffAvatar(d)}
                        <div>
                          <span className="font-bold text-white block">{d.Name}</span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Verified Driver</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-xs">{d.NIC}</td>
                    <td className="p-4 text-slate-400">
                      <span className="inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> {d.Phone}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg font-semibold">{d.LicenseNo}</span>
                    </td>
                    <td className="p-4">
                      {vehicle ? (
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-amber-300 font-bold text-xs inline-flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/20 w-fit">
                            <Bus className="w-3.5 h-3.5 text-amber-400" /> {vehicle.RegNo}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">{vehicle.Model}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic bg-slate-900/50 border border-slate-800 px-2 py-1 rounded">No assigned bus</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEditModal(d)} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer" title="Edit Profile">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm(`Remove driver ${d.Name} from active duty rosters?`)) onDeleteDriver(d.DriverID); }} className="p-2 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer" title="Delete Profile">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              filteredConductors.map(c => {
                const vehicle = vehicles.find(v => v.VehicleID === c.VehicleID);
                return (
                  <tr key={c.ConductorID} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-xs text-indigo-400 font-bold">CND-00{c.ConductorID}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {renderStaffAvatar(c)}
                        <div>
                          <span className="font-bold text-white block">{c.Name}</span>
                          <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Verified Conductor</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-xs">{c.NIC}</td>
                    <td className="p-4 text-slate-400">
                      <span className="inline-flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-500" /> {c.Phone}
                      </span>
                    </td>
                    <td className="p-4">
                      {vehicle ? (
                        <div className="flex flex-col space-y-0.5">
                          <span className="text-amber-300 font-bold text-xs inline-flex items-center gap-1 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/20 w-fit">
                            <Bus className="w-3.5 h-3.5 text-amber-400" /> {vehicle.RegNo}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">{vehicle.Model}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic bg-slate-900/50 border border-slate-800 px-2 py-1 rounded">No assigned bus</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openEditModal(c)} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer" title="Edit Profile">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (confirm(`Remove conductor ${c.Name} from active duty rosters?`)) onDeleteConductor(c.ConductorID); }} className="p-2 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer" title="Delete Profile">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}

            {((activeTab === 'drivers' && filteredDrivers.length === 0) || 
              (activeTab === 'conductors' && filteredConductors.length === 0)) && (
              <tr>
                <td colSpan={ activeTab === 'drivers' ? 7 : 6 } className="p-12 text-center text-slate-500 text-sm">
                  No registered active {activeTab === 'drivers' ? 'driver' : 'conductor'} records match search constraints.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DIALOG (STAFF CREATE/EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-500/20 text-amber-400 rounded">
                  <Shield className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-white text-base">
                  {editingStaff ? `Edit Registered ${activeTab === 'drivers' ? 'Driver' : 'Conductor'}` : `Register New ${activeTab === 'drivers' ? 'Driver' : 'Conductor'}`}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer transition-colors p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Operator Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wimal Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Photo Portrait URL
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
                  <label className="text-xs font-semibold text-slate-300 block">NIC (National ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 740192344V"
                    value={nic}
                    onChange={(e) => setNic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Phone Contact *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              </div>

              {activeTab === 'drivers' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 block">Driving License Number *</label>
                  <input
                    type="text"
                    required={activeTab === 'drivers'}
                    placeholder="e.g. D-8823410"
                    value={licenseNo}
                    onChange={(e) => setLicenseNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Link to Route Vehicle</label>
                <select
                  value={assignedVehicle}
                  onChange={(e) => setAssignedVehicle(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                >
                  <option value={0}>Unassigned (On Reserve List)</option>
                  {vehicles.map(v => (
                    <option key={v.VehicleID} value={v.VehicleID}>{v.RegNo} - {v.Model} ({v.RouteName})</option>
                  ))}
                </select>
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
                  {editingStaff ? 'Save Changes' : 'Register Operator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
