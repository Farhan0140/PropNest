
const PropertyUserForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Property information saved successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-1 md:p-4 font-sans">
      <div className="w-full my-10 md:my-0 max-w-87.5 md:max-w-150">
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col items-start justify-center gap-5 
            md:p-5 p-2 bg-white rounded-lg 
            border-2 border-black 
            shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)]
          "
        >
          
          {/* Title */}
          <div className="text-gray-800 font-black text-xl mb-2 leading-tight">
            Property,<br />
            <span className="text-gray-600 font-semibold text-base">fill in the details</span>
          </div>

          {/* Row 1: House Name & Address */}
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <input 
              type="text" 
              placeholder="House Name" 
              name="house_name" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
            />
            <input 
              type="text" 
              placeholder="Address" 
              name="address" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
            />
          </div>

          {/* Row 2: City & Postal Code */}
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <input 
              type="text" 
              placeholder="City" 
              name="city" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
            />
            <input 
              type="text" 
              placeholder="Postal Code" 
              name="postal_code" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
            />
          </div>

          {/* Row 3: Number of Floors & Total Units Per Floor */}
          <div className="flex flex-col md:flex-row gap-5 w-full">
            <input 
              type="number" 
              placeholder="Number of Floors" 
              name="number_of_floors" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
            />
            <input 
              type="number" 
              placeholder="Total Units Per Floor" 
              name="total_units" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
            />
          </div>

          {/* Row 4: Base Rent Per Unit */}
          <div className="w-full">
            <input 
              type="number" 
              placeholder="Base Rent Per Unit" 
              name="base_rent" 
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              " 
            />
          </div>

          {/* Row 5: Description */}
          <div className="w-full">
            <textarea 
              placeholder="Description" 
              name="description" 
              rows="3"
              className="
                w-full rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                resize-none
              " 
            />
          </div>

          {/* Row 6: Submit Button */}
          <button 
            type="submit"
            className="
              mt-2 w-full h-10 rounded 
              border-2 border-black bg-white 
              shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
              text-base font-semibold text-gray-800 
              cursor-pointer 
              active:shadow-none active:translate-x-0.75 active:translate-y-0.75 transition-all
              flex items-center justify-center
            "
          >
            Save Property →
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyUserForm;