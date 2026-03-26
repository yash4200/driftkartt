import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/results?q=${search}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🛒 DriftKart</h1>
      <p>Compare prices from nearby shops</p>

      <input
        type="text"
        placeholder="Search product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", width: "200px" }}
      />

      <br /><br />

      <button onClick={handleSearch} style={{ padding: "10px" }}>
        Search
      </button>
    </div>
  );
}

export default Home;