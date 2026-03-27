import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) navigate(`/results?q=${query}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">🛒</div>
        <h1 className="font-extrabold text-4xl tracking-tight">DriftKart</h1>
      </div>

      <p className="text-gray-400 text-lg mb-2 text-center">Compare prices from local shops near you</p>
      <p className="text-gray-600 text-sm mb-10 text-center">Stop overpaying. Support your local दुकानदार.</p>

      {/* Search Bar */}
      <div className="w-full max-w-xl flex gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Search products near you..."
          className="flex-1 bg-[#13131a] border border-[#2a2a3a] rounded-xl px-5 py-4 text-white placeholder-gray-500 outline-none focus:border-orange-500 transition"
        />
        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-400 text-white px-6 py-4 rounded-xl font-semibold transition"
        >
          Search
        </button>
      </div>

      {/* Popular Searches */}
      <div className="flex gap-2 mt-6 flex-wrap justify-center">
        {["Rice", "Milk", "Sugar", "Oil", "Atta"].map(item => (
          <button
            key={item}
            onClick={() => { setQuery(item); navigate(`/results?q=${item}`); }}
            className="bg-[#1a1a24] border border-[#2a2a3a] text-gray-400 text-sm px-4 py-2 rounded-full hover:border-orange-500 hover:text-orange-400 transition"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-12 mt-20 text-center">
        {[["200+", "Local Shops"], ["₹150", "Avg Savings/Week"], ["3s", "Price Comparison"]].map(([num, label]) => (
          <div key={label}>
            <div className="text-orange-500 text-3xl font-extrabold">{num}</div>
            <div className="text-gray-500 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}