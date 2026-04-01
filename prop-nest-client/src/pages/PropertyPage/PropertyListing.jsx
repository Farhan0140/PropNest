import { Plus, Hotel, Info, X, MapPin, Home, DollarSign, Building, Mail, Hash, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const PropertyListing = () => {
  const { properties } = useAdminContext();
  
  const [activeInfo, setActiveInfo] = useState(null);

  return (
    <div className="min-h-screen bg-gray-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((prop, index) => (
            <div key={index} className="group cursor-pointer relative">
              {/* Card Preview */}
              <div className="bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full relative">
                
                <div className="h-48 bg-white p-4 border-b-2 border-black">
                  <div className="w-full h-full flex items-center justify-center">
                    <Hotel className="w-20 h-20 text-black" strokeWidth={2} />
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Title with Info Button */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-black">
                      {prop.house_name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveInfo(activeInfo === index ? null : index);
                      }}
                      className="bg-white border-2 border-black rounded-full p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                    >
                      <Info className="w-4 h-4 text-black" />
                    </button>
                  </div>
                  
                  {/* Info Tooltip */}
                  {activeInfo === index && (
                    <div className="absolute top-10 md:top-10 right-4 z-20 bg-gray-100 border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 w-48">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-black">Property Info</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveInfo(null);
                          }}
                          className="bg-white border-2 border-black rounded-full p-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                        >
                          <X className="w-3 h-3 text-black" />
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3 text-black shrink-0" />
                          <span className="text-xs text-black">{prop.address || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Home className="w-3 h-3 text-black shrink-0" />
                          <span className="text-xs text-black">{prop.city || 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-3 h-3 text-black shrink-0" />
                          <span className="text-xs text-black">৳{prop.base_rent || 0}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="w-3 h-3 text-black shrink-0" />
                          <span className="text-xs text-black">{prop.number_of_floors || 0} Floors</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Hash className="w-3 h-3 text-black shrink-0" />
                          <span className="text-xs text-black">{prop.total_units || 0} Units</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-black shrink-0" />
                          <span className="text-xs text-black">{prop.postal_code || 'N/A'}</span>
                        </div>
                        <div className="pt-1.5 border-t-2 border-black">
                          <p className="text-xs text-gray-600 line-clamp-2">{prop.description || 'No description'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Subtitle */}
                  {prop.address && (
                    <p className="text-gray-600 font-medium text-sm">
                      {prop.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Property Button */}
          <div className="group cursor-pointer relative">
            <Link to="form">
              {/* Card Preview */}
              <div className="bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full relative">
                <div className="h-48 bg-white p-4 border-b-2 border-black">
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus className="w-20 h-20 text-black" strokeWidth={2} />
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-black mb-1">
                    Add Property
                  </h3>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="group cursor-pointer relative">
            <Link to="/admin-dashboard">
              {/* Card Preview */}
              <div className="bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full relative">
                <div className="h-48 bg-white p-4 border-b-2 border-black">
                  <div className="w-full h-full flex items-center justify-center">
                    <LayoutDashboard className="w-20 h-20 text-black" strokeWidth={2} />
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-black mb-1">
                    Dashboard
                  </h3>
                </div>
              </div>
            </Link>
          </div>


        </div>
      </div>
    </div>
  );
};

export default PropertyListing;
