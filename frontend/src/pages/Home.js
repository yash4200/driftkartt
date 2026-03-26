import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/results?query=${search}`);
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
        style={{
          padding: "12px",
          width: "300px",
          borderRadius: "10px",
          border: "1px solid gray"
        }}
      />

      <br /><br />

      <button
        onClick={handleSearch}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          backgroundColor: "black",
          color: "white",
          border: "none"
        }}
      >
        Search
      </button>
    </div>
  );
}

export default Home;