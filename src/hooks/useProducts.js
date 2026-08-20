import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../api/products";

export default function useProducts(filters = {}) {
  const { category, search } = filters;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return getProducts({ category, search })
      .then((res) => {
        const list = Array.isArray(res) 
          ? res 
          : res?.products || res?.data || [];
        setProducts(list);
      })
      .catch((err) => {
        setError(err.message);
        setProducts([]);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { products, loading, error, refetch };
}