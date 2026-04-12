import { useForm } from "react-hook-form";
import useAdminContext from "../../hooks/Admin/useAdminContext";
import { useEffect, useState } from "react";

const AddRenterForm = ({ onCloseButtonClick, defaultValues = {}, isEdit = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const {
    properties,
    renters,
    CreateRenter,
    UpdateRenter,
    setRenters,
    isLoading,
    units
  } = useAdminContext();

  const [editUnit, setEditUnit] = useState({});
  const [editProperty, setEditProperty] = useState({});

  useEffect(() => {
  if (isEdit && units?.length && properties?.length) {
    const foundUnit = units.find((unit) => unit.id === defaultValues.unit_id);

    if (foundUnit) {
      setEditUnit(foundUnit);

      const foundProperty = properties.find(
        (property) => property.id === foundUnit.property_id
      );

      if (foundProperty) {
        setEditProperty(foundProperty);
        setSelectedProperty(foundProperty.id);
        setValue("property_id", String(foundProperty.id));
        setValue("unit_id", String(foundUnit.id));
      }
    }
  }
}, [isEdit, defaultValues, units, properties]);

  const [selectedProperty, setSelectedProperty] = useState();
  const [isFailed, setIsFailed] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");

  const statusOptions = [
    { value: "active", label: "active" },
    { value: "left", label: "left" }
  ];

  const onSubmit = async (data) => {
    let res;
    try {
      if (isEdit) {
        res = await UpdateRenter(data);
        console.log(data);
      } else {
        res = await CreateRenter(data);
      }

      if (res.response != null) {
        if (isEdit) {
          setRenters((prev) => prev.map((r) =>
            r.id === defaultValues.id ? res.response : r
          ));
        } else {
          setRenters((prev) => [...prev, res.response]);
        }

        setFailedMsg(res.message || (isEdit ? "Renter updated successfully" : "Renter added successfully"));
        setIsFailed(false);
        setTimeout(() => onCloseButtonClick(), 1000);
      } else {
        setIsFailed(true);
        setFailedMsg(res.message || "Failed to save");
      }
    } catch (error) {
      console.log(error);
      setIsFailed(true);
      setFailedMsg("Something Went Wrong!!");
    }
  };

  return (
    <form className="flex gap-4 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-bold text-black mb-1">
            * Full Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
            {...register("full_name", { required: "* This Field is Required" })}
          />
          {errors.full_name && (
            <span className="text-red-500 text-sm font-semibold mt-1 block">
              {errors.full_name.message}
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              * Phone
            </label>
            <input
              type="text"
              placeholder="0 1XXX-XXXXXX"
              className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
              {...register("phone_number", { required: "* This Field is Required" })}
            />
            {errors.phone_number && (
              <span className="text-red-500 text-sm font-semibold mt-1 block">
                {errors.phone_number.message}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              * NID
            </label>
            <input
              type="text"
              placeholder="1234567890"
              className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all"
              {...register("nid_number", { required: "* This Field is Required" })}
            />
            {errors.nid_number && (
              <span className="text-red-500 text-sm font-semibold mt-1 block">
                {errors.nid_number.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer"
              {...register("date_of_birth")}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              Status
            </label>
            <select
              className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer appearance-none"
              {...register("status", { required: "* This Field is Required" })}
              style={{ color: '#000000' }}
              defaultValue={"active"}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-black">
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <span className="text-red-500 text-sm font-semibold mt-1 block">
                {errors.status.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">
              * Property
            </label>
            <select
              className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer appearance-none"
              {...register("property_id", {required:"* This Field is required"})}
              onChange={(e) => {
                const propertyId = e.target.value;
                setSelectedProperty(Number(propertyId));
              }}
              defaultValue={""}
              style={{ color: '#000000' }}
            >
              <option value="" disabled className="text-black">
                Select Property
              </option>
              {properties?.map((property) => (
                <option key={property.id} className="text-black" value={property.id}>
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
              * Assigned Unit
            </label>
            <select
              className="w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all cursor-pointer appearance-none"
              {...register("unit_id", {required:"* This Field is required"})}
              defaultValue={""}
              style={{ color: '#000000' }}
            >
              <option value="" disabled className="text-black">
                Select Unit
              </option>
              {
                units
                  ?.filter((unit) =>
                    unit.property_id === selectedProperty &&
                    (unit.status === "available" || unit.id === editUnit.id)
                  )
                  .map((unit) => (
                    <option key={unit.id} value={unit.id} className="text-black">
                      {unit.unit_name}
                    </option>
                  ))
              }
            </select>
            {errors.unit_id && (
              <span className="text-red-500 text-sm font-semibold mt-1 block">
                {errors.unit_id.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-black mb-1">
            Documents <span className="text-red-500">* Coming Soon...</span>
          </label>
          <input
            disabled={true}
            type="file"
            multiple
            className="w-full bg-white opacity-30 border-2 border-black rounded-lg py-2 px-3 text-sm text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-2 file:border-black file:bg-gray-200 file:text-black file:font-bold hover:file:bg-gray-300 file:cursor-pointer"
          />
        </div>
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
          disabled={isLoading}
          className="bg-blue-300 border-2 disabled:opacity-50 disabled:cursor-not-allowed w-full border-black rounded-lg px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:shadow-none active:translate-x-1 active:translate-y-1"
        >
          {isLoading ? (
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

export default AddRenterForm;
