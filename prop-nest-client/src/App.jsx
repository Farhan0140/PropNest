import React, { useState } from 'react';
import { 
  LayoutDashboard, Building, Home, Users, CreditCard, DollarSign, 
  Wrench, BarChart3, Menu, X, Plus, Edit, Trash2, Eye, 
  FileText, Download, Upload, CheckCircle, AlertCircle, Clock,
  Search, Bell, ChevronDown, ChevronRight, Filter, Calendar,
  Phone, IdCard, FileUp, RefreshCw, MessageSquare
} from 'lucide-react';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedRenter, setSelectedRenter] = useState(null);
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

  const renters = [
    { id: 1, name: 'John Smith', phone: '+880 1712-345678', nid: '1234567890', dob: '1990-05-15', unit: 'Unit 101', property: 'Green House', rent: 15000, paymentStatus: 'paid', documents: ['NID.pdf', 'Photo.jpg'] },
    { id: 2, name: 'Sarah Johnson', phone: '+880 1812-345678', nid: '2345678901', dob: '1988-08-22', unit: 'Unit 201', property: 'Sunset Apartments', rent: 22000, paymentStatus: 'paid', documents: ['NID.pdf'] },
    { id: 3, name: 'Mike Brown', phone: '+880 1912-345678', nid: '3456789012', dob: '1992-03-10', unit: 'Unit 301', property: 'Oak Valley Condos', rent: 14000, paymentStatus: 'pending', documents: ['NID.pdf', 'Photo.jpg', 'Agreement.pdf'] },
    { id: 4, name: 'Emily Davis', phone: '+880 1612-345678', nid: '4567890123', dob: '1995-11-30', unit: null, property: null, rent: 0, paymentStatus: 'none', documents: ['NID.pdf'] },
  ];

  const rentPayments = [
    { id: 1, renter: 'John Smith', unit: 'Unit 101', amount: 15000, dueDate: '2024-01-01', paidDate: '2024-01-03', status: 'paid', lateFee: 0 },
    { id: 2, renter: 'Sarah Johnson', unit: 'Unit 201', amount: 22000, dueDate: '2024-01-01', paidDate: '2024-01-01', status: 'paid', lateFee: 0 },
    { id: 3, renter: 'Mike Brown', unit: 'Unit 301', amount: 14000, dueDate: '2024-01-01', paidDate: null, status: 'pending', lateFee: 500 },
    { id: 4, renter: 'Emily Davis', unit: 'Unit 402', amount: 16000, dueDate: '2024-01-01', paidDate: null, status: 'overdue', lateFee: 1000 },
  ];

  const expenses = [
    { id: 1, category: 'Maintenance', description: 'Plumbing Repair - Unit 308', amount: 450, date: '2024-01-14', status: 'approved' },
    { id: 2, category: 'Utilities', description: 'Water Bill - January', amount: 1200, date: '2024-01-10', status: 'paid' },
    { id: 3, category: 'Maintenance', description: 'HVAC Service - Unit 201', amount: 350, date: '2024-01-15', status: 'pending' },
    { id: 4, category: 'Security', description: 'Lock Replacement - Unit 402', amount: 275, date: '2024-01-14', status: 'approved' },
    { id: 5, category: 'Insurance', description: 'Property Insurance - Q1', amount: 3500, date: '2024-01-05', status: 'paid' },
  ];

  const maintenanceRequests = [
    { id: 1, title: 'Tap Leaking', unit: 'Unit 304', property: 'Green House', renter: 'John Smith', priority: 'urgent', status: 'pending', date: '2024-01-15', notes: [] },
    { id: 2, title: 'AC Not Cooling', unit: 'Unit 201', property: 'Sunset Apartments', renter: 'Sarah Johnson', priority: 'medium', status: 'in-progress', date: '2024-01-15', notes: ['Technician assigned'] },
    { id: 3, title: 'Electrical Outlet', unit: 'Unit 105', property: 'Downtown Lofts', renter: 'Mike Brown', priority: 'high', status: 'pending', date: '2024-01-14', notes: [] },
    { id: 4, title: 'Door Lock Broken', unit: 'Unit 402', property: 'Green House', renter: 'Emily Davis', priority: 'urgent', status: 'completed', date: '2024-01-14', notes: ['Fixed', 'New lock installed'] },
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'properties', 
      label: 'Property Management', 
      icon: Building,
      submenu: ['Add Property', 'Property List']
    },
    { 
      id: 'units', 
      label: 'Unit Management', 
      icon: Home,
      submenu: ['Add Unit', 'Unit List', 'Unit Status']
    },
    { 
      id: 'renters', 
      label: 'Renter Management', 
      icon: Users,
      submenu: ['Add Renter', 'Renter List', 'Assign Unit']
    },
    { 
      id: 'rent', 
      label: 'Rent Management', 
      icon: CreditCard,
      submenu: ['Generate Invoice', 'Payment Status', 'Add Payment', 'Late Fees']
    },
    { 
      id: 'expenses', 
      label: 'Expense Management', 
      icon: DollarSign,
      submenu: ['Add Expense', 'Expense List', 'Expense Reports']
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance Management', 
      icon: Wrench,
      submenu: ['View Complaints', 'Add Note', 'Update Status']
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: BarChart3,
      submenu: ['Income Report', 'Expense Report', 'Profit Report', 'Export']
    },
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

  const openModal = (type, data = null) => {
    setModalType(type);
    setSelectedProperty(data);
    setSelectedUnit(data);
    setSelectedRenter(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedProperty(null);
    setSelectedUnit(null);
    setSelectedRenter(null);
  };

  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gray-300 border-r-2 border-black shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] z-50 transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } lg:static lg:w-64 w-64`}>
        {/* Logo */}
        <div className="h-16 border-b-2 border-black flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <Building className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-black hidden lg:block">PropManage</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden bg-white border-2 border-black rounded-lg p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  setActiveSection(item.id);
                  if (item.submenu) {
                    setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-transparent border-transparent hover:bg-white hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-black" />
                  <span className="text-sm font-medium text-black hidden lg:block">{item.label}</span>
                </div>
                {item.submenu && (
                  <ChevronRight className={`w-4 h-4 text-black hidden lg:block transition-transform ${
                    activeSubmenu === item.id ? 'rotate-90' : ''
                  }`} />
                )}
              </button>
              
              {/* Submenu */}
              {item.submenu && activeSubmenu === item.id && (
                <div className="ml-4 mt-2 space-y-1 hidden lg:block">
                  {item.submenu.map((sub, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-1.5 text-sm text-black hover:bg-white hover:border-2 hover:border-black rounded-lg transition-all duration-200"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  );

  const Header = () => (
    <header className="h-16 bg-gray-300 border-b-2 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <Menu className="w-5 h-5 text-black" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 w-64"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
          <Bell className="w-5 h-5 text-black" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-black rounded-full text-xs text-white flex items-center justify-center">3</span>
        </button>
        <div className="w-10 h-10 bg-white border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <Users className="w-5 h-5 text-black" />
        </div>
      </div>
    </header>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back! Here's an overview of your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
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
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => openModal('addProperty')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <Plus className="w-5 h-5 text-black" />
              <span className="font-medium text-black">Add Property</span>
            </button>
            <button onClick={() => openModal('addUnit')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <Home className="w-5 h-5 text-black" />
              <span className="font-medium text-black">Add Unit</span>
            </button>
            <button onClick={() => openModal('addRenter')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <Users className="w-5 h-5 text-black" />
              <span className="font-medium text-black">Add Renter</span>
            </button>
            <button onClick={() => openModal('generateInvoice')} className="flex items-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
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
  );

  const PropertiesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Property Management</h1>
          <p className="text-gray-600 text-lg">Manage all your properties</p>
        </div>
        <button onClick={() => openModal('addProperty')} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-4 font-bold text-black">Property Name</th>
                <th className="text-left py-3 px-4 font-bold text-black">Address</th>
                <th className="text-left py-3 px-4 font-bold text-black">City</th>
                <th className="text-left py-3 px-4 font-bold text-black">Total Units</th>
                <th className="text-left py-3 px-4 font-bold text-black">Occupied</th>
                <th className="text-left py-3 px-4 font-bold text-black">Vacant</th>
                <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop) => (
                <tr key={prop.id} className="border-b border-gray-300 hover:bg-gray-300 transition-colors">
                  <td className="py-3 px-4 font-medium text-black">{prop.name}</td>
                  <td className="py-3 px-4 text-black">{prop.address}</td>
                  <td className="py-3 px-4 text-black">{prop.city}</td>
                  <td className="py-3 px-4 text-black">{prop.totalUnits}</td>
                  <td className="py-3 px-4 text-black">{prop.occupiedUnits}</td>
                  <td className="py-3 px-4 text-black">{prop.vacantUnits}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openModal('editProperty', prop)} className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => openModal('deleteProperty', prop)} className="bg-red-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const UnitsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Unit Management</h1>
          <p className="text-gray-600 text-lg">Manage all units and their status</p>
        </div>
        <button onClick={() => openModal('addUnit')} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Unit</span>
        </button>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-4 font-bold text-black">Unit</th>
                <th className="text-left py-3 px-4 font-bold text-black">Property</th>
                <th className="text-left py-3 px-4 font-bold text-black">Size</th>
                <th className="text-left py-3 px-4 font-bold text-black">Rent</th>
                <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                <th className="text-left py-3 px-4 font-bold text-black">Renter</th>
                <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="border-b border-gray-300 hover:bg-gray-300 transition-colors">
                  <td className="py-3 px-4 font-medium text-black">{unit.number}</td>
                  <td className="py-3 px-4 text-black">{unit.property}</td>
                  <td className="py-3 px-4 text-black">{unit.size}</td>
                  <td className="py-3 px-4 font-bold text-black">৳{unit.rent.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black ${
                      unit.status === 'occupied' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-black">{unit.renter || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openModal('editUnit', unit)} className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => openModal('deleteUnit', unit)} className="bg-red-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RentersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Renter Management</h1>
          <p className="text-gray-600 text-lg">Manage all renters and their information</p>
        </div>
        <button onClick={() => openModal('addRenter')} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Renter</span>
        </button>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-4 font-bold text-black">Name</th>
                <th className="text-left py-3 px-4 font-bold text-black">Phone</th>
                <th className="text-left py-3 px-4 font-bold text-black">NID</th>
                <th className="text-left py-3 px-4 font-bold text-black">Unit</th>
                <th className="text-left py-3 px-4 font-bold text-black">Rent</th>
                <th className="text-left py-3 px-4 font-bold text-black">Payment</th>
                <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {renters.map((renter) => (
                <tr key={renter.id} className="border-b border-gray-300 hover:bg-gray-300 transition-colors">
                  <td className="py-3 px-4 font-medium text-black">{renter.name}</td>
                  <td className="py-3 px-4 text-black">{renter.phone}</td>
                  <td className="py-3 px-4 text-black">{renter.nid}</td>
                  <td className="py-3 px-4 text-black">{renter.unit || '-'}</td>
                  <td className="py-3 px-4 font-bold text-black">৳{renter.rent.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black ${
                      renter.paymentStatus === 'paid' ? 'bg-green-400' : renter.paymentStatus === 'pending' ? 'bg-yellow-400' : 'bg-gray-300'
                    }`}>
                      {renter.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openModal('viewRenter', renter)} className="bg-white border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button onClick={() => openModal('editRenter', renter)} className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => openModal('deleteRenter', renter)} className="bg-red-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RentView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Rent Management</h1>
          <p className="text-gray-600 text-lg">Manage rent payments and invoices</p>
        </div>
        <button onClick={() => openModal('generateInvoice')} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>Generate Invoice</span>
        </button>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-4 font-bold text-black">Renter</th>
                <th className="text-left py-3 px-4 font-bold text-black">Unit</th>
                <th className="text-left py-3 px-4 font-bold text-black">Amount</th>
                <th className="text-left py-3 px-4 font-bold text-black">Due Date</th>
                <th className="text-left py-3 px-4 font-bold text-black">Paid Date</th>
                <th className="text-left py-3 px-4 font-bold text-black">Late Fee</th>
                <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-300 hover:bg-gray-300 transition-colors">
                  <td className="py-3 px-4 font-medium text-black">{payment.renter}</td>
                  <td className="py-3 px-4 text-black">{payment.unit}</td>
                  <td className="py-3 px-4 font-bold text-black">৳{payment.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-black">{payment.dueDate}</td>
                  <td className="py-3 px-4 text-black">{payment.paidDate || '-'}</td>
                  <td className="py-3 px-4 text-black">৳{payment.lateFee}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black ${
                      payment.status === 'paid' ? 'bg-green-400' : payment.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {payment.status !== 'paid' && (
                        <button onClick={() => openModal('addPayment', payment)} className="bg-green-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          <CheckCircle className="w-3 h-3" />
                        </button>
                      )}
                      <button className="bg-white border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <FileText className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ExpensesView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Expense Management</h1>
          <p className="text-gray-600 text-lg">Track and manage all expenses</p>
        </div>
        <button onClick={() => openModal('addExpense')} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-4 font-bold text-black">Category</th>
                <th className="text-left py-3 px-4 font-bold text-black">Description</th>
                <th className="text-left py-3 px-4 font-bold text-black">Amount</th>
                <th className="text-left py-3 px-4 font-bold text-black">Date</th>
                <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-gray-300 hover:bg-gray-300 transition-colors">
                  <td className="py-3 px-4 font-medium text-black">{expense.category}</td>
                  <td className="py-3 px-4 text-black">{expense.description}</td>
                  <td className="py-3 px-4 font-bold text-black">৳{expense.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-black">{expense.date}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black ${
                      expense.status === 'paid' ? 'bg-green-400' : expense.status === 'approved' ? 'bg-blue-400' : 'bg-yellow-400'
                    }`}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openModal('editExpense', expense)} className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button onClick={() => openModal('deleteExpense', expense)} className="bg-red-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MaintenanceView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Maintenance Management</h1>
        <p className="text-gray-600 text-lg">View and manage all maintenance requests</p>
      </div>

      <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
        <div className="space-y-4">
          {maintenanceRequests.map((request) => (
            <div key={request.id} className="p-4 bg-gray-300 border-2 border-black rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 border-2 border-black rounded-full flex items-center justify-center ${
                    request.priority === 'urgent' ? 'bg-red-400' : request.priority === 'high' ? 'bg-orange-400' : 'bg-yellow-400'
                  }`}>
                    <Wrench className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black">{request.title}</h3>
                    <p className="text-sm text-gray-600">{request.unit} - {request.property}</p>
                    <p className="text-sm text-gray-600">Renter: {request.renter}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black ${
                    request.priority === 'urgent' ? 'bg-red-400' : request.priority === 'high' ? 'bg-orange-400' : 'bg-yellow-400'
                  }`}>
                    {request.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 border-black ${
                    request.status === 'completed' ? 'bg-green-400' : request.status === 'in-progress' ? 'bg-blue-400' : 'bg-gray-300'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Reported: {request.date}</p>
                <div className="flex items-center space-x-2">
                  <button onClick={() => openModal('addNote', request)} className="bg-white border-2 border-black rounded px-3 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>Add Note</span>
                  </button>
                  <button onClick={() => openModal('updateStatus', request)} className="bg-blue-400 border-2 border-black rounded px-3 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center space-x-1">
                    <RefreshCw className="w-3 h-3" />
                    <span>Update Status</span>
                  </button>
                </div>
              </div>
              {request.notes.length > 0 && (
                <div className="mt-3 pt-3 border-t-2 border-black">
                  <p className="text-sm font-bold text-black mb-2">Notes:</p>
                  <ul className="space-y-1">
                    {request.notes.map((note, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReportsView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Reports</h1>
        <p className="text-gray-600 text-lg">View and export financial reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-400 border-2 border-black rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-black">Income Report</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Monthly and yearly income breakdown</p>
          <button className="w-full bg-gray-300 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>View Report</span>
          </button>
        </div>

        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-400 border-2 border-black rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-black">Expense Report</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Detailed expense tracking and analysis</p>
          <button className="w-full bg-gray-300 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>View Report</span>
          </button>
        </div>

        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-400 border-2 border-black rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold text-black">Profit Report</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Net profit calculation and trends</p>
          <button className="w-full bg-gray-300 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center justify-center space-x-2">
            <Download className="w-4 h-4" />
            <span>View Report</span>
          </button>
        </div>

        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] md:col-span-2 lg:col-span-3">
          <h3 className="text-xl font-bold text-black mb-4">Export Data</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <FileText className="w-5 h-5 text-black" />
              <span className="font-medium text-black">Export as PDF</span>
            </button>
            <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-300 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <FileUp className="w-5 h-5 text-black" />
              <span className="font-medium text-black">Export as Excel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Modal = () => {
    if (!isModalOpen) return null;

    const modalTitles = {
      addProperty: 'Add Property',
      editProperty: 'Edit Property',
      deleteProperty: 'Delete Property',
      addUnit: 'Add Unit',
      editUnit: 'Edit Unit',
      deleteUnit: 'Delete Unit',
      addRenter: 'Add Renter',
      editRenter: 'Edit Renter',
      deleteRenter: 'Delete Renter',
      viewRenter: 'Renter Details',
      generateInvoice: 'Generate Invoice',
      addPayment: 'Add Payment',
      addExpense: 'Add Expense',
      editExpense: 'Edit Expense',
      deleteExpense: 'Delete Expense',
      addNote: 'Add Note',
      updateStatus: 'Update Status',
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal}></div>
        <div className="relative bg-gray-300 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-300 border-b-2 border-black p-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-black">{modalTitles[modalType]}</h3>
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
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Upload Documents</label>
                  <div className="bg-white border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <input type="file" multiple className="w-full text-sm text-gray-600" />
                  </div>
                </div>
              </>
            )}

            {modalType === 'viewRenter' && selectedRenter && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-black" />
                  <span className="text-black font-medium">{selectedRenter.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-black" />
                  <span className="text-black">{selectedRenter.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IdCard className="w-4 h-4 text-black" />
                  <span className="text-black">{selectedRenter.nid}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-black" />
                  <span className="text-black">DOB: {selectedRenter.dob}</span>
                </div>
                <div className="pt-3 border-t-2 border-black">
                  <p className="text-sm font-bold text-black mb-2">Documents:</p>
                  <div className="space-y-1">
                    {selectedRenter.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white border-2 border-black rounded">
                        <span className="text-sm text-black">{doc}</span>
                        <button className="text-black hover:underline text-sm">Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {modalType === 'addNote' && (
              <>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Add Note</label>
                  <textarea className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none h-24" placeholder="Enter note..." />
                </div>
              </>
            )}

            <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black">
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                Cancel
              </button>
              <button onClick={closeModal} className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard': return <DashboardView />;
      case 'properties': return <PropertiesView />;
      case 'units': return <UnitsView />;
      case 'renters': return <RentersView />;
      case 'rent': return <RentView />;
      case 'expenses': return <ExpensesView />;
      case 'maintenance': return <MaintenanceView />;
      case 'reports': return <ReportsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      <Modal />
    </div>
  );
};

export default App;
