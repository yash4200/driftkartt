import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const context = useContext(CartContext);
  const navigate = useNavigate();

  if (!context) {
    return <h2>Error: Cart not found</h2>;
  }

 