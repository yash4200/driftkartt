import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShopRegister() {
  const [form, setForm] = useState({ name: "", owner: "", phone: "", address: "", password: "" });
  const navigate = useNavigate();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = () => {
    if (Object.values(form).some(v => !v)) return alert("Please fill all fields");
    localStorage.setItem("shopkeeper", JSON.stringify({ shop: form.name, phone: form.phone, owner: form.owner }));
    navigate("/shop/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">🏪</div>
        <h1 className="font-extrabold text-3xl tracking-tight">DriftKart <span className="text-orange-500">for Shops</span></h1>
      </div>

      <div className="w-full max-w-sm bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-8 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-2">Register Your Shop</h2>

        {[
          ["Shop Name", "name", "e.g. Sharma General Store"],
          ["Owner Name", "owner", "Your full name"],
          ["Phone Number", "phone", "10-digit number"],
          ["Shop Address", "address", "Full address"],
          ["Password", "password", "Create a password"],
        ].map(([label, key, placeholder]) => (
          <div key={key}>
            <label className="text-gray-400 text-xs mb-1 block">{label}</label>
            <input
              type={key === "password" ? "password" : "text"}
              value={form[key]}
              onChange={e => update(key, e.target.value)}
              placeholder={placeholder}
              className="w-full bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition"
            />
          </div>
        ))}

        <button
          onClick={handleRegister}
          className="bg-orange-500 hover:bg-orange-400 text-white py-3 rounded-xl font-bold transition mt-2"
        >
          Register & Go Live →
        </button>

        <p className="text-gray-500 text-sm text-center">
          Already registered?{" "}
          <span onClick={() => navigate("/shop/login")} className="text-orange-400 cursor-pointer hover:underline">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}