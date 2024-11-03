import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig } from "axios";

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(url, {});
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, error, loading };
}

export default useFetch;
