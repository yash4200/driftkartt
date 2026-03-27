import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const mockData = {
  rice:  [{ shop: "Sharma General Store", dist: "0.3 km", price: 85, rating: 4.8 }, { shop: "Ravi Kirana", dist: "0.6 km", price: 92, rating: 4.5 }, { shop: "Gupta Mart", dist: "1.2 km", price: 98, rating: 4.3 }],
  milk:  [{ shop: "Bansal Dairy", dist: "0.2 km", price: 28, rating: 4.9 }, { shop: "Ravi Kirana", dist: "0.6 km", price: 30, rating: 4.5 }, { shop: "Sharma Store", dist: "0.8 km", price: 32, rating: 4.7 }],
  sugar: [{ shop: "Gupta Mart", dist: "0.4 km", price: 44, rating: 4.3 }, { shop: "Sharma Store", dist: "0.7 km", price: 47, rating: 4.8 }, { shop: "Ravi Kirana", dist: "1.0 km", price: 50, rating: 4.5 }],
  oil:   [{ shop: "Ravi Kirana", dist: "0.6 km", price: 128, rating: 4.5 }, { shop: "Bansal Mart", dist: "0.9 km", price: 135, rating: 4.2 }, { shop: "Gupta Mart", dist: "1.2 km", price: 142, rating: 4.3 }],
  atta:  [{ shop: "Sharma Store", dist: "0.3 km", price: 55, rating: 4.8 }, { shop: "Ravi Kirana", dist: "0.6 km", price: 60, rating: 4.5 }, { shop: "Gupta Mart", dist: "1.1 km", price: 65, rating: 4.3 }],
};

export default function Results() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";
  const key = query.toLowerCase();
  const results = mockData[key] || mockData["rice"];
  const cheapest = Math.min(...results.map(r => r.price));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition text-xl">←</button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm">🛒</div>
          <span className="font-bold text-xl">DriftKart</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-1">Results for</p>
      <h2 className="text-3xl font-extrabold mb-2 capitalize">{query}</h2>
      <p className="text-gray-500 text-sm mb-8">📍 Kolkata · {results.length} shops found nearby</p>

      {/* Results */}
      <div className="flex flex-col gap-4">
        {results.map((r, i) => (
          <div
            key={i}
            className={`bg-[#13131a] border rounded-2xl p-5 flex items-center justify-between transition hover:-translate-y-1 cursor-pointer
              ${r.price === cheapest ? "border-green-500 bg-green-950/20" : "border-[#2a2a3a] hover:border-orange-500"}`}
            onClick={() => navigate("/checkout", { state: { shop: r, product: query } })}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{r.shop}</span>
                {r.price === cheapest && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-semibold">✓ Best Price</span>
                )}
              </div>
              <div className="text-gray-500 text-sm mt-1">📍 {r.dist} · ⭐ {r.rating}</div>
            </div>
            <div className={`text-3xl font-extrabold ${r.price === cheapest ? "text-green-400" : "text-white"}`}>
              ₹{r.price}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-600 text-xs mt-10">Prices updated in real-time from local shops</p>
    </div>
  );
}