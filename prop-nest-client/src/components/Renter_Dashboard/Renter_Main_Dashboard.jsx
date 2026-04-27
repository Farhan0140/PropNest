import React, { useState, useMemo } from 'react';
import {
  Home, Receipt, CreditCard, Wrench, User, Bell, Search,
  Plus, X, Calendar, Clock, CheckCircle, AlertCircle,
  FileText, Download, ChevronRight, Edit3, Phone, Mail,
  Shield, AlertTriangle, Clock3, Check, Image as ImageIcon,
  MessageSquare,
  DollarSign
} from 'lucide-react';

const Renter_Main_Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock Tenant Data
  const [tenantProfile, setTenantProfile] = useState({
    name: 'Rahim Ahmed',
    email: 'rahim@example.com',
    phone: '+880 1712-345678',
    nid: '1234567890',
    emergencyContact: '+880 1998-765432',
    unit: 'A102',
    property: 'Sunrise Apartments',
    leaseStart: 'Jan 2024',
    leaseEnd: 'Dec 2026',
    monthlyRent: 12000
  });

  const [invoices, setInvoices] = useState([
    { id: 'inv_001', month: 'February', year: 2026, rent: 12000, lateFee: 0, total: 12000, paid: 7000, due: 5000, status: 'Partial', date: 'Feb 01, 2026' },
    { id: 'inv_002', month: 'January', year: 2026, rent: 12000, lateFee: 0, total: 12000, paid: 12000, due: 0, status: 'Paid', date: 'Jan 01, 2026' },
    { id: 'inv_003', month: 'December', year: 2025, rent: 12000, lateFee: 500, total: 12500, paid: 12500, due: 0, status: 'Paid', date: 'Dec 01, 2025' },
  ]);

  const [payments, setPayments] = useState([
    { id: 'pay_001', date: 'Feb 05, 2026', amount: 7000, method: 'bKash', trxId: 'BK8H7G6F5D', status: 'Success', invoiceId: 'inv_001' },
    { id: 'pay_002', date: 'Jan 03, 2026', amount: 12000, method: 'Cash', trxId: 'CASH-0012', status: 'Success', invoiceId: 'inv_002' },
    { id: 'pay_003', date: 'Dec 05, 2025', amount: 12500, method: 'Bank Transfer', trxId: 'TRX998877', status: 'Success', invoiceId: 'inv_003' },
  ]);

  const [complaints, setComplaints] = useState([
    { id: 'cmp_001', title: 'Kitchen Tap Broken', description: 'Kitchen tap is leaking water continuously.', priority: 'Medium', status: 'Pending', date: 'Feb 10, 2026', images: [], comments: [{ from: 'manager', text: 'We will check this today.', date: 'Feb 11, 2026' }] },
    { id: 'cmp_002', title: 'Bathroom Light Issue', description: 'Bathroom light not working properly.', priority: 'Low', status: 'Resolved', date: 'Jan 15, 2026', images: [], comments: [{ from: 'manager', text: 'Electrician fixed the wiring.', date: 'Jan 18, 2026' }] },
  ]);

  // Modal States
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(null);
  const [showComplaintDetails, setShowComplaintDetails] = useState(null);
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [newComplaintForm, setNewComplaintForm] = useState({ title: '', description: '', priority: 'Medium' });
  const [commentInput, setCommentInput] = useState('');
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(tenantProfile);

  const currentMonth = 'February 2026';
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalDue = invoices.reduce((sum, inv) => sum + inv.due, 0);
  const lastPayment = payments[0];
  const activeComplaints = complaints.filter(c => c.status !== 'Resolved');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'invoices', label: 'My Rent', icon: Receipt },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const statusColors = {
    Paid: 'bg-green-300 border-green-600 text-green-800',
    Partial: 'bg-yellow-300 border-yellow-600 text-yellow-800',
    Unpaid: 'bg-red-300 border-red-600 text-red-800',
    Pending: 'bg-orange-300 border-orange-600 text-orange-800',
    'In Progress': 'bg-blue-300 border-blue-600 text-blue-800',
    Resolved: 'bg-green-300 border-green-600 text-green-800',
    High: 'bg-red-300 border-red-600 text-red-800',
    Medium: 'bg-yellow-300 border-yellow-600 text-yellow-800',
    Low: 'bg-blue-300 border-blue-600 text-blue-800',
  };

  const handleAddComplaint = () => {
    if (!newComplaintForm.title || !newComplaintForm.description) {
      alert('Please fill in all required fields');
      return;
    }
    const newComplaint = {
      id: `cmp_${Date.now()}`,
      title: newComplaintForm.title,
      description: newComplaintForm.description,
      priority: newComplaintForm.priority,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      images: [],
      comments: []
    };
    setComplaints([newComplaint, ...complaints]);
    setNewComplaintForm({ title: '', description: '', priority: 'Medium' });
    setShowNewComplaint(false);
  };

  const addComment = (complaintId) => {
    if (!commentInput.trim()) return;
    setComplaints(complaints.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          comments: [...c.comments, { from: 'tenant', text: commentInput, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }]
        };
      }
      return c;
    }));
    setCommentInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      <main className="flex-1 p-4 md:p-8 mb-20 md:mb-0 overflow-auto">

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-500">Current Rent</span>
                  <div className="bg-green-300 border-2 border-black rounded p-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <DollarSign className="w-4 h-4 text-black" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-black">৳{tenantProfile.monthlyRent}</p>
              </div>
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-500">Due Amount</span>
                  <div className="bg-red-300 border-2 border-black rounded p-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <AlertCircle className="w-4 h-4 text-black" />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${totalDue > 0 ? 'text-red-600' : 'text-green-600'}`}>৳{totalDue}</p>
              </div>
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-500">Last Payment</span>
                  <div className="bg-blue-300 border-2 border-black rounded p-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <CreditCard className="w-4 h-4 text-black" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-black">৳{lastPayment.amount}</p>
                <p className="text-xs text-gray-500">Paid on {lastPayment.date}</p>
              </div>
              <div className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-500">Lease End</span>
                  <div className="bg-yellow-300 border-2 border-black rounded p-1.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <Calendar className="w-4 h-4 text-black" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-black">{tenantProfile.leaseEnd}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="bg-gray-100 border-b-2 border-black p-4 flex items-center justify-between">
                  <h3 className="font-bold text-black flex items-center space-x-2">
                    <Receipt className="w-5 h-5" />
                    <span>Recent Invoices</span>
                  </h3>
                  <button onClick={() => setActiveTab('invoices')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="p-4 space-y-3">
                  {invoices.slice(0, 3).map(inv => (
                    <div key={inv.id} className="bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-black">{inv.month} {inv.year}</p>
                        <p className="text-sm text-gray-500">৳{inv.total} • {inv.status}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusColors[inv.status]}`}>{inv.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance */}
              <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="bg-gray-100 border-b-2 border-black p-4 flex items-center justify-between">
                  <h3 className="font-bold text-black flex items-center space-x-2">
                    <Wrench className="w-5 h-5" />
                    <span>Recent Maintenance</span>
                  </h3>
                  <button onClick={() => setActiveTab('maintenance')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
                </div>
                <div className="p-4 space-y-3">
                  {complaints.length > 0 ? complaints.slice(0, 3).map(cmp => (
                    <div key={cmp.id} className="bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-black">{cmp.title}</p>
                        <p className="text-sm text-gray-500">Submitted on {cmp.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusColors[cmp.status]}`}>{cmp.status}</span>
                    </div>
                  )) : <p className="text-center text-gray-500 py-4">No maintenance requests</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-black">
                      {['Invoice ID', 'Month', 'Total', 'Paid', 'Due', 'Status', 'Action'].map(h => (
                        <th key={h} className="text-left py-3 px-4 font-bold text-black">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(inv => (
                      <tr key={inv.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0">
                        <td className="py-3 px-4 font-medium text-black">{inv.id}</td>
                        <td className="py-3 px-4 text-black">{inv.month} {inv.year}</td>
                        <td className="py-3 px-4 font-bold text-black">৳{inv.total}</td>
                        <td className="py-3 px-4 text-green-700">৳{inv.paid}</td>
                        <td className="py-3 px-4 text-red-700">৳{inv.due}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusColors[inv.status]}`}>{inv.status}</span>
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => setShowInvoiceDetails(inv)} className="bg-blue-300 border-2 border-black rounded px-3 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-black">
                      {['Transaction ID', 'Date', 'Amount', 'Method', 'Status', 'Action'].map(h => (
                        <th key={h} className="text-left py-3 px-4 font-bold text-black">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(pay => (
                      <tr key={pay.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0">
                        <td className="py-3 px-4 font-mono text-sm text-black">{pay.trxId}</td>
                        <td className="py-3 px-4 text-black">{pay.date}</td>
                        <td className="py-3 px-4 font-bold text-black">৳{pay.amount}</td>
                        <td className="py-3 px-4 text-black">{pay.method}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 rounded text-xs font-bold border-2 bg-green-300 border-green-600 text-green-800">Success</span>
                        </td>
                        <td className="py-3 px-4">
                          <button onClick={() => setShowPaymentDetails(pay)} className="bg-blue-300 border-2 border-black rounded px-3 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button onClick={() => setShowNewComplaint(true)} className="bg-yellow-300 border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>New Complaint</span>
              </button>
            </div>

            <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-black">
                      {['Issue', 'Priority', 'Status', 'Date', 'Action'].map(h => (
                        <th key={h} className="text-left py-3 px-4 font-bold text-black">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map(cmp => (
                      <tr key={cmp.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0">
                        <td className="py-3 px-4 font-medium text-black">{cmp.title}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusColors[cmp.priority]}`}>{cmp.priority}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusColors[cmp.status]}`}>{cmp.status}</span>
                        </td>
                        <td className="py-3 px-4 text-black">{cmp.date}</td>
                        <td className="py-3 px-4">
                          <button onClick={() => setShowComplaintDetails(cmp)} className="bg-blue-300 border-2 border-black rounded px-3 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">Profile Information</h3>
                <button onClick={() => setEditProfile(!editProfile)} className={`border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center space-x-2 ${editProfile ? 'bg-red-300' : 'bg-yellow-300'}`}>
                  <Edit3 className="w-4 h-4" />
                  <span>{editProfile ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Full Name</label>
                  {editProfile ? (
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                  ) : (
                    <p className="text-lg font-medium text-black bg-gray-50 border border-gray-300 rounded-lg py-2 px-3">{tenantProfile.name}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1 flex items-center space-x-2"><Phone className="w-4 h-4" /><span>Phone</span></label>
                    {editProfile ? (
                      <input type="text" value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                    ) : (
                      <p className="text-lg font-medium text-black bg-gray-50 border border-gray-300 rounded-lg py-2 px-3">{tenantProfile.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1 flex items-center space-x-2"><Mail className="w-4 h-4" /><span>Email</span></label>
                    <p className="text-lg font-medium text-black bg-gray-50 border border-gray-300 rounded-lg py-2 px-3">{tenantProfile.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">NID Number</label>
                    <p className="text-lg font-medium text-black bg-gray-50 border border-gray-300 rounded-lg py-2 px-3">{tenantProfile.nid}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Emergency Contact</label>
                    {editProfile ? (
                      <input type="text" value={profileForm.emergencyContact} onChange={e => setProfileForm({...profileForm, emergencyContact: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
                    ) : (
                      <p className="text-lg font-medium text-black bg-gray-50 border border-gray-300 rounded-lg py-2 px-3">{tenantProfile.emergencyContact}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-gray-300">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Unit</label>
                    <p className="text-lg font-medium text-black">{tenantProfile.unit}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Lease Start</label>
                    <p className="text-lg font-medium text-black">{tenantProfile.leaseStart}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Lease End</label>
                    <p className="text-lg font-medium text-black">{tenantProfile.leaseEnd}</p>
                  </div>
                </div>
              </div>

              {editProfile && (
                <div className="mt-6 pt-4 border-t-2 border-black flex justify-end space-x-3">
                  <button onClick={() => setEditProfile(false)} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">Cancel</button>
                  <button onClick={() => { setTenantProfile(profileForm); setEditProfile(false); alert('Profile updated!'); }} className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">Save Changes</button>
                </div>
              )}
            </div>

            <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
              <h3 className="text-xl font-bold text-black mb-4">Account Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-black" />
                    <span className="font-medium text-black">Change Password</span>
                  </div>
                  <button className="bg-blue-300 border-2 border-black rounded px-3 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all">Update</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Invoice Details Modal */}
      {showInvoiceDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black flex items-center space-x-2"><FileText className="w-5 h-5" /><span>Invoice Details</span></h3>
              <button onClick={() => setShowInvoiceDetails(null)} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex justify-between items-center p-3 bg-white border-2 border-black rounded-lg">
                <span className="font-bold text-gray-600">Invoice ID</span>
                <span className="font-mono font-bold text-black">{showInvoiceDetails.id}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white border-2 border-black rounded-lg">
                <span className="font-bold text-gray-600">Month</span>
                <span className="font-bold text-black">{showInvoiceDetails.month} {showInvoiceDetails.year}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 border-2 border-green-500 rounded-lg text-center">
                  <span className="text-xs text-gray-500 block">Paid</span>
                  <p className="font-bold text-green-700">৳{showInvoiceDetails.paid}</p>
                </div>
                <div className="p-3 bg-red-50 border-2 border-red-500 rounded-lg text-center">
                  <span className="text-xs text-gray-500 block">Due</span>
                  <p className="font-bold text-red-700">৳{showInvoiceDetails.due}</p>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 border-2 border-black rounded-lg flex justify-between items-center">
                <span className="font-bold text-black">Total Amount</span>
                <span className="font-bold text-black">৳{showInvoiceDetails.total}</span>
              </div>
              <button className="w-full bg-blue-300 border-2 border-black rounded-lg px-4 py-3 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showPaymentDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold text-black flex items-center space-x-2"><Receipt className="w-5 h-5" /><span>Payment Details</span></h3>
              <button onClick={() => setShowPaymentDetails(null)} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center p-3 bg-white border-2 border-black rounded-lg">
                <span className="font-bold text-gray-600">Transaction ID</span>
                <span className="font-mono font-bold text-black">{showPaymentDetails.trxId}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <span className="text-xs text-gray-500 block">Date</span>
                  <p className="font-bold text-black">{showPaymentDetails.date}</p>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <span className="text-xs text-gray-500 block">Method</span>
                  <p className="font-bold text-black">{showPaymentDetails.method}</p>
                </div>
              </div>
              <div className="p-3 bg-green-100 border-2 border-green-600 rounded-lg flex justify-between items-center">
                <span className="font-bold text-black">Amount Paid</span>
                <span className="font-bold text-green-800">৳{showPaymentDetails.amount}</span>
              </div>
              <button className="w-full bg-blue-300 border-2 border-black rounded-lg px-4 py-3 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Details Modal */}
      {showComplaintDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black flex items-center space-x-2"><Wrench className="w-5 h-5" /><span>Complaint Details</span></h3>
              <button onClick={() => setShowComplaintDetails(null)} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-black">{showComplaintDetails.title}</h4>
                  <p className="text-sm text-gray-500">Submitted on {showComplaintDetails.date}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusColors[showComplaintDetails.status]}`}>{showComplaintDetails.status}</span>
              </div>
              <div className="p-3 bg-white border-2 border-black rounded-lg">
                <p className="text-sm text-gray-600">{showComplaintDetails.description}</p>
              </div>
              <div className="border-t-2 border-black pt-3">
                <h5 className="font-bold text-black mb-2 flex items-center space-x-2"><MessageSquare className="w-4 h-4" /><span>Comments</span></h5>
                <div className="space-y-2">
                  {showComplaintDetails.comments.map((c, i) => (
                    <div key={i} className={`p-2 rounded-lg border-2 ${c.from === 'manager' ? 'bg-blue-50 border-blue-300 ml-4' : 'bg-yellow-50 border-yellow-300 mr-4'}`}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-gray-600">{c.from === 'manager' ? 'Manager' : 'You'}</span>
                        <span className="text-xs text-gray-400">{c.date}</span>
                      </div>
                      <p className="text-sm text-black">{c.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex space-x-2">
                  <input type="text" value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Add a comment..." className="flex-1 bg-white border-2 border-black rounded-lg py-1.5 px-3 text-sm text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" />
                  <button onClick={() => { addComment(showComplaintDetails.id); setShowComplaintDetails({...showComplaintDetails, comments: [...showComplaintDetails.comments, { from: 'tenant', text: commentInput, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }] }); setCommentInput(''); }} className="bg-blue-300 border-2 border-black rounded px-3 py-1.5 text-sm font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {showNewComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black flex items-center space-x-2"><Plus className="w-5 h-5" /><span>New Complaint</span></h3>
              <button onClick={() => setShowNewComplaint(false)} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-bold text-black mb-1">* Title</label>
                <input type="text" value={newComplaintForm.title} onChange={e => setNewComplaintForm({...newComplaintForm, title: e.target.value})} placeholder="e.g., Tap Broken" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">* Description</label>
                <textarea value={newComplaintForm.description} onChange={e => setNewComplaintForm({...newComplaintForm, description: e.target.value})} placeholder="Describe the issue..." rows="4" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">* Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map(p => (
                    <button key={p} onClick={() => setNewComplaintForm({...newComplaintForm, priority: p})} className={`p-2 border-2 border-black rounded-lg text-sm font-bold transition-all ${newComplaintForm.priority === p ? `${statusColors[p]} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]` : 'bg-white hover:bg-gray-100'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="border-t-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload image (optional)</p>
              </div>
              <button onClick={handleAddComplaint} className="w-full bg-green-400 border-2 border-black rounded-lg px-4 py-3 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">Submit Complaint</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Renter_Main_Dashboard;
