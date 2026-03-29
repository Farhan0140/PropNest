import { useState } from 'react';
import { 
  Building, Home, Users, CreditCard, DollarSign, 
  Wrench, Plus, CheckCircle, AlertCircle, Clock,
  FileText, X
} from 'lucide-react';

const Main_Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Sample Data
  const properties = [
    { id: 1, name: 'Green House', address: 'Basundhara, Dhaka', city: 'Dhaka', totalUnits: 4, occupiedUnits: 3, vacantUnits: 1, floors: 9, baseRent: 15000 },
    { id: 2, name: 'Sunset Apartments', address: 'Gulshan, Dhaka', city: 'Dhaka', totalUnits: 24, occupiedUnits: 22, vacantUnits: 2, floors: 6, baseRent: 18000 },
    { id: 3, name: 'Oak Valley Condos', address: 'Banani, Dhaka', city: 'Dhaka', totalUnits: 18, occupiedUnits: 15, vacantUnits: 3, floors: 4, baseRent: 22000 },
    { id: 4, name: 'Downtown Lofts', address: 'Dhanmondi, Dhaka', city: 'Dhaka', totalUnits: 32, occupiedUnits: 31, vacantUnits: 1, floors: 8, baseRent: 25000 },
  ];

  const units = [
    { id: 1, number: 'Unit 101', property: 'Green House', size: '750 sqft', rent: 15000, status: 'occupied', renter: 'John Smith' },
    { id: 2, number: 'Unit 102', property: 'Green House', size: '950 sqft', rent: 18000, status: 'vacant', renter: null },
    { id: 3, number: 'Unit 201', property: 'Sunset Apartments', size: '1100 sqft', rent: 22000, status: 'occupied', renter: 'Sarah Johnson' },
    { id: 4, number: 'Unit 202', property: 'Sunset Apartments', size: '800 sqft', rent: 16000, status: 'vacant', renter: null },
    { id: 5, number: 'Unit 301', property: 'Oak Valley Condos', size: '550 sqft', rent: 14000, status: 'occupied', renter: 'Mike Brown' },
    { id: 6, number: 'Unit 302', property: 'Oak Valley Condos', size: '1500 sqft', rent: 32000, status: 'vacant', renter: null },
  ];

  const maintenanceRequests = [
    { id: 1, title: 'Tap Leaking', unit: 'Unit 304', property: 'Green House', renter: 'John Smith', priority: 'urgent', status: 'pending', date: '2024-01-15', notes: [] },
    { id: 2, title: 'AC Not Cooling', unit: 'Unit 201', property: 'Sunset Apartments', renter: 'Sarah Johnson', priority: 'medium', status: 'in-progress', date: '2024-01-15', notes: ['Technician assigned'] },
    { id: 3, title: 'Electrical Outlet', unit: 'Unit 105', property: 'Downtown Lofts', renter: 'Mike Brown', priority: 'high', status: 'pending', date: '2024-01-14', notes: [] },
    { id: 4, title: 'Door Lock Broken', unit: 'Unit 402', property: 'Green House', renter: 'Emily Davis', priority: 'urgent', status: 'completed', date: '2024-01-14', notes: ['Fixed', 'New lock installed'] },
  ];

  const stats = [
    { label: 'Total Properties', value: properties.length, icon: Building, color: 'bg-blue-400' },
    { label: 'Total Units', value: units.length, icon: Home, color: 'bg-green-400' },
    { label: 'Occupied Units', value: units.filter(u => u.status === 'occupied').length, icon: CheckCircle, color: 'bg-green-400' },
    { label: 'Vacant Units', value: units.filter(u => u.status === 'vacant').length, icon: AlertCircle, color: 'bg-yellow-400' },
    { label: 'Monthly Rent Collected', value: '৳67,890', icon: CreditCard, color: 'bg-green-400' },
    { label: 'Pending Rent', value: '৳12,450', icon: Clock, color: 'bg-orange-400' },
    { label: 'Total Expenses', value: '৳23,100', icon: DollarSign, color: 'bg-red-400' },
    { label: 'Maintenance Requests', value: maintenanceRequests.length, icon: Wrench, color: 'bg-blue-400' },
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
              {maintenanceRequests.slice(0, 4).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-300 border-2 border-black rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 border-2 border-black rounded-full flex items-center justify-center ${
                      request.priority === 'urgent' ? 'bg-red-400' : request.priority === 'high' ? 'bg-orange-400' : 'bg-yellow-400'
                    }`}>
                      <Wrench className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-bold text-black">{request.title}</p>
                      <p className="text-sm text-gray-600">{request.unit}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${
                    request.status === 'completed' ? 'bg-green-400' : request.status === 'in-progress' ? 'bg-blue-400' : 'bg-gray-300'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 backdrop-blur-sm" onClick={closeModal}></div>
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
            <div className="p-4 space-y-4">
              {modalType === 'addProperty' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Property Name</label>
                    <input type="text" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Address</label>
                    <input type="text" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">City</label>
                      <input type="text" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Total Units</label>
                      <input type="number" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                    </div>
                  </div>
                </>
              )}

              {modalType === 'addUnit' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Unit Number</label>
                    <input type="text" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Property</label>
                    <select className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none">
                      <option>Select Property</option>
                      {properties.map(prop => (
                        <option key={prop.id}>{prop.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Size (sqft)</label>
                      <input type="number" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Rent</label>
                      <input type="number" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                    </div>
                  </div>
                </>
              )}

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

              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black">
                <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Cancel
                </button>
                <button onClick={closeModal} className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main_Dashboard;
