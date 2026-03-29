import { useEffect, useState } from "react";
import authApiClient from "../../services/auth-api-client";

const useAdmin = () => {
  const [properties, setProperties] = useState([]);
  
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
  }, []);


  // Property Creation Part

  const [isCreatingProperty, setIsCreatingProperty] = useState(false);  // For Loading Animation

  const CreateProperty = async(data) => {
    setIsCreatingProperty(true);

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

  return {
    properties,

    CreateProperty,
    setProperties,
    isCreatingProperty,
  };
};



export default useAdmin;
