import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../Auth/useAuthContext";

const useAdmin = () => {
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [renters, setRenters] = useState([]);
  const [electricityReadings, setElectricityReadings] = useState([]);
  const [rentInvoice, setRentInvoice] = useState([]);

  const [refreshUnits, setRefreshUnits] = useState(0);

  const {authToken} = useAuthContext();
  
  useEffect(() => {
    (async() => {
      try {

        const res = await authApiClient.get("/properties");
        // console.log(res.data);
        setProperties(res.data);

      } catch (error) {

        console.log(error);

      }
    })();
  }, [authToken]);

  useEffect(() => {
    (async() => {
      try {

        const res = await authApiClient.get("/units");
        // console.log(res.data);
        setUnits(res.data);
      
      } catch (error) {

        console.log(error);

      }
    })();
  }, [authToken, refreshUnits, renters]);
  
  useEffect(() => {
    (async() => {
      try {

        const res = await authApiClient.get("/renter");
        // console.log(res.data);
        setRenters(res.data);
      
      } catch (error) {

        console.log(error);

      }
    })();
  }, [authToken]);
  
  useEffect(() => {
    (async() => {
      try {

        const res = await authApiClient.get("/electricity");
        // console.log(res.data);
        setElectricityReadings(res.data);
      
      } catch (error) {

        console.log(error);

      }
    })();
  }, [authToken]);
  
  useEffect(() => {
    (async() => {
      try {

        const res = await authApiClient.get("/rent-invoices");
        console.log(res.data);
        setRentInvoice(res.data);
      
      } catch (error) {

        console.log(error);

      }
    })();
  }, [authToken]);

  

  // ________________________ For Property __________________________________ 

  const [isCreatingProperty, setIsCreatingProperty] = useState(false);  // For Loading Animation

  const CreateProperty = async(data) => {
    setIsCreatingProperty(true);

    try {
      const res = await authApiClient.post("/properties", {
        house_name: data.house_name,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        number_of_floors: Number(data.number_of_floors),
        total_units: Number(data.total_units),
        base_rent: Number(data.base_rent),
        description: data.description
      });

      setRefreshUnits(prev => prev + 1);

      return {
        response: res.data,
        message: "Property Created Successfully"
      }
    } catch (error) {
      console.log(error);

      return {
        response: null,
        message: "Something Went Wrong!"
      }
    } finally {
      setIsCreatingProperty(false);
    }
  }

  const UpdateProperty = async(data) => {
    setIsCreatingProperty(true);

    try {
      const res = await authApiClient.put("/properties", {
        id: data.id,
        house_name: data.house_name,
        address: data.address,
        city: data.city,
        postal_code: data.postal_code,
        number_of_floors: Number(data.number_of_floors),
        total_units: Number(data.total_units),
        base_rent: Number(data.base_rent)
      })

      console.log(res.data);
      return {
        response: res.data,
        message: "Property Updated Successfully"
      }
    } catch (error) {
      console.log(error);
      return {
        response: null,
        message: "Something Went Wrong!"
      }
    } finally {
      setIsCreatingProperty(false);
    }
  }

  const [isDeleting, setIsDeleting] = useState(false);
  const DeleteProperty = async(data) => {
    setIsDeleting(true);

    try {
      const res = await authApiClient.delete("/properties", {
        data: { id: Number(data) }
      });

      if(res.status === 200 || res.status === 204) {
        return {
          success: true,
          message: "Property Deleted Successfully"
        }
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Something Went Wrong!!"
      }
    } finally {
      setIsDeleting(false);
    }
  }
    

  // ____________________ For Unit _________________________


  const [isCreatingUnit, setIsCreatingUnit] = useState(false);  // For Loading Animation
  const CreateUnit = async(data) => {
    setIsCreatingUnit(true);

    try {
      const res = await authApiClient.post("/units", {
        property_id: Number(data.property_id),
        unit_name: data.unit_name,
        rent_amount: Number(data.rent_amount),
        status: data.status
      })
      console.log(res.data);

      return {
        response: res.data,
        message: "Unit Created Successfully"
      }
    } catch (error) {
      console.log(error);

      return {
        response: null,
        message: "Something Want Wrong!!!"
      }
    } finally {
      setIsCreatingUnit(false);
    }
  }

  const UpdateUnit = async(data) => {
    setIsCreatingUnit(true);

    try {
      const res = await authApiClient.put("/units", {
        property_id: Number(data.property_id),
        id: Number(data.id),
        unit_name: data.unit_name,
        rent_amount: Number(data.rent_amount),
        status: data.status,
      });
      console.log(res.data);
      console.log("-> ", units);

      return {
        response: res.data,
        message: "Unit Updated Successfully"
      }
    } catch (error) {
      console.log(error);
      return {
        response: null,
        message: "Something Went Wrong!"
      }
    } finally {
      setIsCreatingUnit(false);
    }
  }

  const DeleteUnit = async(data) => {
    setIsDeleting(true);

    try {
      const res = await authApiClient.delete("/units", {
        data: { id: Number(data) }
      });

      if(res.status === 200 || res.status === 204) {
        return {
          success: true,
          message: "Unit Deleted Successfully"
        }
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Something Went Wrong!!"
      }
    } finally {
      setIsDeleting(false);
    }
  }

  const [isLoading, setIsLoading] = useState(false);



  // _____________________ For Renters ____________________

  const CreateRenter = async(data) => {
    setIsLoading(true);
    console.log(data);

    try {
      const res = await authApiClient.post("/renter", {
        unit_id: Number(data.unit_id),
        full_name: data.full_name,
        phone_number: data.phone_number,
        nid_number: data.nid_number,
        status: data.status,
        date_of_birth: data.date_of_birth
      });

      console.log(res.data);
      return {
        response: res.data,
        message: "Renter Created Successfully",
      }
    } catch (error) {
      console.log(error);
      return {
        response: null,
        message: "Something Went Wrong!!",
      }
    } finally {
      setIsLoading(false);
    }
  }

  const UpdateRenter = async(data) => {
    setIsLoading(true);
    console.log(data);

    try {
      const res = await authApiClient.put("/renter", {
        id: Number(data.id),
        unit_id: Number(data.unit_id),
        full_name: data.full_name,
        phone_number: data.phone_number,
        nid_number: data.nid_number,
        date_of_birth: data.date_of_birth,
        status: data.status
      })
      console.log(res.data);
      return {
        response: res.data,
        message: "Renter Updated Successfully"
      }
    } catch (error) {
      console.log(error);
      return {
        response: null,
        message: "Something Went Wrong!!"
      }
    } finally {
      setIsLoading(false);
    }
  }

  const DeleteRenter = async(data) => {
    setIsDeleting(true);

    try {
      const res = authApiClient.delete("/renter", {
        data: {id: Number(data)}
      });

      console.log(res.data);

      return {
        success: true,
        message: "Renter Deleted Successfully"
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Something Went Wrong!!"
      }
    } finally {
      setIsDeleting(false);
    }
  }


  //______________________ For Electricity _________________

  const CreateElectricityReading = async(data) => {
    setIsLoading(true);

    try {
      const res = await authApiClient.post("/electricity", {
        unit_id: data.unit_id,
        year: data.year,
        month: data.month,
        reading_value: data.reading_value
      });

      return {
        response: res.data,
        message: "Unit Created Successfully"
      }
    } catch (error) {
      console.log(error);
      return {
        response: null,
        message: "Is unit already added this month?"
      }
    } finally {
      setIsLoading(false);
    }
  }


  // _____________________ For Rent Invoices ___________________

  const CreateRentInvoicesForALlUnits = async() => {
    setIsLoading(true);

    try {
      const res = await authApiClient.post("/rent-invoices", {
        scope: "all",
        items: []
      });
      
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const CreateRentInvoice = async(payload) => {
    setIsLoading(true);

    try {
      const res = await authApiClient.post("/rent-invoices", payload);
      
      console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    properties,
    CreateProperty,
    UpdateProperty,
    DeleteProperty,
    setProperties,
    isCreatingProperty,

    units,
    CreateUnit,
    UpdateUnit,
    DeleteUnit,
    setUnits,
    isCreatingUnit,

    renters,
    setRenters,
    CreateRenter,
    UpdateRenter,
    DeleteRenter,
    isLoading,

    electricityReadings,
    CreateElectricityReading,
    setElectricityReadings,

    CreateRentInvoicesForALlUnits,
    CreateRentInvoice,
    rentInvoice,
    setRentInvoice,

    isDeleting,
  };
};



export default useAdmin;
