import { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Search, Building2 } from 'lucide-react';
import useAdminContext from '../../hooks/Admin/useAdminContext';
import AddUnitForm from '../modals/AddUnitForm';

const Unit_Dashboard = () => {
  const { properties, units, setUnits } = useAdminContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);

  const openAddModal = () => {
    setSelectedUnit(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (unit) => {
    setSelectedUnit(unit);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      setUnits(units.filter(u => u.id !== id));
    }
  };


  const filteredUnits = units.filter(unit => {
    const prop = properties.find(p => p.id === unit?.property_id);
    const query = searchQuery?.toLowerCase() || "";
    return (
      unit?.unit_name?.toLowerCase().includes(query) ||
      (prop && prop?.house_name.toLowerCase().includes(query)) ||
      (unit?.renter_name && unit.renter_name?.toLowerCase().includes(query)) ||
      unit?.status.toLowerCase().includes(query)
    );
  });

  const groupedUnits = useMemo(() => {
    const groups = {};
    filteredUnits.forEach(unit => {
      const propId = unit.property_id;
      if (!groups[propId]) {
        const prop = properties.find(p => p.id === propId);
        groups[propId] = { property: prop, units: [] };
      }
      groups[propId].units.push(unit);
    });
    return Object.values(groups);
  }, [filteredUnits, properties]);

  const statusStyles = {
    occupied: 'bg-green-300',
    available: 'bg-blue-300',
    maintenance: 'bg-red-300',
    reserved: 'bg-yellow-300',
  };

  return (
    <div className="font-sans md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <div className="relative max-w-md md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search units, property, or renter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Unit</span>
          </button>
        </div>

        {/* Grouped Tables by Property */}
        <div className="space-y-8">
          {groupedUnits.length > 0 ? (
            groupedUnits.map(({ property, units: propUnits }) => (
              <div key={property?.id} className="mb-6">
                <div className="flex items-center space-x-3 mb-3 px-1">
                  <Building2 className="w-5 h-5 text-black" />
                  <h3 className="text-xl font-bold text-black">{property?.house_name || 'Unknown Property'}</h3>
                  <span className="bg-gray-500 border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    {propUnits.length} Unit{propUnits.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-black">
                          <th className="text-left py-3 px-4 font-bold text-black">Unit Name</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Rent</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Renter</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propUnits.map((unit) => (
                          <tr key={unit.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors last:border-b-0">
                            <td className="py-3 px-4 font-medium text-black">{unit.unit_name}</td>
                            <td className="py-3 px-4 font-bold text-black">৳{unit.rent_amount}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${
                                statusStyles[unit.status] || 'bg-gray-400'
                              } text-black`}>
                                {unit.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-black">{unit.renter_name || '-'}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => openEditModal(unit)}
                                  className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDelete(unit.id)}
                                  className="bg-red-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
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
            ))
          ) : (
            <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
              No units found
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">{editMode ? 'Edit Unit' : 'Add Unit'}</h3>
              <button
                onClick={closeModal}
                className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <AddUnitForm 
                onCloseButtonClick={closeModal}
                isEdit={editMode}
                defaultValues={
                  selectedUnit ? {
                    id: selectedUnit.id,
                    property_id: selectedUnit.property_id,
                    unit_name: selectedUnit.unit_name,
                    rent_amount: selectedUnit.rent_amount,
                    status: selectedUnit.status,
                  } : {}
                } 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Unit_Dashboard;
