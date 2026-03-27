import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShopLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (phone && password) {
      localStorage.setItem("shopkeeper", JSON.stringify({ phone, shop: "Sharma General Store" }));
      navigate("/shop/dashboard");
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">🏪</div>
        <h1 className="font-extrabold text-3xl tracking-tight">DriftKart <span className="text-orange-500">for Shops</span></h1>
      </div>

      <div className="w-full max-w-sm bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-8 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Shopkeeper Login</h2>

        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition"
        />

        <button
          onClick={handleLogin}
          className="bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition mt-2"
        >
          Login →
        </button>

        <p className="text-gray-500 text-sm text-center">
          New shop?{" "}
          <span onClick={() => navigate("/shop/register")} className="text-orange-400 cursor-pointer hover:underline">
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}