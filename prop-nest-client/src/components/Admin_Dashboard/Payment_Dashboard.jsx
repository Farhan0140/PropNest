import React, { useState, useMemo, useEffect } from 'react';
import { Search, Building2, Coins, X, Calendar } from 'lucide-react';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const Bills_Dashboard = () => {
  const { 
    properties, 
    units, 
    rentInvoice, 
  } = useAdminContext();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [bills, setBills] = useState(rentInvoice);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectedDueBills, setSelectedDueBills] = useState([]);

  useEffect(() => {
    setBills(rentInvoice);
  }, [rentInvoice]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const filteredUnits = useMemo(() => {
    return units?.filter(unit => {
      const prop = properties?.find(p => p.id === unit.property_id);
      const query = searchQuery.toLowerCase();
      return (
        unit.unit_name.toLowerCase().includes(query) ||
        (prop?.house_name || '').toLowerCase().includes(query)
      );
    });
  }, [units, properties, searchQuery]);

  const groupedBills = useMemo(() => {
    const groups = {};
    filteredUnits?.forEach(unit => {
      const prop = properties.find(p => p.id === unit.property_id);
      const propId = prop?.id || 'unknown';

      if (!groups[propId]) {
        groups[propId] = {
          property: prop || { id: 'unknown', house_name: 'Unknown Property' },
          bills: []
        };
      }

      const allUnitBills = bills?.filter(b => b.unit_id === unit.id) || [];
      
      // Sort bills: newest first
      const sortedBills = [...allUnitBills].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      
      const latestBill = sortedBills[0] || null;
      const olderBills = sortedBills.slice(1);

      // 1. Calculate Previous Advances and Dues
      let totalAdvances = 0;
      const previousUnpaidBills = [];

      olderBills.forEach(b => {
        const total = b.total_amount || 0;
        const paid = b.total_paid_amount || 0;
        
        if (paid > total) {
          // This bill has an advance payment
          totalAdvances += (paid - total);
        } else if (total > paid) {
          // This bill is due
          previousUnpaidBills.push({ ...b, dueAmount: total - paid });
        }
      });

      // 2. Calculate Current Due
      const currentTotalAmount = latestBill ? (latestBill.total_amount || 0) : 0;
      const currentTotalPaid = latestBill ? (latestBill.total_paid_amount || 0) : 0;
      
      // Raw due for current bill
      const currentDueRaw = Math.max(0, currentTotalAmount - currentTotalPaid);
      
      // Apply previous advances to current due if current due > 0
      const effectiveAdvances = currentDueRaw > 0 ? Math.min(currentDueRaw, totalAdvances) : 0;
      const netCurrentDue = Math.max(0, currentDueRaw - totalAdvances);

      // 3. Overall Status
      const totalDue = netCurrentDue + previousUnpaidBills.reduce((sum, b) => sum + b.dueAmount, 0);
      const status = totalDue > 0 ? 'unpaid' : 'paid';

      groups[propId].bills.push({
        id: latestBill ? latestBill.id : `unit_${unit.id}`,
        unit_id: unit.id,
        unit_name: unit.unit_name,
        currentDue: netCurrentDue,
        previousDue: previousUnpaidBills.reduce((sum, b) => sum + b.dueAmount, 0),
        totalAdvances: totalAdvances,
        effectiveAdvances, 
        year: latestBill ? latestBill.year : '-',
        month: latestBill ? latestBill.month : '-',
        property_name: prop?.house_name,
        hasBill: !!latestBill,
        isCurrentMonth: latestBill ? (latestBill.year === currentYear && latestBill.month === currentMonth) : false,
        status,
        currentBill: latestBill,
        previousUnpaidBills,
        items: latestBill ? latestBill.items : []
      });
    });

    return Object.values(groups);
  }, [filteredUnits, properties, bills, currentYear, currentMonth]);

  const openPaymentModal = (billItem) => {
    if (!billItem.hasBill && billItem.previousUnpaidBills.length === 0) {
      alert("No bills to pay.");
      return;
    }
    setSelectedBill(billItem);
    setPaymentAmount('');
    // Default select all previous unpaid bills if any
    setSelectedDueBills(billItem.previousUnpaidBills.map(b => b.id));
    setIsPaymentModalOpen(true);
  };

  const closeModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedBill(null);
    setPaymentAmount('');
    setSelectedDueBills([]);
  };

  const handlePaymentSubmit = () => {
    if (!selectedBill) return;

    const payAmt = Number(paymentAmount) || 0;
    if (payAmt <= 0) {
      alert("Please enter a valid payment amount greater than 0.");
      return;
    }

    // Collect target Bill IDs to process: Current first, then selected previous
    const targetBillIds = [];
    
    // 1. Current Bill (if it still has a net due)
    if (selectedBill.currentBill && selectedBill.currentDue > 0) {
      targetBillIds.push(selectedBill.currentBill.id);
    }
    
    // 2. Selected Previous Dues
    selectedBill.previousUnpaidBills
      .filter(b => selectedDueBills.includes(b.id))
      .forEach(b => targetBillIds.push(b.id));

    if (targetBillIds.length === 0) {
      alert("Nothing to pay. All selected periods are already cleared.");
      return;
    }

    setBills(prev => {
      let remainingPay = payAmt;
      
      // Map to create new bill objects and calculate updates
      const updatedBills = prev.map(b => {
        if (targetBillIds.includes(b.id) && remainingPay > 0) {
          const currentPaid = b.total_paid_amount || 0;
          const currentTotal = b.total_amount || 0;
          const dueForBill = Math.max(0, currentTotal - currentPaid);
          const payForThisBill = Math.min(remainingPay, dueForBill);
          
          const newTotalPaid = currentPaid + payForThisBill;
          remainingPay -= payForThisBill;

          return {
            ...b,
            total_paid_amount: newTotalPaid,
            status: newTotalPaid >= currentTotal ? 'paid' : 'unpaid'
          };
        }
        return b;
      });

      // Construct response object for logging
      const responsePayload = {
        success: true,
        message: "Payment processed successfully",
        data: {
          unit_id: selectedBill.unit_id,
          unit_name: selectedBill.unit_name,
          amount_paid: payAmt,
          bills_updated: updatedBills
            .filter(b => targetBillIds.includes(b.id))
            .map(b => ({
              id: b.id,
              period: `${monthNames[b.month]} ${b.year}`,
              total_amount: b.total_amount,
              total_paid_amount: b.total_paid_amount,
              status: b.status
            }))
        }
      };

      console.log("Payment Response:", responsePayload);

      return updatedBills;
    });

    closeModal();
  };

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className=" font-sans p-1 md:p-8">
      <div className="md:max-w-7xl mx-auto space-y-6">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-black mb-2">Rent Management</h1>
          <p className="text-gray-600 text-lg">Track invoices, monthly billing</p>
        </div>

        <div className="w-full md:w-auto mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search units, property, or bills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border-2 border-black rounded-lg py-2 pl-10 pr-4 text-black placeholder-gray-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200" />
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
                          <th className="text-left py-3 px-4 font-bold text-black">Period</th>
                          <th className="text-right py-3 px-4 font-bold text-black">Current Due</th>
                          <th className="text-right py-3 px-4 font-bold text-black">Previous Due</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                          <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {propBills.map((bill) => (
                          <tr key={bill.id} className={`border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0 ${bill.isCurrentMonth ? 'bg-yellow-50' : ''}`}>
                            <td className="py-3 px-4 font-medium text-black">{bill.unit_name}</td>
                            <td className="py-3 px-4 text-black text-sm">{bill.hasBill ? `${monthNames[bill.month]} ${bill.year}` : '-'}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-black">
                              {bill.hasBill && bill.currentDue > 0 ? `$${formatAmount(bill.currentDue)}` : (bill.hasBill ? (bill.totalAdvances > bill.effectiveAdvances ? `Credit $${formatAmount(bill.totalAdvances - bill.effectiveAdvances)}` : '-') : '-')}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-black">
                              {bill.previousDue > 0 ? `$${formatAmount(bill.previousDue)}` : '-'}
                            </td>
                            <td className="py-3 px-4">
                              {bill.hasBill ? (
                                <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${bill.status === 'unpaid' ? 'bg-red-200 border-red-500 text-red-800' : 'bg-green-200 border-green-500 text-green-800'}`}>
                                  {bill.status === 'unpaid' ? 'Unpaid' : 'Paid'}
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <button onClick={() => openPaymentModal(bill)} className="bg-green-400 border-2 border-black rounded px-3 py-1.5 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1">
                                <Coins className="w-4 h-4" />
                                <span>Create Payment</span>
                              </button>
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

      {/* Create Payment Modal */}
      {isPaymentModalOpen && selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
          <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl shrink-0">
              <h3 className="text-xl font-bold text-black flex items-center space-x-2"><Coins className="w-5 h-5" /><span>Create Payment</span></h3>
              <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"><X className="w-5 h-5 text-black" /></button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-600">Unit</span>
                  <span className="text-lg font-bold text-black">{selectedBill.unit_name}</span>
                </div>
                
                {/* Current Month Breakdown */}
                <div className="p-3 bg-white border-2 border-black rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600">Current Period ({selectedBill.hasBill ? `${monthNames[selectedBill.month]} ${selectedBill.year}` : '-'})</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Total Amount:</span>
                    <span>${formatAmount(selectedBill.currentBill?.total_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Already Paid:</span>
                    <span>-${formatAmount(selectedBill.currentBill?.total_paid_amount || 0)}</span>
                  </div>
                  {selectedBill.effectiveAdvances > 0 && (
                    <div className="flex justify-between text-sm text-green-700 font-medium">
                      <span>Less Previous Advance Applied:</span>
                      <span>-${formatAmount(selectedBill.effectiveAdvances)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-300">
                    <span className="text-sm font-bold text-black">Current Due:</span>
                    <span className="text-lg font-bold text-black">{selectedBill.currentDue > 0 ? `${formatAmount(selectedBill.currentDue)}` : '$0.00'}</span>
                  </div>
                </div>

                {/* Previous Advances Summary */}
                {selectedBill.totalAdvances > selectedBill.effectiveAdvances && (
                  <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-bold text-green-700">Remaining Advance Credit</span>
                    <span className="text-lg font-bold text-green-700">+${formatAmount(selectedBill.totalAdvances - selectedBill.effectiveAdvances)}</span>
                  </div>
                )}

                {/* Select Due Periods */}
                {selectedBill.previousUnpaidBills.length > 0 && (
                  <div className="border-2 border-black rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-black text-sm flex items-center gap-2"><Calendar className="w-4 h-4" /> Select Due Periods</h4>
                      <button 
                        type="button"
                        onClick={() => setSelectedDueBills(selectedBill.previousUnpaidBills.map(b => b.id))}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedBill.previousUnpaidBills.map((bill) => {
                        const total = bill.total_amount || 0;
                        const paid = bill.total_paid_amount || 0;
                        const due = total - paid;
                        const isSelected = selectedDueBills.includes(bill.id);
                        return (
                          <label key={bill.id} className="flex items-center justify-between p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedDueBills(prev => [...prev, bill.id]);
                                  else setSelectedDueBills(prev => prev.filter(id => id !== bill.id));
                                }}
                                className="w-4 h-4 border-2 border-black rounded text-blue-600 focus:ring-0 cursor-pointer" 
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-black">{`${monthNames[bill.month]} ${bill.year}`}</span>
                                <span className="text-xs text-gray-500">${formatAmount(total)} - ${formatAmount(paid)}</span>
                              </div>
                            </div>
                            <span className="text-sm font-bold text-red-500">${formatAmount(due)}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Payment Input */}
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Payment Amount</label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="number" 
                      step="any" 
                      value={paymentAmount} 
                      onChange={(e) => setPaymentAmount(e.target.value)} 
                      placeholder="Enter amount to pay" 
                      className="w-full bg-white border-2 border-black rounded-lg py-3 pl-12 pr-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-lg" 
                    />
                  </div>
                </div>

                {/* Preview Payment Result */}
                {paymentAmount && Number(paymentAmount) > 0 && (
                  <div className="p-4 bg-yellow-100 border-2 border-black rounded-lg">
                    <h4 className="font-bold text-black mb-2">Payment Preview</h4>
                    <div className="space-y-2">
                      {(() => {
                        const totalDueForSelected = selectedBill.currentDue + selectedBill.previousUnpaidBills
                          .filter(b => selectedDueBills.includes(b.id))
                          .reduce((sum, b) => sum + (b.dueAmount || 0), 0);
                        
                        const payAmt = Number(paymentAmount);
                        const remaining = totalDueForSelected - payAmt;

                        if (remaining <= 0) {
                          return (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">New Status:</span>
                                <span className="font-bold text-green-700 bg-green-200 px-2 py-0.5 rounded border border-green-500">Paid</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Advance Amount:</span>
                                <span className="font-bold text-green-600">+${formatAmount(Math.abs(remaining))}</span>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">New Status:</span>
                                <span className="font-bold text-red-700 bg-red-200 px-2 py-0.5 rounded border border-red-500">Unpaid</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">Still Due:</span>
                                <span className="font-bold text-black">${formatAmount(remaining)}</span>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
                <button type="button" onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
                <button 
                  type="button" 
                  onClick={handlePaymentSubmit} 
                  className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills_Dashboard;
