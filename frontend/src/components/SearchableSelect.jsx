import { useState, useRef, useEffect } from "react";

function SearchableSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const filtered = options.filter((o) =>
    (o.label || o.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full">
      {/* INPUT (same look as your select) */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full py-2 px-3 border rounded-xl bg-white dark:bg-white/5 cursor-pointer text-sm flex justify-between items-center"
      >
        <span>
          {value
            ? options.find((o) => o.value === value)?.label ||
              options.find((o) => o.value === value)?.title
            : placeholder}
        </span>
        <span>⌄</span>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in">
          
          {/* SEARCH INPUT */}
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b outline-none text-sm bg-transparent"
          />

          {/* OPTIONS */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((item, i) => (
              <div
                key={i}
                onClick={() => {
                  onChange(item.value || item.title);
                  setOpen(false);
                }}
                className="px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer flex items-center gap-2"
              >
                {item.label && <span>{item.label}</span>}
                <span>{item.title || item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;