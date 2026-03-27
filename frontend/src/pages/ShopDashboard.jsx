import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const initialProducts = [
  { id: 1, name: "Basmati Rice", price: 85, stock: 50, category: "Grocery" },
  { id: 2, name: "Amul Milk 500ml", price: 28, stock: 30, category: "Dairy" },
  { id: 3, name: "Sugar 1kg", price: 44, stock: 20, category: "Grocery" },
];

const mockOrders = [
  { id: "#001", product: "Rice", qty: 2, total: 170, customer: "Rahul", status: "Pending" },
  { id: "#002", product: "Milk", qty: 3, total: 84, customer: "Priya", status: "Delivered" },
  { id: "#003", product: "Sugar", qty: 1, total: 44, customer: "Amit", status: "Pending" },
];

export default function ShopDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", category: "" });
  const [shop, setShop] = useState({ shop: "Your Shop" });

  useEffect(() => {
    const data = localStorage.getItem("shopkeeper");
    if (!data) navigate("/shop/login");
    else setShop(JSON.parse(data));
  }, []);

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price) return alert("Fill name and price");
    setProducts(p => [...p, { id: Date.now(), ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) }]);
    setNewProduct({ name: "", price: "", stock: "", category: "" });
    setShowAdd(false);
  };

  const deleteProduct = (id) => setProducts(p => p.filter(p => p.id !== id));

  const toggleOrder = (id) => setOrders(o => o.map(order =>
    order.id === id ? { ...order, status: order.status === "Pending" ? "Delivered" : "Pending" } : order
  ));

  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const totalRevenue = orders.filter(o => o.status === "Delivered").reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Nav */}
      <div className="bg-[#13131a] border-b border-[#2a2a3a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">🏪</div>
          <div>
            <div className="font-bold text-lg">{shop.shop}</div>
            <div className="text-gray-500 text-xs">Shopkeeper Dashboard</div>
          </div>
        </div>
        <button
          onClick={() => { localStorage.removeItem("shopkeeper"); navigate("/shop/login"); }}
          className="text-gray-500 hover:text-red-400 text-sm transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-6">
        {["overview", "products", "orders"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition
              ${tab === t ? "bg-orange-500 text-white" : "bg-[#13131a] text-gray-400 hover:text-white border border-[#2a2a3a]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 max-w-3xl">

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <h2 className="text-2xl font-extrabold mb-6">Overview</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                ["📦", "Total Products", products.length, ""],
                ["🕐", "Pending Orders", pendingOrders, "text-orange-400"],
                ["💰", "Revenue", `₹${totalRevenue}`, "text-green-400"],
              ].map(([icon, label, val, color]) => (
                <div key={label} className="bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-5">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className={`text-2xl font-extrabold ${color}`}>{val}</div>
                  <div className="text-gray-500 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
            <div className="flex flex-col gap-3">
              {orders.slice(0, 3).map(o => (
                <div key={o.id} className="bg-[#13131a] border border-[#2a2a3a] rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{o.product}</span>
                    <span className="text-gray-500 text-sm ml-2">by {o.customer}</span>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold
                    ${o.status === "Pending" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold">My Products</h2>
              <button onClick={() => setShowAdd(!showAdd)}
                className="bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-xl text-sm font-semibold transition">
                + Add Product
              </button>
            </div>

            {showAdd && (
              <div className="bg-[#13131a] border border-orange-500/30 rounded-2xl p-5 mb-6 flex flex-col gap-3">
                <h3 className="font-bold">New Product</h3>
                {[["Product Name", "name"], ["Price (₹)", "price"], ["Stock (qty)", "stock"], ["Category", "category"]].map(([ph, key]) => (
                  <input key={key} placeholder={ph} value={newProduct[key]}
                    onChange={e => setNewProduct(p => ({ ...p, [key]: e.target.value }))}
                    className="bg-[#0a0a0f] border border-[#2a2a3a] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500 transition"
                  />
                ))}
                <div className="flex gap-3">
                  <button onClick={addProduct} className="flex-1 bg-orange-500 hover:bg-orange-400 text-white py-2 rounded-xl font-semibold transition">Add</button>
                  <button onClick={() => setShowAdd(false)} className="flex-1 bg-[#0a0a0f] border border-[#2a2a3a] text-gray-400 py-2 rounded-xl transition">Cancel</button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {products.map(p => (
                <div key={p.id} className="bg-[#13131a] border border-[#2a2a3a] rounded-xl p-4 flex items-center justify-between hover:border-orange-500/50 transition">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-gray-500 text-sm">{p.category} · Stock: {p.stock}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-orange-400 font-bold text-lg">₹{p.price}</span>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-400 hover:text-red-300 text-sm transition">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div>
            <h2 className="text-2xl font-extrabold mb-6">Orders</h2>
            <div className="flex flex-col gap-3">
              {orders.map(o => (
                <div key={o.id} className="bg-[#13131a] border border-[#2a2a3a] rounded-xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-bold">{o.id}</span>
                      <span className="text-gray-500 text-sm ml-2">{o.product} × {o.qty}</span>
                    </div>
                    <span className="text-green-400 font-bold">₹{o.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Customer: {o.customer}</span>
                    <button onClick={() => toggleOrder(o.id)}
                      className={`text-xs px-4 py-1.5 rounded-full font-semibold transition cursor-pointer
                        ${o.status === "Pending" ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/40" : "bg-green-500/20 text-green-400 hover:bg-green-500/40"}`}>
                      {o.status} {o.status === "Pending" ? "→ Mark Delivered" : "✓"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}