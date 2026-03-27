import { useForm } from "react-hook-form";
import authApiClient from "../../services/auth-api-client";
import { useState } from "react";
import { useNavigate } from "react-router";

const PropertyUserForm = () => {

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await authApiClient.post("/property-info", {
        house_name: data.house_name,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        number_of_floors: Number(data.number_of_floors),
        total_units: Number(data.total_units),
        base_rent: Number(data.base_rent),
        description: data.description
      });

      setFailedMsg("Property Created Successfully");
      console.log(res.data);

      setTimeout(() => navigate("/property"), 1000);
      
    } catch (error) {
      
      setIsFailed(true);
      setFailedMsg("Something Went Wrong!");
      console.log(error);
    
    } finally {

      setIsLoading(false);

    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-1 md:p-4 font-sans">
      <div className="w-full my-10 md:my-0 max-w-87.5 md:max-w-150">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
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
            <div className="w-full flex flex-col gap-1">
              <input 
                type="text" 
                placeholder="* House Name" 
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
                {
                  ...register("house_name", {required:"* This Field is Required"})
                }
              />
              {
                errors.house_name && (
                  <span className="text-red-500">{errors.house_name.message}</span>
                )
              }
            </div>

            <div className="w-full flex flex-col gap-1">
              <input 
                type="text" 
                placeholder="* Address" 
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
                {
                  ...register("address", {required:"* This Field is Required"})
                }
              />
              {
                errors.address && (
                  <span className="text-red-500">{errors.address.message}</span>
                )
              }
            </div>
          </div>

          {/* Row 2: City & Postal Code */}
          <div className="flex flex-col md:flex-row gap-5 w-full">

            <div className="w-full flex flex-col gap-1">
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
                {
                  ...register("city")
                }
              />
              {
                errors.city && (
                  <span className="text-red-500">{errors.city.message}</span>
                )
              }
            </div>

            <div className="w-full flex flex-col gap-1">
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
                {
                  ...register("postal_code")
                } 
              />
              {
                errors.postal_code && (
                  <span className="text-red-500">{errors.postal_code.message}</span>
                )
              }
            </div>
          </div>

          {/* Row 3: Number of Floors & Total Units Per Floor */}
          <div className="flex flex-col md:flex-row gap-5 w-full">

            <div className="w-full flex flex-col gap-1">
              <input 
                type="number" 
                placeholder="* Number of Floors" 
                name="number_of_floors" 
                min="1"
                className="
                  w-full h-10 rounded 
                  border-2 border-black bg-white 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                  text-sm font-semibold text-gray-800 
                  px-3 py-2 outline-none transition-all duration-200
                  placeholder:text-gray-500 placeholder:opacity-100
                  focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                " 
                {
                  ...register("number_of_floors", {required:"* This Field is Required"})
                }
              />
              {
                errors.number_of_floors && (
                  <span className="text-red-500">{errors.number_of_floors.message}</span>
                )
              }
            </div>

            <div className="w-full flex flex-col gap-1">
              <input 
                type="number" 
                placeholder="* Total Units Per Floor" 
                name="total_units" 
                min="1"
                className="
                  w-full h-10 rounded 
                  border-2 border-black bg-white 
                  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                  text-sm font-semibold text-gray-800 
                  px-3 py-2 outline-none transition-all duration-200
                  placeholder:text-gray-500 placeholder:opacity-100
                  focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                " 
                {
                  ...register("total_units", {required:"* This Field is Required"})
                }
              />
              {
                errors.total_units && (
                  <span className="text-red-500">{errors.total_units.message}</span>
                )
              }
            </div>
          </div>

          {/* Row 4: Base Rent Per Unit */}
          <div className="w-full flex flex-col gap-1">
            <input 
              type="number" 
              placeholder="* Base Rent Per Unit" 
              name="base_rent" 
              min="0"
              step="1000"
              className="
                w-full h-10 rounded 
                border-2 border-black bg-white 
                shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] 
                text-sm font-semibold text-gray-800 
                px-3 py-2 outline-none transition-all duration-200
                placeholder:text-gray-500 placeholder:opacity-100
                focus:border-[#2d8cf0] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
              "
              {
                ...register("base_rent", {required:"* This Field is Required"})
              } 
            />
            {
              errors.base_rent && (
                <span className="text-red-500 mt-1">{errors.base_rent.message}</span>
              )
            }
          </div>

          {/* Row 5: Description */}
          <div className="w-full flex flex-col gap-1">
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
              {
                ...register("description")
              }
            />
            {
              errors.description && (
                <span className="text-red-500">{errors.description.message}</span>
              )
            }
          </div>

          {/* For Message Box  */}
          {failedMsg.length > 0 && (
            <div className={`
                w-full h-10 rounded 
                border-2 border-black ${isFailed ? "bg-red-300" : "bg-green-300"}
                shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
                text-base font-semibold text-gray-800 
                cursor-pointer 
                active:shadow-none active:translate-x-0.85 active:translate-y-0.85 transition-all
                flex items-center justify-center
              `}
            >
              {failedMsg}
            </div>
          )}

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
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            disabled={isLoading}
          >
            {
              isLoading ? <span className="loading loading-dots loading-xl text-natural"></span> : "Save Property →"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyUserForm;