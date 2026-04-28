import React from 'react';

const Renter_Invoices = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-black">
                {['Invoice ID', 'Month', 'Total', 'Paid', 'Due', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-bold text-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b border-gray-300 hover:bg-gray-50 transition-colors last:border-b-0">
                  <td className="py-3 px-4 font-medium text-black">{inv.id}</td>
                  <td className="py-3 px-4 text-black">{inv.month} {inv.year}</td>
                  <td className="py-3 px-4 font-bold text-black">৳{inv.total}</td>
                  <td className="py-3 px-4 text-green-700">৳{inv.paid}</td>
                  <td className="py-3 px-4 text-red-700">৳{inv.due}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusColors[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => setShowInvoiceDetails(inv)} className="bg-blue-300 border-2 border-black rounded px-3 py-1 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Renter_Invoices;