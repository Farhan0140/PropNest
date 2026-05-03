import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Search, Building2, FileText, Calendar, ArrowRight, DollarSign, AlertTriangle, CheckCircle, Clock, Eye, Download, MapPin, User, Phone, Mail, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import useAdminContext from './hooks/Admin/useAdminContext';

const Single_Invoice_Dashboard = () => {
  const { properties, units } = useAdminContext();
  const invoiceRef = useRef(null);

  // Mock invoice data matching your JSON structure
  const [invoice, setInvoice] = useState({
    id: 6,
    renter_id: 1,
    unit_id: 26,
    month: 4,
    year: 2026,
    status: "unpaid",
    total_amount: 13500,
    total_paid_amount: 0,
    items: [
      { id: 14, item_type: "rent", amount: 10000, description: "Monthly Rent" },
      { id: 15, item_type: "electricity", amount: 3000, description: "Electricity Bill" },
      { id: 16, item_type: "others", amount: 500, description: "Internet" }
    ]
  });

  const [isDownloading, setIsDownloading] = useState(false);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount || 0);
  };

  const getUnitName = (unitId) => {
    const unit = units?.find(u => u?.id === unitId);
    return unit?.unit_name || `Unit ${unitId || 'N/A'}`;
  };

  const getPropertyName = (unitId) => {
    const unit = units?.find(u => u?.id === unitId);
    const prop = properties?.find(p => p?.id === unit?.property_id);
    return prop?.house_name || 'Unknown Property';
  };

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const statusConfig = {
    paid: { label: 'Paid', color: 'bg-green-400 border-green-600 text-green-900', bg: 'bg-green-50' },
    unpaid: { label: 'Unpaid', color: 'bg-red-400 border-red-600 text-red-900', bg: 'bg-red-50' },
    partial: { label: 'Partial', color: 'bg-blue-400 border-blue-600 text-blue-900', bg: 'bg-blue-50' },
    overdue: { label: 'Overdue', color: 'bg-orange-400 border-orange-600 text-orange-900', bg: 'bg-orange-50' }
  };

  const status = statusConfig[invoice?.status] || statusConfig.unpaid;

  const dueAmount = (invoice?.total_amount || 0) - (invoice?.total_paid_amount || 0);
  const invoiceDate = `${invoice?.month || ''}/${invoice?.year || ''}`;
  const dueDate = `15 ${monthNames[invoice?.month] || ''} ${invoice?.year || ''}`;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = invoiceRef.current;
      const options = {
        margin: [10, 10],
        filename: `Invoice_${invoice?.id}_${getUnitName(invoice?.unit_id)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-black mb-1">Invoice #INV-{String(invoice?.id).padStart(4, '0')}</h1>
            <p className="text-gray-600 text-lg">Rental payment details & breakdown</p>
          </div>
          <button 
            onClick={handleDownloadPDF} 
            disabled={isDownloading}
            className="w-full sm:w-auto bg-red-500 border-2 border-black rounded-lg px-6 py-3 font-bold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center space-x-2"
          >
            {isDownloading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </>
            )}
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div ref={invoiceRef} className="bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden print:shadow-none print:border-0">
          {/* Invoice Header Banner */}
          <div className="bg-gray-900 text-white p-6 md:p-8 print:bg-white print:text-black print:border-b-4 print:border-black">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="print:mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-yellow-400 border-2 border-white rounded-lg flex items-center justify-center print:border-black">
                    <Building2 className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-wide print:text-3xl">PROPERTY MANAGEMENT</h2>
                    <p className="text-gray-300 text-sm print:text-black print:font-medium">Professional Rental Services</p>
                  </div>
                </div>
                <p className="text-gray-400 text-xs print:text-gray-600">123 Business Street, City 10001 | +880 1234-567890 | billing@property.com</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-4 py-2 rounded-lg border-2 font-bold text-sm ${invoice?.status === 'paid' ? 'bg-green-400 border-green-600 text-green-900 print:bg-green-100 print:border-green-800' : 'bg-red-500 border-red-700 text-white print:bg-red-100 print:border-red-800 print:text-red-900'}`}>
                  {status.label.toUpperCase()}
                </span>
                <div className="mt-3 text-sm space-y-1">
                  <p className="font-bold print:text-base">INVOICE #INV-{String(invoice?.id).padStart(4, '0')}</p>
                  <p className="text-gray-300 print:text-gray-600">Date: {invoiceDate}</p>
                  <p className="text-gray-300 print:text-gray-600">Due: {dueDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Renter & Property Info */}
          <div className="p-6 md:p-8 border-b-2 border-gray-200 print:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bill To */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 print:bg-gray-100 print:border-gray-400">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Bill To
                </h3>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-black print:text-lg">Renter #{invoice?.renter_id || 'N/A'}</p>
                  <p className="text-gray-600 text-sm">Tenant ID: T-{String(invoice?.renter_id).padStart(4, '0')}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>renter{invoice?.renter_id}@email.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>+880 1712-345678</span>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 print:bg-gray-100 print:border-gray-400">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Property Details
                </h3>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-black print:text-lg">{getPropertyName(invoice?.unit_id)}</p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {getUnitName(invoice?.unit_id)} | Unit ID: {invoice?.unit_id}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Billing Period: {monthNames[invoice?.month] || ''} {invoice?.year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2 print:text-xl">
              <FileText className="w-5 h-5 text-gray-500" /> Invoice Items
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-2 border-black print:border-gray-800">
                    <th className="text-left py-3 px-4 font-bold text-black text-sm">ITEM</th>
                    <th className="text-left py-3 px-4 font-bold text-black text-sm">DESCRIPTION</th>
                    <th className="text-right py-3 px-4 font-bold text-black text-sm">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200 print:divide-gray-400">
                  {invoice?.items?.map((item, idx) => (
                    <tr key={item?.id || idx} className="print:py-2">
                      <td className="py-4 px-4 capitalize font-medium text-black">
                        <span className="bg-gray-200 border border-gray-300 rounded px-2 py-1 text-xs font-bold print:bg-white print:border-gray-600">
                          {item?.item_type}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 print:text-gray-800">{item?.description || '-'}</td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-black print:text-lg">৳{formatAmount(item?.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-6 border-t-2 border-black print:border-gray-800">
              <div className="text-sm text-gray-600 max-w-md">
                <p className="font-bold text-black mb-2">Payment Instructions:</p>
                <p>Bank Transfer | Account: 001234567890 | Branch: Main</p>
                <p className="mt-1">Please use Invoice #{invoice?.id} as reference.</p>
              </div>
              
              <div className="w-full md:w-80 space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-mono font-bold text-black print:text-base">৳{formatAmount(invoice?.total_amount)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 font-medium">Tax (0%)</span>
                  <span className="font-mono font-bold text-black">৳0.00</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-green-600 font-bold">Amount Paid</span>
                  <span className="font-mono font-bold text-green-600 print:text-base">-৳{formatAmount(invoice?.total_paid_amount)}</span>
                </div>
                <div className="border-t-2 border-black pt-3 mt-3 flex justify-between items-center print:border-gray-800 print:pt-2">
                  <span className="text-black font-bold text-lg print:text-xl">Total Due</span>
                  <span className="font-mono font-black text-red-600 text-2xl print:text-3xl print:text-red-900">৳{formatAmount(dueAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t-2 border-gray-200 p-6 print:bg-gray-100 print:border-gray-400">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <p className="text-sm text-gray-500 print:text-gray-600">Thank you for your timely payment. For queries, contact support@property.com</p>
              <p className="text-xs text-gray-400 print:hidden">Generated on {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 print:hidden">
          {[
            { label: 'Total', value: `৳${formatAmount(invoice?.total_amount)}`, color: 'bg-blue-400' },
            { label: 'Paid', value: `৳${formatAmount(invoice?.total_paid_amount)}`, color: 'bg-green-400' },
            { label: 'Due', value: `৳${formatAmount(dueAmount)}`, color: 'bg-red-400' },
            { label: 'Items', value: invoice?.items?.length || 0, color: 'bg-purple-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] hover:-translate-y-0.5 transition-all">
              <div className={`w-8 h-8 ${stat.color} border-2 border-black rounded-lg flex items-center justify-center mb-2`}>
                <span className="text-black font-bold text-xs">{i + 1}</span>
              </div>
              <p className="text-lg font-bold text-black">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Single_Invoice_Dashboard;
