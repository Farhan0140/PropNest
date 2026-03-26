import React, { useState } from 'react';
import { Plus, Hotel, Info, X } from 'lucide-react';
import { Link } from 'react-router';

const App = () => {

  const templates = [
    {
      id: 2,
      title: 'Resume',
      subtitle: 'Serif',
      info: 'Professional resume template with elegant serif fonts. Ideal for traditional industries and formal applications.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="group cursor-pointer relative">
              {/* Card Preview */}
              <div className="bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full relative">
                
                
                <div className="h-48 bg-white p-4 border-b-2 border-slate-500">
                  <div className="w-full h-full flex items-center justify-center">
                    <Hotel className="w-20 h-20 text-black" strokeWidth={2} />
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-black mb-1 group-hover:underline">
                    {template.title}
                  </h3>
                  
                  {/* Subtitle */}
                  {template.subtitle && (
                    <p className="text-gray-600 font-medium">
                      {template.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          
          {/* Add Property Button  */}
          <div className="group cursor-pointer relative">
            <Link to="form">
                {/* Card Preview */}
                <div className="bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,0.7)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col h-full relative">
                  <div className="h-48 bg-white p-4 border-b-2 border-black">
                    <div className="w-full h-full flex items-center justify-center">
                      <Plus className="w-20 h-20 text-black" strokeWidth={2} />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-black mb-1 group-hover:underline">
                      Add Property
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

export default App;