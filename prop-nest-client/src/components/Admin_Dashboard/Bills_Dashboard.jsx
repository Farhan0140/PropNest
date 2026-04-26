import React, { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, X, Search, Building2, FileText, Calendar, ArrowRight, Pencil, DollarSign, Receipt, AlertTriangle, Coins } from 'lucide-react';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const Bills_Dashboard = () => {
  const { properties, units, rentInvoice, setRentInvoice, CreateRentInvoice } = useAdminContext();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [bills, setBills] = useState(rentInvoice);

  useEffect(() => {
    setBills(rentInvoice);
  }, [rentInvoice]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateConfirmOpen, setIsGenerateConfirmOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [updateForm, setUpdateForm] = useState({ rent: '', electricity: '', water: '', others: '' });

  const {
    register,
    handleSubmit: handleFormSubmit,
    control,
    watch,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    defaultValues: {
      scope: 'all',
      target_unit_id: '',
      target_property_id: '',
      items: []
    }
  });

  const { fields: items, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const watchedScope = watch("scope");
  const watchedBills = watch("items") || [];

  useEffect(() => {
    if (isAddModalOpen) {
      if (selectedBill) {
        // Contextual Add (Row Button) - Lock to unit
        resetForm({
          scope: 'unit',
          target_unit_id: selectedBill.unit_id,
          target_property_id: '',
          items: []
        });
      } else {
        // General Add (Top Button) - Reset to defaults
        resetForm({
          scope: 'all',
          target_unit_id: '',
          target_property_id: '',
          items: []
        });
      }
    }
  }, [isAddModalOpen, selectedBill, resetForm]);

  const getItemAmount = (itemsList, type) => {
    const item = itemsList.find(i => i.item_type === type);
    return item ? item.amount : 0;
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const prop = properties.find(p => p.id === unit.property_id);
      const query = searchQuery.toLowerCase();
      return (
        unit.unit_name.toLowerCase().includes(query) ||
        (prop?.house_name || '').toLowerCase().includes(query)
      );
    });
  }, [units, properties, searchQuery]);

  const groupedBills = useMemo(() => {
    const groups = {};
    filteredUnits.forEach(unit => {
      const prop = properties.find(p => p.id === unit.property_id);
      const propId = prop?.id || 'unknown';

      if (!groups[propId]) {
        groups[propId] = {
          property: prop || { id: 'unknown', house_name: 'Unknown Property' },
          bills: []
        };
      }

      const unitBills = bills?.filter(b => b.unit_id === unit.id);
      const latestBill = unitBills?.length > 0
        ? unitBills.sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
          })[0]
        : null;

      const rent = latestBill ? getItemAmount(latestBill.items, 'rent') : '-';
      const electricity = latestBill ? getItemAmount(latestBill.items, 'electricity') : '-';
      const water = latestBill ? getItemAmount(latestBill.items, 'water') : '-';
      const others = latestBill ? getItemAmount(latestBill.items, 'others') : '-';
      const total = latestBill ? latestBill.total_amount : '-';

      groups[propId].bills.push({
        id: latestBill ? latestBill.id : `unit_${unit.id}`,
        unit_id: unit.id,
        unit_name: unit.unit_name,
        rent,
        electricity,
        water,
        others,
        total,
        year: latestBill ? latestBill.year : '-',
        month: latestBill ? latestBill.month : '-',
        property_name: prop?.house_name,
        hasBill: !!latestBill,
        isCurrentMonth: latestBill ? (latestBill.year === currentYear && latestBill.month === currentMonth) : false,
        status: latestBill ? latestBill.status : '-',
        items: latestBill ? latestBill.items : []
      });
    });

    return Object.values(groups);
  }, [filteredUnits, properties, bills, currentYear, currentMonth]);

  const handleGenerateAllRents = () => {
    setIsLoading(true);
    setTimeout(() => {
      const existingBillUnitIds = new Set(
        bills.filter(b => b.year === currentYear && b.month === currentMonth).map(b => b.unit_id)
      );

      const newBills = units.filter(u => !existingBillUnitIds.has(u.id)).map(u => ({
        id: Date.now() + u.id,
        renter_id: null,
        unit_id: u.id,
        month: currentMonth,
        year: currentYear,
        status: "unpaid",
        total_amount: 0,
        items: []
      }));

      setBills(prev => [...prev, ...newBills]);
      setIsLoading(false);
      setIsGenerateConfirmOpen(false);
    }, 800);
  };

  const openAddModal = (billItem) => {
    setSelectedBill(billItem);
    setIsAddModalOpen(true);
  };

  const openAddOtherBillsModal = () => {
    setSelectedBill(null); // No specific unit context
    setIsAddModalOpen(true);
  };

  const openUpdateModal = (billItem) => {   // TODO fuck this function
    if (!billItem.hasBill) {
      alert("No existing bill to update. Please add a bill first.");
      return;
    }
    setSelectedBill(billItem);
    setUpdateForm({
      rent: billItem.rent,
      electricity: billItem.electricity,
      water: billItem.water,
      others: billItem.others
    });
    setIsUpdateModalOpen(true);
  };

  const openHistoryModal = (billItem) => {
    setSelectedBill(billItem);
    const unitHistory = bills
      .filter(b => b.unit_id === billItem.unit_id)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      })
      .map(item => ({
        ...item,
        rent: getItemAmount(item.items, 'rent'),
        electricity: getItemAmount(item.items, 'electricity'),
        water: getItemAmount(item.items, 'water'),
        others: getItemAmount(item.items, 'others')
      }));

    setHistoryData(unitHistory);
    setIsHistoryModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsHistoryModalOpen(false);
    setSelectedBill(null);
    setHistoryData([]);
    resetForm({ scope: 'all', target_unit_id: '', target_property_id: '', items: [] });
    setUpdateForm({ rent: '', electricity: '', water: '', others: '' });
  };

  const onAddBillSubmit = async (data) => {
    if (!data.items || data.items.length === 0) return;

    // Determine active scope: from form data if top button, or forced if row button
    const activeScope = selectedBill ? 'unit' : data.scope;
    
    // Construct exact JSON payload based on scope
    const payload = {
      scope: activeScope,
      items: data.items.map(item => {
        const base = { type: item.type };
        if (item.type === 'others') {
          base.note = item.note;
          base.total_amount = Number(item.total_amount);
        } else if (item.type === 'electricity') {
          base.per_unit_price = Number(item.per_unit_price);
        }
        return base;
      })
    };

    if (activeScope === 'unit' && selectedBill) {
      payload.target_unit_id = Number(selectedBill.unit_id);
    } else if (activeScope === 'unit' && data.target_unit_id) {
      payload.target_unit_id = Number(data.target_unit_id);
    } else if (activeScope === 'property' && data.target_property_id) {
      payload.target_property_id = Number(data.target_property_id);
    }

    await CreateRentInvoice(JSON.stringify(payload, null, 2))

    // Determine target unit IDs
    let targetUnitIds = [];
    if (selectedBill) {
      targetUnitIds = [selectedBill.unit_id];
    } else if (data.scope === 'all') {
      targetUnitIds = units.map(u => u.id);
    } else if (data.scope === 'property') {
      targetUnitIds = units.filter(u => u.property_id == data.target_property_id).map(u => u.id);
    } else if (data.scope === 'unit') {
      if (data.target_unit_id) targetUnitIds = [data.target_unit_id];
    } else {
      targetUnitIds = units.map(u => u.id); // Fallback
    }

    // Update bills state
    setBills(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updatedBills = [...safePrev];
      targetUnitIds.forEach(unitId => {
        if (!unitId) return;
        const existingIdx = updatedBills.findIndex(b => b.unit_id == unitId && b.year === currentYear && b.month === currentMonth);
        let billObj = existingIdx >= 0
          ? { ...updatedBills[existingIdx], items: [...updatedBills[existingIdx].items] }
          : { id: `bill_${Date.now()}_${unitId}`, unit_id: unitId, renter_id: null, year: currentYear, month: currentMonth, status: 'unpaid', total_amount: 0, items: [] };

        let rentAmount = billObj.items.find(i => i.item_type === 'rent')?.amount || 0;

        data.items.forEach(item => {
          if (item.type === 'electricity') {
            let elecItem = billObj.items.find(i => i.item_type === 'electricity');
            if (!elecItem) {
              elecItem = { id: Date.now() + Math.random(), item_type: 'electricity', amount: 0, description: 'Electricity Bill' };
              billObj.items.push(elecItem);
            }
            elecItem.amount = Number(item.per_unit_price) || 0;
          } else if (item.type === 'others') {
            const otherItem = { id: Date.now() + Math.random(), item_type: 'others', amount: Number(item.total_amount) || 0, description: item.note || 'Other Charge' };
            billObj.items.push(otherItem);
          }
        });

        billObj.total_amount = rentAmount + billObj.items.reduce((acc, curr) => curr.item_type !== 'rent' ? acc + curr.amount : acc, 0);
        
        if (existingIdx >= 0) updatedBills[existingIdx] = billObj;
        else updatedBills.push(billObj);
      });
      return updatedBills;
    });

    closeModal();
  };

  const handleUpdateBill = () => {
    if (!selectedBill || !selectedBill.hasBill) return;

    const rent = Number(updateForm.rent) || 0;
    const electricity = Number(updateForm.electricity) || 0;
    const water = Number(updateForm.water) || 0;
    const others = Number(updateForm.others) || 0;

    if ([rent, electricity, water, others].some(v => isNaN(v) || v < 0)) {
      alert("Please enter valid non-negative numbers for all fields");
      return;
    }

    const total = rent + electricity + water + others;
    const newItems = [];
    let idCounter = Date.now();
    if (rent > 0) newItems.push({ id: idCounter++, item_type: "rent", amount: rent, description: "Monthly Rent" });
    if (electricity > 0) newItems.push({ id: idCounter++, item_type: "electricity", amount: electricity, description: "Electricity Bill" });
    if (water > 0) newItems.push({ id: idCounter++, item_type: "water", amount: water, description: "Water Bill" });
    if (others > 0) newItems.push({ id: idCounter++, item_type: "others", amount: others, description: "Other Charges" });

    const updatedBills = bills.map(b => {
      if (b.id === selectedBill.id) {
        return { ...b, total_amount: total, items: newItems };
      }
      return b;
    });

    setBills(updatedBills);
    closeModal();
  };

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const getAvailableOptions = (index) => {
    const billTypeOptions = [{ value: "electricity", label: "Electricity" }, { value: "others", label: "Others" }];
    const otherSelectedTypes = watchedBills.filter((_, i) => i !== index).map(b => b?.type).filter(Boolean);
    return billTypeOptions.filter(opt => opt.value === "others" || !otherSelectedTypes.includes(opt.value));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-1">Bills Dashboard</h1>
          <p className="text-gray-600 text-lg">Track and manage unit bills</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <div className="relative max-w-md md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Search units, property, or bills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button onClick={openAddOtherBillsModal} className="w-full bg-blue-400 border-2 border-black rounded-lg px-6 py-3 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Other Bills</span>
            </button>
            <button onClick={() => setIsGenerateConfirmOpen(true)} disabled={isLoading} className="w-full bg-purple-400 border-2 border-black rounded-lg px-6 py-3 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-500 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2">
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div><span>Generating...</span></>
              ) : (
                <><Receipt className="w-5 h-5" /><span>Generate All Rents</span></>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {groupedBills.length > 0 ? (
            groupedBills.map(({ property, bills: propBills }) => (
              <div key={property?.id} className="mb-6">
                <div className="flex items-center space-x-3 mb-3 px-1">
                  <Building2 className="w-5 h-5 text-black" />
                  <h3 className="text-xl font-bold text-black">{property?.house_name || 'Unknown Property'}</h3>
                  <span className="bg-gray-500 border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-white">{propBills.length} Unit{propBills.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-100 border-b-2 border-black">
                          <th className="text-left py-3 px-4 font-bold text-black">Unit</th>
                          <th className="text-right py-3 px-4 font-bold text-black">Rent</th>
                          <th className="text-right py-3 px-4 font-bold text-black">Electric</th>
                          <th className="text-right py-3 px-4 font-bold text-black">Total</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Period</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propBills.map((bill) => (
                          <tr key={bill.id} className={`border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0 ${bill.isCurrentMonth ? 'bg-yellow-50' : ''}`}>
                            <td className="py-3 px-4 font-medium text-black">{bill.unit_name}</td>
                            <td className="py-3 px-4 text-right font-mono text-black">{bill.rent !== '-' ? `$${formatAmount(bill.rent)}` : '-'}</td>
                            <td className="py-3 px-4 text-right font-mono text-black">{bill.electricity !== '-' ? `$${formatAmount(bill.electricity)}` : '-'}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-black">{bill.total !== '-' ? `$${formatAmount(bill.total)}` : '-'}</td>
                            <td className="py-3 px-4">
                              {bill.status !== '-' ? (
                                <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${bill.status === 'unpaid' ? 'bg-red-200 border-red-500 text-red-800' : 'bg-green-200 border-green-500 text-green-800'}`}>{bill.status === 'unpaid' ? 'Unpaid' : 'Paid'}</span>
                              ) : <span className="text-gray-400">-</span>}
                            </td>
                            <td className="py-3 px-4 text-black text-sm">{bill.hasBill ? `${monthNames[bill.month]} ${bill.year}` : '-'}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button onClick={() => openAddModal(bill)} className="bg-green-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1" title="Add / Set Bill"><Plus className="w-3 h-3" /><span className="hidden sm:inline">Add</span></button>
                                <button onClick={() => openHistoryModal(bill)} className="bg-gray-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1" title="View History"><FileText className="w-3 h-3" /><span className="hidden sm:inline">History</span></button>
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
            <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">No units found matching your search.</div>
          )}
        </div>
      </div>

      {/* Generate Confirmation Modal */}
      {isGenerateConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center space-x-2"><AlertTriangle className="w-5 h-5 text-black" /><h3 className="text-xl font-bold text-black">Generate Bills</h3></div>
              <button onClick={() => setIsGenerateConfirmOpen(false)} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-black font-medium">This will create bill entries for <strong>{units.length}</strong> unit(s) for <strong>{monthNames[currentMonth]} {currentYear}</strong>.</p>
              <p className="text-sm text-gray-600">Bills with amounts of $0 will be created. You can edit each bill afterward. Existing bills for this period will not be overwritten.</p>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black">
                <button onClick={() => setIsGenerateConfirmOpen(false)} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button onClick={handleGenerateAllRents} disabled={isLoading} className="bg-purple-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all">{isLoading ? 'Generating...' : 'Confirm & Generate'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bill Modal - Enhanced */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black flex items-center space-x-2"><Coins className="w-5 h-5" /><span>{selectedBill ? 'Add Other Bills' : 'Add Global Other Bills'}</span></h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>

            <form onSubmit={handleFormSubmit(onAddBillSubmit)} className="flex flex-col h-full overflow-y-auto">
              <div className="p-4 space-y-4 flex-1">
                {/* Scope Selection - Only shown if not selecting for a specific row unit */}
                {!selectedBill && (
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">* Apply To</label>
                    <div className="grid md:grid-cols-3 gap-2">
                      {[{ value: 'unit', label: 'Single Unit' }, { value: 'property', label: 'Property' }, { value: 'all', label: 'All Units' }].map(opt => (
                        <button key={opt.value} type="button" onClick={() => resetForm(val => ({ ...val, scope: opt.value, target_unit_id: '', target_property_id: '' }))} className={`p-2 border-2 border-black rounded-lg text-sm text-black font-bold transition-all ${watchedScope === opt.value ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-100'}`}>{opt.label}</button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unit Display - Only shown if selecting for a specific row unit */}
                {selectedBill && (
                  <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600">Apply To</span>
                    <span className="text-lg font-bold text-black">{selectedBill.unit_name}</span>
                  </div>
                )}

                {/* Single Unit Selector - Only shown if scope is 'unit' and no specific unit is selected */}
                {!selectedBill && watchedScope === 'unit' && (
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">* Select Unit</label>
                    <select className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer appearance-none" {...register("target_unit_id", { required: "* Required" })} style={{ color: '#000000' }}>
                      <option value="" disabled className="text-black">Choose Unit</option>
                      {units.map(u => <option key={u.id} value={u.id} className="text-black">{u.unit_name}</option>)}
                    </select>
                    {errors.target_unit_id && <span className="text-red-500 text-sm font-semibold mt-1 block">{errors.target_unit_id.message}</span>}
                  </div>
                )}

                {/* Property Selector - Only shown if scope is 'property' */}
                {!selectedBill && watchedScope === 'property' && (
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">* Select Property</label>
                    <select className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer appearance-none" {...register("target_property_id", { required: "* Required" })} style={{ color: '#000000' }}>
                      <option value="" disabled className="text-black">Choose Property</option>
                      {properties.map(p => <option key={p.id} value={p.id} className="text-black">{p.house_name}</option>)}
                    </select>
                    {errors.target_property_id && <span className="text-red-500 text-sm font-semibold mt-1 block">{errors.target_property_id.message}</span>}
                  </div>
                )}

                <div className="border-t-2 border-black pt-4">
                  <h4 className="font-bold text-black mb-2">Bill Details</h4>
                  {items.length === 0 && <p className="text-sm text-gray-500 italic mb-2">Click "Add Bill Type" to start</p>}
                  
                  {items.map((field, index) => {
                    const currentBillType = watchedBills[index]?.type;
                    const availableOptions = getAvailableOptions(index);
                    return (
                      <div key={field.id} className="mb-3 p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
                        <button type="button" onClick={() => remove(index)} className="absolute top-2 right-2 bg-red-400 border-2 border-black rounded w-6 h-6 flex items-center justify-center text-black font-bold hover:bg-red-500 transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"><X className="w-3 h-3" /></button>
                        <div className="grid grid-cols-1 gap-3 mt-3">
                          <div>
                            <label className="block text-xs font-bold text-black mb-1">* Bill Type</label>
                            <select className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all cursor-pointer appearance-none text-sm" {...register(`items.${index}.type`, { required: "Required" })} style={{ color: '#000000' }}>
                              <option value="" disabled>Select Type</option>
                              {availableOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            {errors.items?.[index]?.type && <span className="text-red-500 text-xs mt-1 block">{errors.items[index]?.type?.message}</span>}
                          </div>
                          {currentBillType === "electricity" && (
                            <div>
                              <label className="block text-xs font-bold text-black mb-1">* Per Unit Price</label>
                              <input type="number" placeholder="e.g. 12.23" className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm" {...register(`items.${index}.per_unit_price`, { required: "* Required" })} />
                              {errors.items?.[index]?.per_unit_price && <span className="text-red-500 text-xs mt-1 block">{errors.items[index]?.per_unit_price?.message}</span>}
                            </div>
                          )}
                          {currentBillType === "others" && (
                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-black mb-1">* Note</label>
                                <input type="text" placeholder="e.g. Internet" className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm" {...register(`items.${index}.note`, { required: "* Required" })} />
                                {errors.items?.[index]?.note && <span className="text-red-500 text-xs mt-1 block">{errors.items[index]?.note?.message}</span>}
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-black mb-1">* Amount</label>
                                <input type="number" placeholder="0.00" className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm" {...register(`items.${index}.total_amount`, { required: "* Required" })} />
                                {errors.items?.[index]?.total_amount && <span className="text-red-500 text-xs mt-1 block">{errors.items[index]?.total_amount?.message}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button type="button" onClick={() => append({ type: "", per_unit_price: "", note: "", total_amount: "" })} className="w-full bg-yellow-300 border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2"><Plus className="w-4 h-4" /><span>Add Bill Type</span></button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 space-x-3 gap-3 p-4 pt-0 border-t-2 border-black mt-4 shrink-0 bg-gray-200">
                <button type="button" onClick={closeModal} className="bg-white border-2 mt-2 w-full border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button type="submit" className="bg-green-400 border-2 mt-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all">Apply Bills</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Bill Modal */}
      {isUpdateModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">Update Bill</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center"><span className="text-sm font-bold text-gray-600">Unit</span><span className="text-lg font-bold text-black">{selectedBill.unit_name}</span></div>
              <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center"><span className="text-sm font-bold text-gray-600">Period</span><span className="text-lg font-bold text-black">{`${monthNames[selectedBill.month]} ${selectedBill.year}`}</span></div>
              <div className="space-y-3">
                {[
                  { label: 'Rent Amount', key: 'rent' },
                  { label: 'Electricity Amount', key: 'electricity' },
                  { label: 'Water Amount', key: 'water' },
                  { label: 'Others Amount', key: 'others' }
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm font-bold text-black mb-1">{label}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="number" step="any" value={updateForm[key]} onChange={(e) => setUpdateForm(prev => ({ ...prev, [key]: e.target.value }))} placeholder="0.00" className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-yellow-100 border-2 border-black rounded-lg flex justify-between items-center"><span className="text-sm font-bold text-black">Calculated Total</span><span className="text-lg font-bold text-black">${(Object.values(updateForm).reduce((acc, val) => acc + (Number(val) || 0), 0)).toFixed(2)}</span></div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
                <button type="button" onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button type="button" onClick={handleUpdateBill} className="bg-yellow-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all">Save Update</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">Bill History</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="p-3 bg-white border-2 border-black rounded-lg"><p className="text-sm text-gray-500">Unit: <span className="font-bold text-black">{selectedBill.unit_name}</span></p><p className="text-sm text-gray-500">Property: <span className="font-bold text-black">{selectedBill.property_name}</span></p></div>
              {historyData.length > 0 ? (
                <div className="space-y-3">
                  {historyData.map((item, index) => (
                    <div key={item.id} className="bg-white border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-black flex items-center space-x-2"><Calendar className="w-4 h-4 text-gray-600" /><span>{`${monthNames[item.month]} ${item.year}`}</span></span>
                        <span className="text-lg font-bold text-black">${formatAmount(item.total_amount)}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-2 bg-gray-50 border border-gray-300 rounded"><span className="text-xs text-gray-500 block">Rent</span><span className="font-bold text-sm text-black">${formatAmount(item.rent)}</span></div>
                        <div className="p-2 bg-gray-50 border border-gray-300 rounded"><span className="text-xs text-gray-500 block">Electric</span><span className="font-bold text-sm text-black">${formatAmount(item.electricity)}</span></div>
                      </div>
                      {index < historyData.length - 1 && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                          <ArrowRight className="w-3 h-3 rotate-90" />
                          <span>{(() => { const prev = historyData[index + 1]; const diff = item.total_amount - prev.total_amount; return diff > 0 ? `+$${formatAmount(diff)} from prev` : diff < 0 ? `-$${formatAmount(Math.abs(diff))} from prev` : 'Same as prev'; })()}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No bill history available for this unit.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills_Dashboard;
