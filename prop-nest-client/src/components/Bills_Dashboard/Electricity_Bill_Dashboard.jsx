import { useState, useMemo } from 'react';
import { Plus, X, Search, Building2, FileText, Calendar, ArrowRight, CheckCircle, Pencil } from 'lucide-react';
import useAdminContext from '../../hooks/Admin/useAdminContext';
import AddNewElectricityUnitForm from '../modals/AddNewElectricityUnitForm';

const Electricity_Bill_Dashboard = () => {
  const { 
    properties, 
    units, 
    electricityReadings, 
    setElectricityReadings,
    CreateElectricityReading, 
    UpdateElectricityReading, // Assuming this exists in your context, remove if not needed
    setIsLoading 
  } = useAdminContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedReading, setSelectedReading] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [updateFormValue, setUpdateFormValue] = useState('');

  // Filter Units Logic (Show all units that match search, regardless of reading status)
  const filteredUnits = useMemo(() => {
    return units?.filter(unit => {
      const prop = properties.find(p => p.id === unit.property_id);
      const query = searchQuery.toLowerCase();
      
      return (
        unit?.unit_name?.toLowerCase().includes(query) ||
        prop?.house_name?.toLowerCase().includes(query)
      );
    }) || [];
  }, [units, properties, searchQuery]);

  // Group Units by Property and attach latest reading if exists
  const groupedReadings = useMemo(() => {
    const groups = {};

    filteredUnits.forEach(unit => {
      const prop = properties.find(p => p.id === unit.property_id);
      const propId = prop?.id || 'unknown';

      if (!groups[propId]) {
        groups[propId] = { 
          property: prop || { id: 'unknown', name: 'Unknown Property', house_name: 'Unknown Property' }, 
          readings: [] 
        };
      }

      // Find the latest reading for this unit
      const allUnitReadings = electricityReadings?.filter(r => r?.unit_id === unit.id) || [];
      const latestReading = allUnitReadings.length > 0 
        ? allUnitReadings.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year; // Descending year
            return b.month - a.month; // Descending month
          })[0]
        : null;

      // Add unit to the group
      groups[propId].readings.push({
        id: latestReading ? latestReading.id : `unit_${unit.id}`,
        unit_id: unit.id,
        unit_name: unit.unit_name,
        reading_value: latestReading ? latestReading.reading_value : '-',
        year: latestReading ? latestReading.year : '-',
        month: latestReading ? latestReading.month : '-',
        property_name: prop?.house_name || prop?.name,
        hasReading: !!latestReading
      });
    });

    return Object.values(groups);
  }, [filteredUnits, properties, electricityReadings]);

  // Handlers
  const openAddModal = (reading) => {
    setSelectedReading(reading);
    setIsAddModalOpen(true);
  };

  const openUpdateModal = (reading) => {
    if (reading.reading_value === '-') {
      alert("No existing reading to update. Please use 'Add New' first.");
      return;
    }
    setSelectedReading(reading);
    setUpdateFormValue(reading.reading_value);
    setIsUpdateModalOpen(true);
  };

  const openHistoryModal = (reading) => {
    setSelectedReading(reading);
    
    // Retrieve full history for this specific unit from the main list
    const unitHistory = electricityReadings
      ?.filter(r => r.unit_id === reading.unit_id)
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .map((item, idx, arr) => {
        const prevItem = arr[idx - 1];
        const previous = prevItem ? prevItem.reading_value : 0;
        const current = item.reading_value;
        const consumed = idx > 0 ? (current - previous).toFixed(2) : 'First';
        return {
          ...item,
          previous: previous,
          current: current,
          consumed: consumed
        };
      }) || [];
    
    setHistoryData(unitHistory.reverse()); // Show latest first in modal
    setIsHistoryModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsHistoryModalOpen(false);
    setSelectedReading(null);
    setHistoryData([]);
    setUpdateFormValue('');
  };

  const handleUpdateReading = async () => {
    if (!selectedReading) return;
    const newReading = Number(updateFormValue);
    
    if (isNaN(newReading)) {
      alert("Please enter a valid number");
      return;
    }

    if (newReading < 0) {
      alert("Reading cannot be negative");
      return;
    }

    try {
      // Replace with your actual update API/context call
      if (UpdateElectricityReading) {
        await UpdateElectricityReading({
          id: selectedReading.id,
          unit_id: selectedReading.unit_id,
          reading_value: newReading,
          year: selectedReading.year,
          month: selectedReading.month
        });
      } else {
        console.warn("UpdateElectricityReading not provided in context. Add your API call here.");
        // Fallback for demonstration
        alert("Update logic placeholder called. Integrate your update API.");
      }
      closeModal();
    } catch (error) {
      console.error("Failed to update reading:", error);
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
                            <td className="py-3 px-4 text-black font-mono font-bold text-lg">{reading.reading_value}</td>
                            <td className="py-3 px-4 text-black">
                              {reading.reading_value !== '-' 
                                ? `${reading.year}-${String(reading.month).padStart(2, '0')}` 
                                : '-'}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openAddModal(reading)}
                                  className="bg-green-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center space-x-1"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => openUpdateModal(reading)}
                                  className="bg-yellow-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center space-x-1"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => openHistoryModal(reading)}
                                  className="bg-gray-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center space-x-1"
                                >
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
        <AddNewElectricityUnitForm 
          closeModal={closeModal}
          selectedReading={selectedReading}  
        />
      )}

      {/* Update Reading Modal */}
      {isUpdateModalOpen && selectedReading && (
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
                <span className="text-sm font-bold text-gray-600">Period</span>
                <span className="text-lg font-bold text-black">{`${selectedReading.year}-${String(selectedReading.month).padStart(2, '0')}`}</span>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1">* Updated Reading Value</label>
                <input
                  type="number"
                  step="any"
                  value={updateFormValue}
                  onChange={(e) => setUpdateFormValue(e.target.value)}
                  placeholder="Enter corrected meter reading"
                  className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
                <button type="button" onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button 
                  type="button"
                  onClick={handleUpdateReading}
                  className="bg-yellow-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  Save Update
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
            <div className="p-4 space-y-4 overflow-y-scroll">
              <div className="p-3 bg-white border-2 border-black rounded-lg mb-4">
                <p className="text-sm text-gray-500">Unit: <span className="font-bold text-black">{selectedReading.unit_name}</span></p>
                <p className="text-sm text-gray-500">Property: <span className="font-bold text-black">{selectedReading.property_name}</span></p>
              </div>

              {historyData.length > 0 ? (
                <div className="space-y-3">
                  {historyData.map((item, index) => (
                    <div key={item.id} className="bg-white border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                      {index < historyData.length - 1 && (
                        <div className="absolute top-0 left-4 bottom-0 w-0.5 bg-gray-300 -z-10 h-full"></div>
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-black flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          <span>{`${item.year}-${String(item.month).padStart(2, '0')}`}</span>
                        </span>
                        <span className="text-xs text-gray-500">ID: {item.id}</span>
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

                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border-2 ${
                          item.consumed === 'First' 
                            ? 'bg-blue-100 border-blue-500' 
                            : 'bg-green-100 border-green-500'
                        }`}>
                          <CheckCircle className={`w-4 h-4 ${item.consumed === 'First' ? 'text-blue-600' : 'text-green-600'}`} />
                          <span className={`text-sm font-bold ${item.consumed === 'First' ? 'text-blue-700' : 'text-green-700'}`}>
                            {item.consumed === 'First' ? 'First Reading' : `+${item.consumed} Units`}
                          </span>
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
