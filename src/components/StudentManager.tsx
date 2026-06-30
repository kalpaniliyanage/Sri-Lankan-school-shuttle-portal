/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, Vehicle } from '../types';
import { 
  Search, Plus, Edit2, Trash2, Bus, GraduationCap, School, 
  MapPin, DollarSign, X, User, Phone, Mail, Image as ImageIcon, Sparkles
} from 'lucide-react';

interface StudentManagerProps {
  students: Student[];
  vehicles: Vehicle[];
  onAddStudent: (student: Omit<Student, 'StudentID'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: number) => void;
}

export default function StudentManager({ students, vehicles, onAddStudent, onUpdateStudent, onDeleteStudent }: StudentManagerProps) {
  const [search, setSearch] = useState('');
  const [filterVehicle, setFilterVehicle] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');
  const [address, setAddress] = useState('');
  const [monthlyFee, setMonthlyFee] = useState<number>(2500);
  const [vehicleId, setVehicleId] = useState<number>(1);
  const [photoUrl, setPhotoUrl] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');

  // Search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.FullName.toLowerCase().includes(search.toLowerCase()) || 
                          student.School.toLowerCase().includes(search.toLowerCase()) ||
                          student.Grade.toLowerCase().includes(search.toLowerCase()) ||
                          (student.ParentName && student.ParentName.toLowerCase().includes(search.toLowerCase())) ||
                          student.StudentID.toString().includes(search);
    
    const matchesVehicle = filterVehicle === 'all' || student.VehicleID.toString() === filterVehicle;

    return matchesSearch && matchesVehicle;
  });

  const openAddModal = () => {
    setEditingStudent(null);
    setFullName('');
    setSchool('');
    setGrade('');
    setAddress('');
    setMonthlyFee(2500);
    setPhotoUrl('');
    setParentName('');
    setParentPhone('');
    setParentEmail('');
    if (vehicles.length > 0) setVehicleId(vehicles[0].VehicleID);
    setIsModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFullName(student.FullName);
    setSchool(student.School);
    setGrade(student.Grade);
    setAddress(student.Address);
    setMonthlyFee(student.MonthlyFee);
    setVehicleId(student.VehicleID);
    setPhotoUrl(student.PhotoUrl || '');
    setParentName(student.ParentName || '');
    setParentPhone(student.ParentPhone || '');
    setParentEmail(student.ParentEmail || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !school || !grade) {
      alert("Please fill in all required fields.");
      return;
    }

    const submissionData = {
      FullName: fullName,
      School: school,
      Grade: grade,
      Address: address,
      MonthlyFee: Number(monthlyFee),
      VehicleID: Number(vehicleId),
      PhotoUrl: photoUrl.trim() || undefined,
      ParentName: parentName.trim() || undefined,
      ParentPhone: parentPhone.trim() || undefined,
      ParentEmail: parentEmail.trim() || undefined,
    };

    if (editingStudent) {
      onUpdateStudent({
        StudentID: editingStudent.StudentID,
        ...submissionData
      });
    } else {
      onAddStudent(submissionData);
    }
    setIsModalOpen(false);
  };

  // Helper to generate dynamic gradient initials avatar
  const renderAvatar = (student: Student) => {
    if (student.PhotoUrl && student.PhotoUrl.startsWith('http')) {
      return (
        <img 
          src={student.PhotoUrl} 
          alt={student.FullName} 
          referrerPolicy="no-referrer"
          className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30" 
        />
      );
    }
    const initials = student.FullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-amber-950 font-bold flex items-center justify-center text-xs border-2 border-amber-400/30">
        {initials || "ST"}
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl shadow-xl p-6" id="student-manager-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight font-sans">Students Registry</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Register new student passengers, record parent contacts, and update transport vehicle links.</p>
        </div>
        <button
          onClick={openAddModal}
          id="btn-add-student"
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Student Passenger
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/50">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, student name, school, parent name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-amber-400 transition-colors"
          />
        </div>
        <div className="md:w-64">
          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-400 cursor-pointer transition-colors"
          >
            <option value="all">Filter by Vehicle: All Vehicles</option>
            {vehicles.map(v => (
              <option key={v.VehicleID} value={v.VehicleID}>{v.RegNo} ({v.RouteName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Student</th>
              <th className="p-4">School & Grade</th>
              <th className="p-4">Parent / Guardian Details</th>
              <th className="p-4">Monthly Fee</th>
              <th className="p-4">Assigned Vehicle</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
            {filteredStudents.map((student) => {
              const matchedVehicle = vehicles.find(v => v.VehicleID === student.VehicleID);
              return (
                <tr key={student.StudentID} className="hover:bg-slate-800/40 transition-colors">
                  {/* Photo + Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {renderAvatar(student)}
                      <div>
                        <div className="font-semibold text-white">{student.FullName}</div>
                        <div className="font-mono text-[10px] text-slate-500 font-bold mt-0.5">ID: #{student.StudentID}</div>
                      </div>
                    </div>
                  </td>
                  {/* School & Grade */}
                  <td className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs text-slate-200 flex items-center gap-1.5 font-medium">
                        <School className="w-3.5 h-3.5 text-amber-500/70" /> {student.School}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-500" /> {student.Grade}
                      </span>
                    </div>
                  </td>
                  {/* Parent Details */}
                  <td className="p-4">
                    {student.ParentName ? (
                      <div className="flex flex-col space-y-1 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/50">
                        <span className="text-xs text-slate-200 font-bold flex items-center gap-1.5">
                          <User className="w-3 h-3 text-amber-400" /> {student.ParentName}
                        </span>
                        {student.ParentPhone && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-500" /> {student.ParentPhone}
                          </span>
                        )}
                        {student.ParentEmail && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate max-w-[170px]" title={student.ParentEmail}>
                            <Mail className="w-3 h-3 text-slate-500" /> {student.ParentEmail}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No parent added</span>
                    )}
                  </td>
                  {/* Fee */}
                  <td className="p-4 font-mono font-bold text-amber-400">
                    {student.MonthlyFee.toLocaleString()} LKR
                  </td>
                  {/* Vehicle */}
                  <td className="p-4">
                    {matchedVehicle ? (
                      <div className="flex flex-col">
                        <span className="text-amber-300 font-bold text-[11px] inline-flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 w-fit">
                          <Bus className="w-3 h-3 text-amber-400" /> {matchedVehicle.RegNo}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold mt-1 truncate max-w-[140px]">{matchedVehicle.RouteName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-rose-500 italic bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">Unassigned</span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Edit Student"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove ${student.FullName} from the transport roster?`)) {
                            onDeleteStudent(student.StudentID);
                          }
                        }}
                        className="p-2 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 text-sm">
                  No matching student records found. Click "Add Student Passenger" to register one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DIALOG (ADD / EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-xl w-full overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-amber-500/20 text-amber-400 rounded">
                  <GraduationCap className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-white text-base">{editingStudent ? 'Edit Student Passenger Details' : 'Register New Student Passenger'}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer transition-colors p-1 rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* STAGE 1: Student Information */}
              <div className="border-b border-slate-800 pb-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">1. Student Passenger Info</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Photo URL
                      </label>
                      <input
                        type="url"
                        placeholder="e.g. https://images.unsplash.com/..."
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">School Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Royal College"
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Grade / Standard *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Grade 10"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">Home Address</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. 12/A, Flower Road, Colombo 03"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* STAGE 2: Parent / Guardian Details */}
              <div className="border-b border-slate-800 pb-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">2. Parent / Guardian Contact Details</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">Parent / Guardian Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Robert Doe"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Parent Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. +94 77 999 1111"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300 block">Parent Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. robert.doe@gmail.com"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 3: Fee & Vehicle Assignments */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">3. Billing & Routing Configuration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Monthly Rate (LKR) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={monthlyFee}
                      onChange={(e) => setMonthlyFee(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-amber-400 font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">Assign Transport Vehicle *</label>
                    <select
                      value={vehicleId}
                      onChange={(e) => setVehicleId(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                    >
                      {vehicles.map(v => (
                        <option key={v.VehicleID} value={v.VehicleID}>{v.RegNo} - {v.RouteName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
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
                  {editingStudent ? 'Save Roster Changes' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
