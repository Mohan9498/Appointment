import { useEffect, useState } from "react";
import API from "../services/api";

export default function useCms(page) {
  const [content, setContent] = useState([]);

  useEffect(() => {
    API.get(`content/?page=${page}`)
      .then(res => setContent(res.data))
      .catch(err => console.log(err));
  }, [page]);

  const get = (section) =>
    content.find((c) => c.section === section);

  return { content, get };
}