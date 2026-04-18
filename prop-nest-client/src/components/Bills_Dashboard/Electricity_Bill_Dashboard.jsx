import { useState, useMemo, useRef } from 'react';
import { Plus, X, Search, Building2, FileText, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const Electricity_Bill_Dashboard = () => {
  // Use Context
  const { 
    properties, 
    units, 
    electricity_readings, 
    CreateElectricityReading, 
    isCreatingReading 
  } = useAdminContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  const [addFormData, setAddFormData] = useState({ current_reading: '', date: '' });
  const monthInputRef = useRef(null);

  // Filter Logic
  // We need to filter based on Unit Name, Property Name, or current reading value
  const filteredReadings = electricity_readings.filter(reading => {
    const unit = units.find(u => u.id === reading.unit_id);
    const prop = unit ? properties.find(p => p.id === unit.property_id) : null;
    const query = searchQuery.toLowerCase();
    
    return (
      unit?.unit_name?.toLowerCase().includes(query) ||
      prop?.house_name?.toLowerCase().includes(query) ||
      reading.current_reading?.toString().includes(query)
    );
  });

  // Group Readings by Property
  const groupedReadings = useMemo(() => {
    const groups = {};
    filteredReadings.forEach(reading => {
      const unit = units.find(u => u.id === reading.unit_id);
      if (!unit) return;

      const prop = properties.find(p => p.id === unit.property_id);
      const propId = prop?.id || 'unknown';

      if (!groups[propId]) {
        groups[propId] = { 
          property: prop || { id: 'unknown', name: 'Unknown Property', house_name: 'Unknown Property' }, 
          readings: [] 
        };
      }
      
      // Flatten the data slightly for easier access in the UI
      groups[propId].readings.push({
        ...reading,
        unit_name: unit.unit_name,
        property_name: prop?.house_name || prop?.name
      });
    });
    return Object.values(groups);
  }, [filteredReadings, units, properties]);

  // Handlers
  const openAddModal = (reading) => {
    setSelectedReading(reading);
    setAddFormData({ 
      current_reading: reading.current_reading, // Pre-fill with current reading
      date: new Date().toISOString().slice(0, 7) 
    });
    setIsAddModalOpen(true);
  };

  const openHistoryModal = (reading) => {
    setSelectedReading(reading);
    setIsHistoryModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsHistoryModalOpen(false);
    setSelectedReading(null);
  };

  const handleAddReading = async () => {
    if (!selectedReading) return;
    const newReading = Number(addFormData.current_reading);
    
    if (newReading < selectedReading.current_reading) {
      alert("Current reading cannot be less than previous reading!");
      return;
    }

    const payload = {
      unit_id: selectedReading.unit_id,
      current_reading: newReading,
      date: addFormData.date
    };

    try {
      await CreateElectricityReading(payload);
      closeModal();
      // Context should handle refreshing the list
    } catch (error) {
      console.error("Failed to add reading:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-2">Electricity Tracker</h1>
          <p className="text-gray-600 text-lg">Track monthly electricity</p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <div className="relative max-w-md md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search units, property, or reading..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Grouped Tables by Property */}
        <div className="space-y-8">
          {groupedReadings.length > 0 ? (
            groupedReadings.map(({ property, readings: propReadings }) => (
              <div key={property?.id} className="mb-6">
                <div className="flex items-center space-x-3 mb-3 px-1">
                  <Building2 className="w-5 h-5 text-black" />
                  <h3 className="text-xl font-bold text-black">{property?.house_name || property?.name || 'Unknown Property'}</h3>
                  <span className="bg-gray-500 border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-white">
                    {propReadings.length} Unit{propReadings.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-black">
                          <th className="text-left py-3 px-4 font-bold text-black">Unit Name</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Current Unit</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Last Reading Date</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propReadings.map((reading) => (
                          <tr key={reading.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors last:border-b-0">
                            <td className="py-3 px-4 font-medium text-black">{reading.unit_name}</td>
                            <td className="py-3 px-4 text-black font-mono font-bold text-lg">{reading.current_reading}</td>
                            <td className="py-3 px-4 text-black">{reading.date || '-'}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openAddModal(reading)}
                                  className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Update</span>
                                </button>
                                <button
                                  onClick={() => openHistoryModal(reading)}
                                  className="bg-gray-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center space-x-1"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>History</span>
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
            ))
          ) : (
            <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
              No units found
            </div>
          )}
        </div>
      </div>

      {/* Add Reading Modal */}
      {isAddModalOpen && selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold text-black">Update Reading</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Unit</span>
                <span className="text-lg font-bold text-black">{selectedReading.unit_name}</span>
              </div>
              
              <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
                <span className="text-sm font-bold text-gray-600">Current / Previous</span>
                <span className="text-lg font-bold text-black">{selectedReading.current_reading} Units</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">* New Current Reading</label>
                <input
                  type="number"
                  placeholder="Enter new meter reading"
                  value={addFormData.current_reading}
                  onChange={e => setAddFormData({...addFormData, current_reading: e.target.value})}
                  className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">Reading Date</label>
                <div className="relative">
                  <input
                    ref={monthInputRef}
                    type="month"
                    value={addFormData.date}
                    onChange={e => setAddFormData({...addFormData, date: e.target.value})}
                    className="w-full bg-white border-2 border-black rounded-lg py-2 pl-3 pr-10 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={() => monthInputRef.current?.showPicker?.()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Open month picker"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
                <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button 
                  onClick={handleAddReading} 
                  disabled={isCreatingReading}
                  className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingReading ? 'Saving...' : 'Save Reading'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">Unit History</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="p-3 bg-white border-2 border-black rounded-lg mb-4">
                <p className="text-sm text-gray-500">Unit: <span className="font-bold text-black">{selectedReading.unit_name}</span></p>
                <p className="text-sm text-gray-500">Property: <span className="font-bold text-black">{selectedReading.property_name}</span></p>
              </div>

              {selectedReading.history && selectedReading.history.length > 0 ? (
                <div className="space-y-3">
                  {selectedReading.history.map((item, index) => (
                    <div key={item.id} className="bg-white border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                      {/* Connection Line Visual */}
                      {index < selectedReading.history.length - 1 && (
                        <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-gray-300 -z-10 h-full"></div>
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-black flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span>{item.month || item.date}</span>
                        </span>
                        <span className="text-xs text-gray-500">{item.date}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Prev</span>
                            <span className="font-bold text-black">{item.previous}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500">Curr</span>
                            <span className="font-bold text-black">{item.current}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full border-2 border-green-500">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-bold text-green-700">+{item.consumed} Units</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No history available for this unit.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Electricity_Bill_Dashboard;
