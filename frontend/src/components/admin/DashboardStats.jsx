import React, { useEffect, useState } from "react";

export default function DashboardStats() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      } else {
        setError(data.message || "Failed to fetch stats");
      }
    } catch (err) {
      setError("Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div style={{color: 'var(--admin-text-muted)'}}>Loading dashboard...</div>;
  if (error) return <div style={{color: 'var(--admin-danger)'}}>{error}</div>;

  return (
    <div className="admin-stats-grid">
      <div className="admin-stat-card">
        <span className="admin-stat-title">Total Users</span>
        <h3 className="admin-stat-value">{stats.totalUsers}</h3>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-title">Total Products</span>
        <h3 className="admin-stat-value">{stats.totalProducts}</h3>
      </div>
      <div className="admin-stat-card">
        <span className="admin-stat-title">Orders</span>
        <h3 className="admin-stat-value">{stats.totalOrders}</h3>
      </div>
    </div>
  );
}
