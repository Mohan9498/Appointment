import { useEffect } from "react";

function SEO({ title, description, keywords }) {
  useEffect(() => {
    // Update Title
    const defaultTitle = "Tiny Todds Therapy Care";
    document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description || "Professional therapy programs for communication, confidence, and development.");
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      metaDescription.content = description || "Professional therapy programs for communication, confidence, and development.";
      document.head.appendChild(metaDescription);
    }

    // Update Meta Keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute("content", keywords);
      } else {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        metaKeywords.content = keywords;
        document.head.appendChild(metaKeywords);
      }
    }

    return () => {
      // Optional: reset on unmount if needed, but typically keeping last page's SEO is fine until next mounts
    };
  }, [title, description, keywords]);

  return null;
}

export default SEO;
