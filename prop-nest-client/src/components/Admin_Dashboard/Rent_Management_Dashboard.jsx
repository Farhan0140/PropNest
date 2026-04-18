import { useState, useMemo } from 'react';
import { 
  Plus, Eye, X, Search, CheckCircle, DollarSign, AlertCircle, 
  CreditCard, Clock, FileText, Trash2, RefreshCw, Building2
} from 'lucide-react';

const Rent_Management_Dashboard = () => {
  const [properties] = useState([
    { id: 1, name: 'Green House' },
    { id: 2, name: 'Sunset Apartments' },
    { id: 3, name: 'Oak Valley Condos' }
  ]);

  const [invoices, setInvoices] = useState([
    { id: 1, property_id: 1, property_name: 'Green House', renter: 'John Smith', unit: 'Unit 101', month: '2024-01', rentAmount: 15000, electricity: 500, gas: 300, water: 200, lateFee: 0, total: 16000, dueDate: '2024-01-05', status: 'paid', paidDate: '2024-01-03' },
    { id: 2, property_id: 2, property_name: 'Sunset Apartments', renter: 'Sarah Johnson', unit: 'Unit 201', month: '2024-01', rentAmount: 22000, electricity: 0, gas: 0, water: 350, lateFee: 0, total: 22350, dueDate: '2024-01-05', status: 'paid', paidDate: '2024-01-05' },
    { id: 3, property_id: 3, property_name: 'Oak Valley Condos', renter: 'Mike Brown', unit: 'Unit 301', month: '2024-01', rentAmount: 14000, electricity: 400, gas: 250, water: 200, lateFee: 500, total: 15350, dueDate: '2024-01-05', status: 'pending', paidDate: null },
    { id: 4, property_id: 1, property_name: 'Green House', renter: 'Emily Davis', unit: 'Unit 402', month: '2024-01', rentAmount: 16000, electricity: 600, gas: 400, water: 300, lateFee: 1000, total: 18300, dueDate: '2024-01-05', status: 'overdue', paidDate: null },
    { id: 5, property_id: 2, property_name: 'Sunset Apartments', renter: 'David Wilson', unit: 'Unit 501', month: '2024-02', rentAmount: 18000, electricity: 450, gas: 350, water: 250, lateFee: 0, total: 19050, dueDate: '2024-02-05', status: 'unpaid', paidDate: null },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({ property_id: '', renter: '', unit: '', month: '', rentAmount: '', dueDate: '' });

  // Stats
  const totalCollected = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalDue = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
  const thisMonthIncome = invoices.filter(inv => inv.status === 'paid' && inv.month === '2024-01').reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  const filteredInvoices = invoices.filter(inv => {
    const prop = properties.find(p => p.id === inv.property_id);
    const query = searchQuery.toLowerCase();
    return (
      inv.renter.toLowerCase().includes(query) ||
      inv.unit.toLowerCase().includes(query) ||
      inv.status.toLowerCase().includes(query) ||
      inv.month.includes(query) ||
      (prop && prop.name.toLowerCase().includes(query))
    );
  });

  const groupedInvoices = useMemo(() => {
    const groups = {};
    filteredInvoices.forEach(inv => {
      const propId = inv.property_id;
      if (!groups[propId]) {
        const prop = properties.find(p => p.id === propId);
        groups[propId] = { property: prop?.name || 'Unknown Property', propertyId: propId, invoices: [] };
      }
      groups[propId].invoices.push(inv);
    });
    return Object.values(groups);
  }, [filteredInvoices, properties]);

  const openGenerateModal = () => {
    setFormData({ property_id: '', renter: '', unit: '', month: '', rentAmount: '', dueDate: '' });
    setIsGenerateModalOpen(true);
  };

  const openDetailsModal = (inv) => {
    setSelectedInvoice(inv);
    setIsDetailsModalOpen(true);
  };

  const closeModal = () => {
    setIsGenerateModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleGenerateSave = () => {
    if (!formData.renter || !formData.unit) return;
    const selectedProp = properties.find(p => p.id === Number(formData.property_id));
    const newInv = {
      id: Math.max(0, ...invoices.map(i => i.id)) + 1,
      property_id: Number(formData.property_id) || 0,
      property_name: selectedProp?.name || 'Unknown',
      renter: formData.renter,
      unit: formData.unit,
      month: formData.month,
      rentAmount: Number(formData.rentAmount) || 0,
      electricity: 0, gas: 0, water: 0, lateFee: 0,
      total: Number(formData.rentAmount) || 0,
      dueDate: formData.dueDate,
      status: 'unpaid',
      paidDate: null
    };
    setInvoices([newInv, ...invoices]);
    closeModal();
  };

  const markAsPaid = (id) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : inv));
  };

  const deleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
      closeModal();
    }
  };

  const statusStyles = {
    paid: 'bg-green-400',
    pending: 'bg-yellow-400',
    overdue: 'bg-red-400',
    unpaid: 'bg-gray-300'
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-2">Rent Management</h1>
          <p className="text-gray-600 text-lg">Track invoices, payments, and monthly billing</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Collected', value: `৳${totalCollected.toLocaleString()}`, icon: CheckCircle, color: 'bg-green-400' },
            { label: 'Total Due', value: `৳${totalDue.toLocaleString()}`, icon: Clock, color: 'bg-yellow-400' },
            { label: 'This Month Income', value: `৳${thisMonthIncome.toLocaleString()}`, icon: DollarSign, color: 'bg-blue-400' },
            { label: 'Overdue Invoices', value: overdueCount, icon: AlertCircle, color: 'bg-red-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all duration-200">
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

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <div className="relative max-w-md md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search renter, unit, property, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              />
            </div>
          </div>
          <button
            onClick={openGenerateModal}
            className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>

        {/* Grouped Tables by Property */}
        <div className="space-y-8">
          {groupedInvoices.length > 0 ? (
            groupedInvoices.map(({ property, propertyId, invoices: propInvoices }) => (
              <div key={propertyId} className="mb-6">
                <div className="flex items-center space-x-3 mb-3 px-1">
                  <Building2 className="w-5 h-5 text-black" />
                  <h3 className="text-xl font-bold text-black">{property}</h3>
                  <span className="bg-gray-500 border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-white">
                    {propInvoices.length} Invoice{propInvoices.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-black">
                          <th className="text-left py-3 px-4 font-bold text-black">Renter</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Unit</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Month</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Due Date</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Total</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propInvoices.map((inv) => (
                          <tr key={inv.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors last:border-b-0">
                            <td className="py-3 px-4 font-medium text-black">{inv.renter}</td>
                            <td className="py-3 px-4 text-black">{inv.unit}</td>
                            <td className="py-3 px-4 text-black font-mono">{inv.month}</td>
                            <td className="py-3 px-4 text-black">{inv.dueDate}</td>
                            <td className="py-3 px-4 font-bold text-black">৳{inv.total.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${statusStyles[inv.status]} text-black`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openDetailsModal(inv)}
                                  className="bg-white border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                                {inv.status !== 'paid' && (
                                  <button
                                    onClick={() => markAsPaid(inv.id)}
                                    className="bg-green-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
              No invoices found
            </div>
          )}
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold text-black">Generate Invoice</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">* Property</label>
                <select 
                  value={formData.property_id} 
                  onChange={e => setFormData({...formData, property_id: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer appearance-none"
                  style={{ color: '#000000' }}
                >
                  <option value="">Select Property</option>
                  {properties.map(prop => (
                    <option key={prop.id} value={prop.id}>{prop.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">* Renter Name</label>
                <input type="text" value={formData.renter} onChange={e => setFormData({...formData, renter: e.target.value})} placeholder="John Doe" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">* Unit</label>
                  <input type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="Unit 101" className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">* Month</label>
                  <input type="month" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Base Rent (৳)</label>
                  <input type="number" value={formData.rentAmount} onChange={e => setFormData({...formData, rentAmount: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer" onClick={(e) => e.target.showPicker?.()} />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
                <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button onClick={handleGenerateSave} className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Generate</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details Modal */}
      {isDetailsModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">Invoice Details</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <p className="text-xs text-gray-500 font-bold mb-1">Property</p>
                  <p className="font-bold text-black">{selectedInvoice.property_name}</p>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <p className="text-xs text-gray-500 font-bold mb-1">Renter</p>
                  <p className="font-bold text-black">{selectedInvoice.renter}</p>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-lg col-span-2">
                  <p className="text-xs text-gray-500 font-bold mb-1">Unit / Month</p>
                  <p className="font-bold text-black">{selectedInvoice.unit} | {selectedInvoice.month}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-black flex items-center space-x-2"><CreditCard className="w-4 h-4" /><span>Breakdown</span></h4>
                {[
                  { label: 'Base Rent', val: selectedInvoice.rentAmount },
                  { label: 'Electricity', val: selectedInvoice.electricity },
                  { label: 'Gas', val: selectedInvoice.gas },
                  { label: 'Water', val: selectedInvoice.water },
                  { label: 'Late Fee', val: selectedInvoice.lateFee },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-white border-2 border-black rounded-lg">
                    <span className="text-black font-medium">{item.label}</span>
                    <span className="text-black font-bold">৳{item.val.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-gray-300 border-2 border-black rounded-lg mt-2">
                  <span className="text-black font-bold text-lg">Total Amount</span>
                  <span className="text-black font-bold text-xl">৳{selectedInvoice.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <p className="text-xs text-gray-500 font-bold mb-1">Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-bold border-2 border-black ${statusStyles[selectedInvoice.status]} text-black`}>
                    {selectedInvoice.status}
                  </span>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <p className="text-xs text-gray-500 font-bold mb-1">Due Date</p>
                  <p className="font-bold text-black">{selectedInvoice.dueDate || 'N/A'}</p>
                </div>
                {selectedInvoice.paidDate && (
                  <div className="p-3 bg-white border-2 border-black rounded-lg col-span-2">
                    <p className="text-xs text-gray-500 font-bold mb-1">Paid On</p>
                    <p className="font-bold text-green-700">{selectedInvoice.paidDate}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-black mt-2">
                {selectedInvoice.status !== 'paid' ? (
                  <button onClick={() => { markAsPaid(selectedInvoice.id); }} className="flex-1 mr-3 bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none">
                    Mark as Paid
                  </button>
                ) : (
                  <div className="flex-1 mr-3 bg-green-300 border-2 border-black rounded-lg px-4 py-2 font-bold text-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Already Paid
                  </div>
                )}
                <button onClick={() => deleteInvoice(selectedInvoice.id)} className="bg-red-400 border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rent_Management_Dashboard;
