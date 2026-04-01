import { useForm } from "react-hook-form";
import useAdminContext from "../../hooks/Admin/useAdminContext";
import { useState } from "react";

const AddUnitForm = ({ onCloseButtonClick }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { CreateUnit, setUnits, isCreatingUnit, properties } = useAdminContext();

  const [isFailed, setIsFailed] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");

  // TODO fix property id from backend it's not return property id
  console.log(properties);

  // Status options
  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Maintenance" },
    { value: "reserved", label: "Reserved" },
  ];

  const onSubmit = async (data) => {
    try {
      const res = await CreateUnit(data);

      if (res.response != null) {
        setUnits((prev) => [...prev, res.response]);
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
      setFailedMsg("An error occurred while creating the unit");
    }
  };

  return (
    <form
      className="flex gap-4 flex-col"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * Property
          </label>
          <select
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer appearance-none"
            {...register("property_id", { required: "* This Field is Required" })}
            defaultValue=""
            style={{ color: '#000000' }}
          >
            <option value="" disabled className="text-black">
              Select Property
            </option>
            {properties.map((property) => (
              <option key={property.id} value={property.id} className="text-black">
                {property.house_name} {property.id}
              </option>
            ))}
          </select>
          {errors.property_id && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.property_id.message}
            </span>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * Unit Name
          </label>
          <input
            type="text"
            placeholder="Unit Name"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("unit_name", { required: "* This Field is Required" })}
          />
          {errors.unit_name && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.unit_name.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * Rent Amount
          </label>
          <input
            type="number"
            placeholder="Rent Amount"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("rent_amount", {
              required: "* This Field is Required",
              min: { value: 0, message: "* Rent must be positive" },
            })}
          />
          {errors.rent_amount && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.rent_amount.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-black mb-1">
          * Status
        </label>
        <select
          className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer appearance-none"
          {...register("status", { required: "* This Field is Required" })}
          defaultValue=""
          style={{ color: '#000000' }}
        >
          <option value="" disabled className="text-black">
            Select Status
          </option>
          {statusOptions.map((status) => (
            <option key={status.value} value={status.value} className="text-black">
              {status.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <span className="text-red-500 text-sm font-semibold mt-1 block">
            {errors.status.message}
          </span>
        )}
      </div>

      {/* For Message Box */}
      {failedMsg.length > 0 && (
        <div
          className={`
            w-full h-10 rounded 
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
          disabled={isCreatingUnit}
          className="bg-blue-300 border-2 disabled:opacity-50 disabled:cursor-not-allowed w-full border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          {isCreatingUnit ? (
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
            "Save"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddUnitForm;
