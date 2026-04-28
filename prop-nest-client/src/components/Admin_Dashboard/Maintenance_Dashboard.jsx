import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, Search, Building2, AlertCircle, CheckCircle, Clock, Wrench, Filter, ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const Maintenance_Dashboard = () => {
  const { properties, units, maintenanceRequests, setMaintenanceRequests } = useAdminContext() || {};

  const [requests, setRequests] = useState(maintenanceRequests || [
    { id: 2, renter_id: 2, property_id: 2, unit_id: 26, title: "AC not cooling", description: "AC blowing warm air despite low temperature setting", priority: "medium", image_attachment: "", status: "pending" },
    { id: 1, renter_id: 1, property_id: 1, unit_id: 5, title: "Tap broken", description: "Kitchen tap is leaking continuously", priority: "medium", image_attachment: "", status: "pending" }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: { title: '', description: '', priority: 'medium', status: 'pending', image_attachment: '' }
  });

  useEffect(() => {
    if (maintenanceRequests) setRequests(maintenanceRequests);
  }, [maintenanceRequests]);

  const getUnitName = (unitId) => {
    const unit = units?.find(u => u?.id === unitId);
    return unit?.unit_name || `Unit ${unitId || 'N/A'}`;
  };

  const getPropertyName = (propertyId) => {
    const prop = properties?.find(p => p?.id === propertyId);
    return prop?.house_name || `Property ${propertyId || 'N/A'}`;
  };

  const filteredRequests = useMemo(() => {
    return (requests || []).filter(req => {
      const matchesSearch = (
        req?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        req?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        getUnitName(req?.unit_id)?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      const matchesStatus = filterStatus === 'all' || req?.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || req?.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [requests, searchQuery, filterStatus, filterPriority]);

  const groupedRequests = useMemo(() => {
    const groups = {};
    filteredRequests.forEach(req => {
      const propId = req?.property_id;
      if (!groups[propId]) {
        const prop = properties?.find(p => p?.id === propId);
        groups[propId] = { property: prop || { id: propId || 'unknown', house_name: 'Unknown Property' }, requests: [] };
      }
      groups[propId].requests.push({
        ...req,
        unit_name: getUnitName(req?.unit_id),
        property_name: getPropertyName(req?.property_id)
      });
    });
    return Object.values(groups);
  }, [filteredRequests, properties]);

  const { pendingCount, inProgressCount, resolvedCount, urgentCount } = useMemo(() => {
    const allRequests = requests || [];
    return {
      pendingCount: allRequests.filter(r => r?.status === 'pending').length,
      inProgressCount: allRequests.filter(r => r?.status === 'in_progress').length,
      resolvedCount: allRequests.filter(r => r?.status === 'resolved').length,
      urgentCount: allRequests.filter(r => r?.priority === 'urgent' && r?.status !== 'resolved').length
    };
  }, [requests]);

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

  const openViewModal = (req) => {
    setSelectedRequest(req);
    setIsViewModalOpen(true);
  };

  const openEditModal = (req) => {
    setSelectedRequest(req);
    setValue('title', req?.title || '');
    setValue('description', req?.description || '');
    setValue('priority', req?.priority || 'medium');
    setValue('status', req?.status || 'pending');
    setValue('image_attachment', req?.image_attachment || '');
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedRequest(null);
    reset();
  };

  const handleUpdateRequest = (data) => {
    if (!selectedRequest) return;
    const updated = (requests || []).map(req => 
      req?.id === selectedRequest?.id ? { ...req, ...data } : req
    );
    setRequests(updated);
    setMaintenanceRequests?.(updated);
    closeModal();
  };

  const handleStatusChange = (reqId, newStatus) => {
    const updated = (requests || []).map(req => 
      req?.id === reqId ? { ...req, status: newStatus } : req
    );
    setRequests(updated);
    setMaintenanceRequests?.(updated);
  };

  const handleDeleteRequest = (reqId) => {
    if (window.confirm('Are you sure you want to delete this maintenance request?')) {
      const updated = (requests || []).filter(req => req?.id !== reqId);
      setRequests(updated);
      setMaintenanceRequests?.(updated);
      closeModal();
    }
  };

  return (
    <div className="min-h-screen font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-2">Maintenance Requests</h1>
          <p className="text-gray-600 text-lg">Track and manage unit maintenance tasks</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Pending', value: pendingCount, icon: Clock, color: 'bg-yellow-400' },
            { label: 'In Progress', value: inProgressCount, icon: Wrench, color: 'bg-blue-400' },
            { label: 'Resolved', value: resolvedCount, icon: CheckCircle, color: 'bg-green-400' },
            { label: 'Urgent', value: urgentCount, icon: AlertCircle, color: 'bg-red-400' },
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

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <div className="relative max-w-md md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search requests, units..." value={searchQuery} onChange={(e) => setSearchQuery(e?.target?.value)} className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e?.target?.value)} className="appearance-none bg-white border-2 border-black rounded-lg py-2 pl-10 pr-8 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select value={filterPriority} onChange={(e) => setFilterPriority(e?.target?.value)} className="appearance-none bg-white border-2 border-black rounded-lg py-2 pl-10 pr-8 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-8">
          {groupedRequests?.length > 0 ? (
            groupedRequests.map(({ property, requests: propRequests }) => (
              <div key={property?.id} className="mb-6">
                <div className="flex items-center space-x-3 mb-3 px-1">
                  <Building2 className="w-5 h-5 text-black" />
                  <h3 className="text-xl font-bold text-black">{property?.house_name || 'Unknown Property'}</h3>
                  <span className="bg-gray-500 border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-white">{propRequests?.length || 0} Request{(propRequests?.length || 0) !== 1 ? 's' : ''}</span>
                </div>

                <div className="space-y-4">
                  {propRequests.map((req) => (
                    <div key={req?.id} className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-lg font-bold text-black">{req?.title || 'Untitled'}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${priorityColors[req?.priority] || priorityColors.medium}`}>{req?.priority?.charAt(0)?.toUpperCase()}{req?.priority?.slice(1)}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold border ${statusColors[req?.status] || statusColors.pending}`}>{statusLabels[req?.status] || 'Unknown'}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{req?.description || 'No description'}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-medium text-black">Unit: {req?.unit_name || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openViewModal(req)} className="bg-blue-300 border-2 border-black rounded px-3 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1" title="View"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => openEditModal(req)} className="bg-yellow-300 border-2 border-black rounded px-3 py-2 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1" title="Edit"><Pencil className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">No maintenance requests found.</div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">Maintenance Details</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="p-3 bg-white border-2 border-black rounded-lg">
                <h4 className="text-lg font-bold text-black mb-1">{selectedRequest?.title || 'Untitled'}</h4>
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${priorityColors[selectedRequest?.priority] || priorityColors.medium}`}>{selectedRequest?.priority?.charAt(0)?.toUpperCase()}{selectedRequest?.priority?.slice(1)}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${statusColors[selectedRequest?.status] || statusColors.pending}`}>{statusLabels[selectedRequest?.status] || 'Unknown'}</span>
                </div>
                <p className="text-gray-600 text-sm">{selectedRequest?.description || 'No description'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <span className="text-xs text-gray-500 block">Unit</span>
                  <span className="font-bold text-black">{selectedRequest?.unit_name || 'N/A'}</span>
                </div>
                <div className="p-3 bg-white border-2 border-black rounded-lg">
                  <span className="text-xs text-gray-500 block">Property</span>
                  <span className="font-bold text-black">{selectedRequest?.property_name || 'N/A'}</span>
                </div>
              </div>

              {selectedRequest?.status !== 'resolved' && selectedRequest?.status !== 'rejected' && (
                <div className="p-3 bg-yellow-100 border-2 border-yellow-500 rounded-lg">
                  <span className="text-sm font-bold text-black mb-2 block">Quick Status Update</span>
                  <div className="grid grid-cols-2 gap-2">
                    {['pending', 'in_progress', 'resolved', 'rejected'].map(s => (
                      <button key={s} onClick={() => handleStatusChange(selectedRequest?.id, s)} className={`px-2 py-1.5 rounded border-2 border-black text-xs font-bold transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-px active:translate-y-px ${statusColors[s]}`}>
                        {statusLabels[s]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">Edit Maintenance Request</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <form onSubmit={handleSubmit(handleUpdateRequest)} className="flex flex-col h-full overflow-y-auto">
              <div className="p-4 space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">* Title</label>
                  <input type="text" {...register('title', { required: 'Required' })} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  {errors?.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">* Description</label>
                  <textarea rows={3} {...register('description', { required: 'Required' })} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                  {errors?.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Priority</label>
                    <select {...register('priority')} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all cursor-pointer">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">Status</label>
                    <select {...register('status')} className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all cursor-pointer">
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Image Attachment URL</label>
                  <input type="text" {...register('image_attachment')} placeholder="https://..." className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4 pt-0 border-t-2 border-black mt-4 shrink-0 bg-gray-200">
                <button type="button" onClick={() => handleDeleteRequest(selectedRequest?.id)} className="bg-red-400 border-2 mt-2 w-full border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center justify-center space-x-1"><Trash2 className="w-4 h-4" /></button>
                <button type="button" onClick={closeModal} className="bg-white border-2 mt-2 w-full border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button type="submit" className="bg-green-400 border-2 mt-2 w-full border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance_Dashboard;
