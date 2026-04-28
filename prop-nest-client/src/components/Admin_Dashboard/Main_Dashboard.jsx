import React, { useEffect, useMemo, useState } from 'react';
import { 
  Building, Home, Users, CreditCard, DollarSign, 
  Wrench, Plus, CheckCircle, AlertCircle, Clock,
  FileText, X
} from 'lucide-react';
import useAdminContext from '../../hooks/Admin/useAdminContext';
import AddPropertyForm from '../modals/AddPropertyForm';
import AddUnitForm from '../modals/AddUnitForm';

const Main_Dashboard = () => {
  const { properties, units, rentInvoice, maintenanceRequests } = useAdminContext() || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [bills, setBills] = useState(rentInvoice);

  useEffect(() => {
    setBills(rentInvoice);
  }, [rentInvoice]);

  // Helper to get unit name safely
  const getUnitName = (unitId) => {
    const unit = units?.find(u => u?.id === unitId);
    return unit?.unit_name || `Unit ${unitId || 'N/A'}`;
  };

  // Summary statistics
  const { totalCollected, totalDue, thisMonthIncome, overdueCount } = useMemo(() => {
    const allBills = bills || [];
    const collected = allBills.filter(b => b?.status === 'paid').reduce((sum, b) => sum + (b?.total_amount || 0), 0);
    const due = allBills.filter(b => b?.status === 'unpaid').reduce((sum, b) => sum + (b?.total_amount || 0), 0);
    const thisMonth = allBills
      .filter(b => b?.status === 'paid' && b?.year === currentYear && b?.month === currentMonth)
      .reduce((sum, b) => sum + (b?.total_amount || 0), 0);
    const overdue = allBills.filter(b => {
      if (b?.status !== 'unpaid') return false;
      // Overdue if before current month/year
      return b?.year < currentYear || (b?.year === currentYear && (b?.month || 0) < currentMonth);
    }).length;

    return { totalCollected: collected, totalDue: due, thisMonthIncome: thisMonth, overdueCount: overdue };
  }, [bills, currentYear, currentMonth]);

  const priorityColors = {
    low: 'bg-green-200 border-green-500 text-green-800',
    medium: 'bg-yellow-200 border-yellow-500 text-yellow-800',
    high: 'bg-orange-200 border-orange-500 text-orange-800',
    urgent: 'bg-red-200 border-red-500 text-red-800'
  };

  const statusColors = {
    pending: 'bg-yellow-200 border-yellow-500 text-yellow-800',
    in_progress: 'bg-blue-200 border-blue-500 text-blue-800',
    resolved: 'bg-green-200 border-green-500 text-green-800',
    rejected: 'bg-gray-200 border-gray-500 text-gray-800'
  };

  const statusLabels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    rejected: 'Rejected'
  };

  // TODO in stats fix total expenses
  const stats = [
    { label: 'Total Properties', value: properties?.length || 0, icon: Building, color: 'bg-blue-400' },
    { label: 'Total Units', value: units?.length || 0, icon: Home, color: 'bg-green-400' },
    { label: 'Occupied Units', value: units?.filter(u => u?.status === 'occupied').length || 0, icon: CheckCircle, color: 'bg-green-400' },
    { label: 'Available Units', value: units?.filter(u => u?.status === 'available').length || 0, icon: AlertCircle, color: 'bg-yellow-400' },
    { label: 'Total Rent Collected', value: `৳${totalCollected.toLocaleString()}`, icon: CreditCard, color: 'bg-green-400' },
    { label: 'Pending Rent', value: `৳${totalDue.toLocaleString()}`, icon: Clock, color: 'bg-orange-400' },
    { label: 'Total Expenses', value: '৳23,100', icon: DollarSign, color: 'bg-red-400' },
    { label: 'Maintenance Requests', value: maintenanceRequests?.length || 0, icon: Wrench, color: 'bg-blue-400' },
  ];

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans p-0.5 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Welcome back! Here's an overview of your properties.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 ${stat.color} border-2 border-black rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-black mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
            <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button onClick={() => openModal('addProperty')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Plus className="w-5 h-5 text-black" />
                <span className="font-medium text-black">Add Property</span>
              </button>
              <button onClick={() => openModal('addUnit')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Home className="w-5 h-5 text-black" />
                <span className="font-medium text-black">Add Unit</span>
              </button>
              <button onClick={() => openModal('addRenter')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Users className="w-5 h-5 text-black" />
                <span className="font-medium text-black">Add Renter</span>
              </button>
              <button onClick={() => openModal('generateInvoice')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <FileText className="w-5 h-5 text-black" />
                <span className="font-medium text-black">Generate Invoice</span>
              </button>
            </div>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
            <h2 className="text-xl font-bold text-black mb-4">Recent Maintenance</h2>
            <div className="space-y-3">
              {(maintenanceRequests || []).slice(0, 4).map((request) => (
                <div key={request?.id} className="flex items-center justify-between p-3 bg-gray-100 border-2 border-black rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 border-2 border-black rounded-full flex items-center justify-center ${priorityColors[request?.priority] || 'bg-yellow-400'}`}>
                      <Wrench className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-bold text-black">{request?.title || 'Untitled'}</p>
                      <p className="text-sm text-gray-600">{getUnitName(request?.unit_id)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${statusColors[request?.status] || 'bg-gray-200 border-gray-500 text-gray-800'}`}>
                    {statusLabels[request?.status] || 'Unknown'}
                  </span>
                </div>
              ))}
              {(maintenanceRequests?.length || 0) === 0 && (
                <div className="text-center py-4 text-gray-500">No maintenance requests found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm"></div>
          <div className="relative bg-gray-300 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-300 border-b-2 border-black p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-black">
                {modalType === 'addProperty' && 'Add Property'}
                {modalType === 'addUnit' && 'Add Unit'}
                {modalType === 'addRenter' && 'Add Renter'}
                {modalType === 'generateInvoice' && 'Generate Invoice'}
              </h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
              {modalType === 'addProperty' && (
                <AddPropertyForm onCloseButtonClick={closeModal} />
              )}

              {modalType === 'addUnit' && (
                  <AddUnitForm onCloseButtonClick={closeModal} isEdit={false} />
              )}
              
              {/* // TODO Here are more work to do  */}
              {modalType === 'addRenter' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Full Name</label>
                    <input type="text" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Phone Number</label>
                      <input type="text" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">NID Number</label>
                      <input type="text" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Date of Birth</label>
                    <input type="date" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                  </div>
                </>
              )}

              {modalType === 'generateInvoice' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Select Renter</label>
                    <select className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none">
                      <option>Select Renter</option>
                      <option>John Smith</option>
                      <option>Sarah Johnson</option>
                      <option>Mike Brown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Month</label>
                    <input type="month" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Amount</label>
                    <input type="number" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main_Dashboard;
