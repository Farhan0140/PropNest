import { useForm } from "react-hook-form";
import useAdminContext from "../../hooks/Admin/useAdminContext";
import { useEffect, useState } from "react";

const AddPropertyForm = ({ onCloseButtonClick, defaultValues = {}, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // TODO Add Update Property Context after making route in go server
  const { 
    CreateProperty, 
    setProperties, 
    isCreatingProperty, 
  } = useAdminContext();

  const [isFailed, setIsFailed] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");

  const onSubmit = async (data) => {
    let res;

    try {
      if(isEdit) {
        console.log(defaultValues);
        // TODO call update property context
      } else {
        res = await CreateProperty(data);
      }

      if (res.response != null) {
        if(isEdit) {
          setProperties((prev) => prev.map((p) => 
            p.id === defaultValues.id ? res.response : p
          ));
        } else {
          setProperties((prev) => [...prev, res.response]);
        }

        console.log(res.response);
        setFailedMsg(res.message);
        setIsFailed(false);
        setTimeout(() => onCloseButtonClick(), 2000);
      } else {
        setIsFailed(true);
        setFailedMsg(res.message);
      }
    } catch (error) {
      console.log(error);
      setIsFailed(true);
      setFailedMsg("An error occurred while creating the property");
    }
  };

  return (
    <form
      className="flex gap-4 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * House Name
          </label>
          <input
            type="text"
            placeholder="House Name"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("house_name", { required: "* This Field is Required" })}
          />
          {errors.house_name && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.house_name.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * Address
          </label>
          <input
            type="text"
            placeholder="Address"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("address", { required: "* This Field is Required" })}
          />
          {errors.address && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.address.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            City
          </label>
          <input
            type="text"
            placeholder="City"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("city")}
          />
          {errors.city && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.city.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Postal Code
          </label>
          <input
            type="text"
            placeholder="Postal Code"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("postal_code")}
          />
          {errors.postal_code && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.postal_code.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * Number Of Floors
          </label>
          <input
            type="number"
            placeholder="Number Of Floors"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("number_of_floors", {
              required: "* This Field is Required",
              min: { value: 1, message: "* Must be at least 1 floor" },
            })}
          />
          {errors.number_of_floors && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.number_of_floors.message}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * Total Units Per Floor
          </label>
          <input
            type="number"
            placeholder="Total Units Per Floor"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("total_units", {
              required: "* This Field is Required",
              min: { value: 1, message: "* Must be at least 1 unit" },
            })}
          />
          {errors.total_units && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.total_units.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-black mb-1">
          * Base Rent Per Unit
        </label>
        <input
          type="number"
          placeholder="Base Rent Per Unit"
          className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
          {...register("base_rent", {
            required: "* This Field is Required",
            min: { value: 0, message: "* Rent must be positive" },
          })}
        />
        {errors.base_rent && (
          <span className="text-red-500 text-sm font-semibold mt-1 block">
            {errors.base_rent.message}
          </span>
        )}
      </div>

      {/* For Message Box */}
      {failedMsg.length > 0 && (
        <div
          className={`
            w-full md:h-10 h-16 rounded p-5
            border-2 border-black ${isFailed ? "bg-red-300" : "bg-green-300"}
            shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] 
            text-base font-semibold text-gray-800 
            flex items-center justify-center
            transition-all
          `}
        >
          {failedMsg}
        </div>
      )}

      <div className="space-x-3 pt-4 border-t-2 border-black flex gap-3">
        <button
          type="button"
          onClick={onCloseButtonClick}
          className="bg-gray-300 border-2 w-full border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isCreatingProperty}
          className="bg-blue-300 border-2 disabled:opacity-50 disabled:cursor-not-allowed w-full border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          {isCreatingProperty ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            isEdit ? "Update" : "Save"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddPropertyForm;
