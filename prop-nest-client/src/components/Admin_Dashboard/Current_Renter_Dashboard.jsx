import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, X, Search, FileText } from 'lucide-react';
import AddRenterForm from '../modals/AddRenterForm';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const Current_Renter_Dashboard = () => {
  
  const {renters, setRenters, units, DeleteRenter, isDeleting} = useAdminContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRenter, setSelectedRenter] = useState(null);

  const openAddModal = () => {
    setSelectedRenter(null);
    setEditMode(false);
    setViewMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (renter) => {
    setSelectedRenter(renter);
    setEditMode(true);
    setViewMode(false);
    setIsModalOpen(true);
  };

  const openViewModal = (renter) => {
    setSelectedRenter(renter);
    setEditMode(false);
    setViewMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setViewMode(false);
  };


  const filteredRenters = renters.filter(renter => {
    const query = searchQuery?.toLowerCase() || "";

    if (renter.status !== "active") return false;
    
    return (
      renter?.full_name?.toLowerCase().includes(query) ||
      renter?.phone_number?.toLowerCase().includes(query) ||
      renter?.nid_number?.toLowerCase().includes(query) ||
      (renter?.unit_name && renter.unit_name.toLowerCase().includes(query))
    );
  });

  const handleDelete = async(id) => {
    if(!window.confirm("Are you sure, you want delete this Renter?")) return;
    
    try {
      const res = await DeleteRenter(id);
      if(res.success) {
        window.alert(res.message);
        setRenters(renters.filter(r => r.id !== id));
      } else {
        window.alert(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const statusStyle = {
    active: 'bg-green-300',
    left: 'bg-red-300',
  };

  return (
    <div className="font-sans md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-2">Active Renters</h1>
          <p className="text-gray-600 text-lg">Manage all active renters and their information</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <div className="relative max-w-md md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search renters, phone, NID, or unit..."
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
            <span>Add Renter</span>
          </button>
        </div>

        {filteredRenters.length > 0 ? (
          <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-black">
                    <th className="text-left py-3 px-4 font-bold text-black">Name</th>
                    <th className="text-left py-3 px-4 font-bold text-black">Phone</th>
                    <th className="text-left py-3 px-4 font-bold text-black">NID</th>
                    <th className="text-left py-3 px-4 font-bold text-black">Unit</th>
                    <th className="text-left py-3 px-4 font-bold text-black">Rent</th>
                    <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                    <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRenters.map((renter) => (
                    <tr key={renter.id} className="border-b border-gray-300 hover:bg-gray-100 transition-colors last:border-b-0">
                      <td className="py-3 px-4 font-medium text-black">{renter.full_name}</td>
                      <td className="py-3 px-4 text-black">{renter.phone_number || '-'}</td>
                      <td className="py-3 px-4 text-black">{renter.nid_number || '-'}</td>
                      <td className="py-3 px-4 text-black">{units.find((unit) => unit.id === renter.unit_id)?.unit_name  || '-'}</td>
                      <td className="py-3 px-4 font-bold text-black">৳{units.find((unit) => unit.id === renter.unit_id)?.rent_amount || 0}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border-2 border-black ${
                          statusStyle[renter.status] || 'bg-gray-400'
                        } text-black`}>
                          {renter.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openViewModal(renter)}
                            className="bg-white border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => openEditModal(renter)}
                            className="bg-blue-400 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(renter.id)}
                            disabled={isDeleting}
                            className={`bg-red-400 ${isDeleting ? "bg-white" : ""} border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all`}
                          >
                            {isDeleting ? <span className="loading loading-spinner loading-xs"></span> : <Trash2 className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
            No renters found
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">
                {viewMode ? 'Renter Details' : editMode ? 'Edit Renter' : 'Add Renter'}
              </h3>
              <button
                onClick={closeModal}
                className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              {viewMode && selectedRenter ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center space-x-2 p-2 bg-white border-2 border-black rounded-lg">
                      <span className="font-bold text-black w-16">Name:</span>
                      <span className="text-black">{selectedRenter.full_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-white border-2 border-black rounded-lg">
                      <span className="font-bold text-black w-16">Phone:</span>
                      <span className="text-black">{selectedRenter.phone_number || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-white border-2 border-black rounded-lg">
                      <span className="font-bold text-black w-16">NID:</span>
                      <span className="text-black">{selectedRenter.nid_number || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-white border-2 border-black rounded-lg">
                      <span className="font-bold text-black w-16">Unit:</span>
                      <span className="text-black">{units.find((unit) => unit.id === selectedRenter.unit_id)?.unit_name || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-white border-2 border-black rounded-lg">
                      <span className="font-bold text-black w-16">Rent:</span>




                      <span className="text-black font-bold">৳{units.find((unit) => unit.id === selectedRenter.unit_id)?.rent_amount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-white border-2 border-black rounded-lg">
                      <span className="font-bold text-black w-16">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-xs text-black font-bold border-2 border-black ${statusStyle[selectedRenter.status] || 'bg-gray-300'}`}>
                        {selectedRenter.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-black mb-2">Documents <span className='text-red-500'>Coming Soon..</span></p>
                    {selectedRenter.documents && selectedRenter.documents.length > 0 && (
                      <div className="pt-2">
                        <p className="text-sm font-bold text-black mb-2">Documents:</p>
                        <div className="space-y-2">
                          {selectedRenter.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-white border-2 border-black rounded-lg">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-black" />
                                <span className="text-sm text-black">{doc}</span>
                              </div>
                              <button className="text-xs font-bold text-black bg-gray-200 px-2 py-1 rounded border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">Download</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end pt-4 border-t-2 border-black mt-4">
                    <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Close</button>
                  </div>
                </div>
              ) : (
                <AddRenterForm
                  onCloseButtonClick={closeModal}
                  isEdit={editMode}
                  defaultValues={
                    selectedRenter ? {
                      id: selectedRenter.id,
                      full_name: selectedRenter.full_name,
                      phone_number: selectedRenter.phone_number,
                      nid_number: selectedRenter.nid_number,
                      unit_id: selectedRenter.unit_id,
                      rent_amount: selectedRenter.rent_amount,
                      status: selectedRenter.status,
                      date_of_birth: selectedRenter.date_of_birth
                        ? selectedRenter.date_of_birth.split("T")[0]
                        : "",
                      // documents: selectedRenter.documents || []
                    } : {}
                  } 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Current_Renter_Dashboard;
