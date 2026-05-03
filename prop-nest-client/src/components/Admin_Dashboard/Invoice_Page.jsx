import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Search, Building2, FileText, Calendar, ArrowRight, DollarSign, AlertTriangle, CheckCircle, Clock, Eye, Download, MapPin, User, Phone, Mail, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import useAdminContext from '../../hooks/Admin/useAdminContext';
import { useParams } from 'react-router';
import authApiClient from '../../services/auth-api-client';
import LoadingAnimation from '../Message/LoadingAnimation';

const Invoice_Page = () => {
  const { properties, units } = useAdminContext();
  const invoiceRef = useRef(null);
  const { id } = useParams();

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await authApiClient.get("/rent-invoice", {
          params: { renter_id: id }
        });
        const data = Array.isArray(res?.data) ? res.data : (res?.data ? [res.data] : []);
        console.log(data);
        setInvoices(data);
        // Default to the latest invoice (first in array) if available
        if (data?.length > 0) {
          setSelectedInvoice(data[0]);
        }
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

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
    paid: { label: 'Paid', color: 'bg-green-400 border-green-600 text-green-900' },
    unpaid: { label: 'Unpaid', color: 'bg-red-400 border-red-600 text-red-900' },
    partial: { label: 'Partial', color: 'bg-blue-400 border-blue-600 text-blue-900' },
    overdue: { label: 'Overdue', color: 'bg-orange-400 border-orange-600 text-orange-900' }
  };

  const getInvoiceStatus = (inv) => {
    if (inv?.total_paid_amount >= inv?.total_amount) return 'paid';
    if (inv?.total_paid_amount > 0) return 'partial';
    return 'unpaid';
  };

  const handleDownloadPDF = async (inv) => {
    if (!inv) return;
    setIsDownloading(true);
    try {
      // Temporarily select the invoice to render if it's not currently selected
      const wasSelected = selectedInvoice?.id === inv?.id;
      if (!wasSelected) setSelectedInvoice(inv);
      
      // Wait a tick for DOM update if we changed selection
      if (!wasSelected) await new Promise(r => setTimeout(r, 50));

      const element = invoiceRef.current;
      const clone = element?.cloneNode(true);
      if (clone) {
        clone.style.width = '800px';
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        document.body.appendChild(clone);

        const options = {
          margin: [10, 10, 10, 10],
          filename: `Invoice_${inv?.id}_${getUnitName(inv?.unit_id)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2.5, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(options).from(clone).save();
        document.body.removeChild(clone);
      }
      
      if (!wasSelected && invoices?.length > 0) setSelectedInvoice(invoices[0]);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Invoice History Table */}
        <div className="bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] p-4 print:hidden">
          <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Invoice History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-black">
                  <th className="text-left py-3 px-4 font-bold text-black">#ID</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Period</th>
                  <th className="text-right py-3 px-4 font-bold text-black">Total</th>
                  <th className="text-right py-3 px-4 font-bold text-black">Paid</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Status</th>
                  <th className="text-left py-3 px-4 font-bold text-black">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices?.map((inv) => {
                  const status = getInvoiceStatus(inv);
                  const statusStyle = statusConfig[status] || statusConfig.unpaid;
                  return (
                    <tr key={inv?.id} className={`hover:bg-gray-50 transition-colors ${selectedInvoice?.id === inv?.id ? 'bg-blue-50' : ''}`}>
                      <td className="py-3 px-4 font-mono font-medium text-black">#{inv?.id}</td>
                      <td className="py-3 px-4 text-black">{monthNames[inv?.month] || ''} {inv?.year}</td>
                      <td className="py-3 px-4 text-right font-mono text-black">৳{formatAmount(inv?.total_amount)}</td>
                      <td className="py-3 px-4 text-right font-mono text-green-600">৳{formatAmount(inv?.total_paid_amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold border-2 ${statusStyle.color}`}>
                          {statusConfig[status]?.label || 'Unpaid'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedInvoice(inv)} className="bg-blue-300 border-2 border-black rounded px-3 py-1.5 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1">
                            <Eye className="w-3 h-3" /> <span className="hidden sm:inline">View</span>
                          </button>
                          <button onClick={() => handleDownloadPDF(inv)} disabled={isDownloading} className="bg-red-400 border-2 border-black rounded px-3 py-1.5 text-sm font-medium text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-px active:translate-y-px transition-all flex items-center space-x-1">
                            {isDownloading ? <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" /> : <Download className="w-3 h-3" />}
                            <span className="hidden sm:inline">PDF</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {invoices?.length === 0 && (
            <p className="text-center text-gray-500 py-4">No invoices found.</p>
          )}
        </div>

        {/* Detailed Invoice View */}
        {selectedInvoice && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-2 print:hidden">
            <div>
              <h1 className="text-3xl font-bold text-black mb-1">Invoice #INV-{String(selectedInvoice?.id).padStart(4, '0')}</h1>
              <p className="text-gray-600 text-lg">Rental payment details & breakdown</p>
            </div>
            <button 
              onClick={() => handleDownloadPDF(selectedInvoice)} 
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
        )}

        {selectedInvoice && (
          <div ref={invoiceRef} className="bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden print:shadow-none print:border-0">
            {/* Invoice Header Banner */}
            <div className="bg-gray-900 text-white p-6 md:p-8 print:bg-gray-900 print:text-white print:-webkit-print-color-adjust:exact">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-yellow-400 border-2 border-white rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black tracking-wide">PROPERTY MANAGEMENT</h2>
                      <p className="text-gray-300 text-sm">Professional Rental Services</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs">123 Business Street, City 10001 | +880 1234-567890 | billing@property.com</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-4 py-2 rounded-lg border-2 font-bold text-sm ${getInvoiceStatus(selectedInvoice) === 'paid' ? 'bg-green-400 border-green-600 text-green-900' : 'bg-red-500 border-red-700 text-white'}`}>
                    {statusConfig[getInvoiceStatus(selectedInvoice)]?.label || 'Unpaid'}
                  </span>
                  <div className="mt-3 text-sm space-y-1">
                    <p className="font-bold">INVOICE #INV-{String(selectedInvoice?.id).padStart(4, '0')}</p>
                    <p className="text-gray-300">Date: {monthNames[selectedInvoice?.month] || ''} {selectedInvoice?.year}</p>
                    <p className="text-gray-300">Due: 15 {monthNames[selectedInvoice?.month] || ''} {selectedInvoice?.year}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Renter & Property Info */}
            <div className="p-6 md:p-8 border-b-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Bill To
                  </h3>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-black">Renter #{selectedInvoice?.renter_id || 'N/A'}</p>
                    <p className="text-gray-600 text-sm">Tenant ID: T-{String(selectedInvoice?.renter_id).padStart(4, '0')}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>renter{selectedInvoice?.renter_id}@email.com</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-5">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Property Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-black">{getPropertyName(selectedInvoice?.unit_id)}</p>
                    <p className="text-gray-600 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {getUnitName(selectedInvoice?.unit_id)} | Unit ID: {selectedInvoice?.unit_id}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="p-6 md:p-8">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" /> Invoice Items
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-2 border-black">
                      <th className="text-left py-3 px-4 font-bold text-black text-sm">ITEM</th>
                      <th className="text-left py-3 px-4 font-bold text-black text-sm">DESCRIPTION</th>
                      <th className="text-right py-3 px-4 font-bold text-black text-sm">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-200">
                    {selectedInvoice?.items?.length > 0 ? selectedInvoice?.items?.map((item, idx) => (
                      <tr key={item?.id || idx} className="bg-white">
                        <td className="py-4 px-4 capitalize font-medium text-black">
                          <span className="bg-gray-200 border border-gray-300 rounded px-2 py-1 text-xs font-bold">
                            {item?.item_type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{item?.description || '-'}</td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-black">৳{formatAmount(item?.amount)}</td>
                      </tr>
                    )) : (
                      <tr className="bg-white">
                        <td colSpan="3" className="py-6 px-4 text-center text-gray-500">No itemized breakdown available for this invoice.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="mt-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pt-6 border-t-2 border-black">
                <div className="text-sm text-gray-600 max-w-md">
                  <p className="font-bold text-black mb-2">Payment Instructions:</p>
                  <p>Bank Transfer | Account: 001234567890 | Branch: Main</p>
                  <p className="mt-1">Please use Invoice #{selectedInvoice?.id} as reference.</p>
                </div>
                
                <div className="w-full md:w-80 space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="font-mono font-bold text-black">৳{formatAmount(selectedInvoice?.total_amount)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-green-600 font-bold">Amount Paid</span>
                    <span className="font-mono font-bold text-green-600">-৳{formatAmount(selectedInvoice?.total_paid_amount)}</span>
                  </div>
                  <div className="border-t-2 border-black pt-3 mt-3 flex justify-between items-center">
                    <span className="text-black font-bold text-lg">Total Due</span>
                    <span className="font-mono font-black text-red-600 text-2xl">৳{formatAmount((selectedInvoice?.total_amount || 0) - (selectedInvoice?.total_paid_amount || 0))}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t-2 border-gray-200 p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <p className="text-sm text-gray-500">Thank you for your timely payment. For queries, contact support@property.com</p>
                <p className="text-xs text-gray-400 print:hidden">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice_Page;
