import { Calendar, X } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAdminContext from '../../hooks/Admin/useAdminContext';

const AddNewElectricityUnitForm = ({closeModal, selectedReading}) => {
  const [isFailed, setIsFailed] = useState(false);
  const [failedMsg, setFailedMsg] = useState("");

  const { 
    properties, 
    units, 
    electricityReadings, 
    setElectricityReadings,
    CreateElectricityReading, 
    setIsLoading 
  } = useAdminContext();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      previous_reading: '',
      current_reading: ''
    }
  });

  const onSubmit = async (data) => {
    if (!selectedReading) return;

    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;

    const currentReading = Number(data.current_reading);

    try {
      setFailedMsg("");
      setIsFailed(false);

      // ✅ CASE 1: FIRST TIME (no previous reading)
      if (selectedReading.reading_value === '-') {
        
        const previousReading = Number(data.previous_reading);

        // 👉 calculate previous month
        let prevMonth = month - 1;
        let prevYear = year;

        if (prevMonth === 0) {
          prevMonth = 12;
          prevYear = year - 1;
        }

        const prevPayload = {
          unit_id: selectedReading.unit_id,
          reading_value: previousReading,
          year: prevYear,
          month: prevMonth
        };

        // 🔥 FIRST API CALL (previous reading)
        const prevRes = await CreateElectricityReading(prevPayload);

        if (!prevRes?.response) {
          setIsFailed(true);
          setFailedMsg(prevRes.message);
          return;
        }

        // 🔥 SECOND API CALL (current reading)
        const currentPayload = {
          unit_id: selectedReading.unit_id,
          reading_value: currentReading,
          year: year,
          month: month
        };

        const currRes = await CreateElectricityReading(currentPayload);

        if (!currRes?.response) {
          setIsFailed(true);
          setFailedMsg(currRes.message);
          return;
        }

        // ✅ update state
        setElectricityReadings(prev => [
          ...(Array.isArray(prev) ? prev : []),
          prevRes.response,
          currRes.response
        ]);

        setFailedMsg("Both readings added successfully!");
        setTimeout(() => closeModal(), 1000);

      } 
      // ✅ CASE 2: NORMAL FLOW
      else {
        const prev = selectedReading.reading_value;

        if (currentReading < prev) {
          alert("New reading cannot be less than previous reading!");
          return;
        }

        const payload = {
          unit_id: selectedReading.unit_id,
          reading_value: currentReading,
          year: year,
          month: month
        };

        const res = await CreateElectricityReading(payload);

        if (!res?.response) {
          setIsFailed(true);
          setFailedMsg(res.message);
        } else {
          setElectricityReadings(prev => [
            ...(Array.isArray(prev) ? prev : []),
            prevRes.response,
            currRes.response
          ]);
        }
      }

    } catch (error) {
      console.error("Error:", error);
      setIsFailed(true);
      setFailedMsg("Something went wrong");
    } finally {
      setTimeout(() => closeModal(), 2000);
    }
  };

  const getFormattedDate = () => {
    const now = new Date();
    return now.toLocaleString('default', { month: 'long', year: 'numeric' });
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <div className="relative bg-gray-200 border-2 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md flex flex-col">
        <div className="bg-gray-200 border-b-2 border-black p-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-xl font-bold text-black">Add New Reading</h3>
          <button onClick={closeModal} className="bg-white border-2 border-black rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
            <X className="w-5 h-5 text-black" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Unit</span>
            <span className="text-lg font-bold text-black">{selectedReading.unit_name}</span>
          </div>
          
          <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">Previous Reading</span>
            <span className="text-lg font-bold text-black">
              {selectedReading.reading_value === '-' ? 'N/A (First Reading)' : `${selectedReading.reading_value} Units`}
            </span>
          </div>

          {
            // TODO 
            selectedReading.reading_value === '-' && 
            <div>
              <label className="block text-sm font-bold text-black mb-1">* Add Previous Unit</label>
              <input
                type="number"
                step="any"
                placeholder="Enter Previous meter reading"
                {...register('previous_reading', { 
                  required: 'Reading value is required',
                  min: { value: 0, message: 'Reading cannot be negative' }
                })}
                className={`w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  errors.previous_reading ? 'border-red-500' : ''
                }`}
              />
              {errors.previous_reading && (
                <span className="text-red-600 text-xs font-bold mt-1">{errors.previous_reading.message}</span>
              )}
            </div>
          }

          <div className="p-3 bg-white border-2 border-black rounded-lg flex justify-between items-center opacity-75">
            <span className="text-sm font-bold text-gray-600 flex items-center gap-2"><Calendar className="w-4 h-4" /> Reading Date</span>
            <span className="text-lg font-bold text-black">{getFormattedDate()}</span>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-1">* New Current Reading</label>
            <input
              type="number"
              step="any"
              placeholder="Enter new meter reading"
              {...register('current_reading', { 
                required: 'Reading value is required',
                min: { value: 0, message: 'Reading cannot be negative' }
              })}
              className={`w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                errors.current_reading ? 'border-red-500' : ''
              }`}
            />
            {errors.current_reading && (
              <span className="text-red-600 text-xs font-bold mt-1">{errors.current_reading.message}</span>
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

          <div className="flex items-center justify-end space-x-3 pt-4 border-t-2 border-black mt-6">
            <button type="button" onClick={closeModal} className="bg-white border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">Cancel</button>
            <button 
              type="submit"
              disabled={setIsLoading}
              className="bg-green-400 border-2 border-black rounded-lg px-4 py-2 font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {setIsLoading ? 
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
                : 
                  'Save Reading'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewElectricityUnitForm;