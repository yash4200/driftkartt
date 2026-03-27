import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Success() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { shop, product, qty, total, name } = state || {};

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-6 animate-bounce">🎉</div>
      <h2 className="text-4xl font-extrabold mb-3">Order Placed!</h2>
      <p className="text-gray-400 mb-8">Hey {name || "there"}, your order is confirmed.</p>

      <div className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-6 w-full max-w-sm text-left mb-8">
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Product</span>
          <span className="font-semibold capitalize">{product}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Shop</span>
          <span className="font-semibold">{shop?.shop}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-gray-400">Quantity</span>
          <span className="font-semibold">{qty}</span>
        </div>
        <div className="border-t border-[#2a2a3a] pt-3 flex justify-between">
          <span className="text-gray-400">Total Paid</span>
          <span className="text-green-400 font-extrabold text-xl">₹{total}</span>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-6">The shop will confirm your order shortly 📦</p>

      <button onClick={() => navigate("/")}
        className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-2xl font-bold transition">
        Back to Home
      </button>
    </div>
  );
}