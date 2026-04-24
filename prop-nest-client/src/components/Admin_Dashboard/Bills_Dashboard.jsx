import React, { useState, useMemo, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, X, Search, Building2, FileText, Calendar, ArrowRight, CheckCircle, Pencil, DollarSign, Receipt, AlertTriangle, Trash2 } from 'lucide-react';

const AddBillModal = ({ isOpen, onClose, onSubmit, properties, units }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
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
    if (isOpen) {
      reset({
        scope: 'all',
        target_unit_id: '',
        target_property_id: '',
        items: []
      });
    }
  }, [isOpen, reset]);

  const billTypeOptions = [
    { value: "electricity", label: "Electricity" },
    { value: "gas", label: "Gas" },
    { value: "water", label: "Water" },
    { value: "others", label: "Others" },
  ];

  const getAvailableOptions = (index) => {
    const otherSelectedTypes = watchedBills
      .filter((_, i) => i !== index)
      .map(b => b?.type)
      .filter(Boolean);

    return billTypeOptions.filter(opt => {
      if (opt.value === "others") return true;
      return !otherSelectedTypes.includes(opt.value);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
          <h3 className="text-xl font-bold text-black flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Extra Bills</span>
          </h3>
          <button onClick={onClose} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Scope Selection */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">* Apply To</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'single', label: 'Single Unit' },
                { value: 'property', label: 'Property' },
                { value: 'all', label: 'All Units' }
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => reset(val => ({ ...val, scope: opt.value, target_unit_id: '', target_property_id: '' }))}
                  className={`p-2 border-2 border-black rounded-lg text-sm font-bold transition-all ${
                    watchedScope === opt.value 
                      ? 'bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Dropdowns */}
          {watchedScope === 'single' && (
            <div>
              <label className="block text-sm font-bold text-black mb-1">* Select Unit</label>
              <select
                className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer appearance-none"
                {...register("target_unit_id", { required: "* Required" })}
                style={{ color: '#000000' }}
              >
                <option value="" disabled className="text-black">Choose Unit</option>
                {units.map(u => (
                  <option key={u.id} value={u.id} className="text-black">{u.unit_name}</option>
                ))}
              </select>
              {errors.target_unit_id && <span className="text-red-500 text-sm font-semibold mt-1 block">{errors.target_unit_id.message}</span>}
            </div>
          )}

          {watchedScope === 'property' && (
            <div>
              <label className="block text-sm font-bold text-black mb-1">* Select Property</label>
              <select
                className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer appearance-none"
                {...register("target_property_id", { required: "* Required" })}
                style={{ color: '#000000' }}
              >
                <option value="" disabled className="text-black">Choose Property</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id} className="text-black">{p.house_name}</option>
                ))}
              </select>
              {errors.target_property_id && <span className="text-red-500 text-sm font-semibold mt-1 block">{errors.target_property_id.message}</span>}
            </div>
          )}

          {/* Bill Items */}
          <div className="border-t-2 border-black pt-4">
            <h4 className="font-bold text-black mb-2">Bill Details</h4>
            {items.length === 0 && (
              <p className="text-sm text-gray-500 italic mb-2">Click "Add Bill Type" to start</p>
            )}
            
            {items.map((field, index) => {
              const currentBillType = watchedBills[index]?.type;
              const availableOptions = getAvailableOptions(index);

              return (
                <div key={field.id} className="mb-3 p-3 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-2 right-2 bg-red-400 border-2 border-black rounded w-6 h-6 flex items-center justify-center text-black font-bold hover:bg-red-500 transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-black mb-1">* Bill Type</label>
                      <select
                        className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all cursor-pointer appearance-none text-sm"
                        {...register(`items.${index}.type`, { required: "Required" })}
                        style={{ color: '#000000' }}
                      >
                        <option value="" disabled>Select Type</option>
                        {availableOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.items?.[index]?.type && <span className="text-red-500 text-xs mt-1 block">{errors.items[index].type.message}</span>}
                    </div>

                    {currentBillType === "electricity" && (
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">* Current Reading</label>
                        <input type="number" placeholder="Reading value" className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm" {...register(`items.${index}.current_reading`, { required: "* Required" })} />
                        {errors.items?.[index]?.current_reading && <span className="text-red-500 text-xs mt-1 block">{errors.items[index].current_reading.message}</span>}
                      </div>
                    )}

                    {(currentBillType === "gas" || currentBillType === "water") && (
                      <div>
                        <label className="block text-xs font-bold text-black mb-1">* Amount</label>
                        <input type="number" placeholder="Bill amount" className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm" {...register(`items.${index}.bill_amount`, { required: "* Required" })} />
                        {errors.items?.[index]?.bill_amount && <span className="text-red-500 text-xs mt-1 block">{errors.items[index].bill_amount.message}</span>}
                      </div>
                    )}

                    {currentBillType === "others" && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-black mb-1">* Note</label>
                          <input type="text" placeholder="e.g. Internet" className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm" {...register(`items.${index}.note`, { required: "* Required" })} />
                          {errors.items?.[index]?.note && <span className="text-red-500 text-xs mt-1 block">{errors.items[index].note.message}</span>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-black mb-1">* Amount</label>
                          <input type="number" placeholder="0.00" className="w-full bg-white border-2 border-black rounded-lg py-1.5 px-3 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all text-sm" {...register(`items.${index}.total_amount`, { required: "* Required" })} />
                          {errors.items?.[index]?.total_amount && <span className="text-red-500 text-xs mt-1 block">{errors.items[index].total_amount.message}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => append({ type: "", current_reading: "", bill_amount: "", note: "", total_amount: "" })}
              className="w-full bg-yellow-300 border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bill Type</span>
            </button>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-4">
            <button type="button" onClick={onClose} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
            <button type="button" onClick={handleSubmit(onSubmit)} className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all">
              Apply Bills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Bills_Dashboard = () => {
  const [properties, setProperties] = useState([
    { id: 'prop_1', house_name: 'Sunrise Apartments' },
    { id: 'prop_2', house_name: 'Oakwood Villa' },
  ]);

  const [units, setUnits] = useState([
    { id: 'unit_1', unit_name: 'A101', property_id: 'prop_1' },
    { id: 'unit_2', unit_name: 'A102', property_id: 'prop_1' },
    { id: 'unit_3', unit_name: 'A201', property_id: 'prop_1' },
    { id: 'unit_4', unit_name: 'B101', property_id: 'prop_2' },
    { id: 'unit_5', unit_name: 'B102', property_id: 'prop_2' },
  ]);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const [bills, setBills] = useState([
    { id: 'bill_1', unit_id: 'unit_1', rent: 1200, electricity: 85, water: 30, others: 20, year: 2026, month: 3 },
    { id: 'bill_2', unit_id: 'unit_2', rent: 1200, electricity: 120, water: 35, others: 0, year: 2026, month: 3 },
    { id: 'bill_3', unit_id: 'unit_4', rent: 1500, electricity: 95, water: 40, others: 50, year: 2026, month: 3 },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerateConfirmOpen, setIsGenerateConfirmOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isAddBillModalOpen, setIsAddBillModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [addForm, setAddForm] = useState({ rent: '', electricity: '', water: '', others: '' });
  const [updateForm, setUpdateForm] = useState({ rent: '', electricity: '', water: '', others: '' });

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const prop = properties.find(p => p.id === unit.property_id);
      const query = searchQuery.toLowerCase();
      return unit.unit_name.toLowerCase().includes(query) || (prop?.house_name || '').toLowerCase().includes(query);
    });
  }, [units, properties, searchQuery]);

  const groupedBills = useMemo(() => {
    const groups = {};
    filteredUnits.forEach(unit => {
      const prop = properties.find(p => p.id === unit.property_id);
      const propId = prop?.id || 'unknown';
      if (!groups[propId]) groups[propId] = { property: prop || { id: 'unknown', house_name: 'Unknown' }, bills: [] };

      const unitBills = bills.filter(b => b.unit_id === unit.id);
      const latestBill = unitBills.sort((a, b) => a.year !== b.year ? b.year - a.year : b.month - a.month)[0] || null;
      const total = latestBill ? latestBill.rent + latestBill.electricity + latestBill.water + latestBill.others : 0;

      groups[propId].bills.push({
        id: latestBill ? latestBill.id : `unit_${unit.id}`,
        unit_id: unit.id,
        unit_name: unit.unit_name,
        rent: latestBill ? latestBill.rent : '-',
        electricity: latestBill ? latestBill.electricity : '-',
        water: latestBill ? latestBill.water : '-',
        others: latestBill ? latestBill.others : '-',
        total: latestBill ? total : '-',
        year: latestBill ? latestBill.year : '-',
        month: latestBill ? latestBill.month : '-',
        property_name: prop?.house_name,
        hasBill: !!latestBill,
        isCurrentMonth: latestBill ? (latestBill.year === currentYear && latestBill.month === currentMonth) : false
      });
    });
    return Object.values(groups);
  }, [filteredUnits, properties, bills, currentYear, currentMonth]);

  const handleGenerateAllRents = () => {
    setIsLoading(true);
    setTimeout(() => {
      const existing = new Set(bills.filter(b => b.year === currentYear && b.month === currentMonth).map(b => b.unit_id));
      const newBills = units.filter(u => !existing.has(u.id)).map(u => ({
        id: `bill_gen_${Date.now()}_${u.id}`, unit_id: u.id, rent: 0, electricity: 0, water: 0, others: 0, year: currentYear, month: currentMonth
      }));
      setBills(prev => [...prev, ...newBills]);
      setIsLoading(false);
      setIsGenerateConfirmOpen(false);
    }, 800);
  };

  const handleAddExtraBills = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      const targetUnitIds = [];
      if (data.scope === 'all') {
        targetUnitIds.push(...units.map(u => u.id));
      } else if (data.scope === 'property') {
        targetUnitIds.push(...units.filter(u => u.property_id === data.target_property_id).map(u => u.id));
      } else {
        targetUnitIds.push(data.target_unit_id);
      }

      setBills(prev => {
        const newBills = prev.map(b => {
          if (targetUnitIds.includes(b.unit_id) && b.year === currentYear && b.month === currentMonth) {
            let updated = { ...b };
            data.items.forEach(item => {
              if (item.type === 'electricity') updated.electricity = Number(item.current_reading) || 0;
              else if (item.type === 'water') updated.water = Number(item.bill_amount) || 0;
              else if (item.type === 'gas') updated.others = (updated.others || 0) + (Number(item.bill_amount) || 0);
              else if (item.type === 'others') updated.others = (updated.others || 0) + (Number(item.total_amount) || 0);
            });
            return updated;
          }
          return b;
        });
        return newBills;
      });

      setIsLoading(false);
      setIsAddBillModalOpen(false);
      alert("Extra bills applied successfully!");
    }, 500);
  };

  const openAddModal = (billItem) => { setSelectedBill(billItem); setAddForm({ rent: billItem.rent !== '-' ? billItem.rent : '', electricity: '', water: '', others: '' }); setIsAddModalOpen(true); };
  const openUpdateModal = (billItem) => {
    if (!billItem.hasBill) return alert("No existing bill to update.");
    setSelectedBill(billItem);
    setUpdateForm({ rent: billItem.rent, electricity: billItem.electricity, water: billItem.water, others: billItem.others });
    setIsUpdateModalOpen(true);
  };
  const openHistoryModal = (billItem) => {
    setSelectedBill(billItem);
    setHistoryData(bills.filter(b => b.unit_id === billItem.unit_id).sort((a, b) => a.year !== b.year ? b.year - a.year : b.month - a.month).map(i => ({ ...i, total: i.rent + i.electricity + i.water + i.others })));
    setIsHistoryModalOpen(true);
  };
  const closeModal = () => { setIsAddModalOpen(false); setIsUpdateModalOpen(false); setIsHistoryModalOpen(false); setIsAddBillModalOpen(false); setSelectedBill(null); };

  const handleSaveBill = (formType) => {
    const form = formType === 'add' ? addForm : updateForm;
    const rent = Number(form.rent) || 0;
    const electricity = Number(form.electricity) || 0;
    const water = Number(form.water) || 0;
    const others = Number(form.others) || 0;

    if ([rent, electricity, water, others].some(v => isNaN(v) || v < 0)) return alert("Invalid values");

    const year = selectedBill.year !== '-' ? selectedBill.year : currentYear;
    const month = selectedBill.month !== '-' ? selectedBill.month : currentMonth;

    const idx = bills.findIndex(b => b.unit_id === selectedBill.unit_id && b.year === year && b.month === month);
    const updatedBill = { unit_id: selectedBill.unit_id, rent, electricity, water, others, year, month };
    
    if (idx >= 0 && formType === 'update') {
      const next = [...bills]; next[idx] = { ...next[idx], rent, electricity, water, others }; setBills(next);
    } else {
      setBills(prev => [...prev, { id: `bill_${Date.now()}`, ...updatedBill }]);
    }
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-1">Bills Dashboard</h1>
          <p className="text-gray-600 text-lg">Track and manage unit bills</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full relative max-w-md md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search units, property..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all" />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button onClick={() => setIsGenerateConfirmOpen(true)} disabled={isLoading} className="w-full sm:w-auto bg-purple-400 border-2 border-black rounded-lg px-6 py-3 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2">
              {isLoading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Receipt className="w-5 h-5" />}
              <span>Generate All Rents</span>
            </button>
            <button onClick={() => setIsAddBillModalOpen(true)} className="w-full sm:w-auto bg-blue-400 border-2 border-black rounded-lg px-6 py-3 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Bills</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {groupedBills.length > 0 ? groupedBills.map(({ property, bills: propBills }) => (
            <div key={property?.id} className="mb-6">
              <div className="flex items-center space-x-3 mb-3 px-1">
                <Building2 className="w-5 h-5 text-black" />
                <h3 className="text-xl font-bold text-black">{property?.house_name || 'Unknown'}</h3>
                <span className="bg-gray-500 border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-white">{propBills.length} Unit(s)</span>
              </div>
              <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-black">
                        {['Unit', 'Rent', 'Electric', 'Water', 'Others', 'Total', 'Period', 'Actions'].map(h => <th key={h} className={`py-3 px-4 font-bold text-black ${h !== 'Unit' && h !== 'Period' && h !== 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {propBills.map(bill => (
                        <tr key={bill.id} className={`border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0 ${bill.isCurrentMonth ? 'bg-yellow-50' : ''}`}>
                          <td className="py-3 px-4 font-medium text-black">{bill.unit_name}</td>
                          {['rent', 'electricity', 'water', 'others', 'total'].map(k => (
                            <td key={k} className={`py-3 px-4 font-mono ${k === 'total' ? 'font-bold' : ''} text-black ${k !== 'total' ? 'text-right' : 'text-right'}`}>{bill[k] !== '-' ? `$${bill[k]}` : '-'}</td>
                          ))}
                          <td className="py-3 px-4 text-black text-sm">{bill.hasBill ? `${monthNames[bill.month]} ${bill.year}` : '-'}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => openAddModal(bill)} className="bg-green-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"><Plus className="w-3 h-3" /></button>
                              <button onClick={() => openUpdateModal(bill)} className="bg-yellow-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"><Pencil className="w-3 h-3" /></button>
                              <button onClick={() => openHistoryModal(bill)} className="bg-gray-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"><FileText className="w-3 h-3" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )) : <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">No units found.</div>}
        </div>
      </div>

      {/* Generate Confirmation Modal */}
      {isGenerateConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
            <div className="border-b-2 border-black p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">Generate Bills</h3>
              <button onClick={() => setIsGenerateConfirmOpen(false)} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-black">Create bill entries for <strong>{units.length}</strong> units for <strong>{monthNames[currentMonth]} {currentYear}</strong>.</p>
              <div className="flex justify-end space-x-3 pt-2 border-t-2 border-black">
                <button onClick={() => setIsGenerateConfirmOpen(false)} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button onClick={handleGenerateAllRents} disabled={isLoading} className="bg-purple-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all">Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AddBillModal isOpen={isAddBillModalOpen} onClose={() => setIsAddBillModalOpen(false)} onSubmit={handleAddExtraBills} properties={properties} units={units} />

      {/* Add/Update Modal */}
      {(isAddModalOpen || isUpdateModalOpen) && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="border-b-2 border-black p-4 flex justify-between items-center rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">{isUpdateModalOpen ? 'Update Bill' : 'Add / Set Bill'}</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between"><span className="font-bold text-gray-600">Unit</span><span className="font-bold text-black">{selectedBill.unit_name}</span></div>
              {['Rent', 'Electricity', 'Water', 'Others'].map(label => {
                const key = label.toLowerCase();
                const Form = isUpdateModalOpen ? updateForm : addForm;
                const setForm = isUpdateModalOpen ? setUpdateForm : setAddForm;
                return (
                  <div key={label}>
                    <label className="block text-sm font-bold text-black mb-1">{label} Amount</label>
                    <div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input type="number" value={Form[key]} onChange={e => setForm(p => ({...p, [key]: e.target.value}))} placeholder="0.00" className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all" />
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-end space-x-3 pt-4 border-t-2 border-black mt-4">
                <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button onClick={() => handleSaveBill(isUpdateModalOpen ? 'update' : 'add')} className={`border-2 rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all ${isUpdateModalOpen ? 'bg-yellow-400' : 'bg-green-400'}`}>{isUpdateModalOpen ? 'Save Update' : 'Save Bill'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="border-b-2 border-black p-4 flex justify-between items-center rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black">Bill History</h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="p-3 bg-white border-2 border-black rounded-lg">
                <p className="text-sm text-gray-500">Unit: <span className="font-bold text-black">{selectedBill.unit_name}</span></p>
              </div>
              {historyData.length > 0 ? historyData.map((item, i) => (
                <div key={item.id} className="bg-white border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex justify-between mb-2 font-bold">
                    <span><Calendar className="w-4 h-4 inline mr-1" />{monthNames[item.month]} {item.year}</span>
                    <span>${item.total.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1 bg-gray-50 border rounded"><span className="text-xs text-gray-500">Rent</span><p className="font-bold text-sm">${item.rent}</p></div>
                    <div className="p-1 bg-gray-50 border rounded"><span className="text-xs text-gray-500">Elec</span><p className="font-bold text-sm">${item.electricity}</p></div>
                    <div className="p-1 bg-gray-50 border rounded"><span className="text-xs text-gray-500">Water</span><p className="font-bold text-sm">${item.water}</p></div>
                    <div className="p-1 bg-gray-50 border rounded"><span className="text-xs text-gray-500">Others</span><p className="font-bold text-sm">${item.others}</p></div>
                  </div>
                </div>
              )) : <p className="text-center text-gray-500">No history.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills_Dashboard;

















// 1st and best design
// import React, { useState, useMemo } from 'react';
// import { Plus, X, Search, Building2, FileText, Calendar, ArrowRight, CheckCircle, Pencil, DollarSign, Receipt, AlertTriangle } from 'lucide-react';

// const Bills_Dashboard = () => {
//   const [properties, setProperties] = useState([
//     { id: 'prop_1', house_name: 'Sunrise Apartments' },
//     { id: 'prop_2', house_name: 'Oakwood Villa' },
//   ]);

//   const [units, setUnits] = useState([
//     { id: 'unit_1', unit_name: 'A101', property_id: 'prop_1' },
//     { id: 'unit_2', unit_name: 'A102', property_id: 'prop_1' },
//     { id: 'unit_3', unit_name: 'A201', property_id: 'prop_1' },
//     { id: 'unit_4', unit_name: 'B101', property_id: 'prop_2' },
//     { id: 'unit_5', unit_name: 'B102', property_id: 'prop_2' },
//   ]);

//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = now.getMonth() + 1;

//   const [bills, setBills] = useState([
//     { id: 'bill_1', unit_id: 'unit_1', rent: 1200, electricity: 85, water: 30, others: 20, year: 2026, month: 3 },
//     { id: 'bill_2', unit_id: 'unit_2', rent: 1200, electricity: 120, water: 35, others: 0, year: 2026, month: 3 },
//     { id: 'bill_3', unit_id: 'unit_4', rent: 1500, electricity: 95, water: 40, others: 50, year: 2026, month: 3 },
//     { id: 'bill_4', unit_id: 'unit_1', rent: 1200, electricity: 90, water: 30, others: 10, year: 2026, month: 4 },
//   ]);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [isGenerateConfirmOpen, setIsGenerateConfirmOpen] = useState(false);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
//   const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [historyData, setHistoryData] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const [addForm, setAddForm] = useState({
//     rent: '',
//     electricity: '',
//     water: '',
//     others: ''
//   });

//   const [updateForm, setUpdateForm] = useState({
//     rent: '',
//     electricity: '',
//     water: '',
//     others: ''
//   });

//   const filteredUnits = useMemo(() => {
//     return units.filter(unit => {
//       const prop = properties.find(p => p.id === unit.property_id);
//       const query = searchQuery.toLowerCase();
//       return (
//         unit.unit_name.toLowerCase().includes(query) ||
//         (prop?.house_name || '').toLowerCase().includes(query)
//       );
//     });
//   }, [units, properties, searchQuery]);

//   const groupedBills = useMemo(() => {
//     const groups = {};
//     filteredUnits.forEach(unit => {
//       const prop = properties.find(p => p.id === unit.property_id);
//       const propId = prop?.id || 'unknown';

//       if (!groups[propId]) {
//         groups[propId] = {
//           property: prop || { id: 'unknown', house_name: 'Unknown Property' },
//           bills: []
//         };
//       }

//       const unitBills = bills.filter(b => b.unit_id === unit.id);
//       const latestBill = unitBills.length > 0
//         ? unitBills.sort((a, b) => {
//             if (a.year !== b.year) return b.year - a.year;
//             return b.month - a.month;
//           })[0]
//         : null;

//       groups[propId].bills.push({
//         id: latestBill ? latestBill.id : `unit_${unit.id}`,
//         unit_id: unit.id,
//         unit_name: unit.unit_name,
//         rent: latestBill ? latestBill.rent : '-',
//         electricity: latestBill ? latestBill.electricity : '-',
//         water: latestBill ? latestBill.water : '-',
//         others: latestBill ? latestBill.others : '-',
//         total: latestBill ? (latestBill.rent + latestBill.electricity + latestBill.water + latestBill.others) : '-',
//         year: latestBill ? latestBill.year : '-',
//         month: latestBill ? latestBill.month : '-',
//         property_name: prop?.house_name,
//         hasBill: !!latestBill,
//         isCurrentMonth: latestBill ? (latestBill.year === currentYear && latestBill.month === currentMonth) : false
//       });
//     });

//     return Object.values(groups);
//   }, [filteredUnits, properties, bills, currentYear, currentMonth]);

//   const calculateTotal = (b) => b.rent + b.electricity + b.water + b.others;

//   const handleGenerateAllRents = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       const existingBillUnitIds = new Set(
//         bills
//           .filter(b => b.year === currentYear && b.month === currentMonth)
//           .map(b => b.unit_id)
//       );

//       const newBills = units
//         .filter(u => !existingBillUnitIds.has(u.id))
//         .map(u => ({
//           id: `bill_gen_${Date.now()}_${u.id}`,
//           unit_id: u.id,
//           rent: 0,
//           electricity: 0,
//           water: 0,
//           others: 0,
//           year: currentYear,
//           month: currentMonth
//         }));

//       setBills(prev => [...prev, ...newBills]);
//       setIsLoading(false);
//       setIsGenerateConfirmOpen(false);
//     }, 800);
//   };

//   const openAddModal = (billItem) => {
//     setSelectedBill(billItem);
//     setAddForm({
//       rent: billItem.rent !== '-' ? billItem.rent : '',
//       electricity: billItem.electricity !== '-' ? billItem.electricity : '',
//       water: billItem.water !== '-' ? billItem.water : '',
//       others: billItem.others !== '-' ? billItem.others : ''
//     });
//     setIsAddModalOpen(true);
//   };

//   const openUpdateModal = (billItem) => {
//     if (!billItem.hasBill) {
//       alert("No existing bill to update. Please add a bill first.");
//       return;
//     }
//     setSelectedBill(billItem);
//     setUpdateForm({
//       rent: billItem.rent,
//       electricity: billItem.electricity,
//       water: billItem.water,
//       others: billItem.others
//     });
//     setIsUpdateModalOpen(true);
//   };

//   const openHistoryModal = (billItem) => {
//     setSelectedBill(billItem);
//     const unitHistory = bills
//       .filter(b => b.unit_id === billItem.unit_id)
//       .sort((a, b) => {
//         if (a.year !== b.year) return b.year - a.year;
//         return b.month - a.month;
//       })
//       .map(item => ({
//         ...item,
//         total: calculateTotal(item)
//       }));

//     setHistoryData(unitHistory);
//     setIsHistoryModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsAddModalOpen(false);
//     setIsUpdateModalOpen(false);
//     setIsHistoryModalOpen(false);
//     setSelectedBill(null);
//     setHistoryData([]);
//     setAddForm({ rent: '', electricity: '', water: '', others: '' });
//     setUpdateForm({ rent: '', electricity: '', water: '', others: '' });
//   };

//   const handleAddBill = () => {
//     if (!selectedBill) return;

//     const rent = Number(addForm.rent) || 0;
//     const electricity = Number(addForm.electricity) || 0;
//     const water = Number(addForm.water) || 0;
//     const others = Number(addForm.others) || 0;

//     if ([rent, electricity, water, others].some(v => isNaN(v) || v < 0)) {
//       alert("Please enter valid non-negative numbers for all fields");
//       return;
//     }

//     const billYear = selectedBill.year !== '-' ? selectedBill.year : currentYear;
//     const billMonth = selectedBill.month !== '-' ? selectedBill.month : currentMonth;

//     const existingIndex = bills.findIndex(
//       b => b.unit_id === selectedBill.unit_id && b.year === billYear && b.month === billMonth
//     );

//     if (existingIndex >= 0) {
//       const updatedBills = [...bills];
//       updatedBills[existingIndex] = {
//         ...updatedBills[existingIndex],
//         rent, electricity, water, others
//       };
//       setBills(updatedBills);
//     } else {
//       const newBill = {
//         id: `bill_new_${Date.now()}`,
//         unit_id: selectedBill.unit_id,
//         rent, electricity, water, others,
//         year: billYear,
//         month: billMonth
//       };
//       setBills(prev => [...prev, newBill]);
//     }

//     closeModal();
//   };

//   const handleUpdateBill = () => {
//     if (!selectedBill || !selectedBill.id || !selectedBill.id.startsWith('unit_')) return;

//     const rent = Number(updateForm.rent) || 0;
//     const electricity = Number(updateForm.electricity) || 0;
//     const water = Number(updateForm.water) || 0;
//     const others = Number(updateForm.others) || 0;

//     if ([rent, electricity, water, others].some(v => isNaN(v) || v < 0)) {
//       alert("Please enter valid non-negative numbers for all fields");
//       return;
//     }

//     const updatedBills = bills.map(b => {
//       if (b.id === selectedBill.id) {
//         return { ...b, rent, electricity, water, others };
//       }
//       return b;
//     });

//     setBills(updatedBills);
//     closeModal();
//   };

//   const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         <div className="mb-2">
//           <h1 className="text-3xl font-bold text-black mb-1">Bills Dashboard</h1>
//           <p className="text-gray-600 text-lg">Track and manage unit bills</p>
//         </div>

//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//           <div className="w-full md:w-auto">
//             <div className="relative max-w-md md:w-96">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//               <input
//                 type="text"
//                 placeholder="Search units, property, or bills..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
//               />
//             </div>
//           </div>

//           <button
//             onClick={() => setIsGenerateConfirmOpen(true)}
//             disabled={isLoading}
//             className="w-full md:w-auto bg-purple-400 border-2 border-black rounded-lg px-6 py-3 font-bold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-purple-500 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center space-x-2"
//           >
//             {isLoading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
//                 <span>Generating...</span>
//               </>
//             ) : (
//               <>
//                 <Receipt className="w-5 h-5" />
//                 <span>Generate All Rents</span>
//               </>
//             )}
//           </button>
//         </div>

//         <div className="space-y-8">
//           {groupedBills.length > 0 ? (
//             groupedBills.map(({ property, bills: propBills }) => (
//               <div key={property?.id} className="mb-6">
//                 <div className="flex items-center space-x-3 mb-3 px-1">
//                   <Building2 className="w-5 h-5 text-black" />
//                   <h3 className="text-xl font-bold text-black">{property?.house_name || 'Unknown Property'}</h3>
//                   <span className="bg-gray-500 border-2 border-black px-2 py-1 rounded text-xs font-bold shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-white">
//                     {propBills.length} Unit{propBills.length !== 1 ? 's' : ''}
//                   </span>
//                 </div>

//                 <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] overflow-hidden">
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead>
//                         <tr className="bg-gray-100 border-b-2 border-black">
//                           <th className="text-left py-3 px-4 font-bold text-black">Unit</th>
//                           <th className="text-right py-3 px-4 font-bold text-black">Rent</th>
//                           <th className="text-right py-3 px-4 font-bold text-black">Electric</th>
//                           <th className="text-right py-3 px-4 font-bold text-black">Water</th>
//                           <th className="text-right py-3 px-4 font-bold text-black">Others</th>
//                           <th className="text-right py-3 px-4 font-bold text-black">Total</th>
//                           <th className="text-left py-3 px-4 font-bold text-black">Period</th>
//                           <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {propBills.map((bill) => (
//                           <tr key={bill.id} className={`border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0 ${bill.isCurrentMonth ? 'bg-yellow-50' : ''}`}>
//                             <td className="py-3 px-4 font-medium text-black">{bill.unit_name}</td>
//                             <td className="py-3 px-4 text-right font-mono text-black">{bill.rent !== '-' ? `$${bill.rent}` : '-'}</td>
//                             <td className="py-3 px-4 text-right font-mono text-black">{bill.electricity !== '-' ? `$${bill.electricity}` : '-'}</td>
//                             <td className="py-3 px-4 text-right font-mono text-black">{bill.water !== '-' ? `$${bill.water}` : '-'}</td>
//                             <td className="py-3 px-4 text-right font-mono text-black">{bill.others !== '-' ? `$${bill.others}` : '-'}</td>
//                             <td className="py-3 px-4 text-right font-mono font-bold text-black">
//                               {bill.total !== '-' ? `$${bill.total}` : '-'}
//                             </td>
//                             <td className="py-3 px-4 text-black text-sm">
//                               {bill.hasBill 
//                                 ? `${monthNames[bill.month]} ${bill.year}` 
//                                 : '-'}
//                             </td>
//                             <td className="py-3 px-4">
//                               <div className="flex items-center space-x-2">
//                                 <button
//                                   onClick={() => openAddModal(bill)}
//                                   className="bg-green-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1"
//                                   title="Add / Set Bill"
//                                 >
//                                   <Plus className="w-3 h-3" />
//                                   <span className="hidden sm:inline">Add</span>
//                                 </button>
//                                 <button
//                                   onClick={() => openUpdateModal(bill)}
//                                   className="bg-yellow-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1"
//                                   title="Update Bill"
//                                 >
//                                   <Pencil className="w-3 h-3" />
//                                   <span className="hidden sm:inline">Edit</span>
//                                 </button>
//                                 <button
//                                   onClick={() => openHistoryModal(bill)}
//                                   className="bg-gray-300 border-2 border-black rounded px-2 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1"
//                                   title="View History"
//                                 >
//                                   <FileText className="w-3 h-3" />
//                                   <span className="hidden sm:inline">History</span>
//                                 </button>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="bg-white border-2 border-black rounded-xl p-8 text-center text-gray-500 text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)]">
//               No units found matching your search.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Generate Confirmation Modal */}
//       {isGenerateConfirmOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
//           <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
//             <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl">
//               <div className="flex items-center space-x-2">
//                 <AlertTriangle className="w-5 h-5 text-black" />
//                 <h3 className="text-xl font-bold text-black">Generate Bills</h3>
//               </div>
//               <button onClick={() => setIsGenerateConfirmOpen(false)} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
//                 <X className="w-5 h-5 text-black" />
//               </button>
//             </div>
//             <div className="p-4 space-y-4">
//               <p className="text-black font-medium">
//                 This will create bill entries for <strong>{units.length}</strong> unit(s) for{' '}
//                 <strong>{monthNames[currentMonth]} {currentYear}</strong>.
//               </p>
//               <p className="text-sm text-gray-600">
//                 Bills with amounts of $0 will be created. You can edit each bill afterward.
//                 Existing bills for this period will not be overwritten.
//               </p>
//               <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black">
//                 <button
//                   onClick={() => setIsGenerateConfirmOpen(false)}
//                   className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleGenerateAllRents}
//                   disabled={isLoading}
//                   className="bg-purple-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
//                 >
//                   {isLoading ? 'Generating...' : 'Confirm & Generate'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Bill Modal */}
//       {isAddModalOpen && selectedBill && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
//           <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col max-h-[90vh]">
//             <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
//               <h3 className="text-xl font-bold text-black">Add / Set Bill</h3>
//               <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
//                 <X className="w-5 h-5 text-black" />
//               </button>
//             </div>

//             <div className="p-4 space-y-4 overflow-y-auto">
//               <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
//                 <span className="text-sm font-bold text-gray-600">Unit</span>
//                 <span className="text-lg font-bold text-black">{selectedBill.unit_name}</span>
//               </div>

//               <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
//                 <span className="text-sm font-bold text-gray-600">Period</span>
//                 <span className="text-lg font-bold text-black">
//                   {selectedBill.year !== '-' ? `${monthNames[selectedBill.month]} ${selectedBill.year}` : `${monthNames[currentMonth]} ${currentYear}`}
//                 </span>
//               </div>

//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Rent Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={addForm.rent}
//                       onChange={(e) => setAddForm(prev => ({ ...prev, rent: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Electricity Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={addForm.electricity}
//                       onChange={(e) => setAddForm(prev => ({ ...prev, electricity: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Water Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={addForm.water}
//                       onChange={(e) => setAddForm(prev => ({ ...prev, water: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Others Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={addForm.others}
//                       onChange={(e) => setAddForm(prev => ({ ...prev, others: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="p-3 bg-yellow-100 border-2 border-black rounded-lg flex justify-between items-center">
//                 <span className="text-sm font-bold text-black">Calculated Total</span>
//                 <span className="text-lg font-bold text-black">
//                   ${(
//                     (Number(addForm.rent) || 0) +
//                     (Number(addForm.electricity) || 0) +
//                     (Number(addForm.water) || 0) +
//                     (Number(addForm.others) || 0)
//                   ).toFixed(2)}
//                 </span>
//               </div>

//               <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
//                 <button type="button" onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
//                 <button
//                   type="button"
//                   onClick={handleAddBill}
//                   className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
//                 >
//                   Save Bill
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Update Bill Modal */}
//       {isUpdateModalOpen && selectedBill && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
//           <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col max-h-[90vh]">
//             <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
//               <h3 className="text-xl font-bold text-black">Update Bill</h3>
//               <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
//                 <X className="w-5 h-5 text-black" />
//               </button>
//             </div>

//             <div className="p-4 space-y-4 overflow-y-auto">
//               <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
//                 <span className="text-sm font-bold text-gray-600">Unit</span>
//                 <span className="text-lg font-bold text-black">{selectedBill.unit_name}</span>
//               </div>

//               <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
//                 <span className="text-sm font-bold text-gray-600">Period</span>
//                 <span className="text-lg font-bold text-black">
//                   {`${monthNames[selectedBill.month]} ${selectedBill.year}`}
//                 </span>
//               </div>

//               {selectedBill.isCurrentMonth && (
//                 <div className="p-3 bg-yellow-100 border-2 border-yellow-500 rounded-lg flex items-center space-x-2">
//                   <AlertTriangle className="w-4 h-4 text-yellow-700" />
//                   <span className="text-sm font-bold text-yellow-800">This is the current month bill. You can edit it.</span>
//                 </div>
//               )}

//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Rent Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={updateForm.rent}
//                       onChange={(e) => setUpdateForm(prev => ({ ...prev, rent: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Electricity Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={updateForm.electricity}
//                       onChange={(e) => setUpdateForm(prev => ({ ...prev, electricity: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Water Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={updateForm.water}
//                       onChange={(e) => setUpdateForm(prev => ({ ...prev, water: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-bold text-black mb-1">Others Amount</label>
//                   <div className="relative">
//                     <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input
//                       type="number"
//                       step="any"
//                       value={updateForm.others}
//                       onChange={(e) => setUpdateForm(prev => ({ ...prev, others: e.target.value }))}
//                       placeholder="0.00"
//                       className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="p-3 bg-yellow-100 border-2 border-black rounded-lg flex justify-between items-center">
//                 <span className="text-sm font-bold text-black">Calculated Total</span>
//                 <span className="text-lg font-bold text-black">
//                   ${(
//                     (Number(updateForm.rent) || 0) +
//                     (Number(updateForm.electricity) || 0) +
//                     (Number(updateForm.water) || 0) +
//                     (Number(updateForm.others) || 0)
//                   ).toFixed(2)}
//                 </span>
//               </div>

//               <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
//                 <button type="button" onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
//                 <button
//                   type="button"
//                   onClick={handleUpdateBill}
//                   className="bg-yellow-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
//                 >
//                   Save Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* History Modal */}
//       {isHistoryModalOpen && selectedBill && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
//           <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md max-h-[90vh] flex flex-col">
//             <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
//               <h3 className="text-xl font-bold text-black">Bill History</h3>
//               <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
//                 <X className="w-5 h-5 text-black" />
//               </button>
//             </div>

//             <div className="p-4 space-y-4 overflow-y-auto">
//               <div className="p-3 bg-white border-2 border-black rounded-lg">
//                 <p className="text-sm text-gray-500">Unit: <span className="font-bold text-black">{selectedBill.unit_name}</span></p>
//                 <p className="text-sm text-gray-500">Property: <span className="font-bold text-black">{selectedBill.property_name}</span></p>
//               </div>

//               {historyData.length > 0 ? (
//                 <div className="space-y-3">
//                   {historyData.map((item, index) => (
//                     <div key={item.id} className="bg-white border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="font-bold text-black flex items-center space-x-2">
//                           <Calendar className="w-4 h-4 text-gray-600" />
//                           <span>{`${monthNames[item.month]} ${item.year}`}</span>
//                         </span>
//                         <span className="text-lg font-bold text-black">${item.total.toFixed(2)}</span>
//                       </div>

//                       <div className="grid grid-cols-4 gap-2 text-center">
//                         <div className="p-2 bg-gray-50 border border-gray-300 rounded">
//                           <span className="text-xs text-gray-500 block">Rent</span>
//                           <span className="font-bold text-sm text-black">${item.rent}</span>
//                         </div>
//                         <div className="p-2 bg-gray-50 border border-gray-300 rounded">
//                           <span className="text-xs text-gray-500 block">Electric</span>
//                           <span className="font-bold text-sm text-black">${item.electricity}</span>
//                         </div>
//                         <div className="p-2 bg-gray-50 border border-gray-300 rounded">
//                           <span className="text-xs text-gray-500 block">Water</span>
//                           <span className="font-bold text-sm text-black">${item.water}</span>
//                         </div>
//                         <div className="p-2 bg-gray-50 border border-gray-300 rounded">
//                           <span className="text-xs text-gray-500 block">Others</span>
//                           <span className="font-bold text-sm text-black">${item.others}</span>
//                         </div>
//                       </div>

//                       {index < historyData.length - 1 && (
//                         <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
//                           <ArrowRight className="w-3 h-3 rotate-90" />
//                           <span>
//                             {(() => {
//                               const prevItem = historyData[index + 1];
//                               const diff = item.total - prevItem.total;
//                               return diff > 0 ? `+$${diff.toFixed(2)} from prev month` : diff < 0 ? `-$${Math.abs(diff).toFixed(2)} from prev month` : 'Same as prev month';
//                             })()}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   No bill history available for this unit.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Bills_Dashboard;
