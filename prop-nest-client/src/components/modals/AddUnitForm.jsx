import { useForm, useFieldArray } from "react-hook-form";
import useAdminContext from "../../hooks/Admin/useAdminContext";
import { useEffect, useState } from "react";

const AddUnitForm = ({ onCloseButtonClick, defaultValues = {}, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    control,
    watch, 
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      ...defaultValues,
      items: defaultValues.items || []
    },
  });

  const { fields: items, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  useEffect(() => {
    reset({
      ...defaultValues,
      items: defaultValues.items || []
    });
  }, [defaultValues, reset]);

  const { 
    units,
    CreateUnit,
    UpdateUnit, 
    setUnits, 
    isCreatingUnit, 
    properties 
  } = useAdminContext();

  const [isFailed, setIsFailed] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");

  // Status options
  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "occupied", label: "Occupied" },
    { value: "maintenance", label: "Maintenance" },
  ];

  const billTypeOptions = [
    { value: "electricity", label: "Electricity" },
    { value: "gas", label: "Gas" },
    { value: "water", label: "Water" },
    { value: "others", label: "Others" },
  ];

  // Watch the entire bills array to check selections across rows
  const watchedBills = watch("items") || [];

  const onSubmit = async (data) => {
    console.log("From Unit Form -> \n", data);
    let res;
    
    try {
      if(isEdit) {
        res = await UpdateUnit(data);
      } else {
        res = await CreateUnit(data);
      }

      if (res.response != null) {
        if(isEdit) {
          setUnits((prev) => prev.map((u) => 
            u.id === defaultValues.id ? res.response : u
          ));
        } else {
          setUnits((prev) => [...prev, res.response]);
        }

        console.log(res.response);
        setFailedMsg(res.message);
        setIsFailed(false);
        setTimeout(() => onCloseButtonClick(), 1000);
      } else {
        setIsFailed(true);
        setFailedMsg(res.message);
      }
    } catch (error) {
      console.log(error);
      setIsFailed(true);
      setFailedMsg("Something Went Wrong!!");
    }
  };

  return (
    <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
      {/* Property & Unit Name Fields */}
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            { isEdit ? "Property" : "* Property"}
          </label>
          <select
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer appearance-none"
            {...register("property_id", { required: "* This Field is Required" })}
            defaultValue=""
            style={{ color: '#000000' }}
            disabled={isEdit}
          >
            <option value="" disabled className="text-black">
              Select Property
            </option>
            {properties.map((property) => (
              <option key={property.id} value={property.id} className="text-black">
                {property.house_name}
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

      {/* Rent & Status Fields */}
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

      {/* Additional Bills Section */}
      {!isEdit && (
        <div className="border-t-2 border-black pt-4">
          {items.map((field, index) => {
            // Get the value for the current row
            const currentBillType = watchedBills[index]?.type;
            
            // Get types selected in OTHER rows
            const otherSelectedTypes = watchedBills
              .filter((_, i) => i !== index)
              .map(b => b?.type)
              .filter(Boolean);

            // Filter available options based on requirements
            const availableOptions = billTypeOptions.filter(opt => {
              // "others" can be selected multiple times
              if (opt.value === "others") return true;
              
              // For electricity, gas, water: only show if not already selected in other rows
              return !otherSelectedTypes.includes(opt.value);
            });

            return (
              <div key={field.id} className="mb-4 p-4 bg-gray-50 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 bg-red-400 border-2 border-black rounded w-6 h-6 flex items-center justify-center text-black font-bold hover:bg-red-500 transition-all shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1"
                  title="Remove Bill"
                >
                  ×
                </button>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-black mb-1">
                      * Bill Type
                    </label>
                    <select
                      className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer appearance-none"
                      {...register(`items.${index}.type`, { required: "Required" })}
                      style={{ color: '#000000' }}
                    >
                      <option value="" disabled className="text-black">
                        Select Bill Type
                      </option>
                      {availableOptions.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-black">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.type && (
                      <span className="text-red-500 text-sm font-semibold mt-1 block">
                        {errors.items[index].type.message}
                      </span>
                    )}
                  </div>

                  {/* Electricity Fields */}
                  {currentBillType === "electricity" && (
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">
                        * Current Reading
                      </label>
                      <input
                        type="text"
                        placeholder="Enter current reading"
                        className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                        {...register(`items.${index}.current_reading`, { required: "* This Field is Required" })}
                      />
                      {errors.items?.[index]?.current_reading && (
                        <span className="text-red-500 text-sm font-semibold mt-1 block">
                          {errors.items[index].current_reading.message}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Gas or Water Fields */}
                  {(currentBillType === "gas" || currentBillType === "water") && (
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">
                        * Bill Amount
                      </label>
                      <input
                        type="number"
                        placeholder="Enter bill amount"
                        className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                        {...register(`items.${index}.bill_amount`, { required: "* This Field is Required" })}
                      />
                      {errors.items?.[index]?.bill_amount && (
                        <span className="text-red-500 text-sm font-semibold mt-1 block">
                          {errors.items[index].bill_amount.message}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Others Fields */}
                  {currentBillType === "others" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-bold text-black mb-1">
                          * Note (Bill Name)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Internet Bill"
                          className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                          {...register(`items.${index}.note`, { required: "* This Field is Required" })}
                        />
                        {errors.items?.[index]?.note && (
                          <span className="text-red-500 text-sm font-semibold mt-1 block">
                            {errors.items[index].note.message}
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-1">
                          * Total Amount
                        </label>
                        <input
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
                          {...register(`items.${index}.total_amount`, { required: "* This Field is Required" })}
                        />
                        {errors.items?.[index]?.total_amount && (
                          <span className="text-red-500 text-sm font-semibold mt-1 block">
                            {errors.items[index].total_amount.message}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Always show button to allow adding multiple "Others" bills */}
          <button
            type="button"
            onClick={() => append({ type: "", current_reading: "", bill_amount: "", note: "", total_amount: "" })}
            className="w-full bg-yellow-300 border-2 border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1 mb-4"
          >
            + Add Others Bills
          </button>
        </div>
      )}

      {/* For Message Box */}
      {failedMsg.length > 0 && (
        <div className={`w-full h-10 rounded border-2 border-black ${isFailed ? "bg-red-300" : "bg-green-300"} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.8)] text-base font-semibold text-gray-800 flex items-center justify-center transition-all`}>
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
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

export default AddUnitForm;
