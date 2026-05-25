import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Multiselect } from "./components/Multiselect";
import type { ApiResponse, FilterOption } from "./types";

const FILTER_OPTIONS: FilterOption[] = ["Numbers", "Alphabets", "Highest lowercase alphabet"];

export default function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterOption[]>([]);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const handleSubmit = async () => {
    setError(null);
    setResponse(null);

    // Validate JSON
    let parsedInput;
    try {
      parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        throw new Error('Input JSON must contain a "data" array.');
      }
    } catch (err: any) {
      setError(err.message || "Invalid JSON format. Please ensure keys and string values are enclosed in double quotes.");
      return;
    }

    setLoading(true);
    const start = performance.now();
    try {
      // Using VITE_API_URL if set, otherwise default to Render Backend URL (or localhost).
      const API_URL = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL 
        : (window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://bajaj-finserve-api-fbma.onrender.com');
      
      const res = await fetch(`${API_URL}/bfhl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedInput),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResponse(data);
      setLastRequestTime(Math.round(performance.now() - start));
    } catch (err: any) {
      setError(err.message || "Failed to call the API. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderFilteredResponse = () => {
    if (!response || selectedFilters.length === 0) return null;

    return (
      <div className="flex-grow border border-dashed border-slate-200 rounded-xl p-4 overflow-auto">
        <div className="space-y-6">
          {selectedFilters.includes("Numbers") && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase">Numbers Found</h3>
              <div className="flex flex-wrap gap-2">
                {response.numbers.length > 0 ? (
                  response.numbers.map((n, i) => (
                    <span key={i} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-mono text-sm border border-slate-200">
                      {n}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">None found</span>
                )}
              </div>
            </div>
          )}

          {selectedFilters.includes("Alphabets") && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase">Alphabets Found</h3>
              <div className="flex flex-wrap gap-2">
                {response.alphabets.length > 0 ? (
                  response.alphabets.map((a, i) => (
                    <span key={i} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-mono text-sm border border-slate-200 text-blue-600">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">None found</span>
                )}
              </div>
            </div>
          )}

          {selectedFilters.includes("Highest lowercase alphabet") && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase">Highest Lowercase</h3>
              <div className="flex flex-wrap gap-2">
                {response.highest_lowercase_alphabet.length > 0 ? (
                  response.highest_lowercase_alphabet.map((h, i) => (
                    <span key={i} className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-mono text-sm border border-slate-200 font-bold">
                      {h}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400 italic">None found</span>
                )}
              </div>
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span>Primes: <b className={`uppercase font-mono ${response.is_prime_found ? 'text-green-600' : 'text-slate-500'}`}>{response.is_prime_found ? 'Found' : 'Not Found'}</b></span>
            {(response.file_valid || response.file_mime_type) && (
              <div className="flex gap-4">
                {response.file_valid && (
                  <span className="flex items-center text-green-600">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                    File Valid
                  </span>
                )}
                {response.file_mime_type && (
                  <span>MIME: <span className="font-mono text-slate-500">{response.file_mime_type}</span></span>
                )}
                {response.file_size_kb && (
                  <span>Size: {response.file_size_kb} KB</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50 font-sans text-slate-900">
      {/* Top Navigation Bar */}
      <nav className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">B</div>
          <span className="text-sm sm:text-lg font-semibold tracking-tight text-slate-700 truncate max-w-[200px] sm:max-w-none">Bajaj Finserv Dev Challenge</span>
        </div>
        <div className="flex items-center gap-4 hidden sm:flex">
          <div className="rounded border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-xs text-slate-500 hover:bg-slate-200 transition-colors cursor-default">
            0827CI231060
          </div>
          <div className="h-8 w-8 shrink-0 rounded-full border border-slate-300 bg-slate-200"></div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col gap-6 p-4 sm:gap-8 sm:p-8 lg:flex-row">
        {/* Left Panel: Input & Controls */}
        <section className="flex w-full flex-col gap-4 sm:gap-6 lg:w-1/2">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">API Input</h2>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">POST REQUEST</span>
            </div>
            
            <div className="relative">
              <textarea
                className="h-48 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='{ "data": ["A", "C", "1", "3", "z"] }'
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                disabled={loading}
              />
              <div className="absolute bottom-3 right-3 font-mono text-[10px] text-slate-400">JSON Format</div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Invalid Input</h3>
                  <p className="mt-1 text-xs text-red-700">{error}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !jsonInput.trim()}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Submit Request"}
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
            <h2 className="mb-3 sm:mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Instructions</h2>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">1</span>
                Enter raw data as a JSON array of characters and numbers.
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">2</span>
                Click Submit to process the backend logic (primes, alphabets).
              </li>
              <li className="flex gap-2 sm:gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">3</span>
                Filter the response using the multi-select dropdown.
              </li>
            </ul>
          </div>
        </section>

        {/* Right Panel: Response & Filters */}
        <section className="flex w-full flex-col gap-4 sm:gap-6 lg:w-1/2">
          {response ? (
            <div className="flex flex-grow flex-col rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm overflow-hidden">
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">API Response</h2>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 text-[10px] sm:text-xs font-medium text-green-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span> 200 OK
                  </span>
                  <span className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[10px] sm:text-xs text-slate-400">{lastRequestTime}ms</span>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <label className="mb-2 block text-[10px] sm:text-xs font-medium uppercase text-slate-400">Multi-Filter Response</label>
                <Multiselect
                  options={FILTER_OPTIONS}
                  selectedOptions={selectedFilters}
                  onChange={setSelectedFilters}
                />
              </div>

              {renderFilteredResponse()}
            </div>
          ) : (
            <div className="flex flex-grow flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-slate-400 min-h-[200px]">
              <div className="text-sm uppercase tracking-wider font-medium">No Data</div>
              <div className="text-xs mt-2 text-slate-400 text-center max-w-xs">Submit a valid request to view the response.</div>
            </div>
          )}
        </section>
      </main>

      {/* Footer Bar */}
      <footer className="mt-auto flex h-10 shrink-0 items-center justify-center border-t border-slate-200 bg-white px-4 sm:px-8">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">Built by Keshav Patidar</span>
      </footer>
    </div>
  );
}
