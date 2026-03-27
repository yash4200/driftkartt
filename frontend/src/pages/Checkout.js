import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const shop = state?.shop || { shop: "Sharma Store", price: 85, dist: "0.3 km", rating: 4.8 };
  const product = state?.product || "Rice";
  const total = shop.price * qty;

  const handleOrder = () => {
    if (!name || !phone || !address) return alert("Please fill all fields");
    navigate("/success", { state: { shop, product, qty, total, name } });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-4 py-10 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-xl">←</button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-sm">🛒</div>
          <span className="font-bold text-xl">DriftKart</span>
        </div>
      </div>

      <h2 className="text-3xl font-extrabold mb-6">Checkout</h2>

      {/* Order Summary */}
      <div className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-5 mb-6">
        <p className="text-gray-400 text-sm mb-3">Order Summary</p>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold capitalize">{product}</span>
          <span className="text-orange-400 font-bold">₹{shop.price}</span>
        </div>
        <div className="text-gray-500 text-sm mb-4">from {shop.shop} · {shop.dist}</div>

        {/* Quantity */}
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Qty:</span>
          <div className="flex items-center gap-3 bg-[#0a0a0f] rounded-xl px-4 py-2">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-orange-500 font-bold text-lg">−</button>
            <span className="font-bold w-4 text-center">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="text-orange-500 font-bold text-lg">+</button>
          </div>
        </div>

        <div className="border-t border-[#2a2a3a] mt-4 pt-4 flex justify-between">
          <span className="text-gray-400">Total</span>
          <span className="text-green-400 font-extrabold text-xl">₹{total}</span>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-5 mb-6 flex flex-col gap-4">
        <p className="text-gray-400 text-sm">Delivery Details</p>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name"
          className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number"
          className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition" />
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Delivery Address"
          className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition" />
      </div>

      <button onClick={handleOrder}
        className="w-full bg-orange-500 hover:bg-orange-400 text-white py-4 rounded-2xl font-bold text-lg transition">
        Place Order →
      </button>
    </div>
  );
}