import { useEffect, useState } from "react";
import API from "../services/api";

export default function useCMS(page) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const fetchCMS = async () => {
      try {
        setLoading(true);

        const res = await API.get(`content/?page=${page}`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.results || res.data?.data || [];

        if (alive) {
          setContent(data);
        }
      } catch (err) {
        console.error("CMS FETCH ERROR:", err.response?.data || err);
        if (alive) {
          setContent([]);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    fetchCMS();

    return () => {
      alive = false;
    };
  }, [page]);

  const getSection = (section) => {
    return content.find(
      (c) =>
        c.page === page &&
        c.section === section &&
        (c.data || c.title || c.description)
    ) || null;
  };

  return { content, getSection, loading };
}