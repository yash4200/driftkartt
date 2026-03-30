import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Shopkeeper.css";

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
    <div className="shop-wrapper shop-auth-container">
      <div className="shop-logo-header">
        <div className="shop-icon-box">🏪</div>
        <h1 className="shop-logo-text">DriftKart <span className="shop-logo-highlight">for Shops</span></h1>
      </div>

      <div className="shop-auth-card">
        <h2 className="shop-auth-title">Register Your Shop</h2>

        <div style={{display:'flex', flexDirection:'column', gap:'var(--space-4)'}}>
          {[
            ["Shop Name", "name", "e.g. Sharma General Store"],
            ["Owner Name", "owner", "Your full name"],
            ["Phone Number", "phone", "10-digit number"],
            ["Shop Address", "address", "Full address"],
            ["Password", "password", "Create a password"],
          ].map(([label, key, placeholder]) => (
            <div className="shop-input-wrapper" key={key}>
              <label className="shop-input-label">{label}</label>
              <input
                type={key === "password" ? "password" : "text"}
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                placeholder={placeholder}
                className="shop-input"
              />
            </div>
          ))}
        </div>

        <button onClick={handleRegister} className="shop-btn-primary">
          Register & Go Live &rarr;
        </button>

        <p className="shop-auth-footer">
          Already registered?{" "}
          <span onClick={() => navigate("/shop/login")} className="shop-auth-link">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}