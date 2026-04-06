import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";
import useAuthContext from "../Auth/useAuthContext";

const useAdmin = () => {
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);

  const {authToken} = useAuthContext();
  
  useEffect(() => {
    (async() => {
      try {

        const res = await authApiClient.get("/properties");
        console.log(res.data);
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
        console.log(res.data);
        setUnits(res.data);
      
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

  return {
    properties,
    CreateProperty,
    UpdateProperty,
    setProperties,
    isCreatingProperty,

    units,
    CreateUnit,
    setUnits,
    isCreatingUnit
  };
};



export default useAdmin;
