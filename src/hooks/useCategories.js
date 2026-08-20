import { useEffect, useState, useCallback } from "react";
import { getCategories } from "../api/categories";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return getCategories()
      .then((res) => {
        // Extrae el array sin importar la envoltura que devuelva Express
        const list = Array.isArray(res) 
          ? res 
          : res?.categories || res?.data || [];
        setCategories(list);
      })
      .catch((err) => {
        setError(err.message);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { categories, loading, error, refetch };
}