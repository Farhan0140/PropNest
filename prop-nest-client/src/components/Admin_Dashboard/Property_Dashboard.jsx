import { useState } from 'react';
import { Plus, Edit, Trash2, X, Search } from 'lucide-react';
import AddPropertyForm from '../modals/AddPropertyForm';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const Property_Dashboard = () => {
  const { properties, setProperties, units } = useAdminContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  const openAddModal = () => {
    setSelectedProperty(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (prop) => {
    setSelectedProperty(prop);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
  };

  const handleDelete = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const filteredProperties = properties.filter(prop =>
    prop.house_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-sans md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            {/* Search */}
            <div className="relative max-w-md md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
              />
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>

        

        {/* Table */}
        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  <th className="text-left py-3 px-4 font-bold text-black">Property Name</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Address</th>
                  <th className="text-left py-3 px-4 font-bold text-black">City</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Floors</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Total Units</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Occupied</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Available</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Base Rent</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((prop) => (
                    <tr key={prop.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors">
                      <td className="py-3 px-4 font-medium text-black">{prop.house_name}</td>
                      <td className="py-3 px-4 text-black">{prop.address}</td>
                      <td className="py-3 px-4 text-black">{prop.city}</td>
                      <td className="py-3 px-4 text-black">{prop.number_of_floors}</td>
                      <td className="py-3 px-4 text-black">{units.filter(u => u.property_id === prop.id).length}</td>
                      <td className="py-3 px-4 text-black">{units.filter(u => u.property_id === prop.id && u.status === 'occupied').length}</td>
                      <td className="py-3 px-4 text-black">{units.filter(u => u.property_id === prop.id && u.status === 'available').length}</td>
                      <td className="py-3 px-4 font-bold text-black">৳{prop.base_rent.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(prop)}
                            className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(prop.id)}
                            className="bg-red-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-12 text-center text-gray-500 text-lg">No properties found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">{editMode ? 'Edit Property' : 'Add Property'}</h3>
              <button
                onClick={closeModal}
                className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <AddPropertyForm 
                onCloseButtonClick={closeModal} 
                isEdit={editMode} 
                defaultValues={
                  selectedProperty ? {
                    id: selectedProperty.id,
                    house_name: selectedProperty.house_name,
                    address: selectedProperty.address,
                    city: selectedProperty.city,
                    postal_code: selectedProperty.postal_code,
                    number_of_floors: selectedProperty.number_of_floors,
                    total_units: selectedProperty.total_units,
                    base_rent: selectedProperty.base_rent,
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

export default Property_Dashboard;
