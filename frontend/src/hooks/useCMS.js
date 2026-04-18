// hooks/useCMS.js
import { useEffect, useState } from "react";
import API from "../services/api";

export default function useCMS(page) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    API.get("content/")
      .then(res => setContent(res.data))
      .catch(() => setContent([]));
  }, []);

  const getSection = (section) => {
    return content.find(
      (c) => c.page === page && c.section === section
    );
  };

  return { content, getSection };
}