import { useEffect, useState, useCallback } from "react";
import { getSections } from "../api/sections";

export default function useSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    return getSections()
      .then(setSections)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { sections, loading, error, refetch };
}
