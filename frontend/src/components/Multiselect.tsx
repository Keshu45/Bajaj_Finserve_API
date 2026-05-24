import { useState, useRef, useEffect } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import type { FilterOption } from "../types";

interface MultiselectProps {
  options: FilterOption[];
  selectedOptions: FilterOption[];
  onChange: (options: FilterOption[]) => void;
}

export function Multiselect({ options, selectedOptions, onChange }: MultiselectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (option: FilterOption) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="flex min-h-[48px] w-full cursor-pointer flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOptions.length === 0 ? (
          <div className="flex-grow min-w-[50px] flex items-center text-slate-400 text-xs px-2 italic">
            Add more filters...
          </div>
        ) : (
          <>
            {selectedOptions.map((opt) => (
              <span
                key={opt}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {opt}
                <button
                  type="button"
                  className="hover:text-blue-900 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(opt);
                  }}
                >
                  <span className="sr-only">Remove filter</span>
                  &times;
                </button>
              </span>
            ))}
            <div className="flex-grow min-w-[20px] flex items-center text-slate-300 text-xs px-1 italic">
              ...
            </div>
          </>
        )}
        <div className="ml-auto pr-2">
          <ChevronDown
            className={cn("h-4 w-4 text-slate-400 transition-transform", isOpen && "rotate-180")}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-slate-200 focus:outline-none">
          {options.map((option) => (
            <div
              key={option}
              className={cn(
                "relative cursor-pointer select-none py-2.5 pl-10 pr-4 transition-colors",
                selectedOptions.includes(option) ? "bg-slate-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
              )}
              onClick={() => toggleOption(option)}
            >
              {selectedOptions.includes(option) ? (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              ) : null}
              <span
                className={cn(
                  "block truncate",
                  selectedOptions.includes(option) ? "font-semibold" : "font-normal"
                )}
              >
                {option}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
